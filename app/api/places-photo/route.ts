import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const photoReference = searchParams.get("reference")
  const maxWidth = searchParams.get("maxwidth") || "400"

  if (!photoReference) {
    return new Response("Photo reference is required", { status: 400 })
  }

  if (!process.env.GOOGLE_PLACES_API_KEY) {
    return new Response("Google Places API key is not configured", { status: 500 })
  }

  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${process.env.GOOGLE_PLACES_API_KEY}`

  try {
    const response = await fetch(photoUrl)

    if (!response.ok) {
      return new Response("Failed to fetch photo", { status: response.status })
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer()

    // Get the content type from the response
    const contentType = response.headers.get("content-type") || "image/jpeg"

    // Return the image with the correct content type
    return new Response(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    })
  } catch (error) {
    console.error("Error fetching photo:", error)
    return new Response("Failed to fetch photo", { status: 500 })
  }
}
