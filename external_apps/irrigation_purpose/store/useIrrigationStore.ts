import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { calculateSprinklerPositions, SprinklerPosition } from '../utils/sprinklerLogic';

interface IrrigationState {
    irrigationType: 'sprinkler' | 'drip' | null;
    landWidth: number;
    landLength: number;
    sprinklerRadius: number;
    sprinklers: SprinklerPosition[];

    setIrrigationType: (type: 'sprinkler' | 'drip') => void;
    setLandDetails: (width: number, length: number, radius: number) => void;
    moveSprinkler: (id: string, x: number, z: number) => void;
    removeSprinkler: (id: string) => void;
    generateBlueprint: () => void;
    reset: () => void;
}

export const useIrrigationStore = create<IrrigationState>()(
    persist(
        (set, get) => ({
            irrigationType: null,
            landWidth: 0,
            landLength: 0,
            sprinklerRadius: 0,
            sprinklers: [],

            setIrrigationType: (type) => set({ irrigationType: type }),

            setLandDetails: (width, length, radius) =>
                set({ landWidth: width, landLength: length, sprinklerRadius: radius }),

            moveSprinkler: (id, x, z) => set((state) => ({
                sprinklers: state.sprinklers.map((s) => s.id === id ? { ...s, x, z } : s)
            })),

            removeSprinkler: (id) => set((state) => ({
                sprinklers: state.sprinklers.filter((s) => s.id !== id)
            })),

            generateBlueprint: () => {
                const { landWidth, landLength, sprinklerRadius } = get();
                if (landWidth > 0 && landLength > 0 && sprinklerRadius > 0) {
                    const sprinklers = calculateSprinklerPositions(landWidth, landLength, sprinklerRadius);
                    set({ sprinklers });
                }
            },

            reset: () => set({
                irrigationType: null,
                landWidth: 0,
                landLength: 0,
                sprinklerRadius: 0,
                sprinklers: []
            })
        }),
        {
            name: 'irrigation-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
