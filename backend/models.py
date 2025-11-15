# backend/models.py
from pydantic import BaseModel
from typing import List, Optional

# ---------- Onboarding ----------

class OnboardingRequest(BaseModel):
    user_id: str
    challenge_level: str          # "soft" | "medium" | "hard"
    diet_type: str                # "vegan", "vegetarian", etc.
    goal_type: str                # "weight_loss" | "weight_gain" | "maintenance"
    current_weight_lbs: float
    height_inch: float
    age: int
    sex: str                      # "male" | "female" | "other"
    desired_weight: int   # e.g. -500, +250

class OnboardingResponse(BaseModel):
    user_id: str
    challenge_level: str
    diet_type: str
    goal_type: str
    maintenance_calories: int
    target_calories: int
    daily_water_target_liters: float
    xp_multiplier: float
    message: str

# ---------- Meal Plan ----------

class MealItem(BaseModel):
    name: str
    calories: int
    items: List[str]

class DayPlan(BaseModel):
    day_index: int            # 1–7 within the week
    label: str                # "Day 1", "Monday", etc.
    meals: List[MealItem]

class WeeklyMealPlanRequest(BaseModel):
    user_id: str
    week_number: int          # 1–11


class WeeklyMealPlanResponse(BaseModel):
    user_id: str
    week_number: int
    target_calories: int
    days: List[DayPlan]
    shopping_list: List[str]

# ---------- Daily Log ----------

class ChecklistItem(BaseModel):
    id: str
    label: str
    completed: bool

class DailySummaryResponse(BaseModel):
    user_id: str
    date: str
    target_calories: int
    calories_eaten: int
    water_target_liters: float
    water_drank_liters: float
    checklist: List[ChecklistItem]
    xp_earned_today: int

class LogCaloriesRequest(BaseModel):
    user_id: str
    date: str
    calories: int

class LogWaterRequest(BaseModel):
    user_id: str
    date: str
    liters: float

class LogChecklistRequest(BaseModel):
    user_id: str
    date: str
    item_id: str
    completed: bool

# ---------- Activity / XP ----------

class LogWalkRequest(BaseModel):
    user_id: str
    date: str
    duration_minutes: int
    distance_km: float
    is_outdoor: bool
    found_items: List[str] = []

class LogWorkoutRequest(BaseModel):
    user_id: str
    date: str
    type: str              # "cardio", "strength", etc.
    duration_minutes: int
    is_outdoor: bool

class ChallengeCompleteRequest(BaseModel):
    user_id: str
    date: str
    challenge_type: str    # e.g. "red_car", "park_bench", etc.
    base_xp: int = 20      # default XP bonus for completing challenge

class XPResponse(BaseModel):
    user_id: str
    date: str
    xp_earned: int
    total_xp: int
    message: str
