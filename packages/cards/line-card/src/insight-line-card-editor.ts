/**
 * Visual editor for custom:insight-line-card
 *
 * Uses ha-form with JSON schema for scalar/toggle/select fields.
 * Custom HTML only where ha-form has no matching selector (color hex, arrays).
 */

import { html, css, nothing, type TemplateResult, type CSSResultGroup } from "lit";
import { customElement } from "lit/decorators.js";
import { mdiTableRow, mdiPalette, mdiFormatListBulleted, mdiAnimation } from "@mdi/js";

import {
  InsightBaseEditor,
  localize,
  normaliseEntityConfig,
  type InsightLineConfig,
  type InsightEntityConfig,
  type ThresholdConfig,
  type ColorThresholdConfig,
} from "@insight-chart/core";

// ---------------------------------------------------------------------------
// Minimal ha-form schema types (HA does not publish these officially)
// ---------------------------------------------------------------------------

type HaSelector =
  | { boolean: Record<string, never> }
  | { number: { min?: number; max?: number; step?: number; mode?: "box" | "slider"; unit_of_measurement?: string } }
  | { text: { multiline?: boolean; type?: string } }
  | { select: { options: string[] | Array<{ value: string; label: string; description: string }>; mode?: "dropdown" | "list" | "box" } };

interface HaFormField {
  name: string;
  required?: boolean;
  selector: HaSelector;
}

interface HaFormExpandable {
  type: "expandable";
  name: string;
  title: string;
  schema: HaFormField[];
}

type HaFormSchema = HaFormField | HaFormExpandable;

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
  const isStep = cfg.style === "step";
  return [
    {
      name: "style",
      selector: {
        select: {
          mode: "list",
          options: [
            { value: "line", label: "Line" },
            { value: "area", label: "Area" },
            { value: "step", label: "Step" },
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
                mode: "list" as const,
                options: [
                  { value: "smooth", label: "Smooth" },
                  { value: "linear", label: "Linear" },
                ],
              },
            },
          } satisfies HaFormField,
        ]
      : []),
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

function buildEntitySchema(style: string): HaFormSchema[] {
  const isArea = style === "area";
  return [
    {
      name: "y_axis",
      selector: {
        select: {
          mode: "list",
          options: [
            { value: "left", label: "Left axis" },
            { value: "right", label: "Right axis" },
          ],
        },
      },
    },
    { name: "hidden", selector: { boolean: {} as Record<string, never> } },
    {
      type: "expandable",
      name: "appearance",
      title: "Appearance",
      schema: [
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
        { name: "stroke_dash", selector: { text: {} } },
      ],
    },
    {
      type: "expandable",
      name: "data",
      title: "Data",
      schema: [
        { name: "attribute", selector: { text: {} } },
        { name: "unit", selector: { text: {} } },
        { name: "scale", selector: { number: { step: 0.001, mode: "box" } } },
        { name: "invert", selector: { boolean: {} as Record<string, never> } },
        {
          name: "transform",
          selector: {
            select: {
              options: [
                { value: "none", label: "None" },
                { value: "diff", label: "Difference" },
                { value: "normalize", label: "Normalize (0–1)" },
                { value: "cumulative", label: "Cumulative" },
              ],
            },
          },
        },
        {
          name: "aggregate",
          selector: {
            select: {
              options: [
                { value: "", label: "None (use card default)" },
                { value: "mean", label: "Mean" },
                { value: "min", label: "Min" },
                { value: "max", label: "Max" },
                { value: "sum", label: "Sum" },
                { value: "last", label: "Last" },
              ],
            },
          },
        },
        {
          name: "statistics",
          selector: {
            select: {
              options: [
                { value: "", label: "None (use History API)" },
                { value: "5minute", label: "5 minutes" },
                { value: "hour", label: "Hour" },
                { value: "day", label: "Day" },
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
              ],
            },
          },
        },
      ],
    },
  ];
}

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
  private get _lineConfig(): InsightLineConfig {
    return (this._config ?? {}) as InsightLineConfig;
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
        ${this.renderTitleSection()}
        ${this.renderTimeRangeSection()}
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

  // ---------------------------------------------------------------------------
  // Entities
  // ---------------------------------------------------------------------------

  private _renderEntitySection(): TemplateResult {
    const cfg = this._lineConfig;
    const entities = (cfg.entities ?? []).map(normaliseEntityConfig);
    const style = cfg.style ?? "area";
    const schema = buildEntitySchema(style);

    return html`
      <div class="section">
        <div class="section-header">${localize("editor.section.entities", this._lang)}</div>

        ${entities.map(
          (ec, idx) => html`
            <div class="entity-card">
              <div class="entity-top-row">
                <ha-entity-picker
                  .hass=${this.hass}
                  .value=${ec.entity}
                  allow-custom-entity
                  @value-changed=${(e: CustomEvent<{ value: string }>) =>
                    this._updateEntityAt(idx, { entity: e.detail.value })}
                ></ha-entity-picker>
                <ha-textfield
                  label=${localize("editor.field.name", this._lang)}
                  .value=${ec.name ?? ""}
                  @change=${(e: Event) =>
                    this._updateEntityAt(idx, {
                      name: (e.target as HTMLInputElement).value || undefined,
                    })}
                ></ha-textfield>
                <ha-icon-button
                  .path=${"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"}
                  @click=${() => this._removeEntityAt(idx)}
                ></ha-icon-button>
              </div>

              <div class="entity-color-row">
                <span class="field-label">${localize("editor.field.color", this._lang)}</span>
                <input
                  type="color"
                  class="color-swatch"
                  .value=${ec.color ?? "#4AAFFF"}
                  @input=${(e: Event) =>
                    this._updateEntityAt(idx, {
                      color: (e.target as HTMLInputElement).value,
                    })}
                />
                <ha-textfield
                  class="color-text"
                  label=${localize("editor.field.hex", this._lang)}
                  .value=${ec.color ?? ""}
                  placeholder="#4AAFFF"
                  @change=${(e: Event) => {
                    const v = (e.target as HTMLInputElement).value.trim();
                    this._updateEntityAt(idx, { color: v || undefined });
                  }}
                ></ha-textfield>
              </div>

              <ha-form
                .hass=${this.hass}
                .schema=${schema}
                .data=${this._entityFormData(ec)}
                .computeLabel=${this._computeLabel}
                @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) =>
                  this._onEntityFormChanged(idx, e.detail.value)}
              ></ha-form>
            </div>
          `,
        )}

        <mwc-button class="add-entity-btn" @click=${this._appendEntity}>
          ${localize("editor.action.add_entity", this._lang)}
        </mwc-button>
      </div>
    `;
  }

  private _entityFormData(ec: InsightEntityConfig): Record<string, unknown> {
    return {
      y_axis: ec.y_axis ?? "left",
      hidden: ec.hidden ?? false,
      line_width: ec.line_width,
      fill_opacity: ec.fill_opacity,
      stroke_dash: Array.isArray(ec.stroke_dash)
        ? ec.stroke_dash.join(",")
        : ec.stroke_dash != null
          ? String(ec.stroke_dash)
          : "",
      attribute: ec.attribute ?? "",
      unit: ec.unit ?? "",
      scale: ec.scale,
      invert: ec.invert ?? false,
      transform: ec.transform ?? "none",
      aggregate: ec.aggregate ?? "",
      statistics: ec.statistics ?? "",
    };
  }

  private _onEntityFormChanged(idx: number, raw: Record<string, unknown>): void {
    const dashStr = raw["stroke_dash"] as string | undefined;
    const parsedDash: InsightEntityConfig["stroke_dash"] = dashStr
      ? dashStr.includes(",")
        ? dashStr
            .split(",")
            .map(Number)
            .filter((n) => !isNaN(n))
        : Number(dashStr) || undefined
      : undefined;

    const patch: Partial<InsightEntityConfig> = {
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
    };

    this._updateEntityAt(
      idx,
      Object.fromEntries(
        Object.entries(patch).filter(([, v]) => v !== undefined),
      ) as Partial<InsightEntityConfig>,
    );
  }

  // ---------------------------------------------------------------------------
  // Chart style
  // ---------------------------------------------------------------------------

  private _renderChartStyleSection(): TemplateResult {
    const cfg = this._lineConfig;
    const showPointsStr =
      cfg.show_points === true ? "true" : cfg.show_points === "hover" ? "hover" : "false";
    const data = {
      style: cfg.style ?? "area",
      curve: cfg.curve ?? "smooth",
      zoom: cfg.zoom !== false,
      show_points: showPointsStr,
      line_width: cfg.line_width ?? 2,
      fill_opacity: cfg.fill_opacity ?? 0.15,
    };

    return html`
      <div class="section">
        <div class="section-header">Chart style</div>
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
      <div class="section">
        <div class="section-header">${localize("editor.section.y_axis", this._lang)}</div>
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
      <div class="section">
        <div class="section-header">${localize("editor.section.appearance", this._lang)}</div>
        <ha-form
          .hass=${this.hass}
          .schema=${APPEARANCE_SCHEMA}
          .data=${data}
          .computeLabel=${this._computeLabel}
          @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) =>
            this._updateConfig(e.detail.value as Partial<InsightLineConfig>)}
        ></ha-form>
      </div>
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
      <div class="section">
        <div class="section-header">${localize("editor.section.data_aggregation", this._lang)}</div>
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
      <div class="section">
        <div class="section-header">${localize("editor.section.overlays", this._lang)}</div>

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
      <div class="section">
        <div class="section-header">${localize("editor.section.advanced", this._lang)}</div>
        <ha-form
          .hass=${this.hass}
          .schema=${ADVANCED_SCHEMA}
          .data=${data}
          .computeLabel=${this._computeLabel}
          @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) =>
            this._updateConfig(e.detail.value as Partial<InsightLineConfig>)}
        ></ha-form>
      </div>
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
  // Entity helpers
  // ---------------------------------------------------------------------------

  private readonly _appendEntity = (): void => {
    const entities = [...(this._config?.entities ?? []).map(normaliseEntityConfig), { entity: "" }];
    this._updateConfig({ entities });
  };

  private _removeEntityAt(index: number): void {
    const entities = (this._config?.entities ?? []).map(normaliseEntityConfig);
    entities.splice(index, 1);
    this._updateConfig({ entities });
  }

  private _updateEntityAt(index: number, patch: Partial<InsightEntityConfig>): void {
    const entities = (this._config?.entities ?? []).map(normaliseEntityConfig);
    entities[index] = { ...entities[index], ...patch };
    this._updateConfig({ entities });
  }

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
      .entity-card {
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 8px;
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .entity-top-row {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        gap: 8px;
        align-items: flex-end;
      }

      .entity-color-row {
        display: flex;
        align-items: center;
        gap: 8px;
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
