import { describe, it, expect } from "vitest";
import { mergeTimestamps, alignSeries, normaliseDash } from "./line-utils.js";
import type { DataPoint } from "@insight-chart/core";

// ---------------------------------------------------------------------------
// mergeTimestamps
// ---------------------------------------------------------------------------

describe("mergeTimestamps", () => {
  it("returns empty array for empty input", () => {
    expect(mergeTimestamps([])).toEqual([]);
  });

  it("returns empty array when all datasets are empty", () => {
    expect(mergeTimestamps([[], []])).toEqual([]);
  });

  it("converts ms timestamps to seconds (floor)", () => {
    const data: DataPoint[] = [{ t: 1_000_000, v: 1 }]; // 1000 s + 0 ms
    expect(mergeTimestamps([data])).toEqual([1000]);
  });

  it("floors sub-second precision when converting", () => {
    const data: DataPoint[] = [{ t: 1_500_999, v: 1 }]; // 1500.999 s → 1500
    expect(mergeTimestamps([data])).toEqual([1500]);
  });

  it("sorts timestamps ascending", () => {
    const data: DataPoint[] = [
      { t: 3_000_000, v: 3 },
      { t: 1_000_000, v: 1 },
      { t: 2_000_000, v: 2 },
    ];
    expect(mergeTimestamps([data])).toEqual([1000, 2000, 3000]);
  });

  it("deduplicates identical timestamps across entities", () => {
    const a: DataPoint[] = [{ t: 1_000_000, v: 10 }];
    const b: DataPoint[] = [{ t: 1_000_000, v: 20 }];
    expect(mergeTimestamps([a, b])).toEqual([1000]);
  });

  it("merges timestamps from multiple entities", () => {
    const a: DataPoint[] = [{ t: 1_000_000, v: 1 }, { t: 3_000_000, v: 3 }];
    const b: DataPoint[] = [{ t: 2_000_000, v: 2 }, { t: 3_000_000, v: 3 }];
    expect(mergeTimestamps([a, b])).toEqual([1000, 2000, 3000]);
  });

  it("handles a single entity with one point", () => {
    const data: DataPoint[] = [{ t: 60_000, v: 5 }]; // 60 s
    expect(mergeTimestamps([data])).toEqual([60]);
  });

  it("deduplicates within a single entity", () => {
    // Two ms timestamps rounding to the same second
    const data: DataPoint[] = [
      { t: 1_000_000, v: 1 },
      { t: 1_000_500, v: 2 }, // floor → 1000 as well
    ];
    expect(mergeTimestamps([data])).toEqual([1000]);
  });
});

// ---------------------------------------------------------------------------
// alignSeries
// ---------------------------------------------------------------------------

describe("alignSeries", () => {
  it("returns empty array for empty timestamps", () => {
    const data: DataPoint[] = [{ t: 1_000_000, v: 10 }];
    expect(alignSeries(data, [])).toEqual([]);
  });

  it("returns null for each timestamp when data is empty", () => {
    expect(alignSeries([], [1000, 2000])).toEqual([null, null]);
  });

  it("maps values to matching timestamps", () => {
    const data: DataPoint[] = [
      { t: 1_000_000, v: 10 },
      { t: 2_000_000, v: 20 },
    ];
    expect(alignSeries(data, [1000, 2000])).toEqual([10, 20]);
  });

  it("inserts null for timestamps without a data point", () => {
    const data: DataPoint[] = [{ t: 1_000_000, v: 10 }];
    expect(alignSeries(data, [1000, 2000, 3000])).toEqual([10, null, null]);
  });

  it("inserts null at the beginning when entity starts later", () => {
    const data: DataPoint[] = [{ t: 3_000_000, v: 30 }];
    expect(alignSeries(data, [1000, 2000, 3000])).toEqual([null, null, 30]);
  });

  it("handles gaps in the middle", () => {
    const data: DataPoint[] = [
      { t: 1_000_000, v: 1 },
      { t: 3_000_000, v: 3 },
    ];
    expect(alignSeries(data, [1000, 2000, 3000])).toEqual([1, null, 3]);
  });

  it("uses floor for sub-second ms values", () => {
    const data: DataPoint[] = [{ t: 1_999_999, v: 7 }]; // floor → 1999
    expect(alignSeries(data, [1999])).toEqual([7]);
  });

  it("last write wins when two points floor to same second", () => {
    const data: DataPoint[] = [
      { t: 1_000_000, v: 10 },
      { t: 1_000_500, v: 99 }, // both → 1000
    ];
    expect(alignSeries(data, [1000])).toEqual([99]);
  });
});

// ---------------------------------------------------------------------------
// normaliseDash
// ---------------------------------------------------------------------------

describe("normaliseDash", () => {
  it("returns undefined for undefined", () => {
    expect(normaliseDash(undefined)).toBeUndefined();
  });

  it("returns undefined for null", () => {
    expect(normaliseDash(null)).toBeUndefined();
  });

  it("returns undefined for 0 (solid line)", () => {
    expect(normaliseDash(0)).toBeUndefined();
  });

  it("expands a single number to [n, n]", () => {
    expect(normaliseDash(5)).toEqual([5, 5]);
    expect(normaliseDash(8)).toEqual([8, 8]);
  });

  it("passes through an array unchanged", () => {
    expect(normaliseDash([8, 4])).toEqual([8, 4]);
    expect(normaliseDash([4, 4, 2, 4])).toEqual([4, 4, 2, 4]);
  });

  it("passes through a single-element array", () => {
    expect(normaliseDash([5])).toEqual([5]);
  });
});
