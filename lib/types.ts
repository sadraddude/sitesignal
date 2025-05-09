export interface Business {
  id: string
  name: string
  address: string
  phone?: string | null
  website?: string | null
  category?: string | null
  websiteScore?: WebsiteScore | null
  designAge?: {
    score?: number | null
    designYear?: number | null
    designAge?: number | null
    designAgeCategory?: "modern" | "aging" | "dated" | "outdated" | null
    analysis?: string | null
    issues?: string[] | null
    recommendations?: string[] | null
    screenshot?: string | null
  } | null
  googleData?: {
    rating?: number | null
    userRatingsTotal?: number | null
    placeUrl?: string | null
    photos?: {
      reference: string
      width: number
      height: number
    }[] | null
  } | null
  details?: string[] | null
  regeneratedUrl?: string | null
  generatedEmail?: string | null
  subjectLine?: string | null
  googlePlaceId?: string
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
  outdatedTechnologies?: string[] | null
  criticalIssues?: string[] | null
  improvementScore?: number | null
  badnessScore?: number // Higher means worse (opposite of overall)
  emailsFound?: string[] // Add optional array for scraped emails
}
