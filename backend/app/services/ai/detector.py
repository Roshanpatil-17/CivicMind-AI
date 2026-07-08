from app.services.ai.classifier import classify
from app.services.ai.model_loader import load_model
from app.services.ai.schemas import AIResult, Detection


def detect(
    title: str,
    description: str,
    image_path: str | None = None,
) -> AIResult:

    if image_path is None:
        return classify(
            title=title,
            description=description,
            image_path=None,
        )

    model = load_model()

    results = model(image_path, verbose=False)

    detections = []

    for result in results:
        names = result.names

        for box in result.boxes:
            cls = int(box.cls[0])
            conf = float(box.conf[0])

            label = names[cls]

            # Convert class "0" into pothole
            if label == "0":
                label = "pothole"

            xyxy = box.xyxy[0].tolist()

            detections.append(
                Detection(
                    label=label,
                    confidence=conf,
                    bbox=[int(x) for x in xyxy],
                )
            )

    # Fallback if AI finds nothing
    if not detections:
        return classify(
            title=title,
            description=description,
            image_path=image_path,
        )

    best = max(detections, key=lambda x: x.confidence)

    return AIResult(
        category=best.label,
        confidence=best.confidence,
        severity="high",
        department="Road Maintenance",
        detections=detections,
    )