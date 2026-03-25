/**
 * Tests for InsightLineCard.
 * Runs in happy-dom (*.dom.test.ts).
 *
 * uPlot is mocked to avoid canvas/WebGL requirements.
 * ResizeObserver is mocked — happy-dom does not implement it.
 */
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from "vitest";

// ---------------------------------------------------------------------------
// vi.mock calls are hoisted before imports by Vitest — must declare here.
// ---------------------------------------------------------------------------

vi.mock("uplot", () => {
    const MockUPlot = vi.fn().mockImplementation(() => ({
        destroy: vi.fn(),
        setData: vi.fn(),
        setScale: vi.fn(),
        setSize: vi.fn(),
        redraw: vi.fn(),
        // data[0] = timestamps — used by _resetZoom to read xs
        data: [[1000, 2000], [22, 23]],
        ctx: {
            save: vi.fn(),
            restore: vi.fn(),
            font: "",
            measureText: vi.fn(() => ({ width: 20 })),
        },
        over: {
            getBoundingClientRect: vi.fn(() => ({ left: 0, top: 0 })),
        },
    }));
    (MockUPlot as unknown as Record<string, unknown>).paths = {
        stepped: vi.fn(() => () => null),
        spline: vi.fn(() => () => null),
    };
    return { default: MockUPlot };
});

import "./insight-line-card.js";
import type { InsightLineCard } from "./insight-line-card.js";
import { invalidateCache } from "@insight-chart/core";
import type { EntityDataSet } from "@insight-chart/core";

// ---------------------------------------------------------------------------
// Timer + ResizeObserver globals
// ---------------------------------------------------------------------------

beforeAll(() => {
    if (typeof clearInterval === "undefined") {
        (globalThis as Record<string, unknown>).clearInterval  = window.clearInterval.bind(window);
        (globalThis as Record<string, unknown>).setInterval    = window.setInterval.bind(window);
        (globalThis as Record<string, unknown>).clearTimeout   = window.clearTimeout.bind(window);
        (globalThis as Record<string, unknown>).setTimeout     = window.setTimeout.bind(window);
    }
    // happy-dom does not implement ResizeObserver
    (globalThis as Record<string, unknown>).ResizeObserver = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));
});

afterAll(() => {});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type LC = InsightLineCard;

function makeConfig(overrides: Record<string, unknown> = {}) {
    return {
        type: "custom:insight-line-card",
        entities: ["sensor.temp"],
        ...overrides,
    };
}

function makeHass() {
    return {
        states: {
            "sensor.temp": {
                state: "22",
                attributes: { friendly_name: "Temperature", unit_of_measurement: "°C" },
            },
            "sensor.hum": {
                state: "55",
                attributes: { friendly_name: "Humidity", unit_of_measurement: "%" },
            },
        },
        themes: { darkMode: false, default_theme: "", default_dark_theme: null, themes: {} },
        callWS: vi.fn().mockResolvedValue({}),
        callService: vi.fn().mockResolvedValue({}),
    } as unknown as LC["hass"];
}

function makeDataset(
    entityId: string,
    points: Array<[number, number]> = [],
    unit = "°C",
): EntityDataSet {
    return {
        entityId,
        friendlyName: entityId.split(".")[1] ?? entityId,
        unit,
        data: points.map(([t, v]) => ({ t, v })),
    };
}

async function mountCard(): Promise<LC> {
    const el = document.createElement("insight-line-card") as LC;
    document.body.appendChild(el);
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
    return el;
}

async function uc(el: LC) {
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
}

// ---------------------------------------------------------------------------
// setConfig — line-card defaults
// ---------------------------------------------------------------------------

describe("setConfig — line-card defaults", () => {
    let card: LC;

    beforeEach(async () => { invalidateCache(); card = await mountCard(); });
    afterEach(() => card.remove());

    it("applies style=area by default", () => {
        card.setConfig(makeConfig() as never);
        expect((card["_config"] as unknown as Record<string, unknown>).style).toBe("area");
    });

    it("applies curve=smooth by default", () => {
        card.setConfig(makeConfig() as never);
        expect((card["_config"] as unknown as Record<string, unknown>).curve).toBe("smooth");
    });

    it("applies zoom=true by default", () => {
        card.setConfig(makeConfig() as never);
        expect((card["_config"] as unknown as Record<string, unknown>).zoom).toBe(true);
    });

    it("applies line_width=2 by default", () => {
        card.setConfig(makeConfig() as never);
        expect((card["_config"] as unknown as Record<string, unknown>).line_width).toBe(2);
    });

    it("applies fill_opacity=0.15 by default", () => {
        card.setConfig(makeConfig() as never);
        expect((card["_config"] as unknown as Record<string, unknown>).fill_opacity).toBe(0.15);
    });

    it("applies show_legend=true by default", () => {
        card.setConfig(makeConfig() as never);
        expect((card["_config"] as unknown as Record<string, unknown>).show_legend).toBe(true);
    });

    it("applies hours=24 by default", () => {
        card.setConfig(makeConfig() as never);
        expect(card["_config"]!.hours).toBe(24);
    });

    it("applies update_interval=60 by default", () => {
        card.setConfig(makeConfig() as never);
        expect(card["_config"]!.update_interval).toBe(60);
    });

    it("explicit style overrides default", () => {
        card.setConfig(makeConfig({ style: "line" }) as never);
        expect((card["_config"] as unknown as Record<string, unknown>).style).toBe("line");
    });

    it("explicit curve overrides default", () => {
        card.setConfig(makeConfig({ curve: "linear" }) as never);
        expect((card["_config"] as unknown as Record<string, unknown>).curve).toBe("linear");
    });

    it("zoom=false overrides default", () => {
        card.setConfig(makeConfig({ zoom: false }) as never);
        expect((card["_config"] as unknown as Record<string, unknown>).zoom).toBe(false);
    });

    it("explicit line_width overrides default", () => {
        card.setConfig(makeConfig({ line_width: 4 }) as never);
        expect((card["_config"] as unknown as Record<string, unknown>).line_width).toBe(4);
    });
});

// ---------------------------------------------------------------------------
// renderChart — DOM structure
// ---------------------------------------------------------------------------

describe("renderChart — DOM structure", () => {
    let card: LC;

    beforeEach(async () => {
        invalidateCache();
        card = await mountCard();
        card.setConfig(makeConfig() as never);
        await uc(card);
    });
    afterEach(() => card.remove());

    it("renders .chart-wrapper element", () => {
        expect(card.shadowRoot!.querySelector(".chart-wrapper")).toBeTruthy();
    });

    it("renders #chart div inside .chart-wrapper", () => {
        expect(card.shadowRoot!.querySelector("#chart")).toBeTruthy();
    });

    it("does NOT render zoom-reset button when not zoomed", () => {
        expect(card.shadowRoot!.querySelector(".zoom-reset-btn")).toBeFalsy();
    });

    it("renders zoom-reset button when _isZoomed=true", async () => {
        card["_isZoomed"] = true;
        await uc(card);
        expect(card.shadowRoot!.querySelector(".zoom-reset-btn")).toBeTruthy();
    });

    it("hides zoom-reset button again when _isZoomed=false", async () => {
        card["_isZoomed"] = true;
        await uc(card);
        card["_isZoomed"] = false;
        await uc(card);
        expect(card.shadowRoot!.querySelector(".zoom-reset-btn")).toBeFalsy();
    });

    it("renders ha-card element", () => {
        expect(card.shadowRoot!.querySelector("ha-card")).toBeTruthy();
    });

    it("renders card title when set", async () => {
        card.setConfig(makeConfig({ title: "Mein Chart" }) as never);
        await uc(card);
        expect(card.shadowRoot!.querySelector(".card-header")?.textContent?.trim()).toBe("Mein Chart");
    });

    it("does not render card-header without title", () => {
        expect(card.shadowRoot!.querySelector(".card-header")).toBeFalsy();
    });
});

// ---------------------------------------------------------------------------
// _buildUplotData
// ---------------------------------------------------------------------------

describe("_buildUplotData", () => {
    let card: LC;

    beforeEach(async () => {
        invalidateCache();
        card = await mountCard();
        card.setConfig(makeConfig() as never);
        await uc(card);
    });
    afterEach(() => card.remove());

    it("returns [[], []] when _data is empty", () => {
        card["_data"] = [];
        expect(card["_buildUplotData"]()).toEqual([[], []]);
    });

    it("converts millisecond timestamps to seconds", () => {
        card["_data"] = [makeDataset("sensor.temp", [[1_000_000, 22], [2_000_000, 23]])];
        const [timestamps] = card["_buildUplotData"]();
        expect(timestamps).toEqual([1000, 2000]);
    });

    it("returns one value series per entity", () => {
        card["_data"] = [makeDataset("sensor.temp", [[1_000_000, 22]])];
        const result = card["_buildUplotData"]();
        expect(result).toHaveLength(2); // [timestamps, values]
    });

    it("values match provided data points", () => {
        card["_data"] = [makeDataset("sensor.temp", [[1_000_000, 22], [2_000_000, 25]])];
        const [, values] = card["_buildUplotData"]();
        expect(values).toEqual([22, 25]);
    });

    it("sorts timestamps in ascending order", () => {
        card["_data"] = [makeDataset("sensor.temp", [
            [3_000_000, 30], [1_000_000, 10], [2_000_000, 20],
        ])];
        const [timestamps] = card["_buildUplotData"]();
        expect(timestamps).toEqual([1000, 2000, 3000]);
    });

    it("merges timestamps from two entities", () => {
        card.setConfig(makeConfig({ entities: ["sensor.a", "sensor.b"] }) as never);
        card["_data"] = [
            makeDataset("sensor.a", [[1_000_000, 10], [3_000_000, 30]]),
            makeDataset("sensor.b", [[2_000_000, 20]]),
        ];
        const [ts] = card["_buildUplotData"]();
        expect(ts).toEqual([1000, 2000, 3000]);
    });

    it("fills missing cross-entity values with null", () => {
        card.setConfig(makeConfig({ entities: ["sensor.a", "sensor.b"] }) as never);
        card["_data"] = [
            makeDataset("sensor.a", [[1_000_000, 10], [3_000_000, 30]]),
            makeDataset("sensor.b", [[2_000_000, 20]]),
        ];
        const [, valA, valB] = card["_buildUplotData"]();
        // sensor.a has no data at t=2000
        expect(valA).toEqual([10, null, 30]);
        // sensor.b only has data at t=2000
        expect(valB).toEqual([null, 20, null]);
    });

    it("returns N+1 arrays for N entities (timestamps + N value series)", () => {
        card.setConfig(makeConfig({ entities: ["sensor.a", "sensor.b", "sensor.c"] }) as never);
        card["_data"] = [
            makeDataset("sensor.a", [[1_000_000, 1]]),
            makeDataset("sensor.b", [[1_000_000, 2]]),
            makeDataset("sensor.c", [[1_000_000, 3]]),
        ];
        expect(card["_buildUplotData"]()).toHaveLength(4);
    });

    it("deduplicates timestamps when entities share the same timestamp", () => {
        card.setConfig(makeConfig({ entities: ["sensor.a", "sensor.b"] }) as never);
        card["_data"] = [
            makeDataset("sensor.a", [[1_000_000, 10]]),
            makeDataset("sensor.b", [[1_000_000, 20]]),
        ];
        const [ts] = card["_buildUplotData"]();
        expect(ts).toHaveLength(1);
        expect(ts).toEqual([1000]);
    });
});

// ---------------------------------------------------------------------------
// _buildSeries
// ---------------------------------------------------------------------------

describe("_buildSeries", () => {
    let card: LC;

    beforeEach(async () => {
        invalidateCache();
        card = await mountCard();
        card["_data"] = [makeDataset("sensor.temp")];
    });
    afterEach(() => card.remove());

    it("returns 2 series for 1 entity (x placeholder + entity)", () => {
        card.setConfig(makeConfig() as never);
        const series = card["_buildSeries"](card["_config"] as never);
        expect(series).toHaveLength(2);
    });

    it("first series is x-axis placeholder (empty object, no label)", () => {
        card.setConfig(makeConfig() as never);
        const series = card["_buildSeries"](card["_config"] as never);
        expect(series[0].label).toBeUndefined();
        expect(Object.keys(series[0])).toHaveLength(0);
    });

    it("entity series uses friendlyName as label when available", () => {
        card["_data"] = [{ ...makeDataset("sensor.temp"), friendlyName: "Wohnzimmer" }];
        card.setConfig(makeConfig() as never);
        const series = card["_buildSeries"](card["_config"] as never);
        expect(series[1].label).toBe("Wohnzimmer");
    });

    it("entity series uses ec.name when explicitly configured", () => {
        card.setConfig(makeConfig({ entities: [{ entity: "sensor.temp", name: "Mein Sensor" }] }) as never);
        const series = card["_buildSeries"](card["_config"] as never);
        expect(series[1].label).toBe("Mein Sensor");
    });

    it("style=area: fill property is defined", () => {
        card.setConfig(makeConfig({ style: "area" }) as never);
        const series = card["_buildSeries"](card["_config"] as never);
        expect(series[1].fill).toBeDefined();
    });

    it("style=line: fill property is undefined", () => {
        card.setConfig(makeConfig({ style: "line" }) as never);
        const series = card["_buildSeries"](card["_config"] as never);
        expect(series[1].fill).toBeUndefined();
    });

    it("style=step: fill property is undefined", () => {
        card.setConfig(makeConfig({ style: "step" }) as never);
        const series = card["_buildSeries"](card["_config"] as never);
        expect(series[1].fill).toBeUndefined();
    });

    it("hidden entity has show=false", () => {
        card.setConfig(makeConfig({
            entities: [{ entity: "sensor.temp", hidden: true }],
        }) as never);
        const series = card["_buildSeries"](card["_config"] as never);
        expect(series[1].show).toBe(false);
    });

    it("non-hidden entity has show=true", () => {
        card.setConfig(makeConfig() as never);
        const series = card["_buildSeries"](card["_config"] as never);
        expect(series[1].show).toBe(true);
    });

    it("explicit entity color is used as stroke", () => {
        card.setConfig(makeConfig({
            entities: [{ entity: "sensor.temp", color: "#ff0000" }],
        }) as never);
        const series = card["_buildSeries"](card["_config"] as never);
        expect(series[1].stroke).toBe("#ff0000");
    });

    it("card-level line_width is applied to entity series", () => {
        card.setConfig(makeConfig({ line_width: 4 }) as never);
        const series = card["_buildSeries"](card["_config"] as never);
        expect(series[1].width).toBe(4);
    });

    it("entity-level line_width overrides card-level", () => {
        card.setConfig(makeConfig({
            line_width: 2,
            entities: [{ entity: "sensor.temp", line_width: 5 }],
        }) as never);
        const series = card["_buildSeries"](card["_config"] as never);
        expect(series[1].width).toBe(5);
    });

    it("returns N+1 series for N entities", () => {
        card.setConfig(makeConfig({ entities: ["sensor.a", "sensor.b", "sensor.c"] }) as never);
        card["_data"] = [
            makeDataset("sensor.a"),
            makeDataset("sensor.b"),
            makeDataset("sensor.c"),
        ];
        const series = card["_buildSeries"](card["_config"] as never);
        expect(series).toHaveLength(4);
    });

    it("entity on right y-axis has scale=y2", () => {
        card.setConfig(makeConfig({
            entities: [{ entity: "sensor.temp", y_axis: "right" }],
        }) as never);
        const series = card["_buildSeries"](card["_config"] as never);
        expect(series[1].scale).toBe("y2");
    });

    it("entity on left y-axis has scale=y", () => {
        card.setConfig(makeConfig() as never);
        const series = card["_buildSeries"](card["_config"] as never);
        expect(series[1].scale).toBe("y");
    });

    it("show_points=true sets points.show=true", () => {
        card.setConfig(makeConfig({ show_points: true }) as never);
        const series = card["_buildSeries"](card["_config"] as never);
        expect((series[1] as Record<string, unknown>).points).toMatchObject({ show: true });
    });
});

// ---------------------------------------------------------------------------
// _syncUplot — chart instance lifecycle
// ---------------------------------------------------------------------------

describe("_syncUplot", () => {
    let card: LC;

    beforeEach(async () => {
        invalidateCache();
        card = await mountCard();
        card.setConfig(makeConfig() as never);
        card["_data"] = [makeDataset("sensor.temp", [[1_000_000, 22], [2_000_000, 23]])];
        await uc(card);
    });
    afterEach(() => card.remove());

    it("creates _uplot instance when config and wrapper are available", () => {
        card["_syncUplot"]();
        expect(card["_uplot"]).toBeDefined();
    });

    it("sets _needsRebuild=false after successful build", () => {
        card["_needsRebuild"] = true;
        card["_syncUplot"]();
        expect(card["_needsRebuild"]).toBe(false);
    });

    it("updates _lastDataRef to current _data after build", () => {
        card["_syncUplot"]();
        expect(card["_lastDataRef"]).toBe(card["_data"]);
    });

    it("does not create _uplot when config is missing", async () => {
        const el = await mountCard(); // no setConfig
        el["_data"] = [makeDataset("sensor.temp", [[1_000_000, 22]])];
        el["_syncUplot"]();
        expect(el["_uplot"]).toBeUndefined();
        el.remove();
    });

    it("does not create _uplot when wrapper (#chart) is absent", () => {
        card.shadowRoot!.querySelector("#chart")?.remove();
        card["_syncUplot"]();
        // _uplot remains undefined (previous instance was never created in this path)
        const uplotBefore = card["_uplot"];
        card["_syncUplot"]();
        expect(card["_uplot"]).toBe(uplotBefore);
    });

    it("destroys previous _uplot instance on rebuild", () => {
        card["_syncUplot"]();
        const firstInstance = card["_uplot"]!;
        const destroySpy = vi.spyOn(firstInstance, "destroy");
        card["_needsRebuild"] = true;
        card["_syncUplot"]();
        expect(destroySpy).toHaveBeenCalled();
    });

    it("creates a new _uplot instance on rebuild", () => {
        card["_syncUplot"]();
        const firstInstance = card["_uplot"];
        card["_needsRebuild"] = true;
        card["_syncUplot"]();
        expect(card["_uplot"]).not.toBe(firstInstance);
    });
});

// ---------------------------------------------------------------------------
// disconnectedCallback — cleanup
// ---------------------------------------------------------------------------

describe("disconnectedCallback", () => {
    it("destroys uPlot on disconnect", async () => {
        invalidateCache();
        const card = await mountCard();
        card.setConfig(makeConfig() as never);
        card["_data"] = [makeDataset("sensor.temp", [[1_000_000, 22]])];
        await uc(card);
        card["_syncUplot"]();
        const destroySpy = vi.spyOn(card["_uplot"]!, "destroy");
        card.remove();
        expect(destroySpy).toHaveBeenCalled();
    });

    it("sets _uplot to undefined on disconnect", async () => {
        invalidateCache();
        const card = await mountCard();
        card.setConfig(makeConfig() as never);
        card["_data"] = [makeDataset("sensor.temp", [[1_000_000, 22]])];
        await uc(card);
        card["_syncUplot"]();
        card.remove();
        expect(card["_uplot"]).toBeUndefined();
    });

    it("resets _lastDataRef on disconnect", async () => {
        invalidateCache();
        const card = await mountCard();
        card.setConfig(makeConfig() as never);
        card["_data"] = [makeDataset("sensor.temp", [[1_000_000, 22]])];
        await uc(card);
        card["_syncUplot"]();
        card.remove();
        expect(card["_lastDataRef"]).toBeUndefined();
    });
});

// ---------------------------------------------------------------------------
// Zoom state
// ---------------------------------------------------------------------------

describe("zoom state", () => {
    let card: LC;

    beforeEach(async () => {
        invalidateCache();
        card = await mountCard();
        card.setConfig(makeConfig() as never);
        card["_data"] = [makeDataset("sensor.temp", [[1_000_000, 22], [2_000_000, 23]])];
        await uc(card);
        card["_syncUplot"]();
    });
    afterEach(() => card.remove());

    it("_isZoomed defaults to false", () => {
        expect(card["_isZoomed"]).toBe(false);
    });

    it("_zoomedRange defaults to undefined", () => {
        expect(card["_zoomedRange"]).toBeUndefined();
    });

    it("_resetZoom clears _zoomedRange", () => {
        card["_zoomedRange"] = [1000, 2000];
        card["_isZoomed"] = true;
        card["_resetZoom"](new MouseEvent("click"));
        expect(card["_zoomedRange"]).toBeUndefined();
    });

    it("_resetZoom sets _isZoomed=false", () => {
        card["_zoomedRange"] = [1000, 2000];
        card["_isZoomed"] = true;
        card["_resetZoom"](new MouseEvent("click"));
        expect(card["_isZoomed"]).toBe(false);
    });

    it("_resetZoom calls uPlot.setScale to restore full range", () => {
        card["_zoomedRange"] = [1000, 2000];
        card["_isZoomed"] = true;
        const setScaleSpy = vi.spyOn(card["_uplot"]!, "setScale");
        card["_resetZoom"](new MouseEvent("click"));
        expect(setScaleSpy).toHaveBeenCalledWith("x", expect.objectContaining({ min: expect.any(Number), max: expect.any(Number) }));
    });

    it("_resetZoom does nothing when _uplot is null", () => {
        card["_uplot"] = undefined;
        // should not throw
        expect(() => card["_resetZoom"](new MouseEvent("click"))).not.toThrow();
    });
});

// ---------------------------------------------------------------------------
// _handleAction — events
// ---------------------------------------------------------------------------

describe("_handleAction — events", () => {
    let card: LC;

    beforeEach(async () => {
        invalidateCache();
        card = await mountCard();
    });
    afterEach(() => card.remove());

    it("tap_action: more-info dispatches hass-more-info event", () => {
        card.setConfig(makeConfig({
            tap_action: { action: "more-info" },
        }) as never);
        card.hass = makeHass();

        const received: CustomEvent[] = [];
        document.body.addEventListener("hass-more-info",
            (e) => received.push(e as unknown as CustomEvent),
            { once: true },
        );
        card["_handleAction"]("tap_action");

        expect(received).toHaveLength(1);
        expect(received[0].detail.entityId).toBe("sensor.temp");
    });

    it("default tap_action (no action configured) fires hass-more-info", () => {
        card.setConfig(makeConfig() as never); // no tap_action
        card.hass = makeHass();

        const received: CustomEvent[] = [];
        document.body.addEventListener("hass-more-info",
            (e) => received.push(e as unknown as CustomEvent),
            { once: true },
        );
        card["_handleAction"]("tap_action");

        expect(received).toHaveLength(1);
        expect(received[0].detail.entityId).toBe("sensor.temp");
    });

    it("tap_action: none dispatches no event", () => {
        card.setConfig(makeConfig({ tap_action: { action: "none" } }) as never);
        card.hass = makeHass();

        let fired = false;
        document.body.addEventListener("hass-more-info", () => { fired = true; }, { once: true });
        card["_handleAction"]("tap_action");

        expect(fired).toBe(false);
    });

    it("tap_action: navigate dispatches location-changed (bubbles, composed)", () => {
        card.setConfig(makeConfig({
            tap_action: { action: "navigate", navigation_path: "/lovelace/1" },
        }) as never);

        const received: Event[] = [];
        document.body.addEventListener("location-changed",
            (e) => received.push(e),
            { once: true },
        );
        card["_handleAction"]("tap_action");

        expect(received).toHaveLength(1);
    });

    it("hass-more-info event bubbles and is composed", () => {
        card.setConfig(makeConfig({ tap_action: { action: "more-info" } }) as never);
        card.hass = makeHass();

        let bubbled = false;
        document.body.addEventListener("hass-more-info", () => { bubbled = true; }, { once: true });
        card["_handleAction"]("tap_action");

        expect(bubbled).toBe(true);
    });

    it("hass-more-info detail contains entity id of first entity", () => {
        card.setConfig(makeConfig({
            entities: ["sensor.hum"],
            tap_action: { action: "more-info" },
        }) as never);
        card.hass = makeHass();

        const received: CustomEvent[] = [];
        document.body.addEventListener("hass-more-info",
            (e) => received.push(e as unknown as CustomEvent),
            { once: true },
        );
        card["_handleAction"]("tap_action");

        expect(received[0].detail.entityId).toBe("sensor.hum");
    });
});
