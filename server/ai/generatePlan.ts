// Import the OpenAI SDK to interact with the OpenAI API
import { OpenAI } from 'openai';

// Debug log: Print the beginning of the API key to confirm it's loaded (never log full keys in production)
console.log("OPENAI key (start):", process.env.OPENAI_API_KEY?.slice(0, 10));

// Create an instance of the OpenAI client using the API key from environment variables
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generates a travel itinerary using OpenAI's GPT model
 * @param destination - The location for the trip (e.g., "Italy")
 * @param days - Number of days for the itinerary
 * @param preferences - User interests (e.g., ["food", "history", "beach"])
 * @returns The AI-generated itinerary as a string (day-by-day breakdown)
 */
export async function generateItineraryAI(destination: string, days: number, preferences: string[]) {
    // Construct the prompt to send to the AI model
    const prompt = `Create a ${days}-day travel itinerary for ${destination} focused on: ${preferences.join(', ')}. Return it in a day-by-day plan.`;

    // Send the prompt to OpenAI's GPT-4o model and wait for the response
    const chat = await openai.chat.completions.create({
        model: 'gpt-4o', // Use OpenAI's GPT-4 Omni model
        messages: [{ role: 'user', content: prompt }], // User message to start the conversation
    });

    // Return the content of the first choice (the generated itinerary text)
    return chat.choices[0].message.content;
}
