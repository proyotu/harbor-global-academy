#!/usr/bin/env node

import { readFile, readdir, mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const VIDEO_DIR = path.join(ROOT, 'public', 'academy-videos');
const OUTPUT_DIR = path.join(ROOT, 'public', 'academy-transcripts');
const OPENAI_API_URL = 'https://api.openai.com/v1';
const TRANSCRIPTION_MODEL = process.env.OPENAI_TRANSCRIPTION_MODEL || 'whisper-1';
const TRANSLATION_MODEL = process.env.OPENAI_TRANSLATION_MODEL || 'gpt-4o-mini';
const FORCE = process.argv.includes('--force');

const LANGUAGES = [
  { code: 'de', name: 'German' },
  { code: 'en', name: 'English' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'el', name: 'Greek' },
  { code: 'tr', name: 'Turkish' },
  { code: 'it', name: 'Italian' },
  { code: 'cs', name: 'Czech' },
  { code: 'es', name: 'Spanish' },
  { code: 'pl', name: 'Polish' },
];

const VIDEO_META = {
  'wasser-ist-leben': {
    title: 'Wasser ist Leben',
    moduleId: 2,
    category: 'Aqua Global Grundlagen',
  },
  'allgemeine-ernaehrungsweise': {
    title: 'Allgemeine Ernährungsweise',
    moduleId: 2,
    category: 'Aqua Global Grundlagen',
  },
  'funktionen-von-wasser-im-koerper': {
    title: 'Funktionen von Wasser im Körper',
    moduleId: 2,
    category: 'Aqua Global Grundlagen',
  },
  mineralien: {
    title: 'Mineralien',
    moduleId: 2,
    category: 'Aqua Global Grundlagen',
  },
  grenzwerte: {
    title: 'Grenzwerte',
    moduleId: 2,
    category: 'Aqua Global Grundlagen',
  },
  'umkehrosmose-erklaerung': {
    title: 'Umkehrosmose Erklärung',
    moduleId: 3,
    category: 'Produkte & Filtrationstechnologie',
  },
  'ppm-bedeutung': {
    title: 'PPM Bedeutung',
    moduleId: 10,
    category: 'PPM-Test',
  },
  'membranfilter-vs-filterkanne': {
    title: 'Unterschied Membranfilter vs. Filterkanne',
    moduleId: 10,
    category: 'Wasser- und Filtertests',
  },
  'tee-test': {
    title: 'Tee-Test',
    moduleId: 10,
    category: 'Lebensmitteltests',
  },
  'basilikum-test': {
    title: 'Basilikum-Test',
    moduleId: 10,
    category: 'Pflanzen- und Naturtests',
  },
  farbtest: {
    title: 'Farbtest',
    moduleId: 10,
    category: 'Wasser- und Produkttests',
  },
  'farbtest-erklaerung': {
    title: 'Farbtest Erklärung',
    moduleId: 10,
    category: 'Wasser- und Produkttests',
  },
  kundenbestellung: {
    title: 'Kundenbestellung',
    moduleId: 6,
    category: 'Kundengewinnung',
  },
  partnerregistrierung: {
    title: 'Partnerregistrierung',
    moduleId: 9,
    category: 'Partneraufbau',
  },
};

function loadEnvFile(fileName) {
  return readFile(path.join(ROOT, fileName), 'utf8')
    .then((content) => {
      for (const line of content.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);

        if (!match || process.env[match[1]]) {
          continue;
        }

        const rawValue = match[2].trim();
        process.env[match[1]] = rawValue.replace(/^['"]|['"]$/g, '');
      }
    })
    .catch(() => {});
}

function slugToTitle(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function videoIdFromFile(fileName) {
  return fileName.replace(/\.mp4$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function formatTimestamp(seconds, separator = ',') {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const wholeSeconds = Math.floor(safeSeconds % 60);
  const milliseconds = Math.round((safeSeconds - Math.floor(safeSeconds)) * 1000);

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(wholeSeconds).padStart(2, '0'),
  ].join(':') + separator + String(milliseconds).padStart(3, '0');
}

function formatShortTime(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const wholeSeconds = Math.floor(safeSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(wholeSeconds).padStart(2, '0')}`;
}

function splitIntoSentences(text) {
  const cleaned = String(text || '').replace(/\s+/g, ' ').trim();

  if (!cleaned) {
    return [];
  }

  const matches = cleaned.match(/[^.!?。！？]+[.!?。！？]+|[^.!?。！？]+$/g);
  return (matches || [cleaned]).map((item) => item.trim()).filter(Boolean);
}

function sentenceSegments(rawSegments, fallbackText) {
  const sourceSegments = Array.isArray(rawSegments) && rawSegments.length > 0
    ? rawSegments
    : [{ start: 0, end: 8, text: fallbackText }];

  const result = [];

  for (const segment of sourceSegments) {
    const sentences = splitIntoSentences(segment.text);
    const start = Number(segment.start) || 0;
    const end = Math.max(start + 0.5, Number(segment.end) || start + 8);
    const duration = end - start;
    const totalChars = Math.max(1, sentences.reduce((sum, sentence) => sum + sentence.length, 0));
    let cursor = start;

    sentences.forEach((sentence, sentenceIndex) => {
      const isLast = sentenceIndex === sentences.length - 1;
      const span = isLast ? end - cursor : Math.max(0.5, duration * (sentence.length / totalChars));
      const nextEnd = isLast ? end : Math.min(end, cursor + span);

      result.push({
        index: result.length,
        start: Math.round(cursor * 1000) / 1000,
        end: Math.round(Math.max(cursor + 0.5, nextEnd) * 1000) / 1000,
        text: sentence,
      });
      cursor = nextEnd;
    });
  }

  return result;
}

function normalizeSegments(segments) {
  return segments.map((segment, index) => ({
    index,
    start: Number(segment.start) || 0,
    end: Math.max(Number(segment.start) + 0.5, Number(segment.end) || Number(segment.start) + 3),
    startLabel: formatShortTime(segment.start),
    endLabel: formatShortTime(segment.end),
    text: String(segment.text || '').replace(/\s+/g, ' ').trim(),
  })).filter((segment) => segment.text);
}

function escapeSubtitleText(value) {
  return String(value || '').replace(/-->/g, '->').replace(/\r?\n/g, ' ').trim();
}

function toSrt(segments) {
  return segments.map((segment, index) => [
    String(index + 1),
    `${formatTimestamp(segment.start, ',')} --> ${formatTimestamp(segment.end, ',')}`,
    escapeSubtitleText(segment.text),
    '',
  ].join('\n')).join('\n');
}

function toVtt(segments) {
  return `WEBVTT\n\n${segments.map((segment, index) => [
    String(index + 1),
    `${formatTimestamp(segment.start, '.')} --> ${formatTimestamp(segment.end, '.')}`,
    escapeSubtitleText(segment.text),
    '',
  ].join('\n')).join('\n')}`;
}

async function openaiFetch(endpoint, options) {
  const response = await fetch(`${OPENAI_API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${message.slice(0, 500)}`);
  }

  return response;
}

async function transcribeVideo(filePath, fileName) {
  const buffer = await readFile(filePath);
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: 'video/mp4' }), fileName);
  form.append('model', TRANSCRIPTION_MODEL);
  form.append('language', 'de');
  form.append('response_format', 'verbose_json');
  form.append('timestamp_granularities[]', 'segment');

  const response = await openaiFetch('/audio/transcriptions', {
    method: 'POST',
    body: form,
  });

  return response.json();
}

function extractJson(text) {
  const trimmed = String(text || '').trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error('Model response did not contain JSON.');
    }
    return JSON.parse(match[0]);
  }
}

async function translateAllLanguages(video, deSegments) {
  const transcriptPayload = deSegments.map((segment) => ({
    index: segment.index,
    text: segment.text,
  }));
  const languageList = LANGUAGES.map((language) => `${language.code}: ${language.name}`).join(', ');

  const body = {
    model: TRANSLATION_MODEL,
    temperature: 0.1,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You create professional multilingual subtitle translations for a closed business academy. Return only valid JSON. Keep brand names such as Harbor Global, Aqua Global, PPM and RXT consistent. Do not add markdown.',
      },
      {
        role: 'user',
        content: [
          `Video title: ${video.title}`,
          `Category: ${video.category || ''}`,
          `Translate the German transcript sentence by sentence into these languages: ${languageList}.`,
          'For each language, return the same segment count and the same index values.',
          'For de, preserve the German meaning and clean punctuation only if needed.',
          'Also create a concise professional summary in each language.',
          'JSON schema: {"languages":{"de":{"summary":"...","segments":[{"index":0,"text":"..."}]},"en":{...}}}',
          `Segments JSON: ${JSON.stringify(transcriptPayload)}`,
        ].join('\n'),
      },
    ],
  };

  const response = await openaiFetch('/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await response.json();
  return extractJson(json.choices?.[0]?.message?.content || '{}');
}

function buildLanguagePayload(video, language, deSegments, translationData, generatedAt) {
  const languageData = translationData?.languages?.[language.code] || {};
  const translatedSegments = Array.isArray(languageData.segments) ? languageData.segments : [];
  const byIndex = new Map(translatedSegments.map((segment) => [Number(segment.index), String(segment.text || '').trim()]));
  const segments = deSegments.map((segment) => ({
    ...segment,
    text: byIndex.get(segment.index) || segment.text,
  }));
  const transcript = segments.map((segment) => segment.text).join('\n');

  return {
    videoId: video.id,
    fileName: video.fileName,
    title: video.title,
    category: video.category,
    moduleId: video.moduleId,
    language: language.code,
    languageName: language.name,
    generatedAt,
    transcriptionModel: TRANSCRIPTION_MODEL,
    translationModel: TRANSLATION_MODEL,
    summary: String(languageData.summary || transcript.split('\n').slice(0, 4).join(' ')).trim(),
    transcript,
    segments,
  };
}

async function outputExists(videoId) {
  try {
    await access(path.join(OUTPUT_DIR, videoId, 'manifest.json'));
    return true;
  } catch {
    return false;
  }
}

async function processVideo(fileName) {
  const videoId = videoIdFromFile(fileName);
  const meta = VIDEO_META[videoId] || {};
  const video = {
    id: videoId,
    fileName,
    title: meta.title || slugToTitle(videoId),
    category: meta.category || 'Academy Video',
    moduleId: meta.moduleId || null,
  };
  const videoOutputDir = path.join(OUTPUT_DIR, videoId);

  if (!FORCE && await outputExists(videoId)) {
    console.log(`skip ${videoId} (already generated)`);
    return { ...video, skipped: true };
  }

  console.log(`transcribe ${videoId}`);
  await mkdir(videoOutputDir, { recursive: true });
  const transcription = await transcribeVideo(path.join(VIDEO_DIR, fileName), fileName);
  const deSegments = normalizeSegments(sentenceSegments(transcription.segments, transcription.text));
  const generatedAt = new Date().toISOString();

  await writeFile(path.join(videoOutputDir, 'openai-transcription.json'), JSON.stringify(transcription, null, 2), 'utf8');
  await writeFile(path.join(videoOutputDir, 'segments-de-source.json'), JSON.stringify(deSegments, null, 2), 'utf8');

  console.log(`translate ${videoId}`);
  const translationData = await translateAllLanguages(video, deSegments);

  for (const language of LANGUAGES) {
    const payload = buildLanguagePayload(video, language, deSegments, translationData, generatedAt);
    await writeFile(path.join(videoOutputDir, `${language.code}.json`), JSON.stringify(payload, null, 2), 'utf8');
    await writeFile(path.join(videoOutputDir, `${language.code}.srt`), toSrt(payload.segments), 'utf8');
    await writeFile(path.join(videoOutputDir, `${language.code}.vtt`), toVtt(payload.segments), 'utf8');
    await writeFile(path.join(videoOutputDir, `transcript-${language.code}.txt`), payload.transcript, 'utf8');
    await writeFile(path.join(videoOutputDir, `summary-${language.code}.txt`), payload.summary, 'utf8');
  }

  await writeFile(
    path.join(videoOutputDir, 'manifest.json'),
    JSON.stringify({
      ...video,
      generatedAt,
      languages: LANGUAGES.map((language) => language.code),
      segmentCount: deSegments.length,
    }, null, 2),
    'utf8',
  );

  return { ...video, skipped: false, segmentCount: deSegments.length };
}

async function main() {
  await loadEnvFile('.env.local');
  await loadEnvFile('.env');

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is missing. Add it to .env.local or the environment.');
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  const files = (await readdir(VIDEO_DIR))
    .filter((fileName) => fileName.toLowerCase().endsWith('.mp4'))
    .sort((left, right) => left.localeCompare(right, 'de'));
  const processed = [];

  for (const fileName of files) {
    processed.push(await processVideo(fileName));
  }

  await writeFile(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      languages: LANGUAGES,
      videos: processed,
    }, null, 2),
    'utf8',
  );

  console.log(`done ${processed.length} videos`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
