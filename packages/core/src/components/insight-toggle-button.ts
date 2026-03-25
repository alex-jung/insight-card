import { LitElement, html, css, type TemplateResult, type CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * A toggle button with a centered SVG icon on top and a label below.
 *
 * Usage:
 *   <insight-toggle-button
 *     .svg=${"<svg>...</svg>"}
 *     label="Linear"
 *     ?active=${true}
 *     @click=${handler}
 *   ></insight-toggle-button>
 */
@customElement("insight-toggle-button")
export class InsightToggleButton extends LitElement {
    @property() svg = "";
    @property() label = "";
    @property({ type: Boolean, reflect: true }) active = false;
    @property({ type: Number }) width = 80;
    @property({ type: Number }) height = 80;

    render(): TemplateResult {
        return html`
            <button
                class="toggle-btn ${this.active ? "active" : ""}"
                style="width:${this.width}px;height:${this.height}px;"
                aria-pressed=${this.active}
                @click=${this._handleClick}
            >
                <span class="icon" .innerHTML=${this.svg}></span>
                <span class="label">${this.label}</span>
            </button>
        `;
    }

    private _handleClick(): void {
        this.dispatchEvent(
            new CustomEvent("toggle", {
                detail: { active: !this.active },
                bubbles: true,
                composed: true,
            }),
        );
    }

    static styles: CSSResultGroup = css`
        :host {
            display: inline-block;
        }

        .toggle-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 8px 16px;
            border: 2px solid var(--divider-color, #e0e0e0);
            border-radius: 8px;
            background: var(--card-background-color, #fff);
            cursor: pointer;
            transition:
                border-color 0.15s ease,
                background 0.15s ease;
            width: 100%;
            box-sizing: border-box;
        }

        .toggle-btn:hover {
            border-color: var(--primary-color, #03a9f4);
        }

        .toggle-btn.active {
            border-color: var(--primary-color, #03a9f4);
            background: color-mix(
                in srgb,
                var(--primary-color, #03a9f4) 12%,
                transparent
            );
        }

        .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        }

        .icon svg {
            width: 100%;
            height: auto;
            display: block;
        }

        .label {
            font-size: 0.75rem;
            color: var(--secondary-text-color, #727272);
            text-align: center;
            white-space: normal;
            overflow-wrap: break-word;
        }

        .toggle-btn.active .label {
            color: var(--primary-color, #03a9f4);
            font-weight: 600;
        }
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        "insight-toggle-button": InsightToggleButton;
    }
}
