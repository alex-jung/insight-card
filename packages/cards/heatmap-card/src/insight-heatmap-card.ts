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
import { customElement, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";

import {
    InsightBaseCard,
    type InsightHeatmapConfig,
    type ColorStop,
    findNumericSensor,
    hexToRgb,
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
        { position: 0, color: "#ffffcc" },
        { position: 0.25, color: "#fed976" },
        { position: 0.5, color: "#fd8d3c" },
        { position: 0.75, color: "#e31a1c" },
        { position: 1, color: "#800026" },
    ],
    Blues: [
        { position: 0, color: "#f7fbff" },
        { position: 0.5, color: "#6baed6" },
        { position: 1, color: "#08306b" },
    ],
    Greens: [
        { position: 0, color: "#f7fcf5" },
        { position: 0.5, color: "#74c476" },
        { position: 1, color: "#00441b" },
    ],
    RdBu: [
        { position: 0, color: "#d73027" },
        { position: 0.5, color: "#f7f7f7" },
        { position: 1, color: "#4575b4" },
    ],
};

// ---------------------------------------------------------------------------
// Colour interpolation
// ---------------------------------------------------------------------------

/** Interpolate RGB values from a list of ColorStop entries at position [0,1] */
function interpolateColorRgb(
    stops: ColorStop[],
    t: number,
): [number, number, number] {
    if (stops.length === 0) return [136, 136, 136];
    if (t <= 0) return hexToRgb(stops[0].color);
    if (t >= 1) return hexToRgb(stops[stops.length - 1].color);

    for (let i = 0; i < stops.length - 1; i++) {
        const lo = stops[i];
        const hi = stops[i + 1];
        if (t >= lo.position && t <= hi.position) {
            const range = hi.position - lo.position;
            const localT = range === 0 ? 0 : (t - lo.position) / range;
            const [r1, g1, b1] = hexToRgb(lo.color);
            const [r2, g2, b2] = hexToRgb(hi.color);
            return [
                Math.round(r1 + (r2 - r1) * localT),
                Math.round(g1 + (g2 - g1) * localT),
                Math.round(b1 + (b2 - b1) * localT),
            ];
        }
    }
    return hexToRgb(stops[stops.length - 1].color);
}

function interpolateColor(stops: ColorStop[], t: number): string {
    const [r, g, b] = interpolateColorRgb(stops, t);
    return `rgb(${r},${g},${b})`;
}

function resolveColorScale(
    scale: InsightHeatmapConfig["color_scale"],
): ColorStop[] {
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

function buildHourDayGrid(data: { t: number; v: number }[]): {
    cells: HeatCell[];
    rowLabels: string[];
    colLabels: string[];
} {
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

function buildWeekdayHourGrid(data: { t: number; v: number }[]): {
    cells: HeatCell[];
    rowLabels: string[];
    colLabels: string[];
} {
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
    static readonly cardName = "Insight Heatmap Card";
    static readonly cardDescription =
        "Heatmap visualisation of a sensor over time";

    private _canvas?: HTMLCanvasElement;
    /** Cached grid data — reused when dataset.data reference and layout are unchanged */
    private _gridCache?: {
        cells: HeatCell[];
        rowLabels: string[];
        colLabels: string[];
    };
    private _lastHeatDataRef?: (typeof this._data)[0]["data"];
    private _lastHeatLayout?: string;
    /** Computed canvas height — drives Lit template so Lit owns the style, not inline JS */
    @state() private _canvasHeight = 0;

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
                style=${styleMap({
                    width: "100%",
                    height:
                        this._canvasHeight > 0
                            ? `${this._canvasHeight}px`
                            : undefined,
                })}
            ></canvas>
            <div class="x-axis"></div>
            <div class="colorbar"></div>
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
            this.shadowRoot?.querySelector<HTMLCanvasElement>(
                ".heatmap-canvas",
            );
        if (!canvasEl) return;

        const layout = config.layout ?? "hour_day";
        let cells: HeatCell[];
        let rowLabels: string[];
        let colLabels: string[];

        // Rebuild grid only when the data reference or layout changes — skip on resize
        const rawData = dataset.data;
        if (
            this._gridCache &&
            rawData === this._lastHeatDataRef &&
            layout === this._lastHeatLayout
        ) {
            ({ cells, rowLabels, colLabels } = this._gridCache);
        } else {
            if (layout === "weekday_hour") {
                ({ cells, rowLabels, colLabels } =
                    buildWeekdayHourGrid(rawData));
            } else {
                // hour_day (default) — month_day falls back to this for now
                ({ cells, rowLabels, colLabels } = buildHourDayGrid(rawData));
            }
            this._gridCache = { cells, rowLabels, colLabels };
            this._lastHeatDataRef = rawData;
            this._lastHeatLayout = layout;
        }

        if (cells.length === 0) return;

        const numCols = colLabels.length;
        const numRows = rowLabels.length;

        // Layout constants
        const labelW = 28;
        const xAxisHeight = config.show_x_axis !== false ? 20 : 0;
        const colorbarHeight = config.show_colorbar ? 32 : 0;
        const padding = { top: 8, right: 8, bottom: 4, left: labelW };

        // Canvas height = card height minus title, x-axis and colorbar
        const totalH = this.offsetHeight;
        if (totalH === 0) return;
        const titleH = this._header?.offsetHeight ?? 0;
        const displayHeight = Math.max(40, totalH - titleH - xAxisHeight - colorbarHeight);

        const dpr = window.devicePixelRatio ?? 1;
        const displayWidth = canvasEl.clientWidth || this._cardWidth - 32;
        const plotW = displayWidth - padding.left - padding.right;

        // Cell dimensions derived from available height
        const cellW = plotW / numCols;
        const cellH = (displayHeight - padding.top - padding.bottom) / numRows;

        // If canvas height changed, let Lit re-render first — next RAF will draw
        if (this._canvasHeight !== displayHeight) {
            this._canvasHeight = displayHeight;
            return;
        }

        canvasEl.width = displayWidth * dpr;
        canvasEl.height = displayHeight * dpr;

        const ctx = canvasEl.getContext("2d");
        if (!ctx) return;

        ctx.scale(dpr, dpr);

        const colorStops = resolveColorScale(config.color_scale);

        let minVal = Infinity;
        let maxVal = -Infinity;
        for (const c of cells) {
            if (c.value < minVal) minVal = c.value;
            if (c.value > maxVal) maxVal = c.value;
        }
        const range = maxVal - minVal || 1;

        const textColor = this.isDarkTheme
            ? "rgba(255,255,255,0.6)"
            : "rgba(0,0,0,0.55)";

        // Draw cells
        const showCellValues = config.show_cell_values === true && cellH >= 10 && cellW >= 16;
        const cellFontSize = Math.min(11, Math.floor(Math.min(cellH * 0.55, cellW * 0.35)));
        const cellDecimals = config.cell_value_decimals;

        if (showCellValues) {
            ctx.font = `${cellFontSize}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
        }

        for (const cell of cells) {
            const t = (cell.value - minVal) / range;
            const [r, g, b] = interpolateColorRgb(colorStops, t);
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(
                padding.left + cell.colIdx * cellW,
                padding.top + cell.rowIdx * cellH,
                cellW - 1,
                cellH - 1,
            );

            if (showCellValues) {
                // Pick contrasting text color based on cell luminance
                const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
                ctx.fillStyle = luminance > 140 ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.9)";

                const label =
                    cellDecimals !== undefined
                        ? cell.value.toFixed(cellDecimals)
                        : Number.isInteger(cell.value)
                          ? String(cell.value)
                          : cell.value.toFixed(1);

                ctx.fillText(
                    label,
                    padding.left + cell.colIdx * cellW + (cellW - 1) / 2,
                    padding.top + cell.rowIdx * cellH + (cellH - 1) / 2,
                );
            }
        }

        // Draw row labels (Y-axis)
        ctx.font = "10px sans-serif";
        ctx.fillStyle = textColor;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        for (let r = 0; r < numRows; r++) {
            ctx.fillText(
                rowLabels[r],
                padding.left - 4,
                padding.top + r * cellH + cellH / 2,
            );
        }

        // Update X-axis element
        const xAxisEl = this.shadowRoot?.querySelector<HTMLElement>(".x-axis");
        if (xAxisEl) {
            const show = config.show_x_axis !== false;
            xAxisEl.style.display = show ? "block" : "none";
            if (show) {
                xAxisEl.style.marginLeft = `${padding.left}px`;
                xAxisEl.style.marginRight = `${padding.right}px`;
                // Clear previous labels
                while (xAxisEl.firstChild)
                    xAxisEl.removeChild(xAxisEl.firstChild);
                // Populate sparse labels
                const maxColLabels = Math.floor(plotW / 36);
                const colStep = Math.max(1, Math.floor(numCols / maxColLabels));
                for (let c = 0; c < numCols; c += colStep) {
                    const span = document.createElement("span");
                    span.textContent = colLabels[c];
                    span.style.left = `${(((c + 0.5) / numCols) * 100).toFixed(2)}%`;
                    xAxisEl.appendChild(span);
                }
            }
        }

        // Update colorbar element
        const colorbarEl =
            this.shadowRoot?.querySelector<HTMLElement>(".colorbar");
        if (colorbarEl) {
            const show = config.show_colorbar === true;
            colorbarEl.style.display = show ? "flex" : "none";
            if (show) {
                colorbarEl.style.marginLeft = `${padding.left}px`;
                colorbarEl.style.marginRight = `${padding.right}px`;

                // Build CSS gradient from color stops
                const gradientStops = colorStops
                    .map((s) => `${s.color} ${(s.position * 100).toFixed(1)}%`)
                    .join(", ");

                colorbarEl.innerHTML = `
                    <span class="colorbar-min">${minVal.toFixed(1)}</span>
                    <div class="colorbar-gradient" style="background:linear-gradient(to right,${gradientStops})"></div>
                    <span class="colorbar-max">${maxVal.toFixed(1)}</span>
                `;
            }
        }
    }

    static styles: CSSResultGroup = [
        super.styles,
        css`
            .chart-container {
                height: 100%;
            }
            .heatmap-canvas {
                display: block;
            }
            .x-axis {
                position: relative;
                height: 20px;
                font-size: 10px;
                color: var(--secondary-text-color);
            }
            .x-axis span {
                position: absolute;
                transform: translateX(-50%);
                white-space: nowrap;
            }
            .colorbar {
                display: none;
                align-items: center;
                gap: 6px;
                height: 20px;
                margin-top: 6px;
                font-size: 10px;
                color: var(--secondary-text-color);
            }
            .colorbar-gradient {
                flex: 1;
                height: 100%;
                border-radius: 2px;
            }
            .colorbar-min,
            .colorbar-max {
                white-space: nowrap;
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
