import React from "react";

type ScreenSetter = React.Dispatch<React.SetStateAction<"onboarding" | "dashboard" | "stats" | "dayDetail" | "postDayLog">>;

interface DashboardProps {
  goTo: ScreenSetter;
  selectDay: (day: number) => void;
}

export default function DashboardScreen({ goTo, selectDay }: DashboardProps) {
  const days = Array.from({ length: 5 }, (_, i) => i + 1); // placeholder 5 days

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard</h1>
      <p>Total XP: 100 (placeholder)</p>
      <p>Level: Medium</p>

      <h2>Pick a Day:</h2>
      <ul>
        {days.map((day) => (
          <li key={day}>
            <button
              onClick={() => {
                selectDay(day);
                goTo("dayDetail");
              }}
            >
              Day {day}
            </button>
          </li>
        ))}
      </ul>

      <button style={{ marginTop: 20 }} onClick={() => goTo("stats")}>
        View Overall Stats
      </button>
    </div>
  );
}
