import React from "react";
import type { Screen, Profile } from "../App";
import LevelProgression from "../components/LevelProgression";
import XPBar from "../components/XPBar";

import Vine from "../assets/vines/vine.png";
import Wall from "../assets/wall/wall.png";

type ScreenSetter = React.Dispatch<React.SetStateAction<Screen>>;

interface DashboardProps {
  goTo: ScreenSetter;
  selectDay: (day: number | null) => void;
  profile: Profile | null;
  lastCompletedDay: number | null;
}

export default function DashboardScreen({
  goTo,
  selectDay,
  profile,
  lastCompletedDay,
}: DashboardProps) {
  const totalDays = 75;
  const currentDay = profile?.currentDay || 12;
  const completedDays = profile?.completedDays || [];

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
          {/* Header */}
          <header className="mb-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300/70 font-cinzel">
              Adventurer Dashboard
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-cinzel text-emerald-200 drop-shadow-lg flex items-center gap-2">
              Welcome, {adventurerName} <span className="text-lg">🗡️</span>
            </h1>
            <p className="mt-1 text-xs text-stone-300 font-medieval">
              Current quest route:{" "}
              <span className="font-semibold text-emerald-200">
                {challengeLabel}
              </span>
            </p>
          </header>

          {/* XP + Level */}
            <section className="mb-4 rounded-xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-lg">
              {profile && (
                <XPBar totalXP={profile.totalXP} />
              )}
            </section>

          {/* Quest Log / Level Progression */}
          <section className="mb-4 rounded-lg border border-stone-700/60 bg-[rgba(60,45,30,0.7)] p-3 sm:p-4 shadow-[0_0_18px_rgba(0,0,0,0.6)]">
            <h2 className="text-xs sm:text-sm font-semibold text-stone-100 mb-2 font-cinzel">
              Quest Log • Days
            </h2>
            <LevelProgression
              currentDay={currentDay}
              totalDays={totalDays}
              completedDays={completedDays}
              goToDay={handleDayClick}
              lastCompletedDay={lastCompletedDay}
            />
          </section>

          {/* Bottom buttons */}
          <section className="space-y-2">
            <button
              onClick={() => goTo("stats")}
              className="
                w-full rounded-lg 
                border border-stone-700 
                bg-[rgba(60,45,30,0.9)]
                px-4 py-2 
                text-xs sm:text-sm 
                font-medium 
                text-stone-100 
                font-medieval
                hover:border-emerald-500/70 
                hover:text-emerald-200 
                hover:bg-[rgba(70,52,35,0.95)]
                transition
              "
            >
              View Overall Stats 📊
            </button>

            <button
              onClick={() => alert('AI Coach screen coming soon ⚔️')}
              className="
                w-full rounded-lg 
                bg-gradient-to-b from-emerald-700 to-emerald-900 
                border border-emerald-500/60
                text-emerald-50 text-xs sm:text-sm
                px-4 py-2.5 
                shadow-[0_0_20px_rgba(16,185,129,0.5)]
                hover:shadow-[0_0_30px_rgba(16,185,129,0.7)]
                hover:brightness-110
                transition
                font-cinzel
              "
            >
              Consult the Guild Coach 🤖
            </button>
          </section>
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
}
