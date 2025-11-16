// src/screens/DayDetailScreen.tsx
import React, { useEffect, useState } from "react";
import type { Screen, Profile } from "../App";
import { API_BASE_URL } from "../config";
import Vine from "../assets/vines/vine.png";
import Wall from "../assets/wall/wall.png";

type ScreenSetter = React.Dispatch<React.SetStateAction<Screen>>;

interface DayDetailProps {
  goTo: ScreenSetter;
  day: number;
  profile: Profile | null;
}

type MealItem = {
  name: string;
  calories: number;
  items: string[];
};

interface DailyMealPlan {
  user_id: string;
  date: string;
  target_calories: number;
  meals: MealItem[];
  shopping_list: string[];
}

const DayDetailScreen: React.FC<DayDetailProps> = ({ goTo, day, profile }) => {
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

  const [mealPlan, setMealPlan] = useState<DailyMealPlan | null>(null);
  const [loadingMeals, setLoadingMeals] = useState(false);
  const [mealError, setMealError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.userId) return;

    const fetchMeals = async () => {
      setLoadingMeals(true);
      setMealError(null);

      const today = new Date().toISOString().slice(0, 10);

      try {
        const res = await fetch(`${API_BASE_URL}/api/mealplan/daily`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: profile.userId,
            date: today,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          setMealError(err?.detail || "Could not fetch today's meal plan.");
          setLoadingMeals(false);
          return;
        }

        const data: DailyMealPlan = await res.json();
        setMealPlan(data);
      } catch {
        setMealError("Network error fetching meal plan.");
      } finally {
        setLoadingMeals(false);
      }
    };

    fetchMeals();
  }, [profile?.userId]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: `url(${Wall})`,
        backgroundColor: "rgba(0,0,0,0.6)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="relative mx-auto w-full max-w-sm scale-[0.85] sm:scale-100">
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
          <button
            onClick={() => goTo("dashboard")}
            className="mb-3 text-[11px] text-stone-400 hover:text-emerald-200 font-medieval"
          >
            ← Back to guild hall
          </button>

          <h1 className="text-2xl sm:text-3xl font-cinzel text-emerald-200 drop-shadow-lg mb-1">
            Day {day} • Quest Rules
          </h1>
          <p className="text-xs text-stone-300 mb-4 font-medieval">
            Path:{" "}
            <span className="font-semibold capitalize text-emerald-200">
              {challenge}
            </span>
          </p>

          <ul className="space-y-2 mb-4">
            {rules.map((rule, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 rounded-lg border border-stone-700 bg-[rgba(60,45,30,0.9)] p-3 text-sm"
              >
                <span className="mt-[3px] text-emerald-400">◆</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>

          <div className="mb-5 rounded-lg border border-stone-700 bg-[rgba(60,45,30,0.9)] p-3 text-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold font-cinzel text-emerald-200">
                Today’s Meal Plan 🍽️
              </h2>

              <button
                disabled={loadingMeals}
                onClick={() => {
                  if (!profile?.userId) return;
                  window.location.reload();
                }}
                className="text-[10px] border border-emerald-500/60 rounded px-2 py-1 text-emerald-200 hover:bg-emerald-700/30 disabled:opacity-60"
              >
                {loadingMeals ? "Summoning..." : "Regenerate"}
              </button>
            </div>

            {loadingMeals && (
              <p className="text-[11px] text-stone-300">Summoning the guild chef...</p>
            )}

            {mealError && (
              <p className="text-[11px] text-rose-300">{mealError}</p>
            )}

            {mealPlan && !loadingMeals && !mealError && (
              <>
                <p className="text-[11px] text-stone-300 mb-2">
                  Target:{" "}
                  <span className="font-semibold">
                    {mealPlan.target_calories} kcal
                  </span>{" "}
                  · Date:{" "}
                  <span className="font-semibold">{mealPlan.date}</span>
                </p>

                <div className="space-y-2">
                  {mealPlan.meals.map((meal, idx) => (
                    <div
                      key={idx}
                      className="rounded-md border border-stone-700 bg-[rgba(30,22,15,0.95)] p-2"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-emerald-200">
                          {meal.name}
                        </span>
                        <span className="text-[11px] text-stone-300">
                          {meal.calories} kcal
                        </span>
                      </div>
                      <ul className="text-[11px] text-stone-300 list-disc ml-4">
                        {meal.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {mealPlan.shopping_list.length > 0 && (
                  <div className="mt-3">
                    <h3 className="text-[11px] font-semibold text-stone-100 mb-1">
                      Shopping list 🧺
                    </h3>
                    <ul className="text-[11px] text-stone-300 list-disc ml-4">
                      {mealPlan.shopping_list.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>

          <button
            onClick={() => goTo("postDayLog")}
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
            Log today’s quest progress ✍️
          </button>
        </div>

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
        />q
      </div>
    </div>
  );
};

export default DayDetailScreen;
