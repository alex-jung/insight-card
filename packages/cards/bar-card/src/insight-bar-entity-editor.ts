import { LitElement, html, css, nothing, type TemplateResult, type CSSResultGroup } from "lit";
import { customElement, property } from "lit/decorators.js";
import { mdiDelete } from "@mdi/js";

import {
    localize,
    DEFAULT_COLORS,
    type HomeAssistant,
    type InsightEntityConfig,
} from "@insight-chart/core";

import { InsightBarEntityTab } from "./insight-bar-entity-tab.js";

const BASE_SCHEMA = [
    { name: "entity", selector: { entity: {} } },
    { name: "name",   selector: { text: {} } },
];

@customElement("insight-bar-entity-editor")
export class InsightBarEntityEditor extends LitElement {
    @property({ attribute: false }) hass?: HomeAssistant;
    @property({ attribute: false }) tab!: InsightBarEntityTab;

    private get _lang(): string {
        return this.hass?.locale?.language ?? "en";
    }

    render(): TemplateResult {
        if (!this.tab) return html`${nothing}`;

        const ec = this.tab.config;

        return html`
            <div class="entity-editor-content">
                <div class="entity-top-row">
                    <ha-icon-button
                        .path=${mdiDelete}
                        @click=${this._handleDelete}
                    ></ha-icon-button>
                </div>

                <div class="color-row">
                    <div class="color-label">
                        ${localize("editor.field.color", this._lang)}
                    </div>
                    <input
                        type="color"
                        class="color-swatch"
                        .value=${ec.color ??
                        DEFAULT_COLORS[this.tab.index - 1] ??
                        DEFAULT_COLORS[0]}
                        @input=${(e: Event) =>
                            this._patch({
                                color: (e.target as HTMLInputElement).value,
                            })}
                    />
                </div>

                <ha-form
                    .hass=${this.hass}
                    .schema=${BASE_SCHEMA}
                    .data=${{ entity: ec.entity ?? "", name: ec.name ?? "" }}
                    .computeLabel=${this._computeLabel}
                    @value-changed=${(e: CustomEvent<{ value: Record<string, unknown> }>) =>
                        this._onFormChanged(e.detail.value)}
                ></ha-form>
            </div>
        `;
    }

    private _onFormChanged(raw: Record<string, unknown>): void {
        const detail: InsightEntityConfig = { ...this.tab.config };
        detail.entity = (raw["entity"] as string) ?? detail.entity;
        const name = raw["name"] as string;
        if (name) detail.name = name;
        else delete detail.name;
        this.dispatchEvent(new CustomEvent("onChange", { detail }));
    }

    private _patch(patch: Partial<InsightEntityConfig>): void {
        const updated: InsightEntityConfig = { ...this.tab.config, ...patch };
        this.dispatchEvent(new CustomEvent("onChange", { detail: updated }));
    }

    private _handleDelete(): void {
        this.dispatchEvent(new CustomEvent("onDelete", { detail: this.tab.index }));
    }

    private readonly _computeLabel = (schema: { name: string }): string =>
        localize(`editor.field.${schema.name}`, this._lang);

    static styles: CSSResultGroup = css`
        :host {
            display: block;
        }

        .entity-editor-content {
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 8px;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 8px;
        }

        .entity-top-row {
            display: flex;
            justify-content: flex-end;
        }

        .color-row {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-bottom: 16px;
        }

        .color-label {
            font-size: 0.875rem;
            color: var(--secondary-text-color);
        }

        .color-swatch {
            width: 100%;
            height: 36px;
            border-radius: 4px;
            cursor: pointer;
            padding: 2px;
            background: transparent;
        }
    `;
}
