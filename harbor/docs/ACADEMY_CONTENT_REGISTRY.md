# Harbor Global Partner Academy – Content Registry

Stand: 2026-08-13
Registry-Version: 1.0 (Audit, nicht veröffentlicht)

## Statusdefinitionen

Zulässige Statuswerte: `READY`, `READY_WITH_REVIEW`, `DRAFT`, `REFERENCE_ONLY`, `NEEDS_TRANSLATION`, `NEEDS_COMPLIANCE_REVIEW`, `NEEDS_CONTENT_REWORK`, `DUPLICATE`, `ARCHIVE_CANDIDATE`.

`READY` bedeutet in dieser Registry „inhaltlich als Integrationsquelle geeignet“, nicht „ohne normalen Release-Prozess live schalten“. Bei `READY_WITH_REVIEW` ist die konkrete fachliche/operative Review klein und benannt. `REFERENCE_ONLY` darf nicht vollständig in die Academy übernommen werden.

## Quellen- und Inhaltsregister

| Content-ID | Titel | Quelle / Projekt / Dateipfad | Typ | Sprache | Thema und Kurzbeschreibung | Status |
|---|---|---|---|---|---|---|
| HAR-VID-001 | Willkommensvideo-Slot | Harbor / `app/lib/academy-content.js` / `welcome-video` | Video-Placeholder | DE/EN/RU/RO UI | Einstiegsvideo fehlt physisch | DRAFT |
| HAR-VID-002 | Wasser ist Leben | Harbor / `academy-videos/private/wasser-ist-leben.mp4` | Video | DE | Wasser-Grundlagen | NEEDS_COMPLIANCE_REVIEW |
| HAR-VID-003 | Allgemeine Ernährungsweise | Harbor / `academy-videos/private/allgemeine-ernaehrungsweise.mp4` | Video | DE | Ernährungskontext | NEEDS_COMPLIANCE_REVIEW |
| HAR-VID-004 | Funktionen von Wasser im Körper | Harbor / `academy-videos/private/funktionen-von-wasser-im-koerper.mp4` | Video | DE | Körperfunktionen und Wasser | NEEDS_COMPLIANCE_REVIEW |
| HAR-VID-005 | Mineralien | Harbor / `academy-videos/private/mineralien.mp4` | Video | DE | Mineralien im Wasser | NEEDS_COMPLIANCE_REVIEW |
| HAR-VID-006 | Grenzwerte | Harbor / `academy-videos/private/grenzwerte.mp4` | Video | DE | Grenzwerte und Einordnung | NEEDS_COMPLIANCE_REVIEW |
| HAR-VID-007 | Umkehrosmose / Membranfilterfeinheit | Harbor R2 / `umkehrosmose-erklaerung` | Video | DE | kanonische M03/L02-Erklärung | READY |
| HAR-VID-008 | Kundenbestellung | Harbor / `academy-videos/private/kundenbestellung.mp4` | Video | DE | offizieller Bestellprozess | READY_WITH_REVIEW |
| HAR-VID-009 | Partnerregistrierung | Harbor / `academy-videos/private/partnerregistrierung.mp4` | Video | DE | operativer Registrierungsprozess | READY_WITH_REVIEW |
| HAR-VID-010 | PPM/TDS Aussagegrenzen | Harbor R2 / `ppm-bedeutung` | Video | DE | kanonische M10/L02-Erklärung | READY |
| HAR-VID-011 | Membranfilter vs. Filterkanne | Harbor / `academy-videos/private/membranfilter-vs-filterkanne.mp4` | Video | DE | Demonstrationsvergleich | READY_WITH_REVIEW |
| HAR-VID-012 | Tee-Test | Harbor / `academy-videos/private/tee-test.mp4` | Video | DE | Praxisdemonstration | READY_WITH_REVIEW |
| HAR-VID-013 | Basilikum-Test | Harbor / `academy-videos/private/basilikum-test.mp4` | Video | DE | Langzeitvergleich | READY_WITH_REVIEW |
| HAR-VID-014 | Farbtest | Harbor / `academy-videos/private/farbtest.mp4` | Video | DE | kurze Demonstration | READY_WITH_REVIEW |
| HAR-VID-015 | Farbtest Erklärung | Harbor / `academy-videos/private/farbtest-erklaerung.mp4` | Video | DE | Einordnung des Farbtests | READY_WITH_REVIEW |
| HAR-VID-016 | RXT-Schulungsvideo-Slot | Harbor / `app/lib/academy-content.js` / `rxt-video` | Video-Placeholder | DE/EN/RU/RO UI | Video zu RXT fehlt | DRAFT |
| HAR-VID-017 | Untertischanlage: Bedienung, Flush, Reset, Wartung | Harbor Batch / `academy-videos/DE-untertischanlage-bedienung-flush-reset-wartung-approved-v1-20260805.mp4` | Video | DE | Basic-/Untertisch-Praxis | READY_WITH_REVIEW |
| HAR-VID-018 | Mini Touch: Aufbau und Wassertank | Harbor Batch / `academy-videos/DE-mini-touch-aufbau-wassertank-bedienung-approved-v1-20260805.mp4` | Video | DE | Geräteaufbau | READY_WITH_REVIEW |
| HAR-VID-019 | Mini Touch: Filterwechsel und Wartung | Harbor Batch / `academy-videos/DE-mini-touch-filterwechsel-filterstatus-wartung-approved-v1-20260805.mp4` | Video | DE | Service-/Wartungsprozess | READY_WITH_REVIEW |
| HAR-VID-020 | Mini Touch: Touchdisplay und Wasserausgabe | Harbor Batch / `academy-videos/DE-mini-touch-touchdisplay-wasserausgabe-approved-v1-20260805.mp4` | Video | DE | Bedienung | READY_WITH_REVIEW |
| HAR-VID-021 | Sparkling Pro: Bedienung und Systemaufbau | Harbor Batch / `academy-videos/DE-sparkling-pro-bedienung-wasserausgabe-systemaufbau-approved-v1-20260812.mp4` | Video | DE | Produktbedienung | READY_WITH_REVIEW |
| HAR-VID-022 | früherer PPM-Kandidat | Harbor Batch / `academy-videos/Mxx-Lxx-DE-ppm-wert-bedeutung-approved-v1-20260801.mp4` | Video | DE | bild-/audioidentisch zum ausgewählten Kandidaten | DUPLICATE |
| HAR-PDF-001 | Your World Produktkatalog | Harbor / `academy-documents/private/DOC_MA_Your_World.pdf` | PDF | DE | Produkte, Wasseraufbereitung, Nutzenclaims | NEEDS_COMPLIANCE_REVIEW |
| HAR-PDF-002 | Präsentation Wasser | Harbor / `academy-documents/private/DOC_MA_Praesentation_Wasser.pdf` | PDF | DE | Wasser, Körper, Filterung | NEEDS_COMPLIANCE_REVIEW |
| HAR-PDF-003 | RXT-Schulung | Harbor / `academy-documents/private/DOC_MA_Praesentation_RXT.pdf` | PDF | DE | hartes Wasser, Verfahren, Inbetriebnahme/Wartung | READY_WITH_REVIEW |
| HAR-PDF-004 | Kundenpreisliste 01.03.2026 | Harbor / `academy-documents/private/DOC_AG_Kunden_Preisliste.pdf` | PDF | DE | aktuelle Kundenpreise | READY_WITH_REVIEW |
| HAR-PDF-005 | Karriere- und Verdienstplan 01.03.2026 | Harbor / `academy-documents/private/DOC_AG_Karriere_und_Verdienstplan.pdf` | PDF | DE | Level, Punkte, Provision | READY_WITH_REVIEW |
| HAR-PDF-006 | Partnerpreislisten-Bundle | Harbor / fünf `DOC_AG_Vertriebspartner_*`-PDFs | PDF-Set | DE | Wasserbar, Filter, Membranen, Zubehör, Drops/Vitamine | READY_WITH_REVIEW |
| EXT-PDF-001 | Water Business Blueprint 2026 | Water Blueprint / `water_business_blueprint_FULL.pdf` | PDF/Guide | DE/EN | 48h-Onboarding, Closing, Jahresarchitektur | NEEDS_CONTENT_REWORK |
| EXT-PDF-002 | Info Leitungswasser | Telegram / `InfoLeitungswasser.pdf` | PDF/Book | DE | historischer Wasser-/Gesundheitsbericht | NEEDS_COMPLIANCE_REVIEW |
| EXT-PDF-003 | Vorteile einer Partnerschaft | Telegram / `Vorteile einer Partnerschaft mit Aqua-global.pdf` | PDF | DE | Recruiting-/Lifestyle-/Einkommensargumente | NEEDS_COMPLIANCE_REVIEW |
| EXT-PDF-004 | Aqua Geschäftspräsentation 2023 | Telegram / `Praesentation-aqua-global-2023-3.pdf` | PDF/Deck | DE | Wasser und Geschäftspräsentation | DUPLICATE |
| EXT-PPT-001 | Aqua Präsentationsquellen 2024 | Downloads / vier `Präsentation Aqua Global*.pptx` | Präsentations-Set | DE | 80–84 Slides, überwiegend bildbasiert | REFERENCE_ONLY |
| EXT-PDF-005 | Flexible-Touch-Leihvertrag | Telegram / `Leihvertrag_Flexible_Touch.pdf` | PDF/Vorlage | DE | operativer Vertrag | REFERENCE_ONLY |
| GPT-DOC-001 | Partner Academy Roadmap | GPT Pack / `04_Partner_Academy_Roadmap.md` | Roadmap | DE | Rollen, Module, Erfolgskriterien | READY |
| GPT-DOC-002 | Aqua Global Wissensrahmen | GPT Pack / `03_Aqua_Global_Wissensrahmen.md` | Guide | DE | Produktdaten-Schema und sichere Beratung | READY_WITH_REVIEW |
| GPT-DOC-003 | Content Factory Standard | GPT Pack / `05_Content_Factory_Standard.md` | SOP | DE | Hook, Skript, Visual, CTA, KPI | READY |
| GPT-DOC-004 | Marken- und Kommunikationsstandard | GPT Pack / `07_Marken_und_Kommunikationsstandard.md` | Guide | DE | Premium, mobile-first, klare Kommunikation | READY |
| GPT-DOC-005 | Business Snapshot und KPI-Register | GPT Pack / `02_Business_Snapshot_und_KPIs.md` | KPI-Guide | DE | Vertrieb, Aktivierung, Content, Systeme | READY_WITH_REVIEW |
| GPT-DOC-006 | Operating Rules und Backlog | GPT Pack / `08_Operating_Rules_und_Backlog.md` | SOP | DE | Fokus, Priorität, DoD, Review | READY |
| GPT-PRM-001 | Leonid OS Master Instructions | GPT Pack / `02_MASTER_INSTRUCTIONS.txt` | Masterprompt | DE | Unternehmens-/Arbeitsrouting | REFERENCE_ONLY |
| GPT-PRM-002 | Master Instructions kompakt | GPT Pack / `02_MASTER_INSTRUCTIONS_KOMPAKT_UNTER_8000.txt` | Masterprompt | DE | abgeleitete Kurzfassung | DUPLICATE |
| GPT-PRM-003 | Content Factory Workflow | GPT ZIP / `skills/leonid-content-factory/SKILL.md` | Prompt-Workflow | DE | Content-Paket von Ziel bis KPI | READY |
| GPT-PRM-004 | Aqua Product Intelligence | GPT ZIP / `skills/aqua-product-intelligence/SKILL.md` | Prompt-Workflow | DE | Produktwissen prüfen und strukturieren | READY_WITH_REVIEW |
| GPT-PRM-005 | Business Opportunity Audit | GPT ZIP / `skills/leonid-business-opportunity-audit/SKILL.md` | Prompt-Workflow | DE | GO/PILOT/PARKEN/STOPP-Scorecard | READY |
| GPT-GDE-001 | GPT Installationshandbuch | GPT Pack / `Leonid_OS_GPT_Installationshandbuch_V1.docx` | DOCX/Guide | DE | Custom-GPT-Setup, Tests, Workflows | REFERENCE_ONLY |
| GPT-DOC-007 | Leonid AI Automation Projektprofil | GPT Pack / `09_Leonid_AI_Automation_Projektprofil.md` | Projektprofil | DE | AI-Assistenten, Leads, Follow-up, CRM | REFERENCE_ONLY |
| LOS-BLP-001 | Leonid OS Master Blueprint | Leonid OS / `LEONID_OS_MASTER_BLUEPRINT_V1.md` | Blueprint | DE | Priorisierung, Agenten, Approval, Systemdesign | REFERENCE_ONLY |
| LOS-AI-001 | Lead Intelligence und Follow-up-Drafts | Leonid OS / `src/agents/registry.ts`, `src/approval/*` | Pattern | DE | Lead-Priorisierung und Draft-only Follow-up | DRAFT |
| LOS-AI-002 | Approval-/Risk-Muster | Leonid OS / `src/approval/engine.ts`, `docs/REALTIME_SECURITY.md` | SOP/Pattern | DE | Freigabestufen und sichere Grenzen | READY_WITH_REVIEW |
| LOS-AI-003 | Realtime-/Voice-Architektur | Leonid OS / `docs/VOICE_ARCHITECTURE.md` | Technical Guide | DE | sichere Voice-Grundlagen | REFERENCE_ONLY |
| HAR-DOC-001 | Academy Production Studio | Harbor / `docs/ACADEMY_PRODUCTION_STUDIO.md` | SOP/Guide | DE | Video-Produktion, QA, Versionierung | READY |
| HAR-DOC-002 | Video Content Production Plan | Harbor / `docs/VIDEO_CONTENT_PRODUCTION_PLAN.md` | Plan/Checklist | DE | Katalog, Prioritäten, Upload-QA | READY |
| HAR-DOC-003 | UX Onboarding Blueprint | Harbor / `docs/UX_ONBOARDING_BLUEPRINT.md` | Blueprint | DE | Startpfad, mobile Priorisierung, Dedupe | READY |
| HAR-DOC-004 | CMS Backend Blueprint | Harbor / `docs/CMS_BACKEND_BLUEPRINT.md` | Blueprint | DE | Contentmodell, Workflow, Versionierung | DRAFT |
| HAR-DOC-005 | Task Engine Blueprint | Harbor / `docs/TASK_ENGINE_BLUEPRINT.md` | Blueprint | DE | Aufgaben, Rollen, Events | DRAFT |
| HAR-DOC-006 | Notification Engine Blueprint | Harbor / `docs/NOTIFICATION_ENGINE_BLUEPRINT.md` | Blueprint | DE | Aktivierungsereignisse und Zielgruppen | DRAFT |
| HAR-DOC-007 | Media Center Blueprint | Harbor / `docs/MEDIA_CENTER_BLUEPRINT.md` | Blueprint | DE | externe Bibliothek, Rechte-/Versionsrisiken | DRAFT |
| HAR-DOC-008 | Campaign Center Blueprint | Harbor / `docs/CAMPAIGN_CENTER_BLUEPRINT.md` | Blueprint | DE | Kampagnen, Preise, Zielgruppen | DRAFT |
| HAR-DOC-009 | Partner Earnings Engine | Harbor / `docs/PARTNER_EARNINGS_ENGINE.md` | Blueprint | DE | Provision/Punkte aus offiziellen Regeln | DRAFT |
| HAR-DOC-010 | I18N Translation Coverage | Harbor / `docs/I18N_TRANSLATION_COVERAGE.md` | Audit/Checklist | DE | vorhandene UI-Sprachen und offene Übersetzung | READY |
| HAR-DOC-011 | Private R2 Video Delivery | Harbor / `docs/ACADEMY_R2_VIDEO_DELIVERY.md` | Technical Guide | EN | sichere Videoauslieferung/Range/Rollback | REFERENCE_ONLY |
| HAR-DOC-012 | Academy Video Batch Audit | Harbor / `docs/ACADEMY_VIDEO_BATCH_INTEGRATION_20260812.md` | Audit | EN | technische Kandidaten und Mappingentscheidungen | READY |
| HAR-UI-001 | Growth-Center-Platzhalter | Harbor / `components/growth-center.jsx` | UI-Taxonomie | DE + i18n teils | zehn Kategorien und fünf Hubs ohne Contentkatalog | DRAFT |
| HAR-UI-002 | Global-Excellence-Platzhalter | Harbor / `components/global-excellence.jsx` | UI-Taxonomie | i18n | acht Kategorien, vollständig „In Vorbereitung“ | DRAFT |
| HAR-UI-003 | Media-Center-Platzhalter | Harbor / `components/media-center.jsx` | UI-Taxonomie | i18n | 14 Kategorien, externe/fehlende Links | DRAFT |
| HAR-CAT-001 | Academy Download Catalog | Harbor / `app/lib/academy-downloads.js` | Katalog | DE/EN/RU/RO UI | zehn geschützte Downloads, sieben Kategorien | READY |

## Bewertungs- und Mappingfelder

Abkürzungen: Qualität `H/M/L`, Aktualität `A` (aktuell), `U` (unklar), `V` (veraltet/historisch). Flags: `J`/`N`; `C` = Compliance, `R` = Copyright/Nutzungsrecht. „Bestehend“ bezeichnet eine bereits kanonische Lektion oder einen sichtbaren Bereich.

| Content-ID(s) | Qualität / Aktualität | Partnernutzen | Academy-Zielbereich | vorgeschlagenes Modul / Lektion | Bestehend | Duplikatrisiko | Translation | C | R | Bearbeitungsbedarf | Priorität |
|---|---|---|---|---|---|---|---|---|---|---|---|
| HAR-VID-001 | M/U | sehr hoch | Onboarding | M01/L02 Willkommen | J, Placeholder | N | J | J | J | Skript, Produktion, Untertitel | P0 |
| HAR-VID-002–006 | M/U | hoch | Wasserwissen | M02/L02–L06 kanonisch | J | M zu PDFs | J | J | J | Fach-/Claims-Review, Aufgabe, Transkript | P1 |
| HAR-VID-007 | H/A | sehr hoch | Produkte/Wasser | M03/L02 kanonisch | J | M | J | J | J | Titel-/Lernzielreview, Übersetzung | P1 |
| HAR-VID-008 | M/U | sehr hoch | Vertrieb | M06/L02 kanonisch | J | N | J | J | J | Prozessstand bestätigen, Checkliste | P2 |
| HAR-VID-009 | M/U | hoch | Recruiting/Onboarding | M09/L02 kanonisch | J | N | J | J | J | aktuellen Prozess prüfen | P0 |
| HAR-VID-010 | H/A | hoch | Wasser/Testlabor | M10/L02 kanonisch | J | H | J | J | J | Übersetzungs-/Claims-Review | P1 |
| HAR-VID-011–015 | M/U | mittel–hoch | Testlabor | M10/L03–L07 kanonisch | J | M | J | J | J | Einordnung, Aufgaben, Claims | P1 |
| HAR-VID-016 | M/U | hoch | Produkte/RXT | M07/L02 RXT | J, Placeholder | N | J | J | J | Skript aus PDF, Produktion | P1 |
| HAR-VID-017 | H/A | hoch | Produkte | neue M03-Lektion Basic/Untertisch | N | N | J | J | J | ID, Position, Review, R2-Rollout | P1 |
| HAR-VID-018–020 | H/A | sehr hoch | Produkte | konsolidierter Mini-Touch-Pfad in M03 | N | M untereinander | J | J | J | didaktische Bündelung, IDs, R2 | P1 |
| HAR-VID-021 | H/A | hoch | Produkte | neue Sparkling-Pro-Lektion in M03 | N | N | J | J | J | ID, Position, Review, R2 | P1 |
| HAR-VID-022 | H/A | keiner zusätzlich | Testlabor | keine | J | H | N | N | J | nicht integrieren | P3 |
| HAR-PDF-001–003 | M/A–U | hoch | Produkte/Wasser/RXT | bestehende PDF-Lektionen | J | H zu externen Decks | J | J | J | Quellen-/Claims-/Rechtereview | P1 |
| HAR-PDF-004–006 | H/A | hoch | Preise/Karriere/Sales | bestehende Download-/PDF-Lektionen | J | H zu lokalen Kopien | J | J | J | Ablaufdatum, Sichtbarkeit, Übersetzung | P1 |
| EXT-PDF-001 | L/A | mittel | Onboarding/Sales | neue kurze Checklisten, nicht Voll-PDF | N | M | J | J | J | PII entfernen, Claims, Layout, Fakten | P0 |
| EXT-PDF-002–004 | L/V–U | niedrig–mittel | Wasser/Recruiting | nur Quellenreview | N | H | J | J | J | Rechte, Fakten, Aktualität, keine Vollkopie | P3 |
| EXT-PPT-001 | L/V | niedrig | Produkte/Wasser | keine direkte Lektion | N | H | J | J | J | nur visuelle Referenz | P3 |
| EXT-PDF-005 | M/U | niedrig | Growth/Service | keine Lernlektion | N | N | N | J | J | Rechtsprüfung | P3 |
| GPT-DOC-001 | H/A | hoch | Onboarding | P0-Startpfad/Redaktionsleitlinie | M | M | J | J | J | auf Ist-Stand abgleichen | P0 |
| GPT-DOC-002 | H/A | sehr hoch | Produkte/Sales | Product-Intelligence-Checkliste | N | M | J | J | J | offizielle Daten ergänzen | P1 |
| GPT-DOC-003–004 | H/A | hoch | Marketing/Global Excellence | Growth-Mikromodule | N | N | J | J | J | Beispiele/Übung/Version | P3/P6 |
| GPT-DOC-005–006 | H/A | hoch | Leadership/Business | Wochenreview und Fokus-SOP | N | M | J | J | J | interne Zahlen/PII entfernen | P5 |
| GPT-PRM-001–002 | H/A | mittel | KI & Tools | kuratierte Einzelprompts | N | H | J | J | J | zerlegen, PII entfernen, versionieren | P4 |
| GPT-PRM-003 | H/A | sehr hoch | Marketing/KI | Content-Factory-Workflow | N | M | J | J | J | Partnerbeispiel und Übung | P3/P4 |
| GPT-PRM-004 | H/A | sehr hoch | Produkte/KI | Product-Intelligence-Workflow | N | M | J | J | J | offizielle Quellenbindung | P1/P4 |
| GPT-PRM-005 | H/A | hoch | Business/KI | Opportunity-Audit | N | N | J | J | J | Partnerfall und vereinfachte Scorecard | P5 |
| GPT-GDE-001 / GPT-DOC-007 | M/A | niedrig–mittel | KI & Tools | nur Referenz | N | M | J | J | J | keine interne Installation/Angebotsdaten übernehmen | P4 |
| LOS-BLP-001 / LOS-AI-003 | H/A | niedrig | KI & Tools | Grundlagen, keine Entwicklerlektion | N | M | J | J | J | stark vereinfachen | P4 |
| LOS-AI-001–002 | H/A | hoch | Sales/KI/Leadership | Follow-up- und Freigabe-Mikromodule | N | N | J | J | J | reale Beispiele, Datenschutz, Human Handoff | P2/P4 |
| HAR-DOC-001–003 | H/A | sehr hoch intern | Onboarding/Redaktion | Produktions-/Start-SOP | M | M | J | J | J | partnergerechte Ableitungen | P0 |
| HAR-DOC-004–009 | H/A | mittel, später hoch | Business/Systeme | Redaktions-/Backend-Referenz | N | M | J | J | J | keine UI-Veröffentlichung; Umsetzung separat | P5 |
| HAR-DOC-010 | H/A | hoch | alle | Übersetzungs-DoD | M | N | N | N | J | professionelle Sprachreview ergänzen | P0–P6 |
| HAR-DOC-011–012 | H/A | intern hoch | Redaktion/Video | Rollout-/Mapping-SOP | M | N | N | N | J | nicht als Partnerlektion | P1 |
| HAR-UI-001 | M/A | sehr hoch | Growth Center | kuratierte Ressourcen je Kategorie | J, leer | H | J | J | J | Contentmodell, Quellen, CTAs | P3–P5 |
| HAR-UI-002 | M/A | hoch | Global Excellence | acht geplante Mikromodule | J, leer | M | J | J | J | Lernziele, Inhalte, Aufgaben | P6 |
| HAR-UI-003 | M/A | hoch | Media Center | externer Medienkatalog | J, teils leer | H | J | J | J | Rechte/Version/Linkverifikation | P3 |
| HAR-CAT-001 | H/A | sehr hoch | Downloads | bestehender Download Center | J | H zu Kopien | J | J | J | Ablaufdatum/Owner pro Datei | P1 |

## Statuszählung

| Status | Anzahl |
|---|---:|
| READY | 14 |
| READY_WITH_REVIEW | 20 |
| DRAFT | 12 |
| REFERENCE_ONLY | 8 |
| NEEDS_TRANSLATION | 0 |
| NEEDS_COMPLIANCE_REVIEW | 9 |
| NEEDS_CONTENT_REWORK | 1 |
| DUPLICATE | 3 |
| ARCHIVE_CANDIDATE | 0 |
| **Gesamt** | **67** |

Translation ist zusätzlich als separates Feld markiert: 53 der 67 Cluster benötigen für eine mehrsprachige Veröffentlichung mindestens eine Übersetzung oder professionelle Sprachreview. Ein `READY`-Status hebt diese Anforderung nicht auf.
