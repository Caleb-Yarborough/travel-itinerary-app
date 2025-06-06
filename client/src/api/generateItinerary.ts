type ItineraryInput = {
    destination: string;
    days: number;
    preferences: string[];
};

export async function generateItinerary(data: ItineraryInput) {
    const response = await fetch('http://localhost:8000/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Failed to fetch itinerary');
    return response.json();
}
