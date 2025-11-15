// src/screens/DayDetailScreen.tsx
import React from "react";
import type { Screen, Profile } from "../App";

type ScreenSetter = React.Dispatch<React.SetStateAction<Screen>>;

interface DayDetailProps {
  goTo: ScreenSetter;
  day: number;
  profile: Profile | null;
}

const DayDetailScreen: React.FC<DayDetailProps> = ({
  goTo,
  day,
  profile,
}) => {
  const challenge = profile?.challengeLevel || "soft";

  const rulesByLevel: Record<
    "soft" | "medium" | "hard",
    string[]
  > = {
    soft: [
      "Move your body for 30 minutes",
      "Drink water: ~half your body weight (oz)",
      "5+ minutes of mindfulness or meditation",
      "10 minutes of personal growth (read/podcast)",
    ],
    medium: [
      "Exercise 6 days this week (mix strength + cardio)",
      "Drink ~120 oz of water",
      "Prioritize protein, fruits, vegetables",
      "10 pages of non-fiction",
      "Mindfulness journal at night",
    ],
    hard: [
      "Two 45-minute workouts (one outdoors)",
      "Drink 1 gallon of water",
      "Follow your chosen diet strictly",
      "Read 10 pages of non-fiction",
      "Complete a written journal entry",
    ],
  };

  const rules = rulesByLevel[challenge];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 flex justify-center">
      <div className="w-full max-w-md">
        <button
          onClick={() => goTo("dashboard")}
          className="mb-3 text-xs text-slate-400 hover:text-slate-200"
        >
          ← Back to dashboard
        </button>

        <h1 className="text-2xl font-bold mb-1">
          Day {day} • Quest Rules
        </h1>
        <p className="text-sm text-slate-300 mb-4">
          Path:{" "}
          <span className="font-semibold capitalize">{challenge}</span>
        </p>

        <ul className="space-y-2 mb-6">
          {rules.map((rule, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 rounded-lg border border-slate-700 bg-slate-900/80 p-3 text-sm"
            >
              <span className="mt-[3px] text-emerald-400">◆</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => goTo("postDayLog")}
          className="w-full rounded-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-slate-50 shadow-[0_10px_25px_rgba(34,197,94,0.7)] hover:brightness-110 transition"
        >
          Log today’s quest progress ✍️
        </button>
      </div>
    </div>
  );
};

export default DayDetailScreen;
