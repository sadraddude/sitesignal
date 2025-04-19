"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Search,
  Download,
  Loader2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
  AlertTriangle,
  AlertCircle,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { WebsiteScoreDetails } from "@/components/website-score-details"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type WebsiteScore = {
  overall: number
  seo: number
  mobile: number
  security: number
  performance: number
  design: number
  content: number
  contact: number
  issues: string[]
  url: string
  lastUpdated?: string | null
  outdatedTechnologies?: string[]
  criticalIssues?: string[]
  badnessScore?: number
}

type Business = {
  id: string
  name: string
  address: string
  phone?: string
  website?: string
  websiteScore?: WebsiteScore | null
}

type SortField = "name" | "overall" | "seo" | "mobile" | "security" | "badnessScore" | null
type SortDirection = "asc" | "desc"

// Industry suggestions known for having outdated websites
const INDUSTRY_SUGGESTIONS = [
  "plumbers",
  "electricians",
  "hvac contractors",
  "roofers",
  "landscapers",
  "auto repair shops",
  "dentists",
  "chiropractors",
  "law firms",
  "accountants",
  "real estate agents",
  "insurance agents",
  "restaurants",
  "bakeries",
  "florists",
  "dry cleaners",
  "pet groomers",
  "hardware stores",
  "furniture stores",
  "appliance repair",
]

export function LeadGenerator() {
  const [businessType, setBusinessType] = useState("")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Business[]>([])
  const [error, setError] = useState<string | null>(null)
  const [includeScores, setIncludeScores] = useState(true)
  const [businessCount, setBusinessCount] = useState(20)
  const [sortField, setSortField] = useState<SortField>("badnessScore")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeTab, setActiveTab] = useState("search")
  const [showOnlyBadWebsites, setShowOnlyBadWebsites] = useState(true)
  const [badWebsiteThreshold, setBadWebsiteThreshold] = useState(60)
  const [searchStrategy, setSearchStrategy] = useState("standard")
  const [randomIndustry, setRandomIndustry] = useState("")

  // Get a random industry suggestion
  const getRandomIndustry = () => {
    const randomIndex = Math.floor(Math.random() * INDUSTRY_SUGGESTIONS.length)
    setRandomIndustry(INDUSTRY_SUGGESTIONS[randomIndex])
  }

  // Initialize with a random industry
  useState(() => {
    getRandomIndustry()
  })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!businessType || !location) {
      setError("Please enter both business type and location")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Modify the search query based on the selected strategy
      let searchQuery = `${businessType} in ${location}`

      if (searchStrategy === "outdated") {
        searchQuery = `old established ${businessType} in ${location}`
      } else if (searchStrategy === "small") {
        searchQuery = `small local ${businessType} in ${location}`
      } else if (searchStrategy === "family") {
        searchQuery = `family owned ${businessType} in ${location}`
      }

      const response = await fetch("/api/search-businesses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          includeScores,
          limit: businessCount,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to search for businesses")
      }

      setResults(data.businesses || [])

      // Switch to results tab
      setActiveTab("results")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to descending for scores, ascending for name
      setSortField(field)
      setSortDirection(field === "name" ? "asc" : "desc")
    }
  }

  const filteredResults = useMemo(() => {
    if (!showOnlyBadWebsites) return results

    return results.filter((business) => {
      // If no website or no score, include it (might be a good lead)
      if (!business.website || !business.websiteScore) return true

      // If using badness score
      if (business.websiteScore.badnessScore !== undefined) {
        return business.websiteScore.badnessScore >= badWebsiteThreshold
      }

      // Fallback to overall score
      return business.websiteScore.overall <= 100 - badWebsiteThreshold
    })
  }, [results, showOnlyBadWebsites, badWebsiteThreshold])

  const sortedResults = useMemo(() => {
    if (!sortField) return filteredResults

    return [...filteredResults].sort((a, b) => {
      if (sortField === "name") {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()
        return sortDirection === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
      }

      // Special handling for badnessScore
      if (sortField === "badnessScore") {
        const scoreA = a.websiteScore?.badnessScore ?? 50
        const scoreB = b.websiteScore?.badnessScore ?? 50

        return sortDirection === "asc" ? scoreA - scoreB : scoreB - scoreA
      }

      // For other score fields
      const scoreA = a.websiteScore?.[sortField] ?? 0
      const scoreB = b.websiteScore?.[sortField] ?? 0

      return sortDirection === "asc" ? scoreA - scoreB : scoreB - scoreA
    })
  }, [filteredResults, sortField, sortDirection])

  const exportToCSV = () => {
    if (sortedResults.length === 0) return

    // Create CSV content
    let headers = ["Name", "Address", "Phone", "Website"]

    // Add score headers if we have scores
    if (includeScores) {
      headers = [
        ...headers,
        "Overall Score",
        "Badness Score",
        "SEO Score",
        "Mobile Score",
        "Security Score",
        "Performance Score",
        "Design Score",
        "Content Score",
        "Contact Score",
        "Critical Issues",
        "Outdated Technologies",
        "Last Updated",
        "All Issues",
      ]
    }

    const csvRows = [
      headers.join(","),
      ...sortedResults.map((business) => {
        const basicData = [
          `"${business.name.replace(/"/g, '""')}"`,
          `"${business.address.replace(/"/g, '""')}"`,
          `"${business.phone || ""}"`,
          `"${business.website || ""}"`,
        ]

        // Add score data if available
        if (includeScores && business.websiteScore) {
          const score = business.websiteScore
          return [
            ...basicData,
            score.overall,
            score.badnessScore || 100 - score.overall,
            score.seo,
            score.mobile,
            score.security,
            score.performance,
            score.design,
            score.content,
            score.contact,
            `"${(score.criticalIssues || []).join("; ").replace(/"/g, '""')}"`,
            `"${(score.outdatedTechnologies || []).join("; ").replace(/"/g, '""')}"`,
            `"${score.lastUpdated || "Unknown"}"`,
            `"${score.issues.join("; ").replace(/"/g, '""')}"`,
          ].join(",")
        }

        return basicData.join(",")
      }),
    ]

    const csvContent = csvRows.join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${businessType}-${location}-leads.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    if (score >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  // Helper function to get color based on badness score (inverse)
  const getBadnessColor = (score: number) => {
    if (score >= 80) return "bg-red-500"
    if (score >= 60) return "bg-orange-500"
    if (score >= 40) return "bg-yellow-500"
    return "bg-green-500"
  }

  // Helper to render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null

    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4 inline" />
    )
  }

  // Helper to check if a website has critical issues
  const hasCriticalIssues = (business: Business) => {
    return business.websiteScore?.criticalIssues && business.websiteScore.criticalIssues.length > 0
  }

  // Helper to check if a website has outdated technologies
  const hasOutdatedTech = (business: Business) => {
    return business.websiteScore?.outdatedTechnologies && business.websiteScore.outdatedTechnologies.length > 0
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="results" disabled={results.length === 0}>
            Results {results.length > 0 && `(${sortedResults.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Find Businesses with Bad Websites</CardTitle>
              <CardDescription>Search for businesses that need your website improvement services</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="business-type" className="text-sm font-medium">
                      Business Type
                    </label>
                    <div className="relative">
                      <Input
                        id="business-type"
                        placeholder="e.g. plumbers, HVAC, electricians"
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        required
                      />
                      {randomIndustry && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                          onClick={() => setBusinessType(randomIndustry)}
                        >
                          Try: {randomIndustry}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium">
                      Location
                    </label>
                    <Input
                      id="location"
                      placeholder="e.g. Chicago, New York, Austin TX"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="show-only-bad"
                        checked={showOnlyBadWebsites}
                        onCheckedChange={setShowOnlyBadWebsites}
                      />
                      <Label htmlFor="show-only-bad" className="text-sm font-medium">
                        Show only bad websites
                      </Label>
                    </div>

                    <Button type="button" variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      {showAdvanced ? "Hide" : "Show"} Advanced Options
                    </Button>
                  </div>

                  {showAdvanced && (
                    <div className="p-4 border rounded-md bg-gray-50 space-y-4">
                      <div>
                        <label className="text-sm font-medium block mb-2">Search Strategy</label>
                        <Select value={searchStrategy} onValueChange={setSearchStrategy}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a search strategy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard Search</SelectItem>
                            <SelectItem value="outdated">Target Established Businesses</SelectItem>
                            <SelectItem value="small">Target Small Local Businesses</SelectItem>
                            <SelectItem value="family">Target Family-Owned Businesses</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">
                          Different strategies help find businesses more likely to have outdated websites
                        </p>
                      </div>

                      <div>
                        <label htmlFor="badness-threshold" className="text-sm font-medium block mb-2">
                          Bad Website Threshold: {badWebsiteThreshold}
                        </label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="badness-threshold"
                            min={40}
                            max={80}
                            step={5}
                            value={[badWebsiteThreshold]}
                            onValueChange={(value) => setBadWebsiteThreshold(value[0])}
                            className="flex-1"
                          />
                          <Select
                            value={badWebsiteThreshold.toString()}
                            onValueChange={(value) => setBadWebsiteThreshold(Number.parseInt(value))}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="Threshold" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="40">40</SelectItem>
                              <SelectItem value="45">45</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                              <SelectItem value="55">55</SelectItem>
                              <SelectItem value="60">60</SelectItem>
                              <SelectItem value="65">65</SelectItem>
                              <SelectItem value="70">70</SelectItem>
                              <SelectItem value="75">75</SelectItem>
                              <SelectItem value="80">80</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Higher values show only websites with more serious issues
                        </p>
                      </div>

                      <div>
                        <label htmlFor="business-count" className="text-sm font-medium block mb-2">
                          Number of businesses to search: {businessCount}
                        </label>
                        <div className="flex items-center gap-4">
                          <Slider
                            id="business-count"
                            min={5}
                            max={50}
                            step={5}
                            value={[businessCount]}
                            onValueChange={(value) => setBusinessCount(value[0])}
                            className="flex-1"
                          />
                          <Select
                            value={businessCount.toString()}
                            onValueChange={(value) => setBusinessCount(Number.parseInt(value))}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="Count" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="15">15</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="25">25</SelectItem>
                              <SelectItem value="30">30</SelectItem>
                              <SelectItem value="40">40</SelectItem>
                              <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-scores"
                          checked={includeScores}
                          onCheckedChange={(checked) => setIncludeScores(checked === true)}
                        />
                        <label htmlFor="include-scores" className="text-sm font-medium">
                          Score websites (takes longer but provides valuable insights)
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Find Businesses with Bad Websites
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-500">{error}</div>}
        </TabsContent>

        <TabsContent value="results">
          {results.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    Results ({sortedResults.length} of {results.length})
                  </CardTitle>
                  <CardDescription>
                    {showOnlyBadWebsites
                      ? `Showing businesses with badness score ≥ ${badWebsiteThreshold}`
                      : "Showing all businesses"}
                  </CardDescription>
                </div>
                <Button onClick={exportToCSV} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th
                          className="py-2 px-4 text-left font-medium cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort("name")}
                        >
                          Business Name {renderSortIndicator("name")}
                        </th>
                        <th className="py-2 px-4 text-left font-medium">Contact</th>
                        <th className="py-2 px-4 text-left font-medium">Website</th>
                        {includeScores && (
                          <>
                            <th
                              className="py-2 px-4 text-left font-medium cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSort("badnessScore")}
                            >
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span>Badness Score {renderSortIndicator("badnessScore")}</span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Higher score = worse website (better lead)</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </th>
                            <th
                              className="py-2 px-4 text-left font-medium cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSort("seo")}
                            >
                              SEO {renderSortIndicator("seo")}
                            </th>
                            <th
                              className="py-2 px-4 text-left font-medium cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSort("mobile")}
                            >
                              Mobile {renderSortIndicator("mobile")}
                            </th>
                            <th
                              className="py-2 px-4 text-left font-medium cursor-pointer hover:bg-gray-50"
                              onClick={() => handleSort("security")}
                            >
                              Security {renderSortIndicator("security")}
                            </th>
                            <th className="py-2 px-4 text-left font-medium">Issues</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedResults.map((business) => (
                        <tr key={business.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-4">
                            <div className="font-medium">{business.name}</div>
                            <div className="text-sm text-gray-500">{business.address}</div>
                          </td>
                          <td className="py-2 px-4">
                            {business.phone ? (
                              <a href={`tel:${business.phone}`} className="text-blue-500 hover:underline">
                                {business.phone}
                              </a>
                            ) : (
                              <span className="text-gray-400">No phone</span>
                            )}
                          </td>
                          <td className="py-2 px-4">
                            {business.website ? (
                              <a
                                href={business.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-500 hover:underline"
                              >
                                Website
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            ) : (
                              <Badge variant="outline">No website</Badge>
                            )}
                          </td>
                          {includeScores && (
                            <>
                              <td className="py-2 px-4">
                                {business.websiteScore ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">
                                      {business.websiteScore.badnessScore || 100 - business.websiteScore.overall}
                                    </span>
                                    <Progress
                                      value={business.websiteScore.badnessScore || 100 - business.websiteScore.overall}
                                      className={`h-2 w-16 ${getBadnessColor(
                                        business.websiteScore.badnessScore || 100 - business.websiteScore.overall,
                                      )}`}
                                    />
                                    <WebsiteScoreDetails score={business.websiteScore} businessName={business.name} />
                                  </div>
                                ) : (
                                  <Badge variant="outline">Not scored</Badge>
                                )}
                              </td>
                              <td className="py-2 px-4">
                                {business.websiteScore ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">{business.websiteScore.seo}</span>
                                    <Progress
                                      value={business.websiteScore.seo}
                                      className={`h-2 w-16 ${getScoreColor(business.websiteScore.seo)}`}
                                    />
                                  </div>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td className="py-2 px-4">
                                {business.websiteScore ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">{business.websiteScore.mobile}</span>
                                    <Progress
                                      value={business.websiteScore.mobile}
                                      className={`h-2 w-16 ${getScoreColor(business.websiteScore.mobile)}`}
                                    />
                                  </div>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td className="py-2 px-4">
                                {business.websiteScore ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">{business.websiteScore.security}</span>
                                    <Progress
                                      value={business.websiteScore.security}
                                      className={`h-2 w-16 ${getScoreColor(business.websiteScore.security)}`}
                                    />
                                  </div>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                              <td className="py-2 px-4">
                                {business.websiteScore ? (
                                  <div className="flex flex-wrap gap-1">
                                    {hasCriticalIssues(business) && (
                                      <Badge variant="destructive" className="flex items-center">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        {business.websiteScore.criticalIssues?.length} critical
                                      </Badge>
                                    )}
                                    {hasOutdatedTech(business) && (
                                      <Badge variant="outline" className="bg-amber-100">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        Outdated tech
                                      </Badge>
                                    )}
                                    {business.websiteScore.lastUpdated &&
                                      business.websiteScore.lastUpdated !== new Date().getFullYear().toString() && (
                                        <Badge variant="outline" className="bg-blue-100">
                                          Last updated: {business.websiteScore.lastUpdated}
                                        </Badge>
                                      )}
                                  </div>
                                ) : (
                                  "N/A"
                                )}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
