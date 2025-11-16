import google.generativeai as genai
import json
from typing import List, Dict

model = genai.GenerativeModel("gemini-2.5-flash")

def generate_daily_meal_plan(target_calories: int, goal: str, diet: str, meals_per_day: int = 3):
    schema = {
        "type": "object",
        "properties": {
            "meals": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string"},
                        "calories": {"type": "integer"},
                        "items": {
                            "type": "array",
                            "items": {"type": "string"}
                        }
                    },
                    "required": ["name", "calories", "items"]
                }
            },
            "shopping_list": {
                "type": "array",
                "items": {"type": "string"}
            }
        },
        "required": ["meals", "shopping_list"]
    }

    prompt = f"""
You are a helpful nutrition assistant. Generate a daily meal plan
for a user with the following profile:

- Target calories: {target_calories}
- Goal: {goal}
- Diet: {diet}
- Preferred meals per day: {meals_per_day}

Return JSON that matches the schema EXACTLY.
Do NOT include commentary, markdown, or any explanations.
"""

    generation_config = {
        "temperature": 0.2,
        "max_output_tokens": 4096,
        "response_mime_type": "application/json",
        "response_schema": schema,
    }

    try:
        response = model.generate_content(
            prompt,
            generation_config=generation_config,
        )
        return response.text
    except Exception as e:
        print("\n--- GEMINI API ERROR ---")
        print("Failed to generate structured content for daily meal plan. Error:", e)
        print("--- END GEMINI ERROR ---\n")
        return {"meals": [], "shopping_list": []}


def generate_weekly_meal_plan(target_calories: int, goal: str, diet: str, meals_per_day: int = 3):
    WEEKLY_SCHEMA = {
        "type": "object",
        "properties": {
            "days": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "day_index": {"type": "integer"},
                        "label": {"type": "string"},
                        "meals": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "name": {"type": "string"},
                                    "calories": {"type": "integer"},
                                    "items": {
                                        "type": "array",
                                        "items": {"type": "string"}
                                    }
                                },
                                "required": ["name", "calories", "items"]
                            }
                        }
                    },
                    "required": ["day_index", "label", "meals"]
                }
            },
            "shopping_list": {
                "type": "array",
                "items": {"type": "string"},
                "description": "A consolidated, alphabetized, and de-duplicated shopping list for the entire week's meals."
            }
        },
        "required": ["days", "shopping_list"]
    }

    prompt = f"""
You are a professional dietitian. Generate a varied and detailed 7-day meal plan
for a user with the following goals and preferences:

- Target calories per day: {target_calories}
- Health Goal: {goal}
- Diet Restriction: {diet}
- Meals per day: {meals_per_day}

Ensure variety across the week. For each of the 7 days (day_index 1 through 7),
provide a meal plan. Also, generate one consolidated, alphabetized, and de-duplicated
shopping list for ALL 7 days.

Return JSON that matches the schema EXACTLY.
"""

    generation_config = {
        "temperature": 0.2,
        "max_output_tokens": 4096,
        "response_mime_type": "application/json",
        "response_schema": WEEKLY_SCHEMA,
    }

    try:
        response = model.generate_content(
            prompt,
            generation_config=generation_config,
        )
        return response.text
    except Exception as e:
        print("\n--- GEMINI WEEKLY API ERROR ---")
        print("Failed to generate structured content for weekly meal plan. Error:", e)
        print("--- END GEMINI ERROR ---\n")
        return {"days": [], "shopping_list": []}
