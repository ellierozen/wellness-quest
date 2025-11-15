import React from "react";
import type { Screen, Profile } from "../App";


type ScreenSetter = React.Dispatch<React.SetStateAction<Screen>>;

interface DashboardProps {
  goTo: ScreenSetter;
  selectDay: (day: number) => void;
  profile: Profile | null;
}

export default function DashboardScreen({
  goTo,
  selectDay,
  profile,
}: DashboardProps) {
  const totalDays = 75;
  const currentDay = profile?.currentDay || 12; // use profile.currentDay if available
  const completedDays = profile?.completedDays || []; // array of fully completed days

  const adventurerName = profile?.name || "Adventurer";
  const challengeLabel =
    profile?.challengeLevel === "hard"
      ? "Dragon Path"
      : profile?.challengeLevel === "medium"
      ? "Blade Path"
      : "Grove Path";

  const handleDayClick = (day: number) => {
    selectDay(day);
    if (day === currentDay) goTo("dayDetail");
    else if (day < currentDay) goTo("postDayLog");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black px-4 py-6 flex justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <header className="mb-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Adventurer Dashboard
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-50 flex items-center gap-2">
            Welcome, {adventurerName} <span className="text-lg">🗡️</span>
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Current quest route:{" "}
            <span className="font-semibold text-violet-300">{challengeLabel}</span>
          </p>
        </header>

        {/* XP + Level (placeholder) */}
        <section className="mb-4 rounded-xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">Guild Rank</p>
              <p className="text-sm font-semibold text-slate-100">
                Level 3 • “Habit Explorer”
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Total XP</p>
              <p className="text-sm font-semibold text-emerald-300">100 XP</p>
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full w-1/3 rounded-full bg-gradient-to-r from-emerald-400 via-indigo-400 to-violet-500"
              aria-hidden
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">100 / 300 XP to next rank.</p>
        </section>

        {/* PVZ-style Level progression */}
        <section className="mb-4 rounded-xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-lg">
          <h2 className="text-sm font-semibold text-slate-100 mb-2">Quest Log • Days</h2>
          <LevelProgression
            currentDay={currentDay}
            totalDays={totalDays}
            completedDays={completedDays}
            goToDay={handleDayClick}
          />
        </section>

        {/* Bottom buttons */}
        <section className="space-y-2">
          <button
            onClick={() => goTo("stats")}
            className="w-full rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-100 hover:border-violet-400 hover:bg-slate-800 transition"
          >
            View Overall Stats 📊
          </button>

          <button
            onClick={() => alert("AI Coach screen coming soon ⚔️")}
            className="w-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-slate-50 shadow-[0_10px_25px_rgba(79,70,229,0.7)] hover:brightness-110 transition"
          >
            Consult the Guild Coach 🤖
          </button>
        </section>
      </div>
    </div>
  );
}
