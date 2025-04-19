"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

// This form submits to the /results page which now uses Google Places API for business data
export function ScrapeForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [industry, setIndustry] = useState("local-business")
  const [resultsCount, setResultsCount] = useState(10)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Construct the search query
    const query = new URLSearchParams({
      term: searchTerm,
      location: location,
      industry: industry,
      count: resultsCount.toString(),
    })

    router.push(`/results?${query.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="search-term">Search Term</Label>
          <Input
            id="search-term"
            placeholder="e.g. restaurants, plumbers, dentists"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g. New York, Chicago, 90210"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
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
  )
}
