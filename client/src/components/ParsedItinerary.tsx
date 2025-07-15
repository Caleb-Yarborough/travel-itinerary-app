// ParsedItinerary.tsx
// -----------------------------------------------------------------------------
// This component renders the final, generated travel itinerary.
// It displays:
// - A summary (destination, days, preferences)
// - A formatted day-by-day Markdown itinerary using ReactMarkdown
// - A "Copy" button to allow users to copy the raw Markdown to clipboard
//
// Features and technologies used:
// - React props to receive itinerary data from App.tsx
// - `react-markdown` and `remark-gfm` to render the Markdown string
// - Clipboard API (`navigator.clipboard.writeText`) to support one-click copying
// - Custom CSS classes for layout and styling
// -----------------------------------------------------------------------------

import ReactMarkdown from 'react-markdown'; // Renders Markdown into HTML
import remarkGfm from 'remark-gfm'; // Enables GitHub-flavored Markdown features like tables and lists
import './ParsedItinerary.css'; // Custom styling for dark box, copy button, and layout

// Props structure expected by this component
type PlanProps = {
    plan: {
        destination: string;    // Location selected by user
        days: number;           // Trip duration
        preferences: string[];  // List of user-selected interests
        plan: string;           // Full itinerary in Markdown format
    };
};

// Main functional component that renders the parsed itinerary
export default function ParsedItinerary({ plan }: PlanProps) {
    // Handles copying the itinerary text (Markdown) to the clipboard
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(plan.plan); // Copies the raw Markdown string
            alert('Itinerary copied to clipboard!'); // Notifies user
        } catch (err) {
            console.error('Copy failed: ', err); // Log error if copy fails
        }
    };

    return (
        <div
            id="itinerary-output"
            className="mt-6 bg-white rounded shadow-lg p-6 space-y-6"
        >
            {/* Travel overview box displaying basic input data */}
            <div className="bg-gray-100 p-4 rounded">
                <h2 className="text-xl font-bold">Travel Overview</h2>
                <p><strong>Destination:</strong> {plan.destination}</p>
                <p><strong>Days:</strong> {plan.days}</p>
                <p><strong>Preferences:</strong> {plan.preferences.join(', ')}</p>
            </div>

            {/* Markdown-rendered itinerary inside a styled dark box */}
            <div className="itinerary-dark-box">
                {/* Copy-to-clipboard button */}
                <button onClick={handleCopy} className="copy-btn">Copy</button>

                {/* Renders Markdown content with GFM features like tables, checklists, etc. */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {plan.plan}
                </ReactMarkdown>
            </div>
        </div>
    );
}
