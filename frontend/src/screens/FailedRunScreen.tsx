// src/screens/FailedRunScreen.tsx
import React from "react";
import type { Screen, Profile } from "../App";
import Vine from "../assets/vines/vine.png";
import Wall from "../assets/wall/wall.png";

type ScreenSetter = React.Dispatch<React.SetStateAction<Screen>>;

interface FailedRunProps {
  goTo: ScreenSetter;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

const FailedRunScreen: React.FC<FailedRunProps> = ({ goTo, setProfile }) => {
  const handleRestart = () => {
    // Hard reset — wipe profile
    setProfile(null);
    goTo("onboarding");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: `url(${Wall})`,
        backgroundColor: "rgba(0,0,0,0.6)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div
        className="
          relative mx-auto
          w-full max-w-sm
          scale-[0.85] sm:scale-100
        "
      >
        {/* MAIN CARD */}
        <div
          className="
            relative z-10
            rounded-xl
            border border-stone-700/60
            bg-[rgba(40,20,20,0.95)]
            p-4 sm:p-6
            shadow-[0_0_30px_rgba(0,0,0,0.9)]
            backdrop-blur-sm
            text-stone-100
            font-medieval
          "
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-rose-300/80 font-cinzel">
            Quest Failed
          </p>

          <h1 className="mt-1 text-2xl sm:text-3xl font-cinzel text-rose-200 drop-shadow-lg">
            The Oath Was Broken 🥀
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-stone-200 font-medieval">
            You didn’t follow the rules today.  
            A true warrior learns from defeat.
          </p>

          <p className="mt-2 text-[11px] text-stone-400 font-medieval">
            Restart to begin a fresh 75-day journey.
          </p>

          <div className="mt-5 space-y-2">
            <button
              onClick={handleRestart}
              className="
                w-full rounded-lg
                bg-linear-to-b from-emerald-700 to-emerald-900
                border border-emerald-500/60
                text-emerald-50 text-sm
                px-4 py-2.5
                shadow-[0_0_20px_rgba(16,185,129,0.6)]
                hover:shadow-[0_0_30px_rgba(16,185,129,0.8)]
                hover:brightness-110
                transition
                font-cinzel
              "
            >
              Restart from Quest Gate 🛡️
            </button>

            <button
              onClick={() => goTo("dashboard")}
              className="
                w-full rounded-lg
                border border-stone-700
                bg-[rgba(30,20,20,0.9)]
                text-[12px] text-stone-300
                px-4 py-2
                hover:border-stone-500
                hover:text-stone-100
                transition
                font-medieval
              "
            >
              Return to Guild Map
            </button>
          </div>
        </div>

        {/* VINES */}
        <img
          src={Vine}
          alt=""
          className="absolute -top-3 -left-3 w-20 opacity-90 rotate-90"
        />
        <img
          src={Vine}
          alt=""
          className="absolute -top-3 -right-3 w-20 opacity-90 rotate-180"
        />
        <img
          src={Vine}
          alt=""
          className="absolute -bottom-3 -left-3 w-20 opacity-90"
        />
        <img
          src={Vine}
          alt=""
          className="absolute -bottom-3 -right-3 w-20 opacity-90 rotate-270"
        />
      </div>
    </div>
  );
};

export default FailedRunScreen;
