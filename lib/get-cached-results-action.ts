"use server"

import redis from "./redis";
import type { Business } from "./types"; // Assuming Business type is in types.ts

// Debug function (optional, but helpful)
function debugLog(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[CACHE ACTION ${timestamp}] ${message}`);
  if (data !== undefined) {
    try {
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      console.log("Could not stringify data:", typeof data, data);
    }
  }
}

/**
 * Fetches results from Redis cache based on a constructed cache key.
 * Returns null if Redis is unavailable or cache misses.
 */
export async function getCachedResults(cacheKey: string): Promise<Business[] | null> {
  if (!redis) {
    debugLog("Redis client not available");
    return null;
  }

  debugLog(`Attempting to fetch from cache with key: ${cacheKey}`);

  try {
    const cachedData = await redis.get<Business[]>(cacheKey);
    if (cachedData) {
      debugLog("Cache hit! Returning cached results.");
      return cachedData;
    } else {
      debugLog("Cache miss.");
      return null;
    }
  } catch (error) {
    debugLog("Redis cache get error:", error);
    return null;
  }
} 