"use client";
import React, { useState } from 'react';
import { useDisasterStore } from '@/store/useDisasterStore';
import { useRouter } from 'next/navigation';
import { calculateDrainage } from '@/utils/apiClient';
import { motion } from 'framer-motion';

export default function FieldForm() {
    const router = useRouter();
    const setFieldData = useDisasterStore((state) => state.setFieldData);
    const setSimulationResult = useDisasterStore((state) => state.setSimulationResult);
    const selectedDisaster = useDisasterStore((state) => state.selectedDisaster);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        field_length: 100,
        field_width: 60,
        soil_type: 'Clay',
        rainfall_intensity: 'heavy',
        water_depth: 15,
        land_slope: 0.0,
        crop_stage: 'Vegetative'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'field_length' || name === 'field_width' || name === 'water_depth' || name === 'land_slope') ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Prepare payload
            const payload = { ...formData, disaster_type: selectedDisaster || 'heavy_rainfall' };

            // Store input data
            setFieldData(payload);

            // Call Backend
            const result = await calculateDrainage(payload);

            // Store Output
            setSimulationResult(result);

            // Navigate
            router.push('/simulate');
        } catch (err) {
            console.error(err);
            alert('Failed to connect to backend server. Please make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            {/* ... (Dimensions Row) - Unchanged */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Field Length (m)</label>
                    <input
                        type="number"
                        name="field_length"
                        value={formData.field_length}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all placeholder:text-gray-400"
                        required
                        min="10"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Field Width (m)</label>
                    <input
                        type="number"
                        name="field_width"
                        value={formData.field_width}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all placeholder:text-gray-400"
                        required
                        min="10"
                    />
                </div>
            </div>

            {/* New: Topography & Soil */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Soil Type</label>
                    <div className="relative">
                        <select
                            name="soil_type"
                            value={formData.soil_type}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all appearance-none"
                        >
                            <option value="Clay">Clay (Slow Drainage)</option>
                            <option value="Loamy">Loamy (Balanced)</option>
                            <option value="Sandy">Sandy (Fast Drainage)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-600">▼</div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Land Slope (%)</label>
                    <input
                        type="number"
                        name="land_slope"
                        value={formData.land_slope}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all placeholder:text-gray-400"
                        min="0"
                        max="100"
                        step="0.1"
                    />
                </div>
            </div>

            {/* New: Crop & Environment */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Crop Growth Stage</label>
                    <div className="relative">
                        <select
                            name="crop_stage"
                            value={formData.crop_stage}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all appearance-none"
                        >
                            <option value="Seedling">Seedling (High Risk)</option>
                            <option value="Vegetative">Vegetative (Medium)</option>
                            <option value="Flowering">Flowering (High Risk)</option>
                            <option value="Maturity">Maturity (Resilient)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-600">▼</div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Water Depth (cm)</label>
                    <input
                        type="number"
                        name="water_depth"
                        value={formData.water_depth}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all placeholder:text-gray-400"
                        required
                        min="0"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Rainfall Intensity</label>
                <div className="relative">
                    <select
                        name="rainfall_intensity"
                        value={formData.rainfall_intensity}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-900 font-medium focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all appearance-none"
                    >
                        <option value="heavy">Heavy Rain (&gt;50mm/hr)</option>
                        <option value="moderate">Moderate (10-50mm/hr)</option>
                        <option value="light">Light Rain (&lt;10mm/hr)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-600">▼</div>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className={`w-full py-4 text-lg font-bold text-white rounded-xl shadow-lg transition-colors
          ${loading ? 'bg-gray-400 cursor-wait' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'}
        `}
            >
                {loading ? 'Analyzing Field Constraints...' : 'Generate Drainage Plan ➡️'}
            </motion.button>
        </form>
    );
}
