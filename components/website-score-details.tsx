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
import { Info, AlertTriangle, CheckCircle, XCircle, ExternalLink, Download, Wand2, Printer, Copy } from "lucide-react"
import { AdvancedAnalysisDashboard } from "@/components/advanced-analysis-dashboard"
import { AIMockupGenerator } from "@/components/ai-mockup-generator"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
// import { CompetitorAnalysis } from "@/components/competitor-analysis"

interface WebsiteScoreDetailsProps {
  score: WebsiteScore
  businessName: string
  onEmailGenerated?: (subject: string, emailBody: string) => void;
}

export function WebsiteScoreDetails({ score, businessName, onEmailGenerated }: WebsiteScoreDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  // State for email generation
  const [generatedSubject, setGeneratedSubject] = useState<string | null>(null);
  const [generatedEmailBody, setGeneratedEmailBody] = useState<string | null>(null);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

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

  // Function to handle JSON export
  const handleExportJson = () => {
    const exportData = {
      businessName,
      analysisDate: new Date().toISOString(),
      scoreDetails: score,
    };
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const filename = `website-analysis-${businessName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Function to handle email generation
  const handleGenerateEmail = async () => {
    setIsGeneratingEmail(true);
    setGeneratedSubject(null);
    setGeneratedEmailBody(null);
    setGenerationError(null);
    console.log("Generating email for:", businessName, score);

    try {
      const response = await fetch("/api/generate-outreach-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          businessName: businessName, 
          websiteUrl: score.url, // Pass the URL
          score: score // Pass the full score object
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.details || "Failed to generate email from API");
      }

      setGeneratedSubject(result.subjectLine);
      setGeneratedEmailBody(result.emailBody);
      
      // Call the callback prop if it exists
      if (onEmailGenerated && result.subjectLine && result.emailBody) {
        onEmailGenerated(result.subjectLine, result.emailBody);
      }

    } catch (err) {
      console.error("Error calling email generation API:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during generation.";
      setGenerationError(errorMessage);
      setGeneratedSubject(null);
      setGeneratedEmailBody(null);
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  // Function to copy email to clipboard
  const copyToClipboard = () => {
    if (generatedEmailBody) { // Now copies only the body
      let textToCopy = "";
      if (generatedSubject) {
        textToCopy += `Subject: ${generatedSubject}\n\n`;
      }
      textToCopy += generatedEmailBody;
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Optional: Show a success message (e.g., using toast)
        alert("Email (Subject and Body) copied to clipboard!"); 
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert("Failed to copy email.");
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="printable-report-area max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="print:hidden">
          <DialogTitle>Website Analysis for {businessName}</DialogTitle>
          <DialogDescription>
            Comprehensive analysis of website performance, issues, and improvement opportunities
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Analysis</TabsTrigger>
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
                  {score?.issues && Array.isArray(score.issues) && score.issues.length > 0 ? (
                    score.issues.map((issue, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="text-gray-400 mr-2">•</span>
                        {issue}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-muted-foreground italic">No general issues detected.</li>
                  )}
                </ul>
              </div>
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
        </Tabs>

        <div className="pt-6 mt-4 border-t flex justify-end space-x-2">
          {/* Add Generate Email Button */}
          <Button onClick={handleGenerateEmail} disabled={isGeneratingEmail}>
            {isGeneratingEmail ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
            ) : (
              <><Wand2 className="mr-2 h-4 w-4" /> Generate Email</>
            )}
          </Button>
          <Button variant="outline" onClick={handleExportJson}> 
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>

        {/* Display Area for Generated Email/Loading/Error */}
        <div className="mt-4 space-y-2">
          {isGeneratingEmail && (
            <div className="flex items-center justify-center p-4 border rounded-md bg-muted/50">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mr-2" />
              <span className="text-sm text-muted-foreground">Generating AI outreach email...</span>
            </div>
          )}
          {generationError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{generationError}</AlertDescription>
            </Alert>
          )}
          {generatedEmailBody && !isGeneratingEmail && (
            <div className="space-y-2">
              <Label htmlFor="generated-subject" className="text-sm font-medium">Generated Subject</Label>
              <Input 
                id="generated-subject"
                readOnly 
                value={generatedSubject || ""} 
              />
              <Label htmlFor="generated-email-body" className="text-sm font-medium">Generated Email Body</Label>
              <div className="relative">
                <Textarea 
                  id="generated-email-body"
                  readOnly 
                  value={generatedEmailBody || ""} 
                  rows={10}
                  className="pr-10" // Add padding for the copy button
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-7 w-7" 
                  onClick={copyToClipboard}
                  title="Copy Subject and Body to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

      </DialogContent>
    </Dialog>
  )
}
