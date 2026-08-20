import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Target,
  Users,
  XCircle,
} from 'lucide-react';
import { getSalesRecruitingDefinition } from '../app/lib/sales-recruiting-foundation';

function ClassificationBadge({ classification, t }) {
  return (
    <span className="inline-flex min-h-8 items-center rounded-full border border-yellow-200/20 bg-yellow-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-yellow-100">
      {t(`salesRecruiting.classification.${classification}`)}
    </span>
  );
}

export function SalesRecruitingComplianceNote({ t }) {
  return (
    <aside className="rounded-[1.5rem] border border-amber-200/25 bg-amber-400/[0.08] p-4 sm:p-5" aria-labelledby="sales-recruiting-compliance-title">
      <div className="flex gap-3">
        <AlertTriangle aria-hidden="true" size={21} className="mt-0.5 shrink-0 text-amber-200" />
        <div className="min-w-0">
          <h4 id="sales-recruiting-compliance-title" className="text-base font-black text-amber-50">
            {t('salesRecruiting.compliance.title')}
          </h4>
          <p className="mt-1 text-sm leading-relaxed text-white/68">{t('salesRecruiting.compliance.text')}</p>
        </div>
      </div>
    </aside>
  );
}

function StepList({ definition, t }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2">
      {definition.steps.map((step, index) => (
        <li key={step} className="flex min-w-0 gap-3 rounded-[1.25rem] border border-white/10 bg-black/25 p-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-black text-black">{index + 1}</span>
          <p className="min-w-0 break-words text-sm font-semibold leading-relaxed text-white/75">
            {t(`salesRecruiting.${definition.id}.step.${step}`)}
          </p>
        </li>
      ))}
    </ol>
  );
}

function DoDont({ definition, t }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <article className="rounded-[1.5rem] border border-emerald-200/20 bg-emerald-400/[0.07] p-4 sm:p-5">
        <h4 className="flex items-center gap-2 text-base font-black text-emerald-50">
          <CheckCircle2 aria-hidden="true" size={19} /> {t('salesRecruiting.doTitle')}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-white/72">{t(`salesRecruiting.${definition.id}.do`)}</p>
      </article>
      <article className="rounded-[1.5rem] border border-red-200/20 bg-red-400/[0.07] p-4 sm:p-5">
        <h4 className="flex items-center gap-2 text-base font-black text-red-50">
          <XCircle aria-hidden="true" size={19} /> {t('salesRecruiting.dontTitle')}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-white/72">{t(`salesRecruiting.${definition.id}.dont`)}</p>
      </article>
    </div>
  );
}

function ReferenceCard({ referenceId, t }) {
  if (!referenceId) return null;

  return (
    <aside className="rounded-[1.5rem] border border-sky-200/20 bg-sky-400/[0.06] p-4 sm:p-5">
      <div className="flex gap-3">
        <BookOpen aria-hidden="true" size={20} className="mt-0.5 shrink-0 text-sky-200" />
        <div className="min-w-0">
          <h4 className="text-base font-black text-sky-50">{t('salesRecruiting.canonicalSource')}</h4>
          <p className="mt-1 text-sm leading-relaxed text-white/68">{t(`salesRecruiting.reference.${referenceId}`)}</p>
        </div>
      </div>
    </aside>
  );
}

function ScriptCard({ scriptId, t }) {
  if (!scriptId) return null;

  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
      <h4 className="flex items-center gap-2 text-base font-black text-yellow-50">
        <MessageCircle aria-hidden="true" size={19} /> {t('salesRecruiting.scriptTitle')}
      </h4>
      <p className="mt-3 border-l-2 border-yellow-300/40 pl-4 text-sm leading-relaxed text-white/72">
        {t(`salesRecruiting.script.${scriptId}`)}
      </p>
      <p className="mt-3 text-xs leading-relaxed text-white/48">{t('salesRecruiting.scriptBoundary')}</p>
    </article>
  );
}

export default function SalesRecruitingFoundationPanel({ foundationId, t }) {
  const definition = getSalesRecruitingDefinition(foundationId);

  if (!definition || typeof t !== 'function') return null;

  const PathIcon = definition.path === 'sales' ? Target : Users;
  const showCompliance = foundationId === 'recruiting-foundations' || foundationId === 'recruiting-business';

  return (
    <section className="min-w-0 overflow-hidden rounded-[1.75rem] border border-yellow-300/20 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.13),transparent_34%),rgba(0,0,0,0.32)] p-4 shadow-xl shadow-yellow-500/5 sm:p-6" aria-labelledby={`sales-recruiting-${foundationId}`}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-yellow-200">
            <PathIcon aria-hidden="true" size={15} /> {t(`salesRecruiting.path.${definition.path}`)}
          </p>
          <h3 id={`sales-recruiting-${foundationId}`} className="mt-2 break-words text-2xl font-black text-yellow-50 sm:text-3xl">
            {t(`salesRecruiting.${foundationId}.title`)}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/62">{t(`salesRecruiting.${foundationId}.intro`)}</p>
        </div>
        <ClassificationBadge classification={definition.classification} t={t} />
      </div>

      <div className="space-y-5">
        <StepList definition={definition} t={t} />
        <DoDont definition={definition} t={t} />
        <ScriptCard scriptId={definition.scriptId} t={t} />
        <ReferenceCard referenceId={definition.referenceId} t={t} />

        <article className="rounded-[1.5rem] border border-yellow-200/20 bg-yellow-400/[0.07] p-4 sm:p-5">
          <h4 className="flex items-center gap-2 text-base font-black text-yellow-50">
            <ArrowRight aria-hidden="true" size={19} /> {t('salesRecruiting.practiceTitle')}
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-white/72">{t(`salesRecruiting.task.${definition.taskId}`)}</p>
          <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-white/48">
            <ShieldCheck aria-hidden="true" size={15} /> {t('salesRecruiting.practiceBoundary')}
          </p>
        </article>

        {showCompliance && <SalesRecruitingComplianceNote t={t} />}
      </div>
    </section>
  );
}
