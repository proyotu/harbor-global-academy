import Link from 'next/link';

export const metadata = {
  title: 'Impressum | Harbor Global Partner Academy',
  description: 'Impressum der Harbor Global Partner Academy',
};

const sections = [
  {
    title: 'Angaben gemäß § 5 DDG',
    lines: [
      'Leonid Curos',
      'Bunsenweg 19',
      '82538 Geretsried',
      'Deutschland',
    ],
  },
  {
    title: 'Kontakt',
    lines: [
      'Telefon: +49 1522 7370000',
      'E-Mail: leonid.curos.ag@gmail.com',
    ],
  },
  {
    title: 'Gewerbe',
    lines: ['Leonid Curos'],
  },
  {
    title: 'Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV',
    lines: [
      'Leonid Curos',
      'Bunsenweg 19',
      '82538 Geretsried',
    ],
  },
];

const notices = [
  {
    title: 'Haftung für Inhalte',
    paragraphs: [
      'Die Harbor Global Partner Academy ist ein geschlossener Schulungs- und Informationsbereich für registrierte Vertriebspartner. Die bereitgestellten Inhalte dienen ausschließlich Schulungs-, Informations- und Unterstützungszwecken.',
      'Eine Garantie für bestimmte geschäftliche Ergebnisse, Umsätze, Provisionen oder persönliche Erfolge wird nicht übernommen.',
    ],
  },
  {
    title: 'Haftung für externe Links',
    paragraphs: [
      'Diese Academy kann Links zu externen Diensten und Webseiten enthalten. Für Inhalte externer Seiten sind ausschließlich deren Betreiber verantwortlich.',
      'Externe Links werden bei Aufnahme geprüft. Eine permanente inhaltliche Kontrolle verlinkter Seiten ist ohne konkrete Hinweise auf Rechtsverletzungen nicht zumutbar.',
    ],
  },
  {
    title: 'Urheberrecht / Copyright',
    paragraphs: [
      'Die in der Academy bereitgestellten Inhalte, Texte, Grafiken, Videos, Unterlagen, Downloads und Layouts sind urheberrechtlich geschützt, soweit sie nicht ausdrücklich anders gekennzeichnet sind.',
      'Eine Weitergabe, Veröffentlichung, Vervielfältigung oder kommerzielle Nutzung außerhalb der Harbor Global Partner Academy ist ohne vorherige Zustimmung nicht gestattet. Rechte Dritter bleiben unberührt.',
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
        href="/datenschutz"
        className="inline-flex items-center rounded-full border border-white/10 bg-black/25 px-5 py-3 text-sm font-bold text-white/70 transition hover:border-yellow-200/50 hover:bg-yellow-400/10 hover:text-yellow-100"
      >
        Datenschutz
      </Link>
      <Link
        href="/nutzungsbedingungen"
        className="inline-flex items-center rounded-full border border-white/10 bg-black/25 px-5 py-3 text-sm font-bold text-white/70 transition hover:border-yellow-200/50 hover:bg-yellow-400/10 hover:text-yellow-100"
      >
        Nutzungsbedingungen
      </Link>
    </div>
  );
}

export default function ImpressumPage() {
  return (
    <main className="min-h-screen max-w-full overflow-x-hidden bg-[#080808] px-4 py-10 text-white sm:px-6 md:px-10">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(47,94,137,0.18),transparent_30%)]" />
      <section className="relative mx-auto max-w-4xl">
        <LegalNav />

        <div className="mt-10 rounded-[2rem] border border-yellow-300/20 bg-black/45 p-5 shadow-2xl shadow-yellow-500/10 backdrop-blur-xl sm:p-6 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-300">
            Harbor Global Partner Academy
          </p>
          <h1 className="mt-3 break-words text-4xl font-black md:text-6xl">Impressum</h1>

          <div className="mt-10 grid gap-6">
            {sections.map((section) => (
              <article key={section.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <h2 className="break-words text-xl font-bold text-yellow-100">{section.title}</h2>
                <div className="mt-4 space-y-1 break-words text-white/75">
                  {section.lines.map((line) => (
                    <p key={line}>
                      {line.startsWith('E-Mail:') ? (
                        <>
                          E-Mail:{' '}
                          <a className="text-yellow-200 underline-offset-4 hover:underline" href="mailto:leonid.curos.ag@gmail.com">
                            leonid.curos.ag@gmail.com
                          </a>
                        </>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-6">
            {notices.map((notice) => (
              <article key={notice.title} className="rounded-3xl border border-yellow-300/20 bg-yellow-400/10 p-5">
                <h2 className="break-words text-xl font-bold text-yellow-100">{notice.title}</h2>
                <div className="mt-4 space-y-3 break-words leading-relaxed text-white/75">
                  {notice.paragraphs.map((paragraph) => (
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
