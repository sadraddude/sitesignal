"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, AlertCircle, Calendar, Zap, List, CheckSquare } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

export default function DesignAgeTestPage() {
  const [url, setUrl] = useState("https://www.example.com")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const analyzeDesignAge = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/design-age", {
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
      <h1 className="text-2xl font-bold mb-6">Website Design Age Analysis</h1>
      <p className="mb-4">Enter a website URL to analyze how modern or outdated its design looks.</p>

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>About Design Age Analysis</AlertTitle>
        <AlertDescription>
          This test analyzes a website and uses AI to determine how modern or outdated the design looks. It evaluates
          visual design, layout, typography, color scheme, and other factors to determine a "design age" score. The
          analysis may take 15-30 seconds to complete.
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

        <Button onClick={analyzeDesignAge} disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Analyze Design Age"}
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
                  <span>Design Age Score: {result.result.score}/100</span>
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      result.result.score >= 80
                        ? "bg-green-500"
                        : result.result.score >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  >
                    {result.result.score >= 80 ? "Modern" : result.result.score >= 50 ? "Somewhat Dated" : "Outdated"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="issues">Issues</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                    <TabsTrigger value="screenshot">Screenshot</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Design feels like it's from: {result.result.designYear}</p>
                          <p className="text-sm text-gray-500">
                            ({result.result.designAge} years behind current design trends)
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Design Modernity</span>
                          <span
                            className={`px-2 py-1 text-sm rounded ${
                              result.result.score >= 80
                                ? "bg-green-100 text-green-800"
                                : result.result.score >= 50
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result.result.score}/100
                          </span>
                        </div>
                        <Progress
                          value={result.result.score}
                          className={`h-2 ${
                            result.result.score >= 80
                              ? "bg-green-100"
                              : result.result.score >= 50
                                ? "bg-yellow-100"
                                : "bg-red-100"
                          }`}
                          indicatorClassName={`${
                            result.result.score >= 80
                              ? "bg-green-500"
                              : result.result.score >= 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-2">Analysis</h3>
                        <p>{result.result.analysis}</p>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Technologies Detected</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(result.result.technologies).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${value ? "bg-green-500" : "bg-gray-300"}`}></div>
                              <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="issues" className="pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <List className="h-5 w-5 text-red-500" />
                        <h3 className="font-medium">Design Issues</h3>
                      </div>

                      <ul className="space-y-2">
                        {result.result.issues.map((issue: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="recommendations" className="pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5 text-green-500" />
                        <h3 className="font-medium">Recommendations to Modernize</h3>
                      </div>

                      <ul className="space-y-2">
                        {result.result.recommendations.map((recommendation: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="screenshot" className="pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-500" />
                        <h3 className="font-medium">Website Screenshot</h3>
                      </div>

                      <div className="border rounded-lg overflow-hidden">
                        {result.result.screenshot && (
                          <div className="relative w-full h-[500px]">
                            <Image
                              src={result.result.screenshot || "/placeholder.svg"}
                              alt={`Screenshot of ${url}`}
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        )}
                      </div>
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
