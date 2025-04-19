"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Search, MapPin, Filter, Star, Building, Clock } from "lucide-react"

export default function SearchPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [industry, setIndustry] = useState("local-business")
  const [resultsCount, setResultsCount] = useState(20)
  const [filters, setFilters] = useState({
    maxScore: 50,
    hasWebsite: true,
    excludeSaved: false,
    minRating: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Construct the search query
    const query = new URLSearchParams({
      term: searchTerm,
      location: location,
      industry: industry,
      count: resultsCount.toString(),
      maxScore: filters.maxScore.toString(),
      hasWebsite: filters.hasWebsite.toString(),
      excludeSaved: filters.excludeSaved.toString(),
      minRating: filters.minRating.toString(),
    })

    // Simulate loading
    setTimeout(() => {
      router.push(`/dashboard/results?${query.toString()}`)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Find Businesses</h1>
        <p className="text-muted-foreground">
          Search for businesses with outdated websites that could use your services.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Parameters</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter keywords to find businesses in specific industries or locations
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="search-term">Business Type or Keywords</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search-term"
                    placeholder="e.g. restaurants, plumbers, dentists"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="e.g. New York, Chicago, 90210"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local-business">Local Business</SelectItem>
                  <SelectItem value="restaurants">Restaurants</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="professional-services">Professional Services</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <h3 className="text-sm font-medium">Advanced Filters</h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="max-score">Maximum Website Score</Label>
                    <span className="text-sm text-muted-foreground">{filters.maxScore}/100</span>
                  </div>
                  <Slider
                    id="max-score"
                    min={0}
                    max={100}
                    step={5}
                    value={[filters.maxScore]}
                    onValueChange={(value) => setFilters({ ...filters, maxScore: value[0] })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Only show businesses with website scores below this value
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="min-rating">Minimum Google Rating</Label>
                    <span className="text-sm text-muted-foreground flex items-center">
                      {filters.minRating} <Star className="h-3 w-3 ml-1 fill-yellow-500 text-yellow-500" />
                    </span>
                  </div>
                  <Slider
                    id="min-rating"
                    min={0}
                    max={5}
                    step={0.5}
                    value={[filters.minRating]}
                    onValueChange={(value) => setFilters({ ...filters, minRating: value[0] })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Only show businesses with Google ratings above this value
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has-website"
                    checked={filters.hasWebsite}
                    onCheckedChange={(checked) => setFilters({ ...filters, hasWebsite: checked })}
                  />
                  <Label htmlFor="has-website">Only businesses with websites</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="exclude-saved"
                    checked={filters.excludeSaved}
                    onCheckedChange={(checked) => setFilters({ ...filters, excludeSaved: checked })}
                  />
                  <Label htmlFor="exclude-saved">Exclude already saved businesses</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="results-count">Number of Results</Label>
                <span className="text-sm text-muted-foreground">{resultsCount}</span>
              </div>
              <Slider
                id="results-count"
                min={5}
                max={50}
                step={5}
                value={[resultsCount]}
                onValueChange={(value) => setResultsCount(value[0])}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Searching...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Find Businesses
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Recent Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <RecentSearchItem query="Restaurants in Chicago" date="2 days ago" results={42} />
              <RecentSearchItem query="Dentists in Boston" date="5 days ago" results={28} />
              <RecentSearchItem query="Plumbers in Austin" date="1 week ago" results={15} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-500" />
              Popular Industries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <IndustryItem name="Restaurants" avgScore={38} count={142} />
              <IndustryItem name="Healthcare" avgScore={45} count={98} />
              <IndustryItem name="Home Services" avgScore={32} count={76} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function RecentSearchItem({ query, date, results }: { query: string; date: string; results: number }) {
  return (
    <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
      <div>
        <p className="font-medium">{query}</p>
        <p className="text-sm text-muted-foreground">
          {date} • {results} results
        </p>
      </div>
      <Button variant="ghost" size="sm">
        Run Again
      </Button>
    </div>
  )
}

function IndustryItem({ name, avgScore, count }: { name: string; avgScore: number; count: number }) {
  return (
    <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">
          Avg. Score: {avgScore}/100 • {count} businesses
        </p>
      </div>
      <Button variant="ghost" size="sm">
        Search
      </Button>
    </div>
  )
}
