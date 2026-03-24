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
  /** Override the card-level line_width for this entity. */
  line_width?: number;
  /** Override the card-level fill_opacity for this entity (0–1). */
  fill_opacity?: number;
  /**
   * Dashed line pattern in pixels.
   * A single number sets equal dash and gap (e.g. 5 → [5, 5]).
   * An array sets dash and gap separately (e.g. [8, 4]).
   * @default 0 (solid)
   */
  stroke_dash?: number | number[];
  /**
   * Start the series hidden. The user can toggle visibility via the legend.
   * @default false
   */
  hidden?: boolean;
  /** Optional value transformation */
  transform?: "none" | "diff" | "normalize" | "cumulative";
  /**
   * When set, the Statistics API is used instead of the History API for this
   * entity, and data is aggregated at the given period resolution.
   */
  statistics?: HassStatisticsPeriod;
  /**
   * Use a specific entity attribute as the data source instead of the state.
   * The attribute value must be numeric. Combine with `unit` to set the
   * correct unit of measurement (attributes have no unit metadata).
   * Example: attribute: "current_temperature"
   */
  attribute?: string;
  /**
   * Override the unit of measurement shown in stats and tooltips.
   * Useful together with `scale` (e.g. scale: 0.001, unit: "kW").
   */
  unit?: string;
  /**
   * Multiply every value by this factor before display.
   * Useful for unit conversions (e.g. W → kW: scale: 0.001).
   * @default 1
   */
  scale?: number;
  /**
   * Negate all values before display (multiply by -1).
   * Useful for export/feed-in sensors that report positive values but should
   * be shown as negative (or vice versa).
   * @default false
   */
  invert?: boolean;
  /**
   * Aggregation method for this entity. Overrides the card-level `aggregate`.
   * Applied client-side after fetching raw history data.
   */
  aggregate?: "mean" | "min" | "max" | "sum" | "last";
}

// ---------------------------------------------------------------------------
// Color threshold (value-based gradient coloring)
// ---------------------------------------------------------------------------

export interface ColorThresholdConfig {
  /** Y value at which this color starts */
  value: number;
  /** Color at this threshold (hex) */
  color: string;
}

// ---------------------------------------------------------------------------
// Threshold line
// ---------------------------------------------------------------------------

export interface ThresholdConfig {
  /** Y value at which the horizontal line is drawn */
  value: number;
  /** Line color (hex). Defaults to --error-color. */
  color?: string;
  /** Optional label drawn next to the line */
  label?: string;
  /** Line dash pattern in pixels, e.g. [4, 3]. Default: solid. */
  dash?: number[];
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
   * Opacity of the background grid lines (0–1).
   * @default 1
   */
  grid_opacity?: number;
  /**
   * Show the series legend below the chart.
   * @default true
   */
  show_legend?: boolean;
  /**
   * Show the X (time) axis labels and ticks.
   * @default true
   */
  show_x_axis?: boolean;
  /**
   * Show the Y axis labels and ticks.
   * @default true
   */
  show_y_axis?: boolean;
  /**
   * Outer margin on the left side of the chart area (px).
   * @default 0
   */
  margin_left?: number;
  /**
   * Outer margin on the right side of the chart area (px).
   * @default 0
   */
  margin_right?: number;
  /**
   * Outer margin on the top of the chart area (px).
   * @default 0
   */
  margin_top?: number;
  /**
   * Outer margin on the bottom of the chart area (px).
   * @default 0
   */
  margin_bottom?: number;
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
  /**
   * Soft Y minimum — axis extends below this value only if data requires it.
   * Useful to always show zero: y_min: 0
   */
  y_min?: number;
  /**
   * Soft Y maximum — axis extends above this value only if data requires it.
   */
  y_max?: number;
  /**
   * Fixed decimal places for Y-axis tick labels and tooltip values.
   * Defaults to auto (0 for integers, 1 for floats).
   */
  decimals?: number;
  /**
   * Use a logarithmic (base-10) Y-axis scale.
   * All data values must be > 0.
   * @default false
   */
  logarithmic?: boolean;
  /**
   * Timestamp format shown in the hover tooltip.
   * @default "datetime"
   */
  tooltip_format?: "time" | "date" | "datetime";
  /**
   * Format for X-axis tick labels.
   * - `"auto"`     — uPlot smart formatting (adapts to zoom level)
   * - `"time"`     — always HH:MM
   * - `"date"`     — always DD.MM
   * - `"datetime"` — always DD.MM HH:MM
   * @default "auto"
   */
  time_format?: "auto" | "time" | "date" | "datetime";
  /** Secondary (right) Y-axis range. "auto" or fixed [min, max]. */
  y_range_secondary?: "auto" | [number, number];
  /** Soft minimum for the secondary Y-axis. */
  y_min_secondary?: number;
  /** Soft maximum for the secondary Y-axis. */
  y_max_secondary?: number;
  /**
   * Whether to show data points on the line.
   * - `false`   — no static dots (default)
   * - `true`    — dots always visible on every data point
   * - `"hover"` — dots only at the cursor position (uPlot cursor points)
   * @default false
   */
  show_points?: boolean | "hover";
  /** Horizontal reference lines drawn across the chart. */
  thresholds?: ThresholdConfig[];
  /**
   * Value-based gradient coloring for all series.
   * Each stop defines the color at a specific Y value.
   * Entities with an explicit `color` are not affected.
   */
  color_thresholds?: ColorThresholdConfig[];
  /**
   * Client-side time-bucket aggregation method applied to all entities.
   * Requires `aggregate_period`. Per-entity `aggregate` overrides this value.
   */
  aggregate?: "mean" | "min" | "max" | "sum" | "last";
  /**
   * Bucket size for aggregation. Examples: "30m", "1h", "6h", "1d".
   * Required when `aggregate` is set.
   */
  aggregate_period?: string;
  /**
   * Inner padding on the top of the chart canvas (px).
   * @default 8
   */
  padding_top?: number;
  /**
   * Inner padding on the right of the chart canvas (px).
   * @default 16
   */
  padding_right?: number;
  /**
   * Inner padding on the bottom of the chart canvas (px).
   * @default 8
   */
  padding_bottom?: number;
  /**
   * Inner padding on the left of the chart canvas (px).
   * @default 16
   */
  padding_left?: number;
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
