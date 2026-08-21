import Link from "next/link";
import StudyPreferencesForm from "@/components/settings/StudyPreferencesForm";

export const metadata = {
  title: "Settings | AI Capstone",
  description: "Configure your study preferences",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12 sm:px-8 sm:py-16">
        <header className="flex flex-col gap-4">
          <Link
            href="/"
            className="w-fit text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            ← Back to home
          </Link>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Settings
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              Customize how the app plans and schedules your study sessions.
            </p>
          </div>
        </header>

        <StudyPreferencesForm />
      </main>
    </div>
  );
}
