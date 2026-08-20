import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  ACADEMY_CONTENT_CATALOG,
  ACADEMY_QUIZ_CATALOG,
  getAcademyContentCatalog,
} from '../app/lib/academy-content.js';
import {
  HYDROGEN_BOTTLE_CONTENT_READINESS,
  WATER_CLAIM_CLASSIFICATIONS,
  WATER_KNOWLEDGE_DEFINITIONS,
  WATER_KNOWLEDGE_QUIZ_BLUEPRINT,
  getWaterKnowledgeDefinition,
} from '../app/lib/water-knowledge.js';
import { i18nExtensionLabelsByCode } from '../components/i18n-extension.js';

const REQUIRED_TRANSLATION_KEYS = [
  'waterKnowledge.eyebrow',
  'waterKnowledge.classification.EDUCATIONAL',
  'waterKnowledge.water-foundations.title',
  'waterKnowledge.water-foundations.intro',
  'waterKnowledge.reverse-osmosis.title',
  'waterKnowledge.reverse-osmosis.intro',
  'waterKnowledge.ppm-tds.title',
  'waterKnowledge.ppm-tds.intro',
  'waterKnowledge.foundation.water.title',
  'waterKnowledge.foundation.water.text',
  'waterKnowledge.foundation.hydrogen.title',
  'waterKnowledge.foundation.hydrogen.text',
  'waterKnowledge.foundation.electrolytes.title',
  'waterKnowledge.foundation.electrolytes.text',
  'waterKnowledge.foundation.minerals.title',
  'waterKnowledge.foundation.minerals.text',
  'waterKnowledge.electrolysis.title',
  'waterKnowledge.electrolysis.text',
  'waterKnowledge.electrolysis.boundary',
  'waterKnowledge.compliance.title',
  'waterKnowledge.compliance.text',
  'waterKnowledge.hydrogenBottle.title',
  'waterKnowledge.hydrogenBottle.text',
  'waterKnowledge.officialSourceRequired',
  'waterKnowledge.ppm.showsTitle',
  'waterKnowledge.ppm.notShowsTitle',
  'waterKnowledge.ppm.notShows.totalQuality',
  'waterKnowledge.safeLanguage.betterOsmosis',
  'waterKnowledge.safeLanguage.betterPpm',
  'waterKnowledge.safeLanguage.avoidHealing',
  'waterKnowledge.safeLanguage.avoidAbsolute',
  'waterKnowledge.safeLanguage.avoidPpm',
];

test('P2 enriches only the existing canonical water lessons', () => {
  const catalog = getAcademyContentCatalog('de');
  const lessons = catalog.flatMap((moduleItem) => moduleItem.lessons.map((lesson) => ({ ...lesson, moduleId: moduleItem.id })));
  const enriched = lessons.filter((lesson) => lesson.knowledgeId);

  assert.deepEqual(
    enriched.map(({ moduleId, id, resourceId, knowledgeId }) => ({ moduleId, id, resourceId, knowledgeId })),
    [
      { moduleId: 2, id: 'basics-overview', resourceId: undefined, knowledgeId: 'water-foundations' },
      { moduleId: 3, id: 'video-osmosis', resourceId: 'umkehrosmose-erklaerung', knowledgeId: 'reverse-osmosis' },
      { moduleId: 10, id: 'video-ppm', resourceId: 'ppm-bedeutung', knowledgeId: 'ppm-tds' },
    ],
  );

  assert.equal(lessons.filter((lesson) => lesson.resourceId === 'umkehrosmose-erklaerung').length, 1);
  assert.equal(lessons.filter((lesson) => lesson.resourceId === 'ppm-bedeutung').length, 1);
});

test('water knowledge registry points to the same canonical lesson IDs', () => {
  for (const definition of Object.values(WATER_KNOWLEDGE_DEFINITIONS)) {
    const moduleItem = ACADEMY_CONTENT_CATALOG.find((candidate) => candidate.id === definition.canonicalModuleId);
    assert.ok(moduleItem, `${definition.id} module must exist`);
    assert.ok(moduleItem.lessons.some((lesson) => lesson.id === definition.canonicalLessonId), `${definition.id} lesson must exist`);
    assert.equal(getWaterKnowledgeDefinition(definition.id), definition);
  }

  assert.equal(getWaterKnowledgeDefinition('unknown'), null);
  assert.deepEqual(WATER_CLAIM_CLASSIFICATIONS, [
    'CONFIRMED',
    'EDUCATIONAL',
    'REFERENCE',
    'REQUIRES_REVIEW',
    'DO_NOT_USE_AS_CLAIM',
  ]);
});

test('Hydrogen Bottle remains blocked until an official product source exists', () => {
  assert.equal(HYDROGEN_BOTTLE_CONTENT_READINESS.status, 'OFFICIAL_SOURCE_REQUIRED');
  assert.equal(HYDROGEN_BOTTLE_CONTENT_READINESS.publishable, false);
  assert.deepEqual(HYDROGEN_BOTTLE_CONTENT_READINESS.blockedFields, [
    'hydrogenConcentration',
    'cycleDuration',
    'electrolysisTechnology',
    'certifications',
    'healthEffects',
  ]);
});

test('P2 visible copy has complete and distinct German and English translations', () => {
  for (const key of REQUIRED_TRANSLATION_KEYS) {
    assert.equal(typeof i18nExtensionLabelsByCode.de[key], 'string', `${key} needs German copy`);
    assert.ok(i18nExtensionLabelsByCode.de[key].trim(), `${key} German copy must not be empty`);
    assert.equal(typeof i18nExtensionLabelsByCode.en[key], 'string', `${key} needs English copy`);
    assert.ok(i18nExtensionLabelsByCode.en[key].trim(), `${key} English copy must not be empty`);
    assert.notEqual(i18nExtensionLabelsByCode.de[key], i18nExtensionLabelsByCode.en[key], `${key} must not use the German fallback in English`);
  }
});

test('quiz preparation does not change the active quiz or certificate catalog', () => {
  const activeQuizIds = new Set(ACADEMY_QUIZ_CATALOG.map((question) => question.id));

  for (const blueprintId of WATER_KNOWLEDGE_QUIZ_BLUEPRINT) {
    assert.equal(activeQuizIds.has(blueprintId), false, `${blueprintId} must remain a TODO`);
  }
});

test('water UI is integrated through the existing translator and carries mobile-safe layout guards', async () => {
  const [pageSource, componentSource] = await Promise.all([
    readFile(new URL('../app/page.jsx', import.meta.url), 'utf8'),
    readFile(new URL('../components/water-knowledge.jsx', import.meta.url), 'utf8'),
  ]);

  assert.match(pageSource, /<WaterKnowledgePanel knowledgeId=\{lesson\.knowledgeId\} t=\{t\}/);
  assert.match(componentSource, /sm:grid-cols-2/);
  assert.match(componentSource, /lg:grid-cols-2/);
  assert.doesNotMatch(componentSource, /overflow-x-auto|whitespace-nowrap/);
  assert.match(componentSource, /aria-labelledby=/);
  assert.match(componentSource, /aria-hidden="true"/);
  assert.match(componentSource, /t\(`waterKnowledge\./);
});
