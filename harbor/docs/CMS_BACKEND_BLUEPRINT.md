# Harbor Global Partner Academy – CMS Backend Blueprint

Stand: 2026-07-01  
Status: Enterprise-Blueprint, keine produktive Implementierung

## 1. Zweck und Scope

Dieses Dokument beschreibt die zukünftige Enterprise-CMS-Backend-Architektur der Harbor Global Partner Academy.

Es ist ausschließlich technische Dokumentation. Es wurden keine Tabellen angelegt, keine Migrationen ausgeführt, keine API-Endpunkte gebaut, keine RLS-Policies aktiviert, keine Komponenten geändert und keine produktiven Schreibvorgänge durchgeführt.

Der Blueprint soll später als Grundlage dienen für:

- dynamisch verwaltbare Academy-Module
- Lektionen, Videos, PDFs, Downloads und Quiz
- Growth-Center-Inhalte
- mehrsprachige Inhalte
- Versionierung, Review, Veröffentlichung und Rollback
- Anbindung an Task Engine und Notification Engine
- spätere Automationen über Kalender, CRM, n8n, WhatsApp, Leonid OS und KI-Agenten

## 2. Aktueller Ist-Zustand

### 2.1 Bestehende CMS-Strukturen

Aktuell existiert bereits eine starke UI- und Kataloggrundlage, aber noch kein produktives CMS-Backend.

Relevante bestehende Dateien:

- `app/lib/academy-content.js`
- `app/lib/academy-downloads.js`
- `app/components/AcademyContentAdminOverview.jsx`
- `app/components/AcademyDownloadCenter.jsx`
- `components/admin-ui.jsx`
- `components/growth-center.jsx`
- `app/page.jsx`
- `app/api/academy-documents/route.js`
- `app/api/academy-videos/route.js`
- `app/api/video-transcripts/route.js`

Aktuelle Katalogzahlen aus dem bestehenden Code:

| Bereich | Aktueller Stand |
|---|---:|
| Academy Module | 11 |
| Lektionen | 38 |
| veröffentlichte Video-Zuordnungen | 14 |
| Video-Platzhalter | 2 |
| PDF-Zuordnungen im Modulkatalog | 11 |
| Quiz-Zuordnungen im Modulkatalog | 16 |
| konkrete Quizfragen | 8 |
| Download-Kategorien | 7 |
| Download-Einträge | 10 |
| aktive Inhalts-Sprachen | DE, EN, RU, RO |

### 2.2 Daten aus Konstanten

Der zentrale Academy-Inhaltskatalog liegt aktuell statisch in `app/lib/academy-content.js`.

Dort definiert sind:

- `ACADEMY_CONTENT_LANGUAGE_CODES`
- `ACADEMY_CONTENT_CATALOG`
- `ACADEMY_QUIZ_CATALOG`
- Modulreihenfolge
- Modultitel und Beschreibungen
- Kategorien
- Lektionen
- Video-Lektionen
- Video-Platzhalter
- PDF-Lektionen
- Quiz-Zuordnungen
- Download-Zuordnungen
- Lokalisierungslogik über `localized(...)`

Der Download-Katalog liegt aktuell statisch in `app/lib/academy-downloads.js`.

Dort definiert sind:

- `ACADEMY_DOWNLOAD_CATEGORIES`
- `ACADEMY_DOWNLOAD_TYPES`
- `ACADEMY_DOWNLOAD_CATALOG`
- Download-Titel
- Beschreibungen
- Kategorien
- Dateitypen
- Sichtbarkeit
- Dateinamen
- Modulzuordnung
- Tags
- Reihenfolge
- Download-Center-Texte für DE, EN, RU und RO

Das Growth Center wurde in `components/growth-center.jsx` ausgelagert und enthält aktuell UI-Konstanten für:

- Growth-Center-Kategorien
- Marketing Hub
- Content Center
- KI Center
- Recruiting Center
- Produkt Center
- Leader Growth
- vorbereitete Integrationen

### 2.3 UI-only Bereiche

Folgende Bereiche sind aktuell bewusst UI-only oder read-only:

- Academy CMS im Adminbereich
- Modulverwaltung
- Video-Verwaltung
- PDF-/Download-Verwaltung
- Quiz-Verwaltung
- Aufgaben-Verwaltung im CMS-Kontext
- Content-Kalender
- Growth Center Inhalte
- Marketing Inhalte
- KI-Prompts
- Produktinformationen
- Kampagnen
- Favoriten im Growth Center
- zuletzt angesehene Inhalte im Growth Center
- echte Review-/Publish-/Rollback-Aktionen
- echte CMS-Speicherung
- echte Upload-Flows im CMS
- echte Quiz-Speicherung
- echte Zertifikatslogik

Die vorhandene UI zeigt professionell vorbereitete Workflows, speichert aber keine CMS-Daten produktiv.

### 2.4 Academy Assets

Academy-PDFs liegen aktuell privat unter:

- `academy-documents/private/`

Academy-Videos liegen aktuell privat unter:

- `academy-videos/private/`

Die Auslieferung erfolgt geschützt über:

- `app/api/academy-documents/route.js`
- `app/api/academy-videos/route.js`
- Legacy-Routen als Proxy:
  - `app/academy-documents/customer/[file]/route.js`
  - `app/academy-videos/[file]/route.js`

Dokumente werden nur nach gültiger Session und Freigabe ausgeliefert. Videos unterstützen Range Requests und signierte kurzlebige Asset-URLs.

### 2.5 Videos

Videos sind aktuell über statische IDs und private MP4-Dateien verbunden.

Wichtige Eigenschaften:

- geschützt ausgeliefert
- `video/mp4`
- Range Requests für Streaming
- keine öffentliche direkte Datei-URL
- keine CMS-Uploadfunktion
- Video-Platzhalter sind als Inhalte vorbereitet, aber nicht mit echter Datei verbunden
- Untertitel/Transkripte verwenden vorhandene Route bzw. Fallback-Metadaten

### 2.6 PDFs und Downloads

PDFs und Downloads sind aktuell:

- im Download-Katalog statisch definiert
- über `fileName` mit privaten Dateien verbunden
- nach Kategorie, Typ und Suche filterbar
- im Partnerbereich read-only
- im Admin-CMS als UI-Vorschau sichtbar

Der Download-Katalog unterstützt strukturell bereits:

- PDF
- DOCX
- XLSX
- PPTX
- Video
- externe HTTPS-Links

Produktiv vorhanden sind aktuell vor allem geschützte PDF-Dateien.

### 2.7 Quiz

Quizdaten liegen aktuell statisch in `ACADEMY_QUIZ_CATALOG`.

Eigenschaften:

- 8 konkrete Fragen
- mehrsprachige Fragen und Antwortoptionen
- lokale Ergebnisberechnung im Frontend
- keine produktive Speicherung
- keine DB-Tabelle für Quizversuche
- keine Zertifikatsfreigabe durch persistentes Quizresultat

### 2.8 Mehrsprachigkeit

Aktuell aktiv vorbereitet:

- Deutsch (`de`)
- Englisch (`en`)
- Russisch (`ru`)
- Rumänisch (`ro`)

Die Mehrsprachigkeit erfolgt momentan über lokalisierte Objekte im Code. Später braucht das CMS eine normalisierte Übersetzungsstruktur mit Fallback-Regeln, Review-Status und Versionierung pro Sprache.

### 2.9 Rollenmodell

Aktuell vorhandene Rollenlogik:

- Partner
- Admin
- Leader als UI-/Analytics-Konzept

Das Projekt nutzt aktuell Custom-HMAC-Sessions und keine Supabase Auth als primäres Auth-System. Admin und Partner werden serverseitig über bestehende Route Handler geprüft. Leader-Scope ist noch nicht vollständig normalisiert und braucht später eine saubere Team-/Upline-Struktur.

## 3. Zielarchitektur

Das zukünftige CMS-Backend soll die statischen Kataloge schrittweise ersetzen, ohne bestehende Partner-, Auth- oder Asset-Sicherheitslogik zu beschädigen.

Empfohlenes Zielbild:

1. Inhalte liegen in normalisierten CMS-Tabellen.
2. Module, Lektionen, Assets, Downloads und Quiz sind getrennt modelliert.
3. Mehrsprachige Felder werden versionierbar gespeichert.
4. Veröffentlichungen laufen über Review- und Publish-Workflow.
5. Öffentliche Partneransicht liest nur veröffentlichte Inhalte.
6. Admin-/CMS-Editoren arbeiten mit Entwürfen und Versionen.
7. Änderungen erzeugen Events für Task Engine und Notification Engine.
8. Asset-Dateien bleiben geschützt und werden nur über bestehende sichere Auslieferungswege referenziert.

## 4. Geplante Tabellen

Keine dieser Tabellen wurde erstellt. Die folgenden Strukturen sind Vorschläge für eine spätere, separat freizugebende Supabase-Migration.

### 4.1 `academy_languages`

Zweck: zentrale Sprachverwaltung.

Vorgeschlagene Spalten:

| Spalte | Typ | Zweck |
|---|---|---|
| `id` | `uuid` | Primärschlüssel |
| `code` | `text` | Sprachcode, z. B. `de`, `ru`, `ro`, `en` |
| `label` | `text` | Anzeigename |
| `native_label` | `text` | Eigenbezeichnung |
| `is_default` | `boolean` | Standardsprache |
| `is_active` | `boolean` | im CMS aktiv |
| `fallback_language_code` | `text` | Fallback, z. B. `de` |
| `sort_order` | `integer` | Anzeige-Reihenfolge |
| `created_at` | `timestamptz` | Erstellung |
| `updated_at` | `timestamptz` | Aktualisierung |

Empfohlene Constraints/Indizes:

- unique `code`
- unique partial `is_default where is_default = true`
- Index `(is_active, sort_order)`

### 4.2 `academy_modules`

Zweck: Module als oberste Academy-Einheiten.

Vorgeschlagene Spalten:

| Spalte | Typ | Zweck |
|---|---|---|
| `id` | `uuid` | Primärschlüssel |
| `legacy_module_id` | `integer` | Mapping zum bisherigen statischen Katalog |
| `slug` | `text` | stabile technische URL-/Referenz-ID |
| `title_i18n` | `jsonb` | Titel pro Sprache |
| `description_i18n` | `jsonb` | Beschreibung pro Sprache |
| `category_i18n` | `jsonb` | Kategorie pro Sprache |
| `learning_goal_i18n` | `jsonb` | Lernziel pro Sprache |
| `difficulty` | `text` | z. B. `beginner`, `intermediate`, `advanced` |
| `estimated_minutes` | `integer` | Dauer |
| `icon_key` | `text` | vorhandener Icon-Schlüssel |
| `sort_order` | `integer` | Reihenfolge |
| `status` | `text` | Workflow-Status |
| `visibility` | `text` | `partner`, `leader`, `admin`, `growth`, `hidden` |
| `required_role` | `text` | Zielrolle |
| `required_progress_rule` | `jsonb` | spätere Lernpfad-/Freischaltregel |
| `published_version_id` | `uuid` | aktuell veröffentlichte Version |
| `created_by` | `uuid` | Ersteller |
| `updated_by` | `uuid` | letzter Bearbeiter |
| `created_at` | `timestamptz` | Erstellung |
| `updated_at` | `timestamptz` | Aktualisierung |
| `published_at` | `timestamptz` | Veröffentlichung |
| `archived_at` | `timestamptz` | Archivierung |

Empfohlene Indizes:

- unique `slug`
- unique `legacy_module_id`
- `(status, sort_order)`
- `(visibility, status)`
- `(published_at desc)`
- GIN auf `title_i18n` optional für Suche

### 4.3 `academy_lessons`

Zweck: einzelne Lektionen innerhalb eines Moduls.

Vorgeschlagene Spalten:

| Spalte | Typ | Zweck |
|---|---|---|
| `id` | `uuid` | Primärschlüssel |
| `module_id` | `uuid` | Verweis auf `academy_modules` |
| `legacy_lesson_id` | `text` | Mapping zur bisherigen Katalog-ID |
| `slug` | `text` | technische Lektion-ID |
| `lesson_type` | `text` | `content`, `video`, `video_placeholder`, `pdf`, `download`, `quiz`, `task` |
| `title_i18n` | `jsonb` | Titel pro Sprache |
| `description_i18n` | `jsonb` | Beschreibung pro Sprache |
| `learning_goal_i18n` | `jsonb` | Lernziel pro Sprache |
| `asset_id` | `uuid` | optionaler Asset-Bezug |
| `download_id` | `uuid` | optionaler Download-Bezug |
| `quiz_id` | `uuid` | optionaler Quiz-Bezug |
| `sort_order` | `integer` | Reihenfolge im Modul |
| `estimated_minutes` | `integer` | Dauer |
| `is_required` | `boolean` | Pflichtlektion |
| `status` | `text` | Workflow-Status |
| `visibility` | `text` | Sichtbarkeit |
| `published_version_id` | `uuid` | veröffentlichte Version |
| `created_by` | `uuid` | Ersteller |
| `updated_by` | `uuid` | letzter Bearbeiter |
| `created_at` | `timestamptz` | Erstellung |
| `updated_at` | `timestamptz` | Aktualisierung |
| `published_at` | `timestamptz` | Veröffentlichung |
| `archived_at` | `timestamptz` | Archivierung |

Empfohlene Indizes:

- `(module_id, sort_order)`
- `(lesson_type)`
- `(status, visibility)`
- unique `(module_id, slug)`
- unique `(legacy_lesson_id)` falls stabil

### 4.4 `academy_assets`

Zweck: geschützte Dateien und Medienobjekte als CMS-Asset-Metadaten.

Wichtig: Diese Tabelle speichert nur Metadaten und sichere Objektpfade, nicht die Datei selbst.

Vorgeschlagene Spalten:

| Spalte | Typ | Zweck |
|---|---|---|
| `id` | `uuid` | Primärschlüssel |
| `asset_type` | `text` | `video`, `pdf`, `docx`, `xlsx`, `pptx`, `image`, `audio`, `external` |
| `title_i18n` | `jsonb` | Titel pro Sprache |
| `description_i18n` | `jsonb` | Beschreibung pro Sprache |
| `storage_provider` | `text` | z. B. `r2`, `local_private`, `external` |
| `storage_bucket` | `text` | Bucket oder logischer Speicherbereich |
| `storage_key` | `text` | privater Objektpfad |
| `public_url` | `text` | nur falls ausdrücklich öffentlich |
| `mime_type` | `text` | MIME-Type |
| `file_size_bytes` | `bigint` | Dateigröße |
| `checksum_sha256` | `text` | Integritätsprüfung |
| `duration_seconds` | `integer` | Video/Audio-Dauer |
| `language_code` | `text` | Hauptsprache |
| `transcript_status` | `text` | `missing`, `draft`, `review`, `published` |
| `visibility` | `text` | `partner`, `leader`, `admin`, `public`, `hidden` |
| `status` | `text` | Workflow-Status |
| `created_by` | `uuid` | Ersteller |
| `updated_by` | `uuid` | letzter Bearbeiter |
| `created_at` | `timestamptz` | Erstellung |
| `updated_at` | `timestamptz` | Aktualisierung |
| `published_at` | `timestamptz` | Veröffentlichung |
| `archived_at` | `timestamptz` | Archivierung |

Empfohlene Indizes:

- `(asset_type, status)`
- `(visibility, status)`
- `(storage_provider, storage_key)`
- `(language_code)`
- unique `(storage_provider, storage_bucket, storage_key)`

### 4.5 `academy_downloads`

Zweck: Download-Center-Einträge, unabhängig vom physischen Asset.

Vorgeschlagene Spalten:

| Spalte | Typ | Zweck |
|---|---|---|
| `id` | `uuid` | Primärschlüssel |
| `asset_id` | `uuid` | optionaler Verweis auf `academy_assets` |
| `slug` | `text` | stabile Download-ID |
| `title_i18n` | `jsonb` | Titel pro Sprache |
| `description_i18n` | `jsonb` | Beschreibung pro Sprache |
| `category_id` | `text` | z. B. `presentations`, `sales`, `recruiting` |
| `download_type` | `text` | `pdf`, `docx`, `xlsx`, `pptx`, `video`, `external` |
| `external_url` | `text` | nur für externe HTTPS-Links |
| `visibility` | `text` | `partner`, `leader`, `admin`, `public`, `hidden` |
| `language_codes` | `text[]` | verfügbare Sprachen |
| `module_ids` | `uuid[]` | optionale Modulbezüge |
| `tags` | `text[]` | Suche/Filter |
| `sort_order` | `integer` | Anzeige-Reihenfolge |
| `status` | `text` | Workflow-Status |
| `published_version_id` | `uuid` | veröffentlichte Version |
| `created_by` | `uuid` | Ersteller |
| `updated_by` | `uuid` | letzter Bearbeiter |
| `created_at` | `timestamptz` | Erstellung |
| `updated_at` | `timestamptz` | Aktualisierung |
| `published_at` | `timestamptz` | Veröffentlichung |
| `archived_at` | `timestamptz` | Archivierung |

Empfohlene Indizes:

- unique `slug`
- `(category_id, status)`
- `(download_type, status)`
- `(visibility, status)`
- GIN auf `tags`
- GIN auf `language_codes`

### 4.6 `academy_quizzes`

Zweck: Quiz-Sets pro Modul, Kurs oder Zertifizierung.

Vorgeschlagene Spalten:

| Spalte | Typ | Zweck |
|---|---|---|
| `id` | `uuid` | Primärschlüssel |
| `module_id` | `uuid` | optionaler Modulbezug |
| `lesson_id` | `uuid` | optionaler Lektionsbezug |
| `legacy_quiz_id` | `text` | Mapping zum bisherigen Katalog |
| `slug` | `text` | stabile technische ID |
| `title_i18n` | `jsonb` | Titel pro Sprache |
| `description_i18n` | `jsonb` | Beschreibung pro Sprache |
| `pass_percentage` | `integer` | Bestehensgrenze |
| `max_attempts` | `integer` | Versuchslimit |
| `shuffle_questions` | `boolean` | Fragen mischen |
| `shuffle_answers` | `boolean` | Antworten mischen |
| `status` | `text` | Workflow-Status |
| `visibility` | `text` | Sichtbarkeit |
| `published_version_id` | `uuid` | veröffentlichte Version |
| `created_by` | `uuid` | Ersteller |
| `updated_by` | `uuid` | letzter Bearbeiter |
| `created_at` | `timestamptz` | Erstellung |
| `updated_at` | `timestamptz` | Aktualisierung |
| `published_at` | `timestamptz` | Veröffentlichung |
| `archived_at` | `timestamptz` | Archivierung |

Empfohlene Indizes:

- unique `slug`
- `(module_id, status)`
- `(lesson_id)`
- `(status, visibility)`

### 4.7 `academy_quiz_questions`

Zweck: Fragen und Antwortoptionen pro Quiz.

Vorgeschlagene Spalten:

| Spalte | Typ | Zweck |
|---|---|---|
| `id` | `uuid` | Primärschlüssel |
| `quiz_id` | `uuid` | Verweis auf `academy_quizzes` |
| `legacy_question_id` | `text` | bisherige Frage-ID |
| `question_i18n` | `jsonb` | Frage pro Sprache |
| `options_i18n` | `jsonb` | Antwortoptionen pro Sprache |
| `correct_option_index` | `integer` | richtige Antwort |
| `explanation_i18n` | `jsonb` | optionale Erklärung |
| `sort_order` | `integer` | Reihenfolge |
| `points` | `integer` | Punktewert |
| `status` | `text` | Workflow-Status |
| `created_by` | `uuid` | Ersteller |
| `updated_by` | `uuid` | letzter Bearbeiter |
| `created_at` | `timestamptz` | Erstellung |
| `updated_at` | `timestamptz` | Aktualisierung |

Empfohlene Indizes:

- `(quiz_id, sort_order)`
- `(status)`
- unique `(quiz_id, legacy_question_id)` falls stabil

Hinweis: Produktive Quizversuche, Ergebnisse und Zertifikatsfreigaben sollten später nicht in diesen CMS-Tabellen gespeichert werden, sondern in separaten Progress-/Assessment-Tabellen.

### 4.8 `academy_content_versions`

Zweck: Versionierung, Historie und Rollback für CMS-Inhalte.

Vorgeschlagene Spalten:

| Spalte | Typ | Zweck |
|---|---|---|
| `id` | `uuid` | Primärschlüssel |
| `entity_type` | `text` | `module`, `lesson`, `asset`, `download`, `quiz`, `question` |
| `entity_id` | `uuid` | referenzierte Entität |
| `version_number` | `integer` | fortlaufende Version |
| `status` | `text` | `draft`, `review`, `approved`, `published`, `archived`, `rolled_back` |
| `snapshot` | `jsonb` | vollständiger Inhalts-Snapshot |
| `change_summary` | `text` | Änderungsbeschreibung |
| `changed_fields` | `text[]` | betroffene Felder |
| `created_by` | `uuid` | Bearbeiter |
| `reviewed_by` | `uuid` | Prüfer |
| `approved_by` | `uuid` | Freigeber |
| `published_by` | `uuid` | veröffentlichender Benutzer |
| `rollback_from_version_id` | `uuid` | Ursprung bei Rollback |
| `created_at` | `timestamptz` | Version erstellt |
| `reviewed_at` | `timestamptz` | Prüfung |
| `approved_at` | `timestamptz` | Freigabe |
| `published_at` | `timestamptz` | Veröffentlichung |

Empfohlene Indizes:

- `(entity_type, entity_id, version_number desc)`
- `(status, created_at desc)`
- `(published_at desc)`
- `(created_by, created_at desc)`

### 4.9 `academy_publish_queue`

Zweck: geplante Veröffentlichungen, Rollbacks und Publish-Jobs.

Vorgeschlagene Spalten:

| Spalte | Typ | Zweck |
|---|---|---|
| `id` | `uuid` | Primärschlüssel |
| `entity_type` | `text` | betroffene Inhaltsart |
| `entity_id` | `uuid` | betroffene Entität |
| `version_id` | `uuid` | zu veröffentlichende Version |
| `publish_action` | `text` | `publish`, `unpublish`, `archive`, `rollback` |
| `scheduled_for` | `timestamptz` | geplanter Zeitpunkt |
| `status` | `text` | `queued`, `processing`, `completed`, `failed`, `cancelled` |
| `requested_by` | `uuid` | auslösender Benutzer |
| `processed_by` | `uuid` | System/Admin |
| `processed_at` | `timestamptz` | Ausführungszeit |
| `error_message` | `text` | Fehler |
| `idempotency_key` | `text` | Schutz gegen doppelte Ausführung |
| `created_at` | `timestamptz` | Erstellung |
| `updated_at` | `timestamptz` | Aktualisierung |

Empfohlene Indizes:

- `(status, scheduled_for)`
- `(entity_type, entity_id)`
- unique `idempotency_key`

## 5. Rollenmodell

### 5.1 Partner

Partner dürfen später:

- nur veröffentlichte und für sie freigegebene Inhalte sehen
- nur Inhalte ihres aktuellen Lernpfads sehen, falls Lernpfade aktiv sind
- geschützte Assets nur über autorisierte Routen öffnen
- keine Entwürfe, Reviews oder interne Kommentare sehen
- keine CMS-Daten schreiben

### 5.2 Leader

Leader dürfen später:

- veröffentlichte Partnerinhalte sehen
- optionale Leader-Inhalte sehen
- Team-bezogene Content-Empfehlungen sehen, sofern Teammodell vorhanden ist
- keine globalen Entwürfe oder fremde Teamdaten sehen
- CMS-Inhalte nur bearbeiten, wenn explizit eine CMS-Editor-Rolle vorliegt

Voraussetzung: Leader-Scope braucht eine echte Team-/Upline-Struktur. Aktuelle Teamzahlen reichen nicht für sichere Berechtigungen.

### 5.3 Admin

Admins dürfen später:

- CMS-Inhalte sehen
- Entwürfe erstellen
- Inhalte bearbeiten
- Review-Prozess einsehen
- Veröffentlichungen freigeben, falls keine Super-Admin-Pflicht besteht
- Archivieren und Rollback auslösen
- Audit- und Publish-Status sehen

### 5.4 Super Admin

Super Admins sollten später zusätzlich dürfen:

- globale CMS-Einstellungen verwalten
- Rollen vergeben
- kritische Rollbacks auslösen
- globale Broadcast-Auslöser freigeben
- Sprachmodelle und Pflichtsprachen verwalten
- irreversible Löschungen oder endgültige Archivierungen bestätigen

### 5.5 CMS Editor optional

Ein CMS Editor wäre eine optionale Spezialrolle.

Mögliche Rechte:

- Inhalte erstellen und bearbeiten
- Entwürfe speichern
- Review anfordern
- keine Veröffentlichung ohne Admin/Super-Admin-Freigabe
- keine Rollen-, Auth-, Partner- oder Systemänderungen

## 6. Workflow

Empfohlener Content-Workflow:

1. `draft` – Entwurf
2. `editing` – Bearbeitung
3. `review` – fachliche/sprachliche Prüfung
4. `approved` – freigegeben
5. `scheduled` – geplant
6. `published` – veröffentlicht
7. `archived` – archiviert
8. `rolled_back` – auf frühere Version zurückgesetzt

### 6.1 Entwurf

- CMS Editor oder Admin erstellt Inhalt.
- Inhalt ist für Partner nicht sichtbar.
- Version wird als Draft gespeichert.

### 6.2 Bearbeitung

- Änderungen erzeugen neue Versionen oder aktualisieren eine Draft-Version.
- Pflichtfelder und Sprachabdeckung werden validiert.
- Assets bleiben referenziert, aber nicht öffentlich.

### 6.3 Review

- Inhalt wird zur Prüfung markiert.
- Review prüft:
  - fachliche Richtigkeit
  - Sprache
  - Sichtbarkeit
  - Modul-/Lektionszuordnung
  - Asset-Sicherheit
  - rechtliche Risiken

### 6.4 Freigabe

- Admin oder Super Admin gibt Inhalt frei.
- Freigabe erzeugt Audit-Event.
- Noch keine automatische Veröffentlichung, falls Publish-Zeitpunkt gesetzt ist.

### 6.5 Geplant

- Einträge in `academy_publish_queue` steuern geplante Veröffentlichung.
- Jobs müssen idempotent sein.
- Fehler dürfen nicht zu doppelten Veröffentlichungen führen.

### 6.6 Veröffentlicht

- Nur veröffentlichte Versionen sind für Partner sichtbar.
- Veröffentlichte Inhalte erzeugen optional Events für Notification Engine und Task Engine.
- Modul-Updates dürfen später nur relevante Partner benachrichtigen.

### 6.7 Archiviert

- Archivierte Inhalte verschwinden aus Partneransichten.
- Historie und Versionen bleiben erhalten.
- Direkte Partnerlinks sollten saubere Fallbacks anzeigen.

### 6.8 Rollback

- Rollback erstellt eine neue Version aus einem früheren Snapshot.
- Rollback darf Historie nicht löschen.
- Kritische Rollbacks benötigen Admin- oder Super-Admin-Freigabe.

## 7. Mehrsprachigkeit

Aktuelle Sprachen:

- Deutsch (`de`)
- Russisch (`ru`)
- Rumänisch (`ro`)
- Englisch (`en`)

Spätere Erweiterungen sind möglich, z. B.:

- Tschechisch
- Türkisch
- Griechisch
- Italienisch
- Spanisch
- Polnisch

Empfohlene Regeln:

- Deutsch bleibt zunächst Default/Fallback.
- Jede veröffentlichte Entität muss mindestens eine Standardsprache haben.
- Zusätzliche Sprachen können pro Entität eigenen Review-Status haben.
- Fehlende Übersetzungen fallen kontrolliert auf Default zurück.
- Sprache darf nicht nur im Client entschieden werden; serverseitige APIs müssen Sprachfilter unterstützen.
- Übersetzungen sollen versioniert werden.

Empfohlene `jsonb`-Struktur für i18n-Felder:

```json
{
  "de": "Titel Deutsch",
  "en": "English title",
  "ru": "Русский заголовок",
  "ro": "Titlu română"
}
```

Bei hoher Skalierung oder professionellem Übersetzungsworkflow kann später eine eigene Translation-Tabelle sinnvoller sein. Für den ersten CMS-Schritt sind `jsonb`-Felder pro Entity wahrscheinlich risikoärmer.

## 8. Versionierung und Historie

Versionierung ist Pflicht, sobald Inhalte produktiv im CMS bearbeitet werden.

Empfohlene Prinzipien:

- Jede relevante Inhaltsänderung erzeugt eine Version.
- Veröffentlichte Inhalte verweisen auf eine konkrete Version.
- Rollback löscht keine Version.
- Review und Freigabe sind auditierbar.
- Änderungen an Videos/PDFs/Quiz können Notification-Events auslösen.
- Veröffentlichungszeitpunkte werden getrennt von Bearbeitungszeitpunkten gespeichert.

Wichtige Versionierungsfälle:

- neues Video
- Video ersetzt
- PDF aktualisiert
- Lektion ergänzt
- Quizfrage geändert
- Modulreihenfolge geändert
- Sichtbarkeit geändert
- Sprache ergänzt
- Growth-Center-Inhalt veröffentlicht
- Inhalt archiviert
- Rollback ausgeführt

## 9. API-Plan

Keine API-Endpunkte werden in diesem Schritt implementiert.

Mögliche spätere Route Handler oder Server Actions:

### Read APIs

- `getPublishedAcademyModules`
- `getPublishedModuleDetail`
- `getPublishedLesson`
- `getPublishedDownloads`
- `getPublishedQuiz`
- `getCmsDashboard`
- `getCmsModuleDrafts`
- `getCmsContentVersions`
- `getPublishQueue`

### Write APIs

- `createCmsDraft`
- `updateCmsDraft`
- `submitCmsReview`
- `approveCmsVersion`
- `scheduleCmsPublish`
- `publishCmsVersion`
- `archiveCmsContent`
- `rollbackCmsVersion`
- `attachCmsAsset`
- `updateCmsVisibility`

### Asset APIs

- `createAssetUploadIntent`
- `confirmAssetUpload`
- `replaceAsset`
- `archiveAsset`
- `getProtectedAssetUrl`

Diese Asset-Endpunkte dürfen später nur auf bestehenden sicheren Storage-/R2-/Asset-Flows aufbauen und müssen separate Freigabe erhalten.

### Anforderungen an alle APIs

- serverseitige Sessionprüfung
- serverseitige Rollenprüfung
- kein Vertrauen in clientseitige Rolle oder Status
- klare Fehlercodes 400/401/403/404
- Pagination für Adminlisten
- Audit-Event bei jeder Mutation
- Idempotency-Key bei Publish/Automation/Asset-Aktionen

## 10. Security und RLS-Konzept

### 10.1 Grundprinzipien

- Partner erhalten nur veröffentlichte, sichtbare Inhalte.
- Leader erhalten nur veröffentlichte Inhalte plus erlaubte Leader-Bereiche.
- Admin/CMS Editor erhalten Entwürfe nur über geschützte Adminrouten.
- Service-Role bleibt ausschließlich serverseitig.
- Direkter Clientzugriff auf CMS-Tabellen ist erst nach sauberem Auth-/RLS-Konzept erlaubt.
- `TO authenticated` allein ist nicht ausreichend; jede Policy braucht Ownership-, Rollen- oder Sichtbarkeitspredicate.
- UPDATE-Policies benötigen `USING` und `WITH CHECK`.

### 10.2 Hinweis zum aktuellen Auth-Modell

Das Projekt nutzt aktuell Custom-HMAC-Sessions. Deshalb ist klassische Supabase-RLS mit `auth.uid()` nicht sofort ausreichend.

Empfehlung:

1. CMS zunächst ausschließlich über geschützte Next.js Route Handler mit serverseitiger Autorisierung anbinden.
2. User-ID-Mapping zwischen Partner/Admin und Datenbank sauber definieren.
3. Team-/Leader-Struktur normalisieren.
4. Erst danach RLS produktiv aktivieren oder direkte Data-API-Nutzung zulassen.

### 10.3 RLS-Plan pro Tabelle

#### Partner-Lesezugriff

Partner dürfen nur lesen:

- `status = published`
- `visibility in ('partner', 'public')`
- zusätzliche Lernpfad-/Fortschrittsregeln erfüllt
- keine Drafts, Reviews, Versionen oder Publish Queue

#### Leader-Lesezugriff

Leader dürfen lesen:

- veröffentlichte Partnerinhalte
- veröffentlichte Leader-Inhalte
- Team-relevante Inhalte nur bei sicherer Teamzuordnung

#### Admin/CMS Editor Zugriff

Admin:

- Lesezugriff auf alle CMS-Entitäten
- Schreibzugriff auf Inhalte und Workflow-Aktionen nach Rolle

CMS Editor:

- Entwürfe erstellen/bearbeiten
- Review anfordern
- keine produktive Veröffentlichung ohne Freigabe

Super Admin:

- globale Einstellungen
- kritische Rollbacks
- Rollen und finale Freigaben

### 10.4 Sichtbarkeit

Empfohlene Sichtbarkeitswerte:

- `public`
- `partner`
- `leader`
- `admin`
- `cms_editor`
- `growth`
- `hidden`

### 10.5 Was nie ungefiltert in den Client darf

- Draft-Inhalte
- Review-Kommentare
- unveröffentlichte Quizlösungen
- interne Asset-Pfade
- private Storage/R2-Keys
- Publish Queue
- vollständige Version-Snapshots
- interne Admin-Kommentare
- globale CMS-Auditdaten

## 11. Automation und Event-Anbindung

Das CMS soll später nahtlos mit Task Engine und Notification Engine zusammenarbeiten.

### 11.1 Task Engine

Mögliche CMS-Auslöser:

- neues Modul veröffentlicht
- neue Lektion veröffentlicht
- neue Aufgabe im Modul ergänzt
- Quiz freigeschaltet
- Pflichtlektion geändert

Mögliche Task-Reaktionen:

- neue Aufgabe für berechtigte Partner
- Leader-Follow-up für betroffene Teams
- Admin-Aufgabe bei fehlender Übersetzung
- CMS-Review-Aufgabe für Editor

### 11.2 Notification Engine

Mögliche CMS-Auslöser:

- Modul aktualisiert
- neues PDF veröffentlicht
- neues Video verfügbar
- Quiz geändert
- Growth-Center-Update veröffentlicht
- Live-Training angekündigt

Wichtige Regel:

Modul-Updates dürfen nicht pauschal an alle Partner gesendet werden. Sie dürfen nur Partner erreichen, die das Modul bereits gesehen, begonnen, abgeschlossen oder laut Lernpfad erreicht haben. Neue Partner oder Partner, die das Modul noch nicht erreicht haben, sollen keine irrelevante Update-Meldung erhalten.

### 11.3 Kalender

Mögliche Verbindungen:

- Live-Training aus CMS wird Termin
- Content-Kalender plant Veröffentlichung
- Termin-Erinnerungen werden aus Publish Queue oder Kalender erzeugt

### 11.4 CRM

Mögliche Verbindungen:

- Partner erhält passenden Content je Status
- Kampagne wird CRM-Segment zugeordnet
- Leader sieht empfohlene Inhalte für Teammitglieder

### 11.5 n8n

Mögliche Automationen:

- Veröffentlichung triggert Übersetzungscheck
- neues Modul triggert Notification-Erstellung
- fehlgeschlagene Veröffentlichung erzeugt Admin-Aufgabe
- wöchentliche Content-Qualitätsprüfung

### 11.6 WhatsApp

Nur nach Opt-in und Freigabe:

- Termin-Erinnerung
- neue relevante Aufgabe
- relevante Leader-/Team-Mitteilung
- keine pauschalen Modul-Updates ohne Fortschrittsprüfung

### 11.7 Leonid OS

Mögliche Rolle:

- übergreifende Content-Priorisierung
- Event-Routing
- Team- und Kampagnensteuerung
- Qualitätskontrolle
- Priorisierung von Partner-Next-Steps

### 11.8 KI-Agenten

Mögliche Rolle:

- Vorschläge für Modulstruktur
- Übersetzungsvorschläge
- Quizvorschläge
- Download-Empfehlungen
- Lernpfad-Empfehlungen

Sicherheitsregel:

KI-Agenten dürfen keine Inhalte automatisch veröffentlichen und keine Benachrichtigungen ohne menschliche Freigabe an große Zielgruppen auslösen.

## 12. Risiken und offene Entscheidungen

Vor einer echten Backend-Implementierung müssen entschieden werden:

1. Auth-Modell: Custom Session langfristig beibehalten oder Supabase Auth Migration planen?
2. User-ID-Mapping: Welche ID ist verbindlich für `created_by`, `updated_by`, `approved_by`?
3. Rollenmodell: Wie werden Admin, Super Admin und CMS Editor zuverlässig gespeichert?
4. Leader-Scope: Wie wird Team-/Upline-Zugehörigkeit normalisiert?
5. Asset-Speicher: Welche Asset-Typen bleiben lokal privat, welche gehen in R2?
6. Upload-Freigabe: Wann darf CMS echte Uploads erhalten?
7. Versionierung: Vollständiger Snapshot oder feldbasierte Diffs?
8. Mehrsprachigkeit: `jsonb` pro Entität oder eigene Translation-Tabellen?
9. Review: Wer darf fachlich, rechtlich und sprachlich freigeben?
10. Quiz-Sicherheit: Wann werden richtige Antworten an den Client gesendet?
11. Progress-Kompatibilität: Wie werden bestehende statische Modul-IDs migriert?
12. Notification-Regeln: Welche Content-Änderungen triggern Benachrichtigungen?
13. Rollback: Wer darf kritische Inhalte zurücksetzen?
14. Archivierung: Wie lange bleiben alte Assets und Versionen erhalten?
15. Datenschutz: Welche Aktivitäts- und Content-Nutzungsdaten dürfen gespeichert werden?

## 13. Empfohlene Implementierungsreihenfolge

### Phase 1 – Datenmodell finalisieren

- Tabellenentwurf prüfen
- Feldnamen und Statuswerte finalisieren
- Legacy-Mapping für Module, Lektionen, Quiz und Downloads definieren
- Rollenkonzept für Admin, Super Admin, CMS Editor klären

### Phase 2 – Read-only CMS API

- veröffentlichte Module aus DB lesen
- Fallback auf statischen Katalog erhalten
- keine Mutationen
- Partneransicht unverändert halten

### Phase 3 – Admin Read API

- CMS-Dashboard aus DB lesen
- Drafts und Versionen nur Admin/CMS Editor anzeigen
- Pagination und Filter direkt einbauen

### Phase 4 – Draft Workflow

- Entwürfe erstellen und bearbeiten
- keine Veröffentlichung
- Versionen speichern
- Audit-Events erzeugen

### Phase 5 – Review und Freigabe

- Review-Status
- Freigabe durch Admin/Super Admin
- Pflichtprüfungen für Sprache, Asset, Sichtbarkeit

### Phase 6 – Publishing

- Publish Queue
- geplante Veröffentlichung
- Rollback
- Partneransicht liest nur veröffentlichte Versionen

### Phase 7 – Asset-Management

- Asset-Metadaten
- sichere Upload-Intents
- R2/private Storage Integration
- bestehende geschützte Auslieferung beibehalten

### Phase 8 – Quiz und Zertifizierung

- Quiz aus CMS lesen
- Quizfragen versionieren
- richtige Antworten serverseitig schützen
- Ergebnisse in separater Progress-/Assessment-Struktur speichern

### Phase 9 – Automation

- Task Engine Events
- Notification Engine Events
- n8n/CRM/WhatsApp/Leonid OS erst nach stabiler Event- und Idempotenzstruktur

### Phase 10 – Migration vom statischen Katalog

- bestehende Konstanten schrittweise migrieren
- Legacy-IDs erhalten
- Fallback aktiv lassen
- vollständige Regressionstests für Partner, Admin, Mobile und Asset-Zugriff

## 14. Bewusst nicht umgesetzt

In diesem Schritt wurde bewusst nicht umgesetzt:

- keine Login-Änderungen
- keine Registrierungsänderungen
- keine Auth-Änderungen
- keine API-Änderungen
- keine Datenbankänderungen
- keine Supabase-Änderungen
- keine R2-/Storage-Änderungen
- keine Infrastrukturänderungen
- keine Komponentenänderungen
- keine UI-/Design-Änderungen
- keine Partnerdatenänderungen
- keine Progress-Änderungen
- keine Quiz-Änderungen
- keine Zertifikatsänderungen
- keine Migrationen
- keine neuen Tabellen
- keine neuen Libraries
- keine produktiven Schreibvorgänge

## 15. Zusammenfassung

Die Harbor Global Partner Academy besitzt bereits eine solide statische Inhaltsstruktur und ein professionelles UI-only CMS. Der nächste sichere Enterprise-Schritt ist kein spontaner Umbau, sondern ein klar versioniertes CMS-Backend mit getrennten Tabellen für Module, Lektionen, Assets, Downloads, Quiz, Sprachen, Versionen und Publish Queue.

Die wichtigste Architekturentscheidung ist die Trennung zwischen:

- veröffentlichten Partnerinhalten
- internen Entwürfen
- Versionen und Rollbacks
- geschützten Assets
- Progress-/Quiz-/Zertifikatsdaten
- Task-/Notification-Events

Damit kann die Academy später produktiv gepflegt werden, ohne Login, Partnerdaten, Storage-Sicherheit oder bestehende Lernflows zu gefährden.
