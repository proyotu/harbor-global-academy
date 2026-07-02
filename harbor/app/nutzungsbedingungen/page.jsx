import Link from 'next/link';

export const metadata = {
  title: 'Nutzungsbedingungen | Harbor Global Partner Academy',
  description: 'Nutzungsbedingungen der Harbor Global Partner Academy',
};

const sections = [
  {
    title: '1. Geltungsbereich',
    paragraphs: [
      'Die Harbor Global Partner Academy ist ein geschlossener Mitgliederbereich für registrierte und freigegebene Vertriebspartner.',
      'Diese Nutzungsbedingungen regeln den Zugang und die Nutzung der Academy-Inhalte, Community-Funktionen und Downloads.',
    ],
  },
  {
    title: '2. Zugang',
    paragraphs: [
      'Der Zugang erfolgt ausschließlich nach Registrierung und Freigabe durch den Administrator.',
      'Ein Anspruch auf Freischaltung besteht nicht. Zugangsdaten dürfen nicht an Dritte weitergegeben werden.',
    ],
  },
  {
    title: '3. Nutzung der Inhalte',
    paragraphs: [
      'Alle Schulungsunterlagen, Videos, Dokumente, Vorlagen, Chats, Downloads und Inhalte dienen ausschließlich der persönlichen Nutzung innerhalb der Partnerstruktur.',
      'Eine Weitergabe, Veröffentlichung, Vervielfältigung oder kommerzielle Verwertung außerhalb der Harbor Global Partner Academy ist ohne Zustimmung des Betreibers untersagt.',
    ],
  },
  {
    title: '4. Community-Bereich',
    paragraphs: [
      'Die Academy kann Community-Funktionen wie Chat, Fragen & Antworten, Kommentare oder Dateiuploads bereitstellen.',
    ],
    listIntro: 'Nicht erlaubt sind:',
    items: [
      'Spam',
      'Beleidigungen',
      'Diskriminierung',
      'rechtswidrige Inhalte',
      'Fremdwerbung',
      'unerlaubte Weitergabe von Zugangsdaten',
    ],
    closing: 'Der Betreiber kann rechtswidrige oder regelwidrige Inhalte entfernen und Nutzerkonten sperren.',
  },
  {
    title: '5. Haftung und fachliche Einordnung',
    paragraphs: [
      'Die bereitgestellten Inhalte dienen ausschließlich Informations- und Schulungszwecken.',
      'Es wird keine Garantie für bestimmte geschäftliche Ergebnisse, Umsätze, Provisionen oder persönliche Erfolge übernommen.',
      'Die Inhalte ersetzen keine medizinische, rechtliche, steuerliche oder finanzielle Beratung. Produkt-, Gesundheits- oder Business-Aussagen sind eigenverantwortlich zu prüfen und dürfen nicht als verbindliches Erfolgs- oder Heilversprechen verstanden werden.',
      'Jeder Partner handelt eigenverantwortlich.',
    ],
  },
  {
    title: '6. Urheberrecht und Vertraulichkeit',
    paragraphs: [
      'Academy-Inhalte, Layouts, Videos, Präsentationen, PDFs, Downloads und sonstige Materialien sind urheberrechtlich geschützt, soweit sie nicht ausdrücklich anders gekennzeichnet sind.',
      'Die Inhalte sind vertraulich zu behandeln und dürfen nicht öffentlich geteilt, kopiert, weiterverkauft oder außerhalb des geschlossenen Partnerbereichs veröffentlicht werden.',
      'Rechte Dritter an eingebundenen Produktinformationen, Marken, Bildern oder externen Materialien bleiben unberührt.',
    ],
  },
  {
    title: '7. Einwilligung für freiwillig bereitgestellte Schulungsinhalte',
    paragraphs: [
      'Mit der Nutzung der Harbor Global Partner Academy erklärt sich der Nutzer damit einverstanden, dass von ihm freiwillig bereitgestellte Inhalte innerhalb der Academy verwendet werden dürfen.',
      'Sofern ein Nutzer freiwillig Inhalte hochlädt oder zur Verfügung stellt, bestätigt er, dass er über die erforderlichen Rechte verfügt und der Verwendung innerhalb der Harbor Global Partner Academy zustimmt.',
    ],
    listIntro: 'Dies umfasst insbesondere:',
    items: [
      'Schulungsvideos',
      'Webinaraufzeichnungen',
      'eigene Schulungsbeiträge',
      'Präsentationen',
      'Sprachnachrichten',
      'Audioaufnahmen',
      'Dokumente',
      'Bilder',
      'Bildschirmaufnahmen',
      'Schulungsunterlagen',
    ],
    secondListIntro: 'Die Inhalte dürfen innerhalb des geschlossenen Partnerbereichs:',
    secondItems: [
      'gespeichert',
      'angezeigt',
      'wiedergegeben',
      'übersetzt',
      'kategorisiert',
      'für Schulungszwecke verwendet',
      'für Ausbildungszwecke innerhalb der Academy genutzt',
    ],
    closingParagraphs: [
      'Eine öffentliche Veröffentlichung außerhalb der Harbor Global Partner Academy erfolgt nicht ohne gesonderte Zustimmung des jeweiligen Urhebers.',
      'Der Nutzer kann die Löschung seiner eigenen Inhalte jederzeit beim Betreiber beantragen, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.',
      'Mit dem Upload von Schulungsinhalten bestätigt der Nutzer ausdrücklich seine Zustimmung zur Nutzung innerhalb der Harbor Global Partner Academy.',
    ],
  },
  {
    title: '8. Externe Dienste und Links',
    paragraphs: [
      'Die Academy kann auf externe Dienste, Partnerseiten, Social-Media-Profile oder Terminbuchungsseiten verlinken.',
      'Beim Öffnen externer Links gelten zusätzlich die Bedingungen und Datenschutzhinweise der jeweiligen Anbieter.',
    ],
  },
  {
    title: '9. Änderung und Verfügbarkeit',
    paragraphs: [
      'Der Betreiber kann Inhalte, Funktionen oder Zugänge jederzeit anpassen, erweitern oder entfernen.',
      'Ein Anspruch auf dauerhafte Verfügbarkeit besteht nicht.',
      'Stand: 25. Juni 2026',
    ],
  },
];

function LegalNav() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/"
        className="inline-flex items-center rounded-full border border-yellow-300/25 bg-black/30 px-5 py-3 text-sm font-bold text-yellow-100 transition hover:border-yellow-200/60 hover:bg-yellow-400/10"
      >
        Zurück zur Academy
      </Link>
      <Link
        href="/impressum"
        className="inline-flex items-center rounded-full border border-white/10 bg-black/25 px-5 py-3 text-sm font-bold text-white/70 transition hover:border-yellow-200/50 hover:bg-yellow-400/10 hover:text-yellow-100"
      >
        Impressum
      </Link>
      <Link
        href="/datenschutz"
        className="inline-flex items-center rounded-full border border-white/10 bg-black/25 px-5 py-3 text-sm font-bold text-white/70 transition hover:border-yellow-200/50 hover:bg-yellow-400/10 hover:text-yellow-100"
      >
        Datenschutz
      </Link>
    </div>
  );
}

export default function NutzungsbedingungenPage() {
  return (
    <main className="min-h-screen max-w-full overflow-x-hidden bg-[#080808] px-4 py-10 text-white sm:px-6 md:px-10">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(47,94,137,0.18),transparent_30%)]" />
      <section className="relative mx-auto max-w-4xl">
        <LegalNav />

        <div className="mt-10 rounded-[2rem] border border-yellow-300/20 bg-black/45 p-5 shadow-2xl shadow-yellow-500/10 backdrop-blur-xl sm:p-6 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-300">
            Harbor Global Partner Academy
          </p>
          <h1 className="mt-3 break-words text-4xl font-black md:text-6xl">Nutzungsbedingungen</h1>

          <div className="mt-10 grid gap-6">
            {sections.map((section) => (
              <article key={section.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <h2 className="break-words text-xl font-bold text-yellow-100">{section.title}</h2>
                <div className="mt-4 space-y-3 break-words leading-relaxed text-white/75">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.listIntro && <p>{section.listIntro}</p>}
                  {section.items && (
                    <ul className="list-disc space-y-2 pl-5">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.closing && <p>{section.closing}</p>}
                  {section.secondListIntro && <p>{section.secondListIntro}</p>}
                  {section.secondItems && (
                    <ul className="list-disc space-y-2 pl-5">
                      {section.secondItems.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.closingParagraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
