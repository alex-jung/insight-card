/**
 * InsightChart utility functions.
 *
 * Covers: value/time formatting, colour helpers, statistics, responsive
 * breakpoints, and general-purpose utilities.
 */

// ---------------------------------------------------------------------------
// Default colour palette
// ---------------------------------------------------------------------------

export const DEFAULT_COLORS: readonly string[] = [
  "#FF6B4A",
  "#4AAFFF",
  "#6BDB6B",
  "#B07AFF",
  "#FFD166",
  "#06D6A0",
  "#EF476F",
  "#118AB2",
];

// ---------------------------------------------------------------------------
// Colour utilities
// ---------------------------------------------------------------------------

/**
 * Convert a hex colour string to an rgba() CSS value.
 *
 * Supports 3-digit (#RGB) and 6-digit (#RRGGBB) hex strings.
 */
export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace(/^#/, "");
  let r: number, g: number, b: number;

  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.slice(0, 2), 16);
    g = parseInt(clean.slice(2, 4), 16);
    b = parseInt(clean.slice(4, 6), 16);
  } else {
    // Fallback: return opaque black
    return `rgba(0,0,0,${alpha})`;
  }

  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${r},${g},${b},${a})`;
}

/**
 * Generate `count` distinct colours from an optional palette.
 * Cycles through the palette if count > palette length.
 */
export function generateColors(
  count: number,
  palette: readonly string[] = DEFAULT_COLORS,
): string[] {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(palette[i % palette.length]);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Value formatting
// ---------------------------------------------------------------------------

/**
 * Format a numeric value for display.
 *
 * @param value   - The number to format
 * @param unit    - Optional unit string appended after a space
 * @param decimals - Number of decimal places (default: auto — 0 for integers, 1 for floats)
 */
export function formatValue(
  value: number,
  unit?: string,
  decimals?: number,
): string {
  if (!isFinite(value)) return "—";

  let formatted: string;
  if (decimals !== undefined) {
    formatted = value.toFixed(decimals);
  } else {
    // Auto: use 1 decimal unless the value is a whole number
    formatted = Number.isInteger(value) ? value.toString() : value.toFixed(1);
  }

  return unit ? `${formatted} ${unit}` : formatted;
}

// ---------------------------------------------------------------------------
// Time / date formatting
// ---------------------------------------------------------------------------

/**
 * Format a Unix millisecond timestamp as "HH:MM" (24-hour local time).
 * Example output: "14:30"
 */
export function formatTime(ts: number): string {
  const d = new Date(ts);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Format a Unix millisecond timestamp as "DD.MM" (local date).
 * Example output: "19.03"
 */
export function formatDate(ts: number): string {
  const d = new Date(ts);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${day}.${month}`;
}

/**
 * Format a Unix millisecond timestamp as "DD.MM HH:MM".
 * Example output: "19.03 14:30"
 */
export function formatDateTime(ts: number): string {
  return `${formatDate(ts)} ${formatTime(ts)}`;
}

/**
 * Format a duration given in hours to a human-readable string.
 *
 * - < 24 h  → "Xh"
 * - < 168 h → "Xd"
 * - else    → "Xw"
 *
 * Examples: 24 → "24h", 72 → "3d", 168 → "1w"
 */
export function formatDuration(hours: number): string {
  if (hours < 24) return `${hours}h`;
  if (hours < 168) return `${Math.round(hours / 24)}d`;
  return `${Math.round(hours / 168)}w`;
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

export interface Stats {
  min: number;
  max: number;
  mean: number;
  current: number;
  trend: "up" | "down" | "stable";
}

/**
 * Compute basic statistics for an array of numeric values.
 * "current" is the last value. "trend" compares the last 20 % of values to
 * the first 20 % using a simple mean comparison.
 */
export function computeStats(values: number[]): Stats {
  if (values.length === 0) {
    return { min: 0, max: 0, mean: 0, current: 0, trend: "stable" };
  }

  let min = Infinity;
  let max = -Infinity;
  let sum = 0;

  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
    sum += v;
  }

  const mean = sum / values.length;
  const current = values[values.length - 1];

  // Trend: compare first vs last quintile averages
  let trend: Stats["trend"] = "stable";
  if (values.length >= 5) {
    const slice = Math.max(1, Math.floor(values.length * 0.2));
    const firstMean =
      values.slice(0, slice).reduce((a, b) => a + b, 0) / slice;
    const lastMean =
      values.slice(-slice).reduce((a, b) => a + b, 0) / slice;
    const delta = lastMean - firstMean;
    const threshold = (max - min) * 0.05; // 5 % of range
    if (delta > threshold) trend = "up";
    else if (delta < -threshold) trend = "down";
  }

  return { min, max, mean, current, trend };
}

// ---------------------------------------------------------------------------
// Responsive helpers
// ---------------------------------------------------------------------------

/**
 * Classify a card width into a named breakpoint.
 *
 * - < 300 px  → "compact"
 * - < 600 px  → "default"
 * - ≥ 600 px  → "wide"
 */
export function getBreakpoint(width: number): "compact" | "default" | "wide" {
  if (width < 300) return "compact";
  if (width < 600) return "default";
  return "wide";
}


// ---------------------------------------------------------------------------
// Card picker helpers
// ---------------------------------------------------------------------------

/**
 * Pick the first sensor entity from the HA entity lists that has a numeric
 * state and a unit of measurement. Falls back to the first entity found, or
 * to `fallback` if the lists are empty.
 *
 * `entities` and `entitiesFallback` are the lists supplied by HA to
 * `getStubConfig(hass, entities, entitiesFallback)`.
 */
export function findNumericSensor(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hass: any,
  entities: string[],
  entitiesFallback: string[],
  fallback = "sensor.example",
): string {
  const candidates = [...entities, ...entitiesFallback].filter((e) =>
    e.startsWith("sensor."),
  );
  const numeric = candidates.find((e) => {
    const state = hass?.states?.[e];
    return state && !isNaN(Number(state.state)) && state.attributes?.unit_of_measurement;
  });
  return numeric ?? candidates[0] ?? fallback;
}

// ---------------------------------------------------------------------------
// Time-series aggregation
// ---------------------------------------------------------------------------

/**
 * Parse a period string to milliseconds.
 * Supports: "30m", "1h", "6h", "1d", "1w"
 * Returns NaN for unknown formats.
 */
export function parsePeriod(s: string): number {
  const m = s.match(/^(\d+(?:\.\d+)?)(m|h|d|w)$/);
  if (!m) return NaN;
  const n = parseFloat(m[1]);
  switch (m[2]) {
    case "m": return n * 60_000;
    case "h": return n * 3_600_000;
    case "d": return n * 86_400_000;
    case "w": return n * 604_800_000;
    default:  return NaN;
  }
}

/**
 * Aggregate a sorted DataPoint array into fixed-size time buckets.
 *
 * Each bucket starts at a multiple of `periodMs` aligned to epoch.
 * The representative timestamp is the bucket midpoint.
 * Empty buckets are skipped.
 */
export function aggregateTimeSeries(
  data: { t: number; v: number }[],
  periodMs: number,
  method: "mean" | "min" | "max" | "sum" | "last",
): { t: number; v: number }[] {
  if (data.length === 0 || periodMs <= 0) return data;

  const buckets = new Map<number, number[]>();
  for (const { t, v } of data) {
    const key = Math.floor(t / periodMs) * periodMs;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(v);
    else buckets.set(key, [v]);
  }

  const result: { t: number; v: number }[] = [];
  for (const [key, values] of buckets) {
    let v: number;
    switch (method) {
      case "mean": v = values.reduce((a, b) => a + b, 0) / values.length; break;
      case "min":  v = values.reduce((a, b) => (b < a ? b : a)); break;
      case "max":  v = values.reduce((a, b) => (b > a ? b : a)); break;
      case "sum":  v = values.reduce((a, b) => a + b, 0); break;
      case "last": v = values[values.length - 1]; break;
    }
    result.push({ t: key + periodMs / 2, v });
  }

  return result.sort((a, b) => a.t - b.t);
}

// ---------------------------------------------------------------------------
// Value transformation
// ---------------------------------------------------------------------------

/**
 * Apply a named transformation to a DataPoint array.
 *
 * - `none`       — passthrough
 * - `diff`       — replace each value with the delta to its predecessor
 *                  (first point is dropped)
 * - `normalize`  — scale values to [0, 1] based on dataset min/max
 * - `cumulative` — replace each value with the running sum
 */
export function applyTransform(
  data: { t: number; v: number }[],
  transform: "none" | "diff" | "normalize" | "cumulative",
): { t: number; v: number }[] {
  if (transform === "none" || data.length === 0) return data;

  switch (transform) {
    case "diff": {
      const result: { t: number; v: number }[] = [];
      for (let i = 1; i < data.length; i++) {
        result.push({ t: data[i].t, v: data[i].v - data[i - 1].v });
      }
      return result;
    }
    case "normalize": {
      const vals = data.map((p) => p.v);
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const range = max - min;
      if (range === 0) return data.map((p) => ({ t: p.t, v: 0 }));
      return data.map((p) => ({ t: p.t, v: (p.v - min) / range }));
    }
    case "cumulative": {
      let sum = 0;
      return data.map((p) => ({ t: p.t, v: (sum += p.v) }));
    }
  }
}

// ---------------------------------------------------------------------------
// General utilities
// ---------------------------------------------------------------------------

/**
 * Create a debounced version of `fn` that delays invocation by `ms`
 * milliseconds. Resets the timer on every call.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  ms: number,
): T {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return function (this: unknown, ...args: unknown[]) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  } as T;
}
