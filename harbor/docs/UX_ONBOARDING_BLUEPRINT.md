# UX Onboarding Blueprint

Stand: 2026-07-03

## Ziel

Die Harbor Global Partner Academy soll sich für neue Partner wie eine klare Premium-App anfühlen: wenige Entscheidungen, kurze Wege, große mobile Touchflächen und immer ein eindeutiger nächster Schritt.

## Analyse: erkannte doppelte Inhalte

Vor der Optimierung wurden im sichtbaren Partner-Dashboard mehrere vollständige Bereiche parallel angezeigt:

- Startbereich enthielt gleichzeitig:
  - Willkommenskarte
  - kompaktes Success Center
  - vollständige Onboarding-Checkliste
  - Termin-/Onboarding-Call-Karte
  - Willkommensvideo
- Dashboard enthielt gleichzeitig:
  - Community-/Statistik-KPI-Leiste
  - Benachrichtigungswidget
  - Buchungs-CTA
  - vollständige Onboarding-Checkliste
  - Gamification-Teaser
  - Schnellaktionen
  - Fortschrittskarte
  - Rankingkarten
  - Aktivitätskarte
- Die gleichen Nutzerziele erschienen damit mehrfach:
  - nächster Schritt
  - Onboarding
  - Fortschritt
  - offene Aufgaben
  - Kampagne / Aktion
  - Success-/Growth-/Media-Zugänge

## Entfernte Wiederholungen

Die Dashboard-Startseite zeigt keine vollständigen Doppelbereiche mehr:

- Kein kompaktes Success Center mehr im Startbereich.
- Keine vollständige Onboarding-Checkliste zusätzlich im Dashboard.
- Kein Gamification-Teaser im Dashboard-Start.
- Keine Rankingkarten im Dashboard-Start.
- Keine separate Aktivitätskarte im Dashboard-Start.
- Kein globales Aktionsbanner auf jeder Dashboard-Unterseite.

Detailbereiche bleiben über die Navigation erreichbar:

- Success Center
- Growth Center
- Campaign Center
- Media Center
- Punkte / Gamification
- Rankings
- Community

## Neue Onboarding-Struktur

Der Startbereich führt neue Partner nun in drei klaren Schritten:

1. Willkommensvideo
   - Einstieg in die Harbor Global Partner Academy.
   - Mobile-first Videokarte mit großem Status und CTA.

2. Academy-Erklärung
   - UI vorbereitet für ein eigenes kurzes Erklärungsvideo.
   - Behandelt Dashboard, Module, Downloads, Media Center, Campaign Center, Success Center, Growth Center, Sprachumschaltung und Profil.
   - Aktuell als sicherer Platzhalter dokumentiert, weil kein echtes Video-Asset vorhanden ist.

3. Onboarding abgeschlossen
   - Button führt direkt ins normale Dashboard.
   - Es werden nur lokale Sitzungs-Häkchen gesetzt.
   - Keine Partnerdaten, keine Datenbank und keine API werden beschrieben.

## Dashboard-Optimierung

Das normale Dashboard ist jetzt in einer klaren Reihenfolge aufgebaut:

1. Willkommen
2. Heutige Aufgaben
3. Kompakte Übersicht
4. Aktuelle Kampagne
5. Neuigkeiten
6. Media Center
7. Growth Center
8. Success Center

Die Startseite ist damit nicht mehr eine Sammlung aller Funktionen, sondern eine tägliche Steuerzentrale.

## Heutige Aufgaben

Die Aufgabenliste zeigt nur wenige relevante Schritte:

- nächstes Modul
- Profil vervollständigen, falls noch kein Profilbild vorhanden ist
- PPM-/Wassertest, sobald erster Fortschritt vorhanden ist
- Story-/Media-Schritt, sobald genug Kontext vorhanden ist
- WhatsApp-/Unterlagen-Schritt bei weiterem Fortschritt
- Teamaufgabe nur bei Leader-/Teamkontext

Es wird bewusst nicht alles gleichzeitig angezeigt.

## Kompakte Fortschrittskarte

Die neue Übersicht bündelt:

- Academy-Fortschritt
- heutige Aufgaben
- offene Aufgaben
- Punkte
- Level
- Zertifikate

So muss der Partner nicht zwischen mehreren Karten suchen.

## Mobile-Optimierung

Umgesetzt:

- wenige Karten statt langer Dashboard-Seiten
- große Buttons mit `min-h-12`
- einspaltige mobile Reihenfolge
- kurze Wege zu den wichtigsten Bereichen
- keine vollständigen Detailbereiche auf der Startseite
- klare CTAs statt paralleler Aktionslisten

## UX-Regeln für kommende Änderungen

- Eine Information wird nur einmal vollständig angezeigt.
- Wiederholungen sind nur als kurzer Link oder Hinweis erlaubt.
- Neue sichtbare UI-Texte müssen Translation-Keys verwenden.
- Neue Buttons, Karten, Labels, Badges, Empty States und Hinweise dürfen nicht hardcodiert werden.
- Dashboard-Start zeigt nur das Tagesrelevante.
- Detailtiefe gehört in die jeweiligen Fachbereiche.
- Mobile ist primär; Desktop darf verdichten, aber nicht überladen.

## Offene Punkte

- Das echte Academy-Erklärungsvideo fehlt noch als Content-Asset.
- Persistentes Onboarding benötigt später eine freigegebene Datenstruktur.
- Weitere historische Bereiche in `app/page.jsx` enthalten noch alte UI-Texte und sollten schrittweise ausgelagert und weiter i18n-fähig gemacht werden.
- Visuelle Mobile-QA auf echten Geräten sollte nach Deployment separat erfolgen.

## Bewusst nicht geändert

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
