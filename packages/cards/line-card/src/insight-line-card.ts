/**
 * custom:insight-line-card
 *
 * Interactive time-series chart powered by uPlot. Supports line, area, and
 * step rendering modes with drag-to-zoom.
 */

import { html, css, type TemplateResult, type CSSResultGroup } from "lit";
import { customElement } from "lit/decorators.js";
import uPlot from "uplot";

import {
  InsightBaseCard,
  type InsightLineConfig,
  type InsightEntityConfig,
  type ThresholdConfig,
  type ColorThresholdConfig,
  hexToRgba,
  generateColors,
  formatValue,
  formatTime,
  formatDate,
  formatDateTime,
  getChartHeight,
  findNumericSensor,
  parsePeriod,
  aggregateTimeSeries,
  applyTransform,
} from "@insight-chart/core";

// ---------------------------------------------------------------------------
// Augment global for HA card registration
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    customCards: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}

// ---------------------------------------------------------------------------
// Card implementation
// ---------------------------------------------------------------------------

@customElement("insight-line-card")
export class InsightLineCard extends InsightBaseCard {
  // uPlot injects CSS into document.head which doesn't reach Shadow DOM —
  // include the essential uPlot styles here directly.
  static styles: CSSResultGroup = [
    InsightBaseCard.styles,
    css`
      .uplot-wrapper {
        width: 100%;
        display: block;
      }

      /* uPlot core layout — must be in Shadow DOM since uPlot injects to document.head */
      .u-wrap {
        display: block;
        position: relative;
        user-select: none;
        width: 100%;
      }
      .u-over, .u-under { position: absolute; }
      .u-under { overflow: hidden; }
      .u-axis { position: absolute; }

      /* Canvas must be constrained to logical size — uPlot sets 2x pixel
         dimensions for HiDPI but relies on injected CSS for the CSS size */
      .u-wrap canvas {
        display: block;
        width: 100%;
        height: 100%;
      }

      /* Legend below the plot — horizontal, centered */
      .u-legend { font-size: 12px; color: var(--secondary-text-color); margin: 4px auto 0; text-align: center; }
      .u-inline { display: block; }
      .u-inline * { display: inline-block; }
      .u-inline tr { margin-right: 12px; }
      .u-legend th { font-weight: normal; padding: 2px 0; cursor: pointer; }
      .u-legend th > * { vertical-align: middle; }
      .u-legend .u-marker { width: 10px; height: 10px; border-radius: 50%; margin-right: 3px; }
      .u-legend .u-off > * { opacity: 0.4; }
      /* uPlot legend click fires only when e.target === th — pass clicks through children */
      .u-legend th * { pointer-events: none; }

      /* Cursor & selection */
      .u-select {
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 15%, transparent);
        position: absolute;
        pointer-events: none;
      }
      .u-cursor-x, .u-cursor-y {
        position: absolute;
        left: 0; top: 0;
        pointer-events: none;
        will-change: transform;
        z-index: 100;
      }
      .u-cursor-x { height: 100%; border-right: 1px dashed #607D8B; }
      .u-cursor-y { width: 100%; border-bottom: 1px dashed #607D8B; }
      .u-cursor-pt {
        position: absolute;
        top: 0; left: 0;
        border-radius: 50%;
        pointer-events: none;
        will-change: transform;
        z-index: 100;
        background-clip: padding-box !important;
      }
      .u-axis.u-off,
      .u-select.u-off,
      .u-cursor-x.u-off,
      .u-cursor-y.u-off,
      .u-cursor-pt.u-off { display: none; }

      /* Custom floating tooltip */
      .u-tooltip {
        position: absolute;
        pointer-events: none;
        z-index: 200;
        background: var(--card-background-color, #fff);
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 6px;
        padding: 6px 10px;
        font-size: 0.75rem;
        color: var(--primary-text-color);
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        white-space: nowrap;
        display: none;
      }
      .u-tooltip-time {
        color: var(--secondary-text-color);
        margin-bottom: 4px;
        font-size: 0.7rem;
      }
      .u-tooltip-row {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 1px 0;
      }
      .u-tooltip-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .u-tooltip-name {
        color: var(--secondary-text-color);
        flex: 1;
      }
      .u-tooltip-value {
        font-weight: 500;
        text-align: right;
      }
    `,
  ];
  static readonly cardType = "custom:insight-line-card";
  static readonly cardName = "InsightChart Line";
  static readonly cardDescription =
    "Interactive time-series line & area chart with zoom";

  /** uPlot instance — created lazily in renderChart() */
  private _uplot?: uPlot;
  /** Reference to the container element uPlot renders into */
  private _chartContainer?: HTMLDivElement;
  /** Floating tooltip element — lives inside u-wrap */
  private _tooltipEl?: HTMLDivElement;

  // -------------------------------------------------------------------------
  // HA editor integration
  // -------------------------------------------------------------------------

  static getConfigElement(): HTMLElement {
    return document.createElement("insight-line-card-editor");
  }

  static getStubConfig(
    hass: unknown,
    entities: string[],
    entitiesFallback: string[],
  ): Partial<InsightLineConfig> {
    const sensor = findNumericSensor(hass, entities, entitiesFallback);
    return {
      type: InsightLineCard.cardType,
      entities: [{ entity: sensor }],
      hours: 24,
      style: "area",
      zoom: false,
      line_width: 2,
      show_stats: false,
    };
  }

  // -------------------------------------------------------------------------
  // Base card overrides
  // -------------------------------------------------------------------------

  protected getDefaultConfig(): Partial<InsightLineConfig> {
    return {
      hours: 24,
      style: "area",
      curve: "smooth",
      zoom: true,
      line_width: 2,
      fill_opacity: 0.15,
      y_range: "auto",
      update_interval: 60,
      show_stats: false,
    };
  }

  // -------------------------------------------------------------------------
  // uPlot helpers
  // -------------------------------------------------------------------------

  /** Build uPlot series options for each entity */
  private _buildSeries(config: InsightLineConfig): uPlot.Series[] {
    // First series is always the x-axis (timestamps)
    const series: uPlot.Series[] = [{}];

    const colors = generateColors(this.entityConfigs.length);

    const ct = config.color_thresholds;

    this.entityConfigs.forEach((ec: InsightEntityConfig, i: number) => {
      const color = ec.color ?? colors[i];
      const isArea = config.style === "area";
      const isStep = config.style === "step" || config.curve === "step";
      const drawStyle: number = isStep ? 1 : 0;
      const lineInterpolation: number = isStep ? 2 : 0;

      // Use gradient when color_thresholds is set and entity has no explicit color
      const useGradient = ct && ct.length >= 2 && !ec.color;
      const fillOpacity = ec.fill_opacity ?? config.fill_opacity ?? 0.15;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      series.push({
        label: ec.name ?? this._data[i]?.friendlyName ?? ec.entity,
        scale: ec.y_axis === "right" ? "y2" : "y",
        stroke: useGradient
          ? (u: uPlot) => this._buildColorGradient(u, ct!)
          : color,
        fill: isArea
          ? useGradient
            ? (u: uPlot) => this._buildColorGradient(u, ct!, fillOpacity)
            : hexToRgba(color, fillOpacity)
          : undefined,
        show: !ec.hidden,
        width: ec.line_width ?? config.line_width ?? 2,
        dash: ec.stroke_dash != null
          ? (Array.isArray(ec.stroke_dash) ? ec.stroke_dash : [ec.stroke_dash, ec.stroke_dash])
          : undefined,
        points: { show: config.show_points === true },
        drawStyle,
        lineInterpolation,
        spanGaps: true,
      } as any);
    });

    return series;
  }

  /** Build aligned uPlot data from EntityDataSet array */
  private _buildUplotData(): uPlot.AlignedData {
    if (this._data.length === 0) return [[], []];

    const config = this._config as InsightLineConfig;
    const cardPeriodMs = config.aggregate_period ? parsePeriod(config.aggregate_period) : NaN;
    const cardMethod = config.aggregate;

    // Apply per-entity (or card-level) aggregation, then transformation
    const datasets = this._data.map((dataset, i) => {
      const ec = this.entityConfigs[i];
      const method = ec?.aggregate ?? cardMethod;
      const periodMs = cardPeriodMs;
      let data = dataset.data;
      if (method && isFinite(periodMs)) {
        data = aggregateTimeSeries(data, periodMs, method);
      }
      if (ec?.transform && ec.transform !== "none") {
        data = applyTransform(data, ec.transform);
      }
      return data;
    });

    // Merge all timestamps across all entities and sort
    const allTimestamps = new Set<number>();
    for (const data of datasets) {
      for (const point of data) {
        // uPlot expects seconds, not milliseconds
        allTimestamps.add(Math.floor(point.t / 1000));
      }
    }
    const timestamps = Array.from(allTimestamps).sort((a, b) => a - b);

    // Build a lookup for each entity
    const valueSeries: (number | null | undefined)[][] = datasets.map((data) => {
      const map = new Map<number, number>();
      for (const point of data) {
        map.set(Math.floor(point.t / 1000), point.v);
      }
      return timestamps.map((ts) => map.get(ts) ?? null);
    });

    return [timestamps, ...valueSeries] as uPlot.AlignedData;
  }

  /** Build uPlot options object */
  private _buildOptions(config: InsightLineConfig): uPlot.Options {
    // Measure actual available width from the wrapper element if possible
    const wrapper = this.shadowRoot?.querySelector<HTMLDivElement>(".uplot-wrapper");
    const chartWidth = Math.max(100, wrapper?.clientWidth || this._cardWidth - 32);
    const chartHeight = getChartHeight(this._cardWidth);
    const isDark = this.isDarkTheme;

    // Canvas doesn't resolve CSS variables — read computed values from the host element.
    const cs = getComputedStyle(this);
    const axisStroke = isDark
      ? "rgba(255,255,255,0.55)"
      : cs.getPropertyValue("--secondary-text-color").trim() || "rgba(0,0,0,0.55)";
    const gridStroke = isDark
      ? "rgba(255,255,255,0.08)"
      : cs.getPropertyValue("--divider-color").trim() || "rgba(0,0,0,0.08)";

    // Y-axis scale — fixed range, soft bounds, log, or auto
    const yMin = config.y_min;
    const yMax = config.y_max;
    const isLog = config.logarithmic === true;

    let yScaleOpts: uPlot.Scale;
    if (isLog) {
      // Logarithmic scale — data must be > 0
      yScaleOpts = { distr: 3, log: 10, auto: true };
    } else if (Array.isArray(config.y_range)) {
      yScaleOpts = { range: config.y_range as [number, number] };
    } else if (yMin !== undefined || yMax !== undefined) {
      yScaleOpts = {
        range: (_u, dataMin, dataMax) => [
          yMin !== undefined ? Math.min(dataMin, yMin) : dataMin,
          yMax !== undefined ? Math.max(dataMax, yMax) : dataMax,
        ],
      };
    } else {
      yScaleOpts = { auto: true };
    }

    // Detect whether any entity uses the secondary (right) axis
    const hasSecondaryAxis = this.entityConfigs.some((ec) => ec.y_axis === "right");

    // Secondary Y-axis scale
    const y2Min = config.y_min_secondary;
    const y2Max = config.y_max_secondary;
    let y2ScaleOpts: uPlot.Scale;
    if (Array.isArray(config.y_range_secondary)) {
      y2ScaleOpts = { range: config.y_range_secondary as [number, number] };
    } else if (y2Min !== undefined || y2Max !== undefined) {
      y2ScaleOpts = {
        range: (_u, dataMin, dataMax) => [
          y2Min !== undefined ? Math.min(dataMin, y2Min) : dataMin,
          y2Max !== undefined ? Math.max(dataMax, y2Max) : dataMax,
        ],
      };
    } else {
      y2ScaleOpts = { auto: true };
    }

    // Y-axis label: use common unit from datasets on each axis
    const primaryUnits = [...new Set(
      this.entityConfigs
        .filter((ec) => ec.y_axis !== "right")
        .map((_, i) => this._data[i]?.unit)
        .filter(Boolean),
    )];
    const secondaryUnits = [...new Set(
      this.entityConfigs
        .filter((ec) => ec.y_axis === "right")
        .map((ec) => this._data[this.entityConfigs.indexOf(ec)]?.unit)
        .filter(Boolean),
    )];
    const yUnit = primaryUnits.length === 1 ? primaryUnits[0] : "";
    const y2Unit = secondaryUnits.length === 1 ? secondaryUnits[0] : "";

    // Y-axis tick value formatter
    const decimals = config.decimals;
    const yValFormatter = (
      _u: uPlot,
      vals: (number | null)[],
    ): (string | number | null)[] =>
      vals.map((v) =>
        v == null ? "" : formatValue(v, undefined, decimals),
      );

    // Dynamic axis width: vals are already-formatted strings passed by uPlot
    const yAxisSize = (u: uPlot, vals: (string | number | null)[]): number => {
      if (!vals?.length) return 40;
      u.ctx.font = "12px sans-serif";
      const maxW = vals.reduce((m, v) => {
        if (v == null) return m;
        return Math.max(m, u.ctx.measureText(String(v)).width);
      }, 0);
      return Math.max(32, Math.ceil(maxW) + 14); // 14px for tick + gap
    };

    return {
      width: chartWidth,
      height: chartHeight,
      cursor: {
        show: true,
        drag: {
          x: config.zoom !== false,
          y: false,
          uni: 50,
        },
        focus: { prox: 16 },
      },
      scales: {
        x: { time: true },
        y: yScaleOpts,
        ...(hasSecondaryAxis ? { y2: y2ScaleOpts } : {}),
      },
      series: this._buildSeries(config),
      axes: [
        {
          stroke: axisStroke,
          grid: { stroke: gridStroke, width: 1 },
          ticks: { stroke: gridStroke, width: 1 },
          font: "12px sans-serif",
          ...(config.time_format && config.time_format !== "auto" ? {
            values: (_u: uPlot, vals: number[]) => vals.map((v) => {
              const ms = v * 1000;
              if (config.time_format === "time") return formatTime(ms);
              if (config.time_format === "date") return formatDate(ms);
              return formatDateTime(ms);
            }),
          } : {}),
        },
        {
          scale: "y",
          stroke: axisStroke,
          grid: { stroke: gridStroke, width: 1 },
          ticks: { stroke: gridStroke, width: 1 },
          font: "12px sans-serif",
          size: yAxisSize,
          label: yUnit,
          labelSize: yUnit ? 16 : 0,
          labelFont: "11px sans-serif",
          values: yValFormatter,
        },
        ...(hasSecondaryAxis ? [{
          scale: "y2",
          side: 1,           // right side
          stroke: axisStroke,
          grid: { show: false },
          ticks: { stroke: gridStroke, width: 1 },
          font: "12px sans-serif",
          size: yAxisSize,
          label: y2Unit,
          labelSize: y2Unit ? 16 : 0,
          labelFont: "11px sans-serif",
          values: yValFormatter,
        }] : [{
          // Invisible balancing axis on the right to mirror the left Y-axis width
          show: false,
          side: 1,
          scale: "y",
          size: yAxisSize,
          gap: 0,
          stroke: axisStroke,
          grid: { show: false },
          ticks: { show: false },
        }]),
      ],
      legend: {
        show: config.show_legend !== false,
        live: false,
      },
      hooks: {
        setCursor: [(u) => this._updateTooltip(u)],
        draw: config.thresholds?.length
          ? [(u: uPlot) => this._drawThresholds(u, config.thresholds!)]
          : [],
        ready: [(u) => {
          this._tooltipEl = document.createElement("div");
          this._tooltipEl.className = "u-tooltip";
          u.root.appendChild(this._tooltipEl);

        }],
        destroy: [() => {
          this._tooltipEl = undefined;
        }],
      },
      padding: [8, 4, 6, 0],
    };
  }

  /**
   * Build a vertical CanvasGradient from color_thresholds.
   * Stops are mapped from data values to Y-pixel positions so the gradient
   * transitions exactly at the configured threshold values.
   */
  private _buildColorGradient(
    u: uPlot,
    thresholds: ColorThresholdConfig[],
    opacity = 1,
  ): CanvasGradient | string {
    // u.bbox is NaN during legend swatch initialization — return a fallback color
    if (!isFinite(u.bbox.top) || !isFinite(u.bbox.height) || u.bbox.height === 0) {
      const mid = thresholds[Math.floor(thresholds.length / 2)];
      const c = mid?.color ?? thresholds[0]?.color ?? "#888";
      return opacity < 1 ? hexToRgba(c, opacity) : c;
    }

    const grad = u.ctx.createLinearGradient(
      0, u.bbox.top,
      0, u.bbox.top + u.bbox.height,
    );
    // Sort highest value first (= top of chart)
    const sorted = [...thresholds].sort((a, b) => b.value - a.value);
    for (const t of sorted) {
      const yPx = u.valToPos(t.value, "y", true);
      const stop = Math.max(0, Math.min(1, (yPx - u.bbox.top) / u.bbox.height));
      const color = opacity < 1 ? hexToRgba(t.color, opacity) : t.color;
      grad.addColorStop(stop, color);
    }
    return grad;
  }

  /** Draw horizontal threshold lines on the canvas */
  private _drawThresholds(u: uPlot, thresholds: ThresholdConfig[]): void {
    const cs = getComputedStyle(this);
    const defaultColor =
      cs.getPropertyValue("--error-color").trim() || "#db4437";
    const dpr = window.devicePixelRatio ?? 1;
    const ctx = u.ctx;

    ctx.save();
    for (const t of thresholds) {
      const y = Math.round(u.valToPos(t.value, "y", true));
      if (y < u.bbox.top || y > u.bbox.top + u.bbox.height) continue;

      ctx.beginPath();
      ctx.strokeStyle = t.color ?? defaultColor;
      ctx.lineWidth = dpr;
      ctx.setLineDash((t.dash ?? [4, 3]).map((v: number) => v * dpr));
      ctx.moveTo(u.bbox.left, y);
      ctx.lineTo(u.bbox.left + u.bbox.width, y);
      ctx.stroke();

      if (t.label) {
        ctx.setLineDash([]);
        ctx.fillStyle = t.color ?? defaultColor;
        ctx.font = `${11 * dpr}px sans-serif`;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText(t.label, u.bbox.left + u.bbox.width - 4 * dpr, y - 2 * dpr);
      }
    }
    ctx.restore();
  }

  /** Update the floating tooltip position and content on cursor move */
  private _updateTooltip(u: uPlot): void {
    const tooltip = this._tooltipEl;
    if (!tooltip) return;

    const idx = u.cursor.idx;
    // uPlot sets cursor.left to -10 when mouse leaves the plot area
    if (idx == null || (u.cursor.left ?? -1) < 0) {
      tooltip.style.display = "none";
      return;
    }

    const ts = u.data[0][idx];
    if (ts == null) { tooltip.style.display = "none"; return; }

    const config = this._config as InsightLineConfig;
    const tsMs = ts * 1000;
    const fmt = config.tooltip_format ?? "datetime";
    const timeLabel =
      fmt === "time" ? formatTime(tsMs) :
      fmt === "date" ? formatDate(tsMs) :
      formatDateTime(tsMs);

    const colors = generateColors(this.entityConfigs.length);
    const rows = this._data.map((dataset, i) => {
      const val = u.data[i + 1]?.[idx];
      if (val == null) return "";
      const unit = dataset.unit ? ` ${dataset.unit}` : "";
      const color = this.entityConfigs[i]?.color ?? colors[i];
      const name = dataset.friendlyName;
      return `<div class="u-tooltip-row">
        <span class="u-tooltip-dot" style="background:${color}"></span>
        <span class="u-tooltip-name">${name}</span>
        <span class="u-tooltip-value">${formatValue(val)}${unit}</span>
      </div>`;
    }).filter(Boolean).join("");

    tooltip.innerHTML = `<div class="u-tooltip-time">${timeLabel}</div>${rows}`;
    tooltip.style.display = "block";

    // Position relative to u-wrap; cursor coords are relative to u-over
    const left = u.cursor.left! + u.over.offsetLeft;
    const top = u.cursor.top! + u.over.offsetTop;
    const flip = left > u.width / 2;
    tooltip.style.left = flip ? `${left - tooltip.offsetWidth - 12}px` : `${left + 12}px`;
    tooltip.style.top = `${Math.max(0, top - tooltip.offsetHeight / 2)}px`;
  }

  // -------------------------------------------------------------------------
  // Chart render
  // -------------------------------------------------------------------------

  protected renderChart(): TemplateResult {
    const config = this._config as InsightLineConfig | undefined;
    if (!config) return html``;

    // We render a host <div> and manage the uPlot instance imperatively
    // via the Lit `ref` callback pattern.
    return html`
      <div
        class="uplot-wrapper"
        ${this._refCallback()}
      ></div>
    `;
  }

  /** Returns a Lit directive-compatible ref callback */
  private _refCallback() {
    // Lit's `ref()` directive is not available in all environments, so we
    // use a plain `@update` pattern via the element's updated() hook instead.
    // The actual uPlot setup is triggered from _syncUplot(), called in
    // scheduleUpdate after first render.
    return "";
  }

  /** Called by the LitElement lifecycle after every render */
  override updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);

    // Defer uPlot setup until after the DOM is painted
    requestAnimationFrame(() => this._syncUplot());
  }

  /** Create or update the uPlot instance to match current state */
  private _syncUplot(): void {
    const config = this._config as InsightLineConfig | undefined;
    if (!config || this._loading || this._data.length === 0) return;

    const wrapper = this.shadowRoot?.querySelector<HTMLDivElement>(
      ".uplot-wrapper",
    );
    if (!wrapper) return;

    const uData = this._buildUplotData();
    const opts = this._buildOptions(config);

    if (!this._uplot || this._chartContainer !== wrapper) {
      // Destroy stale instance if container changed
      this._uplot?.destroy();
      this._uplot = undefined;

      // Clear any previous content (e.g. after reconnect)
      wrapper.innerHTML = "";
      this._chartContainer = wrapper;
      this._uplot = new uPlot(opts, uData, wrapper);
    } else {
      // Update data and size only
      this._uplot.setData(uData);
      this._uplot.setSize({
        width: opts.width,
        height: opts.height,
      });
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._uplot?.destroy();
    this._uplot = undefined;
    this._chartContainer = undefined;
  }
}

// ---------------------------------------------------------------------------
// Register card with HA card picker
// ---------------------------------------------------------------------------

window.customCards = window.customCards ?? [];
// HA prepends "custom:" itself — register WITHOUT the prefix here.
window.customCards.push({
  type: InsightLineCard.cardType.replace("custom:", ""),
  name: InsightLineCard.cardName,
  description: InsightLineCard.cardDescription,
  preview: true,
});
