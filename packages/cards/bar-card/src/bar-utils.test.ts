import { describe, it, expect } from "vitest";
import { aggregateBuckets, bucketKey, bucketLabel, colorFromThresholds } from "./bar-utils.js";

// ---------------------------------------------------------------------------
// aggregateBuckets
// ---------------------------------------------------------------------------

describe("aggregateBuckets", () => {
  it("returns 0 for empty array", () => {
    expect(aggregateBuckets([], "mean")).toBe(0);
    expect(aggregateBuckets([], "sum")).toBe(0);
    expect(aggregateBuckets([], "min")).toBe(0);
    expect(aggregateBuckets([], "max")).toBe(0);
  });

  it("computes mean correctly", () => {
    expect(aggregateBuckets([10, 20, 30], "mean")).toBe(20);
    expect(aggregateBuckets([1, 2], "mean")).toBe(1.5);
  });

  it("defaults to mean when method is undefined", () => {
    expect(aggregateBuckets([4, 6])).toBe(5);
  });

  it("computes sum correctly", () => {
    expect(aggregateBuckets([1, 2, 3], "sum")).toBe(6);
    expect(aggregateBuckets([10], "sum")).toBe(10);
  });

  it("computes min correctly", () => {
    expect(aggregateBuckets([5, 1, 8, 3], "min")).toBe(1);
  });

  it("computes max correctly", () => {
    expect(aggregateBuckets([5, 1, 8, 3], "max")).toBe(8);
  });

  it("handles single-element array", () => {
    expect(aggregateBuckets([42], "mean")).toBe(42);
    expect(aggregateBuckets([42], "sum")).toBe(42);
    expect(aggregateBuckets([42], "min")).toBe(42);
    expect(aggregateBuckets([42], "max")).toBe(42);
  });

  it("handles negative values", () => {
    expect(aggregateBuckets([-4, -2], "mean")).toBe(-3);
    expect(aggregateBuckets([-4, -2], "sum")).toBe(-6);
    expect(aggregateBuckets([-4, -2], "min")).toBe(-4);
    expect(aggregateBuckets([-4, -2], "max")).toBe(-2);
  });
});

// ---------------------------------------------------------------------------
// bucketKey
// ---------------------------------------------------------------------------

describe("bucketKey", () => {
  // bucketKey uses local-time Date methods — create timestamps in local time.
  // 2024-03-15 14:30:00 local
  const ts = new Date(2024, 2, 15, 14, 30, 0).getTime(); // month is 0-indexed

  it("generates day key by default", () => {
    const key = bucketKey(ts);
    expect(key).toBe("2024-2-15");
  });

  it("generates day key for group_by='day'", () => {
    expect(bucketKey(ts, "day")).toBe("2024-2-15");
  });

  it("generates hour key for group_by='hour'", () => {
    expect(bucketKey(ts, "hour")).toBe("2024-2-15-14");
  });

  it("generates month key for group_by='month'", () => {
    expect(bucketKey(ts, "month")).toBe("2024-2");
  });

  it("generates week key for group_by='week' (Sunday-aligned)", () => {
    // 2024-03-15 is a Friday
    const key = bucketKey(ts, "week");
    expect(key).toMatch(/^2024-W/);
  });

  it("same day → same key", () => {
    const morning = new Date(2024, 2, 15, 6, 0, 0).getTime();
    const evening = new Date(2024, 2, 15, 22, 0, 0).getTime();
    expect(bucketKey(morning, "day")).toBe(bucketKey(evening, "day"));
  });

  it("different days → different keys", () => {
    const day1 = new Date(2024, 2, 15, 12, 0, 0).getTime();
    const day2 = new Date(2024, 2, 16, 12, 0, 0).getTime();
    expect(bucketKey(day1, "day")).not.toBe(bucketKey(day2, "day"));
  });

  it("same hour → same key", () => {
    const t1 = new Date(2024, 2, 15, 14, 0, 0).getTime();
    const t2 = new Date(2024, 2, 15, 14, 59, 59).getTime();
    expect(bucketKey(t1, "hour")).toBe(bucketKey(t2, "hour"));
  });

  it("different hours → different keys", () => {
    const t1 = new Date(2024, 2, 15, 14, 0, 0).getTime();
    const t2 = new Date(2024, 2, 15, 15, 0, 0).getTime();
    expect(bucketKey(t1, "hour")).not.toBe(bucketKey(t2, "hour"));
  });

  it("same month → same key", () => {
    const t1 = new Date(2024, 2, 1, 0, 0, 0).getTime();
    const t2 = new Date(2024, 2, 28, 22, 0, 0).getTime();
    expect(bucketKey(t1, "month")).toBe(bucketKey(t2, "month"));
  });

  it("different months → different keys", () => {
    const t1 = new Date(2024, 2, 15, 12, 0, 0).getTime();
    const t2 = new Date(2024, 3, 15, 12, 0, 0).getTime();
    expect(bucketKey(t1, "month")).not.toBe(bucketKey(t2, "month"));
  });
});

// ---------------------------------------------------------------------------
// bucketLabel
// ---------------------------------------------------------------------------

describe("bucketLabel", () => {
  it("formats day key as DD.MM", () => {
    // key format: "2024-2-15" → month index 2 + 1 = 3 → "15.03"
    expect(bucketLabel("2024-2-15", "day")).toBe("15.03");
  });

  it("formats day key: month is zero-padded", () => {
    expect(bucketLabel("2024-0-5", "day")).toBe("5.01");
  });

  it("formats hour key as HH:00", () => {
    // key format: "2024-2-15-9"
    expect(bucketLabel("2024-2-15-9", "hour")).toBe("9:00");
    expect(bucketLabel("2024-2-15-0", "hour")).toBe("0:00");
  });

  it("returns key as-is for week", () => {
    const key = "2024-W10";
    expect(bucketLabel(key, "week")).toBe(key);
  });

  it("formats month key as abbreviated month name", () => {
    // key format: "2024-0" → Jan
    expect(bucketLabel("2024-0", "month")).toBe("Jan");
    expect(bucketLabel("2024-11", "month")).toBe("Dec");
    expect(bucketLabel("2024-5", "month")).toBe("Jun");
  });

  it("defaults to day format when group_by is undefined", () => {
    expect(bucketLabel("2024-2-15")).toBe("15.03");
  });
});

// ---------------------------------------------------------------------------
// colorFromThresholds
// ---------------------------------------------------------------------------

describe("colorFromThresholds", () => {
  const thresholds = [
    { value: 0,  color: "#blue"   },
    { value: 50, color: "#yellow" },
    { value: 90, color: "#red"    },
  ];

  it("returns null when no threshold is met", () => {
    expect(colorFromThresholds(-1, thresholds)).toBeNull();
  });

  it("returns color of the matching threshold (exact value)", () => {
    expect(colorFromThresholds(0, thresholds)).toBe("#blue");
    expect(colorFromThresholds(50, thresholds)).toBe("#yellow");
    expect(colorFromThresholds(90, thresholds)).toBe("#red");
  });

  it("returns the highest applicable threshold color", () => {
    expect(colorFromThresholds(10, thresholds)).toBe("#blue");
    expect(colorFromThresholds(75, thresholds)).toBe("#yellow");
    expect(colorFromThresholds(100, thresholds)).toBe("#red");
  });

  it("returns null for empty threshold list", () => {
    expect(colorFromThresholds(50, [])).toBeNull();
  });

  it("works regardless of threshold order in the input", () => {
    const unordered = [
      { value: 90, color: "#red"    },
      { value: 0,  color: "#blue"   },
      { value: 50, color: "#yellow" },
    ];
    expect(colorFromThresholds(75, unordered)).toBe("#yellow");
    expect(colorFromThresholds(95, unordered)).toBe("#red");
  });

  it("handles single threshold", () => {
    const single = [{ value: 10, color: "#green" }];
    expect(colorFromThresholds(9, single)).toBeNull();
    expect(colorFromThresholds(10, single)).toBe("#green");
    expect(colorFromThresholds(100, single)).toBe("#green");
  });
});
