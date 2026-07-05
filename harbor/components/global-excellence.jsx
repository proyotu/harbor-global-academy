'use client';

import {
  BriefcaseBusiness,
  Crown,
  Flame,
  MessageCircle,
  Presentation,
  Repeat2,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { createI18nTranslator } from './i18n-extension';
import { Button } from './ui';

export const globalExcellenceCategories = [
  {
    id: 'communication-rhetoric',
    titleKey: 'globalExcellenceCommunicationTitle',
    descriptionKey: 'globalExcellenceCommunicationText',
    icon: MessageCircle,
  },
  {
    id: 'sales-selling',
    titleKey: 'globalExcellenceSalesTitle',
    descriptionKey: 'globalExcellenceSalesText',
    icon: Target,
  },
  {
    id: 'presentation-storytelling',
    titleKey: 'globalExcellencePresentationTitle',
    descriptionKey: 'globalExcellencePresentationText',
    icon: Presentation,
  },
  {
    id: 'leadership',
    titleKey: 'globalExcellenceLeadershipTitle',
    descriptionKey: 'globalExcellenceLeadershipText',
    icon: Crown,
  },
  {
    id: 'entrepreneurship-scaling',
    titleKey: 'globalExcellenceEntrepreneurshipTitle',
    descriptionKey: 'globalExcellenceEntrepreneurshipText',
    icon: BriefcaseBusiness,
  },
  {
    id: 'systems-processes',
    titleKey: 'globalExcellenceSystemsTitle',
    descriptionKey: 'globalExcellenceSystemsText',
    icon: Repeat2,
  },
  {
    id: 'mindset-discipline',
    titleKey: 'globalExcellenceMindsetTitle',
    descriptionKey: 'globalExcellenceMindsetText',
    icon: Flame,
  },
  {
    id: 'customer-experience-service',
    titleKey: 'globalExcellenceCustomerExperienceTitle',
    descriptionKey: 'globalExcellenceCustomerExperienceText',
    icon: Sparkles,
  },
];

function GlobalExcellenceCategoryCard({ category, t }) {
  const Icon = category.icon;

  return (
    <article className="group flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-4 shadow-xl shadow-black/20 transition hover:border-yellow-300/30 hover:bg-yellow-400/[0.075] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
          <Icon size={19} />
        </span>
        <span className="rounded-full border border-yellow-300/20 bg-yellow-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-yellow-100">
          {t('globalExcellenceStatus')}
        </span>
      </div>
      <h3 className="mt-4 break-words text-lg font-black text-yellow-50">{t(category.titleKey)}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-white/58">{t(category.descriptionKey)}</p>
      <Button
        type="button"
        disabled
        className="mt-5 w-full cursor-not-allowed rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white/45"
      >
        {t('globalExcellenceCta')}
      </Button>
    </article>
  );
}

export function GlobalExcellenceSection({ dependencies = {} }) {
  const { Panel, Stat } = dependencies;
  const t = dependencies.t || createI18nTranslator(dependencies.language, dependencies.copy);

  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-400/[0.16] via-white/[0.055] to-black/55 p-5 text-white shadow-2xl shadow-yellow-500/10 sm:p-6 lg:p-8">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-200">{t('globalExcellenceKicker')}</p>
            <h2 className="mt-3 break-words text-3xl font-black text-yellow-50 sm:text-4xl">{t('globalExcellenceTitle')}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65 sm:text-base">
              {t('globalExcellenceIntro')}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <Stat icon={GlobeExcellenceIcon} label={t('globalExcellenceFocusLabel')} value={t('globalExcellenceFocusValue')} />
            <Stat icon={ShieldCheck} label={t('globalExcellenceStatusLabel')} value={t('globalExcellenceStatus')} />
            <Stat icon={Users} label={t('globalExcellenceAreasLabel')} value={globalExcellenceCategories.length} />
          </div>
        </div>
      </div>

      <Panel title={t('globalExcellenceAreasTitle')} icon={Crown}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {globalExcellenceCategories.map((category) => (
            <GlobalExcellenceCategoryCard key={category.id} category={category} t={t} />
          ))}
        </div>
      </Panel>

      <div className="rounded-[1.5rem] border border-yellow-300/15 bg-yellow-400/10 p-4 text-sm leading-relaxed text-yellow-100">
        {t('globalExcellenceFutureHint')}
      </div>
    </section>
  );
}

function GlobeExcellenceIcon(props) {
  return <ShieldCheck {...props} />;
}
