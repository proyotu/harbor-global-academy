# I18N Translation Coverage

Stand: 2026-07-03

## Ziel

Die Harbor Global Partner Academy soll auf eine globale Sprachumschaltung vorbereitet sein. Sichtbare UI-Texte in Navigation, Dashboard und den zuletzt ergänzten Center-Bereichen dürfen nicht mehr isoliert hart auf Deutsch bleiben, sondern sollen über Translation-Keys oder eine definierte Fallback-Kette laufen.

Unterstützte Zielsprachen:

- Deutsch (`de`)
- Englisch (`en`)
- Russisch (`ru`)
- Rumänisch (`ro`)
- Tschechisch (`cs`)
- Türkisch (`tr`)
- Griechisch (`el`)

## Aktueller Ist-Zustand

- Die ausgewählte Sprache wird clientseitig in `localStorage` unter `harbor-global-language` gespeichert.
- `app/page.jsx` nutzt bereits `selectedLanguage`, `normalizeLanguage()` und `getCopy(language)`.
- Viele ältere Bereiche verwenden bereits `copy.*` oder `labelKey`.
- Die Academy-Inhaltskataloge sind teilweise mehrsprachig vorbereitet, historisch vor allem für DE, EN, RU und RO.
- Neuere ausgelagerte UI-Prototypen enthielten noch viele direkt sichtbare deutsche UI-Texte:
  - `components/success-center.jsx`
  - `components/growth-center.jsx`
  - `components/campaign-center.jsx`
  - `components/partner-earnings-engine.jsx`
  - `components/media-center.jsx`

## Umgesetzte Key-Struktur

Neu ergänzt wurde eine zentrale, kleine i18n-Erweiterung:

- `components/i18n-extension.js`

Sie enthält:

- `supportedI18nCodes`
- `getI18nExtensionLabels(language)`
- `createI18nTranslator(language, baseCopy)`
- UI-Keys für:
  - Dashboard-Navigation neuer Bereiche
  - Success Center
  - Growth Center
  - Campaign Center
  - Partner Earnings Engine
  - Media Center
  - gemeinsame Status-/Badge-/Button-Texte

## Fallback-Regeln

Die neue Fallback-Reihenfolge ist:

1. gewählte Sprache
2. Englisch
3. Deutsch
4. expliziter Komponenten-Fallback oder Key

Damit werden keine leeren oder `undefined`-Texte angezeigt.

## Angebundene Bereiche

### `app/page.jsx`

- Neue Dashboard-Navigationspunkte nutzen jetzt `labelKey` statt festen Labels:
  - Success Center
  - Growth Center
  - Campaign Center / Aktionen
  - Media Center
  - Punkte
  - Teamsteuerung
  - Analytics
  - Community
- `getCopy()` nutzt jetzt die erweiterte Fallback-Struktur.
- `t()` wird an die ausgelagerten Center-Komponenten weitergegeben.

### Success Center

- Hero-Headline und Beschreibung.
- Statistiklabels.
- Übersichtskarten.
- Aufgaben-Titel.
- Status-Badges.
- Aufgaben-CTA.
- Empfehlungspanel.
- Campaign-Hinweis im Success Center.

### Growth Center

- Hero-Headline und Beschreibung.
- Dashboardkarten.
- Kategorien.
- Growth-Dashboard-Panel.
- Empfehlungspanel.
- eingebundene Campaign-/Media-Panels.

### Campaign Center

- Hero-Headline und Beschreibung.
- KPI-Labels.
- Status-Badges.
- Kunden-/Partneraktionspanel.
- Materialpanel.
- Preisberechnungs-Panel.
- Empty State.
- Dashboard-Aktionsbanner.
- Success-/Growth-Integration.

### Partner Earnings Engine

- Hauptpanel.
- Kern-Badges.
- Hero-Headline und Beschreibung.
- Quellen-, Provisions-, Punkte-, Leader-, Admin- und Security-Paneltitel.
- zentrale sichtbare Rechenfrage.

### Media Center

- Hero-Headline und Beschreibung.
- Suchpanel.
- Filterlabels.
- Kategorie-Titel und Beschreibungen.
- Status-Badges.
- Datei-/Update-Labels.
- Empty States.
- Rollenmodell.
- Admin-Konfigurations-UI.
- Growth-/Campaign-Buttons.

## Noch offene Übersetzungen / TODO

Keine neue i18n-Library wurde eingeführt und kein vollständiger Content-CMS-Umbau vorgenommen. Deshalb bleiben folgende Punkte bewusst als nächster Schritt dokumentiert:

- Sehr lange statische Content-Datensätze in `app/page.jsx` sollten später schrittweise in kleinere Komponenten und Translation-Kataloge aufgeteilt werden.
- Einige inhaltliche Demo-/Blueprint-Daten in Arrays bleiben Content-Daten und nicht reine UI-Labels. Diese sollten später im CMS gepflegt werden.
- Professionelle Fachübersetzungen für RU, RO, CS, TR und EL sollten durch Muttersprachler geprüft werden.
- Academy-Lektionsinhalte, rechtliche Texte und Produkt-/Provisionsfachtexte benötigen separate fachliche Übersetzungsfreigabe.
- Eine spätere CMS-Pflege sollte pro Inhalt Sprache, Version, Veröffentlichungsstatus und Fallback-Sprache speichern.

## Risiken

- `app/page.jsx` bleibt sehr groß; vollständige i18n-Abdeckung aller historischen Strings sollte nur schrittweise erfolgen.
- Fachliche Übersetzungen für Preise, Provisionen, Compliance und Rechtliches dürfen nicht improvisiert werden.
- Runtime-Fallbacks verhindern leere Texte, ersetzen aber keine professionelle Lokalisierungsprüfung.

## Empfohlene nächste Schritte

1. Legacy-UI in `app/page.jsx` weiter modularisieren.
2. Translation-Keys pro ausgelagertem Bereich ergänzen.
3. Muttersprachliche QA für EN, RU, RO, CS, TR und EL durchführen.
4. CMS-Blueprint für mehrsprachige Inhalte produktiv planen.
5. Automatisierten Smoke-Test für alle unterstützten Sprachen ergänzen.
