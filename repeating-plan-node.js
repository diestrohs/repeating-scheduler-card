import {
  DROPDOWN_STYLE,
  TIME_SPINNER_STYLE,
  TILE_SOC_STYLE,
  TILE_SWITCH_STYLE
} from "./repeating-card-mod-styles.js";

import { LitElement, html, css } from "https://unpkg.com/lit@2.8.0/index.js?module";
import { schedulerSharedStyles } from "./repeating-scheduler-styles.js";

class RepeatingPlanNode extends LitElement {

  static properties = {
    hass: {},
    plan: {},
    helpers: {},
    evccName: {}
  };

  static styles = [
    schedulerSharedStyles,
    css`:host{display:block;}`
  ];

  createCards() {
    const cfgs = [];
    const e = this.plan.entities;

    if (e.weekdays)
      cfgs.push({
        type: "custom:multiselect-dropdown",
        text_entity: e.weekdays,
        mode: "text",
        name: "Wochentage",
        item_summarize: true,
        short_name: 2,
        options: [
          { label: "Montag", value: 1 },
          { label: "Dienstag", value: 2 },
          { label: "Mittwoch", value: 3 },
          { label: "Donnerstag", value: 4 },
          { label: "Freitag", value: 5 },
          { label: "Samstag", value: 6 },
          { label: "Sonntag", value: 7 }
        ],
        card_mod: { style: DROPDOWN_STYLE }
      });

    if (e.time)
      cfgs.push({
        type: "custom:time-spinner-card",
        entity: e.time,
        name: "Zeit",
        minute_step: 5,
        card_mod: { style: TIME_SPINNER_STYLE }
      });

    if (e.soc)
      cfgs.push({
        type: "tile",
        entity: e.soc,
        name: "SoC",
        features_position: "inline",
        features: [{ type: "numeric-input", style: "slider" }],
        card_mod: { style: TILE_SOC_STYLE }
      });

    if (e.active)
      cfgs.push({
        type: "tile",
        entity: e.active,
        name: "Aktiv",
        hide_state: true,
        features_position: "inline",
        features: [{ type: "toggle" }],
        tap_action: { action: "none" },
        icon_tap_action: { action: "none" },
        card_mod: { style: TILE_SWITCH_STYLE }
      });

    return cfgs.map(cfg => {
      const el = this.helpers.createCardElement(cfg);
      el.hass = this.hass;
      return el;
    });
  }

  render() {
    if (!this.helpers || !this.plan) return html``;

    const cards = this.createCards();

    return html`
      <div class="plan">
        <div class="plan-header">
          <div>Plan ${this.plan.index}</div>
          <ha-icon-button
            class="delete-btn"
            @click=${() =>
              this.dispatchEvent(new CustomEvent("delete-plan", {
                detail: this.plan,
                bubbles: true,
                composed: true
              }))}
          >
            <ha-icon icon="mdi:trash-can-outline"></ha-icon>
          </ha-icon-button>
        </div>

        ${cards.map(card => html`${card}`)}
      </div>
    `;
  }
}

customElements.define("repeating-plan-node", RepeatingPlanNode);
