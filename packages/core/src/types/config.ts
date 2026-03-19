/**
 * InsightChart card configuration interfaces.
 *
 * Every card config extends InsightBaseConfig. Entities can be specified as a
 * plain entity-id string (shorthand) or as a full InsightEntityConfig object.
 */

import type { HassStatisticsPeriod } from "./ha.js";

// ---------------------------------------------------------------------------
// Shared entity config
// ---------------------------------------------------------------------------

export interface InsightEntityConfig {
  /** Entity ID, e.g. "sensor.living_room_temperature" */
  entity: string;
  /** Display name — falls back to friendly_name from HA */
  name?: string;
  /** Hex colour string, e.g. "#FF6B4A" */
  color?: string;
  /** Which Y-axis this series belongs to */
  y_axis?: "left" | "right";
  /** Optional value transformation */
  transform?: "none" | "diff" | "normalize" | "cumulative";
  /**
   * When set, the Statistics API is used instead of the History API for this
   * entity, and data is aggregated at the given period resolution.
   */
  statistics?: HassStatisticsPeriod;
}

// ---------------------------------------------------------------------------
// Color scale helper
// ---------------------------------------------------------------------------

export interface ColorStop {
  /** Value between 0 and 1 */
  position: number;
  color: string;
}

// ---------------------------------------------------------------------------
// Grid options (passed through to HA Sections View)
// ---------------------------------------------------------------------------

export interface GridOptionsConfig {
  columns?: number | "full";
  rows?: number | "auto";
  min_columns?: number;
  min_rows?: number;
}

// ---------------------------------------------------------------------------
// Base config (shared by every card)
// ---------------------------------------------------------------------------

export interface InsightBaseConfig {
  /** Lovelace card type, e.g. "custom:insight-line-card" */
  type: string;
  /**
   * Entities to display. Accepts plain entity-id strings or full
   * InsightEntityConfig objects. Both forms may be mixed in the same array.
   */
  entities: (string | InsightEntityConfig)[];
  /** Card title shown in the header */
  title?: string;
  /**
   * History window in hours.
   * @default 24
   */
  hours?: number;
  /**
   * How often the card refreshes data (seconds).
   * @default 60
   */
  update_interval?: number;
  /**
   * Show a stats footer with min / mean / max / current values.
   * @default false
   */
  show_stats?: boolean;
  /**
   * Force a colour theme. "auto" follows the HA theme.
   * @default "auto"
   */
  theme?: "auto" | "dark" | "light";
  /** Override grid placement in Sections View */
  grid_options?: GridOptionsConfig;
}

// ---------------------------------------------------------------------------
// Line card
// ---------------------------------------------------------------------------

export interface InsightLineConfig extends InsightBaseConfig {
  /** Render mode */
  style?: "line" | "area" | "step";
  /** Line interpolation */
  curve?: "smooth" | "linear" | "step";
  /** Enable drag-to-zoom on the chart */
  zoom?: boolean;
  /** Stroke width in pixels */
  line_width?: number;
  /** Area fill opacity (0–1) */
  fill_opacity?: number;
  /**
   * Y-axis range.
   * "auto" = fit to data; [min, max] = fixed range.
   * @default "auto"
   */
  y_range?: "auto" | [number, number];
}

// ---------------------------------------------------------------------------
// Bar card
// ---------------------------------------------------------------------------

export interface InsightBarConfig extends InsightBaseConfig {
  /** Time bucket size for grouping */
  group_by?: "hour" | "day" | "week" | "month";
  /** Bar layout when multiple series are present */
  layout?: "grouped" | "stacked";
  /** Aggregation function applied per bucket */
  aggregate?: "mean" | "sum" | "min" | "max";
}

// ---------------------------------------------------------------------------
// Heatmap card
// ---------------------------------------------------------------------------

export interface InsightHeatmapConfig extends InsightBaseConfig {
  /**
   * Single entity shorthand (heatmap typically shows one entity).
   * When set, takes precedence over the entities array.
   */
  entity?: string;
  /**
   * Named colour palette (e.g. "YlOrRd") or an array of ColorStop objects
   * for a fully custom gradient.
   */
  color_scale?: string | ColorStop[];
  /** How time axes are laid out in the heatmap grid */
  layout?: "hour_day" | "weekday_hour" | "month_day";
}
