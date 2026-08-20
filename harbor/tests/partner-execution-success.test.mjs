import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { ACADEMY_VIDEO_ASSETS } from '../app/lib/academy-video-assets.js';
import {
  PARTNER_EXECUTION_AUTOMATION_HOOKS,
  PARTNER_EXECUTION_PRIORITIES,
  PARTNER_EXECUTION_SOURCES,
  buildPartnerExecutionModel,
  partnerExecutionTasks,
  partnerNextActionRules,
  partnerWeeklyFocus,
} from '../app/lib/partner-execution.js';
import { partnerExecutionCopy } from '../components/partner-execution-copy.js';

const baseData = {
  progress: 35,
  onboarding: { isComplete: true },
  academySummary: { completedCount: 2 },
  unreadContentCount: 0,
  leader: { teamCount: 4, newPartners: 1, activity: 'ACTIVE' },
};

test('P5 task IDs and next-action rules are unique and centrally sourced', () => {
  assert.equal(new Set(partnerExecutionTasks.map(({ id }) => id)).size, partnerExecutionTasks.length);
  assert.equal(new Set(partnerWeeklyFocus.map(({ id }) => id)).size, partnerWeeklyFocus.length);
  assert.equal(new Set(partnerNextActionRules.map(({ id }) => id)).size, partnerNextActionRules.length);
  assert.equal(new Set(partnerNextActionRules.map(({ order }) => order)).size, partnerNextActionRules.length);
  partnerExecutionTasks.forEach((item) => {
    assert.ok(PARTNER_EXECUTION_SOURCES.includes(item.source), item.id);
    assert.ok(PARTNER_EXECUTION_PRIORITIES.includes(item.priority), item.id);
  });
});

test('Daily Focus is capped at three items and Weekly Focus at five', () => {
  const model = buildPartnerExecutionModel({ data: baseData, partner: {} });
  assert.equal(model.dailyFocus.length, 3);
  assert.ok(model.weeklyFocus.length <= 5);
  assert.equal(new Set(model.dailyFocus.map(({ id }) => id)).size, model.dailyFocus.length);
});

test('P5 uses the existing progress source without a second persistence layer', () => {
  const model = buildPartnerExecutionModel({ data: baseData, partner: {} });
  assert.equal(model.progress, 35);
  assert.equal(model.persistence, 'NONE');
  assert.equal(model.weeklyReview.implementationStatus, 'NOT_PERSISTED');
  assert.ok(partnerExecutionTasks.every(({ statusMode }) => statusMode === 'UI_ONLY'));
});

test('P5 DE and EN translation keys are complete and translated', () => {
  const required = new Set([
    'partnerExecution.title',
    'partnerExecution.dailyTitle',
    'partnerExecution.weeklyTitle',
    'partnerExecution.practiceTitle',
    'partnerExecution.nextTitle',
    'partnerExecution.dashboardTeaserTitle',
  ]);
  for (const task of partnerExecutionTasks) {
    required.add(`partnerExecution.task.${task.id}.title`);
    required.add(`partnerExecution.task.${task.id}.text`);
    required.add(`partnerExecution.source.${task.source}`);
  }
  for (const item of partnerWeeklyFocus) {
    required.add(`partnerExecution.weekly.${item.id}.title`);
    required.add(`partnerExecution.weekly.${item.id}.text`);
  }
  for (const rule of partnerNextActionRules) {
    required.add(`partnerExecution.next.${rule.id}.title`);
    required.add(`partnerExecution.next.${rule.id}.text`);
  }
  for (const key of required) {
    assert.ok(partnerExecutionCopy.de[key], `missing DE ${key}`);
    assert.ok(partnerExecutionCopy.en[key], `missing EN ${key}`);
    if (!key.startsWith('partnerExecution.source.')) {
      assert.notEqual(partnerExecutionCopy.de[key], partnerExecutionCopy.en[key], `untranslated ${key}`);
    }
  }
});

test('P5 challenge IDs do not duplicate canonical P0, P3, or P4 task IDs', () => {
  const canonicalIds = new Set(['welcome', 'academy', 'profile', 'module', 'leader', 'meeting', 'sales-needs', 'sales-objection', 'recruiting-outreach', 'content-ideas', 'content-hook', 'content-reel', 'content-story', 'content-product', 'content-week']);
  assert.ok(partnerExecutionTasks.every(({ id }) => !canonicalIds.has(id)));
  assert.ok(partnerExecutionTasks.every(({ id }) => id.startsWith('practice-')));
});

test('Leader view exposes only safe aggregates', () => {
  const summary = buildPartnerExecutionModel({ data: baseData, partner: {} }).leaderSummary;
  assert.deepEqual(Object.keys(summary).sort(), ['activity', 'includesPersonalNotes', 'includesSensitiveProfile', 'newPartners', 'scope', 'teamCount'].sort());
  assert.equal(summary.scope, 'AGGREGATE_ONLY');
  assert.equal(summary.includesPersonalNotes, false);
  assert.equal(summary.includesSensitiveProfile, false);
  for (const forbidden of ['name', 'email', 'phone', 'privateNote', 'healthData', 'score']) assert.ok(!(forbidden in summary));
});

test('P5 files contain no backend persistence, hidden analytics, or black-box score', async () => {
  const [config, component] = await Promise.all([
    readFile(new URL('../app/lib/partner-execution.js', import.meta.url), 'utf8'),
    readFile(new URL('../components/partner-execution-success.jsx', import.meta.url), 'utf8'),
  ]);
  const source = `${config}\n${component}`;
  assert.doesNotMatch(source, /fetch\s*\(|localStorage|sessionStorage|supabase|partner score|streak/i);
  assert.doesNotMatch(source, /api\//i);
});

test('Dashboard points to the canonical Success Center instead of rendering a second task list', async () => {
  const page = await readFile(new URL('../app/page.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(page, /const todayTasks\s*=/);
  assert.match(page, /partnerExecution\.openSuccessCenter/);
  assert.match(page, /onNavigate\?\.\('success'\)/);
});

test('P5 does not change video delivery, auth, database, or automation infrastructure', () => {
  assert.equal(Object.keys(ACADEMY_VIDEO_ASSETS).length, 20);
  assert.ok(PARTNER_EXECUTION_AUTOMATION_HOOKS.every((hook) => hook.startsWith('execution.')));
  const model = buildPartnerExecutionModel({ data: baseData, partner: {} });
  assert.equal(model.persistence, 'NONE');
});
