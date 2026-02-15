
# Repeating Scheduler Card

Eine hochperformante, reaktive Home Assistant Custom Card für wiederkehrende Ladepläne – 100% Entity-Driven, keine Polls, keine Backend-WS nötig.

## Features
- 100% Entity-Driven: Card erkennt neue/löschte Pläne sofort (Entity-Prefix-Detection, keine Scans)
- Zero-Scan Architektur: keine Polls, keine Backend-WS, keine Events nötig
- Echtzeit-Updates: State- und Entity-Änderungen werden sofort reflektiert
- Modular: PlanNode-Komponenten, Shared Styles
- Statische, performante CSS-Styles (keine dynamische Injektion)
- Kompatibel mit HA Core Patterns (wie Energy Dashboard, Mushroom Auto Entities)

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
   # Optional für maximale Flexibilität (Standard siehe Code):
   # add_service: evcc_scheduler.set_repeating_plan
   # delete_service: evcc_scheduler.del_repeating_plan


## Release 0.0.7
- Architektur-Update: hass-Objekt wird jetzt immer korrekt an Child Cards propagiert (über updated()), unabhängig von Topologie-Änderungen
- Kein Flicker, keine unnötigen DOM-Rebuilds – UI bleibt stabil und reaktiv
- Lovelace-konformes, hass-driven Update-Pattern (wie HA-Core Cards)
- Topologie- und State-Updates sauber getrennt
- Bugfix: Child Cards werden bei Entity-Änderungen wieder zuverlässig aktualisiert

## Release 0.0.5
    ```


## Architektur & Entwicklung

- Entity-Prefix-Detection: Card prüft nur Entities mit passendem Prefix (z.B. evcc_{vehicle}_repeating_plan_), kein globaler Entity-Scan mehr
- State-Änderungen werden wie gewohnt über hass-Objekt propagiert (Home Assistant WebSocket API)
- Fahrzeugerkennung: vehicle_attribute optional, sonst Entity-State
- Hinzufügen/Löschen: Services können optional in der Config überschrieben werden (add_service, delete_service)
- Styles werden als JS-Konstanten in den Komponenten verwaltet

### Rendering-Optimierung & Flacker-Fix
Die Card ist stateless, aber die dynamisch erzeugten Card-Elemente (PlanNode) werden intern gecached und nur bei relevanter Änderung neu gebaut. Dadurch bleibt das UI stabil und performant – card_mod wird nicht unnötig neu angewendet.

## Lizenz
MIT
