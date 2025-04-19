import { type NextRequest, NextResponse } from "next/server"

// Debug function to log detailed information
function debugLog(message: string, data?: any) {
  const timestamp = new Date().toISOString()
  console.log(`[LIGHTHOUSE API ${timestamp}] ${message}`)
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

    if (!process.env.PAGESPEED_API_KEY) {
      debugLog("PAGESPEED_API_KEY is not defined")
      return NextResponse.json({ success: false, error: "PageSpeed API key not configured" }, { status: 500 })
    }

    debugLog(`Analyzing website: ${url}`)

    try {
      // Use PageSpeed Insights API (which uses Lighthouse)
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
        url,
      )}&key=${process.env.PAGESPEED_API_KEY}&strategy=mobile&category=performance&category=accessibility&category=best-practices&category=seo`

      debugLog(`Making request to PageSpeed Insights API for ${url}`)
      const response = await fetch(apiUrl)
      const data = await response.json()

      if (data.error) {
        debugLog("PageSpeed API error:", data.error)
        throw new Error(`PageSpeed API error: ${data.error.message || "Unknown error"}`)
      }

      // Extract the relevant metrics from the response
      const lighthouseResult = data.lighthouseResult
      if (!lighthouseResult) {
        debugLog("No Lighthouse results found")
        throw new Error("No Lighthouse results found")
      }

      // Extract scores
      const scores = {
        performance: lighthouseResult.categories.performance?.score || 0,
        accessibility: lighthouseResult.categories.accessibility?.score || 0,
        bestPractices: lighthouseResult.categories["best-practices"]?.score || 0,
        seo: lighthouseResult.categories.seo?.score || 0,
      }

      // Extract audits
      const audits = lighthouseResult.audits || {}

      // Extract key metrics
      const metrics = {
        firstContentfulPaint: audits["first-contentful-paint"]?.displayValue,
        speedIndex: audits["speed-index"]?.displayValue,
        largestContentfulPaint: audits["largest-contentful-paint"]?.displayValue,
        timeToInteractive: audits["interactive"]?.displayValue,
        totalBlockingTime: audits["total-blocking-time"]?.displayValue,
        cumulativeLayoutShift: audits["cumulative-layout-shift"]?.displayValue,
      }

      // Extract failed audits for improvement suggestions
      const failedAudits = Object.values(audits)
        .filter((audit: any) => audit.score !== null && audit.score < 0.9)
        .map((audit: any) => ({
          id: audit.id,
          title: audit.title,
          description: audit.description,
          score: audit.score,
        }))
        .sort((a: any, b: any) => a.score - b.score)
        .slice(0, 10) // Get the 10 worst audits

      // Calculate overall score (weighted average)
      const overallScore = Math.round(
        (scores.performance * 0.3 + scores.accessibility * 0.2 + scores.bestPractices * 0.2 + scores.seo * 0.3) * 100,
      )

      // Determine issue statuses
      const issues = {
        mobileFriendly: scores.performance > 0.7 ? "good" : scores.performance > 0.4 ? "warning" : "bad",
        pageSpeed: audits["speed-index"]?.score > 0.7 ? "good" : audits["speed-index"]?.score > 0.4 ? "warning" : "bad",
        seoBasics: scores.seo > 0.7 ? "good" : scores.seo > 0.4 ? "warning" : "bad",
        ssl: audits["is-on-https"]?.score === 1 ? "good" : "bad",
      }

      // Generate improvement suggestions
      const details = failedAudits.map((audit: any) => audit.title).slice(0, 7)

      // Add SSL specific message if needed
      if (issues.ssl === "bad") {
        details.unshift("Website does not use HTTPS for secure connections")
      }

      const result = {
        url,
        overallScore,
        scores,
        metrics,
        issues,
        details,
        failedAudits,
      }

      debugLog("Analysis complete", result)
      return NextResponse.json({ success: true, result })
    } catch (error) {
      debugLog("Lighthouse analysis error:", error)

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
          error: "Failed to analyze website",
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
