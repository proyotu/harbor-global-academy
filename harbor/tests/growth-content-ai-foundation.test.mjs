import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { ACADEMY_VIDEO_ASSETS } from '../app/lib/academy-video-assets.js';
import {
  GROWTH_CONTENT_AI_BOUNDARIES,
  GROWTH_CONTENT_AI_LESSONS,
  GROWTH_CONTENT_AI_SOURCES,
  GROWTH_CONTENT_AI_TASKS,
  GROWTH_CONTENT_AI_TEMPLATES,
  GROWTH_CONTENT_CLASSIFICATIONS,
  GROWTH_CONTENT_PACKAGE_FIELDS,
  GROWTH_CONTENT_ROUTINE,
  GROWTH_CONTENT_VISIBILITY,
} from '../app/lib/growth-content-ai.js';
import { growthContentAiCopy } from '../components/growth-content-ai-copy.js';

test('P4 content IDs are unique and do not create Academy module entries', () => {
  assert.equal(new Set(GROWTH_CONTENT_AI_LESSONS.map((item) => item.id)).size, GROWTH_CONTENT_AI_LESSONS.length);
  assert.equal(new Set(GROWTH_CONTENT_AI_TEMPLATES.map((item) => item.id)).size, GROWTH_CONTENT_AI_TEMPLATES.length);
  assert.equal(new Set(GROWTH_CONTENT_AI_TASKS).size, GROWTH_CONTENT_AI_TASKS.length);
  assert.equal(GROWTH_CONTENT_AI_LESSONS.length, 8);
  assert.equal(GROWTH_CONTENT_AI_TEMPLATES.length, 8);
});

test('each P4 lesson and template has complete distinct DE and EN copy', () => {
  const required = new Set([
    'growthAiFoundation.title',
    'growthAiFoundation.safetyTitle',
    'growthAiFoundation.safetyText',
    'growthAiFoundation.templatesTitle',
    'growthAiFoundation.tasksTitle',
  ]);

  for (const lesson of GROWTH_CONTENT_AI_LESSONS) {
    required.add(`growthAiFoundation.${lesson.id}.title`);
    required.add(`growthAiFoundation.${lesson.id}.intro`);
    required.add(`growthAiFoundation.${lesson.id}.key`);
    lesson.steps.forEach((step) => required.add(`growthAiFoundation.${lesson.id}.step.${step}`));
  }

  for (const template of GROWTH_CONTENT_AI_TEMPLATES) {
    required.add(`growthAiFoundation.template.${template.id}.title`);
    required.add(`growthAiFoundation.template.${template.id}.purpose`);
    required.add(`growthAiFoundation.template.${template.id}.prompt`);
    required.add(`growthAiFoundation.difficulty.${template.difficulty}`);
    required.add(`growthAiFoundation.status.${template.complianceStatus}`);
  }

  for (const key of required) {
    assert.ok(growthContentAiCopy.de[key], `missing DE ${key}`);
    assert.ok(growthContentAiCopy.en[key], `missing EN ${key}`);
    if (key !== 'growthAiFoundation.content-factory.title') {
      assert.notEqual(growthContentAiCopy.de[key], growthContentAiCopy.en[key], `untranslated ${key}`);
    }
  }
});

test('template data uses the approved model and compliance statuses', () => {
  const allowedStatuses = new Set(['PARTNER_SAFE', 'OFFICIAL_SOURCE_REQUIRED', 'NEEDS_COMPLIANCE_REVIEW']);
  for (const template of GROWTH_CONTENT_AI_TEMPLATES) {
    assert.ok(template.id);
    assert.ok(template.category);
    assert.ok(template.difficulty);
    assert.ok(allowedStatuses.has(template.complianceStatus), template.id);
  }
  assert.ok(GROWTH_CONTENT_CLASSIFICATIONS.includes('NOT_PARTNER_RELEVANT'));
  assert.ok(GROWTH_CONTENT_VISIBILITY.includes('INTERNAL_ONLY'));
  assert.equal(GROWTH_CONTENT_PACKAGE_FIELDS.length, 7);
  assert.deepEqual(GROWTH_CONTENT_ROUTINE, ['IDEA', 'PREPARED', 'CREATED', 'READY', 'PUBLISHED']);
});

test('canonical boundaries prevent duplication and unsupported claims', () => {
  assert.equal(GROWTH_CONTENT_AI_BOUNDARIES.productFacts, 'MODULE_3');
  assert.equal(GROWTH_CONTENT_AI_BOUNDARIES.waterFacts, 'P2_WATER_KNOWLEDGE');
  assert.equal(GROWTH_CONTENT_AI_BOUNDARIES.sales, 'P3_SALES');
  assert.equal(GROWTH_CONTENT_AI_BOUNDARIES.recruiting, 'P3_RECRUITING');
  assert.equal(GROWTH_CONTENT_AI_BOUNDARIES.campaigns, 'CAMPAIGN_CENTER');
  assert.equal(GROWTH_CONTENT_AI_BOUNDARIES.mediaAssets, 'MEDIA_CENTER');
  assert.equal(GROWTH_CONTENT_AI_BOUNDARIES.prices, 'OFFICIAL_SOURCE_REQUIRED');
  assert.equal(GROWTH_CONTENT_AI_BOUNDARIES.healthClaims, 'DO_NOT_USE_AS_CLAIM');
  assert.equal(GROWTH_CONTENT_AI_BOUNDARIES.incomeClaims, 'DO_NOT_USE_AS_CLAIM');
});

test('prompt templates contain no fixed price, commission or campaign values', () => {
  const prompts = Object.entries(growthContentAiCopy.de)
    .filter(([key]) => key.endsWith('.prompt'))
    .map(([, value]) => value)
    .join('\n');

  assert.doesNotMatch(prompts, /\b\d+[.,]?\d*\s*(?:€|EUR|Prozent|%)\b/i);
  assert.doesNotMatch(prompts, /(?:Provision|Karrierelevel)\s*[:=]\s*\d/i);
  assert.doesNotMatch(prompts, /Black Friday|Sommeraktion|Weihnachtsaktion/i);
  assert.match(prompts, /OFFIZIELLE QUELLE ERFORDERLICH/);
});

test('internal technical sources remain excluded from partner content', () => {
  const technical = GROWTH_CONTENT_AI_SOURCES.find((source) => source.id === 'leonid-os-technical-agents');
  const master = GROWTH_CONTENT_AI_SOURCES.find((source) => source.id === 'master-instructions');
  assert.deepEqual(technical, {
    id: 'leonid-os-technical-agents',
    classification: 'NOT_PARTNER_RELEVANT',
    visibility: 'INTERNAL_ONLY',
  });
  assert.equal(master.classification, 'REFERENCE_ONLY');
  assert.equal(master.visibility, 'INTERNAL_ONLY');
});

test('P4 component is mobile-first, translated, accessible and non-persistent', async () => {
  const source = await readFile(new URL('../components/growth-content-ai-foundation.jsx', import.meta.url), 'utf8');
  assert.match(source, /grid-cols-2/);
  assert.match(source, /sm:grid-cols-4/);
  assert.match(source, /min-w-0/);
  assert.match(source, /break-words/);
  assert.match(source, /aria-live/);
  assert.match(source, /aria-pressed/);
  assert.match(source, /navigator\.clipboard\.writeText/);
  assert.match(source, /t\(`growthAiFoundation\./);
  assert.doesNotMatch(source, /fetch\(|axios|localStorage|sessionStorage|indexedDB|supabase|database/i);
});

test('P4 does not change the protected R2 video asset inventory', () => {
  const assets = Object.values(ACADEMY_VIDEO_ASSETS);
  assert.equal(assets.length, 20);
  assert.equal(assets.filter((asset) => asset.source === 'r2').length, 8);
  assert.equal(assets.filter((asset) => asset.source === 'local').length, 12);
  assert.ok(ACADEMY_VIDEO_ASSETS['umkehrosmose-erklaerung']);
  assert.ok(ACADEMY_VIDEO_ASSETS['ppm-bedeutung']);
});

test('P4 integration reuses the existing Growth Center without a new navigation item', async () => {
  const growthSource = await readFile(new URL('../components/growth-center.jsx', import.meta.url), 'utf8');
  const pageSource = await readFile(new URL('../app/page.jsx', import.meta.url), 'utf8');
  assert.match(growthSource, /<GrowthContentAiFoundation t=\{t\} \/>/);
  assert.equal((growthSource.match(/<GrowthContentAiFoundation/g) || []).length, 1);
  assert.doesNotMatch(pageSource, /growth-content-ai-foundation/);
  assert.doesNotMatch(pageSource, /p4-growth|growth-ai-module/i);
});
