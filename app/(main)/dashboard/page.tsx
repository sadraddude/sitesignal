"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, John</h1>
          <p className="text-muted-foreground">Here's what's happening with your leads today</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/search">
            <Search className="mr-2 h-4 w-4" /> Find New Leads
          </Link>
        </Button>
      </div>

      {/* Rest of the dashboard content */}
      {/* ... */}
    </div>
  )
}
