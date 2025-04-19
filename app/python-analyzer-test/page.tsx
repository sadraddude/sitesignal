import { PythonAnalyzerTest } from "@/components/python-analyzer-test"

export default function PythonAnalyzerTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Website Analyzer Test</h1>
      <p className="mb-6">This page tests the integration with the Python website analyzer script.</p>
      <PythonAnalyzerTest />
    </div>
  )
}
