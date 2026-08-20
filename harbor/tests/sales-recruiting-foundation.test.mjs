import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  ACADEMY_CONTENT_CATALOG,
  getAcademyContentCatalog,
} from '../app/lib/academy-content.js';
import {
  SALES_RECRUITING_DEFINITIONS,
  SALES_RECRUITING_QUIZ_STATUS,
  SALES_RECRUITING_SOURCE_BOUNDARIES,
} from '../app/lib/sales-recruiting-foundation.js';
import { salesRecruitingCopy } from '../components/sales-recruiting-copy.js';

const definitions = Object.values(SALES_RECRUITING_DEFINITIONS);

test('P3 uses only the existing canonical sales and partner-building modules', () => {
  assert.deepEqual([...new Set(definitions.map((item) => item.canonicalModuleId))].sort(), [6, 9]);

  for (const definition of definitions) {
    const moduleItem = ACADEMY_CONTENT_CATALOG.find((candidate) => candidate.id === definition.canonicalModuleId);
    const matchingLessons = moduleItem.lessons.filter((lesson) => lesson.id === definition.canonicalLessonId);
    assert.equal(matchingLessons.length, 1, definition.id);
    assert.equal(matchingLessons[0].foundationId, definition.id);
  }
});

test('the official order and registration videos remain unique and unchanged', () => {
  const lessons = ACADEMY_CONTENT_CATALOG.flatMap((moduleItem) => moduleItem.lessons);
  assert.equal(lessons.filter((lesson) => lesson.resourceId === 'kundenbestellung').length, 1);
  assert.equal(lessons.filter((lesson) => lesson.resourceId === 'partnerregistrierung').length, 1);
  assert.equal(lessons.find((lesson) => lesson.resourceId === 'kundenbestellung')?.id, 'video-customer-order');
  assert.equal(lessons.find((lesson) => lesson.resourceId === 'partnerregistrierung')?.id, 'video-partner-registration');
});

test('all P3 definitions have complete and distinct DE/EN visible copy', () => {
  const requiredKeys = new Set([
    'salesRecruiting.doTitle',
    'salesRecruiting.dontTitle',
    'salesRecruiting.practiceTitle',
    'salesRecruiting.practiceBoundary',
  ]);

  for (const definition of definitions) {
    requiredKeys.add(`salesRecruiting.${definition.id}.title`);
    requiredKeys.add(`salesRecruiting.${definition.id}.intro`);
    requiredKeys.add(`salesRecruiting.${definition.id}.do`);
    requiredKeys.add(`salesRecruiting.${definition.id}.dont`);
    requiredKeys.add(`salesRecruiting.task.${definition.taskId}`);
    definition.steps.forEach((step) => requiredKeys.add(`salesRecruiting.${definition.id}.step.${step}`));
    if (definition.referenceId) requiredKeys.add(`salesRecruiting.reference.${definition.referenceId}`);
    if (definition.scriptId) requiredKeys.add(`salesRecruiting.script.${definition.scriptId}`);
  }

  for (const key of requiredKeys) {
    assert.ok(salesRecruitingCopy.de[key], `missing DE ${key}`);
    assert.ok(salesRecruitingCopy.en[key], `missing EN ${key}`);
    assert.notEqual(salesRecruitingCopy.de[key], salesRecruitingCopy.en[key], `untranslated ${key}`);
  }
});

test('academy lesson navigation titles are localized in DE and EN', () => {
  const de = getAcademyContentCatalog('de');
  const en = getAcademyContentCatalog('en');

  for (const definition of definitions) {
    const deTitle = de.find((item) => item.id === definition.canonicalModuleId).lessons.find((lesson) => lesson.id === definition.canonicalLessonId).title;
    const enTitle = en.find((item) => item.id === definition.canonicalModuleId).lessons.find((lesson) => lesson.id === definition.canonicalLessonId).title;
    assert.ok(deTitle);
    assert.ok(enTitle);
    assert.notEqual(deTitle, enTitle);
  }
});

test('financial, campaign and product data stay behind explicit source boundaries', () => {
  assert.equal(SALES_RECRUITING_SOURCE_BOUNDARIES.prices, 'OFFICIAL_SOURCE_REQUIRED');
  assert.equal(SALES_RECRUITING_SOURCE_BOUNDARIES.commissions, 'OFFICIAL_SOURCE_REQUIRED');
  assert.equal(SALES_RECRUITING_SOURCE_BOUNDARIES.careerLevels, 'OFFICIAL_SOURCE_REQUIRED');
  assert.equal(SALES_RECRUITING_SOURCE_BOUNDARIES.campaignTerms, 'OFFICIAL_SOURCE_REQUIRED');
  assert.equal(SALES_RECRUITING_SOURCE_BOUNDARIES.productClaims, 'OFFICIAL_SOURCE_REQUIRED');
  assert.equal(SALES_RECRUITING_SOURCE_BOUNDARIES.incomeExamples, 'DO_NOT_USE_AS_CLAIM');
  assert.equal(SALES_RECRUITING_SOURCE_BOUNDARIES.successRates, 'DO_NOT_USE_AS_CLAIM');
});

test('quiz expansion remains a non-persistent TODO', () => {
  assert.equal(SALES_RECRUITING_QUIZ_STATUS.status, 'QUIZ_TODO');
  assert.equal(SALES_RECRUITING_QUIZ_STATUS.backendRequired, false);
  assert.equal(ACADEMY_CONTENT_CATALOG.find((item) => item.id === 6).resources.quizzes.join(','), 'q-customer-order');
  assert.equal(ACADEMY_CONTENT_CATALOG.find((item) => item.id === 9).resources.quizzes.join(','), 'q-partner-build');
});

test('P3 component is mobile-first, translated and does not expose automation controls', async () => {
  const source = await readFile(new URL('../components/sales-recruiting-foundation.jsx', import.meta.url), 'utf8');
  assert.match(source, /sm:grid-cols-2/);
  assert.match(source, /min-w-0/);
  assert.match(source, /break-words/);
  assert.match(source, /aria-labelledby/);
  assert.match(source, /t\(`salesRecruiting\./);
  assert.doesNotMatch(source, /fetch\(|axios|sendMessage|whatsapp:\/\//i);
});
