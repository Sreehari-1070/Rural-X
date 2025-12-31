'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface SprinklerProps {
    x: number;
    y: number;
    z: number;
    r: number;
}

export default function Sprinkler({ x, y, z, r }: SprinklerProps) {
    // Optional: Animation for "active" look
    // const ref = useRef<Mesh>(null);
    // useFrame((state, delta) => {
    //   if (ref.current) ref.current.rotation.y += delta;
    // });

    return (
        <group position={[x, y, z]}>
            {/* Sprinkler Head (Physical device) */}
            <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.5, 16]} />
                <meshStandardMaterial color="#444" />
            </mesh>

            {/* Water Coverage Area */}
            {/* Lifted slightly off the ground (y=0.01) to avoid z-fighting with the field */}
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[r, 32]} />
                <meshBasicMaterial
                    color="#3bf"
                    transparent
                    opacity={0.3}
                    side={2} // DoubleSide
                />
            </mesh>

            {/* Outer Ring for definition */}
            <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[r - 0.05, r, 32]} />
                <meshBasicMaterial color="#0ea5e9" opacity={0.6} transparent />
            </mesh>
        </group>
    );
}
