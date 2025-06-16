// Import the useForm hook from react-hook-form for easy form state management
import { useForm } from 'react-hook-form';

// Define the shape of the form data
type FormData = {
    destination: string;   // User-entered destination
    days: number;          // Number of travel days
    preferences: string;   // Preferences as a comma-separated string (e.g., "food, beach")
};

// Define the props that the component expects: a callback to handle form submission
type Props = {
    onSubmit: (data: FormData) => void;  // Function that handles submitted form data
};

// Define the functional component for the itinerary form
export default function ItineraryForm({ onSubmit }: Props) {
    // Initialize the form using useForm, which provides register and handleSubmit functions
    const { register, handleSubmit } = useForm<FormData>();

    return (
        // Handle form submission using handleSubmit from react-hook-form
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
            {/* Destination input */}
            <div>
                <label className="block mb-1 font-semibold">Destination</label>
                <input
                    {...register('destination')}  // Register this input field with the form
                    className="w-full p-2 border rounded shadow"
                />
            </div>

            {/* Days input */}
            <div>
                <label className="block mb-1 font-semibold">Days</label>
                <input
                    type="number"
                    {...register('days')}  // Register the number of days
                    className="w-full p-2 border rounded shadow"
                />
            </div>

            {/* Preferences input */}
            <div>
                <label className="block mb-1 font-semibold">Preferences (comma separated)</label>
                <input
                    {...register('preferences')}  // Register user preferences
                    className="w-full p-2 border rounded shadow"
                />
            </div>

            {/* Submit button */}
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Generate Itinerary
            </button>
        </form>
    );
}
