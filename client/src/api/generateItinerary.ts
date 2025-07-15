// generateItinerary.ts
// -----------------------------------------------------------------------------
// This utility file provides a single function to generate a travel itinerary
// by sending a POST request to the backend API.
//
// It's used in the React frontend (App.tsx) to communicate with the Express
// server, which in turn interacts with the OpenAI API (and optionally Redis caching).
//
// Key concepts involved:
// - TypeScript typing (`ItineraryInput`) ensures data passed is valid
// - Fetch API used to make an HTTP POST request to the backend
// - JSON used for data exchange between client and server
// -----------------------------------------------------------------------------

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
