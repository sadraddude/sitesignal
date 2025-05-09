import redis from "./redis"

// Define the structure for stored history items
export type SearchHistoryItem = {
  term: string;
  location: string;
  industry: string;
  count: number;
  timestamp: number;
};

const MAX_HISTORY_ITEMS = 10
const HISTORY_EXPIRY = 60 * 60 * 24 * 30 // 30 days

/**
 * Save a search query to user's search history
 */
export async function saveSearchHistory(userId: string, params: Omit<SearchHistoryItem, 'timestamp'>) {
  if (!redis) return false
  console.log(`[saveSearchHistory] Called for user: ${userId}`, params); // Log entry

  try {
    const key = `search_history:${userId}`
    const searchItem: SearchHistoryItem = {
      ...params,
      timestamp: Date.now(),
    }

    // Stringify the new item IMMEDIATELY to ensure it's a string
    const newItemString = JSON.stringify(searchItem);

    // 1. Get current history (already parsed objects from Upstash Redis client)
    const rawHistory = (await redis.lrange(key, 0, -1)) as SearchHistoryItem[]; // Assume it returns the correct type
    console.log(`[saveSearchHistory] Raw history fetched for exists check:`, rawHistory); // Log fetched history

    // 2. Check if this exact search already exists in the raw (parsed) history
    const exists = rawHistory.some((existingItem) => {
        // Add null/type check for safety
        if (!existingItem || typeof existingItem !== 'object') return false;
        // Compare properties
        return existingItem.term === params.term &&
               existingItem.location === params.location &&
               existingItem.industry === params.industry &&
               existingItem.count === params.count;
    });

    if (!exists) {
      // Push the stringified item
      await redis.lpush(key, newItemString) // Use the stringified version
      await redis.ltrim(key, 0, MAX_HISTORY_ITEMS - 1) // Trim list AFTER push
      await redis.expire(key, HISTORY_EXPIRY)
      console.log(`[saveSearchHistory] Saved new item to key ${key}:`, searchItem); // Log success
    } else {
       console.log(`[saveSearchHistory] Search already exists for key ${key}, not saving again.`); // Log existing
    }

    return true
  } catch (error) {
    console.error("Failed to save search history:", error)
    return false
  }
}

/**
 * Get user's search history
 */
export async function getSearchHistory(userId: string): Promise<SearchHistoryItem[]> {
  if (!redis) return []
  console.log(`[getSearchHistory] Called for user: ${userId}`); // Log entry

  try {
    const key = `search_history:${userId}`
    const history = await redis.lrange(key, 0, -1)
    console.log(`[getSearchHistory] Raw data from Redis key ${key}:`, history); // Log raw Redis data

    const parsedHistory = history.map((item) => {
       // Assume 'item' is already the parsed object from Redis client
       if (item && typeof item === 'object') {
           // We can optionally add more specific checks here if needed,
           // e.g., ensure required fields like 'term' exist.
           return item as SearchHistoryItem;
       }
       // Log if the item retrieved is not the expected object format
       console.warn(`[getSearchHistory] Invalid item format encountered: Expected object, got ${typeof item}`, item);
       return null; // Return null for invalid items (non-objects, nulls from Redis)
     }).filter((item): item is SearchHistoryItem => item !== null); // Filter out nulls

    console.log(`[getSearchHistory] Parsed history being returned for user ${userId}:`, parsedHistory); // Log parsed result
    return parsedHistory;

  } catch (error) {
    console.error("[getSearchHistory] Failed to get/parse search history:", error) // Log errors
    return []
  }
}

/**
 * Clear user's search history
 */
export async function clearSearchHistory(userId: string) {
  if (!redis) return false

  try {
    const key = `search_history:${userId}`
    await redis.del(key)
    return true
  } catch (error) {
    console.error("Failed to clear search history:", error)
    return false
  }
}
