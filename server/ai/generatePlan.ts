// server/ai/generatePlan.ts
// -----------------------------------------------------------------------------
// This module defines a function `generateItineraryAI` that creates a customized
// day-by-day travel itinerary using OpenAI's GPT model (via the `openai` SDK).
//
// It integrates Redis caching to avoid redundant API calls and improve performance.
//
// Used by the backend Express route to process form input (destination, days,
// preferences) and return the AI-generated plan.
//
// Technologies used:
// - OpenAI GPT-4o model for itinerary generation
// - Redis for in-memory result caching (1-hour expiration)
// - TypeScript for type safety
// -----------------------------------------------------------------------------

// Import the OpenAI SDK to interact with the OpenAI API
import { OpenAI } from 'openai';

// Import the configured Redis client (defined in server/utils/redis.ts)
import redis from '../utils/redis';

// Debug log: Print the beginning of the API key to confirm it’s loaded correctly from .env
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
    // Create a unique Redis cache key based on user input to identify this request
    const cacheKey = `plan:${destination}:${days}:${preferences.join(',')}`;

    // Attempt to fetch a cached itinerary for this input
    const cached = await redis.get(cacheKey);
    if (cached) {
        console.log("Cache hit"); // Debug log for cache usage
        return JSON.parse(cached); // Return cached result if available
    }

    console.log("Cache miss — calling OpenAI"); // If no cache, generate a new response

    // Construct the natural language prompt for the AI model
    const prompt = `Create a ${days}-day travel itinerary for ${destination} focused on: ${preferences.join(', ')}. Return it in a day-by-day plan.`;

    // Send the prompt to the GPT-4o model and wait for its response
    const chat = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
    });

    // Extract the text of the first generated response from the AI
    const result = chat.choices[0].message.content;

    // Cache the result in Redis with a 1-hour expiration (3600 seconds)
    await redis.set(cacheKey, JSON.stringify(result), 'EX', 60 * 60);

    // Return the generated itinerary to the caller
    return result;
}
