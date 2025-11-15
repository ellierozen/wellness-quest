import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import json

# --- Flask setup ---
app = Flask(__name__)
CORS(app)  # allow requests from your frontend (different port)

# --- Gemini setup ---
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("WARNING: GEMINI_API_KEY is not set. Set it before calling Gemini.")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")


@app.route("/api/generate_quests", methods=["POST"])
def generate_quests():
    """
    Request JSON:
      {
        "level": "hard" | "medium" | "soft",
        "dayNumber": number,
        "goal": "string"
      }

    Response JSON:
      {
        "aiQuests": [{ "text": "..." }, ...],
        "story": "..."
      }
    """
    data = request.get_json() or {}
    level = data.get("level", "soft")
    day = data.get("dayNumber", 1)
    goal = data.get("goal", "wellness")

    prompt = f"""
You are a supportive wellness RPG quest master.

The user is on day {day} of a 75-day {level.upper()} challenge.
Their main goal is: {goal}.

1) Create 3 short, practical "side quests" for today.
   - hard: strict, discipline-heavy
   - medium: moderate challenge
   - soft: gentle, self-compassionate

2) Write a 3–4 sentence fantasy-style story chapter for today's journey,
   in second person ("you").

Return ONLY valid JSON in this exact format:
{{
  "aiQuests": [{{ "text": "quest 1" }}, {{ "text": "quest 2" }}, {{ "text": "quest 3" }}],
  "story": "story text here"
}}
"""

    try:
        result = model.generate_content(prompt)
        text = result.text.strip()

        # Try to parse JSON from Gemini
        parsed = json.loads(text)
        return jsonify(parsed)
    except Exception as e:
        print("Error in /api/generate_quests:", e)
        # Fallback so frontend still works if Gemini fails
        return jsonify({
            "aiQuests": [
                {"text": "Take a 10-minute walk outside."},
                {"text": "Write down 3 things you're grateful for."},
                {"text": "Plan one small task for tomorrow."},
            ],
            "story": f"Day {day}: You push forward on your quest toward {goal}, "
                     "choosing small actions that build your future self."
        }), 200


@app.route("/api/analyze_photo", methods=["POST"])
def analyze_photo():
    """
    Expects form-data:
      image: file
      goal: string (optional)

    Response JSON:
      { "message": "reflection text" }
    """
    image_file = request.files.get("image")
    goal = request.form.get("goal", "wellness")

    if not image_file:
        return jsonify({"error": "no_image"}), 400

    image_bytes = image_file.read()
    mime_type = image_file.mimetype or "image/jpeg"

    prompt = f"""
You are a gentle wellness coach.

The user is on a 75-day {goal} challenge.
You are given a photo related to their day (maybe a workout, a walk, water, a meal, journaling, etc.).

1) Briefly describe what you see (1 short sentence).
2) Give 1–2 sentences of positive, non-judgmental encouragement that focuses
   on consistency, self-compassion, and habit-building.
3) Do NOT comment on body shape, weight, or appearance.

Return your response as plain text (no JSON).
"""

    try:
        img_part = {"mime_type": mime_type, "data": image_bytes}
        result = model.generate_content([prompt, img_part])
        text = result.text.strip()
        return jsonify({"message": text})
    except Exception as e:
        print("Error in /api/analyze_photo:", e)
        # Fallback if Gemini fails
        return jsonify({
            "message": "Nice job taking a step toward your goal today. Every small action matters."
        }), 200


if __name__ == "__main__":
    # debug=True reloads the server when you change app.py (good for development)
    app.run(port=5000, debug=True)
