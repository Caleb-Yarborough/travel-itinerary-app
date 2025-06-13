import express from 'express';
import cors from 'cors';
import redis from './utils/redis';
import { generateItineraryAI } from './ai/generatePlan';

const app = express();
const PORT = parseInt(process.env.PORT || '8000', 10); // ensure port is a number

app.use(cors({ origin: 'http://localhost:3000' })); // adjust for production
app.use(express.json());

app.post('/api/itinerary', async (req, res) => {
        const { destination, days, preferences } = req.body as {
            destination: string;
            days: number;
            preferences: string[];
        };

        const cacheKey = `${destination}-${days}-${preferences.join(',')}`;

        try {
            // Check Redis cache
            const cached = await redis.get(cacheKey);
            if (cached) {
                console.log('Returning cached itinerary');
                return res.json(JSON.parse(cached));
            }

            // Generate itinerary using AI
            const plan = await generateItineraryAI(destination, days, preferences);

            const itinerary = {
                destination,
                days,
                preferences,
                plan,
            };

            // ioredis expects separate arguments for EX
            await redis.set(cacheKey, JSON.stringify(itinerary), 'EX', 3600);

            res.json(itinerary);
        } catch (err) {
            console.error('Error generating itinerary:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

// Listen on 0.0.0.0 for Fly.io
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
