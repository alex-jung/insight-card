import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getEntityData,
  getMultiEntityData,
  invalidateCache,
  downsample,
  type DataPoint,
  type EntityDataSet,
} from "./data-pipeline.js";
import type { HomeAssistant } from "../types/index.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeHass(callWS: (msg: Record<string, unknown>) => unknown): HomeAssistant {
  return {
    states: {
      "sensor.temp": {
        entity_id: "sensor.temp",
        state: "21.5",
        attributes: { friendly_name: "Temperature", unit_of_measurement: "°C" },
        last_changed: "",
        last_updated: "",
      },
    },
    config: {} as HomeAssistant["config"],
    connection: {} as HomeAssistant["connection"],
    language: "en",
    locale: { language: "en", number_format: "", time_format: "", date_format: "", first_weekday: "" },
    themes: { default_theme: "", default_dark_theme: null, themes: {}, darkMode: false },
    callWS: vi.fn(callWS) as HomeAssistant["callWS"],
    callService: vi.fn(),
  };
}

/** Minimal History API response — new dict format (≥ 2022.10) */
function historyDictResponse(entityId: string, points: { lu: number; s: string }[]) {
  return { [entityId]: points.map((p) => ({ lu: p.lu, s: p.s })) };
}

/** History API response — legacy array format */
function historyArrayResponse(points: { last_updated: string; state: string }[]) {
  return [points];
}

/** Statistics API response */
function statsResponse(entityId: string, points: { start: string; mean: number }[]) {
  return { [entityId]: points.map((p) => ({ statistic_id: entityId, start: p.start, end: p.start, mean: p.mean })) };
}

// ---------------------------------------------------------------------------
// invalidateCache
// ---------------------------------------------------------------------------

describe("invalidateCache", () => {
  beforeEach(() => invalidateCache());

  it("clears all cache entries when called without argument", async () => {
    const hass = makeHass(() => historyDictResponse("sensor.temp", [{ lu: 1000, s: "21" }]));
    await getEntityData(hass, "sensor.temp", 24);
    expect(vi.mocked(hass.callWS)).toHaveBeenCalledOnce();

    invalidateCache();

    // Cache is empty — should call callWS again
    await getEntityData(hass, "sensor.temp", 24);
    expect(vi.mocked(hass.callWS)).toHaveBeenCalledTimes(2);
  });

  it("clears only entries for the given entity", async () => {
    const hass = makeHass((msg) => {
      const ids = (msg as { entity_ids?: string[] }).entity_ids;
      const id = ids?.[0] ?? "";
      return historyDictResponse(id, [{ lu: 1000, s: "5" }]);
    });
    await getEntityData(hass, "sensor.temp", 24);
    await getEntityData(hass, { entity: "sensor.other" }, 24);
    expect(vi.mocked(hass.callWS)).toHaveBeenCalledTimes(2);

    invalidateCache("sensor.temp");

    await getEntityData(hass, "sensor.temp", 24);   // refetched
    await getEntityData(hass, { entity: "sensor.other" }, 24); // from cache
    expect(vi.mocked(hass.callWS)).toHaveBeenCalledTimes(3);
  });
});

// ---------------------------------------------------------------------------
// getEntityData — cache behaviour
// ---------------------------------------------------------------------------

describe("getEntityData cache", () => {
  beforeEach(() => {
    invalidateCache();
    vi.useFakeTimers();
  });
  afterEach(() => { vi.useRealTimers(); });

  it("returns cached result on second call", async () => {
    const hass = makeHass(() =>
      historyDictResponse("sensor.temp", [{ lu: 1000, s: "21" }]),
    );
    await getEntityData(hass, "sensor.temp", 24);
    await getEntityData(hass, "sensor.temp", 24);
    expect(vi.mocked(hass.callWS)).toHaveBeenCalledOnce();
  });

  it("refetches after TTL expiry (30 s)", async () => {
    const hass = makeHass(() =>
      historyDictResponse("sensor.temp", [{ lu: 1000, s: "21" }]),
    );
    await getEntityData(hass, "sensor.temp", 24);
    vi.advanceTimersByTime(31_000);
    await getEntityData(hass, "sensor.temp", 24);
    expect(vi.mocked(hass.callWS)).toHaveBeenCalledTimes(2);
  });

  it("uses separate cache keys for different hours", async () => {
    const hass = makeHass(() =>
      historyDictResponse("sensor.temp", [{ lu: 1000, s: "21" }]),
    );
    await getEntityData(hass, "sensor.temp", 24);
    await getEntityData(hass, "sensor.temp", 48);
    expect(vi.mocked(hass.callWS)).toHaveBeenCalledTimes(2);
  });

  it("uses separate cache keys for different attributes", async () => {
    const hass = makeHass(() =>
      historyDictResponse("sensor.temp", [{ lu: 1000, s: "21" }]),
    );
    await getEntityData(hass, { entity: "sensor.temp", attribute: "current" }, 24);
    await getEntityData(hass, { entity: "sensor.temp", attribute: "target" }, 24);
    expect(vi.mocked(hass.callWS)).toHaveBeenCalledTimes(2);
  });
});

// ---------------------------------------------------------------------------
// getEntityData — History API parsing
// ---------------------------------------------------------------------------

describe("getEntityData — History API", () => {
  beforeEach(() => invalidateCache());

  it("parses minimal dict format (lu/s)", async () => {
    const hass = makeHass(() =>
      historyDictResponse("sensor.temp", [
        { lu: 1000, s: "21.5" },
        { lu: 2000, s: "22.0" },
      ]),
    );
    const ds = await getEntityData(hass, "sensor.temp", 24);
    expect(ds.data).toEqual([
      { t: 1_000_000, v: 21.5 },
      { t: 2_000_000, v: 22.0 },
    ]);
  });

  it("parses legacy array format (last_updated/state)", async () => {
    const hass = makeHass(() =>
      historyArrayResponse([
        { last_updated: "2024-01-01T00:00:00Z", state: "10" },
        { last_updated: "2024-01-01T01:00:00Z", state: "20" },
      ]),
    );
    const ds = await getEntityData(hass, "sensor.temp", 24);
    expect(ds.data).toHaveLength(2);
    expect(ds.data[0].v).toBe(10);
    expect(ds.data[1].v).toBe(20);
  });

  it("skips non-numeric state values", async () => {
    const hass = makeHass(() =>
      historyDictResponse("sensor.temp", [
        { lu: 1000, s: "unavailable" },
        { lu: 2000, s: "21.5" },
        { lu: 3000, s: "unknown" },
      ]),
    );
    const ds = await getEntityData(hass, "sensor.temp", 24);
    expect(ds.data).toHaveLength(1);
    expect(ds.data[0].v).toBe(21.5);
  });

  it("uses lc (last_changed) over lu when present", async () => {
    const hass = makeHass(() => ({
      "sensor.temp": [{ lc: 500, lu: 1000, s: "21" }],
    }));
    const ds = await getEntityData(hass, "sensor.temp", 24);
    expect(ds.data[0].t).toBe(500_000); // lc takes priority
  });

  it("reads attribute value when attribute is set", async () => {
    const hass = makeHass(() => ({
      "sensor.temp": [
        { lu: 1000, s: "21", a: { current_temperature: 21.5 } },
        { lu: 2000, s: "22", a: { current_temperature: 22.3 } },
      ],
    }));
    const ds = await getEntityData(hass, { entity: "sensor.temp", attribute: "current_temperature" }, 24);
    expect(ds.data).toEqual([
      { t: 1_000_000, v: 21.5 },
      { t: 2_000_000, v: 22.3 },
    ]);
  });

  it("sets unit from HA state attributes", async () => {
    const hass = makeHass(() =>
      historyDictResponse("sensor.temp", [{ lu: 1000, s: "21" }]),
    );
    const ds = await getEntityData(hass, "sensor.temp", 24);
    expect(ds.unit).toBe("°C");
  });

  it("sets unit to empty string when attribute is used", async () => {
    const hass = makeHass(() => ({
      "sensor.temp": [{ lu: 1000, a: { val: 5 } }],
    }));
    const ds = await getEntityData(hass, { entity: "sensor.temp", attribute: "val" }, 24);
    expect(ds.unit).toBe("");
  });

  it("uses friendly_name from HA states", async () => {
    const hass = makeHass(() =>
      historyDictResponse("sensor.temp", [{ lu: 1000, s: "21" }]),
    );
    const ds = await getEntityData(hass, "sensor.temp", 24);
    expect(ds.friendlyName).toBe("Temperature");
  });

  it("falls back to entity_id when friendly_name is absent", async () => {
    const hass = makeHass(() =>
      historyDictResponse("sensor.unknown", [{ lu: 1000, s: "5" }]),
    );
    const ds = await getEntityData(hass, "sensor.unknown", 24);
    expect(ds.friendlyName).toBe("sensor.unknown");
  });

  it("uses History API for hours <= 72", async () => {
    const hass = makeHass(() =>
      historyDictResponse("sensor.temp", [{ lu: 1000, s: "21" }]),
    );
    await getEntityData(hass, "sensor.temp", 72);
    const call = vi.mocked(hass.callWS).mock.calls[0][0];
    expect(call.type).toBe("history/history_during_period");
  });
});

// ---------------------------------------------------------------------------
// getEntityData — Statistics API
// ---------------------------------------------------------------------------

describe("getEntityData — Statistics API", () => {
  beforeEach(() => invalidateCache());

  it("uses Statistics API for hours > 72", async () => {
    const hass = makeHass(() => statsResponse("sensor.temp", []));
    await getEntityData(hass, "sensor.temp", 73);
    const call = vi.mocked(hass.callWS).mock.calls[0][0];
    expect(call.type).toBe("recorder/statistics_during_period");
  });

  it("uses Statistics API when cfg.statistics is set regardless of hours", async () => {
    const hass = makeHass(() => statsResponse("sensor.temp", []));
    await getEntityData(hass, { entity: "sensor.temp", statistics: "hour" }, 12);
    const call = vi.mocked(hass.callWS).mock.calls[0][0];
    expect(call.type).toBe("recorder/statistics_during_period");
    expect(call.period).toBe("hour");
  });

  it("parses statistics entries using mean", async () => {
    const hass = makeHass(() =>
      statsResponse("sensor.temp", [
        { start: "2024-01-01T00:00:00Z", mean: 20 },
        { start: "2024-01-01T01:00:00Z", mean: 22 },
      ]),
    );
    const ds = await getEntityData(hass, "sensor.temp", 168);
    expect(ds.data).toHaveLength(2);
    expect(ds.data[0].v).toBe(20);
    expect(ds.data[1].v).toBe(22);
  });

  it("falls back to state when mean is null", async () => {
    const hass = makeHass(() => ({
      "sensor.temp": [
        { statistic_id: "sensor.temp", start: "2024-01-01T00:00:00Z", end: "", mean: null, state: 42 },
      ],
    }));
    const ds = await getEntityData(hass, "sensor.temp", 168);
    expect(ds.data[0].v).toBe(42);
  });

  it("skips entries where both mean and state are null", async () => {
    const hass = makeHass(() => ({
      "sensor.temp": [
        { statistic_id: "sensor.temp", start: "2024-01-01T00:00:00Z", end: "", mean: null, state: null },
        { statistic_id: "sensor.temp", start: "2024-01-01T01:00:00Z", end: "", mean: 5, state: null },
      ],
    }));
    const ds = await getEntityData(hass, "sensor.temp", 168);
    expect(ds.data).toHaveLength(1);
    expect(ds.data[0].v).toBe(5);
  });
});

// ---------------------------------------------------------------------------
// getEntityData — applyValueModifiers (scale / invert / unit override)
// ---------------------------------------------------------------------------

describe("getEntityData — value modifiers", () => {
  beforeEach(() => invalidateCache());

  it("applies scale factor to all values", async () => {
    const hass = makeHass(() =>
      historyDictResponse("sensor.temp", [
        { lu: 1000, s: "1000" },
        { lu: 2000, s: "2000" },
      ]),
    );
    const ds = await getEntityData(hass, { entity: "sensor.temp", scale: 0.001 }, 24);
    expect(ds.data[0].v).toBeCloseTo(1);
    expect(ds.data[1].v).toBeCloseTo(2);
  });

  it("inverts values", async () => {
    const hass = makeHass(() =>
      historyDictResponse("sensor.temp", [{ lu: 1000, s: "5" }]),
    );
    const ds = await getEntityData(hass, { entity: "sensor.temp", invert: true }, 24);
    expect(ds.data[0].v).toBe(-5);
  });

  it("applies scale and invert together", async () => {
    const hass = makeHass(() =>
      historyDictResponse("sensor.temp", [{ lu: 1000, s: "1000" }]),
    );
    const ds = await getEntityData(hass, { entity: "sensor.temp", scale: 0.001, invert: true }, 24);
    expect(ds.data[0].v).toBeCloseTo(-1);
  });

  it("overrides unit when cfg.unit is set", async () => {
    const hass = makeHass(() =>
      historyDictResponse("sensor.temp", [{ lu: 1000, s: "1000" }]),
    );
    const ds = await getEntityData(hass, { entity: "sensor.temp", unit: "kW" }, 24);
    expect(ds.unit).toBe("kW");
  });

  it("cache stores unmodified data; second call with different scale returns scaled result", async () => {
    const hass = makeHass(() =>
      historyDictResponse("sensor.temp", [{ lu: 1000, s: "100" }]),
    );
    const ds1 = await getEntityData(hass, { entity: "sensor.temp", scale: 2 }, 24);
    const ds2 = await getEntityData(hass, { entity: "sensor.temp", scale: 0.5 }, 24);
    expect(vi.mocked(hass.callWS)).toHaveBeenCalledOnce(); // only 1 fetch
    expect(ds1.data[0].v).toBe(200);
    expect(ds2.data[0].v).toBe(50);
  });
});

// ---------------------------------------------------------------------------
// getMultiEntityData
// ---------------------------------------------------------------------------

describe("getMultiEntityData", () => {
  beforeEach(() => invalidateCache());

  it("fetches all entities in parallel and returns all datasets", async () => {
    const hass = makeHass((msg) => {
      const ids = (msg as { entity_ids?: string[] }).entity_ids;
      const id = ids?.[0] ?? "";
      return historyDictResponse(id, [{ lu: 1000, s: "10" }]);
    });
    const results = await getMultiEntityData(hass, ["sensor.temp", "sensor.other"], 24);
    expect(results).toHaveLength(2);
    expect(results[0].entityId).toBe("sensor.temp");
    expect(results[1].entityId).toBe("sensor.other");
  });

  it("returns empty array for empty entities list", async () => {
    const hass = makeHass(() => ({}));
    const results = await getMultiEntityData(hass, [], 24);
    expect(results).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// downsample (LTTB)
// ---------------------------------------------------------------------------

describe("downsample", () => {
  const makeData = (n: number): DataPoint[] =>
    Array.from({ length: n }, (_, i) => ({ t: i * 1000, v: Math.sin(i / 10) }));

  it("returns data unchanged when length <= targetPoints", () => {
    const data = makeData(10);
    expect(downsample(data, 10)).toBe(data);
    expect(downsample(data, 20)).toBe(data);
  });

  it("returns data unchanged for targetPoints <= 0", () => {
    const data = makeData(10);
    expect(downsample(data, 0)).toBe(data);
    expect(downsample(data, -1)).toBe(data);
  });

  it("returns first and last points for targetPoints = 2", () => {
    const data = makeData(100);
    const result = downsample(data, 2);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(data[0]);
    expect(result[result.length - 1]).toBe(data[data.length - 1]);
  });

  it("always keeps first and last point", () => {
    const data = makeData(100);
    const result = downsample(data, 20);
    expect(result[0]).toBe(data[0]);
    expect(result[result.length - 1]).toBe(data[data.length - 1]);
  });

  it("returns exactly targetPoints points", () => {
    const data = makeData(1000);
    expect(downsample(data, 100)).toHaveLength(100);
    expect(downsample(data, 50)).toHaveLength(50);
    expect(downsample(data, 3)).toHaveLength(3);
  });

  it("output is a strict subset of the input", () => {
    const data = makeData(500);
    const result = downsample(data, 50);
    const inputSet = new Set(data.map((p) => p.t));
    for (const p of result) {
      expect(inputSet.has(p.t)).toBe(true);
    }
  });

  it("output is sorted by timestamp", () => {
    const data = makeData(500);
    const result = downsample(data, 50);
    for (let i = 1; i < result.length; i++) {
      // LTTB may select the same index for the last bucket and the mandatory
      // last point — use >= instead of > to allow equal adjacent timestamps.
      expect(result[i].t).toBeGreaterThanOrEqual(result[i - 1].t);
    }
  });
});

// ---------------------------------------------------------------------------
// choosePeriod (tested indirectly via Statistics API calls)
// ---------------------------------------------------------------------------

describe("choosePeriod selection", () => {
  beforeEach(() => invalidateCache());

  const periodFor = async (hours: number): Promise<string> => {
    const hass = makeHass(() => statsResponse("sensor.temp", []));
    await getEntityData(hass, "sensor.temp", hours);
    return vi.mocked(hass.callWS).mock.calls[0][0].period as string;
  };

  it("uses explicit cfg.statistics period ('5minute') bypassing choosePeriod", async () => {
    // choosePeriod's "5minute" branch is unreachable via getEntityData because
    // hours <= 24 always routes to the History API (threshold = 72 h).
    // The only way to get "5minute" is via an explicit cfg.statistics override.
    const hass = makeHass(() => statsResponse("sensor.temp", []));
    await getEntityData(hass, { entity: "sensor.temp", statistics: "5minute" }, 24);
    const call = vi.mocked(hass.callWS).mock.calls[0][0];
    expect(call.period).toBe("5minute");
  });

  it("chooses hour for <= 168 h", async () => {
    expect(await periodFor(73)).toBe("hour");
    expect(await periodFor(168)).toBe("hour");
  });

  it("chooses day for <= 720 h", async () => {
    expect(await periodFor(169)).toBe("day");
    expect(await periodFor(720)).toBe("day");
  });

  it("chooses week for > 720 h", async () => {
    expect(await periodFor(721)).toBe("week");
  });
});
