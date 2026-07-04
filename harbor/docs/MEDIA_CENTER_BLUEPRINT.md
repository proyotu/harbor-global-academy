# Harbor Global Partner Academy – Media Center Blueprint

Stand: 2026-07-03  
Status: UI- und Architektur-Vorbereitung, keine produktive Implementierung

## 1. Zweck des Media Centers

Das Media Center bündelt Marketingmaterialien der Harbor Global Partner Academy als strukturierte Übersicht.

Ziel:

- Partner finden schnell passende Materialien.
- Die Academy bleibt technisch schlank und schnell.
- Große Medienmengen werden nicht direkt in der Academy gespeichert.
- Externe Materialbibliotheken können später sauber angebunden werden.

Aktueller UI-Stand:

- neue Dashboard-Navigation `Media Center`
- Kategorien für Produktbilder, Produktvideos, Reels, Stories, WhatsApp Status, Logos, Flyer, Recruiting und Kampagnen
- Suchfunktion
- Kategorie-Filter
- mobile Kartenansicht
- Admin-Konfiguration als UI-only
- Campaign-Center-Anbindung
- Growth-Center-Anbindung

Keine Dateien wurden hochgeladen, verschoben oder gespeichert.

## 2. Empfehlung: Telegram als Medienbibliothek

### Telegram-Kanal

Empfohlen für:

- kuratierte offizielle Materialien
- nur Admin/Content-Team veröffentlicht
- klare Struktur je Kategorie oder Kampagne
- schnelle mobile Nutzung

### Telegram-Gruppe

Empfohlen für:

- Austausch
- Feedback
- Materialfragen
- Community-Impulse

Empfehlung:

- Kanal für offizielle Bibliothek
- Gruppe für Austausch
- Academy verlinkt nur strukturierte Kategorien und Kampagnen

Aktueller Platzhalter:

```text
https://t.me/+ZIERjys5o05iODIy
```

Dieser Link ist als konfigurierbarer Blueprint-Platzhalter dokumentiert. Es wurde keine Telegram-API eingebaut und keine harte technische Abhängigkeit erstellt.

## 3. Media-Center-Kategorien

Vorbereitete Kategorien:

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

Jede Kategorie unterstützt später:

- Titel
- Beschreibung
- Icon
- Status: Neu, Aktualisiert, Beliebt, Geplant
- Anzahl Dateien
- letztes Update
- externer Materiallink
- aktive/inaktive Sichtbarkeit
- Rollenfreigabe
- Hinweistext

## 4. Spätere Datenstruktur

Keine Tabellen wurden erstellt. Folgende Tabellen sind ein späterer Migrationsplan.

### 4.1 `academy_media_categories`

| Feld | Zweck |
|---|---|
| `id` | Kategorie-ID |
| `slug` | stabile technische Kennung |
| `title` | Anzeigename |
| `description` | Beschreibung |
| `icon_key` | Icon-Referenz |
| `sort_order` | Reihenfolge |
| `status` | `new`, `updated`, `popular`, `planned`, `archived` |
| `is_active` | Sichtbarkeit |
| `created_at` | Erstellung |
| `updated_at` | Aktualisierung |

### 4.2 `academy_media_collections`

| Feld | Zweck |
|---|---|
| `id` | Collection-ID |
| `category_id` | Kategorie |
| `title` | Collection-Titel |
| `description` | Beschreibung |
| `provider` | `telegram`, `google_drive`, `r2`, `cms`, `external` |
| `visibility_role` | Partner, Leader, Admin |
| `file_count_label` | sichtbare Dateianzahl oder Platzhalter |
| `last_update_at` | letzter Stand |
| `is_active` | aktiv |
| `created_at` | Erstellung |
| `updated_at` | Aktualisierung |

### 4.3 `academy_media_links`

| Feld | Zweck |
|---|---|
| `id` | Link-ID |
| `collection_id` | Materialsammlung |
| `provider` | Telegram, Drive, R2, CMS |
| `external_url` | externer Link |
| `link_label` | Button-/Linktext |
| `language_code` | Sprache |
| `status` | Entwurf, aktiv, archiviert |
| `valid_from` | gültig ab |
| `valid_until` | gültig bis |
| `created_by` | Admin/CMS Editor |
| `created_at` | Erstellung |
| `updated_at` | Aktualisierung |

### 4.4 `academy_campaign_media_links`

| Feld | Zweck |
|---|---|
| `id` | Kampagnen-Media-ID |
| `campaign_id` | Kampagne |
| `media_collection_id` | Media Collection |
| `media_link_id` | konkreter Link |
| `campaign_phase` | geplant, aktiv, endet bald, archiviert |
| `visibility_role` | Partner, Leader, Admin |
| `is_featured` | prominent anzeigen |
| `created_at` | Erstellung |

## 5. Rollenmodell

### Partner

Partner sieht:

- freigegebene Materialien
- aktive Kampagnenmaterialien
- Produktbilder und Produktvideos
- Social-Media- und WhatsApp-Vorlagen

Partner sieht nicht:

- interne Admin-Konfiguration
- unveröffentlichte Links
- Draft-Kampagnen
- fremde Teammaterialien, falls teambezogen

### Leader

Leader sieht zusätzlich:

- teamrelevante Kampagnenhinweise
- empfohlene Materialien für Teamaktionen
- später Team- und Follow-up-Material

### Admin

Admin sieht:

- alle Kategorien
- Linkstatus
- aktive/inaktive Kategorien
- letzte Aktualisierung
- vorbereitete Linkpflege
- später CMS-/Auditinformationen

## 6. Security-Plan

Grundregeln:

- Keine sensiblen Partnerdaten in externe Links einbetten.
- Keine Session-Tokens in Telegram-URLs.
- Externe Links nur als HTTPS-URLs.
- Admin-Linkpflege später nur über geschützte Serverrouten.
- Partner sieht nur freigegebene Kategorien.
- Leader sieht nur freigegebene Team-/Leader-Bereiche.
- Admin sieht globale Übersicht.

Wichtig:

Telegram ersetzt keine Zugriffskontrolle für hochsensible Inhalte. Für vertrauliche Dokumente oder Videos bleibt eine geschützte Academy-/R2-Auslieferung geeigneter.

## 7. Spätere Telegram-/Google-Drive-/R2-Optionen

### Telegram

Vorteile:

- mobil sehr schnell nutzbar
- große Materialmengen unkompliziert
- gut für Partneralltag

Risiken:

- Zugriff hängt von Telegram-Einladung ab
- weniger fein steuerbare Academy-Rollen
- Linkweitergabe muss organisatorisch kontrolliert werden

### Google Drive

Vorteile:

- gute Ordnerstruktur
- Versionierung möglich
- bekannte Freigabeprozesse

Risiken:

- Rechtepflege kann komplex werden
- Drive-Links können unübersichtlich werden

### R2 / geschützte Academy-Auslieferung

Vorteile:

- stärkste Kontrolle
- Academy-Rollen können serverseitig geprüft werden
- auditierbare Downloads möglich

Risiken:

- höhere technische Komplexität
- mehr Speicher-/Streaming-/Downloadlogik

Empfehlung:

- öffentliche Marketingmaterialien über Telegram/Drive vorbereiten
- sensible Academy-Inhalte weiter geschützt über R2/API ausliefern

## 8. Campaign-Center-Anbindung

Das Campaign Center erhält einen vorbereiteten Button:

```text
Aktionsmaterial öffnen
```

Ziel:

- passende Kampagnenmaterialsammlung öffnen
- Sommeraktion, Black Friday, Winteraktion und Produktaktionen verknüpfen
- später kampagnenspezifische Links über `academy_campaign_media_links` ausliefern

Aktuell:

- UI-only
- zentraler Telegram-Platzhalter
- keine Speicherung
- keine Campaign-API

## 9. Growth-Center-Anbindung

Das Growth Center erhält den Bereich:

```text
Marketingmaterial & Vorlagen
```

Vorbereitet für:

- Reels
- Story-Vorlagen
- WhatsApp-Texte
- Produktbilder
- Kampagnenmaterial

Ziel:

- Growth Center bleibt Business-/Strategie-Bereich
- Media Center wird operative Materialbibliothek

## 10. Admin-CMS-Anbindung

Späterer Admin-/CMS-Workflow:

1. Kategorie erstellen oder bearbeiten
2. externen Link hinterlegen
3. Status setzen
4. Rollenfreigabe setzen
5. letztes Update dokumentieren
6. Kampagne verknüpfen
7. Veröffentlichung freigeben

Aktuell:

- nur UI vorbereitet
- keine Speicherung
- keine Mutation
- keine neue API

## 11. Risiken

| Risiko | Beschreibung | Gegenmaßnahme |
|---|---|---|
| Linkweitergabe | Telegram-Link wird außerhalb der Academy geteilt | nicht für sensible Inhalte nutzen |
| veraltetes Material | Partner nutzt altes Marketingmaterial | Status und letztes Update pflegen |
| fehlende Rollenprüfung | Externe Plattform kennt Academy-Rollen nicht | sensible Inhalte intern geschützt ausliefern |
| Materialchaos | Telegram-Gruppe wird unübersichtlich | Kanal für Bibliothek, Gruppe für Austausch trennen |
| falsche Claims | Marketingmaterial enthält falsche Aussagen | CMS-Review und Freigabeprozess |

## 12. Empfohlene Implementierungsreihenfolge

1. Media Center UI und Blueprint vorbereiten.
2. Offizielle Telegram-Kanal-/Gruppenstruktur festlegen.
3. Kategorien final benennen.
4. Admin-CMS-Datenmodell freigeben.
5. Read-only Linkauslieferung serverseitig vorbereiten.
6. Rollenfreigaben anbinden.
7. Campaign-Links produktiv verknüpfen.
8. Growth Center und Success Center stärker mit Materialien verbinden.
9. Audit, Versionierung und Benachrichtigungen ergänzen.

## 13. Bewusst nicht umgesetzt

- keine Login-Änderungen
- keine Registrierungsänderungen
- keine Auth-Änderungen
- keine API-Änderungen
- keine Datenbankänderungen
- keine Supabase-Änderungen
- keine R2-/Storage-Änderungen
- keine Infrastrukturänderungen
- keine Telegram-API
- keine Google-Drive-Integration
- keine Uploads
- keine produktiven Schreibvorgänge
- keine Partnerdatenänderungen

## 14. Zusammenfassung

Das Media Center ist als schlanke Marketingmaterial-Zentrale vorbereitet. Die Academy bleibt schnell und übersichtlich, während große Materialsammlungen später extern über Telegram, Google Drive oder bei Bedarf geschützt über R2 bereitgestellt werden können.
