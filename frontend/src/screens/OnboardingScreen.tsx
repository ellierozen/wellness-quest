import React, { useState } from "react";
import type { Screen, Profile, ChallengeLevel } from "../App";

type ScreenSetter = React.Dispatch<React.SetStateAction<Screen>>;
type ProfileSetter = React.Dispatch<React.SetStateAction<Profile | null>>;

interface OnboardingProps {
  goTo: ScreenSetter;
  saveProfile: ProfileSetter;
}

const OnboardingScreen: React.FC<OnboardingProps> = ({ goTo, saveProfile }) => {
  const [name, setName] = useState("");
  const [challengeLevel, setChallengeLevel] = useState<ChallengeLevel>("soft");
  const [dietType, setDietType] = useState("No specific diet");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [sex, setSex] = useState<"male" | "female" | "other">("other");
  const [age, setAge] = useState("");
  const [goalWeightKg, setGoalWeightKg] = useState("");

  const handleContinue = () => {
    if (!heightCm || !weightKg || !age || !goalWeightKg) {
      alert("The guild needs your stats, adventurer! ⚔️");
      return;
    }

    saveProfile({
      name: name || undefined,
      challengeLevel,
      dietType,
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      sex,
      age: Number(age),
      goalWeightKg: Number(goalWeightKg),
      currentDay: 1,
      completedDays: [],
    });

    goTo("dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700/70 bg-slate-900/90 shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-6">
        {/* Header */}
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Order of Wellness
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-50 flex items-center gap-2">
            Wellness Quest 75
            <span className="text-lg">🛡️</span>
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Create your adventurer profile to begin your 75-day quest.
          </p>
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Adventurer name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Knight of UCR"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>

        {/* Challenge level */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Choose your path
          </label>
          <div className="flex gap-2 mt-1">
            {([
              ["soft", "🍃 Soft"],
              ["medium", "⚔️ Medium"],
              ["hard", "🐉 Hard"],
            ] as [ChallengeLevel, string][]).map(([value, label]) => {
              const active = challengeLevel === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setChallengeLevel(value)}
                  className={[
                    "flex-1 rounded-full px-2 py-2 text-xs font-medium border transition",
                    active
                      ? "border-violet-400 bg-gradient-to-b from-violet-700/70 to-slate-900 text-slate-50 shadow-[0_0_20px_rgba(139,92,246,0.45)]"
                      : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Diet */}
        <div className="mb-3">
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Type of diet
          </label>
          <input
            value={dietType}
            onChange={(e) => setDietType(e.target.value)}
            placeholder="High protein, balanced, vegetarian, etc."
            className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>

        {/* Height / Weight */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="165"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="60"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>
        </div>

        {/* Sex & Age */}
        <div className="grid grid-cols-[1.4fr_1fr] gap-2 mb-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Class (sex)
            </label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value as any)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="19"
              className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>
        </div>

        {/* Goal weight */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-slate-300 mb-1">
            End goal weight (kg)
          </label>
          <input
            type="number"
            value={goalWeightKg}
            onChange={(e) => setGoalWeightKg(e.target.value)}
            placeholder="55"
            className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            This helps the guild mage estimate your future form 🔮
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          className="w-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-50 shadow-[0_12px_30px_rgba(79,70,229,0.6)] hover:brightness-110 transition"
        >
          Enter the Quest Gate ⚔️
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
