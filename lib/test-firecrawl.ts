"use server"

import FirecrawlApp from "@mendable/firecrawl-js"

export async function testFirecrawl() {
  console.log("Starting Firecrawl test...")

  if (!process.env.FIRECRAWL_API_KEY) {
    console.error("FIRECRAWL_API_KEY is not defined")
    throw new Error("FIRECRAWL_API_KEY is required")
  }

  console.log(`API key found: ${process.env.FIRECRAWL_API_KEY.substring(0, 5)}...`)

  try {
    // Initialize with debug mode and longer timeout
    const firecrawl = new FirecrawlApp({
      apiKey: process.env.FIRECRAWL_API_KEY,
      debug: true,
      timeout: 120000, // 2 minutes
    })

    console.log("Firecrawl client initialized successfully")

    // Test URL
    const url = "https://batistafoodgrillut.com"
    console.log(`Testing URL: ${url}`)

    // Extract domain for search
    const domain = new URL(url).hostname.replace("www.", "")
    console.log(`Extracted domain for search: ${domain}`)

    // Test the search method
    console.log(`Testing search method with query: "${domain}"`)
    const searchResponse = await firecrawl.search(domain, { limit: 1 })

    console.log("Search response:", JSON.stringify(searchResponse, null, 2))

    // Extract business data
    const businessData = searchResponse.data && searchResponse.data[0]

    if (businessData) {
      console.log("Business data found:", JSON.stringify(businessData, null, 2))

      // Extract business information
      const businessName = businessData.title || "Unknown Business"
      console.log(`Business name: ${businessName}`)

      // Extract description
      const description = businessData.description || ""
      console.log(`Description: ${description}`)

      // Extract address using regex
      const addressMatch = description.match(
        /(\d+\s+[A-Za-z]+\s+\d+\s+[A-Za-z]+\s*,\s*[A-Za-z]+\s+[A-Za-z]+\s*,\s*[A-Z]{2}\s+\d{5})/,
      )
      const address = addressMatch ? addressMatch[1] : "Unknown Address"
      console.log(`Address: ${address}`)

      // Extract phone using regex
      const phoneMatch = description.match(/$$(\d{3})$$\s*(\d{3})-(\d{4})/)
      const phone = phoneMatch ? `(${phoneMatch[1]}) ${phoneMatch[2]}-${phoneMatch[3]}` : "Unknown Phone"
      console.log(`Phone: ${phone}`)
    } else {
      console.log("No business data found in search response")
    }

    return {
      success: true,
      searchData: {
        found: !!businessData,
        businessName: businessData?.title || "Unknown Business",
        description: businessData?.description || "No description",
        url: businessData?.url || url,
      },
      rawSearchResponse: JSON.stringify(searchResponse, null, 2).substring(0, 1000), // First 1000 chars
    }
  } catch (error) {
    console.error("Test failed:", error)

    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    throw error
  }
}
