import { type NextRequest, NextResponse } from "next/server"
import { scoreWebsite } from "@/lib/website-scorer"
import { performAdvancedAnalysis } from "@/lib/advanced-scoring-engine"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const url = body.url

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: "URL is required and must be a string" }, { status: 400 })
    }

    const { score: basicScore, html } = await scoreWebsite(url)

    const advancedResult = performAdvancedAnalysis(basicScore, "default", "small", html)

    return NextResponse.json({ success: true, analysis: advancedResult })
  } catch (error) {
    console.error("Error analyzing/scoring website:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error during analysis"
    return NextResponse.json({ success: false, error: "Failed to perform website analysis", details: errorMessage }, { status: 500 })
  }
}
