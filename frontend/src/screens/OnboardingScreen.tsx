import React from "react";

type ScreenSetter = React.Dispatch<React.SetStateAction<"onboarding" | "dashboard" | "stats" | "dayDetail" | "postDayLog">>;

export default function OnboardingScreen({ goTo }: { goTo: ScreenSetter }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to Wellness Quest</h1>
      <p>Enter your name, pick a level, and set a goal (placeholder)</p>
      <button onClick={() => goTo("dashboard")} style={{ marginTop: 20 }}>
        Continue
      </button>
    </div>
  );
}
