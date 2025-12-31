from http.server import BaseHTTPRequestHandler
import json
import os
import numpy as np

# Load model globally to cache between requests (warm start)
weights_path = os.path.join(os.path.dirname(__file__), 'model_weights.json')
with open(weights_path, 'r') as f:
    MODEL_DATA = json.load(f)

# Helper for ReLU
def relu(x):
    return np.maximum(0, x)

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body_str = self.rfile.read(content_length).decode('utf-8')
            body = json.loads(body_str)

            # Features: crop, soil, moisture
            try:
                crop = float(body.get('crop', 0))
                soil = float(body.get('soil', 0))
                moisture = float(body.get('moisture', 0))
            except (ValueError, TypeError):
                 # Handle bad input gracefully
                crop, soil, moisture = 0.0, 0.0, 0.0
            
            # Input vector
            input_vec = np.array([crop, soil, moisture], dtype=np.float32)

            # SCALERS
            scalers = MODEL_DATA['scalers']
            X_mean = np.array(scalers['X_mean'][:3], dtype=np.float32)
            X_std  = np.array(scalers['X_std'][:3], dtype=np.float32)
            Y_mean = np.array(scalers['Y_mean'], dtype=np.float32)
            Y_std  = np.array(scalers['Y_std'], dtype=np.float32)

            # Normalize
            norm_input = (input_vec - X_mean) / X_std

            # INFERENCE
            w = MODEL_DATA['weights']
            
            # PyTorch Linear layer stores weight as (out_features, in_features)
            # So we use X @ W.T + b
            
            w1 = np.array(w['w1']) # (32, 3)
            b1 = np.array(w['b1']) # (32,)
            
            w2 = np.array(w['w2']) # (32, 32)
            b2 = np.array(w['b2']) # (32,)
            
            w3 = np.array(w['w3']) # (6, 32)
            b3 = np.array(w['b3']) # (6,)
            
            # Forward pass
            # L1
            x = np.dot(norm_input, w1.T) + b1
            x = relu(x)
            
            # L2
            x = np.dot(x, w2.T) + b2
            x = relu(x)
            
            # L3
            x = np.dot(x, w3.T) + b3
            # No activation at end
            
            # De-normalize
            final_output = (x * Y_std) + Y_mean
            
            results = final_output.tolist()
            
            response_data = {
                'nitrogen': max(0, int(results[0])), 
                'phosphorus': max(0, int(results[1])),
                'potassium': max(0, int(results[2])),
            }

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
