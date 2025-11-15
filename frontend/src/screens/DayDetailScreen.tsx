import React, { useState } from "react";

type ScreenSetter = React.Dispatch<React.SetStateAction<"onboarding" | "dashboard" | "stats" | "dayDetail" | "postDayLog">>;

interface DayDetailProps {
  goTo: ScreenSetter;
  day: number;
}

export default function DayDetailScreen({ goTo, day }: DayDetailProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));

    // TODO: call backend /api/analyze_photo and save reflection
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Day {day} Goals</h1>

      <ul>
        <li>
          <input type="checkbox" /> Drink Water
        </li>
        <li>
          <input type="checkbox" /> Walk 5 minutes
        </li>
        <li>
          <input type="checkbox" /> Find a red object 📸
        </li>
      </ul>

      <div style={{ marginTop: 20 }}>
        <label>
          Take a photo:
          <input type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} />
        </label>
      </div>

      {previewUrl && (
        <div style={{ marginTop: 20 }}>
          <h3>Preview:</h3>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%" }} />
        </div>
      )}

      <button style={{ marginTop: 30 }} onClick={() => goTo("postDayLog")}>
        Go to Post Day Log
      </button>
    </div>
  );
}
