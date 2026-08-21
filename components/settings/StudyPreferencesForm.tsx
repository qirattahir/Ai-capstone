"use client";

import { useEffect, useState } from "react";
import {
  BREAK_DURATIONS,
  DEFAULT_STUDY_PREFERENCES,
  REMINDER_LEAD_TIMES,
  SESSION_DURATIONS,
  STUDY_DAY_OPTIONS,
  STUDY_TIME_OPTIONS,
  type StudyDay,
  type StudyPreferences,
  type StudyTime,
} from "@/lib/types/study-preferences";
import {
  loadStudyPreferences,
  saveStudyPreferences,
} from "@/lib/study-preferences-storage";

type FormStatus = "loading" | "idle" | "saving" | "success" | "error";

function toggleItem<T extends string>(items: T[], value: T): T[] {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}

const inputClassName =
  "w-full rounded-lg border border-black/[.08] bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition-colors focus:border-zinc-400 dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-500";

const labelClassName = "text-sm font-medium text-zinc-950 dark:text-zinc-50";

const hintClassName = "text-xs text-zinc-500 dark:text-zinc-400";

export default function StudyPreferencesForm() {
  const [preferences, setPreferences] = useState<StudyPreferences>(
    DEFAULT_STUDY_PREFERENCES,
  );
  const [status, setStatus] = useState<FormStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setPreferences(loadStudyPreferences());
    setStatus("idle");
  }, []);

  function updatePreferences(partial: Partial<StudyPreferences>) {
    setPreferences((current) => ({ ...current, ...partial }));
    setStatus("idle");
    setErrorMessage(null);
  }

  function handleStudyTimeChange(value: StudyTime) {
    updatePreferences({
      preferredStudyTimes: toggleItem(preferences.preferredStudyTimes, value),
    });
  }

  function handleStudyDayChange(value: StudyDay) {
    updatePreferences({
      studyDays: toggleItem(preferences.studyDays, value),
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    try {
      if (preferences.dailyGoalHours < 0.5 || preferences.dailyGoalHours > 12) {
        throw new Error("Daily goal must be between 0.5 and 12 hours.");
      }

      if (preferences.preferredStudyTimes.length === 0) {
        throw new Error("Select at least one preferred study time.");
      }

      if (preferences.studyDays.length === 0) {
        throw new Error("Select at least one study day.");
      }

      saveStudyPreferences(preferences);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Could not save preferences.",
      );
    }
  }

  function handleReset() {
    setPreferences(DEFAULT_STUDY_PREFERENCES);
    setStatus("idle");
    setErrorMessage(null);
  }

  if (status === "loading") {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-black/[.08] bg-zinc-50 px-6 py-16 dark:border-white/[.145] dark:bg-zinc-950"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Loading your study preferences…
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 rounded-xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-black sm:p-8"
      aria-labelledby="study-preferences-heading"
    >
      <div className="flex flex-col gap-2">
        <h2
          id="study-preferences-heading"
          className="text-xl font-semibold text-zinc-950 dark:text-zinc-50"
        >
          Study preferences
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Tell the app how you like to study so plans and reminders fit your
          schedule.
        </p>
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className={labelClassName}>Session settings</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="session-duration" className={labelClassName}>
              Session length
            </label>
            <select
              id="session-duration"
              className={inputClassName}
              value={preferences.sessionDurationMinutes}
              onChange={(event) =>
                updatePreferences({
                  sessionDurationMinutes: Number(event.target.value),
                })
              }
            >
              {SESSION_DURATIONS.map((duration) => (
                <option key={duration} value={duration}>
                  {duration} minutes
                </option>
              ))}
            </select>
            <p className={hintClassName}>
              How long you want each focused study block to last.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="break-duration" className={labelClassName}>
              Break length
            </label>
            <select
              id="break-duration"
              className={inputClassName}
              value={preferences.breakDurationMinutes}
              onChange={(event) =>
                updatePreferences({
                  breakDurationMinutes: Number(event.target.value),
                })
              }
            >
              {BREAK_DURATIONS.map((duration) => (
                <option key={duration} value={duration}>
                  {duration} minutes
                </option>
              ))}
            </select>
            <p className={hintClassName}>
              Rest time between study sessions.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="daily-goal" className={labelClassName}>
            Daily study goal (hours)
          </label>
          <input
            id="daily-goal"
            type="number"
            min={0.5}
            max={12}
            step={0.5}
            className={inputClassName}
            value={preferences.dailyGoalHours}
            onChange={(event) =>
              updatePreferences({
                dailyGoalHours: Number(event.target.value),
              })
            }
          />
          <p className={hintClassName}>
            Target hours of study per day, between 0.5 and 12.
          </p>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className={labelClassName}>Schedule</legend>

        <div className="flex flex-col gap-3">
          <p className={labelClassName}>Preferred study times</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {STUDY_TIME_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-black/[.08] px-3 py-3 transition-colors hover:bg-zinc-50 has-checked:border-zinc-400 has-checked:bg-zinc-50 dark:border-white/[.145] dark:hover:bg-zinc-950 dark:has-checked:border-zinc-500 dark:has-checked:bg-zinc-950"
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-zinc-300"
                  checked={preferences.preferredStudyTimes.includes(
                    option.value,
                  )}
                  onChange={() => handleStudyTimeChange(option.value)}
                />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className={labelClassName}>Study days</p>
          <div className="flex flex-wrap gap-2">
            {STUDY_DAY_OPTIONS.map((option) => {
              const isSelected = preferences.studyDays.includes(option.value);

              return (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    isSelected
                      ? "border-zinc-950 bg-zinc-950 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-950"
                      : "border-black/[.08] text-zinc-700 hover:bg-zinc-50 dark:border-white/[.145] dark:text-zinc-300 dark:hover:bg-zinc-950"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isSelected}
                    onChange={() => handleStudyDayChange(option.value)}
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className={labelClassName}>Reminders</legend>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-zinc-300"
            checked={preferences.remindersEnabled}
            onChange={(event) =>
              updatePreferences({ remindersEnabled: event.target.checked })
            }
          />
          <span className="flex flex-col gap-1">
            <span className={labelClassName}>Enable study reminders</span>
            <span className={hintClassName}>
              Get notified before scheduled study sessions.
            </span>
          </span>
        </label>

        {preferences.remindersEnabled && (
          <div className="flex flex-col gap-2">
            <label htmlFor="reminder-lead-time" className={labelClassName}>
              Remind me before session
            </label>
            <select
              id="reminder-lead-time"
              className={inputClassName}
              value={preferences.reminderLeadTimeMinutes}
              onChange={(event) =>
                updatePreferences({
                  reminderLeadTimeMinutes: Number(event.target.value),
                })
              }
            >
              {REMINDER_LEAD_TIMES.map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} minutes
                </option>
              ))}
            </select>
          </div>
        )}
      </fieldset>

      {status === "error" && errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {errorMessage}
        </div>
      )}

      {status === "success" && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
        >
          Study preferences saved.
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "saving"}
          className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-[#ccc]"
        >
          {status === "saving" ? "Saving…" : "Save preferences"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="flex h-12 items-center justify-center rounded-full border border-solid border-black/[.08] px-6 text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          Reset to defaults
        </button>
      </div>
    </form>
  );
}
