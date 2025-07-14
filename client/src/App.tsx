// src/App.tsx
import { useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import ItineraryForm from './components/ItineraryForm';
import ParsedItinerary from './components/ParsedItinerary';
import { generateItinerary } from './api/generateItinerary';
import './App.css';

type FormData = {
  destination: string;
  days: number;
  preferences: string[];
};

const libraries: ('places')[] = ['places'];

function App() {
  const [plan, setPlan] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handleGenerate = async ({ destination, days, preferences }: FormData) => {
    setIsLoading(true);
    try {
      const res = await generateItinerary({ destination, days, preferences });
      setPlan(typeof res === 'string' ? JSON.parse(res) : res);
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loadError) return <div className="p-4">Error loading Google Maps</div>;
  if (!isLoaded) return <div className="p-4">Loading Google Maps…</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="app-title">AI Travel Itinerary Planner</h1>

      {/* Description */}
      <p className="mb-6">
        Welcome to the AI Travel Itinerary Planner, a web application designed to help travelers craft customized day-by-day itineraries in just a few clicks. Powered by AI, the planner analyzes your chosen destination, trip length, and personal interests to generate detailed schedules, activity suggestions, and travel tips.
      </p>

      {/* How to Use Dropdown */}
      <div className="mb-6">
        <button
          onClick={() => setShowInstructions(prev => !prev)}
          className="w-full flex justify-between items-center px-4 py-2 bg-gray-200 text-left rounded focus:outline-none"
        >
          <span className="font-semibold">How to Use</span>
          <span>{showInstructions ? '▲' : '▼'}</span>
        </button>
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

      {/* Form */}
      <ItineraryForm onSubmit={handleGenerate} />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="inline-block animate-spin rounded-full h-96 w-96 border-8 border-blue-600 border-t-transparent"></div>
        </div>
      )}

      {/* Results and PDF Button */}
      {plan && !isLoading && (
        <>
          {/* Add CSS rule in App.css: .no-bullets ul { list-style: none; margin: 0; padding: 0; } */}
          <div id="itinerary-output" className="no-bullets">
            <ParsedItinerary plan={plan} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
