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

// Enable CORS for requests from the frontend (React app on port 3000)
app.use(cors({ origin: 'http://localhost:3000' }));

// Enable parsing of JSON request bodies
app.use(express.json());

// -------------------- ROUTES --------------------

// POST route to handle itinerary generation requests
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

// Start the server and listen on all interfaces for compatibility with Docker/Fly.io
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
