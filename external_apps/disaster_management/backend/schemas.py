from pydantic import BaseModel
from typing import List, Literal

class DrainChannel(BaseModel):
    x: float
    z: float
    direction: str
    length: float
    width: float

class FieldInput(BaseModel):
    field_length: float
    field_width: float
    soil_type: Literal["Clay", "Loamy", "Sandy"]
    rainfall_intensity: str # 'heavy', 'moderate', 'light' or float
    water_depth: float # cm
    disaster_type: str = "heavy_rainfall"
    land_slope: float = 0.0 # percentage
    crop_stage: str = "vegetative" # seedling, vegetative, flowering, maturity
    custom_drains: List[DrainChannel] = []

class SimulationResult(BaseModel):
    drainage_type: str
    drain_channels: List[DrainChannel]
    expected_drain_time_minutes: float
    risk_level: str
