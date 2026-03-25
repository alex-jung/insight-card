# Insight Cards

[![Release](https://img.shields.io/github/v/release/alex-jung/insight-card?style=flat-square&color=4AAFFF)](https://github.com/alex-jung/insight-card/releases)
[![CI](https://img.shields.io/github/actions/workflow/status/alex-jung/insight-card/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/alex-jung/insight-card/actions/workflows/ci.yml)
[![HACS](https://img.shields.io/badge/HACS-Custom-orange?style=flat-square)](https://hacs.xyz)
[![Home Assistant](https://img.shields.io/badge/HA-2025.5%2B-blue?style=flat-square&logo=home-assistant)](https://www.home-assistant.io)
[![License](https://img.shields.io/github/license/alex-jung/insight-card?style=flat-square)](LICENSE)

A modular collection of Lovelace visualisation cards for Home Assistant, installable via HACS.

## Why Insight Cards?

Existing graph cards each have critical weaknesses:

- **mini-graph-card**: Simple but limited — no zoom, no visual editor, max 10 days history
- **ApexCharts-card**: Powerful but performance problems with many entities, YAML-only
- **Plotly-graph-card**: Interactive but steep learning curve, YAML-only.

Insight Cards solves the paradox: **simplicity of mini-graph-card + performance of uPlot + visual editor**.

## Cards

| Card | Element | Status |
|------|---------|--------|
| Line / Area / Step Chart | `custom:insight-line-card` | ✅ Available |
| Bar Chart | `custom:insight-bar-card` | 🚧 In development |
| Heatmap | `custom:insight-heatmap-card` | 🚧 In development |
| Sankey | `custom:insight-sankey-card` | 📋 Planned |
| Compare | `custom:insight-compare-card` | 📋 Planned |

## Installation

### HACS (recommended)

1. Open HACS in Home Assistant
2. Click the menu → *Custom repositories*
3. Add `https://github.com/alex-jung/insight-card`, category *Dashboard*
4. Install *Insight Cards*
5. Reload your browser

### Manual

1. Download `insight-card.js` from the [latest release](https://github.com/alex-jung/insight-card/releases)
2. Copy it to `config/www/insight-card.js`
3. Add it as a resource in Home Assistant:
   - *Settings → Dashboards → Resources → Add resource*
   - URL: `/local/insight-card.js`, type: *JavaScript module*
4. Reload your browser

## Quick Start

No YAML required — all cards come with a fully featured **visual editor**.

1. Edit your dashboard
2. Click **+ Add card**
3. Search for **Insight Line Card** (or any other Insight Cards card)
4. Pick your entities in the *Entities* section
5. Adjust time range, chart style, and appearance using the editor panels

The card updates live as you change settings — no manual YAML editing needed.

### Minimal YAML

```yaml
type: custom:insight-line-card
entities:
  - sensor.living_room_temperature
```

## Screenshots

### Hero — multi-entity area chart with zoom

<!-- screenshot: docs/screenshots/line-card-hero.png -->
> 📸 *Screenshot coming soon*

### Chart styles — Line · Area · Step

<!-- screenshot: docs/screenshots/line-card-styles.png -->
> 📸 *Screenshot coming soon*

### Dual Y axes

<!-- screenshot: docs/screenshots/line-card-dual-axis.png -->
> 📸 *Screenshot coming soon*

### Color thresholds (gradient fill)

<!-- screenshot: docs/screenshots/line-card-color-thresholds.png -->
> 📸 *Screenshot coming soon*

### Threshold lines

<!-- screenshot: docs/screenshots/line-card-thresholds.png -->
> 📸 *Screenshot coming soon*

### Visual editor

<!-- screenshot: docs/screenshots/line-card-editor.png -->
> 📸 *Screenshot coming soon*

## Features

### Line Card

- **Chart styles**: Line, Area (filled), Step (staircase)
- **Multi-entity**: Multiple entities, each with its own color and name
- **Dual Y axes**: Assign entities to primary or secondary axis independently
- **Zoom**: Drag to zoom in, click the reset button to restore the full range
- **Statistics API**: Use long-term statistics instead of raw history for sensors with `state_class`
- **Aggregation**: Client-side bucketing by configurable period (e.g. `30m`, `1h`, `1d`)
- **Transforms**: `diff` (change), `normalize` (0–1), `cumulative` (running sum)
- **Threshold lines**: Horizontal reference lines at fixed Y values
- **Color thresholds**: Gradient fill that changes color based on the Y value
- **Interactions**: Configurable `tap_action` and `double_tap_action` (more-info, navigate, URL, service call)
- **Visual editor**: Full ha-form based editor — no YAML required

## Requirements

- Home Assistant **2025.5.0** or newer.

## Contributing

Bug reports and feature requests are welcome via [GitHub Issues](https://github.com/alex-jung/insight-card/issues).

## License

MIT
