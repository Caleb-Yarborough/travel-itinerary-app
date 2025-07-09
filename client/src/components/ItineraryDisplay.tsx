type ItineraryItem = {
    day: number;
    activities: string[];
};

type Props = {
    itinerary: ItineraryItem[];
};

export default function ItineraryDisplay({ itinerary }: Props) {
    if (itinerary.length === 0) return null;

    return (
        <div className="mt-6 space-y-4">
            {itinerary.map((item) => (
                <div key={item.day} className="border p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Day {item.day}</h2>
                    <ul className="list-disc ml-6 mt-2">
                        {item.activities.map((activity, idx) => (
                            <li key={idx}>{activity}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
