import { type NextRequest, NextResponse } from "next/server"
import { scoreWebsite } from "@/lib/website-scorer"
import { withRateLimit } from "@/lib/rate-limit"
import { saveSearchHistory } from "@/lib/search-history"
import redis from "@/lib/redis"
import type { WebsiteScore } from "@/lib/types"
import { auth } from "@clerk/nextjs/server"

// Debug function to log detailed information
function debugLog(message: string, data?: any) {
  const timestamp = new Date().toISOString()
  console.log(`[PLACES API ${timestamp}] ${message}`)
  if (data !== undefined) {
    try {
      console.log(JSON.stringify(data, null, 2))
    } catch (error) {
      console.log("Could not stringify data:", typeof data, data)
    }
  }
}

export async function POST(request: NextRequest) {
  // Apply rate limiting
  return withRateLimit(
    request,
    async () => {
      debugLog("Received POST request")

      // Get userId directly from auth(), making sure to await
      const { userId } = await auth();
      const currentUserId = userId || "anonymous"; // Use Clerk userId or fallback
      debugLog(`User ID from auth: ${currentUserId}`);

      try {
        const body = await request.json()
        debugLog("Request body", body)

        // Remove userId from body destructuring if present, use currentUserId instead
        const { query, includeScores = false, limit = 20, industry } = body

        // Calculate numeric limit immediately after destructuring
        const numericLimit = typeof limit === 'number' ? limit : parseInt(String(limit), 10) || 20;
        // Ensure limit is within bounds (5-50) for consistency
        const constrainedLimit = Math.min(Math.max(5, numericLimit), 50);

        if (!query) {
          debugLog("Query is required")
          return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 })
        }

        // --- TEMPORARILY DISABLE CACHE CHECK --- 
        /* 
        // Check cache first using constrainedLimit
        if (redis) {
          // Construct standardized cache key
          let term = query;
          let location = "";
          if (query.includes(" in ")) {
              const parts = query.split(" in ");
              location = parts.pop()?.trim() || "";
              term = parts.join(" in ").trim();
          } else {
             term = query; // If no " in ", the whole query is the term
          }
          // Use destructured industry (which might be undefined if not sent)
          const cacheKey = `search:${term}:${location}:${industry || 'any'}:${constrainedLimit}`;
          debugLog(`Checking cache with key: ${cacheKey}`);
          const cachedResults = await redis.get(cacheKey);

          if (cachedResults) {
            debugLog("Cache hit for search query")

            // Parse parameters for history saving
            let termForHistory = query;
            let locationForHistory = "";
            let industryForHistory = industry; // Use destructured industry
            if (query.includes(" in ")) {
              const parts = query.split(" in ");
              locationForHistory = parts.pop()?.trim() || "";
              termForHistory = parts.join(" in ").trim();
            }
            // Save history using constrainedLimit & fetched userId
            await saveSearchHistory(currentUserId, { term: termForHistory, location: locationForHistory, industry: industryForHistory, count: constrainedLimit });

            return NextResponse.json({
              success: true,
              businesses: cachedResults,
              cached: true,
            })
          }
        }
        */
        // --- END OF TEMPORARY CACHE DISABLE ---

        // Use constrainedLimit for the actual Places API request logic below
        const businessLimit = constrainedLimit; // Use the already calculated constrained limit
        debugLog(`Using business limit: ${businessLimit}`)

        if (!process.env.GOOGLE_PLACES_API_KEY) {
          debugLog("GOOGLE_PLACES_API_KEY is not defined")
          return NextResponse.json({ success: false, error: "Places API not configured" }, { status: 500 })
        }

        debugLog(`Searching for: ${query}`)

        try {
          // Save to search history using constrainedLimit
          let termForHistory = query;
          let locationForHistory = "";
          let industryForHistory = industry; // Use destructured industry
          if (query.includes(" in ")) {
            const parts = query.split(" in ");
            locationForHistory = parts.pop()?.trim() || "";
            termForHistory = parts.join(" in ").trim();
          }
          // Use fetched userId
          await saveSearchHistory(currentUserId, { term: termForHistory, location: locationForHistory, industry: industryForHistory, count: constrainedLimit });

          // First, search for places
          const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
            query,
          )}&key=${process.env.GOOGLE_PLACES_API_KEY}`

          debugLog(`Making request to: ${searchUrl.replace(process.env.GOOGLE_PLACES_API_KEY || "", "[REDACTED]")}`)
          const searchResponse = await fetch(searchUrl)
          const searchData = await searchResponse.json()

          debugLog("Search response status:", searchData.status)

          if (searchData.status !== "OK") {
            debugLog("Search failed:", searchData)
            throw new Error(`Search failed: ${searchData.status} - ${searchData.error_message || "Unknown error"}`)
          }

          if (!searchData.results || searchData.results.length === 0) {
            debugLog("No results found")
            return NextResponse.json({ success: true, businesses: [] })
          }

          debugLog(`Found ${searchData.results.length} places`)

          // Process the results (up to the limit OR the number found, whichever is smaller)
          const businesses = []
          const limit = businessLimit; // Use the constrained limit
          const numResultsToProcess = Math.min(limit, searchData.results.length);

          for (let i = 0; i < numResultsToProcess; i++) { // Use numResultsToProcess
            const place = searchData.results[i]
            debugLog(`Processing place: ${place.name}`)

            // Get place details for more information
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${
              place.place_id
            }&fields=name,formatted_address,formatted_phone_number,website,url&key=${process.env.GOOGLE_PLACES_API_KEY}`

            debugLog(`Getting details for: ${place.name}`)
            const detailsResponse = await fetch(detailsUrl)
            const detailsData = await detailsResponse.json()

            if (detailsData.status !== "OK") {
              debugLog(`Failed to get details for ${place.name}:`, detailsData)
              continue // Skip this place and move to the next one
            }

            const details = detailsData.result
            debugLog(`Got details for: ${place.name}`)

            // Create the business object
            const business = {
              id: place.place_id,
              name: place.name,
              address: place.formatted_address || details.formatted_address || "Address not available",
              phone: details.formatted_phone_number || undefined,
              website: details.website || undefined,
              websiteScore: null as WebsiteScore | null,
            }

            // Score the website if requested and website exists
            if (includeScores && business.website) {
              try {
                debugLog(`Scoring website: ${business.website}`)
                // Call scoreWebsite and get the nested score object
                const { score: analysisScore } = await scoreWebsite(business.website)
                // Assign the analysisScore (which is of type WebsiteScore) 
                business.websiteScore = analysisScore 
                debugLog(`Website score: ${analysisScore.overall}`)
              } catch (scoreError) {
                debugLog(`Error scoring website ${business.website}:`, scoreError)
                // Continue without score, websiteScore remains null
              }
            }

            debugLog("Created business object", business)
            businesses.push(business)
          }

          // Cache the results (the 'businesses' array now contains scores)
          if (redis && businesses.length > 0) {
            // Reconstruct parameters for cache key
            let termForCache = query;
            let locationForCache = "";
            let industryForCache = industry; // Use destructured industry
            if (query.includes(" in ")) {
                const parts = query.split(" in ");
                locationForCache = parts.pop()?.trim() || "";
                termForCache = parts.join(" in ").trim();
            }
            // Use destructured industry (defaulting to 'any')
            const cacheKey = `search:${termForCache}:${locationForCache}:${industryForCache || 'any'}:${constrainedLimit}`;
            // Cache the businesses array which has scores populated
            await redis.set(cacheKey, businesses, { ex: 3600 }) // Cache for 1 hour
            debugLog(`Cached search results with key: ${cacheKey}`)
          }

          return NextResponse.json({
            success: true,
            businesses,
          })
        } catch (error) {
          debugLog("Places API error:", error)

          // Log more detailed error information
          if (error instanceof Error) {
            debugLog("Error name:", error.name)
            debugLog("Error message:", error.message)
            debugLog("Error stack:", error.stack)
          }

          // Return the error
          return NextResponse.json(
            {
              success: false,
              error: "Failed to search for businesses",
              errorDetails: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
          )
        }
      } catch (error) {
        debugLog("Request error:", error)
        return NextResponse.json({ success: false, error: "Failed to process request" }, { status: 500 })
      }
    },
    { limit: 50, window: 60 * 15 }, // 50 requests per 15 minutes
  )
}
