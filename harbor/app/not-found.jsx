import Link from 'next/link';

export const metadata = {
  title: 'Seite nicht gefunden | Harbor Global Partner Academy',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen max-w-full overflow-x-hidden bg-[#080808] px-4 py-10 text-white sm:px-6 md:px-10">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(47,94,137,0.18),transparent_30%)]" />
      <section className="relative mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center">
        <div className="rounded-[2rem] border border-yellow-300/20 bg-black/45 p-6 shadow-2xl shadow-yellow-500/10 backdrop-blur-xl md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-300">404</p>
          <h1 className="mt-3 break-words text-4xl font-black md:text-6xl">Seite nicht gefunden</h1>
          <p className="mt-5 break-words leading-relaxed text-white/75">
            Die angeforderte Seite ist nicht erreichbar. Du kannst zur Academy zurückkehren oder die rechtlichen Informationen direkt öffnen.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-yellow-300/25 bg-yellow-400/10 px-5 py-3 text-sm font-bold text-yellow-100 transition hover:border-yellow-200/60 hover:bg-yellow-400/20"
            >
              Zur Academy
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
            <Link
              href="/nutzungsbedingungen"
              className="inline-flex items-center rounded-full border border-white/10 bg-black/25 px-5 py-3 text-sm font-bold text-white/70 transition hover:border-yellow-200/50 hover:bg-yellow-400/10 hover:text-yellow-100"
            >
              Nutzungsbedingungen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
