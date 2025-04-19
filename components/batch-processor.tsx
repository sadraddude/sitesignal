"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Wand2, Upload, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { regenerateMultipleWebsites } from "@/lib/v0-action"
import type { Business, RegenerationResult } from "@/lib/types"

export function BatchProcessor() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<RegenerationResult[]>([])
  const [websites, setWebsites] = useState<string>("")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const urls = websites
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0)

    if (urls.length === 0) {
      setError("Please enter at least one website URL")
      return
    }

    await processWebsites(urls)
  }

  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!csvFile) {
      setError("Please upload a CSV file")
      return
    }

    try {
      const text = await csvFile.text()
      const urls = parseCSV(text)

      if (urls.length === 0) {
        setError("No valid URLs found in the CSV file")
        return
      }

      await processWebsites(urls)
    } catch (error) {
      setError("Failed to parse CSV file")
      console.error(error)
    }
  }

  // Update the processWebsites function to use Batista Food & Grill data
  const processWebsites = async (urls: string[]) => {
    setIsProcessing(true)
    setResults([])

    try {
      // Convert URLs to mock business objects with Batista Food & Grill data
      const businesses: Business[] = urls.map((url, index) => ({
        id: `batch-${index}`,
        name: `Batista Food & Grill Clone ${index + 1}`,
        address: "493 E 2700 S, South Salt Lake, UT 84115",
        phone: "(385) 993-5409",
        website: "https://batistafoodgrillut.com", // Always use the Batista website
        score: Math.floor(Math.random() * 30) + 20, // Random score between 20-50
        issues: {
          mobileFriendly: "warning",
          pageSpeed: "bad",
          seoBasics: "bad",
          ssl: "warning",
        },
        details: [
          "Website is not fully responsive on mobile devices",
          "Dark overlay makes content difficult to read",
          "Missing meta descriptions and proper heading structure",
          "Navigation is basic and lacks modern design elements",
          "Limited content and information about the business",
          "Images are not optimized for web",
          "No clear call-to-action elements besides the Order Online button",
        ],
      }))

      // Process the websites
      const batchResults = await regenerateMultipleWebsites(businesses)
      setResults(batchResults)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to process websites")
    } finally {
      setIsProcessing(false)
    }
  }

  const parseCSV = (text: string): string[] => {
    // Simple CSV parser that extracts URLs from the first column
    return text
      .split("\n")
      .map((line) => line.split(",")[0].trim())
      .filter((url) => url.startsWith("http"))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0])
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="text">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Enter URLs</TabsTrigger>
          <TabsTrigger value="file">Upload CSV</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-4">
          <form onSubmit={handleTextSubmit}>
            <div className="space-y-2">
              <Label htmlFor="websites">Website URLs (one per line)</Label>
              <Textarea
                id="websites"
                placeholder="https://example1.com
https://example2.com
https://example3.com"
                rows={6}
                value={websites}
                onChange={(e) => setWebsites(e.target.value)}
              />
            </div>

            <Button type="submit" className="mt-4 w-full" disabled={isProcessing}>
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4" />
                  Regenerate All Websites
                </span>
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="file" className="space-y-4">
          <form onSubmit={handleFileSubmit}>
            <div className="space-y-2">
              <Label htmlFor="csv-file">Upload CSV file with website URLs</Label>
              <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
              <p className="text-xs text-muted-foreground mt-1">CSV should have website URLs in the first column</p>
            </div>

            <Button type="submit" className="mt-4 w-full" disabled={isProcessing || !csvFile}>
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload and Process
                </span>
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Results ({results.length})</h3>

          <div className="space-y-2">
            {results.map((result, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">Business {index + 1}</p>
                      <p className="text-sm text-muted-foreground">ID: {result.businessId}</p>
                    </div>
                    {result.status === "success" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </CardContent>
                {result.status === "success" && (
                  <CardFooter className="px-4 py-2 pt-0">
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={result.deploymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        View Regenerated Site
                      </a>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
