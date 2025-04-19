"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export function PythonAnalyzerTest() {
  const [url, setUrl] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeWebsite = async () => {
    if (!url) {
      setError("Please enter a URL")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/python-analyzer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "analyze_website",
          url,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || "Failed to analyze the website")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Website Analyzer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter website URL (e.g., example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={analyzeWebsite} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Analysis Complete</AlertTitle>
              <AlertDescription>
                <div className="mt-2">
                  <p>
                    <strong>Status:</strong> {result.status}
                  </p>
                  <p>
                    <strong>Issues Found:</strong> {result.issues.length}
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            {result.issues.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Issues Detected:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {result.issues.map((issue: string, index: number) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.email_body && (
              <div>
                <h3 className="text-lg font-medium mb-2">Generated Email:</h3>
                <Textarea className="min-h-[200px] font-mono text-sm" value={result.email_body} readOnly />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
