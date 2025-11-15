import React, { useState } from "react";
import type { Screen, Profile } from "../App";
import Vine from "../assets/vines/vine.png";
import Wall from "../assets/wall/wall.png";

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
  setLastCompletedDay,
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
      // remember which day was just finished for the knight animation
      setLastCompletedDay(day);

      // advance the quest progress
      setProfile({
        ...profile,
        currentDay: Math.min(profile.currentDay + 1, 75),
        completedDays: Array.from(new Set([...profile.completedDays, day])),
      });
    }

    console.log({ day, completed, reflection, profile });

    goTo("dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: `url(${Wall})`,
        backgroundColor: "rgba(0,0,0,0.6)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div
        className="
          relative mx-auto
          w-full
          max-w-sm
          scale-[0.85]
          sm:scale-100
        "
      >
        {/* MAIN CARD */}
        <div
          className="
            relative z-10
            rounded-xl
            border border-stone-700/60
            bg-[rgba(40,30,20,0.88)]
            p-4 sm:p-6
            shadow-[0_0_25px_rgba(0,0,0,0.7)]
            backdrop-blur-sm
            text-stone-100
            font-medieval
          "
        >
          {/* Back link */}
          <button
            onClick={() => goTo("dayDetail")}
            className="mb-3 text-[11px] text-emerald-200/80 hover:text-emerald-100 font-medieval"
          >
            ← Back to quest rules
          </button>

          {/* Header */}
          <div className="mb-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300/70 font-cinzel">
              Post-Quest Log
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-cinzel text-emerald-200 drop-shadow-lg">
              Day {day} • Reflections
            </h1>
            <p className="mt-1 text-xs text-stone-300 font-medieval">
              How did today’s quest go, {adventurerName}?
            </p>
          </div>

          {/* Completed? */}
          <div className="mb-4">
            <p className="text-xs font-medium text-stone-200 mb-2 font-medieval">
              Did you follow all the rules today?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCompleted("yes")}
                className={[
                  "flex-1 rounded-lg px-3 py-2 text-[11px] sm:text-xs font-semibold border transition",
                  completed === "yes"
                    ? "border-emerald-500/70 bg-gradient-to-b from-emerald-700/90 to-emerald-900 text-emerald-50 shadow-[0_0_16px_rgba(16,185,129,0.5)] font-cinzel"
                    : "border-stone-700 bg-[rgba(60,45,30,0.8)] text-stone-200 hover:border-emerald-500/50 hover:text-emerald-200",
                ].join(" ")}
              >
                ✅ Yes, full completion
              </button>
              <button
                type="button"
                onClick={() => setCompleted("no")}
                className={[
                  "flex-1 rounded-lg px-3 py-2 text-[11px] sm:text-xs font-semibold border transition",
                  completed === "no"
                    ? "border-rose-500/70 bg-gradient-to-b from-rose-700/90 to-rose-900 text-rose-50 shadow-[0_0_16px_rgba(248,113,113,0.5)] font-cinzel"
                    : "border-stone-700 bg-[rgba(60,45,30,0.8)] text-stone-200 hover:border-rose-400/50 hover:text-rose-100",
                ].join(" ")}
              >
                ⚠️ Not quite
              </button>
            </div>
          </div>

          {/* Reflection */}
          <div className="mb-5">
            <p className="text-xs font-medium text-stone-200 mb-1 font-medieval">
              Reflection (optional)
            </p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What felt easy? What was hard? Anything you want your future self (or the guild coach) to know."
              rows={4}
              className="
                w-full rounded-lg
                border border-stone-700/70
                bg-[rgba(60,45,30,0.85)]
                px-3 py-2
                text-sm text-stone-100
                placeholder:text-stone-500
                focus:outline-none
                focus:ring-2 focus:ring-emerald-600
                focus:border-emerald-600
                font-medieval
              "
            />
          </div>

          {/* CTA */}
          <button
            onClick={handleSubmit}
            className="
              w-full rounded-lg
              bg-gradient-to-b from-emerald-700 to-emerald-900
              border border-emerald-500/60
              text-emerald-50 text-sm
              px-4 py-2.5
              shadow-[0_0_20px_rgba(16,185,129,0.5)]
              hover:shadow-[0_0_30px_rgba(16,185,129,0.7)]
              hover:brightness-110
              transition
              font-cinzel
            "
          >
            Submit log & return to guild 🏰
          </button>
        </div>

        {/* VINES – same positions as onboarding / dashboard / day detail */}
        <img
          src={Vine}
          alt=""
          className="absolute -top-3 -left-3 w-20 opacity-90 rotate-90 pointer-events-none select-none z-20"
        />
        <img
          src={Vine}
          alt=""
          className="absolute -top-3 -right-3 w-20 opacity-90 rotate-180 pointer-events-none select-none z-20"
        />
        <img
          src={Vine}
          alt=""
          className="absolute -bottom-3 -left-3 w-20 opacity-90 -rotate-0 pointer-events-none select-none z-20"
        />
        <img
          src={Vine}
          alt=""
          className="absolute -bottom-3 -right-3 w-20 opacity-90 rotate-270 pointer-events-none select-none z-20"
        />
      </div>
    </div>
  );
};

export default PostDayLogScreen;
