/**
 * Pure utility functions for the line-card.
 * Exported separately so they can be unit-tested without a DOM or uPlot.
 */

import type { DataPoint } from "@insight-chart/core";

/**
 * Merge timestamps from multiple DataPoint arrays into a single sorted,
 * deduplicated array of Unix **seconds** (uPlot format).
 */
export function mergeTimestamps(datasets: DataPoint[][]): number[] {
  const all = new Set<number>();
  for (const data of datasets) {
    for (const point of data) {
      all.add(Math.floor(point.t / 1000));
    }
  }
  return Array.from(all).sort((a, b) => a - b);
}

/**
 * Align a DataPoint array to a shared timestamp axis (Unix seconds).
 * Returns null for timestamps where the entity has no data point.
 */
export function alignSeries(
  data: DataPoint[],
  timestamps: number[],
): (number | null)[] {
  const map = new Map<number, number>();
  for (const point of data) {
    map.set(Math.floor(point.t / 1000), point.v);
  }
  return timestamps.map((ts) => map.get(ts) ?? null);
}

/**
 * Normalise a stroke_dash config value to a `[dash, gap]` array, or
 * undefined when no dash is configured.
 *
 * - `undefined` / `null` / `0` → undefined (solid line)
 * - number `n`                  → `[n, n]`
 * - `[dash, gap]`              → `[dash, gap]` (pass-through)
 */
export function normaliseDash(
  strokeDash: number | number[] | null | undefined,
): number[] | undefined {
  if (strokeDash == null || strokeDash === 0) return undefined;
  if (Array.isArray(strokeDash)) return strokeDash;
  return [strokeDash, strokeDash];
}
