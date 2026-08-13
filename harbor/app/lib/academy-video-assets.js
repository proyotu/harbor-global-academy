const VIDEO_CONTENT_TYPE = 'video/mp4';

const localVideo = (id, fileName) => Object.freeze({
  id,
  source: 'local',
  storageKey: fileName,
  contentType: VIDEO_CONTENT_TYPE,
});

const r2Video = (id, storageKey) => Object.freeze({
  id,
  source: 'r2',
  storageKey,
  contentType: VIDEO_CONTENT_TYPE,
});

export const ACADEMY_VIDEO_ASSETS = Object.freeze({
  'academy-r2-e2e-test': r2Video('academy-r2-e2e-test', 'academy/test/r2-e2e/academy_r2_e2e_test_v1.mp4'),
  'wasser-ist-leben': localVideo('wasser-ist-leben', 'wasser-ist-leben.mp4'),
  'allgemeine-ernaehrungsweise': localVideo('allgemeine-ernaehrungsweise', 'allgemeine-ernaehrungsweise.mp4'),
  'funktionen-wasser-koerper': localVideo('funktionen-wasser-koerper', 'funktionen-von-wasser-im-koerper.mp4'),
  mineralien: localVideo('mineralien', 'mineralien.mp4'),
  grenzwerte: localVideo('grenzwerte', 'grenzwerte.mp4'),
  'umkehrosmose-erklaerung': r2Video('umkehrosmose-erklaerung', 'academy/videos/de/m03/umkehrosmose-erklaerung/v2/academy_m03_l02_umkehrosmose-erklaerung_de_approved_v2_20260801.mp4'),
  'ppm-bedeutung': r2Video('ppm-bedeutung', 'academy/videos/de/m10/ppm-bedeutung/v2/academy_m10_l02_ppm-bedeutung_de_approved_v2_20260805.mp4'),
  'membranfilter-vs-filterkanne': localVideo('membranfilter-vs-filterkanne', 'membranfilter-vs-filterkanne.mp4'),
  'tee-test': localVideo('tee-test', 'tee-test.mp4'),
  'basilikum-test': localVideo('basilikum-test', 'basilikum-test.mp4'),
  farbtest: localVideo('farbtest', 'farbtest.mp4'),
  'farbtest-erklaerung': localVideo('farbtest-erklaerung', 'farbtest-erklaerung.mp4'),
  kundenbestellung: localVideo('kundenbestellung', 'kundenbestellung.mp4'),
  partnerregistrierung: localVideo('partnerregistrierung', 'partnerregistrierung.mp4'),
});

const VIDEO_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LEGACY_FILE_TO_VIDEO_ID = new Map(
  Object.values(ACADEMY_VIDEO_ASSETS).map((asset) => [asset.storageKey, asset.id]),
);

export function isValidAcademyVideoId(value) {
  return VIDEO_ID_PATTERN.test(String(value || '').trim());
}

export function resolveAcademyVideoAsset({ videoId, legacyFile } = {}) {
  const requestedVideoId = String(videoId || '').trim();

  if (requestedVideoId) {
    if (!isValidAcademyVideoId(requestedVideoId)) {
      throw Object.assign(new Error('Video-ID ist ungueltig.'), { statusCode: 400 });
    }

    return ACADEMY_VIDEO_ASSETS[requestedVideoId] || null;
  }

  const requestedFile = String(legacyFile || '').trim();

  if (!requestedFile) {
    throw Object.assign(new Error('Video-ID fehlt.'), { statusCode: 400 });
  }

  if (requestedFile.includes('/') || requestedFile.includes('\\') || requestedFile.includes('\0')) {
    throw Object.assign(new Error('Video-ID ist ungueltig.'), { statusCode: 400 });
  }

  const resolvedId = LEGACY_FILE_TO_VIDEO_ID.get(requestedFile);
  return resolvedId ? ACADEMY_VIDEO_ASSETS[resolvedId] : null;
}
