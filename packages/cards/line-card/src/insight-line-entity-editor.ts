import {
    LitElement,
    html,
    css,
    nothing,
    type TemplateResult,
    type CSSResultGroup,
} from "lit";
import { customElement, property } from "lit/decorators.js";
import { mdiDelete } from "@mdi/js";

import {
    localize,
    DEFAULT_COLORS,
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
                    <div class="color-label">
                        ${localize("editor.field.color", this._lang)}
                    </div>
                    <input
                        type="color"
                        class="color-swatch"
                        .value=${ec.color ??
                        DEFAULT_COLORS[this.tab.index - 1] ??
                        DEFAULT_COLORS[0]}
                        @input=${(e: Event) =>
                            this._patch({
                                color: (e.target as HTMLInputElement).value,
                            })}
                    />
                </div>

                <ha-form
                    .hass=${this.hass}
                    .schema=${schema}
                    .data=${this._formData(ec)}
                    .computeLabel=${this._computeLabel}
                    @value-changed=${(
                        e: CustomEvent<{ value: Record<string, unknown> }>,
                    ) => this._onFormChanged(e.detail.value)}
                ></ha-form>
            </div>
        `;
    }

    // ---------------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------------

    private _formData(ec: InsightEntityConfig): Record<string, unknown> {
        const dashStr = Array.isArray(ec.stroke_dash)
            ? ec.stroke_dash.join(",")
            : ec.stroke_dash != null
              ? String(ec.stroke_dash)
              : "";
        return {
            entity: ec.entity ?? "",
            name: ec.name ?? "",
            y_axis: ec.y_axis ?? "left",
            hidden: ec.hidden ?? false,
            // ha-form-expandable nests data under the group name key
            appearance: {
                line_width: ec.line_width,
                fill_opacity: ec.fill_opacity,
                stroke_dash: dashStr,
            },
            data: {
                attribute: ec.attribute ?? "",
                unit: ec.unit ?? "",
                scale: ec.scale,
                invert: ec.invert ?? false,
                transform: ec.transform ?? "none",
                aggregate: ec.aggregate ?? "",
                statistics: ec.statistics ?? "",
            },
        };
    }

    private _onFormChanged(raw: Record<string, unknown>): void {
        // ha-form-expandable nests values under the group name key
        const appearance = (raw["appearance"] ?? {}) as Record<string, unknown>;
        const data = (raw["data"] ?? {}) as Record<string, unknown>;

        const dashStr = appearance["stroke_dash"] as string | undefined;
        const parsedDash: InsightEntityConfig["stroke_dash"] = dashStr
            ? dashStr.includes(",")
                ? dashStr
                      .split(",")
                      .map(Number)
                      .filter((n) => !isNaN(n))
                : Number(dashStr) || undefined
            : undefined;

        const patch: Partial<InsightEntityConfig> = Object.fromEntries(
            Object.entries({
                entity: (raw["entity"] as string) ?? "",
                name: (raw["name"] as string) || undefined,
                y_axis:
                    (raw["y_axis"] as InsightEntityConfig["y_axis"]) ??
                    undefined,
                hidden: raw["hidden"] as boolean | undefined,
                line_width: appearance["line_width"] as number | undefined,
                fill_opacity: appearance["fill_opacity"] as number | undefined,
                stroke_dash: parsedDash,
                attribute: (data["attribute"] as string) || undefined,
                unit: (data["unit"] as string) || undefined,
                scale: data["scale"] as number | undefined,
                invert: data["invert"] as boolean | undefined,
                transform:
                    (data["transform"] as InsightEntityConfig["transform"]) ||
                    undefined,
                aggregate:
                    (data["aggregate"] as InsightEntityConfig["aggregate"]) ||
                    undefined,
                statistics:
                    (data["statistics"] as InsightEntityConfig["statistics"]) ||
                    undefined,
            }).filter(([, v]) => v !== undefined),
        ) as Partial<InsightEntityConfig>;

        const detail: InsightEntityConfig = { ...this.tab.config, ...patch };
        // Explicitly remove optional fields when the user clears them
        if (!(raw["name"] as string)) delete detail.name;
        if (!dashStr) delete detail.stroke_dash;
        if (!(data["attribute"] as string)) delete detail.attribute;
        if (!(data["unit"] as string)) delete detail.unit;
        if (data["scale"] == null) delete detail.scale;

        this.dispatchEvent(new CustomEvent("onChange", { detail }));
    }

    private _patch(patch: Partial<InsightEntityConfig>): void {
        const updated: InsightEntityConfig = { ...this.tab.config, ...patch };
        this.dispatchEvent(new CustomEvent("onChange", { detail: updated }));
    }

    private _handleDelete(): void {
        this.dispatchEvent(
            new CustomEvent("onDelete", { detail: this.tab.index }),
        );
    }

    private readonly _computeLabel = (schema: {
        name: string;
        title?: string;
    }): string => {
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
