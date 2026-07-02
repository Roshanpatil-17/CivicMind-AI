from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class ClassificationResult:
    category: str
    confidence: float


KEYWORDS = {
    "pothole": ["pothole", "road hole", "crater", "damaged road"],
    "garbage": ["garbage", "trash", "waste", "dump", "litter"],
    "broken_streetlight": ["streetlight", "street light", "lamp", "dark road"],
    "water_leakage": ["water leak", "leakage", "pipe burst", "flooding", "sewage"],
    "fallen_tree": ["fallen tree", "tree", "branch"],
}


def classify_issue(description: str, image_path: str | None = None) -> ClassificationResult:
    searchable = description.lower()
    if image_path:
        searchable = f"{searchable} {Path(image_path).name.lower()}"

    for category, keywords in KEYWORDS.items():
        if any(keyword in searchable for keyword in keywords):
            return ClassificationResult(category=category, confidence=0.82)

    return ClassificationResult(category="other", confidence=0.35)

