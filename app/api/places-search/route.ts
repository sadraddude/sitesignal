import { type NextRequest, NextResponse } from "next/server"
import type { Business } from "@/lib/types"

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
  debugLog("Received POST request")

  try {
    const body = await request.json()
    debugLog("Request body", body)

    const { query } = body

    if (!query) {
      debugLog("Query is required")
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 })
    }

    if (!process.env.GOOGLE_PLACES_API_KEY) {
      debugLog("GOOGLE_PLACES_API_KEY is not defined")
      return NextResponse.json({ success: false, error: "Places API not configured" }, { status: 500 })
    }

    debugLog(`Searching for: ${query}`)

    try {
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

      // Process the first 5 results (or fewer if less are returned)
      const businesses: Business[] = []
      const limit = Math.min(5, searchData.results.length)

      for (let i = 0; i < limit; i++) {
        const place = searchData.results[i]
        debugLog(`Processing place: ${place.name}`)

        // Get place details for more information
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${
          place.place_id
        }&fields=name,formatted_address,formatted_phone_number,website,url,rating,user_ratings_total,opening_hours,photos&key=${
          process.env.GOOGLE_PLACES_API_KEY
        }`

        debugLog(`Getting details for: ${place.name}`)
        const detailsResponse = await fetch(detailsUrl)
        const detailsData = await detailsResponse.json()

        if (detailsData.status !== "OK") {
          debugLog(`Failed to get details for ${place.name}:`, detailsData)
          continue // Skip this place and move to the next one
        }

        const details = detailsData.result
        debugLog(`Got details for: ${place.name}`)

        // Analyze the website quality if a website is available
        let websiteAnalysis = {
          score: 50,
          issues: {
            mobileFriendly: "warning" as const,
            pageSpeed: "warning" as const,
            seoBasics: "warning" as const,
            ssl: "warning" as const,
          },
          details: ["Website analysis not available without direct access to the website"],
        }

        if (details.website) {
          // Basic analysis based on the website URL
          const hasSSL = details.website.startsWith("https://")

          websiteAnalysis = {
            score: hasSSL ? 60 : 40,
            issues: {
              mobileFriendly: "warning" as const,
              pageSpeed: "warning" as const,
              seoBasics: "warning" as const,
              ssl: hasSSL ? ("good" as const) : ("bad" as const),
            },
            details: [
              hasSSL
                ? "Website uses HTTPS for secure connections"
                : "Website does not use HTTPS for secure connections",
              "Website may benefit from modern design improvements",
              "Consider adding more detailed business information",
              "Ensure website is mobile-friendly for better user experience",
            ],
          }
        }

        // Create the business object
        const business: Business = {
          id: place.place_id,
          name: place.name,
          address: place.formatted_address || details.formatted_address || "Address not available",
          phone: details.formatted_phone_number || undefined,
          website: details.website || undefined,
          score: websiteAnalysis.score,
          issues: websiteAnalysis.issues,
          details: websiteAnalysis.details,
          // Add additional Google Places specific fields
          googleData: {
            rating: place.rating,
            userRatingsTotal: place.user_ratings_total,
            placeUrl: details.url, // Google Maps URL
            photos:
              details.photos?.map((photo: any) => ({
                reference: photo.photo_reference,
                width: photo.width,
                height: photo.height,
              })) || [],
          },
        }

        debugLog("Created business object", business)
        businesses.push(business)
      }

      return NextResponse.json({
        success: true,
        businesses,
        rawData: searchData.results.slice(0, limit),
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
}
