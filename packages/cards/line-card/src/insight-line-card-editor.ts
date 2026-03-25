/**
 * Visual editor for custom:insight-line-card
 *
 * Uses ha-form with JSON schema for scalar/toggle/select fields.
 * Custom HTML only where ha-form has no matching selector (color hex, arrays).
 */

import {
    html,
    css,
    nothing,
    type TemplateResult,
    type CSSResultGroup,
} from "lit";
import { customElement, state } from "lit/decorators.js";
import {
    mdiFormatListBulleted,
    mdiPlus,
    mdiChartLine,
    mdiAxisArrow,
    mdiDatabaseClock,
    mdiLayersOutline,
    mdiCog,
    mdiGestureTap,
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
    localize,
    serialiseEntityConfig,
    type InsightLineConfig,
    type InsightEntityConfig,
    type ThresholdConfig,
    type ColorThresholdConfig,
    type LovelaceCardConfig,
} from "@insight-chart/core";

// Ensure custom elements are registered
InsightToggleButton;
InsightBoxModel;
InsightSectionTitle;

import { InsightEntityTab } from "./insight-line-entity-tab.js";
import "./insight-line-entity-editor.js";
import {
    type HaFormField,
    type HaFormSchema,
} from "./insight-line-entity-schema.js";
import {
    IMG_CHART_LINE,
    IMG_CHART_AREA,
    IMG_CHART_STEP,
    IMG_CURVE_SMOOTH,
    IMG_CURVE_LINEAR,
} from "@insight-chart/core";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Remove null / undefined / "" from a ha-form value-changed payload */
function dropEmpty<T extends Record<string, unknown>>(data: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(data).filter(
            ([, v]) => v !== null && v !== undefined && v !== "",
        ),
    ) as Partial<T>;
}

// ---------------------------------------------------------------------------
// Schema builders
// ---------------------------------------------------------------------------

function buildChartStyleSchema(cfg: InsightLineConfig): HaFormSchema[] {
    const isArea = (cfg.style ?? "area") === "area";
    return [
        {
            name: "line_width",
            selector: {
                number: {
                    min: 0.5,
                    max: 10,
                    step: 0.5,
                    mode: "slider",
                    unit_of_measurement: "px",
                },
            },
        },
        ...(isArea
            ? [
                  {
                      name: "fill_opacity",
                      selector: {
                          number: {
                              min: 0,
                              max: 1,
                              step: 0.05,
                              mode: "slider" as const,
                          },
                      },
                  } satisfies HaFormField,
              ]
            : []),
        {
            name: "grid_opacity",
            selector: {
                number: { min: 0, max: 1, step: 0.05, mode: "slider" },
            },
        },
    ];
}

function buildGeneralSchema(
    lang: string,
    cfg: InsightLineConfig,
): HaFormSchema[] {
    const isStep = cfg.style === "step";
    return [
        {
            name: "title",
            selector: { text: {} },
        },
        {
            name: "style",
            required: true,
            selector: {
                select: {
                    mode: "box",
                    options: [
                        {
                            value: "line",
                            label: localize("editor.option.style.line", lang),
                            image: IMG_CHART_LINE,
                        },
                        {
                            value: "area",
                            label: localize("editor.option.style.area", lang),
                            image: IMG_CHART_AREA,
                        },
                        {
                            value: "step",
                            label: localize("editor.option.style.step", lang),
                            image: IMG_CHART_STEP,
                        },
                    ],
                },
            },
        },
        ...(!isStep
            ? [
                  {
                      name: "curve",
                      selector: {
                          select: {
                              mode: "box" as const,
                              options: [
                                  {
                                      value: "smooth",
                                      label: localize(
                                          "editor.option.curve.smooth",
                                          lang,
                                      ),
                                      image: IMG_CURVE_SMOOTH,
                                  },
                                  {
                                      value: "linear",
                                      label: localize(
                                          "editor.option.curve.linear",
                                          lang,
                                      ),
                                      image: IMG_CURVE_LINEAR,
                                  },
                              ],
                          },
                      },
                  } satisfies HaFormField,
              ]
            : []),
    ];
}

const Y_AXIS_GENERAL_SCHEMA: HaFormSchema[] = [
    { name: "logarithmic", selector: { boolean: {} as Record<string, never> } },
    {
        name: "decimals",
        selector: { number: { min: 0, max: 6, step: 1, mode: "box" } },
    },
];

const Y_AXIS_PRIMARY_SCHEMA: HaFormSchema[] = [
    { name: "y_min", selector: { number: { step: 0.1, mode: "box" } } },
    { name: "y_max", selector: { number: { step: 0.1, mode: "box" } } },
];

const Y_AXIS_SECONDARY_SCHEMA: HaFormSchema[] = [
    {
        name: "y_min_secondary",
        selector: { number: { step: 0.1, mode: "box" } },
    },
    {
        name: "y_max_secondary",
        selector: { number: { step: 0.1, mode: "box" } },
    },
];

function buildAggregationSchema(cfg: InsightLineConfig): HaFormSchema[] {
    return [
        {
            name: "aggregate",
            selector: {
                select: {
                    options: [
                        { value: "none", label: "None" },
                        { value: "mean", label: "Mean" },
                        { value: "min", label: "Min" },
                        { value: "max", label: "Max" },
                        { value: "sum", label: "Sum" },
                        { value: "last", label: "Last" },
                    ],
                },
            },
        },
        ...(cfg.aggregate && (cfg.aggregate as string) !== "none"
            ? [
                  {
                      name: "aggregate_period",
                      selector: {
                          select: {
                              options: [
                                  { value: "5m", label: "5 min" },
                                  { value: "15m", label: "15 min" },
                                  { value: "30m", label: "30 min" },
                                  { value: "1h", label: "1 h" },
                                  { value: "3h", label: "3 h" },
                                  { value: "6h", label: "6 h" },
                                  { value: "12h", label: "12 h" },
                                  { value: "1d", label: "1 day" },
                              ],
                          },
                      },
                  } satisfies HaFormField,
              ]
            : []),
    ];
}

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

const THRESHOLD_SCHEMA: HaFormField[] = [
    { name: "value", selector: { number: { step: 0.1, mode: "box" } } },
    { name: "label", selector: { text: {} } },
    { name: "dash", selector: { text: {} } },
];

const COLOR_THRESHOLD_SCHEMA: HaFormField[] = [
    { name: "value", selector: { number: { step: 0.1, mode: "box" } } },
];

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

@customElement("insight-line-card-editor")
export class InsightLineCardEditor extends InsightBaseEditor {
    @state() private _tabs: InsightEntityTab[] = [];
    @state() private _currTab = "1";

    private get _lineConfig(): InsightLineConfig {
        return (this._config ?? {}) as InsightLineConfig;
    }

    override setConfig(config: LovelaceCardConfig): void {
        super.setConfig(config);
        const cfg = config as unknown as InsightLineConfig;
        this._tabs = (cfg.entities ?? []).map(
            (e, i) =>
                new InsightEntityTab(i + 1, e as InsightEntityConfig | string),
        );
        if (this._tabs.length === 0) this._addTab();
    }

    // Required by abstract base — unused since we override render()
    protected renderCardOptions(): TemplateResult {
        return html`${nothing}`;
    }

    // ---------------------------------------------------------------------------
    // Render
    // ---------------------------------------------------------------------------

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
                ${this._renderAggregationSection()}
                ${this._renderOverlaysSection()}
                ${this._renderInteractionsSection()}
                ${this._renderAdvancedSection()}
            </div>
        `;
    }

    private readonly _hoursOptions = [
        { value: "6", label: "6h" },
        { value: "12", label: "12h" },
        { value: "24", label: "24h" },
        { value: "48", label: "48h" },
        { value: "72", label: "72h" },
        { value: "168", label: "7d" },
    ];

    private _renderGeneralSection(): TemplateResult {
        const cfg = this._lineConfig;
        const data = {
            title: cfg.title ?? "",
            style: cfg.style ?? "area",
            curve: cfg.curve ?? "smooth",
        };

        return html`
            <div class="section">
                <ha-form
                    .hass=${this.hass}
                    .schema=${buildGeneralSchema(this._lang, cfg)}
                    .data=${data}
                    .computeLabel=${this._computeLabel}
                    .computeHelper=${this._computeHelper}
                    @value-changed=${(
                        e: CustomEvent<{ value: Record<string, unknown> }>,
                    ) =>
                        this._updateConfig(
                            e.detail.value as Partial<InsightLineConfig>,
                        )}
                ></ha-form>
                <div class="control-row">
                    <span class="control-label"
                        >${localize("editor.field.hours", this._lang)}</span
                    >
                    <ha-control-select
                        .options=${this._hoursOptions}
                        .value=${String(cfg.hours ?? 24)}
                        @value-changed=${(e: CustomEvent<{ value: string }>) =>
                            this._updateConfig({
                                hours: Number(e.detail.value),
                            })}
                    ></ha-control-select>
                </div>
            </div>
        `;
    }

    // ---------------------------------------------------------------------------
    // Entities (expandable + tabs)
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
                <span slot="header"
                    >${localize("editor.section.entities", this._lang)}</span
                >
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
                              <insight-line-entity-editor
                                  .hass=${this.hass}
                                  .tab=${currentTab}
                                  .chartStyle=${this._lineConfig.style ??
                                  "area"}
                                  @onChange=${this._handleEntityChange}
                                  @onDelete=${this._handleEntityDelete}
                              ></insight-line-entity-editor>
                          `
                        : nothing}
                </div>
            </ha-expansion-panel>
        `;
    }

    private _addTab = (): void => {
        const newTab = new InsightEntityTab(this._tabs.length + 1, undefined);
        this._tabs = [...this._tabs, newTab];
        this._currTab = newTab.index.toString();
        this._syncEntitiesToConfig();
    };

    private _handleTabChanged(e: CustomEvent): void {
        const next = e.detail.name?.toString();
        if (next && next !== this._currTab) this._currTab = next;
    }

    private _handleEntityChange(e: CustomEvent<InsightEntityConfig>): void {
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
            .map((t, i) => new InsightEntityTab(i + 1, t.config));
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
                .map((t) =>
                    serialiseEntityConfig(t.config),
                ) as InsightLineConfig["entities"],
        });
    }

    // ---------------------------------------------------------------------------
    // Chart style
    // ---------------------------------------------------------------------------

    private _renderChartStyleSection(): TemplateResult {
        const cfg = this._lineConfig;
        const showPointsStr =
            cfg.show_points === true
                ? "true"
                : cfg.show_points === "hover"
                  ? "hover"
                  : "false";
        const data = {
            line_width: cfg.line_width ?? 2,
            fill_opacity: cfg.fill_opacity ?? 0.15,
            grid_opacity: cfg.grid_opacity ?? 1,
        };
        const timeFormatOptions = [
            {
                value: "auto",
                label: localize("editor.option.time_format.auto", this._lang),
            },
            {
                value: "time",
                label: localize("editor.option.time_format.time", this._lang),
            },
            {
                value: "date",
                label: localize("editor.option.time_format.date", this._lang),
            },
            {
                value: "datetime",
                label: localize(
                    "editor.option.time_format.datetime",
                    this._lang,
                ),
            },
        ];
        const tooltipOptions = [
            {
                value: "datetime",
                label: localize("editor.option.tooltip.datetime", this._lang),
            },
            {
                value: "time",
                label: localize("editor.option.tooltip.time", this._lang),
            },
            {
                value: "date",
                label: localize("editor.option.tooltip.date", this._lang),
            },
        ];
        const pointsOptions = [
            {
                value: "false",
                label: localize("editor.option.points.none", this._lang),
            },
            {
                value: "hover",
                label: localize("editor.option.points.hover", this._lang),
            },
            {
                value: "true",
                label: localize("editor.option.points.always", this._lang),
            },
        ];

        return html`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${mdiChartLine}
                ></ha-svg-icon>
                <span slot="header"
                    >${localize("editor.section.chart_style", this._lang)}</span
                >
                <div class="panel-content">
                    <div class="toggle-row">
                        <insight-toggle-button
                            .svg=${SVG_ZOOM_DRAG}
                            .label=${localize("editor.field.zoom", this._lang)}
                            .width=${110}
                            .height=${120}
                            ?active=${cfg.zoom !== false}
                            @toggle=${() =>
                                this._updateConfig({
                                    zoom: cfg.zoom === false,
                                } as Partial<InsightLineConfig>)}
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

                    <div class="control-row">
                        <span class="control-label"
                            >${localize(
                                "editor.field.show_points",
                                this._lang,
                            )}</span
                        >
                        <ha-control-select
                            .options=${pointsOptions}
                            .value=${showPointsStr}
                            @value-changed=${(
                                e: CustomEvent<{ value: string }>,
                            ) => {
                                const v = e.detail.value;
                                const newCfg = {
                                    ...this._config,
                                } as InsightLineConfig;
                                if (v === "true") newCfg.show_points = true;
                                else if (v === "hover")
                                    newCfg.show_points = "hover";
                                else delete newCfg.show_points; // false is the default — omit from config
                                this._config = newCfg;
                                this.dispatchEvent(
                                    new CustomEvent("config-changed", {
                                        detail: { config: newCfg },
                                        bubbles: true,
                                        composed: true,
                                    }),
                                );
                            }}
                        ></ha-control-select>
                    </div>
                    <div class="control-row">
                        <span class="control-label"
                            >${localize(
                                "editor.field.tooltip_format",
                                this._lang,
                            )}</span
                        >
                        <ha-control-select
                            .options=${tooltipOptions}
                            .value=${cfg.tooltip_format ?? "datetime"}
                            @value-changed=${(
                                e: CustomEvent<{ value: string }>,
                            ) =>
                                this._updateConfig({
                                    tooltip_format: e.detail
                                        .value as InsightLineConfig["tooltip_format"],
                                } as Partial<InsightLineConfig>)}
                        ></ha-control-select>
                    </div>
                    <div class="control-row">
                        <span class="control-label"
                            >${localize(
                                "editor.field.time_format",
                                this._lang,
                            )}</span
                        >
                        <ha-control-select
                            .options=${timeFormatOptions}
                            .value=${cfg.time_format ?? "auto"}
                            @value-changed=${(
                                e: CustomEvent<{ value: string }>,
                            ) =>
                                this._updateConfig({
                                    time_format: e.detail
                                        .value as InsightLineConfig["time_format"],
                                } as Partial<InsightLineConfig>)}
                        ></ha-control-select>
                    </div>
                    <ha-form
                        .hass=${this.hass}
                        .schema=${buildChartStyleSchema(cfg)}
                        .data=${data}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${(
                            e: CustomEvent<{ value: typeof data }>,
                        ) =>
                            this._updateConfig(
                                e.detail.value as Partial<InsightLineConfig>,
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
        const cfg = this._lineConfig;
        const primaryData = {
            logarithmic: cfg.logarithmic ?? false,
            decimals: cfg.decimals,
            y_min: cfg.y_min,
            y_max: cfg.y_max,
        };
        const secondaryData = {
            y_min_secondary: cfg.y_min_secondary,
            y_max_secondary: cfg.y_max_secondary,
        };

        return html`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${mdiAxisArrow}
                ></ha-svg-icon>
                <span slot="header"
                    >${localize("editor.section.y_axis", this._lang)}</span
                >
                <div class="panel-content">
                    <ha-form
                        .hass=${this.hass}
                        .schema=${Y_AXIS_GENERAL_SCHEMA}
                        .data=${primaryData}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${(
                            e: CustomEvent<{ value: Record<string, unknown> }>,
                        ) =>
                            this._updateConfig(
                                dropEmpty(
                                    e.detail.value,
                                ) as Partial<InsightLineConfig>,
                            )}
                    ></ha-form>
                    <insight-section-title
                        .label=${localize(
                            "editor.subsection.primary_axis",
                            this._lang,
                        )}
                    ></insight-section-title>
                    <ha-form
                        .hass=${this.hass}
                        .schema=${Y_AXIS_PRIMARY_SCHEMA}
                        .data=${primaryData}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${(
                            e: CustomEvent<{ value: Record<string, unknown> }>,
                        ) =>
                            this._updateConfig(
                                dropEmpty(
                                    e.detail.value,
                                ) as Partial<InsightLineConfig>,
                            )}
                    ></ha-form>
                    <insight-section-title
                        .label=${localize(
                            "editor.subsection.secondary_axis",
                            this._lang,
                        )}
                    ></insight-section-title>
                    <ha-form
                        .hass=${this.hass}
                        .schema=${Y_AXIS_SECONDARY_SCHEMA}
                        .data=${secondaryData}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${(
                            e: CustomEvent<{ value: Record<string, unknown> }>,
                        ) =>
                            this._updateConfig(
                                dropEmpty(
                                    e.detail.value,
                                ) as Partial<InsightLineConfig>,
                            )}
                    ></ha-form>
                </div>
            </ha-expansion-panel>
        `;
    }

    // ---------------------------------------------------------------------------
    // Data aggregation
    // ---------------------------------------------------------------------------

    private _renderAggregationSection(): TemplateResult {
        const cfg = this._lineConfig;
        const data = {
            aggregate: cfg.aggregate ?? "none",
            aggregate_period: cfg.aggregate_period ?? "",
        };

        return html`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${mdiDatabaseClock}
                ></ha-svg-icon>
                <span slot="header"
                    >${localize(
                        "editor.section.data_aggregation",
                        this._lang,
                    )}</span
                >
                <div class="panel-content">
                    <ha-form
                        .hass=${this.hass}
                        .schema=${buildAggregationSchema(cfg)}
                        .data=${data}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${(
                            e: CustomEvent<{ value: Record<string, unknown> }>,
                        ) => {
                            const v = e.detail.value;
                            const next = {
                                ...this._lineConfig,
                                ...dropEmpty(v),
                            };
                            if (!v["aggregate"] || v["aggregate"] === "none") {
                                delete next.aggregate;
                                delete next.aggregate_period;
                            } else if (!v["aggregate_period"]) {
                                delete next.aggregate_period;
                            }
                            this._config = next;
                            this.dispatchEvent(
                                new CustomEvent("config-changed", {
                                    detail: { config: next },
                                    bubbles: true,
                                    composed: true,
                                }),
                            );
                        }}
                    ></ha-form>
                </div>
            </ha-expansion-panel>
        `;
    }

    // ---------------------------------------------------------------------------
    // Overlays (threshold lines + color thresholds)
    // ---------------------------------------------------------------------------

    private _renderOverlaysSection(): TemplateResult {
        const cfg = this._lineConfig;
        const thresholds = cfg.thresholds ?? [];
        const colorThresholds = cfg.color_thresholds ?? [];

        return html`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${mdiLayersOutline}
                ></ha-svg-icon>
                <span slot="header"
                    >${localize("editor.section.overlays", this._lang)}</span
                >
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
                                    <span class="field-label"
                                        >${localize(
                                            "editor.field.color",
                                            this._lang,
                                        )}</span
                                    >
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
                    <ha-button @click=${this._appendThreshold}
                        >${localize(
                            "editor.action.add_threshold",
                            this._lang,
                        )}</ha-button
                    >

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
                                    <span class="field-label"
                                        >${localize(
                                            "editor.field.color",
                                            this._lang,
                                        )}</span
                                    >
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
                    <ha-button @click=${this._appendColorThreshold}
                        >${localize(
                            "editor.action.add_color_threshold",
                            this._lang,
                        )}</ha-button
                    >
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
                <span slot="header"
                    >${localize(
                        "editor.section.interactions",
                        this._lang,
                    )}</span
                >
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
                                e.detail.value as Partial<InsightLineConfig>,
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
        const cfg = this._lineConfig;
        const data = {
            update_interval: cfg.update_interval ?? 60,
        };

        return html`
            <ha-expansion-panel outlined>
                <ha-svg-icon slot="leading-icon" .path=${mdiCog}></ha-svg-icon>
                <span slot="header"
                    >${localize("editor.section.advanced", this._lang)}</span
                >
                <div class="panel-content">
                    <ha-form
                        .hass=${this.hass}
                        .schema=${ADVANCED_SCHEMA}
                        .data=${data}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${(
                            e: CustomEvent<{ value: Record<string, unknown> }>,
                        ) =>
                            this._updateConfig(
                                e.detail.value as Partial<InsightLineConfig>,
                            )}
                    ></ha-form>
                </div>
            </ha-expansion-panel>
        `;
    }

    private _renderBoxModel(): TemplateResult {
        const cfg = this._lineConfig;
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
                        } as Partial<InsightLineConfig>)}
                ></insight-box-model>
            </div>
        `;
    }

    // ---------------------------------------------------------------------------
    // computeLabel
    // ---------------------------------------------------------------------------

    private readonly _computeLabel = (schema: HaFormSchema): string => {
        if ("title" in schema) return schema.title as string;
        return localize(`editor.field.${schema.name}`, this._lang);
    };

    private readonly _computeHelper = (schema: HaFormSchema): string => {
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
            ...(this._lineConfig.thresholds ?? []),
            { value: 0, color: "#db4437" } satisfies ThresholdConfig,
        ];
        this._updateConfig({ thresholds } as Partial<InsightLineConfig>);
    };

    private _removeThresholdAt(index: number): void {
        const thresholds = [...(this._lineConfig.thresholds ?? [])];
        thresholds.splice(index, 1);
        this._updateConfig({ thresholds } as Partial<InsightLineConfig>);
    }

    private _updateThresholdAt(index: number, t: ThresholdConfig): void {
        const thresholds = [...(this._lineConfig.thresholds ?? [])];
        thresholds[index] = t;
        this._updateConfig({ thresholds } as Partial<InsightLineConfig>);
    }

    // ---------------------------------------------------------------------------
    // Color threshold helpers
    // ---------------------------------------------------------------------------

    private readonly _appendColorThreshold = (): void => {
        const color_thresholds = [
            ...(this._lineConfig.color_thresholds ?? []),
            { value: 0, color: "#03a9f4" } satisfies ColorThresholdConfig,
        ];
        this._updateConfig({ color_thresholds } as Partial<InsightLineConfig>);
    };

    private _removeColorThresholdAt(index: number): void {
        const color_thresholds = [...(this._lineConfig.color_thresholds ?? [])];
        color_thresholds.splice(index, 1);
        this._updateConfig({ color_thresholds } as Partial<InsightLineConfig>);
    }

    private _updateColorThresholdAt(
        index: number,
        ct: ColorThresholdConfig,
    ): void {
        const color_thresholds = [...(this._lineConfig.color_thresholds ?? [])];
        color_thresholds[index] = ct;
        this._updateConfig({ color_thresholds } as Partial<InsightLineConfig>);
    }

    // ---------------------------------------------------------------------------
    // Styles
    // ---------------------------------------------------------------------------

    static styles: CSSResultGroup = [
        super.styles,
        css`
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

            ha-expansion-panel {
                margin-top: 4px;
            }

            .panel-content {
                padding: 16px 0px 16px 0px;
            }

            .toggle-row {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-evenly;
                gap: 8px;
                padding: 20px 0px;
            }

            .control-row {
                display: flex;
                flex-direction: column;
                gap: 4px;
                padding: 20px 0px;
            }

            .control-label {
                font-weight: 500;
            }

            ha-control-select {
                width: 100%;
            }

            .field-label {
                font-size: 0.875rem;
                color: var(--secondary-text-color);
                white-space: nowrap;
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

            .color-text {
                flex: 1;
            }

            .add-entity-btn {
                align-self: flex-start;
                margin-top: 4px;
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

            .layout-section {
                margin: 16px 0;
            }
        `,
    ];
}
