from functools import lru_cache
from pathlib import Path

from ultralytics import YOLO

MODEL_PATH = Path("models/pothole.pt")


@lru_cache
def load_model() -> YOLO:
    print("🚀 Loading Pothole AI Model...")
    return YOLO(str(MODEL_PATH))