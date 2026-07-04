'use client';

import { useMemo, useState } from 'react';
import {
  Download,
  ExternalLink,
  FileText,
  Flame,
  FolderOpen,
  Globe2,
  ImagePlus,
  Instagram,
  Megaphone,
  MessageCircle,
  Search,
  Settings,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  Sun,
  Users,
  Video,
} from 'lucide-react';
import { createI18nTranslator } from './i18n-extension';
import { Button } from './ui';

export const mediaCenterConfig = {
  telegramPlaceholderUrl: 'https://t.me/+ZIERjys5o05iODIy',
  providerLabel: 'Telegram-Materialbibliothek',
  storageMode: 'Extern bereitgestellt',
};

const mediaStatusMeta = {
  new: { label: 'Neu', className: 'border-green-300/25 bg-green-400/10 text-green-100' },
  updated: { label: 'Aktualisiert', className: 'border-blue-300/25 bg-blue-400/10 text-blue-100' },
  popular: { label: 'Beliebt', className: 'border-yellow-300/25 bg-yellow-400/10 text-yellow-100' },
  planned: { label: 'Geplant', className: 'border-white/10 bg-white/10 text-white/55' },
};

const mediaTypeFilters = [
  { id: 'all', labelKey: 'all', label: 'Alle' },
  { id: 'product', labelKey: 'mediaFilterProduct', label: 'Produkte' },
  { id: 'social', labelKey: 'mediaFilterSocial', label: 'Social Media' },
  { id: 'campaign', labelKey: 'mediaFilterCampaign', label: 'Kampagnen' },
  { id: 'brand', labelKey: 'mediaFilterBrand', label: 'Branding' },
  { id: 'recruiting', labelKey: 'mediaFilterRecruiting', label: 'Recruiting' },
];

const mediaCategoryTranslationKeys = {
  'product-images': ['mediaProductImagesTitle', 'mediaProductImagesText'],
  'product-videos': ['mediaProductVideosTitle', 'mediaProductVideosText'],
  'social-reels': ['mediaReelsTitle', 'mediaReelsText'],
  'instagram-stories': ['mediaStoriesTitle', 'mediaStoriesText'],
  'whatsapp-status': ['mediaWhatsappTitle', 'mediaWhatsappText'],
  logos: ['mediaLogosTitle', 'mediaLogosText'],
  flyer: ['mediaFlyerTitle', 'mediaFlyerText'],
  recruiting: ['mediaRecruitingTitle', 'mediaRecruitingText'],
  campaigns: ['mediaCampaignsTitle', 'mediaCampaignsText'],
  'black-friday': ['mediaBlackFridayTitle', 'mediaBlackFridayText'],
  'summer-campaign': ['mediaSummerTitle', 'mediaSummerText'],
  'winter-campaign': ['mediaWinterTitle', 'mediaWinterText'],
  'christmas-campaign': ['mediaChristmasTitle', 'mediaChristmasText'],
  'other-downloads': ['mediaOtherDownloadsTitle', 'mediaOtherDownloadsText'],
};

function getMediaCategoryText(category, t) {
  const [titleKey, descriptionKey] = mediaCategoryTranslationKeys[category.id] || [];

  return {
    title: t(titleKey, category.title),
    description: t(descriptionKey, category.description),
  };
}

export const mediaCenterCategories = [
  {
    id: 'product-images',
    title: 'Produktbilder',
    description: 'Freigegebene Produktfotos, Detailbilder und Bildmaterial für Beratung und Social Media.',
    type: 'product',
    status: 'updated',
    fileCountLabel: 'Anzahl folgt',
    lastUpdateLabel: 'Telegram-Platzhalter',
    icon: ImagePlus,
    telegramUrl: mediaCenterConfig.telegramPlaceholderUrl,
  },
  {
    id: 'product-videos',
    title: 'Produktvideos',
    description: 'Kurze Produktclips, Demonstrationen und Material für Stories, Reels und Kundengespräche.',
    type: 'product',
    status: 'new',
    fileCountLabel: 'Anzahl folgt',
    lastUpdateLabel: 'Telegram-Platzhalter',
    icon: Video,
    telegramUrl: mediaCenterConfig.telegramPlaceholderUrl,
  },
  {
    id: 'social-reels',
    title: 'Social Media Reels',
    description: 'Reel-Ideen, Video-Snippets und Vorlagen für mehr Sichtbarkeit im Alltag.',
    type: 'social',
    status: 'popular',
    fileCountLabel: 'Sammlung folgt',
    lastUpdateLabel: 'extern gepflegt',
    icon: Instagram,
    telegramUrl: mediaCenterConfig.telegramPlaceholderUrl,
  },
  {
    id: 'instagram-stories',
    title: 'Instagram Stories',
    description: 'Story-Vorlagen, Sequenzen und CTA-Ideen für tägliche Kommunikation.',
    type: 'social',
    status: 'updated',
    fileCountLabel: 'Sammlung folgt',
    lastUpdateLabel: 'extern gepflegt',
    icon: Sparkles,
    telegramUrl: mediaCenterConfig.telegramPlaceholderUrl,
  },
  {
    id: 'whatsapp-status',
    title: 'WhatsApp Status',
    description: 'Statusbilder, kurze Texte und Follow-up-Impulse für bestehende Kontakte.',
    type: 'social',
    status: 'new',
    fileCountLabel: 'Sammlung folgt',
    lastUpdateLabel: 'extern gepflegt',
    icon: MessageCircle,
    telegramUrl: mediaCenterConfig.telegramPlaceholderUrl,
  },
  {
    id: 'logos',
    title: 'Logos',
    description: 'Branding, Logo-Varianten und visuelle Richtlinien für einheitliche Auftritte.',
    type: 'brand',
    status: 'planned',
    fileCountLabel: 'noch offen',
    lastUpdateLabel: 'Link vorbereiten',
    icon: Globe2,
    telegramUrl: null,
  },
  {
    id: 'flyer',
    title: 'Flyer',
    description: 'Flyer, PDF-Vorlagen und druckfähige Materialien für Kundengespräche.',
    type: 'brand',
    status: 'planned',
    fileCountLabel: 'noch offen',
    lastUpdateLabel: 'Link vorbereiten',
    icon: FileText,
    telegramUrl: null,
  },
  {
    id: 'recruiting',
    title: 'Recruiting',
    description: 'Material für Einladungen, Erstgespräche, Follow-ups und Partneraufbau.',
    type: 'recruiting',
    status: 'updated',
    fileCountLabel: 'Sammlung folgt',
    lastUpdateLabel: 'extern gepflegt',
    icon: Users,
    telegramUrl: mediaCenterConfig.telegramPlaceholderUrl,
  },
  {
    id: 'campaigns',
    title: 'Kampagnen',
    description: 'Zentrale Sammlung für laufende und geplante Kampagnenmaterialien.',
    type: 'campaign',
    status: 'new',
    fileCountLabel: 'Kampagnen folgen',
    lastUpdateLabel: 'Telegram-Platzhalter',
    icon: Megaphone,
    telegramUrl: mediaCenterConfig.telegramPlaceholderUrl,
  },
  {
    id: 'black-friday',
    title: 'Black Friday',
    description: 'Aktionsmaterial, Story-Ideen, Reels und WhatsApp-Texte für Black-Friday-Kampagnen.',
    type: 'campaign',
    status: 'planned',
    fileCountLabel: 'geplant',
    lastUpdateLabel: 'Link vorbereiten',
    icon: Flame,
    telegramUrl: null,
  },
  {
    id: 'summer-campaign',
    title: 'Sommeraktion',
    description: 'Sommerbezogene Produkt-, Story- und Gesprächsimpulse für Aktionsphasen.',
    type: 'campaign',
    status: 'updated',
    fileCountLabel: 'Sammlung folgt',
    lastUpdateLabel: 'Telegram-Platzhalter',
    icon: Sun,
    telegramUrl: mediaCenterConfig.telegramPlaceholderUrl,
  },
  {
    id: 'winter-campaign',
    title: 'Winteraktion',
    description: 'Winterkampagnen, saisonale Story-Ideen und Beratungsmaterial.',
    type: 'campaign',
    status: 'planned',
    fileCountLabel: 'geplant',
    lastUpdateLabel: 'Link vorbereiten',
    icon: Snowflake,
    telegramUrl: null,
  },
  {
    id: 'christmas-campaign',
    title: 'Weihnachtsaktion',
    description: 'Weihnachtliche Kampagnenideen, Geschenk-Argumente und Vorlagen.',
    type: 'campaign',
    status: 'planned',
    fileCountLabel: 'geplant',
    lastUpdateLabel: 'Link vorbereiten',
    icon: Star,
    telegramUrl: null,
  },
  {
    id: 'other-downloads',
    title: 'Sonstige Downloads',
    description: 'Sammelbereich für zusätzliche Vorlagen, Dateien und externe Materialien.',
    type: 'brand',
    status: 'planned',
    fileCountLabel: 'offen',
    lastUpdateLabel: 'Link vorbereiten',
    icon: Download,
    telegramUrl: null,
  },
];

function getCategoryLink(category) {
  return category.telegramUrl || '';
}

export function getMediaCategoryById(categoryId) {
  return mediaCenterCategories.find((category) => category.id === categoryId) || null;
}

export function getCampaignMediaLink(campaign) {
  const campaignName = String(campaign?.name || '').toLowerCase();

  if (campaignName.includes('sommer')) {
    return getCategoryLink(getMediaCategoryById('summer-campaign')) || mediaCenterConfig.telegramPlaceholderUrl;
  }

  if (campaignName.includes('winter')) {
    return getCategoryLink(getMediaCategoryById('winter-campaign')) || mediaCenterConfig.telegramPlaceholderUrl;
  }

  if (campaignName.includes('black friday')) {
    return getCategoryLink(getMediaCategoryById('black-friday')) || mediaCenterConfig.telegramPlaceholderUrl;
  }

  return getCategoryLink(getMediaCategoryById('campaigns')) || mediaCenterConfig.telegramPlaceholderUrl;
}

function MediaStatusBadge({ status, t }) {
  const meta = mediaStatusMeta[status] || mediaStatusMeta.planned;

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${meta.className}`}>
      {t?.(status, meta.label) || meta.label}
    </span>
  );
}

function MediaCategoryCard({ category, t }) {
  const Icon = category.icon;
  const link = getCategoryLink(category);
  const localized = getMediaCategoryText(category, t);

  return (
    <article className="rounded-[1.6rem] border border-white/10 bg-white/[0.055] p-4 text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-yellow-300/30 hover:bg-yellow-400/[0.08] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
          <Icon size={20} />
        </span>
        <MediaStatusBadge status={category.status} t={t} />
      </div>
      <h3 className="mt-4 break-words text-lg font-black text-yellow-50">{localized.title}</h3>
      <p className="mt-2 break-words text-sm leading-relaxed text-white/58">{localized.description}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
          <p className="text-xs text-white/42">{t('files')}</p>
          <p className="mt-1 text-sm font-black text-yellow-50">{category.fileCountLabel}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
          <p className="text-xs text-white/42">{t('lastUpdate')}</p>
          <p className="mt-1 text-sm font-black text-yellow-50">{category.lastUpdateLabel}</p>
        </div>
      </div>
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
        >
          {t('mediaOpenButton')} <ExternalLink size={15} />
        </a>
      ) : (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3 text-xs leading-relaxed text-white/48">
          {t('mediaNoLink')}
        </div>
      )}
    </article>
  );
}

function AdminMediaBlueprintPanel({ Panel, t }) {
  return (
    <Panel title={t('mediaAdminTitle')} icon={ShieldCheck}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {['mediaConfigLink', 'mediaConfigActive', 'mediaConfigStatus', 'mediaConfigNote'].map((item) => (
          <div key={item} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
            <Settings size={18} className="text-yellow-200" />
            <p className="mt-3 font-black text-yellow-50">{t(item)}</p>
            <p className="mt-2 text-xs leading-relaxed text-white/45">{t('noStorageActive')}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-[1.5rem] border border-yellow-300/15 bg-yellow-400/10 p-4 text-sm leading-relaxed text-yellow-100">
        {t('mediaAdminSecurityHint', 'Spätere Admin-Logik sollte Links versionieren, Zielgruppen prüfen und Materialstatus nicht clientseitig als Wahrheit behandeln.')}
      </div>
    </Panel>
  );
}

export function CampaignMediaActionButton({ campaign, t: providedT }) {
  const t = providedT || createI18nTranslator('de');
  const link = getCampaignMediaLink(campaign);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-yellow-300/25 bg-yellow-400/10 px-4 py-3 text-sm font-black text-yellow-100 transition hover:bg-yellow-400 hover:text-black sm:w-auto"
    >
      {t('mediaCampaignButton')} <ExternalLink size={15} />
    </a>
  );
}

export function MediaGrowthPanel({ Panel, onNavigate, dependencies = {} }) {
  const t = dependencies.t || createI18nTranslator(dependencies.language, dependencies.copy);
  const previewItems = [
    { title: t('mediaReelsTitle'), text: t('mediaReelsText'), icon: Video },
    { title: t('mediaStoriesTitle'), text: t('mediaStoriesText'), icon: Instagram },
    { title: t('mediaWhatsappTitle'), text: t('mediaWhatsappText'), icon: MessageCircle },
    { title: t('mediaProductImagesTitle'), text: t('mediaProductImagesText'), icon: ImagePlus },
    { title: t('mediaCampaignsTitle'), text: t('mediaCampaignsText'), icon: Megaphone },
  ];

  return (
    <Panel title={t('mediaGrowthTitle')} icon={FolderOpen}>
      <p className="mb-4 text-sm leading-relaxed text-white/60">
        {t('mediaGrowthText')}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {previewItems.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
              <Icon size={18} className="text-yellow-200" />
              <p className="mt-3 font-black text-yellow-50">{item.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/50">{item.text}</p>
            </div>
          );
        })}
      </div>
      <Button type="button" onClick={() => onNavigate?.('media')} className="mt-5 w-full rounded-2xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300 sm:w-auto">
        {t('mediaOpenCenter')}
      </Button>
    </Panel>
  );
}

export function MediaCenterSection({ isAdmin = false, isLeader = false, dependencies }) {
  const { Panel, Stat, NotificationEmptyState } = dependencies;
  const t = dependencies.t || createI18nTranslator(dependencies.language, dependencies.copy);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState('all');
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const categoriesWithLinks = mediaCenterCategories.filter((category) => Boolean(getCategoryLink(category))).length;
  const filteredCategories = useMemo(() => (
    mediaCenterCategories.filter((category) => {
      const matchesType = activeType === 'all' || category.type === activeType;
      const localized = getMediaCategoryText(category, t);
      const haystack = `${localized.title} ${localized.description} ${category.status}`.toLowerCase();
      const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch);

      return matchesType && matchesSearch;
    })
  ), [activeType, normalizedSearch, t]);

  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-400/[0.16] via-white/[0.055] to-black/55 p-5 text-white shadow-2xl shadow-yellow-500/10 sm:p-6 lg:p-8">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-200">{t('mediaHeroKicker')}</p>
            <h2 className="mt-3 break-words text-3xl font-black text-yellow-50 sm:text-4xl">{t('mediaHeroTitle')}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65 sm:text-base">
              {t('mediaHeroText')}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <Stat icon={FolderOpen} label={t('mediaCategoriesCount')} value={mediaCenterCategories.length} />
            <Stat icon={ExternalLink} label={t('mediaLinksPrepared')} value={categoriesWithLinks} />
            <Stat icon={ShieldCheck} label={t('mediaStorage')} value={t('mediaStorageExternal')} />
          </div>
        </div>
      </div>

      <Panel title={t('mediaSearchTitle')} icon={Search}>
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <label className="block">
            <span className="text-xs font-black uppercase tracking-[0.14em] text-white/45">{t('search')}</span>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white">
              <Search size={18} className="shrink-0 text-yellow-200" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t('mediaSearchPlaceholder')}
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/35"
              />
            </div>
          </label>
          <div className="flex flex-wrap gap-2">
            {mediaTypeFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveType(filter.id)}
                className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.1em] transition ${activeType === filter.id ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white/65 hover:bg-white/15'}`}
              >
                {t(filter.labelKey, filter.label)}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <div className="rounded-[1.5rem] border border-yellow-300/15 bg-yellow-400/10 p-4 text-sm leading-relaxed text-yellow-100">
        {t('mediaExternalNotice')}
      </div>

      {filteredCategories.length ? (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredCategories.map((category) => (
            <MediaCategoryCard key={category.id} category={category} t={t} />
          ))}
        </section>
      ) : (
        <NotificationEmptyState title={t('mediaNoCategoryTitle')} text={t('mediaNoCategoryText')} />
      )}

      <Panel title={t('roleModelPrepared')} icon={Users}>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { title: t('partner'), text: t('mediaPartnerText') },
            { title: t('leader'), text: t('mediaLeaderText') },
            { title: t('admin'), text: t('mediaAdminText') },
          ].map((item) => (
            <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
              <p className="font-black text-yellow-50">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{item.text}</p>
            </div>
          ))}
        </div>
        {isLeader && !isAdmin && <p className="mt-4 text-xs leading-relaxed text-yellow-100">{t('mediaLeaderNote', 'Leader-Hinweis: Teambezogene Materialsteuerung bleibt UI-only, bis sichere Teamdaten angebunden sind.')}</p>}
      </Panel>

      {isAdmin && <AdminMediaBlueprintPanel Panel={Panel} t={t} />}

      <Panel title={t('futureIntegrations')} icon={Settings}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {['Telegram-Kanal', 'Telegram-Gruppe', 'Google Drive', 'R2 / CMS'].map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="font-black text-yellow-50">{item}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/45">{t('integrationPrepared')}</p>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}
