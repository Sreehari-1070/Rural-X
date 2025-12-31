'use client';

import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useIrrigationStore } from '@/store/useIrrigationStore';
import { FieldScene } from './FieldScene';

interface FieldCanvasProps {
    showCoverage: boolean;
    showGrid: boolean;
}

export default function FieldCanvas({ showCoverage, showGrid }: FieldCanvasProps) {
    const { landWidth, landLength } = useIrrigationStore();
    const maxDim = Math.max(landWidth, landLength);

    return (
        <div className="w-full h-full bg-slate-50">
            <Canvas
                shadows
                dpr={[1, 2]} // Optimization for varying pixel densities
                gl={{ powerPreference: "high-performance", antialias: true }}
            >
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, maxDim * 0.8, maxDim * 0.5]} />
                    <OrbitControls makeDefault maxPolarAngle={Math.PI / 2 - 0.1} />
                    <color attach="background" args={['#e0f2fe']} />

                    <FieldScene showCoverage={showCoverage} showGrid={showGrid} />
                </Suspense>
            </Canvas>
        </div>
    );
}
