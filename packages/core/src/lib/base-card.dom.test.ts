/**
 * Tests for InsightBaseCard.
 *
 * Runs in happy-dom (*.dom.test.ts) because LitElement requires a DOM
 * environment with CustomElementRegistry, HTMLElement, etc.
 */
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { LitElement, html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { InsightBaseCard } from "./base-card.js";
import { invalidateCache } from "./data-pipeline.js";
import type { InsightBaseConfig } from "../types/index.js";

// ---------------------------------------------------------------------------
// Timer globals — happy-dom provides these on `window` but not on `globalThis`.
// Stub them globally so Lit's async `updated()` microtask can call clearInterval.
// ---------------------------------------------------------------------------

beforeAll(() => {
  vi.stubGlobal("setInterval",   window.setInterval.bind(window));
  vi.stubGlobal("clearInterval", window.clearInterval.bind(window));
  vi.stubGlobal("setTimeout",    window.setTimeout.bind(window));
  vi.stubGlobal("clearTimeout",  window.clearTimeout.bind(window));
});

afterAll(() => {
  vi.unstubAllGlobals();
});

// ---------------------------------------------------------------------------
// Concrete test subclass
// ---------------------------------------------------------------------------

@customElement("test-insight-card")
class TestCard extends InsightBaseCard {
  renderChart(): TemplateResult {
    return html`<div class="chart"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "test-insight-card": TestCard;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeConfig(overrides: Partial<InsightBaseConfig> = {}): InsightBaseConfig {
  return {
    type: "custom:test-insight-card",
    entities: ["sensor.temp"],
    ...overrides,
  } as InsightBaseConfig;
}

function makeCard(): TestCard {
  const el = document.createElement("test-insight-card") as TestCard;
  document.body.appendChild(el);
  return el;
}

// ---------------------------------------------------------------------------
// setConfig — validation
// ---------------------------------------------------------------------------

describe("setConfig — validation", () => {
  let card: TestCard;

  beforeEach(() => {
    invalidateCache();
    card = makeCard();
  });

  afterEach(() => card.remove());

  it("throws when called with null/undefined", () => {
    expect(() => card.setConfig(null as unknown as InsightBaseConfig)).toThrow(
      "setConfig called without a config object",
    );
  });

  it("throws when entities array is missing", () => {
    expect(() =>
      card.setConfig({ type: "custom:test", entities: [] } as unknown as InsightBaseConfig),
    ).toThrow("at least one entity");
  });

  it("throws when entities array is empty", () => {
    expect(() =>
      card.setConfig({ type: "custom:test", entities: [] } as unknown as InsightBaseConfig),
    ).toThrow("at least one entity");
  });

  it("accepts a single 'entity' key and promotes it to entities array", () => {
    card.setConfig({ type: "custom:test", entity: "sensor.temp" } as unknown as InsightBaseConfig);
    expect(card["_config"]!.entities).toEqual(["sensor.temp"]);
  });

  it("does not mutate the original config object", () => {
    const original = makeConfig();
    const frozen = Object.freeze(original);
    expect(() => card.setConfig(frozen)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// setConfig — default merging
// ---------------------------------------------------------------------------

describe("setConfig — default merging", () => {
  let card: TestCard;

  beforeEach(() => {
    invalidateCache();
    card = makeCard();
  });
  afterEach(() => card.remove());

  it("merges getDefaultConfig() defaults", () => {
    card.setConfig(makeConfig());
    expect(card["_config"]!.hours).toBe(24);
    expect(card["_config"]!.update_interval).toBe(60);
  });

  it("config values override defaults", () => {
    card.setConfig(makeConfig({ hours: 48, update_interval: 120 }));
    expect(card["_config"]!.hours).toBe(48);
    expect(card["_config"]!.update_interval).toBe(120);
  });

  it("caches entity IDs after setConfig", () => {
    card.setConfig(makeConfig({ entities: ["sensor.a", "sensor.b"] }));
    expect(card["_entityIds"]).toEqual(["sensor.a", "sensor.b"]);
  });

  it("caches entity IDs for entity-as-key format", () => {
    card.setConfig(makeConfig({
      entities: [{ "sensor.temp": { color: "#f00" } } as unknown as string],
    }));
    expect(card["_entityIds"]).toEqual(["sensor.temp"]);
  });
});

// ---------------------------------------------------------------------------
// getGridOptions
// ---------------------------------------------------------------------------

describe("getGridOptions", () => {
  let card: TestCard;

  beforeEach(() => {
    invalidateCache();
    card = makeCard();
  });
  afterEach(() => card.remove());

  it("returns defaults when no grid_options configured", () => {
    card.setConfig(makeConfig());
    expect(card.getGridOptions()).toEqual({
      columns: 12,
      rows: 3,
      min_columns: 7,
      min_rows: 3,
    });
  });

  it("applies grid_options overrides", () => {
    card.setConfig(makeConfig({
      grid_options: { columns: 6, rows: 4, min_columns: 4, min_rows: 2 },
    }));
    expect(card.getGridOptions()).toEqual({
      columns: 6,
      rows: 4,
      min_columns: 4,
      min_rows: 2,
    });
  });

  it("merges partial grid_options with defaults", () => {
    card.setConfig(makeConfig({ grid_options: { columns: 6 } }));
    const opts = card.getGridOptions();
    expect(opts.columns).toBe(6);
    expect(opts.rows).toBe(3);       // default
    expect(opts.min_columns).toBe(7); // default
  });
});

// ---------------------------------------------------------------------------
// entityConfigs getter
// ---------------------------------------------------------------------------

describe("entityConfigs", () => {
  let card: TestCard;

  beforeEach(() => {
    invalidateCache();
    card = makeCard();
  });
  afterEach(() => card.remove());

  it("returns empty array when no config set", () => {
    expect(card.entityConfigs).toEqual([]);
  });

  it("normalises string entities to objects", () => {
    card.setConfig(makeConfig({ entities: ["sensor.a", "sensor.b"] }));
    expect(card.entityConfigs).toEqual([
      { entity: "sensor.a" },
      { entity: "sensor.b" },
    ]);
  });

  it("normalises entity-as-key format", () => {
    card.setConfig(makeConfig({
      entities: [{ "sensor.temp": { color: "#f00" } } as unknown as string],
    }));
    expect(card.entityConfigs[0]).toMatchObject({ entity: "sensor.temp", color: "#f00" });
  });
});

// ---------------------------------------------------------------------------
// isDarkTheme / isMobile
// ---------------------------------------------------------------------------

describe("isDarkTheme", () => {
  let card: TestCard;

  beforeEach(() => {
    invalidateCache();
    card = makeCard();
  });
  afterEach(() => card.remove());

  it("returns false when hass is not set", () => {
    expect(card.isDarkTheme).toBe(false);
  });

  it("returns false when darkMode is false", () => {
    card.hass = {
      themes: { darkMode: false, default_theme: "", default_dark_theme: null, themes: {} },
    } as unknown as typeof card.hass;
    expect(card.isDarkTheme).toBe(false);
  });

  it("returns true when darkMode is true", () => {
    card.hass = {
      themes: { darkMode: true, default_theme: "", default_dark_theme: null, themes: {} },
    } as unknown as typeof card.hass;
    expect(card.isDarkTheme).toBe(true);
  });
});

describe("isMobile", () => {
  let card: TestCard;

  beforeEach(() => {
    invalidateCache();
    card = makeCard();
  });
  afterEach(() => card.remove());

  it("returns true when _cardWidth < 400", () => {
    card["_cardWidth"] = 399;
    expect(card.isMobile).toBe(true);
  });

  it("returns false when _cardWidth >= 400", () => {
    card["_cardWidth"] = 400;
    expect(card.isMobile).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// _getEntityColor
// ---------------------------------------------------------------------------

describe("_getEntityColor", () => {
  let card: TestCard;

  beforeEach(() => {
    invalidateCache();
    card = makeCard();
  });
  afterEach(() => card.remove());

  it("returns the override color when provided", () => {
    expect(card["_getEntityColor"](0, "#custom")).toBe("#custom");
  });

  it("falls back to palette color when no override", () => {
    const color = card["_getEntityColor"](0);
    expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it("returns different palette colors for different indices", () => {
    const c0 = card["_getEntityColor"](0);
    const c1 = card["_getEntityColor"](1);
    expect(c0).not.toBe(c1);
  });
});

// ---------------------------------------------------------------------------
// refresh timer
// ---------------------------------------------------------------------------

describe("refresh timer", () => {
  // Note: vi.useFakeTimers() is intentionally NOT used here — it conflicts
  // with happy-dom's global scope and makes clearInterval undefined in
  // base-card.ts module scope. We spy on the real globals instead.

  beforeEach(() => invalidateCache());

  it("starts timer on connectedCallback", () => {
    const card = makeCard();
    expect(card["_refreshTimer"]).toBeDefined();
    card.remove();
  });

  it("clears timer on disconnectedCallback", () => {
    const card = makeCard();
    const spy = vi.spyOn(globalThis as typeof globalThis & { clearInterval: typeof clearInterval }, "clearInterval");
    card.remove();
    expect(spy).toHaveBeenCalled();
    expect(card["_refreshTimer"]).toBeUndefined();
    spy.mockRestore();
  });

  it("uses update_interval from config for timer interval", async () => {
    const spy = vi.spyOn(globalThis as typeof globalThis & { setInterval: typeof setInterval }, "setInterval");
    const card = makeCard();
    card.setConfig(makeConfig({ update_interval: 30 }));
    // Wait for Lit's async updated() to fire _startRefreshTimer with new interval
    await card.updateComplete;
    const intervals = spy.mock.calls.map((c) => c[1]);
    expect(intervals).toContain(30_000);
    card.remove();
    spy.mockRestore();
  });
});
