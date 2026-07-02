import { readFile } from 'node:fs/promises';
import path from 'node:path';

const SUPPORTED_LANGUAGES = new Set(['de', 'en', 'ro', 'ru', 'el', 'tr', 'it', 'cs', 'es', 'pl']);
const LANGUAGE_ALIASES = {
  gr: 'el',
  cz: 'cs',
};

function safePathSegment(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}

function normalizeLanguage(value) {
  const code = String(value || 'de').toLowerCase().replace(/\.json$/i, '');
  return LANGUAGE_ALIASES[code] || code;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoId = safePathSegment(searchParams.get('videoId'));
  const languageCode = normalizeLanguage(searchParams.get('lang'));

  if (!videoId || !SUPPORTED_LANGUAGES.has(languageCode)) {
    return Response.json(
      { available: false, error: 'Invalid video or language.' },
      { status: 400 },
    );
  }

  const transcriptPath = path.join(
    process.cwd(),
    'public',
    'academy-transcripts',
    videoId,
    `${languageCode}.json`,
  );

  try {
    const payload = JSON.parse(await readFile(transcriptPath, 'utf8'));

    return Response.json(
      {
        available: true,
        ...payload,
        vttPath: `/subtitles/${encodeURIComponent(videoId)}/${encodeURIComponent(languageCode)}.vtt`,
        srtPath: `/academy-transcripts/${encodeURIComponent(videoId)}/${encodeURIComponent(languageCode)}.srt`,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      },
    );
  } catch {
    return Response.json(
      { available: false, videoId, language: languageCode, segments: [], transcript: '', summary: '' },
      { status: 404 },
    );
  }
}
