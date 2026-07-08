from ultralytics import YOLO

model = YOLO("models/pothole.pt")

results = model("uploads/test.jpg", save=False)

for result in results:
    print("Boxes:", len(result.boxes))

    for box in result.boxes:
        cls = int(box.cls[0])
        conf = float(box.conf[0])

        print("Class:", result.names[cls])
        print("Confidence:", conf)