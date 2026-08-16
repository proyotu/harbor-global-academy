import assert from 'node:assert/strict';
import test from 'node:test';

import { getAcademyContentCatalog } from '../app/lib/academy-content.js';

const P1_VIDEO_IDS = [
  'mini-touch-aufbau-wassertank',
  'mini-touch-touchdisplay-wasserausgabe',
  'mini-touch-filterwechsel-wartung',
  'untertischanlage-bedienung-flush-wartung',
  'sparkling-pro-bedienung-systemaufbau',
];

test('P1 product videos have one canonical lesson each in module 3', () => {
  const catalog = getAcademyContentCatalog('de');
  const productModule = catalog.find((moduleItem) => moduleItem.id === 3);

  assert.ok(productModule);
  assert.deepEqual(productModule.resources.videos.slice(1), P1_VIDEO_IDS);
  assert.equal(productModule.lessons.filter((lesson) => P1_VIDEO_IDS.includes(lesson.resourceId)).length, 5);

  for (const videoId of P1_VIDEO_IDS) {
    const lessons = catalog.flatMap((moduleItem) => moduleItem.lessons).filter((lesson) => lesson.resourceId === videoId);
    assert.equal(lessons.length, 1, `${videoId} must occur in exactly one lesson`);
  }
});

test('P1 product lesson titles are complete in German and English', () => {
  const deModule = getAcademyContentCatalog('de').find((moduleItem) => moduleItem.id === 3);
  const enModule = getAcademyContentCatalog('en').find((moduleItem) => moduleItem.id === 3);

  for (const videoId of P1_VIDEO_IDS) {
    const de = deModule.lessons.find((lesson) => lesson.resourceId === videoId);
    const en = enModule.lessons.find((lesson) => lesson.resourceId === videoId);
    assert.ok(de?.title);
    assert.ok(en?.title);
    assert.notEqual(de.title, en.title);
  }
});

test('osmosis and PPM canonical placement remains unchanged', () => {
  const catalog = getAcademyContentCatalog('de');
  const osmosis = catalog.find((moduleItem) => moduleItem.id === 3).lessons.find((lesson) => lesson.resourceId === 'umkehrosmose-erklaerung');
  const ppm = catalog.find((moduleItem) => moduleItem.id === 10).lessons.find((lesson) => lesson.resourceId === 'ppm-bedeutung');

  assert.equal(osmosis.id, 'video-osmosis');
  assert.equal(ppm.id, 'video-ppm');
});
