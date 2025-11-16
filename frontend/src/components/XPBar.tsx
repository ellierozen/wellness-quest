/* eslint-disable react-refresh/only-export-components */
import { useMemo } from "react";

export type LevelDef = {
  id: number;
  title: string;
  threshold: number; // cumulative XP required to reach this level
};

// Linear XP per completed day
export const XP_PER_DAY = 40;

// Levels - cumulative thresholds up to final
export const LEVEL_DEFINITIONS: LevelDef[] = [
  { id: 1, title: "Initiate", threshold: 0 },
  { id: 2, title: "Pathfinder", threshold: 100 },
  { id: 3, title: "Habit Explorer", threshold: 250 },
  { id: 4, title: "Focus Adept", threshold: 450 },
  { id: 5, title: "Ritual Knight", threshold: 700 },
  { id: 6, title: "Discipline Warden", threshold: 1000 },
  { id: 7, title: "Master of Habit", threshold: 1400 },
  { id: 8, title: "Ascended Champion", threshold: 1850 },
  { id: 9, title: "Evergrowth Sage", threshold: 2350 },
  { id: 10, title: "Legend of Day 75", threshold: 3000 },
];

// compute which level you're on and progress toward next level
export function computeLevelFromXP(xp: number) {
  const levels = LEVEL_DEFINITIONS;
  let current = levels[0];
  let next = levels[levels.length - 1];

  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].threshold) {
      current = levels[i];
      next = levels[i + 1] ?? levels[i]; // if last level, next==current
    } else {
      next = levels[i];
      break;
    }
  }

  // If xp >= last threshold we are at final level
  const atFinal = xp >= levels[levels.length - 1].threshold;
  const nextThreshold = atFinal
    ? levels[levels.length - 1].threshold
    : next.threshold;
  const currThreshold = current.threshold;

  const progressInLevel = Math.max(
    0,
    Math.min(
      1,
      (xp - currThreshold) / Math.max(1, nextThreshold - currThreshold)
    )
  );

  return {
    currentLevel: current,
    nextLevel: next,
    progress: progressInLevel,
    atFinal,
  };
}

interface XPBarProps {
  totalXP: number;
  // optional: show small label
  compact?: boolean;
}

export default function XPBar({ totalXP, compact = false }: XPBarProps) {
  const { currentLevel, nextLevel, progress, atFinal } = useMemo(
    () => computeLevelFromXP(totalXP),
    [totalXP]
  );

  const pct = Math.round(progress * 100);

  return (
    <div className={`w-full ${compact ? "text-sm" : "text-base"}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wide">
            Guild Rank
          </div>
          <div className="font-semibold text-slate-100">
            {`Level ${currentLevel.id} • ${currentLevel.title}`}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Total XP</div>
          <div className="font-semibold text-emerald-300">
            {totalXP} XP
          </div>
        </div>
      </div>

      {/* bar container */}
      <div className="relative w-full h-4 rounded-full bg-slate-800 overflow-hidden">
        {/* neon gradient fill */}
        <div
          aria-hidden
          style={{
            width: `${pct}%`,
            transition: "width 600ms ease",
            height: "100%",
            background: "linear-gradient(90deg, #7CFC00, #00FF7F, #7FFFD4)",
            boxShadow: "0 0 12px rgba(124,252,0,0.35)",
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
        <div>
          {atFinal ? (
            <span>Max Rank reached</span>
          ) : (
            <span>
              {totalXP} / {nextLevel.threshold} XP
            </span>
          )}
        </div>
        <div className="text-slate-300">
          {pct}% 
        </div>
      </div>
    </div>
  );
}
