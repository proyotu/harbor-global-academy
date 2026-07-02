import { readFile } from 'node:fs/promises';
import path from 'node:path';

const SUPPORTED_LANGUAGES = ['de', 'en', 'ro', 'ru', 'el', 'tr', 'it', 'cs', 'es', 'pl'];

const LANGUAGE_ALIASES = {
  gr: 'el',
  cz: 'cs',
};

const VIDEO_META = {
  'academy-welcome-placeholder': {
    title: 'Willkommensvideo / Onboarding',
    description: 'Einführung in die Harbor Global Partner Academy, die ersten Schritte und die sichere Nutzung des geschlossenen Partnerbereichs.',
    learningGoal: 'Partner verstehen den Start in der Academy und wissen, welche Bereiche zuerst wichtig sind.',
  },
  'wasser-ist-leben': {
    title: 'Wasser ist Leben',
    description: 'Grundlagen zur Bedeutung von Wasser, Wasserqualität und sauberer Beratung.',
    learningGoal: 'Partner verstehen Wasserqualität als Basis für jedes Kundengespräch.',
  },
  'allgemeine-ernaehrungsweise': {
    title: 'Allgemeine Ernährungsweise',
    description: 'Einordnung von Ernährung, Trinkgewohnheiten und Wasser im Alltag.',
    learningGoal: 'Partner erklären Wasser im Kontext einer bewussten Ernährungsweise.',
  },
  'funktionen-wasser-koerper': {
    title: 'Funktionen von Wasser im Körper',
    description: 'Schulung über zentrale Funktionen von Wasser im Körper und seriöse Gesprächsführung.',
    learningGoal: 'Partner erklären die Funktionen von Wasser sachlich und ohne überzogene Aussagen.',
  },
  mineralien: {
    title: 'Mineralien',
    description: 'Grundlagen zu Mineralien, Wasserwissen und häufigen Kundenfragen.',
    learningGoal: 'Partner ordnen Mineralienfragen ruhig und professionell ein.',
  },
  grenzwerte: {
    title: 'Grenzwerte',
    description: 'Schulung zu Grenzwerten, Messwerten und der richtigen Einordnung im Beratungsgespräch.',
    learningGoal: 'Partner verstehen Grenzwerte und vermeiden falsche Aussagen.',
  },
  'umkehrosmose-erklaerung': {
    title: 'Umkehrosmose Erklärung',
    description: 'Erklärung der Umkehrosmose und Membranfiltration als Aqua Global Filtrationstechnologie.',
    learningGoal: 'Partner erklären Umkehrosmose einfach, verständlich und seriös.',
  },
  'ppm-bedeutung': {
    title: 'PPM Bedeutung',
    description: 'Praxisvideo zur Bedeutung von PPM-Werten, Messung und verständlicher Erklärung.',
    learningGoal: 'Partner erklären PPM-Werte korrekt und ordnen Messwerte professionell ein.',
  },
  'membranfilter-vs-filterkanne': {
    title: 'Unterschied Membranfilter vs. Filterkanne',
    description: 'Vergleich zwischen Aqua Global Membranfiltration und einer herkömmlichen Filterkanne.',
    learningGoal: 'Partner erklären den Unterschied zwischen Membranfilter und Filterkanne klar und seriös.',
  },
  'tee-test': {
    title: 'Tee-Test',
    description: 'Zwei identische Tees werden mit Leitungswasser und Osmosewasser zubereitet.',
    learningGoal: 'Partner bereiten den Tee-Test ruhig vor und erklären sichtbare Unterschiede nachvollziehbar.',
  },
  'basilikum-test': {
    title: 'Basilikum-Test',
    description: 'Vergleich des Pflanzenwachstums bei Basilikum mit Aqua Global Osmosewasser und normalem Leitungswasser.',
    learningGoal: 'Partner dokumentieren Pflanzenvergleiche sauber als Langzeitbeobachtung.',
  },
  farbtest: {
    title: 'Farbtest',
    description: 'Praktische Demonstration eines Farbvergleichs für sichtbare Unterschiede im Wasser- und Produkttest.',
    learningGoal: 'Partner sehen, wie ein kurzer Farbtest vorbereitet und dokumentiert wird.',
  },
  'farbtest-erklaerung': {
    title: 'Farbtest Erklärung',
    description: 'Erklärung zum Farbtest mit Einordnung, Gesprächsführung und sauberer Aufklärung.',
    learningGoal: 'Partner erklären den Farbtest verständlich und vermeiden falsche Aussagen.',
  },
  kundenbestellung: {
    title: 'Kundenbestellung',
    description: 'Schritt-für-Schritt-Anleitung zur offiziellen Aqua Global Produktseite und zur Vorbereitung einer Bestellung.',
    learningGoal: 'Partner verstehen den Ablauf der Kundenbestellung über die offiziellen Aqua Global Wege.',
  },
  partnerregistrierung: {
    title: 'Partnerregistrierung',
    description: 'Anleitung, wie ein Aqua Global Partner über die offiziellen Aqua Global Prozesse registriert wird.',
    learningGoal: 'Partner trennen Academy-Zugang klar vom Aqua Global Backoffice und kennen den offiziellen Registrierungsweg.',
  },
};

const TRANSLATIONS = {
  de: {
    intro: (video) => `Willkommen zum Video "${video.title}".`,
    body: (video) => video.description,
    goal: (video) => `Lernziel: ${video.learningGoal}`,
    note: 'Dieses Video gehoert zur Harbor Global Academy Schulung. Nutze die Untertitel als ruhige Orientierung fuer Inhalt, Lernziel und Demonstration.',
  },
  en: {
    intro: (video) => `Welcome to the video "${video.title}".`,
    body: (video) => `This lesson explains: ${video.description}`,
    goal: (video) => `Learning goal: ${video.learningGoal}`,
    note: 'This video is part of Harbor Global Academy training. Use the subtitles as a clear guide for the content, learning goal, and demonstration.',
  },
  ro: {
    intro: (video) => `Bun venit la video-ul "${video.title}".`,
    body: (video) => `Această lecție explică: ${video.description}`,
    goal: (video) => `Obiectiv de învățare: ${video.learningGoal}`,
    note: 'Acest video face parte din instruirea Harbor Global Academy. Foloseste subtitrarea ca ghid clar pentru continut, obiectiv si demonstratie.',
  },
  ru: {
    intro: (video) => `Добро пожаловать к видео "${video.title}".`,
    body: (video) => `Этот урок объясняет: ${video.description}`,
    goal: (video) => `Цель обучения: ${video.learningGoal}`,
    note: 'Это видео является частью обучения Harbor Global Academy. Используй субтитры как понятный ориентир по содержанию, цели и демонстрации.',
  },
  el: {
    intro: (video) => `Καλώς ήρθες στο βίντεο "${video.title}".`,
    body: (video) => `Αυτό το μάθημα εξηγεί: ${video.description}`,
    goal: (video) => `Μαθησιακός στόχος: ${video.learningGoal}`,
    note: 'Αυτό το βίντεο ανήκει στην εκπαίδευση Harbor Global Academy. Χρησιμοποίησε τους υπότιτλους ως καθαρό οδηγό για περιεχόμενο, στόχο και επίδειξη.',
  },
  tr: {
    intro: (video) => `"${video.title}" videosuna hoş geldin.`,
    body: (video) => `Bu ders şunu açıklar: ${video.description}`,
    goal: (video) => `Öğrenme hedefi: ${video.learningGoal}`,
    note: 'Bu video Harbor Global Academy egitiminin bir parcasidir. Altyazilari icerik, hedef ve demonstrasyon icin net bir rehber olarak kullan.',
  },
  it: {
    intro: (video) => `Benvenuto al video "${video.title}".`,
    body: (video) => `Questa lezione spiega: ${video.description}`,
    goal: (video) => `Obiettivo formativo: ${video.learningGoal}`,
    note: 'Questo video fa parte della formazione Harbor Global Academy. Usa i sottotitoli come guida chiara per contenuto, obiettivo e dimostrazione.',
  },
  cs: {
    intro: (video) => `Vítej u videa "${video.title}".`,
    body: (video) => `Tato lekce vysvětluje: ${video.description}`,
    goal: (video) => `Cíl učení: ${video.learningGoal}`,
    note: 'Toto video je soucasti skoleni Harbor Global Academy. Titulky slouzi jako jasny pruvodce obsahem, cilem a demonstraci.',
  },
  es: {
    intro: (video) => `Bienvenido al video "${video.title}".`,
    body: (video) => `Esta lección explica: ${video.description}`,
    goal: (video) => `Objetivo de aprendizaje: ${video.learningGoal}`,
    note: 'Este video forma parte de la formacion Harbor Global Academy. Usa los subtitulos como guia clara del contenido, objetivo y demostracion.',
  },
  pl: {
    intro: (video) => `Witamy w filmie "${video.title}".`,
    body: (video) => `Ta lekcja wyjaśnia: ${video.description}`,
    goal: (video) => `Cel szkolenia: ${video.learningGoal}`,
    note: 'To wideo jest czescia szkolenia Harbor Global Academy. Napisy sluza jako jasny przewodnik po tresci, celu i demonstracji.',
  },
};

function cleanVttText(value) {
  return String(value || '')
    .replace(/-->/g, '->')
    .replace(/\r?\n/g, ' ')
    .trim();
}

function buildVtt(video, languageCode) {
  const labels = TRANSLATIONS[languageCode] || TRANSLATIONS.de;
  const cues = [
    { start: '00:00:00.000', end: '00:00:08.000', text: labels.intro(video) },
    { start: '00:00:08.000', end: '00:00:20.000', text: labels.body(video) },
    { start: '00:00:20.000', end: '00:00:32.000', text: labels.goal(video) },
    { start: '00:00:32.000', end: '00:00:42.000', text: labels.note },
  ];

  return [
    'WEBVTT',
    '',
    ...cues.flatMap((cue, index) => [
      String(index + 1),
      `${cue.start} --> ${cue.end}`,
      cleanVttText(cue.text),
      '',
    ]),
  ].join('\n');
}

function safePathSegment(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}

export async function GET(request, { params }) {
  const { videoId, file } = await params;
  const rawCode = String(file || '').replace(/\.vtt$/i, '').toLowerCase();
  const languageCode = LANGUAGE_ALIASES[rawCode] || rawCode;
  const decodedVideoId = decodeURIComponent(videoId || '');
  const safeVideoId = safePathSegment(decodedVideoId);
  const video = VIDEO_META[decodedVideoId] || VIDEO_META[safeVideoId];

  if (!safeVideoId || !SUPPORTED_LANGUAGES.includes(languageCode)) {
    return new Response('WEBVTT\n\n', {
      status: 404,
      headers: {
        'Content-Type': 'text/vtt; charset=utf-8',
      },
    });
  }

  const generatedVttPath = path.join(
    process.cwd(),
    'public',
    'academy-transcripts',
    safeVideoId,
    `${languageCode}.vtt`,
  );

  try {
    const generatedVtt = await readFile(generatedVttPath, 'utf8');

    return new Response(generatedVtt, {
      headers: {
        'Content-Type': 'text/vtt; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    // Fall through to metadata-based fallback while new videos are waiting for transcription.
  }

  if (!video) {
    return new Response('WEBVTT\n\n', {
      status: 404,
      headers: {
        'Content-Type': 'text/vtt; charset=utf-8',
      },
    });
  }

  return new Response(buildVtt(video, languageCode), {
    headers: {
      'Content-Type': 'text/vtt; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
