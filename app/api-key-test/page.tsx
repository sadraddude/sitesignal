export default function ApiKeyTestPage() {
  // Check if the API key is available
  const apiKeyAvailable = !!process.env.GOOGLE_PLACES_API_KEY

  // Get the first few characters of the API key for verification (if available)
  const apiKeyPreview = process.env.GOOGLE_PLACES_API_KEY
    ? `${process.env.GOOGLE_PLACES_API_KEY.substring(0, 5)}...`
    : "Not available"

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">API Key Test</h1>

      <div className="p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">Google Places API Key</h2>
        <p>
          <strong>Available:</strong> {apiKeyAvailable ? "Yes" : "No"}
        </p>
        <p>
          <strong>Preview:</strong> {apiKeyPreview}
        </p>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        Note: For security reasons, only the first few characters of the API key are shown.
      </p>
    </div>
  )
}
