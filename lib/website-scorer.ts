import type { WebsiteScore } from "./types"; // Import from types.ts

// Define a new return type that includes HTML
export interface ScoreWebsiteResult {
  score: WebsiteScore;
  html: string;
}

// Function to analyze and score a website
export async function scoreWebsite(url: string): Promise<ScoreWebsiteResult> {
  // Ensure URL has scheme
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url
  }

  // Initialize score object
  const score: WebsiteScore = {
    overall: 0,
    seo: 0,
    mobile: 0,
    security: 0,
    performance: 0,
    design: 0,
    content: 0,
    contact: 0,
    issues: [],
    url,
    outdatedTechnologies: [],
    criticalIssues: [],
    emailsFound: [], // Initialize the new array
  }

  let html = ""; // Initialize html variable

  try {
    // Fetch the website
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000), // 15 second timeout
    })

    html = await response.text() // Assign fetched HTML
    const lowerHtml = html.toLowerCase()

    // --- Add Email Scraping --- 
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const foundEmails = html.match(emailRegex);
    if (foundEmails) {
      // Filter out potential image filenames or common non-email matches if needed
      // Example basic filter: remove items ending in common image extensions
      const commonImageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];
      score.emailsFound = [...new Set(foundEmails)].filter(email => 
        !commonImageExtensions.some(ext => email.toLowerCase().endsWith('.' + ext))
      );
    }
    // --- End Email Scraping ---

    // Security check (HTTPS)
    if (url.startsWith("https://")) {
      score.security += 50
    } else {
      score.issues.push("Not using HTTPS")
      score.criticalIssues?.push("No HTTPS encryption")
    }

    // Check for security headers
    const hasContentSecurityPolicy = response.headers.get("content-security-policy") !== null
    const hasXContentTypeOptions = response.headers.get("x-content-type-options") !== null
    const hasXFrameOptions = response.headers.get("x-frame-options") !== null
    const hasStrictTransportSecurity = response.headers.get("strict-transport-security") !== null

    let securityHeadersScore = 0
    if (hasContentSecurityPolicy) securityHeadersScore += 15
    if (hasXContentTypeOptions) securityHeadersScore += 10
    if (hasXFrameOptions) securityHeadersScore += 10
    if (hasStrictTransportSecurity) securityHeadersScore += 15

    score.security += securityHeadersScore

    if (!hasContentSecurityPolicy) score.issues.push("Missing Content-Security-Policy header")
    if (!hasXContentTypeOptions) score.issues.push("Missing X-Content-Type-Options header")
    if (!hasXFrameOptions) score.issues.push("Missing X-Frame-Options header")
    if (!hasStrictTransportSecurity) score.issues.push("Missing Strict-Transport-Security header")

    // SEO checks
    const hasTitle = html.includes("<title>") && html.includes("</title>")
    const hasMetaDescription = html.includes('name="description"')
    const hasH1 = html.includes("<h1") && html.includes("</h1>")
    const hasCanonical = html.includes('rel="canonical"')
    const hasStructuredData = html.includes("application/ld+json") || html.includes('itemtype="http://schema.org/')
    const hasOpenGraph = html.includes('property="og:') || html.includes('name="og:')

    let seoScore = 0
    if (hasTitle) seoScore += 15
    if (hasMetaDescription) seoScore += 15
    if (hasH1) seoScore += 15
    if (hasCanonical) seoScore += 15
    if (hasStructuredData) seoScore += 20
    if (hasOpenGraph) seoScore += 20

    score.seo = seoScore

    if (!hasTitle) {
      score.issues.push("Missing title tag")
      score.criticalIssues?.push("No page title")
    }
    if (!hasMetaDescription) score.issues.push("Missing meta description")
    if (!hasH1) score.issues.push("Missing H1 heading")
    if (!hasCanonical) score.issues.push("Missing canonical link")
    if (!hasStructuredData) score.issues.push("No structured data")
    if (!hasOpenGraph) score.issues.push("No Open Graph tags")

    // Mobile responsiveness checks
    const hasViewport = html.includes('name="viewport"')
    const hasMediaQueries = html.includes("@media")
    const hasTouchIcon = html.includes("apple-touch-icon") || html.includes("apple-mobile-web-app-capable")
    const hasLargeClickTargets =
      !html.includes("font-size: 8px") && !html.includes("font-size: 9px") && !html.includes("font-size: 10px")

    let mobileScore = 0
    if (hasViewport) mobileScore += 30
    if (hasMediaQueries) mobileScore += 30
    if (hasTouchIcon) mobileScore += 20
    if (hasLargeClickTargets) mobileScore += 20

    score.mobile = mobileScore

    if (!hasViewport) {
      score.issues.push("Missing viewport meta tag")
      score.criticalIssues?.push("Not mobile-friendly")
    }
    if (!hasMediaQueries) score.issues.push("No media queries detected")
    if (!hasTouchIcon) score.issues.push("No mobile icon")

    // Performance checks
    const htmlSize = html.length
    const hasLazyLoading = html.includes('loading="lazy"')
    const hasDeferredJS = html.includes("defer") || html.includes("async")
    const hasMinifiedCSS = !html.includes("    .") && !html.includes("    #")
    const hasMinifiedJS = !html.includes("    function") && !html.includes("    var")

    let performanceScore = 0
    if (htmlSize < 100000) performanceScore += 20
    if (hasLazyLoading) performanceScore += 20
    if (hasDeferredJS) performanceScore += 20
    if (hasMinifiedCSS) performanceScore += 20
    if (hasMinifiedJS) performanceScore += 20

    score.performance = performanceScore

    if (htmlSize > 200000) {
      score.issues.push("Very large HTML size may impact performance")
      score.criticalIssues?.push("Extremely slow loading")
    } else if (htmlSize > 100000) {
      score.issues.push("Large HTML size may impact performance")
    }
    if (!hasLazyLoading) score.issues.push("No lazy loading for images")
    if (!hasDeferredJS) score.issues.push("No deferred JavaScript loading")
    if (!hasMinifiedCSS) score.issues.push("CSS not minified")
    if (!hasMinifiedJS) score.issues.push("JavaScript not minified")

    // Check for render-blocking resources
    const inlineStyles = (html.match(/<style/g) || []).length
    const inlineScripts = (html.match(/<script/g) || []).length

    if (inlineStyles + inlineScripts > 15) {
      score.issues.push("Many inline styles/scripts may block rendering")
      score.performance -= 10
    }

    // Design modernity check
    const hasFlex = lowerHtml.includes("display: flex") || lowerHtml.includes("display:flex")
    const hasGrid = lowerHtml.includes("display: grid") || lowerHtml.includes("display:grid")
    const hasModernFramework =
      lowerHtml.includes("react") ||
      lowerHtml.includes("vue") ||
      lowerHtml.includes("angular") ||
      lowerHtml.includes("bootstrap") ||
      lowerHtml.includes("tailwind")
    const hasAnimations = lowerHtml.includes("animation") || lowerHtml.includes("transition")
    const hasCustomFonts =
      lowerHtml.includes("font-family") &&
      !lowerHtml.includes("font-family: Arial") &&
      !lowerHtml.includes("font-family: Times")

    let designScore = 0
    if (hasFlex) designScore += 20
    if (hasGrid) designScore += 20
    if (hasModernFramework) designScore += 20
    if (hasAnimations) designScore += 20
    if (hasCustomFonts) designScore += 20

    score.design = designScore

    if (!hasFlex && !hasGrid) {
      score.issues.push("No modern CSS layouts detected")
      score.outdatedTechnologies?.push("Outdated CSS (no flexbox/grid)")
    }
    if (!hasModernFramework) {
      score.issues.push("No modern frameworks detected")
      score.outdatedTechnologies?.push("No modern web frameworks")
    }
    if (!hasAnimations) score.issues.push("No animations or transitions")
    if (!hasCustomFonts) score.issues.push("No custom fonts")

    // Check for outdated technologies
    if (lowerHtml.includes("<frameset") || lowerHtml.includes("<frame ")) {
      score.issues.push("Using deprecated frames")
      score.outdatedTechnologies?.push("Frames (deprecated since HTML5)")
      score.design -= 20
    }

    if (lowerHtml.includes("<marquee")) {
      score.issues.push("Using deprecated marquee element")
      score.outdatedTechnologies?.push("Marquee tags (deprecated)")
      score.design -= 20
    }

    if (lowerHtml.includes("<blink")) {
      score.issues.push("Using deprecated blink element")
      score.outdatedTechnologies?.push("Blink tags (deprecated)")
      score.design -= 20
    }

    if (lowerHtml.includes("document.write(")) {
      score.issues.push("Using document.write (poor performance)")
      score.outdatedTechnologies?.push("document.write (poor performance)")
      score.performance -= 20
    }

    if (lowerHtml.includes("jquery-1.") || lowerHtml.includes("jquery-2.")) {
      score.issues.push("Using outdated jQuery version")
      score.outdatedTechnologies?.push("Outdated jQuery")
      score.security -= 10
    }

    // Content quality check
    const wordCount = html.replace(/<[^>]*>/g, " ").split(/\s+/).length
    const hasSocialSharing =
      lowerHtml.includes("facebook.com") ||
      lowerHtml.includes("twitter.com") ||
      lowerHtml.includes("instagram.com") ||
      lowerHtml.includes("linkedin.com")
    const hasImages = (html.match(/<img/g) || []).length > 2
    const hasVideo =
      lowerHtml.includes("youtube.com") || lowerHtml.includes("vimeo.com") || lowerHtml.includes("<video")
    const hasLists = lowerHtml.includes("<ul") || lowerHtml.includes("<ol")

    let contentScore = 0
    if (wordCount > 300) contentScore += 20
    if (hasSocialSharing) contentScore += 20
    if (hasImages) contentScore += 20
    if (hasVideo) contentScore += 20
    if (hasLists) contentScore += 20

    score.content = contentScore

    if (wordCount < 100) {
      score.issues.push("Very little content detected")
      score.criticalIssues?.push("Minimal content")
    } else if (wordCount < 300) {
      score.issues.push("Limited content detected")
    }
    if (!hasSocialSharing) score.issues.push("No social sharing links")
    if (!hasImages) score.issues.push("Few or no images")
    if (!hasVideo) score.issues.push("No video content")
    if (!hasLists) score.issues.push("No list elements for scannable content")

    // Contact information check
    const hasEmail = lowerHtml.includes("@") && lowerHtml.includes(".com")
    const hasPhone = lowerHtml.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) !== null
    const hasContactForm = lowerHtml.includes("contact") && lowerHtml.includes("form") && lowerHtml.includes("input")
    const hasAddress = lowerHtml.includes("address") || (lowerHtml.includes("street") && lowerHtml.includes("city"))
    const hasMap = lowerHtml.includes("maps.google.com") || lowerHtml.includes("google.com/maps")

    let contactScore = 0
    if (hasEmail) contactScore += 20
    if (hasPhone) contactScore += 20
    if (hasContactForm) contactScore += 20
    if (hasAddress) contactScore += 20
    if (hasMap) contactScore += 20

    score.contact = contactScore

    if (!hasEmail && !hasContactForm) {
      score.issues.push("No way to contact via email")
      score.criticalIssues?.push("No email contact method")
    }
    if (!hasPhone) score.issues.push("No phone number detected")
    if (!hasAddress) score.issues.push("No physical address detected")

    // Check for copyright year to estimate last update
    const currentYear = new Date().getFullYear()
    const copyrightMatch =
      lowerHtml.match(/copyright\s+(?:&copy;|©)?\s*\d{4}/i) ||
      lowerHtml.match(/©\s*\d{4}/i) ||
      lowerHtml.match(/\d{4}\s+(?:&copy;|©)/i)

    if (copyrightMatch) {
      const yearMatch = copyrightMatch[0].match(/\d{4}/)
      if (yearMatch) {
        const copyrightYear = Number.parseInt(yearMatch[0])
        score.lastUpdated = copyrightYear.toString()

        // Penalize for outdated copyright
        if (copyrightYear < currentYear - 3) {
          score.issues.push(`Copyright year is outdated (${copyrightYear})`)
          score.outdatedTechnologies?.push(`Last updated ${currentYear - copyrightYear} years ago`)
          const agePenalty = Math.min(30, (currentYear - copyrightYear) * 5)
          score.design = Math.max(0, score.design - agePenalty)
        }
      }
    }

    // Final score calculations (weighted average, bounds, badness score)
    score.overall = Math.round(
      score.seo * 0.2 + score.mobile * 0.2 + score.security * 0.2 + 
      score.performance * 0.15 + score.design * 0.1 + score.content * 0.1 + 
      score.contact * 0.05
    )
    score.overall = Math.max(0, Math.min(100, score.overall))
    score.seo = Math.max(0, Math.min(100, score.seo))
    score.mobile = Math.max(0, Math.min(100, score.mobile))
    score.security = Math.max(0, Math.min(100, score.security))
    score.performance = Math.max(0, Math.min(100, score.performance))
    score.design = Math.max(0, Math.min(100, score.design))
    score.content = Math.max(0, Math.min(100, score.content))
    score.contact = Math.max(0, Math.min(100, score.contact))
    score.badnessScore = 100 - score.overall
    if (score.criticalIssues && score.criticalIssues.length > 0) {
      score.badnessScore += score.criticalIssues.length * 5
    }
    if (score.outdatedTechnologies && score.outdatedTechnologies.length > 0) {
      score.badnessScore += score.outdatedTechnologies.length * 3
    }

    // Return both score and html
    return { score, html }
  } catch (error) {
    console.error(`Error analyzing website ${url}:`, error)

    // Add specific error messages
    score.issues.push("Failed to analyze website")
    score.issues.push(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    score.criticalIssues?.push("Analysis Failed")
    score.badnessScore = 70 // Assign default badness score on error

    // Return score with issues and empty html on error
    return { score, html: "" }
  }
}
