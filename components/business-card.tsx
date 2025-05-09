"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Star,
  Calendar,
  Bookmark,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { Business } from "@/lib/types"
import { saveLeadAction } from "@/app/(main)/dashboard/actions"
import { cn } from "@/lib/utils"

// Helper function to convert score to status
const getScoreStatus = (score: number | null | undefined): "good" | "warning" | "bad" => {
  if (score === null || score === undefined) return "bad"; // Treat null/undefined as bad
  if (score >= 70) return "good";
  if (score >= 40) return "warning";
  return "bad";
};

export function BusinessCard({ business }: { business: Business }) {
  const [expanded, setExpanded] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSaveLead = async () => {
    if (isSaved || isSaving) return;

    setIsSaving(true);
    try {
      const leadData = {
        businessName: business.name,
        address: business.address,
        phone: business.phone,
        website: business.website,
        overallScore: business.websiteScore?.overall ?? null,
        improvementScore: business.websiteScore?.improvementScore ?? null,
        issuesJson: business.websiteScore?.issues ? JSON.stringify(business.websiteScore.issues) : null,
        criticalIssuesJson: business.websiteScore?.criticalIssues ? JSON.stringify(business.websiteScore.criticalIssues) : null,
        outdatedTechJson: business.websiteScore?.outdatedTechnologies ? JSON.stringify(business.websiteScore.outdatedTechnologies) : null,
      };

      await saveLeadAction(leadData);

      setIsSaved(true);
      toast({
        title: "Lead Saved Successfully",
        description: `${business.name} has been added to your saved leads.`,
      });

    } catch (error) {
      console.error("Failed to save lead:", error);
      toast({
        title: "Error Saving Lead",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Function to get a Google Places photo URL
  const getPhotoUrl = (photoReference: string, maxWidth = 400) => {
    return `/api/places-photo?reference=${photoReference}&maxwidth=${maxWidth}`
  }

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Column - Business Info */}
          <div className="md:w-1/3">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{business.name}</h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleSaveLead}
                disabled={isSaving || isSaved}
                aria-label={isSaved ? "Lead Saved" : "Save Lead"}
              >
                {isSaving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Bookmark className={`h-5 w-5 ${isSaved ? "fill-blue-600 text-blue-600" : ""}`} />
                )}
              </Button>
            </div>

            <p className="text-gray-600 mb-4">{business.address}</p>

            {business.phone && <p className="text-gray-600 mb-4">{business.phone}</p>}

            {business.website && (
              <div className="mb-4">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Visit Website
                  </a>
                </Button>
              </div>
            )}

            {business.googleData?.rating && (
              <div className="flex items-center gap-1 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(business.googleData!.rating!)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({business.googleData.userRatingsTotal} reviews)</span>
              </div>
            )}

            {/* Website Score */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Website Quality</span>
                <Badge
                  className={cn(
                    "font-semibold",
                    business.websiteScore && business.websiteScore.overall >= 70
                      ? "border-green-600 text-green-700 bg-green-100"
                      : business.websiteScore && business.websiteScore.overall >= 40
                      ? "border-yellow-600 text-yellow-700 bg-yellow-100"
                      : business.websiteScore
                      ? "border-red-600 text-red-700 bg-red-100"
                      : "border-gray-400 text-gray-500 bg-gray-100"
                  )}
                >
                  {business.websiteScore ? `${business.websiteScore.overall}/100` : 'N/A'}
                </Badge>
              </div>
              <Progress
                value={business.websiteScore?.overall ?? 0}
                className="h-2"
                indicatorClassName={
                  business.websiteScore && business.websiteScore.overall >= 70 ? "bg-green-500" : business.websiteScore && business.websiteScore.overall >= 40 ? "bg-yellow-500" : "bg-red-500"
                }
              />
            </div>

            {/* Design Age */}
            {business.designAge && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">
                    Design feels like it's from {business.designAge.designYear}
                  </span>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  ({business.designAge.designAge} years behind current trends)
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Analysis & Actions */}
          <div className="md:w-2/3">
            <Tabs defaultValue="issues">
              <TabsList className="mb-4">
                <TabsTrigger value="issues">Issues</TabsTrigger>
                <TabsTrigger value="screenshot">Screenshot</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="issues">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <IssueItem title="Mobile Friendly" status={getScoreStatus(business.websiteScore?.mobile)} />
                  <IssueItem title="Page Speed" status={getScoreStatus(business.websiteScore?.performance)} />
                  <IssueItem title="SEO Basics" status={getScoreStatus(business.websiteScore?.seo)} />
                  <IssueItem title="SSL Certificate" status={getScoreStatus(business.websiteScore?.security)} />
                </div>

                {expanded && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Detailed Analysis (Issues)</h4>
                      {business.websiteScore?.issues && business.websiteScore.issues.length > 0 ? (
                        <ul className="space-y-2">
                          {business.websiteScore.issues.map((detail, index) => (
                            <li key={index} className="flex items-start gap-2 bg-red-50 p-2 rounded-lg">
                              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                       ) : (
                         <p className="text-sm text-gray-500 italic">No specific issues listed.</p>
                       )}
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="screenshot">
                {business.designAge?.screenshot ? (
                  <div className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <Image
                        src={business.designAge.screenshot || "/placeholder.svg"}
                        alt={`Screenshot of ${business.name} website`}
                        width={800}
                        height={400}
                        className="w-full h-auto"
                      />
                    </div>
                    {business.designAge.analysis && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Design Analysis</h4>
                        <p className="text-sm text-gray-600">{business.designAge.analysis}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600">No screenshot available for this website</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="details">
                <div className="space-y-4">
                  {business.details && business.details.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">General Details/Issues</h4>
                      <ul className="space-y-2">
                        {business.details.map((detail, index) => (
                          <li key={index} className="flex items-start gap-2 bg-yellow-50 p-2 rounded-lg">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {business.designAge && (
                    <>
                      {business.designAge.issues && business.designAge.issues.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Design Issues</h4>
                          <ul className="space-y-2">
                            {business.designAge.issues.map((issue, index) => (
                              <li key={index} className="flex items-start gap-2 bg-red-50 p-2 rounded-lg">
                                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {business.designAge.recommendations && business.designAge.recommendations.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Recommendations</h4>
                          <ul className="space-y-2">
                            {business.designAge.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2 bg-green-50 p-2 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  {business.googleData?.photos && business.googleData.photos.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Business Photos</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {business.googleData.photos.slice(0, 3).map((photo, index) => (
                          <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                            <Image
                              src={getPhotoUrl(photo.reference) || "/placeholder.svg"}
                              alt={`${business.name} photo ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show More Details
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function IssueItem({ title, status }: { title: string; status: "good" | "warning" | "bad" }) {
  const Icon = status === "good" ? CheckCircle : status === "warning" ? AlertTriangle : XCircle
  const color = status === "good" ? "text-green-600" : status === "warning" ? "text-yellow-600" : "text-red-600"

  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-5 w-5 ${color}`} />
      <span className="text-sm">{title}</span>
    </div>
  )
}
