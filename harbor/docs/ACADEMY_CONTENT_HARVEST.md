# Harbor Global Partner Academy – Content Harvest Audit

Stand: 2026-08-13
Scope: lokaler, dateibasierter Content-Audit ohne Production-Integration

## Executive Summary

Der lokal erreichbare Bestand enthält bereits eine belastbare Basis für Produkt- und Wasserwissen, operative Academy-Prozesse und mehrere wiederverwendbare Business-/KI-Frameworks. Der größte unmittelbare Hebel liegt nicht in weiterer Produktion, sondern in der didaktischen Aufbereitung bestehender Inhalte: kurze Lernziele, Aufgaben, Checklisten, Quizze, Übersetzungen und ein dokumentierter Review-Stand fehlen häufiger als der Rohinhalt selbst.

Die Production-Academy ist die kanonische Quelle für 14 aktive Video-Zuordnungen und zehn geschützte Aqua-PDFs. Die PDF-Kopien in `Downloads/doc academy` und `Downloads/harbor` sind SHA-256-identisch und deshalb keine zusätzlichen Inhalte. Der Video-Batch enthält fünf eigenständige neue Produktkandidaten sowie zwei bereits migrierte kanonische Ersetzungen; der zweite PPM-Kandidat ist nach bestehender Bild-/Audio-Prüfung ein Duplikat.

Onboarding bleibt P0: Ein echtes Willkommensvideo und ein kompakter „erste 24 Stunden / erste 7 Tage“-Lernpfad fehlen. Für Produkte stehen Mini Touch, Sparkling Pro und Untertisch-Videos bereit, benötigen aber fachliche Freigabe, kanonische Lektionsentscheidungen und die bekannte sichere R2-Rolloutfolge. Wasser-, Gesundheits-, Wirkungs-, Preis-, Provisions- und Einkommensaussagen dürfen nicht ungeprüft aus älteren Präsentationen oder externen PDFs übernommen werden.

## Safety und Methode

- Geprüfter Worktree: `C:\Users\User\OneDrive\Dokumente\GitHub\harbor-global-academy-main`
- Branch/HEAD: `main` / `7401be9386e96eed3079f24de285fa0ed9bff14c`
- `origin/main`: identisch; ahead/behind `0/0`; Ausgangs-Working-Tree sauber.
- Security-Worktree `security/p0-hardening` wurde nur über `git worktree list` identifiziert und weder betreten noch verändert.
- Inventarisiert wurden 343 Dateien in zwei Repositories und sechs klar abgegrenzten lokalen Quellensammlungen.
- Ausgeschlossen: `.git`, `node_modules`, `.next`, `.vercel`, Build-/Cache-Verzeichnisse, Environment-Dateien sowie Dateien mit Credential-/Secret-/Token-Kontext.
- Binärdateien wurden nicht verändert. PDFs und Office-Dateien wurden nur textuell/metadatenbasiert ausgewertet; eine vollständige visuelle oder juristische Freigabe ist damit nicht ersetzt.
- Relevanz bedeutet „potenziell für Partner nutzbar“, nicht „automatisch veröffentlichbar“.

## Tatsächlich geprüfte Projekte und Quellensammlungen

| Nr. | Projekt / Sammlung | Lokaler Pfad | Status | geprüfte Dateien | Relevante Bereiche | Mögliche Academy-Nutzung |
|---:|---|---|---|---:|---|---|
| 1 | Harbor Global Partner Academy Production | `C:\Users\User\OneDrive\Dokumente\GitHub\harbor-global-academy-main\harbor` | Git-Repository, kanonische Production-Quelle | 107 | Module, Videos, PDFs, Quiz, Downloads, Growth/Media/Global Excellence, Betriebs-Blueprints | direkte kanonische Basis |
| 2 | Leonid OS | `C:\Users\User\OneDrive\Dokumente\GitHub\leonid-os` | eigenständiges Git-Repository | 94 | Priorisierung, Agenten, Lead-/Follow-up-Drafts, Approval, Prozesse, Voice | selektive Business-/KI-Grundlagen, nicht Entwicklerkurs |
| 3 | Leonid OS GPT Knowledge Pack | `C:\Users\User\Downloads\gpts` | lokale Wissens-/Installationssammlung | 13 | Masterprompt, Aqua-Wissensrahmen, Academy-Roadmap, Content Factory, KPI, drei Prompt-Workflows | Growth Center, KI & Tools, Sales, Produkte |
| 4 | Aqua Academy Documents | `C:\Users\User\Downloads\doc academy` | lokale PDF-Sammlung | 10 | Produkte, Wasser, RXT, Preise, Karriere | nur Dubletten-Nachweis; Production bleibt kanonisch |
| 5 | Water Business Blueprint | `C:\Users\User\Downloads\erstes buch` | lokale PDF-/Bildsammlung | 5 | 48h-Onboarding, Closing, Jahresplanung | Rohentwurf für Onboarding/Sales; starke Überarbeitung nötig |
| 6 | Harbor Legacy Snapshot | `C:\Users\User\Downloads\harbor` | älterer Projekt-Snapshot, kein Git-Repository | 90 | ältere App-/Dokument-/Video-Fassung | Historie und Dublettenprüfung, nicht kanonisch |
| 7 | Telegram Aqua Materials | `C:\Users\User\Downloads\Telegram Desktop` | begrenzte lokale Export-/Downloadsammlung | 18 | Wasser-PDF, Business-Präsentation, Partnerschaftsvorteile, Vertrag, drei Videos, Bilder | Reference/Review; Rechte, Aktualität und Claims offen |
| 8 | Aqua Presentation Exports | `C:\Users\User\Downloads` (nur sechs klar benannte Aqua-/Karriere-Dateien) | lokale Präsentationsexporte | 6 | historische Wasser-/Business-Präsentationen, Karriereplan | Quellenvergleich; überwiegend veraltet oder redundant |

Nicht lokal gefunden und daher nicht als geprüft behauptet: eigenständige Repositories für Aqua Global, Leonid AI Automation, Leonid AI Business Academy, CONEXIAL, Content Factory oder einen WhatsApp-Agenten. Dazu existieren nur Wissens- und Konzeptdateien in den oben genannten Quellen.

## Bestandskennzahlen

| Kennzahl | Ergebnis | Einordnung |
|---|---:|---|
| geprüfte Dateien | 343 | nach den dokumentierten Ausschlüssen |
| relevante Content-Cluster in der Registry | 67 | kanonische Inhalte, Kandidaten, Konzepte und dokumentierte Dubletten |
| aktive Academy-Videos | 14 | zwei via R2, zwölf lokal geschützt |
| zusätzliche eigenständige Video-Kandidaten | 5 | Untertisch, drei Mini-Touch-Lernziele, Sparkling Pro |
| dokumentierte Video-Dubletten | 1 | früherer PPM-Kandidat |
| echte Video-Platzhalter | 2 | Willkommen und RXT-Schulung |
| relevante PDF-Cluster | 17 | zehn Production-PDFs plus sieben externe/ehemalige Quellencluster |
| physische identische PDF-Kopien | 20 zusätzliche Kopien | zehn in `doc academy`, zehn im Legacy-Snapshot |
| Masterprompt-Versionen | 2 | Vollversion kanonisch; Kompaktversion abgeleitet |
| eigenständige Prompt-/Skill-Workflows | 3 | Content Factory, Aqua Product Intelligence, Opportunity Audit |
| relevante Blueprints | 11 | Academy-, System-, Water-Business- und Leonid-OS-Konzepte |
| relevante Checklisten/SOPs | 8 | u. a. Video-Produktion, R2, Content Factory, Operating Rules |
| relevante Guides/Handbücher | 4 | GPT-Handbuch, Video-Plan, R2-Delivery, Production Studio |

## Kanonische Quellen und Deduplikation

1. Die zehn Dateien in `harbor/academy-documents/private/` sind die einzige Academy-Quelle. Gleichnamige Dateien in `Downloads/doc academy` und `Downloads/harbor` sind byte-identische Kopien.
2. `harbor/app/lib/academy-content.js` ist der aktuelle kanonische Modul-/Lektionskatalog; Planungstexte dürfen keine parallele Navigation erzeugen.
3. `harbor/app/lib/academy-video-assets.js` ist die kanonische Video-Allowlist. Kandidaten werden erst nach Lektions-, Review- und Rolloutfreigabe aufgenommen.
4. `02_MASTER_INSTRUCTIONS.txt` ist die vollständige Masterprompt-Quelle. Die Kompaktversion ist ein abgeleitetes Format und kein zweiter Academy-Inhalt.
5. `DE-ppm-testgeraet-bedeutung-aussagegrenzen-approved-v2-20260805.mp4` ist der ausgewählte PPM-Batch-Kandidat; `Mxx-Lxx-DE-ppm-wert-bedeutung-approved-v1-20260801.mp4` bleibt `DUPLICATE`.
6. Historische Aqua-Präsentationen und der aktuelle Production-Katalog dürfen nicht parallel vollständig dargestellt werden. Einzelne, nachgeprüfte Aussagen können später in kanonische Lektionen überführt werden.

## Academy-Mapping A–L

| Bereich | belastbare lokale Quellen | Empfehlung |
|---|---|---|
| A Onboarding | `UX_ONBOARDING_BLUEPRINT.md`, Academy-Roadmap, Partnerregistrierungsvideo, Water Business Blueprint | 24h-/7-Tage-Startpfad ausarbeiten; Willkommensvideo neu produzieren; aggressive Einkommensaussagen entfernen |
| B Produkte | Your World, Preislisten, RXT-Präsentation, fünf neue Produktvideos | Mini Touch als konsolidierten Lernpfad entscheiden; Untertisch und Sparkling Pro als eigene Produktlektionen prüfen |
| C Wasserwissen | fünf Grundlagenvideos, Umkehrosmose, PPM, Testlaborvideos, Wasserpräsentation | bestehende kanonische Lektionen behalten; Claims und veraltete Quellen fachlich prüfen |
| D Vertrieb | Kundenbestellung, Content-Factory-Standard, Aqua Product Intelligence, historische Präsentationen | Bedarfsermittlung, Demo, Einwand, Abschluss und Follow-up als neue didaktische Sequenz erstellen |
| E Recruiting | Partnerregistrierung, Partnerschaftsvorteile-PDF, Water Business Blueprint | Rohmaterial vorhanden, aber Einkommens-/Lifestyle-Claims und fehlende Nachweise blockieren direkte Veröffentlichung |
| F Marketing / Social | Content Factory Standard/Skill, Media-Center-Kategorien | sofort als Arbeitsblatt/SOP nutzbar; konkrete Plattformvorlagen fehlen |
| G KI & Tools | Masterprompt, drei Prompt-Workflows, Leonid-OS-Sicherheitsmuster | kuratierte Partner-Workflows statt Entwicklerausbildung; Masterprompt nicht als ungeordnete Bibliothek veröffentlichen |
| H Leadership | KPI-Register, Operating Rules, Leonid-OS-Priorisierung | gute Frameworks, aber partner-/teambezogene Übungen und Gesprächsleitfäden fehlen |
| I Business | KPI, Opportunity Audit, Fokus-/Systemprinzipien | als Growth/Global-Excellence-Mikromodule nutzbar; sensible interne Zahlen entfernen |
| J Global Excellence | Markenstandard, Content Factory, Opportunity Audit, Systemprinzipien | erste vier Bereiche teilweise befüllbar; Rhetorik, Storytelling und Service brauchen eigenständige Praxisinhalte |
| K Growth Center | drei Prompt-Workflows, Content Factory, Produktwissen, KPI | beste Heimat für Vorlagen, Masterprompts und fortgeschrittene Systeme |
| L Media Center | lokaler Telegram-Materialbestand und vorhandene UI-Kategorien | keine Medien kopieren; verifizierten externen Katalog mit Vorschau, Beschreibung und Rechte-/Versionsstatus aufbauen |

## Masterprompt Library – kuratierte Zielstruktur

Die vorhandene Vollversion ist ein interner Steuerungsprompt, keine partnerfertige Copy-Paste-Bibliothek. Aus ihr und den drei Workflows lassen sich folgende Kategorien ableiten:

| Kategorie | vorhandener Kern | späteres Academy-Format | Reife |
|---|---|---|---|
| Recruiting | Partneraufbau-/Aqua-Routing, Opportunity Audit | Zielgruppe, Ansprache, Review-Gate, Beispiel | DRAFT |
| Sales | Aqua Product Intelligence, Beratungslogik | Bedarfsanalyse, Demo, Einwand, Follow-up | READY_WITH_REVIEW |
| Kundenberatung | Aqua-Wissensrahmen | Fakten/Annahmen trennen, nächste Handlung | READY_WITH_REVIEW |
| Follow-up | Leonid-OS Lead Intelligence / Draft-only | Zeitpunkt, Kanal, Text, Stop-Regel | DRAFT |
| Social Media | Content Factory | Hook, Skript, Visual, CTA, KPI | READY |
| Content | Content Factory Standard/Skill | vollständiger Produktionsworkflow | READY |
| Bild | nur allgemeine Pflichtfelder | Zweck, Prompt, Markencheck, Rechtecheck | DRAFT |
| Video | Content Factory + Production Studio | Skript, Shotplan, CTA, Exportcheck | READY_WITH_REVIEW |
| Präsentationen | historische Aqua-Decks und Produktionsstandard | Struktur, Story, Quellenstand | NEEDS_CONTENT_REWORK |
| WhatsApp | einzelne CTA-/Statusideen, keine vollständige Wissensbasis | Prompt + Human-Handoff + Datenschutz | DRAFT |
| KI-Agenten | Leonid-OS Architektur und Safety-Muster | Grundlagen und sichere Anwendungsgrenzen | REFERENCE_ONLY |
| Leadership | KPI-/Priorisierungsframeworks | Teamgespräch, Wochenreview, Coaching | DRAFT |
| Business | Opportunity Audit, Operating Rules | Scorecard, 7-/30-Tage-Test, KPI | READY |

Jeder spätere Eintrag benötigt: Titel, Zweck, Einsatzzeitpunkt, Copy-Paste-Prompt, Anwendung, Beispiel, Schwierigkeitsgrad, Sprache und Version. Eine einzige große hardcodierte UI-Komponente ist ausdrücklich nicht empfohlen.

## WhatsApp-KI-Agent – Evidenzcheck

Es existiert lokal kein vollständiges WhatsApp-Agent-Projekt und keine freigegebene Wissensbasis. Deshalb ist das Modul insgesamt `DRAFT`.

| geplanter Abschnitt | lokale Evidenz | Bewertung |
|---|---|---|
| Grundlagen / Profil | Markenstandard, Leonid-OS Agentenprinzipien | PARTIAL |
| Wissensbasis / Produktberatung | Aqua-Wissensrahmen, Your World, Product Intelligence | PARTIAL; Faktenreview erforderlich |
| Preise / Rabattcode / Aktionen | aktuelle PDFs und Campaign Blueprint | PARTIAL; niemals Prompt als Preisquelle verwenden |
| Bestellweg / Service | Kundenbestellungsvideo, RXT-/Wartungsmaterial | PARTIAL |
| Einwandbehandlung / Follow-up | Water Business Blueprint, Lead-Intelligence-Drafts | LOW; Claims und Datenschutz prüfen |
| Recruiting | Partnerregistrierung und Partnerschaftsvorteile | LOW; Compliance-Blocker |
| Terminvereinbarung | Booking UI und Leonid-OS Kalenderkonzept | REFERENCE_ONLY |
| Übergabe an Menschen / 24/7 | Approval-/Risk-Muster | PARTIAL; verbindliche Handoff-Regeln fehlen |
| Tests und Optimierung | Content Factory KPI und Leonid-OS Tests | PARTIAL |

Kein Abschnitt ist ohne fachliche, Datenschutz- und operative Review vollständig `READY`.

## AI-/Business-Inhalte: Partnerrelevanz

- Übernehmen: Prompt-Grundlagen, Fakten-vs.-Annahmen, Content Factory, Product Intelligence, Opportunity Audit, KPI- und Wochenreview, sichere Draft-/Approval-Logik.
- Vereinfachen: AI Agents, Automationen, Voice, RLS, Realtime und Tool-Routing nur als verständliche Nutzen-/Sicherheitsgrundlagen.
- Nicht übernehmen: Next.js-/TypeScript-Architektur, WebRTC-Implementierung, Token-Routen, Test-Frameworks und interne Agenten-Codeausbildung.
- Nicht offenlegen: interne Business-Kennzahlen, personenbezogene Kontaktangaben, Rabattcode, Secrets oder projektspezifische Sicherheitsdetails.

## PDFs, Books und Guides

- Production-PDFs: vermutlich offizielle Aqua-Unterlagen, aber Nutzungsrecht, Aktualität und Zielgruppensichtbarkeit müssen je Version dokumentiert bleiben. Preis-/Provisionsdokumente nur geschützt und datiert verwenden.
- Water Business Blueprint: als eigenes Material bezeichnet, aber enthält personenbezogene Kontaktangaben, starke Einkommens-/Freiheitspositionierung und unvollständig gerenderte Zeichen. Nur als Rohquelle nach Rework.
- `InfoLeitungswasser.pdf`: Autor-/Rechte- und Aktualitätslage offen; historische Studien- und Gesundheitsclaims. Nur Referenz, keine Vollkopie.
- Historische Aqua-Präsentationen: sichtbare Copyright-Hinweise, alte Quellen und mögliche Widersprüche. Keine vollständige Übernahme; nur nach Rechte- und Faktenprüfung zusammenfassen.
- Leihvertrag: kein Lerninhalt; rechtliche Prüfung vor jeder operativen Vorlage.

## Sichtbare Placeholder- und Empty-State-Inventur

| sichtbarer Bereich | Placeholder / Lücke | passender lokaler Content? | Entscheidung / TODO |
|---|---|---|---|
| Modul 1 | Willkommensvideo `academy-welcome-placeholder` | nein, kein eindeutiges freigegebenes Welcome-Asset | neues kurzes P0-Video produzieren |
| Startcenter | Academy-Erklärung | UX-Blueprint beschreibt Inhalt, kein Video | Skript aus Blueprint erstellen, danach produzieren |
| Modul 7 | RXT-Schulungsvideo `rxt-training-placeholder` | RXT-PDF vorhanden, kein passendes Video | PDF als Basis für Skript; Video fachlich freigeben |
| Downloads: Recruiting | keine Datei | Recruiting-Rohmaterial vorhanden | geprüfte Checkliste statt altes Voll-PDF erstellen |
| Downloads: Social Media | keine Datei | Content Factory vorhanden | 1-seitige Content-Checkliste ableiten |
| Growth Center | Marketing/Sales/Recruiting/Social/KI/Leadership weitgehend UI-only | mehrere Frameworks vorhanden | in kleinen kuratierten Ressourcen-Sprints befüllen |
| Global Excellence | acht Kategorien „In Vorbereitung“ | Systeme, Business, Content und Marke teilweise vorhanden | zunächst 3–4 Mikromodule; Rest als TODO belassen |
| Media Center | 14 Kategorien, teils nur Telegram-Platzhalter oder ohne Link | lokaler begrenzter Telegram-Bestand | externen Katalog prüfen; keine Medien kopieren |
| Mini Touch / Basic / Sparkling Pro | keine kanonischen Lektionen | fünf geprüfte Batch-Videos vorhanden | Lektionsarchitektur entscheiden, keine Doppelkarte |
| Sales | nur Bestellprozess, kein vollständiger Funnel | Frameworks vorhanden | Bedarf → Demo → Einwand → Abschluss → Follow-up entwickeln |
| Recruiting | nur Registrierungsprozess | Rohmaterial vorhanden | Ansprache/Qualifizierung/Onboarding mit Compliance-Review erstellen |
| Leadership | kein kanonisches Academy-Modul | KPI/Operating Rules vorhanden | Leader-only Mikromodul und Übungen erstellen |
| WhatsApp KI-Agent | kein Modul | Teilquellen vorhanden | Wissensbasis, Datenschutz, Human-Handoff und Tests zuerst |

## Qualitäts- und Compliance-Regeln

Vor jeder Veröffentlichung müssen Quelle, Eigentümer/Nutzungsrecht, Versionsdatum, fachlicher Reviewer, Zielgruppe, Sichtbarkeit und Ablaufdatum dokumentiert werden. Besondere Review-Pflicht gilt für:

- Gesundheit, Körper, Schadstoffe, Grenzwerte, Filterleistung und „bis zu“-Claims;
- Einkommen, Provision, Bonus, Karriere, Lifestyle und Erfolgsversprechen;
- Preise, Aktionen, Rabatte, Produktvarianten, Wartungsintervalle und technische Daten;
- fremde Zitate, Studien, Bilder, Musik, Marken und vollständige Schulungsunterlagen;
- personenbezogene Kontaktdaten, Verträge und interne Business-Kennzahlen.

## Nicht durchgeführt

Keine Lektion wurde erstellt, veröffentlicht oder überschrieben. Keine UI-, Datenbank-, Supabase-, R2-, Navigations-, Auth-, Progress-, Quiz- oder Partnerdatenänderung wurde vorgenommen. Keine Binärdatei wurde kopiert, umbenannt, hochgeladen oder gelöscht. Es wurden keine Dependencies installiert und kein Deployment ausgelöst.
