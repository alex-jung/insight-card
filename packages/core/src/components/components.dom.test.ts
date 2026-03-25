/**
 * Tests for core/components.
 * Runs in happy-dom (*.dom.test.ts).
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { svgToDataUrl, IMG_CHART_LINE, IMG_CHART_AREA, IMG_CHART_STEP, SVG_ZOOM_DRAG } from "./svg-icons.js";
import "./insight-section-title.js";
import "./insight-toggle-button.js";
import "./insight-box-model.js";
import type { InsightSectionTitle } from "./insight-section-title.js";
import type { InsightToggleButton } from "./insight-toggle-button.js";
import type { InsightBoxModel } from "./insight-box-model.js";

// ---------------------------------------------------------------------------
// Timer globals (same fix as base-card.dom.test.ts)
// ---------------------------------------------------------------------------

beforeAll(() => {
  if (typeof clearInterval === "undefined") {
    (globalThis as Record<string, unknown>).clearInterval  = window.clearInterval.bind(window);
    (globalThis as Record<string, unknown>).setInterval    = window.setInterval.bind(window);
    (globalThis as Record<string, unknown>).clearTimeout   = window.clearTimeout.bind(window);
    (globalThis as Record<string, unknown>).setTimeout     = window.setTimeout.bind(window);
  }
});

afterAll(() => {});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function mount<T extends HTMLElement>(tagName: string): Promise<T> {
  const el = document.createElement(tagName) as T;
  document.body.appendChild(el);
  await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
  return el;
}

// ---------------------------------------------------------------------------
// svgToDataUrl
// ---------------------------------------------------------------------------

describe("svgToDataUrl", () => {
  it("returns a data: URL", () => {
    const url = svgToDataUrl("<svg></svg>");
    expect(url).toMatch(/^data:image\/svg\+xml,/);
  });

  it("URL-encodes the SVG content", () => {
    const url = svgToDataUrl('<svg width="10"></svg>');
    expect(url).toContain("%22"); // " is encoded as %22
  });

  it("round-trips via decodeURIComponent", () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><circle r="5"/></svg>';
    const url = svgToDataUrl(svg);
    const decoded = decodeURIComponent(url.replace("data:image/svg+xml,", ""));
    expect(decoded).toBe(svg);
  });
});

// ---------------------------------------------------------------------------
// IMG_* constants
// ---------------------------------------------------------------------------

describe("IMG_* data URLs", () => {
  it("IMG_CHART_LINE is a valid SVG data URL", () => {
    expect(IMG_CHART_LINE).toMatch(/^data:image\/svg\+xml,/);
    const svg = decodeURIComponent(IMG_CHART_LINE.replace("data:image/svg+xml,", ""));
    expect(svg).toContain("<svg");
    expect(svg).toContain("polyline");
  });

  it("IMG_CHART_AREA contains a polygon (fill)", () => {
    const svg = decodeURIComponent(IMG_CHART_AREA.replace("data:image/svg+xml,", ""));
    expect(svg).toContain("<polygon");
  });

  it("IMG_CHART_STEP uses stroke-linejoin=miter (step appearance)", () => {
    const svg = decodeURIComponent(IMG_CHART_STEP.replace("data:image/svg+xml,", ""));
    expect(svg).toContain("stroke-linejoin=\"miter\"");
  });

  it("SVG_ZOOM_DRAG is an inline SVG string (not a data URL)", () => {
    expect(SVG_ZOOM_DRAG).toMatch(/^<svg/);
    expect(SVG_ZOOM_DRAG).not.toMatch(/^data:/);
  });
});

// ---------------------------------------------------------------------------
// InsightSectionTitle
// ---------------------------------------------------------------------------

describe("InsightSectionTitle", () => {
  it("renders the label text", async () => {
    const el = await mount<InsightSectionTitle>("insight-section-title");
    el.label = "Appearance";
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
    const labelEl = el.shadowRoot!.querySelector(".label");
    expect(labelEl?.textContent?.trim()).toBe("Appearance");
    el.remove();
  });

  it("renders two .line elements (horizontal rules)", async () => {
    const el = await mount<InsightSectionTitle>("insight-section-title");
    const lines = el.shadowRoot!.querySelectorAll(".line");
    expect(lines.length).toBe(2);
    el.remove();
  });

  it("defaults to empty label", async () => {
    const el = await mount<InsightSectionTitle>("insight-section-title");
    expect(el.label).toBe("");
    el.remove();
  });

  it("updates label when property changes", async () => {
    const el = await mount<InsightSectionTitle>("insight-section-title");
    el.label = "First";
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
    el.label = "Second";
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
    expect(el.shadowRoot!.querySelector(".label")?.textContent?.trim()).toBe("Second");
    el.remove();
  });
});

// ---------------------------------------------------------------------------
// InsightToggleButton
// ---------------------------------------------------------------------------

describe("InsightToggleButton", () => {
  it("renders a button element", async () => {
    const el = await mount<InsightToggleButton>("insight-toggle-button");
    expect(el.shadowRoot!.querySelector("button")).toBeTruthy();
    el.remove();
  });

  it("defaults: active=false, width=80, height=80", async () => {
    const el = await mount<InsightToggleButton>("insight-toggle-button");
    expect(el.active).toBe(false);
    expect(el.width).toBe(80);
    expect(el.height).toBe(80);
    el.remove();
  });

  it("reflects active as attribute on host", async () => {
    const el = await mount<InsightToggleButton>("insight-toggle-button");
    el.active = true;
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
    expect(el.hasAttribute("active")).toBe(true);
    el.remove();
  });

  it("button has aria-pressed=true when active", async () => {
    const el = await mount<InsightToggleButton>("insight-toggle-button");
    el.active = true;
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
    const btn = el.shadowRoot!.querySelector("button")!;
    expect(btn.getAttribute("aria-pressed")).toBe("true");
    el.remove();
  });

  it("button has aria-pressed=false when inactive", async () => {
    const el = await mount<InsightToggleButton>("insight-toggle-button");
    const btn = el.shadowRoot!.querySelector("button")!;
    expect(btn.getAttribute("aria-pressed")).toBe("false");
    el.remove();
  });

  it("renders label text", async () => {
    const el = await mount<InsightToggleButton>("insight-toggle-button");
    el.label = "Linear";
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
    expect(el.shadowRoot!.querySelector(".label")?.textContent?.trim()).toBe("Linear");
    el.remove();
  });

  it("applies .active CSS class to button when active=true", async () => {
    const el = await mount<InsightToggleButton>("insight-toggle-button");
    el.active = true;
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
    expect(el.shadowRoot!.querySelector("button")?.classList.contains("active")).toBe(true);
    el.remove();
  });

  it("dispatches toggle event with correct detail on click", async () => {
    const el = await mount<InsightToggleButton>("insight-toggle-button");
    el.active = false;
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;

    const events: CustomEvent[] = [];
    el.addEventListener("toggle", (e) => events.push(e as CustomEvent));

    el.shadowRoot!.querySelector("button")!.click();

    expect(events).toHaveLength(1);
    expect(events[0].detail).toEqual({ active: true }); // !active
    el.remove();
  });

  it("toggle event detail reflects current active state (active=true → detail.active=false)", async () => {
    const el = await mount<InsightToggleButton>("insight-toggle-button");
    el.active = true;
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;

    const events: CustomEvent[] = [];
    el.addEventListener("toggle", (e) => events.push(e as CustomEvent));
    el.shadowRoot!.querySelector("button")!.click();

    expect(events[0].detail).toEqual({ active: false });
    el.remove();
  });

  it("toggle event bubbles and is composed", async () => {
    const el = await mount<InsightToggleButton>("insight-toggle-button");
    let bubbled = false;
    document.body.addEventListener("toggle", () => { bubbled = true; }, { once: true });
    el.shadowRoot!.querySelector("button")!.click();
    expect(bubbled).toBe(true);
    el.remove();
  });

  it("sets button width and height from properties", async () => {
    const el = await mount<InsightToggleButton>("insight-toggle-button");
    el.width = 120;
    el.height = 60;
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
    const btn = el.shadowRoot!.querySelector<HTMLButtonElement>("button")!;
    expect(btn.style.width).toBe("120px");
    expect(btn.style.height).toBe("60px");
    el.remove();
  });
});

// ---------------------------------------------------------------------------
// InsightBoxModel
// ---------------------------------------------------------------------------

describe("InsightBoxModel", () => {
  it("renders outer and inner box elements", async () => {
    const el = await mount<InsightBoxModel>("insight-box-model");
    expect(el.shadowRoot!.querySelector(".bm-outer")).toBeTruthy();
    expect(el.shadowRoot!.querySelector(".bm-inner")).toBeTruthy();
    el.remove();
  });

  it("renders 8 number inputs (4 outer + 4 inner)", async () => {
    const el = await mount<InsightBoxModel>("insight-box-model");
    const inputs = el.shadowRoot!.querySelectorAll("input[type=number]");
    expect(inputs.length).toBe(8);
    el.remove();
  });

  it("default property values", async () => {
    const el = await mount<InsightBoxModel>("insight-box-model");
    expect(el.labelOuter).toBe("Margin");
    expect(el.labelInner).toBe("Padding");
    expect(el.keyOuter).toBe("margin");
    expect(el.keyInner).toBe("padding");
    expect(el.outerTop).toBe(0);
    expect(el.innerTop).toBe(8);
    expect(el.innerRight).toBe(16);
    el.remove();
  });

  it("renders label text for outer box", async () => {
    const el = await mount<InsightBoxModel>("insight-box-model");
    el.labelOuter = "Außenabstand";
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
    const labels = Array.from(el.shadowRoot!.querySelectorAll(".bm-label"));
    expect(labels.some((l) => l.textContent?.trim() === "Außenabstand")).toBe(true);
    el.remove();
  });

  it("dispatches value-changed event on input change", async () => {
    const el = await mount<InsightBoxModel>("insight-box-model");
    const events: CustomEvent[] = [];
    el.addEventListener("value-changed", (e) => events.push(e as CustomEvent));

    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input[type=number]")!;
    input.value = "12";
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(events).toHaveLength(1);
    expect(events[0].detail.value).toBe(12);
    expect(typeof events[0].detail.key).toBe("string");
    el.remove();
  });

  it("event key uses keyOuter prefix for outer inputs", async () => {
    const el = await mount<InsightBoxModel>("insight-box-model");
    el.keyOuter = "margin";
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;

    const events: CustomEvent[] = [];
    el.addEventListener("value-changed", (e) => events.push(e as CustomEvent));

    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input[type=number]")!;
    input.value = "5";
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(events[0].detail.key).toMatch(/^margin_/);
    el.remove();
  });

  it("value-changed event is composed and bubbles", async () => {
    const el = await mount<InsightBoxModel>("insight-box-model");
    let received = false;
    document.body.addEventListener("value-changed", () => { received = true; }, { once: true });

    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input[type=number]")!;
    input.value = "4";
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(received).toBe(true);
    el.remove();
  });

  it("treats non-numeric input as 0", async () => {
    const el = await mount<InsightBoxModel>("insight-box-model");
    const events: CustomEvent[] = [];
    el.addEventListener("value-changed", (e) => events.push(e as CustomEvent));

    const input = el.shadowRoot!.querySelector<HTMLInputElement>("input[type=number]")!;
    input.value = "abc";
    input.dispatchEvent(new Event("change", { bubbles: true }));

    expect(events[0].detail.value).toBe(0);
    el.remove();
  });
});
