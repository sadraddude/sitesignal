"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function LighthouseTestPage() {
  const [url, setUrl] = useState("https://www.example.com")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const analyzeWebsite = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/lighthouse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
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
      <h1 className="text-2xl font-bold mb-6">Lighthouse Website Analysis</h1>
      <p className="mb-4">Enter a website URL to analyze using Google Lighthouse.</p>

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>About Lighthouse Analysis</AlertTitle>
        <AlertDescription>
          This test uses Google Lighthouse (via PageSpeed Insights API) to analyze website performance, accessibility,
          SEO, and best practices. The analysis may take 15-30 seconds to complete.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="url">Website URL</Label>
          <Input
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g., https://www.example.com"
            className="mt-1"
          />
        </div>

        <Button onClick={analyzeWebsite} disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Analyze Website"}
        </Button>
      </div>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">{result.success ? "Analysis Results" : "Analysis Failed"}</h2>

          {!result.success && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{result.error || result.errorDetails || "Unknown error"}</AlertDescription>
            </Alert>
          )}

          {result.success && result.result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Website Score: {result.result.overallScore}/100</span>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      result.result.overallScore >= 90
                        ? "bg-green-500"
                        : result.result.overallScore >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  >
                    {result.result.overallScore >= 90
                      ? "Excellent"
                      : result.result.overallScore >= 70
                        ? "Good"
                        : result.result.overallScore >= 50
                          ? "Needs Improvement"
                          : "Poor"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="scores">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="scores">Scores</TabsTrigger>
                    <TabsTrigger value="metrics">Metrics</TabsTrigger>
                    <TabsTrigger value="issues">Issues</TabsTrigger>
                  </TabsList>

                  <TabsContent value="scores" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <ScoreItem
                        label="Performance"
                        score={Math.round(result.result.scores.performance * 100)}
                        description="How fast the page loads and becomes interactive"
                      />
                      <ScoreItem
                        label="Accessibility"
                        score={Math.round(result.result.scores.accessibility * 100)}
                        description="How accessible the page is to users with disabilities"
                      />
                      <ScoreItem
                        label="Best Practices"
                        score={Math.round(result.result.scores.bestPractices * 100)}
                        description="Adherence to web development best practices"
                      />
                      <ScoreItem
                        label="SEO"
                        score={Math.round(result.result.scores.seo * 100)}
                        description="How well the page is optimized for search engines"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="metrics" className="pt-4">
                    <div className="space-y-2">
                      {Object.entries(result.result.metrics).map(
                        ([key, value]: [string, any]) =>
                          value && (
                            <div key={key} className="flex justify-between items-center py-1 border-b">
                              <span className="font-medium">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())
                                  .replace(/([A-Z])/g, (match) => match.toLowerCase())}
                              </span>
                              <span>{value}</span>
                            </div>
                          ),
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="issues" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Top Issues to Fix</h3>
                      <ul className="space-y-2">
                        {result.result.details.map((detail: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-500">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>

                      {result.result.failedAudits.length > 0 && (
                        <div className="mt-6">
                          <h3 className="text-lg font-medium mb-2">Failed Audits</h3>
                          <div className="space-y-3">
                            {result.result.failedAudits.map((audit: any, index: number) => (
                              <div key={index} className="p-3 bg-gray-50 rounded">
                                <div className="flex justify-between">
                                  <h4 className="font-medium">{audit.title}</h4>
                                  <span
                                    className={`px-1.5 py-0.5 text-xs rounded ${
                                      audit.score >= 0.7
                                        ? "bg-green-100 text-green-800"
                                        : audit.score >= 0.4
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {Math.round(audit.score * 100) || 0}/100
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{audit.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

function ScoreItem({ label, score, description }: { label: string; score: number; description: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-medium">{label}</span>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <span
          className={`px-2 py-1 text-sm rounded ${
            score >= 90
              ? "bg-green-100 text-green-800"
              : score >= 50
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {score}/100
        </span>
      </div>
      <Progress
        value={score}
        className={`h-2 ${score >= 90 ? "bg-green-100" : score >= 50 ? "bg-yellow-100" : "bg-red-100"}`}
        indicatorClassName={`${score >= 90 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
      />
    </div>
  )
}
