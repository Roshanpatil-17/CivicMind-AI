from pathlib import Path

from app.services.ai.classifier import classify
from app.services.ai.model_loader import load_model
from app.services.ai.schemas import AIResult, Detection


def detect(
    title: str,
    description: str,
    image_path: str | None = None,
) -> AIResult:
    
    print("🚀 detect() function called")

    # Fallback if no image
    if image_path is None:
        return classify(
            title=title,
            description=description,
            image_path=None,
        )

    # Load YOLO model
    model = load_model()

    # Run detection
    results = model(image_path, verbose=False)

    # Debug prints
    print(f"Image path: {image_path}")
    print(f"File exists: {Path(image_path).exists()}")
    print(f"YOLO returned {len(results)} result(s)")

    detections = []

    for result in results:

        print(result)

        names = result.names

        for box in result.boxes:

            cls = int(box.cls[0])
            conf = float(box.conf[0])
            label = names[cls]
            xyxy = box.xyxy[0].tolist()

            detections.append(
                Detection(
                    label=label,
                    confidence=conf,
                    bbox=[int(x) for x in xyxy],
                )
            )

    # Print all detected objects
    for detection in detections:
        print(f"Detected: {detection.label} ({detection.confidence:.2f})")

    # If nothing detected, fall back to keyword classifier
    if not detections:
        return classify(
            title=title,
            description=description,
            image_path=image_path,
        )

    # Highest confidence detection
    best = max(detections, key=lambda x: x.confidence)

    return AIResult(
        category=best.label,
        confidence=best.confidence,
        severity="medium",
        department="AI Detection",
        detections=detections,
    )