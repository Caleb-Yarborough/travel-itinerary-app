import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ParsedItinerary.css';

type PlanProps = {
    plan: {
        destination: string;
        days: number;
        preferences: string[];
        plan: string; // Markdown string
    };
};

export default function ParsedItinerary({ plan }: PlanProps) {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(plan.plan);
            alert('Itinerary copied to clipboard!');
        } catch (err) {
            console.error('Copy failed: ', err);
        }
    };

    return (
        <div
            id="itinerary-output"
            className="mt-6 bg-white rounded shadow-lg p-6 space-y-6"
        >
            {/* Overview Section */}
            <div className="bg-gray-100 p-4 rounded">
                <h2 className="text-xl font-bold">Travel Overview</h2>
                <p><strong>Destination:</strong> {plan.destination}</p>
                <p><strong>Days:</strong> {plan.days}</p>
                <p><strong>Preferences:</strong> {plan.preferences.join(', ')}</p>
            </div>

            {/* Formatted Markdown Output with dark background */}
            <div className="itinerary-dark-box">
                <button onClick={handleCopy} className="copy-btn">Copy</button>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {plan.plan}
                </ReactMarkdown>
            </div>
        </div>
    );
}
