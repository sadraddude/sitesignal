import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BatchProcessor } from "@/components/batch-processor"

export default function BatchPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Batch Website Regeneration</CardTitle>
          <CardDescription>Automatically regenerate multiple websites with v0</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading batch processor...</div>}>
            <BatchProcessor />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
