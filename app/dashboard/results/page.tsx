import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft, Filter, Download, Save, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchResults } from "@/components/search-results"

export default function ResultsPage({
  searchParams,
}: {
  searchParams: {
    term: string
    location: string
    industry: string
    count: string
    maxScore?: string
    hasWebsite?: string
    excludeSaved?: string
    minRating?: string
  }
}) {
  const { term, location, industry, count } = searchParams

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/search">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Search Results</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Sort</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Save className="h-4 w-4" />
            <span>Save All</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing results for {term} in {location} ({industry})
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-1">Search Summary</h3>
            <p className="text-sm text-blue-700">
              Found 42 businesses matching your criteria. 28 of them (67%) have website scores below 50, indicating
              significant opportunities for improvement.
            </p>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Results (42)</TabsTrigger>
              <TabsTrigger value="poor">Poor Websites (28)</TabsTrigger>
              <TabsTrigger value="no-website">No Website (8)</TabsTrigger>
              <TabsTrigger value="saved">Saved (0)</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Suspense fallback={<ResultsSkeleton count={Number.parseInt(count) || 10} />}>
                <SearchResults
                  term={term}
                  location={location}
                  industry={industry}
                  count={Number.parseInt(count) || 10}
                  maxScore={Number.parseInt(searchParams.maxScore || "100")}
                  hasWebsite={searchParams.hasWebsite === "true"}
                  excludeSaved={searchParams.excludeSaved === "true"}
                  minRating={Number.parseFloat(searchParams.minRating || "0")}
                />
              </Suspense>
            </TabsContent>

            <TabsContent value="poor">
              <Suspense fallback={<ResultsSkeleton count={Number.parseInt(count) || 10} />}>
                <SearchResults
                  term={term}
                  location={location}
                  industry={industry}
                  count={Number.parseInt(count) || 10}
                  maxScore={50}
                  hasWebsite={true}
                  excludeSaved={searchParams.excludeSaved === "true"}
                  minRating={Number.parseFloat(searchParams.minRating || "0")}
                />
              </Suspense>
            </TabsContent>

            <TabsContent value="no-website">
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium">Joe's Pizza</h3>
                        <p className="text-sm text-muted-foreground">123 Main St, Chicago, IL</p>
                        <div className="flex items-center mt-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground ml-2">(42 reviews)</span>
                        </div>
                      </div>
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        No Website
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm" className="mr-2">
                        Save Lead
                      </Button>
                      <Button size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
                {/* More no-website businesses would be listed here */}
              </div>
            </TabsContent>

            <TabsContent value="saved">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No saved businesses from this search yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Click "Save Lead" on any business to add it to your saved leads.
                </p>
              </div>
            </TabsContent>
          </Tabs>
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
