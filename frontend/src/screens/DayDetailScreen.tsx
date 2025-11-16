// src/screens/DayDetailScreen.tsx
import React from "react";
import type { Screen, Profile } from "../App";
import Vine from "../assets/vines/vine.png";
import Wall from "../assets/wall/wall.png";

type ScreenSetter = React.Dispatch<React.SetStateAction<Screen>>;

export interface Meal {
  type: "Breakfast" | "Lunch" | "Dinner";
  title: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface DayMealPlan {
  day: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  meals: Meal[];
}

interface DayDetailProps {
  goTo: ScreenSetter;
  day: number;
  profile: Profile | null;
  mealPlan?: DayMealPlan | null;
}

const DayDetailScreen: React.FC<DayDetailProps> = ({
  goTo,
  day,
  profile,
  mealPlan,
}) => {
  const challenge = profile?.challengeLevel || "soft";

  const rulesByLevel: Record<"soft" | "medium" | "hard", string[]> = {
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
              Quest Scroll
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-cinzel text-emerald-200 drop-shadow-lg">
              Day {day} • Quest Rules
            </h1>
            <p className="mt-1 text-xs text-stone-300 font-medieval">
              Path:{" "}
              <span className="font-semibold capitalize text-emerald-200">
                {challenge}
              </span>
            </p>
          </div>

          {/* Rules list */}
          <ul className="space-y-2 mb-5">
            {rules.map((rule, idx) => (
              <li
                key={idx}
                className="
                  flex items-start gap-2
                  rounded-lg
                  border border-stone-700/70
                  bg-[rgba(60,45,30,0.85)]
                  p-3
                  text-[13px] sm:text-sm
                  shadow-[0_0_15px_rgba(0,0,0,0.6)]
                "
              >
                <span className="mt-[3px] text-emerald-300">◆</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>

          {/* Guild Meal Plan */}
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-cinzel text-emerald-200">
                Guild Meal Plan 🍽️
              </h2>
              <span className="text-[11px] text-emerald-300/80 font-medieval">
                Crafted from your stats
              </span>
            </div>

            {mealPlan ? (
              <>
                {/* Overall macros */}
                <div className="mb-3 grid grid-cols-2 gap-2 text-[11px] sm:text-xs">
                  <div className="rounded-md border border-stone-700/70 bg-[rgba(60,45,30,0.9)] px-2 py-1.5">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-stone-400 font-cinzel">
                      Calories
                    </p>
                    <p className="text-sm font-semibold text-emerald-200 font-medieval">
                      {mealPlan.totalCalories.toLocaleString()} kcal
                    </p>
                  </div>
                  <div className="rounded-md border border-stone-700/70 bg-[rgba(60,45,30,0.9)] px-2 py-1.5">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-stone-400 font-cinzel">
                      Protein
                    </p>
                    <p className="text-sm font-semibold text-emerald-200 font-medieval">
                      {mealPlan.totalProtein} g
                    </p>
                  </div>
                  <div className="rounded-md border border-stone-700/70 bg-[rgba(60,45,30,0.9)] px-2 py-1.5">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-stone-400 font-cinzel">
                      Carbs
                    </p>
                    <p className="text-sm font-semibold text-emerald-200 font-medieval">
                      {mealPlan.totalCarbs} g
                    </p>
                  </div>
                  <div className="rounded-md border border-stone-700/70 bg-[rgba(60,45,30,0.9)] px-2 py-1.5">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-stone-400 font-cinzel">
                      Fats
                    </p>
                    <p className="text-sm font-semibold text-emerald-200 font-medieval">
                      {mealPlan.totalFats} g
                    </p>
                  </div>
                </div>

                {/* Meals list */}
                <div className="space-y-2">
                  {mealPlan.meals.map((meal, idx) => (
                    <div
                      key={idx}
                      className="
                        rounded-lg
                        border border-stone-700/70
                        bg-[rgba(60,45,30,0.9)]
                        p-3
                        text-[12px] sm:text-sm
                        shadow-[0_0_15px_rgba(0,0,0,0.6)]
                      "
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-cinzel text-emerald-200 text-sm">
                          {meal.type}
                        </p>
                        <p className="text-[11px] text-stone-300 font-medieval">
                          {meal.calories} kcal • {meal.protein}P / {meal.carbs}C /{" "}
                          {meal.fats}F
                        </p>
                      </div>
                      <p className="font-medieval text-stone-100">
                        {meal.title}
                      </p>
                      {meal.description && (
                        <p className="mt-1 text-[11px] text-stone-300">
                          {meal.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-[11px] text-stone-400 font-medieval">
                The guild mage is still scribing today&apos;s meal scroll. 🍲
                Connect the backend to feed in your Gemini meal plan here.
              </p>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={() => goTo("postDayLog")}
            className="
              w-full rounded-lg
              bg-linear-to-b from-emerald-700 to-emerald-900
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
            Log today’s quest progress ✍️
          </button>
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
          className="absolute -bottom-3 -left-3 w-20 opacity-90 rotate-0 pointer-events-none select-none z-20"
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

export default DayDetailScreen;
