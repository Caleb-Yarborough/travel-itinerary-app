// server/ai/generatePlan.ts

// Import the OpenAI SDK to interact with the OpenAI API
import { OpenAI } from 'openai';
import redis from '../utils/redis';

// Debug log: Print the beginning of the API key to confirm it’s loaded
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
    // Create a unique cache key based on the user inputs
    const cacheKey = `plan:${destination}:${days}:${preferences.join(',')}`;

    // Check Redis for a cached response
    const cached = await redis.get(cacheKey);
    if (cached) {
        console.log("Cache hit");
        return JSON.parse(cached);
    }

    console.log("Cache miss — calling OpenAI");

    // Construct the prompt to send to the AI model
    const prompt = `Create a ${days}-day travel itinerary for ${destination} focused on: ${preferences.join(', ')}. Return it in a day-by-day plan.`;

    // Send the prompt to OpenAI's GPT-4o model and wait for the response
    const chat = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
    });

    // Extract the content of the first choice (the generated itinerary text)
    const result = chat.choices[0].message.content;

    // Store the result in Redis for 1 hour (3600 seconds)
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 60 * 60);

    return result;
}
