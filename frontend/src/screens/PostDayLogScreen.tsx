import React, { useState } from "react";

type ScreenSetter = React.Dispatch<React.SetStateAction<"onboarding" | "dashboard" | "stats" | "dayDetail" | "postDayLog">>;

interface PostDayLogProps {
  goTo: ScreenSetter;
  day: number;
}

export default function PostDayLogScreen({ goTo, day }: PostDayLogProps) {
  const [completed, setCompleted] = useState(false);
  const [reflection, setReflection] = useState("");

  return (
    <div style={{ padding: 20 }}>
      <h1>Post Day {day} Log</h1>

      <label>
        Did you complete all tasks?
        <input
          type="checkbox"
          checked={completed}
          onChange={() => setCompleted(!completed)}
          style={{ marginLeft: 10 }}
        />
      </label>

      <div style={{ marginTop: 20 }}>
        <label>
          Reflection / AI Input:
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={4}
            style={{ width: "100%", marginTop: 10 }}
          />
        </label>
      </div>

      <button
        style={{ marginTop: 30 }}
        onClick={() => goTo("dashboard")}
      >
        Save & Return to Dashboard
      </button>
    </div>
  );
}
