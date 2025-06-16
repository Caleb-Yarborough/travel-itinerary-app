// server/utils/redis.ts

// Import the ioredis library, a robust Redis client for Node.js
import Redis from 'ioredis';

// Create a Redis client instance
// Use the REDIS_URL environment variable if set, otherwise fall back to localhost
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Export the Redis client so it can be used throughout the server (e.g., for caching, rate limiting)
export default redis;
