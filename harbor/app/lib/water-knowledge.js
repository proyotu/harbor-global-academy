export const WATER_CLAIM_CLASSIFICATIONS = Object.freeze([
  'CONFIRMED',
  'EDUCATIONAL',
  'REFERENCE',
  'REQUIRES_REVIEW',
  'DO_NOT_USE_AS_CLAIM',
]);

export const WATER_KNOWLEDGE_DEFINITIONS = Object.freeze({
  'water-foundations': Object.freeze({
    id: 'water-foundations',
    canonicalModuleId: 2,
    canonicalLessonId: 'basics-overview',
    classification: 'EDUCATIONAL',
    sourceTier: 'A+C',
    concepts: Object.freeze(['water', 'hydrogen', 'electrolytes', 'minerals']),
  }),
  'reverse-osmosis': Object.freeze({
    id: 'reverse-osmosis',
    canonicalModuleId: 3,
    canonicalLessonId: 'video-osmosis',
    canonicalVideoId: 'umkehrosmose-erklaerung',
    classification: 'EDUCATIONAL',
    sourceTier: 'A',
  }),
  'ppm-tds': Object.freeze({
    id: 'ppm-tds',
    canonicalModuleId: 10,
    canonicalLessonId: 'video-ppm',
    canonicalVideoId: 'ppm-bedeutung',
    classification: 'EDUCATIONAL',
    sourceTier: 'A',
  }),
});

export const HYDROGEN_BOTTLE_CONTENT_READINESS = Object.freeze({
  status: 'OFFICIAL_SOURCE_REQUIRED',
  publishable: false,
  blockedFields: Object.freeze([
    'hydrogenConcentration',
    'cycleDuration',
    'electrolysisTechnology',
    'certifications',
    'healthEffects',
  ]),
});

export const WATER_KNOWLEDGE_QUIZ_BLUEPRINT = Object.freeze([
  'ppm-measurement-boundary',
  'ppm-total-quality-boundary',
  'hydrogen-vs-water',
  'hydrogen-vs-electrolytes',
  'reverse-osmosis-principle',
  'health-claim-boundary',
]);

export function getWaterKnowledgeDefinition(knowledgeId) {
  return WATER_KNOWLEDGE_DEFINITIONS[knowledgeId] || null;
}
