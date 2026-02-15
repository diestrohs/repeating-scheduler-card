import { DROPDOWN_STYLE, TIME_SPINNER_STYLE, TILE_SOC_STYLE, TILE_SWITCH_STYLE } from "./repeating-card-mod-styles.js";
import { LitElement, html, css } from "https://unpkg.com/lit@2.8.0/index.js?module";
import { schedulerSharedStyles } from "./repeating-scheduler-styles.js";

class RepeatingPlanNode extends LitElement {
  constructor() {
    super();
    this._cards = null;
  }
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
    // Neu bauen, wenn helpers, plan oder plan.entities sich ändern
    const planChanged = changed.has("plan") &&
      JSON.stringify(changed.get("plan")?.entities) !== JSON.stringify(this.plan?.entities);

    if (!this._cards || changed.has("helpers") || planChanged) {
      if (this.helpers && this.plan) {
        this._cards = this.createCards();
        // Karte nach Entities indexieren
        this._cardMap = {};
        this._cards.forEach(c => {
          const ent = c?.entity;
          if (ent) this._cardMap[ent] = c;
        });
      }
    }

    // Nur hass auf relevante Cards propagieren
    if (changed.has("hass") && this._cards && this.plan?.entities) {
      const changedHass = changed.get("hass");
      const relevantChanged = Object.values(this.plan.entities).some(eid => changedHass?.[eid] !== undefined);
      if (relevantChanged) {
        Object.values(this._cardMap).forEach(c => c.hass = this.hass);
      }
    }
  }

  createCards() {
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
        ${this._cards.map(card => html`${card}`)}
      </div>
    `;
  }
}

customElements.define("repeating-plan-node", RepeatingPlanNode);
