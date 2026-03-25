import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  normaliseEntityConfig,
  serialiseEntityConfig,
  hexToRgba,
  generateColors,
  DEFAULT_COLORS,
  formatValue,
  formatTime,
  formatDate,
  formatDateTime,
  formatDuration,
  computeStats,
  getBreakpoint,
  parsePeriod,
  aggregateTimeSeries,
  applyTransform,
  debounce,
  findNumericSensor,
} from "./index.js";

// ---------------------------------------------------------------------------
// normaliseEntityConfig
// ---------------------------------------------------------------------------

describe("normaliseEntityConfig", () => {
  it("returns object with entity for string input", () => {
    expect(normaliseEntityConfig("sensor.temp")).toEqual({ entity: "sensor.temp" });
  });

  it("passes through standard { entity } format unchanged", () => {
    const cfg = { entity: "sensor.temp", color: "#f00", name: "Temp" };
    expect(normaliseEntityConfig(cfg)).toEqual(cfg);
  });

  it("handles entity-as-key with nested options", () => {
    const input = { "sensor.temp": { color: "#f00", y_axis: "right" } };
    expect(normaliseEntityConfig(input)).toEqual({
      entity: "sensor.temp",
      color: "#f00",
      y_axis: "right",
    });
  });

  it("handles entity-as-key with flat sibling options", () => {
    const input = { "sensor.temp": null, color: "#f00", name: "Temp" };
    expect(normaliseEntityConfig(input)).toEqual({
      entity: "sensor.temp",
      color: "#f00",
      name: "Temp",
    });
  });

  it("entity-as-key: nested options are overridden by sibling options", () => {
    const input = { "sensor.temp": { color: "#000" }, color: "#f00" };
    const result = normaliseEntityConfig(input) as Record<string, unknown>;
    expect(result.entity).toBe("sensor.temp");
    expect(result.color).toBe("#f00"); // sibling wins
  });

  it("returns input as-is when no entity key is found", () => {
    const obj = { color: "#f00", name: "X" } as Record<string, unknown>;
    expect(normaliseEntityConfig(obj)).toBe(obj);
  });
});

// ---------------------------------------------------------------------------
// serialiseEntityConfig
// ---------------------------------------------------------------------------

describe("serialiseEntityConfig", () => {
  it("returns plain string when no options present", () => {
    expect(serialiseEntityConfig({ entity: "sensor.temp" })).toBe("sensor.temp");
  });

  it("returns entity-as-key object when options present", () => {
    const result = serialiseEntityConfig({ entity: "sensor.temp", color: "#f00" });
    expect(result).toEqual({ "sensor.temp": { color: "#f00" } });
  });

  it("strips undefined and null values from options", () => {
    const result = serialiseEntityConfig({
      entity: "sensor.temp",
      color: undefined,
      name: null as unknown as string,
      y_axis: "right" as const,
    });
    expect(result).toEqual({ "sensor.temp": { y_axis: "right" } });
  });

  it("returns plain string when all options are undefined/null", () => {
    const result = serialiseEntityConfig({
      entity: "sensor.temp",
      color: undefined,
    });
    expect(result).toBe("sensor.temp");
  });
});

// ---------------------------------------------------------------------------
// hexToRgba
// ---------------------------------------------------------------------------

describe("hexToRgba", () => {
  it("converts 6-digit hex correctly", () => {
    expect(hexToRgba("#FF6B4A", 1)).toBe("rgba(255,107,74,1)");
  });

  it("converts 3-digit hex correctly", () => {
    expect(hexToRgba("#f00", 0.5)).toBe("rgba(255,0,0,0.5)");
  });

  it("strips leading # before parsing", () => {
    expect(hexToRgba("4AAFFF", 1)).toBe("rgba(74,175,255,1)");
  });

  it("clamps alpha to [0, 1]", () => {
    expect(hexToRgba("#000000", 2)).toBe("rgba(0,0,0,1)");
    expect(hexToRgba("#000000", -1)).toBe("rgba(0,0,0,0)");
  });

  it("returns opaque black for invalid hex", () => {
    expect(hexToRgba("#GGGGGG", 1)).toBe("rgba(0,0,0,1)");
    expect(hexToRgba("#12", 1)).toBe("rgba(0,0,0,1)");
  });
});

// ---------------------------------------------------------------------------
// generateColors
// ---------------------------------------------------------------------------

describe("generateColors", () => {
  it("returns N colors from the default palette", () => {
    const colors = generateColors(3);
    expect(colors).toEqual([DEFAULT_COLORS[0], DEFAULT_COLORS[1], DEFAULT_COLORS[2]]);
  });

  it("cycles palette when count > palette length", () => {
    const palette = ["#f00", "#0f0"];
    const colors = generateColors(5, palette);
    expect(colors).toEqual(["#f00", "#0f0", "#f00", "#0f0", "#f00"]);
  });

  it("returns empty array for count 0", () => {
    expect(generateColors(0)).toEqual([]);
  });

  it("uses custom palette", () => {
    expect(generateColors(2, ["#aaa", "#bbb"])).toEqual(["#aaa", "#bbb"]);
  });
});

// ---------------------------------------------------------------------------
// formatValue
// ---------------------------------------------------------------------------

describe("formatValue", () => {
  it("formats integer without decimals", () => {
    expect(formatValue(42)).toBe("42");
  });

  it("formats float with 1 decimal by default", () => {
    expect(formatValue(3.14)).toBe("3.1");
  });

  it("appends unit when provided", () => {
    expect(formatValue(21.5, "°C")).toBe("21.5 °C");
  });

  it("uses explicit decimals when provided", () => {
    expect(formatValue(3.14159, "x", 3)).toBe("3.142 x");
  });

  it("formats 0 decimals for integer even if explicit decimals=0", () => {
    expect(formatValue(5, undefined, 0)).toBe("5");
  });

  it("returns em dash for non-finite values", () => {
    expect(formatValue(Infinity)).toBe("—");
    expect(formatValue(-Infinity)).toBe("—");
    expect(formatValue(NaN)).toBe("—");
  });
});

// ---------------------------------------------------------------------------
// formatTime / formatDate / formatDateTime
// ---------------------------------------------------------------------------

describe("formatTime", () => {
  it("formats hours and minutes with zero-padding", () => {
    // 2024-03-15 09:05 UTC+1 — use a fixed timestamp
    const ts = new Date("2024-03-15T09:05:00").getTime();
    const result = formatTime(ts);
    expect(result).toMatch(/^\d{2}:\d{2}$/);
    const [h, m] = result.split(":").map(Number);
    expect(m).toBe(5);
    expect(h).toBeGreaterThanOrEqual(0);
  });
});

describe("formatDate", () => {
  it("returns DD.MM format", () => {
    const ts = new Date("2024-03-15T12:00:00").getTime();
    const result = formatDate(ts);
    expect(result).toMatch(/^\d{2}\.\d{2}$/);
    const [day, month] = result.split(".").map(Number);
    expect(month).toBe(3);
    expect(day).toBe(15);
  });
});

describe("formatDateTime", () => {
  it("combines date and time", () => {
    const ts = new Date("2024-03-15T12:00:00").getTime();
    const result = formatDateTime(ts);
    expect(result).toMatch(/^\d{2}\.\d{2} \d{2}:\d{2}$/);
  });
});

// ---------------------------------------------------------------------------
// formatDuration
// ---------------------------------------------------------------------------

describe("formatDuration", () => {
  it("formats hours below 24", () => {
    expect(formatDuration(1)).toBe("1h");
    expect(formatDuration(23)).toBe("23h");
  });

  it("formats days for 24–167 hours", () => {
    expect(formatDuration(24)).toBe("1d");
    expect(formatDuration(48)).toBe("2d");
    expect(formatDuration(167)).toBe("7d");
  });

  it("formats weeks for 168+ hours", () => {
    expect(formatDuration(168)).toBe("1w");
    expect(formatDuration(336)).toBe("2w");
  });
});

// ---------------------------------------------------------------------------
// computeStats
// ---------------------------------------------------------------------------

describe("computeStats", () => {
  it("returns zeros and stable for empty array", () => {
    expect(computeStats([])).toEqual({ min: 0, max: 0, mean: 0, current: 0, trend: "stable" });
  });

  it("computes min, max, mean, current correctly", () => {
    const stats = computeStats([1, 2, 3, 4, 5]);
    expect(stats.min).toBe(1);
    expect(stats.max).toBe(5);
    expect(stats.mean).toBe(3);
    expect(stats.current).toBe(5);
  });

  it("detects upward trend", () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(computeStats(values).trend).toBe("up");
  });

  it("detects downward trend", () => {
    const values = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    expect(computeStats(values).trend).toBe("down");
  });

  it("returns stable for flat values", () => {
    const values = [5, 5, 5, 5, 5];
    expect(computeStats(values).trend).toBe("stable");
  });

  it("returns stable for fewer than 5 values", () => {
    expect(computeStats([1, 10]).trend).toBe("stable");
  });
});

// ---------------------------------------------------------------------------
// getBreakpoint
// ---------------------------------------------------------------------------

describe("getBreakpoint", () => {
  it("returns compact for width < 300", () => {
    expect(getBreakpoint(0)).toBe("compact");
    expect(getBreakpoint(299)).toBe("compact");
  });

  it("returns default for 300 <= width < 600", () => {
    expect(getBreakpoint(300)).toBe("default");
    expect(getBreakpoint(599)).toBe("default");
  });

  it("returns wide for width >= 600", () => {
    expect(getBreakpoint(600)).toBe("wide");
    expect(getBreakpoint(1200)).toBe("wide");
  });
});

// ---------------------------------------------------------------------------
// parsePeriod
// ---------------------------------------------------------------------------

describe("parsePeriod", () => {
  it("parses minutes", () => {
    expect(parsePeriod("30m")).toBe(30 * 60_000);
    expect(parsePeriod("1m")).toBe(60_000);
  });

  it("parses hours", () => {
    expect(parsePeriod("1h")).toBe(3_600_000);
    expect(parsePeriod("6h")).toBe(6 * 3_600_000);
  });

  it("parses days", () => {
    expect(parsePeriod("1d")).toBe(86_400_000);
    expect(parsePeriod("7d")).toBe(7 * 86_400_000);
  });

  it("parses weeks", () => {
    expect(parsePeriod("1w")).toBe(604_800_000);
    expect(parsePeriod("2w")).toBe(2 * 604_800_000);
  });

  it("parses decimal values", () => {
    expect(parsePeriod("1.5h")).toBe(1.5 * 3_600_000);
  });

  it("returns NaN for invalid format", () => {
    expect(parsePeriod("")).toBeNaN();
    expect(parsePeriod("1x")).toBeNaN();
    expect(parsePeriod("abc")).toBeNaN();
    expect(parsePeriod("1")).toBeNaN();
  });
});

// ---------------------------------------------------------------------------
// aggregateTimeSeries
// ---------------------------------------------------------------------------

describe("aggregateTimeSeries", () => {
  const data = [
    { t: 0, v: 2 },
    { t: 1, v: 4 },   // bucket 0 (periodMs=10): values [2,4]
    { t: 10, v: 6 },
    { t: 19, v: 8 },  // bucket 10: values [6,8]
  ];

  it("returns data unchanged for empty input", () => {
    expect(aggregateTimeSeries([], 1000, "mean")).toEqual([]);
  });

  it("returns data unchanged for periodMs <= 0", () => {
    expect(aggregateTimeSeries(data, 0, "mean")).toEqual(data);
  });

  it("aggregates mean correctly", () => {
    const result = aggregateTimeSeries(data, 10, "mean");
    expect(result).toHaveLength(2);
    expect(result[0].v).toBe(3);  // (2+4)/2
    expect(result[1].v).toBe(7);  // (6+8)/2
    expect(result[0].t).toBe(5);  // midpoint of bucket [0,10)
    expect(result[1].t).toBe(15); // midpoint of bucket [10,20)
  });

  it("aggregates min correctly", () => {
    const result = aggregateTimeSeries(data, 10, "min");
    expect(result[0].v).toBe(2);
    expect(result[1].v).toBe(6);
  });

  it("aggregates max correctly", () => {
    const result = aggregateTimeSeries(data, 10, "max");
    expect(result[0].v).toBe(4);
    expect(result[1].v).toBe(8);
  });

  it("aggregates sum correctly", () => {
    const result = aggregateTimeSeries(data, 10, "sum");
    expect(result[0].v).toBe(6);
    expect(result[1].v).toBe(14);
  });

  it("aggregates last correctly", () => {
    const result = aggregateTimeSeries(data, 10, "last");
    expect(result[0].v).toBe(4);
    expect(result[1].v).toBe(8);
  });

  it("output is sorted by timestamp", () => {
    const unsorted = [{ t: 10, v: 1 }, { t: 0, v: 2 }];
    const result = aggregateTimeSeries(unsorted, 10, "mean");
    expect(result[0].t).toBeLessThan(result[1].t);
  });
});

// ---------------------------------------------------------------------------
// applyTransform
// ---------------------------------------------------------------------------

describe("applyTransform", () => {
  const data = [
    { t: 0, v: 2 },
    { t: 1, v: 5 },
    { t: 2, v: 3 },
    { t: 3, v: 8 },
  ];

  it("none — returns input unchanged", () => {
    expect(applyTransform(data, "none")).toBe(data);
  });

  it("none — returns empty array unchanged", () => {
    expect(applyTransform([], "none")).toEqual([]);
  });

  it("diff — computes deltas and drops first point", () => {
    const result = applyTransform(data, "diff");
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ t: 1, v: 3 });  // 5-2
    expect(result[1]).toEqual({ t: 2, v: -2 }); // 3-5
    expect(result[2]).toEqual({ t: 3, v: 5 });  // 8-3
  });

  it("normalize — scales to [0, 1]", () => {
    const result = applyTransform(data, "normalize");
    expect(result[0].v).toBeCloseTo(0);    // min=2
    expect(result[3].v).toBeCloseTo(1);    // max=8
    expect(result[1].v).toBeCloseTo(0.5);  // (5-2)/(8-2)=0.5
    expect(result[2].v).toBeCloseTo(1 / 6, 5);
  });

  it("normalize — returns 0 for flat data (range=0)", () => {
    const flat = [{ t: 0, v: 5 }, { t: 1, v: 5 }];
    const result = applyTransform(flat, "normalize");
    expect(result[0].v).toBe(0);
    expect(result[1].v).toBe(0);
  });

  it("cumulative — computes running sum", () => {
    const result = applyTransform(data, "cumulative");
    expect(result[0]).toEqual({ t: 0, v: 2 });
    expect(result[1]).toEqual({ t: 1, v: 7 });
    expect(result[2]).toEqual({ t: 2, v: 10 });
    expect(result[3]).toEqual({ t: 3, v: 18 });
  });
});

// ---------------------------------------------------------------------------
// debounce
// ---------------------------------------------------------------------------

describe("debounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("delays function execution", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledOnce();
  });

  it("resets timer on repeated calls", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledOnce();
  });

  it("passes arguments through", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced("a", 42);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith("a", 42);
  });
});

// ---------------------------------------------------------------------------
// findNumericSensor
// ---------------------------------------------------------------------------

describe("findNumericSensor", () => {
  const hass = {
    states: {
      "sensor.temp": {
        state: "21.5",
        attributes: { unit_of_measurement: "°C" },
      },
      "sensor.text": {
        state: "hello",
        attributes: {},
      },
    },
  };

  it("returns numeric sensor with unit from entities list", () => {
    expect(findNumericSensor(hass, ["sensor.temp"], [])).toBe("sensor.temp");
  });

  it("skips non-numeric entities", () => {
    expect(findNumericSensor(hass, ["sensor.text", "sensor.temp"], [])).toBe("sensor.temp");
  });

  it("falls back to first sensor candidate if none are numeric", () => {
    expect(findNumericSensor(hass, ["sensor.text"], [])).toBe("sensor.text");
  });

  it("uses fallback string when no sensor entities found", () => {
    expect(findNumericSensor(hass, [], [], "sensor.fallback")).toBe("sensor.fallback");
  });

  it("checks entitiesFallback when entities is empty", () => {
    expect(findNumericSensor(hass, [], ["sensor.temp"])).toBe("sensor.temp");
  });

  it("filters out non-sensor entities", () => {
    expect(findNumericSensor(hass, ["light.bulb"], [], "sensor.default")).toBe("sensor.default");
  });
});
