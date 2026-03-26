/**
 * @insight-chart/core — barrel export
 *
 * Re-exports everything from types, lib, editor, and utils so card packages
 * can import from a single entry point:
 *
 *   import { InsightBaseCard, getEntityData, formatValue } from "@insight-chart/core";
 */

// Types
export type {
  HomeAssistant,
  HassEntity,
  HassEntityAttributes,
  HassConfig,
  HassUnitSystem,
  HassConnection,
  HassHistoryEntry,
  HassStatisticsEntry,
  HassStatisticsPeriod,
  LovelaceCard,
  LovelaceCardEditor,
  LovelaceCardConfig,
  LovelaceGridOptions,
  InsightBaseConfig,
  InsightEntityConfig,
  InsightLineConfig,
  InsightBarConfig,
  InsightHeatmapConfig,
  ColorStop,
  ThresholdConfig,
  ColorThresholdConfig,
  GridOptionsConfig,
  ActionConfig,
} from "./types/index.js";

// Data pipeline
export type { DataPoint, EntityDataSet } from "./lib/data-pipeline.js";
export {
  getEntityData,
  getMultiEntityData,
  downsample,
  invalidateCache,
} from "./lib/data-pipeline.js";

// Base card
export { InsightBaseCard } from "./lib/base-card.js";

// Base editor
export { InsightBaseEditor } from "./editor/base-editor.js";

// Utilities
export {
  DEFAULT_COLORS,
  hexToRgba,
  generateColors,
  formatValue,
  formatTime,
  formatDate,
  formatDateTime,
  formatDuration,
  computeStats,
  getBreakpoint,
  debounce,
  findNumericSensor,
  parsePeriod,
  aggregateTimeSeries,
  applyTransform,
  normaliseEntityConfig,
  serialiseEntityConfig,
} from "./utils/index.js";

export type { Stats } from "./utils/index.js";

// Components
export { InsightToggleButton } from "./components/insight-toggle-button.js";
export { InsightBoxModel } from "./components/insight-box-model.js";
export { InsightSectionTitle } from "./components/insight-section-title.js";
export {
    svgToDataUrl,
    IMG_CHART_LINE,
    IMG_CHART_AREA,
    IMG_CHART_STEP,
    IMG_CURVE_SMOOTH,
    IMG_CURVE_LINEAR,
    IMG_BAR_GROUPED,
    IMG_BAR_STACKED,
    SVG_ZOOM_DRAG,
    SVG_SHOW_LEGEND,
    SVG_SHOW_X_AXIS,
    SVG_SHOW_Y_AXIS,
} from "./components/svg-icons.js";

// Localization
export { localize } from "./locales/localize.js";
