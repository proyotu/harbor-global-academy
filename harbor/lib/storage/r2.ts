import crypto from 'node:crypto';

export const R2_UPLOAD_LIMITS = {
  profileImage: 5 * 1024 * 1024,
  pdf: 25 * 1024 * 1024,
  document: 25 * 1024 * 1024,
  video: 500 * 1024 * 1024,
  certificate: 25 * 1024 * 1024,
} as const;

type R2UploadKind = keyof typeof R2_UPLOAD_LIMITS;

type R2UploadInput = {
  key: string;
  body: Buffer | Uint8Array | ArrayBuffer | string;
  contentType?: string;
  cacheControl?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
  kind?: R2UploadKind;
};

type R2ObjectResult = {
  key: string;
  url: string;
  bucket: string;
  provider: 'cloudflare-r2';
  size: number;
  contentType: string;
  uploadedAt: string;
};

const R2_REGION = 'auto';
const R2_SERVICE = 's3';
const EMPTY_SHA256 = crypto.createHash('sha256').update('').digest('hex');

function readEnv(name: string) {
  return String(process.env[name] || '').trim();
}

function getR2Config() {
  const accountId = readEnv('R2_ACCOUNT_ID');
  const accessKeyId = readEnv('R2_ACCESS_KEY_ID');
  const secretAccessKey = readEnv('R2_SECRET_ACCESS_KEY');
  const bucketName = readEnv('R2_BUCKET_NAME');
  const publicUrl = readEnv('R2_PUBLIC_URL').replace(/\/$/, '');

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    throw Object.assign(new Error('Dateispeicher ist nicht vollständig konfiguriert.'), { statusCode: 503 });
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicUrl,
    endpoints: [
      `https://${accountId}.r2.cloudflarestorage.com`,
      `https://${accountId}.eu.r2.cloudflarestorage.com`,
    ],
  };
}

export function getR2BucketName() {
  return getR2Config().bucketName;
}

export function isR2Configured() {
  return Boolean(
    readEnv('R2_ACCOUNT_ID')
    && readEnv('R2_ACCESS_KEY_ID')
    && readEnv('R2_SECRET_ACCESS_KEY')
    && readEnv('R2_BUCKET_NAME'),
  );
}

function toBuffer(body: R2UploadInput['body']) {
  if (Buffer.isBuffer(body)) {
    return body;
  }

  if (body instanceof ArrayBuffer) {
    return Buffer.from(body);
  }

  if (body instanceof Uint8Array) {
    return Buffer.from(body);
  }

  return Buffer.from(String(body));
}

function hashHex(value: Buffer | string) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function hmac(key: Buffer | string, value: string) {
  return crypto.createHmac('sha256', key).update(value).digest();
}

function signHex(key: Buffer, value: string) {
  return crypto.createHmac('sha256', key).update(value).digest('hex');
}

function amzTimestamp(date = new Date()) {
  return date.toISOString().replace(/[:-]|\.\d{3}/g, '');
}

function amzDate(timestamp: string) {
  return timestamp.slice(0, 8);
}

function encodeR2Key(key: string) {
  return String(key || '')
    .split('/')
    .filter(Boolean)
    .map((part) => encodeURIComponent(part).replace(/[!'()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`))
    .join('/');
}

export function sanitizeR2KeyPart(value: string, fallback = 'file') {
  const cleaned = String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);

  return cleaned || fallback;
}

export function assertR2UploadSize(kind: R2UploadKind, size: number) {
  const limit = R2_UPLOAD_LIMITS[kind];

  if (!Number.isFinite(size) || size <= 0) {
    throw Object.assign(new Error('Datei konnte nicht gelesen werden.'), { statusCode: 400 });
  }

  if (size > limit) {
    const mb = Math.round(limit / (1024 * 1024));
    throw Object.assign(new Error(`Datei ist zu groß. Maximal ${mb} MB.`), { statusCode: 400 });
  }
}

export function getR2PublicUrl(key: string) {
  const { publicUrl } = getR2Config();

  if (!publicUrl) {
    return '';
  }

  return `${publicUrl}/${encodeR2Key(key)}`;
}

function buildHeaders(headers: Record<string, string | undefined>) {
  return Object.fromEntries(
    Object.entries(headers)
      .filter(([, value]) => value !== undefined && value !== '')
      .map(([key, value]) => [key.toLowerCase(), String(value).trim()]),
  );
}

function canonicalHeaders(headers: Record<string, string>) {
  return Object.keys(headers)
    .sort()
    .map((key) => `${key}:${headers[key].replace(/\s+/g, ' ')}`)
    .join('\n');
}

function signingKey(secretAccessKey: string, date: string) {
  const dateKey = hmac(`AWS4${secretAccessKey}`, date);
  const regionKey = hmac(dateKey, R2_REGION);
  const serviceKey = hmac(regionKey, R2_SERVICE);
  return hmac(serviceKey, 'aws4_request');
}

function authorizationHeader({
  method,
  canonicalUri,
  payloadHash,
  headers,
  timestamp,
  accessKeyId,
  secretAccessKey,
}: {
  method: string;
  canonicalUri: string;
  payloadHash: string;
  headers: Record<string, string>;
  timestamp: string;
  accessKeyId: string;
  secretAccessKey: string;
}) {
  const date = amzDate(timestamp);
  const signedHeaders = Object.keys(headers).sort().join(';');
  const canonicalRequest = [
    method,
    canonicalUri,
    '',
    `${canonicalHeaders(headers)}\n`,
    signedHeaders,
    payloadHash,
  ].join('\n');
  const credentialScope = `${date}/${R2_REGION}/${R2_SERVICE}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    timestamp,
    credentialScope,
    hashHex(canonicalRequest),
  ].join('\n');
  const signature = signHex(signingKey(secretAccessKey, date), stringToSign);

  return `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

async function signedR2Request(method: string, key: string, endpoint: string, options: {
  body?: Buffer;
  contentType?: string;
  cacheControl?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
} = {}) {
  const config = getR2Config();
  const encodedKey = encodeR2Key(key);
  const canonicalUri = `/${encodeURIComponent(config.bucketName)}/${encodedKey}`;
  const url = `${endpoint}${canonicalUri}`;
  const timestamp = amzTimestamp();
  const payloadHash = options.body ? hashHex(options.body) : EMPTY_SHA256;
  const metadataHeaders = Object.fromEntries(
    Object.entries(options.metadata || {})
      .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
      .map(([name, value]) => [`x-amz-meta-${sanitizeR2KeyPart(name, 'meta')}`, String(value)]),
  );
  const headers = buildHeaders({
    host: new URL(endpoint).host,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': timestamp,
    'content-type': options.contentType,
    'cache-control': options.cacheControl,
    ...metadataHeaders,
  });
  const authorization = authorizationHeader({
    method,
    canonicalUri,
    payloadHash,
    headers,
    timestamp,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  });
  const response = await fetch(url, {
    method,
    headers: {
      ...headers,
      Authorization: authorization,
    },
    body: options.body,
  });

  if (!response.ok) {
    const storageErrorBody = await response.text().catch(() => '');
    throw Object.assign(new Error('Datei konnte nicht im Dateispeicher verarbeitet werden.'), {
      statusCode: response.status,
      storageErrorBody,
      storageStatusText: response.statusText,
    });
  }

  return response;
}

function shouldRetryWithJurisdictionEndpoint(error: Error & { storageErrorBody?: string }) {
  return /SignatureDoesNotMatch|AuthorizationHeaderMalformed|PermanentRedirect/i.test(error.storageErrorBody || '');
}

async function r2Request(method: string, key: string, options: {
  body?: Buffer;
  contentType?: string;
  cacheControl?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
} = {}) {
  const config = getR2Config();
  let lastError: (Error & { storageErrorBody?: string }) | null = null;

  for (const endpoint of config.endpoints) {
    try {
      return await signedR2Request(method, key, endpoint, options);
    } catch (error) {
      lastError = error as Error & { storageErrorBody?: string };

      if (!shouldRetryWithJurisdictionEndpoint(lastError)) {
        throw lastError;
      }
    }
  }

  throw lastError || Object.assign(new Error('Datei konnte nicht im Dateispeicher verarbeitet werden.'), { statusCode: 500 });
}

export async function uploadR2Object(input: R2UploadInput): Promise<R2ObjectResult> {
  const body = toBuffer(input.body);

  if (input.kind) {
    assertR2UploadSize(input.kind, body.byteLength);
  }

  await r2Request('PUT', input.key, {
    body,
    contentType: input.contentType || 'application/octet-stream',
    cacheControl: input.cacheControl,
    metadata: input.metadata,
  });

  return {
    key: input.key,
    url: getR2PublicUrl(input.key),
    bucket: getR2BucketName(),
    provider: 'cloudflare-r2',
    size: body.byteLength,
    contentType: input.contentType || 'application/octet-stream',
    uploadedAt: new Date().toISOString(),
  };
}

export async function deleteR2Object(key: string) {
  if (!key) {
    return;
  }

  await r2Request('DELETE', key);
}

export async function getR2Object(key: string) {
  return r2Request('GET', key);
}
