'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Settings, Info, Eye, EyeOff, Grid, RotateCcw } from 'lucide-react';
import { useIrrigationStore } from '@/store/useIrrigationStore';
import { useEffect, useState } from 'react';

// Dynamic import for the 3D Canvas (No SSR)
const FieldCanvas = dynamic(() => import('@/components/FieldCanvas'), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center text-green-600">Loading 3D Scene...</div>
});

export default function VisualizePage() {
    const { landWidth, landLength, sprinklerRadius, sprinklers } = useIrrigationStore();
    const [mounted, setMounted] = useState(false);

    // Visualization toggles
    const [showCoverage, setShowCoverage] = useState(true);
    const [showGrid, setShowGrid] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="w-full h-screen relative bg-slate-100 overflow-hidden">
            {/* Header / Nav Overlay */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-10 pointer-events-none">
                <div className="pointer-events-auto">
                    <Link href="/land-details">
                        <button className="flex items-center gap-2 bg-white/90 backdrop-blur-md text-gray-800 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
                            <ArrowLeft size={18} />
                            <span>Edit Dimensions</span>
                        </button>
                    </Link>
                </div>

                <div className="pointer-events-auto relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl shadow-lg border transition-all ${showMenu ? 'bg-green-600 text-white border-green-600' : 'bg-white/90 backdrop-blur-md text-green-800 border-green-100 hover:bg-green-50'}`}
                    >
                        <Settings size={18} />
                        Visualization Mode
                    </button>

                    {/* Configuration Dropdown */}
                    {showMenu && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">View Options</div>

                            <button
                                onClick={() => setShowCoverage(!showCoverage)}
                                className="w-full text-left px-3 py-3 hover:bg-green-50 rounded-lg flex items-center justify-between group"
                            >
                                <span className="text-gray-700 font-medium">Water Coverage</span>
                                {showCoverage ? <Eye size={18} className="text-green-600" /> : <EyeOff size={18} className="text-gray-400" />}
                            </button>

                            <button
                                onClick={() => setShowGrid(!showGrid)}
                                className="w-full text-left px-3 py-3 hover:bg-green-50 rounded-lg flex items-center justify-between group"
                            >
                                <span className="text-gray-700 font-medium">Grid Overlay</span>
                                <Grid size={18} className={showGrid ? "text-green-600" : "text-gray-400"} />
                            </button>

                            <div className="h-px bg-gray-100 my-1"></div>

                            <button
                                onClick={() => window.location.reload()}
                                className="w-full text-left px-3 py-3 hover:bg-red-50 hover:text-red-600 rounded-lg flex items-center gap-2 text-gray-600"
                            >
                                <RotateCcw size={16} />
                                <span>Reset View</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 3D Canvas Area */}
            <div className="w-full h-full">
                <FieldCanvas showCoverage={showCoverage} showGrid={showGrid} />
            </div>

            {/* Stats / Legend Panel */}
            <div className="absolute bottom-6 left-6 z-10 pointer-events-auto">
                <div className="bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-gray-100 max-w-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Info size={20} className="text-blue-500" />
                        Field Summary
                    </h3>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">Dimensions:</span>
                            <span className="font-medium text-gray-900">{landWidth}m x {landLength}m</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                            <span className="text-gray-500">Sprinkler Radius:</span>
                            <span className="font-medium text-gray-900">{sprinklerRadius}m</span>
                        </div>
                        <div className="flex justify-between pt-1">
                            <span className="text-gray-500">Total Sprinklers:</span>
                            <span className="font-bold text-green-600 text-lg">{sprinklers.length} Unit{sprinklers.length !== 1 ? 's' : ''}</span>
                        </div>
                    </div>

                    <div className="mt-4 text-xs text-gray-400 bg-gray-50 p-3 rounded-lg">
                        <span className="font-semibold text-gray-600">Tip:</span> Left click to rotate, Right click to pan, Scroll to zoom.
                    </div>
                </div>
            </div>
        </div>
    );
}
