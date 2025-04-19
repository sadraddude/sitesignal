import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpoint, ...data } = body

    // Determine which Python endpoint to call
    const pythonEndpoint = `/api/${endpoint}`

    // Call the Python API
    const response = await fetch(`${process.env.VERCEL_URL || "http://localhost:3000"}${pythonEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Python bridge error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
