import { LitElement, html, css, type TemplateResult, type CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";

/**
 * A visual box-model editor widget.
 *
 * Renders a nested outer/inner box diagram with numeric inputs at each side,
 * similar to browser DevTools. Fires a `value-changed` event with
 * `{ key: string, value: number }` whenever an input changes.
 *
 * Usage:
 *   <insight-box-model
 *     label-outer="Margin"
 *     label-inner="Padding"
 *     .outerTop=${0}   .outerRight=${0}   .outerBottom=${0}   .outerLeft=${0}
 *     .innerTop=${8}   .innerRight=${16}  .innerBottom=${8}   .innerLeft=${16}
 *     .keyOuter=${"margin"}
 *     .keyInner=${"padding"}
 *     @value-changed=${handler}
 *   ></insight-box-model>
 *
 * The event detail is `{ key: "margin_top" | "padding_left" | …, value: number }`.
 */
@customElement("insight-box-model")
export class InsightBoxModel extends LitElement {
    @property({ attribute: "label-outer" }) labelOuter = "Margin";
    @property({ attribute: "label-inner" }) labelInner = "Padding";

    /** Config key prefix for the outer box, e.g. "margin" → fires "margin_top" etc. */
    @property() keyOuter = "margin";
    /** Config key prefix for the inner box, e.g. "padding" → fires "padding_top" etc. */
    @property() keyInner = "padding";

    @property({ type: Number }) outerTop = 0;
    @property({ type: Number }) outerRight = 0;
    @property({ type: Number }) outerBottom = 0;
    @property({ type: Number }) outerLeft = 0;

    @property({ type: Number }) innerTop = 8;
    @property({ type: Number }) innerRight = 16;
    @property({ type: Number }) innerBottom = 8;
    @property({ type: Number }) innerLeft = 16;

    render(): TemplateResult {
        return html`
            <div class="bm-outer">
                <span class="bm-label">${this.labelOuter}</span>
                <div class="bm-top">
                    ${this._input(`${this.keyOuter}_top`, this.outerTop)}
                </div>
                <div class="bm-middle">
                    ${this._input(`${this.keyOuter}_left`, this.outerLeft)}
                    <div class="bm-inner">
                        <span class="bm-label bm-label--inner">${this.labelInner}</span>
                        <div class="bm-top">
                            ${this._input(`${this.keyInner}_top`, this.innerTop)}
                        </div>
                        <div class="bm-middle">
                            ${this._input(`${this.keyInner}_left`, this.innerLeft)}
                            <div class="bm-chart-area"></div>
                            ${this._input(`${this.keyInner}_right`, this.innerRight)}
                        </div>
                        <div class="bm-top">
                            ${this._input(`${this.keyInner}_bottom`, this.innerBottom)}
                        </div>
                    </div>
                    ${this._input(`${this.keyOuter}_right`, this.outerRight)}
                </div>
                <div class="bm-top">
                    ${this._input(`${this.keyOuter}_bottom`, this.outerBottom)}
                </div>
            </div>
        `;
    }

    private _input(key: string, value: number): TemplateResult {
        return html`
            <input
                class="bm-input"
                type="number"
                min="0"
                max="100"
                .value=${String(value)}
                @change=${(e: Event) =>
                    this._fire(key, parseInt((e.target as HTMLInputElement).value) || 0)}
            />
        `;
    }

    private _fire(key: string, value: number): void {
        this.dispatchEvent(
            new CustomEvent("value-changed", {
                detail: { key, value },
                bubbles: true,
                composed: true,
            }),
        );
    }

    static styles: CSSResultGroup = css`
        :host {
            display: block;
            margin: 24px 0px;
        }

        .bm-outer {
            border: 2px dashed var(--divider-color, #ccc);
            border-radius: 6px;
            padding: 4px 6px;
            position: relative;
        }

        .bm-inner {
            border: 2px dashed var(--primary-color, #03a9f4);
            border-radius: 4px;
            padding: 4px 6px;
            flex: 1;
            min-width: 0;
            position: relative;
        }

        .bm-label {
            position: absolute;
            top: -9px;
            left: 8px;
            background: var(--card-background-color, #fff);
            padding: 0 4px;
            font-size: 0.65rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--secondary-text-color);
        }

        .bm-label--inner {
            color: var(--primary-color, #03a9f4);
        }

        .bm-top {
            display: flex;
            justify-content: center;
            padding: 2px 0;
        }

        .bm-middle {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 2px 0;
        }

        .bm-chart-area {
            flex: 1;
            min-height: 28px;
            background: color-mix(in srgb, var(--primary-color, #03a9f4) 15%, transparent);
            border-radius: 3px;
        }

        .bm-input {
            width: 44px;
            text-align: center;
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 4px;
            padding: 3px 2px;
            font-size: 0.8rem;
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color);
            -moz-appearance: textfield;
        }

        .bm-input::-webkit-inner-spin-button,
        .bm-input::-webkit-outer-spin-button {
            opacity: 1;
        }

        .bm-input:focus {
            outline: 2px solid var(--primary-color, #03a9f4);
            outline-offset: -1px;
        }
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        "insight-box-model": InsightBoxModel;
    }
}
