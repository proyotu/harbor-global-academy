'use client';

import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crown,
  Download,
  Flame,
  Globe2,
  Instagram,
  Lock,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import { Button } from './ui';
import { CampaignGrowthPanel } from './campaign-center';
import { createI18nTranslator } from './i18n-extension';
import { MediaGrowthPanel } from './media-center';

export const growthCenterCategories = [
  { id: 'marketing', title: 'Marketing', text: 'Kampagnen, Flyer, Vorlagen und Werbematerial für sichtbare Kundenkommunikation.', icon: Globe2 },
  { id: 'sales', title: 'Vertrieb', text: 'Gesprächsführung, Follow-up und Abschlussimpulse nach dem Academy-Start.', icon: MessageCircle },
  { id: 'recruiting', title: 'Recruiting', text: 'Leitfäden, Einwandbehandlung und klare nächste Schritte für neue Partner.', icon: Users },
  { id: 'social', title: 'Social Media', text: 'Ideen für Instagram, TikTok, Reels, Stories und WhatsApp-Kommunikation.', icon: Instagram },
  { id: 'ai-tools', title: 'KI & Tools', text: 'Prompt-Sammlungen für Texte, Bilder, Videos und Verkaufsunterstützung.', icon: Settings },
  { id: 'campaigns', title: 'Kampagnen', text: 'Aktuelle Aktionen und vorbereitete Launch-/Saison-Kampagnen.', icon: Flame },
  { id: 'products', title: 'Produktneuheiten', text: 'Produktupdates, Wissen, Aktionen und neue Verkaufsmomente.', icon: BookOpen },
  { id: 'downloads', title: 'Downloads', text: 'Langfristige Unterlagen, Vorlagen und Materialien für Partner.', icon: Download },
  { id: 'live-training', title: 'Live Trainings', text: 'Trainings, Team-Calls und Coaching-Formate als vorbereitete Übersicht.', icon: CalendarDays },
  { id: 'stories', title: 'Success Stories', text: 'Erfolge, Beispiele und Inspiration aus dem Harbor-Partnerumfeld.', icon: Star },
];

export const growthHubSections = [
  {
    id: 'marketing-hub',
    title: 'Marketing Hub',
    text: 'Vorbereitete Oberfläche für Kampagnen, Flyer, Vorlagen, Werbematerial und Downloads.',
    icon: Globe2,
    items: ['Aktuelle Kampagnen', 'Flyer', 'Vorlagen', 'Werbematerial', 'Downloads'],
  },
  {
    id: 'content-center',
    title: 'Content Center',
    text: 'Content-Ideen für tägliche Sichtbarkeit auf Social Media und WhatsApp.',
    icon: Instagram,
    items: ['Instagram Ideen', 'TikTok Ideen', 'Reels', 'Story Vorlagen', 'WhatsApp Vorlagen', 'Canva Vorlagen'],
  },
  {
    id: 'ai-center',
    title: 'KI Center',
    text: 'Prompt-Bibliothek als UI-Vorbereitung für spätere KI- und Agenten-Workflows.',
    icon: Settings,
    items: ['ChatGPT Prompts', 'Claude Prompts', 'Bild-Prompts', 'Video-Prompts', 'Verkaufs-Prompts'],
  },
  {
    id: 'recruiting-center',
    title: 'Recruiting Center',
    text: 'Materialien für Partnergewinnung, Einwandbehandlung und Follow-up.',
    icon: Users,
    items: ['Gesprächsleitfäden', 'Einwandbehandlung', 'Recruiting Videos', 'Follow-up Vorlagen'],
  },
  {
    id: 'product-center',
    title: 'Produkt Center',
    text: 'Produktwissen, Updates und Aktionen für langfristige Kundenbindung.',
    icon: BookOpen,
    items: ['Neue Produkte', 'Produktupdates', 'Aktionen', 'Produktwissen'],
  },
];

const leaderGrowthItems = [
  { id: 'team-growth', title: 'Teamwachstum', text: 'Teamziele und Wachstumssignale später aus Leader-Daten ableiten.', icon: TrendingUp },
  { id: 'leader-training', title: 'Leader Schulungen', text: 'Führungstrainings und Teamaufbau-Inhalte als UI vorbereitet.', icon: Crown },
  { id: 'coaching', title: 'Coaching', text: 'Coaching-Impulse für aktive und gefährdete Teammitglieder.', icon: MessageCircle },
  { id: 'leadership', title: 'Führung', text: 'Führungsroutinen, Checklisten und Gesprächsleitfäden.', icon: ShieldCheck },
  { id: 'strategy', title: 'Teamstrategie', text: 'Strategische Teamplanung als spätere Erweiterung vorbereitet.', icon: Target },
];

const growthCategoryTranslationKeys = {
  marketing: ['growthMarketingTitle', 'growthMarketingText'],
  sales: ['growthSalesTitle', 'growthSalesText'],
  recruiting: ['mediaRecruitingTitle', 'growthRecruitingText'],
  social: ['mediaFilterSocial', 'growthSocialText'],
  'ai-tools': ['growthAiTitle', 'growthAiText'],
  campaigns: ['mediaCampaignsTitle', 'growthCampaignsText'],
  products: ['growthProductsTitle', 'growthProductsText'],
  downloads: ['resources', 'growthDownloadsText'],
  'live-training': ['growthLiveTrainingTitle', 'growthLiveTrainingText'],
  stories: ['growthStoriesTitle', 'growthStoriesText'],
};

export function getGrowthCenterReadiness(partner, dependencies) {
  const {
    getPartnerAcademySummary,
    getOnboardingAssistantSummary,
  } = dependencies;
  const academySummary = getPartnerAcademySummary(partner);
  const onboarding = getOnboardingAssistantSummary(partner, [], academySummary);
  const progress = Math.min(100, Math.max(0, Number(academySummary.overallProgress || partner?.academyProgress?.progressPercent || 0)));
  const progressMeta = partner?.academyProgress || {};
  const certificationDone = Boolean(progressMeta.certificationPassed || progressMeta.certificationPassedAt || progressMeta.certificateIssuedAt);
  const onboardingDone = Boolean(progressMeta.onboardingStatus === 'completed' || onboarding.isComplete);
  const hasAccess = Boolean(certificationDone || (progress >= 100 && onboardingDone));

  return {
    academySummary,
    onboarding,
    progress,
    certificationDone,
    onboardingDone,
    hasAccess,
  };
}

export function GrowthCategoryCard({ category, locked = false, t = (key, fallback) => fallback || key }) {
  const Icon = category.icon;
  const [titleKey, textKey] = growthCategoryTranslationKeys[category.id] || [];
  const title = t(titleKey, category.title);
  const text = t(textKey, category.text);

  return (
    <div className={`rounded-[1.6rem] border p-4 text-white shadow-lg shadow-black/20 transition sm:p-5 ${locked ? 'border-white/10 bg-white/[0.035] opacity-75' : 'border-white/10 bg-white/[0.055] hover:-translate-y-0.5 hover:border-yellow-300/30 hover:bg-yellow-400/[0.08]'}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
          <Icon size={20} />
        </span>
        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${locked ? 'bg-white/10 text-white/45' : 'bg-yellow-400/10 text-yellow-100 ring-1 ring-yellow-200/20'}`}>
          {locked ? t('afterCompletion', 'Nach Abschluss') : t('ready', 'Bereit')}
        </span>
      </div>
      <h3 className="mt-4 break-words text-lg font-black text-yellow-50">{title}</h3>
      <p className="mt-2 break-words text-sm leading-relaxed text-white/58">{text}</p>
    </div>
  );
}

export function GrowthDashboardCard({ card }) {
  const Icon = card.icon;

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
          <Icon size={19} />
        </span>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-yellow-50">{card.value}</span>
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-white/45">{card.label}</p>
      <h4 className="mt-2 break-words text-lg font-black text-yellow-50">{card.title}</h4>
      <p className="mt-2 break-words text-sm leading-relaxed text-white/55">{card.text}</p>
    </div>
  );
}

export function GrowthHubPanel({ section, Panel }) {
  const Icon = section.icon;

  return (
    <Panel title={section.title} icon={Icon}>
      <p className="mb-4 text-sm leading-relaxed text-white/60">{section.text}</p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {section.items.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
                <CheckCircle2 size={16} />
              </span>
              <div className="min-w-0">
                <p className="break-words font-black text-yellow-50">{item}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/45">UI vorbereitet. Keine Speicherung, kein Upload, keine externe Integration.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" disabled className="mt-5 w-full cursor-not-allowed rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 font-black text-white/45 sm:w-auto">
        Workflow vorbereitet
      </Button>
    </Panel>
  );
}

export function GrowthLeaderPanel({ Panel }) {
  return (
    <Panel title="Leader Growth" icon={Crown}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {leaderGrowthItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
              <Icon size={18} className="text-yellow-200" />
              <p className="mt-3 font-black text-yellow-50">{item.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/50">{item.text}</p>
              <span className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white/45">UI-only</span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

export function GrowthLockedState({ readiness, onNavigate, Panel }) {
  const checklist = [
    {
      id: 'academy',
      label: 'Academy vollständig abschließen',
      done: readiness.progress >= 100,
      value: `${readiness.progress}%`,
    },
    {
      id: 'onboarding',
      label: 'Onboarding abschließen',
      done: readiness.onboardingDone,
      value: readiness.onboardingDone ? 'erledigt' : 'offen',
    },
    {
      id: 'certificate',
      label: 'Zertifikat erhalten',
      done: readiness.certificationDone,
      value: readiness.certificationDone ? 'vorhanden' : 'vorbereitet',
    },
  ];

  return (
    <Panel title="Growth Center Zugriff vorbereitet" icon={Lock}>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.6rem] border border-yellow-300/20 bg-yellow-400/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Post Academy Experience</p>
          <h3 className="mt-3 text-2xl font-black text-yellow-50">Freischaltung nach Academy-Abschluss</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/62">
            Das Growth Center ist als langfristiger Business-Bereich vorbereitet. Die echte serverseitige Freischaltung nach Zertifikat bleibt bewusst ein TODO, weil keine Auth-, API- oder Datenbankänderung freigegeben ist.
          </p>
          <Button type="button" onClick={() => onNavigate?.('modules')} className="mt-5 w-full rounded-2xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300 sm:w-auto">
            Academy fortsetzen <ChevronRight size={15} />
          </Button>
        </div>
        <div className="space-y-3">
          {checklist.map((item) => (
            <div key={item.id} className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="min-w-0">
                <p className="break-words font-black text-yellow-50">{item.label}</p>
                <p className="mt-1 text-xs text-white/45">Vorhandene Frontend-Daten: {item.value}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${item.done ? 'bg-green-400/10 text-green-100 ring-1 ring-green-300/20' : 'bg-white/10 text-white/45'}`}>
                {item.done ? 'erledigt' : 'offen'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

export function GrowthCenterSection({ partner, academyUpdates = [], onNavigate, isAdmin = false, isLeader = false, dependencies }) {
  const {
    Panel,
    Stat,
    NotificationEmptyState,
    buildNotificationCenterItems,
    formatAdminDate,
  } = dependencies;
  const t = dependencies.t || createI18nTranslator(dependencies.language, dependencies.copy);
  const readiness = getGrowthCenterReadiness(partner, dependencies);
  const hasPreviewAccess = readiness.hasAccess || isAdmin;
  const latestUpdates = buildNotificationCenterItems({ updates: academyUpdates, isAdmin, isLeader }).slice(0, 3);
  const latestUpdateDate = latestUpdates[0]?.date;
  const dashboardCards = [
    {
      id: 'new-content',
      label: t('successNewContent'),
      title: latestUpdates.length ? `${latestUpdates.length} sichtbare Meldung(en)` : 'Keine neuen Inhalte',
      text: latestUpdates[0]?.title || 'Sobald neue Growth-Inhalte gepflegt werden, erscheinen sie hier.',
      value: latestUpdates.length,
      icon: Bell,
    },
    {
      id: 'recommended',
      label: t('growthRecommended'),
      title: readiness.progress >= 100 ? 'Marketing Hub starten' : 'Academy zuerst abschließen',
      text: readiness.progress >= 100 ? 'Bereite deine nächste Kunden- oder Recruiting-Kampagne vor.' : 'Das Growth Center wird nach Academy-Abschluss freigeschaltet.',
      value: readiness.progress >= 100 ? 'Jetzt' : `${readiness.progress}%`,
      icon: Star,
    },
    {
      id: 'popular',
      label: t('popularContent', 'Beliebte Inhalte'),
      title: 'Downloads & Vorlagen',
      text: 'Beliebtheit wird später aus echten Nutzungsdaten abgeleitet.',
      value: 'UI',
      icon: Download,
    },
    {
      id: 'updated',
      label: t('lastUpdate'),
      title: latestUpdateDate ? formatAdminDate(latestUpdateDate) : 'Noch nicht angebunden',
      text: 'Verwendet vorhandene Academy-Update-Daten, falls sie für diese Rolle sichtbar sind.',
      value: latestUpdateDate ? 'Live' : '—',
      icon: Clock,
    },
    {
      id: 'favorites',
      label: t('favorites', 'Favoriten'),
      title: 'Favoriten vorbereitet',
      text: 'Favoriten bleiben UI-only, bis eine sichere Speicherung freigegeben wird.',
      value: 'UI',
      icon: Trophy,
    },
    {
      id: 'recent',
      label: t('recentlyViewed', 'Zuletzt angesehen'),
      title: 'Verlauf vorbereitet',
      text: 'Zuletzt angesehen wird nicht gespeichert und benötigt später eine freigegebene Datenstruktur.',
      value: 'UI',
      icon: Search,
    },
  ];

  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-400/[0.16] via-white/[0.055] to-black/55 p-5 text-white shadow-2xl shadow-yellow-500/10 sm:p-6 lg:p-8">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-200">Harbor Growth Center</p>
            <h2 className="mt-3 break-words text-3xl font-black text-yellow-50 sm:text-4xl">{t('growthHeroTitle')}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65 sm:text-base">
              {t('growthHeroText')}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <Stat icon={BookOpen} label="Academy" value={`${readiness.progress}%`} />
            <Stat icon={Trophy} label="Zertifikat" value={readiness.certificationDone ? 'bereit' : 'offen'} />
            <Stat icon={Flame} label="Growth" value={hasPreviewAccess ? 'aktiv' : 'gesperrt'} />
          </div>
        </div>
      </div>

      {!hasPreviewAccess && <GrowthLockedState readiness={readiness} onNavigate={onNavigate} Panel={Panel} />}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {growthCenterCategories.map((category) => (
          <GrowthCategoryCard key={category.id} category={category} locked={!hasPreviewAccess} t={t} />
        ))}
      </section>

      {hasPreviewAccess ? (
        <>
          <Panel title={t('growthDashboard')} icon={Crown}>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {dashboardCards.map((card) => (
                <GrowthDashboardCard key={card.id} card={card} />
              ))}
            </div>
          </Panel>

          <section className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
            <Panel title={t('successNewContent')} icon={Bell}>
              {latestUpdates.length ? (
                <div className="space-y-3">
                  {latestUpdates.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
                            <Icon size={18} />
                          </span>
                          <div className="min-w-0">
                            <p className="break-words font-black text-yellow-50">{item.title}</p>
                            <p className="mt-1 break-words text-sm leading-relaxed text-white/55">{item.description}</p>
                            <p className="mt-2 text-xs text-white/40">{item.date ? formatAdminDate(item.date) : 'Datum nicht erfasst'}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <NotificationEmptyState title="Noch keine Growth-Inhalte vorhanden." text="Sobald echte Growth-Updates sichtbar sind, werden sie hier angezeigt." />
              )}
            </Panel>

            <Panel title={t('growthRecommended')} icon={Star}>
              <div className="rounded-[1.6rem] border border-yellow-300/20 bg-yellow-400/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Nächster Wachstumsschritt</p>
                <h3 className="mt-3 text-2xl font-black text-yellow-50">Starte mit dem Marketing Hub</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/62">
                  Nach dem Academy-Abschluss ist der nächste sinnvolle Schritt: Sichtbarkeit aufbauen, Unterlagen strukturieren und erste Kampagnen vorbereiten.
                </p>
                <Button type="button" disabled className="mt-5 w-full cursor-not-allowed rounded-2xl bg-yellow-400/50 px-4 py-3 font-black text-black/70 sm:w-auto">
                  Favorit speichern vorbereitet
                </Button>
              </div>
            </Panel>
          </section>

          <section className="space-y-5">
            <CampaignGrowthPanel Panel={Panel} t={t} />
            <MediaGrowthPanel Panel={Panel} onNavigate={onNavigate} dependencies={{ ...dependencies, t }} />
            {growthHubSections.map((section) => (
              <GrowthHubPanel key={section.id} section={section} Panel={Panel} />
            ))}
          </section>

          {(isLeader || isAdmin) && <GrowthLeaderPanel Panel={Panel} />}

          <Panel title={t('futureIntegrations')} icon={Settings}>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {['CRM', 'n8n', 'WhatsApp', 'KI-Agenten', 'Leonid OS'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <p className="font-black text-yellow-50">{item}</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/45">Grundlage vorbereitet, aber nicht implementiert.</p>
                </div>
              ))}
            </div>
          </Panel>
        </>
      ) : (
        <Panel title="Nach Freischaltung verfügbar" icon={ShieldCheck}>
          <p className="text-sm leading-relaxed text-white/60">
            Die Kategorien sind sichtbar vorbereitet, aber die vollständige Nutzung bleibt an Academy-Abschluss und Zertifikat gebunden. Eine echte serverseitige Zugriffskontrolle muss später mit freigegebener Auth-/Datenstruktur ergänzt werden.
          </p>
        </Panel>
      )}
    </section>
  );
}
