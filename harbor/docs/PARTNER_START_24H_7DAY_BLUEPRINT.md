# Partnerstart: 24 Stunden und 7 Tage

## Ist-Zustand

Die Academy verfügte bereits über ein Startcenter, ein dreistufiges `GuidedAcademyOnboarding`, ein Success Center, Dashboard-Aufgaben und eine kanonische Academy-Fortschrittsquelle. Die Informationen waren jedoch über mehrere Bereiche verteilt, das Dashboard zeigte bis zu vier Aufgaben und sechs Kennzahlen, und der vorhandene Onboarding-Assistent vermischte Orientierung, Quiz, Außendienstaufgaben und längerfristige Ziele.

Ein echtes Willkommensvideo und ein eigenes Academy-Erklärungsvideo sind im freigegebenen Videokatalog weiterhin nicht vorhanden. Das vorhandene Partnerregistrierungsvideo erklärt die Registrierung und wird deshalb nicht als Willkommensvideo umgedeutet.

## Zielreise

Der Startbereich ist der kanonische Hauptort für den Partnerstart:

1. Willkommen und Orientierung
2. Academy kennenlernen
3. Aufgaben für die ersten 24 Stunden
4. kompakter 7-Tage-Startplan
5. aktueller Schritt und kompakter Fortschritt

Das Dashboard verweist nur mit „Heute für dich“, maximal drei Aufgaben, vier kompakten Statuswerten und dem nächsten Schritt auf diese Reise. Das Success Center bleibt der Hauptort für weiterführende Aufgaben und Empfehlungen.

## 24-Stunden-Flow

Der Flow verwendet ausschließlich sicher ableitbare Zustände:

- Kernprofil vorhanden
- lokaler Orientierungsstatus für den vorbereiteten Willkommen-Slot
- lokaler Orientierungsstatus für die Academy-Erklärung
- vorhandener kanonischer Video-/Modulfortschritt
- vorhandene Wasserwissen-Videos
- vorhandener Teamkontext

Ein Teamtermin wird nicht angezeigt, weil keine verlässliche Eventquelle vorhanden ist. Direkte Upline-/Leader-Daten sind nicht persistent verfügbar; ohne Teamkontext verweist der Flow transparent auf den bestehenden Kontaktbereich.

## 7-Tage-Flow

- Tag 1: Orientierung
- Tag 2: Wasserwissen
- Tag 3: Produkte
- Tag 4: Kundengespräch
- Tag 5: Sichtbarkeit
- Tag 6: Partnerschaft
- Tag 7: Umsetzung und nächster Lernschritt

Die Timeline öffnet nur vorhandene Academy-Bereiche. Sie erzeugt keine neuen Lektionen und keine neuen Inhaltskopien. Der aktuelle Tag wird aus dem vorhandenen Freigabezeitpunkt, ersatzweise dem Erstellzeitpunkt, berechnet und auf Tag 1 bis 7 begrenzt.

## Content-Verfügbarkeit und Platzhalter

| Slot | Status | Vorgehen |
| --- | --- | --- |
| Willkommensvideo | Content-TODO | Bestehenden geschützten Platzhalter beibehalten; kein Fake-Link |
| Academy-Erklärungsvideo | Content-TODO | Als „in Vorbereitung“ kennzeichnen; kurze UI-Orientierung erlauben |
| Registrierungsvideo | vorhanden, fachlich ungeeignet | Nicht umdeuten |
| Wassergrundlagen, Umkehrosmose, PPM/TDS | vorhanden | Über bestehende Module/Testlabor erreichbar |
| Teamtermin | keine sichere Datenquelle | Nicht anzeigen |

## Fortschritt

Academy-Fortschritt und Videoabschlüsse stammen weiterhin aus `partner.academyProgress`. Die neue Darstellung erzeugt keine zweite kanonische Berechnung. Die beiden vorbereiteten Orientierungsbestätigungen bleiben innerhalb des bereits vorhandenen lokalen `localOnboardingStepIds`-Zustands und sind damit bewusst nicht geräteübergreifend persistent. Eine spätere Persistenz darf nur über die bestehende Fortschrittsarchitektur erfolgen.

## Leader-Handoff

Vorhandene Felder wie `teamName` und `teamPartnerCount` werden kompakt angezeigt. Direkte Leader-Namen oder Kontaktdaten werden nicht erfunden und nicht zusätzlich erhoben. Ist kein Teamkontext vorhanden, wird der bestehende Kontaktbereich angeboten.

## Duplikationsregeln

- Startcenter: vollständige 24h-/7-Tage-Reise
- Dashboard: Tagesfokus und kompakter Status
- Success Center: weiterführende Aufgaben und Empfehlungen
- Module: kanonische Lerninhalte
- Media/Growth Center: vorhandene Ressourcen, keine Kopien im Startplan

## Offene Content-TODOs

1. Freigegebenes Willkommensvideo produzieren und über das bestehende private Video-Mapping einbinden.
2. Kurzes Academy-Erklärungsvideo produzieren und fachlich prüfen.
3. Sichere Upline-/Leader-Zuordnung definieren, ohne zusätzliche personenbezogene Daten zu sammeln.
4. Verlässliche Eventquelle anbinden, bevor Teamtermine angezeigt werden.
5. Orientierungsbestätigungen später über die bestehende kanonische Fortschrittsquelle persistieren.

## Rollback

Die Änderung besteht aus einer kleinen UI-Komponente, zwei reinen Fortschrittshelfern, Übersetzungen und einer begrenzten Einbindung in `app/page.jsx`. Ein Rollback benötigt keine Daten-, Auth-, Supabase-, Storage- oder Navigationsänderung.
