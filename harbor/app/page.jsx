'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  BookOpen,
  Camera,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  FileText,
  Crown,
  Download,
  ExternalLink,
  FileQuestion,
  Flame,
  Globe2,
  ImagePlus,
  Instagram,
  Lock,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Mic,
  Music2,
  PauseCircle,
  Phone,
  PlayCircle,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Smile,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Trash2,
  Upload,
  UploadCloud,
  UserCheck,
  Users,
  Video,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { Card, CardContent, Button } from '../components/ui';
import {
  AdminCmsSectionCard,
  AdminCmsWorkflowStep,
  AdminPrototypeActionButton,
  AdminPrototypeMetricCard,
  AdminPrototypeStatusBadge,
  cmsWorkflowSteps,
} from '../components/admin-ui';
import {
  GrowthCenterSection as GrowthCenterSectionView,
  growthCenterCategories,
  growthHubSections,
} from '../components/growth-center';
import { SuccessCenterSection as SuccessCenterSectionView } from '../components/success-center';
import {
  CampaignCenterSection as CampaignCenterSectionView,
  CampaignDashboardBanner,
} from '../components/campaign-center';
import { MediaCenterSection as MediaCenterSectionView } from '../components/media-center';
import { createI18nTranslator, getI18nExtensionLabels } from '../components/i18n-extension';
import AcademyContentAdminOverview from './components/AcademyContentAdminOverview';
import AcademyDownloadCenter from './components/AcademyDownloadCenter';
import AcademyLessonNavigation from './components/AcademyLessonNavigation';
import {
  getAcademyContentCatalog,
  getAcademyContentSummary,
  getAcademyLanguageCode,
  getAcademyQuizQuestions,
} from './lib/academy-content';
import { getAcademyDownloads } from './lib/academy-downloads';
import {
  ACADEMY_MODULE_CATALOG,
  getAcademyModuleProgress,
  getPartnerActivityStatus,
  latestIso,
  normalizeAcademyProgress,
} from './lib/academy-progress';

const API_ROUTE = '/api/partners';
const COMMUNITY_API_ROUTE = '/api/community';
const VIDEO_TRANSCRIPT_API_ROUTE = '/api/video-transcripts';
const LOCAL_SESSION_KEY = 'harbor-global-session-token';
const LOCAL_LANGUAGE_KEY = 'harbor-global-language';
const LOCAL_VOLUME_KEY = 'harbor-global-anthem-volume';
const LOCAL_MUTED_KEY = 'harbor-global-anthem-muted';
const LOCAL_PLAYBACK_KEY = 'harbor-global-anthem-playback';
const LOCAL_INSTAGRAM_VISIBLE_KEY = 'harbor-global-instagram-visible';
const DEFAULT_DISCOUNT_CODE = '119872';
const BRAND_LOGO_URL = '/harbor-global-logo-clean.png';
const ACADEMY_SOUND_URL = '/harbor-academy-sound.mpeg';
const PROTECTED_VIDEO_ROUTE = '/api/academy-videos';
const academyVideoStorageSrc = (fileName) => fileName;
const OFFICIAL_INSTAGRAM_HANDLE = '@harbor.global.academy';
const INSTAGRAM_PROFILE_URL = 'https://www.instagram.com/harbor.global.academy';
const CALENDLY_URL = '/termin-buchen';
const CUSTOMER_REGISTRATION_URL = 'https://aqua-global.com/';
const PARTNER_REGISTRATION_URL = 'https://www2.base-ag.de/';
const PROTECTED_DOCUMENT_ROUTE = '/api/academy-documents';
const academyVideoUrlCache = new Map();
const WHATSAPP_CONTACT_URL = 'https://wa.me/message/C4HIF7M6EO7UK1';
const TELEGRAM_CONTACT_URL = 'https://t.me/ProYoTu';
const LEONID_EMAIL = 'leonid.curos.ag@gmail.com';
const LEONID_PHONE = '015227370000';
const PROFILE_IMAGE_MAX_BYTES = 1.5 * 1024 * 1024;
const PROFILE_IMAGE_UPDATE_MAX_INPUT_BYTES = 5 * 1024 * 1024;
const PROFILE_IMAGE_UPDATE_MAX_STORED_BYTES = 1024 * 1024;
const PROFILE_IMAGE_UPDATE_TARGET_BYTES = 800 * 1024;
const PROFILE_IMAGE_UPDATE_MAX_EDGE = 1200;
const PROFILE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const LANGUAGE_OPTIONS = {
  de: '🇩🇪 Deutsch',
  en: '🇬🇧 English',
  ru: '🇷🇺 Русский',
  ro: '🇷🇴 Română',
  el: '🇬🇷 Ελληνικά',
  tr: '🇹🇷 Türkçe',
  it: '🇮🇹 Italiano',
  cs: '🇨🇿 Čeština',
  es: '🇪🇸 Español',
  pl: '🇵🇱 Polski',
};
const languages = Object.values(LANGUAGE_OPTIONS);
const DEFAULT_LANGUAGE = LANGUAGE_OPTIONS.de;
const languageAliases = {
  de: LANGUAGE_OPTIONS.de,
  Deutsch: LANGUAGE_OPTIONS.de,
  [LANGUAGE_OPTIONS.de]: LANGUAGE_OPTIONS.de,
  en: LANGUAGE_OPTIONS.en,
  English: LANGUAGE_OPTIONS.en,
  [LANGUAGE_OPTIONS.en]: LANGUAGE_OPTIONS.en,
  ro: LANGUAGE_OPTIONS.ro,
  Română: LANGUAGE_OPTIONS.ro,
  Romana: LANGUAGE_OPTIONS.ro,
  [LANGUAGE_OPTIONS.ro]: LANGUAGE_OPTIONS.ro,
  ru: LANGUAGE_OPTIONS.ru,
  Русский: LANGUAGE_OPTIONS.ru,
  [LANGUAGE_OPTIONS.ru]: LANGUAGE_OPTIONS.ru,
  gr: LANGUAGE_OPTIONS.el,
  el: LANGUAGE_OPTIONS.el,
  Ελληνικά: LANGUAGE_OPTIONS.el,
  [LANGUAGE_OPTIONS.el]: LANGUAGE_OPTIONS.el,
  tr: LANGUAGE_OPTIONS.tr,
  Türkçe: LANGUAGE_OPTIONS.tr,
  Turkce: LANGUAGE_OPTIONS.tr,
  [LANGUAGE_OPTIONS.tr]: LANGUAGE_OPTIONS.tr,
  it: LANGUAGE_OPTIONS.it,
  Italiano: LANGUAGE_OPTIONS.it,
  [LANGUAGE_OPTIONS.it]: LANGUAGE_OPTIONS.it,
  cz: LANGUAGE_OPTIONS.cs,
  cs: LANGUAGE_OPTIONS.cs,
  Čeština: LANGUAGE_OPTIONS.cs,
  Cestina: LANGUAGE_OPTIONS.cs,
  [LANGUAGE_OPTIONS.cs]: LANGUAGE_OPTIONS.cs,
  es: LANGUAGE_OPTIONS.es,
  Español: LANGUAGE_OPTIONS.es,
  Espanol: LANGUAGE_OPTIONS.es,
  [LANGUAGE_OPTIONS.es]: LANGUAGE_OPTIONS.es,
  pl: LANGUAGE_OPTIONS.pl,
  Polski: LANGUAGE_OPTIONS.pl,
  [LANGUAGE_OPTIONS.pl]: LANGUAGE_OPTIONS.pl,
};

const academyDocuments = getAcademyDownloads('de');

const academyProducts = [
  { name: 'Mini Touch', group: 'Wasserbar', description: 'Kompakte Aqua Global Wasserbar für Beratung und kleine Haushalte.', specs: ['Umkehrosmose', 'Touch-Bedienung', 'Kompaktes Format'], priceDoc: 'kunden-preisliste', partnerDoc: 'vp-wasserbar' },
  { name: 'Flexible Touch', group: 'Wasserbar', description: 'Flexible Wasserbar für Alltag, Demonstration und Kundengespräche.', specs: ['Flexible Platzierung', 'Membranfiltration', 'Ideal für Vorführungen'], priceDoc: 'kunden-preisliste', partnerDoc: 'vp-wasserbar' },
  { name: 'Basic', group: 'Wasserbar', description: 'Basislösung für Einstieg, klares Wasserwissen und einfache Beratung.', specs: ['Basis-System', 'Kundenfreundlicher Einstieg', 'Servicefähig'], priceDoc: 'kunden-preisliste', partnerDoc: 'vp-wasserbar' },
  { name: 'Sparkling', group: 'Wasserbar', description: 'Wasserbar mit Sprudeloption für Haushalte mit Komfortanspruch.', specs: ['Sprudelwasser', 'Osmosewasser', 'Premium-Nutzung'], priceDoc: 'kunden-preisliste', partnerDoc: 'vp-wasserbar' },
  { name: 'Sparkling Pro', group: 'Wasserbar', description: 'Erweiterte Sparkling-Lösung für gehobene Beratung und starke Produktpräsentation.', specs: ['Pro-Ausstattung', 'Sprudeloption', 'Premium-Segment'], priceDoc: 'kunden-preisliste', partnerDoc: 'vp-wasserbar' },
  { name: 'RXT-79', group: 'Entkalkung', description: 'RXT-System für Entkalkungsschulung, technische Aufklärung und Zusatzberatung.', specs: ['RXT-Technologie', 'Entkalkungsfokus', 'Schulung über RXT-PDF'], priceDoc: 'rxt-praesentation', partnerDoc: 'rxt-praesentation' },
  { name: 'RXT-82', group: 'Entkalkung', description: 'Erweiterte RXT-Lösung für Produktwissen und professionelle Einordnung.', specs: ['RXT-Schulung', 'Technische Beratung', 'Serviceorientiert'], priceDoc: 'rxt-praesentation', partnerDoc: 'rxt-praesentation' },
  { name: 'Hydrogen', group: 'Wasserwissen', description: 'Hydrogen-Produktbereich als Schulungs- und Beratungsthema vorbereitet.', specs: ['Produktwissen', 'Beratungsvorbereitung', 'Video-Schulung vorbereitet'], priceDoc: 'your-world', partnerDoc: 'vp-zusatzartikel' },
  { name: 'Drops / Vitamine', group: 'Zusatzprodukte', description: 'Ergänzende Produkte für Kundenbindung, Nachbetreuung und Wiederkauf.', specs: ['Drops', 'Vitamine', 'Nachkaufpotenzial'], priceDoc: 'kunden-preisliste', partnerDoc: 'vp-drops-vitamine' },
  { name: 'Zubehör', group: 'Service', description: 'Zubehör, Filter, Membranen und Zusatzartikel für Service und Kundenbetreuung.', specs: ['Filter', 'Membranen', 'Zusatzartikel'], priceDoc: 'kunden-preisliste', partnerDoc: 'vp-zusatzartikel' },
];

const priceProvisionRows = [
  { title: 'Kundenpreise', description: 'Offizielle Kundenpreise für Beratung und Angebotsorientierung.', documentId: 'kunden-preisliste', publicInfo: true },
  { title: 'Partnerpreise Wasserbar', description: 'Interne Einkaufspreise für Wasserbar-Produkte.', documentId: 'vp-wasserbar', partnerOnly: true },
  { title: 'Filter, Membranen, Zusatzartikel', description: 'Interne Service- und Nachkaufpreislisten.', documentId: 'vp-filter', partnerOnly: true },
  { title: 'Drops / Vitamine', description: 'Interne Preisinformationen für Zusatzprodukte.', documentId: 'vp-drops-vitamine', partnerOnly: true },
  { title: 'Provision & Bonuspunkte / VP', description: 'Karriere- und Verdienstplan mit Punkten, Provisionen und Stufen.', documentId: 'karriere-verdienstplan', partnerOnly: true },
];

const languageCodes = {
  [LANGUAGE_OPTIONS.de]: 'de',
  [LANGUAGE_OPTIONS.en]: 'en',
  [LANGUAGE_OPTIONS.ro]: 'ro',
  [LANGUAGE_OPTIONS.ru]: 'ru',
  [LANGUAGE_OPTIONS.el]: 'el',
  [LANGUAGE_OPTIONS.tr]: 'tr',
  [LANGUAGE_OPTIONS.it]: 'it',
  [LANGUAGE_OPTIONS.cs]: 'cs',
  [LANGUAGE_OPTIONS.es]: 'es',
  [LANGUAGE_OPTIONS.pl]: 'pl',
};

const labelsByCode = {
  de: {
    register: 'Zugang beantragen',
    login: 'Einloggen',
    adminLogin: 'Admin Login',
    partnerRegister: 'Academy Zugang beantragen',
    partnerLogin: 'Partner Login',
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail',
    whatsapp: 'WhatsApp',
    discountCode: 'Rabattcode',
    city: 'Stadt',
    language: 'Sprache',
    password: 'Passwort',
    passwordRepeat: 'Passwort wiederholen',
    profileImageUpload: 'Profilbild hochladen',
    profileImageHint: 'Bitte lade ein klares Profilbild von dir hoch, damit Leonid Curos dich eindeutig zuordnen und freigeben kann.',
    profileImageRequired: 'Bitte lade ein Profilbild hoch.',
    profileImageInvalidType: 'Bitte lade ein JPG-, PNG- oder WEBP-Bild hoch.',
    profileImageTooLarge: 'Das Profilbild darf maximal 1,5 MB gross sein.',
    profileImageUpdateTooLarge: 'Das Ausgangsbild darf maximal 5 MB gross sein.',
    profileImageOptimizationFailed: 'Das Bild konnte nicht mit sichtbarer Qualität unter 1 MB optimiert werden.',
    profileImagePreview: 'Profilbild-Vorschau',
    profileImageChange: 'Profilbild ändern',
    submitRegistration: 'Zugangsanfrage senden',
    checking: 'Wird geprüft...',
    saving: 'Wird gespeichert...',
    username: 'Benutzername',
    usernamePlaceholder: 'E-Mail oder Rabattcode',
    dashboard: 'Dashboard',
    career: 'Aqua Global Karriere',
    start: 'Startcenter',
    modules: 'Module',
    testLab: 'Testlabor',
    links: 'Hilfreiche Links',
    resources: 'Download Center',
    calendar: 'Calendly',
    social: 'Instagram',
    chat: 'Community Chat',
    qa: 'Fragen & Antworten',
    testimonials: 'Testimonials',
    admin: 'Admin',
    welcome: 'Willkommen',
    logout: 'Logout',
    pendingMessage: 'Warte auf Freigabe durch Leonid Curos',
    requiredFields: 'Bitte fülle alle Pflichtfelder aus.',
    requiredCode: 'Bitte gib deinen eigenen Rabattcode ein.',
    invalidCode: 'Rabattcode muss 3 bis 24 Zeichen haben und darf nur Buchstaben, Zahlen, Bindestrich oder Unterstrich enthalten.',
    legalConsentError: 'Bitte akzeptiere die Datenschutzerklärung und Nutzungsbedingungen, um dich zu registrieren.',
    trainingContentConsentError: 'Bitte bestätige die Einwilligung für Schulungsinhalte, um dich zu registrieren.',
    privacyPolicy: 'Datenschutzerklärung',
    termsOfUse: 'Nutzungsbedingungen',
    passwordMismatch: 'Die Passwörter stimmen nicht überein.',
    registrationSaved: 'Danke für deine Zugangsanfrage!',
    registrationSavedText: 'Deine Zugangsanfrage wurde gespeichert. Du erhältst eine E-Mail zur Bestätigung. Status: Warte auf Freigabe durch Leonid Curos.',
    toLogin: 'Zum Login',
    forgotPassword: 'Passwort vergessen?',
    resetPasswordTitle: 'Passwort zurücksetzen',
    resetEmailLabel: 'E-Mail-Adresse',
    sendResetLink: 'Reset-Link senden',
    resetNeutralMessage: 'Falls diese E-Mail registriert ist, erhältst du eine Nachricht zum Zurücksetzen deines Passworts.',
    open: 'Öffnen',
    contact: 'Kontakt zu Leonid Curos',
    contactTitle: 'Kontakt zu Leonid Curos',
    contactIntro: 'Benötigst du Unterstützung, hast Fragen zur Academy, zum Business-Aufbau oder zu Aqua Global?',
    contactDirect: 'Kontaktiere Leonid Curos direkt.',
    personalSupport: 'Persönliche Unterstützung für Academy, Partnerstart, Business-Aufbau und Aqua Global Fragen.',
    openWhatsapp: 'WhatsApp öffnen',
    whatsappDescription: 'Direkter Kontakt per WhatsApp.',
    openTelegram: 'Telegram öffnen',
    telegramDescription: 'Direkter Kontakt per Telegram.',
    contactEmail: 'E-Mail anzeigen',
    contactPhone: 'Telefon anzeigen',
    officialProductPage: 'Offizielle Produktseite',
    officialProductText: 'Hier gelangen Kunden direkt zur offiziellen Aqua Global Produktseite.',
    openProductPage: 'Produktseite öffnen',
    partnerBackoffice: 'Partner Backoffice',
    partnerBackofficeText: 'Hier gelangen bestehende Aqua Global Partner direkt zum offiziellen Backoffice.',
    openBackoffice: 'Backoffice öffnen',
    academyScopeNotice: 'Die Harbor Global Academy registriert keine Kunden oder Partner. Sie dient ausschließlich zur Schulung, Einarbeitung und Unterstützung bereits registrierter Partner.',
    communityCenter: 'INSTAGRAM COMMUNITY CENTER',
    voluntary: 'Freiwillig: Folge anderen Partnern, tauscht euch aus und baut gemeinsam Reichweite auf.',
    harborAnthemActivate: 'Harbor Anthem aktivieren',
    harborAnthemPause: 'Harbor Anthem pausieren',
    harborAnthemPlaying: 'HARBOR ANTHEM läuft',
    anthemStatusPlaying: 'Jetzt spielt',
    anthemStatusPaused: 'Pausiert',
    anthemStatusActivate: 'Aktivieren',
    anthemPausedForVideo: 'Pausiert wegen Schulungsvideo',
    anthemBlockedHint: 'Klicke hier um Harbor Anthem zu aktivieren',
    anthemMuted: 'Stummgeschaltet',
    registrationIntro: 'Gib deinen eigenen Rabattcode ein. Zugang wird nach Prüfung freigeschaltet.',
    registrationPendingHelp: 'Der Benutzer wird gespeichert und bleibt im Status: Warte auf Freigabe durch Leonid Curos.',
    loginIntro: 'Benutzername ist E-Mail oder Rabattcode. Freigabe muss approved sein.',
    adminLoginIntro: 'Geschützter Admin-Zugang. Nur für freigegebene Administratoren.',
    backToPartnerLogin: 'Zurück zum Partner Login',
    premiumPartnerSystem: 'Premium Partner System',
    headerSubtitle: 'Ein Link. Ein System. Jeder Partner wird professionell eingearbeitet.',
    approvedShort: 'freigegeben',
    partnerWaiting: 'Partner warten auf Freigabe.',
    partnerApproval: 'Partnerfreigabe',
    noRegistration: 'Noch keine Zugangsanfrage gespeichert.',
    registered: 'Registriert',
    waiting: 'Wartend',
    approved: 'Freigegeben',
    trainings: 'Schulungen',
    partnerStatus: 'Partnerstatus',
    assignTraining: 'Schulung zuweisen',
    adminNotes: 'Admin-Notizen',
    adminNotesPlaceholder: 'Notiz, nächster Schritt oder Freigabegrund',
    approvePartner: 'Partner freigeben',
    reject: 'Ablehnen',
    block: 'Sperren',
    save: 'Speichern',
    delete: 'Löschen',
    dashboardOpen: 'Dashboard geöffnet',
    accessApproved: 'Dein Zugang ist freigegeben.',
    status: 'Status',
    streak: 'Serie',
    days12: '12 Tage',
    activePartners: 'Aktive Partner',
    partnersOnline: 'Partner online',
    openQuestions: 'Offene Fragen',
    answered: 'Beantwortet',
    messagesLabel: 'Nachrichten',
    instagramProfiles: 'Instagram-Profile',
    notifications: 'Benachrichtigungen',
    profileOpen: 'Profil öffnen',
    calendarOpen: 'Kalender öffnen',
    partnerCallBook: 'Partner-Call direkt buchen.',
    bookLeonidCall: 'Termin mit Leonid buchen',
    bookLeonidCallText: 'Persönlichen Partner-Call mit Leonid Curos direkt über Calendly buchen.',
    bookAppointment: 'Termin buchen',
    secureFreeCall: 'Kostenloses Gespräch sichern',
    schedulePartnerCall: 'Partnergespräch vereinbaren',
    bookWaterConsultation: 'Wasserberatung buchen',
    bookingCentralTitle: 'Zentrale Terminbuchung',
    bookingCentralText: 'Alle Terminbuttons führen zur zentralen Calendly-Seite. Calendly verwaltet Verfügbarkeit, Bestätigung und Google-Kalender-Einladung.',
    adminBookingTitle: 'Terminbuchungen',
    adminBookingText: 'Die Verwaltung der Termine erfolgt direkt über Calendly und Google Kalender.',
    onboardingCallTitle: 'Onboarding-Call nach Freigabe',
    onboardingCallText: 'Nach deiner Partnerfreigabe kannst du deinen nächsten persönlichen Academy-Termin mit Leonid buchen.',
    helpSupportTitle: 'Hilfe & Support',
    helpSupportText: 'Wenn du Unterstützung brauchst, buche direkt einen Termin mit Leonid. Der Link öffnet in einem neuen Tab.',
    qaCalendlyTitle: 'Persönliche Frage klären',
    qaCalendlyText: 'Für individuelle Fragen kannst du zusätzlich einen Termin mit Leonid buchen.',
    startCenterTitle: 'Partner Startcenter',
    startCenterHeadline: 'Alles für den ersten Partner-Tag',
    startCenterText: 'Willkommen, persönlicher Rabattcode, Premium Partner System und Onboarding für deinen ersten Academy-Tag.',
    useDiscountCode: 'Rabattcode verwenden',
    trainingModules: 'Schulungsmodule',
    trainingModulesText: 'Mehrsprachige Lektionen, Schulungsvideos und Aufgaben.',
    testLabTitle: 'WASSER- & PRODUKTTESTS',
    testLabModuleTitle: 'MODUL 4 - WASSER- & PRODUKTTESTS',
    testLabIntro: 'Praxisvideos zu Wasser-, Tee-, Pflanzen-, Farb- und Filtervergleichen zentral gesammelt, damit Partner echte Demonstrationen professionell lernen.',
    testLabSearch: 'Testvideos suchen',
    testLabSearchPlaceholder: 'Suche nach Titel, Kategorie, Lernziel oder Beschreibung',
    testLabRequired: 'Pflichtvideo für neue Partner',
    testLabLearningGoal: 'Lernziel',
    testLabProgress: 'Testlabor-Fortschritt',
    testLabPrepared: 'Vorbereitet',
    testLabNoResults: 'Keine Testvideos gefunden.',
    newModule: 'Neues Modul',
    module: 'Modul',
    lessons: 'Lektionen',
    completed: 'abgeschlossen',
    currentModule: 'Aktuelles Modul',
    startVideo: 'Video starten · Musik stoppt automatisch',
    trainingVideoRunning: 'Schulungsvideo läuft',
    musicPaused: 'Hintergrundmusik ist pausiert.',
    officialInstagram: 'Offizieller Harbor Global Academy Instagram Kanal',
    officialInstagramText: 'News, Updates, Schulungen, Erfolge, Events und Community.',
    openInstagram: 'Instagram öffnen',
    partnerNetwork: 'Partner Instagram Netzwerk',
    showMyProfile: 'Mein Profil anzeigen',
    instagramSearch: 'Name, Stadt, Instagram Name',
    follow: 'Folgen',
    adminInstagramNotice: 'Admin-Hinweis: Instagram-Profile können administrativ gespeichert oder entfernt werden. Änderungen werden vor dem Speichern bestätigt.',
    socialResourceText: 'Social Media Ressource für Reichweite, Storytelling und Partneraufbau.',
    communityChatTitle: 'COMMUNITY CHAT',
    chatIntro: 'Fragen stellen, Antworten geben, Erfahrungen teilen, Erfolge posten und Tipps austauschen.',
    adminChatTools: 'Admin-Tools: Nachrichten löschen, Nutzer verwarnen, Nutzer sperren und Spam entfernen.',
    messagePlaceholder: 'Nachricht schreiben...',
    send: 'Senden',
    qaTitle: 'FRAGEN & ANTWORTEN',
    qaSearch: 'Frage, Thema, Schlagwort oder Autor suchen',
    by: 'Von',
    answersLabel: 'Antworten',
    bestAnswer: 'Beste Antwort',
    markBestAnswer: 'Beste Antwort markieren',
    calendlyCalendar: 'Calendly-Kalender',
    calendlyText: 'Partner-Calls, 1:1 Führung und Follow-up Termine direkt buchen.',
    openCalendly: 'Calendly öffnen',
    nextDates: 'Nächste Termine',
    with: 'mit',
    preparation: 'Vorbereitung',
    preparationText: 'Vor jedem Call: Backoffice Screenshot, Rabattcode und wichtigste Frage bereithalten.',
    accessChecking: 'Zugang wird geprüft...',
    heroTitle: 'Private Partner Academy',
    heroText: 'Geschlossene Plattform für aktive Partner. Zugang mit eigenem Rabattcode und Academy-Freigabe.',
    protectedTitle: 'Geschützt',
    protectedText: 'Nur echte Partner',
    multilingualTitle: 'Mehrsprachig',
    multilingualText: 'Europa-ready',
    adminApprovalTitle: 'Admin-Freigabe',
    waits: 'wartet',
    instagramProfile: 'Offizieller Instagram Kanal',
    contentAndReels: 'News, Updates und Community öffnen',
    officialInstagramBoxTitle: 'Offizieller Instagram Kanal',
    officialInstagramBoxIntro: 'Folge Harbor Global Academy für:',
    instagramOfficialHighlights: ['Academy Updates', 'Neue Schulungen', 'Produktneuheiten', 'Partner-Erfolge', 'Live Events', 'Community News'],
    instagramCommunityStat: 'Instagram Community',
    officialInstagramFooter: 'Offizieller Instagram Kanal',
    calendlyProfile: 'Calendly-Kalender',
    bookPartnerCall: 'Partner-Call buchen',
  },
  en: {
    register: 'Request access',
    login: 'Sign in',
    adminLogin: 'Admin Login',
    partnerRegister: 'Request Academy access',
    partnerLogin: 'Partner Login',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    whatsapp: 'WhatsApp',
    discountCode: 'Discount code',
    city: 'City',
    language: 'Language',
    password: 'Password',
    passwordRepeat: 'Repeat password',
    profileImageUpload: 'Upload profile photo',
    profileImageHint: 'Please upload a clear profile photo so Leonid Curos can identify and approve you.',
    profileImageRequired: 'Please upload a profile photo.',
    profileImageInvalidType: 'Please upload a JPG, PNG or WEBP image.',
    profileImageTooLarge: 'The profile photo may be up to 1.5 MB.',
    profileImageUpdateTooLarge: 'The original image may be up to 5 MB.',
    profileImageOptimizationFailed: 'The image could not be optimized below 1 MB while preserving visible quality.',
    profileImagePreview: 'Profile photo preview',
    profileImageChange: 'Change profile photo',
    submitRegistration: 'Send access request',
    checking: 'Checking...',
    saving: 'Saving...',
    username: 'Username',
    usernamePlaceholder: 'Email or discount code',
    dashboard: 'Dashboard',
    career: 'Aqua Global Career',
    start: 'Start Center',
    modules: 'Modules',
    testLab: 'Test Lab',
    links: 'Helpful Links',
    resources: 'Download Center',
    calendar: 'Calendly',
    social: 'Instagram',
    chat: 'Community Chat',
    qa: 'Questions & Answers',
    testimonials: 'Testimonials',
    admin: 'Admin',
    welcome: 'Welcome',
    logout: 'Logout',
    pendingMessage: 'Your account is still waiting for approval',
    requiredFields: 'Please fill in all required fields.',
    requiredCode: 'Please enter your own discount code.',
    invalidCode: 'Discount code must be 3 to 24 characters and may only contain letters, numbers, hyphen or underscore.',
    legalConsentError: 'Please accept the privacy policy and terms of use to register.',
    trainingContentConsentError: 'Please confirm the training content consent to register.',
    privacyPolicy: 'Privacy policy',
    termsOfUse: 'Terms of use',
    passwordMismatch: 'The passwords do not match.',
    registrationSaved: 'Thank you for your access request!',
    registrationSavedText: 'Your access request has been saved. You will receive a confirmation email. An admin can now approve your access.',
    toLogin: 'Go to login',
    forgotPassword: 'Forgot password?',
    resetPasswordTitle: 'Reset password',
    resetEmailLabel: 'Email address',
    sendResetLink: 'Send reset link',
    resetNeutralMessage: 'If this email is registered, you will receive a message to reset your password.',
    open: 'Open',
    contact: 'Contact Leonid Curos',
    contactTitle: 'Contact Leonid Curos',
    contactIntro: 'Need support or have questions about the Academy, business building or Aqua Global?',
    contactDirect: 'Contact Leonid Curos directly.',
    personalSupport: 'Personal support for Academy, partner start, business building and Aqua Global questions.',
    openWhatsapp: 'Open WhatsApp',
    whatsappDescription: 'Direct contact via WhatsApp.',
    openTelegram: 'Open Telegram',
    telegramDescription: 'Direct contact via Telegram.',
    contactEmail: 'Show email',
    contactPhone: 'Show phone',
    officialProductPage: 'Official product page',
    officialProductText: 'Customers go directly to the official Aqua Global product page here.',
    openProductPage: 'Open product page',
    partnerBackoffice: 'Partner Backoffice',
    partnerBackofficeText: 'Existing Aqua Global partners go directly to the official backoffice here.',
    openBackoffice: 'Open backoffice',
    academyScopeNotice: 'The Harbor Global Academy does not handle customer or partner sign-ups. It is used exclusively for training, onboarding and supporting already registered partners.',
    communityCenter: 'INSTAGRAM COMMUNITY CENTER',
    voluntary: 'Optional: follow other partners, exchange ideas and build reach together.',
    harborAnthemActivate: 'Activate Harbor Anthem',
    harborAnthemPause: 'Pause Harbor Anthem',
    harborAnthemPlaying: 'HARBOR ANTHEM playing',
    anthemStatusPlaying: 'Now playing',
    anthemStatusPaused: 'Paused',
    anthemStatusActivate: 'Activate',
    anthemPausedForVideo: 'Paused for training video',
    anthemBlockedHint: 'Click here to activate Harbor Anthem',
    anthemMuted: 'Muted',
    registrationIntro: 'Enter your own discount code. Access is activated after review.',
    registrationPendingHelp: 'The user is saved and remains pending until admin approval.',
    loginIntro: 'Username is email or discount code. Approval must be approved.',
    adminLoginIntro: 'Protected admin access. Only approved administrators.',
    backToPartnerLogin: 'Back to partner login',
    premiumPartnerSystem: 'Premium Partner System',
    headerSubtitle: 'One link. One system. Every partner is onboarded professionally.',
    approvedShort: 'approved',
    partnerWaiting: 'partners waiting for approval.',
    partnerApproval: 'Partner approval',
    noRegistration: 'No access request saved yet.',
    registered: 'Registered',
    waiting: 'Waiting',
    approved: 'Approved',
    trainings: 'Trainings',
    partnerStatus: 'Partner status',
    assignTraining: 'Assign training',
    adminNotes: 'Admin notes',
    adminNotesPlaceholder: 'Note, next step or approval reason',
    approvePartner: 'Approve partner',
    reject: 'Reject',
    block: 'Block',
    save: 'Save',
    delete: 'Delete',
    dashboardOpen: 'Dashboard open',
    accessApproved: 'Your access is approved.',
    status: 'Status',
    streak: 'Streak',
    days12: '12 days',
    activePartners: 'Active partners',
    partnersOnline: 'Partners online',
    openQuestions: 'Open questions',
    answered: 'Answered',
    messagesLabel: 'Messages',
    instagramProfiles: 'Instagram profiles',
    notifications: 'Notifications',
    profileOpen: 'Open profile',
    calendarOpen: 'Open calendar',
    partnerCallBook: 'Book a partner call directly.',
    bookLeonidCall: 'Book an appointment with Leonid',
    bookLeonidCallText: 'Book your personal partner call with Leonid Curos directly through Calendly.',
    bookAppointment: 'Book appointment',
    secureFreeCall: 'Secure free call',
    schedulePartnerCall: 'Schedule partner call',
    bookWaterConsultation: 'Book water consultation',
    bookingCentralTitle: 'Central booking',
    bookingCentralText: 'All appointment buttons lead to the central Calendly page. Calendly manages availability, confirmation and Google Calendar invitations.',
    adminBookingTitle: 'Appointment bookings',
    adminBookingText: 'Appointments are managed directly in Calendly and Google Calendar.',
    onboardingCallTitle: 'Onboarding call after approval',
    onboardingCallText: 'After partner approval, book your next personal Academy appointment with Leonid.',
    helpSupportTitle: 'Help & Support',
    helpSupportText: 'If you need support, book an appointment with Leonid. The link opens in a new tab.',
    qaCalendlyTitle: 'Clarify a personal question',
    qaCalendlyText: 'For individual questions, you can also book an appointment with Leonid.',
    startCenterTitle: 'Partner Start Center',
    startCenterHeadline: 'Everything for the first partner day',
    startCenterText: 'Welcome, personal discount code, premium partner system and onboarding for your first Academy day.',
    useDiscountCode: 'Use discount code',
    trainingModules: 'Training modules',
    trainingModulesText: 'Multilingual lessons, training videos and tasks.',
    testLabTitle: 'TEST LAB & DEMONSTRATIONS',
    testLabModuleTitle: 'MODULE 4 - TEST LAB & DEMONSTRATIONS',
    testLabIntro: 'Practical water, plant, tea and comparison tests collected centrally so new partners can learn real demonstrations.',
    testLabSearch: 'Search test videos',
    testLabSearchPlaceholder: 'Search by title, category, learning goal or description',
    testLabRequired: 'Required video for new partners',
    testLabLearningGoal: 'Learning goal',
    testLabProgress: 'Test lab progress',
    testLabPrepared: 'Prepared',
    testLabNoResults: 'No test videos found.',
    newModule: 'New module',
    module: 'Module',
    lessons: 'lessons',
    completed: 'completed',
    currentModule: 'Current module',
    startVideo: 'Start video · music stops automatically',
    trainingVideoRunning: 'Training video is running',
    musicPaused: 'Background music is paused.',
    officialInstagram: 'Official Harbor Global Academy Instagram channel',
    officialInstagramText: 'News, updates, trainings, wins, events and community.',
    openInstagram: 'Open Instagram',
    partnerNetwork: 'Partner Instagram network',
    showMyProfile: 'Show my profile',
    instagramSearch: 'Name, city, Instagram name',
    follow: 'Follow',
    adminInstagramNotice: 'Admin note: Instagram profiles can be saved or removed by admins. Changes are confirmed before saving.',
    socialResourceText: 'Social media resource for reach, storytelling and partner growth.',
    communityChatTitle: 'COMMUNITY CHAT',
    chatIntro: 'Ask questions, give answers, share experiences, post wins and exchange tips.',
    adminChatTools: 'Admin tools: delete messages, warn users, block users and remove spam.',
    messagePlaceholder: 'Write a message...',
    send: 'Send',
    qaTitle: 'QUESTIONS & ANSWERS',
    qaSearch: 'Search question, topic, keyword or author',
    by: 'By',
    answersLabel: 'answers',
    bestAnswer: 'Best answer',
    markBestAnswer: 'Mark best answer',
    calendlyCalendar: 'Calendly calendar',
    calendlyText: 'Book partner calls, 1:1 guidance and follow-up appointments directly.',
    openCalendly: 'Open Calendly',
    nextDates: 'Upcoming dates',
    with: 'with',
    preparation: 'Preparation',
    preparationText: 'Before every call: keep backoffice screenshot, discount code and key question ready.',
    accessChecking: 'Checking access...',
    heroTitle: 'Private Partner Academy',
    heroText: 'Closed platform for active partners. Access with your own discount code and Academy approval.',
    protectedTitle: 'Protected',
    protectedText: 'Real partners only',
    multilingualTitle: 'Multilingual',
    multilingualText: 'Europe-ready',
    adminApprovalTitle: 'Admin approval',
    waits: 'waiting',
    instagramProfile: 'Official Instagram channel',
    contentAndReels: 'Open news, updates and community',
    officialInstagramBoxTitle: 'Official Instagram channel',
    officialInstagramBoxIntro: 'Follow Harbor Global Academy for:',
    instagramOfficialHighlights: ['Academy updates', 'New trainings', 'Product news', 'Partner wins', 'Live events', 'Community news'],
    instagramCommunityStat: 'Instagram Community',
    officialInstagramFooter: 'Official Instagram channel',
    calendlyProfile: 'Calendly calendar',
    bookPartnerCall: 'Book partner call',
  },
  ru: {
    register: 'Запрос доступа',
    login: 'Войти',
    adminLogin: 'Вход администратора',
    partnerRegister: 'Запрос доступа к Academy',
    partnerLogin: 'Вход партнёра',
    firstName: 'Имя',
    lastName: 'Фамилия',
    email: 'E-mail',
    whatsapp: 'WhatsApp',
    discountCode: 'Код скидки',
    city: 'Город',
    language: 'Язык',
    password: 'Пароль',
    passwordRepeat: 'Повторите пароль',
    profileImageUpload: 'Загрузить фото профиля',
    profileImageHint: 'Пожалуйста, загрузите чёткое фото профиля, чтобы Leonid Curos мог вас однозначно определить и подтвердить.',
    profileImageRequired: 'Пожалуйста, загрузите фото профиля.',
    profileImageInvalidType: 'Загрузите изображение JPG, PNG или WEBP.',
    profileImageTooLarge: 'Фото профиля может быть максимум 1,5 MB.',
    profileImageUpdateTooLarge: 'Исходное изображение может быть размером до 5 MB.',
    profileImageOptimizationFailed: 'Не удалось оптимизировать изображение до размера менее 1 MB с сохранением видимого качества.',
    profileImagePreview: 'Предпросмотр фото профиля',
    profileImageChange: 'Изменить фото профиля',
    submitRegistration: 'Отправить запрос доступа',
    checking: 'Проверка...',
    saving: 'Сохранение...',
    username: 'Логин',
    usernamePlaceholder: 'E-mail или код скидки',
    dashboard: 'Панель',
    career: 'Карьера Aqua Global',
    start: 'Старт-центр',
    modules: 'Модули',
    testLab: 'Тест-лаборатория',
    links: 'Полезные ссылки',
    resources: 'Центр загрузок',
    calendar: 'Calendly',
    social: 'Instagram',
    chat: 'Чат сообщества',
    qa: 'Вопросы и ответы',
    testimonials: 'Отзывы',
    admin: 'Админ',
    welcome: 'Добро пожаловать',
    logout: 'Выйти',
    pendingMessage: 'Ваш аккаунт ещё ожидает подтверждения',
    requiredFields: 'Пожалуйста, заполните все обязательные поля.',
    requiredCode: 'Введите свой код скидки.',
    invalidCode: 'Код должен содержать 3-24 символа: буквы, цифры, дефис или подчёркивание.',
    legalConsentError: 'Пожалуйста, примите политику конфиденциальности и условия использования для регистрации.',
    trainingContentConsentError: 'Пожалуйста, подтвердите согласие на использование учебных материалов для регистрации.',
    privacyPolicy: 'Политика конфиденциальности',
    termsOfUse: 'Условия использования',
    passwordMismatch: 'Пароли не совпадают.',
    registrationSaved: 'Спасибо за запрос доступа!',
    registrationSavedText: 'Запрос доступа сохранён. Вы получите подтверждение по e-mail. Администратор может активировать доступ.',
    toLogin: 'К входу',
    forgotPassword: 'Забыли пароль?',
    resetPasswordTitle: 'Сброс пароля',
    resetEmailLabel: 'E-mail',
    sendResetLink: 'Отправить ссылку',
    resetNeutralMessage: 'Если этот e-mail зарегистрирован, вы получите сообщение для сброса пароля.',
    open: 'Открыть',
    contact: 'Связаться с Leonid Curos',
    contactTitle: 'Связаться с Leonid Curos',
    contactIntro: 'Нужна поддержка или есть вопросы по Academy, развитию бизнеса или Aqua Global?',
    contactDirect: 'Свяжитесь с Leonid Curos напрямую.',
    personalSupport: 'Персональная поддержка по Academy, старту партнёра, развитию бизнеса и вопросам Aqua Global.',
    openWhatsapp: 'Открыть WhatsApp',
    whatsappDescription: 'Прямой контакт через WhatsApp.',
    openTelegram: 'Открыть Telegram',
    telegramDescription: 'Прямой контакт через Telegram.',
    contactEmail: 'Показать e-mail',
    contactPhone: 'Показать телефон',
    officialProductPage: 'Официальная страница продуктов',
    officialProductText: 'Здесь клиенты переходят прямо на официальную страницу продуктов Aqua Global.',
    openProductPage: 'Открыть страницу продуктов',
    partnerBackoffice: 'Partner Backoffice',
    partnerBackofficeText: 'Здесь действующие партнёры Aqua Global переходят прямо в официальный backoffice.',
    openBackoffice: 'Открыть backoffice',
    academyScopeNotice: 'Harbor Global Academy не регистрирует клиентов или партнёров. Она служит исключительно для обучения, ввода в работу и поддержки уже зарегистрированных партнёров.',
    communityCenter: 'INSTAGRAM COMMUNITY CENTER',
    voluntary: 'Добровольно: подписывайтесь на партнёров, общайтесь и развивайте охват вместе.',
    harborAnthemActivate: 'Включить Harbor Anthem',
    harborAnthemPause: 'Пауза Harbor Anthem',
    harborAnthemPlaying: 'HARBOR ANTHEM играет',
    anthemStatusPlaying: 'Сейчас играет',
    anthemStatusPaused: 'Пауза',
    anthemStatusActivate: 'Включить',
    anthemPausedForVideo: 'Пауза из-за учебного видео',
    anthemBlockedHint: 'Нажмите здесь, чтобы включить Harbor Anthem',
    anthemMuted: 'Без звука',
    registrationIntro: 'Введите свой код скидки. Доступ активируется после проверки.',
    registrationPendingHelp: 'Пользователь сохранён и остаётся в статусе pending до подтверждения администратором.',
    loginIntro: 'Логин — это e-mail или код скидки. Статус должен быть approved.',
    adminLoginIntro: 'Защищённый вход администратора. Только для подтверждённых администраторов.',
    backToPartnerLogin: 'Назад ко входу партнёра',
    premiumPartnerSystem: 'Премиальная партнёрская система',
    headerSubtitle: 'Одна ссылка. Одна система. Каждый партнёр проходит профессиональное обучение.',
    approvedShort: 'подтверждено',
    partnerWaiting: 'партнёров ожидают подтверждения.',
    partnerApproval: 'Подтверждение партнёров',
    noRegistration: 'Запросов доступа пока нет.',
    registered: 'Зарегистрировано',
    waiting: 'Ожидают',
    approved: 'Подтверждены',
    trainings: 'Обучения',
    partnerStatus: 'Статус партнёра',
    assignTraining: 'Назначить обучение',
    adminNotes: 'Заметки администратора',
    adminNotesPlaceholder: 'Заметка, следующий шаг или причина подтверждения',
    approvePartner: 'Подтвердить партнёра',
    reject: 'Отклонить',
    block: 'Заблокировать',
    save: 'Сохранить',
    delete: 'Удалить',
    dashboardOpen: 'Панель открыта',
    accessApproved: 'Ваш доступ подтверждён.',
    status: 'Статус',
    streak: 'Серия',
    days12: '12 дней',
    activePartners: 'Активные партнёры',
    partnersOnline: 'Партнёры онлайн',
    openQuestions: 'Открытые вопросы',
    answered: 'Отвечено',
    messagesLabel: 'Сообщения',
    instagramProfiles: 'Instagram-профили',
    notifications: 'Уведомления',
    profileOpen: 'Открыть профиль',
    calendarOpen: 'Открыть календарь',
    partnerCallBook: 'Забронировать партнёрский звонок.',
    bookLeonidCall: 'Записаться к Леониду',
    bookLeonidCallText: 'Забронируйте личный партнёрский звонок с Leonid Curos напрямую через Calendly.',
    bookAppointment: 'Забронировать встречу',
    secureFreeCall: 'Получить бесплатную консультацию',
    schedulePartnerCall: 'Назначить партнёрскую встречу',
    bookWaterConsultation: 'Забронировать консультацию по воде',
    bookingCentralTitle: 'Центральная запись',
    bookingCentralText: 'Все кнопки записи ведут на центральную страницу Calendly. Calendly управляет доступностью, подтверждением и приглашением в Google Calendar.',
    adminBookingTitle: 'Записи на встречи',
    adminBookingText: 'Управление встречами происходит напрямую в Calendly и Google Calendar.',
    onboardingCallTitle: 'Onboarding-звонок после подтверждения',
    onboardingCallText: 'После подтверждения партнёра можно забронировать личную Academy-встречу с Леонидом.',
    helpSupportTitle: 'Помощь и поддержка',
    helpSupportText: 'Если нужна поддержка, забронируйте встречу с Леонидом. Ссылка откроется в новой вкладке.',
    qaCalendlyTitle: 'Разобрать личный вопрос',
    qaCalendlyText: 'Для индивидуальных вопросов можно дополнительно забронировать встречу с Леонидом.',
    startCenterTitle: 'Старт-центр партнёра',
    startCenterHeadline: 'Всё для первого дня партнёра',
    startCenterText: 'Приветствие, личный код скидки, Premium Partner System и onboarding для первого дня в Academy.',
    useDiscountCode: 'Использовать код скидки',
    trainingModules: 'Учебные модули',
    trainingModulesText: 'Многоязычные уроки, обучающие видео и задания.',
    testLabTitle: 'ТЕСТ-ЛАБОРАТОРИЯ И ДЕМОНСТРАЦИИ',
    testLabModuleTitle: 'МОДУЛЬ 4 - ТЕСТ-ЛАБОРАТОРИЯ И ДЕМОНСТРАЦИИ',
    testLabIntro: 'Практические тесты воды, растений, чая и сравнений собраны централизованно, чтобы новые партнёры учились реальным демонстрациям.',
    testLabSearch: 'Поиск тестовых видео',
    testLabSearchPlaceholder: 'Поиск по названию, категории, цели или описанию',
    testLabRequired: 'Обязательное видео для новых партнёров',
    testLabLearningGoal: 'Цель обучения',
    testLabProgress: 'Прогресс тест-лаборатории',
    testLabPrepared: 'Подготовлено',
    testLabNoResults: 'Тестовые видео не найдены.',
    newModule: 'Новый модуль',
    module: 'Модуль',
    lessons: 'уроков',
    completed: 'завершено',
    currentModule: 'Текущий модуль',
    startVideo: 'Запустить видео · музыка остановится автоматически',
    trainingVideoRunning: 'Учебное видео запущено',
    musicPaused: 'Фоновая музыка на паузе.',
    officialInstagram: 'Официальный Instagram-канал Harbor Global Academy',
    officialInstagramText: 'Новости, обновления, обучения, успехи, события и сообщество.',
    openInstagram: 'Открыть Instagram',
    partnerNetwork: 'Партнёрская сеть Instagram',
    showMyProfile: 'Показывать мой профиль',
    instagramSearch: 'Имя, город, Instagram',
    follow: 'Подписаться',
    adminInstagramNotice: 'Админ: профили Instagram можно сохранять или удалять. Изменения подтверждаются перед сохранением.',
    socialResourceText: 'Ресурс Social Media для охвата, сторителлинга и развития партнёров.',
    communityChatTitle: 'ЧАТ СООБЩЕСТВА',
    chatIntro: 'Задавайте вопросы, отвечайте, делитесь опытом, успехами и советами.',
    adminChatTools: 'Инструменты админа: удалять сообщения, предупреждать пользователей, блокировать и удалять спам.',
    messagePlaceholder: 'Написать сообщение...',
    send: 'Отправить',
    qaTitle: 'ВОПРОСЫ И ОТВЕТЫ',
    qaSearch: 'Поиск по вопросу, теме, тегу или автору',
    by: 'От',
    answersLabel: 'ответов',
    bestAnswer: 'Лучший ответ',
    markBestAnswer: 'Отметить лучший ответ',
    calendlyCalendar: 'Календарь Calendly',
    calendlyText: 'Бронируйте партнёрские звонки, 1:1 сопровождение и follow-up встречи.',
    openCalendly: 'Открыть Calendly',
    nextDates: 'Ближайшие встречи',
    with: 'с',
    preparation: 'Подготовка',
    preparationText: 'Перед каждым звонком: скриншот backoffice, код скидки и главный вопрос.',
    accessChecking: 'Проверка доступа...',
    heroTitle: 'Private Partner Academy',
    heroText: 'Закрытая платформа для активных партнёров. Доступ со своим кодом скидки и подтверждением Academy.',
    protectedTitle: 'Защищено',
    protectedText: 'Только настоящие партнёры',
    multilingualTitle: 'Многоязычно',
    multilingualText: 'Готово для Европы',
    adminApprovalTitle: 'Подтверждение админом',
    waits: 'ожидает',
    instagramProfile: 'Официальный Instagram-канал',
    contentAndReels: 'Открыть новости, обновления и сообщество',
    officialInstagramBoxTitle: 'Официальный Instagram-канал',
    officialInstagramBoxIntro: 'Подпишитесь на Harbor Global Academy для:',
    instagramOfficialHighlights: ['Обновления Academy', 'Новые обучения', 'Новинки продуктов', 'Успехи партнёров', 'Live Events', 'Новости сообщества'],
    instagramCommunityStat: 'Instagram Community',
    officialInstagramFooter: 'Официальный Instagram-канал',
    calendlyProfile: 'Календарь Calendly',
    bookPartnerCall: 'Забронировать звонок',
  },
  ro: {
    register: 'Solicită acces',
    login: 'Autentificare',
    adminLogin: 'Admin Login',
    partnerRegister: 'Solicită acces Academy',
    partnerLogin: 'Login partener',
    firstName: 'Prenume',
    lastName: 'Nume',
    email: 'E-mail',
    whatsapp: 'WhatsApp',
    discountCode: 'Cod reducere',
    city: 'Oraș',
    language: 'Limbă',
    password: 'Parolă',
    passwordRepeat: 'Repetă parola',
    profileImageUpload: 'Încarcă poza de profil',
    profileImageHint: 'Te rugăm să încarci o poză de profil clară, pentru ca Leonid Curos să te poată identifica și aproba.',
    profileImageRequired: 'Te rugăm să încarci o poză de profil.',
    profileImageInvalidType: 'Te rugăm să încarci o imagine JPG, PNG sau WEBP.',
    profileImageTooLarge: 'Poza de profil poate avea maximum 1,5 MB.',
    profileImageUpdateTooLarge: 'Imaginea originală poate avea maximum 5 MB.',
    profileImageOptimizationFailed: 'Imaginea nu a putut fi optimizată sub 1 MB păstrând calitatea vizibilă.',
    profileImagePreview: 'Previzualizare poză profil',
    profileImageChange: 'Schimbă poza de profil',
    submitRegistration: 'Trimite cererea de acces',
    checking: 'Se verifică...',
    saving: 'Se salvează...',
    username: 'Utilizator',
    usernamePlaceholder: 'E-mail sau cod reducere',
    dashboard: 'Dashboard',
    career: 'Carieră Aqua Global',
    start: 'Startcenter',
    modules: 'Module',
    testLab: 'Testlabor',
    links: 'Linkuri utile',
    resources: 'Centru descărcări',
    calendar: 'Calendly',
    social: 'Instagram',
    chat: 'Community Chat',
    qa: 'Întrebări & Răspunsuri',
    testimonials: 'Testimoniale',
    admin: 'Admin',
    welcome: 'Bun venit',
    logout: 'Logout',
    pendingMessage: 'Contul tău așteaptă încă aprobarea',
    requiredFields: 'Completează toate câmpurile obligatorii.',
    requiredCode: 'Introdu propriul cod de reducere.',
    invalidCode: 'Codul trebuie să aibă 3-24 caractere: litere, cifre, cratimă sau underscore.',
    legalConsentError: 'Te rugăm să accepți politica de confidențialitate și termenii de utilizare pentru a te înregistra.',
    trainingContentConsentError: 'Te rugăm să confirmi acordul pentru conținutul de training pentru a te înregistra.',
    privacyPolicy: 'Politica de confidențialitate',
    termsOfUse: 'Termeni de utilizare',
    passwordMismatch: 'Parolele nu coincid.',
    registrationSaved: 'Mulțumim pentru cererea de acces!',
    registrationSavedText: 'Cererea de acces a fost salvată. Vei primi un e-mail de confirmare. Adminul îți poate activa accesul.',
    toLogin: 'La login',
    forgotPassword: 'Ai uitat parola?',
    resetPasswordTitle: 'Resetează parola',
    resetEmailLabel: 'Adresă e-mail',
    sendResetLink: 'Trimite link resetare',
    resetNeutralMessage: 'Dacă această adresă este înregistrată, vei primi un mesaj pentru resetarea parolei.',
    open: 'Deschide',
    contact: 'Contact Leonid Curos',
    contactTitle: 'Contact Leonid Curos',
    contactIntro: 'Ai nevoie de suport sau ai întrebări despre Academy, dezvoltarea businessului sau Aqua Global?',
    contactDirect: 'Contactează-l direct pe Leonid Curos.',
    personalSupport: 'Suport personal pentru Academy, startul ca partener, dezvoltarea businessului și întrebări Aqua Global.',
    openWhatsapp: 'Deschide WhatsApp',
    whatsappDescription: 'Contact direct prin WhatsApp.',
    openTelegram: 'Deschide Telegram',
    telegramDescription: 'Contact direct prin Telegram.',
    contactEmail: 'Afișează e-mail',
    contactPhone: 'Afișează telefon',
    officialProductPage: 'Pagina oficială de produse',
    officialProductText: 'Aici clienții ajung direct la pagina oficială de produse Aqua Global.',
    openProductPage: 'Deschide pagina produselor',
    partnerBackoffice: 'Partner Backoffice',
    partnerBackofficeText: 'Aici partenerii existenți Aqua Global ajung direct în backoffice-ul oficial.',
    openBackoffice: 'Deschide backoffice',
    academyScopeNotice: 'Harbor Global Academy nu înregistrează clienți sau parteneri. Servește exclusiv pentru training, onboarding și suport pentru parteneri deja înregistrați.',
    communityCenter: 'INSTAGRAM COMMUNITY CENTER',
    voluntary: 'Opțional: urmărește alți parteneri, schimbați idei și creșteți împreună.',
    harborAnthemActivate: 'Activează Harbor Anthem',
    harborAnthemPause: 'Pauză Harbor Anthem',
    harborAnthemPlaying: 'HARBOR ANTHEM rulează',
    anthemStatusPlaying: 'Rulează acum',
    anthemStatusPaused: 'Pauză',
    anthemStatusActivate: 'Activează',
    anthemPausedForVideo: 'Pauză pentru video training',
    anthemBlockedHint: 'Apasă aici pentru a activa Harbor Anthem',
    anthemMuted: 'Dezactivat sunet',
    registrationIntro: 'Introdu propriul cod de reducere. Accesul este activat după verificare.',
    registrationPendingHelp: 'Utilizatorul este salvat și rămâne în status pending până la aprobarea adminului.',
    loginIntro: 'Utilizatorul este e-mail sau cod de reducere. Statusul trebuie să fie approved.',
    adminLoginIntro: 'Acces admin protejat. Doar pentru administratori aprobați.',
    backToPartnerLogin: 'Înapoi la login partener',
    premiumPartnerSystem: 'Sistem Premium pentru Parteneri',
    headerSubtitle: 'Un link. Un sistem. Fiecare partener este pregătit profesional.',
    approvedShort: 'aprobați',
    partnerWaiting: 'parteneri așteaptă aprobarea.',
    partnerApproval: 'Aprobare parteneri',
    noRegistration: 'Nu există încă cereri de acces.',
    registered: 'Înregistrați',
    waiting: 'În așteptare',
    approved: 'Aprobați',
    trainings: 'Traininguri',
    partnerStatus: 'Status partener',
    assignTraining: 'Atribuie training',
    adminNotes: 'Notițe admin',
    adminNotesPlaceholder: 'Notiță, pas următor sau motiv de aprobare',
    approvePartner: 'Aprobă partener',
    reject: 'Respinge',
    block: 'Blochează',
    save: 'Salvează',
    delete: 'Șterge',
    dashboardOpen: 'Dashboard deschis',
    accessApproved: 'Accesul tău este aprobat.',
    status: 'Status',
    streak: 'Serie',
    days12: '12 zile',
    activePartners: 'Parteneri activi',
    partnersOnline: 'Parteneri online',
    openQuestions: 'Întrebări deschise',
    answered: 'Răspunsuri',
    messagesLabel: 'Mesaje',
    instagramProfiles: 'Profiluri Instagram',
    notifications: 'Notificări',
    profileOpen: 'Deschide profilul',
    calendarOpen: 'Deschide calendarul',
    partnerCallBook: 'Programează direct un apel de partener.',
    bookLeonidCall: 'Programează o întâlnire cu Leonid',
    bookLeonidCallText: 'Programează apelul tău personal de partener cu Leonid Curos direct prin Calendly.',
    bookAppointment: 'Programează întâlnire',
    secureFreeCall: 'Rezervă discuția gratuită',
    schedulePartnerCall: 'Programează discuție partener',
    bookWaterConsultation: 'Programează consultanță apă',
    bookingCentralTitle: 'Programare centrală',
    bookingCentralText: 'Toate butoanele de programare duc la pagina centrală Calendly. Calendly gestionează disponibilitatea, confirmarea și invitația Google Calendar.',
    adminBookingTitle: 'Programări',
    adminBookingText: 'Administrarea programărilor se face direct în Calendly și Google Calendar.',
    onboardingCallTitle: 'Apel de onboarding după aprobare',
    onboardingCallText: 'După aprobarea ca partener, programează următoarea întâlnire personală Academy cu Leonid.',
    helpSupportTitle: 'Ajutor & Support',
    helpSupportText: 'Dacă ai nevoie de suport, programează o întâlnire cu Leonid. Linkul se deschide într-un tab nou.',
    qaCalendlyTitle: 'Clarifică o întrebare personală',
    qaCalendlyText: 'Pentru întrebări individuale poți programa și o întâlnire cu Leonid.',
    startCenterTitle: 'Startcenter Partener',
    startCenterHeadline: 'Totul pentru prima zi de partener',
    startCenterText: 'Bun venit, cod personal de reducere, Premium Partner System și onboarding pentru prima zi în Academy.',
    useDiscountCode: 'Folosește codul de reducere',
    trainingModules: 'Module de training',
    trainingModulesText: 'Lecții multilingve, video-uri de training și sarcini.',
    testLabTitle: 'TESTLABOR & DEMONSTRAȚII',
    testLabModuleTitle: 'MODUL 4 - TESTLABOR & DEMONSTRAȚII',
    testLabIntro: 'Teste practice cu apă, plante, ceai și comparații, centralizate pentru ca partenerii noi să învețe demonstrații reale.',
    testLabSearch: 'Caută video-uri de test',
    testLabSearchPlaceholder: 'Caută după titlu, categorie, obiectiv sau descriere',
    testLabRequired: 'Video obligatoriu pentru parteneri noi',
    testLabLearningGoal: 'Obiectiv de învățare',
    testLabProgress: 'Progres Testlabor',
    testLabPrepared: 'Pregătit',
    testLabNoResults: 'Nu s-au găsit video-uri de test.',
    newModule: 'Modul nou',
    module: 'Modul',
    lessons: 'lecții',
    completed: 'finalizat',
    currentModule: 'Modul curent',
    startVideo: 'Pornește video · muzica se oprește automat',
    trainingVideoRunning: 'Video-ul de training rulează',
    musicPaused: 'Muzica de fundal este în pauză.',
    officialInstagram: 'Canalul oficial Instagram Harbor Global Academy',
    officialInstagramText: 'News, update-uri, traininguri, reușite, evenimente și comunitate.',
    openInstagram: 'Deschide Instagram',
    partnerNetwork: 'Rețea Instagram parteneri',
    showMyProfile: 'Arată profilul meu',
    instagramSearch: 'Nume, oraș, nume Instagram',
    follow: 'Urmărește',
    adminInstagramNotice: 'Notă admin: profilurile Instagram pot fi salvate sau eliminate administrativ. Modificările sunt confirmate înainte de salvare.',
    socialResourceText: 'Resursă social media pentru reach, storytelling și creșterea partenerilor.',
    communityChatTitle: 'CHAT COMUNITATE',
    chatIntro: 'Pune întrebări, răspunde, împărtășește experiențe, postează reușite și schimbă sfaturi.',
    adminChatTools: 'Instrumente admin: ștergere mesaje, avertizare utilizatori, blocare utilizatori și eliminare spam.',
    messagePlaceholder: 'Scrie un mesaj...',
    send: 'Trimite',
    qaTitle: 'ÎNTREBĂRI & RĂSPUNSURI',
    qaSearch: 'Caută întrebare, temă, cuvânt-cheie sau autor',
    by: 'De la',
    answersLabel: 'răspunsuri',
    bestAnswer: 'Cel mai bun răspuns',
    markBestAnswer: 'Marchează cel mai bun răspuns',
    calendlyCalendar: 'Calendar Calendly',
    calendlyText: 'Programează direct apeluri de partener, ghidare 1:1 și follow-up.',
    openCalendly: 'Deschide Calendly',
    nextDates: 'Următoarele programări',
    with: 'cu',
    preparation: 'Pregătire',
    preparationText: 'Înainte de fiecare apel: screenshot backoffice, cod de reducere și întrebarea principală pregătite.',
    accessChecking: 'Se verifică accesul...',
    heroTitle: 'Private Partner Academy',
    heroText: 'Platformă închisă pentru parteneri activi. Acces cu propriul cod de reducere și aprobare Academy.',
    protectedTitle: 'Protejat',
    protectedText: 'Doar parteneri reali',
    multilingualTitle: 'Multilingv',
    multilingualText: 'Pregătit pentru Europa',
    adminApprovalTitle: 'Aprobare admin',
    waits: 'așteaptă',
    instagramProfile: 'Canal oficial Instagram',
    contentAndReels: 'Deschide news, update-uri și comunitatea',
    officialInstagramBoxTitle: 'Canal oficial Instagram',
    officialInstagramBoxIntro: 'Urmărește Harbor Global Academy pentru:',
    instagramOfficialHighlights: ['Academy updates', 'Traininguri noi', 'Noutăți produse', 'Reușite parteneri', 'Live events', 'Community news'],
    instagramCommunityStat: 'Instagram Community',
    officialInstagramFooter: 'Canal oficial Instagram',
    calendlyProfile: 'Calendar Calendly',
    bookPartnerCall: 'Programează apel partener',
  },
};

const extendedLabelsByCode = {
  gr: {
    register: 'Αίτηση πρόσβασης',
    login: 'Σύνδεση',
    adminLogin: 'Σύνδεση Admin',
    partnerRegister: 'Αίτηση πρόσβασης Academy',
    partnerLogin: 'Σύνδεση συνεργάτη',
    firstName: 'Όνομα',
    lastName: 'Επώνυμο',
    email: 'E-mail',
    whatsapp: 'WhatsApp',
    discountCode: 'Κωδικός έκπτωσης',
    city: 'Πόλη',
    language: 'Γλώσσα',
    password: 'Κωδικός πρόσβασης',
    passwordRepeat: 'Επανάληψη κωδικού',
    profileImageUpload: 'Ανέβασμα φωτογραφίας προφίλ',
    profileImageHint: 'Ανέβασε μια καθαρή φωτογραφία προφίλ, ώστε ο Leonid Curos να σε αναγνωρίσει και να εγκρίνει την πρόσβασή σου.',
    profileImageRequired: 'Παρακαλώ ανέβασε φωτογραφία προφίλ.',
    profileImageInvalidType: 'Παρακαλώ ανέβασε εικόνα JPG, PNG ή WEBP.',
    profileImageTooLarge: 'Η φωτογραφία προφίλ μπορεί να είναι έως 1,5 MB.',
    profileImageUpdateTooLarge: 'Η αρχική εικόνα μπορεί να είναι έως 5 MB.',
    profileImageOptimizationFailed: 'Δεν ήταν δυνατή η βελτιστοποίηση της εικόνας κάτω από 1 MB με διατήρηση της ορατής ποιότητας.',
    profileImagePreview: 'Προεπισκόπηση φωτογραφίας',
    profileImageChange: 'Αλλαγή φωτογραφίας',
    submitRegistration: 'Αποστολή αίτησης πρόσβασης',
    checking: 'Γίνεται έλεγχος...',
    saving: 'Αποθήκευση...',
    username: 'Όνομα χρήστη',
    usernamePlaceholder: 'E-mail ή κωδικός έκπτωσης',
    dashboard: 'Πίνακας',
    career: 'Καριέρα Aqua Global',
    start: 'Κέντρο έναρξης',
    modules: 'Ενότητες',
    testLab: 'Εργαστήριο δοκιμών',
    links: 'Χρήσιμοι σύνδεσμοι',
    resources: 'Κέντρο λήψεων',
    calendar: 'Calendly',
    social: 'Instagram',
    chat: 'Κοινότητα Chat',
    qa: 'Ερωτήσεις & Απαντήσεις',
    testimonials: 'Μαρτυρίες',
    admin: 'Admin',
    welcome: 'Καλώς ήρθες',
    logout: 'Αποσύνδεση',
    pendingMessage: 'Ο λογαριασμός σου περιμένει ακόμη έγκριση',
    requiredFields: 'Συμπλήρωσε όλα τα υποχρεωτικά πεδία.',
    requiredCode: 'Πληκτρολόγησε τον δικό σου κωδικό έκπτωσης.',
    invalidCode: 'Ο κωδικός πρέπει να έχει 3-24 χαρακτήρες και να περιέχει μόνο γράμματα, αριθμούς, παύλα ή κάτω παύλα.',
    legalConsentError: 'Αποδέξου την πολιτική απορρήτου και τους όρους χρήσης για να εγγραφείς.',
    trainingContentConsentError: 'Επιβεβαίωσε τη συναίνεση για εκπαιδευτικό περιεχόμενο για να εγγραφείς.',
    privacyPolicy: 'Πολιτική απορρήτου',
    termsOfUse: 'Όροι χρήσης',
    passwordMismatch: 'Οι κωδικοί δεν ταιριάζουν.',
    registrationSaved: 'Ευχαριστούμε για την αίτηση πρόσβασης!',
    registrationSavedText: 'Η αίτηση πρόσβασής σου αποθηκεύτηκε. Θα λάβεις e-mail επιβεβαίωσης. Η πρόσβαση ενεργοποιείται μετά από έγκριση.',
    toLogin: 'Προς σύνδεση',
    forgotPassword: 'Ξέχασες τον κωδικό;',
    resetPasswordTitle: 'Επαναφορά κωδικού',
    resetEmailLabel: 'Διεύθυνση e-mail',
    sendResetLink: 'Αποστολή συνδέσμου επαναφοράς',
    resetNeutralMessage: 'Αν αυτό το e-mail είναι εγγεγραμμένο, θα λάβεις μήνυμα για επαναφορά κωδικού.',
    open: 'Άνοιγμα',
    contact: 'Επικοινωνία με Leonid Curos',
    contactTitle: 'Επικοινωνία με Leonid Curos',
    contactIntro: 'Χρειάζεσαι υποστήριξη ή έχεις ερωτήσεις για την Academy, το business ή την Aqua Global;',
    contactDirect: 'Επικοινώνησε απευθείας με τον Leonid Curos.',
    personalSupport: 'Προσωπική υποστήριξη για Academy, εκκίνηση συνεργάτη, business και Aqua Global.',
    openWhatsapp: 'Άνοιγμα WhatsApp',
    whatsappDescription: 'Άμεση επικοινωνία μέσω WhatsApp.',
    openTelegram: 'Άνοιγμα Telegram',
    telegramDescription: 'Άμεση επικοινωνία μέσω Telegram.',
    contactEmail: 'Εμφάνιση e-mail',
    contactPhone: 'Εμφάνιση τηλεφώνου',
    officialProductPage: 'Επίσημη σελίδα προϊόντων',
    officialProductText: 'Εδώ οι πελάτες οδηγούνται απευθείας στην επίσημη σελίδα προϊόντων Aqua Global.',
    openProductPage: 'Άνοιγμα σελίδας προϊόντων',
    partnerBackoffice: 'Partner Backoffice',
    partnerBackofficeText: 'Εδώ οι υπάρχοντες συνεργάτες Aqua Global μεταβαίνουν στο επίσημο backoffice.',
    openBackoffice: 'Άνοιγμα Backoffice',
    academyScopeNotice: 'Η Harbor Global Academy δεν εγγράφει πελάτες ή συνεργάτες. Χρησιμεύει αποκλειστικά για εκπαίδευση, εισαγωγή και υποστήριξη ήδη εγγεγραμμένων συνεργατών.',
    communityCenter: 'ΚΕΝΤΡΟ ΚΟΙΝΟΤΗΤΑΣ INSTAGRAM',
    voluntary: 'Προαιρετικά: ακολούθησε άλλους συνεργάτες, ανταλλάξτε ιδέες και χτίστε μαζί εμβέλεια.',
    harborAnthemActivate: 'Ενεργοποίηση Harbor Anthem',
    harborAnthemPause: 'Παύση Harbor Anthem',
    harborAnthemPlaying: 'Το HARBOR ANTHEM παίζει',
    anthemStatusPlaying: 'Παίζει τώρα',
    anthemStatusPaused: 'Σε παύση',
    anthemStatusActivate: 'Ενεργοποίηση',
    anthemPausedForVideo: 'Παύση λόγω εκπαιδευτικού βίντεο',
    anthemBlockedHint: 'Κάνε κλικ για ενεργοποίηση του Harbor Anthem',
    anthemMuted: 'Σίγαση',
    registrationIntro: 'Πληκτρολόγησε τον δικό σου κωδικό έκπτωσης. Η πρόσβαση ενεργοποιείται μετά από έλεγχο.',
    registrationPendingHelp: 'Ο χρήστης αποθηκεύεται και παραμένει σε αναμονή μέχρι την έγκριση admin.',
    loginIntro: 'Το όνομα χρήστη είναι e-mail ή κωδικός έκπτωσης. Η πρόσβαση πρέπει να είναι approved.',
    adminLoginIntro: 'Προστατευμένη πρόσβαση admin. Μόνο για εγκεκριμένους διαχειριστές.',
    backToPartnerLogin: 'Πίσω στη σύνδεση συνεργάτη',
    premiumPartnerSystem: 'Premium Partner System',
    headerSubtitle: 'Ένας σύνδεσμος. Ένα σύστημα. Κάθε συνεργάτης εκπαιδεύεται επαγγελματικά.',
    approvedShort: 'εγκεκριμένοι',
    partnerWaiting: 'συνεργάτες περιμένουν έγκριση.',
    partnerApproval: 'Έγκριση συνεργάτη',
    noRegistration: 'Δεν υπάρχει ακόμη αίτηση πρόσβασης.',
    registered: 'Εγγεγραμμένοι',
    waiting: 'Σε αναμονή',
    approved: 'Εγκεκριμένοι',
    trainings: 'Εκπαιδεύσεις',
    partnerStatus: 'Κατάσταση συνεργάτη',
    assignTraining: 'Ανάθεση εκπαίδευσης',
    adminNotes: 'Σημειώσεις admin',
    adminNotesPlaceholder: 'Σημείωση, επόμενο βήμα ή λόγος έγκρισης',
    approvePartner: 'Έγκριση συνεργάτη',
    reject: 'Απόρριψη',
    block: 'Αποκλεισμός',
    save: 'Αποθήκευση',
    delete: 'Διαγραφή',
    dashboardOpen: 'Ο πίνακας άνοιξε',
    accessApproved: 'Η πρόσβασή σου εγκρίθηκε.',
    status: 'Κατάσταση',
    streak: 'Σειρά',
    days12: '12 ημέρες',
    activePartners: 'Ενεργοί συνεργάτες',
    partnersOnline: 'Συνεργάτες online',
    openQuestions: 'Ανοιχτές ερωτήσεις',
    answered: 'Απαντημένες',
    messagesLabel: 'Μηνύματα',
    instagramProfiles: 'Προφίλ Instagram',
    notifications: 'Ειδοποιήσεις',
    profileOpen: 'Άνοιγμα προφίλ',
    calendarOpen: 'Άνοιγμα ημερολογίου',
    partnerCallBook: 'Κλείσε απευθείας partner call.',
    bookLeonidCall: 'Κλείσε ραντεβού με τον Leonid',
    bookLeonidCallText: 'Κλείσε προσωπικό partner call με τον Leonid Curos μέσω Calendly.',
    bookAppointment: 'Κλείσιμο ραντεβού',
    secureFreeCall: 'Κλείσε δωρεάν κλήση',
    schedulePartnerCall: 'Κλείσε partner call',
    bookWaterConsultation: 'Κλείσε συμβουλευτική νερού',
    bookingCentralTitle: 'Κεντρική κράτηση ραντεβού',
    bookingCentralText: 'Όλα τα κουμπιά ραντεβού οδηγούν στην κεντρική σελίδα Calendly. Το Calendly διαχειρίζεται διαθεσιμότητα, επιβεβαίωση και πρόσκληση Google Calendar.',
    adminBookingTitle: 'Κρατήσεις ραντεβού',
    adminBookingText: 'Η διαχείριση ραντεβού γίνεται απευθείας μέσω Calendly και Google Calendar.',
    onboardingCallTitle: 'Onboarding call μετά την έγκριση',
    onboardingCallText: 'Μετά την έγκριση συνεργάτη, κλείσε το επόμενο προσωπικό Academy ραντεβού με τον Leonid.',
    helpSupportTitle: 'Βοήθεια & Υποστήριξη',
    helpSupportText: 'Αν χρειάζεσαι υποστήριξη, κλείσε ραντεβού με τον Leonid. Ο σύνδεσμος ανοίγει σε νέα καρτέλα.',
    qaCalendlyTitle: 'Διευκρίνιση προσωπικής ερώτησης',
    qaCalendlyText: 'Για ατομικές ερωτήσεις μπορείς επίσης να κλείσεις ραντεβού με τον Leonid.',
    startCenterTitle: 'Κέντρο έναρξης συνεργάτη',
    startCenterHeadline: 'Όλα για την πρώτη ημέρα συνεργάτη',
    startCenterText: 'Καλώς ήρθες, προσωπικός κωδικός έκπτωσης, Premium Partner System και onboarding για την πρώτη ημέρα στην Academy.',
    useDiscountCode: 'Χρήση κωδικού έκπτωσης',
    trainingModules: 'Εκπαιδευτικές ενότητες',
    trainingModulesText: 'Πολύγλωσσα μαθήματα, εκπαιδευτικά βίντεο και εργασίες.',
    testLabTitle: 'ΔΟΚΙΜΕΣ ΝΕΡΟΥ & ΠΡΟΪΟΝΤΩΝ',
    testLabModuleTitle: 'ΕΝΟΤΗΤΑ 4 - ΔΟΚΙΜΕΣ ΝΕΡΟΥ & ΠΡΟΪΟΝΤΩΝ',
    testLabIntro: 'Πρακτικά βίντεο για νερό, τσάι, φυτά, χρώμα και φίλτρα, ώστε οι συνεργάτες να μαθαίνουν πραγματικές επιδείξεις.',
    testLabSearch: 'Αναζήτηση βίντεο δοκιμών',
    testLabSearchPlaceholder: 'Αναζήτηση ανά τίτλο, κατηγορία, στόχο ή περιγραφή',
    testLabRequired: 'Υποχρεωτικό βίντεο για νέους συνεργάτες',
    testLabLearningGoal: 'Στόχος μάθησης',
    testLabProgress: 'Πρόοδος εργαστηρίου',
    testLabPrepared: 'Προετοιμασμένο',
    testLabNoResults: 'Δεν βρέθηκαν βίντεο δοκιμών.',
    newModule: 'Νέα ενότητα',
    module: 'Ενότητα',
    lessons: 'μαθήματα',
    completed: 'ολοκληρώθηκε',
    currentModule: 'Τρέχουσα ενότητα',
    startVideo: 'Έναρξη βίντεο · η μουσική σταματά αυτόματα',
    trainingVideoRunning: 'Το εκπαιδευτικό βίντεο παίζει',
    musicPaused: 'Η μουσική φόντου είναι σε παύση.',
    officialInstagram: 'Επίσημο Instagram κανάλι Harbor Global Academy',
    officialInstagramText: 'Νέα, updates, εκπαιδεύσεις, επιτυχίες, events και κοινότητα.',
    openInstagram: 'Άνοιγμα Instagram',
    partnerNetwork: 'Δίκτυο Instagram συνεργατών',
    showMyProfile: 'Εμφάνιση του προφίλ μου',
    instagramSearch: 'Όνομα, πόλη, όνομα Instagram',
    follow: 'Ακολούθηση',
    adminInstagramNotice: 'Σημείωση admin: Τα προφίλ Instagram μπορούν να αποθηκευτούν ή να αφαιρεθούν. Οι αλλαγές επιβεβαιώνονται πριν την αποθήκευση.',
    socialResourceText: 'Πόρος social media για εμβέλεια, storytelling και ανάπτυξη συνεργατών.',
    communityChatTitle: 'CHAT ΚΟΙΝΟΤΗΤΑΣ',
    chatIntro: 'Κάνε ερωτήσεις, απάντησε, μοιράσου εμπειρίες, επιτυχίες και συμβουλές.',
    adminChatTools: 'Admin εργαλεία: διαγραφή μηνυμάτων, προειδοποιήσεις, αποκλεισμός χρηστών και αφαίρεση spam.',
    messagePlaceholder: 'Γράψε μήνυμα...',
    send: 'Αποστολή',
    qaTitle: 'ΕΡΩΤΗΣΕΙΣ & ΑΠΑΝΤΗΣΕΙΣ',
    qaSearch: 'Αναζήτηση ερώτησης, θέματος, λέξης-κλειδιού ή συγγραφέα',
    by: 'Από',
    answersLabel: 'Απαντήσεις',
    bestAnswer: 'Καλύτερη απάντηση',
    markBestAnswer: 'Σήμανση καλύτερης απάντησης',
    calendlyCalendar: 'Ημερολόγιο Calendly',
    calendlyText: 'Κλείσε partner calls, 1:1 καθοδήγηση και follow-up ραντεβού.',
    openCalendly: 'Άνοιγμα Calendly',
    nextDates: 'Επόμενα ραντεβού',
    with: 'με',
    preparation: 'Προετοιμασία',
    preparationText: 'Πριν από κάθε call: screenshot backoffice, κωδικός έκπτωσης και βασική ερώτηση.',
    accessChecking: 'Έλεγχος πρόσβασης...',
    heroTitle: 'Private Partner Academy',
    heroText: 'Κλειστή πλατφόρμα για ενεργούς συνεργάτες. Πρόσβαση με δικό σου κωδικό έκπτωσης και έγκριση Academy.',
    protectedTitle: 'Προστατευμένο',
    protectedText: 'Μόνο πραγματικοί συνεργάτες',
    multilingualTitle: 'Πολύγλωσσο',
    multilingualText: 'Έτοιμο για Ευρώπη',
    adminApprovalTitle: 'Έγκριση Admin',
    waits: 'περιμένει',
    instagramProfile: 'Επίσημο Instagram κανάλι',
    contentAndReels: 'Άνοιγμα νέων, updates και κοινότητας',
    officialInstagramBoxTitle: 'Επίσημο Instagram κανάλι',
    officialInstagramBoxIntro: 'Ακολούθησε Harbor Global Academy για:',
    instagramOfficialHighlights: ['Academy updates', 'Νέες εκπαιδεύσεις', 'Νέα προϊόντα', 'Επιτυχίες συνεργατών', 'Live events', 'Νέα κοινότητας'],
    instagramCommunityStat: 'Instagram κοινότητα',
    officialInstagramFooter: 'Επίσημο Instagram κανάλι',
    calendlyProfile: 'Ημερολόγιο Calendly',
    bookPartnerCall: 'Κλείσε partner call',
  },
  tr: {
    register: 'Erişim talep et',
    login: 'Giriş yap',
    adminLogin: 'Admin girişi',
    partnerRegister: 'Academy erişimi talep et',
    partnerLogin: 'Partner girişi',
    firstName: 'Ad',
    lastName: 'Soyad',
    email: 'E-posta',
    whatsapp: 'WhatsApp',
    discountCode: 'İndirim kodu',
    city: 'Şehir',
    language: 'Dil',
    password: 'Şifre',
    passwordRepeat: 'Şifreyi tekrarla',
    profileImageUpload: 'Profil fotoğrafı yükle',
    profileImageHint: 'Leonid Curos seni net şekilde tanıyıp onaylayabilsin diye açık bir profil fotoğrafı yükle.',
    profileImageRequired: 'Lütfen profil fotoğrafı yükle.',
    profileImageInvalidType: 'Lütfen JPG, PNG veya WEBP yükle.',
    profileImageTooLarge: 'Profil fotoğrafı en fazla 1,5 MB olabilir.',
    profileImageUpdateTooLarge: 'Orijinal görsel en fazla 5 MB olabilir.',
    profileImageOptimizationFailed: 'Görsel, görünür kalite korunarak 1 MB altına optimize edilemedi.',
    profileImagePreview: 'Profil fotoğrafı önizleme',
    profileImageChange: 'Profil fotoğrafını değiştir',
    submitRegistration: 'Erişim talebini gönder',
    checking: 'Kontrol ediliyor...',
    saving: 'Kaydediliyor...',
    username: 'Kullanıcı adı',
    usernamePlaceholder: 'E-posta veya indirim kodu',
    dashboard: 'Panel',
    career: 'Aqua Global Kariyer',
    start: 'Başlangıç merkezi',
    modules: 'Modüller',
    testLab: 'Test laboratuvarı',
    links: 'Faydalı linkler',
    resources: 'İndirme merkezi',
    calendar: 'Calendly',
    social: 'Instagram',
    chat: 'Topluluk sohbeti',
    qa: 'Sorular & Cevaplar',
    testimonials: 'Referanslar',
    admin: 'Admin',
    welcome: 'Hoş geldin',
    logout: 'Çıkış',
    pendingMessage: 'Hesabın hâlâ onay bekliyor',
    requiredFields: 'Lütfen tüm zorunlu alanları doldur.',
    requiredCode: 'Lütfen kendi indirim kodunu gir.',
    invalidCode: 'Kod 3-24 karakter olmalı; harf, rakam, tire veya alt çizgi içerebilir.',
    legalConsentError: 'Kayıt için gizlilik politikasını ve kullanım şartlarını kabul etmelisin.',
    trainingContentConsentError: 'Kayıt için eğitim içeriği onayını vermelisin.',
    privacyPolicy: 'Gizlilik politikası',
    termsOfUse: 'Kullanım şartları',
    passwordMismatch: 'Şifreler eşleşmiyor.',
    registrationSaved: 'Erişim talebin için teşekkürler!',
    registrationSavedText: 'Erişim talebin kaydedildi. Onay e-postası alacaksın. Erişim admin kontrolünden sonra açılır.',
    toLogin: 'Girişe git',
    forgotPassword: 'Şifreni mi unuttun?',
    resetPasswordTitle: 'Şifreyi sıfırla',
    resetEmailLabel: 'E-posta adresi',
    sendResetLink: 'Sıfırlama linki gönder',
    resetNeutralMessage: 'Bu e-posta kayıtlıysa şifre sıfırlama mesajı alacaksın.',
    open: 'Aç',
    contact: 'Leonid Curos ile iletişim',
    contactTitle: 'Leonid Curos ile iletişim',
    contactIntro: 'Academy, iş kurma veya Aqua Global hakkında desteğe ya da sorulara mı ihtiyacın var?',
    contactDirect: 'Leonid Curos ile doğrudan iletişime geç.',
    personalSupport: 'Academy, partner başlangıcı, iş kurma ve Aqua Global soruları için kişisel destek.',
    openWhatsapp: 'WhatsApp aç',
    whatsappDescription: 'WhatsApp üzerinden doğrudan iletişim.',
    openTelegram: 'Telegram aç',
    telegramDescription: 'Telegram üzerinden doğrudan iletişim.',
    contactEmail: 'E-postayı göster',
    contactPhone: 'Telefonu göster',
    officialProductPage: 'Resmi ürün sayfası',
    officialProductText: 'Müşteriler buradan resmi Aqua Global ürün sayfasına gider.',
    openProductPage: 'Ürün sayfasını aç',
    partnerBackoffice: 'Partner Backoffice',
    partnerBackofficeText: 'Mevcut Aqua Global partnerleri buradan resmi backoffice alanına gider.',
    openBackoffice: 'Backoffice aç',
    academyScopeNotice: 'Harbor Global Academy müşteri veya partner kaydı yapmaz. Yalnızca kayıtlı partnerlerin eğitimi, onboarding ve desteği için kullanılır.',
    communityCenter: 'INSTAGRAM TOPLULUK MERKEZİ',
    voluntary: 'İsteğe bağlı: diğer partnerleri takip et, fikir alışverişi yap ve birlikte erişim oluştur.',
    harborAnthemActivate: 'Harbor Anthem etkinleştir',
    harborAnthemPause: 'Harbor Anthem duraklat',
    harborAnthemPlaying: 'HARBOR ANTHEM çalıyor',
    anthemStatusPlaying: 'Şimdi çalıyor',
    anthemStatusPaused: 'Duraklatıldı',
    anthemStatusActivate: 'Etkinleştir',
    anthemPausedForVideo: 'Eğitim videosu nedeniyle duraklatıldı',
    anthemBlockedHint: 'Harbor Anthem etkinleştirmek için tıkla',
    anthemMuted: 'Sessize alındı',
    registrationIntro: 'Kendi indirim kodunu gir. Erişim kontrolden sonra açılır.',
    registrationPendingHelp: 'Kullanıcı kaydedilir ve admin onayına kadar pending kalır.',
    loginIntro: 'Kullanıcı adı e-posta veya indirim kodudur. Durum approved olmalıdır.',
    adminLoginIntro: 'Korumalı admin erişimi. Yalnızca onaylı yöneticiler.',
    backToPartnerLogin: 'Partner girişine dön',
    premiumPartnerSystem: 'Premium Partner Sistemi',
    headerSubtitle: 'Tek link. Tek sistem. Her partner profesyonel hazırlanır.',
    approvedShort: 'onaylandı',
    partnerWaiting: 'partner onay bekliyor.',
    partnerApproval: 'Partner onayı',
    noRegistration: 'Henüz erişim talebi yok.',
    registered: 'Kayıtlı',
    waiting: 'Bekliyor',
    approved: 'Onaylandı',
    trainings: 'Eğitimler',
    partnerStatus: 'Partner durumu',
    assignTraining: 'Eğitim ata',
    adminNotes: 'Admin notları',
    adminNotesPlaceholder: 'Not, sonraki adım veya onay nedeni',
    approvePartner: 'Partneri onayla',
    reject: 'Reddet',
    block: 'Engelle',
    save: 'Kaydet',
    delete: 'Sil',
    dashboardOpen: 'Panel açıldı',
    accessApproved: 'Erişimin onaylandı.',
    status: 'Durum',
    streak: 'Seri',
    days12: '12 gün',
    activePartners: 'Aktif partnerler',
    partnersOnline: 'Online partnerler',
    openQuestions: 'Açık sorular',
    answered: 'Cevaplandı',
    messagesLabel: 'Mesajlar',
    instagramProfiles: 'Instagram profilleri',
    notifications: 'Bildirimler',
    profileOpen: 'Profili aç',
    calendarOpen: 'Takvimi aç',
    partnerCallBook: 'Partner call doğrudan rezerve et.',
    bookLeonidCall: 'Leonid ile randevu al',
    bookLeonidCallText: 'Leonid Curos ile kişisel partner call için Calendly üzerinden randevu al.',
    bookAppointment: 'Randevu al',
    secureFreeCall: 'Ücretsiz görüşmeyi ayır',
    schedulePartnerCall: 'Partner görüşmesi planla',
    bookWaterConsultation: 'Su danışmanlığı al',
    bookingCentralTitle: 'Merkezi randevu sistemi',
    bookingCentralText: 'Tüm randevu butonları merkezi Calendly sayfasına gider. Calendly uygunluk, onay ve Google Calendar davetini yönetir.',
    adminBookingTitle: 'Randevular',
    adminBookingText: 'Randevu yönetimi doğrudan Calendly ve Google Calendar üzerinden yapılır.',
    onboardingCallTitle: 'Onaydan sonra onboarding call',
    onboardingCallText: 'Partner onayından sonra Leonid ile sonraki kişisel Academy randevunu al.',
    helpSupportTitle: 'Yardım & Destek',
    helpSupportText: 'Desteğe ihtiyacın varsa Leonid ile randevu al. Link yeni sekmede açılır.',
    qaCalendlyTitle: 'Kişisel soruyu netleştir',
    qaCalendlyText: 'Bireysel sorular için Leonid ile ayrıca randevu alabilirsin.',
    startCenterTitle: 'Partner başlangıç merkezi',
    startCenterHeadline: 'İlk partner günü için her şey',
    startCenterText: 'Hoş geldin, kişisel indirim kodu, Premium Partner Sistemi ve ilk Academy günü için onboarding.',
    useDiscountCode: 'İndirim kodunu kullan',
    trainingModules: 'Eğitim modülleri',
    trainingModulesText: 'Çok dilli dersler, eğitim videoları ve görevler.',
    testLabTitle: 'SU & ÜRÜN TESTLERİ',
    testLabModuleTitle: 'MODÜL 4 - SU & ÜRÜN TESTLERİ',
    testLabIntro: 'Su, çay, bitki, renk ve filtre karşılaştırmaları için pratik videolar tek yerde.',
    testLabSearch: 'Test videoları ara',
    testLabSearchPlaceholder: 'Başlık, kategori, öğrenme hedefi veya açıklama ara',
    testLabRequired: 'Yeni partnerler için zorunlu video',
    testLabLearningGoal: 'Öğrenme hedefi',
    testLabProgress: 'Test laboratuvarı ilerlemesi',
    testLabPrepared: 'Hazırlandı',
    testLabNoResults: 'Test videosu bulunamadı.',
    newModule: 'Yeni modül',
    module: 'Modül',
    lessons: 'dersler',
    completed: 'tamamlandı',
    currentModule: 'Güncel modül',
    startVideo: 'Videoyu başlat · müzik otomatik durur',
    trainingVideoRunning: 'Eğitim videosu oynuyor',
    musicPaused: 'Arka plan müziği duraklatıldı.',
    officialInstagram: 'Resmi Harbor Global Academy Instagram kanalı',
    officialInstagramText: 'Haberler, güncellemeler, eğitimler, başarılar, etkinlikler ve topluluk.',
    openInstagram: 'Instagram aç',
    partnerNetwork: 'Partner Instagram ağı',
    showMyProfile: 'Profilimi göster',
    instagramSearch: 'İsim, şehir, Instagram adı',
    follow: 'Takip et',
    adminInstagramNotice: 'Admin notu: Instagram profilleri yönetici tarafından kaydedilebilir veya kaldırılabilir. Değişiklikler kayıttan önce onaylanır.',
    socialResourceText: 'Erişim, hikaye anlatımı ve partner gelişimi için sosyal medya kaynağı.',
    communityChatTitle: 'TOPLULUK SOHBETİ',
    chatIntro: 'Sorular sor, cevap ver, deneyimlerini, başarılarını ve ipuçlarını paylaş.',
    adminChatTools: 'Admin araçları: mesaj silme, kullanıcı uyarma, engelleme ve spam temizleme.',
    messagePlaceholder: 'Mesaj yaz...',
    send: 'Gönder',
    qaTitle: 'SORULAR & CEVAPLAR',
    qaSearch: 'Soru, konu, anahtar kelime veya yazar ara',
    by: 'Yazan',
    answersLabel: 'Cevaplar',
    bestAnswer: 'En iyi cevap',
    markBestAnswer: 'En iyi cevabı işaretle',
    calendlyCalendar: 'Calendly takvimi',
    calendlyText: 'Partner calls, 1:1 yönlendirme ve follow-up randevuları al.',
    openCalendly: 'Calendly aç',
    nextDates: 'Sonraki randevular',
    with: 'ile',
    preparation: 'Hazırlık',
    preparationText: 'Her call öncesi: backoffice screenshot, indirim kodu ve ana soru hazır olsun.',
    accessChecking: 'Erişim kontrol ediliyor...',
    heroTitle: 'Private Partner Academy',
    heroText: 'Aktif partnerler için kapalı platform. Kendi indirim kodun ve Academy onayı ile erişim.',
    protectedTitle: 'Korumalı',
    protectedText: 'Sadece gerçek partnerler',
    multilingualTitle: 'Çok dilli',
    multilingualText: 'Avrupa için hazır',
    adminApprovalTitle: 'Admin onayı',
    waits: 'bekliyor',
    instagramProfile: 'Resmi Instagram kanalı',
    contentAndReels: 'Haberleri, güncellemeleri ve topluluğu aç',
    officialInstagramBoxTitle: 'Resmi Instagram kanalı',
    officialInstagramBoxIntro: 'Harbor Global Academy takip et:',
    instagramOfficialHighlights: ['Academy güncellemeleri', 'Yeni eğitimler', 'Ürün yenilikleri', 'Partner başarıları', 'Canlı etkinlikler', 'Topluluk haberleri'],
    instagramCommunityStat: 'Instagram topluluğu',
    officialInstagramFooter: 'Resmi Instagram kanalı',
    calendlyProfile: 'Calendly takvimi',
    bookPartnerCall: 'Partner call al',
  },
  it: {
    register: 'Richiedi accesso',
    login: 'Accedi',
    adminLogin: 'Login Admin',
    partnerRegister: 'Richiedi accesso Academy',
    partnerLogin: 'Login partner',
    firstName: 'Nome',
    lastName: 'Cognome',
    email: 'E-mail',
    whatsapp: 'WhatsApp',
    discountCode: 'Codice sconto',
    city: 'Città',
    language: 'Lingua',
    password: 'Password',
    passwordRepeat: 'Ripeti password',
    profileImageUpload: 'Carica foto profilo',
    profileImageHint: 'Carica una foto profilo chiara, così Leonid Curos può identificarti e approvarti.',
    profileImageRequired: 'Carica una foto profilo.',
    profileImageInvalidType: 'Carica un file JPG, PNG o WEBP.',
    profileImageTooLarge: 'La foto profilo può avere massimo 1,5 MB.',
    profileImageUpdateTooLarge: 'L’immagine originale può avere una dimensione massima di 5 MB.',
    profileImageOptimizationFailed: 'Non è stato possibile ottimizzare l’immagine sotto 1 MB mantenendo la qualità visibile.',
    profileImagePreview: 'Anteprima foto profilo',
    profileImageChange: 'Cambia foto profilo',
    submitRegistration: 'Invia richiesta accesso',
    checking: 'Controllo...',
    saving: 'Salvataggio...',
    username: 'Nome utente',
    usernamePlaceholder: 'E-mail o codice sconto',
    dashboard: 'Dashboard',
    career: 'Carriera Aqua Global',
    start: 'Centro iniziale',
    modules: 'Moduli',
    testLab: 'Laboratorio test',
    links: 'Link utili',
    resources: 'Centro download',
    calendar: 'Calendly',
    social: 'Instagram',
    chat: 'Community Chat',
    qa: 'Domande & Risposte',
    testimonials: 'Testimonianze',
    admin: 'Admin',
    welcome: 'Benvenuto',
    logout: 'Logout',
    pendingMessage: 'Il tuo account è ancora in attesa di approvazione',
    requiredFields: 'Compila tutti i campi obbligatori.',
    requiredCode: 'Inserisci il tuo codice sconto.',
    invalidCode: 'Il codice deve avere 3-24 caratteri e può contenere lettere, numeri, trattino o underscore.',
    legalConsentError: 'Accetta privacy e termini per registrarti.',
    trainingContentConsentError: 'Conferma il consenso ai contenuti formativi per registrarti.',
    privacyPolicy: 'Informativa privacy',
    termsOfUse: 'Termini di utilizzo',
    passwordMismatch: 'Le password non coincidono.',
    registrationSaved: 'Grazie per la richiesta di accesso!',
    registrationSavedText: 'La richiesta è stata salvata. Riceverai una e-mail di conferma. Accesso dopo approvazione admin.',
    toLogin: 'Vai al login',
    forgotPassword: 'Password dimenticata?',
    resetPasswordTitle: 'Reimposta password',
    resetEmailLabel: 'Indirizzo e-mail',
    sendResetLink: 'Invia link reset',
    resetNeutralMessage: 'Se questa e-mail è registrata, riceverai un messaggio per reimpostare la password.',
    open: 'Apri',
    contact: 'Contatto Leonid Curos',
    contactTitle: 'Contatto Leonid Curos',
    contactIntro: 'Hai bisogno di supporto o hai domande su Academy, business o Aqua Global?',
    contactDirect: 'Contatta direttamente Leonid Curos.',
    personalSupport: 'Supporto personale per Academy, avvio partner, business e domande Aqua Global.',
    openWhatsapp: 'Apri WhatsApp',
    whatsappDescription: 'Contatto diretto via WhatsApp.',
    openTelegram: 'Apri Telegram',
    telegramDescription: 'Contatto diretto via Telegram.',
    contactEmail: 'Mostra e-mail',
    contactPhone: 'Mostra telefono',
    officialProductPage: 'Pagina prodotto ufficiale',
    officialProductText: 'Qui i clienti accedono direttamente alla pagina ufficiale Aqua Global.',
    openProductPage: 'Apri pagina prodotto',
    partnerBackoffice: 'Partner Backoffice',
    partnerBackofficeText: 'Qui i partner Aqua Global esistenti accedono al backoffice ufficiale.',
    openBackoffice: 'Apri Backoffice',
    academyScopeNotice: 'Harbor Global Academy non registra clienti o partner. Serve solo per formazione, onboarding e supporto di partner già registrati.',
    communityCenter: 'INSTAGRAM COMMUNITY CENTER',
    voluntary: 'Facoltativo: segui altri partner, scambiate idee e costruite insieme visibilità.',
    harborAnthemActivate: 'Attiva Harbor Anthem',
    harborAnthemPause: 'Pausa Harbor Anthem',
    harborAnthemPlaying: 'HARBOR ANTHEM in riproduzione',
    anthemStatusPlaying: 'In riproduzione',
    anthemStatusPaused: 'In pausa',
    anthemStatusActivate: 'Attiva',
    anthemPausedForVideo: 'In pausa per video formativo',
    anthemBlockedHint: 'Clicca qui per attivare Harbor Anthem',
    anthemMuted: 'Silenzioso',
    registrationIntro: 'Inserisci il tuo codice sconto. Accesso attivo dopo verifica.',
    registrationPendingHelp: 'L utente viene salvato e resta pending fino ad approvazione admin.',
    loginIntro: 'Il nome utente è e-mail o codice sconto. Lo stato deve essere approved.',
    adminLoginIntro: 'Accesso admin protetto. Solo amministratori approvati.',
    backToPartnerLogin: 'Torna al login partner',
    premiumPartnerSystem: 'Premium Partner System',
    headerSubtitle: 'Un link. Un sistema. Ogni partner viene preparato professionalmente.',
    approvedShort: 'approvati',
    partnerWaiting: 'partner attendono approvazione.',
    partnerApproval: 'Approvazione partner',
    noRegistration: 'Nessuna richiesta di accesso salvata.',
    registered: 'Registrati',
    waiting: 'In attesa',
    approved: 'Approvati',
    trainings: 'Formazioni',
    partnerStatus: 'Stato partner',
    assignTraining: 'Assegna formazione',
    adminNotes: 'Note admin',
    adminNotesPlaceholder: 'Nota, prossimo passo o motivo approvazione',
    approvePartner: 'Approva partner',
    reject: 'Rifiuta',
    block: 'Blocca',
    save: 'Salva',
    delete: 'Elimina',
    dashboardOpen: 'Dashboard aperta',
    accessApproved: 'Il tuo accesso è approvato.',
    status: 'Stato',
    streak: 'Serie',
    days12: '12 giorni',
    activePartners: 'Partner attivi',
    partnersOnline: 'Partner online',
    openQuestions: 'Domande aperte',
    answered: 'Risposte',
    messagesLabel: 'Messaggi',
    instagramProfiles: 'Profili Instagram',
    notifications: 'Notifiche',
    profileOpen: 'Apri profilo',
    calendarOpen: 'Apri calendario',
    partnerCallBook: 'Prenota direttamente una partner call.',
    bookLeonidCall: 'Prenota appuntamento con Leonid',
    bookLeonidCallText: 'Prenota la tua partner call personale con Leonid Curos tramite Calendly.',
    bookAppointment: 'Prenota appuntamento',
    secureFreeCall: 'Riserva chiamata gratuita',
    schedulePartnerCall: 'Prenota colloquio partner',
    bookWaterConsultation: 'Prenota consulenza acqua',
    bookingCentralTitle: 'Prenotazione centrale',
    bookingCentralText: 'Tutti i pulsanti appuntamento portano alla pagina Calendly centrale. Calendly gestisce disponibilità, conferma e invito Google Calendar.',
    adminBookingTitle: 'Prenotazioni',
    adminBookingText: 'La gestione appuntamenti avviene direttamente tramite Calendly e Google Calendar.',
    onboardingCallTitle: 'Onboarding call dopo approvazione',
    onboardingCallText: 'Dopo l approvazione partner, prenota il prossimo appuntamento Academy personale con Leonid.',
    helpSupportTitle: 'Aiuto & Supporto',
    helpSupportText: 'Se hai bisogno di supporto, prenota un appuntamento con Leonid. Il link apre una nuova scheda.',
    qaCalendlyTitle: 'Chiarisci una domanda personale',
    qaCalendlyText: 'Per domande individuali puoi prenotare anche un appuntamento con Leonid.',
    startCenterTitle: 'Centro iniziale partner',
    startCenterHeadline: 'Tutto per il primo giorno da partner',
    startCenterText: 'Benvenuto, codice sconto personale, Premium Partner System e onboarding per il primo giorno Academy.',
    useDiscountCode: 'Usa codice sconto',
    trainingModules: 'Moduli formativi',
    trainingModulesText: 'Lezioni multilingue, video formativi e attività.',
    testLabTitle: 'TEST ACQUA & PRODOTTI',
    testLabModuleTitle: 'MODULO 4 - TEST ACQUA & PRODOTTI',
    testLabIntro: 'Video pratici su acqua, tè, piante, colore e filtri raccolti in un unico posto.',
    testLabSearch: 'Cerca video test',
    testLabSearchPlaceholder: 'Cerca per titolo, categoria, obiettivo o descrizione',
    testLabRequired: 'Video obbligatorio per nuovi partner',
    testLabLearningGoal: 'Obiettivo formativo',
    testLabProgress: 'Avanzamento laboratorio',
    testLabPrepared: 'Preparato',
    testLabNoResults: 'Nessun video test trovato.',
    newModule: 'Nuovo modulo',
    module: 'Modulo',
    lessons: 'lezioni',
    completed: 'completato',
    currentModule: 'Modulo attuale',
    startVideo: 'Avvia video · la musica si ferma automaticamente',
    trainingVideoRunning: 'Video formativo in riproduzione',
    musicPaused: 'Musica di sottofondo in pausa.',
    officialInstagram: 'Canale Instagram ufficiale Harbor Global Academy',
    officialInstagramText: 'News, aggiornamenti, formazioni, successi, eventi e community.',
    openInstagram: 'Apri Instagram',
    partnerNetwork: 'Rete Instagram partner',
    showMyProfile: 'Mostra il mio profilo',
    instagramSearch: 'Nome, città, nome Instagram',
    follow: 'Segui',
    adminInstagramNotice: 'Nota admin: i profili Instagram possono essere salvati o rimossi dagli admin. Le modifiche vengono confermate prima del salvataggio.',
    socialResourceText: 'Risorsa social media per visibilità, storytelling e sviluppo partner.',
    communityChatTitle: 'COMMUNITY CHAT',
    chatIntro: 'Fai domande, rispondi, condividi esperienze, successi e consigli.',
    adminChatTools: 'Strumenti admin: elimina messaggi, avvisa utenti, blocca utenti e rimuovi spam.',
    messagePlaceholder: 'Scrivi messaggio...',
    send: 'Invia',
    qaTitle: 'DOMANDE & RISPOSTE',
    qaSearch: 'Cerca domanda, tema, parola chiave o autore',
    by: 'Da',
    answersLabel: 'Risposte',
    bestAnswer: 'Migliore risposta',
    markBestAnswer: 'Segna migliore risposta',
    calendlyCalendar: 'Calendario Calendly',
    calendlyText: 'Prenota partner call, guida 1:1 e follow-up.',
    openCalendly: 'Apri Calendly',
    nextDates: 'Prossimi appuntamenti',
    with: 'con',
    preparation: 'Preparazione',
    preparationText: 'Prima di ogni call: screenshot backoffice, codice sconto e domanda principale.',
    accessChecking: 'Controllo accesso...',
    heroTitle: 'Private Partner Academy',
    heroText: 'Piattaforma chiusa per partner attivi. Accesso con codice sconto personale e approvazione Academy.',
    protectedTitle: 'Protetto',
    protectedText: 'Solo partner reali',
    multilingualTitle: 'Multilingue',
    multilingualText: 'Pronto per Europa',
    adminApprovalTitle: 'Approvazione Admin',
    waits: 'attende',
    instagramProfile: 'Canale Instagram ufficiale',
    contentAndReels: 'Apri news, aggiornamenti e community',
    officialInstagramBoxTitle: 'Canale Instagram ufficiale',
    officialInstagramBoxIntro: 'Segui Harbor Global Academy per:',
    instagramOfficialHighlights: ['Aggiornamenti Academy', 'Nuove formazioni', 'Novità prodotti', 'Successi partner', 'Live events', 'News community'],
    instagramCommunityStat: 'Community Instagram',
    officialInstagramFooter: 'Canale Instagram ufficiale',
    calendlyProfile: 'Calendario Calendly',
    bookPartnerCall: 'Prenota partner call',
  },
  cz: {
    register: 'Požádat o přístup',
    login: 'Přihlášení',
    adminLogin: 'Admin přihlášení',
    partnerRegister: 'Požádat o přístup Academy',
    partnerLogin: 'Přihlášení partnera',
    firstName: 'Jméno',
    lastName: 'Příjmení',
    email: 'E-mail',
    whatsapp: 'WhatsApp',
    discountCode: 'Slevový kód',
    city: 'Město',
    language: 'Jazyk',
    password: 'Heslo',
    passwordRepeat: 'Zopakovat heslo',
    profileImageUpload: 'Nahrát profilovou fotku',
    profileImageHint: 'Nahraj jasnou profilovou fotku, aby tě Leonid Curos mohl jednoznačně přiřadit a schválit.',
    profileImageRequired: 'Nahraj prosím profilovou fotku.',
    profileImageInvalidType: 'Nahraj prosím obrázek JPG, PNG nebo WEBP.',
    profileImageTooLarge: 'Profilová fotka může mít maximálně 1,5 MB.',
    profileImageUpdateTooLarge: 'Původní obrázek může mít maximálně 5 MB.',
    profileImageOptimizationFailed: 'Obrázek se nepodařilo optimalizovat pod 1 MB při zachování viditelné kvality.',
    profileImagePreview: 'Náhled profilové fotky',
    profileImageChange: 'Změnit profilovou fotku',
    submitRegistration: 'Odeslat žádost o přístup',
    checking: 'Kontrola...',
    saving: 'Ukládání...',
    username: 'Uživatelské jméno',
    usernamePlaceholder: 'E-mail nebo slevový kód',
    dashboard: 'Dashboard',
    career: 'Kariéra Aqua Global',
    start: 'Start centrum',
    modules: 'Moduly',
    testLab: 'Testovací laboratoř',
    links: 'Užitečné odkazy',
    resources: 'Centrum stahování',
    calendar: 'Calendly',
    social: 'Instagram',
    chat: 'Komunitní chat',
    qa: 'Otázky & Odpovědi',
    testimonials: 'Reference',
    admin: 'Admin',
    welcome: 'Vítej',
    logout: 'Odhlásit',
    pendingMessage: 'Tvůj účet stále čeká na schválení',
    requiredFields: 'Vyplň prosím všechna povinná pole.',
    requiredCode: 'Zadej svůj vlastní slevový kód.',
    invalidCode: 'Kód musí mít 3-24 znaků a smí obsahovat písmena, čísla, pomlčku nebo podtržítko.',
    legalConsentError: 'Pro registraci přijmi zásady ochrany osobních údajů a podmínky použití.',
    trainingContentConsentError: 'Pro registraci potvrď souhlas se školicím obsahem.',
    privacyPolicy: 'Zásady ochrany osobních údajů',
    termsOfUse: 'Podmínky použití',
    passwordMismatch: 'Hesla se neshodují.',
    registrationSaved: 'Děkujeme za žádost o přístup!',
    registrationSavedText: 'Žádost byla uložena. Dostaneš potvrzovací e-mail. Přístup se aktivuje po kontrole adminem.',
    toLogin: 'Přejít na přihlášení',
    forgotPassword: 'Zapomenuté heslo?',
    resetPasswordTitle: 'Obnovit heslo',
    resetEmailLabel: 'E-mailová adresa',
    sendResetLink: 'Odeslat odkaz pro obnovu',
    resetNeutralMessage: 'Pokud je tento e-mail registrován, dostaneš zprávu pro obnovu hesla.',
    open: 'Otevřít',
    contact: 'Kontakt na Leonida Curose',
    contactTitle: 'Kontakt na Leonida Curose',
    contactIntro: 'Potřebuješ podporu nebo máš otázky k Academy, budování businessu nebo Aqua Global?',
    contactDirect: 'Kontaktuj Leonida Curose přímo.',
    personalSupport: 'Osobní podpora pro Academy, start partnera, business a otázky Aqua Global.',
    openWhatsapp: 'Otevřít WhatsApp',
    whatsappDescription: 'Přímý kontakt přes WhatsApp.',
    openTelegram: 'Otevřít Telegram',
    telegramDescription: 'Přímý kontakt přes Telegram.',
    contactEmail: 'Zobrazit e-mail',
    contactPhone: 'Zobrazit telefon',
    officialProductPage: 'Oficiální produktová stránka',
    officialProductText: 'Zákazníci se zde dostanou přímo na oficiální produktovou stránku Aqua Global.',
    openProductPage: 'Otevřít produktovou stránku',
    partnerBackoffice: 'Partner Backoffice',
    partnerBackofficeText: 'Stávající partneři Aqua Global se zde dostanou přímo do oficiálního backoffice.',
    openBackoffice: 'Otevřít Backoffice',
    academyScopeNotice: 'Harbor Global Academy neregistruje zákazníky ani partnery. Slouží pouze ke školení, onboardingu a podpoře již registrovaných partnerů.',
    communityCenter: 'INSTAGRAM COMMUNITY CENTER',
    voluntary: 'Dobrovolně: sleduj další partnery, vyměňujte si zkušenosti a budujte společně dosah.',
    harborAnthemActivate: 'Aktivovat Harbor Anthem',
    harborAnthemPause: 'Pozastavit Harbor Anthem',
    harborAnthemPlaying: 'HARBOR ANTHEM hraje',
    anthemStatusPlaying: 'Právě hraje',
    anthemStatusPaused: 'Pozastaveno',
    anthemStatusActivate: 'Aktivovat',
    anthemPausedForVideo: 'Pozastaveno kvůli školicímu videu',
    anthemBlockedHint: 'Klikni pro aktivaci Harbor Anthem',
    anthemMuted: 'Ztlumeno',
    registrationIntro: 'Zadej svůj vlastní slevový kód. Přístup bude aktivován po kontrole.',
    registrationPendingHelp: 'Uživatel je uložen a zůstává pending do schválení adminem.',
    loginIntro: 'Uživatelské jméno je e-mail nebo slevový kód. Stav musí být approved.',
    adminLoginIntro: 'Chráněný admin přístup. Pouze pro schválené administrátory.',
    backToPartnerLogin: 'Zpět na přihlášení partnera',
    premiumPartnerSystem: 'Premium Partner System',
    headerSubtitle: 'Jeden odkaz. Jeden systém. Každý partner je profesionálně zaškolen.',
    approvedShort: 'schváleno',
    partnerWaiting: 'partnerů čeká na schválení.',
    partnerApproval: 'Schválení partnera',
    noRegistration: 'Zatím není uložená žádná žádost.',
    registered: 'Registrováno',
    waiting: 'Čeká',
    approved: 'Schváleno',
    trainings: 'Školení',
    partnerStatus: 'Stav partnera',
    assignTraining: 'Přiřadit školení',
    adminNotes: 'Admin poznámky',
    adminNotesPlaceholder: 'Poznámka, další krok nebo důvod schválení',
    approvePartner: 'Schválit partnera',
    reject: 'Odmítnout',
    block: 'Zablokovat',
    save: 'Uložit',
    delete: 'Smazat',
    dashboardOpen: 'Dashboard otevřen',
    accessApproved: 'Tvůj přístup je schválen.',
    status: 'Stav',
    streak: 'Série',
    days12: '12 dní',
    activePartners: 'Aktivní partneři',
    partnersOnline: 'Partneři online',
    openQuestions: 'Otevřené otázky',
    answered: 'Zodpovězeno',
    messagesLabel: 'Zprávy',
    instagramProfiles: 'Instagram profily',
    notifications: 'Oznámení',
    profileOpen: 'Otevřít profil',
    calendarOpen: 'Otevřít kalendář',
    partnerCallBook: 'Rezervovat partner call přímo.',
    bookLeonidCall: 'Rezervovat termín s Leonidem',
    bookLeonidCallText: 'Rezervuj si osobní partner call s Leonidem Curosem přes Calendly.',
    bookAppointment: 'Rezervovat termín',
    secureFreeCall: 'Zajistit bezplatný hovor',
    schedulePartnerCall: 'Domluvit partner call',
    bookWaterConsultation: 'Rezervovat vodní konzultaci',
    bookingCentralTitle: 'Centrální rezervace',
    bookingCentralText: 'Všechna tlačítka termínů vedou na centrální stránku Calendly. Calendly spravuje dostupnost, potvrzení a pozvánku Google Calendar.',
    adminBookingTitle: 'Rezervace termínů',
    adminBookingText: 'Správa termínů probíhá přímo přes Calendly a Google Calendar.',
    onboardingCallTitle: 'Onboarding call po schválení',
    onboardingCallText: 'Po schválení partnera si rezervuj další osobní Academy termín s Leonidem.',
    helpSupportTitle: 'Pomoc & Podpora',
    helpSupportText: 'Pokud potřebuješ podporu, rezervuj si termín s Leonidem. Odkaz se otevře v nové kartě.',
    qaCalendlyTitle: 'Vyjasnit osobní otázku',
    qaCalendlyText: 'Pro individuální otázky si můžeš také rezervovat termín s Leonidem.',
    startCenterTitle: 'Start centrum partnera',
    startCenterHeadline: 'Vše pro první partnerský den',
    startCenterText: 'Vítej, osobní slevový kód, Premium Partner System a onboarding pro první Academy den.',
    useDiscountCode: 'Použít slevový kód',
    trainingModules: 'Školicí moduly',
    trainingModulesText: 'Vícejazyčné lekce, školicí videa a úkoly.',
    testLabTitle: 'TESTY VODY & PRODUKTŮ',
    testLabModuleTitle: 'MODUL 4 - TESTY VODY & PRODUKTŮ',
    testLabIntro: 'Praktická videa k vodě, čaji, rostlinám, barvě a filtrům na jednom místě.',
    testLabSearch: 'Hledat testovací videa',
    testLabSearchPlaceholder: 'Hledat podle názvu, kategorie, cíle nebo popisu',
    testLabRequired: 'Povinné video pro nové partnery',
    testLabLearningGoal: 'Cíl učení',
    testLabProgress: 'Pokrok test laboratoře',
    testLabPrepared: 'Připraveno',
    testLabNoResults: 'Nebyla nalezena žádná testovací videa.',
    newModule: 'Nový modul',
    module: 'Modul',
    lessons: 'lekce',
    completed: 'dokončeno',
    currentModule: 'Aktuální modul',
    startVideo: 'Spustit video · hudba se automaticky zastaví',
    trainingVideoRunning: 'Školicí video běží',
    musicPaused: 'Hudba na pozadí je pozastavena.',
    officialInstagram: 'Oficiální Instagram kanál Harbor Global Academy',
    officialInstagramText: 'Novinky, aktualizace, školení, úspěchy, události a komunita.',
    openInstagram: 'Otevřít Instagram',
    partnerNetwork: 'Instagram síť partnerů',
    showMyProfile: 'Zobrazit můj profil',
    instagramSearch: 'Jméno, město, Instagram jméno',
    follow: 'Sledovat',
    adminInstagramNotice: 'Poznámka admina: profily Instagram lze administrativně uložit nebo odstranit. Změny se před uložením potvrzují.',
    socialResourceText: 'Social media zdroj pro dosah, storytelling a růst partnerů.',
    communityChatTitle: 'KOMUNITNÍ CHAT',
    chatIntro: 'Ptej se, odpovídej, sdílej zkušenosti, úspěchy a tipy.',
    adminChatTools: 'Admin nástroje: mazat zprávy, varovat uživatele, blokovat uživatele a odstranit spam.',
    messagePlaceholder: 'Napsat zprávu...',
    send: 'Odeslat',
    qaTitle: 'OTÁZKY & ODPOVĚDI',
    qaSearch: 'Hledat otázku, téma, klíčové slovo nebo autora',
    by: 'Od',
    answersLabel: 'Odpovědi',
    bestAnswer: 'Nejlepší odpověď',
    markBestAnswer: 'Označit nejlepší odpověď',
    calendlyCalendar: 'Calendly kalendář',
    calendlyText: 'Rezervuj partner calls, 1:1 vedení a follow-up termíny.',
    openCalendly: 'Otevřít Calendly',
    nextDates: 'Další termíny',
    with: 's',
    preparation: 'Příprava',
    preparationText: 'Před každým call: backoffice screenshot, slevový kód a hlavní otázka.',
    accessChecking: 'Kontrola přístupu...',
    heroTitle: 'Private Partner Academy',
    heroText: 'Uzavřená platforma pro aktivní partnery. Přístup s vlastním slevovým kódem a schválením Academy.',
    protectedTitle: 'Chráněno',
    protectedText: 'Pouze skuteční partneři',
    multilingualTitle: 'Vícejazyčné',
    multilingualText: 'Připraveno pro Evropu',
    adminApprovalTitle: 'Admin schválení',
    waits: 'čeká',
    instagramProfile: 'Oficiální Instagram kanál',
    contentAndReels: 'Otevřít novinky, aktualizace a komunitu',
    officialInstagramBoxTitle: 'Oficiální Instagram kanál',
    officialInstagramBoxIntro: 'Sleduj Harbor Global Academy pro:',
    instagramOfficialHighlights: ['Academy aktualizace', 'Nová školení', 'Produktové novinky', 'Úspěchy partnerů', 'Live eventy', 'Komunitní novinky'],
    instagramCommunityStat: 'Instagram komunita',
    officialInstagramFooter: 'Oficiální Instagram kanál',
    calendlyProfile: 'Calendly kalendář',
    bookPartnerCall: 'Rezervovat partner call',
  },
};

Object.assign(labelsByCode, extendedLabelsByCode);
labelsByCode.el = labelsByCode.gr;
labelsByCode.cs = labelsByCode.cz;
labelsByCode.es = {
  ...labelsByCode.en,
  register: 'Solicitar acceso',
  login: 'Iniciar sesión',
  adminLogin: 'Admin login',
  partnerRegister: 'Solicitar acceso a Academy',
  partnerLogin: 'Login de partner',
  firstName: 'Nombre',
  lastName: 'Apellido',
  email: 'E-mail',
  whatsapp: 'WhatsApp',
  discountCode: 'Código de descuento',
  city: 'Ciudad',
  language: 'Idioma',
  password: 'Contraseña',
  repeatPassword: 'Repetir contraseña',
  submitRegistration: 'Enviar registro',
  loginButton: 'Entrar',
  dashboardTitle: 'Panel de Academy',
  startCenterTitle: 'Centro de inicio',
  trainingModules: 'Módulos de formación',
  resources: 'Centro de descargas',
  testimonials: 'Testimonios',
  communityChat: 'Chat de comunidad',
  questionsAnswers: 'Preguntas y respuestas',
  calendar: 'Calendario',
  profile: 'Perfil',
  admin: 'Admin',
  module: 'Módulo',
  lessons: 'lecciones',
  completed: 'completado',
  startVideo: 'Iniciar video',
  trainingVideoRunning: 'Video de formación activo',
  musicPaused: 'Harbor Anthem pausado durante el video.',
};
labelsByCode.pl = {
  ...labelsByCode.en,
  register: 'Poproś o dostęp',
  login: 'Zaloguj się',
  adminLogin: 'Login admina',
  partnerRegister: 'Poproś o dostęp do Academy',
  partnerLogin: 'Login partnera',
  firstName: 'Imię',
  lastName: 'Nazwisko',
  email: 'E-mail',
  whatsapp: 'WhatsApp',
  discountCode: 'Kod rabatowy',
  city: 'Miasto',
  language: 'Język',
  password: 'Hasło',
  repeatPassword: 'Powtórz hasło',
  submitRegistration: 'Wyślij rejestrację',
  loginButton: 'Zaloguj',
  dashboardTitle: 'Panel Academy',
  startCenterTitle: 'Centrum startowe',
  trainingModules: 'Moduły szkoleniowe',
  resources: 'Centrum pobierania',
  testimonials: 'Opinie',
  communityChat: 'Chat społeczności',
  questionsAnswers: 'Pytania i odpowiedzi',
  calendar: 'Kalendarz',
  profile: 'Profil',
  admin: 'Admin',
  module: 'Moduł',
  lessons: 'lekcje',
  completed: 'ukończono',
  startVideo: 'Uruchom video',
  trainingVideoRunning: 'Video szkoleniowe aktywne',
  musicPaused: 'Harbor Anthem pauzuje podczas video.',
};

const notificationLabelsByCode = {
  de: {
    news: 'Neuigkeiten',
    profile: 'Profil',
    updateNewsTitle: 'Neuigkeiten',
    updateNewsIntro: 'Neue Module, Videos, Ressourcen, Events und wichtige Academy Updates.',
    noNews: 'Noch keine Neuigkeit vorhanden.',
    newStatus: 'Neu',
    readStatus: 'Gelesen',
    importantStatus: 'Wichtig',
    markRead: 'Gelesen markieren',
    openUpdate: 'Jetzt ansehen',
    latestUpdates: 'Aktuelle Academy Updates',
    latestActivity: 'Letzte Aktivität',
    notificationSettings: 'Benachrichtigungseinstellungen',
    notificationSettingsText: 'Steuere, wie du über neue Academy-Inhalte informiert wirst.',
    emailUpdatesConsent: 'Ich möchte per E-Mail über neue Academy-Inhalte, Schulungen und wichtige Updates informiert werden.',
    whatsappUpdatesConsent: 'Ich möchte per WhatsApp über wichtige Academy-Updates informiert werden.',
    notificationLanguage: 'Sprache der Benachrichtigungen',
    saveNotificationSettings: 'Einstellungen speichern',
    notificationSettingsSaved: 'Benachrichtigungseinstellungen wurden gespeichert.',
    adminUpdateTitle: 'Neuigkeit / Update senden',
    adminUpdateIntro: 'Veröffentliche neue Inhalte für freigegebene Partner. Pending-Partner erhalten keine Nachricht.',
    updateTitleLabel: 'Titel',
    updateCategoryLabel: 'Kategorie',
    updateDescriptionLabel: 'Beschreibung',
    updateLinkLabel: 'Link zum Inhalt',
    updateLanguageLabel: 'Sprache',
    updateTargetLabel: 'Zielgruppe',
    targetAllApproved: 'Alle freigegebenen Partner',
    targetLanguage: 'Nur bestimmte Sprache',
    targetTraining: 'Nur bestimmte Schulung',
    targetPartners: 'Nur bestimmte Partner',
    targetTrainingLabel: 'Schulung',
    targetPartnersLabel: 'Partner auswählen',
    deliveryType: 'Versandart',
    deliveryEmail: 'E-Mail',
    deliveryWhatsappPrepared: 'WhatsApp vorbereitet',
    deliveryDashboardOnly: 'Dashboard-Mitteilung',
    sendNow: 'Sofort senden',
    saveDraft: 'Als Entwurf speichern',
    whatsappMessageCopy: 'WhatsApp Nachricht',
    copyWhatsappMessage: 'WhatsApp Nachricht kopieren',
    whatsappCopied: 'WhatsApp Text wurde kopiert.',
    recipientCount: 'Empfänger',
    emailSentCount: 'E-Mails gesendet',
    emailFailedCount: 'E-Mails fehlgeschlagen',
    academyUpdateSent: 'Neuigkeit wurde gespeichert.',
    notificationLogs: 'Benachrichtigungslogs',
  },
  en: {
    news: 'News',
    profile: 'Profile',
    updateNewsTitle: 'News',
    updateNewsIntro: 'New modules, videos, resources, events and important Academy updates.',
    noNews: 'No update available yet.',
    newStatus: 'New',
    readStatus: 'Read',
    importantStatus: 'Important',
    markRead: 'Mark as read',
    openUpdate: 'View now',
    latestUpdates: 'Latest Academy Updates',
    latestActivity: 'Latest activity',
    notificationSettings: 'Notification settings',
    notificationSettingsText: 'Control how you are informed about new Academy content.',
    emailUpdatesConsent: 'I would like to receive emails about new Academy content, trainings and important updates.',
    whatsappUpdatesConsent: 'I would like to receive WhatsApp reminders about important Academy updates.',
    notificationLanguage: 'Notification language',
    saveNotificationSettings: 'Save settings',
    notificationSettingsSaved: 'Notification settings saved.',
    adminUpdateTitle: 'Send news / update',
    adminUpdateIntro: 'Publish new content for approved partners. Pending partners do not receive notifications.',
    updateTitleLabel: 'Title',
    updateCategoryLabel: 'Category',
    updateDescriptionLabel: 'Description',
    updateLinkLabel: 'Content link',
    updateLanguageLabel: 'Language',
    updateTargetLabel: 'Target group',
    targetAllApproved: 'All approved partners',
    targetLanguage: 'Only one language',
    targetTraining: 'Only one training',
    targetPartners: 'Only selected partners',
    targetTrainingLabel: 'Training',
    targetPartnersLabel: 'Select partners',
    deliveryType: 'Delivery',
    deliveryEmail: 'Email',
    deliveryWhatsappPrepared: 'WhatsApp prepared',
    deliveryDashboardOnly: 'Dashboard message',
    sendNow: 'Send now',
    saveDraft: 'Save draft',
    whatsappMessageCopy: 'WhatsApp message',
    copyWhatsappMessage: 'Copy WhatsApp message',
    whatsappCopied: 'WhatsApp text copied.',
    recipientCount: 'Recipients',
    emailSentCount: 'Emails sent',
    emailFailedCount: 'Emails failed',
    academyUpdateSent: 'Update saved.',
    notificationLogs: 'Notification logs',
  },
  ru: {
    news: 'Новости',
    profile: 'Профиль',
    updateNewsTitle: 'Новости',
    updateNewsIntro: 'Новые модули, видео, ресурсы, события и важные обновления Academy.',
    noNews: 'Пока нет новостей.',
    newStatus: 'Новое',
    readStatus: 'Прочитано',
    importantStatus: 'Важно',
    markRead: 'Отметить прочитанным',
    openUpdate: 'Посмотреть',
    latestUpdates: 'Актуальные обновления Academy',
    latestActivity: 'Последняя активность',
    notificationSettings: 'Настройки уведомлений',
    notificationSettingsText: 'Укажите, как получать новости о новых материалах Academy.',
    emailUpdatesConsent: 'Я хочу получать e-mail о новых материалах Academy, обучениях и важных обновлениях.',
    whatsappUpdatesConsent: 'Я хочу получать WhatsApp-напоминания о важных обновлениях Academy.',
    notificationLanguage: 'Язык уведомлений',
    saveNotificationSettings: 'Сохранить настройки',
    notificationSettingsSaved: 'Настройки уведомлений сохранены.',
    adminUpdateTitle: 'Отправить новость / обновление',
    adminUpdateIntro: 'Публикуйте новые материалы для одобренных партнёров. Pending-партнёры уведомления не получают.',
    updateTitleLabel: 'Заголовок',
    updateCategoryLabel: 'Категория',
    updateDescriptionLabel: 'Описание',
    updateLinkLabel: 'Ссылка на материал',
    updateLanguageLabel: 'Язык',
    updateTargetLabel: 'Целевая группа',
    targetAllApproved: 'Все одобренные партнёры',
    targetLanguage: 'Только определённый язык',
    targetTraining: 'Только определённое обучение',
    targetPartners: 'Только выбранные партнёры',
    targetTrainingLabel: 'Обучение',
    targetPartnersLabel: 'Выбрать партнёров',
    deliveryType: 'Тип отправки',
    deliveryEmail: 'E-mail',
    deliveryWhatsappPrepared: 'WhatsApp подготовлено',
    deliveryDashboardOnly: 'Сообщение в Dashboard',
    sendNow: 'Отправить сейчас',
    saveDraft: 'Сохранить черновик',
    whatsappMessageCopy: 'WhatsApp сообщение',
    copyWhatsappMessage: 'Скопировать WhatsApp',
    whatsappCopied: 'Текст WhatsApp скопирован.',
    recipientCount: 'Получатели',
    emailSentCount: 'E-mail отправлено',
    emailFailedCount: 'E-mail с ошибкой',
    academyUpdateSent: 'Новость сохранена.',
    notificationLogs: 'Логи уведомлений',
  },
  ro: {
    news: 'Noutăți',
    profile: 'Profil',
    updateNewsTitle: 'Noutăți',
    updateNewsIntro: 'Module noi, video-uri, resurse, evenimente și update-uri importante Academy.',
    noNews: 'Nu există încă noutăți.',
    newStatus: 'Nou',
    readStatus: 'Citit',
    importantStatus: 'Important',
    markRead: 'Marchează ca citit',
    openUpdate: 'Vezi acum',
    latestUpdates: 'Update-uri Academy recente',
    latestActivity: 'Ultima activitate',
    notificationSettings: 'Setări notificări',
    notificationSettingsText: 'Controlează cum ești informat despre conținut nou Academy.',
    emailUpdatesConsent: 'Vreau să primesc e-mailuri despre conținut Academy nou, traininguri și update-uri importante.',
    whatsappUpdatesConsent: 'Vreau să primesc notificări WhatsApp despre update-uri importante Academy.',
    notificationLanguage: 'Limba notificărilor',
    saveNotificationSettings: 'Salvează setările',
    notificationSettingsSaved: 'Setările notificărilor au fost salvate.',
    adminUpdateTitle: 'Trimite noutate / update',
    adminUpdateIntro: 'Publică materiale noi pentru partenerii aprobați. Partenerii pending nu primesc notificări.',
    updateTitleLabel: 'Titlu',
    updateCategoryLabel: 'Categorie',
    updateDescriptionLabel: 'Descriere',
    updateLinkLabel: 'Link conținut',
    updateLanguageLabel: 'Limbă',
    updateTargetLabel: 'Grup țintă',
    targetAllApproved: 'Toți partenerii aprobați',
    targetLanguage: 'Doar o limbă',
    targetTraining: 'Doar un training',
    targetPartners: 'Doar parteneri selectați',
    targetTrainingLabel: 'Training',
    targetPartnersLabel: 'Selectează parteneri',
    deliveryType: 'Trimitere',
    deliveryEmail: 'E-mail',
    deliveryWhatsappPrepared: 'WhatsApp pregătit',
    deliveryDashboardOnly: 'Mesaj Dashboard',
    sendNow: 'Trimite acum',
    saveDraft: 'Salvează draft',
    whatsappMessageCopy: 'Mesaj WhatsApp',
    copyWhatsappMessage: 'Copiază mesaj WhatsApp',
    whatsappCopied: 'Textul WhatsApp a fost copiat.',
    recipientCount: 'Destinatari',
    emailSentCount: 'E-mailuri trimise',
    emailFailedCount: 'E-mailuri eșuate',
    academyUpdateSent: 'Noutatea a fost salvată.',
    notificationLogs: 'Loguri notificări',
  },
};

const extendedNotificationLabelsByCode = {
  gr: {
    news: 'Νέα',
    profile: 'Προφίλ',
    updateNewsTitle: 'Νέα',
    updateNewsIntro: 'Νέες ενότητες, βίντεο, πόροι, events και σημαντικά Academy updates.',
    noNews: 'Δεν υπάρχουν ακόμη νέα.',
    newStatus: 'Νέο',
    readStatus: 'Διαβασμένο',
    importantStatus: 'Σημαντικό',
    markRead: 'Σήμανση ως διαβασμένο',
    openUpdate: 'Προβολή τώρα',
    latestUpdates: 'Τελευταία Academy updates',
    latestActivity: 'Τελευταία δραστηριότητα',
    notificationSettings: 'Ρυθμίσεις ειδοποιήσεων',
    notificationSettingsText: 'Ρύθμισε πώς ενημερώνεσαι για νέο περιεχόμενο Academy.',
    emailUpdatesConsent: 'Θέλω να λαμβάνω e-mail για νέο περιεχόμενο Academy, εκπαιδεύσεις και σημαντικά updates.',
    whatsappUpdatesConsent: 'Θέλω να λαμβάνω WhatsApp υπενθυμίσεις για σημαντικά Academy updates.',
    notificationLanguage: 'Γλώσσα ειδοποιήσεων',
    saveNotificationSettings: 'Αποθήκευση ρυθμίσεων',
    notificationSettingsSaved: 'Οι ρυθμίσεις ειδοποιήσεων αποθηκεύτηκαν.',
    adminUpdateTitle: 'Αποστολή νέου / update',
    adminUpdateIntro: 'Δημοσίευσε νέο περιεχόμενο για εγκεκριμένους συνεργάτες. Οι pending συνεργάτες δεν λαμβάνουν ειδοποίηση.',
    updateTitleLabel: 'Τίτλος',
    updateCategoryLabel: 'Κατηγορία',
    updateDescriptionLabel: 'Περιγραφή',
    updateLinkLabel: 'Σύνδεσμος περιεχομένου',
    updateLanguageLabel: 'Γλώσσα',
    updateTargetLabel: 'Ομάδα στόχος',
    targetAllApproved: 'Όλοι οι εγκεκριμένοι συνεργάτες',
    targetLanguage: 'Μόνο συγκεκριμένη γλώσσα',
    targetTraining: 'Μόνο συγκεκριμένη εκπαίδευση',
    targetPartners: 'Μόνο επιλεγμένοι συνεργάτες',
    targetTrainingLabel: 'Εκπαίδευση',
    targetPartnersLabel: 'Επιλογή συνεργατών',
    deliveryType: 'Τρόπος αποστολής',
    deliveryEmail: 'E-mail',
    deliveryWhatsappPrepared: 'WhatsApp προετοιμασμένο',
    deliveryDashboardOnly: 'Μήνυμα Dashboard',
    sendNow: 'Αποστολή τώρα',
    saveDraft: 'Αποθήκευση ως πρόχειρο',
    whatsappMessageCopy: 'Μήνυμα WhatsApp',
    copyWhatsappMessage: 'Αντιγραφή WhatsApp',
    whatsappCopied: 'Το κείμενο WhatsApp αντιγράφηκε.',
    recipientCount: 'Παραλήπτες',
    emailSentCount: 'E-mail εστάλησαν',
    emailFailedCount: 'E-mail απέτυχαν',
    academyUpdateSent: 'Το update αποθηκεύτηκε.',
    notificationLogs: 'Logs ειδοποιήσεων',
  },
  tr: {
    news: 'Haberler',
    profile: 'Profil',
    updateNewsTitle: 'Haberler',
    updateNewsIntro: 'Yeni modüller, videolar, kaynaklar, etkinlikler ve önemli Academy güncellemeleri.',
    noNews: 'Henüz haber yok.',
    newStatus: 'Yeni',
    readStatus: 'Okundu',
    importantStatus: 'Önemli',
    markRead: 'Okundu işaretle',
    openUpdate: 'Şimdi görüntüle',
    latestUpdates: 'Son Academy güncellemeleri',
    latestActivity: 'Son aktivite',
    notificationSettings: 'Bildirim ayarları',
    notificationSettingsText: 'Yeni Academy içerikleri hakkında nasıl bilgilendirileceğini yönet.',
    emailUpdatesConsent: 'Yeni Academy içerikleri, eğitimler ve önemli güncellemeler hakkında e-posta almak istiyorum.',
    whatsappUpdatesConsent: 'Önemli Academy güncellemeleri için WhatsApp hatırlatmaları almak istiyorum.',
    notificationLanguage: 'Bildirim dili',
    saveNotificationSettings: 'Ayarları kaydet',
    notificationSettingsSaved: 'Bildirim ayarları kaydedildi.',
    adminUpdateTitle: 'Haber / update gönder',
    adminUpdateIntro: 'Onaylı partnerler için yeni içerik yayınla. Pending partnerler bildirim almaz.',
    updateTitleLabel: 'Başlık',
    updateCategoryLabel: 'Kategori',
    updateDescriptionLabel: 'Açıklama',
    updateLinkLabel: 'İçerik linki',
    updateLanguageLabel: 'Dil',
    updateTargetLabel: 'Hedef grup',
    targetAllApproved: 'Tüm onaylı partnerler',
    targetLanguage: 'Sadece belirli dil',
    targetTraining: 'Sadece belirli eğitim',
    targetPartners: 'Sadece seçili partnerler',
    targetTrainingLabel: 'Eğitim',
    targetPartnersLabel: 'Partner seç',
    deliveryType: 'Gönderim',
    deliveryEmail: 'E-posta',
    deliveryWhatsappPrepared: 'WhatsApp hazırlandı',
    deliveryDashboardOnly: 'Dashboard mesajı',
    sendNow: 'Şimdi gönder',
    saveDraft: 'Taslak kaydet',
    whatsappMessageCopy: 'WhatsApp mesajı',
    copyWhatsappMessage: 'WhatsApp mesajını kopyala',
    whatsappCopied: 'WhatsApp metni kopyalandı.',
    recipientCount: 'Alıcılar',
    emailSentCount: 'E-postalar gönderildi',
    emailFailedCount: 'E-postalar başarısız',
    academyUpdateSent: 'Update kaydedildi.',
    notificationLogs: 'Bildirim logları',
  },
  it: {
    news: 'Novità',
    profile: 'Profilo',
    updateNewsTitle: 'Novità',
    updateNewsIntro: 'Nuovi moduli, video, risorse, eventi e aggiornamenti importanti Academy.',
    noNews: 'Nessuna novità disponibile.',
    newStatus: 'Nuovo',
    readStatus: 'Letto',
    importantStatus: 'Importante',
    markRead: 'Segna come letto',
    openUpdate: 'Guarda ora',
    latestUpdates: 'Ultimi aggiornamenti Academy',
    latestActivity: 'Ultima attività',
    notificationSettings: 'Impostazioni notifiche',
    notificationSettingsText: 'Gestisci come ricevere notizie sui nuovi contenuti Academy.',
    emailUpdatesConsent: 'Voglio ricevere e-mail su nuovi contenuti Academy, formazioni e aggiornamenti importanti.',
    whatsappUpdatesConsent: 'Voglio ricevere promemoria WhatsApp sugli aggiornamenti importanti Academy.',
    notificationLanguage: 'Lingua notifiche',
    saveNotificationSettings: 'Salva impostazioni',
    notificationSettingsSaved: 'Impostazioni notifiche salvate.',
    adminUpdateTitle: 'Invia novità / update',
    adminUpdateIntro: 'Pubblica nuovi contenuti per partner approvati. I partner pending non ricevono notifiche.',
    updateTitleLabel: 'Titolo',
    updateCategoryLabel: 'Categoria',
    updateDescriptionLabel: 'Descrizione',
    updateLinkLabel: 'Link contenuto',
    updateLanguageLabel: 'Lingua',
    updateTargetLabel: 'Gruppo target',
    targetAllApproved: 'Tutti i partner approvati',
    targetLanguage: 'Solo una lingua',
    targetTraining: 'Solo una formazione',
    targetPartners: 'Solo partner selezionati',
    targetTrainingLabel: 'Formazione',
    targetPartnersLabel: 'Seleziona partner',
    deliveryType: 'Invio',
    deliveryEmail: 'E-mail',
    deliveryWhatsappPrepared: 'WhatsApp preparato',
    deliveryDashboardOnly: 'Messaggio Dashboard',
    sendNow: 'Invia ora',
    saveDraft: 'Salva bozza',
    whatsappMessageCopy: 'Messaggio WhatsApp',
    copyWhatsappMessage: 'Copia messaggio WhatsApp',
    whatsappCopied: 'Testo WhatsApp copiato.',
    recipientCount: 'Destinatari',
    emailSentCount: 'E-mail inviate',
    emailFailedCount: 'E-mail fallite',
    academyUpdateSent: 'Update salvato.',
    notificationLogs: 'Log notifiche',
  },
  cz: {
    news: 'Novinky',
    profile: 'Profil',
    updateNewsTitle: 'Novinky',
    updateNewsIntro: 'Nové moduly, videa, zdroje, eventy a důležité Academy aktualizace.',
    noNews: 'Zatím nejsou žádné novinky.',
    newStatus: 'Nové',
    readStatus: 'Přečteno',
    importantStatus: 'Důležité',
    markRead: 'Označit jako přečtené',
    openUpdate: 'Zobrazit nyní',
    latestUpdates: 'Aktuální Academy aktualizace',
    latestActivity: 'Poslední aktivita',
    notificationSettings: 'Nastavení oznámení',
    notificationSettingsText: 'Nastav, jak budeš informován o novém Academy obsahu.',
    emailUpdatesConsent: 'Chci dostávat e-maily o novém Academy obsahu, školeních a důležitých aktualizacích.',
    whatsappUpdatesConsent: 'Chci dostávat WhatsApp připomínky o důležitých Academy aktualizacích.',
    notificationLanguage: 'Jazyk oznámení',
    saveNotificationSettings: 'Uložit nastavení',
    notificationSettingsSaved: 'Nastavení oznámení bylo uloženo.',
    adminUpdateTitle: 'Odeslat novinku / update',
    adminUpdateIntro: 'Publikuj nový obsah pro schválené partnery. Pending partneři oznámení nedostanou.',
    updateTitleLabel: 'Název',
    updateCategoryLabel: 'Kategorie',
    updateDescriptionLabel: 'Popis',
    updateLinkLabel: 'Odkaz na obsah',
    updateLanguageLabel: 'Jazyk',
    updateTargetLabel: 'Cílová skupina',
    targetAllApproved: 'Všichni schválení partneři',
    targetLanguage: 'Jen určitý jazyk',
    targetTraining: 'Jen určité školení',
    targetPartners: 'Jen vybraní partneři',
    targetTrainingLabel: 'Školení',
    targetPartnersLabel: 'Vybrat partnery',
    deliveryType: 'Odeslání',
    deliveryEmail: 'E-mail',
    deliveryWhatsappPrepared: 'WhatsApp připraveno',
    deliveryDashboardOnly: 'Dashboard zpráva',
    sendNow: 'Odeslat nyní',
    saveDraft: 'Uložit koncept',
    whatsappMessageCopy: 'WhatsApp zpráva',
    copyWhatsappMessage: 'Kopírovat WhatsApp zprávu',
    whatsappCopied: 'WhatsApp text byl zkopírován.',
    recipientCount: 'Příjemci',
    emailSentCount: 'E-maily odeslány',
    emailFailedCount: 'E-maily selhaly',
    academyUpdateSent: 'Update uložen.',
    notificationLogs: 'Logy oznámení',
  },
};

Object.assign(notificationLabelsByCode, extendedNotificationLabelsByCode);
notificationLabelsByCode.el = notificationLabelsByCode.gr;
notificationLabelsByCode.cs = notificationLabelsByCode.cz;
notificationLabelsByCode.es = {
  ...notificationLabelsByCode.en,
  news: 'Novedades',
  profile: 'Perfil',
  updateNewsTitle: 'Novedades',
  noNews: 'Aún no hay novedades.',
  markRead: 'Marcar como leído',
  openUpdate: 'Ver ahora',
  notificationSettings: 'Ajustes de notificaciones',
  notificationLanguage: 'Idioma de notificaciones',
  saveNotificationSettings: 'Guardar ajustes',
};
notificationLabelsByCode.pl = {
  ...notificationLabelsByCode.en,
  news: 'Aktualności',
  profile: 'Profil',
  updateNewsTitle: 'Aktualności',
  noNews: 'Brak aktualności.',
  markRead: 'Oznacz jako przeczytane',
  openUpdate: 'Zobacz teraz',
  notificationSettings: 'Ustawienia powiadomień',
  notificationLanguage: 'Język powiadomień',
  saveNotificationSettings: 'Zapisz ustawienia',
};

const testimonialLabelsByCode = {
  de: {
    testimonialsTitle: 'Testimonials & Erfolgsgeschichten',
    testimonialsIntro: 'Echte Bewertungen freigegebener Partner. Neue Erfahrungsberichte werden zuerst geprüft und erscheinen erst nach Admin-Freigabe.',
    testimonialPendingNotice: 'Testimonial wartet auf Freigabe',
    testimonialWrite: 'Testimonial schreiben',
    testimonialTitleLabel: 'Titel',
    testimonialRatingLabel: 'Bewertung',
    testimonialExperienceLabel: 'Welche Erfahrungen hast du mit der Academy gemacht?',
    testimonialPlaceholder: 'Teile deine echte Erfahrung, deinen Fortschritt oder eine Erfolgsgeschichte.',
    testimonialUseProfile: 'Profilbild verwenden',
    testimonialShowLevel: 'Partner-Level anzeigen',
    testimonialShowTeam: 'Teamgröße anzeigen',
    testimonialSubmit: 'Bewertung abgeben',
    testimonialRequired: 'Bitte Titel und Erfahrungsbericht ausfüllen.',
    testimonialSavedPending: 'Danke, dein Testimonial wartet jetzt auf Freigabe durch Leonid Curos.',
    testimonialLoadError: 'Testimonials konnten nicht geladen werden.',
    testimonialAdminUpdateError: 'Admin-Änderung konnte nicht gespeichert werden.',
    testimonialUpdated: 'Testimonial aktualisiert.',
    testimonialDeleteConfirm: 'Dieses Testimonial dauerhaft löschen?',
    testimonialDeleted: 'Testimonial gelöscht.',
    testimonialDeleteError: 'Testimonial konnte nicht gelöscht werden.',
    testimonialFilterAll: 'Alle Bewertungen',
    testimonialFilterPartner: 'Partnerbewertungen',
    testimonialFilterSuccess: 'Academy-Erfolge',
    testimonialFilterTop: 'Top-Bewertungen',
    testimonialFilterNewest: 'Neueste Bewertungen',
    testimonialLoadingTitle: 'Testimonials laden',
    testimonialLoadingText: 'Bewertungen werden geladen...',
    testimonialEmptyTitle: 'Noch keine Bewertungen vorhanden',
    testimonialEmptyText: 'Sei der erste Partner und teile deine Erfahrungen mit der Harbor Global Partner Academy.',
    testimonialAdminTitle: 'Admin-Freigabe Testimonials',
    testimonialAdminEmpty: 'Keine Testimonials zur Prüfung vorhanden.',
    testimonialApprove: 'Freigeben',
    testimonialHide: 'Ausblenden',
    testimonialEdit: 'Bearbeiten',
    testimonialPartnerFallback: 'Partner',
    testimonialStarsLabel: 'von 5 Sternen',
    cancel: 'Abbrechen',
  },
  en: {
    testimonialsTitle: 'Testimonials & success stories',
    testimonialsIntro: 'Real reviews from approved partners. New experiences are reviewed first and appear only after admin approval.',
    testimonialPendingNotice: 'testimonial waiting for approval',
    testimonialWrite: 'Write testimonial',
    testimonialTitleLabel: 'Title',
    testimonialRatingLabel: 'Rating',
    testimonialExperienceLabel: 'What experiences have you had with the Academy?',
    testimonialPlaceholder: 'Share your real experience, progress or success story.',
    testimonialUseProfile: 'Use profile photo',
    testimonialShowLevel: 'Show partner level',
    testimonialShowTeam: 'Show team size',
    testimonialSubmit: 'Submit review',
    testimonialRequired: 'Please enter a title and experience report.',
    testimonialSavedPending: 'Thank you, your testimonial is now waiting for approval by Leonid Curos.',
    testimonialLoadError: 'Testimonials could not be loaded.',
    testimonialAdminUpdateError: 'Admin change could not be saved.',
    testimonialUpdated: 'Testimonial updated.',
    testimonialDeleteConfirm: 'Delete this testimonial permanently?',
    testimonialDeleted: 'Testimonial deleted.',
    testimonialDeleteError: 'Testimonial could not be deleted.',
    testimonialFilterAll: 'All reviews',
    testimonialFilterPartner: 'Partner reviews',
    testimonialFilterSuccess: 'Academy successes',
    testimonialFilterTop: 'Top reviews',
    testimonialFilterNewest: 'Newest reviews',
    testimonialLoadingTitle: 'Loading testimonials',
    testimonialLoadingText: 'Reviews are loading...',
    testimonialEmptyTitle: 'No reviews yet',
    testimonialEmptyText: 'Be the first partner and share your experience with the Harbor Global Partner Academy.',
    testimonialAdminTitle: 'Admin testimonial approval',
    testimonialAdminEmpty: 'No testimonials waiting for review.',
    testimonialApprove: 'Approve',
    testimonialHide: 'Hide',
    testimonialEdit: 'Edit',
    testimonialPartnerFallback: 'Partner',
    testimonialStarsLabel: 'out of 5 stars',
    cancel: 'Cancel',
  },
  ru: {
    testimonialsTitle: 'Отзывы и истории успеха',
    testimonialsIntro: 'Настоящие отзывы одобренных партнёров. Новые отзывы сначала проверяются и появляются только после подтверждения админом.',
    testimonialPendingNotice: 'отзыв ожидает подтверждения',
    testimonialWrite: 'Написать отзыв',
    testimonialTitleLabel: 'Заголовок',
    testimonialRatingLabel: 'Оценка',
    testimonialExperienceLabel: 'Какой у тебя опыт с Academy?',
    testimonialPlaceholder: 'Поделись реальным опытом, прогрессом или историей успеха.',
    testimonialUseProfile: 'Использовать фото профиля',
    testimonialShowLevel: 'Показать уровень партнёра',
    testimonialShowTeam: 'Показать размер команды',
    testimonialSubmit: 'Отправить оценку',
    testimonialRequired: 'Заполни заголовок и текст отзыва.',
    testimonialSavedPending: 'Спасибо, отзыв ожидает подтверждения Leonid Curos.',
    testimonialLoadError: 'Отзывы не удалось загрузить.',
    testimonialAdminUpdateError: 'Изменение админа не удалось сохранить.',
    testimonialUpdated: 'Отзыв обновлён.',
    testimonialDeleteConfirm: 'Удалить этот отзыв навсегда?',
    testimonialDeleted: 'Отзыв удалён.',
    testimonialDeleteError: 'Отзыв не удалось удалить.',
    testimonialFilterAll: 'Все отзывы',
    testimonialFilterPartner: 'Отзывы партнёров',
    testimonialFilterSuccess: 'Успехи Academy',
    testimonialFilterTop: 'Лучшие отзывы',
    testimonialFilterNewest: 'Новые отзывы',
    testimonialLoadingTitle: 'Загрузка отзывов',
    testimonialLoadingText: 'Отзывы загружаются...',
    testimonialEmptyTitle: 'Пока нет отзывов',
    testimonialEmptyText: 'Будь первым партнёром и поделись опытом с Harbor Global Partner Academy.',
    testimonialAdminTitle: 'Подтверждение отзывов админом',
    testimonialAdminEmpty: 'Нет отзывов для проверки.',
    testimonialApprove: 'Подтвердить',
    testimonialHide: 'Скрыть',
    testimonialEdit: 'Редактировать',
    testimonialPartnerFallback: 'Партнёр',
    testimonialStarsLabel: 'из 5 звёзд',
    cancel: 'Отмена',
  },
  ro: {
    testimonialsTitle: 'Testimoniale & povești de succes',
    testimonialsIntro: 'Recenzii reale de la parteneri aprobați. Experiențele noi sunt verificate și apar doar după aprobarea adminului.',
    testimonialPendingNotice: 'testimonial așteaptă aprobare',
    testimonialWrite: 'Scrie testimonial',
    testimonialTitleLabel: 'Titlu',
    testimonialRatingLabel: 'Evaluare',
    testimonialExperienceLabel: 'Ce experiențe ai avut cu Academy?',
    testimonialPlaceholder: 'Împărtășește experiența ta reală, progresul sau o poveste de succes.',
    testimonialUseProfile: 'Folosește poza de profil',
    testimonialShowLevel: 'Afișează nivelul partener',
    testimonialShowTeam: 'Afișează mărimea echipei',
    testimonialSubmit: 'Trimite evaluare',
    testimonialRequired: 'Completează titlul și experiența.',
    testimonialSavedPending: 'Mulțumim, testimonialul tău așteaptă aprobarea lui Leonid Curos.',
    testimonialLoadError: 'Testimonialele nu au putut fi încărcate.',
    testimonialAdminUpdateError: 'Modificarea admin nu a putut fi salvată.',
    testimonialUpdated: 'Testimonial actualizat.',
    testimonialDeleteConfirm: 'Ștergi definitiv acest testimonial?',
    testimonialDeleted: 'Testimonial șters.',
    testimonialDeleteError: 'Testimonialul nu a putut fi șters.',
    testimonialFilterAll: 'Toate evaluările',
    testimonialFilterPartner: 'Evaluări parteneri',
    testimonialFilterSuccess: 'Succese Academy',
    testimonialFilterTop: 'Top evaluări',
    testimonialFilterNewest: 'Cele mai noi',
    testimonialLoadingTitle: 'Se încarcă testimonialele',
    testimonialLoadingText: 'Evaluările se încarcă...',
    testimonialEmptyTitle: 'Nu există încă evaluări',
    testimonialEmptyText: 'Fii primul partener și împărtășește experiența ta cu Harbor Global Partner Academy.',
    testimonialAdminTitle: 'Aprobare testimonial admin',
    testimonialAdminEmpty: 'Nu există testimoniale pentru verificare.',
    testimonialApprove: 'Aprobă',
    testimonialHide: 'Ascunde',
    testimonialEdit: 'Editează',
    testimonialPartnerFallback: 'Partener',
    testimonialStarsLabel: 'din 5 stele',
    cancel: 'Anulează',
  },
  gr: {
    testimonialsTitle: 'Μαρτυρίες & ιστορίες επιτυχίας',
    testimonialsIntro: 'Πραγματικές αξιολογήσεις εγκεκριμένων συνεργατών. Νέες εμπειρίες ελέγχονται πρώτα και εμφανίζονται μόνο μετά από έγκριση admin.',
    testimonialPendingNotice: 'μαρτυρία περιμένει έγκριση',
    testimonialWrite: 'Γράψε μαρτυρία',
    testimonialTitleLabel: 'Τίτλος',
    testimonialRatingLabel: 'Αξιολόγηση',
    testimonialExperienceLabel: 'Ποιες εμπειρίες είχες με την Academy;',
    testimonialPlaceholder: 'Μοιράσου την πραγματική εμπειρία, πρόοδο ή ιστορία επιτυχίας σου.',
    testimonialUseProfile: 'Χρήση φωτογραφίας προφίλ',
    testimonialShowLevel: 'Εμφάνιση επιπέδου συνεργάτη',
    testimonialShowTeam: 'Εμφάνιση μεγέθους ομάδας',
    testimonialSubmit: 'Υποβολή αξιολόγησης',
    testimonialRequired: 'Συμπλήρωσε τίτλο και εμπειρία.',
    testimonialSavedPending: 'Ευχαριστούμε, η μαρτυρία σου περιμένει έγκριση από τον Leonid Curos.',
    testimonialLoadError: 'Οι μαρτυρίες δεν μπόρεσαν να φορτωθούν.',
    testimonialAdminUpdateError: 'Η αλλαγή admin δεν αποθηκεύτηκε.',
    testimonialUpdated: 'Η μαρτυρία ενημερώθηκε.',
    testimonialDeleteConfirm: 'Να διαγραφεί οριστικά αυτή η μαρτυρία;',
    testimonialDeleted: 'Η μαρτυρία διαγράφηκε.',
    testimonialDeleteError: 'Η μαρτυρία δεν μπόρεσε να διαγραφεί.',
    testimonialFilterAll: 'Όλες οι αξιολογήσεις',
    testimonialFilterPartner: 'Αξιολογήσεις συνεργατών',
    testimonialFilterSuccess: 'Επιτυχίες Academy',
    testimonialFilterTop: 'Κορυφαίες αξιολογήσεις',
    testimonialFilterNewest: 'Νεότερες αξιολογήσεις',
    testimonialLoadingTitle: 'Φόρτωση μαρτυριών',
    testimonialLoadingText: 'Οι αξιολογήσεις φορτώνονται...',
    testimonialEmptyTitle: 'Δεν υπάρχουν ακόμη αξιολογήσεις',
    testimonialEmptyText: 'Γίνε ο πρώτος συνεργάτης και μοιράσου την εμπειρία σου με τη Harbor Global Partner Academy.',
    testimonialAdminTitle: 'Έγκριση μαρτυριών Admin',
    testimonialAdminEmpty: 'Δεν υπάρχουν μαρτυρίες για έλεγχο.',
    testimonialApprove: 'Έγκριση',
    testimonialHide: 'Απόκρυψη',
    testimonialEdit: 'Επεξεργασία',
    testimonialPartnerFallback: 'Συνεργάτης',
    testimonialStarsLabel: 'από 5 αστέρια',
    cancel: 'Άκυρο',
  },
  tr: {
    testimonialsTitle: 'Referanslar & başarı hikayeleri',
    testimonialsIntro: 'Onaylı partnerlerden gerçek yorumlar. Yeni deneyimler önce incelenir ve admin onayından sonra görünür.',
    testimonialPendingNotice: 'referans onay bekliyor',
    testimonialWrite: 'Referans yaz',
    testimonialTitleLabel: 'Başlık',
    testimonialRatingLabel: 'Puan',
    testimonialExperienceLabel: 'Academy ile hangi deneyimleri yaşadın?',
    testimonialPlaceholder: 'Gerçek deneyimini, ilerlemeni veya başarı hikayeni paylaş.',
    testimonialUseProfile: 'Profil fotoğrafını kullan',
    testimonialShowLevel: 'Partner seviyesini göster',
    testimonialShowTeam: 'Takım büyüklüğünü göster',
    testimonialSubmit: 'Yorumu gönder',
    testimonialRequired: 'Başlık ve deneyim metnini doldur.',
    testimonialSavedPending: 'Teşekkürler, referansın Leonid Curos onayını bekliyor.',
    testimonialLoadError: 'Referanslar yüklenemedi.',
    testimonialAdminUpdateError: 'Admin değişikliği kaydedilemedi.',
    testimonialUpdated: 'Referans güncellendi.',
    testimonialDeleteConfirm: 'Bu referans kalıcı olarak silinsin mi?',
    testimonialDeleted: 'Referans silindi.',
    testimonialDeleteError: 'Referans silinemedi.',
    testimonialFilterAll: 'Tüm yorumlar',
    testimonialFilterPartner: 'Partner yorumları',
    testimonialFilterSuccess: 'Academy başarıları',
    testimonialFilterTop: 'En iyi yorumlar',
    testimonialFilterNewest: 'En yeni yorumlar',
    testimonialLoadingTitle: 'Referanslar yükleniyor',
    testimonialLoadingText: 'Yorumlar yükleniyor...',
    testimonialEmptyTitle: 'Henüz yorum yok',
    testimonialEmptyText: 'İlk partner ol ve Harbor Global Partner Academy deneyimini paylaş.',
    testimonialAdminTitle: 'Admin referans onayı',
    testimonialAdminEmpty: 'İncelenecek referans yok.',
    testimonialApprove: 'Onayla',
    testimonialHide: 'Gizle',
    testimonialEdit: 'Düzenle',
    testimonialPartnerFallback: 'Partner',
    testimonialStarsLabel: '5 yıldız üzerinden',
    cancel: 'İptal',
  },
  it: {
    testimonialsTitle: 'Testimonianze & storie di successo',
    testimonialsIntro: 'Recensioni reali di partner approvati. Le nuove esperienze vengono controllate e appaiono solo dopo approvazione admin.',
    testimonialPendingNotice: 'testimonianza in attesa di approvazione',
    testimonialWrite: 'Scrivi testimonianza',
    testimonialTitleLabel: 'Titolo',
    testimonialRatingLabel: 'Valutazione',
    testimonialExperienceLabel: 'Quali esperienze hai fatto con Academy?',
    testimonialPlaceholder: 'Condividi esperienza reale, progresso o storia di successo.',
    testimonialUseProfile: 'Usa foto profilo',
    testimonialShowLevel: 'Mostra livello partner',
    testimonialShowTeam: 'Mostra dimensione team',
    testimonialSubmit: 'Invia valutazione',
    testimonialRequired: 'Compila titolo ed esperienza.',
    testimonialSavedPending: 'Grazie, la tua testimonianza attende approvazione di Leonid Curos.',
    testimonialLoadError: 'Impossibile caricare le testimonianze.',
    testimonialAdminUpdateError: 'La modifica admin non è stata salvata.',
    testimonialUpdated: 'Testimonianza aggiornata.',
    testimonialDeleteConfirm: 'Eliminare definitivamente questa testimonianza?',
    testimonialDeleted: 'Testimonianza eliminata.',
    testimonialDeleteError: 'Impossibile eliminare la testimonianza.',
    testimonialFilterAll: 'Tutte le recensioni',
    testimonialFilterPartner: 'Recensioni partner',
    testimonialFilterSuccess: 'Successi Academy',
    testimonialFilterTop: 'Top recensioni',
    testimonialFilterNewest: 'Più recenti',
    testimonialLoadingTitle: 'Caricamento testimonianze',
    testimonialLoadingText: 'Le recensioni vengono caricate...',
    testimonialEmptyTitle: 'Nessuna recensione ancora',
    testimonialEmptyText: 'Sii il primo partner e condividi la tua esperienza con Harbor Global Partner Academy.',
    testimonialAdminTitle: 'Approvazione testimonianze admin',
    testimonialAdminEmpty: 'Nessuna testimonianza da verificare.',
    testimonialApprove: 'Approva',
    testimonialHide: 'Nascondi',
    testimonialEdit: 'Modifica',
    testimonialPartnerFallback: 'Partner',
    testimonialStarsLabel: 'su 5 stelle',
    cancel: 'Annulla',
  },
  cz: {
    testimonialsTitle: 'Reference & příběhy úspěchu',
    testimonialsIntro: 'Skutečná hodnocení schválených partnerů. Nové zkušenosti se nejdříve kontrolují a zobrazí se až po schválení adminem.',
    testimonialPendingNotice: 'reference čeká na schválení',
    testimonialWrite: 'Napsat referenci',
    testimonialTitleLabel: 'Název',
    testimonialRatingLabel: 'Hodnocení',
    testimonialExperienceLabel: 'Jaké zkušenosti máš s Academy?',
    testimonialPlaceholder: 'Sdílej svou skutečnou zkušenost, pokrok nebo příběh úspěchu.',
    testimonialUseProfile: 'Použít profilovou fotku',
    testimonialShowLevel: 'Zobrazit partnerskou úroveň',
    testimonialShowTeam: 'Zobrazit velikost týmu',
    testimonialSubmit: 'Odeslat hodnocení',
    testimonialRequired: 'Vyplň název a zkušenost.',
    testimonialSavedPending: 'Děkujeme, tvoje reference čeká na schválení Leonidem Curosem.',
    testimonialLoadError: 'Reference se nepodařilo načíst.',
    testimonialAdminUpdateError: 'Admin změnu se nepodařilo uložit.',
    testimonialUpdated: 'Reference aktualizována.',
    testimonialDeleteConfirm: 'Smazat tuto referenci natrvalo?',
    testimonialDeleted: 'Reference smazána.',
    testimonialDeleteError: 'Referenci se nepodařilo smazat.',
    testimonialFilterAll: 'Všechna hodnocení',
    testimonialFilterPartner: 'Hodnocení partnerů',
    testimonialFilterSuccess: 'Úspěchy Academy',
    testimonialFilterTop: 'Top hodnocení',
    testimonialFilterNewest: 'Nejnovější',
    testimonialLoadingTitle: 'Načítání referencí',
    testimonialLoadingText: 'Hodnocení se načítají...',
    testimonialEmptyTitle: 'Zatím žádná hodnocení',
    testimonialEmptyText: 'Buď první partner a sdílej své zkušenosti s Harbor Global Partner Academy.',
    testimonialAdminTitle: 'Admin schválení referencí',
    testimonialAdminEmpty: 'Nejsou žádné reference ke kontrole.',
    testimonialApprove: 'Schválit',
    testimonialHide: 'Skrýt',
    testimonialEdit: 'Upravit',
    testimonialPartnerFallback: 'Partner',
    testimonialStarsLabel: 'z 5 hvězd',
    cancel: 'Zrušit',
  },
};

Object.entries(testimonialLabelsByCode).forEach(([code, labels]) => {
  labelsByCode[code] = { ...(labelsByCode[code] || {}), ...labels };
});
labelsByCode.el = { ...(labelsByCode.el || {}), ...(testimonialLabelsByCode.gr || {}) };
labelsByCode.cs = { ...(labelsByCode.cs || {}), ...(testimonialLabelsByCode.cz || {}) };
labelsByCode.es = {
  ...(labelsByCode.es || {}),
  testimonialTitle: 'Testimonios',
  testimonialIntro: 'Experiencias reales de socios aprobados.',
  testimonialWrite: 'Escribir testimonio',
  testimonialSubmit: 'Enviar testimonio',
  testimonialEmptyTitle: 'Aún no hay valoraciones',
  testimonialEmptyText: 'Sé el primer partner y comparte tu experiencia con Harbor Global Partner Academy.',
};
labelsByCode.pl = {
  ...(labelsByCode.pl || {}),
  testimonialTitle: 'Opinie',
  testimonialIntro: 'Prawdziwe doświadczenia zatwierdzonych partnerów.',
  testimonialWrite: 'Napisz opinię',
  testimonialSubmit: 'Wyślij opinię',
  testimonialEmptyTitle: 'Brak opinii',
  testimonialEmptyText: 'Bądź pierwszym partnerem i podziel się doświadczeniem z Harbor Global Partner Academy.',
};

const ACADEMY_MODULE_ICONS = {
  crown: Crown,
  book: BookOpen,
  shield: ShieldCheck,
  trophy: Trophy,
  file: FileText,
  message: MessageCircle,
  flame: Flame,
  download: Download,
  users: Users,
  search: Search,
  quiz: FileQuestion,
};

const modules = getAcademyContentCatalog('de').map((module) => ({
  ...module,
  progress: 0,
  lessons: module.lessons.length,
  icon: ACADEMY_MODULE_ICONS[module.iconKey] || BookOpen,
  lang: ['DE', 'EN', 'RO', 'RU', 'EL', 'TR', 'IT', 'CS', 'ES', 'PL'],
}));

const academyVideos = [
  {
    id: 'wasser-ist-leben',
    moduleId: 2,
    moduleTitle: 'Aqua Global Grundlagen',
    title: 'Wasser ist Leben',
    description: 'Grundlagenvideo zur Bedeutung von Wasser, Wasserqualität und der Rolle von sauberem Wasser im Alltag.',
    category: 'Aqua Global Grundlagen',
    uploadDate: '12.06.2026',
    duration: '00:01:24',
    src: academyVideoStorageSrc('wasser-ist-leben.mp4'),
    fileName: 'wasser-ist-leben.mp4',
    progressStatus: 'Nicht angesehen',
    learningGoal: 'Partner verstehen, warum Wasserqualität die Basis für jedes Beratungsgespräch ist.',
    mainVideo: true,
    sortOrder: 1,
  },
  {
    id: 'allgemeine-ernaehrungsweise',
    moduleId: 2,
    moduleTitle: 'Aqua Global Grundlagen',
    title: 'Allgemeine Ernährungsweise',
    description: 'Einordnung von Ernährung, Trinkgewohnheiten und Wasser als Grundlage für Wohlbefinden und Beratung.',
    category: 'Aqua Global Grundlagen',
    uploadDate: '12.06.2026',
    duration: '00:04:25',
    src: academyVideoStorageSrc('allgemeine-ernaehrungsweise.mp4'),
    fileName: 'allgemeine-ernaehrungsweise.mp4',
    progressStatus: 'Nicht angesehen',
    learningGoal: 'Partner können Wasser im Kontext einer bewussten Ernährungsweise verständlich erklären.',
    mainVideo: true,
    sortOrder: 2,
  },
  {
    id: 'funktionen-wasser-koerper',
    moduleId: 2,
    moduleTitle: 'Aqua Global Grundlagen',
    title: 'Funktionen von Wasser im Körper',
    description: 'Schulung über zentrale Funktionen von Wasser im Körper und die saubere, seriöse Gesprächsführung dazu.',
    category: 'Aqua Global Grundlagen',
    uploadDate: '12.06.2026',
    duration: '00:04:32',
    src: academyVideoStorageSrc('funktionen-von-wasser-im-koerper.mp4'),
    fileName: 'funktionen-von-wasser-im-koerper.mp4',
    progressStatus: 'Nicht angesehen',
    learningGoal: 'Partner erklären die Funktionen von Wasser sachlich und ohne überzogene Aussagen.',
    mainVideo: true,
    sortOrder: 3,
  },
  {
    id: 'mineralien',
    moduleId: 2,
    moduleTitle: 'Aqua Global Grundlagen',
    title: 'Mineralien',
    description: 'Grundlagen zu Mineralien, Wasserwissen und häufigen Fragen im Kundengespräch.',
    category: 'Aqua Global Grundlagen',
    uploadDate: '12.06.2026',
    duration: '00:04:02',
    src: academyVideoStorageSrc('mineralien.mp4'),
    fileName: 'mineralien.mp4',
    progressStatus: 'Nicht angesehen',
    learningGoal: 'Partner können Mineralienfragen ruhig einordnen und sauber beantworten.',
    mainVideo: true,
    sortOrder: 4,
  },
  {
    id: 'grenzwerte',
    moduleId: 2,
    moduleTitle: 'Aqua Global Grundlagen',
    title: 'Grenzwerte',
    description: 'Schulung zu Grenzwerten, Messwerten und der richtigen Einordnung im Beratungsgespräch.',
    category: 'Aqua Global Grundlagen',
    uploadDate: '12.06.2026',
    duration: '00:05:00',
    src: academyVideoStorageSrc('grenzwerte.mp4'),
    fileName: 'grenzwerte.mp4',
    progressStatus: 'Nicht angesehen',
    learningGoal: 'Partner verstehen Grenzwerte und vermeiden falsche oder unzulässige Aussagen.',
    mainVideo: true,
    sortOrder: 5,
  },
  {
    id: 'umkehrosmose-erklaerung',
    moduleId: 3,
    moduleTitle: 'Produkte & Filtrationstechnologie',
    title: 'Umkehrosmose Erklärung',
    description: 'Erklärung der Umkehrosmose und Membranfiltration als Kern der Aqua Global Filtrationstechnologie.',
    category: 'Produkte & Filtrationstechnologie',
    uploadDate: '12.06.2026',
    duration: '00:07:31',
    src: academyVideoStorageSrc('umkehrosmose-erklaerung.mp4'),
    fileName: 'umkehrosmose-erklaerung.mp4',
    progressStatus: 'Nicht angesehen',
    learningGoal: 'Partner können Umkehrosmose einfach, verständlich und seriös erklären.',
    mainVideo: true,
    sortOrder: 1,
  },
  {
    id: 'ppm-bedeutung',
    moduleId: 10,
    moduleTitle: 'Testlabor & Praxis',
    title: 'PPM Bedeutung',
    description: 'Praxisvideo zur Bedeutung von PPM-Werten, Messung und verständlicher Erklärung im Testlabor.',
    category: 'PPM-Test',
    uploadDate: '12.06.2026',
    duration: '00:03:15',
    src: academyVideoStorageSrc('ppm-bedeutung.mp4'),
    fileName: 'ppm-bedeutung.mp4',
    progressStatus: 'Nicht angesehen',
    learningGoal: 'Partner erklären PPM-Werte korrekt und ordnen Messwerte professionell ein.',
    mainVideo: true,
    sortOrder: 1,
  },
  {
    id: 'membranfilter-vs-filterkanne',
    moduleId: 10,
    moduleTitle: 'Testlabor',
    title: 'Unterschied Membranfilter vs. Filterkanne',
    description: 'Vergleich zwischen Aqua Global Membranfiltration und einer herkömmlichen Filterkanne. Das Video zeigt den sichtbaren Unterschied in der Demonstration.',
    category: 'Wasser- und Filtertests',
    uploadDate: '07.06.2026',
    duration: '00:02:19',
    src: academyVideoStorageSrc('membranfilter-vs-filterkanne.mp4'),
    fileName: 'unterschiedn kanenfilter und membranefilter.mp4',
    progressStatus: 'Nicht angesehen',
    learningGoal: 'Partner können den Unterschied zwischen Membranfilter und Filterkanne klar und seriös erklären.',
    comments: ['Admin-Hinweis: Ideal als Einstiegsvideo für Wasser- und Filtervergleiche.'],
    qa: [
      { question: 'Wann nutze ich dieses Video?', answer: 'Wenn ein Kunde den Unterschied zwischen Kannenfilter und Membranfiltration verstehen möchte.' },
    ],
  },
  {
    id: 'tee-test',
    moduleId: 10,
    moduleTitle: 'Testlabor',
    title: 'Tee-Test',
    description: 'Zwei identische Tees werden mit Leitungswasser und Osmosewasser zubereitet. Sichtbar werden Farbe, Klarheit und Entfaltung.',
    category: 'Lebensmitteltests',
    uploadDate: '12.06.2026',
    duration: '00:01:53',
    src: academyVideoStorageSrc('tee-test.mp4'),
    fileName: '9. Teetest.mp4',
    progressStatus: 'Nicht angesehen',
    learningGoal: 'Partner lernen, den Tee-Test ruhig vorzubereiten und Unterschiede nachvollziehbar zu erklären.',
    required: true,
    comments: ['Pflichtvideo für neue Partner im Testlabor.'],
    qa: [
      { question: 'Warum ist der Tee-Test wichtig?', answer: 'Er macht Unterschiede in Klarheit und Entfaltung ohne komplizierte Technik sichtbar.' },
    ],
  },
  {
    id: 'basilikum-test',
    moduleId: 10,
    moduleTitle: 'Testlabor',
    title: 'Basilikum-Test',
    description: 'Vergleich des Pflanzenwachstums bei Basilikum mit Aqua Global Osmosewasser und normalem Leitungswasser.',
    category: 'Pflanzen- und Naturtests',
    uploadDate: '12.06.2026',
    duration: '00:04:09',
    src: academyVideoStorageSrc('basilikum-test.mp4'),
    fileName: '8. Basilikum Test..mp4',
    progressStatus: 'Nicht angesehen',
    learningGoal: 'Partner können Pflanzenvergleiche sauber dokumentieren und als Langzeitbeobachtung nutzen.',
    comments: ['Für Partner geeignet, die natürliche Vergleichstests zeigen möchten.'],
    qa: [
      { question: 'Wie lange sollte ein Pflanzenvergleich laufen?', answer: 'Am besten mehrere Tage oder Wochen mit gleichen Bedingungen und regelmäßiger Fotodokumentation.' },
    ],
    mainVideo: true,
    sortOrder: 2,
  },
  {
    id: 'farbtest',
    moduleId: 10,
    moduleTitle: 'Testlabor',
    title: 'Farbtest',
    description: 'Praktische Demonstration eines Farbvergleichs für sichtbare Unterschiede im Wasser- und Produkttest.',
    category: 'Wasser- und Produkttests',
    uploadDate: '07.06.2026',
    duration: '00:00:26',
    src: academyVideoStorageSrc('farbtest.mp4'),
    fileName: 'farbe test.mp4',
    progressStatus: 'Nicht angesehen',
    learningGoal: 'Partner sehen, wie ein kurzer Farbtest vorbereitet und dokumentiert wird.',
    comments: ['Kurzes Praxisvideo für schnelle Demonstrationen.'],
    qa: [
      { question: 'Soll der Farbtest allein genutzt werden?', answer: 'Nein, am besten zusammen mit Erklärung, Kontext und weiteren Vergleichstests.' },
    ],
  },
  {
    id: 'farbtest-erklaerung',
    moduleId: 10,
    moduleTitle: 'Testlabor',
    title: 'Farbtest Erklärung',
    description: 'Erklärung zum Farbtest mit Einordnung, Gesprächsführung und sauberer Aufklärung für Partner und Kunden.',
    category: 'Wasser- und Produkttests',
    uploadDate: '07.06.2026',
    duration: '00:02:49',
    src: academyVideoStorageSrc('farbtest-erklaerung.mp4'),
    fileName: 'farbe test aufklerung.mp4',
    progressStatus: 'Nicht angesehen',
    learningGoal: 'Partner können den Farbtest verständlich erklären und falsche Aussagen vermeiden.',
    comments: ['Empfohlen direkt nach dem kurzen Farbtest ansehen.'],
    qa: [
      { question: 'Was ist bei der Erklärung wichtig?', answer: 'Ruhig bleiben, sichtbar erklären und keine medizinischen oder überzogenen Aussagen machen.' },
    ],
  },
  {
    id: 'kundenbestellung',
    moduleId: 6,
    moduleTitle: 'Verkaufssystem',
    title: 'Kundenbestellung',
    description: 'Schritt-für-Schritt-Anleitung, wie ein Kunde korrekt zur offiziellen Aqua Global Produktseite geführt wird und eine Bestellung vorbereitet.',
    category: 'Kundengewinnung',
    uploadDate: '07.06.2026',
    duration: '00:05:21',
    src: academyVideoStorageSrc('kundenbestellung.mp4'),
    fileName: 'wie kunde bestelen.mp4',
    progressStatus: 'Nicht angesehen',
    learningGoal: 'Partner verstehen den Ablauf der Kundenbestellung über die offiziellen Aqua Global Wege.',
    comments: ['Wichtig: Die Academy selbst registriert keine Kunden.'],
    qa: [
      { question: 'Wo bestellt der Kunde?', answer: 'Über die offizielle Aqua Global Produktseite, nicht innerhalb der Academy.' },
    ],
  },
  {
    id: 'partnerregistrierung',
    moduleId: 9,
    moduleTitle: 'Partneraufbau',
    title: 'Partnerregistrierung',
    description: 'Anleitung, wie ein bestehender oder neuer Aqua Global Partner über die offiziellen Aqua Global Prozesse korrekt registriert wird.',
    category: 'Partneraufbau',
    uploadDate: '07.06.2026',
    duration: '00:08:54',
    src: academyVideoStorageSrc('partnerregistrierung.mp4'),
    fileName: 'wie man die partner registrieren.mp4',
    progressStatus: 'Nicht angesehen',
    learningGoal: 'Partner lernen den offiziellen Registrierungsweg und trennen Academy-Zugang klar vom Aqua Global Backoffice.',
    comments: ['Wichtig: Die Academy schult und unterstützt, registriert aber keine Aqua Global Partner.'],
    qa: [
      { question: 'Registriert die Academy Partner?', answer: 'Nein. Die Partnerregistrierung erfolgt über die offiziellen Aqua Global Wege.' },
    ],
  },
];

const PARTNER_ACADEMY_MODULES = [
  {
    id: 'welcome-start',
    title: 'Willkommen & Start',
    category: 'Onboarding',
    duration: '10 Min.',
    icon: Crown,
    description: 'Dein Einstieg in die Harbor Global Partner Academy und die ersten Orientierungspunkte.',
    learningGoal: 'Du verstehst, wie die Academy aufgebaut ist und womit du heute starten solltest.',
    intro: 'Dieses Modul gibt dir einen klaren Überblick: Was ist wichtig, was kommt als Nächstes und wie du dich Schritt für Schritt sicher durch die Academy bewegst.',
    steps: ['Academy-Aufbau verstehen', 'Dashboard und Profil prüfen', 'Erstes Lernziel festlegen'],
    task: 'Öffne dein Profil, prüfe deine Angaben und starte anschließend mit dem nächsten empfohlenen Modul.',
    videoIds: [],
    pdfIds: [],
    hasTask: true,
    catalogModuleId: 1
  },
  {
    id: 'first-steps',
    title: 'Erste Schritte',
    category: 'Onboarding',
    duration: '15 Min.',
    icon: Flame,
    description: 'Die wichtigsten Grundlagen für einen sicheren Start als Partner.',
    learningGoal: 'Du weißt, welche ersten Aktionen nach der Freigabe sinnvoll sind.',
    intro: 'Hier sammelst du die Basis für einen ruhigen, professionellen Start: Profil, Unterlagen, erste Orientierung und ein klares nächstes Ziel.',
    steps: ['Profil vervollständigen', 'Startunterlagen ansehen', 'Erstes Gespräch vorbereiten'],
    task: 'Notiere dir drei konkrete Personen oder Situationen, bei denen du Wasserwissen anwenden kannst.',
    videoIds: ['wasser-ist-leben'],
    pdfIds: ['your-world'],
    hasTask: true,
    catalogModuleId: 1
  },
  {
    id: 'water-knowledge',
    title: 'Wasserwissen',
    category: 'Produktwissen',
    duration: '35 Min.',
    icon: Globe2,
    description: 'Verstehe Wasserqualität, Mineralien, Grenzwerte und den Unterschied im Alltag.',
    learningGoal: 'Du kannst Wasserqualität einfach, verständlich und ohne Fachsprache erklären.',
    intro: 'Wasserwissen ist die Grundlage für gute Gespräche. Dieses Modul macht die wichtigsten Zusammenhänge greifbar und partnerfreundlich.',
    steps: ['Bedeutung von Wasser verstehen', 'Mineralien und Grenzwerte einordnen', 'Nutzen im Alltag erklären'],
    task: 'Formuliere eine einfache Erklärung, warum Wasserqualität für Familien relevant ist.',
    videoIds: ['wasser-ist-leben', 'allgemeine-ernaehrungsweise', 'funktionen-wasser-koerper', 'mineralien', 'grenzwerte'],
    pdfIds: ['wasser-praesentation'],
    hasTask: true,
    catalogModuleId: 2
  },
  {
    id: 'products-understand',
    title: 'Produkte verstehen',
    category: 'Produktwissen',
    duration: '30 Min.',
    icon: ShieldCheck,
    description: 'Lerne die wichtigsten Produktgruppen und ihren Nutzen im Kundengespräch kennen.',
    learningGoal: 'Du kannst die Produktidee klar erklären und passende Unterlagen gezielt einsetzen.',
    intro: 'Dieses Modul verbindet Produktverständnis mit einfacher Kommunikation. Ziel ist nicht Perfektion, sondern Sicherheit im ersten Gespräch.',
    steps: ['Produktidee verstehen', 'Unterlagen richtig nutzen', 'passende Empfehlungen vorbereiten'],
    task: 'Wähle eine Produktunterlage aus und übe eine kurze 60-Sekunden-Erklärung.',
    videoIds: ['umkehrosmose-erklaerung'],
    pdfIds: ['your-world', 'vp-filter', 'vp-membranen'],
    hasTask: true,
    catalogModuleId: 3
  },
  {
    id: 'ppm-test',
    title: 'PPM-Test',
    category: 'Praxis-Test',
    duration: '12 Min.',
    icon: FileQuestion,
    description: 'Lerne, wie der PPM-Test verständlich eingeordnet und sauber erklärt wird.',
    learningGoal: 'Du kannst den PPM-Test seriös zeigen, ohne falsche Versprechen zu machen.',
    intro: 'Der PPM-Test ist ein starkes Werkzeug, wenn er ruhig und sachlich erklärt wird. Dieses Modul zeigt dir die passende Einordnung.',
    steps: ['PPM-Wert verstehen', 'Test sicher erklären', 'typische Rückfragen beantworten'],
    task: 'Bereite eine kurze Erklärung vor, die auch ein kompletter Neueinsteiger versteht.',
    videoIds: ['ppm-bedeutung'],
    pdfIds: [],
    hasTask: true,
    catalogModuleId: 10
  },
  {
    id: 'tea-test',
    title: 'Tee-Test',
    category: 'Praxis-Test',
    duration: '10 Min.',
    icon: Smile,
    description: 'Nutze den Tee-Test als einfachen, visuellen Gesprächseinstieg.',
    learningGoal: 'Du kannst den Tee-Test sauber demonstrieren und den Nutzen verständlich ableiten.',
    intro: 'Der Tee-Test hilft dabei, Wasserqualität sichtbar zu machen. Im Vordergrund steht eine einfache, respektvolle Erklärung.',
    steps: ['Test vorbereiten', 'Beobachtung erklären', 'Gespräch ruhig weiterführen'],
    task: 'Schreibe dir einen natürlichen Einstiegssatz für die Tee-Test-Erklärung auf.',
    videoIds: ['tee-test'],
    pdfIds: [],
    hasTask: true,
    catalogModuleId: 10
  },
  {
    id: 'customer-talk',
    title: 'Kundengespräch',
    category: 'Verkauf',
    duration: '25 Min.',
    icon: MessageCircle,
    description: 'Struktur für ein freundliches, klares und wertschätzendes Kundengespräch.',
    learningGoal: 'Du kannst ein Gespräch eröffnen, Bedarf verstehen und den nächsten Schritt anbieten.',
    intro: 'Gute Gespräche sind einfach, menschlich und klar. Dieses Modul gibt dir eine Struktur, ohne steif zu wirken.',
    steps: ['Gespräch eröffnen', 'Fragen stellen', 'Nutzen erklären', 'nächsten Schritt vereinbaren'],
    task: 'Übe ein kurzes Gespräch mit drei offenen Fragen und einem klaren Abschluss.',
    videoIds: ['kundenbestellung'],
    pdfIds: ['kunden-preisliste'],
    hasTask: true,
    catalogModuleId: 6
  },
  {
    id: 'objection-handling',
    title: 'Einwandbehandlung',
    category: 'Verkauf',
    duration: '20 Min.',
    icon: MessageCircle,
    description: 'Lerne, ruhig mit Fragen, Zweifeln und typischen Einwänden umzugehen.',
    learningGoal: 'Du kannst Einwände aufnehmen, klären und souverän beantworten.',
    intro: 'Einwände sind kein Stopp-Signal. Sie zeigen, dass jemand nachdenkt. Dieses Modul hilft dir, ruhig und lösungsorientiert zu bleiben.',
    steps: ['Einwand anhören', 'Verständnis zeigen', 'Rückfrage stellen', 'passende Antwort geben'],
    task: 'Notiere drei typische Einwände und formuliere jeweils eine ruhige Antwort.',
    videoIds: [],
    pdfIds: ['wasser-praesentation'],
    hasTask: true,
    catalogModuleId: 6
  },
  {
    id: 'whatsapp-presentation',
    title: 'WhatsApp-Präsentation',
    category: 'Verkauf',
    duration: '18 Min.',
    icon: Send,
    description: 'Bereite eine kurze, professionelle WhatsApp-Nachricht für Interessenten vor.',
    learningGoal: 'Du kannst Interessenten per WhatsApp sauber informieren, ohne Druck aufzubauen.',
    intro: 'WhatsApp ist stark, wenn die Nachricht kurz, klar und persönlich bleibt. Dieses Modul gibt dir Struktur für eine seriöse Präsentation.',
    steps: ['Anlass nennen', 'Nutzen kurz erklären', 'passenden Link oder Unterlage senden', 'nächsten Schritt anbieten'],
    task: 'Formuliere eine persönliche WhatsApp-Nachricht mit maximal fünf Sätzen.',
    videoIds: [],
    pdfIds: ['wasser-praesentation'],
    hasTask: true,
    catalogModuleId: 6
  },
  {
    id: 'recruiting',
    title: 'Recruiting',
    category: 'Business',
    duration: '25 Min.',
    icon: UserCheck,
    description: 'Verstehe, wie du seriös über die Partnerchance sprichst.',
    learningGoal: 'Du kannst die Partnerchance einfach erklären und passende Menschen einladen.',
    intro: 'Recruiting bedeutet nicht Überreden. Es bedeutet, Menschen eine klare Möglichkeit zu zeigen und sie sauber zu begleiten.',
    steps: ['Partnerchance erklären', 'Erwartungen klären', 'Einladung aussprechen'],
    task: 'Schreibe eine kurze Einladung an jemanden, der offen für Nebenverdienst oder Business-Aufbau sein könnte.',
    videoIds: ['partnerregistrierung'],
    pdfIds: ['karriere-verdienstplan'],
    hasTask: true,
    catalogModuleId: 9
  },
  {
    id: 'team-building',
    title: 'Teamaufbau',
    category: 'Business',
    duration: '30 Min.',
    icon: Users,
    description: 'Grundlagen für Begleitung, Struktur und die Entwicklung erster Teammitglieder.',
    learningGoal: 'Du verstehst, wie du neue Partner beim Start sinnvoll unterstützt.',
    intro: 'Teamaufbau entsteht durch Klarheit, Wiederholbarkeit und gute Begleitung. Dieses Modul zeigt dir die ersten stabilen Schritte.',
    steps: ['Startgespräch planen', 'erste Aufgaben geben', 'regelmäßig begleiten', 'Fortschritt sichtbar machen'],
    task: 'Erstelle eine einfache Checkliste für den Start eines neuen Partners.',
    videoIds: ['partnerregistrierung'],
    pdfIds: ['karriere-verdienstplan'],
    hasTask: true,
    catalogModuleId: 9
  },
  {
    id: 'social-media',
    title: 'Social Media',
    category: 'Marketing',
    duration: '22 Min.',
    icon: Instagram,
    description: 'Nutze Social Media sichtbar, seriös und passend zu deinem Alltag.',
    learningGoal: 'Du kannst erste Inhalte planen, die Vertrauen aufbauen und Gespräche eröffnen.',
    intro: 'Social Media muss nicht laut sein. Gute Inhalte zeigen Alltag, Nutzen und persönliche Entwicklung auf authentische Weise.',
    steps: ['Profilwirkung prüfen', 'Themen sammeln', 'einfachen Wochenplan erstellen'],
    task: 'Plane drei Beiträge oder Stories: Alltag, Wasserwissen und persönliche Empfehlung.',
    videoIds: [],
    pdfIds: [],
    hasTask: true,
    catalogModuleId: 8
  },
  {
    id: 'downloads-documents',
    title: 'Downloads & Unterlagen',
    category: 'Ressourcen',
    duration: '15 Min.',
    icon: Download,
    description: 'Finde die wichtigsten Präsentationen, Preislisten und Unterlagen für deine Arbeit.',
    learningGoal: 'Du weißt, welche Unterlagen du wann einsetzen kannst.',
    intro: 'Dieses Modul bündelt die wichtigsten Ressourcen, damit du nicht suchen musst und im Gespräch schnell die passende Unterlage findest.',
    steps: ['Unterlagen überblicken', 'passende Kategorie auswählen', 'Material für das nächste Gespräch vorbereiten'],
    task: 'Speichere dir die wichtigste Unterlage für dein nächstes Gespräch und prüfe, ob du sie erklären kannst.',
    videoIds: [],
    pdfIds: ['kunden-preisliste', 'your-world', 'wasser-praesentation', 'karriere-verdienstplan'],
    hasTask: true,
    showDownloadCenter: true,
    catalogModuleId: 8
  }
];

function getPartnerAcademyModuleAssets(moduleItem) {
  const videos = (moduleItem.videoIds || [])
    .map((videoId) => academyVideos.find((video) => video.id === videoId))
    .filter(Boolean);
  const documents = (moduleItem.pdfIds || [])
    .map((documentId) => getDocumentById(documentId))
    .filter(Boolean);

  return {
    videos,
    documents
  };
}

function getPartnerAcademyModuleProgress(moduleItem, academyProgress, localCompletedModuleIds = []) {
  const localCompleted = localCompletedModuleIds.includes(moduleItem.id);
  const completedVideos = academyProgress?.completedVideos || {};
  const videoIds = moduleItem.videoIds || [];
  const completedVideoCount = videoIds.filter((videoId) => completedVideos[videoId]).length;
  const videoProgress = videoIds.length ? Math.round((completedVideoCount / videoIds.length) * 100) : 0;
  const percent = localCompleted ? 100 : videoProgress;
  const status = percent >= 100 ? 'completed' : percent > 0 ? 'in-progress' : 'open';
  const label = status === 'completed' ? 'Abgeschlossen' : status === 'in-progress' ? 'In Bearbeitung' : 'Offen';

  return {
    percent,
    status,
    label,
    completedVideoCount,
    totalVideoCount: videoIds.length,
    localCompleted
  };
}

function getPartnerAcademySummary(partner, localCompletedModuleIds = []) {
  const academyProgress = partner?.academyProgress || {};
  const modulesWithProgress = PARTNER_ACADEMY_MODULES.map((moduleItem) => {
    const progress = getPartnerAcademyModuleProgress(moduleItem, academyProgress, localCompletedModuleIds);
    return {
      ...moduleItem,
      ...getPartnerAcademyModuleAssets(moduleItem),
      progress
    };
  });
  const completedCount = modulesWithProgress.filter((moduleItem) => moduleItem.progress.percent >= 100).length;
  const overallProgress = modulesWithProgress.length
    ? Math.round(modulesWithProgress.reduce((sum, moduleItem) => sum + moduleItem.progress.percent, 0) / modulesWithProgress.length)
    : 0;
  const nextModule = modulesWithProgress.find((moduleItem) => moduleItem.progress.percent < 100) || modulesWithProgress[0] || null;

  return {
    modules: modulesWithProgress,
    totalCount: modulesWithProgress.length,
    completedCount,
    overallProgress,
    nextModule
  };
}

function hasPartnerCoreProfileData(partner) {
  return ['firstName', 'lastName', 'email', 'city', 'discountCode'].every((field) => String(partner?.[field] || '').trim());
}

function hasPartnerSocialContact(partner) {
  return Boolean(
    String(partner?.instagramProfile || '').trim()
    || String(partner?.whatsapp || '').trim()
    || String(partner?.phone || '').trim()
    || partner?.notificationPrefs?.whatsappUpdates
  );
}

function getOnboardingAssistantSummary(partner, localCompletedStepIds = [], academySummary = getPartnerAcademySummary(partner)) {
  const completedVideos = partner?.academyProgress?.completedVideos || {};
  const locallyCompleted = (stepId) => localCompletedStepIds.includes(stepId);
  const firstModuleCompleted = academySummary.completedCount > 0 || locallyCompleted('first-module');
  const quizCompleted = Boolean(partner?.academyProgress?.quizPassed || partner?.academyProgress?.certificationPassed || locallyCompleted('first-quiz'));
  const waterTestCompleted = Boolean(
    completedVideos['ppm-bedeutung']
    || completedVideos['tee-test']
    || locallyCompleted('water-test')
  );
  const presentationCompleted = Boolean(
    completedVideos.kundenbestellung
    || completedVideos.partnerregistrierung
    || locallyCompleted('first-presentation')
  );

  const steps = [
    {
      id: 'profile-photo',
      title: 'Profilfoto hochladen',
      description: 'Mach dein Partnerprofil persönlich und wiedererkennbar.',
      icon: Camera,
      target: 'profile',
      actionLabel: 'Profil öffnen',
      completed: Boolean(partner?.profileImageUrl),
    },
    {
      id: 'profile-data',
      title: 'Stammdaten vervollständigen',
      description: 'Prüfe Name, E-Mail, Stadt und Rabattcode.',
      icon: UserCheck,
      target: 'profile',
      actionLabel: 'Daten prüfen',
      completed: hasPartnerCoreProfileData(partner),
    },
    {
      id: 'social-contact',
      title: 'Instagram/WhatsApp hinterlegen',
      description: 'Optional: Erleichtert Kontakt und Sichtbarkeit im Netzwerk.',
      icon: Instagram,
      target: 'profile',
      actionLabel: 'Optional ergänzen',
      optional: true,
      completed: hasPartnerSocialContact(partner),
    },
    {
      id: 'welcome-module',
      title: 'Willkommen-Modul ansehen',
      description: 'Starte mit Orientierung, Ablauf und ersten Empfehlungen.',
      icon: PlayCircle,
      target: 'start',
      actionLabel: 'Startbereich öffnen',
      manual: true,
      completed: Boolean(completedVideos[STARTCENTER_ONBOARDING_VIDEO_ID] || locallyCompleted('welcome-module')),
    },
    {
      id: 'first-module',
      title: 'Erstes Academy-Modul abschließen',
      description: 'Arbeite ein Modul vollständig durch und setze die Aufgabe um.',
      icon: BookOpen,
      target: 'modules',
      actionLabel: 'Module öffnen',
      manual: true,
      completed: firstModuleCompleted,
    },
    {
      id: 'first-quiz',
      title: 'Erstes Quiz bestehen',
      description: 'Teste dein Verständnis lokal im Quizbereich.',
      icon: FileQuestion,
      target: 'modules',
      actionLabel: 'Quiz öffnen',
      manual: true,
      completed: quizCompleted,
    },
    {
      id: 'sponsor-call',
      title: 'Termin mit dem Sponsor buchen',
      description: 'Kläre Fragen und plane deinen nächsten konkreten Schritt.',
      icon: CalendarDays,
      target: 'calendar',
      actionLabel: 'Termin buchen',
      manual: true,
      completed: locallyCompleted('sponsor-call'),
    },
    {
      id: 'water-test',
      title: 'Ersten Wassertest durchführen',
      description: 'Bereite PPM- oder Tee-Test vor und dokumentiere deine Erfahrung.',
      icon: Globe2,
      target: 'testlab',
      actionLabel: 'Testlabor öffnen',
      manual: true,
      completed: waterTestCompleted,
    },
    {
      id: 'first-presentation',
      title: 'Erste Präsentation ansehen',
      description: 'Nutze die Unterlagen für dein erstes Kundengespräch.',
      icon: FileText,
      target: 'resources',
      actionLabel: 'Unterlagen öffnen',
      manual: true,
      completed: presentationCompleted,
    },
    {
      id: 'finish-onboarding',
      title: 'Onboarding abschließen',
      description: 'Bestätige, dass du bereit für die nächsten Partner-Schritte bist.',
      icon: Trophy,
      target: 'dashboard',
      actionLabel: 'Dashboard öffnen',
      manual: true,
      completed: locallyCompleted('finish-onboarding'),
    },
  ];
  const requiredSteps = steps.filter((step) => !step.optional);
  const completedRequiredCount = requiredSteps.filter((step) => step.completed).length;
  const progress = requiredSteps.length ? Math.round((completedRequiredCount / requiredSteps.length) * 100) : 0;
  const nextStep = requiredSteps.find((step) => !step.completed) || steps.find((step) => step.optional && !step.completed) || steps[steps.length - 1];

  return {
    steps,
    progress,
    completedRequiredCount,
    requiredCount: requiredSteps.length,
    nextStep,
    isComplete: completedRequiredCount === requiredSteps.length,
  };
}

const TESTLAB_MODULE_ID = 10;
const STARTCENTER_ONBOARDING_VIDEO_ID = 'academy-welcome-placeholder';
const startCenterOnboardingVideo = academyVideos.find((video) => video.id === STARTCENTER_ONBOARDING_VIDEO_ID);

const testLabCategories = [
  {
    id: 'ppm-tests',
    title: 'PPM-Test',
    progress: 20,
    videos: academyVideos.filter((video) => video.id === 'ppm-bedeutung'),
  },
  {
    id: 'tea-tests',
    title: 'Tee-Test',
    progress: 40,
    videos: academyVideos.filter((video) => video.id === 'tee-test'),
  },
  {
    id: 'plant-tests',
    title: 'Basilikum-Test',
    progress: 35,
    videos: academyVideos.filter((video) => video.id === 'basilikum-test'),
  },
  {
    id: 'filter-comparison',
    title: 'Filterkanne vs. Aqua Global',
    progress: 45,
    videos: academyVideos.filter((video) => video.id === 'membranfilter-vs-filterkanne'),
  },
  {
    id: 'more-tests',
    title: 'Weitere Tests',
    progress: 25,
    videos: academyVideos.filter((video) => ['farbtest', 'farbtest-erklaerung'].includes(video.id)),
  },
];

const aquaGlobalLevels = [
  { name: 'Starterstufe', min: 0, max: 50 },
  { name: 'Level 1', min: 51, max: 500 },
  { name: 'Level 2', min: 501, max: 1500 },
  { name: 'Level 3', min: 1501, max: 5000 },
  { name: 'Level 4', min: 5001, max: 15000 },
  { name: 'Level 5', min: 15001, max: 45000 },
  { name: 'Level 6', min: 45001, max: 150000 },
];

function toAquaPoints(value) {
  const raw = String(value ?? 0).trim().replace(/\s/g, '');
  const lastComma = raw.lastIndexOf(',');
  const lastDot = raw.lastIndexOf('.');
  const normalized = lastComma > lastDot
    ? raw.replace(/\./g, '').replace(',', '.')
    : raw.replace(/,/g, '');
  const parsed = Number(normalized.replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed * 100) / 100) : 0;
}

function calculateAquaCareer(pointsInput) {
  const points = toAquaPoints(pointsInput);
  const levelIndex = aquaGlobalLevels.findIndex((level) => points <= level.max);
  const safeIndex = levelIndex === -1 ? aquaGlobalLevels.length - 1 : levelIndex;
  const level = aquaGlobalLevels[safeIndex];
  const nextLevel = aquaGlobalLevels[safeIndex + 1] || null;
  const targetPoints = level.max;

  return {
    points,
    level: level.name,
    nextLevel: nextLevel?.name || '',
    nextLevelPoints: nextLevel ? targetPoints : null,
    pointsToNextLevel: nextLevel ? Math.max(0, Math.round((targetPoints - points) * 100) / 100) : 0,
    progress: nextLevel ? Math.min(100, Math.max(0, Math.round((points / Math.max(targetPoints, 1)) * 100))) : 100,
  };
}

function formatPoints(value) {
  return new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(toAquaPoints(value));
}

function toPartnerCount(value) {
  const parsed = Number(String(value ?? 0).replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
}

function calculateTeamGrowth({ currentCount, previousCount = 0, targetCount = 10, longTermTargetCount = 100 }) {
  const current = toPartnerCount(currentCount);
  const previous = toPartnerCount(previousCount);
  const target = Math.max(toPartnerCount(targetCount), current || 1);
  const longTarget = Math.max(toPartnerCount(longTermTargetCount), target);
  const newSinceLastUpdate = Math.max(0, current - previous);
  const growthPercent = previous > 0
    ? Math.round((newSinceLastUpdate / previous) * 1000) / 10
    : current > 0 ? 100 : 0;

  return {
    currentCount: current,
    previousCount: previous,
    targetCount: target,
    longTermTargetCount: longTarget,
    newSinceLastUpdate,
    growthPercent,
    targetProgress: Math.min(100, Math.max(0, Math.round((current / Math.max(target, 1)) * 100))),
    longTermProgress: Math.min(100, Math.max(0, Math.round((current / Math.max(longTarget, 1)) * 100))),
  };
}

function formatPartnerCount(value) {
  return new Intl.NumberFormat('de-DE').format(toPartnerCount(value));
}

function academyVideoSearchText(video, categoryTitle = '') {
  return [
    categoryTitle,
    video.moduleTitle,
    video.title,
    video.description,
    video.category,
    video.learningGoal,
    video.fileName,
    video.uploadDate,
    video.duration,
    ...(video.comments || []),
    ...(video.qa || []).flatMap((item) => [item.question, item.answer]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

const VIDEO_TRANSLATION_LANGUAGES = [
  { code: 'de', label: LANGUAGE_OPTIONS.de, short: 'DE' },
  { code: 'en', label: LANGUAGE_OPTIONS.en, short: 'EN' },
  { code: 'ru', label: LANGUAGE_OPTIONS.ru, short: 'RU' },
  { code: 'ro', label: LANGUAGE_OPTIONS.ro, short: 'RO' },
  { code: 'el', label: LANGUAGE_OPTIONS.el, short: 'EL' },
  { code: 'tr', label: LANGUAGE_OPTIONS.tr, short: 'TR' },
  { code: 'it', label: LANGUAGE_OPTIONS.it, short: 'IT' },
  { code: 'cs', label: LANGUAGE_OPTIONS.cs, short: 'CS' },
  { code: 'es', label: LANGUAGE_OPTIONS.es, short: 'ES' },
  { code: 'pl', label: LANGUAGE_OPTIONS.pl, short: 'PL' },
];

const VIDEO_TRANSLATION_LABELS = {
  de: {
    title: 'Video-Übersetzung',
    originalLanguage: 'Originalsprache: Deutsch',
    language: 'Untertitel-Sprache',
    enableSubtitles: 'Untertitel aktivieren',
    disableSubtitles: 'Untertitel deaktivieren',
    captions: 'Automatische Untertitel',
    transcriptDe: 'Original-Transkript Deutsch',
    transcriptTranslated: 'Übersetztes Transkript',
    summaryDe: 'Deutsche Zusammenfassung',
    summaryTranslated: 'Übersetzte Zusammenfassung',
    generated: 'Automatisch aus deutschem Titel, Beschreibung und Lernziel vorbereitet.',
    aiReady: 'KI-Sprachsynchronisation vorbereitet',
    aiHint: 'Die Datenstruktur ist bereit für spätere mehrsprachige Stimmen und synchronisierte Voiceovers.',
    lineIntro: (video) => `Willkommen zum Video "${video.title}".`,
    lineDescription: (video) => video.description,
    lineGoal: (video) => `Lernziel: ${video.learningGoal || 'Das Video sicher verstehen und anwenden.'}`,
    summary: (video) => `${video.title}: ${video.description} Lernziel: ${video.learningGoal || 'Das Video sicher verstehen und anwenden.'}`,
  },
  en: {
    title: 'Video Translation',
    originalLanguage: 'Original language: German',
    language: 'Subtitle language',
    enableSubtitles: 'Enable subtitles',
    disableSubtitles: 'Disable subtitles',
    captions: 'Automatic subtitles',
    transcriptDe: 'Original transcript German',
    transcriptTranslated: 'Translated transcript',
    summaryDe: 'German summary',
    summaryTranslated: 'Translated summary',
    generated: 'Prepared automatically from the German title, description and learning goal.',
    aiReady: 'AI voice synchronization prepared',
    aiHint: 'The data structure is ready for future multilingual voices and synchronized voiceovers.',
    lineIntro: (video) => `Welcome to the video "${video.title}".`,
    lineDescription: (video) => `This lesson explains: ${video.description}`,
    lineGoal: (video) => `Learning goal: ${video.learningGoal || 'Understand and apply the video safely.'}`,
    summary: (video) => `${video.title}: This lesson explains ${video.description} Learning goal: ${video.learningGoal || 'Understand and apply the content safely.'}`,
  },
  ru: {
    title: 'Перевод видео',
    originalLanguage: 'Оригинальный язык: немецкий',
    language: 'Язык субтитров',
    enableSubtitles: 'Включить субтитры',
    disableSubtitles: 'Выключить субтитры',
    captions: 'Автоматические субтитры',
    transcriptDe: 'Оригинальный транскрипт на немецком',
    transcriptTranslated: 'Переведенный транскрипт',
    summaryDe: 'Краткое содержание на немецком',
    summaryTranslated: 'Переведенное краткое содержание',
    generated: 'Подготовлено автоматически на основе немецкого названия, описания и цели обучения.',
    aiReady: 'Подготовлено для AI-синхронизации голоса',
    aiHint: 'Структура данных готова для будущих многоязычных голосов и синхронного озвучивания.',
    lineIntro: (video) => `Добро пожаловать к видео "${video.title}".`,
    lineDescription: (video) => `В этом уроке объясняется: ${video.description}`,
    lineGoal: (video) => `Цель обучения: ${video.learningGoal || 'Понять и безопасно применять содержание видео.'}`,
    summary: (video) => `${video.title}: Этот урок объясняет ${video.description} Цель обучения: ${video.learningGoal || 'Понять и безопасно применять содержание.'}`,
  },
  ro: {
    title: 'Traducere video',
    originalLanguage: 'Limba originală: germană',
    language: 'Limba subtitrării',
    enableSubtitles: 'Activează subtitrările',
    disableSubtitles: 'Dezactivează subtitrările',
    captions: 'Subtitrări automate',
    transcriptDe: 'Transcriere originală germană',
    transcriptTranslated: 'Transcriere tradusă',
    summaryDe: 'Rezumat în germană',
    summaryTranslated: 'Rezumat tradus',
    generated: 'Pregătit automat din titlul german, descriere și obiectivul de învățare.',
    aiReady: 'Sincronizare vocală AI pregătită',
    aiHint: 'Structura de date este pregătită pentru voci multilingve și voiceover sincronizat.',
    lineIntro: (video) => `Bun venit la video-ul "${video.title}".`,
    lineDescription: (video) => `Această lecție explică: ${video.description}`,
    lineGoal: (video) => `Obiectiv de învățare: ${video.learningGoal || 'Înțelege și aplică sigur conținutul video.'}`,
    summary: (video) => `${video.title}: Această lecție explică ${video.description} Obiectiv: ${video.learningGoal || 'Înțelege și aplică sigur conținutul.'}`,
  },
  el: {
    title: 'Μετάφραση βίντεο',
    originalLanguage: 'Γλώσσα πρωτοτύπου: Γερμανικά',
    language: 'Γλώσσα υποτίτλων',
    enableSubtitles: 'Ενεργοποίηση υποτίτλων',
    disableSubtitles: 'Απενεργοποίηση υποτίτλων',
    captions: 'Αυτόματοι υπότιτλοι',
    transcriptDe: 'Πρωτότυπη γερμανική απομαγνητοφώνηση',
    transcriptTranslated: 'Μεταφρασμένη απομαγνητοφώνηση',
    summaryDe: 'Γερμανική σύνοψη',
    summaryTranslated: 'Μεταφρασμένη σύνοψη',
    generated: 'Προετοιμάστηκε αυτόματα από τον γερμανικό τίτλο, την περιγραφή και τον μαθησιακό στόχο.',
    aiReady: 'Προετοιμασμένος AI συγχρονισμός φωνής',
    aiHint: 'Η δομή δεδομένων είναι έτοιμη για μελλοντικές πολύγλωσσες φωνές και συγχρονισμένα voiceovers.',
    lineIntro: (video) => `Καλώς ήρθες στο βίντεο "${video.title}".`,
    lineDescription: (video) => `Αυτό το μάθημα εξηγεί: ${video.description}`,
    lineGoal: (video) => `Μαθησιακός στόχος: ${video.learningGoal || 'Κατανόηση και ασφαλής εφαρμογή του περιεχομένου.'}`,
    summary: (video) => `${video.title}: Αυτό το μάθημα εξηγεί ${video.description} Στόχος: ${video.learningGoal || 'Κατανόηση και ασφαλής εφαρμογή του περιεχομένου.'}`,
  },
  tr: {
    title: 'Video çevirisi',
    originalLanguage: 'Orijinal dil: Almanca',
    language: 'Altyazı dili',
    enableSubtitles: 'Altyazıları aç',
    disableSubtitles: 'Altyazıları kapat',
    captions: 'Otomatik altyazılar',
    transcriptDe: 'Orijinal Almanca transkript',
    transcriptTranslated: 'Çevrilmiş transkript',
    summaryDe: 'Almanca özet',
    summaryTranslated: 'Çevrilmiş özet',
    generated: 'Almanca başlık, açıklama ve öğrenme hedefinden otomatik hazırlandı.',
    aiReady: 'AI ses senkronizasyonu hazırlandı',
    aiHint: 'Veri yapısı gelecekte çok dilli sesler ve senkron voiceover için hazır.',
    lineIntro: (video) => `"${video.title}" videosuna hoş geldin.`,
    lineDescription: (video) => `Bu ders şunu açıklar: ${video.description}`,
    lineGoal: (video) => `Öğrenme hedefi: ${video.learningGoal || 'İçeriği güvenle anlamak ve uygulamak.'}`,
    summary: (video) => `${video.title}: Bu ders ${video.description} konusunu açıklar. Hedef: ${video.learningGoal || 'İçeriği güvenle anlamak ve uygulamak.'}`,
  },
  it: {
    title: 'Traduzione video',
    originalLanguage: 'Lingua originale: tedesco',
    language: 'Lingua sottotitoli',
    enableSubtitles: 'Attiva sottotitoli',
    disableSubtitles: 'Disattiva sottotitoli',
    captions: 'Sottotitoli automatici',
    transcriptDe: 'Trascrizione originale in tedesco',
    transcriptTranslated: 'Trascrizione tradotta',
    summaryDe: 'Riassunto in tedesco',
    summaryTranslated: 'Riassunto tradotto',
    generated: 'Preparato automaticamente dal titolo tedesco, dalla descrizione e dall’obiettivo formativo.',
    aiReady: 'Sincronizzazione vocale AI preparata',
    aiHint: 'La struttura dati è pronta per future voci multilingue e voiceover sincronizzati.',
    lineIntro: (video) => `Benvenuto al video "${video.title}".`,
    lineDescription: (video) => `Questa lezione spiega: ${video.description}`,
    lineGoal: (video) => `Obiettivo formativo: ${video.learningGoal || 'Comprendere e applicare il contenuto in sicurezza.'}`,
    summary: (video) => `${video.title}: Questa lezione spiega ${video.description} Obiettivo: ${video.learningGoal || 'Comprendere e applicare il contenuto in sicurezza.'}`,
  },
  cs: {
    title: 'Překlad videa',
    originalLanguage: 'Původní jazyk: němčina',
    language: 'Jazyk titulků',
    enableSubtitles: 'Zapnout titulky',
    disableSubtitles: 'Vypnout titulky',
    captions: 'Automatické titulky',
    transcriptDe: 'Původní německý přepis',
    transcriptTranslated: 'Přeložený přepis',
    summaryDe: 'Německé shrnutí',
    summaryTranslated: 'Přeložené shrnutí',
    generated: 'Automaticky připraveno z německého názvu, popisu a cíle učení.',
    aiReady: 'AI hlasová synchronizace připravena',
    aiHint: 'Datová struktura je připravena pro budoucí vícejazyčné hlasy a synchronizovaný voiceover.',
    lineIntro: (video) => `Vítej u videa "${video.title}".`,
    lineDescription: (video) => `Tato lekce vysvětluje: ${video.description}`,
    lineGoal: (video) => `Cíl učení: ${video.learningGoal || 'Bezpečně pochopit a použít obsah videa.'}`,
    summary: (video) => `${video.title}: Tato lekce vysvětluje ${video.description} Cíl: ${video.learningGoal || 'Bezpečně pochopit a použít obsah.'}`,
  },
  es: {
    title: 'Traducción de video',
    originalLanguage: 'Idioma original: alemán',
    language: 'Idioma de subtítulos',
    enableSubtitles: 'Activar subtítulos',
    disableSubtitles: 'Desactivar subtítulos',
    captions: 'Subtítulos automáticos',
    transcriptDe: 'Transcripción original en alemán',
    transcriptTranslated: 'Transcripción traducida',
    summaryDe: 'Resumen en alemán',
    summaryTranslated: 'Resumen traducido',
    generated: 'Preparado automáticamente desde el título alemán, la descripción y el objetivo de aprendizaje.',
    aiReady: 'Sincronización de voz con IA preparada',
    aiHint: 'La estructura de datos está lista para futuras voces multilingües y voiceovers sincronizados.',
    lineIntro: (video) => `Bienvenido al video "${video.title}".`,
    lineDescription: (video) => `Esta lección explica: ${video.description}`,
    lineGoal: (video) => `Objetivo de aprendizaje: ${video.learningGoal || 'Comprender y aplicar el contenido de forma segura.'}`,
    summary: (video) => `${video.title}: Esta lección explica ${video.description} Objetivo: ${video.learningGoal || 'Comprender y aplicar el contenido de forma segura.'}`,
  },
  pl: {
    title: 'Tłumaczenie wideo',
    originalLanguage: 'Język oryginalny: niemiecki',
    language: 'Język napisów',
    enableSubtitles: 'Włącz napisy',
    disableSubtitles: 'Wyłącz napisy',
    captions: 'Automatyczne napisy',
    transcriptDe: 'Oryginalna niemiecka transkrypcja',
    transcriptTranslated: 'Przetłumaczona transkrypcja',
    summaryDe: 'Niemieckie podsumowanie',
    summaryTranslated: 'Przetłumaczone podsumowanie',
    generated: 'Przygotowane automatycznie z niemieckiego tytułu, opisu i celu szkoleniowego.',
    aiReady: 'Przygotowano synchronizację głosu AI',
    aiHint: 'Struktura danych jest gotowa na przyszłe wielojęzyczne głosy i zsynchronizowany voiceover.',
    lineIntro: (video) => `Witamy w filmie "${video.title}".`,
    lineDescription: (video) => `Ta lekcja wyjaśnia: ${video.description}`,
    lineGoal: (video) => `Cel szkolenia: ${video.learningGoal || 'Bezpiecznie zrozumieć i zastosować treść wideo.'}`,
    summary: (video) => `${video.title}: Ta lekcja wyjaśnia ${video.description} Cel: ${video.learningGoal || 'Bezpiecznie zrozumieć i zastosować treść.'}`,
  },
};

const VIDEO_UI_LABELS = {
  de: {
    required: 'Pflichtvideo',
    watched: 'Angesehen',
    notWatched: 'Nicht angesehen',
    uploadDate: 'Upload-Datum',
    duration: 'Video-Laufzeit',
    progress: 'Fortschritt',
    learningGoal: 'Lernziel',
    comments: 'Kommentare',
    qa: 'Fragen & Antworten',
    noComments: 'Noch keine Kommentare vorhanden.',
    noQuestions: 'Noch keine Fragen vorhanden.',
    markWatched: 'Als angesehen markieren',
    markUnwatched: 'Als nicht angesehen markieren',
    openVideo: 'Video in neuem Tab öffnen',
    searchPlaceholder: 'Video nach Titel, Kategorie, Beschreibung oder Frage suchen',
    noVideosFound: 'Keine Videos in diesem Modul gefunden.',
    fileMissing: 'Video-Datei wird nach Upload aktiviert.',
    video: 'Video',
  },
  en: {
    required: 'Required video',
    watched: 'Watched',
    notWatched: 'Not watched',
    uploadDate: 'Upload date',
    duration: 'Video duration',
    progress: 'Progress',
    learningGoal: 'Learning goal',
    comments: 'Comments',
    qa: 'Questions & answers',
    noComments: 'No comments yet.',
    noQuestions: 'No questions yet.',
    markWatched: 'Mark as watched',
    markUnwatched: 'Mark as not watched',
    openVideo: 'Open video in new tab',
    searchPlaceholder: 'Search video by title, category, description or question',
    noVideosFound: 'No videos found in this module.',
    fileMissing: 'Video file will be activated after upload.',
    video: 'Video',
  },
  ro: {
    required: 'Video obligatoriu',
    watched: 'Vizionat',
    notWatched: 'Nevizionat',
    uploadDate: 'Data încărcării',
    duration: 'Durata video',
    progress: 'Progres',
    learningGoal: 'Obiectiv de învățare',
    comments: 'Comentarii',
    qa: 'Întrebări și răspunsuri',
    noComments: 'Nu există comentarii.',
    noQuestions: 'Nu există întrebări.',
    markWatched: 'Marchează ca vizionat',
    markUnwatched: 'Marchează ca nevizionat',
    openVideo: 'Deschide video în tab nou',
    searchPlaceholder: 'Caută video după titlu, categorie, descriere sau întrebare',
    noVideosFound: 'Nu s-au găsit videouri în acest modul.',
    video: 'Video',
  },
  ru: {
    required: 'Обязательное видео',
    watched: 'Просмотрено',
    notWatched: 'Не просмотрено',
    uploadDate: 'Дата загрузки',
    duration: 'Длительность видео',
    progress: 'Прогресс',
    learningGoal: 'Цель обучения',
    comments: 'Комментарии',
    qa: 'Вопросы и ответы',
    noComments: 'Комментариев пока нет.',
    noQuestions: 'Вопросов пока нет.',
    markWatched: 'Отметить как просмотрено',
    markUnwatched: 'Отметить как не просмотрено',
    openVideo: 'Открыть видео в новой вкладке',
    searchPlaceholder: 'Поиск видео по названию, категории, описанию или вопросу',
    noVideosFound: 'В этом модуле видео не найдены.',
    video: 'Видео',
  },
  el: {
    required: 'Υποχρεωτικό βίντεο',
    watched: 'Προβλήθηκε',
    notWatched: 'Δεν προβλήθηκε',
    uploadDate: 'Ημερομηνία upload',
    duration: 'Διάρκεια βίντεο',
    progress: 'Πρόοδος',
    learningGoal: 'Μαθησιακός στόχος',
    comments: 'Σχόλια',
    qa: 'Ερωτήσεις & απαντήσεις',
    noComments: 'Δεν υπάρχουν ακόμη σχόλια.',
    noQuestions: 'Δεν υπάρχουν ακόμη ερωτήσεις.',
    markWatched: 'Σήμανση ως προβλημένο',
    markUnwatched: 'Σήμανση ως μη προβλημένο',
    openVideo: 'Άνοιγμα βίντεο σε νέο tab',
    searchPlaceholder: 'Αναζήτηση βίντεο με τίτλο, κατηγορία, περιγραφή ή ερώτηση',
    noVideosFound: 'Δεν βρέθηκαν βίντεο σε αυτή την ενότητα.',
    video: 'Βίντεο',
  },
  tr: {
    required: 'Zorunlu video',
    watched: 'İzlendi',
    notWatched: 'İzlenmedi',
    uploadDate: 'Yükleme tarihi',
    duration: 'Video süresi',
    progress: 'İlerleme',
    learningGoal: 'Öğrenme hedefi',
    comments: 'Yorumlar',
    qa: 'Sorular & cevaplar',
    noComments: 'Henüz yorum yok.',
    noQuestions: 'Henüz soru yok.',
    markWatched: 'İzlendi olarak işaretle',
    markUnwatched: 'İzlenmedi olarak işaretle',
    openVideo: 'Videoyu yeni sekmede aç',
    searchPlaceholder: 'Videoyu başlık, kategori, açıklama veya soruya göre ara',
    noVideosFound: 'Bu modülde video bulunamadı.',
    video: 'Video',
  },
  it: {
    required: 'Video obbligatorio',
    watched: 'Visto',
    notWatched: 'Non visto',
    uploadDate: 'Data upload',
    duration: 'Durata video',
    progress: 'Progresso',
    learningGoal: 'Obiettivo formativo',
    comments: 'Commenti',
    qa: 'Domande e risposte',
    noComments: 'Ancora nessun commento.',
    noQuestions: 'Ancora nessuna domanda.',
    markWatched: 'Segna come visto',
    markUnwatched: 'Segna come non visto',
    openVideo: 'Apri video in nuova scheda',
    searchPlaceholder: 'Cerca video per titolo, categoria, descrizione o domanda',
    noVideosFound: 'Nessun video trovato in questo modulo.',
    video: 'Video',
  },
  cs: {
    required: 'Povinné video',
    watched: 'Zhlédnuto',
    notWatched: 'Nezhlédnuto',
    uploadDate: 'Datum nahrání',
    duration: 'Délka videa',
    progress: 'Pokrok',
    learningGoal: 'Cíl učení',
    comments: 'Komentáře',
    qa: 'Otázky a odpovědi',
    noComments: 'Zatím žádné komentáře.',
    noQuestions: 'Zatím žádné otázky.',
    markWatched: 'Označit jako zhlédnuté',
    markUnwatched: 'Označit jako nezhlédnuté',
    openVideo: 'Otevřít video v novém okně',
    searchPlaceholder: 'Hledat video podle názvu, kategorie, popisu nebo otázky',
    noVideosFound: 'V tomto modulu nebyla nalezena žádná videa.',
    video: 'Video',
  },
  es: {
    required: 'Video obligatorio',
    watched: 'Visto',
    notWatched: 'No visto',
    uploadDate: 'Fecha de subida',
    duration: 'Duración del video',
    progress: 'Progreso',
    learningGoal: 'Objetivo de aprendizaje',
    comments: 'Comentarios',
    qa: 'Preguntas y respuestas',
    noComments: 'Aún no hay comentarios.',
    noQuestions: 'Aún no hay preguntas.',
    markWatched: 'Marcar como visto',
    markUnwatched: 'Marcar como no visto',
    openVideo: 'Abrir video en nueva pestaña',
    searchPlaceholder: 'Buscar video por título, categoría, descripción o pregunta',
    noVideosFound: 'No se encontraron videos en este módulo.',
    video: 'Video',
  },
  pl: {
    required: 'Video obowiązkowe',
    watched: 'Obejrzane',
    notWatched: 'Nieobejrzane',
    uploadDate: 'Data przesłania',
    duration: 'Czas video',
    progress: 'Postęp',
    learningGoal: 'Cel szkolenia',
    comments: 'Komentarze',
    qa: 'Pytania i odpowiedzi',
    noComments: 'Brak komentarzy.',
    noQuestions: 'Brak pytań.',
    markWatched: 'Oznacz jako obejrzane',
    markUnwatched: 'Oznacz jako nieobejrzane',
    openVideo: 'Otwórz video w nowej karcie',
    searchPlaceholder: 'Szukaj video po tytule, kategorii, opisie lub pytaniu',
    noVideosFound: 'Nie znaleziono video w tym module.',
    video: 'Video',
  },
};
VIDEO_UI_LABELS.gr = VIDEO_UI_LABELS.el;
VIDEO_UI_LABELS.cz = VIDEO_UI_LABELS.cs;

function getVideoLanguageCode(language) {
  const code = languageCodes[normalizeLanguage(language || DEFAULT_LANGUAGE)] || 'de';
  if (code === 'gr') return 'el';
  if (code === 'cz') return 'cs';
  return VIDEO_TRANSLATION_LANGUAGES.some((item) => item.code === code) ? code : 'de';
}

function getVideoTranslationLabels(code) {
  return VIDEO_TRANSLATION_LABELS[code] || VIDEO_TRANSLATION_LABELS.de;
}

function getVideoUiLabels(code) {
  return VIDEO_UI_LABELS[code] || VIDEO_UI_LABELS.de;
}

function getSubtitlePath(videoId, code) {
  return `/subtitles/${encodeURIComponent(videoId)}/${encodeURIComponent(code)}.vtt`;
}

function getVideoTranscriptApiPath(videoId, code) {
  return `${VIDEO_TRANSCRIPT_API_ROUTE}?videoId=${encodeURIComponent(videoId)}&lang=${encodeURIComponent(code)}`;
}

function buildVideoCaptionLines(video, code) {
  const labels = getVideoTranslationLabels(code);
  return [
    { time: '00:00', text: labels.lineIntro(video) },
    { time: '00:12', text: labels.lineDescription(video) },
    { time: '00:28', text: labels.lineGoal(video) },
  ];
}

function getGermanVideoSummary(video) {
  return VIDEO_TRANSLATION_LABELS.de.summary(video);
}

function getTranslatedVideoSummary(video, code) {
  return getVideoTranslationLabels(code).summary(video);
}

function getTranscriptReadyNotice(code, state) {
  const notices = {
    de: {
      ready: 'Whisper + GPT: echte zeitcodierte Untertitel, SRT und vollständiges Transkript aktiv.',
      loading: 'Echte KI-Untertitel werden geladen.',
      fallback: 'Noch kein echtes KI-Transkript gefunden. Fallback wird angezeigt, bis die Pipeline dieses Video verarbeitet hat.',
    },
    en: {
      ready: 'Whisper + GPT: real timed subtitles, SRT and full transcript active.',
      loading: 'Real AI subtitles are loading.',
      fallback: 'No real AI transcript found yet. Fallback is shown until the pipeline processes this video.',
    },
    ro: {
      ready: 'Whisper + GPT: subtitrări reale sincronizate, SRT și transcriere completă active.',
      loading: 'Subtitrările AI reale se încarcă.',
      fallback: 'Nu există încă o transcriere AI reală. Se afișează fallback până când pipeline-ul procesează acest video.',
    },
    ru: {
      ready: 'Whisper + GPT: реальные синхронные субтитры, SRT и полный транскрипт активны.',
      loading: 'Реальные AI-субтитры загружаются.',
      fallback: 'Реальный AI-транскрипт пока не найден. Показывается резервный текст до обработки видео.',
    },
    el: {
      ready: 'Whisper + GPT: πραγματικοί χρονισμένοι υπότιτλοι, SRT και πλήρης απομαγνητοφώνηση ενεργά.',
      loading: 'Οι πραγματικοί υπότιτλοι AI φορτώνονται.',
      fallback: 'Δεν βρέθηκε ακόμη πραγματική απομαγνητοφώνηση AI. Εμφανίζεται εφεδρικό κείμενο μέχρι την επεξεργασία.',
    },
    tr: {
      ready: 'Whisper + GPT: gerçek zaman kodlu altyazılar, SRT ve tam transkript aktif.',
      loading: 'Gerçek AI altyazıları yükleniyor.',
      fallback: 'Henüz gerçek AI transkripti bulunamadı. Video işlenene kadar yedek metin gösterilir.',
    },
    it: {
      ready: 'Whisper + GPT: sottotitoli reali sincronizzati, SRT e trascrizione completa attivi.',
      loading: 'I sottotitoli AI reali sono in caricamento.',
      fallback: 'Nessuna trascrizione AI reale trovata. Viene mostrato un fallback finché il video non viene elaborato.',
    },
    cs: {
      ready: 'Whisper + GPT: skutečné časované titulky, SRT a úplný přepis jsou aktivní.',
      loading: 'Skutečné AI titulky se načítají.',
      fallback: 'Skutečný AI přepis zatím nebyl nalezen. Do zpracování videa se zobrazuje náhradní text.',
    },
    es: {
      ready: 'Whisper + GPT: subtítulos reales sincronizados, SRT y transcripción completa activos.',
      loading: 'Los subtítulos reales de IA se están cargando.',
      fallback: 'Aún no hay transcripción real de IA. Se muestra un fallback hasta que el video sea procesado.',
    },
    pl: {
      ready: 'Whisper + GPT: prawdziwe napisy z czasem, SRT i pełna transkrypcja są aktywne.',
      loading: 'Prawdziwe napisy AI są ładowane.',
      fallback: 'Nie znaleziono jeszcze prawdziwej transkrypcji AI. Pokazywany jest tekst zastępczy do czasu przetworzenia filmu.',
    },
  };

  return (notices[code] || notices.de)[state] || notices.de.fallback;
}

function useVideoTranscript(video, activeCode) {
  const [transcriptData, setTranscriptData] = useState(null);
  const [transcriptState, setTranscriptState] = useState('idle');
  const hasTranscriptTarget = Boolean(video?.id && activeCode);

  useEffect(() => {
    if (!hasTranscriptTarget) {
      return undefined;
    }

    const controller = new AbortController();

    fetch(getVideoTranscriptApiPath(video.id, activeCode), { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (!controller.signal.aborted) {
          setTranscriptData(payload?.available ? payload : null);
          setTranscriptState(payload?.available ? 'ready' : 'fallback');
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setTranscriptData(null);
          setTranscriptState('fallback');
        }
      });

    return () => controller.abort();
  }, [activeCode, hasTranscriptTarget, video?.id]);

  const isCurrentTranscript = transcriptData?.videoId === video?.id && transcriptData?.language === activeCode;

  return {
    transcriptData: hasTranscriptTarget && isCurrentTranscript ? transcriptData : null,
    transcriptState: hasTranscriptTarget ? (isCurrentTranscript ? transcriptState : 'loading') : 'idle',
  };
}

function getInitials(partner) {
  return `${partner?.firstName?.[0] || 'P'}${partner?.lastName?.[0] || ''}`.toUpperCase();
}

function isRealApprovedPartner(partner) {
  return Boolean(partner)
    && partner.status === 'approved'
    && partner.role !== 'admin'
    && !partner.isFounderAdmin
    && !partner.testData;
}

function hasVisibleInstagramProfile(partner) {
  return isRealApprovedPartner(partner)
    && partner.instagramVisible !== false
    && Boolean(instagramProfileToHandle(partner.instagramProfile));
}

function buildAcademyRanking(partners, currentPartner) {
  const partnerMap = new Map();
  [...partners, currentPartner].filter(Boolean).forEach((partner) => {
    partnerMap.set(partner.id, partner);
  });
  const rankingSource = Array.from(partnerMap.values());

  return rankingSource
    .filter(isRealApprovedPartner)
    .map((partner) => {
      const career = calculateAquaCareer(partner.aquaPoints);
      return {
        ...partner,
        aquaPoints: toAquaPoints(partner.aquaPoints),
        aquaLevel: partner.aquaLevel || career.level,
        aquaLevelProgress: partner.aquaLevelProgress ?? career.progress,
        aquaPointsToNextLevel: partner.aquaPointsToNextLevel ?? career.pointsToNextLevel,
      };
    })
    .sort((a, b) => b.aquaPoints - a.aquaPoints)
    .map((partner, index) => ({ ...partner, rank: index + 1 }));
}

function buildTeamRanking(partners, currentPartner) {
  const partnerMap = new Map();
  [...partners, currentPartner].filter(Boolean).forEach((partner) => {
    partnerMap.set(partner.id, partner);
  });

  return Array.from(partnerMap.values())
    .filter(isRealApprovedPartner)
    .map((partner) => {
      const team = calculateTeamGrowth({
        currentCount: partner.teamPartnerCount,
        previousCount: Math.max(0, toPartnerCount(partner.teamPartnerCount) - toPartnerCount(partner.teamNewPartnersSinceLastUpdate)),
        targetCount: partner.teamTargetPartnerCount,
        longTermTargetCount: partner.teamLongTermTargetPartnerCount,
      });
      return {
        ...partner,
        teamPartnerCount: team.currentCount,
        teamTargetPartnerCount: partner.teamTargetPartnerCount ?? team.targetCount,
        teamLongTermTargetPartnerCount: partner.teamLongTermTargetPartnerCount ?? team.longTermTargetCount,
        teamNewPartnersSinceLastUpdate: partner.teamNewPartnersSinceLastUpdate ?? team.newSinceLastUpdate,
        teamGrowthPercent: partner.teamGrowthPercent ?? team.growthPercent,
        teamProgress: partner.teamProgress ?? team.targetProgress,
      };
    })
    .sort((a, b) => b.teamPartnerCount - a.teamPartnerCount)
    .map((partner, index) => ({ ...partner, teamRank: index + 1 }));
}

const bookings = [
  { date: '15. Sep', time: '18:00', type: 'Zoom-Call', name: 'Academy Termin' },
  { date: '10. Okt', time: '19:30', type: '1:1 Führung', name: 'Support Termin' },
  { date: '22. Okt', time: '17:00', type: 'Telefonat', name: 'Beratungstermin' },
];

const qas = [
  { q: 'Wie arbeite ich mit einem PDF?', tag: 'PDF · Ressourcen', video: true, module: 'Modul 1' },
  { q: 'Wie erkläre ich den PPM-Test einfach?', tag: 'Testlabor', video: true, module: 'Modul 10' },
  { q: 'Was schreibe ich nach Interesse per WhatsApp?', tag: 'Verkauf', video: false, module: 'Modul 5' },
];

const resources = ['WhatsApp Skripte', 'Instagram Captions', 'Reels Hooks', 'Produkt PDFs', 'Einwandbehandlung', 'Canva Vorlagen'];

const testimonials = [];

const communityStats = {
  activePartners: 0,
  onlinePartners: 0,
  openQuestions: 0,
  answeredQuestions: 0,
  messages: 0,
  instagramProfiles: 0,
  notificationCount: 0,
  newsUnread: 0,
  moduleUnread: 0,
  resourceUnread: 0,
};

const partnerStatuses = ['pending', 'approved', 'rejected', 'blocked', 'paused', 'review'];
const partnerStatusLabels = {
  pending: 'Wartend',
  approved: 'Freigegeben',
  rejected: 'Abgelehnt',
  blocked: 'Blockiert',
  paused: 'Pausiert',
  review: 'In Prüfung',
};

function formatPartnerStatus(status) {
  return partnerStatusLabels[status] || status || 'Unbekannt';
}

const ADMIN_DELETE_CONFIRMATION = 'LÖSCHEN';
const ADMIN_RESET_CONFIRMATION = 'ZURÜCKSETZEN';

function adminPartnerLabel(partner, fallbackId = '') {
  if (!partner) {
    return fallbackId ? `Partner-ID ${fallbackId}` : 'Unbekannter Partner';
  }

  const name = [partner.firstName, partner.lastName].filter(Boolean).join(' ').trim();
  const email = partner.email ? ` · ${partner.email}` : '';
  const code = partner.discountCode ? ` · Code ${partner.discountCode}` : '';

  return `${name || 'Unbenannter Partner'}${email}${code}`;
}

function confirmAdminAction({ title, target = '', consequences = [], requiredInput = '' }) {
  if (typeof window === 'undefined') {
    return false;
  }

  const consequenceLines = consequences.length > 0
    ? ['Konsequenzen:', ...consequences.map((item) => `- ${item}`)]
    : [];
  const message = [
    `Admin-Bestätigung: ${title}`,
    target ? `Betroffen: ${target}` : '',
    '',
    ...consequenceLines,
    '',
    'Mit „Abbrechen“ wird die Aktion ohne Änderung gestoppt.',
  ].filter((line, index, lines) => line || lines[index - 1]).join('\n');

  if (!window.confirm(message)) {
    return false;
  }

  if (!requiredInput) {
    return true;
  }

  const typedValue = window.prompt(`Zweite Bestätigung erforderlich.\n\nGib exakt „${requiredInput}“ ein, um fortzufahren.`);
  return typedValue === requiredInput;
}

function confirmAdminPartnerUpdate(partner, changes = {}) {
  const target = adminPartnerLabel(partner, changes.id);

  if (changes.resetPartnerData === true) {
    return confirmAdminAction({
      title: 'Partnerdaten zurücksetzen',
      target,
      consequences: [
        'Instagram-Profil, Karrierewerte, Teamwerte und Nachweise werden im Partnerprofil zurückgesetzt.',
        'Die Aktion wird dauerhaft in den Partner-Metadaten gespeichert.',
        'Ein Rollback ist nur manuell aus vorhandenen Backups oder Historien möglich.',
      ],
      requiredInput: ADMIN_RESET_CONFIRMATION,
    });
  }

  if (changes.status && changes.status !== partner?.status) {
    const statusConsequences = {
      approved: [
        'Der Partner wird freigegeben und kann sich danach einloggen.',
        'Falls noch keine Freigabe-E-Mail versendet wurde, kann eine Freigabe-E-Mail ausgelöst werden.',
      ],
      blocked: [
        'Der Partner verliert den Dashboard-Zugriff.',
        'Der Status wird dauerhaft als „Blockiert“ gespeichert.',
      ],
      rejected: [
        'Der Partner bleibt vom Dashboard ausgeschlossen.',
        'Der Status wird dauerhaft als „Abgelehnt“ gespeichert.',
      ],
      pending: [
        'Der Partner wird wieder in den Wartestatus gesetzt.',
        'Der Dashboard-Zugriff bleibt bis zur Freigabe gesperrt.',
      ],
      paused: [
        'Der Partnerzugang wird pausiert.',
        'Der Status wird dauerhaft gespeichert.',
      ],
      review: [
        'Der Partner wird zur Prüfung markiert.',
        'Der Status wird dauerhaft gespeichert.',
      ],
    };

    return confirmAdminAction({
      title: `Partnerstatus ändern: ${formatPartnerStatus(partner?.status)} → ${formatPartnerStatus(changes.status)}`,
      target,
      consequences: statusConsequences[changes.status] || [
        'Der Partnerstatus wird dauerhaft geändert.',
        'Zugriff und Sichtbarkeit können sich dadurch ändern.',
      ],
    });
  }

  if (changes.instagramProfile === '' || changes.instagramVisible === false) {
    return confirmAdminAction({
      title: 'Instagram-Profil administrativ ändern',
      target,
      consequences: [
        'Das Instagram-Profil wird entfernt oder ausgeblendet.',
        'Die Änderung wird dauerhaft im Partnerprofil gespeichert.',
      ],
    });
  }

  return confirmAdminAction({
    title: 'Partnerdaten speichern',
    target,
    consequences: [
      'Die eingegebenen Partnerdaten werden dauerhaft überschrieben.',
      'Admin-Notizen, Training, Karriere-, Team- oder Profildaten können betroffen sein.',
    ],
  });
}

const socialResources = ['Reel Hooks', 'Story Vorlagen', 'DM Skripte', 'Content Ideen', 'Posting Plan', 'Social Media Anleitungen', 'Instagram Wachstumstipps', 'Erfolgreiche Beispiel-Reels'];

const chatMessages = [
  { author: 'Carina C.', text: 'Heute zwei neue Wasser-Tests gebucht. Der kurze Follow-up hat super funktioniert.', time: '09:42', type: 'Erfolg' },
  { author: 'Academy Team', text: 'Teile hier Fragen, Erfahrungen und Hinweise aus deinem Academy-Alltag.', time: '10:15', type: 'Hinweis' },
  { author: 'Harbor Admin', text: 'Neuer Posting-Plan liegt im Ressourcenbereich.', time: '11:20', type: 'Admin' },
];

const qaQuestions = [
  { question: 'Wie funktioniert ein PPM-Messer?', category: 'PPM-Messung', author: 'Academy Team', answers: 0, best: true },
  { question: 'Wie mache ich einen Wassertest?', category: 'Wasseranalyse', author: 'Academy Team', answers: 0, best: true },
  { question: 'Wie leite ich Kunden zur offiziellen Produktseite?', category: 'Kundengewinnung', author: 'Carina C.', answers: 6, best: false },
  { question: 'Wie nutze ich KI für Reels?', category: 'KI & Automatisierung', author: 'Academy Team', answers: 0, best: false },
];

const trainingOptions = [
  'Startcenter Basics',
  'Testlabor & Demonstrationen',
  'Offizielle Produktseite',
  'Partner Backoffice',
  'Empfehlungsmarketing',
  'Social Media System',
  'Abschlussgespräch',
];

const academyUpdateCategories = [
  { value: 'module', label: 'Neues Modul' },
  { value: 'video', label: 'Neues Schulungsvideo' },
  { value: 'image', label: 'Neues Foto/Bild' },
  { value: 'resource', label: 'Neue Datei/Ressource' },
  { value: 'news', label: 'Neue Neuigkeit' },
  { value: 'chat-version', label: 'Neue Chat-Version' },
  { value: 'qa-topic', label: 'Neues Q&A-Thema' },
  { value: 'live-event', label: 'Neuer Live-Event' },
  { value: 'announcement', label: 'Wichtige Academy-Ankündigung' },
];

const updateTargetOptions = [
  { value: 'all', labelKey: 'targetAllApproved' },
  { value: 'language', labelKey: 'targetLanguage' },
  { value: 'training', labelKey: 'targetTraining' },
  { value: 'partners', labelKey: 'targetPartners' },
];

const dashboardNavItems = [
  { id: 'start', labelKey: 'start', icon: Crown },
  { id: 'dashboard', labelKey: 'dashboard', icon: ShieldCheck },
  { id: 'success', labelKey: 'successCenter', icon: Target },
  { id: 'growth', labelKey: 'growthCenter', icon: Flame },
  { id: 'campaigns', labelKey: 'campaignCenter', icon: Flame },
  { id: 'media', labelKey: 'mediaCenter', icon: ImagePlus },
  { id: 'career', labelKey: 'career', icon: Trophy },
  { id: 'gamification', labelKey: 'points', icon: Trophy },
  { id: 'leader', labelKey: 'teamControl', icon: Users },
  { id: 'analytics', labelKey: 'analytics', icon: TrendingUp, analyticsOnly: true },
  { id: 'news', labelKey: 'notifications', icon: Bell },
  { id: 'modules', labelKey: 'modules', icon: BookOpen },
  { id: 'testlab', labelKey: 'testLab', icon: Search },
  { id: 'links', labelKey: 'links', icon: ExternalLink },
  { id: 'resources', labelKey: 'resources', icon: Download },
  { id: 'calendar', labelKey: 'calendar', icon: CalendarDays },
  { id: 'social', labelKey: 'social', icon: Instagram },
  { id: 'contact', labelKey: 'contact', icon: MessageCircle },
  { id: 'community', labelKey: 'community', icon: MessageCircle },
  { id: 'chat', labelKey: 'chat', icon: MessageCircle },
  { id: 'qa', labelKey: 'qa', icon: FileQuestion },
  { id: 'profile', labelKey: 'profile', icon: UserCheck },
  { id: 'testimonials', labelKey: 'testimonials', icon: Star },
  { id: 'admin', labelKey: 'admin', icon: Settings, adminOnly: true },
];

const startCenterSteps = [
  {
    title: 'Erste Schritte',
    text: 'Academy ansehen, Profil prüfen und erstes Modul starten.',
    icon: CheckCircle2,
    action: 'Module öffnen',
    target: 'modules',
  },
  {
    title: 'Testlabor & Demonstrationen',
    text: 'Praxis-, Wasser-, Tee-, Pflanzen- und Vergleichstests lernen.',
    icon: Search,
    action: 'Testlabor öffnen',
    target: 'testlab',
  },
  {
    title: 'Offizielle Produktseite',
    text: 'Hier gelangen Kunden direkt zur offiziellen Aqua Global Produktseite.',
    icon: Users,
    action: 'Produktseite öffnen',
    href: CUSTOMER_REGISTRATION_URL,
  },
  {
    title: 'Partner Backoffice',
    text: 'Hier gelangen bestehende Aqua Global Partner direkt zum offiziellen Backoffice.',
    icon: UserCheck,
    action: 'Backoffice öffnen',
    href: PARTNER_REGISTRATION_URL,
  },
  {
    title: `Rabattcode ${DEFAULT_DISCOUNT_CODE} verwenden`,
    text: 'Rabattcode bei Registrierung und Empfehlung immer konsistent nutzen.',
    icon: Trophy,
    action: 'Code ansehen',
    target: 'links',
  },
  {
    title: 'Empfehlungsmarketing-Anleitung',
    text: 'Kontaktliste, Nachricht, Follow-up und Termin in einem Ablauf.',
    icon: MessageCircle,
    action: 'Download Center öffnen',
    target: 'resources',
  },
];

const helpfulLinks = [
  {
    audience: 'Kunden',
    titleKey: 'officialProductPage',
    textKey: 'officialProductText',
    buttonKey: 'openProductPage',
    href: CUSTOMER_REGISTRATION_URL,
    icon: Globe2,
  },
  {
    audience: 'Partner',
    titleKey: 'partnerBackoffice',
    textKey: 'partnerBackofficeText',
    buttonKey: 'openBackoffice',
    href: PARTNER_REGISTRATION_URL,
    icon: UserCheck,
  },
];

const resourceGroups = [
  {
    title: 'Kundeninformationen',
    icon: Globe2,
    items: academyDocuments.filter((document) => document.category === 'Kundeninformationen'),
  },
  {
    title: 'Produktkatalog',
    icon: BookOpen,
    items: academyDocuments.filter((document) => document.category === 'Produktkatalog'),
  },
  {
    title: 'Wasserwissen',
    icon: FileQuestion,
    items: academyDocuments.filter((document) => document.category === 'Wasserwissen'),
  },
  {
    title: 'Partnerpreise',
    icon: Lock,
    items: academyDocuments.filter((document) => document.category === 'Partnerpreise'),
  },
  {
    title: 'Karriereplan',
    icon: Trophy,
    items: academyDocuments.filter((document) => document.category === 'Karriereplan'),
  },
  {
    title: 'RXT Schulung',
    icon: Flame,
    items: academyDocuments.filter((document) => document.category === 'RXT Schulung'),
  },
  {
    title: 'Verkaufshilfen',
    icon: Download,
    items: [
      { id: 'whatsapp-skript', title: 'WhatsApp-Skript', description: 'Gesprächsvorlage für Follow-up und Terminvereinbarung.', category: 'Verkaufshilfen', visibility: 'partner' },
      { id: 'instagram-captions', title: 'Instagram-Captions', description: 'Vorbereitete Captions für Reichweite und Community-Aufbau.', category: 'Verkaufshilfen', visibility: 'partner' },
      { id: 'empfehlung-checkliste', title: 'Empfehlungs-Checkliste', description: 'Ablauf für Kontaktliste, Nachricht, Follow-up und Termin.', category: 'Verkaufshilfen', visibility: 'partner' },
    ],
  },
];

const contentByCode = {
  de: {
    modules,
    testLabCategories,
    startCenterSteps,
    resourceGroups,
    socialResources,
    chatMessages,
    chatFeatures: ['Text', 'Emojis', 'Bilder', 'Dateien', 'Sprachnachrichten', 'Videonachrichten'],
    qaQuestions,
    qaCategories: ['Produkte', 'Wasseranalyse', 'PPM-Messung', 'Kundengewinnung', 'Partneraufbau', 'Social Media', 'Instagram', 'Reels', 'KI & Automatisierung', 'Webseiten', 'Sonstiges'],
    bookings,
    testimonials,
  },
  en: {
    modules: [
      { id: 1, title: 'Welcome & using the Academy', progress: 100, lessons: 3, icon: Crown, lang: ['DE', 'RU', 'RO', 'EN'] },
      { id: 2, title: 'Mindset & start as a partner', progress: 85, lessons: 5, icon: Flame, lang: ['DE', 'RU', 'RO'] },
      { id: 3, title: 'Product knowledge & explaining water', progress: 65, lessons: 8, icon: BookOpen, lang: ['DE', 'RU', 'RO', 'EN', 'TR'] },
      { id: 4, title: 'Test lab & demonstrations', progress: 35, lessons: 10, icon: Search, lang: ['DE', 'RU', 'RO', 'EN'] },
      { id: 5, title: 'Social media & content system', progress: 42, lessons: 10, icon: Video, lang: ['DE', 'RU', 'RO', 'EN'] },
      { id: 6, title: 'Customer conversations & closing', progress: 25, lessons: 7, icon: MessageCircle, lang: ['DE', 'RU', 'RO'] },
      { id: 7, title: 'Winning partners & team building', progress: 0, lessons: 6, icon: Users, lang: ['DE', 'RU', 'RO', 'EN'] },
    ],
    startCenterSteps: [
      { title: 'First steps', text: 'Review the Academy, check your profile and start the first module.', icon: CheckCircle2, action: 'Open modules', target: 'modules' },
      { title: 'Test lab & demonstrations', text: 'Learn practical water, tea, plant and comparison demonstrations.', icon: Search, action: 'Open test lab', target: 'testlab' },
      { title: 'Official product page', text: 'Customers go directly to the official Aqua Global product page here.', icon: Users, action: 'Open product page', href: CUSTOMER_REGISTRATION_URL },
      { title: 'Partner Backoffice', text: 'Existing Aqua Global partners go directly to the official backoffice here.', icon: UserCheck, action: 'Open backoffice', href: PARTNER_REGISTRATION_URL },
      { title: 'Use discount code', text: 'Use your discount code consistently for registrations and recommendations.', icon: Trophy, action: 'View code', target: 'links' },
      { title: 'Referral marketing guide', text: 'Contact list, message, follow-up and appointment in one flow.', icon: MessageCircle, action: 'Open resources', target: 'resources' },
    ],
    resourceGroups: [
      { title: 'PDF trainings', icon: FileQuestion, items: ['First steps PDF', 'Compact product knowledge', 'Objection handling'] },
      { title: 'Presentations', icon: ImagePlus, items: ['Customer presentation', 'Partner opportunity', 'Team building'] },
      { title: 'Downloads', icon: Download, items: ['WhatsApp script', 'Instagram captions', 'Referral checklist'] },
    ],
    testLabCategories,
    socialResources: ['Reel hooks', 'Story templates', 'DM scripts', 'Content ideas', 'Posting plan', 'Social media guides', 'Instagram growth tips', 'Successful sample reels'],
    chatFeatures: ['Text', 'Emojis', 'Images', 'Files', 'Voice messages', 'Video messages'],
    chatMessages: [
      { author: 'Carina C.', text: 'Booked two new water tests today. The short follow-up worked very well.', time: '09:42', type: 'Win' },
      { author: 'Academy Team', text: 'Use this space for questions, shared experience and practical Academy tips.', time: '10:15', type: 'Info' },
      { author: 'Harbor Admin', text: 'A new posting plan is available in the resources area.', time: '11:20', type: 'Admin' },
    ],
    qaQuestions: [
      { question: 'How does a PPM meter work?', category: 'PPM measurement', author: 'Academy Team', answers: 0, best: true },
      { question: 'How do I run a water test?', category: 'Water analysis', author: 'Academy Team', answers: 0, best: true },
      { question: 'How do I guide customers to the official product page?', category: 'Customer acquisition', author: 'Carina C.', answers: 6, best: false },
      { question: 'How do I use AI for Reels?', category: 'AI & automation', author: 'Academy Team', answers: 0, best: false },
    ],
    qaCategories: ['Products', 'Water analysis', 'PPM measurement', 'Customer acquisition', 'Partner growth', 'Social media', 'Instagram', 'Reels', 'AI & automation', 'Websites', 'Other'],
    bookings: bookings.map((booking, index) => ({ ...booking, type: ['Zoom call', '1:1 guidance', 'Phone call'][index] || booking.type })),
    testimonials: [],
  },
  ru: {
    modules: [
      { id: 1, title: 'Добро пожаловать и работа с Academy', progress: 100, lessons: 3, icon: Crown, lang: ['DE', 'RU', 'RO', 'EN'] },
      { id: 2, title: 'Мышление и старт партнёра', progress: 85, lessons: 5, icon: Flame, lang: ['DE', 'RU', 'RO'] },
      { id: 3, title: 'Продукты и объяснение воды', progress: 65, lessons: 8, icon: BookOpen, lang: ['DE', 'RU', 'RO', 'EN', 'TR'] },
      { id: 4, title: 'Тест-лаборатория и демонстрации', progress: 35, lessons: 10, icon: Search, lang: ['DE', 'RU', 'RO', 'EN'] },
      { id: 5, title: 'Соцсети и система контента', progress: 42, lessons: 10, icon: Video, lang: ['DE', 'RU', 'RO', 'EN'] },
      { id: 6, title: 'Разговор с клиентом и закрытие', progress: 25, lessons: 7, icon: MessageCircle, lang: ['DE', 'RU', 'RO'] },
      { id: 7, title: 'Привлечение партнёров и команда', progress: 0, lessons: 6, icon: Users, lang: ['DE', 'RU', 'RO', 'EN'] },
    ],
    startCenterSteps: [
      { title: 'Первые шаги', text: 'Посмотрите Academy, проверьте профиль и начните первый модуль.', icon: CheckCircle2, action: 'Открыть модули', target: 'modules' },
      { title: 'Тест-лаборатория и демонстрации', text: 'Изучайте практические тесты воды, чая, растений и сравнений.', icon: Search, action: 'Открыть тест-лабораторию', target: 'testlab' },
      { title: 'Официальная страница продуктов', text: 'Клиенты переходят прямо на официальную страницу продуктов Aqua Global.', icon: Users, action: 'Открыть страницу продуктов', href: CUSTOMER_REGISTRATION_URL },
      { title: 'Partner Backoffice', text: 'Действующие партнёры Aqua Global переходят прямо в официальный backoffice.', icon: UserCheck, action: 'Открыть backoffice', href: PARTNER_REGISTRATION_URL },
      { title: 'Использовать код скидки', text: 'Используйте код скидки последовательно в регистрациях и рекомендациях.', icon: Trophy, action: 'Показать код', target: 'links' },
      { title: 'Инструкция по рекомендациям', text: 'Список контактов, сообщение, follow-up и встреча в одном процессе.', icon: MessageCircle, action: 'Открыть ресурсы', target: 'resources' },
    ],
    resourceGroups: [
      { title: 'PDF обучения', icon: FileQuestion, items: ['PDF первые шаги', 'Кратко о продуктах', 'Работа с возражениями'] },
      { title: 'Презентации', icon: ImagePlus, items: ['Презентация для клиента', 'Партнёрская возможность', 'Построение команды'] },
      { title: 'Загрузки', icon: Download, items: ['WhatsApp скрипт', 'Instagram подписи', 'Чеклист рекомендаций'] },
    ],
    testLabCategories,
    socialResources: ['Reel hooks', 'Шаблоны Stories', 'DM скрипты', 'Идеи контента', 'План публикаций', 'Инструкции соцсетей', 'Советы роста Instagram', 'Успешные примеры Reels'],
    chatFeatures: ['Текст', 'Эмодзи', 'Изображения', 'Файлы', 'Голосовые сообщения', 'Видео сообщения'],
    chatMessages: [
      { author: 'Carina C.', text: 'Сегодня забронировала два новых теста воды. Короткий follow-up отлично сработал.', time: '09:42', type: 'Успех' },
      { author: 'Academy Team', text: 'Здесь можно задавать вопросы, делиться опытом и полезными советами Academy.', time: '10:15', type: 'Информация' },
      { author: 'Harbor Admin', text: 'Новый план публикаций доступен в разделе ресурсов.', time: '11:20', type: 'Admin' },
    ],
    qaQuestions: [
      { question: 'Как работает PPM-метр?', category: 'PPM-измерение', author: 'Academy Team', answers: 0, best: true },
      { question: 'Как провести тест воды?', category: 'Анализ воды', author: 'Academy Team', answers: 0, best: true },
      { question: 'Как направить клиентов на официальную страницу продуктов?', category: 'Привлечение клиентов', author: 'Carina C.', answers: 6, best: false },
      { question: 'Как использовать ИИ для Reels?', category: 'ИИ и автоматизация', author: 'Academy Team', answers: 0, best: false },
    ],
    qaCategories: ['Продукты', 'Анализ воды', 'PPM-измерение', 'Клиенты', 'Партнёры', 'Соцсети', 'Instagram', 'Reels', 'ИИ и автоматизация', 'Сайты', 'Другое'],
    bookings: bookings.map((booking, index) => ({ ...booking, type: ['Zoom-звонок', '1:1 сопровождение', 'Телефонный звонок'][index] || booking.type })),
    testimonials: [],
  },
  ro: {
    modules: [
      { id: 1, title: 'Bun venit & folosirea Academy', progress: 100, lessons: 3, icon: Crown, lang: ['DE', 'RU', 'RO', 'EN'] },
      { id: 2, title: 'Mindset & start ca partener', progress: 85, lessons: 5, icon: Flame, lang: ['DE', 'RU', 'RO'] },
      { id: 3, title: 'Cunoștințe produs & explicarea apei', progress: 65, lessons: 8, icon: BookOpen, lang: ['DE', 'RU', 'RO', 'EN', 'TR'] },
      { id: 4, title: 'Testlabor & demonstrații', progress: 35, lessons: 10, icon: Search, lang: ['DE', 'RU', 'RO', 'EN'] },
      { id: 5, title: 'Social media & sistem de content', progress: 42, lessons: 10, icon: Video, lang: ['DE', 'RU', 'RO', 'EN'] },
      { id: 6, title: 'Discuții cu clienții & închidere', progress: 25, lessons: 7, icon: MessageCircle, lang: ['DE', 'RU', 'RO'] },
      { id: 7, title: 'Atragere parteneri & echipă', progress: 0, lessons: 6, icon: Users, lang: ['DE', 'RU', 'RO', 'EN'] },
    ],
    startCenterSteps: [
      { title: 'Primii pași', text: 'Parcurge Academy, verifică profilul și pornește primul modul.', icon: CheckCircle2, action: 'Deschide modulele', target: 'modules' },
      { title: 'Testlabor & demonstrații', text: 'Învață teste practice cu apă, ceai, plante și comparații.', icon: Search, action: 'Deschide Testlabor', target: 'testlab' },
      { title: 'Pagina oficială de produse', text: 'Clienții ajung direct la pagina oficială de produse Aqua Global.', icon: Users, action: 'Deschide pagina produselor', href: CUSTOMER_REGISTRATION_URL },
      { title: 'Partner Backoffice', text: 'Partenerii existenți Aqua Global ajung direct în backoffice-ul oficial.', icon: UserCheck, action: 'Deschide backoffice', href: PARTNER_REGISTRATION_URL },
      { title: 'Folosește codul de reducere', text: 'Folosește codul consecvent la înregistrări și recomandări.', icon: Trophy, action: 'Vezi codul', target: 'links' },
      { title: 'Ghid marketing de recomandare', text: 'Listă contacte, mesaj, follow-up și programare într-un singur flux.', icon: MessageCircle, action: 'Deschide resurse', target: 'resources' },
    ],
    resourceGroups: [
      { title: 'Traininguri PDF', icon: FileQuestion, items: ['PDF primii pași', 'Cunoștințe produs compact', 'Gestionarea obiecțiilor'] },
      { title: 'Prezentări', icon: ImagePlus, items: ['Prezentare client', 'Oportunitate partener', 'Construire echipă'] },
      { title: 'Descărcări', icon: Download, items: ['Script WhatsApp', 'Captions Instagram', 'Checklist recomandare'] },
    ],
    testLabCategories,
    socialResources: ['Reel hooks', 'Șabloane Story', 'Scripturi DM', 'Idei content', 'Plan postări', 'Ghiduri social media', 'Tips creștere Instagram', 'Exemple Reels de succes'],
    chatFeatures: ['Text', 'Emoji', 'Imagini', 'Fișiere', 'Mesaje vocale', 'Mesaje video'],
    chatMessages: [
      { author: 'Carina C.', text: 'Astăzi am programat două teste de apă. Follow-up-ul scurt a funcționat excelent.', time: '09:42', type: 'Succes' },
      { author: 'Academy Team', text: 'Folosește acest spațiu pentru întrebări, experiențe și sfaturi practice din Academy.', time: '10:15', type: 'Info' },
      { author: 'Harbor Admin', text: 'Noul plan de postări este în zona de resurse.', time: '11:20', type: 'Admin' },
    ],
    qaQuestions: [
      { question: 'Cum funcționează un PPM-metru?', category: 'Măsurare PPM', author: 'Academy Team', answers: 0, best: true },
      { question: 'Cum fac un test de apă?', category: 'Analiza apei', author: 'Academy Team', answers: 0, best: true },
      { question: 'Cum trimit clienții către pagina oficială de produse?', category: 'Atragere clienți', author: 'Carina C.', answers: 6, best: false },
      { question: 'Cum folosesc AI pentru Reels?', category: 'AI & automatizare', author: 'Academy Team', answers: 0, best: false },
    ],
    qaCategories: ['Produse', 'Analiza apei', 'Măsurare PPM', 'Atragere clienți', 'Dezvoltare parteneri', 'Social media', 'Instagram', 'Reels', 'AI & automatizare', 'Website-uri', 'Altele'],
    bookings: bookings.map((booking, index) => ({ ...booking, type: ['Apel Zoom', 'Ghidare 1:1', 'Apel telefonic'][index] || booking.type })),
    testimonials: [],
  },
};

const academyLanguageTags = ['DE', 'EN', 'RO', 'RU', 'EL', 'TR', 'IT', 'CS', 'ES', 'PL'];

function withAcademyLanguageTags(moduleList) {
  return moduleList.map((item) => ({ ...item, lang: academyLanguageTags }));
}

function localizedResourceGroups(titleMap) {
  return resourceGroups.map((group) => ({
    ...group,
    title: titleMap[group.title] || group.title,
  }));
}

function localizedTestLabCategories(titleMap) {
  return testLabCategories.map((category) => ({
    ...category,
    title: titleMap[category.id] || category.title,
  }));
}

Object.assign(contentByCode, {
  gr: {
    modules: withAcademyLanguageTags([
      { id: 1, title: 'Καλωσόρισμα / Κέντρο έναρξης', progress: 100, lessons: 3, icon: Crown },
      { id: 2, title: 'Βασικά Aqua Global', progress: 35, lessons: 5, icon: BookOpen },
      { id: 3, title: 'Προϊόντα', progress: 25, lessons: 10, icon: ShieldCheck },
      { id: 4, title: 'Εργαστήριο δοκιμών', progress: 40, lessons: 5, icon: Search },
      { id: 5, title: 'Τιμές & Προμήθειες', progress: 20, lessons: 5, icon: FileText },
      { id: 6, title: 'Πλάνο καριέρας', progress: 45, lessons: 6, icon: Trophy },
      { id: 7, title: 'RXT αποσκλήρυνση', progress: 15, lessons: 3, icon: Flame },
      { id: 8, title: 'Σύστημα πωλήσεων', progress: 25, lessons: 7, icon: MessageCircle },
      { id: 9, title: 'Ανάπτυξη συνεργατών', progress: 20, lessons: 6, icon: Users },
      { id: 10, title: 'Λήψεις', progress: 30, lessons: 7, icon: Download },
      { id: 11, title: 'Πιστοποίηση / Quiz', progress: 10, lessons: 5, icon: FileQuestion },
    ]),
    startCenterSteps: [
      { title: 'Πρώτα βήματα', text: 'Δες την Academy, έλεγξε το προφίλ σου και ξεκίνα την πρώτη ενότητα.', icon: CheckCircle2, action: 'Άνοιγμα ενοτήτων', target: 'modules' },
      { title: 'Εργαστήριο δοκιμών', text: 'Μάθε πρακτικές επιδείξεις νερού, τσαγιού, φυτών και συγκρίσεων.', icon: Search, action: 'Άνοιγμα εργαστηρίου', target: 'testlab' },
      { title: 'Επίσημη σελίδα προϊόντων', text: 'Οι πελάτες πηγαίνουν απευθείας στην επίσημη σελίδα Aqua Global.', icon: Users, action: 'Άνοιγμα προϊόντων', href: CUSTOMER_REGISTRATION_URL },
      { title: 'Partner Backoffice', text: 'Υπάρχοντες συνεργάτες Aqua Global πηγαίνουν στο επίσημο backoffice.', icon: UserCheck, action: 'Άνοιγμα backoffice', href: PARTNER_REGISTRATION_URL },
      { title: 'Χρήση κωδικού έκπτωσης', text: 'Χρησιμοποίησε τον κωδικό σου σταθερά σε προτάσεις και συστάσεις.', icon: Trophy, action: 'Προβολή κωδικού', target: 'links' },
      { title: 'Οδηγός referral marketing', text: 'Λίστα επαφών, μήνυμα, follow-up και ραντεβού σε μία ροή.', icon: MessageCircle, action: 'Άνοιγμα πόρων', target: 'resources' },
    ],
    resourceGroups: localizedResourceGroups({
      Kundeninformationen: 'Πληροφορίες πελατών',
      Produktkatalog: 'Κατάλογος προϊόντων',
      Wasserwissen: 'Γνώση νερού',
      Partnerpreise: 'Τιμές συνεργατών',
      Karriereplan: 'Πλάνο καριέρας',
      'RXT Schulung': 'Εκπαίδευση RXT',
      Verkaufshilfen: 'Υποστήριξη πωλήσεων',
    }),
    testLabCategories: localizedTestLabCategories({
      'ppm-tests': 'PPM-Test',
      'tea-tests': 'Τεστ τσαγιού',
      'plant-tests': 'Τεστ βασιλικού',
      'filter-comparison': 'Κανάτα φίλτρου vs. Aqua Global',
      'more-tests': 'Περισσότερες δοκιμές',
    }),
    socialResources: ['Reel hooks', 'Πρότυπα Story', 'DM scripts', 'Ιδέες περιεχομένου', 'Πλάνο δημοσιεύσεων', 'Οδηγοί social media', 'Συμβουλές ανάπτυξης Instagram', 'Επιτυχημένα Reels'],
    chatFeatures: ['Κείμενο', 'Emoji', 'Εικόνες', 'Αρχεία', 'Φωνητικά μηνύματα', 'Βίντεο μηνύματα'],
    qaQuestions,
    qaCategories: ['Προϊόντα', 'Ανάλυση νερού', 'Μέτρηση PPM', 'Απόκτηση πελατών', 'Ανάπτυξη συνεργατών', 'Social Media', 'Instagram', 'Reels', 'AI & Αυτοματισμός', 'Ιστοσελίδες', 'Άλλο'],
    chatMessages: [],
    bookings: bookings.map((booking, index) => ({ ...booking, type: ['Zoom call', '1:1 καθοδήγηση', 'Τηλεφωνική κλήση'][index] || booking.type })),
    testimonials: [],
  },
  tr: {
    modules: withAcademyLanguageTags([
      { id: 1, title: 'Hoş geldin / Başlangıç merkezi', progress: 100, lessons: 3, icon: Crown },
      { id: 2, title: 'Aqua Global temelleri', progress: 35, lessons: 5, icon: BookOpen },
      { id: 3, title: 'Ürünler', progress: 25, lessons: 10, icon: ShieldCheck },
      { id: 4, title: 'Test laboratuvarı', progress: 40, lessons: 5, icon: Search },
      { id: 5, title: 'Fiyatlar & komisyonlar', progress: 20, lessons: 5, icon: FileText },
      { id: 6, title: 'Kariyer planı', progress: 45, lessons: 6, icon: Trophy },
      { id: 7, title: 'RXT kireç çözme', progress: 15, lessons: 3, icon: Flame },
      { id: 8, title: 'Satış sistemi', progress: 25, lessons: 7, icon: MessageCircle },
      { id: 9, title: 'Partner geliştirme', progress: 20, lessons: 6, icon: Users },
      { id: 10, title: 'İndirilenler', progress: 30, lessons: 7, icon: Download },
      { id: 11, title: 'Sertifika / Quiz', progress: 10, lessons: 5, icon: FileQuestion },
    ]),
    startCenterSteps: [
      { title: 'İlk adımlar', text: 'Academy alanını incele, profilini kontrol et ve ilk modüle başla.', icon: CheckCircle2, action: 'Modülleri aç', target: 'modules' },
      { title: 'Test laboratuvarı', text: 'Su, çay, bitki ve karşılaştırma demonstrasyonlarını öğren.', icon: Search, action: 'Test laboratuvarını aç', target: 'testlab' },
      { title: 'Resmi ürün sayfası', text: 'Müşteriler doğrudan resmi Aqua Global ürün sayfasına gider.', icon: Users, action: 'Ürün sayfasını aç', href: CUSTOMER_REGISTRATION_URL },
      { title: 'Partner Backoffice', text: 'Mevcut Aqua Global partnerleri resmi backoffice alanına gider.', icon: UserCheck, action: 'Backoffice aç', href: PARTNER_REGISTRATION_URL },
      { title: 'İndirim kodu kullan', text: 'İndirim kodunu önerilerde ve kayıtlarda tutarlı kullan.', icon: Trophy, action: 'Kodu göster', target: 'links' },
      { title: 'Tavsiye marketing rehberi', text: 'Kontak listesi, mesaj, follow-up ve randevu tek akışta.', icon: MessageCircle, action: 'Kaynakları aç', target: 'resources' },
    ],
    resourceGroups: localizedResourceGroups({
      Kundeninformationen: 'Müşteri bilgileri',
      Produktkatalog: 'Ürün kataloğu',
      Wasserwissen: 'Su bilgisi',
      Partnerpreise: 'Partner fiyatları',
      Karriereplan: 'Kariyer planı',
      'RXT Schulung': 'RXT eğitimi',
      Verkaufshilfen: 'Satış yardımcıları',
    }),
    testLabCategories: localizedTestLabCategories({
      'ppm-tests': 'PPM testi',
      'tea-tests': 'Çay testi',
      'plant-tests': 'Fesleğen testi',
      'filter-comparison': 'Filtre sürahisi vs. Aqua Global',
      'more-tests': 'Diğer testler',
    }),
    socialResources: ['Reel hooks', 'Story şablonları', 'DM scriptleri', 'İçerik fikirleri', 'Paylaşım planı', 'Sosyal medya rehberleri', 'Instagram büyüme ipuçları', 'Başarılı Reel örnekleri'],
    chatFeatures: ['Metin', 'Emojiler', 'Görseller', 'Dosyalar', 'Sesli mesajlar', 'Video mesajlar'],
    qaQuestions,
    qaCategories: ['Ürünler', 'Su analizi', 'PPM ölçümü', 'Müşteri kazanımı', 'Partner geliştirme', 'Sosyal medya', 'Instagram', 'Reels', 'AI & otomasyon', 'Web siteleri', 'Diğer'],
    chatMessages: [],
    bookings: bookings.map((booking, index) => ({ ...booking, type: ['Zoom call', '1:1 rehberlik', 'Telefon görüşmesi'][index] || booking.type })),
    testimonials: [],
  },
  it: {
    modules: withAcademyLanguageTags([
      { id: 1, title: 'Benvenuto / Centro iniziale', progress: 100, lessons: 3, icon: Crown },
      { id: 2, title: 'Fondamenti Aqua Global', progress: 35, lessons: 5, icon: BookOpen },
      { id: 3, title: 'Prodotti', progress: 25, lessons: 10, icon: ShieldCheck },
      { id: 4, title: 'Laboratorio test', progress: 40, lessons: 5, icon: Search },
      { id: 5, title: 'Prezzi & provvigioni', progress: 20, lessons: 5, icon: FileText },
      { id: 6, title: 'Piano carriera', progress: 45, lessons: 6, icon: Trophy },
      { id: 7, title: 'Decalcificazione RXT', progress: 15, lessons: 3, icon: Flame },
      { id: 8, title: 'Sistema vendita', progress: 25, lessons: 7, icon: MessageCircle },
      { id: 9, title: 'Sviluppo partner', progress: 20, lessons: 6, icon: Users },
      { id: 10, title: 'Download', progress: 30, lessons: 7, icon: Download },
      { id: 11, title: 'Certificazione / Quiz', progress: 10, lessons: 5, icon: FileQuestion },
    ]),
    startCenterSteps: [
      { title: 'Primi passi', text: 'Guarda Academy, controlla il profilo e avvia il primo modulo.', icon: CheckCircle2, action: 'Apri moduli', target: 'modules' },
      { title: 'Laboratorio test', text: 'Impara dimostrazioni pratiche con acqua, tè, piante e confronti.', icon: Search, action: 'Apri laboratorio', target: 'testlab' },
      { title: 'Pagina prodotto ufficiale', text: 'I clienti arrivano direttamente alla pagina prodotto ufficiale Aqua Global.', icon: Users, action: 'Apri prodotti', href: CUSTOMER_REGISTRATION_URL },
      { title: 'Partner Backoffice', text: 'I partner Aqua Global esistenti accedono al backoffice ufficiale.', icon: UserCheck, action: 'Apri backoffice', href: PARTNER_REGISTRATION_URL },
      { title: 'Usa codice sconto', text: 'Usa il tuo codice in modo coerente per raccomandazioni e registrazioni.', icon: Trophy, action: 'Mostra codice', target: 'links' },
      { title: 'Guida referral marketing', text: 'Lista contatti, messaggio, follow-up e appuntamento in un unico flusso.', icon: MessageCircle, action: 'Apri risorse', target: 'resources' },
    ],
    resourceGroups: localizedResourceGroups({
      Kundeninformationen: 'Informazioni clienti',
      Produktkatalog: 'Catalogo prodotti',
      Wasserwissen: 'Conoscenza acqua',
      Partnerpreise: 'Prezzi partner',
      Karriereplan: 'Piano carriera',
      'RXT Schulung': 'Formazione RXT',
      Verkaufshilfen: 'Supporti vendita',
    }),
    testLabCategories: localizedTestLabCategories({
      'ppm-tests': 'Test PPM',
      'tea-tests': 'Test tè',
      'plant-tests': 'Test basilico',
      'filter-comparison': 'Caraffa filtrante vs. Aqua Global',
      'more-tests': 'Altri test',
    }),
    socialResources: ['Reel hooks', 'Template Story', 'Script DM', 'Idee contenuto', 'Piano posting', 'Guide social media', 'Consigli crescita Instagram', 'Reel di esempio riusciti'],
    chatFeatures: ['Testo', 'Emoji', 'Immagini', 'File', 'Messaggi vocali', 'Messaggi video'],
    qaQuestions,
    qaCategories: ['Prodotti', 'Analisi acqua', 'Misurazione PPM', 'Acquisizione clienti', 'Sviluppo partner', 'Social media', 'Instagram', 'Reels', 'AI & automazione', 'Siti web', 'Altro'],
    chatMessages: [],
    bookings: bookings.map((booking, index) => ({ ...booking, type: ['Zoom call', 'Guida 1:1', 'Telefonata'][index] || booking.type })),
    testimonials: [],
  },
  cz: {
    modules: withAcademyLanguageTags([
      { id: 1, title: 'Vítej / Start centrum', progress: 100, lessons: 3, icon: Crown },
      { id: 2, title: 'Základy Aqua Global', progress: 35, lessons: 5, icon: BookOpen },
      { id: 3, title: 'Produkty', progress: 25, lessons: 10, icon: ShieldCheck },
      { id: 4, title: 'Testovací laboratoř', progress: 40, lessons: 5, icon: Search },
      { id: 5, title: 'Ceny & provize', progress: 20, lessons: 5, icon: FileText },
      { id: 6, title: 'Kariérní plán', progress: 45, lessons: 6, icon: Trophy },
      { id: 7, title: 'RXT odvápnění', progress: 15, lessons: 3, icon: Flame },
      { id: 8, title: 'Prodejní systém', progress: 25, lessons: 7, icon: MessageCircle },
      { id: 9, title: 'Budování partnerů', progress: 20, lessons: 6, icon: Users },
      { id: 10, title: 'Ke stažení', progress: 30, lessons: 7, icon: Download },
      { id: 11, title: 'Certifikace / Quiz', progress: 10, lessons: 5, icon: FileQuestion },
    ]),
    startCenterSteps: [
      { title: 'První kroky', text: 'Projdi Academy, zkontroluj profil a spusť první modul.', icon: CheckCircle2, action: 'Otevřít moduly', target: 'modules' },
      { title: 'Testovací laboratoř', text: 'Nauč se praktické ukázky vody, čaje, rostlin a srovnání.', icon: Search, action: 'Otevřít laboratoř', target: 'testlab' },
      { title: 'Oficiální produktová stránka', text: 'Zákazníci přejdou přímo na oficiální stránku Aqua Global.', icon: Users, action: 'Otevřít produkty', href: CUSTOMER_REGISTRATION_URL },
      { title: 'Partner Backoffice', text: 'Stávající partneři Aqua Global přejdou do oficiálního backoffice.', icon: UserCheck, action: 'Otevřít backoffice', href: PARTNER_REGISTRATION_URL },
      { title: 'Použít slevový kód', text: 'Používej svůj kód konzistentně pro doporučení a registrace.', icon: Trophy, action: 'Zobrazit kód', target: 'links' },
      { title: 'Průvodce referral marketingem', text: 'Seznam kontaktů, zpráva, follow-up a termín v jednom procesu.', icon: MessageCircle, action: 'Otevřít zdroje', target: 'resources' },
    ],
    resourceGroups: localizedResourceGroups({
      Kundeninformationen: 'Informace pro zákazníky',
      Produktkatalog: 'Produktový katalog',
      Wasserwissen: 'Znalosti o vodě',
      Partnerpreise: 'Partnerské ceny',
      Karriereplan: 'Kariérní plán',
      'RXT Schulung': 'Školení RXT',
      Verkaufshilfen: 'Prodejní pomůcky',
    }),
    testLabCategories: localizedTestLabCategories({
      'ppm-tests': 'PPM test',
      'tea-tests': 'Test čaje',
      'plant-tests': 'Test bazalky',
      'filter-comparison': 'Filtrační konvice vs. Aqua Global',
      'more-tests': 'Další testy',
    }),
    socialResources: ['Reel hooks', 'Story šablony', 'DM skripty', 'Nápady na obsah', 'Publikační plán', 'Social media návody', 'Tipy růstu Instagramu', 'Úspěšné příklady Reels'],
    chatFeatures: ['Text', 'Emoji', 'Obrázky', 'Soubory', 'Hlasové zprávy', 'Video zprávy'],
    qaQuestions,
    qaCategories: ['Produkty', 'Analýza vody', 'PPM měření', 'Získávání zákazníků', 'Budování partnerů', 'Social media', 'Instagram', 'Reels', 'AI & automatizace', 'Weby', 'Ostatní'],
    chatMessages: [],
    bookings: bookings.map((booking, index) => ({ ...booking, type: ['Zoom call', '1:1 vedení', 'Telefonát'][index] || booking.type })),
    testimonials: [],
  },
});

contentByCode.el = contentByCode.gr;
contentByCode.cs = contentByCode.cz;
contentByCode.es = {
  modules: withAcademyLanguageTags([
    { id: 1, title: 'Bienvenida / Centro de inicio', progress: 100, lessons: 3, icon: Crown },
    { id: 2, title: 'Fundamentos Aqua Global', progress: 35, lessons: 5, icon: BookOpen },
    { id: 3, title: 'Productos', progress: 25, lessons: 10, icon: ShieldCheck },
    { id: 4, title: 'Laboratorio de pruebas', progress: 40, lessons: 5, icon: Search },
    { id: 5, title: 'Precios y comisiones', progress: 20, lessons: 5, icon: FileText },
    { id: 6, title: 'Plan de carrera', progress: 45, lessons: 6, icon: Trophy },
    { id: 7, title: 'Descalcificación RXT', progress: 15, lessons: 3, icon: Flame },
    { id: 8, title: 'Sistema de ventas', progress: 25, lessons: 7, icon: MessageCircle },
    { id: 9, title: 'Desarrollo de socios', progress: 20, lessons: 6, icon: Users },
    { id: 10, title: 'Descargas', progress: 30, lessons: 7, icon: Download },
    { id: 11, title: 'Certificación / Quiz', progress: 10, lessons: 5, icon: FileQuestion },
  ]),
  startCenterSteps: [
    { title: 'Primeros pasos', text: 'Revisa la Academy, completa tu perfil y empieza el primer módulo.', icon: CheckCircle2, action: 'Abrir módulos', target: 'modules' },
    { title: 'Laboratorio de pruebas', text: 'Aprende demostraciones prácticas con agua, té, plantas y comparaciones.', icon: Search, action: 'Abrir laboratorio', target: 'testlab' },
    { title: 'Página oficial de productos', text: 'Los clientes acceden directamente a la página oficial de Aqua Global.', icon: Users, action: 'Abrir productos', href: CUSTOMER_REGISTRATION_URL },
    { title: 'Partner Backoffice', text: 'Los socios Aqua Global existentes acceden al backoffice oficial.', icon: UserCheck, action: 'Abrir backoffice', href: PARTNER_REGISTRATION_URL },
    { title: 'Usar código de descuento', text: 'Usa tu código de forma constante en recomendaciones y registros.', icon: Trophy, action: 'Mostrar código', target: 'links' },
    { title: 'Guía de marketing de recomendación', text: 'Lista de contactos, mensaje, seguimiento y cita en un solo flujo.', icon: MessageCircle, action: 'Abrir recursos', target: 'resources' },
  ],
  resourceGroups: localizedResourceGroups({
    Kundeninformationen: 'Información para clientes',
    Produktkatalog: 'Catálogo de productos',
    Wasserwissen: 'Conocimiento del agua',
    Partnerpreise: 'Precios de socios',
    Karriereplan: 'Plan de carrera',
    'RXT Schulung': 'Formación RXT',
    Verkaufshilfen: 'Materiales de venta',
  }),
  testLabCategories: localizedTestLabCategories({
    'ppm-tests': 'Prueba PPM',
    'tea-tests': 'Prueba de té',
    'plant-tests': 'Prueba de albahaca',
    'filter-comparison': 'Jarra filtrante vs. Aqua Global',
    'more-tests': 'Más pruebas',
  }),
  socialResources: ['Hooks para Reels', 'Plantillas de Story', 'Guiones DM', 'Ideas de contenido', 'Plan de publicaciones', 'Guías de redes sociales', 'Consejos de crecimiento en Instagram', 'Ejemplos de Reels exitosos'],
  chatFeatures: ['Texto', 'Emojis', 'Imágenes', 'Archivos', 'Mensajes de voz', 'Mensajes de video'],
  qaQuestions,
  qaCategories: ['Productos', 'Análisis de agua', 'Medición PPM', 'Captación de clientes', 'Desarrollo de socios', 'Redes sociales', 'Instagram', 'Reels', 'IA y automatización', 'Sitios web', 'Otros'],
  chatMessages: [],
  bookings: bookings.map((booking, index) => ({ ...booking, type: ['Llamada Zoom', 'Guía 1:1', 'Llamada telefónica'][index] || booking.type })),
  testimonials: [],
};
contentByCode.pl = {
  modules: withAcademyLanguageTags([
    { id: 1, title: 'Powitanie / Centrum startowe', progress: 100, lessons: 3, icon: Crown },
    { id: 2, title: 'Podstawy Aqua Global', progress: 35, lessons: 5, icon: BookOpen },
    { id: 3, title: 'Produkty', progress: 25, lessons: 10, icon: ShieldCheck },
    { id: 4, title: 'Laboratorium testów', progress: 40, lessons: 5, icon: Search },
    { id: 5, title: 'Ceny i prowizje', progress: 20, lessons: 5, icon: FileText },
    { id: 6, title: 'Plan kariery', progress: 45, lessons: 6, icon: Trophy },
    { id: 7, title: 'Odkamienianie RXT', progress: 15, lessons: 3, icon: Flame },
    { id: 8, title: 'System sprzedaży', progress: 25, lessons: 7, icon: MessageCircle },
    { id: 9, title: 'Budowanie partnerów', progress: 20, lessons: 6, icon: Users },
    { id: 10, title: 'Pobrania', progress: 30, lessons: 7, icon: Download },
    { id: 11, title: 'Certyfikacja / Quiz', progress: 10, lessons: 5, icon: FileQuestion },
  ]),
  startCenterSteps: [
    { title: 'Pierwsze kroki', text: 'Przejrzyj Academy, sprawdź profil i rozpocznij pierwszy moduł.', icon: CheckCircle2, action: 'Otwórz moduły', target: 'modules' },
    { title: 'Laboratorium testów', text: 'Ucz się praktycznych demonstracji wody, herbaty, roślin i porównań.', icon: Search, action: 'Otwórz laboratorium', target: 'testlab' },
    { title: 'Oficjalna strona produktów', text: 'Klienci przechodzą bezpośrednio na oficjalną stronę Aqua Global.', icon: Users, action: 'Otwórz produkty', href: CUSTOMER_REGISTRATION_URL },
    { title: 'Partner Backoffice', text: 'Istniejący partnerzy Aqua Global przechodzą do oficjalnego backoffice.', icon: UserCheck, action: 'Otwórz backoffice', href: PARTNER_REGISTRATION_URL },
    { title: 'Użyj kodu rabatowego', text: 'Używaj swojego kodu konsekwentnie w poleceniach i rejestracjach.', icon: Trophy, action: 'Pokaż kod', target: 'links' },
    { title: 'Przewodnik referral marketingu', text: 'Lista kontaktów, wiadomość, follow-up i termin w jednym procesie.', icon: MessageCircle, action: 'Otwórz zasoby', target: 'resources' },
  ],
  resourceGroups: localizedResourceGroups({
    Kundeninformationen: 'Informacje dla klientów',
    Produktkatalog: 'Katalog produktów',
    Wasserwissen: 'Wiedza o wodzie',
    Partnerpreise: 'Ceny partnerskie',
    Karriereplan: 'Plan kariery',
    'RXT Schulung': 'Szkolenie RXT',
    Verkaufshilfen: 'Materiały sprzedażowe',
  }),
  testLabCategories: localizedTestLabCategories({
    'ppm-tests': 'Test PPM',
    'tea-tests': 'Test herbaty',
    'plant-tests': 'Test bazylii',
    'filter-comparison': 'Dzbanek filtrujący vs. Aqua Global',
    'more-tests': 'Więcej testów',
  }),
  socialResources: ['Hooki do Reels', 'Szablony Story', 'Skrypty DM', 'Pomysły na treści', 'Plan publikacji', 'Poradniki social media', 'Wskazówki wzrostu Instagram', 'Udane przykłady Reels'],
  chatFeatures: ['Tekst', 'Emoji', 'Obrazy', 'Pliki', 'Wiadomości głosowe', 'Wiadomości wideo'],
  qaQuestions,
  qaCategories: ['Produkty', 'Analiza wody', 'Pomiar PPM', 'Pozyskiwanie klientów', 'Budowanie partnerów', 'Social media', 'Instagram', 'Reels', 'AI i automatyzacja', 'Strony internetowe', 'Inne'],
  chatMessages: [],
  bookings: bookings.map((booking, index) => ({ ...booking, type: ['Rozmowa Zoom', 'Wsparcie 1:1', 'Rozmowa telefoniczna'][index] || booking.type })),
  testimonials: [],
};

contentByCode.de.modules = withAcademyLanguageTags(contentByCode.de.modules);
contentByCode.en.modules = withAcademyLanguageTags(contentByCode.en.modules);
contentByCode.ru.modules = withAcademyLanguageTags(contentByCode.ru.modules);
contentByCode.ro.modules = withAcademyLanguageTags(contentByCode.ro.modules);
contentByCode.en.resourceGroups = localizedResourceGroups({
  Kundeninformationen: 'Customer information',
  Produktkatalog: 'Product catalog',
  Wasserwissen: 'Water knowledge',
  Partnerpreise: 'Partner prices',
  Karriereplan: 'Career plan',
  'RXT Schulung': 'RXT training',
  Verkaufshilfen: 'Sales aids',
});
contentByCode.ru.resourceGroups = localizedResourceGroups({
  Kundeninformationen: 'Информация для клиентов',
  Produktkatalog: 'Каталог продуктов',
  Wasserwissen: 'Знания о воде',
  Partnerpreise: 'Партнёрские цены',
  Karriereplan: 'Карьерный план',
  'RXT Schulung': 'Обучение RXT',
  Verkaufshilfen: 'Материалы продаж',
});
contentByCode.ro.resourceGroups = localizedResourceGroups({
  Kundeninformationen: 'Informații clienți',
  Produktkatalog: 'Catalog produse',
  Wasserwissen: 'Cunoștințe despre apă',
  Partnerpreise: 'Prețuri parteneri',
  Karriereplan: 'Plan carieră',
  'RXT Schulung': 'Training RXT',
  Verkaufshilfen: 'Materiale vânzare',
});
contentByCode.en.testLabCategories = localizedTestLabCategories({
  'ppm-tests': 'PPM test',
  'tea-tests': 'Tea test',
  'plant-tests': 'Basil test',
  'filter-comparison': 'Filter jug vs. Aqua Global',
  'more-tests': 'More tests',
});
contentByCode.ru.testLabCategories = localizedTestLabCategories({
  'ppm-tests': 'PPM-тест',
  'tea-tests': 'Тест чая',
  'plant-tests': 'Тест базилика',
  'filter-comparison': 'Фильтр-кувшин vs. Aqua Global',
  'more-tests': 'Другие тесты',
});
contentByCode.ro.testLabCategories = localizedTestLabCategories({
  'ppm-tests': 'Test PPM',
  'tea-tests': 'Test ceai',
  'plant-tests': 'Test busuioc',
  'filter-comparison': 'Cană filtrantă vs. Aqua Global',
  'more-tests': 'Alte teste',
});

const moduleTitleTranslationsByCode = {
  de: {
    1: 'Willkommen / Startcenter',
    2: 'Aqua Global Grundlagen',
    3: 'Produkte',
    4: 'Karriereplan',
    5: 'Preise & Provisionen',
    6: 'Verkaufssystem',
    7: 'RXT Entkalkung',
    8: 'Downloads',
    9: 'Partneraufbau',
    10: 'Testlabor',
    11: 'Zertifizierung / Quiz',
  },
  en: {
    1: 'Welcome / Start Center',
    2: 'Aqua Global Basics',
    3: 'Products',
    4: 'Career Plan',
    5: 'Prices & Commissions',
    6: 'Sales System',
    7: 'RXT Descaling',
    8: 'Downloads',
    9: 'Partner Building',
    10: 'Test Lab',
    11: 'Certification / Quiz',
  },
  ro: {
    1: 'Bun venit / Centru de start',
    2: 'Bazele Aqua Global',
    3: 'Produse',
    4: 'Plan de carieră',
    5: 'Prețuri & comisioane',
    6: 'Sistem de vânzări',
    7: 'Decalcifiere RXT',
    8: 'Descărcări',
    9: 'Dezvoltare parteneri',
    10: 'Laborator de teste',
    11: 'Certificare / Quiz',
  },
  ru: {
    1: 'Добро пожаловать / Стартовый центр',
    2: 'Основы Aqua Global',
    3: 'Продукты',
    4: 'Карьерный план',
    5: 'Цены и комиссии',
    6: 'Система продаж',
    7: 'Удаление накипи RXT',
    8: 'Загрузки',
    9: 'Построение партнёрской команды',
    10: 'Тест-лаборатория',
    11: 'Сертификация / Quiz',
  },
  el: {
    1: 'Καλωσόρισμα / Κέντρο έναρξης',
    2: 'Βασικά Aqua Global',
    3: 'Προϊόντα',
    4: 'Πλάνο καριέρας',
    5: 'Τιμές & Προμήθειες',
    6: 'Σύστημα πωλήσεων',
    7: 'Αποσκλήρυνση RXT',
    8: 'Λήψεις',
    9: 'Ανάπτυξη συνεργατών',
    10: 'Εργαστήριο δοκιμών',
    11: 'Πιστοποίηση / Quiz',
  },
  tr: {
    1: 'Hoş geldin / Başlangıç merkezi',
    2: 'Aqua Global temelleri',
    3: 'Ürünler',
    4: 'Kariyer planı',
    5: 'Fiyatlar & komisyonlar',
    6: 'Satış sistemi',
    7: 'RXT kireç çözme',
    8: 'İndirilenler',
    9: 'Partner geliştirme',
    10: 'Test laboratuvarı',
    11: 'Sertifika / Quiz',
  },
  it: {
    1: 'Benvenuto / Centro iniziale',
    2: 'Fondamenti Aqua Global',
    3: 'Prodotti',
    4: 'Piano carriera',
    5: 'Prezzi & provvigioni',
    6: 'Sistema vendita',
    7: 'Decalcificazione RXT',
    8: 'Download',
    9: 'Sviluppo partner',
    10: 'Laboratorio test',
    11: 'Certificazione / Quiz',
  },
  cs: {
    1: 'Vítej / Start centrum',
    2: 'Základy Aqua Global',
    3: 'Produkty',
    4: 'Kariérní plán',
    5: 'Ceny & provize',
    6: 'Prodejní systém',
    7: 'RXT odvápnění',
    8: 'Ke stažení',
    9: 'Budování partnerů',
    10: 'Testovací laboratoř',
    11: 'Certifikace / Quiz',
  },
  es: {
    1: 'Bienvenida / Centro de inicio',
    2: 'Fundamentos Aqua Global',
    3: 'Productos',
    4: 'Plan de carrera',
    5: 'Precios y comisiones',
    6: 'Sistema de ventas',
    7: 'Descalcificación RXT',
    8: 'Descargas',
    9: 'Desarrollo de socios',
    10: 'Laboratorio de pruebas',
    11: 'Certificación / Quiz',
  },
  pl: {
    1: 'Powitanie / Centrum startowe',
    2: 'Podstawy Aqua Global',
    3: 'Produkty',
    4: 'Plan kariery',
    5: 'Ceny i prowizje',
    6: 'System sprzedaży',
    7: 'Odkamienianie RXT',
    8: 'Pobrania',
    9: 'Budowanie partnerów',
    10: 'Laboratorium testów',
    11: 'Certyfikacja / Quiz',
  },
};
moduleTitleTranslationsByCode.gr = moduleTitleTranslationsByCode.el;
moduleTitleTranslationsByCode.cz = moduleTitleTranslationsByCode.cs;

function buildLocalizedModuleParity(code) {
  const translations = moduleTitleTranslationsByCode[code] || moduleTitleTranslationsByCode.de;
  const localizedCatalog = getAcademyContentCatalog(code);
  const localizedCatalogById = new Map(localizedCatalog.map((module) => [module.id, module]));

  return modules
    .slice()
    .sort((left, right) => left.order - right.order)
    .map((module) => {
      const catalogModule = localizedCatalogById.get(module.id);

      return {
        ...module,
        ...catalogModule,
        title: translations[module.id] || catalogModule?.title || module.title,
        lessons: catalogModule?.lessons.length || module.lessons,
        icon: module.icon,
        translation_missing: !translations[module.id],
        translationMissing: !translations[module.id],
        lang: academyLanguageTags,
      };
    });
}

function preserveMasterTestLabVideos(localizedCategories = testLabCategories) {
  const localizedTitleById = new Map(localizedCategories.map((category) => [category.id, category.title]));

  return testLabCategories.map((category) => ({
    ...category,
    title: localizedTitleById.get(category.id) || category.title,
    videos: category.videos,
  }));
}

function normalizeAcademyContentParity() {
  ['de', 'en', 'ro', 'ru', 'el', 'tr', 'it', 'cs', 'es', 'pl'].forEach((code) => {
    const localized = contentByCode[code] || {};
    contentByCode[code] = {
      ...contentByCode.de,
      ...localized,
      modules: buildLocalizedModuleParity(code),
      testLabCategories: preserveMasterTestLabVideos(localized.testLabCategories),
    };
  });

  contentByCode.gr = contentByCode.el;
  contentByCode.cz = contentByCode.cs;
}

normalizeAcademyContentParity();

const initialRegistrationForm = {
  firstName: '',
  lastName: '',
  email: '',
  whatsapp: '',
  discountCode: '',
  city: '',
  language: DEFAULT_LANGUAGE,
  password: '',
  passwordRepeat: '',
  profileImage: null,
  acceptedLegal: false,
  acceptedTrainingContent: false,
  emailUpdates: true,
  whatsappUpdates: false,
};

const initialLoginForm = {
  username: '',
  password: '',
};

function getInitialReferralCode() {
  if (typeof window === 'undefined') {
    return '';
  }

  const params = new URLSearchParams(window.location.search);
  return params.get('ref') || params.get('code') || params.get('discount') || '';
}

function getSavedLanguage() {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  return normalizeLanguage(window.localStorage.getItem(LOCAL_LANGUAGE_KEY) || DEFAULT_LANGUAGE);
}

function getSavedVolume() {
  if (typeof window === 'undefined') {
    return 0.4;
  }

  const savedVolume = Number(window.localStorage.getItem(LOCAL_VOLUME_KEY));
  return Number.isFinite(savedVolume) ? Math.min(Math.max(savedVolume, 0), 1) : 0.4;
}

function getSavedMuted() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(LOCAL_MUTED_KEY) === 'true';
}

function getSavedPaused() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(LOCAL_PLAYBACK_KEY) === 'paused';
}

function normalizeLanguage(language) {
  const rawLanguage = String(language || '').trim();
  return languageAliases[rawLanguage] || (languages.includes(rawLanguage) ? rawLanguage : DEFAULT_LANGUAGE);
}

function getCopy(language) {
  const code = languageCodes[normalizeLanguage(language)] || 'de';
  const englishFallback = code === 'de'
    ? {}
    : {
        ...(labelsByCode.en || {}),
        ...(notificationLabelsByCode.en || {}),
      };
  return {
    ...labelsByCode.de,
    ...notificationLabelsByCode.de,
    ...englishFallback,
    ...(labelsByCode[code] || {}),
    ...(notificationLabelsByCode[code] || {}),
    ...getI18nExtensionLabels(code),
  };
}

function getLocalizedContent(language) {
  return contentByCode[languageCodes[normalizeLanguage(language)] || 'de'] || contentByCode.de;
}

function isValidDiscountCode(code) {
  return /^[a-z0-9_-]{3,24}$/i.test(String(code || '').trim());
}

function normalizeInstagramProfile(value) {
  const raw = String(value || '').trim();

  if (!raw) {
    return '';
  }

  let candidate = raw;

  if (raw.startsWith('@')) {
    candidate = raw.slice(1);
  } else {
    try {
      const url = new URL(raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`);
      const hostname = url.hostname.toLowerCase();

      if (hostname !== 'instagram.com' && hostname !== 'www.instagram.com') {
        return '';
      }

      candidate = url.pathname.split('/').filter(Boolean)[0] || '';
    } catch {
      candidate = raw.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/^instagram\.com\//i, '');
    }
  }

  candidate = candidate.replace(/^@+/, '').replace(/^\/+|\/+$/g, '').split(/[/?#]/)[0];

  if (!/^[a-z0-9._]{1,30}$/i.test(candidate)) {
    return '';
  }

  return `@${candidate}`;
}

function isValidInstagramProfile(value) {
  return !String(value || '').trim() || Boolean(normalizeInstagramProfile(value));
}

function instagramProfileToHandle(value) {
  return normalizeInstagramProfile(value);
}

function instagramProfileToUrl(value) {
  const handle = instagramProfileToHandle(value);
  return handle ? `https://www.instagram.com/${handle.slice(1)}/` : '';
}

function readSessionToken() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(LOCAL_SESSION_KEY) || '';
}

async function requestProtectedAcademyVideoUrl(fileName) {
  const safeFileName = String(fileName || '').trim();
  const token = readSessionToken();

  if (!safeFileName) {
    return '';
  }

  if (!token) {
    throw new Error('Bitte zuerst einloggen, um Academy-Videos abzuspielen.');
  }

  const cacheKey = `${token}:${safeFileName}`;
  const cached = academyVideoUrlCache.get(cacheKey);

  if (cached?.url && cached.expiresAt > Date.now() + 30_000) {
    return cached.url;
  }

  const response = await fetch(`${PROTECTED_VIDEO_ROUTE}?file=${encodeURIComponent(safeFileName)}&sign=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Video konnte nicht vorbereitet werden.');
  }

  const data = await response.json();
  const url = String(data.url || '');
  const expiresAt = Number(data.expires || 0) * 1000;

  if (!url || !expiresAt) {
    throw new Error('Video-Link konnte nicht erstellt werden.');
  }

  academyVideoUrlCache.set(cacheKey, { url, expiresAt });
  return url;
}

function useProtectedAcademyVideoUrl(fileName) {
  const [videoState, setVideoState] = useState({ fileName: '', url: '', error: '' });
  const safeFileName = String(fileName || '').trim();

  useEffect(() => {
    let active = true;
    const currentFileName = String(fileName || '').trim();

    if (!currentFileName) {
      Promise.resolve().then(() => {
        if (active) {
          setVideoState({ fileName: '', url: '', error: '' });
        }
      });
      return () => {
        active = false;
      };
    }

    requestProtectedAcademyVideoUrl(currentFileName)
      .then((url) => {
        if (active) {
          setVideoState({ fileName: currentFileName, url, error: '' });
        }
      })
      .catch((error) => {
        if (active) {
          setVideoState({ fileName: currentFileName, url: '', error: error.message || 'Video konnte nicht geladen werden.' });
        }
      });

    return () => {
      active = false;
    };
  }, [fileName]);

  const stateIsCurrent = videoState.fileName === safeFileName;

  return {
    videoUrl: stateIsCurrent ? videoState.url : '',
    videoError: stateIsCurrent ? videoState.error : '',
    videoLoading: Boolean(safeFileName && (!stateIsCurrent || (!videoState.url && !videoState.error))),
  };
}

function writeSessionToken(token) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCAL_SESSION_KEY, token);
  }
}

function clearSavedSession() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(LOCAL_SESSION_KEY);
  }
}

function dedupePartners(partners) {
  const partnerMap = new Map();

  partners.forEach((partner) => {
    const key = (partner.email || partner.id).toLowerCase();
    const currentPartner = partnerMap.get(key);

    if (!currentPartner || (currentPartner.status !== 'approved' && partner.status === 'approved')) {
      partnerMap.set(key, partner);
    }
  });

  return Array.from(partnerMap.values());
}

function normalizePartner(record) {
  const registrationLog = record.registrationLog || {};
  const approvalLog = record.approvalLog || {};
  const emailLog = record.emailLog || {};
  const notificationPrefs = record.notificationPrefs || {};
  const career = calculateAquaCareer(record.aquaPoints ?? record.points ?? 0);
  const academyProgress = normalizeAcademyProgress(record.academyProgress);

  return {
    id: String(record.id || record.email || crypto.randomUUID()),
    firstName: record.firstName || record.first_name || record.firstname || '',
    lastName: record.lastName || record.last_name || record.lastname || '',
    email: record.email || '',
    whatsapp: record.whatsapp || record.phone || '',
    discountCode: record.discountCode || record.discount_code || '',
    city: record.city || '',
    status: record.status || 'pending',
    role: record.role || 'partner',
    adminBadge: record.adminBadge || '',
    isFounderAdmin: Boolean(record.isFounderAdmin),
    language: normalizeLanguage(record.preferredLanguage || record.preferred_language || record.language || DEFAULT_LANGUAGE),
    preferredLanguage: languageCodes[normalizeLanguage(record.preferredLanguage || record.preferred_language || record.language || DEFAULT_LANGUAGE)] || 'de',
    profileImageUrl: record.profileImageUrl || '',
    instagramProfile: normalizeInstagramProfile(record.instagramProfile || record.instagram || record.socialProfile?.instagram || ''),
    instagramVisible: record.instagramVisible !== false && record.socialProfile?.instagramVisible !== false,
    aquaPoints: toAquaPoints(record.aquaPoints ?? record.points ?? career.points),
    aquaLevel: record.aquaLevel || record.level || career.level,
    aquaNextLevel: record.aquaNextLevel || career.nextLevel,
    aquaNextLevelPoints: record.aquaNextLevelPoints ?? career.nextLevelPoints,
    aquaPointsToNextLevel: record.aquaPointsToNextLevel ?? career.pointsToNextLevel,
    aquaLevelProgress: record.aquaLevelProgress ?? career.progress,
    aquaLastUpdatedAt: record.aquaLastUpdatedAt || record.lastUpdatedAt || '',
    aquaUpdatedBy: record.aquaUpdatedBy || record.updatedBy || '',
    teamName: record.teamName || '',
    teamPartnerCount: toPartnerCount(record.teamPartnerCount ?? record.currentTeamCount ?? 0),
    teamTargetPartnerCount: toPartnerCount(record.teamTargetPartnerCount ?? record.teamTargetCount ?? 10),
    teamLongTermTargetPartnerCount: toPartnerCount(record.teamLongTermTargetPartnerCount ?? record.teamLongTermTargetCount ?? 100),
    teamNewPartnersSinceLastUpdate: toPartnerCount(record.teamNewPartnersSinceLastUpdate ?? 0),
    teamGrowthPercent: Number(record.teamGrowthPercent ?? 0),
    teamProgress: Number(record.teamProgress ?? 0),
    teamLongTermProgress: Number(record.teamLongTermProgress ?? 0),
    teamLastUpdatedAt: record.teamLastUpdatedAt || '',
    teamUpdatedBy: record.teamUpdatedBy || '',
    teamScreenshot: record.teamScreenshot || null,
    teamScreenshotEvaluation: record.teamScreenshotEvaluation || null,
    teamGrowthHistory: Array.isArray(record.teamGrowthHistory) ? record.teamGrowthHistory : [],
    academyProgress,
    backofficeScreenshot: record.backofficeScreenshot || null,
    backofficeScreenshotEvaluation: record.backofficeScreenshotEvaluation || null,
    careerHistory: Array.isArray(record.careerHistory) ? record.careerHistory : [],
    levelEvents: Array.isArray(record.levelEvents) ? record.levelEvents : [],
    rank: record.rank || null,
    notificationPrefs: {
      emailUpdates: notificationPrefs.emailUpdates !== false,
      whatsappUpdates: Boolean(notificationPrefs.whatsappUpdates),
      language: normalizeLanguage(notificationPrefs.preferred_language || notificationPrefs.language || record.preferredLanguage || record.preferred_language || record.language || DEFAULT_LANGUAGE),
      preferred_language: languageCodes[normalizeLanguage(notificationPrefs.preferred_language || notificationPrefs.language || record.preferredLanguage || record.preferred_language || record.language || DEFAULT_LANGUAGE)] || 'de',
    },
    referrerCode: record.referrerCode || '',
    notes: record.notes || '',
    assignedTraining: record.assignedTraining || '',
    source: record.source || registrationLog.source || 'Live-Webseite',
    registrationLog: {
      source: record.source || registrationLog.source || 'Live-Webseite',
      sentAt: registrationLog.sentAt || record.createdAt || record.created_at || '',
      supabaseSaved: registrationLog.supabaseSaved ?? Boolean(record.id),
      supabaseSavedAt: registrationLog.supabaseSavedAt || record.createdAt || record.created_at || '',
    },
    approvalLog: {
      approved: approvalLog.approved || record.status === 'approved',
      approvedAt: approvalLog.approvedAt || '',
      approvedBy: approvalLog.approvedBy || '',
    },
    emailLog: {
      registrationEmailSent: Boolean(emailLog.registrationEmailSent),
      registrationEmailSentAt: emailLog.registrationEmailSentAt || '',
      registrationEmailError: emailLog.registrationEmailError || '',
      approvalEmailSent: Boolean(emailLog.approvalEmailSent),
      approvalEmailSentAt: emailLog.approvalEmailSentAt || '',
      approvalEmailError: emailLog.approvalEmailError || '',
      passwordResetRequested: Boolean(emailLog.passwordResetRequested),
      passwordResetEmailSent: Boolean(emailLog.passwordResetEmailSent),
      passwordResetEmailSentAt: emailLog.passwordResetEmailSentAt || '',
      passwordResetEmailError: emailLog.passwordResetEmailError || '',
      lastPasswordResetRequestedAt: emailLog.lastPasswordResetRequestedAt || '',
      reminderEmailSent: Boolean(emailLog.reminderEmailSent),
      reminderEmailSentAt: emailLog.reminderEmailSentAt || '',
      reminderEmailError: emailLog.reminderEmailError || '',
      reminderEmailSentBy: emailLog.reminderEmailSentBy || '',
    },
    testData: Boolean(record.testData),
    testDataReasons: record.testDataReasons || [],
    registrationType: record.registrationType || (record.testData ? 'Testdaten' : 'Echte Registrierung'),
    createdAt: record.createdAt || record.created_at || new Date().toISOString(),
  };
}

async function apiRequest(action, payload = {}, token = '') {
  const response = await fetch(API_ROUTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ action, ...payload }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Anfrage fehlgeschlagen.');
  }

  return data;
}

async function communityRequest(action, payload = {}, token = '') {
  const response = await fetch(COMMUNITY_API_ROUTE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ action, ...payload }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Community-Anfrage fehlgeschlagen.');
  }

  return data;
}

async function openAcademyDocument(documentItem) {
  if (!documentItem?.fileName && !documentItem?.href) {
    return;
  }

  const itemType = documentItem.type || 'pdf';
  const downloadsDirectly = ['docx', 'xlsx', 'pptx'].includes(itemType);

  if (itemType === 'external') {
    const externalUrl = new URL(documentItem.href);

    if (externalUrl.protocol !== 'https:') {
      throw new Error('Externe Links müssen HTTPS verwenden.');
    }

    window.open(externalUrl.toString(), '_blank', 'noopener,noreferrer');
    return;
  }

  const token = readSessionToken();

  if (!token) {
    throw new Error('Bitte zuerst einloggen, um Academy-Dokumente zu öffnen.');
  }

  const response = await fetch(`${PROTECTED_DOCUMENT_ROUTE}?file=${encodeURIComponent(documentItem.fileName)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Dokument konnte nicht geöffnet werden.');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  if (downloadsDirectly) {
    const downloadLink = window.document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = documentItem.fileName || 'academy-download';
    downloadLink.click();
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  window.setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
}

function getDocumentById(documentId) {
  return academyDocuments.find((documentItem) => documentItem.id === documentId);
}

function getDocumentsForModule(moduleId) {
  return academyDocuments.filter((documentItem) => documentItem.modules?.includes(moduleId));
}

function fileToAttachment(file) {
  if (!file) {
    return Promise.resolve(null);
  }

  if (file.size > 4 * 1024 * 1024) {
    return Promise.reject(new Error('Datei ist zu groß. Maximal 4 MB.'));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, dataUrl: reader.result });
    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden.'));
    reader.readAsDataURL(file);
  });
}

const CHAT_UPLOAD_MAX_BYTES = 10 * 1024 * 1024;
const CHAT_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const CHAT_FILE_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'zip'];
const CHAT_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
];
const CHAT_DANGEROUS_EXTENSIONS = ['exe', 'bat', 'cmd', 'com', 'js', 'mjs', 'sh', 'php', 'ps1', 'vbs', 'scr', 'jar'];
const CHAT_EMOJIS = ['😀', '😊', '🙌', '🔥', '💧', '🌱', '⭐', '🏆', '👏', '💪', '🚀', '✅', '💬', '📸', '📚', '🤝'];

function getFileExtension(fileName) {
  const cleanName = String(fileName || '').toLowerCase().split('?')[0].split('#')[0];
  return cleanName.includes('.') ? cleanName.split('.').pop() : '';
}

function formatFileSize(size) {
  const bytes = Number(size || 0);

  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
  }

  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${bytes} B`;
}

function validateChatFile(file, expectedKind) {
  if (!file) {
    return null;
  }

  const extension = getFileExtension(file.name);
  const fileType = String(file.type || '').toLowerCase();

  if (CHAT_DANGEROUS_EXTENSIONS.includes(extension)) {
    throw new Error('Dieser Dateityp ist aus Sicherheitsgründen nicht erlaubt.');
  }

  if (file.size > CHAT_UPLOAD_MAX_BYTES) {
    throw new Error('Datei ist zu groß. Maximal 10 MB.');
  }

  if (expectedKind === 'image') {
    if (!CHAT_IMAGE_TYPES.includes(fileType) && !['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
      throw new Error('Bitte lade ein Bild im Format JPG, PNG oder WEBP hoch.');
    }
    return 'image';
  }

  if (expectedKind === 'file') {
    if (!CHAT_FILE_TYPES.includes(fileType) && !CHAT_FILE_EXTENSIONS.includes(extension)) {
      throw new Error('Bitte lade eine erlaubte Datei hoch: PDF, DOC, DOCX, XLS, XLSX, TXT oder ZIP.');
    }
    return 'file';
  }

  throw new Error('Dateityp ist nicht erlaubt.');
}

function fileToCommunityAttachment(file, expectedKind) {
  if (!file) {
    return Promise.resolve(null);
  }

  const kind = validateChatFile(file, expectedKind);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      name: file.name,
      type: file.type,
      size: file.size,
      kind,
      dataUrl: reader.result,
    });
    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden.'));
    reader.readAsDataURL(file);
  });
}

function fileToProfileImage(file, copy) {
  if (!file) {
    return Promise.reject(new Error(copy.profileImageRequired));
  }

  const fileType = String(file.type || '').toLowerCase();

  if (!PROFILE_IMAGE_TYPES.includes(fileType)) {
    return Promise.reject(new Error(copy.profileImageInvalidType));
  }

  if (file.size > PROFILE_IMAGE_MAX_BYTES) {
    return Promise.reject(new Error(copy.profileImageTooLarge));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');

      if (!dataUrl.startsWith(`data:${fileType};base64,`)) {
        reject(new Error(copy.profileImageInvalidType));
        return;
      }

      resolve({
        name: file.name,
        type: fileType,
        size: file.size,
        dataUrl,
        uploadedAt: new Date().toISOString(),
      });
    };
    reader.onerror = () => reject(new Error('Profilbild konnte nicht gelesen werden.'));
    reader.readAsDataURL(file);
  });
}

function readBlobAsDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Profilbild konnte nicht verarbeitet werden.'));
    reader.readAsDataURL(blob);
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

async function loadProfileImageSource(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      let bitmap;

      try {
        bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      } catch {
        bitmap = await createImageBitmap(file);
      }

      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => bitmap.close(),
      };
    } catch {
      // Fallback fuer Browser, die den Dateityp nicht ueber createImageBitmap dekodieren.
    }
  }

  const objectUrl = URL.createObjectURL(file);
  const image = new Image();

  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error('Profilbild konnte nicht gelesen werden.'));
      image.src = objectUrl;
    });

    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      cleanup: () => URL.revokeObjectURL(objectUrl),
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

function drawProfileImage(canvas, source, width, height, jpegBackground = false) {
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d', { alpha: !jpegBackground });

  if (!context) {
    throw new Error('Profilbild konnte nicht optimiert werden.');
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';

  if (jpegBackground) {
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
  } else {
    context.clearRect(0, 0, width, height);
  }

  context.drawImage(source, 0, 0, width, height);
}

function formatProfileImageSize(bytes) {
  return `${Math.max(1, Math.round(Number(bytes || 0) / 1024))} KB`;
}

async function optimizeProfileImageFile(file, copy) {
  if (!file) {
    throw new Error(copy.profileImageRequired);
  }

  const fileType = String(file.type || '').toLowerCase();

  if (!PROFILE_IMAGE_TYPES.includes(fileType)) {
    throw new Error(copy.profileImageInvalidType);
  }

  if (file.size > PROFILE_IMAGE_UPDATE_MAX_INPUT_BYTES) {
    throw new Error(copy.profileImageUpdateTooLarge || 'Das Ausgangsbild darf maximal 5 MB groß sein.');
  }

  const image = await loadProfileImageSource(file);
  const canvas = document.createElement('canvas');

  try {
    if (!image.width || !image.height) {
      throw new Error('Profilbild konnte nicht gelesen werden.');
    }

    const initialScale = Math.min(1, PROFILE_IMAGE_UPDATE_MAX_EDGE / Math.max(image.width, image.height));
    let width = Math.max(1, Math.round(image.width * initialScale));
    let height = Math.max(1, Math.round(image.height * initialScale));
    let bestBlob = null;
    let outputType = 'image/webp';
    const qualities = [0.9, 0.86, 0.82, 0.78, 0.74, 0.72];

    for (let resizeAttempt = 0; resizeAttempt < 6; resizeAttempt += 1) {
      drawProfileImage(canvas, image.source, width, height, false);
      let webpSupported = true;

      for (const quality of qualities) {
        const candidate = await canvasToBlob(canvas, 'image/webp', quality);

        if (!candidate || candidate.type !== 'image/webp') {
          webpSupported = false;
          break;
        }

        if (!bestBlob || candidate.size < bestBlob.size) {
          bestBlob = candidate;
          outputType = 'image/webp';
        }

        if (candidate.size <= PROFILE_IMAGE_UPDATE_TARGET_BYTES) {
          bestBlob = candidate;
          break;
        }
      }

      if (!webpSupported) {
        drawProfileImage(canvas, image.source, width, height, true);

        for (const quality of qualities) {
          const candidate = await canvasToBlob(canvas, 'image/jpeg', quality);

          if (!candidate) {
            continue;
          }

          if (!bestBlob || candidate.size < bestBlob.size) {
            bestBlob = candidate;
            outputType = 'image/jpeg';
          }

          if (candidate.size <= PROFILE_IMAGE_UPDATE_TARGET_BYTES) {
            bestBlob = candidate;
            break;
          }
        }
      }

      if (bestBlob && bestBlob.size <= PROFILE_IMAGE_UPDATE_TARGET_BYTES) {
        break;
      }

      if (bestBlob && bestBlob.size <= PROFILE_IMAGE_UPDATE_MAX_STORED_BYTES && Math.max(width, height) <= 900) {
        break;
      }

      width = Math.max(1, Math.round(width * 0.88));
      height = Math.max(1, Math.round(height * 0.88));
    }

    if (!bestBlob || bestBlob.size > PROFILE_IMAGE_UPDATE_MAX_STORED_BYTES) {
      throw new Error(copy.profileImageOptimizationFailed || 'Das Bild konnte nicht unter 1 MB optimiert werden.');
    }

    const extension = outputType === 'image/webp' ? 'webp' : 'jpg';
    const baseName = String(file.name || 'profilbild').replace(/\.[^.]+$/, '').slice(0, 100) || 'profilbild';
    const dataUrl = await readBlobAsDataUrl(bestBlob);

    return {
      name: `${baseName}.${extension}`,
      type: outputType,
      size: bestBlob.size,
      dataUrl,
      width,
      height,
      originalSize: file.size,
      uploadedAt: new Date().toISOString(),
    };
  } finally {
    image.cleanup();
    canvas.width = 0;
    canvas.height = 0;
  }
}

function extractBackofficePointsFromText(text) {
  const source = String(text || '');
  const keywordMatch = source.match(/(?:punkte|points|gesamtpunkte|karrierepunkte|pv|score)[^\d-]{0,24}(\d{1,3}(?:[.\s]\d{3})*(?:[,.]\d{1,2})?|\d+(?:[,.]\d{1,2})?)/i);

  if (keywordMatch?.[1]) {
    return toAquaPoints(keywordMatch[1]);
  }

  const decimalMatches = [...source.matchAll(/\d{2,6}[,.]\d{1,2}/g)]
    .map((match) => toAquaPoints(match[0]))
    .filter((value) => value > 0 && value <= 150000);

  return decimalMatches.length > 0 ? Math.max(...decimalMatches) : null;
}

function extractTeamCountFromText(text) {
  const source = String(text || '');
  const keywordMatch = source.match(/(?:partnerzahl|team|teamgröße|teamgroesse|partner|struktur)[^\d-]{0,24}(\d{1,5})/i);

  if (keywordMatch?.[1]) {
    return toPartnerCount(keywordMatch[1]);
  }

  const integerMatches = [...source.matchAll(/\b\d{1,5}\b/g)]
    .map((match) => toPartnerCount(match[0]))
    .filter((value) => value > 0 && value < 100000);

  return integerMatches.length > 0 ? Math.max(...integerMatches) : null;
}

async function loadAdminPartners(token) {
  const data = await apiRequest('admin-list', {}, token);
  return dedupePartners((data.partners || []).map(normalizePartner));
}

async function loadAdminPartnerDetail(partnerId, token) {
  const data = await apiRequest('admin-detail', { id: partnerId }, token);
  return normalizePartner(data.partner);
}

async function loadAcademyRanking(token) {
  const data = await apiRequest('academy-ranking', {}, token);
  return (data.ranking || []).map(normalizePartner);
}

async function createPartnerRegistration(form, referrerCode) {
  const data = await apiRequest('register', {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    whatsapp: form.whatsapp.trim(),
    discountCode: form.discountCode.trim(),
    city: form.city.trim(),
    language: normalizeLanguage(form.language || DEFAULT_LANGUAGE),
    password: form.password,
    profileImage: form.profileImage,
    acceptedTerms: Boolean(form.acceptedLegal),
    acceptedPrivacy: Boolean(form.acceptedLegal),
    trainingContentConsent: Boolean(form.acceptedTrainingContent),
    emailUpdates: form.emailUpdates !== false,
    whatsappUpdates: Boolean(form.whatsappUpdates),
    notificationLanguage: normalizeLanguage(form.language || DEFAULT_LANGUAGE),
    referrerCode,
  });

  return normalizePartner(data.partner);
}

async function loginPartner(form) {
  const data = await apiRequest('login', {
    username: form.username.trim(),
    password: form.password,
  });

  return { partner: normalizePartner(data.partner), token: data.token };
}

async function requestPasswordReset(email) {
  return apiRequest('password-reset-request', { email: String(email || '').trim() });
}

async function loadSession(token) {
  const data = await apiRequest('session', {}, token);
  return normalizePartner(data.partner);
}

async function updatePartner(partnerId, changes, token) {
  const data = await apiRequest('admin-update', { id: partnerId, ...changes }, token);
  return normalizePartner(data.partner);
}

async function submitCareerScreenshot(changes, token) {
  const data = await apiRequest('career-screenshot', changes, token);
  return normalizePartner(data.partner);
}

async function submitTeamGrowthUpdate(changes, token) {
  const data = await apiRequest('team-growth-update', changes, token);
  return normalizePartner(data.partner);
}

async function approvePartner(partnerId, token) {
  const data = await apiRequest('admin-approve', { id: partnerId }, token);
  return normalizePartner(data.partner);
}

async function sendPartnerReminder(partnerId, token) {
  const data = await apiRequest('admin-send-reminder', { id: partnerId }, token);
  return normalizePartner(data.partner);
}

async function deletePartner(partnerId, token) {
  await apiRequest('admin-delete', { id: partnerId }, token);
}

async function cleanTestData(token) {
  return apiRequest('admin-clean-test-data', {}, token);
}

async function updateNotificationPreferences(preferences, token) {
  const data = await apiRequest('profile-notification-preferences', preferences, token);
  return normalizePartner(data.partner);
}

async function updateProfilePhoto(profileImage, remove, token, partnerId = '') {
  const data = await apiRequest('profile-photo-update', {
    profileImage,
    remove,
    ...(partnerId ? { id: partnerId } : {}),
  }, token);
  return normalizePartner(data.partner);
}

function buildCommunityActivityMap(state, ignoredPartnerId = '') {
  const activityMap = {};
  const remember = (partnerId, field, value) => {
    const id = String(partnerId || '').trim();

    if (!id || id === String(ignoredPartnerId || '') || !value) {
      return;
    }

    activityMap[id] = {
      ...(activityMap[id] || {}),
      [field]: latestIso(activityMap[id]?.[field], value),
    };
  };

  (state?.messages || []).forEach((message) => {
    remember(message.authorId || message.user_id, 'lastCommunityPostAt', message.createdAt || message.created_at);
  });
  (state?.questions || []).forEach((question) => {
    remember(question.authorId, 'lastCommunityPostAt', question.createdAt);
    (question.answers || []).forEach((answer) => {
      remember(answer.authorId, 'lastCommunityPostAt', answer.createdAt);
    });
  });
  (state?.presence || []).forEach((presence) => {
    remember(presence.partnerId, 'lastSeenAt', presence.lastSeenAt);
  });

  return activityMap;
}

function enrichPartnerActivity(partner, communityActivity = {}) {
  const lastCommunityPostAt = communityActivity.lastCommunityPostAt || '';
  const lastSeenAt = communityActivity.lastSeenAt || '';
  const lastActivityAt = latestIso(
    partner.academyProgress?.lastTrainingActivityAt,
    lastCommunityPostAt,
    lastSeenAt,
  );

  return {
    ...partner,
    lastCommunityPostAt,
    lastSeenAt,
    lastActivityAt,
    activityStatus: getPartnerActivityStatus(lastActivityAt),
  };
}

async function createAcademyUpdate(form, token) {
  return communityRequest('academy-update-create', form, token);
}

async function markAcademyUpdateRead(notificationId, token) {
  return communityRequest('notification-read', { notificationId }, token);
}

function withPartnerCode(url, code) {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}ref=${encodeURIComponent(code || DEFAULT_DISCOUNT_CODE)}`;
}

export default function HarborGlobalPartnerAcademy() {
  const [view, setView] = useState('auth');
  const [dashboardSection, setDashboardSection] = useState('start');
  const [authMode, setAuthMode] = useState('register');
  const [soundOn, setSoundOn] = useState(false);
  const [anthemOpen, setAnthemOpen] = useState(false);
  const [anthemBlocked, setAnthemBlocked] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [muted, setMuted] = useState(false);
  const [userPausedAnthem, setUserPausedAnthem] = useState(false);
  const [anthemAttempted, setAnthemAttempted] = useState(false);
  const [anthemWasPlayingBeforeVideo, setAnthemWasPlayingBeforeVideo] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [selectedModule, setSelectedModule] = useState(modules[0]);
  const [localOnboardingStepIds, setLocalOnboardingStepIds] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANGUAGE);
  const [partners, setPartners] = useState([]);
  const [rankingPartners, setRankingPartners] = useState([]);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [communitySummary, setCommunitySummary] = useState(communityStats);
  const [adminCommunityActivity, setAdminCommunityActivity] = useState({});
  const [academyUpdates, setAcademyUpdates] = useState([]);
  const [registrationForm, setRegistrationForm] = useState(initialRegistrationForm);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [registrationSent, setRegistrationSent] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState('');
  const [authReady, setAuthReady] = useState(false);
  const [referrerCode, setReferrerCode] = useState('');
  const [instagramVisible, setInstagramVisible] = useState(true);
  const audioRef = useRef(null);
  const soundOnRef = useRef(false);
  const userPausedAnthemRef = useRef(false);
  const isVideoActiveRef = useRef(false);
  const anthemWasPlayingBeforeVideoRef = useRef(false);
  const videoPriorityActiveRef = useRef(false);
  const activeVideoRef = useRef(null);
  const previousDashboardSectionRef = useRef(dashboardSection);
  const copy = useMemo(() => getCopy(selectedLanguage), [selectedLanguage]);
  const content = useMemo(() => getLocalizedContent(selectedLanguage), [selectedLanguage]);

  const pauseOtherVideos = useCallback((currentVideo) => {
    if (typeof document === 'undefined') {
      return;
    }

    document.querySelectorAll('video').forEach((video) => {
      if (video !== currentVideo && !video.paused && !video.ended) {
        video.pause();
      }
    });
  }, []);

  const pauseAllVideos = useCallback(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.querySelectorAll('video').forEach((video) => {
      if (!video.paused && !video.ended) {
        video.pause();
      }
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    window.setTimeout(() => {
      if (!isMounted) {
        return;
      }

      const savedLanguage = getSavedLanguage();
      const savedPaused = getSavedPaused();

      setVolume(getSavedVolume());
      setMuted(getSavedMuted());
      setUserPausedAnthem(savedPaused);
      setSelectedLanguage(savedLanguage);
      setRegistrationForm((current) => ({ ...current, language: savedLanguage }));
      setReferrerCode(getInitialReferralCode());
      setInstagramVisible(window.localStorage.getItem(LOCAL_INSTAGRAM_VISIBLE_KEY) !== 'false');
      userPausedAnthemRef.current = savedPaused;
    }, 0);

    return () => {
      isMounted = false;
    };
  }, []);

  const pauseAnthemForVideo = useCallback((videoIsPlaying = true) => {
    if (!videoPriorityActiveRef.current) {
      const anthemWasPlaying = soundOnRef.current && !userPausedAnthemRef.current;
      anthemWasPlayingBeforeVideoRef.current = anthemWasPlaying;
      setAnthemWasPlayingBeforeVideo(anthemWasPlaying);
    }

    videoPriorityActiveRef.current = true;
    isVideoActiveRef.current = true;
    setIsVideoActive(true);
    setIsVideoPlaying(videoIsPlaying);
    setAnthemBlocked(false);

    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (soundOnRef.current) {
      setSoundOn(false);
    }
  }, []);

  const markVideoPaused = useCallback(() => {
    if (!videoPriorityActiveRef.current) {
      return;
    }

    isVideoActiveRef.current = true;
    setIsVideoActive(true);
    setIsVideoPlaying(false);

    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const releaseVideoPriority = useCallback(() => {
    if (!videoPriorityActiveRef.current) {
      return;
    }

    const shouldResumeAnthem = anthemWasPlayingBeforeVideoRef.current && !userPausedAnthemRef.current;
    videoPriorityActiveRef.current = false;
    isVideoActiveRef.current = false;
    anthemWasPlayingBeforeVideoRef.current = false;
    activeVideoRef.current = null;
    setIsVideoActive(false);
    setIsVideoPlaying(false);
    setAnthemWasPlayingBeforeVideo(false);

    if (shouldResumeAnthem) {
      setAnthemBlocked(false);
      setSoundOn(true);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('login') === '1' || params.get('mode') === 'login') {
      window.setTimeout(() => setAuthMode('login'), 0);
    }
  }, []);

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  useEffect(() => {
    userPausedAnthemRef.current = userPausedAnthem;
  }, [userPausedAnthem]);

  useEffect(() => {
    isVideoActiveRef.current = isVideoActive;
  }, [isVideoActive]);

  useEffect(() => {
    anthemWasPlayingBeforeVideoRef.current = anthemWasPlayingBeforeVideo;
  }, [anthemWasPlayingBeforeVideo]);

  useEffect(() => {
    const isAcademyVideo = (target) => typeof HTMLVideoElement !== 'undefined' && target instanceof HTMLVideoElement;

    const handleVideoPlay = (event) => {
      if (isAcademyVideo(event.target)) {
        activeVideoRef.current = event.target;
        pauseOtherVideos(event.target);
        pauseAnthemForVideo(true);
      }
    };

    const handleVideoPause = (event) => {
      if (isAcademyVideo(event.target) && activeVideoRef.current === event.target && !event.target.ended) {
        markVideoPaused();
      }
    };

    const handleVideoEnd = (event) => {
      if (isAcademyVideo(event.target) && activeVideoRef.current === event.target) {
        releaseVideoPriority();
      }
    };

    document.addEventListener('play', handleVideoPlay, true);
    document.addEventListener('pause', handleVideoPause, true);
    document.addEventListener('ended', handleVideoEnd, true);
    document.addEventListener('emptied', handleVideoEnd, true);

    return () => {
      document.removeEventListener('play', handleVideoPlay, true);
      document.removeEventListener('pause', handleVideoPause, true);
      document.removeEventListener('ended', handleVideoEnd, true);
      document.removeEventListener('emptied', handleVideoEnd, true);
    };
  }, [markVideoPaused, pauseAnthemForVideo, pauseOtherVideos, releaseVideoPriority]);

  useEffect(() => {
    if (previousDashboardSectionRef.current !== dashboardSection) {
      previousDashboardSectionRef.current = dashboardSection;

      if (isVideoActiveRef.current) {
        pauseAllVideos();
        releaseVideoPriority();
      }
    }
  }, [dashboardSection, pauseAllVideos, releaseVideoPriority]);

  useEffect(() => {
    let isMounted = true;
    const token = readSessionToken();

    if (!token) {
      window.setTimeout(() => {
        if (isMounted) {
          setAuthReady(true);
        }
      }, 0);

      return () => {
        isMounted = false;
      };
    }

    loadSession(token)
      .then(async (partner) => {
        if (!isMounted) {
          return;
        }

        setCurrentPartner(partner);
        setLocalOnboardingStepIds([]);
        setSessionToken(token);
        setSelectedLanguage(normalizeLanguage(partner.language || getSavedLanguage()));
        setDashboardSection(partner.role === 'admin' ? 'admin' : 'start');
        setView('dashboard');

        if (partner.role === 'admin') {
          const adminPartners = await loadAdminPartners(token);
          if (isMounted) {
            setPartners(adminPartners);
            setRankingPartners(buildAcademyRanking(adminPartners, partner));
          }
        } else {
          const ranking = await loadAcademyRanking(token);
          if (isMounted) {
            setRankingPartners(ranking);
          }
        }
      })
      .catch(() => {
        clearSavedSession();
        setSessionToken('');
      })
      .finally(() => {
        if (isMounted) {
          setAuthReady(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_LANGUAGE_KEY, normalizeLanguage(selectedLanguage));
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_VOLUME_KEY, String(volume));
      window.localStorage.setItem(LOCAL_MUTED_KEY, String(muted));
    }

    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [muted, volume]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_INSTAGRAM_VISIBLE_KEY, String(instagramVisible));
    }
  }, [instagramVisible]);

  useEffect(() => {
    if (!sessionToken || !currentPartner) {
      return undefined;
    }

    let isActive = true;

    const loadCommunitySummary = async () => {
      try {
        const data = await communityRequest('community-state', {}, sessionToken);
        if (isActive && data.summary) {
          setCommunitySummary((current) => ({ ...current, ...data.summary }));
          setAcademyUpdates(data.academyUpdates || []);
          if (currentPartner.role === 'admin') {
            const nextActivity = buildCommunityActivityMap(data, currentPartner.id);
            setAdminCommunityActivity((current) => (
              JSON.stringify(current) === JSON.stringify(nextActivity) ? current : nextActivity
            ));
          }
        }
      } catch {
        if (isActive) {
          setCommunitySummary(communityStats);
          setAcademyUpdates([]);
          if (currentPartner.role === 'admin') {
            setAdminCommunityActivity({});
          }
        }
      }
    };

    loadCommunitySummary();
    const summaryInterval = window.setInterval(loadCommunitySummary, 12000);
    const heartbeatInterval = window.setInterval(() => {
      communityRequest('presence-heartbeat', {}, sessionToken).catch(() => {});
    }, 30000);

    return () => {
      isActive = false;
      window.clearInterval(summaryInterval);
      window.clearInterval(heartbeatInterval);
    };
  }, [currentPartner, sessionToken]);

  useEffect(() => {
    if (!currentPartner || anthemAttempted || !audioRef.current || isVideoActiveRef.current) {
      return;
    }

    setAnthemAttempted(true);

    if (userPausedAnthem) {
      return;
    }

    audioRef.current.volume = muted ? 0 : volume;
    audioRef.current.play()
      .then(() => {
        setSoundOn(true);
        setAnthemBlocked(false);
      })
      .catch(() => {
        setSoundOn(false);
        setAnthemBlocked(true);
      });
  }, [anthemAttempted, currentPartner, muted, userPausedAnthem, volume]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (soundOn) {
      audioRef.current.play()
        .then(() => setAnthemBlocked(false))
        .catch(() => {
          setSoundOn(false);
          setAnthemBlocked(true);
        });
      return;
    }

    audioRef.current.pause();
  }, [soundOn]);

  const overallProgress = useMemo(
    () => currentPartner?.academyProgress?.progressPercent || 0,
    [currentPartner?.academyProgress?.progressPercent],
  );

  const isAdmin = currentPartner?.role === 'admin';
  const canViewLeaderAnalytics = isLeaderAnalyticsPartner(currentPartner);
  const canViewAnalytics = isAdmin || canViewLeaderAnalytics;
  const visibleNavItems = useMemo(
    () => dashboardNavItems.filter((item) => (
      (!item.adminOnly || isAdmin)
      && (!item.analyticsOnly || canViewAnalytics)
    )),
    [canViewAnalytics, isAdmin],
  );
  const navBadges = useMemo(() => ({
    news: communitySummary.newsUnread || 0,
    modules: communitySummary.moduleUnread || 0,
    resources: communitySummary.resourceUnread || 0,
  }), [communitySummary.moduleUnread, communitySummary.newsUnread, communitySummary.resourceUnread]);
  const pendingPartners = partners.filter((partner) => partner.status === 'pending');
  const approvedPartners = partners.filter((partner) => partner.status === 'approved');
  const activityPartners = useMemo(
    () => partners.map((partner) => enrichPartnerActivity(partner, adminCommunityActivity[partner.id])),
    [adminCommunityActivity, partners],
  );
  const currentAcademyRanking = buildAcademyRanking(rankingPartners, currentPartner);
  const currentRankingEntry = currentAcademyRanking.find((item) => item.id === currentPartner?.id);

  const updateRegistrationField = (field, value) => {
    if (field === 'language') {
      setSelectedLanguage(normalizeLanguage(value));
    }

    setRegistrationForm((current) => ({ ...current, [field]: value }));
    setRegistrationError('');
  };

  const updateLoginField = (field, value) => {
    setLoginForm((current) => ({ ...current, [field]: value }));
    setLoginError('');
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setRegistrationError('');
    setLoginError('');
    setAdminMessage('');
  };

  const updateSelectedLanguage = (language) => {
    const normalized = normalizeLanguage(language);
    setSelectedLanguage(normalized);
    setRegistrationForm((current) => ({ ...current, language: normalized }));
  };

  const handleRegistration = async (event) => {
    event.preventDefault();
    setRegistrationError('');

    const requiredRegistrationValues = [
      registrationForm.firstName,
      registrationForm.lastName,
      registrationForm.email,
      registrationForm.whatsapp,
      registrationForm.discountCode,
      registrationForm.city,
      registrationForm.language,
      registrationForm.password,
      registrationForm.passwordRepeat,
    ];
    const missingField = requiredRegistrationValues.some((value) => !String(value).trim());

    if (missingField) {
      setRegistrationError('Bitte fülle alle Felder aus.');
      return;
    }

    if (!registrationForm.discountCode.trim()) {
      setRegistrationError(copy.requiredCode);
      return;
    }

    if (!isValidDiscountCode(registrationForm.discountCode)) {
      setRegistrationError(copy.invalidCode);
      return;
    }

    if (!registrationForm.profileImage?.dataUrl) {
      setRegistrationError(copy.profileImageRequired);
      return;
    }

    if (registrationForm.password !== registrationForm.passwordRepeat) {
      setRegistrationError('Die Passwörter stimmen nicht überein.');
      return;
    }

    if (!registrationForm.acceptedLegal) {
      setRegistrationError(copy.legalConsentError);
      return;
    }

    if (!registrationForm.acceptedTrainingContent) {
      setRegistrationError(copy.trainingContentConsentError);
      return;
    }

    setRegistrationLoading(true);

    try {
      await createPartnerRegistration(registrationForm, referrerCode);
      setRegistrationForm({ ...initialRegistrationForm, language: selectedLanguage });
      setRegistrationSent(true);
    } catch (error) {
      setRegistrationError(error.message || 'Registrierung konnte nicht gesendet werden.');
    } finally {
      setRegistrationLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError('');

    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setLoginError('Bitte Benutzername und Passwort eingeben.');
      return;
    }

    setLoginLoading(true);

    try {
      const { partner, token } = await loginPartner(loginForm);
      setCurrentPartner(partner);
      setLocalOnboardingStepIds([]);
      setSessionToken(token);
      writeSessionToken(token);
      setSelectedLanguage(normalizeLanguage(partner.language || selectedLanguage));

      if (partner.role === 'admin') {
        setDashboardSection('admin');
        const adminPartners = await loadAdminPartners(token);
        setPartners(adminPartners);
        setRankingPartners(buildAcademyRanking(adminPartners, partner));
      } else {
        setDashboardSection('start');
        setPartners([]);
        setRankingPartners(await loadAcademyRanking(token));
      }

      setView('dashboard');
    } catch (error) {
      setLoginError(error.message || 'Login konnte nicht geprüft werden.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleApprovePartner = async (partnerId) => {
    setAdminMessage('');
    const targetPartner = partners.find((partner) => partner.id === partnerId);

    if (!confirmAdminAction({
      title: 'Partner freigeben',
      target: adminPartnerLabel(targetPartner, partnerId),
      consequences: [
        'Der Partner kann sich nach der Freigabe einloggen.',
        'Falls noch keine Freigabe-E-Mail versendet wurde, kann eine Freigabe-E-Mail ausgelöst werden.',
        'Der Partnerstatus wird dauerhaft geändert.',
      ],
    })) {
      return false;
    }

    try {
      await approvePartner(partnerId, sessionToken);
      const adminPartners = await loadAdminPartners(sessionToken);
      setPartners(adminPartners);
      setRankingPartners(buildAcademyRanking(adminPartners, currentPartner));
      setAdminMessage('Partner wurde freigegeben und kann sich jetzt einloggen.');
      return true;
    } catch (error) {
      setAdminMessage(error.message || 'Partner konnte nicht freigegeben werden.');
      return false;
    }
  };

  const handleUpdatePartner = async (partnerId, changes) => {
    setAdminMessage('');
    const targetPartner = partners.find((partner) => partner.id === partnerId);

    if (!confirmAdminPartnerUpdate(targetPartner, { ...changes, id: partnerId })) {
      return false;
    }

    try {
      await updatePartner(partnerId, changes, sessionToken);
      const adminPartners = await loadAdminPartners(sessionToken);
      setPartners(adminPartners);
      setRankingPartners(buildAcademyRanking(adminPartners, currentPartner));
      setAdminMessage('Partnerdaten wurden gespeichert.');
      return true;
    } catch (error) {
      setAdminMessage(error.message || 'Partnerdaten konnten nicht gespeichert werden.');
      return false;
    }
  };

  const handleCareerScreenshotSubmit = async ({ attachment, points, detectedFromScreenshot }) => {
    const updatedPartner = await submitCareerScreenshot({
      backofficeScreenshot: attachment,
      aquaPoints: points,
      detectedFromScreenshot,
    }, sessionToken);

    setCurrentPartner(updatedPartner);

    if (updatedPartner.role === 'admin') {
      const adminPartners = await loadAdminPartners(sessionToken);
      setPartners(adminPartners);
      setRankingPartners(buildAcademyRanking(adminPartners, updatedPartner));
    } else {
      setRankingPartners(await loadAcademyRanking(sessionToken));
    }

    return updatedPartner;
  };

  const handleTeamGrowthSubmit = async ({ attachment, currentCount, targetCount, longTermTargetCount, detectedFromScreenshot }) => {
    const updatedPartner = await submitTeamGrowthUpdate({
      teamScreenshot: attachment,
      teamPartnerCount: currentCount,
      teamTargetPartnerCount: targetCount,
      teamLongTermTargetPartnerCount: longTermTargetCount,
      detectedFromScreenshot,
    }, sessionToken);

    setCurrentPartner(updatedPartner);

    if (updatedPartner.role === 'admin') {
      const adminPartners = await loadAdminPartners(sessionToken);
      setPartners(adminPartners);
      setRankingPartners(buildAcademyRanking(adminPartners, updatedPartner));
    } else {
      setRankingPartners(await loadAcademyRanking(sessionToken));
    }

    return updatedPartner;
  };

  const handleSendPartnerReminder = async (partnerId) => {
    setAdminMessage('');
    const targetPartner = partners.find((partner) => partner.id === partnerId);

    if (!confirmAdminAction({
      title: 'Partner-Reminder senden',
      target: adminPartnerLabel(targetPartner, partnerId),
      consequences: [
        'Eine Erinnerung kann per E-Mail an den Partner gesendet werden.',
        'Der Versandstatus wird dauerhaft im Partner-Log gespeichert.',
        'Ein versendeter Reminder kann nicht zurückgerufen werden.',
      ],
    })) {
      return false;
    }

    try {
      await sendPartnerReminder(partnerId, sessionToken);
      const adminPartners = await loadAdminPartners(sessionToken);
      setPartners(adminPartners);
      setRankingPartners(buildAcademyRanking(adminPartners, currentPartner));
      setAdminMessage('Partner-Reminder wurde ausgelöst. Versandstatus steht im Partner-Log.');
      return true;
    } catch (error) {
      setAdminMessage(error.message || 'Partner-Reminder konnte nicht gesendet werden.');
      return false;
    }
  };

  const handleDeletePartner = async (partnerId) => {
    setAdminMessage('');
    const targetPartner = partners.find((partner) => partner.id === partnerId);

    if (!confirmAdminAction({
      title: 'Partner endgültig löschen',
      target: adminPartnerLabel(targetPartner, partnerId),
      consequences: [
        'Der Partnerdatensatz wird aus der Partnerverwaltung gelöscht.',
        'Login, Profil, Status, Logs und Metadaten dieses Partners sind danach nicht mehr über die Academy verfügbar.',
        'Diese Aktion ist ohne Backup oder manuelle Wiederherstellung nicht rückgängig zu machen.',
      ],
      requiredInput: ADMIN_DELETE_CONFIRMATION,
    })) {
      return false;
    }

    try {
      await deletePartner(partnerId, sessionToken);
      const adminPartners = await loadAdminPartners(sessionToken);
      setPartners(adminPartners);
      setRankingPartners(buildAcademyRanking(adminPartners, currentPartner));
      setAdminMessage('Partner wurde geloescht.');
      return true;
    } catch (error) {
      setAdminMessage(error.message || 'Partner konnte nicht geloescht werden.');
      return false;
    }
  };

  const handleCleanTestData = async () => {
    setAdminMessage('');

    if (!confirmAdminAction({
      title: 'Erkannte Testdaten endgültig bereinigen',
      consequences: [
        'Alle automatisch erkannten Testpartner werden aus der Partnerverwaltung gelöscht.',
        'Echte Registrierungen sollen serverseitig ausgeschlossen bleiben.',
        'Die Löschung ist ohne Backup nicht rückgängig zu machen.',
      ],
      requiredInput: ADMIN_DELETE_CONFIRMATION,
    })) {
      return false;
    }

    try {
      const result = await cleanTestData(sessionToken);
      const adminPartners = await loadAdminPartners(sessionToken);
      setPartners(adminPartners);
      setRankingPartners(buildAcademyRanking(adminPartners, currentPartner));
      setAdminMessage(`${result.deleted || 0} erkannte Testdatensaetze wurden bereinigt. Echte Registrierungen wurden nicht geloescht.`);
      return true;
    } catch (error) {
      setAdminMessage(error.message || 'Testdaten konnten nicht bereinigt werden.');
      return false;
    }
  };

  const handleCreateAcademyUpdate = async (form) => {
    setAdminMessage('');

    try {
      const result = await createAcademyUpdate(form, sessionToken);
      if (result.state?.summary) {
        setCommunitySummary((current) => ({ ...current, ...result.state.summary }));
      }
      if (result.state?.academyUpdates) {
        setAcademyUpdates(result.state.academyUpdates);
      }
      setAdminMessage(`${copy.academyUpdateSent} ${copy.recipientCount}: ${result.recipientCount || 0}. ${copy.emailSentCount}: ${result.emailSentCount || 0}. ${copy.emailFailedCount}: ${result.emailFailedCount || 0}.`);
      return result;
    } catch (error) {
      setAdminMessage(error.message || 'Neuigkeit konnte nicht gespeichert werden.');
      throw error;
    }
  };

  const handleMarkUpdateRead = async (notificationId) => {
    try {
      const result = await markAcademyUpdateRead(notificationId, sessionToken);
      if (result.state?.summary) {
        setCommunitySummary((current) => ({ ...current, ...result.state.summary }));
      }
      if (result.state?.academyUpdates) {
        setAcademyUpdates(result.state.academyUpdates);
      }
    } catch {
      setAcademyUpdates((current) => current.map((item) => (item.id === notificationId ? { ...item, read: true, badgeStatus: copy.readStatus } : item)));
    }
  };

  const handleUpdateNotificationPreferences = async (preferences) => {
    const partner = await updateNotificationPreferences(preferences, sessionToken);
    setCurrentPartner(partner);
    setSelectedLanguage(normalizeLanguage(partner.language || partner.notificationPrefs?.language || selectedLanguage));
    return partner;
  };

  const handleUpdateProfilePhoto = async (profileImage, remove = false) => {
    const partner = await updateProfilePhoto(profileImage, remove, sessionToken);
    setCurrentPartner(partner);
    setRankingPartners((current) => current.map((item) => (item.id === partner.id ? { ...item, profileImageUrl: partner.profileImageUrl } : item)));
    return partner;
  };

  const handleAdminProfilePhotoChange = async (partnerId, profileImage, remove = false) => {
    setAdminMessage('');

    try {
      const partner = await updateProfilePhoto(profileImage, remove, sessionToken, partnerId);
      const adminPartners = await loadAdminPartners(sessionToken);
      setPartners(adminPartners);
      setRankingPartners(buildAcademyRanking(adminPartners, currentPartner));
      setAdminMessage(remove ? 'Profilbild wurde entfernt.' : 'Profilbild wurde gespeichert.');
      return partner;
    } catch (error) {
      setAdminMessage(error.message || 'Profilbild konnte nicht gespeichert werden.');
      throw error;
    }
  };

  const handleLoadAdminPartnerDetail = useCallback(
    (partnerId) => loadAdminPartnerDetail(partnerId, sessionToken),
    [sessionToken],
  );

  const handleAnthemPlay = () => {
    if (isVideoActiveRef.current) {
      setAnthemOpen(true);
      setAnthemBlocked(false);
      setSoundOn(false);

      if (audioRef.current) {
        audioRef.current.pause();
      }

      return;
    }

    setUserPausedAnthem(false);
    userPausedAnthemRef.current = false;
    setAnthemBlocked(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_PLAYBACK_KEY, 'playing');
    }
    setSoundOn(true);
  };

  const handleAnthemPause = () => {
    setUserPausedAnthem(true);
    userPausedAnthemRef.current = true;
    anthemWasPlayingBeforeVideoRef.current = false;
    setAnthemWasPlayingBeforeVideo(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_PLAYBACK_KEY, 'paused');
    }
    setSoundOn(false);
  };

  const handleAnthemMute = (nextMuted) => {
    setMuted(nextMuted);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCAL_MUTED_KEY, String(nextMuted));
    }
  };

  const handleDashboardSectionChange = useCallback((section) => {
    if (section !== dashboardSection) {
      if (isVideoActiveRef.current) {
        pauseAllVideos();
        releaseVideoPriority();
      }

    }

    setDashboardSection(section);
  }, [dashboardSection, pauseAllVideos, releaseVideoPriority]);

  const handleMarkOnboardingStep = useCallback((stepId) => {
    setLocalOnboardingStepIds((current) => (current.includes(stepId) ? current : [...current, stepId]));
  }, []);

  const handleLogout = () => {
    pauseAllVideos();
    releaseVideoPriority();
    clearSavedSession();
    setCurrentPartner(null);
    setSessionToken('');
    setPartners([]);
    setCommunitySummary(communityStats);
    setAdminCommunityActivity({});
    setAcademyUpdates([]);
    setLocalOnboardingStepIds([]);
    setSoundOn(false);
    setAnthemAttempted(false);
    setAnthemBlocked(false);
    setAnthemOpen(false);
    setLoginForm(initialLoginForm);
    setView('auth');
    switchAuthMode('login');
  };

  if (!authReady) {
    return (
      <Shell>
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="text-center">
            <BrandLogo className="mx-auto h-32 w-auto object-contain" />
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-yellow-300">Harbor Global</p>
            <p className="mt-2 text-white/55">{copy.accessChecking}</p>
          </div>
        </div>
      </Shell>
    );
  }

  if (view === 'auth') {
    return (
      <Shell>
        <div className="relative grid min-h-screen lg:grid-cols-2">
          <div className="flex items-center justify-center p-5 md:p-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl">
              <Brand />
              <BrandLogo className="mt-10 w-80 max-w-full object-contain md:w-96" />
              <h1 className="mt-10 text-4xl font-black leading-tight md:text-6xl">{copy.heroTitle}</h1>
              <p className="mt-5 text-lg text-white/60">
                {copy.heroText}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href={CALENDLY_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-5 py-3 font-black text-black shadow-lg shadow-yellow-500/25 transition hover:bg-yellow-300">
                  <CalendarDays size={18} /> {copy.secureFreeCall}
                </a>
                <a href={CALENDLY_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-yellow-300/25 bg-white/10 px-5 py-3 font-bold text-yellow-50 transition hover:bg-yellow-400/15">
                  <ShieldCheck size={18} /> {copy.bookWaterConsultation}
                </a>
              </div>
              <div className="mt-8 grid gap-3 md:grid-cols-3">
                <MiniFeature icon={Lock} title={copy.protectedTitle} text={copy.protectedText} />
                <MiniFeature icon={Globe2} title={copy.multilingualTitle} text={copy.multilingualText} />
                <MiniFeature icon={ShieldCheck} title={copy.adminApprovalTitle} text={`${pendingPartners.length} ${copy.waits}`} />
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-center p-5 md:p-10">
            <Card className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.07] text-white shadow-2xl backdrop-blur-xl">
              <CardContent className="p-6 md:p-8">
                <div className="mb-7 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/35 p-1">
                  <AuthTab active={authMode === 'register'} onClick={() => switchAuthMode('register')}>
                    {copy.register}
                  </AuthTab>
                  <AuthTab active={authMode === 'login'} onClick={() => switchAuthMode('login')}>
                    {copy.login}
                  </AuthTab>
                </div>

                {authMode === 'register' && !registrationSent && (
                  <RegistrationForm
                    form={registrationForm}
                    error={registrationError}
                    loading={registrationLoading}
                    copy={copy}
                    onSubmit={handleRegistration}
                    onFieldChange={updateRegistrationField}
                    onAdminAccess={() => switchAuthMode('admin')}
                  />
                )}

                {authMode === 'register' && registrationSent && <RegistrationSuccess copy={copy} onLogin={() => switchAuthMode('login')} />}

                {authMode === 'login' && (
                  <LoginForm
                    form={loginForm}
                    error={loginError}
                    loading={loginLoading}
                    copy={copy}
                    onSubmit={handleLogin}
                    onFieldChange={updateLoginField}
                  />
                )}

                {authMode === 'admin' && (
                  <LoginForm
                    form={loginForm}
                    error={loginError}
                    loading={loginLoading}
                    copy={copy}
                    admin
                    onSubmit={handleLogin}
                    onFieldChange={updateLoginField}
                    onBack={() => switchAuthMode('login')}
                  />
                )}

              </CardContent>
            </Card>
          </div>
        </div>
        <div className="relative px-5 pb-6 md:px-10">
          <FooterInstagramLink />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <audio ref={audioRef} src={ACADEMY_SOUND_URL} loop preload="none" />
      <div className="relative flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-white/10 bg-black/40 p-6 backdrop-blur-xl lg:flex">
          <Brand />
          <nav className="mt-10 space-y-2 text-sm">
            {visibleNavItems.map(({ id, labelKey, label, icon: Icon, href }) => {
              const navLabel = copy[labelKey] || label;
              const badge = navBadges[id] || 0;
              return href ? (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-white/75 transition hover:bg-yellow-400 hover:text-black"
                >
                  <Icon size={18} /> {navLabel} <ExternalLink className="ml-auto" size={14} />
                </a>
              ) : (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleDashboardSectionChange(id)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 transition ${dashboardSection === id ? 'bg-yellow-400 text-black' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}
                >
                  <Icon size={18} /> {navLabel}
                  {badge > 0 && (
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-black ${dashboardSection === id ? 'bg-black/20 text-black' : 'bg-yellow-400 text-black'}`}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto rounded-3xl border border-yellow-400/20 bg-yellow-400/10 p-4">
            <div className="mb-2 flex items-center gap-2 font-semibold text-yellow-200">
              <UserCheck size={16} /> {approvedPartners.length} {copy.approvedShort}
            </div>
            <p className="text-xs text-white/55">{pendingPartners.length} {copy.partnerWaiting}</p>
          </div>
        </aside>

        <main className="min-w-0 max-w-full flex-1 space-y-5 overflow-x-hidden p-3 sm:p-4 md:space-y-6 md:p-8">
          <Header
            partner={currentPartner}
            soundOn={soundOn}
            onAnthemPlay={handleAnthemPlay}
            onAnthemPause={handleAnthemPause}
            anthemOpen={anthemOpen}
            setAnthemOpen={setAnthemOpen}
            anthemBlocked={anthemBlocked}
            volume={volume}
            setVolume={setVolume}
            muted={muted}
            setMuted={handleAnthemMute}
            userPausedAnthem={userPausedAnthem}
            isVideoActive={isVideoActive}
            isVideoPlaying={isVideoPlaying}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={updateSelectedLanguage}
            copy={copy}
            onLogout={handleLogout}
          />

          <MobileDashboardNav items={visibleNavItems} activeSection={dashboardSection} setDashboardSection={handleDashboardSectionChange} copy={copy} badges={navBadges} />

          {dashboardSection === 'start' && (
            <StartCenterSection
              partner={currentPartner}
              copy={copy}
              selectedLanguage={selectedLanguage}
              localOnboardingStepIds={localOnboardingStepIds}
              onMarkOnboardingStep={handleMarkOnboardingStep}
              onNavigate={handleDashboardSectionChange}
              academyUpdates={academyUpdates}
              isAdmin={isAdmin}
              isLeader={canViewLeaderAnalytics}
              partners={isAdmin ? activityPartners : []}
              pendingPartners={pendingPartners}
            />
          )}

          {dashboardSection === 'dashboard' && (
            <DashboardHome
              partner={currentPartner}
              overallProgress={overallProgress}
              partners={partners}
              copy={copy}
              rankingPartners={rankingPartners}
              communitySummary={communitySummary}
              localOnboardingStepIds={localOnboardingStepIds}
              onMarkOnboardingStep={handleMarkOnboardingStep}
              onNavigate={handleDashboardSectionChange}
              academyUpdates={academyUpdates}
              selectedLanguage={selectedLanguage}
              isAdmin={isAdmin}
              isLeader={canViewLeaderAnalytics}
            />
          )}

          {dashboardSection === 'success' && (
            <SuccessCenterSection
              partner={currentPartner}
              academyUpdates={academyUpdates}
              localOnboardingStepIds={localOnboardingStepIds}
              onNavigate={handleDashboardSectionChange}
              isAdmin={isAdmin}
              isLeader={canViewLeaderAnalytics}
              partners={isAdmin ? activityPartners : []}
              pendingPartners={pendingPartners}
              selectedLanguage={selectedLanguage}
              copy={copy}
            />
          )}

          {dashboardSection === 'growth' && (
            <GrowthCenterSection
              partner={currentPartner}
              academyUpdates={academyUpdates}
              onNavigate={handleDashboardSectionChange}
              isAdmin={isAdmin}
              isLeader={canViewLeaderAnalytics}
              selectedLanguage={selectedLanguage}
              copy={copy}
            />
          )}

          {dashboardSection === 'campaigns' && (
            <CampaignCenterSection
              partner={currentPartner}
              onNavigate={handleDashboardSectionChange}
              isAdmin={isAdmin}
              isLeader={canViewLeaderAnalytics}
              selectedLanguage={selectedLanguage}
              copy={copy}
            />
          )}

          {dashboardSection === 'media' && (
            <MediaCenterSection
              isAdmin={isAdmin}
              isLeader={canViewLeaderAnalytics}
              selectedLanguage={selectedLanguage}
              copy={copy}
            />
          )}

          {dashboardSection === 'career' && <CareerSection partner={currentPartner} rankingPartners={rankingPartners} copy={copy} onScreenshotSubmit={handleCareerScreenshotSubmit} onTeamGrowthSubmit={handleTeamGrowthSubmit} />}

          {dashboardSection === 'gamification' && (
            <GamificationPrototype partner={currentPartner} onNavigate={handleDashboardSectionChange} />
          )}

          {dashboardSection === 'leader' && (
            <LeaderDashboardPreview partner={currentPartner} onNavigate={handleDashboardSectionChange} />
          )}

          {dashboardSection === 'analytics' && canViewAnalytics && (
            <AnalyticsBusinessIntelligenceCenter
              currentPartner={currentPartner}
              partners={isAdmin ? activityPartners : []}
              communitySummary={communitySummary}
              isAdmin={isAdmin}
              isLeader={canViewLeaderAnalytics}
            />
          )}

          {dashboardSection === 'news' && <NewsSection updates={academyUpdates} onMarkRead={handleMarkUpdateRead} isAdmin={isAdmin} isLeader={canViewLeaderAnalytics} communitySummary={communitySummary} />}

          {dashboardSection === 'modules' && (
            <ModulesSection
              selectedModule={selectedModule}
              setSelectedModule={setSelectedModule}
              copy={copy}
              content={content}
              selectedLanguage={selectedLanguage}
              partner={currentPartner}
            />
          )}

          {dashboardSection === 'testlab' && (
            <TestLabSection
              copy={copy}
              content={content}
              selectedLanguage={selectedLanguage}
              partner={currentPartner}
            />
          )}

          {dashboardSection === 'links' && <HelpfulLinksSection partner={currentPartner} copy={copy} />}

          {dashboardSection === 'resources' && <ResourcesSection selectedLanguage={selectedLanguage} />}

          {dashboardSection === 'calendar' && <CalendlySection copy={copy} partner={currentPartner} isAdmin={isAdmin} isLeader={canViewLeaderAnalytics} />}

          {dashboardSection === 'social' && <InstagramSection partners={partners} partner={currentPartner} instagramVisible={instagramVisible} setInstagramVisible={setInstagramVisible} onSaveProfile={handleUpdateNotificationPreferences} onAdminUpdate={handleUpdatePartner} copy={copy} content={content} isAdmin={isAdmin} />}

          {dashboardSection === 'contact' && <LeonidContactSection copy={copy} />}

          {dashboardSection === 'community' && (
            <CommunityCommunicationPrototype partner={currentPartner} isAdmin={isAdmin} />
          )}

          {dashboardSection === 'chat' && <CommunityChatSection partners={partners} partner={currentPartner} token={sessionToken} copy={copy} content={content} isAdmin={isAdmin} />}

          {dashboardSection === 'qa' && <QASection copy={copy} content={content} token={sessionToken} isAdmin={isAdmin} />}

          {dashboardSection === 'profile' && <ProfileSection partner={currentPartner} rankingPartners={rankingPartners} copy={copy} onSave={handleUpdateNotificationPreferences} onProfilePhotoChange={handleUpdateProfilePhoto} onScreenshotSubmit={handleCareerScreenshotSubmit} onTeamGrowthSubmit={handleTeamGrowthSubmit} />}

          {dashboardSection === 'testimonials' && <TestimonialsSection copy={copy} partner={currentPartner} token={sessionToken} isAdmin={isAdmin} />}

          {dashboardSection === 'admin' && isAdmin && (
            <>
              <CareerSummaryCard partner={{ ...currentPartner, rank: currentRankingEntry?.rank }} />
              <TeamBuildSummaryCard partner={{ ...currentPartner, teamRank: buildTeamRanking(rankingPartners, currentPartner).find((item) => item.id === currentPartner?.id)?.teamRank }} />
              <AdminDashboardPrototype />
              <AdminPanel
                partners={activityPartners}
                pendingPartners={pendingPartners}
                approvedPartners={approvedPartners}
                message={adminMessage}
                onApprove={handleApprovePartner}
                onUpdate={handleUpdatePartner}
                onProfilePhotoChange={handleAdminProfilePhotoChange}
                onSendReminder={handleSendPartnerReminder}
                onDelete={handleDeletePartner}
                onCleanTestData={handleCleanTestData}
                onCreateAcademyUpdate={handleCreateAcademyUpdate}
                academyUpdates={academyUpdates}
                onLoadDetail={handleLoadAdminPartnerDetail}
                copy={copy}
              />
            </>
          )}
          <FooterInstagramLink />
        </main>
      </div>
    </Shell>
  );
}

function AuthTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-3 text-sm font-bold transition ${active ? 'bg-yellow-400 text-black' : 'text-white/65 hover:bg-white/10 hover:text-white'}`}
    >
      {children}
    </button>
  );
}

function MobileDashboardNav({ items, activeSection, setDashboardSection, copy, badges = {} }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const primaryIds = ['start', 'dashboard', 'modules', 'profile'];
  const primaryItems = items.filter((item) => primaryIds.includes(item.id));
  const secondaryItems = items.filter((item) => !primaryIds.includes(item.id));
  const secondaryActive = secondaryItems.some((item) => item.id === activeSection);

  const selectSection = (id) => {
    setDashboardSection(id);
    setMoreOpen(false);
  };

  return (
    <nav className="sticky top-0 z-20 -mx-3 border-b border-white/10 bg-black/85 px-3 py-2 backdrop-blur-xl sm:-mx-4 sm:px-4 lg:hidden">
      <div className="grid grid-cols-5 gap-1.5">
        {primaryItems.map(({ id, labelKey, label, icon: Icon }) => {
          const navLabel = copy[labelKey] || label;
          const badge = badges[id] || 0;
          return (
            <button
              key={id}
              type="button"
              onClick={() => selectSection(id)}
              aria-label={navLabel}
              aria-current={activeSection === id ? 'page' : undefined}
              className={`relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] transition ${activeSection === id ? 'bg-yellow-400 text-black' : 'bg-white/[0.07] text-white/75'}`}
            >
              <Icon size={17} />
              <span className="w-full truncate text-center font-bold">{navLabel}</span>
              {badge > 0 && <span className="absolute right-1 top-1 min-w-4 rounded-full bg-yellow-300 px-1 text-[9px] font-black text-black">{badge}</span>}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setMoreOpen((current) => !current)}
          aria-expanded={moreOpen}
          aria-controls="mobile-academy-more-navigation"
          className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] transition ${secondaryActive || moreOpen ? 'bg-yellow-400 text-black' : 'bg-white/[0.07] text-white/75'}`}
        >
          {moreOpen ? <X size={17} /> : <Menu size={17} />}
          <span className="font-bold">{moreOpen ? 'Schließen' : 'Mehr'}</span>
        </button>
      </div>

      {moreOpen && (
        <div id="mobile-academy-more-navigation" className="mt-2 grid max-h-[58vh] grid-cols-2 gap-2 overflow-y-auto rounded-2xl border border-white/10 bg-[#0b0b0b]/95 p-2 shadow-2xl">
          {secondaryItems.map(({ id, labelKey, label, icon: Icon }) => {
            const navLabel = copy[labelKey] || label;
            const badge = badges[id] || 0;
            return (
              <button
                key={id}
                type="button"
                onClick={() => selectSection(id)}
                aria-current={activeSection === id ? 'page' : undefined}
                className={`flex min-w-0 items-center gap-2 rounded-xl px-3 py-3 text-left text-xs transition ${activeSection === id ? 'bg-yellow-400 text-black' : 'bg-white/[0.07] text-white/75'}`}
              >
                <Icon size={16} className="shrink-0" />
                <span className="min-w-0 flex-1 break-words font-bold">{navLabel}</span>
                {badge > 0 && <span className="rounded-full bg-yellow-300 px-1.5 py-0.5 text-[10px] font-black text-black">{badge}</span>}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}

function RegistrationForm({ form, error, loading, copy, onSubmit, onFieldChange, onAdminAccess }) {
  const [profileImageError, setProfileImageError] = useState('');

  const handleProfileImageChange = async (file) => {
    setProfileImageError('');

    try {
      const profileImage = await fileToProfileImage(file, copy);
      onFieldChange('profileImage', profileImage);
    } catch (uploadError) {
      onFieldChange('profileImage', null);
      setProfileImageError(uploadError.message || copy.profileImageInvalidType);
    }
  };

  return (
    <>
      <PanelHeader title={copy.partnerRegister} text={copy.registrationIntro} onLogoClick={onAdminAccess} />
      <form onSubmit={onSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          <Input label={copy.firstName} value={form.firstName} onChange={(event) => onFieldChange('firstName', event.target.value)} autoComplete="given-name" />
          <Input label={copy.lastName} value={form.lastName} onChange={(event) => onFieldChange('lastName', event.target.value)} autoComplete="family-name" />
          <Input label={copy.email} type="email" value={form.email} onChange={(event) => onFieldChange('email', event.target.value)} autoComplete="email" />
          <Input label={copy.whatsapp} value={form.whatsapp} onChange={(event) => onFieldChange('whatsapp', event.target.value)} autoComplete="tel" />
          <Input label={`${copy.discountCode} *`} placeholder="z. B. TEAM2026" value={form.discountCode} onChange={(event) => onFieldChange('discountCode', event.target.value.toUpperCase())} autoComplete="off" />
          <Input label={copy.city} value={form.city} onChange={(event) => onFieldChange('city', event.target.value)} autoComplete="address-level2" />
          <Select label={copy.language} options={languages} value={form.language} onChange={(value) => onFieldChange('language', value)} />
          <Input label={copy.password} password value={form.password} onChange={(event) => onFieldChange('password', event.target.value)} autoComplete="new-password" />
          <Input label={copy.passwordRepeat} password value={form.passwordRepeat} onChange={(event) => onFieldChange('passwordRepeat', event.target.value)} autoComplete="new-password" />
        </div>
        <div className="mt-5 rounded-3xl border border-yellow-300/20 bg-black/30 p-4 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-yellow-200/35 bg-yellow-400/10 shadow-lg shadow-yellow-500/10">
              {form.profileImage?.dataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.profileImage.dataUrl} alt={copy.profileImagePreview} className="h-full w-full object-cover" />
              ) : (
                <UserCheck size={34} className="text-yellow-200" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black text-yellow-50">{copy.profileImageUpload} *</p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{copy.profileImageHint}</p>
              <label className="mt-4 inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-black text-black shadow-lg shadow-yellow-500/20 transition hover:bg-yellow-300">
                <Upload size={16} />
                {form.profileImage?.dataUrl ? copy.profileImageChange : copy.profileImageUpload}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(event) => handleProfileImageChange(event.target.files?.[0] || null)}
                />
              </label>
              <p className="mt-2 text-xs text-white/45">JPG, PNG oder WEBP · max. 1,5 MB</p>
              {profileImageError && <p className="mt-2 text-sm font-semibold text-red-200">{profileImageError}</p>}
            </div>
          </div>
        </div>
        <label className="mt-5 flex items-start gap-3 rounded-2xl border border-yellow-300/20 bg-black/30 p-4 text-sm leading-relaxed text-white/70">
          <input
            type="checkbox"
            checked={Boolean(form.acceptedLegal)}
            onChange={(event) => onFieldChange('acceptedLegal', event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-yellow-300"
          />
          <span>
            Ich habe die{' '}
            <Link href="/datenschutz" target="_blank" rel="noreferrer" className="font-bold text-yellow-200 underline-offset-4 hover:underline">
              {copy.privacyPolicy}
            </Link>{' '}
            und die{' '}
            <Link href="/nutzungsbedingungen" target="_blank" rel="noreferrer" className="font-bold text-yellow-200 underline-offset-4 hover:underline">
              {copy.termsOfUse}
            </Link>{' '}
            gelesen und akzeptiere diese.
          </span>
        </label>
        <label className="mt-3 flex items-start gap-3 rounded-2xl border border-yellow-300/20 bg-black/30 p-4 text-sm leading-relaxed text-white/70">
          <input
            type="checkbox"
            checked={Boolean(form.acceptedTrainingContent)}
            onChange={(event) => onFieldChange('acceptedTrainingContent', event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-yellow-300"
          />
          <span>
            Ich bin damit einverstanden, dass von mir freiwillig bereitgestellte Schulungsinhalte (z. B. Videos,
            Webinaraufzeichnungen, Audioaufnahmen, Präsentationen, Bilder, Dokumente oder eigene Schulungsbeiträge)
            innerhalb der geschlossenen Harbor Global Partner Academy intern für Schulungs- und Ausbildungszwecke
            gespeichert, angezeigt und verwendet werden dürfen. Eine Weitergabe an Dritte ist untersagt.
          </span>
        </label>
        <label className="mt-3 flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-relaxed text-white/70">
          <input
            type="checkbox"
            checked={form.emailUpdates !== false}
            onChange={(event) => onFieldChange('emailUpdates', event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-yellow-300"
          />
          <span>{copy.emailUpdatesConsent}</span>
        </label>
        <label className="mt-3 flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-relaxed text-white/70">
          <input
            type="checkbox"
            checked={Boolean(form.whatsappUpdates)}
            onChange={(event) => onFieldChange('whatsappUpdates', event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-yellow-300"
          />
          <span>{copy.whatsappUpdatesConsent}</span>
        </label>
        {error && <AuthMessage>{error}</AuthMessage>}
        <Button disabled={loading} className="mt-6 h-12 w-full rounded-2xl bg-yellow-400 font-bold text-black hover:bg-yellow-300 disabled:opacity-60">
          {loading ? copy.saving : copy.submitRegistration}
        </Button>
      </form>
      <div className="mt-4 rounded-2xl border border-yellow-400/20 bg-black/30 p-4 text-sm text-white/60">
        {copy.registrationPendingHelp}
      </div>
    </>
  );
}

function RegistrationSuccess({ copy, onLogin }) {
  return (
    <div className="py-10 text-center">
      <CheckCircle2 className="mx-auto mb-5 text-yellow-300" size={64} />
      <h2 className="text-3xl font-black">{copy.registrationSaved}</h2>
      <p className="mt-4 text-white/60">{copy.registrationSavedText}</p>
      <Button onClick={onLogin} className="mt-6 rounded-2xl bg-yellow-400 px-6 py-3 font-bold text-black hover:bg-yellow-300">
        {copy.toLogin}
      </Button>
    </div>
  );
}

function LoginForm({ form, error, loading, copy, admin = false, onSubmit, onFieldChange, onBack }) {
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const openReset = () => {
    setResetEmail((current) => current || (form.username.includes('@') ? form.username : ''));
    setResetMessage('');
    setResetOpen(true);
  };

  const submitReset = async () => {
    setResetLoading(true);
    setResetMessage('');

    try {
      const data = await requestPasswordReset(resetEmail);
      setResetMessage(data.message || copy.resetNeutralMessage);
    } catch {
      setResetMessage(copy.resetNeutralMessage);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <PanelHeader title={admin ? copy.adminLogin : copy.partnerLogin} text={admin ? copy.adminLoginIntro : copy.loginIntro} />
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label={copy.username} placeholder={copy.usernamePlaceholder} value={form.username} onChange={(event) => onFieldChange('username', event.target.value)} autoComplete="username" />
        <Input label={copy.password} password value={form.password} onChange={(event) => onFieldChange('password', event.target.value)} autoComplete="current-password" />
        {error && <AuthMessage>{error}</AuthMessage>}
        <Button disabled={loading} className="h-12 w-full rounded-2xl bg-yellow-400 font-bold text-black hover:bg-yellow-300 disabled:opacity-60">
          {loading ? copy.checking : copy.login}
        </Button>
        {!admin && (
          <div className="rounded-3xl border border-yellow-300/15 bg-black/25 p-4">
            <button type="button" onClick={openReset} className="text-sm font-bold text-yellow-200 underline-offset-4 hover:underline">
              {copy.forgotPassword}
            </button>
            {resetOpen && (
              <div className="mt-4 space-y-3">
                <Input label={copy.resetEmailLabel} type="email" value={resetEmail} onChange={(event) => setResetEmail(event.target.value)} autoComplete="email" />
                <Button type="button" disabled={resetLoading} onClick={submitReset} className="w-full rounded-2xl border border-yellow-300/25 bg-yellow-400/15 px-4 py-3 font-bold text-yellow-100 hover:bg-yellow-400/25 disabled:opacity-60">
                  {resetLoading ? copy.saving : copy.sendResetLink}
                </Button>
                {resetMessage && <p className="text-sm leading-relaxed text-white/60">{resetMessage}</p>}
              </div>
            )}
          </div>
        )}
        {admin && (
          <button type="button" onClick={onBack} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/70 hover:bg-white/10">
            {copy.backToPartnerLogin}
          </button>
        )}
      </form>
    </>
  );
}

const adminFilterOptions = [
  { id: 'all', label: 'Alle Partner' },
  { id: 'pending', label: 'Wartend' },
  { id: 'approved', label: 'Freigegeben' },
  { id: 'blocked', label: 'Blockiert' },
  { id: 'rejected', label: 'Abgelehnt' },
  { id: 'leaders', label: 'Leader' },
  { id: 'test', label: 'Testdaten' },
  { id: 'real', label: 'Echte Registrierungen' },
];

const adminSortOptions = [
  { id: 'created-desc', label: 'Neueste zuerst' },
  { id: 'created-asc', label: 'Älteste zuerst' },
  { id: 'name-asc', label: 'Alphabetisch A–Z' },
  { id: 'name-desc', label: 'Alphabetisch Z–A' },
  { id: 'status-asc', label: 'Status A–Z' },
  { id: 'city-asc', label: 'Stadt A–Z' },
];

const adminPageSizeOptions = [25, 50, 100];
const ADMIN_TIME_ZONE = 'Europe/Berlin';

function formatAdminDate(value) {
  if (!value) {
    return 'Nicht vorhanden';
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('de-DE');
}

function getAdminCalendarDay(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: ADMIN_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const year = Number(values.year);
  const month = Number(values.month);
  const day = Number(values.day);

  if (!year || !month || !day) {
    return null;
  }

  return Math.floor(Date.UTC(year, month - 1, day) / 86400000);
}

function getAdminRegistrationMetrics(partners, now = new Date()) {
  const today = getAdminCalendarDay(now);

  if (today === null) {
    return { today: 0, week: 0 };
  }

  const weekday = new Date(today * 86400000).getUTCDay();
  const weekStart = today - ((weekday + 6) % 7);

  return partners.reduce((metrics, partner) => {
    const registrationDay = getAdminCalendarDay(partner.createdAt);

    if (registrationDay === null) {
      return metrics;
    }

    if (registrationDay === today) {
      metrics.today += 1;
    }

    if (registrationDay >= weekStart && registrationDay <= today) {
      metrics.week += 1;
    }

    return metrics;
  }, { today: 0, week: 0 });
}

function getAdminRiskMarkers(partner) {
  const markers = [];

  if (!partner.profileImageUrl) {
    markers.push({ id: 'profile', label: 'Kein Profilbild', className: 'bg-red-400/15 text-red-100 ring-red-300/20' });
  }

  if (!String(partner.teamName || '').trim() && Number(partner.teamPartnerCount || 0) <= 0) {
    markers.push({ id: 'team', label: 'Kein Team', className: 'bg-orange-400/15 text-orange-100 ring-orange-300/20' });
  }

  if (partner.status !== 'approved') {
    markers.push({ id: 'approval', label: 'Nicht freigegeben', className: 'bg-yellow-400/15 text-yellow-100 ring-yellow-300/20' });
  }

  if (partner.academyProgress?.completedModuleCount === 0) {
    markers.push({ id: 'module', label: 'Noch kein Modul abgeschlossen', className: 'bg-blue-400/15 text-blue-100 ring-blue-300/20' });
  }

  if (partner.activityStatus?.id === 'inactive') {
    markers.push({ id: 'inactive', label: 'Lange inaktiv', className: 'bg-red-400/15 text-red-100 ring-red-300/20' });
  }

  return markers;
}

function getPartnerOnboardingRecommendation(partner) {
  if (partner.status !== 'approved') {
    return 'Partnerstatus prüfen und Freigabe klären';
  }

  if (!partner.profileImageUrl) {
    return 'Profilbild ergänzen';
  }

  if (!String(partner.teamName || '').trim() && Number(partner.teamPartnerCount || 0) <= 0) {
    return 'Teamzugehörigkeit klären';
  }

  if (partner.academyProgress?.onboardingStatus === 'completed') {
    return 'Onboarding abgeschlossen – nächste Entwicklungsstufe planen';
  }

  if (partner.academyProgress?.nextModuleTitle) {
    return `Modul „${partner.academyProgress.nextModuleTitle}“ abschließen`;
  }

  return 'Ersten Modulabschluss beginnen';
}

function compareAdminPartners(a, b, sortMode) {
  const nameA = `${a.firstName} ${a.lastName}`.trim();
  const nameB = `${b.firstName} ${b.lastName}`.trim();

  if (sortMode === 'created-asc') {
    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
  }

  if (sortMode === 'name-asc') {
    return nameA.localeCompare(nameB, 'de', { sensitivity: 'base' });
  }

  if (sortMode === 'name-desc') {
    return nameB.localeCompare(nameA, 'de', { sensitivity: 'base' });
  }

  if (sortMode === 'status-asc') {
    return String(a.status || '').localeCompare(String(b.status || ''), 'de', { sensitivity: 'base' })
      || nameA.localeCompare(nameB, 'de', { sensitivity: 'base' });
  }

  if (sortMode === 'city-asc') {
    return String(a.city || '').localeCompare(String(b.city || ''), 'de', { sensitivity: 'base' })
      || nameA.localeCompare(nameB, 'de', { sensitivity: 'base' });
  }

  return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
}

function AdminPrototypeChart({ title, icon: Icon, data }) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <Panel title={title} icon={Icon}>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label} className="grid grid-cols-[4.5rem_1fr_3rem] items-center gap-3 text-sm">
            <span className="truncate text-white/45">{item.label}</span>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-100"
                style={{ width: `${Math.max(8, Math.round((item.value / maxValue) * 100))}%` }}
              />
            </div>
            <span className="text-right font-black text-yellow-50">{item.value}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

const adminOperationsTabs = [
  { id: 'pending', label: 'Pending', icon: Bell, description: 'Freigaben prüfen' },
  { id: 'active', label: 'Aktiv', icon: UserCheck, description: 'Freigegebene Partner' },
  { id: 'blocked', label: 'Gesperrt', icon: Lock, description: 'Sperren & Reaktivierung' },
  { id: 'leaders', label: 'Leader', icon: Crown, description: 'Teamsteuerung' },
  { id: 'tasks', label: 'Aufgaben', icon: Target, description: 'Operative Prioritäten' },
  { id: 'activity', label: 'Aktivität', icon: Clock, description: 'Vorhandene Logs' },
];

const adminOperationsTabFilterMap = {
  pending: 'pending',
  active: 'approved',
  blocked: 'blocked',
  leaders: 'leaders',
};

const adminRoleOptions = [
  { id: 'partner', label: 'Partner' },
  { id: 'leader', label: 'Leader' },
  { id: 'admin', label: 'Admin' },
];

function isAdminOperationsLeader(partner) {
  const role = String(partner?.role || '').toLowerCase();
  const level = String(partner?.aquaLevel || '').toLowerCase();

  return role.includes('leader')
    || role.includes('team')
    || level.includes('leader')
    || Number(partner?.teamPartnerCount || 0) > 0;
}

function getAdminOperationalTasks(partners) {
  const realPartners = partners.filter((partner) => !partner.testData && partner.role !== 'admin');
  const pending = realPartners.filter((partner) => partner.status === 'pending');
  const inactive = realPartners.filter((partner) => partner.status === 'approved' && partner.activityStatus?.id === 'inactive');
  const withoutProfile = realPartners.filter((partner) => partner.status === 'approved' && !partner.profileImageUrl);
  const lowProgress = realPartners.filter((partner) => partner.status === 'approved' && getAnalyticsPartnerProgress(partner) < 25);
  const leadersWithoutActivity = realPartners.filter((partner) => isAdminOperationsLeader(partner)
    && (partner.activityStatus?.id === 'inactive' || Number(partner.teamNewPartnersSinceLastUpdate || 0) <= 0));

  return [
    {
      id: 'pending',
      icon: Bell,
      title: 'Offene Freigaben',
      count: pending.length,
      text: 'Neue Registrierungen prüfen und Status sauber entscheiden.',
      partners: pending.slice(0, 4),
      className: 'border-yellow-300/25 bg-yellow-400/[0.08] text-yellow-100',
    },
    {
      id: 'inactive',
      icon: Clock,
      title: 'Inaktive Partner',
      count: inactive.length,
      text: 'Freigegebene Partner mit längerer Inaktivität beobachten.',
      partners: inactive.slice(0, 4),
      className: 'border-red-300/25 bg-red-400/[0.08] text-red-100',
    },
    {
      id: 'profile',
      icon: Camera,
      title: 'Ohne Profilbild',
      count: withoutProfile.length,
      text: 'Profilvollständigkeit für bessere Freigabe- und Teamarbeit erhöhen.',
      partners: withoutProfile.slice(0, 4),
      className: 'border-orange-300/25 bg-orange-400/[0.08] text-orange-100',
    },
    {
      id: 'progress',
      icon: BookOpen,
      title: 'Niedriger Fortschritt',
      count: lowProgress.length,
      text: 'Partner unter 25 % Lernfortschritt brauchen klare nächste Schritte.',
      partners: lowProgress.slice(0, 4),
      className: 'border-blue-300/25 bg-blue-400/[0.08] text-blue-100',
    },
    {
      id: 'leaders',
      icon: Crown,
      title: 'Leader ohne Teamaktivität',
      count: leadersWithoutActivity.length,
      text: 'Leader oder Teamkandidaten mit wenig sichtbarer Teambewegung prüfen.',
      partners: leadersWithoutActivity.slice(0, 4),
      className: 'border-purple-300/25 bg-purple-400/[0.08] text-purple-100',
    },
  ];
}

function getAdminPartnerActivityItems(partner) {
  if (!partner) {
    return [];
  }

  const progress = partner.academyProgress || {};
  const items = [
    {
      id: 'registered',
      label: 'Registrierung',
      value: formatAdminDate(partner.registrationLog?.sentAt || partner.createdAt),
      detail: partner.registrationLog?.supabaseSaved ? 'Registrierung gespeichert' : 'Speicherstatus nicht bestätigt',
      available: Boolean(partner.registrationLog?.sentAt || partner.createdAt),
    },
    {
      id: 'approval',
      label: 'Freigabe',
      value: formatAdminDate(partner.approvalLog?.approvedAt),
      detail: partner.approvalLog?.approvedBy ? `durch ${partner.approvalLog.approvedBy}` : 'Noch nicht freigegeben',
      available: Boolean(partner.approvalLog?.approvedAt || partner.approvalLog?.approved),
    },
    {
      id: 'last-login',
      label: 'Letzter Login',
      value: formatAdminDate(partner.lastSeenAt || partner.lastActivityAt),
      detail: partner.lastSeenAt ? 'Login-/Sitzungsaktivität vorhanden' : 'Kein verlässlicher Login-Zeitpunkt vorhanden',
      available: Boolean(partner.lastSeenAt || partner.lastActivityAt),
    },
    {
      id: 'module',
      label: 'Modulfortschritt',
      value: `${progress.progressPercent || 0}%`,
      detail: progress.lastModuleCompletedAt
        ? `Letzter Abschluss: ${formatAdminDate(progress.lastModuleCompletedAt)}`
        : `${progress.completedModuleCount || 0} abgeschlossene Module`,
      available: Boolean((progress.progressPercent || 0) > 0 || progress.completedModuleCount > 0 || progress.lastModuleCompletedAt),
    },
    {
      id: 'quiz',
      label: 'Quiz-Aktivität',
      value: progress.quizPassed ? 'Quiz bestanden' : 'Keine persistente Quizaktivität',
      detail: progress.quizPassedAt ? formatAdminDate(progress.quizPassedAt) : 'Lokale Quizdaten werden nicht dauerhaft gespeichert',
      available: Boolean(progress.quizPassed || progress.quizPassedAt),
    },
    {
      id: 'certificate',
      label: 'Zertifikat',
      value: progress.certificationPassed ? 'Zertifikat bestanden' : 'Kein Zertifikat erfasst',
      detail: progress.certificationPassedAt ? formatAdminDate(progress.certificationPassedAt) : 'Zertifikatssystem ist nur vorbereitet',
      available: Boolean(progress.certificationPassed || progress.certificationPassedAt),
    },
  ];

  return items.filter((item) => item.available);
}

function AdminOperationTabButton({ tab, active, count, onClick }) {
  const Icon = tab.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-[9.5rem] flex-1 rounded-3xl border p-4 text-left transition ${
        active
          ? 'border-yellow-200/60 bg-yellow-400/15 shadow-lg shadow-yellow-500/10'
          : 'border-white/10 bg-black/25 hover:border-yellow-300/30 hover:bg-white/[0.07]'
      }`}
    >
      <span className="flex items-start justify-between gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${active ? 'bg-yellow-400 text-black' : 'bg-yellow-400/10 text-yellow-200'}`}>
          <Icon size={18} />
        </span>
        <span className="rounded-full bg-black/25 px-2.5 py-1 text-[11px] font-black text-yellow-100">{count}</span>
      </span>
      <span className="mt-3 block text-sm font-black text-yellow-50">{tab.label}</span>
      <span className="mt-1 block text-xs leading-relaxed text-white/45">{tab.description}</span>
    </button>
  );
}

function AdminPendingReviewCard({ partner, onApprove, onUpdate, onSelect }) {
  return (
    <article className="rounded-3xl border border-yellow-300/18 bg-black/25 p-4 text-white">
      <div className="flex min-w-0 items-start gap-3">
        <CareerAvatar partner={partner} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h4 className="truncate text-base font-black text-yellow-50">{partner.firstName} {partner.lastName}</h4>
              <p className="break-all text-xs text-white/55">{partner.email || 'Keine E-Mail hinterlegt'}</p>
            </div>
            <StatusBadge status={partner.status} />
          </div>
          <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2 xl:grid-cols-3">
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">Telefon<br /><span className="font-bold text-white">{partner.whatsapp || 'Nicht angegeben'}</span></p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">Rabattcode<br /><span className="font-bold text-white">{partner.discountCode || 'Nicht hinterlegt'}</span></p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">Registriert<br /><span className="font-bold text-white">{formatAdminDate(partner.createdAt)}</span></p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">Profilbild<br /><span className={partner.profileImageUrl ? 'font-bold text-green-200' : 'font-bold text-red-200'}>{partner.profileImageUrl ? 'Vorhanden' : 'Fehlt'}</span></p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">Stadt<br /><span className="font-bold text-white">{partner.city || 'Nicht angegeben'}</span></p>
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">Status<br /><span className="font-bold text-white">{formatPartnerStatus(partner.status)}</span></p>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {partner.status === 'pending' && (
              <Button type="button" onClick={() => onApprove(partner.id)} className="rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-black text-black hover:bg-yellow-300">
                <UserCheck size={15} /> Freigeben
              </Button>
            )}
            <Button type="button" onClick={() => onUpdate(partner.id, { status: 'rejected' })} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/15">
              <X size={15} /> Ablehnen
            </Button>
            <Button type="button" onClick={() => onUpdate(partner.id, { status: 'blocked' })} className="rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-3 text-sm font-bold text-red-100 hover:bg-red-500/25">
              <Lock size={15} /> Sperren
            </Button>
            {partner.status !== 'pending' && partner.status !== 'approved' && (
              <Button type="button" onClick={() => onUpdate(partner.id, { status: 'approved' })} className="rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-sm font-bold text-emerald-100 hover:bg-emerald-500/25">
                <UserCheck size={15} /> Reaktivieren
              </Button>
            )}
            <Button type="button" onClick={() => onSelect(partner.id)} className="rounded-2xl border border-yellow-300/25 bg-yellow-400/10 px-4 py-3 text-sm font-bold text-yellow-100 hover:bg-yellow-400/20">
              Details öffnen
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function AdminOperationsTaskCard({ task, onSelect }) {
  const Icon = task.icon;

  return (
    <article className={`rounded-3xl border p-4 ${task.className}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-black/25">
          <Icon size={19} />
        </span>
        <span className="text-3xl font-black">{task.count}</span>
      </div>
      <h4 className="mt-4 text-base font-black">{task.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-white/58">{task.text}</p>
      {task.partners.length > 0 ? (
        <div className="mt-4 space-y-2">
          {task.partners.map((partner) => (
            <button
              key={`${task.id}-${partner.id}`}
              type="button"
              onClick={() => onSelect(partner.id)}
              className="flex w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-left text-xs text-white/72 hover:bg-white/10"
            >
              <span className="min-w-0">
                <span className="block truncate font-black text-yellow-50">{partner.firstName} {partner.lastName}</span>
                <span className="block truncate text-white/45">{partner.email || partner.discountCode || 'ohne Kontaktwert'}</span>
              </span>
              <ChevronRight size={14} className="shrink-0 text-yellow-200" />
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/50">Aktuell kein Handlungsbedarf.</p>
      )}
    </article>
  );
}

function AdminPartnerActivityTimeline({ partner }) {
  const items = getAdminPartnerActivityItems(partner);

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-dashed border-yellow-300/25 bg-yellow-400/[0.06] p-5 text-sm text-white/58">
        Keine verlässlichen Aktivitätsdaten vorhanden. Es werden keine Fake-Logs erzeugt.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-3xl border border-white/10 bg-black/25 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <p className="font-black text-yellow-50">{item.label}</p>
            <p className="text-sm font-bold text-white/75">{item.value}</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-white/50">{item.detail}</p>
        </div>
      ))}
    </div>
  );
}

function AdminNotificationPreparationPanel() {
  const notificationItems = [
    { id: 'partner', icon: MessageCircle, title: 'Nachricht an Partner', text: 'Textentwurf und Zielpartner vorbereiten. Kein Versand ohne Backend-Freigabe.' },
    { id: 'leader', icon: Crown, title: 'Nachricht an Leader', text: 'Teamkommunikation vorbereiten. Keine E-Mail- oder WhatsApp-Integration aktiv.' },
    { id: 'global', icon: Bell, title: 'Globale Systemmeldung', text: 'Academy-weite Meldungen als Workflow vorbereitet. Kein produktiver Versand.' },
  ];

  return (
    <Panel title="Benachrichtigungs-Vorbereitung" icon={Send}>
      <div className="grid gap-3 md:grid-cols-3">
        {notificationItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="rounded-3xl border border-white/10 bg-black/25 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-200">
                <Icon size={18} />
              </span>
              <h4 className="mt-4 font-black text-yellow-50">{item.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{item.text}</p>
              <button type="button" disabled className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white/35">
                UI vorbereitet · Backend offen
              </button>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function AdminRoleManagementPanel({ partner }) {
  const [roleDraft, setRoleDraft] = useState(partner.role || 'partner');

  return (
    <div className="rounded-3xl border border-yellow-300/15 bg-yellow-400/[0.07] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Rollenverwaltung</p>
          <h4 className="mt-2 text-lg font-black text-yellow-50">{adminRoleOptions.find((role) => role.id === (partner.role || 'partner'))?.label || partner.role || 'Partner'}</h4>
          <p className="mt-1 text-sm leading-relaxed text-white/55">UI vorbereitet. Die bestehende Admin-Update-API schreibt Rollen aktuell nicht, deshalb wird hier nichts gespeichert.</p>
        </div>
        <StatusBadge status={partner.status} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <label className="block">
          <span className="mb-1 block text-xs text-white/50">Zielrolle</span>
          <select value={roleDraft} onChange={(event) => setRoleDraft(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm outline-none focus:border-yellow-300/70">
            {adminRoleOptions.map((role) => <option key={role.id} value={role.id}>{role.label}</option>)}
          </select>
        </label>
        <button type="button" disabled className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white/35">
          Speichern vorbereitet
        </button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-white/45">
        TODO: Rollenwechsel erst aktivieren, wenn ein freigegebener serverseitiger Rollen-Update-Vertrag existiert. Keine Auth-Logik wurde geändert.
      </p>
    </div>
  );
}

function AdminOperationsCenter({
  activeTab,
  metrics,
  pendingPartners,
  activePartners,
  blockedPartners,
  leaderPartners,
  activityPartners,
  tasks,
  onTabChange,
  onApprove,
  onUpdate,
  onSelect,
}) {
  const tabCounts = {
    pending: pendingPartners.length,
    active: activePartners.length,
    blocked: blockedPartners.length,
    leaders: leaderPartners.length,
    tasks: tasks.reduce((sum, task) => sum + task.count, 0),
    activity: activityPartners.length,
  };

  return (
    <section className="space-y-4 rounded-[2rem] border border-yellow-300/15 bg-gradient-to-br from-yellow-400/[0.08] via-white/[0.035] to-black/40 p-4 text-white sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-200">Partner Operations Center</p>
          <h3 className="mt-2 text-2xl font-black text-yellow-50">Freigaben, Aufgaben und operative Steuerung</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/55">
            Admin-only Arbeitsfläche mit vorhandenen Partnerdaten. Rollen-, Nachrichten- und Aktivitätsbereiche zeigen nur echte vorhandene Daten oder klare Empty States.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          <span className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2">Pending <b className="text-yellow-100">{metrics.pending}</b></span>
          <span className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2">Aktiv <b className="text-yellow-100">{metrics.active}</b></span>
          <span className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2">Gesperrt <b className="text-yellow-100">{metrics.blocked}</b></span>
          <span className="rounded-2xl border border-white/10 bg-black/25 px-3 py-2">Inaktiv <b className="text-yellow-100">{metrics.inactive}</b></span>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {adminOperationsTabs.map((tab) => (
          <AdminOperationTabButton
            key={tab.id}
            tab={tab}
            active={activeTab === tab.id}
            count={tabCounts[tab.id] || 0}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
      </div>

      {activeTab === 'pending' && (
        <div className="space-y-3">
          {pendingPartners.length > 0 ? pendingPartners.slice(0, 6).map((partner) => (
            <AdminPendingReviewCard key={partner.id} partner={partner} onApprove={onApprove} onUpdate={onUpdate} onSelect={onSelect} />
          )) : (
            <div className="rounded-3xl border border-white/10 bg-black/25 p-5 text-sm text-white/55">Keine offenen Freigaben vorhanden.</div>
          )}
        </div>
      )}

      {activeTab === 'active' && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {activePartners.slice(0, 6).map((partner) => (
            <AdminOperationsTaskCard key={`active-${partner.id}`} task={{
              id: `active-${partner.id}`,
              icon: UserCheck,
              title: `${partner.firstName} ${partner.lastName}`,
              count: `${getAnalyticsPartnerProgress(partner)}%`,
              text: `${partner.teamName || 'Ohne Team'} · ${partner.activityStatus?.label || 'Aktivität offen'}`,
              partners: [partner],
              className: 'border-emerald-300/20 bg-emerald-400/[0.07] text-emerald-100',
            }} onSelect={onSelect} />
          ))}
          {activePartners.length === 0 && <div className="rounded-3xl border border-white/10 bg-black/25 p-5 text-sm text-white/55">Keine freigegebenen Partner im aktuellen Datenstand.</div>}
        </div>
      )}

      {activeTab === 'blocked' && (
        <div className="space-y-3">
          {blockedPartners.length > 0 ? blockedPartners.slice(0, 8).map((partner) => (
            <AdminPendingReviewCard key={`blocked-${partner.id}`} partner={partner} onApprove={onApprove} onUpdate={onUpdate} onSelect={onSelect} />
          )) : (
            <div className="rounded-3xl border border-white/10 bg-black/25 p-5 text-sm text-white/55">Keine gesperrten oder abgelehnten Partner vorhanden.</div>
          )}
        </div>
      )}

      {activeTab === 'leaders' && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {leaderPartners.length > 0 ? leaderPartners.slice(0, 9).map((partner) => (
            <AdminOperationsTaskCard key={`leader-${partner.id}`} task={{
              id: `leader-${partner.id}`,
              icon: Crown,
              title: `${partner.firstName} ${partner.lastName}`,
              count: formatPartnerCount(partner.teamPartnerCount || 0),
              text: `${partner.teamName || 'Team offen'} · ${partner.activityStatus?.label || 'Aktivität offen'} · ${partner.aquaLevel || 'Level offen'}`,
              partners: [partner],
              className: 'border-purple-300/20 bg-purple-400/[0.07] text-purple-100',
            }} onSelect={onSelect} />
          )) : (
            <div className="rounded-3xl border border-white/10 bg-black/25 p-5 text-sm text-white/55">Keine Leader- oder Teamkandidaten aus vorhandenen Daten ableitbar.</div>
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {tasks.map((task) => <AdminOperationsTaskCard key={task.id} task={task} onSelect={onSelect} />)}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="grid gap-3 lg:grid-cols-2">
          {activityPartners.length > 0 ? activityPartners.slice(0, 8).map((partner) => (
            <div key={`activity-${partner.id}`} className="rounded-3xl border border-white/10 bg-black/25 p-4">
              <button type="button" onClick={() => onSelect(partner.id)} className="flex w-full min-w-0 items-center justify-between gap-3 text-left">
                <span className="min-w-0">
                  <span className="block truncate font-black text-yellow-50">{partner.firstName} {partner.lastName}</span>
                  <span className="block text-xs text-white/45">{partner.activityStatus?.label || 'Aktivität offen'} · {formatAdminDate(partner.lastActivityAt || partner.lastSeenAt)}</span>
                </span>
                <ChevronRight size={16} className="shrink-0 text-yellow-200" />
              </button>
            </div>
          )) : (
            <div className="rounded-3xl border border-dashed border-yellow-300/25 bg-yellow-400/[0.06] p-5 text-sm text-white/55">Keine Aktivitätsdaten vorhanden. Es werden keine Demo-Aktivitäten erzeugt.</div>
          )}
        </div>
      )}
    </section>
  );
}

function AdminPrototypePartnerDetail({ partner }) {
  const completedModules = partner.completedModules || [];
  const uploads = partner.uploads || [];

  return (
    <Card className="rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-400/[0.10] via-white/[0.05] to-black/40 text-white backdrop-blur-xl">
      <CardContent className="p-5 sm:p-6">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-yellow-300/20 bg-yellow-400/10 text-lg font-black text-yellow-100">
              {getInitials(partner)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Partner Detailseite · UI</p>
              <h3 className="mt-1 break-words text-2xl font-black text-yellow-50">{partner.firstName} {partner.lastName}</h3>
              <p className="mt-1 text-sm text-white/55">{partner.city} · {partner.team}</p>
            </div>
          </div>
          <AdminPrototypeStatusBadge status={partner.status} />
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['E-Mail', partner.email],
            ['WhatsApp', partner.whatsapp],
            ['Instagram', partner.instagram],
            ['Sponsor', partner.sponsor],
            ['Level', partner.level],
            ['Punkte', partner.points],
            ['Ranking', `#${partner.ranking}`],
            ['Aktivität', partner.activity],
          ].map(([label, value]) => (
            <div key={label} className="min-w-0 rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-white/38">{label}</p>
              <p className="mt-2 break-words text-sm font-bold text-yellow-50">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Abgeschlossene Module</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {completedModules.map((moduleTitle) => (
                <span key={moduleTitle} className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-100 ring-1 ring-emerald-200/20">
                  {moduleTitle}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Uploads & Quiz</p>
            <div className="mt-3 space-y-2 text-sm text-white/65">
              {uploads.map((upload) => <p key={upload}>• {upload}</p>)}
              <p>Quiz: {partner.quiz}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Notizen & Admin-Kommentar</p>
            <p className="mt-3 text-sm leading-relaxed text-white/65">{partner.notes}</p>
            <textarea
              readOnly
              value={partner.adminComment}
              className="mt-3 h-24 w-full resize-none rounded-2xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white/55 outline-none"
              aria-label="Admin Kommentar UI"
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <AdminPrototypeActionButton tone="primary"><UserCheck size={14} /> Freigeben</AdminPrototypeActionButton>
          <AdminPrototypeActionButton><Lock size={14} /> Sperren</AdminPrototypeActionButton>
          <AdminPrototypeActionButton><UserCheck size={14} /> Profil ansehen</AdminPrototypeActionButton>
          <AdminPrototypeActionButton><MessageCircle size={14} /> Nachricht senden</AdminPrototypeActionButton>
          <AdminPrototypeActionButton><Settings size={14} /> Reset Passwort</AdminPrototypeActionButton>
          <AdminPrototypeActionButton><Settings size={14} /> Bearbeiten</AdminPrototypeActionButton>
          <AdminPrototypeActionButton tone="danger"><Trash2 size={14} /> Löschen</AdminPrototypeActionButton>
        </div>
      </CardContent>
    </Card>
  );
}

function CommunityPrototypeBadge({ children, tone = 'neutral' }) {
  const tones = {
    gold: 'bg-yellow-400/15 text-yellow-100 ring-yellow-300/25',
    green: 'bg-emerald-400/15 text-emerald-100 ring-emerald-300/25',
    blue: 'bg-blue-400/15 text-blue-100 ring-blue-300/25',
    red: 'bg-red-400/15 text-red-100 ring-red-300/25',
    neutral: 'bg-white/10 text-white/65 ring-white/10',
  };

  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.11em] ring-1 ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  );
}

function CommunityPostCard({ post, active, onReply }) {
  return (
    <Card className={`rounded-[2rem] border text-white backdrop-blur-xl transition hover:-translate-y-0.5 ${active ? 'border-yellow-300/45 bg-yellow-400/[0.10]' : 'border-white/10 bg-white/[0.055] hover:border-yellow-300/25 hover:bg-yellow-400/[0.07]'}`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl border border-yellow-300/20 bg-yellow-400/10 text-sm font-black text-yellow-100">
            {post.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h4 className="break-words text-lg font-black text-yellow-50">{post.author}</h4>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/42">{post.role} · {post.time}</p>
              </div>
              <CommunityPrototypeBadge tone={post.category === 'Erfolg' ? 'green' : post.category === 'Support' ? 'red' : post.category === 'Frage' ? 'blue' : 'gold'}>
                {post.category}
              </CommunityPrototypeBadge>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/70">{post.text}</p>
            {post.attachment && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-yellow-300/20 bg-yellow-400/10 p-3 text-sm text-yellow-100">
                <ImagePlus size={17} className="shrink-0" />
                <span className="min-w-0 break-words">{post.attachment}</span>
              </div>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:flex sm:flex-wrap">
              <AdminPrototypeActionButton><Star size={14} /> {post.likes} Likes</AdminPrototypeActionButton>
              <AdminPrototypeActionButton><MessageCircle size={14} /> {post.comments} Kommentare</AdminPrototypeActionButton>
              <AdminPrototypeActionButton><ShieldCheck size={14} /> Speichern</AdminPrototypeActionButton>
              <AdminPrototypeActionButton><Bell size={14} /> Melden</AdminPrototypeActionButton>
              <AdminPrototypeActionButton tone="primary" onClick={() => onReply(post.id)}>
                <MessageCircle size={14} /> Antworten
              </AdminPrototypeActionButton>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CommunityCommunicationPrototype({ partner, isAdmin }) {
  const [feedFilter, setFeedFilter] = useState('all');
  const [feedSort, setFeedSort] = useState('newest');
  const [qaSearch, setQaSearch] = useState('');
  const [selectedPostId, setSelectedPostId] = useState('');
  const [preparedTemplateId, setPreparedTemplateId] = useState('');
  const [composerMessage, setComposerMessage] = useState('');
  const [attachmentHint, setAttachmentHint] = useState('');
  const [postDraft, setPostDraft] = useState({
    type: 'Beitrag',
    category: 'Erfolg',
    visibility: 'Alle',
    text: '',
  });
  const communityPosts = useMemo(() => ([
    {
      id: 'community-post-001',
      initials: 'MK',
      author: 'Mara K.',
      role: 'Leader · freigegeben',
      time: 'vor 12 Min.',
      category: 'Erfolg',
      filter: 'success',
      text: 'Heute hat ein neuer Partner sein erstes Modul abgeschlossen. Was geholfen hat: ein klarer nächster Schritt und nur eine Aufgabe pro Tag.',
      attachment: 'Bild-/Datei-Hinweis: Screenshot vom Onboarding-Erfolg vorbereitet',
      likes: 42,
      comments: 8,
      order: 9,
    },
    {
      id: 'community-post-002',
      initials: 'DU',
      author: 'David U.',
      role: 'Partner · Startphase',
      time: 'vor 28 Min.',
      category: 'Frage',
      filter: 'question',
      text: 'Wie erkläre ich den Unterschied zwischen Filterkanne und Membranfilter kurz, ohne zu technisch zu werden?',
      attachment: '',
      likes: 16,
      comments: 0,
      order: 8,
    },
    {
      id: 'community-post-003',
      initials: 'EP',
      author: 'Elena P.',
      role: 'Partnerin · aktiv',
      time: 'Heute 10:15',
      category: 'Produkt',
      filter: 'product',
      text: 'Für Kundengespräche funktioniert bei mir die Reihenfolge: Alltagssituation, Wasserwissen, kurzer Test, dann offizielle Produktseite.',
      attachment: 'Datei-Hinweis: Gesprächsnotiz als PDF-Platzhalter',
      likes: 31,
      comments: 5,
      order: 7,
    },
    {
      id: 'community-post-004',
      initials: 'JB',
      author: 'Jonas B.',
      role: 'Leader Kandidat',
      time: 'Gestern',
      category: 'Recruiting',
      filter: 'recruiting',
      text: 'Mein bester Recruiting-Impuls diese Woche: nicht überzeugen, sondern Orientierung geben. Die Academy erledigt danach viel Strukturarbeit.',
      attachment: '',
      likes: 54,
      comments: 12,
      order: 6,
    },
    {
      id: 'community-post-005',
      initials: 'AN',
      author: 'Alina N.',
      role: 'Partnerin · Team Süd',
      time: 'Gestern',
      category: 'Support',
      filter: 'support',
      text: 'Ich brauche Hilfe beim ersten Wassertest. Welche Unterlage sollte ich vorher lesen?',
      attachment: '',
      likes: 9,
      comments: 2,
      order: 5,
    },
    {
      id: 'community-post-006',
      initials: 'AT',
      author: 'Academy Team',
      role: 'Admin · offiziell',
      time: 'Mo.',
      category: 'Event',
      filter: 'team',
      text: 'Diese Woche Fokus: Onboarding abschließen, erstes Kundengespräch vorbereiten und offene Fragen öffentlich stellen, damit alle lernen.',
      attachment: 'Event-Hinweis: Community Call Vorschau',
      likes: 76,
      comments: 18,
      order: 4,
    },
  ]), []);
  const questions = useMemo(() => ([
    {
      id: 'qa-001',
      title: 'Wie starte ich mein erstes Kundengespräch?',
      category: 'Verkauf',
      status: 'offen',
      answers: 3,
      video: true,
      text: 'Nutze zuerst Alltagssituation und Frage, danach erst Produktunterlagen.',
    },
    {
      id: 'qa-002',
      title: 'Welche Unterlage ist für den PPM-Test wichtig?',
      category: 'Produkt',
      status: 'beantwortet',
      answers: 5,
      video: false,
      text: 'Das Testlabor-Modul und die Wasser-Präsentation bilden die Grundlage.',
    },
    {
      id: 'qa-003',
      title: 'Wie begleite ich einen neuen Partner?',
      category: 'Leader',
      status: 'beantwortet',
      answers: 2,
      video: true,
      text: 'Nur einen nächsten Schritt geben: Profil, Willkommen-Modul, dann Termin.',
    },
    {
      id: 'qa-004',
      title: 'Darf ich Preise öffentlich posten?',
      category: 'Compliance',
      status: 'offen',
      answers: 1,
      video: false,
      text: 'Interne Partnerpreise gehören nicht in öffentliche Social-Media-Beiträge.',
    },
  ]), []);
  const announcements = [
    { id: 'ann-001', type: 'Neue Schulung', title: 'Testlabor Fokuswoche', text: 'Diese Woche stehen PPM, Tee-Test und Gesprächsführung im Mittelpunkt.', status: 'Wichtig' },
    { id: 'ann-002', type: 'Termin', title: 'Community Call Vorbereitung', text: 'Bereite eine konkrete Frage oder einen Kundendialog vor.', status: 'Geplant' },
    { id: 'ann-003', type: 'Produkt', title: 'Produktunterlagen prüfen', text: 'Neue PDF-Hinweise werden im Download Center sichtbar vorbereitet.', status: 'Update' },
    { id: 'ann-004', type: 'Systemhinweis', title: 'Community-Regeln gelten für alle', text: 'Bitte keine Spam-Nachrichten und keine unerlaubten Direktnachrichten.', status: 'Hinweis' },
  ];
  const leaderTemplates = [
    {
      id: 'leader-template-001',
      title: 'Onboarding-Erinnerung',
      text: 'Hi [Name], dein nächster einfacher Schritt ist das Willkommen-Modul. Nimm dir 10 Minuten und schreib mir danach eine Frage.',
    },
    {
      id: 'leader-template-002',
      title: 'Motivation nach Inaktivität',
      text: 'Hi [Name], kein Stress – lass uns mit einem kleinen Schritt wieder starten. Öffne heute nur ein Modul und markiere deine wichtigste Erkenntnis.',
    },
    {
      id: 'leader-template-003',
      title: 'Event-Einladung',
      text: 'Hi [Name], diese Woche gibt es einen kurzen Community-Fokus. Bring eine Frage mit, die dir beim Kundengespräch helfen würde.',
    },
    {
      id: 'leader-template-004',
      title: 'Follow-up nach Erfolg',
      text: 'Stark gemacht, [Name]. Teile gern kurz, was funktioniert hat – das hilft dem ganzen Team.',
    },
  ];
  const moderationItems = [
    { id: 'mod-001', title: 'Gemeldeter Beitrag', reason: 'Unklare Produktaussage prüfen', priority: 'Hoch' },
    { id: 'mod-002', title: 'Offene Supportfrage', reason: 'Antwort vom Academy Team empfohlen', priority: 'Mittel' },
    { id: 'mod-003', title: 'Beitrag zur Prüfung', reason: 'Direktnachrichten-Hinweis kontrollieren', priority: 'Mittel' },
  ];
  const rules = [
    'Respektvoller Umgang – wir bauen Vertrauen, nicht Druck.',
    'Keine Spam-Nachrichten und keine Copy-Paste-Flut.',
    'Keine unerlaubten Direktnachrichten an Partner.',
    'Mehrwert zuerst: Erfahrung, Frage oder konkrete Hilfe teilen.',
    'Fragen möglichst öffentlich stellen, damit alle lernen.',
    'Erfolge teilen – kurz, ehrlich und nachvollziehbar.',
    'Support über die richtigen Kanäle klären.',
  ];
  const feedFilterOptions = [
    ['all', 'Alle Beiträge'],
    ['question', 'Fragen'],
    ['success', 'Erfolge'],
    ['support', 'Support'],
    ['product', 'Produkt'],
    ['recruiting', 'Recruiting'],
    ['team', 'Team'],
  ];
  const filteredPosts = useMemo(() => {
    const posts = communityPosts
      .filter((post) => feedFilter === 'all' || post.filter === feedFilter)
      .filter((post) => feedSort !== 'unanswered' || (post.category === 'Frage' && post.comments === 0))
      .sort((left, right) => {
        if (feedSort === 'popular') {
          return right.likes - left.likes;
        }

        if (feedSort === 'unanswered') {
          return left.comments - right.comments || right.order - left.order;
        }

        return right.order - left.order;
      });

    return posts;
  }, [communityPosts, feedFilter, feedSort]);
  const normalizedQaSearch = qaSearch.trim().toLowerCase();
  const visibleQuestions = questions.filter((question) => {
    if (!normalizedQaSearch) {
      return true;
    }

    return [question.title, question.category, question.text]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQaSearch);
  });
  const openQuestionsCount = questions.filter((question) => question.status === 'offen').length;
  const answeredQuestionsCount = questions.filter((question) => question.status === 'beantwortet').length;
  const currentPartnerName = partner?.firstName || 'Partner';

  const updateDraft = (field, value) => {
    setPostDraft((current) => ({ ...current, [field]: value }));
  };

  const prepareAttachmentUi = () => {
    setAttachmentHint('Datei-/Foto-Anhang vorbereitet · kein Upload gestartet');
  };

  const publishUiOnly = () => {
    setComposerMessage('Beitrag vorbereitet. Es wurde nichts gespeichert und keine Nachricht gesendet.');
  };

  const replyUiOnly = (postId) => {
    setSelectedPostId(postId);
    setComposerMessage('Antwort-UI geöffnet. Keine Antwort wurde veröffentlicht.');
  };

  return (
    <section className="space-y-5">
      <Card className="overflow-hidden rounded-[2.25rem] border border-yellow-300/25 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.20),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.09),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.035),rgba(0,0,0,0.48))] text-white shadow-2xl shadow-yellow-500/10 backdrop-blur-xl">
        <CardContent className="p-5 sm:p-7 md:p-9">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <span className="rounded-full border border-yellow-300/25 bg-yellow-400/12 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-yellow-100">
                Community Vorschau · Mockdaten · keine Backend-Aktion
              </span>
              <h2 className="mt-4 break-words text-4xl font-black leading-tight text-yellow-50 md:text-5xl">
                Willkommen in der Harbor Community, {currentPartnerName}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/62">
                Ein professioneller Kommunikationsbereich für Erfahrung, Fragen, Erfolge, Ankündigungen und Teamführung – vorbereitet als sichere Frontend-UI.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:min-w-[24rem]">
              <AdminPrototypeActionButton tone="primary"><Send size={14} /> Beitrag erstellen</AdminPrototypeActionButton>
              <AdminPrototypeActionButton><FileQuestion size={14} /> Frage stellen</AdminPrototypeActionButton>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <AdminPrototypeMetricCard icon={Flame} label="Community-Status" value="Aktiv" trend="Heute" />
        <AdminPrototypeMetricCard icon={Users} label="Aktive Partner" value="214" trend="Mock" />
        <AdminPrototypeMetricCard icon={MessageCircle} label="Neue Beiträge" value={communityPosts.length} trend="Feed" />
        <AdminPrototypeMetricCard icon={FileQuestion} label="Offene Fragen" value={openQuestionsCount} trend={`${answeredQuestionsCount} beantwortet`} />
        <AdminPrototypeMetricCard icon={Trophy} label="Top-Beiträge" value="3" trend="beliebt" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.62fr]">
        <Card className="rounded-[2rem] border border-white/10 bg-white/[0.055] text-white backdrop-blur-xl">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Beitragsfeed</p>
                <h3 className="mt-2 text-2xl font-black text-yellow-50">Erfolge, Fragen und Teamimpulse</h3>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:w-[26rem]">
                <select value={feedFilter} onChange={(event) => setFeedFilter(event.target.value)} className="min-h-11 rounded-2xl border border-white/10 bg-black/55 px-3 text-sm font-bold text-white outline-none">
                  {feedFilterOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <select value={feedSort} onChange={(event) => setFeedSort(event.target.value)} className="min-h-11 rounded-2xl border border-white/10 bg-black/55 px-3 text-sm font-bold text-white outline-none">
                  <option value="newest">Neueste</option>
                  <option value="popular">Beliebteste</option>
                  <option value="unanswered">Unbeantwortet</option>
                </select>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {filteredPosts.map((post) => (
                <CommunityPostCard key={post.id} post={post} active={selectedPostId === post.id} onReply={replyUiOnly} />
              ))}
              {filteredPosts.length === 0 && (
                <div className="rounded-3xl border border-white/10 bg-black/25 p-5 text-sm text-white/55">
                  Keine Beiträge für diesen Filter gefunden.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Panel title="Beitrag erstellen · UI" icon={Send}>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <label className="block">
                  <span className="mb-1 block text-xs text-white/50">Beitragstyp</span>
                  <select value={postDraft.type} onChange={(event) => updateDraft('type', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm outline-none focus:border-yellow-300/70">
                    {['Beitrag', 'Frage', 'Erfolg', 'Ankündigung'].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-white/50">Kategorie</span>
                  <select value={postDraft.category} onChange={(event) => updateDraft('category', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm outline-none focus:border-yellow-300/70">
                    {['Erfolg', 'Frage', 'Produkt', 'Verkauf', 'Recruiting', 'Motivation', 'Event', 'Support'].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs text-white/50">Text</span>
                <textarea
                  value={postDraft.text}
                  onChange={(event) => updateDraft('text', event.target.value)}
                  placeholder="Was möchtest du mit der Community teilen?"
                  className="min-h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-yellow-300/70"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-white/50">Sichtbarkeit</span>
                <select value={postDraft.visibility} onChange={(event) => updateDraft('visibility', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm outline-none focus:border-yellow-300/70">
                  {['Alle', 'Team', 'Leader', 'Admin'].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <div className="rounded-2xl border border-yellow-300/15 bg-yellow-400/10 p-3 text-sm text-yellow-100">
                <button type="button" onClick={prepareAttachmentUi} className="inline-flex items-center gap-2 font-black">
                  <Upload size={16} /> Datei/Foto anhängen als UI
                </button>
                <p className="mt-2 text-xs text-yellow-100/75">{attachmentHint || 'Kein echter Upload, keine Storage-Aktion.'}</p>
              </div>
              {composerMessage && <AuthMessage>{composerMessage}</AuthMessage>}
              <Button type="button" onClick={publishUiOnly} className="w-full rounded-2xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300">
                <Send size={16} /> Veröffentlichen
              </Button>
            </div>
          </Panel>

          <Panel title="Community-Regeln" icon={ShieldCheck}>
            <div className="space-y-2">
              {rules.map((rule) => (
                <div key={rule} className="flex gap-3 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-white/68">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-yellow-200" />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel title="Fragen & Antworten" icon={FileQuestion}>
          <div className="flex min-h-11 items-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-3 focus-within:border-yellow-300/55">
            <Search size={16} className="text-yellow-200" />
            <input
              type="search"
              value={qaSearch}
              onChange={(event) => setQaSearch(event.target.value)}
              placeholder="Frage, Kategorie oder Stichwort suchen"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/35"
            />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <CommunityPrototypeBadge tone="gold">Häufige Fragen</CommunityPrototypeBadge>
            <CommunityPrototypeBadge tone="blue">{openQuestionsCount} offen</CommunityPrototypeBadge>
            <CommunityPrototypeBadge tone="green">{answeredQuestionsCount} beantwortet</CommunityPrototypeBadge>
          </div>
          <div className="mt-5 space-y-3">
            {visibleQuestions.map((question) => (
              <div key={question.id} className="rounded-3xl border border-white/10 bg-black/25 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-words font-black text-yellow-50">{question.title}</p>
                    <p className="mt-1 text-sm text-white/58">{question.text}</p>
                  </div>
                  <CommunityPrototypeBadge tone={question.status === 'beantwortet' ? 'green' : 'blue'}>{question.status}</CommunityPrototypeBadge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <CommunityPrototypeBadge>{question.category}</CommunityPrototypeBadge>
                  <CommunityPrototypeBadge>{question.answers} Antworten</CommunityPrototypeBadge>
                  {question.video && <CommunityPrototypeBadge tone="gold"><Video size={12} /> Videoantwort vorhanden</CommunityPrototypeBadge>}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <AdminPrototypeActionButton>Antwort ansehen</AdminPrototypeActionButton>
                  <AdminPrototypeActionButton><Star size={14} /> Antwort als hilfreich markieren</AdminPrototypeActionButton>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Offizielle Ankündigungen" icon={Bell}>
          <div className="grid gap-3 md:grid-cols-2">
            {announcements.map((item) => (
              <div key={item.id} className="rounded-3xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-start justify-between gap-3">
                  <CommunityPrototypeBadge tone="gold">{item.type}</CommunityPrototypeBadge>
                  <CommunityPrototypeBadge>{item.status}</CommunityPrototypeBadge>
                </div>
                <h4 className="mt-3 break-words text-lg font-black text-yellow-50">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/62">{item.text}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.72fr]">
        <Panel title="Leader-Kommunikation" icon={Crown}>
          <div className="grid gap-3 md:grid-cols-2">
            {leaderTemplates.map((template) => (
              <div key={template.id} className="rounded-3xl border border-white/10 bg-black/25 p-4">
                <h4 className="break-words font-black text-yellow-50">{template.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/62">{template.text}</p>
                <AdminPrototypeActionButton tone={preparedTemplateId === template.id ? 'primary' : 'neutral'} onClick={() => setPreparedTemplateId(template.id)}>
                  <MessageCircle size={14} /> {preparedTemplateId === template.id ? 'WhatsApp-Text vorbereitet' : 'WhatsApp-Text kopieren'}
                </AdminPrototypeActionButton>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-3xl border border-yellow-300/15 bg-yellow-400/[0.08] p-4">
            <p className="font-black text-yellow-50">Nachricht an Team vorbereiten</p>
            <p className="mt-1 text-sm text-white/60">UI-only: kein Versand, keine WhatsApp-Integration, keine Partnerdatenänderung.</p>
            <textarea
              readOnly
              value={preparedTemplateId ? leaderTemplates.find((template) => template.id === preparedTemplateId)?.text : 'Wähle eine Vorlage aus, um einen Teamtext vorzubereiten.'}
              className="mt-3 min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white/65 outline-none"
              aria-label="Leader Nachricht Vorschau"
            />
          </div>
        </Panel>

        <Panel title="Moderationsvorschau" icon={Settings}>
          <p className="mb-4 text-sm leading-relaxed text-white/60">
            Admin/Leader Vorschau · {isAdmin ? 'Admin angemeldet' : 'keine echte Rollenänderung'} · alle Aktionen sind UI-only.
          </p>
          <div className="space-y-3">
            {moderationItems.map((item) => (
              <div key={item.id} className="rounded-3xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="break-words font-black text-yellow-50">{item.title}</h4>
                    <p className="mt-1 text-sm text-white/55">{item.reason}</p>
                  </div>
                  <CommunityPrototypeBadge tone={item.priority === 'Hoch' ? 'red' : 'gold'}>{item.priority}</CommunityPrototypeBadge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {['prüfen', 'ausblenden', 'beantworten', 'markieren', 'archivieren'].map((action) => (
                    <AdminPrototypeActionButton key={action}>{action}</AdminPrototypeActionButton>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </section>
  );
}

function LeaderReadinessPill({ ready, label }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-black ring-1 ${ready ? 'bg-emerald-400/15 text-emerald-100 ring-emerald-300/20' : 'bg-yellow-400/12 text-yellow-100 ring-yellow-300/20'}`}>
      {ready ? <CheckCircle2 size={13} /> : <Circle size={13} />}
      {label}
    </span>
  );
}

function LeaderProgressBar({ value, label }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs font-black text-white/55">
        <span>{label}</span>
        <span className="text-yellow-100">{safeValue}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-700 via-yellow-300 to-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.35)]"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

function LeaderTrendBadge({ trend }) {
  const trendMap = {
    up: { label: '↗ steigt', className: 'bg-emerald-400/15 text-emerald-100 ring-emerald-300/20' },
    equal: { label: '→ stabil', className: 'bg-white/10 text-white/65 ring-white/10' },
    down: { label: '↘ prüfen', className: 'bg-yellow-400/15 text-yellow-100 ring-yellow-300/20' },
  };
  const item = trendMap[trend] || trendMap.equal;

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ring-1 ${item.className}`}>
      {item.label}
    </span>
  );
}

function isLeaderAnalyticsPartner(partner) {
  if (!partner || partner.role === 'admin') {
    return false;
  }

  const role = String(partner.role || '').toLowerCase();
  const level = String(partner.aquaLevel || '').toLowerCase();
  const teamSize = toPartnerCount(partner.teamPartnerCount || 0);

  return role.includes('leader')
    || role.includes('team')
    || level.includes('leader')
    || level.includes('builder')
    || teamSize > 0;
}

function getAnalyticsTimestamp(value) {
  const timestamp = new Date(value || 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function getAnalyticsRangeStart(range, now = new Date()) {
  if (range === 'all') {
    return 0;
  }

  const days = Number(range) || 30;
  return now.getTime() - (days * 24 * 60 * 60 * 1000);
}

function isInAnalyticsRange(value, range, now = new Date()) {
  if (range === 'all') {
    return true;
  }

  const timestamp = getAnalyticsTimestamp(value);
  return timestamp > 0 && timestamp >= getAnalyticsRangeStart(range, now);
}

function getAnalyticsPartnerProgress(partner) {
  const storedProgress = Number(partner?.academyProgress?.progressPercent);

  if (Number.isFinite(storedProgress) && storedProgress > 0) {
    return Math.max(0, Math.min(100, Math.round(storedProgress)));
  }

  return getPartnerAcademySummary(partner).overallProgress || 0;
}

function getAnalyticsCompletedModuleCount(partner) {
  const storedCount = Number(partner?.academyProgress?.completedModuleCount);

  if (Number.isFinite(storedCount) && storedCount > 0) {
    return storedCount;
  }

  return getPartnerAcademySummary(partner).completedCount || 0;
}

function getAnalyticsQuizState(partner) {
  const progress = partner?.academyProgress || {};
  const hasQuizData = progress.quizPassed !== undefined
    || progress.certificationPassed !== undefined
    || progress.quizScore !== undefined
    || progress.certificationScore !== undefined;

  return {
    hasQuizData,
    passed: Boolean(progress.quizPassed || progress.certificationPassed || Number(progress.quizScore || progress.certificationScore || 0) >= 80),
  };
}

function filterAnalyticsPartners(partners, filters, now = new Date()) {
  const normalizedTeam = String(filters.team || 'all');
  const normalizedLanguage = String(filters.language || 'all');

  return partners
    .filter((partner) => isRealApprovedPartner(partner) || ['pending', 'blocked', 'rejected'].includes(partner.status))
    .filter((partner) => !partner.testData && partner.role !== 'admin')
    .filter((partner) => filters.status === 'all' || partner.status === filters.status)
    .filter((partner) => normalizedTeam === 'all' || String(partner.teamName || 'Ohne Team') === normalizedTeam)
    .filter((partner) => normalizedLanguage === 'all' || String(partner.preferredLanguage || 'de') === normalizedLanguage)
    .filter((partner) => {
      if (filters.timeframe === 'all') {
        return true;
      }

      return isInAnalyticsRange(partner.createdAt, filters.timeframe, now)
        || isInAnalyticsRange(partner.lastActivityAt, filters.timeframe, now)
        || isInAnalyticsRange(partner.academyProgress?.lastTrainingActivityAt, filters.timeframe, now);
    })
    .filter((partner) => {
      if (filters.moduleId === 'all') {
        return true;
      }

      const moduleItem = PARTNER_ACADEMY_MODULES.find((item) => item.id === filters.moduleId);
      return moduleItem ? getPartnerAcademyModuleProgress(moduleItem, partner.academyProgress).percent > 0 : true;
    });
}

function buildAcademyAnalyticsRows(partners, moduleId = 'all') {
  const modules = PARTNER_ACADEMY_MODULES.filter((moduleItem) => moduleId === 'all' || moduleItem.id === moduleId);

  return modules.map((moduleItem) => {
    const progressRows = partners.map((partner) => getPartnerAcademyModuleProgress(moduleItem, partner.academyProgress));
    const started = progressRows.filter((progress) => progress.percent > 0).length;
    const completed = progressRows.filter((progress) => progress.percent >= 100).length;
    const averageProgress = progressRows.length
      ? Math.round(progressRows.reduce((sum, progress) => sum + progress.percent, 0) / progressRows.length)
      : 0;
    const totalLessons = Math.max((moduleItem.videoIds || []).length + (moduleItem.pdfIds || []).length + (moduleItem.hasTask ? 1 : 0), 1);
    const completedLessons = progressRows.reduce((sum, progress) => sum + Math.min(totalLessons, Math.round((progress.percent / 100) * totalLessons)), 0);
    const openLessons = Math.max(0, (partners.length * totalLessons) - completedLessons);
    const dropoutRate = started > 0 ? Math.round(((started - completed) / started) * 100) : 0;
    const completionRate = partners.length > 0 ? Math.round((completed / partners.length) * 100) : 0;

    return {
      id: moduleItem.id,
      title: moduleItem.title,
      category: moduleItem.category,
      averageProgress,
      started,
      completed,
      dropoutRate,
      openLessons,
      completedLessons,
      completionRate,
      videoCount: (moduleItem.videoIds || []).length,
    };
  }).sort((left, right) => right.started - left.started || right.averageProgress - left.averageProgress);
}

function buildVideoAnalyticsRows(partners) {
  const videoMap = new Map(academyVideos.map((video) => [video.id, video]));
  const completionCounts = new Map();

  partners.forEach((partner) => {
    const completedVideos = partner.academyProgress?.completedVideos || {};
    Object.keys(completedVideos).forEach((videoId) => {
      if (completedVideos[videoId]) {
        completionCounts.set(videoId, (completionCounts.get(videoId) || 0) + 1);
      }
    });
  });

  return Array.from(completionCounts.entries())
    .map(([videoId, count]) => {
      const video = videoMap.get(videoId);
      return {
        id: videoId,
        title: video?.title || videoId,
        category: video?.category || 'Academy',
        count,
        duration: video?.duration || '-',
      };
    })
    .sort((left, right) => right.count - left.count)
    .slice(0, 8);
}

function buildAnalyticsCsv(rows, filename) {
  if (typeof window === 'undefined' || !rows.length) {
    return;
  }

  const headers = Object.keys(rows[0]);
  const escapeValue = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  const csv = [
    headers.map(escapeValue).join(','),
    ...rows.map((row) => headers.map((header) => escapeValue(row[header])).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

function AnalyticsStateCard({ state = 'ready', title, text }) {
  const stateConfig = {
    ready: { icon: CheckCircle2, className: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100' },
    empty: { icon: FileQuestion, className: 'border-yellow-300/20 bg-yellow-400/10 text-yellow-100' },
    error: { icon: Bell, className: 'border-red-300/20 bg-red-400/10 text-red-100' },
    loading: { icon: Clock, className: 'border-white/10 bg-white/10 text-white/65' },
  };
  const item = stateConfig[state] || stateConfig.ready;
  const Icon = item.icon;

  return (
    <div className={`rounded-3xl border p-4 ${item.className}`}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black/25">
          <Icon size={17} />
        </span>
        <span className="min-w-0">
          <span className="block break-words text-sm font-black">{title}</span>
          <span className="mt-1 block text-xs leading-relaxed opacity-75">{text}</span>
        </span>
      </div>
    </div>
  );
}

function AnalyticsTable({ title, icon: Icon, columns, rows, emptyText, exportFileName }) {
  return (
    <Panel title={title} icon={Icon}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-white/55">{rows.length} Einträge · Read-only</p>
        <button
          type="button"
          onClick={() => buildAnalyticsCsv(rows, exportFileName)}
          disabled={!rows.length}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-black text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Download size={14} /> CSV exportieren
        </button>
      </div>

      {rows.length === 0 ? (
        <AnalyticsStateCard state="empty" title="Keine Daten verfügbar" text={emptyText} />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-3xl border border-white/10 lg:block">
            <table className="w-full min-w-[46rem] text-left text-sm">
              <thead className="bg-black/45 text-xs uppercase tracking-[0.14em] text-white/42">
                <tr>
                  {columns.map((column) => (
                    <th key={column.key} className="px-4 py-3 font-black">{column.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {rows.map((row) => (
                  <tr key={row.id || row.title || row.name} className="bg-black/20">
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-4 text-white/68">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 lg:hidden">
            {rows.map((row) => (
              <div key={row.id || row.title || row.name} className="rounded-3xl border border-white/10 bg-black/25 p-4">
                {columns.map((column) => (
                  <div key={column.key} className="border-b border-white/10 py-2 last:border-b-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/38">{column.label}</p>
                    <p className="mt-1 break-words text-sm font-bold text-yellow-50">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </Panel>
  );
}

function AnalyticsBusinessIntelligenceCenter({
  currentPartner,
  partners = [],
  communitySummary = {},
  isAdmin = false,
  isLeader = false,
}) {
  const [timeframe, setTimeframe] = useState('30');
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const now = useMemo(() => new Date(), []);
  const realAdminPartners = useMemo(
    () => partners.filter((partner) => !partner.testData && partner.role !== 'admin'),
    [partners],
  );
  const filters = useMemo(() => ({
    timeframe,
    status: statusFilter,
    team: teamFilter,
    moduleId: moduleFilter,
    language: languageFilter,
  }), [languageFilter, moduleFilter, statusFilter, teamFilter, timeframe]);
  const filteredPartners = useMemo(
    () => (isAdmin ? filterAnalyticsPartners(realAdminPartners, filters, now) : []),
    [filters, isAdmin, now, realAdminPartners],
  );
  const analyticsPartners = useMemo(
    () => (isAdmin ? filteredPartners : []),
    [filteredPartners, isAdmin],
  );
  const adminTotals = useMemo(() => {
    const quizStates = analyticsPartners.map(getAnalyticsQuizState);
    const quizDataCount = quizStates.filter((item) => item.hasQuizData).length;
    const quizPassedCount = quizStates.filter((item) => item.hasQuizData && item.passed).length;
    const averageProgress = analyticsPartners.length
      ? Math.round(analyticsPartners.reduce((sum, partner) => sum + getAnalyticsPartnerProgress(partner), 0) / analyticsPartners.length)
      : 0;

    return {
      totalRegistered: realAdminPartners.length,
      active7: realAdminPartners.filter((partner) => isInAnalyticsRange(partner.lastActivityAt || partner.academyProgress?.lastTrainingActivityAt, '7', now)).length,
      active30: realAdminPartners.filter((partner) => isInAnalyticsRange(partner.lastActivityAt || partner.academyProgress?.lastTrainingActivityAt, '30', now)).length,
      active90: realAdminPartners.filter((partner) => isInAnalyticsRange(partner.lastActivityAt || partner.academyProgress?.lastTrainingActivityAt, '90', now)).length,
      newRegistrations: realAdminPartners.filter((partner) => isInAnalyticsRange(partner.createdAt, timeframe, now)).length,
      pending: realAdminPartners.filter((partner) => partner.status === 'pending').length,
      blocked: realAdminPartners.filter((partner) => partner.status === 'blocked').length,
      averageProgress,
      completedModules: analyticsPartners.reduce((sum, partner) => sum + getAnalyticsCompletedModuleCount(partner), 0),
      quizRate: quizDataCount ? Math.round((quizPassedCount / quizDataCount) * 100) : null,
      certificates: analyticsPartners.filter((partner) => partner.academyProgress?.certificationPassed || partner.academyProgress?.onboardingStatus === 'completed').length,
    };
  }, [analyticsPartners, now, realAdminPartners, timeframe]);
  const teamOptions = useMemo(() => (
    Array.from(new Set(realAdminPartners.map((partner) => String(partner.teamName || 'Ohne Team')))).sort((left, right) => left.localeCompare(right, 'de-DE'))
  ), [realAdminPartners]);
  const languageOptions = useMemo(() => (
    Array.from(new Set(realAdminPartners.map((partner) => String(partner.preferredLanguage || 'de')))).sort()
  ), [realAdminPartners]);
  const academyRows = useMemo(
    () => buildAcademyAnalyticsRows(analyticsPartners, moduleFilter),
    [analyticsPartners, moduleFilter],
  );
  const videoRows = useMemo(() => buildVideoAnalyticsRows(analyticsPartners), [analyticsPartners]);
  const supportRows = useMemo(() => analyticsPartners
    .map((partner) => ({
      id: partner.id,
      name: `${partner.firstName} ${partner.lastName}`.trim() || partner.email || partner.id,
      status: partner.status,
      team: partner.teamName || 'Ohne Team',
      progress: `${getAnalyticsPartnerProgress(partner)}%`,
      lastActivity: partner.lastActivityAt ? formatAdminDate(partner.lastActivityAt) : 'Nicht erfasst',
      recommendation: getPartnerOnboardingRecommendation(partner),
    }))
    .filter((partner) => partner.status !== 'approved' || partner.progress === '0%' || partner.lastActivity === 'Nicht erfasst' || partner.recommendation !== 'Onboarding abgeschlossen – nächste Entwicklungsstufe planen')
    .slice(0, 12), [analyticsPartners]);
  const partnerRows = useMemo(() => analyticsPartners.map((partner) => ({
    id: partner.id,
    name: `${partner.firstName} ${partner.lastName}`.trim() || partner.email || partner.id,
    status: partner.status,
    team: partner.teamName || 'Ohne Team',
    language: partner.preferredLanguage || 'de',
    progress: `${getAnalyticsPartnerProgress(partner)}%`,
    modules: getAnalyticsCompletedModuleCount(partner),
    activity: partner.lastActivityAt ? formatAdminDate(partner.lastActivityAt) : 'Nicht erfasst',
  })), [analyticsPartners]);
  const leaderTeamSize = toPartnerCount(currentPartner?.teamPartnerCount || 0);
  const leaderTarget = Math.max(toPartnerCount(currentPartner?.teamTargetPartnerCount || 10), 1);
  const leaderTeamProgress = Math.max(0, Math.min(100, Math.round((leaderTeamSize / leaderTarget) * 100)));
  const leaderProgress = getAnalyticsPartnerProgress(currentPartner);
  const leaderRows = [
    {
      id: currentPartner?.id || 'own-profile',
      name: `${currentPartner?.firstName || 'Eigenes'} ${currentPartner?.lastName || 'Profil'}`.trim(),
      team: currentPartner?.teamName || 'Eigenes Team',
      level: currentPartner?.aquaLevel || 'Starter',
      progress: `${leaderProgress}%`,
      points: formatPoints(currentPartner?.aquaPoints || 0),
      status: currentPartner?.status || 'approved',
    },
  ];
  const adminKpis = [
    { icon: Users, label: 'Partner gesamt', value: adminTotals.totalRegistered, trend: 'geschützt geladen' },
    { icon: Flame, label: 'Aktiv 7 Tage', value: adminTotals.active7, trend: 'letzte 7 Tage' },
    { icon: TrendingUp, label: 'Aktiv 30 Tage', value: adminTotals.active30, trend: 'letzte 30 Tage' },
    { icon: Clock, label: 'Aktiv 90 Tage', value: adminTotals.active90, trend: 'letzte 90 Tage' },
    { icon: CalendarDays, label: 'Neue Registrierungen', value: adminTotals.newRegistrations, trend: timeframe === 'all' ? 'alle' : `${timeframe} Tage` },
    { icon: Bell, label: 'Wartende Freigaben', value: adminTotals.pending, trend: 'Pending' },
    { icon: Lock, label: 'Gesperrte Accounts', value: adminTotals.blocked, trend: 'Status' },
    { icon: BookOpen, label: 'Ø Lernfortschritt', value: `${adminTotals.averageProgress}%`, trend: 'gefiltert' },
    { icon: CheckCircle2, label: 'Module abgeschlossen', value: adminTotals.completedModules, trend: 'Summe' },
    { icon: FileQuestion, label: 'Quiz-Erfolgsquote', value: adminTotals.quizRate === null ? '—' : `${adminTotals.quizRate}%`, trend: adminTotals.quizRate === null ? 'keine Daten' : 'Quiz' },
    { icon: Trophy, label: 'Zertifikate', value: adminTotals.certificates, trend: 'ableitbar' },
    { icon: Download, label: 'Downloads', value: '—', trend: 'Tracking fehlt' },
  ];
  const leaderKpis = [
    { icon: Users, label: 'Teamgröße', value: leaderTeamSize, trend: currentPartner?.teamName || 'eigenes Team' },
    { icon: CalendarDays, label: 'Neue Partner', value: toPartnerCount(currentPartner?.teamNewPartnersSinceLastUpdate || 0), trend: 'seit Update' },
    { icon: Flame, label: 'Aktive Partner', value: '—', trend: 'Teamliste fehlt' },
    { icon: Clock, label: 'Inaktive Partner', value: '—', trend: 'Teamliste fehlt' },
    { icon: BookOpen, label: 'Eigener Modulfortschritt', value: `${leaderProgress}%`, trend: 'eigene Daten' },
    { icon: Trophy, label: 'Team-Zielfortschritt', value: `${leaderTeamProgress}%`, trend: `${leaderTeamSize}/${leaderTarget}` },
    { icon: Star, label: 'Top-Performer', value: '—', trend: 'serverseitig vorbereiten' },
    { icon: Bell, label: 'Unterstützungsbedarf', value: '—', trend: 'serverseitig vorbereiten' },
  ];
  const registrationChart = [
    { label: 'Gesamt', value: adminTotals.totalRegistered },
    { label: 'Neu', value: adminTotals.newRegistrations },
    { label: 'Pending', value: adminTotals.pending },
    { label: 'Gesperrt', value: adminTotals.blocked },
  ];
  const academyChart = academyRows.slice(0, 5).map((row) => ({ label: row.title.slice(0, 10), value: row.averageProgress }));
  const hasAdminData = isAdmin && realAdminPartners.length > 0;

  if (!isAdmin && !isLeader) {
    return (
      <AnalyticsStateCard
        state="error"
        title="Analytics nicht verfügbar"
        text="Globale Analytics sind nur für Admins und Leader vorgesehen."
      />
    );
  }

  return (
    <section className="space-y-5">
      <Card className="overflow-hidden rounded-[2.25rem] border border-yellow-300/25 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.10),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.035),rgba(0,0,0,0.50))] text-white shadow-2xl shadow-yellow-500/10 backdrop-blur-xl">
        <CardContent className="p-5 sm:p-7 md:p-9">
          <div className="grid gap-6 xl:grid-cols-[1fr_0.42fr] xl:items-end">
            <div className="min-w-0">
              <span className="rounded-full border border-yellow-300/25 bg-yellow-400/12 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-yellow-100">
                Analytics & Business Intelligence · Read-only
              </span>
              <h2 className="mt-4 break-words text-4xl font-black leading-tight text-yellow-50 md:text-5xl">
                Wachstum, Aktivität und Academy-Qualität verstehen
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/62">
                Admins sehen die vorhandenen geschützten Academy-Daten. Leader erhalten nur eigene Team-/Profilkennzahlen, solange kein serverseitig gefilterter Team-Endpunkt existiert.
              </p>
            </div>
            <div className="grid gap-3">
              <AnalyticsStateCard state="ready" title="Datenstatus" text={isAdmin ? 'Admin-Daten wurden bereits über die bestehende geschützte Partnerroute geladen.' : 'Leader-Ansicht nutzt ausschließlich eigene Teamfelder und keine globale Partnerliste.'} />
              <AnalyticsStateCard state={hasAdminData || !isAdmin ? 'ready' : 'empty'} title="Fehlerstatus" text="Keine neue API-Anfrage, keine produktive Schreiboperation und kein zusätzlicher Server-Endpunkt." />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border border-white/10 bg-white/[0.055] text-white backdrop-blur-xl">
        <CardContent className="p-5 sm:p-6">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <label className="block">
              <span className="mb-1 block text-xs text-white/50">Zeitraum</span>
              <select value={timeframe} onChange={(event) => setTimeframe(event.target.value)} className="w-full min-h-11 rounded-2xl border border-white/10 bg-black/55 px-3 text-sm font-bold text-white outline-none">
                <option value="7">7 Tage</option>
                <option value="30">30 Tage</option>
                <option value="90">90 Tage</option>
                <option value="all">Alle Daten</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-white/50">Status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full min-h-11 rounded-2xl border border-white/10 bg-black/55 px-3 text-sm font-bold text-white outline-none">
                <option value="all">Alle</option>
                <option value="approved">Freigegeben</option>
                <option value="pending">Pending</option>
                <option value="blocked">Gesperrt</option>
                <option value="rejected">Abgelehnt</option>
              </select>
            </label>
            {isAdmin && (
              <label className="block">
                <span className="mb-1 block text-xs text-white/50">Team / Leader</span>
                <select value={teamFilter} onChange={(event) => setTeamFilter(event.target.value)} className="w-full min-h-11 rounded-2xl border border-white/10 bg-black/55 px-3 text-sm font-bold text-white outline-none">
                  <option value="all">Alle Teams</option>
                  {teamOptions.map((team) => <option key={team} value={team}>{team}</option>)}
                </select>
              </label>
            )}
            <label className="block">
              <span className="mb-1 block text-xs text-white/50">Modul</span>
              <select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)} className="w-full min-h-11 rounded-2xl border border-white/10 bg-black/55 px-3 text-sm font-bold text-white outline-none">
                <option value="all">Alle Module</option>
                {PARTNER_ACADEMY_MODULES.map((moduleItem) => <option key={moduleItem.id} value={moduleItem.id}>{moduleItem.title}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-white/50">Sprache</span>
              <select value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value)} className="w-full min-h-11 rounded-2xl border border-white/10 bg-black/55 px-3 text-sm font-bold text-white outline-none">
                <option value="all">Alle Sprachen</option>
                {(isAdmin ? languageOptions : [currentPartner?.preferredLanguage || 'de']).map((language) => <option key={language} value={language}>{language.toUpperCase()}</option>)}
              </select>
            </label>
          </div>
        </CardContent>
      </Card>

      {isAdmin ? (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {adminKpis.map((metric) => (
              <AdminPrototypeMetricCard key={metric.label} {...metric} />
            ))}
          </section>

          <section className="grid gap-5 xl:grid-cols-3">
            <AdminPrototypeChart title="Registrierung & Status" icon={CalendarDays} data={registrationChart} />
            <AdminPrototypeChart title="Academy Fortschritt" icon={BookOpen} data={academyChart.length ? academyChart : [{ label: 'Leer', value: 0 }]} />
            <AdminPrototypeChart title="Community Signal" icon={MessageCircle} data={[
              { label: 'Fragen', value: Number(communitySummary.openQuestions || 0) },
              { label: 'Antworten', value: Number(communitySummary.answeredQuestions || 0) },
              { label: 'Nachrichten', value: Number(communitySummary.messages || 0) },
              { label: 'News', value: Number(communitySummary.notificationCount || 0) },
            ]} />
          </section>

          <section className="grid gap-5 xl:grid-cols-[1fr_0.78fr]">
            <AnalyticsTable
              title="Academy Analytics"
              icon={BookOpen}
              columns={[
                { key: 'title', label: 'Modul' },
                { key: 'averageProgress', label: 'Ø Fortschritt', render: (value) => `${value}%` },
                { key: 'started', label: 'Gestartet' },
                { key: 'completed', label: 'Abgeschlossen' },
                { key: 'dropoutRate', label: 'Abbruchquote', render: (value) => `${value}%` },
                { key: 'completionRate', label: 'Abschlussrate', render: (value) => `${value}%` },
              ]}
              rows={academyRows}
              emptyText="Für die aktuellen Filter wurden noch keine Modulfortschritte gefunden."
              exportFileName="harbor-academy-analytics.csv"
            />
            <AnalyticsTable
              title="Meistgesehene Videos"
              icon={Video}
              columns={[
                { key: 'title', label: 'Video' },
                { key: 'category', label: 'Kategorie' },
                { key: 'count', label: 'Abschlüsse' },
                { key: 'duration', label: 'Dauer' },
              ]}
              rows={videoRows}
              emptyText="Es liegen noch keine auswertbaren Videoabschlussdaten vor."
              exportFileName="harbor-video-analytics.csv"
            />
          </section>

          <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
            <AnalyticsTable
              title="Partner mit Unterstützungsbedarf"
              icon={Bell}
              columns={[
                { key: 'name', label: 'Partner' },
                { key: 'status', label: 'Status' },
                { key: 'team', label: 'Team' },
                { key: 'progress', label: 'Fortschritt' },
                { key: 'lastActivity', label: 'Aktivität' },
                { key: 'recommendation', label: 'Empfehlung' },
              ]}
              rows={supportRows}
              emptyText="Für die aktuellen Filter wurden keine offensichtlichen Risiko- oder Supportsignale gefunden."
              exportFileName="harbor-support-analytics.csv"
            />
            <AnalyticsTable
              title="Partner Analytics Tabelle"
              icon={Users}
              columns={[
                { key: 'name', label: 'Partner' },
                { key: 'status', label: 'Status' },
                { key: 'team', label: 'Team' },
                { key: 'language', label: 'Sprache' },
                { key: 'progress', label: 'Fortschritt' },
                { key: 'modules', label: 'Module' },
                { key: 'activity', label: 'Letzte Aktivität' },
              ]}
              rows={partnerRows}
              emptyText="Keine Partnerdaten für die aktuellen Filter vorhanden."
              exportFileName="harbor-partner-analytics.csv"
            />
          </section>

          <section className="grid gap-5 xl:grid-cols-3">
            <AnalyticsStateCard state="empty" title="Download-Analytics" text="Downloadtracking ist in den vorhandenen Daten nicht enthalten. CSV-/Download-Kennzahlen sind vorbereitet, aber nicht erfunden." />
            <AnalyticsStateCard state={adminTotals.quizRate === null ? 'empty' : 'ready'} title="Quiz-Erfolgsquote" text={adminTotals.quizRate === null ? 'Keine persistenten Quizdaten vorhanden; lokale Quizresultate werden nicht gespeichert.' : `Aktuelle Erfolgsquote: ${adminTotals.quizRate}%.`} />
            <AnalyticsStateCard state="ready" title="Sicherheit" text="Admin-Auswertung nutzt nur bereits serverseitig geschützte Admin-Daten. Keine neue Route, kein neuer Datenbankzugriff." />
          </section>
        </>
      ) : (
        <>
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {leaderKpis.map((metric) => (
              <AdminPrototypeMetricCard key={metric.label} {...metric} />
            ))}
          </section>

          <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <Panel title="Leader Team Analytics" icon={Users}>
              <div className="space-y-5">
                <LeaderProgressBar value={leaderTeamProgress} label="Team-Zielfortschritt" />
                <LeaderProgressBar value={leaderProgress} label="Eigener Academy-Fortschritt" />
                <div className="rounded-3xl border border-yellow-300/15 bg-yellow-400/[0.08] p-4">
                  <p className="text-sm font-black text-yellow-50">Rollenbasierte Sichtbarkeit</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/62">
                    Diese Leader-Ansicht zeigt keine globale Partnerliste. Für echte Top-Performer, inaktive Partner und Teamranking braucht es später einen serverseitig gefilterten Team-Endpunkt.
                  </p>
                </div>
              </div>
            </Panel>
            <AnalyticsTable
              title="Teamranking · vorbereitet"
              icon={Trophy}
              columns={[
                { key: 'name', label: 'Name' },
                { key: 'team', label: 'Team' },
                { key: 'level', label: 'Level' },
                { key: 'progress', label: 'Fortschritt' },
                { key: 'points', label: 'Punkte' },
                { key: 'status', label: 'Status' },
              ]}
              rows={leaderRows}
              emptyText="Keine Teamliste geladen."
              exportFileName="harbor-leader-team-analytics.csv"
            />
          </section>

          <section className="grid gap-5 xl:grid-cols-3">
            <AnalyticsStateCard state="empty" title="Top-Performer" text="Ohne serverseitig gefilterte Teamliste werden keine fremden Partnerdaten angezeigt." />
            <AnalyticsStateCard state="empty" title="Unterstützungsbedarf" text="Risikosignale für Teammitglieder werden erst angezeigt, wenn Teamdaten sicher scoped ausgeliefert werden." />
            <AnalyticsStateCard state="ready" title="Export" text="CSV-Export ist für die sichtbare Leader-Tabelle lokal im Browser vorbereitet." />
          </section>
        </>
      )}
    </section>
  );
}

function getGamificationModel(partner = {}) {
  const realPoints = Number(partner?.aquaPoints || 0);
  const totalPoints = realPoints > 0 ? realPoints : 3840;
  const levels = [
    {
      name: 'Starter',
      requiredPoints: 0,
      description: 'Startklar: Profil, Willkommen-Modul und erste Orientierung.',
      benefits: ['Start-Checkliste', 'Basis-Module', 'Community-Zugang'],
      badge: 'Basis',
    },
    {
      name: 'Aktiv',
      requiredPoints: 500,
      description: 'Regelmäßig lernen, erste Aufgaben abschließen und sichtbar aktiv werden.',
      benefits: ['Wochenimpulse', 'Badge-Sichtbarkeit', 'erste Ranking-Vorschau'],
      badge: 'Aktiv',
    },
    {
      name: 'Builder',
      requiredPoints: 1200,
      description: 'Kundengespräche vorbereiten, Tests sicher erklären und Follow-ups strukturieren.',
      benefits: ['Verkaufs-Checklisten', 'Praxisaufgaben', 'Kundengespräch-Fokus'],
      badge: 'Builder',
    },
    {
      name: 'Team Builder',
      requiredPoints: 2500,
      description: 'Eigene Partner begleiten und den ersten Teamrhythmus aufbauen.',
      benefits: ['Team-Aufgaben', 'Leader-Vorschau', 'Recruiting-Fokus'],
      badge: 'Team',
    },
    {
      name: 'Leader',
      requiredPoints: 5000,
      description: 'Struktur geben, Fortschritt lesen und Partner duplizierbar entwickeln.',
      benefits: ['Leader-Inhalte', 'Team-Anerkennung', 'Spezialtraining-Einladung'],
      badge: 'Leader',
    },
    {
      name: 'Senior Leader',
      requiredPoints: 9000,
      description: 'Mehrere aktive Partnerlinien stabilisieren und Academy-Rhythmus führen.',
      benefits: ['Senior-Training', 'Team-Diagnose', 'erweiterte Recognition'],
      badge: 'Senior',
    },
    {
      name: 'Elite Partner',
      requiredPoints: 15000,
      description: 'Vorbild im System: Training, Community, Kundenarbeit und Teamaufbau verbinden.',
      benefits: ['Elite-Sichtbarkeit', 'Mentor-Rolle', 'Premium-Anerkennung'],
      badge: 'Elite',
    },
  ];
  const currentIndex = levels.reduce((activeIndex, level, index) => (
    totalPoints >= level.requiredPoints ? index : activeIndex
  ), 0);
  const currentLevel = levels[currentIndex];
  const nextLevel = levels[currentIndex + 1] || currentLevel;
  const levelSpan = Math.max(1, nextLevel.requiredPoints - currentLevel.requiredPoints);
  const levelProgress = nextLevel === currentLevel
    ? 100
    : Math.max(0, Math.min(100, Math.round(((totalPoints - currentLevel.requiredPoints) / levelSpan) * 100)));
  const pointsToNext = Math.max(0, nextLevel.requiredPoints - totalPoints);

  return {
    totalPoints,
    weekPoints: 320,
    monthPoints: 1180,
    academyPoints: 1420,
    onboardingPoints: 780,
    communityPoints: 440,
    teamPoints: 1200,
    levels,
    currentLevel,
    nextLevel,
    levelProgress,
    pointsToNext,
    rankingPosition: 18,
    nextAction: 'Ein Academy-Modul abschließen und danach eine kurze Praxisaufgabe notieren.',
    motivation: 'Konstanz schlägt Tempo: ein sauberer Schritt pro Tag baut echte Partnerstärke auf.',
  };
}

function GamificationProgressBar({ value, label, helper }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs font-black text-white/55">
        <span>{label}</span>
        <span className="text-yellow-100">{safeValue}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-700 via-yellow-300 to-yellow-100 shadow-[0_0_22px_rgba(250,204,21,0.35)]"
          style={{ width: `${safeValue}%` }}
        />
      </div>
      {helper && <p className="mt-2 text-xs leading-relaxed text-white/45">{helper}</p>}
    </div>
  );
}

function GamificationDashboardTeaser({ partner, onNavigate }) {
  const model = getGamificationModel(partner);
  const badgeHints = [
    { title: 'Profil komplett', status: 'freigeschaltet', icon: UserCheck },
    { title: 'Erstes Modul', status: 'bereit für Abschluss', icon: BookOpen },
    { title: '7 Tage aktiv', status: 'noch 2 Tage', icon: Flame },
  ];

  return (
    <Card className="overflow-hidden rounded-[2rem] border border-yellow-300/20 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.16),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.075),rgba(255,255,255,0.035),rgba(0,0,0,0.45))] text-white shadow-2xl shadow-yellow-500/10 backdrop-blur-xl">
      <CardContent className="p-5 sm:p-6 md:p-7">
        <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr] xl:items-center">
          <div className="min-w-0">
            <span className="rounded-full border border-yellow-300/25 bg-yellow-400/12 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-yellow-100">
              Punkte · UI-Prototyp · keine Speicherung
            </span>
            <h3 className="mt-4 break-words text-2xl font-black text-yellow-50 md:text-3xl">
              Dein aktuelles Level: {model.currentLevel.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/62">{model.motivation}</p>
            <div className="mt-5">
              <GamificationProgressBar
                value={model.levelProgress}
                label={`${formatPoints(model.pointsToNext)} Punkte bis ${model.nextLevel.name}`}
                helper={`Mini-Ranking: Platz #${model.rankingPosition} · Gesamtpunkte: ${formatPoints(model.totalPoints)}`}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[1.5rem] border border-yellow-300/20 bg-yellow-400/10 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Nächste Aktion</p>
              <p className="mt-2 text-sm leading-relaxed text-yellow-50">{model.nextAction}</p>
              <Button type="button" onClick={() => onNavigate?.('gamification')} className="mt-4 w-full rounded-2xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300">
                Punkte ansehen <ChevronRight size={16} />
              </Button>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">Neue Badge-Hinweise</p>
              <div className="mt-3 grid gap-2">
                {badgeHints.map(({ title, status, icon: Icon }) => (
                  <div key={title} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-200 ring-1 ring-yellow-300/20">
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block break-words text-sm font-black text-yellow-50">{title}</span>
                      <span className="block text-xs text-white/45">{status}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GamificationLevelCard({ level, active, completed, progress }) {
  return (
    <div className={`rounded-[1.75rem] border p-4 transition hover:-translate-y-0.5 ${active ? 'border-yellow-300/45 bg-yellow-400/[0.12] shadow-lg shadow-yellow-500/10' : completed ? 'border-emerald-300/20 bg-emerald-400/[0.08]' : 'border-white/10 bg-white/[0.045]'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-lg font-black text-yellow-50">{level.name}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-white/42">{formatPoints(level.requiredPoints)} Punkte</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] ring-1 ${active ? 'bg-yellow-400 text-black ring-yellow-200/50' : completed ? 'bg-emerald-400/15 text-emerald-100 ring-emerald-300/20' : 'bg-white/10 text-white/55 ring-white/10'}`}>
          {active ? 'Aktuell' : completed ? 'Erreicht' : 'Gesperrt'}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/62">{level.description}</p>
      <div className="mt-4">
        <GamificationProgressBar value={completed ? 100 : active ? progress : 0} label={level.badge} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {level.benefits.map((benefit) => (
          <CommunityPrototypeBadge key={benefit} tone={completed || active ? 'gold' : 'neutral'}>{benefit}</CommunityPrototypeBadge>
        ))}
      </div>
    </div>
  );
}

function GamificationBadgeCard({ badge }) {
  const Icon = badge.icon;

  return (
    <div className={`rounded-[1.75rem] border p-4 transition hover:-translate-y-0.5 ${badge.unlocked ? 'border-yellow-300/30 bg-yellow-400/[0.10]' : 'border-white/10 bg-white/[0.045]'}`}>
      <div className="flex items-start gap-3">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl ring-1 ${badge.unlocked ? 'bg-yellow-400 text-black ring-yellow-200/50' : 'bg-black/35 text-white/45 ring-white/10'}`}>
          <Icon size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <h4 className="break-words font-black text-yellow-50">{badge.title}</h4>
            <CommunityPrototypeBadge tone={badge.unlocked ? 'green' : 'neutral'}>{badge.unlocked ? 'freigeschaltet' : 'gesperrt'}</CommunityPrototypeBadge>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-white/58">{badge.description}</p>
          <div className="mt-4">
            <GamificationProgressBar value={badge.progress} label="Badge-Fortschritt" />
          </div>
          {badge.date && <p className="mt-3 text-xs font-bold text-yellow-100/70">Freigeschaltet: {badge.date}</p>}
        </div>
      </div>
    </div>
  );
}

function GamificationRankingCard({ item }) {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-4 text-white transition hover:-translate-y-0.5 hover:border-yellow-300/25 hover:bg-yellow-400/[0.07]">
      <div className="flex items-start gap-4">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl text-sm font-black ${item.place <= 3 ? 'bg-yellow-400 text-black' : 'bg-white/10 text-yellow-100 ring-1 ring-white/10'}`}>
          #{item.place}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-sm font-black text-yellow-100">
                {item.initials}
              </span>
              <div className="min-w-0">
                <h4 className="break-words font-black text-yellow-50">{item.name}</h4>
                <p className="text-xs text-white/45">{item.level} · {item.badge}</p>
              </div>
            </div>
            <LeaderTrendBadge trend={item.trend} />
          </div>
          <div className="mt-4">
            <GamificationProgressBar value={item.progress} label={`${formatPoints(item.points)} Punkte`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderGamificationPreview({ team = [] }) {
  const safeTeam = team.length ? team : [];
  const topMembers = safeTeam.slice().sort((left, right) => right.points - left.points).slice(0, 5);
  const strongProgress = safeTeam.filter((member) => member.progress >= 80).slice(0, 3);
  const lowActivity = safeTeam.filter((member) => member.activityStatus === 'inactive' || member.needsFollowUp).slice(0, 3);
  const teamPoints = safeTeam.reduce((sum, member) => sum + Number(member.points || 0), 0);
  const teamLevelProgress = Math.max(0, Math.min(100, Math.round((teamPoints / 15000) * 100)));
  const badgeDistribution = [
    { label: 'Leader Ready', value: safeTeam.filter((member) => member.badge === 'Leader Ready').length },
    { label: 'Top Performer', value: safeTeam.filter((member) => member.badge === 'Top Performer').length },
    { label: 'Kundenfokus', value: safeTeam.filter((member) => member.badge === 'Kundenfokus').length },
    { label: 'Reaktivieren', value: safeTeam.filter((member) => member.needsFollowUp).length },
  ];

  return (
    <Panel title="Leader Gamification · UI-Prototyp" icon={Trophy}>
      <div className="mb-5 rounded-3xl border border-yellow-300/15 bg-yellow-400/[0.08] p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Team-Punkte</p>
            <h3 className="mt-1 text-3xl font-black text-yellow-50">{formatPoints(teamPoints)}</h3>
            <p className="mt-1 text-sm text-white/58">Teamdaten werden nur angezeigt, wenn sie sicher für diesen Leader geladen sind.</p>
          </div>
          <div className="w-full lg:max-w-md">
            <GamificationProgressBar value={teamLevelProgress} label="Team-Level Fortschritt" helper="Zielvorschau für spätere Leader-Auswertung." />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.86fr]">
        <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Top 5 Teammitglieder</p>
          <div className="mt-4 space-y-3">
            {topMembers.map((member, index) => (
              <div key={member.id} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-xs font-black text-black">#{index + 1}</span>
                  <span className="min-w-0">
                    <span className="block break-words text-sm font-black text-yellow-50">{member.firstName} {member.lastName}</span>
                    <span className="block text-xs text-white/45">{member.badge}</span>
                  </span>
                </div>
                <span className="shrink-0 text-sm font-black text-yellow-50">{formatPoints(member.points)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Starker Fortschritt</p>
            <div className="mt-3 space-y-3">
              {strongProgress.map((member) => (
                <LeaderProgressBar key={member.id} value={member.progress} label={`${member.firstName} ${member.lastName}`} />
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Wenig Aktivität</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {lowActivity.map((member) => (
                <CommunityPrototypeBadge key={member.id} tone="gold">{member.firstName}: {member.lastActivity}</CommunityPrototypeBadge>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Badge-Verteilung</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {badgeDistribution.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white/[0.055] p-3">
                  <p className="text-lg font-black text-yellow-50">{item.value}</p>
                  <p className="text-xs text-white/45">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function GamificationPrototype({ partner, onNavigate }) {
  const [rankingView, setRankingView] = useState('top');
  const model = getGamificationModel(partner);
  const currentLevelIndex = model.levels.findIndex((level) => level.name === model.currentLevel.name);
  const pointStats = [
    { icon: Trophy, label: 'Gesamtpunkte', value: formatPoints(model.totalPoints), trend: model.currentLevel.name },
    { icon: Flame, label: 'Wochenpunkte', value: formatPoints(model.weekPoints), trend: '+12%' },
    { icon: CalendarDays, label: 'Monatspunkte', value: formatPoints(model.monthPoints), trend: 'Juni' },
    { icon: BookOpen, label: 'Academy-Module', value: formatPoints(model.academyPoints), trend: 'Training' },
    { icon: ShieldCheck, label: 'Onboarding', value: formatPoints(model.onboardingPoints), trend: 'Start' },
    { icon: MessageCircle, label: 'Community', value: formatPoints(model.communityPoints), trend: 'Aktivität' },
    { icon: Users, label: 'Teamaktivität', value: formatPoints(model.teamPoints), trend: 'Team' },
  ];
  const badges = [
    { icon: UserCheck, title: 'Profil komplett', description: 'Profilbild, Stammdaten und sichtbare Kontaktbasis sind gepflegt.', unlocked: true, progress: 100, date: '30.06.2026' },
    { icon: BookOpen, title: 'Erstes Modul abgeschlossen', description: 'Das erste Academy-Modul wurde vollständig bearbeitet.', unlocked: true, progress: 100, date: '30.06.2026' },
    { icon: ShieldCheck, title: 'Onboarding abgeschlossen', description: 'Alle Pflichtschritte im Startfahrplan sind erledigt.', unlocked: false, progress: 72 },
    { icon: Search, title: 'Erster Wassertest', description: 'Der erste Wassertest wurde vorbereitet oder dokumentiert.', unlocked: false, progress: 45 },
    { icon: PlayCircle, title: 'Erste Präsentation', description: 'Eine Präsentation wurde angesehen und für Kundengespräche genutzt.', unlocked: false, progress: 35 },
    { icon: MessageCircle, title: 'Community aktiv', description: 'Sichtbare Beteiligung in Q&A, Feed oder Teamkommunikation.', unlocked: true, progress: 100, date: '29.06.2026' },
    { icon: Flame, title: '7 Tage aktiv', description: 'Sieben Tage hintereinander mit Lern- oder Community-Aktivität.', unlocked: false, progress: 71 },
    { icon: Users, title: 'Teamstarter', description: 'Erste Teamstruktur oder Sponsor-Unterstützung sichtbar vorbereitet.', unlocked: false, progress: 55 },
    { icon: Target, title: 'Recruiting Fokus', description: 'Recruiting-Module, Einwandbehandlung und Follow-up-Rhythmus gestartet.', unlocked: false, progress: 40 },
    { icon: Trophy, title: 'Verkaufsprofi', description: 'Kundengespräch, Testlabor und Präsentation als Praxisroutine verbunden.', unlocked: false, progress: 30 },
    { icon: Crown, title: 'Leader Mindset', description: 'Partnerbegleitung, Teamziele und klare nächste Schritte im Fokus.', unlocked: false, progress: 24 },
  ];
  const rankingGroups = {
    top: [
      { place: 1, initials: 'MK', name: 'Mara K.', level: 'Leader', points: 6240, progress: 86, trend: 'up', badge: 'Top Partner' },
      { place: 2, initials: 'JB', name: 'Jonas B.', level: 'Team Builder', points: 5120, progress: 74, trend: 'equal', badge: 'Leader Ready' },
      { place: 3, initials: 'EP', name: 'Elena P.', level: 'Builder', points: 4380, progress: 63, trend: 'up', badge: 'Kundenfokus' },
      { place: 18, initials: getInitials(partner || { firstName: 'Du', lastName: '' }), name: `${partner?.firstName || 'Dein'} Profil`, level: model.currentLevel.name, points: model.totalPoints, progress: model.levelProgress, trend: 'up', badge: model.currentLevel.badge },
    ],
    week: [
      { place: 1, initials: 'AN', name: 'Alina N.', level: 'Aktiv', points: 520, progress: 68, trend: 'up', badge: 'Comeback' },
      { place: 2, initials: 'MK', name: 'Mara K.', level: 'Leader', points: 480, progress: 91, trend: 'equal', badge: 'Konstanz' },
      { place: 3, initials: 'DU', name: 'David U.', level: 'Starter', points: 350, progress: 41, trend: 'up', badge: 'Start' },
      { place: 9, initials: getInitials(partner || { firstName: 'Du', lastName: '' }), name: `${partner?.firstName || 'Dein'} Profil`, level: model.currentLevel.name, points: model.weekPoints, progress: 52, trend: 'up', badge: 'Diese Woche' },
    ],
    month: [
      { place: 1, initials: 'JB', name: 'Jonas B.', level: 'Team Builder', points: 1820, progress: 82, trend: 'up', badge: 'Monatsfokus' },
      { place: 2, initials: 'MK', name: 'Mara K.', level: 'Leader', points: 1740, progress: 88, trend: 'equal', badge: 'Leader' },
      { place: 3, initials: getInitials(partner || { firstName: 'Du', lastName: '' }), name: `${partner?.firstName || 'Dein'} Profil`, level: model.currentLevel.name, points: model.monthPoints, progress: 61, trend: 'up', badge: 'Aufbau' },
    ],
    academy: [
      { place: 1, initials: 'EP', name: 'Elena P.', level: 'Builder', points: 1960, progress: 94, trend: 'up', badge: 'Academy Pro' },
      { place: 2, initials: 'MK', name: 'Mara K.', level: 'Leader', points: 1840, progress: 90, trend: 'equal', badge: 'Training' },
      { place: 5, initials: getInitials(partner || { firstName: 'Du', lastName: '' }), name: `${partner?.firstName || 'Dein'} Profil`, level: model.currentLevel.name, points: model.academyPoints, progress: 74, trend: 'up', badge: 'Lernfokus' },
    ],
    community: [
      { place: 1, initials: 'AT', name: 'Academy Team', level: 'Admin', points: 880, progress: 100, trend: 'equal', badge: 'Offiziell' },
      { place: 2, initials: 'JB', name: 'Jonas B.', level: 'Team Builder', points: 620, progress: 72, trend: 'up', badge: 'Community' },
      { place: 8, initials: getInitials(partner || { firstName: 'Du', lastName: '' }), name: `${partner?.firstName || 'Dein'} Profil`, level: model.currentLevel.name, points: model.communityPoints, progress: 58, trend: 'equal', badge: 'Aktiv' },
    ],
    team: [
      { place: 1, initials: 'TN', name: 'Team Nord', level: 'Leader Team', points: 8420, progress: 82, trend: 'up', badge: 'Teamaufbau' },
      { place: 2, initials: 'TR', name: 'Team Rhein', level: 'Builder Team', points: 6180, progress: 67, trend: 'equal', badge: 'Kundenfokus' },
      { place: 3, initials: 'TS', name: 'Team Süd', level: 'Starter Team', points: 5020, progress: 54, trend: 'down', badge: 'Prüfen' },
    ],
  };
  const rankingOptions = [
    ['top', 'Top Partner'],
    ['week', 'Woche'],
    ['month', 'Monat'],
    ['academy', 'Academy'],
    ['community', 'Community'],
    ['team', 'Team'],
  ];
  const pointTasks = [
    { title: 'Modul ansehen', points: 40, target: 'modules', icon: BookOpen },
    { title: 'Quiz bestehen', points: 80, target: 'modules', icon: FileQuestion },
    { title: 'Profil vervollständigen', points: 60, target: 'profile', icon: UserCheck },
    { title: 'Wassertest durchführen', points: 120, target: 'testlab', icon: Search },
    { title: 'Community-Beitrag lesen', points: 15, target: 'community', icon: MessageCircle },
    { title: 'Follow-up machen', points: 70, target: 'contact', icon: Phone },
    { title: 'Termin buchen', points: 50, target: 'calendar', icon: CalendarDays },
  ];
  const rewards = [
    { icon: FileText, title: 'Zertifikat', text: 'Vorschau für späteres Academy-Zertifikat.' },
    { icon: Crown, title: 'Leader Badge', text: 'Sichtbares Leader-Signal nach echtem Fortschritt.' },
    { icon: Trophy, title: 'Ranking Sichtbarkeit', text: 'Platzierung als Motivation, nicht als Druck.' },
    { icon: Lock, title: 'Leader-Inhalte', text: 'Zugangsvorschau für spätere Inhalte.' },
    { icon: Star, title: 'Spezialtraining', text: 'Einladung zu fokussierten Trainingsformaten.' },
    { icon: Users, title: 'Team-Anerkennung', text: 'Anerkennung im Team- und Leader-Kontext.' },
  ];

  return (
    <section className="space-y-5">
      <Card className="overflow-hidden rounded-[2.25rem] border border-yellow-300/25 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.23),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.10),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.035),rgba(0,0,0,0.50))] text-white shadow-2xl shadow-yellow-500/10 backdrop-blur-xl">
        <CardContent className="p-5 sm:p-7 md:p-9">
          <div className="grid gap-6 xl:grid-cols-[1fr_0.42fr] xl:items-end">
            <div className="min-w-0">
              <span className="rounded-full border border-yellow-300/25 bg-yellow-400/12 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-yellow-100">
                Gamification UI · Mockdaten · keine Speicherung
              </span>
              <h2 className="mt-4 break-words text-4xl font-black leading-tight text-yellow-50 md:text-5xl">
                Punkte, Level, Badges & Ranking
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/62">
                Eine hochwertige Motivationsschicht für Partneraktivierung, Academy-Fortschritt und Teamaufbau. Alle Werte sind zunächst Frontend/UI-only und verändern keine Partnerdaten.
              </p>
            </div>
            <div className="rounded-[2rem] border border-yellow-300/20 bg-black/30 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Aktuelles Level</p>
              <h3 className="mt-2 text-3xl font-black text-yellow-50">{model.currentLevel.name}</h3>
              <p className="mt-1 text-sm text-white/58">{formatPoints(model.totalPoints)} Punkte · Platz #{model.rankingPosition}</p>
              <div className="mt-5">
                <GamificationProgressBar value={model.levelProgress} label={`${formatPoints(model.pointsToNext)} bis ${model.nextLevel.name}`} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        {pointStats.map((metric) => (
          <AdminPrototypeMetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel title="Level-System" icon={Crown}>
          <div className="grid gap-3 md:grid-cols-2">
            {model.levels.map((level, index) => (
              <GamificationLevelCard
                key={level.name}
                level={level}
                active={index === currentLevelIndex}
                completed={index < currentLevelIndex}
                progress={model.levelProgress}
              />
            ))}
          </div>
        </Panel>

        <Panel title="Heute Punkte sammeln" icon={Target}>
          <p className="mb-4 text-sm leading-relaxed text-white/60">
            Kleine klare Aktionen, geschätzte Punkte und direkte Sprungmarken. Die Buttons navigieren nur innerhalb der bestehenden Oberfläche.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {pointTasks.map(({ title, points, target, icon: Icon }) => (
              <button
                key={title}
                type="button"
                onClick={() => onNavigate?.(target)}
                className="flex items-center justify-between gap-3 rounded-3xl border border-white/10 bg-black/25 p-4 text-left transition hover:-translate-y-0.5 hover:border-yellow-300/25 hover:bg-yellow-400/[0.08]"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-200 ring-1 ring-yellow-300/20">
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block break-words font-black text-yellow-50">{title}</span>
                    <span className="block text-xs text-white/45">geschätzt</span>
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-black">+{points}</span>
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-3xl border border-yellow-300/15 bg-yellow-400/[0.08] p-4">
            <p className="text-sm font-black text-yellow-50">Wichtigste nächste Aktion</p>
            <p className="mt-1 text-sm leading-relaxed text-white/62">{model.nextAction}</p>
          </div>
        </Panel>
      </section>

      <Panel title="Badge-Übersicht" icon={Star}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {badges.map((badge) => (
            <GamificationBadgeCard key={badge.title} badge={badge} />
          ))}
        </div>
      </Panel>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.72fr]">
        <Panel title="Ranking" icon={Trophy}>
          <div className="mb-5 flex flex-wrap gap-2">
            {rankingOptions.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setRankingView(value)}
                className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.1em] ring-1 transition ${rankingView === value ? 'bg-yellow-400 text-black ring-yellow-200/60' : 'bg-white/10 text-white/65 ring-white/10 hover:bg-white/15'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid gap-3">
            {(rankingGroups[rankingView] || rankingGroups.top).map((item) => (
              <GamificationRankingCard key={`${rankingView}-${item.place}-${item.name}`} item={item} />
            ))}
          </div>
        </Panel>

        <Panel title="Reward-Vorschau" icon={Crown}>
          <p className="mb-4 text-sm leading-relaxed text-white/60">
            Reine UI-Vorschau für spätere Belohnungen. Es wird nichts freigeschaltet und kein Partnerstatus verändert.
          </p>
          <div className="grid gap-3">
            {rewards.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3 rounded-3xl border border-white/10 bg-black/25 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-200 ring-1 ring-yellow-300/20">
                  <Icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block break-words font-black text-yellow-50">{title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-white/58">{text}</span>
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </section>
  );
}

function LeaderTeamCard({ member, selected, onSelect, onPrepareMessage }) {
  return (
    <Card className={`rounded-[2rem] border text-white backdrop-blur-xl transition hover:-translate-y-0.5 ${selected ? 'border-yellow-300/45 bg-yellow-400/[0.10]' : 'border-white/10 bg-white/[0.055] hover:border-yellow-300/25 hover:bg-yellow-400/[0.07]'}`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl border border-yellow-300/20 bg-yellow-400/10 text-base font-black text-yellow-100">
            {getInitials(member)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="break-words text-lg font-black text-yellow-50">{member.firstName} {member.lastName}</h4>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-white/42">{member.role} · {member.team}</p>
              </div>
              <AdminPrototypeStatusBadge status={member.status} />
            </div>
            <div className="mt-4">
              <LeaderProgressBar value={member.progress} label="Onboarding" />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/38">Aktivität</p>
            <p className="mt-1 font-bold text-yellow-50">{member.lastActivity}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/38">Module</p>
            <p className="mt-1 font-bold text-yellow-50">{member.modulesCompleted}/13</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/38">Punkte</p>
            <p className="mt-1 font-bold text-yellow-50">{member.points}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <AdminPrototypeActionButton tone="primary" onClick={() => onSelect(member.id)}>
            <UserCheck size={14} /> Profil ansehen
          </AdminPrototypeActionButton>
          <AdminPrototypeActionButton onClick={() => onPrepareMessage(member.id)}>
            <MessageCircle size={14} /> Nachricht vorbereiten
          </AdminPrototypeActionButton>
        </div>
      </CardContent>
    </Card>
  );
}

function LeaderFollowUpCard({ member, prepared, onPrepare }) {
  return (
    <div className="rounded-3xl border border-yellow-300/15 bg-black/25 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Follow-up</p>
          <h4 className="mt-1 break-words text-lg font-black text-yellow-50">{member.firstName} {member.lastName}</h4>
          <p className="mt-1 text-sm text-white/55">{member.followUpReason}</p>
        </div>
        <span className="rounded-full bg-yellow-400/12 px-3 py-1 text-xs font-black text-yellow-100 ring-1 ring-yellow-300/20">
          {member.priority}
        </span>
      </div>
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-sm leading-relaxed text-white/66">
        {member.whatsappTemplate}
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-white/42">Empfehlung: {member.recommendedAction}</p>
        <AdminPrototypeActionButton tone={prepared ? 'primary' : 'neutral'} onClick={() => onPrepare(member.id)}>
          <MessageCircle size={14} /> {prepared ? 'Text vorbereitet' : 'Follow-up Text kopieren'}
        </AdminPrototypeActionButton>
      </div>
    </div>
  );
}

function LeaderDashboardPreview({ partner, onNavigate }) {
  const teamMembers = useMemo(() => [], []);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortMode, setSortMode] = useState('progress-desc');
  const [leaderWorkTab, setLeaderWorkTab] = useState('today');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [preparedMessageId, setPreparedMessageId] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const totalTarget = Math.max(1, Number(partner?.teamTargetPartnerCount || 500));
  const totalTeamPartners = Number(partner?.teamPartnerCount || 0);
  const newTeamPartners = Number(partner?.teamNewPartnersSinceLastUpdate || 0);
  const selectedMember = teamMembers.find((member) => member.id === selectedMemberId) || null;
  const filteredTeam = useMemo(() => teamMembers
    .filter((member) => {
      if (filter === 'pending') {
        return member.status === 'pending';
      }

      if (filter === 'approved') {
        return member.status === 'approved';
      }

      if (filter === 'active') {
        return member.activityStatus === 'active';
      }

      if (filter === 'inactive') {
        return member.activityStatus === 'inactive';
      }

      if (filter === 'top') {
        return member.points >= 2000 || member.progress >= 85;
      }

      return true;
    })
    .filter((member) => {
      if (!normalizedQuery) {
        return true;
      }

      return [
        member.firstName,
        member.lastName,
        member.status,
        member.role,
        member.team,
        member.badge,
      ].join(' ').toLowerCase().includes(normalizedQuery);
    })
    .sort((left, right) => {
      if (sortMode === 'name') {
        return `${left.firstName} ${left.lastName}`.localeCompare(`${right.firstName} ${right.lastName}`, 'de-DE');
      }

      if (sortMode === 'points-desc') {
        return right.points - left.points;
      }

      if (sortMode === 'registered-desc') {
        return new Date(right.registeredAt).getTime() - new Date(left.registeredAt).getTime();
      }

      return right.progress - left.progress;
    }), [filter, normalizedQuery, sortMode, teamMembers]);
  const activeCount = teamMembers.filter((member) => member.activityStatus === 'active').length;
  const pendingCount = teamMembers.filter((member) => member.status === 'pending').length;
  const completedOnboardings = teamMembers.filter((member) => member.progress >= 90).length;
  const averageProgress = teamMembers.length
    ? Math.round(teamMembers.reduce((sum, member) => sum + member.progress, 0) / teamMembers.length)
    : 0;
  const topPerformer = teamMembers.slice().sort((left, right) => right.points - left.points)[0] || null;
  const openTasks = teamMembers.filter((member) => member.needsFollowUp || member.status !== 'approved').length;
  const teamProgress = Math.max(0, Math.min(100, Math.round((totalTeamPartners / totalTarget) * 100)));
  const readinessItems = [
    { label: 'Profil komplett', count: teamMembers.length ? teamMembers.filter((member) => member.profileComplete).length : '—', icon: UserCheck },
    { label: 'Onboarding gestartet', count: teamMembers.length ? teamMembers.filter((member) => member.onboardingStarted).length : '—', icon: ShieldCheck },
    { label: 'Erstes Modul fertig', count: teamMembers.length ? teamMembers.filter((member) => member.firstModuleComplete).length : '—', icon: BookOpen },
    { label: 'Follow-up nötig', count: teamMembers.length ? teamMembers.filter((member) => member.needsFollowUp).length : '—', icon: Bell },
    { label: 'Kundengespräch bereit', count: teamMembers.length ? teamMembers.filter((member) => member.readyCustomerTalk).length : '—', icon: MessageCircle },
    { label: 'Recruiting bereit', count: teamMembers.length ? teamMembers.filter((member) => member.readyRecruiting).length : '—', icon: Crown },
  ];
  const metrics = [
    { icon: Users, label: 'Team gesamt', value: totalTeamPartners, trend: `${teamProgress}% von ${totalTarget}` },
    { icon: Flame, label: 'Aktive Partner', value: teamMembers.length ? activeCount : '—', trend: teamMembers.length ? 'Teamliste' : 'Daten offen' },
    { icon: CalendarDays, label: 'Neue Partner', value: newTeamPartners, trend: 'bestehendes Feld' },
    { icon: Bell, label: 'Wartende Partner', value: teamMembers.length ? pendingCount : '—', trend: 'Teamliste nötig' },
    { icon: Trophy, label: 'Onboardings fertig', value: teamMembers.length ? completedOnboardings : '—', trend: '90%+' },
    { icon: TrendingUp, label: 'Ø Lernfortschritt', value: teamMembers.length ? `${averageProgress}%` : '—', trend: 'Teamdaten nötig' },
    { icon: Crown, label: 'Top Performer', value: topPerformer?.firstName || '—', trend: topPerformer ? `${topPerformer.points} Pkt.` : 'nicht geladen' },
    { icon: Target, label: 'Offene Aufgaben', value: openTasks, trend: 'Follow-up' },
  ];
  const ranking = teamMembers.slice().sort((left, right) => right.points - left.points).slice(0, 5);
  const focusMembers = teamMembers.filter((member) => member.needsFollowUp || member.status !== 'approved');
  const dailyTasks = [
    {
      id: 'open-partners',
      icon: Bell,
      title: 'Offene Partner prüfen',
      value: teamMembers.length ? pendingCount : '—',
      text: teamMembers.length ? 'Wartende Teammitglieder priorisieren.' : 'Team-Pending-Daten werden noch nicht sicher ausgeliefert.',
      action: 'Teamdaten-Endpunkt später ergänzen',
    },
    {
      id: 'missing-profile',
      icon: Camera,
      title: 'Fehlende Profilbilder',
      value: teamMembers.length ? teamMembers.filter((member) => !member.profileComplete).length : '—',
      text: teamMembers.length ? 'Profile mit fehlendem Bild aktiv begleiten.' : 'Profilbildstatus einzelner Teammitglieder ist noch nicht verfügbar.',
      action: 'Follow-up vorbereiten',
    },
    {
      id: 'new-registrations',
      icon: CalendarDays,
      title: 'Neue Registrierungen',
      value: newTeamPartners,
      text: newTeamPartners > 0 ? 'Neue Teambewegung sichtbar – persönlichen Startimpuls setzen.' : 'Keine neuen Teamzugänge im vorhandenen Aggregatfeld.',
      action: 'Startnachricht vorbereiten',
    },
    {
      id: 'new-approvals',
      icon: UserCheck,
      title: 'Neue Freigaben',
      value: '—',
      text: 'Freigabeereignisse pro Leader-Team sind noch nicht als sichere Teamdaten verfügbar.',
      action: 'UI vorbereitet',
    },
    {
      id: 'recent-active',
      icon: Flame,
      title: 'Kürzlich aktive Partner',
      value: teamMembers.length ? activeCount : '—',
      text: teamMembers.length ? 'Aktive Partner heute bewusst verstärken.' : 'Aktivität einzelner Teammitglieder wird ohne Teamliste nicht angezeigt.',
      action: 'Erfolg verstärken',
    },
    {
      id: 'low-progress',
      icon: TrendingUp,
      title: 'Geringer Lernfortschritt',
      value: teamMembers.length ? teamMembers.filter((member) => member.progress < 25).length : '—',
      text: teamMembers.length ? 'Partner mit niedrigem Fortschritt zum nächsten Modul führen.' : 'Lernfortschritt einzelner Teammitglieder bleibt geschützt, bis Teamdaten sicher geladen werden.',
      action: 'Nächstes Modul empfehlen',
    },
    {
      id: 'no-module-start',
      icon: BookOpen,
      title: 'Ohne Modulstart',
      value: teamMembers.length ? teamMembers.filter((member) => member.modulesCompleted <= 0).length : '—',
      text: teamMembers.length ? 'Partner ohne Modulstart brauchen einen klaren ersten Schritt.' : 'Modulstart pro Teammitglied wird erst mit sicherer Teamliste angezeigt.',
      action: 'Modul 1 empfehlen',
    },
  ];
  const followUpBuckets = [
    { id: 'first-contact', label: 'Erstkontakt', icon: Phone, count: 0, text: 'Für neue Partner nach Registrierung vorbereitet.' },
    { id: 'callback', label: 'Rückruf offen', icon: Clock, count: 0, text: 'Nur anzeigen, wenn Rückrufstatus später sicher gespeichert wird.' },
    { id: 'booking', label: 'Termin vereinbaren', icon: CalendarDays, count: 0, text: 'Termin-Workflow vorbereitet; kein Versand und kein Schreibzugriff.' },
    { id: 'registration-started', label: 'Registrierung begonnen', icon: UserCheck, count: 0, text: 'Ohne neue Tabellen nur als UI-Kategorie vorbereitet.' },
    { id: 'approval-pending', label: 'Freischaltung ausstehend', icon: ShieldCheck, count: teamMembers.length ? pendingCount : 0, text: teamMembers.length ? 'Pending-Teammitglieder prüfen.' : 'Keine sichere Teamliste geladen.' },
    { id: 'module-one', label: 'Modul 1 abgeschlossen', icon: BookOpen, count: teamMembers.length ? teamMembers.filter((member) => member.firstModuleComplete).length : 0, text: 'Wird mit echten Teamfortschritten automatisch nutzbar.' },
    { id: 'inactive', label: 'Inaktiv', icon: Flame, count: teamMembers.length ? teamMembers.filter((member) => member.activityStatus === 'inactive').length : 0, text: 'Inaktivität wird erst mit Team-Aktivitätsdaten pro Partner sichtbar.' },
  ];
  const filterOptions = [
    ['all', 'Alle'],
    ['pending', 'Pending'],
    ['approved', 'Freigegeben'],
    ['active', 'Aktiv'],
    ['inactive', 'Inaktiv'],
    ['top', 'Top Partner'],
  ];

  const updateFilter = (nextFilter) => {
    setFilter(nextFilter);
  };

  const prepareMessage = (memberId) => {
    setPreparedMessageId(memberId);
    setSelectedMemberId(memberId);
  };

  return (
    <section className="space-y-5">
      <Card className="overflow-hidden rounded-[2.25rem] border border-yellow-300/25 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.10),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.035),rgba(0,0,0,0.48))] text-white shadow-2xl shadow-yellow-500/10 backdrop-blur-xl">
        <CardContent className="p-5 sm:p-7 md:p-9">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              <span className="rounded-full border border-yellow-300/25 bg-yellow-400/12 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-yellow-100">
                Leader Arbeitszentrale · vorhandene Daten · keine Backend-Aktion
              </span>
              <h2 className="mt-4 break-words text-4xl font-black leading-tight text-yellow-50 md:text-5xl">
                Leader Task & Follow-up Center
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/62">
                Tägliche Arbeitsfläche für Teamüberblick, Follow-ups, Tagesaufgaben und Prioritäten. Ohne sicheren Team-Endpunkt werden keine fremden Partnerdaten angezeigt.
              </p>
            </div>
            <div className="rounded-3xl border border-yellow-300/20 bg-black/25 p-4 xl:min-w-[22rem]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Teamziel</p>
                  <p className="mt-1 text-3xl font-black text-yellow-50">{totalTeamPartners}/{totalTarget}</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-yellow-300/25 bg-yellow-400/10 text-yellow-100">
                  <Target size={27} />
                </div>
              </div>
              <div className="mt-4">
                <LeaderProgressBar value={teamProgress} label="500 Partner Ziel" />
              </div>
              <p className="mt-3 text-sm text-white/58">Nächste Leader-Aufgabe: vorhandene Teambewegung prüfen und den nächsten persönlichen Startimpuls setzen.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <AdminPrototypeMetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="rounded-[2rem] border border-yellow-300/15 bg-gradient-to-br from-yellow-400/[0.10] via-white/[0.04] to-black/40 p-4 text-white sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Heute erledigen</p>
            <h3 className="mt-2 text-2xl font-black text-yellow-50">Tagesfokus für Leader</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/58">
              Aufgaben werden aus vorhandenen Feldern abgeleitet. Wo sichere Teamdaten fehlen, bleibt der Bereich bewusst vorbereitet statt erfunden.
            </p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              ['today', 'Heute'],
              ['followups', 'Follow-up'],
              ['new', 'Neue Partner'],
              ['team', 'Teamübersicht'],
            ].map(([tabId, label]) => (
              <button
                key={tabId}
                type="button"
                onClick={() => setLeaderWorkTab(tabId)}
                className={`min-h-11 whitespace-nowrap rounded-2xl px-4 text-sm font-black transition ${leaderWorkTab === tabId ? 'bg-yellow-400 text-black' : 'border border-white/10 bg-black/25 text-white/70 hover:bg-white/10'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {leaderWorkTab === 'today' && (
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {dailyTasks.map(({ id, icon: Icon, title, value, text, action }) => (
              <div key={id} className="rounded-3xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-200 ring-1 ring-yellow-300/20">
                    <Icon size={18} />
                  </span>
                  <span className="text-2xl font-black text-yellow-50">{value}</span>
                </div>
                <h4 className="mt-4 font-black text-yellow-50">{title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{text}</p>
                <p className="mt-3 rounded-2xl border border-yellow-300/15 bg-yellow-400/10 px-3 py-2 text-xs font-bold text-yellow-100">{action}</p>
              </div>
            ))}
          </div>
        )}

        {leaderWorkTab === 'followups' && (
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {followUpBuckets.map(({ id, icon: Icon, label, count, text }) => (
              <div key={id} className="rounded-3xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-200 ring-1 ring-yellow-300/20">
                    <Icon size={18} />
                  </span>
                  <span className="rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-black text-yellow-100">{count}</span>
                </div>
                <h4 className="mt-4 font-black text-yellow-50">{label}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{text}</p>
              </div>
            ))}
          </div>
        )}

        {leaderWorkTab === 'new' && (
          <div className="mt-5 rounded-3xl border border-white/10 bg-black/25 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Neue Partner</p>
                <h4 className="mt-2 text-3xl font-black text-yellow-50">{newTeamPartners}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  Dieser Wert nutzt das vorhandene Team-Aggregatfeld. Einzelne Partnerprofile werden ohne sicheren Team-Endpunkt nicht geladen.
                </p>
              </div>
              <Button type="button" onClick={() => onNavigate?.('modules')} className="rounded-2xl bg-yellow-400 px-5 py-3 font-black text-black hover:bg-yellow-300">
                Startmodul empfehlen <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {leaderWorkTab === 'team' && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Stat icon={Users} label="Gesamtpartner" value={totalTeamPartners} />
            <Stat icon={Flame} label="Aktive Partner" value={teamMembers.length ? activeCount : '—'} />
            <Stat icon={Clock} label="Inaktive Partner" value={teamMembers.length ? teamMembers.filter((member) => member.activityStatus === 'inactive').length : '—'} />
            <Stat icon={CalendarDays} label="Neue Partner" value={newTeamPartners} />
            <Stat icon={TrendingUp} label="Lernfortschritt" value={teamMembers.length ? `${averageProgress}%` : '—'} />
          </div>
        )}
      </section>

      <LeaderGamificationPreview team={teamMembers} />

      <section className="grid gap-5 2xl:grid-cols-[1fr_0.72fr]">
        <Card className="rounded-[2rem] border border-white/10 bg-white/[0.055] text-white backdrop-blur-xl">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Teamübersicht</p>
                <h3 className="mt-2 text-2xl font-black text-yellow-50">Partner finden, priorisieren und begleiten</h3>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 xl:w-[38rem]">
                <label>
                  <span className="sr-only">Team suchen</span>
                  <span className="flex min-h-11 items-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-3 focus-within:border-yellow-300/55">
                    <Search size={16} className="text-yellow-200" />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Name, Status, Team"
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/35"
                    />
                  </span>
                </label>
                <select value={filter} onChange={(event) => updateFilter(event.target.value)} className="min-h-11 rounded-2xl border border-white/10 bg-black/55 px-3 text-sm font-bold text-white outline-none">
                  {filterOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <select value={sortMode} onChange={(event) => setSortMode(event.target.value)} className="min-h-11 rounded-2xl border border-white/10 bg-black/55 px-3 text-sm font-bold text-white outline-none">
                  <option value="progress-desc">Fortschritt</option>
                  <option value="points-desc">Punkte</option>
                  <option value="name">Alphabetisch</option>
                  <option value="registered-desc">Neueste</option>
                </select>
              </div>
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              {filteredTeam.slice(0, 4).map((member) => (
                <LeaderTeamCard
                  key={member.id}
                  member={member}
                  selected={selectedMemberId === member.id}
                  onSelect={setSelectedMemberId}
                  onPrepareMessage={prepareMessage}
                />
              ))}
              {filteredTeam.length === 0 && (
                <div className="rounded-3xl border border-dashed border-yellow-300/25 bg-yellow-400/[0.06] p-5 text-sm leading-relaxed text-white/58 xl:col-span-2">
                  Keine sichere Teamliste geladen. Das Leader Center zeigt deshalb keine fremden Partnerprofile und arbeitet nur mit vorhandenen Aggregatwerten.
                </div>
              )}
            </div>

            {filteredTeam.length > 0 && (
            <div className="mt-5 hidden overflow-x-auto rounded-3xl border border-white/10 lg:block">
              <table className="w-full min-w-[60rem] text-left text-sm">
                <thead className="bg-black/45 text-xs uppercase tracking-[0.14em] text-white/42">
                  <tr>
                    {['Name', 'Status', 'Onboarding', 'Module', 'Punkte', 'Rolle', 'Registriert', 'Aktivität', 'Aktionen'].map((header) => (
                      <th key={header} className="px-4 py-3 font-black">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredTeam.map((member) => (
                    <tr key={member.id} className="bg-black/20 transition hover:bg-yellow-400/[0.06]">
                      <td className="px-4 py-4">
                        <button type="button" onClick={() => setSelectedMemberId(member.id)} className="text-left font-black text-yellow-50 hover:text-yellow-200">
                          {member.firstName} {member.lastName}
                        </button>
                        <p className="text-xs text-white/42">{member.team}</p>
                      </td>
                      <td className="px-4 py-4"><AdminPrototypeStatusBadge status={member.status} /></td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full bg-yellow-300" style={{ width: `${member.progress}%` }} />
                          </div>
                          <span className="font-black text-yellow-50">{member.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-white/65">{member.modulesCompleted}/13</td>
                      <td className="px-4 py-4 font-black text-yellow-50">{member.points}</td>
                      <td className="px-4 py-4 text-white/65">{member.role}</td>
                      <td className="px-4 py-4 text-white/65">{formatAdminDate(member.registeredAt)}</td>
                      <td className="px-4 py-4 text-white/65">{member.lastActivity}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <AdminPrototypeActionButton tone="primary" onClick={() => setSelectedMemberId(member.id)}>Profil</AdminPrototypeActionButton>
                          <AdminPrototypeActionButton onClick={() => prepareMessage(member.id)}>Text</AdminPrototypeActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}

            <div className="mt-5 grid gap-3 lg:hidden">
              {filteredTeam.map((member) => (
                <div key={member.id} className="rounded-3xl border border-white/10 bg-black/25 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="break-words font-black text-yellow-50">{member.firstName} {member.lastName}</h4>
                      <p className="mt-1 text-xs text-white/45">{member.role} · {member.team}</p>
                    </div>
                    <AdminPrototypeStatusBadge status={member.status} />
                  </div>
                  <div className="mt-4">
                    <LeaderProgressBar value={member.progress} label="Onboarding" />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <span className="rounded-2xl bg-white/10 p-2 text-white/65">{member.modulesCompleted}/13 Module</span>
                    <span className="rounded-2xl bg-white/10 p-2 text-white/65">{member.points} Punkte</span>
                    <span className="rounded-2xl bg-white/10 p-2 text-white/65">{member.lastActivity}</span>
                  </div>
                </div>
              ))}
              {filteredTeam.length === 0 && (
                <div className="rounded-3xl border border-white/10 bg-black/25 p-4 text-sm leading-relaxed text-white/55">
                  Teamkarten erscheinen hier, sobald ein sicher gefilterter Teamdaten-Endpunkt vorhanden ist.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-400/[0.10] via-white/[0.05] to-black/40 text-white backdrop-blur-xl">
          <CardContent className="p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Partner Schnellprofil</p>
            {selectedMember ? (
            <>
            <div className="mt-4 flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl border border-yellow-300/20 bg-yellow-400/10 text-lg font-black text-yellow-100">
                {getInitials(selectedMember)}
              </div>
              <div className="min-w-0">
                <h3 className="break-words text-2xl font-black text-yellow-50">{selectedMember.firstName} {selectedMember.lastName}</h3>
                <p className="mt-1 text-sm text-white/55">{selectedMember.role} · {selectedMember.badge}</p>
              </div>
            </div>
            <div className="mt-5">
              <LeaderProgressBar value={selectedMember.progress} label="Academy Fortschritt" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <LeaderReadinessPill ready={selectedMember.profileComplete} label="Profil komplett" />
              <LeaderReadinessPill ready={selectedMember.onboardingStarted} label="Onboarding gestartet" />
              <LeaderReadinessPill ready={selectedMember.firstModuleComplete} label="Erstes Modul" />
              <LeaderReadinessPill ready={!selectedMember.needsFollowUp} label="Kein Follow-up offen" />
              <LeaderReadinessPill ready={selectedMember.readyCustomerTalk} label="Kundengespräch bereit" />
              <LeaderReadinessPill ready={selectedMember.readyRecruiting} label="Recruiting bereit" />
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ['Status', selectedMember.status],
                ['Team', selectedMember.team],
                ['Registriert', formatAdminDate(selectedMember.registeredAt)],
                ['Letzte Aktivität', selectedMember.lastActivity],
                ['Module', `${selectedMember.modulesCompleted}/13`],
                ['Punkte', selectedMember.points],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/38">{label}</p>
                  <p className="mt-1 break-words text-sm font-bold text-yellow-50">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <AdminPrototypeActionButton tone="primary" onClick={() => onNavigate?.('modules')}>
                <BookOpen size={14} /> Nächstes Modul öffnen
              </AdminPrototypeActionButton>
              <AdminPrototypeActionButton onClick={() => prepareMessage(selectedMember.id)}>
                <MessageCircle size={14} /> Nachricht vorbereiten
              </AdminPrototypeActionButton>
            </div>
            </>
            ) : (
              <div className="mt-5 rounded-3xl border border-dashed border-yellow-300/25 bg-yellow-400/[0.06] p-5">
                <Users className="text-yellow-200" size={24} />
                <h3 className="mt-4 text-xl font-black text-yellow-50">Kein Teammitglied ausgewählt</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/58">
                  Detailprofile werden erst angezeigt, wenn Teammitglieder sicher und leaderbezogen ausgeliefert werden. Bis dahin bleiben fremde Partnerdaten geschützt.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.82fr_1fr]">
        <Panel title="Team Readiness" icon={ShieldCheck}>
          <div className="grid gap-3 sm:grid-cols-2">
            {readinessItems.map(({ label, count, icon: Icon }) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
                    <Icon size={18} />
                  </span>
                  <span className="text-2xl font-black text-yellow-50">{count}</span>
                </div>
                <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-white/42">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-3xl border border-yellow-300/15 bg-yellow-400/[0.08] p-4">
            <p className="text-sm font-bold text-yellow-50">Motivationshinweis</p>
            <p className="mt-1 text-sm leading-relaxed text-white/62">Leader-Fokus: nicht mehr Menschen gleichzeitig betreuen, sondern klare nächste Schritte sichtbar machen.</p>
          </div>
        </Panel>

        <Panel title="Follow-up Center" icon={Bell}>
          <div className="space-y-3">
            {focusMembers.map((member) => (
              <LeaderFollowUpCard
                key={member.id}
                member={member}
                prepared={preparedMessageId === member.id}
                onPrepare={prepareMessage}
              />
            ))}
            {focusMembers.length === 0 && (
              <div className="rounded-3xl border border-dashed border-yellow-300/25 bg-yellow-400/[0.06] p-5 text-sm leading-relaxed text-white/58">
                Keine personenbezogenen Follow-ups geladen. Die Kategorien oben bleiben vorbereitet; echte Follow-ups benötigen später einen sicheren Teamdaten-Endpunkt.
              </div>
            )}
          </div>
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Panel title="Teamziele" icon={Target}>
          <div className="space-y-5">
            <LeaderProgressBar value={teamProgress} label={`Langfristiges Ziel: ${totalTarget} Partner`} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-yellow-200">Wochenziel</p>
                <p className="mt-2 text-2xl font-black text-yellow-50">Startimpulse</p>
                <p className="mt-1 text-sm text-white/55">Neue Partner zeitnah begrüßen und zum ersten Modul führen.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-yellow-200">Monatsziel</p>
                <p className="mt-2 text-2xl font-black text-yellow-50">{totalTarget} Ziel</p>
                <p className="mt-1 text-sm text-white/55">Aktivität vor Größe: erst sichere Teamdaten, dann präzise Steuerung.</p>
              </div>
            </div>
            <div className="rounded-3xl border border-yellow-300/15 bg-yellow-400/[0.08] p-4">
              <p className="text-sm font-black text-yellow-50">Nächste Leader-Aufgabe</p>
              <p className="mt-1 text-sm leading-relaxed text-white/62">Prüfe neue Teambewegung, halte den nächsten Startimpuls kurz und leite zum ersten Academy-Schritt weiter.</p>
            </div>
          </div>
        </Panel>

        <Panel title="Ranking Vorschau" icon={Trophy}>
          <div className="space-y-3">
            {ranking.map((member, index) => (
              <div key={member.id} className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-black/25 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-sm font-black text-black">#{index + 1}</span>
                  <div className="min-w-0">
                    <p className="break-words font-black text-yellow-50">{member.firstName} {member.lastName}</p>
                    <p className="text-xs text-white/45">{member.badge} · {member.progress}% Academy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:justify-end">
                  <span className="text-sm font-black text-yellow-50">{member.points} Punkte</span>
                  <LeaderTrendBadge trend={member.trend} />
                </div>
              </div>
            ))}
            {ranking.length === 0 && (
              <div className="rounded-3xl border border-dashed border-yellow-300/25 bg-yellow-400/[0.06] p-5 text-sm leading-relaxed text-white/58">
                Kein Teamranking geladen. Es werden keine globalen oder fremden Partnerdaten als Ersatz angezeigt.
              </div>
            )}
          </div>
        </Panel>
      </section>
    </section>
  );
}

function AdminDashboardPrototype() {
  const mockPartners = useMemo(() => ([
    {
      id: 'ui-001',
      firstName: 'Mara',
      lastName: 'Keller',
      email: 'mara.keller@example.test',
      whatsapp: '+49 170 0000001',
      instagram: '@mara.harbor',
      status: 'approved',
      team: 'Team Nord',
      sponsor: 'Leonid C.',
      city: 'Hamburg',
      registeredAt: '2026-06-28',
      progress: 82,
      level: 'Leader',
      points: 1240,
      ranking: 4,
      activity: 'Heute aktiv',
      completedModules: ['Willkommen', 'Wasserwissen', 'PPM-Test'],
      uploads: ['Profilfoto', 'Wassertest Foto'],
      quiz: 'Bestanden · 86%',
      notes: 'Stark im Kundengespräch, braucht nächste Teamaufbau-Aufgabe.',
      adminComment: 'Nächster Check-in: Onboarding Vertiefung.'
    },
    {
      id: 'ui-002',
      firstName: 'David',
      lastName: 'Urban',
      email: 'david.urban@example.test',
      whatsapp: '+49 170 0000002',
      instagram: '@david.water',
      status: 'pending',
      team: 'Noch offen',
      sponsor: 'Mara K.',
      city: 'Berlin',
      registeredAt: '2026-06-29',
      progress: 24,
      level: 'Starter',
      points: 180,
      ranking: 27,
      activity: 'Neu registriert',
      completedModules: ['Willkommen'],
      uploads: ['Profilfoto'],
      quiz: 'Offen',
      notes: 'Profil prüfen und Sponsor-Termin vorschlagen.',
      adminComment: 'Pending-Review vorbereiten.'
    },
    {
      id: 'ui-003',
      firstName: 'Elena',
      lastName: 'Popescu',
      email: 'elena.popescu@example.test',
      whatsapp: '+49 170 0000003',
      instagram: '@elena.aqua',
      status: 'blocked',
      team: 'Team Rhein',
      sponsor: 'Admin',
      city: 'Köln',
      registeredAt: '2026-06-24',
      progress: 61,
      level: 'Partner',
      points: 720,
      ranking: 11,
      activity: 'Vor 5 Tagen',
      completedModules: ['Willkommen', 'Produkte verstehen'],
      uploads: ['PDF-Notizen'],
      quiz: 'Noch nicht bestanden',
      notes: 'Sperrstatus nur UI-Prototyp, keine echte Aktion.',
      adminComment: 'Vor Reaktivierung Support-Call.'
    },
    {
      id: 'ui-004',
      firstName: 'Jonas',
      lastName: 'Brandt',
      email: 'jonas.brandt@example.test',
      whatsapp: '+49 170 0000004',
      instagram: '@jonas.harbor',
      status: 'approved',
      team: 'Team Süd',
      sponsor: 'Elena P.',
      city: 'München',
      registeredAt: '2026-06-26',
      progress: 94,
      level: 'Teamleiter',
      points: 1680,
      ranking: 2,
      activity: 'Heute aktiv',
      completedModules: ['Willkommen', 'Wasserwissen', 'Kundengespräch', 'Recruiting'],
      uploads: ['Profilfoto', 'Präsentation'],
      quiz: 'Bestanden · 94%',
      notes: 'Bereit für Leader-Dashboard in späterer Phase.',
      adminComment: 'Potential hoch.'
    },
  ]), []);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortMode, setSortMode] = useState('registered-desc');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(mockPartners[0].id);
  const pageSize = 3;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPartners = useMemo(() => {
    return mockPartners
      .filter((partner) => filter === 'all' || partner.status === filter)
      .filter((partner) => {
        if (!normalizedQuery) {
          return true;
        }

        return [
          partner.firstName,
          partner.lastName,
          partner.email,
          partner.team,
          partner.city,
          partner.instagram,
        ].join(' ').toLowerCase().includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (sortMode === 'name') {
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`, 'de-DE');
        }

        if (sortMode === 'progress-desc') {
          return b.progress - a.progress;
        }

        return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime();
      });
  }, [filter, mockPartners, normalizedQuery, sortMode]);
  const pageCount = Math.max(1, Math.ceil(filteredPartners.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visiblePartners = filteredPartners.slice((safePage - 1) * pageSize, safePage * pageSize);
  const selectedPartner = mockPartners.find((partner) => partner.id === selectedId) || mockPartners[0];
  const metrics = [
    { icon: Users, label: 'Partner gesamt', value: 486, trend: '+12%' },
    { icon: UserCheck, label: 'Freigegeben', value: 392, trend: '+8%' },
    { icon: Bell, label: 'Pending', value: 31, trend: '+6 neu' },
    { icon: Lock, label: 'Gesperrt', value: 7, trend: 'stabil' },
    { icon: CalendarDays, label: 'Neue Registrierungen', value: 18, trend: '7 Tage' },
    { icon: Flame, label: 'Aktive Partner', value: 214, trend: '+21%' },
    { icon: UploadCloud, label: 'Neue Uploads', value: 43, trend: 'Woche' },
    { icon: Trophy, label: 'Module abgeschlossen', value: 1287, trend: '+96' },
  ];
  const academyRows = [
    ['Module', '13 aktiv', 'Reihenfolge vorbereitet', 'Sichtbar'],
    ['Videos', '18 Dateien', 'Streaming geschützt', 'Veröffentlicht'],
    ['PDFs', '24 Unterlagen', 'Download Center', 'Freigegeben'],
    ['Quiz', '4 Sets', 'Lokal vorbereitet', 'Entwurf'],
  ];

  const updateFilter = (nextFilter) => {
    setFilter(nextFilter);
    setPage(1);
  };

  const updateQuery = (value) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <section className="space-y-5">
      <Card className="overflow-hidden rounded-[2.25rem] border border-yellow-300/25 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.20),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.035),rgba(0,0,0,0.44))] text-white shadow-2xl shadow-yellow-500/10 backdrop-blur-xl">
        <CardContent className="p-5 sm:p-7 md:p-9">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <span className="rounded-full border border-yellow-300/25 bg-yellow-400/12 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-yellow-100">
                UI-Prototyp · Mockdaten · keine Backend-Aktion
              </span>
              <h2 className="mt-4 break-words text-4xl font-black leading-tight text-yellow-50 md:text-5xl">
                Admin Dashboard 2.0
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/62">
                Professionelle Partnerverwaltung für Wachstum auf 500+ Partner: Übersicht, Partnerdetails, Academy-Verwaltung, Charts und mobile Arbeitsflächen – vorbereitet für spätere Supabase-Anbindung.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex">
              <AdminPrototypeActionButton tone="primary"><ShieldCheck size={14} /> Freigabe-Queue</AdminPrototypeActionButton>
              <AdminPrototypeActionButton><Download size={14} /> Export UI</AdminPrototypeActionButton>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <AdminPrototypeMetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <AdminPrototypeChart title="Registrierungen" icon={CalendarDays} data={[{ label: 'Mo', value: 4 }, { label: 'Di', value: 7 }, { label: 'Mi', value: 6 }, { label: 'Do', value: 11 }, { label: 'Fr', value: 18 }]} />
        <AdminPrototypeChart title="Aktivität" icon={Flame} data={[{ label: 'Login', value: 84 }, { label: 'Module', value: 62 }, { label: 'Uploads', value: 31 }, { label: 'Quiz', value: 26 }]} />
        <AdminPrototypeChart title="Fortschritt & Module" icon={TrendingUp} data={[{ label: '0-25%', value: 34 }, { label: '26-50%', value: 58 }, { label: '51-75%', value: 73 }, { label: '76-100%', value: 49 }]} />
      </section>

      <section className="grid gap-5 2xl:grid-cols-[1fr_0.62fr]">
        <Card className="rounded-[2rem] border border-white/10 bg-white/[0.055] text-white backdrop-blur-xl">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-200">Partnerverwaltung</p>
                <h3 className="mt-2 text-2xl font-black text-yellow-50">Suche, Filter, Sortierung, Pagination</h3>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 xl:w-[36rem]">
                <label className="sm:col-span-1">
                  <span className="sr-only">Partner suchen</span>
                  <span className="flex min-h-11 items-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-3 focus-within:border-yellow-300/55">
                    <Search size={16} className="text-yellow-200" />
                    <input
                      value={query}
                      onChange={(event) => updateQuery(event.target.value)}
                      placeholder="Suche"
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/35"
                    />
                  </span>
                </label>
                <select value={filter} onChange={(event) => updateFilter(event.target.value)} className="min-h-11 rounded-2xl border border-white/10 bg-black/55 px-3 text-sm font-bold text-white outline-none">
                  <option value="all">Alle</option>
                  <option value="approved">Freigegeben</option>
                  <option value="pending">Pending</option>
                  <option value="blocked">Gesperrt</option>
                </select>
                <select value={sortMode} onChange={(event) => setSortMode(event.target.value)} className="min-h-11 rounded-2xl border border-white/10 bg-black/55 px-3 text-sm font-bold text-white outline-none">
                  <option value="registered-desc">Neueste</option>
                  <option value="name">Alphabetisch</option>
                  <option value="progress-desc">Fortschritt</option>
                </select>
              </div>
            </div>

            <div className="mt-5 hidden overflow-x-auto rounded-3xl border border-white/10 lg:block">
              <table className="w-full min-w-[58rem] text-left text-sm">
                <thead className="bg-black/45 text-xs uppercase tracking-[0.14em] text-white/42">
                  <tr>
                    {['Profil', 'Name', 'Status', 'Team', 'Registriert', 'Fortschritt', 'Aktionen'].map((header) => (
                      <th key={header} className="px-4 py-3 font-black">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {visiblePartners.map((partner) => (
                    <tr key={partner.id} className="bg-black/20 transition hover:bg-yellow-400/[0.06]">
                      <td className="px-4 py-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400/10 text-sm font-black text-yellow-100 ring-1 ring-yellow-200/20">
                          {getInitials(partner)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <button type="button" onClick={() => setSelectedId(partner.id)} className="text-left font-black text-yellow-50 hover:text-yellow-200">
                          {partner.firstName} {partner.lastName}
                        </button>
                        <p className="text-xs text-white/42">{partner.email}</p>
                      </td>
                      <td className="px-4 py-4"><AdminPrototypeStatusBadge status={partner.status} /></td>
                      <td className="px-4 py-4 text-white/65">{partner.team}</td>
                      <td className="px-4 py-4 text-white/65">{formatAdminDate(partner.registeredAt)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full bg-yellow-300" style={{ width: `${partner.progress}%` }} />
                          </div>
                          <span className="font-black text-yellow-50">{partner.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <AdminPrototypeActionButton tone="primary">Freigeben</AdminPrototypeActionButton>
                          <AdminPrototypeActionButton>Profil</AdminPrototypeActionButton>
                          <AdminPrototypeActionButton>Bearbeiten</AdminPrototypeActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 grid gap-3 lg:hidden">
              {visiblePartners.map((partner) => (
                <button key={partner.id} type="button" onClick={() => setSelectedId(partner.id)} className="rounded-3xl border border-white/10 bg-black/25 p-4 text-left transition hover:border-yellow-300/30 hover:bg-yellow-400/[0.08]">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/10 font-black text-yellow-100 ring-1 ring-yellow-200/20">
                      {getInitials(partner)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="break-words font-black text-yellow-50">{partner.firstName} {partner.lastName}</h4>
                        <AdminPrototypeStatusBadge status={partner.status} />
                      </div>
                      <p className="mt-1 text-xs text-white/45">{partner.team} · {formatAdminDate(partner.registeredAt)}</p>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full bg-yellow-300" style={{ width: `${partner.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-white/45">Seite {safePage} von {pageCount} · {filteredPartners.length} Mock-Partner</p>
              <div className="flex gap-2">
                <AdminPrototypeActionButton onClick={() => setPage((current) => Math.max(1, current - 1))}>Zurück</AdminPrototypeActionButton>
                <AdminPrototypeActionButton tone="primary" onClick={() => setPage((current) => Math.min(pageCount, current + 1))}>Weiter</AdminPrototypeActionButton>
              </div>
            </div>
          </CardContent>
        </Card>

        <AdminPrototypePartnerDetail partner={selectedPartner} />
      </section>

      <Panel title="Academy Verwaltung · UI-Prototyp" icon={BookOpen}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {academyRows.map(([area, count, order, visibility]) => (
            <div key={area} className="rounded-3xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">{area}</p>
              <h4 className="mt-2 text-xl font-black text-yellow-50">{count}</h4>
              <p className="mt-2 text-sm text-white/58">{order}</p>
              <p className="mt-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/65 ring-1 ring-white/10">{visibility}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {['Reihenfolge ändern', 'Sichtbarkeit setzen', 'Veröffentlichung planen', 'Quiz bearbeiten'].map((action) => (
            <AdminPrototypeActionButton key={action}>{action}</AdminPrototypeActionButton>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function AdminPanel({ partners, pendingPartners, approvedPartners, message, onApprove, onUpdate, onProfilePhotoChange, onSendReminder, onDelete, onCleanTestData, onCreateAcademyUpdate, onLoadDetail, academyUpdates = [], copy, compact = false }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState('created-desc');
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [detailRevision, setDetailRevision] = useState(0);
  const [selectedPartnerIds, setSelectedPartnerIds] = useState(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(adminPageSizeOptions[0]);
  const [activeOperationsTab, setActiveOperationsTab] = useState('pending');
  const testPartners = useMemo(() => partners.filter((partner) => partner.testData), [partners]);
  const realPartners = useMemo(() => partners.filter((partner) => !partner.testData), [partners]);
  const registrationMetrics = useMemo(() => getAdminRegistrationMetrics(realPartners), [realPartners]);
  const dashboardMetrics = useMemo(() => ({
    total: realPartners.length,
    approved: realPartners.filter((partner) => partner.status === 'approved').length,
    pending: realPartners.filter((partner) => partner.status === 'pending').length,
    blocked: realPartners.filter((partner) => partner.status === 'blocked').length,
    today: registrationMetrics.today,
    week: registrationMetrics.week,
    active: realPartners.filter((partner) => partner.status === 'approved' && partner.activityStatus?.id === 'active').length,
    inactive: realPartners.filter((partner) => partner.status === 'approved' && partner.activityStatus?.id === 'inactive').length,
    withoutProfileImage: realPartners.filter((partner) => !partner.profileImageUrl).length,
    withoutTeam: realPartners.filter((partner) => !String(partner.teamName || '').trim() && Number(partner.teamPartnerCount || 0) <= 0).length,
    withoutModuleCompletion: realPartners.filter((partner) => partner.status === 'approved' && partner.academyProgress?.completedModuleCount === 0).length,
    onboardingCompleted: realPartners.filter((partner) => partner.status === 'approved' && partner.academyProgress?.onboardingStatus === 'completed').length,
  }), [realPartners, registrationMetrics]);
  const operationsPartners = useMemo(() => ({
    pending: realPartners.filter((partner) => partner.status === 'pending'),
    active: realPartners.filter((partner) => partner.status === 'approved'),
    blocked: realPartners.filter((partner) => ['blocked', 'rejected', 'paused'].includes(partner.status)),
    leaders: realPartners.filter(isAdminOperationsLeader),
    activity: realPartners.filter((partner) => partner.lastActivityAt || partner.lastSeenAt || partner.academyProgress?.lastTrainingActivityAt),
  }), [realPartners]);
  const operationsTasks = useMemo(() => getAdminOperationalTasks(realPartners), [realPartners]);
  const filteredPartners = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase('de-DE');

    return partners
      .filter((partner) => {
        if (activeFilter === 'pending' && partner.status !== 'pending') {
          return false;
        }

        if (activeFilter === 'approved' && partner.status !== 'approved') {
          return false;
        }

        if (activeFilter === 'blocked' && partner.status !== 'blocked') {
          return false;
        }

        if (activeFilter === 'rejected' && partner.status !== 'rejected') {
          return false;
        }

        if (activeFilter === 'leaders' && !isAdminOperationsLeader(partner)) {
          return false;
        }

        if (activeFilter === 'test' && !partner.testData) {
          return false;
        }

        if (activeFilter === 'real' && partner.testData) {
          return false;
        }

        if (!normalizedQuery) {
          return true;
        }

        const searchable = [
          partner.firstName,
          partner.lastName,
          partner.email,
          partner.discountCode,
          partner.city,
        ].join(' ').toLocaleLowerCase('de-DE');

        return searchable.includes(normalizedQuery);
      })
      .sort((a, b) => compareAdminPartners(a, b, sortMode));
  }, [activeFilter, partners, searchQuery, sortMode]);
  const pageCount = Math.max(1, Math.ceil(filteredPartners.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const pageStartIndex = (safeCurrentPage - 1) * pageSize;
  const pagedPartners = filteredPartners.slice(pageStartIndex, pageStartIndex + pageSize);
  const visiblePartnerIds = pagedPartners.map((partner) => partner.id);
  const validPartnerIds = useMemo(() => new Set(partners.map((partner) => partner.id)), [partners]);
  const validSelectedPartnerIds = useMemo(
    () => new Set([...selectedPartnerIds].filter((partnerId) => validPartnerIds.has(partnerId))),
    [selectedPartnerIds, validPartnerIds],
  );
  const allVisiblePartnersSelected = visiblePartnerIds.length > 0
    && visiblePartnerIds.every((partnerId) => validSelectedPartnerIds.has(partnerId));
  const pageEndIndex = Math.min(pageStartIndex + pagedPartners.length, filteredPartners.length);

  useEffect(() => {
    if (!selectedPartnerId || !partners.some((partner) => partner.id === selectedPartnerId)) {
      return undefined;
    }

    let active = true;

    onLoadDetail(selectedPartnerId)
      .then((partner) => {
        if (active) {
          const activityPartner = partners.find((item) => item.id === partner.id);
          setSelectedPartner({
            ...partner,
            lastCommunityPostAt: activityPartner?.lastCommunityPostAt || '',
            lastSeenAt: activityPartner?.lastSeenAt || '',
            lastActivityAt: activityPartner?.lastActivityAt || partner.academyProgress?.lastTrainingActivityAt || '',
            activityStatus: activityPartner?.activityStatus || getPartnerActivityStatus(partner.academyProgress?.lastTrainingActivityAt),
          });
          setDetailRevision((current) => current + 1);
        }
      })
      .catch((error) => {
        if (active) {
          setSelectedPartner(null);
          setDetailError(error.message || 'Partnerdetails konnten nicht geladen werden.');
        }
      })
      .finally(() => {
        if (active) {
          setDetailLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [onLoadDetail, partners, selectedPartnerId]);

  const selectPartner = (partnerId) => {
    setSelectedPartnerId(partnerId);
    setSelectedPartner(null);
    setDetailError('');
    setDetailLoading(true);
  };

  const updateSearchQuery = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const updateFilter = (filterId) => {
    setActiveFilter(filterId);
    setCurrentPage(1);
  };

  const updateOperationsTab = (tabId) => {
    setActiveOperationsTab(tabId);

    const linkedFilter = adminOperationsTabFilterMap[tabId];

    if (linkedFilter) {
      setActiveFilter(linkedFilter);
      setCurrentPage(1);
    }
  };

  const updateSortMode = (value) => {
    setSortMode(value);
    setCurrentPage(1);
  };

  const updatePageSize = (value) => {
    setPageSize(Number(value));
    setCurrentPage(1);
  };

  const togglePartnerSelection = (partnerId) => {
    setSelectedPartnerIds((current) => {
      const next = new Set(current);

      if (next.has(partnerId)) {
        next.delete(partnerId);
      } else {
        next.add(partnerId);
      }

      return next;
    });
  };

  const toggleVisiblePartnerSelection = () => {
    setSelectedPartnerIds((current) => {
      const next = new Set(current);

      if (allVisiblePartnersSelected) {
        visiblePartnerIds.forEach((partnerId) => next.delete(partnerId));
      } else {
        visiblePartnerIds.forEach((partnerId) => next.add(partnerId));
      }

      return next;
    });
  };

  const closePartnerDetail = () => {
    setSelectedPartnerId('');
    setSelectedPartner(null);
    setDetailError('');
    setDetailLoading(false);
  };

  const deleteSelectedPartner = async (partnerId) => {
    const deleted = await onDelete(partnerId);

    if (deleted === false) {
      return;
    }

    setSelectedPartnerIds((current) => {
      const next = new Set(current);
      next.delete(partnerId);
      return next;
    });
    closePartnerDetail();
  };

  return (
    <div className={compact ? '' : 'space-y-5'}>
      <PanelHeader title={copy.partnerApproval} text={`${pendingPartners.length} wartend · ${approvedPartners.length} freigegeben · ${testPartners.length} Testdaten · ${realPartners.length} echte Registrierungen`} />
      {message && <AuthMessage>{message}</AuthMessage>}

      {!compact && (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <Stat icon={Users} label="Gesamtpartner" value={dashboardMetrics.total} />
          <Stat icon={UserCheck} label="Freigegeben" value={dashboardMetrics.approved} />
          <Stat icon={Bell} label="Wartend" value={dashboardMetrics.pending} />
          <Stat icon={Lock} label="Blockiert" value={dashboardMetrics.blocked} />
          <Stat icon={CalendarDays} label="Heute registriert" value={dashboardMetrics.today} />
          <Stat icon={Clock} label="Diese Woche registriert" value={dashboardMetrics.week} />
        </section>
      )}

      {!compact && (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <Stat icon={CheckCircle2} label="Aktive Partner" value={dashboardMetrics.active} />
          <Stat icon={Clock} label="Inaktive Partner" value={dashboardMetrics.inactive} />
          <Stat icon={Camera} label="Ohne Profilbild" value={dashboardMetrics.withoutProfileImage} />
          <Stat icon={Users} label="Ohne Team" value={dashboardMetrics.withoutTeam} />
          <Stat icon={BookOpen} label="Ohne Modulabschluss" value={dashboardMetrics.withoutModuleCompletion} />
          <Stat icon={Trophy} label="Onboarding abgeschlossen" value={dashboardMetrics.onboardingCompleted} />
        </section>
      )}

      {!compact && (
        <AdminOperationsCenter
          activeTab={activeOperationsTab}
          metrics={dashboardMetrics}
          pendingPartners={operationsPartners.pending}
          activePartners={operationsPartners.active}
          blockedPartners={operationsPartners.blocked}
          leaderPartners={operationsPartners.leaders}
          activityPartners={operationsPartners.activity}
          tasks={operationsTasks}
          onTabChange={updateOperationsTab}
          onApprove={onApprove}
          onUpdate={onUpdate}
          onSelect={selectPartner}
        />
      )}

      {!compact && <AdminNotificationPreparationPanel />}

      {!compact && (
        <AcademyUpdateAdminForm
          approvedPartners={approvedPartners}
          academyUpdates={academyUpdates}
          onCreateAcademyUpdate={onCreateAcademyUpdate}
          copy={copy}
        />
      )}

      {!compact && (
        <Panel title={copy.adminBookingTitle} icon={CalendarDays}>
          <p className="text-sm leading-relaxed text-white/60">{copy.adminBookingText}</p>
          <PremiumCalendlyLink copy={copy} label={copy.bookAppointment} className="mt-5 w-full sm:w-auto" />
        </Panel>
      )}

      {!compact && <AcademyAssetsAdminPanel />}

      <section className="rounded-[2rem] border border-yellow-300/15 bg-white/[0.05] p-4 text-white">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,0.35fr)_auto] lg:items-end">
          <label className="block">
            <span className="mb-1 block text-xs text-white/50">Partner suchen</span>
            <span className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 focus-within:border-yellow-300/70">
              <Search size={17} className="shrink-0 text-yellow-300" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => updateSearchQuery(event.target.value)}
                placeholder="Name, E-Mail, Rabattcode oder Stadt"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/35"
              />
              {searchQuery && (
                <button type="button" onClick={() => updateSearchQuery('')} className="rounded-full p-1 text-white/45 hover:bg-white/10 hover:text-white" aria-label="Suche zurücksetzen">
                  <X size={15} />
                </button>
              )}
            </span>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-white/50">Sortierung</span>
            <select value={sortMode} onChange={(event) => updateSortMode(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm outline-none focus:border-yellow-300/70">
              {adminSortOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </label>
          {!compact && (
            <Button onClick={onCleanTestData} className="rounded-2xl border border-red-300/30 bg-red-500/15 px-5 py-3 font-bold text-red-100 hover:bg-red-500/25">
              <Trash2 size={16} /> Testdaten bereinigen
            </Button>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {adminFilterOptions.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => updateFilter(filter.id)}
                className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${activeFilter === filter.id ? 'bg-yellow-400 text-black' : 'bg-black/30 text-white/70 ring-1 ring-white/10 hover:bg-white/10 hover:text-white'}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-sm text-white/55">
          Filter aktiv: {adminFilterOptions.find((filter) => filter.id === activeFilter)?.label || 'Alle Partner'} · {filteredPartners.length} von {partners.length} sichtbar
        </p>
      </section>

      <div className={compact ? 'space-y-3' : 'grid items-start gap-4 xl:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)]'}>
        <section className={`${selectedPartnerId ? 'order-2 xl:order-1' : ''} min-w-0 rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 sm:p-4`}>
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Partnerliste</p>
              <p className="mt-1 text-sm text-white/50">
                {filteredPartners.length} Ergebnisse · {validSelectedPartnerIds.size} ausgewählt
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={allVisiblePartnersSelected}
                  onChange={toggleVisiblePartnerSelection}
                  disabled={visiblePartnerIds.length === 0}
                  className="accent-yellow-300"
                />
                Seite auswählen
              </label>
              {validSelectedPartnerIds.size > 0 && (
                <button type="button" onClick={() => setSelectedPartnerIds(new Set())} className="rounded-2xl border border-yellow-300/25 bg-yellow-400/10 px-3 py-2 text-xs font-bold text-yellow-100 hover:bg-yellow-400/20">
                  Auswahl aufheben
                </button>
              )}
            </div>
          </div>
          {validSelectedPartnerIds.size > 0 && (
            <div className="mb-3 rounded-2xl border border-yellow-300/20 bg-yellow-400/10 px-4 py-3 text-xs leading-relaxed text-yellow-100">
              Mehrfachauswahl vorbereitet: {validSelectedPartnerIds.size} Partner ausgewählt. Bulk-Aktionen werden erst in einem später freigegebenen Schritt ergänzt.
            </div>
          )}
          <div className="max-h-[760px] space-y-2 overflow-y-auto pr-1">
            {filteredPartners.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-black/25 p-5 text-white/60">
                Keine Partner entsprechen der aktuellen Suche und dem Filter.
              </div>
            )}
            {pagedPartners.map((partner) => (
              <AdminPartnerListItem
                key={partner.id}
                partner={partner}
                detailSelected={partner.id === selectedPartnerId}
                bulkSelected={validSelectedPartnerIds.has(partner.id)}
                onSelect={() => selectPartner(partner.id)}
                onToggleSelection={() => togglePartnerSelection(partner.id)}
              />
            ))}
          </div>
          {filteredPartners.length > 0 && (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-white/60">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  {pageStartIndex + 1}–{pageEndIndex} von {filteredPartners.length}
                </span>
                <label className="flex items-center gap-2">
                  <span className="text-xs">Pro Seite</span>
                  <select value={pageSize} onChange={(event) => updatePageSize(event.target.value)} className="rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-xs outline-none focus:border-yellow-300/70">
                    {adminPageSizeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                <button
                  type="button"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Zurück
                </button>
                <span className="px-2 text-center text-xs font-bold text-yellow-100">Seite {safeCurrentPage} von {pageCount}</span>
                <button
                  type="button"
                  disabled={safeCurrentPage >= pageCount}
                  onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Weiter
                </button>
              </div>
            </div>
          )}
        </section>

        <section className={`${selectedPartnerId ? 'order-1 xl:order-2' : 'hidden xl:block'} min-w-0`}>
          {!selectedPartnerId && (
            <div className="rounded-[2rem] border border-dashed border-yellow-300/25 bg-yellow-400/[0.06] p-8 text-center">
              <Users className="mx-auto text-yellow-300" size={30} />
              <p className="mt-4 font-black text-yellow-50">Partner auswählen</p>
              <p className="mt-2 text-sm text-white/55">Die vollständigen Partnerdaten und Verwaltungsaktionen werden erst nach Auswahl geladen.</p>
            </div>
          )}
          {selectedPartnerId && (
            <div className="space-y-3">
              <button type="button" onClick={closePartnerDetail} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white">
                <X size={16} /> Detailansicht schließen
              </button>
              {detailLoading && (
                <div className="rounded-[2rem] border border-yellow-300/15 bg-yellow-400/[0.06] p-6 text-sm text-yellow-100">
                  Partnerdetails werden geladen …
                </div>
              )}
              {detailError && <AuthMessage>{detailError}</AuthMessage>}
              {!detailLoading && selectedPartner && (
                <AdminPartnerDetail
                  key={`${selectedPartner.id}-${detailRevision}`}
                  partner={selectedPartner}
                  onApprove={onApprove}
                  onUpdate={onUpdate}
                  onProfilePhotoChange={onProfilePhotoChange}
                  onSendReminder={onSendReminder}
                  onDelete={deleteSelectedPartner}
                  compact={compact}
                  copy={copy}
                />
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function AdminPartnerListItem({ partner, detailSelected, bulkSelected, onSelect, onToggleSelection }) {
  const riskMarkers = getAdminRiskMarkers(partner);

  return (
    <article className={`rounded-3xl border p-3 transition sm:p-4 ${detailSelected ? 'border-yellow-200/60 bg-yellow-400/15 shadow-lg shadow-yellow-500/10' : bulkSelected ? 'border-yellow-300/35 bg-yellow-400/[0.08]' : 'border-white/10 bg-black/25 hover:border-yellow-300/35 hover:bg-white/[0.07]'}`}>
      <div className="flex min-w-0 items-start gap-3">
        <label className="mt-1 inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-black/35 hover:border-yellow-300/40" title="Für spätere Bulk-Aktion auswählen">
          <input
            type="checkbox"
            checked={bulkSelected}
            onChange={onToggleSelection}
            className="accent-yellow-300"
            aria-label={`${partner.firstName} ${partner.lastName} auswählen`}
          />
        </label>
        <CareerAvatar partner={partner} size="sm" />
        <button type="button" onClick={onSelect} className="min-w-0 flex-1 text-left" aria-pressed={detailSelected}>
          <span className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <span className="min-w-0">
              <span className="block truncate font-black text-yellow-50">{partner.firstName} {partner.lastName}</span>
              <span className="block break-all text-xs text-white/55">{partner.email || 'Keine E-Mail hinterlegt'}</span>
            </span>
            <StatusBadge status={partner.status} />
          </span>
          <span className="mt-3 grid gap-2 rounded-2xl border border-white/10 bg-black/20 p-3 text-xs sm:grid-cols-2">
            <span className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">Status</span>
              <span className="mt-1 block truncate font-semibold text-white/75">{partner.status}</span>
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">Team</span>
              <span className="mt-1 block truncate font-semibold text-white/75">{partner.teamName || 'Nicht zugeordnet'}</span>
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">Level</span>
              <span className="mt-1 block truncate font-semibold text-white/75">{partner.aquaLevel || 'Starterstufe'}</span>
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">Registriert am</span>
              <span className="mt-1 block truncate font-semibold text-white/75">{formatAdminDate(partner.createdAt)}</span>
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">Aktivität</span>
              <span className="mt-1 block truncate font-semibold text-white/75">{partner.activityStatus?.label || 'Noch nicht erfasst'}</span>
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">Onboarding</span>
              <span className="mt-1 block truncate font-semibold text-white/75">{partner.academyProgress?.onboardingStatusLabel || 'Nicht begonnen'}</span>
            </span>
          </span>
          {riskMarkers.length > 0 && (
            <span className="mt-3 flex flex-wrap gap-1.5">
              {riskMarkers.map((marker) => (
                <span key={marker.id} className={`rounded-full px-2.5 py-1 text-[10px] font-black ring-1 ${marker.className}`}>
                  {marker.label}
                </span>
              ))}
            </span>
          )}
          <span className="mt-3 flex items-center justify-between gap-3 text-xs font-bold text-yellow-200">
            <span>{partner.testData ? 'Testdaten' : 'Echte Registrierung'}</span>
            <span className="inline-flex items-center gap-1">Details <ChevronRight size={14} /></span>
          </span>
        </button>
      </div>
    </article>
  );
}

function AcademyUpdateAdminForm({ approvedPartners, academyUpdates, onCreateAcademyUpdate, copy }) {
  const [form, setForm] = useState({
    title: '',
    category: 'news',
    description: '',
    link: '',
    language: 'Alle Sprachen',
    targetType: 'all',
    targetLanguage: DEFAULT_LANGUAGE,
    targetTraining: trainingOptions[0],
    targetPartnerIds: [],
    deliveryEmail: true,
    deliveryWhatsapp: true,
    deliveryDashboard: true,
  });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [localMessage, setLocalMessage] = useState('');
  const logs = academyUpdates.filter((update) => update.type === 'academy-update' || update.recipientCount !== undefined).slice(0, 6);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setLocalMessage('');
  };

  const toggleTargetPartner = (partnerId) => {
    setForm((current) => {
      const exists = current.targetPartnerIds.includes(partnerId);
      return {
        ...current,
        targetPartnerIds: exists
          ? current.targetPartnerIds.filter((id) => id !== partnerId)
          : [...current.targetPartnerIds, partnerId],
      };
    });
  };

  const submitUpdate = async (sendNow) => {
    if (!confirmAdminAction({
      title: sendNow ? 'Academy-Update veröffentlichen' : 'Academy-Update als Entwurf speichern',
      target: form.title || 'Academy-Update ohne Titel',
      consequences: sendNow
        ? [
            'Das Update wird dauerhaft im Academy-Newsbereich gespeichert.',
            'Je nach Zielgruppe und Versandkanal können Partner per Dashboard, E-Mail oder WhatsApp-Vorlage informiert werden.',
            'Bereits versendete E-Mails können nicht zurückgerufen werden.',
          ]
        : [
            'Der Entwurf wird dauerhaft im Academy-Newsbereich gespeichert.',
            'Er ist später in der Admin-Übersicht nachvollziehbar.',
          ],
    })) {
      return;
    }

    setSending(true);
    setLocalMessage('');

    try {
      const nextResult = await onCreateAcademyUpdate({ ...form, sendNow, draft: !sendNow });
      setResult(nextResult);
      setLocalMessage(copy.academyUpdateSent);
      if (sendNow) {
        setForm((current) => ({ ...current, title: '', description: '', link: '' }));
      }
    } catch (error) {
      setLocalMessage(error.message || 'Neuigkeit konnte nicht gespeichert werden.');
    } finally {
      setSending(false);
    }
  };

  const copyWhatsapp = async () => {
    const text = result?.whatsappText || `Hallo [Vorname], in der Harbor Global Academy gibt es neue Inhalte: ${form.title || '[Titel]'}. Schau direkt rein: ${form.link || '[Link]'}`;

    try {
      await navigator.clipboard.writeText(text);
      setLocalMessage(copy.whatsappCopied);
    } catch {
      setLocalMessage(text);
    }
  };

  return (
    <Panel title={copy.adminUpdateTitle} icon={Bell}>
      <p className="mb-5 text-sm leading-relaxed text-white/60">{copy.adminUpdateIntro}</p>
      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Input label={copy.updateTitleLabel} value={form.title} onChange={(event) => updateField('title', event.target.value)} />
            <label className="block">
              <span className="mb-1 block text-xs text-white/50">{copy.updateCategoryLabel}</span>
              <select value={form.category} onChange={(event) => updateField('category', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 outline-none focus:border-yellow-300/70">
                {academyUpdateCategories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
              </select>
            </label>
            <Input label={copy.updateLinkLabel} value={form.link} onChange={(event) => updateField('link', event.target.value)} placeholder="https://www.harborglobalacademy.com/" />
            <Select label={copy.updateLanguageLabel} options={['Alle Sprachen', ...languages]} value={form.language} onChange={(value) => updateField('language', value)} />
          </div>
          <Textarea label={copy.updateDescriptionLabel} value={form.description} onChange={(event) => updateField('description', event.target.value)} />

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs text-white/50">{copy.updateTargetLabel}</span>
              <select value={form.targetType} onChange={(event) => updateField('targetType', event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 outline-none focus:border-yellow-300/70">
                {updateTargetOptions.map((target) => <option key={target.value} value={target.value}>{copy[target.labelKey]}</option>)}
              </select>
            </label>
            {form.targetType === 'language' && <Select label={copy.notificationLanguage} options={languages} value={form.targetLanguage} onChange={(value) => updateField('targetLanguage', value)} />}
            {form.targetType === 'training' && <Select label={copy.targetTrainingLabel} options={trainingOptions} value={form.targetTraining} onChange={(value) => updateField('targetTraining', value)} />}
          </div>

          {form.targetType === 'partners' && (
            <div className="max-h-52 overflow-y-auto rounded-3xl border border-white/10 bg-black/25 p-3">
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-yellow-200">{copy.targetPartnersLabel}</p>
              <div className="grid gap-2 md:grid-cols-2">
                {approvedPartners.map((partner) => (
                  <label key={partner.id} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
                    <input type="checkbox" checked={form.targetPartnerIds.includes(partner.id)} onChange={() => toggleTargetPartner(partner.id)} className="accent-yellow-300" />
                    <span className="truncate">{partner.firstName} {partner.lastName} · {partner.email}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-yellow-300/15 bg-yellow-400/10 p-4">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-yellow-200">{copy.deliveryType}</p>
            <div className="grid gap-2 md:grid-cols-3">
              <label className="flex items-center gap-2 rounded-2xl bg-black/25 px-3 py-2 text-sm text-white/70">
                <input type="checkbox" checked={form.deliveryEmail} onChange={(event) => updateField('deliveryEmail', event.target.checked)} className="accent-yellow-300" />
                {copy.deliveryEmail}
              </label>
              <label className="flex items-center gap-2 rounded-2xl bg-black/25 px-3 py-2 text-sm text-white/70">
                <input type="checkbox" checked={form.deliveryWhatsapp} onChange={(event) => updateField('deliveryWhatsapp', event.target.checked)} className="accent-yellow-300" />
                {copy.deliveryWhatsappPrepared}
              </label>
              <label className="flex items-center gap-2 rounded-2xl bg-black/25 px-3 py-2 text-sm text-white/70">
                <input type="checkbox" checked={form.deliveryDashboard} onChange={(event) => updateField('deliveryDashboard', event.target.checked)} className="accent-yellow-300" />
                {copy.deliveryDashboardOnly}
              </label>
            </div>
          </div>

          {localMessage && <AuthMessage>{localMessage}</AuthMessage>}
          <div className="grid gap-3 md:grid-cols-3">
            <Button type="button" disabled={sending} onClick={() => submitUpdate(true)} className="rounded-2xl bg-yellow-400 px-5 py-3 font-black text-black hover:bg-yellow-300 disabled:opacity-60">
              <Send size={16} /> {sending ? copy.saving : copy.sendNow}
            </Button>
            <Button type="button" disabled={sending} onClick={() => submitUpdate(false)} className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15 disabled:opacity-60">
              <FileText size={16} /> {copy.saveDraft}
            </Button>
            <Button type="button" onClick={copyWhatsapp} className="rounded-2xl border border-yellow-300/25 bg-yellow-400/15 px-5 py-3 font-bold text-yellow-100 hover:bg-yellow-400/25">
              <MessageCircle size={16} /> {copy.copyWhatsappMessage}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-yellow-200">{copy.whatsappMessageCopy}</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/65">
              {result?.whatsappText || `Hallo [Vorname], in der Harbor Global Academy gibt es neue Inhalte: ${form.title || '[Titel]'}. Schau direkt rein: ${form.link || '[Link]'}`}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-yellow-200">{copy.notificationLogs}</p>
            <div className="mt-3 space-y-3">
              {logs.length === 0 && <p className="text-sm text-white/50">Noch keine Logs.</p>}
              {logs.map((log) => (
                <div key={log.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm">
                  <p className="font-bold text-yellow-50">{log.title}</p>
                  <p className="mt-1 text-white/55">{formatAdminDate(log.sentAt || log.createdAt)} · {log.sendStatus || log.status}</p>
                  <p className="mt-1 text-white/45">{copy.recipientCount}: {log.recipientCount || 0} · {copy.emailSentCount}: {log.emailSentCount || 0} · {copy.emailFailedCount}: {log.emailFailedCount || 0}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function AcademyAssetsAdminPanel() {
  const partnerDocs = academyDocuments.filter((documentItem) => documentItem.visibility !== 'public');
  const publicDocs = academyDocuments.filter((documentItem) => documentItem.visibility === 'public');
  const catalogModules = getAcademyContentCatalog('de');
  const catalogSummary = getAcademyContentSummary();
  const quizQuestions = getAcademyQuizQuestions('de');
  const [contentSearch, setContentSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const normalizedSearch = contentSearch.trim().toLowerCase();
  const parityRows = VIDEO_TRANSLATION_LANGUAGES.map((language) => ({
    ...language,
    modulesCount: contentByCode[language.code]?.modules?.length || 0,
    status: (contentByCode[language.code]?.modules?.length || 0) === modules.length ? 'OK' : 'translation_missing',
  }));
  const contentStatusMap = {
    draft: { label: 'Entwurf', className: 'bg-yellow-400/15 text-yellow-100 ring-yellow-300/20' },
    active: { label: 'Veröffentlicht', className: 'bg-emerald-400/15 text-emerald-100 ring-emerald-300/20' },
    archived: { label: 'Archiviert', className: 'bg-white/10 text-white/60 ring-white/10' },
    planned: { label: 'Geplant', className: 'bg-blue-400/15 text-blue-100 ring-blue-300/20' },
    review: { label: 'In Prüfung', className: 'bg-orange-400/15 text-orange-100 ring-orange-300/20' },
  };
  const renderStatusBadge = (status) => {
    const item = contentStatusMap[status] || contentStatusMap.draft;

    return (
      <span className={`inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ring-1 ${item.className}`}>
        {item.label}
      </span>
    );
  };
  const moduleRows = catalogModules.map((moduleItem, index) => ({
    id: moduleItem.id,
    title: moduleItem.title,
    category: moduleItem.category,
    status: index === 0 ? 'active' : index === 6 ? 'archived' : index % 4 === 0 ? 'draft' : 'active',
    duration: `${Math.max(12, moduleItem.lessons.length * 7)} Min.`,
    order: moduleItem.order,
    visibility: index < 2 ? 'Alle freigegebenen Partner' : index === 6 ? 'Admin intern' : 'Partner',
    progress: Math.min(100, 28 + (index * 9)),
    assets: [
      moduleItem.resources?.videos?.length ? `${moduleItem.resources.videos.length} Video` : null,
      moduleItem.resources?.pdfs?.length ? `${moduleItem.resources.pdfs.length} PDF` : null,
      moduleItem.resources?.quizzes?.length ? `${moduleItem.resources.quizzes.length} Quiz` : null,
      moduleItem.resources?.downloads?.length ? 'Download Center' : null,
    ].filter(Boolean).join(' · ') || 'Inhalte vorbereitet',
  }));
  const visibleModuleRows = moduleRows.filter((moduleItem) => {
    if (statusFilter !== 'all' && moduleItem.status !== statusFilter) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return [moduleItem.title, moduleItem.category, moduleItem.visibility, moduleItem.assets]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch);
  });
  const videoRows = academyVideos.slice(0, 9).map((video, index) => {
    const assignedModule = catalogModules[index % catalogModules.length];

    return {
      id: video.id,
      title: video.title,
      moduleTitle: assignedModule?.title || 'Academy Modul',
      duration: video.duration || `${8 + index} Min.`,
      status: index % 5 === 0 ? 'draft' : 'active',
      type: index % 4 === 0 ? 'Platzhalter geprüft' : 'Geschütztes Video',
    };
  });
  const documentRows = academyDocuments.slice(0, 10).map((documentItem) => ({
    id: documentItem.id,
    title: documentItem.title,
    category: documentItem.category || documentItem.categoryId,
    language: (documentItem.languageCodes || ['de']).join(', ').toUpperCase(),
    moduleTitle: documentItem.modules?.length
      ? documentItem.modules.map((moduleId) => catalogModules.find((moduleItem) => moduleItem.id === moduleId)?.title).filter(Boolean).slice(0, 2).join(' · ')
      : 'Download Center',
    visibility: documentItem.visibility === 'public' ? 'Öffentlich' : 'Partner intern',
    status: documentItem.visibility === 'public' ? 'review' : 'active',
    type: String(documentItem.type || 'pdf').toUpperCase(),
  }));
  const quizGroups = quizQuestions.reduce((groups, question) => {
    const moduleId = question.moduleId || 11;
    const current = groups.get(moduleId) || [];
    current.push(question);
    groups.set(moduleId, current);
    return groups;
  }, new Map());
  const quizRows = Array.from(quizGroups.entries()).map(([moduleId, questions], index) => ({
    id: `quiz-${moduleId}`,
    title: index === 0 ? 'Academy Grundlagen-Quiz' : `Wissenscheck Modul ${moduleId}`,
    moduleTitle: catalogModules.find((moduleItem) => moduleItem.id === moduleId)?.title || `Modul ${moduleId}`,
    questions: questions.length,
    passRate: index % 2 === 0 ? '80%' : '70%',
    status: index % 4 === 0 ? 'draft' : 'active',
  }));
  const taskRows = [
    { id: 'task-day-01', title: 'Tag 1 · Startprofil prüfen', moduleTitle: 'Willkommen / Startcenter', type: 'Tagesaufgabe', status: 'active', priority: 'Hoch' },
    { id: 'task-partner-01', title: 'Ersten Wassertest vorbereiten', moduleTitle: 'Testlabor', type: 'Partner-Aufgabe', status: 'active', priority: 'Hoch' },
    { id: 'task-leader-01', title: 'Neuen Partner im Start begleiten', moduleTitle: 'Partneraufbau', type: 'Leader-Aufgabe', status: 'draft', priority: 'Mittel' },
    { id: 'task-day-07', title: 'PDF lesen und Fragen notieren', moduleTitle: 'Downloads', type: 'Tagesaufgabe', status: 'planned', priority: 'Mittel' },
    { id: 'task-partner-02', title: 'Kundengespräch simulieren', moduleTitle: 'Verkaufssystem', type: 'Partner-Aufgabe', status: 'active', priority: 'Hoch' },
  ];
  const calendarRows = [
    { id: 'calendar-01', title: 'Willkommensvideo ersetzen', date: '2026-07-03', category: 'Video', status: 'planned' },
    { id: 'calendar-02', title: '14-Tage Wasser Challenge vorbereiten', date: '2026-07-08', category: 'Onboarding', status: 'draft' },
    { id: 'calendar-03', title: 'Neue Social-Media-Unterlagen prüfen', date: '2026-07-12', category: 'Downloads', status: 'review' },
    { id: 'calendar-04', title: 'Recruiting-Modul veröffentlichen', date: '2026-07-18', category: 'Modul', status: 'planned' },
  ];
  const managementMetrics = [
    { icon: BookOpen, label: 'Module verwaltbar', value: moduleRows.length, trend: 'UI' },
    { icon: Video, label: 'Videos sichtbar', value: videoRows.length, trend: 'Preview' },
    { icon: FileText, label: 'Dokumente', value: documentRows.length, trend: 'Read-only' },
    { icon: FileQuestion, label: 'Quiz-Sets', value: quizRows.length, trend: 'lokal' },
    { icon: CheckCircle2, label: 'Aufgaben', value: taskRows.length, trend: 'Planung' },
    { icon: CalendarDays, label: 'Kalenderpunkte', value: calendarRows.length, trend: 'geplant' },
  ];
  const marketingHub = growthHubSections.find((section) => section.id === 'marketing-hub');
  const aiHub = growthHubSections.find((section) => section.id === 'ai-center');
  const productHub = growthHubSections.find((section) => section.id === 'product-center');
  const cmsSections = [
    {
      id: 'academy-modules',
      title: 'Academy Module',
      description: 'Modulstruktur, Reihenfolge, Sichtbarkeit und Lernpfad als zentrale CMS-Karte.',
      count: moduleRows.length,
      lastUpdated: `${catalogSummary.lessons} Lektionen im vorhandenen Katalog`,
      status: 'active',
      category: 'Academy',
      language: 'DE/RU/RO/EN',
      icon: BookOpen,
    },
    {
      id: 'videos',
      title: 'Videos',
      description: 'Geschützte Academy-Videos und Modulzuordnung als UI-Vorschau.',
      count: videoRows.length,
      lastUpdated: `${catalogSummary.videos} Videos · ${catalogSummary.videoPlaceholders} Platzhalter`,
      status: 'review',
      category: 'Academy',
      language: 'DE/RU/RO/EN',
      icon: Video,
    },
    {
      id: 'pdfs',
      title: 'PDFs',
      description: 'PDF-Unterlagen, Sprache, Sichtbarkeit und Modulbezug.',
      count: documentRows.filter((item) => item.type === 'PDF').length || documentRows.length,
      lastUpdated: 'bestehende geschützte Dokumentenliste',
      status: 'active',
      category: 'Dokumente',
      language: 'Mehrsprachig',
      icon: FileText,
    },
    {
      id: 'quiz',
      title: 'Quiz',
      description: 'Quiz-Sets, Fragenanzahl und Bestehensgrenzen als lokale UI.',
      count: quizRows.length,
      lastUpdated: `${quizQuestions.length} Fragen aus vorhandenem Katalog`,
      status: 'draft',
      category: 'Academy',
      language: 'DE',
      icon: FileQuestion,
    },
    {
      id: 'downloads',
      title: 'Downloads',
      description: 'Interne und öffentliche Download-Unterlagen als schreibgeschützte Übersicht.',
      count: partnerDocs.length + publicDocs.length,
      lastUpdated: 'Download Center read-only',
      status: 'active',
      category: 'Dokumente',
      language: 'Mehrsprachig',
      icon: Download,
    },
    {
      id: 'growth-center',
      title: 'Growth Center Inhalte',
      description: 'Post-Academy-Kategorien für Marketing, Vertrieb, Recruiting und langfristiges Wachstum.',
      count: growthCenterCategories.length,
      lastUpdated: 'UI-Grundlage vorbereitet',
      status: 'planned',
      category: 'Growth Center',
      language: 'DE',
      icon: Flame,
    },
    {
      id: 'marketing-content',
      title: 'Marketing Inhalte',
      description: 'Kampagnen, Flyer, Vorlagen, Werbematerial und Download-Strukturen.',
      count: marketingHub?.items?.length || 0,
      lastUpdated: 'Marketing Hub UI vorbereitet',
      status: 'planned',
      category: 'Marketing',
      language: 'DE',
      icon: Globe2,
    },
    {
      id: 'ai-prompts',
      title: 'KI-Prompts',
      description: 'Prompt-Bibliothek für Text, Bild, Video, Verkauf und spätere KI-Agenten.',
      count: aiHub?.items?.length || 0,
      lastUpdated: 'KI Center UI vorbereitet',
      status: 'draft',
      category: 'KI & Tools',
      language: 'DE',
      icon: Settings,
    },
    {
      id: 'product-information',
      title: 'Produktinformationen',
      description: 'Produktwissen, Produktupdates, Aktionen und Verkaufsargumente.',
      count: (productHub?.items?.length || 0) + documentRows.filter((item) => String(item.category || '').toLowerCase().includes('produkt')).length,
      lastUpdated: 'Produkt Center UI vorbereitet',
      status: 'review',
      category: 'Produkte',
      language: 'Mehrsprachig',
      icon: BookOpen,
    },
    {
      id: 'campaigns',
      title: 'Kampagnen',
      description: 'Geplante Launch-, Recruiting- und Social-Media-Kampagnen.',
      count: calendarRows.filter((item) => ['Onboarding', 'Downloads', 'Modul'].includes(item.category)).length + 1,
      lastUpdated: 'Content-Kalender vorbereitet',
      status: 'planned',
      category: 'Marketing',
      language: 'DE',
      icon: CalendarDays,
    },
  ];
  const cmsCategoryOptions = ['all', ...Array.from(new Set(cmsSections.map((section) => section.category)))];
  const cmsLanguageOptions = ['all', 'DE', 'RU', 'RO', 'EN', 'Mehrsprachig'];
  const visibleCmsSections = cmsSections.filter((section) => {
    if (statusFilter !== 'all' && section.status !== statusFilter) {
      return false;
    }

    if (categoryFilter !== 'all' && section.category !== categoryFilter) {
      return false;
    }

    if (languageFilter !== 'all' && !section.language.includes(languageFilter)) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    return [
      section.title,
      section.category,
      section.description,
      section.lastUpdated,
      contentStatusMap[section.status]?.label,
    ].join(' ').toLowerCase().includes(normalizedSearch);
  });

  return (
    <Panel title="Academy CMS · UI-Prototyp" icon={Settings}>
      <div className="rounded-[2rem] border border-yellow-300/20 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.07),rgba(0,0,0,0.28))] p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <span className="rounded-full border border-yellow-300/25 bg-yellow-400/12 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-yellow-100">
              UI-Prototyp · keine Uploads · keine Backend-Aktion
            </span>
            <h3 className="mt-4 break-words text-3xl font-black text-yellow-50">Academy CMS</h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/62">
              Zentrale Arbeitsfläche für Academy Module, Videos, PDFs, Quiz, Downloads, Growth Center Inhalte, Marketing, KI-Prompts, Produktinformationen und Kampagnen. Alle Aktionen sind reine UI-Vorschau und verändern keine Academy-Dateien.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:w-[38rem]">
            <label>
              <span className="sr-only">Content suchen</span>
              <span className="flex min-h-11 items-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-3 focus-within:border-yellow-300/55">
                <Search size={16} className="text-yellow-200" />
                <input
                  type="search"
                  value={contentSearch}
                  onChange={(event) => setContentSearch(event.target.value)}
                  placeholder="Suche nach Inhalt, Kategorie, Status"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/35"
                />
              </span>
            </label>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="min-h-11 rounded-2xl border border-white/10 bg-black/55 px-3 text-sm font-bold text-white outline-none">
              <option value="all">Alle Status</option>
              <option value="draft">Entwurf</option>
              <option value="review">In Prüfung</option>
              <option value="planned">Geplant</option>
              <option value="active">Veröffentlicht</option>
              <option value="archived">Archiviert</option>
            </select>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className="min-h-11 rounded-2xl border border-white/10 bg-black/55 px-3 text-sm font-bold text-white outline-none">
              {cmsCategoryOptions.map((category) => (
                <option key={category} value={category}>{category === 'all' ? 'Alle Kategorien' : category}</option>
              ))}
            </select>
            <select value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value)} className="min-h-11 rounded-2xl border border-white/10 bg-black/55 px-3 text-sm font-bold text-white outline-none">
              {cmsLanguageOptions.map((language) => (
                <option key={language} value={language}>{language === 'all' ? 'Alle Sprachen' : language}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {managementMetrics.map((metric) => (
          <AdminPrototypeMetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visibleCmsSections.map((section) => (
          <AdminCmsSectionCard key={section.id} section={section} renderStatusBadge={renderStatusBadge} />
        ))}
      </div>

      {!visibleCmsSections.length && (
        <div className="mt-5 rounded-3xl border border-white/10 bg-black/25 p-6 text-center">
          <Search size={28} className="mx-auto text-yellow-200" />
          <h4 className="mt-3 text-xl font-black text-yellow-50">Keine CMS-Karte gefunden</h4>
          <p className="mt-2 text-sm text-white/55">Passe Suche, Kategorie, Sprache oder Status an. Es wurden keine Inhalte geladen oder gespeichert.</p>
        </div>
      )}

      <div className="mt-5 rounded-3xl border border-yellow-300/15 bg-yellow-400/[0.06] p-4">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Content Workflow</p>
            <h4 className="mt-1 text-2xl font-black text-yellow-50">Erstellen → Bearbeiten → Prüfen → Freigeben → Veröffentlichen</h4>
          </div>
          <span className="rounded-full bg-black/30 px-3 py-1 text-xs font-black text-white/55 ring-1 ring-white/10">UI-only · keine Speicherung</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {cmsWorkflowSteps.map((step, index) => (
            <AdminCmsWorkflowStep key={step.id} step={step} index={index} />
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-white/10 bg-black/25 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Modulverwaltung</p>
            <h4 className="mt-1 text-2xl font-black text-yellow-50">Module, Reihenfolge, Sichtbarkeit und Aktionen</h4>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/55 ring-1 ring-white/10">
            {visibleModuleRows.length}/{moduleRows.length} Module
          </span>
        </div>

        <div className="mt-5 hidden overflow-x-auto rounded-3xl border border-white/10 lg:block">
          <table className="w-full min-w-[68rem] text-left text-sm">
            <thead className="bg-black/45 text-xs uppercase tracking-[0.14em] text-white/42">
              <tr>
                {['Reihenfolge', 'Titel', 'Kategorie', 'Status', 'Dauer', 'Sichtbarkeit', 'Fortschritt', 'Aktionen'].map((header) => (
                  <th key={header} className="px-4 py-3 font-black">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {visibleModuleRows.map((moduleItem) => (
                <tr key={moduleItem.id} className="bg-black/20 transition hover:bg-yellow-400/[0.06]">
                  <td className="px-4 py-4 font-black text-yellow-50">#{moduleItem.order}</td>
                  <td className="px-4 py-4">
                    <p className="font-black text-yellow-50">{moduleItem.title}</p>
                    <p className="mt-1 text-xs text-white/42">{moduleItem.assets}</p>
                  </td>
                  <td className="px-4 py-4 text-white/65">{moduleItem.category}</td>
                  <td className="px-4 py-4">{renderStatusBadge(moduleItem.status)}</td>
                  <td className="px-4 py-4 text-white/65">{moduleItem.duration}</td>
                  <td className="px-4 py-4 text-white/65">{moduleItem.visibility}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full bg-yellow-300" style={{ width: `${moduleItem.progress}%` }} />
                      </div>
                      <span className="font-black text-yellow-50">{moduleItem.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <AdminPrototypeActionButton>Bearbeiten</AdminPrototypeActionButton>
                      <AdminPrototypeActionButton><PlayCircle size={14} /> Vorschau</AdminPrototypeActionButton>
                      <AdminPrototypeActionButton tone="primary">Veröffentlichen</AdminPrototypeActionButton>
                      <AdminPrototypeActionButton>Archivieren</AdminPrototypeActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 grid gap-3 lg:hidden">
          {visibleModuleRows.map((moduleItem) => (
            <div key={moduleItem.id} className="rounded-3xl border border-white/10 bg-white/[0.045] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-yellow-200">#{moduleItem.order} · {moduleItem.category}</p>
                  <h5 className="mt-1 break-words text-lg font-black text-yellow-50">{moduleItem.title}</h5>
                  <p className="mt-1 text-xs text-white/45">{moduleItem.duration} · {moduleItem.visibility}</p>
                </div>
                {renderStatusBadge(moduleItem.status)}
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full bg-yellow-300" style={{ width: `${moduleItem.progress}%` }} />
              </div>
              <p className="mt-3 text-sm text-white/58">{moduleItem.assets}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <AdminPrototypeActionButton>Bearbeiten</AdminPrototypeActionButton>
                <AdminPrototypeActionButton><PlayCircle size={14} /> Vorschau</AdminPrototypeActionButton>
                <AdminPrototypeActionButton tone="primary">Veröffentlichen</AdminPrototypeActionButton>
                <AdminPrototypeActionButton>Archivieren</AdminPrototypeActionButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Video-Verwaltung</p>
              <h4 className="mt-1 font-black text-yellow-50">Videos und Modulzuordnung</h4>
            </div>
            <Video className="text-yellow-200" size={22} />
          </div>
          <div className="mt-4 rounded-2xl border border-yellow-300/20 bg-yellow-400/10 p-3 text-sm text-yellow-100">
            <UploadCloud size={17} className="mb-2" />
            Upload-Bereich vorbereitet. Kein echter Upload-Flow, keine Storage- oder API-Aktion.
          </div>
          <div className="mt-4 max-h-[28rem] space-y-3 overflow-y-auto pr-1">
            {videoRows.map((video) => (
              <div key={video.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-words font-black text-yellow-50">{video.title}</p>
                    <p className="mt-1 text-xs text-white/45">{video.moduleTitle} · {video.duration} · {video.type}</p>
                  </div>
                  {renderStatusBadge(video.status)}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <AdminPrototypeActionButton><PlayCircle size={14} /> Vorschau</AdminPrototypeActionButton>
                  <AdminPrototypeActionButton>Bearbeiten</AdminPrototypeActionButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">PDF-/Download-Verwaltung</p>
              <h4 className="mt-1 font-black text-yellow-50">Dokumente, Sprache und Sichtbarkeit</h4>
            </div>
            <FileText className="text-yellow-200" size={22} />
          </div>
          <p className="mt-3 text-sm text-white/60">
            Öffentliche Dateien: {publicDocs.length} · Interne Partnerunterlagen: {partnerDocs.length}. Alle Vorschau-Buttons sind UI-only.
          </p>
          <div className="mt-4 max-h-[32rem] space-y-3 overflow-y-auto pr-1">
            {documentRows.map((documentItem) => (
              <div key={documentItem.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-words font-black text-yellow-50">{documentItem.title}</p>
                    <p className="mt-1 text-xs text-white/45">{documentItem.category} · {documentItem.language} · {documentItem.type}</p>
                    <p className="mt-1 text-xs text-white/35">{documentItem.moduleTitle}</p>
                  </div>
                  {renderStatusBadge(documentItem.status)}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black text-white/60 ring-1 ring-white/10">{documentItem.visibility}</span>
                  <AdminPrototypeActionButton><Download size={14} /> Download-Vorschau</AdminPrototypeActionButton>
                  <AdminPrototypeActionButton>Bearbeiten</AdminPrototypeActionButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Quiz-Verwaltung</p>
          <h4 className="mt-1 font-black text-yellow-50">Quiz-Sets und Bestehensgrenzen</h4>
          <div className="mt-4 space-y-3">
            {quizRows.map((quiz) => (
              <div key={quiz.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words font-black text-yellow-50">{quiz.title}</p>
                    <p className="mt-1 text-xs text-white/45">{quiz.moduleTitle}</p>
                  </div>
                  {renderStatusBadge(quiz.status)}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <span className="rounded-2xl bg-black/25 px-3 py-2 text-white/60">{quiz.questions} Fragen</span>
                  <span className="rounded-2xl bg-black/25 px-3 py-2 text-white/60">Bestehen: {quiz.passRate}</span>
                </div>
                <AdminPrototypeActionButton>
                  <FileQuestion size={14} /> Quiz bearbeiten
                </AdminPrototypeActionButton>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Aufgaben-Verwaltung</p>
          <h4 className="mt-1 font-black text-yellow-50">Tages-, Partner- und Leader-Aufgaben</h4>
          <div className="mt-4 space-y-3">
            {taskRows.map((task) => (
              <div key={task.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words font-black text-yellow-50">{task.title}</p>
                    <p className="mt-1 text-xs text-white/45">{task.moduleTitle} · {task.type}</p>
                  </div>
                  {renderStatusBadge(task.status)}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-yellow-400/12 px-3 py-1 text-[10px] font-black text-yellow-100 ring-1 ring-yellow-300/20">Priorität: {task.priority}</span>
                  <AdminPrototypeActionButton>Aufgabe bearbeiten</AdminPrototypeActionButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Content-Kalender</p>
          <h4 className="mt-1 font-black text-yellow-50">Geplante Inhalte</h4>
          <div className="mt-4 space-y-3">
            {calendarRows.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words font-black text-yellow-50">{item.title}</p>
                    <p className="mt-1 text-xs text-white/45">{formatAdminDate(item.date)} · {item.category}</p>
                  </div>
                  {renderStatusBadge(item.status)}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <AdminPrototypeActionButton><CalendarDays size={14} /> Termin ansehen</AdminPrototypeActionButton>
                  <AdminPrototypeActionButton>Plan bearbeiten</AdminPrototypeActionButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
          <h4 className="font-black text-yellow-50">Modulkatalog · Strukturübersicht</h4>
          <p className="mt-2 text-sm text-white/60">
            Der Inhaltskatalog ist für Module, Lektionen, Videos, PDFs, Quiz und Downloads strukturiert. Diese Detailübersicht bleibt schreibgeschützt.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <span className="rounded-2xl border border-yellow-300/15 bg-yellow-400/10 px-3 py-2 text-xs font-bold text-yellow-100">{catalogSummary.lessons} Lektionen</span>
            <span className="rounded-2xl border border-yellow-300/15 bg-yellow-400/10 px-3 py-2 text-xs font-bold text-yellow-100">{catalogSummary.videos} Videos</span>
            <span className="rounded-2xl border border-yellow-300/15 bg-yellow-400/10 px-3 py-2 text-xs font-bold text-yellow-100">{catalogSummary.videoPlaceholders} geplante Videos</span>
            <span className="rounded-2xl border border-yellow-300/15 bg-yellow-400/10 px-3 py-2 text-xs font-bold text-yellow-100">{catalogSummary.quizzes} Quiz-Zuordnungen</span>
          </div>
          <div className="mt-5">
            <AcademyContentAdminOverview modules={catalogModules} />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
          <h4 className="font-black text-yellow-50">Qualität & Lokalisierung</h4>
          <p className="mt-2 text-sm text-white/60">
            Übersetzungs-Parität, Untertitel und Sichtbarkeit bleiben sichtbar, ohne Inhalte zu speichern oder produktive Dateien zu ändern.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {parityRows.map((row) => (
              <div key={row.code} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-sm">
                <span className="min-w-0 truncate font-bold text-white/75">{row.label}</span>
                <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${row.status === 'OK' ? 'bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-200/25' : 'bg-yellow-400/15 text-yellow-100 ring-1 ring-yellow-200/25'}`}>
                  {row.modulesCount}/{modules.length}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
            {academyVideos.map((video) => (
              <div key={video.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                <p className="break-words text-sm font-black text-yellow-50">{video.title}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {VIDEO_TRANSLATION_LANGUAGES.map((language) => (
                    <span key={language.code} className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-black text-emerald-100 ring-1 ring-emerald-200/20">
                      {language.short} VTT
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function adminEditablePartnerValues(partner) {
  return {
    firstName: partner.firstName,
    lastName: partner.lastName,
    email: partner.email,
    whatsapp: partner.whatsapp,
    city: partner.city,
    discountCode: partner.discountCode,
    language: normalizeLanguage(partner.language || DEFAULT_LANGUAGE),
    profileImageUrl: partner.profileImageUrl || '',
    instagramProfile: partner.instagramProfile || '',
    instagramVisible: partner.instagramVisible !== false,
    aquaPoints: String(partner.aquaPoints || 0),
    teamName: partner.teamName || '',
    teamPartnerCount: String(partner.teamPartnerCount || 0),
    backofficeScreenshot: partner.backofficeScreenshot || null,
  };
}

function AdminPartnerDetail({ partner, onApprove, onUpdate, onProfilePhotoChange, onSendReminder, onDelete, compact, copy }) {
  const [notes, setNotes] = useState(partner.notes || '');
  const [assignedTraining, setAssignedTraining] = useState(partner.assignedTraining || trainingOptions[0]);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageProcessing, setProfileImageProcessing] = useState(false);
  const [profileImageSaving, setProfileImageSaving] = useState(false);
  const [profileImageMessage, setProfileImageMessage] = useState('');
  const [editablePartner, setEditablePartner] = useState(() => adminEditablePartnerValues(partner));
  const editableCareer = calculateAquaCareer(editablePartner.aquaPoints);
  const academyProgress = partner.academyProgress || normalizeAcademyProgress();
  const onboardingRecommendation = getPartnerOnboardingRecommendation(partner);
  const completedModuleTitles = academyProgress.completedModules
    .map((completedModule) => ACADEMY_MODULE_CATALOG.find((module) => module.id === completedModule.moduleId)?.title || completedModule.title)
    .filter(Boolean);

  const saveAdminDetails = () => {
    onUpdate(partner.id, { ...editablePartner, notes, assignedTraining });
  };

  const updateEditablePartner = (field, value) => {
    setEditablePartner((current) => ({ ...current, [field]: value }));
  };

  const uploadBackofficeScreenshot = async (file) => {
    if (!file) {
      return;
    }

    try {
      const attachment = await fileToAttachment(file);
      const detectedPoints = extractBackofficePointsFromText(file.name);
      setEditablePartner((current) => ({
        ...current,
        aquaPoints: detectedPoints ? String(detectedPoints) : current.aquaPoints,
        backofficeScreenshot: {
          ...attachment,
          uploadedAt: new Date().toISOString(),
        },
      }));
    } catch (error) {
      setEditablePartner((current) => ({
        ...current,
        backofficeScreenshot: {
          name: 'Upload fehlgeschlagen',
          error: error.message,
          uploadedAt: new Date().toISOString(),
        },
      }));
    }
  };

  const selectAdminProfileImage = async (file) => {
    setProfileImageMessage('');
    setProfileImageProcessing(true);

    try {
      const optimizedImage = await optimizeProfileImageFile(file, copy);
      setProfileImage(optimizedImage);
      setProfileImageMessage(`Optimiert auf ${formatProfileImageSize(optimizedImage.size)}.`);
    } catch (error) {
      setProfileImage(null);
      setProfileImageMessage(error.message || copy.profileImageInvalidType);
    } finally {
      setProfileImageProcessing(false);
    }
  };

  const saveAdminProfileImage = async () => {
    if (!profileImage) {
      setProfileImageMessage(copy.profileImageRequired);
      return;
    }

    if (!confirmAdminAction({
      title: 'Partner-Profilbild speichern oder ersetzen',
      target: adminPartnerLabel(partner, partner.id),
      consequences: [
        'Das Profilbild des Partners wird dauerhaft gespeichert oder ersetzt.',
        'Dashboard, Partnerprofil und Adminbereich zeigen danach das neue Bild.',
        'Ein vorheriges gespeichertes Profilbild kann serverseitig entfernt werden.',
      ],
    })) {
      return;
    }

    setProfileImageSaving(true);
    setProfileImageMessage('');

    try {
      await onProfilePhotoChange(partner.id, profileImage, false);
      setProfileImage(null);
      setProfileImageMessage('Profilbild wurde gespeichert.');
    } catch (error) {
      setProfileImageMessage(error.message || 'Profilbild konnte nicht gespeichert werden.');
    } finally {
      setProfileImageSaving(false);
    }
  };

  const removeAdminProfileImage = async () => {
    if (!confirmAdminAction({
      title: 'Partner-Profilbild löschen',
      target: adminPartnerLabel(partner, partner.id),
      consequences: [
        'Das gespeicherte Profilbild wird aus dem Partnerprofil entfernt.',
        'Dashboard, Partnerprofil und Adminbereich zeigen danach kein Profilbild mehr.',
        'Die Löschung ist ohne erneuten Upload nicht rückgängig zu machen.',
      ],
      requiredInput: ADMIN_DELETE_CONFIRMATION,
    })) {
      return;
    }

    setProfileImageSaving(true);
    setProfileImageMessage('');

    try {
      await onProfilePhotoChange(partner.id, null, true);
      setProfileImage(null);
      setProfileImageMessage('Profilbild wurde entfernt.');
    } catch (error) {
      setProfileImageMessage(error.message || 'Profilbild konnte nicht entfernt werden.');
    } finally {
      setProfileImageSaving(false);
    }
  };

  return (
    <div className={`rounded-3xl border p-4 ${partner.testData ? 'border-red-300/25 bg-red-500/[0.08]' : 'border-green-300/20 bg-black/25'}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <CareerAvatar partner={{ ...partner, profileImageUrl: profileImage?.dataUrl || partner.profileImageUrl }} />
          <div className="min-w-0">
            <p className="truncate font-bold">{partner.firstName} {partner.lastName}</p>
            <p className="text-sm text-white/55">{partner.email}</p>
            <p className="mt-1 text-xs text-white/45">{partner.city} · WhatsApp {partner.whatsapp || 'Nicht angegeben'} · Code {partner.discountCode || 'Nicht hinterlegt'}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${partner.testData ? 'bg-red-400/15 text-red-100' : 'bg-green-400/15 text-green-100'}`}>
                {partner.testData ? 'Testdaten' : 'Echte Registrierung'}
              </span>
              <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-100">
                Quelle: {partner.source || 'Live-Webseite'}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${partner.profileImageUrl ? 'bg-green-400/15 text-green-100' : 'bg-red-400/15 text-red-100'}`}>
                Profilbild: {partner.profileImageUrl ? 'vorhanden' : 'fehlt'}
              </span>
            </div>
          </div>
        </div>
        <StatusBadge status={partner.status} />
      </div>

      <div className="mt-4 grid gap-3 rounded-3xl border border-white/10 bg-black/25 p-4 text-sm md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-yellow-200">Registrierung</p>
          <div className="mt-3 space-y-1 text-white/65">
            <p>Name: <span className="text-white">{partner.firstName} {partner.lastName}</span></p>
            <p>E-Mail: <span className="text-white">{partner.email}</span></p>
            <p>WhatsApp: <span className="text-white">{partner.whatsapp || 'Nicht angegeben'}</span></p>
            <p>Stadt: <span className="text-white">{partner.city || 'Nicht angegeben'}</span></p>
            <p>Telefon: <span className="text-white">{partner.whatsapp || 'Nicht angegeben'}</span></p>
            <p>Rabattcode: <span className="text-white">{partner.discountCode || 'Nicht hinterlegt'}</span></p>
            <p>Sprache: <span className="text-white">{normalizeLanguage(partner.language || DEFAULT_LANGUAGE)}</span></p>
            <p>Profilbild: <span className={partner.profileImageUrl ? 'text-green-200' : 'text-red-200'}>{partner.profileImageUrl ? 'Vorhanden' : 'Fehlt'}</span></p>
            <p>Instagram: <span className={partner.instagramProfile ? 'text-green-200' : 'text-yellow-200'}>{partner.instagramProfile || 'Nicht angegeben'}</span></p>
            <p>Instagram sichtbar: <span className={partner.instagramVisible === false ? 'text-yellow-200' : 'text-green-200'}>{partner.instagramVisible === false ? 'Nein' : 'Ja'}</span></p>
            <p>Aqua Global Punkte: <span className="text-white">{formatPoints(partner.aquaPoints)}</span></p>
            <p>Aqua Global Level: <span className="text-white">{partner.aquaLevel}</span></p>
            <p>Teamzugehörigkeit: <span className="text-white">{partner.teamName || 'Nicht zugeordnet'}</span></p>
            <p>Teamgröße: <span className="text-white">{formatPartnerCount(partner.teamPartnerCount || 0)}</span></p>
            <p>Level-Update: <span className="text-white">{formatAdminDate(partner.aquaLastUpdatedAt)}</span></p>
            <p>Registrierungsdatum: <span className="text-white">{formatAdminDate(partner.createdAt)}</span></p>
            <p>Status: <span className="text-white">{formatPartnerStatus(partner.status)}</span></p>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-yellow-200">Logs / Nachweis</p>
          <div className="mt-3 space-y-1 text-white/65">
            <p>Gesendet: <span className="text-white">{formatAdminDate(partner.registrationLog?.sentAt)}</span></p>
            <p>Supabase gespeichert: <span className={partner.registrationLog?.supabaseSaved ? 'text-green-200' : 'text-red-200'}>{partner.registrationLog?.supabaseSaved ? 'Ja' : 'Nein'}</span></p>
            <p>Gespeichert am: <span className="text-white">{formatAdminDate(partner.registrationLog?.supabaseSavedAt)}</span></p>
            <p>Freigegeben: <span className={partner.approvalLog?.approved ? 'text-green-200' : 'text-yellow-200'}>{partner.approvalLog?.approved ? 'Ja' : 'Nein'}</span></p>
            <p>Freigabe am: <span className="text-white">{formatAdminDate(partner.approvalLog?.approvedAt)}</span></p>
            <p>Freigegeben von: <span className="text-white">{partner.approvalLog?.approvedBy || 'Noch nicht freigegeben'}</span></p>
            <p>E-Mail gesendet: <span className={partner.emailLog?.registrationEmailSent ? 'text-green-200' : 'text-yellow-200'}>{partner.emailLog?.registrationEmailSent ? 'Ja' : 'Nein'}</span></p>
            <p>Freigabe-E-Mail gesendet: <span className={partner.emailLog?.approvalEmailSent ? 'text-green-200' : 'text-yellow-200'}>{partner.emailLog?.approvalEmailSent ? 'Ja' : 'Nein'}</span></p>
            <p>Passwort-Reset angefordert: <span className={partner.emailLog?.passwordResetRequested ? 'text-green-200' : 'text-yellow-200'}>{partner.emailLog?.passwordResetRequested ? 'Ja' : 'Nein'}</span></p>
            <p>Letzte Passwort-Reset-Anfrage: <span className="text-white">{formatAdminDate(partner.emailLog?.lastPasswordResetRequestedAt)}</span></p>
            <p>Admin über Reset informiert: <span className={partner.emailLog?.passwordResetAdminNotified ? 'text-green-200' : 'text-yellow-200'}>{partner.emailLog?.passwordResetAdminNotified ? 'Ja' : 'Nein'}</span></p>
            <p>Admin-Reset-Hinweis am: <span className="text-white">{formatAdminDate(partner.emailLog?.passwordResetAdminNotifiedAt)}</span></p>
            <p>Reminder-E-Mail gesendet: <span className={partner.emailLog?.reminderEmailSent ? 'text-green-200' : 'text-yellow-200'}>{partner.emailLog?.reminderEmailSent ? 'Ja' : 'Nein'}</span></p>
            <p>Reminder am: <span className="text-white">{formatAdminDate(partner.emailLog?.reminderEmailSentAt)}</span></p>
            <p>Reminder von: <span className="text-white">{partner.emailLog?.reminderEmailSentBy || 'Noch nicht gesendet'}</span></p>
            {partner.testData && (
              <p>Erkannt wegen: <span className="text-red-100">{partner.testDataReasons?.join(', ') || 'Testmuster'}</span></p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <AdminRoleManagementPanel partner={partner} />
        <div className="rounded-3xl border border-white/10 bg-black/25 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Aktivitätsprotokoll</p>
              <h4 className="mt-2 text-lg font-black text-yellow-50">Vorhandene Partneraktivität</h4>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/45">Read-only</span>
          </div>
          <div className="mt-4">
            <AdminPartnerActivityTimeline partner={partner} />
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-yellow-300/20 bg-yellow-400/[0.08] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Onboarding & Aktivität</p>
            <h4 className="mt-2 text-xl font-black text-yellow-50">{academyProgress.onboardingStatusLabel}</h4>
            <p className="mt-1 text-sm text-white/55">{academyProgress.progressPercent}% Academy-Fortschritt</p>
          </div>
          <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-black ring-1 ${
            partner.activityStatus?.id === 'active'
              ? 'bg-emerald-400/15 text-emerald-100 ring-emerald-300/25'
              : partner.activityStatus?.id === 'inactive'
                ? 'bg-red-400/15 text-red-100 ring-red-300/25'
                : 'bg-yellow-400/15 text-yellow-100 ring-yellow-300/25'
          }`}>
            Aktivität: {partner.activityStatus?.label || 'Noch nicht erfasst'}
          </span>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/35 ring-1 ring-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-100" style={{ width: `${academyProgress.progressPercent}%` }} />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Letzte Aktivität</p>
            <p className="mt-2 text-sm font-bold text-white/80">{formatAdminDate(partner.lastActivityAt)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Letzter Modulabschluss</p>
            <p className="mt-2 text-sm font-bold text-white/80">{formatAdminDate(academyProgress.lastModuleCompletedAt)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Letzter Community-Beitrag</p>
            <p className="mt-2 text-sm font-bold text-white/80">{formatAdminDate(partner.lastCommunityPostAt)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Abgeschlossene Module</p>
            <p className="mt-2 text-sm font-bold text-white/80">{academyProgress.completedModuleCount}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Module abgeschlossen</p>
            {completedModuleTitles.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {completedModuleTitles.map((title) => (
                  <span key={title} className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-100 ring-1 ring-emerald-300/20">
                    {title}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-white/55">Noch kein Modulabschluss serverseitig erfasst.</p>
            )}
          </div>
          <div className="rounded-2xl border border-yellow-300/15 bg-yellow-400/10 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Nächster empfohlener Schritt</p>
            <p className="mt-3 text-sm font-bold leading-relaxed text-yellow-50">{onboardingRecommendation}</p>
          </div>
        </div>
      </div>

      <div className={`mt-4 grid gap-3 ${compact ? '' : 'md:grid-cols-2'}`}>
        <label className="block">
          <span className="mb-1 block text-xs text-white/50">{copy.partnerStatus}</span>
          <select
            value={partner.status}
            onChange={(event) => onUpdate(partner.id, { status: event.target.value })}
            className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 outline-none focus:border-yellow-300/70"
          >
            {partnerStatuses.map((status) => (
              <option key={status} value={status}>{formatPartnerStatus(status)}</option>
            ))}
          </select>
        </label>
        <Select label={copy.assignTraining} options={trainingOptions} value={assignedTraining} onChange={setAssignedTraining} />
      </div>

      <div className={`mt-4 grid gap-3 ${compact ? '' : 'md:grid-cols-2'}`}>
        <Input label={copy.firstName} value={editablePartner.firstName} onChange={(event) => updateEditablePartner('firstName', event.target.value)} />
        <Input label={copy.lastName} value={editablePartner.lastName} onChange={(event) => updateEditablePartner('lastName', event.target.value)} />
        <Input label={copy.email} value={editablePartner.email} onChange={(event) => updateEditablePartner('email', event.target.value)} />
        <Input label="WhatsApp" value={editablePartner.whatsapp} onChange={(event) => updateEditablePartner('whatsapp', event.target.value)} />
        <Input label={copy.city} value={editablePartner.city} onChange={(event) => updateEditablePartner('city', event.target.value)} />
        <Input label={copy.discountCode} value={editablePartner.discountCode} onChange={(event) => updateEditablePartner('discountCode', event.target.value.toUpperCase())} />
        <Select label={copy.language} options={languages} value={editablePartner.language} onChange={(value) => updateEditablePartner('language', value)} />
        <Input label="Instagram-Link" value={editablePartner.instagramProfile} onChange={(event) => updateEditablePartner('instagramProfile', event.target.value)} placeholder="https://instagram.com/deinname" />
        <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/70">
          <input type="checkbox" checked={editablePartner.instagramVisible} onChange={(event) => updateEditablePartner('instagramVisible', event.target.checked)} className="accent-yellow-300" />
          Instagram im Partner-Netzwerk anzeigen
        </label>
      </div>

      <div className="mt-4 rounded-3xl border border-yellow-300/15 bg-yellow-400/10 p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-yellow-200">Aqua Global Karriere-Update</p>
            <h4 className="mt-1 text-xl font-black text-yellow-50">{editableCareer.level}</h4>
            <p className="mt-1 text-sm text-white/55">{formatPoints(editableCareer.points)} Punkte · {editableCareer.nextLevel ? `${formatPoints(editableCareer.pointsToNextLevel)} Punkte bis ${editableCareer.nextLevel}` : 'Höchstes Level erreicht'}</p>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-black/35 md:max-w-xs">
            <div className="h-full rounded-full bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-100" style={{ width: `${editableCareer.progress}%` }} />
          </div>
        </div>
        <div className={`grid gap-3 ${compact ? '' : 'md:grid-cols-2'}`}>
          <Input label="Aktuelle Punkte" type="number" min="0" step="0.01" value={editablePartner.aquaPoints} onChange={(event) => updateEditablePartner('aquaPoints', event.target.value)} />
          <Input label="Teamzugehörigkeit" value={editablePartner.teamName} onChange={(event) => updateEditablePartner('teamName', event.target.value)} />
          <Input label="Teamgröße" type="number" min="0" step="1" value={editablePartner.teamPartnerCount} onChange={(event) => updateEditablePartner('teamPartnerCount', event.target.value)} />
          <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
            <span className="mb-1 block text-xs text-white/50">Profilbild</span>
            <p className={partner.profileImageUrl ? 'text-sm font-bold text-green-200' : 'text-sm font-bold text-red-200'}>
              {partner.profileImageUrl ? 'Gespeichert und im Adminbereich sichtbar' : 'Fehlt'}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-white/45">JPG, PNG oder WEBP bis 5 MB · Speicherung optimiert auf maximal 1 MB</p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <label className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-yellow-300/25 bg-yellow-400/15 px-3 py-2 text-xs font-bold text-yellow-100 hover:bg-yellow-400/25 ${profileImageProcessing || profileImageSaving ? 'pointer-events-none opacity-60' : ''}`}>
                <Upload size={15} /> Profilbild auswählen
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    event.target.value = '';
                    selectAdminProfileImage(file);
                  }}
                />
              </label>
              <label className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-yellow-300/25 bg-black/25 px-3 py-2 text-xs font-bold text-yellow-100 hover:bg-yellow-400/15 ${profileImageProcessing || profileImageSaving ? 'pointer-events-none opacity-60' : ''}`}>
                <Camera size={15} /> Foto aufnehmen
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    event.target.value = '';
                    selectAdminProfileImage(file);
                  }}
                />
              </label>
              {profileImage && (
                <Button type="button" disabled={profileImageProcessing || profileImageSaving} onClick={saveAdminProfileImage} className="rounded-2xl bg-yellow-400 px-3 py-2 text-xs font-black text-black hover:bg-yellow-300 disabled:opacity-60">
                  <CheckCircle2 size={15} /> {profileImageSaving ? copy.saving : 'Speichern'}
                </Button>
              )}
              {partner.profileImageUrl && (
                <Button type="button" disabled={profileImageSaving} onClick={removeAdminProfileImage} className="rounded-2xl border border-red-400/30 bg-red-500/15 px-3 py-2 text-xs font-bold text-red-100 hover:bg-red-500/25 disabled:opacity-60">
                  <Trash2 size={15} /> Löschen
                </Button>
              )}
            </div>
            {profileImageProcessing && <p className="mt-2 text-xs text-yellow-100">Bild wird optimiert...</p>}
            {profileImageMessage && <p className="mt-2 text-xs leading-relaxed text-white/65">{profileImageMessage}</p>}
          </div>
          <label className="block">
            <span className="mb-1 block text-xs text-white/50">Aqua Global Backoffice Screenshot</span>
            <input type="file" accept="image/*" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none file:mr-3 file:rounded-xl file:border-0 file:bg-yellow-400 file:px-3 file:py-2 file:font-bold file:text-black" onChange={(event) => uploadBackofficeScreenshot(event.target.files?.[0])} />
          </label>
        </div>
        {editablePartner.backofficeScreenshot && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-white/65">
            <p>Screenshot: <span className="text-white">{editablePartner.backofficeScreenshot.name || 'Backoffice Screenshot'}</span></p>
            {editablePartner.backofficeScreenshot.uploadedAt && <p>Upload: <span className="text-white">{formatAdminDate(editablePartner.backofficeScreenshot.uploadedAt)}</span></p>}
            {editablePartner.backofficeScreenshot.error && <p className="text-red-200">{editablePartner.backofficeScreenshot.error}</p>}
            {editablePartner.backofficeScreenshot.dataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={editablePartner.backofficeScreenshot.dataUrl} alt="Aqua Global Backoffice Screenshot" className="mt-3 max-h-48 w-full rounded-2xl border border-white/10 object-contain" />
            )}
            <Button type="button" onClick={() => updateEditablePartner('backofficeScreenshot', null)} className="mt-3 rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-2 text-sm font-bold text-red-100 hover:bg-red-500/25">
              Screenshot entfernen
            </Button>
          </div>
        )}
        {partner.careerHistory?.length > 0 && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-white/65">
            <p className="font-bold text-yellow-100">Punkte-Historie</p>
            <div className="mt-3 space-y-2">
              {partner.careerHistory.slice(0, 4).map((entry) => (
                <div key={entry.id || `${entry.updatedAt}-${entry.points}`} className="rounded-2xl bg-white/[0.04] p-3">
                  <p className="text-white">{formatPoints(entry.points)} Punkte · {entry.level}</p>
                  <p className="text-xs text-white/45">{formatAdminDate(entry.updatedAt)} · {entry.source || 'Update'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {partner.levelEvents?.length > 0 && (
          <div className="mt-4 rounded-2xl border border-yellow-300/20 bg-yellow-400/10 p-3 text-sm text-white/65">
            <p className="font-bold text-yellow-100">Level-Aufstiege</p>
            <div className="mt-3 space-y-2">
              {partner.levelEvents.slice(0, 3).map((event) => (
                <div key={event.id || `${event.promotedAt}-${event.toLevel}`} className="rounded-2xl bg-black/20 p-3">
                  <p className="text-white">{event.fromLevel} → {event.toLevel}</p>
                  <p className="text-xs text-white/45">{formatAdminDate(event.promotedAt)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 rounded-3xl border border-white/10 bg-black/25 p-4">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Interne Partner-Kommentare</p>
            <p className="mt-1 text-sm text-white/55">Bestehendes Notizfeld. Speicherung erfolgt erst über „{copy.save}“.</p>
          </div>
          <span className="rounded-full border border-yellow-300/20 bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-100">vorhandene Struktur</span>
        </div>
        <Textarea label={copy.adminNotes} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={copy.adminNotesPlaceholder} />
      </div>

      <div className={`mt-4 grid gap-3 ${partner.status === 'pending' ? 'md:grid-cols-7' : 'md:grid-cols-6'}`}>
        {partner.status === 'pending' && (
          <Button onClick={() => onApprove(partner.id)} className="w-full rounded-2xl bg-yellow-400 py-3 font-bold text-black hover:bg-yellow-300">
            {copy.approvePartner}
          </Button>
        )}
        {['blocked', 'rejected', 'paused', 'review'].includes(partner.status) && (
          <Button onClick={() => onUpdate(partner.id, { status: 'approved' })} className="w-full rounded-2xl border border-emerald-400/30 bg-emerald-500/15 py-3 font-bold text-emerald-100 hover:bg-emerald-500/25">
            <UserCheck size={16} /> Reaktivieren
          </Button>
        )}
        <Button onClick={() => onSendReminder(partner.id)} className="w-full rounded-2xl border border-yellow-300/25 bg-yellow-400/15 py-3 font-bold text-yellow-100 hover:bg-yellow-400/25">
          <Mail size={16} /> Reminder
        </Button>
        <Button onClick={() => onUpdate(partner.id, { status: 'rejected' })} className="w-full rounded-2xl border border-white/10 bg-white/10 py-3 font-bold hover:bg-white/15">
          {copy.reject}
        </Button>
        <Button onClick={() => onUpdate(partner.id, { status: 'blocked' })} className="w-full rounded-2xl border border-red-400/30 bg-red-500/15 py-3 font-bold text-red-100 hover:bg-red-500/25">
          {copy.block}
        </Button>
        <Button onClick={saveAdminDetails} className="w-full rounded-2xl border border-white/10 bg-white/10 py-3 font-bold hover:bg-white/15">
          {copy.save}
        </Button>
        <Button onClick={() => onUpdate(partner.id, { resetPartnerData: true })} className="w-full rounded-2xl border border-yellow-300/25 bg-yellow-400/10 py-3 font-bold text-yellow-100 hover:bg-yellow-400/20">
          Daten zurücksetzen
        </Button>
        <Button onClick={() => onDelete(partner.id)} className="w-full rounded-2xl border border-red-400/30 bg-red-500/15 py-3 font-bold text-red-100 hover:bg-red-500/25">
          <Trash2 size={16} /> {copy.delete}
        </Button>
      </div>
    </div>
  );
}

function CareerAvatar({ partner, size = 'lg' }) {
  const sizeClass = size === 'sm' ? 'h-12 w-12 text-sm' : 'h-20 w-20 text-2xl';

  if (partner?.profileImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={partner.profileImageUrl} alt={`${partner.firstName} ${partner.lastName}`} className={`${sizeClass} shrink-0 rounded-full border border-yellow-200/35 object-cover shadow-lg shadow-yellow-500/15`} />
    );
  }

  return (
    <span className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full border border-yellow-200/35 bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-900 font-black text-black shadow-lg shadow-yellow-500/15`}>
      {getInitials(partner)}
    </span>
  );
}

function CareerSummaryCard({ partner }) {
  const career = calculateAquaCareer(partner?.aquaPoints);
  const progress = partner?.aquaLevelProgress ?? career.progress;
  const rankDisplay = partner?.rank ? `#${partner.rank}` : partner?.role === 'admin' ? 'Founder' : '-';

  return (
    <Card className="overflow-hidden rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-400/[0.13] via-white/[0.055] to-black/40 text-white shadow-xl shadow-yellow-500/10 backdrop-blur-xl">
      <CardContent className="p-6 md:p-7">
        <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4 sm:items-center">
            <CareerAvatar partner={partner} />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">Aqua Global Karriere</p>
              <h3 className="mt-1 break-words text-2xl font-black">{partner?.firstName || 'Partner'} {partner?.lastName || ''}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {(partner?.adminBadge || partner?.isFounderAdmin) && (
                  <span className="rounded-full border border-yellow-200/35 bg-yellow-400/15 px-3 py-1 text-xs font-black text-yellow-100">
                    {partner.adminBadge || 'Founder / Admin'}
                  </span>
                )}
                <p className="text-sm text-white/55">{partner?.city || 'Stadt offen'}{partner?.teamName ? ` · Team ${partner.teamName}` : ''}</p>
              </div>
            </div>
          </div>
          <div className="w-full rounded-3xl border border-yellow-300/25 bg-black/30 px-5 py-4 text-center sm:w-auto">
            <p className="text-xs uppercase tracking-[0.18em] text-yellow-200">Rang</p>
            <p className="break-words text-3xl font-black text-yellow-50">{rankDisplay}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat icon={Star} label="Aktuelles Level" value={partner?.aquaLevel || career.level} />
          <Stat icon={Trophy} label="Aktuelle Punkte" value={formatPoints(career.points)} />
          <Stat icon={ChevronRight} label="Nächstes Level" value={career.nextLevel || 'Max'} />
          <Stat icon={Flame} label="Noch benötigt" value={career.nextLevel ? `${formatPoints(career.pointsToNextLevel)} Punkte` : '0 Punkte'} />
        </div>

        <div className="mt-6">
          <div className="mb-2 flex flex-col gap-1 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <span>{partner?.aquaLevel || career.level}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-100" style={{ width: `${progress}%` }} />
          </div>
          <CareerProgressCells progress={progress} />
          <p className="mt-3 text-xs text-white/45">Letztes Update: {formatAdminDate(partner?.aquaLastUpdatedAt)}{partner?.aquaUpdatedBy ? ` · durch ${partner.aquaUpdatedBy}` : ''}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function CareerProgressCells({ progress }) {
  const filled = Math.min(10, Math.max(0, Math.round(Number(progress || 0) / 10)));

  return (
    <div className="mt-3 grid grid-cols-10 gap-1">
      {Array.from({ length: 10 }).map((_, index) => (
        <span key={index} className={`h-2 rounded-full ${index < filled ? 'bg-yellow-300 shadow-sm shadow-yellow-400/40' : 'bg-white/10'}`} />
      ))}
    </div>
  );
}

function AcademyRankingPanel({ ranking, compact = false }) {
  const rows = ranking;

  return (
    <Card className="rounded-[2rem] border border-yellow-300/15 bg-white/[0.06] text-white shadow-xl shadow-black/20 backdrop-blur-xl">
      <CardContent className="p-6 md:p-7">
        <div className="mb-5 flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">Ranking</p>
            <h3 className="mt-1 break-words text-2xl font-black">Top Partner der Academy</h3>
          </div>
          <Trophy className="text-yellow-300" size={28} />
        </div>
        {rows.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-black/25 p-5 text-sm text-white/55">
            Noch keine Partner im Ranking. Sobald Partner freigegeben sind, erscheinen sie hier.
          </div>
        ) : (
          <div className="space-y-3">
            {rows.slice(0, compact ? 5 : 12).map((partner) => (
              <div key={partner.id} className="flex min-w-0 flex-col gap-3 rounded-3xl border border-white/10 bg-black/25 p-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-sm font-black text-black">#{partner.rank}</div>
                  <CareerAvatar partner={partner} size="sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <p className="truncate font-bold">{partner.firstName} {partner.lastName}</p>
                    {(partner.adminBadge || partner.isFounderAdmin) && (
                      <span className="rounded-full bg-yellow-400/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-yellow-100 ring-1 ring-yellow-200/25">
                        {partner.adminBadge || 'Founder / Admin'}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-white/45">{partner.aquaLevel || calculateAquaCareer(partner.aquaPoints).level}{partner.teamName ? ` · ${partner.teamName}` : ''}</p>
                </div>
                <p className="min-w-0 break-words text-left font-black text-yellow-100 sm:shrink-0 sm:text-right">{formatPoints(partner.aquaPoints)}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TeamBuildSummaryCard({ partner }) {
  const team = calculateTeamGrowth({
    currentCount: partner?.teamPartnerCount,
    previousCount: Math.max(0, toPartnerCount(partner?.teamPartnerCount) - toPartnerCount(partner?.teamNewPartnersSinceLastUpdate)),
    targetCount: partner?.teamTargetPartnerCount,
    longTermTargetCount: partner?.teamLongTermTargetPartnerCount,
  });
  const teamRankDisplay = partner?.teamRank ? `#${partner.teamRank}` : partner?.role === 'admin' ? 'Founder' : '-';

  return (
    <Card className="overflow-hidden rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-black/50 via-yellow-400/[0.08] to-white/[0.04] text-white shadow-xl shadow-yellow-500/10 backdrop-blur-xl">
      <CardContent className="p-6 md:p-7">
        <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">Teamaufbau</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h3 className="min-w-0 break-words text-2xl font-black">{partner?.firstName || 'Partner'}s Teamprofil</h3>
              {(partner?.adminBadge || partner?.isFounderAdmin) && (
                <span className="rounded-full bg-yellow-400/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-yellow-100 ring-1 ring-yellow-200/25">
                  {partner.adminBadge || 'Founder / Admin'}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-white/55">Ranking nach Teamgröße und Wachstum.</p>
          </div>
          <div className="w-full rounded-3xl border border-yellow-300/25 bg-black/30 px-5 py-4 text-center sm:w-auto">
            <p className="text-xs uppercase tracking-[0.18em] text-yellow-200">Team-Rang</p>
            <p className="break-words text-3xl font-black text-yellow-50">{teamRankDisplay}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat icon={Users} label="Aktuelle Partnerzahl" value={formatPartnerCount(team.currentCount)} />
          <Stat icon={ChevronRight} label="Zielpartnerzahl" value={formatPartnerCount(team.targetCount)} />
          <Stat icon={TrendingUp} label="Neue Partner" value={`+${formatPartnerCount(team.newSinceLastUpdate)}`} />
          <Stat icon={Flame} label="Wachstum" value={`${team.growthPercent}%`} />
        </div>

        <TeamProgressBars team={team} />
        <p className="mt-3 text-xs text-white/45">Letztes Update: {formatAdminDate(partner?.teamLastUpdatedAt)}{partner?.teamUpdatedBy ? ` · durch ${partner.teamUpdatedBy}` : ''}</p>
      </CardContent>
    </Card>
  );
}

function TeamProgressBars({ team }) {
  return (
    <div className="mt-6 space-y-4">
      <div>
        <div className="mb-2 flex flex-col gap-1 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <span>Nächstes Ziel: {formatPartnerCount(team.targetCount)} Partner</span>
          <span>{team.targetProgress}%</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-yellow-700 via-yellow-300 to-yellow-100" style={{ width: `${team.targetProgress}%` }} />
        </div>
      </div>
      <div>
        <div className="mb-2 flex flex-col gap-1 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <span>Langfristiges Ziel: {formatPartnerCount(team.longTermTargetCount)} Partner</span>
          <span>{team.longTermProgress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-white/30 via-yellow-500 to-yellow-200" style={{ width: `${team.longTermProgress}%` }} />
        </div>
      </div>
    </div>
  );
}

function TeamRankingPanel({ ranking, compact = false }) {
  const rows = ranking;

  return (
    <Card className="rounded-[2rem] border border-yellow-300/15 bg-white/[0.06] text-white shadow-xl shadow-black/20 backdrop-blur-xl">
      <CardContent className="p-6 md:p-7">
        <div className="mb-5 flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">Team Ranking</p>
            <h3 className="mt-1 break-words text-2xl font-black">Ranking nach Teamgröße</h3>
          </div>
          <Users className="text-yellow-300" size={28} />
        </div>
        {rows.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-black/25 p-5 text-sm text-white/55">
            Noch keine Partner im Ranking. Sobald Partner freigegeben sind, erscheinen sie hier.
          </div>
        ) : (
          <div className="space-y-3">
            {rows.slice(0, compact ? 5 : 12).map((partner) => (
              <div key={partner.id} className="flex min-w-0 flex-col gap-3 rounded-3xl border border-white/10 bg-black/25 p-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-400 text-sm font-black text-black">#{partner.teamRank}</div>
                  <CareerAvatar partner={partner} size="sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <p className="truncate font-bold">{partner.firstName} {partner.lastName}</p>
                    {(partner.adminBadge || partner.isFounderAdmin) && (
                      <span className="rounded-full bg-yellow-400/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.12em] text-yellow-100 ring-1 ring-yellow-200/25">
                        {partner.adminBadge || 'Founder / Admin'}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-white/45">+{formatPartnerCount(partner.teamNewPartnersSinceLastUpdate)} seit letztem Update · {partner.teamGrowthPercent}% Wachstum</p>
                </div>
                <p className="min-w-0 break-words text-left font-black text-yellow-100 sm:shrink-0 sm:text-right">{formatPartnerCount(partner.teamPartnerCount)}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TeamGrowthUpdatePanel({ partner, onTeamGrowthSubmit }) {
  const [attachment, setAttachment] = useState(null);
  const [currentCount, setCurrentCount] = useState(String(partner?.teamPartnerCount || ''));
  const [targetCount, setTargetCount] = useState(String(partner?.teamTargetPartnerCount || 10));
  const [longTermTargetCount, setLongTermTargetCount] = useState(String(partner?.teamLongTermTargetPartnerCount || 100));
  const [detectedFromScreenshot, setDetectedFromScreenshot] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const preview = calculateTeamGrowth({
    currentCount,
    previousCount: partner?.teamPartnerCount || 0,
    targetCount,
    longTermTargetCount,
  });
  const isAdminProfile = partner?.role === 'admin';

  const handleFile = async (file) => {
    setMessage('');

    if (!file) {
      return;
    }

    try {
      const uploadedAttachment = await fileToAttachment(file);
      const detectedCount = extractTeamCountFromText(file.name);
      setAttachment({
        ...uploadedAttachment,
        uploadedAt: new Date().toISOString(),
      });

      if (detectedCount) {
        setCurrentCount(String(detectedCount));
        setDetectedFromScreenshot(true);
        setMessage('Partnerzahl wurde aus dem Screenshot-Dateinamen erkannt. Bitte kurz prüfen und speichern.');
      } else {
        setDetectedFromScreenshot(false);
        setMessage('Screenshot wurde geladen. Partnerzahl bitte prüfen oder manuell eintragen.');
      }
    } catch (error) {
      setMessage(error.message || 'Screenshot konnte nicht gelesen werden.');
    }
  };

  const saveTeamGrowth = async () => {
    setMessage('');

    if (!currentCount.trim()) {
      setMessage('Bitte gib die aktuelle Partnerzahl ein.');
      return;
    }

    setSaving(true);

    try {
      const effectiveAttachment = attachment || partner?.teamScreenshot || {
        name: isAdminProfile ? 'Manuelle Admin-Team-Korrektur' : 'Manuelles Team-Update',
        type: isAdminProfile ? 'manual/admin-team-update' : 'manual/partner-team-update',
        uploadedAt: new Date().toISOString(),
      };

      await onTeamGrowthSubmit({
        attachment: effectiveAttachment,
        currentCount,
        targetCount,
        longTermTargetCount,
        detectedFromScreenshot,
      });
      setMessage('Teamaufbau-Profil wurde gespeichert. Ranking und Historie wurden aktualisiert.');
    } catch (error) {
      setMessage(error.message || 'Teamaufbau-Profil konnte nicht gespeichert werden.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel title="Teamaufbau aktualisieren" icon={Users}>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <label className="block rounded-3xl border border-yellow-300/20 bg-black/25 p-4">
            <span className="mb-2 block text-sm font-bold text-yellow-100">Aqua Global Team-Screenshot hochladen</span>
            <input type="file" accept="image/*" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none file:mr-3 file:rounded-xl file:border-0 file:bg-yellow-400 file:px-3 file:py-2 file:font-bold file:text-black" onChange={(event) => handleFile(event.target.files?.[0])} />
          </label>
          <Input label="Aktuelle Partnerzahl" type="number" min="0" value={currentCount} onChange={(event) => setCurrentCount(event.target.value)} />
          <Input label="Zielpartnerzahl" type="number" min="1" value={targetCount} onChange={(event) => setTargetCount(event.target.value)} />
          <Input label="Langfristiges Ziel" type="number" min="1" value={longTermTargetCount} onChange={(event) => setLongTermTargetCount(event.target.value)} />
          <Button type="button" onClick={saveTeamGrowth} disabled={saving || !onTeamGrowthSubmit} className="w-full rounded-2xl bg-yellow-400 py-3 font-black text-black hover:bg-yellow-300 disabled:opacity-60">
            <UploadCloud size={16} /> {saving ? 'Wird gespeichert...' : 'Teamprofil speichern'}
          </Button>
          {message && <p className="rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-white/65">{message}</p>}
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-200">Automatische Berechnung</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Stat icon={Users} label="Aktuelle Partnerzahl" value={formatPartnerCount(preview.currentCount)} />
            <Stat icon={ChevronRight} label="Nächstes Ziel" value={formatPartnerCount(preview.targetCount)} />
            <Stat icon={TrendingUp} label="Neue Partner" value={`+${formatPartnerCount(preview.newSinceLastUpdate)}`} />
            <Stat icon={Flame} label="Wachstum" value={`${preview.growthPercent}%`} />
          </div>
          <TeamProgressBars team={preview} />
          {attachment?.dataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={attachment.dataUrl} alt="Aqua Global Team Screenshot" className="mt-4 max-h-52 w-full rounded-2xl border border-white/10 object-contain" />
          )}
        </div>
      </div>
    </Panel>
  );
}

function TeamGrowthHistoryPanel({ partner }) {
  const history = partner?.teamGrowthHistory || [];
  const maxCount = Math.max(...history.slice(0, 8).map((entry) => toPartnerCount(entry.currentCount)), toPartnerCount(partner?.teamPartnerCount), 1);

  return (
    <Panel title="Teamaufbau-Historie" icon={Clock}>
      {history.length === 0 ? (
        <p className="text-sm text-white/55">Noch keine Teamaufbau-Historie vorhanden.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex h-32 items-end gap-2 rounded-3xl border border-white/10 bg-black/25 p-4">
            {history.slice(0, 8).reverse().map((entry) => {
              const height = Math.max(8, Math.round((toPartnerCount(entry.currentCount) / maxCount) * 100));
              return (
                <div key={entry.id || `${entry.updatedAt}-${entry.currentCount}`} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-xl bg-gradient-to-t from-yellow-700 via-yellow-400 to-yellow-100 shadow-sm shadow-yellow-400/25" style={{ height: `${height}%` }} />
                  <span className="text-[10px] font-bold text-white/45">{formatPartnerCount(entry.currentCount)}</span>
                </div>
              );
            })}
          </div>
          <div className="space-y-3">
            {history.slice(0, 8).map((entry) => (
              <div key={entry.id || `${entry.updatedAt}-${entry.currentCount}`} className="rounded-3xl border border-white/10 bg-black/25 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-black text-yellow-50">{formatPartnerCount(entry.currentCount)} Partner · +{formatPartnerCount(entry.newSinceLastUpdate)}</p>
                  <p className="text-xs text-white/45">{formatAdminDate(entry.updatedAt)}</p>
                </div>
                <p className="mt-2 text-xs text-white/50">Wachstum: {entry.growthPercent}% · Ziel: {formatPartnerCount(entry.targetCount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}

function CareerScreenshotUploadPanel({ partner, onScreenshotSubmit }) {
  const [attachment, setAttachment] = useState(null);
  const [pointsInput, setPointsInput] = useState(String(partner?.aquaPoints || ''));
  const [detectedFromScreenshot, setDetectedFromScreenshot] = useState(false);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const previewCareer = calculateAquaCareer(pointsInput || partner?.aquaPoints);
  const isAdminProfile = partner?.role === 'admin';

  const handleFile = async (file) => {
    setMessage('');

    if (!file) {
      return;
    }

    try {
      const uploadedAttachment = await fileToAttachment(file);
      const detectedPoints = extractBackofficePointsFromText(file.name);
      setAttachment({
        ...uploadedAttachment,
        uploadedAt: new Date().toISOString(),
      });

      if (detectedPoints) {
        setPointsInput(String(detectedPoints));
        setDetectedFromScreenshot(true);
        setMessage('Punktwert wurde aus dem Screenshot-Dateinamen erkannt. Bitte kurz prüfen und speichern.');
      } else {
        setDetectedFromScreenshot(false);
        setMessage('Screenshot wurde geladen. Punktwert bitte prüfen oder manuell eintragen, falls er nicht automatisch erkannt wurde.');
      }
    } catch (error) {
      setMessage(error.message || 'Screenshot konnte nicht gelesen werden.');
    }
  };

  const saveScreenshot = async () => {
    setMessage('');

    if (!attachment && !isAdminProfile) {
      setMessage('Bitte lade zuerst einen Aqua Global Backoffice Screenshot hoch.');
      return;
    }

    if (!pointsInput.trim()) {
      setMessage('Bitte gib den aktuellen Punktestand ein oder korrigiere die automatische Erkennung.');
      return;
    }

    setSaving(true);

    try {
      const effectiveAttachment = attachment || partner?.backofficeScreenshot || {
        name: 'Manuelle Admin-Korrektur',
        type: 'manual/admin-career-update',
        uploadedAt: new Date().toISOString(),
      };

      await onScreenshotSubmit({
        attachment: effectiveAttachment,
        points: pointsInput,
        detectedFromScreenshot,
      });
      setMessage(isAdminProfile
        ? 'Admin-Karriereprofil wurde gespeichert. Ranking und Historie wurden aktualisiert.'
        : 'Backoffice-Auswertung wurde gespeichert. Ranking und Historie wurden aktualisiert.');
    } catch (error) {
      setMessage(error.message || 'Backoffice-Auswertung konnte nicht gespeichert werden.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Panel title="Backoffice-Screenshot-Auswertung" icon={UploadCloud}>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <label className="block rounded-3xl border border-yellow-300/20 bg-black/25 p-4">
            <span className="mb-2 block text-sm font-bold text-yellow-100">Aqua Global Backoffice Screenshot hochladen</span>
            <input type="file" accept="image/*" className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none file:mr-3 file:rounded-xl file:border-0 file:bg-yellow-400 file:px-3 file:py-2 file:font-bold file:text-black" onChange={(event) => handleFile(event.target.files?.[0])} />
          </label>
          <Input label="Aktuelle Punkte" value={pointsInput} onChange={(event) => {
            setPointsInput(event.target.value);
            setDetectedFromScreenshot(false);
          }} />
          <Button type="button" onClick={saveScreenshot} disabled={saving || !onScreenshotSubmit} className="w-full rounded-2xl bg-yellow-400 py-3 font-black text-black hover:bg-yellow-300 disabled:opacity-60">
            <UploadCloud size={16} /> {saving ? 'Wird gespeichert...' : isAdminProfile ? 'Punkte speichern' : 'Auswertung speichern'}
          </Button>
          {message && <p className="rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-white/65">{message}</p>}
        </div>

        <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-200">Automatische Berechnung</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Stat icon={Star} label="Aktuelles Level" value={previewCareer.level} />
            <Stat icon={Trophy} label="Aktuelle Punkte" value={formatPoints(previewCareer.points)} />
            <Stat icon={ChevronRight} label="Nächstes Level" value={previewCareer.nextLevel || 'Max'} />
            <Stat icon={Flame} label="Noch benötigt" value={previewCareer.nextLevel ? `${formatPoints(previewCareer.pointsToNextLevel)} Punkte` : '0 Punkte'} />
          </div>
          <div className="mt-5 h-4 overflow-hidden rounded-full bg-black/45 ring-1 ring-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-100" style={{ width: `${previewCareer.progress}%` }} />
          </div>
          <CareerProgressCells progress={previewCareer.progress} />
          <p className="mt-3 text-xs text-white/45">Fortschritt: {previewCareer.progress}% · Ziel: {previewCareer.nextLevelPoints ? `${formatPoints(previewCareer.nextLevelPoints)} Punkte` : 'höchstes Level'}</p>
          {attachment?.dataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={attachment.dataUrl} alt="Aqua Global Backoffice Screenshot" className="mt-4 max-h-52 w-full rounded-2xl border border-white/10 object-contain" />
          )}
        </div>
      </div>
    </Panel>
  );
}

function CareerHistoryPanel({ partner }) {
  const history = partner?.careerHistory || [];
  const levelEvents = partner?.levelEvents || [];

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Panel title="Update-Historie" icon={Clock}>
        {history.length === 0 ? (
          <p className="text-sm text-white/55">Noch keine Punkte-Historie vorhanden.</p>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 8).map((entry) => (
              <div key={entry.id || `${entry.updatedAt}-${entry.points}`} className="rounded-3xl border border-white/10 bg-black/25 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-black text-yellow-50">{formatPoints(entry.points)} Punkte · {entry.level}</p>
                  <p className="text-xs text-white/45">{formatAdminDate(entry.updatedAt)}</p>
                </div>
                <p className="mt-2 text-xs text-white/50">Quelle: {entry.source || 'Update'}{entry.screenshotName ? ` · ${entry.screenshotName}` : ''}</p>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Level-Aufstiege" icon={TrendingUp}>
        {levelEvents.length === 0 ? (
          <p className="text-sm text-white/55">Noch kein Level-Aufstieg dokumentiert.</p>
        ) : (
          <div className="space-y-3">
            {levelEvents.slice(0, 8).map((event) => (
              <div key={event.id || `${event.promotedAt}-${event.toLevel}`} className="rounded-3xl border border-yellow-300/20 bg-yellow-400/10 p-4">
                <p className="font-black text-yellow-50">{event.fromLevel} → {event.toLevel}</p>
                <p className="mt-2 text-sm text-white/60">{formatPoints(event.fromPoints)} → {formatPoints(event.toPoints)} Punkte</p>
                <p className="mt-2 text-xs text-white/45">{formatAdminDate(event.promotedAt)}</p>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

function CareerSection({ partner, rankingPartners = [], copy, onScreenshotSubmit, onTeamGrowthSubmit }) {
  const academyRanking = buildAcademyRanking(rankingPartners, partner);
  const ownRanking = academyRanking.find((item) => item.id === partner?.id) || buildAcademyRanking([partner].filter(Boolean), partner)[0];
  const teamRanking = buildTeamRanking(rankingPartners, partner);
  const ownTeamRanking = teamRanking.find((item) => item.id === partner?.id) || buildTeamRanking([partner].filter(Boolean), partner)[0];
  const career = calculateAquaCareer(partner?.aquaPoints);

  return (
    <section className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <CareerSummaryCard partner={{ ...partner, rank: ownRanking?.rank }} />
        <AcademyRankingPanel ranking={academyRanking.slice(0, 10)} />
      </div>

      <CareerScreenshotUploadPanel partner={partner} onScreenshotSubmit={onScreenshotSubmit} />

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <TeamBuildSummaryCard partner={{ ...partner, teamRank: ownTeamRanking?.teamRank }} />
        <TeamRankingPanel ranking={teamRanking.slice(0, 10)} />
      </div>

      <TeamGrowthUpdatePanel partner={partner} onTeamGrowthSubmit={onTeamGrowthSubmit} />

      <Panel title={copy?.career || 'Aqua Global Karriere'} icon={Trophy}>
        <div className="grid gap-4 md:grid-cols-3">
          <Stat icon={Flame} label="Aktuelle Punkte" value={formatPoints(career.points)} />
          <Stat icon={Star} label="Aktuelles Aqua Global Level" value={partner?.aquaLevel || career.level} />
          <Stat icon={ChevronRight} label="Punkte bis nächstes Level" value={career.nextLevel ? formatPoints(career.pointsToNextLevel) : 'Max'} />
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {aquaGlobalLevels.map((level) => {
            const active = (partner?.aquaLevel || career.level) === level.name;
            return (
              <div key={level.name} className={`rounded-3xl border p-4 ${active ? 'border-yellow-200/45 bg-yellow-400/15 shadow-lg shadow-yellow-500/10' : 'border-white/10 bg-black/25'}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black text-yellow-50">{level.name}</p>
                  {active && <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-black">Aktuell</span>}
                </div>
                <p className="mt-2 text-sm text-white/55">{formatPoints(level.min)} - {formatPoints(level.max)} Punkte</p>
              </div>
            );
          })}
        </div>
      </Panel>

      <CareerHistoryPanel partner={partner} />
      <TeamGrowthHistoryPanel partner={partner} />
    </section>
  );
}

const notificationCategoryMeta = {
  academy: {
    label: 'Academy',
    icon: BookOpen,
    className: 'border-yellow-300/25 bg-yellow-400/10 text-yellow-100',
  },
  team: {
    label: 'Team',
    icon: Users,
    className: 'border-blue-300/25 bg-blue-400/10 text-blue-100',
  },
  admin: {
    label: 'Admin',
    icon: ShieldCheck,
    className: 'border-purple-300/25 bg-purple-400/10 text-purple-100',
  },
  leader: {
    label: 'Leader',
    icon: Crown,
    className: 'border-emerald-300/25 bg-emerald-400/10 text-emerald-100',
  },
  system: {
    label: 'System',
    icon: Settings,
    className: 'border-white/15 bg-white/10 text-white/70',
  },
};

const notificationFilterTabs = [
  { id: 'all', label: 'Alle', icon: Bell },
  { id: 'academy', label: 'Academy', icon: BookOpen },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'admin', label: 'Admin', icon: ShieldCheck },
  { id: 'leader', label: 'Leader', icon: Crown },
  { id: 'system', label: 'System', icon: Settings },
];

const notificationTypeBlueprints = [
  { id: 'new-module', title: 'Neues Modul', category: 'Academy', text: 'Hinweis, wenn ein freigegebenes neues Modul sichtbar wird.' },
  { id: 'module-updated', title: 'Modul aktualisiert', category: 'Academy', text: 'Später nur für Partner, die dieses Modul erreicht, angesehen oder abgeschlossen haben.' },
  { id: 'new-quiz', title: 'Neues Quiz', category: 'Academy', text: 'Quiz-Hinweise werden vorbereitet, aber aktuell nicht persistent gespeichert.' },
  { id: 'certificate', title: 'Zertifikat verfügbar', category: 'Academy', text: 'Zertifikatslogik bleibt UI-only, bis ein echtes Zertifikatssystem freigegeben wird.' },
  { id: 'new-task', title: 'Neue Aufgabe', category: 'Leader', text: 'Aufgabenhinweise können später aus Onboarding- oder Teamdaten erzeugt werden.' },
  { id: 'team-message', title: 'Team-Mitteilung', category: 'Team', text: 'Teamkommunikation bleibt ohne Team-Endpunkt leer und sicher vorbereitet.' },
  { id: 'leader-message', title: 'Leader-Mitteilung', category: 'Leader', text: 'Leader-Hinweise werden später teambezogen und rollenbasiert ausgeliefert.' },
  { id: 'admin-message', title: 'Admin-Mitteilung', category: 'Admin', text: 'Admin-Meldungen bleiben Admin-only und werden nicht an Partner exponiert.' },
  { id: 'system-maintenance', title: 'Systemwartung', category: 'System', text: 'Globale Systemhinweise können später an alle Partner gesendet werden.' },
];

function getNotificationAllowedCategories({ isAdmin = false, isLeader = false }) {
  if (isAdmin) {
    return ['academy', 'team', 'admin', 'leader', 'system'];
  }

  if (isLeader) {
    return ['team', 'academy', 'leader'];
  }

  return ['academy', 'leader', 'system'];
}

function getNotificationCategoryFromUpdate(update) {
  const category = String(update?.category || '').toLowerCase();

  if (category.includes('system')) {
    return 'system';
  }

  if (category.includes('admin') || category === 'announcement') {
    return 'admin';
  }

  if (category.includes('team')) {
    return 'team';
  }

  if (category.includes('leader')) {
    return 'leader';
  }

  return 'academy';
}

function getNotificationTimestamp(value) {
  const timestamp = new Date(value || 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function buildNotificationCenterItems({ updates = [], isAdmin = false, isLeader = false }) {
  const allowedCategories = new Set(getNotificationAllowedCategories({ isAdmin, isLeader }));

  return (updates || [])
    .map((update) => {
      const category = getNotificationCategoryFromUpdate(update);
      const meta = notificationCategoryMeta[category] || notificationCategoryMeta.academy;
      const categoryLabel = academyUpdateCategories.find((item) => item.value === update.category)?.label || update.category || meta.label;

      return {
        id: update.id,
        title: update.title || 'Academy-Benachrichtigung',
        description: update.body || update.description || 'Neue Information in der Harbor Global Partner Academy.',
        category,
        categoryLabel: meta.label,
        typeLabel: categoryLabel,
        date: update.sentAt || update.createdAt,
        status: update.read ? 'read' : 'new',
        icon: meta.icon,
        link: update.link,
        source: 'academy-update',
        update,
      };
    })
    .filter((item) => allowedCategories.has(item.category))
    .sort((left, right) => getNotificationTimestamp(right.date) - getNotificationTimestamp(left.date));
}

function NotificationStatusBadge({ status }) {
  const isNew = status === 'new';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] ${isNew ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white/55'}`}>
      {isNew ? 'Neu' : 'Gelesen'}
    </span>
  );
}

function NotificationCategoryBadge({ category }) {
  const meta = notificationCategoryMeta[category] || notificationCategoryMeta.academy;

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] ${meta.className}`}>
      {meta.label}
    </span>
  );
}

function NotificationEmptyState({ title = 'Momentan gibt es keine neuen Benachrichtigungen.', text = 'Sobald echte Meldungen für deine Rolle vorhanden sind, erscheinen sie hier.' }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-yellow-300/25 bg-yellow-400/[0.06] p-6 text-center text-white">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-yellow-300/25 bg-yellow-400/10 text-yellow-200">
        <Bell size={24} />
      </span>
      <h4 className="mt-4 text-lg font-black text-yellow-50">{title}</h4>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white/55">{text}</p>
    </div>
  );
}

function NotificationCard({ notification, compact = false, onMarkRead }) {
  const Icon = notification.icon || Bell;

  return (
    <article className={`rounded-[1.5rem] border p-4 text-white shadow-lg shadow-black/15 ${notification.status === 'new' ? 'border-yellow-300/25 bg-yellow-400/[0.09]' : 'border-white/10 bg-black/25'} ${compact ? '' : 'sm:p-5'}`}>
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
          <Icon size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <NotificationCategoryBadge category={notification.category} />
            <NotificationStatusBadge status={notification.status} />
          </div>
          <h4 className={`${compact ? 'mt-2 text-base' : 'mt-3 text-xl'} break-words font-black text-yellow-50`}>{notification.title}</h4>
          <p className="mt-2 break-words text-sm leading-relaxed text-white/62">{notification.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/42">
            <span>{notification.typeLabel}</span>
            {notification.date && <span>· {formatAdminDate(notification.date)}</span>}
          </div>
          {!compact && (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              {notification.link && (
                <a href={notification.link} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-black text-black hover:bg-yellow-300">
                  Öffnen <ExternalLink size={15} />
                </a>
              )}
              {notification.status === 'new' && onMarkRead && (
                <Button type="button" onClick={() => onMarkRead(notification.id)} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/15">
                  <CheckCircle2 size={15} /> Gelesen markieren
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function LatestNotificationsWidget({ notifications, onNavigate }) {
  const latest = notifications.slice(0, 5);
  const unreadCount = notifications.filter((item) => item.status === 'new').length;

  return (
    <Panel title="Neueste Benachrichtigungen" icon={Bell}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm leading-relaxed text-white/60">Deine letzten Academy-Meldungen, Statushinweise und vorbereiteten Systeminformationen.</p>
          <span className="mt-3 inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-black">{unreadCount} neu</span>
        </div>
        <Button type="button" onClick={() => onNavigate?.('news')} className="w-full rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-black text-black hover:bg-yellow-300 lg:w-auto">
          Alle anzeigen <ChevronRight size={15} />
        </Button>
      </div>
      <div className="mt-5 space-y-3">
        {latest.length === 0 ? (
          <NotificationEmptyState compact title="Momentan gibt es keine neuen Benachrichtigungen." text="Sobald Academy-Updates für deine Rolle vorliegen, erscheinen sie direkt im Dashboard." />
        ) : (
          latest.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} compact />
          ))
        )}
      </div>
    </Panel>
  );
}

function NotificationPreparedTypesPanel() {
  return (
    <Panel title="Benachrichtigungsarten vorbereitet" icon={Settings}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {notificationTypeBlueprints.map((item) => (
          <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words font-black text-yellow-50">{item.title}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-yellow-200">{item.category}</p>
              </div>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white/50">UI</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/55">{item.text}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function NotificationUpdateRulePanel() {
  return (
    <Panel title="Spätere Update-Logik vorbereitet" icon={ShieldCheck}>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[1.5rem] border border-green-300/20 bg-green-400/10 p-4 text-green-100">
          <CheckCircle2 size={18} />
          <p className="mt-3 font-black">Nur erreichte Module</p>
          <p className="mt-2 text-sm leading-relaxed opacity-80">Modul-Updates dürfen später nur an Partner gehen, die das Modul bereits angesehen oder abgeschlossen haben.</p>
        </div>
        <div className="rounded-[1.5rem] border border-yellow-300/20 bg-yellow-400/10 p-4 text-yellow-100">
          <Lock size={18} />
          <p className="mt-3 font-black">Neue Partner schützen</p>
          <p className="mt-2 text-sm leading-relaxed opacity-80">Neue Partner erhalten keine Benachrichtigung über spätere Module, die sie im Lernpfad noch nicht erreicht haben.</p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4 text-white/70">
          <Globe2 size={18} />
          <p className="mt-3 font-black text-yellow-50">Globale Updates</p>
          <p className="mt-2 text-sm leading-relaxed">Academy-weite System- oder Launch-Updates können später bewusst an alle freigegebenen Partner gesendet werden.</p>
        </div>
      </div>
    </Panel>
  );
}

function SuccessCenterSection({ partner, academyUpdates = [], localOnboardingStepIds = [], onNavigate, isAdmin = false, isLeader = false, partners = [], pendingPartners = [], compact = false, selectedLanguage = DEFAULT_LANGUAGE, copy = getCopy(selectedLanguage) }) {
  const t = createI18nTranslator(selectedLanguage, copy);

  return (
    <SuccessCenterSectionView
      partner={partner}
      academyUpdates={academyUpdates}
      localOnboardingStepIds={localOnboardingStepIds}
      onNavigate={onNavigate}
      isAdmin={isAdmin}
      isLeader={isLeader}
      partners={partners}
      pendingPartners={pendingPartners}
      compact={compact}
      dependencies={{
        Panel,
        Stat,
        NotificationEmptyState,
        getPartnerAcademySummary,
        getOnboardingAssistantSummary,
        buildNotificationCenterItems,
        formatPartnerCount,
        formatPoints,
        isAdminOperationsLeader,
        getAnalyticsPartnerProgress,
        toPartnerCount,
        copy,
        language: selectedLanguage,
        t,
      }}
    />
  );
}

function GrowthCenterSection({ partner, academyUpdates = [], onNavigate, isAdmin = false, isLeader = false, selectedLanguage = DEFAULT_LANGUAGE, copy = getCopy(selectedLanguage) }) {
  const t = createI18nTranslator(selectedLanguage, copy);

  return (
    <GrowthCenterSectionView
      partner={partner}
      academyUpdates={academyUpdates}
      onNavigate={onNavigate}
      isAdmin={isAdmin}
      isLeader={isLeader}
      dependencies={{
        Panel,
        Stat,
        NotificationEmptyState,
        getPartnerAcademySummary,
        getOnboardingAssistantSummary,
        buildNotificationCenterItems,
        formatAdminDate,
        copy,
        language: selectedLanguage,
        t,
      }}
    />
  );
}

function CampaignCenterSection({ partner, onNavigate, isAdmin = false, isLeader = false, selectedLanguage = DEFAULT_LANGUAGE, copy = getCopy(selectedLanguage) }) {
  const t = createI18nTranslator(selectedLanguage, copy);

  return (
    <CampaignCenterSectionView
      partner={partner}
      onNavigate={onNavigate}
      isAdmin={isAdmin}
      isLeader={isLeader}
      dependencies={{
        Panel,
        Stat,
        NotificationEmptyState,
        copy,
        language: selectedLanguage,
        t,
      }}
    />
  );
}

function MediaCenterSection({ isAdmin = false, isLeader = false, selectedLanguage = DEFAULT_LANGUAGE, copy = getCopy(selectedLanguage) }) {
  const t = createI18nTranslator(selectedLanguage, copy);

  return (
    <MediaCenterSectionView
      isAdmin={isAdmin}
      isLeader={isLeader}
      dependencies={{
        Panel,
        Stat,
        NotificationEmptyState,
        copy,
        language: selectedLanguage,
        t,
      }}
    />
  );
}

function DashboardHome({
  partner,
  overallProgress,
  copy,
  academyUpdates = [],
  localOnboardingStepIds = [],
  onNavigate,
  selectedLanguage = DEFAULT_LANGUAGE,
  isAdmin = false,
  isLeader = false,
}) {
  const t = useMemo(() => createI18nTranslator(selectedLanguage, copy), [copy, selectedLanguage]);
  const academyModuleSummary = getPartnerAcademySummary(partner);
  const onboardingAssistant = getOnboardingAssistantSummary(partner, localOnboardingStepIds, academyModuleSummary);
  const onboardingProgress = onboardingAssistant.progress || academyModuleSummary.overallProgress || partner?.academyProgress?.onboardingProgressPercent || partner?.academyProgress?.progressPercent || overallProgress;
  const nextStep = onboardingAssistant.nextStep
    ? onboardingAssistant.nextStep.title
    : academyModuleSummary.nextModule
      ? `Weiter mit „${academyModuleSummary.nextModule.title}“`
    : getPartnerOnboardingRecommendation(partner);
  const openTaskCount = Math.max(0, onboardingAssistant.requiredCount - onboardingAssistant.completedRequiredCount);
  const todayTaskCount = Math.min(4, Math.max(1, openTaskCount));
  const dashboardNotifications = buildNotificationCenterItems({
    updates: academyUpdates,
    isAdmin: partner?.role === 'admin',
    isLeader: isLeaderAnalyticsPartner(partner),
  });
  const todayTasks = [
    {
      id: 'module',
      title: t('uxTaskModule'),
      text: nextStep || t('uxTaskModuleText'),
      icon: BookOpen,
      target: onboardingAssistant.nextStep?.target || 'modules',
      visible: true,
    },
    {
      id: 'profile',
      title: t('uxTaskProfile'),
      text: t('uxTaskProfileText'),
      icon: UserCheck,
      target: 'profile',
      visible: !partner?.profileImageUrl,
    },
    {
      id: 'ppm',
      title: t('uxTaskPpm'),
      text: t('uxTaskPpmText'),
      icon: Search,
      target: 'testlab',
      visible: onboardingProgress > 0,
    },
    {
      id: 'story',
      title: t('uxTaskStory'),
      text: t('uxTaskStoryText'),
      icon: Instagram,
      target: 'media',
      visible: onboardingProgress >= 20,
    },
    {
      id: 'whatsapp',
      title: t('uxTaskWhatsApp'),
      text: t('uxTaskWhatsAppText'),
      icon: MessageCircle,
      target: 'resources',
      visible: onboardingProgress >= 40,
    },
    {
      id: 'team',
      title: t('uxTaskTeam'),
      text: t('uxTaskTeamText'),
      icon: Users,
      target: 'leader',
      visible: isLeader || Number(partner?.teamPartnerCount || 0) > 0,
    },
  ].filter((task) => task.visible).slice(0, 4);
  const overviewCards = [
    { id: 'progress', label: copy.academyProgress || t('learningProgress'), value: `${onboardingProgress}%`, icon: BookOpen },
    { id: 'today', label: t('uxTodayTasksCount'), value: todayTaskCount, icon: Target },
    { id: 'open', label: t('uxOpenTasksCount'), value: openTaskCount, icon: CheckCircle2 },
    { id: 'points', label: t('uxPoints'), value: formatPoints(partner?.aquaPoints || 0), icon: Trophy },
    { id: 'level', label: t('uxLevel'), value: partner?.aquaLevel || t('starterLevel'), icon: Crown },
    { id: 'certificates', label: t('uxCertificates'), value: partner?.academyProgress?.certificationPassed ? '1' : '0', icon: ShieldCheck },
  ];
  const compactLinks = [
    { id: 'media', title: t('uxMediaTeaserTitle'), text: t('uxMediaTeaserText'), action: t('uxOpenMedia'), icon: ImagePlus, target: 'media' },
    { id: 'growth', title: t('uxGrowthTeaserTitle'), text: t('uxGrowthTeaserText'), action: t('uxOpenGrowth'), icon: Flame, target: 'growth' },
    { id: 'success', title: t('uxSuccessTeaserTitle'), text: t('uxSuccessTeaserText'), action: t('uxOpenSuccess'), icon: Target, target: 'success' },
  ];

  return (
    <section className="space-y-5">
      <Card className="overflow-hidden rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-400/[0.14] via-white/[0.06] to-black/55 text-white shadow-2xl shadow-yellow-500/10 backdrop-blur-xl">
        <CardContent className="p-5 sm:p-6 md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-200">{t('uxNormalDashboard')}</p>
              <h2 className="mt-2 break-words text-3xl font-black text-yellow-50 sm:text-4xl">
                {copy.welcome}, {partner?.firstName || t('partner')}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65">{t('uxWelcomeText')}</p>
            </div>
            <Button type="button" onClick={() => onNavigate?.(onboardingAssistant.nextStep?.target || 'modules')} className="min-h-12 w-full rounded-2xl bg-yellow-400 px-5 py-3 font-black text-black hover:bg-yellow-300 lg:w-auto">
              {t('open')} <ChevronRight size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Panel title={t('uxTodayTasksTitle')} icon={Target}>
        <p className="mb-4 text-sm leading-relaxed text-white/58">{t('uxTodayTasksText')}</p>
        {todayTasks.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {todayTasks.map(({ id, title, text, icon: Icon, target }) => (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate?.(target)}
                className="group min-w-0 rounded-[1.5rem] border border-white/10 bg-black/25 p-4 text-left text-white transition hover:-translate-y-0.5 hover:border-yellow-300/30 hover:bg-yellow-400/[0.08]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200 transition group-hover:bg-yellow-400 group-hover:text-black">
                  <Icon size={20} />
                </span>
                <span className="mt-4 block break-words font-black text-yellow-50">{title}</span>
                <span className="mt-2 block break-words text-sm leading-relaxed text-white/55">{text}</span>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-yellow-200">
                  {t('open')} <ChevronRight size={15} />
                </span>
              </button>
            ))}
          </div>
        ) : (
          <NotificationEmptyState title={t('uxNoUrgentTasks')} text={t('uxReducedDuplicates')} />
        )}
      </Panel>

      <Panel title={t('uxProgressSnapshotTitle')} icon={ShieldCheck}>
        <p className="mb-4 text-sm leading-relaxed text-white/58">{t('uxProgressSnapshotText')}</p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          {overviewCards.map(({ id, label, value, icon: Icon }) => (
            <div key={id} className="rounded-[1.35rem] border border-white/10 bg-black/25 p-4">
              <Icon size={18} className="text-yellow-200" />
              <p className="mt-3 break-words text-2xl font-black text-yellow-50">{value}</p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-white/45">{label}</p>
            </div>
          ))}
        </div>
      </Panel>

      <CampaignDashboardBanner partner={partner} isAdmin={isAdmin} isLeader={isLeader} onNavigate={onNavigate} t={t} />

      <LatestNotificationsWidget notifications={dashboardNotifications.slice(0, 5)} onNavigate={onNavigate} />

      <section className="grid gap-3 md:grid-cols-3">
        {compactLinks.map(({ id, title, text, action, icon: Icon, target }) => (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate?.(target)}
            className="group min-w-0 rounded-[1.5rem] border border-yellow-300/15 bg-white/[0.055] p-4 text-left text-white transition hover:-translate-y-0.5 hover:border-yellow-300/35 hover:bg-yellow-400/[0.08] sm:p-5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200 transition group-hover:bg-yellow-400 group-hover:text-black">
              <Icon size={20} />
            </span>
            <span className="mt-4 block break-words text-lg font-black text-yellow-50">{title}</span>
            <span className="mt-2 block break-words text-sm leading-relaxed text-white/55">{text}</span>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-yellow-200">
              {action} <ChevronRight size={15} />
            </span>
          </button>
        ))}
      </section>
    </section>
  );
}

function NewsSection({ updates, onMarkRead, isAdmin = false, isLeader = false, communitySummary = {} }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const notifications = useMemo(() => buildNotificationCenterItems({ updates, isAdmin, isLeader }), [isAdmin, isLeader, updates]);
  const allowedCategories = getNotificationAllowedCategories({ isAdmin, isLeader });
  const visibleTabs = notificationFilterTabs.filter((tab) => tab.id === 'all' || allowedCategories.includes(tab.id));
  const safeActiveCategory = activeCategory === 'all' || allowedCategories.includes(activeCategory) ? activeCategory : 'all';
  const filteredNotifications = safeActiveCategory === 'all'
    ? notifications
    : notifications.filter((item) => item.category === safeActiveCategory);
  const unreadCount = notifications.filter((item) => item.status === 'new').length;
  const roleLabel = isAdmin ? 'Admin' : isLeader ? 'Leader' : 'Partner';
  const systemCount = Number(communitySummary?.notificationCount || 0);

  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-400/[0.14] via-white/[0.055] to-black/45 p-5 text-white shadow-2xl shadow-yellow-500/10 sm:p-6 lg:p-7">
        <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr] xl:items-end">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-200">Notification Center</p>
            <h2 className="mt-3 break-words text-3xl font-black text-yellow-50 sm:text-4xl">Alle wichtigen Meldungen an einem Ort</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65 sm:text-base">
              Rollenbasierte Übersicht für Academy-, Team-, Leader-, Admin- und Systemmeldungen. Aktuell werden ausschließlich vorhandene Academy-Update-Daten angezeigt; alle weiteren Bereiche sind sicher vorbereitet.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <Stat icon={Bell} label="Neu" value={unreadCount} />
            <Stat icon={ShieldCheck} label="Rolle" value={roleLabel} />
            <Stat icon={Settings} label="Systemhinweise" value={systemCount} />
          </div>
        </div>
      </div>

      <Panel title="Benachrichtigungen" icon={Bell}>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const active = safeActiveCategory === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-black transition ${active ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20' : 'border border-white/10 bg-white/[0.055] text-white/65 hover:border-yellow-300/30 hover:bg-yellow-400/10 hover:text-yellow-50'}`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          {filteredNotifications.length === 0 ? (
            <NotificationEmptyState
              title="Momentan gibt es keine neuen Benachrichtigungen."
              text={safeActiveCategory === 'all'
                ? 'Für deine Rolle liegen aktuell keine sichtbaren Meldungen vor.'
                : `Für die Kategorie ${notificationCategoryMeta[safeActiveCategory]?.label || safeActiveCategory} gibt es aktuell keine sichtbaren Meldungen.`}
            />
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {filteredNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} onMarkRead={onMarkRead} />
              ))}
            </div>
          )}
        </div>
      </Panel>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <NotificationPreparedTypesPanel />
        <NotificationUpdateRulePanel />
      </section>

      <Panel title="Sicherheit & Datenbasis" icon={Lock}>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-green-300/20 bg-green-400/10 p-4 text-sm text-green-100">
            <p className="font-black">Partner</p>
            <p className="mt-2 leading-relaxed opacity-80">sehen nur vorhandene Academy-, eigene Leader- und Systembereiche.</p>
          </div>
          <div className="rounded-2xl border border-yellow-300/20 bg-yellow-400/10 p-4 text-sm text-yellow-100">
            <p className="font-black">Leader</p>
            <p className="mt-2 leading-relaxed opacity-80">sehen nur vorbereitete Team-, Academy- und Leaderbereiche.</p>
          </div>
          <div className="rounded-2xl border border-purple-300/20 bg-purple-400/10 p-4 text-sm text-purple-100">
            <p className="font-black">Admin</p>
            <p className="mt-2 leading-relaxed opacity-80">sieht alle vorhandenen Academy-Updates und eine globale Systemübersicht.</p>
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-white/45">
          Keine neue Rechteverwaltung, keine neuen Tabellen, kein Versandprozess und keine sensiblen Partnerdaten im Notification Center. Sichtbare Meldungen stammen aus bereits geladenen, rollenbasiert gefilterten Academy-Updates.
        </p>
      </Panel>
    </section>
  );
}

function OnboardingAssistantCard({
  partner,
  localCompletedStepIds = [],
  onMarkStep,
  onNavigate,
  title = 'Onboarding-Assistent',
  intro = 'Dein persönlicher Startplan für die ersten Tage in der Harbor Global Partner Academy.',
}) {
  const academySummary = getPartnerAcademySummary(partner);
  const assistant = getOnboardingAssistantSummary(partner, localCompletedStepIds, academySummary);
  const finishLocked = assistant.steps.some((step) => !step.optional && step.id !== 'finish-onboarding' && !step.completed);

  return (
    <Card className="overflow-hidden rounded-[2rem] border border-yellow-300/25 bg-gradient-to-br from-yellow-400/[0.14] via-white/[0.06] to-black/45 text-white shadow-2xl shadow-yellow-500/10 backdrop-blur-xl">
      <CardContent className="p-5 sm:p-6 md:p-8">
        <div className="grid gap-6 xl:grid-cols-[0.9fr_0.45fr]">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-200">Neue Partner</p>
            <h3 className="mt-2 break-words text-3xl font-black text-yellow-50 md:text-4xl">{title}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65">{intro}</p>
            {assistant.nextStep && (
              <div className="mt-5 rounded-[1.5rem] border border-yellow-300/20 bg-black/30 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Nächster Schritt</p>
                <p className="mt-2 break-words text-xl font-black text-yellow-50">{assistant.nextStep.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/58">{assistant.nextStep.description}</p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  {assistant.nextStep.target && (
                    <Button
                      type="button"
                      onClick={() => onNavigate?.(assistant.nextStep.target)}
                      className="w-full rounded-2xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300 sm:w-auto"
                    >
                      <ChevronRight size={16} /> {assistant.nextStep.actionLabel}
                    </Button>
                  )}
                  {assistant.nextStep.manual && !assistant.nextStep.completed && (
                    <Button
                      type="button"
                      onClick={() => onMarkStep?.(assistant.nextStep.id)}
                      disabled={assistant.nextStep.id === 'finish-onboarding' && finishLocked}
                      className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold text-white hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
                    >
                      <CheckCircle2 size={16} /> Als erledigt markieren
                    </Button>
                  )}
                </div>
                {assistant.nextStep.id === 'finish-onboarding' && finishLocked && (
                  <p className="mt-3 text-xs text-white/45">Schließe zuerst die offenen Pflichtschritte ab.</p>
                )}
              </div>
            )}
          </div>

          <div className="rounded-[1.75rem] border border-yellow-300/20 bg-black/35 p-5">
            <div className="flex items-center justify-between gap-3 text-sm font-bold text-white/62">
              <span>Fortschritt</span>
              <span>{assistant.progress}%</span>
            </div>
            <div className="mt-3 h-4 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-100" style={{ width: `${assistant.progress}%` }} />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-2xl font-black text-yellow-50">{assistant.completedRequiredCount}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/45">Erledigt</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-2xl font-black text-yellow-50">{assistant.requiredCount}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/45">Pflicht</p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-white/45">
              Die Checkliste nutzt vorhandene Profildaten und lokale Sitzungs-Häkchen. Es werden keine Partnerdaten gespeichert.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-3 lg:grid-cols-2">
          {assistant.steps.map((step, index) => {
            const Icon = step.icon || CheckCircle2;
            const isFinishLocked = step.id === 'finish-onboarding' && finishLocked;
            const statusLabel = step.completed ? 'Erledigt' : step.optional ? 'Optional' : 'Offen';
            const statusClass = step.completed
              ? 'bg-emerald-400 text-black ring-emerald-200/40'
              : step.optional
                ? 'bg-white/10 text-white/70 ring-white/15'
                : 'bg-yellow-400/15 text-yellow-100 ring-yellow-200/25';

            return (
              <div key={step.id} className={`min-w-0 rounded-[1.5rem] border p-4 ${step.completed ? 'border-emerald-300/20 bg-emerald-400/[0.08]' : 'border-white/10 bg-black/25'}`}>
                <div className="flex min-w-0 items-start gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${step.completed ? 'bg-emerald-400 text-black' : 'bg-yellow-400/12 text-yellow-100 ring-1 ring-yellow-200/20'}`}>
                    {step.completed ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-black uppercase tracking-[0.16em] text-white/38">Schritt {index + 1}</span>
                      <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ring-1 ${statusClass}`}>
                        {statusLabel}
                      </span>
                    </div>
                    <h4 className="mt-2 break-words text-base font-black text-yellow-50">{step.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-white/58">{step.description}</p>
                    {!step.completed && (
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        {step.target && (
                          <Button
                            type="button"
                            onClick={() => onNavigate?.(step.target)}
                            className="min-h-11 w-full rounded-2xl bg-yellow-400 px-4 py-2 text-sm font-black text-black hover:bg-yellow-300 sm:w-auto"
                          >
                            <ChevronRight size={15} /> {step.actionLabel}
                          </Button>
                        )}
                        {step.manual && (
                          <Button
                            type="button"
                            onClick={() => onMarkStep?.(step.id)}
                            disabled={isFinishLocked}
                            className="min-h-11 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-45 sm:w-auto"
                          >
                            <CheckCircle2 size={15} /> Erledigt
                          </Button>
                        )}
                      </div>
                    )}
                    {isFinishLocked && <p className="mt-3 text-xs text-white/42">Wird aktiv, sobald alle Pflichtschritte davor erledigt sind.</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileSection({ partner, rankingPartners = [], copy, onSave, onProfilePhotoChange, onScreenshotSubmit, onTeamGrowthSubmit }) {
  const [emailUpdates, setEmailUpdates] = useState(partner?.notificationPrefs?.emailUpdates !== false);
  const [whatsappUpdates, setWhatsappUpdates] = useState(Boolean(partner?.notificationPrefs?.whatsappUpdates));
  const [notificationLanguage, setNotificationLanguage] = useState(normalizeLanguage(partner?.notificationPrefs?.language || partner?.language || DEFAULT_LANGUAGE));
  const [instagramProfile, setInstagramProfile] = useState(partner?.instagramProfile || '');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageProcessing, setProfileImageProcessing] = useState(false);
  const [profileImageSaving, setProfileImageSaving] = useState(false);
  const [profileImageMessage, setProfileImageMessage] = useState('');
  const [instagramSaving, setInstagramSaving] = useState(false);
  const [instagramMessage, setInstagramMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const academyRanking = buildAcademyRanking(rankingPartners, partner);
  const ownRanking = academyRanking.find((item) => item.id === partner?.id) || buildAcademyRanking([partner].filter(Boolean), partner)[0];
  const teamRanking = buildTeamRanking(rankingPartners, partner);
  const ownTeamRanking = teamRanking.find((item) => item.id === partner?.id) || buildTeamRanking([partner].filter(Boolean), partner)[0];
  const profileReadinessItems = [
    {
      label: 'Profilfoto',
      ready: Boolean(partner?.profileImageUrl || profileImage?.dataUrl),
      text: partner?.profileImageUrl || profileImage?.dataUrl ? 'sichtbar' : 'noch offen',
    },
    {
      label: 'Instagram',
      ready: Boolean(instagramProfileToUrl(instagramProfile || partner?.instagramProfile)),
      text: instagramProfileToHandle(instagramProfile || partner?.instagramProfile) || 'optional',
    },
    {
      label: 'Team',
      ready: Boolean(String(partner?.teamName || '').trim()) || Number(partner?.teamPartnerCount || 0) > 0,
      text: partner?.teamName || (Number(partner?.teamPartnerCount || 0) > 0 ? `${formatPartnerCount(partner.teamPartnerCount)} Partner` : 'noch offen'),
    },
    {
      label: 'Benachrichtigungen',
      ready: emailUpdates || whatsappUpdates,
      text: emailUpdates || whatsappUpdates ? 'aktiv' : 'deaktiviert',
    },
  ];

  const selectProfileImage = async (file) => {
    setProfileImageMessage('');
    setProfileImageProcessing(true);

    try {
      const optimizedImage = await optimizeProfileImageFile(file, copy);
      setProfileImage(optimizedImage);
      setProfileImageMessage(`Optimiert auf ${formatProfileImageSize(optimizedImage.size)}.`);
    } catch (error) {
      setProfileImage(null);
      setProfileImageMessage(error.message || copy.profileImageInvalidType);
    } finally {
      setProfileImageProcessing(false);
    }
  };

  const saveProfileImage = async () => {
    if (!profileImage) {
      setProfileImageMessage(copy.profileImageRequired);
      return;
    }

    setProfileImageSaving(true);
    setProfileImageMessage('');

    try {
      await onProfilePhotoChange(profileImage, false);
      setProfileImage(null);
      setProfileImageMessage('Profilbild wurde gespeichert.');
    } catch (error) {
      setProfileImageMessage(error.message || 'Profilbild konnte nicht gespeichert werden.');
    } finally {
      setProfileImageSaving(false);
    }
  };

  const removeProfileImage = async () => {
    setProfileImageSaving(true);
    setProfileImageMessage('');

    try {
      await onProfilePhotoChange(null, true);
      setProfileImage(null);
      setProfileImageMessage('Profilbild wurde entfernt.');
    } catch (error) {
      setProfileImageMessage(error.message || 'Profilbild konnte nicht entfernt werden.');
    } finally {
      setProfileImageSaving(false);
    }
  };

  const saveInstagramProfile = async () => {
    setInstagramMessage('');

    if (!isValidInstagramProfile(instagramProfile)) {
      setInstagramMessage('Bitte gib eine gültige Instagram-URL oder einen Benutzernamen mit @ ein.');
      return;
    }

    const normalizedInstagram = normalizeInstagramProfile(instagramProfile);
    setInstagramSaving(true);

    try {
      await onSave({ instagramProfile: normalizedInstagram, instagramVisible: true });
      setInstagramProfile(normalizedInstagram);
      setInstagramMessage('Instagram-Profil gespeichert.');
    } catch (error) {
      setInstagramMessage(error.message || 'Instagram-Profil konnte nicht gespeichert werden.');
    } finally {
      setInstagramSaving(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage('');

    try {
      await onSave({ emailUpdates, whatsappUpdates, notificationLanguage: normalizeLanguage(notificationLanguage), language: normalizeLanguage(notificationLanguage) });
      setMessage(copy.notificationSettingsSaved);
    } catch (error) {
      setMessage(error.message || 'Einstellungen konnten nicht gespeichert werden.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-5">
      <Panel title="Partnerprofil" icon={UserCheck}>
        <div className="mb-5 flex flex-col gap-4 rounded-3xl border border-yellow-300/20 bg-black/25 p-4 sm:flex-row sm:items-center">
          <CareerAvatar partner={{ ...partner, profileImageUrl: profileImage?.dataUrl || partner?.profileImageUrl }} />
          <div className="min-w-0 flex-1">
            <p className="font-black text-yellow-50">Profilfoto</p>
            <p className="mt-1 text-sm leading-relaxed text-white/55">JPG, PNG oder WEBP bis 5 MB · Speicherung optimiert auf maximal 1 MB</p>
            {partner?.role !== 'admin' && (
              <>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <label className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-yellow-300/25 bg-yellow-400/15 px-4 py-3 text-sm font-bold text-yellow-100 hover:bg-yellow-400/25 sm:w-auto ${profileImageProcessing || profileImageSaving ? 'pointer-events-none opacity-60' : ''}`}>
                    <Upload size={16} />
                    Profilbild auswählen
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0] || null;
                        event.target.value = '';
                        selectProfileImage(file);
                      }}
                    />
                  </label>
                  <label className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-yellow-300/25 bg-black/25 px-4 py-3 text-sm font-bold text-yellow-100 hover:bg-yellow-400/15 sm:w-auto ${profileImageProcessing || profileImageSaving ? 'pointer-events-none opacity-60' : ''}`}>
                    <Camera size={16} />
                    Foto aufnehmen
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      capture="environment"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0] || null;
                        event.target.value = '';
                        selectProfileImage(file);
                      }}
                    />
                  </label>
                  {profileImage && (
                    <Button type="button" disabled={profileImageProcessing || profileImageSaving} onClick={saveProfileImage} className="w-full rounded-2xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300 disabled:opacity-60 sm:w-auto">
                      <CheckCircle2 size={16} /> {profileImageSaving ? copy.saving : 'Profilbild speichern'}
                    </Button>
                  )}
                  {partner?.profileImageUrl && (
                    <Button type="button" disabled={profileImageSaving} onClick={removeProfileImage} className="w-full rounded-2xl border border-red-400/30 bg-red-500/15 px-4 py-3 font-bold text-red-100 hover:bg-red-500/25 disabled:opacity-60 sm:w-auto">
                      <Trash2 size={16} /> Profilbild entfernen
                    </Button>
                  )}
                </div>
                {profileImageProcessing && <p className="mt-3 text-sm text-yellow-100">Bild wird optimiert...</p>}
                {profileImageMessage && <AuthMessage>{profileImageMessage}</AuthMessage>}
              </>
            )}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Stat icon={UserCheck} label="Vorname" value={partner?.firstName || '-'} />
          <Stat icon={UserCheck} label="Nachname" value={partner?.lastName || '-'} />
          <Stat icon={Globe2} label="Stadt" value={partner?.city || '-'} />
          <Stat icon={Phone} label="Telefon" value={partner?.whatsapp || '-'} />
          <Stat icon={Trophy} label="Team" value={partner?.teamName || 'Nicht zugeordnet'} />
          <Stat icon={Star} label="Aktuelles Level" value={partner?.aquaLevel || 'Starterstufe'} />
          <Stat icon={Flame} label="Aktuelle Punkte" value={formatPoints(partner?.aquaPoints)} />
          <Stat icon={CalendarDays} label="Letztes Update" value={formatAdminDate(partner?.aquaLastUpdatedAt)} />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {profileReadinessItems.map((item) => (
            <div key={item.label} className={`rounded-2xl border p-4 ${item.ready ? 'border-green-300/20 bg-green-400/10 text-green-100' : 'border-yellow-300/20 bg-yellow-400/10 text-yellow-100'}`}>
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 size={15} className={item.ready ? 'text-green-200' : 'text-yellow-200'} />
                <p className="text-sm font-black">{item.label}</p>
              </div>
              <p className="break-words text-xs opacity-80">{item.text}</p>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Instagram / Social Media" icon={Instagram}>
        <p className="mb-5 text-sm leading-relaxed text-white/60">
          Trage hier dein eigenes Instagram-Profil ein. Nach dem Speichern erscheint es im Social-Media-Bereich, solange du die Sichtbarkeit aktiviert lässt.
        </p>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <Input
            label="Mein Instagram-Profil"
            value={instagramProfile}
            onChange={(event) => {
              setInstagramProfile(event.target.value);
              setInstagramMessage('');
            }}
            placeholder="https://instagram.com/deinname"
          />
          <Button type="button" disabled={instagramSaving} onClick={saveInstagramProfile} className="w-full rounded-2xl bg-yellow-400 px-5 py-3 font-black text-black hover:bg-yellow-300 disabled:opacity-60 lg:w-auto">
            <Instagram size={16} /> {instagramSaving ? copy.saving : 'Instagram speichern'}
          </Button>
        </div>
        <p className="mt-3 text-xs text-white/45">Erlaubt sind Instagram-URLs oder Benutzernamen wie @deinname.</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          {instagramProfileToUrl(instagramProfile) && (
            <a href={instagramProfileToUrl(instagramProfile)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-yellow-300/25 bg-yellow-400/10 px-4 py-3 text-sm font-bold text-yellow-100 hover:bg-yellow-400/20">
              Profil öffnen <ExternalLink size={15} />
            </a>
          )}
          <span className={`rounded-2xl px-4 py-3 text-sm font-bold ${partner?.instagramVisible === false ? 'bg-white/10 text-white/55' : 'bg-green-400/15 text-green-100'}`}>
            Sichtbarkeit: {partner?.instagramVisible === false ? 'ausgeblendet' : 'aktiv'}
          </span>
        </div>
        {instagramMessage && <AuthMessage>{instagramMessage}</AuthMessage>}
      </Panel>
      <Panel title={copy.notificationSettings} icon={Settings}>
        <p className="mb-5 text-sm leading-relaxed text-white/60">{copy.notificationSettingsText}</p>
        <div className="space-y-3">
          <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-relaxed text-white/70">
            <input type="checkbox" checked={emailUpdates} onChange={(event) => setEmailUpdates(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-yellow-300" />
            <span>{copy.emailUpdatesConsent}</span>
          </label>
          <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-relaxed text-white/70">
            <input type="checkbox" checked={whatsappUpdates} onChange={(event) => setWhatsappUpdates(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-yellow-300" />
            <span>{copy.whatsappUpdatesConsent}</span>
          </label>
          <Select label={copy.notificationLanguage} options={languages} value={notificationLanguage} onChange={setNotificationLanguage} />
        </div>
        {message && <AuthMessage>{message}</AuthMessage>}
        <Button type="button" disabled={saving} onClick={saveSettings} className="mt-5 rounded-2xl bg-yellow-400 px-5 py-3 font-black text-black hover:bg-yellow-300 disabled:opacity-60">
          <Settings size={16} /> {saving ? copy.saving : copy.saveNotificationSettings}
        </Button>
      </Panel>
      <CareerSummaryCard partner={{ ...partner, rank: ownRanking?.rank }} />
      <CareerScreenshotUploadPanel partner={partner} onScreenshotSubmit={onScreenshotSubmit} />
      <TeamBuildSummaryCard partner={{ ...partner, teamRank: ownTeamRanking?.teamRank }} />
      <TeamGrowthUpdatePanel partner={partner} onTeamGrowthSubmit={onTeamGrowthSubmit} />
      <AcademyRankingPanel ranking={academyRanking.slice(0, 10)} />
      <TeamRankingPanel ranking={teamRanking.slice(0, 10)} />
      <CareerHistoryPanel partner={partner} />
      <TeamGrowthHistoryPanel partner={partner} />
    </section>
  );
}

function PremiumCalendlyLink({ copy, label, className = '' }) {
  return (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 px-5 py-3 font-black text-black shadow-lg shadow-yellow-500/25 ring-1 ring-yellow-100/50 transition hover:scale-[1.01] hover:shadow-yellow-400/40 ${className}`}
    >
      <CalendarDays size={18} />
      {label || copy.bookLeonidCall}
      <ExternalLink size={16} />
    </a>
  );
}

function BookingCtaBand({ copy, compact = false }) {
  const actions = [
    { label: copy.bookAppointment, icon: CalendarDays },
    { label: copy.secureFreeCall, icon: CheckCircle2 },
    { label: copy.schedulePartnerCall, icon: UserCheck },
    { label: copy.bookWaterConsultation, icon: ShieldCheck },
  ];

  return (
    <div className={`max-w-full overflow-hidden rounded-[1.5rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-400/[0.14] via-white/[0.05] to-black/35 p-4 text-white shadow-xl shadow-yellow-500/10 sm:rounded-[2rem] ${compact ? '' : 'md:p-6'}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-200">{copy.bookingCentralTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/65">{copy.bookingCentralText}</p>
        </div>
        <div className="grid min-w-0 gap-2 sm:grid-cols-2">
          {actions.map(({ label: actionLabel, icon: Icon }) => (
            <a
              key={actionLabel}
              href={CALENDLY_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-w-0 items-center justify-center gap-2 rounded-2xl border border-yellow-200/25 bg-black/35 px-3 py-3 text-center text-sm font-black text-yellow-50 transition hover:border-yellow-200/60 hover:bg-yellow-400 hover:text-black sm:px-4"
            >
              <Icon size={16} />
              <span className="min-w-0 break-words">{actionLabel}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function PremiumInstagramLink({ copy, className = '' }) {
  return (
    <a
      href={INSTAGRAM_PROFILE_URL}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-600 px-5 py-3 font-black text-black shadow-lg shadow-yellow-500/25 ring-1 ring-yellow-100/50 transition hover:scale-[1.01] hover:shadow-yellow-400/40 ${className}`}
    >
      <Instagram size={18} />
      {copy.openInstagram}
      <ExternalLink size={16} />
    </a>
  );
}

function StartCenterSection({
  partner,
  copy,
  selectedLanguage,
  localOnboardingStepIds = [],
  onMarkOnboardingStep,
  onNavigate,
}) {
  const partnerCode = partner?.discountCode || DEFAULT_DISCOUNT_CODE;

  return (
    <section className="space-y-5">
      <Card className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] text-white backdrop-blur-xl">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-300">{copy.startCenterTitle}</p>
              <h3 className="mt-2 text-3xl font-black">{copy.startCenterHeadline}</h3>
              <p className="mt-2 max-w-2xl text-white/60">{copy.startCenterText}</p>
            </div>
            <div className="rounded-3xl border border-yellow-400/30 bg-yellow-400/10 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-yellow-200">Rabattcode</p>
              <p className="text-3xl font-black text-yellow-300">{partnerCode}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <GuidedAcademyOnboarding
        copy={copy}
        selectedLanguage={selectedLanguage}
        localCompletedStepIds={localOnboardingStepIds}
        onMarkStep={onMarkOnboardingStep}
        onNavigate={onNavigate}
      />
    </section>
  );
}

function GuidedAcademyOnboarding({ copy, selectedLanguage, localCompletedStepIds = [], onMarkStep, onNavigate }) {
  const t = useMemo(() => createI18nTranslator(selectedLanguage, copy), [copy, selectedLanguage]);
  const welcomeDone = localCompletedStepIds.includes('welcome-module');
  const tourDone = localCompletedStepIds.includes('academy-tour-video');
  const finished = localCompletedStepIds.includes('finish-onboarding');
  const markWelcome = () => onMarkStep?.('welcome-module');
  const markTour = () => onMarkStep?.('academy-tour-video');
  const finishOnboarding = () => {
    onMarkStep?.('welcome-module');
    onMarkStep?.('academy-tour-video');
    onMarkStep?.('finish-onboarding');
    onNavigate?.('dashboard');
  };
  const steps = [
    { id: 'welcome', label: t('uxStep1'), title: t('uxWelcomeVideoTitle'), done: welcomeDone, icon: PlayCircle },
    { id: 'tour', label: t('uxStep2'), title: t('uxAcademyTourTitle'), done: tourDone, icon: Video },
    { id: 'done', label: t('uxStep3'), title: t('uxOnboardingCompleteTitle'), done: finished, icon: Trophy },
  ];

  return (
    <section className="space-y-5">
      <Card className="overflow-hidden rounded-[2rem] border border-yellow-300/25 bg-gradient-to-br from-yellow-400/[0.14] via-white/[0.06] to-black/45 text-white shadow-2xl shadow-yellow-500/10 backdrop-blur-xl">
        <CardContent className="p-5 sm:p-6 md:p-8">
          <div className="grid gap-5 xl:grid-cols-[0.82fr_1.18fr]">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-200">{t('uxGuidedOnboardingTitle')}</p>
              <h3 className="mt-2 break-words text-3xl font-black text-yellow-50 sm:text-4xl">{t('uxWelcomeTitle')}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/62">{t('uxGuidedOnboardingText')}</p>
              <div className="mt-5 grid gap-2">
                {steps.map(({ id, label, title, done, icon: Icon }) => (
                  <div key={id} className={`flex items-center gap-3 rounded-2xl border px-3 py-3 ${done ? 'border-green-300/20 bg-green-400/10 text-green-100' : 'border-white/10 bg-black/25 text-white/62'}`}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-200 ring-1 ring-yellow-200/15">
                      {done ? <CheckCircle2 size={17} /> : <Icon size={17} />}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] opacity-70">{label}</p>
                      <p className="break-words text-sm font-black">{title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <StartOnboardingVideoCard
                copy={copy}
                video={startCenterOnboardingVideo}
                selectedLanguage={selectedLanguage}
                title={t('uxWelcomeVideoTitle')}
                description={t('uxWelcomeVideoText')}
                stepLabel={t('uxStep1')}
              />
              {!welcomeDone && (
                <Button type="button" onClick={markWelcome} className="min-h-12 w-full rounded-2xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300">
                  <CheckCircle2 size={16} /> {t('uxMarkWatched')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
        <Card className="rounded-[2rem] border border-yellow-300/20 bg-white/[0.055] text-white shadow-lg shadow-black/20 backdrop-blur-xl">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
                <Video size={22} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">{t('uxStep2')}</p>
                <h4 className="mt-2 break-words text-2xl font-black text-yellow-50">{t('uxAcademyTourTitle')}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{t('uxAcademyTourText')}</p>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm font-bold text-white/55">
                  {t('uxTourVideoPending')}
                </div>
                <Button type="button" onClick={markTour} className="mt-4 min-h-12 w-full rounded-2xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300 sm:w-auto">
                  <CheckCircle2 size={16} /> {tourDone ? t('done') : t('uxMarkWatched')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-green-300/20 bg-green-400/[0.08] text-white shadow-lg shadow-black/20 backdrop-blur-xl">
          <CardContent className="p-5 sm:p-6">
            <Trophy size={24} className="text-green-100" />
            <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-green-100">{t('uxStep3')}</p>
            <h4 className="mt-2 break-words text-2xl font-black text-green-50">{t('uxOnboardingCompleteTitle')}</h4>
            <p className="mt-2 text-sm leading-relaxed text-white/62">{t('uxOnboardingCompleteText')}</p>
            <Button type="button" onClick={finishOnboarding} className="mt-5 min-h-12 w-full rounded-2xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300">
              {finished ? t('uxContinueDashboard') : t('uxFinishOnboarding')} <ChevronRight size={16} />
            </Button>
          </CardContent>
        </Card>
      </section>
    </section>
  );
}

function StartOnboardingVideoCard({ copy, video, selectedLanguage, title, description, stepLabel }) {
  const t = useMemo(() => createI18nTranslator(selectedLanguage, copy), [copy, selectedLanguage]);
  const onboardingVideo = video || {
    id: STARTCENTER_ONBOARDING_VIDEO_ID,
    title: title || t('uxWelcomeVideoTitle'),
    description: description || t('uxWelcomeVideoText'),
    category: copy.startCenterTitle,
    moduleTitle: copy.startCenterTitle,
    uploadDate: '-',
    duration: '-',
    learningGoal: copy.startCenterHeadline,
  };
  const preferredCode = getVideoLanguageCode(selectedLanguage);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [manualLanguageCode, setManualLanguageCode] = useState('');
  const activeCode = manualLanguageCode || preferredCode;
  const { videoUrl, videoError } = useProtectedAcademyVideoUrl(video?.src);

  return (
    <Card className="overflow-hidden rounded-[2rem] border border-yellow-300/25 bg-gradient-to-br from-yellow-400/[0.14] via-white/[0.06] to-black/45 text-white shadow-2xl shadow-yellow-500/10 backdrop-blur-xl">
      <CardContent className="p-5 md:p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-200">{stepLabel || copy.startCenterTitle}</p>
            <h4 className="mt-2 text-2xl font-black text-yellow-50">{title || t('uxWelcomeVideoTitle')}</h4>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">{onboardingVideo.description}</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300/25 bg-yellow-400/10 px-4 py-2 text-xs font-black text-yellow-100">
            <PlayCircle size={15} /> {t('uxWatchWelcome')}
          </span>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-yellow-300/20 bg-black/65 shadow-inner">
          {video?.src && videoUrl ? (
            <video key={`${video.id}-${activeCode}-${subtitlesEnabled ? 'subtitles' : 'no-subtitles'}`} controls preload="metadata" className="aspect-video w-full bg-black object-contain">
              <source src={videoUrl} type="video/mp4" />
              {subtitlesEnabled && VIDEO_TRANSLATION_LANGUAGES.map((language) => (
                <track
                  key={language.code}
                  kind="subtitles"
                  src={getSubtitlePath(onboardingVideo.id, language.code)}
                  srcLang={language.code}
                  label={language.label}
                  default={language.code === activeCode}
                />
              ))}
            </video>
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center gap-3 text-center text-white/60">
              <Video size={44} className="text-yellow-300" />
              <p className="font-bold">{videoError || t('uxWelcomeVideoPending')}</p>
            </div>
          )}
        </div>
        <VideoTranslationPanel
          video={onboardingVideo}
          activeCode={activeCode}
          subtitlesEnabled={subtitlesEnabled}
          setSubtitlesEnabled={setSubtitlesEnabled}
          setManualLanguageCode={setManualLanguageCode}
        />
      </CardContent>
    </Card>
  );
}

function VideoTranslationPanel({ video, activeCode, subtitlesEnabled, setSubtitlesEnabled, setManualLanguageCode }) {
  const labels = getVideoTranslationLabels(activeCode);
  const activeLanguage = VIDEO_TRANSLATION_LANGUAGES.find((item) => item.code === activeCode) || VIDEO_TRANSLATION_LANGUAGES[0];
  const { transcriptData, transcriptState } = useVideoTranscript(video, activeCode);
  const hasRealTranscript = Boolean(transcriptData?.segments?.length);
  const captionLines = hasRealTranscript
    ? transcriptData.segments.map((line) => ({
      time: line.startLabel || `${line.start ?? ''}`,
      text: line.text,
    }))
    : buildVideoCaptionLines(video, activeCode);
  const activeTranscript = transcriptData?.transcript || captionLines.map((line) => `${line.time} ${line.text}`).join('\n');
  const activeSummary = transcriptData?.summary || getTranslatedVideoSummary(video, activeCode);
  const statusNotice = getTranscriptReadyNotice(activeCode, hasRealTranscript ? 'ready' : transcriptState === 'loading' ? 'loading' : 'fallback');

  return (
    <div className="mt-4 rounded-3xl border border-yellow-300/20 bg-black/35 p-4 shadow-inner shadow-yellow-500/5">
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-yellow-200">
            <Globe2 size={16} /> {labels.title}
          </p>
          <p className="mt-1 text-xs text-white/50">{labels.originalLanguage} · {statusNotice}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setSubtitlesEnabled((current) => !current)}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-xs font-black transition ${subtitlesEnabled ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'border border-white/10 bg-white/10 text-white hover:bg-white/15'}`}
          >
            <FileText size={15} /> {subtitlesEnabled ? labels.disableSubtitles : labels.enableSubtitles}
          </button>
          <label className="min-w-0">
            <span className="sr-only">{labels.language}</span>
            <select
              value={activeCode}
              onChange={(event) => setManualLanguageCode(event.target.value)}
              className="w-full rounded-2xl border border-yellow-300/25 bg-black/70 px-3 py-2 text-xs font-bold text-yellow-50 outline-none focus:border-yellow-300 sm:w-56"
            >
              {VIDEO_TRANSLATION_LANGUAGES.map((language) => (
                <option key={language.code} value={language.code} className="bg-black text-white">
                  {language.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {subtitlesEnabled && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/35 p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-yellow-200">{labels.captions}</p>
            <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-[11px] font-black text-yellow-100 ring-1 ring-yellow-200/20">
              {activeLanguage.short}
            </span>
            {transcriptData?.srtPath && (
              <a href={transcriptData.srtPath} target="_blank" rel="noreferrer" className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-white/70 ring-1 ring-white/10 hover:text-yellow-100">
                SRT
              </a>
            )}
          </div>
          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {captionLines.map((line) => (
              <p key={`${activeCode}-${line.time}`} className="flex min-w-0 gap-3 rounded-2xl bg-white/[0.06] px-3 py-2 text-sm text-white/72">
                <span className="shrink-0 font-mono text-xs font-black text-yellow-200">{line.time}</span>
                <span className="min-w-0 break-words">{line.text}</span>
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 grid min-w-0 gap-3 lg:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-yellow-300/15 bg-black/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-yellow-200">{labels.transcriptTranslated} · {activeLanguage.label}</p>
          <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-white/72">{activeTranscript}</p>
        </div>
        <div className="min-w-0 rounded-2xl border border-yellow-300/15 bg-yellow-400/[0.08] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-yellow-200">{labels.summaryTranslated} · {activeLanguage.label}</p>
          <p className="mt-2 break-words text-sm leading-relaxed text-white/72">{activeSummary}</p>
        </div>
      </div>

      <div className="mt-4 flex min-w-0 items-start gap-3 rounded-2xl border border-yellow-300/15 bg-black/25 p-3 text-xs text-white/60">
        <Mic size={17} className="mt-0.5 shrink-0 text-yellow-200" />
        <p className="min-w-0 break-words"><span className="font-black text-yellow-100">{labels.aiReady}:</span> {labels.aiHint}</p>
      </div>
    </div>
  );
}

function AcademyVideoCard({ video, moduleLabel, index, selectedLanguage, progress }) {
  const preferredCode = getVideoLanguageCode(selectedLanguage);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [manualLanguageCode, setManualLanguageCode] = useState('');
  const activeCode = manualLanguageCode || preferredCode;
  const ui = getVideoUiLabels(activeCode);
  const watched = Boolean(progress?.completedVideos?.[video.id]);
  const { videoUrl, videoError } = useProtectedAcademyVideoUrl(video.src);

  return (
    <article className="rounded-3xl border border-white/10 bg-black/25 p-5 transition hover:border-yellow-300/35 hover:bg-yellow-400/[0.06]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">{moduleLabel} · {ui.video} {index + 1}</p>
          <h4 className="mt-2 text-xl font-black text-yellow-50">{video.title}</h4>
          <p className="mt-2 text-sm font-semibold text-yellow-200">{video.category}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {video.required && (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-black">
              <Star size={13} /> {ui.required}
            </span>
          )}
          <span className={`rounded-full px-3 py-1 text-xs font-black ${watched ? 'bg-emerald-400 text-black' : 'border border-white/10 bg-white/10 text-white/75'}`}>
            {watched ? ui.watched : ui.notWatched}
          </span>
        </div>
      </div>

      {video.src && videoUrl && (
        <div className="mt-5 overflow-hidden rounded-3xl border border-yellow-300/15 bg-black/55">
          <video key={`${video.id}-${activeCode}-${subtitlesEnabled ? 'subtitles' : 'no-subtitles'}`} controls preload="metadata" className="aspect-video w-full bg-black object-contain">
            <source src={videoUrl} type="video/mp4" />
            {subtitlesEnabled && VIDEO_TRANSLATION_LANGUAGES.map((language) => (
              <track
                key={language.code}
                kind="subtitles"
                src={getSubtitlePath(video.id, language.code)}
                srcLang={language.code}
                label={language.label}
                default={language.code === activeCode}
              />
            ))}
          </video>
        </div>
      )}
      {video.src && !videoUrl && (
        <div className="mt-5 flex aspect-video flex-col items-center justify-center rounded-3xl border border-yellow-300/15 bg-black/55 p-5 text-center text-white/60">
          <Video size={42} className="mb-3 text-yellow-300" />
          <p className="font-bold text-yellow-50">{videoError || 'Video wird geschützt geladen.'}</p>
          <p className="mt-2 text-xs text-white/45">{video.fileName}</p>
        </div>
      )}
      {!video.src && (
        <div className="mt-5 flex aspect-video flex-col items-center justify-center rounded-3xl border border-yellow-300/15 bg-black/55 p-5 text-center text-white/60">
          <Video size={42} className="mb-3 text-yellow-300" />
          <p className="font-bold text-yellow-50">{ui.fileMissing || VIDEO_UI_LABELS.de.fileMissing}</p>
          <p className="mt-2 text-xs text-white/45">{video.fileName}</p>
        </div>
      )}

      <p className="mt-4 text-sm leading-relaxed text-white/65">{video.description}</p>

      <VideoTranslationPanel
        video={video}
        activeCode={activeCode}
        subtitlesEnabled={subtitlesEnabled}
        setSubtitlesEnabled={setSubtitlesEnabled}
        setManualLanguageCode={setManualLanguageCode}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Stat icon={CalendarDays} label={ui.uploadDate} value={video.uploadDate || '-'} />
        <Stat icon={Clock} label={ui.duration} value={video.duration || '-'} />
        <Stat icon={CheckCircle2} label={ui.progress} value={watched ? ui.watched : ui.notWatched} />
      </div>

      <div className="mt-4 rounded-2xl border border-yellow-300/15 bg-yellow-400/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-200">{ui.learningGoal}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/75">{video.learningGoal}</p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-200">{ui.comments}</p>
          <div className="mt-3 space-y-2">
            {(video.comments || [ui.noComments]).map((comment) => (
              <p key={comment} className="rounded-2xl bg-white/[0.06] px-3 py-2 text-sm text-white/65">{comment}</p>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-200">{ui.qa}</p>
          <div className="mt-3 space-y-3">
            {(video.qa || []).map((item) => (
              <div key={item.question} className="rounded-2xl bg-white/[0.06] px-3 py-2">
                <p className="text-sm font-bold text-yellow-50">{item.question}</p>
                <p className="mt-1 text-sm text-white/60">{item.answer}</p>
              </div>
            ))}
            {(!video.qa || video.qa.length === 0) && <p className="text-sm text-white/55">{ui.noQuestions}</p>}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        {videoUrl && (
          <a href={videoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/15">
            {ui.openVideo} <ExternalLink size={16} />
          </a>
        )}
        <p className="text-xs leading-relaxed text-white/45">
          Fortschritt wird in Phase 5A ausschließlich angezeigt und nicht im Partnerkonto gespeichert.
        </p>
      </div>
    </article>
  );
}

function TestLabSection({ copy, content, selectedLanguage, partner }) {
  const [query, setQuery] = useState('');
  const categories = content?.testLabCategories || testLabCategories;
  const allVideos = categories.flatMap((category) => category.videos.map((video) => ({ ...video, categoryTitle: category.title })));
  const preparedVideos = allVideos.filter((video) => video.src && !video.placeholder).length;
  const requiredVideos = allVideos.filter((video) => video.required).length;
  const totalVideos = allVideos.length;
  const testLabProgress = getAcademyModuleProgress(partner?.academyProgress, TESTLAB_MODULE_ID);
  const overallProgress = testLabProgress?.percent || 0;
  const normalizedQuery = query.trim().toLowerCase();
  const filteredCategories = categories
    .map((category) => ({
      ...category,
      videos: category.videos.filter((video) => {
        const haystack = academyVideoSearchText(video, category.title);
        return !normalizedQuery || haystack.includes(normalizedQuery);
      }),
    }))
    .filter((category) => category.videos.length > 0);

  return (
    <section className="space-y-5">
      <Card className="overflow-hidden rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-yellow-400/[0.08] text-white shadow-2xl shadow-yellow-500/10 backdrop-blur-xl">
        <CardContent className="p-6 md:p-8">
          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-yellow-300">{copy.testLabModuleTitle}</p>
              <h3 className="mt-3 text-3xl font-black md:text-5xl">{copy.testLabTitle}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65 md:text-base">{copy.testLabIntro}</p>
            </div>
            <div className="rounded-3xl border border-yellow-300/20 bg-black/30 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-yellow-200">{copy.testLabProgress}</p>
                  <p className="mt-1 text-3xl font-black text-yellow-50">{overallProgress}%</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-400/15 text-yellow-100 ring-1 ring-yellow-200/30">
                  <Search size={22} />
                </span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-200" style={{ width: `${overallProgress}%` }} />
              </div>
              <p className="mt-3 text-xs text-white/55">{preparedVideos} / {totalVideos} {copy.testLabPrepared} · {requiredVideos} {copy.testLabRequired}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-[2rem] border border-white/10 bg-black/25 p-4">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-yellow-200">{copy.testLabSearch}</span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-white">
            <Search size={18} className="shrink-0 text-yellow-200" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={copy.testLabSearchPlaceholder}
              className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
            />
          </div>
        </label>
      </div>

      {filteredCategories.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-black/25 p-6 text-white/60">{copy.testLabNoResults}</div>
      )}

      <div className="space-y-5">
        {filteredCategories.map((category) => {
          const categoryCompleted = category.videos.filter((video) => partner?.academyProgress?.completedVideos?.[video.id]).length;
          const categoryProgress = Math.round((categoryCompleted / Math.max(category.videos.length, 1)) * 100);

          return (
            <Panel key={category.id} title={category.title} icon={Video}>
              <div className="mb-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-yellow-300" style={{ width: `${categoryProgress}%` }} />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                {category.videos.map((video, index) => (
                  <AcademyVideoCard
                    key={video.id || video.title}
                    video={video}
                    moduleLabel={`${copy.module} ${video.moduleId || 4}`}
                    index={index}
                    selectedLanguage={selectedLanguage}
                    progress={partner?.academyProgress}
                  />
                ))}
              </div>
            </Panel>
          );
        })}
      </div>
    </section>
  );
}

function HelpfulLinksSection({ partner, copy }) {
  const partnerCode = partner?.discountCode || DEFAULT_DISCOUNT_CODE;

  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-yellow-300/20 bg-yellow-400/10 p-5 text-sm leading-relaxed text-yellow-50">
        {copy.academyScopeNotice}
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {helpfulLinks.map((link) => {
          const Icon = link.icon;

          return (
            <Panel key={link.titleKey} title={copy[link.titleKey]} icon={Icon}>
              <p className="text-white/60">{copy[link.textKey]}</p>
              <a href={withPartnerCode(link.href, partnerCode)} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 font-bold text-black hover:bg-yellow-300">
                {copy[link.buttonKey]} <ExternalLink size={17} />
              </a>
            </Panel>
          );
        })}
      </div>
      <BookingCtaBand copy={copy} compact />
    </section>
  );
}

function LeonidContactSection({ copy }) {
  return (
    <section className="space-y-5">
      <LeonidContactCallout copy={copy} />
    </section>
  );
}

function LeonidContactCallout({ copy }) {
  return (
    <Card className="overflow-hidden rounded-[2rem] border border-yellow-300/25 bg-gradient-to-br from-yellow-400/[0.16] via-white/[0.06] to-black/40 text-white shadow-xl shadow-yellow-500/10 backdrop-blur-xl">
      <CardContent className="relative p-6 md:p-7">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-200/80 to-transparent" />
        <div className="grid gap-6 xl:grid-cols-[1fr_1.35fr] xl:items-center">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/15 text-yellow-100 ring-1 ring-yellow-200/35">
              <MessageCircle size={22} />
            </span>
            <div>
              <h3 className="text-2xl font-black">{copy.contactTitle}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">{copy.personalSupport}</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <ContactChannel
              icon={MessageCircle}
              title="WhatsApp"
              text={copy.whatsappDescription}
              button={copy.openWhatsapp}
              href={WHATSAPP_CONTACT_URL}
              accent="from-emerald-300/25 to-yellow-400/10"
            />
            <ContactChannel
              icon={Send}
              title="Telegram"
              text={copy.telegramDescription}
              button={copy.openTelegram}
              href={TELEGRAM_CONTACT_URL}
              accent="from-sky-300/25 to-yellow-400/10"
            />
            <ContactMiniLink icon={Mail} label={copy.contactEmail} value={LEONID_EMAIL} href={`mailto:${LEONID_EMAIL}`} />
            <ContactMiniLink icon={Phone} label={copy.contactPhone} value={LEONID_PHONE} href="tel:+4915227370000" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ContactChannel({ icon: Icon, title, text, button, href, accent }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-gradient-to-br ${accent} p-4 shadow-lg shadow-black/20`}>
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-black/25 text-yellow-200">
          <Icon size={20} />
        </span>
        <div className="min-w-0">
          <h4 className="font-black text-yellow-50">{title}</h4>
          <p className="mt-1 text-sm text-white/60">{text}</p>
        </div>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-black text-black shadow-lg shadow-yellow-500/20 transition hover:bg-yellow-300 hover:shadow-yellow-400/35"
      >
        {button} <ExternalLink size={16} />
      </a>
    </div>
  );
}

function ContactMiniLink({ icon: Icon, label, value, href }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-3xl border border-white/10 bg-black/25 p-4 text-white transition hover:border-yellow-300/30 hover:bg-yellow-400/10"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-200 ring-1 ring-yellow-200/20">
        <Icon size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-white/40">{label}</span>
        <span className="block truncate text-sm font-bold text-yellow-50">{value}</span>
      </span>
    </a>
  );
}

function AcademyDocumentCard({ documentItem, compact = false }) {
  const [message, setMessage] = useState('');
  const isPublic = documentItem.visibility === 'public';
  const hasFile = Boolean(documentItem.fileName || documentItem.href);
  const itemType = documentItem.type || 'pdf';
  const actionLabel = itemType === 'external'
    ? 'Extern öffnen'
    : itemType === 'video'
      ? 'Video öffnen'
      : ['docx', 'xlsx', 'pptx'].includes(itemType)
        ? 'Datei herunterladen'
        : 'PDF öffnen / Download';

  const handleOpen = async () => {
    setMessage('');

    try {
      await openAcademyDocument(documentItem);
    } catch (error) {
      setMessage(error.message || 'Dokument konnte nicht geöffnet werden.');
    }
  };

  return (
    <div className="min-w-0 rounded-3xl border border-white/10 bg-black/25 p-4">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="break-words font-black text-yellow-50">{documentItem.title}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/35">{documentItem.area || documentItem.category}</p>
        </div>
        <span className={`inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ${isPublic ? 'bg-green-400/15 text-green-100 ring-1 ring-green-200/25' : 'bg-yellow-400/15 text-yellow-100 ring-1 ring-yellow-200/25'}`}>
          {isPublic ? 'Öffentlich' : 'Partner intern'}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/60">{documentItem.description}</p>

      {isPublic && itemType === 'pdf' && documentItem.href && !compact && (
        <iframe
          title={`${documentItem.title} Vorschau`}
          src={documentItem.href}
          className="mt-4 h-52 w-full rounded-2xl border border-white/10 bg-black"
          loading="lazy"
        />
      )}

      {documentItem.fileName && <p className="mt-3 break-all text-xs text-white/35">{documentItem.fileName}</p>}
      {message && <p className="mt-3 rounded-2xl border border-red-300/20 bg-red-400/10 px-3 py-2 text-xs text-red-100">{message}</p>}

      <Button disabled={!hasFile} onClick={handleOpen} className="mt-4 w-full rounded-2xl bg-yellow-400 py-3 text-sm font-black text-black hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50">
        <Download size={15} /> {hasFile ? actionLabel : 'In Vorbereitung'}
      </Button>
    </div>
  );
}

function ResourcesSection({ selectedLanguage }) {
  return (
    <AcademyDownloadCenter
      language={selectedLanguage}
      onOpen={openAcademyDocument}
    />
  );
}

function ModuleDetailContent({ activeModule, selectedLanguage }) {
  if (!activeModule) {
    return null;
  }

  if (activeModule.id === 2) {
    return (
      <Panel title="Aqua Global Grundlagen" icon={BookOpen}>
        <div className="grid gap-4 xl:grid-cols-[1fr_1.25fr]">
          <div className="rounded-3xl border border-yellow-300/15 bg-yellow-400/10 p-5">
            <h4 className="text-xl font-black text-yellow-50">Lernziele</h4>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/70">
              <li>Warum Wasserqualität im Kundengespräch wichtig ist.</li>
              <li>Leitungswasser, Flaschenwasser und Osmosewasser sauber einordnen.</li>
              <li>Umkehrosmose und Membranfiltration verständlich erklären.</li>
              <li>Produktkatalog „Your World“ professionell nutzen.</li>
            </ul>
          </div>
          <div className="grid gap-3">
            {getDocumentsForModule(2).map((documentItem) => (
              <AcademyDocumentCard key={documentItem.id} documentItem={documentItem} compact />
            ))}
          </div>
        </div>
      </Panel>
    );
  }

  if (activeModule.id === 3) {
    return <ProductAcademyPanel />;
  }

  if (activeModule.id === 5) {
    return <PriceProvisionPanel />;
  }

  if (activeModule.id === 4) {
    return <CareerPlanTrainingPanel />;
  }

  if (activeModule.id === 7) {
    return <RxtTrainingPanel />;
  }

  if (activeModule.id === 8) {
    return (
      <AcademyDownloadCenter
        language={selectedLanguage}
        context="module"
        onOpen={openAcademyDocument}
      />
    );
  }

  if (activeModule.id === 11) {
    return <QuizCertificationPanel selectedLanguage={selectedLanguage} />;
  }

  return (
    <Panel title={`${activeModule.title} · Lernbereich`} icon={activeModule.icon || BookOpen}>
      <p className="text-sm leading-relaxed text-white/60">
        Dieses Modul ist in die neue Academy-Struktur eingeordnet. Videos, Downloads, Aufgaben und Fortschritt werden modulbezogen angezeigt und können später durch Quizfragen erweitert werden.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Stat icon={BookOpen} label="Lektionen" value={activeModule.lessons} />
        <Stat icon={CheckCircle2} label="Fortschritt" value="Nur Lesen" />
        <Stat icon={Globe2} label="Sprachen" value={activeModule.lang.join('/')} />
      </div>
    </Panel>
  );
}

function ProductAcademyPanel() {
  return (
    <Panel title="Produkte · Schulungsübersicht" icon={ShieldCheck}>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {academyProducts.map((product) => {
          const priceDoc = getDocumentById(product.priceDoc);
          const partnerDoc = getDocumentById(product.partnerDoc);

          return (
            <div key={product.name} className="min-w-0 rounded-3xl border border-white/10 bg-black/25 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-yellow-200">{product.group}</p>
              <h4 className="mt-2 break-words text-xl font-black text-yellow-50">{product.name}</h4>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{product.description}</p>
              <div className="mt-4 space-y-2">
                {product.specs.map((spec) => (
                  <span key={spec} className="mr-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">{spec}</span>
                ))}
              </div>
              <div className="mt-4 grid gap-2 text-xs text-white/60">
                <p>Preisinfo: {priceDoc?.title || 'siehe Produktdokument'}</p>
                <p>Partnerprovision: {partnerDoc?.title || 'intern vorbereitet'}</p>
                <p className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">Schulungsvideo: Aufnahme vorbereitet</p>
              </div>
              <div className="mt-4 grid gap-2">
                {priceDoc && <Button onClick={() => openAcademyDocument(priceDoc)} className="rounded-2xl bg-white/10 py-2 text-sm hover:bg-white/15"><Download size={15} /> Preisinfo öffnen</Button>}
                {partnerDoc && <Button onClick={() => openAcademyDocument(partnerDoc)} className="rounded-2xl bg-yellow-400 py-2 text-sm font-black text-black hover:bg-yellow-300"><Lock size={15} /> Partnerinfo öffnen</Button>}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function PriceProvisionPanel() {
  return (
    <Panel title="Preise & Provisionen" icon={FileText}>
      <div className="rounded-3xl border border-red-300/25 bg-red-400/10 p-4 text-sm font-bold text-red-100">
        Interne Partnerinformationen – nicht öffentlich posten.
      </div>
      <div className="mt-5 overflow-x-auto rounded-3xl border border-white/10">
        <table className="min-w-[760px] w-full text-left text-sm">
          <thead className="bg-yellow-400/10 text-yellow-100">
            <tr>
              <th className="p-4">Bereich</th>
              <th className="p-4">Inhalt</th>
              <th className="p-4">Sichtbarkeit</th>
              <th className="p-4">Dokument</th>
            </tr>
          </thead>
          <tbody>
            {priceProvisionRows.map((row) => {
              const documentItem = getDocumentById(row.documentId);
              return (
                <tr key={row.title} className="border-t border-white/10">
                  <td className="p-4 font-black text-yellow-50">{row.title}</td>
                  <td className="p-4 text-white/60">{row.description}</td>
                  <td className="p-4">{row.partnerOnly ? 'Partner intern' : 'Kundeninformation'}</td>
                  <td className="p-4">
                    {documentItem && (
                      <Button onClick={() => openAcademyDocument(documentItem)} className="rounded-2xl bg-yellow-400 px-3 py-2 text-xs font-black text-black hover:bg-yellow-300">
                        Öffnen
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function CareerPlanTrainingPanel() {
  const example = calculateAquaCareer(3492.75);

  return (
    <Panel title="Karriereplan · Level & Punkte" icon={Trophy}>
      <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        <div className="space-y-3">
          {aquaGlobalLevels.map((level) => (
            <div key={level.name} className="flex min-w-0 flex-col gap-2 rounded-2xl border border-white/10 bg-black/25 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-black text-yellow-50">{level.name}</p>
              <p className="text-sm text-white/60">{formatPoints(level.min)}–{formatPoints(level.max)} Punkte</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-yellow-300/20 bg-yellow-400/10 p-5">
          <h4 className="text-xl font-black text-yellow-50">Beispielrechnung</h4>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Stat icon={Star} label="Punkte" value={formatPoints(example.points)} />
            <Stat icon={Trophy} label="Aktuelles Level" value={example.level} />
            <Stat icon={ChevronRight} label="Ziel" value={example.nextLevel || 'Max'} />
            <Stat icon={Flame} label="Fehlend" value={`${formatPoints(example.pointsToNextLevel)} Punkte`} />
          </div>
          <div className="mt-5 h-4 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-yellow-700 via-yellow-300 to-yellow-100" style={{ width: `${example.progress}%` }} />
          </div>
          <p className="mt-3 text-sm text-white/60">Partnerpunkte können manuell oder per Backoffice-Screenshot im Profil aktualisiert werden.</p>
        </div>
      </div>
    </Panel>
  );
}

function RxtTrainingPanel() {
  const rxtDocument = getDocumentById('rxt-praesentation');

  return (
    <Panel title="RXT Entkalkung" icon={Flame}>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-yellow-300/15 bg-yellow-400/10 p-5">
          <h4 className="text-xl font-black text-yellow-50">Schulungsschwerpunkte</h4>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-white/70">
            <li>RXT-79 und RXT-82 korrekt einordnen.</li>
            <li>Entkalkung einfach und sachlich erklären.</li>
            <li>Kundenfragen technisch sauber beantworten.</li>
            <li>Schulungsvideo-Slot für spätere Aufnahmen vorbereitet.</li>
          </ul>
        </div>
        {rxtDocument && <AcademyDocumentCard documentItem={rxtDocument} />}
      </div>
    </Panel>
  );
}

function QuizCertificationPanel({ selectedLanguage }) {
  const languageCode = getAcademyLanguageCode(selectedLanguage);
  const academyQuizQuestions = getAcademyQuizQuestions(languageCode);
  const quizLabels = {
    de: {
      intro: 'Beantworte die Fragen zu den Academy-Modulen. Die Auswertung erfolgt nur in dieser Browsersitzung und wird nicht im Partnerkonto gespeichert.',
      questions: 'Fragen',
      answered: 'Beantwortet',
      score: 'Punkte',
      status: 'Status',
      open: 'Offen',
      failed: 'Nicht bestanden',
      passed: 'Bestanden',
      review: 'Auswerten',
      reset: 'Neu starten',
      resultTitle: 'Quiz lokal bestanden',
      resultText: 'Das Ergebnis wurde nicht an den Server übertragen und nicht dauerhaft gespeichert.',
      failedTitle: 'Quiz noch nicht bestanden',
      failedText: 'Für das Bestehen sind mindestens 70 % erforderlich. Prüfe die markierten Antworten und starte anschließend einen neuen Versuch.',
      passThreshold: 'Bestehensgrenze: 70 %',
      incomplete: 'Bitte beantworte zuerst alle Fragen.',
    },
    en: {
      intro: 'Answer the Academy questions. The result is calculated only in this browser session and is not stored in the partner account.',
      questions: 'Questions',
      answered: 'Answered',
      score: 'Score',
      status: 'Status',
      open: 'Open',
      failed: 'Not passed',
      passed: 'Passed',
      review: 'Check result',
      reset: 'Start again',
      resultTitle: 'Quiz passed locally',
      resultText: 'The result was not sent to the server or stored permanently.',
      failedTitle: 'Quiz not passed yet',
      failedText: 'At least 70% is required to pass. Review the marked answers and then start a new attempt.',
      passThreshold: 'Pass threshold: 70%',
      incomplete: 'Please answer all questions first.',
    },
    ru: {
      intro: 'Ответьте на вопросы Academy. Результат рассчитывается только в текущем сеансе браузера и не сохраняется в аккаунте партнёра.',
      questions: 'Вопросы',
      answered: 'Отвечено',
      score: 'Результат',
      status: 'Статус',
      open: 'Открыто',
      failed: 'Не пройдено',
      passed: 'Пройдено',
      review: 'Проверить',
      reset: 'Начать заново',
      resultTitle: 'Тест пройден локально',
      resultText: 'Результат не отправлялся на сервер и не сохранялся постоянно.',
      failedTitle: 'Тест пока не пройден',
      failedText: 'Для прохождения необходимо не менее 70%. Проверьте отмеченные ответы и начните новую попытку.',
      passThreshold: 'Проходной балл: 70%',
      incomplete: 'Сначала ответьте на все вопросы.',
    },
    ro: {
      intro: 'Răspunde la întrebările Academiei. Rezultatul este calculat doar în această sesiune de browser și nu este salvat în contul partenerului.',
      questions: 'Întrebări',
      answered: 'Răspunsuri',
      score: 'Punctaj',
      status: 'Stare',
      open: 'Deschis',
      failed: 'Nepromovat',
      passed: 'Promovat',
      review: 'Verifică rezultatul',
      reset: 'Începe din nou',
      resultTitle: 'Quiz promovat local',
      resultText: 'Rezultatul nu a fost trimis la server și nu a fost salvat permanent.',
      failedTitle: 'Quizul nu este încă promovat',
      failedText: 'Pentru promovare sunt necesare minimum 70%. Verifică răspunsurile marcate și începe apoi o nouă încercare.',
      passThreshold: 'Prag de promovare: 70%',
      incomplete: 'Răspunde mai întâi la toate întrebările.',
    },
  }[languageCode];
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [quizMessage, setQuizMessage] = useState('');
  const answeredCount = academyQuizQuestions.filter((question) => answers[question.id] !== undefined).length;
  const correctCount = academyQuizQuestions.filter((question) => Number(answers[question.id]) === question.correct).length;
  const score = Math.round((correctCount / Math.max(academyQuizQuestions.length, 1)) * 100);
  const passed = submitted && answeredCount === academyQuizQuestions.length && score >= 70;
  const failed = submitted && answeredCount === academyQuizQuestions.length && score < 70;
  const progress = Math.round((answeredCount / Math.max(academyQuizQuestions.length, 1)) * 100);
  const statusLabel = passed ? quizLabels.passed : failed ? quizLabels.failed : quizLabels.open;

  const answerQuestion = (questionId, optionIndex) => {
    setAnswers((current) => ({ ...current, [questionId]: optionIndex }));
    setSubmitted(false);
    setQuizMessage('');
  };

  const submitQuiz = () => {
    if (answeredCount !== academyQuizQuestions.length) {
      setQuizMessage(quizLabels.incomplete);
      return;
    }

    setSubmitted(true);
    setQuizMessage('');
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    setQuizMessage('');
  };

  return (
    <Panel title="Zertifizierung / Quiz" icon={FileQuestion}>
      <p className="text-sm leading-relaxed text-white/60">
        {quizLabels.intro}
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <Stat icon={FileQuestion} label={quizLabels.questions} value={academyQuizQuestions.length} />
        <Stat icon={CheckCircle2} label={quizLabels.answered} value={`${answeredCount}/${academyQuizQuestions.length}`} />
        <Stat icon={Trophy} label={quizLabels.score} value={submitted ? `${score}%` : '–'} />
        <Stat icon={ShieldCheck} label={quizLabels.status} value={statusLabel} />
      </div>
      <p className="mt-4 text-xs font-bold text-white/50">{quizLabels.passThreshold}</p>
      <div
        className="mt-2 h-3 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-label={quizLabels.answered}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div className="h-full rounded-full bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-100" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-5 space-y-4">
        {academyQuizQuestions.map((question, index) => (
          <div key={question.id} className="rounded-3xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-yellow-200">Modul {question.moduleId} · Frage {index + 1}</p>
            <h4 className="mt-2 break-words text-lg font-black text-yellow-50">{question.question}</h4>
            <div className="mt-4 grid gap-2">
              {question.options.map((option, optionIndex) => {
                const selected = Number(answers[question.id]) === optionIndex;
                const correct = question.correct === optionIndex;
                const showCorrect = submitted && correct;
                const showIncorrect = submitted && selected && !correct;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => answerQuestion(question.id, optionIndex)}
                    aria-pressed={selected}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                      showCorrect
                        ? 'border-emerald-300/60 bg-emerald-400/15 text-emerald-100'
                        : showIncorrect
                          ? 'border-red-300/60 bg-red-400/15 text-red-100'
                          : selected
                            ? 'border-yellow-300/60 bg-yellow-400/15 text-yellow-50'
                            : 'border-white/10 bg-white/[0.04] text-white/70 hover:border-yellow-300/35 hover:text-yellow-100'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Button type="button" onClick={submitQuiz} className="rounded-2xl bg-yellow-400 px-5 py-3 font-black text-black hover:bg-yellow-300">
          <CheckCircle2 size={16} /> {quizLabels.review}
        </Button>
        <Button type="button" onClick={resetQuiz} className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15">
          {quizLabels.reset}
        </Button>
      </div>
      {quizMessage && <p className="mt-3 text-sm font-bold text-yellow-100" role="alert">{quizMessage}</p>}
      {passed && (
        <div className="mt-5 rounded-3xl border border-yellow-300/25 bg-yellow-400/15 p-5 text-center" aria-live="polite">
          <Trophy className="mx-auto text-yellow-200" size={42} />
          <h4 className="mt-3 text-2xl font-black text-yellow-50">{quizLabels.resultTitle}</h4>
          <p className="mt-2 text-sm text-white/65">{quizLabels.resultText}</p>
        </div>
      )}
      {failed && (
        <div className="mt-5 rounded-3xl border border-red-300/25 bg-red-400/10 p-5 text-center" aria-live="polite">
          <FileQuestion className="mx-auto text-red-200" size={42} />
          <h4 className="mt-3 text-2xl font-black text-red-50">{quizLabels.failedTitle}</h4>
          <p className="mt-2 text-lg font-black text-red-100">{score}%</p>
          <p className="mt-2 text-sm text-white/65">{quizLabels.failedText}</p>
        </div>
      )}
    </Panel>
  );
}

const ACADEMY_MODULE_UI_LABELS = {
  de: {
    lesson: 'Lektion',
    open: 'Offen',
    inProgress: 'In Bearbeitung',
    completed: 'Abgeschlossen',
    nextStep: 'Nächster Schritt',
    openLesson: 'Lektion öffnen',
    noMeasuredProgress: 'Noch kein messbarer Videoabschluss',
    readOnly: 'Fortschritt wird nur angezeigt und nicht gespeichert.',
    plannedVideo: 'Dieses Video ist vorbereitet, aber noch nicht veröffentlicht.',
    missingDocument: 'Das Dokument ist derzeit nicht verfügbar.',
  },
  en: {
    lesson: 'lesson',
    open: 'Open',
    inProgress: 'In progress',
    completed: 'Completed',
    nextStep: 'Next step',
    openLesson: 'Open lesson',
    noMeasuredProgress: 'No measurable video completion yet',
    readOnly: 'Progress is displayed only and is not stored.',
    plannedVideo: 'This video is prepared but not published yet.',
    missingDocument: 'The document is currently unavailable.',
  },
  ru: {
    lesson: 'урок',
    open: 'Открыто',
    inProgress: 'В процессе',
    completed: 'Завершено',
    nextStep: 'Следующий шаг',
    openLesson: 'Открыть урок',
    noMeasuredProgress: 'Пока нет измеримого завершения видео',
    readOnly: 'Прогресс только отображается и не сохраняется.',
    plannedVideo: 'Видео подготовлено, но ещё не опубликовано.',
    missingDocument: 'Документ сейчас недоступен.',
  },
  ro: {
    lesson: 'lecție',
    open: 'Deschis',
    inProgress: 'În lucru',
    completed: 'Finalizat',
    nextStep: 'Pasul următor',
    openLesson: 'Deschide lecția',
    noMeasuredProgress: 'Nu există încă un videoclip finalizat măsurabil',
    readOnly: 'Progresul este doar afișat și nu este salvat.',
    plannedVideo: 'Videoclipul este pregătit, dar nu este încă publicat.',
    missingDocument: 'Documentul nu este disponibil momentan.',
  },
};

function getAcademyModuleStatus(moduleProgress, labels) {
  if (!moduleProgress || moduleProgress.completed === 0) {
    return { id: 'open', label: labels.open, className: 'bg-white/10 text-white/65 ring-white/10' };
  }

  if (moduleProgress.completed >= moduleProgress.total) {
    return { id: 'completed', label: labels.completed, className: 'bg-emerald-400/15 text-emerald-100 ring-emerald-200/25' };
  }

  return { id: 'in-progress', label: labels.inProgress, className: 'bg-yellow-400/15 text-yellow-100 ring-yellow-200/25' };
}

function AcademyLessonContent({
  activeModule,
  lesson,
  selectedLanguage,
  partner,
  copy,
  labels,
}) {
  if (!lesson) {
    return null;
  }

  if (lesson.type === 'video') {
    const sourceVideo = academyVideos.find((video) => video.id === lesson.resourceId);

    if (!sourceVideo) {
      return (
        <div className="rounded-[1.75rem] border border-white/10 bg-black/25 p-6 text-white/60">
          {labels.plannedVideo}
        </div>
      );
    }

    const localizedVideo = {
      ...sourceVideo,
      title: lesson.title || sourceVideo.title,
      description: lesson.description || sourceVideo.description,
      learningGoal: lesson.learningGoal || sourceVideo.learningGoal,
    };
    const videoIndex = Math.max(0, activeModule.resources.videos.indexOf(lesson.resourceId));

    return (
      <AcademyVideoCard
        video={localizedVideo}
        moduleLabel={`${copy.module} ${activeModule.id}`}
        index={videoIndex}
        selectedLanguage={selectedLanguage}
        progress={partner?.academyProgress}
      />
    );
  }

  if (lesson.type === 'video-placeholder') {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-[1.75rem] border border-yellow-300/20 bg-yellow-400/[0.08] p-6 text-center">
        <Video size={46} className="text-yellow-200" />
        <h4 className="mt-4 text-xl font-black text-yellow-50">{lesson.title}</h4>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">{lesson.description || labels.plannedVideo}</p>
      </div>
    );
  }

  if (lesson.type === 'pdf') {
    const documentItem = getDocumentById(lesson.resourceId);

    return documentItem
      ? <AcademyDocumentCard documentItem={documentItem} />
      : <div className="rounded-[1.75rem] border border-white/10 bg-black/25 p-6 text-white/60">{labels.missingDocument}</div>;
  }

  if (lesson.type === 'quiz') {
    return <QuizCertificationPanel selectedLanguage={selectedLanguage} />;
  }

  return <ModuleDetailContent activeModule={activeModule} selectedLanguage={selectedLanguage} />;
}

function AcademyModuleStatusBadge({ status }) {
  const tones = {
    completed: 'bg-emerald-400 text-black ring-emerald-200/40',
    'in-progress': 'bg-yellow-400 text-black ring-yellow-100/50',
    open: 'bg-white/10 text-white/70 ring-white/15',
  };

  return (
    <span className={`inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] ring-1 ${tones[status.status] || tones.open}`}>
      {status.label}
    </span>
  );
}

function AcademyProgressRing({ value, label = 'Fortschritt', caption = '', compact = false }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  const sizeClass = compact ? 'h-24 w-24' : 'h-32 w-32 sm:h-36 sm:w-36';
  const innerClass = compact ? 'h-16 w-16' : 'h-24 w-24 sm:h-28 sm:w-28';

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={`${sizeClass} rounded-full p-2 shadow-2xl shadow-yellow-500/15 ring-1 ring-yellow-200/20`}
        style={{ background: `conic-gradient(#facc15 ${safeValue * 3.6}deg, rgba(255,255,255,0.12) 0deg)` }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
        aria-label={label}
      >
        <div className={`flex ${innerClass} items-center justify-center rounded-full border border-yellow-300/20 bg-black/85 text-center`}>
          <span className={`${compact ? 'text-2xl' : 'text-3xl'} font-black text-yellow-50`}>{safeValue}%</span>
        </div>
      </div>
      <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-yellow-200">{label}</p>
      {caption && <p className="mt-1 max-w-40 text-xs leading-relaxed text-white/45">{caption}</p>}
    </div>
  );
}

function getAcademyModuleDifficulty(moduleItem) {
  const minutes = parseInt(moduleItem.duration, 10) || 0;

  if (moduleItem.category === 'Onboarding') {
    return 'Einsteiger';
  }

  if (moduleItem.category === 'Business' || minutes >= 30) {
    return 'Fortgeschritten';
  }

  return 'Grundlagen';
}

function getAcademyStatusMessage(progress) {
  if (progress >= 100) {
    return 'Stark. Deine Academy-Grundlage steht – jetzt kannst du mit Vertiefung und Teamaufbau weitergehen.';
  }

  if (progress >= 70) {
    return 'Du bist kurz vor dem Ziel. Ein paar fokussierte Einheiten, dann ist dein Launch-Fundament komplett.';
  }

  if (progress >= 35) {
    return 'Du hast Momentum aufgebaut. Bleib im Rhythmus und schließe heute den nächsten kleinen Schritt ab.';
  }

  return 'Guter Start. Nimm dir ein Modul, eine Aufgabe und einen klaren nächsten Schritt – mehr braucht es heute nicht.';
}

function AcademyStartHero({ partner, academySummary, profileHints, onOpenModule }) {
  const nextModule = academySummary.nextModule;
  const lastWorkedModule = academySummary.modules.find((moduleItem) => moduleItem.progress.status === 'in-progress')
    || [...academySummary.modules].reverse().find((moduleItem) => moduleItem.progress.status === 'completed')
    || nextModule;
  const completedModules = academySummary.modules.filter((moduleItem) => moduleItem.progress.status === 'completed');
  const nextLesson = nextModule?.steps?.[0] || nextModule?.task || 'Starte mit der nächsten kurzen Einheit.';

  return (
    <Card className="overflow-hidden rounded-[2.25rem] border border-yellow-300/25 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.22),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.035),rgba(0,0,0,0.42))] text-white shadow-2xl shadow-yellow-500/10 backdrop-blur-xl">
      <CardContent className="p-5 sm:p-7 md:p-9">
        <div className="grid gap-7 xl:grid-cols-[1fr_0.42fr]">
          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-yellow-300/25 bg-yellow-400/12 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-yellow-100">
                Premium Learning
              </span>
              <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-bold text-white/62">
                {academySummary.completedCount}/{academySummary.totalCount} Module abgeschlossen
              </span>
            </div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-yellow-200">Willkommen zurück, {partner?.firstName || 'Partner'}</p>
            <h3 className="mt-3 max-w-4xl break-words text-4xl font-black leading-tight text-yellow-50 md:text-5xl">
              Deine Academy-Startseite
            </h3>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/66">
              Arbeite fokussiert weiter: ein Modul, eine Aufgabe, ein klarer nächster Schritt. Die Academy begleitet dich vom Einstieg bis zur ersten souveränen Präsentation.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-white/42">Zuletzt bearbeitet</p>
                <p className="mt-2 break-words text-lg font-black text-yellow-50">{lastWorkedModule?.title || 'Noch kein Modul'}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-white/42">Nächste Lektion</p>
                <p className="mt-2 break-words text-sm font-bold leading-relaxed text-yellow-50">{nextLesson}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-white/42">Status</p>
                <p className="mt-2 break-words text-sm font-bold leading-relaxed text-yellow-50">{getAcademyStatusMessage(academySummary.overallProgress)}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {nextModule && (
                <Button type="button" onClick={() => onOpenModule(nextModule)} className="min-h-12 rounded-2xl bg-yellow-400 px-5 py-3 font-black text-black shadow-lg shadow-yellow-500/20 hover:bg-yellow-300">
                  <PlayCircle size={17} /> Weiterlernen
                </Button>
              )}
              {lastWorkedModule && (
                <Button type="button" onClick={() => onOpenModule(lastWorkedModule)} className="min-h-12 rounded-2xl border border-yellow-300/25 bg-white/10 px-5 py-3 font-bold text-yellow-50 hover:bg-yellow-400/15">
                  <BookOpen size={17} /> Zuletzt bearbeitet
                </Button>
              )}
            </div>

            {completedModules.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {completedModules.slice(0, 5).map((moduleItem) => (
                  <span key={moduleItem.id} className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-100 ring-1 ring-emerald-200/25">
                    <CheckCircle2 size={13} /> {moduleItem.title}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-yellow-300/20 bg-black/35 p-5">
            <AcademyProgressRing value={academySummary.overallProgress} label="Gesamtfortschritt" caption="Frontend-only Anzeige" />
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-center">
                <p className="text-2xl font-black text-yellow-50">{academySummary.completedCount}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/45">Fertig</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-center">
                <p className="text-2xl font-black text-yellow-50">{Math.max(academySummary.totalCount - academySummary.completedCount, 0)}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/45">Offen</p>
              </div>
            </div>
            {profileHints.length > 0 && (
              <div className="mt-4 rounded-2xl border border-yellow-300/15 bg-yellow-400/10 p-3 text-xs leading-relaxed text-yellow-50">
                {profileHints.join(' · ')}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AcademyMotivationPanel({ academySummary, profileHints, onOpenModule }) {
  const nextModule = academySummary.nextModule;
  const openTasks = [
    ...(profileHints || []),
    nextModule ? `${nextModule.title} starten` : null,
    nextModule?.task ? 'Aufgabe umsetzen' : null,
  ].filter(Boolean);

  return (
    <Card className="rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-400/[0.12] via-white/[0.05] to-black/35 text-white backdrop-blur-xl">
      <CardContent className="p-5 sm:p-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-200">Dein nächster Schritt</p>
        <h3 className="mt-2 break-words text-2xl font-black text-yellow-50">{nextModule?.title || 'Academy abgeschlossen'}</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/62">
          {nextModule?.description || 'Alle Module sind für diesen Besuch abgeschlossen markiert.'}
        </p>

        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Motivation</p>
            <p className="mt-2 text-sm leading-relaxed text-yellow-50">{getAcademyStatusMessage(academySummary.overallProgress)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Lernzeit</p>
            <p className="mt-2 text-lg font-black text-yellow-50">{nextModule?.duration || '—'}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Offene Aufgaben</p>
            <div className="mt-3 space-y-2">
              {openTasks.slice(0, 4).map((task) => (
                <p key={task} className="flex gap-2 text-sm text-white/66">
                  <Circle size={8} className="mt-1.5 shrink-0 fill-yellow-300 text-yellow-300" />
                  <span className="min-w-0 break-words">{task}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {nextModule && (
          <Button type="button" onClick={() => onOpenModule(nextModule)} className="mt-5 w-full rounded-2xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300">
            <ChevronRight size={16} /> Weiterlernen
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function AcademyCertificatePreview({ partner, academySummary }) {
  const ready = academySummary.overallProgress >= 100;

  return (
    <Card className="overflow-hidden rounded-[2rem] border border-yellow-300/20 bg-black/35 text-white backdrop-blur-xl">
      <CardContent className="p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[0.55fr_1fr]">
          <div className="flex items-center justify-center rounded-[1.5rem] border border-yellow-300/25 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-800 p-5 text-black shadow-xl shadow-yellow-500/15">
            <div className="w-full rounded-[1.25rem] border-2 border-black/25 bg-yellow-50/95 p-5 text-center">
              <Trophy className="mx-auto text-yellow-800" size={36} />
              <p className="mt-3 text-xs font-black uppercase tracking-[0.22em] text-black/55">Zertifikat</p>
              <h4 className="mt-2 text-xl font-black text-black">Harbor Academy</h4>
              <p className="mt-3 text-sm font-bold text-black/70">{partner?.firstName || 'Partner'} {partner?.lastName || ''}</p>
              <p className="mt-4 rounded-full border border-black/20 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-black/65">
                {ready ? 'Bereit zur Freigabe' : `${academySummary.overallProgress}% vorbereitet`}
              </p>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-200">Zertifikats-Vorschau</p>
            <h3 className="mt-2 break-words text-2xl font-black text-yellow-50">Dein Abschluss wird sichtbar</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/62">
              Diese Vorschau zeigt, wie dein Academy-Abschluss später wirken kann. Noch keine PDF-Erzeugung, keine Speicherung – nur eine motivierende UI-Vorschau.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xl font-black text-yellow-50">{academySummary.completedCount}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/45">Module</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xl font-black text-yellow-50">{academySummary.overallProgress}%</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/45">Fortschritt</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <p className="text-xl font-black text-yellow-50">{ready ? 'Ja' : 'Noch nicht'}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/45">Bereit</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PartnerAcademyModuleCard({ moduleItem, onOpen, active = false }) {
  const Icon = moduleItem.icon || BookOpen;
  const hasVideo = moduleItem.videos.length > 0;
  const hasPdf = moduleItem.documents.length > 0;
  const hasTask = Boolean(moduleItem.hasTask);
  const actionLabel = moduleItem.progress.status === 'completed'
    ? 'Wiederholen'
    : moduleItem.progress.status === 'in-progress'
      ? 'Weiterlernen'
      : 'Modul öffnen';

  return (
    <button
      type="button"
      onClick={() => onOpen(moduleItem)}
      aria-expanded={active}
      className={`group flex min-w-0 flex-col rounded-[1.65rem] border p-4 text-left text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-yellow-300/40 hover:bg-yellow-400/[0.08] sm:rounded-[1.85rem] sm:p-5 ${
        active
          ? 'border-yellow-300/45 bg-yellow-400/[0.10] ring-1 ring-yellow-200/20'
          : 'border-white/10 bg-black/25'
      }`}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200 transition group-hover:bg-yellow-400 group-hover:text-black">
          <Icon size={21} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-yellow-100 ring-1 ring-white/10">
              {moduleItem.category}
            </span>
            <AcademyModuleStatusBadge status={moduleItem.progress} />
          </div>
          <h4 className="mt-3 break-words text-lg font-black text-yellow-50">{moduleItem.title}</h4>
        </div>
      </div>

      <p className="mt-3 min-h-[3.25rem] text-sm leading-relaxed text-white/62">{moduleItem.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
          <Clock size={13} /> {moduleItem.duration}
        </span>
        {hasVideo && (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-black text-yellow-100 ring-1 ring-yellow-200/20">
            <Video size={13} /> Video
          </span>
        )}
        {hasPdf && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
            <FileText size={13} /> PDF
          </span>
        )}
        {hasTask && (
          <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
            <CheckCircle2 size={13} /> Aufgabe
          </span>
        )}
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-bold text-white/55">
          <span>Fortschritt</span>
          <span>{moduleItem.progress.percent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-200" style={{ width: `${moduleItem.progress.percent}%` }} />
        </div>
      </div>

      <span className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-black text-black transition hover:bg-yellow-300">
        {actionLabel} <ChevronRight size={16} />
      </span>
    </button>
  );
}

function PartnerAcademyModuleDetail({
  moduleItem,
  activeModule,
  activeCatalogModule,
  activeLesson,
  languageCode,
  selectedLanguage,
  partner,
  copy,
  labels,
  completedVideoIds,
  onSelectLesson,
  onBack,
  onComplete,
}) {
  const Icon = moduleItem.icon || BookOpen;
  const [moduleNotes, setModuleNotes] = useState('');
  const difficulty = getAcademyModuleDifficulty(moduleItem);
  const checklistItems = [
    moduleItem.videos.length > 0 ? `${moduleItem.videos.length} Video${moduleItem.videos.length > 1 ? 's' : ''} ansehen` : null,
    moduleItem.documents.length > 0 ? `${moduleItem.documents.length} Unterlage${moduleItem.documents.length > 1 ? 'n' : ''} öffnen` : null,
    'Lernziel prüfen',
    'Aufgabe umsetzen',
  ].filter(Boolean);

  return (
    <section className="space-y-5">
      {activeCatalogModule?.lessons?.length > 0 && (
        <div className="rounded-[2rem] border border-yellow-300/20 bg-black/30 p-4 shadow-xl shadow-yellow-500/5 sm:p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">{copy?.lessons || 'Lektionen'}</p>
              <h4 className="mt-1 break-words text-xl font-black text-yellow-50">{moduleItem.title}</h4>
            </div>
            <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/62">
              {activeCatalogModule.lessons.length} {copy?.lessons || 'Lektionen'}
            </span>
          </div>
          <div className="grid min-w-0 gap-4 xl:grid-cols-[0.36fr_0.64fr]">
            <AcademyLessonNavigation
              lessons={activeCatalogModule.lessons}
              activeLessonId={activeLesson?.id}
              completedVideoIds={completedVideoIds}
              languageCode={languageCode}
              onSelect={onSelectLesson}
            />
            <div className="min-w-0">
              <AcademyLessonContent
                activeModule={activeModule}
                lesson={activeLesson}
                selectedLanguage={selectedLanguage}
                partner={partner}
                copy={copy}
                labels={labels}
              />
            </div>
          </div>
        </div>
      )}

      <Card className="overflow-hidden rounded-[2.25rem] border border-yellow-300/25 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.20),transparent_36%),linear-gradient(135deg,rgba(250,204,21,0.12),rgba(255,255,255,0.055),rgba(0,0,0,0.42))] text-white shadow-2xl shadow-yellow-500/10 backdrop-blur-xl">
        <CardContent className="p-5 sm:p-6 md:p-8">
          <button
            type="button"
            onClick={onBack}
            className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/15"
          >
            <ChevronRight className="rotate-180" size={16} /> Zurück zur Übersicht
          </button>

          <div className="grid gap-5 lg:grid-cols-[0.95fr_0.55fr]">
            <div className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/25 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-yellow-100 ring-1 ring-yellow-200/20">
                  <Icon size={14} /> {moduleItem.category}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">{moduleItem.duration}</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">{difficulty}</span>
                <AcademyModuleStatusBadge status={moduleItem.progress} />
              </div>
              <h3 className="break-words text-3xl font-black text-yellow-50 md:text-4xl">{moduleItem.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-white/68">{moduleItem.intro}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[moduleItem.category, difficulty, moduleItem.duration, moduleItem.videos.length > 0 ? 'Video' : null, moduleItem.documents.length > 0 ? 'Download' : null, moduleItem.hasTask ? 'Aufgabe' : null].filter(Boolean).map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-black text-white/65">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-yellow-300/20 bg-black/35 p-5">
              <AcademyProgressRing value={moduleItem.progress.percent} label="Modulfortschritt" compact />
              <p className="mt-4 text-sm leading-relaxed text-white/55">
                {moduleItem.progress.totalVideoCount > 0
                  ? `${moduleItem.progress.completedVideoCount}/${moduleItem.progress.totalVideoCount} Videos angesehen.`
                  : moduleItem.progress.localCompleted
                    ? 'Dieses Modul ist für diesen Besuch abgeschlossen markiert.'
                    : 'Dieses Modul enthält eine praktische Aufgabe und kann direkt abgeschlossen werden.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[0.42fr_0.58fr]">
        <div className="order-2 space-y-5 xl:order-1">
          <Panel title="Lernziel" icon={Target}>
            <p className="text-sm leading-relaxed text-white/68">{moduleItem.learningGoal}</p>
          </Panel>

          <Panel title="Schritte" icon={CheckCircle2}>
            <div className="space-y-3">
              {moduleItem.steps.map((step, index) => (
                <div key={step} className="flex gap-3 rounded-2xl border border-white/10 bg-black/25 p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-black text-black">{index + 1}</span>
                  <p className="min-w-0 break-words text-sm font-semibold text-white/78">{step}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Modul-Checkliste" icon={ShieldCheck}>
            <div className="space-y-3">
              {checklistItems.map((item, index) => {
                const isDone = moduleItem.progress.percent >= 100 || (index === 0 && moduleItem.progress.completedVideoCount > 0);

                return (
                  <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-black/25 p-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isDone ? 'bg-emerald-400 text-black' : 'bg-white/10 text-yellow-100 ring-1 ring-yellow-200/15'}`}>
                      {isDone ? <CheckCircle2 size={16} /> : <Circle size={11} />}
                    </span>
                    <p className="min-w-0 break-words text-sm font-semibold text-white/75">{item}</p>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel title="Aufgabe" icon={FileQuestion}>
            <p className="text-sm leading-relaxed text-white/68">{moduleItem.task}</p>
            <Button
              type="button"
              onClick={() => onComplete(moduleItem.id)}
              className="mt-5 w-full rounded-2xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300"
              disabled={moduleItem.progress.localCompleted}
            >
              <CheckCircle2 size={16} /> {moduleItem.progress.localCompleted ? 'Abgeschlossen markiert' : 'Als abgeschlossen markieren'}
            </Button>
            <p className="mt-3 text-xs leading-relaxed text-white/45">
              Diese Markierung hilft dir während dieses Besuchs und verändert keine gespeicherten Partnerdaten.
            </p>
          </Panel>

          <Panel title="Notizen" icon={FileText}>
            <label className="block">
              <span className="sr-only">Notizen zu diesem Modul</span>
              <textarea
                value={moduleNotes}
                onChange={(event) => setModuleNotes(event.target.value)}
                rows={5}
                placeholder="Was ist dein wichtigster Gedanke aus diesem Modul?"
                className="w-full resize-none rounded-3xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-yellow-300/45 focus:bg-black/45"
              />
            </label>
            <p className="mt-3 text-xs leading-relaxed text-white/45">
              Deine Notizen bleiben nur in dieser geöffneten Ansicht und werden nicht gespeichert.
            </p>
          </Panel>
        </div>

        <div className="order-1 min-w-0 space-y-5 xl:order-2">
          <Panel title="Inhalte" icon={BookOpen}>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-2xl font-black text-yellow-50">{moduleItem.videos.length}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/45">Videos</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-2xl font-black text-yellow-50">{moduleItem.documents.length}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/45">PDFs</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-2xl font-black text-yellow-50">{moduleItem.hasTask ? '1' : '0'}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/45">Aufgaben</p>
              </div>
            </div>
          </Panel>

          {moduleItem.documents.length > 0 && (
            <Panel title="PDFs & Unterlagen" icon={FileText}>
              <div className="grid gap-3">
                {moduleItem.documents.map((documentItem) => (
                  <AcademyDocumentCard key={documentItem.id} documentItem={documentItem} compact />
                ))}
              </div>
            </Panel>
          )}

          {moduleItem.showDownloadCenter && (
            <AcademyDownloadCenter
              language={selectedLanguage}
              context="module"
              onOpen={openAcademyDocument}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function ModulesSection({
  selectedModule = modules[0],
  setSelectedModule = () => {},
  copy,
  content,
  selectedLanguage,
  partner,
}) {
  const languageCode = getAcademyLanguageCode(selectedLanguage);
  const labels = ACADEMY_MODULE_UI_LABELS[languageCode] || ACADEMY_MODULE_UI_LABELS.de;
  const localizedCatalog = useMemo(() => getAcademyContentCatalog(languageCode), [languageCode]);
  const moduleList = content?.modules || modules;
  const [selectedLessonByModule, setSelectedLessonByModule] = useState({});
  const [selectedPartnerModuleId, setSelectedPartnerModuleId] = useState('');
  const [localCompletedModuleIds, setLocalCompletedModuleIds] = useState([]);
  const selectedModuleDetailRef = useRef(null);
  const completedVideoIds = partner?.academyProgress?.completedVideoIds
    || Object.keys(partner?.academyProgress?.completedVideos || {});
  const academySummary = useMemo(
    () => getPartnerAcademySummary(partner, localCompletedModuleIds),
    [partner, localCompletedModuleIds]
  );
  const selectedPartnerModule = academySummary.modules.find((moduleItem) => moduleItem.id === selectedPartnerModuleId);
  const profileHints = [
    !partner?.profileImageUrl ? 'Profilbild ergänzen' : null,
    !(String(partner?.teamName || '').trim() || Number(partner?.teamPartnerCount || 0) > 0) ? 'Teamzugehörigkeit klären' : null,
    academySummary.completedCount === 0 ? 'Erstes Modul starten' : null,
  ].filter(Boolean);

  const openPartnerModule = (moduleItem) => {
    setSelectedPartnerModuleId(moduleItem.id);
    const linkedModule = moduleList.find((module) => module.id === moduleItem.catalogModuleId);

    if (linkedModule) {
      setSelectedModule(linkedModule);
    }
  };

  const markPartnerModuleComplete = (moduleId) => {
    setLocalCompletedModuleIds((current) => (current.includes(moduleId) ? current : [...current, moduleId]));
  };

  const activeModuleBase = selectedPartnerModule
    ? moduleList.find((module) => module.id === selectedPartnerModule.catalogModuleId)
      || moduleList.find((module) => module.id === selectedModule.id)
      || moduleList[0]
    : null;
  const activeCatalogModule = selectedPartnerModule
    ? localizedCatalog.find((module) => module.id === selectedPartnerModule.catalogModuleId)
      || localizedCatalog.find((module) => module.id === activeModuleBase?.id)
      || localizedCatalog[0]
    : null;
  const defaultLesson = activeCatalogModule?.lessons?.find((lesson) => lesson.type === 'video' || lesson.type === 'video-placeholder')
    || activeCatalogModule?.lessons?.[0];
  const selectedLessonId = activeCatalogModule
    ? selectedLessonByModule[activeCatalogModule.id] || defaultLesson?.id || ''
    : '';
  const activeLesson = activeCatalogModule?.lessons?.find((lesson) => lesson.id === selectedLessonId)
    || defaultLesson
    || null;
  const activeModule = selectedPartnerModule && activeCatalogModule
    ? {
      ...activeModuleBase,
      ...activeCatalogModule,
      title: selectedPartnerModule.title,
      description: selectedPartnerModule.description,
      icon: selectedPartnerModule.icon,
      lessons: activeCatalogModule.lessons.length,
    }
    : null;
  const selectLesson = (lessonId) => {
    if (!activeCatalogModule) {
      return;
    }

    setSelectedLessonByModule((current) => ({
      ...current,
      [activeCatalogModule.id]: lessonId,
    }));
  };

  useEffect(() => {
    if (!selectedPartnerModuleId || typeof window === 'undefined') {
      return undefined;
    }

    const isMobile = window.matchMedia?.('(max-width: 767px)').matches;

    if (!isMobile) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      selectedModuleDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [selectedLessonId, selectedPartnerModuleId]);

  return (
    <section className="space-y-5">
      <AcademyStartHero
        partner={partner}
        academySummary={academySummary}
        profileHints={profileHints}
        onOpenModule={openPartnerModule}
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_0.36fr]">
        <Card className="rounded-[2rem] border border-white/10 bg-white/[0.06] text-white backdrop-blur-xl">
          <CardContent className="p-5 sm:p-6 md:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h4 className="text-2xl font-black text-yellow-50">Modulübersicht</h4>
                <p className="mt-1 text-sm text-white/52">Öffne ein Modul, sieh dir Videos oder PDFs an und arbeite die Aufgabe durch.</p>
              </div>
              <span className="w-fit rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-black text-yellow-100 ring-1 ring-yellow-200/20">
                {academySummary.totalCount} Module
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {academySummary.modules.map((moduleItem) => (
                <React.Fragment key={moduleItem.id}>
                  <PartnerAcademyModuleCard
                    moduleItem={moduleItem}
                    onOpen={openPartnerModule}
                    active={selectedPartnerModule?.id === moduleItem.id}
                  />
                  {selectedPartnerModule?.id === moduleItem.id && activeModule && activeCatalogModule && (
                    <div ref={selectedModuleDetailRef} className="scroll-mt-28 sm:col-span-2 2xl:col-span-3">
                      <PartnerAcademyModuleDetail
                        moduleItem={selectedPartnerModule}
                        activeModule={activeModule}
                        activeCatalogModule={activeCatalogModule}
                        activeLesson={activeLesson}
                        languageCode={languageCode}
                        selectedLanguage={selectedLanguage}
                        partner={partner}
                        copy={copy}
                        labels={labels}
                        completedVideoIds={completedVideoIds}
                        onSelectLesson={selectLesson}
                        onBack={() => setSelectedPartnerModuleId('')}
                        onComplete={markPartnerModuleComplete}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <AcademyMotivationPanel
            academySummary={academySummary}
            profileHints={profileHints}
            onOpenModule={openPartnerModule}
          />
          <AcademyCertificatePreview partner={partner} academySummary={academySummary} />
          <Card className="rounded-[2rem] border border-white/10 bg-black/25 text-white backdrop-blur-xl">
            <CardContent className="p-5 sm:p-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-200">Schnellzugriff</p>
              <h3 className="mt-2 break-words text-xl font-black text-yellow-50">Module im Fokus</h3>
            <div className="mt-5 grid gap-3">
              {academySummary.modules.slice(0, 4).map((moduleItem) => (
                <button
                  key={moduleItem.id}
                  type="button"
                  onClick={() => openPartnerModule(moduleItem)}
                  className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-left transition hover:border-yellow-300/25 hover:bg-yellow-400/10"
                >
                  <span className="min-w-0">
                    <span className="block break-words text-sm font-black text-yellow-50">{moduleItem.title}</span>
                    <span className="mt-1 block text-xs text-white/45">{moduleItem.progress.label} · {moduleItem.progress.percent}%</span>
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-yellow-200" />
                </button>
              ))}
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function InstagramSection({ partners, partner, instagramVisible, setInstagramVisible, onSaveProfile, onAdminUpdate, copy, content, isAdmin }) {
  const [query, setQuery] = useState('');
  const [ownInstagram, setOwnInstagram] = useState(partner?.instagramProfile || '');
  const [socialMessage, setSocialMessage] = useState('');
  const [savingSocial, setSavingSocial] = useState(false);
  const [adminEdits, setAdminEdits] = useState({});
  const networkProfiles = useMemo(() => {
    const profileMap = new Map();

    dedupePartners([...partners, partner].filter(Boolean))
      .filter((item) => (
        isAdmin
          ? isRealApprovedPartner(item) && Boolean(instagramProfileToHandle(item.instagramProfile))
          : hasVisibleInstagramProfile(item)
      ))
      .forEach((item) => {
        const handle = instagramProfileToHandle(item.instagramProfile);

        if (!handle) {
          return;
        }

        profileMap.set(item.id, {
          partnerId: item.id,
          username: handle.slice(1),
          handle,
          url: instagramProfileToUrl(handle),
          firstName: item.firstName,
          lastName: item.lastName,
          city: item.city,
          profileImageUrl: item.profileImageUrl,
          initials: getInitials(item),
          visible: item.instagramVisible !== false,
        });
      });

    return Array.from(profileMap.values());
  }, [isAdmin, partner, partners]);
  const filteredProfiles = networkProfiles.filter((profile) => {
    const haystack = `${profile.username} ${profile.firstName} ${profile.lastName} ${profile.city}`.toLowerCase();
    return haystack.includes(query.toLowerCase());
  });

  const saveOwnInstagram = async () => {
    setSocialMessage('');

    if (!isValidInstagramProfile(ownInstagram)) {
      setSocialMessage('Bitte gib eine gültige Instagram-URL oder einen Benutzernamen mit @ ein.');
      return;
    }

    const normalizedInstagram = normalizeInstagramProfile(ownInstagram);
    setSavingSocial(true);

    try {
      await onSaveProfile?.({ instagramProfile: normalizedInstagram, instagramVisible: true });
      setInstagramVisible(true);
      setOwnInstagram(normalizedInstagram);
      setSocialMessage('Instagram-Profil gespeichert.');
    } catch (error) {
      setSocialMessage(error.message || 'Instagram-Profil konnte nicht gespeichert werden.');
    } finally {
      setSavingSocial(false);
    }
  };

  const updateOwnVisibility = async (nextVisible) => {
    setInstagramVisible(nextVisible);

    if (!onSaveProfile || partner?.role === 'admin') {
      return;
    }

    try {
      await onSaveProfile({ instagramProfile: normalizeInstagramProfile(ownInstagram), instagramVisible: nextVisible });
      setSocialMessage(nextVisible ? 'Instagram-Profil wird angezeigt.' : 'Instagram-Profil ist ausgeblendet.');
    } catch (error) {
      setSocialMessage(error.message || 'Sichtbarkeit konnte nicht gespeichert werden.');
    }
  };

  const saveAdminInstagram = async (profile) => {
    const nextValue = adminEdits[profile.partnerId] ?? profile.handle;

    if (!isValidInstagramProfile(nextValue)) {
      setSocialMessage('Admin: Bitte eine gültige Instagram-URL oder einen @Benutzernamen eingeben.');
      return;
    }

    const saved = await onAdminUpdate?.(profile.partnerId, {
      instagramProfile: normalizeInstagramProfile(nextValue),
      instagramVisible: true,
    });

    if (saved === false) {
      setSocialMessage('Admin-Aktion wurde abgebrochen.');
      return;
    }

    setSocialMessage('Instagram-Profil wurde administrativ gespeichert.');
  };

  const deleteAdminInstagram = async (profile) => {
    const saved = await onAdminUpdate?.(profile.partnerId, {
      instagramProfile: '',
      instagramVisible: false,
    });

    if (saved === false) {
      setSocialMessage('Admin-Aktion wurde abgebrochen.');
      return;
    }

    setAdminEdits((current) => ({ ...current, [profile.partnerId]: '' }));
    setSocialMessage('Instagram-Profil wurde entfernt.');
  };

  return (
    <section className="space-y-5">
      <Panel title={copy.communityCenter} icon={Instagram}>
        <div className="grid min-w-0 gap-5 xl:grid-cols-[1.15fr_1.85fr]">
          <div className="rounded-3xl border border-yellow-300/25 bg-gradient-to-br from-yellow-400/[0.16] via-white/[0.06] to-black/35 p-5 shadow-lg shadow-yellow-500/10 transition hover:-translate-y-0.5 hover:border-yellow-200/50 hover:shadow-yellow-400/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <BrandLogo className="h-20 w-auto object-contain sm:h-28" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-yellow-200">{copy.officialInstagram}</p>
                <h3 className="mt-1 text-2xl font-black">{OFFICIAL_INSTAGRAM_HANDLE}</h3>
                <p className="mt-1 text-sm text-white/60">{copy.officialInstagramText}</p>
                <span className="mt-3 inline-flex rounded-full bg-yellow-400/15 px-3 py-1 text-xs font-bold text-yellow-100 ring-1 ring-yellow-200/25">
                  {copy.officialInstagramFooter}
                </span>
              </div>
            </div>
            <PremiumInstagramLink copy={copy} className="mt-5 w-full" />
          </div>

          <div className="min-w-0 rounded-3xl border border-white/10 bg-black/25 p-4 sm:p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-yellow-200">{copy.partnerNetwork}</p>
                <p className="mt-1 text-sm text-white/60">{copy.voluntary}</p>
              </div>
              <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
                <input type="checkbox" checked={instagramVisible} onChange={(event) => updateOwnVisibility(event.target.checked)} className="accent-yellow-300" />
                {copy.showMyProfile}
              </label>
            </div>
            {!isAdmin && (
              <div className="mt-4 rounded-3xl border border-yellow-300/15 bg-yellow-400/10 p-4">
                <label className="block">
                  <span className="mb-1 block text-xs text-white/50">Mein Instagram-Profil</span>
                  <input
                    value={ownInstagram}
                    onChange={(event) => {
                      setOwnInstagram(event.target.value);
                      setSocialMessage('');
                    }}
                    placeholder="https://instagram.com/deinname"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-white/35 focus:border-yellow-300/70"
                  />
                </label>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <Button type="button" disabled={savingSocial} onClick={saveOwnInstagram} className="w-full rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-black text-black hover:bg-yellow-300 disabled:opacity-60 sm:w-auto">
                    <Instagram size={16} /> {savingSocial ? copy.saving : 'Instagram speichern'}
                  </Button>
                  {instagramProfileToUrl(ownInstagram) && (
                    <a href={instagramProfileToUrl(ownInstagram)} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/15 sm:w-auto">
                      Instagram öffnen <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>
            )}
            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
              <Search size={17} className="text-yellow-300" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.instagramSearch} className="w-full bg-transparent text-sm outline-none placeholder:text-white/35" />
            </div>
            <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredProfiles.slice(0, 15).map((profile) => (
                <div key={`${profile.partnerId}-${profile.username}`} className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.06] p-4 transition hover:-translate-y-0.5 hover:border-yellow-300/50 hover:shadow-lg hover:shadow-yellow-500/10">
                  <a href={profile.url} target="_blank" rel="noreferrer" className="flex min-w-0 items-center gap-3">
                    {profile.profileImageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profile.profileImageUrl} alt={`${profile.firstName} ${profile.lastName}`} className="h-12 w-12 shrink-0 rounded-full border border-yellow-200/35 object-cover" />
                    ) : (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-200 to-yellow-700 font-black text-black">{profile.initials}</span>
                    )}
                    <span className="min-w-0">
                      <span className="block min-w-0 break-all font-bold">@{profile.username}</span>
                      <span className="block min-w-0 break-words text-xs text-white/50">{profile.firstName} {profile.lastName}{profile.city ? ` · ${profile.city}` : ''}</span>
                    </span>
                  </a>
                  <a href={profile.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/15">
                    {copy.follow}
                  </a>
                  {isAdmin && profile.visible === false && (
                    <span className="mt-2 inline-flex w-full justify-center rounded-2xl bg-yellow-400/10 px-3 py-2 text-xs font-bold text-yellow-100">
                      Ausgeblendet
                    </span>
                  )}
                  {isAdmin && (
                    <div className="mt-4 space-y-2 rounded-2xl border border-yellow-300/15 bg-black/25 p-3">
                      <input
                        value={adminEdits[profile.partnerId] ?? profile.handle}
                        onChange={(event) => setAdminEdits((current) => ({ ...current, [profile.partnerId]: event.target.value }))}
                        className="w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-xs outline-none focus:border-yellow-300/70"
                        aria-label="Instagram-Profil administrativ bearbeiten"
                      />
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Button type="button" onClick={() => saveAdminInstagram(profile)} className="rounded-xl bg-yellow-400 px-3 py-2 text-xs font-black text-black hover:bg-yellow-300">
                          Speichern
                        </Button>
                        <Button type="button" onClick={() => deleteAdminInstagram(profile)} className="rounded-xl border border-red-400/30 bg-red-500/15 px-3 py-2 text-xs font-bold text-red-100 hover:bg-red-500/25">
                          Löschen
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {filteredProfiles.length === 0 && (
              <div className="mt-4 rounded-3xl border border-white/10 bg-black/25 p-5 text-sm text-white/55">
                Noch keine Partner-Instagram-Profile. Sobald freigegebene Partner ihr Profil speichern, erscheinen sie hier.
              </div>
            )}
            {socialMessage && <AuthMessage>{socialMessage}</AuthMessage>}
            {isAdmin && (
              <div className="mt-4 rounded-2xl border border-yellow-300/20 bg-yellow-400/10 p-3 text-xs text-yellow-100">
                {copy.adminInstagramNotice}
              </div>
            )}
          </div>
        </div>
      </Panel>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {content.socialResources.map((resource) => (
          <Panel key={resource} title={resource} icon={ImagePlus}>
            <p className="text-sm text-white/60">{copy.socialResourceText}</p>
            <Button className="mt-5 w-full rounded-2xl bg-white/10 py-3 hover:bg-white/15">{copy.open}</Button>
          </Panel>
        ))}
      </section>
    </section>
  );
}

function CommunityChatSection({ partners, partner, token, copy, content, isAdmin }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [presence, setPresence] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [chatError, setChatError] = useState('');
  const [chatAttachment, setChatAttachment] = useState(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [seenMessageCount, setSeenMessageCount] = useState(0);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const visiblePresence = useMemo(() => {
    const seen = new Set();

    return (presence || []).filter((item) => {
      const name = String(item.name || '').toLowerCase();
      const key = item.role === 'admin' || name.includes('harbor admin') ? 'admin' : String(item.partnerId || name);
      const looksLikeTest = ['test', 'codex', 'demo', 'phase3', 'leo boy', 'leoboy', 'example.com'].some((pattern) => name.includes(pattern));

      if (looksLikeTest || seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }, [presence]);
  const activeUsers = Math.max(partners.filter(isRealApprovedPartner).length, visiblePresence.length);
  const onlineUsers = visiblePresence.filter((item) => item.online).length;
  const newMessageCount = Math.max(0, messages.length - seenMessageCount);

  const applyCommunityState = useCallback((state) => {
    if (!state) {
      return;
    }

    setMessages(state.messages || []);
    setPresence(state.presence || []);
    setNotifications(state.notifications || []);
  }, []);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let isActive = true;

    const loadState = async () => {
      try {
        const state = await communityRequest('community-state', {}, token);
        if (isActive) {
          applyCommunityState(state);
        }
      } catch (error) {
        if (isActive) {
          setChatError(error.message || 'Community Chat konnte nicht geladen werden.');
        }
      }
    };

    loadState();
    const syncInterval = window.setInterval(loadState, 4000);

    return () => {
      isActive = false;
      window.clearInterval(syncInterval);
    };
  }, [applyCommunityState, token]);

  const selectAttachment = async (file, kind) => {
    setChatError('');

    if (!file) {
      return;
    }

    try {
      setChatAttachment(await fileToCommunityAttachment(file, kind));
    } catch (error) {
      setChatAttachment(null);
      setChatError(error.message || 'Datei konnte nicht vorbereitet werden.');
    }
  };

  const insertEmoji = (emoji) => {
    setMessage((current) => `${current}${emoji}`);
    setEmojiOpen(false);
  };

  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage && !chatAttachment) {
      setChatError('Nachricht ist leer.');
      return;
    }

    setSending(true);
    setChatError('');

    try {
      const data = await communityRequest('chat-send', { text: trimmedMessage, attachment: chatAttachment }, token);
      applyCommunityState(data.state);
      setMessage('');
      setChatAttachment(null);
      setEmojiOpen(false);
      setSeenMessageCount((data.state?.messages || []).length);
    } catch (error) {
      setChatError(error.message || 'Nachricht konnte nicht gespeichert werden.');
    } finally {
      setSending(false);
    }
  };

  const deleteMessage = async (messageId) => {
    setChatError('');

    if (!confirmAdminAction({
      title: 'Community-Nachricht löschen',
      target: messageId || 'Nachricht ohne ID',
      consequences: [
        'Die Chat-Nachricht wird aus der Community-Ansicht entfernt.',
        'Anhänge dieser Nachricht sind danach in der Academy nicht mehr über den Chat erreichbar.',
        'Die Löschung ist ohne Backup nicht rückgängig zu machen.',
      ],
      requiredInput: ADMIN_DELETE_CONFIRMATION,
    })) {
      return;
    }

    try {
      const data = await communityRequest('chat-delete', { messageId }, token);
      applyCommunityState(data.state);
      setSeenMessageCount((data.state?.messages || []).length);
    } catch (error) {
      setChatError(error.message || 'Nachricht konnte nicht gelöscht werden.');
    }
  };

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const renderAttachment = (attachment) => {
    if (!attachment?.url) {
      return null;
    }

    if (attachment.kind === 'image' || String(attachment.type || '').startsWith('image/')) {
      return (
        <a href={attachment.url} target="_blank" rel="noreferrer" className="mt-3 block overflow-hidden rounded-2xl border border-yellow-300/20 bg-black/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={attachment.url} alt={attachment.name || 'Chat Bild'} className="max-h-80 w-full object-contain" />
        </a>
      );
    }

    return (
      <a href={attachment.url} target="_blank" rel="noreferrer" download className="mt-3 flex min-w-0 flex-col gap-3 rounded-2xl border border-yellow-300/20 bg-yellow-400/10 p-4 text-sm text-yellow-100 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex min-w-0 items-center gap-3">
          <FileText size={18} className="shrink-0" />
          <span className="min-w-0">
            <span className="block break-all font-bold">{attachment.name || 'Datei'}</span>
            <span className="block text-xs text-white/50">{attachment.type || 'Datei'} · {formatFileSize(attachment.size)}</span>
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center justify-center rounded-xl bg-yellow-400 px-3 py-2 font-black text-black">Download</span>
      </a>
    );
  };

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[1.15fr_1.85fr]">
      <Panel title={copy.communityChatTitle} icon={MessageCircle}>
        <div className="rounded-3xl border border-green-300/20 bg-green-400/10 p-5">
          <p className="flex items-center gap-2 font-bold text-green-200"><Circle size={12} fill="currentColor" /> {onlineUsers} {copy.partnersOnline}</p>
          <p className="mt-2 text-sm text-white/60">{copy.chatIntro}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-white/65">
            <span className="rounded-2xl bg-black/25 px-3 py-2">{messages.length} {copy.messagesLabel}</span>
            <span className="rounded-2xl bg-black/25 px-3 py-2">{newMessageCount} neu</span>
          </div>
        </div>
        {notifications.length > 0 && (
          <button type="button" onClick={() => communityRequest('notifications-read', {}, token).then(() => setNotifications([])).catch(() => {})} className="mt-4 w-full rounded-2xl border border-yellow-300/25 bg-yellow-400/10 px-4 py-3 text-left text-sm font-semibold text-yellow-100">
            <Bell className="mr-2 inline" size={16} /> {notifications.length} {copy.notifications}
          </button>
        )}
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {[
            { label: 'Text', active: true },
            { label: 'Emojis', active: true },
            { label: 'Bilder', active: true },
            { label: 'Dateien', active: true },
          ].map((item) => (
            <div key={item.label} className={`rounded-2xl border px-3 py-2 ${item.active ? 'border-green-300/20 bg-green-400/10 text-green-100' : 'border-white/10 bg-black/25 text-white/40'}`}>{item.label}</div>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-yellow-200">Online Status</p>
          <div className="mt-3 space-y-2">
            {visiblePresence.slice(0, 5).map((item) => (
              <div key={item.partnerId} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate">{item.online ? '🟢' : '⚪'} {item.name}</span>
                <span className="shrink-0 text-xs text-white/45">{new Date(item.lastSeenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
            {visiblePresence.length === 0 && <p className="text-sm text-white/45">Noch keine aktiven Partner online.</p>}
          </div>
        </div>
        {isAdmin && (
          <div className="mt-4 rounded-2xl border border-yellow-300/20 bg-yellow-400/10 p-3 text-xs text-yellow-100">
            {copy.adminChatTools}
          </div>
        )}
      </Panel>

      <Card className="max-w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] text-white backdrop-blur-xl">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <div className="max-h-[560px] min-w-0 space-y-3 overflow-y-auto pr-1" onClick={() => setSeenMessageCount(messages.length)}>
            {messages.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-black/25 p-5 text-sm text-white/55">
                Noch keine Chatnachrichten. Schreibe die erste Nachricht an die Community.
              </div>
            )}
            {messages.map((chat, index) => (
              <div key={`${chat.id || chat.author}-${chat.createdAt || chat.time}-${index}`} className="min-w-0 rounded-3xl border border-white/10 bg-black/25 p-4">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {chat.authorImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={chat.authorImage} alt={chat.authorName || chat.author || 'Partner'} className="h-10 w-10 shrink-0 rounded-full border border-yellow-200/25 object-cover" />
                    ) : (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400 text-sm font-black text-black">
                        {String(chat.authorName || chat.author || 'P').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate font-bold">{chat.authorName || chat.author}</span>
                      <span className="block text-xs text-white/40">{chat.type || (chat.attachment ? 'file' : 'text')}</span>
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/55">
                      {chat.createdAt ? new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : chat.time}
                    </span>
                    {isAdmin && (
                      <button type="button" onClick={() => deleteMessage(chat.id || chat.message_id)} className="rounded-full border border-red-400/30 bg-red-500/15 p-2 text-red-100 hover:bg-red-500/25" aria-label="Nachricht löschen">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                {chat.text && <p className="mt-2 break-words text-white/65">{chat.text}</p>}
                {renderAttachment(chat.attachment)}
              </div>
            ))}
          </div>
          <div className="mt-5 min-w-0 rounded-3xl border border-white/10 bg-black/30 p-3">
            {chatError && <AuthMessage>{chatError}</AuthMessage>}
            <textarea value={message} onKeyDown={handleComposerKeyDown} onChange={(event) => setMessage(event.target.value)} rows={3} placeholder={copy.messagePlaceholder} className="w-full resize-none bg-transparent p-2 text-sm outline-none placeholder:text-white/35" />
            {emojiOpen && (
              <div className="mt-2 grid grid-cols-8 gap-1 rounded-2xl border border-yellow-300/20 bg-black/75 p-2 sm:grid-cols-12">
                {CHAT_EMOJIS.map((emoji) => (
                  <button key={emoji} type="button" onClick={() => insertEmoji(emoji)} className="rounded-xl bg-white/10 p-2 text-lg hover:bg-yellow-400/20">
                    {emoji}
                  </button>
                ))}
              </div>
            )}
            {chatAttachment && (
              <div className="mt-3 rounded-2xl border border-yellow-300/20 bg-yellow-400/10 p-3">
                {chatAttachment.kind === 'image' && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={chatAttachment.dataUrl} alt={chatAttachment.name} className="max-h-48 w-full rounded-xl object-contain" />
                )}
                <div className="mt-2 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="min-w-0 text-xs text-yellow-100">
                    <span className="block break-all font-bold">{chatAttachment.name}</span>
                    <span className="text-white/50">{chatAttachment.type || 'Datei'} · {formatFileSize(chatAttachment.size)}</span>
                  </span>
                  <button type="button" onClick={() => setChatAttachment(null)} className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10">Entfernen</button>
                </div>
              </div>
            )}
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="grid grid-cols-3 gap-2 sm:flex">
                <button type="button" onClick={() => setEmojiOpen((current) => !current)} className="inline-flex items-center justify-center rounded-full bg-white/10 p-3 text-white/70 hover:bg-white/15" title="Emoji einfügen">
                  <Smile size={17} />
                </button>
                <button type="button" onClick={() => imageInputRef.current?.click()} className="inline-flex items-center justify-center rounded-full bg-white/10 p-3 text-white/70 hover:bg-white/15" title="Bild hochladen">
                  <ImagePlus size={17} />
                </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center justify-center rounded-full bg-white/10 p-3 text-white/70 hover:bg-white/15" title="Datei hochladen">
                  <Upload size={17} />
                </button>
                <input ref={imageInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => selectAttachment(event.target.files?.[0] || null, 'image')} />
                <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,application/zip" className="hidden" onChange={(event) => selectAttachment(event.target.files?.[0] || null, 'file')} />
              </div>
              <Button disabled={sending} onClick={sendMessage} className="w-full rounded-2xl bg-yellow-400 px-4 py-3 font-bold text-black hover:bg-yellow-300 disabled:opacity-60 sm:w-auto">
                <Send size={16} /> {sending ? copy.saving : copy.send}
              </Button>
            </div>
            <p className="mt-3 text-xs text-white/35">Enter sendet, Shift+Enter macht eine neue Zeile.</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function QASection({ copy, content, token, isAdmin }) {
  const [questionDraft, setQuestionDraft] = useState('');
  const [questions, setQuestions] = useState(content.qaQuestions.map((question) => ({ ...question, answers: [] })));
  const [selectedCategory, setSelectedCategory] = useState('');
  const [query, setQuery] = useState('');
  const [questionAttachment, setQuestionAttachment] = useState(null);
  const [answerDrafts, setAnswerDrafts] = useState({});
  const [answerAttachments, setAnswerAttachments] = useState({});
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [editAnswerText, setEditAnswerText] = useState('');
  const [qaError, setQaError] = useState('');
  const [saving, setSaving] = useState(false);
  const questionList = questions.filter((item) => {
    const categoryMatch = !selectedCategory || item.category === selectedCategory;
    const queryMatch = !query || `${item.question} ${item.category} ${item.authorName || item.author}`.toLowerCase().includes(query.toLowerCase());
    return categoryMatch && queryMatch;
  });

  const applyQaState = useCallback((state) => {
    setQuestions((state?.questions || content.qaQuestions.map((question) => ({ ...question, answers: [] }))).map((question) => ({
      ...question,
      answers: question.answers || [],
    })));
  }, [content.qaQuestions]);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    let isActive = true;

    const loadState = async () => {
      try {
        const state = await communityRequest('community-state', {}, token);
        if (isActive) {
          applyQaState(state);
        }
      } catch (error) {
        if (isActive) {
          setQaError(error.message || 'Fragen & Antworten konnten nicht geladen werden.');
        }
      }
    };

    loadState();
    const syncInterval = window.setInterval(loadState, 6000);

    return () => {
      isActive = false;
      window.clearInterval(syncInterval);
    };
  }, [applyQaState, token]);

  const addQuestion = () => {
    const trimmedQuestion = questionDraft.trim();

    if (!trimmedQuestion) {
      return;
    }

    setSaving(true);
    setQaError('');
    fileToAttachment(questionAttachment)
      .then((attachment) => communityRequest('question-create', {
        question: trimmedQuestion,
        category: selectedCategory || content.qaCategories[0],
        attachment,
      }, token))
      .then((data) => {
        applyQaState(data.state);
        setQuestionDraft('');
        setQuestionAttachment(null);
      })
      .catch((error) => setQaError(error.message || 'Frage konnte nicht gespeichert werden.'))
      .finally(() => setSaving(false));
  };

  const addAnswer = (questionId) => {
    const answerText = String(answerDrafts[questionId] || '').trim();
    const file = answerAttachments[questionId] || null;

    if (!answerText && !file) {
      return;
    }

    setSaving(true);
    setQaError('');
    fileToAttachment(file)
      .then((attachment) => communityRequest('answer-create', { questionId, text: answerText, attachment }, token))
      .then((data) => {
        applyQaState(data.state);
        setAnswerDrafts((current) => ({ ...current, [questionId]: '' }));
        setAnswerAttachments((current) => ({ ...current, [questionId]: null }));
      })
      .catch((error) => setQaError(error.message || 'Antwort konnte nicht gespeichert werden.'))
      .finally(() => setSaving(false));
  };

  const saveEditedAnswer = () => {
    if (!editingAnswer || !editAnswerText.trim()) {
      return;
    }

    if (isAdmin && !confirmAdminAction({
      title: 'Community-Antwort administrativ bearbeiten',
      target: editingAnswer.id || 'Antwort ohne ID',
      consequences: [
        'Der Antworttext wird dauerhaft überschrieben.',
        'Die Änderung ist für Partner in der Q&A-Ansicht sichtbar.',
        'Der vorherige Text ist ohne Backup nicht wiederherstellbar.',
      ],
    })) {
      return;
    }

    setSaving(true);
    setQaError('');
    communityRequest('answer-update', { answerId: editingAnswer.id, text: editAnswerText }, token)
      .then((data) => {
        applyQaState(data.state);
        setEditingAnswer(null);
        setEditAnswerText('');
      })
      .catch((error) => setQaError(error.message || 'Antwort konnte nicht bearbeitet werden.'))
      .finally(() => setSaving(false));
  };

  const markBestAnswer = (questionId, answerId) => {
    setQaError('');

    if (!confirmAdminAction({
      title: 'Beste Antwort markieren',
      target: answerId || 'Antwort ohne ID',
      consequences: [
        'Die Antwort wird dauerhaft als beste Antwort markiert.',
        'Andere Antworten dieser Frage verlieren diese Markierung.',
        'Die Markierung ist für Partner sichtbar.',
      ],
    })) {
      return;
    }

    communityRequest('answer-best', { questionId, answerId }, token)
      .then((data) => applyQaState(data.state))
      .catch((error) => setQaError(error.message || 'Beste Antwort konnte nicht markiert werden.'));
  };

  return (
    <section className="space-y-5">
      <Panel title={copy.qaTitle} icon={FileQuestion}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {content.qaCategories.map((category) => (
            <button key={category} type="button" onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)} className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold hover:border-yellow-300/40 ${selectedCategory === category ? 'border-yellow-300/45 bg-yellow-400/15 text-yellow-100' : 'border-white/10 bg-black/25 text-white/75'}`}>
              {category}
            </button>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-4 py-3">
          <Search size={17} className="text-yellow-300" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.qaSearch} className="w-full bg-transparent text-sm outline-none placeholder:text-white/35" />
        </div>
        <div className="mt-3 rounded-3xl border border-white/10 bg-black/30 p-3">
          {qaError && <AuthMessage>{qaError}</AuthMessage>}
          <textarea value={questionDraft} onChange={(event) => setQuestionDraft(event.target.value)} rows={3} placeholder={copy.qaTitle} className="w-full resize-none bg-transparent p-2 text-sm outline-none placeholder:text-white/35" />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <label className="cursor-pointer rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/15">
              <input type="file" accept="image/*,video/*,application/pdf,audio/*" className="hidden" onChange={(event) => setQuestionAttachment(event.target.files?.[0] || null)} />
              <Upload size={17} />
            </label>
            {questionAttachment && <span className="rounded-full bg-yellow-400/10 px-3 py-2 text-xs text-yellow-100">{questionAttachment.name}</span>}
            <Button type="button" disabled={saving} onClick={addQuestion} className="rounded-2xl bg-yellow-400 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-300 disabled:opacity-60">
              {saving ? copy.saving : copy.send}
            </Button>
          </div>
        </div>
        <div className="mt-4 rounded-3xl border border-yellow-300/15 bg-yellow-400/10 p-4">
          <p className="font-black text-yellow-50">{copy.qaCalendlyTitle}</p>
          <p className="mt-1 text-sm text-white/60">{copy.qaCalendlyText}</p>
          <PremiumCalendlyLink copy={copy} label={copy.bookAppointment} className="mt-4 w-full sm:w-auto" />
        </div>
      </Panel>

      <section className="grid gap-4 xl:grid-cols-2">
        {questionList.map((item) => {
          const answers = item.answers || [];
          const bestAnswer = answers.find((answer) => answer.isBest || answer.id === item.bestAnswerId);

          return (
            <Card key={item.id || item.question} className="rounded-[2rem] border border-white/10 bg-white/[0.06] text-white backdrop-blur-xl">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-yellow-200">{item.category}</p>
                    <h3 className="mt-2 text-xl font-bold">{item.question}</h3>
                    <p className="mt-2 text-sm text-white/55">{copy.by} {item.authorName || item.author} · {answers.length} {copy.answersLabel}</p>
                  </div>
                  {bestAnswer && <span className="rounded-full bg-green-400/15 px-3 py-1 text-xs font-bold text-green-200">{copy.bestAnswer}</span>}
                </div>
                {item.attachment && (
                  <a href={item.attachment.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-yellow-300/20 bg-yellow-400/10 px-3 py-2 text-sm text-yellow-100">
                    <FileText size={15} /> {item.attachment.name}
                  </a>
                )}
                <div className="mt-4 space-y-3">
                  {answers.map((answer) => (
                    <div key={answer.id} className={`rounded-3xl border p-4 ${answer.isBest || answer.id === item.bestAnswerId ? 'border-green-300/35 bg-green-400/10' : 'border-white/10 bg-black/25'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold">{answer.authorName}</p>
                        <span className="text-xs text-white/45">{new Date(answer.updatedAt || answer.createdAt).toLocaleString()}</span>
                      </div>
                      {editingAnswer?.id === answer.id ? (
                        <div className="mt-3">
                          <textarea value={editAnswerText} onChange={(event) => setEditAnswerText(event.target.value)} rows={3} className="w-full resize-none rounded-2xl border border-white/10 bg-black/35 p-3 text-sm outline-none" />
                          <Button disabled={saving} onClick={saveEditedAnswer} className="mt-2 rounded-2xl bg-yellow-400 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-300 disabled:opacity-60">{copy.save}</Button>
                        </div>
                      ) : (
                        <p className="mt-2 text-white/65">{answer.text}</p>
                      )}
                      {answer.attachment && (
                        <a href={answer.attachment.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/75">
                          <FileText size={15} /> {answer.attachment.name}
                        </a>
                      )}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button onClick={() => { setEditingAnswer(answer); setEditAnswerText(answer.text || ''); }} className="rounded-2xl bg-white/10 px-3 py-2 text-xs hover:bg-white/15">{copy.save}</Button>
                        {isAdmin && <Button onClick={() => markBestAnswer(item.id, answer.id)} className="rounded-2xl bg-green-400/15 px-3 py-2 text-xs text-green-100 hover:bg-green-400/25">{copy.markBestAnswer}</Button>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-3xl border border-white/10 bg-black/30 p-3">
                  <textarea value={answerDrafts[item.id] || ''} onChange={(event) => setAnswerDrafts((current) => ({ ...current, [item.id]: event.target.value }))} rows={2} placeholder={copy.answersLabel} className="w-full resize-none bg-transparent p-2 text-sm outline-none placeholder:text-white/35" />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <label className="cursor-pointer rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/15">
                      <input type="file" accept="image/*,video/*,application/pdf,audio/*" className="hidden" onChange={(event) => setAnswerAttachments((current) => ({ ...current, [item.id]: event.target.files?.[0] || null }))} />
                      <Upload size={17} />
                    </label>
                    {answerAttachments[item.id] && <span className="rounded-full bg-yellow-400/10 px-3 py-2 text-xs text-yellow-100">{answerAttachments[item.id].name}</span>}
                    <Button disabled={saving} onClick={() => addAnswer(item.id)} className="rounded-2xl bg-yellow-400 px-4 py-2 text-sm font-bold text-black hover:bg-yellow-300 disabled:opacity-60">
                      {saving ? copy.saving : copy.send}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </section>
  );
}
const calendarAppointmentTypes = [
  {
    id: 'phone-consulting',
    title: 'Telefonberatung',
    duration: '15–20 Minuten',
    description: 'Kurzer persönlicher Austausch für Orientierung, nächste Schritte und offene Fragen.',
    responsible: 'Leader oder Admin',
    status: 'available',
    icon: Phone,
    href: `${CALENDLY_URL}?termin=academySupport`,
  },
  {
    id: 'zoom-consulting',
    title: 'Zoom-Beratung',
    duration: '30 Minuten',
    description: 'Strukturierte Online-Beratung für Academy-Fragen, Produktverständnis und Partnerstart.',
    responsible: 'Leader oder Admin',
    status: 'soon',
    icon: Video,
  },
  {
    id: 'showroom',
    title: 'Privatführung / Showroom',
    duration: '45–60 Minuten',
    description: 'Persönliche Vorführung vor Ort, sobald die Kalenderintegration dafür freigeschaltet ist.',
    responsible: 'Admin',
    status: 'soon',
    icon: Crown,
  },
  {
    id: 'partner-onboarding',
    title: 'Partner-Onboarding',
    duration: '30 Minuten',
    description: 'Begleiteter Start in Academy, Profil, erste Module und persönlicher Aktionsplan.',
    responsible: 'Leader oder Admin',
    status: 'available',
    icon: UserCheck,
    href: `${CALENDLY_URL}?termin=academySupport`,
  },
  {
    id: 'team-training',
    title: 'Team-Training',
    duration: '60 Minuten',
    description: 'Vorbereiteter Trainingsbereich für Teamcalls, Schulungen und gemeinsame Praxisrunden.',
    responsible: 'Leader',
    status: 'soon',
    icon: Users,
  },
  {
    id: 'follow-up',
    title: 'Follow-up Gespräch',
    duration: '20 Minuten',
    description: 'Kurzer Folgetermin nach Wassertest, Präsentation oder den ersten Academy-Modulen.',
    responsible: 'Leader oder Admin',
    status: 'available',
    icon: MessageCircle,
    href: `${CALENDLY_URL}?termin=academySupport`,
  },
];

const calendarStatusCopy = {
  available: {
    label: 'Verfügbar',
    text: 'Kann über den bestehenden Terminflow ausgewählt werden.',
    className: 'border-green-300/25 bg-green-400/10 text-green-100',
  },
  busy: {
    label: 'Belegt',
    text: 'Wird erst mit echter Kalenderintegration live berechnet.',
    className: 'border-red-300/25 bg-red-400/10 text-red-100',
  },
  soon: {
    label: 'Bald verfügbar',
    text: 'Workflow ist vorbereitet; echte Slots werden später verbunden.',
    className: 'border-yellow-300/25 bg-yellow-400/10 text-yellow-100',
  },
};

function CalendarStatusBadge({ status }) {
  const item = calendarStatusCopy[status] || calendarStatusCopy.soon;

  return (
    <span className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.08em] ${item.className}`}>
      {item.label}
    </span>
  );
}

function CalendarEmptyState({ icon: Icon = CalendarDays, title, text, compact = false }) {
  return (
    <div className={`rounded-[1.5rem] border border-white/10 bg-black/30 text-center ${compact ? 'p-4' : 'p-6'}`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
        <Icon size={22} />
      </span>
      <h4 className="mt-4 text-base font-black text-yellow-50">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-white/55">{text}</p>
    </div>
  );
}

function CalendarMetricCard({ icon: Icon, label, value, text }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
          <Icon size={20} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-white/45">{label}</p>
          <p className="mt-1 text-2xl font-black text-yellow-50">{value}</p>
          <p className="mt-1 text-sm leading-relaxed text-white/55">{text}</p>
        </div>
      </div>
    </div>
  );
}

function CalendarAppointmentCard({ appointment }) {
  const Icon = appointment.icon;
  const isAvailable = appointment.status === 'available' && appointment.href;

  return (
    <article className="flex h-full min-w-0 flex-col rounded-[1.65rem] border border-white/10 bg-white/[0.055] p-4 shadow-xl shadow-black/20 transition hover:border-yellow-300/25 hover:bg-yellow-400/[0.075] sm:p-5">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/25 bg-yellow-400/10 text-yellow-200">
          <Icon size={22} />
        </span>
        <CalendarStatusBadge status={appointment.status} />
      </div>
      <div className="mt-4 min-w-0 flex-1">
        <h3 className="break-words text-xl font-black text-yellow-50">{appointment.title}</h3>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-white/55">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-3 py-1.5">
            <Clock size={13} /> {appointment.duration}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/30 px-3 py-1.5">
            <ShieldCheck size={13} /> {appointment.responsible}
          </span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-white/60">{appointment.description}</p>
      </div>
      {isAvailable ? (
        <a href={appointment.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-4 py-3 text-sm font-black text-black shadow-lg shadow-yellow-500/20 transition hover:bg-yellow-300">
          Termin auswählen <ChevronRight size={16} />
        </a>
      ) : (
        <button type="button" disabled className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white/40">
          Terminbuchung wird vorbereitet <Lock size={15} />
        </button>
      )}
    </article>
  );
}

function CalendarBookingArea({ copy }) {
  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-400/[0.14] via-white/[0.055] to-black/40 p-5 shadow-2xl shadow-yellow-500/10 sm:p-6 lg:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-200">Kalender & Terminbuchung</p>
            <h2 className="mt-3 break-words text-3xl font-black text-yellow-50 sm:text-4xl">Wähle den passenden nächsten Termin</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
              Die Oberfläche ist für Telefonberatung, Zoom, Showroom, Onboarding, Team-Training und Follow-up vorbereitet. Echte Buchungen laufen weiterhin über den bestehenden geschützten Academy-Terminflow.
            </p>
          </div>
          <PremiumCalendlyLink copy={copy} label="Zentrale Buchungsseite öffnen" className="w-full shrink-0 sm:w-auto" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {calendarAppointmentTypes.map((appointment) => (
          <CalendarAppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {Object.entries(calendarStatusCopy).map(([status, item]) => (
          <div key={status} className={`rounded-[1.5rem] border p-4 ${item.className}`}>
            <p className="text-sm font-black">{item.label}</p>
            <p className="mt-2 text-xs leading-relaxed opacity-80">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderCalendarArea({ partner }) {
  const teamName = partner?.teamName || 'dein Team';
  const teamSize = toPartnerCount(partner?.teamPartnerCount || 0);
  const leaderMetrics = [
    { icon: CalendarDays, label: 'Heute', value: '0', text: 'Keine heutigen Termine aus einer verbundenen Kalenderquelle vorhanden.' },
    { icon: Clock, label: 'Kommend', value: '0', text: 'Kommende Termine werden angezeigt, sobald Kalenderdaten verbunden sind.' },
    { icon: Bell, label: 'Offene Anfragen', value: '0', text: 'Aktuell gibt es keinen verbundenen Anfrage-Endpunkt.' },
    { icon: MessageCircle, label: 'Follow-ups', value: '0', text: 'Follow-up Termine werden ohne Backend-Integration nicht vorgetäuscht.' },
    { icon: Users, label: 'Partner ohne Termin', value: teamSize ? 'Prüfung offen' : '0', text: `Nur vorhandene Teamdaten werden genutzt: ${teamName}.` },
  ];

  return (
    <div className="space-y-5">
      <Panel title="Leader Kalenderbereich" icon={Users}>
        <p className="text-sm leading-relaxed text-white/60">
          Dieser Bereich ist als sichere Arbeitszentrale vorbereitet. Ohne echte Kalender- oder Anfrage-Daten werden keine Termine, Partnerlisten oder Buchungen erfunden.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {leaderMetrics.map((metric) => (
            <CalendarMetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <CalendarEmptyState icon={CalendarDays} title="Keine Termine vorhanden" text="Heute und kommende Termine erscheinen hier, sobald eine echte Kalenderquelle angebunden ist." />
        <CalendarEmptyState icon={Bell} title="Keine offenen Termin-Anfragen" text="Anfragen werden später nur aus autorisierten Teamdaten geladen. Aktuell bleibt der Bereich read-only vorbereitet." />
      </div>

      <Panel title="Leader-Sicherheit" icon={ShieldCheck}>
        <div className="grid gap-3 md:grid-cols-3">
          {['Nur eigenes Team sichtbar', 'Keine globalen Admin-Daten', 'Keine Schreiboperationen'].map((item) => (
            <div key={item} className="rounded-2xl border border-green-300/20 bg-green-400/10 p-4 text-sm font-bold text-green-100">
              <CheckCircle2 size={16} className="mb-2" />
              {item}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function AdminCalendarArea() {
  const availableTypes = calendarAppointmentTypes.filter((item) => item.status === 'available').length;
  const preparedTypes = calendarAppointmentTypes.length - availableTypes;

  return (
    <div className="space-y-5">
      <Panel title="Admin Kalenderübersicht" icon={Crown}>
        <p className="text-sm leading-relaxed text-white/60">
          Globale Kalender- und Terminbereiche sind als UI vorbereitet. Es gibt keine echte Kalenderintegration, keine Terminverwaltung und keine API-Schreibvorgänge in dieser Version.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CalendarMetricCard icon={CalendarDays} label="Terminarten" value={calendarAppointmentTypes.length} text="Vorbereitete Buchungsarten für Partner, Leader und Admin." />
          <CalendarMetricCard icon={CheckCircle2} label="Direkt buchbar" value={availableTypes} text="Nutzen den bestehenden zentralen Terminflow." />
          <CalendarMetricCard icon={FileQuestion} label="Vorbereitet" value={preparedTypes} text="Warten auf spätere Kalenderintegration." />
          <CalendarMetricCard icon={Bell} label="Offene Anfragen" value="0" text="Kein produktiver Anfrage-Endpunkt verbunden." />
        </div>
      </Panel>

      <Panel title="Terminarten-Verwaltung vorbereitet" icon={Settings}>
        <div className="grid gap-3 lg:grid-cols-2">
          {calendarAppointmentTypes.map((appointment) => {
            const Icon = appointment.icon;

            return (
              <div key={appointment.id} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="break-words font-black text-yellow-50">{appointment.title}</p>
                        <p className="mt-1 text-xs text-white/50">{appointment.duration} · {appointment.responsible}</p>
                      </div>
                      <CalendarStatusBadge status={appointment.status} />
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <button type="button" disabled className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-white/40">
                        Bearbeiten vorbereitet <Lock size={13} />
                      </button>
                      <button type="button" disabled className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-white/40">
                        Veröffentlichung UI <Lock size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <CalendarEmptyState icon={Users} title="Leader-Terminübersicht vorbereitet" text="Leader-Termine werden erst angezeigt, wenn eine autorisierte Kalenderquelle angebunden ist." />
        <CalendarEmptyState icon={ShieldCheck} title="Keine produktiven Schreibaktionen" text="Die Admin-Ansicht ist aktuell reine UI-Vorbereitung ohne Kalender-, Datenbank- oder API-Änderung." />
      </div>
    </div>
  );
}

function CalendlySection({ copy, partner, isAdmin = false, isLeader = false }) {
  const tabs = [
    { id: 'booking', label: 'Terminarten', icon: CalendarDays, visible: true },
    { id: 'leader', label: 'Leader Kalender', icon: Users, visible: isLeader || isAdmin },
    { id: 'admin', label: 'Admin Übersicht', icon: Crown, visible: isAdmin },
  ].filter((tab) => tab.visible);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'booking');
  const safeActiveTab = tabs.some((tab) => tab.id === activeTab) ? activeTab : 'booking';

  return (
    <section className="space-y-5">
      <div className="grid gap-3 rounded-[2rem] border border-white/10 bg-white/[0.045] p-2 sm:grid-cols-2 lg:inline-grid lg:grid-cols-none lg:grid-flow-col">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-[1.35rem] px-4 py-3 text-sm font-black transition ${safeActiveTab === id ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-500/20' : 'text-white/65 hover:bg-white/10 hover:text-yellow-50'}`}
          >
            <Icon size={17} /> {label}
          </button>
        ))}
      </div>

      {safeActiveTab === 'booking' && <CalendarBookingArea copy={copy} />}
      {safeActiveTab === 'leader' && <LeaderCalendarArea partner={partner} />}
      {safeActiveTab === 'admin' && <AdminCalendarArea />}
    </section>
  );
}

function TestimonialsSection({ partner, token, isAdmin, copy }) {
  const [testimonials, setTestimonials] = useState([]);
  const [ownTestimonials, setOwnTestimonials] = useState([]);
  const [adminTestimonials, setAdminTestimonials] = useState([]);
  const [filter, setFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    rating: 5,
    message: '',
    useProfileImage: true,
    showLevel: true,
    showTeamSize: false,
  });
  const [editingId, setEditingId] = useState('');
  const [editingForm, setEditingForm] = useState({ title: '', rating: 5, message: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const applyState = useCallback((state) => {
    if (!state) {
      return;
    }

    setTestimonials(state.testimonials || []);
    setOwnTestimonials(state.ownTestimonials || []);
    setAdminTestimonials(state.adminTestimonials || []);
  }, []);

  const loadTestimonials = useCallback(async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    try {
      const state = await communityRequest('testimonial-state', {}, token);
      applyState(state);
    } catch (error) {
      setStatusMessage(error.message || copy.testimonialLoadError);
    } finally {
      setLoading(false);
    }
  }, [applyState, copy.testimonialLoadError, token]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadTestimonials();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadTestimonials]);

  const approvedTestimonials = useMemo(() => {
    const items = Array.isArray(testimonials) ? testimonials : [];
    const sorted = [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (filter === 'top') {
      return sorted.filter((item) => Number(item.rating) >= 5);
    }

    if (filter === 'success') {
      return sorted.filter((item) => `${item.title || ''} ${item.message || ''}`.toLowerCase().match(/erfolg|verkauf|kunde|team|wachstum|academy/));
    }

    if (filter === 'partner') {
      return sorted.filter((item) => item.user_id);
    }

    return sorted;
  }, [filter, testimonials]);

  const pendingOwnCount = ownTestimonials.filter((item) => item.status === 'pending').length;
  const filterOptions = [
    { id: 'all', label: copy.testimonialFilterAll },
    { id: 'partner', label: copy.testimonialFilterPartner },
    { id: 'success', label: copy.testimonialFilterSuccess },
    { id: 'top', label: copy.testimonialFilterTop },
    { id: 'newest', label: copy.testimonialFilterNewest },
  ];

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitTestimonial = async () => {
    const title = form.title.trim();
    const message = form.message.trim();

    if (!title || !message) {
      setStatusMessage(copy.testimonialRequired);
      return;
    }

    setSaving(true);
    setStatusMessage('');

    try {
      const data = await communityRequest('testimonial-submit', {
        title,
        message,
        rating: form.rating,
        useProfileImage: form.useProfileImage,
        showLevel: form.showLevel,
        showTeamSize: form.showTeamSize,
      }, token);

      applyState(data.state);
      setForm({
        title: '',
        rating: 5,
        message: '',
        useProfileImage: true,
        showLevel: true,
        showTeamSize: false,
      });
      setFormOpen(false);
      setStatusMessage(copy.testimonialSavedPending);
    } catch (error) {
      setStatusMessage(error.message || copy.testimonialAdminUpdateError);
    } finally {
      setSaving(false);
    }
  };

  const updateAdminTestimonial = async (testimonialId, changes) => {
    setStatusMessage('');
    const testimonial = adminTestimonials.find((item) => item.id === testimonialId);
    const actionTitle = changes.status === 'approved'
      ? 'Testimonial freigeben'
      : changes.status === 'rejected'
        ? 'Testimonial ablehnen'
        : changes.hidden === true
          ? 'Testimonial ausblenden'
          : 'Testimonial administrativ bearbeiten';

    if (!confirmAdminAction({
      title: actionTitle,
      target: testimonial?.title || testimonialId || 'Testimonial ohne ID',
      consequences: [
        'Der Testimonial-Status oder Inhalt wird dauerhaft gespeichert.',
        'Die Sichtbarkeit im Partnerbereich kann sich dadurch ändern.',
        'Vorherige Inhalte oder Statuswerte sind ohne Backup nicht automatisch wiederherstellbar.',
      ],
    })) {
      return false;
    }

    try {
      const data = await communityRequest('testimonial-admin-update', { id: testimonialId, ...changes }, token);
      applyState(data.state);
      setEditingId('');
      setStatusMessage(copy.testimonialUpdated);
      return true;
    } catch (error) {
      setStatusMessage(error.message || copy.testimonialAdminUpdateError);
      return false;
    }
  };

  const deleteAdminTestimonial = async (testimonialId) => {
    const testimonial = adminTestimonials.find((item) => item.id === testimonialId);

    if (!confirmAdminAction({
      title: 'Testimonial endgültig löschen',
      target: testimonial?.title || testimonialId || 'Testimonial ohne ID',
      consequences: [
        'Das Testimonial wird dauerhaft aus der Academy entfernt.',
        'Partner sehen dieses Testimonial danach nicht mehr.',
        'Die Löschung ist ohne Backup nicht rückgängig zu machen.',
      ],
      requiredInput: ADMIN_DELETE_CONFIRMATION,
    })) {
      return;
    }

    setStatusMessage('');

    try {
      const data = await communityRequest('testimonial-admin-delete', { id: testimonialId }, token);
      applyState(data.state);
      setStatusMessage(copy.testimonialDeleted);
    } catch (error) {
      setStatusMessage(error.message || copy.testimonialDeleteError);
    }
  };

  const beginEdit = (item) => {
    setEditingId(item.id);
    setEditingForm({
      title: item.title || '',
      rating: Number(item.rating || 5),
      message: item.message || '',
    });
  };

  const saveEdit = async (item) => {
    await updateAdminTestimonial(item.id, {
      title: editingForm.title,
      rating: editingForm.rating,
      message: editingForm.message,
    });
  };

  return (
    <section className="space-y-5">
      <Panel title={copy.testimonialsTitle} icon={Star}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="max-w-3xl text-sm leading-relaxed text-white/60">
              {copy.testimonialsIntro}
            </p>
            {pendingOwnCount > 0 && (
              <p className="mt-3 inline-flex rounded-full border border-yellow-300/25 bg-yellow-400/10 px-4 py-2 text-xs font-bold text-yellow-100">
                {pendingOwnCount} {copy.testimonialPendingNotice}
              </p>
            )}
          </div>
          <Button type="button" onClick={() => setFormOpen((current) => !current)} className="w-full rounded-2xl bg-yellow-400 px-5 py-3 font-black text-black hover:bg-yellow-300 sm:w-auto">
            <Star size={18} /> {copy.testimonialWrite}
          </Button>
        </div>

        {formOpen && (
          <div className="mt-5 rounded-3xl border border-yellow-300/20 bg-black/30 p-4 sm:p-5">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
              <Input label={copy.testimonialTitleLabel} value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder={copy.testimonialPlaceholder} />
              <div>
                <p className="mb-2 text-xs text-white/50">{copy.testimonialRatingLabel}</p>
                <div className="flex flex-wrap gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => updateForm('rating', star)}
                      className={`rounded-xl border px-3 py-2 transition ${star <= form.rating ? 'border-yellow-200/60 bg-yellow-400/20 text-yellow-200' : 'border-white/10 bg-white/5 text-white/35 hover:bg-white/10'}`}
                      aria-label={`${star} Sterne`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Textarea
              label={copy.testimonialExperienceLabel}
              value={form.message}
              onChange={(event) => updateForm('message', event.target.value)}
              placeholder={copy.testimonialPlaceholder}
              rows={5}
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ['useProfileImage', copy.testimonialUseProfile],
                ['showLevel', copy.testimonialShowLevel],
                ['showTeamSize', copy.testimonialShowTeam],
              ].map(([field, label]) => (
                <label key={field} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm text-white/70">
                  <input type="checkbox" checked={form[field]} onChange={(event) => updateForm(field, event.target.checked)} className="mt-1 accent-yellow-400" />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button type="button" disabled={saving} onClick={submitTestimonial} className="rounded-2xl bg-yellow-400 px-5 py-3 font-black text-black hover:bg-yellow-300 disabled:opacity-60">
                {saving ? copy.saving : copy.testimonialSubmit}
              </Button>
              <Button type="button" onClick={() => setFormOpen(false)} className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 hover:bg-white/15">
                {copy.cancel}
              </Button>
            </div>
          </div>
        )}

        {statusMessage && <AuthMessage>{statusMessage}</AuthMessage>}
      </Panel>

      <div className="flex max-w-full flex-wrap gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFilter(option.id)}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition ${filter === option.id ? 'border-yellow-200/60 bg-yellow-400/20 text-yellow-100 shadow-lg shadow-yellow-500/10' : 'border-white/10 bg-black/25 text-white/60 hover:border-yellow-300/30 hover:text-yellow-100'}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Panel title={copy.testimonialLoadingTitle} icon={Clock}>
          <p className="text-sm text-white/60">{copy.testimonialLoadingText}</p>
        </Panel>
      ) : approvedTestimonials.length === 0 ? (
        <Panel title={copy.testimonialEmptyTitle} icon={Star}>
          <div className="rounded-3xl border border-yellow-300/15 bg-black/25 p-5 text-center">
            <p className="text-base font-bold text-yellow-100">{copy.testimonialEmptyTitle}</p>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
              {copy.testimonialEmptyText}
            </p>
            <Button type="button" onClick={() => setFormOpen(true)} className="mt-5 rounded-2xl bg-yellow-400 px-5 py-3 font-black text-black hover:bg-yellow-300">
              <Star size={18} /> {copy.testimonialWrite}
            </Button>
          </div>
        </Panel>
      ) : (
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {approvedTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} copy={copy} />
          ))}
        </section>
      )}

      {isAdmin && (
        <Panel title={copy.testimonialAdminTitle} icon={UserCheck}>
          {adminTestimonials.length === 0 ? (
            <p className="rounded-3xl border border-white/10 bg-black/25 p-5 text-sm text-white/60">
              {copy.testimonialAdminEmpty}
            </p>
          ) : (
            <div className="grid gap-4">
              {adminTestimonials.map((item) => (
                <div key={item.id} className="rounded-3xl border border-white/10 bg-black/25 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${item.status === 'approved' ? 'bg-green-400/15 text-green-100' : item.status === 'rejected' ? 'bg-red-400/15 text-red-100' : 'bg-yellow-400/15 text-yellow-100'}`}>
                          {item.hidden ? 'Ausgeblendet' : formatPartnerStatus(item.status)}
                        </span>
                        <span className="text-xs text-white/45">{formatAdminDate(item.created_at)}</span>
                      </div>
                      {editingId === item.id ? (
                        <div className="mt-4 space-y-3">
                          <Input label={copy.testimonialTitleLabel} value={editingForm.title} onChange={(event) => setEditingForm((current) => ({ ...current, title: event.target.value }))} />
                          <Textarea label={copy.testimonialExperienceLabel} value={editingForm.message} onChange={(event) => setEditingForm((current) => ({ ...current, message: event.target.value }))} rows={4} />
                          <div className="flex flex-wrap gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setEditingForm((current) => ({ ...current, rating: star }))}
                                className={`rounded-xl border px-3 py-2 ${star <= editingForm.rating ? 'border-yellow-200/60 bg-yellow-400/20 text-yellow-200' : 'border-white/10 bg-white/5 text-white/35'}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button type="button" onClick={() => saveEdit(item)} className="rounded-2xl bg-yellow-400 px-4 py-2 text-sm font-black text-black hover:bg-yellow-300">
                              {copy.save}
                            </Button>
                            <Button type="button" onClick={() => setEditingId('')} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
                              {copy.cancel}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-yellow-300">{item.name || 'Partner'} · {item.level || 'Partner'}</p>
                          <p className="mt-2 break-words text-lg font-black text-white">{item.title}</p>
                          <p className="mt-2 break-words text-sm leading-relaxed text-white/65">{item.message}</p>
                          <p className="mt-3 text-sm text-yellow-200">{'★'.repeat(Number(item.rating || 0))}{'☆'.repeat(Math.max(0, 5 - Number(item.rating || 0)))}</p>
                        </>
                      )}
                    </div>
                    <div className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:max-w-xs lg:justify-end">
                      <Button type="button" onClick={() => updateAdminTestimonial(item.id, { status: 'approved', hidden: false })} className="rounded-2xl bg-green-400/15 px-3 py-2 text-xs font-bold text-green-100 hover:bg-green-400/25">
                        <CheckCircle2 size={15} /> {copy.testimonialApprove}
                      </Button>
                      <Button type="button" onClick={() => updateAdminTestimonial(item.id, { status: 'rejected' })} className="rounded-2xl bg-red-400/15 px-3 py-2 text-xs font-bold text-red-100 hover:bg-red-400/25">
                        <X size={15} /> {copy.reject}
                      </Button>
                      <Button type="button" onClick={() => updateAdminTestimonial(item.id, { hidden: true })} className="rounded-2xl bg-white/10 px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/15">
                        {copy.testimonialHide}
                      </Button>
                      <Button type="button" onClick={() => beginEdit(item)} className="rounded-2xl bg-yellow-400/15 px-3 py-2 text-xs font-bold text-yellow-100 hover:bg-yellow-400/25">
                        {copy.testimonialEdit}
                      </Button>
                      <Button type="button" onClick={() => deleteAdminTestimonial(item.id)} className="rounded-2xl bg-red-500/15 px-3 py-2 text-xs font-bold text-red-100 hover:bg-red-500/25 sm:col-span-2">
                        <Trash2 size={15} /> {copy.delete}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      )}
    </section>
  );
}

function TestimonialCard({ testimonial, copy }) {
  const rating = Math.min(5, Math.max(1, Number(testimonial.rating || 5)));
  const displayDate = testimonial.created_at ? new Date(testimonial.created_at).toLocaleDateString('de-DE') : '';
  const levelLine = [testimonial.partner_status || copy.testimonialPartnerFallback, testimonial.level, testimonial.team_size ? `${testimonial.team_size} Team` : '']
    .filter(Boolean)
    .join(' · ');

  return (
    <Card className="max-w-full overflow-hidden rounded-[1.5rem] border border-yellow-300/15 bg-gradient-to-br from-white/[0.07] via-black/25 to-yellow-400/[0.06] text-white shadow-xl shadow-black/20 sm:rounded-[2rem]">
      <CardContent className="p-4 sm:p-5">
        <div className="flex min-w-0 items-start gap-3">
          {testimonial.profile_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={testimonial.profile_image} alt={testimonial.name || copy.testimonialPartnerFallback} className="h-14 w-14 shrink-0 rounded-full border border-yellow-200/35 object-cover" />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-yellow-300/25 bg-yellow-400/10 text-lg font-black text-yellow-100">
              {String(testimonial.name || 'P').slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="break-words font-black text-yellow-50">{testimonial.name || copy.testimonialPartnerFallback}</p>
            <p className="mt-1 break-words text-xs font-semibold text-white/45">{levelLine}</p>
          </div>
        </div>
        <p className="mt-5 text-lg text-yellow-200" aria-label={`${rating} ${copy.testimonialStarsLabel}`}>
          {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
        </p>
        <h3 className="mt-3 break-words text-xl font-black leading-tight text-white">&ldquo;{testimonial.title}&rdquo;</h3>
        <p className="mt-3 break-words text-sm leading-relaxed text-white/65">{testimonial.message}</p>
        {displayDate && <p className="mt-5 text-xs font-semibold text-white/40">{displayDate}</p>}
      </CardContent>
    </Card>
  );
}

function Header({ partner, soundOn, onAnthemPlay, onAnthemPause, anthemOpen, setAnthemOpen, anthemBlocked, volume, setVolume, muted, setMuted, userPausedAnthem, isVideoActive, isVideoPlaying, selectedLanguage, setSelectedLanguage, copy, onLogout }) {
  return (
    <header className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
      <div className="flex items-center gap-4">
        <CareerAvatar partner={partner} size="sm" />
        <div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-semibold uppercase tracking-[0.25em] text-yellow-300">
            {copy.premiumPartnerSystem}
          </motion.p>
          <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-2 text-3xl font-black md:text-5xl">
            {copy.welcome}, {partner?.firstName || 'Partner'}
          </motion.h2>
          <p className="mt-2 text-white/55">{copy.headerSubtitle}</p>
        </div>
      </div>
      <div className="relative flex flex-wrap items-center gap-3">
        <Select label="" options={languages} value={selectedLanguage} onChange={setSelectedLanguage} small />
        <AnthemButton
          soundOn={soundOn}
          onPlay={onAnthemPlay}
          onPause={onAnthemPause}
          open={anthemOpen}
          setOpen={setAnthemOpen}
          blocked={anthemBlocked}
          volume={volume}
          setVolume={setVolume}
          muted={muted}
          setMuted={setMuted}
          userPaused={userPausedAnthem}
          videoActive={isVideoActive}
          videoPlaying={isVideoPlaying}
          copy={copy}
        />
        <Button onClick={onLogout} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 hover:bg-white/15">
          <LogOut size={18} /> {copy.logout}
        </Button>
      </div>
    </header>
  );
}

function AnthemButton({ soundOn, onPlay, onPause, open, setOpen, blocked, volume, setVolume, muted, setMuted, userPaused, videoActive, videoPlaying, copy }) {
  const percent = Math.round(volume * 100);
  const popupRef = useRef(null);
  const status = videoActive ? 'video' : blocked ? 'blocked' : muted ? 'muted' : soundOn ? 'playing' : 'paused';
  const equalizerActive = status === 'playing';
  const title = blocked ? copy.harborAnthemActivate : 'Harbor Anthem';
  const subtitle = videoActive ? copy.anthemPausedForVideo : blocked ? copy.anthemBlockedHint : 'The Sound of Success';
  const Icon = videoActive ? PauseCircle : blocked || muted ? VolumeX : userPaused || !soundOn ? PauseCircle : Music2;
  const statusLabel = {
    playing: copy.anthemStatusPlaying,
    blocked: copy.anthemStatusActivate,
    paused: copy.anthemStatusPaused,
    muted: copy.anthemMuted,
    video: copy.anthemPausedForVideo,
  }[status];

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const closeOnOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', closeOnOutside);
    document.addEventListener('touchstart', closeOnOutside);

    return () => {
      document.removeEventListener('mousedown', closeOnOutside);
      document.removeEventListener('touchstart', closeOnOutside);
    };
  }, [open, setOpen]);

  const handleMainClick = () => {
    setOpen(true);

    if (videoActive) {
      return;
    }

    if (blocked || !soundOn) {
      onPlay();
    }
  };

  return (
    <div className="relative" ref={popupRef}>
      <style>{`
        @keyframes harborPulse {
          0%, 100% { box-shadow: 0 0 0 rgba(245, 198, 66, 0.12), 0 0 24px rgba(245, 198, 66, 0.18); }
          50% { box-shadow: 0 0 18px rgba(245, 198, 66, 0.28), 0 0 42px rgba(245, 198, 66, 0.24); }
        }
        @keyframes harborBlockedPulse {
          0%, 100% { box-shadow: 0 0 0 rgba(245, 198, 66, 0.18), 0 0 28px rgba(245, 198, 66, 0.24); }
          50% { box-shadow: 0 0 22px rgba(245, 198, 66, 0.46), 0 0 58px rgba(245, 198, 66, 0.34); }
        }
        @keyframes harborWaveLeft {
          0%, 100% { transform: translateX(0) scaleX(0.9); opacity: .35; }
          50% { transform: translateX(-5px) scaleX(1.08); opacity: .65; }
        }
        @keyframes harborWaveRight {
          0%, 100% { transform: translateX(0) scaleX(0.9); opacity: .35; }
          50% { transform: translateX(5px) scaleX(1.08); opacity: .65; }
        }
        @keyframes harborEq {
          0%, 100% { transform: scaleY(.35); }
          50% { transform: scaleY(1); }
        }
        .harbor-anthem-pill { animation: harborPulse 3s ease-in-out infinite; }
        .harbor-anthem-blocked { animation: harborBlockedPulse 2.1s ease-in-out infinite; }
        .harbor-wave-left { animation: harborWaveLeft 3.2s ease-in-out infinite; }
        .harbor-wave-right { animation: harborWaveRight 3.2s ease-in-out infinite; }
        .harbor-eq-active span { animation: harborEq 1.05s ease-in-out infinite; transform-origin: bottom; }
        .harbor-eq-active span:nth-child(2) { animation-delay: .14s; }
        .harbor-eq-active span:nth-child(3) { animation-delay: .28s; }
        .harbor-eq-active span:nth-child(4) { animation-delay: .42s; }
        .harbor-volume::-webkit-slider-thumb { appearance: none; height: 18px; width: 18px; border-radius: 9999px; background: #f7c948; border: 2px solid #fff2a8; box-shadow: 0 0 16px rgba(247, 201, 72, .75); }
        .harbor-volume::-webkit-slider-runnable-track { height: 8px; border-radius: 9999px; background: linear-gradient(90deg, #f7c948 var(--harbor-volume), rgba(255,255,255,.14) var(--harbor-volume)); }
        .harbor-volume::-moz-range-thumb { height: 18px; width: 18px; border-radius: 9999px; background: #f7c948; border: 2px solid #fff2a8; box-shadow: 0 0 16px rgba(247, 201, 72, .75); }
        .harbor-volume::-moz-range-track { height: 8px; border-radius: 9999px; background: rgba(255,255,255,.14); }
        .harbor-volume::-moz-range-progress { height: 8px; border-radius: 9999px; background: #f7c948; }
      `}</style>
      <button
        type="button"
        onClick={handleMainClick}
        aria-label={title}
        className={`harbor-anthem-pill group relative flex min-h-[64px] w-full min-w-[260px] items-center gap-3 overflow-hidden rounded-full border border-yellow-300/45 bg-gradient-to-r from-[#090909] via-[#17130c] to-[#090909] px-4 py-3 text-left shadow-lg shadow-yellow-500/15 transition duration-300 hover:scale-[1.025] hover:border-yellow-200/80 hover:shadow-yellow-400/30 active:scale-[0.985] sm:w-auto ${blocked ? 'harbor-anthem-blocked ring-2 ring-yellow-300/40' : ''} ${videoActive ? 'ring-2 ring-yellow-300/25' : ''}`}
      >
        <span className="harbor-wave-left pointer-events-none absolute left-1 top-1/2 h-10 w-12 -translate-y-1/2 rounded-full border-l border-yellow-300/45" />
        <span className="harbor-wave-right pointer-events-none absolute right-1 top-1/2 h-10 w-12 -translate-y-1/2 rounded-full border-r border-yellow-300/45" />

        <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-100 via-yellow-400 to-yellow-800 text-black shadow-lg shadow-yellow-500/40">
          <Icon size={21} />
          <span className="absolute inset-0 rounded-full border border-yellow-100/70 opacity-70 transition group-hover:scale-110" />
        </span>
        <span className="relative z-10 min-w-0 flex-1">
          <span className="hidden text-sm font-black uppercase tracking-[0.12em] text-yellow-100 sm:block">{title}</span>
          <span className="block text-sm font-black uppercase tracking-[0.12em] text-yellow-100 sm:hidden">Anthem</span>
          <span className="hidden text-xs text-white/55 sm:block">{subtitle}</span>
          <span className="mt-1 flex items-center gap-2 text-[11px] font-semibold text-white/60">
            <span className={`h-2 w-2 rounded-full ${status === 'playing' ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,.9)]' : status === 'blocked' || status === 'video' ? 'bg-yellow-300 shadow-[0_0_10px_rgba(250,204,21,.9)]' : 'bg-white/35'}`} />
            {statusLabel}
          </span>
        </span>
        <span className={`relative z-10 flex h-9 shrink-0 items-end gap-1 ${equalizerActive ? 'harbor-eq-active' : ''}`}>
          {[46, 78, 56, 92, 64].map((height) => <span key={height} className={`w-1.5 rounded-full ${muted || !soundOn ? 'bg-yellow-200/35' : 'bg-gradient-to-t from-yellow-700 via-yellow-300 to-yellow-100'}`} style={{ height: `${height}%` }} />)}
        </span>
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.18 }}
          className="absolute right-0 z-30 mt-3 w-80 max-w-[calc(100vw-2rem)] rounded-3xl border border-yellow-300/35 bg-[#0c0b08]/95 p-5 text-white shadow-2xl shadow-yellow-500/25 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xl font-black text-yellow-100">Volume</p>
              <p className="text-xs text-white/50">Harbor Anthem · The Sound of Success</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full bg-white/10 p-2 hover:bg-white/15">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={soundOn ? onPause : onPlay} disabled={videoActive && !soundOn} className="rounded-2xl bg-yellow-400 py-3 font-bold text-black hover:bg-yellow-300 disabled:opacity-60">
              {soundOn ? <PauseCircle size={17} /> : <PlayCircle size={17} />}
              {videoActive && !soundOn ? copy.anthemStatusPaused : soundOn ? copy.harborAnthemPause : copy.harborAnthemActivate}
            </Button>
            <Button onClick={() => setMuted(!muted)} className="rounded-2xl border border-white/10 bg-white/10 py-3 font-bold hover:bg-white/15">
              {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              {muted ? 'Stumm' : 'Stummschalten'}
            </Button>
          </div>
          {videoActive && (
            <p className="mt-3 rounded-2xl border border-yellow-300/20 bg-yellow-400/10 px-3 py-2 text-xs font-semibold text-yellow-100">
              {copy.anthemPausedForVideo}{videoPlaying ? '' : ' · Video ist pausiert/geöffnet'}
            </p>
          )}
          <label className="mt-5 block">
            <span className="mb-3 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-semibold text-yellow-100">
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                Lautstärke
              </span>
              <span>{percent}%</span>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={percent}
              onChange={(event) => {
                setVolume(Number(event.target.value) / 100);
                setMuted(false);
              }}
              style={{ '--harbor-volume': `${percent}%` }}
              className="harbor-volume w-full appearance-none bg-transparent"
            />
          </label>
          <div className="mt-3 flex items-center justify-between text-xs text-white/45">
            <span>0%</span>
            <span>100%</span>
          </div>
          <div className="mt-3 flex items-center justify-between px-1">
            {Array.from({ length: 11 }).map((_, index) => <span key={index} className={`h-1.5 w-1.5 rounded-full ${index * 10 <= percent ? 'bg-yellow-300' : 'bg-white/15'}`} />)}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function PanelHeader({ title, text, onLogoClick }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-white/50">{text}</p>
      </div>
      {onLogoClick ? (
        <button type="button" onClick={onLogoClick} aria-label="Admin Login" className="rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-300/70">
          <BrandMark />
        </button>
      ) : (
        <BrandMark />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const tone = {
    approved: 'bg-green-400/20 text-green-200',
    paused: 'bg-red-400/20 text-red-200',
    blocked: 'bg-red-400/20 text-red-200',
    rejected: 'bg-red-400/20 text-red-200',
    review: 'bg-blue-400/20 text-blue-200',
    pending: 'bg-yellow-400/20 text-yellow-200',
  }[status] || 'bg-yellow-400/20 text-yellow-200';

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone}`}>
      {formatPartnerStatus(status)}
    </span>
  );
}

function Shell({ children }) {
  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-[#080808] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(47,94,137,0.22),transparent_30%)]" />
      <div className="relative max-w-full overflow-x-hidden">{children}</div>
    </div>
  );
}

function FooterInstagramLink() {
  return (
    <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-5">
      <Link
        href="/impressum"
        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/25 px-5 py-3 text-sm font-bold text-white/70 transition hover:border-yellow-200/50 hover:bg-yellow-400/10 hover:text-yellow-100"
      >
        Impressum
      </Link>
      <Link
        href="/nutzungsbedingungen"
        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/25 px-5 py-3 text-sm font-bold text-white/70 transition hover:border-yellow-200/50 hover:bg-yellow-400/10 hover:text-yellow-100"
      >
        Nutzungsbedingungen
      </Link>
      <Link
        href="/datenschutz"
        className="inline-flex items-center justify-center rounded-full border border-white/10 bg-black/25 px-5 py-3 text-sm font-bold text-white/70 transition hover:border-yellow-200/50 hover:bg-yellow-400/10 hover:text-yellow-100"
      >
        Datenschutz
      </Link>
    </footer>
  );
}

function Brand() {
  return (
    <BrandLogo className="h-16 w-auto object-contain md:h-20" />
  );
}

function BrandMark() {
  return <BrandLogo className="h-20 w-auto object-contain md:h-24" />;
}

function BrandLogo({ className }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={BRAND_LOGO_URL} alt="Harbor Global Partner Academy" className={className} />;
}

function Input({ label, password, type = 'text', ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-white/50">{label}</span>
      <input
        type={password ? 'password' : type}
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-300/70"
        {...props}
      />
    </label>
  );
}

function Textarea({ label, ...props }) {
  return (
    <label className="mt-4 block">
      <span className="mb-1 block text-xs text-white/50">{label}</span>
      <textarea
        rows={3}
        className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 outline-none focus:border-yellow-300/70"
        {...props}
      />
    </label>
  );
}

function Select({ label, options, value, onChange, small }) {
  return (
    <label className={small ? '' : 'block'}>
      {label && <span className="mb-1 block text-xs text-white/50">{label}</span>}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 outline-none focus:border-yellow-300/70">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function AuthMessage({ children }) {
  return <div className="mt-4 rounded-2xl border border-yellow-400/25 bg-yellow-400/10 px-4 py-3 text-sm text-yellow-100">{children}</div>;
}

function MiniFeature({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
      <Icon className="mb-3 text-yellow-300" size={22} />
      <p className="font-bold">{title}</p>
      <p className="mt-1 text-xs text-white/50">{text}</p>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="group relative min-w-0 max-w-full overflow-hidden rounded-[1.5rem] border border-yellow-300/15 bg-gradient-to-br from-white/[0.08] via-black/25 to-yellow-400/[0.08] p-4 shadow-lg shadow-black/20 transition hover:border-yellow-200/35 hover:shadow-yellow-500/15 sm:rounded-[1.75rem] sm:p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-200/60 to-transparent" />
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
        <Icon size={21} />
      </div>
      <p className="min-w-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/45 sm:text-xs sm:tracking-[0.16em]">{label}</p>
      <p className="mt-2 min-w-0 break-words text-xl font-black leading-tight text-yellow-50 sm:text-2xl">{value}</p>
    </div>
  );
}

function Panel({ title, icon: Icon, children }) {
  return (
    <Card className="max-w-full overflow-hidden rounded-[1.5rem] border border-yellow-300/15 bg-gradient-to-br from-white/[0.07] via-white/[0.035] to-black/20 text-white shadow-xl shadow-black/20 backdrop-blur-xl sm:rounded-[2rem]">
      <CardContent className="p-4 sm:p-5 md:p-6">
        <h3 className="mb-5 flex min-w-0 flex-wrap items-center gap-2 break-words text-xl font-bold sm:text-2xl">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/[0.12] text-yellow-200 ring-1 ring-yellow-300/20">
            <Icon size={19} />
          </span>
          <span className="min-w-0 break-words">{title}</span>
        </h3>
        {children}
      </CardContent>
    </Card>
  );
}
