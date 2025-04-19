"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { WebsiteScore } from "@/lib/types"
import { performAdvancedAnalysis, calculateProprietaryWebScore } from "@/lib/advanced-scoring-engine"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Shield,
  Smartphone,
  Search,
  Zap,
  Layout,
  FileText,
  Phone,
  Award,
  Clock,
  Download,
  ChevronRight,
  ExternalLink,
  Share2,
} from "lucide-react"

interface AdvancedAnalysisDashboardProps {
  websiteScore: WebsiteScore
  businessName: string
  industry?: string
  businessSize?: "verySmall" | "small" | "medium" | "large" | "veryLarge"
}

export function AdvancedAnalysisDashboard({
  websiteScore,
  businessName,
  industry = "default",
  businessSize = "small",
}: AdvancedAnalysisDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Generate the advanced analysis
  const analysis = performAdvancedAnalysis(websiteScore, industry, businessSize)

  // Calculate proprietary WebScore™
  const webScore = calculateProprietaryWebScore(websiteScore)

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Prepare data for charts
  const scoreComparisonData = [
    { name: "Current", score: websiteScore.overall },
    { name: "Industry Avg", score: analysis.industryComparison.averageScore },
    { name: "Leaders", score: analysis.industryComparison.leadingCompetitorScore },
  ]

  const categoryScoresData = [
    { name: "SEO", score: websiteScore.seo, benchmark: analysis.industryComparison.averageScore },
    { name: "Mobile", score: websiteScore.mobile, benchmark: analysis.industryComparison.averageScore },
    { name: "Security", score: websiteScore.security, benchmark: analysis.industryComparison.averageScore },
    { name: "Performance", score: websiteScore.performance, benchmark: analysis.industryComparison.averageScore },
    { name: "Design", score: websiteScore.design, benchmark: analysis.industryComparison.averageScore },
    { name: "Content", score: websiteScore.content, benchmark: analysis.industryComparison.averageScore },
    { name: "Contact", score: websiteScore.contact, benchmark: analysis.industryComparison.averageScore },
  ]

  const conversionImpactData = [
    { name: "Current", rate: analysis.conversionImpact.estimatedCurrentRate * 100 },
    { name: "Potential", rate: analysis.conversionImpact.potentialRate * 100 },
  ]

  const radarData = categoryScoresData.map((item) => ({
    subject: item.name,
    A: item.score,
    B: item.benchmark,
    fullMark: 100,
  }))

  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    if (score >= 40) return "text-orange-500"
    return "text-red-500"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    if (score >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  const getComplexityColor = (level: string) => {
    if (level === "low") return "text-green-500"
    if (level === "medium") return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* WebScore™ Card */}
        <Card className="md:w-1/3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">WebScore™</CardTitle>
            <CardDescription>Proprietary website effectiveness score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center flex-col">
              <div className={`text-6xl font-bold ${getScoreColor(webScore)}`}>{webScore}</div>
              <div className="text-sm text-muted-foreground mt-2">
                {webScore >= 80
                  ? "Excellent"
                  : webScore >= 60
                    ? "Good"
                    : webScore >= 40
                      ? "Needs Improvement"
                      : "Critical Issues"}
              </div>
              <Progress value={webScore} className={`h-2 w-full mt-4 ${getScoreBgColor(webScore)}`} />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="text-xs text-muted-foreground">
              Better than {analysis.industryComparison.percentile}% of {industry} websites
            </div>
          </CardFooter>
        </Card>

        {/* Revenue Impact Card */}
        <Card className="md:w-2/3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Potential Revenue Impact</CardTitle>
            <CardDescription>Estimated financial benefit from website improvements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                <div className="text-muted-foreground text-sm">Monthly Lift</div>
                <div className="text-2xl font-bold text-green-600 flex items-center">
                  <DollarSign className="h-5 w-5 mr-1" />
                  {formatCurrency(analysis.revenueImpact.monthlyRevenueLift)}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                <div className="text-muted-foreground text-sm">Annual Lift</div>
                <div className="text-2xl font-bold text-green-600 flex items-center">
                  <DollarSign className="h-5 w-5 mr-1" />
                  {formatCurrency(analysis.revenueImpact.annualRevenueLift)}
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
                <div className="text-muted-foreground text-sm">Conversion Improvement</div>
                <div className="text-2xl font-bold text-blue-600 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-1" />
                  {analysis.conversionImpact.percentImprovement}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="competitive">Competitive Analysis</TabsTrigger>
          <TabsTrigger value="technical">Technical Details</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Industry Comparison</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Potential</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conversionImpactData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, Math.max(5, Math.ceil(analysis.conversionImpact.potentialRate * 100))]} />
                    <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, "Conversion Rate"]} />
                    <Bar dataKey="rate" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Implementation Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col space-y-2">
                  <div className="text-sm font-medium">Complexity Level</div>
                  <div
                    className={`text-xl font-bold ${getComplexityColor(analysis.implementationComplexity.level)} capitalize`}
                  >
                    {analysis.implementationComplexity.level}
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="text-sm font-medium">Estimated Timeline</div>
                  <div className="text-xl font-bold flex items-center">
                    <Clock className="h-5 w-5 mr-1" />
                    {analysis.implementationComplexity.estimatedTimeInWeeks} weeks
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="text-sm font-medium">Opportunity Score</div>
                  <div className="text-xl font-bold text-purple-600">
                    {analysis.competitiveAdvantage.opportunityScore}/100
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-sm font-medium mb-2">Key Considerations</div>
                <div className="flex flex-wrap gap-2">
                  {analysis.implementationComplexity.keyConsiderations.map((consideration, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-100">
                      {consideration}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitive" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="Your Website" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Industry Average" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Competitive Advantage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Strengths</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.competitiveAdvantage.strengthAreas.length > 0 ? (
                        analysis.competitiveAdvantage.strengthAreas.map((area, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-200">
                            {area}
                          </Badge>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground">No significant strengths identified</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Improvement Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.competitiveAdvantage.improvementAreas.map((area, index) => (
                        <Badge key={index} className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Competitive Gap Analysis</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {categoryScoresData.map((category, index) => (
                        <div key={index} className="flex flex-col">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{category.name}</span>
                            <span className="text-sm font-medium">
                              {category.score} vs {category.benchmark}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Progress
                              value={category.score}
                              className={`h-2 flex-1 ${getScoreBgColor(category.score)}`}
                            />
                            <span className="text-xs w-8 text-right">
                              {category.score > category.benchmark ? "+" : ""}
                              {category.score - category.benchmark}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Market Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col space-y-2">
                  <div className="text-sm font-medium">Industry Percentile</div>
                  <div className="text-xl font-bold">{analysis.industryComparison.percentile}%</div>
                  <div className="text-xs text-muted-foreground">
                    Outperforming {analysis.industryComparison.percentile}% of competitors
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="text-sm font-medium">Opportunity Score</div>
                  <div className="text-xl font-bold text-purple-600">
                    {analysis.competitiveAdvantage.opportunityScore}/100
                  </div>
                  <div className="text-xs text-muted-foreground">Potential for competitive advantage</div>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="text-sm font-medium">Technologies Detected</div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.technologiesDetected.length > 0 ? (
                      analysis.technologiesDetected.map((tech, index) => (
                        <Badge key={index} variant="outline" className="capitalize">
                          {tech}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No technologies detected</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                      Critical Issues
                    </h4>
                    {websiteScore.criticalIssues && websiteScore.criticalIssues.length > 0 ? (
                      <ul className="space-y-1">
                        {websiteScore.criticalIssues.map((issue, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-muted-foreground">No critical issues detected</div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Outdated Technologies</h4>
                    {websiteScore.outdatedTechnologies && websiteScore.outdatedTechnologies.length > 0 ? (
                      <ul className="space-y-1">
                        {websiteScore.outdatedTechnologies.map((tech, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="text-amber-500 mr-2">•</span>
                            {tech}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-muted-foreground">No outdated technologies detected</div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Security Vulnerabilities</h4>
                    {analysis.securityVulnerabilities.length > 0 ? (
                      <ul className="space-y-1">
                        {analysis.securityVulnerabilities.map((vulnerability, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {vulnerability}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-muted-foreground">No security vulnerabilities detected</div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Accessibility Issues</h4>
                    {analysis.accessibilityIssues.length > 0 ? (
                      <ul className="space-y-1">
                        {analysis.accessibilityIssues.map((issue, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="text-amber-500 mr-2">•</span>
                            {issue}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-muted-foreground">No accessibility issues detected</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "SEO", score: websiteScore.seo, icon: <Search className="h-4 w-4" /> },
                    { name: "Mobile", score: websiteScore.mobile, icon: <Smartphone className="h-4 w-4" /> },
                    { name: "Security", score: websiteScore.security, icon: <Shield className="h-4 w-4" /> },
                    { name: "Performance", score: websiteScore.performance, icon: <Zap className="h-4 w-4" /> },
                    { name: "Design", score: websiteScore.design, icon: <Layout className="h-4 w-4" /> },
                    { name: "Content", score: websiteScore.content, icon: <FileText className="h-4 w-4" /> },
                    { name: "Contact", score: websiteScore.contact, icon: <Phone className="h-4 w-4" /> },
                  ].map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          {metric.icon}
                          <span className="text-sm font-medium ml-2">{metric.name}</span>
                        </div>
                        <span className={`text-sm font-medium ${getScoreColor(metric.score)}`}>{metric.score}/100</span>
                      </div>
                      <Progress value={metric.score} className={`h-2 ${getScoreBgColor(metric.score)}`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-60 overflow-y-auto">
                {websiteScore.issues.length > 0 ? (
                  <ul className="space-y-1">
                    {websiteScore.issues.map((issue, index) => (
                      <li key={index} className="text-sm py-1 border-b border-gray-100 flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">No issues detected</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-md bg-blue-50">
                  <h3 className="text-lg font-medium text-blue-700 mb-2">Priority Improvements</h3>
                  <p className="text-sm text-blue-600 mb-4">
                    Based on our proprietary analysis, these improvements will yield the highest ROI:
                  </p>
                  <div className="space-y-3">
                    {analysis.competitiveAdvantage.improvementAreas.slice(0, 3).map((area, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{area.charAt(0).toUpperCase() + area.slice(1)} Optimization</h4>
                          <p className="text-sm text-gray-600">
                            {area === "mobile" && "Implement responsive design to improve mobile user experience"}
                            {area === "seo" && "Optimize meta tags and content structure for better search visibility"}
                            {area === "security" && "Upgrade security protocols to protect user data and build trust"}
                            {area === "performance" && "Improve page load speed for better user experience and SEO"}
                            {area === "design" && "Modernize design elements for better visual appeal and usability"}
                            {area === "content" && "Enhance content quality and relevance to engage visitors"}
                            {area === "contact" && "Make contact information more accessible to increase conversions"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="text-md font-medium mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                      Conversion Optimization
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Implementing our recommendations could increase your conversion rate from{" "}
                      <span className="font-medium">
                        {(analysis.conversionImpact.estimatedCurrentRate * 100).toFixed(2)}%
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">{(analysis.conversionImpact.potentialRate * 100).toFixed(2)}%</span>
                    </p>
                    <div className="text-sm text-gray-600">
                      Estimated impact:{" "}
                      <span className="font-medium text-green-600">
                        {formatCurrency(analysis.revenueImpact.annualRevenueLift)}
                      </span>{" "}
                      additional annual revenue
                    </div>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="text-md font-medium mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2 text-purple-500" />
                      Competitive Edge
                    </h3>
                    <p className="text-sm text-gray-600">
                      Your website currently ranks in the{" "}
                      <span className="font-medium">{analysis.industryComparison.percentile}th percentile</span> of your
                      industry. Our recommendations could position you among the top performers, giving you a
                      significant competitive advantage.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium mb-3">Implementation Plan</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <div className="bg-purple-100 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium">Technical Assessment</h4>
                          <p className="text-sm text-gray-600">Detailed audit and planning</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">Week 1</div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <div className="bg-purple-100 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                          2
                        </div>
                        <div>
                          <h4 className="font-medium">Design & Development</h4>
                          <p className="text-sm text-gray-600">Implementation of key improvements</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Weeks 2-{analysis.implementationComplexity.estimatedTimeInWeeks - 1}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <div className="bg-purple-100 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                          3
                        </div>
                        <div>
                          <h4 className="font-medium">Launch & Optimization</h4>
                          <p className="text-sm text-gray-600">Deployment and performance monitoring</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Week {analysis.implementationComplexity.estimatedTimeInWeeks}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button>
                <Share2 className="h-4 w-4 mr-2" />
                Share Analysis
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button variant="outline" className="mr-2">
          <ExternalLink className="h-4 w-4 mr-2" />
          View Full Report
        </Button>
        <Button>
          <ChevronRight className="h-4 w-4 mr-2" />
          Generate Website Proposal
        </Button>
      </div>
    </div>
  )
}
