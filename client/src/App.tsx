// App.tsx
// -----------------------------------------------------------------------------
// This is the root component of the AI Travel Itinerary Planner frontend.
// It is built using React with TypeScript and uses several key technologies:
// - Google Maps API (via @react-google-maps/api) for destination autocomplete
// - OpenAI API (via backend) to generate itineraries based on form input
// - React hooks (`useState`, `useLoadScript`) for managing state and side effects
// - Props to communicate between components (e.g., ItineraryForm → App)
// - Conditional rendering for loading states and output display
// - Optionally allows PDF export from ParsedItinerary
// -----------------------------------------------------------------------------

import { useState } from 'react';
import { useLoadScript } from '@react-google-maps/api'; // Google Maps hook to load Places API
import ItineraryForm from './components/ItineraryForm'; // Form component for user input
import ParsedItinerary from './components/ParsedItinerary'; // Displays generated itinerary
import { generateItinerary } from './api/generateItinerary'; // API helper for calling backend
import './App.css'; // App-level styling

// Defines the expected structure for form data passed into the itinerary generator
type FormData = {
  destination: string;
  days: number;
  preferences: string[];
};

// Tells Google Maps which libraries to load; 'places' enables autocomplete
const libraries: ('places')[] = ['places'];

function App() {
  // State to hold the generated plan (itinerary returned from backend or cache)
  const [plan, setPlan] = useState<any>(null);

  // State to toggle showing usage instructions dropdown
  const [showInstructions, setShowInstructions] = useState(false);

  // State to track loading status while fetching from backend / OpenAI
  const [isLoading, setIsLoading] = useState(false);

  // Hook to load the Google Maps script and detect load status or errors
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // API key from environment
    libraries,
  });

  // Callback passed to ItineraryForm to handle form submission
  // Sends the input to the backend, gets response, and updates state
  const handleGenerate = async ({ destination, days, preferences }: FormData) => {
    setIsLoading(true); // Show spinner while waiting
    try {
      const res = await generateItinerary({ destination, days, preferences }); // Call API
      setPlan(typeof res === 'string' ? JSON.parse(res) : res); // Parse response if needed
    } catch (error) {
      console.error('Failed to generate itinerary:', error); // Log error for debugging
    } finally {
      setIsLoading(false); // Hide spinner after loading finishes
    }
  };

  // Show error message if Google Maps failed to load
  if (loadError) return <div className="p-4">Error loading Google Maps</div>;

  // Show loading message while waiting for Google Maps to initialize
  if (!isLoaded) return <div className="p-4">Loading Google Maps…</div>;

  // Main UI rendering
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="app-title">AI Travel Itinerary Planner</h1>

      {/* Introductory description below the title */}
      <p className="mb-6">
        Welcome to the AI Travel Itinerary Planner, a web application designed to help travelers craft customized day-by-day itineraries in just a few clicks. Powered by AI, the planner analyzes your chosen destination, trip length, and personal interests to generate detailed schedules, activity suggestions, and travel tips.
      </p>

      {/* Toggleable "How to Use" section */}
      <div className="mb-6">
        <button
          onClick={() => setShowInstructions(prev => !prev)} // Toggle dropdown visibility
          className="w-full flex justify-between items-center px-4 py-2 bg-gray-200 text-left rounded focus:outline-none"
        >
          <span className="font-semibold">How to Use</span>
          <span>{showInstructions ? '▲' : '▼'}</span>
        </button>

        {/* Only show this block if instructions are toggled open */}
        {showInstructions && (
          <div className="mt-2 p-4 bg-gray-50 border rounded">
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Enter Your Destination:</strong> Choose your destination you plan to visit.</li>
              <li><strong>Select Trip Duration:</strong> Choose the number of days for your trip.</li>
              <li><strong>Choose Preferences:</strong> Pick one or more categories you want to include on your trip (e.g., museums, outdoor adventures, local cuisine, nightlife).</li>
              <li><strong>Generate Itinerary:</strong> Click the "Generate" button. The AI will create a full itinerary including morning, afternoon, and evening activities for each day.</li>
              <li><strong>Review &amp; Customize:</strong> Browse the suggested itinerary.</li>
              <li><strong>Export &amp; Share:</strong> Download your itinerary as a PDF, print it, or share it with friends and family.</li>
            </ol>
            <p className="mt-4">
              Feel free to explore different combinations of preferences or adjust the number of days to see unique itineraries. Happy travels!
            </p>
          </div>
        )}
      </div>

      {/* User input form (child component) receives onSubmit prop from App */}
      <ItineraryForm onSubmit={handleGenerate} />

      {/* Show loading spinner if backend is generating itinerary */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="inline-block animate-spin rounded-full h-96 w-96 border-8 border-blue-600 border-t-transparent"></div>
        </div>
      )}

      {/* Once a plan is generated and loading has finished, render output */}
      {plan && !isLoading && (
        <>
          {/* HTML container for generated itinerary (used for PDF export) */}
          <div id="itinerary-output" className="no-bullets">
            <ParsedItinerary plan={plan} /> {/* Render child component with plan as prop */}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
