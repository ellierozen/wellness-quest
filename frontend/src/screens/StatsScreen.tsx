// src/screens/StatsScreen.tsx
import React from "react";
import type { Screen, Profile } from "../App";
import Vine from "../assets/vines/vine.png";
import Wall from "../assets/wall/wall.png";

type ScreenSetter = React.Dispatch<React.SetStateAction<Screen>>;

interface StatsProps {
  goTo: ScreenSetter;
  profile: Profile | null;
}

const StatsScreen: React.FC<StatsProps> = ({ goTo, profile }) => {
  const adventurerName = profile?.name || "Adventurer";

  const totalDays = 75;
  const daysCompleted = profile?.completedDays?.length ?? 0;
  const completionRate =
    totalDays > 0 ? Math.round((daysCompleted / totalDays) * 100) : 0;

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
            onClick={() => goTo("dashboard")}
            className="mb-3 text-[11px] text-emerald-200/80 hover:text-emerald-100 font-medieval"
          >
            ← Return to guild map
          </button>

          {/* Header */}
          <div className="mb-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300/70 font-cinzel">
              Guild Ledger
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-cinzel text-emerald-200 drop-shadow-lg flex items-center gap-2">
              Overall Stats 📊
            </h1>
            <p className="mt-1 text-xs text-stone-300 font-medieval">
              Summary for{" "}
              <span className="font-semibold text-emerald-200">
                {adventurerName}
              </span>
            </p>
          </div>

          {/* Stats cards */}
          <div className="space-y-3">
            {/* Quest Progress */}
            <div
              className="
                rounded-lg
                border border-stone-700/70
                bg-[rgba(60,45,30,0.85)]
                p-3 sm:p-4
                shadow-[0_0_15px_rgba(0,0,0,0.6)]
              "
            >
              <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-300/80 font-cinzel">
                Quest Progress
              </p>
              <p className="mt-2 text-sm text-stone-100 font-medieval">
                Days completed:{" "}
                <span className="font-semibold text-emerald-200">
                  {daysCompleted}
                </span>{" "}
                / {totalDays}
              </p>
              <p className="text-sm text-stone-100 font-medieval">
                Completion rate:{" "}
                <span className="font-semibold text-emerald-200">
                  {completionRate}%
                </span>
              </p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-[rgba(30,20,15,0.9)] overflow-hidden">
                <div
                  style={{ width: `${completionRate}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-300 to-emerald-600"
                />
              </div>
            </div>

            {/* Streaks (still mostly placeholder-ish, but styled) */}
            <div
              className="q
                rounded-lg
                border border-stone-700/70
                bg-[rgba(60,45,30,0.85)]
                p-3 sm:p-4
                shadow-[0_0_15px_rgba(0,0,0,0.6)]
              "
            >
              <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-300/80 font-cinzel">
                Streaks
              </p>
              <p className="mt-2 text-sm text-stone-100 font-medieval">
                Current streak:{" "}
                <span className="font-semibold text-emerald-200">
                  2 days
                </span>{" "}
                <span className="text-[11px] text-stone-400">
                  (placeholder)
                </span>
              </p>
              <p className="text-sm text-stone-100 font-medieval">
                Longest streak:{" "}
                <span className="font-semibold text-emerald-200">
                  4 days
                </span>{" "}
                <span className="text-[11px] text-stone-400">
                  (placeholder)
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* VINES */}
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

export default StatsScreen;
