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
import {
    ENTITY_BASE_SCHEMA,
    buildAppearanceSchema,
    DATA_SCHEMA,
} from "./insight-line-entity-schema.js";

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
        const dashStr = Array.isArray(ec.stroke_dash)
            ? ec.stroke_dash.join(",")
            : ec.stroke_dash != null
              ? String(ec.stroke_dash)
              : "";

        const baseData = {
            entity:  ec.entity ?? "",
            name:    ec.name ?? "",
            y_axis:  ec.y_axis ?? "left",
            hidden:  ec.hidden ?? false,
        };

        const appearanceData = {
            line_width:   ec.line_width,
            fill_opacity: ec.fill_opacity,
            stroke_dash:  dashStr,
        };

        const dataData = {
            attribute:  ec.attribute ?? "",
            unit:       ec.unit ?? "",
            scale:      ec.scale,
            invert:     ec.invert ?? false,
            transform:  ec.transform ?? "none",
            statistics: ec.statistics ?? "",
        };

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
                    .schema=${ENTITY_BASE_SCHEMA}
                    .data=${baseData}
                    .computeLabel=${this._computeLabel}
                    @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) =>
                        this._onBaseChanged(e.detail.value)}
                ></ha-form>

                <div class="section-title">
                    ${localize("editor.field.appearance", this._lang)}
                </div>
                <ha-form
                    .hass=${this.hass}
                    .schema=${buildAppearanceSchema(this.chartStyle ?? "area")}
                    .data=${appearanceData}
                    .computeLabel=${this._computeLabel}
                    @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) =>
                        this._onAppearanceChanged(e.detail.value)}
                ></ha-form>

                <div class="section-title">
                    ${localize("editor.field.data", this._lang)}
                </div>
                <ha-form
                    .hass=${this.hass}
                    .schema=${DATA_SCHEMA}
                    .data=${dataData}
                    .computeLabel=${this._computeLabel}
                    @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) =>
                        this._onDataChanged(e.detail.value)}
                ></ha-form>
            </div>
        `;
    }

    // ---------------------------------------------------------------------------
    // Handlers
    // ---------------------------------------------------------------------------

    private _onBaseChanged(raw: Record<string, unknown>): void {
        const detail: InsightEntityConfig = { ...this.tab.config };
        detail.entity = (raw["entity"] as string) ?? detail.entity;
        detail.y_axis = (raw["y_axis"] as InsightEntityConfig["y_axis"]) ?? detail.y_axis;
        detail.hidden = raw["hidden"] as boolean | undefined;
        if ((raw["name"] as string)) {
            detail.name = raw["name"] as string;
        } else {
            delete detail.name;
        }
        this.dispatchEvent(new CustomEvent("onChange", { detail }));
    }

    private _onAppearanceChanged(raw: Record<string, unknown>): void {
        const dashStr = raw["stroke_dash"] as string | undefined;
        const parsedDash: InsightEntityConfig["stroke_dash"] = dashStr
            ? dashStr.includes(",")
                ? dashStr.split(",").map(Number).filter((n) => !isNaN(n))
                : Number(dashStr) || undefined
            : undefined;

        const detail: InsightEntityConfig = { ...this.tab.config };
        detail.line_width   = raw["line_width"]   as number | undefined;
        detail.fill_opacity = raw["fill_opacity"]  as number | undefined;
        if (parsedDash != null) {
            detail.stroke_dash = parsedDash;
        } else {
            delete detail.stroke_dash;
        }
        this.dispatchEvent(new CustomEvent("onChange", { detail }));
    }

    private _onDataChanged(raw: Record<string, unknown>): void {
        const detail: InsightEntityConfig = { ...this.tab.config };
        if ((raw["attribute"] as string)) detail.attribute = raw["attribute"] as string;
        else delete detail.attribute;
        if ((raw["unit"] as string)) detail.unit = raw["unit"] as string;
        else delete detail.unit;
        if (raw["scale"] != null) detail.scale = raw["scale"] as number;
        else delete detail.scale;
        detail.invert     = raw["invert"] as boolean | undefined;
        detail.transform  = (raw["transform"] as InsightEntityConfig["transform"]) || undefined;
        detail.statistics = (raw["statistics"] as InsightEntityConfig["statistics"]) || undefined;
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

        .section-title {
            font-size: 0.8rem;
            font-weight: 500;
            color: var(--secondary-text-color);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding-top: 4px;
            border-top: 1px solid var(--divider-color, #e0e0e0);
        }
    `;
}
