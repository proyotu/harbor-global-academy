# Partner Execution Task Matrix

Alle P5-Aufgaben besitzen eine eindeutige Quelle. `UI_ONLY` bedeutet, dass kein Status gespeichert und kein Abschluss vorgetäuscht wird.

| Task ID | Source | Category | Partner Stage | Priority | Existing Source | Persistence | Visible Location | Duplicate Risk | Status | Future Automation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| practice-product-60 | P1_PRODUCT | product | Grundlagen | NORMAL | Modul 3 | UI_ONLY | Success Center / Praxis | niedrig, nur Anwendung | READY | execution.task.completed |
| practice-product-benefits | P1_PRODUCT | product | Grundlagen | NORMAL | Modul 3 | UI_ONLY | Success Center / Praxis | niedrig, keine Faktenkopie | READY | execution.task.completed |
| practice-water-ppm | P2_WATER | water | Grundlagen | NORMAL | M10/L02 + P2 | UI_ONLY | Success Center / Praxis | niedrig, nur Erklärung üben | READY | execution.task.completed |
| practice-water-h2 | P2_WATER | water | Grundlagen | NORMAL | P2 Water Knowledge | UI_ONLY | Success Center / Praxis | niedrig, keine Claims | READY | execution.task.completed |
| practice-sales-needs | P3_SALES | sales | Aufbau | NORMAL | P3 Sales | UI_ONLY | Success Center / Praxis | mittel, P3 bleibt Lernquelle | READY | execution.task.completed |
| practice-sales-objection | P3_SALES | sales | Aufbau | NORMAL | P3 Sales | UI_ONLY | Success Center / Praxis | mittel, P3 bleibt Lernquelle | READY | execution.task.completed |
| practice-recruiting-outreach | P3_RECRUITING | recruiting | Aufbau | NORMAL | P3 Recruiting | UI_ONLY | Success Center / Praxis | mittel, keine Script-Kopie | READY | execution.task.completed |
| practice-content-hook | P4_CONTENT | content | Wachstum | NORMAL | P4 Growth | UI_ONLY | Success Center / Praxis | mittel, P4 bleibt Lernquelle | READY | execution.task.completed |
| practice-content-reel | P4_CONTENT | content | Wachstum | NORMAL | P4 Growth | UI_ONLY | Success Center / Praxis | mittel, keine Template-Kopie | READY | execution.task.completed |
| practice-content-status | P4_CONTENT | content | Wachstum | NORMAL | P4 Growth | UI_ONLY | Success Center / Praxis | mittel, keine Automation | READY | execution.task.completed |
| weekly-learning | SYSTEM | learning | alle | HIGH | Academy Progress | DERIVED | Success Center / Woche | niedrig | READY | execution.week.started |
| weekly-customer | P3_SALES | customer | Aufbau | NORMAL | P3 Sales | UI_ONLY | Success Center / Woche | niedrig | READY | execution.week.completed |
| weekly-follow-up | P3_SALES | follow-up | Aufbau | NORMAL | P3 Sales | UI_ONLY | Success Center / Woche | mittel, kein CRM | READY | execution.week.completed |
| weekly-content | P4_CONTENT | content | Wachstum | NORMAL | P4 Growth | UI_ONLY | Success Center / Woche | mittel | READY | execution.week.completed |
| weekly-support | LEADER | team | alle | LOW | bestehende Leader-Struktur | DERIVED | Success Center / Woche | niedrig | READY_WITH_REVIEW | execution.support.requested |

## Next-Action-Regeln

| Rule ID | Source | Bedingung | Ziel | Priorität | Persistenz |
| --- | --- | --- | --- | --- | --- |
| continue-onboarding | P0_ONBOARDING | Onboarding offen | Partnerstart | HIGH | vorhandene Daten, keine P5-Schreiboperation |
| start-product-practice | P1_PRODUCT | Produktbereich nicht erreicht | Module | HIGH | keine |
| continue-academy | SYSTEM | Academy unter 100 % | Module | HIGH | kanonischer Academy-Fortschritt |
| apply-sales | P3_SALES | Academy abgeschlossen | Module | NORMAL | keine |
| create-content | P4_CONTENT | Fallback | Growth Center | NORMAL | keine |

## Nicht implementiert

- keine Task-Tabelle, API oder Migration;
- keine selbst definierte Gesamtpunktzahl;
- keine neue Streak-Logik;
- keine Kontakt- oder CRM-Speicherung;
- keine automatischen Nachrichten;
- keine personenbezogene Leader-Bewertung.
