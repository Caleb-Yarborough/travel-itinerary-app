import { useState } from 'react';
import { generateItinerary } from './api/generateItinerary'; // Make sure this file exists
import './App.css';

function App() {
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    const data = {
      destination: 'Tokyo',
      days: 5,
      preferences: ['food', 'culture'],
    };

    try {
      const res = await generateItinerary(data);
      setResult(res);
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
    }
  };

  return (
    <div className="p-4">
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
        Generate Itinerary
      </button>
      {result && <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

export default App;
