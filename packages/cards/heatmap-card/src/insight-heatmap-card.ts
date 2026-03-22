/**
 * custom:insight-heatmap-card
 *
 * Heatmap visualisation of a single entity's state over time.
 * Renders via the Canvas 2D API.
 *
 * Supported layouts:
 *   - hour_day      — columns: days, rows: hours of the day
 *   - weekday_hour  — columns: hours, rows: weekdays
 *   - month_day     — columns: days of month, rows: months
 */

import { html, css, type TemplateResult, type CSSResultGroup } from "lit";
import { customElement } from "lit/decorators.js";

import {
  InsightBaseCard,
  type InsightHeatmapConfig,
  type ColorStop,
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
// Named colour palettes
// ---------------------------------------------------------------------------

const PALETTES: Record<string, ColorStop[]> = {
  YlOrRd: [
    { position: 0,    color: "#ffffcc" },
    { position: 0.25, color: "#fed976" },
    { position: 0.5,  color: "#fd8d3c" },
    { position: 0.75, color: "#e31a1c" },
    { position: 1,    color: "#800026" },
  ],
  Blues: [
    { position: 0,    color: "#f7fbff" },
    { position: 0.5,  color: "#6baed6" },
    { position: 1,    color: "#08306b" },
  ],
  Greens: [
    { position: 0,    color: "#f7fcf5" },
    { position: 0.5,  color: "#74c476" },
    { position: 1,    color: "#00441b" },
  ],
  RdBu: [
    { position: 0,    color: "#d73027" },
    { position: 0.5,  color: "#f7f7f7" },
    { position: 1,    color: "#4575b4" },
  ],
};

// ---------------------------------------------------------------------------
// Colour interpolation
// ---------------------------------------------------------------------------

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace(/^#/, "");
  const full = clean.length === 3
    ? clean.split("").map((c) => c + c).join("")
    : clean;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

/** Interpolate a colour from a list of ColorStop entries at position [0,1] */
function interpolateColor(stops: ColorStop[], t: number): string {
  if (stops.length === 0) return "#888";
  if (t <= 0) return stops[0].color;
  if (t >= 1) return stops[stops.length - 1].color;

  for (let i = 0; i < stops.length - 1; i++) {
    const lo = stops[i];
    const hi = stops[i + 1];
    if (t >= lo.position && t <= hi.position) {
      const range = hi.position - lo.position;
      const localT = range === 0 ? 0 : (t - lo.position) / range;
      const [r1, g1, b1] = hexToRgb(lo.color);
      const [r2, g2, b2] = hexToRgb(hi.color);
      const r = Math.round(r1 + (r2 - r1) * localT);
      const g = Math.round(g1 + (g2 - g1) * localT);
      const b = Math.round(b1 + (b2 - b1) * localT);
      return `rgb(${r},${g},${b})`;
    }
  }
  return stops[stops.length - 1].color;
}

function resolveColorScale(scale: InsightHeatmapConfig["color_scale"]): ColorStop[] {
  if (!scale) return PALETTES.YlOrRd;
  if (typeof scale === "string") return PALETTES[scale] ?? PALETTES.YlOrRd;
  return scale;
}

// ---------------------------------------------------------------------------
// Data bucketing
// ---------------------------------------------------------------------------

interface HeatCell {
  rowIdx: number;
  colIdx: number;
  value: number;
  count: number;
}

function buildHourDayGrid(
  data: { t: number; v: number }[],
): { cells: HeatCell[]; rowLabels: string[]; colLabels: string[] } {
  // rows: hours 0–23, cols: each unique day
  const daySet = new Set<string>();
  for (const p of data) {
    const d = new Date(p.t);
    daySet.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
  }
  const days = Array.from(daySet).sort();
  const dayIndex = new Map(days.map((d, i) => [d, i]));

  const colLabels = days.map((d) => {
    const parts = d.split("-");
    return `${parts[2]}.${(parseInt(parts[1], 10) + 1).toString().padStart(2, "0")}`;
  });
  const rowLabels = Array.from({ length: 24 }, (_, h) =>
    h.toString().padStart(2, "0"),
  );

  const sums = new Map<string, { sum: number; count: number }>();
  for (const p of data) {
    const d = new Date(p.t);
    const dayKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const key = `${d.getHours()}_${dayKey}`;
    const prev = sums.get(key) ?? { sum: 0, count: 0 };
    sums.set(key, { sum: prev.sum + p.v, count: prev.count + 1 });
  }

  const cells: HeatCell[] = [];
  for (const [key, { sum, count }] of sums) {
    const [hourStr, ...dayParts] = key.split("_");
    const dayKey = dayParts.join("_");
    const colIdx = dayIndex.get(dayKey) ?? -1;
    if (colIdx < 0) continue;
    cells.push({
      rowIdx: parseInt(hourStr, 10),
      colIdx,
      value: sum / count,
      count,
    });
  }

  return { cells, rowLabels, colLabels };
}

function buildWeekdayHourGrid(
  data: { t: number; v: number }[],
): { cells: HeatCell[]; rowLabels: string[]; colLabels: string[] } {
  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const rowLabels = DAY_NAMES;
  const colLabels = Array.from({ length: 24 }, (_, h) =>
    h.toString().padStart(2, "0"),
  );

  const sums = new Map<string, { sum: number; count: number }>();
  for (const p of data) {
    const d = new Date(p.t);
    const key = `${d.getDay()}_${d.getHours()}`;
    const prev = sums.get(key) ?? { sum: 0, count: 0 };
    sums.set(key, { sum: prev.sum + p.v, count: prev.count + 1 });
  }

  const cells: HeatCell[] = [];
  for (const [key, { sum, count }] of sums) {
    const [dayStr, hourStr] = key.split("_");
    cells.push({
      rowIdx: parseInt(dayStr, 10),
      colIdx: parseInt(hourStr, 10),
      value: sum / count,
      count,
    });
  }

  return { cells, rowLabels, colLabels };
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

@customElement("insight-heatmap-card")
export class InsightHeatmapCard extends InsightBaseCard {
  static readonly cardType = "custom:insight-heatmap-card";
  static readonly cardName = "InsightChart Heatmap";
  static readonly cardDescription =
    "Heatmap visualisation of a sensor over time";

  private _canvas?: HTMLCanvasElement;

  static getConfigElement(): HTMLElement {
    return document.createElement("insight-heatmap-card-editor");
  }

  static getStubConfig(
    hass: unknown,
    entities: string[],
    entitiesFallback: string[],
  ): Partial<InsightHeatmapConfig> {
    const sensor = findNumericSensor(hass, entities, entitiesFallback);
    return {
      type: InsightHeatmapCard.cardType,
      entities: [{ entity: sensor }],
      hours: 168,
      color_scale: "YlOrRd",
      layout: "hour_day",
    };
  }

  protected getDefaultConfig(): Partial<InsightHeatmapConfig> {
    return {
      hours: 168,
      color_scale: "YlOrRd",
      layout: "hour_day",
      update_interval: 60,
    };
  }

  protected renderChart(): TemplateResult {
    return html`
      <canvas
        class="heatmap-canvas"
        style="width:100%;height:${this.getChartHeight()}px"
      ></canvas>
    `;
  }

  override updated(changedProps: Map<string, unknown>): void {
    super.updated(changedProps);
    requestAnimationFrame(() => this._drawHeatmap());
  }

  private _drawHeatmap(): void {
    const config = this._config as InsightHeatmapConfig | undefined;
    if (!config || this._loading || this._data.length === 0) return;

    const dataset = this._data[0];
    if (!dataset || dataset.data.length === 0) return;

    const canvasEl =
      this.shadowRoot?.querySelector<HTMLCanvasElement>(".heatmap-canvas");
    if (!canvasEl) return;

    const dpr = window.devicePixelRatio ?? 1;
    const displayWidth = canvasEl.clientWidth || this._cardWidth - 32;
    const displayHeight = canvasEl.clientHeight || this.getChartHeight();

    canvasEl.width = displayWidth * dpr;
    canvasEl.height = displayHeight * dpr;

    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    const layout = config.layout ?? "hour_day";
    let cells: HeatCell[];
    let rowLabels: string[];
    let colLabels: string[];

    if (layout === "weekday_hour") {
      ({ cells, rowLabels, colLabels } = buildWeekdayHourGrid(dataset.data));
    } else {
      // hour_day (default) — month_day falls back to this for now
      ({ cells, rowLabels, colLabels } = buildHourDayGrid(dataset.data));
    }

    if (cells.length === 0) return;

    const colorStops = resolveColorScale(config.color_scale);

    let minVal = Infinity;
    let maxVal = -Infinity;
    for (const c of cells) {
      if (c.value < minVal) minVal = c.value;
      if (c.value > maxVal) maxVal = c.value;
    }
    const range = maxVal - minVal || 1;

    // Layout parameters
    const labelW = 28;
    const labelH = 20;
    const padding = { top: labelH, right: 8, bottom: 8, left: labelW };
    const plotW = displayWidth - padding.left - padding.right;
    const plotH = displayHeight - padding.top - padding.bottom;

    const numCols = colLabels.length;
    const numRows = rowLabels.length;
    const cellW = plotW / numCols;
    const cellH = plotH / numRows;

    const textColor = this.isDarkTheme
      ? "rgba(255,255,255,0.6)"
      : "rgba(0,0,0,0.55)";

    // Draw cells
    for (const cell of cells) {
      const t = (cell.value - minVal) / range;
      ctx.fillStyle = interpolateColor(colorStops, t);
      ctx.fillRect(
        padding.left + cell.colIdx * cellW,
        padding.top + cell.rowIdx * cellH,
        cellW - 1,
        cellH - 1,
      );
    }

    // Draw column labels (sparse — every Nth)
    ctx.font = "10px sans-serif";
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    const maxColLabels = Math.floor(plotW / 36);
    const colStep = Math.max(1, Math.floor(numCols / maxColLabels));
    for (let c = 0; c < numCols; c += colStep) {
      ctx.fillText(
        colLabels[c],
        padding.left + c * cellW + cellW / 2,
        padding.top - 3,
      );
    }

    // Draw row labels
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let r = 0; r < numRows; r++) {
      ctx.fillText(
        rowLabels[r],
        padding.left - 4,
        padding.top + r * cellH + cellH / 2,
      );
    }
  }

  static styles: CSSResultGroup = [
    super.styles,
    css`
      .heatmap-canvas {
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
  type: InsightHeatmapCard.cardType.replace("custom:", ""),
  name: InsightHeatmapCard.cardName,
  description: InsightHeatmapCard.cardDescription,
  preview: true,
});
