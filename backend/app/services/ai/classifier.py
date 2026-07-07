from pathlib import Path

from app.services.ai.department import get_department
from app.services.ai.schemas import AIResult
from app.services.ai.severity import calculate_severity

KEYWORDS = {
    "pothole": [
        "pothole",
        "road hole",
        "crater",
        "damaged road",
    ],

    "garbage": [
        "garbage",
        "trash",
        "waste",
        "dump",
        "litter",
    ],

    "broken_streetlight": [
        "streetlight",
        "street light",
        "lamp",
        "dark road",
    ],

    "water_leakage": [
        "water leak",
        "pipe burst",
        "leakage",
        "flooding",
        "sewage",
    ],

    "fallen_tree": [
        "fallen tree",
        "tree",
        "branch",
    ],
}


def classify(
    title: str,
    description: str,
    image_path: str | None = None,
) -> AIResult:

    searchable = f"{title} {description}".lower()

    if image_path:
        searchable += " " + Path(image_path).name.lower()

    category = "other"
    confidence = 0.35

    for name, words in KEYWORDS.items():
        if any(word in searchable for word in words):
            category = name
            confidence = 0.92
            break

    department = get_department(category)

    severity = calculate_severity(
        category,
        confidence,
    )

    return AIResult(
        category=category,
        confidence=confidence,
        severity=severity,
        department=department,
    )