/* eslint-disable react-hooks/set-state-in-effect */
import React, { useRef, useEffect, useState } from "react";
import castleImg from "../assets/castle.png";
import runnerImg from "../assets/runner.png";

interface LevelProgressionProps {
  currentDay: number;
  totalDays: number;
  completedDays: number[];
  goToDay: (day: number) => void;
  lastCompletedDay?: number | null;
}

// helper to compute the path point for a given index
function computePoint(
  index: number,
  horizontalSpacing: number,
  startX: number,
  baseY: number,
  offsets: number[]
) {
  const x = startX + index * horizontalSpacing;
  const y = baseY + offsets[index % offsets.length];
  return { x, y };
}

export default function LevelProgression({
  currentDay,
  totalDays,
  completedDays,
  goToDay,
  lastCompletedDay,
}: LevelProgressionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  // layout constants
  const horizontalSpacing = 160;
  const startX = 120;
  const baseY = 160;
  const mapHeight = 260;
  const offsets = React.useMemo(() => [0, -25, 15, -18, 20, -10],[]);
  

  const mapWidth =
    startX * 2 + (days.length - 1) * horizontalSpacing;

  // squiggly path for the trail
  const pathD = days
    .map((_, index) => {
      const { x, y } = computePoint(
        index,
        horizontalSpacing,
        startX,
        baseY,
        offsets
      );
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  // knight position, starts at lastCompletedDay
  const [knightPos, setKnightPos] = useState(() => {
    const startDay = lastCompletedDay ?? currentDay;
    const idx = Math.max(0, startDay - 1);
    return computePoint(idx, horizontalSpacing, startX, baseY, offsets);
  });

  // scroll to current castle
  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current.querySelector<HTMLDivElement>(
        `#day-${currentDay}`
      );
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [currentDay]);

  // animate knight from lastCompletedDay -> currentDay
  useEffect(() => {
    const targetIdx = Math.max(0, currentDay - 1);
    const targetPoint = computePoint(
      targetIdx,
      horizontalSpacing,
      startX,
      baseY,
      offsets
    );

    if (lastCompletedDay) {
      const fromIdx = Math.max(0, lastCompletedDay - 1);
      const fromPoint = computePoint(
        fromIdx,
        horizontalSpacing,
        startX,
        baseY,
        offsets
      );

      // start at the castle we just finished
      setKnightPos(fromPoint);

      // then animate to the new currentDay castle
      const id = requestAnimationFrame(() => {
        setKnightPos(targetPoint);
      });

      return () => cancelAnimationFrame(id);
    } else {
      setKnightPos(targetPoint);
    }
  }, [currentDay, lastCompletedDay, horizontalSpacing, startX, baseY, offsets]);

  return (
    <div
      ref={containerRef}
      style={{
        overflowX: "auto",
        overflowY: "hidden",
        padding: "8px 0",
      }}
    >
      <div
        style={{
          position: "relative",
          height: mapHeight,
          width: mapWidth,
        }}
      >
        {/* squiggly trail */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          preserveAspectRatio="none"
        >
          <path
            d={pathD}
            fill="none"
            stroke="#9b6b3b"
            strokeWidth={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* castles */}
        {days.map((day, index) => {
          const { x, y } = computePoint(
            index,
            horizontalSpacing,
            startX,
            baseY,
            offsets
          );
          const isCompleted = completedDays.includes(day);

          return (
            <div
              key={day}
              id={`day-${day}`}
              onClick={() => goToDay(day)}
              style={{
                position: "absolute",
                left: x - 60,
                top: y - 130,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <img
                src={castleImg}
                alt={`Day ${day}`}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "contain",
                  filter: isCompleted ? "grayscale(0%)" : "grayscale(70%)",
                }}
              />
              <div
                style={{
                  marginTop: 4,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fef3c7",
                  textShadow: "0 0 4px rgba(0,0,0,0.8)",
                }}
              >
                {day}
              </div>
            </div>
          );
        })}

        {/* knight */}
        <img
          src={runnerImg}
          alt="Runner"
          style={{
            position: "absolute",
            left: knightPos.x - 40,
            top: knightPos.y - 80,
            width: 80,
            height: 80,
            transform: "scaleX(-1)",
            pointerEvents: "none",
            transition:
              "left 2.0s cubic-bezier(0.16, 1, 0.3, 1), top 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
    </div>
  );
}
