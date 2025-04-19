"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { WebsiteScore } from "@/lib/types"
import { Info, AlertTriangle, CheckCircle, XCircle, ExternalLink, Download, Wand2 } from "lucide-react"
import { AdvancedAnalysisDashboard } from "@/components/advanced-analysis-dashboard"
import { AIMockupGenerator } from "@/components/ai-mockup-generator"
import { CompetitorAnalysis } from "@/components/competitor-analysis"

interface WebsiteScoreDetailsProps {
  score: WebsiteScore
  businessName: string
}

export function WebsiteScoreDetails({ score, businessName }: WebsiteScoreDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview")

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

  const getStatusIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-500" />
    if (score >= 60) return <Info className="h-4 w-4 text-yellow-500" />
    if (score >= 40) return <AlertTriangle className="h-4 w-4 text-orange-500" />
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Website Analysis for {businessName}</DialogTitle>
          <DialogDescription>
            Comprehensive analysis of website performance, issues, and improvement opportunities
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Analysis</TabsTrigger>
            <TabsTrigger value="mockup">AI Redesign</TabsTrigger>
            <TabsTrigger value="competitors">Competitor Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Overall Score</h3>
                <div className="flex items-center space-x-4">
                  <div className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>{score.overall}</div>
                  <div className="flex-1">
                    <Progress value={score.overall} className={`h-2 ${getScoreBgColor(score.overall)}`} />
                    <p className="text-sm mt-1 text-muted-foreground">
                      {score.overall >= 80
                        ? "Excellent website performance"
                        : score.overall >= 60
                          ? "Good website with some improvements needed"
                          : score.overall >= 40
                            ? "Significant improvements needed"
                            : "Critical issues require immediate attention"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Website URL</h3>
                <div className="flex items-center space-x-2">
                  <a
                    href={score.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    {score.url}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </div>
                {score.lastUpdated && (
                  <p className="text-sm mt-1 text-muted-foreground">Last updated: {score.lastUpdated}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">SEO</h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(score.seo)}
                  <div className={`font-medium ${getScoreColor(score.seo)}`}>{score.seo}/100</div>
                  <Progress value={score.seo} className={`h-2 flex-1 ${getScoreBgColor(score.seo)}`} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Mobile Friendliness</h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(score.mobile)}
                  <div className={`font-medium ${getScoreColor(score.mobile)}`}>{score.mobile}/100</div>
                  <Progress value={score.mobile} className={`h-2 flex-1 ${getScoreBgColor(score.mobile)}`} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Security</h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(score.security)}
                  <div className={`font-medium ${getScoreColor(score.security)}`}>{score.security}/100</div>
                  <Progress value={score.security} className={`h-2 flex-1 ${getScoreBgColor(score.security)}`} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Performance</h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(score.performance)}
                  <div className={`font-medium ${getScoreColor(score.performance)}`}>{score.performance}/100</div>
                  <Progress value={score.performance} className={`h-2 flex-1 ${getScoreBgColor(score.performance)}`} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Design</h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(score.design)}
                  <div className={`font-medium ${getScoreColor(score.design)}`}>{score.design}/100</div>
                  <Progress value={score.design} className={`h-2 flex-1 ${getScoreBgColor(score.design)}`} />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Content</h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(score.content)}
                  <div className={`font-medium ${getScoreColor(score.content)}`}>{score.content}/100</div>
                  <Progress value={score.content} className={`h-2 flex-1 ${getScoreBgColor(score.content)}`} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Issues Detected</h3>
              {score.criticalIssues && score.criticalIssues.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium mb-1 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                    Critical Issues
                  </h4>
                  <ul className="space-y-1">
                    {score.criticalIssues.map((issue, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {score.outdatedTechnologies && score.outdatedTechnologies.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium mb-1">Outdated Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {score.outdatedTechnologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="bg-amber-50">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-1">All Issues</h4>
                <ul className="space-y-1 max-h-40 overflow-y-auto">
                  {score.issues.map((issue, index) => (
                    <li key={index} className="text-sm flex items-start">
                      <span className="text-gray-400 mr-2">•</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button onClick={() => setActiveTab("advanced")}>
                <Wand2 className="mr-2 h-4 w-4" />
                Advanced Analysis
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-4">
            <AdvancedAnalysisDashboard
              websiteScore={score}
              businessName={businessName}
              industry="default"
              businessSize="small"
            />
          </TabsContent>

          <TabsContent value="mockup" className="mt-4">
            <AIMockupGenerator businessName={businessName} websiteScore={score} websiteUrl={score.url} />
          </TabsContent>

          <TabsContent value="competitors" className="mt-4">
            <CompetitorAnalysis businessName={businessName} websiteScore={score} websiteUrl={score.url} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
