export interface Business {
  id: string
  name: string
  address: string
  phone?: string
  website?: string
  score: number
  issues: {
    mobileFriendly: "good" | "warning" | "bad"
    pageSpeed: "good" | "warning" | "bad"
    seoBasics: "good" | "warning" | "bad"
    ssl: "good" | "warning" | "bad"
  }
  details: string[]
  regeneratedUrl?: string
  // Add design age information
  designAge?: {
    score: number
    designYear: number
    designAge: number
    designAgeCategory: "modern" | "aging" | "dated" | "outdated"
    analysis: string
    issues: string[]
    recommendations: string[]
    screenshot: string
  }
  // Add Google Places specific data
  googleData?: {
    rating?: number
    userRatingsTotal?: number
    placeUrl?: string
    photos?: {
      reference: string
      width: number
      height: number
    }[]
  }
}

export interface SearchParams {
  term: string
  location: string
  industry: string
  count: number
}

export interface RegenerationResult {
  businessId: string
  deploymentUrl: string
  status: "success" | "failed"
  message?: string
}

export interface WebsiteScore {
  overall: number // 0-100
  seo: number // 0-100
  mobile: number // 0-100
  security: number // 0-100
  performance: number // 0-100
  design: number // 0-100
  content: number // 0-100
  contact: number // 0-100
  issues: string[]
  url: string
  lastUpdated?: string | null
  outdatedTechnologies?: string[]
  criticalIssues?: string[]
  badnessScore?: number // Higher means worse (opposite of overall)
}
