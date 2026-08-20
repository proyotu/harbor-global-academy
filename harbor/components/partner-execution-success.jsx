'use client';

import { ArrowRight, BookOpenCheck, CheckCircle2, Compass, Flag, HandHeart, ListChecks, Target, Users } from 'lucide-react';
import { buildPartnerExecutionModel } from '../app/lib/partner-execution';

const STATUS_STYLES = {
  OPEN: 'border-yellow-300/25 bg-yellow-400/10 text-yellow-100',
  IN_PROGRESS: 'border-blue-300/25 bg-blue-400/10 text-blue-100',
  DONE: 'border-green-300/25 bg-green-400/10 text-green-100',
};

function StatusBadge({ status, t }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.12em] ${STATUS_STYLES[status] || STATUS_STYLES.OPEN}`}>
      {t(`partnerExecution.status.${status}`)}
    </span>
  );
}

function ActionCard({ item, namespace, onNavigate, t }) {
  const prefix = namespace === 'next' ? `partnerExecution.next.${item.id.replace(/^daily-/, '')}` : `partnerExecution.task.${item.id.replace(/^daily-/, '')}`;
  return (
    <article className="flex min-w-0 flex-col rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-yellow-200">{t(`partnerExecution.source.${item.source}`)}</span>
        <StatusBadge status={item.status || 'OPEN'} t={t} />
      </div>
      <h4 className="mt-4 break-words text-base font-black text-yellow-50">{t(`${prefix}.title`)}</h4>
      <p className="mt-2 flex-1 break-words text-sm leading-relaxed text-white/58">{t(`${prefix}.text`)}</p>
      <button type="button" onClick={() => onNavigate?.(item.target)} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-yellow-300/25 bg-yellow-400/10 px-4 py-2.5 text-sm font-black text-yellow-100 transition hover:bg-yellow-400 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 sm:w-auto">
        {t('partnerExecution.openTarget')} <ArrowRight size={16} aria-hidden="true" />
      </button>
    </article>
  );
}

function SectionHeading({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200"><Icon size={20} aria-hidden="true" /></span>
      <div className="min-w-0"><h3 className="text-xl font-black text-yellow-50">{title}</h3><p className="mt-1 text-sm leading-relaxed text-white/55">{text}</p></div>
    </div>
  );
}

export function PartnerExecutionSuccessSystem({ data, partner, isAdmin = false, isLeader = false, onNavigate, t }) {
  const model = buildPartnerExecutionModel({ data, partner });
  const showLeaderView = isAdmin || isLeader;

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-400/[0.12] via-white/[0.045] to-black/45 p-5 sm:p-6" aria-labelledby="partner-execution-title">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-200">{t('partnerExecution.eyebrow')}</p>
        <h2 id="partner-execution-title" className="mt-2 text-2xl font-black text-yellow-50 sm:text-3xl">{t('partnerExecution.title')}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/62">{t('partnerExecution.intro')}</p>
        <p className="mt-4 inline-flex rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/72">{t('partnerExecution.flow')}</p>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="daily-focus-heading">
        <SectionHeading icon={Target} title={t('partnerExecution.dailyTitle')} text={t('partnerExecution.dailyText')} />
        <div className="mt-5 grid gap-3 lg:grid-cols-3" aria-live="polite">
          {model.dailyFocus.map((item, index) => <ActionCard key={item.id} item={item} namespace={index === 0 ? 'next' : 'task'} onNavigate={onNavigate} t={t} />)}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="weekly-focus-heading">
          <SectionHeading icon={Flag} title={t('partnerExecution.weeklyTitle')} text={t('partnerExecution.weeklyText')} />
          <ol className="mt-5 space-y-3">
            {model.weeklyFocus.map((item, index) => (
              <li key={item.id} className="flex gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400 font-black text-black">{index + 1}</span>
                <div className="min-w-0"><p className="font-black text-yellow-50">{t(`partnerExecution.weekly.${item.id}.title`)}</p><p className="mt-1 text-sm leading-relaxed text-white/55">{t(`partnerExecution.weekly.${item.id}.text`)}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-[2rem] border border-yellow-300/20 bg-yellow-400/[0.07] p-5 sm:p-6" aria-labelledby="next-action-heading">
          <SectionHeading icon={Compass} title={t('partnerExecution.nextTitle')} text={t('partnerExecution.flow')} />
          <div className="mt-5"><ActionCard item={model.nextAction} namespace="next" onNavigate={onNavigate} t={t} /></div>
        </section>
      </div>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="practice-heading">
        <SectionHeading icon={ListChecks} title={t('partnerExecution.practiceTitle')} text={t('partnerExecution.practiceText')} />
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {model.challenges.map((item) => <ActionCard key={item.id} item={{ ...item, status: 'OPEN' }} namespace="task" onNavigate={onNavigate} t={t} />)}
        </div>
        <p className="mt-4 rounded-2xl border border-blue-300/20 bg-blue-400/[0.08] p-3 text-xs leading-relaxed text-blue-100">{t('partnerExecution.persistenceNotice')}</p>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="review-heading">
          <SectionHeading icon={BookOpenCheck} title={t('partnerExecution.reviewTitle')} text={t('partnerExecution.flow')} />
          <dl className="mt-5 grid gap-3 sm:grid-cols-3" aria-live="polite">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><dt className="text-xs text-white/45">{t('partnerExecution.reviewLearned')}</dt><dd className="mt-2 text-xl font-black text-yellow-50">{model.weeklyReview.learnedCount}</dd></div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><dt className="text-xs text-white/45">{t('partnerExecution.reviewImplemented')}</dt><dd className="mt-2 text-sm font-black text-yellow-50">{t('partnerExecution.reviewNotRecorded')}</dd></div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><dt className="text-xs text-white/45">{t('partnerExecution.reviewOpen')}</dt><dd className="mt-2 text-xl font-black text-yellow-50">{model.weeklyReview.openCount}</dd></div>
          </dl>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="support-heading">
          <SectionHeading icon={HandHeart} title={t('partnerExecution.supportTitle')} text={t('partnerExecution.supportText')} />
          <div className="mt-5 space-y-3">
            {model.supportSignals.map((signal) => <div key={signal.id} className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="font-black text-yellow-50">{t(`partnerExecution.support.${signal.id}.title`)}</p><p className="mt-1 text-sm leading-relaxed text-white/55">{t(`partnerExecution.support.${signal.id}.text`)}</p></div>)}
            {!model.supportSignals.length && <div className="flex items-center gap-3 rounded-2xl border border-green-300/20 bg-green-400/[0.08] p-4 text-sm text-green-100"><CheckCircle2 size={18} aria-hidden="true" />{t('partnerExecution.status.DONE')}</div>}
          </div>
        </section>
      </div>

      {showLeaderView && (
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6" aria-labelledby="leader-execution-heading">
          <SectionHeading icon={Users} title={t('partnerExecution.leaderTitle')} text={t('partnerExecution.leaderText')} />
          <dl className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><dt className="text-xs text-white/45">{t('partnerExecution.leaderTeam')}</dt><dd className="mt-2 text-xl font-black text-yellow-50">{model.leaderSummary.teamCount}</dd></div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><dt className="text-xs text-white/45">{t('partnerExecution.leaderNew')}</dt><dd className="mt-2 text-xl font-black text-yellow-50">{model.leaderSummary.newPartners}</dd></div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><dt className="text-xs text-white/45">{t('partnerExecution.leaderActivity')}</dt><dd className="mt-2 text-sm font-black text-yellow-50">{t('partnerExecution.leaderAggregate')}</dd></div>
          </dl>
        </section>
      )}
    </div>
  );
}
