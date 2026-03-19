# InsightChart Cards

A modular collection of Lovelace visualisation cards for Home Assistant, installable via HACS.

## Why InsightChart?

Existing graph cards each have critical weaknesses:

- **mini-graph-card**: Simple but unmaintained since 2021, no zoom, no visual editor, max 10 days history
- **ApexCharts-card**: Powerful but severe performance problems, 1 000+ open issues, YAML-only
- **Plotly-graph-card**: Interactive but steep learning curve, YAML-only, poorly documented

InsightChart solves the paradox: **simplicity of mini-graph-card + power of Plotly + visual editor like Mushroom/Bubble Card**.

## Cards

| Card | Element | Status |
|------|---------|--------|
| Line / Area / Step Chart | `custom:insight-line-card` | MVP |
| Bar Chart | `custom:insight-bar-card` | Planned |
| Heatmap | `custom:insight-heatmap-card` | Planned |
| Sankey | `custom:insight-sankey-card` | Future |
| Compare | `custom:insight-compare-card` | Future |

## Installation

### HACS (recommended)

1. Open HACS in Home Assistant
2. Go to *Frontend*
3. Click the menu → *Custom repositories*
4. Add this repository URL, category *Lovelace*
5. Install *InsightChart Cards*
6. Reload your browser

### Manual

Download the latest release assets from GitHub Releases and copy the `.js` files to `config/www/`.

## Quick Start

```yaml
type: custom:insight-line-card
entities:
  - sensor.living_room_temperature
```

Multi-entity with options:

```yaml
type: custom:insight-line-card
title: Temperature Comparison
entities:
  - entity: sensor.living_room_temperature
    name: Living Room
    color: "#FF6B4A"
  - entity: sensor.bedroom_temperature
    name: Bedroom
    color: "#4AAFFF"
hours: 48
style: area
show_stats: true
```

## Requirements

- Home Assistant 2025.5.0 or newer (Lit 3, no Polymer)

## License

MIT
