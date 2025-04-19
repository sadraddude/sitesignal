// Types
export interface WebsiteAnalysisResult {
  status: string
  issues: string[]
  emailBody: string
}

// Website scraping function
export async function analyzeWebsite(url: string): Promise<WebsiteAnalysisResult> {
  // Ensure URL has scheme
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url
  }

  try {
    // Simplified analysis - just check if the site is reachable
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      redirect: "follow",
    })

    // Generate some sample issues
    const issues = []

    if (!response.url.startsWith("https")) {
      issues.push("NO_HTTPS")
    }

    // Generate email body
    const emailBody = generateEmailBody(issues)

    return {
      status: "OK",
      issues,
      emailBody,
    }
  } catch (error) {
    console.error("Error analyzing website:", error)
    return {
      status: "ERROR",
      issues: ["CONNECTION_ERROR"],
      emailBody: generateEmailBody(["CONNECTION_ERROR"]),
    }
  }
}

// Simplified email generation
function generateEmailBody(issues: string[]): string {
  if (issues.length === 0) {
    return "I took a quick look at your website and things seem technically sound from my initial check!"
  }

  let emailBody = "Hope you're having a productive week.\n\n"
  emailBody +=
    "I came across your business while looking for established businesses in your area, and I took a moment to review your website.\n\n"
  emailBody +=
    "I noticed a few technical opportunities that, if addressed, could potentially improve visitor trust and how effectively the site attracts new customers:\n\n"

  if (issues.includes("NO_HTTPS")) {
    emailBody +=
      '- Site Security (HTTPS): The site currently loads over HTTP. Browsers mark these as "Not Secure," which can deter visitors.\n'
  }

  if (issues.includes("CONNECTION_ERROR")) {
    emailBody += "- Site Availability: Could not establish a connection to the website.\n"
  }

  emailBody +=
    "\nAt SiteRevive, we specialize in helping local service businesses optimize these technical aspects of their websites.\n\n"
  emailBody +=
    "Would you be open to a brief chat next week to discuss if improving these areas could benefit your business?"

  return emailBody
}
