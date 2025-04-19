import { scrapeBusinesses } from "@/lib/scrape-action"
import { BusinessCard } from "@/components/business-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export async function SearchResults({
  term,
  location,
  industry,
  count,
}: {
  term: string
  location: string
  industry: string
  count: number
}) {
  const results = await scrapeBusinesses({ term, location, industry, count })

  return !results || results.length === 0 ? (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>No results found</AlertTitle>
      <AlertDescription>
        We couldn't find any businesses matching your search criteria. Try adjusting your search terms.
      </AlertDescription>
    </Alert>
  ) : (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Found {results.length} businesses that might need website improvements
      </p>

      <div className="space-y-4">
        {results.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  )
}
