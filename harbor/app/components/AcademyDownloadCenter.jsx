'use client';

import { useMemo, useState } from 'react';
import {
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  PlayCircle,
  Presentation,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Button } from '../../components/ui';
import {
  filterAcademyDownloads,
  getAcademyDownloadCategories,
  getAcademyDownloadLabels,
  getAcademyDownloads,
  getAcademyDownloadTypes,
} from '../lib/academy-downloads';

const TYPE_ICONS = {
  pdf: FileText,
  docx: FileText,
  xlsx: FileSpreadsheet,
  pptx: Presentation,
  video: PlayCircle,
  external: ExternalLink,
};

function getActionLabel(item, labels) {
  if (item.type === 'video') {
    return labels.openVideo;
  }

  if (item.type === 'external') {
    return labels.openExternal;
  }

  if (['docx', 'xlsx', 'pptx'].includes(item.type)) {
    return labels.download;
  }

  return labels.open;
}

function DownloadCenterCard({ item, labels, typeLabel, onOpen }) {
  const [message, setMessage] = useState('');
  const Icon = TYPE_ICONS[item.type] || Download;
  const hasSource = Boolean(item.href || item.fileName);
  const isPublic = item.visibility === 'public';

  const handleOpen = async () => {
    setMessage('');

    try {
      await onOpen(item);
    } catch (error) {
      setMessage(error.message || 'Download konnte nicht geöffnet werden.');
    }
  };

  return (
    <article
      data-testid={`download-card-${item.id}`}
      className="flex min-w-0 flex-col rounded-3xl border border-white/10 bg-black/25 p-4 sm:p-5"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-200 ring-1 ring-yellow-200/20">
          <Icon size={21} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/65">
              {typeLabel}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ring-1 ${isPublic ? 'bg-emerald-400/10 text-emerald-100 ring-emerald-200/20' : 'bg-yellow-400/10 text-yellow-100 ring-yellow-200/20'}`}>
              {isPublic ? labels.public : labels.partner}
            </span>
          </div>
          <h3 className="mt-3 break-words text-lg font-black leading-tight text-yellow-50">{item.title}</h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-yellow-200/70">{item.category}</p>
        </div>
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-white/60">{item.description}</p>

      <div className="mt-4 space-y-1 text-xs text-white/40">
        {item.fileName && <p className="break-all">{item.fileName}</p>}
        {item.languageCodes?.length > 0 && (
          <p>{labels.language}: {item.languageCodes.map((code) => code.toUpperCase()).join(', ')}</p>
        )}
      </div>

      {message && (
        <p className="mt-4 rounded-2xl border border-red-300/20 bg-red-400/10 px-3 py-2 text-xs text-red-100">
          {message}
        </p>
      )}

      <Button
        type="button"
        disabled={!hasSource}
        onClick={handleOpen}
        className="mt-4 w-full rounded-2xl bg-yellow-400 py-3 text-sm font-black text-black hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {item.type === 'external' ? <ExternalLink size={16} /> : <Download size={16} />}
        {hasSource ? getActionLabel(item, labels) : labels.unavailable}
      </Button>
    </article>
  );
}

export default function AcademyDownloadCenter({
  language = 'de',
  context = 'library',
  onOpen,
}) {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [type, setType] = useState('all');
  const items = useMemo(() => getAcademyDownloads(language), [language]);
  const categories = useMemo(() => getAcademyDownloadCategories(language), [language]);
  const types = useMemo(() => getAcademyDownloadTypes(language), [language]);
  const labels = useMemo(() => getAcademyDownloadLabels(language), [language]);
  const typeLabels = useMemo(() => new Map(types.map((item) => [item.id, item.label])), [types]);
  const categoryCounts = useMemo(() => items.reduce((counts, item) => ({
    ...counts,
    [item.categoryId]: (counts[item.categoryId] || 0) + 1,
  }), {}), [items]);
  const filteredItems = useMemo(() => filterAcademyDownloads(items, {
    search,
    categoryId,
    type,
  }), [categoryId, items, search, type]);
  const filtersActive = Boolean(search.trim() || categoryId !== 'all' || type !== 'all');

  const resetFilters = () => {
    setSearch('');
    setCategoryId('all');
    setType('all');
  };

  return (
    <section data-testid="academy-download-center" className="space-y-5">
      <div className="overflow-hidden rounded-[2rem] border border-yellow-300/15 bg-gradient-to-br from-yellow-400/10 via-black/35 to-black/55 p-4 sm:p-6">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-black">
                <FolderOpen size={22} />
              </span>
              <div className="min-w-0">
                <h2 className="break-words text-2xl font-black text-yellow-50 sm:text-3xl">
                  {context === 'module' ? labels.moduleTitle : labels.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{labels.description}</p>
              </div>
            </div>
          </div>
          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-100">
            <ShieldCheck size={14} /> {labels.readOnly}
          </span>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_180px]">
          <label className="min-w-0">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-white/50">{labels.searchLabel}</span>
            <span className="flex min-w-0 items-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-3">
              <Search size={17} className="shrink-0 text-yellow-200" />
              <input
                data-testid="download-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={labels.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/30"
                autoComplete="off"
              />
            </span>
          </label>

          <label className="min-w-0">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-white/50">{labels.categoryLabel}</span>
            <select
              data-testid="download-category-filter"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/80 px-3 py-3 text-sm text-white outline-none focus:border-yellow-300/40"
            >
              <option value="all">{labels.allCategories} ({items.length})</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label} ({categoryCounts[category.id] || 0})
                </option>
              ))}
            </select>
          </label>

          <label className="min-w-0">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-white/50">{labels.typeLabel}</span>
            <select
              data-testid="download-type-filter"
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-black/80 px-3 py-3 text-sm text-white outline-none focus:border-yellow-300/40"
            >
              <option value="all">{labels.allTypes}</option>
              {types.map((typeOption) => (
                <option key={typeOption.id} value={typeOption.id}>{typeOption.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p data-testid="download-result-count" className="text-sm font-bold text-white/65">
            {filteredItems.length} {labels.results}
          </p>
          {filtersActive && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X size={14} /> {labels.clearFilters}
            </button>
          )}
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filteredItems.map((item) => (
            <DownloadCenterCard
              key={item.id}
              item={item}
              labels={labels}
              typeLabel={typeLabels.get(item.type) || item.type.toUpperCase()}
              onOpen={onOpen}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-white/15 bg-black/20 px-5 py-12 text-center">
          <FolderOpen size={38} className="mx-auto text-yellow-200/70" />
          <h3 className="mt-4 text-xl font-black text-yellow-50">{labels.noResultsTitle}</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/55">{labels.noResultsText}</p>
          {filtersActive && (
            <Button type="button" onClick={resetFilters} className="mt-5 rounded-2xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300">
              <X size={16} /> {labels.clearFilters}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
