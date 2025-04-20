import { type NextRequest, NextResponse } from "next/server";
import { scoreWebsite } from "@/lib/website-scorer";
import { withRateLimit } from "@/lib/rate-limit"; // Apply rate limiting if desired
import { auth } from "@clerk/nextjs/server"; // Import Clerk auth

export async function POST(request: NextRequest) {
  // Check authentication
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // Apply rate limiting (optional but recommended)
  return withRateLimit(
    request,
    async () => {
      try {
        const body = await request.json();
        const { url } = body;

        if (!url || typeof url !== 'string') {
          return NextResponse.json({ success: false, error: "URL parameter is required and must be a string." }, { status: 400 });
        }

        console.log(`[API analyze-single] Received request to analyze: ${url} for user: ${userId}`);

        // Validate URL format (basic check)
        let validatedUrl: URL;
        try {
            validatedUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
        } catch (e) {
            return NextResponse.json({ success: false, error: "Invalid URL format." }, { status: 400 });
        }

        // Call the scoring function
        const score = await scoreWebsite(validatedUrl.toString());

        console.log(`[API analyze-single] Successfully analyzed: ${url}`);
        return NextResponse.json({ success: true, score: score });

      } catch (error) {
        console.error(`[API analyze-single] Error analyzing website:`, error);
        // Provide a generic error message, log the specific one
        const errorMessage = error instanceof Error ? error.message : "Unknown analysis error";
        if (errorMessage.includes('timeout')) {
             return NextResponse.json({ success: false, error: "Analysis timed out." }, { status: 504 }); // Gateway Timeout
        } else if (errorMessage.includes('fetch failed') || errorMessage.includes('ENOTFOUND')) {
             return NextResponse.json({ success: false, error: "Could not reach the website to analyze." }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: "Failed to analyze website." }, { status: 500 });
      }
    },
    { limit: 20, window: 60 } // Example: Limit to 20 analysis requests per minute per user
  );
} 