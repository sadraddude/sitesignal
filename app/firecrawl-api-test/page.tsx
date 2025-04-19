"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function FirecrawlApiTestPage() {
  const [url, setUrl] = useState("https://batistafoodgrillut.com")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testFirecrawlApi = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/firecrawl-test?url=${encodeURIComponent(url)}`)
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
      <h1 className="text-2xl font-bold mb-6">Firecrawl API Test</h1>
      <p className="mb-4">This test will try different methods of the Firecrawl API to see which ones work.</p>

      <div className="space-y-4">
        <div>
          <Label htmlFor="url">URL to test</Label>
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to test"
            className="mt-1"
          />
        </div>

        <Button onClick={testFirecrawlApi} disabled={isLoading}>
          {isLoading ? "Testing..." : "Test Firecrawl API"}
        </Button>
      </div>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{result.success ? "Success" : "Failed"}</CardTitle>
          </CardHeader>
          <CardContent>
            {result.success ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">crawlUrl Method</h3>
                  {result.results.crawlUrl.success ? (
                    <div className="space-y-2">
                      <p>
                        <strong>Data Type:</strong> {result.results.crawlUrl.dataType}
                      </p>
                      <p>
                        <strong>Is Array:</strong> {result.results.crawlUrl.dataIsArray ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Length:</strong> {result.results.crawlUrl.dataLength}
                      </p>
                    </div>
                  ) : (
                    <p className="text-red-500">{result.results.crawlUrl.error}</p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">search Method</h3>
                  {result.results.search.success ? (
                    <div className="space-y-2">
                      <p>
                        <strong>Data Type:</strong> {result.results.search.dataType}
                      </p>
                      <p>
                        <strong>Is Array:</strong> {result.results.search.dataIsArray ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Length:</strong> {result.results.search.dataLength}
                      </p>
                      {result.results.search.sample && (
                        <div>
                          <strong>Sample:</strong>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40 mt-2">
                            {result.results.search.sample}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-red-500">{result.results.search.error}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-red-500">{result.error}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
