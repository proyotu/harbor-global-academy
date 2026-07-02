import crypto from 'node:crypto';
import {
  deleteR2Object,
  getR2PublicUrl,
  sanitizeR2KeyPart,
  uploadR2Object,
} from '../../../lib/storage/r2';

const PARTNERS_TABLE = 'partners';
const DEFAULT_DISCOUNT_CODE = '119872';
const COMMUNITY_R2_PREFIX = 'community-files';
const DEFAULT_ACADEMY_BASE_URL = 'https://www.harborglobalacademy.com';
const UPDATE_TYPE = 'academy-update';
const COMMUNITY_UPLOAD_MAX_BYTES = 10 * 1024 * 1024;
const CHAT_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const CHAT_FILE_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'zip']);
const CHAT_FILE_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed',
]);
const DANGEROUS_FILE_EXTENSIONS = new Set(['exe', 'bat', 'cmd', 'com', 'js', 'mjs', 'sh', 'php', 'ps1', 'vbs', 'scr', 'jar']);
const TEST_DATA_PATTERNS = [
  'test',
  'codex',
  'final',
  'demo',
  'example.com',
  '111111',
  '123456',
  'test123',
  'czadmin',
  'cphase',
  'final-logo',
  'admin-flow',
  'phase3',
  'leo boy',
  'leoboy',
];
const SYSTEM_EMAILS = {
  chat: 'system-community-chat@harborglobalacademy.local',
  qa: 'system-community-qa@harborglobalacademy.local',
  presence: 'system-community-presence@harborglobalacademy.local',
  notifications: 'system-community-notifications@harborglobalacademy.local',
  testimonials: 'system-community-testimonials@harborglobalacademy.local',
};

function json(data, status = 200) {
  return Response.json(data, { status });
}

function readEnv(name) {
  return String(process.env[name] || '').trim();
}

function getAcademyBaseUrl() {
  return (readEnv('ACADEMY_BASE_URL') || DEFAULT_ACADEMY_BASE_URL).replace(/\/$/, '');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function emailShell({ title, preview, body, buttons = [], footer = '' }) {
  const buttonHtml = buttons.map((button) => `
    <a href="${escapeHtml(button.href)}" style="display:inline-block;margin:8px 8px 0 0;padding:13px 18px;border-radius:14px;background:#f6c84f;color:#090909;font-weight:800;text-decoration:none;">
      ${escapeHtml(button.label)}
    </a>
  `).join('');

  return `<!doctype html>
  <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="margin:0;background:#080808;color:#f7f1df;font-family:Arial,Helvetica,sans-serif;">
      <span style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preview)}</span>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#080808;padding:28px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;border:1px solid rgba(246,200,79,.28);border-radius:28px;background:#10100f;overflow:hidden;">
              <tr>
                <td style="padding:30px 26px;border-bottom:1px solid rgba(246,200,79,.22);background:linear-gradient(135deg,rgba(246,200,79,.18),rgba(255,255,255,.04));">
                  <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#f6c84f;font-weight:800;">Harbor Global Partner Academy</div>
                  <h1 style="margin:12px 0 0;font-size:28px;line-height:1.18;color:#fff6d4;">${escapeHtml(title)}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 26px;font-size:15px;line-height:1.65;color:#ede2c2;">
                  ${body}
                  ${buttonHtml ? `<div style="margin-top:22px;">${buttonHtml}</div>` : ''}
                  ${footer ? `<div style="margin-top:24px;padding-top:18px;border-top:1px solid rgba(255,255,255,.1);font-size:13px;color:#b9ac86;">${footer}</div>` : ''}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

async function sendEmail({ to, subject, html, text, idempotencyKey }) {
  const apiKey = readEnv('RESEND_API_KEY');
  const from = readEnv('EMAIL_FROM');

  if (!apiKey || !from) {
    return {
      sent: false,
      provider: 'resend',
      error: 'RESEND_API_KEY oder EMAIL_FROM ist nicht konfiguriert.',
    };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
      body: JSON.stringify({ from, to, subject, html, text }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        sent: false,
        provider: 'resend',
        error: data?.message || data?.error || 'Resend konnte die E-Mail nicht senden.',
      };
    }

    return {
      sent: true,
      provider: 'resend',
      id: data?.id || '',
    };
  } catch (error) {
    return {
      sent: false,
      provider: 'resend',
      error: error.message || 'E-Mail-Versand fehlgeschlagen.',
    };
  }
}

function getSupabaseConfig({ requireService = false } = {}) {
  const supabaseUrl = readEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anonKey = readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const serviceKey = readEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !anonKey) {
    throw Object.assign(new Error('Supabase ist nicht konfiguriert.'), { statusCode: 503 });
  }

  if (requireService && !serviceKey) {
    throw Object.assign(new Error('SUPABASE_SERVICE_ROLE_KEY fehlt.'), { statusCode: 503 });
  }

  return {
    supabaseUrl: supabaseUrl.replace(/\/$/, ''),
    key: requireService ? serviceKey : serviceKey || anonKey,
  };
}

function getAuthSecret() {
  return readEnv('HARBOR_AUTH_SECRET') || readEnv('SUPABASE_SERVICE_ROLE_KEY') || readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 'local-harbor-dev-secret';
}

function getBearerToken(request) {
  const authorization = request.headers.get('authorization') || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
}

function verifyToken(token) {
  if (!token || !token.includes('.')) {
    throw Object.assign(new Error('Nicht eingeloggt.'), { statusCode: 401 });
  }

  const [encodedPayload, signature] = token.split('.');
  const expectedSignature = crypto.createHmac('sha256', getAuthSecret()).update(encodedPayload).digest('base64url');

  if (signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw Object.assign(new Error('Session ist ungueltig.'), { statusCode: 401 });
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw Object.assign(new Error('Session ist abgelaufen.'), { statusCode: 401 });
  }

  return payload;
}

async function supabaseRequest(path, options = {}, { requireService = true } = {}) {
  const { supabaseUrl, key } = getSupabaseConfig({ requireService });
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method: options.method || 'GET',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: options.prefer || 'return=representation',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message || data?.hint || 'Supabase-Anfrage fehlgeschlagen.';
    throw Object.assign(new Error(message), { statusCode: response.status, details: data });
  }

  return data;
}

function parseMeta(record) {
  if (!record?.avatar_url || !String(record.avatar_url).trim().startsWith('{')) {
    return {};
  }

  try {
    return JSON.parse(record.avatar_url);
  } catch {
    return {};
  }
}

function normalizePartner(record) {
  const meta = parseMeta(record);
  const notificationPrefs = meta.notificationPrefs || {};
  const careerProfile = meta.careerProfile || {};
  const teamGrowthProfile = meta.teamGrowthProfile || {};
  const points = Number(careerProfile.points ?? careerProfile.currentPoints ?? 0);
  const level = careerProfile.level || (
    points >= 45001 ? 'Level 6'
      : points >= 15001 ? 'Level 5'
        : points >= 5001 ? 'Level 4'
          : points >= 1501 ? 'Level 3'
            : points >= 501 ? 'Level 2'
              : points >= 51 ? 'Level 1'
                : 'Starterstufe'
  );

  return {
    id: String(record.id || record.email),
    firstName: record.firstname || '',
    lastName: record.lastname || '',
    email: record.email || '',
    status: record.status || 'pending',
    role: meta.role || 'partner',
    language: meta.language || notificationPrefs.language || 'Deutsch',
    profileImageUrl: careerProfile.profileImageUrl || '',
    aquaLevel: level,
    teamPartnerCount: Number(teamGrowthProfile.currentCount ?? teamGrowthProfile.partnerCount ?? 0),
    testData: Boolean(meta.testData?.isTestData || detectTestData(record).isTestData),
    assignedTraining: meta.assignedTraining || '',
    notificationPrefs: {
      emailUpdates: notificationPrefs.emailUpdates !== false,
      whatsappUpdates: Boolean(notificationPrefs.whatsappUpdates),
      language: notificationPrefs.language || meta.language || 'Deutsch',
    },
  };
}

function detectTestData(record) {
  const haystack = [
    record?.firstname,
    record?.lastname,
    record?.email,
    record?.discount_code,
    parseMeta(record)?.testData?.reasons?.join(' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  const reasons = TEST_DATA_PATTERNS.filter((pattern) => haystack.includes(pattern));

  return {
    isTestData: reasons.length > 0,
    reasons,
  };
}

function displayName(partner) {
  return `${partner.firstName || 'Partner'} ${partner.lastName || ''}`.trim();
}

function academyUpdateEmail(update, partner) {
  const firstName = partner.firstName || 'Partner';
  const title = update.title || 'Academy Update';
  const link = update.link || `${getAcademyBaseUrl()}/?news=1`;
  const body = `
    <p>Hallo ${escapeHtml(firstName)},</p>
    <p>in der Harbor Global Partner Academy gibt es neue Inhalte.</p>
    <p><strong>Was ist neu?</strong><br>${escapeHtml(title)}</p>
    <p>${escapeHtml(update.body || update.description || '')}</p>
  `;

  return {
    subject: `Neu in der Harbor Global Academy: ${title}`,
    html: emailShell({
      title: `Neu: ${title}`,
      preview: `Neue Inhalte in der Harbor Global Academy: ${title}`,
      body,
      buttons: [{ label: 'Jetzt ansehen', href: link }],
      footer: 'Du erhältst diese Nachricht, weil du registrierter Partner der Harbor Global Partner Academy bist.',
    }),
    text: `Hallo ${firstName},\n\nin der Harbor Global Partner Academy gibt es neue Inhalte:\n${title}\n\n${update.body || update.description || ''}\n\nJetzt ansehen: ${link}\n\nDu erhältst diese Nachricht, weil du registrierter Partner der Harbor Global Partner Academy bist.`,
  };
}

async function getPartnerById(id) {
  const records = await supabaseRequest(`${PARTNERS_TABLE}?id=eq.${encodeURIComponent(id)}&select=*&limit=1`);
  return records[0] || null;
}

async function listApprovedPartners() {
  const records = await supabaseRequest(`${PARTNERS_TABLE}?status=eq.approved&select=*`);
  return records
    .filter((record) => {
      const meta = parseMeta(record);
      return meta.role !== 'system' && !meta.adminProfile && record.status !== 'system' && !meta.testData?.isTestData && !detectTestData(record).isTestData;
    })
    .map(normalizePartner);
}

async function requireApprovedSession(request, { admin = false } = {}) {
  const session = verifyToken(getBearerToken(request));

  if (session.role === 'admin') {
    return { ...session, firstName: 'Harbor', lastName: 'Admin', status: 'approved' };
  }

  const record = await getPartnerById(session.id);

  if (!record) {
    throw Object.assign(new Error('Partner nicht gefunden.'), { statusCode: 404 });
  }

  const partner = normalizePartner(record);

  if (partner.status !== 'approved') {
    throw Object.assign(new Error('Warte auf Freigabe durch Leonid Curos'), { statusCode: 403 });
  }

  if (admin && partner.role !== 'admin') {
    throw Object.assign(new Error('Zugriff verweigert.'), { statusCode: 403 });
  }

  return { ...session, ...partner };
}

function defaultStore(kind) {
  const base = {
    role: 'system',
    kind,
    schemaVersion: 3,
    updatedAt: new Date().toISOString(),
  };

  if (kind === 'chat') {
    return { ...base, messages: [] };
  }

  if (kind === 'qa') {
    return { ...base, questions: [], answers: [] };
  }

  if (kind === 'presence') {
    return { ...base, presence: {} };
  }

  if (kind === 'testimonials') {
    return { ...base, testimonials: [] };
  }

  return { ...base, notifications: [] };
}

async function getSystemRecord(kind) {
  const email = SYSTEM_EMAILS[kind];
  const records = await supabaseRequest(`${PARTNERS_TABLE}?email=eq.${encodeURIComponent(email)}&select=*&limit=1`);

  if (records[0]) {
    return { record: records[0], store: { ...defaultStore(kind), ...parseMeta(records[0]) } };
  }

  const payload = {
    firstname: 'Community',
    lastname: kind,
    email,
    phone: '',
    city: 'Harbor',
    discount_code: `SYS_${kind.toUpperCase()}`,
    status: 'system',
    avatar_url: JSON.stringify(defaultStore(kind)),
  };
  const created = await supabaseRequest(PARTNERS_TABLE, { method: 'POST', body: payload });
  return { record: created[0] || payload, store: defaultStore(kind) };
}

async function saveSystemRecord(record, store) {
  const nextStore = { ...store, updatedAt: new Date().toISOString() };
  const records = await supabaseRequest(`${PARTNERS_TABLE}?id=eq.${encodeURIComponent(record.id)}`, {
    method: 'PATCH',
    body: { avatar_url: JSON.stringify(nextStore), status: 'system' },
  });

  return { record: records[0] || record, store: nextStore };
}

function toIso(value = new Date()) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function recentPresence(presence) {
  const now = Date.now();
  const seen = new Set();
  return Object.values(presence || {})
    .map((item) => ({
      ...item,
      online: now - new Date(item.lastSeenAt).getTime() < 5 * 60 * 1000,
    }))
    .filter((item) => {
      const name = String(item.name || '').toLowerCase();
      const key = item.role === 'admin' || name.includes('harbor admin') ? 'admin' : String(item.partnerId || name);

      if (TEST_DATA_PATTERNS.some((pattern) => name.includes(pattern))) {
        return false;
      }

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    })
    .sort((a, b) => new Date(b.lastSeenAt) - new Date(a.lastSeenAt));
}

async function touchPresence(partner) {
  const { record, store } = await getSystemRecord('presence');
  const nextPresence = {
    ...(store.presence || {}),
    [partner.id]: {
      partnerId: partner.id,
      name: displayName(partner),
      role: partner.role || 'partner',
      profileImageUrl: partner.profileImageUrl || '',
      status: 'online',
      lastSeenAt: toIso(),
    },
  };

  const { store: saved } = await saveSystemRecord(record, { ...store, presence: nextPresence });
  return saved.presence;
}

async function addNotification(type, title, body, actor) {
  const { record, store } = await getSystemRecord('notifications');
  const notification = {
    id: crypto.randomUUID(),
    type,
    title,
    body,
    actorId: actor.id,
    actorName: displayName(actor),
    seenBy: [actor.id],
    createdAt: toIso(),
  };

  const notifications = [notification, ...(store.notifications || [])].slice(0, 120);
  await saveSystemRecord(record, { ...store, notifications });
  return notification;
}

function safeText(value, max = 2000) {
  return String(value || '').trim().slice(0, max);
}

function normalizeUpdateTarget(body) {
  const targetType = String(body.targetType || body.targetGroup || 'all').trim();

  if (targetType === 'language') {
    return {
      type: 'language',
      language: safeText(body.targetLanguage || body.language, 80) || 'Deutsch',
    };
  }

  if (targetType === 'training') {
    return {
      type: 'training',
      training: safeText(body.targetTraining || body.training, 120),
    };
  }

  if (targetType === 'partners') {
    const partnerIds = Array.isArray(body.targetPartnerIds) ? body.targetPartnerIds : [];
    return {
      type: 'partners',
      partnerIds: partnerIds.map((id) => String(id)).filter(Boolean).slice(0, 200),
    };
  }

  return { type: 'all' };
}

function targetMatchesPartner(item, partner) {
  if (item.status && item.status !== 'published' && partner.role !== 'admin') {
    return false;
  }

  if (item.type === UPDATE_TYPE && item.delivery?.dashboard === false && partner.role !== 'admin') {
    return false;
  }

  if (partner.role === 'admin') {
    return true;
  }

  if (partner.status !== 'approved') {
    return false;
  }

  const target = item.target || { type: 'all' };

  if (!target.type || target.type === 'all') {
    return true;
  }

  if (target.type === 'language') {
    const partnerLanguage = partner.notificationPrefs?.language || partner.language || 'Deutsch';
    return partnerLanguage === target.language;
  }

  if (target.type === 'training') {
    return Boolean(target.training) && partner.assignedTraining === target.training;
  }

  if (target.type === 'partners') {
    return Array.isArray(target.partnerIds) && target.partnerIds.includes(partner.id);
  }

  return false;
}

function visibleNotifications(store, partner) {
  return (store.notifications || [])
    .filter((item) => targetMatchesPartner(item, partner))
    .filter((item) => !item.seenBy?.includes(partner.id))
    .slice(0, 20);
}

function academyUpdatesForPartner(store, partner) {
  return (store.notifications || [])
    .filter((item) => item.type === UPDATE_TYPE)
    .filter((item) => targetMatchesPartner(item, partner))
    .map((item) => ({
      ...item,
      read: Boolean(item.seenBy?.includes(partner.id)),
      badgeStatus: item.seenBy?.includes(partner.id) ? 'Gelesen' : 'Neu',
      important: item.priority === 'important' || item.category === 'announcement',
    }))
    .slice(0, 60);
}

function unreadUpdateCounts(updates) {
  const unread = updates.filter((item) => !item.read && item.status !== 'draft');
  const moduleCategories = new Set(['module', 'video']);
  const resourceCategories = new Set(['resource', 'file', 'image', 'photo']);

  return {
    newsUnread: unread.length,
    moduleUnread: unread.filter((item) => moduleCategories.has(item.category)).length,
    resourceUnread: unread.filter((item) => resourceCategories.has(item.category)).length,
  };
}

function normalizeRating(value) {
  const rating = Number(value);
  return Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.round(rating))) : 5;
}

function visibleTestimonialsForPartner(testimonials, partner) {
  const items = Array.isArray(testimonials) ? testimonials : [];

  if (partner.role === 'admin') {
    return items;
  }

  return items.filter((item) => item.status === 'approved' && item.hidden !== true);
}

async function testimonialState(partner) {
  const { store } = await getSystemRecord('testimonials');
  const testimonials = Array.isArray(store.testimonials) ? store.testimonials : [];
  const visibleTestimonials = visibleTestimonialsForPartner(testimonials, partner)
    .filter((item) => item.status === 'approved' && item.hidden !== true)
    .sort((a, b) => new Date(b.approved_at || b.created_at) - new Date(a.approved_at || a.created_at));
  const ownTestimonials = testimonials
    .filter((item) => item.user_id === partner.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return {
    testimonials: visibleTestimonials,
    ownTestimonials,
    adminTestimonials: partner.role === 'admin'
      ? testimonials.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      : [],
    summary: {
      testimonialCount: visibleTestimonials.length,
      testimonialPending: testimonials.filter((item) => item.status === 'pending').length,
      testimonialApproved: testimonials.filter((item) => item.status === 'approved' && item.hidden !== true).length,
    },
  };
}

async function submitTestimonial(partner, body) {
  const title = safeText(body.title, 140);
  const message = safeText(body.message || body.text, 1600);
  const rating = normalizeRating(body.rating);

  if (!title || !message) {
    return json({ message: 'Titel und Erfahrungsbericht sind Pflichtfelder.' }, 400);
  }

  if (message.length < 20) {
    return json({ message: 'Bitte schreibe mindestens 20 Zeichen zu deiner Erfahrung.' }, 400);
  }

  const { record, store } = await getSystemRecord('testimonials');
  const createdAt = toIso();
  const testimonial = {
    id: crypto.randomUUID(),
    user_id: partner.id,
    name: displayName(partner),
    profile_image: body.useProfileImage === false ? '' : partner.profileImageUrl || '',
    level: body.showLevel === false ? '' : partner.aquaLevel || '',
    team_size: body.showTeamSize === true ? Number(partner.teamPartnerCount || 0) : null,
    partner_status: partner.aquaLevel || 'Freigegebener Partner',
    rating,
    title,
    message,
    status: 'pending',
    hidden: false,
    created_at: createdAt,
    approved_at: '',
    approved_by: '',
    updated_at: createdAt,
  };
  const testimonials = [testimonial, ...(store.testimonials || [])].slice(0, 300);

  await saveSystemRecord(record, { ...store, testimonials });
  await addNotification('testimonial', 'Neues Testimonial wartet auf Freigabe', title, partner);

  return json({ testimonial, state: await testimonialState(partner) }, 201);
}

async function adminUpdateTestimonial(partner, body) {
  if (partner.role !== 'admin') {
    return json({ message: 'Nur Admins koennen Testimonials bearbeiten.' }, 403);
  }

  const testimonialId = safeText(body.id || body.testimonialId, 120);

  if (!testimonialId) {
    return json({ message: 'Testimonial-ID fehlt.' }, 400);
  }

  const { record, store } = await getSystemRecord('testimonials');
  let found = false;
  const now = toIso();
  const testimonials = (store.testimonials || []).map((item) => {
    if (item.id !== testimonialId) {
      return item;
    }

    found = true;
    const nextStatus = body.status ? safeText(body.status, 40) : item.status;
    const approvedNow = nextStatus === 'approved' && item.status !== 'approved';

    return {
      ...item,
      title: body.title !== undefined ? safeText(body.title, 140) : item.title,
      message: body.message !== undefined ? safeText(body.message, 1600) : item.message,
      rating: body.rating !== undefined ? normalizeRating(body.rating) : item.rating,
      status: ['pending', 'approved', 'rejected'].includes(nextStatus) ? nextStatus : item.status,
      hidden: body.hidden !== undefined ? Boolean(body.hidden) : item.hidden,
      approved_at: approvedNow ? now : item.approved_at || '',
      approved_by: approvedNow ? partner.email || 'Harbor Admin' : item.approved_by || '',
      updated_at: now,
    };
  });

  if (!found) {
    return json({ message: 'Testimonial nicht gefunden.' }, 404);
  }

  await saveSystemRecord(record, { ...store, testimonials });
  return json({ state: await testimonialState(partner) });
}

async function adminDeleteTestimonial(partner, body) {
  if (partner.role !== 'admin') {
    return json({ message: 'Nur Admins koennen Testimonials loeschen.' }, 403);
  }

  const testimonialId = safeText(body.id || body.testimonialId, 120);

  if (!testimonialId) {
    return json({ message: 'Testimonial-ID fehlt.' }, 400);
  }

  const { record, store } = await getSystemRecord('testimonials');
  const testimonials = (store.testimonials || []).filter((item) => item.id !== testimonialId);

  if (testimonials.length === (store.testimonials || []).length) {
    return json({ message: 'Testimonial nicht gefunden.' }, 404);
  }

  await saveSystemRecord(record, { ...store, testimonials });
  return json({ state: await testimonialState(partner) });
}

function sanitizeFileName(name) {
  return String(name || 'community-file').toLowerCase().replace(/[^a-z0-9._-]+/g, '-').slice(0, 90);
}

function fileExtension(name) {
  const cleanName = String(name || '').toLowerCase().split('?')[0].split('#')[0];
  return cleanName.includes('.') ? cleanName.split('.').pop() : '';
}

function classifyAttachment(attachment) {
  const name = String(attachment?.name || 'community-file');
  const type = String(attachment?.type || '').toLowerCase();
  const ext = fileExtension(name);

  if (DANGEROUS_FILE_EXTENSIONS.has(ext)) {
    throw Object.assign(new Error('Dieser Dateityp ist aus Sicherheitsgründen nicht erlaubt.'), { statusCode: 400 });
  }

  if (CHAT_IMAGE_TYPES.has(type) || ['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return 'image';
  }

  if (CHAT_FILE_EXTENSIONS.has(ext) || CHAT_FILE_TYPES.has(type)) {
    return 'file';
  }

  if (type.startsWith('audio/')) {
    return 'audio';
  }

  if (type.startsWith('video/')) {
    return 'video';
  }

  throw Object.assign(new Error('Dateityp ist nicht erlaubt.'), { statusCode: 400 });
}

function parseDataUrl(dataUrl) {
  const match = String(dataUrl || '').match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    return null;
  }

  return {
    mimeType: match[1],
    bytes: Buffer.from(match[2], 'base64'),
  };
}

async function deleteStorageObject(path) {
  if (!path) {
    return;
  }

  if (String(path).startsWith(`${COMMUNITY_R2_PREFIX}/`)) {
    await deleteR2Object(path).catch(() => {});
    return;
  }

  const { supabaseUrl, key } = getSupabaseConfig({ requireService: true });
  await fetch(`${supabaseUrl}/storage/v1/object/community-files/${path}`, {
    method: 'DELETE',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
  }).catch(() => {});
}

async function uploadAttachment(attachment, partner, { allowedKinds = ['image', 'file'] } = {}) {
  if (!attachment?.dataUrl) {
    return null;
  }

  const kind = classifyAttachment(attachment);

  if (!allowedKinds.includes(kind)) {
    const label = kind === 'audio' ? 'Sprachnachrichten' : kind === 'video' ? 'Videonachrichten' : 'Dieser Dateityp';
    throw Object.assign(new Error(`${label} sind aktuell als Phase 2 vorbereitet und noch nicht freigeschaltet.`), { statusCode: 400 });
  }

  const parsed = parseDataUrl(attachment.dataUrl);

  if (!parsed) {
    throw Object.assign(new Error('Datei konnte nicht gelesen werden.'), { statusCode: 400 });
  }

  if (parsed.bytes.length > COMMUNITY_UPLOAD_MAX_BYTES) {
    throw Object.assign(new Error('Datei ist zu gross. Maximal 10 MB.'), { statusCode: 400 });
  }

  if (parsed.mimeType !== String(attachment.type || parsed.mimeType).toLowerCase() && !String(attachment.type || '').startsWith('application/')) {
    throw Object.assign(new Error('Dateityp konnte nicht eindeutig geprüft werden.'), { statusCode: 400 });
  }

  const fileName = sanitizeFileName(attachment.name);
  const path = `${COMMUNITY_R2_PREFIX}/${partner.id}/${Date.now()}-${crypto.randomUUID()}-${sanitizeR2KeyPart(fileName, 'community-file')}`;
  const publicUrl = getR2PublicUrl(path);

  if (!publicUrl) {
    throw Object.assign(new Error('Dateispeicher ist nicht vollständig konfiguriert. Datei kann aktuell nicht hochgeladen werden.'), { statusCode: 503 });
  }

  const storedObject = await uploadR2Object({
    key: path,
    body: parsed.bytes,
    contentType: parsed.mimeType,
    cacheControl: 'public, max-age=31536000, immutable',
    kind: kind === 'video' ? 'video' : 'document',
    metadata: {
      kind: 'community-attachment',
      partnerId: partner.id,
      originalName: sanitizeR2KeyPart(attachment.name, 'community-file'),
      attachmentKind: kind,
    },
  });

  return {
    name: attachment.name || fileName,
    type: parsed.mimeType,
    kind,
    size: parsed.bytes.length,
    url: storedObject.url || publicUrl,
    path,
    provider: 'cloudflare-r2',
  };
}

async function communityState(partner) {
  const [chat, qa, presence, notifications, testimonialData] = await Promise.all([
    getSystemRecord('chat'),
    getSystemRecord('qa'),
    touchPresence(partner).then((nextPresence) => ({ store: { presence: nextPresence } })),
    getSystemRecord('notifications'),
    testimonialState(partner),
  ]);

  const messages = (chat.store.messages || []).slice(-80);
  const questions = (qa.store.questions || []).map((question) => ({
    ...question,
    answers: (qa.store.answers || []).filter((answer) => answer.questionId === question.id),
  }));
  const presenceList = recentPresence(presence.store.presence);
  const onlineCount = presenceList.filter((item) => item.online).length;

  const messageCount = messages.length;
  const questionCount = questions.length;
  const openQuestionCount = questions.filter((question) => !question.bestAnswerId).length;
  const answeredQuestionCount = questions.filter((question) => question.bestAnswerId || question.answers?.length).length;
  const visible = visibleNotifications(notifications.store, partner);
  const academyUpdates = academyUpdatesForPartner(notifications.store, partner);
  const updateCounts = unreadUpdateCounts(academyUpdates);
  const notificationCount = visible.length;

  return {
    messages,
    questions,
    presence: presenceList,
    notifications: visible,
    testimonials: testimonialData.testimonials,
    ownTestimonials: testimonialData.ownTestimonials,
    adminTestimonials: testimonialData.adminTestimonials,
    academyUpdates,
    notificationLogs: partner.role === 'admin' ? (notifications.store.notifications || []).filter((item) => item.type === UPDATE_TYPE).slice(0, 40) : [],
    summary: {
      messages: messageCount,
      messageCount,
      questions: questionCount,
      questionCount,
      openQuestions: openQuestionCount,
      openQuestionCount,
      answeredQuestions: answeredQuestionCount,
      answeredQuestionCount,
      onlinePartners: onlineCount,
      notificationCount,
      testimonialCount: testimonialData.summary.testimonialCount,
      testimonialPending: testimonialData.summary.testimonialPending,
      ...updateCounts,
    },
  };
}

async function sendChatMessage(partner, body) {
  const messageText = safeText(body.text);
  const attachment = await uploadAttachment(body.attachment, partner, { allowedKinds: ['image', 'file'] });

  if (!messageText && !attachment) {
    return json({ message: 'Nachricht ist leer.' }, 400);
  }

  const { record, store } = await getSystemRecord('chat');
  const existingMessages = store.messages || [];

  if (partner.role !== 'admin') {
    const recentOwnMessages = existingMessages.filter((item) => (
      item.authorId === partner.id && Date.now() - new Date(item.createdAt || item.created_at).getTime() < 15_000
    ));

    if (recentOwnMessages.length >= 3) {
      return json({ message: 'Bitte kurz warten, bevor du weitere Nachrichten sendest.' }, 429);
    }
  }

  const type = attachment?.kind || 'text';
  const message = {
    id: crypto.randomUUID(),
    message_id: '',
    authorId: partner.id,
    user_id: partner.id,
    authorName: displayName(partner),
    authorRole: partner.role || 'partner',
    authorImage: partner.profileImageUrl || '',
    text: messageText,
    content: messageText,
    type,
    attachment,
    file_url: attachment?.url || '',
    file_name: attachment?.name || '',
    file_type: attachment?.type || '',
    file_size: attachment?.size || 0,
    createdAt: toIso(),
    created_at: '',
  };
  message.message_id = message.id;
  message.created_at = message.createdAt;
  const messages = [...existingMessages, message].slice(-250);

  await saveSystemRecord(record, { ...store, messages });
  await touchPresence(partner);
  await addNotification('chat', 'Neue Chat Nachricht', messageText || attachment?.name || 'Datei', partner);

  return json({ message, state: await communityState(partner) }, 201);
}

async function deleteChatMessage(partner, body) {
  if (partner.role !== 'admin') {
    return json({ message: 'Nur Admins koennen Nachrichten loeschen.' }, 403);
  }

  const messageId = safeText(body.messageId || body.id, 120);

  if (!messageId) {
    return json({ message: 'Nachrichten-ID fehlt.' }, 400);
  }

  const { record, store } = await getSystemRecord('chat');
  const target = (store.messages || []).find((item) => item.id === messageId || item.message_id === messageId);

  if (!target) {
    return json({ message: 'Nachricht nicht gefunden.' }, 404);
  }

  await deleteStorageObject(target.attachment?.path);
  const messages = (store.messages || []).filter((item) => item.id !== messageId && item.message_id !== messageId);
  await saveSystemRecord(record, { ...store, messages });

  return json({ state: await communityState(partner) });
}

async function createQuestion(partner, body) {
  const questionText = safeText(body.question || body.title, 500);
  const category = safeText(body.category, 120) || 'Sonstiges';
  const attachment = await uploadAttachment(body.attachment, partner);

  if (!questionText) {
    return json({ message: 'Frage ist leer.' }, 400);
  }

  const { record, store } = await getSystemRecord('qa');
  const question = {
    id: crypto.randomUUID(),
    question: questionText,
    category,
    authorId: partner.id,
    authorName: displayName(partner),
    attachment,
    bestAnswerId: '',
    createdAt: toIso(),
    updatedAt: toIso(),
  };
  const questions = [question, ...(store.questions || [])].slice(0, 200);

  await saveSystemRecord(record, { ...store, questions });
  await touchPresence(partner);
  await addNotification('question', 'Neue Frage', questionText, partner);

  return json({ question, state: await communityState(partner) }, 201);
}

async function createAnswer(partner, body) {
  const questionId = safeText(body.questionId, 80);
  const answerText = safeText(body.text);
  const attachment = await uploadAttachment(body.attachment, partner);

  if (!questionId || (!answerText && !attachment)) {
    return json({ message: 'Antwort ist unvollstaendig.' }, 400);
  }

  const { record, store } = await getSystemRecord('qa');
  const questionExists = (store.questions || []).some((question) => question.id === questionId);

  if (!questionExists) {
    return json({ message: 'Frage nicht gefunden.' }, 404);
  }

  const answer = {
    id: crypto.randomUUID(),
    questionId,
    authorId: partner.id,
    authorName: displayName(partner),
    text: answerText,
    attachment,
    isBest: false,
    createdAt: toIso(),
    updatedAt: toIso(),
  };
  const answers = [...(store.answers || []), answer].slice(-500);

  await saveSystemRecord(record, { ...store, answers });
  await touchPresence(partner);
  await addNotification('answer', 'Neue Antwort', answerText || attachment?.name || 'Datei', partner);

  return json({ answer, state: await communityState(partner) }, 201);
}

async function updateAnswer(partner, body) {
  const answerId = safeText(body.answerId, 80);
  const text = safeText(body.text);

  if (!answerId || !text) {
    return json({ message: 'Antwort ist unvollstaendig.' }, 400);
  }

  const { record, store } = await getSystemRecord('qa');
  let foundAnswer = false;
  const answers = (store.answers || []).map((answer) => {
    if (answer.id !== answerId) {
      return answer;
    }

    foundAnswer = true;

    if (answer.authorId !== partner.id && partner.role !== 'admin') {
      throw Object.assign(new Error('Zugriff verweigert.'), { statusCode: 403 });
    }

    return { ...answer, text, updatedAt: toIso() };
  });

  if (!foundAnswer) {
    return json({ message: 'Antwort nicht gefunden.' }, 404);
  }

  await saveSystemRecord(record, { ...store, answers });
  return json({ state: await communityState(partner) });
}

async function markBestAnswer(partner, body) {
  if (partner.role !== 'admin') {
    return json({ message: 'Nur Admins koennen die beste Antwort markieren.' }, 403);
  }

  const questionId = safeText(body.questionId, 80);
  const answerId = safeText(body.answerId, 80);
  const { record, store } = await getSystemRecord('qa');
  const questionExists = (store.questions || []).some((question) => question.id === questionId);
  const answerExists = (store.answers || []).some((answer) => answer.id === answerId && answer.questionId === questionId);

  if (!questionExists || !answerExists) {
    return json({ message: 'Frage oder Antwort nicht gefunden.' }, 404);
  }

  const questions = (store.questions || []).map((question) => (
    question.id === questionId ? { ...question, bestAnswerId: answerId, updatedAt: toIso() } : question
  ));
  const answers = (store.answers || []).map((answer) => (
    answer.questionId === questionId ? { ...answer, isBest: answer.id === answerId, updatedAt: toIso() } : answer
  ));

  await saveSystemRecord(record, { ...store, questions, answers });
  return json({ state: await communityState(partner) });
}

function updateRecipientList(update, partners) {
  return partners.filter((recipient) => targetMatchesPartner({ ...update, status: 'published' }, recipient));
}

function buildWhatsappText(update) {
  const link = update.link || `${getAcademyBaseUrl()}/?news=1`;
  return `Hallo [Vorname], in der Harbor Global Academy gibt es neue Inhalte: ${update.title}. Schau direkt rein: ${link}`;
}

async function createAcademyUpdate(partner, body) {
  if (partner.role !== 'admin') {
    return json({ message: 'Nur Admins koennen Neuigkeiten senden.' }, 403);
  }

  const title = safeText(body.title, 160);
  const description = safeText(body.description || body.body, 1200);
  const category = safeText(body.category, 80) || 'news';
  const link = safeText(body.link, 500) || `${getAcademyBaseUrl()}/?news=1`;
  const language = safeText(body.language, 80) || 'Alle Sprachen';
  const sendNow = body.sendNow !== false && body.draft !== true;
  const target = normalizeUpdateTarget(body);
  const delivery = {
    email: body.deliveryEmail === true,
    whatsapp: body.deliveryWhatsapp === true,
    dashboard: body.deliveryDashboard !== false,
  };

  if (!title || !description) {
    return json({ message: 'Titel und Beschreibung sind Pflichtfelder.' }, 400);
  }

  const createdAt = toIso();
  const update = {
    id: crypto.randomUUID(),
    type: UPDATE_TYPE,
    title,
    body: description,
    description,
    category,
    link,
    language,
    target,
    delivery,
    priority: category === 'announcement' || body.important === true ? 'important' : 'normal',
    status: sendNow ? 'published' : 'draft',
    actorId: partner.id,
    actorName: displayName(partner),
    createdById: partner.id,
    createdByEmail: partner.email || '',
    createdAt,
    sentAt: sendNow ? createdAt : '',
    seenBy: [partner.id],
  };
  update.whatsappText = buildWhatsappText(update);

  const approvedPartners = sendNow ? await listApprovedPartners() : [];
  const recipients = sendNow ? updateRecipientList(update, approvedPartners) : [];
  const emailRecipients = delivery.email ? recipients.filter((recipient) => recipient.notificationPrefs?.emailUpdates !== false) : [];
  const emailResults = [];

  for (const recipient of emailRecipients.slice(0, 500)) {
    const template = academyUpdateEmail(update, recipient);
    const result = await sendEmail({
      to: recipient.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      idempotencyKey: `harbor-academy-update-${update.id}-${recipient.id}`,
    });
    emailResults.push({
      partnerId: recipient.id,
      email: recipient.email,
      sent: Boolean(result.sent),
      error: result.error || '',
      provider: result.provider || 'resend',
      id: result.id || '',
    });
  }

  const emailSentCount = emailResults.filter((result) => result.sent).length;
  const emailFailedCount = emailResults.filter((result) => !result.sent).length;
  const sendStatus = !sendNow
    ? 'entwurf'
    : delivery.email
      ? (emailFailedCount === 0 ? 'gesendet' : emailSentCount > 0 ? 'teilweise' : 'fehlgeschlagen')
      : 'dashboard';
  const updateWithLog = {
    ...update,
    recipientCount: recipients.length,
    emailRecipientCount: emailRecipients.length,
    emailSentCount,
    emailFailedCount,
    sendStatus,
    emailResults: emailResults.slice(0, 40),
  };
  const { record, store } = await getSystemRecord('notifications');
  const notifications = [updateWithLog, ...(store.notifications || [])].slice(0, 200);

  await saveSystemRecord(record, { ...store, notifications });

  return json({
    update: updateWithLog,
    whatsappText: updateWithLog.whatsappText,
    recipientCount: updateWithLog.recipientCount,
    emailSentCount,
    emailFailedCount,
    sendStatus,
    state: await communityState(partner),
  }, sendNow ? 201 : 200);
}

async function markNotificationRead(partner, body) {
  const notificationId = safeText(body.notificationId, 120);

  if (!notificationId) {
    return json({ message: 'Benachrichtigungs-ID fehlt.' }, 400);
  }

  const { record, store } = await getSystemRecord('notifications');
  const notifications = (store.notifications || []).map((notification) => (
    notification.id === notificationId
      ? { ...notification, seenBy: Array.from(new Set([...(notification.seenBy || []), partner.id])) }
      : notification
  ));

  await saveSystemRecord(record, { ...store, notifications });
  return json({ state: await communityState(partner) });
}

async function markNotificationsRead(partner) {
  const { record, store } = await getSystemRecord('notifications');
  const notifications = (store.notifications || []).map((notification) => ({
    ...notification,
    seenBy: Array.from(new Set([...(notification.seenBy || []), partner.id])),
  }));

  await saveSystemRecord(record, { ...store, notifications });
  return json({ notifications: [] });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const partner = await requireApprovedSession(request);

    if (body.action === 'community-state') {
      return json(await communityState(partner));
    }

    if (body.action === 'presence-heartbeat') {
      const presence = await touchPresence(partner);
      return json({ presence: recentPresence(presence) });
    }

    if (body.action === 'chat-send') {
      return await sendChatMessage(partner, body);
    }

    if (body.action === 'chat-delete') {
      return await deleteChatMessage(partner, body);
    }

    if (body.action === 'question-create') {
      return await createQuestion(partner, body);
    }

    if (body.action === 'answer-create') {
      return await createAnswer(partner, body);
    }

    if (body.action === 'answer-update') {
      return await updateAnswer(partner, body);
    }

    if (body.action === 'answer-best') {
      return await markBestAnswer(partner, body);
    }

    if (body.action === 'academy-update-create') {
      return await createAcademyUpdate(partner, body);
    }

    if (body.action === 'notification-read') {
      return await markNotificationRead(partner, body);
    }

    if (body.action === 'notifications-read') {
      return await markNotificationsRead(partner);
    }

    if (body.action === 'testimonial-state') {
      return json(await testimonialState(partner));
    }

    if (body.action === 'testimonial-submit') {
      return await submitTestimonial(partner, body);
    }

    if (body.action === 'testimonial-admin-update') {
      return await adminUpdateTestimonial(partner, body);
    }

    if (body.action === 'testimonial-admin-delete') {
      return await adminDeleteTestimonial(partner, body);
    }

    return json({ message: 'Unbekannte Aktion.' }, 400);
  } catch (error) {
    return json({ message: error.message || 'Serverfehler.' }, error.statusCode || 500);
  }
}
