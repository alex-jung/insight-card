/**
 * Pure utility functions for the bar-card.
 * Exported separately so they can be unit-tested without a DOM.
 */

import type { InsightBarConfig, ColorThresholdConfig } from "@insight-chart/core";

export function aggregateBuckets(
  values: number[],
  method: InsightBarConfig["aggregate"] = "mean",
): number {
  if (values.length === 0) return 0;
  if (method === "sum") return values.reduce((a, b) => a + b, 0);
  if (method === "min") return Math.min(...values);
  if (method === "max") return Math.max(...values);
  // mean
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function bucketKey(ts: number, groupBy: InsightBarConfig["group_by"] = "day"): string {
  const d = new Date(ts);
  if (groupBy === "hour") {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`;
  }
  if (groupBy === "week") {
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    return `${start.getFullYear()}-W${start.getDate()}`;
  }
  if (groupBy === "month") {
    return `${d.getFullYear()}-${d.getMonth()}`;
  }
  // day
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export function bucketLabel(key: string, groupBy: InsightBarConfig["group_by"] = "day"): string {
  const parts = key.split("-");
  if (groupBy === "hour") {
    return `${parts[3]}:00`;
  }
  if (groupBy === "week") {
    return key;
  }
  if (groupBy === "month") {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[parseInt(parts[1], 10)] ?? key;
  }
  return `${parts[2]}.${(parseInt(parts[1], 10) + 1).toString().padStart(2, "0")}`;
}

/** Return the color for `value` from a sorted threshold list, or null if none match. */
export function colorFromThresholds(value: number, thresholds: ColorThresholdConfig[]): string | null {
  const sorted = [...thresholds].sort((a, b) => a.value - b.value);
  let color: string | null = null;
  for (const t of sorted) {
    if (value >= t.value) color = t.color;
  }
  return color;
}
