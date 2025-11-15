import React from "react";

type ScreenSetter = React.Dispatch<React.SetStateAction<"onboarding" | "dashboard" | "stats" | "dayDetail" | "postDayLog">>;

export default function StatsScreen({ goTo }: { goTo: ScreenSetter }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Overall Stats</h1>
      <p>Days Completed: 3 / 5</p>
      <p>XP: 100</p>
      <p>Streak: 2 days</p>

      <button style={{ marginTop: 20 }} onClick={() => goTo("dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
}
