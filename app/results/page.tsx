import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchResults } from "@/components/search-results"

export default function ResultsPage({
  searchParams,
}: {
  searchParams: { term: string; location: string; industry: string; count: string }
}) {
  const { term, location, industry, count } = searchParams

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
          <CardTitle>Search Results</CardTitle>
          <CardDescription>
            Showing results for {term} in {location} ({industry})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ResultsSkeleton count={Number.parseInt(count) || 10} />}>
            <SearchResults term={term} location={location} industry={industry} count={Number.parseInt(count) || 10} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

function ResultsSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  )
}
