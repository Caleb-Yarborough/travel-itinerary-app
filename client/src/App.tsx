// src/App.tsx
import { useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import ItineraryForm from './components/ItineraryForm';
import ParsedItinerary from './components/ParsedItinerary';
import { generateItinerary } from './api/generateItinerary';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './App.css';

type FormData = {
  destination: string;
  days: number;
  preferences: string[];
};

// still mutable
const libraries: ('places')[] = ['places'];

function App() {
  const [plan, setPlan] = useState<any>(null);

  // 🔑 use Vite’s import.meta.env here
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handleGenerate = async ({ destination, days, preferences }: FormData) => {
    try {
      const res = await generateItinerary({ destination, days, preferences });
      setPlan(typeof res === 'string' ? JSON.parse(res) : res);
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
    }
  };

  const downloadPDF = async () => {
    const el = document.getElementById('itinerary-output');
    if (!el) return;
    const canvas = await html2canvas(el);
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(img, 'PNG', 10, 10, 190, 0);
    pdf.save('itinerary.pdf');
  };

  if (loadError) return <div className="p-4">Error loading Google Maps</div>;
  if (!isLoaded) return <div className="p-4">Loading Google Maps…</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">AI Travel Itinerary Planner</h1>
      <ItineraryForm onSubmit={handleGenerate} />

      {plan && (
        <>
          <ParsedItinerary plan={plan} />
          <button
            onClick={downloadPDF}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Download PDF
          </button>
        </>
      )}
    </div>
  );
}

export default App;
