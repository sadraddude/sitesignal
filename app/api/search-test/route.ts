import { type NextRequest, NextResponse } from "next/server"
import FirecrawlApp from "@mendable/firecrawl-js"
import type { Business } from "@/lib/types"

// Debug function to log detailed information
function debugLog(message: string, data?: any) {
  const timestamp = new Date().toISOString()
  console.log(`[SEARCH TEST ${timestamp}] ${message}`)
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

    const { domain } = body

    if (!domain) {
      debugLog("Domain is required")
      return NextResponse.json({ success: false, error: "Domain is required" }, { status: 400 })
    }

    if (!process.env.FIRECRAWL_API_KEY) {
      debugLog("FIRECRAWL_API_KEY is not defined")
      return NextResponse.json({ success: false, error: "Scraping service not configured" }, { status: 500 })
    }

    debugLog(`Searching for domain: ${domain}`)

    try {
      // Initialize Firecrawl client
      const firecrawl = new FirecrawlApp({
        apiKey: process.env.FIRECRAWL_API_KEY,
        debug: true,
        timeout: 120000, // 2 minutes
      })

      // Use search method
      debugLog(`Using search method with query: "${domain}"`)
      const searchResponse = await firecrawl.search(domain, { limit: 1 })

      debugLog("Search response:", searchResponse)

      if (!searchResponse || !searchResponse.success) {
        debugLog("Search failed:", searchResponse?.error || "Unknown error")
        throw new Error(`Search failed: ${searchResponse?.error || "Unknown error"}`)
      }

      // Extract the business data from the search response
      const businessData = searchResponse.data && searchResponse.data[0]

      if (!businessData) {
        debugLog("No business data found in search response")
        throw new Error("No business data found in search response")
      }

      debugLog("Found business data:", businessData)

      // Extract business information from the search data
      const businessName = businessData.title || "Unknown Business"
      debugLog(`Extracted business name: ${businessName}`)

      // Try to extract address and phone from description
      const description = businessData.description || ""
      debugLog(`Description: ${description}`)

      // Extract address using regex - ONLY from the actual description, no fallbacks
      let address = "Unknown Address"
      const addressMatch = description.match(
        /(\d+\s+[A-Za-z]+\s+\d+\s+[A-Za-z]+\s*,\s*[A-Za-z]+\s+[A-Za-z]+\s*,\s*[A-Z]{2}\s+\d{5})/,
      )
      if (addressMatch && addressMatch[1]) {
        address = addressMatch[1].trim()
        debugLog(`Extracted address from description: ${address}`)
      } else {
        debugLog("Could not extract address from description")
      }

      // Extract phone using regex - ONLY from the actual description, no fallbacks
      let phone = undefined
      const phoneMatch = description.match(/($$\d{3}$$\s*\d{3}-\d{4})|(\d{3}[-.\s]\d{3}[-.\s]\d{4})/)
      if (phoneMatch && phoneMatch[0]) {
        phone = phoneMatch[0].trim()
        debugLog(`Extracted phone from description: ${phone}`)
      } else {
        debugLog("Could not extract phone from description")
      }

      // Analyze the website quality based ONLY on the actual data
      const websiteAnalysis = analyzeWebsiteQuality(businessData)
      debugLog("Website quality analysis:", websiteAnalysis)

      const business: Business = {
        id: `business-${Date.now()}`,
        name: businessName,
        address: address,
        phone: phone,
        website: businessData.url || `https://${domain}`,
        score: websiteAnalysis.score,
        issues: websiteAnalysis.issues,
        details: websiteAnalysis.details,
      }

      debugLog("Created business object", business)

      return NextResponse.json({
        success: true,
        business,
        rawData: businessData, // Include the raw data for debugging
      })
    } catch (error) {
      debugLog("Search error:", error)

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
          error: "Failed to search for business",
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

// Analyze website quality based ONLY on the actual data from Firecrawl
function analyzeWebsiteQuality(businessData: any): {
  score: number
  issues: {
    mobileFriendly: "good" | "warning" | "bad"
    pageSpeed: "good" | "warning" | "bad"
    seoBasics: "good" | "warning" | "bad"
    ssl: "good" | "warning" | "bad"
  }
  details: string[]
} {
  try {
    debugLog("Starting website quality analysis with actual data only")

    // Start with a neutral score
    let score = 50
    debugLog(`Initial score: ${score}`)

    // Check if the site has SSL
    const hasSSL = businessData.url && businessData.url.startsWith("https://")
    debugLog(`Has SSL: ${hasSSL}`)

    // Check if the site has a description (meta tag)
    const hasDescription = !!businessData.description
    debugLog(`Has description: ${hasDescription}`)

    // Adjust score based on SSL
    if (hasSSL) {
      score += 10
      debugLog(`Score after SSL check: ${score} (+10)`)
    } else {
      score -= 10
      debugLog(`Score after SSL check: ${score} (-10)`)
    }

    // Adjust score based on description
    if (hasDescription) {
      score += 10
      debugLog(`Score after description check: ${score} (+10)`)
    } else {
      score -= 5
      debugLog(`Score after description check: ${score} (-5)`)
    }

    // Ensure score is within 0-100 range
    score = Math.max(0, Math.min(100, score))
    debugLog(`Final score after clamping: ${score}`)

    // Determine issue statuses based on actual data
    const ssl = hasSSL ? "good" : "bad"
    const seoBasics = hasDescription ? "good" : "bad"

    // For these, we don't have direct data, so we'll use neutral values
    const mobileFriendly = "warning"
    const pageSpeed = "warning"

    debugLog("Issue statuses", { mobileFriendly, pageSpeed, seoBasics, ssl })

    // Generate details based ONLY on the actual data
    const details: string[] = []

    if (!hasSSL) {
      details.push("No SSL certificate detected (not using HTTPS)")
    }

    if (!hasDescription) {
      details.push("Missing meta description for SEO")
    }

    // Add generic issues that we can reasonably assume
    if (score < 70) {
      details.push("Website may benefit from modern design improvements")
      details.push("Consider adding more detailed business information")
    }

    debugLog("Analysis details", details)

    return {
      score,
      issues: {
        mobileFriendly,
        pageSpeed,
        seoBasics,
        ssl,
      },
      details,
    }
  } catch (error) {
    debugLog("Error analyzing website quality:", error)

    // Return neutral values in case of error
    return {
      score: 50,
      issues: {
        mobileFriendly: "warning",
        pageSpeed: "warning",
        seoBasics: "warning",
        ssl: "warning",
      },
      details: ["Unable to analyze website quality", "Consider a professional website audit"],
    }
  }
}
