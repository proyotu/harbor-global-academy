# Harbor Global Partner Academy – Video Content Production Plan

Stand: 2026-07-01  
Status: Content- und Produktionsplanung, keine produktive Umsetzung

## 1. Zweck und Scope

Dieses Dokument bereitet den kommenden Austausch und die spätere Produktion der Academy-Videos vor.

Es ist ausschließlich Dokumentation und Content-Planung. In diesem Schritt wurden keine Videos hochgeladen, keine R2-Objekte verändert, keine Datenbank geändert, keine API geändert, keine Authentifizierung geändert und keine produktiven Schreibvorgänge durchgeführt.

Ziele:

- aktuelles Modul-/Lektions-/Video-Inventar dokumentieren
- einheitliches Dateinamen-Schema definieren
- R2-Upload und Qualitätsprüfung vorbereiten
- sichere spätere Austauschstrategie festlegen
- bestehende Videos bis zur geprüften Umstellung erhalten

## 2. Aktueller Content-Stand

Die Academy-Inhalte sind aktuell statisch im Projekt definiert.

Relevante Quellen:

- `app/lib/academy-content.js` – Modul- und Lektionskatalog
- `app/page.jsx` – aktuelle Videometadaten für die Partneroberfläche
- `app/api/academy-videos/route.js` – geschützte Videoauslieferung
- `academy-videos/private/` – private MP4-Dateien
- `docs/CMS_BACKEND_BLUEPRINT.md` – zukünftige CMS-Zielarchitektur

Aktueller Bestand:

| Bereich | Anzahl |
|---|---:|
| Academy-Module | 11 |
| Lektionen | 38 |
| echte Video-Zuordnungen | 14 |
| Video-Platzhalter | 2 |
| private MP4-Dateien | 14 |
| aktive Content-Sprachen | DE, EN, RU, RO |

Wichtig: Die Videos werden nicht mehr über öffentliche `/public`-URLs ausgeliefert, sondern über den geschützten Academy-Video-Endpunkt. Die privaten Dateien liegen aktuell unter `academy-videos/private/`.

## 3. Aktuelle Module und Lektionen

### Modul 1 – Willkommen / Startcenter

Kategorie: Onboarding

| Reihenfolge | Lektion | Typ | Resource-ID | Status |
|---:|---|---|---|---|
| 1 | Dein Academy-Start | Content | – | aktiv |
| 2 | Willkommensvideo | Video-Platzhalter | `academy-welcome-placeholder` | Platzhalter |

### Modul 2 – Aqua Global Grundlagen

Kategorie: Grundlagen

| Reihenfolge | Lektion | Typ | Resource-ID | Status |
|---:|---|---|---|---|
| 1 | Lernziele und Wasserwissen | Content | – | aktiv |
| 2 | Wasser ist Leben | Video | `wasser-ist-leben` | aktiv |
| 3 | Allgemeine Ernährungsweise | Video | `allgemeine-ernaehrungsweise` | aktiv |
| 4 | Funktionen von Wasser im Körper | Video | `funktionen-wasser-koerper` | aktiv |
| 5 | Mineralien | Video | `mineralien` | aktiv |
| 6 | Grenzwerte | Video | `grenzwerte` | aktiv |
| 7 | Produktkatalog „Your World“ | PDF | `your-world` | aktiv |
| 8 | Präsentation Wasser | PDF | `wasser-praesentation` | aktiv |

### Modul 3 – Produkte

Kategorie: Produktwissen

| Reihenfolge | Lektion | Typ | Resource-ID | Status |
|---:|---|---|---|---|
| 1 | Produktübersicht | Content | – | aktiv |
| 2 | Umkehrosmose Erklärung | Video | `umkehrosmose-erklaerung` | aktiv |
| 3 | Produktkatalog | PDF | `your-world` | aktiv |
| 4 | Kundenpreisliste | PDF | `kunden-preisliste` | aktiv |

### Modul 4 – Karriereplan

Kategorie: Karriere

| Reihenfolge | Lektion | Typ | Resource-ID | Status |
|---:|---|---|---|---|
| 1 | Level und Punkte verstehen | Content | – | aktiv |
| 2 | Karriere- und Verdienstplan | PDF | `karriere-verdienstplan` | aktiv |

### Modul 5 – Preise & Provisionen

Kategorie: Preise

| Reihenfolge | Lektion | Typ | Resource-ID | Status |
|---:|---|---|---|---|
| 1 | Preis- und Provisionsübersicht | Content | – | aktiv |
| 2 | Kundenpreise | PDF | `kunden-preisliste` | aktiv |
| 3 | Partnerpreise Wasserbar | PDF | `vp-wasserbar` | aktiv |
| 4 | Filter und Membranen | PDF | `vp-filter` | aktiv |
| 5 | Drops und Vitamine | PDF | `vp-drops-vitamine` | aktiv |
| 6 | Provision und Bonuspunkte | PDF | `karriere-verdienstplan` | aktiv |

### Modul 6 – Verkaufssystem

Kategorie: Verkauf

| Reihenfolge | Lektion | Typ | Resource-ID | Status |
|---:|---|---|---|---|
| 1 | Offizieller Bestellprozess | Content | – | aktiv |
| 2 | Kundenbestellung | Video | `kundenbestellung` | aktiv |

### Modul 7 – RXT Entkalkung

Kategorie: Technik

| Reihenfolge | Lektion | Typ | Resource-ID | Status |
|---:|---|---|---|---|
| 1 | RXT Grundlagen | Content | – | aktiv |
| 2 | RXT Schulungsvideo | Video-Platzhalter | `rxt-training-placeholder` | Platzhalter |
| 3 | RXT Präsentation | PDF | `rxt-praesentation` | aktiv |

### Modul 8 – Downloads

Kategorie: Download Center

| Reihenfolge | Lektion | Typ | Resource-ID | Status |
|---:|---|---|---|---|
| 1 | Download-Kategorien | Content | – | aktiv |

### Modul 9 – Partneraufbau

Kategorie: Teamaufbau

| Reihenfolge | Lektion | Typ | Resource-ID | Status |
|---:|---|---|---|---|
| 1 | Partneraufbau verstehen | Content | – | aktiv |
| 2 | Partnerregistrierung | Video | `partnerregistrierung` | aktiv |

### Modul 10 – Testlabor

Kategorie: Praxis

| Reihenfolge | Lektion | Typ | Resource-ID | Status |
|---:|---|---|---|---|
| 1 | Testlabor-Übersicht | Content | – | aktiv |
| 2 | PPM Bedeutung | Video | `ppm-bedeutung` | aktiv |
| 3 | Membranfilter vs. Filterkanne | Video | `membranfilter-vs-filterkanne` | aktiv |
| 4 | Tee-Test | Video | `tee-test` | aktiv |
| 5 | Basilikum-Test | Video | `basilikum-test` | aktiv |
| 6 | Farbtest | Video | `farbtest` | aktiv |
| 7 | Farbtest Erklärung | Video | `farbtest-erklaerung` | aktiv |

### Modul 11 – Zertifizierung / Quiz

Kategorie: Wissenscheck

| Reihenfolge | Lektion | Typ | Resource-ID | Status |
|---:|---|---|---|---|
| 1 | Academy Grundlagen-Quiz | Quiz | `academy-foundation` | lokal / read-only |

## 4. Aktuell vorhandene Videos

Diese 14 Videos sind aktuell als private MP4-Dateien vorhanden und über die geschützte Video-Route auslieferbar.

| Modul | Resource-ID | Aktuelle private Datei | Dauer laut UI | Produktionshinweis |
|---:|---|---|---|---|
| 2 | `wasser-ist-leben` | `wasser-ist-leben.mp4` | 00:01:24 | kanonischer Name vorhanden |
| 2 | `allgemeine-ernaehrungsweise` | `allgemeine-ernaehrungsweise.mp4` | 00:04:25 | kanonischer Name vorhanden |
| 2 | `funktionen-wasser-koerper` | `funktionen-von-wasser-im-koerper.mp4` | 00:04:32 | Resource-ID und Datei-Slug unterscheiden sich leicht |
| 2 | `mineralien` | `mineralien.mp4` | 00:04:02 | kanonischer Name vorhanden |
| 2 | `grenzwerte` | `grenzwerte.mp4` | 00:05:00 | kanonischer Name vorhanden |
| 3 | `umkehrosmose-erklaerung` | `umkehrosmose-erklaerung.mp4` | 00:07:31 | kanonischer Name vorhanden |
| 6 | `kundenbestellung` | `kundenbestellung.mp4` | 00:05:21 | UI enthält noch alten Original-Dateinamen als Label |
| 9 | `partnerregistrierung` | `partnerregistrierung.mp4` | 00:08:54 | UI enthält noch alten Original-Dateinamen als Label |
| 10 | `ppm-bedeutung` | `ppm-bedeutung.mp4` | 00:03:15 | kanonischer Name vorhanden |
| 10 | `membranfilter-vs-filterkanne` | `membranfilter-vs-filterkanne.mp4` | 00:02:19 | UI enthält noch alten Original-Dateinamen als Label |
| 10 | `tee-test` | `tee-test.mp4` | 00:01:53 | UI enthält noch alten Original-Dateinamen als Label |
| 10 | `basilikum-test` | `basilikum-test.mp4` | 00:04:09 | UI enthält noch alten Original-Dateinamen als Label |
| 10 | `farbtest` | `farbtest.mp4` | 00:00:26 | UI enthält noch alten Original-Dateinamen als Label |
| 10 | `farbtest-erklaerung` | `farbtest-erklaerung.mp4` | 00:02:49 | UI enthält noch alten Original-Dateinamen als Label |

Hinweis: Für die spätere CMS-/R2-Umstellung sollte der kanonische Dateiname als technische Referenz gelten. Alte Original-Dateinamen in UI-Metadaten sollten nicht als neuer Produktionsstandard übernommen werden.

## 5. Welche Videos ersetzt oder neu produziert werden sollen

Ohne finale neue Videodateien ist noch keine konkrete Datei als ersetzt markiert. Für die Produktionsplanung gelten aber folgende Prioritäten:

### Priorität A – fehlende Videos produzieren

| Modul | Lektion | Aktueller Status | Ziel |
|---:|---|---|---|
| 1 | Willkommensvideo | Platzhalter | neues offizielles Willkommensvideo produzieren |
| 7 | RXT Schulungsvideo | Platzhalter | neues offizielles RXT-Schulungsvideo produzieren |

### Priorität B – Launch-kritische Kernvideos ersetzen oder finalisieren

| Modul | Video | Grund |
|---:|---|---|
| 2 | Wasser ist Leben | zentrale Einführung in Wasserqualität |
| 2 | Allgemeine Ernährungsweise | wichtiger Beratungskontext |
| 2 | Funktionen von Wasser im Körper | rechtlich/inhaltlich besonders sorgfältig prüfen |
| 2 | Mineralien | häufige Kundenfragen |
| 2 | Grenzwerte | rechtlich/inhaltlich besonders sorgfältig prüfen |
| 3 | Umkehrosmose Erklärung | Kerntechnologie |
| 6 | Kundenbestellung | operativer Verkaufsprozess |
| 9 | Partnerregistrierung | operativer Teamaufbauprozess |

### Priorität C – Praxis- und Testlaborvideos aktualisieren

| Modul | Video | Grund |
|---:|---|---|
| 10 | PPM Bedeutung | wichtig für Wassertests |
| 10 | Membranfilter vs. Filterkanne | starkes Demonstrationsvideo |
| 10 | Tee-Test | einfache Partnerübung |
| 10 | Basilikum-Test | Langzeitbeobachtung |
| 10 | Farbtest | Kurzdemonstration |
| 10 | Farbtest Erklärung | korrekte Einordnung nach Demonstration |

## 6. Einheitliches Dateinamen-Schema

Für neue Videos wird ein eindeutiges, versionierbares Schema empfohlen:

```text
academy_m{modulnummer}_l{lektionsnummer}_{slug}_{sprache}_v{version}_{yyyymmdd}.mp4
```

Beispiele:

```text
academy_m01_l02_willkommen_de_v1_20260701.mp4
academy_m02_l02_wasser-ist-leben_de_v2_20260701.mp4
academy_m07_l02_rxt-schulung_de_v1_20260701.mp4
academy_m10_l04_tee-test_de_v2_20260701.mp4
```

Empfohlener späterer R2-Key:

```text
academy/videos/m{modulnummer}/{slug}/{sprache}/v{version}/{dateiname}
```

Beispiel:

```text
academy/videos/m02/wasser-ist-leben/de/v2/academy_m02_l02_wasser-ist-leben_de_v2_20260701.mp4
```

Regeln:

- nur Kleinbuchstaben
- keine Leerzeichen
- keine Umlaute im Dateinamen
- Bindestriche statt Leerzeichen
- Sprachcode immer enthalten
- Version immer enthalten
- Produktionsdatum immer enthalten
- vorhandene alte Dateien nicht überschreiben

## 7. Empfohlene Video-Reihenfolge

Die sichtbare Academy-Reihenfolge sollte der Modulstruktur folgen. Für die Produktion empfiehlt sich diese Reihenfolge:

1. Modul 1 – Willkommensvideo
2. Modul 2 – Wasser ist Leben
3. Modul 2 – Allgemeine Ernährungsweise
4. Modul 2 – Funktionen von Wasser im Körper
5. Modul 2 – Mineralien
6. Modul 2 – Grenzwerte
7. Modul 3 – Umkehrosmose Erklärung
8. Modul 6 – Kundenbestellung
9. Modul 7 – RXT Schulungsvideo
10. Modul 9 – Partnerregistrierung
11. Modul 10 – PPM Bedeutung
12. Modul 10 – Membranfilter vs. Filterkanne
13. Modul 10 – Tee-Test
14. Modul 10 – Basilikum-Test
15. Modul 10 – Farbtest
16. Modul 10 – Farbtest Erklärung

Begründung:

- zuerst Onboarding und Grundlagen
- danach Kernprodukt und Verkaufsprozess
- danach Technik und Partneraufbau
- zuletzt Praxis-/Testlaborvideos als Vertiefung

## 8. Upload-Checkliste für R2

Vor dem späteren Upload:

- finale Datei nach Dateinamen-Schema benennen
- MP4 mit H.264 Video und AAC Audio exportieren
- `Content-Type: video/mp4` vorbereiten
- Video-Dauer dokumentieren
- Modulnummer, Lektionsnummer, Resource-ID und Sprache dokumentieren
- SHA-256-Checksumme oder vergleichbaren Hash notieren
- Dateigröße prüfen
- finale Freigabe im Content-Review einholen
- alte Datei nicht überschreiben
- neuen R2-Key separat hochladen
- öffentliche Direktzugriffe vermeiden
- Zugriff ausschließlich über geschützte Academy-Auslieferung planen
- Preview nur mit Admin/approved Partner prüfen
- Rollback-Key der bisherigen Datei dokumentieren

Nach dem späteren Upload:

- R2-Objekt vorhanden
- korrekter MIME-Type
- private Zugriffseinstellung
- keine öffentliche Bucket-URL für interne Academy-Videos
- Range-/Streaming-Fähigkeit prüfen
- Wiedergabe auf Desktop prüfen
- Wiedergabe auf Mobile prüfen
- geschützte Route prüfen
- Zuordnung erst nach erfolgreicher Vorschau aktualisieren

## 9. Qualitätscheck vor Upload

Inhalt:

- klares Lernziel pro Video
- keine medizinischen oder rechtlich riskanten Überversprechen
- Produkt- und Prozessangaben aktuell
- keine sichtbaren privaten Daten
- keine internen Passwörter, Adminbereiche oder Kundendaten im Bild
- Aqua Global und Harbor Academy sauber getrennt erklären, wo relevant
- klare nächste Handlung für Partner

Technik:

- sauberes Bild
- verständlicher Ton
- mobile Lesbarkeit bei eingeblendeten Texten
- keine extremen Lautstärkesprünge
- kein unnötig langer Leerraum am Anfang oder Ende
- stabile Framerate
- Export als MP4/H.264/AAC
- Dateiname nach Schema
- korrekte Dauer dokumentiert

UX:

- idealerweise kurze Kapitel oder klare Struktur
- Titel im Video passt zum Modultitel
- Start und Ende wirken professionell
- Video funktioniert ohne zusätzliche Erklärung
- optionale Untertitel/Transkript später vorbereiten

Compliance:

- keine fremden Marken, Bilder, Musik oder geschützten Inhalte ohne Rechte
- keine personenbezogenen Daten
- keine falschen Gesundheits- oder Heilversprechen
- keine ungesicherten Erfolgsversprechen
- rechtlich sensible Videos, besonders zu Wasser, Körper, Grenzwerten und Tests, vor Veröffentlichung fachlich prüfen

## 10. Zuordnung: Modul → Lektion → Video-Datei

| Modul | Lektion | Resource-ID | Aktuelle Datei | Empfohlener neuer Dateiname |
|---:|---|---|---|---|
| 1 | Willkommensvideo | `academy-welcome-placeholder` | – | `academy_m01_l02_willkommen_de_v1_YYYYMMDD.mp4` |
| 2 | Wasser ist Leben | `wasser-ist-leben` | `wasser-ist-leben.mp4` | `academy_m02_l02_wasser-ist-leben_de_v2_YYYYMMDD.mp4` |
| 2 | Allgemeine Ernährungsweise | `allgemeine-ernaehrungsweise` | `allgemeine-ernaehrungsweise.mp4` | `academy_m02_l03_allgemeine-ernaehrungsweise_de_v2_YYYYMMDD.mp4` |
| 2 | Funktionen von Wasser im Körper | `funktionen-wasser-koerper` | `funktionen-von-wasser-im-koerper.mp4` | `academy_m02_l04_funktionen-wasser-koerper_de_v2_YYYYMMDD.mp4` |
| 2 | Mineralien | `mineralien` | `mineralien.mp4` | `academy_m02_l05_mineralien_de_v2_YYYYMMDD.mp4` |
| 2 | Grenzwerte | `grenzwerte` | `grenzwerte.mp4` | `academy_m02_l06_grenzwerte_de_v2_YYYYMMDD.mp4` |
| 3 | Umkehrosmose Erklärung | `umkehrosmose-erklaerung` | `umkehrosmose-erklaerung.mp4` | `academy_m03_l02_umkehrosmose-erklaerung_de_v2_YYYYMMDD.mp4` |
| 6 | Kundenbestellung | `kundenbestellung` | `kundenbestellung.mp4` | `academy_m06_l02_kundenbestellung_de_v2_YYYYMMDD.mp4` |
| 7 | RXT Schulungsvideo | `rxt-training-placeholder` | – | `academy_m07_l02_rxt-schulung_de_v1_YYYYMMDD.mp4` |
| 9 | Partnerregistrierung | `partnerregistrierung` | `partnerregistrierung.mp4` | `academy_m09_l02_partnerregistrierung_de_v2_YYYYMMDD.mp4` |
| 10 | PPM Bedeutung | `ppm-bedeutung` | `ppm-bedeutung.mp4` | `academy_m10_l02_ppm-bedeutung_de_v2_YYYYMMDD.mp4` |
| 10 | Membranfilter vs. Filterkanne | `membranfilter-vs-filterkanne` | `membranfilter-vs-filterkanne.mp4` | `academy_m10_l03_membranfilter-vs-filterkanne_de_v2_YYYYMMDD.mp4` |
| 10 | Tee-Test | `tee-test` | `tee-test.mp4` | `academy_m10_l04_tee-test_de_v2_YYYYMMDD.mp4` |
| 10 | Basilikum-Test | `basilikum-test` | `basilikum-test.mp4` | `academy_m10_l05_basilikum-test_de_v2_YYYYMMDD.mp4` |
| 10 | Farbtest | `farbtest` | `farbtest.mp4` | `academy_m10_l06_farbtest_de_v2_YYYYMMDD.mp4` |
| 10 | Farbtest Erklärung | `farbtest-erklaerung` | `farbtest-erklaerung.mp4` | `academy_m10_l07_farbtest-erklaerung_de_v2_YYYYMMDD.mp4` |

## 11. Offene Platzhalter

Aktuell offene Video-Platzhalter:

1. `academy-welcome-placeholder`
   - Modul: 1 – Willkommen / Startcenter
   - Lektion: Willkommensvideo
   - empfohlene Priorität: sehr hoch
   - Ziel: persönlicher, motivierender Einstieg in die Academy

2. `rxt-training-placeholder`
   - Modul: 7 – RXT Entkalkung
   - Lektion: RXT Schulungsvideo
   - empfohlene Priorität: hoch
   - Ziel: technisches Schulungsvideo passend zur bestehenden RXT-Präsentation

Zusätzlich offen:

- finale Transkripte/Untertitel je Video
- finale Thumbnail-Strategie
- finale Mehrsprachigkeitsstrategie für Videos in RU, RO und EN
- Entscheidung, ob neue Videos direkt in R2 oder zunächst lokal privat vorbereitet werden
- spätere CMS-Asset-Metadaten gemäß `docs/CMS_BACKEND_BLUEPRINT.md`

## 12. Spätere Austauschstrategie

Der Austausch soll sicher, reversibel und ohne Unterbrechung der Partner-Academy erfolgen.

Empfohlener Ablauf:

1. Bestehende Video-Zuordnung inventarisieren.
2. Neue Videodatei nach Schema exportieren.
3. Qualitätscheck durchführen.
4. Neue Datei zuerst separat hochladen.
5. Alte Datei nicht löschen und nicht überschreiben.
6. Geschützten Preview-Zugriff prüfen.
7. Wiedergabe mit Range Requests prüfen.
8. Mobile-Preview prüfen.
9. Modul-/Lektionszuordnung erst nach erfolgreicher Vorschau aktualisieren.
10. Approved-Partner-Zugriff prüfen.
11. Admin-Zugriff prüfen.
12. Pending/blocked/unauthenticated Zugriff prüfen.
13. Changelog und Content-Inventar aktualisieren.
14. Alte Datei erst nach stabiler Freigabe archivieren.
15. Alte Datei nur nach separater Freigabe löschen.

Rollback-Prinzip:

- Alte Datei bleibt zunächst erhalten.
- Alte Zuordnung wird dokumentiert.
- Neue Zuordnung kann bei Fehlern wieder auf die alte Datei zurückgestellt werden.
- Archivierung erfolgt erst nach erfolgreicher Produktionsprüfung.

Notification-Prinzip für später:

- Modul-Updates dürfen nicht pauschal an alle Partner gehen.
- Benachrichtigungen sollen später nur Partner erreichen, die das Modul bereits gesehen, begonnen, abgeschlossen oder laut Lernpfad erreicht haben.
- Neue Partner sollen nicht durch Updates zu späteren Modulen gestört werden.
- Globale Academy-Updates bleiben als separate Ausnahme möglich.

## 13. Bewusst nicht umgesetzt

In diesem Schritt wurde bewusst nicht umgesetzt:

- keine Codeänderungen
- keine R2-Uploads
- keine Datei-Migration
- keine Datenbankänderungen
- keine Supabase-Änderungen
- keine API-Änderungen
- keine Auth-Änderungen
- keine Storage-Änderungen
- keine Infrastrukturänderungen
- keine Änderungen an Partnerdaten
- keine Änderungen an Modulzuordnungen
- keine produktiven Schreibvorgänge
- keine Tests, da ausschließlich Markdown-Dokumentation geändert wurde

## 14. Zusammenfassung

Die Harbor Global Partner Academy besitzt aktuell 14 echte Video-Zuordnungen und 2 offene Video-Platzhalter. Für den kommenden Video-Content-Austausch sollte zuerst einheitlich produziert, versioniert und separat hochgeladen werden. Alte Videos dürfen nicht überschrieben oder sofort gelöscht werden.

Der sichere Zielprozess lautet:

Neue Videos produzieren → Qualität prüfen → separat hochladen → Vorschau prüfen → Modul-Zuordnung aktualisieren → Zugriff testen → alte Videos archivieren.

Damit bleibt die Academy während des Austauschs stabil, rollbackfähig und sicher für den privaten Partnerbetrieb.
