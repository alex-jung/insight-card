/**
 * InsightBaseEditor — abstract LitElement base class for all InsightChart
 * card editors.
 *
 * Provides shared UI sections (title, entities, time range, stats toggle).
 * Subclasses implement `renderCardOptions()` with card-specific controls.
 */

import { LitElement, html, css, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";

import type {
  HomeAssistant,
  LovelaceCardEditor,
  LovelaceCardConfig,
  InsightBaseConfig,
  InsightEntityConfig,
} from "../types/index.js";

// Time-range presets available in every editor
const TIME_PRESETS: { label: string; hours: number }[] = [
  { label: "6h",  hours: 6 },
  { label: "12h", hours: 12 },
  { label: "24h", hours: 24 },
  { label: "48h", hours: 48 },
  { label: "72h", hours: 72 },
  { label: "7d",  hours: 168 },
];

/** Normalise a string | InsightEntityConfig to InsightEntityConfig */
function normaliseEntity(e: string | InsightEntityConfig): InsightEntityConfig {
  return typeof e === "string" ? { entity: e } : e;
}

// ---------------------------------------------------------------------------
// Abstract base editor
// ---------------------------------------------------------------------------

export abstract class InsightBaseEditor
  extends LitElement
  implements LovelaceCardEditor
{
  // HA-injected
  @property({ attribute: false })
  hass?: HomeAssistant;

  // Config set by HA
  @state()
  protected _config?: InsightBaseConfig;

  // -------------------------------------------------------------------------
  // LovelaceCardEditor API
  // -------------------------------------------------------------------------

  setConfig(config: LovelaceCardConfig): void {
    this._config = config as unknown as InsightBaseConfig;
  }

  // -------------------------------------------------------------------------
  // Abstract / overridable
  // -------------------------------------------------------------------------

  /** Card-specific options — implemented by each card editor */
  protected abstract renderCardOptions(): TemplateResult;

  // -------------------------------------------------------------------------
  // Shared section renderers
  // -------------------------------------------------------------------------

  protected renderTitleSection(): TemplateResult {
    return html`
      <div class="section">
        <div class="section-header">General</div>
        <ha-textfield
          label="Title (optional)"
          .value=${this._config?.title ?? ""}
          @change=${(e: Event) =>
            this._updateConfig({
              title: (e.target as HTMLInputElement).value || undefined,
            })}
        ></ha-textfield>
      </div>
    `;
  }

  protected renderEntitySection(): TemplateResult {
    const entities: InsightEntityConfig[] = (
      this._config?.entities ?? []
    ).map(normaliseEntity);

    return html`
      <div class="section">
        <div class="section-header">Entities</div>

        ${entities.map(
          (ec, index) => html`
            <div class="entity-row">
              <ha-entity-picker
                label="Entity ${index + 1}"
                .hass=${this.hass}
                .value=${ec.entity}
                allow-custom-entity
                @value-changed=${(e: CustomEvent<{ value: string }>) =>
                  this._updateEntity(index, { entity: e.detail.value })}
              ></ha-entity-picker>

              <ha-textfield
                label="Name"
                .value=${ec.name ?? ""}
                @change=${(e: Event) =>
                  this._updateEntity(index, {
                    name: (e.target as HTMLInputElement).value || undefined,
                  })}
              ></ha-textfield>

              <div class="entity-row-actions">
                <ha-icon-button
                  label="Remove entity"
                  .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                  @click=${() => this._removeEntity(index)}
                ></ha-icon-button>
              </div>
            </div>
          `,
        )}

        <mwc-button
          class="add-entity-btn"
          @click=${this._addEntity}
        >
          + Add entity
        </mwc-button>
      </div>
    `;
  }

  protected renderTimeRangeSection(): TemplateResult {
    const currentHours = this._config?.hours ?? 24;

    return html`
      <div class="section">
        <div class="section-header">Time range</div>
        <div class="preset-buttons">
          ${TIME_PRESETS.map(
            ({ label, hours }) => html`
              <mwc-button
                class="preset-btn ${currentHours === hours ? "active" : ""}"
                dense
                @click=${() => this._updateConfig({ hours })}
              >
                ${label}
              </mwc-button>
            `,
          )}
        </div>
      </div>
    `;
  }

  protected renderStatsToggle(): TemplateResult {
    return html`
      <div class="section">
        <div class="toggle-row">
          <span class="toggle-label">Show statistics (min / avg / max)</span>
          <ha-switch
            .checked=${this._config?.show_stats ?? false}
            @change=${(e: Event) =>
              this._updateConfig({
                show_stats: (e.target as HTMLInputElement).checked,
              })}
          ></ha-switch>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  render(): TemplateResult {
    if (!this._config) {
      return html`<div class="editor-loading">Loading editor…</div>`;
    }

    return html`
      <div class="editor-container">
        ${this.renderTitleSection()}
        ${this.renderEntitySection()}
        ${this.renderTimeRangeSection()}
        ${this.renderCardOptions()}
        ${this.renderStatsToggle()}
      </div>
    `;
  }

  // -------------------------------------------------------------------------
  // Config mutation helpers
  // -------------------------------------------------------------------------

  protected _updateConfig(partial: Partial<InsightBaseConfig>): void {
    if (!this._config) return;
    this._config = { ...this._config, ...partial };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _addEntity(): void {
    if (!this._config) return;
    const entities: (string | InsightEntityConfig)[] = [
      ...(this._config.entities ?? []),
      { entity: "" },
    ];
    this._updateConfig({ entities });
  }

  private _removeEntity(index: number): void {
    if (!this._config) return;
    const entities = [...(this._config.entities ?? [])];
    entities.splice(index, 1);
    this._updateConfig({ entities });
  }

  private _updateEntity(
    index: number,
    patch: Partial<InsightEntityConfig>,
  ): void {
    if (!this._config) return;
    const entities = (this._config.entities ?? []).map(normaliseEntity);
    entities[index] = { ...entities[index], ...patch };
    this._updateConfig({ entities });
  }

  // -------------------------------------------------------------------------
  // Styles
  // -------------------------------------------------------------------------

  static styles = css`
    :host {
      display: block;
    }

    .editor-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 4px 0;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .section-header {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--secondary-text-color);
      padding-bottom: 2px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }

    ha-textfield {
      width: 100%;
    }

    ha-entity-picker {
      width: 100%;
    }

    .entity-row {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 8px;
      align-items: flex-end;
    }

    .entity-row-actions {
      display: flex;
      align-items: center;
    }

    .add-entity-btn {
      align-self: flex-start;
      margin-top: 4px;
    }

    .preset-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .preset-btn {
      min-width: 48px;
    }

    .preset-btn.active {
      --mdc-theme-primary: var(--primary-color);
      background-color: var(--primary-color);
      color: var(--text-primary-color);
      border-radius: 4px;
    }

    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .toggle-label {
      font-size: 0.875rem;
      color: var(--primary-text-color);
    }

    .editor-loading {
      color: var(--secondary-text-color);
      font-size: 0.875rem;
      padding: 16px;
      text-align: center;
    }
  `;
}
