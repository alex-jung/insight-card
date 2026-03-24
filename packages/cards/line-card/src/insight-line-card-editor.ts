/**
 * Visual editor for custom:insight-line-card
 *
 * Uses ha-form with JSON schema for scalar/toggle/select fields.
 * Custom HTML only where ha-form has no matching selector (color hex, arrays).
 */

import { html, css, nothing, type TemplateResult, type CSSResultGroup } from "lit";
import { customElement, state } from "lit/decorators.js";
import {
  mdiPalette,
  mdiFormatListBulleted,
  mdiPlus,
  mdiChartLine,
  mdiAxisArrow,
  mdiEye,
  mdiDatabaseClock,
  mdiLayersOutline,
  mdiCog,
} from "@mdi/js";

import {
  InsightBaseEditor,
  localize,
  serialiseEntityConfig,
  type InsightLineConfig,
  type InsightEntityConfig,
  type ThresholdConfig,
  type ColorThresholdConfig,
  type LovelaceCardConfig,
  type InsightBaseConfig,
} from "@insight-chart/core";

import { InsightEntityTab } from "./insight-line-entity-tab.js";
import "./insight-line-entity-editor.js";
import { type HaFormField, type HaFormSchema, type HaSelector } from "./insight-line-entity-schema.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Remove null / undefined / "" from a ha-form value-changed payload */
function dropEmpty<T extends Record<string, unknown>>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== null && v !== undefined && v !== ""),
  ) as Partial<T>;
}

// ---------------------------------------------------------------------------
// Schema builders
// ---------------------------------------------------------------------------

function buildChartStyleSchema(cfg: InsightLineConfig): HaFormSchema[] {
  const isArea = (cfg.style ?? "area") === "area";
  return [
    { name: "zoom", selector: { boolean: {} as Record<string, never> } },
    {
      name: "show_points",
      selector: {
        select: {
          options: [
            { value: "false", label: "None" },
            { value: "true", label: "Always" },
            { value: "hover", label: "On hover" },
          ],
        },
      },
    },
    {
      name: "line_width",
      selector: {
        number: { min: 0.5, max: 10, step: 0.5, mode: "slider", unit_of_measurement: "px" },
      },
    },
    ...(isArea
      ? [
          {
            name: "fill_opacity",
            selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" as const } },
          } satisfies HaFormField,
        ]
      : []),
  ];
}

function buildGeneralSchema(lang: string, cfg: InsightLineConfig): HaFormSchema[] {
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
              description: localize("editor.option.style.line_desc", lang),
              image: "/local/insight-card/images/chart-line.svg",
            },
            {
              value: "area",
              label: localize("editor.option.style.area", lang),
              description: localize("editor.option.style.area_desc", lang),
              image: "/local/insight-card/images/chart-area.svg",
            },
            {
              value: "step",
              label: localize("editor.option.style.step", lang),
              description: localize("editor.option.style.step_desc", lang),
              image: "/local/insight-card/images/chart-step.svg",
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
                    label: localize("editor.option.curve.smooth", lang),
                    image: "/local/insight-card/images/curve-smooth.svg",
                  },
                  {
                    value: "linear",
                    label: localize("editor.option.curve.linear", lang),
                    image: "/local/insight-card/images/curve-linear.svg",
                  },
                ],
              },
            },
          } satisfies HaFormField,
        ]
      : []),
  ];
}

const Y_AXIS_SCHEMA: HaFormSchema[] = [
  { name: "y_min", selector: { number: { step: 0.1, mode: "box" } } },
  { name: "y_max", selector: { number: { step: 0.1, mode: "box" } } },
  { name: "decimals", selector: { number: { min: 0, max: 6, step: 1, mode: "box" } } },
  { name: "logarithmic", selector: { boolean: {} as Record<string, never> } },
  { name: "y_min_secondary", selector: { number: { step: 0.1, mode: "box" } } },
  { name: "y_max_secondary", selector: { number: { step: 0.1, mode: "box" } } },
];

const APPEARANCE_SCHEMA: HaFormSchema[] = [
  { name: "show_legend", selector: { boolean: {} as Record<string, never> } },
  { name: "show_x_axis", selector: { boolean: {} as Record<string, never> } },
  { name: "show_y_axis", selector: { boolean: {} as Record<string, never> } },
  { name: "grid_opacity", selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" } } },
  {
    name: "tooltip_format",
    selector: {
      select: {
        options: [
          { value: "datetime", label: "Date & time" },
          { value: "time", label: "Time only" },
          { value: "date", label: "Date only" },
        ],
      },
    },
  },
  {
    name: "time_format",
    selector: {
      select: {
        options: [
          { value: "auto", label: "Auto" },
          { value: "time", label: "HH:MM" },
          { value: "date", label: "DD.MM" },
          { value: "datetime", label: "DD.MM HH:MM" },
        ],
      },
    },
  },
];

function buildAggregationSchema(cfg: InsightLineConfig): HaFormSchema[] {
  return [
    {
      name: "aggregate",
      selector: {
        select: {
          options: [
            { value: "", label: "None" },
            { value: "mean", label: "Mean" },
            { value: "min", label: "Min" },
            { value: "max", label: "Max" },
            { value: "sum", label: "Sum" },
            { value: "last", label: "Last" },
          ],
        },
      },
    },
    ...(cfg.aggregate
      ? [
          {
            name: "aggregate_period",
            selector: { text: {} },
          } satisfies HaFormField,
        ]
      : []),
  ];
}

const ADVANCED_SCHEMA: HaFormSchema[] = [
  {
    name: "update_interval",
    selector: { number: { min: 10, max: 3600, step: 10, mode: "box", unit_of_measurement: "s" } },
  },
  {
    name: "theme",
    selector: {
      select: {
        options: [
          { value: "auto", label: "Auto (follow HA theme)" },
          { value: "light", label: "Light" },
          { value: "dark", label: "Dark" },
        ],
      },
    },
  },
  {
    name: "padding_top",
    selector: { number: { min: 0, max: 100, step: 1, mode: "box", unit_of_measurement: "px" } },
  },
  {
    name: "padding_bottom",
    selector: { number: { min: 0, max: 100, step: 1, mode: "box", unit_of_measurement: "px" } },
  },
  {
    name: "padding_left",
    selector: { number: { min: 0, max: 100, step: 1, mode: "box", unit_of_measurement: "px" } },
  },
  {
    name: "padding_right",
    selector: { number: { min: 0, max: 100, step: 1, mode: "box", unit_of_measurement: "px" } },
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
      (e, i) => new InsightEntityTab(i + 1, e as InsightEntityConfig | string),
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
      return html`<div class="editor-loading">${localize("editor.loading", this._lang)}</div>`;
    }

      return html`
      <div class="editor-container">
        ${this._renderGeneralSection()}
        ${this._renderEntitySection()}
        ${this._renderChartStyleSection()}
        ${this._renderYAxisSection()}
        ${this._renderAppearanceSection()}
        ${this._renderAggregationSection()}
        ${this._renderOverlaysSection()}
        ${this._renderAdvancedSection()}
      </div>
    `;
  }

  private readonly _hoursOptions = [
    { value: "6",   label: "6h" },
    { value: "12",  label: "12h" },
    { value: "24",  label: "24h" },
    { value: "48",  label: "48h" },
    { value: "72",  label: "72h" },
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
          @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) =>
            this._updateConfig(e.detail.value as Partial<InsightLineConfig>)}
        ></ha-form>
        <div class="control-row">
          <span class="control-label">${localize("editor.field.hours", this._lang)}</span>
          <ha-control-select
            .options=${this._hoursOptions}
            .value=${String(cfg.hours ?? 24)}
            @value-changed=${(e: CustomEvent<{ value: string }>) =>
              this._updateConfig({ hours: Number(e.detail.value) })}
          ></ha-control-select>
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // Entities (expandable + tabs)
  // ---------------------------------------------------------------------------

  private _renderEntitySection(): TemplateResult {
    const currentTab = this._tabs.find((t) => t.index.toString() === this._currTab)
      ?? this._tabs[0];

    return html`
      <ha-expansion-panel outlined>
        <ha-svg-icon slot="leading-icon" .path=${mdiFormatListBulleted}></ha-svg-icon>
        <span slot="header">${localize("editor.section.entities", this._lang)}</span>
        <div class="entities-panel">
          <div class="entities-toolbar">
            <ha-tab-group @wa-tab-show=${this._handleTabChanged}>
              ${this._tabs.map(
                (tab) => html`
                  <ha-tab-group-tab
                    slot="nav"
                    .panel=${tab.index}
                    .active=${this._currTab === tab.index.toString()}
                  >
                    ${tab.index}
                  </ha-tab-group-tab>
                `,
              )}
            </ha-tab-group>
            <ha-icon-button
              .path=${mdiPlus}
              .label=${localize("editor.action.add_entity", this._lang)}
              @click=${this._addTab}
            ></ha-icon-button>
          </div>

          ${currentTab
            ? html`
                <insight-line-entity-editor
                  .hass=${this.hass}
                  .tab=${currentTab}
                  .chartStyle=${this._lineConfig.style ?? "area"}
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
    const idx = this._tabs.findIndex((t) => t.index.toString() === this._currTab);
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
    this._currTab = this._tabs.length > 0 ? Math.min(newCurr, this._tabs.length).toString() : "1";
    this._syncEntitiesToConfig();
  }

  private _syncEntitiesToConfig(): void {
    this._updateConfig({
      entities: this._tabs
        .filter((t) => t.config.entity)
        .map((t) => serialiseEntityConfig(t.config)) as InsightLineConfig["entities"],
    });
  }

  // ---------------------------------------------------------------------------
  // Chart style
  // ---------------------------------------------------------------------------

  private _renderChartStyleSection(): TemplateResult {
    const cfg = this._lineConfig;
    const showPointsStr =
      cfg.show_points === true ? "true" : cfg.show_points === "hover" ? "hover" : "false";
    const data = {
      zoom: cfg.zoom !== false,
      show_points: showPointsStr,
      line_width: cfg.line_width ?? 2,
      fill_opacity: cfg.fill_opacity ?? 0.15,
    };

    return html`
      <ha-expansion-panel outlined>
        <ha-svg-icon slot="leading-icon" .path=${mdiChartLine}></ha-svg-icon>
        <span slot="header">${localize("editor.section.chart_style", this._lang)}</span>
        <div class="panel-content">
          <ha-form
            .hass=${this.hass}
            .schema=${buildChartStyleSchema(cfg)}
            .data=${data}
            .computeLabel=${this._computeLabel}
            @value-changed=${(e: CustomEvent<{ value: typeof data & { show_points: string } }>) => {
              const v = e.detail.value;
              const showPoints =
                v.show_points === "true" ? true : v.show_points === "hover" ? "hover" : false;
              this._updateConfig({
                ...v,
                show_points: showPoints as InsightLineConfig["show_points"],
              } as Partial<InsightLineConfig>);
            }}
          ></ha-form>
        </div>
      </ha-expansion-panel>
    `;
  }

  // ---------------------------------------------------------------------------
  // Y axis
  // ---------------------------------------------------------------------------

  private _renderYAxisSection(): TemplateResult {
    const cfg = this._lineConfig;
    const data = {
      y_min: cfg.y_min,
      y_max: cfg.y_max,
      decimals: cfg.decimals,
      logarithmic: cfg.logarithmic ?? false,
      y_min_secondary: cfg.y_min_secondary,
      y_max_secondary: cfg.y_max_secondary,
    };

    return html`
      <ha-expansion-panel outlined>
        <ha-svg-icon slot="leading-icon" .path=${mdiAxisArrow}></ha-svg-icon>
        <span slot="header">${localize("editor.section.y_axis", this._lang)}</span>
        <div class="panel-content">
          <ha-form
            .hass=${this.hass}
            .schema=${Y_AXIS_SCHEMA}
            .data=${data}
            .computeLabel=${this._computeLabel}
            @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) =>
              this._updateConfig(
                dropEmpty(e.detail.value) as Partial<InsightLineConfig>,
              )}
          ></ha-form>
        </div>
      </ha-expansion-panel>
    `;
  }

  // ---------------------------------------------------------------------------
  // Appearance
  // ---------------------------------------------------------------------------

  private _renderAppearanceSection(): TemplateResult {
    const cfg = this._lineConfig;
    const data = {
      show_legend: cfg.show_legend !== false,
      show_x_axis: cfg.show_x_axis !== false,
      show_y_axis: cfg.show_y_axis !== false,
      grid_opacity: cfg.grid_opacity ?? 1,
      tooltip_format: cfg.tooltip_format ?? "datetime",
      time_format: cfg.time_format ?? "auto",
    };

    return html`
      <ha-expansion-panel outlined>
        <ha-svg-icon slot="leading-icon" .path=${mdiEye}></ha-svg-icon>
        <span slot="header">${localize("editor.section.appearance", this._lang)}</span>
        <div class="panel-content">
          <ha-form
            .hass=${this.hass}
            .schema=${APPEARANCE_SCHEMA}
            .data=${data}
            .computeLabel=${this._computeLabel}
            @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) =>
              this._updateConfig(e.detail.value as Partial<InsightLineConfig>)}
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
      aggregate: cfg.aggregate ?? "",
      aggregate_period: cfg.aggregate_period ?? "",
    };

    return html`
      <ha-expansion-panel outlined>
        <ha-svg-icon slot="leading-icon" .path=${mdiDatabaseClock}></ha-svg-icon>
        <span slot="header">${localize("editor.section.data_aggregation", this._lang)}</span>
        <div class="panel-content">
          <ha-form
            .hass=${this.hass}
            .schema=${buildAggregationSchema(cfg)}
            .data=${data}
            .computeLabel=${this._computeLabel}
            @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) =>
              this._updateConfig(
                dropEmpty(e.detail.value) as Partial<InsightLineConfig>,
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
    const cfg = this._lineConfig;
    const thresholds = cfg.thresholds ?? [];
    const colorThresholds = cfg.color_thresholds ?? [];

    return html`
      <ha-expansion-panel outlined>
        <ha-svg-icon slot="leading-icon" .path=${mdiLayersOutline}></ha-svg-icon>
        <span slot="header">${localize("editor.section.overlays", this._lang)}</span>
        <div class="panel-content">
        <div class="subsection-label">${localize("editor.subsection.threshold_lines", this._lang)}</div>
        ${thresholds.map(
          (t, idx) => html`
            <div class="overlay-row">
              <div class="overlay-color-field">
                <span class="field-label">${localize("editor.field.color", this._lang)}</span>
                <input
                  type="color"
                  class="color-swatch"
                  .value=${t.color ?? "#db4437"}
                  @input=${(e: Event) =>
                    this._updateThresholdAt(idx, {
                      ...t,
                      color: (e.target as HTMLInputElement).value,
                    })}
                />
              </div>
              <ha-form
                .hass=${this.hass}
                .schema=${THRESHOLD_SCHEMA}
                .data=${{ value: t.value, label: t.label ?? "", dash: t.dash?.join(",") ?? "" }}
                .computeLabel=${this._computeLabel}
                @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) =>
                  this._updateThresholdAt(idx, { ...t, ...this._parseThreshold(e.detail.value) })}
              ></ha-form>
              <ha-icon-button
                .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                @click=${() => this._removeThresholdAt(idx)}
              ></ha-icon-button>
            </div>
          `,
        )}
        <mwc-button @click=${this._appendThreshold}>${localize("editor.action.add_threshold", this._lang)}</mwc-button>

        <div class="subsection-label" style="margin-top:12px">
          ${localize("editor.subsection.color_thresholds", this._lang)}
        </div>
        ${colorThresholds.map(
          (ct, idx) => html`
            <div class="overlay-row">
              <div class="overlay-color-field">
                <span class="field-label">${localize("editor.field.color", this._lang)}</span>
                <input
                  type="color"
                  class="color-swatch"
                  .value=${ct.color ?? "#03a9f4"}
                  @input=${(e: Event) =>
                    this._updateColorThresholdAt(idx, {
                      ...ct,
                      color: (e.target as HTMLInputElement).value,
                    })}
                />
              </div>
              <ha-form
                .hass=${this.hass}
                .schema=${COLOR_THRESHOLD_SCHEMA}
                .data=${{ value: ct.value }}
                .computeLabel=${this._computeLabel}
                @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) =>
                  this._updateColorThresholdAt(idx, {
                    ...ct,
                    value: (e.detail.value["value"] as number) ?? 0,
                  })}
              ></ha-form>
              <ha-icon-button
                .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                @click=${() => this._removeColorThresholdAt(idx)}
              ></ha-icon-button>
            </div>
          `,
        )}
        <mwc-button @click=${this._appendColorThreshold}>${localize("editor.action.add_color_threshold", this._lang)}</mwc-button>
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
      theme: cfg.theme ?? "auto",
      padding_top: cfg.padding_top ?? 0,
      padding_bottom: cfg.padding_bottom ?? 0,
      padding_left: cfg.padding_left ?? 0,
      padding_right: cfg.padding_right ?? 0,
    };

    return html`
      <ha-expansion-panel outlined>
        <ha-svg-icon slot="leading-icon" .path=${mdiCog}></ha-svg-icon>
        <span slot="header">${localize("editor.section.advanced", this._lang)}</span>
        <div class="panel-content">
          <ha-form
            .hass=${this.hass}
            .schema=${ADVANCED_SCHEMA}
            .data=${data}
            .computeLabel=${this._computeLabel}
            @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) =>
              this._updateConfig(e.detail.value as Partial<InsightLineConfig>)}
          ></ha-form>
        </div>
      </ha-expansion-panel>
    `;
  }

  // ---------------------------------------------------------------------------
  // computeLabel
  // ---------------------------------------------------------------------------

  private readonly _computeLabel = (schema: HaFormSchema): string => {
    if ("title" in schema) return schema.title;
    return localize(`editor.field.${schema.name}`, this._lang);
  };

  // ---------------------------------------------------------------------------
  // Threshold helpers
  // ---------------------------------------------------------------------------

  private _parseThreshold(raw: Record<string, unknown>): Partial<ThresholdConfig> {
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

  private _updateColorThresholdAt(index: number, ct: ColorThresholdConfig): void {
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
        padding: 8px 0;
      }

      .control-row {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .control-label {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--secondary-text-color);
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

      .subsection-label {
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
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
    `,
  ];
}
