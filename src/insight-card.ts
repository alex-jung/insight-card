/**
 * insight-chart.ts — Combined entry point for all InsightChart cards.
 *
 * Importing this single file registers all custom elements:
 *   - custom:insight-line-card
 *   - custom:insight-bar-card
 *   - custom:insight-heatmap-card
 */

console.info(
    "%c InsightChart %c v0.1.0 ",
    "background:#4AAFFF;color:#fff;font-weight:bold;border-radius:4px 0 0 4px;padding:2px 6px",
    "background:#1a1a2e;color:#4AAFFF;font-weight:bold;border-radius:0 4px 4px 0;padding:2px 6px",
);

import "../packages/cards/line-card/src/insight-line-card.js";
import "../packages/cards/line-card/src/insight-line-card-editor.js";
import "../packages/cards/bar-card/src/insight-bar-card.js";
import "../packages/cards/bar-card/src/insight-bar-card-editor.js";
import "../packages/cards/heatmap-card/src/insight-heatmap-card.js";
import "../packages/cards/heatmap-card/src/insight-heatmap-card-editor.js";
