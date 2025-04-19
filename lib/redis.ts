import { Redis } from "@upstash/redis"

// Initialize Redis client
let redis: Redis | null = null

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    console.log("Redis client initialized successfully")
  } else {
    console.log("Redis environment variables missing")
  }
} catch (error) {
  console.error("Failed to initialize Redis client:", error)
  // Continue without Redis
}

export default redis
