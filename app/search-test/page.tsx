"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function SearchTestPage() {
  const [domain, setDomain] = useState("batistafoodgrillut.com")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testSearch = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Extract just the domain if a full URL was entered
      let cleanDomain = domain
      if (cleanDomain.startsWith("http")) {
        try {
          cleanDomain = new URL(cleanDomain).hostname
        } catch (e) {
          // If URL parsing fails, just use the input as is
        }
      }

      // Remove www. if present
      cleanDomain = cleanDomain.replace(/^www\./, "")

      const response = await fetch("/api/search-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: cleanDomain }),
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
      <h1 className="text-2xl font-bold mb-6">Business Search Test</h1>
      <p className="mb-4">Enter a domain name to search for business information using Firecrawl.</p>

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Limitations of Firecrawl Search</AlertTitle>
        <AlertDescription>
          Firecrawl&apos;s search method only returns basic information like business name, URL, and description -
          similar to search engine results. It doesn&apos;t deeply scrape websites to extract detailed information like
          addresses and phone numbers. For that, we would need additional tools like Puppeteer or specialized business
          data APIs.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="domain">Domain to search</Label>
          <Input
            id="domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain (e.g., example.com)"
            className="mt-1"
          />
        </div>

        <Button onClick={testSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search Business"}
        </Button>
      </div>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{result.success ? "Success" : "Failed"}</CardTitle>
          </CardHeader>
          <CardContent>
            {result.success ? (
              <Tabs defaultValue="processed">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="processed">Processed Data</TabsTrigger>
                  <TabsTrigger value="raw">Raw Data</TabsTrigger>
                </TabsList>

                <TabsContent value="processed" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Business Information</h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Name:</strong> {result.business.name}
                      </p>
                      <p>
                        <strong>URL:</strong> {result.business.website}
                      </p>
                      <p>
                        <strong>Address:</strong> {result.business.address}{" "}
                        <span className="text-xs text-muted-foreground">(Not typically available from search)</span>
                      </p>
                      <p>
                        <strong>Phone:</strong> {result.business.phone || "Not found"}{" "}
                        <span className="text-xs text-muted-foreground">(Not typically available from search)</span>
                      </p>
                      <p>
                        <strong>Score:</strong> {result.business.score}/100{" "}
                        <span className="text-xs text-muted-foreground">(Based on limited data)</span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Issues</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      These issues are based on limited data from the search results, not a full website analysis.
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      {result.business.details.map((detail: string, index: number) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="raw">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Raw Firecrawl Data</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      This is the actual data returned by Firecrawl&apos;s search method.
                    </p>
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-96">
                      {JSON.stringify(result.rawData, null, 2)}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <p className="text-red-500">{result.error}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
