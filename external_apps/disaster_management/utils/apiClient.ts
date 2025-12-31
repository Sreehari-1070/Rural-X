const API_BASE_URL = 'http://localhost:8000';

export async function calculateDrainage(data: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/drainage/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to calculate drainage plan');
        }

        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}
