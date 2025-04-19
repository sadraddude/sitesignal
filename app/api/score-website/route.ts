import { type NextRequest, NextResponse } from "next/server"
import { scoreWebsite } from "@/lib/website-scorer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 })
    }

    // Score the website
    const score = await scoreWebsite(url)

    return NextResponse.json({
      success: true,
      score,
    })
  } catch (error) {
    console.error("Error scoring website:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to score website",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
