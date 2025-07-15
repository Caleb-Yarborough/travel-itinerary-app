// ItineraryDisplay.tsx
// -----------------------------------------------------------------------------
// This component displays a multi-day travel itinerary using styled cards.
// It receives an array of day-by-day itinerary items (with activities)
// as a prop from its parent component (e.g., ParsedItinerary).
//
// Each day is rendered with its number and a bulleted list of activities.
//
// - This component uses the `Props` type to receive a structured itinerary.
// - It gracefully handles the case where the itinerary is empty.
// - It uses JSX `.map()` to dynamically render each day and its activities.
// -----------------------------------------------------------------------------

import './Forms.css'; // Shared CSS styling for layout and visual consistency

// Type definition for a single day's itinerary item
type ItineraryItem = {
    day: number;             // e.g., Day 1, Day 2
    activities: string[];    // List of morning/afternoon/evening activities
};

// Props passed into this component: an array of daily itinerary items
type Props = {
    itinerary: ItineraryItem[];
};

// React functional component to render the itinerary
export default function ItineraryDisplay({ itinerary }: Props) {
    // If there are no itinerary items, render nothing (avoid empty layout)
    if (itinerary.length === 0) return null;

    // Render each day's activities inside a styled card
    return (
        <div className="mt-6 space-y-4">
            {itinerary.map((item) => (
                <div key={item.day} className="border p-4 rounded shadow">
                    {/* Day label */}
                    <h2 className="itinerary-days">Day {item.day}</h2>

                    {/* List of activities for this day */}
                    <ul className="list-disc ml-6 mt-2">
                        {item.activities.map((activity, idx) => (
                            <li key={idx}>{activity}</li> // Render each activity in a bullet list
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
