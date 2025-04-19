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

  try {
    const key = `search_history:${userId}`
    const searchItem: SearchHistoryItem = {
      ...params,
      timestamp: Date.now(),
    }

    // 1. Get current raw history
    const rawHistory = await redis.lrange(key, 0, -1)

    // 2. Parse history safely, filtering out invalid items
    const parsedHistory: SearchHistoryItem[] = rawHistory.map(item => {
      try {
        return JSON.parse(item) as SearchHistoryItem;
      } catch (parseError) {
        console.error(`Failed to parse history item (filtering): ${item}`, parseError);
        return null; // Mark invalid items as null
      }
    }).filter((item): item is SearchHistoryItem => item !== null); // Remove nulls

    // 3. Check if this exact search already exists in the *valid* history
    const exists = parsedHistory.some((parsedItem) => {
        // Compare all relevant params directly on parsed objects
        return parsedItem.term === params.term &&
               parsedItem.location === params.location &&
               parsedItem.industry === params.industry &&
               parsedItem.count === params.count;
    });

    if (!exists) {
      // Add new search to the beginning
      await redis.lpush(key, JSON.stringify(searchItem))
      // Trim list (use rawHistory.length as an estimate before push, or re-fetch size if precision needed)
      // Using rawHistory.length is generally fine here
      if (rawHistory.length >= MAX_HISTORY_ITEMS) {
         await redis.ltrim(key, 0, MAX_HISTORY_ITEMS - 1)
      }
      await redis.expire(key, HISTORY_EXPIRY)
      console.log("Saved new search to history:", searchItem);
    } else {
       console.log("Search already exists in history, not saving again.");
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

  try {
    const key = `search_history:${userId}`
    const history = await redis.lrange(key, 0, -1)

    // Filter out items that fail parsing
    return history.map((item) => {
       try {
         return JSON.parse(item) as SearchHistoryItem;
       } catch (error) {
         console.error(`Failed to parse history item on get: ${item}`, error);
         return null; // Return null for invalid items
       }
     }).filter((item): item is SearchHistoryItem => item !== null); // Filter out nulls

  } catch (error) {
    console.error("Failed to get search history:", error)
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
