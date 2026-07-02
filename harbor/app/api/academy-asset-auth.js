import crypto from 'node:crypto';

const PARTNERS_TABLE = 'partners';
const ASSET_URL_TTL_SECONDS = 10 * 60;

export function json(data, status = 200) {
  return Response.json(data, { status });
}

function readEnv(name) {
  return String(process.env[name] || '').trim();
}

function getAuthSecret() {
  return readEnv('HARBOR_AUTH_SECRET') || readEnv('SUPABASE_SERVICE_ROLE_KEY') || readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 'local-harbor-dev-secret';
}

function getSupabaseConfig({ requireService = true } = {}) {
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

  let payload;

  try {
    payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
  } catch {
    throw Object.assign(new Error('Session ist ungueltig.'), { statusCode: 401 });
  }

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw Object.assign(new Error('Session ist abgelaufen.'), { statusCode: 401 });
  }

  if (payload.role !== 'admin' && payload.role !== 'partner') {
    throw Object.assign(new Error('Zugriff verweigert.'), { statusCode: 403 });
  }

  return payload;
}

async function requireApprovedPartner(session) {
  const id = String(session?.id || '').trim();

  if (!id) {
    throw Object.assign(new Error('Zugriff verweigert.'), { statusCode: 403 });
  }

  const records = await supabaseRequest(`${PARTNERS_TABLE}?id=eq.${encodeURIComponent(id)}&select=id,status&limit=1`, {}, { requireService: true });
  const record = records[0] || null;

  if (!record || record.status !== 'approved') {
    throw Object.assign(new Error('Dein Konto ist nicht freigegeben.'), { statusCode: 403 });
  }

  return record;
}

export async function requireApprovedAcademyAssetSession(request) {
  const session = verifyToken(getBearerToken(request));

  if (session.role === 'admin') {
    return session;
  }

  await requireApprovedPartner(session);
  return session;
}

function getAssetSignaturePayload({ kind, file, subject, role, expires }) {
  return `${kind}.${file}.${subject}.${role}.${expires}`;
}

export function createSignedAssetUrl({ request, kind, file, session }) {
  const expires = Math.floor(Date.now() / 1000) + ASSET_URL_TTL_SECONDS;
  const subject = String(session.id || session.email || '');
  const role = String(session.role || '');
  const signature = crypto
    .createHmac('sha256', getAuthSecret())
    .update(getAssetSignaturePayload({ kind, file, subject, role, expires }))
    .digest('base64url');
  const url = new URL(request.url);

  url.search = '';
  url.searchParams.set('file', file);
  url.searchParams.set('expires', String(expires));
  url.searchParams.set('subject', subject);
  url.searchParams.set('role', role);
  url.searchParams.set('signature', signature);

  return {
    url: `${url.pathname}?${url.searchParams.toString()}`,
    expires,
  };
}

export function verifySignedAssetUrl({ kind, file, expires, subject, role, signature }) {
  const expiresNumber = Number(expires);
  const now = Math.floor(Date.now() / 1000);

  if (
    !file
    || !subject
    || (role !== 'admin' && role !== 'partner')
    || !Number.isInteger(expiresNumber)
    || expiresNumber < now
    || expiresNumber > now + ASSET_URL_TTL_SECONDS + 60
  ) {
    throw Object.assign(new Error('Asset-Link ist ungueltig oder abgelaufen.'), { statusCode: 403 });
  }

  const expectedSignature = crypto
    .createHmac('sha256', getAuthSecret())
    .update(getAssetSignaturePayload({ kind, file, subject, role, expires: expiresNumber }))
    .digest('base64url');

  if (!signature || signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    throw Object.assign(new Error('Asset-Link ist ungueltig oder abgelaufen.'), { statusCode: 403 });
  }
}
