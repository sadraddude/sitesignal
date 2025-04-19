import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Debug function to log detailed information
function debugLog(message: string, data?: any) {
  const timestamp = new Date().toISOString()
  console.log(`[DESIGN AGE API ${timestamp}] ${message}`)
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

    const { url } = body

    if (!url) {
      debugLog("URL is required")
      return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 })
    }

    debugLog(`Analyzing design age for: ${url}`)

    try {
      // Instead of using Puppeteer, we'll use a simpler approach
      // First, get a screenshot URL using a screenshot service
      const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`

      debugLog(`Getting screenshot from: ${screenshotUrl}`)
      const screenshotResponse = await fetch(screenshotUrl)
      const screenshotData = await screenshotResponse.json()

      if (!screenshotData.status || screenshotData.status !== "success") {
        debugLog("Failed to get screenshot:", screenshotData)
        throw new Error("Failed to get website screenshot")
      }

      const screenshot = screenshotData.screenshot?.url

      if (!screenshot) {
        debugLog("No screenshot URL in response:", screenshotData)
        throw new Error("No screenshot URL in response")
      }

      debugLog(`Got screenshot URL: ${screenshot}`)

      // Now, fetch the HTML content directly
      debugLog(`Fetching HTML content from: ${url}`)
      const htmlResponse = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })

      const htmlContent = await htmlResponse.text()
      debugLog(`Got HTML content (${htmlContent.length} characters)`)

      // Extract basic technology indicators from HTML
      const technologies = {
        jquery: htmlContent.includes("jquery"),
        react: htmlContent.includes("react") || htmlContent.includes("reactjs"),
        bootstrap: htmlContent.includes("bootstrap"),
        tailwind: htmlContent.includes("tailwind"),
        wordpress: htmlContent.includes("wp-content") || htmlContent.includes("wp-includes"),
        fontAwesome: htmlContent.includes("font-awesome") || htmlContent.includes("fontawesome"),
        modernFonts:
          htmlContent.includes("google-font") ||
          htmlContent.includes("fonts.googleapis.com") ||
          htmlContent.includes("typekit"),
        responsive:
          htmlContent.includes("@media") || htmlContent.includes("viewport") || htmlContent.includes("max-width"),
        darkMode:
          htmlContent.includes("dark-mode") || htmlContent.includes("dark-theme") || htmlContent.includes("theme-dark"),
        animations:
          htmlContent.includes("animation") || htmlContent.includes("transition") || htmlContent.includes("@keyframes"),
      }

      debugLog("Extracted technology indicators:", technologies)

      // Analyze the design using AI
      debugLog("Analyzing design with AI")
      const { text: aiAnalysis } = await generateText({
        model: openai("gpt-4o"),
        prompt: `
          Analyze this website to determine how modern or outdated its design looks.
          
          URL: ${url}
          
          Technologies detected:
          ${Object.entries(technologies)
            .map(([key, value]) => `- ${key}: ${value}`)
            .join("\n")}
          
          Focus on:
          1. Visual design (is it modern, flat, minimalist or old-fashioned, skeuomorphic, cluttered?)
          2. Layout (is it responsive, grid-based, or fixed-width table-based?)
          3. Typography (modern fonts or old web-safe fonts?)
          4. Color scheme (modern, trendy colors or outdated color combinations?)
          5. UI elements (modern or outdated buttons, forms, navigation)
          6. Mobile-friendliness
          7. Use of white space
          8. Visual hierarchy
          
          Then provide:
          1. A design age score from 0-100 (where 0 is extremely outdated and 100 is cutting-edge modern)
          2. An estimated "design year" (what year does this design feel like it's from?)
          3. A list of 3-5 specific design issues that make the site look outdated
          4. A list of 3-5 recommendations to modernize the design
          
          Format your response as JSON with the following structure:
          {
            "score": number,
            "designYear": number,
            "analysis": "brief overall analysis",
            "issues": ["issue1", "issue2", "issue3"],
            "recommendations": ["rec1", "rec2", "rec3"]
          }
        `,
      })

      debugLog("AI analysis complete")

      try {
        const analysisResult = JSON.parse(aiAnalysis)

        // Calculate design age category
        let designAgeCategory = "modern"
        const currentYear = new Date().getFullYear()
        const yearDifference = currentYear - analysisResult.designYear

        if (yearDifference > 10) {
          designAgeCategory = "outdated"
        } else if (yearDifference > 5) {
          designAgeCategory = "dated"
        } else if (yearDifference > 2) {
          designAgeCategory = "aging"
        } else {
          designAgeCategory = "modern"
        }

        // Create the final result
        const result = {
          url,
          score: analysisResult.score,
          designYear: analysisResult.designYear,
          designAge: yearDifference,
          designAgeCategory,
          analysis: analysisResult.analysis,
          issues: analysisResult.issues,
          recommendations: analysisResult.recommendations,
          technologies,
          screenshot: screenshot,
        }

        debugLog("Analysis complete", {
          url,
          score: result.score,
          designYear: result.designYear,
          designAge: result.designAge,
          designAgeCategory: result.designAgeCategory,
        })

        return NextResponse.json({ success: true, result })
      } catch (error) {
        debugLog("Error parsing AI analysis:", error)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to parse AI analysis",
            errorDetails: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 500 },
        )
      }
    } catch (error) {
      debugLog("Design age analysis error:", error)

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
          error: "Failed to analyze website design",
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
