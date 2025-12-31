import sys
import os
import math

# Add parent directory to path to import schemas
# sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.schemas import FieldInput, DrainChannel, SimulationResult

def calculate_drainage(data: FieldInput) -> SimulationResult:
    # 1. Parse Inputs
    L = data.field_length
    W = data.field_width
    depth = data.water_depth # cm
    soil = data.soil_type.lower()
    rain = str(data.rainfall_intensity).lower()

    # 2. Volume of water (cubic meters)
    volume_m3 = L * W * (depth / 100.0)

    # 3. Soil parameters (Infiltration mm/hr)
    infiltration_rates = {
        "sandy": 30.0,
        "loamy": 15.0,
        "clay": 2.0
    }
    k_soil = infiltration_rates.get(soil, 10.0)

    # 4. Rain intensity estimate (mm/hr)
    rain_map = {
        "heavy": 60.0,
        "moderate": 20.0,
        "light": 5.0
    }
    try:
        r_intensity = float(rain)
    except:
        r_intensity = rain_map.get(rain, 20.0)

    # 5. Drainage Strategy
    # Assume output capacity of a drain channel ~ 100 m3/hr (large trench)
    drain_capacity_per_channel = 100.0 

    # Natural drainage (m3/hr)
    natural_drain_rate = (L * W) * (k_soil / 1000.0)

    # Target: Drain in 24 hours
    target_time = 24.0
    required_rate = volume_m3 / target_time

    needed_artificial_rate = max(0, required_rate - natural_drain_rate)
    
    channels = []
    
    # Disaster Context Modifiers
    disaster = getattr(data, 'disaster_type', 'heavy_rainfall')
    slope = getattr(data, 'land_slope', 0.0)
    crop = getattr(data, 'crop_stage', 'vegetative').lower()
    
    # 2b. Slope Adjustments
    # Natural drainage increases with slope
    slope_factor = 1.0 + (slope / 10.0) # 1% slope -> 1.1x drain rate
    natural_drain_rate *= slope_factor
    
    # 2c. Crop Vulnerability Adjustments (Target Time)
    # Seedling/Flowering are sensitive. Vegetative/Mature are more robust.
    if crop in ['seedling', 'flowering']:
        target_time = 12.0 # More urgent
        if disaster == 'cyclone_surge': target_time = 8.0
    else:
        target_time = 24.0 # Standard
        if disaster == 'cyclone_surge': target_time = 12.0

    if disaster == 'river_flood':
        volume_m3 *= 1.5
    elif disaster == 'cyclone_surge':
        target_time = min(target_time, 12.0)
        r_intensity += 50.0

    channels = []
    
    # Check for custom drains
    if hasattr(data, 'custom_drains') and data.custom_drains and len(data.custom_drains) > 0:
        # custom mode
        drainage_desc = "Custom Farmer Layout"
        channels = data.custom_drains
        # Calculate capacity based on total length or count
        current_artificial_rate = len(channels) * drain_capacity_per_channel
    else:
        # Standard Auto-Gen Mode
        if disaster == 'river_flood':
            drainage_desc = "Flood Barriers + Peripheral Drains"
        elif disaster == 'cyclone_surge':
            drainage_desc = "Cyclone Emergency Channels"
        else:
            drainage_desc = "Peripheral Drains"
        
        # Peripheral:
        channels.append(DrainChannel(x=0, z=W/2, direction="north", length=W, width=1.0))
        channels.append(DrainChannel(x=L/2, z=0, direction="east", length=L, width=1.0))
        channels.append(DrainChannel(x=L/2, z=W, direction="east", length=L, width=1.0))
        
        current_artificial_rate = 3 * drain_capacity_per_channel
        
        # Recalculate requirements based on modifiers
        required_rate = volume_m3 / target_time
        needed_artificial_rate = max(0, required_rate - natural_drain_rate)
        
        # Check if we need more
        if needed_artificial_rate > current_artificial_rate or "clay" in soil or W > 50 or disaster in ['river_flood', 'cyclone_surge']:
            drainage_desc += " + Central Slope Trench"
            channels.append(DrainChannel(x=L/2, z=W/2, direction="east", length=L, width=1.5))
            current_artificial_rate += drain_capacity_per_channel * 1.5
            
        # Slope integration for auto-gen
        if slope > 3.0:
             drainage_desc += " (Gravity Assist active)"
             # Steeper slope might need check dams or different layout, but for drainage it helps.

        if disaster == 'cyclone_surge' or (disaster == 'river_flood' and W > 40):
             drainage_desc += " + Cross Drains"
             channels.append(DrainChannel(x=L/3, z=W/2, direction="north", length=W, width=1.0))
             channels.append(DrainChannel(x=L*2/3, z=W/2, direction="north", length=W, width=1.0))
             current_artificial_rate += drain_capacity_per_channel * 2

    # Calculate final time
    total_rate = natural_drain_rate + current_artificial_rate
    time_hours = volume_m3 / total_rate if total_rate > 0 else 999.0
    time_minutes = time_hours * 60
    
    # Risk
    # Adjust thresholds based on crop sensitivity
    threshold_low = 6.0
    threshold_med = 24.0
    threshold_high = 48.0
    
    if crop in ['seedling', 'flowering']:
        threshold_med = 12.0
        threshold_high = 24.0
    
    if time_hours < threshold_low:
        risk = "low"
    elif time_hours < threshold_med:
        risk = "medium"
    elif time_hours < threshold_high:
        risk = "high"
    else:
        risk = "critical"
        
    # Override risk for extreme cases
    if disaster == 'cyclone_surge' and time_hours > 12:
        risk = "critical"
    if disaster == 'river_flood' and time_hours > 36:
        risk = "critical"

    return SimulationResult(
        drainage_type=drainage_desc,
        drain_channels=channels,
        expected_drain_time_minutes=round(time_minutes, 1),
        risk_level=risk
    )
