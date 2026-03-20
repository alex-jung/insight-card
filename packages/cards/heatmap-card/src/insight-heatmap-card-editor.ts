import { html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { InsightBaseEditor, type InsightHeatmapConfig } from "@insight-chart/core";

@customElement("insight-heatmap-card-editor")
export class InsightHeatmapCardEditor extends InsightBaseEditor {
  protected renderCardOptions(): TemplateResult {
    const cfg = this._config as InsightHeatmapConfig | undefined;
    const layout = cfg?.layout ?? "hour_day";
    const colorScale = cfg?.color_scale ?? "YlOrRd";

    return html`
      <div class="section">
        <div class="section-header">Layout</div>
        <div class="preset-buttons">
          ${(["hour_day", "weekday_hour"] as const).map(
            (l) => html`
              <mwc-button
                class="preset-btn ${layout === l ? "active" : ""}"
                dense
                @click=${() =>
                  this._updateConfig({ layout: l } as Partial<InsightHeatmapConfig>)}
              >${l.replace("_", " / ")}</mwc-button>
            `,
          )}
        </div>
      </div>

      <div class="section">
        <div class="section-header">Color scale</div>
        <div class="preset-buttons">
          ${(["YlOrRd", "Blues", "Greens", "RdBu"] as const).map(
            (c) => html`
              <mwc-button
                class="preset-btn ${colorScale === c ? "active" : ""}"
                dense
                @click=${() =>
                  this._updateConfig({ color_scale: c } as Partial<InsightHeatmapConfig>)}
              >${c}</mwc-button>
            `,
          )}
        </div>
      </div>
    `;
  }
}
