from dataclasses import dataclass
from typing import Optional


@dataclass
class Detection:
    label: str
    confidence: float
    bbox: Optional[list[int]] = None


@dataclass
class AIResult:
    category: str
    confidence: float
    severity: str
    department: str
    duplicate: bool = False
    detections: list[Detection] | None = None