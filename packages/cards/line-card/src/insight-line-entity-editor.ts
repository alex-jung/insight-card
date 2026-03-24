import { LitElement, html, css, nothing, type TemplateResult, type CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";
import { mdiDelete } from "@mdi/js";

import {
  localize,
  type HomeAssistant,
  type InsightEntityConfig,
  type InsightLineConfig,
} from "@insight-chart/core";

import { InsightEntityTab } from "./insight-line-entity-tab.js";
import { buildEntitySchema } from "./insight-line-entity-schema.js";

@customElement("insight-line-entity-editor")
export class InsightLineEntityEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @property({ attribute: false }) tab!: InsightEntityTab;
  @property() chartStyle: InsightLineConfig["style"] = "area";


  private get _lang(): string {
    return this.hass?.locale?.language ?? "en";
  }


  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  render(): TemplateResult {
    if (!this.tab) return html`${nothing}`;

    const ec = this.tab.config;
    const schema = buildEntitySchema(this.chartStyle ?? "area");

    return html`
      <div class="entity-editor-content">
        <div class="entity-top-row">
          <ha-icon-button
            .path=${mdiDelete}
            @click=${this._handleDelete}
          ></ha-icon-button>
        </div>

        <div class="color-row">
          <div class="color-label">${localize("editor.field.color", this._lang)}</div>
          <input
            type="color"
            class="color-swatch"
            .value=${ec.color ?? "#4AAFFF"}
            @input=${(e: Event) =>
              this._patch({ color: (e.target as HTMLInputElement).value })}
          />
        </div>

        <ha-form
          .hass=${this.hass}
          .schema=${schema}
          .data=${this._formData(ec)}
          .computeLabel=${this._computeLabel}
          @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) =>
            this._onFormChanged(e.detail.value)}
        ></ha-form>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private _formData(ec: InsightEntityConfig): Record<string, unknown> {
    return {
      entity: ec.entity ?? "",
      y_axis: ec.y_axis ?? "left",
      hidden: ec.hidden ?? false,
      line_width: ec.line_width,
      fill_opacity: ec.fill_opacity,
      stroke_dash: Array.isArray(ec.stroke_dash)
        ? ec.stroke_dash.join(",")
        : ec.stroke_dash != null ? String(ec.stroke_dash) : "",
      attribute: ec.attribute ?? "",
      unit: ec.unit ?? "",
      scale: ec.scale,
      invert: ec.invert ?? false,
      transform: ec.transform ?? "none",
      aggregate: ec.aggregate ?? "",
      statistics: ec.statistics ?? "",
    };
  }

  private _onFormChanged(raw: Record<string, unknown>): void {
    const dashStr = raw["stroke_dash"] as string | undefined;
    const parsedDash: InsightEntityConfig["stroke_dash"] = dashStr
      ? dashStr.includes(",")
        ? dashStr.split(",").map(Number).filter((n) => !isNaN(n))
        : Number(dashStr) || undefined
      : undefined;

    const patch: Partial<InsightEntityConfig> = Object.fromEntries(
        Object.entries({
        entity: (raw["entity"] as string) ?? "",
        y_axis: (raw["y_axis"] as InsightEntityConfig["y_axis"]) ?? undefined,
        hidden: raw["hidden"] as boolean | undefined,
        line_width: raw["line_width"] as number | undefined,
        fill_opacity: raw["fill_opacity"] as number | undefined,
        stroke_dash: parsedDash,
        attribute: (raw["attribute"] as string) || undefined,
        unit: (raw["unit"] as string) || undefined,
        scale: raw["scale"] as number | undefined,
        invert: raw["invert"] as boolean | undefined,
        transform: (raw["transform"] as InsightEntityConfig["transform"]) || undefined,
        aggregate: (raw["aggregate"] as InsightEntityConfig["aggregate"]) || undefined,
        statistics: (raw["statistics"] as InsightEntityConfig["statistics"]) || undefined,
      }).filter(([, v]) => v !== undefined),
    ) as Partial<InsightEntityConfig>;

    this.dispatchEvent(new CustomEvent("onChange", { detail: patch }));
  }

  private _patch(patch: Partial<InsightEntityConfig>): void {
    const updated: InsightEntityConfig = { ...this.tab.config, ...patch };
    this.dispatchEvent(new CustomEvent("onChange", { detail: updated }));
  }

  private _handleDelete(): void {
    this.dispatchEvent(new CustomEvent("onDelete", { detail: this.tab.index }));
  }

  private readonly _computeLabel = (schema: { name: string; title?: string }): string => {
    return localize(`editor.field.${schema.name}`, this._lang);
  };

  // ---------------------------------------------------------------------------
  // Styles
  // ---------------------------------------------------------------------------

  static styles: CSSResultGroup = css`
    :host {
      display: block;
    }

    .entity-editor-content {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 8px;
    }

    .entity-top-row {
      display: flex;
      justify-content: flex-end;
    }

    .color-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .color-swatch {
      width: 100%;
      height: 36px;
      border-radius: 4px;
      cursor: pointer;
      padding: 2px;
      background: transparent;
    }
  `;
}
