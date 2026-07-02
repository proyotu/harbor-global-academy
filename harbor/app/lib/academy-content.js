const localized = (de, en, ru, ro) => ({
  de,
  en: en || de,
  ru: ru || de,
  ro: ro || de,
});

const contentLesson = (id, title, description = localized('Modulübersicht')) => ({
  id,
  type: 'content',
  title,
  description,
});

const videoLesson = (id, resourceId, title, description, learningGoal) => ({
  id,
  type: 'video',
  resourceId,
  title,
  description,
  learningGoal,
});

const documentLesson = (id, resourceId, title) => ({
  id,
  type: 'pdf',
  resourceId,
  title,
  description: localized(
    'Geschütztes Academy-Dokument öffnen.',
    'Open the protected Academy document.',
    'Открыть защищённый документ Academy.',
    'Deschide documentul protejat al Academiei.',
  ),
});

const placeholderVideoLesson = (id, resourceId, title, description) => ({
  id,
  type: 'video-placeholder',
  resourceId,
  title,
  description,
});

export const ACADEMY_CONTENT_LANGUAGE_CODES = ['de', 'en', 'ru', 'ro'];

export const ACADEMY_QUIZ_CATALOG = [
  {
    id: 'q-water-life',
    moduleId: 2,
    question: localized(
      'Warum ist Wasserqualität ein zentrales Thema im Kundengespräch?',
      'Why is water quality a central topic in customer conversations?',
      'Почему качество воды является важной темой в разговоре с клиентом?',
      'De ce este calitatea apei un subiect central în discuția cu clientul?',
    ),
    options: [
      localized(
        'Weil Wasser täglich genutzt wird und Beratung verständlich macht',
        'Because water is used daily and makes the consultation tangible',
        'Потому что вода используется ежедневно и делает консультацию понятной',
        'Pentru că apa este folosită zilnic și face consultanța ușor de înțeles',
      ),
      localized(
        'Weil Module dadurch kürzer werden',
        'Because modules become shorter',
        'Потому что модули становятся короче',
        'Pentru că modulele devin mai scurte',
      ),
      localized(
        'Weil nur Grenzwerte zählen',
        'Because only limit values matter',
        'Потому что важны только предельные значения',
        'Pentru că doar valorile-limită contează',
      ),
    ],
    correct: 0,
  },
  {
    id: 'q-osmosis',
    moduleId: 3,
    question: localized(
      'Was ist der Kern der Umkehrosmose-Erklärung?',
      'What is the core of the reverse-osmosis explanation?',
      'В чём суть объяснения обратного осмоса?',
      'Care este esența explicației despre osmoza inversă?',
    ),
    options: [
      localized(
        'Membranfiltration trennt viele gelöste Stoffe vom Wasser',
        'Membrane filtration separates many dissolved substances from water',
        'Мембранная фильтрация отделяет от воды многие растворённые вещества',
        'Filtrarea cu membrană separă multe substanțe dizolvate din apă',
      ),
      localized(
        'Eine Filterkanne ersetzt jede Membran',
        'A filter jug replaces every membrane',
        'Фильтр-кувшин заменяет любую мембрану',
        'O cană filtrantă înlocuiește orice membrană',
      ),
      localized(
        'Es geht nur um Geschmack',
        'It is only about taste',
        'Речь идёт только о вкусе',
        'Este vorba doar despre gust',
      ),
    ],
    correct: 0,
  },
  {
    id: 'q-career',
    moduleId: 4,
    question: localized(
      'Was zeigt der Karriereplan in der Academy?',
      'What does the career plan show in the Academy?',
      'Что показывает карьерный план в Academy?',
      'Ce arată planul de carieră în Academie?',
    ),
    options: [
      localized('Level, Punkte und Fortschritt', 'Levels, points and progress', 'Уровни, баллы и прогресс', 'Niveluri, puncte și progres'),
      localized('Nur Chat-Nachrichten', 'Only chat messages', 'Только сообщения чата', 'Doar mesaje de chat'),
      localized('Nur Instagram-Profile', 'Only Instagram profiles', 'Только профили Instagram', 'Doar profiluri Instagram'),
    ],
    correct: 0,
  },
  {
    id: 'q-prices',
    moduleId: 5,
    question: localized(
      'Wie sind interne Partnerpreise zu behandeln?',
      'How must internal partner prices be handled?',
      'Как следует обращаться с внутренними партнёрскими ценами?',
      'Cum trebuie tratate prețurile interne pentru parteneri?',
    ),
    options: [
      localized('Nicht öffentlich posten', 'Do not post them publicly', 'Не публиковать открыто', 'Nu le publica public'),
      localized('An jeden Interessenten senden', 'Send them to every prospect', 'Отправлять каждому заинтересованному', 'Trimite-le fiecărui prospect'),
      localized('In Social Media veröffentlichen', 'Publish them on social media', 'Публиковать в социальных сетях', 'Publică-le pe rețelele sociale'),
    ],
    correct: 0,
  },
  {
    id: 'q-customer-order',
    moduleId: 6,
    question: localized(
      'Wo findet die Kundenbestellung statt?',
      'Where does the customer order take place?',
      'Где оформляется заказ клиента?',
      'Unde este realizată comanda clientului?',
    ),
    options: [
      localized(
        'Über die offiziellen Aqua Global Wege',
        'Through the official Aqua Global channels',
        'Через официальные каналы Aqua Global',
        'Prin canalele oficiale Aqua Global',
      ),
      localized('Innerhalb des Academy-Chats', 'Inside the Academy chat', 'В чате Academy', 'În chatul Academiei'),
      localized('Über Testimonials', 'Through testimonials', 'Через отзывы', 'Prin testimoniale'),
    ],
    correct: 0,
  },
  {
    id: 'q-partner-build',
    moduleId: 9,
    question: localized(
      'Was ist beim Partneraufbau wichtig?',
      'What is important when building a partner team?',
      'Что важно при построении партнёрской команды?',
      'Ce este important în dezvoltarea unei echipe de parteneri?',
    ),
    options: [
      localized(
        'Offizielle Registrierung und klare Einarbeitung trennen',
        'Keep official registration and structured onboarding separate',
        'Разделять официальную регистрацию и структурированное обучение',
        'Separă înregistrarea oficială de instruirea structurată',
      ),
      localized('Rabattcodes geheim halten', 'Keep discount codes secret', 'Хранить коды скидки в тайне', 'Păstrează codurile de reducere secrete'),
      localized('Keine Fragen beantworten', 'Do not answer questions', 'Не отвечать на вопросы', 'Nu răspunde la întrebări'),
    ],
    correct: 0,
  },
  {
    id: 'q-ppm',
    moduleId: 10,
    question: localized(
      'Wofür wird PPM im Testlabor genutzt?',
      'What is PPM used for in the test lab?',
      'Для чего используется PPM в тестовой лаборатории?',
      'Pentru ce este folosit PPM în laboratorul de testare?',
    ),
    options: [
      localized(
        'Zur Einordnung von Messwerten und Demonstrationen',
        'To classify measurements and demonstrations',
        'Для интерпретации измерений и демонстраций',
        'Pentru interpretarea măsurătorilor și demonstrațiilor',
      ),
      localized('Als Passwort', 'As a password', 'Как пароль', 'Ca parolă'),
      localized('Als Kalendertermin', 'As a calendar appointment', 'Как встреча в календаре', 'Ca programare în calendar'),
    ],
    correct: 0,
  },
  {
    id: 'q-basil',
    moduleId: 10,
    question: localized(
      'Warum ist der Basilikum-Test hilfreich?',
      'Why is the basil test helpful?',
      'Почему тест с базиликом полезен?',
      'De ce este util testul cu busuioc?',
    ),
    options: [
      localized(
        'Er zeigt einen natürlichen Langzeitvergleich',
        'It shows a natural long-term comparison',
        'Он показывает естественное долгосрочное сравнение',
        'Arată o comparație naturală pe termen lung',
      ),
      localized('Er ersetzt jede Beratung', 'It replaces every consultation', 'Он заменяет любую консультацию', 'Înlocuiește orice consultanță'),
      localized('Er misst Login-Daten', 'It measures login data', 'Он измеряет данные входа', 'Măsoară datele de autentificare'),
    ],
    correct: 0,
  },
];

export const ACADEMY_CONTENT_CATALOG = [
  {
    id: 1,
    order: 1,
    iconKey: 'crown',
    title: localized('Willkommen / Startcenter', 'Welcome / Start Center', 'Добро пожаловать / Стартовый центр', 'Bun venit / Centru de start'),
    description: localized(
      'Orientierung, Partnerstart und persönliches Onboarding.',
      'Orientation, partner start and personal onboarding.',
      'Ориентация, старт партнёра и персональный онбординг.',
      'Orientare, startul partenerului și onboarding personal.',
    ),
    category: localized('Onboarding', 'Onboarding', 'Онбординг', 'Onboarding'),
    resources: {
      videos: [],
      videoPlaceholders: ['academy-welcome-placeholder'],
      pdfs: [],
      quizzes: [],
      downloads: [],
    },
    lessons: [
      contentLesson('welcome-overview', localized('Dein Academy-Start', 'Your Academy start', 'Ваш старт в Academy', 'Startul tău în Academie')),
      placeholderVideoLesson(
        'welcome-video',
        'academy-welcome-placeholder',
        localized('Willkommensvideo', 'Welcome video', 'Приветственное видео', 'Videoclip de bun venit'),
        localized(
          'Der Video-Slot ist vorbereitet; aktuell wird noch kein echtes Video ausgeliefert.',
          'The video slot is prepared; no actual video is delivered yet.',
          'Место для видео подготовлено; фактическое видео пока не опубликовано.',
          'Spațiul video este pregătit; momentan nu este publicat un videoclip real.',
        ),
      ),
    ],
  },
  {
    id: 2,
    order: 2,
    iconKey: 'book',
    title: localized('Aqua Global Grundlagen', 'Aqua Global Basics', 'Основы Aqua Global', 'Bazele Aqua Global'),
    description: localized(
      'Wasserwissen und seriöse Grundlagen für Kundengespräche.',
      'Water knowledge and reliable foundations for customer conversations.',
      'Знания о воде и надёжная основа для разговоров с клиентами.',
      'Cunoștințe despre apă și baze corecte pentru discuțiile cu clienții.',
    ),
    category: localized('Grundlagen', 'Basics', 'Основы', 'Noțiuni de bază'),
    resources: {
      videos: ['wasser-ist-leben', 'allgemeine-ernaehrungsweise', 'funktionen-wasser-koerper', 'mineralien', 'grenzwerte'],
      videoPlaceholders: [],
      pdfs: ['your-world', 'wasser-praesentation'],
      quizzes: ['q-water-life'],
      downloads: [],
    },
    lessons: [
      contentLesson('basics-overview', localized('Lernziele und Wasserwissen', 'Learning goals and water knowledge', 'Цели обучения и знания о воде', 'Obiective și cunoștințe despre apă')),
      videoLesson('video-water-life', 'wasser-ist-leben', localized('Wasser ist Leben', 'Water is life', 'Вода — это жизнь', 'Apa este viață'), localized('Bedeutung von Wasser und Wasserqualität.', 'The importance of water and water quality.', 'Значение воды и её качества.', 'Importanța apei și a calității sale.'), localized('Wasserqualität als Beratungsgrundlage verstehen.', 'Understand water quality as a consultation foundation.', 'Понимать качество воды как основу консультации.', 'Înțelege calitatea apei ca bază a consultanței.')),
      videoLesson('video-nutrition', 'allgemeine-ernaehrungsweise', localized('Allgemeine Ernährungsweise', 'General nutrition', 'Общие принципы питания', 'Alimentație generală'), localized('Wasser im Kontext bewusster Ernährung.', 'Water in the context of conscious nutrition.', 'Вода в контексте осознанного питания.', 'Apa în contextul alimentației conștiente.'), localized('Wasser verständlich in Ernährungsgespräche einordnen.', 'Place water clearly in nutrition conversations.', 'Понятно связывать воду с темой питания.', 'Integrează clar apa în discuțiile despre alimentație.')),
      videoLesson('video-body', 'funktionen-wasser-koerper', localized('Funktionen von Wasser im Körper', 'Functions of water in the body', 'Функции воды в организме', 'Funcțiile apei în organism'), localized('Sachliche Grundlagen ohne überzogene Aussagen.', 'Reliable foundations without exaggerated claims.', 'Надёжные основы без преувеличенных утверждений.', 'Baze corecte fără afirmații exagerate.'), localized('Körperfunktionen seriös und sachlich erklären.', 'Explain bodily functions reliably and factually.', 'Объяснять функции организма корректно и по существу.', 'Explică funcțiile organismului corect și factual.')),
      videoLesson('video-minerals', 'mineralien', localized('Mineralien', 'Minerals', 'Минералы', 'Minerale'), localized('Mineralien und häufige Kundenfragen.', 'Minerals and common customer questions.', 'Минералы и частые вопросы клиентов.', 'Minerale și întrebări frecvente ale clienților.'), localized('Mineralienfragen professionell einordnen.', 'Classify mineral questions professionally.', 'Профессионально отвечать на вопросы о минералах.', 'Încadrează profesional întrebările despre minerale.')),
      videoLesson('video-limits', 'grenzwerte', localized('Grenzwerte', 'Limit values', 'Предельные значения', 'Valori-limită'), localized('Messwerte und Grenzwerte korrekt einordnen.', 'Classify measurements and limit values correctly.', 'Правильно интерпретировать измерения и пределы.', 'Interpretează corect măsurătorile și valorile-limită.'), localized('Falsche oder unzulässige Aussagen vermeiden.', 'Avoid incorrect or impermissible claims.', 'Избегать неверных или недопустимых утверждений.', 'Evită afirmațiile greșite sau nepermise.')),
      documentLesson('document-world', 'your-world', localized('Produktkatalog „Your World“', '“Your World” product catalogue', 'Каталог продукции «Your World»', 'Catalogul de produse „Your World”')),
      documentLesson('document-water', 'wasser-praesentation', localized('Präsentation Wasser', 'Water presentation', 'Презентация о воде', 'Prezentare despre apă')),
    ],
  },
  {
    id: 3,
    order: 3,
    iconKey: 'shield',
    title: localized('Produkte', 'Products', 'Продукты', 'Produse'),
    description: localized('Produkte und Filtrationstechnologie verständlich erklären.', 'Explain products and filtration technology clearly.', 'Понятно объяснять продукты и технологии фильтрации.', 'Explică clar produsele și tehnologia de filtrare.'),
    category: localized('Produktwissen', 'Product knowledge', 'Знания о продуктах', 'Cunoștințe despre produse'),
    resources: {
      videos: ['umkehrosmose-erklaerung'],
      videoPlaceholders: [],
      pdfs: ['your-world', 'kunden-preisliste'],
      quizzes: ['q-osmosis'],
      downloads: [],
    },
    lessons: [
      contentLesson('products-overview', localized('Produktübersicht', 'Product overview', 'Обзор продуктов', 'Prezentare produse')),
      videoLesson('video-osmosis', 'umkehrosmose-erklaerung', localized('Umkehrosmose Erklärung', 'Reverse osmosis explained', 'Объяснение обратного осмоса', 'Explicația osmozei inverse'), localized('Membranfiltration als Kerntechnologie.', 'Membrane filtration as the core technology.', 'Мембранная фильтрация как основная технология.', 'Filtrarea cu membrană drept tehnologie principală.'), localized('Umkehrosmose einfach und seriös erklären.', 'Explain reverse osmosis simply and reliably.', 'Просто и корректно объяснять обратный осмос.', 'Explică osmoza inversă simplu și corect.')),
      documentLesson('document-product-world', 'your-world', localized('Produktkatalog', 'Product catalogue', 'Каталог продукции', 'Catalog produse')),
      documentLesson('document-customer-prices', 'kunden-preisliste', localized('Kundenpreisliste', 'Customer price list', 'Прайс-лист для клиентов', 'Lista de prețuri pentru clienți')),
    ],
  },
  {
    id: 4,
    order: 4,
    iconKey: 'trophy',
    title: localized('Karriereplan', 'Career Plan', 'Карьерный план', 'Plan de carieră'),
    description: localized('Level, Punkte und nächste Karriereschritte.', 'Levels, points and next career steps.', 'Уровни, баллы и следующие карьерные шаги.', 'Niveluri, puncte și următorii pași în carieră.'),
    category: localized('Karriere', 'Career', 'Карьера', 'Carieră'),
    resources: {
      videos: [],
      videoPlaceholders: [],
      pdfs: ['karriere-verdienstplan'],
      quizzes: ['q-career'],
      downloads: [],
    },
    lessons: [
      contentLesson('career-overview', localized('Level und Punkte verstehen', 'Understand levels and points', 'Понять уровни и баллы', 'Înțelege nivelurile și punctele')),
      documentLesson('document-career', 'karriere-verdienstplan', localized('Karriere- und Verdienstplan', 'Career and compensation plan', 'Карьерный план и вознаграждение', 'Plan de carieră și remunerare')),
    ],
  },
  {
    id: 5,
    order: 5,
    iconKey: 'file',
    title: localized('Preise & Provisionen', 'Prices & Commissions', 'Цены и комиссии', 'Prețuri și comisioane'),
    description: localized('Kundenpreise und interne Partnerinformationen sicher nutzen.', 'Use customer prices and internal partner information safely.', 'Безопасно использовать цены и внутреннюю партнёрскую информацию.', 'Folosește în siguranță prețurile și informațiile interne pentru parteneri.'),
    category: localized('Preise', 'Prices', 'Цены', 'Prețuri'),
    resources: {
      videos: [],
      videoPlaceholders: [],
      pdfs: ['kunden-preisliste', 'vp-wasserbar', 'vp-filter', 'vp-drops-vitamine', 'karriere-verdienstplan'],
      quizzes: ['q-prices'],
      downloads: [],
    },
    lessons: [
      contentLesson('prices-overview', localized('Preis- und Provisionsübersicht', 'Price and commission overview', 'Обзор цен и комиссий', 'Prezentare prețuri și comisioane')),
      documentLesson('document-prices-customer', 'kunden-preisliste', localized('Kundenpreise', 'Customer prices', 'Цены для клиентов', 'Prețuri pentru clienți')),
      documentLesson('document-prices-waterbar', 'vp-wasserbar', localized('Partnerpreise Wasserbar', 'Partner prices Waterbar', 'Партнёрские цены Waterbar', 'Prețuri partener Waterbar')),
      documentLesson('document-prices-filter', 'vp-filter', localized('Filter und Membranen', 'Filters and membranes', 'Фильтры и мембраны', 'Filtre și membrane')),
      documentLesson('document-prices-drops', 'vp-drops-vitamine', localized('Drops und Vitamine', 'Drops and vitamins', 'Капли и витамины', 'Picături și vitamine')),
      documentLesson('document-prices-career', 'karriere-verdienstplan', localized('Provision und Bonuspunkte', 'Commission and bonus points', 'Комиссии и бонусные баллы', 'Comisioane și puncte bonus')),
    ],
  },
  {
    id: 6,
    order: 6,
    iconKey: 'message',
    title: localized('Verkaufssystem', 'Sales System', 'Система продаж', 'Sistem de vânzări'),
    description: localized('Kunden sauber durch den offiziellen Bestellprozess führen.', 'Guide customers cleanly through the official ordering process.', 'Правильно сопровождать клиента по официальному процессу заказа.', 'Ghidează corect clientul prin procesul oficial de comandă.'),
    category: localized('Verkauf', 'Sales', 'Продажи', 'Vânzări'),
    resources: {
      videos: ['kundenbestellung'],
      videoPlaceholders: [],
      pdfs: [],
      quizzes: ['q-customer-order'],
      downloads: [],
    },
    lessons: [
      contentLesson('sales-overview', localized('Offizieller Bestellprozess', 'Official ordering process', 'Официальный процесс заказа', 'Procesul oficial de comandă')),
      videoLesson('video-customer-order', 'kundenbestellung', localized('Kundenbestellung', 'Customer order', 'Заказ клиента', 'Comanda clientului'), localized('Schritt für Schritt zur offiziellen Produktseite.', 'Step by step to the official product page.', 'Пошагово к официальной странице продукта.', 'Pas cu pas către pagina oficială a produsului.'), localized('Bestellungen klar von Academy-Funktionen trennen.', 'Separate orders clearly from Academy functions.', 'Чётко отделять заказы от функций Academy.', 'Separă clar comenzile de funcțiile Academiei.')),
    ],
  },
  {
    id: 7,
    order: 7,
    iconKey: 'flame',
    title: localized('RXT Entkalkung', 'RXT Descaling', 'Удаление накипи RXT', 'Decalcifiere RXT'),
    description: localized('RXT-Systeme technisch sauber und verständlich einordnen.', 'Classify RXT systems clearly and accurately.', 'Понятно и технически корректно объяснять системы RXT.', 'Prezintă sistemele RXT clar și corect tehnic.'),
    category: localized('Technik', 'Technology', 'Техника', 'Tehnică'),
    resources: {
      videos: [],
      videoPlaceholders: ['rxt-training-placeholder'],
      pdfs: ['rxt-praesentation'],
      quizzes: [],
      downloads: [],
    },
    lessons: [
      contentLesson('rxt-overview', localized('RXT Grundlagen', 'RXT basics', 'Основы RXT', 'Bazele RXT')),
      placeholderVideoLesson('rxt-video', 'rxt-training-placeholder', localized('RXT Schulungsvideo', 'RXT training video', 'Обучающее видео RXT', 'Videoclip de instruire RXT'), localized('Der Video-Slot ist vorbereitet und noch nicht veröffentlicht.', 'The video slot is prepared and not yet published.', 'Место для видео подготовлено, но ещё не опубликовано.', 'Spațiul video este pregătit, dar nu este încă publicat.')),
      documentLesson('document-rxt', 'rxt-praesentation', localized('RXT Präsentation', 'RXT presentation', 'Презентация RXT', 'Prezentare RXT')),
    ],
  },
  {
    id: 8,
    order: 8,
    iconKey: 'download',
    title: localized('Downloads', 'Downloads', 'Загрузки', 'Descărcări'),
    description: localized('Dokumente, Vorlagen und Verkaufshilfen geordnet finden.', 'Find documents, templates and sales aids in one place.', 'Находить документы, шаблоны и материалы для продаж в одном месте.', 'Găsește organizat documente, șabloane și materiale de vânzare.'),
    category: localized('Download Center', 'Download Center', 'Центр загрузок', 'Centru de descărcări'),
    resources: {
      videos: [],
      videoPlaceholders: [],
      pdfs: [],
      quizzes: [],
      downloads: ['presentations', 'product-information', 'onboarding', 'sales', 'recruiting', 'social-media', 'other-downloads'],
    },
    lessons: [
      contentLesson('downloads-overview', localized('Download-Kategorien', 'Download categories', 'Категории загрузок', 'Categorii de descărcări')),
    ],
  },
  {
    id: 9,
    order: 9,
    iconKey: 'users',
    title: localized('Partneraufbau', 'Partner Building', 'Построение партнёрской команды', 'Dezvoltare parteneri'),
    description: localized('Offizielle Registrierung und strukturierte Einarbeitung trennen.', 'Separate official registration from structured onboarding.', 'Разделять официальную регистрацию и структурированный онбординг.', 'Separă înregistrarea oficială de onboardingul structurat.'),
    category: localized('Teamaufbau', 'Team building', 'Построение команды', 'Dezvoltarea echipei'),
    resources: {
      videos: ['partnerregistrierung'],
      videoPlaceholders: [],
      pdfs: [],
      quizzes: ['q-partner-build'],
      downloads: [],
    },
    lessons: [
      contentLesson('partner-building-overview', localized('Partneraufbau verstehen', 'Understand partner building', 'Понять построение команды', 'Înțelege dezvoltarea partenerilor')),
      videoLesson('video-partner-registration', 'partnerregistrierung', localized('Partnerregistrierung', 'Partner registration', 'Регистрация партнёра', 'Înregistrarea partenerului'), localized('Der offizielle Registrierungsweg Schritt für Schritt.', 'The official registration path step by step.', 'Официальный путь регистрации шаг за шагом.', 'Procesul oficial de înregistrare pas cu pas.'), localized('Academy-Zugang und Aqua-Global-Registrierung klar trennen.', 'Separate Academy access from Aqua Global registration.', 'Чётко разделять доступ к Academy и регистрацию Aqua Global.', 'Separă clar accesul la Academie de înregistrarea Aqua Global.')),
    ],
  },
  {
    id: 10,
    order: 10,
    iconKey: 'search',
    title: localized('Testlabor', 'Test Lab', 'Тест-лаборатория', 'Laborator de teste'),
    description: localized('Demonstrationen vorbereiten, durchführen und seriös erklären.', 'Prepare, perform and explain demonstrations reliably.', 'Готовить, проводить и корректно объяснять демонстрации.', 'Pregătește, realizează și explică demonstrațiile corect.'),
    category: localized('Praxis', 'Practice', 'Практика', 'Practică'),
    resources: {
      videos: ['ppm-bedeutung', 'membranfilter-vs-filterkanne', 'tee-test', 'basilikum-test', 'farbtest', 'farbtest-erklaerung'],
      videoPlaceholders: [],
      pdfs: [],
      quizzes: ['q-ppm', 'q-basil'],
      downloads: [],
    },
    lessons: [
      contentLesson('testlab-overview', localized('Testlabor-Übersicht', 'Test lab overview', 'Обзор тестовой лаборатории', 'Prezentarea laboratorului de testare')),
      videoLesson('video-ppm', 'ppm-bedeutung', localized('PPM Bedeutung', 'PPM meaning', 'Значение PPM', 'Semnificația PPM'), localized('Messwerte korrekt einordnen.', 'Classify measurements correctly.', 'Правильно интерпретировать измерения.', 'Interpretează corect măsurătorile.'), localized('PPM-Werte professionell erklären.', 'Explain PPM values professionally.', 'Профессионально объяснять значения PPM.', 'Explică profesional valorile PPM.')),
      videoLesson('video-filter-comparison', 'membranfilter-vs-filterkanne', localized('Membranfilter vs. Filterkanne', 'Membrane filter vs. filter jug', 'Мембранный фильтр и фильтр-кувшин', 'Filtru cu membrană vs. cană filtrantă'), localized('Unterschiede sichtbar und sachlich erklären.', 'Explain visible differences factually.', 'Наглядно и корректно объяснять различия.', 'Explică diferențele vizibil și factual.'), localized('Filtertechnologien verständlich vergleichen.', 'Compare filtration technologies clearly.', 'Понятно сравнивать технологии фильтрации.', 'Compară clar tehnologiile de filtrare.')),
      videoLesson('video-tea', 'tee-test', localized('Tee-Test', 'Tea test', 'Тест с чаем', 'Testul cu ceai'), localized('Klarheit und Entfaltung im Vergleich.', 'Compare clarity and development.', 'Сравнение прозрачности и раскрытия.', 'Compară claritatea și dezvoltarea.'), localized('Den Tee-Test ruhig und nachvollziehbar durchführen.', 'Perform the tea test calmly and clearly.', 'Проводить тест с чаем спокойно и понятно.', 'Realizează testul cu ceai calm și clar.')),
      videoLesson('video-basil', 'basilikum-test', localized('Basilikum-Test', 'Basil test', 'Тест с базиликом', 'Testul cu busuioc'), localized('Natürliche Langzeitbeobachtung dokumentieren.', 'Document a natural long-term observation.', 'Документировать естественное долгосрочное наблюдение.', 'Documentează o observație naturală pe termen lung.'), localized('Vergleichstests sauber dokumentieren.', 'Document comparison tests properly.', 'Корректно документировать сравнительные тесты.', 'Documentează corect testele comparative.')),
      videoLesson('video-color', 'farbtest', localized('Farbtest', 'Colour test', 'Цветовой тест', 'Test de culoare'), localized('Kurze praktische Demonstration.', 'Short practical demonstration.', 'Короткая практическая демонстрация.', 'Demonstrație practică scurtă.'), localized('Einen Farbtest korrekt vorbereiten.', 'Prepare a colour test correctly.', 'Правильно подготовить цветовой тест.', 'Pregătește corect un test de culoare.')),
      videoLesson('video-color-explanation', 'farbtest-erklaerung', localized('Farbtest Erklärung', 'Colour test explanation', 'Объяснение цветового теста', 'Explicația testului de culoare'), localized('Einordnung und saubere Gesprächsführung.', 'Context and reliable conversation guidance.', 'Контекст и корректное ведение разговора.', 'Context și comunicare corectă.'), localized('Überzogene Aussagen beim Farbtest vermeiden.', 'Avoid exaggerated claims about the colour test.', 'Избегать преувеличений при цветовом тесте.', 'Evită afirmațiile exagerate despre testul de culoare.')),
    ],
  },
  {
    id: 11,
    order: 11,
    iconKey: 'quiz',
    title: localized('Zertifizierung / Quiz', 'Certification / Quiz', 'Сертификация / Тест', 'Certificare / Quiz'),
    description: localized('Academy-Wissen lokal und ohne Kontospeicherung prüfen.', 'Check Academy knowledge locally without account storage.', 'Проверить знания Academy локально без сохранения в аккаунте.', 'Verifică local cunoștințele Academiei fără salvare în cont.'),
    category: localized('Wissenscheck', 'Knowledge check', 'Проверка знаний', 'Verificarea cunoștințelor'),
    resources: {
      videos: [],
      videoPlaceholders: [],
      pdfs: [],
      quizzes: ACADEMY_QUIZ_CATALOG.map((question) => question.id),
      downloads: [],
    },
    lessons: [
      {
        id: 'academy-foundation-quiz',
        type: 'quiz',
        resourceId: 'academy-foundation',
        title: localized('Academy Grundlagen-Quiz', 'Academy foundation quiz', 'Базовый тест Academy', 'Quiz de bază al Academiei'),
        description: localized(
          'Die Auswertung erfolgt ausschließlich in dieser Browsersitzung.',
          'The result is calculated only in this browser session.',
          'Результат рассчитывается только в текущем сеансе браузера.',
          'Rezultatul este calculat doar în această sesiune de browser.',
        ),
      },
    ],
  },
];

const LANGUAGE_MATCHERS = [
  ['en', ['en', 'english']],
  ['ru', ['ru', 'русский']],
  ['ro', ['ro', 'română', 'romana']],
  ['de', ['de', 'deutsch']],
];

export function getAcademyLanguageCode(value) {
  const normalized = String(value || '').trim().toLowerCase();
  const match = LANGUAGE_MATCHERS.find(([, aliases]) => aliases.some((alias) => normalized === alias || normalized.includes(alias)));
  return match?.[0] || 'de';
}

export function localizeAcademyValue(value, language = 'de') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return value || '';
  }

  const languageCode = getAcademyLanguageCode(language);
  return value[languageCode] || value.de || Object.values(value)[0] || '';
}

function localizeLesson(lesson, languageCode) {
  return {
    ...lesson,
    title: localizeAcademyValue(lesson.title, languageCode),
    description: localizeAcademyValue(lesson.description, languageCode),
    learningGoal: localizeAcademyValue(lesson.learningGoal, languageCode),
  };
}

export function getAcademyContentCatalog(language = 'de') {
  const languageCode = getAcademyLanguageCode(language);

  return ACADEMY_CONTENT_CATALOG
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((module) => ({
      ...module,
      title: localizeAcademyValue(module.title, languageCode),
      description: localizeAcademyValue(module.description, languageCode),
      category: localizeAcademyValue(module.category, languageCode),
      lessons: module.lessons.map((lesson) => localizeLesson(lesson, languageCode)),
    }));
}

export function getAcademyQuizQuestions(language = 'de') {
  const languageCode = getAcademyLanguageCode(language);

  return ACADEMY_QUIZ_CATALOG.map((question) => ({
    ...question,
    question: localizeAcademyValue(question.question, languageCode),
    options: question.options.map((option) => localizeAcademyValue(option, languageCode)),
  }));
}

export function getAcademyContentSummary() {
  return ACADEMY_CONTENT_CATALOG.reduce((summary, module) => ({
    modules: summary.modules + 1,
    lessons: summary.lessons + module.lessons.length,
    videos: summary.videos + module.resources.videos.length,
    videoPlaceholders: summary.videoPlaceholders + module.resources.videoPlaceholders.length,
    pdfs: summary.pdfs + module.resources.pdfs.length,
    quizzes: summary.quizzes + module.resources.quizzes.length,
    downloads: summary.downloads + module.resources.downloads.length,
  }), {
    modules: 0,
    lessons: 0,
    videos: 0,
    videoPlaceholders: 0,
    pdfs: 0,
    quizzes: 0,
    downloads: 0,
  });
}
