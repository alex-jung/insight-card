/**
 * custom:insight-heatmap-card
 *
 * Heatmap visualisation of a single entity's state over time.
 * Renders via the Canvas 2D API.
 *
 * Supported layouts:
 *   - hour_day      — columns: days, rows: hours of the day
 *   - weekday_hour  — columns: hours, rows: weekdays
 *   - month_day     — columns: days 1–31, rows: months (localized)
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
    Viridis: [
        { position: 0,    color: "#440154" },
        { position: 0.25, color: "#31688e" },
        { position: 0.5,  color: "#35b779" },
        { position: 0.75, color: "#90d743" },
        { position: 1,    color: "#fde725" },
    ],
    Plasma: [
        { position: 0,    color: "#0d0887" },
        { position: 0.25, color: "#7e03a8" },
        { position: 0.5,  color: "#cc4778" },
        { position: 0.75, color: "#f89441" },
        { position: 1,    color: "#f0f921" },
    ],
    Purples: [
        { position: 0,   color: "#fcfbfd" },
        { position: 0.5, color: "#9e9ac8" },
        { position: 1,   color: "#3f007d" },
    ],
    Oranges: [
        { position: 0,   color: "#fff5eb" },
        { position: 0.5, color: "#fd8d3c" },
        { position: 1,   color: "#7f2704" },
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

/**
 * Monday-first row index: getDay() returns 0=Sun … 6=Sat.
 * (day + 6) % 7 maps Mon→0, Tue→1 … Sun→6.
 */
function mondayFirstIdx(jsDay: number): number {
    return (jsDay + 6) % 7;
}

/**
 * Generate Monday-first short weekday labels via Intl.
 * Jan 2 2023 is a Monday — iterating +0…+6 gives Mon…Sun.
 */
function weekdayLabels(locale?: string): string[] {
    const fmt = new Intl.DateTimeFormat(locale ?? "en", { weekday: "short" });
    return Array.from({ length: 7 }, (_, i) =>
        fmt.format(new Date(2023, 0, 2 + i)),
    );
}

function buildWeekdayHourGrid(
    data: { t: number; v: number }[],
    locale?: string,
): {
    cells: HeatCell[];
    rowLabels: string[];
    colLabels: string[];
} {
    const rowLabels = weekdayLabels(locale);
    const colLabels = Array.from({ length: 24 }, (_, h) =>
        h.toString().padStart(2, "0"),
    );

    const sums = new Map<string, { sum: number; count: number }>();
    for (const p of data) {
        const d = new Date(p.t);
        const key = `${mondayFirstIdx(d.getDay())}_${d.getHours()}`;
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

/**
 * Generate short month labels via Intl (Jan 1 … Dec 1 of any non-leap year).
 */
function monthLabels(locale?: string): string[] {
    const fmt = new Intl.DateTimeFormat(locale ?? "en", { month: "short" });
    return Array.from({ length: 12 }, (_, i) =>
        fmt.format(new Date(2023, i, 1)),
    );
}

function buildMonthDayGrid(
    data: { t: number; v: number }[],
    locale?: string,
): {
    cells: HeatCell[];
    rowLabels: string[];
    colLabels: string[];
} {
    // rows: months 0–11, cols: days 1–31
    const rowLabels = monthLabels(locale);
    const colLabels = Array.from({ length: 31 }, (_, i) =>
        (i + 1).toString(),
    );

    const sums = new Map<string, { sum: number; count: number }>();
    for (const p of data) {
        const d = new Date(p.t);
        const key = `${d.getMonth()}_${d.getDate() - 1}`;
        const prev = sums.get(key) ?? { sum: 0, count: 0 };
        sums.set(key, { sum: prev.sum + p.v, count: prev.count + 1 });
    }

    const cells: HeatCell[] = [];
    for (const [key, { sum, count }] of sums) {
        const [monthStr, dayStr] = key.split("_");
        cells.push({
            rowIdx: parseInt(monthStr, 10),
            colIdx: parseInt(dayStr, 10),
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
    private _lastHeatLocale?: string;
    /** Computed canvas height — drives Lit template so Lit owns the style, not inline JS */
    @state() private _canvasHeight = 0;
    /**
     * Stable card height captured when canvas is absent (no circular dependency).
     * Only re-read when _canvasHeight === 0 or ResizeObserver detects a genuine resize.
     */
    private _stableH = 0;
    private _ro?: ResizeObserver;

    /** Layout state cached for use in mouse event handlers */
    private _tooltipState?: {
        cells: HeatCell[];
        colLabels: string[];
        rowLabels: string[];
        cellW: number;
        cellH: number;
        padding: { top: number; right: number; bottom: number; left: number };
        layout: string;
        minVal: number;
        maxVal: number;
        unit: string;
    };
    private _tooltipEl?: HTMLDivElement;

    override connectedCallback(): void {
        super.connectedCallback();
        this._ro = new ResizeObserver((entries) => {
            const newH = entries[0].contentRect.height;
            // Only react to genuine card resizes (≥20 px delta from last stable value).
            // Ignore transient layout noise caused by our own canvas updates.
            if (newH > 0 && Math.abs(newH - this._stableH) >= 20) {
                this._stableH = 0;        // force re-measure in _drawHeatmap
                this._canvasHeight = 0;   // triggers Lit re-render → new draw cycle
            }
        });
        this._ro.observe(this);
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this._ro?.disconnect();
        this._ro = undefined;
    }

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
            padding_top: 8,
            padding_right: 8,
            padding_bottom: 4,
            padding_left: 28,
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
            <div class="heatmap-tooltip"></div>
        `;
    }

    override updated(changedProps: Map<string, unknown>): void {
        super.updated(changedProps);
        requestAnimationFrame(() => this._drawHeatmap());
    }

    private _drawHeatmap(): void {
        const config = this._config as InsightHeatmapConfig | undefined;
        if (!config) return;

        const canvasEl =
            this.shadowRoot?.querySelector<HTMLCanvasElement>(
                ".heatmap-canvas",
            );
        if (!canvasEl) return;

        // Measure the card height only when the canvas is absent — at that point
        // there is no circular dependency between canvas size and card size.
        // Once captured in _stableH, the same value is reused for all subsequent
        // draws until ResizeObserver detects a genuine card resize.
        if (this._canvasHeight === 0) {
            const h = this.offsetHeight;
            if (h > 0) this._stableH = h;
        }
        const totalH = this._stableH;
        if (totalH === 0) return;

        const xAxisHeight = config.show_x_axis !== false ? 20 : 0;
        const colorbarHeight = config.show_colorbar ? 32 : 0;
        const titleH = this._header?.offsetHeight ?? 0;
        const displayHeight = Math.max(40, totalH - titleH - xAxisHeight - colorbarHeight);

        if (this._canvasHeight !== displayHeight) {
            this._canvasHeight = displayHeight;
            return;
        }

        // Skip drawing until data is available and loading is complete
        if (this._loading || this._data.length === 0) return;

        const dataset = this._data[0];
        if (!dataset || dataset.data.length === 0) return;

        const layout = config.layout ?? "hour_day";
        let cells: HeatCell[];
        let rowLabels: string[];
        let colLabels: string[];

        // Rebuild grid only when the data reference or layout changes — skip on resize
        const rawData = dataset.data;
        const locale = this.hass?.language;
        if (
            this._gridCache &&
            rawData === this._lastHeatDataRef &&
            layout === this._lastHeatLayout &&
            locale === this._lastHeatLocale
        ) {
            ({ cells, rowLabels, colLabels } = this._gridCache);
        } else {
            if (layout === "weekday_hour") {
                ({ cells, rowLabels, colLabels } =
                    buildWeekdayHourGrid(rawData, locale));
            } else if (layout === "month_day") {
                ({ cells, rowLabels, colLabels } =
                    buildMonthDayGrid(rawData, locale));
            } else {
                ({ cells, rowLabels, colLabels } = buildHourDayGrid(rawData));
            }
            this._gridCache = { cells, rowLabels, colLabels };
            this._lastHeatDataRef = rawData;
            this._lastHeatLayout = layout;
            this._lastHeatLocale = locale;
        }

        if (cells.length === 0) return;

        const numCols = colLabels.length;
        const numRows = rowLabels.length;

        // Padding values come from config (defaults set in getDefaultConfig)
        const showYAxis = config.show_y_axis !== false;
        const padding = {
            top:    config.padding_top    ?? 8,
            right:  config.padding_right  ?? 8,
            bottom: config.padding_bottom ?? 4,
            left:   config.padding_left   ?? (showYAxis ? 28 : 4),
        };

        const dpr = window.devicePixelRatio ?? 1;
        const displayWidth = canvasEl.clientWidth || this._cardWidth - 32;
        const plotW = displayWidth - padding.left - padding.right;

        // Cell dimensions derived from available height
        const cellW = plotW / numCols;
        const cellH = (displayHeight - padding.top - padding.bottom) / numRows;

        canvasEl.width = displayWidth * dpr;
        canvasEl.height = displayHeight * dpr;

        const ctx = canvasEl.getContext("2d");
        if (!ctx) return;

        ctx.scale(dpr, dpr);

        const colorStops = resolveColorScale(config.color_scale);
        const reverseScale = config.reverse_scale === true;
        const cellGap = config.cell_gap ?? 1;
        const cellRadius = config.cell_radius ?? 0;
        const emptyColor = config.empty_color ?? "transparent";

        let autoMin = Infinity;
        let autoMax = -Infinity;
        for (const c of cells) {
            if (c.value < autoMin) autoMin = c.value;
            if (c.value > autoMax) autoMax = c.value;
        }
        const minVal = config.value_min ?? autoMin;
        const maxVal = config.value_max ?? autoMax;
        const range = maxVal - minVal || 1;

        const textColor = this.isDarkTheme
            ? "rgba(255,255,255,0.6)"
            : "rgba(0,0,0,0.55)";

        // Draw empty cells first (background pass)
        if (emptyColor !== "transparent") {
            const filled = new Set(cells.map((c) => `${c.rowIdx}_${c.colIdx}`));
            ctx.fillStyle = emptyColor;
            for (let row = 0; row < numRows; row++) {
                for (let col = 0; col < numCols; col++) {
                    if (filled.has(`${row}_${col}`)) continue;
                    const cx = padding.left + col * cellW;
                    const cy = padding.top + row * cellH;
                    const cw = cellW - cellGap;
                    const ch = cellH - cellGap;
                    if (cellRadius > 0) {
                        const rx = Math.min(cellRadius, cw / 2, ch / 2);
                        ctx.beginPath();
                        ctx.roundRect(cx, cy, cw, ch, rx);
                        ctx.fill();
                    } else {
                        ctx.fillRect(cx, cy, cw, ch);
                    }
                }
            }
        }

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
            const t0 = Math.max(0, Math.min(1, (cell.value - minVal) / range));
            const t = reverseScale ? 1 - t0 : t0;
            const [r, g, b] = interpolateColorRgb(colorStops, t);
            ctx.fillStyle = `rgb(${r},${g},${b})`;

            const cx = padding.left + cell.colIdx * cellW;
            const cy = padding.top + cell.rowIdx * cellH;
            const cw = cellW - cellGap;
            const ch = cellH - cellGap;

            if (cellRadius > 0) {
                const rx = Math.min(cellRadius, cw / 2, ch / 2);
                ctx.beginPath();
                ctx.roundRect(cx, cy, cw, ch, rx);
                ctx.fill();
            } else {
                ctx.fillRect(cx, cy, cw, ch);
            }

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
                    cx + cw / 2,
                    cy + ch / 2,
                );
            }
        }

        // Draw row labels (Y-axis)
        if (showYAxis) {
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

        // Cache layout state for mouse handlers
        this._tooltipState = {
            cells,
            colLabels,
            rowLabels,
            cellW,
            cellH,
            padding,
            layout,
            minVal,
            maxVal,
            unit: this._data[0]?.unit ?? "",
        };

        // Register mouse listeners once
        if (!this._tooltipEl) {
            this._tooltipEl =
                this.shadowRoot?.querySelector<HTMLDivElement>(
                    ".heatmap-tooltip",
                ) ?? undefined;
            canvasEl.addEventListener("mousemove", (e) =>
                this._onMouseMove(e),
            );
            canvasEl.addEventListener("mouseleave", () =>
                this._hideTooltip(),
            );
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

    private _hideTooltip(): void {
        if (this._tooltipEl) this._tooltipEl.style.display = "none";
    }

    private _onMouseMove(e: MouseEvent): void {
        const tooltip = this._tooltipEl;
        const state = this._tooltipState;
        if (!tooltip || !state) return;

        const canvas = e.currentTarget as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const { cells, colLabels, rowLabels, cellW, cellH, padding, layout, minVal, maxVal, unit } = state;

        const colIdx = Math.floor((x - padding.left) / cellW);
        const rowIdx = Math.floor((y - padding.top) / cellH);

        if (
            colIdx < 0 || colIdx >= colLabels.length ||
            rowIdx < 0 || rowIdx >= rowLabels.length
        ) {
            this._hideTooltip();
            return;
        }

        const cell = cells.find(
            (c) => c.colIdx === colIdx && c.rowIdx === rowIdx,
        );
        if (!cell) {
            this._hideTooltip();
            return;
        }

        // Format time label depending on layout
        const colLabel = colLabels[colIdx];
        const rowLabel = rowLabels[rowIdx];
        let timeLabel: string;
        if (layout === "weekday_hour") {
            timeLabel = `${rowLabel} ${colLabel}:00`;
        } else if (layout === "month_day") {
            timeLabel = `${colLabel}. ${rowLabel}`;
        } else {
            timeLabel = `${colLabel} ${rowLabel}:00`;
        }

        // Format value
        const valueStr =
            Number.isInteger(cell.value)
                ? String(cell.value)
                : cell.value.toFixed(1);
        const valueLabel = unit ? `${valueStr} ${unit}` : valueStr;

        tooltip.innerHTML = `
            <div class="heatmap-tooltip-time">${timeLabel}</div>
            <div class="heatmap-tooltip-value">${valueLabel}</div>
        `;
        tooltip.style.display = "block";

        // Position with flip logic — avoid overflowing right/bottom edge
        const flipX = x > rect.width / 2;
        const flipY = y > rect.height / 2;
        tooltip.style.left = flipX ? "" : `${x + 12}px`;
        tooltip.style.right = flipX ? `${rect.width - x + 12}px` : "";
        tooltip.style.top = flipY ? "" : `${y + 8}px`;
        tooltip.style.bottom = flipY ? `${rect.height - y + 8}px` : "";
    }

    static styles: CSSResultGroup = [
        super.styles,
        css`
            .chart-container {
                height: 100%;
                position: relative;
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
            .heatmap-tooltip {
                display: none;
                position: absolute;
                pointer-events: none;
                background: var(--card-background-color, #fff);
                border: 1px solid var(--divider-color, #e0e0e0);
                border-radius: 6px;
                padding: 6px 8px;
                font-size: 0.75rem;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                z-index: 10;
                white-space: nowrap;
            }
            .heatmap-tooltip-time {
                color: var(--secondary-text-color);
                margin-bottom: 2px;
            }
            .heatmap-tooltip-value {
                font-weight: 500;
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
