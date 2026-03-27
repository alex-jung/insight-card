/**
 * Visual editor for custom:insight-bar-card
 *
 * Sections: General · Entities · Chart Style · Y Axis · Overlays · Interactions · Advanced
 */

import {
    html,
    css,
    nothing,
    type TemplateResult,
    type CSSResultGroup,
} from "lit";
import { customElement, state } from "lit/decorators.js";
import { InsightBarEntityTab } from "./insight-bar-entity-tab.js";
import { InsightBarEntityEditor } from "./insight-bar-entity-editor.js";
InsightBarEntityEditor;
import {
    mdiFormatListBulleted,
    mdiChartBox,
    mdiAxisArrow,
    mdiLayersOutline,
    mdiCog,
    mdiGestureTap,
    mdiPlus,
} from "@mdi/js";

import {
    InsightBaseEditor,
    InsightToggleButton,
    InsightBoxModel,
    InsightSectionTitle,
    SVG_ZOOM_DRAG,
    SVG_SHOW_LEGEND,
    SVG_SHOW_X_AXIS,
    SVG_SHOW_Y_AXIS,
    IMG_BAR_GROUPED,
    IMG_BAR_STACKED,
    localize,
    serialiseEntityConfig,
    type InsightBaseConfig,
    type InsightBarConfig,
    type ThresholdConfig,
    type ColorThresholdConfig,
    type LovelaceCardConfig,
} from "@insight-chart/core";

// Ensure custom elements are registered
InsightToggleButton;
InsightBoxModel;
InsightSectionTitle;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dropEmpty<T extends Record<string, unknown>>(data: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(data).filter(
            ([, v]) => v !== null && v !== undefined && v !== "",
        ),
    ) as Partial<T>;
}

// Minimal ha-form schema types (mirror HA's internal interface)
type HaFormField = {
    name: string;
    selector: Record<string, unknown>;
    required?: boolean;
};
type HaFormSchema =
    | HaFormField
    | {
          type: string;
          name: string;
          flatten?: boolean;
          schema: HaFormField[];
      };

// ---------------------------------------------------------------------------
// Schema constants
// ---------------------------------------------------------------------------

const CHART_STYLE_SCHEMA: HaFormSchema[] = [
    {
        name: "fill_opacity",
        selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" } },
    },
    {
        name: "bar_radius",
        selector: {
            number: {
                min: 0,
                max: 20,
                step: 1,
                mode: "slider",
                unit_of_measurement: "px",
            },
        },
    },
    {
        name: "grid_opacity",
        selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" } },
    },
];

const Y_AXIS_SCHEMA: HaFormSchema[] = [
    { name: "y_min", selector: { number: { step: 0.1 } } },
    { name: "y_max", selector: { number: { step: 0.1 } } },
];

const THRESHOLD_SCHEMA: HaFormField[] = [
    { name: "value", selector: { number: { step: 0.1 } } },
    { name: "label", selector: { text: {} } },
    { name: "dash", selector: { text: {} } },
];

const COLOR_THRESHOLD_SCHEMA: HaFormField[] = [
    { name: "value", selector: { number: { step: 0.1, mode: "box" } } },
];

const ADVANCED_SCHEMA: HaFormSchema[] = [
    {
        name: "update_interval",
        selector: {
            number: {
                min: 10,
                max: 3600,
                step: 10,
                mode: "box",
                unit_of_measurement: "s",
            },
        },
    },
];

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

@customElement("insight-bar-card-editor")
export class InsightBarCardEditor extends InsightBaseEditor {
    @state() private _tabs: InsightBarEntityTab[] = [];
    @state() private _currTab = "1";

    // Required by abstract base — unused since we override render()
    protected renderCardOptions(): TemplateResult {
        return html`${nothing}`;
    }

    override setConfig(config: LovelaceCardConfig): void {
        super.setConfig(config);
        const cfg = config as unknown as InsightBarConfig;
        this._tabs = (cfg.entities ?? []).map(
            (e, i) => new InsightBarEntityTab(i + 1, e),
        );
        if (this._tabs.length === 0) this._addTab();
    }

    private get _barConfig(): InsightBarConfig {
        return (this._config ?? {}) as InsightBarConfig;
    }

    override render(): TemplateResult {
        if (!this._config) {
            return html`<div class="editor-loading">
                ${localize("editor.loading", this._lang)}
            </div>`;
        }
        return html`
            <div class="editor-container">
                ${this._renderGeneralSection()} ${this._renderEntitySection()}
                ${this._renderChartStyleSection()} ${this._renderYAxisSection()}
                ${this._renderOverlaysSection()}
                ${this._renderInteractionsSection()}
                ${this._renderAdvancedSection()}
            </div>
        `;
    }

    // ---------------------------------------------------------------------------
    // General
    // ---------------------------------------------------------------------------

    private readonly _hoursOptions = [
        { value: "6", label: "6h" },
        { value: "12", label: "12h" },
        { value: "24", label: "24h" },
        { value: "48", label: "48h" },
        { value: "72", label: "72h" },
        { value: "168", label: "7d" },
        { value: "720", label: "30d" },
    ];

    private _buildGeneralSchema(): HaFormSchema[] {
        const lang = this._lang;
        return [
            { name: "title", selector: { text: {} } },
            {
                name: "layout",
                required: true,
                selector: {
                    select: {
                        mode: "box",
                        options: [
                            {
                                value: "grouped",
                                label: localize("editor.option.layout.grouped", lang),
                                image: IMG_BAR_GROUPED,
                            },
                            {
                                value: "stacked",
                                label: localize("editor.option.layout.stacked", lang),
                                image: IMG_BAR_STACKED,
                            },
                        ],
                    },
                },
            },
        ];
    }

    private _renderGeneralSection(): TemplateResult {
        const cfg = this._barConfig;
        return html`
            <div class="section">
                <ha-form
                    .hass=${this.hass}
                    .schema=${this._buildGeneralSchema()}
                    .data=${{ title: cfg.title ?? "", layout: cfg.layout ?? "grouped" }}
                    .computeLabel=${this._computeLabel}
                    @value-changed=${(
                        e: CustomEvent<{ value: Record<string, unknown> }>,
                    ) =>
                        this._updateConfig(
                            e.detail.value as unknown as Partial<InsightBaseConfig>,
                        )}
                ></ha-form>
                <div class="control-row">
                    <span class="control-label">
                        ${localize("editor.field.hours", this._lang)}
                    </span>
                    <ha-control-select
                        .options=${this._hoursOptions}
                        .value=${String(cfg.hours ?? 24)}
                        @value-changed=${(e: CustomEvent<{ value: string }>) =>
                            this._updateConfig({
                                hours: Number(e.detail.value),
                            })}
                    ></ha-control-select>
                </div>
                <div class="control-row">
                    <span class="control-label">Group by</span>
                    <ha-control-select
                        .options=${[
                            { value: "hour", label: "Hour" },
                            { value: "day", label: "Day" },
                            { value: "week", label: "Week" },
                            { value: "month", label: "Month" },
                        ]}
                        .value=${cfg.group_by ?? "day"}
                        @value-changed=${(e: CustomEvent<{ value: string }>) =>
                            this._updateConfig({
                                group_by: e.detail
                                    .value as InsightBarConfig["group_by"],
                            } as unknown as Partial<InsightBaseConfig>)}
                    ></ha-control-select>
                </div>
                <div class="control-row">
                    <span class="control-label">Aggregate</span>
                    <ha-control-select
                        .options=${[
                            { value: "mean", label: "Mean" },
                            { value: "sum", label: "Sum" },
                            { value: "min", label: "Min" },
                            { value: "max", label: "Max" },
                        ]}
                        .value=${cfg.aggregate ?? "mean"}
                        @value-changed=${(e: CustomEvent<{ value: string }>) =>
                            this._updateConfig({
                                aggregate: e.detail
                                    .value as InsightBarConfig["aggregate"],
                            } as unknown as Partial<InsightBaseConfig>)}
                    ></ha-control-select>
                </div>
            </div>
        `;
    }

    // ---------------------------------------------------------------------------
    // Entities
    // ---------------------------------------------------------------------------

    private _renderEntitySection(): TemplateResult {
        const currentTab =
            this._tabs.find((t) => t.index.toString() === this._currTab) ??
            this._tabs[0];

        return html`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${mdiFormatListBulleted}
                ></ha-svg-icon>
                <span slot="header">
                    ${localize("editor.section.entities", this._lang)}
                </span>
                <div class="entities-panel">
                    <div class="entities-toolbar">
                        <ha-tab-group @wa-tab-show=${this._handleTabChanged}>
                            ${this._tabs.map(
                                (tab) => html`
                                    <ha-tab-group-tab
                                        slot="nav"
                                        .panel=${tab.index}
                                        .active=${this._currTab ===
                                        tab.index.toString()}
                                    >
                                        ${tab.index}
                                    </ha-tab-group-tab>
                                `,
                            )}
                        </ha-tab-group>
                        <ha-icon-button
                            .path=${mdiPlus}
                            .label=${localize(
                                "editor.action.add_entity",
                                this._lang,
                            )}
                            @click=${this._addTab}
                        ></ha-icon-button>
                    </div>

                    ${currentTab
                        ? html`
                              <insight-bar-entity-editor
                                  .hass=${this.hass}
                                  .tab=${currentTab}
                                  @onChange=${this._handleEntityChange}
                                  @onDelete=${this._handleEntityDelete}
                              ></insight-bar-entity-editor>
                          `
                        : nothing}
                </div>
            </ha-expansion-panel>
        `;
    }

    private _addTab = (): void => {
        const newTab = new InsightBarEntityTab(this._tabs.length + 1, undefined);
        this._tabs = [...this._tabs, newTab];
        this._currTab = newTab.index.toString();
        this._syncEntitiesToConfig();
    };

    private _handleTabChanged(e: CustomEvent): void {
        const next = e.detail.name?.toString();
        if (next && next !== this._currTab) this._currTab = next;
    }

    private _handleEntityChange(e: CustomEvent): void {
        e.stopPropagation();
        const idx = this._tabs.findIndex(
            (t) => t.index.toString() === this._currTab,
        );
        if (idx === -1) return;
        this._tabs[idx].config = e.detail;
        this._syncEntitiesToConfig();
    }

    private _handleEntityDelete(e: CustomEvent<number>): void {
        e.stopPropagation();
        const delIndex = e.detail;
        this._tabs = this._tabs
            .filter((t) => t.index !== delIndex)
            .map((t, i) => new InsightBarEntityTab(i + 1, t.config));
        const newCurr = Math.max(1, parseInt(this._currTab) - 1);
        this._currTab =
            this._tabs.length > 0
                ? Math.min(newCurr, this._tabs.length).toString()
                : "1";
        this._syncEntitiesToConfig();
    }

    private _syncEntitiesToConfig(): void {
        this._updateConfig({
            entities: this._tabs
                .filter((t) => t.config.entity)
                .map((t) => serialiseEntityConfig(t.config)) as InsightBarConfig["entities"],
        });
    }

    // ---------------------------------------------------------------------------
    // Chart style
    // ---------------------------------------------------------------------------

    private _renderChartStyleSection(): TemplateResult {
        const cfg = this._barConfig;
        const data = {
            fill_opacity: cfg.fill_opacity ?? 1,
            bar_radius: cfg.bar_radius ?? 0,
            grid_opacity: cfg.grid_opacity ?? 1,
        };
        return html`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${mdiChartBox}
                ></ha-svg-icon>
                <span slot="header">
                    ${localize("editor.section.chart_style", this._lang)}
                </span>
                <div class="panel-content">
                    <div class="toggle-row">
                        <insight-toggle-button
                            .svg=${SVG_ZOOM_DRAG}
                            .label=${localize("editor.field.zoom", this._lang)}
                            .width=${110}
                            .height=${120}
                            ?active=${cfg.zoom === true}
                            @toggle=${() =>
                                this._updateConfig({
                                    zoom: !cfg.zoom,
                                } as unknown as Partial<InsightBaseConfig>)}
                        ></insight-toggle-button>
                        <insight-toggle-button
                            .svg=${SVG_SHOW_LEGEND}
                            .label=${localize(
                                "editor.field.show_legend",
                                this._lang,
                            )}
                            .width=${110}
                            .height=${120}
                            ?active=${cfg.show_legend !== false}
                            @toggle=${() =>
                                this._updateConfig({
                                    show_legend: cfg.show_legend === false,
                                })}
                        ></insight-toggle-button>
                        <insight-toggle-button
                            .svg=${SVG_SHOW_X_AXIS}
                            .label=${localize(
                                "editor.field.show_x_axis",
                                this._lang,
                            )}
                            .width=${110}
                            .height=${120}
                            ?active=${cfg.show_x_axis !== false}
                            @toggle=${() =>
                                this._updateConfig({
                                    show_x_axis: cfg.show_x_axis === false,
                                })}
                        ></insight-toggle-button>
                        <insight-toggle-button
                            .svg=${SVG_SHOW_Y_AXIS}
                            .label=${localize(
                                "editor.field.show_y_axis",
                                this._lang,
                            )}
                            .width=${110}
                            .height=${120}
                            ?active=${cfg.show_y_axis !== false}
                            @toggle=${() =>
                                this._updateConfig({
                                    show_y_axis: cfg.show_y_axis === false,
                                })}
                        ></insight-toggle-button>
                    </div>
                    <ha-form
                        .hass=${this.hass}
                        .schema=${CHART_STYLE_SCHEMA}
                        .data=${data}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${(
                            e: CustomEvent<{ value: typeof data }>,
                        ) =>
                            this._updateConfig(
                                e.detail.value as Partial<InsightBarConfig>,
                            )}
                    ></ha-form>
                    ${this._renderBoxModel()}
                </div>
            </ha-expansion-panel>
        `;
    }

    // ---------------------------------------------------------------------------
    // Y axis
    // ---------------------------------------------------------------------------

    private _renderYAxisSection(): TemplateResult {
        const cfg = this._barConfig;
        return html`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${mdiAxisArrow}
                ></ha-svg-icon>
                <span slot="header">
                    ${localize("editor.section.y_axis", this._lang)}
                </span>
                <div class="panel-content">
                    <ha-form
                        .hass=${this.hass}
                        .schema=${Y_AXIS_SCHEMA}
                        .data=${{ y_min: cfg.y_min, y_max: cfg.y_max }}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${(
                            e: CustomEvent<{ value: Record<string, unknown> }>,
                        ) =>
                            this._updateConfig(
                                dropEmpty(
                                    e.detail.value,
                                ) as Partial<InsightBarConfig>,
                            )}
                    ></ha-form>
                </div>
            </ha-expansion-panel>
        `;
    }

    // ---------------------------------------------------------------------------
    // Overlays (threshold lines + color thresholds)
    // ---------------------------------------------------------------------------

    private _renderOverlaysSection(): TemplateResult {
        const cfg = this._barConfig;
        const thresholds = cfg.thresholds ?? [];
        const colorThresholds = cfg.color_thresholds ?? [];
        return html`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${mdiLayersOutline}
                ></ha-svg-icon>
                <span slot="header">
                    ${localize("editor.section.overlays", this._lang)}
                </span>
                <div class="panel-content">
                    <insight-section-title
                        .label=${localize(
                            "editor.subsection.threshold_lines",
                            this._lang,
                        )}
                    ></insight-section-title>
                    ${thresholds.map(
                        (t, idx) => html`
                            <div class="overlay-row">
                                <div class="overlay-color-field">
                                    <span class="field-label">
                                        ${localize(
                                            "editor.field.color",
                                            this._lang,
                                        )}
                                    </span>
                                    <input
                                        type="color"
                                        class="color-swatch"
                                        .value=${t.color ?? "#db4437"}
                                        @input=${(e: Event) =>
                                            this._updateThresholdAt(idx, {
                                                ...t,
                                                color: (
                                                    e.target as HTMLInputElement
                                                ).value,
                                            })}
                                    />
                                </div>
                                <ha-form
                                    .hass=${this.hass}
                                    .schema=${THRESHOLD_SCHEMA}
                                    .data=${{
                                        value: t.value,
                                        label: t.label ?? "",
                                        dash: t.dash?.join(",") ?? "",
                                    }}
                                    .computeLabel=${this._computeLabel}
                                    @value-changed=${(
                                        e: CustomEvent<{
                                            value: Record<string, unknown>;
                                        }>,
                                    ) =>
                                        this._updateThresholdAt(idx, {
                                            ...t,
                                            ...this._parseThreshold(
                                                e.detail.value,
                                            ),
                                        })}
                                ></ha-form>
                                <ha-icon-button
                                    .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                                    @click=${() => this._removeThresholdAt(idx)}
                                ></ha-icon-button>
                            </div>
                        `,
                    )}
                    <ha-button @click=${this._appendThreshold}>
                        ${localize("editor.action.add_threshold", this._lang)}
                    </ha-button>

                    <insight-section-title
                        .label=${localize(
                            "editor.subsection.color_thresholds",
                            this._lang,
                        )}
                    ></insight-section-title>
                    ${colorThresholds.map(
                        (ct, idx) => html`
                            <div class="overlay-row">
                                <div class="overlay-color-field">
                                    <span class="field-label">
                                        ${localize(
                                            "editor.field.color",
                                            this._lang,
                                        )}
                                    </span>
                                    <input
                                        type="color"
                                        class="color-swatch"
                                        .value=${ct.color ?? "#03a9f4"}
                                        @input=${(e: Event) =>
                                            this._updateColorThresholdAt(idx, {
                                                ...ct,
                                                color: (
                                                    e.target as HTMLInputElement
                                                ).value,
                                            })}
                                    />
                                </div>
                                <ha-form
                                    .hass=${this.hass}
                                    .schema=${COLOR_THRESHOLD_SCHEMA}
                                    .data=${{ value: ct.value }}
                                    .computeLabel=${this._computeLabel}
                                    @value-changed=${(
                                        e: CustomEvent<{
                                            value: Record<string, unknown>;
                                        }>,
                                    ) =>
                                        this._updateColorThresholdAt(idx, {
                                            ...ct,
                                            value:
                                                (e.detail.value[
                                                    "value"
                                                ] as number) ?? 0,
                                        })}
                                ></ha-form>
                                <ha-icon-button
                                    .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                                    @click=${() =>
                                        this._removeColorThresholdAt(idx)}
                                ></ha-icon-button>
                            </div>
                        `,
                    )}
                    <ha-button @click=${this._appendColorThreshold}>
                        ${localize(
                            "editor.action.add_color_threshold",
                            this._lang,
                        )}
                    </ha-button>
                </div>
            </ha-expansion-panel>
        `;
    }

    // ---------------------------------------------------------------------------
    // Interactions
    // ---------------------------------------------------------------------------

    private readonly _interactionsSchema = [
        {
            name: "tap_action",
            selector: {
                ui_action: {
                    actions: [
                        "perform-action",
                        "assist",
                        "url",
                        "navigate",
                        "none",
                    ],
                    default_action: "more-info" as const,
                },
            },
        },
        {
            name: "",
            type: "optional_actions",
            flatten: true,
            schema: (["double_tap_action", "hold_action"] as const).map(
                (action) => ({
                    name: action,
                    selector: {
                        ui_action: {
                            actions: [
                                "more-info",
                                "perform-action",
                                "assist",
                                "navigate",
                                "url",
                                "none",
                            ],
                            default_action: "none" as const,
                        },
                    },
                }),
            ),
        },
    ];

    private _renderInteractionsSection(): TemplateResult {
        return html`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${mdiGestureTap}
                ></ha-svg-icon>
                <span slot="header">
                    ${localize("editor.section.interactions", this._lang)}
                </span>
                <div class="panel-content">
                    <ha-form
                        .hass=${this.hass}
                        .schema=${this._interactionsSchema}
                        .data=${this._config}
                        .computeLabel=${this._computeLabel}
                        @value-changed=${(
                            e: CustomEvent<{ value: Record<string, unknown> }>,
                        ) =>
                            this._updateConfig(
                                e.detail.value as Partial<InsightBarConfig>,
                            )}
                    ></ha-form>
                </div>
            </ha-expansion-panel>
        `;
    }

    // ---------------------------------------------------------------------------
    // Advanced
    // ---------------------------------------------------------------------------

    private _renderAdvancedSection(): TemplateResult {
        const cfg = this._barConfig;
        return html`
            <ha-expansion-panel outlined>
                <ha-svg-icon slot="leading-icon" .path=${mdiCog}></ha-svg-icon>
                <span slot="header">
                    ${localize("editor.section.advanced", this._lang)}
                </span>
                <div class="panel-content">
                    <ha-form
                        .hass=${this.hass}
                        .schema=${ADVANCED_SCHEMA}
                        .data=${{ update_interval: cfg.update_interval ?? 60 }}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${(
                            e: CustomEvent<{ value: Record<string, unknown> }>,
                        ) =>
                            this._updateConfig(
                                e.detail.value as Partial<InsightBarConfig>,
                            )}
                    ></ha-form>
                </div>
            </ha-expansion-panel>
        `;
    }

    // ---------------------------------------------------------------------------
    // Box model (margin + padding)
    // ---------------------------------------------------------------------------

    private _renderBoxModel(): TemplateResult {
        const cfg = this._barConfig;
        return html`
            <div class="layout-section">
                <insight-section-title
                    .label=${localize("editor.subsection.layout", this._lang)}
                ></insight-section-title>
                <insight-box-model
                    .labelOuter=${localize(
                        "editor.subsection.margin",
                        this._lang,
                    )}
                    .labelInner=${localize(
                        "editor.subsection.padding",
                        this._lang,
                    )}
                    keyOuter="margin"
                    keyInner="padding"
                    .outerTop=${cfg.margin_top ?? 0}
                    .outerRight=${cfg.margin_right ?? 0}
                    .outerBottom=${cfg.margin_bottom ?? 0}
                    .outerLeft=${cfg.margin_left ?? 0}
                    .innerTop=${cfg.padding_top ?? 8}
                    .innerRight=${cfg.padding_right ?? 16}
                    .innerBottom=${cfg.padding_bottom ?? 8}
                    .innerLeft=${cfg.padding_left ?? 16}
                    @value-changed=${(
                        e: CustomEvent<{ key: string; value: number }>,
                    ) =>
                        this._updateConfig({
                            [e.detail.key]: e.detail.value,
                        } as Partial<InsightBarConfig>)}
                ></insight-box-model>
            </div>
        `;
    }

    // ---------------------------------------------------------------------------
    // computeLabel / computeHelper
    // ---------------------------------------------------------------------------

    private readonly _computeLabel = (schema: { name: string }): string => {
        if (schema.name === "fill_opacity")
            return localize("editor.field.bar_fill_opacity", this._lang);
        return localize(`editor.field.${schema.name}`, this._lang);
    };

    private readonly _computeHelper = (schema: { name: string }): string => {
        const key = `editor.helper.${schema.name}`;
        const result = localize(key, this._lang);
        return result === key ? "" : result;
    };

    // ---------------------------------------------------------------------------
    // Threshold helpers
    // ---------------------------------------------------------------------------

    private _parseThreshold(
        raw: Record<string, unknown>,
    ): Partial<ThresholdConfig> {
        const dashStr = raw["dash"] as string | undefined;
        const dash = dashStr
            ? dashStr
                  .split(",")
                  .map(Number)
                  .filter((n) => !isNaN(n))
            : undefined;
        return {
            value: (raw["value"] as number) ?? 0,
            label: (raw["label"] as string) || undefined,
            dash: dash?.length ? dash : undefined,
        };
    }

    private readonly _appendThreshold = (): void => {
        const thresholds = [
            ...(this._barConfig.thresholds ?? []),
            { value: 0, color: "#db4437" } satisfies ThresholdConfig,
        ];
        this._updateConfig({ thresholds } as Partial<InsightBarConfig>);
    };

    private _removeThresholdAt(idx: number): void {
        const thresholds = [...(this._barConfig.thresholds ?? [])];
        thresholds.splice(idx, 1);
        this._updateConfig({ thresholds } as Partial<InsightBarConfig>);
    }

    private _updateThresholdAt(idx: number, t: ThresholdConfig): void {
        const thresholds = [...(this._barConfig.thresholds ?? [])];
        thresholds[idx] = t;
        this._updateConfig({ thresholds } as Partial<InsightBarConfig>);
    }

    private readonly _appendColorThreshold = (): void => {
        const color_thresholds = [
            ...(this._barConfig.color_thresholds ?? []),
            { value: 0, color: "#03a9f4" } satisfies ColorThresholdConfig,
        ];
        this._updateConfig({ color_thresholds } as Partial<InsightBarConfig>);
    };

    private _removeColorThresholdAt(idx: number): void {
        const color_thresholds = [...(this._barConfig.color_thresholds ?? [])];
        color_thresholds.splice(idx, 1);
        this._updateConfig({ color_thresholds } as Partial<InsightBarConfig>);
    }

    private _updateColorThresholdAt(
        idx: number,
        ct: ColorThresholdConfig,
    ): void {
        const color_thresholds = [...(this._barConfig.color_thresholds ?? [])];
        color_thresholds[idx] = ct;
        this._updateConfig({ color_thresholds } as Partial<InsightBarConfig>);
    }

    // ---------------------------------------------------------------------------
    // Styles
    // ---------------------------------------------------------------------------

    static styles: CSSResultGroup = [
        super.styles,
        css`
            ha-expansion-panel {
                margin-top: 4px;
            }

            .panel-content {
                padding: 16px 0px 16px 0px;
            }

            .entities-panel {
                padding: 8px 0;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .entities-toolbar {
                display: flex;
                align-items: flex-start;
                gap: 4px;
            }

            ha-tab-group {
                flex: 1;
            }

            .toggle-row {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-evenly;
                gap: 8px;
                padding-bottom: 20px;
            }

            .control-row {
                display: flex;
                flex-direction: column;
                gap: 4px;
                padding: 8px 0px;
            }

            .control-label {
                font-weight: 500;
            }

            ha-control-select {
                width: 100%;
            }

            .entity-row {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 4px 0;
            }
            .entity-row ha-entity-picker {
                flex: 1;
                min-width: 0;
            }
            .entity-row ha-textfield {
                width: 120px;
                flex-shrink: 0;
            }

            .overlay-row {
                display: flex;
                align-items: flex-start;
                gap: 4px;
                border: 1px solid var(--divider-color, #e0e0e0);
                border-radius: 6px;
                padding: 8px;
                margin-bottom: 6px;
            }

            .overlay-color-field {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                padding-top: 4px;
            }

            .overlay-row ha-form {
                flex: 1;
            }

            .color-swatch {
                width: 36px;
                height: 36px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                padding: 2px;
                background: transparent;
                flex-shrink: 0;
            }
        `,
    ];
}
