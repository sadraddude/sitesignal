import { type NextRequest, NextResponse } from "next/server"

// Remove the static US_CITIES array
// const US_CITIES = [...];

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(request: NextRequest) {
  if (!PLACES_API_KEY) {
    console.error("GOOGLE_PLACES_API_KEY is not set.");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")?.trim() || ""

    // Log the query for debugging
    console.log("City search query:", query)

    // Require at least 2 characters for autocomplete to be effective
    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    // Construct Google Places Autocomplete URL
    const autocompleteUrl = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
    autocompleteUrl.searchParams.append("input", query);
    autocompleteUrl.searchParams.append("key", PLACES_API_KEY);
    autocompleteUrl.searchParams.append("types", "(cities)");
    // Optional: Restrict to US cities
    // autocompleteUrl.searchParams.append("components", "country:us");

    // Call Google Places API
    const response = await fetch(autocompleteUrl.toString());

    if (!response.ok) {
      console.error(`Google Places API error: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error("Error body:", errorBody);
      return NextResponse.json({ error: "Failed to fetch city suggestions from external API" }, { status: response.status });
    }

    const data = await response.json();

    // Check Google API status
    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error(`Google Places API returned status: ${data.status}`, data.error_message);
      return NextResponse.json({ error: `Google API Error: ${data.status}` }, { status: 500 });
    }

    // Extract suggestions (predictions)
    const suggestions = data.predictions?.map((prediction: any) => prediction.description) || [];

    // Log the results for debugging
    console.log("Filtered cities (from Google API):", suggestions)

    return NextResponse.json({ suggestions: suggestions })
  } catch (error) {
    console.error("Error in city suggestions API:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed to fetch city suggestions: ${errorMessage}` }, { status: 500 })
  }
}
