/**
 * custom:insight-bar-card
 *
 * Bar chart with configurable grouping and aggregation, powered by uPlot.
 * Axes and grid are rendered by uPlot; bars are drawn in a custom draw hook.
 */

import { html, css, nothing, type TemplateResult, type CSSResultGroup } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import uPlot from "uplot";

import {
  InsightBaseCard,
  type InsightBarConfig,
  generateColors,
  formatValue,
  findNumericSensor,
} from "@insight-chart/core";

// ---------------------------------------------------------------------------
// Type augmentation
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
// Aggregation helpers
// ---------------------------------------------------------------------------

function aggregateBuckets(
  values: number[],
  method: InsightBarConfig["aggregate"] = "mean",
): number {
  if (values.length === 0) return 0;
  if (method === "sum") return values.reduce((a, b) => a + b, 0);
  if (method === "min") return Math.min(...values);
  if (method === "max") return Math.max(...values);
  // mean
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function bucketKey(ts: number, groupBy: InsightBarConfig["group_by"] = "day"): string {
  const d = new Date(ts);
  if (groupBy === "hour") {
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}`;
  }
  if (groupBy === "week") {
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    return `${start.getFullYear()}-W${start.getDate()}`;
  }
  if (groupBy === "month") {
    return `${d.getFullYear()}-${d.getMonth()}`;
  }
  // day
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function bucketLabel(key: string, groupBy: InsightBarConfig["group_by"] = "day"): string {
  const parts = key.split("-");
  if (groupBy === "hour") {
    return `${parts[3]}:00`;
  }
  if (groupBy === "week") {
    return key;
  }
  if (groupBy === "month") {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return months[parseInt(parts[1], 10)] ?? key;
  }
  return `${parts[2]}.${(parseInt(parts[1], 10) + 1).toString().padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

interface BucketData {
  labels: string[];
  /** series[entityIdx][bucketIdx] */
  series: number[][];
  colors: string[];
  maxVal: number;
}

// ---------------------------------------------------------------------------
// Card implementation
// ---------------------------------------------------------------------------

@customElement("insight-bar-card")
export class InsightBarCard extends InsightBaseCard {
  static readonly cardType = "custom:insight-bar-card";
  static readonly cardName = "Insight Bar Card";
  static readonly cardDescription = "Bar chart with grouping and aggregation";

  private _uplot?: uPlot;
  private _resizeObserver: ResizeObserver | null = null;

  /** Cached aggregated bucket data — rebuilt when data or config changes */
  private _bucketData?: BucketData;
  private _lastBucketDataRef?: typeof this._data;
  private _lastGroupBy?: InsightBarConfig["group_by"];
  private _lastAggregate?: InsightBarConfig["aggregate"];

  /** Last _data reference synced to uPlot */
  private _lastSyncedDataRef?: typeof this._data;

  /** Index of the currently hovered legend item — drives bar opacity in draw hook */
  @state() private _hoveredSeriesIdx: number | null = null;
  /** Set of hidden series indices — toggled by legend click */
  @state() private _hiddenSeries = new Set<number>();

  /** Default chart area height in px (matches base .chart-container) */
  protected _chartHeight = 220;

  @query("#chart")
  private wrapper!: HTMLDivElement;

  // -------------------------------------------------------------------------
  // HA editor integration
  // -------------------------------------------------------------------------

  static getConfigElement(): HTMLElement {
    return document.createElement("insight-bar-card-editor");
  }

  static getStubConfig(
    hass: unknown,
    entities: string[],
    entitiesFallback: string[],
  ): Partial<InsightBarConfig> {
    const sensor = findNumericSensor(hass, entities, entitiesFallback);
    return {
      type: InsightBarCard.cardType,
      entities: [{ entity: sensor }],
      hours: 24,
      group_by: "hour",
      aggregate: "mean",
      layout: "grouped",
    };
  }

  // -------------------------------------------------------------------------
  // Base card overrides
  // -------------------------------------------------------------------------

  protected getDefaultConfig(): Partial<InsightBarConfig> {
    return {
      hours: 168,
      group_by: "day",
      aggregate: "mean",
      layout: "grouped",
      update_interval: 60,
    };
  }

  protected renderChart(): TemplateResult {
    return html`
      <div id="chart"></div>
      ${this._renderLegend()}
    `;
  }

  private _renderLegend(): TemplateResult | typeof nothing {
    const config = this._config as InsightBarConfig | undefined;
    if (config?.show_legend === false || this._data.length === 0) return nothing;

    const palette = generateColors(this._data.length);
    const colors = this.entityConfigs.map((ec, i) => ec.color ?? palette[i]);

    return html`
      <div class="bar-legend">
        ${this._data.map((dataset, i) => {
          const isHidden = this._hiddenSeries.has(i);
          const isDimmed = !isHidden && this._hoveredSeriesIdx !== null && this._hoveredSeriesIdx !== i;
          return html`
            <span
              class="bar-legend-item ${isDimmed ? "dimmed" : ""} ${isHidden ? "hidden" : ""}"
              @mouseenter=${() => { if (!isHidden) { this._hoveredSeriesIdx = i; this._uplot?.redraw(false); } }}
              @mouseleave=${() => { this._hoveredSeriesIdx = null; this._uplot?.redraw(false); }}
              @click=${() => this._toggleSeries(i)}
            >
              <span class="bar-legend-marker" style="background:${isHidden ? "transparent" : colors[i]}; border: 2px solid ${colors[i]}"></span>
              ${dataset.friendlyName ?? this.entityConfigs[i]?.entity ?? `Entity ${i + 1}`}
            </span>
          `;
        })}
      </div>
    `;
  }

  private _toggleSeries(idx: number): void {
    const next = new Set(this._hiddenSeries);
    next.has(idx) ? next.delete(idx) : next.add(idx);
    this._hiddenSeries = next;
    this._hoveredSeriesIdx = null;
    // Force Y-scale recalculation with updated visible series
    if (this._uplot) {
      this._uplot.setData(this._uplot.data as uPlot.AlignedData, true);
    }
  }

  override updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
    if (changedProps.has("_config")) {
      this._hiddenSeries = new Set();
    }
    // Double rAF ensures layout is complete before we measure clientWidth
    requestAnimationFrame(() => requestAnimationFrame(() => this._syncUplot()));
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this._resizeObserver = new ResizeObserver(() => {
      this._refreshChartHeight();
      const width = this.wrapper?.clientWidth ?? 0;
      const height = this._chartHeight;
      if (width < 10 || height < 10) return;
      if (!this._uplot) {
        this._syncUplot();
      } else {
        this._uplot.setSize({ width, height });
      }
    });

    this.updateComplete.then(() => {
      this._resizeObserver!.observe(this);
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    this._uplot?.destroy();
    this._uplot = undefined;
  }

  private _refreshChartHeight(): void {
    const total = this.offsetHeight;
    if (total === 0) return;

    const legendEl = this.shadowRoot?.querySelector<HTMLElement>(".bar-legend");
    const legendHeight = legendEl?.offsetHeight ?? 0;

    let h = total;
    h -= this._header?.offsetHeight ?? 0;
    h -= legendHeight;
    h -= this._config?.margin_top ?? 0;
    h -= this._config?.margin_bottom ?? 0;

    const clamped = Math.max(80, h);
    if (clamped !== this._chartHeight) {
      this._chartHeight = clamped;
    }
  }

  // -------------------------------------------------------------------------
  // Bucket aggregation
  // -------------------------------------------------------------------------

  private _buildBucketData(): BucketData {
    const config = this._config as InsightBarConfig;

    if (
      this._bucketData &&
      this._data === this._lastBucketDataRef &&
      config.group_by === this._lastGroupBy &&
      config.aggregate === this._lastAggregate
    ) {
      return this._bucketData;
    }

    const palette = generateColors(this._data.length);
    const colors = this.entityConfigs.map((ec, i) => ec.color ?? palette[i]);
    const bucketMap = new Map<string, Map<number, number[]>>();

    this._data.forEach((dataset, si) => {
      for (const point of dataset.data) {
        const key = bucketKey(point.t, config.group_by);
        if (!bucketMap.has(key)) bucketMap.set(key, new Map());
        const sm = bucketMap.get(key)!;
        if (!sm.has(si)) sm.set(si, []);
        sm.get(si)!.push(point.v);
      }
    });

    const sortedKeys = Array.from(bucketMap.keys()).sort();
    const labels = sortedKeys.map((key) => bucketLabel(key, config.group_by));
    const series = this._data.map((_, si) =>
      sortedKeys.map((key) => {
        const raw = bucketMap.get(key)?.get(si) ?? [];
        return aggregateBuckets(raw, config.aggregate);
      }),
    );

    let maxVal = 0;
    if (config.layout === "stacked") {
      for (let bi = 0; bi < sortedKeys.length; bi++) {
        const sum = series.reduce((acc, s) => acc + (s[bi] ?? 0), 0);
        if (sum > maxVal) maxVal = sum;
      }
    } else {
      for (const s of series) {
        for (const v of s) {
          if (v > maxVal) maxVal = v;
        }
      }
    }

    this._bucketData = { labels, series, colors, maxVal };
    this._lastBucketDataRef = this._data;
    this._lastGroupBy = config.group_by;
    this._lastAggregate = config.aggregate;

    return this._bucketData;
  }

  // -------------------------------------------------------------------------
  // uPlot builders
  // -------------------------------------------------------------------------

  private _buildUplotData(bucketData: BucketData): uPlot.AlignedData {
    const n = bucketData.labels.length;
    if (n === 0) return [[], []];
    const xs = Array.from({ length: n }, (_, i) => i);
    return [xs, ...bucketData.series] as uPlot.AlignedData;
  }

  private _buildOptions(bucketData: BucketData): uPlot.Options {
    const config = this._config as InsightBarConfig;
    const { labels, colors } = bucketData;
    const n = labels.length;
    const chartWidth = Math.max(100, this.wrapper?.clientWidth || this._cardWidth - 32);
    const isDark = this.isDarkTheme;

    const axisStroke = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)";
    const gridStroke = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

    const series: uPlot.Series[] = [{}];
    this._data.forEach((dataset, i) => {
      series.push({
        label: dataset.friendlyName ?? `Entity ${i + 1}`,
        stroke: colors[i],
        fill: colors[i],
        // uPlot path drawing disabled — bars are rendered in the draw hook
        paths: () => null,
        points: { show: false },
      } as uPlot.Series);
    });

    return {
      width: chartWidth,
      height: this._chartHeight,
      scales: {
        x: { time: false },
        y: {
          range: (_u: uPlot, _min: number, _max: number) => {
            const bd = this._bucketData;
            const cfg = this._config as InsightBarConfig | undefined;
            if (!bd) return [0, 1] as [number, number];
            let maxVal = 0;
            if (cfg?.layout === "stacked") {
              for (let bi = 0; bi < bd.labels.length; bi++) {
                const sum = bd.series.reduce((acc, s, si) =>
                  this._hiddenSeries.has(si) ? acc : acc + (s[bi] ?? 0), 0);
                if (sum > maxVal) maxVal = sum;
              }
            } else {
              for (let si = 0; si < bd.series.length; si++) {
                if (this._hiddenSeries.has(si)) continue;
                for (const v of bd.series[si]) { if (v > maxVal) maxVal = v; }
              }
            }
            return [0, maxVal > 0 ? maxVal * 1.05 : 1] as [number, number];
          },
        },
      },
      axes: [
        {
          // x axis — categorical bucket labels
          stroke: axisStroke,
          grid: { show: false },
          ticks: { show: false },
          splits: (_u: uPlot) => Array.from({ length: n }, (_, i) => i),
          values: (_u: uPlot, vals: number[]) =>
            vals.map((v) => labels[Math.round(v)] ?? ""),
          size: 36,
        },
        {
          // y axis
          stroke: axisStroke,
          grid: { stroke: gridStroke, width: 1 },
          ticks: { show: false },
          values: (_u: uPlot, vals: (number | null)[]) =>
            vals.map((v) => (v == null ? "" : formatValue(v))),
          size: 50,
        },
      ],
      series,
      legend: { show: false },
      cursor: { show: false },
      hooks: {
        draw: [(u: uPlot) => this._drawBarsHook(u)],
      },
      padding: [
        config.padding_top ?? 8,
        config.padding_right ?? 16,
        config.padding_bottom ?? 8,
        config.padding_left ?? 16,
      ],
    } as unknown as uPlot.Options;
  }

  // -------------------------------------------------------------------------
  // Bar drawing hook
  // -------------------------------------------------------------------------

  private _drawBarsHook(u: uPlot): void {
    const config = this._config as InsightBarConfig | undefined;
    const bucketData = this._bucketData;
    if (!config || !bucketData) return;

    const { labels, series, colors, maxVal } = bucketData;
    const n = labels.length;
    if (n === 0 || maxVal <= 0) return;

    const ctx = u.ctx;
    const { left, top: _top, width, height: _height } = u.bbox;
    const numSeries = series.length;

    const bucketW = width / n;
    const padFrac = 0.15;
    const barGroupW = bucketW * (1 - padFrac * 2);

    // y=0 in canvas pixel coordinates
    const yBase = u.valToPos(0, "y", true);

    ctx.save();

    for (let bi = 0; bi < n; bi++) {
      const groupX = left + bi * bucketW + bucketW * padFrac;

      if (config.layout === "stacked") {
        let cumulative = 0;
        for (let si = 0; si < numSeries; si++) {
          if (this._hiddenSeries.has(si)) continue;
          const val = series[si][bi] ?? 0;
          if (val <= 0) continue;
          ctx.globalAlpha = this._hoveredSeriesIdx !== null && this._hoveredSeriesIdx !== si ? 0.15 : 1;
          const yTop = u.valToPos(cumulative + val, "y", true);
          const yBottom = u.valToPos(cumulative, "y", true);
          ctx.fillStyle = colors[si];
          ctx.fillRect(groupX, yTop, barGroupW, yBottom - yTop);
          cumulative += val;
        }
      } else {
        // grouped
        const barW = barGroupW / numSeries;
        for (let si = 0; si < numSeries; si++) {
          if (this._hiddenSeries.has(si)) continue;
          const val = series[si][bi] ?? 0;
          if (val <= 0) continue;
          ctx.globalAlpha = this._hoveredSeriesIdx !== null && this._hoveredSeriesIdx !== si ? 0.15 : 1;
          const yTop = u.valToPos(val, "y", true);
          const x = groupX + si * barW;
          ctx.fillStyle = colors[si];
          ctx.fillRect(x, yTop, barW * 0.85, yBase - yTop);
        }
      }
    }

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // uPlot sync
  // -------------------------------------------------------------------------

  private _syncUplot(): void {
    const config = this._config as InsightBarConfig | undefined;
    if (!config || !this.wrapper) return;
    if (this._data.length === 0) return;

    const bucketData = this._buildBucketData();

    if (bucketData.labels.length === 0) {
      this._uplot?.destroy();
      this._uplot = undefined;
      return;
    }

    const uData = this._buildUplotData(bucketData);
    const prevBucketCount = (this._uplot?.data[0] as number[] | undefined)?.length;
    const bucketCountChanged = bucketData.labels.length !== prevBucketCount;
    const entityCountChanged = this._uplot
      ? this._data.length !== this._uplot.series.length - 1
      : false;

    const needsRebuild =
      this._needsRebuild ||
      !this._uplot ||
      bucketCountChanged ||
      entityCountChanged;

    if (needsRebuild) {
      this._uplot?.destroy();
      this._uplot = undefined;
      this._uplot = new uPlot(this._buildOptions(bucketData), uData, this.wrapper);
      this._needsRebuild = false;
    } else if (this._data !== this._lastSyncedDataRef) {
      this._uplot!.setData(uData, true);
    }

    this._lastSyncedDataRef = this._data;
  }

  // -------------------------------------------------------------------------
  // Styles
  // -------------------------------------------------------------------------

  static styles: CSSResultGroup = [
    super.styles,
    css`
      #chart {
        width: 100%;
        display: block;
      }

      /* uPlot core layout — injected to document.head by uPlot, replicated here for Shadow DOM */
      .u-wrap {
        display: block;
        position: relative;
        user-select: none;
        width: 100%;
      }
      .u-over,
      .u-under {
        position: absolute;
      }
      .u-under {
        overflow: hidden;
      }
      .u-axis {
        position: absolute;
      }
      .u-wrap canvas {
        display: block;
        width: 100%;
        height: 100%;
      }

      .bar-legend {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 4px 12px;
        font-size: 12px;
        color: var(--secondary-text-color);
        padding: 4px 0 2px;
      }
      .bar-legend-item {
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        transition: opacity 0.15s;
      }
      .bar-legend-item.dimmed {
        opacity: 0.35;
      }
      .bar-legend-item.hidden {
        opacity: 0.4;
      }
      .bar-legend-item.hidden .bar-legend-marker {
        border-style: dashed !important;
      }
      .bar-legend-marker {
        width: 10px;
        height: 10px;
        border-radius: 2px;
        flex-shrink: 0;
      }
    `,
  ];
}

// ---------------------------------------------------------------------------
// Register with HA
// ---------------------------------------------------------------------------

window.customCards = window.customCards ?? [];
// HA prepends "custom:" itself — register WITHOUT the prefix here.
window.customCards.push({
  type: InsightBarCard.cardType.replace("custom:", ""),
  name: InsightBarCard.cardName,
  description: InsightBarCard.cardDescription,
  preview: true,
});
