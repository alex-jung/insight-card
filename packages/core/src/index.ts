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
export { InsightBaseEditor, renderEntityPickerRow, entityPickerRowStyles } from "./editor/base-editor.js";

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

// Localization
export { localize } from "./locales/localize.js";
export type { SupportedLanguages, Translations } from "./locales/localize.js";
