import { create } from 'zustand';

export interface FieldInput {
    field_length: number;
    field_width: number;
    soil_type: string;
    rainfall_intensity: string;
    water_depth: number;
    disaster_type?: string;
    land_slope?: number;
    crop_stage?: string;
    custom_drains?: DrainChannel[];
}

export interface DrainChannel {
    x: number;
    z: number;
    direction: string;
    length: number;
    width: number;
}

export interface SimulationResult {
    drainage_type: string;
    drain_channels: DrainChannel[];
    expected_drain_time_minutes: number;
    risk_level: string;
}

interface DisasterState {
    selectedDisaster: string | null;
    fieldData: FieldInput | null;
    simulationResult: SimulationResult | null;

    setSelectedDisaster: (disaster: string) => void;
    setFieldData: (data: FieldInput) => void;
    setSimulationResult: (result: SimulationResult) => void;
}

export const useDisasterStore = create<DisasterState>((set) => ({
    selectedDisaster: null,
    fieldData: null,
    simulationResult: null,

    setSelectedDisaster: (disaster) => set({ selectedDisaster: disaster }),
    setFieldData: (data) => set({ fieldData: data }),
    setSimulationResult: (result) => set({ simulationResult: result }),
}));
