/**
 * Visual editor for custom:insight-line-card
 */

import { html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

import {
  InsightBaseEditor,
  type InsightLineConfig,
} from "@insight-chart/core";

type LineStyle = "line" | "area" | "step";
type CurveStyle = "smooth" | "linear" | "step";

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

@customElement("insight-line-card-editor")
export class InsightLineCardEditor extends InsightBaseEditor {
  protected get _lineConfig(): InsightLineConfig {
    return (this._config ?? {}) as InsightLineConfig;
  }

  protected renderCardOptions(): TemplateResult {
    const cfg = this._lineConfig;
    const style: LineStyle = cfg.style ?? "area";
    const curve: CurveStyle = cfg.curve ?? "smooth";
    const lineWidth = cfg.line_width ?? 2;
    const fillOpacity = cfg.fill_opacity ?? 0.15;
    const zoom = cfg.zoom !== false;

    return html`
      <!-- Style selector -->
      <div class="section">
        <div class="section-header">Chart style</div>

        <div class="button-group" role="group" aria-label="Chart style">
          ${(["line", "area", "step"] as LineStyle[]).map(
            (s) => html`
              <button
                class="style-btn ${style === s ? "active" : ""}"
                @click=${() => this._updateConfig({ style: s } as Partial<InsightLineConfig>)}
              >
                ${s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            `,
          )}
        </div>
      </div>

      <!-- Curve selector (only relevant for line / area) -->
      ${style !== "step"
        ? html`
            <div class="section">
              <div class="section-header">Interpolation</div>
              <div class="button-group" role="group" aria-label="Curve style">
                ${(["smooth", "linear"] as CurveStyle[]).map(
                  (c) => html`
                    <button
                      class="style-btn ${curve === c ? "active" : ""}"
                      @click=${() =>
                        this._updateConfig({ curve: c } as Partial<InsightLineConfig>)}
                    >
                      ${c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                  `,
                )}
              </div>
            </div>
          `
        : ""}

      <!-- Zoom toggle -->
      <div class="section">
        <div class="toggle-row">
          <span class="toggle-label">Enable drag-to-zoom</span>
          <ha-switch
            .checked=${zoom}
            @change=${(e: Event) =>
              this._updateConfig({
                zoom: (e.target as HTMLInputElement).checked,
              } as Partial<InsightLineConfig>)}
          ></ha-switch>
        </div>
      </div>

      <!-- Line width -->
      <div class="section">
        <div class="section-header">Line width</div>
        <div class="slider-row">
          <input
            type="range"
            min="1"
            max="6"
            step="0.5"
            .value=${String(lineWidth)}
            @input=${(e: Event) =>
              this._updateConfig({
                line_width: parseFloat((e.target as HTMLInputElement).value),
              } as Partial<InsightLineConfig>)}
          />
          <span class="slider-value">${lineWidth}px</span>
        </div>
      </div>

      <!-- Fill opacity (only for area style) -->
      ${style === "area"
        ? html`
            <div class="section">
              <div class="section-header">Fill opacity</div>
              <div class="slider-row">
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  .value=${String(fillOpacity)}
                  @input=${(e: Event) =>
                    this._updateConfig({
                      fill_opacity: parseFloat(
                        (e.target as HTMLInputElement).value,
                      ),
                    } as Partial<InsightLineConfig>)}
                />
                <span class="slider-value"
                  >${Math.round(fillOpacity * 100)}%</span
                >
              </div>
            </div>
          `
        : ""}
    `;
  }

  // Append additional styles to the base editor styles
  static get styles() {
    return [
      super.styles,
      // Inline additional styles using adoptedStyleSheets-compatible approach
      (() => {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`
          .button-group {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
          }

          .style-btn {
            padding: 6px 14px;
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 4px;
            background: transparent;
            color: var(--primary-text-color);
            cursor: pointer;
            font-size: 0.875rem;
            transition: background 0.15s, color 0.15s;
          }

          .style-btn.active {
            background: var(--primary-color, #03a9f4);
            color: var(--text-primary-color, #fff);
            border-color: var(--primary-color, #03a9f4);
          }

          .slider-row {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .slider-row input[type="range"] {
            flex: 1;
            accent-color: var(--primary-color, #03a9f4);
          }

          .slider-value {
            min-width: 36px;
            text-align: right;
            font-size: 0.875rem;
            color: var(--secondary-text-color);
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
        `);
        return sheet;
      })(),
    ];
  }
}
