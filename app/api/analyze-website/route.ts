import { type NextRequest, NextResponse } from "next/server"
import { analyzeWebsite } from "@/lib/website-analyzer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const url = body.url

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    const result = await analyzeWebsite(url)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error analyzing website:", error)
    return NextResponse.json({ error: "Failed to analyze website" }, { status: 500 })
  }
}
