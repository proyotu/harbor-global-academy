'use client';

import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clipboard,
  Copy,
  Film,
  Lightbulb,
  ListChecks,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import {
  GROWTH_CONTENT_AI_LESSONS,
  GROWTH_CONTENT_AI_TASKS,
  GROWTH_CONTENT_AI_TEMPLATES,
} from '../app/lib/growth-content-ai';

const lessonIcons = {
  'content-foundation': Lightbulb,
  'content-factory': Sparkles,
  'prompt-basics': MessageSquareText,
  'ai-safety': ShieldCheck,
  'short-form': Film,
  production: WandSparkles,
  publishing: ArrowRight,
  'ai-tools': Clipboard,
};

const canonicalSourceKeys = ['products', 'water', 'sales', 'campaigns', 'media', 'growth'];

function LessonCard({ lesson, active, onSelect, t }) {
  const Icon = lessonIcons[lesson.id] || BookOpen;

  return (
    <button
      type="button"
      onClick={() => onSelect(lesson.id)}
      aria-pressed={active}
      className={`min-h-24 w-full rounded-[1.35rem] border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 sm:p-4 ${active ? 'border-yellow-300/45 bg-yellow-400/15 text-yellow-50' : 'border-white/10 bg-black/25 text-white/70 hover:border-yellow-300/25 hover:bg-white/[0.06]'}`}
    >
      <Icon aria-hidden="true" size={18} className={active ? 'text-yellow-200' : 'text-white/50'} />
      <span className="mt-3 block break-words text-sm font-black leading-snug">
        {t(`growthAiFoundation.${lesson.id}.title`)}
      </span>
    </button>
  );
}

function ActiveLesson({ lesson, t }) {
  const Icon = lessonIcons[lesson.id] || BookOpen;

  return (
    <article className="min-w-0 overflow-hidden rounded-[1.75rem] border border-yellow-300/20 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.13),transparent_36%),rgba(0,0,0,0.34)] p-4 sm:p-6" aria-labelledby={`growth-ai-${lesson.id}`}>
      <div className="flex min-w-0 gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/25 bg-yellow-400/10 text-yellow-200">
          <Icon aria-hidden="true" size={20} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">{t('growthAiFoundation.lessonLabel')}</p>
          <h3 id={`growth-ai-${lesson.id}`} className="mt-1 break-words text-xl font-black text-yellow-50 sm:text-2xl">
            {t(`growthAiFoundation.${lesson.id}.title`)}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/65">{t(`growthAiFoundation.${lesson.id}.intro`)}</p>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="text-sm font-black text-yellow-50">{t('growthAiFoundation.stepsTitle')}</h4>
        <ol className="mt-3 grid gap-3 sm:grid-cols-2">
          {lesson.steps.map((step, index) => (
            <li key={step} className="flex min-w-0 gap-3 rounded-[1.2rem] border border-white/10 bg-black/25 p-3 sm:p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-xs font-black text-black">{index + 1}</span>
              <span className="min-w-0 break-words text-sm font-semibold leading-relaxed text-white/72">
                {t(`growthAiFoundation.${lesson.id}.step.${step}`)}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-4 rounded-[1.2rem] border border-emerald-200/20 bg-emerald-400/[0.07] p-4">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-100">
          <CheckCircle2 aria-hidden="true" size={16} /> {t('growthAiFoundation.keyLearning')}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/72">{t(`growthAiFoundation.${lesson.id}.key`)}</p>
      </div>
    </article>
  );
}

function PromptTemplateCard({ template, copiedId, onCopy, t }) {
  const prompt = t(`growthAiFoundation.template.${template.id}.prompt`);
  const copied = copiedId === template.id;

  return (
    <article className="min-w-0 rounded-[1.5rem] border border-white/10 bg-black/25 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="break-words text-base font-black text-yellow-50">{t(`growthAiFoundation.template.${template.id}.title`)}</h4>
          <p className="mt-2 text-sm leading-relaxed text-white/60">{t(`growthAiFoundation.template.${template.id}.purpose`)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white/55">
            {t(`growthAiFoundation.difficulty.${template.difficulty}`)}
          </span>
          <span className="rounded-full border border-yellow-200/20 bg-yellow-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-yellow-100">
            {t(`growthAiFoundation.status.${template.complianceStatus}`)}
          </span>
        </div>
      </div>

      <details className="mt-4 rounded-[1.15rem] border border-white/10 bg-white/[0.035]">
        <summary className="min-h-11 cursor-pointer px-4 py-3 text-sm font-black text-yellow-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-yellow-300">
          {t('growthAiFoundation.templatePrompt')}
        </summary>
        <div className="border-t border-white/10 p-4">
          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-white/70">{prompt}</p>
          <button
            type="button"
            onClick={() => onCopy(template.id, prompt)}
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-black text-black transition hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200 sm:w-auto"
          >
            {copied ? <Check aria-hidden="true" size={17} /> : <Copy aria-hidden="true" size={17} />}
            {t(copied ? 'growthAiFoundation.copied' : 'growthAiFoundation.copy')}
          </button>
        </div>
      </details>
    </article>
  );
}

export default function GrowthContentAiFoundation({ t }) {
  const [activeLessonId, setActiveLessonId] = useState(GROWTH_CONTENT_AI_LESSONS[0].id);
  const [copiedId, setCopiedId] = useState('');
  const [copyError, setCopyError] = useState(false);
  const activeLesson = GROWTH_CONTENT_AI_LESSONS.find((lesson) => lesson.id === activeLessonId) || GROWTH_CONTENT_AI_LESSONS[0];

  const copyPrompt = async (templateId, prompt) => {
    try {
      if (!globalThis.navigator?.clipboard?.writeText) throw new Error('clipboard-unavailable');
      await globalThis.navigator.clipboard.writeText(prompt);
      setCopyError(false);
      setCopiedId(templateId);
      globalThis.setTimeout(() => setCopiedId(''), 1800);
    } catch {
      setCopiedId('');
      setCopyError(true);
    }
  };

  return (
    <section className="min-w-0 space-y-5" aria-labelledby="growth-ai-foundation-title">
      <div className="overflow-hidden rounded-[2rem] border border-yellow-300/25 bg-gradient-to-br from-yellow-400/[0.14] via-white/[0.045] to-black/60 p-4 shadow-2xl shadow-yellow-500/10 sm:p-6 lg:p-7">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-200">{t('growthAiFoundation.eyebrow')}</p>
        <h2 id="growth-ai-foundation-title" className="mt-3 break-words text-2xl font-black text-yellow-50 sm:text-3xl">
          {t('growthAiFoundation.title')}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/68 sm:text-base">{t('growthAiFoundation.intro')}</p>
        <p className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-relaxed text-white/58">
          {t('growthAiFoundation.boundary')}
        </p>
      </div>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5" aria-labelledby="growth-ai-path-title">
        <h3 id="growth-ai-path-title" className="text-lg font-black text-yellow-50">{t('growthAiFoundation.pathTitle')}</h3>
        <p className="mt-2 break-words text-sm font-semibold leading-relaxed text-yellow-100/80">{t('growthAiFoundation.path')}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
          {GROWTH_CONTENT_AI_LESSONS.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} active={lesson.id === activeLesson.id} onSelect={setActiveLessonId} t={t} />
          ))}
        </div>
      </section>

      <ActiveLesson lesson={activeLesson} t={t} />

      <aside className="rounded-[1.75rem] border border-amber-200/25 bg-amber-400/[0.08] p-4 sm:p-5" aria-labelledby="growth-ai-safety-title">
        <div className="flex gap-3">
          <ShieldCheck aria-hidden="true" size={22} className="mt-0.5 shrink-0 text-amber-200" />
          <div className="min-w-0">
            <h3 id="growth-ai-safety-title" className="text-lg font-black text-amber-50">{t('growthAiFoundation.safetyTitle')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{t('growthAiFoundation.safetyText')}</p>
          </div>
        </div>
      </aside>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5" aria-labelledby="growth-ai-canonical-title">
        <h3 id="growth-ai-canonical-title" className="text-lg font-black text-yellow-50">{t('growthAiFoundation.canonicalTitle')}</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {canonicalSourceKeys.map((key) => (
            <li key={key} className="flex min-w-0 items-center gap-3 rounded-[1.2rem] border border-white/10 bg-black/25 p-4">
              <BookOpen aria-hidden="true" size={17} className="shrink-0 text-yellow-200" />
              <span className="break-words text-sm font-semibold text-white/72">{t(`growthAiFoundation.canonical.${key}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5" aria-labelledby="growth-ai-templates-title">
        <h3 id="growth-ai-templates-title" className="text-xl font-black text-yellow-50">{t('growthAiFoundation.templatesTitle')}</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/60">{t('growthAiFoundation.templatesIntro')}</p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {GROWTH_CONTENT_AI_TEMPLATES.map((template) => (
            <PromptTemplateCard key={template.id} template={template} copiedId={copiedId} onCopy={copyPrompt} t={t} />
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {copyError ? t('growthAiFoundation.copyFailed') : copiedId ? t('growthAiFoundation.copied') : ''}
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
          <h3 className="flex items-center gap-2 text-lg font-black text-yellow-50">
            <ListChecks aria-hidden="true" size={20} className="text-yellow-200" /> {t('growthAiFoundation.tasksTitle')}
          </h3>
          <p className="mt-2 text-sm text-white/55">{t('growthAiFoundation.tasksIntro')}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {GROWTH_CONTENT_AI_TASKS.map((taskId) => (
              <li key={taskId} className="flex min-w-0 gap-3 rounded-[1.15rem] border border-white/10 bg-black/25 p-4">
                <CheckCircle2 aria-hidden="true" size={17} className="mt-0.5 shrink-0 text-yellow-200" />
                <span className="break-words text-sm leading-relaxed text-white/70">{t(`growthAiFoundation.task.${taskId}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <article className="rounded-[1.75rem] border border-yellow-200/20 bg-yellow-400/[0.07] p-4 sm:p-5">
            <h3 className="text-lg font-black text-yellow-50">{t('growthAiFoundation.packageTitle')}</h3>
            <p className="mt-2 break-words text-sm leading-relaxed text-white/68">{t('growthAiFoundation.packageText')}</p>
          </article>
          <article className="rounded-[1.75rem] border border-white/10 bg-black/25 p-4 sm:p-5">
            <h3 className="text-lg font-black text-yellow-50">{t('growthAiFoundation.routineTitle')}</h3>
            <p className="mt-2 break-words text-sm leading-relaxed text-white/68">{t('growthAiFoundation.routineText')}</p>
            <p className="mt-4 text-xs font-semibold leading-relaxed text-white/45">{t('growthAiFoundation.noPersistence')}</p>
          </article>
        </div>
      </section>
    </section>
  );
}
