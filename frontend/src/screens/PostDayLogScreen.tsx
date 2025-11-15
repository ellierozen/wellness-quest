import React, { useState } from "react";
import type { Screen, Profile } from "../App";
import {XP_PER_DAY} from "../components/XPBar";


type ScreenSetter = React.Dispatch<React.SetStateAction<Screen>>;

interface PostDayLogProps {
  goTo: ScreenSetter;
  day: number;
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  setLastCompletedDay: React.Dispatch<React.SetStateAction<number | null>>;
}

const PostDayLogScreen: React.FC<PostDayLogProps> = ({
  goTo,
  day,
  profile,
  setProfile,
  setLastCompletedDay, // 👈 NEW
}) => {

  const [completed, setCompleted] = useState<"yes" | "no" | "">("");
  const [reflection, setReflection] = useState("");

  const adventurerName = profile?.name || "Adventurer";

  const handleSubmit = () => {
    if (!completed) {
      alert("Did you complete the quest today? ⚔️");
      return;
    }
  
    if (completed === "yes" && profile) {
        setLastCompletedDay(day);
        const alreadyCompleted = profile.completedDays.includes(day);
  
        const xpGain = alreadyCompleted ? 0 : XP_PER_DAY;
      // advance the quest progress
      setProfile({
        ...profile,
        currentDay: Math.min(profile.currentDay + 1, 75),
        completedDays: Array.from(new Set([...profile.completedDays, day])),
        totalXP: profile.totalXP + xpGain,
      });
    }
  
    console.log({ day, completed, reflection, profile });
  
    goTo("dashboard");
  };
  
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 flex justify-center">
      <div className="w-full max-w-md">
        <button
          onClick={() => goTo("dayDetail")}
          className="mb-3 text-xs text-slate-400 hover:text-slate-200"
        >
          ← Back to day rules
        </button>

        <h1 className="text-2xl font-bold mb-1">Day {day} • Post-Quest Log</h1>
        <p className="text-sm text-slate-300 mb-4">
          How did today’s quest go, {adventurerName}?
        </p>

        {/* Completed? */}
        <div className="mb-4">
          <p className="text-xs font-medium text-slate-300 mb-2">
            Did you follow all the rules today?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCompleted("yes")}
              className={[
                "flex-1 rounded-full px-3 py-2 text-xs font-medium border",
                completed === "yes"
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                  : "border-slate-700 bg-slate-900/80 text-slate-200",
              ].join(" ")}
            >
              ✅ Yes, full completion
            </button>
            <button
              type="button"
              onClick={() => setCompleted("no")}
              className={[
                "flex-1 rounded-full px-3 py-2 text-xs font-medium border",
                completed === "no"
                  ? "border-rose-400 bg-rose-500/20 text-rose-100"
                  : "border-slate-700 bg-slate-900/80 text-slate-200",
              ].join(" ")}
            >
              ⚠️ Not quite
            </button>
          </div>
        </div>

        {/* Reflection */}
        <div className="mb-5">
          <p className="text-xs font-medium text-slate-300 mb-1">Reflection (optional)</p>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="What felt easy? What was hard? Anything you want your future self (or the AI coach) to know."
            rows={4}
            className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-50 shadow-[0_10px_25px_rgba(79,70,229,0.7)] hover:brightness-110 transition"
        >
          Submit log & return to guild 🏰
        </button>
      </div>
    </div>
  );
};

export default PostDayLogScreen;
