import { html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { InsightBaseEditor, type InsightBarConfig } from "@insight-chart/core";

@customElement("insight-bar-card-editor")
export class InsightBarCardEditor extends InsightBaseEditor {
  protected renderCardOptions(): TemplateResult {
    const cfg = this._config as InsightBarConfig | undefined;
    const groupBy = cfg?.group_by ?? "day";
    const aggregate = cfg?.aggregate ?? "mean";
    const layout = cfg?.layout ?? "grouped";

    return html`
      <div class="section">
        <div class="section-header">Grouping</div>
        <div class="preset-buttons">
          ${(["hour", "day", "week", "month"] as const).map(
            (g) => html`
              <mwc-button
                class="preset-btn ${groupBy === g ? "active" : ""}"
                dense
                @click=${() =>
                  this._updateConfig({ group_by: g } as Partial<InsightBarConfig>)}
              >${g}</mwc-button>
            `,
          )}
        </div>
      </div>

      <div class="section">
        <div class="section-header">Aggregation</div>
        <div class="preset-buttons">
          ${(["mean", "sum", "min", "max"] as const).map(
            (a) => html`
              <mwc-button
                class="preset-btn ${aggregate === a ? "active" : ""}"
                dense
                @click=${() =>
                  this._updateConfig({ aggregate: a } as Partial<InsightBarConfig>)}
              >${a}</mwc-button>
            `,
          )}
        </div>
      </div>

      <div class="section">
        <div class="section-header">Layout</div>
        <div class="preset-buttons">
          ${(["grouped", "stacked"] as const).map(
            (l) => html`
              <mwc-button
                class="preset-btn ${layout === l ? "active" : ""}"
                dense
                @click=${() =>
                  this._updateConfig({ layout: l } as Partial<InsightBarConfig>)}
              >${l}</mwc-button>
            `,
          )}
        </div>
      </div>
    `;
  }
}
