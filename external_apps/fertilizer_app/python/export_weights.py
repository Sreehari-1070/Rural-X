
import torch
import json
import os
import numpy as np

def export_model():
    model_path = os.path.join(os.path.dirname(__file__), 'fertilizer_model.pth')
    checkpoint = torch.load(model_path)
    
    # Handle state dict vs full checkpoint
    if 'model_state' in checkpoint:
        state_dict = checkpoint['model_state']
        # Also get scalers from checkpoint if they exist there
        # logic from predict.py:
        X_mean = checkpoint.get('X_mean', [0,0,0])
        X_std = checkpoint.get('X_std', [1,1,1])
        Y_mean = checkpoint.get('Y_mean', [0,0,0,0,0,0])
        Y_std = checkpoint.get('Y_std', [1,1,1,1,1,1])
    else:
        # Fallback if it's just a state dict (unlikely based on predict.py)
        state_dict = checkpoint
        X_mean = [0,0,0]
        X_std = [1,1,1]
        Y_mean = [0,0,0,0,0,0]
        Y_std = [1,1,1,1,1,1]

    # Helper to convert tensor/array to list
    def to_list(t):
        if isinstance(t, torch.Tensor):
            return t.tolist()
        elif isinstance(t, np.ndarray):
            return t.tolist()
        return list(t)

    # Extract Weights
    # Model structure:
    # 0: Linear(3, 32)
    # 2: Linear(32, 32)
    # 4: Linear(32, 6)
    
    # Keys might vary (net.0.weight or 0.weight). Let's print keys to be safe, but usually:
    # 'net.0.weight', 'net.0.bias', etc. based on model.py "self.net"
    
    weights = {}
    
    # Normalize keys (strip 'net.' prefix if present)
    clean_state_dict = {}
    for k, v in state_dict.items():
        new_k = k.replace('net.', '')
        clean_state_dict[new_k] = v

    weights['w1'] = to_list(clean_state_dict['0.weight']) # Shape (32, 3)
    weights['b1'] = to_list(clean_state_dict['0.bias'])   # Shape (32)
    weights['w2'] = to_list(clean_state_dict['2.weight']) # Shape (32, 32)
    weights['b2'] = to_list(clean_state_dict['2.bias'])   # Shape (32)
    weights['w3'] = to_list(clean_state_dict['4.weight']) # Shape (6, 32)
    weights['b3'] = to_list(clean_state_dict['4.bias'])   # Shape (6)
    
    # Scalers
    data = {
        'weights': weights,
        'scalers': {
            'X_mean': to_list(X_mean),
            'X_std': to_list(X_std),
            'Y_mean': to_list(Y_mean),
            'Y_std': to_list(Y_std)
        }
    }
    
    output_path = os.path.join(os.path.dirname(__file__), 'model_weights.json')
    with open(output_path, 'w') as f:
        json.dump(data, f)
    
    print(f"Successfully exported weights to {output_path}")

if __name__ == "__main__":
    export_model()
