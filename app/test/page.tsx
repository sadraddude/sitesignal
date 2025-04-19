import { testFirecrawl } from "@/lib/test-firecrawl"

export default async function TestPage() {
  let result = null
  let error = null

  try {
    result = await testFirecrawl()
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error"
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Firecrawl Test</h1>

      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      ) : null}

      {result ? (
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h2 className="text-lg font-semibold mb-2">Test Results</h2>
            <p>
              <strong>Success:</strong> {result.success ? "Yes" : "No"}
            </p>
          </div>

          {result.searchData && (
            <div className="p-4 border rounded">
              <h2 className="text-lg font-semibold mb-2">Search Results</h2>
              <p>
                <strong>Business Found:</strong> {result.searchData.found ? "Yes" : "No"}
              </p>
              {result.searchData.found && (
                <>
                  <p>
                    <strong>Business Name:</strong> {result.searchData.businessName}
                  </p>
                  <p>
                    <strong>URL:</strong> {result.searchData.url}
                  </p>
                  <div>
                    <strong>Description:</strong>
                    <p className="mt-1 text-sm">{result.searchData.description}</p>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="p-4 border rounded">
            <h2 className="text-lg font-semibold mb-2">Raw Search Response</h2>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-96">{result.rawSearchResponse}</pre>
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        <p className="text-sm text-gray-600">Check the server logs for more detailed debugging information.</p>
      </div>
    </div>
  )
}
