'use client';

import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crown,
  FileQuestion,
  Flame,
  Phone,
  Settings,
  ShieldCheck,
  Star,
  Target,
  Trophy,
  UserCheck,
  Users,
  Video,
} from 'lucide-react';
import { Button } from './ui';
import { CampaignSuccessHint } from './campaign-center';

const successStatusMeta = {
  open: { label: 'Offen', className: 'border-yellow-300/25 bg-yellow-400/10 text-yellow-100' },
  progress: { label: 'In Bearbeitung', className: 'border-blue-300/25 bg-blue-400/10 text-blue-100' },
  done: { label: 'Erledigt', className: 'border-green-300/25 bg-green-400/10 text-green-100' },
};

const successTaskTypeMeta = {
  video: { label: 'Video ansehen', icon: Video },
  quiz: { label: 'Quiz abschließen', icon: FileQuestion },
  module: { label: 'Modul beenden', icon: BookOpen },
  profile: { label: 'Profil vervollständigen', icon: UserCheck },
  calendar: { label: 'Termin buchen', icon: CalendarDays },
  leader: { label: 'Leader kontaktieren', icon: Crown },
};

const taskEngineStatusMeta = {
  open: { label: 'Offen', className: 'border-yellow-300/25 bg-yellow-400/10 text-yellow-100' },
  today: { label: 'Heute', className: 'border-orange-300/25 bg-orange-400/10 text-orange-100' },
  progress: { label: 'In Bearbeitung', className: 'border-blue-300/25 bg-blue-400/10 text-blue-100' },
  done: { label: 'Erledigt', className: 'border-green-300/25 bg-green-400/10 text-green-100' },
  overdue: { label: 'Überfällig', className: 'border-red-300/25 bg-red-400/10 text-red-100' },
};

const taskEnginePriorityMeta = {
  high: { label: 'Hoch', className: 'border-red-300/25 bg-red-400/10 text-red-100' },
  medium: { label: 'Mittel', className: 'border-yellow-300/25 bg-yellow-400/10 text-yellow-100' },
  low: { label: 'Niedrig', className: 'border-white/10 bg-white/10 text-white/58' },
};

const taskEngineTypeBlueprints = [
  { id: 'module-view', label: 'Modul ansehen', role: 'Partner', icon: Video, text: 'Aus vorhandenen Academy- und Fortschrittsdaten ableitbar.' },
  { id: 'quiz-complete', label: 'Quiz abschließen', role: 'Partner', icon: FileQuestion, text: 'Aktuell lokal vorbereitet; persistenter Quizstatus braucht spätere Speicherung.' },
  { id: 'profile-complete', label: 'Profil vervollständigen', role: 'Partner', icon: UserCheck, text: 'Aus bestehenden Profilfeldern ableitbar, ohne neue Datenhaltung.' },
  { id: 'calendar-booking', label: 'Termin buchen', role: 'Partner', icon: CalendarDays, text: 'Verweist weiter auf den bestehenden Kalenderbereich.' },
  { id: 'leader-contact', label: 'Leader kontaktieren', role: 'Partner', icon: Crown, text: 'Benötigt später Sponsor-/Upline-Struktur für echte Zuweisung.' },
  { id: 'team-meeting', label: 'Teammeeting besuchen', role: 'Leader', icon: Users, text: 'Teamaufgaben brauchen später Leader-Scope und Teamzuordnung.' },
  { id: 'product-training', label: 'Produkttraining', role: 'Partner', icon: BookOpen, text: 'Kann später mit Modul- oder Growth-Center-Inhalten verknüpft werden.' },
  { id: 'marketing-task', label: 'Marketingaufgabe', role: 'Partner', icon: Star, text: 'Grundlage für spätere Growth-/Marketing-Aufgaben.' },
  { id: 'follow-up', label: 'Follow-up', role: 'Leader', icon: Phone, text: 'Soll später aus Team-, CRM- oder Kalenderdaten entstehen.' },
  { id: 'custom-task', label: 'Eigene Aufgabe', role: 'Admin', icon: Settings, text: 'Benötigt persistente Task-Erstellung und Berechtigungsprüfung.' },
];

const taskEngineBackendPlan = {
  tables: ['academy_task_templates', 'academy_task_assignments', 'academy_task_events', 'academy_task_comments'],
  endpoints: ['task-list', 'task-create', 'task-update-status', 'task-assign', 'task-comment'],
  permissions: [
    'Partner: nur eigene Aufgaben lesen und eigene Statusänderungen schreiben.',
    'Leader: nur Teamaufgaben und eigene Teammitglieder lesen.',
    'Admin: globale Aufgaben, Systemaufgaben und Vorlagen verwalten.',
  ],
  risks: [
    'Keine Task-Daten in avatar_url oder Profilbild-Metadaten speichern.',
    'RLS und Serverautorisierung müssen Rollen und Teamzuordnung prüfen.',
    'Task-Status darf später nicht allein vom Client vertraut werden.',
    'Reminder und Automationen dürfen erst nach idempotenter Task-Event-Struktur senden.',
  ],
};

const successFollowUpBlueprints = [
  { id: 'first-contact', title: 'Erstkontakt', text: 'Erste Kontaktaufnahme strukturiert vorbereiten.', icon: Phone },
  { id: 'callback-open', title: 'Rückruf offen', text: 'Rückrufliste später aus CRM- oder Teamdaten ableiten.', icon: Bell },
  { id: 'partner-waits', title: 'Partner wartet', text: 'Wartende Partner später priorisiert anzeigen.', icon: Clock },
  { id: 'registration-started', title: 'Registrierung begonnen', text: 'Registrierungsstatus später sauber nachverfolgen.', icon: UserCheck },
  { id: 'approval-pending', title: 'Freigabe ausstehend', text: 'Pending-Status nur aus vorhandenen Admin-Daten anzeigen.', icon: ShieldCheck },
  { id: 'module-completed', title: 'Modul abgeschlossen', text: 'Abschlüsse später als echte Follow-up-Auslöser nutzen.', icon: CheckCircle2 },
  { id: 'certificate-received', title: 'Zertifikat erhalten', text: 'Zertifikate bleiben bis zur Freigabe reine UI-Vorbereitung.', icon: Trophy },
];

function getSuccessTaskStatus(done, inProgress = false) {
  if (done) {
    return 'done';
  }

  return inProgress ? 'progress' : 'open';
}

export function buildSuccessCenterData({ partner, academyUpdates = [], localOnboardingStepIds = [], isAdmin = false, isLeader = false, partners = [], pendingPartners = [] }, dependencies) {
  const {
    getPartnerAcademySummary,
    getOnboardingAssistantSummary,
    buildNotificationCenterItems,
    formatPartnerCount,
    formatPoints,
    isAdminOperationsLeader,
    getAnalyticsPartnerProgress,
    toPartnerCount,
  } = dependencies;
  const academySummary = getPartnerAcademySummary(partner);
  const onboarding = getOnboardingAssistantSummary(partner, localOnboardingStepIds, academySummary);
  const notifications = buildNotificationCenterItems({ updates: academyUpdates, isAdmin, isLeader });
  const progress = Number(academySummary.overallProgress || partner?.academyProgress?.progressPercent || 0);
  const nextModuleTitle = academySummary.nextModule?.title || onboarding.nextStep?.title || 'Willkommen & Start';
  const profileComplete = Boolean(partner?.profileImageUrl) && Boolean(String(partner?.whatsapp || '').trim());
  const hasTeam = Boolean(String(partner?.teamName || '').trim()) || Number(partner?.teamPartnerCount || 0) > 0;
  const completedModules = Number(academySummary.completedCount || partner?.academyProgress?.completedModuleCount || 0);
  const quizDone = Boolean(partner?.academyProgress?.quizPassed || partner?.academyProgress?.latestQuizPassedAt);
  const certificationDone = Boolean(partner?.academyProgress?.certificationPassed || partner?.academyProgress?.certificationPassedAt);
  const unreadContentCount = notifications.filter((item) => item.status === 'new').length;
  const openTasks = [
    {
      id: 'profile',
      type: 'profile',
      title: 'Profil vervollständigen',
      text: profileComplete ? 'Profilbasis ist sichtbar vorhanden.' : 'Profilfoto, Telefon und Sichtbarkeit prüfen.',
      status: getSuccessTaskStatus(profileComplete, Boolean(partner?.profileImageUrl || partner?.whatsapp)),
      target: 'profile',
    },
    {
      id: 'video',
      type: 'video',
      title: `${nextModuleTitle} ansehen`,
      text: academySummary.nextModule ? 'Öffne dein nächstes Academy-Modul und lerne weiter.' : 'Starte mit dem ersten verfügbaren Academy-Inhalt.',
      status: getSuccessTaskStatus(progress >= 100, progress > 0 && progress < 100),
      target: 'modules',
    },
    {
      id: 'quiz',
      type: 'quiz',
      title: 'Erstes Quiz abschließen',
      text: quizDone ? 'Quizstatus ist vorhanden.' : 'Quiz bleibt aktuell lokal vorbereitet und wird nicht gespeichert.',
      status: getSuccessTaskStatus(quizDone, false),
      target: 'modules',
    },
    {
      id: 'module',
      type: 'module',
      title: 'Nächstes Modul beenden',
      text: completedModules > 0 ? `${completedModules} Modul(e) bereits abgeschlossen.` : 'Arbeite dein erstes Modul bis zum Ende durch.',
      status: getSuccessTaskStatus(completedModules > 0, progress > 0),
      target: 'modules',
    },
    {
      id: 'calendar',
      type: 'calendar',
      title: 'Onboarding-Termin buchen',
      text: 'Terminbuchung läuft weiterhin über den bestehenden Kalenderbereich.',
      status: 'open',
      target: 'calendar',
    },
    {
      id: 'leader',
      type: 'leader',
      title: 'Leader kontaktieren',
      text: hasTeam ? `Teamkontext vorhanden: ${partner?.teamName || `${formatPartnerCount(partner?.teamPartnerCount)} Partner`}.` : 'Direkte Upline-/Leader-Daten sind noch nicht persistent angebunden.',
      status: getSuccessTaskStatus(hasTeam, false),
      target: 'contact',
    },
  ];
  const recommendedTask = openTasks.find((task) => task.status !== 'done');
  const successes = [
    partner?.profileImageUrl && 'Profilfoto sichtbar',
    completedModules > 0 && `${completedModules} Modul(e) abgeschlossen`,
    onboarding.isComplete && 'Onboarding abgeschlossen',
    Number(partner?.aquaPoints || 0) > 0 && `${formatPoints(partner?.aquaPoints)} Punkte erfasst`,
    certificationDone && 'Zertifikat vorhanden',
  ].filter(Boolean);
  const realPartners = (partners || []).filter((item) => !item.testData && item.role !== 'admin');
  const todayKey = new Date().toDateString();
  const todaysRegistrations = realPartners.filter((item) => new Date(item.createdAt || item.registeredAt || 0).toDateString() === todayKey).length;
  const inactivePartners = realPartners.filter((item) => item.status === 'approved' && item.activityStatus?.id === 'inactive');
  const leaderPartners = realPartners.filter((item) => isAdminOperationsLeader(item));
  const academyActivePartners = realPartners.filter((item) => getAnalyticsPartnerProgress(item) > 0);
  const leaderTeamCount = toPartnerCount(partner?.teamPartnerCount || 0);
  const leaderNewPartners = toPartnerCount(partner?.teamNewPartnersSinceLastUpdate || 0);

  return {
    academySummary,
    onboarding,
    progress,
    notifications,
    unreadContentCount,
    openTasks,
    recommendedTask,
    successes,
    cards: [
      {
        id: 'today',
        title: 'Heute erledigen',
        value: openTasks.filter((task) => task.status !== 'done').length,
        text: recommendedTask?.title || 'Alle sichtbaren Aufgaben erledigt.',
        icon: Target,
        target: recommendedTask?.target || 'modules',
      },
      {
        id: 'next-learning',
        title: 'Nächster Lernschritt',
        value: progress ? `${progress}%` : 'Start',
        text: nextModuleTitle,
        icon: BookOpen,
        target: 'modules',
      },
      {
        id: 'open-tasks',
        title: 'Offene Aufgaben',
        value: openTasks.filter((task) => task.status === 'open').length,
        text: 'Aus vorhandenen Profil- und Academy-Daten abgeleitet.',
        icon: CheckCircle2,
        target: 'success',
      },
      {
        id: 'new-content',
        title: 'Neue Inhalte',
        value: unreadContentCount,
        text: unreadContentCount ? 'Neue sichtbare Academy-Meldungen.' : 'Keine neuen Inhalte für deine Rolle.',
        icon: Bell,
        target: 'news',
      },
      {
        id: 'recommendation',
        title: 'Persönliche Empfehlung',
        value: recommendedTask ? '1' : '—',
        text: recommendedTask?.title || 'Aktuell keine neue Empfehlung.',
        icon: Star,
        target: recommendedTask?.target || 'modules',
      },
      {
        id: 'appointments',
        title: 'Offene Termine',
        value: 'Vorbereitet',
        text: 'Keine echte Terminliste angebunden; Kalenderbereich öffnen.',
        icon: CalendarDays,
        target: 'calendar',
      },
      {
        id: 'successes',
        title: 'Letzte Erfolge',
        value: successes.length,
        text: successes[0] || 'Noch keine sichtbaren Erfolge aus vorhandenen Daten.',
        icon: Trophy,
        target: 'success',
      },
    ],
    leader: {
      teamCount: leaderTeamCount,
      newPartners: leaderNewPartners,
      lowProgress: '—',
      openTeamTasks: leaderTeamCount > 0 ? 'Prüfung offen' : '—',
      activity: partner?.activityStatus?.label || 'Noch nicht erfasst',
    },
    admin: {
      pending: pendingPartners.length,
      newRegistrations: todaysRegistrations,
      inactive: inactivePartners.length,
      leaderActivity: leaderPartners.length ? `${leaderPartners.length} Leader` : '—',
      academyActivity: academyActivePartners.length,
    },
  };
}

export function SuccessStatusBadge({ status }) {
  const meta = successStatusMeta[status] || successStatusMeta.open;

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] ${meta.className}`}>
      {meta.label}
    </span>
  );
}

export function SuccessOverviewCard({ card, onNavigate }) {
  const Icon = card.icon;

  return (
    <button
      type="button"
      onClick={() => onNavigate?.(card.target)}
      className="group min-w-0 rounded-[1.6rem] border border-white/10 bg-white/[0.055] p-4 text-left text-white shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-yellow-300/30 hover:bg-yellow-400/[0.08] sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200 transition group-hover:bg-yellow-400 group-hover:text-black">
          <Icon size={20} />
        </span>
        <span className="rounded-full bg-black/30 px-3 py-1 text-sm font-black text-yellow-50">{card.value}</span>
      </div>
      <h3 className="mt-4 break-words text-lg font-black text-yellow-50">{card.title}</h3>
      <p className="mt-2 break-words text-sm leading-relaxed text-white/58">{card.text}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-yellow-200">Öffnen <ChevronRight size={15} /></span>
    </button>
  );
}

export function SuccessTaskCard({ task, onNavigate }) {
  const typeMeta = successTaskTypeMeta[task.type] || successTaskTypeMeta.module;
  const Icon = typeMeta.icon;

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
          <Icon size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.1em] text-white/55">{typeMeta.label}</span>
            <SuccessStatusBadge status={task.status} />
          </div>
          <p className="mt-3 break-words font-black text-yellow-50">{task.title}</p>
          <p className="mt-2 break-words text-sm leading-relaxed text-white/55">{task.text}</p>
          <Button type="button" onClick={() => onNavigate?.(task.target)} className="mt-4 w-full rounded-2xl border border-yellow-300/25 bg-yellow-400/10 px-4 py-3 text-sm font-bold text-yellow-100 hover:bg-yellow-400/20 sm:w-auto">
            Aufgabe öffnen <ChevronRight size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SuccessFollowUpPanel({ Panel }) {
  return (
    <Panel title="Follow-up Hub vorbereitet" icon={Bell}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {successFollowUpBlueprints.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
                <Icon size={18} />
              </span>
              <p className="mt-4 font-black text-yellow-50">{item.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{item.text}</p>
              <span className="mt-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white/45">UI vorbereitet</span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

export function SuccessRecommendationPanel({ data, onNavigate, Panel, NotificationEmptyState }) {
  const recommendation = data.recommendedTask;

  return (
    <Panel title="Persönliche Empfehlung" icon={Star}>
      {recommendation ? (
        <div className="rounded-[1.5rem] border border-yellow-300/20 bg-yellow-400/10 p-5">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Nächster sinnvoller Schritt</p>
          <h3 className="mt-3 text-2xl font-black text-yellow-50">{recommendation.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/62">{recommendation.text}</p>
          <Button type="button" onClick={() => onNavigate?.(recommendation.target)} className="mt-5 w-full rounded-2xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300 sm:w-auto">
            Jetzt öffnen <ChevronRight size={15} />
          </Button>
        </div>
      ) : (
        <NotificationEmptyState title="Aktuell keine persönliche Empfehlung." text="Sobald Profil-, Lern- oder Terminstatus einen nächsten Schritt ergeben, erscheint er hier." />
      )}
    </Panel>
  );
}

export function LeaderSuccessPanel({ data, Panel }) {
  const metrics = [
    { icon: Users, label: 'Neue Partner', value: data.leader.newPartners, text: 'Aus vorhandenem Team-Aggregat am Partnerprofil.' },
    { icon: BookOpen, label: 'Partner ohne Modulstart', value: '—', text: 'Benötigt später einen serverseitig gefilterten Team-Endpunkt.' },
    { icon: Flame, label: 'Niedriger Fortschritt', value: data.leader.lowProgress, text: 'Keine personenbezogene Teamliste im Client vorhanden.' },
    { icon: Target, label: 'Offene Teamaufgaben', value: data.leader.openTeamTasks, text: 'Nur vorhandene Team-Aggregate werden verwendet.' },
    { icon: Clock, label: 'Teamaktivität', value: data.leader.activity, text: 'Aktivität aus vorhandenem Partner-/Teamstatus.' },
  ];

  return (
    <Panel title="Leader Success Center" icon={Crown}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map(({ icon: Icon, label, value, text }) => (
          <div key={label} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
            <Icon size={18} className="text-yellow-200" />
            <p className="mt-3 text-2xl font-black text-yellow-50">{value}</p>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-white/45">{label}</p>
            <p className="mt-2 text-xs leading-relaxed text-white/50">{text}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function AdminSuccessPanel({ data, Panel }) {
  const metrics = [
    { icon: Bell, label: 'Wartende Freigaben', value: data.admin.pending, text: 'Aus vorhandener Admin-Partnerliste.' },
    { icon: UserCheck, label: 'Neue Registrierungen', value: data.admin.newRegistrations, text: 'Heute erkannte Registrierungen in den geladenen Daten.' },
    { icon: Clock, label: 'Inaktive Partner', value: data.admin.inactive, text: 'Aus vorhandenem Aktivitätsstatus.' },
    { icon: Crown, label: 'Leader Aktivität', value: data.admin.leaderActivity, text: 'Leader-/Teamkandidaten aus vorhandenen Feldern.' },
    { icon: BookOpen, label: 'Academy Aktivität', value: data.admin.academyActivity, text: 'Partner mit sichtbarem Lernfortschritt.' },
  ];

  return (
    <Panel title="Admin Success Center" icon={ShieldCheck}>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {metrics.map(({ icon: Icon, label, value, text }) => (
          <div key={label} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
            <Icon size={18} className="text-yellow-200" />
            <p className="mt-3 text-2xl font-black text-yellow-50">{value}</p>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-white/45">{label}</p>
            <p className="mt-2 text-xs leading-relaxed text-white/50">{text}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function TaskEngineMetaBadge({ meta }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${meta.className}`}>
      {meta.label}
    </span>
  );
}

function getTaskEngineStatus(task) {
  if (task.status === 'done') {
    return 'done';
  }

  if (task.status === 'progress') {
    return 'progress';
  }

  if (task.id === 'video' || task.id === 'module') {
    return 'today';
  }

  return 'open';
}

function getTaskEnginePriority(task) {
  if (task.status === 'done') {
    return 'low';
  }

  if (task.id === 'profile' || task.id === 'video' || task.id === 'module') {
    return 'high';
  }

  if (task.id === 'quiz' || task.id === 'calendar' || task.id === 'leader') {
    return 'medium';
  }

  return 'low';
}

export function TaskEngineFoundationPanel({ data, isAdmin = false, isLeader = false, Panel }) {
  const derivedTasks = data.openTasks.map((task) => ({
    ...task,
    engineStatus: getTaskEngineStatus(task),
    priority: getTaskEnginePriority(task),
  }));
  const activeTaskCount = derivedTasks.filter((task) => task.engineStatus !== 'done').length;
  const roleCards = [
    {
      id: 'partner',
      title: 'Partner',
      value: activeTaskCount,
      text: 'Eigene Aufgaben werden aktuell nur aus Profil, Academy und Kalender abgeleitet.',
      icon: UserCheck,
    },
    ...(isLeader || isAdmin
      ? [
          {
            id: 'leader',
            title: 'Leader',
            value: data.leader.openTeamTasks,
            text: 'Teamaufgaben bleiben vorbereitet, bis eine saubere Teamzuordnung persistiert ist.',
            icon: Crown,
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            id: 'admin',
            title: 'Admin',
            value: data.admin.pending,
            text: 'Globale Systemaufgaben benötigen später Vorlagen, Assignments und Auditierbarkeit.',
            icon: ShieldCheck,
          },
        ]
      : []),
  ];

  return (
    <Panel title="Task Engine Foundation" icon={Target}>
      <div className="rounded-[1.5rem] border border-yellow-300/20 bg-yellow-400/10 p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-yellow-200">Architekturentscheidung</p>
        <p className="mt-2 text-sm leading-relaxed text-white/65">
          Die aktuelle Foundation ist bewusst read-only: Es gibt noch keine Task-Tabelle und keinen Task-Endpunkt. Produktive Aufgaben werden nicht in Profilbild-Metadaten oder bestehende Partnerfelder improvisiert.
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {roleCards.map(({ id, title, value, text, icon: Icon }) => (
          <div key={id} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
            <Icon size={18} className="text-yellow-200" />
            <p className="mt-3 text-2xl font-black text-yellow-50">{value}</p>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-white/45">{title}</p>
            <p className="mt-2 text-xs leading-relaxed text-white/50">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
          <p className="text-sm font-black text-yellow-50">Unterstützte Aufgabentypen</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {taskEngineTypeBlueprints.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="break-words text-sm font-black text-yellow-50">{item.label}</p>
                      <p className="mt-1 text-[11px] font-black uppercase tracking-[0.14em] text-white/40">{item.role}</p>
                      <p className="mt-2 text-xs leading-relaxed text-white/50">{item.text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
          <p className="text-sm font-black text-yellow-50">Abgeleitete Aufgaben jetzt</p>
          <div className="mt-3 space-y-3">
            {derivedTasks.map((task) => {
              const typeMeta = successTaskTypeMeta[task.type] || successTaskTypeMeta.module;
              const Icon = typeMeta.icon;

              return (
                <div key={task.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
                      <Icon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-black text-yellow-50">{task.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-white/48">Quelle: bestehende Success-Center-Daten</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <TaskEngineMetaBadge meta={taskEngineStatusMeta[task.engineStatus]} />
                        <TaskEngineMetaBadge meta={taskEnginePriorityMeta[task.priority]} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-white/45">Spätere Tabellen</p>
          <div className="mt-3 space-y-2">
            {taskEngineBackendPlan.tables.map((item) => (
              <p key={item} className="rounded-xl bg-white/[0.04] px-3 py-2 text-xs font-bold text-white/62">{item}</p>
            ))}
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-white/45">Spätere Endpunkte</p>
          <div className="mt-3 space-y-2">
            {taskEngineBackendPlan.endpoints.map((item) => (
              <p key={item} className="rounded-xl bg-white/[0.04] px-3 py-2 text-xs font-bold text-white/62">{item}</p>
            ))}
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-white/45">Berechtigungen</p>
          <div className="mt-3 space-y-2">
            {taskEngineBackendPlan.permissions.map((item) => (
              <p key={item} className="text-xs leading-relaxed text-white/55">• {item}</p>
            ))}
          </div>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-white/45">Risiken</p>
          <div className="mt-3 space-y-2">
            {taskEngineBackendPlan.risks.map((item) => (
              <p key={item} className="text-xs leading-relaxed text-white/55">• {item}</p>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function SuccessCenterSection({ partner, academyUpdates = [], localOnboardingStepIds = [], onNavigate, isAdmin = false, isLeader = false, partners = [], pendingPartners = [], compact = false, dependencies }) {
  const {
    Panel,
    Stat,
    NotificationEmptyState,
  } = dependencies;
  const data = buildSuccessCenterData({ partner, academyUpdates, localOnboardingStepIds, isAdmin, isLeader, partners, pendingPartners }, dependencies);

  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-400/[0.16] via-white/[0.055] to-black/45 p-5 text-white shadow-2xl shadow-yellow-500/10 sm:p-6 lg:p-8">
        <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-200">Success Center</p>
            <h2 className="mt-3 break-words text-3xl font-black text-yellow-50 sm:text-4xl">Was muss ich heute tun?</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65 sm:text-base">
              Dein täglicher Fokus aus vorhandenen Profil-, Academy-, Termin- und Rolleninformationen. Keine Speicherung, kein CRM, kein Versand – nur sichere Orientierung.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <Stat icon={Target} label="Offene Aufgaben" value={data.openTasks.filter((task) => task.status !== 'done').length} />
            <Stat icon={BookOpen} label="Lernfortschritt" value={`${data.progress}%`} />
            <Stat icon={Trophy} label="Erfolge" value={data.successes.length} />
          </div>
        </div>
      </div>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {data.cards.map((card) => (
          <SuccessOverviewCard key={card.id} card={card} onNavigate={onNavigate} />
        ))}
      </section>

      <CampaignSuccessHint partner={partner} isAdmin={isAdmin} isLeader={isLeader} onNavigate={onNavigate} />

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Aufgabenbereich" icon={CheckCircle2}>
          <div className="space-y-3">
            {data.openTasks.map((task) => (
              <SuccessTaskCard key={task.id} task={task} onNavigate={onNavigate} />
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-white/45">
            Aufgabenstatus ist UI-only und wird aus vorhandenen Profil- und Academy-Daten abgeleitet. Es wird nichts gespeichert.
          </p>
        </Panel>
        <SuccessRecommendationPanel data={data} onNavigate={onNavigate} Panel={Panel} NotificationEmptyState={NotificationEmptyState} />
      </section>

      {!compact && (
        <>
          <TaskEngineFoundationPanel data={data} isAdmin={isAdmin} isLeader={isLeader} Panel={Panel} />
          <SuccessFollowUpPanel Panel={Panel} />
          {isLeader && !isAdmin && <LeaderSuccessPanel data={data} Panel={Panel} />}
          {isAdmin && <AdminSuccessPanel data={data} Panel={Panel} />}
          <Panel title="Grundlage für spätere Automationen" icon={Settings}>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {['echte Aufgaben', 'CRM', 'n8n', 'WhatsApp-Automationen', 'KI-Agenten'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/62">
                  <p className="font-black text-yellow-50">{item}</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/45">Vorbereitet, aber nicht implementiert.</p>
                </div>
              ))}
            </div>
          </Panel>
        </>
      )}
    </section>
  );
}
