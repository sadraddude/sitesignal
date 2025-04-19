"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, Star, MapPin, Phone, Globe } from "lucide-react"
import Image from "next/image"
import type { Business } from "@/lib/types"

export default function PlacesTestPage() {
  const [query, setQuery] = useState("restaurants in salt lake city")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const searchPlaces = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/places-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Google Places Search Test</h1>
      <p className="mb-4">Enter a search query to find businesses using Google Places API.</p>

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Google Places API</AlertTitle>
        <AlertDescription>
          This test uses the Google Places API to search for businesses. It provides more structured data including
          addresses, phone numbers, ratings, and other details.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="query">Search Query</Label>
          <Input
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., restaurants in salt lake city"
            className="mt-1"
          />
        </div>

        <Button onClick={searchPlaces} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search Places"}
        </Button>
      </div>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">
            {result.success ? `Found ${result.businesses.length} businesses` : "Search Failed"}
          </h2>

          {!result.success && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{result.error}</AlertDescription>
            </Alert>
          )}

          {result.success && result.businesses.length === 0 && (
            <Alert>
              <AlertTitle>No Results</AlertTitle>
              <AlertDescription>No businesses found for your search query.</AlertDescription>
            </Alert>
          )}

          {result.success && result.businesses.length > 0 && (
            <div className="space-y-6">
              {result.businesses.map((business: Business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function BusinessCard({ business }: { business: Business }) {
  const [activeTab, setActiveTab] = useState("info")

  // Function to get a Google Places photo URL
  const getPhotoUrl = (photoReference: string, maxWidth = 400) => {
    return `/api/places-photo?reference=${photoReference}&maxwidth=${maxWidth}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>{business.name}</span>
          {business.googleData?.rating && (
            <span className="flex items-center text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              <Star className="h-4 w-4 mr-1 fill-yellow-500 text-yellow-500" />
              {business.googleData.rating} ({business.googleData.userRatingsTotal} reviews)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="info" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Business Info</TabsTrigger>
            <TabsTrigger value="website">Website Analysis</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="space-y-2 mt-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                <span>{business.address}</span>
              </div>

              {business.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 flex-shrink-0 text-gray-500" />
                  <span>{business.phone}</span>
                </div>
              )}

              {business.website && (
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 flex-shrink-0 text-gray-500" />
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {business.website}
                  </a>
                </div>
              )}

              {business.googleData?.placeUrl && (
                <div className="mt-4">
                  <a
                    href={business.googleData.placeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="website" className="space-y-4">
            {business.website ? (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Website Quality Score</h3>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      business.score >= 70 ? "bg-green-500" : business.score >= 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                  >
                    {business.score}/100
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Issues</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {business.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <Globe className="h-4 w-4" />
                      Visit Website
                    </a>
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No website available for this business</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="photos">
            {business.googleData?.photos && business.googleData.photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {business.googleData.photos.slice(0, 4).map((photo, index) => (
                  <div key={index} className="relative h-40 rounded overflow-hidden">
                    <Image
                      src={getPhotoUrl(photo.reference) || "/placeholder.svg"}
                      alt={`${business.name} photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No photos available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
