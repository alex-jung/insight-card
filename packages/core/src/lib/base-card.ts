/**
 * InsightBaseCard — abstract LitElement base class for all InsightChart cards.
 *
 * Subclasses must implement `renderChart()` and optionally `getDefaultConfig()`.
 */

import { LitElement, html, css, type TemplateResult, type PropertyValues, type CSSResultGroup } from "lit";
import { property, state } from "lit/decorators.js";

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
  getChartHeight,
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

  // -------------------------------------------------------------------------
  // Private fields
  // -------------------------------------------------------------------------

  private _resizeObserver?: ResizeObserver;
  private _refreshTimer?: ReturnType<typeof setInterval>;
  private _lastFetchHass?: HomeAssistant;

  // -------------------------------------------------------------------------
  // LitElement lifecycle
  // -------------------------------------------------------------------------

  connectedCallback(): void {
    super.connectedCallback();

    // Observe card width changes for responsive layout
    this._resizeObserver = new ResizeObserver(
      debounce((entries: ResizeObserverEntry[]) => {
        const width = entries[0]?.contentRect.width;
        if (width && Math.abs(width - this._cardWidth) > 4) {
          this._cardWidth = width;
        }
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

    if (changedProps.has("hass") && this.hass && this._config) {
      // Only re-fetch when hass changes if we haven't fetched yet or the
      // states relevant to our entities have actually changed.
      const shouldFetch =
        !this._lastFetchHass ||
        this.entityConfigs.some(
          (ec) =>
            this.hass!.states[ec.entity] !==
            this._lastFetchHass!.states[ec.entity],
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

    console.debug("[InsightChart] setConfig", this.tagName, this._config);

    // If card is already connected, fetch data immediately
    if (this.hass) {
      this._fetchData();
    }
  }

  getCardSize(): number {
    return 3;
  }

  getGridOptions(): LovelaceGridOptions {
    const overrides = this._config?.grid_options ?? {};
    return {
      columns: overrides.columns ?? 4,
      rows: overrides.rows ?? 3,
      min_columns: overrides.min_columns ?? 2,
      min_rows: overrides.min_rows ?? 2,
    };
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
    const chartHeight = getChartHeight(this._cardWidth);

    return html`
      <ha-card>
        ${this._config.title
          ? html`<h1 class="card-header">${this._config.title}</h1>`
          : ""}

        <div class="card-content">
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
                  class="chart-container breakpoint-${breakpoint}"
                  style="height:${chartHeight}px"
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
    }

    ha-card {
      height: 100%;
      overflow: hidden;
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

    .card-content {
      padding: 8px 16px 16px;
    }

    .chart-container {
      position: relative;
      width: 100%;
      overflow: hidden;
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
