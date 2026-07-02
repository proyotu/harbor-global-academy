import {
  getAcademyLanguageCode,
  localizeAcademyValue,
} from './academy-content.js';

const localized = (de, en, ru, ro) => ({
  de,
  en: en || de,
  ru: ru || de,
  ro: ro || de,
});

export const ACADEMY_DOWNLOAD_CATEGORIES = [
  {
    id: 'presentations',
    label: localized('Präsentationen', 'Presentations', 'Презентации', 'Prezentări'),
  },
  {
    id: 'product-information',
    label: localized('Produktinformationen', 'Product information', 'Информация о продуктах', 'Informații produse'),
  },
  {
    id: 'onboarding',
    label: localized('Onboarding', 'Onboarding', 'Онбординг', 'Onboarding'),
  },
  {
    id: 'sales',
    label: localized('Verkauf', 'Sales', 'Продажи', 'Vânzări'),
  },
  {
    id: 'recruiting',
    label: localized('Recruiting', 'Recruiting', 'Рекрутинг', 'Recrutare'),
  },
  {
    id: 'social-media',
    label: localized('Social Media', 'Social media', 'Социальные сети', 'Social media'),
  },
  {
    id: 'other-downloads',
    label: localized('Weitere Downloads', 'Other downloads', 'Другие материалы', 'Alte descărcări'),
  },
];

export const ACADEMY_DOWNLOAD_TYPES = [
  { id: 'pdf', label: localized('PDF', 'PDF', 'PDF', 'PDF') },
  { id: 'docx', label: localized('DOCX', 'DOCX', 'DOCX', 'DOCX') },
  { id: 'xlsx', label: localized('XLSX', 'XLSX', 'XLSX', 'XLSX') },
  { id: 'pptx', label: localized('PPTX', 'PPTX', 'PPTX', 'PPTX') },
  { id: 'video', label: localized('Video', 'Video', 'Видео', 'Video') },
  { id: 'external', label: localized('Externer Link', 'External link', 'Внешняя ссылка', 'Link extern') },
];

export const ACADEMY_DOWNLOAD_CATALOG = [
  {
    id: 'kunden-preisliste',
    title: localized('Aqua Global Kunden Preisliste'),
    description: localized('Offizielle Kundeninformation mit Produkt- und Preisorientierung für Beratungsgespräche.'),
    categoryId: 'product-information',
    type: 'pdf',
    visibility: 'partner',
    source: 'protected-file',
    fileName: 'DOC_AG_Kunden_Preisliste.pdf',
    languageCodes: ['de'],
    modules: [3, 5, 10],
    tags: ['preise', 'kunden', 'beratung'],
    order: 10,
  },
  {
    id: 'your-world',
    title: localized('Your World Produktkatalog'),
    description: localized('Produktkatalog und Überblick über Aqua Global Lösungen für Kunden und Interessenten.'),
    categoryId: 'product-information',
    type: 'pdf',
    visibility: 'partner',
    source: 'protected-file',
    fileName: 'DOC_MA_Your_World.pdf',
    languageCodes: ['de'],
    modules: [2, 3, 10],
    tags: ['produktkatalog', 'produkte', 'kunden'],
    order: 20,
  },
  {
    id: 'wasser-praesentation',
    title: localized('Präsentation Wasser'),
    description: localized('Grundlagen zu Wasser, Wasserqualität, Umkehrosmose und Membranfiltration.'),
    categoryId: 'presentations',
    type: 'pdf',
    visibility: 'partner',
    source: 'protected-file',
    fileName: 'DOC_MA_Praesentation_Wasser.pdf',
    languageCodes: ['de'],
    modules: [2, 10],
    tags: ['wasser', 'umkehrosmose', 'präsentation'],
    order: 30,
  },
  {
    id: 'karriere-verdienstplan',
    title: localized('Karriere- und Verdienstplan'),
    description: localized('Interner Karriereplan mit Punkten, Stufen, Provisionen und Verdienstlogik.'),
    categoryId: 'onboarding',
    type: 'pdf',
    visibility: 'partner',
    source: 'protected-file',
    fileName: 'DOC_AG_Karriere_und_Verdienstplan.pdf',
    languageCodes: ['de'],
    modules: [5, 6, 10],
    tags: ['karriere', 'provision', 'partnerstart'],
    order: 40,
  },
  {
    id: 'vp-wasserbar',
    title: localized('VP Preisliste Wasserbar'),
    description: localized('Interne Vertriebspartner-Preisliste für Aqua Global Wasserbars.'),
    categoryId: 'sales',
    type: 'pdf',
    visibility: 'partner',
    source: 'protected-file',
    fileName: 'DOC_AG_Vertriebspartner_Preisliste_Wasserbar.pdf',
    languageCodes: ['de'],
    modules: [3, 5, 10],
    tags: ['partnerpreise', 'wasserbar', 'verkauf'],
    order: 50,
  },
  {
    id: 'vp-filter',
    title: localized('VP Filterpreisliste'),
    description: localized('Interne Filterpreise und Austauschlogik für Vertriebspartner.'),
    categoryId: 'sales',
    type: 'pdf',
    visibility: 'partner',
    source: 'protected-file',
    fileName: 'DOC_AG_Vertriebspartner_Filterpreisliste.pdf',
    languageCodes: ['de'],
    modules: [3, 5, 10],
    tags: ['partnerpreise', 'filter', 'service'],
    order: 60,
  },
  {
    id: 'vp-membranen',
    title: localized('VP Preisliste Membranen'),
    description: localized('Interne Membranpreise für Beratung, Service und Nachkauf.'),
    categoryId: 'sales',
    type: 'pdf',
    visibility: 'partner',
    source: 'protected-file',
    fileName: 'DOC_AG_Vertriebspartner_Preisliste_Membranen.pdf',
    languageCodes: ['de'],
    modules: [3, 5, 10],
    tags: ['partnerpreise', 'membranen', 'service'],
    order: 70,
  },
  {
    id: 'vp-zusatzartikel',
    title: localized('VP Preisliste Zusatzartikel'),
    description: localized('Interne Zusatzartikel, Zubehör und Serviceprodukte für Partner.'),
    categoryId: 'sales',
    type: 'pdf',
    visibility: 'partner',
    source: 'protected-file',
    fileName: 'DOC_AG_Vertriebspartner_Preisliste_Zusatzartikel.pdf',
    languageCodes: ['de'],
    modules: [3, 5, 10],
    tags: ['partnerpreise', 'zubehör', 'service'],
    order: 80,
  },
  {
    id: 'vp-drops-vitamine',
    title: localized('VP Preisliste Drops / Vitamine'),
    description: localized('Interne Preisliste für Drops, Vitamine und ergänzende Produkte.'),
    categoryId: 'sales',
    type: 'pdf',
    visibility: 'partner',
    source: 'protected-file',
    fileName: 'DOC_AG_Vertriebspartner_Preisliste_Drops_Vitamine.pdf',
    languageCodes: ['de'],
    modules: [3, 5, 10],
    tags: ['partnerpreise', 'drops', 'vitamine'],
    order: 90,
  },
  {
    id: 'rxt-praesentation',
    title: localized('Präsentation RXT Entkalkung'),
    description: localized('Schulungsunterlage für RXT-79, RXT-82, Entkalkung und Anwendungserklärung.'),
    categoryId: 'presentations',
    type: 'pdf',
    visibility: 'partner',
    source: 'protected-file',
    fileName: 'DOC_MA_Praesentation_RXT.pdf',
    languageCodes: ['de'],
    modules: [7, 10],
    tags: ['rxt', 'entkalkung', 'präsentation'],
    order: 100,
  },
];

const DOWNLOAD_CENTER_LABELS = {
  de: {
    title: 'Download Center',
    moduleTitle: 'Modul 8 · Download Center',
    description: 'Dokumente, Präsentationen und Partnerunterlagen zentral durchsuchen und sicher öffnen.',
    searchLabel: 'Downloads durchsuchen',
    searchPlaceholder: 'Titel, Beschreibung oder Dateiname',
    categoryLabel: 'Kategorie',
    typeLabel: 'Dateityp',
    allCategories: 'Alle Kategorien',
    allTypes: 'Alle Dateitypen',
    results: 'Ergebnisse',
    clearFilters: 'Filter zurücksetzen',
    noResultsTitle: 'Keine Downloads gefunden',
    noResultsText: 'Passe Suche oder Filter an. Für leere Kategorien werden keine künstlichen Dateien angezeigt.',
    public: 'Öffentlich',
    partner: 'Partner intern',
    language: 'Dokumentsprache',
    open: 'Öffnen',
    download: 'Herunterladen',
    openVideo: 'Video öffnen',
    openExternal: 'Extern öffnen',
    unavailable: 'In Vorbereitung',
    readOnly: 'Nur Lesen · keine Uploads oder Bearbeitung',
  },
  en: {
    title: 'Download Center',
    moduleTitle: 'Module 8 · Download Center',
    description: 'Search and securely open documents, presentations and partner resources in one place.',
    searchLabel: 'Search downloads',
    searchPlaceholder: 'Title, description or file name',
    categoryLabel: 'Category',
    typeLabel: 'File type',
    allCategories: 'All categories',
    allTypes: 'All file types',
    results: 'results',
    clearFilters: 'Reset filters',
    noResultsTitle: 'No downloads found',
    noResultsText: 'Adjust the search or filters. Empty categories do not receive placeholder files.',
    public: 'Public',
    partner: 'Partner only',
    language: 'Document language',
    open: 'Open',
    download: 'Download',
    openVideo: 'Open video',
    openExternal: 'Open externally',
    unavailable: 'In preparation',
    readOnly: 'Read-only · no uploads or editing',
  },
  ru: {
    title: 'Центр загрузок',
    moduleTitle: 'Модуль 8 · Центр загрузок',
    description: 'Единый поиск и безопасное открытие документов, презентаций и материалов для партнёров.',
    searchLabel: 'Поиск материалов',
    searchPlaceholder: 'Название, описание или имя файла',
    categoryLabel: 'Категория',
    typeLabel: 'Тип файла',
    allCategories: 'Все категории',
    allTypes: 'Все типы',
    results: 'результатов',
    clearFilters: 'Сбросить фильтры',
    noResultsTitle: 'Материалы не найдены',
    noResultsText: 'Измените поиск или фильтры. Для пустых категорий фиктивные файлы не создаются.',
    public: 'Открытый',
    partner: 'Только для партнёров',
    language: 'Язык документа',
    open: 'Открыть',
    download: 'Скачать',
    openVideo: 'Открыть видео',
    openExternal: 'Открыть ссылку',
    unavailable: 'В подготовке',
    readOnly: 'Только чтение · без загрузки и редактирования',
  },
  ro: {
    title: 'Centru de descărcări',
    moduleTitle: 'Modulul 8 · Centru de descărcări',
    description: 'Caută și deschide în siguranță documente, prezentări și materiale pentru parteneri.',
    searchLabel: 'Caută descărcări',
    searchPlaceholder: 'Titlu, descriere sau nume fișier',
    categoryLabel: 'Categorie',
    typeLabel: 'Tip fișier',
    allCategories: 'Toate categoriile',
    allTypes: 'Toate tipurile',
    results: 'rezultate',
    clearFilters: 'Resetează filtrele',
    noResultsTitle: 'Nu au fost găsite materiale',
    noResultsText: 'Modifică termenul de căutare sau filtrele. Categoriile goale nu primesc fișiere fictive.',
    public: 'Public',
    partner: 'Doar parteneri',
    language: 'Limba documentului',
    open: 'Deschide',
    download: 'Descarcă',
    openVideo: 'Deschide video',
    openExternal: 'Deschide extern',
    unavailable: 'În pregătire',
    readOnly: 'Doar citire · fără încărcare sau editare',
  },
};

export function getAcademyDownloadCategories(language = 'de') {
  const languageCode = getAcademyLanguageCode(language);

  return ACADEMY_DOWNLOAD_CATEGORIES.map((category) => ({
    ...category,
    label: localizeAcademyValue(category.label, languageCode),
  }));
}

export function getAcademyDownloadTypes(language = 'de') {
  const languageCode = getAcademyLanguageCode(language);

  return ACADEMY_DOWNLOAD_TYPES.map((type) => ({
    ...type,
    label: localizeAcademyValue(type.label, languageCode),
  }));
}

export function getAcademyDownloadLabels(language = 'de') {
  const languageCode = getAcademyLanguageCode(language);
  return DOWNLOAD_CENTER_LABELS[languageCode] || DOWNLOAD_CENTER_LABELS.de;
}

export function getAcademyDownloads(language = 'de') {
  const languageCode = getAcademyLanguageCode(language);
  const categoryLabels = new Map(
    getAcademyDownloadCategories(languageCode).map((category) => [category.id, category.label]),
  );

  return ACADEMY_DOWNLOAD_CATALOG
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((item) => ({
      ...item,
      title: localizeAcademyValue(item.title, languageCode),
      description: localizeAcademyValue(item.description, languageCode),
      category: categoryLabels.get(item.categoryId) || item.categoryId,
    }));
}

export function filterAcademyDownloads(items, {
  search = '',
  categoryId = 'all',
  type = 'all',
} = {}) {
  const normalizedSearch = String(search).trim().toLocaleLowerCase();

  return items.filter((item) => {
    if (categoryId !== 'all' && item.categoryId !== categoryId) {
      return false;
    }

    if (type !== 'all' && item.type !== type) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const searchableText = [
      item.title,
      item.description,
      item.category,
      item.fileName,
      ...(item.tags || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase();

    return searchableText.includes(normalizedSearch);
  });
}
