from enum import Enum
from typing import List, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models import (
    DayPlan,
    WeeklyMealPlanRequest,
    WeeklyMealPlanResponse,
    LogWorkoutRequest,
    LogWalkRequest,
    ChallengeCompleteRequest,
    XPResponse,
)

from gemini_client import generate_daily_meal_plan, generate_weekly_meal_plan
from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("MISSING GEMINI_API_KEY in .env")

import google.generativeai as genai
genai.configure(api_key = GEMINI_API_KEY)

# ---------- FastAPI app + CORS ----------

app = FastAPI()

# TODO: update these to your real frontend URLs/ports
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Enums for dropdowns ----------

class ChallengeLevel(str, Enum):
    soft = "soft"
    medium = "medium"
    hard = "hard"


class DietType(str, Enum):
    mediterranean = "mediterranean"
    vegan = "vegan"
    keto = "keto"
    plant_based = "plant_based"
    vegetarian = "vegetarian"
    intermittent_fasting = "intermittent_fasting"
    pescatarian = "pescatarian"
    paleo = "paleo"
    flexitarian = "flexitarian"
    low_carb = "low_carb"


class GoalType(str, Enum):
    weight_loss = "weight_loss"
    weight_gain = "weight_gain"
    maintenance = "maintenance"


# ---------- Models ----------

class OnboardingRequest(BaseModel):
    # dropdowns
    user_id: str
    challenge_level: ChallengeLevel
    diet_type: DietType
    goal_type: GoalType

    # manual input
    current_weight_kg: float
    goal_weight_kg: float
    height_cm: float
    age: int
    sex: str                      # "female", "male", etc.

    preferred_meals_per_day: int = 3


class OnboardingResponse(BaseModel):
    user_id: str
    challenge_level: ChallengeLevel
    diet_type: DietType
    goal_type: GoalType
    current_weight_kg: float
    goal_weight_kg: float
    maintenance_calories: int
    target_calories: int
    daily_water_target_liters: float
    xp_multiplier: float
    message: str


class MealItem(BaseModel):
    name: str
    calories: int
    items: List[str]


class DailyMealPlanRequest(BaseModel):
    user_id: str
    date: str  # "YYYY-MM-DD"


class DailyMealPlanResponse(BaseModel):
    user_id: str
    date: str
    target_calories: int
    meals: List[MealItem]
    shopping_list: List[str]


# ---------- In-memory "database" for hackathon ----------

user_profiles: Dict[str, Dict[str, Any]] = {}

user_xp_log: Dict[str, Dict[str, int]] = {}
# ---------- Helper functions ----------

def calculate_maintenance_calories(req: OnboardingRequest) -> int:
    """
    Rough BMR-based estimate.
    This is NOT medical advice, just for demo.
    """
    if req.sex.lower() == "female":
        bmr = 10 * req.current_weight_kg + 6.25 * req.height_cm - 5 * req.age - 161
    else:
        bmr = 10 * req.current_weight_kg + 6.25 * req.height_cm - 5 * req.age + 5

    # assume light activity
    maintenance = int(bmr * 1.4)
    return maintenance


def get_xp_multiplier(level: ChallengeLevel) -> float:
    if level == ChallengeLevel.soft:
        return 1.0
    if level == ChallengeLevel.medium:
        return 1.2
    return 1.5  # hard


def get_calorie_offset(goal_type: GoalType, level: ChallengeLevel) -> int:
    """
    Decide calorie surplus/deficit based on goal + challenge level.
    Super simplified:
      - weight_loss: small/medium/aggressive deficit
      - weight_gain: small/medium/bigger surplus
      - maintenance: 0
    """
    if goal_type == GoalType.maintenance:
        return 0

    if goal_type == GoalType.weight_loss:
        if level == ChallengeLevel.soft:
            return -300
        if level == ChallengeLevel.medium:
            return -500
        return -700  # hard

    # weight_gain:
    if level == ChallengeLevel.soft:
        return +250
    if level == ChallengeLevel.medium:
        return +400
    return +600  # hard

def add_xp(user_id: str, date: str, base_xp: int) -> XPResponse:
    profile = user_profiles.get(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="User not found.")

    xp_mult = profile.get("xp_multiplier", 1.0)
    xp_earned = int(base_xp * xp_mult)

    # update total XP
    profile["total_xp"] = profile.get("total_xp", 0) + xp_earned

    # update daily log
    if user_id not in user_xp_log:
        user_xp_log[user_id] = {}
    user_xp_log[user_id][date] = user_xp_log[user_id].get(date, 0) + xp_earned

    return XPResponse(
        user_id=user_id,
        date=date,
        xp_earned=xp_earned,
        total_xp=profile["total_xp"],
        message=f"+{xp_earned} XP earned!",
    )


def calculate_workout_xp(duration_minutes: int, is_outdoor: bool) -> int:
    # Super simple: 2 XP per minute + bonus if outdoor
    base = duration_minutes * 2
    if is_outdoor:
        base += 20  # outdoor bonus
    return base


def calculate_walk_xp(duration_minutes: int, distance_km: float, is_outdoor: bool) -> int:
    # Example: 1 XP per minute + 5 XP per km + outdoor bonus
    base = duration_minutes * 1 + int(distance_km * 5)
    if is_outdoor:
        base += 15
    return base

# ---------- Routes ----------

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/onboarding", response_model=OnboardingResponse)
def onboarding(req: OnboardingRequest):
    maintenance = calculate_maintenance_calories(req)
    calorie_offset = get_calorie_offset(req.goal_type, req.challenge_level)
    target = maintenance + calorie_offset

    water_target = round(req.current_weight_kg * 0.035, 1)  # ~35ml per kg
    xp_mult = get_xp_multiplier(req.challenge_level)

    # Store full profile for later use (e.g., meal plans, XP, etc.)
    user_profiles[req.user_id] = {
        "user_id": req.user_id,
        "challenge_level": req.challenge_level.value,
        "diet_type": req.diet_type.value,
        "goal_type": req.goal_type.value,
        "current_weight_kg": req.current_weight_kg,
        "goal_weight_kg": req.goal_weight_kg,
        "height_cm": req.height_cm,
        "age": req.age,
        "sex": req.sex,
        "preferred_meals_per_day": req.preferred_meals_per_day,
        "maintenance_calories": maintenance,
        "target_calories": target,
        "daily_water_target_liters": water_target,
        "xp_multiplier": xp_mult,
        "total_xp": 0,
    }

    msg = (
        f"You're set up for a {req.challenge_level.value} challenge with "
        f"{req.goal_type.value.replace('_', ' ')} from {req.current_weight_kg}kg "
        f"to {req.goal_weight_kg}kg."
    )

    return OnboardingResponse(
        user_id=req.user_id,
        challenge_level=req.challenge_level,
        diet_type=req.diet_type,
        goal_type=req.goal_type,
        current_weight_kg=req.current_weight_kg,
        goal_weight_kg=req.goal_weight_kg,
        maintenance_calories=maintenance,
        target_calories=target,
        daily_water_target_liters=water_target,
        xp_multiplier=xp_mult,
        message=msg,
    )


@app.post("/api/mealplan/daily", response_model=DailyMealPlanResponse)
def daily_meal_plan(req: DailyMealPlanRequest):
    profile = user_profiles.get(req.user_id)
    if not profile:
        raise HTTPException(
            status_code=404,
            detail="User not found. Complete onboarding first.",
        )

    target = profile["target_calories"]

    meal_data = generate_daily_meal_plan(
        target_calories=target,
        goal=profile["goal_type"],
        diet=profile["diet_type"],
        meals_per_day=profile["preferred_meals_per_day"]
    )

    meals = [MealItem(**m) for m in meal_data.get("meals", [])]
    shopping_list = meal_data.get("shopping_list", [])

    return DailyMealPlanResponse(
        user_id=req.user_id,
        date=req.date,
        target_calories=target,
        meals=meals,
        shopping_list=shopping_list,
    )

@app.post("/api/mealplan/week", response_model=WeeklyMealPlanResponse)
def weekly_meal_plan(req: WeeklyMealPlanRequest):
    profile = user_profiles.get(req.user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="User not found. Complete onboarding first.")

    if not (1 <= req.week_number <= 11):
        raise HTTPException(status_code=400, detail="week_number must be between 1 and 11.")

    target = profile["target_calories"]

    week_plan_data = generate_weekly_meal_plan(
        target_calories=target,
        goal=profile["goal_type"],
        diet=profile["diet_type"],
        meals_per_day=profile["preferred_meals_per_day"]
    )

    days: List[DayPlan] = []
    for d in week_plan_data["days"]:
        meals = [MealItem(**m) for m in d["meals"]]
        days.append(DayPlan(day_index=d["day_index"], label = d["label"], meals = meals))

    return WeeklyMealPlanResponse(
        user_id=req.user_id,
        week_number=req.week_number,
        target_calories=target,
        days=days,
        shopping_list=week_plan_data["shopping_list"],
    )


# ------------- walks, workout, challenge
@app.post("/api/log/workout", response_model=XPResponse)
def log_workout(req: LogWorkoutRequest):
    """
    Called when the user logs a workout.
    Frontend decides indoor vs outdoor; outdoor gives more XP.
    """
    base_xp = calculate_workout_xp(req.duration_minutes, req.is_outdoor)
    result = add_xp(req.user_id, req.date, base_xp)

    where = "outdoor" if req.is_outdoor else "indoor"
    result.message = (
        f"Logged {req.duration_minutes} min {where} {req.type} workout. {result.message}"
    )
    return result

@app.post("/api/log/walk", response_model=XPResponse)
def log_walk(req: LogWalkRequest):
    """
    Called when the user finishes a walk.
    Frontend calculates distance & indoor/outdoor.
    """
    base_xp = calculate_walk_xp(req.duration_minutes, req.distance_km, req.is_outdoor)
    result = add_xp(req.user_id, req.date, base_xp)

    where = "outdoor" if req.is_outdoor else "indoor"
    result.message = (
        f"Logged {req.duration_minutes} min {where} walk ({req.distance_km} km). {result.message}"
    )
    return result


@app.post("/api/challenge/complete", response_model=XPResponse)
def complete_challenge(req: ChallengeCompleteRequest):
    """
    Called when the user completes a micro-challenge during a walk/workout.
    For now we trust the frontend that the challenge is legit.
    Later, you can plug Gemini image verification in here.
    """
    # You can make XP depend on challenge_type if you want
    base_xp = req.base_xp
    result = add_xp(req.user_id, req.date, base_xp)

    result.message = (
        f"Challenge '{req.challenge_type}' completed. {result.message}"
    )
    return result
