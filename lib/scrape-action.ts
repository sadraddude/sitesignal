"use server"

import { revalidatePath } from "next/cache"
import type { Business, SearchParams } from "@/lib/types"
import { Redis } from "@upstash/redis"

// Initialize Redis client for caching
let redis: Redis | null = null

// Debug function to log detailed information
function debugLog(message: string, data?: any) {
  const timestamp = new Date().toISOString()
  console.log(`[DEBUG ${timestamp}] ${message}`)
  if (data !== undefined) {
    try {
      console.log(JSON.stringify(data, null, 2))
    } catch (error) {
      console.log("Could not stringify data:", typeof data, data)
    }
  }
}

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    debugLog("Redis client initialized successfully")
  } else {
    debugLog("Redis environment variables missing")
  }
} catch (error) {
  debugLog("Failed to initialize Redis client:", error)
  // Continue without Redis
}

export async function scrapeBusinesses(params: SearchParams): Promise<Business[]> {
  const { term, location, industry, count } = params
  debugLog(`Starting scrapeBusinesses with params:`, params)

  // Create a cache key based on search parameters
  const cacheKey = `search:${term}:${location}:${industry}:${count}`

  // Try to get results from cache first
  if (redis) {
    try {
      debugLog(`Checking cache for key: ${cacheKey}`)
      const cachedResults = await redis.get<Business[]>(cacheKey)
      if (cachedResults) {
        debugLog("Cache hit, returning cached results")
        return cachedResults
      }
      debugLog("Cache miss, proceeding with search")
    } catch (error) {
      debugLog("Redis cache error:", error)
      // Continue with search
    }
  }

  // If not in cache or cache error, perform the search using the Python script
  debugLog("Calling Python script for search", { term, location, industry, count })

  try {
    // Construct the search query
    const query = `${term} ${industry} in ${location}`

    debugLog("Attempting to fetch businesses with query:", query)

    // Call the dedicated search-businesses API route
    const response = await fetch(
      `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/search-businesses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query }), // Send only the query object
      },
    )

    // Check if the response was successful before parsing JSON
    if (!response.ok) {
      const errorText = await response.text(); // Get error text for debugging
      debugLog(`Search businesses API failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Search failed: API returned status ${response.status}`);
    }

    const result = await response.json()

    // Assuming the search-businesses API returns { success: boolean, businesses: Business[] | undefined, error?: string }
    if (!result.success) {
      debugLog("Search businesses API reported failure:", result.error)
      throw new Error(`Search failed: ${result.error || "Unknown API error"}`)
    }

    // Process the businesses returned directly from the search API
    const businesses: Business[] = result.businesses || []
    debugLog(`Search businesses API returned ${businesses.length} businesses`)

    // --- Website Analysis Section ---
    // Map over the businesses returned by the search API
    const businessesWithAnalysis: Business[] = await Promise.all(
      businesses.slice(0, count).map(async (business: Business) => { // Use existing Business type
        const websiteUrl = business.website
        let websiteAnalysis = {
          score: business.score || 50, // Use existing score or default
          issues: business.issues || { /* Default issues */ },
          details: business.details || ["Analysis pending..."],
          designAge: business.designAge || null,
        }

        // If the business has a website, analyze it
        if (websiteUrl) {
          try {
            // Call the dedicated analyze-website API route
            const analysisResponse = await fetch(
              `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/analyze-website`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ url: websiteUrl }), // Send only the URL
              },
            )

            // Check if the response was successful before parsing JSON
             if (!analysisResponse.ok) {
               const errorText = await analysisResponse.text();
               debugLog(`Analyze website API failed for ${websiteUrl}: ${analysisResponse.status} ${analysisResponse.statusText}`, errorText);
               // Don't throw here, just skip analysis for this site
             } else {
                const analysisResult = await analysisResponse.json()

                // Assuming analyze-website returns { success: boolean, analysis?: WebsiteAnalysis, error?: string }
                if (analysisResult.success && analysisResult.analysis) {
                  // Use the analysis results directly
                   websiteAnalysis = analysisResult.analysis;
                } else {
                   debugLog(`Website analysis failed for ${websiteUrl}:`, analysisResult.error);
                   // Keep default/pending analysis if API call failed or returned success: false
                }
             }
          } catch (error) {
            debugLog(`Error calling analyze website API for ${websiteUrl}:`, error)
            // Keep default/pending analysis on network error
          }
        }

        // Return the original business data merged with the new analysis
        return {
          ...business, // Spread existing business data (id, name, address, googleData etc.)
          score: websiteAnalysis.score,
          issues: websiteAnalysis.issues,
          details: websiteAnalysis.details,
          designAge: websiteAnalysis.designAge === null ? undefined : websiteAnalysis.designAge,
        };
      }),
    );

    // Cache the results with analysis (expire after 1 hour)
    if (redis && businessesWithAnalysis.length > 0) {
      try {
        debugLog("Caching results with analysis")
        await redis.set(cacheKey, businessesWithAnalysis, { ex: 3600 })
        debugLog("Results cached successfully")
      } catch (error) {
        debugLog("Redis cache set error:", error)
      }
    }

    // Revalidate the results page
    revalidatePath("/results") // Assuming /results displays these

    debugLog("Returning results with analysis", businessesWithAnalysis)
    return businessesWithAnalysis // Return the businesses with updated analysis
  } catch (error) {
    debugLog("Error in scrapeBusinesses:", error)
    // Ensure a proper error structure is thrown or handled
    if (error instanceof Error) {
        throw error; // Re-throw original error
    } else {
        throw new Error("An unknown error occurred during scraping");
    }
  }
}
