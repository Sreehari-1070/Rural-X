from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.schemas import FieldInput, SimulationResult
from backend.logic.drainage_logic import calculate_drainage

app = FastAPI(title="Smart Crop Disaster Management Simulator")

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/drainage/calculate", response_model=SimulationResult)
def get_drainage_plan(data: FieldInput):
    """
    Calculate optimal drainage strategy based on field parameters.
    """
    result = calculate_drainage(data)
    return result

@app.get("/")
def read_root():
    return {"message": "Disaster Management API Ready"}
