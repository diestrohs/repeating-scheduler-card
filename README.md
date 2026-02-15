## Abhängigkeiten

Diese Card benötigt folgende Custom Cards, die separat installiert werden müssen:

- **[multiselect-dropdown](https://github.com/rogro82/hass-custom-multiselect-dropdown)**
    - Für die Auswahl der Wochentage (`custom:multiselect-dropdown`)
- **[time-spinner-card](https://github.com/amaximus/time-spinner-card)**
    - Für die Zeitauswahl (`custom:time-spinner-card`)
- **[card-mod](https://github.com/thomasloven/lovelace-card-mod)**
    - Für individuelles Styling der Subcards
- **Home Assistant Core Tile Card** (ab 2023.11, für SoC/Schalter)
    - Wird für SoC und Aktiv-Status verwendet (`type: tile`)

**Installation:**
1. Die oben genannten Custom Cards gemäß deren Dokumentation installieren (meist via HACS oder manuell in `config/www/`)
2. Home Assistant neustarten und ggf. Ressourcen im Frontend einbinden
3. Erst dann die Repeating Scheduler Card wie oben beschrieben einbinden



# Repeating Scheduler Card

Visualisiert und verwaltet die Ladepläne des [evcc_scheduler](https://github.com/diestrohs/evcc_scheduler) in Home Assistant. Die Card zeigt alle Pläne an, ermöglicht deren Bearbeitung und Löschen – und steuert damit indirekt die Weitergabe der Pläne an [evcc](https://github.com/evcc-io/evcc) über den evcc_scheduler.

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

## Release 0.0.5
- Neue Pläne werden jetzt standardmäßig als inaktiv (active: false) angelegt
- PlanNode und Scheduler-Card reagieren nur noch auf relevante Entity-Änderungen (maximale Performance, kein Flicker)
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
