/**
 * custom:insight-line-card
 *
 * Interactive time-series chart powered by uPlot. Supports line, area, and
 * step rendering modes with drag-to-zoom.
 */

import { html, css, type TemplateResult, type CSSResultGroup, PropertyValues } from "lit";
import { customElement, query, state } from "lit/decorators.js";
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
      #chart {
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
    /** Floating tooltip element — lives inside u-wrap */
    private _tooltipEl?: HTMLDivElement;
    /** Cached per-entity colors for tooltip — rebuilt when config changes */
    private _tooltipColors: string[] = [];
    /** Cached u.over offset — stable between resizes, updated in ready hook */
    private _overLeft = 0;
    private _overTop = 0;
    /** Last _data reference used to build uData — used to skip rebuild on size-only changes */
    private _lastDataRef?: typeof this._data;
    /** Cached uPlot aligned data — reused when _data reference is unchanged */
    private _cachedUData?: uPlot.AlignedData;
    /** Cached resolved --error-color for threshold lines — avoids getComputedStyle on every draw */
    private _thresholdDefaultColor = "#db4437";

    private _resizeObserver: ResizeObserver | null = null;

    /** Cached chart height in px — updated by ResizeObserver, read by _syncUplot/_buildOptions */
    protected _chartHeight = 220;

    @query("#chart")
    private wrapper!: HTMLDivElement

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
            entities: [sensor],
            hours: 24,
            style: "area",
            zoom: true,
            line_width: 1,
            show_legend: true,
            margin_bottom: 16,
            margin_top: 16,
            margin_left: 4,
            margin_right: 4,
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
            show_x_axis: true,
            show_y_axis: true,
        };
    }

    /**
     * Measures available chart height from the DOM and updates _chartHeight.
     * Must only be called after paint (double-RAF from updated()), never during render().
     */
    private _refreshChartHeight(): void {
        const total = this.offsetHeight;
        if (total === 0) return; // not yet laid out

        const legendEl = this.shadowRoot?.querySelector<HTMLElement>(".u-legend");
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
            const isSmooth = !isStep && config.curve === "smooth";
            const pathBuilder = isStep
                ? uPlot.paths.stepped!({ align: 1 })
                : isSmooth
                    ? uPlot.paths.spline!()
                    : undefined;

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
                paths: pathBuilder,
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

        console.log("uPlot data built", valueSeries);

        return [timestamps, ...valueSeries] as uPlot.AlignedData;
    }

    /** Build uPlot options object */
    private _buildOptions(config: InsightLineConfig): uPlot.Options {
        console.debug("[line-card] build options");

        // Measure actual available width from the wrapper element if possible
        const chartWidth = Math.max(100, this.wrapper?.clientWidth || this._cardWidth - 32);
        let chartHeight = this._chartHeight;
        const isDark = this.isDarkTheme;

        // Canvas doesn't resolve CSS variables — read computed values from the host element.
        const cs = getComputedStyle(this);
        const axisStroke = isDark
            ? "rgba(255,255,255,0.55)"
            : cs.getPropertyValue("--secondary-text-color").trim() || "rgba(0,0,0,0.55)";
        const gridOpacity = config.grid_opacity ?? 1;
        const gridStroke = gridOpacity === 1
            ? (isDark
                ? "rgba(255,255,255,0.08)"
                : cs.getPropertyValue("--divider-color").trim() || "rgba(0,0,0,0.08)")
            : (isDark
                ? `rgba(255,255,255,${(0.08 * gridOpacity).toFixed(3)})`
                : `rgba(0,0,0,${(0.08 * gridOpacity).toFixed(3)})`);

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
                .flatMap((ec, i) => ec.y_axis === "right" ? [this._data[i]?.unit] : [])
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
            const maxW = vals.reduce<number>((m, v) => {
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
                    show: config.show_x_axis !== false,
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
                    show: config.show_y_axis !== false,
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
                    // Cache u.over offsets — stable until next resize
                    this._overLeft = u.over.offsetLeft;
                    this._overTop = u.over.offsetTop;
                }],
                setSize: [(u) => {
                    this._overLeft = u.over.offsetLeft;
                    this._overTop = u.over.offsetTop;
                }],
                destroy: [() => {
                    this._tooltipEl = undefined;
                }],
            },
            // padding: [0, 0, 0, 0],
            padding: [8, 16, 8, 16],
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
        const defaultColor = this._thresholdDefaultColor;
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

        // Use cached colors — no allocation on mousemove
        const rows = this._data.map((dataset, i) => {
            const val = u.data[i + 1]?.[idx];
            if (val == null) return "";
            const unit = dataset.unit ? ` ${dataset.unit}` : "";
            const color = this._tooltipColors[i] ?? "#888";
            const name = dataset.friendlyName;
            return `<div class="u-tooltip-row">
        <span class="u-tooltip-dot" style="background:${color}"></span>
        <span class="u-tooltip-name">${name}</span>
        <span class="u-tooltip-value">${formatValue(val)}${unit}</span>
      </div>`;
        }).filter(Boolean).join("");

        tooltip.innerHTML = `<div class="u-tooltip-time">${timeLabel}</div>${rows}`;
        tooltip.style.display = "block";

        // Use cached offsets — no DOM layout reads on mousemove
        const left = u.cursor.left! + this._overLeft;
        const top = u.cursor.top! + this._overTop;
        const flip = left > u.width / 2;
        // CSS transform avoids reading offsetWidth/offsetHeight (no forced reflow)
        tooltip.style.left = `${left + (flip ? -12 : 12)}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.transform = flip ? "translate(-100%, -50%)" : "translateY(-50%)";
    }

    // -------------------------------------------------------------------------
    // Chart render
    // -------------------------------------------------------------------------

    protected renderChart(): TemplateResult {
        console.debug("[line-card] render chart", this._config);

        const config = this._config as InsightLineConfig | undefined;
        if (!config) return html``;

        return html`<div id="chart"></div>`;
    }

    override connectedCallback(): void {
        super.connectedCallback();

        this._resizeObserver = new ResizeObserver(([entry]) => {
            this._refreshChartHeight();

            const height = this._chartHeight;
            const width = this.wrapper?.clientWidth ?? entry.contentRect.width;

            // Guard: Preview-Container kann kurz 0-breit sein
            if (width < 10 || height < 10) return;

            if (!this._uplot) {
                this._syncUplot();
            } else {
                this._uplot.setSize({ width, height });
            }
        });

        this.updateComplete.then(() => {
            this._resizeObserver!.observe(this);
            if (!this._uplot) this._syncUplot();
        });
    }

    updated(changedProps: Map<string, unknown>): void {
        super.updated(changedProps);

        console.log("[line-card] updated, data", this._data);
        console.log("[line-card] updated, uPlot", this._uplot);

        if (this._uplot && this._data !== this._lastDataRef) {
            // If uPlot was built with no data (initial render before fetch completed),
            // do a full rebuild so axis labels, units and series names are correct.
            const previouslyEmpty = !this._lastDataRef ||
                this._lastDataRef.every(d => d.data.length === 0);
            this._cachedUData = this._buildUplotData();
            this._lastDataRef = this._data;
            if (previouslyEmpty) {
                this._needsRebuild = true;
                this._syncUplot();
            } else {
                this._uplot.setData(this._cachedUData);
            }
        }
    }

    /** Create or update the uPlot instance to match current state */
    private _syncUplot(): void {
        console.log("[_syncUpload]", this._config, this._data);

        const config = this._config as InsightLineConfig | undefined;
        if (!config || !this.wrapper) return;

        const needsFull = this._needsRebuild || !this._uplot;

        // Rebuild uData only when data actually changed or a full rebuild is required.
        // On resize, _data reference is stable → reuse cached uData.
        const dataChanged = this._data !== this._lastDataRef;

        console.debug("[_syncUpload] needsFull, dataChanged", needsFull, dataChanged);

        if (needsFull || dataChanged) {
            this._cachedUData = this._buildUplotData();
            this._lastDataRef = this._data;
        }
        const uData = this._cachedUData!;

        if (needsFull) {
            // Cache per-entity colors (done here so tooltip has fresh values after rebuild)
            const palette = generateColors(this.entityConfigs.length);
            this._tooltipColors = this.entityConfigs.map((ec, i) => ec.color ?? palette[i]);
            // Cache threshold default color — avoids getComputedStyle on every canvas draw
            this._thresholdDefaultColor =
                getComputedStyle(this).getPropertyValue("--error-color").trim() || "#db4437";

            const opts = this._buildOptions(config);
            this._uplot?.destroy();
            this._uplot = undefined;
            this._uplot = new uPlot(opts, uData, this.wrapper);
            this._needsRebuild = false;
        } else {
            // Size-only change — skip data rebuild and options rebuild
            const chartWidth = Math.max(100, this.wrapper.clientWidth || this._cardWidth - 32);
            const chartHeight = this._chartHeight;
            if (dataChanged) this._uplot!.setData(uData, false);
            this._uplot!.setSize({ width: chartWidth, height: chartHeight });
        }
    }

    override disconnectedCallback(): void {
        console.debug("[line-card] disconneted");
        super.disconnectedCallback();
        this._uplot?.destroy();
        this._uplot = undefined;
        this._lastDataRef = undefined;
        this._cachedUData = undefined;
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
