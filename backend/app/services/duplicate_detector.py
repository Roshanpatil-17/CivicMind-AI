from difflib import SequenceMatcher
from math import asin, cos, radians, sin, sqrt

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.issue import Issue


def distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    radius = 6_371_000
    delta_lat = radians(lat2 - lat1)
    delta_lon = radians(lon2 - lon1)
    a = (
        sin(delta_lat / 2) ** 2
        + cos(radians(lat1)) * cos(radians(lat2)) * sin(delta_lon / 2) ** 2
    )
    return 2 * radius * asin(sqrt(a))


def text_similarity(left: str, right: str) -> float:
    return SequenceMatcher(None, left.lower(), right.lower()).ratio()


def find_duplicate_issue(
    db: Session,
    *,
    latitude: float,
    longitude: float,
    description: str,
    category: str,
    max_distance_meters: int = 80,
    min_similarity: float = 0.55,
) -> Issue | None:
    candidates = db.scalars(
        select(Issue).where(Issue.category == category, Issue.status != "resolved")
    ).all()

    for issue in candidates:
        nearby = distance_meters(latitude, longitude, issue.latitude, issue.longitude) <= max_distance_meters
        similar = text_similarity(description, issue.description) >= min_similarity
        if nearby and similar:
            return issue

    return None

