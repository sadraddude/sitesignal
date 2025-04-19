import { type NextRequest, NextResponse } from "next/server"
import { getSearchHistory, clearSearchHistory } from "@/lib/search-history"
import { withRateLimit } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  return withRateLimit(
    request,
    async () => {
      try {
        // Get userId from query params or default to 'anonymous'
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId") || "anonymous"

        const history = await getSearchHistory(userId)

        return NextResponse.json({
          success: true,
          history,
        })
      } catch (error) {
        console.error("Failed to get search history:", error)
        return NextResponse.json({ success: false, error: "Failed to get search history" }, { status: 500 })
      }
    },
    { limit: 100, window: 60 * 5 }, // 100 requests per 5 minutes
  )
}

export async function DELETE(request: NextRequest) {
  return withRateLimit(
    request,
    async () => {
      try {
        // Get userId from query params or default to 'anonymous'
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get("userId") || "anonymous"

        const success = await clearSearchHistory(userId)

        return NextResponse.json({
          success,
        })
      } catch (error) {
        console.error("Failed to clear search history:", error)
        return NextResponse.json({ success: false, error: "Failed to clear search history" }, { status: 500 })
      }
    },
    { limit: 20, window: 60 * 5 }, // 20 requests per 5 minutes
  )
}
