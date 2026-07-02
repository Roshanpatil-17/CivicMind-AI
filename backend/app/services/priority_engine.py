from datetime import datetime, timezone

from app.models.issue import Issue

CRITICAL_CATEGORIES = {"water_leakage"}
HIGH_CATEGORIES = {"pothole", "fallen_tree", "broken_streetlight"}


def calculate_priority(category: str, confidence: float, duplicate_of: Issue | None = None) -> str:
    score = 0

    if category in CRITICAL_CATEGORIES:
        score += 4
    elif category in HIGH_CATEGORIES:
        score += 3
    elif category == "garbage":
        score += 2
    else:
        score += 1

    if confidence >= 0.75:
        score += 1

    if duplicate_of is not None:
        age_hours = (datetime.now(timezone.utc) - duplicate_of.created_at).total_seconds() / 3600
        score += 1 if age_hours >= 24 else 0

    if score >= 5:
        return "critical"
    if score >= 4:
        return "high"
    if score >= 2:
        return "medium"
    return "low"

