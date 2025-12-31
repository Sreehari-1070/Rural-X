"use client";
import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky, Text } from '@react-three/drei';
import { useDisasterStore, DrainChannel } from '@/store/useDisasterStore';
import * as THREE from 'three';

// Water Component
function Water({ width, length, initialDepth, drainTimeMinutes }: { width: number, length: number, initialDepth: number, drainTimeMinutes: number }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [progress, setProgress] = useState(0);

    // Animation: Scale time. 1 min sim time = 0.2s real time?
    // Let's just make the animation take fixed 8 seconds for effect.
    const animationDuration = 8.0;

    useFrame((state, delta) => {
        if (progress < 1) {
            const newProgress = Math.min(progress + delta / animationDuration, 1);
            setProgress(newProgress);

            if (meshRef.current) {
                // Depth decreases from initialDepth to 0
                // Initial depth is in cm, let's say 1 unit = 1 meter.
                // 15cm = 0.15 units.
                const startH = initialDepth / 100.0;
                const currentDepth = startH * (1 - newProgress);

                // Scale Y can't be 0 exactly usually to avoid glitches, but 0 is fine.
                const displayDepth = Math.max(0.001, currentDepth);

                meshRef.current.scale.y = displayDepth;
                // Position y is half height. Base is at 0. So y = displayDepth/2.
                meshRef.current.position.y = (displayDepth / 2);
            }
        }
    });

    return (
        <mesh ref={meshRef} position={[width / 2, (initialDepth / 200), length / 2]}>
            <boxGeometry args={[width, 1, length]} />
            <meshStandardMaterial color="#3b82f6" transparent opacity={0.6} />
            {progress < 1 && (
                <Text position={[0, 2, 0]} fontSize={2} color="white" anchorX="center" anchorY="middle">
                    Draining...
                </Text>
            )}
        </mesh>
    );
}

// Drain Channel Component
// Drain Channel Component
function Drain({ x, z, direction, length, width }: DrainChannel) {
    const isEastWest = direction === 'east' || direction === 'west';
    const sizeX = isEastWest ? length : width;
    const sizeZ = isEastWest ? width : length;

    // Create arrow markers along the length
    const arrows = [];
    const numArrows = Math.max(1, Math.floor(length / 10)); // One arrow every 10m
    const step = length / (numArrows + 1);

    for (let i = 1; i <= numArrows; i++) {
        arrows.push(i * step - length / 2); // Local coord centered at 0
    }

    return (
        <group position={[x, -0.2, z]}>
            {/* Main Channel Body */}
            <mesh>
                <boxGeometry args={[sizeX, 0.4, sizeZ]} />
                <meshStandardMaterial color="#451a03" />
            </mesh>

            {/* Flow Indicators */}
            {arrows.map((pos, idx) => (
                <group key={idx} position={
                    isEastWest
                        ? [pos, 0.3, 0]
                        : [0, 0.3, pos]
                }>
                    {/* Simple chevron/arrow shape using cone */}
                    <mesh rotation={[0, isEastWest ? -Math.PI / 2 : 0, -Math.PI / 2]}>
                        <coneGeometry args={[0.3, 0.8, 8]} />
                        <meshStandardMaterial color="#fbbf24" emissive="#d97706" emissiveIntensity={0.5} />
                    </mesh>
                </group>
            ))}

            {/* Label for long drains */}
            {length > 20 && (
                <Text
                    position={[0, 1.5, 0]}
                    fontSize={1.5}
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                    outlineWidth={0.1}
                    outlineColor="white"
                >
                    Drain
                </Text>
            )}
        </group>
    );
}

// Custom Grid Ground Component with Interaction
function Ground({ width, length, isDrawingMode, onGroundClick, onGroundHover }: {
    width: number,
    length: number,
    isDrawingMode?: boolean,
    onGroundClick?: (point: THREE.Vector3) => void,
    onGroundHover?: (point: THREE.Vector3) => void
}) {
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[width / 2, -0.01, length / 2]}
            onClick={(e) => {
                if (isDrawingMode && onGroundClick) {
                    e.stopPropagation();
                    onGroundClick(e.point);
                }
            }}
            onPointerMove={(e) => {
                if (isDrawingMode && onGroundHover) {
                    e.stopPropagation();
                    onGroundHover(e.point);
                }
            }}
        >
            <planeGeometry args={[width, length]} />
            <meshStandardMaterial color={isDrawingMode ? "#f1f5f9" : "#86efac"} />
            {/* Show grid more clearly in draw mode */}
            {isDrawingMode && <gridHelper args={[Math.max(width, length), Math.max(width, length) / 5, 0x94a3b8, 0xe2e8f0]} rotation={[Math.PI / 2, 0, 0]} />}
        </mesh>
    );
}

interface FieldCanvasProps {
    isDrawingMode?: boolean;
    customDrains?: DrainChannel[];
    onAddDrain?: (drain: DrainChannel) => void;
    onCanvasCreated?: (gl: THREE.WebGLRenderer) => void;
}

export default function FieldCanvas({ isDrawingMode, customDrains, onAddDrain, onCanvasCreated }: FieldCanvasProps) {
    const fieldData = useDisasterStore((state) => state.fieldData);
    const result = useDisasterStore((state) => state.simulationResult);

    const [startPoint, setStartPoint] = useState<THREE.Vector3 | null>(null);
    const [hoverPoint, setHoverPoint] = useState<THREE.Vector3 | null>(null);

    if (!fieldData || !result) return <div className="p-10 text-center">Loading Visualization...</div>;

    const { field_length, field_width, water_depth } = fieldData;

    const handleGroundClick = (point: THREE.Vector3) => {
        if (!onAddDrain || !isDrawingMode) return;

        if (!startPoint) {
            setStartPoint(point);
        } else {
            // Finalize drain
            const drain = calculateDrainFromPoints(startPoint, point);
            onAddDrain(drain);
            setStartPoint(null);
            setHoverPoint(null);
        }
    };

    // Helper to calculate drain geometry from two points with axis snapping
    const calculateDrainFromPoints = (p1: THREE.Vector3, p2: THREE.Vector3): DrainChannel => {
        const dx = p2.x - p1.x;
        const dz = p2.z - p1.z;

        let direction = "east"; // Default along X
        let len = 0;

        // Snap to dominant axis
        if (Math.abs(dz) > Math.abs(dx)) {
            direction = "north"; // Along Z
            len = Math.abs(dz);
            // Center Z is mid, Center X is p1.x (snap to start X)
            return {
                x: p1.x,
                z: (p1.z + p2.z) / 2,
                length: Math.max(len, 1),
                width: 1.5,
                direction: "north"
            };
        } else {
            direction = "east";
            len = Math.abs(dx);
            // Center X is mid, Center Z is p1.z (snap to start Z)
            return {
                x: (p1.x + p2.x) / 2,
                z: p1.z,
                length: Math.max(len, 1),
                width: 1.5,
                direction: "east"
            };
        }
    };

    const phantomDrain = (startPoint && hoverPoint) ? calculateDrainFromPoints(startPoint, hoverPoint) : null;

    const displayDrains = (isDrawingMode && customDrains) ? customDrains : result.drain_channels;

    return (
        <div className="w-full h-[500px] bg-gradient-to-br from-sky-50 to-white rounded-xl overflow-hidden shadow-inner relative border border-gray-200">
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur p-4 rounded-lg shadow-sm pointer-events-none border border-gray-100">
                <h4 className="font-bold text-sm text-gray-700">Live Simulation {isDrawingMode ? "(Drawing Mode)" : ""}</h4>
                <p className="text-xs text-gray-500 mt-1">
                    {isDrawingMode
                        ? startPoint ? "Move to end point (auto-snaps to axis) -> Click to Finish" : "Click on ground to start drawing a drain"
                        : "Left Click: Rotate | Right Click: Pan | Scroll: Zoom"}
                </p>
            </div>

            <Canvas
                camera={{ position: [field_length * 0.8, field_length * 0.5, field_width * 1.2], fov: 45 }}
                gl={{ preserveDrawingBuffer: true }}
                onCreated={({ gl }) => onCanvasCreated && onCanvasCreated(gl)}
            >
                <Sky sunPosition={[100, 20, 100]} />
                <ambientLight intensity={0.6} />
                <directionalLight position={[50, 50, 25]} intensity={1} castShadow />

                <OrbitControls target={[field_length / 2, 0, field_width / 2]} enabled={!isDrawingMode} />

                {!isDrawingMode && <gridHelper args={[Math.max(field_length, field_width) * 2, 20, 0x9ca3af, 0xe5e7eb]} position={[field_length / 2, 0, field_width / 2]} />}

                <Ground
                    width={field_length}
                    length={field_width}
                    isDrawingMode={isDrawingMode}
                    onGroundClick={handleGroundClick}
                    onGroundHover={isDrawingMode ? setHoverPoint : undefined}
                />

                {/* Draw temporary marker */}
                {isDrawingMode && startPoint && (
                    <>
                        <mesh position={[startPoint.x, 0.2, startPoint.z]}>
                            <sphereGeometry args={[0.8]} />
                            <meshStandardMaterial color="#ef4444" />
                        </mesh>
                        {phantomDrain && (
                            <group position={[phantomDrain.x, 0, phantomDrain.z]}>
                                <mesh>
                                    <boxGeometry args={[
                                        phantomDrain.direction === 'east' ? phantomDrain.length : phantomDrain.width,
                                        0.4,
                                        phantomDrain.direction === 'east' ? phantomDrain.width : phantomDrain.length
                                    ]} />
                                    <meshStandardMaterial color="#fcd34d" transparent opacity={0.6} />
                                </mesh>
                            </group>
                        )}
                    </>
                )}

                {/* Drains */}
                {displayDrains.map((drain, idx) => (
                    <Drain key={idx} {...drain} />
                ))}

                {/* Water - Hide water in Draw Mode to see ground clearly */}
                {!isDrawingMode && (
                    <Water
                        width={field_length}
                        length={field_width}
                        initialDepth={water_depth}
                        drainTimeMinutes={result.expected_drain_time_minutes}
                    />
                )}
            </Canvas>
        </div>
    );
}
