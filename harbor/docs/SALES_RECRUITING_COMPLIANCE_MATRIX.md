# Sales & Recruiting Compliance Matrix

Stand: 2026-08-20
Scope: P3 Foundation, keine Rechtsberatung und keine Freigabe neuer Produkt-, Preis- oder Vergütungsclaims

## Klassifikation

- `CONFIRMED`: bestehender kanonischer Harbor-Prozess kann referenziert werden.
- `EDUCATIONAL`: allgemeiner Lerninhalt ohne Produkt-, Preis- oder Einkommensclaim.
- `REQUIRES_REVIEW`: Nutzung nur mit aktueller offizieller Quelle oder fachlicher/rechtlicher Freigabe.
- `DO_NOT_USE_AS_CLAIM`: nicht als Verkaufs- oder Recruiting-Aussage verwenden.

Die Matrix folgt dem internen Kommunikationsstandard und der konservativen Leitlinie, keine irreführenden oder aggressiven Praktiken einzusetzen. Art. 6 der [EU-Richtlinie über unlautere Geschäftspraktiken](https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A02005L0029-20220528) erfasst unter anderem irreführende Aussagen zu Produktmerkmalen, Nutzen, Risiken und erwartbaren Ergebnissen. Die konkrete rechtliche Freigabe für Märkte, Kanäle und Kampagnen bleibt separat erforderlich.

## Review-Matrix

| Quelle | Thema | Sales Claim | Income Claim | Product Claim | Health Claim | Privacy Risk | Spam Risk | Status | Academy-Verwendung | notwendige Review-Aktion |
|---|---|---:|---:|---:|---:|---:|---:|---|---|---|
| `app/lib/academy-content.js`, M06/L02 Kundenbestellung | offizieller Bestellweg | niedrig | nein | nein | nein | niedrig | niedrig | `CONFIRMED` | kanonischer operativer Abschlussweg | Prozessstand regelmäßig prüfen |
| `app/lib/academy-content.js`, M09/L02 Partnerregistrierung | Registrierung | nein | nein | nein | nein | mittel | niedrig | `CONFIRMED` | kanonischer Recruiting-Handoff | Prozess und Pflichtfelder regelmäßig prüfen |
| `03_Aqua_Global_Wissensrahmen.md` | Bedarf, Beratung, Produkt-Matching | mittel | nein | mittel | mittel | niedrig | niedrig | `EDUCATIONAL` | Beratungslogik ohne konkrete Produktdaten | technische Aussagen jeweils offiziell belegen |
| `07_Marken_und_Kommunikationsstandard.md` | Premium-Kommunikation | niedrig | mittel | niedrig | niedrig | niedrig | niedrig | `CONFIRMED` | Tonalität, keine Manipulation/Erfolgsgarantie | bei Markenänderung aktualisieren |
| `04_Partner_Academy_Roadmap.md` | Sales, Follow-up, Recruiting | niedrig | niedrig | niedrig | niedrig | niedrig | mittel | `EDUCATIONAL` | Lernarchitektur und Übergabe | operative Details nicht aus Roadmap ableiten |
| `academy-documents/private/DOC_AG_Karriere_und_Verdienstplan.pdf` | Level, Punkte, Provision | nein | hoch | nein | nein | niedrig | niedrig | `REQUIRES_REVIEW` | nur kanonischer Verweis aus M04/Earnings Engine | Version, Markt und Gültigkeit vor jeder Zahl prüfen |
| `docs/PARTNER_EARNINGS_ENGINE.md` | Vergütungsberechnung | nein | hoch | nein | nein | niedrig | niedrig | `REQUIRES_REVIEW` | Quelle für spätere Berechnungslogik, aktuell keine Werte | machine-readable offizielle Quelle fehlt |
| `docs/CAMPAIGN_CENTER_BLUEPRINT.md` | Aktionen und Bedingungen | mittel | niedrig | mittel | niedrig | mittel | mittel | `REQUIRES_REVIEW` | nur Verweis auf aktuelle Campaign-Center-Daten | Zeitraum, Zielgruppe, Preis und Freigabe prüfen |
| Leonid OS `PREPARE_FOLLOW_UP` / Approval-Muster | Follow-up-Entwurf | mittel | niedrig | niedrig | niedrig | hoch | hoch | `EDUCATIONAL` | Draft-only-Prinzip und menschliche Freigabe | keine Automation oder Nachricht aus P3 auslösen |
| Water Business Blueprint 2026 | Closing, Einkommen, Freiheit | hoch | hoch | mittel | mittel | hoch | mittel | `DO_NOT_USE_AS_CLAIM` | keine direkte Veröffentlichung | PII entfernen, vollständig redaktionell und rechtlich prüfen |
| „Vorteile einer Partnerschaft mit Aqua-global“ | Lifestyle-/Recruiting-Argumente | mittel | hoch | niedrig | niedrig | niedrig | mittel | `DO_NOT_USE_AS_CLAIM` | nur historische Referenz | Rechte, Aktualität und sämtliche Erfolgsclaims prüfen |
| historische Aqua-Geschäftspräsentationen | Business und Produktnutzen | hoch | hoch | hoch | hoch | niedrig | mittel | `DO_NOT_USE_AS_CLAIM` | keine direkte Academy-Nutzung | aktuelle offizielle Ersatzquelle erforderlich |
| kurze P3-Beispieltexte | Kunden-/Recruiting-Kontakt | mittel | niedrig | nein | nein | mittel | hoch | `EDUCATIONAL` | individueller Entwurf, nicht versendet | Einwilligung, Kontext, Kanal und Stop-Regel beachten |

## Verbindliche Grenzen

- Preise, Provisionen, Level, Aktionsbedingungen und konkrete Berechnungen: `OFFICIAL_SOURCE_REQUIRED`.
- Einkommensgarantien, Erfolgsquoten und Lifestyle-Garantien: `DO_NOT_USE_AS_CLAIM`.
- Produkt- und Gesundheitsclaims bleiben in den kanonischen Produkt-/Wasserbereichen und brauchen ihre jeweilige Freigabe.
- WhatsApp- und Social-Kontakt in P3 ist nur als individueller Textentwurf dargestellt. Keine Automation, kein Versand, keine Kontaktliste.
- Ein Nein, fehlende Antwort oder Widerruf des Interesses beendet das Follow-up.

## Offene Reviews

1. Aktuelle Markt-/Versionsfreigabe des Karriere- und Verdienstplans.
2. Machine-readable offizielle Quelle für Provisionen, Punkte und Level.
3. Kanal- und länderspezifische Prüfung von Direktansprache und Follow-up.
4. Freigegebene Sales-Scripts mit realen, aktuellen Produkt- und Prozessbeispielen.
5. Freigabefähige Recruiting-Checkliste als späterer Download.
