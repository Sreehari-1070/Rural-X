'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIrrigationStore } from '@/store/useIrrigationStore';
import { motion } from 'framer-motion';

export default function LandForm() {
    const router = useRouter();
    const { setLandDetails, generateBlueprint } = useIrrigationStore();

    const [width, setWidth] = useState<string>('');
    const [length, setLength] = useState<string>('');
    const [radius, setRadius] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const w = parseFloat(width);
        const l = parseFloat(length);
        const r = parseFloat(radius);

        if (w > 0 && l > 0 && r > 0) {
            setLandDetails(w, l, r);
            generateBlueprint();
            router.push('/visualize');
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-2xl shadow-xl space-y-6 max-w-md mx-auto border border-green-100"
            onSubmit={handleSubmit}
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Land Width (meters)
                    </label>
                    <input
                        type="number"
                        required
                        min="1"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                        placeholder="e.g., 50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Land Length (meters)
                    </label>
                    <input
                        type="number"
                        required
                        min="1"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                        placeholder="e.g., 100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sprinkler Radius (meters)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            required
                            min="0.5"
                            step="0.1"
                            value={radius}
                            onChange={(e) => setRadius(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none"
                            placeholder="e.g., 10"
                        />
                        <span className="absolute right-4 top-3 text-gray-400 text-sm">m</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        The coverage radius of a single sprinkler head.
                    </p>
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
                Generate Blueprint
            </button>
        </motion.form>
    );
}
