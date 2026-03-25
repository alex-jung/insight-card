import { LitElement, html, css, type TemplateResult, type CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * A horizontal section divider with a centred label.
 *
 * Renders: ─────  Title  ─────
 *
 * Usage:
 *   <insight-section-title label="Appearance"></insight-section-title>
 */
@customElement("insight-section-title")
export class InsightSectionTitle extends LitElement {
    @property() label = "";

    render(): TemplateResult {
        return html`
            <div class="section-title">
                <span class="line"></span>
                <span class="label">${this.label}</span>
                <span class="line"></span>
            </div>
        `;
    }

    static styles: CSSResultGroup = css`
        :host {
            display: block;
        }

        .section-title {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 24px 0px 8px 0px;
        }

        .line {
            flex: 1;
            height: 1px;
            background: var(--divider-color, #e0e0e0);
        }

        .label {
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--secondary-text-color);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            white-space: nowrap;
        }
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        "insight-section-title": InsightSectionTitle;
    }
}
