'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { DragControls, Html } from '@react-three/drei';
import { DoubleSide, Mesh, Matrix4, Vector3 } from 'three';
import { useIrrigationStore } from '@/store/useIrrigationStore';

interface InteractionSprinklerProps {
    id: string;
    x: number;
    z: number;
    r: number;
    showCoverage: boolean;
}

export function InteractiveSprinkler({ id, x, z, r, showCoverage }: InteractionSprinklerProps) {
    const { moveSprinkler, removeSprinkler } = useIrrigationStore();
    const [hovered, setHovered] = useState(false);
    const [dragging, setDragging] = useState(false);

    // Water spray simple animation
    const sprayRef = useRef<Mesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (sprayRef.current) {
            sprayRef.current.rotation.y += delta * 2;
            sprayRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
        }
    });

    const onDragEnd = () => {
        if (groupRef.current) {
            const newPos = groupRef.current.position;
            moveSprinkler(id, newPos.x, newPos.z);
        }
        setDragging(false);
    };

    const handleDragStart = () => setDragging(true);

    return (
        <DragControls
            onDragStart={() => setDragging(true)}
            onDragEnd={onDragEnd}
            axisLock="y" // Lock Y axis to keep it on ground
            dragLimits={undefined} // No strict limits, but could add field bounds
        >
            <group ref={groupRef as any} position={[x, 0, z]}>
                {/* Hover/Selection Halo */}
                {(hovered || dragging) && (
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
                        <ringGeometry args={[0.2, 0.3, 16]} />
                        <meshBasicMaterial color={dragging ? "yellow" : "white"} />
                    </mesh>
                )}

                {/* Sprinkler Body - Clickable */}
                <mesh
                    position={[0, 0.25, 0]}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    onDoubleClick={(e) => {
                        e.stopPropagation();
                        removeSprinkler(id);
                    }}
                >
                    <cylinderGeometry args={[0.1, 0.1, 0.5, 12]} />
                    <meshStandardMaterial color={hovered ? "#555" : "#333"} />

                    {/* Tooltip on hover */}
                    {hovered && !dragging && (
                        <Html position={[0, 1, 0]} center pointerEvents="none" style={{ pointerEvents: 'none' }}>
                            <div className="bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none select-none">
                                Double-click to remove
                            </div>
                        </Html>
                    )}
                </mesh>

                {/* Active Water Spray Effect */}
                <group position={[0, 0.5, 0]}>
                    {/* Dynamic spray cones */}
                    <mesh ref={sprayRef} rotation={[0, 0, Math.PI]}>
                        <coneGeometry args={[r * 0.8, 0.5, 8, 1, true]} />
                        <meshBasicMaterial
                            color="#a5f3fc"
                            transparent
                            opacity={0.3}
                            side={DoubleSide}
                            depthWrite={false}
                        />
                    </mesh>
                    {/* Droplets simulation (simple points or small meshes) */}
                </group>

                {/* Coverage Area */}
                {showCoverage && (
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                        <circleGeometry args={[r, 32]} />
                        <meshBasicMaterial
                            color="#3bf"
                            transparent
                            opacity={0.2}
                            side={DoubleSide}
                            depthWrite={false}
                        />
                        <meshBasicMaterial
                            attach="material"
                            color={dragging ? "#fbbf24" : "#3bf"}
                            transparent
                            opacity={dragging ? 0.4 : 0.2}
                            side={DoubleSide}
                            depthWrite={false}
                        />
                    </mesh>
                )}
            </group>
        </DragControls>
    );
}
