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
  normaliseEntityConfig,
  type InsightBarConfig,
  type ThresholdConfig,
  type ActionConfig,
  generateColors,
  formatValue,
  findNumericSensor,
} from "@insight-chart/core";

import { aggregateBuckets, bucketKey, bucketLabel, colorFromThresholds } from "./bar-utils.js";

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

  /** Floating tooltip element — appended to u.root */
  private _tooltipEl?: HTMLDivElement;
  /** Cached u.over offset — updated in ready hook, used for tooltip positioning */
  private _overLeft = 0;
  private _overTop = 0;

  /** Cached --error-color for threshold lines */
  private _thresholdDefaultColor = "#db4437";

  /** Zoom drag / touch state */
  private _isDragging = false;
  private _dragStartX = 0;
  private _zoomOverlay?: HTMLDivElement;
  /** Initial pinch distance recorded on touchstart with 2 fingers */
  private _pinchInitDist = 0;
  /** Bucket indices at the left/right finger when pinch started */
  private _pinchInitRange: [number, number] = [0, 0];

  /**
   * The slice of _buildBucketData() currently shown in uPlot.
   * Equals the full data when _zoomRange is null, otherwise a sliced copy.
   * Must be set in _syncUplot() BEFORE new uPlot() / setData so that all
   * closures (range, draw, tooltip) read consistent data.
   */
  private _activeBucketData?: BucketData;

  /** Currently zoomed bucket index range [start, end] into the full bucket data. */
  @state() private _zoomRange: [number, number] | null = null;
  /** Index of the currently hovered legend item — drives bar opacity in draw hook */
  @state() private _hoveredSeriesIdx: number | null = null;
  /** Set of hidden series indices — toggled by legend click */
  @state() private _hiddenSeries = new Set<number>();

  /** Default chart area height in px (matches base .chart-container) */
  protected _chartHeight = 220;

  /** Action timers */
  private _tapTimer?: ReturnType<typeof setTimeout>;
  private _holdTimer?: ReturnType<typeof setTimeout>;
  /** Set in endDrag when a real zoom occurred — suppresses the following click */
  private _wasZoomDrag = false;
  /** Last known mouse position over u.over (CSS px, relative to plot area) */
  private _lastMouseX = 0;
  private _lastMouseY = 0;

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
      margin_bottom: 16,
      margin_left: 0,
      padding_left: 0,
    };
  }

  protected renderChart(): TemplateResult {
    return html`
      <div
        class="chart-wrapper"
        @click=${(e: MouseEvent) => {
          if (this._wasZoomDrag) { this._wasZoomDrag = false; return; }
          clearTimeout(this._holdTimer);
          this._tapTimer = setTimeout(() => this._handleAction("tap_action"), 250);
        }}
        @dblclick=${(e: MouseEvent) => {
          clearTimeout(this._tapTimer);
          clearTimeout(this._holdTimer);
          this._handleAction("double_tap_action");
        }}
        @pointerdown=${(e: PointerEvent) => {
          clearTimeout(this._holdTimer);
          this._holdTimer = setTimeout(() => {
            clearTimeout(this._tapTimer);
            this._handleAction("hold_action");
          }, 500);
        }}
        @pointerup=${() => clearTimeout(this._holdTimer)}
        @pointermove=${() => clearTimeout(this._holdTimer)}
        @pointercancel=${() => clearTimeout(this._holdTimer)}
      >
        <div id="chart" style="position:relative;">
          ${this._zoomRange ? html`
            <div class="bar-zoom-reset" @click=${(e: Event) => { e.stopPropagation(); this._zoomRange = null; }}>
              ↺ Reset Zoom
            </div>
          ` : nothing}
        </div>
      </div>
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
              ${this.entityConfigs[i]?.name ?? dataset.friendlyName ?? this.entityConfigs[i]?.entity ?? `Entity ${i + 1}`}
            </span>
          `;
        })}
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // HA Actions (tap / double-tap / hold)
  // ---------------------------------------------------------------------------

  private _handleAction(
    actionType: "tap_action" | "double_tap_action" | "hold_action",
  ): void {
    const cfg = this._config as InsightBarConfig | undefined;
    const action = cfg?.[actionType as keyof InsightBarConfig] as ActionConfig | undefined;

    const detectedIdx = this._getSeriesAtPoint(this._lastMouseX, this._lastMouseY);

    if (!action) {
      if (actionType === "tap_action") this._fireMoreInfo(cfg, detectedIdx);
      return;
    }
    if (action.action === "none") return;

    switch (action.action) {
      case "more-info":
        this._fireMoreInfo(cfg, detectedIdx);
        break;
      case "navigate":
        if (action.navigation_path) {
          history.pushState(null, "", action.navigation_path);
          this.dispatchEvent(new CustomEvent("location-changed", { bubbles: true, composed: true }));
        }
        break;
      case "url":
        if (action.url_path) window.open(action.url_path, "_blank");
        break;
      case "perform-action": {
        const serviceStr = action.perform_action ?? action.service ?? "";
        const [domain, service] = serviceStr.split(".", 2);
        if (domain && service) {
          this.hass?.callService(domain, service, action.data ?? action.service_data ?? {});
        }
        break;
      }
    }
  }

  private _fireMoreInfo(cfg: InsightBarConfig | undefined, entityIdx = 0): void {
    const entities = cfg?.entities;
    if (!entities || entities.length === 0) return;
    const raw = entities[Math.min(entityIdx, entities.length - 1)];
    if (!raw) return;
    const entityId = normaliseEntityConfig(raw).entity;
    if (!entityId) return;
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId },
        bubbles: true,
        composed: true,
      }),
    );
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
      this._zoomRange = null;
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

  private _getDisplayBucketData(): BucketData {
    const full = this._buildBucketData();
    if (!this._zoomRange) return full;
    const [start, end] = this._zoomRange;
    const s = Math.max(0, start);
    const e = Math.min(full.labels.length - 1, end);
    if (s >= e) return full;
    return {
      labels: full.labels.slice(s, e + 1),
      series: full.series.map((sr) => sr.slice(s, e + 1)),
      colors: full.colors,
      maxVal: 0, // recalculated dynamically by range()
    };
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
    const gridOpacity = config.grid_opacity ?? 1;
    const gridStroke = isDark
      ? `rgba(255,255,255,${(0.08 * gridOpacity).toFixed(3)})`
      : `rgba(0,0,0,${(0.08 * gridOpacity).toFixed(3)})`;

    const series: uPlot.Series[] = [{}];
    this._data.forEach((dataset, i) => {
      series.push({
        label: this.entityConfigs[i]?.name ?? dataset.friendlyName ?? `Entity ${i + 1}`,
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
        x: { time: false, range: () => [-0.5, n - 0.5] as [number, number] },
        y: {
          range: (_u: uPlot, _min: number, _max: number) => {
            const bd = this._activeBucketData;
            const cfg = this._config as InsightBarConfig | undefined;
            if (!bd) return [0, 1] as [number, number];

            // Compute max from visible series
            let computedMax = 0;
            if (cfg?.layout === "stacked") {
              for (let bi = 0; bi < bd.labels.length; bi++) {
                const sum = bd.series.reduce((acc, s, si) =>
                  this._hiddenSeries.has(si) ? acc : acc + (s[bi] ?? 0), 0);
                if (sum > computedMax) computedMax = sum;
              }
            } else {
              for (let si = 0; si < bd.series.length; si++) {
                if (this._hiddenSeries.has(si)) continue;
                for (const v of bd.series[si]) { if (v > computedMax) computedMax = v; }
              }
            }

            // Also account for threshold line values so they're always visible
            const thresholdMax = cfg?.thresholds?.length
              ? Math.max(...cfg.thresholds.map((t) => t.value))
              : 0;

            // Soft y_min: axis goes below y_min only if data requires it
            const yMin = cfg?.y_min != null ? Math.min(0, cfg.y_min) : 0;
            // Soft y_max: keep at y_max (or threshold max) even if data is lower
            const dataMax = Math.max(computedMax, thresholdMax);
            const yMax = cfg?.y_max != null
              ? Math.max(dataMax * 1.05, cfg.y_max)
              : dataMax > 0 ? dataMax * 1.05 : 1;

            return [yMin, yMax > yMin ? yMax : yMin + 1] as [number, number];
          },
        },
      },
      axes: [
        {
          // x axis — categorical bucket labels
          show: config.show_x_axis !== false,
          stroke: axisStroke,
          grid: { show: false },
          ticks: { show: false },
          splits: (_u: uPlot) => Array.from({ length: n }, (_, i) => i),
          values: (u: uPlot, vals: number[]) => {
            // Estimate how many labels fit without overlapping.
            // Use the longest label to compute a safe character width.
            const maxLen = labels.reduce((m, l) => Math.max(m, l.length), 0);
            const labelPx = maxLen * 7 + 12; // ~7px per char + padding
            const plotW = u.bbox.width / uPlot.pxRatio;
            const step = Math.max(1, Math.ceil((n * labelPx) / plotW));
            return vals.map((v) => {
              const bi = Math.round(v);
              return bi % step === 0 ? (labels[bi] ?? "") : "";
            });
          },
          size: 36,
        },
        {
          // y axis
          show: config.show_y_axis !== false,
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
        ready: [
          (u: uPlot) => {
            this._tooltipEl = document.createElement("div");
            this._tooltipEl.className = "u-tooltip";
            u.root.appendChild(this._tooltipEl);
            this._overLeft = u.over.offsetLeft;
            this._overTop = u.over.offsetTop;
            u.over.addEventListener("mousemove", (e) => this._onChartMouseMove(u, e));
            u.over.addEventListener("mouseleave", () => this._hideTooltip());
            this._thresholdDefaultColor =
              getComputedStyle(this).getPropertyValue("--error-color").trim() || "#db4437";

            if (config.zoom) {
              this._zoomOverlay = document.createElement("div");
              this._zoomOverlay.className = "u-zoom-sel";
              u.root.appendChild(this._zoomOverlay);

              u.over.addEventListener("mousedown", (e: MouseEvent) => {
                this._isDragging = true;
                this._dragStartX = e.offsetX;
                const ov = this._zoomOverlay!;
                ov.style.top = `${this._overTop}px`;
                ov.style.height = `${u.over.offsetHeight}px`;
                ov.style.left = `${e.offsetX + this._overLeft}px`;
                ov.style.width = "0px";
                ov.style.display = "block";
              });

              u.over.addEventListener("mousemove", (e: MouseEvent) => {
                if (!this._isDragging || !this._zoomOverlay) return;
                const x0 = Math.min(this._dragStartX, e.offsetX) + this._overLeft;
                const x1 = Math.max(this._dragStartX, e.offsetX) + this._overLeft;
                this._zoomOverlay.style.left = `${x0}px`;
                this._zoomOverlay.style.width = `${x1 - x0}px`;
              });

              const endDrag = (e: MouseEvent) => {
                if (!this._isDragging) return;
                this._isDragging = false;
                if (this._zoomOverlay) this._zoomOverlay.style.display = "none";

                const bd = this._activeBucketData;
                if (!bd || bd.labels.length === 0) return;
                const n = bd.labels.length;
                const plotW = u.bbox.width / uPlot.pxRatio;
                const x0 = Math.min(this._dragStartX, e.offsetX);
                const x1 = Math.max(this._dragStartX, e.offsetX);
                if (x1 - x0 < 10) return; // too small — treat as click, not drag

                const dispStart = Math.max(0, Math.floor(x0 / (plotW / n)));
                const dispEnd = Math.min(n - 1, Math.floor(x1 / (plotW / n)));
                if (dispEnd <= dispStart) return;

                // Map displayed indices back to full bucket data indices
                const offset = this._zoomRange?.[0] ?? 0;
                this._wasZoomDrag = true;
                this._zoomRange = [offset + dispStart, offset + dispEnd];
              };

              u.over.addEventListener("mouseup", endDrag);

              this._attachTouchZoom(u);
            }
          },
        ],
        destroy: [() => {
          this._tooltipEl = undefined;
          this._zoomOverlay?.remove();
          this._zoomOverlay = undefined;
        }],
        draw: [
          (u: uPlot) => this._drawBarsHook(u),
          (u: uPlot) => {
            const cfg = this._config as InsightBarConfig | undefined;
            if (cfg?.thresholds?.length) this._drawThresholds(u, cfg.thresholds);
          },
        ],
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
    const bucketData = this._activeBucketData;
    if (!config || !bucketData) return;

    const { labels, series, colors } = bucketData;
    const n = labels.length;
    if (n === 0) return;

    const ctx = u.ctx;
    const { left, top: _top, width, height: _height } = u.bbox;
    const numSeries = series.length;
    const baseAlpha = Math.min(1, Math.max(0, config.fill_opacity ?? 1));
    const dpr = uPlot.pxRatio;
    const radiusPx = (config.bar_radius ?? 0) * dpr;
    const colorThresholds = config.color_thresholds ?? [];
    // Track which entity indices have an explicit color set in config
    const hasExplicitColor = this.entityConfigs.map((ec) => !!ec.color);

    const bucketW = width / n;
    const padFrac = 0.15;
    const barGroupW = bucketW * (1 - padFrac * 2);

    // y=0 in canvas pixel coordinates
    const yBase = u.valToPos(0, "y", true);

    ctx.save();

    for (let bi = 0; bi < n; bi++) {
      const groupX = left + bi * bucketW + bucketW * padFrac;

      if (config.layout === "stacked") {
        // Determine the last visible non-zero series index for this bucket
        // — only that topmost segment gets rounded corners.
        let topSi = -1;
        for (let si = numSeries - 1; si >= 0; si--) {
          if (!this._hiddenSeries.has(si) && (series[si][bi] ?? 0) > 0) { topSi = si; break; }
        }

        let cumulative = 0;
        for (let si = 0; si < numSeries; si++) {
          if (this._hiddenSeries.has(si)) continue;
          const val = series[si][bi] ?? 0;
          if (val <= 0) continue;
          ctx.globalAlpha = this._hoveredSeriesIdx !== null && this._hoveredSeriesIdx !== si
            ? baseAlpha * 0.15 : baseAlpha;
          const yTop = u.valToPos(cumulative + val, "y", true);
          const yBottom = u.valToPos(cumulative, "y", true);
          const thColor = colorThresholds.length && !hasExplicitColor[si]
            ? colorFromThresholds(val, colorThresholds) : null;
          ctx.fillStyle = thColor ?? colors[si];
          const r = si === topSi ? Math.min(radiusPx, barGroupW / 2, (yBottom - yTop) / 2) : 0;
          this._fillBar(ctx, groupX, yTop, barGroupW, yBottom - yTop, r);
          cumulative += val;
        }
      } else {
        // grouped
        const barW = barGroupW / numSeries;
        const singleW = barW * 0.85;
        for (let si = 0; si < numSeries; si++) {
          if (this._hiddenSeries.has(si)) continue;
          const val = series[si][bi] ?? 0;
          if (val <= 0) continue;
          ctx.globalAlpha = this._hoveredSeriesIdx !== null && this._hoveredSeriesIdx !== si
            ? baseAlpha * 0.15 : baseAlpha;
          const yTop = u.valToPos(val, "y", true);
          const x = groupX + si * barW;
          const h = yBase - yTop;
          const thColor = colorThresholds.length && !hasExplicitColor[si]
            ? colorFromThresholds(val, colorThresholds) : null;
          ctx.fillStyle = thColor ?? colors[si];
          const r = Math.min(radiusPx, singleW / 2, h / 2);
          this._fillBar(ctx, x, yTop, singleW, h, r);
        }
      }
    }

    ctx.restore();
  }

  /** Fill a bar rect with optional top-corner radius. */
  private _fillBar(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    r: number,
  ): void {
    if (r <= 0) {
      ctx.fillRect(x, y, w, h);
      return;
    }
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, [r, r, 0, 0]);
    ctx.fill();
  }

  // -------------------------------------------------------------------------
  // Threshold lines
  // -------------------------------------------------------------------------

  private _drawThresholds(u: uPlot, thresholds: ThresholdConfig[]): void {
    const dpr = window.devicePixelRatio ?? 1;
    const ctx = u.ctx;
    ctx.save();
    for (const t of thresholds) {
      const y = Math.round(u.valToPos(t.value, "y", true));
      if (y < u.bbox.top || y > u.bbox.top + u.bbox.height) continue;
      ctx.beginPath();
      ctx.strokeStyle = t.color ?? this._thresholdDefaultColor;
      ctx.lineWidth = dpr;
      ctx.setLineDash((t.dash ?? [4, 3]).map((v) => v * dpr));
      ctx.moveTo(u.bbox.left, y);
      ctx.lineTo(u.bbox.left + u.bbox.width, y);
      ctx.stroke();
      if (t.label) {
        ctx.setLineDash([]);
        ctx.fillStyle = t.color ?? this._thresholdDefaultColor;
        ctx.font = `${11 * dpr}px sans-serif`;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.fillText(t.label, u.bbox.left + u.bbox.width - 4 * dpr, y - 2 * dpr);
      }
    }
    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // Touch zoom (single-finger drag + pinch)
  // -------------------------------------------------------------------------

  private _attachTouchZoom(u: uPlot): void {
    const over = u.over;

    /** Convert a Touch to an offsetX relative to u.over */
    const toOffsetX = (t: Touch) => t.clientX - over.getBoundingClientRect().left;

    /** Bucket index from an offsetX (clamped to display range) */
    const toBucket = (offsetX: number): number => {
      const bd = this._activeBucketData;
      if (!bd || bd.labels.length === 0) return 0;
      const n = bd.labels.length;
      const plotW = u.bbox.width / uPlot.pxRatio;
      return Math.max(0, Math.min(n - 1, Math.floor(offsetX / (plotW / n))));
    };

    // ── Single-finger drag → zoom selection ──────────────────────────────────
    over.addEventListener("touchstart", (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const ox = toOffsetX(e.touches[0]);
        this._isDragging = true;
        this._dragStartX = ox;
        const ov = this._zoomOverlay!;
        ov.style.top = `${this._overTop}px`;
        ov.style.height = `${over.offsetHeight}px`;
        ov.style.left = `${ox + this._overLeft}px`;
        ov.style.width = "0px";
        ov.style.display = "block";
      } else if (e.touches.length === 2) {
        // Cancel single-finger drag when second finger lands
        this._isDragging = false;
        if (this._zoomOverlay) this._zoomOverlay.style.display = "none";
        // Record initial pinch state
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        this._pinchInitDist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
        const ox0 = toOffsetX(t0);
        const ox1 = toOffsetX(t1);
        this._pinchInitRange = [
          toBucket(Math.min(ox0, ox1)),
          toBucket(Math.max(ox0, ox1)),
        ];
      }
    }, { passive: true });

    over.addEventListener("touchmove", (e: TouchEvent) => {
      if (e.touches.length === 1 && this._isDragging) {
        e.preventDefault();
        const ox = toOffsetX(e.touches[0]);
        const x0 = Math.min(this._dragStartX, ox) + this._overLeft;
        const x1 = Math.max(this._dragStartX, ox) + this._overLeft;
        if (this._zoomOverlay) {
          this._zoomOverlay.style.left = `${x0}px`;
          this._zoomOverlay.style.width = `${x1 - x0}px`;
        }
      }
    }, { passive: false });

    over.addEventListener("touchend", (e: TouchEvent) => {
      // ── Single-finger drag end → commit zoom ───────────────────────────────
      if (this._isDragging) {
        this._isDragging = false;
        if (this._zoomOverlay) this._zoomOverlay.style.display = "none";
        if (e.changedTouches.length > 0) {
          const endX = toOffsetX(e.changedTouches[0]);
          const bd = this._activeBucketData;
          if (bd && bd.labels.length > 0) {
            const x0 = Math.min(this._dragStartX, endX);
            const x1 = Math.max(this._dragStartX, endX);
            if (x1 - x0 >= 10) {
              const dispStart = toBucket(x0);
              const dispEnd = toBucket(x1);
              if (dispEnd > dispStart) {
                const offset = this._zoomRange?.[0] ?? 0;
                this._zoomRange = [offset + dispStart, offset + dispEnd];
              }
            }
          }
        }
        return;
      }

      // ── Pinch end → zoom to finger span (or zoom out if spread) ───────────
      if (e.touches.length === 0 && e.changedTouches.length === 2) {
        const t0 = e.changedTouches[0];
        const t1 = e.changedTouches[1];
        const finalDist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);

        if (finalDist < this._pinchInitDist * 0.85) {
          // Pinch in → zoom to range between fingers at touchend
          const ox0 = toOffsetX(t0);
          const ox1 = toOffsetX(t1);
          const dispStart = toBucket(Math.min(ox0, ox1));
          const dispEnd = toBucket(Math.max(ox0, ox1));
          if (dispEnd > dispStart) {
            const offset = this._zoomRange?.[0] ?? 0;
            this._zoomRange = [offset + dispStart, offset + dispEnd];
          }
        } else if (finalDist > this._pinchInitDist * 1.15) {
          // Spread out → zoom out one level (back to full if no parent range)
          this._zoomRange = null;
        }
      }
    }, { passive: true });
  }

  // -------------------------------------------------------------------------
  // Tooltip
  // -------------------------------------------------------------------------

  private _onChartMouseMove(u: uPlot, e: MouseEvent): void {
    if (this._isDragging) { this._hideTooltip(); return; }
    const bd = this._activeBucketData;
    if (!bd || bd.labels.length === 0 || !this._tooltipEl) return;

    const n = bd.labels.length;
    // e.offsetX is relative to u.over, which is already aligned with the plot
    // area (left edge = after Y-axis). So offsetX=0 is the leftmost plot pixel.
    const mouseX = e.offsetX;
    const plotWidth = u.bbox.width / uPlot.pxRatio;

    // Track for action handlers (click position in plot-area CSS px)
    this._lastMouseX = mouseX;
    this._lastMouseY = e.offsetY;

    if (mouseX < 0 || mouseX > plotWidth) {
      this._hideTooltip();
      return;
    }

    const bi = Math.max(0, Math.min(n - 1, Math.floor(mouseX / (plotWidth / n))));

    const rows = this._data
      .map((dataset, si) => {
        if (this._hiddenSeries.has(si)) return "";
        const val = bd.series[si]?.[bi] ?? 0;
        const color = bd.colors[si];
        const name = this.entityConfigs[si]?.name ?? dataset.friendlyName ?? this.entityConfigs[si]?.entity ?? `Entity ${si + 1}`;
        return `<div class="u-tooltip-row">
          <span class="u-tooltip-dot" style="background:${color}"></span>
          <span class="u-tooltip-name">${name}</span>
          <span class="u-tooltip-value">${formatValue(val)}</span>
        </div>`;
      })
      .filter(Boolean)
      .join("");

    this._tooltipEl.innerHTML = `<div class="u-tooltip-time">${bd.labels[bi]}</div>${rows}`;
    this._tooltipEl.style.display = "block";

    // Position relative to u.root — mouseX + overLeft converts from plot-area
    // coords back to u.root coords.
    const left = mouseX + this._overLeft;
    const top = e.offsetY + this._overTop;
    const flip = mouseX > plotWidth / 2;
    this._tooltipEl.style.left = `${left + (flip ? -12 : 12)}px`;
    this._tooltipEl.style.top = `${top}px`;
    this._tooltipEl.style.transform = flip ? "translate(-100%, -50%)" : "translateY(-50%)";
  }

  private _hideTooltip(): void {
    if (this._tooltipEl) this._tooltipEl.style.display = "none";
  }

  /**
   * Detect which series (entity) was under the cursor at the last known mouse
   * position. Uses the same bar geometry as the draw hook.
   * Returns a series index (0-based), or 0 as a safe fallback.
   */
  private _getSeriesAtPoint(mouseX: number, mouseY: number): number {
    const u = this._uplot;
    const bd = this._activeBucketData;
    const config = this._config as InsightBarConfig | undefined;
    if (!u || !bd || bd.labels.length === 0) return 0;

    const n = bd.labels.length;
    const plotW = u.bbox.width / uPlot.pxRatio;
    const padFrac = 0.15;
    const bucketW = plotW / n;
    const barGroupW = bucketW * (1 - padFrac * 2);
    const bi = Math.max(0, Math.min(n - 1, Math.floor(mouseX / bucketW)));
    const groupX = bi * bucketW + bucketW * padFrac;
    const numSeries = bd.series.length;

    if (config?.layout === "stacked") {
      // Walk stacked segments bottom-to-top, find the one at mouseY
      let cumulative = 0;
      for (let si = 0; si < numSeries; si++) {
        if (this._hiddenSeries.has(si)) continue;
        const val = bd.series[si][bi] ?? 0;
        if (val <= 0) continue;
        const yTop = u.valToPos(cumulative + val, "y");   // CSS px, top of segment
        const yBottom = u.valToPos(cumulative, "y");       // CSS px, bottom of segment
        if (mouseY >= yTop && mouseY <= yBottom) return si;
        cumulative += val;
      }
      return 0;
    }

    // grouped — find which bar column the click falls in
    const barW = barGroupW / numSeries;
    for (let si = 0; si < numSeries; si++) {
      if (this._hiddenSeries.has(si)) continue;
      const barX = groupX + si * barW;
      if (mouseX >= barX && mouseX < barX + barW) return si;
    }
    return 0;
  }

  // -------------------------------------------------------------------------
  // uPlot sync
  // -------------------------------------------------------------------------

  private _syncUplot(): void {
    const config = this._config as InsightBarConfig | undefined;
    if (!config || !this.wrapper) return;
    if (this._data.length === 0) return;

    // Recompute height after every update — the legend may have just appeared
    // (data arriving after first paint) and DOM is settled after double-rAF.
    this._refreshChartHeight();

    // _activeBucketData must be set BEFORE _buildOptions / new uPlot so that
    // all closures (range, draw, tooltip) read consistent data.
    const bucketData = this._getDisplayBucketData();
    this._activeBucketData = bucketData;

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

      /* Tooltip */
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
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
        border-radius: 2px;
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

      /* Zoom */
      .u-zoom-sel {
        position: absolute;
        background: var(--primary-color, #3b82f6);
        opacity: 0.15;
        pointer-events: none;
        display: none;
        z-index: 10;
      }
      .bar-zoom-reset {
        position: absolute;
        top: 6px;
        right: 20px;
        font-size: 11px;
        color: var(--primary-color);
        background: var(--card-background-color);
        border: 1px solid var(--primary-color);
        border-radius: 4px;
        padding: 1px 6px;
        cursor: pointer;
        z-index: 100;
        opacity: 0.85;
      }
      .bar-zoom-reset:hover { opacity: 1; }

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
