import { useForm } from 'react-hook-form';

type FormData = {
    destination: string;
    days: number;
    preferences: string;
};

type Props = {
    onSubmit: (data: FormData) => void;
};

export default function ItineraryForm({ onSubmit }: Props) {
    const { register, handleSubmit } = useForm<FormData>();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto">
            <div>
                <label className="block mb-1 font-semibold">Destination</label>
                <input
                    {...register('destination')}
                    className="w-full p-2 border rounded shadow"
                />
            </div>

            <div>
                <label className="block mb-1 font-semibold">Days</label>
                <input
                    type="number"
                    {...register('days')}
                    className="w-full p-2 border rounded shadow"
                />
            </div>

            <div>
                <label className="block mb-1 font-semibold">Preferences (comma separated)</label>
                <input
                    {...register('preferences')}
                    className="w-full p-2 border rounded shadow"
                />
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                Generate Itinerary
            </button>
        </form>
    );
}
