export default function PageSpeedKeyTestPage() {
  // Check if the API keys are available
  const placesApiKeyAvailable = !!process.env.GOOGLE_PLACES_API_KEY
  const pageSpeedApiKeyAvailable = !!process.env.PAGESPEED_API_KEY

  // Get the first few characters of the API keys for verification (if available)
  const placesApiKeyPreview = process.env.GOOGLE_PLACES_API_KEY
    ? `${process.env.GOOGLE_PLACES_API_KEY.substring(0, 5)}...`
    : "Not available"

  const pageSpeedApiKeyPreview = process.env.PAGESPEED_API_KEY
    ? `${process.env.PAGESPEED_API_KEY.substring(0, 5)}...`
    : "Not available"

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">API Key Test</h1>

      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Google Places API Key</h2>
          <p>
            <strong>Available:</strong> {placesApiKeyAvailable ? "Yes" : "No"}
          </p>
          <p>
            <strong>Preview:</strong> {placesApiKeyPreview}
          </p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">PageSpeed Insights API Key</h2>
          <p>
            <strong>Available:</strong> {pageSpeedApiKeyAvailable ? "Yes" : "No"}
          </p>
          <p>
            <strong>Preview:</strong> {pageSpeedApiKeyPreview}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        Note: For security reasons, only the first few characters of the API keys are shown.
      </p>
    </div>
  )
}
