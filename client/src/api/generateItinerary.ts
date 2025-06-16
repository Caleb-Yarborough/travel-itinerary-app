// Define the shape of the input data expected for itinerary generation
type ItineraryInput = {
    destination: string;      // The travel destination (e.g., "Italy")
    days: number;             // Number of days for the trip
    preferences: string[];    // List of user preferences (e.g., ["food", "beach"])
};

// Function to send a POST request to the backend API and generate an itinerary
export async function generateItinerary(data: ItineraryInput) {
    // Send request to the backend endpoint with input data in JSON format
    const response = await fetch('http://localhost:8000/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Specify JSON format
        body: JSON.stringify(data), // Convert input data to JSON string
    });

    // If the response is not OK (e.g., 400/500 status), throw an error
    if (!response.ok) throw new Error('Failed to fetch itinerary');

    // Return the parsed JSON response from the backend
    return response.json();
}
