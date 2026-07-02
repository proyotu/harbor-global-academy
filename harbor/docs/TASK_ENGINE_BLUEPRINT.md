# Harbor Global Partner Academy - Task Engine Backend Blueprint

Stand: 2026-07-01  
Status: Planung / Blueprint, nicht produktiv implementiert

## 1. Zweck

Dieses Dokument beschreibt die zukünftige Backend-Grundlage für eine echte Task Engine der Harbor Global Partner Academy.

Wichtig:

- Keine Tabellen wurden angelegt.
- Keine Migration wurde ausgeführt.
- Keine API-Endpunkte wurden gebaut.
- Keine RLS-Policies wurden produktiv geschrieben.
- Keine produktiven Schreibvorgänge wurden durchgeführt.
- Bestehende Login-, Registrierungs-, Auth-, Supabase-, R2-/Storage- und Infrastruktur-Flows bleiben unverändert.

Die Task Engine soll später Aufgaben, Follow-ups, Leader-Steuerung, Automationen, Notification Center, CRM, n8n, WhatsApp, E-Mail, Leonid OS und KI-Agenten sauber verbinden, ohne vorhandene Partnerdaten oder Profilbild-Metadaten zu missbrauchen.

## 2. Aktueller Ist-Zustand

### 2.1 Tech Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS
- Supabase Postgres REST API
- Custom HMAC Sessions über `HARBOR_AUTH_SECRET`
- PBKDF2-Passwort-Hashes
- R2 für aktuelle Upload-Flows
- Geschützte Next.js Route Handler für Partner-, Community-, Dokument- und Videozugriffe

### 2.2 Aktuelle Supabase-/Datenbankstruktur im Code

Lokal dokumentiert bzw. im Code verwendet:

- Haupttabelle: `public.partners`
- Lokale SQL-Notizen:
  - `supabase/close-anonymous-partner-access.sql`
  - `supabase/legal-consent-columns.sql`
  - `supabase/email-password-reset-notes.sql`

Aktuell bekannte Partnerfelder aus dem Code:

- `id`
- `firstname`
- `lastname`
- `email`
- `phone`
- `city`
- `discount_code`
- `status`
- `avatar_url`
- `created_at`
- optionale Legal-Consent-Spalten:
  - `accepted_terms`
  - `accepted_terms_at`
  - `accepted_privacy`
  - `accepted_privacy_at`
  - `training_content_consent`
  - `training_content_consent_at`

Architekturrisiko:

- Viele Partner-Metadaten liegen aktuell als JSON in `partners.avatar_url`.
- Community-Systemdaten werden ebenfalls als JSON in Systemzeilen der `partners`-Tabelle gespeichert.
- Für die Task Engine darf dieses Muster nicht erweitert werden.

### 2.3 Auth-/User-/Partner-Modell

Aktuell:

- Kein Supabase Auth als primäres Auth-System.
- Registrierung schreibt Partner in `public.partners`.
- Passwort-Hash und Salt liegen in den Partner-Metadaten.
- Login akzeptiert E-Mail oder Rabattcode plus Passwort.
- Session-Token ist ein HMAC-signierter Bearer Token.
- `makeSession()` schreibt `id`, `email`, `role`, `exp` in das Session-Payload.
- Pending, rejected, blocked und andere nicht freigegebene Partner erhalten keinen Dashboard-Zugriff.
- Admin wird über `HARBOR_ADMIN_EMAIL` / `HARBOR_ADMIN_PASSWORD` und/oder Admin-Profil-Metadaten ermöglicht.

Task-Engine-Konsequenz:

- `assigned_to_user_id`, `assigned_by_user_id`, `actor_user_id` sollten zunächst auf `partners.id` referenzieren.
- Wenn später Supabase Auth eingeführt wird, braucht die Task Engine eine geplante Kompatibilitätsschicht oder Migration zu `auth.users.id`.

### 2.4 Rollenmodell

Aktuell im Code:

- `partner`: Standardrolle aus Metadaten.
- `admin`: Adminrolle aus Admin-Session bzw. Metadaten.
- `leader`: als UI-/Analytics-Konzept vorhanden, aber nicht als harte, normalisierte Datenbankrolle abgesichert.

Leader-Erkennung ist aktuell vor allem aus vorhandenen Partner-/Team-/Level-Feldern bzw. UI-Helfern ableitbar. Für echte Teamaufgaben braucht es später eine normalisierte Team-/Upline-Struktur.

### 2.5 Vorhandene Progressdaten

Aktuell:

- Academy-Inhalte liegen statisch in `app/lib/academy-content.js`.
- Fortschritt wird in `app/lib/academy-progress.js` normalisiert.
- `academyProgress` wird aus vorhandenen Metadaten gelesen.
- Aktuelle UI ist weitgehend read-only bzw. lokal.
- Persistenter Quiz-, Zertifikats- und Aufgabenstatus ist noch nicht sauber normalisiert.

Task-Engine-Konsequenz:

- Aufgaben können später mit `related_module_id` und `related_lesson_id` an den statischen Katalog angebunden werden.
- Produktiver Fortschritt sollte langfristig in eigenen Progress-/Completion-Tabellen liegen, nicht in `avatar_url`.

### 2.6 Bestehende API-Routen

Relevante Route Handler:

- `app/api/partners/route.js`
  - `register`
  - `login`
  - `password-reset-request`
  - `password-reset-confirm`
  - `profile-notification-preferences`
  - `profile-photo-update`
  - `session`
  - `admin-list`
  - `admin-detail`
  - `academy-ranking`
  - `career-screenshot`
  - `team-growth-update`
  - `admin-update`
  - `admin-approve`
  - `admin-send-reminder`
  - `admin-delete`
  - `admin-clean-test-data`
- `app/api/community/route.js`
  - `community-state`
  - `presence-heartbeat`
  - `chat-send`
  - `chat-delete`
  - `question-create`
  - `answer-create`
  - `answer-update`
  - `answer-best`
  - `academy-update-create`
  - `notification-read`
  - `notifications-read`
  - `testimonial-state`
  - `testimonial-submit`
  - `testimonial-admin-update`
  - `testimonial-admin-delete`
- `app/api/academy-documents/route.js`
- `app/api/academy-videos/route.js`
- `app/api/video-transcripts/route.js`
- `app/api/supabase/route.js`

Aktuell existiert kein Task-spezifischer API-Endpunkt.

## 3. Zielarchitektur Tabellen

Die folgenden Tabellen sind Vorschläge für eine spätere separate Migration. Sie dürfen erst nach expliziter Freigabe umgesetzt werden.

### 3.1 `academy_task_templates`

Zweck: Wiederverwendbare Aufgaben-Vorlagen.

Vorgeschlagene Felder:

| Feld | Typ-Vorschlag | Zweck |
| --- | --- | --- |
| `id` | `uuid primary key default gen_random_uuid()` | Eindeutige Template-ID |
| `title` | `text not null` | Titel der Aufgabe |
| `description` | `text` | Beschreibung / Anleitung |
| `task_type` | `text not null` | `module_view`, `quiz_complete`, `profile_complete`, `appointment_book`, `leader_contact`, `team_meeting`, `product_training`, `marketing_task`, `follow_up`, `custom` |
| `default_priority` | `text not null default 'medium'` | `high`, `medium`, `low` |
| `target_role` | `text not null default 'partner'` | `partner`, `leader`, `admin` |
| `related_module_id` | `integer` | Verbindung zum Academy-Modulkatalog |
| `related_lesson_id` | `text` | Verbindung zu Lektionen aus `academy-content.js` |
| `is_active` | `boolean not null default true` | Vorlage aktiv/inaktiv |
| `created_by` | `uuid` | Partner/Admin-ID aus `partners.id` |
| `created_at` | `timestamptz not null default now()` | Erstellung |
| `updated_at` | `timestamptz not null default now()` | letzte Änderung |

Empfohlene Constraints:

- `task_type in (...)`
- `default_priority in ('high', 'medium', 'low')`
- `target_role in ('partner', 'leader', 'admin')`
- `title` nicht leer

Empfohlene Indizes:

- `(is_active, target_role)`
- `(task_type)`
- `(related_module_id)`
- `(created_at desc)`

### 3.2 `academy_task_assignments`

Zweck: Konkrete Aufgabe für Partner, Leader oder Team.

Vorgeschlagene Felder:

| Feld | Typ-Vorschlag | Zweck |
| --- | --- | --- |
| `id` | `uuid primary key default gen_random_uuid()` | Eindeutige Aufgaben-ID |
| `template_id` | `uuid references academy_task_templates(id)` | optionale Vorlage |
| `assigned_to_user_id` | `uuid not null` | Zielpartner/-leader; zunächst `partners.id` |
| `assigned_by_user_id` | `uuid` | Ersteller; zunächst `partners.id` |
| `team_id` | `uuid` | spätere Team-/Upline-Verknüpfung |
| `status` | `text not null default 'open'` | `open`, `today`, `in_progress`, `done`, `overdue`, `cancelled` |
| `priority` | `text not null default 'medium'` | `high`, `medium`, `low` |
| `due_date` | `timestamptz` | Fälligkeit |
| `completed_at` | `timestamptz` | Abschlusszeitpunkt |
| `related_module_id` | `integer` | Modulbezug |
| `related_lesson_id` | `text` | Lektionbezug |
| `notes` | `text` | kurze interne/operative Notiz |
| `created_at` | `timestamptz not null default now()` | Erstellung |
| `updated_at` | `timestamptz not null default now()` | letzte Änderung |

Empfohlene Constraints:

- `status in ('open', 'today', 'in_progress', 'done', 'overdue', 'cancelled')`
- `priority in ('high', 'medium', 'low')`
- `completed_at is not null` nur bei `status = 'done'` optional per Check oder serverseitig erzwingen

Empfohlene Indizes:

- `(assigned_to_user_id, status, due_date)`
- `(assigned_by_user_id, created_at desc)`
- `(team_id, status, due_date)`
- `(related_module_id, related_lesson_id)`
- `(status, due_date)`
- partieller Index für offene Aufgaben: `where status in ('open', 'today', 'in_progress', 'overdue')`

### 3.3 `academy_task_events`

Zweck: Audit-Historie pro Aufgabe.

Vorgeschlagene Felder:

| Feld | Typ-Vorschlag | Zweck |
| --- | --- | --- |
| `id` | `uuid primary key default gen_random_uuid()` | Event-ID |
| `task_assignment_id` | `uuid not null references academy_task_assignments(id) on delete cascade` | Aufgabe |
| `actor_user_id` | `uuid` | auslösender Partner/Admin/Leader |
| `event_type` | `text not null` | `created`, `assigned`, `status_changed`, `comment_added`, `due_date_changed`, `priority_changed`, `completed`, `reopened`, `cancelled`, `automation_triggered` |
| `old_status` | `text` | alter Status |
| `new_status` | `text` | neuer Status |
| `comment` | `text` | Event-Kommentar |
| `created_at` | `timestamptz not null default now()` | Event-Zeit |

Empfohlene Indizes:

- `(task_assignment_id, created_at desc)`
- `(actor_user_id, created_at desc)`
- `(event_type, created_at desc)`

### 3.4 `academy_task_comments`

Zweck: Interne Notizen und Follow-up-Kommentare.

Vorgeschlagene Felder:

| Feld | Typ-Vorschlag | Zweck |
| --- | --- | --- |
| `id` | `uuid primary key default gen_random_uuid()` | Kommentar-ID |
| `task_assignment_id` | `uuid not null references academy_task_assignments(id) on delete cascade` | Aufgabe |
| `author_user_id` | `uuid not null` | Autor, zunächst `partners.id` |
| `comment` | `text not null` | Inhalt |
| `visibility` | `text not null default 'internal'` | `private`, `team`, `internal`, `partner_visible` |
| `created_at` | `timestamptz not null default now()` | Erstellung |
| `updated_at` | `timestamptz not null default now()` | Änderung |

Empfohlene Constraints:

- `visibility in ('private', 'team', 'internal', 'partner_visible')`
- `comment` nicht leer

Empfohlene Indizes:

- `(task_assignment_id, created_at desc)`
- `(author_user_id, created_at desc)`
- `(visibility)`

## 4. Rollen- und Berechtigungsmodell

### Partner

Partner dürfen später:

- nur eigene Aufgaben sehen;
- eigene Aufgaben als `done` markieren, wenn die Aufgabe an sie zugewiesen ist;
- eigene Aufgaben von `open` zu `in_progress` ändern;
- Kommentare schreiben, falls `visibility` und Produktentscheidung das erlauben;
- keine Team- oder Admin-Aufgaben sehen;
- keine Templates erstellen.

### Leader

Leader dürfen später, sofern freigegeben:

- Aufgaben eigener Teammitglieder sehen;
- Teamaufgaben erstellen oder zuweisen;
- Status für eigene Teamaufgaben ändern;
- Follow-up-Kommentare für eigene Teammitglieder schreiben;
- keine globalen Admin-Aufgaben sehen;
- keine fremden Teams sehen.

Voraussetzung:

- Es braucht eine verlässliche Team-/Upline-Struktur.
- Aktuelle Teamzahlen im Profil reichen nicht für sichere Berechtigungen.

### Admin

Admin darf später:

- alle Aufgaben sehen;
- Templates erstellen, bearbeiten, archivieren;
- Aufgaben global oder teambezogen zuweisen;
- Systemaufgaben verwalten;
- Events/Audit-Historie einsehen;
- sensible oder irreversible Aufgabenänderungen nur über bestätigte Admin-Flows ausführen.

## 5. RLS- und Security-Plan

Wichtig: Keine der folgenden Policies wurde produktiv erstellt. Es ist ein Plan.

### 5.1 Grundannahme

Da das Projekt aktuell Custom-HMAC-Sessions statt Supabase Auth verwendet, kann klassische Supabase-RLS mit `auth.uid()` nicht sofort sauber funktionieren.

Empfohlene Reihenfolge:

1. Task Engine zunächst serverseitig über geschützte Next.js Route Handler mit Service Role betreiben.
2. Serverseitige Autorisierung in jeder Task-Route prüfen.
3. RLS zusätzlich als Defense-in-Depth aktivieren, sobald ein verlässlicher DB-seitiger User-Kontext existiert.
4. Vor direkter Client-Data-API-Nutzung unbedingt Supabase Auth oder ein sicheres Mapping zu `auth.users` planen.

### 5.2 Benötigte Team-/Rollen-Hilfen

Für echte Leader-RLS wird mindestens eine der folgenden Strukturen benötigt:

- `teams`
- `team_memberships`
- `partner_uplines`
- oder ein eigenes Partner-OS-Teammodell

Minimaler späterer Vorschlag:

- `teams(id, name, leader_user_id, created_at, updated_at)`
- `team_memberships(id, team_id, partner_user_id, role, active, created_at, updated_at)`

Ohne diese Struktur darf Leader-Zugriff nicht anhand von Clientdaten, Namen, Punkten oder Teamzählwerten entschieden werden.

### 5.3 RLS-Plan pro Tabelle

#### `academy_task_templates`

Policies:

- Partner: `select` nur aktive Templates, die für Partner sichtbar sind und z. B. onboarding-/academybezogen sind.
- Leader: `select` aktive Templates für Leader/Partner.
- Admin: `select`, `insert`, `update`, optional `delete` oder besser `archive`.

Risiko:

- Templates können interne Admin- oder Leader-Prozesse enthalten. Nicht ungefiltert an Partner ausliefern.

#### `academy_task_assignments`

Policies:

- Partner `select`: nur `assigned_to_user_id = current_user_id`.
- Partner `update`: nur eigene Aufgabe, nur erlaubte Statusfelder, keine Änderung an `assigned_to_user_id`, `assigned_by_user_id`, `team_id`.
- Leader `select`: nur Aufgaben von Mitgliedern des eigenen Teams.
- Leader `insert`: nur für eigene Teammitglieder.
- Leader `update`: nur für Aufgaben im eigenen Team und nur erlaubte Felder.
- Admin: Vollzugriff.

Risiko:

- `TO authenticated` ohne ownership/team predicate wäre BOLA/IDOR.
- UPDATE braucht in Postgres RLS immer passende SELECT-Policy plus `USING` und `WITH CHECK`.

#### `academy_task_events`

Policies:

- Partner `select`: nur Events zu eigenen Aufgaben, ggf. ohne interne Kommentare.
- Leader `select`: nur Events zu eigenen Teamaufgaben.
- Admin: alle Events.
- Insert idealerweise nur serverseitig, nicht direkt aus dem Client.

Risiko:

- Events können Admin-Kommentare oder interne Folgeaktionen enthalten. Kommentare ggf. getrennt filtern oder sensible Inhalte nicht in `event.comment` speichern.

#### `academy_task_comments`

Policies:

- Partner `select`: nur Kommentare zu eigenen Aufgaben und nur `visibility = 'partner_visible'`.
- Partner `insert`: optional nur eigene sichtbare Kommentare, falls freigegeben.
- Leader `select`: Team-Kommentare eigener Teamaufgaben mit `visibility in ('team', 'partner_visible')`.
- Admin: alle Kommentare.

Risiko:

- Interne Admin-Kommentare dürfen nie clientseitig ungefiltert geladen werden.

### 5.4 Was nie ungefiltert in den Client darf

- Alle Task Assignments aller Partner.
- Admin-Kommentare.
- Interne Follow-up-Kommentare.
- Aufgaben anderer Teams.
- `assigned_by_user_id`/Teamstrukturen fremder Leader, wenn daraus sensible Beziehungsdaten ableitbar sind.
- Event-Historien mit internen Kommentaren.
- Template-Entwürfe, archivierte oder interne Systemaufgaben.

## 6. API-Plan

Keine Endpunkte wurden gebaut. Vorschlag für spätere geschützte Server-Actions bzw. Route Handler:

### `getMyTasks`

- Rolle: Partner, Leader, Admin.
- Gibt nur Aufgaben des eingeloggten Nutzers zurück.
- Filter: Status, Fälligkeit, Modul, Priorität.
- Serverseitig Session prüfen und `assigned_to_user_id = session.id` erzwingen.

### `getTeamTasks`

- Rolle: Leader, Admin.
- Leader sieht nur eigenes Team.
- Admin kann optional nach Team/Leader filtern.
- Voraussetzung: sichere Team-Mitgliedschaft.

### `getAdminTasks`

- Rolle: Admin.
- Globale Übersicht.
- Filter: Status, Rolle, Team, Modul, Fälligkeit, Priorität.
- Pagination zwingend.

### `createTaskTemplate`

- Rolle: Admin.
- Erstellt Aufgaben-Vorlagen.
- Validierung: Typ, Zielrolle, Priorität, Modul-/Lektionsbezug.
- Sollte Event `template_created` erzeugen.

### `assignTask`

- Rolle: Admin, optional Leader.
- Admin: global, team- oder partnerbezogen.
- Leader: nur eigene Teammitglieder.
- Muss `academy_task_assignments` und `academy_task_events` schreiben.

### `updateTaskStatus`

- Rolle: Partner, Leader, Admin.
- Partner: nur eigene Aufgaben und erlaubte Statuswechsel.
- Leader: nur Teamaufgaben.
- Admin: alle.
- Muss altes/neues Statuspaar prüfen und Event schreiben.

### `addTaskComment`

- Rolle: Partner optional, Leader, Admin.
- Sichtbarkeit strikt prüfen.
- Kommentar-Länge limitieren.
- Optional Event `comment_added`.

### `getTaskEvents`

- Rolle: abhängig vom Assignment.
- Partner sieht nur partnerfreigegebene Events.
- Leader sieht Teamevents.
- Admin sieht alles.
- Pagination zwingend.

## 7. Event- und Automation-Plan

Spätere Events:

- `task_created`
- `task_assigned`
- `task_due_today`
- `task_overdue`
- `task_completed`
- `task_reopened`
- `module_started`
- `module_completed`
- `lesson_completed`
- `quiz_passed`
- `certificate_available`
- `leader_follow_up_required`
- `comment_added`
- `automation_triggered`

Spätere Verbraucher:

- Notification Center
- WhatsApp
- E-Mail
- n8n
- CRM
- Leonid OS
- KI-Agenten

Wichtige Regel:

- Automationen müssen idempotent sein. Ein Event darf nicht mehrfach dieselbe WhatsApp/E-Mail auslösen, wenn ein Request wiederholt wird.
- Benachrichtigungen zu Modul-Updates dürfen später nur an Partner gehen, die das Modul bereits gesehen oder abgeschlossen haben.
- Globale Academy-Updates bleiben eine explizite Ausnahme und müssen bewusst als global markiert sein.

## 8. Risiken

1. **Custom Auth vs. RLS**
   - Ohne Supabase Auth gibt es keinen natürlichen `auth.uid()`-Kontext für RLS.
   - Direkte Client-Data-API-Nutzung wäre riskant.

2. **Leader-Scope fehlt**
   - Aktuelle Teamzahlen sind keine Berechtigungsgrundlage.
   - Leader-Zugriff braucht Team-/Upline-Tabellen.

3. **`avatar_url` ist überlastet**
   - Keine neuen Task-, Progress- oder Kommentarstrukturen dort speichern.

4. **Admin-Kommentare sind sensibel**
   - Interne Notizen brauchen klare Sichtbarkeit und serverseitige Filterung.

5. **Automations-Duplikate**
   - Events und externe Versandprozesse brauchen Idempotency Keys.

6. **Skalierung**
   - Für 500 bis 25.000 Partner sind Pagination, Indizes und serverseitige Filter Pflicht.

## 9. Offene Entscheidungen

- Soll die Task Engine zunächst vollständig über Next.js Route Handler mit Service Role laufen?
- Wann wird Supabase Auth oder ein anderes DB-seitiges User-Mapping eingeführt?
- Wie wird Team-/Upline-Struktur modelliert?
- Dürfen Partner eigene Kommentare schreiben oder nur Status setzen?
- Darf ein Leader Aufgaben selbst erstellen oder nur aus Vorlagen zuweisen?
- Werden Task Templates mehrsprachig gespeichert oder aus dem statischen Academy-Katalog übersetzt?
- Werden Tasks an einzelne Partner, Teams, Rollen oder Segmente zugewiesen?
- Welche Events sollen E-Mail/WhatsApp/n8n auslösen?

## 10. Empfohlene Implementierungsreihenfolge

### Phase 1: Datenmodell-Freigabe

- Tabellen und Felder final prüfen.
- Team-/Upline-Abhängigkeit klären.
- Status-, Typ- und Prioritätswerte finalisieren.
- Migration als Entwurf erstellen, aber noch nicht produktiv ausführen.

### Phase 2: Security-Design

- Serverseitige Berechtigungsfunktionen planen.
- RLS-Strategie abhängig von Auth-Modell entscheiden.
- Admin-/Leader-/Partner-Scope in Testfällen definieren.

### Phase 3: Read-only API

- `getMyTasks`
- `getTeamTasks`
- `getAdminTasks`
- Noch keine Mutationen.
- Pagination und Filter direkt einbauen.

### Phase 4: Mutations mit Events

- `assignTask`
- `updateTaskStatus`
- `addTaskComment`
- Jedes Write erzeugt ein Event.
- Idempotenz vorbereiten.

### Phase 5: UI-Anbindung

- Bestehendes Success Center an echte Task API anbinden.
- Empty States behalten.
- UI-Fallback für nicht freigeschaltete Task Engine erhalten.

### Phase 6: Automationen

- Notification Center anbinden.
- Danach E-Mail/WhatsApp/n8n/CRM.
- Erst nach Event- und Idempotenztests.

### Phase 7: Skalierung und Monitoring

- Indizes prüfen.
- Query-Pläne prüfen.
- Rate Limits und Audit Logs ergänzen.
- End-to-End-Tests für Partner, Leader und Admin.

## 11. Zusammenfassung

Die Task Engine sollte nicht auf der aktuellen JSON-Metadatenstruktur aufbauen. Der sichere Weg ist eine klar getrennte Tabellenstruktur mit Templates, Assignments, Events und Comments. Für Leader-Funktionen ist zusätzlich eine echte Team-/Upline-Struktur erforderlich. Bis diese Grundlagen freigegeben sind, bleibt die bestehende Task Engine im Frontend bewusst UI-only/read-only.
