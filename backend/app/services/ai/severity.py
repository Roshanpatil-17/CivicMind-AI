from app.services.ai.schemas import AIResult


def calculate_severity(
    category: str,
    confidence: float,
    duplicate: bool = False,
) -> str:
    score = 0

    # Category importance
    if category == "water_leakage":
        score += 4

    elif category in {
        "pothole",
        "fallen_tree",
        "broken_streetlight",
    }:
        score += 3

    elif category == "garbage":
        score += 2

    else:
        score += 1

    # AI confidence
    if confidence >= 0.90:
        score += 2

    elif confidence >= 0.75:
        score += 1

    # Duplicate reports indicate urgency
    if duplicate:
        score += 1

    if score >= 6:
        return "critical"

    if score >= 5:
        return "high"

    if score >= 3:
        return "medium"

    return "low"