import { ACADEMY_CONTENT_CATALOG } from './academy-content';

const ONBOARDING_MODULE_IDS = new Set([2, 3, 6, 9, 10]);

export const ACADEMY_MODULE_CATALOG = ACADEMY_CONTENT_CATALOG.map((module) => ({
  id: module.id,
  title: module.title.de,
  videoIds: module.resources.videos,
  onboarding: ONBOARDING_MODULE_IDS.has(module.id),
}));

export const ACADEMY_TRACKED_VIDEO_IDS = ACADEMY_MODULE_CATALOG.flatMap((module) => module.videoIds);
export const ACADEMY_ONBOARDING_MODULE_IDS = ACADEMY_MODULE_CATALOG
  .filter((module) => module.onboarding)
  .map((module) => module.id);

const VIDEO_MODULE_MAP = new Map(
  ACADEMY_MODULE_CATALOG.flatMap((module) => module.videoIds.map((videoId) => [videoId, module.id])),
);

function validIso(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

export function latestIso(...values) {
  return values
    .map(validIso)
    .filter(Boolean)
    .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0] || '';
}

export function normalizeAcademyProgress(rawProgress = {}) {
  const rawCompletedVideos = rawProgress?.completedVideos && typeof rawProgress.completedVideos === 'object'
    ? rawProgress.completedVideos
    : {};
  const completedVideos = {};

  ACADEMY_TRACKED_VIDEO_IDS.forEach((videoId) => {
    const entry = rawCompletedVideos[videoId];
    const completedAt = validIso(typeof entry === 'string' ? entry : entry?.completedAt);

    if (completedAt) {
      completedVideos[videoId] = {
        completedAt,
        moduleId: VIDEO_MODULE_MAP.get(videoId),
      };
    }
  });

  const completedVideoIds = Object.keys(completedVideos);
  const completedModules = ACADEMY_MODULE_CATALOG
    .filter((module) => module.videoIds.length > 0)
    .filter((module) => module.videoIds.every((videoId) => completedVideos[videoId]))
    .map((module) => ({
      moduleId: module.id,
      title: module.title,
      completedAt: latestIso(...module.videoIds.map((videoId) => completedVideos[videoId]?.completedAt)),
    }));
  const completedModuleIds = completedModules.map((module) => module.moduleId);
  const onboardingModules = ACADEMY_MODULE_CATALOG.filter((module) => module.onboarding);
  const onboardingVideoIds = onboardingModules.flatMap((module) => module.videoIds);
  const onboardingCompletedVideos = onboardingVideoIds.filter((videoId) => completedVideos[videoId]).length;
  const onboardingCompleted = onboardingModules.length > 0
    && onboardingModules.every((module) => completedModuleIds.includes(module.id));
  const nextModule = onboardingModules.find((module) => !completedModuleIds.includes(module.id)) || null;
  const lastTrainingActivityAt = latestIso(
    rawProgress?.lastActivityAt,
    ...completedVideoIds.map((videoId) => completedVideos[videoId].completedAt),
  );
  const lastModuleCompletedAt = latestIso(
    rawProgress?.lastModuleCompletedAt,
    ...completedModules.map((module) => module.completedAt),
  );
  const onboardingStatus = onboardingCompleted
    ? 'completed'
    : completedVideoIds.length > 0
      ? 'in-progress'
      : 'not-started';

  return {
    schemaVersion: 1,
    completedVideos,
    completedVideoIds,
    completedVideoCount: completedVideoIds.length,
    totalVideoCount: ACADEMY_TRACKED_VIDEO_IDS.length,
    completedModules,
    completedModuleIds,
    completedModuleCount: completedModules.length,
    progressPercent: Math.round((completedVideoIds.length / Math.max(ACADEMY_TRACKED_VIDEO_IDS.length, 1)) * 100),
    onboardingStatus,
    onboardingStatusLabel: onboardingStatus === 'completed'
      ? 'Abgeschlossen'
      : onboardingStatus === 'in-progress'
        ? 'In Bearbeitung'
        : 'Nicht begonnen',
    onboardingProgressPercent: Math.round((onboardingCompletedVideos / Math.max(onboardingVideoIds.length, 1)) * 100),
    lastModuleCompletedAt,
    lastTrainingActivityAt,
    nextModuleId: nextModule?.id || null,
    nextModuleTitle: nextModule?.title || '',
    hasRecordedProgress: Boolean(rawProgress?.schemaVersion || completedVideoIds.length),
  };
}

export function getAcademyModuleProgress(progress, moduleId) {
  const catalogModule = ACADEMY_MODULE_CATALOG.find((item) => item.id === Number(moduleId));

  if (!catalogModule?.videoIds.length) {
    return null;
  }

  const normalized = normalizeAcademyProgress(progress);
  const completed = catalogModule.videoIds.filter((videoId) => normalized.completedVideos[videoId]).length;

  return {
    completed,
    total: catalogModule.videoIds.length,
    percent: Math.round((completed / catalogModule.videoIds.length) * 100),
    completedAt: normalized.completedModules.find((item) => item.moduleId === catalogModule.id)?.completedAt || '',
  };
}

export function getPartnerActivityStatus(lastActivityAt, now = new Date()) {
  const activityAt = validIso(lastActivityAt);

  if (!activityAt) {
    return {
      id: 'untracked',
      label: 'Noch nicht erfasst',
      daysInactive: null,
    };
  }

  const daysInactive = Math.max(0, Math.floor((now.getTime() - new Date(activityAt).getTime()) / 86_400_000));

  if (daysInactive <= 14) {
    return { id: 'active', label: 'Aktiv', daysInactive };
  }

  if (daysInactive <= 30) {
    return { id: 'watch', label: 'Unter Beobachtung', daysInactive };
  }

  return { id: 'inactive', label: 'Inaktiv', daysInactive };
}
