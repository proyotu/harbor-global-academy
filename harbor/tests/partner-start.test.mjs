import assert from 'node:assert/strict';
import test from 'node:test';

import { getPartnerStartDay, getPartnerStartProgress } from '../app/lib/partner-start.js';

test('partner start day is based on approval and clamped to the first week', () => {
  const partner = { approvalLog: { approvedAt: '2026-08-10T08:00:00.000Z' } };

  assert.equal(getPartnerStartDay(partner, new Date('2026-08-10T20:00:00.000Z')), 1);
  assert.equal(getPartnerStartDay(partner, new Date('2026-08-13T09:00:00.000Z')), 4);
  assert.equal(getPartnerStartDay(partner, new Date('2026-09-01T09:00:00.000Z')), 7);
});

test('partner start day safely falls back when no usable date exists', () => {
  assert.equal(getPartnerStartDay({}, new Date('2026-08-13T09:00:00.000Z')), 1);
  assert.equal(getPartnerStartDay({ approvedAt: 'invalid' }), 1);
});

test('partner start progress uses canonical percentages and normalizes its compact snapshot', () => {
  const result = getPartnerStartProgress({
    onboardingProgress: 41.6,
    academyProgress: 108,
    partner: { approvedAt: '2026-08-12T08:00:00.000Z' },
    now: new Date('2026-08-13T08:30:00.000Z'),
  });

  assert.deepEqual(result, { onboardingProgress: 42, academyProgress: 100, currentDay: 2 });
});
