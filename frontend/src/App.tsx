import { useState } from "react";
import OnboardingScreen from "./screens/OnboardingScreen";
import DashboardScreen from "./screens/DashboardScreen";
import StatsScreen from "./screens/StatsScreen";
import DayDetailScreen from "./screens/DayDetailScreen";
import PostDayLogScreen from "./screens/PostDayLogScreen";
import FailedRunScreen from "./screens/FailedRunScreen"

// Which screen is visible
export type Screen =
  | "onboarding"
  | "dashboard"
  | "stats"
  | "dayDetail"
  | "postDayLog"
  |"failedRun";

// Difficulty options
export type ChallengeLevel = "soft" | "medium" | "hard";

// Profile data we collect on onboarding
export type Profile = {
  name?: string;
  challengeLevel: ChallengeLevel;
  dietType: string;
  heightCm: number;
  weightKg: number;
  sex: "male" | "female" | "other";
  age: number;
  goalWeightKg: number;

  currentDay: number;
  completedDays: number[];
  totalXP: number;
};

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lastCompletedDay, setLastCompletedDay] = useState<number | null>(null);

  return (
    <div className="App">
      {currentScreen === "onboarding" && (
        <OnboardingScreen
          goTo={setCurrentScreen}
          saveProfile={setProfile}
        />
      )}

      {currentScreen === "dashboard" && (
        <DashboardScreen
          goTo={setCurrentScreen}
          selectDay={setSelectedDay}
          profile={profile}
          lastCompletedDay={lastCompletedDay}
        />
      )}

      {currentScreen === "stats" && (
        <StatsScreen
          goTo={setCurrentScreen}
          profile={profile}
        />
      )}

      {currentScreen === "dayDetail" && selectedDay !== null && (
        <DayDetailScreen
          goTo={setCurrentScreen}
          day={selectedDay}
          profile={profile}
        />
      )}

      {currentScreen === "postDayLog" && selectedDay !== null && (
        <PostDayLogScreen
          goTo={setCurrentScreen}
          day={selectedDay}
          profile={profile}
          setProfile={setProfile}
          setLastCompletedDay={setLastCompletedDay}
        />
      )}

      {currentScreen === "failedRun" && (
        <FailedRunScreen
          goTo={setCurrentScreen}
          setProfile={setProfile}
        />
      )}
    </div>
  );
}

export default App;