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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { Business } from "@/lib/types"

export function BusinessCard({ business }: { business: Business }) {
  const [expanded, setExpanded] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const { toast } = useToast()

  const toggleSaved = () => {
    setIsSaved(!isSaved)
    toast({
      title: isSaved ? "Removed from saved leads" : "Added to saved leads",
      description: isSaved
        ? `${business.name} has been removed from your saved leads`
        : `${business.name} has been added to your saved leads`,
    })
  }

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
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleSaved}>
                <Bookmark className={`h-5 w-5 ${isSaved ? "fill-blue-600 text-blue-600" : ""}`} />
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
                <Badge variant={business.score >= 70 ? "success" : business.score >= 40 ? "warning" : "destructive"}>
                  {business.score}/100
                </Badge>
              </div>
              <Progress
                value={business.score}
                className="h-2"
                indicatorClassName={
                  business.score >= 70 ? "bg-green-500" : business.score >= 40 ? "bg-yellow-500" : "bg-red-500"
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
                  <IssueItem title="Mobile Friendly" status={business.issues.mobileFriendly} />
                  <IssueItem title="Page Speed" status={business.issues.pageSpeed} />
                  <IssueItem title="SEO Basics" status={business.issues.seoBasics} />
                  <IssueItem title="SSL Certificate" status={business.issues.ssl} />
                </div>

                {expanded && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Detailed Analysis</h4>
                      <ul className="space-y-2">
                        {business.details.map((detail, index) => (
                          <li key={index} className="flex items-start gap-2 bg-red-50 p-2 rounded-lg">
                            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
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
                  {business.designAge && (
                    <>
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
                    Show Details
                  </>
                )}
              </Button>

              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={toggleSaved}>
                  {isSaved ? "Remove Lead" : "Save Lead"}
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/dashboard/business/${business.id}`}>View Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function IssueItem({ title, status }: { title: string; status: "good" | "warning" | "bad" }) {
  const icons = {
    good: <CheckCircle className="h-5 w-5 text-green-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    bad: <XCircle className="h-5 w-5 text-red-500" />,
  }

  const backgrounds = {
    good: "bg-green-50",
    warning: "bg-amber-50",
    bad: "bg-red-50",
  }

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${backgrounds[status]}`}>
      {icons[status]}
      <span className="text-sm font-medium">{title}</span>
    </div>
  )
}
