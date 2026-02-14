// Style-Konstante für tile-SoC (Slider)
const TILE_SOC_STYLE = `
  ha-card {
    background: none;
    border: none;
    box-shadow: none;
    border: none;
  }
  ha-state-icon {
    color: #44739E !important;
  }
  hui-card-features$ hui-card-feature$ hui-numeric-input-card-feature$ ha-control-slider$ .slider {
    height: 35px !important;
    --control-slider-color: var(--primary-color) !important;
    --control-slider-background: var(--primary-color) !important;
    --control-slider-background-opacity: 0.25;
  }
`;
// Style-Konstante für custom:time-spinner-card
const TIME_SPINNER_STYLE = `
  ha-card {
    box-shadow: none !important;
    border: none !important;
    padding: 0px !important;
    margin: 0px 0px 0px -8px;
  }
  .name {
    margin-inline-start: -4px !important;
  }
  button span {
    display: none;
  }
  .time-btn {
    min-height: 40px !important;
    height: 40px !important;
    padding: 0px 0px 0px !important;
    border-radius: 12px !important;
    overflow: hidden;
  }
`;
// Style-Konstante für custom:multiselect-dropdown
const DROPDOWN_STYLE = `
  ha-card {
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
  }
  .row .icon { margin-left:-16px !important; }
  .row .name { margin-left:-8px !important; }
  .row .value { border-radius:12px !important; }
`;
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
    css`
      :host { display: block; }
    `
  ];

  willUpdate(changed) {
    if (!this._cards && this.helpers && this.plan) {
      this._cards = this.createCards();
    }
    if (changed.has("hass") && this._cards) {
      this._cards.forEach(c => c.hass = this.hass);
    }
  }

  createCards() {
// Style-Konstante für tile-Switch (active)
const TILE_SWITCH_STYLE = `
  ha-state-icon {
    color: #44739E;
  }
  ha-card {
    background: none;
    border: none;
    box-shadow: none;
    border: none;
  }
`;
    const cfgs = [];
    const e = this.plan.entities;
    if (e.weekdays)
      cfgs.push({
        type: "custom:multiselect-dropdown",
        text_entity: e.weekdays,
        mode: "text",
        name: "Wochentage",
        icon_color: "#44739e",
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
        icon_color: "#44739e",
        minute_step: 5,
        card_mod: { style: TIME_SPINNER_STYLE }
      });
    if (e.soc)
      cfgs.push({
        type: "tile",
        entity: e.soc,
        name: "SoC",
        color: "var(--primary-color)",
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
        color: "var(--primary-color)",
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
    if (!this._cards) return html``;
    return html`
      <div class="plan" part="plan">
        <div class="plan-header" part="plan-header">
          <div>Plan ${this.plan.index}</div>
          <ha-icon-button
            class="delete-btn"
            part="delete-button"
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
        ${this._cards}
      </div>
    `;
  }
}

customElements.define("repeating-plan-node", RepeatingPlanNode);
