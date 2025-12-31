import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const relu = (x: number[]) => x.map(v => Math.max(0, v));
const add = (a: number[], b: number[]) => a.map((v, i) => v + b[i]);

const dot = (A: number[][], b: number[]) => {
  return A.map(row => row.reduce((sum, val, i) => sum + val * b[i], 0));
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { crop, soil, moisture } = body;
    
    crop = Number(crop) || 0;
    soil = Number(soil) || 0;
    moisture = Number(moisture) || 0;

    const jsonPath = path.join(process.cwd(), 'app/api/predict/model_weights.json');
    if (!fs.existsSync(jsonPath)) {
        throw new Error('Model weights file not found');
    }
    const fileContents = fs.readFileSync(jsonPath, 'utf8');
    const MODEL_DATA = JSON.parse(fileContents);

    const { scalers, weights } = MODEL_DATA;
    
    // Process input
    const input_vec = [crop, soil, moisture];
    const X_mean = scalers.X_mean.slice(0, 3);
    const X_std = scalers.X_std.slice(0, 3);
    const norm_input = input_vec.map((v: number, i: number) => (v - X_mean[i]) / X_std[i]);

    // Inference
    let x = add(dot(weights.w1, norm_input), weights.b1);
    x = relu(x);
    x = add(dot(weights.w2, x), weights.b2);
    x = relu(x);
    x = add(dot(weights.w3, x), weights.b3);
    
    // Output
    const Y_mean = scalers.Y_mean;
    const Y_std = scalers.Y_std;
    const final_output = x.map((v: number, i: number) => (v * Y_std[i]) + Y_mean[i]);
    
    return NextResponse.json({
      nitrogen: Math.max(0, Math.round(final_output[0])),
      phosphorus: Math.max(0, Math.round(final_output[1])),
      potassium: Math.max(0, Math.round(final_output[2]))
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error: ' + String(error) }, { status: 500 });
  }
}
