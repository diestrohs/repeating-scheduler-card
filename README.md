# Repeating Scheduler Card

Eine hochperformante, reaktive Home Assistant Custom Card für wiederkehrende Ladepläne.

## Features
- Zero-Scan Architektur (keine Entity-Scans, sofortige Updates)
- WebSocket- und Event-Driven
- Modular: PlanNode-Komponenten, Shared Styles
- Statische, performante CSS-Styles (keine dynamische Injektion)
- Kompatibel mit HA Core Patterns

## Dateien
- repeating-scheduler-card.js – Hauptkomponente
- repeating-plan-node.js – PlanNode-Komponente (Child Cards)
- repeating-scheduler-styles.js – Zentrale Styles

## Installation
1. Dateien nach `config/www/repeating_scheduler/` kopieren
2. Ressource in Home Assistant einbinden:
   ```yaml
   url: /local/repeating_scheduler/repeating-scheduler-card.js
   type: module
   ```
3. Card im Dashboard hinzufügen:
   ```yaml
   type: custom:repeating-scheduler-card
    vehicle_entity: select.evcc_garage_vehicle_name
    # vehicle_attribute: vehicle.evccName # optional, falls Entity-State nicht gewünschtes Fahrzeug liefert
    pattern:
       weekdays: text.evcc_{vehicle}_repeating_plan_{index}_weekdays
       time: time.evcc_{vehicle}_repeating_plan_{index}_time
       soc: number.evcc_{vehicle}_repeating_plan_{index}_soc
       active: switch.evcc_{vehicle}_repeating_plan_{index}_active
    connection_type: scan # oder websocket
    ws_domain: evcc_scheduler
    add_service: evcc_scheduler.set_repeating_plan # scan: Service, websocket: WebSocket-API
    delete_service: evcc_scheduler.del_repeating_plan # scan: Service, websocket: WebSocket-API
   ```

## Entwicklung
- Umschaltung zwischen scan und websocket über connection_type
- Fahrzeugerkennung: vehicle_attribute optional, sonst Entity-State
- Hinzufügen/Löschen: scan → Service, websocket → WebSocket-API
- Styles werden als JS-Konstanten in den Komponenten verwaltet

## Lizenz
MIT
