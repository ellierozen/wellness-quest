import { useState } from 'react'
import OnboardingScreen from "./screens/OnboardingScreen";
import DashboardScreen from "./screens/DashboardScreen";
import StatsScreen from "./screens/StatsScreen";
import DayDetailScreen from "./screens/DayDetailScreen";
import PostDayLogScreen from "./screens/PostDayLogScreen";

function App() {
  type Screen =
    | "onboarding"
    | "dashboard"
    | "stats"
    | "dayDetail"
    | "postDayLog";

  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  return (
    <div className="App">
      {currentScreen === "onboarding" && (
        <OnboardingScreen goTo={setCurrentScreen} />
      )}

      {currentScreen === "dashboard" && (
        <DashboardScreen
          goTo={setCurrentScreen}
          selectDay={setSelectedDay}
        />
      )}

      {currentScreen === "stats" && <StatsScreen goTo={setCurrentScreen} />}

      {currentScreen === "dayDetail" && selectedDay !== null && (
        <DayDetailScreen goTo={setCurrentScreen} day={selectedDay} />
      )}

      {currentScreen === "postDayLog" && selectedDay !== null && (
        <PostDayLogScreen goTo={setCurrentScreen} day={selectedDay} />
      )}
    </div>
  );
}

export default App
