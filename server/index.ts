import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import redis from './utils/redis';
import { generateItineraryAI } from './ai/generatePlan';

const app = express();
const PORT = parseInt(process.env.PORT || '8000', 10);

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Route
app.post('/api/itinerary', async (req: Request, res: Response) => {
    const { destination, days, preferences } = req.body as {
        destination: string;
        days: number;
        preferences: string[];
    };

    const cacheKey = `${destination}-${days}-${preferences.join(',')}`;

    try {
        // Try Redis cache first
        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log('✅ Returning cached itinerary');
            return res.json(JSON.parse(cached));
        }

        // Generate with OpenAI
        const plan = await generateItineraryAI(destination, days, preferences);

        const itinerary = { destination, days, preferences, plan };

        // Cache the result for 1 hour
        await redis.set(cacheKey, JSON.stringify(itinerary), 'EX', 3600);

        res.json(itinerary);
    } catch (err) {
        console.error('❌ Error generating itinerary:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Docker / Fly.io compatibility
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
