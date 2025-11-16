import React, { useState } from "react";
import type { Screen, Profile, ChallengeLevel } from "../App";
import { API_BASE_URL } from "../config";

import Vine from "../assets/vines/vine.png";
import Wall from "../assets/wall/wall.png";

type ScreenSetter = React.Dispatch<React.SetStateAction<Screen>>;
type ProfileSetter = React.Dispatch<React.SetStateAction<Profile | null>>;

interface OnboardingProps {
  goTo: ScreenSetter;
  saveProfile: ProfileSetter;
}

const OnboardingScreen: React.FC<OnboardingProps> = ({ goTo, saveProfile }) => {
  const [name, setName] = useState("");
  const [challengeLevel, setChallengeLevel] = useState<ChallengeLevel>("soft");
  const [dietType, setDietType] = useState("mediterranean");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "other">("other");
  const [age, setAge] = useState("");
  const [goalWeightKg, setGoalWeightKg] = useState("");
  const [goalType, setGoalType] = useState<
    "weight_loss" | "maintenance" | "weight_gain"
  >("weight_loss");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!heightCm || !weightKg || !age || !goalWeightKg) {
      alert("The guild needs your stats, adventurer! ⚔️");
      return;
    }

    setLoading(true);
    setError(null);

    let storedId = localStorage.getItem("wq_user_id");
    if (!storedId) {
      storedId = `user-${crypto.randomUUID()}`;
      localStorage.setItem("wq_user_id", storedId);
    }

    const payload = {
      user_id: storedId,
      challenge_level: challengeLevel,
      diet_type: dietType,
      goal_type: goalType,
      current_weight_kg: Number(weightKg),
      goal_weight_kg: Number(goalWeightKg),
      height_cm: Number(heightCm),
      age: Number(age),
      sex,
      preferred_meals_per_day: 3,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const msg =
          body?.detail || "Guild mage failed to set up your profile. Try again.";
        setError(msg);
        alert(msg);
        setLoading(false);
        return;
      }

      const data = await res.json();

      saveProfile({
        name: name || undefined,
        challengeLevel,
        dietType,
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        sex,
        age: Number(age),
        goalWeightKg: Number(goalWeightKg),
        userId: data.user_id,
        goalType: data.goal_type,
        maintenanceCalories: data.maintenance_calories,
        targetCalories: data.target_calories,
        dailyWaterTargetLiters: data.daily_water_target_liters,
        xpMultiplier: data.xp_multiplier,
        totalXP: 0,
        currentDay: 1,
        completedDays: [],
      });

      setLoading(false);
      goTo("dashboard");
    } catch (e) {
      console.error(e);
      const msg = "Network error contacting the guild server.";
      setError(msg);
      alert(msg);
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full rounded-md border border-stone-700 bg-[rgba(60,45,30,0.7)] px-3 py-2 text-sm text-emerald-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 font-medieval";

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
        className="relative mx-auto 
          w-full 
          max-w-sm
          scale-[0.85]
          sm:scale-100"
      >
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
          <div className="mb-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300/70 font-cinzel">
              Order of Wellness
            </p>
            <h1 className="mt-1 text-3xl font-cinzel text-emerald-200 drop-shadow-lg">
              Wellness Quest 75 🛡️
            </h1>
            <p className="mt-1 text-xs text-stone-300 font-medieval">
              Forge your adventurer profile to begin your 75-day journey.
            </p>
          </div>

          {error && (
            <p className="mb-3 text-[11px] text-rose-300 font-medieval">
              {error}
            </p>
          )}

          <div className="mb-3">
            <label className="block text-xs font-medieval text-stone-200 mb-1">
              Adventurer name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Knight of UCR"
              className={inputClasses}
            />
          </div>

          <div className="mb-3">
            <label className="block text-xs font-medieval text-stone-200 mb-1">
              Choose your path
            </label>
            <div className="flex gap-2 mt-1">
              {([
                ["soft", "🍃 Soft"],
                ["medium", "⚔️ Medium"],
                ["hard", "🐉 Hard"],
              ] as [ChallengeLevel, string][]).map(([value, label]) => {
                const active = challengeLevel === value;
                const activeClasses =
                  "border-emerald-500/60 bg-gradient-to-b from-emerald-700/90 to-emerald-900 text-emerald-50 shadow-[0_0_15px_rgba(16,185,129,0.45)] font-cinzel";
                const inactiveClasses =
                  "border-stone-700 bg-[rgba(60,45,30,0.7)] text-stone-300 hover:border-emerald-600/40 hover:text-emerald-200 transition font-medieval";

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setChallengeLevel(value)}
                    className={[
                      "flex-1 rounded-lg px-3 py-2 text-xs font-semibold border transition",
                      active ? activeClasses : inactiveClasses,
                    ].join(" ")}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs text-stone-200 mb-1 font-medieval">
              Quest goal
            </label>
            <div className="flex gap-2 mt-1">
              <button
                type="button"
                onClick={() => setGoalType("weight_loss")}
                className={[
                  "flex-1 rounded-lg px-3 py-2 text-xs font-semibold border transition",
                  goalType === "weight_loss"
                    ? "border-emerald-500/60 bg-gradient-to-b from-emerald-700/90 to-emerald-900 text-emerald-50 shadow-[0_0_15px_rgba(16,185,129,0.45)] font-cinzel"
                    : "border-stone-700 bg-[rgba(60,45,30,0.7)] text-stone-300 hover:border-emerald-600/40 hover:text-emerald-200 font-medieval",
                ].join(" ")}
              >
                🔻 Lose
              </button>
              <button
                type="button"
                onClick={() => setGoalType("maintenance")}
                className={[
                  "flex-1 rounded-lg px-3 py-2 text-xs font-semibold border transition",
                  goalType === "maintenance"
                    ? "border-emerald-500/60 bg-gradient-to-b from-emerald-700/90 to-emerald-900 text-emerald-50 shadow-[0_0_15px_rgba(16,185,129,0.45)] font-cinzel"
                    : "border-stone-700 bg-[rgba(60,45,30,0.7)] text-stone-300 hover:border-emerald-600/40 hover:text-emerald-200 font-medieval",
                ].join(" ")}
              >
                ⚖️ Maintain
              </button>
              <button
                type="button"
                onClick={() => setGoalType("weight_gain")}
                className={[
                  "flex-1 rounded-lg px-3 py-2 text-xs font-semibold border transition",
                  goalType === "weight_gain"
                    ? "border-emerald-500/60 bg-gradient-to-b from-emerald-700/90 to-emerald-900 text-emerald-50 shadow-[0_0_15px_rgba(16,185,129,0.45)] font-cinzel"
                    : "border-stone-700 bg-[rgba(60,45,30,0.7)] text-stone-300 hover:border-emerald-600/40 hover:text-emerald-200 font-medieval",
                ].join(" ")}
              >
                📈 Gain
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs text-stone-200 mb-1 font-medieval">
              Type of diet
            </label>
            <select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className={inputClasses}
            >
              <option value="mediterranean">Mediterranean</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
              <option value="plant_based">Plant-based</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="intermittent_fasting">Intermittent Fasting</option>
              <option value="pescatarian">Pescatarian</option>
              <option value="paleo">Paleo</option>
              <option value="flexitarian">Flexitarian</option>
              <option value="low_carb">Low-carb</option>
            </select>
            <p className="mt-1 text-[11px] text-stone-400 font-medieval">
              You can change this later if your quest path evolves.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label className="block text-xs text-stone-200 mb-1 font-medieval">
                Height (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="165"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-xs text-stone-200 mb-1 font-medieval">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="60"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-[1.4fr_1fr] gap-2 mb-3">
            <div>
              <label className="block text-xs text-stone-200 mb-1 font-medieval">
                Class (sex)
              </label>
              <select
                value={sex}
                onChange={(e) =>
                  setSex(e.target.value as "male" | "female" | "other")
                }
                className={inputClasses}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-stone-200 mb-1 font-medieval">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="19"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs text-stone-200 mb-1 font-medieval">
              End goal weight (kg)
            </label>
            <input
              type="number"
              value={goalWeightKg}
              onChange={(e) => setGoalWeightKg(e.target.value)}
              placeholder="55"
              className={inputClasses}
            />
            <p className="mt-1 text-[11px] text-stone-400 font-medieval">
              This helps the guild mage estimate your future form 🔮
            </p>
          </div>

          <button
            onClick={handleContinue}
            disabled={loading}
            className="
              w-full rounded-lg 
              bg-gradient-to-b from-emerald-700 to-emerald-900 
              border border-emerald-500/60
              text-emerald-50 text-sm 
              px-4 py-2.5 
              shadow-[0_0_20px_rgba(16,185,129,0.5)]
              hover:shadow-[0_0_30px_rgba(16,185,129,0.7)]
              hover:brightness-110
              disabled:opacity-60
              transition
              font-cinzel
            "
          >
            {loading ? "Summoning guild mage..." : "Enter the Quest Gate ⚔️"}
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
        />
      </div>
    </div>
  );
};

export default OnboardingScreen;
