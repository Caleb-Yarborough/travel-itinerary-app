// server/utils/redis.ts
// -----------------------------------------------------------------------------
// This utility module sets up and exports a configured Redis client instance
// using the `ioredis` library. Redis is used for in-memory caching in the app.
//
// In this project, it's specifically used to cache generated itineraries in
// `generatePlan.ts` to avoid redundant OpenAI API calls and improve performance.
//
// Redis setup supports both local development and production environments:
// - Locally: connects to Redis at redis://localhost:6379
// - In production (e.g., via Docker Compose): uses REDIS_URL from env variables
//
// Technologies:
// - Redis: in-memory key-value store
// - ioredis: advanced Redis client for Node.js
// -----------------------------------------------------------------------------

// Import the ioredis library, a robust Redis client for Node.js.
// This library provides a powerful, performance-oriented API for interacting with Redis.
import Redis from 'ioredis';

// Create a Redis client instance:
// - First, check if there's a REDIS_URL environment variable set (e.g., in production or a Docker Compose setup).
// - If not set, default to connecting to Redis running on localhost at port 6379.
//   This works when you're running Redis locally (e.g., via `docker run -p 6379:6379 redis`)
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Export the Redis client so it can be reused across the app.
// Typical use cases include:
// - Caching API responses
// - Storing user sessions
// - Rate limiting (e.g., with a token bucket algorithm)
export default redis;
