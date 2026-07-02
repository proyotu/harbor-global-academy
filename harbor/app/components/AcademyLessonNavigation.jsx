'use client';

import {
  CheckCircle2,
  Circle,
  Download,
  FileQuestion,
  FileText,
  PlayCircle,
  Video,
} from 'lucide-react';

const LABELS = {
  de: {
    title: 'Lektionen',
    content: 'Inhalt',
    video: 'Video',
    'video-placeholder': 'Video geplant',
    pdf: 'PDF',
    download: 'Download',
    quiz: 'Quiz',
    completed: 'Abgeschlossen',
    open: 'Offen',
  },
  en: {
    title: 'Lessons',
    content: 'Content',
    video: 'Video',
    'video-placeholder': 'Video planned',
    pdf: 'PDF',
    download: 'Download',
    quiz: 'Quiz',
    completed: 'Completed',
    open: 'Open',
  },
  ru: {
    title: 'Уроки',
    content: 'Материал',
    video: 'Видео',
    'video-placeholder': 'Видео запланировано',
    pdf: 'PDF',
    download: 'Загрузка',
    quiz: 'Тест',
    completed: 'Завершено',
    open: 'Открыто',
  },
  ro: {
    title: 'Lecții',
    content: 'Conținut',
    video: 'Video',
    'video-placeholder': 'Video planificat',
    pdf: 'PDF',
    download: 'Descărcare',
    quiz: 'Quiz',
    completed: 'Finalizat',
    open: 'Deschis',
  },
};

const ICONS = {
  content: FileText,
  video: PlayCircle,
  'video-placeholder': Video,
  pdf: FileText,
  download: Download,
  quiz: FileQuestion,
};

export default function AcademyLessonNavigation({
  lessons,
  activeLessonId,
  completedVideoIds = [],
  languageCode = 'de',
  onSelect,
}) {
  const labels = LABELS[languageCode] || LABELS.de;

  return (
    <aside className="min-w-0 rounded-[1.75rem] border border-white/10 bg-black/25 p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h4 className="text-lg font-black text-yellow-50">{labels.title}</h4>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/65">{lessons.length}</span>
      </div>
      <div className="grid gap-2">
        {lessons.map((lesson, index) => {
          const Icon = ICONS[lesson.type] || FileText;
          const selected = activeLessonId === lesson.id;
          const completed = lesson.type === 'video' && completedVideoIds.includes(lesson.resourceId);

          return (
            <button
              key={lesson.id}
              type="button"
              onClick={() => onSelect(lesson.id)}
              className={`flex min-w-0 items-start gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                selected
                  ? 'border-yellow-300/55 bg-yellow-400/12 shadow-lg shadow-yellow-500/5'
                  : 'border-white/10 bg-white/[0.04] hover:border-yellow-300/25 hover:bg-white/[0.07]'
              }`}
            >
              <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                selected ? 'bg-yellow-400 text-black' : 'bg-white/10 text-yellow-100'
              }`}>
                <Icon size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/40">
                  {index + 1}. {labels[lesson.type] || labels.content}
                </span>
                <span className="mt-1 block break-words text-sm font-black text-yellow-50">{lesson.title}</span>
                <span className={`mt-2 inline-flex items-center gap-1 text-[11px] font-bold ${completed ? 'text-emerald-200' : 'text-white/45'}`}>
                  {completed ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                  {completed ? labels.completed : labels.open}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
