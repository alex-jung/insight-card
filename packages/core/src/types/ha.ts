/**
 * Home Assistant type stubs.
 *
 * HA does not publish official TypeScript types (open issue since 2019), so we
 * maintain our own minimal stubs that cover everything InsightChart needs.
 */

// ---------------------------------------------------------------------------
// Primitive HA types
// ---------------------------------------------------------------------------

export type HassStatisticsPeriod = "5minute" | "hour" | "day" | "week" | "month";

// ---------------------------------------------------------------------------
// Entity / State
// ---------------------------------------------------------------------------

export interface HassEntityAttributes {
  friendly_name?: string;
  unit_of_measurement?: string;
  device_class?: string;
  state_class?: string;
  [key: string]: unknown;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: HassEntityAttributes;
  last_changed: string;
  last_updated: string;
  context?: { id: string; parent_id?: string | null; user_id?: string | null };
}

// ---------------------------------------------------------------------------
// History API response
// ---------------------------------------------------------------------------

export interface HassHistoryEntry {
  // Legacy format (pre-2022.10)
  entity_id?: string;
  state?: string;
  attributes?: HassEntityAttributes;
  last_changed?: string;
  last_updated?: string;
  // Minimal response format (>= 2022.10): compressed keys
  s?: string;   // state
  a?: HassEntityAttributes; // attributes
  lu?: number;  // last_updated (Unix seconds)
  lc?: number;  // last_changed (Unix seconds, only when differs from lu)
}

// ---------------------------------------------------------------------------
// Statistics API response
// ---------------------------------------------------------------------------

export interface HassStatisticsEntry {
  statistic_id: string;
  start: string;
  end: string;
  mean?: number | null;
  min?: number | null;
  max?: number | null;
  sum?: number | null;
  state?: number | null;
  last_reset?: string | null;
}

// ---------------------------------------------------------------------------
// HA Config
// ---------------------------------------------------------------------------

export interface HassUnitSystem {
  length: string;
  mass: string;
  pressure: string;
  temperature: string;
  volume: string;
  wind_speed: string;
  accumulated_precipitation: string;
}

export interface HassConfig {
  latitude: number;
  longitude: number;
  elevation: number;
  unit_system: HassUnitSystem;
  location_name: string;
  time_zone: string;
  components: string[];
  version: string;
}

// ---------------------------------------------------------------------------
// WebSocket connection
// ---------------------------------------------------------------------------

export interface HassConnection {
  subscribeMessage<T>(
    callback: (msg: T) => void,
    subscribeMessage: Record<string, unknown>,
  ): Promise<() => void>;
  sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T>;
}

// ---------------------------------------------------------------------------
// Top-level HomeAssistant object (injected by HA into every card)
// ---------------------------------------------------------------------------

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  config: HassConfig;
  connection: HassConnection;
  language: string;
  locale: {
    language: string;
    number_format: string;
    time_format: string;
    date_format: string;
    first_weekday: string;
  };
  themes: {
    default_theme: string;
    default_dark_theme: string | null;
    themes: Record<string, Record<string, string>>;
    darkMode: boolean;
  };
  user?: {
    id: string;
    name: string;
    is_admin: boolean;
  };
  /** Generic WebSocket call — covers History, Statistics, etc. */
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  /** Service calls (e.g. light.turn_on) */
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ): Promise<void>;
}

// ---------------------------------------------------------------------------
// Lovelace interfaces
// ---------------------------------------------------------------------------

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

export interface LovelaceGridOptions {
  columns?: number | "full";
  rows?: number | "auto";
  min_columns?: number;
  min_rows?: number;
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
  getCardSize?(): number;
  getGridOptions?(): LovelaceGridOptions;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: LovelaceCardConfig): void;
}
