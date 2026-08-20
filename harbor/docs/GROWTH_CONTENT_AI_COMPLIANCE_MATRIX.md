# Growth Content & AI Compliance Matrix

Stand: 20. August 2026
Scope: P4 Growth Content & AI Tools Foundation
Grundsatz: KI erzeugt Entwürfe. Die jeweils kanonische, freigegebene Harbor-Quelle entscheidet über Fakten und Claims.

## Status- und Sichtbarkeitsmodell

- Content-Status: `READY`, `READY_WITH_REVIEW`, `EDUCATIONAL`, `REFERENCE_ONLY`, `NEEDS_REWORK`, `NEEDS_COMPLIANCE_REVIEW`, `DUPLICATE`, `NOT_PARTNER_RELEVANT`
- Sichtbarkeit: `PARTNER_SAFE`, `INTERNAL_ONLY`, `ADMIN_ONLY`, `OFFICIAL_SOURCE_REQUIRED`
- `READY` bedeutet in dieser Matrix wiederverwendbar innerhalb des dokumentierten Scopes, nicht automatisch rechtlich oder fachlich für jeden Markt freigegeben.
- `OFFICIAL_SOURCE_REQUIRED` verhindert, dass fehlende Produkt-, Aktions- oder Vergütungsdaten durch KI ergänzt werden.

## Review-Matrix

| Source | Content Cluster | Partner Relevance | Product Claim Risk | Health Claim Risk | Income Claim Risk | Copyright Risk | Privacy Risk | AI Hallucination Risk | Status | Academy Usage | Review Needed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `05_Content_Factory_Standard.md` | Content Factory und Kurzvideo-Workflow | Hoch | Mittel | Mittel | Mittel | Niedrig, eigene Arbeitsgrundlage | Niedrig | Mittel | READY / PARTNER_SAFE | Vereinfachter Workflow, Content-Pillars, Qualitätsprüfung | Konkrete Fakten immer aus kanonischer Quelle |
| `07_Marken_und_Kommunikationsstandard.md` | Premium-Ton, mobile-first, klare CTA | Hoch | Niedrig | Niedrig | Mittel | Niedrig, eigene Arbeitsgrundlage | Mittel | Niedrig | READY / PARTNER_SAFE | Schreib- und Produktionsprinzipien | Persönliche Informationen sparsam verwenden |
| `docs/ACADEMY_PRODUCTION_STUDIO.md` | Smartphone, Licht, Ton, Bild, Freigabe | Hoch | Mittel | Mittel | Niedrig | Mittel | Mittel | Mittel | READY_WITH_REVIEW / PARTNER_SAFE | Vereinfachte Produktionslektion | Professionelle interne Details nicht vollständig übernehmen |
| `02_MASTER_INSTRUCTIONS.txt` | Strategische Arbeits- und Prompt-Prinzipien | Mittel | Mittel | Mittel | Mittel | Niedrig | Hoch | Mittel | REFERENCE_ONLY / INTERNAL_ONLY | Nur abstrakte Prompt-Grundstruktur | Keine internen Ziele, Rollen, Portfoliodaten oder private Angaben veröffentlichen |
| Content Factory Masterprompt/Workflow | Wiederverwendbare Promptlogik | Hoch | Mittel | Mittel | Mittel | Mittel | Mittel | Hoch | READY_WITH_REVIEW / PARTNER_SAFE | Kuratierte, neu formulierte Partner-Templates | Keine vollständige interne Masterprompt-Sammlung kopieren |
| Aqua Product Intelligence | Produktbezogene Content-Unterstützung | Hoch | Hoch | Hoch | Niedrig | Mittel | Niedrig | Hoch | READY_WITH_REVIEW / OFFICIAL_SOURCE_REQUIRED | Nur Workflow „Quelle → Entwurf → Prüfung“ | Modul 3/P2 bleiben Faktenquelle; keine unbekannten Daten ergänzen |
| `docs/MEDIA_CENTER_BLUEPRINT.md` | Freigegebene Assets und externe Materialpflege | Hoch | Mittel | Mittel | Niedrig | Hoch | Mittel | Mittel | READY / PARTNER_SAFE | Media Center als kanonische Asset-Grenze | Rechte, Version und Freigabestatus vor Nutzung prüfen |
| `docs/CAMPAIGN_CENTER_BLUEPRINT.md` | Aktionen und zeitabhängige Kampagnen | Hoch | Hoch | Mittel | Mittel | Mittel | Niedrig | Hoch | READY / PARTNER_SAFE | Campaign Center als alleinige aktuelle Aktionsquelle | Keine Preise, Rabatte oder Laufzeiten in Prompts hardcoden |
| P1 Produktlektionen / Modul 3 | Bestätigte Produktgrundlagen | Hoch | Hoch | Mittel | Niedrig | Mittel | Niedrig | Mittel | READY / OFFICIAL_SOURCE_REQUIRED | Verlinkte Faktenquelle für Produktcontent | Produktdaten nicht im P4-Lernpfad duplizieren |
| P2 Water Knowledge | RO, PPM/TDS, H₂O, H₂, Elektrolyte | Hoch | Hoch | Hoch | Niedrig | Mittel | Niedrig | Hoch | READY / OFFICIAL_SOURCE_REQUIRED | Verlinkte Fakten- und Compliance-Quelle | Hydrogen Bottle bleibt `OFFICIAL_SOURCE_REQUIRED` |
| P3 Sales & Recruiting | Beratung, Follow-up, Business-Kommunikation | Hoch | Mittel | Mittel | Hoch | Niedrig | Hoch | Mittel | READY / PARTNER_SAFE | Verlinkte Kommunikationsgrundlage | Keine Income Claims, aggressive Ansprache oder Spam |
| Historische Wasser-/H₂-Unterlagen | Alte technische und gesundheitliche Aussagen | Niedrig bis mittel | Hoch | Hoch | Niedrig | Hoch | Niedrig | Hoch | NEEDS_COMPLIANCE_REVIEW / REFERENCE_ONLY | Keine direkte Veröffentlichung | Fachliche, rechtliche, Rechte- und Versionsprüfung erforderlich |
| Externe PDFs, Books, Slides, Screenshots | Beispiele und Recherche | Variabel | Variabel | Variabel | Variabel | Hoch | Mittel | Hoch | REFERENCE_ONLY | Nur abstrahierte eigene Lernprinzipien | Nutzungsrecht und Quellenqualität einzeln prüfen |
| Leonid OS technische Agents/Approval-Code | Interne Entwickler- und Automationslogik | Niedrig | Mittel | Mittel | Mittel | Niedrig | Hoch | Mittel | NOT_PARTNER_RELEVANT / INTERNAL_ONLY | Nicht in Partner-Academy integrieren | Sicherheits-, System- und Implementierungsdetails intern halten |
| Growth Center Platzhalter | Anwendung, Hubs und spätere Workflows | Hoch | Mittel | Mittel | Mittel | Niedrig | Niedrig | Mittel | NEEDS_REWORK / PARTNER_SAFE | P4-Lernpfad ergänzt vorhandenen Bereich modular | Persistenz, Automation und externe Integrationen bleiben außerhalb P4 |

## Verbindliche Claim-Grenzen

P4 darf keine Daten oder Aussagen erzeugen beziehungsweise freigeben zu:

- Preisen, Rabatten, Aktionszeiträumen oder Bestellbedingungen;
- Produktleistung, Zertifikaten oder technischen Werten ohne aktuelle offizielle Quelle;
- Heilung, Diagnose, Therapie, Entgiftung oder garantierten Gesundheitswirkungen;
- Provisionen, Karriereleveln, konkreten Einkommensbeispielen oder Erfolgsgarantien;
- Fake-Testimonials, künstlicher Verknappung, kopierten Hooks oder fremder Markenidentität.

## Datenschutz und Copyright

- Keine Kunden-, Partner-, Kontakt-, Gesprächs- oder Accountdaten in Prompt-Vorlagen einfügen.
- Beispiele werden abstrahiert; echte Namen, Nachrichten und Screenshots benötigen eine eigene Rechtsgrundlage und Freigabe.
- Media Center bleibt der kanonische Ort für freigegebene Assets. P4 erzeugt keine zweite Asset-Bibliothek.
- Fremde Bücher, PDFs, Trainings, Social Posts und Prompt-Sammlungen werden nicht vollständig kopiert.

## Offene Reviews

- Markt- und länderspezifische Prüfung für Direktmarketing, Einwilligung und elektronische Ansprache.
- Nutzungsrechte einzelner historischer oder externer Medien.
- Offizielle, aktuelle Produktdaten für jede konkrete Produktvorlage.
- Fachliche und rechtliche Freigabe künftiger Hydrogen-Bottle-Inhalte.
- Freigabe echter Testimonials und Social-Proof-Materialien.
