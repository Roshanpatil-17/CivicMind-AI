from app.services.ai.model_loader import load_model

model = load_model()

print("✅ Model loaded successfully")
print(model.names)