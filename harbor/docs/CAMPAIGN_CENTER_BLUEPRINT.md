# Harbor Global Partner Academy – Campaign Center Blueprint

Stand: 2026-07-02  
Status: UI- und Architektur-Vorbereitung, keine produktive Implementierung

## 1. Zweck und Scope

Dieses Dokument beschreibt die zukünftige Campaign-Center-Architektur der Harbor Global Partner Academy.

Das Campaign Center soll später zeitlich begrenzte Aktionen wie Sommeraktion, Winteraktion, Black Friday, Produktaktionen, Sonderrabatte und interne Partneraktionen sauber abbilden.

In diesem Schritt wurde keine Datenbank geändert, keine Migration ausgeführt, keine API gebaut, keine Supabase-Struktur verändert, keine R2-/Storage-Struktur verändert, keine Authentifizierung angepasst und kein produktiver Schreibvorgang durchgeführt.

Aktueller Umsetzungsstand:

- UI-only Campaign Center
- UI-only Aktionsbanner
- UI-only Rollenansichten für Partner, Leader und Admin
- UI-only Vorbereitung für Kundenaktionen
- UI-only Vorbereitung für interne Partneraktionen
- UI-only Vorbereitung für levelabhängige Partneraktionspreise
- UI-only Vorbereitung für automatische Aktionspreis-Berechnung
- keine echten Produktivpreise
- keine echte Preisberechnung aus Datenbank
- keine echten Notifications

## 2. Aktueller Ist-Zustand

Die Academy besitzt bereits mehrere vorbereitete Bereiche, an die Kampagnen später anschließen können:

- Dashboard
- Success Center
- Growth Center
- Notification Center
- Academy CMS UI
- Download Center
- Admin UI
- Leader UI
- Task Engine Blueprint
- Notification Engine Blueprint
- CMS Backend Blueprint

Aktuell existiert noch keine produktive Kampagnentabelle und keine Kampagnen-API.

Produkt- und Preisinformationen liegen aktuell primär in:

- statischen UI-Konstanten
- geschützten PDF-Dokumenten
- Download-Katalog
- später geplantem CMS

Wichtig: Aktuelle Preislisten/PDFs sind nicht zuverlässig maschinenlesbar. Deshalb darf die UI keine echten Partneraktionspreise behaupten und keine Fantasiepreise hardcoden.

## 3. Zielarchitektur

Das spätere Campaign Center soll getrennt modellieren:

1. Kampagne
2. betroffene Produkte
3. Kundenrabatte
4. interne Partneraktionen
5. levelabhängige Partnerpreise
6. Kampagnenmaterialien
7. Zielgruppen
8. Notifications
9. Events/Audit
10. Automationen

Zielbild:

- Partner sehen nur relevante aktive Aktionen.
- Partner sehen nur die für ihr Partnerlevel freigegebenen Partnerpreise.
- Leader sehen Team- und Aktionshinweise, aber keine sensiblen Sonderpreise, wenn nicht freigegeben.
- Admin sieht vollständige Kampagnen-, Zielgruppen- und Preisübersicht.
- Benachrichtigungen werden nicht pauschal an alle Partner gesendet.
- Kampagnen können später mit Success Center, Growth Center, CMS, Task Engine und Notification Engine verbunden werden.

## 4. Geplante Tabellen

Keine der folgenden Tabellen wurde erstellt. Es handelt sich um einen späteren Migrationsplan.

### 4.1 `academy_campaigns`

Zweck: zentrale Kampagnenentität.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Kampagnen-ID |
| `name` | Kampagnenname |
| `slug` | stabile technische ID |
| `description` | Beschreibung |
| `status` | `draft`, `planned`, `active`, `ended`, `archived` |
| `valid_from` | Startdatum |
| `valid_until` | Enddatum |
| `campaign_type` | `seasonal`, `product`, `black_friday`, `customer`, `partner`, `mixed` |
| `primary_cta_label` | CTA-Text |
| `primary_cta_target` | Ziel im UI/CMS |
| `target_audience_rule` | Zielgruppenregel |
| `visibility_roles` | sichtbare Rollen |
| `notification_enabled` | Benachrichtigung vorbereitet/aktiv |
| `created_by` | Ersteller |
| `created_at` | Erstellung |
| `updated_at` | Aktualisierung |
| `published_at` | Veröffentlichung |
| `archived_at` | Archivierung |

### 4.2 `academy_campaign_products`

Zweck: Produkte einer Kampagne zuordnen.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Zuordnungs-ID |
| `campaign_id` | Kampagne |
| `product_id` | Produkt |
| `product_name_snapshot` | Name zum Veröffentlichungszeitpunkt |
| `sort_order` | Reihenfolge |
| `is_featured` | Hauptprodukt |
| `created_at` | Erstellung |

### 4.3 `academy_campaign_assets`

Zweck: Marketingmaterial und Downloads zu Kampagnen.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Asset-Zuordnung |
| `campaign_id` | Kampagne |
| `asset_id` | späterer CMS-/R2-Asset-Bezug |
| `asset_type` | `pdf`, `image`, `video`, `story`, `reel`, `whatsapp_template`, `script` |
| `title` | Titel |
| `language_code` | Sprache |
| `visibility_role` | Partner, Leader, Admin |
| `status` | Entwurf/geplant/veröffentlicht |
| `created_at` | Erstellung |

### 4.4 `academy_campaign_notifications`

Zweck: Notification-Vorbereitung und spätere Auslösung.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Notification-Zuordnung |
| `campaign_id` | Kampagne |
| `notification_type` | `started`, `ending_soon`, `ends_today`, `new_material`, `product_action` |
| `template_id` | Notification Template |
| `audience_rule` | Zielgruppenregel |
| `scheduled_for` | geplanter Versandzeitpunkt |
| `status` | `draft`, `scheduled`, `sent`, `cancelled` |
| `created_at` | Erstellung |

### 4.5 `academy_campaign_audience`

Zweck: Zielgruppen und Segmente.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Audience-ID |
| `campaign_id` | Kampagne |
| `audience_type` | `role`, `team`, `level`, `language`, `progress`, `manual_segment` |
| `role` | Partner/Leader/Admin |
| `partner_level` | optionales Level |
| `team_id` | optionales Team |
| `language_code` | Sprache |
| `progress_rule` | Lernpfad-/Fortschrittsregel |
| `is_active` | aktiv |
| `created_at` | Erstellung |

### 4.6 `academy_campaign_events`

Zweck: Audit und Automation.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Event-ID |
| `campaign_id` | Kampagne |
| `actor_user_id` | Auslöser |
| `event_type` | `created`, `planned`, `activated`, `updated`, `ended`, `archived`, `notification_prepared`, `asset_added` |
| `old_status` | vorheriger Status |
| `new_status` | neuer Status |
| `comment` | Audit-Kommentar |
| `metadata` | technische Details |
| `created_at` | Eventzeitpunkt |

### 4.7 `academy_product_prices`

Zweck: normale Partnerpreise pro Produkt und Partnerlevel.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Preis-ID |
| `product_id` | Produkt |
| `partner_level` | Starter, Level 1, Level 2, Level 3, Teamleiter, Leader, Admin/Sonderstatus |
| `normal_partner_price` | normaler Partnerpreis |
| `currency` | Währung, z. B. EUR |
| `valid_from` | gültig ab |
| `valid_until` | gültig bis |
| `source_document_id` | optionale Preislistenquelle |
| `is_active` | aktiv |
| `created_at` | Erstellung |
| `updated_at` | Aktualisierung |

### 4.8 `academy_campaign_partner_prices`

Zweck: Partneraktionspreis pro Kampagne, Produkt und Level.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Preisaktions-ID |
| `campaign_id` | Kampagne |
| `product_id` | Produkt |
| `partner_level` | Partnerlevel |
| `discount_type` | `fixed`, `percent`, `combined`, `override` |
| `discount_value` | Rabattwert |
| `calculated_campaign_price` | berechneter Aktionspreis |
| `savings_amount` | absolute Ersparnis |
| `savings_percent` | prozentuale Ersparnis |
| `valid_from` | gültig ab |
| `valid_until` | gültig bis |
| `visibility_role` | sichtbare Rolle |
| `is_active` | aktiv |
| `created_at` | Erstellung |
| `updated_at` | Aktualisierung |

### 4.9 `academy_campaign_customer_discounts`

Zweck: Kundenaktion pro Kampagne und Produkt.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Rabatt-ID |
| `campaign_id` | Kampagne |
| `product_id` | Produkt |
| `discount_type` | `fixed`, `percent`, `bundle`, `gift`, `custom` |
| `discount_value` | Rabattwert |
| `customer_message` | Verkaufsargument |
| `valid_from` | gültig ab |
| `valid_until` | gültig bis |
| `is_active` | aktiv |
| `created_at` | Erstellung |

### 4.10 `academy_campaign_level_prices`

Zweck: veröffentlichte Matrixansicht pro Level.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Matrix-ID |
| `campaign_id` | Kampagne |
| `product_id` | Produkt |
| `partner_level` | Partnerlevel |
| `normal_partner_price` | normaler Partnerpreis |
| `campaign_partner_price` | Aktionspreis |
| `savings_amount` | Ersparnis absolut |
| `savings_percent` | Ersparnis prozentual |
| `valid_from` | gültig ab |
| `valid_until` | gültig bis |
| `visibility_role` | Sichtbarkeit |
| `is_active` | aktiv |

### 4.11 `academy_commission_rules`

Zweck: wiederverwendbare Provisionsregeln aus offiziellen Harbor-/Aqua-Global-Unterlagen.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Regel-ID |
| `rule_name` | Name der Provisionsregel |
| `rule_type` | `base`, `differential`, `bonus`, `factor`, `custom` |
| `partner_level` | betroffenes Partnerlevel |
| `product_id` | optionales Produkt |
| `value_type` | `fixed`, `percent`, `factor`, `formula` |
| `value` | Regelwert |
| `source_document_id` | Quelle |
| `version` | Regelversion |
| `valid_from` | gültig ab |
| `valid_until` | gültig bis |
| `is_active` | aktiv |

### 4.12 `academy_campaign_commissions`

Zweck: kampagnenbezogene Provisionsanpassungen.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Kampagnen-Provisions-ID |
| `campaign_id` | Kampagne |
| `product_id` | Produkt |
| `partner_level` | Partnerlevel |
| `rule_type` | reduzierte Grundprovision, Bonus, Faktor oder Sonderregel |
| `adjustment_type` | `fixed`, `percent`, `override`, `factor` |
| `adjustment_value` | Anpassungswert |
| `valid_from` | gültig ab |
| `valid_until` | gültig bis |
| `is_active` | aktiv |

### 4.13 `academy_partner_levels`

Zweck: offizielle Partnerlevel und Reihenfolge.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Level-ID |
| `level_name` | Starter, Level 1, Level 2 usw. |
| `sort_order` | Reihenfolge |
| `description` | Beschreibung |
| `is_active` | aktiv |

### 4.14 `academy_product_commissions`

Zweck: normale Produktprovisionen pro Level.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Produkt-Provisions-ID |
| `product_id` | Produkt |
| `partner_level` | Partnerlevel |
| `base_commission` | Grundprovision |
| `differential_commission` | Differenzprovision |
| `bonus_commission` | Sonderbonus |
| `currency` | Währung |
| `valid_from` | gültig ab |
| `valid_until` | gültig bis |
| `source_document_id` | Quelle |
| `is_active` | aktiv |

### 4.15 `academy_product_points`

Zweck: normale Produktpunkte aus offiziellen Unterlagen.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Produktpunkte-ID |
| `product_id` | Produkt |
| `points_value` | normale Punktezahl |
| `source_document_id` | Quelle |
| `valid_from` | gültig ab |
| `valid_until` | gültig bis |
| `is_active` | aktiv |

### 4.16 `academy_level_thresholds`

Zweck: Levelgrenzen und Qualifikationsschwellen.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Schwellenwert-ID |
| `level_id` | Level |
| `level_name` | lesbarer Levelname |
| `required_points` | benötigte Punkte |
| `required_sales` | optionale Verkaufsanforderung |
| `required_team_volume` | optionales Teamvolumen |
| `valid_from` | gültig ab |
| `valid_until` | gültig bis |
| `is_active` | aktiv |

### 4.17 `academy_campaign_points`

Zweck: kampagnenbezogene Punkteanpassungen.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Kampagnenpunkte-ID |
| `campaign_id` | Kampagne |
| `product_id` | Produkt |
| `partner_level` | optionales Partnerlevel |
| `points_rule_type` | `override`, `multiplier`, `bonus`, `reduction` |
| `points_value` | Punktwert |
| `multiplier` | Multiplikator |
| `bonus_points` | Bonuspunkte |
| `valid_from` | gültig ab |
| `valid_until` | gültig bis |
| `is_active` | aktiv |

### 4.18 `academy_partner_level_progress`

Zweck: späterer Partner-Level-Fortschritt.

Vorgeschlagene Felder:

| Feld | Zweck |
|---|---|
| `id` | Fortschritts-ID |
| `partner_id` | Partner |
| `current_level` | aktuelles Level |
| `current_points` | aktueller Punktestand |
| `next_level` | nächstes Level |
| `points_to_next_level` | fehlende Punkte |
| `updated_at` | Aktualisierung |

## 5. Statusmodell

Empfohlene Kampagnenstatus:

- `draft` – Entwurf
- `planned` – geplant
- `active` – aktiv
- `ending_soon` – endet bald
- `ended` – beendet
- `archived` – archiviert

Partneransicht sollte standardmäßig nur `active` anzeigen.

Leader können zusätzlich geplante Teamhinweise sehen, falls freigegeben.

Admin sieht alle Status.

## 6. Preislogik

### 6.1 Grundregel

Der Aktions-Partnerpreis darf später nicht frei im Client erfunden werden.

Berechnung:

```text
normaler Partnerpreis pro Produkt und Level
minus Aktionsrabatt / Aktionsvorteil
= aktueller Aktions-Partnerpreis
```

### 6.2 Berechnungsarten

#### Fester Betrag

```text
Aktionspreis = Normalpreis - Rabattbetrag
```

#### Prozentualer Rabatt

```text
Aktionspreis = Normalpreis × (1 - RabattProzent / 100)
```

#### Kombinierte Aktion

```text
Aktionspreis = Normalpreis - Partnervorteil
Kundenaktion bleibt separat als Verkaufsargument sichtbar
```

#### Override / manueller Aktionspreis

Nur mit Admin-Freigabe und Audit.

### 6.3 Wenn keine Preisquelle vorhanden ist

Wenn echte Partnerpreise nicht maschinenlesbar vorhanden sind:

- keinen Aktionspreis anzeigen
- keine Fantasiepreise verwenden
- UI zeigt „Preisquelle offen“
- Admin erhält TODO: Preisquelle anbinden
- Dokumentation verweist auf Preislisten/CMS/Datenbank

### 6.4 Partner Earnings Engine

Das Campaign Center ist mit der Partner Earnings Engine verbunden. Die detaillierte Architektur ist in `docs/PARTNER_EARNINGS_ENGINE.md` dokumentiert.

Ziel:

- normale Provision berechnen
- Aktionsprovision berechnen
- Produktpunkte berechnen
- Kampagnenpunkte berücksichtigen
- Level-Fortschritt berechnen
- Partnerantworten strukturiert vorbereiten
- Leader-Teamübersichten vorbereiten
- Admin-Regelmatrix vorbereiten

Wichtig:

- keine Provisionen hardcoden
- keine Preise hardcoden
- keine Produktpunkte hardcoden
- keine Levelgrenzen hardcoden
- keine Berechnung ohne offizielle Quelle als korrekt darstellen

Spätere Berechnung:

```text
Produkt + Menge
→ Partnerlevel
→ normale Produkt-/Preis-/Provisionsregel
→ aktive Kampagnenregel
→ Produktpunkte und Levelgrenzen
→ sichere partnerbezogene Antwort
```

## 7. Rollenmodell

### Partner

Partner sehen später:

- aktive relevante Kampagnen
- Kundenaktion als Verkaufsargument
- eigenes betroffenes Produkt
- eigenen normalen Partnerpreis
- eigenen Aktions-Partnerpreis
- eigene Ersparnis
- Hinweis „Preis basiert auf deinem aktuellen Partnerlevel“

Partner dürfen nicht sehen:

- fremde Levelpreise
- Admin-Sonderpreise
- unveröffentlichte Aktionen
- interne Zielgruppenregeln

### Leader

Leader sehen später:

- Team-Hinweise
- Produkte, die für Teamaufbau attraktiv sind
- freigegebene Beispielpreise nach Level
- Teamaufgaben zur Aktion
- welche Aktion als Verkaufsargument genutzt werden soll

Leader dürfen nicht sehen:

- sensible Sonderpreise, falls nicht freigegeben
- globale Admin-Matrix, falls nicht freigegeben
- fremde Teamdaten

### Admin

Admin sieht:

- vollständige Preis-Matrix
- Kundenrabatte
- Partnerrabatte
- berechnete Aktionspreise
- Gültigkeitszeitraum
- Zielgruppen
- Notification-Vorbereitung
- Statusübersicht
- Audit-Events

## 8. Notification-Anbindung

Spätere Notification-Typen:

- `campaign_started`
- `campaign_ending_soon`
- `campaign_ends_today`
- `campaign_material_added`
- `campaign_product_action`
- `campaign_partner_deal_available`

Zielgruppenlogik:

- Partner erhalten nur relevante Aktionen.
- Partner erhalten nur Aktionen, die zu Rolle, Level, Sprache und Sichtbarkeit passen.
- Leader erhalten Team- und Aktionshinweise.
- Admin erhält globale Übersicht.
- Keine pauschalen Broadcasts ohne Admin-Freigabe.

## 9. Success-Center-Anbindung

Bei aktiver Kampagne soll das Success Center später Aufgaben ableiten können:

- „Nutze die aktuelle Aktion für Kundengespräche“
- „Teile die Aktion heute in deiner Story“
- „Kontaktiere 5 Kunden zur aktuellen Aktion“
- „Bereite ein Follow-up mit Aktionshinweis vor“

Aktuell ist das nur UI-only vorbereitet. Es wird keine Aufgabe gespeichert.

## 10. Growth-Center-Anbindung

Das Growth Center soll Kampagnenmaterial bündeln:

- Kampagnenmaterial
- Reels-Ideen
- Story-Vorlagen
- WhatsApp-Texte
- Gesprächsleitfäden
- Einwandbehandlung
- Produktargumente

Aktuell ist das nur UI-only vorbereitet.

## 11. CMS-Anbindung

Das CMS soll später Kampagnen verwalten:

- Kampagne erstellen
- Kampagne bearbeiten
- Kampagne prüfen
- Kampagne freigeben
- Kampagne planen
- Kampagne veröffentlichen
- Kampagne archivieren
- Rollback oder Reaktivierung

CMS-Veröffentlichungen können später Notification-, Task- und Growth-Events auslösen.

## 12. RLS- und Security-Plan

### Partner

- `select` nur aktive Kampagnen mit passender Zielgruppe.
- Preisabfrage nur für eigenes Partnerlevel.
- Keine Admin-Matrix.
- Keine Sonderstatuspreise, falls nicht freigegeben.

### Leader

- Teamübersicht nur für eigenes Team.
- Nur freigegebene Levelübersichten.
- Keine sensiblen individuellen Einkaufspreise fremder Level, falls nicht explizit freigegeben.

### Admin

- alle Kampagnen, Preise, Zielgruppen und Events.
- Mutationen nur über geschützte serverseitige Admin-Routen.
- Kritische Veröffentlichung oder globale Benachrichtigung mit Bestätigung.

### Nie ungefiltert in den Client

- vollständige interne Preislisten
- Sonderpreise
- Draft-Kampagnen
- Zielgruppenregeln mit personenbezogenen Daten
- Audit-Kommentare
- interne R2-/Storage-Keys

## 13. API-Plan

Keine API wurde implementiert. Spätere Endpunkte/Funktionen:

- `getActiveCampaigns`
- `getMyCampaignDeals`
- `getLeaderCampaignOverview`
- `getAdminCampaigns`
- `getCampaignPriceMatrix`
- `createCampaign`
- `updateCampaign`
- `publishCampaign`
- `archiveCampaign`
- `prepareCampaignNotification`
- `calculateCampaignPartnerPrice`

Alle Mutationen:

- serverseitige Sessionprüfung
- Rollenprüfung
- Idempotenz
- Audit-Event
- keine direkte Clientpreislogik als Wahrheitsquelle

## 14. Automationsplan

Spätere Integrationen:

- WhatsApp
- E-Mail
- n8n
- CRM
- Leonid OS
- KI-Agenten

Mögliche Automationen:

- Aktion startet → relevante Partner erhalten In-App-Hinweis
- Aktion läuft bald ab → Leader erhält Team-Follow-up
- neues Kampagnenmaterial → Growth Center Update
- Partner öffnet Kampagne → Success Center schlägt Aufgabe vor
- Aktion endet → Admin erhält Auswertungsaufgabe
- Preise geändert → CMS Review erforderlich

Alle Automationen brauchen:

- Zielgruppenprüfung
- Opt-in bei externen Kanälen
- Idempotency-Key
- Audit-Event
- klare Rollback-Strategie

## 15. Risiken

| Risiko | Beschreibung | Gegenmaßnahme |
|---|---|---|
| falsche Preise | Partner sieht falschen Aktionspreis | Preise nur aus freigegebenen Datenquellen berechnen |
| Fantasiepreise | UI zeigt erfundene Werte | bei fehlender Preisquelle „Preisquelle offen“ anzeigen |
| falsche Zielgruppe | Partner erhält irrelevante Aktion | serverseitige Audience Rules |
| Leader sieht Sonderpreise | Teamübersicht zu breit | Sichtbarkeit pro Rolle und Level |
| Notification Spam | zu viele Aktionsmeldungen | Segmentierung, Prioritäten, Ablaufregeln |
| rechtliche Risiken | Rabatt-/Produktclaims falsch | CMS Review und Freigabe |
| Preislisten-PDF nicht maschinenlesbar | Berechnung nicht möglich | Produktpreise normalisieren |
| Custom Auth/RLS | DB-seitige Rollen unklar | zunächst geschützte Server-Routen nutzen |

## 16. Empfohlene Implementierungsreihenfolge

### Phase 1 – UI und Blueprint

- Campaign Center UI
- Aktionsbanner
- Success-/Growth-Integration
- Admin/Leader/Partner UI
- Blueprint

### Phase 2 – Datenmodell finalisieren

- Produktmodell
- Partnerlevel
- Preisquellen
- Kampagnenstatus
- Zielgruppen

### Phase 3 – Read-only Backend

- aktive Kampagnen lesen
- eigene Partnerdeals lesen
- Admin-Matrix lesen
- noch keine Mutationen

### Phase 4 – Admin CMS Workflow

- Kampagnen erstellen/bearbeiten
- Review/Freigabe
- Preisquelle validieren
- Veröffentlichung planen

### Phase 5 – Preisberechnung

- Produktpreise normalisieren
- Rabattarten validieren
- Aktionspreise serverseitig berechnen
- Audit und Rollback

### Phase 6 – Notification und Task Engine

- Kampagnen-Events
- relevante Partner benachrichtigen
- Success-Center-Aufgaben erzeugen
- Leader-Follow-ups

### Phase 7 – Automationen

- n8n
- WhatsApp
- E-Mail
- CRM
- Leonid OS
- KI-Agenten

## 17. Bewusst nicht umgesetzt

In diesem Schritt wurde bewusst nicht umgesetzt:

- keine Datenbankänderungen
- keine Migrationen
- keine API-Endpunkte
- keine Supabase-Änderungen
- keine Auth-Änderungen
- keine R2-/Storage-Änderungen
- keine Infrastrukturänderungen
- keine produktiven Schreibvorgänge
- keine echten Notifications
- keine echten Preisberechnungen
- keine harten Produktivpreise
- keine Backoffice-Integration
- keine Partnerdatenänderungen

## 18. Zusammenfassung

Das Campaign Center ist als sichere UI- und Architekturgrundlage vorbereitet. Es verbindet später Kundenaktionen, interne Partneraktionen, levelabhängige Partnerpreise, Success Center, Growth Center, Notification Engine, CMS, Task Engine und Automationen.

Der wichtigste Schutz bleibt: Echte Preise dürfen nur aus freigegebenen Preisquellen berechnet werden. Bis diese maschinenlesbar vorhanden sind, zeigt die UI bewusst keine erfundenen Preise.
