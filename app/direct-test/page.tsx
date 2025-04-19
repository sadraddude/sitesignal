"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DirectTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    status?: number
    contentLength?: number
    contentSample?: string
    error?: string
  } | null>(null)

  const testDirectAccess = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Try to fetch the website directly
      const response = await fetch("/api/direct-test?url=https://batistafoodgrillut.com")
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
      <h1 className="text-2xl font-bold mb-6">Direct Website Access Test</h1>
      <p className="mb-4">
        This test will try to access the website directly to check if it's accessible and contains content.
      </p>

      <Button onClick={testDirectAccess} disabled={isLoading}>
        {isLoading ? "Testing..." : "Test Direct Access"}
      </Button>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{result.success ? "Success" : "Failed"}</CardTitle>
          </CardHeader>
          <CardContent>
            {result.success ? (
              <div className="space-y-4">
                <p>
                  <strong>Status:</strong> {result.status}
                </p>
                <p>
                  <strong>Content Length:</strong> {result.contentLength} characters
                </p>
                <div>
                  <strong>Content Sample:</strong>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40 mt-2">
                    {result.contentSample}
                  </pre>
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
