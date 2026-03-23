/**
 * custom:insight-bar-card
 *
 * Bar chart with configurable grouping and aggregation. Renders via the
 * Canvas 2D API — no external chart library required.
 */

import { html, css, type TemplateResult, type CSSResultGroup } from "lit";
import { customElement } from "lit/decorators.js";

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
// Bar chart rendering helpers
// ---------------------------------------------------------------------------

interface Bar {
  label: string;
  values: number[];
  colors: string[];
}

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
    // ISO week approximation
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
// Card implementation
// ---------------------------------------------------------------------------

@customElement("insight-bar-card")
export class InsightBarCard extends InsightBaseCard {
  static readonly cardType = "custom:insight-bar-card";
  static readonly cardName = "InsightChart Bar";
  static readonly cardDescription = "Bar chart with grouping and aggregation";

  private _canvas?: HTMLCanvasElement;
  /** Cached aggregated bar data — reused when _data reference and config are unchanged */
  private _barCache?: { bars: Bar[]; colors: string[] };
  private _lastBarDataRef?: typeof this._data;
  private _lastBarGroupBy?: InsightBarConfig["group_by"];
  private _lastBarAggregate?: InsightBarConfig["aggregate"];

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
      <canvas
        class="bar-canvas"
        style="width:100%;height:250px"
      ></canvas>
    `;
  }

  override updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
    requestAnimationFrame(() => this._drawBars());
  }

  private _drawBars(): void {
    const config = this._config as InsightBarConfig | undefined;
    if (!config || this._loading || this._data.length === 0) return;

    const canvasEl =
      this.shadowRoot?.querySelector<HTMLCanvasElement>(".bar-canvas");
    if (!canvasEl) return;

    const dpr = window.devicePixelRatio ?? 1;
    const displayWidth = canvasEl.clientWidth || this._cardWidth - 32;
    const displayHeight = canvasEl.clientHeight || 250;

    canvasEl.width = displayWidth * dpr;
    canvasEl.height = displayHeight * dpr;

    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // -----------------------------------------------------------------------
    // Aggregate data into buckets — skip if data and config are unchanged
    // -----------------------------------------------------------------------
    const dataChanged = this._data !== this._lastBarDataRef;
    const configChanged =
      config.group_by !== this._lastBarGroupBy ||
      config.aggregate !== this._lastBarAggregate;

    let bars: Bar[];
    let colors: string[];

    if (!dataChanged && !configChanged && this._barCache) {
      ({ bars, colors } = this._barCache);
    } else {
      colors = generateColors(this._data.length);

      const bucketMap = new Map<string, Map<number, number[]>>();
      this._data.forEach((dataset, seriesIdx) => {
        for (const point of dataset.data) {
          const key = bucketKey(point.t, config.group_by);
          if (!bucketMap.has(key)) bucketMap.set(key, new Map());
          const seriesMap = bucketMap.get(key)!;
          if (!seriesMap.has(seriesIdx)) seriesMap.set(seriesIdx, []);
          seriesMap.get(seriesIdx)!.push(point.v);
        }
      });

      const sortedKeys = Array.from(bucketMap.keys()).sort();
      bars = sortedKeys.map((key) => {
        const seriesMap = bucketMap.get(key)!;
        const values = this._data.map((_, i) => {
          const raw = seriesMap.get(i) ?? [];
          return aggregateBuckets(raw, config.aggregate);
        });
        return { label: bucketLabel(key, config.group_by), values, colors };
      });

      this._barCache = { bars, colors };
      this._lastBarDataRef = this._data;
      this._lastBarGroupBy = config.group_by;
      this._lastBarAggregate = config.aggregate;
    }

    if (bars.length === 0) return;

    // -----------------------------------------------------------------------
    // Compute layout
    // -----------------------------------------------------------------------
    const padding = { top: 16, right: 8, bottom: 36, left: 50 };
    const plotW = displayWidth - padding.left - padding.right;
    const plotH = displayHeight - padding.top - padding.bottom;

    let maxVal = 0;
    if (config.layout === "stacked") {
      for (const b of bars) {
        const sum = b.values.reduce((a, v) => a + v, 0);
        if (sum > maxVal) maxVal = sum;
      }
    } else {
      for (const b of bars) {
        for (const v of b.values) {
          if (v > maxVal) maxVal = v;
        }
      }
    }

    if (maxVal <= 0) return;

    const numSeries = this._data.length;
    const barGroupWidth = plotW / bars.length;
    const barPadding = barGroupWidth * 0.15;
    const groupInnerWidth = barGroupWidth - barPadding * 2;

    // -----------------------------------------------------------------------
    // Draw axes
    // -----------------------------------------------------------------------
    const textColor = this.isDarkTheme
      ? "rgba(255,255,255,0.6)"
      : "rgba(0,0,0,0.55)";
    const gridColor = this.isDarkTheme
      ? "rgba(255,255,255,0.08)"
      : "rgba(0,0,0,0.08)";

    ctx.font = "11px sans-serif";
    ctx.fillStyle = textColor;
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    // Y-axis grid lines & labels (5 steps)
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const val = (maxVal * i) / ySteps;
      const y = padding.top + plotH - (plotH * i) / ySteps;

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + plotW, y);
      ctx.stroke();

      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(formatValue(val), padding.left - 4, y);
    }

    // -----------------------------------------------------------------------
    // Draw bars
    // -----------------------------------------------------------------------
    bars.forEach((bar, barIdx) => {
      const groupX = padding.left + barIdx * barGroupWidth + barPadding;

      if (config.layout === "stacked") {
        let yOffset = 0;
        bar.values.forEach((val, si) => {
          const barH = (val / maxVal) * plotH;
          const x = groupX;
          const y = padding.top + plotH - yOffset - barH;
          ctx.fillStyle = bar.colors[si];
          ctx.fillRect(x, y, groupInnerWidth, barH);
          yOffset += barH;
        });
      } else {
        // grouped
        const barW = groupInnerWidth / numSeries;
        bar.values.forEach((val, si) => {
          const barH = (val / maxVal) * plotH;
          const x = groupX + si * barW;
          const y = padding.top + plotH - barH;
          ctx.fillStyle = bar.colors[si];
          ctx.fillRect(x, y, barW * 0.85, barH);
        });
      }

      // X-axis label
      const labelX =
        padding.left + barIdx * barGroupWidth + barGroupWidth / 2;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = textColor;
      ctx.fillText(
        bar.label,
        labelX,
        padding.top + plotH + 6,
      );
    });
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      .bar-canvas {
        display: block;
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
