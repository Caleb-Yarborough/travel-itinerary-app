// Import React hooks and components
import { useState } from 'react';
import ItineraryForm from './components/ItineraryForm'; // Form component for user input
import { generateItinerary } from './api/generateItinerary'; // Function to call backend API
import jsPDF from 'jspdf'; // Library to generate PDF documents
import html2canvas from 'html2canvas'; // Library to convert HTML elements to canvas
import './App.css'; // Custom CSS (optional)

// Main App component
function App() {
  // State to store the generated itinerary plan
  const [plan, setPlan] = useState<any>(null);

  // Handles form submission and API call
  const handleGenerate = async (formData: any) => {
    // Split comma-separated preferences and trim whitespace
    const preferences = formData.preferences
      .split(',')
      .map((p: string) => p.trim());

    try {
      // Call backend API with the formatted form data
      const res = await generateItinerary({
        destination: formData.destination,
        days: parseInt(formData.days), // Ensure "days" is a number
        preferences,
      });
      setPlan(res); // Update the state with the itinerary response
    } catch (error) {
      // Log error if API call fails
      console.error('Failed to generate itinerary:', error);
    }
  };

  // Converts the itinerary section into a downloadable PDF
  const downloadPDF = async () => {
    const element = document.getElementById('itinerary-output'); // Get the itinerary container
    if (!element) return;

    const canvas = await html2canvas(element); // Convert element to canvas
    const imgData = canvas.toDataURL('image/png'); // Convert canvas to image data

    const pdf = new jsPDF(); // Create a new PDF instance
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0); // Add the image to the PDF
    pdf.save('itinerary.pdf'); // Trigger download
  };

  return (
    <div className="p-4">
      {/* Render the input form and pass in the submission handler */}
      <ItineraryForm onSubmit={handleGenerate} />

      {/* If a plan exists, display the itinerary and a download button */}
      {plan && (
        <>
          <div
            id="itinerary-output"
            className="mt-4 bg-gray-100 p-4 rounded whitespace-pre-wrap"
          >
            {/* Display formatted JSON of the itinerary */}
            <pre>{JSON.stringify(plan, null, 2)}</pre>
          </div>

          {/* Button to export the itinerary as a PDF */}
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

export default App; // Export the App component
