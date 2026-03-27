/**
 * Visual editor for custom:insight-heatmap-card
 *
 * Sections: General · Color Scale · Appearance · Interactions · Advanced
 */

import {
    html,
    css,
    nothing,
    type TemplateResult,
    type CSSResultGroup,
} from "lit";
import { customElement } from "lit/decorators.js";
import { mdiPalette, mdiChartBox, mdiCog, mdiGestureTap } from "@mdi/js";

import {
    InsightBaseEditor,
    InsightToggleButton,
    InsightBoxModel,
    InsightSectionTitle,
    SVG_SHOW_X_AXIS,
    SVG_SHOW_Y_AXIS,
    SVG_SHOW_COLORBAR,
    SVG_SHOW_CELL_VALUES,
    SVG_REVERSE_SCALE,
    localize,
    normaliseEntityConfig,
    type InsightBaseConfig,
    type InsightHeatmapConfig,
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

// Minimal ha-form schema types
type HaFormField = {
    name: string;
    selector: Record<string, unknown>;
    required?: boolean;
};
type HaFormSchema =
    | HaFormField
    | { type: string; name: string; flatten?: boolean; schema: HaFormField[] };

// ---------------------------------------------------------------------------
// Schema constants
// ---------------------------------------------------------------------------

const VALUE_RANGE_SCHEMA: HaFormSchema[] = [
    { name: "value_min", selector: { number: { step: 0.1 } } },
    { name: "value_max", selector: { number: { step: 0.1 } } },
];

const CELL_SCHEMA: HaFormSchema[] = [
    {
        name: "cell_gap",
        selector: {
            number: {
                min: 0,
                max: 10,
                step: 0.5,
                mode: "slider",
                unit_of_measurement: "px",
            },
        },
    },
    {
        name: "cell_radius",
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
];

const CELL_DECIMALS_SCHEMA: HaFormSchema[] = [
    {
        name: "cell_value_decimals",
        selector: { number: { min: 0, max: 5, step: 1, mode: "box" } },
    },
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

const PALETTE_OPTIONS = [
    { value: "YlOrRd", label: "YlOrRd — Yellow · Orange · Red" },
    { value: "Blues", label: "Blues" },
    { value: "Greens", label: "Greens" },
    { value: "RdBu", label: "RdBu — Red · White · Blue" },
    { value: "Viridis", label: "Viridis" },
    { value: "Plasma", label: "Plasma" },
    { value: "Purples", label: "Purples" },
    { value: "Oranges", label: "Oranges" },
];

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------

@customElement("insight-heatmap-card-editor")
export class InsightHeatmapCardEditor extends InsightBaseEditor {
    // Required by abstract base — unused since we override render()
    protected renderCardOptions(): TemplateResult {
        return html`${nothing}`;
    }

    private get _cfg(): InsightHeatmapConfig {
        return (this._config ?? {}) as InsightHeatmapConfig;
    }

    override render(): TemplateResult {
        if (!this._config) {
            return html`<div class="editor-loading">
                ${localize("editor.loading", this._lang)}
            </div>`;
        }
        return html`
            <div class="editor-container">
                ${this._renderGeneralSection()}
                ${this._renderColorScaleSection()}
                ${this._renderAppearanceSection()}
                ${this._renderInteractionsSection()}
                ${this._renderAdvancedSection()}
            </div>
        `;
    }

    // -------------------------------------------------------------------------
    // General
    // -------------------------------------------------------------------------

    private readonly _hoursOptions = [
        { value: "24", label: "24h" },
        { value: "48", label: "48h" },
        { value: "72", label: "72h" },
        { value: "168", label: "7d" },
        { value: "720", label: "30d" },
    ];

    private readonly _layoutOptions = [
        { value: "hour_day", label: "Hour / Day" },
        { value: "weekday_hour", label: "Weekday / Hour" },
        { value: "month_day", label: "Month / Day" },
    ];

    private _buildGeneralSchema() {
        const entityConfig = this._cfg.entities?.[0];
        const entity = entityConfig
            ? normaliseEntityConfig(entityConfig).entity
            : "";
        return {
            schema: [
                { name: "title", selector: { text: {} } },
                { name: "_entity", selector: { entity: {} }, required: true },
            ] as HaFormSchema[],
            data: { title: this._cfg.title ?? "", _entity: entity },
        };
    }

    private _renderGeneralSection(): TemplateResult {
        const cfg = this._cfg;
        const { schema, data } = this._buildGeneralSchema();

        return html`
            <div class="section">
                <ha-form
                    .hass=${this.hass}
                    .schema=${schema}
                    .data=${data}
                    .computeLabel=${this._computeLabel}
                    @value-changed=${(
                        e: CustomEvent<{ value: Record<string, unknown> }>,
                    ) => {
                        const { _entity, ...rest } = e.detail.value;
                        const patch: Partial<InsightBaseConfig> = dropEmpty(
                            rest,
                        ) as Partial<InsightBaseConfig>;
                        if (typeof _entity === "string" && _entity) {
                            patch.entities = [{ entity: _entity }];
                        }
                        this._updateConfig(patch);
                    }}
                ></ha-form>

                <div class="control-row">
                    <span class="control-label">
                        ${localize("editor.field.hours", this._lang)}
                    </span>
                    <ha-control-select
                        .options=${this._hoursOptions}
                        .value=${String(cfg.hours ?? 168)}
                        @value-changed=${(e: CustomEvent<{ value: string }>) =>
                            this._updateConfig({
                                hours: Number(e.detail.value),
                            })}
                    ></ha-control-select>
                </div>

                <div class="control-row">
                    <span class="control-label">Layout</span>
                    <ha-control-select
                        .options=${this._layoutOptions}
                        .value=${cfg.layout ?? "hour_day"}
                        @value-changed=${(e: CustomEvent<{ value: string }>) =>
                            this._updateConfig({
                                layout: e.detail
                                    .value as InsightHeatmapConfig["layout"],
                            } as unknown as Partial<InsightBaseConfig>)}
                    ></ha-control-select>
                </div>
            </div>
        `;
    }

    // -------------------------------------------------------------------------
    // Color Scale
    // -------------------------------------------------------------------------

    private _renderColorScaleSection(): TemplateResult {
        const cfg = this._cfg;
        const colorScale =
            typeof cfg.color_scale === "string" ? cfg.color_scale : "YlOrRd";

        return html`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${mdiPalette}
                ></ha-svg-icon>
                <span slot="header">
                    ${localize("editor.section.color_scale", this._lang)}
                </span>
                <div class="panel-content">
                    <ha-form
                        .hass=${this.hass}
                        .schema=${[
                            {
                                name: "color_scale",
                                selector: {
                                    select: {
                                        options: PALETTE_OPTIONS,
                                        mode: "dropdown",
                                    },
                                },
                            },
                        ]}
                        .data=${{ color_scale: colorScale }}
                        .computeLabel=${this._computeLabel}
                        @value-changed=${(
                            e: CustomEvent<{ value: Record<string, unknown> }>,
                        ) =>
                            this._updateConfig(
                                e.detail
                                    .value as unknown as Partial<InsightBaseConfig>,
                            )}
                    ></ha-form>

                    <div class="toggle-row palette-toggle-row">
                        <insight-toggle-button
                            .svg=${SVG_REVERSE_SCALE}
                            label="Reverse scale"
                            .width=${110}
                            .height=${100}
                            ?active=${cfg.reverse_scale === true}
                            @toggle=${() =>
                                this._updateConfig({
                                    reverse_scale: !cfg.reverse_scale,
                                } as unknown as Partial<InsightBaseConfig>)}
                        ></insight-toggle-button>
                    </div>

                    <ha-form
                        .hass=${this.hass}
                        .schema=${VALUE_RANGE_SCHEMA}
                        .data=${{
                            value_min: cfg.value_min,
                            value_max: cfg.value_max,
                        }}
                        .computeLabel=${this._computeLabel}
                        .computeHelper=${this._computeHelper}
                        @value-changed=${(
                            e: CustomEvent<{ value: Record<string, unknown> }>,
                        ) =>
                            this._updateConfig(
                                dropEmpty(
                                    e.detail.value,
                                ) as unknown as Partial<InsightBaseConfig>,
                            )}
                    ></ha-form>
                </div>
            </ha-expansion-panel>
        `;
    }

    // -------------------------------------------------------------------------
    // Appearance
    // -------------------------------------------------------------------------

    private _renderAppearanceSection(): TemplateResult {
        const cfg = this._cfg;
        const showCellValues = cfg.show_cell_values === true;
        const emptyColor = cfg.empty_color ?? "transparent";

        return html`
            <ha-expansion-panel outlined>
                <ha-svg-icon
                    slot="leading-icon"
                    .path=${mdiChartBox}
                ></ha-svg-icon>
                <span slot="header">
                    ${localize("editor.section.appearance", this._lang)}
                </span>
                <div class="panel-content">
                    <div class="toggle-row">
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
                        <insight-toggle-button
                            .svg=${SVG_SHOW_COLORBAR}
                            label="Show colorbar"
                            .width=${110}
                            .height=${120}
                            ?active=${cfg.show_colorbar === true}
                            @toggle=${() =>
                                this._updateConfig({
                                    show_colorbar: !cfg.show_colorbar,
                                } as unknown as Partial<InsightBaseConfig>)}
                        ></insight-toggle-button>
                        <insight-toggle-button
                            .svg=${SVG_SHOW_CELL_VALUES}
                            label="Cell values"
                            .width=${110}
                            .height=${120}
                            ?active=${cfg.show_cell_values === true}
                            @toggle=${() =>
                                this._updateConfig({
                                    show_cell_values: !cfg.show_cell_values,
                                } as unknown as Partial<InsightBaseConfig>)}
                        ></insight-toggle-button>
                    </div>

                    <ha-form
                        .hass=${this.hass}
                        .schema=${CELL_SCHEMA}
                        .data=${{
                            cell_gap: cfg.cell_gap ?? 1,
                            cell_radius: cfg.cell_radius ?? 0,
                        }}
                        .computeLabel=${this._computeLabel}
                        @value-changed=${(
                            e: CustomEvent<{ value: Record<string, unknown> }>,
                        ) =>
                            this._updateConfig(
                                e.detail
                                    .value as unknown as Partial<InsightBaseConfig>,
                            )}
                    ></ha-form>

                    ${showCellValues
                        ? html`
                              <div class="cell-decimals-form">
                                  <ha-form
                                      .hass=${this.hass}
                                      .schema=${CELL_DECIMALS_SCHEMA}
                                      .data=${{
                                          cell_value_decimals:
                                              cfg.cell_value_decimals,
                                      }}
                                      .computeLabel=${this._computeLabel}
                                      @value-changed=${(
                                          e: CustomEvent<{
                                              value: Record<string, unknown>;
                                          }>,
                                      ) =>
                                          this._updateConfig(
                                              dropEmpty(
                                                  e.detail.value,
                                              ) as unknown as Partial<InsightBaseConfig>,
                                          )}
                                  ></ha-form>
                              </div>
                          `
                        : nothing}

                    <div class="control-row">
                        <span class="control-label">Empty cell color</span>
                        <div class="color-row">
                            ${emptyColor !== "transparent"
                                ? html`
                                      <input
                                          type="color"
                                          class="color-swatch"
                                          .value=${emptyColor}
                                          @input=${(e: Event) =>
                                              this._updateConfig({
                                                  empty_color: (
                                                      e.target as HTMLInputElement
                                                  ).value,
                                              } as unknown as Partial<InsightBaseConfig>)}
                                      />
                                      <ha-button
                                          @click=${() =>
                                              this._updateConfig({
                                                  empty_color: "transparent",
                                              } as unknown as Partial<InsightBaseConfig>)}
                                          >Transparent</ha-button
                                      >
                                  `
                                : html`
                                      <span class="color-transparent-label"
                                          >Transparent</span
                                      >
                                      <ha-button
                                          @click=${() =>
                                              this._updateConfig({
                                                  empty_color: "#888888",
                                              } as unknown as Partial<InsightBaseConfig>)}
                                          >Set color</ha-button
                                      >
                                  `}
                        </div>
                    </div>

                    ${this._renderBoxModel()}
                </div>
            </ha-expansion-panel>
        `;
    }

    private _renderBoxModel(): TemplateResult {
        const cfg = this._cfg;
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
                    .innerRight=${cfg.padding_right ?? 8}
                    .innerBottom=${cfg.padding_bottom ?? 4}
                    .innerLeft=${cfg.padding_left ?? 28}
                    @value-changed=${(
                        e: CustomEvent<{ key: string; value: number }>,
                    ) =>
                        this._updateConfig({
                            [e.detail.key]: e.detail.value,
                        } as Partial<InsightBaseConfig>)}
                ></insight-box-model>
            </div>
        `;
    }

    // -------------------------------------------------------------------------
    // Interactions
    // -------------------------------------------------------------------------

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
                                e.detail.value as Partial<InsightBaseConfig>,
                            )}
                    ></ha-form>
                </div>
            </ha-expansion-panel>
        `;
    }

    // -------------------------------------------------------------------------
    // Advanced
    // -------------------------------------------------------------------------

    private _renderAdvancedSection(): TemplateResult {
        const cfg = this._cfg;
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
                                e.detail.value as Partial<InsightBaseConfig>,
                            )}
                    ></ha-form>
                </div>
            </ha-expansion-panel>
        `;
    }

    // -------------------------------------------------------------------------
    // computeLabel / computeHelper
    // -------------------------------------------------------------------------

    private readonly _computeLabel = (schema: { name: string }): string => {
        const overrides: Record<string, string> = {
            _entity: localize("editor.field.entity", this._lang),
            color_scale: "Palette",
            value_min: "Min value",
            value_max: "Max value",
            cell_gap: "Cell gap",
            cell_radius: "Cell corner radius",
            cell_value_decimals: "Decimal places",
        };
        if (overrides[schema.name]) return overrides[schema.name];
        return localize(`editor.field.${schema.name}`, this._lang);
    };

    private readonly _computeHelper = (schema: { name: string }): string => {
        const helpers: Record<string, string> = {
            value_min: "Values below this are clamped to the minimum colour.",
            value_max: "Values above this are clamped to the maximum colour.",
        };
        if (helpers[schema.name]) return helpers[schema.name];
        const key = `editor.helper.${schema.name}`;
        const result = localize(key, this._lang);
        return result === key ? "" : result;
    };

    // -------------------------------------------------------------------------
    // Styles
    // -------------------------------------------------------------------------

    static styles: CSSResultGroup = [
        super.styles,
        css`
            ha-expansion-panel {
                margin-top: 4px;
            }

            .panel-content {
                padding: 16px 0;
            }

            ha-entity-picker {
                width: 100%;
                display: block;
                margin-bottom: 4px;
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
                padding: 8px 0;
            }

            .control-label {
                font-weight: 500;
            }

            ha-control-select {
                width: 100%;
            }

            .color-row {
                display: flex;
                align-items: center;
                gap: 10px;
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

            .color-transparent-label {
                font-size: 0.875rem;
                color: var(--secondary-text-color);
                font-style: italic;
            }

            .palette-toggle-row {
                margin-top: 16px;
            }

            .cell-decimals-form {
                margin: 16px 0px;
            }

            .layout-section {
                margin-top: 8px;
            }
        `,
    ];
}
