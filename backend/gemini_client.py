import json
import google.generativeai as genai
from models import MealItem
from typing import List, Dict


model = genai.GenerativeModel("gemini-2.5-flash")

def generate_daily_meal_plan(target_calories: int, goal: str, diet: str, meals_per_day: int = 3):
    prompt = f"""
You are a helpful nutrition assistant. Generate a daily meal plan
for a user with the following profile:

- Target calories: {target_calories}
- Goal: {goal}
- Diet: {diet}
- Preferred meals per day: {meals_per_day}

Output ONLY valid JSON with this structure:
{{
  "meals": [
    {{"name": "string", "calories": int, "items": ["string", "..."]}},
    ...
  ],
  "shopping_list": ["string", "..."]
}}
No extra commentary, no markdown.
"""
    try:
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.3,
                "max_output_tokens": 500,
            },
        )

        # ---- SAFER ACCESS TO TEXT ----
        if not response.candidates:
            raise ValueError("No candidates returned from Gemini")

        cand = response.candidates[0]
        print("Gemini finish_reason:", cand.finish_reason)

        if not cand.content or not getattr(cand.content, "parts", None):
            raise ValueError("Candidate has no content parts")

        # Collect all text parts into one string
        text_chunks = []
        for part in cand.content.parts:
            if hasattr(part, "text"):
                text_chunks.append(part.text)

        raw_text = "\n".join(text_chunks).strip()
        print("RAW GEMINI TEXT:", raw_text)

        # Strip ```json fences if present
        cleaned = raw_text
        if cleaned.startswith("```"):
            lines = cleaned.splitlines()
            inner_lines = [line for line in lines if not line.strip().startswith("```")]
            cleaned = "\n".join(inner_lines).strip()

        print("CLEANED TEXT BEFORE JSON PARSE:", cleaned)

        result = json.loads(cleaned)

    except Exception as e:
        print("Error parsing Gemini response:", e)
        # Fallback: simple default
        result = {
            "meals": [
                {"name": "Breakfast", "calories": int(target_calories * 0.25), "items": ["Oatmeal", "Berries"]},
                {"name": "Lunch", "calories": int(target_calories * 0.35), "items": ["Grain bowl with veggies"]},
                {"name": "Dinner", "calories": int(target_calories * 0.40), "items": ["Stir-fry with protein and vegetables"]},
            ],
            "shopping_list": ["Oats", "Berries", "Veggies", "Protein source", "Rice/Quinoa"]
        }

    return result


def generate_weekly_meal_plan(target_calories: int, goal: str, diet: str, meals_per_day: int = 3):
    from datetime import datetime, timedelta

    days: List[Dict] = []
    combined_shopping_list: List[str] = []

    for i in range(7):
        day_date = (datetime.today() + timedelta(days=i)).strftime("%Y-%m-%d")
        daily_plan = generate_daily_meal_plan(
            target_calories=target_calories,
            goal=goal,
            diet=diet,
            meals_per_day=meals_per_day
        )

        # Add day info
        days.append({
            "day_index": i + 1,
            "label": f"Day {i + 1}",
            "meals": daily_plan.get("meals", [])
        })

        # Merge shopping lists without duplicates
        for item in daily_plan.get("shopping_list", []):
            if item not in combined_shopping_list:
                combined_shopping_list.append(item)

    return {
        "days": days,
        "shopping_list": combined_shopping_list
    }
