import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Check,
  Search,
  BarChart2,
  Users,
  Target,
  Filter,
  Database,
  ChevronRight,
  Award,
  TrendingUp,
  LineChart,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image src="/ChatGPT Image Apr 30, 2025, 12_14_26 PM.png" alt="SiteSignal Logo" width={32} height={32} />
          <span className="font-bold text-xl">SiteSignal</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#agency-funnel" className="text-gray-700 hover:text-indigo-600">
            Agency Funnel
          </Link>
          <Link href="#features" className="text-gray-700 hover:text-indigo-600">
            Features
          </Link>
          <Link href="#pricing" className="text-gray-700 hover:text-indigo-600">
            Pricing
          </Link>
          <Link href="/sign-in" className="text-gray-700 hover:text-indigo-600">
            Login
          </Link>
          <Button
            className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white"
            asChild
          >
            <Link href="/sign-up">Get started</Link>
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
            Agency Growth Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Turn outdated websites into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              high-value clients
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Discover businesses with outdated websites that need your expertise. Our platform helps agencies identify
            and convert these opportunities into clients.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white w-full sm:w-auto"
              asChild
            >
              <Link href="/dashboard/search">
                <span className="flex items-center justify-center">
                  Start finding clients <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero Image/Visualization */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl overflow-hidden shadow-2xl border border-gray-200 p-8">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Dashboard visualization instead of image */}
              <div className="col-span-2 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">Website Opportunity Dashboard</h3>
                  <div className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">Live Data</div>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Joe's Pizza", score: 87, industry: "Restaurant" },
                    { name: "Sunshine Bakery", score: 76, industry: "Food & Beverage" },
                    { name: "Elite Plumbing", score: 92, industry: "Home Services" },
                  ].map((business, i) => (
                    <div key={i} className="flex items-center p-2 bg-gray-50 rounded-md">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-md flex items-center justify-center text-indigo-600 font-bold mr-3">
                        {business.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{business.name}</div>
                        <div className="text-xs text-gray-500">{business.industry}</div>
                      </div>
                      <div className="bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded-full">
                        {business.score}% Opportunity
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-sm text-gray-500">Showing 3 of 247 opportunities</div>
                  <button className="text-sm text-indigo-600 font-medium">View All →</button>
                </div>
              </div>

              {/* Stats panel */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3">Opportunity Metrics</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>High-Value Leads</span>
                        <span className="font-medium text-indigo-600">247</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Average Opportunity Score</span>
                        <span className="font-medium text-indigo-600">78%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: "78%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Conversion Potential</span>
                        <span className="font-medium text-indigo-600">92%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3">Industry Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Restaurants</span>
                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        32%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Retail</span>
                      <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        28%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Professional Services</span>
                      <span className="text-xs font-medium bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        24%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Home Services</span>
                      <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        16%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Agency Funnel Section */}
      <section id="agency-funnel" className="py-24 bg-gradient-to-b from-white to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block mb-6 px-4 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              The Agency Growth Funnel
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How agencies use outdated websites to fuel growth</h2>
            <p className="text-xl text-gray-600">
              Our proven methodology helps agencies identify, engage, and convert businesses with outdated websites into
              long-term clients
            </p>
          </div>

          {/* Funnel Visualization */}
          <div className="max-w-6xl mx-auto">
            {/* Funnel Step 1 */}
            <div className="relative mb-8">
              <div className="bg-white rounded-xl p-8 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
                <div className="bg-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Identify Opportunity-Rich Businesses</h3>
                  <p className="text-gray-600 mb-4">
                    Our platform scans thousands of businesses to identify those with outdated websites. These represent
                    prime opportunities for your agency.
                  </p>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="bg-indigo-100 p-1 rounded-full mt-0.5">
                        <Check className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <span className="font-medium">73% of businesses</span> have websites that don't meet modern
                        standards
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="bg-indigo-100 p-1 rounded-full mt-0.5">
                        <Check className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <span className="font-medium">68% of consumers</span> judge a business based on their website
                        quality
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-1 rounded-full mt-0.5">
                        <Check className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <span className="font-medium">Businesses with outdated websites</span> are 3x more likely to
                        need your services
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 w-full md:w-80 flex-shrink-0">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Opportunity Score</h4>
                    <div className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded">
                      High Value
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Mobile Responsiveness</span>
                        <span className="font-medium text-red-600">Poor</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Page Speed</span>
                        <span className="font-medium text-amber-600">Fair</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: "35%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Design Modernity</span>
                        <span className="font-medium text-red-600">Poor</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: "20%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block absolute left-1/2 -bottom-8 transform -translate-x-1/2">
                <ChevronRight className="h-8 w-8 text-indigo-300 rotate-90" />
              </div>
            </div>

            {/* Funnel Step 2 (previously Step 3) */}
            <div className="relative mb-8">
              <div className="bg-white rounded-xl p-8 shadow-xl border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
                <div className="bg-indigo-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Convert with ROI-Focused Proposals</h3>
                  <p className="text-gray-600 mb-4">
                    Our platform helps you create data-driven proposals that focus on business outcomes and ROI, making
                    it easy for prospects to say yes.
                  </p>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="bg-indigo-100 p-1 rounded-full mt-0.5">
                        <Check className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <span className="font-medium">87% of agencies</span> report higher close rates with our
                        ROI-focused approach
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="bg-indigo-100 p-1 rounded-full mt-0.5">
                        <Check className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <span className="font-medium">35% higher project values</span> when using our business impact
                        calculators
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-indigo-100 p-1 rounded-full mt-0.5">
                        <Check className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <span className="font-medium">Customizable proposal templates</span> that focus on business
                        outcomes
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 w-full md:w-80 flex-shrink-0">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">Business Impact</h4>
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">High ROI</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <LineChart className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm">Conversion Rate</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="font-medium">+42%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm">Customer Retention</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="font-medium">+28%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Award className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm">Brand Perception</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="font-medium">+65%</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Projected Annual ROI</span>
                        <span className="text-green-600 font-bold">312%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block absolute left-1/2 -bottom-8 transform -translate-x-1/2">
                <ChevronRight className="h-8 w-8 text-indigo-300 rotate-90" />
              </div>
            </div>

            {/* Funnel Step 3 (previously Step 4) */}
            <div className="relative">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-8 shadow-xl border border-indigo-500 flex flex-col md:flex-row gap-8 items-center text-white">
                <div className="bg-white text-indigo-600 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Scale Your Agency</h3>
                  <p className="text-indigo-100 mb-4">
                    With a steady stream of qualified leads and high conversion rates, you can predictably scale your
                    agency and increase revenue.
                  </p>
                  <div className="bg-indigo-700 bg-opacity-50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="bg-white p-1 rounded-full mt-0.5">
                        <Check className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="text-white">
                        <span className="font-medium">Agencies using our platform</span> grow 2.7x faster than industry
                        average
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mb-2">
                      <div className="bg-white p-1 rounded-full mt-0.5">
                        <Check className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="text-white">
                        <span className="font-medium">Predictable lead generation</span> enables confident hiring and
                        expansion
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-white p-1 rounded-full mt-0.5">
                        <Check className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="text-white">
                        <span className="font-medium">Higher profit margins</span> from more efficient client
                        acquisition
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-200 w-full md:w-80 flex-shrink-0 text-gray-800">
                  <div className="text-center mb-6">
                    <h4 className="font-bold text-xl mb-1">Agency Growth</h4>
                    <p className="text-sm text-gray-500">Average results after 6 months</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-3 rounded-lg text-center">
                      <div className="text-indigo-600 font-bold text-2xl">+127%</div>
                      <div className="text-xs text-gray-500">Lead Volume</div>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg text-center">
                      <div className="text-indigo-600 font-bold text-2xl">+87%</div>
                      <div className="text-xs text-gray-500">Close Rate</div>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg text-center">
                      <div className="text-indigo-600 font-bold text-2xl">+42%</div>
                      <div className="text-xs text-gray-500">Project Value</div>
                    </div>
                    <div className="bg-indigo-50 p-3 rounded-lg text-center">
                      <div className="text-indigo-600 font-bold text-2xl">+215%</div>
                      <div className="text-xs text-gray-500">Revenue</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Funnel CTA */}
            <div className="mt-16 text-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white w-full sm:w-auto"
                asChild
              >
                <Link href="/sign-up">
                  <span className="flex items-center justify-center whitespace-normal px-2">
                    Start finding clients today <ArrowRight className="ml-2 h-5 w-5 flex-shrink-0" />
                  </span>
                </Link>
              </Button>
              <p className="mt-4 text-gray-500">Join 2,500+ agencies already growing with SiteSignal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block mb-6 px-4 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              Industry-Leading Technology
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Web opportunity detection that actually{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                delivers results
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Our proprietary algorithms identify businesses with outdated websites that are primed for conversion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Target className="h-10 w-10 text-indigo-600" />}
              title="Precision Targeting Engine"
              description="Our AI-powered search identifies businesses with outdated websites using 27 different quality indicators and conversion signals."
            />
            <FeatureCard
              icon={<BarChart2 className="h-10 w-10 text-indigo-600" />}
              title="Deep Website Analysis"
              description="Comprehensive technical assessment that pinpoints specific design flaws, performance issues, and conversion blockers."
            />
            <FeatureCard
              icon={<Filter className="h-10 w-10 text-indigo-600" />}
              title="Opportunity Scoring System"
              description="Proprietary algorithm ranks leads by conversion potential, helping you focus on businesses most likely to become clients."
            />
            <FeatureCard
              icon={<Database className="h-10 w-10 text-indigo-600" />}
              title="Agency-Focused CRM"
              description="Purpose-built lead management system designed specifically for web professionals with customizable pipelines and follow-up automation."
            />
            <FeatureCard
              icon={<Search className="h-10 w-10 text-indigo-600" />}
              title="Competitive Intelligence"
              description="Analyze how potential clients compare to their direct competitors, creating compelling reasons for them to upgrade."
            />
            <FeatureCard
              icon={<LineChart className="h-10 w-10 text-indigo-600" />}
              title="ROI Visualization Tools"
              description="Show prospects the exact business impact of a website redesign with customizable metrics and industry benchmarks."
            />
          </div>
        </div>
      </section>

      {/* Lead Scraper Tool Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              Powerful Lead Generation
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Find potential clients with our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Lead Scraper Tool
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Quickly search for businesses in any location and industry. Export leads with contact information and
              website details.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white w-full sm:w-auto"
              asChild
            >
              <Link href="/lead-generator">
                <span className="flex items-center justify-center">
                  <Search className="mr-2 h-5 w-5" />
                  Try the Lead Scraper Now
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How SiteSignal works</h2>
            <p className="text-xl text-gray-600">A simple 3-step process to find and win new web design clients</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Find Prospects</h3>
              <p className="text-gray-600">
                Search for businesses in your target location and industry. Our AI identifies those with outdated
                websites.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Analyze Websites</h3>
              <p className="text-gray-600">
                Get detailed reports on design age, performance issues, and specific problems that need fixing.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Close Deals</h3>
              <p className="text-gray-600">
                Use our outreach tools and detailed analysis to convince businesses they need your services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What our users say</h2>
            <p className="text-xl text-gray-600">Web professionals are growing their businesses with SiteSignal</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="I used to spend hours searching for potential clients. Now I can find qualified leads with outdated websites in minutes. My close rate has doubled!"
              author="Sarah Johnson"
              role="Freelance Web Designer"
              avatarSrc="/testimonial-1.png"
            />
            <TestimonialCard
              quote="The website analysis reports are game-changers. Clients can immediately see the problems with their current site, making it so much easier to justify our rates."
              author="Michael Chen"
              role="Agency Owner, PixelPerfect"
              avatarSrc="/testimonial-2.png"
            />
            <TestimonialCard
              quote="We've grown our web design business by 40% in just 3 months using SiteSignal. The quality scoring helps us focus on the leads most likely to convert."
              author="Jessica Miller"
              role="Marketing Director, WebWorks"
              avatarSrc="/avatar.png"
            />
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">See it in action</h2>
            <p className="text-xl text-gray-600">
              Watch how SiteSignal helps you find businesses with outdated websites
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl overflow-hidden flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
                <h3 className="text-2xl font-bold mb-4">Agency Growth Demo</h3>
                <p className="max-w-md text-center mb-8">
                  See how our platform helps agencies find and convert high-value clients
                </p>
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 rounded-full h-20 w-20">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-10 h-10">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pricing plans that scale with your business</h2>
            <p className="text-xl text-gray-600">
              Choose the plan that's right for you, from solo freelancers to growing agencies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 transition-transform hover:scale-105">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">Freelancer</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Perfect for independent designers</p>
                <Button className="w-full bg-gray-900 hover:bg-gray-800" asChild>
                  <Link href="/sign-up?plan=freelancer">
                    <span className="flex items-center justify-center">Start Free Trial</span>
                  </Link>
                </Button>
                <ul className="mt-8 space-y-4">
                  <PricingFeature text="50 business searches per month" />
                  <PricingFeature text="Website quality analysis" />
                  <PricingFeature text="Design age detection" />
                  <PricingFeature text="Email outreach templates" />
                  <PricingFeature text="Lead management" />
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-xl border-2 border-indigo-500 transform scale-105">
              <div className="bg-indigo-500 text-white text-center py-2 text-sm font-medium">MOST POPULAR</div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$99</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Ideal for growing agencies</p>
                <Button
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
                  asChild
                >
                  <Link href="/sign-up?plan=professional">
                    <span className="flex items-center justify-center">Start Free Trial</span>
                  </Link>
                </Button>
                <ul className="mt-8 space-y-4">
                  <PricingFeature text="200 business searches per month" />
                  <PricingFeature text="Advanced website analysis" />
                  <PricingFeature text="Competitor comparison" />
                  <PricingFeature text="Automated outreach campaigns" />
                  <PricingFeature text="Performance metrics" />
                  <PricingFeature text="Lead scoring" />
                  <PricingFeature text="Client dashboard" />
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 transition-transform hover:scale-105">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">Agency</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$199</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <p className="text-gray-600 mb-6">For established agencies</p>
                <Button className="w-full bg-gray-900 hover:bg-gray-800" asChild>
                  <Link href="/sign-up?plan=agency">
                    <span className="flex items-center justify-center">Start Free Trial</span>
                  </Link>
                </Button>
                <ul className="mt-8 space-y-4">
                  <PricingFeature text="Unlimited business searches" />
                  <PricingFeature text="Comprehensive website analysis" />
                  <PricingFeature text="Industry benchmarking" />
                  <PricingFeature text="Advanced outreach campaigns" />
                  <PricingFeature text="White-label reports" />
                  <PricingFeature text="Team collaboration" />
                  <PricingFeature text="CRM integration" />
                  <PricingFeature text="Priority support" />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to find your next clients?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90">
            Start discovering businesses with outdated websites today and grow your web design business.
          </p>
          <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 w-full sm:w-auto" asChild>
            <Link href="/sign-up">
              <span className="flex items-center justify-center">Start Your Free Trial</span>
            </Link>
          </Button>
          <p className="mt-4 text-sm text-white/80">No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/features" className="text-gray-400 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-400 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/testimonials" className="text-gray-400 hover:text-white">
                    Testimonials
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-gray-400 hover:text-white">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-gray-400 hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} WebProspector. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="bg-indigo-50 w-14 h-14 rounded-lg flex items-center justify-center mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function TestimonialCard({
  quote,
  author,
  role,
  avatarSrc,
}: {
  quote: string
  author: string
  role: string
  avatarSrc: string
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-400">
            ★
          </span>
        ))}
      </div>
      <p className="text-gray-700 mb-6">"{quote}"</p>
      <div className="flex items-center">
        <Image
          src={avatarSrc || "/placeholder.svg"}
          alt={author}
          width={48}
          height={48}
          className="rounded-full mr-4"
        />
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  )
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-start">
      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
      <span>{text}</span>
    </li>
  )
}
