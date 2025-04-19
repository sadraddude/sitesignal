"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
})

type FormData = z.infer<typeof formSchema>

export default function WebsiteAnalyzer() {
  const [websiteContent, setWebsiteContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  })

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    setWebsiteContent(null)
    try {
      const response = await fetch("/api/analyze-website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: data.url }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setWebsiteContent(result.content)
    } catch (error) {
      console.error("Failed to fetch website content:", error)
      setWebsiteContent("Failed to analyze website. Please try again.")
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
          <CardDescription>Enter a URL to analyze the website content.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Analyzing..." : "Analyze"}
              </Button>
            </form>
          </Form>
          {websiteContent && (
            <div className="mt-6">
              <Separator className="my-4" />
              <h2 className="text-lg font-semibold mb-2">Analysis Result</h2>
              {isLoading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <pre className="whitespace-pre-wrap break-words bg-gray-100 p-4 rounded-md">{websiteContent}</pre>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
