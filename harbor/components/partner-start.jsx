'use client';

import { BookOpen, CheckCircle2, ChevronRight, Circle, Clock, Target, UserCheck, Users } from 'lucide-react';
import { Button, Card, CardContent } from './ui';
import { createI18nTranslator } from './i18n-extension';
import { getPartnerStartProgress } from '../app/lib/partner-start';

const WATER_VIDEO_IDS = ['wasser-grundlagen', 'umkehrosmose-erklaerung', 'ppm-bedeutung', 'tee-test'];

export default function PartnerStartJourney({
  partner,
  copy,
  selectedLanguage,
  academySummary,
  onboardingSummary,
  localCompletedStepIds = [],
  onNavigate,
}) {
  const t = createI18nTranslator(selectedLanguage, copy);
  const completedVideos = partner?.academyProgress?.completedVideos || {};
  const profileComplete = ['firstName', 'lastName', 'email', 'city', 'discountCode']
    .every((field) => String(partner?.[field] || '').trim());
  const firstLearningStepComplete = Object.keys(completedVideos).some((videoId) => completedVideos[videoId]);
  const firstWaterStepComplete = WATER_VIDEO_IDS.some((videoId) => completedVideos[videoId]);
  const hasLeaderContext = Boolean(String(partner?.teamName || '').trim()) || Number(partner?.teamPartnerCount || 0) > 0;
  const progress = getPartnerStartProgress({
    onboardingProgress: onboardingSummary?.progress,
    academyProgress: academySummary?.overallProgress,
    partner,
  });
  const first24Hours = [
    { id: 'profile', label: t('first24hProfile'), completed: profileComplete, target: 'profile' },
    { id: 'welcome', label: t('first24hWelcome'), completed: localCompletedStepIds.includes('welcome-module'), target: 'start' },
    { id: 'tour', label: t('first24hTour'), completed: localCompletedStepIds.includes('academy-tour-video'), target: 'start' },
    { id: 'module', label: t('first24hModule'), completed: firstLearningStepComplete, target: 'modules' },
    { id: 'water', label: t('first24hWater'), completed: firstWaterStepComplete, target: 'modules' },
    { id: 'leader', label: t('first24hLeader'), completed: hasLeaderContext, target: hasLeaderContext ? 'profile' : 'contact' },
  ];
  const days = [
    { day: 1, title: t('first7DaysDay1Title'), text: t('first7DaysDay1Text'), target: 'modules', available: true },
    { day: 2, title: t('first7DaysDay2Title'), text: t('first7DaysDay2Text'), target: 'testlab', available: true },
    { day: 3, title: t('first7DaysDay3Title'), text: t('first7DaysDay3Text'), target: 'modules', available: true },
    { day: 4, title: t('first7DaysDay4Title'), text: t('first7DaysDay4Text'), target: 'modules', available: true },
    { day: 5, title: t('first7DaysDay5Title'), text: t('first7DaysDay5Text'), target: 'media', available: true },
    { day: 6, title: t('first7DaysDay6Title'), text: t('first7DaysDay6Text'), target: 'modules', available: true },
    { day: 7, title: t('first7DaysDay7Title'), text: t('first7DaysDay7Text'), target: 'dashboard', available: true },
  ];
  const nextStep = onboardingSummary?.nextStep;

  return (
    <section className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]" aria-labelledby="partner-start-heading">
      <div className="space-y-5">
        <Card className="rounded-[2rem] border border-yellow-300/20 bg-white/[0.055] text-white shadow-lg shadow-black/20 backdrop-blur-xl">
          <CardContent className="p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">{t('partnerStartCurrentStep')}</p>
            <h3 id="partner-start-heading" className="mt-2 text-2xl font-black text-yellow-50">{nextStep?.title || t('partnerStartReady')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{nextStep?.description || t('partnerStartReadyText')}</p>
            {nextStep?.target && (
              <Button type="button" onClick={() => onNavigate?.(nextStep.target)} className="mt-5 min-h-12 w-full rounded-2xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-200">
                {nextStep.actionLabel || t('partnerStartContinue')} <ChevronRight size={16} />
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-white/10 bg-white/[0.055] text-white backdrop-blur-xl">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">{t('first24hEyebrow')}</p>
                <h3 className="mt-2 text-2xl font-black text-yellow-50">{t('first24hTitle')}</h3>
              </div>
              <Clock className="shrink-0 text-yellow-200" aria-hidden="true" />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/58">{t('first24hText')}</p>
            <div className="mt-5 space-y-2">
              {first24Hours.map((task) => (
                <button key={task.id} type="button" onClick={() => onNavigate?.(task.target)} className="flex min-h-12 w-full items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-3 py-3 text-left transition hover:border-yellow-300/30 hover:bg-yellow-400/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-200">
                  {task.completed ? <CheckCircle2 size={19} className="shrink-0 text-green-300" aria-hidden="true" /> : <Circle size={19} className="shrink-0 text-white/35" aria-hidden="true" />}
                  <span className="min-w-0 flex-1 text-sm font-bold text-white/80">{task.label}</span>
                  <span className="sr-only">{task.completed ? t('done') : t('partnerStartOpen')}</span>
                  <ChevronRight size={16} className="shrink-0 text-yellow-200" aria-hidden="true" />
                </button>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-yellow-300/15 bg-yellow-400/[0.07] p-3 text-sm text-white/60">
              <Users size={17} className="mr-2 inline text-yellow-200" aria-hidden="true" />
              {hasLeaderContext ? t('partnerStartLeaderAvailable').replace('{team}', partner?.teamName || t('partnerStartYourTeam')) : t('partnerStartLeaderPending')}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-400/[0.1] via-white/[0.05] to-black/45 text-white backdrop-blur-xl">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">{t('first7DaysEyebrow')}</p>
              <h3 className="mt-2 text-2xl font-black text-yellow-50">{t('first7DaysTitle')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/58">{t('first7DaysText')}</p>
            </div>
            <Target className="shrink-0 text-yellow-200" aria-hidden="true" />
          </div>
          <ol className="mt-5 space-y-3">
            {days.map((item) => {
              const active = item.day === progress.currentDay;
              const past = item.day < progress.currentDay;
              return (
                <li key={item.day}>
                  <button type="button" disabled={!item.available} onClick={() => item.available && onNavigate?.(item.target)} aria-current={active ? 'step' : undefined} className={`flex min-h-14 w-full items-start gap-3 rounded-2xl border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-200 ${active ? 'border-yellow-300/45 bg-yellow-400/[0.13]' : 'border-white/10 bg-black/20 hover:border-yellow-300/25'}`}>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${past ? 'bg-green-400/15 text-green-200' : active ? 'bg-yellow-400 text-black' : 'bg-white/[0.07] text-white/55'}`}>
                      {past ? <CheckCircle2 size={18} aria-label={t('done')} /> : item.day}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-yellow-200">
                        {t('first7DaysDayLabel').replace('{day}', item.day)}{active ? ` · ${t('partnerStartToday')}` : past ? ` · ${t('done')}` : ''}
                      </span>
                      <span className="mt-1 block font-black text-yellow-50">{item.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-white/55">{item.text}</span>
                    </span>
                    <ChevronRight size={16} className="mt-3 shrink-0 text-yellow-200" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-5 grid grid-cols-2 gap-3" aria-live="polite">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <UserCheck size={18} className="text-yellow-200" aria-hidden="true" />
              <p className="mt-3 text-2xl font-black text-yellow-50">{progress.onboardingProgress}%</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-white/45">{t('partnerStartOnboardingProgress')}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <BookOpen size={18} className="text-yellow-200" aria-hidden="true" />
              <p className="mt-3 text-2xl font-black text-yellow-50">{progress.academyProgress}%</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-white/45">{t('partnerStartAcademyProgress')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
