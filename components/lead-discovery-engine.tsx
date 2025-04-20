"use client"

import type React from "react"

import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
  Search,
  Download,
  Loader2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
  AlertTriangle,
  Info,
  BarChart2,
  ArrowUpDown,
  FileText,
  MapPin,
  Phone,
  Globe,
  Eye,
  Save,
  Share2,
  Briefcase,
  ChevronsUpDown,
  Check,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProfessionalHeader } from "@/components/professional-header"
import { SearchHistory } from "@/components/search-history"
import { SearchHistoryItem } from "@/lib/search-history"
import { getCachedResults } from "@/lib/get-cached-results-action"
import { toast } from "sonner"

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
  improvementScore?: number // Renamed from badnessScore
}

type Business = {
  id: string
  name: string
  address: string
  phone?: string
  website?: string
  websiteScore?: WebsiteScore | null
  category?: string
  reviewCount?: number
  rating?: number
  photoUrl?: string
}

type SortField = "name" | "overall" | "seo" | "mobile" | "security" | "improvementScore" | null
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

export function LeadDiscoveryEngine() {
  const [businessType, setBusinessType] = useState("")
  const [industry, setIndustry] = useState("")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Business[]>([])
  const [error, setError] = useState<string | null>(null)
  const [includeScores, setIncludeScores] = useState(true)
  const [businessCount, setBusinessCount] = useState(20)
  const [searchRadiusKm, setSearchRadiusKm] = useState(10)
  const [sortField, setSortField] = useState<SortField>("improvementScore")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeTab, setActiveTab] = useState("search")
  const [showOnlyImprovableWebsites, setShowOnlyImprovableWebsites] = useState(true)
  const [improvementThreshold, setImprovementThreshold] = useState(60)
  const [searchStrategy, setSearchStrategy] = useState("standard")
  const [randomIndustry, setRandomIndustry] = useState("")
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")

  // City dropdown state
  const [locationInput, setLocationInput] = useState("")
  const [citySuggestions, setCitySuggestions] = useState<string[]>([])
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [showCityDropdown, setShowCityDropdown] = useState(false)

  // Ref for the dropdown
  const cityDropdownRef = useRef<HTMLDivElement>(null)
  const locationInputRef = useRef<HTMLInputElement>(null)

  // Get a random industry suggestion
  const getRandomIndustry = () => {
    const randomIndex = Math.floor(Math.random() * INDUSTRY_SUGGESTIONS.length)
    setRandomIndustry(INDUSTRY_SUGGESTIONS[randomIndex])
  }

  // Initialize with a random industry
  useEffect(() => {
    getRandomIndustry()
  }, [])

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowCityDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [cityDropdownRef, locationInputRef])

  // Fetch city suggestions when the user types in the location field
  useEffect(() => {
    const fetchCitySuggestions = async () => {
      if (locationInput.length < 2) {
        setCitySuggestions([])
        return
      }

      setIsLoadingCities(true)
      try {
        const response = await fetch(`/api/city-suggestions?query=${encodeURIComponent(locationInput)}`)
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        const data = await response.json()
        setCitySuggestions(data.suggestions || [])
      } catch (error) {
        console.error("Failed to fetch city suggestions:", error)
        setCitySuggestions([])
      } finally {
        setIsLoadingCities(false)
      }
    }

    const debounceTimer = setTimeout(fetchCitySuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [locationInput])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!businessType || !location) {
      setError("Please enter both business type and location")
      return
    }

    setIsLoading(true)
    setError(null)
    setResults([])

    try {
      // Modify the search query based on the selected strategy
      let searchQuery = `${businessType} in ${location}`

      if (searchStrategy === "established") {
        searchQuery = `established ${businessType} in ${location}`
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
          radius: searchRadiusKm * 1000,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to search for businesses")
      }

      // Assume the API now returns the correct format directly
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
    if (!showOnlyImprovableWebsites) return results

    return results.filter((business) => {
      // If no website or no score, include it (might be a good lead)
      if (!business.website || !business.websiteScore) return true

      // If using improvement score
      if (business.websiteScore.improvementScore !== undefined) {
        return business.websiteScore.improvementScore >= improvementThreshold
      }

      // Fallback to overall score
      return business.websiteScore.overall <= 100 - improvementThreshold
    })
  }, [results, showOnlyImprovableWebsites, improvementThreshold])

  const sortedResults = useMemo(() => {
    if (!sortField) return filteredResults

    return [...filteredResults].sort((a, b) => {
      if (sortField === "name") {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()
        return sortDirection === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
      }

      // Special handling for improvementScore
      if (sortField === "improvementScore") {
        const scoreA = a.websiteScore?.improvementScore ?? 50
        const scoreB = b.websiteScore?.improvementScore ?? 50

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
    let headers = ["Name", "Address", "Phone", "Website", "Category"]

    // Add score headers if we have scores
    if (includeScores) {
      headers = [
        ...headers,
        "Overall Score",
        "Improvement Opportunity",
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
          `"${business.category || ""}"`,
        ]

        // Add score data if available
        if (includeScores && business.websiteScore) {
          const score = business.websiteScore
          return [
            ...basicData,
            score.overall,
            score.improvementScore || 100 - score.overall,
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
    if (score >= 80) return "bg-success-500"
    if (score >= 60) return "bg-success-400"
    if (score >= 40) return "bg-warning-500"
    return "bg-danger-500"
  }

  // Helper function to get color based on improvement score (inverse)
  const getImprovementColor = (score: number) => {
    if (score >= 70) return "bg-danger-500"
    if (score >= 50) return "bg-warning-500"
    if (score >= 40) return "bg-warning-400"
    return "bg-success-500"
  }

  // Helper to render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />

    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  // Helper to check if a website has critical issues
  const hasCriticalIssues = (business: Business) => {
    return business.websiteScore?.criticalIssues && business.websiteScore.criticalIssues.length > 0
  }

  // Helper to check if a website has outdated technologies
  const hasOutdatedTech = (business: Business) => {
    return business.websiteScore?.outdatedTechnologies && business.websiteScore.outdatedTechnologies.length > 0
  }

  // Toggle selection of a business
  const toggleBusinessSelection = (id: string) => {
    setSelectedBusinesses((prev) =>
      prev.includes(id) ? prev.filter((businessId) => businessId !== id) : [...prev, id],
    )
  }

  // Check if all businesses are selected
  const allSelected = selectedBusinesses.length === sortedResults.length && sortedResults.length > 0

  // Toggle selection of all businesses
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedBusinesses([])
    } else {
      setSelectedBusinesses(sortedResults.map((business) => business.id))
    }
  }

  // Update function to handle selecting a search from history
  const handleSelectFromHistory = async (params: Omit<SearchHistoryItem, 'timestamp'>) => {
    console.log("Loading from history:", params);
    // 1. Update UI fields
    setBusinessType(params.term);
    setIndustry(params.industry); // Set industry state if you have a separate field
    setLocationInput(params.location);
    setLocation(params.location);
    setBusinessCount(params.count);
    // Optionally set other params like includeScores if stored/relevant

    // 2. Construct the cache key (must match format used in API route)
    // IMPORTANT: Ensure includeScores state reflects the cached search
    // For simplicity, we'll assume includeScores was true for cached searches, adjust if needed
    const currentIncludeScores = true; // Or fetch this setting if it was stored
    const cacheKey = `search:${params.term}:${params.location}:${params.industry}:${params.count}`;
    // Cache key used in API was: `search:${term}:${location}:${industry}:${constrainedLimit}`
    // We use params.count here which should align with constrainedLimit if saved correctly.

    // 3. Attempt to fetch results from cache via server action
    setIsLoading(true); // Show loading indicator
    setError(null);
    setResults([]); // Clear previous results

    try {
      const cachedResults = await getCachedResults(cacheKey);

      if (cachedResults) {
        console.log("Found cached results:", cachedResults);
        setResults(cachedResults);
        setActiveTab("results"); // Switch to results tab
        toast.info("Loaded results from search history cache.");
      } else {
        console.log("Cache miss for history item.");
        setError("Cached results not found. Expired or not available. Please run a new search.");
        // Optional: Automatically trigger handleSearch(e) here if desired
      }
    } catch (err) {
      console.error("Error fetching cached results:", err);
      setError(err instanceof Error ? err.message : "Failed to load cached results");
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  // Function to handle city selection
  const handleCitySelection = (city: string) => {
    setLocationInput(city)
    setLocation(city)
    setShowCityDropdown(false)
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ProfessionalHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Lead Discovery Engine</h1>
          <p className="text-gray-600">Find businesses with websites that need professional improvement</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="search" className="text-sm">
              Search Parameters
            </TabsTrigger>
            <TabsTrigger value="results" disabled={results.length === 0} className="text-sm">
              Results {results.length > 0 && `(${sortedResults.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>Business Discovery</CardTitle>
                <CardDescription>Search for businesses that need website improvement services</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="business-type">Business Type</Label>
                      <div className="relative">
                        <Input
                          id="business-type"
                          placeholder="e.g. plumbers, HVAC, electricians"
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          required
                          className="pr-24"
                        />
                        {randomIndustry && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary-600"
                            onClick={() => setBusinessType(randomIndustry)}
                          >
                            Try: {randomIndustry}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <div className="relative flex-1">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="location"
                            ref={locationInputRef}
                            placeholder="e.g. Chicago, New York, Austin TX"
                            value={locationInput}
                            onChange={(e) => {
                              setLocationInput(e.target.value)
                              // Show dropdown when typing
                              if (e.target.value.length >= 2) {
                                setShowCityDropdown(true)
                              } else {
                                setShowCityDropdown(false)
                              }
                            }}
                            onClick={() => {
                              // Show dropdown when clicking if there's text
                              if (locationInput.length >= 2) {
                                setShowCityDropdown(true)
                              }
                            }}
                            required
                            className="pl-10 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowCityDropdown(!showCityDropdown)}
                          >
                            <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>

                        {/* City dropdown */}
                        {showCityDropdown && (
                          <div
                            ref={cityDropdownRef}
                            className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto"
                          >
                            {isLoadingCities ? (
                              <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500">Loading cities...</span>
                              </div>
                            ) : citySuggestions.length > 0 ? (
                              <ul className="py-1">
                                {citySuggestions.map((city) => (
                                  <li key={city}>
                                    <button
                                      type="button"
                                      className={`flex w-full items-center px-3 py-2 text-sm hover:bg-gray-100 ${
                                        location === city ? "bg-gray-50" : ""
                                      }`}
                                      onClick={() => handleCitySelection(city)}
                                    >
                                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                      <span>{city}</span>
                                      {location === city && <Check className="ml-auto h-4 w-4 text-primary-600" />}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="p-4 text-center text-sm text-gray-500">
                                {locationInput.length < 2 ? "Type at least 2 characters to search" : "No cities found"}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="show-only-improvable"
                          checked={showOnlyImprovableWebsites}
                          onCheckedChange={setShowOnlyImprovableWebsites}
                        />
                        <Label htmlFor="show-only-improvable" className="text-sm font-medium">
                          Show only websites needing improvement
                        </Label>
                      </div>

                      <Button type="button" variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        {showAdvanced ? "Hide" : "Show"} Advanced Options
                      </Button>
                    </div>

                    {showAdvanced && (
                      <div className="p-4 border rounded-md bg-white space-y-6">
                        <div>
                          <Label className="text-sm font-medium block mb-2">Search Strategy</Label>
                          <Select value={searchStrategy} onValueChange={setSearchStrategy}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a search strategy" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard Search</SelectItem>
                              <SelectItem value="established">Target Established Businesses</SelectItem>
                              <SelectItem value="small">Target Small Local Businesses</SelectItem>
                              <SelectItem value="family">Target Family-Owned Businesses</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1">
                            Different strategies help find businesses more likely to have outdated websites
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="improvement-threshold" className="text-sm font-medium">
                              Improvement Opportunity Threshold
                            </Label>
                            <Badge variant="outline">{improvementThreshold}</Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <Slider
                              id="improvement-threshold"
                              min={40}
                              max={80}
                              step={5}
                              value={[improvementThreshold]}
                              onValueChange={(value) => setImprovementThreshold(value[0])}
                              className="flex-1"
                            />
                            <Select
                              value={improvementThreshold.toString()}
                              onValueChange={(value) => setImprovementThreshold(Number.parseInt(value))}
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
                            Higher values show only websites with more significant improvement opportunities
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="business-count">Number of Businesses to Find</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              id="business-count"
                              min={5}
                              max={200}
                              step={5}
                              value={[businessCount]}
                              onValueChange={(value) => setBusinessCount(value[0])}
                              disabled={isLoading}
                            />
                            <Badge variant="outline">{businessCount}</Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="search-radius">Search Radius (km)</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              id="search-radius"
                              min={1}
                              max={50}
                              step={1}
                              value={[searchRadiusKm]}
                              onValueChange={(value) => setSearchRadiusKm(value[0])}
                              disabled={isLoading}
                            />
                            <Badge variant="outline">{searchRadiusKm} km</Badge>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="include-scores"
                            checked={includeScores}
                            onCheckedChange={(checked) => setIncludeScores(checked === true)}
                          />
                          <Label htmlFor="include-scores" className="text-sm">
                            Analyze websites (provides detailed improvement opportunities)
                          </Label>
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
                        Discover Improvement Opportunities
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-500 border border-red-200">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Pass the updated handler to SearchHistory */}
            <div className="mt-4">
              <SearchHistory onSelectSearch={handleSelectFromHistory} />
            </div>
          </TabsContent>

          <TabsContent value="results">
            {results.length > 0 && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Discovery Results</CardTitle>
                      <CardDescription>
                        {showOnlyImprovableWebsites
                          ? `Showing businesses with improvement score ≥ ${improvementThreshold}`
                          : "Showing all businesses"}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
                            >
                              {viewMode === "table" ? (
                                <BarChart2 className="h-4 w-4" />
                              ) : (
                                <FileText className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Toggle view mode</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button onClick={exportToCSV} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {viewMode === "table" ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[30px]">
                                <Checkbox
                                  checked={allSelected}
                                  onCheckedChange={toggleSelectAll}
                                  aria-label="Select all"
                                />
                              </TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                                <div className="flex items-center">
                                  Business Name
                                  {renderSortIndicator("name")}
                                </div>
                              </TableHead>
                              <TableHead>Contact</TableHead>
                              <TableHead>Website</TableHead>
                              {includeScores && (
                                <>
                                  <TableHead className="cursor-pointer" onClick={() => handleSort("improvementScore")}>
                                    <div className="flex items-center">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <span>Improvement Score {renderSortIndicator("improvementScore")}</span>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Higher score = more improvement opportunity</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </TableHead>
                                  <TableHead className="cursor-pointer" onClick={() => handleSort("seo")}>
                                    <div className="flex items-center">SEO {renderSortIndicator("seo")}</div>
                                  </TableHead>
                                  <TableHead className="cursor-pointer" onClick={() => handleSort("mobile")}>
                                    <div className="flex items-center">Mobile {renderSortIndicator("mobile")}</div>
                                  </TableHead>
                                  <TableHead className="cursor-pointer" onClick={() => handleSort("security")}>
                                    <div className="flex items-center">Security {renderSortIndicator("security")}</div>
                                  </TableHead>
                                  <TableHead>Issues</TableHead>
                                </>
                              )}
                              <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sortedResults.map((business) => (
                              <TableRow key={business.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={selectedBusinesses.includes(business.id)}
                                    onCheckedChange={() => toggleBusinessSelection(business.id)}
                                    aria-label={`Select ${business.name}`}
                                  />
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{business.name}</div>
                                  <div className="text-sm text-gray-500">{business.address}</div>
                                </TableCell>
                                <TableCell>
                                  {business.phone ? (
                                    <a
                                      href={`tel:${business.phone}`}
                                      className="text-primary-600 hover:underline flex items-center"
                                    >
                                      <Phone className="h-3 w-3 mr-1" />
                                      {business.phone}
                                    </a>
                                  ) : (
                                    <span className="text-gray-400">No phone</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {business.website ? (
                                    <a
                                      href={business.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center text-primary-600 hover:underline"
                                    >
                                      <Globe className="h-3 w-3 mr-1" />
                                      Website
                                      <ExternalLink className="ml-1 h-3 w-3" />
                                    </a>
                                  ) : (
                                    <Badge variant="outline">No website</Badge>
                                  )}
                                </TableCell>
                                {includeScores && (
                                  <>
                                    <TableCell>
                                      {business.websiteScore ? (
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium">
                                            {business.websiteScore.improvementScore ||
                                              100 - business.websiteScore.overall}
                                          </span>
                                          <Progress
                                            value={
                                              business.websiteScore.improvementScore ||
                                              100 - business.websiteScore.overall
                                            }
                                            className={`h-2 w-16 ${getImprovementColor(
                                              business.websiteScore.improvementScore ||
                                                100 - business.websiteScore.overall,
                                            )}`}
                                          />
                                        </div>
                                      ) : (
                                        "N/A"
                                      )}
                                    </TableCell>
                                    <TableCell>
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
                                    </TableCell>
                                    <TableCell>
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
                                    </TableCell>
                                    <TableCell>
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
                                    </TableCell>
                                    <TableCell>
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
                                              <Info className="h-3 w-3 mr-1" />
                                              Outdated tech
                                            </Badge>
                                          )}
                                        </div>
                                      ) : (
                                        "N/A"
                                      )}
                                    </TableCell>
                                  </>
                                )}
                                <TableCell>
                                  <div className="flex space-x-1">
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Eye className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>View details</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Save className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Save lead</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    {business.websiteScore && (
                                      <WebsiteScoreDetails score={business.websiteScore} businessName={business.name} />
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedResults.map((business) => (
                          <Card key={business.id} className="overflow-hidden">
                            <CardHeader className="p-4">
                              <div className="flex justify-between">
                                <CardTitle className="text-lg">{business.name}</CardTitle>
                                <Checkbox
                                  checked={selectedBusinesses.includes(business.id)}
                                  onCheckedChange={() => toggleBusinessSelection(business.id)}
                                  aria-label={`Select ${business.name}`}
                                />
                              </div>
                              <CardDescription>{business.address}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              {business.websiteScore && (
                                <div className="mb-4 space-y-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">Overall Score</span>
                                    <Badge className={getScoreColor(business.websiteScore.overall)}>
                                      {business.websiteScore.overall}
                                    </Badge>
                                  </div>
                                  <Progress
                                    value={business.websiteScore.overall}
                                    className="h-2"
                                    indicatorClassName={getScoreColor(business.websiteScore.overall)}
                                  />
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">Improvement</span>
                                    <Badge
                                      className={getImprovementColor(business.websiteScore.improvementScore)}
                                    >
                                      {business.websiteScore.improvementScore}
                                    </Badge>
                                  </div>
                                  <Progress
                                    value={business.websiteScore.improvementScore || 100 - business.websiteScore.overall}
                                    className={`h-2 ${getImprovementColor(business.websiteScore.improvementScore)}`}
                                  />
                                </div>
                              )}

                              <div className="flex flex-col space-y-2">
                                {business.phone && (
                                  <a
                                    href={`tel:${business.phone}`}
                                    className="text-primary-600 hover:underline flex items-center text-sm"
                                  >
                                    <Phone className="h-3 w-3 mr-2" />
                                    {business.phone}
                                  </a>
                                )}
                                {business.website && (
                                  <a
                                    href={business.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-primary-600 hover:underline text-sm"
                                  >
                                    <Globe className="h-3 w-3 mr-2" />
                                    Visit Website
                                    <ExternalLink className="ml-1 h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between">
                              <Button variant="outline" size="sm">
                                <Save className="mr-2 h-4 w-4" />
                                Save Lead
                              </Button>
                              {business.websiteScore && (
                                <WebsiteScoreDetails score={business.websiteScore} businessName={business.name} />
                              )}
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-gray-500">
                      {selectedBusinesses.length} of {sortedResults.length} selected
                    </div>
                    <div className="flex space-x-2">
                      {selectedBusinesses.length > 0 && (
                        <>
                          <Button variant="outline" size="sm">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share Selected
                          </Button>
                          <Button size="sm">
                            <Briefcase className="mr-2 h-4 w-4" />
                            Add to Campaign
                          </Button>
                        </>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
