import Link from "next/link"
import { currentUser } from "@clerk/nextjs/server"; // Use server-side Clerk helper
import { Button } from "@/components/ui/button"
import { Search, AlertTriangle } from "lucide-react"
import { getSavedLeads } from "./actions" // Keep action import
import { Lead } from "@prisma/client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card" // Import Card components
import { format } from 'date-fns';

// Make the component async and remove "use client"
export default async function DashboardPage() {
  // Fetch user and leads data directly on the server
  const user = await currentUser();
  let leads: Lead[] = [];
  let fetchError: string | null = null;

  try {
    // Server action call works directly here
    leads = await getSavedLeads();
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    fetchError = "Failed to load leads. Please try again later.";
  }

  const recentLeads = leads.slice(0, 3); // Get top 3 recent leads

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.firstName || 'User'}</h1>
          <p className="text-muted-foreground">Here's your lead generation dashboard.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/search">
            <Search className="mr-2 h-4 w-4" /> Find New Leads
          </Link>
        </Button>
      </div>

      {/* Error Display */}
      {fetchError && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader className="flex flex-row items-center space-x-2 pb-2">
             <AlertTriangle className="h-4 w-4 text-destructive" />
             <CardTitle className="text-sm font-medium text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">{fetchError}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards - Only show if no error */}
      {!fetchError && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Saved Leads</CardTitle>
              {/* Icon suggestion: <Users className="h-4 w-4 text-muted-foreground" /> */}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
              <p className="text-xs text-muted-foreground">
                Leads you have saved for analysis.
              </p>
            </CardContent>
          </Card>
          {/* Add more stats cards here if needed later (e.g., average score) */}
        </div>
      )}

       {/* Recent Leads Section - Only show if no error and leads exist */}
       {!fetchError && leads.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Leads</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentLeads.map((lead) => (
              <Card key={lead.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{lead.businessName}</CardTitle>
                  <CardDescription>{lead.address || 'No address available'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {lead.website && (
                     <p className="text-sm">
                      <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                        {lead.website}
                      </a>
                    </p>
                  )}
                   <p className="text-sm text-muted-foreground">Saved: {format(new Date(lead.savedAt), 'PPP')}</p>
                   {/* Optional: Add score here later */}
                </CardContent>
                {/* Add View/Delete actions in CardFooter later if desired */}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Leads Table - Only show if no error */}
      {!fetchError && (
        <Card>
          <CardHeader>
            <CardTitle>All Saved Leads</CardTitle>
            <CardDescription>
                {leads.length === 0
                    ? "You haven't saved any leads yet. Start by finding new leads!"
                    : "A comprehensive list of all your saved leads."
                }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leads.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Saved On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.businessName}</TableCell>
                      <TableCell>{lead.address || 'N/A'}</TableCell>
                      <TableCell>
                        {lead.website ? (
                          <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                            {lead.website}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(lead.savedAt), 'PP')}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="mr-2" disabled>View</Button>
                        <Button variant="destructive" size="sm" disabled>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
                 <p className="text-sm text-muted-foreground">No leads saved yet.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
