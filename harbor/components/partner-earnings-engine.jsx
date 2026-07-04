'use client';

import {
  AlertTriangle,
  BarChart3,
  Bell,
  Calculator,
  CheckCircle2,
  Clock,
  Coins,
  Crown,
  FileText,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { createI18nTranslator } from './i18n-extension';

const sourceDocuments = ['Karriereplan', 'Provisionsplan', 'Partnerpreisliste', 'Aktionsregeln'];

const commissionComponents = [
  {
    label: 'Grundprovision',
    description: 'Kommt später aus dem offiziellen Provisionsplan je Produkt und Level.',
  },
  {
    label: 'Differenzprovision',
    description: 'Wird später anhand Karriereplan, Upline-/Level-Regeln und Produktkontext berechnet.',
  },
  {
    label: 'Sonderboni',
    description: 'Kann später aus Kampagnen-, Produkt- oder Karriereplan-Regeln stammen.',
  },
  {
    label: 'Aktionsabzüge',
    description: 'Kann während Kampagnen Grundprovision, Bonus oder Faktor verändern.',
  },
];

const pointsComponents = [
  'Produktpunkte',
  'Menge',
  'Kampagnenpunkte',
  'Punkte-Multiplikator',
  'Bonus- oder Reduktionsregel',
  'Level-Schwellenwert',
];

const adminConfigurationGroups = [
  {
    title: 'Provisionen',
    items: ['Grundprovision', 'Differenzprovision', 'Sonderbonus', 'Fixer Abzug', 'Provisionsfaktor'],
  },
  {
    title: 'Punkte',
    items: ['Produktpunkte', 'Doppelte Punkte', 'Bonuspunkte', 'Reduzierte Punkte', 'Levelgrenzen'],
  },
  {
    title: 'Kampagnen',
    items: ['Gültigkeit', 'Produktzuordnung', 'Partnerlevel', 'Sonderregel', 'Priorität'],
  },
];

const calculationPipeline = [
  {
    title: 'Offizielle Quelle',
    text: 'Karriereplan, Provisionsplan, Partnerpreisliste oder Aktionsregel.',
    icon: FileText,
  },
  {
    title: 'Partnerkontext',
    text: 'Aktuelles Level, Rolle und später Team-/Upline-Kontext.',
    icon: Crown,
  },
  {
    title: 'Produkt & Menge',
    text: 'Produkt, Produktpunkte, Einkaufspreis und Menge.',
    icon: PackageCheck,
  },
  {
    title: 'Aktive Kampagne',
    text: 'Kundenaktion, Partneraktion, Provisions- oder Punkte-Sonderregel.',
    icon: Clock,
  },
  {
    title: 'Sicheres Ergebnis',
    text: 'Partner sieht nur eigene Werte, Leader nur Teamübersicht, Admin alle Regeln.',
    icon: ShieldCheck,
  },
];

function resolvePartnerLevel(partner) {
  const rawLevel = String(partner?.aquaLevel || partner?.level || partner?.role || '').toLowerCase();

  if (partner?.role === 'admin' || rawLevel.includes('admin')) {
    return 'Admin / Sonderstatus';
  }

  if (rawLevel.includes('leader')) {
    return 'Leader';
  }

  if (rawLevel.includes('teamleiter')) {
    return 'Teamleiter';
  }

  if (rawLevel.includes('level 5') || rawLevel.includes('lvl 5') || rawLevel.includes('stufe 5')) {
    return 'Level 5';
  }

  if (rawLevel.includes('level 4') || rawLevel.includes('lvl 4') || rawLevel.includes('stufe 4')) {
    return 'Level 4';
  }

  if (rawLevel.includes('level 3') || rawLevel.includes('lvl 3') || rawLevel.includes('stufe 3')) {
    return 'Level 3';
  }

  if (rawLevel.includes('level 2') || rawLevel.includes('lvl 2') || rawLevel.includes('stufe 2')) {
    return 'Level 2';
  }

  if (rawLevel.includes('level 1') || rawLevel.includes('lvl 1') || rawLevel.includes('stufe 1')) {
    return 'Level 1';
  }

  return 'Starter';
}

function hasNumber(value) {
  return Number.isFinite(Number(value));
}

function sumNumbers(values) {
  if (!Array.isArray(values) || values.some((value) => !hasNumber(value))) {
    return null;
  }

  return values.reduce((sum, value) => sum + Number(value), 0);
}

export function calculateCommissionPreview({
  baseCommission,
  differentialCommission,
  additionalBonuses = [],
  campaignAdjustments = [],
} = {}) {
  if (!hasNumber(baseCommission) || !hasNumber(differentialCommission)) {
    return {
      status: 'missing-source',
      total: null,
      reason: 'Offizielle Provisionsquelle fehlt.',
    };
  }

  const bonuses = sumNumbers(additionalBonuses);

  if (bonuses === null) {
    return {
      status: 'missing-source',
      total: null,
      reason: 'Bonusregeln sind noch nicht vollständig maschinenlesbar.',
    };
  }

  const adjustmentTotal = campaignAdjustments.reduce((total, adjustment) => {
    if (!hasNumber(adjustment?.value)) {
      return null;
    }

    if (total === null) {
      return null;
    }

    if (adjustment.type === 'subtract') {
      return total - Number(adjustment.value);
    }

    if (adjustment.type === 'add') {
      return total + Number(adjustment.value);
    }

    return total;
  }, 0);

  if (adjustmentTotal === null) {
    return {
      status: 'missing-source',
      total: null,
      reason: 'Aktionsregel ist noch nicht vollständig maschinenlesbar.',
    };
  }

  return {
    status: 'ready',
    total: Number(baseCommission) + Number(differentialCommission) + bonuses + adjustmentTotal,
    reason: 'Berechnung aus freigegebenen Eingabewerten möglich.',
  };
}

export function calculatePointsPreview({
  productPoints,
  quantity,
  multiplier = 1,
  bonusPoints = 0,
} = {}) {
  if (!hasNumber(productPoints) || !hasNumber(quantity)) {
    return {
      status: 'missing-source',
      totalPoints: null,
      reason: 'Produktpunkte oder Menge fehlen.',
    };
  }

  if (!hasNumber(multiplier) || !hasNumber(bonusPoints)) {
    return {
      status: 'missing-source',
      totalPoints: null,
      reason: 'Kampagnenpunkte sind noch nicht vollständig maschinenlesbar.',
    };
  }

  return {
    status: 'ready',
    totalPoints: (Number(productPoints) * Number(quantity) * Number(multiplier)) + (Number(bonusPoints) * Number(quantity)),
    reason: 'Punkteberechnung aus freigegebenen Eingabewerten möglich.',
  };
}

export function calculateLevelProgressPreview({
  currentPoints,
  earnedPoints,
  nextLevelThreshold,
} = {}) {
  if (!hasNumber(currentPoints) || !hasNumber(earnedPoints) || !hasNumber(nextLevelThreshold)) {
    return {
      status: 'missing-source',
      pointsAfterSale: null,
      pointsToNextLevel: null,
      reachesNextLevel: false,
      reason: 'Punktestand oder Levelgrenze fehlt.',
    };
  }

  const pointsAfterSale = Number(currentPoints) + Number(earnedPoints);
  const pointsToNextLevel = Math.max(0, Number(nextLevelThreshold) - pointsAfterSale);

  return {
    status: 'ready',
    pointsAfterSale,
    pointsToNextLevel,
    reachesNextLevel: pointsToNextLevel === 0,
    reason: 'Level-Fortschritt aus freigegebenen Eingabewerten möglich.',
  };
}

function SourceBadge({ children = 'Quelle offen' }) {
  return (
    <span className="inline-flex rounded-full border border-yellow-300/20 bg-yellow-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-yellow-100">
      {children}
    </span>
  );
}

function EngineMetric({ label, value, hint, icon: Icon = Target }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
      <Icon size={18} className="text-yellow-200" />
      <p className="mt-3 text-xs text-white/45">{label}</p>
      <p className="mt-1 break-words text-lg font-black text-yellow-50">{value}</p>
      {hint && <p className="mt-2 text-xs leading-relaxed text-white/45">{hint}</p>}
    </div>
  );
}

function CampaignCountdownPanel({ campaign }) {
  return (
    <div className="rounded-[1.5rem] border border-yellow-300/20 bg-yellow-400/10 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Clock size={18} className="text-yellow-100" />
        <SourceBadge>Countdown vorbereitet</SourceBadge>
      </div>
      <h3 className="mt-3 text-xl font-black text-yellow-50">Aktionszeitraum im Blick</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        {campaign?.name || 'Kampagne'} läuft im UI-Konzept von {campaign?.validFrom || 'Start offen'} bis {campaign?.validUntil || 'Ende offen'}.
        Ein echter Live-Countdown kann später aus dem freigegebenen Kampagnenzeitraum berechnet werden.
      </p>
    </div>
  );
}

function PartnerCommissionPreview({ campaign, partnerLevel, t }) {
  const productName = campaign?.partnerCampaign?.affectedProduct || campaign?.products?.[0] || 'Produkt aus Kampagne';
  const normalPreview = calculateCommissionPreview();
  const pointsPreview = calculatePointsPreview();
  const levelPreview = calculateLevelProgressPreview();

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Calculator size={18} className="text-yellow-200" />
          <SourceBadge>{t('noRealValuesInCode')}</SourceBadge>
        </div>
        <h3 className="mt-3 text-2xl font-black text-yellow-50">{t('earningsQuestion')}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/58">
          Die Antwortlogik ist vorbereitet, berechnet aber erst dann Beträge, wenn offizielle Provisions- und Preisquellen maschinenlesbar freigegeben sind.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <EngineMetric icon={PackageCheck} label="Produkt" value={productName} />
          <EngineMetric icon={Crown} label="Dein Partnerlevel" value={partnerLevel} />
          <EngineMetric icon={Coins} label="Normale Provision" value={normalPreview.reason} />
          <EngineMetric icon={Sparkles} label="Aktionsprovision" value="Kampagnenregel offen" />
          <EngineMetric icon={BarChart3} label="Punkte" value={pointsPreview.reason} />
          <EngineMetric icon={TrendingUp} label="Level-Fortschritt" value={levelPreview.reason} />
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Berechnungsreihenfolge</p>
        <div className="mt-4 space-y-3">
          {calculationPipeline.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.title} className="flex gap-3 rounded-2xl border border-white/10 bg-black/25 p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-yellow-400/10 text-yellow-100 ring-1 ring-yellow-200/15">
                  <Icon size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-yellow-50">{index + 1}. {step.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/48">{step.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PointsAndLevelPanel({ t }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
      <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <BarChart3 size={18} className="text-yellow-200" />
          <SourceBadge>{t('earningsPoints')}</SourceBadge>
        </div>
        <h3 className="mt-3 text-xl font-black text-yellow-50">{t('earningsPoints')}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/58">
          Später erkennt die Engine Produkt, Menge, Produktpunkte, Kampagnenpunkte, aktuellen Punktestand und nächstes Ziellevel. Ohne offizielle Punktetabellen wird aktuell nichts berechnet.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {pointsComponents.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm font-bold text-white/62">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-yellow-300/15 bg-yellow-400/10 p-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Partnerantwort vorbereitet</p>
        <div className="mt-4 space-y-3 text-sm text-white/64">
          <p><span className="font-black text-yellow-50">Produkt:</span> aus offizieller Produktquelle</p>
          <p><span className="font-black text-yellow-50">Menge:</span> aus Partnerfrage oder Eingabe</p>
          <p><span className="font-black text-yellow-50">Provision:</span> aus freigegebenem Provisionsplan</p>
          <p><span className="font-black text-yellow-50">Punkte:</span> aus Produktpunkte-Tabelle</p>
          <p><span className="font-black text-yellow-50">Level-Hinweis:</span> nur mit freigegebenen Levelgrenzen</p>
        </div>
      </div>
    </div>
  );
}

function AdminEarningsConfigurationPanel() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {adminConfigurationGroups.map((group) => (
          <div key={group.title} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
            <ShieldCheck size={18} className="text-yellow-200" />
            <p className="mt-3 font-black text-yellow-50">{group.title}</p>
            <div className="mt-3 space-y-2">
              {group.items.map((item) => (
                <button key={item} type="button" disabled className="w-full cursor-not-allowed rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-xs font-bold text-white/45">
                  {item} konfigurieren
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4">
        <p className="text-sm font-black text-yellow-50">Admin-Konfiguration als UI vorbereitet</p>
        <p className="mt-2 text-xs leading-relaxed text-white/48">
          Produkte, Grundprovisionen, Differenzprovisionen, Sonderboni, Aktionsabzüge, feste Werte, Prozentwerte, Gültigkeit und betroffene Partnerlevel werden später über freigegebene Admin-/CMS-Flows gepflegt. Aktuell ist keine Speicherung aktiv.
        </p>
      </div>
    </div>
  );
}

function LeaderEarningsPanel() {
  const leaderViews = [
    'Team-Punkteübersicht',
    'Partner kurz vor Levelwechsel',
    'Partner mit hohem Potenzial',
    'Attraktive Aktionsprodukte',
    'Wachstums-Empfehlungen',
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {leaderViews.map((view) => (
        <div key={view} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
          <Users size={18} className="text-yellow-200" />
          <p className="mt-3 text-sm font-black text-yellow-50">{view}</p>
          <p className="mt-2 text-xs leading-relaxed text-white/45">Nur vorbereitete Teamübersicht. Keine fremden Partnerdaten geladen.</p>
        </div>
      ))}
    </div>
  );
}

function SourceDocumentsPanel() {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {sourceDocuments.map((document) => (
        <div key={document} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
          <FileText size={18} className="text-yellow-200" />
          <p className="mt-3 font-black text-yellow-50">{document}</p>
          <p className="mt-2 text-xs leading-relaxed text-white/45">Spätere offizielle Datenquelle. Keine Werte im Code hinterlegt.</p>
        </div>
      ))}
    </div>
  );
}

function NotificationAndSecurityPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
        <Bell size={18} className="text-yellow-200" />
        <h3 className="mt-3 text-xl font-black text-yellow-50">Benachrichtigungen vorbereitet</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          Kampagnen können später Hinweise auslösen, wenn eine Aktion startet, bald endet oder eine Provisions-/Punkte-Sonderregel relevant wird. Aktuell wird nichts versendet.
        </p>
      </div>
      <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
        <ShieldCheck size={18} className="text-yellow-200" />
        <h3 className="mt-3 text-xl font-black text-yellow-50">Sicherheitsmodell vorbereitet</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/55">
          Partner sieht nur eigene Berechnung. Leader sieht nur freigegebene Teamübersichten. Admin sieht vollständige Regeln und Konfigurationen.
        </p>
      </div>
    </div>
  );
}

function CommissionComponentsPanel() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {commissionComponents.map((component) => (
        <div key={component.label} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
          <CheckCircle2 size={18} className="text-yellow-200" />
          <p className="mt-3 font-black text-yellow-50">{component.label}</p>
          <p className="mt-2 text-xs leading-relaxed text-white/48">{component.description}</p>
        </div>
      ))}
    </div>
  );
}

export function PartnerEarningsEnginePanel({ campaign, partner, isAdmin = false, isLeader = false, Panel, t: providedT, language, copy }) {
  const t = providedT || createI18nTranslator(language, copy);
  const partnerLevel = resolvePartnerLevel(partner);

  if (!Panel) {
    return null;
  }

  return (
    <>
      <Panel title={t('earningsTitle')} icon={Calculator}>
        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-yellow-300/20 bg-yellow-400/10 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <SourceBadge>{t('earningsCalculator', 'Provisions- und Aktionsrechner')}</SourceBadge>
              <SourceBadge>{t('uiOnly')}</SourceBadge>
              <SourceBadge>{t('noFakeValues')}</SourceBadge>
            </div>
            <h3 className="mt-3 text-2xl font-black text-yellow-50">{t('earningsHeroTitle')}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/62">
              {t('earningsHeroText')}
            </p>
          </div>

          <PartnerCommissionPreview campaign={campaign} partnerLevel={partnerLevel} t={t} />
          <CampaignCountdownPanel campaign={campaign} />
        </div>
      </Panel>

      <Panel title={t('earningsSources')} icon={FileText}>
        <SourceDocumentsPanel />
      </Panel>

      <Panel title={t('earningsCommission')} icon={Coins}>
        <CommissionComponentsPanel />
      </Panel>

      <Panel title={t('earningsPoints')} icon={BarChart3}>
        <PointsAndLevelPanel t={t} />
      </Panel>

      {isLeader && !isAdmin && (
        <Panel title={t('earningsLeaderOverview')} icon={Users}>
          <LeaderEarningsPanel />
        </Panel>
      )}

      {isAdmin && (
        <Panel title={t('earningsAdminConfig')} icon={ShieldCheck}>
          <AdminEarningsConfigurationPanel />
        </Panel>
      )}

      <Panel title={t('earningsSecurity')} icon={Bell}>
        <NotificationAndSecurityPanel />
      </Panel>

      <div className="rounded-[1.5rem] border border-yellow-300/15 bg-yellow-400/10 p-4 text-sm leading-relaxed text-yellow-100">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p>
            Wichtig: Echte Preis-, Provisions-, Punkte- und Levelwerte müssen später aus offiziellen Harbor-/Aqua-Global-Unterlagen oder freigegebenen CMS-/Datenbankquellen stammen. Bis dahin zeigt die UI bewusst nur vorbereitete Rechenwege und Quellenstatus.
          </p>
        </div>
      </div>
    </>
  );
}
