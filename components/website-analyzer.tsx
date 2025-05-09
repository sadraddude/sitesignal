"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { WebsiteScoreDetails } from "@/components/website-score-details"
import type { WebsiteScore } from "@/lib/types"
import type { AdvancedAnalysisResult } from "@/lib/advanced-scoring-engine"
import { toast } from "sonner"

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }).min(4, { message: "URL must be at least 4 characters."})
})

type FormData = z.infer<typeof formSchema>

export default function WebsiteAnalyzer() {
  const [analysisResult, setAnalysisResult] = useState<AdvancedAnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysisInitiated, setAnalysisInitiated] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  })

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    setAnalysisResult(null)
    setError(null)
    setAnalysisInitiated(true)
    let submittedUrl = data.url;
    if (!submittedUrl.startsWith("http://") && !submittedUrl.startsWith("https://")) {
      submittedUrl = "https://" + submittedUrl;
    }

    try {
      const response = await fetch("/api/analyze-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: submittedUrl }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        const apiError = result.error || `HTTP error! Status: ${response.status}`;
        throw new Error(apiError);
      }

      setAnalysisResult(result.analysis)
      toast.success("Analysis complete!");

    } catch (err) {
      console.error("Failed to analyze website:", err)
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to analyze website: ${errorMessage}`);
      toast.error(`Analysis failed: ${errorMessage}`);
      setAnalysisResult(null);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="mb-4">
        <Button variant="outline" size="sm" onClick={() => window.history.back()} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Website Analyzer</CardTitle>
          <CardDescription>Enter a URL to get a detailed website analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : "Analyze Website"}
              </Button>
            </form>
          </Form>

          {isLoading && (
            <div className="mt-6 flex flex-col items-center justify-center p-10 space-y-4 border rounded-md">
                <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
                <p className="text-lg font-medium text-gray-700">Analyzing Website...</p>
                <p className="text-sm text-gray-500">Please wait while we analyze the provided URL.</p>
            </div>
          )}

          {error && !isLoading && (
             <Alert variant="destructive" className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
             </Alert>
          )}

          {analysisResult && !isLoading && (
            <div className="mt-6">
              <Separator className="my-4" />
              <h2 className="text-lg font-semibold mb-4">Analysis Result for: {analysisResult.score.url}</h2>
              <WebsiteScoreDetails score={analysisResult.score} businessName={analysisResult.score.url} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
