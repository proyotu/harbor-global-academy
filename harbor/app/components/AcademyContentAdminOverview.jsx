import {
  BookOpen,
  Download,
  FileQuestion,
  FileText,
  PlayCircle,
  Video,
} from 'lucide-react';

function ContentCount({ icon: Icon, label, singular = label, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[11px] font-bold text-white/65">
      <Icon size={13} className="text-yellow-200" />
      {value} {value === 1 ? singular : label}
    </span>
  );
}

export default function AcademyContentAdminOverview({ modules }) {
  return (
    <div className="grid gap-3">
      {modules.map((module) => (
        <article key={module.id} className="rounded-3xl border border-white/10 bg-black/25 p-4">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">
                Position {module.order} · {module.category}
              </p>
              <h4 className="mt-2 break-words text-lg font-black text-yellow-50">{module.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{module.description}</p>
            </div>
            <span className="w-fit shrink-0 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-100">
              Nur Lesen
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <ContentCount icon={BookOpen} label="Lektionen" singular="Lektion" value={module.lessons.length} />
            <ContentCount icon={PlayCircle} label="Videos" singular="Video" value={module.resources.videos.length} />
            <ContentCount icon={Video} label="Geplant" value={module.resources.videoPlaceholders.length} />
            <ContentCount icon={FileText} label="PDFs" singular="PDF" value={module.resources.pdfs.length} />
            <ContentCount icon={FileQuestion} label="Quizfragen" singular="Quizfrage" value={module.resources.quizzes.length} />
            <ContentCount icon={Download} label="Downloads" singular="Download" value={module.resources.downloads.length} />
          </div>
        </article>
      ))}
    </div>
  );
}
