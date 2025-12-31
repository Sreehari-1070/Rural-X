import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import os

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL_PATH = r"C:\Users\TR Sreehari\Desktop\crop_model\crop_disease_model.pth"
IMAGE_PATH = r"C:\Users\TR Sreehari\Desktop\crop_model\dataset\train\maize_blight\Corn_Blight (1).jpg"

try:
    if not os.path.exists(MODEL_PATH):
        print(f"Model not found at {MODEL_PATH}")
        exit()

    # Load checkpoint
    checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
    class_names = checkpoint["class_names"]
    NUM_CLASSES = len(class_names)
    print("Model loaded successfully")
    print("Classes found:", class_names)

    # Build model
    model = models.mobilenet_v2(weights=None)
    model.classifier[1] = nn.Linear(model.last_channel, NUM_CLASSES)
    model.load_state_dict(checkpoint["model_state"])
    model.to(DEVICE)
    model.eval()

    # Load test image
    if not os.path.exists(IMAGE_PATH):
        print(f"Image not found at {IMAGE_PATH}")
        exit()
        
    img = Image.open(IMAGE_PATH).convert("RGB")

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor()
    ])

    # Prepare input
    tensor_img = transform(img)
    tensor_img = tensor_img.unsqueeze(0)  # type: ignore
    tensor_img = tensor_img.to(DEVICE)

    # Inference
    with torch.no_grad():
        output = model(tensor_img)
        probs = torch.softmax(output, dim=1)
        pred_idx = probs.argmax(dim=1).item()
        confidence = probs.max().item()
        
    print("-" * 30)
    print("TESTING WITH KNOWN BLIGHT IMAGE")
    print(f"Image: {os.path.basename(IMAGE_PATH)}")
    print("Predicted class:", class_names[pred_idx])
    print("Confidence:", round(confidence * 100, 2), "%")
    
    print("-" * 30)
    print("ALL CLASS SCORES:")
    for i, name in enumerate(class_names):
        print(f"{name}: {round(probs[0][i].item() * 100, 2)}%")

except Exception as e:
    print("Error:", e)
