import sys
import json
import torch
import os
import numpy as np
from model import FertilizerModel

def predict():
    try:
        # Load model definition
        model = FertilizerModel()
        model_path = os.path.join(os.path.dirname(__file__), 'fertilizer_model.pth')
        
        if not os.path.exists(model_path):
             raise FileNotFoundError("Model file not found at " + model_path)

        # LOAD CHECKPOINT
        checkpoint = torch.load(model_path)
        
        # 1. Load Model Weights
        if 'model_state' in checkpoint:
            model.load_state_dict(checkpoint['model_state'])
        else:
            model.load_state_dict(checkpoint)
        
        model.eval()

        # 2. Load Scalers
        # Ensure we have defaults or catch errors if keys missing
        X_mean = torch.tensor(checkpoint.get('X_mean', [0,0,0]), dtype=torch.float32)
        X_std  = torch.tensor(checkpoint.get('X_std', [1,1,1]), dtype=torch.float32)
        Y_mean = torch.tensor(checkpoint.get('Y_mean', [0,0,0,0,0,0]), dtype=torch.float32)
        Y_std  = torch.tensor(checkpoint.get('Y_std', [1,1,1,1,1,1]), dtype=torch.float32)

        # Read input
        input_str = sys.stdin.read()
        if not input_str:
            raise ValueError("No input received")
            
        input_data = json.loads(input_str)
        
        # Prepare features [Crop, Soil, Moisture]
        # DROPPED 'Area' because valid model input size is 3 (was 4)
        raw_features = [
            float(input_data.get('crop', 0)),
            float(input_data.get('soil', 0)),
            float(input_data.get('moisture', 0))
        ]
        
        input_tensor = torch.tensor([raw_features], dtype=torch.float32)
        
        # 3. Pre-process Input (Normalize)
        # Ensure scaler shapes match input (slice to first 3 if checking against 3 inputs)
        if X_mean.numel() > 3:
             X_mean = X_mean[:3]
             X_std = X_std[:3]

        normalized_input = (input_tensor - X_mean) / X_std
        
        with torch.no_grad():
            normalized_output = model(normalized_input)
            
        # 4. Post-process Output (De-normalize)
        real_output = (normalized_output * Y_std) + Y_mean
        
        results = real_output[0].tolist()
        
        # Mapping model outputs to meaningful names
        response = {
            'nitrogen': max(0, int(results[0])), 
            'phosphorus': max(0, int(results[1])),
            'potassium': max(0, int(results[2])),
        }
        
        print(json.dumps(response))

    except Exception as e:
        # Print error in JSON format so API can parse it
        print(json.dumps({'error': str(e)}))

if __name__ == '__main__':
    predict()
