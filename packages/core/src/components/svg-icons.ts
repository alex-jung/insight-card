/**
 * SVG icon strings for InsightChart editor toggle buttons.
 * Icons using `currentColor` adapt to active/inactive states.
 *
 * Box-selector images (IMG_*) are stored as readable SVG strings and
 * converted to data URLs at runtime via `svgToDataUrl()`.
 */

/** Convert an SVG string to a data URL usable as <img src>. */
export function svgToDataUrl(svg: string): string {
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ---------------------------------------------------------------------------
// Box-selector preview images (160×90, fixed colors)
// ---------------------------------------------------------------------------

export const IMG_CHART_LINE = svgToDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>
  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <polyline points="15,65 37,43 59,56 81,29 103,41 125,31 145,36" fill="none" stroke="#4AAFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

export const IMG_CHART_AREA = svgToDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>
  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <polygon points="15,65 37,43 59,56 81,29 103,41 125,31 145,36 145,75 15,75" fill="rgba(74,175,255,0.18)"/>
  <polyline points="15,65 37,43 59,56 81,29 103,41 125,31 145,36" fill="none" stroke="#4AAFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

export const IMG_CHART_STEP = svgToDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>
  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <polyline points="15,65 37,65 37,43 59,43 59,56 81,56 81,29 103,29 103,41 125,41 125,31 145,31" fill="none" stroke="#4AAFFF" stroke-width="2.5" stroke-linecap="square" stroke-linejoin="miter"/>
</svg>`);

export const IMG_CURVE_SMOOTH = svgToDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>
  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <path d="M15,65 C26,55 32,36 45,35 C58,34 64,52 75,48 C86,44 92,22 105,22 C118,22 125,35 145,32" fill="none" stroke="#4AAFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

export const IMG_CURVE_LINEAR = svgToDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>
  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <polyline points="15,65 45,35 75,48 105,22 145,32" fill="none" stroke="#4AAFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

export const IMG_BAR_GROUPED = svgToDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>
  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <rect x="22" y="45" width="13" height="30" rx="1" fill="#4AAFFF"/>
  <rect x="36" y="55" width="13" height="20" rx="1" fill="#FF6B4A"/>
  <rect x="62" y="28" width="13" height="47" rx="1" fill="#4AAFFF"/>
  <rect x="76" y="38" width="13" height="37" rx="1" fill="#FF6B4A"/>
  <rect x="102" y="48" width="13" height="27" rx="1" fill="#4AAFFF"/>
  <rect x="116" y="33" width="13" height="42" rx="1" fill="#FF6B4A"/>
</svg>`);

export const IMG_BAR_STACKED = svgToDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90">
  <rect width="160" height="90" rx="6" fill="#f4f6f9"/>
  <line x1="15" y1="22" x2="145" y2="22" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="42" x2="145" y2="42" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="62" x2="145" y2="62" stroke="#e0e0e0" stroke-width="0.8"/>
  <line x1="15" y1="75" x2="145" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <line x1="15" y1="12" x2="15" y2="75" stroke="#c0c8d0" stroke-width="1"/>
  <rect x="25" y="55" width="26" height="20" rx="1" fill="#FF6B4A"/>
  <rect x="25" y="38" width="26" height="17" rx="1" fill="#4AAFFF"/>
  <rect x="67" y="42" width="26" height="33" rx="1" fill="#FF6B4A"/>
  <rect x="67" y="20" width="26" height="22" rx="1" fill="#4AAFFF"/>
  <rect x="109" y="50" width="26" height="25" rx="1" fill="#FF6B4A"/>
  <rect x="109" y="35" width="26" height="15" rx="1" fill="#4AAFFF"/>
</svg>`);

// ---------------------------------------------------------------------------
// Toggle button icons (24×24, currentColor)
// ---------------------------------------------------------------------------

export const SVG_ZOOM_DRAG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <line x1="2" y1="20" x2="22" y2="20" stroke="currentColor" stroke-width="1" opacity="0.3"/>
  <line x1="2" y1="4"  x2="2"  y2="20" stroke="currentColor" stroke-width="1" opacity="0.3"/>
  <polyline points="2,17 6,12 10,14 14,8 18,10 22,7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
  <rect x="8" y="6" width="10" height="10" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 1.5" rx="1"/>
  <circle cx="8" cy="6" r="1.2" fill="currentColor"/>
  <circle cx="18" cy="16" r="1.2" fill="currentColor"/>
  <line x1="5" y1="3" x2="7.5" y2="5.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <polyline points="5,5.5 5,3 7.5,3" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="19" y1="21" x2="16.5" y2="18.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <polyline points="19,18.5 19,21 16.5,21" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export const SVG_SHOW_LEGEND = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <line x1="2" y1="2"  x2="2"  y2="16" stroke="currentColor" stroke-width="1" opacity="0.3"/>
  <line x1="2" y1="16" x2="22" y2="16" stroke="currentColor" stroke-width="1" opacity="0.3"/>
  <polyline points="2,13 6,9 10,11 15,5 22,8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
  <rect x="2" y="18" width="20" height="5" rx="1" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="0.8"/>
  <line x1="4" y1="20.5" x2="8" y2="20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="6" cy="20.5" r="1" fill="currentColor"/>
  <line x1="10" y1="20.5" x2="14" y2="20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="1.5 1"/>
  <circle cx="12" cy="20.5" r="1" fill="currentColor"/>
  <line x1="16" y1="20.5" x2="20" y2="20.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

export const SVG_SHOW_X_AXIS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <line x1="4" y1="3" x2="4" y2="18" stroke="currentColor" stroke-width="1" opacity="0.3"/>
  <polyline points="4,15 8,10 12,12 17,6 22,9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
  <line x1="2" y1="18" x2="22" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="7"  y1="18" x2="7"  y2="20" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="12" y1="18" x2="12" y2="20" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="17" y1="18" x2="17" y2="20" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="22" y1="18" x2="22" y2="20" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
</svg>`;

export const SVG_SHOW_Y_AXIS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <line x1="4" y1="18" x2="22" y2="18" stroke="currentColor" stroke-width="1" opacity="0.3"/>
  <polyline points="4,15 8,10 12,12 17,6 22,9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
  <line x1="4" y1="2" x2="4" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <line x1="2" y1="6"  x2="4" y2="6"  stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="2" y1="10" x2="4" y2="10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="2" y1="14" x2="4" y2="14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="2" y1="18" x2="4" y2="18" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
</svg>`;
