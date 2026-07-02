# Harbor Global Partner Academy – Partner Earnings Engine Blueprint

Stand: 2026-07-02  
Status: UI-, Architektur- und Berechnungslogik-Vorbereitung, keine produktive Implementierung

## 1. Zweck

Die Partner Earnings Engine soll später automatisch beantworten können, welche Provision, welche Punkte und welcher Level-Fortschritt aus einem Produktverkauf entstehen.

Typische Partnerfragen:

- Was verdiene ich beim Mini Touch?
- Was verdiene ich als Starter?
- Was verdiene ich auf Level 1 oder Level 5?
- Wie hoch ist meine Differenzprovision?
- Wie viel verdiene ich während einer Black-Friday-, Sommer- oder Produktaktion?
- Wie viele Punkte bringt mir ein Verkauf?
- Erreiche ich damit mein nächstes Level?

In diesem Schritt wurde keine echte Preis-, Provisions- oder Punktequelle angebunden. Es wurden keine Provisionen, Preise, Punkte oder Levelgrenzen fest im Code hinterlegt.

## 2. Grundprinzip

Die Engine darf später ausschließlich auf offiziellen und freigegebenen Quellen basieren:

- Karriereplan
- Provisionsplan
- Partnerpreisliste
- Aktionsregeln
- Produktpunkte
- Levelgrenzen
- freigegebene CMS- oder Datenbankquellen

Wenn eine Quelle fehlt oder nicht maschinenlesbar ist, darf die Anwendung keine Fantasiewerte anzeigen. Stattdessen wird klar angezeigt, dass die Quelle offen ist.

## 3. Aktueller Ist-Zustand

Aktuell vorhanden:

- UI-only Campaign Center
- UI-only Partneraktionen und Kundenaktionen
- vorbereitete levelabhängige Preisansicht ohne echte Preise
- vorbereitete Success-/Growth-/Notification-Anbindung
- statische Academy-/Growth-/CMS-Blueprints

Aktuell nicht vorhanden:

- produktive Produktpreistabelle
- produktive Provisionsregeln
- produktive Produktpunkte
- produktive Levelgrenzen
- produktive Partner-Level-Historie
- produktive API zur Berechnung
- RLS-/Security-Policies für Earnings-Daten

## 4. Zielarchitektur

Die spätere Engine besteht aus fünf logischen Ebenen:

1. Produktdaten  
   Produkt, offizielle Produkt-ID, Preisquellen, Produktpunkte.

2. Partnerkontext  
   aktuelles Partnerlevel, aktueller Punktestand, Team-/Leader-Kontext, Sichtbarkeit.

3. Normalregeln  
   Grundprovision, Differenzprovision, Sonderboni, normale Produktpunkte.

4. Kampagnenregeln  
   Aktionspreise, reduzierte Provisionen, Bonus-/Reduktionspunkte, Gültigkeit, Zielgruppe.

5. Ergebnisdarstellung  
   partnerbezogene Antwort, Leader-Teamübersicht, Admin-Regelmatrix.

## 5. Berechnungsreihenfolge

### 5.1 Standardfall ohne Aktion

```text
Produkt bestimmen
→ Partnerlevel bestimmen
→ normalen Partnerpreis laden
→ normale Provisionsregel laden
→ Produktpunkte laden
→ aktuellen Partner-Punktestand laden
→ Levelschwelle laden
→ Ergebnis berechnen
```

Provision:

```text
Grundprovision
+ Differenzprovision
+ weitere Bestandteile laut Karriereplan
= Gesamtprovision
```

Punkte:

```text
Produktpunkte × Menge
= Gesamtpunkte
```

Level-Fortschritt:

```text
aktueller Punktestand + neue Punkte
= neuer Punktestand
```

Danach:

```text
Levelgrenze prüfen
→ nächstes Level erreicht oder fehlende Punkte anzeigen
```

### 5.2 Aktionsfall

Wenn eine Kampagne aktiv ist, wird zusätzlich geprüft:

```text
aktive Kampagne
→ Produkt in Kampagne enthalten?
→ Partnerlevel in Zielgruppe?
→ Provisionssonderregel aktiv?
→ Punktesonderregel aktiv?
→ Preisaktionsregel aktiv?
```

Mögliche Aktionsregeln:

- reduzierte Grundprovision
- reduzierter Bonus
- anderer Provisionsfaktor
- fixer Abzug
- prozentuale Anpassung
- Sonderregel pro Produkt
- Sonderregel pro Partnerlevel
- normale Punkte
- doppelte Punkte
- Zusatzpunkte
- reduzierte Punkte

### 5.3 Priorität von Kampagnen

Wenn mehrere Kampagnen theoretisch passen, braucht die spätere Engine eine klare Priorität:

1. explizit produktbezogene Sonderaktion
2. explizit partnerlevelbezogene Sonderaktion
3. globale aktive Academy-/Produktkampagne
4. Standardregel aus Provisionsplan

Empfehlung:

- Kampagnen erhalten ein Feld `priority`.
- Überschneidungen müssen im Adminbereich sichtbar als Konflikt markiert werden.
- Zwei aktive Kampagnen dürfen dieselbe Produkt-/Level-Regel nur überschreiben, wenn Admin dies bewusst freigibt.

## 6. Normalprovision

Eine normale Provisionsregel sollte später mindestens enthalten:

- Produkt
- Partnerlevel
- Grundprovision
- Differenzprovision
- Sonderboni
- Provisionsfaktor
- Gültigkeit
- Quelle
- Version
- Freigabestatus

Wichtig:

- Die Berechnung muss serverseitig oder über vertrauenswürdige API erfolgen.
- Der Client darf nicht die Wahrheitsquelle für Provisionen sein.
- Jede Regel braucht eine Quelle und eine Version.

## 7. Aktionsprovision

Aktionsprovisionen dürfen normale Provisionen temporär verändern.

Beispiele für Regeltypen:

- `override_base_commission`
- `reduce_base_commission_fixed`
- `reduce_base_commission_percent`
- `add_bonus_fixed`
- `remove_bonus`
- `commission_factor`
- `custom_campaign_rule`

Berechnung:

```text
normale Provisionsregel
→ aktive Kampagnenregel anwenden
→ Ergebnis validieren
→ sichtbares Partnerergebnis ausgeben
```

Auch hier gilt: keine Werte im Code hardcoden.

## 8. Punkte- und Level-Fortschritt

Die Punkte-Engine berechnet:

- Punkte pro Produkt
- Menge
- Gesamtpunkte
- aktueller Punktestand
- neuer Punktestand nach Verkauf
- nächstes Level
- fehlende Punkte bis nächstes Level
- Hinweis, ob ein Levelwechsel erreicht wird

Kampagnen können Punkte beeinflussen:

- normale Produktpunkte
- doppelte Punkte
- Bonuspunkte
- reduzierte Punkte
- Sonderregel pro Produkt
- Sonderregel pro Partnerlevel

Empfehlung:

- Produktpunkte versionieren.
- Levelgrenzen versionieren.
- Kampagnenpunkte separat von normalen Produktpunkten speichern.
- Aktionspunkte nur im gültigen Zeitraum berücksichtigen.

## 9. Kombinierte Antwortlogik

Bei einer Partnerfrage wie:

```text
Was bekomme ich bei 5 Mini Touch auf Level 1?
```

soll die spätere Antwort strukturiert werden:

1. Produkt
2. Menge
3. Partnerlevel
4. normaler Partnerpreis
5. Aktionspreis, falls aktiv
6. Provision pro Gerät
7. Gesamtprovision
8. Punkte pro Gerät
9. Gesamtpunkte
10. aktueller Level-Fortschritt
11. fehlende Punkte bis zum nächsten Level
12. Empfehlung

Wenn Daten fehlen:

- keine Schätzung
- keine Fantasiewerte
- klarer Quellenhinweis

## 10. Geplante Tabellen

Keine der folgenden Tabellen wurde erstellt. Es handelt sich um einen späteren Migrationsplan.

### 10.1 `academy_commission_rules`

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
| `created_by` | Ersteller |
| `created_at` | Erstellung |
| `updated_at` | Aktualisierung |

### 10.2 `academy_campaign_commissions`

| Feld | Zweck |
|---|---|
| `id` | Kampagnen-Provisions-ID |
| `campaign_id` | Kampagne |
| `product_id` | Produkt |
| `partner_level` | Partnerlevel |
| `rule_type` | z. B. reduzierte Grundprovision, Bonus, Faktor |
| `adjustment_type` | `fixed`, `percent`, `override`, `factor` |
| `adjustment_value` | Anpassungswert |
| `valid_from` | gültig ab |
| `valid_until` | gültig bis |
| `is_active` | aktiv |

### 10.3 `academy_partner_levels`

| Feld | Zweck |
|---|---|
| `id` | Level-ID |
| `level_name` | Starter, Level 1, Level 2 usw. |
| `sort_order` | Reihenfolge |
| `description` | Beschreibung |
| `is_active` | aktiv |
| `created_at` | Erstellung |
| `updated_at` | Aktualisierung |

### 10.4 `academy_product_commissions`

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

### 10.5 `academy_campaign_rules`

| Feld | Zweck |
|---|---|
| `id` | Regel-ID |
| `campaign_id` | Kampagne |
| `rule_scope` | `price`, `commission`, `points`, `audience`, `notification` |
| `rule_type` | technische Regelart |
| `rule_payload` | JSON-Regeldefinition |
| `priority` | Auswertungspriorität |
| `valid_from` | gültig ab |
| `valid_until` | gültig bis |
| `is_active` | aktiv |

### 10.6 `academy_product_points`

| Feld | Zweck |
|---|---|
| `id` | Produktpunkte-ID |
| `product_id` | Produkt |
| `points_value` | normale Punktezahl |
| `source_document_id` | Quelle |
| `valid_from` | gültig ab |
| `valid_until` | gültig bis |
| `is_active` | aktiv |

### 10.7 `academy_level_thresholds`

| Feld | Zweck |
|---|---|
| `id` | Schwellenwert-ID |
| `level_id` | Level |
| `level_name` | lesbarer Levelname |
| `required_points` | benötigte Punkte |
| `required_sales` | optional benötigte Verkäufe |
| `required_team_volume` | optionales Teamvolumen |
| `valid_from` | gültig ab |
| `valid_until` | gültig bis |
| `is_active` | aktiv |

### 10.8 `academy_campaign_points`

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

### 10.9 `academy_partner_level_progress`

| Feld | Zweck |
|---|---|
| `id` | Fortschritts-ID |
| `partner_id` | Partner |
| `current_level` | aktuelles Level |
| `current_points` | aktueller Punktestand |
| `next_level` | nächstes Level |
| `points_to_next_level` | fehlende Punkte |
| `updated_at` | Aktualisierung |

## 11. API-Plan

Keine API wurde implementiert. Spätere Endpunkte/Funktionen:

- `getMyEarningsPreview`
- `calculateProductEarnings`
- `calculateCampaignEarnings`
- `calculateProductPoints`
- `calculateLevelProgress`
- `getLeaderEarningsOverview`
- `getAdminCommissionRules`
- `createCommissionRule`
- `updateCommissionRule`
- `publishCommissionRule`
- `archiveCommissionRule`
- `simulateCampaignEarnings`

Alle produktiven Berechnungen sollten serverseitig erfolgen.

## 12. CMS-Plan

Der Admin-/CMS-Bereich sollte später pflegen:

- Produkte
- Produktpreise
- Produktpunkte
- Provisionsregeln
- Differenzprovisionen
- Partnerlevel
- Levelgrenzen
- Kampagnenregeln
- Gültigkeitszeiträume
- Quellen und Versionen
- Review-/Freigabestatus

Wichtig:

- Preis- und Provisionsänderungen brauchen Review.
- Veröffentlichungen brauchen Audit.
- Alte Versionen dürfen nicht sofort gelöscht werden.
- Historische Berechnungen müssen nachvollziehbar bleiben.

## 13. Rollenmodell

### Partner

Partner darf sehen:

- eigene Berechnung
- eigenes Partnerlevel
- eigene Punkte
- eigene Level-Fortschrittsanzeige
- eigene kampagnenrelevante Aktion

Partner darf nicht sehen:

- fremde Levelpreise
- fremde Provisionen
- Admin-Sonderregeln
- vollständige Preis-/Provisionsmatrix

### Leader

Leader darf später sehen:

- Teamübersicht
- Partner kurz vor Levelwechsel
- Partner mit hohem Potenzial
- teamrelevante Kampagnen
- freigegebene Beispielübersichten

Leader darf nicht sehen:

- sensible Sonderpreise, wenn nicht freigegeben
- globale Admin-Regeln
- fremde Teams

### Admin

Admin darf sehen:

- alle Regeln
- alle Level
- alle Produkte
- alle Kampagnen
- Matrixansichten
- Simulationen
- Audit-/Versionierungsdaten

## 14. Sicherheitsmodell

Grundregeln:

- Partnerdaten nie ungefiltert an den Client ausliefern.
- Berechnungen nicht als vertrauenswürdige Clientlogik behandeln.
- Partner sieht nur eigene Ergebnisse.
- Leader sieht nur eigenes Team.
- Adminmutationen nur über geschützte Serverrouten.
- Regeländerungen auditieren.
- Veraltete Regeln versionieren statt löschen.

Empfohlene RLS-Logik:

- `select` für Partner nur auf eigene berechnete Snapshots oder serverseitig gefilterte Funktionen.
- `select` für Leader nur auf Team-Scope.
- `select`/`insert`/`update` für Admin nur über serverseitige Adminprüfung.
- keine vollständige Regelmatrix an Partner ausliefern.

## 15. Spätere KI-Integration

Die KI Academy Coach Integration darf später nur auf freigegebenen Academy-/CMS-/Regeldaten antworten.

Erlaubte KI-Funktionen:

- Partnerfrage interpretieren
- Produkt und Menge erkennen
- Partnerlevel berücksichtigen
- passende Berechnung auslösen
- Ergebnis verständlich erklären
- nächste Handlung empfehlen

Nicht erlaubt:

- freie Provisionen erfinden
- Preise aus unklaren Quellen schätzen
- interne Adminregeln ohne Berechtigung anzeigen
- Berechnung ohne Quellenstatus als sicher darstellen

## 16. Benachrichtigungen und Automationen

Spätere Events:

- neue Kampagnenregel veröffentlicht
- Produktpunkte geändert
- Partner erreicht nächstes Level
- Partner kurz vor Levelwechsel
- Aktionsprovision startet
- Aktionsprovision endet bald
- Punkteaktion startet
- Admin-Regel braucht Review

Mögliche Integrationen:

- Notification Engine
- Task Engine
- Campaign Center
- Success Center
- Growth Center
- WhatsApp
- E-Mail
- n8n
- CRM
- Leonid OS
- KI-Agenten

## 17. Risiken

| Risiko | Beschreibung | Gegenmaßnahme |
|---|---|---|
| falsche Provision | Partner sieht falschen Verdienst | Berechnung nur aus versionierten offiziellen Regeln |
| falsche Punkte | Level-Fortschritt wird falsch angezeigt | Produktpunkte und Levelgrenzen versionieren |
| Kampagnenkonflikt | zwei Aktionen überschreiben dieselbe Regel | Prioritätsmodell und Admin-Konfliktwarnung |
| Datenleck | Partner sieht fremde Level-/Provisionswerte | serverseitige Filterung und RLS |
| PDF nicht maschinenlesbar | Berechnung nicht möglich | strukturierte CMS-/DB-Regeln einführen |
| historische Nachvollziehbarkeit fehlt | alte Regeln nicht rekonstruierbar | Versionierung und Audit |

## 18. Empfohlene Implementierungsreihenfolge

1. Offizielle Quellen strukturieren und versionieren.
2. Produktmodell und Partnerlevel finalisieren.
3. Produktpreise und Produktpunkte normalisieren.
4. Provisionsregeln als read-only Backend verfügbar machen.
5. Kampagnenregeln read-only anbinden.
6. serverseitige Berechnungsfunktion erstellen.
7. Partneransicht mit echten eigenen Werten aktivieren.
8. Leader-Teamübersichten aktivieren.
9. Admin-CMS mit Review, Audit und Rollback ergänzen.
10. Notification-/Task-/KI-Integration aktivieren.

## 19. Bewusst nicht umgesetzt

- keine Datenbankänderungen
- keine Migrationen
- keine Supabase-Änderungen
- keine API-Endpunkte
- keine Auth-Änderungen
- keine R2-/Storage-Änderungen
- keine Infrastrukturänderungen
- keine produktiven Schreibvorgänge
- keine echten Preise
- keine echten Provisionen
- keine echten Punkte
- keine echten Levelgrenzen
- keine produktive KI-Integration

## 20. Zusammenfassung

Die Partner Earnings Engine ist als sichere, modulare Grundlage vorbereitet. Sie kann später automatisch Preise, Provisionen, Aktionsregeln, Punkte und Level-Fortschritt kombinieren, ohne dass Partner selbst rechnen müssen.

Der wichtigste Schutz bleibt: Ohne offizielle, freigegebene und maschinenlesbare Quelle wird kein Betrag und kein Punktwert behauptet.
