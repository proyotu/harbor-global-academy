import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import {
  createSignedAssetUrl,
  json,
  requireApprovedAcademyAssetSession,
  verifySignedAssetUrl,
} from '../academy-asset-auth.js';

export const runtime = 'nodejs';

const PRIVATE_VIDEOS = {
  'wasser-ist-leben.mp4': 'wasser-ist-leben.mp4',
  'allgemeine-ernaehrungsweise.mp4': 'allgemeine-ernaehrungsweise.mp4',
  'funktionen-von-wasser-im-koerper.mp4': 'funktionen-von-wasser-im-koerper.mp4',
  'mineralien.mp4': 'mineralien.mp4',
  'grenzwerte.mp4': 'grenzwerte.mp4',
  'umkehrosmose-erklaerung.mp4': 'umkehrosmose-erklaerung.mp4',
  'ppm-bedeutung.mp4': 'ppm-bedeutung.mp4',
  'membranfilter-vs-filterkanne.mp4': 'membranfilter-vs-filterkanne.mp4',
  'tee-test.mp4': 'tee-test.mp4',
  'basilikum-test.mp4': 'basilikum-test.mp4',
  'farbtest.mp4': 'farbtest.mp4',
  'farbtest-erklaerung.mp4': 'farbtest-erklaerung.mp4',
  'kundenbestellung.mp4': 'kundenbestellung.mp4',
  'partnerregistrierung.mp4': 'partnerregistrierung.mp4',
};

const VIDEO_CONTENT_TYPE = 'video/mp4';

function normalizeRequestedFile(value) {
  return decodeURIComponent(String(value || '')).split('/').pop().trim();
}

function videoHeaders(extra = {}) {
  return {
    'Accept-Ranges': 'bytes',
    'Content-Type': VIDEO_CONTENT_TYPE,
    'Cache-Control': 'private, no-store',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'X-Content-Type-Options': 'nosniff',
    ...extra,
  };
}

function parseRange(rangeHeader, size) {
  if (!rangeHeader) {
    return null;
  }

  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());

  if (!match) {
    return null;
  }

  let start = match[1] ? Number(match[1]) : 0;
  let end = match[2] ? Number(match[2]) : size - 1;

  if (!match[1] && match[2]) {
    const suffixLength = Number(match[2]);
    start = Math.max(size - suffixLength, 0);
    end = size - 1;
  }

  if (
    !Number.isInteger(start)
    || !Number.isInteger(end)
    || start < 0
    || end < start
    || start >= size
  ) {
    throw Object.assign(new Error('Range nicht erfuellbar.'), { statusCode: 416 });
  }

  return {
    start,
    end: Math.min(end, size - 1),
  };
}

async function serveVideoFile(request, allowedFile) {
  const filePath = path.join(process.cwd(), 'academy-videos', 'private', allowedFile);
  const fileStat = await stat(filePath);
  const size = fileStat.size;
  const parsedRange = parseRange(request.headers.get('range'), size);

  if (!parsedRange) {
    return new Response(Readable.toWeb(createReadStream(filePath)), {
      status: 200,
      headers: videoHeaders({
        'Content-Length': String(size),
      }),
    });
  }

  const { start, end } = parsedRange;
  const chunkSize = end - start + 1;

  return new Response(Readable.toWeb(createReadStream(filePath, { start, end })), {
    status: 206,
    headers: videoHeaders({
      'Content-Length': String(chunkSize),
      'Content-Range': `bytes ${start}-${end}/${size}`,
    }),
  });
}

function hasSignedAssetParams(searchParams) {
  return Boolean(
    searchParams.get('expires')
    || searchParams.get('subject')
    || searchParams.get('role')
    || searchParams.get('signature'),
  );
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedFile = normalizeRequestedFile(searchParams.get('file') || request.headers.get('x-harbor-academy-asset-file'));
    const allowedFile = PRIVATE_VIDEOS[requestedFile];

    if (!allowedFile) {
      return json({ message: 'Video nicht gefunden.' }, 404);
    }

    if (searchParams.get('sign') === '1') {
      const session = await requireApprovedAcademyAssetSession(request);
      return json(createSignedAssetUrl({
        request,
        kind: 'academy-video',
        file: allowedFile,
        session,
      }));
    }

    if (hasSignedAssetParams(searchParams)) {
      verifySignedAssetUrl({
        kind: 'academy-video',
        file: allowedFile,
        expires: searchParams.get('expires'),
        subject: searchParams.get('subject'),
        role: searchParams.get('role'),
        signature: searchParams.get('signature'),
      });
    } else {
      await requireApprovedAcademyAssetSession(request);
    }

    return await serveVideoFile(request, allowedFile);
  } catch (error) {
    if (error.statusCode === 416) {
      return new Response(null, {
        status: 416,
        headers: videoHeaders({
          'Content-Range': 'bytes */*',
        }),
      });
    }

    return json({ message: error.message || 'Video konnte nicht geladen werden.' }, error.statusCode || 500);
  }
}
