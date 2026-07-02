'use client';

import {
  ImagePlus,
  PlayCircle,
  Search,
  Settings,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';

export const cmsWorkflowSteps = [
  { id: 'create', title: 'Erstellen', text: 'Inhalt anlegen und Struktur vorbereiten.', icon: ImagePlus },
  { id: 'edit', title: 'Bearbeiten', text: 'Titel, Beschreibung, Sprache und Zuordnung pflegen.', icon: Settings },
  { id: 'review', title: 'Prüfen', text: 'Qualität, Rechte und Sichtbarkeit kontrollieren.', icon: Search },
  { id: 'approve', title: 'Freigeben', text: 'Interne Freigabe vor Veröffentlichung vorbereiten.', icon: ShieldCheck },
  { id: 'publish', title: 'Veröffentlichen', text: 'Release planen oder Inhalte sichtbar machen.', icon: UploadCloud },
];

export function AdminPrototypeStatusBadge({ status }) {
  const statusMap = {
    approved: { label: 'Freigegeben', className: 'bg-emerald-400/15 text-emerald-100 ring-emerald-300/25' },
    pending: { label: 'Pending', className: 'bg-yellow-400/15 text-yellow-100 ring-yellow-300/25' },
    blocked: { label: 'Gesperrt', className: 'bg-red-400/15 text-red-100 ring-red-300/25' },
  };
  const item = statusMap[status] || statusMap.pending;

  return (
    <span className={`inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ring-1 ${item.className}`}>
      {item.label}
    </span>
  );
}

export function AdminPrototypeActionButton({ children, tone = 'neutral', onClick }) {
  const tones = {
    primary: 'bg-yellow-400 text-black hover:bg-yellow-300',
    danger: 'border border-red-300/25 bg-red-400/10 text-red-100 hover:bg-red-400/15',
    neutral: 'border border-white/10 bg-white/10 text-white hover:bg-white/15',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs font-black transition ${tones[tone] || tones.neutral}`}
    >
      {children}
    </button>
  );
}

export function AdminPrototypeMetricCard({ icon: Icon, label, value, trend }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:border-yellow-300/25 hover:bg-yellow-400/[0.07]">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
          <Icon size={19} />
        </span>
        <span className="rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-bold text-white/45">{trend}</span>
      </div>
      <p className="mt-5 text-3xl font-black text-yellow-50">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-white/42">{label}</p>
    </div>
  );
}

export function AdminCmsSectionCard({ section, renderStatusBadge }) {
  const Icon = section.icon;

  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-4 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-yellow-300/30 hover:bg-yellow-400/[0.08] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
          <Icon size={20} />
        </span>
        {renderStatusBadge(section.status)}
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-yellow-200">{section.category}</p>
      <h4 className="mt-2 break-words text-xl font-black text-yellow-50">{section.title}</h4>
      <p className="mt-2 break-words text-sm leading-relaxed text-white/55">{section.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <span className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-white/62">
          <strong className="block text-lg text-yellow-50">{section.count}</strong>
          Inhalte
        </span>
        <span className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-white/62">
          <strong className="block text-sm text-yellow-50">{section.language}</strong>
          Sprache
        </span>
      </div>
      <p className="mt-3 rounded-2xl bg-black/25 px-3 py-2 text-xs text-white/45">Letzter Stand: {section.lastUpdated}</p>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <AdminPrototypeActionButton>Bearbeiten</AdminPrototypeActionButton>
        <AdminPrototypeActionButton><PlayCircle size={14} /> Vorschau</AdminPrototypeActionButton>
        <AdminPrototypeActionButton tone="primary">Veröffentlichen</AdminPrototypeActionButton>
      </div>
    </div>
  );
}

export function AdminCmsWorkflowStep({ step, index }) {
  const Icon = step.icon;

  return (
    <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
          <Icon size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-white/40">Schritt {index + 1}</p>
          <h4 className="mt-1 break-words font-black text-yellow-50">{step.title}</h4>
          <p className="mt-2 break-words text-xs leading-relaxed text-white/50">{step.text}</p>
        </div>
      </div>
    </div>
  );
}
