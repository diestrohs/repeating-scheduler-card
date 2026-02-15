
import { LitElement, html } from "https://unpkg.com/lit@2.8.0/index.js?module";
import { repeat } from "https://unpkg.com/lit@2.8.0/directives/repeat.js?module";
import { schedulerSharedStyles } from "./repeating-scheduler-styles.js";
import "./repeating-plan-node.js";

class RepeatingSchedulerCard extends LitElement {
        _getPlanPrefix(vehicle) {
          return `evcc_${vehicle}_repeating_plan_`;
        }
      // Hilfsfunktion: Escape für Regex-Sonderzeichen
      _escapeRegex(str) {
        return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
          const entity = states[id];
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
        return Object.entries(plans).sort((a, b) => Number(a[0]) - Number(b[0])).map(([index, entities]) => ({ index, entities }));
      }
    getVehicle() {
      const entity = this.hass?.states?.[this.config.vehicle_entity];
      if (!entity) return null;
      // vehicle_attribute: z.B. "vehicle.id"
      if (this.config.vehicle_attribute) {
        const path = this.config.vehicle_attribute.split(".");
        let value = entity.attributes;
        for (const key of path) {
          value = value?.[key];
        }
        if (value) return value;
      }
      // Fallback: vehicle.id
      if (entity.attributes?.vehicle?.id) {
        return entity.attributes.vehicle.id;
      }
      // Fallback: state
      const state = entity.state;
      if (!state || state === "unknown" || state === "unavailable") return null;
      return state;
    }
  static properties = {
    hass: {},
    config: {},
    _helpers: { state: false },
    _plans: { state: true }
  };

  static styles = [schedulerSharedStyles];

  constructor() {
    super();
  }

  setConfig(config) {
    // add_service und delete_service optional aus Config übernehmen, sonst Defaults
    this.config = {
      add_service: config.add_service || "evcc_scheduler.set_repeating_plan",
      delete_service: config.delete_service || "evcc_scheduler.del_repeating_plan",
      ...config
    };
  }

  getEvccName() {
    return this.hass?.states?.[this.config.vehicle_entity]?.attributes?.vehicle?.evccName;
  }

  async firstUpdated() {
    this._helpers = await window.loadCardHelpers();
  }






  updated(changed) {
    if (!changed.has("hass")) return;
    const vehicle = this.getVehicle();
    if (!vehicle) return;

    const prefix = this._getPlanPrefix(vehicle);
    const relevantIds = Object.keys(this.hass.states)
      .filter(id => id.includes(prefix))
      .sort()
      .join("|");

    if (relevantIds !== this._entityTopology) {
      this._entityTopology = relevantIds;
      this._plans = this.collectPlans(vehicle);
    }

    // re-propagate hass
    this.renderRoot.querySelectorAll("repeating-plan-node").forEach(node => {
      node.hass = this.hass;
    });
  }

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
                )
          }
        </div>
        <button
          class="add-btn"
          @click=${() => {
            const [addDomain, addService] = this.config.add_service.split(".");
            this.hass.callService(
              addDomain,
              addService,
              {
                vehicle_id: this.getEvccName(),
                time: "07:00",
                weekdays: [1,2,3,4,5],
                soc: 80,
                active: false
              }
            );
          }}
        >
          <ha-icon icon="mdi:plus"></ha-icon>
          Plan hinzufügen
        </button>
      </ha-card>
    `;
  }

  _deletePlan(plan) {
    const [delDomain, delService] = this.config.delete_service.split(".");
    this.hass.callService(
      delDomain,
      delService,
      {
        vehicle_id: this.getEvccName(),
        plan_index: Number(plan.index)
      }
    );
  }
}

customElements.define("repeating-scheduler-card", RepeatingSchedulerCard);
