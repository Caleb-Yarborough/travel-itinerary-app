import { useState } from 'react';
import ItineraryForm from './components/ItineraryForm';
import { generateItinerary } from './api/generateItinerary';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
      setPlan(res);
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
      <ItineraryForm onSubmit={handleGenerate} />

      {plan && (
        <>
          <div
            id="itinerary-output"
            className="mt-4 bg-gray-100 p-4 rounded whitespace-pre-wrap"
          >
            <pre>{JSON.stringify(plan, null, 2)}</pre>
          </div>
          <button
            onClick={downloadPDF}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Export to PDF
          </button>
        </>
      )}
    </div>
  );
}

export default App;
