import { useIrrigationStore } from '@/store/useIrrigationStore';
import { InteractiveSprinkler } from './InteractiveSprinkler';

interface SceneProps {
    showCoverage: boolean;
    showGrid: boolean;
}

export function FieldScene({ showCoverage, showGrid }: SceneProps) {
    const { landWidth, landLength, sprinklers } = useIrrigationStore();

    const maxDim = Math.max(landWidth, landLength);

    return (
        <>
            <ambientLight intensity={0.8} />
            <directionalLight
                position={[50, 50, 25]}
                intensity={1.5}
                castShadow
            />

            {/* Field Plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[landWidth, landLength]} />
                <meshStandardMaterial color="#4ade80" roughness={0.8} />
            </mesh>

            {/* Grid Overlay */}
            {showGrid && (
                <gridHelper
                    args={[maxDim * 1.5, Math.ceil(maxDim * 1.5 / 2), 0xffffff, 0xffffff]}
                    position={[0, 0.01, 0]}
                />
            )}

            {/* Interactive Sprinklers */}
            {sprinklers.map((s) => (
                <InteractiveSprinkler
                    key={s.id}
                    id={s.id}
                    x={s.x}
                    z={s.z}
                    r={s.r}
                    showCoverage={showCoverage}
                />
            ))}
        </>
    );
}
