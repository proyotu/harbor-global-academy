import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { getR2Object } from '../../../lib/storage/r2.ts';
import { resolveAcademyVideoAsset } from '../../lib/academy-video-assets.js';
import { assertSingleAcademyVideoRange, parseAcademyVideoRange } from '../../lib/academy-video-range.js';
import {
  createSignedAssetUrl,
  json,
  requireApprovedAcademyAssetSession,
  requireApprovedSignedAcademyAssetSession,
} from '../academy-asset-auth.js';

export const runtime = 'nodejs';

function videoHeaders(contentType, extra = {}) {
  return {
    'Accept-Ranges': 'bytes',
    'Content-Type': contentType || 'video/mp4',
    'Cache-Control': 'private, no-store, max-age=0',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'X-Content-Type-Options': 'nosniff',
    ...extra,
  };
}

async function serveLocalVideo(request, asset) {
  const filePath = path.join(process.cwd(), 'academy-videos', 'private', asset.storageKey);
  const fileStat = await stat(filePath);
  const size = fileStat.size;
  const parsedRange = parseAcademyVideoRange(request.headers.get('range'), size);

  if (!parsedRange) {
    return new Response(Readable.toWeb(createReadStream(filePath)), {
      status: 200,
      headers: videoHeaders(asset.contentType, { 'Content-Length': String(size) }),
    });
  }

  const { start, end } = parsedRange;
  return new Response(Readable.toWeb(createReadStream(filePath, { start, end })), {
    status: 206,
    headers: videoHeaders(asset.contentType, {
      'Content-Length': String(end - start + 1),
      'Content-Range': `bytes ${start}-${end}/${size}`,
    }),
  });
}

async function serveR2Video(request, asset) {
  const requestedRange = assertSingleAcademyVideoRange(request.headers.get('range'));
  const response = await getR2Object(asset.storageKey, {
    range: requestedRange || undefined,
    acceptedStatuses: [200, 206],
  });
  const contentLength = response.headers.get('content-length');
  const contentRange = response.headers.get('content-range');

  if (
    !contentLength
    || (!requestedRange && response.status !== 200)
    || (requestedRange && (response.status !== 206 || !contentRange))
  ) {
    throw Object.assign(new Error('Video-Storage lieferte eine unvollstaendige Antwort.'), { statusCode: 503 });
  }

  return new Response(response.body, {
    status: requestedRange ? 206 : 200,
    headers: videoHeaders(response.headers.get('content-type') || asset.contentType, {
      'Content-Length': contentLength,
      ...(contentRange ? { 'Content-Range': contentRange } : {}),
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

function requestedAsset(searchParams, request) {
  const videoId = searchParams.get('videoId');
  const legacyFile = searchParams.get('file') || request.headers.get('x-harbor-academy-asset-file');
  const signedOrCanonicalId = videoId || (legacyFile && !legacyFile.endsWith('.mp4') ? legacyFile : '');

  return resolveAcademyVideoAsset({ videoId: signedOrCanonicalId, legacyFile: signedOrCanonicalId ? '' : legacyFile });
}

function publicErrorStatus(error) {
  if (Object.hasOwn(error || {}, 'storageErrorBody')) {
    if (error.statusCode === 404 || error.statusCode === 416) {
      return error.statusCode;
    }

    return 503;
  }

  if (error?.code === 'ENOENT' || error?.statusCode === 404) {
    return 404;
  }

  if ([400, 401, 403, 416, 503].includes(error?.statusCode)) {
    return error.statusCode;
  }

  return 500;
}

function publicErrorMessage(status) {
  if (status === 400) return 'Video-ID ist ungueltig.';
  if (status === 401) return 'Nicht eingeloggt.';
  if (status === 403) return 'Zugriff verweigert.';
  if (status === 404) return 'Video nicht gefunden.';
  if (status === 503) return 'Video-Storage ist derzeit nicht verfuegbar.';
  return 'Video konnte nicht geladen werden.';
}

export async function GET(request) {
  let asset = null;

  try {
    const { searchParams } = new URL(request.url);
    asset = requestedAsset(searchParams, request);

    if (!asset) {
      return json({ message: 'Video nicht gefunden.' }, 404);
    }

    if (searchParams.get('sign') === '1') {
      const session = await requireApprovedAcademyAssetSession(request);
      return json(createSignedAssetUrl({ request, kind: 'academy-video', file: asset.id, session }));
    }

    if (hasSignedAssetParams(searchParams)) {
      await requireApprovedSignedAcademyAssetSession({
        kind: 'academy-video',
        file: asset.id,
        expires: searchParams.get('expires'),
        subject: searchParams.get('subject'),
        role: searchParams.get('role'),
        signature: searchParams.get('signature'),
      });
    } else {
      await requireApprovedAcademyAssetSession(request);
    }

    return asset.source === 'r2' ? await serveR2Video(request, asset) : await serveLocalVideo(request, asset);
  } catch (error) {
    const status = publicErrorStatus(error);

    if (status === 416) {
      return new Response(null, {
        status: 416,
        headers: videoHeaders(asset?.contentType, {
          'Content-Range': Number.isSafeInteger(error.totalSize) ? `bytes */${error.totalSize}` : 'bytes */*',
        }),
      });
    }

    return json({ message: publicErrorMessage(status) }, status);
  }
}
