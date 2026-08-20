export const GROWTH_CONTENT_CLASSIFICATIONS = Object.freeze([
  'READY',
  'READY_WITH_REVIEW',
  'EDUCATIONAL',
  'REFERENCE_ONLY',
  'NEEDS_REWORK',
  'NEEDS_COMPLIANCE_REVIEW',
  'DUPLICATE',
  'NOT_PARTNER_RELEVANT',
]);

export const GROWTH_CONTENT_VISIBILITY = Object.freeze([
  'PARTNER_SAFE',
  'INTERNAL_ONLY',
  'ADMIN_ONLY',
  'OFFICIAL_SOURCE_REQUIRED',
]);

export const GROWTH_CONTENT_AI_LESSONS = Object.freeze([
  Object.freeze({ id: 'content-foundation', steps: Object.freeze(['audience', 'problem', 'purpose', 'cta']) }),
  Object.freeze({ id: 'content-factory', steps: Object.freeze(['idea', 'script', 'formats', 'review']) }),
  Object.freeze({ id: 'prompt-basics', steps: Object.freeze(['context', 'goal', 'audience', 'task', 'format', 'limits']) }),
  Object.freeze({ id: 'ai-safety', steps: Object.freeze(['source', 'draft', 'verify', 'approve']) }),
  Object.freeze({ id: 'short-form', steps: Object.freeze(['hook', 'value', 'cta']) }),
  Object.freeze({ id: 'production', steps: Object.freeze(['phone', 'light', 'audio', 'frame', 'record']) }),
  Object.freeze({ id: 'publishing', steps: Object.freeze(['prepare', 'publish', 'followUp', 'analyze', 'improve']) }),
  Object.freeze({ id: 'ai-tools', steps: Object.freeze(['text', 'ideas', 'images', 'video', 'organization']) }),
]);

export const GROWTH_CONTENT_AI_TEMPLATES = Object.freeze([
  Object.freeze({ id: 'content-ideas', category: 'ideas', difficulty: 'basic', complianceStatus: 'PARTNER_SAFE' }),
  Object.freeze({ id: 'social-post', category: 'social', difficulty: 'basic', complianceStatus: 'PARTNER_SAFE' }),
  Object.freeze({ id: 'reel-script', category: 'video', difficulty: 'basic', complianceStatus: 'PARTNER_SAFE' }),
  Object.freeze({ id: 'story-sequence', category: 'social', difficulty: 'basic', complianceStatus: 'PARTNER_SAFE' }),
  Object.freeze({ id: 'product-explainer', category: 'product', difficulty: 'guided', complianceStatus: 'OFFICIAL_SOURCE_REQUIRED' }),
  Object.freeze({ id: 'customer-faq', category: 'sales', difficulty: 'guided', complianceStatus: 'OFFICIAL_SOURCE_REQUIRED' }),
  Object.freeze({ id: 'follow-up', category: 'sales', difficulty: 'basic', complianceStatus: 'PARTNER_SAFE' }),
  Object.freeze({ id: 'business-story', category: 'recruiting', difficulty: 'guided', complianceStatus: 'NEEDS_COMPLIANCE_REVIEW' }),
]);

export const GROWTH_CONTENT_AI_TASKS = Object.freeze([
  'three-ideas',
  'one-hook',
  'one-reel',
  'one-story',
  'one-product-post',
  'one-week-plan',
]);

export const GROWTH_CONTENT_AI_BOUNDARIES = Object.freeze({
  productFacts: 'MODULE_3',
  waterFacts: 'P2_WATER_KNOWLEDGE',
  sales: 'P3_SALES',
  recruiting: 'P3_RECRUITING',
  campaigns: 'CAMPAIGN_CENTER',
  mediaAssets: 'MEDIA_CENTER',
  growthExecution: 'GROWTH_CENTER',
  hydrogenBottle: 'OFFICIAL_SOURCE_REQUIRED',
  prices: 'OFFICIAL_SOURCE_REQUIRED',
  discounts: 'OFFICIAL_SOURCE_REQUIRED',
  healthClaims: 'DO_NOT_USE_AS_CLAIM',
  incomeClaims: 'DO_NOT_USE_AS_CLAIM',
});

export const GROWTH_CONTENT_AI_SOURCES = Object.freeze([
  Object.freeze({ id: 'content-factory-standard', classification: 'READY', visibility: 'PARTNER_SAFE' }),
  Object.freeze({ id: 'brand-communication-standard', classification: 'READY', visibility: 'PARTNER_SAFE' }),
  Object.freeze({ id: 'academy-production-studio', classification: 'READY_WITH_REVIEW', visibility: 'PARTNER_SAFE' }),
  Object.freeze({ id: 'master-instructions', classification: 'REFERENCE_ONLY', visibility: 'INTERNAL_ONLY' }),
  Object.freeze({ id: 'aqua-product-intelligence', classification: 'READY_WITH_REVIEW', visibility: 'OFFICIAL_SOURCE_REQUIRED' }),
  Object.freeze({ id: 'media-center-blueprint', classification: 'READY', visibility: 'PARTNER_SAFE' }),
  Object.freeze({ id: 'campaign-center-blueprint', classification: 'READY', visibility: 'PARTNER_SAFE' }),
  Object.freeze({ id: 'leonid-os-technical-agents', classification: 'NOT_PARTNER_RELEVANT', visibility: 'INTERNAL_ONLY' }),
]);

export const GROWTH_CONTENT_PACKAGE_FIELDS = Object.freeze([
  'hook',
  'script',
  'onScreenText',
  'caption',
  'cta',
  'keywords',
  'coverIdea',
]);

export const GROWTH_CONTENT_ROUTINE = Object.freeze([
  'IDEA',
  'PREPARED',
  'CREATED',
  'READY',
  'PUBLISHED',
]);

export function getGrowthContentLesson(lessonId) {
  return GROWTH_CONTENT_AI_LESSONS.find((lesson) => lesson.id === lessonId) || null;
}
