# Sales & Recruiting Foundation Blueprint

Stand: 2026-08-20
Status: P3 vorbereitet, vor Production-Release

## Ziel und Ist-Zustand

Der Content-Harvest identifizierte einen `PARTIAL` Sales-Bereich und einen `LOW` Recruiting-Bereich. Kanonisch vorhanden waren der offizielle Bestellprozess in M06/L02 und der Registrierungsprozess in M09/L02. Produktwissen, Wasserwissen, Campaign Center, Karriereplan, Earnings Engine und P0 Partnerstart existieren bereits an eigenen Stellen.

P3 ergänzt deshalb keine parallele Academy. Es erweitert:

- Modul 6 `Verkaufssystem` um sieben anwendungsorientierte Content-Lektionen.
- Modul 9 `Partneraufbau` um fünf seriöse Recruiting-Lektionen.
- Bestehende Videos, Quizzuordnungen, Navigation und Progress bleiben unverändert.

## Quellenbasis

| Quelle | Einordnung | Verwendung |
|---|---|---|
| Academy Content Registry / Gap Analysis / Ready Content Plan | kanonisches Audit | Scope, Deduplikation, Risikostatus |
| Aqua Global Wissensrahmen | `READY_WITH_REVIEW` | Bedarf, Produkt-Matching, Quellenpflicht |
| Marken- und Kommunikationsstandard | `READY` | Premium, klar, nicht manipulativ |
| Partner Academy Roadmap | `READY` | Sales-/Recruiting-Zielstruktur |
| Kundenbestellung und Partnerregistrierung | `READY_WITH_REVIEW` | bestehende operative Prozesse |
| Karriere-/Verdienstplan | `REQUIRES_REVIEW` | nur Verweis, keine Zahlenkopie |
| Leonid OS Follow-up-/Approval-Muster | `DRAFT` / selektiv | Entwurf statt automatischem Versand |
| Water Business Blueprint / Partnerschaftsvorteile / historische Präsentationen | `DO_NOT_USE_AS_CLAIM` | nur Risikoreferenz, nicht veröffentlicht |

## Sales-Pfad in Modul 6

1. `sales-needs` – Bedarf richtig verstehen.
2. `sales-match` – Vom Bedarf zur passenden Lösung.
3. `sales-presentation` – Produkte einfach und professionell präsentieren.
4. `sales-objections` – Einwände respektvoll behandeln.
5. `sales-close` – Professionell zum Abschluss führen.
6. `sales-follow-up` – Nachfassen ohne zu nerven.
7. `sales-referrals` – Empfehlungen professionell erhalten.

Das bestehende Kundenbestellvideo bleibt der einzige operative Bestellweg. P3 enthält weder Preis noch Rabattcode-Wert oder Aktionsbedingung.

### Kompaktes Playbook

`Zuhören → Verstehen → Passende Lösung → Erklären → Entscheidung → Nachfassen`

Das Playbook ist didaktisch; es ist kein automatisierter Funnel und keine aggressive Closing-Methode.

## Recruiting-Pfad in Modul 9

1. `recruiting-foundations` – Partnerschaft seriös erklären.
2. `recruiting-outreach` – Menschen professionell ansprechen.
3. `recruiting-business` – Geschäftsmöglichkeit verständlich erklären.
4. `recruiting-objections` – Recruiting-Einwände respektvoll behandeln.
5. `recruiting-handoff` – Vom Interesse zum Partnerstart.

Das bestehende Registrierungs­video bleibt kanonisch. Nach Freigabe führt der Pfad in den bestehenden P0-Partnerstart und zum vorhandenen Leader-Hinweis.

### Kompaktes Playbook

`Kontakt → Interesse verstehen → Erklären → Fragen klären → Einladen → Onboarding`

Die Einladung bleibt freiwillig. Ein Nein wird respektiert.

## Scripts und WhatsApp

P3 enthält nur zwei kurze, übersetzte Beispiele:

- individuelles Kunden-Follow-up;
- individuelle Recruiting-Erstansprache.

Beide sind Entwürfe. Es gibt keinen Versand, keine WhatsApp-Integration, keine Automation, keine Kontaktliste und keine neue personenbezogene Datenerfassung. Eine vollständige Prompt-/Script-Bibliothek gehört später in Growth Center oder Downloads; das WhatsApp-KI-Agent-Modul bleibt ein eigener Sprint.

## Praxisaufgaben

Jede neue Lektion enthält genau eine kompakte UI-only-Aufgabe. Beispiele sind Bedarfsfragen, eine 60-Sekunden-Erklärung, Einwandübungen, Follow-up-Entwurf und Handoff-Checkliste. Aufgaben werden nicht gespeichert und verändern den kanonischen Fortschritt nicht.

## Compliance

- keine aggressive oder manipulative Verkaufssprache;
- keine Einkommens-, Erfolgs- oder Lifestyle-Garantie;
- keine erfundenen Preise, Provisionen, Level oder Aktionsbedingungen;
- keine neuen Produkt- oder Gesundheitsclaims;
- keine künstliche Verknappung;
- keine Massenansprache, kein Spam und keine Nachricht ohne passenden Kontext;
- aktuelle offizielle Quellen haben Vorrang.

Die dokumentarische Klassifikation lautet `CONFIRMED`, `EDUCATIONAL`, `REQUIRES_REVIEW` oder `DO_NOT_USE_AS_CLAIM`. Sie erzeugt keine Datenbank- oder Freigabelogik.

## Deduplikation

| Inhalt | Kanonischer Ort | P3-Verhalten |
|---|---|---|
| Produktdaten und Bedienung | Modul 3 / Product Quick Wins | nur referenzieren |
| Wasser- und Health-Claim-Grenzen | P2 Water Knowledge | nur referenzieren |
| aktuelle Aktionen | Campaign Center | nur referenzieren |
| Punkte, Level und Provision | M04 / Earnings Engine | nur referenzieren |
| Registrierung | M09/L02 | unverändert verwenden |
| Partnerstart | P0 24h/7-Tage | Handoff, keine Kopie |
| Follow-up-Übersicht | Success Center | keine CRM-/Task-Duplikation |

## Mobile und Accessibility

- eine aktive Lektion, dann Schritte, Do/Don't, optionales Beispiel, Quelle und Praxisaufgabe;
- einspaltig auf kleinen Screens, zweispaltige Karten erst ab `sm`/`md`;
- `min-w-0`, `break-words` und keine feste horizontale Breite;
- semantische `section`, `article`, `aside`, Überschriften und Listen;
- Status nicht nur über Farbe, sondern als Textbadge;
- Icons sind dekorativ mit `aria-hidden`.

## Quiz und spätere Downloads

`QUIZ_TODO`: Beratung erster Schritt, Umgang mit Preiseinwand, Einkommensgarantie, respektvolles Follow-up und Registrierungs-Handoff. Die bestehende Zertifikats-/Quizlogik wird in P3 nicht verändert.

Fehlende spätere Assets:

- freigegebene Sales-Checkliste;
- freigegebene Recruiting-Checkliste;
- aktuelle Rollen-/Vergütungs-FAQ;
- echte DE/EN Sales- und Recruiting-Videos;
- geprüfte Script-Bibliothek für Growth Center;
- rechtlich/fachlich freigegebene marktbezogene Kommunikationsrichtlinie.

## Rollback

P3 besteht aus Content-Katalog-Metadaten, einer kleinen UI-Komponente, DE/EN-Copy, Dokumentation und Tests. Ein Rollback entfernt diese P3-Dateien beziehungsweise den P3-Commit; vorhandene Bestell-/Registrierungsvideos und alle kanonischen Bereiche bleiben bestehen.
