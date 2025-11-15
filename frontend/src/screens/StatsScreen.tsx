// src/screens/StatsScreen.tsx
import React from "react";
import type { Screen, Profile } from "../App";

type ScreenSetter = React.Dispatch<React.SetStateAction<Screen>>;

interface StatsProps {
  goTo: ScreenSetter;
  profile: Profile | null;
}

const StatsScreen: React.FC<StatsProps> = ({ goTo, profile }) => {
  const adventurerName = profile?.name || "Adventurer";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 flex justify-center">
      <div className="w-full max-w-md">
        <button
          onClick={() => goTo("dashboard")}
          className="mb-3 text-xs text-slate-400 hover:text-slate-200"
        >
          ← Back to dashboard
        </button>

        <h1 className="text-2xl font-bold mb-1">Overall Stats 📊</h1>
        <p className="text-sm text-slate-300 mb-4">
          Summary for <span className="font-semibold">{adventurerName}</span>
        </p>

        {/* Placeholder stats for now */}
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Quest Progress
            </p>
            <p className="mt-1 text-sm text-slate-100">
              Days completed: <span className="font-semibold">3</span> / 75
            </p>
            <p className="text-sm text-slate-100">
              Completion rate: <span className="font-semibold">4%</span>{" "}
            </p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Streaks
            </p>
            <p className="mt-1 text-sm text-slate-100">
              Current streak: <span className="font-semibold">2 days</span>
            </p>
            <p className="text-sm text-slate-100">
              Longest streak: <span className="font-semibold">4 days</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsScreen;
