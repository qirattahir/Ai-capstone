export const SESSION_DURATIONS = [25, 45, 60, 90] as const;
export const BREAK_DURATIONS = [5, 10, 15] as const;
export const REMINDER_LEAD_TIMES = [5, 15, 30] as const;

export const STUDY_TIME_OPTIONS = [
  { value: "morning", label: "Morning (6am – 12pm)" },
  { value: "afternoon", label: "Afternoon (12pm – 5pm)" },
  { value: "evening", label: "Evening (5pm – 9pm)" },
  { value: "night", label: "Night (9pm – 12am)" },
] as const;

export const STUDY_DAY_OPTIONS = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
] as const;

export type StudyTime = (typeof STUDY_TIME_OPTIONS)[number]["value"];
export type StudyDay = (typeof STUDY_DAY_OPTIONS)[number]["value"];

export interface StudyPreferences {
  sessionDurationMinutes: number;
  breakDurationMinutes: number;
  dailyGoalHours: number;
  preferredStudyTimes: StudyTime[];
  studyDays: StudyDay[];
  remindersEnabled: boolean;
  reminderLeadTimeMinutes: number;
}

export const DEFAULT_STUDY_PREFERENCES: StudyPreferences = {
  sessionDurationMinutes: 45,
  breakDurationMinutes: 10,
  dailyGoalHours: 2,
  preferredStudyTimes: ["afternoon", "evening"],
  studyDays: ["mon", "tue", "wed", "thu", "fri"],
  remindersEnabled: true,
  reminderLeadTimeMinutes: 15,
};
