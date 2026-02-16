import { LitElement, html } from "https://unpkg.com/lit@2.8.0/index.js?module";
import { repeat } from "https://unpkg.com/lit@2.8.0/directives/repeat.js?module";
import { schedulerSharedStyles } from "./repeating-scheduler-styles.js";
import "./repeating-plan-node.js";

class RepeatingSchedulerCard extends LitElement {

  static properties = {
    hass: {},
    config: {},
    _helpers: { state: false },
    _plans: { state: true }
  };

  static styles = [schedulerSharedStyles];

  setConfig(config) {
    this.config = {
      add_service: config.add_service || "evcc_scheduler.set_repeating_plan",
      delete_service: config.delete_service || "evcc_scheduler.del_repeating_plan",
      ...config
    };
  }

  async firstUpdated() {
    this._helpers = await window.loadCardHelpers();
  }

  // ---------- helpers ----------

  _escapeRegex(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  buildPatterns(vehicle) {
    const patterns = {};
    const vEsc = this._escapeRegex(vehicle);

    Object.entries(this.config.pattern).forEach(([key, template]) => {
      const regexString = template
        .replace("{vehicle}", vEsc)
        .replace("{index}", "(\\d+)")
        .replace(/\./g, "\\.");

      patterns[key] = new RegExp(`^${regexString}$`);
    });

    return patterns;
  }

  collectPlans(vehicle) {
    const patterns = this.buildPatterns(vehicle);
    const plans = {};
    const states = this.hass.states;

    for (const id in states) {
      if (!id.includes(vehicle)) continue;

      for (const [type, regex] of Object.entries(patterns)) {
        const match = id.match(regex);
        if (match) {
          const index = match[1];
          if (!plans[index]) plans[index] = {};
          plans[index][type] = id;
        }
      }
    }

    return Object.entries(plans)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([index, entities]) => ({ index, entities }));
  }

  getVehicle() {
    const entity = this.hass?.states?.[this.config.vehicle_entity];
    if (!entity) return null;

    if (this.config.vehicle_attribute) {
      const path = this.config.vehicle_attribute.split(".");
      let value = entity.attributes;
      for (const key of path) value = value?.[key];
      if (value) return value;
    }

    if (entity.attributes?.vehicle?.id)
      return entity.attributes.vehicle.id;

    const state = entity.state;
    if (!state || state === "unknown" || state === "unavailable")
      return null;

    return state;
  }

  getEvccName() {
    return this.hass?.states?.[this.config.vehicle_entity]
      ?.attributes?.vehicle?.evccName;
  }

  // ---------- reactive update ----------

  updated(changed) {
    if (!changed.has("hass")) return;

    const vehicle = this.getVehicle();
    if (!vehicle) return;

    this._plans = this.collectPlans(vehicle);
  }

  // ---------- render ----------

  render() {
    const vehicle = this.getVehicle();
    const plans = this._plans || [];

    return html`
      <ha-card>
        <div class="title">Repeating Scheduler</div>

        <div id="plans">
          ${!vehicle
            ? html`<div class="info">Kein Fahrzeug ausgewählt oder nicht erkannt.</div>`
            : plans.length === 0
              ? html`<div class="info">Keine Pläne gefunden.</div>`
              : repeat(
                  plans,
                  plan => plan.index,
                  plan => html`
                    <repeating-plan-node
                      .plan=${plan}
                      .helpers=${this._helpers}
                      .hass=${this.hass}
                      .evccName=${this.getEvccName()}
                      @delete-plan=${e => this._deletePlan(e.detail)}
                    ></repeating-plan-node>
                  `
                )}
        </div>

        <button class="add-btn" @click=${this._addPlan}>
          <ha-icon icon="mdi:plus"></ha-icon>
          Plan hinzufügen
        </button>
      </ha-card>
    `;
  }

  _addPlan = () => {
    const [domain, service] = this.config.add_service.split(".");
    this.hass.callService(domain, service, {
      vehicle_id: this.getEvccName(),
      time: "07:00",
      weekdays: [1,2,3,4,5],
      soc: 80,
      active: false
    });
  };

  _deletePlan(plan) {
    const [domain, service] = this.config.delete_service.split(".");
    this.hass.callService(domain, service, {
      vehicle_id: this.getEvccName(),
      plan_index: Number(plan.index)
    });
  }
}

customElements.define("repeating-scheduler-card", RepeatingSchedulerCard);
