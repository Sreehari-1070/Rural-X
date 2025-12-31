"use client";
import React from 'react';
import DisasterCard from '@/components/DisasterCard';
import { useDisasterStore } from '@/store/useDisasterStore';
import { useRouter } from 'next/navigation';

export default function SelectDisaster() {
    const router = useRouter();
    const setSelectedDisaster = useDisasterStore((state) => state.setSelectedDisaster);

    const handleSelect = (disaster: string) => {
        setSelectedDisaster(disaster);
        router.push('/field-details');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Select Disaster Type</h1>
                <p className="text-lg text-slate-600">Choose the scenario you want to simulate.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-4">
                <DisasterCard
                    title="Heavy Rainfall"
                    icon="🌧️"
                    onClick={() => handleSelect('heavy_rainfall')}
                />
                <DisasterCard
                    title="River Flood"
                    icon="🌊"
                    onClick={() => handleSelect('river_flood')}
                />
                <DisasterCard
                    title="Cyclone Surge"
                    icon="🚨"
                    onClick={() => handleSelect('cyclone_surge')}
                />
            </div>
        </div>
    );
}
