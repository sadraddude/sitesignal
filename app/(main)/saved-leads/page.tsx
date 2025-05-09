'use client';

import { useState, useEffect, useMemo } from 'react';
import { Lead } from '@prisma/client';
import { getSavedLeads, deleteLeadAction } from '../dashboard/actions'; // Adjust path as needed
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trash2, AlertTriangle, ExternalLink, Info, Eye, ArrowUpDown, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { toast } from 'sonner'; // Using sonner for toasts
import { WebsiteScoreDetails } from "@/components/website-score-details"; // Import the details component
import type { WebsiteScore as WebsiteScoreType } from "@/lib/types"; // Import the score type

// Helper function to safely parse JSON strings
const safeJsonParse = (jsonString: string | null | undefined): any[] => { // Return empty array on failure
  if (!jsonString) return [];
  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : []; // Ensure it's an array
  } catch (e) {
    console.error("Failed to parse JSON:", e);
    return [];
  }
};

// Define types for sorting
type SortField = 'businessName' | 'overallScore' | 'improvementScore' | 'criticalIssuesCount' | null;
type SortDirection = 'asc' | 'desc';

export default function SavedLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null); // Track which lead is being deleted
  // Add sorting state
  const [sortField, setSortField] = useState<SortField>('businessName'); // Default sort
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    async function fetchLeads() {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedLeads = await getSavedLeads();
        setLeads(fetchedLeads);
      } catch (err) {
        console.error("Failed to fetch saved leads:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred while fetching leads.");
        toast.error("Failed to load saved leads."); // Use sonner toast
      } finally {
        setIsLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const handleDelete = async (leadId: string) => {
    setDeletingId(leadId); // Show loading state on the specific delete button
    try {
      await deleteLeadAction(leadId);
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId)); // Update state optimistically
      toast.success("Lead deleted successfully."); // Use sonner toast
    } catch (err) {
      console.error("Failed to delete lead:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete lead."); // Use sonner toast
    } finally {
      setDeletingId(null); // Reset loading state
    }
  };

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (!field) return; // Should not happen with current setup
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc'); // Default to ascending when changing field
    }
  };

  // Compute sorted leads
  const sortedLeads = useMemo(() => {
    if (!sortField) return leads;

    return [...leads].sort((a, b) => {
      let valA: string | number | null | undefined;
      let valB: string | number | null | undefined;

      // Get values based on sortField
      switch (sortField) {
        case 'businessName':
          valA = a.businessName.toLowerCase();
          valB = b.businessName.toLowerCase();
          break;
        case 'overallScore':
          valA = a.overallScore;
          valB = b.overallScore;
          break;
        case 'improvementScore':
          valA = a.improvementScore;
          valB = b.improvementScore;
          break;
        case 'criticalIssuesCount':
          valA = safeJsonParse(a.criticalIssuesJson).length;
          valB = safeJsonParse(b.criticalIssuesJson).length;
          break;
        default:
          return 0; // Should not happen
      }

      // Handle null/undefined values (sort them to the bottom)
      const aIsNull = valA === null || valA === undefined;
      const bIsNull = valB === null || valB === undefined;
      if (aIsNull && bIsNull) return 0;
      if (aIsNull) return 1;
      if (bIsNull) return -1;

      // Perform comparison
      let comparison = 0;
      if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB);
      } else if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [leads, sortField, sortDirection]);

  // Helper to render sort indicator icons
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    return sortDirection === 'asc' ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />;
  }

  // Function to handle CSV export
  const exportLeadsToCSV = () => {
    if (sortedLeads.length === 0) {
      toast.error("No leads to export.");
      return;
    }

    // Define headers
    const headers = [
      "Business Name",
      "Address",
      "Phone",
      "Website",
      "Overall Score",
      "Improvement Score",
      "Saved At",
      "Critical Issues",
      "Outdated Technologies",
      "All Issues", // General issues
    ];

    // Function to escape CSV fields
    const escapeCsvField = (field: string | number | null | undefined): string => {
      if (field === null || field === undefined) return ''
      const stringField = String(field);
      // Escape double quotes by doubling them, and wrap field in quotes if it contains comma, quote, or newline
      if (stringField.includes('"') || stringField.includes(',') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`;
      }
      return stringField;
    };

    // Map leads to CSV rows
    const csvRows = sortedLeads.map((lead) => {
      const criticalIssues = safeJsonParse(lead.criticalIssuesJson).join("; ");
      const outdatedTech = safeJsonParse(lead.outdatedTechJson).join("; ");
      const allIssues = safeJsonParse(lead.issuesJson).join("; ");
      const savedAtDate = lead.savedAt ? new Date(lead.savedAt).toLocaleDateString() : '';

      return [
        escapeCsvField(lead.businessName),
        escapeCsvField(lead.address),
        escapeCsvField(lead.phone),
        escapeCsvField(lead.website),
        escapeCsvField(lead.overallScore),
        escapeCsvField(lead.improvementScore),
        escapeCsvField(savedAtDate),
        escapeCsvField(criticalIssues),
        escapeCsvField(outdatedTech),
        escapeCsvField(allIssues),
      ].join(",");
    });

    // Combine headers and rows
    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "saved-leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up
    toast.success("Leads exported successfully.");
  };

  // Render Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        <p className="ml-2 text-gray-600">Loading saved leads...</p>
      </div>
    );
  }

  // Render Error State
  if (error) {
    return (
      <Card className="mt-4 border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" /> Error Loading Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
          <p className="mt-2 text-sm text-destructive/80">Please try refreshing the page.</p>
        </CardContent>
      </Card>
    );
  }

  // Render Empty State
  if (leads.length === 0) {
    return (
      <Card className="mt-4 text-center">
        <CardHeader>
          <CardTitle>No Saved Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">You haven't saved any leads yet.</p>
          <p className="text-gray-500 mt-1">Use the Lead Discovery Engine to find and save potential leads.</p>
          {/* Optional: Add a link back to the discovery page */}
          {/* <Button asChild className="mt-4">
            <Link href="/lead-discovery">Find Leads</Link>
          </Button> */}
        </CardContent>
      </Card>
    );
  }

  // Render Leads Table
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Saved Leads</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Lead List</CardTitle>
            <CardDescription>Manage your saved business leads.</CardDescription>
          </div>
          <Button onClick={exportLeadsToCSV} variant="outline" size="sm">
             <Download className="mr-2 h-4 w-4" />
             Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('businessName')}>
                  <div className="flex items-center">
                    Business Name {renderSortIndicator('businessName')}
                  </div>
                </TableHead>
                <TableHead>Website</TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('overallScore')}>
                   <div className="flex items-center">
                    Overall Score {renderSortIndicator('overallScore')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('improvementScore')}>
                   <div className="flex items-center">
                    Improvement Score {renderSortIndicator('improvementScore')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleSort('criticalIssuesCount')}>
                   <div className="flex items-center">
                    Issues {renderSortIndicator('criticalIssuesCount')}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLeads.map((lead) => {
                const criticalIssues = safeJsonParse(lead.criticalIssuesJson);
                const outdatedTech = safeJsonParse(lead.outdatedTechJson);
                const allIssues = safeJsonParse(lead.issuesJson); // Parse all issues
                const isCurrentlyDeleting = deletingId === lead.id;

                // Reconstruct a partial WebsiteScore object from lead data
                const partialScore: WebsiteScoreType = {
                  overall: lead.overallScore ?? 0, // Use saved score or default
                  improvementScore: lead.improvementScore ?? (100 - (lead.overallScore ?? 0)), // Use saved or calculate from overall
                  issues: allIssues,
                  criticalIssues: criticalIssues,
                  outdatedTechnologies: outdatedTech,
                  url: lead.website || '', // Use website URL
                  // Provide defaults for scores not saved in the Lead model
                  seo: 0,
                  mobile: 0,
                  security: 0,
                  performance: 0,
                  design: 0,
                  content: 0,
                  contact: 0,
                  lastUpdated: null, // Or potentially use lead.savedAt if relevant?
                };

                return (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div className="font-medium">{lead.businessName}</div>
                      {lead.address && <div className="text-sm text-gray-500">{lead.address}</div>}
                      {lead.phone && <div className="text-sm text-gray-500">{lead.phone}</div>}
                    </TableCell>
                    <TableCell>
                      {lead.website ? (
                        <a
                          href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline flex items-center"
                        >
                          Visit Site <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {lead.overallScore !== null ? (
                         <Badge variant={lead.overallScore >= 70 ? "default" : lead.overallScore >= 40 ? "secondary" : "destructive"}>
                           {lead.overallScore}
                         </Badge>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                     <TableCell>
                      {lead.improvementScore !== null ? (
                         <Badge variant={lead.improvementScore >= 70 ? "destructive" : lead.improvementScore >= 40 ? "secondary" : "default"}>
                           {lead.improvementScore}
                         </Badge>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {criticalIssues && criticalIssues.length > 0 && (
                          <Badge variant="destructive" className="flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {criticalIssues.length} critical
                          </Badge>
                        )}
                        {outdatedTech && outdatedTech.length > 0 && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                            <Info className="h-3 w-3 mr-1" />
                            Outdated tech
                          </Badge>
                        )}
                        {(!criticalIssues || criticalIssues.length === 0) && (!outdatedTech || outdatedTech.length === 0) && (
                           <span className="text-gray-400 text-sm">None notable</span>
                        )}
                         {/* Add other issues from issuesJson if needed */}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1"> {/* Wrapper div */}
                        {/* Add View Details Button */}
                        <WebsiteScoreDetails score={partialScore} businessName={lead.businessName} />
                        {/* Existing Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(lead.id)}
                          disabled={isCurrentlyDeleting}
                          className="text-destructive hover:text-destructive/80"
                        >
                          {isCurrentlyDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="sr-only">Delete lead</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 