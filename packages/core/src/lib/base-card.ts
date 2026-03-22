/**
 * InsightBaseCard — abstract LitElement base class for all InsightChart cards.
 *
 * Subclasses must implement `renderChart()` and optionally `getDefaultConfig()`.
 */

import { LitElement, html, css, type TemplateResult, type PropertyValues, type CSSResultGroup } from "lit";
import { property, query, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

import type {
  HomeAssistant,
  LovelaceGridOptions,
  InsightBaseConfig,
  InsightEntityConfig,
} from "../types/index.js";
import type { EntityDataSet } from "./data-pipeline.js";
import { getMultiEntityData, invalidateCache } from "./data-pipeline.js";
import {
  formatValue,
  computeStats,
  getBreakpoint,
  generateColors,
  debounce,
} from "../utils/index.js";

// ---------------------------------------------------------------------------
// Type helpers
// ---------------------------------------------------------------------------

/** Normalise a string | InsightEntityConfig to InsightEntityConfig */
function normaliseEntityConfig(e: string | InsightEntityConfig): InsightEntityConfig {
  return typeof e === "string" ? { entity: e } : e;
}

// ---------------------------------------------------------------------------
// Abstract base card
// ---------------------------------------------------------------------------

export abstract class InsightBaseCard extends LitElement {
  // -------------------------------------------------------------------------
  // HA-injected properties
  // -------------------------------------------------------------------------

  @property({ attribute: false })
  hass?: HomeAssistant;

  // -------------------------------------------------------------------------
  // Internal state
  // -------------------------------------------------------------------------

  @state()
  protected _config?: InsightBaseConfig;

  @state()
  protected _data: EntityDataSet[] = [];

  @state()
  protected _loading = false;

  @state()
  protected _error?: string;

  @state()
  protected _cardWidth = 400;

  /** Cached chart height in px — updated after paint, never during render */
  @state()
  protected _chartHeight = 220;

  @query(".stats-footer")
  protected _stats?: HTMLDivElement;

  @query(".card-header")
  protected _header?: HTMLDivElement;

  // -------------------------------------------------------------------------
  // Private fields
  // -------------------------------------------------------------------------

  private _resizeObserver?: ResizeObserver;
  private _refreshTimer?: ReturnType<typeof setInterval>;
  private _lastFetchHass?: HomeAssistant;
  /** Cached entity ID list — rebuilt on setConfig, used for fast state-change detection */
  private _entityIds: string[] = [];

  // -------------------------------------------------------------------------
  // Chart rebuild tracking (used by subclasses)
  // -------------------------------------------------------------------------

  /**
   * Signals that the chart must be fully rebuilt on the next sync.
   * Set to true on first render, config change, or theme change.
   * Subclasses should reset to false after completing the rebuild.
   */
  protected _needsRebuild = true;
  /** Last known theme — subclasses use this to detect theme changes. */
  protected _lastTheme?: boolean;

  // -------------------------------------------------------------------------
  // LitElement lifecycle
  // -------------------------------------------------------------------------

  connectedCallback(): void {
    super.connectedCallback();

    // Observe card size changes for responsive layout
    this._resizeObserver = new ResizeObserver(
      debounce((entries: ResizeObserverEntry[]) => {
        const width = entries[0]?.contentRect.width;
        if (width && Math.abs(width - this._cardWidth) > 4) {
          this._cardWidth = width;
        }
        // Re-measure chart height after resize settles (post-paint read)
        this._refreshChartHeight();
      }, 100),
    );
    this._resizeObserver.observe(this);

    // Periodic refresh
    const interval = (this._config?.update_interval ?? 60) * 1_000;
    this._refreshTimer = setInterval(() => {
      if (this._config && this.hass) {
        invalidateCache();
        this._fetchData();
      }
    }, interval);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    this._resizeObserver = undefined;
    if (this._refreshTimer !== undefined) {
      clearInterval(this._refreshTimer);
      this._refreshTimer = undefined;
    }
  }

  updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    // Config change always requires a full chart rebuild
    if (changedProps.has("_config")) {
      this._needsRebuild = true;
      // Layout may change (title added/removed, stats toggled) — re-measure after paint
      requestAnimationFrame(() => this._refreshChartHeight());
    }

    if (changedProps.has("hass") && this.hass && this._config) {
      // Theme change requires a full chart rebuild (colors come from computed styles).
      // Only checked on hass updates since that's the only time darkMode can change.
      const currentTheme = this.isDarkTheme;
      if (currentTheme !== this._lastTheme) {
        this._needsRebuild = true;
        this._lastTheme = currentTheme;
      }

      // Only re-fetch when hass changes if we haven't fetched yet or one of
      // our entities' states actually changed. Use cached _entityIds to avoid
      // re-normalizing the entity config array on every update.
      const shouldFetch =
        !this._lastFetchHass ||
        this._entityIds.some(
          (id) => this.hass!.states[id] !== this._lastFetchHass!.states[id],
        );

      if (shouldFetch) {
        this._fetchData();
      }
    }
  }

  // -------------------------------------------------------------------------
  // HA card API
  // -------------------------------------------------------------------------

  setConfig(config: InsightBaseConfig): void {
    if (!config) {
      throw new Error("InsightChart: setConfig called without a config object");
    }

    // Work on a copy — HA may pass a frozen object
    const cfg = { ...config } as Record<string, unknown>;

    // Allow heatmap-style configs with a single `entity` key
    if (!cfg["entities"] && cfg["entity"]) {
      cfg["entities"] = [cfg["entity"]];
    }

    const resolved = cfg as unknown as InsightBaseConfig;
    if (!resolved.entities || !Array.isArray(resolved.entities) || resolved.entities.length === 0) {
      throw new Error(
        "InsightChart: config must contain at least one entity in the 'entities' array",
      );
    }

    this._config = {
      ...this.getDefaultConfig(),
      ...resolved,
    } as InsightBaseConfig;

    // Cache entity IDs for fast state-change detection in updated()
    this._entityIds = this._config.entities.map((e) =>
      typeof e === "string" ? e : e.entity,
    );

    console.debug("[InsightChart] setConfig", this.tagName, this._config);

    // If card is already connected, fetch data immediately
    if (this.hass) {
      this._fetchData();
    }
  }

  getGridOptions(): LovelaceGridOptions {
    const overrides = this._config?.grid_options ?? {};

    return {
      columns: overrides.columns ?? 12,
      rows: overrides.rows ?? 3,
      min_columns: overrides.min_columns ?? 7,
      min_rows: overrides.min_rows ?? 3,
    };
  }

  /**
   * Returns the cached chart height. Safe to call during render — no DOM reads.
   * The value is kept up to date by _refreshChartHeight().
   */
  protected getChartHeight(): number {
    return this._chartHeight;
  }

  /**
   * Measures available chart height from the DOM and updates _chartHeight.
   * Must only be called after paint (RAF or ResizeObserver callback),
   * never during render().
   */
  private _refreshChartHeight(): void {
    const total = this.offsetHeight;
    if (total === 0) return; // not yet laid out

    let h = total;
    h -= this._header?.offsetHeight ?? 0;
    h -= this._config?.show_legend !== false ? 28 : 0;
    h -= this._config?.show_stats ? (this._stats?.offsetHeight ?? 0) : 0;
    h -= this._config?.padding_top ?? 0;
    h -= this._config?.padding_bottom ?? 0;

    const clamped = Math.max(80, h);
    if (clamped !== this._chartHeight) {
      this._chartHeight = clamped;
    }
  }

  // -------------------------------------------------------------------------
  // Data fetching
  // -------------------------------------------------------------------------

  private async _fetchData(): Promise<void> {
    if (!this._config || !this.hass) return;

    const entities = this._config.entities.map((e) =>
      typeof e === "string" ? e : e.entity,
    );
    console.debug("[InsightChart] fetchData start", this.tagName, { entities, hours: this._config.hours });

    this._loading = true;
    this._error = undefined;
    this._lastFetchHass = this.hass;

    try {
      const hours = this._config.hours ?? 24;
      this._data = await getMultiEntityData(
        this.hass,
        this._config.entities,
        hours,
      );
      console.debug(
        "[InsightChart] fetchData done",
        this.tagName,
        this._data.map((d) => ({ entity: d.entityId, points: d.data.length })),
      );
    } catch (err) {
      this._error =
        err instanceof Error ? err.message : "Failed to fetch data";
      console.error("[InsightChart] fetchData error", this.tagName, err);
    } finally {
      this._loading = false;
    }
  }

  // -------------------------------------------------------------------------
  // Abstract / overridable methods
  // -------------------------------------------------------------------------

  /** Subclasses must return the chart TemplateResult */
  protected abstract renderChart(): TemplateResult;

  /** Subclasses can provide default config values */
  protected getDefaultConfig(): Partial<InsightBaseConfig> {
    return { hours: 24, update_interval: 60, show_stats: false };
  }

  // -------------------------------------------------------------------------
  // Computed helpers
  // -------------------------------------------------------------------------

  /** All entities normalised to InsightEntityConfig objects */
  get entityConfigs(): InsightEntityConfig[] {
    return (this._config?.entities ?? []).map(normaliseEntityConfig);
  }

  get isMobile(): boolean {
    return this._cardWidth < 400;
  }

  get isDarkTheme(): boolean {
    if (!this.hass) return false;
    if (this._config?.theme === "dark") return true;
    if (this._config?.theme === "light") return false;
    return this.hass.themes?.darkMode ?? false;
  }

  protected _getEntityColor(index: number, overrideColor?: string): string {
    if (overrideColor) return overrideColor;
    return generateColors(index + 1)[index];
  }

  // -------------------------------------------------------------------------
  // Stats footer helpers
  // -------------------------------------------------------------------------

  private _renderStatsFooter(): TemplateResult {
    const statsRows = this._data.map((dataset, i) => {
      const values = dataset.data.map((p) => p.v);
      if (values.length === 0) return html``;
      const stats = computeStats(values);
      const ec = this.entityConfigs[i];
      const color = this._getEntityColor(i, ec?.color);
      const unit = dataset.unit ? ` ${dataset.unit}` : "";
      const trendIcon =
        stats.trend === "up" ? "↑" : stats.trend === "down" ? "↓" : "→";

      return html`
        <div class="stats-row">
          <span class="stats-name" style="color:${color}">
            ${dataset.friendlyName}
          </span>
          <span class="stats-item">
            <span class="stats-label">min</span>
            ${formatValue(stats.min)}${unit}
          </span>
          <span class="stats-item">
            <span class="stats-label">avg</span>
            ${formatValue(stats.mean)}${unit}
          </span>
          <span class="stats-item">
            <span class="stats-label">max</span>
            ${formatValue(stats.max)}${unit}
          </span>
          <span class="stats-item">
            <span class="stats-label">now</span>
            ${formatValue(stats.current)}${unit}
            <span class="stats-trend">${trendIcon}</span>
          </span>
        </div>
      `;
    });

    return html`<div class="stats-footer">${statsRows}</div>`;
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  render(): TemplateResult {
    if (!this._config) {
      return html`<ha-card><div class="error">No configuration.</div></ha-card>`;
    }

    const breakpoint = getBreakpoint(this._cardWidth);
    const chartHeight = this._chartHeight;

      const styleContent = {
          paddingTop: `${this._config.padding_top ?? 0}px`,
          paddingBottom: `${this._config.padding_bottom ?? 0}px`,
          paddingLeft: `${this._config.padding_left ?? 0}px`,
          paddingRight: `${this._config.padding_right ?? 0}px`,
      }

    return html`
      <ha-card>
        ${this._config.title
          ? html`<h1 class="card-header">${this._config.title}</h1>`
          : ""}

        <div class="card-content" style="${styleMap(styleContent)}">
          ${this._loading && this._data.length === 0
            ? html`<div class="loading-container" style="height:${chartHeight}px">
                <div class="loading-spinner"></div>
              </div>`
            : this._error
            ? html`<div class="error" style="height:${chartHeight}px">
                <span class="error-icon">⚠</span> ${this._error}
              </div>`
            : !this._loading && this._data.every((d) => d.data.length === 0)
            ? html`<div class="no-data" style="height:${chartHeight}px">
                Nicht genug Daten vorhanden
              </div>`
            : html`
                <div
                  class="chart-container"
                >
                  ${this.renderChart()}
                </div>
              `}

          ${this._config.show_stats && this._data.length > 0 && !this._error
            ? this._renderStatsFooter()
            : ""}
        </div>
      </ha-card>
    `;
  }

  // -------------------------------------------------------------------------
  // Styles
  // -------------------------------------------------------------------------

  static styles: CSSResultGroup = css`
    :host {
      display: block;
      height: 100%;
    }

    ha-card {
      overflow: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .card-header {
      font-size: var(--ha-card-header-font-size, 1.125rem);
      font-weight: 500;
      color: var(--primary-text-color);
      padding: 12px 16px 0;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    // .card-content {
    //   padding: 0px 0px;
    // }

    .chart-container {
      position: relative;
      width: 100%;
    }

    /* Loading */
    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--divider-color, #e0e0e0);
      border-top-color: var(--primary-color, #03a9f4);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Error */
    .error {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--error-color, #db4437);
      font-size: 0.875rem;
    }

    .error-icon {
      font-size: 1.2em;
    }

    /* No data */
    .no-data {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--disabled-text-color, #9e9e9e);
      font-size: 0.875rem;
    }

    /* Stats footer */
    .stats-footer {
      border-top: 1px solid var(--divider-color, #e0e0e0);
      margin-top: 8px;
      padding-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stats-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: baseline;
      font-size: 0.75rem;
      color: var(--secondary-text-color);
    }

    .stats-name {
      font-weight: 500;
      min-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .stats-item {
      display: flex;
      align-items: baseline;
      gap: 2px;
    }

    .stats-label {
      color: var(--disabled-text-color, #9e9e9e);
      margin-right: 2px;
      font-size: 0.7em;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .stats-trend {
      margin-left: 2px;
      font-size: 0.85em;
    }
  `;
}
