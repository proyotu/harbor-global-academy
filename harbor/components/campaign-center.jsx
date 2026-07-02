'use client';

import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crown,
  Flame,
  Megaphone,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Tag,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import { PartnerEarningsEnginePanel } from './partner-earnings-engine';
import { Button } from './ui';

const partnerLevels = ['Starter', 'Level 1', 'Level 2', 'Level 3', 'Teamleiter', 'Leader', 'Admin / Sonderstatus'];

const campaignStatusMeta = {
  planned: {
    label: 'Geplant',
    className: 'border-blue-300/25 bg-blue-400/10 text-blue-100',
  },
  active: {
    label: 'Aktiv',
    className: 'border-green-300/25 bg-green-400/10 text-green-100',
  },
  ended: {
    label: 'Beendet',
    className: 'border-white/10 bg-white/10 text-white/55',
  },
};

const calculationTypeLabels = {
  fixed: 'Fester Betrag',
  percent: 'Prozentualer Rabatt',
  combined: 'Kombinierte Aktion',
};

const emptyLevelPriceRows = partnerLevels.map((level) => ({
  partnerLevel: level,
  normalPartnerPrice: null,
  campaignPartnerPrice: null,
  savingsAmount: null,
  savingsPercent: null,
  sourceStatus: 'Preisquelle ausstehend',
}));

export const campaignCenterCampaigns = [
  {
    id: 'summer-mini-touch-preview',
    name: 'Sommeraktion Mini Touch',
    label: 'UI-Preview',
    status: 'active',
    validFrom: '01.07.2026',
    validUntil: '15.07.2026',
    advantage: 'Kunden- und Partneraktion vorbereitet',
    customerCampaign: {
      title: 'Kundenaktion',
      description: 'Rabatt-/Vorteilslogik für Kundenverkauf vorbereitet. Noch keine produktive Preisquelle angebunden.',
      discountLabel: 'Kundenrabatt konfigurierbar',
      visibility: 'Partner als Verkaufsargument',
    },
    partnerCampaign: {
      title: 'Interne Partneraktion',
      description: 'Levelabhängige Aktionspreise werden später aus echten Produkt-/Partnerpreisen berechnet.',
      affectedProduct: 'Mini Touch',
      calculationTypes: ['fixed', 'percent', 'combined'],
      levelPriceRows: emptyLevelPriceRows,
    },
    products: ['Mini Touch'],
    audience: ['Partner', 'Leader', 'Admin'],
    visibility: ['Partner', 'Leader', 'Admin'],
    notifyPrepared: true,
    cta: 'Details ansehen',
    description: 'Vorbereitete Aktionsoberfläche für saisonale Produktkommunikation ohne echte Speicherung oder Preisberechnung.',
    benefits: ['Kundenargumente vorbereiten', 'Story-Hinweis nutzen', 'Team-Fokus setzen'],
    marketingMaterials: ['Story-Vorlage', 'WhatsApp-Text', 'Gesprächsleitfaden'],
    salesArguments: ['Kompakter Einstieg in Beratungsgespräche', 'Zeitlich begrenzter Aktionsanlass', 'Produktvorteile klar erklären'],
    socialHints: ['Story heute vorbereiten', 'Reel-Idee zur Wasserbar nutzen', 'Kundenfrage mit CTA beantworten'],
    whatsappTemplates: ['Kurzer Aktionshinweis', 'Follow-up nach Beratung', 'Team-Erinnerung'],
    leaderHints: ['Team auf Kundengespräche vorbereiten', 'Partner mit offenen Modulen aktivieren', 'Produktfokus für diese Woche setzen'],
    adminHints: ['Zielgruppe wählen', 'Benachrichtigung vorbereiten', 'Preisquelle vor Veröffentlichung prüfen'],
  },
  {
    id: 'winter-deal-preview',
    name: 'Winter Deal',
    label: 'Vorbereitung',
    status: 'planned',
    validFrom: '01.12.2026',
    validUntil: '15.12.2026',
    advantage: 'Saisonale Produktaktion vorbereitet',
    customerCampaign: {
      title: 'Kundenaktion',
      description: 'Winter-Kommunikation und Kundenvorteil werden später über CMS gepflegt.',
      discountLabel: 'Rabatt offen',
      visibility: 'Noch nicht sichtbar',
    },
    partnerCampaign: {
      title: 'Partneraktion',
      description: 'Level-Matrix vorbereitet. Keine produktiven Preise hinterlegt.',
      affectedProduct: 'Wasserbar Portfolio',
      calculationTypes: ['fixed', 'percent'],
      levelPriceRows: emptyLevelPriceRows,
    },
    products: ['Mini Touch', 'Flexible Touch'],
    audience: ['Partner', 'Leader'],
    visibility: ['Admin'],
    notifyPrepared: true,
    cta: 'Planung prüfen',
    description: 'Geplante Kampagne als UI-Vorbereitung für spätere Veröffentlichung.',
    benefits: ['Saisonaler Verkaufsanlass', 'Teamkommunikation vorbereiten'],
    marketingMaterials: ['Kampagnen-Checkliste', 'Story-Entwurf'],
    salesArguments: ['Winterroutine', 'Beratungsgespräch mit Anlass'],
    socialHints: ['Countdown vorbereiten', 'Story-Reihe planen'],
    whatsappTemplates: ['Vorankündigung', 'Team-Reminder'],
    leaderHints: ['Teamaufgaben vorbereiten'],
    adminHints: ['Publikationsdatum prüfen', 'Zielgruppe segmentieren'],
  },
  {
    id: 'black-friday-archive-preview',
    name: 'Black Friday Rückblick',
    label: 'Archiv',
    status: 'ended',
    validFrom: '20.11.2025',
    validUntil: '30.11.2025',
    advantage: 'Archivierter Kampagnenplatzhalter',
    customerCampaign: {
      title: 'Kundenaktion',
      description: 'Archivansicht vorbereitet. Keine echten historischen Preise in der UI.',
      discountLabel: 'historisch / nicht aktiv',
      visibility: 'Admin-Archiv',
    },
    partnerCampaign: {
      title: 'Partneraktion',
      description: 'Archivierte Levelpreise würden später revisionssicher gespeichert.',
      affectedProduct: 'Produktportfolio',
      calculationTypes: ['combined'],
      levelPriceRows: emptyLevelPriceRows,
    },
    products: ['Portfolio'],
    audience: ['Admin'],
    visibility: ['Admin'],
    notifyPrepared: false,
    cta: 'Archiv prüfen',
    description: 'Beispiel für beendete Aktionen und spätere Auswertung.',
    benefits: ['Auswertung vorbereiten', 'Archivstruktur planen'],
    marketingMaterials: ['Archivmaterial'],
    salesArguments: ['Learnings für nächste Aktion'],
    socialHints: ['Best-of Post später möglich'],
    whatsappTemplates: ['nicht aktiv'],
    leaderHints: ['Team-Learnings später ableiten'],
    adminHints: ['Archivieren', 'Auswertung', 'Rollback-Historie'],
  },
];

function getActiveCampaign() {
  return campaignCenterCampaigns.find((campaign) => campaign.status === 'active') || null;
}

function formatCampaignRange(campaign) {
  return `${campaign.validFrom} – ${campaign.validUntil}`;
}

function normalizePartnerLevel(partner) {
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

function calculateCampaignPrice(normalPrice, discount) {
  const numericPrice = Number(normalPrice);
  const numericDiscount = Number(discount?.value);

  if (!Number.isFinite(numericPrice) || numericPrice <= 0 || !Number.isFinite(numericDiscount) || numericDiscount < 0) {
    return null;
  }

  if (discount.type === 'fixed') {
    return Math.max(0, numericPrice - numericDiscount);
  }

  if (discount.type === 'percent') {
    return Math.max(0, numericPrice * (1 - numericDiscount / 100));
  }

  return null;
}

function formatPrice(value) {
  if (!Number.isFinite(Number(value))) {
    return 'Preisquelle offen';
  }

  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(Number(value));
}

function CampaignStatusBadge({ status }) {
  const meta = campaignStatusMeta[status] || campaignStatusMeta.planned;

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${meta.className}`}>
      {meta.label}
    </span>
  );
}

function PartnerSavingsBadge({ row }) {
  const hasSavings = Number.isFinite(Number(row?.savingsAmount)) || Number.isFinite(Number(row?.savingsPercent));

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${hasSavings ? 'bg-green-400/15 text-green-100 ring-1 ring-green-200/20' : 'bg-yellow-400/10 text-yellow-100 ring-1 ring-yellow-200/20'}`}>
      {hasSavings ? 'Ersparnis berechnet' : 'Berechnung vorbereitet'}
    </span>
  );
}

function CustomerCampaignPanel({ campaign, Panel }) {
  return (
    <Panel title="Kundenaktion" icon={Tag}>
      <div className="rounded-[1.5rem] border border-yellow-300/20 bg-yellow-400/10 p-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">{campaign.customerCampaign.discountLabel}</p>
        <h3 className="mt-3 break-words text-2xl font-black text-yellow-50">{campaign.customerCampaign.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/65">{campaign.customerCampaign.description}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-xs text-white/45">Zeitraum</p>
            <p className="mt-1 font-black text-yellow-50">{formatCampaignRange(campaign)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
            <p className="text-xs text-white/45">Sichtbarkeit</p>
            <p className="mt-1 font-black text-yellow-50">{campaign.customerCampaign.visibility}</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function PartnerCampaignPanel({ campaign, partner, Panel }) {
  const partnerLevel = normalizePartnerLevel(partner);
  const partnerRow = campaign.partnerCampaign.levelPriceRows.find((row) => row.partnerLevel === partnerLevel)
    || campaign.partnerCampaign.levelPriceRows[0];
  const calculatedPrice = calculateCampaignPrice(partnerRow?.normalPartnerPrice, null);

  return (
    <Panel title="Partneraktion nach Level" icon={Crown}>
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[1.5rem] border border-yellow-300/20 bg-black/25 p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Dein Level</p>
          <h3 className="mt-3 text-2xl font-black text-yellow-50">{partnerLevel}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/58">
            Partner sehen später prominent nur den für ihr Level freigegebenen Aktionspreis. Aktuell ist keine maschinenlesbare Preisquelle angebunden.
          </p>
          <PartnerSavingsBadge row={partnerRow} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs text-white/45">Produkt</p>
            <p className="mt-1 font-black text-yellow-50">{campaign.partnerCampaign.affectedProduct}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs text-white/45">Normaler Partnerpreis</p>
            <p className="mt-1 font-black text-yellow-50">{formatPrice(partnerRow?.normalPartnerPrice)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs text-white/45">Aktions-Partnerpreis</p>
            <p className="mt-1 font-black text-yellow-50">{formatPrice(calculatedPrice ?? partnerRow?.campaignPartnerPrice)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs text-white/45">Gültigkeit</p>
            <p className="mt-1 font-black text-yellow-50">{formatCampaignRange(campaign)}</p>
          </div>
        </div>
      </div>
      <p className="mt-4 rounded-2xl border border-yellow-300/15 bg-yellow-400/10 p-3 text-xs leading-relaxed text-yellow-100">
        Hinweis: Preis basiert später auf dem aktuellen Partnerlevel. Echte Preise müssen aus freigegebenen Produkt-/Preisquellen kommen; es werden keine Fantasiepreise hardcodiert.
      </p>
    </Panel>
  );
}

function LevelPricingTable({ campaign }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25">
      <div className="grid grid-cols-[1.05fr_1fr_1fr_1fr] gap-px bg-white/10 text-xs font-black uppercase tracking-[0.1em] text-white/45">
        {['Level', 'Normalpreis', 'Aktionspreis', 'Ersparnis'].map((heading) => (
          <div key={heading} className="bg-black/60 p-3">{heading}</div>
        ))}
      </div>
      <div className="divide-y divide-white/10">
        {campaign.partnerCampaign.levelPriceRows.map((row) => (
          <div key={row.partnerLevel} className="grid grid-cols-[1.05fr_1fr_1fr_1fr] text-sm text-white/65">
            <div className="p-3 font-black text-yellow-50">{row.partnerLevel}</div>
            <div className="p-3">{formatPrice(row.normalPartnerPrice)}</div>
            <div className="p-3">{formatPrice(row.campaignPartnerPrice)}</div>
            <div className="p-3">{row.sourceStatus}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductPromotionCard({ campaign }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-400/10 text-yellow-200">
          <PackageCheck size={19} />
        </span>
        <CampaignStatusBadge status={campaign.status} />
      </div>
      <h3 className="mt-4 break-words text-lg font-black text-yellow-50">{campaign.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/58">{campaign.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {campaign.products.map((product) => (
          <span key={product} className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-bold text-yellow-100 ring-1 ring-yellow-200/15">{product}</span>
        ))}
      </div>
    </div>
  );
}

export function CampaignDashboardBanner({ partner, isAdmin = false, isLeader = false, onNavigate }) {
  const activeCampaign = getActiveCampaign();

  if (!activeCampaign || (!activeCampaign.visibility.includes('Partner') && !isAdmin && !isLeader)) {
    return null;
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-yellow-300/25 bg-gradient-to-br from-yellow-400/[0.18] via-white/[0.06] to-black/60 p-4 text-white shadow-2xl shadow-yellow-500/10 ring-1 ring-yellow-200/10 sm:p-5 lg:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-200/25 bg-yellow-400/15 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-yellow-100">
              <span className="h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_16px_rgba(250,204,21,0.75)]" />
              Aktionsbanner
            </span>
            <CampaignStatusBadge status={activeCampaign.status} />
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/65">{activeCampaign.label}</span>
          </div>
          <h2 className="break-words text-2xl font-black text-yellow-50 sm:text-3xl">{activeCampaign.name}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/65">{activeCampaign.advantage} · {formatCampaignRange(activeCampaign)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {activeCampaign.products.map((product) => (
              <span key={product} className="rounded-full bg-black/25 px-3 py-1 text-xs font-bold text-yellow-100 ring-1 ring-yellow-200/15">{product}</span>
            ))}
          </div>
        </div>
        <Button type="button" onClick={() => onNavigate?.('campaigns')} className="w-full rounded-2xl bg-yellow-400 px-5 py-3 font-black text-black hover:bg-yellow-300 xl:w-auto">
          Details ansehen <ChevronRight size={16} />
        </Button>
      </div>
    </section>
  );
}

export function CampaignSuccessHint({ partner, isAdmin = false, isLeader = false, onNavigate }) {
  const activeCampaign = getActiveCampaign();

  if (!activeCampaign) {
    return null;
  }

  const partnerLevel = normalizePartnerLevel(partner);

  return (
    <div className="rounded-[1.5rem] border border-yellow-300/20 bg-yellow-400/10 p-4 text-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">Aktuelle Aktion im Success Center</p>
          <h3 className="mt-2 break-words text-xl font-black text-yellow-50">Nutze die aktuelle Aktion für Kundengespräche</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/62">
            Teile die Aktion heute in deiner Story, bereite ein Kundengespräch vor oder kontaktiere 5 passende Kontakte. Dein aktueller Level-Kontext: {partnerLevel}.
          </p>
          {(isLeader || isAdmin) && <p className="mt-2 text-xs text-yellow-100">Leader/Admin-Hinweis: Teamaufgaben und Zielgruppenlogik sind vorbereitet, aber nicht gespeichert.</p>}
        </div>
        <Button type="button" onClick={() => onNavigate?.('campaigns')} className="w-full rounded-2xl bg-yellow-400 px-4 py-3 font-black text-black hover:bg-yellow-300 sm:w-auto">
          Aktion öffnen
        </Button>
      </div>
    </div>
  );
}

export function CampaignGrowthPanel({ Panel }) {
  const activeCampaign = getActiveCampaign();

  if (!activeCampaign) {
    return null;
  }

  const groups = [
    { title: 'Kampagnenmaterial', items: activeCampaign.marketingMaterials, icon: Megaphone },
    { title: 'Reels & Story-Ideen', items: activeCampaign.socialHints, icon: Sparkles },
    { title: 'WhatsApp-Texte', items: activeCampaign.whatsappTemplates, icon: MessageCircle },
    { title: 'Gesprächsleitfäden', items: activeCampaign.salesArguments, icon: Target },
  ];

  return (
    <Panel title="Growth Kampagnenmaterial" icon={Flame}>
      <p className="mb-4 text-sm leading-relaxed text-white/60">
        Aktive Kampagnen können später direkt mit Growth-Material, Reels, Story-Vorlagen, WhatsApp-Texten und Einwandbehandlung verbunden werden. Aktuell UI-only.
      </p>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {groups.map((group) => {
          const Icon = group.icon;

          return (
            <div key={group.title} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
              <Icon size={18} className="text-yellow-200" />
              <p className="mt-3 font-black text-yellow-50">{group.title}</p>
              <div className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <p key={item} className="text-xs leading-relaxed text-white/55">• {item}</p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function AdminCampaignManagementPanel({ campaign, Panel }) {
  const adminActions = ['Aktion erstellen', 'Bearbeiten', 'Planen', 'Archivieren', 'Benachrichtigung vorbereiten', 'Zielgruppe auswählen'];

  return (
    <Panel title="Admin Kampagnenverwaltung" icon={ShieldCheck}>
      <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-yellow-200">UI-only Workflow</p>
          <h3 className="mt-2 text-xl font-black text-yellow-50">Kampagne verwalten</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {adminActions.map((action) => (
              <button key={action} type="button" disabled className="cursor-not-allowed rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-left text-sm font-bold text-white/45">
                {action}
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0">
          <p className="mb-3 text-sm font-black text-yellow-50">Level-Preis-Matrix vorbereitet</p>
          <LevelPricingTable campaign={campaign} />
        </div>
      </div>
    </Panel>
  );
}

function LeaderCampaignPanel({ campaign, Panel }) {
  return (
    <Panel title="Leader Aktionssteuerung" icon={Users}>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          { label: 'Team-Hinweis', text: 'Partner auf aktuelle Aktion und Kundengespräche fokussieren.', icon: Users },
          { label: 'Attraktive Produkte', text: campaign.products.join(', '), icon: PackageCheck },
          { label: 'Verkaufsargument', text: campaign.salesArguments[0] || 'Argumente vorbereitet.', icon: MessageCircle },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
              <Icon size={18} className="text-yellow-200" />
              <p className="mt-3 font-black text-yellow-50">{item.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{item.text}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-white/45">
        Teambezogene Partnerlisten und echte Aktionsnutzung benötigen später sichere Team-/Upline-Struktur und freigegebene Datenquellen.
      </p>
    </Panel>
  );
}

function NotificationPreparationPanel({ Panel }) {
  const notificationEvents = [
    'Aktion gestartet',
    'Aktion läuft bald ab',
    'Aktion endet heute',
    'Neue Produktaktion',
    'Neue Marketingmaterialien zur Aktion',
  ];

  return (
    <Panel title="Notification-Vorbereitung" icon={Bell}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {notificationEvents.map((event) => (
          <div key={event} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <Bell size={16} className="text-yellow-200" />
            <p className="mt-3 text-sm font-black text-yellow-50">{event}</p>
            <p className="mt-2 text-xs leading-relaxed text-white/45">Nur UI/TODO. Kein Versand aktiv.</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-white/45">
        Spätere Zielgruppenlogik: Partner nur relevante Aktionen, Leader nur Team-/Aktionshinweise, Admin globale Übersicht.
      </p>
    </Panel>
  );
}

export function CampaignCenterSection({ partner, isAdmin = false, isLeader = false, onNavigate, dependencies }) {
  const { Panel, Stat, NotificationEmptyState } = dependencies;
  const activeCampaigns = campaignCenterCampaigns.filter((campaign) => campaign.status === 'active');
  const plannedCampaigns = campaignCenterCampaigns.filter((campaign) => campaign.status === 'planned');
  const endedCampaigns = campaignCenterCampaigns.filter((campaign) => campaign.status === 'ended');
  const primaryCampaign = activeCampaigns[0] || plannedCampaigns[0];
  const partnerLevel = normalizePartnerLevel(partner);

  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-[2rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-400/[0.16] via-white/[0.055] to-black/55 p-5 text-white shadow-2xl shadow-yellow-500/10 sm:p-6 lg:p-8">
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-yellow-200">Campaign Center</p>
            <h2 className="mt-3 break-words text-3xl font-black text-yellow-50 sm:text-4xl">Aktionen, Kampagnen und Partnerpreise vorbereitet</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65 sm:text-base">
              UI-Vorbereitung für zeitlich begrenzte Kundenaktionen, interne Partneraktionen und levelabhängige Aktionspreise. Keine Speicherung, keine echte Preislogik, keine Benachrichtigungen.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <Stat icon={Flame} label="Aktiv" value={activeCampaigns.length} />
            <Stat icon={Clock} label="Geplant" value={plannedCampaigns.length} />
            <Stat icon={Crown} label="Dein Level" value={partnerLevel} />
          </div>
        </div>
      </div>

      {primaryCampaign ? (
        <>
          <section className="grid gap-3 md:grid-cols-3">
            {[...activeCampaigns, ...plannedCampaigns, ...endedCampaigns].map((campaign) => (
              <ProductPromotionCard key={campaign.id} campaign={campaign} />
            ))}
          </section>

          <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <CustomerCampaignPanel campaign={primaryCampaign} Panel={Panel} />
            <PartnerCampaignPanel campaign={primaryCampaign} partner={partner} Panel={Panel} />
          </section>

          <Panel title="Aktionsmaterial & Gesprächsargumente" icon={Megaphone}>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[
                { title: 'Marketingmaterial', items: primaryCampaign.marketingMaterials },
                { title: 'Gesprächsargumente', items: primaryCampaign.salesArguments },
                { title: 'Social Media Hinweise', items: primaryCampaign.socialHints },
                { title: 'WhatsApp-Vorlagen', items: primaryCampaign.whatsappTemplates },
              ].map((group) => (
                <div key={group.title} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
                  <p className="font-black text-yellow-50">{group.title}</p>
                  <div className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <p key={item} className="text-xs leading-relaxed text-white/55">• {item}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Automatische Aktionspreis-Berechnung vorbereitet" icon={TrendingUp}>
            <div className="grid gap-3 md:grid-cols-3">
              {primaryCampaign.partnerCampaign.calculationTypes.map((type) => (
                <div key={type} className="rounded-[1.5rem] border border-white/10 bg-black/25 p-4">
                  <CheckCircle2 size={18} className="text-yellow-200" />
                  <p className="mt-3 font-black text-yellow-50">{calculationTypeLabels[type]}</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/50">
                    Rechenweg vorbereitet. Ohne echte maschinenlesbare Produkt-/Levelpreise wird kein Preis berechnet.
                  </p>
                </div>
              ))}
            </div>
          </Panel>

          <PartnerEarningsEnginePanel campaign={primaryCampaign} partner={partner} isAdmin={isAdmin} isLeader={isLeader} Panel={Panel} />

          {isLeader && !isAdmin && <LeaderCampaignPanel campaign={primaryCampaign} Panel={Panel} />}
          {isAdmin && <AdminCampaignManagementPanel campaign={primaryCampaign} Panel={Panel} />}
          <NotificationPreparationPanel Panel={Panel} />

          <Panel title="Spätere Integrationen" icon={ShieldCheck}>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {['CMS', 'Notification Engine', 'Success Center', 'Growth Center', 'WhatsApp / n8n / CRM'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/60">
                  <p className="font-black text-yellow-50">{item}</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/45">Architektur vorbereitet, keine produktive Integration aktiv.</p>
                </div>
              ))}
            </div>
          </Panel>

          <div className="rounded-[1.5rem] border border-yellow-300/15 bg-yellow-400/10 p-4 text-sm leading-relaxed text-yellow-100">
            Preis-TODO: Echte Partnerpreise müssen später aus freigegebenen Preis-/Produktdaten, PDFs oder CMS-/Datenbankstrukturen kommen. Bis dahin zeigt die UI bewusst keine erfundenen Preise.
          </div>
        </>
      ) : (
        <NotificationEmptyState title="Momentan gibt es keine Kampagnen." text="Sobald Kampagnen im CMS oder in einer freigegebenen Datenstruktur vorhanden sind, erscheinen sie hier." />
      )}
    </section>
  );
}
