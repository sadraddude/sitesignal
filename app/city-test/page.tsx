"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CityTestPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiResponse, setApiResponse] = useState<any>(null)

  const searchCities = async () => {
    if (!query || query.length < 2) {
      setResults([])
      setError("Please enter at least 2 characters")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/city-suggestions?query=${encodeURIComponent(query)}`)
      const data = await response.json()

      // Store the full API response for debugging
      setApiResponse(data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch city suggestions")
      }

      setResults(data.suggestions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.length >= 2) {
        searchCities()
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query])

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>City Suggestions API Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input placeholder="Type a city name..." value={query} onChange={(e) => setQuery(e.target.value)} />
              <Button onClick={searchCities} disabled={loading}>
                {loading ? "Loading..." : "Search"}
              </Button>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-md">{error}</div>}

            <div>
              <h3 className="font-medium mb-2">Results:</h3>
              {results.length > 0 ? (
                <ul className="space-y-1">
                  {results.map((city, index) => (
                    <li key={index} className="p-2 bg-gray-50 rounded">
                      {city}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No results found</p>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">Raw API Response:</h3>
              <pre className="p-4 bg-gray-100 rounded-md overflow-auto text-xs">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
