import React, { useRef, useEffect } from "react";
import castleImg from "../assets/castle.png"; // renamed for clarity
import runnerImg from "../assets/runner.png";

interface LevelProgressionProps {
  currentDay: number;
  totalDays: number;
  completedDays: number[];
  goToDay: (day: number) => void;
}

export default function LevelProgression({
  currentDay,
  totalDays,
  completedDays,
  goToDay,
}: LevelProgressionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Scroll to current day on mount
  useEffect(() => {
    if (containerRef.current) {
      const currentDayElement = containerRef.current.querySelector<HTMLDivElement>(
        `#day-${currentDay}`
      );
      if (currentDayElement) {
        currentDayElement.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }
  }, [currentDay]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        alignItems: "center",
        overflowX: "auto",
        padding: 75,
        gap: 100, // increase spacing between days
      }}
    >
      {days.map((day, index) => {
        const isCompleted = completedDays.includes(day);
        const isCurrent = day === currentDay;

        return (
          <div
            key={day}
            id={`day-${day}`}
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => goToDay(day)}
          >
            {/* Castle */}
            <div style={{ position: "relative" }}>
              <img
                src={castleImg}
                alt={`Day ${day}`}
                style={{
                  width: 1000,  // larger castle
                  height: 150,
                  filter: isCompleted ? "grayscale(0%)" : "grayscale(70%)",
                }}
              />

              {/* Runner character */}
              {isCurrent && (
                <img
                  src={runnerImg}
                  alt="Runner"
                  style={{
                    position: "absolute",
                    top: -20,
                    left: 0,
                    width: 30,
                    height: 30,
                  }}
                />
              )}
            </div>

            {/* Trail */}
            {index !== totalDays - 1 && (
              <div
                style={{
                  width: 100, // longer trail
                  height: 6,
                  backgroundColor: isCompleted ? "green" : "#ccc",
                  margin: "0 10px",
                  borderRadius: 3, // slightly rounded
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
