# Harbor Global Partner Academy – Notification Engine Backend Blueprint

Stand: 2026-07-01  
Status: Architektur-Blueprint, keine produktive Implementierung

## 1. Ziel und Geltungsbereich

Dieses Dokument beschreibt die zukünftige Enterprise-Architektur für eine echte Notification Engine der Harbor Global Partner Academy.

Der Blueprint ist bewusst nicht produktiv umgesetzt. Es wurden keine Tabellen angelegt, keine Migrationen ausgeführt, keine API-Endpunkte erstellt, keine RLS-Policies aktiviert und keine bestehenden Partnerdaten verändert.

Ziel der späteren Notification Engine ist ein rollen-, fortschritts- und zielgruppenbasiertes Benachrichtigungssystem für:

- Academy-Inhalte
- Task Engine
- Kalender und Termine
- Community
- Growth Center
- Leader- und Admin-Dashboards
- spätere Kanäle wie E-Mail, WhatsApp, Push, n8n, CRM, Leonid OS und KI-Agenten

Wichtig: Benachrichtigungen dürfen nicht pauschal an alle Partner gesendet werden. Partner sollen nur Meldungen erhalten, die zu ihrer Rolle, ihrem Fortschritt, ihren Aufgaben, ihren Terminen und ihrer tatsächlichen Academy-Position passen.

## 2. Aktueller Ist-Zustand

### 2.1 Bestehende Academy-Updates und Notification Center

Im aktuellen Projekt existiert bereits eine vorbereitete Notification-/Academy-Update-Logik:

- `app/api/community/route.js` verwaltet Academy-Updates und Benachrichtigungen.
- Academy-Updates werden als `academy-update` behandelt.
- Systemdaten werden aktuell in speziellen System-Partnerzeilen gespeichert.
- Der aktuelle Notification-Speicher nutzt JSON-Strukturen innerhalb bestehender Partnerdaten.
- Gelesen-Status wird aktuell über eine `seenBy`-Liste pro Meldung abgebildet.
- Es existieren Aktionen zum Erstellen von Academy-Updates und zum Markieren einzelner oder aller Meldungen als gelesen.

Diese Lösung ist für die aktuelle UI-Vorbereitung ausreichend, aber nicht als langfristige Enterprise-Struktur für 500 bis 25.000 Partner geeignet.

### 2.2 Bestehende Frontend-Bereiche

Im Frontend existieren bereits vorbereitete UI-Bereiche:

- Notification Center
- Dashboard-Widget „Neueste Benachrichtigungen“
- Academy Updates
- Success Center
- Growth Center
- Admin-Vorbereitung für Academy-Mitteilungen
- Profilbereich mit vorbereiteten Benachrichtigungseinstellungen

Die bestehende UI ist damit eine gute Grundlage für eine spätere echte Notification Engine.

### 2.3 Rollenmodell

Aktuell werden die Rollen Partner, Leader und Admin bereits in mehreren Bereichen der Oberfläche verwendet.

Für eine produktive Notification Engine muss später jedoch sauber serverseitig festgelegt werden:

- Wer ist Partner?
- Wer ist Leader?
- Welche Partner gehören zu welchem Leader oder Team?
- Welche Admins dürfen globale Benachrichtigungen erstellen?
- Welche Benutzer dürfen Team- oder Systemmeldungen sehen?

Die aktuelle Leader-/Teamlogik ist für UI und Vorbereitung geeignet, ersetzt aber noch kein vollständiges serverseitiges Berechtigungsmodell.

### 2.4 Progressdaten

Es existieren bereits Academy-Fortschrittsdaten und Frontend-Logik für:

- Modulfortschritt
- abgeschlossene Videos
- abgeschlossene Module
- Onboarding-Status
- letzte Trainingsaktivität
- nächstes empfohlenes Modul

Diese Daten sind für die spätere Zielgruppenlogik entscheidend. Besonders wichtig ist die Regel: Modul-Updates sollen später nur Partner erreichen, die das betreffende Modul bereits gesehen, begonnen oder abgeschlossen haben.

## 3. Zielarchitektur

Die Notification Engine sollte langfristig als normalisierte, eventbasierte und rollenbasierte Struktur aufgebaut werden.

Empfohlene Kernprinzipien:

1. Benachrichtigungen werden nicht direkt an alle Benutzer verteilt.
2. Jede Meldung hat eine Zielgruppenregel.
3. Jede tatsächliche Zustellung wird separat pro Empfänger gespeichert.
4. Lesen, Zustellen, Fehlschläge und Archivieren werden als Events dokumentiert.
5. Präferenzen pro Benutzer werden getrennt gespeichert.
6. Externe Kanäle wie E-Mail oder WhatsApp werden über Delivery-Records und Events angebunden.
7. Admin, Leader und Partner erhalten streng getrennte Sichtbereiche.

## 4. Geplante Tabellen

### 4.1 `academy_notifications`

Zweck: Zentrale Benachrichtigungsobjekte, die fachlich beschreiben, was passiert ist.

Vorgeschlagene Spalten:

| Spalte | Typ | Zweck |
|---|---|---|
| `id` | `uuid` | Primärschlüssel |
| `template_id` | `uuid` | Optionaler Verweis auf Vorlage |
| `source_type` | `text` | Quelle, z. B. `academy`, `task`, `calendar`, `cms`, `community` |
| `source_id` | `text` | ID des Quellobjekts, falls vorhanden |
| `notification_type` | `text` | Fachlicher Typ, z. B. `new_module_available` |
| `category` | `text` | `academy`, `team`, `admin`, `leader`, `system`, `growth` |
| `title` | `text` | Titel der Meldung |
| `body` | `text` | Kurzbeschreibung |
| `priority` | `text` | `low`, `normal`, `high`, `critical` |
| `status` | `text` | `draft`, `scheduled`, `published`, `archived` |
| `audience_scope` | `text` | `user`, `team`, `role`, `segment`, `global` |
| `target_role` | `text` | Optional: `partner`, `leader`, `admin` |
| `target_user_id` | `uuid` | Optionaler direkter Empfänger |
| `target_team_id` | `uuid` | Optionales Team-Ziel |
| `related_module_id` | `text` | Optionales Modul |
| `related_lesson_id` | `text` | Optionale Lektion |
| `related_task_assignment_id` | `uuid` | Optionale Aufgabe |
| `related_appointment_id` | `uuid` | Optionaler Termin |
| `related_certificate_id` | `uuid` | Optionales Zertifikat |
| `audience_rule` | `jsonb` | Zielgruppenregel, z. B. Fortschritt, Sprache, Status |
| `metadata` | `jsonb` | Erweiterbare Metadaten |
| `created_by` | `uuid` | Ersteller |
| `publish_at` | `timestamptz` | Veröffentlichungszeitpunkt |
| `expires_at` | `timestamptz` | Optionales Ablaufdatum |
| `archived_at` | `timestamptz` | Archivierungszeitpunkt |
| `created_at` | `timestamptz` | Erstellung |
| `updated_at` | `timestamptz` | Aktualisierung |

Empfohlene Indizes:

- `(status, publish_at)`
- `(notification_type)`
- `(category)`
- `(target_user_id, status)`
- `(target_team_id, status)`
- `(target_role, status)`
- `(related_module_id)`
- optional GIN-Index auf `audience_rule` oder `metadata`, falls häufig segmentiert wird

### 4.2 `academy_notification_templates`

Zweck: Wiederverwendbare Vorlagen für System-, Academy-, Team- und Admin-Meldungen.

Vorgeschlagene Spalten:

| Spalte | Typ | Zweck |
|---|---|---|
| `id` | `uuid` | Primärschlüssel |
| `name` | `text` | Interner Name |
| `notification_type` | `text` | Fachlicher Typ |
| `category` | `text` | Kategorie |
| `title_template` | `text` | Titelvorlage |
| `body_template` | `text` | Textvorlage |
| `default_priority` | `text` | Standardpriorität |
| `default_channels` | `jsonb` | Vorgesehene Kanäle |
| `target_role` | `text` | Standard-Zielrolle |
| `audience_rule` | `jsonb` | Standard-Zielgruppenregel |
| `language` | `text` | `de`, `ru`, `ro`, `en` |
| `is_active` | `boolean` | Vorlage aktiv |
| `created_by` | `uuid` | Ersteller |
| `created_at` | `timestamptz` | Erstellung |
| `updated_at` | `timestamptz` | Aktualisierung |

Empfohlene Indizes:

- `(notification_type, language)`
- `(category, is_active)`
- `(target_role, is_active)`

### 4.3 `academy_notification_delivery`

Zweck: Zustellung pro Empfänger und Kanal. Diese Tabelle verhindert, dass Zielgruppenlogik und Lesestatus in der Hauptmeldung vermischt werden.

Vorgeschlagene Spalten:

| Spalte | Typ | Zweck |
|---|---|---|
| `id` | `uuid` | Primärschlüssel |
| `notification_id` | `uuid` | Verweis auf `academy_notifications` |
| `recipient_user_id` | `uuid` | Empfänger |
| `team_id` | `uuid` | Optionaler Teamkontext |
| `channel` | `text` | `in_app`, `push`, `email`, `whatsapp`, `crm`, `n8n` |
| `delivery_status` | `text` | `queued`, `sent`, `delivered`, `read`, `failed`, `archived` |
| `seen_at` | `timestamptz` | Sichtbar geworden |
| `read_at` | `timestamptz` | Gelesen |
| `sent_at` | `timestamptz` | Gesendet |
| `delivered_at` | `timestamptz` | Zugestellt |
| `failed_at` | `timestamptz` | Fehlgeschlagen |
| `error_message` | `text` | Fehlerbeschreibung |
| `provider_message_id` | `text` | Externe Provider-ID |
| `idempotency_key` | `text` | Schutz gegen doppelte Zustellung |
| `created_at` | `timestamptz` | Erstellung |
| `updated_at` | `timestamptz` | Aktualisierung |

Empfohlene Indizes:

- `(recipient_user_id, delivery_status)`
- `(recipient_user_id, read_at)`
- `(notification_id)`
- `(team_id, delivery_status)`
- `(channel, delivery_status)`
- eindeutiger Index auf `(notification_id, recipient_user_id, channel)`
- eindeutiger Index auf `idempotency_key`, falls gesetzt

### 4.4 `academy_notification_events`

Zweck: Audit- und Ereignishistorie für Benachrichtigungen.

Vorgeschlagene Spalten:

| Spalte | Typ | Zweck |
|---|---|---|
| `id` | `uuid` | Primärschlüssel |
| `notification_id` | `uuid` | Verweis auf Notification |
| `delivery_id` | `uuid` | Optionaler Verweis auf Delivery |
| `actor_user_id` | `uuid` | Auslösender Benutzer |
| `event_type` | `text` | z. B. `created`, `published`, `queued`, `read`, `failed` |
| `channel` | `text` | Optionaler Kanal |
| `old_status` | `text` | Alter Status |
| `new_status` | `text` | Neuer Status |
| `comment` | `text` | Optionaler Kommentar |
| `details` | `jsonb` | Technische Details |
| `created_at` | `timestamptz` | Ereigniszeitpunkt |

Empfohlene Indizes:

- `(notification_id, created_at)`
- `(delivery_id, created_at)`
- `(actor_user_id, created_at)`
- `(event_type, created_at)`

### 4.5 `academy_notification_preferences`

Zweck: Benutzerpräferenzen pro Kanal, Kategorie und Sprache.

Vorgeschlagene Spalten:

| Spalte | Typ | Zweck |
|---|---|---|
| `id` | `uuid` | Primärschlüssel |
| `user_id` | `uuid` | Benutzer |
| `in_app_enabled` | `boolean` | In-App aktiv |
| `push_enabled` | `boolean` | Push aktiv |
| `email_enabled` | `boolean` | E-Mail aktiv |
| `whatsapp_enabled` | `boolean` | WhatsApp aktiv |
| `digest_frequency` | `text` | `instant`, `daily`, `weekly`, `never` |
| `language` | `text` | Bevorzugte Sprache |
| `timezone` | `text` | Zeitzone |
| `quiet_hours_start` | `time` | Ruhezeit Start |
| `quiet_hours_end` | `time` | Ruhezeit Ende |
| `category_preferences` | `jsonb` | Kategoriepräferenzen |
| `channel_preferences` | `jsonb` | Kanalpräferenzen |
| `created_at` | `timestamptz` | Erstellung |
| `updated_at` | `timestamptz` | Aktualisierung |

Empfohlene Indizes:

- eindeutiger Index auf `user_id`
- optional GIN-Index auf `category_preferences`, falls stark segmentiert wird

## 5. Notification-Typen

Mindestens vorzubereitende Typen:

| Typ | Kategorie | Zielgruppe |
|---|---|---|
| Modul freigeschaltet | Academy | Partner, wenn Modul laut Lernpfad relevant ist |
| Neues Modul verfügbar | Academy | Partner, die Voraussetzungen erfüllen |
| Quiz bestanden | Academy | betroffener Partner, optional Leader bei Teambezug |
| Zertifikat erhalten | Academy | betroffener Partner, optional Leader/Admin |
| Neue Aufgabe | Task | betroffener Partner oder Teammitglied |
| Aufgabe überfällig | Task | betroffener Partner, Leader bei Teamaufgaben |
| Leader-Nachricht | Leader | eigenes Team oder einzelner Partner |
| Team-Nachricht | Team | Teammitglieder |
| Admin-Mitteilung | Admin | ausgewählte Rollen, Teams oder globale Zielgruppe |
| Systemwartung | System | betroffene Rollen oder global |
| Produktneuheit | Growth | Partner mit Growth-Zugriff oder relevante Zielgruppe |
| Kampagne | Growth / Marketing | passende Zielgruppe nach Rolle, Sprache und Fortschritt |
| Live-Training | Kalender / Academy | passende Zielgruppe, Team oder Rolle |
| Termin-Erinnerung | Kalender | betroffene Teilnehmer |
| Community-News | Community | passende Community-Zielgruppe |
| Growth-Center-Update | Growth | Partner mit freigeschaltetem Growth Center |

## 6. Zielgruppenlogik

### 6.1 Grundregel

Standardmäßig darf keine Benachrichtigung an alle Partner gehen.

Jede Benachrichtigung benötigt eine explizite Zielgruppenlogik:

- direkter Benutzer
- Team
- Rolle
- Fortschrittssegment
- Modulbezug
- Sprache
- Status
- global nur mit bewusster Admin-Freigabe

### 6.2 Partner

Partner erhalten nur:

- Inhalte, die zu ihrem aktuellen Lernfortschritt passen
- eigene Aufgaben
- eigene Termine
- eigene Zertifikate
- relevante Academy-Updates
- relevante Growth-Center-Inhalte, falls Growth-Zugriff vorhanden ist
- Systemmeldungen, die sie wirklich betreffen

Besonders wichtig:

- Ein Modul-Update darf nur an Partner gesendet werden, die dieses Modul bereits gesehen, begonnen oder abgeschlossen haben.
- Neue Partner oder Partner, die ein späteres Modul noch nicht erreicht haben, erhalten keine Update-Meldung zu diesem Modul.
- Ein neues Modul wird nur angezeigt, wenn der Lernpfad, die Rolle und der Fortschritt des Partners dazu passen.
- Kampagnen und Produktneuheiten sollen nach Zielgruppe, Sprache, Fortschritt und gegebenenfalls Team segmentiert werden.

### 6.3 Leader

Leader erhalten:

- Teamereignisse ihres eigenen Teams
- neue Partner im eigenen Team
- Teamaufgaben
- Fortschrittsereignisse eigener Partner
- Hinweise auf Partner mit Unterstützungsbedarf
- Follow-up-Ereignisse
- relevante Leader-Mitteilungen

Leader dürfen keine globalen Partnerdaten und keine fremden Teamdaten erhalten.

### 6.4 Admin

Admins erhalten:

- globale Ereignisse
- Systemmeldungen
- Fehler und Zustellprobleme
- neue Registrierungen
- wartende Freigaben
- globale Academy- und Growth-Statistiken
- Zustell- und Auditinformationen

Admins dürfen globale Mitteilungen erstellen, jedoch nur mit klarer Zielgruppenauswahl und optionaler Bestätigung bei globalen Broadcasts.

### 6.5 Globale Academy-Updates

Globale Academy-Updates sind die Ausnahme und müssen ausdrücklich als global markiert werden.

Empfohlene Schutzmaßnahmen:

- `audience_scope = global`
- Admin-Rolle erforderlich
- klare Bestätigung im Admin-UI
- optional zweite Bestätigung bei kritischen Systemmeldungen
- Event-Log mit Ersteller, Zeitpunkt und Zielgruppe
- Kanalbegrenzung, z. B. zuerst nur In-App

## 7. Kanäle und spätere Integrationen

Die Notification Engine sollte kanalunabhängig geplant werden.

### 7.1 In-App

Empfohlener erster produktiver Kanal.

Vorteile:

- einfache Berechtigungsprüfung
- direkte Integration in Dashboard, Success Center und Growth Center
- kein externer Provider notwendig
- niedriges Risiko

### 7.2 Push

Später möglich für mobile Nutzung.

Offene Entscheidungen:

- Web Push oder native App?
- Opt-in-Prozess
- Geräteverwaltung
- Abmelde- und Datenschutzlogik

### 7.3 E-Mail

Später geeignet für:

- wichtige Admin-Mitteilungen
- Tages- oder Wochenzusammenfassungen
- Termin-Erinnerungen
- Zertifikatsinformationen

Wichtig:

- Opt-in und Opt-out berücksichtigen
- Bounce- und Fehlerhandling
- keine sensiblen Daten im E-Mail-Text

### 7.4 WhatsApp

Später geeignet für:

- Termin-Erinnerungen
- Follow-ups
- Leader-Kommunikation
- kurze Aktionshinweise

Wichtig:

- ausdrückliche Einwilligung
- Provider-Auswahl
- Template-Freigaben
- Audit und Abmeldeprozess

### 7.5 n8n

Kann später als Automationsschicht genutzt werden:

- Notification Events auswerten
- Folgeprozesse starten
- CRM aktualisieren
- WhatsApp- oder E-Mail-Flows triggern

### 7.6 CRM

CRM-Anbindung später für:

- Partnerstatus
- Follow-ups
- Leader-Aufgaben
- Kampagnen
- Supportbedarf

### 7.7 Leonid OS

Leonid OS kann später als übergeordnete Steuerungsebene dienen:

- Event-Routing
- Priorisierung
- Teamsteuerung
- Automationsregeln
- KI-Assistenz

### 7.8 KI-Agenten

KI-Agenten können später Benachrichtigungen vorbereiten, priorisieren oder erklären.

Wichtig:

- KI-Agenten dürfen keine Benachrichtigungen ohne Freigabe an globale Zielgruppen senden.
- Antworten müssen auf Academy-Inhalten und freigegebenen Daten basieren.
- Alle Aktionen müssen auditierbar bleiben.

## 8. RLS- und Security-Plan

### 8.1 Grundsätzliche Sicherheitsanforderungen

- Partner sehen nur eigene Benachrichtigungen.
- Leader sehen nur Teamereignisse ihres eigenen Teams.
- Admins sehen globale Daten.
- Zielgruppenfilter müssen serverseitig erfolgen.
- Der Client darf niemals ungefiltert globale Notification- oder Delivery-Daten laden.
- Service-Role-Zugriff darf nur serverseitig verwendet werden.
- Externe Kanal-Provider dürfen keine unnötigen personenbezogenen Daten erhalten.

### 8.2 Hinweis zum aktuellen Auth-Modell

Die spätere RLS-Implementierung hängt davon ab, wie Benutzeridentität, Partnerdatensatz und Auth-User stabil miteinander verbunden werden.

Falls weiterhin ein Custom-Session-Modell genutzt wird, darf RLS nicht naiv auf `auth.uid()` aufgebaut werden, ohne die echte Verbindung zwischen Auth-User und Partnerdatensatz zu klären.

Empfehlung:

1. Zuerst Rollen- und Teammodell sauber definieren.
2. Dann stabile User-ID-Beziehung festlegen.
3. Erst danach RLS-Policies produktiv schreiben.
4. Bis dahin Zugriff ausschließlich über serverseitige API-Routen mit expliziter Berechtigungsprüfung.

### 8.3 Policy-Plan pro Tabelle

#### `academy_notifications`

Partner:

- dürfen Meldungen nur sehen, wenn es einen passenden Delivery-Record für sie gibt.

Leader:

- dürfen Team-Meldungen sehen, wenn die Meldung ihrem Team zugeordnet ist.

Admin:

- darf alle Meldungen sehen und verwalten.

#### `academy_notification_delivery`

Partner:

- dürfen nur eigene Delivery-Records lesen und ihren eigenen Lesestatus ändern.

Leader:

- dürfen Team-Delivery-Status nur aggregiert sehen, nicht zwingend jede persönliche Zustellung im Detail.

Admin:

- darf Delivery-Records verwalten und Zustellfehler prüfen.

#### `academy_notification_templates`

Partner:

- kein Zugriff.

Leader:

- optional Leserechte auf freigegebene Teamvorlagen, falls später erlaubt.

Admin:

- volle Verwaltung.

#### `academy_notification_events`

Partner:

- kein direkter Zugriff.

Leader:

- optional eingeschränkte Teamansicht.

Admin:

- Audit-Zugriff.

#### `academy_notification_preferences`

Partner:

- darf eigene Präferenzen lesen und aktualisieren.

Leader:

- darf keine persönlichen Präferenzen anderer Partner ändern.

Admin:

- darf technische Prüfung durchführen, aber persönliche Kommunikationspräferenzen nur nach klarer Regel ändern.

### 8.4 Datenschutzrisiken

Besonders zu schützen:

- E-Mail-Adressen
- Telefonnummern
- WhatsApp-Opt-in
- Teamzugehörigkeit
- Lernfortschritt
- Zertifikate
- Aufgabenstatus
- Aktivitätsdaten

## 9. API-Plan

Keine Endpunkte werden in diesem Blueprint implementiert. Folgende Funktionen wären später sinnvoll:

### 9.1 `getNotifications`

Zweck:

- lädt Benachrichtigungen für den aktuellen Benutzer.

Regeln:

- Partner: nur eigene Delivery-Records.
- Leader: eigene Meldungen plus erlaubte Teamübersicht.
- Admin: globale Übersicht.
- Serverseitige Filterung zwingend.

### 9.2 `markAsRead`

Zweck:

- markiert eine einzelne Benachrichtigung als gelesen.

Regeln:

- Partner darf nur eigene Delivery aktualisieren.
- Leader darf nur eigene Meldungen markieren, nicht im Namen anderer Teammitglieder.
- Admin darf administrative Systemmeldungen markieren.

### 9.3 `markAllAsRead`

Zweck:

- markiert alle sichtbaren Meldungen des aktuellen Benutzers als gelesen.

Regeln:

- wirkt nur auf Delivery-Records des aktuellen Benutzers.
- keine globale Massenänderung.

### 9.4 `createNotification`

Zweck:

- erstellt eine neue Benachrichtigung oder nutzt ein Template.

Regeln:

- Admin für globale oder systemweite Meldungen.
- Leader nur für eigenes Team, falls später freigegeben.
- Systemereignisse nur serverseitig.
- Zielgruppenregel muss validiert werden.

### 9.5 `archiveNotification`

Zweck:

- archiviert Benachrichtigungen.

Regeln:

- Partner kann eigene Delivery archivieren.
- Admin kann globale Notifications archivieren.
- Archivieren darf keine Audit-Historie löschen.

### 9.6 `getNotificationPreferences`

Zweck:

- lädt Präferenzen des aktuellen Benutzers.

Regeln:

- keine fremden Präferenzen für Partner oder Leader.
- Admin nur mit klarer administrativer Berechtigung.

### 9.7 `updateNotificationPreferences`

Zweck:

- aktualisiert Kanal-, Kategorie- und Sprachpräferenzen.

Regeln:

- Partner darf eigene Präferenzen ändern.
- Systemkritische Meldungen können weiterhin In-App sichtbar bleiben.
- WhatsApp und E-Mail benötigen saubere Opt-in-Logik.

## 10. Event-System

Die Notification Engine sollte langfristig eventbasiert arbeiten.

### 10.1 Academy Events

Beispiele:

- Modul freigeschaltet
- Modul begonnen
- Modul abgeschlossen
- Lektion abgeschlossen
- Video angesehen
- PDF geöffnet
- Quiz bestanden
- Quiz nicht bestanden
- Zertifikat verfügbar
- Modul aktualisiert

Besondere Regel:

- Bei `module_updated` werden nur Partner benachrichtigt, die dieses Modul bereits gesehen, begonnen oder abgeschlossen haben.

### 10.2 Task Engine Events

Beispiele:

- Aufgabe erstellt
- Aufgabe zugewiesen
- Aufgabe heute fällig
- Aufgabe überfällig
- Aufgabe erledigt
- Follow-up erforderlich

Diese Events bilden die Grundlage für Success Center, Leader Follow-up und spätere n8n-Automationen.

### 10.3 Kalender Events

Beispiele:

- Termin gebucht
- Termin geändert
- Termin abgesagt
- Termin-Erinnerung
- Partner ohne Termin
- Leader-Termin offen

### 10.4 CMS Events

Beispiele:

- neuer Inhalt geplant
- Inhalt veröffentlicht
- Modul geändert
- PDF aktualisiert
- Video aktualisiert
- Quiz aktualisiert
- Kampagne veröffentlicht

### 10.5 Community Events

Beispiele:

- neue Community-News
- Antwort auf Frage
- Admin-Mitteilung
- Leader-Mitteilung
- Live-Training angekündigt

### 10.6 Growth Center Events

Beispiele:

- neuer Growth-Inhalt
- neue Kampagne
- neue Social-Media-Vorlage
- neues KI-Prompt-Paket
- Produktupdate
- Live-Training

Growth-Center-Events dürfen nur Partner erreichen, die für Growth Center freigeschaltet sind oder die definierte Zielgruppe erfüllen.

### 10.7 Leader Dashboard Events

Beispiele:

- neuer Partner im Team
- Partner ohne Modulstart
- Partner mit niedrigem Fortschritt
- Partner benötigt Unterstützung
- Teamaufgabe offen
- Follow-up überfällig

### 10.8 Admin Dashboard Events

Beispiele:

- neue Registrierung
- Freigabe ausstehend
- Zustellfehler
- Systemfehler
- ungewöhnlich viele inaktive Partner
- Content nicht veröffentlicht

### 10.9 CRM, n8n und Leonid OS Events

Später können externe Systeme Ereignisse liefern oder empfangen:

- CRM-Status geändert
- Follow-up im CRM erstellt
- n8n-Workflow gestartet
- WhatsApp-Versand ausgelöst
- Leonid OS Priorität berechnet
- KI-Agent schlägt nächste Aktion vor

Alle externen Events benötigen:

- Idempotency-Key
- Quelle
- Zeitstempel
- Audit-Event
- klare Berechtigungsprüfung

## 11. Automationsplan

Empfohlener späterer Ablauf:

1. Fachliches Ereignis entsteht, z. B. Modul abgeschlossen.
2. Event wird serverseitig validiert.
3. Audience Resolver berechnet Empfänger.
4. Notification wird erstellt.
5. Delivery-Records werden pro Empfänger und Kanal erzeugt.
6. In-App-Meldung ist sofort sichtbar.
7. Externe Kanäle werden optional über Queue, n8n oder Provider verarbeitet.
8. Zustellstatus wird aktualisiert.
9. Events dokumentieren jede Statusänderung.
10. Analytics können Öffnungs-, Lese- und Fehlerdaten auswerten.

Wichtige Schutzregeln:

- keine doppelte Zustellung durch Idempotency-Key
- keine Benachrichtigung ohne Zielgruppenprüfung
- keine externen Nachrichten ohne Präferenz- und Opt-in-Prüfung
- keine sensiblen Daten in Provider-Payloads, wenn nicht notwendig
- globale Broadcasts nur mit Admin-Bestätigung

## 12. Risiken

| Risiko | Beschreibung | Gegenmaßnahme |
|---|---|---|
| Falsche Zielgruppe | Partner erhalten Inhalte, die noch nicht relevant sind | Audience Resolver mit Progress- und Rollenprüfung |
| Zu viele Meldungen | Notification Fatigue | Prioritäten, Digest, Präferenzen |
| Leader sieht fremde Daten | Teamgrenzen unklar | serverseitige Teamprüfung und RLS |
| JSON-Systemspeicher skaliert nicht | aktuelle Struktur ist nicht für Enterprise-Delivery gedacht | normalisierte Tabellen |
| Doppelte Zustellung | Events werden mehrfach verarbeitet | Idempotency-Key und eindeutige Delivery-Indizes |
| Datenschutzverletzung | sensible Daten an falsche Kanäle | Minimaldaten, Opt-in, serverseitige Filterung |
| RLS falsch modelliert | Custom Auth passt nicht zu `auth.uid()` | Auth-/User-Modell vor RLS klären |
| Externe Provider fallen aus | E-Mail/WhatsApp nicht zugestellt | Delivery-Status, Retry, Fehler-Events |
| Globale Broadcasts versehentlich | Admin sendet an alle | Bestätigungsdialog und Audit |

## 13. Offene Entscheidungen

Vor produktiver Umsetzung müssen geklärt werden:

1. Wird langfristig Supabase Auth oder weiterhin Custom Auth verwendet?
2. Welche stabile User-ID verbindet Partner, Rollen und Auth?
3. Wie wird Teamzugehörigkeit produktiv modelliert?
4. Welche Rolle darf Teamnachrichten senden?
5. Welche Meldungen sind systemkritisch und nicht deaktivierbar?
6. Welche Sprachen sind zum Launch aktiv?
7. Welcher Provider wird für E-Mail genutzt?
8. Welcher Provider wird für WhatsApp genutzt?
9. Soll es Daily/Weekly Digest geben?
10. Wie lange werden Notification Events aufbewahrt?
11. Welche Daten dürfen an CRM, n8n und Leonid OS übergeben werden?
12. Welche Growth-Center-Zugriffslogik gilt nach Academy-Abschluss?

## 14. Empfohlene Implementierungsreihenfolge

### Phase 1 – Datenmodell und Rollenbasis

- finale Tabellen prüfen
- Team-/Leader-Modell klären
- User-ID-Verknüpfung klären
- RLS-Konzept finalisieren
- Migration separat freigeben

### Phase 2 – In-App Notification Engine

- nur In-App-Kanal produktiv aktivieren
- `getNotifications`, `markAsRead`, `markAllAsRead`
- Delivery-Records pro Empfänger
- Dashboard und Notification Center an echte Daten anbinden

### Phase 3 – Präferenzen

- `academy_notification_preferences`
- Sprache, Kategorien und Kanalpräferenzen
- Profilbereich an echte Präferenzen anbinden

### Phase 4 – Eventquellen

- Academy Progress
- Task Engine
- Kalender
- CMS
- Community
- Growth Center

### Phase 5 – Leader- und Admin-Workflows

- Team-Meldungen
- Admin-Broadcasts mit Bestätigung
- Audit-Events
- Zustellfehler-Ansicht

### Phase 6 – Externe Kanäle

- E-Mail
- WhatsApp
- Push
- n8n
- CRM
- Leonid OS
- KI-Agenten

### Phase 7 – Analytics und Optimierung

- Öffnungsrate
- Lesestatus
- Zustellfehler
- relevante Inhalte
- Notification Fatigue
- Segment-Performance

## 15. Bewusst nicht umgesetzt

In diesem Schritt wurden bewusst nicht umgesetzt:

- keine neuen Tabellen
- keine Migrationen
- keine Supabase-Änderungen
- keine RLS-Policies
- keine API-Endpunkte
- keine UI-Änderungen
- keine Auth-Änderungen
- keine Storage-Änderungen
- keine produktiven Schreibvorgänge
- keine Änderungen an Partnerdaten

## 16. Zusammenfassung

Die Harbor Global Partner Academy besitzt bereits ein vorbereitetes Notification Center und Academy-Update-UI. Für den produktiven Enterprise-Betrieb sollte diese Logik später in eine normalisierte Notification Engine überführt werden.

Die empfohlene Architektur trennt:

- fachliche Benachrichtigungen
- Vorlagen
- Zustellungen pro Empfänger
- Events/Audit
- Benutzerpräferenzen

Der wichtigste Architekturpunkt ist die Zielgruppenlogik: Partner dürfen nur Benachrichtigungen erhalten, die zu ihrem tatsächlichen Lernfortschritt, ihrer Rolle und ihrem aktuellen Academy-Status passen. Leader bleiben auf ihr Team begrenzt. Admins erhalten globale Steuerung und Auditfähigkeit.

Damit entsteht eine skalierbare Grundlage für In-App-Benachrichtigungen, WhatsApp, E-Mail, Push, n8n, CRM, Leonid OS und KI-Agenten, ohne die Academy durch irrelevante Meldungen zu überladen.
