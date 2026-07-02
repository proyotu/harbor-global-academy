import crypto from 'node:crypto';
import { normalizeAcademyProgress } from '../../lib/academy-progress';
import {
  deleteR2Object,
  getR2Object,
  sanitizeR2KeyPart,
  uploadR2Object,
} from '../../../lib/storage/r2';

const PARTNERS_TABLE = 'partners';
const DEFAULT_DISCOUNT_CODE = '119872';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const PASSWORD_RESET_TTL_SECONDS = 60 * 60;
const REGISTRATION_SOURCE = 'Live-Webseite';
const DEFAULT_ACADEMY_BASE_URL = 'https://www.harborglobalacademy.com';
const SUPPORT_WHATSAPP_URL = 'https://wa.me/message/C4HIF7M6EO7UK1';
const SUPPORT_TELEGRAM_URL = 'https://t.me/ProYoTu';
const ADMIN_PROFILE_SESSION_ID = 'harbor-admin';
const ADMIN_PROFILE_FIRST_NAME = 'Leonid';
const ADMIN_PROFILE_LAST_NAME = 'Curos';
const ADMIN_PROFILE_PHONE = '015227370000';
const ADMIN_PROFILE_CITY = 'Geretsried';
const ADMIN_PROFILE_BADGE = 'Founder / Admin';
const ADMIN_INITIAL_POINTS = 3450.25;
const ADMIN_INITIAL_TEAM_COUNT = 0;
const ADMIN_NEXT_TEAM_TARGET = 100;
const ADMIN_LONG_TERM_TEAM_TARGET = 500;
const ADMIN_INITIAL_UPDATED_AT = '2026-06-07T00:00:00.000Z';
const PROFILE_IMAGE_MAX_BYTES = 1.5 * 1024 * 1024;
const PROFILE_IMAGE_UPDATE_MAX_BYTES = 1024 * 1024;
const PROFILE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const PROFILE_IMAGE_BUCKET = 'avatars';
const PROFILE_IMAGE_R2_PROVIDER = 'cloudflare-r2';
const PROFILE_IMAGE_R2_PREFIX = 'profile-images';
const PROFILE_IMAGE_URL_TTL_SECONDS = 60 * 60;
const PROFILE_IMAGE_EXTENSION_BY_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
const LANGUAGE_BY_CODE = {
  de: '🇩🇪 Deutsch',
  en: '🇬🇧 English',
  ro: '🇷🇴 Română',
  ru: '🇷🇺 Русский',
  el: '🇬🇷 Ελληνικά',
  tr: '🇹🇷 Türkçe',
  it: '🇮🇹 Italiano',
  cs: '🇨🇿 Čeština',
  es: '🇪🇸 Español',
  pl: '🇵🇱 Polski',
};
const LANGUAGE_CODE_ALIASES = {
  de: 'de',
  Deutsch: 'de',
  '🇩🇪 Deutsch': 'de',
  en: 'en',
  English: 'en',
  '🇬🇧 English': 'en',
  ro: 'ro',
  Română: 'ro',
  Romana: 'ro',
  '🇷🇴 Română': 'ro',
  ru: 'ru',
  Русский: 'ru',
  '🇷🇺 Русский': 'ru',
  gr: 'el',
  el: 'el',
  Ελληνικά: 'el',
  '🇬🇷 Ελληνικά': 'el',
  tr: 'tr',
  Türkçe: 'tr',
  Turkce: 'tr',
  '🇹🇷 Türkçe': 'tr',
  it: 'it',
  Italiano: 'it',
  '🇮🇹 Italiano': 'it',
  cz: 'cs',
  cs: 'cs',
  Čeština: 'cs',
  Cestina: 'cs',
  '🇨🇿 Čeština': 'cs',
  es: 'es',
  Español: 'es',
  Espanol: 'es',
  '🇪🇸 Español': 'es',
  pl: 'pl',
  Polski: 'pl',
  '🇵🇱 Polski': 'pl',
};
const AQUA_GLOBAL_LEVELS = [
  { name: 'Starterstufe', min: 0, max: 50 },
  { name: 'Level 1', min: 51, max: 500 },
  { name: 'Level 2', min: 501, max: 1500 },
  { name: 'Level 3', min: 1501, max: 5000 },
  { name: 'Level 4', min: 5001, max: 15000 },
  { name: 'Level 5', min: 15001, max: 45000 },
  { name: 'Level 6', min: 45001, max: 150000 },
];
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
  'harbor-test.local',
  'phase3',
  'leo boy',
  'leoboy',
];

function json(data, status = 200) {
  return Response.json(data, { status });
}

function readEnv(name) {
  return String(process.env[name] || '').trim();
}

function normalizeLanguageCode(value) {
  const raw = String(value || '').trim();
  return LANGUAGE_CODE_ALIASES[raw] || 'de';
}

function normalizeLanguageLabel(value) {
  return LANGUAGE_BY_CODE[normalizeLanguageCode(value)] || LANGUAGE_BY_CODE.de;
}

function getAcademyBaseUrl() {
  return (readEnv('ACADEMY_BASE_URL') || DEFAULT_ACADEMY_BASE_URL).replace(/\/$/, '');
}

function getAdminNotificationEmail() {
  return readEnv('HARBOR_ADMIN_EMAIL') || 'leonid.curos.ag@gmail.com';
}

function toPoints(value) {
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
  const points = toPoints(pointsInput);
  const levelIndex = AQUA_GLOBAL_LEVELS.findIndex((level) => points <= level.max);
  const safeIndex = levelIndex === -1 ? AQUA_GLOBAL_LEVELS.length - 1 : levelIndex;
  const level = AQUA_GLOBAL_LEVELS[safeIndex];
  const nextLevel = AQUA_GLOBAL_LEVELS[safeIndex + 1] || null;
  const targetPoints = level.max;
  const levelProgress = nextLevel
    ? Math.min(100, Math.max(0, Math.round((points / Math.max(targetPoints, 1)) * 100)))
    : 100;

  return {
    points,
    level: level.name,
    levelMin: level.min,
    levelMax: level.max,
    nextLevel: nextLevel?.name || '',
    nextLevelPoints: nextLevel ? targetPoints : null,
    pointsToNextLevel: nextLevel ? Math.max(0, Math.round((targetPoints - points) * 100) / 100) : 0,
    levelProgress,
  };
}

function getAquaLevelIndex(levelName) {
  return AQUA_GLOBAL_LEVELS.findIndex((level) => level.name === levelName);
}

function toPartnerCount(value) {
  const parsed = Number(String(value ?? 0).replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
}

function calculateTeamGrowth({ currentCount, previousCount = 0, targetCount = 100, longTermTargetCount = 500 }) {
  const current = toPartnerCount(currentCount);
  const previous = toPartnerCount(previousCount);
  const nextTarget = Math.max(toPartnerCount(targetCount), current || 1);
  const longTermTarget = Math.max(toPartnerCount(longTermTargetCount), nextTarget);
  const newSinceLastUpdate = Math.max(0, current - previous);
  const growthPercent = previous > 0
    ? Math.round((newSinceLastUpdate / previous) * 1000) / 10
    : current > 0 ? 100 : 0;
  const targetProgress = Math.min(100, Math.max(0, Math.round((current / Math.max(nextTarget, 1)) * 100)));
  const longTermProgress = Math.min(100, Math.max(0, Math.round((current / Math.max(longTermTarget, 1)) * 100)));

  return {
    currentCount: current,
    previousCount: previous,
    targetCount: nextTarget,
    longTermTargetCount: longTermTarget,
    newSinceLastUpdate,
    growthPercent,
    targetProgress,
    longTermProgress,
  };
}

function getSupabaseConfig({ requireService = false } = {}) {
  const supabaseUrl = readEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anonKey = readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const serviceKey = readEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !anonKey) {
    throw Object.assign(new Error('Supabase ist nicht konfiguriert.'), { statusCode: 503 });
  }

  if (requireService && !serviceKey) {
    throw Object.assign(new Error('SUPABASE_SERVICE_ROLE_KEY fehlt. Admin-Freigaben koennen nicht dauerhaft gespeichert werden.'), { statusCode: 503 });
  }

  return {
    supabaseUrl: supabaseUrl.replace(/\/$/, ''),
    key: requireService ? serviceKey : serviceKey || anonKey,
  };
}

function getAuthSecret() {
  return readEnv('HARBOR_AUTH_SECRET') || readEnv('SUPABASE_SERVICE_ROLE_KEY') || readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 'local-harbor-dev-secret';
}

async function supabaseRequest(path, options = {}, { requireService = false } = {}) {
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

function signToken(payload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', getAuthSecret()).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
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

function getBearerToken(request) {
  const authorization = request.headers.get('authorization') || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
}

function createPasswordHash(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex');
  return { salt, hash };
}

function verifyPassword(password, meta) {
  if (!meta?.passwordHash || !meta?.passwordSalt) {
    return false;
  }

  const { hash } = createPasswordHash(password, meta.passwordSalt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(meta.passwordHash));
}

function parseMeta(record) {
  if (!record?.avatar_url || !record.avatar_url.trim().startsWith('{')) {
    return {};
  }

  try {
    return JSON.parse(record.avatar_url);
  } catch {
    return {};
  }
}

function validateProfileImagePayload(profileImage) {
  if (!profileImage || typeof profileImage !== 'object') {
    throw Object.assign(new Error('Bitte lade ein Profilbild hoch.'), { statusCode: 400 });
  }

  const type = String(profileImage.type || '').toLowerCase();
  const dataUrl = String(profileImage.dataUrl || '');
  const name = String(profileImage.name || 'profilbild').slice(0, 120);
  const size = Number(profileImage.size || 0);

  if (!PROFILE_IMAGE_TYPES.includes(type) || !dataUrl.startsWith(`data:${type};base64,`)) {
    throw Object.assign(new Error('Bitte lade ein JPG-, PNG- oder WEBP-Bild hoch.'), { statusCode: 400 });
  }

  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  const actualBytes = Buffer.byteLength(base64, 'base64');
  const safeSize = Number.isFinite(size) && size > 0 ? size : actualBytes;

  if (actualBytes <= 0 || safeSize > PROFILE_IMAGE_MAX_BYTES || actualBytes > PROFILE_IMAGE_MAX_BYTES) {
    throw Object.assign(new Error('Das Profilbild darf maximal 1,5 MB gross sein.'), { statusCode: 400 });
  }

  return {
    name,
    type,
    size: safeSize,
    dataUrl,
    bytes: Buffer.from(base64, 'base64'),
    uploadedAt: profileImage.uploadedAt || new Date().toISOString(),
  };
}

function hasValidProfileImageSignature(bytes, type) {
  if (!Buffer.isBuffer(bytes) || bytes.length < 12) {
    return false;
  }

  if (type === 'image/jpeg') {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (type === 'image/webp') {
    return bytes.subarray(0, 4).toString('ascii') === 'RIFF'
      && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
  }

  return false;
}

function validateOptimizedProfileImagePayload(profileImage) {
  const validated = validateProfileImagePayload(profileImage);

  if (!['image/jpeg', 'image/webp'].includes(validated.type)) {
    throw Object.assign(new Error('Das optimierte Profilbild muss als JPEG oder WEBP gespeichert werden.'), { statusCode: 400 });
  }

  if (validated.bytes.length > PROFILE_IMAGE_UPDATE_MAX_BYTES || validated.size > PROFILE_IMAGE_UPDATE_MAX_BYTES) {
    throw Object.assign(new Error('Das optimierte Profilbild darf maximal 1 MB gross sein.'), { statusCode: 400 });
  }

  if (!hasValidProfileImageSignature(validated.bytes, validated.type)) {
    throw Object.assign(new Error('Die Bilddatei ist ungueltig oder entspricht nicht dem angegebenen Dateityp.'), { statusCode: 400 });
  }

  return validated;
}

function isValidPartnerId(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
}

function encodeStoragePath(path) {
  return String(path || '')
    .split('/')
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join('/');
}

function isValidLegacyProfileImagePath(path) {
  return /^partners\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(?:jpg|png|webp)$/i.test(String(path || ''));
}

function isValidR2ProfileImagePath(path) {
  return /^profile-images\/partners\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(?:jpg|png|webp)$/i.test(String(path || ''));
}

function isValidProfileImagePath(path) {
  return isValidLegacyProfileImagePath(path) || isValidR2ProfileImagePath(path);
}

function isR2ProfileImage(profileImage) {
  return profileImage?.provider === PROFILE_IMAGE_R2_PROVIDER
    || profileImage?.storage === 'r2'
    || profileImage?.storageProvider === PROFILE_IMAGE_R2_PROVIDER;
}

function isLegacySupabaseProfileImage(profileImage) {
  return profileImage?.bucket === PROFILE_IMAGE_BUCKET && isValidLegacyProfileImagePath(profileImage?.path);
}

function getProfileImageAccessSignature(path, expires) {
  return crypto.createHmac('sha256', getAuthSecret()).update(`${path}.${expires}`).digest('base64url');
}

function getProfileImageAccessUrl(profileImage) {
  const path = String(profileImage?.path || '');

  if (!isValidProfileImagePath(path) || (!isR2ProfileImage(profileImage) && !isLegacySupabaseProfileImage(profileImage))) {
    return '';
  }

  const expires = Math.floor(Date.now() / 1000) + PROFILE_IMAGE_URL_TTL_SECONDS;
  const signature = getProfileImageAccessSignature(path, expires);
  const params = new URLSearchParams({
    'profile-photo': path,
    expires: String(expires),
    signature,
  });
  return `/api/partners?${params.toString()}`;
}

async function storageRequest(path, options = {}) {
  const { supabaseUrl, key } = getSupabaseConfig({ requireService: true });
  const response = await fetch(`${supabaseUrl}/storage/v1/${path}`, {
    method: options.method || 'GET',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...(options.headers || {}),
    },
    body: options.body,
  });

  if (!response.ok) {
    const text = await response.text();
    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    const message = data?.message || data?.error || 'Supabase-Storage-Anfrage fehlgeschlagen.';
    throw Object.assign(new Error(message), { statusCode: response.status, details: data });
  }

  return response;
}

async function uploadProfileImage(profileImage, partnerId) {
  const extension = PROFILE_IMAGE_EXTENSION_BY_TYPE[profileImage.type];
  const path = `${PROFILE_IMAGE_R2_PREFIX}/partners/${partnerId}/${crypto.randomUUID()}.${extension}`;
  const storedObject = await uploadR2Object({
    key: path,
    body: profileImage.bytes,
    contentType: profileImage.type,
    cacheControl: 'private, max-age=300',
    kind: 'profileImage',
    metadata: {
      kind: 'profile-image',
      partnerId,
      originalName: sanitizeR2KeyPart(profileImage.name, 'profilbild'),
    },
  });

  return {
    provider: PROFILE_IMAGE_R2_PROVIDER,
    bucket: storedObject.bucket,
    path,
    url: storedObject.url,
    name: profileImage.name,
    type: profileImage.type,
    size: profileImage.size,
    uploadedAt: profileImage.uploadedAt,
  };
}

async function deleteProfileImage(profileImage, partnerId = '') {
  const path = String(profileImage?.path || '');

  if (!isValidProfileImagePath(path)) {
    return;
  }

  if (isR2ProfileImage(profileImage)) {
    if (!isValidR2ProfileImagePath(path) || (partnerId && !path.startsWith(`${PROFILE_IMAGE_R2_PREFIX}/partners/${partnerId}/`))) {
      return;
    }

    await deleteR2Object(path);
    return;
  }

  if (!isLegacySupabaseProfileImage(profileImage) || (partnerId && !path.startsWith(`partners/${partnerId}/`))) {
    return;
  }

  await storageRequest(`object/${PROFILE_IMAGE_BUCKET}/${encodeStoragePath(path)}`, {
    method: 'DELETE',
  });
}

async function serveProfileImage(request) {
  const url = new URL(request.url);
  const path = String(url.searchParams.get('profile-photo') || '');
  const expires = Number(url.searchParams.get('expires') || 0);
  const signature = String(url.searchParams.get('signature') || '');
  const expectedSignature = getProfileImageAccessSignature(path, expires);
  const now = Math.floor(Date.now() / 1000);
  const validSignature = signature.length === expectedSignature.length
    && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));

  if (
    !isValidProfileImagePath(path)
    || !Number.isInteger(expires)
    || expires < now
    || expires > now + PROFILE_IMAGE_URL_TTL_SECONDS + 60
    || !validSignature
  ) {
    return json({ message: 'Profilbild-Link ist ungueltig oder abgelaufen.' }, 403);
  }

  if (isValidR2ProfileImagePath(path)) {
    const response = await getR2Object(path);
    const bytes = await response.arrayBuffer();

    return new Response(bytes, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
        'Cache-Control': 'private, max-age=300',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  const response = await storageRequest(`object/authenticated/${PROFILE_IMAGE_BUCKET}/${encodeStoragePath(path)}`);
  const bytes = await response.arrayBuffer();

  return new Response(bytes, {
    status: 200,
    headers: {
      'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
      'Cache-Control': 'private, max-age=300',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function hashResetToken(token) {
  return crypto.createHmac('sha256', getAuthSecret()).update(String(token || '')).digest('hex');
}

function verifyResetToken(token, tokenHash) {
  if (!token || !tokenHash) {
    return false;
  }

  const hash = hashResetToken(token);
  return hash.length === tokenHash.length && crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(tokenHash));
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

function emailLogEntry(result, at = new Date().toISOString()) {
  return {
    sent: Boolean(result.sent),
    sentAt: result.sent ? at : '',
    provider: result.provider || 'resend',
    id: result.id || '',
    error: result.sent ? '' : result.error || '',
  };
}

async function patchPartnerMeta(record, meta, { requireService = false } = {}) {
  if (!record?.id) {
    return { ...record, avatar_url: JSON.stringify(meta) };
  }

  try {
    const records = await supabaseRequest(`${PARTNERS_TABLE}?id=eq.${encodeURIComponent(record.id)}`, {
      method: 'PATCH',
      body: { avatar_url: JSON.stringify(meta) },
    }, { requireService });

    return records[0] || { ...record, avatar_url: JSON.stringify(meta) };
  } catch {
    return { ...record, avatar_url: JSON.stringify(meta) };
  }
}

function registrationReceivedEmail(partner) {
  const firstName = partner.firstname || partner.firstName || 'Partner';
  const email = partner.email || '';
  const academyUrl = getAcademyBaseUrl();
  const body = `
    <p>Hallo ${escapeHtml(firstName)},</p>
    <p>deine Registrierung bei der Harbor Global Partner Academy ist eingegangen.</p>
    <p>Status: <strong>Warte auf Freigabe durch Leonid Curos</strong>. Solange dein Status auf <strong>pending</strong> steht, bleibt das Dashboard geschützt.</p>
    <p><strong>Benutzername:</strong> ${escapeHtml(email)}</p>
    <p>Dein Passwort wird aus Sicherheitsgründen nicht angezeigt und niemals per E-Mail versendet.</p>
  `;

  return {
    subject: 'Deine Registrierung bei der Harbor Global Partner Academy ist eingegangen',
    html: emailShell({
      title: 'Registrierung eingegangen',
      preview: 'Deine Registrierung wurde empfangen und wartet auf Freigabe durch Leonid Curos.',
      body,
      buttons: [{ label: 'Zur Academy', href: academyUrl }],
    }),
    text: `Hallo ${firstName},\n\ndeine Registrierung bei der Harbor Global Partner Academy ist eingegangen.\nStatus: Warte auf Freigabe durch Leonid Curos.\nBenutzername: ${email}\nDein Passwort wird aus Sicherheitsgründen nicht angezeigt.\n\nZur Academy: ${academyUrl}`,
  };
}

function approvalEmail(partner) {
  const firstName = partner.firstname || partner.firstName || 'Partner';
  const email = partner.email || '';
  const academyUrl = `${getAcademyBaseUrl()}/?login=1`;
  const resetUrl = `${getAcademyBaseUrl()}/passwort-zuruecksetzen`;
  const body = `
    <p>Hallo ${escapeHtml(firstName)},</p>
    <p>dein Zugang zur Harbor Global Partner Academy wurde freigeschaltet.</p>
    <p><strong>Benutzername:</strong> ${escapeHtml(email)}</p>
    <p>Du kannst dich jetzt einloggen. Falls dein Login nicht funktioniert, nutze bitte den Passwort-Reset oder kontaktiere den Support direkt.</p>
  `;
  const footer = `
    Support: <a href="${SUPPORT_WHATSAPP_URL}" style="color:#f6c84f;">WhatsApp</a> oder
    <a href="${SUPPORT_TELEGRAM_URL}" style="color:#f6c84f;">Telegram</a>.
  `;

  return {
    subject: 'Dein Zugang zur Harbor Global Partner Academy wurde freigeschaltet',
    html: emailShell({
      title: 'Zugang freigeschaltet',
      preview: 'Dein Academy-Zugang ist approved und bereit.',
      body,
      buttons: [
        { label: 'Jetzt einloggen', href: academyUrl },
        { label: 'Passwort vergessen / Passwort zurücksetzen', href: resetUrl },
      ],
      footer,
    }),
    text: `Hallo ${firstName},\n\ndein Zugang zur Harbor Global Partner Academy wurde freigeschaltet.\nBenutzername: ${email}\nJetzt einloggen: ${academyUrl}\nPasswort zurücksetzen: ${resetUrl}\nSupport WhatsApp: ${SUPPORT_WHATSAPP_URL}\nSupport Telegram: ${SUPPORT_TELEGRAM_URL}`,
  };
}

function passwordResetEmail(partner, resetUrl) {
  const firstName = partner.firstname || partner.firstName || 'Partner';
  const body = `
    <p>Hallo ${escapeHtml(firstName)},</p>
    <p>du hast das Zurücksetzen deines Passworts für die Harbor Global Partner Academy angefordert.</p>
    <p>Der Link ist aus Sicherheitsgründen nur zeitlich begrenzt gültig.</p>
    <p>Falls du diese Anfrage nicht gestellt hast, kannst du diese E-Mail ignorieren.</p>
  `;

  return {
    subject: 'Passwort für die Harbor Global Partner Academy zurücksetzen',
    html: emailShell({
      title: 'Passwort zurücksetzen',
      preview: 'Nutze den sicheren Link, um ein neues Passwort zu setzen.',
      body,
      buttons: [{ label: 'Passwort zurücksetzen', href: resetUrl }],
    }),
    text: `Hallo ${firstName},\n\ndu hast das Zurücksetzen deines Passworts angefordert.\nDer Link ist zeitlich begrenzt gültig.\n\nPasswort zurücksetzen: ${resetUrl}`,
  };
}

function passwordResetAdminNoticeEmail(partner, requestedAt) {
  const name = `${partner.firstname || partner.firstName || ''} ${partner.lastname || partner.lastName || ''}`.trim() || 'Partner';
  const email = partner.email || '';
  const body = `
    <p>Eine Passwort-Reset-Anfrage wurde in der Harbor Global Partner Academy gestellt.</p>
    <p><strong>Partner:</strong> ${escapeHtml(name)}</p>
    <p><strong>E-Mail:</strong> ${escapeHtml(email)}</p>
    <p><strong>Zeitpunkt:</strong> ${escapeHtml(requestedAt)}</p>
  `;

  return {
    subject: 'Passwort-Reset-Anfrage in der Harbor Global Partner Academy',
    html: emailShell({
      title: 'Passwort-Reset-Anfrage',
      preview: 'Ein Partner hat einen Passwort-Reset angefordert.',
      body,
      buttons: [{ label: 'Admin-Dashboard öffnen', href: `${getAcademyBaseUrl()}/?admin=1` }],
    }),
    text: `Passwort-Reset-Anfrage\n\nPartner: ${name}\nE-Mail: ${email}\nZeitpunkt: ${requestedAt}\nAdmin-Dashboard: ${getAcademyBaseUrl()}/?admin=1`,
  };
}

function partnerReminderEmail(partner, adminMessage = '') {
  const firstName = partner.firstname || partner.firstName || 'Partner';
  const status = partner.status || 'pending';
  const academyUrl = status === 'approved' ? `${getAcademyBaseUrl()}/?login=1` : getAcademyBaseUrl();
  const statusText = status === 'approved'
    ? 'dein Zugang ist freigeschaltet. Du kannst dich einloggen und die Academy-Inhalte nutzen.'
    : 'deine Registrierung ist eingegangen. Status: Warte auf Freigabe durch Leonid Curos.';
  const body = `
    <p>Hallo ${escapeHtml(firstName)},</p>
    <p>dies ist eine kurze Erinnerung der Harbor Global Partner Academy.</p>
    <p>${escapeHtml(statusText)}</p>
    ${adminMessage ? `<p><strong>Hinweis vom Admin:</strong><br>${escapeHtml(adminMessage)}</p>` : ''}
  `;
  const footer = `
    Support: <a href="${SUPPORT_WHATSAPP_URL}" style="color:#f6c84f;">WhatsApp</a> oder
    <a href="${SUPPORT_TELEGRAM_URL}" style="color:#f6c84f;">Telegram</a>.
  `;

  return {
    subject: 'Erinnerung: Harbor Global Partner Academy',
    html: emailShell({
      title: 'Academy Erinnerung',
      preview: 'Kurze Erinnerung zur Harbor Global Partner Academy.',
      body,
      buttons: [{ label: status === 'approved' ? 'Jetzt einloggen' : 'Zur Academy', href: academyUrl }],
      footer,
    }),
    text: `Hallo ${firstName},\n\ndies ist eine kurze Erinnerung der Harbor Global Partner Academy.\n${statusText}\n${adminMessage ? `\nHinweis vom Admin: ${adminMessage}\n` : ''}\nLink: ${academyUrl}\nSupport WhatsApp: ${SUPPORT_WHATSAPP_URL}\nSupport Telegram: ${SUPPORT_TELEGRAM_URL}`,
  };
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

function requireValidInstagramProfile(value) {
  if (!String(value || '').trim()) {
    return '';
  }

  const normalized = normalizeInstagramProfile(value);

  if (!normalized) {
    throw Object.assign(new Error('Instagram-Profil ist ungueltig. Bitte Instagram-URL oder @Benutzername verwenden.'), { statusCode: 400 });
  }

  return normalized;
}

function detectTestData(record) {
  const haystack = [
    record?.firstname,
    record?.lastname,
    record?.email,
    record?.discount_code,
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

function normalizeCareerProfile(record, meta) {
  const career = meta.careerProfile || {};
  const calculated = calculateAquaCareer(career.points ?? career.currentPoints ?? 0);
  const history = Array.isArray(career.history) ? career.history.filter(Boolean).slice(0, 50) : [];
  const levelEvents = Array.isArray(career.levelEvents) ? career.levelEvents.filter(Boolean).slice(0, 30) : [];
  const profileImageUrl = getProfileImageAccessUrl(career.profileImage) || career.profileImageUrl || '';

  return {
    profileImageUrl,
    points: calculated.points,
    level: calculated.level,
    levelMin: calculated.levelMin,
    levelMax: calculated.levelMax,
    nextLevel: calculated.nextLevel,
    nextLevelPoints: calculated.nextLevelPoints,
    pointsToNextLevel: calculated.pointsToNextLevel,
    levelProgress: calculated.levelProgress,
    lastUpdatedAt: career.lastUpdatedAt || '',
    updatedBy: career.updatedBy || '',
    teamName: career.teamName || '',
    backofficeScreenshot: career.backofficeScreenshot || null,
    screenshotEvaluation: career.screenshotEvaluation || null,
    history,
    levelEvents,
  };
}

function normalizeTeamGrowthProfile(record, meta) {
  const teamProfile = meta.teamGrowthProfile || {};
  const history = Array.isArray(teamProfile.history) ? teamProfile.history.filter(Boolean).slice(0, 50) : [];
  const latestHistory = history[0] || {};
  const currentCount = teamProfile.currentCount ?? teamProfile.partnerCount ?? 0;
  const previousCount = teamProfile.previousCount ?? latestHistory.previousCount ?? Math.max(0, toPartnerCount(currentCount) - toPartnerCount(teamProfile.newSinceLastUpdate));
  const calculated = calculateTeamGrowth({
    currentCount,
    previousCount,
    targetCount: teamProfile.targetCount ?? teamProfile.nextTarget ?? 10,
    longTermTargetCount: teamProfile.longTermTargetCount ?? teamProfile.longTermTarget ?? 100,
  });

  return {
    currentCount: calculated.currentCount,
    previousCount: calculated.previousCount,
    targetCount: calculated.targetCount,
    longTermTargetCount: calculated.longTermTargetCount,
    newSinceLastUpdate: teamProfile.newSinceLastUpdate ?? calculated.newSinceLastUpdate,
    growthPercent: teamProfile.growthPercent ?? calculated.growthPercent,
    targetProgress: teamProfile.targetProgress ?? calculated.targetProgress,
    longTermProgress: teamProfile.longTermProgress ?? calculated.longTermProgress,
    lastUpdatedAt: teamProfile.lastUpdatedAt || '',
    updatedBy: teamProfile.updatedBy || '',
    screenshot: teamProfile.screenshot || null,
    screenshotEvaluation: teamProfile.screenshotEvaluation || null,
    history,
  };
}

function buildTeamGrowthProfileUpdate({ meta, currentTeamGrowth, currentCountInput, targetCountInput, longTermTargetCountInput, screenshot, session, source = 'manual', detectedFromScreenshot = false }) {
  const now = new Date().toISOString();
  const currentRaw = meta.teamGrowthProfile || {};
  const existingHistory = Array.isArray(currentRaw.history) ? currentRaw.history.filter(Boolean) : [];
  const previousCount = currentTeamGrowth.currentCount;
  const calculated = calculateTeamGrowth({
    currentCount: currentCountInput,
    previousCount,
    targetCount: targetCountInput ?? currentTeamGrowth.targetCount,
    longTermTargetCount: longTermTargetCountInput ?? currentTeamGrowth.longTermTargetCount,
  });
  const updatedBy = session.email || 'Harbor Admin';
  const screenshotName = screenshot?.name || currentTeamGrowth.screenshot?.name || '';
  const screenshotUploadedAt = screenshot?.uploadedAt || currentTeamGrowth.screenshot?.uploadedAt || '';
  const historyEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    updatedAt: now,
    updatedBy,
    source,
    currentCount: calculated.currentCount,
    previousCount,
    targetCount: calculated.targetCount,
    longTermTargetCount: calculated.longTermTargetCount,
    newSinceLastUpdate: calculated.newSinceLastUpdate,
    growthPercent: calculated.growthPercent,
    targetProgress: calculated.targetProgress,
    longTermProgress: calculated.longTermProgress,
    screenshotName,
    screenshotUploadedAt,
    detectedFromScreenshot,
  };

  return {
    ...currentRaw,
    currentCount: calculated.currentCount,
    previousCount,
    targetCount: calculated.targetCount,
    longTermTargetCount: calculated.longTermTargetCount,
    newSinceLastUpdate: calculated.newSinceLastUpdate,
    growthPercent: calculated.growthPercent,
    targetProgress: calculated.targetProgress,
    longTermProgress: calculated.longTermProgress,
    lastUpdatedAt: now,
    updatedBy,
    screenshot,
    screenshotEvaluation: {
      updatedAt: now,
      source,
      detectedFromScreenshot,
      currentCount: calculated.currentCount,
      targetCount: calculated.targetCount,
      longTermTargetCount: calculated.longTermTargetCount,
      newSinceLastUpdate: calculated.newSinceLastUpdate,
      growthPercent: calculated.growthPercent,
      targetProgress: calculated.targetProgress,
      longTermProgress: calculated.longTermProgress,
    },
    history: [historyEntry, ...existingHistory].slice(0, 50),
  };
}

function buildCareerProfileUpdate({ meta, currentCareer, pointsInput, profileImageUrl, teamName, backofficeScreenshot, session, source = 'admin-manual', detectedFromScreenshot = false }) {
  const now = new Date().toISOString();
  const previousLevel = currentCareer.level;
  const calculated = calculateAquaCareer(pointsInput);
  const currentRaw = meta.careerProfile || {};
  const existingHistory = Array.isArray(currentRaw.history) ? currentRaw.history.filter(Boolean) : [];
  const existingLevelEvents = Array.isArray(currentRaw.levelEvents) ? currentRaw.levelEvents.filter(Boolean) : [];
  const updatedBy = session.email || 'Harbor Admin';
  const screenshotName = backofficeScreenshot?.name || currentCareer.backofficeScreenshot?.name || '';
  const screenshotUploadedAt = backofficeScreenshot?.uploadedAt || currentCareer.backofficeScreenshot?.uploadedAt || '';
  const historyEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    updatedAt: now,
    updatedBy,
    source,
    points: calculated.points,
    level: calculated.level,
    nextLevel: calculated.nextLevel,
    targetPoints: calculated.nextLevelPoints,
    pointsToNextLevel: calculated.pointsToNextLevel,
    levelProgress: calculated.levelProgress,
    screenshotName,
    screenshotUploadedAt,
    detectedFromScreenshot,
  };
  const previousLevelIndex = getAquaLevelIndex(previousLevel);
  const newLevelIndex = getAquaLevelIndex(calculated.level);
  const promoted = previousLevelIndex >= 0 && newLevelIndex > previousLevelIndex;
  const levelEvents = promoted
    ? [{
        id: historyEntry.id,
        fromLevel: previousLevel,
        toLevel: calculated.level,
        fromPoints: currentCareer.points,
        toPoints: calculated.points,
        promotedAt: now,
        promotedBy: updatedBy,
      }, ...existingLevelEvents].slice(0, 30)
    : existingLevelEvents.slice(0, 30);

  return {
    ...currentRaw,
    profileImageUrl: currentRaw.profileImage?.path ? '' : profileImageUrl,
    points: calculated.points,
    level: calculated.level,
    nextLevel: calculated.nextLevel,
    nextLevelPoints: calculated.nextLevelPoints,
    pointsToNextLevel: calculated.pointsToNextLevel,
    levelProgress: calculated.levelProgress,
    lastUpdatedAt: now,
    updatedBy,
    teamName,
    backofficeScreenshot,
    screenshotEvaluation: {
      updatedAt: now,
      source,
      detectedFromScreenshot,
      points: calculated.points,
      level: calculated.level,
      nextLevel: calculated.nextLevel,
      targetPoints: calculated.nextLevelPoints,
      pointsToNextLevel: calculated.pointsToNextLevel,
      levelProgress: calculated.levelProgress,
    },
    history: [historyEntry, ...existingHistory].slice(0, 50),
    levelEvents,
  };
}

function defaultAdminCareerProfile(adminEmail) {
  const calculated = calculateAquaCareer(ADMIN_INITIAL_POINTS);
  const historyEntry = {
    id: 'admin-initial-screenshot',
    updatedAt: ADMIN_INITIAL_UPDATED_AT,
    updatedBy: adminEmail || ADMIN_PROFILE_BADGE,
    source: 'admin-screenshot',
    points: calculated.points,
    level: calculated.level,
    nextLevel: calculated.nextLevel,
    targetPoints: calculated.nextLevelPoints,
    pointsToNextLevel: calculated.pointsToNextLevel,
    levelProgress: calculated.levelProgress,
    screenshotName: 'Aqua Global Backoffice Screenshot',
    screenshotUploadedAt: ADMIN_INITIAL_UPDATED_AT,
    detectedFromScreenshot: true,
  };

  return {
    profileImageUrl: '',
    points: calculated.points,
    level: calculated.level,
    nextLevel: calculated.nextLevel,
    nextLevelPoints: calculated.nextLevelPoints,
    pointsToNextLevel: calculated.pointsToNextLevel,
    levelProgress: calculated.levelProgress,
    lastUpdatedAt: ADMIN_INITIAL_UPDATED_AT,
    updatedBy: adminEmail || ADMIN_PROFILE_BADGE,
    teamName: 'Harbor Global Academy',
    backofficeScreenshot: null,
    screenshotEvaluation: {
      updatedAt: ADMIN_INITIAL_UPDATED_AT,
      source: 'admin-screenshot',
      detectedFromScreenshot: true,
      points: calculated.points,
      level: calculated.level,
      nextLevel: calculated.nextLevel,
      targetPoints: calculated.nextLevelPoints,
      pointsToNextLevel: calculated.pointsToNextLevel,
      levelProgress: calculated.levelProgress,
    },
    history: [historyEntry],
    levelEvents: [],
  };
}

function defaultAdminTeamGrowthProfile(adminEmail) {
  const calculated = calculateTeamGrowth({
    currentCount: ADMIN_INITIAL_TEAM_COUNT,
    previousCount: ADMIN_INITIAL_TEAM_COUNT,
    targetCount: ADMIN_NEXT_TEAM_TARGET,
    longTermTargetCount: ADMIN_LONG_TERM_TEAM_TARGET,
  });
  const historyEntry = {
    id: 'admin-initial-team-growth',
    updatedAt: ADMIN_INITIAL_UPDATED_AT,
    updatedBy: adminEmail || ADMIN_PROFILE_BADGE,
    source: 'admin-initial',
    currentCount: calculated.currentCount,
    previousCount: calculated.previousCount,
    targetCount: calculated.targetCount,
    longTermTargetCount: calculated.longTermTargetCount,
    newSinceLastUpdate: calculated.newSinceLastUpdate,
    growthPercent: calculated.growthPercent,
    targetProgress: calculated.targetProgress,
    longTermProgress: calculated.longTermProgress,
    screenshotName: 'Aqua Global Team Backoffice',
    screenshotUploadedAt: ADMIN_INITIAL_UPDATED_AT,
    detectedFromScreenshot: true,
  };

  return {
    currentCount: calculated.currentCount,
    previousCount: calculated.previousCount,
    targetCount: calculated.targetCount,
    longTermTargetCount: calculated.longTermTargetCount,
    newSinceLastUpdate: calculated.newSinceLastUpdate,
    growthPercent: calculated.growthPercent,
    targetProgress: calculated.targetProgress,
    longTermProgress: calculated.longTermProgress,
    lastUpdatedAt: ADMIN_INITIAL_UPDATED_AT,
    updatedBy: adminEmail || ADMIN_PROFILE_BADGE,
    screenshot: null,
    screenshotEvaluation: {
      updatedAt: ADMIN_INITIAL_UPDATED_AT,
      source: 'admin-initial',
      detectedFromScreenshot: true,
      currentCount: calculated.currentCount,
      targetCount: calculated.targetCount,
      longTermTargetCount: calculated.longTermTargetCount,
      newSinceLastUpdate: calculated.newSinceLastUpdate,
      growthPercent: calculated.growthPercent,
      targetProgress: calculated.targetProgress,
      longTermProgress: calculated.longTermProgress,
    },
    history: [historyEntry],
  };
}

function isLegacyAdminTeamSeed(teamGrowthProfile) {
  if (!teamGrowthProfile) {
    return false;
  }

  const history = Array.isArray(teamGrowthProfile.history) ? teamGrowthProfile.history : [];
  return toPartnerCount(teamGrowthProfile.currentCount ?? teamGrowthProfile.partnerCount) === 96
    && (
      teamGrowthProfile.screenshotEvaluation?.source === 'admin-initial'
      || history.some((entry) => entry?.id === 'admin-initial-team-growth' || entry?.source === 'admin-initial')
    );
}

function adminProfileMeta(meta = {}, adminEmail = '') {
  const teamGrowthProfile = isLegacyAdminTeamSeed(meta.teamGrowthProfile)
    ? defaultAdminTeamGrowthProfile(adminEmail)
    : meta.teamGrowthProfile || defaultAdminTeamGrowthProfile(adminEmail);

  return {
    ...meta,
    role: 'admin',
    adminProfile: true,
    adminBadge: ADMIN_PROFILE_BADGE,
    language: normalizeLanguageLabel(meta.preferred_language || meta.language || 'Deutsch'),
    preferred_language: normalizeLanguageCode(meta.preferred_language || meta.language || 'Deutsch'),
    careerProfile: meta.careerProfile || defaultAdminCareerProfile(adminEmail),
    teamGrowthProfile,
    schemaVersion: Math.max(Number(meta.schemaVersion || 1), 2),
  };
}

function adminFallbackRecord(adminEmail) {
  const meta = adminProfileMeta({}, adminEmail);
  return {
    id: ADMIN_PROFILE_SESSION_ID,
    firstname: ADMIN_PROFILE_FIRST_NAME,
    lastname: ADMIN_PROFILE_LAST_NAME,
    email: adminEmail,
    phone: ADMIN_PROFILE_PHONE,
    city: ADMIN_PROFILE_CITY,
    discount_code: DEFAULT_DISCOUNT_CODE,
    status: 'approved',
    avatar_url: JSON.stringify(meta),
    created_at: ADMIN_INITIAL_UPDATED_AT,
  };
}

function normalizeAdminPartnerRecord(record, adminEmail) {
  const meta = adminProfileMeta(parseMeta(record), adminEmail);
  const mergedRecord = {
    ...record,
    firstname: ADMIN_PROFILE_FIRST_NAME,
    lastname: ADMIN_PROFILE_LAST_NAME,
    email: adminEmail,
    phone: ADMIN_PROFILE_PHONE,
    city: ADMIN_PROFILE_CITY,
    discount_code: DEFAULT_DISCOUNT_CODE,
    status: 'approved',
    avatar_url: JSON.stringify(meta),
  };

  return normalizePartner(mergedRecord, { admin: true, includeCareerEvidence: true });
}

function normalizePartner(record, { admin = false, includeCareerEvidence = false } = {}) {
  const meta = parseMeta(record);
  const careerProfile = normalizeCareerProfile(record, meta);
  const teamGrowthProfile = normalizeTeamGrowthProfile(record, meta);
  const academyProgress = normalizeAcademyProgress(meta.academyProgress);
  const detectedTestData = detectTestData(record);
  const testData = Boolean(meta.testData?.isTestData || detectedTestData.isTestData);
  const testDataReasons = Array.from(new Set([...(meta.testData?.reasons || []), ...detectedTestData.reasons]));
  const registrationLog = {
    source: meta.registrationLog?.source || REGISTRATION_SOURCE,
    sentAt: meta.registrationLog?.sentAt || record.created_at || '',
    supabaseSaved: meta.registrationLog?.supabaseSaved ?? true,
    supabaseSavedAt: meta.registrationLog?.supabaseSavedAt || record.created_at || '',
  };
  const approvalLog = {
    approved: meta.approvalLog?.approved || record.status === 'approved',
    approvedAt: meta.approvalLog?.approvedAt || '',
    approvedBy: meta.approvalLog?.approvedBy || '',
  };
  const legalConsent = {
    acceptedTerms: Boolean(record.accepted_terms ?? meta.legalConsent?.acceptedTerms),
    acceptedTermsAt: record.accepted_terms_at || meta.legalConsent?.acceptedTermsAt || '',
    acceptedPrivacy: Boolean(record.accepted_privacy ?? meta.legalConsent?.acceptedPrivacy),
    acceptedPrivacyAt: record.accepted_privacy_at || meta.legalConsent?.acceptedPrivacyAt || '',
    trainingContentConsent: Boolean(record.training_content_consent ?? meta.legalConsent?.trainingContentConsent),
    trainingContentConsentAt: record.training_content_consent_at || meta.legalConsent?.trainingContentConsentAt || '',
  };
  const emailLog = {
    registrationEmailSent: Boolean(meta.emailLog?.registrationEmail?.sent),
    registrationEmailSentAt: meta.emailLog?.registrationEmail?.sentAt || '',
    registrationEmailError: meta.emailLog?.registrationEmail?.error || '',
    approvalEmailSent: Boolean(meta.emailLog?.approvalEmail?.sent),
    approvalEmailSentAt: meta.emailLog?.approvalEmail?.sentAt || '',
    approvalEmailError: meta.emailLog?.approvalEmail?.error || '',
    passwordResetRequested: Boolean(meta.passwordReset?.requested),
    passwordResetEmailSent: Boolean(meta.passwordReset?.email?.sent),
    passwordResetEmailSentAt: meta.passwordReset?.email?.sentAt || '',
    passwordResetEmailError: meta.passwordReset?.email?.error || '',
    passwordResetAdminNotified: Boolean(meta.passwordReset?.adminEmail?.sent),
    passwordResetAdminNotifiedAt: meta.passwordReset?.adminEmail?.sentAt || '',
    passwordResetAdminNotificationError: meta.passwordReset?.adminEmail?.error || '',
    lastPasswordResetRequestedAt: meta.passwordReset?.lastRequestedAt || meta.passwordReset?.requestedAt || '',
    reminderEmailSent: Boolean(meta.emailLog?.partnerReminder?.sent),
    reminderEmailSentAt: meta.emailLog?.partnerReminder?.sentAt || '',
    reminderEmailError: meta.emailLog?.partnerReminder?.error || '',
    reminderEmailSentBy: meta.emailLog?.partnerReminder?.sentBy || '',
  };
  const notificationPrefs = {
    emailUpdates: meta.notificationPrefs?.emailUpdates !== false,
    whatsappUpdates: Boolean(meta.notificationPrefs?.whatsappUpdates),
    language: normalizeLanguageLabel(meta.notificationPrefs?.preferred_language || meta.notificationPrefs?.language || meta.preferred_language || meta.language || 'Deutsch'),
    preferred_language: normalizeLanguageCode(meta.notificationPrefs?.preferred_language || meta.notificationPrefs?.language || meta.preferred_language || meta.language || 'Deutsch'),
  };
  const socialProfile = meta.socialProfile || {};
  const instagramProfile = normalizeInstagramProfile(socialProfile.instagram || meta.instagramProfile || '');

  return {
    id: String(record.id || record.email),
    firstName: record.firstname || '',
    lastName: record.lastname || '',
    email: record.email || '',
    whatsapp: record.phone || '',
    city: record.city || '',
    discountCode: record.discount_code || '',
    status: record.status || 'pending',
    role: meta.role || 'partner',
    adminBadge: meta.adminBadge || (meta.adminProfile ? ADMIN_PROFILE_BADGE : ''),
    isFounderAdmin: Boolean(meta.adminProfile),
    language: normalizeLanguageLabel(meta.preferred_language || meta.language || 'Deutsch'),
    preferredLanguage: normalizeLanguageCode(meta.preferred_language || meta.language || 'Deutsch'),
    profileImageUrl: careerProfile.profileImageUrl,
    instagramProfile,
    instagramVisible: socialProfile.instagramVisible !== false,
    aquaPoints: careerProfile.points,
    aquaLevel: careerProfile.level,
    aquaLevelMin: careerProfile.levelMin,
    aquaLevelMax: careerProfile.levelMax,
    aquaNextLevel: careerProfile.nextLevel,
    aquaNextLevelPoints: careerProfile.nextLevelPoints,
    aquaPointsToNextLevel: careerProfile.pointsToNextLevel,
    aquaLevelProgress: careerProfile.levelProgress,
    aquaLastUpdatedAt: careerProfile.lastUpdatedAt,
    aquaUpdatedBy: careerProfile.updatedBy,
    teamName: careerProfile.teamName,
    teamPartnerCount: teamGrowthProfile.currentCount,
    teamTargetPartnerCount: teamGrowthProfile.targetCount,
    teamLongTermTargetPartnerCount: teamGrowthProfile.longTermTargetCount,
    teamNewPartnersSinceLastUpdate: teamGrowthProfile.newSinceLastUpdate,
    teamGrowthPercent: teamGrowthProfile.growthPercent,
    teamProgress: teamGrowthProfile.targetProgress,
    teamLongTermProgress: teamGrowthProfile.longTermProgress,
    teamLastUpdatedAt: teamGrowthProfile.lastUpdatedAt,
    teamUpdatedBy: teamGrowthProfile.updatedBy,
    teamScreenshot: admin || includeCareerEvidence ? teamGrowthProfile.screenshot : undefined,
    teamScreenshotEvaluation: admin || includeCareerEvidence ? teamGrowthProfile.screenshotEvaluation : undefined,
    teamGrowthHistory: admin || includeCareerEvidence ? teamGrowthProfile.history : undefined,
    academyProgress,
    backofficeScreenshot: admin || includeCareerEvidence ? careerProfile.backofficeScreenshot : undefined,
    backofficeScreenshotEvaluation: admin || includeCareerEvidence ? careerProfile.screenshotEvaluation : undefined,
    careerHistory: admin || includeCareerEvidence ? careerProfile.history : undefined,
    levelEvents: admin || includeCareerEvidence ? careerProfile.levelEvents : undefined,
    notificationPrefs,
    referrerCode: meta.referrerCode || '',
    notes: admin ? meta.notes || '' : '',
    assignedTraining: admin ? meta.assignedTraining || '' : '',
    source: registrationLog.source,
    registrationLog: admin ? registrationLog : undefined,
    approvalLog: admin ? approvalLog : undefined,
    emailLog: admin ? emailLog : undefined,
    legalConsent: admin ? legalConsent : undefined,
    testData: admin ? testData : undefined,
    testDataReasons: admin ? testDataReasons : undefined,
    registrationType: admin ? (testData ? 'Testdaten' : 'Echte Registrierung') : undefined,
    createdAt: record.created_at || '',
  };
}

function partnerPayload(input, meta) {
  const payload = {
    firstname: input.firstName,
    lastname: input.lastName,
    email: input.email,
    phone: input.whatsapp,
    city: input.city,
    discount_code: input.discountCode,
    status: input.status || 'pending',
    avatar_url: JSON.stringify(meta),
  };

  if (input.id) {
    payload.id = input.id;
  }

  if (input.legalConsent) {
    payload.accepted_terms = input.legalConsent.acceptedTerms;
    payload.accepted_terms_at = input.legalConsent.acceptedTermsAt;
    payload.accepted_privacy = input.legalConsent.acceptedPrivacy;
    payload.accepted_privacy_at = input.legalConsent.acceptedPrivacyAt;
    payload.training_content_consent = input.legalConsent.trainingContentConsent;
    payload.training_content_consent_at = input.legalConsent.trainingContentConsentAt;
  }

  return payload;
}

function makeSession(partner) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  return signToken({ id: partner.id, email: partner.email, role: partner.role, exp });
}

function adminFromEnv(username, password) {
  const adminEmail = readEnv('HARBOR_ADMIN_EMAIL');
  const adminPassword = readEnv('HARBOR_ADMIN_PASSWORD');

  if (!adminEmail || !adminPassword) {
    return null;
  }

  if (username.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
    return null;
  }

  return normalizeAdminPartnerRecord(adminFallbackRecord(adminEmail), adminEmail);
}

async function getAdminCareerRecord({ ensure = false } = {}) {
  const adminEmail = readEnv('HARBOR_ADMIN_EMAIL') || 'leonid.curos.ag@gmail.com';
  const records = await supabaseRequest(`${PARTNERS_TABLE}?email=eq.${encodeURIComponent(adminEmail.toLowerCase())}&select=*&limit=1`, {}, { requireService: true });
  const existing = records[0] || null;

  if (existing) {
    const meta = adminProfileMeta(parseMeta(existing), adminEmail);
    const needsPatch = existing.firstname !== ADMIN_PROFILE_FIRST_NAME
      || existing.lastname !== ADMIN_PROFILE_LAST_NAME
      || existing.phone !== ADMIN_PROFILE_PHONE
      || existing.city !== ADMIN_PROFILE_CITY
      || existing.discount_code !== DEFAULT_DISCOUNT_CODE
      || existing.status !== 'approved'
      || existing.avatar_url !== JSON.stringify(meta);

    if (!needsPatch) {
      return existing;
    }

    const patched = await supabaseRequest(`${PARTNERS_TABLE}?id=eq.${encodeURIComponent(existing.id)}`, {
      method: 'PATCH',
      body: {
        firstname: ADMIN_PROFILE_FIRST_NAME,
        lastname: ADMIN_PROFILE_LAST_NAME,
        phone: ADMIN_PROFILE_PHONE,
        city: ADMIN_PROFILE_CITY,
        discount_code: DEFAULT_DISCOUNT_CODE,
        status: 'approved',
        avatar_url: JSON.stringify(meta),
      },
    }, { requireService: true });

    return patched[0] || { ...existing, avatar_url: JSON.stringify(meta), status: 'approved' };
  }

  if (!ensure) {
    return adminFallbackRecord(adminEmail);
  }

  const meta = adminProfileMeta({}, adminEmail);
  const payload = partnerPayload({
    firstName: ADMIN_PROFILE_FIRST_NAME,
    lastName: ADMIN_PROFILE_LAST_NAME,
    email: adminEmail.toLowerCase(),
    whatsapp: ADMIN_PROFILE_PHONE,
    city: ADMIN_PROFILE_CITY,
    discountCode: DEFAULT_DISCOUNT_CODE,
    status: 'approved',
  }, meta);
  const created = await supabaseRequest(PARTNERS_TABLE, { method: 'POST', body: payload }, { requireService: true });

  return created[0] || { ...payload, id: ADMIN_PROFILE_SESSION_ID };
}

async function getAdminCareerPartner({ ensure = false } = {}) {
  const adminEmail = readEnv('HARBOR_ADMIN_EMAIL') || 'leonid.curos.ag@gmail.com';
  const record = await getAdminCareerRecord({ ensure });
  return normalizeAdminPartnerRecord(record, adminEmail);
}

function isMissingLegalColumnError(error) {
  const haystack = [
    error?.message,
    error?.details?.message,
    error?.details?.details,
    error?.details?.hint,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return [
    'accepted_terms',
    'accepted_terms_at',
    'accepted_privacy',
    'accepted_privacy_at',
    'training_content_consent',
    'training_content_consent_at',
  ].some((column) => haystack.includes(column));
}

async function getPartnerById(id, { requireService = false } = {}) {
  const records = await supabaseRequest(`${PARTNERS_TABLE}?id=eq.${encodeURIComponent(id)}&select=*&limit=1`, {}, { requireService });
  return records[0] || null;
}

async function sendRegistrationEmailAndPersist(record) {
  const meta = parseMeta(record);
  const template = registrationReceivedEmail(record);
  const sentAt = new Date().toISOString();
  const result = await sendEmail({
    to: record.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    idempotencyKey: `harbor-registration-${record.id || record.email}`,
  });
  const updatedMeta = {
    ...meta,
    emailLog: {
      ...(meta.emailLog || {}),
      registrationEmail: emailLogEntry(result, sentAt),
    },
  };

  return patchPartnerMeta(record, updatedMeta);
}

async function sendApprovalEmailAndPersist(record, approvalMeta) {
  const template = approvalEmail(record);
  const sentAt = new Date().toISOString();
  const result = await sendEmail({
    to: record.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    idempotencyKey: `harbor-approval-${record.id || record.email}`,
  });
  const updatedMeta = {
    ...approvalMeta,
    emailLog: {
      ...(approvalMeta.emailLog || {}),
      approvalEmail: emailLogEntry(result, sentAt),
    },
  };

  return patchPartnerMeta(record, updatedMeta, { requireService: true });
}

async function sendPartnerReminderEmailAndPersist(record, session, adminMessage = '') {
  const meta = parseMeta(record);
  const template = partnerReminderEmail(record, adminMessage);
  const sentAt = new Date().toISOString();
  const result = await sendEmail({
    to: record.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    idempotencyKey: `harbor-reminder-${record.id || record.email}-${sentAt.slice(0, 16)}`,
  });
  const updatedMeta = {
    ...meta,
    emailLog: {
      ...(meta.emailLog || {}),
      partnerReminder: {
        ...emailLogEntry(result, sentAt),
        sentBy: session.email || 'Harbor Admin',
      },
    },
  };

  return patchPartnerMeta(record, updatedMeta, { requireService: true });
}

async function requireSession(request, { admin = false } = {}) {
  const session = verifyToken(getBearerToken(request));

  if (admin && session.role !== 'admin') {
    throw Object.assign(new Error('Zugriff verweigert.'), { statusCode: 403 });
  }

  return session;
}

async function registerPartner(body) {
  const required = ['firstName', 'lastName', 'email', 'whatsapp', 'discountCode', 'city', 'password'];
  const missingField = required.some((field) => !String(body[field] || '').trim());

  if (missingField) {
    return json({ message: 'Bitte alle Pflichtfelder ausfuellen.' }, 400);
  }

  const email = String(body.email).trim().toLowerCase();
  const discountCode = String(body.discountCode || '').trim().toUpperCase();
  const password = String(body.password || '');
  const acceptedTerms = body.acceptedTerms === true;
  const acceptedPrivacy = body.acceptedPrivacy === true;
  const trainingContentConsent = body.trainingContentConsent === true;
  const languageCode = normalizeLanguageCode(body.language || body.notificationLanguage || 'Deutsch');
  const languageLabel = normalizeLanguageLabel(languageCode);
  const notificationLanguageCode = normalizeLanguageCode(body.notificationLanguage || body.language || languageCode);
  const notificationLanguage = normalizeLanguageLabel(notificationLanguageCode);
  const partnerId = crypto.randomUUID();
  let profileImage;
  let storedProfileImage;

  if (!acceptedTerms || !acceptedPrivacy) {
    return json({ message: 'Bitte akzeptiere die Datenschutzerklärung und Nutzungsbedingungen, um dich zu registrieren.' }, 400);
  }

  if (!trainingContentConsent) {
    return json({ message: 'Bitte bestätige die Einwilligung für Schulungsinhalte, um dich zu registrieren.' }, 400);
  }

  if (!isValidDiscountCode(discountCode)) {
    return json({ message: 'Rabattcode ist ungueltig. Bitte 3 bis 24 Zeichen, Buchstaben, Zahlen, Bindestrich oder Unterstrich verwenden.' }, 400);
  }

  if (password.length < 8) {
    return json({ message: 'Das Passwort muss mindestens 8 Zeichen haben.' }, 400);
  }

  try {
    profileImage = validateProfileImagePayload(body.profileImage);
  } catch (error) {
    return json({ message: error.message || 'Profilbild ist ungueltig.' }, error.statusCode || 400);
  }

  try {
    storedProfileImage = await uploadProfileImage(profileImage, partnerId);
  } catch (error) {
    return json({ message: error.message || 'Profilbild konnte nicht gespeichert werden.' }, error.statusCode || 503);
  }

  const { salt, hash } = createPasswordHash(password);
  const submittedAt = new Date().toISOString();
  const legalConsent = {
    acceptedTerms: true,
    acceptedTermsAt: submittedAt,
    acceptedPrivacy: true,
    acceptedPrivacyAt: submittedAt,
    trainingContentConsent: true,
    trainingContentConsentAt: submittedAt,
  };
  const meta = {
    role: 'partner',
    language: languageLabel,
    preferred_language: languageCode,
    referrerCode: String(body.referrerCode || ''),
    notificationPrefs: {
      emailUpdates: body.emailUpdates !== false,
      whatsappUpdates: body.whatsappUpdates === true,
      language: notificationLanguage,
      preferred_language: notificationLanguageCode,
    },
    passwordSalt: salt,
    passwordHash: hash,
    legalConsent,
    careerProfile: {
      profileImageUrl: '',
      profileImage: storedProfileImage,
      points: 0,
      level: 'Starterstufe',
      teamName: '',
      history: [],
      levelEvents: [],
    },
    registrationLog: {
      source: REGISTRATION_SOURCE,
      sentAt: submittedAt,
      supabaseSaved: true,
      supabaseSavedAt: submittedAt,
    },
    schemaVersion: 1,
  };
  const payload = partnerPayload({
    id: partnerId,
    firstName: String(body.firstName).trim(),
    lastName: String(body.lastName).trim(),
    email,
    whatsapp: String(body.whatsapp).trim(),
    city: String(body.city).trim(),
    discountCode,
    status: 'pending',
    legalConsent,
  }, meta);

  try {
    const records = await supabaseRequest(PARTNERS_TABLE, { method: 'POST', body: payload });
    const savedRecord = records[0] || payload;
    const recordWithEmailLog = await sendRegistrationEmailAndPersist(savedRecord);
    return json({ partner: normalizePartner(recordWithEmailLog || savedRecord) }, 201);
  } catch (error) {
    if (isMissingLegalColumnError(error)) {
      const fallbackPayload = { ...payload };
      delete fallbackPayload.accepted_terms;
      delete fallbackPayload.accepted_terms_at;
      delete fallbackPayload.accepted_privacy;
      delete fallbackPayload.accepted_privacy_at;
      delete fallbackPayload.training_content_consent;
      delete fallbackPayload.training_content_consent_at;

      try {
        const records = await supabaseRequest(PARTNERS_TABLE, { method: 'POST', body: fallbackPayload });
        const savedRecord = records[0] || fallbackPayload;
        const recordWithEmailLog = await sendRegistrationEmailAndPersist(savedRecord);
        return json({ partner: normalizePartner(recordWithEmailLog || savedRecord) }, 201);
      } catch (fallbackError) {
        await deleteProfileImage(storedProfileImage, partnerId).catch(() => {});

        if (fallbackError.statusCode === 409) {
          return json({ message: 'Diese E-Mail ist bereits registriert.' }, 409);
        }

        throw fallbackError;
      }
    }

    await deleteProfileImage(storedProfileImage, partnerId).catch(() => {});

    if (error.statusCode === 409) {
      return json({ message: 'Diese E-Mail ist bereits registriert.' }, 409);
    }

    throw error;
  }
}

async function login(body) {
  const username = String(body.username || '').trim();
  const emailIdentifier = username.toLowerCase();
  const discountCodeIdentifier = username.toUpperCase();
  const password = String(body.password || '');

  if (!username || !password) {
    return json({ message: 'Bitte Benutzername und Passwort eingeben.' }, 400);
  }

  const envAdmin = adminFromEnv(username, password);

  if (envAdmin) {
    const adminPartner = await getAdminCareerPartner({ ensure: true }).catch(() => envAdmin);
    return json({ partner: adminPartner, token: makeSession(adminPartner) });
  }

  const emailRecords = await supabaseRequest(`${PARTNERS_TABLE}?email=eq.${encodeURIComponent(emailIdentifier)}&select=*`);
  const codeRecords = await supabaseRequest(`${PARTNERS_TABLE}?discount_code=eq.${encodeURIComponent(discountCodeIdentifier)}&select=*`);
  const candidates = [...emailRecords, ...codeRecords].filter((record, index, records) => records.findIndex((item) => item.id === record.id) === index);

  if (candidates.length === 0) {
    return json({ message: 'Partner nicht gefunden' }, 404);
  }

  const record = candidates.find((candidate) => verifyPassword(password, parseMeta(candidate)));

  if (!record) {
    return json({ message: 'Passwort ist falsch' }, 401);
  }

  const partner = normalizePartner(record, { includeCareerEvidence: true });

  if (partner.status === 'pending') {
    return json({ message: 'Warte auf Freigabe durch Leonid Curos' }, 403);
  }

  if (partner.status !== 'approved') {
    return json({ message: 'Dein Konto ist nicht freigegeben' }, 403);
  }

  return json({ partner, token: makeSession(partner) });
}

async function sessionInfo(request) {
  const session = verifyToken(getBearerToken(request));

  if (session.role === 'admin') {
    const adminPartner = await getAdminCareerPartner({ ensure: true })
      .catch(() => normalizeAdminPartnerRecord(adminFallbackRecord(session.email), session.email));
    return json({ partner: adminPartner });
  }

  const record = await getPartnerById(session.id);

  if (!record) {
    return json({ message: 'Partner nicht gefunden' }, 404);
  }

  const partner = normalizePartner(record, { includeCareerEvidence: true });

  if (partner.status !== 'approved') {
    return json({ message: 'Warte auf Freigabe durch Leonid Curos' }, 403);
  }

  return json({ partner });
}

async function listPartners(request) {
  await requireSession(request, { admin: true });
  const records = await supabaseRequest(`${PARTNERS_TABLE}?select=*&order=created_at.desc`, {}, { requireService: true });
  const visibleRecords = records.filter((record) => {
    const meta = parseMeta(record);
    return record.status !== 'system' && meta.role !== 'system' && !meta.adminProfile;
  });
  const partners = visibleRecords.map((record) => {
    const normalized = normalizePartner(record, { admin: true });
    const {
      backofficeScreenshot,
      backofficeScreenshotEvaluation,
      careerHistory,
      levelEvents,
      teamScreenshot,
      teamScreenshotEvaluation,
      teamGrowthHistory,
      notes,
      registrationLog,
      approvalLog,
      legalConsent,
      testDataReasons,
      ...summary
    } = normalized;

    return summary;
  });

  return json({ partners });
}

async function getAdminPartnerDetail(request, body) {
  await requireSession(request, { admin: true });
  const id = String(body.id || '').trim();

  if (!id) {
    return json({ message: 'Partner-ID fehlt.' }, 400);
  }

  const record = await getPartnerById(id, { requireService: true });

  if (!record) {
    return json({ message: 'Partner nicht gefunden.' }, 404);
  }

  const meta = parseMeta(record);

  if (record.status === 'system' || meta.role === 'system' || meta.adminProfile) {
    return json({ message: 'Partner nicht gefunden.' }, 404);
  }

  return json({ partner: normalizePartner(record, { admin: true }) });
}

async function listAcademyRanking(request) {
  const session = await requireSession(request);

  if (session.role !== 'admin') {
    const ownRecord = await getPartnerById(session.id, { requireService: true });

    if (!ownRecord || ownRecord.status !== 'approved') {
      return json({ message: 'Warte auf Freigabe durch Leonid Curos' }, 403);
    }
  }

  const records = await supabaseRequest(`${PARTNERS_TABLE}?status=eq.approved&select=*&order=created_at.asc`, {}, { requireService: true });
  const adminPartner = await getAdminCareerPartner({ ensure: session.role === 'admin' })
    .catch(() => normalizeAdminPartnerRecord(adminFallbackRecord(session.email), session.email));
  const partnerRanking = records
    .filter((record) => {
      const meta = parseMeta(record);
      return !meta.adminProfile && meta.role !== 'system' && !meta.testData?.isTestData && !detectTestData(record).isTestData;
    })
    .map((record) => {
      const partner = normalizePartner(record);
      return {
        id: partner.id,
        status: 'approved',
        role: partner.role,
        adminBadge: partner.adminBadge,
        isFounderAdmin: partner.isFounderAdmin,
        firstName: partner.firstName,
        lastName: partner.lastName,
        city: partner.city,
        profileImageUrl: partner.profileImageUrl,
        aquaPoints: partner.aquaPoints,
        aquaLevel: partner.aquaLevel,
        aquaNextLevel: partner.aquaNextLevel,
        aquaPointsToNextLevel: partner.aquaPointsToNextLevel,
        aquaLevelProgress: partner.aquaLevelProgress,
        aquaLastUpdatedAt: partner.aquaLastUpdatedAt,
        teamName: partner.teamName,
        teamPartnerCount: partner.teamPartnerCount,
        teamTargetPartnerCount: partner.teamTargetPartnerCount,
        teamLongTermTargetPartnerCount: partner.teamLongTermTargetPartnerCount,
        teamNewPartnersSinceLastUpdate: partner.teamNewPartnersSinceLastUpdate,
        teamGrowthPercent: partner.teamGrowthPercent,
        teamProgress: partner.teamProgress,
        teamLastUpdatedAt: partner.teamLastUpdatedAt,
      };
    });
  const ranking = [
    {
      id: adminPartner.id,
      status: 'approved',
      role: 'admin',
      adminBadge: ADMIN_PROFILE_BADGE,
      isFounderAdmin: true,
      firstName: adminPartner.firstName,
      lastName: adminPartner.lastName,
      city: adminPartner.city,
      profileImageUrl: adminPartner.profileImageUrl,
      aquaPoints: adminPartner.aquaPoints,
      aquaLevel: adminPartner.aquaLevel,
      aquaNextLevel: adminPartner.aquaNextLevel,
      aquaPointsToNextLevel: adminPartner.aquaPointsToNextLevel,
      aquaLevelProgress: adminPartner.aquaLevelProgress,
      aquaLastUpdatedAt: adminPartner.aquaLastUpdatedAt,
      teamName: adminPartner.teamName,
      teamPartnerCount: adminPartner.teamPartnerCount,
      teamTargetPartnerCount: adminPartner.teamTargetPartnerCount,
      teamLongTermTargetPartnerCount: adminPartner.teamLongTermTargetPartnerCount,
      teamNewPartnersSinceLastUpdate: adminPartner.teamNewPartnersSinceLastUpdate,
      teamGrowthPercent: adminPartner.teamGrowthPercent,
      teamProgress: adminPartner.teamProgress,
      teamLastUpdatedAt: adminPartner.teamLastUpdatedAt,
    },
    ...partnerRanking,
  ]
    .sort((a, b) => b.aquaPoints - a.aquaPoints)
    .map((partner, index) => ({ ...partner, rank: index + 1 }));

  return json({ ranking, levels: AQUA_GLOBAL_LEVELS });
}

async function submitCareerScreenshot(request, body) {
  const session = await requireSession(request);
  const isAdmin = session.role === 'admin';
  const updatesOwnAdminProfile = isAdmin && (!body.id || String(body.id).trim() === ADMIN_PROFILE_SESSION_ID || String(body.id).trim() === session.id);
  const id = isAdmin && body.id && !updatesOwnAdminProfile ? String(body.id).trim() : session.id;

  if (!id) {
    return json({ message: 'Partner-ID fehlt.' }, 400);
  }

  const existing = updatesOwnAdminProfile
    ? await getAdminCareerRecord({ ensure: true })
    : await getPartnerById(id, { requireService: true });

  if (!existing) {
    return json({ message: 'Partner nicht gefunden.' }, 404);
  }

  if (!isAdmin && existing.status !== 'approved') {
    return json({ message: 'Warte auf Freigabe durch Leonid Curos' }, 403);
  }

  const meta = updatesOwnAdminProfile
    ? adminProfileMeta(parseMeta(existing), session.email)
    : parseMeta(existing);
  const currentCareer = normalizeCareerProfile(existing, meta);
  const points = body.aquaPoints !== undefined || body.detectedPoints !== undefined
    ? toPoints(body.aquaPoints ?? body.detectedPoints)
    : currentCareer.points;
  const backofficeScreenshot = body.backofficeScreenshot !== undefined
    ? body.backofficeScreenshot
    : currentCareer.backofficeScreenshot;

  if (!backofficeScreenshot) {
    return json({ message: 'Bitte lade zuerst einen Aqua Global Backoffice Screenshot hoch.' }, 400);
  }

  meta.careerProfile = buildCareerProfileUpdate({
    meta,
    currentCareer,
    pointsInput: points,
    profileImageUrl: currentCareer.profileImageUrl,
    teamName: currentCareer.teamName || (updatesOwnAdminProfile ? 'Harbor Global Academy' : ''),
    backofficeScreenshot,
    session,
    source: isAdmin
      ? backofficeScreenshot?.type === 'manual/admin-career-update' ? 'admin-manual' : 'admin-screenshot'
      : 'partner-screenshot',
    detectedFromScreenshot: Boolean(body.detectedFromScreenshot),
  });

  const records = await supabaseRequest(`${PARTNERS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: { avatar_url: JSON.stringify(meta) },
  }, { requireService: true });
  const updatedRecord = records[0] || { ...existing, avatar_url: JSON.stringify(meta) };

  return json({
    partner: updatesOwnAdminProfile
      ? normalizeAdminPartnerRecord(updatedRecord, session.email)
      : normalizePartner(updatedRecord, {
          admin: isAdmin,
          includeCareerEvidence: true,
        }),
  });
}

async function submitTeamGrowthUpdate(request, body) {
  const session = await requireSession(request);
  const isAdmin = session.role === 'admin';
  const updatesOwnAdminProfile = isAdmin && (!body.id || String(body.id).trim() === ADMIN_PROFILE_SESSION_ID || String(body.id).trim() === session.id);
  const id = isAdmin && body.id && !updatesOwnAdminProfile ? String(body.id).trim() : session.id;

  if (!id) {
    return json({ message: 'Partner-ID fehlt.' }, 400);
  }

  const existing = updatesOwnAdminProfile
    ? await getAdminCareerRecord({ ensure: true })
    : await getPartnerById(id, { requireService: true });

  if (!existing) {
    return json({ message: 'Partner nicht gefunden.' }, 404);
  }

  if (!isAdmin && existing.status !== 'approved') {
    return json({ message: 'Warte auf Freigabe durch Leonid Curos' }, 403);
  }

  const hasCurrentCount = body.teamPartnerCount !== undefined || body.currentCount !== undefined || body.partnerCount !== undefined;

  if (!hasCurrentCount) {
    return json({ message: 'Bitte gib die aktuelle Partnerzahl ein.' }, 400);
  }

  const meta = updatesOwnAdminProfile
    ? adminProfileMeta(parseMeta(existing), session.email)
    : parseMeta(existing);
  const currentTeamGrowth = normalizeTeamGrowthProfile(existing, meta);
  const screenshot = body.teamScreenshot !== undefined || body.screenshot !== undefined
    ? body.teamScreenshot ?? body.screenshot
    : currentTeamGrowth.screenshot;

  meta.teamGrowthProfile = buildTeamGrowthProfileUpdate({
    meta,
    currentTeamGrowth,
    currentCountInput: body.teamPartnerCount ?? body.currentCount ?? body.partnerCount,
    targetCountInput: body.teamTargetPartnerCount ?? body.targetCount ?? currentTeamGrowth.targetCount,
    longTermTargetCountInput: body.teamLongTermTargetPartnerCount ?? body.longTermTargetCount ?? currentTeamGrowth.longTermTargetCount,
    screenshot,
    session,
    source: isAdmin
      ? screenshot?.type === 'manual/admin-team-update' ? 'admin-manual' : 'admin-team-update'
      : screenshot ? 'partner-team-screenshot' : 'partner-manual',
    detectedFromScreenshot: Boolean(body.detectedFromScreenshot),
  });

  const records = await supabaseRequest(`${PARTNERS_TABLE}?id=eq.${encodeURIComponent(existing.id)}`, {
    method: 'PATCH',
    body: { avatar_url: JSON.stringify(meta) },
  }, { requireService: true });
  const updatedRecord = records[0] || { ...existing, avatar_url: JSON.stringify(meta) };

  return json({
    partner: updatesOwnAdminProfile
      ? normalizeAdminPartnerRecord(updatedRecord, session.email)
      : normalizePartner(updatedRecord, {
          admin: isAdmin,
          includeCareerEvidence: true,
        }),
  });
}

async function updatePartner(request, body) {
  const session = await requireSession(request, { admin: true });
  const id = String(body.id || '').trim();

  if (!id) {
    return json({ message: 'Partner-ID fehlt.' }, 400);
  }

  const existing = await getPartnerById(id, { requireService: true });

  if (!existing) {
    return json({ message: 'Partner nicht gefunden.' }, 404);
  }

  const meta = {
    ...parseMeta(existing),
    notes: String(body.notes ?? parseMeta(existing).notes ?? ''),
    assignedTraining: String(body.assignedTraining ?? parseMeta(existing).assignedTraining ?? ''),
  };
  const payload = {
    avatar_url: JSON.stringify(meta),
  };
  let becameApproved = false;

  if (body.status) {
    payload.status = String(body.status);

    if (payload.status === 'approved' && existing.status !== 'approved') {
      becameApproved = true;
      meta.approvalLog = {
        approved: true,
        approvedAt: new Date().toISOString(),
        approvedBy: session.email || 'Harbor Admin',
      };
      payload.avatar_url = JSON.stringify(meta);
    }
  }

  if (body.firstName !== undefined) {
    payload.firstname = String(body.firstName).trim();
  }

  if (body.lastName !== undefined) {
    payload.lastname = String(body.lastName).trim();
  }

  if (body.email !== undefined) {
    payload.email = String(body.email).trim().toLowerCase();
  }

  if (body.whatsapp !== undefined) {
    payload.phone = String(body.whatsapp).trim();
  }

  if (body.city !== undefined) {
    payload.city = String(body.city).trim();
  }

  if (body.discountCode !== undefined) {
    const discountCode = String(body.discountCode).trim().toUpperCase();

    if (!isValidDiscountCode(discountCode)) {
      return json({ message: 'Rabattcode ist ungueltig.' }, 400);
    }

    payload.discount_code = discountCode;
  }

  if (body.language !== undefined || body.preferred_language !== undefined) {
    const languageCode = normalizeLanguageCode(body.preferred_language || body.language);
    meta.language = normalizeLanguageLabel(languageCode);
    meta.preferred_language = languageCode;
    meta.notificationPrefs = {
      ...(meta.notificationPrefs || {}),
      language: normalizeLanguageLabel(languageCode),
      preferred_language: languageCode,
    };
    payload.avatar_url = JSON.stringify(meta);
  }

  if (body.instagramProfile !== undefined || body.instagramVisible !== undefined) {
    const normalizedInstagram = body.instagramProfile !== undefined
      ? requireValidInstagramProfile(body.instagramProfile)
      : normalizeInstagramProfile(meta.socialProfile?.instagram || meta.instagramProfile || '');

    meta.socialProfile = {
      ...(meta.socialProfile || {}),
      instagram: normalizedInstagram,
      instagramVisible: body.instagramVisible !== undefined ? Boolean(body.instagramVisible) : meta.socialProfile?.instagramVisible !== false,
      updatedAt: new Date().toISOString(),
      updatedBy: session.email || 'Harbor Admin',
    };
    payload.avatar_url = JSON.stringify(meta);
  }

  if (body.resetPartnerData === true) {
    const currentCareer = normalizeCareerProfile(existing, meta);
    const currentTeamGrowth = normalizeTeamGrowthProfile(existing, meta);

    meta.socialProfile = {
      instagram: '',
      instagramVisible: false,
      updatedAt: new Date().toISOString(),
      updatedBy: session.email || 'Harbor Admin',
      resetByAdmin: true,
    };
    meta.careerProfile = buildCareerProfileUpdate({
      meta,
      currentCareer,
      pointsInput: 0,
      profileImageUrl: currentCareer.profileImageUrl,
      teamName: '',
      backofficeScreenshot: null,
      session,
      source: 'admin-reset',
    });
    meta.teamGrowthProfile = buildTeamGrowthProfileUpdate({
      meta,
      currentTeamGrowth,
      currentCountInput: 0,
      targetCountInput: 10,
      longTermTargetCountInput: 100,
      screenshot: null,
      session,
      source: 'admin-reset',
    });
    payload.avatar_url = JSON.stringify(meta);
  }

  if (
    body.aquaPoints !== undefined
    || body.teamName !== undefined
    || body.profileImageUrl !== undefined
    || body.backofficeScreenshot !== undefined
    || body.clearBackofficeScreenshot === true
  ) {
    const currentCareer = normalizeCareerProfile(existing, meta);
    const points = body.aquaPoints !== undefined ? toPoints(body.aquaPoints) : currentCareer.points;
    const backofficeScreenshot = body.clearBackofficeScreenshot === true
      ? null
      : body.backofficeScreenshot !== undefined
        ? body.backofficeScreenshot
        : currentCareer.backofficeScreenshot;

    meta.careerProfile = buildCareerProfileUpdate({
      meta,
      currentCareer,
      pointsInput: points,
      profileImageUrl: body.profileImageUrl !== undefined ? String(body.profileImageUrl || '').trim() : currentCareer.profileImageUrl,
      teamName: body.teamName !== undefined ? String(body.teamName || '').trim() : currentCareer.teamName,
      backofficeScreenshot,
      session,
      source: body.backofficeScreenshot !== undefined ? 'admin-screenshot' : 'admin-manual',
      detectedFromScreenshot: Boolean(body.detectedFromScreenshot),
    });
    payload.avatar_url = JSON.stringify(meta);
  }

  if (
    body.teamPartnerCount !== undefined
    || body.teamTargetPartnerCount !== undefined
    || body.teamLongTermTargetPartnerCount !== undefined
  ) {
    const currentTeamGrowth = normalizeTeamGrowthProfile(existing, meta);
    meta.teamGrowthProfile = buildTeamGrowthProfileUpdate({
      meta,
      currentTeamGrowth,
      currentCountInput: body.teamPartnerCount ?? currentTeamGrowth.currentCount,
      targetCountInput: body.teamTargetPartnerCount ?? currentTeamGrowth.targetCount,
      longTermTargetCountInput: body.teamLongTermTargetPartnerCount ?? currentTeamGrowth.longTermTargetCount,
      screenshot: currentTeamGrowth.screenshot,
      session,
      source: 'admin-manual',
    });
    payload.avatar_url = JSON.stringify(meta);
  }

  const records = await supabaseRequest(`${PARTNERS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: payload,
  }, { requireService: true });
  const updatedRecord = records[0] || { ...existing, ...payload };

  if (becameApproved && !meta.emailLog?.approvalEmail?.sent) {
    const emailedRecord = await sendApprovalEmailAndPersist(updatedRecord, meta);
    return json({ partner: normalizePartner(emailedRecord || updatedRecord, { admin: true }) });
  }

  return json({ partner: normalizePartner(updatedRecord, { admin: true }) });
}

async function approvePartner(request, body) {
  const session = await requireSession(request, { admin: true });
  const id = String(body.id || '').trim();

  if (!id) {
    return json({ message: 'Partner-ID fehlt.' }, 400);
  }

  const existing = await getPartnerById(id, { requireService: true });

  if (!existing) {
    return json({ message: 'Partner nicht gefunden.' }, 404);
  }

  const meta = {
    ...parseMeta(existing),
    approvalLog: {
      approved: true,
      approvedAt: new Date().toISOString(),
      approvedBy: session.email || 'Harbor Admin',
    },
  };
  const records = await supabaseRequest(`${PARTNERS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: { status: 'approved', avatar_url: JSON.stringify(meta) },
  }, { requireService: true });

  const approved = records[0] || { ...existing, status: 'approved', avatar_url: JSON.stringify(meta) };

  if (approved.status !== 'approved') {
    return json({ message: 'Freigabe wurde nicht dauerhaft gespeichert.' }, 500);
  }

  if (!meta.emailLog?.approvalEmail?.sent) {
    const emailedRecord = await sendApprovalEmailAndPersist(approved, meta);
    return json({ partner: normalizePartner(emailedRecord || approved, { admin: true }) });
  }

  return json({ partner: normalizePartner(approved, { admin: true }) });
}

async function requestPasswordReset(body) {
  const neutralMessage = 'Falls diese E-Mail registriert ist, erhältst du eine Nachricht zum Zurücksetzen deines Passworts.';
  const email = String(body.email || '').trim().toLowerCase();

  if (!email || !email.includes('@')) {
    return json({ message: neutralMessage });
  }

  const records = await supabaseRequest(`${PARTNERS_TABLE}?email=eq.${encodeURIComponent(email)}&select=*&limit=1`, {}, { requireService: true });
  const record = records[0];

  if (!record) {
    return json({ message: neutralMessage });
  }

  const token = crypto.randomBytes(32).toString('base64url');
  const requestedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_SECONDS * 1000).toISOString();
  const resetUrl = `${getAcademyBaseUrl()}/passwort-zuruecksetzen?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
  const meta = {
    ...parseMeta(record),
    passwordReset: {
      ...(parseMeta(record).passwordReset || {}),
      requested: true,
      requestedAt,
      lastRequestedAt: requestedAt,
      tokenHash: hashResetToken(token),
      expiresAt,
      usedAt: '',
    },
  };
  const template = passwordResetEmail(record, resetUrl);
  const result = await sendEmail({
    to: record.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    idempotencyKey: `harbor-password-reset-${record.id || email}-${requestedAt.slice(0, 16)}`,
  });
  const adminTemplate = passwordResetAdminNoticeEmail(record, requestedAt);
  const adminResult = await sendEmail({
    to: getAdminNotificationEmail(),
    subject: adminTemplate.subject,
    html: adminTemplate.html,
    text: adminTemplate.text,
    idempotencyKey: `harbor-password-reset-admin-${record.id || email}-${requestedAt.slice(0, 16)}`,
  });
  const updatedMeta = {
    ...meta,
    passwordReset: {
      ...meta.passwordReset,
      email: emailLogEntry(result, requestedAt),
      adminEmail: emailLogEntry(adminResult, requestedAt),
    },
  };

  await patchPartnerMeta(record, updatedMeta, { requireService: true });

  return json({ message: neutralMessage });
}

async function confirmPasswordReset(body) {
  const email = String(body.email || '').trim().toLowerCase();
  const token = String(body.token || '').trim();
  const password = String(body.password || '');

  if (!email || !token || !password) {
    return json({ message: 'Reset-Link oder Passwort fehlt.' }, 400);
  }

  if (password.length < 8) {
    return json({ message: 'Das Passwort muss mindestens 8 Zeichen haben.' }, 400);
  }

  const records = await supabaseRequest(`${PARTNERS_TABLE}?email=eq.${encodeURIComponent(email)}&select=*&limit=1`, {}, { requireService: true });
  const record = records[0];

  if (!record) {
    return json({ message: 'Reset-Link ist ungültig oder abgelaufen.' }, 400);
  }

  const meta = parseMeta(record);
  const reset = meta.passwordReset || {};
  const expiresAt = reset.expiresAt ? new Date(reset.expiresAt).getTime() : 0;

  if (!reset.tokenHash || !verifyResetToken(token, reset.tokenHash) || !expiresAt || expiresAt < Date.now()) {
    return json({ message: 'Reset-Link ist ungültig oder abgelaufen.' }, 400);
  }

  const { salt, hash } = createPasswordHash(password);
  const completedAt = new Date().toISOString();
  const updatedMeta = {
    ...meta,
    passwordSalt: salt,
    passwordHash: hash,
    passwordReset: {
      ...reset,
      requested: false,
      tokenHash: null,
      expiresAt: '',
      usedAt: completedAt,
      completedAt,
    },
  };

  await patchPartnerMeta(record, updatedMeta, { requireService: true });

  return json({ ok: true, message: 'Passwort wurde gespeichert. Du kannst dich jetzt einloggen.' });
}

async function updateNotificationPreferences(request, body) {
  const session = await requireSession(request);

  if (session.role === 'admin') {
    const adminPartner = await getAdminCareerPartner({ ensure: true })
      .catch(() => normalizeAdminPartnerRecord(adminFallbackRecord(session.email), session.email));
    return json({ partner: adminPartner });
  }

  const record = await getPartnerById(session.id, { requireService: true });

  if (!record) {
    return json({ message: 'Partner nicht gefunden.' }, 404);
  }

  if (record.status !== 'approved') {
    return json({ message: 'Warte auf Freigabe durch Leonid Curos' }, 403);
  }

  const meta = parseMeta(record);
  const notificationLanguageCode = normalizeLanguageCode(body.notificationLanguage || body.language || meta.notificationPrefs?.preferred_language || meta.notificationPrefs?.language || meta.preferred_language || meta.language || 'Deutsch');
  const notificationLanguage = normalizeLanguageLabel(notificationLanguageCode);
  const updatedMeta = {
    ...meta,
    language: normalizeLanguageLabel(body.language || notificationLanguage),
    preferred_language: normalizeLanguageCode(body.language || notificationLanguageCode),
    notificationPrefs: {
      ...(meta.notificationPrefs || {}),
      emailUpdates: body.emailUpdates !== undefined ? body.emailUpdates !== false : meta.notificationPrefs?.emailUpdates !== false,
      whatsappUpdates: body.whatsappUpdates !== undefined ? body.whatsappUpdates === true : Boolean(meta.notificationPrefs?.whatsappUpdates),
      language: notificationLanguage,
      preferred_language: notificationLanguageCode,
    },
  };

  if (body.instagramProfile !== undefined || body.instagramVisible !== undefined) {
    const normalizedInstagram = body.instagramProfile !== undefined
      ? requireValidInstagramProfile(body.instagramProfile)
      : normalizeInstagramProfile(meta.socialProfile?.instagram || meta.instagramProfile || '');

    updatedMeta.socialProfile = {
      ...(meta.socialProfile || {}),
      instagram: normalizedInstagram,
      instagramVisible: body.instagramVisible !== undefined ? Boolean(body.instagramVisible) : meta.socialProfile?.instagramVisible !== false,
      updatedAt: new Date().toISOString(),
      updatedBy: session.email || record.email || '',
    };
  }

  const updatedRecord = await patchPartnerMeta(record, updatedMeta, { requireService: true });

  return json({ partner: normalizePartner(updatedRecord) });
}

async function updateProfilePhoto(request, body) {
  const session = await requireSession(request);
  const isAdmin = session.role === 'admin';
  const targetPartnerId = isAdmin ? String(body.id || '').trim() : session.id;

  if (!isValidPartnerId(targetPartnerId)) {
    return json({ message: 'Partner-ID ist ungueltig.' }, 400);
  }

  const record = await getPartnerById(targetPartnerId, { requireService: true });

  if (!record || record.status === 'system' || parseMeta(record).role === 'system') {
    return json({ message: 'Partner nicht gefunden.' }, 404);
  }

  if (!isAdmin && record.status !== 'approved') {
    return json({ message: 'Warte auf Freigabe durch Leonid Curos' }, 403);
  }

  const meta = parseMeta(record);
  const currentProfileImage = meta.careerProfile?.profileImage || null;

  if (body.remove === true) {
    const updatedMeta = {
      ...meta,
      careerProfile: {
        ...(meta.careerProfile || {}),
        profileImageUrl: '',
        profileImage: null,
      },
    };
    const records = await supabaseRequest(`${PARTNERS_TABLE}?id=eq.${encodeURIComponent(record.id)}`, {
      method: 'PATCH',
      body: { avatar_url: JSON.stringify(updatedMeta) },
    }, { requireService: true });
    const updatedRecord = records[0] || { ...record, avatar_url: JSON.stringify(updatedMeta) };

    await deleteProfileImage(currentProfileImage, record.id).catch(() => {});
    return json({ partner: normalizePartner(updatedRecord, { admin: isAdmin }) });
  }

  let profileImage;

  try {
    profileImage = validateOptimizedProfileImagePayload(body.profileImage);
  } catch (error) {
    return json({ message: error.message || 'Profilbild ist ungueltig.' }, error.statusCode || 400);
  }

  const storedProfileImage = await uploadProfileImage(profileImage, record.id);
  const updatedMeta = {
    ...meta,
    careerProfile: {
      ...(meta.careerProfile || {}),
      profileImageUrl: '',
      profileImage: storedProfileImage,
    },
  };
  let updatedRecord;

  try {
    const records = await supabaseRequest(`${PARTNERS_TABLE}?id=eq.${encodeURIComponent(record.id)}`, {
      method: 'PATCH',
      body: { avatar_url: JSON.stringify(updatedMeta) },
    }, { requireService: true });
    updatedRecord = records[0] || { ...record, avatar_url: JSON.stringify(updatedMeta) };
  } catch (error) {
    await deleteProfileImage(storedProfileImage, record.id).catch(() => {});
    throw error;
  }

  await deleteProfileImage(currentProfileImage, record.id).catch(() => {});
  return json({ partner: normalizePartner(updatedRecord, { admin: isAdmin }) });
}

async function sendPartnerReminder(request, body) {
  const session = await requireSession(request, { admin: true });
  const id = String(body.id || '').trim();
  const adminMessage = String(body.message || '').trim().slice(0, 800);

  if (!id) {
    return json({ message: 'Partner-ID fehlt.' }, 400);
  }

  const record = await getPartnerById(id, { requireService: true });

  if (!record || record.status === 'system' || parseMeta(record).role === 'system') {
    return json({ message: 'Partner nicht gefunden.' }, 404);
  }

  const remindedRecord = await sendPartnerReminderEmailAndPersist(record, session, adminMessage);
  return json({ partner: normalizePartner(remindedRecord || record, { admin: true }) });
}

async function cleanTestData(request) {
  await requireSession(request, { admin: true });
  const records = await supabaseRequest(`${PARTNERS_TABLE}?select=*`, {}, { requireService: true });
  const deletableRecords = records.filter((record) => {
    const meta = parseMeta(record);

    if (record.status === 'system' || meta.role === 'system') {
      return false;
    }

    return detectTestData(record).isTestData || Boolean(meta.testData?.isTestData);
  });

  if (deletableRecords.length === 0) {
    return json({ deleted: 0, deletedIds: [] });
  }

  const deletedIds = [];

  for (const record of deletableRecords) {
    await supabaseRequest(`${PARTNERS_TABLE}?id=eq.${encodeURIComponent(record.id)}`, {
      method: 'DELETE',
      prefer: 'return=minimal',
    }, { requireService: true });
    deletedIds.push(String(record.id));
  }

  return json({ deleted: deletedIds.length, deletedIds });
}

async function deletePartner(request, body) {
  await requireSession(request, { admin: true });
  const id = String(body.id || '').trim();

  if (!id) {
    return json({ message: 'Partner-ID fehlt.' }, 400);
  }

  await supabaseRequest(`${PARTNERS_TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: 'DELETE',
    prefer: 'return=minimal',
  }, { requireService: true });

  return json({ ok: true });
}

export async function GET(request) {
  try {
    return await serveProfileImage(request);
  } catch (error) {
    return json({ message: error.message || 'Profilbild konnte nicht geladen werden.' }, error.statusCode || 500);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (body.action === 'register') {
      return await registerPartner(body);
    }

    if (body.action === 'login') {
      return await login(body);
    }

    if (body.action === 'password-reset-request') {
      return await requestPasswordReset(body);
    }

    if (body.action === 'password-reset-confirm') {
      return await confirmPasswordReset(body);
    }

    if (body.action === 'profile-notification-preferences') {
      return await updateNotificationPreferences(request, body);
    }

    if (body.action === 'profile-photo-update') {
      return await updateProfilePhoto(request, body);
    }

    if (body.action === 'session') {
      return await sessionInfo(request);
    }

    if (body.action === 'admin-list') {
      return await listPartners(request);
    }

    if (body.action === 'admin-detail') {
      return await getAdminPartnerDetail(request, body);
    }

    if (body.action === 'academy-ranking') {
      return await listAcademyRanking(request);
    }

    if (body.action === 'career-screenshot') {
      return await submitCareerScreenshot(request, body);
    }

    if (body.action === 'team-growth-update') {
      return await submitTeamGrowthUpdate(request, body);
    }

    if (body.action === 'admin-update') {
      return await updatePartner(request, body);
    }

    if (body.action === 'admin-approve') {
      return await approvePartner(request, body);
    }

    if (body.action === 'admin-send-reminder') {
      return await sendPartnerReminder(request, body);
    }

    if (body.action === 'admin-delete') {
      return await deletePartner(request, body);
    }

    if (body.action === 'admin-clean-test-data') {
      return await cleanTestData(request);
    }

    return json({ message: 'Unbekannte Aktion.' }, 400);
  } catch (error) {
    return json({ message: error.message || 'Serverfehler.' }, error.statusCode || 500);
  }
}
