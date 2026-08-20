export const PARTNER_EXECUTION_SOURCES = Object.freeze([
  'P0_ONBOARDING',
  'P1_PRODUCT',
  'P2_WATER',
  'P3_SALES',
  'P3_RECRUITING',
  'P4_CONTENT',
  'CAMPAIGN',
  'LEADER',
  'SYSTEM',
]);

export const PARTNER_EXECUTION_PRIORITIES = Object.freeze(['LOW', 'NORMAL', 'HIGH']);
export const PARTNER_EXECUTION_STATUSES = Object.freeze(['OPEN', 'IN_PROGRESS', 'DONE']);

export const partnerExecutionTasks = Object.freeze([
  Object.freeze({ id: 'practice-product-60', source: 'P1_PRODUCT', category: 'product', target: 'modules', priority: 'NORMAL', requiresProgress: 0, statusMode: 'UI_ONLY' }),
  Object.freeze({ id: 'practice-product-benefits', source: 'P1_PRODUCT', category: 'product', target: 'modules', priority: 'NORMAL', requiresProgress: 0, statusMode: 'UI_ONLY' }),
  Object.freeze({ id: 'practice-water-ppm', source: 'P2_WATER', category: 'water', target: 'testlab', priority: 'NORMAL', requiresProgress: 0, statusMode: 'UI_ONLY' }),
  Object.freeze({ id: 'practice-water-h2', source: 'P2_WATER', category: 'water', target: 'modules', priority: 'NORMAL', requiresProgress: 0, statusMode: 'UI_ONLY' }),
  Object.freeze({ id: 'practice-sales-needs', source: 'P3_SALES', category: 'sales', target: 'modules', priority: 'NORMAL', requiresProgress: 1, statusMode: 'UI_ONLY' }),
  Object.freeze({ id: 'practice-sales-objection', source: 'P3_SALES', category: 'sales', target: 'modules', priority: 'NORMAL', requiresProgress: 1, statusMode: 'UI_ONLY' }),
  Object.freeze({ id: 'practice-recruiting-outreach', source: 'P3_RECRUITING', category: 'recruiting', target: 'modules', priority: 'NORMAL', requiresProgress: 1, statusMode: 'UI_ONLY' }),
  Object.freeze({ id: 'practice-content-hook', source: 'P4_CONTENT', category: 'content', target: 'growth', priority: 'NORMAL', requiresProgress: 1, statusMode: 'UI_ONLY' }),
  Object.freeze({ id: 'practice-content-reel', source: 'P4_CONTENT', category: 'content', target: 'growth', priority: 'NORMAL', requiresProgress: 1, statusMode: 'UI_ONLY' }),
  Object.freeze({ id: 'practice-content-status', source: 'P4_CONTENT', category: 'content', target: 'growth', priority: 'NORMAL', requiresProgress: 1, statusMode: 'UI_ONLY' }),
]);

export const partnerWeeklyFocus = Object.freeze([
  Object.freeze({ id: 'weekly-learning', source: 'SYSTEM', category: 'learning', target: 'modules', priority: 'HIGH', statusMode: 'DERIVED' }),
  Object.freeze({ id: 'weekly-customer', source: 'P3_SALES', category: 'customer', target: 'modules', priority: 'NORMAL', statusMode: 'UI_ONLY' }),
  Object.freeze({ id: 'weekly-follow-up', source: 'P3_SALES', category: 'follow-up', target: 'modules', priority: 'NORMAL', statusMode: 'UI_ONLY' }),
  Object.freeze({ id: 'weekly-content', source: 'P4_CONTENT', category: 'content', target: 'growth', priority: 'NORMAL', statusMode: 'UI_ONLY' }),
  Object.freeze({ id: 'weekly-support', source: 'LEADER', category: 'team', target: 'contact', priority: 'LOW', statusMode: 'DERIVED' }),
]);

export const partnerNextActionRules = Object.freeze([
  Object.freeze({ id: 'continue-onboarding', order: 1, source: 'P0_ONBOARDING', condition: 'ONBOARDING_INCOMPLETE', target: 'start', priority: 'HIGH' }),
  Object.freeze({ id: 'start-product-practice', order: 2, source: 'P1_PRODUCT', condition: 'PRODUCT_NOT_REACHED', target: 'modules', priority: 'HIGH' }),
  Object.freeze({ id: 'continue-academy', order: 3, source: 'SYSTEM', condition: 'ACADEMY_INCOMPLETE', target: 'modules', priority: 'HIGH' }),
  Object.freeze({ id: 'apply-sales', order: 4, source: 'P3_SALES', condition: 'ACADEMY_COMPLETE', target: 'modules', priority: 'NORMAL' }),
  Object.freeze({ id: 'create-content', order: 5, source: 'P4_CONTENT', condition: 'FALLBACK', target: 'growth', priority: 'NORMAL' }),
]);

export const PARTNER_EXECUTION_NOTIFICATION_HOOKS = Object.freeze([
  Object.freeze({ id: 'daily-focus', event: 'execution.daily.focus', status: 'BLUEPRINT_ONLY' }),
  Object.freeze({ id: 'weekly-focus', event: 'execution.week.started', status: 'BLUEPRINT_ONLY' }),
  Object.freeze({ id: 'module-completed', event: 'academy.module.completed', status: 'EXISTING_SOURCE_REQUIRED' }),
  Object.freeze({ id: 'practice-open', event: 'execution.practice.open', status: 'BLUEPRINT_ONLY' }),
  Object.freeze({ id: 'leader-support', event: 'execution.support.requested', status: 'BLUEPRINT_ONLY' }),
]);

export const PARTNER_EXECUTION_AUTOMATION_HOOKS = Object.freeze([
  'execution.task.completed',
  'execution.week.started',
  'execution.week.completed',
  'execution.support.requested',
]);

const PRODUCT_VIDEO_IDS = Object.freeze([
  'mini-touch-aufbau-wassertank',
  'mini-touch-touchdisplay-wasserausgabe',
  'mini-touch-filterwechsel-wartung',
  'untertischanlage-bedienung-flush-wartung',
  'sparkling-pro-bedienung-systemaufbau',
]);

function hasCompletedVideo(partner, videoIds) {
  const completedVideos = partner?.academyProgress?.completedVideos || {};
  return videoIds.some((videoId) => Boolean(completedVideos[videoId]));
}

export function resolvePartnerNextAction({ data, partner } = {}) {
  const onboardingComplete = Boolean(data?.onboarding?.isComplete);
  const academyProgress = Math.min(100, Math.max(0, Number(data?.progress || 0)));
  const productReached = hasCompletedVideo(partner, PRODUCT_VIDEO_IDS);

  if (!onboardingComplete) return { ...partnerNextActionRules[0], status: academyProgress > 0 ? 'IN_PROGRESS' : 'OPEN' };
  if (!productReached) return { ...partnerNextActionRules[1], status: 'OPEN' };
  if (academyProgress < 100) return { ...partnerNextActionRules[2], status: 'IN_PROGRESS' };
  if (academyProgress >= 100) return { ...partnerNextActionRules[3], status: 'OPEN' };
  return { ...partnerNextActionRules[4], status: 'OPEN' };
}

function getRelevantChallenges(progress) {
  const eligible = partnerExecutionTasks.filter((task) => progress >= task.requiresProgress);

  if (progress < 25) return eligible.filter((task) => ['product', 'water'].includes(task.category)).slice(0, 4);
  if (progress < 75) return eligible.filter((task) => ['water', 'sales', 'recruiting'].includes(task.category)).slice(0, 6);
  return eligible.filter((task) => ['sales', 'recruiting', 'content'].includes(task.category)).slice(0, 6);
}

function getPracticeAction(progress) {
  const challenges = getRelevantChallenges(progress);
  return challenges[0] || partnerExecutionTasks[0];
}

export function buildPartnerExecutionModel({ data, partner } = {}) {
  const progress = Math.min(100, Math.max(0, Number(data?.progress || 0)));
  const nextAction = resolvePartnerNextAction({ data, partner });
  const practiceAction = getPracticeAction(progress);
  const contextAction = Number(data?.unreadContentCount || 0) > 0
    ? { id: 'daily-context-updates', source: 'SYSTEM', category: 'context', target: 'news', priority: 'NORMAL', status: 'OPEN', statusMode: 'DERIVED' }
    : { id: 'daily-context-campaign', source: 'CAMPAIGN', category: 'context', target: 'campaigns', priority: 'LOW', status: 'OPEN', statusMode: 'UI_ONLY' };
  const dailyFocus = [
    { ...nextAction, id: `daily-${nextAction.id}`, kind: 'learning' },
    { ...practiceAction, id: `daily-${practiceAction.id}`, kind: 'practice', status: 'OPEN' },
    { ...contextAction, kind: 'context' },
  ].slice(0, 3);
  const completedModules = Number(data?.academySummary?.completedCount || partner?.academyProgress?.completedModuleCount || 0);
  const supportSignals = [
    !data?.onboarding?.isComplete && { id: 'onboarding-open', source: 'P0_ONBOARDING', severity: 'NORMAL' },
    progress === 0 && { id: 'learning-not-started', source: 'SYSTEM', severity: 'NORMAL' },
    ['watch', 'inactive'].includes(partner?.activityStatus?.id) && { id: 'learning-pause', source: 'SYSTEM', severity: 'NORMAL' },
    !String(partner?.teamName || '').trim() && Number(partner?.teamPartnerCount || 0) === 0 && { id: 'leader-context-open', source: 'LEADER', severity: 'LOW' },
  ].filter(Boolean).slice(0, 3);

  return {
    progress,
    nextAction,
    dailyFocus,
    weeklyFocus: partnerWeeklyFocus.slice(0, 5),
    challenges: getRelevantChallenges(progress),
    weeklyReview: {
      learnedCount: completedModules,
      implementationStatus: 'NOT_PERSISTED',
      openCount: dailyFocus.filter((item) => item.status !== 'DONE').length,
      nextActionId: nextAction.id,
    },
    supportSignals,
    leaderSummary: {
      teamCount: data?.leader?.teamCount ?? 0,
      newPartners: data?.leader?.newPartners ?? 0,
      activity: data?.leader?.activity || 'UNTRACKED',
      scope: 'AGGREGATE_ONLY',
      includesPersonalNotes: false,
      includesSensitiveProfile: false,
    },
    persistence: 'NONE',
  };
}
