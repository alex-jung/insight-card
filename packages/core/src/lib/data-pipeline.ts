/**
 * Data pipeline for InsightChart cards.
 *
 * Two data paths:
 *   - History API  — raw state changes, used for time windows up to 72 h
 *   - Statistics API — pre-aggregated data, used for longer windows
 *
 * Results are cached with a 30-second TTL and optionally downsampled with the
 * Largest Triangle Three Buckets (LTTB) algorithm.
 */

import type {
  HomeAssistant,
  HassHistoryEntry,
  HassStatisticsEntry,
  HassStatisticsPeriod,
  InsightEntityConfig,
} from "../types/index.js";

// ---------------------------------------------------------------------------
// Public data types
// ---------------------------------------------------------------------------

/** Minimal time-series data point. Timestamp is Unix milliseconds. */
export interface DataPoint {
  /** Unix timestamp in milliseconds */
  t: number;
  /** Numeric value */
  v: number;
}

/** All data for one entity, ready to render */
export interface EntityDataSet {
  entityId: string;
  friendlyName: string;
  unit: string;
  data: DataPoint[];
}

// ---------------------------------------------------------------------------
// Internal cache
// ---------------------------------------------------------------------------

interface CacheEntry {
  dataset: EntityDataSet;
  /** Unix ms when the entry was stored */
  timestamp: number;
}

const CACHE_TTL_MS = 30_000;
const cache = new Map<string, CacheEntry>();

function cacheKey(entityId: string, hours: number): string {
  return `${entityId}:${hours}`;
}

function fromCache(entityId: string, hours: number): EntityDataSet | null {
  const entry = cache.get(cacheKey(entityId, hours));
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(cacheKey(entityId, hours));
    return null;
  }
  return entry.dataset;
}

function toCache(entityId: string, hours: number, dataset: EntityDataSet): void {
  cache.set(cacheKey(entityId, hours), { dataset, timestamp: Date.now() });
}

/** Invalidate the cache for a specific entity, or flush everything. */
export function invalidateCache(entityId?: string): void {
  if (entityId === undefined) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(`${entityId}:`)) {
      cache.delete(key);
    }
  }
}

// ---------------------------------------------------------------------------
// History API helpers
// ---------------------------------------------------------------------------

async function fetchHistory(
  hass: HomeAssistant,
  entityId: string,
  startTime: Date,
  endTime: Date,
): Promise<DataPoint[]> {
  // HA returns either Array[][] (old) or Record<entityId, Entry[]> (new ≥ 2022.10)
  type HistoryResponseArray = HassHistoryEntry[][];
  type HistoryResponseDict = Record<string, HassHistoryEntry[]>;

  console.debug("[InsightChart] history request", { entityId, startTime, endTime });

  const response = await hass.callWS<HistoryResponseArray | HistoryResponseDict>({
    type: "history/history_during_period",
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    entity_ids: [entityId],
    minimal_response: true,
    significant_changes_only: false,
  });

  const isArray = Array.isArray(response);
  const responseKeys = !isArray ? Object.keys(response as object) : [];
  console.debug("[InsightChart] history response", { entityId, isArray, responseKeys, firstEntry: !isArray ? (response as HistoryResponseDict)[responseKeys[0]]?.[0] : (response as HistoryResponseArray)[0]?.[0] });

  let entries: HassHistoryEntry[];
  if (isArray) {
    entries = (response as HistoryResponseArray)[0] ?? [];
  } else {
    // Try exact match first, then case-insensitive fallback
    const dict = response as HistoryResponseDict;
    entries = dict[entityId] ?? dict[entityId.toLowerCase()] ?? [];
  }

  const points: DataPoint[] = [];
  for (const entry of entries) {
    // Support both legacy (state/last_changed) and minimal (s/lc/lu) formats
    const stateStr = entry.s ?? entry.state ?? "";
    const v = parseFloat(stateStr);
    if (!isFinite(v)) continue;
    let t: number;
    if (entry.lc !== undefined) {
      t = entry.lc * 1000;
    } else if (entry.lu !== undefined) {
      t = entry.lu * 1000;
    } else {
      t = new Date(entry.last_changed ?? entry.last_updated ?? "").getTime();
    }
    if (!isFinite(t)) continue;
    points.push({ t, v });
  }
  console.debug("[InsightChart] history parsed", { entityId, points: points.length });
  return points;
}

// ---------------------------------------------------------------------------
// Statistics API helpers
// ---------------------------------------------------------------------------

function choosePeriod(hours: number): HassStatisticsPeriod {
  if (hours <= 24) return "5minute";
  if (hours <= 168) return "hour";
  if (hours <= 720) return "day";
  return "week";
}

async function fetchStatistics(
  hass: HomeAssistant,
  entityId: string,
  startTime: Date,
  endTime: Date,
  period: HassStatisticsPeriod,
): Promise<DataPoint[]> {
  type StatisticsResponse = Record<string, HassStatisticsEntry[]>;

  const response = await hass.callWS<StatisticsResponse>({
    type: "recorder/statistics_during_period",
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    statistic_ids: [entityId],
    period,
    types: ["mean", "state"],
  });

  const entries: HassStatisticsEntry[] = response[entityId] ?? [];

  const points: DataPoint[] = [];
  for (const entry of entries) {
    const v = entry.mean ?? entry.state;
    if (v == null || !isFinite(v)) continue;
    points.push({ t: new Date(entry.start).getTime(), v });
  }
  return points;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const HISTORY_THRESHOLD_HOURS = 72;

/**
 * Fetch data for a single entity. Uses History API for windows ≤ 72 h,
 * Statistics API for longer windows.
 *
 * The result is cached for 30 seconds.
 */
export async function getEntityData(
  hass: HomeAssistant,
  entityConfig: InsightEntityConfig | string,
  hours: number,
): Promise<EntityDataSet> {
  const cfg: InsightEntityConfig =
    typeof entityConfig === "string" ? { entity: entityConfig } : entityConfig;

  const entityId = cfg.entity;

  const cached = fromCache(entityId, hours);
  if (cached) return cached;

  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - hours * 3_600_000);

  const hassEntity = hass.states[entityId];
  const friendlyName =
    hassEntity?.attributes.friendly_name ?? entityId;
  const unit = hassEntity?.attributes.unit_of_measurement ?? "";

  let rawPoints: DataPoint[];

  if (cfg.statistics || hours > HISTORY_THRESHOLD_HOURS) {
    const period = cfg.statistics ?? choosePeriod(hours);
    rawPoints = await fetchStatistics(hass, entityId, startTime, endTime, period);
  } else {
    rawPoints = await fetchHistory(hass, entityId, startTime, endTime);
  }

  // Apply optional transforms
  const data = applyTransform(rawPoints, cfg.transform ?? "none");

  const dataset: EntityDataSet = { entityId, friendlyName, unit, data };
  toCache(entityId, hours, dataset);
  return dataset;
}

/**
 * Fetch data for multiple entities in parallel.
 */
export async function getMultiEntityData(
  hass: HomeAssistant,
  entities: (InsightEntityConfig | string)[],
  hours: number,
): Promise<EntityDataSet[]> {
  return Promise.all(entities.map((e) => getEntityData(hass, e, hours)));
}

// ---------------------------------------------------------------------------
// Value transforms
// ---------------------------------------------------------------------------

function applyTransform(
  data: DataPoint[],
  transform: InsightEntityConfig["transform"],
): DataPoint[] {
  if (!transform || transform === "none" || data.length === 0) return data;

  if (transform === "diff") {
    const out: DataPoint[] = [];
    for (let i = 1; i < data.length; i++) {
      out.push({ t: data[i].t, v: data[i].v - data[i - 1].v });
    }
    return out;
  }

  if (transform === "cumulative") {
    let sum = 0;
    return data.map((p) => ({ t: p.t, v: (sum += p.v) }));
  }

  if (transform === "normalize") {
    const min = Math.min(...data.map((p) => p.v));
    const max = Math.max(...data.map((p) => p.v));
    const range = max - min;
    if (range === 0) return data.map((p) => ({ ...p, v: 0 }));
    return data.map((p) => ({ t: p.t, v: (p.v - min) / range }));
  }

  return data;
}

// ---------------------------------------------------------------------------
// LTTB downsampling
// ---------------------------------------------------------------------------

/**
 * Largest Triangle Three Buckets (LTTB) downsampling.
 *
 * Retains the visual shape of a time-series while reducing the number of
 * points to `targetPoints`. The first and last points are always kept.
 *
 * Reference: Sveinn Steinarsson, "Downsampling Time Series for Visual
 * Representation" (2013).
 */
export function downsample(data: DataPoint[], targetPoints: number): DataPoint[] {
  const len = data.length;
  if (targetPoints <= 0 || len <= targetPoints) return data;
  if (targetPoints === 2) return [data[0], data[len - 1]];

  const sampled: DataPoint[] = [];
  // Always keep the first point
  sampled.push(data[0]);

  // Number of buckets between first and last point
  const bucketCount = targetPoints - 2;
  const bucketSize = (len - 2) / bucketCount;

  let prevSelectedIndex = 0;

  for (let i = 0; i < bucketCount; i++) {
    // Current bucket range
    const bucketStart = Math.floor((i + 1) * bucketSize) + 1;
    const bucketEnd = Math.min(Math.floor((i + 2) * bucketSize) + 1, len - 1);

    // Compute the average point of the NEXT bucket (used as the "C" vertex)
    const nextBucketStart = bucketEnd;
    const nextBucketEnd = Math.min(
      Math.floor((i + 3) * bucketSize) + 1,
      len - 1,
    );
    let avgT = 0;
    let avgV = 0;
    let nextBucketLen = 0;
    for (let j = nextBucketStart; j < nextBucketEnd; j++) {
      avgT += data[j].t;
      avgV += data[j].v;
      nextBucketLen++;
    }
    if (nextBucketLen > 0) {
      avgT /= nextBucketLen;
      avgV /= nextBucketLen;
    } else {
      avgT = data[len - 1].t;
      avgV = data[len - 1].v;
    }

    // Point A is the previously selected point
    const aT = data[prevSelectedIndex].t;
    const aV = data[prevSelectedIndex].v;

    // Find the point in the current bucket that forms the largest triangle
    let maxArea = -1;
    let maxIndex = bucketStart;
    for (let j = bucketStart; j < bucketEnd; j++) {
      const bT = data[j].t;
      const bV = data[j].v;
      // Triangle area (× 2, sign doesn't matter)
      const area = Math.abs(
        (aT - avgT) * (bV - aV) - (aT - bT) * (avgV - aV),
      );
      if (area > maxArea) {
        maxArea = area;
        maxIndex = j;
      }
    }

    sampled.push(data[maxIndex]);
    prevSelectedIndex = maxIndex;
  }

  // Always keep the last point
  sampled.push(data[len - 1]);
  return sampled;
}
