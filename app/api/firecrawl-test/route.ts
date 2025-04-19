import { type NextRequest, NextResponse } from "next/server"
import FirecrawlApp from "@mendable/firecrawl-js"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url") || "https://batistafoodgrillut.com"

  if (!process.env.FIRECRAWL_API_KEY) {
    return NextResponse.json({ success: false, error: "FIRECRAWL_API_KEY is required" }, { status: 500 })
  }

  try {
    console.log(`Testing Firecrawl API with URL: ${url}`)

    // Initialize Firecrawl client
    const firecrawl = new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY,
      debug: true,
    })

    // Try different methods
    const results = {
      crawlUrl: null,
      search: null,
    }

    // Try crawlUrl method
    try {
      console.log("Testing crawlUrl method...")
      const crawlResponse = await firecrawl.crawlUrl(url, {
        limit: 1,
        scrapeOptions: {
          formats: ["html"],
        },
      })

      results.crawlUrl = {
        success: crawlResponse.success,
        error: crawlResponse.error,
        dataType: typeof crawlResponse.data,
        dataIsArray: Array.isArray(crawlResponse.data),
        dataLength: Array.isArray(crawlResponse.data) ? crawlResponse.data.length : 0,
      }
    } catch (crawlError) {
      results.crawlUrl = {
        success: false,
        error: crawlError instanceof Error ? crawlError.message : "Unknown error",
      }
    }

    // Try search method
    try {
      console.log("Testing search method...")
      const searchResponse = await firecrawl.search("Batista Food Grill Utah", {
        limit: 1,
      })

      results.search = {
        success: true,
        dataType: typeof searchResponse,
        dataIsArray: Array.isArray(searchResponse),
        dataLength: Array.isArray(searchResponse) ? searchResponse.length : 0,
        sample: JSON.stringify(searchResponse).substring(0, 1000),
      }
    } catch (searchError) {
      results.search = {
        success: false,
        error: searchError instanceof Error ? searchError.message : "Unknown error",
      }
    }

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error) {
    console.error("Firecrawl test failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
