import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 })
  }

  try {
    console.log(`Testing direct access to: ${url}`)

    // Try to fetch the website directly
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    const text = await response.text()

    return NextResponse.json({
      success: true,
      status: response.status,
      contentLength: text.length,
      contentSample: text.substring(0, 1000) + "...",
    })
  } catch (error) {
    console.error("Direct test failed:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
