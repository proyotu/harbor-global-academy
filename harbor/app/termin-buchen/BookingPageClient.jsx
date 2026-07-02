'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe2,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

const CALENDLY_PROFILE_URL = 'https://calendly.com/leonid-curos-ag';
const CALENDLY_THEME_QUERY = 'hide_gdpr_banner=1&background_color=050505&text_color=ffffff&primary_color=d4af37';

const CALENDLY_EVENT_URLS = {
  firstCall: '',
  waterConsultation: '',
  partnerInfo: '',
  academySupport: `${CALENDLY_PROFILE_URL}/academy-support`,
};

const appointmentTypes = [
  {
    id: 'firstCall',
    title: 'Kostenloses Erstgespr\u00e4ch',
    duration: '15 Minuten',
    text: 'Erstes Kennenlernen, Fragen kl\u00e4ren und Orientierung erhalten.',
    icon: CheckCircle2,
    calendlyUrl: CALENDLY_EVENT_URLS.firstCall,
  },
  {
    id: 'waterConsultation',
    title: 'Aqua Global Wasserberatung',
    duration: '30 Minuten',
    text: 'Pers\u00f6nliche Beratung zu Wasserqualit\u00e4t, Ger\u00e4ten und L\u00f6sungen.',
    icon: ShieldCheck,
    calendlyUrl: CALENDLY_EVENT_URLS.waterConsultation,
  },
  {
    id: 'partnerInfo',
    title: 'Partner-Informationsgespr\u00e4ch',
    duration: '45 Minuten',
    text: 'Informationen zur Aqua Global Partnerschaft, Verdienstm\u00f6glichkeiten und Teamaufbau.',
    icon: UserCheck,
    calendlyUrl: CALENDLY_EVENT_URLS.partnerInfo,
  },
  {
    id: 'academySupport',
    title: 'Academy-Support',
    duration: '30 Minuten',
    text: 'Unterstützung zur Harbor Global Partner Academy, zu Modulen, Technik und persönlichen Aufgaben.',
    icon: Globe2,
    calendlyUrl: CALENDLY_EVENT_URLS.academySupport,
  },
];

function buildEmbedUrl(url) {
  if (!url) {
    return '';
  }

  try {
    const calendlyUrl = new URL(url);

    if (calendlyUrl.protocol !== 'https:' || calendlyUrl.hostname !== 'calendly.com' || calendlyUrl.pathname === '/') {
      return '';
    }
  } catch {
    return '';
  }

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${CALENDLY_THEME_QUERY}`;
}

export default function BookingPageClient({ initialTypeId }) {
  const initialSafeTypeId = appointmentTypes.some((type) => type.id === initialTypeId && type.calendlyUrl)
    ? initialTypeId
    : 'academySupport';
  const [activeTypeId, setActiveTypeId] = useState(initialSafeTypeId);
  const activeType = appointmentTypes.find((type) => type.id === activeTypeId && type.calendlyUrl)
    || appointmentTypes.find((type) => type.id === 'academySupport');
  const embedUrl = useMemo(() => buildEmbedUrl(activeType.calendlyUrl), [activeType.calendlyUrl]);
  const directCalendlyUrl = activeType.calendlyUrl;

  return (
    <main className="min-h-screen max-w-full overflow-x-hidden bg-[#040404] text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(234,179,8,0.18),_transparent_35%),linear-gradient(135deg,_#020202,_#10100c_45%,_#020202)]" />
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-3 py-4 sm:px-5 md:px-8 lg:px-10">
        <header className="flex min-w-0 flex-col gap-3 border-b border-yellow-300/15 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white/75 transition hover:border-yellow-300/35 hover:bg-yellow-400/10 hover:text-yellow-50">
            <ArrowLeft size={17} />
            <span>Zur Academy</span>
          </Link>
          <a href={directCalendlyUrl} target="_blank" rel="noreferrer" className="inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 text-center text-sm font-black text-black shadow-lg shadow-yellow-500/25 transition hover:bg-yellow-300 sm:px-5">
            <span>Calendly direkt öffnen</span> <ExternalLink size={16} />
          </a>
        </header>

        <div className="grid flex-1 gap-6 py-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-start lg:gap-8">
          <section className="min-w-0 space-y-5">
            <div className="min-w-0">
              <Image src="/harbor-global-logo-clean.png" alt="Harbor Global Partner Academy" width={420} height={220} priority className="h-20 w-auto max-w-full object-contain sm:h-24 md:h-32" />
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-yellow-300 sm:mt-8 sm:text-sm sm:tracking-[0.24em]">Zentrale Terminbuchung</p>
              <h1 className="mt-3 max-w-full break-words text-3xl font-black leading-tight sm:text-4xl md:text-6xl">Termin mit Leonid Curos buchen</h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/65 sm:mt-5 sm:text-lg">
                Wähle deinen passenden Termin direkt über Calendly. Verfügbarkeit, Bestätigung, Kalendereinladung und Google-Kalender-Synchronisation werden vollständig über Calendly verwaltet.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-yellow-300/20 bg-yellow-400/10 p-4 shadow-xl shadow-yellow-500/10 sm:rounded-[2rem] sm:p-5">
              <div className="flex min-w-0 items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-black">
                  <CalendarDays size={21} />
                </span>
                <div className="min-w-0">
                  <p className="font-black text-yellow-50">Wichtiger Hinweis</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    Nach deiner Terminbuchung erhältst du automatisch eine Bestätigung per E-Mail. Der Termin wird in deinen Kalender eingetragen und erscheint automatisch bei Leonid Curos.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {appointmentTypes.map(({ id, title, duration, text, icon: Icon, calendlyUrl }) => {
                const isActive = id === activeType.id;
                const isAvailable = Boolean(calendlyUrl);

                return isAvailable ? (
                  <button
                    key={id}
                    type="button"
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => {
                      setActiveTypeId(id);
                      window.history.replaceState(null, '', `/termin-buchen?termin=${id}#calendly-buchung`);
                      document.getElementById('calendly-buchung')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
                    }}
                    className={`group min-w-0 rounded-[1.5rem] border p-4 text-left transition ${isActive ? 'border-yellow-200/70 bg-yellow-400/[0.16] shadow-lg shadow-yellow-500/15' : 'border-white/10 bg-white/[0.055] hover:border-yellow-300/35 hover:bg-yellow-400/[0.09]'}`}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition ${isActive ? 'border-yellow-100/60 bg-yellow-400 text-black' : 'border-yellow-300/25 bg-black/35 text-yellow-200 group-hover:bg-yellow-400 group-hover:text-black'}`}>
                        <Icon size={19} />
                      </span>
                      <div className="min-w-0">
                        <h2 className="break-words font-black text-yellow-50">{title}</h2>
                        <p className="mt-1 flex flex-wrap items-center gap-2 text-sm font-bold text-yellow-200"><Clock size={14} /> {duration}</p>
                        <p className="mt-2 text-sm leading-relaxed text-white/60">{text}</p>
                      </div>
                    </div>
                  </button>
                ) : (
                  <div key={id} className="min-w-0 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 text-left opacity-75">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/35 text-white/45">
                        <Icon size={19} />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h2 className="break-words font-black text-white/70">{title}</h2>
                          <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white/55">In Vorbereitung</span>
                        </div>
                        <p className="mt-1 flex flex-wrap items-center gap-2 text-sm font-bold text-white/45"><Clock size={14} /> {duration}</p>
                        <p className="mt-2 text-sm leading-relaxed text-white/45">{text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section id="calendly-buchung" className="min-w-0 overflow-hidden rounded-[1.5rem] border border-yellow-300/20 bg-black/45 p-3 shadow-2xl shadow-yellow-500/10 backdrop-blur-xl sm:rounded-[2rem] md:p-4">
            <div className="mb-4 flex min-w-0 flex-col gap-3 px-1 pt-1 sm:flex-row sm:items-start sm:justify-between sm:px-2 sm:pt-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-yellow-200 sm:tracking-[0.2em]">Calendly + Google Kalender</p>
                <h2 className="mt-1 break-words text-2xl font-black text-yellow-50">{activeType.title}</h2>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm font-bold text-yellow-200"><Clock size={14} /> {activeType.duration}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{activeType.text}</p>
              </div>
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-green-300/25 bg-green-400/10 px-3 py-2 text-center text-xs font-black text-green-100 sm:w-auto">
                <CheckCircle2 size={14} /> Doppelte Buchungen verhindert Calendly
              </span>
            </div>

            {embedUrl ? (
              <iframe
                key={embedUrl}
                title={`Calendly Terminbuchung - ${activeType.title}`}
                src={embedUrl}
                className="h-[640px] w-full min-w-0 rounded-[1.25rem] border-0 bg-black sm:h-[720px] md:h-[780px] lg:h-[820px]"
                loading="lazy"
              />
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[1.25rem] border border-yellow-300/15 bg-black/40 px-5 py-10 text-center sm:min-h-[420px]">
                <CalendarDays size={36} className="text-yellow-300" />
                <h3 className="mt-4 text-xl font-black text-yellow-50">Termin aktuell nicht direkt eingebettet</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
                  Für diesen Termin ist aktuell keine gültige Calendly-URL hinterlegt. Öffne das gültige Calendly-Profil, um einen verfügbaren Termin auszuwählen.
                </p>
                <a href={CALENDLY_PROFILE_URL} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 text-sm font-black text-black hover:bg-yellow-300">
                  Calendly direkt öffnen <ExternalLink size={16} />
                </a>
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
