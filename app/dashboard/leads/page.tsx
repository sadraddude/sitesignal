"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Download, ExternalLink, Star, Phone, Mail } from "lucide-react"

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [scoreFilter, setScoreFilter] = useState("all")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Saved Leads</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button asChild>
            <Link href="/dashboard/search">
              <Search className="mr-2 h-4 w-4" /> Find New Leads
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lead Management</CardTitle>
          <p className="text-sm text-muted-foreground">Organize and track your potential clients</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New Lead</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="meeting">Meeting Scheduled</SelectItem>
                  <SelectItem value="proposal">Proposal Sent</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Website Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="very-poor">Very Poor (0-20)</SelectItem>
                  <SelectItem value="poor">Poor (21-40)</SelectItem>
                  <SelectItem value="average">Average (41-60)</SelectItem>
                  <SelectItem value="good">Good (61-80)</SelectItem>
                  <SelectItem value="excellent">Excellent (81-100)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Leads (36)</TabsTrigger>
              <TabsTrigger value="new">New (12)</TabsTrigger>
              <TabsTrigger value="contacted">Contacted (8)</TabsTrigger>
              <TabsTrigger value="meeting">Meeting (6)</TabsTrigger>
              <TabsTrigger value="proposal">Proposal (5)</TabsTrigger>
              <TabsTrigger value="won">Won (3)</TabsTrigger>
              <TabsTrigger value="lost">Lost (2)</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                <LeadItem
                  name="Tasty Bites Restaurant"
                  website="tastybites.com"
                  address="123 Main St, Chicago, IL"
                  phone="(312) 555-1234"
                  score={32}
                  status="new"
                  lastActivity="Saved 2 days ago"
                />
                <LeadItem
                  name="Smith & Sons Plumbing"
                  website="smithplumbing.com"
                  address="456 Oak Ave, Chicago, IL"
                  phone="(312) 555-5678"
                  score={48}
                  status="contacted"
                  lastActivity="Called yesterday"
                />
                <LeadItem
                  name="Bright Smile Dental"
                  website="brightsmile.com"
                  address="789 Pine St, Chicago, IL"
                  phone="(312) 555-9012"
                  score={28}
                  status="meeting"
                  lastActivity="Meeting scheduled for tomorrow"
                />
                <LeadItem
                  name="Green Thumb Landscaping"
                  website="greenthumb.com"
                  address="101 Maple Dr, Chicago, IL"
                  phone="(312) 555-3456"
                  score={42}
                  status="proposal"
                  lastActivity="Proposal sent 3 days ago"
                />
                <LeadItem
                  name="Perfect Fit Gym"
                  website="perfectfit.com"
                  address="202 Cedar Ln, Chicago, IL"
                  phone="(312) 555-7890"
                  score={35}
                  status="won"
                  lastActivity="Contract signed last week"
                />
              </div>
            </TabsContent>

            <TabsContent value="new">
              <div className="space-y-4">
                <LeadItem
                  name="Tasty Bites Restaurant"
                  website="tastybites.com"
                  address="123 Main St, Chicago, IL"
                  phone="(312) 555-1234"
                  score={32}
                  status="new"
                  lastActivity="Saved 2 days ago"
                />
                {/* More new leads would be listed here */}
              </div>
            </TabsContent>

            {/* Other tabs would have similar content */}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function LeadItem({
  name,
  website,
  address,
  phone,
  score,
  status,
  lastActivity,
}: {
  name: string
  website: string
  address: string
  phone: string
  score: number
  status: "new" | "contacted" | "meeting" | "proposal" | "won" | "lost"
  lastActivity: string
}) {
  const getScoreColor = () => {
    if (score <= 20) return "bg-red-100 text-red-800"
    if (score <= 40) return "bg-orange-100 text-orange-800"
    if (score <= 60) return "bg-yellow-100 text-yellow-800"
    if (score <= 80) return "bg-green-100 text-green-800"
    return "bg-emerald-100 text-emerald-800"
  }

  const getStatusColor = () => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "contacted":
        return "bg-purple-100 text-purple-800"
      case "meeting":
        return "bg-indigo-100 text-indigo-800"
      case "proposal":
        return "bg-amber-100 text-amber-800"
      case "won":
        return "bg-green-100 text-green-800"
      case "lost":
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = () => {
    switch (status) {
      case "new":
        return "New Lead"
      case "contacted":
        return "Contacted"
      case "meeting":
        return "Meeting Scheduled"
      case "proposal":
        return "Proposal Sent"
      case "won":
        return "Won"
      case "lost":
        return "Lost"
    }
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor()}`}>Score: {score}/100</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>{getStatusLabel()}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              <span>{website}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{phone}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{lastActivity}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            <span>Contact</span>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/dashboard/business/${encodeURIComponent(name)}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
