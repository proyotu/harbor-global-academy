const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function getPartnerStartDay(partner, now = new Date()) {
  const startValue = partner?.approvalLog?.approvedAt || partner?.approvedAt || partner?.createdAt;
  const startTime = new Date(startValue || '').getTime();
  const nowTime = new Date(now).getTime();

  if (!Number.isFinite(startTime) || !Number.isFinite(nowTime)) {
    return 1;
  }

  return Math.min(7, Math.max(1, Math.floor((nowTime - startTime) / DAY_IN_MS) + 1));
}

export function getPartnerStartProgress({ onboardingProgress = 0, academyProgress = 0, partner, now } = {}) {
  return {
    onboardingProgress: Math.min(100, Math.max(0, Math.round(Number(onboardingProgress) || 0))),
    academyProgress: Math.min(100, Math.max(0, Math.round(Number(academyProgress) || 0))),
    currentDay: getPartnerStartDay(partner, now),
  };
}
