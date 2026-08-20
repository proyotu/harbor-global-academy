import {
  AlertTriangle,
  Atom,
  CheckCircle2,
  Droplets,
  Gauge,
  ShieldCheck,
  Sparkles,
  XCircle,
  Zap,
} from 'lucide-react';
import { getWaterKnowledgeDefinition } from '../app/lib/water-knowledge';

const conceptCards = [
  { id: 'water', icon: Droplets },
  { id: 'hydrogen', icon: Atom },
  { id: 'electrolytes', icon: Zap },
  { id: 'minerals', icon: Sparkles },
];

const osmosisFacts = ['pressure', 'membrane', 'streams'];
const osmosisLimits = ['performance', 'noAbsolute', 'officialData'];
const ppmShows = ['dissolved', 'conductivity', 'comparison'];
const ppmDoesNotShow = ['substances', 'microbes', 'health', 'totalQuality'];

function ClassificationBadge({ classification, t }) {
  return (
    <span className="inline-flex min-h-8 items-center rounded-full border border-yellow-200/20 bg-yellow-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-yellow-100">
      {t(`waterKnowledge.classification.${classification}`)}
    </span>
  );
}

function KnowledgeList({ items, prefix, tone = 'neutral', t }) {
  const Icon = tone === 'positive' ? CheckCircle2 : tone === 'warning' ? XCircle : ShieldCheck;
  const iconClass = tone === 'positive' ? 'text-emerald-300' : tone === 'warning' ? 'text-amber-300' : 'text-yellow-200';

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/72">
          <Icon aria-hidden="true" size={17} className={`mt-0.5 shrink-0 ${iconClass}`} />
          <span>{t(`${prefix}.${item}`)}</span>
        </li>
      ))}
    </ul>
  );
}

export function WaterKnowledgeComplianceNote({ t }) {
  return (
    <aside className="rounded-[1.5rem] border border-amber-200/25 bg-amber-400/[0.08] p-4 sm:p-5" aria-labelledby="water-compliance-note-title">
      <div className="flex gap-3">
        <AlertTriangle aria-hidden="true" size={21} className="mt-0.5 shrink-0 text-amber-200" />
        <div className="min-w-0">
          <h4 id="water-compliance-note-title" className="text-base font-black text-amber-50">
            {t('waterKnowledge.compliance.title')}
          </h4>
          <p className="mt-1 text-sm leading-relaxed text-white/68">{t('waterKnowledge.compliance.text')}</p>
        </div>
      </div>
    </aside>
  );
}

function WaterFoundations({ t }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {conceptCards.map(({ id, icon: Icon }) => (
          <article key={id} className="min-w-0 rounded-[1.5rem] border border-white/10 bg-black/25 p-4 sm:p-5">
            <Icon aria-hidden="true" size={22} className="text-yellow-200" />
            <h4 className="mt-3 text-lg font-black text-yellow-50">{t(`waterKnowledge.foundation.${id}.title`)}</h4>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{t(`waterKnowledge.foundation.${id}.text`)}</p>
          </article>
        ))}
      </div>

      <article className="rounded-[1.5rem] border border-sky-200/20 bg-sky-400/[0.06] p-4 sm:p-5">
        <div className="flex gap-3">
          <Zap aria-hidden="true" size={21} className="mt-0.5 shrink-0 text-sky-200" />
          <div>
            <h4 className="text-lg font-black text-sky-50">{t('waterKnowledge.electrolysis.title')}</h4>
            <p className="mt-2 text-sm leading-relaxed text-white/68">{t('waterKnowledge.electrolysis.text')}</p>
            <p className="mt-2 text-xs leading-relaxed text-white/48">{t('waterKnowledge.electrolysis.boundary')}</p>
          </div>
        </div>
      </article>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[1.5rem] border border-emerald-200/20 bg-emerald-400/[0.07] p-4 sm:p-5">
          <h4 className="text-base font-black text-emerald-50">{t('waterKnowledge.safeLanguage.betterTitle')}</h4>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{t('waterKnowledge.safeLanguage.betterWater')}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{t('waterKnowledge.safeLanguage.betterHydrogen')}</p>
        </article>
        <article className="rounded-[1.5rem] border border-red-200/20 bg-red-400/[0.07] p-4 sm:p-5">
          <h4 className="text-base font-black text-red-50">{t('waterKnowledge.safeLanguage.avoidTitle')}</h4>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{t('waterKnowledge.safeLanguage.avoidHealing')}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{t('waterKnowledge.safeLanguage.avoidAbsolute')}</p>
        </article>
      </div>

      <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
        <h4 className="text-base font-black text-yellow-50">{t('waterKnowledge.hydrogenBottle.title')}</h4>
        <p className="mt-2 text-sm leading-relaxed text-white/62">{t('waterKnowledge.hydrogenBottle.text')}</p>
        <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-amber-200">{t('waterKnowledge.officialSourceRequired')}</p>
      </article>

      <WaterKnowledgeComplianceNote t={t} />
    </div>
  );
}

function ReverseOsmosisKnowledge({ t }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-[1.5rem] border border-yellow-200/20 bg-yellow-400/[0.07] p-4 sm:p-5">
        <h4 className="text-lg font-black text-yellow-50">{t('waterKnowledge.osmosis.principleTitle')}</h4>
        <div className="mt-4"><KnowledgeList items={osmosisFacts} prefix="waterKnowledge.osmosis.fact" t={t} /></div>
      </article>
      <article className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4 sm:p-5">
        <h4 className="text-lg font-black text-yellow-50">{t('waterKnowledge.osmosis.limitsTitle')}</h4>
        <div className="mt-4"><KnowledgeList items={osmosisLimits} prefix="waterKnowledge.osmosis.limit" tone="warning" t={t} /></div>
      </article>
      <article className="rounded-[1.5rem] border border-emerald-200/20 bg-emerald-400/[0.07] p-4 sm:p-5 lg:col-span-2">
        <h4 className="text-base font-black text-emerald-50">{t('waterKnowledge.safeLanguage.betterTitle')}</h4>
        <p className="mt-2 text-sm leading-relaxed text-white/72">{t('waterKnowledge.safeLanguage.betterOsmosis')}</p>
      </article>
    </div>
  );
}

function PpmKnowledge({ t }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[1.5rem] border border-emerald-200/20 bg-emerald-400/[0.07] p-4 sm:p-5">
          <h4 className="flex items-center gap-2 text-lg font-black text-emerald-50">
            <Gauge aria-hidden="true" size={20} /> {t('waterKnowledge.ppm.showsTitle')}
          </h4>
          <div className="mt-4"><KnowledgeList items={ppmShows} prefix="waterKnowledge.ppm.shows" tone="positive" t={t} /></div>
        </article>
        <article className="rounded-[1.5rem] border border-amber-200/20 bg-amber-400/[0.07] p-4 sm:p-5">
          <h4 className="flex items-center gap-2 text-lg font-black text-amber-50">
            <AlertTriangle aria-hidden="true" size={20} /> {t('waterKnowledge.ppm.notShowsTitle')}
          </h4>
          <div className="mt-4"><KnowledgeList items={ppmDoesNotShow} prefix="waterKnowledge.ppm.notShows" tone="warning" t={t} /></div>
        </article>
      </div>
      <article className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4 sm:p-5">
        <h4 className="text-base font-black text-yellow-50">{t('waterKnowledge.ppm.measurementTitle')}</h4>
        <p className="mt-2 text-sm leading-relaxed text-white/68">{t('waterKnowledge.ppm.measurementText')}</p>
      </article>
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[1.5rem] border border-emerald-200/20 bg-emerald-400/[0.07] p-4 sm:p-5">
          <h4 className="text-base font-black text-emerald-50">{t('waterKnowledge.safeLanguage.betterTitle')}</h4>
          <p className="mt-2 text-sm leading-relaxed text-white/72">{t('waterKnowledge.safeLanguage.betterPpm')}</p>
        </article>
        <article className="rounded-[1.5rem] border border-red-200/20 bg-red-400/[0.07] p-4 sm:p-5">
          <h4 className="text-base font-black text-red-50">{t('waterKnowledge.safeLanguage.avoidTitle')}</h4>
          <p className="mt-2 text-sm leading-relaxed text-white/72">{t('waterKnowledge.safeLanguage.avoidPpm')}</p>
        </article>
      </div>
    </div>
  );
}

export default function WaterKnowledgePanel({ knowledgeId, t }) {
  const definition = getWaterKnowledgeDefinition(knowledgeId);

  if (!definition || typeof t !== 'function') {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-yellow-300/20 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.13),transparent_34%),rgba(0,0,0,0.32)] p-4 shadow-xl shadow-yellow-500/5 sm:p-6" aria-labelledby={`water-knowledge-${knowledgeId}`}>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">{t('waterKnowledge.eyebrow')}</p>
          <h3 id={`water-knowledge-${knowledgeId}`} className="mt-2 break-words text-2xl font-black text-yellow-50 sm:text-3xl">
            {t(`waterKnowledge.${knowledgeId}.title`)}
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/62">{t(`waterKnowledge.${knowledgeId}.intro`)}</p>
        </div>
        <ClassificationBadge classification={definition.classification} t={t} />
      </div>

      {knowledgeId === 'water-foundations' && <WaterFoundations t={t} />}
      {knowledgeId === 'reverse-osmosis' && <ReverseOsmosisKnowledge t={t} />}
      {knowledgeId === 'ppm-tds' && <PpmKnowledge t={t} />}
    </section>
  );
}
