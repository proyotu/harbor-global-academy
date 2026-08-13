import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import {
  assertApprovedAcademyPartnerRecord,
  createSignedAssetUrl,
  verifySignedAssetUrl,
} from '../app/api/academy-asset-auth.js';
import { GET } from '../app/api/academy-videos/route.js';
import { ACADEMY_VIDEO_ASSETS, resolveAcademyVideoAsset } from '../app/lib/academy-video-assets.js';
import { assertSingleAcademyVideoRange, parseAcademyVideoRange } from '../app/lib/academy-video-range.js';
import { getR2Object, isR2Configured } from '../lib/storage/r2.ts';

const TEST_SECRET = 'academy-video-delivery-test-secret';
const ORIGINAL_AUTH_SECRET = process.env.HARBOR_AUTH_SECRET;

process.env.HARBOR_AUTH_SECRET = TEST_SECRET;

test.after(() => {
  if (ORIGINAL_AUTH_SECRET === undefined) {
    delete process.env.HARBOR_AUTH_SECRET;
  } else {
    process.env.HARBOR_AUTH_SECRET = ORIGINAL_AUTH_SECRET;
  }
});

function token(payload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', TEST_SECRET).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

function adminToken() {
  return token({ id: 'admin-test', role: 'admin', exp: Math.floor(Date.now() / 1000) + 300 });
}

function request(videoId, options = {}) {
  const headers = new Headers(options.headers || {});

  if (options.auth !== false) {
    headers.set('Authorization', `Bearer ${adminToken()}`);
  }

  return new Request(`http://localhost/api/academy-videos?videoId=${encodeURIComponent(videoId)}`, { headers });
}

test('allowlist maps canonical video IDs to server-owned storage keys', () => {
  assert.equal(Object.keys(ACADEMY_VIDEO_ASSETS).length, 15);
  assert.deepEqual(resolveAcademyVideoAsset({ videoId: 'ppm-bedeutung' }), {
    id: 'ppm-bedeutung',
    source: 'r2',
    storageKey: 'academy/videos/de/m10/ppm-bedeutung/v2/academy_m10_l02_ppm-bedeutung_de_approved_v2_20260805.mp4',
    contentType: 'video/mp4',
  });
  assert.deepEqual(resolveAcademyVideoAsset({ videoId: 'umkehrosmose-erklaerung' }), {
    id: 'umkehrosmose-erklaerung',
    source: 'r2',
    storageKey: 'academy/videos/de/m03/umkehrosmose-erklaerung/v2/academy_m03_l02_umkehrosmose-erklaerung_de_approved_v2_20260801.mp4',
    contentType: 'video/mp4',
  });
  assert.equal(resolveAcademyVideoAsset({ videoId: 'unbekanntes-video' }), null);
  assert.throws(() => resolveAcademyVideoAsset({ videoId: '../private/object' }), { statusCode: 400 });
  assert.deepEqual(resolveAcademyVideoAsset({ videoId: 'academy-r2-e2e-test' }), {
    id: 'academy-r2-e2e-test',
    source: 'r2',
    storageKey: 'academy/test/r2-e2e/academy_r2_e2e_test_v1.mp4',
    contentType: 'video/mp4',
  });
  assert.deepEqual(
    Object.values(ACADEMY_VIDEO_ASSETS).filter((asset) => asset.source === 'r2').map((asset) => asset.id).sort(),
    ['academy-r2-e2e-test', 'ppm-bedeutung', 'umkehrosmose-erklaerung'],
  );
});

test('single range parser supports beginning, middle, tail, open end and suffix', () => {
  assert.deepEqual(parseAcademyVideoRange('bytes=0-99', 1000), { start: 0, end: 99 });
  assert.deepEqual(parseAcademyVideoRange('bytes=400-499', 1000), { start: 400, end: 499 });
  assert.deepEqual(parseAcademyVideoRange('bytes=900-999', 1000), { start: 900, end: 999 });
  assert.deepEqual(parseAcademyVideoRange('bytes=900-', 1000), { start: 900, end: 999 });
  assert.deepEqual(parseAcademyVideoRange('bytes=-100', 1000), { start: 900, end: 999 });
});

test('invalid, multi and out-of-size ranges return 416 contracts', () => {
  assert.throws(() => parseAcademyVideoRange('bytes=1000-', 1000), { statusCode: 416 });
  assert.throws(() => parseAcademyVideoRange('bytes=20-10', 1000), { statusCode: 416 });
  assert.throws(() => assertSingleAcademyVideoRange('bytes=0-1,4-5'), { statusCode: 416 });
});

test('partner state gate allows only approved records, including approved leaders', () => {
  assert.equal(assertApprovedAcademyPartnerRecord({ id: 'partner', status: 'approved' }).status, 'approved');
  assert.equal(assertApprovedAcademyPartnerRecord({ id: 'leader', status: 'approved', aquaLevel: 'Leader' }).status, 'approved');

  for (const status of ['pending', 'blocked', 'rejected', 'paused']) {
    assert.throws(() => assertApprovedAcademyPartnerRecord({ id: status, status }), { statusCode: 403 });
  }
});

test('signed asset URLs contain canonical IDs and reject tampering', () => {
  const signed = createSignedAssetUrl({
    request: new Request('http://localhost/api/academy-videos?videoId=ppm-bedeutung'),
    kind: 'academy-video',
    file: 'ppm-bedeutung',
    session: { id: 'admin-test', role: 'admin' },
  });
  const url = new URL(signed.url, 'http://localhost');
  const input = {
    kind: 'academy-video',
    file: url.searchParams.get('file'),
    expires: url.searchParams.get('expires'),
    subject: url.searchParams.get('subject'),
    role: url.searchParams.get('role'),
    signature: url.searchParams.get('signature'),
  };

  assert.equal(input.file, 'ppm-bedeutung');
  assert.equal(verifySignedAssetUrl(input).role, 'admin');
  assert.throws(() => verifySignedAssetUrl({ ...input, file: 'umkehrosmose-erklaerung' }), { statusCode: 403 });
});

test('signed asset verification accepts the existing Leader session role', () => {
  const signed = createSignedAssetUrl({
    request: new Request('http://localhost/api/academy-videos?videoId=ppm-bedeutung'),
    kind: 'academy-video',
    file: 'ppm-bedeutung',
    session: { id: 'leader-test', role: 'leader' },
  });
  const url = new URL(signed.url, 'http://localhost');
  const verified = verifySignedAssetUrl({
    kind: 'academy-video',
    file: url.searchParams.get('file'),
    expires: url.searchParams.get('expires'),
    subject: url.searchParams.get('subject'),
    role: url.searchParams.get('role'),
    signature: url.searchParams.get('signature'),
  });

  assert.equal(verified.role, 'leader');
});

test('admin signed URL streams an existing protected local video', async () => {
  const signRequest = new Request('http://localhost/api/academy-videos?videoId=wasser-ist-leben&sign=1', {
    headers: { Authorization: `Bearer ${adminToken()}` },
  });
  const signResponse = await GET(signRequest);
  assert.equal(signResponse.status, 200);
  const signed = await signResponse.json();
  const streamResponse = await GET(new Request(new URL(signed.url, 'http://localhost'), {
    headers: { Range: 'bytes=0-99' },
  }));

  assert.equal(streamResponse.status, 206);
  assert.equal(streamResponse.headers.get('content-length'), '100');
  assert.match(streamResponse.headers.get('content-range'), /^bytes 0-99\/\d+$/);
  assert.equal((await streamResponse.arrayBuffer()).byteLength, 100);
});

test('route denies unauthenticated and invalid sessions without exposing details', async () => {
  const unauthenticated = await GET(request('ppm-bedeutung', { auth: false }));
  assert.equal(unauthenticated.status, 401);
  assert.deepEqual(await unauthenticated.json(), { message: 'Nicht eingeloggt.' });

  const invalid = await GET(request('ppm-bedeutung', { headers: { Authorization: 'Bearer invalid.token' }, auth: false }));
  assert.equal(invalid.status, 401);
  assert.deepEqual(await invalid.json(), { message: 'Nicht eingeloggt.' });
});

test('route rejects manipulated IDs and returns 404 for unknown allowed-format IDs', async () => {
  assert.equal((await GET(request('../private/object'))).status, 400);
  assert.equal((await GET(request('unbekanntes-video'))).status, 404);
});

test('local route returns 200 and supports byte ranges used by browser seek', async () => {
  const full = await GET(request('wasser-ist-leben'));
  assert.equal(full.status, 200);
  assert.equal(full.headers.get('accept-ranges'), 'bytes');
  assert.equal(full.headers.get('content-type'), 'video/mp4');
  assert.match(full.headers.get('cache-control'), /private/);
  await full.body.cancel();

  const filePath = path.join(process.cwd(), 'academy-videos', 'private', 'wasser-ist-leben.mp4');
  const size = (await stat(filePath)).size;
  const cases = [
    ['bytes=0-99', 100, `bytes 0-99/${size}`],
    ['bytes=1000-1099', 100, `bytes 1000-1099/${size}`],
    [`bytes=${size - 100}-${size - 1}`, 100, `bytes ${size - 100}-${size - 1}/${size}`],
    [`bytes=${size - 100}-`, 100, `bytes ${size - 100}-${size - 1}/${size}`],
  ];

  for (const [range, length, contentRange] of cases) {
    const response = await GET(request('wasser-ist-leben', { headers: { Range: range } }));
    assert.equal(response.status, 206);
    assert.equal(Number(response.headers.get('content-length')), length);
    assert.equal(response.headers.get('content-range'), contentRange);
    assert.equal((await response.arrayBuffer()).byteLength, length);
  }

  const invalid = await GET(request('wasser-ist-leben', { headers: { Range: `bytes=${size}-` } }));
  assert.equal(invalid.status, 416);
  assert.equal(invalid.headers.get('content-range'), `bytes */${size}`);
});

test('R2 configuration check exposes only a boolean and no credential values', () => {
  assert.equal(typeof isR2Configured(), 'boolean');
});

test('private R2 GET signs and forwards a single byte range', async () => {
  const names = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME'];
  const originalValues = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  const originalFetch = globalThis.fetch;
  let capturedRequest;

  Object.assign(process.env, {
    R2_ACCOUNT_ID: 'test-account',
    R2_ACCESS_KEY_ID: 'test-access-key',
    R2_SECRET_ACCESS_KEY: 'test-secret-key',
    R2_BUCKET_NAME: 'test-private-bucket',
  });
  globalThis.fetch = async (url, options) => {
    capturedRequest = { url, options };
    return new Response(new Uint8Array(100), {
      status: 206,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': '100',
        'Content-Range': 'bytes 0-99/1000',
      },
    });
  };

  try {
    const response = await getR2Object('academy/videos/test/video.mp4', {
      range: 'bytes=0-99',
      acceptedStatuses: [200, 206],
    });

    assert.equal(response.status, 206);
    assert.equal(capturedRequest.options.headers.range, 'bytes=0-99');
    assert.match(capturedRequest.options.headers.Authorization, /^AWS4-HMAC-SHA256 /);
    assert.equal(String(capturedRequest.url).includes('academy/videos/test/video.mp4'), true);
  } finally {
    globalThis.fetch = originalFetch;

    for (const name of names) {
      if (originalValues[name] === undefined) delete process.env[name];
      else process.env[name] = originalValues[name];
    }
  }
});

test('R2 GET fails clearly when server credentials are missing', async () => {
  if (!isR2Configured()) {
    await assert.rejects(() => getR2Object('academy/videos/test/missing.mp4'), { statusCode: 503 });
  }
});
