import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { auth } from "@clerk/nextjs/server"
import { withRateLimit } from "@/lib/rate-limit" // Assuming you have rate limiting setup
import type { WebsiteScore } from "@/lib/types"

// Initialize the Google Generative AI client
// Ensure GEMINI_API_KEY is set in your .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Function to extract key negative points from the score
function extractKeyIssues(score: WebsiteScore | null | undefined): string {
  if (!score) return "some areas for potential improvement."

  const issues: string[] = []

  // Prioritize critical issues
  if (score.criticalIssues && score.criticalIssues.length > 0) {
    issues.push(...score.criticalIssues.slice(0, 2)) // Max 2 critical
  }

  // Add low scores if needed (below 50?)
  if (issues.length < 3 && score.overall < 50) {
    if (score.mobile < 50) issues.push("poor mobile responsiveness")
    if (score.performance < 50) issues.push("slow performance")
    if (score.seo < 50) issues.push("low search engine visibility (SEO)")
    if (score.security < 60) issues.push("potential security concerns")
    if (score.design < 50) issues.push("an outdated design")
  }

  // Add outdated tech if still space
  if (issues.length < 3 && score.outdatedTechnologies && score.outdatedTechnologies.length > 0) {
    issues.push(`use of outdated technologies like ${score.outdatedTechnologies[0]}`)
  }

  // Fallback generic issue
  if (issues.length === 0) {
    issues.push("some potential areas for online improvement")
  }

  // Join issues into a readable string
  if (issues.length === 1) {
    return issues[0] + "."
  } else if (issues.length === 2) {
    return `${issues[0]} and ${issues[1]}.`
  } else {
    // Join first n-1 with comma, last with 'and'
    const last = issues.pop()
    return `${issues.join(", ")} and ${last}.`
  }
}

export async function POST(request: NextRequest) {
    // Apply rate limiting
    return withRateLimit(request, async () => {
        const { userId } = await auth();
        if (!userId) {
          return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        try {
            const body = await request.json();
            const { businessName, websiteUrl, score } = body as {
                businessName: string;
                websiteUrl: string;
                score: WebsiteScore; // Assuming the full score object is passed
            };

            if (!businessName || !websiteUrl || !score) {
                return NextResponse.json({ success: false, error: "Missing required data: businessName, websiteUrl, score" }, { status: 400 });
            }

            // 1. Prepare specific data points for the prompt
            const performanceText = `Performance Score: ${score.performance}/100`;
            const criticalIssuesText = score.criticalIssues && score.criticalIssues.length > 0
                ? `Critical Issues Found: ${score.criticalIssues.join(', ')}.`
                : '';
            const outdatedTechText = score.outdatedTechnologies && score.outdatedTechnologies.length > 0
                ? `Outdated Technologies: ${score.outdatedTechnologies.join(', ')}.`
                : '';

            const generalIssuesText = score.issues && score.issues.length > 0
                ? `Other Specific Issues Found: ${score.issues.slice(0, 3).join("; ")}` // Take first 3
                : '';

            let analysisHighlights = `-   Overall Score: ${score.overall}/100`;
            if (score.criticalIssues && score.criticalIssues.length > 0) {
                analysisHighlights += `\n    -   Key Issue Noted: ${score.criticalIssues[0]}`;
            }
            analysisHighlights += `\n    (Other scores available if needed: Performance: ${score.performance}/100, SEO: ${score.seo}/100, Mobile: ${score.mobile}/100, Security: ${score.security}/100)`;

            // --- BEGIN DEBUG LOGGING ---
            // console.log("--- Generating Email ---");
            // console.log("Received Score Object:", JSON.stringify(score, null, 2));
            // --- END DEBUG LOGGING ---

            // 2. Construct the Prompt for Gemini
            const prompt = `
You are an AI assistant for a web design agency.
Your task is to write a concise, professional, and highly personalized cold outreach email from the agency to a potential client.

**Goal:**
The primary goal is to pique the prospect's interest in a website redesign or improvement by:
1.  Highlighting specific, actionable pain points discovered on their current website.
2.  Clearly articulating the value proposition (how a better website will benefit their business).
3.  Offering a compelling, low-friction call-to-action.

**Key Principles from Effective Cold Emails to Incorporate:**
-   **Attention-Grabbing Subject Line:** Make it personal and benefit-oriented. Spark curiosity.
-   **Personalized Opening:** Start with a genuine observation or compliment about their business/website before mentioning issues.
-   **Clear Value Proposition:** Explain how your web design services solve their problems and deliver results (e.g., more customers, better UX, higher conversions).
-   **Address Specific Pain Points:** Use the provided analysis data. Don't be generic.
-   **Focus on Benefits, Not Just Features:** Explain *why* fixing an issue matters to their business.
-   **Brief Portfolio/Expertise Mention (Optional):** Subtly establish credibility.
-   **Compelling Call-to-Action (CTA):** Make it clear, direct, and benefit-driven.
-   **Professional Tone & Signature:** Be helpful, consultative, and avoid jargon.
-   **Conciseness:** Keep the email relatively short and easy to scan.

**Business Details (Provided by SiteSignal Analysis):**
-   Name: ${businessName}
-   Website: ${websiteUrl}
-   SiteSignal Analysis Highlights:
    ${analysisHighlights}

**Email Generation Instructions:**

1.  **Subject Line:**
    *   Craft an engaging subject line. Examples:
        *   "A thought on ${businessName}\'s website experience"
        *   "Idea to enhance ${businessName}\'s online presence"
        *   "Boosting ${businessName}\'s website: A quick observation"
        *   "Transforming ${businessName}\'s website to attract more clients"
    *   Personalize with ${businessName}.
    *   The subject line should be the very first part of your output, followed by a newline, then the email body.

2.  **Opening:**
    *   DO NOT include an initial salutation (e.g., "Hi team at..." or "Hello..."). Start the email body directly with the first sentence.
    *   The first sentence MUST be: "I found your site on google maps and as I was looking through it, I noticed a few things that if changed, could improve your ranking and conversion rate."

3.  **Transition to Pain Points & Value:**
    *   Smoothly transition to the issues found, focusing primarily on the **Overall Score**.
    *   If the **Overall Score (${score.overall}/100) is below 70**, highlight this as an area for improvement.
        *   Example: "Our analysis showed an overall website score of ${score.overall}/100. Improving this can significantly enhance user experience, build more trust, and lead to better online results for ${businessName}."
    *   If the **Overall Score is 70 or above, but a significant critical issue exists** (like 'No HTTPS encryption' or a major accessibility flaw from \`score.criticalIssues[0]\`), you can briefly mention that specific critical issue and its importance.
        *   Example (if overall score is good but HTTPS is missing): "While your site has several strengths, we noticed it isn't currently using HTTPS encryption. Securing your site is crucial for visitor trust and data protection."
    *   Connect the primary observation (low overall score or key critical issue) to a **business benefit/value proposition**.

4.  **Briefly State Agency's Value/Expertise (Optional):**
    *   Insert a short sentence about what the agency does.
        *   Example: "At SiteRevive.io, we specialize in creating modern, high-performing websites that help businesses like ${businessName} thrive online."
        *   Example: "SiteRevive.io has helped companies in your sector achieve [mention a general positive outcome, e.g., 'better search rankings and lead generation'] through strategic website redesigns."

5.  **Compelling Call-to-Action (CTA):**
    *   Use the following call to action, ensuring it flows naturally as the conclusion of the email:
        *   "We work quickly. If you'd like, I can create a free modernized preview of your site. Do you mind if I send you over the preview?"

6.  **Closing & Professional Signature:**
    *   DO NOT include a closing (e.g., "Best regards,") or any signature block (e.g., "[Your Name]", etc.). The email body should end with the CTA.

**Output Format:**
Generate the subject line on the first line, followed by a newline character, and then the email body. 
Example:
Subject: Your Website Reimagined

I took a look at your website...

`;

            // --- BEGIN DEBUG LOGGING ---
            // console.log("\n--- Prompt Sent to Gemini ---");
            // console.log(prompt);
            // console.log("---------------------------\n");
            // --- END DEBUG LOGGING ---

            // 3. Call Gemini API with retry logic
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            let generatedText = "";
            const MAX_AI_RETRIES = 2; // Max 2 retries (total 3 attempts)
            const INITIAL_AI_RETRY_DELAY = 2000; // 2 seconds

            for (let attempt = 0; attempt <= MAX_AI_RETRIES; attempt++) {
                try {
                    console.log(`Attempting to generate content from Gemini (Attempt ${attempt + 1})`);
                    const result = await model.generateContent(prompt);
                    const response = result.response;
                    generatedText = response.text();
                    if (generatedText) {
                        break; // Success, exit loop
                    }
                    // If generatedText is empty but no error, it's an issue, but might not be a rate limit.
                    // For simplicity, we'll let it fall through to the throw if it happens on the last attempt.
                    if (attempt === MAX_AI_RETRIES && !generatedText) {
                        throw new Error("AI failed to generate content after multiple attempts (empty response).");
                    }

                } catch (aiError: any) {
                    console.error(`Gemini API error (Attempt ${attempt + 1}/${MAX_AI_RETRIES + 1}):`, aiError);
                    if (attempt < MAX_AI_RETRIES) {
                        // Check if the error message indicates a rate limit (this is a common pattern for Google AI)
                        // You might need to adjust this check based on actual error messages from Gemini SDK
                        const isRateLimitError = aiError.message && 
                                               (aiError.message.includes("429") || 
                                                aiError.message.toLowerCase().includes("rate limit") || 
                                                aiError.message.toLowerCase().includes("quota exceeded") ||
                                                aiError.message.toLowerCase().includes("resource exhausted"));

                        if (isRateLimitError) {
                            const delay = INITIAL_AI_RETRY_DELAY * Math.pow(3, attempt); // 2s, 6s
                            console.warn(`Rate limit suspected. Retrying in ${delay / 1000}s...`);
                            await new Promise(resolve => setTimeout(resolve, delay));
                            continue; // Go to next attempt
                        } else {
                             // For non-rate-limit errors, or if it is a rate limit but on the last attempt, throw to exit.
                             throw aiError; 
                        }
                    } else {
                        // Last attempt failed
                        throw new Error(`AI failed to generate content after multiple retries. Last error: ${aiError.message}`);
                    }
                }
            }

            if (!generatedText) {
                // This should ideally be caught by the loop's final attempt error handling
                console.error("Critical: AI generated no text after retries and loop completion without success.");
                return NextResponse.json({ success: false, error: "AI failed to generate email content after all attempts." }, { status: 500 });
            }

            // 4. Parse Subject and Body, then Return the result
            const parts = generatedText.split('\n');
            let subjectLine = "";
            let emailBody = "";

            if (parts.length > 0 && parts[0].toLowerCase().startsWith("subject: ")) {
                subjectLine = parts[0].substring("subject: ".length).trim();
                emailBody = parts.slice(1).join('\n').trim();
            } else {
                // Fallback if the format is not as expected (e.g., AI didn't include "Subject: ")
                // Or if there's no newline, treat the whole thing as body (and maybe set a default subject)
                console.warn("AI output did not strictly follow Subject: Your Subject\nBody... format. Attempting to parse.");
                if (parts.length > 1) { // Assume first line is subject, rest is body
                    subjectLine = parts[0].trim();
                    emailBody = parts.slice(1).join('\n').trim();
                } else { // Treat all as body
                    emailBody = generatedText.trim();
                    subjectLine = `Quick Idea for ${businessName}`; // Default subject
                }
            }

            return NextResponse.json({ success: true, subjectLine: subjectLine, emailBody: emailBody });

        } catch (error) {
            console.error("Error generating outreach email:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error during email generation";
            return NextResponse.json({ success: false, error: "Failed to generate email", details: errorMessage }, { status: 500 });
        }
     }, { limit: 20, window: 60 }); // Example rate limit: 20 reqs/minute
} 