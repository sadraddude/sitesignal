import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Star,
  Calendar,
  Download,
  Share2,
  Zap,
  FileText,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { BeforeAfterSlider } from "@/components/before-after-slider"

export default function BusinessDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the business data based on the ID
  const business = {
    id: params.id,
    name: "Tasty Bites Restaurant",
    address: "123 Main St, Chicago, IL 60601",
    phone: "(312) 555-1234",
    website: "https://example.com/tastybites",
    score: 32,
    designYear: 2010,
    designAge: 13,
    issues: {
      mobileFriendly: "bad" as const,
      pageSpeed: "bad" as const,
      seoBasics: "warning" as const,
      ssl: "warning" as const,
    },
    details: [
      "Website is not mobile-friendly",
      "Slow loading times (over 5 seconds)",
      "Missing meta descriptions and proper heading structure",
      "Outdated design with Flash elements",
      "Poor contrast and readability",
      "No clear call-to-action elements",
      "Images are not optimized for web",
    ],
    designIssues: [
      "Uses outdated table-based layout",
      "Small, hard-to-read text",
      "Cluttered design with too many elements",
      "Inconsistent color scheme",
      "No white space or visual hierarchy",
    ],
    recommendations: [
      "Implement responsive design for mobile devices",
      "Modernize with a clean, minimalist layout",
      "Improve page loading speed",
      "Add clear call-to-action buttons",
      "Optimize images and content for SEO",
    ],
    googleData: {
      rating: 4.2,
      userRatingsTotal: 156,
      placeUrl: "https://maps.google.com/?cid=12345",
      photos: [
        { reference: "photo1", width: 400, height: 300 },
        { reference: "photo2", width: 400, height: 300 },
        { reference: "photo3", width: 400, height: 300 },
        { reference: "photo4", width: 400, height: 300 },
      ],
    },
    notes: "Owner seemed interested when I called. Follow up next week.",
    lastContacted: "2023-05-10",
    status: "lead",
    hasMockup: true,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/results">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{business.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            <span>Contact</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Business Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <p className="text-sm text-muted-foreground">Contact and location details</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span>{business.address}</span>
            </div>

            {business.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <span>{business.phone}</span>
              </div>
            )}

            {business.website && (
              <div className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {business.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}

            {business.googleData?.rating && (
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                <span>
                  {business.googleData.rating} ({business.googleData.userRatingsTotal} reviews)
                </span>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Lead Status</h3>
              <Badge variant="outline" className="capitalize">
                {business.status}
              </Badge>
            </div>

            {business.lastContacted && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Last contacted: {business.lastContacted}</span>
              </div>
            )}

            {business.notes && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Notes</h3>
                <p className="text-sm text-muted-foreground">{business.notes}</p>
              </div>
            )}

            <Separator />

            <div className="pt-2 space-y-2">
              <Button className="w-full" asChild>
                <Link href={`/dashboard/business/${business.id}/contact`}>Contact Business</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/dashboard/business/${business.id}/edit`}>Edit Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Redesign Opportunity Card */}
          <Card className="border-2 border-purple-200 bg-purple-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="flex justify-between items-center">
                <span>Redesign Opportunity</span>
                <Badge className="bg-purple-600">High Value</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">This website has significant improvement potential</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="font-medium">Design feels like it's from: {business.designYear}</p>
                    <p className="text-sm text-muted-foreground">
                      ({business.designAge} years behind current design trends)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Website Quality Score</span>
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        business.score >= 70 ? "bg-green-500" : business.score >= 40 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                    >
                      {business.score}/100
                    </span>
                  </div>
                  <Progress
                    value={business.score}
                    className="h-2"
                    indicatorClassName={
                      business.score >= 70 ? "bg-green-500" : business.score >= 40 ? "bg-yellow-500" : "bg-red-500"
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Estimated Project Value</p>
                    <p className="text-xl font-bold text-purple-600">$3,500 - $5,000</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Potential ROI for Client</p>
                    <p className="text-xl font-bold text-purple-600">215%</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {!business.hasMockup ? (
                    <Button className="flex-1" asChild>
                      <Link href={`/dashboard/redesign?business=${business.id}`}>
                        <Zap className="mr-2 h-4 w-4" />
                        Generate Redesign Mockup
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button className="flex-1" asChild>
                        <Link href={`/dashboard/mockup/${business.id}`}>
                          <Zap className="mr-2 h-4 w-4" />
                          View Redesign Mockup
                        </Link>
                      </Button>
                    </>
                  )}
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/dashboard/proposal/${business.id}`}>
                      <FileText className="mr-2 h-4 w-4" />
                      Create Proposal
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Website Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle>Website Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">Detailed evaluation of the current website</p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="design">Design Issues</TabsTrigger>
                  <TabsTrigger value="technical">Technical Issues</TabsTrigger>
                  <TabsTrigger value="screenshot">Screenshot</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Mobile Friendly</h3>
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${business.issues.mobileFriendly === "good" ? "bg-green-500" : business.issues.mobileFriendly === "warning" ? "bg-yellow-500" : "bg-red-500"}`}
                        ></div>
                        <span className="capitalize">{business.issues.mobileFriendly}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Page Speed</h3>
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${business.issues.pageSpeed === "good" ? "bg-green-500" : business.issues.pageSpeed === "warning" ? "bg-yellow-500" : "bg-red-500"}`}
                        ></div>
                        <span className="capitalize">{business.issues.pageSpeed}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">SEO Basics</h3>
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${business.issues.seoBasics === "good" ? "bg-green-500" : business.issues.seoBasics === "warning" ? "bg-yellow-500" : "bg-red-500"}`}
                        ></div>
                        <span className="capitalize">{business.issues.seoBasics}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">SSL Certificate</h3>
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${business.issues.ssl === "good" ? "bg-green-500" : business.issues.ssl === "warning" ? "bg-yellow-500" : "bg-red-500"}`}
                        ></div>
                        <span className="capitalize">{business.issues.ssl}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {business.hasMockup && (
                    <div className="rounded-lg overflow-hidden border">
                      <BeforeAfterSlider
                        beforeImage="/before-1.png"
                        afterImage="/after-1.png"
                        beforeLabel="Current Website"
                        afterLabel="Redesign Concept"
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="design" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Design Issues</h3>
                    <ul className="space-y-2">
                      {business.designIssues.map((issue, index) => (
                        <li key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Recommendations</h3>
                    <ul className="space-y-2">
                      {business.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="technical" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Technical Issues</h3>
                    <ul className="space-y-2">
                      {business.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="screenshot" className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Current Website Screenshot</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <Image
                        src="/before-1.png"
                        alt={`Screenshot of ${business.name} website`}
                        width={800}
                        height={400}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Outreach Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Outreach Tools</CardTitle>
              <p className="text-sm text-muted-foreground">Resources to help you contact this business</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-purple-500" />
                    Email Templates
                  </h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <span className="truncate">Initial Outreach with Mockup</span>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <span className="truncate">Website Audit Findings</span>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <span className="truncate">ROI Focused Pitch</span>
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-purple-500" />
                    Call Scripts
                  </h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <span className="truncate">Initial Phone Contact</span>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <span className="truncate">Follow-up After Email</span>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <span className="truncate">Appointment Setting</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
