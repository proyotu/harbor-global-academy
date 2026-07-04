# Changelog

## UX, Onboarding und Navigation - 2026-07-03

### Analyse

- Partner-Start und Dashboard auf doppelte Inhalte geprüft.
- Sichtbare Wiederholungen identifiziert:
  - Success Center zusätzlich im Startbereich.
  - Onboarding-Checkliste zusätzlich im Dashboard.
  - Gamification-, Ranking-, Aktivitäts- und Buchungsbereiche gleichzeitig auf der Dashboard-Startseite.
  - Aktionsbanner auf jeder Dashboard-Unterseite statt nur im Tageskontext.
- Ergebnis: Die Startseite war funktional stark, aber für neue Partner zu voll und mit mehreren ähnlichen CTAs überladen.

### Umgesetzt

- Startbereich zu einer dreistufigen Onboarding-Führung vereinfacht:
  1. Willkommensvideo
  2. Academy-Erklärung
  3. Onboarding abgeschlossen / normales Dashboard öffnen
- Academy-Erklärung als UI vorbereitet, ohne Fake-Video oder Storage-Änderung.
- Dashboard-Startseite neu komprimiert:
  - Willkommen
  - Heutige Aufgaben
  - Kompakte Fortschrittsübersicht
  - Aktuelle Kampagne
  - Neuigkeiten
  - Media Center
  - Growth Center
  - Success Center
- Doppelte Vollbereiche aus der Dashboard-Startseite entfernt:
  - vollständige Onboarding-Checkliste
  - Gamification-Teaser
  - Rankingkarten
  - Aktivitätskarte
  - Buchungs-CTA
- Globales Aktionsbanner von allen Unterseiten entfernt und in den Dashboard-Kontext verlagert.
- Neue sichtbare UI-Texte ausschließlich über das globale Übersetzungssystem ergänzt.
- Neue Dokumentation `docs/UX_ONBOARDING_BLUEPRINT.md` erstellt.

### Geänderte Dateien

- `app/page.jsx`
- `components/i18n-extension.js`
- `docs/UX_ONBOARDING_BLUEPRINT.md`
- `CHANGELOG.md`

### Bewusst nicht geändert

- Keine Login-Änderungen.
- Keine Registrierungsänderungen.
- Keine Auth-Änderungen.
- Keine API-Änderungen.
- Keine Datenbankänderungen.
- Keine Supabase-Änderungen.
- Keine R2-/Storage-Änderungen.
- Keine Infrastrukturänderungen.
- Keine produktiven Schreibvorgänge.
- Keine Partnerdatenänderungen.
- Keine neuen Libraries.

### Tests

- `npm run lint`: bestanden; Hinweis: Babel deoptimiert weiterhin die Ausgabe von `app/page.jsx` wegen Dateigröße, kein Fehler.
- `npm run build`: bestanden.

### Offen

- Echtes Academy-Erklärungsvideo muss später als Content-Asset bereitgestellt werden.
- Persistentes Onboarding benötigt später eine freigegebene Datenstruktur.
- Deployment wurde nicht gestartet; Produktionsprüfung benötigt separate Freigabe.

## Full Website Translation Fix / Complete i18n Coverage - 2026-07-03

### Analyse

- Bestehende Sprachlogik in `app/page.jsx` geprüft:
  - Sprache wird über `selectedLanguage` und `localStorage` (`harbor-global-language`) geführt.
  - `getCopy(language)` war vorhanden, hatte aber keine saubere Englisch-vor-Deutsch-Fallbackkette für neue UI-Bereiche.
  - Mehrere neue Center-Komponenten enthielten noch direkt sichtbare deutsche UI-Labels.
- Betroffene UI-Bereiche geprüft:
  - Success Center
  - Growth Center
  - Campaign Center
  - Partner Earnings Engine
  - Media Center
  - neue Dashboard-Navigationseinträge

### Umgesetzt

- Neue zentrale i18n-Erweiterung `components/i18n-extension.js` angebunden.
- `getCopy()` erweitert:
  - gewählte Sprache
  - Englisch-Fallback
  - Deutsch-Fallback
  - keine leeren/undefinierten Texte.
- Dashboard-Navigation neuer Bereiche von festen Labels auf `labelKey` umgestellt.
- `t()`-Translator an ausgelagerte Center-Komponenten weitergereicht.
- Folgende Bereiche an Translation-Keys angebunden:
  - Success-Center-Hero, Kennzahlen, Aufgaben, Badges, CTAs und Empfehlungspanel
  - Growth-Center-Hero, Kategorien, Dashboardkarten und integrierte Panels
  - Campaign-Center-Hero, Kennzahlen, Status, Material-, Preis- und Empty-State-Panels
  - Partner-Earnings-Engine-Hauptlabels und zentrale Paneltitel
  - Media-Center-Hero, Suche, Filter, Kategorien, Status, Rollenmodell, Empty States und Admin-UI
- Neue Dokumentation `docs/I18N_TRANSLATION_COVERAGE.md` erstellt.

### Geänderte Dateien

- `app/page.jsx`
- `components/i18n-extension.js`
- `components/success-center.jsx`
- `components/growth-center.jsx`
- `components/campaign-center.jsx`
- `components/partner-earnings-engine.jsx`
- `components/media-center.jsx`
- `docs/I18N_TRANSLATION_COVERAGE.md`
- `CHANGELOG.md`

### Bewusst nicht geändert

- Keine Login-Änderungen.
- Keine Registrierungsänderungen.
- Keine Auth-Änderungen.
- Keine API-Änderungen.
- Keine Datenbankänderungen.
- Keine Supabase-Änderungen.
- Keine R2-/Storage-Änderungen.
- Keine Infrastrukturänderungen.
- Keine produktiven Schreibvorgänge.
- Keine Partnerdatenänderungen.
- Keine neuen Libraries.

### Offen

- Lange historische Content-Blöcke in `app/page.jsx` sollten in späteren Sprints weiter modularisiert und schrittweise mit Translation-Keys versehen werden.
- Fachliche Übersetzungen für RU, RO, CS, TR und EL sollten vor externem Launch durch Muttersprachler geprüft werden.
- Rechtliche Texte, Produkt-/Preis-/Provisionsinhalte und Academy-Lektionen brauchen separate fachliche Freigabe.

### Tests

- `npm run lint`: bestanden; Hinweis: Babel deoptimiert weiterhin die Ausgabe von `app/page.jsx` wegen Dateigröße, kein Fehler.
- `npm run build`: bestanden.

## Media Center mit Telegram-Materialbibliothek - 2026-07-03

### Analyse

- Bestehende Dashboard-Navigation und Center-Struktur geprüft:
  - `app/page.jsx`
  - `components/campaign-center.jsx`
  - `components/growth-center.jsx`
- Media Center als eigener UI-Bereich umgesetzt, damit `app/page.jsx` nur minimal erweitert wird.
- Telegram-Link wird nur als zentraler, konfigurierbarer Blueprint-Platzhalter verwendet.
- Keine Telegram-API, keine Uploads und keine Speicherung ergänzt.

### Umgesetzt

- Neuen Navigationspunkt `Media Center` ergänzt.
- Neues Media Center als mobile-first UI erstellt:
  - Suchfeld
  - Kategorie-Filter
  - Kartenansicht
  - Status-Badges: Neu, Aktualisiert, Beliebt, Geplant
  - Datei- und Update-Platzhalter
  - Empty State bei fehlenden Links oder leerer Suche
- Kategorien vorbereitet:
  - Produktbilder
  - Produktvideos
  - Social Media Reels
  - Instagram Stories
  - WhatsApp Status
  - Logos
  - Flyer
  - Recruiting
  - Kampagnen
  - Black Friday
  - Sommeraktion
  - Winteraktion
  - Weihnachtsaktion
  - Sonstige Downloads
- Campaign Center um vorbereiteten Button `Aktionsmaterial öffnen` ergänzt.
- Growth Center um Bereich `Marketingmaterial & Vorlagen` ergänzt.
- Admin-UI vorbereitet für:
  - Telegram-Link je Kategorie
  - Kategorie aktiv/inaktiv
  - Materialstatus
  - letzter Stand
  - Hinweistext
- Neue Dokumentation `docs/MEDIA_CENTER_BLUEPRINT.md` erstellt.

### Neue Komponenten / Exporte

- `components/media-center.jsx`
  - `MediaCenterSection`
  - `MediaGrowthPanel`
  - `CampaignMediaActionButton`
  - `mediaCenterCategories`
  - `mediaCenterConfig`

### Geänderte Dateien

- `app/page.jsx`
- `components/media-center.jsx`
- `components/campaign-center.jsx`
- `components/growth-center.jsx`
- `docs/MEDIA_CENTER_BLUEPRINT.md`
- `CHANGELOG.md`

### Bewusst nicht geändert

- Keine Login-Änderungen.
- Keine Registrierungsänderungen.
- Keine Auth-Änderungen.
- Keine API-Änderungen.
- Keine Datenbankänderungen.
- Keine Supabase-Änderungen.
- Keine R2-/Storage-Änderungen.
- Keine Infrastrukturänderungen.
- Keine neuen Libraries.
- Keine produktiven Schreibvorgänge.
- Keine Partnerdatenänderungen.
- Keine Telegram-API.
- Keine Upload-Funktion.
- Keine echte Admin-Schreiblogik.

### Tests

- `npm run lint`: bestanden; Hinweis: Babel deoptimiert weiterhin die Ausgabe von `app/page.jsx` wegen Dateigröße, kein Fehler.
- `npm run build`: bestanden.

## Partner Earnings Engine & Campaign Architecture Extension - 2026-07-02

### Analyse

- Bestehende Campaign-Center-Struktur geprüft:
  - `components/campaign-center.jsx`
  - `docs/CAMPAIGN_CENTER_BLUEPRINT.md`
- Anforderungen für Provisions-, Punkte-, Level- und Aktionsberechnung geprüft.
- Offizielle Preise, Provisionen, Produktpunkte und Levelgrenzen sind aktuell nicht maschinenlesbar im Projekt vorhanden.
- Deshalb wurden keine echten Preise, Provisionen, Punkte oder Levelgrenzen hardcodiert.

### Umgesetzt

- Neue modulare Partner Earnings Engine als UI- und Architekturvorbereitung ergänzt.
- Generische Berechnungshelfer vorbereitet:
  - Provisionen
  - Produktpunkte
  - Level-Fortschritt
- Partneransicht vorbereitet:
  - Produktkontext
  - Partnerlevel
  - normale Provision als Quellenstatus
  - Aktionsprovision als Quellenstatus
  - Punkte- und Level-Fortschritt als Quellenstatus
  - Countdown-/Aktionszeitraum-Hinweis
- Leaderansicht vorbereitet:
  - Team-Punkteübersicht
  - Partner kurz vor Levelwechsel
  - Partner mit hohem Potenzial
  - attraktive Aktionsprodukte
- Adminansicht vorbereitet:
  - Provisionskonfiguration als UI
  - Punkte-/Level-Konfiguration als UI
  - Kampagnenregel-Konfiguration als UI
  - keine Speicherung
- Campaign-Center-Blueprint um Partner-Earnings-, Provisions-, Punkte- und Leveltabellen erweitert.
- Neue Dokumentation `docs/PARTNER_EARNINGS_ENGINE.md` erstellt.

### Neue Komponenten / Helper

- `components/partner-earnings-engine.jsx`
  - `PartnerEarningsEnginePanel`
  - `calculateCommissionPreview`
  - `calculatePointsPreview`
  - `calculateLevelProgressPreview`

### Geänderte Dateien

- `components/campaign-center.jsx`
- `components/partner-earnings-engine.jsx`
- `docs/CAMPAIGN_CENTER_BLUEPRINT.md`
- `docs/PARTNER_EARNINGS_ENGINE.md`
- `CHANGELOG.md`

### Bewusst nicht geändert

- Keine Login-Änderungen.
- Keine Registrierungsänderungen.
- Keine Auth-Änderungen.
- Keine API-Änderungen.
- Keine Datenbankänderungen.
- Keine Supabase-Änderungen.
- Keine R2-/Storage-Änderungen.
- Keine Infrastrukturänderungen.
- Keine produktiven Schreibvorgänge.
- Keine Änderungen an Partnerdaten.
- Keine echten Produktivpreise.
- Keine echten Provisionen.
- Keine echten Produktpunkte.
- Keine echten Levelgrenzen.
- Keine Backoffice-Integration.
- Keine neuen Libraries.

### Tests

- `npm run lint`: bestanden; Hinweis: Babel deoptimiert weiterhin die Ausgabe von `app/page.jsx` wegen Dateigröße, kein Fehler.
- `npm run build`: bestanden.

## Campaign Center & Aktionsbanner UI - 2026-07-02

### Analyse

- Bestehende Blueprint-Dokumente gelesen und berücksichtigt:
  - `docs/TASK_ENGINE_BLUEPRINT.md`
  - `docs/NOTIFICATION_ENGINE_BLUEPRINT.md`
  - `docs/CMS_BACKEND_BLUEPRINT.md`
- Bestehende UI-Struktur geprüft:
  - `app/page.jsx`
  - `components/success-center.jsx`
  - `components/growth-center.jsx`
- Aktuelle Preisquellen sind nicht maschinenlesbar genug für echte Aktionspreisberechnung.
- Deshalb werden keine Produktivpreise hardcodiert und keine Fantasiepreise angezeigt.

### Umgesetzt

- Neues UI-only Campaign Center ergänzt.
- Neues Aktionsbanner im geschützten Dashboard ergänzt.
- Neue Navigation `Aktionen` ergänzt.
- Partneransicht vorbereitet:
  - aktive Aktionen
  - Kundenaktion als Verkaufsargument
  - interne Partneraktion
  - Level-Hinweis
  - Aktionspreis-Berechnung vorbereitet
- Leaderansicht vorbereitet:
  - Team-Hinweise
  - attraktive Produkte
  - Verkaufsargumente
  - Teamaktions-Aufgaben als UI
- Adminansicht vorbereitet:
  - Kampagnenverwaltung als UI
  - Aktion erstellen/bearbeiten/planen/archivieren als deaktivierte UI-Aktionen
  - Zielgruppen- und Notification-Vorbereitung
  - Level-Preis-Matrix ohne echte Preise
- Success Center um aktiven Kampagnenhinweis ergänzt.
- Growth Center um Kampagnenmaterial-Bereich ergänzt.
- Automatische Aktionspreislogik vorbereitet:
  - fester Betrag
  - prozentualer Rabatt
  - kombinierte Aktion
  - keine Berechnung ohne echte Preisquelle
- Neue Dokumentation `docs/CAMPAIGN_CENTER_BLUEPRINT.md` erstellt.

### Neue Komponenten / Helper

- `components/campaign-center.jsx`
  - `CampaignDashboardBanner`
  - `CampaignCenterSection`
  - `CampaignSuccessHint`
  - `CampaignGrowthPanel`
  - `CustomerCampaignPanel`
  - `PartnerCampaignPanel`
  - `LevelPricingTable`
  - `PartnerSavingsBadge`
  - `ProductPromotionCard`

### Geänderte Dateien

- `app/page.jsx`
- `components/campaign-center.jsx`
- `components/success-center.jsx`
- `components/growth-center.jsx`
- `docs/CAMPAIGN_CENTER_BLUEPRINT.md`
- `CHANGELOG.md`

### Bewusst nicht geändert

- Keine Login-Änderungen.
- Keine Registrierungsänderungen.
- Keine Auth-Änderungen.
- Keine API-Änderungen.
- Keine Datenbankänderungen.
- Keine Supabase-Änderungen.
- Keine R2-/Storage-Änderungen.
- Keine Infrastrukturänderungen.
- Keine produktiven Schreibvorgänge.
- Keine Änderungen an Partnerdaten.
- Keine Änderungen an Progress, Quiz oder Zertifikaten.
- Keine echten Notifications.
- Keine echten Produktivpreise.
- Keine Backoffice-Integration.
- Keine neuen Libraries.

### Tests

- `npm run lint`: bestanden; Hinweis: Babel deoptimiert weiterhin die Ausgabe von `app/page.jsx` wegen Dateigröße, kein Fehler.
- `npm run build`: bestanden.

## Academy Production Studio Blueprint - 2026-07-01

### Dokumentiert

- Neue Datei `docs/ACADEMY_PRODUCTION_STUDIO.md` erstellt.
- Vollständigen Produktionsstandard für zukünftige Academy-Videos dokumentiert:
  - Intro
  - Begrüßung
  - Lernziel
  - Hauptinhalt
  - Zusammenfassung
  - Call-to-Action
  - Übergang zur nächsten Lektion
- Einheitliche Produktionsrichtlinien dokumentiert:
  - Kamera
  - Licht
  - Mikrofon
  - Hintergrund
  - Kleidung
  - Körpersprache
  - Blickkontakt
  - Teleprompter
  - Branding, Logo und Farben
- Dateinamenschema mit Modul, Lektion, Sprache, Status, Version und Datum ergänzt.
- Produktionsablauf dokumentiert:
  - Skript
  - Teleprompter
  - Aufnahme
  - Qualitätskontrolle
  - Schnitt
  - Thumbnail
  - Upload-Vorbereitung
  - R2
  - CMS
  - Freigabe
  - Veröffentlichung
- Qualitätscheckliste vor Veröffentlichung ergänzt.
- Checkliste für Mehrsprachigkeit ergänzt.
- Austauschstrategie alter Videos gegen neue Videos dokumentiert.
- Versionierungsstandard für alle Videos definiert.
- Audio-/Bild-Qualitätsrichtlinien dokumentiert.
- Roadmap für spätere KI-Unterstützung dokumentiert:
  - automatische Untertitel
  - Übersetzungen
  - Transkripte
  - Kapitel
  - Zusammenfassungen
  - Quiz-Erstellung
  - Wissensextraktion

### Geänderte Dateien

- `docs/ACADEMY_PRODUCTION_STUDIO.md`
- `CHANGELOG.md`

### Bewusst nicht geändert

- Keine Codeänderungen.
- Keine Komponentenänderungen.
- Keine API-Änderungen.
- Keine Datenbankänderungen.
- Keine Auth-Änderungen.
- Keine Supabase-Änderungen.
- Keine Migrationen.
- Keine Storage-/R2-Änderungen.
- Keine Infrastrukturänderungen.
- Keine neuen Libraries.
- Keine produktiven Schreibvorgänge.
- Keine Uploads.

### Tests

- Kein `npm run lint` und kein `npm run build` ausgeführt, da ausschließlich Markdown-Dokumentation geändert wurde.

## Video Content Production Plan - 2026-07-01

### Dokumentiert

- Neue Datei `docs/VIDEO_CONTENT_PRODUCTION_PLAN.md` erstellt.
- Aktuellen Video-Content-Stand dokumentiert:
  - 11 Academy-Module
  - 38 Lektionen
  - 14 echte Video-Zuordnungen
  - 2 Video-Platzhalter
  - 14 private MP4-Dateien
- Modul-/Lektions-/Video-Zuordnung dokumentiert.
- Aktuelle vorhandene Videos und offene Platzhalter dokumentiert.
- Einheitliches Dateinamen-Schema für neue Videos definiert.
- Empfohlene Video-Produktionsreihenfolge dokumentiert.
- R2-Upload-Checkliste und Qualitätscheck vor Upload vorbereitet.
- Sichere spätere Austauschstrategie dokumentiert:
  - alte Videos nicht sofort löschen
  - neue Videos zuerst separat hochladen
  - Vorschau prüfen
  - Modul-Zuordnung erst nach erfolgreicher Prüfung aktualisieren
  - alte Videos anschließend archivieren

### Geänderte Dateien

- `docs/VIDEO_CONTENT_PRODUCTION_PLAN.md`
- `CHANGELOG.md`

### Bewusst nicht geändert

- Keine Codeänderungen.
- Keine R2-Uploads.
- Keine Datei-Migration.
- Keine Datenbankänderungen.
- Keine Supabase-Änderungen.
- Keine API-Änderungen.
- Keine Auth-Änderungen.
- Keine Storage-Änderungen.
- Keine Infrastrukturänderungen.
- Keine Änderungen an Partnerdaten.
- Keine Änderungen an Modulzuordnungen.
- Keine produktiven Schreibvorgänge.

### Tests

- Kein `npm run lint` und kein `npm run build` ausgeführt, da ausschließlich Markdown-Dokumentation geändert wurde.

## CMS Backend Blueprint & Enterprise CMS Architecture - 2026-07-01

### Analyse

- Bestehende Academy-/CMS-Strukturen read-only analysiert:
  - statischer Academy-Katalog in `app/lib/academy-content.js`
  - statischer Download-Katalog in `app/lib/academy-downloads.js`
  - read-only Admin-Inhaltsübersicht in `app/components/AcademyContentAdminOverview.jsx`
  - Download Center in `app/components/AcademyDownloadCenter.jsx`
  - Admin-CMS-UI in `app/page.jsx`
  - Growth Center in `components/growth-center.jsx`
  - geschützte Dokument-/Video-Routen
- Aktueller Stand dokumentiert:
  - 11 Module
  - 38 Lektionen
  - 14 Video-Zuordnungen
  - 2 Video-Platzhalter
  - 11 PDF-Zuordnungen
  - 16 Quiz-Zuordnungen
  - 8 konkrete Quizfragen
  - 10 Download-Einträge
  - 4 aktive Inhaltssprachen: DE, EN, RU, RO

### Dokumentiert

- Neue Datei `docs/CMS_BACKEND_BLUEPRINT.md` erstellt.
- Enthalten:
  - aktueller Ist-Zustand
  - geplante CMS-Zielarchitektur
  - geplante Tabellen:
    - `academy_modules`
    - `academy_lessons`
    - `academy_assets`
    - `academy_downloads`
    - `academy_quizzes`
    - `academy_quiz_questions`
    - `academy_languages`
    - `academy_content_versions`
    - `academy_publish_queue`
  - Rollenmodell für Partner, Leader, Admin, Super Admin und optional CMS Editor
  - Workflow für Entwurf, Bearbeitung, Review, Freigabe, Planung, Veröffentlichung, Archivierung und Rollback
  - Mehrsprachigkeitsstrategie
  - Versionierung und Historie
  - API-Plan ohne Implementierung
  - RLS-/Security-Konzept
  - Automationsplan für Task Engine, Notification Engine, Kalender, CRM, n8n, WhatsApp, Leonid OS und KI-Agenten
  - Risiken, offene Entscheidungen und empfohlene Implementierungsreihenfolge

### Geänderte Dateien

- `docs/CMS_BACKEND_BLUEPRINT.md`
- `CHANGELOG.md`

### Bewusst nicht geändert

- Keine Login-Änderungen.
- Keine Registrierungsänderungen.
- Keine Auth-Änderungen.
- Keine API-Änderungen.
- Keine Datenbankänderungen.
- Keine Supabase-Änderungen.
- Keine R2-/Storage-Änderungen.
- Keine Infrastrukturänderungen.
- Keine Komponentenänderungen.
- Keine UI-/Design-Änderungen.
- Keine Änderungen an Partnerdaten.
- Keine Progress-, Quiz- oder Zertifikatsänderungen.
- Keine Migrationen.
- Keine neuen Tabellen.
- Keine neuen Libraries.
- Keine produktiven Schreibvorgänge.

### Tests

- Kein `npm run lint` und kein `npm run build` ausgeführt, da ausschließlich Markdown-Dokumentation geändert wurde.

## Enterprise Refactoring Phase 2 - Growth Center Extraction - 2026-07-01

### Analyse

- Growth Center war vollständig in `app/page.jsx` definiert und wurde über den bestehenden Dashboard-Tab `growth` gerendert.
- Die Growth-Center-UI enthält keine eigenen Hooks, keine API-Aufrufe, keine Auth-Logik und keine produktiven Schreibvorgänge.
- Sichere Extraktionskandidaten:
  - Growth-Center-Kategorien
  - Growth-Hub-Sektionen
  - Leader-Growth-UI
  - Locked-State
  - Dashboard-Karten
  - Growth-Center-Hauptsection
- `growthCenterCategories` und `growthHubSections` werden zusätzlich von der bestehenden Admin-CMS-UI gelesen und bleiben deshalb als Exporte verfügbar.

### Umgesetzt

- Neue Datei `components/growth-center.jsx` erstellt.
- Growth-Center-UI aus `app/page.jsx` ausgelagert:
  - `GrowthCenterSection`
  - `GrowthCategoryCard`
  - `GrowthDashboardCard`
  - `GrowthHubPanel`
  - `GrowthLeaderPanel`
  - `GrowthLockedState`
  - `getGrowthCenterReadiness`
  - `growthCenterCategories`
  - `growthHubSections`
- `app/page.jsx` enthält nur noch einen dünnen Adapter `GrowthCenterSection`, der bestehende Props unverändert annimmt und die bestehenden Helper als Dependencies an die ausgelagerte Komponente weitergibt.
- Bestehende Dashboard-Aufrufstelle bleibt unverändert.
- Bestehende CMS-Nutzung der Growth-Konstanten bleibt unverändert über Importe erhalten.

### Geänderte Dateien

- `app/page.jsx`
- `components/growth-center.jsx`
- `CHANGELOG.md`

### Bewusst nicht geändert

- Keine Login-Änderungen.
- Keine Registrierungsänderungen.
- Keine Auth-Änderungen.
- Keine API-Änderungen.
- Keine Datenbankänderungen.
- Keine Supabase-Änderungen.
- Keine R2-/Storage-Änderungen.
- Keine Infrastrukturänderungen.
- Keine produktiven Schreibvorgänge.
- Keine Änderungen an bestehenden Partnerdaten.
- Keine neuen Libraries.
- Keine UI-/Design-Änderungen.

### Tests

- `npm run lint`: bestanden über `C:\Program Files\nodejs\npm.cmd`; Hinweis: Babel deoptimiert die Ausgabe von `app/page.jsx` wegen Dateigröße, kein Fehler.
- `npm run build`: bestanden.

## Notification Engine Backend Blueprint & Enterprise Notification Architecture - 2026-07-01

### Dokumentiert

- Enterprise-Blueprint für die zukünftige Notification Engine erstellt.
- Zielarchitektur für rollen-, fortschritts- und zielgruppenbasierte Benachrichtigungen dokumentiert.
- Geplante Tabellen dokumentiert:
  - `academy_notifications`
  - `academy_notification_templates`
  - `academy_notification_delivery`
  - `academy_notification_events`
  - `academy_notification_preferences`
- Zielgruppenlogik dokumentiert:
  - Partner erhalten nur Meldungen passend zu Fortschritt, Aufgaben, Terminen und Zertifikaten.
  - Leader erhalten nur Teamereignisse des eigenen Teams.
  - Admins erhalten globale Ereignisse, Systemmeldungen und Auditinformationen.
- Notification-Typen, Kanalstrategie, RLS-/Security-Plan, API-Plan, Event-System, Automationsplan, Risiken und empfohlene Implementierungsreihenfolge dokumentiert.

### Geänderte Dateien

- `docs/NOTIFICATION_ENGINE_BLUEPRINT.md`
- `CHANGELOG.md`

### Bewusst nicht geändert

- Keine neuen Tabellen.
- Keine Migrationen.
- Keine Supabase-Änderungen.
- Keine RLS-Implementierung.
- Keine API-Änderungen.
- Keine Auth-, Login- oder Registrierungsänderungen.
- Keine R2-/Storage-Änderungen.
- Keine Infrastrukturänderungen.
- Keine produktiven Schreibvorgänge.
- Keine Änderungen an bestehenden Partnerdaten.

### Tests

- Keine Lint-/Build-Ausführung notwendig, da ausschließlich Markdown-Dokumentation geändert wurde.

## Task Engine Backend Blueprint & Supabase Migration Plan - 2026-07-01

### Analyse

- Bestehende Supabase-/Datenbankstruktur read-only analysiert.
- Aktueller dokumentierter Kernbestand:
  - `public.partners`
  - lokale SQL-Notizen unter `supabase/`
  - Partner-Metadaten aktuell stark in `partners.avatar_url` gebündelt
  - Community-Systemdaten aktuell als JSON-Systemzeilen in `partners`
- Bestehendes Auth-Modell analysiert:
  - Custom HMAC Sessions
  - PBKDF2-Passwort-Hashes
  - Admin über Environment Credentials bzw. Admin-Profil-Metadaten
  - kein Supabase Auth als primäres User-System
- Bestehende API-Routen analysiert:
  - `app/api/partners/route.js`
  - `app/api/community/route.js`
  - geschützte Dokument-/Video-Routen
- Bestehende Task-Engine-UI bleibt read-only und nutzt keine produktive Speicherung.

### Dokumentiert

- Neue Datei `docs/TASK_ENGINE_BLUEPRINT.md` erstellt.
- Enthalten:
  - aktueller Ist-Zustand
  - geplante Tabellen
  - Feldvorschläge
  - Rollen-/Berechtigungsmodell
  - RLS-/Security-Plan
  - API-Plan
  - Event-/Automation-Plan
  - Risiken
  - offene Entscheidungen
  - empfohlene Implementierungsreihenfolge
- Geplante Tabellen beschrieben:
  - `academy_task_templates`
  - `academy_task_assignments`
  - `academy_task_events`
  - `academy_task_comments`
- Klar dokumentiert: echte Leader-Funktionen benötigen später eine saubere Team-/Upline-Struktur.

### Geänderte Dateien

- `docs/TASK_ENGINE_BLUEPRINT.md`
- `CHANGELOG.md`

### Bewusst nicht verändert

- Keine Login-Änderungen.
- Keine Registrierungsänderungen.
- Keine Auth-Änderungen.
- Keine produktiven API-Änderungen.
- Keine Datenbankänderungen.
- Keine Supabase-Migrationen.
- Keine RLS-Policies erstellt.
- Keine R2-/Storage-Änderungen.
- Keine Infrastrukturänderungen.
- Keine produktiven Schreibvorgänge.
- Keine bestehenden Partnerdaten geändert.
- Keine neuen Libraries installiert.
- Keine Komponentenlogik verändert.

### Tests

- Kein `npm run lint` und kein `npm run build` ausgeführt, weil ausschließlich Markdown-/Dokumentationsdateien geändert wurden und keine Code-, Import- oder Exportänderung erfolgt ist.

## Mobile Academy Module UX - Inline Lessons - 2026-07-01

### Analyse

- Die Modulübersicht wird in `ModulesSection` innerhalb von `app/page.jsx` gerendert.
- Die Modulkarte liegt in `PartnerAcademyModuleCard`.
- Die aktive Detail-/Lektionsansicht liegt in `PartnerAcademyModuleDetail`.
- Die Lektionsnavigation selbst bleibt in `app/components/AcademyLessonNavigation.jsx` und wurde nicht verändert.
- Es gab keine separate zweite Lektionsliste am Seitenende; der Lektions-/Videoblock lag aber innerhalb des Detailbereichs nach dem Modul-Hero und konnte auf Mobile zu zusätzlichen Scrollwegen führen.

### Umgesetzt

- Aktive Modulkarte erhält jetzt `aria-expanded` und eine klare Schwarz-Gold-Hervorhebung.
- Der bestehende Lektions-/Videoblock wird im aktiven Moduldetail direkt an erster Stelle gerendert.
- Dadurch erscheint nach Klick auf ein Modul zuerst der Bereich `Lektionen` mit der aktiven Lektion bzw. dem Video.
- Die alte Position des Lektions-/Videoblocks innerhalb der rechten Detailspalte wurde entfernt, damit keine doppelten Lektionen entstehen.
- Die Inline-Detailansicht bleibt direkt nach der aktiven Modulkarte im Modul-Grid.
- Bestehende States für aktives Modul, aktive Lektion und lokalen Modulabschluss bleiben unverändert.
- Bestehende Video-, PDF-, Quiz- und Downloadlogik bleibt unverändert.

### Geänderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Bewusst nicht verändert

- Keine Login-Änderungen.
- Keine Registrierungsänderungen.
- Keine Auth-Änderungen.
- Keine API-Änderungen.
- Keine Datenbankänderungen.
- Keine Supabase-Änderungen.
- Keine R2-/Storage-Änderungen.
- Keine Infrastrukturänderungen.
- Keine Partnerdaten geändert.
- Keine Video-URLs geändert.
- Keine Progress-Speicherung geändert.
- Keine Quiz- oder Zertifikatslogik geändert.
- Keine neuen Libraries installiert.

### Offene TODOs

- Ein visueller Mobile-Browsertest bei 320/375/430 px kann später zusätzlich bestätigen, dass die Scrollwege auf echten Geräten wie erwartet reduziert sind.
- `app/page.jsx` bleibt weiterhin sehr groß; weitere Extraktionen nur in separat freigegebenen, kleinen Schritten.

### Tests

- `npm run lint`: bestanden über `C:\Program Files\nodejs\npm.cmd`; Hinweis: Babel deoptimiert die Ausgabe von `app/page.jsx` wegen Dateigröße, kein Fehler.
- `npm run build`: bestanden.

## Enterprise Task Engine - Foundation - 2026-07-01

### Analyse

- Die bestehende Architektur enthält noch keine eigene Task-Tabelle, keinen Task-Endpunkt und keine persistente Aufgabenhistorie.
- Rollen werden aktuell aus vorhandenen Partnerdaten bzw. Metadaten abgeleitet (`partner`, `leader`, `admin`), ohne neue Rechteverwaltung.
- Partner-, Leader- und Admin-Daten laufen weiterhin über bestehende Partner-/Community-Strukturen.
- Lernfortschritt wird aus vorhandenen Academy-/Progress-Feldern gelesen; produktive Task-Speicherung wäre ohne eigene Tabellen nicht sauber skalierbar.
- Deshalb wurden keine Aufgaben in bestehenden Partnerfeldern, `avatar_url`, Supabase Storage oder sonstigen Metadaten improvisiert.

### Umgesetzt

- Success Center um eine read-only `TaskEngineFoundationPanel` erweitert.
- Unterstützte Aufgabentypen als UI vorbereitet:
  - Modul ansehen
  - Quiz abschließen
  - Profil vervollständigen
  - Termin buchen
  - Leader kontaktieren
  - Teammeeting besuchen
  - Produkttraining
  - Marketingaufgabe
  - Follow-up
  - Eigene Aufgabe
- Task-Status als UI vorbereitet:
  - Offen
  - Heute
  - In Bearbeitung
  - Erledigt
  - Überfällig
- Prioritäten als UI vorbereitet:
  - Hoch
  - Mittel
  - Niedrig
- Rollenansichten vorbereitet:
  - Partner: eigene abgeleitete Aufgaben
  - Leader: Teamaufgaben als vorbereitete Übersicht
  - Admin: globale/Systemaufgaben als vorbereitete Übersicht
- Bestehende Success-Center-Aufgaben werden weiterhin nur aus vorhandenen Profil-, Academy- und Kalenderdaten abgeleitet.
- Backend-Architektur für spätere produktive Task Engine dokumentiert:
  - `academy_task_templates`
  - `academy_task_assignments`
  - `academy_task_events`
  - `academy_task_comments`
  - spätere Endpunkte für Listen, Erstellen, Statusänderung, Zuweisung und Kommentare

### Geänderte Dateien

- `components/success-center.jsx`
- `CHANGELOG.md`

### Neue Komponenten / Helper

- `TaskEngineFoundationPanel`
- `TaskEngineMetaBadge`
- `getTaskEngineStatus`
- `getTaskEnginePriority`
- Task-Engine-Status-, Prioritäts-, Typ- und Backend-Plan-Konstanten

### Bewusst nicht verändert

- Keine Login-Änderungen.
- Keine Registrierungsänderungen.
- Keine Auth-Änderungen.
- Keine API-Änderungen.
- Keine Datenbankänderungen.
- Keine Supabase-Änderungen.
- Keine R2-/Storage-Änderungen.
- Keine Infrastrukturänderungen.
- Keine produktiven Schreibvorgänge.
- Keine bestehenden Partnerdaten geändert.
- Keine neuen Libraries installiert.

### Notwendige spätere Backend-Schritte

- Eigene Task-Tabellen mit klarer Trennung von Templates, Assignments, Events und Kommentaren erstellen.
- Serverseitige Berechtigungen/RLS für Partner, Leader und Admin definieren.
- Leader-Scope und Teamzuordnung zuverlässig modellieren.
- Task-Statusänderungen auditierbar und idempotent speichern.
- Reminder, WhatsApp, n8n oder KI-Automationen erst nach stabiler Event-Struktur anbinden.

### Risiken/TODOs

- Produktive Speicherung darf nicht in `avatar_url` oder Profilbild-Metadaten erfolgen.
- Clientseitig abgeleiteter Task-Status ist nur Orientierung, keine verbindliche Wahrheit.
- Echte Teamaufgaben benötigen später eine saubere Team-/Upline-Struktur.
- Eigene Aufgaben, Kommentare und Fälligkeiten benötigen spätere DB- und API-Freigabe.

### Tests

- `npm run lint`: bestanden über `C:\Program Files\nodejs\npm.cmd`; Hinweis: Babel deoptimiert die Ausgabe von `app/page.jsx` wegen Dateigröße, kein Fehler.
- `npm run build`: bestanden.

## Small Refactoring - Success Center Extraction - 2026-07-01

### Analyse

- Der Success-Center-Bereich war ein guter Kandidat für eine kleine Extraktion, weil die UI-Komponenten selbst keine eigenen Hooks, keine API-Aufrufe und keine produktiven Schreibvorgänge enthalten.
- `buildSuccessCenterData` hängt weiterhin an bestehenden lokalen Hilfsfunktionen aus `app/page.jsx`.
- Deshalb bleibt in `app/page.jsx` bewusst nur ein dünner Adapter `SuccessCenterSection`, der die bestehenden Helper an die neue Komponente weitergibt.
- Bestehende Aufrufstellen, Props und State-Flows wurden nicht verändert.

### Umgesetzt

- Neue Datei `components/success-center.jsx` erstellt.
- Success-Center-UI und Datenaufbereitung aus `app/page.jsx` ausgelagert:
  - `SuccessCenterSection`
  - `SuccessOverviewCard`
  - `SuccessTaskCard`
  - `SuccessStatusBadge`
  - `SuccessRecommendationPanel`
  - `SuccessFollowUpPanel`
  - `LeaderSuccessPanel`
  - `AdminSuccessPanel`
  - `buildSuccessCenterData`
  - Success-Statusmetadaten, Aufgabentypen und Follow-up-Blueprints
- `app/page.jsx` nutzt nun `SuccessCenterSectionView` aus `components/success-center.jsx`.
- Lokale Adapter-Signatur `SuccessCenterSection({ partner, academyUpdates, localOnboardingStepIds, onNavigate, isAdmin, isLeader, partners, pendingPartners, compact })` bleibt erhalten.
- UI, Texte, CSS-Klassen und sichtbares Verhalten bleiben identisch.

### Geänderte Dateien

- `app/page.jsx`
- `components/success-center.jsx`
- `CHANGELOG.md`

### Neu erstellte Dateien

- `components/success-center.jsx`

### Bewusst nicht verändert

- Keine Login-Änderungen.
- Keine Registrierungsänderungen.
- Keine Auth-Änderungen.
- Keine API-Änderungen.
- Keine Datenbankänderungen.
- Keine Supabase-Änderungen.
- Keine R2-/Storage-Änderungen.
- Keine Infrastrukturänderungen.
- Keine UI-/Design-Änderungen.
- Keine produktiven Schreibvorgänge.
- Keine bestehenden Partnerdaten geändert.
- Keine Änderungen an `AdminPanel`, `LeaderDashboardPreview`, `AdminPartnerDetail` oder `AcademyAssetsAdminPanel`.

### Risiken/TODOs

- Der Adapter in `app/page.jsx` bleibt notwendig, solange zentrale Helper wie `getPartnerAcademySummary`, `buildNotificationCenterItems` und Format-/Analytics-Helfer lokal in `app/page.jsx` liegen.
- Ein späterer Schritt kann diese reinen Helper in eine dedizierte Utility-Datei verschieben, wenn dafür ein eigener risikoarmer Refactoring-Scope freigegeben wird.

### Tests

- `npm run lint`: bestanden über `C:\Program Files\nodejs\npm.cmd`; Hinweis: Babel deoptimiert die Ausgabe von `app/page.jsx` wegen Dateigröße, kein Fehler.
- `npm run build`: bestanden.

## Enterprise Refactoring & Performance Foundation - 2026-07-01

### Analyse

- `app/page.jsx` bleibt der zentrale Architektur-Risikobereich und ist weiterhin sehr groß.
- Größte Komponenten/Risikozonen im aktuellen Stand:
  - `AcademyAssetsAdminPanel` mit ca. 617 Zeilen
  - `LeaderDashboardPreview` mit ca. 594 Zeilen
  - `AdminPanel` mit ca. 467 Zeilen
  - `AdminPartnerDetail` mit ca. 462 Zeilen
  - `CommunityCommunicationPrototype` mit ca. 471 Zeilen
  - `AnalyticsBusinessIntelligenceCenter` mit ca. 357 Zeilen
- Sichere Extraktionskandidaten waren reine UI-Komponenten ohne Hooks, API-Zugriffe, Auth-Logik oder eigene Zustandsverwaltung.

### Umgesetzt

- Erste risikoarme Enterprise-Refactoring-Grundlage erstellt.
- Neue Datei `components/admin-ui.jsx` angelegt.
- Reine Admin-/CMS-UI-Bausteine aus `app/page.jsx` ausgelagert:
  - `AdminPrototypeStatusBadge`
  - `AdminPrototypeActionButton`
  - `AdminPrototypeMetricCard`
  - `AdminCmsSectionCard`
  - `AdminCmsWorkflowStep`
  - `cmsWorkflowSteps`
- Bestehende Aufrufstellen in `app/page.jsx` nutzen dieselben Komponenten jetzt über Imports.
- UI-Klassen, Texte, Props und Verhalten der ausgelagerten Komponenten unverändert beibehalten.
- Keine State-Logik, keine Admin-Mutationen, keine API-Aufrufe und keine Datenlogik verschoben.

### Geänderte Dateien

- `app/page.jsx`
- `components/admin-ui.jsx`
- `CHANGELOG.md`

### Neu erstellte Dateien

- `components/admin-ui.jsx`

### Bewusst nicht verändert

- Keine Login-Änderungen.
- Keine Registrierungsänderungen.
- Keine Auth-Änderungen.
- Keine API-Änderungen.
- Keine Datenbankänderungen.
- Keine Supabase-Änderungen.
- Keine R2-/Storage-Änderungen.
- Keine Infrastrukturänderungen.
- Keine produktiven Schreibvorgänge.
- Keine UI-/Design-Änderungen.
- Keine neuen Libraries.
- Große stateful Bereiche wie `AdminPanel`, `AdminPartnerDetail`, `LeaderDashboardPreview`, `AcademyAssetsAdminPanel`, `CommunityCommunicationPrototype` wurden bewusst noch nicht ausgelagert, weil sie viele Hooks, Closures und Datenabhängigkeiten enthalten.

### Ergebnis

- Benutzeroberfläche und Verhalten bleiben identisch.
- `app/page.jsx` wurde leicht entlastet und die Admin-/CMS-UI erhält eine erste wiederverwendbare Komponentenbasis.
- Weitere Extraktionen sollten schrittweise erfolgen, jeweils mit einem klar abgegrenzten Bereich und vollständigem Lint-/Build-Nachweis.

### Tests

- `npm run lint`: bestanden über `C:\Program Files\nodejs\npm.cmd`; Hinweis: Babel deoptimiert die Ausgabe von `app/page.jsx` wegen Dateigröße, kein Fehler.
- `npm run build`: bestanden.

## Academy CMS - Admin Content Management System - 2026-07-01

### Umgesetzt

- Bestehenden Admin-Content-Bereich zu `Academy CMS · UI-Prototyp` erweitert.
- Keine neue Route und keine Parallelstruktur erstellt; der vorhandene Adminbereich wurde gezielt ergänzt.
- CMS-Dashboard mit Karten vorbereitet für:
  - Academy Module
  - Videos
  - PDFs
  - Quiz
  - Downloads
  - Growth Center Inhalte
  - Marketing Inhalte
  - KI-Prompts
  - Produktinformationen
  - Kampagnen
- Jede CMS-Karte zeigt:
  - Anzahl Inhalte
  - letzter Stand
  - Status
  - Sprache
  - Aktionen als reine UI: Bearbeiten, Vorschau, Veröffentlichen
- Content-Status vorbereitet:
  - Entwurf
  - In Prüfung
  - Geplant
  - Veröffentlicht
  - Archiviert
- CMS-Such- und Filterleiste erweitert:
  - Suche
  - Kategorie
  - Sprache
  - Status
- Workflow als UI vorbereitet:
  - Erstellen
  - Bearbeiten
  - Prüfen
  - Freigeben
  - Veröffentlichen
- Mobile-first Darstellung:
  - große Karten
  - touchfreundliche Buttons
  - keine Tabellenpflicht auf kleinen Viewports
- Performance berücksichtigt:
  - CMS bleibt im bestehenden Admin-Tab.
  - keine zusätzlichen Datenabfragen.
  - keine neuen Libraries.

### Geänderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Neue Komponenten/Funktionen

- `AdminCmsSectionCard`
- `AdminCmsWorkflowStep`
- `cmsWorkflowSteps`

### Bewusst nicht geändert

- Keine Login-Änderungen.
- Keine Registrierungsänderungen.
- Keine Auth-Änderungen.
- Keine API-Änderungen.
- Keine Datenbankänderungen.
- Keine Supabase-Änderungen.
- Keine R2-/Storage-Änderungen.
- Keine Infrastrukturänderungen.
- Keine produktiven Schreibvorgänge.
- Keine echten CMS-Speicheraktionen.
- Keine bestehenden Partnerdaten geändert.
- Keine neuen Libraries installiert.

### Offene TODOs

- Echte CMS-Datenstruktur für Module, Videos, PDFs, Quiz, Downloads und Growth-Inhalte.
- Serverseitiger Review-/Freigabe-/Publish-Workflow.
- Rollen- und Rechteprüfung für spätere CMS-Mutationen.
- Persistente Mehrsprachigkeit und Content-Versionierung.

### Tests

- `npm run lint`: bestanden über `C:\Program Files\nodejs\npm.cmd`; Hinweis: Babel deoptimiert die Ausgabe von `app/page.jsx` wegen Dateigröße, kein Fehler.
- `npm run build`: bestanden.

## Growth Center - Post Academy Experience - 2026-07-01

### Umgesetzt

- Neuen Dashboard-Navigationspunkt `Growth Center` ergänzt.
- Harbor Growth Center als UI-only Bereich im bestehenden Partner-Dashboard ergänzt.
- Zugriffsvorbereitung umgesetzt:
  - Growth Center zeigt einen Locked State, solange Academy-Abschluss/Zertifikat nicht aus vorhandenen Frontend-Daten ableitbar sind.
  - Admin kann die vorbereitete UI als Preview sehen.
  - Echte serverseitige Freischaltung bleibt bewusst TODO, da keine Auth-/API-/DB-Änderung freigegeben ist.
- Growth Center Startseite vorbereitet mit Kategorien:
  - Marketing
  - Vertrieb
  - Recruiting
  - Social Media
  - KI & Tools
  - Kampagnen
  - Produktneuheiten
  - Downloads
  - Live Trainings
  - Success Stories
- Marketing Hub vorbereitet:
  - Aktuelle Kampagnen
  - Flyer
  - Vorlagen
  - Werbematerial
  - Downloads
- Content Center vorbereitet:
  - Instagram Ideen
  - TikTok Ideen
  - Reels
  - Story Vorlagen
  - WhatsApp Vorlagen
  - Canva Vorlagen
- KI Center vorbereitet:
  - ChatGPT Prompts
  - Claude Prompts
  - Bild-Prompts
  - Video-Prompts
  - Verkaufs-Prompts
- Recruiting Center vorbereitet:
  - Gesprächsleitfäden
  - Einwandbehandlung
  - Recruiting Videos
  - Follow-up Vorlagen
- Produkt Center vorbereitet:
  - Neue Produkte
  - Produktupdates
  - Aktionen
  - Produktwissen
- Leader Growth Bereich vorbereitet:
  - Teamwachstum
  - Leader Schulungen
  - Coaching
  - Führung
  - Teamstrategie
- Premium Dashboard ergänzt:
  - Neue Inhalte
  - Empfohlen für dich
  - Beliebte Inhalte
  - Zuletzt aktualisiert
  - Favoriten als UI
  - Zuletzt angesehen als UI
- Integrationsgrundlage als UI dokumentiert für:
  - CRM
  - n8n
  - WhatsApp
  - KI-Agenten
  - Leonid OS
- Mobile-first Kartenlayout mit großen Touchflächen und kurzer Scrollstruktur beibehalten.
- Performance berücksichtigt:
  - Growth Center rendert nur bei aktivem Dashboard-Tab.
  - keine neuen Datenabfragen.
  - keine neuen Libraries.

### Geänderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Neue Komponenten/Funktionen

- `GrowthCenterSection`
- `GrowthLockedState`
- `GrowthCategoryCard`
- `GrowthDashboardCard`
- `GrowthHubPanel`
- `GrowthLeaderPanel`
- `getGrowthCenterReadiness`

### Bewusst nicht geändert

- Keine Login-Änderungen.
- Keine Registrierungsänderungen.
- Keine Auth-Änderungen.
- Keine API-Änderungen.
- Keine Datenbankänderungen.
- Keine Supabase-Änderungen.
- Keine R2-/Storage-Änderungen.
- Keine Infrastrukturänderungen.
- Keine produktiven Schreibvorgänge.
- Keine bestehenden Partnerdaten geändert.
- Keine neuen Libraries installiert.

### Offene TODOs

- Echte serverseitige Growth-Center-Freischaltung nach Academy-Abschluss und Zertifikat.
- Persistente Favoriten und zuletzt angesehene Inhalte.
- Echte Content-Pflege für Marketing, Recruiting, KI, Produkte und Kampagnen.
- Spätere Anbindung an CRM, n8n, WhatsApp, KI-Agenten und Leonid OS.

### Tests

- `npm run lint`: bestanden über `C:\Program Files\nodejs\npm.cmd`; Hinweis: Babel deoptimiert die Ausgabe von `app/page.jsx` wegen Dateigröße, kein Fehler.
- `npm run build`: bestanden.

## Success Center - Aufgaben & Follow-up Hub - 2026-07-01

### Umgesetzt

- Neuen Dashboard-Navigationspunkt `Success Center` ergänzt.
- Success Center direkt im Startbereich nach dem Login eingebunden, damit Partner sofort `Was muss ich heute tun?` sehen.
- Vollständigen Success-Center-Bereich als eigene Dashboard-Section ergänzt.
- Success Dashboard mit Karten umgesetzt:
  - Heute erledigen
  - Nächster Lernschritt
  - Offene Aufgaben
  - Neue Inhalte
  - Persönliche Empfehlung
  - Offene Termine
  - Letzte Erfolge
- Aufgabenbereich als UI-only vorbereitet mit Status:
  - Offen
  - In Bearbeitung
  - Erledigt
- Aufgabentypen als UI-only vorbereitet:
  - Video ansehen
  - Quiz abschließen
  - Modul beenden
  - Profil vervollständigen
  - Termin buchen
  - Leader kontaktieren
- Persönliche Empfehlungen aus vorhandenen Profil-, Academy- und Onboarding-Daten abgeleitet.
- Professionelle Empty-/Prepared States ergänzt, wenn keine echten Daten vorhanden sind.
- Follow-up Hub als UI vorbereitet:
  - Erstkontakt
  - Rückruf offen
  - Partner wartet
  - Registrierung begonnen
  - Freigabe ausstehend
  - Modul abgeschlossen
  - Zertifikat erhalten
- Leader Success Center vorbereitet mit vorhandenen Aggregatdaten:
  - Neue Partner
  - Partner ohne Modulstart
  - Partner mit niedrigem Fortschritt
  - Offene Teamaufgaben
  - Teamaktivität
- Admin Success Center vorbereitet mit vorhandenen Admin-Daten:
  - Wartende Freigaben
  - Neue Registrierungen
  - Inaktive Partner
  - Leader Aktivität
  - Academy Aktivität
- Mobile UX:
  - große Karten
  - klare Prioritäten
  - touchfreundliche Buttons
  - einspaltige Darstellung auf kleinen Breiten
- Performance berücksichtigt:
  - eigener Success-Bereich rendert nur bei aktivem Dashboard-Tab.
  - kompakte Startansicht nutzt dieselbe Komponente.
  - keine neuen Datenabfragen.
  - keine neuen Libraries.

### Geänderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Neue Komponenten/Funktionen

- `SuccessCenterSection`
- `SuccessOverviewCard`
- `SuccessTaskCard`
- `SuccessStatusBadge`
- `SuccessRecommendationPanel`
- `SuccessFollowUpPanel`
- `LeaderSuccessPanel`
- `AdminSuccessPanel`
- `buildSuccessCenterData`
- `getSuccessTaskStatus`

### Verwendete vorhandene Daten

- vorhandene Partnerprofildaten
- vorhandene Academy-Fortschrittsdaten
- vorhandene Onboarding-Logik
- vorhandene Academy-Updates
- vorhandene Admin-Partnerliste, nur für Admins
- vorhandene Leader-/Team-Aggregatfelder am Partnerprofil

### Bewusst nicht geändert

- Keine Login-Änderungen.
- Keine Registrierungs-Änderungen.
- Keine Auth-Änderungen.
- Keine API-Änderungen.
- Keine Datenbank- oder Supabase-Änderungen.
- Keine Storage-/R2-Änderungen.
- Keine Infrastruktur-Änderungen.
- Keine neuen Serverrouten.
- Keine neuen Libraries.
- Keine produktiven Schreibvorgänge.
- Keine Speicherung von Aufgaben, Follow-ups oder Empfehlungen.
- Keine Änderung an bestehenden Partnerdaten.
- Keine CRM-, n8n-, WhatsApp-, Leonid-OS- oder KI-Agenten-Integration.

### Annahmen / TODO

- Echte Aufgaben benötigen später eine eigene freigegebene Datenstruktur.
- Follow-ups sind aktuell UI-only und werden nicht gespeichert.
- Leader sehen keine personenbezogene Teamliste, solange kein serverseitig gefilterter Team-Endpunkt freigegeben ist.
- Admin-Kennzahlen werden aus der bereits geladenen Admin-Partnerliste abgeleitet.
- Offene Termine bleiben vorbereitet, weil keine echte Terminliste angebunden ist.

### Tests

- `npm run lint`
- `npm run build`

## Notification Center & In-App Benachrichtigungssystem - 2026-07-01

### Umgesetzt

- Bestehenden Dashboard-Bereich `news` als professionelles Notification Center erweitert.
- Sichtbare Navigation zeigt den bestehenden Bereich jetzt als `Benachrichtigungen`.
- Dashboard-Widget `Neueste Benachrichtigungen` ergänzt:
  - letzte 5 sichtbare Meldungen
  - Badge mit Anzahl neuer Meldungen
  - Button `Alle anzeigen`
- Notification Center ergänzt mit:
  - rollenabhängiger Übersicht
  - Filterleiste für Academy, Team, Admin, Leader und System
  - mobilen Benachrichtigungskarten
  - Status `Neu` / `Gelesen`
  - Datum, Kategorie, Typ und Icon
  - professionellem Empty State `Momentan gibt es keine neuen Benachrichtigungen.`
- Rollenlogik ausschließlich im UI aus vorhandenen Daten vorbereitet:
  - Partner: Academy, Leader, System
  - Leader: Team, Academy, Leader
  - Admin: alle Kategorien und Systemübersicht
- Benachrichtigungsarten als UI vorbereitet:
  - neues Modul
  - Modul aktualisiert
  - neues Quiz
  - Zertifikat verfügbar
  - neue Aufgabe
  - Team-Mitteilung
  - Leader-Mitteilung
  - Admin-Mitteilung
  - Systemwartung
- Spätere Modul-Update-Regel sichtbar dokumentiert:
  - Modul-Updates sollen später nur Partner erreichen, die das Modul bereits angesehen oder abgeschlossen haben.
  - Neue Partner sollen keine Benachrichtigung über spätere Module erhalten, die sie noch nicht erreicht haben.
  - Globale Academy-Updates bleiben als bewusste Ausnahme vorbereitet.
- Mobile UX verbessert:
  - Kartenlayout
  - große Touchflächen
  - horizontal scrollbare Filterleiste
  - kurze Wege vom Dashboard zum Center
- Performance berücksichtigt:
  - Notification Center wird nur im aktiven Dashboard-Bereich gerendert.
  - Benachrichtigungen werden aus bereits geladenen `academyUpdates` abgeleitet.
  - keine neuen Datenabfragen und keine neuen Libraries.

### Geänderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Neue / erweiterte UI-Komponenten

- `LatestNotificationsWidget`
- `NotificationCard`
- `NotificationEmptyState`
- `NotificationStatusBadge`
- `NotificationCategoryBadge`
- `NotificationPreparedTypesPanel`
- `NotificationUpdateRulePanel`
- `buildNotificationCenterItems`
- `getNotificationAllowedCategories`
- `getNotificationCategoryFromUpdate`

### Bewusst nicht geändert

- Keine Login-Änderungen.
- Keine Registrierungs-Änderungen.
- Keine Auth-Änderungen.
- Keine API-Änderungen.
- Keine Datenbank- oder Supabase-Änderungen.
- Keine Storage-/R2-Änderungen.
- Keine Infrastruktur-Änderungen.
- Keine neuen Serverrouten.
- Keine neuen Libraries.
- Keine neuen Versandprozesse für E-Mail, WhatsApp, Push oder n8n.
- Keine neuen produktiven Schreibprozesse.
- Keine Änderung an bestehenden Partnerdaten.

### Annahmen / TODO

- Eine eigene persistente Notification-Struktur existiert noch nicht; sichtbare Meldungen stammen aktuell aus den bereits vorhandenen `academyUpdates`.
- Team-, Leader-, Admin- und Systembereiche zeigen bewusst Empty States oder vorbereitete UI, solange keine echten rollenbasierten Notification-Daten vorhanden sind.
- Für späteren Versand braucht es eine separat freigegebene serverseitige Zielgruppenlogik, insbesondere für Modul-Updates nach Lernfortschritt.

### Tests

- `npm run lint`
- `npm run build`

## Kalender & Terminbuchung UI - 2026-06-30

### Umgesetzt

- Bestehende `CalendlySection` zu einer professionellen Kalender- und Terminbuchungsoberflaeche erweitert.
- Terminarten als mobile-first Cards vorbereitet:
  - Telefonberatung
  - Zoom-Beratung
  - Privatfuehrung / Showroom
  - Partner-Onboarding
  - Team-Training
  - Follow-up Gespraech
- Pro Terminart werden Dauer, Beschreibung, verantwortlicher Bereich und Status angezeigt.
- Statusmodell vorbereitet:
  - Verfuegbar
  - Belegt als spaeterer Live-Kalenderstatus
  - Bald verfuegbar
- Direkt buchbare Termine nutzen weiterhin den bestehenden `/termin-buchen`-Flow.
- Leader Kalenderbereich als UI vorbereitet mit:
  - heutige Termine
  - kommende Termine
  - offene Termin-Anfragen
  - Follow-up Termine
  - Partner ohne Termin
- Admin Kalenderuebersicht als UI vorbereitet mit:
  - Terminarten-Uebersicht
  - Leader-Terminuebersicht
  - offene Anfragen
  - Terminarten-Verwaltung als nicht-schreibende UI-Vorbereitung
- Klare Empty States ergaenzt fuer:
  - keine Termine vorhanden
  - keine offenen Anfragen
  - Kalenderintegration noch nicht verbunden
  - Terminbuchung wird vorbereitet
- Mobile UX verbessert:
  - grosse Touch-Buttons
  - Cards statt Tabellen
  - kurze Scrollwege
  - klare CTA `Termin auswaehlen`
- Performance beruecksichtigt:
  - Kalenderbereich rendert nur den aktiven Tab.
  - keine neuen Datenabfragen
  - keine neuen Libraries

### Geaenderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Bewusst nicht geaendert

- Keine Login-Aenderungen.
- Keine Registrierungs-Aenderungen.
- Keine Auth-Aenderungen.
- Keine API-Aenderungen.
- Keine Datenbank- oder Supabase-Aenderungen.
- Keine Storage-/R2-Aenderungen.
- Keine Infrastruktur-Aenderungen.
- Keine echten Kalenderbuchungen, keine Fake-Termine und keine produktiven Schreibvorgaenge.

### Tests

- `npm run lint`
- `npm run build`

## Leader Task & Follow-up Center - 2026-06-30

### Umgesetzt

- Bestehendes Leader Dashboard zu einer taeglichen Leader-Arbeitszentrale erweitert.
- Neue mobile-first Leader-Sektion `Heute erledigen` ergaenzt mit Tabs:
  - Heute
  - Follow-up
  - Neue Partner
  - Teamuebersicht
- Tagesaufgaben ergaenzt fuer:
  - offene Partner
  - fehlende Profilbilder
  - neue Registrierungen
  - neue Freigaben
  - kuerzlich aktive Partner
  - Partner mit geringem Lernfortschritt
  - Partner ohne Modulstart
- Follow-up Kategorien als UI vorbereitet:
  - Erstkontakt
  - Rueckruf offen
  - Termin vereinbaren
  - Registrierung begonnen
  - Freischaltung ausstehend
  - Modul 1 abgeschlossen
  - Inaktiv
- Teamuebersicht verbessert mit Karten fuer:
  - Gesamtpartner
  - aktive Partner
  - inaktive Partner
  - neue Partner
  - Lernfortschritt
- Leader-Kennzahlen nutzen nur vorhandene sichere Aggregatfelder des eingeloggten Partners, insbesondere:
  - `teamPartnerCount`
  - `teamTargetPartnerCount`
  - `teamNewPartnersSinceLastUpdate`
  - vorhandene Academy-/Profilwerte
- Personenbezogene Teamlisten, Follow-ups, Ranking und Schnellprofile zeigen jetzt klare Empty States, wenn kein sicher gefilterter Teamdaten-Endpunkt vorhanden ist.
- Bestehende Beispiel-Teammitglieder werden fuer die operative Leader-Zentrale nicht mehr als sichtbare Teamdaten verwendet.
- Mobile UX verbessert:
  - grosse Touch-Ziele
  - Karten statt Tabellen bei fehlender sicherer Teamliste
  - kuerzere Einstiegswege ueber Tabs
  - klare Empty States statt leerer oder falscher Tabellen
- Performance-Pruefung:
  - Tageszentrum rendert nur den aktuell aktiven Tab.
  - Teamfilter, Tagesaufgaben und Follow-up-Kategorien bleiben lokal/memoisiert.
  - keine neuen Datenabfragen ergaenzt.

### Geaenderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Neue / erweiterte UI-Bereiche

- Erweiterte `LeaderDashboardPreview`
- Leader Tagesfokus-Tabs
- Follow-up Kategorien
- Teamuebersicht-Empty-States
- Sichere Leader-Kennzahlen aus bestehenden Aggregatfeldern

### Bewusst nicht geaendert / TODO

- Kein neuer Teamdaten-Endpunkt erstellt.
- Keine API-, Auth-, Datenbank-, Supabase-, R2-, Storage- oder Infrastruktur-Aenderungen.
- Keine produktiven Schreibvorgaenge.
- Keine echten Nachrichten, WhatsApp- oder E-Mail-Follow-ups.
- Keine Teammitglieder aus globalen Admin- oder Rankingdaten an Leader ausgeliefert.
- Fuer echte personenbezogene Leader-Follow-ups braucht es spaeter einen serverseitig gefilterten Team-Endpunkt mit Rollenpruefung.

### Tests

- `npm run lint` bestanden.
- `npm run build` bestanden.

## Admin Workflow & Partner Operations Center - 2026-06-30

### Umgesetzt

- Bestehenden echten Adminbereich zum Partner-Operations-Center erweitert.
- Neue Admin-only Operations-Sektion mit Tabs ergaenzt:
  - Pending
  - Aktiv
  - Gesperrt
  - Leader
  - Aufgaben
  - Aktivitaet
- Pending-Partner werden jetzt klarer als Freigabe-Queue dargestellt mit:
  - Name
  - E-Mail
  - Telefon/WhatsApp
  - Rabattcode
  - Registrierungsdatum
  - Profilbildstatus
  - Partnerstatus
  - Aktionen Freigeben, Ablehnen, Sperren und Details oeffnen
- Gesperrte, abgelehnte und pausierte Partner koennen ueber die bestehende Status-Update-Logik reaktiviert werden.
- Partnerliste um Leader-Filter erweitert.
- Operativer Aufgabenbereich ergaenzt fuer:
  - offene Freigaben
  - inaktive Partner
  - Partner ohne Profilbild
  - Partner mit niedrigem Fortschritt
  - Leader/Teamkandidaten ohne sichtbare Teamaktivitaet
- Partnerdetailansicht erweitert um:
  - Rollenverwaltungsbereich als sichere UI-Vorbereitung
  - Aktivitaetsprotokoll aus vorhandenen Daten
  - klar gekennzeichneten internen Kommentarbereich
  - Reaktivieren-Aktion fuer blockierte/abgelehnte/pausierte Partner
- Aktivitaetsprotokoll zeigt nur vorhandene Daten:
  - Registrierung
  - Freigabe
  - letzter bekannter Login/Aktivitaetszeitpunkt, sofern vorhanden
  - Modulfortschritt
  - Quiz-Aktivitaet, sofern persistent vorhanden
  - Zertifikat, sofern persistent vorhanden
- Benachrichtigungs-Vorbereitung als UI-only Bereich ergaenzt fuer:
  - Nachricht an Partner
  - Nachricht an Leader
  - globale Systemmeldung
- Mobile-first Darstellung umgesetzt:
  - horizontale Tab-Leiste mit grossen Touch-Zielen
  - Cards auf Mobile
  - bestehende Partnerliste/Detailansicht bleibt responsiv
  - keine ueberladenen Tabellen fuer die neuen Operations-Bereiche
- Performance-Pruefung:
  - Operations-Unterbereiche werden nur fuer den aktiven Tab gerendert.
  - Berechnungen fuer Aufgaben, Rollen-/Leader-Erkennung und Partnergruppen sind memoisiert.
  - keine neuen Datenabfragen ergaenzt.

### Neue Komponenten/Funktionen

- `AdminOperationsCenter`
- `AdminOperationTabButton`
- `AdminPendingReviewCard`
- `AdminOperationsTaskCard`
- `AdminPartnerActivityTimeline`
- `AdminNotificationPreparationPanel`
- `AdminRoleManagementPanel`
- `getAdminOperationalTasks`
- `getAdminPartnerActivityItems`
- `isAdminOperationsLeader`

### Verwendete bestehende Daten/Felder

- Bestehende Partnerliste aus der geschuetzten Admin-Route.
- Bestehende Felder: `status`, `role`, `createdAt`, `email`, `whatsapp`, `discountCode`, `profileImageUrl`, `teamName`, `teamPartnerCount`, `teamNewPartnersSinceLastUpdate`, `academyProgress`, `registrationLog`, `approvalLog`, `emailLog`, `lastActivityAt`, `lastSeenAt`.
- Bestehende Admin-Aktionen: `admin-approve`, `admin-update`, vorhandene Statusupdates und vorhandene Bestaetigungsdialoge.

### Bewusst nicht geaendert / TODO

- Keine Rollen-Schreiblogik aktiviert, weil der bestehende Admin-Update-Endpunkt Rollen nicht als freigegebenen Schreibvertrag unterstuetzt. Rollenverwaltung ist deshalb bewusst UI-only vorbereitet.
- Keine neue Aktivitaetstabelle, kein Audit-Log und keine Fake-Aktivitaet erstellt.
- Keine echte Nachricht-an-Partner-, Leader- oder globale Systemmeldung-Integration gebaut.
- Keine neuen Bulk-Aktionen umgesetzt.
- Keine neuen Datenbankfelder fuer Admin-Kommentare erstellt; bestehendes Notizfeld wird weiterverwendet.

### Geaenderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Nicht geaendert

- Keine Aenderungen an Login.
- Keine Aenderungen an Registrierung.
- Keine Aenderungen an Authentifizierung.
- Keine API-Aenderungen.
- Keine Datenbank- oder Supabase-Aenderungen.
- Keine R2-, Storage-, Environment- oder Infrastruktur-Aenderungen.
- Keine neuen Serverrouten.
- Keine neuen Libraries.
- Keine produktiven Schreibvorgaenge ausser den bereits bestehenden Admin-Aktionen, wenn ein Admin sie manuell ausloest.
- Keine Aenderungen an bestehenden Partnerdaten waehrend der Entwicklung.

### Tests

- `npm run lint` bestanden.
- `npm run build` bestanden.

## Analytics & Business Intelligence Center - 2026-06-30

### Umgesetzt

- Neuer Dashboard-Navigationspunkt `Analytics` fuer Admins und Leader ergaenzt.
- Admin Analytics Center ergaenzt mit:
  - Partner gesamt
  - aktive Partner der letzten 7 / 30 / 90 Tage
  - neue Registrierungen
  - wartende Freigaben
  - gesperrte Accounts
  - durchschnittlicher Lernfortschritt
  - abgeschlossene Module
  - Quiz-Erfolgsquote, sofern persistente Quizdaten vorhanden sind
  - Zertifikatskennzahl, sofern aus bestehenden Fortschrittsdaten ableitbar
- Leader Analytics Center ergaenzt mit teambezogener, sicher begrenzter Sicht:
  - Teamgroesse
  - neue Partner
  - Teamziel
  - eigener Lernfortschritt
  - Top-Performer- und Unterstuetzungsbedarf-Bereiche als sichere UI-Auswertung ohne fremde Teamdaten
- Academy Analytics ergaenzt mit:
  - Modulfortschritt
  - Abschlussrate
  - offenen Lektionen
  - abgeschlossenen Lektionen
  - Video-Auswertung aus vorhandenen Modul-/Progressdaten
- Filter ergaenzt fuer:
  - Zeitraum
  - Status
  - Team/Leader nur fuer Admins
  - Modul
  - Sprache
- CSV-Export fuer sichtbare Analytics-Tabellen clientseitig ergaenzt, ohne neue Abhaengigkeiten und ohne produktive Schreibvorgaenge.
- Loading-, Empty- und Error-State-Karten fuer die Analytics-Oberflaeche ergaenzt.
- Mobile-First Darstellung mit KPI Cards, Tabellen, mobilen Karten, Fortschrittsbalken und einfachen bestehenden Chart-Komponenten umgesetzt.
- Performance-Pruefung durchgefuehrt:
  - Analytics-Bereich wird nur im aktiven Dashboard-Abschnitt gerendert.
  - Filter- und Partnerberechnungen sind memoisiert.
  - keine zusaetzlichen Datenbankabfragen oder API-Routen ergaenzt.

### Verwendete bestehende Daten/Felder

- Bestehende Partnerdaten aus der bereits vorhandenen Admin-Partnerliste.
- Bestehende Felder/Ableitungen: `status`, `role`, `createdAt`, `lastActivityAt`, `teamName`, `teamPartnerCount`, `teamTargetPartnerCount`, `teamNewPartnersSinceLastUpdate`, `preferredLanguage`, `academyProgress`, `aquaLevel`, `aquaPoints`.
- Bestehende Academy-Modul- und Progress-Struktur im Frontend.
- Bestehende Community-Zusammenfassung, sofern bereits geladen.

### Annahmen und bewusst vorbereitete Bereiche

- Persistente Quiz-, Download-, Video-View- und Zertifikatsdaten sind nicht vollstaendig als eigene Tracking-Struktur vorhanden; diese Werte werden deshalb nur angezeigt, wenn sie aus bestehenden Feldern ableitbar sind, sonst sauber als leer bzw. `—`.
- Leader erhalten keine globale Partnerliste im Client; die Leader-Ansicht nutzt nur sichere, bereits am eigenen Partnerprofil vorhandene Team-/Fortschrittswerte.
- Serverseitige Team-Analytics kann spaeter ergaenzt werden, ohne diese UI-Struktur zu ersetzen.

### Geaenderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Nicht geaendert

- Keine Aenderungen an Login.
- Keine Aenderungen an Registrierung.
- Keine Aenderungen an Authentifizierung.
- Keine API-Aenderungen.
- Keine Datenbank- oder Supabase-Aenderungen.
- Keine R2-, Storage-, Environment- oder Infrastruktur-Aenderungen.
- Keine neuen Serverrouten.
- Keine neuen Libraries.
- Keine produktiven Schreibvorgaenge.
- Keine Aenderungen an bestehenden Partnerdaten.

### Tests

- `npm run lint` bestanden.
- `npm run build` bestanden.

## Mobile Modul-/Video-UX und Performance-Pruefung - 2026-06-30

### Umgesetzt

- Academy-Moduldetail erscheint jetzt inline direkt unter der jeweils geoeffneten Modulkarte.
- Beim Oeffnen eines Moduls wird auf Mobile automatisch sauber zum geoeffneten Modulbereich gescrollt.
- Beim Wechsel einer Lektion oder eines Videos wird auf Mobile erneut zum aktiven Modulbereich gescrollt.
- Standardauswahl eines geoeffneten Moduls bevorzugt jetzt die erste Video- oder geplante Video-Lektion:
  - Modul 1 zeigt direkt den vorbereiteten Video-/Willkommensbereich.
  - Modul 2 zeigt direkt Video 1 im geoeffneten Modul.
- Der aktive Video-/Lektionsbereich steht auf Mobile direkt oben im Moduldetail, vor Lernziel, Checkliste, Aufgabe und Notizen.
- Die weiteren Lektionen/Videos des geoeffneten Moduls bleiben direkt im Modul sichtbar ueber die bestehende Lektionen-Navigation.
- Der vorher zusaetzliche komplette Video-Bereich mit allen Modulvideos wurde entfernt, damit nicht mehrere geschuetzte Videos gleichzeitig gerendert und vorbereitet werden.
- Performance-Pruefung durchgefuehrt:
  - schwere Video-Komponenten werden im Moduldetail nur noch fuer die aktive Lektion gerendert.
  - geschuetzte Video-URLs werden dadurch nicht mehr fuer alle Videos eines geoeffneten Moduls gleichzeitig angefordert.
  - bestehende Dashboard-/Admin-/Leader-/Community-Bereiche bleiben weiterhin nur im jeweils aktiven Dashboard-Abschnitt gerendert.

### Geaenderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Nicht geaendert

- Keine Aenderungen an Login.
- Keine Aenderungen an Registrierung.
- Keine Aenderungen an Authentifizierung.
- Keine API-Aenderungen.
- Keine Datenbank- oder Supabase-Aenderungen.
- Keine R2-, Storage-, Environment- oder Infrastruktur-Aenderungen.
- Keine neuen Serverrouten.
- Keine neuen Libraries.
- Keine produktiven Schreibvorgaenge.
- Keine Upload-Funktionen.
- Keine Aenderungen an bestehenden Partnerdaten.
- Bestehende geschuetzte Video- und PDF-Auslieferung bleibt unveraendert.

### Tests

- `npm run lint` bestanden.
- `npm run build` bestanden.

## Gamification, Punkte, Badges & Ranking UI-Prototyp - 2026-06-30

### Umgesetzt

- Neuer Dashboard-Navigationspunkt `Punkte` als sicherer Frontend/UI-Prototyp ergänzt.
- Persönlicher Gamification-Teaser im Partner-Dashboard ergänzt mit:
  - aktuellem Level
  - Punkten bis zum nächsten Level
  - wichtigster nächster Aktion
  - Badge-Hinweisen
  - Mini-Ranking-Position
  - Motivationstext
- Bereich `Punkte & Fortschritt` ergänzt mit Mockdaten für:
  - Gesamtpunkte
  - Wochenpunkte
  - Monatspunkte
  - Academy-Modulpunkte
  - Onboarding-Punkte
  - Community-Punkte
  - Teamaktivitäts-Punkte
  - Fortschritt bis zum nächsten Level
- Level-System ergänzt:
  - Starter
  - Aktiv
  - Builder
  - Team Builder
  - Leader
  - Senior Leader
  - Elite Partner
- Badge-Übersicht ergänzt mit Status, Fortschritt, Datum als UI, Freischaltungs- und Sperrzuständen.
- Ranking-Bereich ergänzt für Top Partner, Wochenranking, Monatsranking, Academy-Ranking, Community-Ranking und Team-Ranking.
- Bereich `Heute Punkte sammeln` ergänzt mit geschätzten Punkten und Navigation zu bestehenden Bereichen.
- Reward-Vorschau ergänzt für Zertifikat, Leader Badge, Ranking-Sichtbarkeit, Leader-Inhalte, Spezialtraining und Team-Anerkennung.
- Leader-Dashboard um Gamification-Vorschau ergänzt:
  - Top 5 Teammitglieder
  - Partner mit starkem Fortschritt
  - Partner mit wenig Aktivität
  - Badge-Verteilung
  - Team-Punkte
  - Team-Level-Fortschritt
- Mobile-first Kartenlayout für Punkte, Badges, Ranking, Aufgaben und Leader-Gamification umgesetzt.

### Geaenderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Nicht geaendert

- Keine Aenderungen an Login.
- Keine Aenderungen an Registrierung.
- Keine Aenderungen an Authentifizierung.
- Keine API-Aenderungen.
- Keine Datenbank- oder Supabase-Aenderungen.
- Keine R2-, Storage-, Environment- oder Infrastruktur-Aenderungen.
- Keine neuen Serverrouten.
- Keine neuen Libraries.
- Keine produktiven Schreibvorgaenge.
- Keine Upload-Funktionen.
- Keine echten Rankings, Punkte oder Partnerdaten gespeichert.
- Bestehende Admin-, Leader-, Dashboard-, Academy-, Onboarding- und Community-Logik bleibt unveraendert.

### Tests

- `npm run lint` bestanden.
- `npm run build` bestanden.

## Community & Kommunikation UI-Prototyp - 2026-06-30

### Umgesetzt

- Neuer Navigationspunkt `Community` als sicherer Frontend/UI-Prototyp ergänzt.
- Hochwertige Community-Startseite ergänzt mit:
  - Begrüßung
  - Community-Status
  - aktive Partner
  - neue Beiträge
  - offene Fragen
  - Top-Beiträge
  - Schnellbutton `Beitrag erstellen`
  - Schnellbutton `Frage stellen`
  - Hinweis auf Community-Regeln
- Moderner Beitragsfeed mit Mockdaten ergänzt:
  - Profilinitialen
  - Name
  - Rolle / Status
  - Zeitpunkt
  - Kategorie
  - Beitragstext
  - Bild-/Datei-Hinweis als UI
  - Likes
  - Kommentare
  - Speichern
  - Melden
  - Button `Antworten`
- Frontend-Filter ergänzt für:
  - alle Beiträge
  - Fragen
  - Erfolge
  - Support
  - Produkt
  - Recruiting
  - Team
  - Neueste
  - Beliebteste
  - Unbeantwortet
- Beitrag-erstellen-UI ergänzt mit:
  - Beitragstyp
  - Kategorie
  - Textfeld
  - Datei-/Foto-Anhang als UI
  - Sichtbarkeit Alle / Team / Leader / Admin
  - Button `Veröffentlichen` als UI-only
- Fragen-&-Antworten-Bereich ergänzt mit:
  - Suchleiste
  - häufige Fragen
  - offene Fragen
  - beantwortete Fragen
  - Kategorien
  - Antwortkarten
  - `Antwort als hilfreich markieren` als UI
  - `Videoantwort vorhanden` Hinweis als UI
- Offizielle Ankündigungen als UI/Mockdaten ergänzt:
  - Admin-Ankündigungen
  - neue Schulungen
  - neue Termine
  - neue Produkte
  - wichtige Updates
  - Systemhinweise
- Leader-Kommunikationsbereich ergänzt mit:
  - Nachricht an Team vorbereiten
  - Follow-up Vorlagen
  - Partner motivieren
  - Onboarding-Erinnerung
  - Event-Einladung
  - WhatsApp-Text kopieren als UI
- Community-Regelkarte ergänzt.
- Moderationsvorschau für Admin/Leader ergänzt mit gemeldeten Beiträgen, offenen Supportfragen, Prüfstatus und schnellen UI-Aktionen.
- Mobile-first Darstellung für Feed, Composer, Q&A, Ankündigungen, Leader-Kommunikation und Moderation ergänzt.

### Geaenderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Nicht geaendert

- Keine Aenderungen an Login.
- Keine Aenderungen an Registrierung.
- Keine Aenderungen an Authentifizierung.
- Keine API-Aenderungen.
- Keine Datenbank- oder Supabase-Aenderungen.
- Keine R2-, Storage-, Environment- oder Infrastruktur-Aenderungen.
- Keine neuen Serverrouten.
- Keine neuen Libraries.
- Keine produktiven Schreibvorgaenge.
- Keine Upload-Funktionen.
- Keine echten Nachrichten oder WhatsApp-Integrationen.
- Keine bestehenden Partnerdaten geaendert.

### Tests

- `npm run lint` bestanden.
- `npm run build` bestanden.

## Academy Content Management UI-Prototyp - 2026-06-29

### Umgesetzt

- Professionelles Content-Management-Center im bestehenden Adminbereich ergänzt.
- Umsetzung ist ausschließlich Frontend/UI mit klarer Kennzeichnung als Prototyp ohne Backend-Aktion.
- Modulverwaltung ergänzt mit:
  - Titel
  - Kategorie
  - Status Entwurf / Aktiv / Archiviert
  - Dauer
  - Reihenfolge
  - Sichtbarkeit
  - Fortschritt
  - UI-Aktionen Bearbeiten, Vorschau, Aktivieren und Archivieren
- Video-Verwaltung ergänzt mit:
  - Video-Liste
  - Modulzuordnung
  - Dauer
  - Status
  - Vorschau-Button
  - Upload-Hinweis als reine UI ohne echten Upload-Flow
- PDF-/Download-Verwaltung ergänzt mit:
  - Dokumentenliste
  - Kategorie
  - Sprache
  - Modulzuordnung
  - Sichtbarkeit
  - Download-Vorschau als UI-only
- Quiz-Verwaltung ergänzt mit:
  - Quiz-Liste
  - Modulzuordnung
  - Anzahl Fragen
  - Bestehensgrenze
  - Status
  - Button `Quiz bearbeiten` als UI-only
- Aufgaben-Verwaltung ergänzt mit:
  - Tagesaufgaben
  - Partner-Aufgaben
  - Leader-Aufgaben
  - Status
  - Priorität
- Content-Kalender ergänzt mit geplanten Inhalten, Veröffentlichungsdatum, Status und Kategorie.
- Bestehende Read-only-Strukturübersicht für Modulkatalog, Übersetzungs-Parität und Video-Untertitel bleibt erhalten.
- Mobile-first Darstellung für Modulverwaltung, Video-/Dokumentenlisten, Quiz, Aufgaben und Content-Kalender ergänzt.

### Geaenderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Nicht geaendert

- Keine Aenderungen an Login.
- Keine Aenderungen an Registrierung.
- Keine Aenderungen an Authentifizierung.
- Keine API-Aenderungen.
- Keine Datenbank- oder Supabase-Aenderungen.
- Keine R2-, Storage-, Environment- oder Infrastruktur-Aenderungen.
- Keine neuen Libraries.
- Keine produktiven Schreibvorgaenge.
- Keine Upload-Funktionen.
- Keine bestehenden Partnerdaten geaendert.

### Tests

- `npm run lint` bestanden.
- `npm run build` bestanden.

## Leader Dashboard & Teamsteuerung UI-Prototyp - 2026-06-29

### Umgesetzt

- Neuer professioneller Leader-Dashboard-Prototyp als reine Frontend/UI-Erweiterung ergänzt.
- Neuer Navigationspunkt `Teamsteuerung` im bestehenden Dashboard ergänzt.
- Leader-Übersicht mit Mockdaten ergänzt:
  - Team gesamt
  - aktive Partner
  - neue Partner diese Woche
  - Pending-Partner
  - abgeschlossene Onboardings
  - durchschnittlicher Academy-Fortschritt
  - Top Performer
  - offene Teamaufgaben
- Teamkarten mit Profilinitialen, Name, Status, Rolle/Level, Team, Fortschritt, letzter Aktivität, abgeschlossenen Modulen und Punkten ergänzt.
- Responsive Teamtabelle mit Suche, Filter und Sortierung ergänzt.
- Filter vorbereitet für:
  - alle Partner
  - Pending
  - freigegeben
  - aktiv
  - inaktiv
  - Top Partner
- Team-Readiness-Bereich ergänzt:
  - Profil komplett
  - Onboarding gestartet
  - erstes Modul abgeschlossen
  - Follow-up nötig
  - bereit für Kundengespräch
  - bereit für Recruiting
- Follow-up Center mit Gründen, empfohlenen Aktionen und vorbereiteten WhatsApp-Texten als UI-only ergänzt.
- Teamziel-Bereich für 500 Partner, Wochenziel, Monatsziel und nächste Leader-Aufgabe ergänzt.
- Ranking-Vorschau mit Top 5, Punkten, Fortschritt, Badge und Trend ergänzt.
- Mobile-first Darstellung für Teamkarten, Teamtabelle, Follow-up Center und Ranking ergänzt.
- Alle neuen Aktionen sind bewusst UI-only und lösen keine Backend-, Schreib- oder Messenger-Aktionen aus.

### Geaenderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Nicht geaendert

- Keine Aenderungen an Login.
- Keine Aenderungen an Registrierung.
- Keine Aenderungen an Authentifizierung.
- Keine API-Aenderungen.
- Keine Datenbank- oder Supabase-Aenderungen.
- Keine R2-, Storage-, Environment- oder Infrastruktur-Aenderungen.
- Keine Serverrouten.
- Keine neuen Libraries.
- Keine produktiven Schreibvorgaenge.
- Keine bestehenden Partnerdaten geaendert.

### Tests

- `npm run lint` bestanden.
- `npm run build` bestanden.

## Admin Dashboard 2.0 UI-Prototyp - 2026-06-29

### Umgesetzt

- Neuer professioneller Admin-Dashboard-Prototyp im bestehenden Adminbereich ergaenzt.
- Umsetzung ist ausschliesslich Frontend/UI mit klar markierten Mockdaten.
- Moderne Statistikkarten ergaenzt:
  - Partner gesamt
  - Freigegeben
  - Pending
  - Gesperrt
  - Neue Registrierungen
  - Aktive Partner
  - Neue Uploads
  - Module abgeschlossen
- Partnerverwaltungs-Prototyp mit Profilbild/Initialen, Name, Status, Team, Registrierung, Fortschritt und UI-Aktionen ergaenzt.
- Suche, Filter, Sortierung und Pagination als lokale UI-Funktionen umgesetzt.
- Responsive Partnerliste mit Desktop-Tabelle und mobiler Kartenansicht ergaenzt.
- Partner-Detail-Prototyp mit Profil, Kontaktdaten, Instagram, WhatsApp, Team, Sponsor, Level, Punkten, Ranking, abgeschlossenen Modulen, Uploads, Quiz, Notizen, Admin-Kommentar und Aktivitaet ergaenzt.
- UI-Aktionsbuttons fuer Freigeben, Sperren, Profil ansehen, Nachricht senden, Reset Passwort, Bearbeiten und Loeschen ergaenzt.
- Academy-Verwaltungs-Prototyp fuer Module, Videos, PDFs, Quiz, Reihenfolge, Sichtbarkeit und Veroeffentlichung ergaenzt.
- Mock-Charts fuer Registrierungen, Aktivitaet, Fortschritt und Module ergaenzt.

### Geaenderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Nicht geaendert

- Keine Aenderungen an Login.
- Keine Aenderungen an Registrierung.
- Keine Aenderungen an Authentifizierung.
- Keine API-Aenderungen.
- Keine Datenbank- oder Supabase-Aenderungen.
- Keine R2-, Storage-, Environment- oder Infrastruktur-Aenderungen.
- Keine Serveraenderungen.
- Keine neuen Libraries.
- Keine produktiven Schreibvorgaenge.
- Bestehende produktive Admin-Logik bleibt unveraendert.

### Tests

- `npm run lint` bestanden.
- `npm run build` bestanden.

## Premium Academy Learning Experience - 2026-06-29

### Umgesetzt

- Academy-Bereich zu einer Premium-Lernplattform erweitert.
- Neue Academy-Startseite im Modulbereich mit:
  - persoenlicher Begruessung
  - Gesamtfortschritt
  - Kreis-Fortschrittsanzeige
  - zuletzt bearbeitetem Modul
  - empfohlener naechster Lektion
  - Button `Weiterlernen`
  - motivierendem Statusbereich
- Modulseiten erweitert um:
  - Hero-Bereich
  - Lernziel
  - geschaetzte Dauer
  - Schwierigkeitsgrad
  - Kategorien/Tags
  - moderne Modulfortschrittsanzeige
  - Checkliste
  - Video-Bereich
  - Downloadbereich
  - lokale Notizen
  - Aufgabenbereich
- Motivationselement `Dein naechster Schritt` mit naechstem Modul, offenen Aufgaben, Motivation und geschaetzter Lernzeit ergaenzt.
- Zertifikats-Vorschau als reine UI ohne PDF-Erzeugung und ohne Speicherung ergaenzt.
- Premium Schwarz-Gold-Stil mit verbesserten Karten, Hover-Zustaenden, Touch-Zielen und responsiven Layouts weiter ausgebaut.
- Bestehende Academy-Video-, Download- und Modulkomponenten werden weiterverwendet.

### Geaenderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Nicht geaendert

- Keine Aenderungen an Login.
- Keine Aenderungen an Registrierung.
- Keine Aenderungen an Authentifizierung.
- Keine Datenbank- oder Supabase-Aenderungen.
- Keine R2-, Storage-, Environment- oder Infrastruktur-Aenderungen.
- Keine API- oder Protected-Asset-Routen geaendert.
- Keine neuen Libraries.
- Keine produktiven Schreibvorgaenge.
- Keine bestehenden Partnerdaten geaendert.

### Tests

- `npm run lint` bestanden.
- `npm run build` bestanden.

## Partner Onboarding-Assistent - 2026-06-29

### Umgesetzt

- Neuer Onboarding-Assistent fuer neue Partner im Startbereich direkt nach dem Login.
- Dashboard zeigt denselben Onboarding-Fahrplan und verlinkt den jeweils naechsten Schritt.
- Schritt-fuer-Schritt-Checkliste ergaenzt:
  - Profilfoto hochladen
  - Stammdaten vervollstaendigen
  - Instagram/WhatsApp optional hinterlegen
  - Willkommen-Modul ansehen
  - erstes Academy-Modul abschliessen
  - erstes Quiz bestehen
  - Termin mit Sponsor/Support buchen
  - ersten Wassertest durchfuehren
  - erste Praesentation ansehen
  - Onboarding abschliessen
- Fortschrittsanzeige mit Prozentwert, erledigten Pflichtschritten und naechstem empfohlenem Schritt ergaenzt.
- Automatische Checks nutzen nur vorhandene Partnerdaten und vorhandene Academy-Fortschrittsdaten.
- Manuelle Haken werden ausschliesslich lokal in der laufenden Sitzung gehalten und nicht an den Server geschrieben.
- Mobile-First Darstellung mit grossen Touch-Zielen, klaren Statusanzeigen und bestehendem Schwarz-Gold-Stil umgesetzt.

### Geaenderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Nicht geaendert

- Keine Aenderungen an Login.
- Keine Aenderungen an Registrierung.
- Keine Aenderungen an Authentifizierung.
- Keine Datenbank- oder Supabase-Aenderungen.
- Keine R2-, Storage-, Environment- oder Infrastruktur-Aenderungen.
- Keine API- oder Protected-Asset-Routen geaendert.
- Keine neuen Libraries.
- Keine produktiven Schreibvorgaenge.
- Keine bestehenden Partnerdaten geaendert.

### Tests

- `npm run lint` bestanden.
- `npm run build` bestanden.

## Partner Academy Modul-System - 2026-06-29

### Umgesetzt

- Neue Partner-Moduluebersicht mit 13 Launch-Modulen ergaenzt:
  - Willkommen & Start
  - Erste Schritte
  - Wasserwissen
  - Produkte verstehen
  - PPM-Test
  - Tee-Test
  - Kundengespraech
  - Einwandbehandlung
  - WhatsApp-Praesentation
  - Recruiting
  - Teamaufbau
  - Social Media
  - Downloads & Unterlagen
- Modul-Karten mit Titel, Beschreibung, Kategorie, Dauer, Status, Fortschritt, CTA sowie Video-/PDF-/Aufgaben-Hinweisen erstellt.
- Frontend-only Fortschrittslogik fuer Gesamtfortschritt, abgeschlossene Module und naechstes empfohlenes Modul ergaenzt.
- Modul-Detailbereich mit Lernziel, Einfuehrung, Schritten, Videos, PDFs, Aufgabe, Abschluss-Button und Ruecknavigation erstellt.
- Bestehende geschuetzte Academy-Video- und Dokumentenlogik wird weiterverwendet; keine neuen Upload- oder Storage-Flows.
- Partner-Dashboard zeigt Academy-Fortschritt, abgeschlossene Module und den naechsten empfohlenen Lernschritt deutlicher an.
- Mobile-First Darstellung der Moduluebersicht und Detailansicht mit grossen Touch-Zielen und Schwarz-Gold-Stil umgesetzt.

### Geaenderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Nicht geaendert

- Keine Aenderungen an Login.
- Keine Aenderungen an Registrierung.
- Keine Aenderungen an Authentifizierung.
- Keine Datenbank- oder Supabase-Aenderungen.
- Keine R2-, Storage-, Environment- oder Infrastruktur-Aenderungen.
- Keine API-Sicherheits- oder Protected-Asset-Routen geaendert.
- Keine neuen Libraries.
- Keine bestehenden Partnerdaten geaendert.

### Tests

- `npm run lint` bestanden.
- `npm run build` bestanden.

## Partner-Dashboard und Profilseite UX-Fertigstellung - 2026-06-28

### Umgesetzt

- Partner-Dashboard um mobile-freundliche Quick Actions fuer Profil, Training und Terminbuchung ergaenzt.
- Dashboard zeigt jetzt einen klaren naechsten Schritt, Onboarding-Fortschritt und kompakte Readiness-Hinweise fuer Profilbild, Team und Onboarding.
- Sichtbarer Partnerstatus im Dashboard von technischem `Approved` auf `Freigegeben` vereinheitlicht.
- Profilseite startet jetzt direkt mit Profilfoto, Stammdaten, Instagram und Benachrichtigungseinstellungen.
- Karriere-, Team-, Ranking- und Verlaufspanels bleiben erhalten, sind aber nach den eigentlichen Profilaktionen angeordnet.
- Profilfoto-Aktionen sind auf Mobilgeraeten besser antippbar und nutzen volle Breite.
- Profilseite zeigt eine kompakte Readiness-Uebersicht fuer Profilfoto, Instagram, Team und Benachrichtigungen.

### Geaenderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Nicht geaendert

- Keine Aenderungen an Login.
- Keine Aenderungen an Registrierung.
- Keine Aenderungen an Authentifizierung.
- Keine Datenbank- oder Supabase-Aenderungen.
- Keine Infrastruktur-Aenderungen.
- Keine neuen Libraries.

## Storage-Migration Cloudflare R2 - 2026-06-27

### Umgesetzt

- Zentrale Cloudflare-R2-Storage-Abstraktion ohne neue Library erstellt.
- S3-kompatible R2-Signierung mit nativen Node.js-/Fetch-Funktionen ergänzt.
- Neue Profilbild-Uploads werden in Cloudflare R2 gespeichert.
- Bestehende Supabase-Storage-Profilbilder bleiben als Legacy-Fallback weiterhin abrufbar und löschbar.
- Community-Dateianhänge werden für neue Uploads in Cloudflare R2 gespeichert.
- Bestehende Community-Anhänge aus Supabase Storage bleiben beim Löschen über den Legacy-Pfad berücksichtigt.
- Dateigrößenlimits in der Storage-Abstraktion vorbereitet: Profilbilder 5 MB, PDFs/Dokumente 25 MB, Videos 500 MB, Zertifikate 25 MB.
- R2-Environment-Variablen in `.env.example` dokumentiert.
- Production-Runtime-Test ohne Vercel-Env-Metadaten durchgefuehrt.
- R2-Endpunkt-Fallback fuer EU-Jurisdiction-Buckets ergaenzt.
- Runtime-Konfiguration erreicht Cloudflare R2; verbleibender Production-Blocker ist `AccessDenied` durch Cloudflare-R2-Berechtigung oder Bucket-Scope.
- Temporaere Runtime-Test-Route wurde nach der Diagnose wieder entfernt.
- Keine Vercel-Blob-Abhängigkeit gefunden oder benötigt.

### Geänderte Dateien

- `lib/storage/r2.ts`
- `app/api/partners/route.js`
- `app/api/community/route.js`
- `.env.example`
- `CHANGELOG.md`

### Nicht geändert

- Keine Datenbankänderungen.
- Keine Migrationen.
- Keine Supabase-Tabellenänderungen.
- Keine Änderungen an Login oder Registrierung.
- Keine Änderungen an bestehenden Partnerdaten.
- Keine neuen Libraries.
- Production-Deployment wurde fuer Runtime-Pruefung ausgefuehrt; Upload bleibt bis zur Cloudflare-R2-Berechtigungskorrektur blockiert.

## Priorität 1.6 - Geschützte Academy-Assets - 2026-06-26

### Umgesetzt

- Academy-PDFs und Academy-Videos aus der öffentlichen `public`-Auslieferung entfernt.
- Leere Public-Asset-Ordner für Academy-Dokumente und Academy-Videos entfernt, damit alte Direktpfade nicht durch statische Public-Auslieferung überschattet werden.
- Bisher öffentliche Academy-PDFs in die bestehende geschützte Dokumentroute übernommen.
- `/api/academy-documents` erweitert:
  - alle Academy-PDFs werden nur noch nach gültiger Session ausgeliefert.
  - Partner müssen serverseitig `approved` sein.
  - Admins bleiben zugriffsberechtigt.
  - fehlende Session liefert `401`, nicht freigegebene Partner liefern `403`.
- Neue geschützte Route `/api/academy-videos` ergänzt:
  - serverseitige Authentifizierung und Partnerstatusprüfung für signierte Video-URLs.
  - Adminzugriff erlaubt.
  - kurzlebige signierte Video-URLs ohne Session-Token in der URL.
  - Range-Requests mit `206 Partial Content`, `Content-Range` und `Accept-Ranges` vorbereitet.
  - Video-Auslieferung mit `Content-Type: video/mp4` und `Cache-Control: private, no-store`.
- Client-Videoquellen auf signierte geschützte Asset-URLs umgestellt.
- Downloadkatalog so angepasst, dass alle Academy-PDFs über `/api/academy-documents` geöffnet werden.
- Alte direkte Pfade `/academy-documents/customer/:file` und `/academy-videos/:file` werden vor statischer Auslieferung auf geschützte APIs umgeschrieben.
- Legacy-Route-Handler für alte direkte PDF- und Video-Pfade ergänzt, damit bekannte URLs geschützt beantwortet werden.
- Next.js Proxy ergänzt, um alte Academy-Asset-Pfade zuverlässig vor statischer Auslieferung auf die geschützten APIs umzuschreiben.
- File-Tracing für private PDFs und Videos im Produktionsbuild ergänzt.

### Verschobene Dateien

- `public/academy-documents/customer/*.pdf` nach `academy-documents/private/`
- `public/academy-videos/*.mp4` nach `academy-videos/private/`

### Geänderte Dateien

- `app/api/academy-asset-auth.js`
- `app/api/academy-documents/route.js`
- `app/api/academy-videos/route.js`
- `app/academy-documents/customer/[file]/route.js`
- `app/academy-videos/[file]/route.js`
- `app/lib/academy-downloads.js`
- `app/page.jsx`
- `next.config.js`
- `proxy.js`
- `CHANGELOG.md`

### Nicht geändert

- Keine Datenbankänderungen.
- Keine Migrationen.
- Keine Supabase-Strukturänderungen.
- Keine Änderungen an Login oder Registrierung.
- Keine Änderungen an bestehenden Partnerdaten.
- Keine neuen Libraries.

## Phase 1.4 - Finaler Responsive Launch-Test - 2026-06-26

### Umgesetzt

- Finalen Launch-Review für Responsive Design, sichtbare Placeholder, Navigation, Academy-Bereiche, Community, Terminbuchung, Profil, Adminbereich und Rechtstexte durchgeführt.
- Sichtbaren deaktivierten Audio-Button im Community-Composer entfernt, weil die Funktion nicht launch-fertig war.
- Community-Composer auf drei tatsächlich verfügbare Aktionen reduziert:
  - Emoji einfügen
  - Bild hochladen
  - Datei hochladen
- Sichtbaren Phase-2-Hinweis im Community-Composer entfernt.
- Veralteten Admin-Hinweis zu Instagram-Profilen ersetzt; der Text verweist nicht mehr auf Server-Admin-Variablen.
- Sichtbare Admin-Terminologie von `Video-Platzhalter` auf `geplante Videos` beziehungsweise `Geplant` geändert.
- Download-Center-Leerzustand sprachlich bereinigt und den Begriff `Platzhalterdateien` entfernt.

### Geänderte Dateien

- `app/page.jsx`
- `app/components/AcademyContentAdminOverview.jsx`
- `app/lib/academy-downloads.js`
- `CHANGELOG.md`

### Nicht geändert

- Keine Datenbankänderungen.
- Keine Migrationen.
- Keine Supabase-Änderungen.
- Keine Änderungen an Login, Registrierung, Authentifizierung oder Partnerdaten.
- Keine neuen Libraries.
- Keine neuen Features oder Business-Logik.

### Prüfergebnis

- Statische Responsive-Prüfung für 320, 360, 375, 390, 430 Pixel, Tablet, Desktop und Wide Screen durchgeführt.
- Automatisierte lokale Browser-Screenshots konnten in dieser Umgebung nicht zuverlässig erstellt werden, weil die verfügbare Browser-Automation den lokalen Harbor-Server nicht stabil laden konnte.
- Es wurden keine visuellen Tests simuliert oder als bestanden ausgegeben.
- `npm run lint` und `npm run build` wurden nach den Änderungen erneut ausgeführt.

## Phase 1.3 - Rechtstexte & Launch-Compliance - 2026-06-25

### Umgesetzt

- Impressum auf die aktuelle Anbieterkennzeichnung nach DDG angepasst.
- Kontaktinformationen, Verantwortlichkeit nach MStV, Haftungshinweise und Urheberrechtshinweise im Impressum ergänzt.
- Datenschutzerklärung präzisiert:
  - Rechtsgrundlagen ergänzt.
  - Dienstleister und Empfänger klarer benannt.
  - Supabase korrekt als Datenbank und Storage beschrieben.
  - Google-Analytics-/Marketing-Cookie-Hinweis entfernt, da im Code keine solche Implementierung vorhanden ist.
  - Browser-Speicherung für Session, Sprache und UI-/Audio-Präferenzen transparent beschrieben.
  - Drittlandhinweise, Betroffenenrechte, Widerruf, Beschwerderecht und fehlende automatisierte Entscheidungsfindung ergänzt.
- Nutzungsbedingungen um Haftungseinordnung, Urheberrecht, Vertraulichkeit und externe Dienste ergänzt.
- Rechtstextseiten gegenseitig verlinkt und mobile Umbrüche gegen horizontales Scrollen abgesichert.
- Eine 404-Seite mit direkter Navigation zu Impressum, Datenschutz und Nutzungsbedingungen ergänzt.

### Geänderte Dateien

- `app/impressum/page.jsx`
- `app/datenschutz/page.jsx`
- `app/nutzungsbedingungen/page.jsx`
- `app/not-found.jsx`
- `CHANGELOG.md`

### Nicht geändert

- Keine Datenbankänderungen.
- Keine Migrationen.
- Keine Supabase-Änderungen.
- Keine Änderungen an Login, Registrierung oder Authentifizierung.
- Keine Änderungen an bestehenden Partnerdaten.
- Keine neuen Libraries.
- Keine Cookie-Banner-Funktion ergänzt, weil im geprüften Code keine nicht notwendigen Tracking- oder Marketing-Cookies gefunden wurden.

## Version 1.4 - Priorität 1.2 Admin-Aktionsschutz - 2026-06-25

### Umgesetzt

- Zentrale Bestätigungslogik für irreversible und dauerhaft speichernde Admin-Aktionen ergänzt.
- Partner-Freigabe, Partnerstatusänderungen, Partnerdaten-Speicherung, Reminder-Versand und Partnerlöschung werden vor Ausführung bestätigt.
- Kritische Lösch- und Reset-Aktionen verlangen zusätzlich eine Texteingabe:
  - `LÖSCHEN` für Partnerlöschung, Testdatenbereinigung, Profilbildlöschung, Chat-Nachrichtenlöschung und Testimonial-Löschung.
  - `ZURÜCKSETZEN` für administratives Zurücksetzen von Partnerdaten.
- Admin-Profilbild ändern/löschen für Partner wird vor Speicherung bestätigt.
- Academy-Update als Entwurf speichern oder veröffentlichen wird vor Speicherung bestätigt.
- Community-Adminaktionen abgesichert:
  - Chat-Nachricht löschen
  - Q&A-Antwort administrativ bearbeiten
  - Beste Antwort markieren
- Testimonial-Adminaktionen abgesichert:
  - freigeben
  - ablehnen
  - ausblenden
  - bearbeiten
  - löschen
- Abgebrochene Partnerlöschungen schließen die Detailansicht nicht mehr fälschlich.

### Geänderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Nicht geändert

- Keine Datenbankänderungen.
- Keine Migrationen.
- Keine Supabase-Änderungen.
- Keine Änderungen an Login oder Registrierung.
- Keine Änderungen an bestehenden Partnerdaten.
- Keine neuen Libraries.

## Defekter PDF-Link - 2026-06-25

### Behoben

- Fehlerhafte PDF-Referenz im Academy-Modul `Aqua Global Grundlagen` korrigiert.
- Die Modulressource `Praesentation Wasser` verweist jetzt auf die vorhandene Download-ID `wasser-praesentation`.
- Alle statischen PDF-Download-Referenzen wurden gegen den Downloadkatalog und die vorhandenen PDF-Dateien geprueft.

### Geaenderte Dateien

- `app/lib/academy-content.js`
- `CHANGELOG.md`

### Nicht geaendert

- Keine Datenbankaenderungen.
- Keine Migrationen.
- Keine Supabase-Aenderungen.
- Keine Aenderungen an Login oder Registrierung.
- Keine Aenderungen an Partnerdaten.

## Phase 5C Teil 6 - Responsive Abschlussprüfung - 2026-06-20

### Durchgeführt

- Lokalen Harbor-Testserver nach ausdrücklicher Freigabe auf Port 3185 gestartet.
- Partner-Testroute und Terminbuchungsroute liefern lokal HTTP 200.
- Responsive Strukturprüfung für die Zielbreiten 320, 375 und 430 Pixel durchgeführt:
  - kompakte mobile Navigation mit fünf Spalten
  - begrenztes und intern scrollbareres `Mehr`-Menü
  - kein absichtlich breiter Hauptinhaltscontainer
  - mobile Terminseite startet einspaltig
  - Download Center startet einspaltig
  - Lektionen-Navigation verwendet Breitenbegrenzungen
- Die einzige feste Mindestbreite von 760 Pixel liegt in einer bewusst intern horizontal scrollbareren Preistabelle und erzeugt keinen vorgesehenen Seitenüberlauf.
- Finalen Lint- und Produktions-Build erneut ausgeführt.

### Screenshot-Blocker

- Die In-App-Browser-Sicherheitsrichtlinie blockiert in dieser Sitzung automatisierte Zugriffe auf den lokalen `127.0.0.1`-Tab.
- Deshalb konnten die geforderten neuen Screenshots bei 320, 375 und 430 Pixel nicht automatisiert erstellt werden.
- Es wurden keine Screenshots simuliert und kein visueller Browsertest fälschlich als bestanden dokumentiert.
- Für den vollständigen Launch-Nachweis bleibt ein manueller visueller Re-Test der drei Zielbreiten erforderlich.

### Geänderte Dateien

- `CHANGELOG.md`

## Phase 5C Teil 5 - Partnerstatus-Übersetzungen - 2026-06-20

### Umgesetzt

- Technische Partnerstatuswerte werden in der sichtbaren Admin-Oberfläche vollständig auf Deutsch dargestellt.
- `pending`, `approved` und `blocked` erscheinen als `Wartend`, `Freigegeben` und `Blockiert`.
- Zusätzlich werden `rejected`, `paused` und `review` als `Abgelehnt`, `Pausiert` und `In Prüfung` dargestellt.
- Statusfilter, Statusbadges, Partnerdetail, Statusauswahl und Testimonial-Verwaltung verwenden dieselbe zentrale Beschriftung.
- Die gespeicherten technischen Statuswerte und sämtliche Freigabelogik bleiben unverändert.
- Keine Änderung an Login, Registrierung, Datenbank, Supabase oder Partnerdaten.

### Geänderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

## Phase 5C Teil 4 - Sichtbare Texte - 2026-06-20

### Umgesetzt

- Sichtbare deutsche Academy-Texte auf korrekte Umlaute und einheitliche Schreibweisen bereinigt.
- Den Partnerbereich einheitlich als `Download Center` bezeichnet.
- Schreibgeschützte Admin- und Modulbereiche einheitlich mit `Nur Lesen` gekennzeichnet.
- Produkt-, Preis-, Startcenter- und Downloadtexte sprachlich vereinheitlicht.
- `Academy Support` einheitlich als `Academy-Support` geschrieben.
- Calendly-Hinweise sprachlich gestrafft und ohne HTML-Zeichenreferenzen vereinheitlicht.
- Login- und Registrierungstexte blieben unverändert.
- Keine Änderung an Datenbank, Supabase oder Partnerdaten.

### Geänderte Dateien

- `app/page.jsx`
- `app/lib/academy-content.js`
- `app/lib/academy-downloads.js`
- `app/components/AcademyContentAdminOverview.jsx`
- `app/termin-buchen/BookingPageClient.jsx`
- `CHANGELOG.md`

## Phase 5C Teil 3 - Quiz-Fehlerzustände - 2026-06-20

### Umgesetzt

- Lokales Quiz um die eindeutigen Zustände `Offen`, `Nicht bestanden` und `Bestanden` ergänzt.
- Bei weniger als 70 Prozent werden Punktzahl, Bestehensgrenze und ein klarer Hinweis für den nächsten Versuch angezeigt.
- Unvollständige Quizversuche geben weiterhin eine sichtbare Fehlermeldung aus.
- Antwortschaltflächen melden ihren Auswahlzustand über `aria-pressed`.
- Der beantwortete Anteil ist als zugänglicher Fortschrittsbalken ausgezeichnet.
- Ergebnis- und Fehlermeldungen werden für assistive Technologien angekündigt.
- Quizantworten und Ergebnisse bleiben ausschließlich im lokalen React-Sitzungszustand.
- Keine Änderung an Login, Registrierung, Datenbank, Supabase oder Partnerdaten.

### Geänderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

## Phase 5C Teil 2 - Mobile Hauptnavigation - 2026-06-20

### Umgesetzt

- Die bisher vollständig mehrzeilige mobile Hauptnavigation auf vier zentrale Einstiege plus `Mehr` reduziert.
- Startcenter, Dashboard, Module und Profil bleiben direkt erreichbar.
- Weitere Academy-Bereiche werden in einem aufklappbaren, intern scrollbar begrenzten Menü dargestellt.
- Der aktive Bereich bleibt in beiden Navigationsebenen sichtbar markiert.
- Benachrichtigungszähler bleiben erhalten.
- Die Desktop-Seitennavigation und alle Rollenprüfungen bleiben unverändert.
- Keine Änderung an Login, Registrierung, Datenbank, Supabase oder Partnerdaten.

### Geänderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

## Phase 5C Teil 1 - Calendly-Navigation - 2026-06-20

### Umgesetzt

- Der Dashboard-Navigationspunkt `Calendly` öffnet jetzt die vorhandene interne Terminübersicht statt direkt einen neuen Browser-Tab.
- Die interne Terminübersicht führt für den verfügbaren Academy-Support-Termin gezielt auf `/termin-buchen?termin=academySupport`.
- Nicht konfigurierte Terminarten werden klar als `In Vorbereitung` angezeigt und sind nicht mehr scheinbar buchbar.
- Die Terminbuchungsseite startet immer mit dem tatsächlich konfigurierten Academy-Support-Event.
- Ungültige oder nicht konfigurierte Terminparameter fallen auf den gültigen Academy-Support-Termin zurück.
- Der Direktbutton und das Inline-Embed verwenden dieselbe gültige Calendly-Event-URL.
- Keine Änderung an Login, Registrierung, Datenbank, Supabase oder Partnerdaten.

### Geänderte Dateien

- `app/page.jsx`
- `app/termin-buchen/BookingPageClient.jsx`
- `CHANGELOG.md`

## Download Center Phase 5B - 2026-06-19

### Umgesetzt

- Zentralen statischen und read-only Academy-Downloadkatalog erstellt.
- Die zehn bereits vorhandenen echten Academy-Dokumente in eine gemeinsame Datenquelle ueberfuehrt.
- Sieben Downloadkategorien vorbereitet:
  - Praesentationen
  - Produktinformationen
  - Onboarding
  - Verkauf
  - Recruiting
  - Social Media
  - Weitere Downloads
- Sechs Inhaltstypen strukturell vorbereitet:
  - PDF
  - DOCX
  - XLSX
  - PPTX
  - Video
  - Externer HTTPS-Link
- Neues mobiles Download Center mit folgenden Funktionen ergaenzt:
  - Suche nach Titel, Beschreibung, Dateiname und Schlagworten
  - Kategoriefilter
  - Dateitypfilter
  - Ergebnisanzahl
  - Filter zuruecksetzen
  - sauberer Leerzustand ohne Fake-Dateien
- Den bisherigen Navigationspunkt `Ressourcen` als zentralen Einstieg `Download Center` weiterverwendet.
- Modul 8 verwendet dasselbe Download Center und denselben Katalog wie der globale Navigationsbereich.
- Doppelte Dokumentdefinitionen in `app/page.jsx` durch den zentralen Katalog ersetzt.
- Deutsche, englische, russische und rumaenische Beschriftungen fuer Download Center, Kategorien und Filter vorbereitet.
- Vorhandene Admin-Inhaltsansicht bleibt read-only und beschreibt Downloads nicht mehr als bearbeitbaren Admin-Workflow.
- Geschuetzten Dokument-Endpunkt weiterhin ausschliesslich als `GET` belassen und um korrekte MIME-Typen fuer PDF, DOCX, XLSX, PPTX und MP4 vorbereitet.
- Office-Dateien werden als Download ausgeliefert; PDF und MP4 koennen inline geoeffnet werden.
- Externe Ressourcen akzeptieren in der Clientlogik ausschliesslich HTTPS-Links.
- Login, Registrierung, Partnerdaten, Supabase-Struktur und bestehende Dokumentdateien blieben unveraendert.

### Geaenderte Dateien

- `app/lib/academy-downloads.js`
- `app/components/AcademyDownloadCenter.jsx`
- `app/lib/academy-content.js`
- `app/api/academy-documents/route.js`
- `app/page.jsx`
- `CHANGELOG.md`

### Datenbank, Partnerdaten und Schreibzugriffe

- Keine Tabellen, Spalten, Indizes oder RLS-Regeln geaendert.
- Keine Migration ausgefuehrt.
- Keine Supabase-Struktur oder Supabase-Daten veraendert.
- Keine bestehenden Partnerdaten gelesen, veraendert oder migriert.
- Keine Upload-, Admin-Bearbeitungs- oder API-Schreibfunktion erstellt.
- Der bestehende interne Dokument-Endpunkt bleibt ein authentifizierter reiner Lese-Endpunkt.

### Bestandene Pruefungen

- `npm run lint`
- `npm run build`
- Statischer Katalogtest:
  - 10 vorhandene Dokumente
  - 7 Kategorien
  - 6 vorbereitete Dateitypen
- Suchtest `RXT`: genau ein passendes Dokument.
- Kategoriefilter `Verkauf`: fuenf passende Dokumente.
- Typfilter `PDF`: zehn passende Dokumente.
- Leere Kategorie `Recruiting`: null Ergebnisse und kein Fake-Inhalt.
- Lokaler Route-Handler-Test mit anonymem lokalem Testtoken:
  - Status 200 fuer erlaubtes internes PDF
  - `Content-Type: application/pdf`
  - `Content-Disposition: inline`
  - `Cache-Control: private, no-store`
- Quellcodepruefung:
  - keine neue POST-, PATCH- oder DELETE-Route
  - kein Upload
  - kein Supabase-Aufruf im Download Center
  - Modul 8 und Navigation verwenden dieselbe Komponente

### Visuelle Tests und offener Blocker

- Der lokale Next.js-Produktionsserver und ein anonymisierter Read-only-Testproxy wurden erfolgreich gestartet.
- Die Academy war laut manueller Bestaetigung auf dem PC sichtbar.
- Der automatisierte In-App-Browser blieb technisch an einem zuvor erzeugten `ERR_CONNECTION_REFUSED`-Fehler-Tab gebunden und konnte das sichtbar geoeffnete PC-Tab nicht uebernehmen.
- Deshalb konnten Desktop-, Mobile- und Admin-Screenshots sowie interaktive Browsernachweise in dieser Sitzung nicht verlaesslich erstellt werden.
- Es wurden bewusst keine Screenshots simuliert oder als bestanden ausgegeben.
- Vor einer weiteren Implementierung ist eine neue Freigabe erforderlich. Der naechste reine Pruefschritt ist ein visueller Re-Test in einer Browser-Sitzung, deren Automationsschnittstelle das lokale Tab korrekt erkennt.

## Module, Videos und Quiz-Grundlage Phase 5A - 2026-06-19

### Umgesetzt

- Zentralen statischen Academy-Inhaltskatalog fuer 11 Module erstellt.
- Jedes Modul kann strukturell Lektionen, Videos, Video-Platzhalter, PDFs, Quizfragen und Downloads referenzieren.
- Inhaltskatalog fuer Deutsch, Englisch, Russisch und Rumaenisch vorbereitet.
- Moduluebersicht zeigt:
  - Modulstatus `Offen`, `In Bearbeitung` oder `Abgeschlossen`
  - Anzahl Lektionen, Videos und PDFs
  - vorhandenen read-only Videofortschritt
  - Modulbeschreibung und Kategorie
- Moduldetail um kompakte Lektionen-Navigation erweitert.
- Auf Mobilgeraeten wird nur die aktive Lektion vollstaendig dargestellt; die bisher sehr lange gleichzeitige Darstellung aller Video-Karten entfällt.
- Naechsten empfohlenen Schritt aus dem ersten noch offenen Video des aktiven Moduls abgeleitet.
- Video-, PDF-, Inhalts-, Platzhalter- und Quiz-Lektionen koennen ueber dieselbe Navigation geoeffnet werden.
- Quiz mit acht Fragen auf reinen React-Sitzungszustand umgestellt:
  - keine API-Uebertragung
  - kein `localStorage`
  - keine Kontospeicherung
  - richtige Antworten werden erst nach der lokalen Auswertung angezeigt
  - keine irrefuehrende Zertifikatsfreigabe
- Read-only Admin-Inhaltsuebersicht fuer Reihenfolge, Titel, Beschreibung, Kategorie und Inhaltstypen der Module ergaenzt.
- Funktionslose Partner-Schaltflaeche `Neues Modul` entfernt.
- Vorbereitete produktive Aktion `training-progress-complete` entfernt.
- Academy-Fortschritt wird nicht mehr durch Videoende oder manuelle Schaltflaechen in `partners.avatar_url` geschrieben.
- Login, Registrierung, Admin-Freigabe, Partnerdaten und Supabase-Struktur blieben unveraendert.

### Geaenderte Dateien

- `app/lib/academy-content.js`
- `app/lib/academy-progress.js`
- `app/components/AcademyLessonNavigation.jsx`
- `app/components/AcademyContentAdminOverview.jsx`
- `app/page.jsx`
- `app/api/partners/route.js`
- `CHANGELOG.md`

### Datenbank und Partnerdaten

- Keine Tabellen, Spalten, Indizes oder RLS-Regeln geaendert.
- Keine Migration ausgefuehrt.
- Keine bestehenden Partnerdaten veraendert oder migriert.
- Keine produktive Fortschrittsspeicherung vorhanden.
- Ein spaeterer persistenter Modulfortschritt benoetigt weiterhin eigene Tabellen und eine erneute Freigabe.

### Bestandene Pruefungen

- `npm run lint`
- `npm run build`
- Desktop Partner-Test mit anonymisiertem Partner:
  - 11 Module sichtbar
  - Status, Inhaltszahlen und naechster Schritt korrekt
  - Modul 2 zeigt 40 Prozent aus zwei vorhandenen read-only Videoabschluessen
  - nur eine ausgewaehlte Videolektion gleichzeitig gerendert
  - keine Fortschritts-Schaltflaeche und kein Schreibaufruf
- Lokaler Quiz-Test:
  - acht Fragen und Antwortoptionen sichtbar
  - 100 Prozent lokal berechnet
  - Ergebnis `Quiz lokal bestanden`
  - kein `localStorage`- oder API-Code fuer Quizantworten vorhanden
- Mehrsprachigkeitspruefung:
  - deutsche, englische, russische und rumaenische Modultitel, Lektionenbegriffe und Quizfragen korrekt geladen
- Mobile Tests bei 320, 375 und 430 Pixel:
  - kein horizontaler Seitenueberlauf
  - Moduluebersicht, naechster Schritt und Lektionen-Navigation passen in die Breite
  - Quizantworten und lokale Auswertung passen in die Breite
- Admin-Test:
  - 11 Module in korrekter Reihenfolge
  - Titel, Beschreibung, Kategorie, Lektionen, Videos, Platzhalter, PDFs, Quiz und Downloads sichtbar
  - alle Module eindeutig als `Read-only` gekennzeichnet
- Keine Browser-Konsolenfehler.
- Read-only-Testproxy bestaetigt:
  - 0 Fortschritts-Schreibaufrufe
  - 0 Partner-Schreiboperationen
  - 0 Community-Schreiboperationen

### Offen

- Modul- und Quizinhalte bleiben statisch im Anwendungscode und koennen im Adminbereich noch nicht bearbeitet werden.
- Persistenter Partnerfortschritt, Zertifikate und produktive Quizresultate bleiben bis zur Freigabe eigener Tabellen deaktiviert.
- Fuer Modul 1 und Modul 7 existieren weiterhin bewusst nur Video-Platzhalter.
- Echte Satz-fuer-Satz-Transkripte fehlen weiterhin; die vorhandenen Untertitel-Routen verwenden ohne Transkriptdatei den Metadaten-Fallback.

## Partner Aktivitaets- und Onboarding-System Phase 4 - 2026-06-19

### Umgesetzt

- Zentralen, gemeinsam von Client und Server verwendeten Academy-Modulkatalog fuer 11 Module und 14 aktuell messbare Trainingsvideos ergaenzt.
- Serverseitige Fortschrittsnormalisierung und geschuetzte Aktion fuer kuenftige Videoabschluesse vorbereitet.
- Fortschritt wird aus tatsaechlich abgeschlossenen, serverseitig bekannten Videos berechnet; statische Beispielprozente werden nicht mehr als Partnerfortschritt angezeigt.
- Onboarding-Regel fuer die aktuell messbaren Kernmodule 2, 3, 6, 9 und 10 ergaenzt.
- Onboarding-Status `Nicht begonnen`, `In Bearbeitung` und `Abgeschlossen` sowie letzter Modulabschluss und naechstes empfohlenes Modul ergaenzt.
- Community-Aktivitaet wird read-only aus vorhandenen Chat-, Fragen-, Antwort- und Presence-Zeitpunkten zusammengefuehrt.
- Aktivitaetsstatus:
  - `Aktiv` bis 14 Tage
  - `Unter Beobachtung` von 15 bis 30 Tagen
  - `Inaktiv` ab 31 Tagen
  - `Noch nicht erfasst` ohne verlaesslichen Zeitpunkt
- Admin-Kennzahlen ergaenzt:
  - Aktive Partner
  - Inaktive Partner
  - Partner ohne Profilbild
  - Partner ohne Team
  - Partner ohne Modulabschluss
  - Partner mit abgeschlossenem Onboarding
- Risikomarker um fehlenden Modulabschluss und lange Inaktivitaet erweitert.
- Partnerkarten zeigen zusaetzlich Aktivitaets- und Onboarding-Status.
- Admin-Partnerdetail zeigt Onboarding-Status, Fortschritt, letzte Aktivitaet, letzten Modulabschluss, letzten Community-Beitrag, abgeschlossene Module und den naechsten empfohlenen Schritt.
- Login, Registrierung, Bulk-Funktionen, Audit-Funktionen und Community-Moderation blieben unveraendert.

### Geaenderte Dateien

- `app/lib/academy-progress.js`
- `app/api/partners/route.js`
- `app/page.jsx`
- `CHANGELOG.md`

### Datenbank und Partnerdaten

- Keine Tabellen, Spalten, Indizes, RLS-Regeln oder Migrationen erstellt oder geaendert.
- Keine bestehenden Partnerdaten migriert.
- Kein produktiver Fortschritts- oder Aktivitaetswert geschrieben.
- Die vorbereitete Laufzeitaktion wuerde erst nach einem echten Videoabschluss das bestehende Metadatenfeld `avatar_url` um `academyProgress` ergaenzen.
- Vor einem produktiven Test oder einer produktiven Ausloesung ist eine erneute Genehmigung erforderlich.

### Bestandene Pruefungen

- `npm run lint`
- `npm run build`
- Reine Logikpruefung:
  - 14 messbare Videos erkannt
  - 5 messbare Kernmodule erkannt
  - 100 % Fortschritt und abgeschlossenes Onboarding bei allen 14 Abschluessen
  - Aktiv- und Inaktiv-Schwellen korrekt berechnet
- Lokaler API-Vertragstest gegen den realen Next.js-Route-Handler:
  - freigegebener Partner kann einen gueltigen Videoabschluss speichern
  - bestehende Metadaten bleiben erhalten
  - PATCH beschreibt ausschliesslich `avatar_url`
  - unbekannte Video-ID wird mit 400 abgelehnt
  - Pending-Partner und Admin werden mit 403 abgelehnt
  - abgelehnte Aufrufe erzeugen keine Schreiboperation
- Desktop-Test bei 1440 x 900 Pixel mit vier anonymisierten Partnern:
  - alle sechs neuen Kennzahlen korrekt
  - Aktivitaets- und Onboarding-Status auf allen Partnerkarten
  - Risikomarker korrekt
  - Partnerdetail mit Fortschritt, Community-Aktivitaet, Modulabschluss und Empfehlung
  - Partner-Modulansicht zeigt serverseitig vorgegebenen Fortschritt und deaktivierte Abschlusssteuerung fuer bereits abgeschlossene Videos
  - kein horizontaler Seitenueberlauf
- Mobile-Test bei 320 x 844 Pixel:
  - alle Kennzahlen vorhanden
  - Partnerkarten und Detailansicht vollstaendig
  - kein horizontaler Seitenueberlauf
- Keine Browser-Konsolenfehler.
- Keine Aktion `training-progress-complete` im Browsertest ausgeloest.
- Alle lokalen Partner- und Community-Schreiboperationen im Testproxy blockiert.

### Offen und Risiken

- Die produktive Metadaten-Schreibaktion wurde absichtlich noch nicht mit einem echten Partnerkonto getestet.
- Bestehende lokale Video- oder Quizdaten werden nicht migriert, weil sie nicht verlaesslich einem Partnerkonto zugeordnet werden koennen.
- Module ohne aktuell messbares Trainingsvideo zeigen bewusst keinen erfundenen Fortschritt.
- Quiz- und Zertifikatsfortschritt bleibt weiterhin browserlokal und ist nicht Bestandteil dieses Schritts.
- Community- und Presence-Daten bleiben in begrenzten JSON-Systemdatensaetzen gespeichert; sehr alte Community-Beitraege koennen deshalb nicht dauerhaft fuer Aktivitaetsanalysen erhalten bleiben.
- Fuer eine spaetere Skalierung auf deutlich mehr Partner bleiben normalisierte Fortschritts- und Aktivitaetstabellen sinnvoll, benoetigen aber eine separate Freigabe.

## Admin Dashboard Phase 3A - 2026-06-19

### Umgesetzt

- Sechs Admin-Kennzahlen auf Basis der bereits geladenen Partnerdaten ergaenzt:
  - Gesamtpartner
  - Freigegeben
  - Wartend
  - Blockiert
  - Heute registriert
  - Diese Woche registriert
- Tages- und Wochenwerte werden fuer die Zeitzone `Europe/Berlin` berechnet.
- Partnerkarten um eine kompakte Schnelluebersicht fuer Status, Team, Level und Registrierungsdatum ergaenzt.
- Risikomarker fuer fehlendes Profilbild, fehlende Teamzuordnung und noch nicht freigegebene Partner ergaenzt.
- Bereits markierte Testdaten werden nicht in den Dashboard-Kennzahlen mitgezaehlt.
- Keine Bulk-Aktionen, Reminder, E-Mail-Funktionen, Audit-Logs oder Angaben zum letzten Login ergaenzt.

### Geaenderte Dateien

- `app/page.jsx`
- `CHANGELOG.md`

### Datenbank und Partnerdaten

- Keine Tabellen, Spalten, Indizes oder RLS-Regeln geaendert.
- Keine Migration ausgefuehrt.
- Keine bestehenden Partnerdaten veraendert.
- Alle Browserpruefungen erfolgten ausschliesslich mit vier anonymisierten lokalen Partnerdatensaetzen und blockierten Schreiboperationen.

### Bestandene Pruefungen

- `npm run lint`
- `npm run build`
- Desktop-Test bei 1440 x 900 Pixel:
  - Kennzahlen `4 / 2 / 1 / 1 / 2 / 3` korrekt dargestellt.
  - Schnelluebersicht fuer alle vier anonymisierten Partner dargestellt.
  - Risikomarker passend zu Profilbild, Team und Status dargestellt.
  - Kein horizontaler Seitenueberlauf.
  - Keine Browser-Konsolenfehler.
- Mobile-Test bei 320 x 844 Pixel:
  - Alle sechs Kennzahlen vorhanden.
  - Status, Team, Level und Registrierungsdatum auf allen Partnerkarten vorhanden.
  - Alle erwarteten Risikomarker vorhanden.
  - Kein horizontaler Seitenueberlauf.
  - Keine Browser-Konsolenfehler.

### Offen

- Die Kennzahlen werden weiterhin clientseitig aus der bereits geladenen kompakten Partnerliste berechnet. Eine spaetere serverseitige Statistikabfrage waere erst bei deutlich groesseren Datenmengen zu pruefen.
- Bulk-Aktionen, Reminder, E-Mail-Versand, Audit-Protokoll und letzter Login bleiben ausdruecklich ausserhalb von Phase 3A.
- `npm audit --audit-level=moderate` meldet weiterhin die bereits dokumentierte moderate `js-yaml`-Schwachstelle.

## Admin Dashboard Phase 2 - 2026-06-19

### Umgesetzt

- Bestehende Admin-Partnersuche fuer Name, E-Mail, Rabattcode und Stadt praezisiert.
- Statusfilter fuer Pending, Approved und Blocked mit der bestehenden Partnerliste verbunden.
- Sortierung nach neuestem, aeltestem und alphabetischem Eintrag bestaetigt und beschriftet.
- Clientseitige Pagination mit 25, 50 oder 100 Partnern pro Seite ergaenzt.
- Partner-Detailansicht bleibt getrennt und laedt vollstaendige Verwaltungsdaten erst nach Auswahl.
- Detailansicht zeigt Profilbild, Status, Registrierungsdatum und die bestehenden Partnerdaten.
- Mehrfachauswahl als Grundlage fuer spaetere Bulk-Aktionen vorbereitet:
  - Checkbox pro Partner
  - Auswahl der aktuellen Seite
  - Auswahl bleibt ueber Seitenwechsel erhalten
  - Auswahl kann vollstaendig aufgehoben werden
- Noch keine Bulk-Mutation und kein neuer Bulk-API-Endpunkt erstellt.
- Fehlende Rabattcodes werden nicht mehr faelschlich als Standardcode `119872` angezeigt.

### Geaenderte Dateien

- `app/page.jsx`
- `app/api/partners/route.js`
- `CHANGELOG.md`

### Datenbank

- Keine Tabellen, Spalten, Indizes, RLS-Regeln oder Datenbankdaten geaendert.
- Keine Migration ausgefuehrt.

### Bestandene Pruefungen

- `npm run lint`
- `npm run build`
- Anonymisierter UI-Test mit 500 Partnern.
- Pro Seite werden standardmaessig 25 statt 500 Partnerkarten gerendert.
- Suche nach Name, E-Mail, Rabattcode und Stadt.
- Filter fuer Pending, Approved und Blocked.
- Sortierung neueste, aelteste und alphabetisch.
- Mehrfachauswahl eines Partners, einer ganzen Seite und ueber zwei Seiten hinweg.
- Detailansicht mit Profilbild, Status und Registrierungsdatum.
- Mobile Partnerliste und Detailansicht bei 320 Pixel ohne horizontalen Seitenueberlauf.
- Keine Browser-Konsolenfehler.

### Offen

- Die initiale Adminabfrage laedt weiterhin eine kompakte Zusammenfassung aller Partner, weil Statistiken, Ranking und Empfaengerauswahl aktuell daran gekoppelt sind.
- Vollstaendige serverseitige Pagination und getrennte Statistikabfragen bleiben ein spaeterer Skalierungsschritt.
- Bulk-Aktionen selbst sind noch nicht implementiert und benoetigen eine separate Freigabe.
- `npm audit --audit-level=moderate` meldet weiterhin die bestehende moderate `js-yaml`-Schwachstelle.

## Profilfoto und Calendly - 2026-06-18

### Umgesetzt

- Profilfoto-Aenderungen fuer Partner und Admins um Dateiauswahl sowie direkte Smartphone-Kameraaufnahme erweitert.
- Neue Profilfotos werden vor dem Upload im Browser auf maximal 1200 Pixel Kantenlaenge optimiert.
- Profilfoto-Aenderungen akzeptieren JPG, PNG und WEBP bis 5 MB; gespeichert wird als WEBP beziehungsweise JPEG mit maximal 1 MB.
- Bestehende Profilbilder bleiben unveraendert und werden nicht migriert oder neu komprimiert.
- Admins koennen Profilbilder einzelner Partner ueber denselben privaten Supabase-Storage-Flow hochladen, ersetzen und loeschen.
- Serverseitige Admin-Autorisierung, Zielpartner-Pruefung, Dateisignatur-Pruefung und harte 1-MB-Speichergrenze ergaenzt.
- Registrierung, Login und Freigabeprozess blieben unveraendert; der Registrierungsupload behaelt sein bestehendes Limit von 1,5 MB.
- Calendly verwendet nur die verifizierte Academy-Support-Event-URL.
- Nicht vorhandene Calendly-Event-URLs zeigen einen sauberen Hinweis und verlinken auf das gueltige Calendly-Profil.
- Produktionsdeployment `dpl_HT9WcwMgFhFULVJ8APHnyCNUS6io` erfolgreich auf `https://www.harborglobalacademy.com` veroeffentlicht.

### Geaenderte Dateien

- `app/page.jsx`
- `app/api/partners/route.js`
- `app/termin-buchen/BookingPageClient.jsx`
- `CHANGELOG.md`
- `PROJECT_RULES.md` nur fuer die dauerhafte Dokumentation des neuen Profilfoto-Standards und des abgeschlossenen Next-Step-Status.

### Bestandene Pruefungen

- `npm run lint`
- `npm run build`
- Partner kann ein bestehendes Profilbild live aendern.
- Partner kann auf einem Mobilgeraet direkt ein Foto aufnehmen.
- Admin kann ein Partnerprofilbild live aendern.
- Admin sieht die Profilbild-Steuerung pro Partner.
- Live-Hinweis zeigt 5 MB Eingangslimit und Optimierung auf maximal 1 MB.
- Calendly-Fallback fuer nicht hinterlegte Event-URLs funktioniert.
- Academy-Support-Embed und Direktlink verwenden die gueltige Calendly-URL.
- Calendly zeigt live verfuegbare Termine.
- Mobile Calendly-Ansicht funktioniert bei 320 Pixel Breite ohne horizontalen Seitenueberlauf.
- Login und Registrierung funktionieren weiterhin unveraendert.

### Offen

- Partnerseitiges Loeschen eines Profilbildes wurde in der abschliessenden Live-Bestaetigung nicht separat protokolliert.
- Adminseitiges Loeschen eines Partnerprofilbildes wurde in der abschliessenden Live-Bestaetigung nicht separat protokolliert.
- Direkte Kameraaufnahme im Adminbereich ist implementiert, wurde in der abschliessenden Live-Bestaetigung aber nicht separat genannt.
- Ein realer Grenzwerttest mit exakt 5 MB sowie eine Ablehnung bei mehr als 5 MB sind noch nicht als Live-Test protokolliert.
- Automatisierte End-to-End-Tests fuer den Profilfoto-Flow fehlen weiterhin.
- `npm audit --audit-level=moderate` meldet eine bestehende moderate `js-yaml`-Schwachstelle; sie gehoerte nicht zum freigegebenen Funktionsumfang.

## Security hardening - 2026-06-18

- Anonymen und direkt authentifizierten Data-API-Zugriff auf `public.partners` geschlossen.
- Oeffentliche SELECT-/INSERT-Policies entfernt; Partnerzugriffe bleiben auf serverseitige Service-Role-Routen begrenzt.
- Login-Normalisierung korrigiert: E-Mail-Adressen werden kleingeschrieben, Rabattcodes passend zur Speicherung grossgeschrieben.
- Profilfotos aus Base64-Metadaten in den privaten Supabase-Storage-Bucket `avatars` verschoben.
- Serverseitigen Profilfoto-Upload mit Typ-/Groessen-/Eigentuemerpruefung sowie Ersetzen und Loeschen fuer freigegebene Partner ergaenzt.

## v1.0 - 2026-06-03

- Finaler Produktionsstand der Harbor Global Partner Academy.
- Offizielles Instagram auf `https://www.instagram.com/harbor.global.academy` gesetzt.
- Registrierungs-, Login-, Pending-Block-, Dashboard- und Admin-Freigabe-Flows produktiv vorbereitet.
- Harbor Anthem Player, Mehrsprachigkeit, Calendly, Instagram Community Center, Linkkarten, Ressourcen und Testimonials integriert.
- Testdatenbereinigung abgeschlossen: 25 erkannte Testpartner wurden entfernt; finaler Kontrolllauf fand 0 weitere Testpartner.
- Finale Produktionspruefungen bestanden: Lint, Build, Audit, Domains und Browser-Konsole.
