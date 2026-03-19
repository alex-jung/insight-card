/**
 * custom:insight-line-card
 *
 * Interactive time-series chart powered by uPlot. Supports line, area, and
 * step rendering modes with drag-to-zoom.
 */

import { html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import uPlot from "uplot";

import {
  InsightBaseCard,
  type InsightLineConfig,
  type InsightEntityConfig,
  hexToRgba,
  generateColors,
  getChartHeight,
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
      documentationURL?: string;
    }>;
  }
}

// ---------------------------------------------------------------------------
// Card implementation
// ---------------------------------------------------------------------------

@customElement("insight-line-card")
export class InsightLineCard extends InsightBaseCard {
  static readonly cardType = "custom:insight-line-card";
  static readonly cardName = "InsightChart Line";
  static readonly cardDescription =
    "Interactive time-series line & area chart with zoom";

  /** uPlot instance — created lazily in renderChart() */
  private _uplot?: uPlot;
  /** Reference to the container element uPlot renders into */
  private _chartContainer?: HTMLDivElement;

  // -------------------------------------------------------------------------
  // HA editor integration
  // -------------------------------------------------------------------------

  static getConfigElement(): HTMLElement {
    return document.createElement("insight-line-card-editor");
  }

  static getStubConfig(): Partial<InsightLineConfig> {
    return {
      type: InsightLineCard.cardType,
      entities: [{ entity: "sensor.example_temperature", name: "Temperature" }],
      hours: 24,
      style: "area",
      zoom: true,
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

    this.entityConfigs.forEach((ec: InsightEntityConfig, i: number) => {
      const color = ec.color ?? colors[i];
      const isArea = config.style === "area";
      const isStep = config.style === "step" || config.curve === "step";

      const drawStyle: number = isStep ? 1 : 0; // 0 = line, 1 = bars/step
      const lineInterpolation: number = isStep ? 2 : config.curve === "smooth" ? 0 : 0;

      series.push({
        label: ec.name ?? this._data[i]?.friendlyName ?? ec.entity,
        stroke: color,
        fill: isArea ? hexToRgba(color, config.fill_opacity ?? 0.15) : undefined,
        width: config.line_width ?? 2,
        // step drawing
        drawStyle: isStep ? (1 as uPlot.Series.DrawStyle) : (0 as uPlot.Series.DrawStyle),
        lineInterpolation: lineInterpolation as uPlot.Series.LineInterpolation,
        spanGaps: false,
      });
    });

    return series;
  }

  /** Build aligned uPlot data from EntityDataSet array */
  private _buildUplotData(): uPlot.AlignedData {
    if (this._data.length === 0) return [[], []];

    // Merge all timestamps across all entities and sort
    const allTimestamps = new Set<number>();
    for (const dataset of this._data) {
      for (const point of dataset.data) {
        // uPlot expects seconds, not milliseconds
        allTimestamps.add(Math.floor(point.t / 1000));
      }
    }
    const timestamps = Array.from(allTimestamps).sort((a, b) => a - b);

    // Build a lookup for each entity
    const valueSeries: (number | null | undefined)[][] = this._data.map(
      (dataset) => {
        const map = new Map<number, number>();
        for (const point of dataset.data) {
          map.set(Math.floor(point.t / 1000), point.v);
        }
        return timestamps.map((ts) => map.get(ts) ?? null);
      },
    );

    return [timestamps, ...valueSeries] as uPlot.AlignedData;
  }

  /** Build uPlot options object */
  private _buildOptions(config: InsightLineConfig): uPlot.Options {
    const chartWidth = Math.max(100, this._cardWidth - 32);
    const chartHeight = getChartHeight(this._cardWidth);
    const isDark = this.isDarkTheme;

    const axisStroke = isDark
      ? "rgba(255,255,255,0.55)"
      : "var(--secondary-text-color, rgba(0,0,0,0.55))";
    const gridStroke = isDark
      ? "rgba(255,255,255,0.08)"
      : "var(--divider-color, rgba(0,0,0,0.08))";

    // y-axis scale
    const yScaleOpts: uPlot.Scale =
      Array.isArray(config.y_range)
        ? { range: config.y_range as [number, number] }
        : { auto: true };

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
      },
      series: this._buildSeries(config),
      axes: [
        {
          stroke: axisStroke,
          grid: { stroke: gridStroke, width: 1 },
          ticks: { stroke: gridStroke, width: 1 },
          font: "12px sans-serif",
        },
        {
          stroke: axisStroke,
          grid: { stroke: gridStroke, width: 1 },
          ticks: { stroke: gridStroke, width: 1 },
          font: "12px sans-serif",
          size: 60,
        },
      ],
      legend: {
        show: !this.isMobile,
        live: true,
      },
      padding: [8, 8, 0, 0],
    };
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
  protected override updated(changedProps: Map<string, unknown>): void {
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
window.customCards.push({
  type: InsightLineCard.cardType,
  name: InsightLineCard.cardName,
  description: InsightLineCard.cardDescription,
  preview: true,
  documentationURL: "https://github.com/your-org/insight-chart",
});
