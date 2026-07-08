from ultralytics import YOLO

model = YOLO("models/pothole.pt")

results = model("uploads/test.jpg")

print(results)