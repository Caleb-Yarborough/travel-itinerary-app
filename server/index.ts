// server/index.ts
// -----------------------------------------------------------------------------
// This is the main entry point for the Node.js backend using Express.
// It handles API requests from the frontend, communicates with OpenAI’s API
// to generate travel itineraries, and uses Redis to cache responses.
//
// Key technologies and responsibilities:
// - Express: HTTP server and routing
// - CORS: Allows frontend to call backend (from different origin/port)
// - Redis: Caching layer to reduce API usage and improve performance
// - dotenv: Loads environment variables (like API keys and port)
// - TypeScript: Provides strong typing for safety and autocompletion
//
// Endpoint exposed:
// POST /api/itinerary → Receives form data and returns a generated itinerary
// -----------------------------------------------------------------------------

// Load environment variables from a .env file into process.env
import dotenv from 'dotenv';
dotenv.config();

// Import necessary modules from Express and other dependencies
import express, { Request, Response } from 'express';
import cors from 'cors';

import redis from './utils/redis'; // Redis client for caching
import { generateItineraryAI } from './ai/generatePlan'; // OpenAI-powered itinerary generator

// Initialize the Express application
const app = express();

// Define the port, using the .env value if available, or defaulting to 8000
const PORT = parseInt(process.env.PORT || '8000', 10);

// -------------------- MIDDLEWARE --------------------

// Enable CORS for requests from the frontend (React app on port 3000 or 3001)
// This allows the browser to make cross-origin requests to the API
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
}));

// Enable parsing of JSON request bodies
// Required so Express can understand and extract form data from the POST request
app.use(express.json());

// -------------------- ROUTES --------------------

// POST route to handle itinerary generation requests
// Endpoint: /api/itinerary
app.post('/api/itinerary', async (req: Request, res: Response) => {
    // Destructure and type-check the request body
    const { destination, days, preferences } = req.body as {
        destination: string;
        days: number;
        preferences: string[];
    };

    // Create a cache key based on the user inputs
    const cacheKey = `${destination}-${days}-${preferences.join(',')}`;

    try {
        // Attempt to retrieve a cached response from Redis
        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log('✅ Returning cached itinerary');
            return res.json(JSON.parse(cached)); // Return cached itinerary if found
        }

        // If not cached, call OpenAI to generate a new itinerary
        const plan = await generateItineraryAI(destination, days, preferences);

        // Structure the response object
        const itinerary = { destination, days, preferences, plan };

        // Store the result in Redis with a TTL (time-to-live) of 1 hour (3600 seconds)
        await redis.set(cacheKey, JSON.stringify(itinerary), 'EX', 3600);

        // Send the newly generated itinerary back to the client
        res.json(itinerary);
    } catch (err) {
        // Log and return error if anything goes wrong
        console.error('❌ Error generating itinerary:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// -------------------- SERVER START --------------------

// Start the server and listen on all interfaces (0.0.0.0)
// This allows it to accept connections from Docker or deployment environments like Fly.io
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
