// Advanced proprietary scoring engine with industry-specific benchmarks
import type { WebsiteScore } from "@/lib/types"

// Industry benchmark data (would be expanded with real data)
const INDUSTRY_BENCHMARKS = {
  restaurants: {
    overall: 72,
    seo: 68,
    mobile: 75,
    security: 65,
    performance: 70,
    design: 78,
    content: 74,
    contact: 82,
  },
  healthcare: {
    overall: 76,
    seo: 72,
    mobile: 74,
    security: 85,
    performance: 68,
    design: 72,
    content: 80,
    contact: 88,
  },
  retail: {
    overall: 74,
    seo: 70,
    mobile: 78,
    security: 68,
    performance: 72,
    design: 80,
    content: 76,
    contact: 75,
  },
  // Default benchmark for industries not specifically defined
  default: {
    overall: 70,
    seo: 65,
    mobile: 72,
    security: 68,
    performance: 67,
    design: 73,
    content: 72,
    contact: 78,
  },
}

// Conversion impact factors - how much each score category impacts conversion rates
// These would be derived from proprietary research and machine learning models
const CONVERSION_IMPACT_FACTORS = {
  seo: 0.15,
  mobile: 0.25,
  security: 0.1,
  performance: 0.2,
  design: 0.15,
  content: 0.1,
  contact: 0.05,
}

// Revenue impact model parameters
const REVENUE_IMPACT = {
  baseConversionLift: 0.02, // 2% base conversion rate improvement
  scoreMultiplier: 0.0005, // Additional lift per point of score improvement
  averageOrderValue: {
    restaurants: 35,
    healthcare: 150,
    retail: 65,
    default: 50,
  },
  monthlyTrafficEstimates: {
    verySmall: 500,
    small: 1500,
    medium: 5000,
    large: 15000,
    veryLarge: 50000,
  },
}

// Technology detection signatures
const TECHNOLOGY_SIGNATURES = {
  wordpress: ["wp-content", "wp-includes", "wordpress"],
  wix: ["wix.com", "_wix_", "X-Wix-"],
  squarespace: ["squarespace.com", "static.squarespace", "squarespace-cdn"],
  shopify: ["shopify.com", "cdn.shopify", "myshopify"],
  joomla: ["joomla", "Joomla!"],
  drupal: ["drupal", "Drupal."],
  magento: ["magento", "Magento"],
  webflow: ["webflow.com", "webflow.io"],
  bootstrap: ["bootstrap.css", "bootstrap.min.css", "bootstrap.js"],
  jquery: ["jquery", "jquery.min.js", "jquery.js"],
  react: ["react.js", "react.production.min.js", "react-dom"],
  angular: ["angular.js", "ng-", "angular.min.js"],
  vue: ["vue.js", "vue.min.js", "v-"],
}

// Advanced security vulnerability patterns
const SECURITY_VULNERABILITIES = {
  xssVulnerabilities: ["document.write(location", "eval(", "innerHTML ="],
  outdatedLibraries: ["jquery-1.", "jquery-2.", "bootstrap-3", "angular.js@1"],
  insecureConfigurations: ["X-Frame-Options: ALLOW", "Access-Control-Allow-Origin: *"],
  dataLeakage: ["admin", "password", "config", "database", "db_"],
}

// Accessibility compliance patterns
const ACCESSIBILITY_PATTERNS = {
  missingAltText: ["<img", "alt="],
  colorContrast: ["color:", "background-color:"],
  ariaAttributes: ["aria-", "role="],
  keyboardNavigation: ["tabindex", "onkeydown", "onkeypress"],
}

export interface AdvancedAnalysisResult {
  score: WebsiteScore
  industryComparison: {
    industry: string
    percentile: number
    averageScore: number
    leadingCompetitorScore: number
  }
  conversionImpact: {
    estimatedCurrentRate: number
    potentialRate: number
    percentImprovement: number
  }
  revenueImpact: {
    trafficEstimate: number
    monthlyRevenueLift: number
    annualRevenueLift: number
  }
  technologiesDetected: string[]
  securityVulnerabilities: string[]
  accessibilityIssues: string[]
  competitiveAdvantage: {
    strengthAreas: string[]
    improvementAreas: string[]
    opportunityScore: number
  }
  implementationComplexity: {
    level: "low" | "medium" | "high"
    estimatedTimeInWeeks: number
    keyConsiderations: string[]
  }
}

export function performAdvancedAnalysis(
  score: WebsiteScore,
  industry = "default",
  businessSize: "verySmall" | "small" | "medium" | "large" | "veryLarge" = "small",
  html = "",
): AdvancedAnalysisResult {
  // Get the appropriate industry benchmark
  const benchmark = INDUSTRY_BENCHMARKS[industry] || INDUSTRY_BENCHMARKS.default

  // Calculate industry percentile (simplified calculation)
  const percentile = Math.round(100 - (score.overall / benchmark.overall) * 100)

  // Detect technologies
  const lowerHtml = html.toLowerCase()
  const technologiesDetected = Object.entries(TECHNOLOGY_SIGNATURES)
    .filter(([_, signatures]) => signatures.some((sig) => lowerHtml.includes(sig.toLowerCase())))
    .map(([tech, _]) => tech)

  // Detect security vulnerabilities
  const securityVulnerabilities = []
  for (const [key, patterns] of Object.entries(SECURITY_VULNERABILITIES)) {
    if (patterns.some((pattern) => lowerHtml.includes(pattern.toLowerCase()))) {
      securityVulnerabilities.push(key)
    }
  }

  // Detect accessibility issues
  const accessibilityIssues = []
  if (
    ACCESSIBILITY_PATTERNS.missingAltText.every((pattern) => lowerHtml.includes(pattern)) &&
    !lowerHtml.includes('alt="')
  ) {
    accessibilityIssues.push("Missing image alt text")
  }
  if (ACCESSIBILITY_PATTERNS.ariaAttributes.every((pattern) => !lowerHtml.includes(pattern))) {
    accessibilityIssues.push("No ARIA attributes for accessibility")
  }

  // Calculate conversion impact
  const scoreGap = Object.entries(CONVERSION_IMPACT_FACTORS).reduce((total, [key, factor]) => {
    const currentScore = score[key]
    const benchmarkScore = benchmark[key]
    return total + (benchmarkScore - currentScore) * factor
  }, 0)

  const estimatedCurrentRate = 0.02 // Assume 2% base conversion rate
  const potentialRate = estimatedCurrentRate + scoreGap * 0.0005 // 0.05% per point of improvement
  const percentImprovement = Math.round((potentialRate / estimatedCurrentRate - 1) * 100)

  // Calculate revenue impact
  const trafficEstimate = REVENUE_IMPACT.monthlyTrafficEstimates[businessSize]
  const averageOrderValue = REVENUE_IMPACT.averageOrderValue[industry] || REVENUE_IMPACT.averageOrderValue.default
  const additionalConversions = trafficEstimate * (potentialRate - estimatedCurrentRate)
  const monthlyRevenueLift = Math.round(additionalConversions * averageOrderValue)
  const annualRevenueLift = monthlyRevenueLift * 12

  // Determine competitive advantage
  const strengthAreas = Object.entries(score)
    .filter(([key, value]) => typeof value === "number" && benchmark[key] && value >= benchmark[key])
    .map(([key, _]) => key)

  const improvementAreas = Object.entries(score)
    .filter(([key, value]) => typeof value === "number" && benchmark[key] && value < benchmark[key] - 10)
    .map(([key, _]) => key)

  // Calculate opportunity score - higher means more opportunity for improvement
  const opportunityScore = Math.round(
    Object.entries(CONVERSION_IMPACT_FACTORS).reduce((total, [key, factor]) => {
      const currentScore = score[key]
      const benchmarkScore = benchmark[key]
      return total + Math.max(0, benchmarkScore - currentScore) * factor * 100
    }, 0),
  )

  // Determine implementation complexity
  let complexityLevel: "low" | "medium" | "high" = "medium"
  let estimatedTimeInWeeks = 4

  if (score.overall < 40 || improvementAreas.length > 4) {
    complexityLevel = "high"
    estimatedTimeInWeeks = 8
  } else if (score.overall > 70 && improvementAreas.length < 2) {
    complexityLevel = "low"
    estimatedTimeInWeeks = 2
  }

  const keyConsiderations = []
  if (improvementAreas.includes("security")) {
    keyConsiderations.push("Security infrastructure upgrades")
  }
  if (improvementAreas.includes("performance")) {
    keyConsiderations.push("Performance optimization")
  }
  if (improvementAreas.includes("mobile")) {
    keyConsiderations.push("Mobile responsiveness redesign")
  }
  if (technologiesDetected.includes("wordpress") || technologiesDetected.includes("wix")) {
    keyConsiderations.push("Platform migration considerations")
  }

  return {
    score,
    industryComparison: {
      industry,
      percentile,
      averageScore: benchmark.overall,
      leadingCompetitorScore: benchmark.overall + 10,
    },
    conversionImpact: {
      estimatedCurrentRate,
      potentialRate,
      percentImprovement,
    },
    revenueImpact: {
      trafficEstimate,
      monthlyRevenueLift,
      annualRevenueLift,
    },
    technologiesDetected,
    securityVulnerabilities,
    accessibilityIssues,
    competitiveAdvantage: {
      strengthAreas,
      improvementAreas,
      opportunityScore,
    },
    implementationComplexity: {
      level: complexityLevel,
      estimatedTimeInWeeks,
      keyConsiderations,
    },
  }
}

// Function to generate a proprietary "WebScore™" that combines multiple factors
export function calculateProprietaryWebScore(score: WebsiteScore): number {
  // This would be a complex algorithm combining multiple factors
  // For now, we'll use a weighted calculation that emphasizes mobile and security
  const baseScore = score.overall

  // Apply penalties for critical issues
  const criticalIssuesPenalty = (score.criticalIssues?.length || 0) * 5

  // Apply penalties for outdated technologies
  const outdatedTechPenalty = (score.outdatedTechnologies?.length || 0) * 3

  // Calculate mobile penalty (mobile is increasingly important)
  const mobilePenalty = Math.max(0, 80 - score.mobile) * 0.5

  // Calculate security penalty (security breaches are costly)
  const securityPenalty = Math.max(0, 80 - score.security) * 0.4

  // Calculate final proprietary score
  let proprietaryScore = baseScore - criticalIssuesPenalty - outdatedTechPenalty - mobilePenalty - securityPenalty

  // Ensure score is between 0-100
  proprietaryScore = Math.max(0, Math.min(100, proprietaryScore))

  return Math.round(proprietaryScore)
}
