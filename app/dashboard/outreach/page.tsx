"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Send, Plus, Edit, Copy, Trash, Check, Filter, Download, Users, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function OutreachPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("initial-mockup")
  const [selectedLeads, setSelectedLeads] = useState<string[]>(["lead-1", "lead-3"])
  const [emailSubject, setEmailSubject] = useState("Your website redesign concept is ready")
  const [emailContent, setEmailContent] = useState(`Hi {{business_name}},

I noticed your website at {{website_url}} and created a free redesign concept to show you how a modern update could look.

The current design appears to be from around {{design_year}} and has a few issues that might be affecting your business:

{{website_issues}}

I've attached a before/after mockup so you can see the potential improvement. Would you be open to a quick 15-minute call to discuss how a website update could help increase your leads and sales?

Best regards,
{{your_name}}
{{your_company}}`)

  const [includeMockup, setIncludeMockup] = useState(true)
  const [includeAudit, setIncludeAudit] = useState(true)
  const [scheduleFollowup, setScheduleFollowup] = useState(true)
  const [isSending, setIsSending] = useState(false)

  const handleSendCampaign = () => {
    setIsSending(true)
    // Simulate API call
    setTimeout(() => {
      setIsSending(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Outreach Campaigns</h1>
      </div>

      <Tabs defaultValue="new-campaign">
        <TabsList className="w-full">
          <TabsTrigger value="new-campaign">New Campaign</TabsTrigger>
          <TabsTrigger value="active-campaigns">Active Campaigns (3)</TabsTrigger>
          <TabsTrigger value="completed-campaigns">Completed Campaigns (12)</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="new-campaign" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Outreach Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Email Content */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template">Email Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger id="template">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="initial-mockup">Initial Outreach with Mockup</SelectItem>
                        <SelectItem value="website-audit">Website Audit Findings</SelectItem>
                        <SelectItem value="roi-focused">ROI Focused Pitch</SelectItem>
                        <SelectItem value="follow-up">Follow-up Email</SelectItem>
                        <SelectItem value="custom">Custom Template</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Email Subject</Label>
                    <Input id="subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="content">Email Content</Label>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      id="content"
                      value={emailContent}
                      onChange={(e) => setEmailContent(e.target.value)}
                      rows={12}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Use variables like {"{{"}'business_name{"}}"} to personalize your emails.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="include-mockup" className="cursor-pointer">
                        Include Redesign Mockup
                      </Label>
                      <Switch id="include-mockup" checked={includeMockup} onCheckedChange={setIncludeMockup} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="include-audit" className="cursor-pointer">
                        Include Website Audit
                      </Label>
                      <Switch id="include-audit" checked={includeAudit} onCheckedChange={setIncludeAudit} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="schedule-followup" className="cursor-pointer">
                        Schedule Follow-up (3 days)
                      </Label>
                      <Switch id="schedule-followup" checked={scheduleFollowup} onCheckedChange={setScheduleFollowup} />
                    </div>
                  </div>
                </div>

                {/* Right Column - Lead Selection */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Selected Leads</h3>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Leads
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">3 Leads Selected</span>
                        <Badge variant="outline">With Mockups</Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash className="h-4 w-4 mr-1" />
                        Clear All
                      </Button>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      <LeadSelectionItem
                        name="Tasty Bites Restaurant"
                        website="tastybites.com"
                        score={32}
                        hasMockup={true}
                        isSelected={true}
                      />
                      <LeadSelectionItem
                        name="Smith & Sons Plumbing"
                        website="smithplumbing.com"
                        score={48}
                        hasMockup={false}
                        isSelected={false}
                      />
                      <LeadSelectionItem
                        name="Bright Smile Dental"
                        website="brightsmile.com"
                        score={28}
                        hasMockup={true}
                        isSelected={true}
                      />
                      <LeadSelectionItem
                        name="Green Thumb Landscaping"
                        website="greenthumb.com"
                        score={42}
                        hasMockup={false}
                        isSelected={false}
                      />
                      <LeadSelectionItem
                        name="Perfect Fit Gym"
                        website="perfectfit.com"
                        score={35}
                        hasMockup={true}
                        isSelected={true}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Campaign Summary</h3>
                    <div className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Leads:</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">With Redesign Mockups:</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">With Website Audit:</span>
                        <span className="font-medium">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Scheduled Follow-ups:</span>
                        <span className="font-medium">3</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4" onClick={handleSendCampaign} disabled={isSending}>
                    {isSending ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Sending Campaign...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Campaign
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active-campaigns" className="space-y-6 pt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Active Campaigns</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <CampaignCard
              name="Restaurant Outreach"
              date="Started 2 days ago"
              totalLeads={12}
              openRate={58}
              responseRate={25}
              status="active"
            />
            <CampaignCard
              name="Healthcare Providers"
              date="Started 5 days ago"
              totalLeads={8}
              openRate={75}
              responseRate={38}
              status="active"
            />
            <CampaignCard
              name="Local Retail Stores"
              date="Started 1 week ago"
              totalLeads={15}
              openRate={67}
              responseRate={20}
              status="active"
            />
          </div>
        </TabsContent>

        <TabsContent value="completed-campaigns" className="space-y-6 pt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Completed Campaigns</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <CampaignCard
              name="Home Services"
              date="Completed 2 weeks ago"
              totalLeads={18}
              openRate={72}
              responseRate={33}
              status="completed"
              results={{
                meetings: 4,
                proposals: 3,
                closed: 2,
              }}
            />
            <CampaignCard
              name="Professional Services"
              date="Completed 1 month ago"
              totalLeads={24}
              openRate={65}
              responseRate={29}
              status="completed"
              results={{
                meetings: 5,
                proposals: 4,
                closed: 3,
              }}
            />
            <CampaignCard
              name="Fitness & Wellness"
              date="Completed 2 months ago"
              totalLeads={10}
              openRate={80}
              responseRate={40}
              status="completed"
              results={{
                meetings: 3,
                proposals: 2,
                closed: 2,
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6 pt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Email Templates</h2>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Create Template
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <TemplateCard
              name="Initial Outreach with Mockup"
              description="First contact email that includes a redesign mockup"
              lastEdited="2 days ago"
              conversionRate={32}
            />
            <TemplateCard
              name="Website Audit Findings"
              description="Detailed breakdown of website issues and improvement opportunities"
              lastEdited="1 week ago"
              conversionRate={28}
            />
            <TemplateCard
              name="ROI Focused Pitch"
              description="Emphasizes business benefits and return on investment"
              lastEdited="2 weeks ago"
              conversionRate={35}
            />
            <TemplateCard
              name="Follow-up Email"
              description="Gentle reminder for leads who haven't responded"
              lastEdited="3 days ago"
              conversionRate={24}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LeadSelectionItem({
  name,
  website,
  score,
  hasMockup,
  isSelected,
}: {
  name: string
  website: string
  score: number
  hasMockup: boolean
  isSelected: boolean
}) {
  const [selected, setSelected] = useState(isSelected)

  return (
    <div className={`border-b p-3 flex justify-between items-center ${selected ? "bg-purple-50" : ""}`}>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <Switch checked={selected} onCheckedChange={setSelected} />
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{website}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-800">Score: {score}</span>
            {hasMockup && <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-800">Has Mockup</span>}
          </div>
        </div>
      </div>
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/dashboard/business/${encodeURIComponent(name)}`}>View</Link>
      </Button>
    </div>
  )
}

function CampaignCard({
  name,
  date,
  totalLeads,
  openRate,
  responseRate,
  status,
  results,
}: {
  name: string
  date: string
  totalLeads: number
  openRate: number
  responseRate: number
  status: "active" | "completed"
  results?: {
    meetings: number
    proposals: number
    closed: number
  }
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-lg">{name}</h3>
              <Badge variant={status === "active" ? "default" : "secondary"} className="capitalize">
                {status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{date}</p>
            <p className="text-sm mt-1">
              <span className="font-medium">{totalLeads}</span> leads contacted
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Open Rate</p>
              <div className="flex items-center gap-2">
                <Progress value={openRate} className="h-2 w-24" />
                <span className="font-medium">{openRate}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Response Rate</p>
              <div className="flex items-center gap-2">
                <Progress value={responseRate} className="h-2 w-24" />
                <span className="font-medium">{responseRate}%</span>
              </div>
            </div>

            {status === "completed" && results && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Results</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-3 w-3 text-blue-500" />
                    <span>{results.meetings} meetings</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Mail className="h-3 w-3 text-green-500" />
                    <span>{results.proposals} proposals</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Check className="h-3 w-3 text-purple-500" />
                    <span>{results.closed} closed</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversion</p>
                  <p className="font-medium text-lg">{Math.round((results.closed / totalLeads) * 100)}%</p>
                  <p className="text-xs text-muted-foreground">Leads to clients</p>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            {status === "active" && (
              <Button size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TemplateCard({
  name,
  description,
  lastEdited,
  conversionRate,
}: {
  name: string
  description: string
  lastEdited: string
  conversionRate: number
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs text-muted-foreground">Last edited: {lastEdited}</p>
              <Badge variant="outline" className="text-xs">
                {conversionRate}% conversion
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
