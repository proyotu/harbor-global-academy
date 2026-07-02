import Link from 'next/link';

export const metadata = {
  title: 'Datenschutzerklärung | Harbor Global Partner Academy',
  description: 'Datenschutzerklärung der Harbor Global Partner Academy',
};

const sections = [
  {
    title: '1. Verantwortlicher',
    paragraphs: [
      'Leonid Curos',
      'Bunsenweg 19',
      '82538 Geretsried',
      'Deutschland',
      'Telefon: +49 1522 7370000',
    ],
    email: true,
  },
  {
    title: '2. Zwecke der Datenverarbeitung',
    paragraphs: ['Im Rahmen der Harbor Global Partner Academy werden personenbezogene Daten verarbeitet, um:'],
    items: [
      'Registrierungen zu prüfen und Partnerkonten bereitzustellen',
      'den geschützten Academy-Zugang technisch abzusichern',
      'Schulungsinhalte, Module, Downloads und Community-Funktionen bereitzustellen',
      'Termine und Supportanfragen zu organisieren',
      'gesetzliche Pflichten und berechtigte Sicherheitsinteressen zu erfüllen',
    ],
  },
  {
    title: '3. Verarbeitete Daten',
    paragraphs: ['Je nach Nutzung können insbesondere folgende Daten verarbeitet werden:'],
    items: [
      'Vor- und Nachname',
      'E-Mail-Adresse',
      'Telefonnummer',
      'Stadt und freiwillige Profildaten',
      'Rabattcode und Partnerstatus',
      'Login- und Sitzungsdaten',
      'Profilbild und hochgeladene Dateien',
      'Kommunikationsinhalte aus Support- oder Community-Funktionen',
      'technische Zugriffsdaten, soweit sie für Betrieb und Sicherheit erforderlich sind',
    ],
  },
  {
    title: '4. Rechtsgrundlagen',
    paragraphs: ['Die Verarbeitung erfolgt je nach Vorgang insbesondere auf folgenden Grundlagen:'],
    items: [
      'Art. 6 Abs. 1 lit. b DSGVO für Registrierung, Partnerkonto und Academy-Nutzung',
      'Art. 6 Abs. 1 lit. a DSGVO, wenn eine ausdrückliche Einwilligung erforderlich ist',
      'Art. 6 Abs. 1 lit. f DSGVO für Sicherheit, Missbrauchsprävention, Support und technische Stabilität',
      'Art. 6 Abs. 1 lit. c DSGVO, soweit gesetzliche Pflichten bestehen',
    ],
  },
  {
    title: '5. Hosting, Empfänger und Dienstleister',
    paragraphs: ['Die Plattform wird technisch mit folgenden Dienstleistern betrieben oder verbunden:'],
    items: [
      'Vercel für Hosting und Serverless-Funktionen',
      'Supabase für Datenbank und Storage',
      'Resend für transaktionale E-Mails, sofern E-Mail-Versand genutzt wird',
      'Calendly für Terminbuchungen',
      'Instagram und externe Partnerseiten, wenn Nutzer externe Links öffnen',
    ],
    closing:
      'Eine Weitergabe erfolgt nur, soweit dies für Betrieb, Vertragserfüllung, Sicherheit oder gesetzliche Pflichten erforderlich ist.',
  },
  {
    title: '6. Drittlandübermittlungen',
    paragraphs: [
      'Einige technische Dienstleister können Daten außerhalb der Europäischen Union oder des Europäischen Wirtschaftsraums verarbeiten. Soweit erforderlich, werden geeignete Garantien wie Standardvertragsklauseln oder vergleichbare Schutzmechanismen der Anbieter genutzt.',
      'Bei externen Links, insbesondere zu Calendly, Instagram oder Partnerportalen, gelten zusätzlich die Datenschutzinformationen der jeweiligen Anbieter.',
    ],
  },
  {
    title: '7. Cookies, Local Storage und Endgerätezugriff',
    paragraphs: [
      'Die Academy verwendet derzeit keine Google-Analytics- oder Marketing-Tracking-Cookies.',
      'Für den geschützten Academy-Betrieb werden technisch notwendige oder ausdrücklich gewünschte Speicherfunktionen im Browser genutzt, zum Beispiel für Session-Token, Spracheinstellungen, Audio-/Anzeigepräferenzen und sichtbare UI-Zustände.',
      'Diese Speicherung dient der Bereitstellung des Login-geschützten Academy-Zugangs und der vom Nutzer angeforderten Funktionen. Nicht notwendige Analyse- oder Marketing-Cookies dürfen erst nach gesondertem Hinweis und, soweit erforderlich, Einwilligung eingesetzt werden.',
    ],
  },
  {
    title: '8. Speicherdauer',
    paragraphs: [
      'Personenbezogene Daten werden nur so lange gespeichert, wie dies für den jeweiligen Zweck erforderlich ist, ein berechtigtes Interesse besteht oder gesetzliche Aufbewahrungspflichten gelten.',
      'Partnerkonten und zugehörige Daten können nach Ende der Nutzung oder auf berechtigte Anfrage gelöscht oder eingeschränkt werden, sofern keine gesetzlichen Pflichten entgegenstehen.',
    ],
  },
  {
    title: '9. Rechte der betroffenen Personen',
    paragraphs: ['Betroffene Personen haben nach Maßgabe der gesetzlichen Voraussetzungen insbesondere das Recht auf:'],
    items: [
      'Auskunft',
      'Berichtigung',
      'Löschung',
      'Einschränkung der Verarbeitung',
      'Datenübertragbarkeit',
      'Widerspruch gegen bestimmte Verarbeitungen',
      'Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft',
      'Beschwerde bei einer Datenschutzaufsichtsbehörde',
    ],
    closing: 'Anfragen können an folgende Adresse gerichtet werden:',
    emailOnly: true,
  },
  {
    title: '10. Pflicht zur Bereitstellung',
    paragraphs: [
      'Für Registrierung, Freigabe und geschützte Academy-Nutzung sind bestimmte Angaben erforderlich. Ohne diese Angaben kann ein Partnerkonto möglicherweise nicht erstellt oder genutzt werden.',
      'Freiwillige Angaben, zum Beispiel optionale Profilinformationen, sind für den Zugang nur erforderlich, wenn sie ausdrücklich als Pflichtfeld gekennzeichnet sind.',
    ],
  },
  {
    title: '11. Keine automatisierte Entscheidungsfindung',
    paragraphs: [
      'Eine automatisierte Entscheidungsfindung einschließlich Profiling im Sinne von Art. 22 DSGVO findet in der Academy derzeit nicht statt.',
    ],
  },
  {
    title: '12. Änderungen',
    paragraphs: [
      'Diese Datenschutzerklärung kann angepasst werden, wenn technische, organisatorische oder rechtliche Änderungen dies erforderlich machen.',
      'Stand: 25. Juni 2026',
    ],
  },
];

function EmailLink() {
  return (
    <a className="text-yellow-200 underline-offset-4 hover:underline" href="mailto:leonid.curos.ag@gmail.com">
      leonid.curos.ag@gmail.com
    </a>
  );
}

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
        href="/nutzungsbedingungen"
        className="inline-flex items-center rounded-full border border-white/10 bg-black/25 px-5 py-3 text-sm font-bold text-white/70 transition hover:border-yellow-200/50 hover:bg-yellow-400/10 hover:text-yellow-100"
      >
        Nutzungsbedingungen
      </Link>
    </div>
  );
}

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen max-w-full overflow-x-hidden bg-[#080808] px-4 py-10 text-white sm:px-6 md:px-10">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(47,94,137,0.18),transparent_30%)]" />
      <section className="relative mx-auto max-w-4xl">
        <LegalNav />

        <div className="mt-10 rounded-[2rem] border border-yellow-300/20 bg-black/45 p-5 shadow-2xl shadow-yellow-500/10 backdrop-blur-xl sm:p-6 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-300">
            Harbor Global Partner Academy
          </p>
          <h1 className="mt-3 break-words text-4xl font-black md:text-6xl">Datenschutzerklärung</h1>

          <div className="mt-10 grid gap-6">
            {sections.map((section) => (
              <article key={section.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                <h2 className="break-words text-xl font-bold text-yellow-100">{section.title}</h2>
                <div className="mt-4 space-y-3 break-words leading-relaxed text-white/75">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.email && (
                    <p>
                      E-Mail: <EmailLink />
                    </p>
                  )}
                  {section.items && (
                    <ul className="list-disc space-y-2 pl-5">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.closing && <p>{section.closing}</p>}
                  {section.emailOnly && (
                    <p>
                      <EmailLink />
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
