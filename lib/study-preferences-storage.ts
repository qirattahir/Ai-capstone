import {
  DEFAULT_STUDY_PREFERENCES,
  type StudyPreferences,
} from "@/lib/types/study-preferences";

const STORAGE_KEY = "study-preferences";

export function loadStudyPreferences(): StudyPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_STUDY_PREFERENCES;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_STUDY_PREFERENCES;
    }

    const parsed = JSON.parse(raw) as Partial<StudyPreferences>;
    return { ...DEFAULT_STUDY_PREFERENCES, ...parsed };
  } catch {
    return DEFAULT_STUDY_PREFERENCES;
  }
}

export function saveStudyPreferences(preferences: StudyPreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}
