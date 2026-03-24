/**
 * InsightBaseCard — abstract LitElement base class for all InsightChart cards.
 *
 * Subclasses must implement `renderChart()` and optionally `getDefaultConfig()`.
 */

import { LitElement, html, css, type TemplateResult, type PropertyValues, type CSSResultGroup, nothing } from "lit";
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
    generateColors,
    normaliseEntityConfig,
} from "../utils/index.js";

// ---------------------------------------------------------------------------
// Type helpers
// ---------------------------------------------------------------------------


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

    @query(".card-header")
    protected _header?: HTMLDivElement;

    // -------------------------------------------------------------------------
    // Private fields
    // -------------------------------------------------------------------------

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
        console.debug("[base-card] connected, hass", this.hass);

        super.connectedCallback();

        if (this.hass) {
            this._fetchData();
        }

        this._startRefreshTimer();
    }

    private _startRefreshTimer(): void {
        if (this._refreshTimer !== undefined) {
            clearInterval(this._refreshTimer);
        }
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
        if (this._refreshTimer !== undefined) {
            clearInterval(this._refreshTimer);
            this._refreshTimer = undefined;
        }
    }

    updated(changedProps: PropertyValues): void {
        console.debug("[base-card] updated");

        super.updated(changedProps);

        // Config change always requires a full chart rebuild
        if (changedProps.has("_config")) {
            this._needsRebuild = true;
            this._startRefreshTimer();
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
        console.debug("[base-card] setConfig");

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
        this._entityIds = this._config.entities.map((e) => normaliseEntityConfig(e).entity);

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

    // -------------------------------------------------------------------------
    // Data fetching
    // -------------------------------------------------------------------------

    private async _fetchData(): Promise<void> {
        if (!this._config || !this.hass) return;

        const entities = this._config.entities.map((e) => normaliseEntityConfig(e).entity);
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
            // simulate loading state
            // await new Promise(resolve => setTimeout(resolve, 20000));

            // simulate error state
            // throw new Error("Dummy error");
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
        return { hours: 24, update_interval: 60 };
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
    // Render helpers
    // -------------------------------------------------------------------------

    private _renderLoading(): TemplateResult {
        return html`<div class="loading-container">
        <div class="loading-spinner"></div>
        </div>`;
    }

    private _renderError(): TemplateResult {
        return html`<div class="error">
          <span class="error-icon">⚠</span> ${this._error}
          </div>`;
    }

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------

    render(): TemplateResult {
        if (!this._config) {
            return html`<ha-card><div class="error">No configuration.</div></ha-card>`;
        }

        console.debug("[Base-card] render", this.offsetHeight);

        const styleContent = {
            marginTop: `${this._config.margin_top ?? 0}px`,
            marginBottom: `${this._config.margin_bottom ?? 0}px`,
            marginLeft: `${this._config.margin_left ?? 0}px`,
            marginRight: `${this._config.margin_right ?? 0}px`,
        }

        return html`
          <ha-card>
            ${this._config.title
                ? html`<h1 class="card-header">${this._config.title}</h1>`
                : nothing}

            <div class="card-content" style="${styleMap(styleContent)}">
              ${this._loading && this._data.length === 0 ? this._renderLoading() : nothing}
              ${this._error ? this._renderError() : nothing}
              <div class="chart-container">
                ${this.renderChart()}
              </div>
            </div>
          </ha-card>`;
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

      .chart-container {
        width: 100%;
        height: 250px;
      }

      /* Loading */
      .loading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        inset: 0;
        z-index: 1;
        background: color-mix(in srgb, var(--card-background-color, #fff) 95%, transparent);
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
        position: absolute;
        inset: 0;
        z-index: 1;
        background: color-mix(in srgb, var(--card-background-color, #fff) 95%, transparent);
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
      `;
}
