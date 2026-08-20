# Partner Execution & Success System

## Ziel und Ist-Zustand

P5 verbindet vorhandenes Lernen mit einer überschaubaren nächsten Handlung. Das Success Center bleibt der kanonische Ort für operative Aufgaben. Das Dashboard verweist nur kompakt auf diesen Bereich.

Vor P5 existierten bereits mehrere abgeleitete Aufgabenlisten: Partnerstart, Dashboard-„Heute für dich“, Success-Center-Aufgaben sowie Praxisaufgaben in P3 und P4. Es existiert jedoch keine produktive Task-Tabelle oder Task-API. Academy-Fortschritt wird aus der vorhandenen `academyProgress`-Metadatenquelle normalisiert; P5 schreibt daran nichts.

| Bereich | Produktiver Stand | Persistenz | P5-Entscheidung |
| --- | --- | --- | --- |
| Partnerstart | 24h-/7-Tage-Führung | bestehende Academy-Daten plus lokale Einführungszustände | bleibt P0-kanonisch |
| Academy-Fortschritt | normalisierte Modul-/Videoauswertung | vorhandene Partnermetadaten, soweit geliefert | einzige Fortschrittsquelle |
| Success Center | abgeleitete Aufgaben und Übersichten | keine Task-Persistenz | kanonischer Ausführungsort |
| Dashboard-Fokus | bisher vollständige zweite Aufgabenliste | keine eigene Persistenz | kompakter Verweis auf Success Center |
| Notifications | Academy-Updates mit bestehender Lesestatus-Vorbereitung | bestehende Update-Metadaten | nur Integrationspunkte dokumentiert |
| Leader/Admin | Team-Aggregate und Blueprints | vorhandene Aggregate | keine personenbezogene Erweiterung |
| P3/P4-Praxis | UI-only Lernaufgaben | keine | als Quelle verlinkt, nicht kopiert |

## Single Sources of Truth

- Aufgaben und Umsetzung: Success Center.
- Lernfortschritt: `app/lib/academy-progress.js` und die bestehende `academyProgress`-Quelle.
- Onboarding: P0 Partnerstart.
- Lerninhalte: P1 bis P4.
- Aktionen: Campaign Center.
- Provisionen, Punkte und Level: Earnings Engine.
- Medien: Media Center.

## Execution-Modell

`LEARN → DO → CHECK → IMPROVE` beziehungsweise `Lernen → Umsetzen → Prüfen → Verbessern` ist ein UI-Modell, keine neue Engine. Die zentrale Konfiguration liegt in `app/lib/partner-execution.js`.

### Daily Focus

Der Daily Focus zeigt exakt drei abgeleitete Elemente: Lernschritt, Praxisaktion und Kontext. Er enthält keine freien Aktionspreise und keine zweite Fortschrittsberechnung.

### Weekly Plan

Der Wochenplan zeigt fünf kompakte Fokusfelder. Es werden keine Mengen oder Erfolgsziele gespeichert oder als erreicht dargestellt.

### Practice Challenges

P1 bis P4 bleiben fachliche Quellen. P5 liefert nur Ausführungsaufforderungen mit einer sichtbaren Quellenkennung. `statusMode: UI_ONLY` macht fehlende Persistenz ausdrücklich kenntlich.

### Next Best Action

Die regelbasierte Reihenfolge lautet:

1. offenen Partnerstart fortsetzen;
2. Produktwissen erreichen;
3. offenen Academy-Fortschritt fortsetzen;
4. nach Abschluss Sales-Wissen praktisch anwenden;
5. Content-Praxis als dokumentierter Fallback.

Die Logik nutzt ausschließlich vorhandene Fortschrittsdaten. Es gibt keine KI-Entscheidung, Bewertung oder versteckte Profilbildung.

### Weekly Review

Abgeschlossene Module stammen aus der kanonischen Progress-Quelle. Praxisumsetzung wird ausdrücklich als nicht persistent erfasst dargestellt. Fehlende Daten werden nicht geschätzt.

## Leader View und Support Signals

Die Leader-Ansicht nutzt ausschließlich vorhandene Team-Aggregate wie Teamgröße und neue Partner. Namen, E-Mail-Adressen, Telefonnummern, private Notizen, Gesundheitsdaten und sensible Bewertungen sind ausgeschlossen. Hinweise wie „Unterstützung sinnvoll“ bleiben neutral und sind keine Leistungsbewertung.

Eine echte mitgliedsbezogene Leader-Ansicht bleibt blockiert, bis ein autorisierter, minimaler Team-Endpunkt mit sauberem Rollen- und Datenschutzkonzept existiert.

## Notifications und Automationen

Folgende Integrationspunkte sind nur als Blueprint definiert:

- `execution.task.completed`
- `execution.week.started`
- `execution.week.completed`
- `execution.support.requested`

Modulbezogene Benachrichtigungen dürfen später nur Partner erreichen, die den betreffenden Bereich erreicht haben. Globale Systemmeldungen bleiben davon getrennt. P5 registriert keine Hooks, sendet keine Nachrichten und erzeugt kein Tracking.

## CRM-Grenze und Datenschutz

P5 kann auf Follow-up-Lernen verweisen, speichert aber keine Kontakte, Nachrichten oder Kundendaten. Es gibt keine neue CRM-, WhatsApp-, Analytics- oder Automationsanbindung und keine neuen personenbezogenen Felder.

## Persistenz und offene Fragen

Praxis-, Wochen- und Aufgabenstatus bleiben UI-only. Eine spätere Persistenz benötigt vor Umsetzung ein freigegebenes Datenmodell, idempotente Events, RLS, serverseitige Rollenprüfung, Datenschutzprüfung und eine Migration mit Rollback. Bis dahin darf die UI keinen gespeicherten Erfolg vortäuschen.

## Rollout und Rollback

P5 ist eine additive Konfigurations- und UI-Schicht ohne Datenmigration, Dependency, Auth-, R2- oder Supabase-Änderung. Rollback erfolgt durch Revert des einzelnen P5-Commits. Vor einer späteren Persistenzphase sind gesonderte Architektur- und Security-Gates erforderlich.

## Spätere Erweiterungen

- idempotente Aufgabenpersistenz mit RLS;
- autorisierte Teamzuordnung für Leader;
- progress-aware Notification-Ausspielung;
- explizite Support-Anfrage durch Partner;
- opt-in Analytics für abgeschlossene Umsetzungsschritte;
- getrennte CRM-/Automation-Anbindung.
