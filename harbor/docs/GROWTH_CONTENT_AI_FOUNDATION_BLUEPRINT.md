# P4 Growth Content & AI Tools Foundation Blueprint

Stand: 20. August 2026
Status: Implementierter Release-Kandidat, noch nicht committed oder deployed

## Ziel

P4 führt Harbor-Partner in einem einfachen, mobilen Lernpfad von einer Idee zu geprüftem Content:

`IDEA → SCRIPT → CONTENT → PRODUCE → PUBLISH → FOLLOW UP → ANALYZE → IMPROVE`

Es entsteht keine professionelle Filmstudio-Ausbildung und keine parallele Content-Plattform. Der vorhandene Growth Center wird modular erweitert: P4 vermittelt das Lernen, bestehende Hubs unterstützen später die Anwendung.

## Content Harvest

Tatsächlich geprüft wurden die lokal vorhandenen Quellen aus:

1. Harbor Global Partner Academy Main-Repository;
2. separat vorhandener Harbor Security-Worktree, ausschließlich zur Abgrenzung und ohne Veränderung;
3. lokalem Leonid-OS-Repository, ausschließlich read-only;
4. lokalem GPT-/Knowledge-Pack in `Downloads/gpts`;
5. den bereits inventarisierten Aqua-Academy-Dokumenten, Wasser-/Business-Unterlagen, Legacy-Snapshot-, Telegram- und Präsentationssammlungen aus dem bestehenden Academy Content Harvest.

Es wurde kein separates lokal zugängliches Repository für Aqua Global, Leonid AI Automation, Leonid AI Business Academy, CONEXIAL, eine eigenständige Content Factory oder einen WhatsApp-KI-Agenten gefunden. Solche Projekte werden daher nicht als vollständig geprüft behauptet. Vorhandene Konzept- und Knowledge-Dateien wurden nur in ihrem tatsächlich verfügbaren Umfang bewertet.

## Wiederverwendete Grundlagen

- `docs/ACADEMY_CONTENT_HARVEST.md`, Registry, Gap Analysis und Ready Content Plan;
- Leonid Content Factory Qualitäts- und Produktionsstandard;
- Marken- und Kommunikationsstandard;
- `docs/ACADEMY_PRODUCTION_STUDIO.md`;
- `docs/MEDIA_CENTER_BLUEPRINT.md`;
- `docs/CAMPAIGN_CENTER_BLUEPRINT.md`;
- P1 Modul 3 als kanonische Produktquelle;
- P2 als kanonische Wasser- und Claim-Quelle;
- P3 als kanonische Sales-/Recruiting-Quelle.

Interne Master Instructions und Leonid-OS-Implementierungsdetails sind nur `REFERENCE_ONLY` beziehungsweise `INTERNAL_ONLY`. Sie werden nicht als vollständige Partner-Prompts veröffentlicht.

## Lernarchitektur

P4 besteht aus acht kleinen, auswählbaren Einheiten:

1. Content-Grundlagen: Zielgruppe, Problem, Content-Pillar, CTA;
2. Content Factory: eine Idee in mehrere kanalgerechte Formate überführen;
3. Prompt Basics: Kontext, Ziel, Zielgruppe, Aufgabe, Format, Grenzen;
4. AI Content Safety: Quelle, Entwurf, Faktenprüfung, Freigabe;
5. Short-form Video: Hook, Value, CTA;
6. Production: Smartphone, Licht, Ton, Bild und natürliche Aufnahme;
7. Publishing: vorbereiten, veröffentlichen, Follow-up, analysieren, verbessern;
8. AI Tools: kleine Kategorien für Text, Ideen, Bilder, Video und Organisation.

Die Einheiten werden im bestehenden Growth Center angezeigt. Es gibt kein neues Navigationsziel, kein neues Academy-Modul, keine zweite Fortschrittsberechnung und keine Zertifikatsabhängigkeit.

## Content Factory und Content Package Light

Eine bestätigte Idee kann angepasst werden zu:

- Reel;
- Story;
- Post;
- WhatsApp Status;
- Follow-up-Impuls.

Das Partnerformat reduziert den internen Full-Content-Package-Standard auf:

`Hook · Script · On-Screen Text · Caption · CTA · Keywords · Cover Idea`

Komplexe Produktionsparameter, Automationen und interne KPI-Systeme bleiben außerhalb P4.

## Kuratierte Prompt Library

Die Library enthält acht Vorlagen:

- drei Content-Ideen;
- Social Post;
- Reel-Skript;
- Story-Sequenz;
- Produkt einfach erklären;
- Kunden-FAQ;
- respektvolles Follow-up;
- ehrliche Business-Story.

Jede Vorlage besitzt ID, Zweck, Kategorie, Schwierigkeit, Prompt und Compliance-Status. Produkt- und FAQ-Vorlagen verlangen bestätigte kanonische Fakten. Die Business-Story verbietet Income-/Karrieregarantien. Alle Vorlagen verbieten erfundene Fakten und lassen fehlende Angaben ausdrücklich offen.

Copy-to-Clipboard nutzt die vorhandene Browser-API ohne Dependency, Speicherung oder Serveraufruf. Erfolg beziehungsweise Fehler wird barrierearm über einen `aria-live`-Status kommuniziert.

## AI Safety

Der zentrale Ablauf lautet:

1. kanonische Quelle wählen;
2. KI-Entwurf erzeugen;
3. konkrete Aussagen prüfen;
4. nur zulässigen Inhalt veröffentlichen.

KI darf keine Preise, Rabatte, Aktionen, Produktwerte, Gesundheitswirkungen, Zertifikate, Provisionen oder Karrierelevel erfinden. Persönliche, Kunden- und Partnerdaten gehören nicht in Prompt-Vorlagen.

## Kanonische Grenzen und Deduplication

| Inhalt | Kanonischer Ort | P4-Nutzung |
|---|---|---|
| Produktfakten | Modul 3 | Verweis und Content-Workflow |
| Wasserfakten | P2 Water Knowledge | Verweis und Safety-Grenze |
| Beratung / Follow-up | P3 Sales | Anwendungs-Template, keine Vollkopie |
| Recruiting | P3 Recruiting | Story-Template, keine Vollkopie |
| Aktionen / Preise | Campaign Center | Keine festen Werte in P4 |
| Freigegebene Assets | Media Center | Keine zweite Media Library |
| Anwendung / Entwicklung | Growth Center | Bestehender Ort der P4-Komponente |
| AI Content Education | P4 | Kanonischer Lerninhalt |

Hydrogen Bottle bleibt `OFFICIAL_SOURCE_REQUIRED`. Historische Wasser- oder Health Claims werden nicht reaktiviert.

## Production und Publishing

Die partnerfreundliche Production-Lektion empfiehlt keine Hardware-Kaufliste. Sie konzentriert sich auf Smartphone-Stabilität, Licht von vorn, verständlichen Ton, ruhigen Hintergrund, Blick zur Kamera und kurze natürliche Sprache.

Publishing behandelt Instagram, TikTok, YouTube Shorts und WhatsApp Status nur als Lernkontext. Es gibt keine API-Integration, Veröffentlichung, Scheduler- oder Analytics-Anbindung.

## Content Routine und Praxis

Die UI zeigt die einfache Routine:

`IDEA → PREPARED → CREATED → READY → PUBLISHED`

Sechs Übungen sind UI-only:

- drei Content-Ideen;
- ein Hook;
- ein Reel-Skript;
- eine Story-Sequenz;
- ein Produktpost auf Basis von Modul 3;
- eine einfache Content-Woche.

Es wird keine neue Task-Persistenz oder zweite Fortschrittsquelle eingeführt.

## Growth-, Media- und Campaign-Center Boundary

- Academy/P4: lernen und sicher vorbereiten;
- Growth Center: anwenden und weiterentwickeln;
- Media Center: freigegebene Assets;
- Campaign Center: aktuelle Aktionen, Bedingungen und Preise.

Die Komponente verweist sprachlich auf diese Grenzen. Sie speichert keine Favoriten, Content-Pläne oder Prompts und baut keine externe Integration.

## International / Global Excellence

Global Excellence bleibt unverändert. Spätere fortgeschrittene Themen können dort abstrahierte Prinzipien zu Storytelling, Markenführung, Präsentation, kreativer Strategie und internationaler Lokalisierung behandeln. Geschützte Inhalte oder Markenbeispiele von Apple, Nike, Disney oder anderen Unternehmen dürfen nicht kopiert werden.

## Spätere Automationen

Außerhalb P4 bleiben:

- persistenter Content Calendar;
- Freigabe- und Review-Workflow;
- automatische Veröffentlichung;
- kanalübergreifende Analytics;
- personalisierte Prompt-Speicherung;
- WhatsApp-KI-Agent;
- AI-Agent- und Content-Factory-Automationen.

Jede spätere Automation benötigt eine eigene Auth-, Datenschutz-, Berechtigungs-, Audit- und Rollback-Prüfung.

## Offene Content-Lücken

- freigegebene aktuelle Produkt-Fact-Sheets als maschinenlesbare Quelle;
- rechtlich freigegebene Social-Proof-Beispiele;
- konkrete, rechtegeprüfte DE/EN Plattformbeispiele;
- länder- und kanalspezifische Direktmarketingregeln;
- freigegebene Bild-/Video-Vorlagen im Media Center;
- definierte Content-KPI- und Review-Routine;
- vollständiges WhatsApp-KI-Agent-Modul;
- Advanced Content Library für Global Excellence.

## Rollback

P4 verändert weder Daten noch Infrastruktur. Ein späterer Release kann durch Revert des einzelnen P4-Commits vollständig zurückgenommen werden. Bestehende Module, Video-Mappings, Auth, R2, P0–P3, Campaign Center, Media Center und Global Excellence bleiben unverändert.
