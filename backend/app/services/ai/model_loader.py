from functools import lru_cache

from ultralytics import YOLO

MODEL_PATH = "yolo11n.pt"


@lru_cache
def load_model() -> YOLO:
    print("Loading YOLO model...")
    return YOLO(MODEL_PATH)