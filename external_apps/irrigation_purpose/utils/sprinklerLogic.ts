export interface SprinklerPosition {
    id: string;
    x: number;
    y: number;
    z: number; // In 3D space, Z is often the "depth" or length on the ground plane
    r: number;
}

export const calculateSprinklerPositions = (
    width: number,
    length: number,
    radius: number
): SprinklerPosition[] => {
    const spacing = radius * 1.5;
    const positions: SprinklerPosition[] = [];

    // Calculate specific number of rows and columns based on field size and spacing
    // We want to center the grid on the field

    // Effective coverage diameter per step is spacing
    const cols = Math.ceil(width / spacing);
    const rows = Math.ceil(length / spacing);

    // Calculate offsets to center the pattern
    const totalCoveredWidth = (cols - 1) * spacing;
    const totalCoveredLength = (rows - 1) * spacing;

    const startX = -totalCoveredWidth / 2;
    const startZ = -totalCoveredLength / 2;

    let count = 0;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // Optional: Add staggering for hexagonal packing/honeycomb (better coverage)
            // For MVP, simple grid is requested, but staggered is better for circular sprinklers.
            // Let's stick to the prompt's "Grid-based placement" request for simplicity unless stated otherwise.
            // "Spacing = sprinklerRadius × 1.5" implies some overlap.

            const x = startX + j * spacing;
            const z = startZ + i * spacing;

            // Check if the sprinkler is actually useful (within bounds or covering bounds)
            // For now, place them all.

            positions.push({
                id: `sprinkler-${count++}`,
                x,
                y: 0, // On the ground
                z,
                r: radius,
            });
        }
    }

    return positions;
};
