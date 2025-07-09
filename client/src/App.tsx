// App.tsx

import { useState } from 'react';
import ItineraryForm from './components/ItineraryForm';
import { generateItinerary } from './api/generateItinerary';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ParsedItinerary from './components/ParsedItinerary';
import './App.css';

function App() {
  const [plan, setPlan] = useState<any>(null);

  const handleGenerate = async (formData: any) => {
    const preferences = formData.preferences
      .split(',')
      .map((p: string) => p.trim());

    try {
      const res = await generateItinerary({
        destination: formData.destination,
        days: parseInt(formData.days),
        preferences,
      });

      // ✅ Handle both string and object responses
      if (typeof res === 'string') {
        const parsed = JSON.parse(res);
        setPlan(parsed);
      } else {
        setPlan(res);
      }
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('itinerary-output');
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save('itinerary.pdf');
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">AI Travel Itinerary Planner</h1>
      <ItineraryForm onSubmit={handleGenerate} />
      {plan && <ParsedItinerary plan={plan} />}
      {plan && (
        <button
          onClick={downloadPDF}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
      )}
    </div>
  );
}

export default App;
