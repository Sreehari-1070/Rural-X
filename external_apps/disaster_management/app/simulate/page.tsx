"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { useDisasterStore } from '@/store/useDisasterStore';
import Link from 'next/link';
import * as THREE from 'three';

const FieldCanvas = dynamic(() => import('@/components/FieldCanvas'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full flex items-center justify-center bg-gray-100">Loading 3D Engine...</div>
});

export default function SimulatePage() {
    const result = useDisasterStore((state) => state.simulationResult);
    const fieldData = useDisasterStore((state) => state.fieldData);
    const setSimulationResult = useDisasterStore((state) => state.setSimulationResult);

    // Drawing Mode State
    const [isDrawingMode, setIsDrawingMode] = React.useState(false);
    const [customDrains, setCustomDrains] = React.useState<any[]>([]);

    // Canvas Ref for Screenshots
    const canvasGlRef = React.useRef<THREE.WebGLRenderer | null>(null);

    // ... (checks)

    const handleCanvasCreated = (gl: THREE.WebGLRenderer) => {
        canvasGlRef.current = gl;
    };

    const handleAddDrain = (drain: any) => {
        setCustomDrains(prev => [...prev, drain]);
    };

    // ...

    // AI Advice State
    const [aiActions, setAiActions] = React.useState<string[]>([
        "Dig channels according to the layout.",
        "Ensure outlet clarity for fast discharge."
    ]);
    const [isSimulating, setIsSimulating] = React.useState(false);

    // AI Layout Generator
    const generateAILayout = () => {
        if (!fieldData) return;
        const { field_length, field_width } = fieldData;

        const newDrains: any[] = [];

        // 1. Central Spine (East-West)
        newDrains.push({
            x: field_length / 2,
            z: field_width / 2,
            direction: 'east',
            length: field_length,
            width: 2.0 // Wider main channel
        });

        // 2. Feeder Drains (North-South) - Fishbone
        const spacing = 15; // Every 15 meters
        const numFeeders = Math.floor(field_length / spacing);

        for (let i = 1; i <= numFeeders; i++) {
            const xPos = i * spacing;
            if (xPos >= field_length) continue;

            // Top branch
            newDrains.push({
                x: xPos,
                z: field_width * 0.75, // Center of top half
                direction: 'north',
                length: field_width * 0.45,
                width: 1.5
            });

            // Bottom branch
            newDrains.push({
                x: xPos,
                z: field_width * 0.25, // Center of bottom half
                direction: 'north',
                length: field_width * 0.45,
                width: 1.5
            });
        }

        setCustomDrains(newDrains);
        setIsDrawingMode(true); // Switch to view coordinates
    };

    const handleSimulateCustom = async () => {
        if (customDrains.length === 0) {
            alert("Please draw or generate a layout first.");
            return;
        }

        setIsSimulating(true);

        try {
            // 1. Calculate basic physics (Client-side heuristic for demo)
            // More drains = faster drain time
            const baseTime = fieldData ? fieldData.water_depth * 10 : 100; // Base time based on depth
            const efficiency = Math.min(customDrains.length * 0.15, 0.8); // Max 80% reduction
            const newDrainTime = Math.round(baseTime * (1 - efficiency));

            let newRisk = 'medium';
            if (newDrainTime < 60) newRisk = 'low';
            else if (newDrainTime > 180) newRisk = 'high';

            // 2. Get AI Advice from Backend
            let newActions = aiActions;
            try {
                // Serialize custom drains for AI analysis
                const drainDescription = customDrains.map((d, i) =>
                    `Drain ${i + 1}: POS(${Math.round(d.x)},${Math.round(d.z)}) DIR=${d.direction} LEN=${Math.round(d.length)}m`
                ).join('; ');

                const prompt = `I have a farm field of size ${fieldData?.field_length}x${fieldData?.field_width}m with ${fieldData?.soil_type} soil. 
                I have drawn a custom drainage layout with the following geometry:
                [${drainDescription}]
                
                Simulated stats: ${customDrains.length} channels, ${newDrainTime} min drain time.
                
                Analyze this SPECIFIC drawing. Is this layout efficient? 
                Return 3 short bullet points:
                1. A rating (Excellent/Good/Poor) and why (based on spacing/coverage).
                2. One specific strength of this pattern.
                3. One specific improvement for this drawing.
                Return ONLY the 3 bullet points, nothing else.`;

                const response = await fetch('http://localhost:8001/ai/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: prompt })
                });

                const data = await response.json();
                if (data.response) {
                    const lines = data.response.split(/\n/).filter((line: string) => line.trim().length > 5);
                    if (lines.length > 0) newActions = lines.slice(0, 3);
                }
            } catch (err) {
                console.warn("AI Advice failed, using defaults", err);
            }

            // 3. Update Store
            const newResult = {
                drainage_type: "Custom User Layout",
                drain_channels: customDrains,
                expected_drain_time_minutes: newDrainTime,
                risk_level: newRisk
            };

            setSimulationResult(newResult);
            setAiActions(newActions);
            setIsDrawingMode(false);

            // Wait for visual update
            setTimeout(() => alert(`Simulation Analysis Complete! \nSee "AI Action Items" for detailed critique.`), 500);

        } catch (e) {
            console.error(e);
            alert("Simulation failed");
        } finally {
            setIsSimulating(false);
        }
    };

    const handleDownloadPDF = async () => {
        const { generatePDFReport } = await import('@/utils/pdfGenerator');

        // Capture Screenshot
        let mapImage;
        if (canvasGlRef.current) {
            try {
                mapImage = canvasGlRef.current.domElement.toDataURL("image/png");
            } catch (e) {
                console.error("Screenshot capture failed", e);
            }
        }

        if (result && fieldData) {
            generatePDFReport(result, fieldData, mapImage);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
            {/* Visual Section */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="bg-white p-1 rounded-2xl shadow-lg border border-gray-100 flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            {isDrawingMode ? <span>✏️ Drawing Custom Drains</span> : <span>🎥 Live Simulation View</span>}
                        </h2>

                        <div className="flex gap-3">
                            {isDrawingMode ? (
                                <>
                                    <button
                                        onClick={generateAILayout}
                                        className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-md hover:shadow-lg hover:from-amber-500 hover:to-orange-600 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1"
                                    >
                                        🤖 AI Layout
                                    </button>
                                    <button
                                        onClick={() => setCustomDrains([])}
                                        className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-full shadow-md hover:shadow-lg hover:from-red-600 hover:to-rose-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        🗑️ Clear
                                    </button>
                                    <button
                                        onClick={handleSimulateCustom}
                                        disabled={isSimulating}
                                        className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1 disabled:opacity-70"
                                    >
                                        {isSimulating ? 'Running...' : 'Run Sim ►'}
                                    </button>
                                    <button
                                        onClick={() => setIsDrawingMode(false)}
                                        className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border-2 border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setIsDrawingMode(true)}
                                    className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-shimmer bg-[size:200%_100%] hover:bg-[position:100%_0] flex items-center gap-2"
                                >
                                    ✏️ Draw Custom Plan
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 relative bg-slate-50">
                        <FieldCanvas
                            // Force re-render on sim update to restart water animation
                            key={result?.expected_drain_time_minutes}
                            isDrawingMode={isDrawingMode}
                            customDrains={customDrains.length > 0 ? customDrains : undefined}
                            onAddDrain={handleAddDrain}
                            onCanvasCreated={handleCanvasCreated}
                        />
                    </div>
                </div>
            </div>

            {/* Info Panel */}
            <div className="w-full lg:w-96 space-y-6 flex flex-col">
                {/* Results Card */}
                <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-emerald-500 animate-fade-in-up">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        📊 Analysis Results
                    </h3>

                    <div className="space-y-6">
                        <div className="bg-emerald-50 p-4 rounded-xl">
                            <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 block">Recommended Strategy</label>
                            <p className="text-lg font-bold text-gray-900 leading-tight">{result?.drainage_type}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <label className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1 block">Drain Time</label>
                                <p className="text-2xl font-bold text-gray-900">{result?.expected_drain_time_minutes}<span className="text-sm font-normal text-gray-500 ml-1">min</span></p>
                            </div>

                            <div className={`p-4 rounded-xl ${result?.risk_level === 'low' ? 'bg-green-100' :
                                result?.risk_level === 'medium' ? 'bg-yellow-100' :
                                    'bg-red-100'
                                }`}>
                                <label className={`text-xs font-bold uppercase tracking-wider mb-1 block ${result?.risk_level === 'low' ? 'text-green-800' :
                                    result?.risk_level === 'medium' ? 'text-yellow-800' :
                                        'text-red-800'
                                    }`}>Risk Level</label>
                                <p className={`text-2xl font-bold ${result?.risk_level === 'low' ? 'text-green-900' :
                                    result?.risk_level === 'medium' ? 'text-yellow-900' :
                                        'text-red-900'
                                    }`}>{result?.risk_level?.toUpperCase()}</p>
                            </div>
                        </div>
                    </div>

                    {/* PDF Export Button */}
                    <button
                        onClick={handleDownloadPDF}
                        className="w-full mt-6 py-4 bg-gradient-to-r from-slate-700 to-slate-900 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-slate-600 flex items-center justify-center gap-3 group"
                    >
                        <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">📄</span>
                        <span className="tracking-wide">Download Official Report</span>
                    </button>
                </div>

                {/* Actions Card */}
                <div className="bg-white p-6 rounded-2xl shadow-md flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">AI Action Items</h3>
                    <ul className="space-y-3 mb-8">
                        {aiActions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <span className="bg-emerald-100 text-emerald-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{idx + 1}</span>
                                <span className="text-sm text-gray-600">{action.replace(/^[0-9\-.]+\s*/, '')}</span>
                            </li>
                        ))}
                    </ul>

                    <Link href="/" className="block w-full py-3 text-center text-sm font-semibold text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-lg transition-colors border border-dashed border-gray-300">
                        ↺ Start New Simulation
                    </Link>
                </div>
            </div>
        </div>
    );
}
