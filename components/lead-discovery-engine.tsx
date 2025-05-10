"use client"

import type React from "react"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
  Search,
  Download,
  Loader2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
  AlertTriangle,
  Info,
  BarChart2,
  ArrowUpDown,
  FileText,
  MapPin,
  Phone,
  Globe,
  Eye,
  Save,
  Share2,
  Briefcase,
  ChevronsUpDown,
  Check,
  Clock,
  Rocket,
  Wand2,
  Users,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { WebsiteScoreDetails } from "@/components/website-score-details"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SearchHistory } from "@/components/search-history"
import { SearchHistoryItem as SearchHistoryItemType } from "@/lib/search-history"
import { getHistoryAction } from "./lead-discovery-actions"
import { getCachedResults } from "@/lib/get-cached-results-action"
import { toast } from "sonner"
import { formatDistanceToNow } from 'date-fns'
import { Business } from "@/lib/types"
import { saveMultipleLeadsAction } from '@/app/(main)/dashboard/actions'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { BusinessCard } from '@/components/business-card'
import type { SearchParams, WebsiteScore as WebsiteScoreType } from "@/lib/types"

type SortField = "name" | "overall" | "seo" | "mobile" | "security" | "improvementScore" | null
type SortDirection = "asc" | "desc"

// Industry suggestions known for having outdated websites
const INDUSTRY_SUGGESTIONS = [
  "plumbers",
  "electricians",
  "hvac contractors",
  "roofers",
  "landscapers",
  "auto repair shops",
  "dentists",
  "chiropractors",
  "law firms",
  "accountants",
  "real estate agents",
  "insurance agents",
  "restaurants",
  "bakeries",
  "florists",
  "dry cleaners",
  "pet groomers",
  "hardware stores",
  "furniture stores",
  "appliance repair",
]

interface LeadDiscoveryEngineProps {
  initialSearchParams?: SearchParams;
}

export function LeadDiscoveryEngine({ initialSearchParams }: LeadDiscoveryEngineProps) {
  const [businessType, setBusinessType] = useState("")
  const [industry, setIndustry] = useState("")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Business[]>([])
  const [error, setError] = useState<string | null>(null)
  const [includeScores, setIncludeScores] = useState(true)
  const [businessCount, setBusinessCount] = useState(20)
  const [searchRadiusKm, setSearchRadiusKm] = useState(10)
  const [sortField, setSortField] = useState<SortField>("improvementScore")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeTab, setActiveTab] = useState("search")
  const [showOnlyImprovableWebsites, setShowOnlyImprovableWebsites] = useState(false)
  const [improvementThreshold, setImprovementThreshold] = useState(0)
  const [searchStrategy, setSearchStrategy] = useState("standard")
  const [randomIndustry, setRandomIndustry] = useState("")
  const [selectedBusinesses, setSelectedBusinesses] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItemType[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const [isBulkSaving, setIsBulkSaving] = useState(false)
  const [isAddingToApollo, setIsAddingToApollo] = useState(false)
  const [isBulkGeneratingEmails, setIsBulkGeneratingEmails] = useState(false)

  // City dropdown state
  const [locationInput, setLocationInput] = useState("")
  const [citySuggestions, setCitySuggestions] = useState<string[]>([])
  const [isLoadingCities, setIsLoadingCities] = useState(false)
  const [showCityDropdown, setShowCityDropdown] = useState(false)

  // Ref for the dropdown
  const cityDropdownRef = useRef<HTMLDivElement>(null)
  const locationInputRef = useRef<HTMLInputElement>(null)

  const { toast } = useToast()

  // Get a random industry suggestion
  const getRandomIndustry = () => {
    const randomIndex = Math.floor(Math.random() * INDUSTRY_SUGGESTIONS.length)
    setRandomIndustry(INDUSTRY_SUGGESTIONS[randomIndex])
  }

  // Initialize with a random industry
  useEffect(() => {
    getRandomIndustry()
  }, [])

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        cityDropdownRef.current &&
        !cityDropdownRef.current.contains(event.target as Node) &&
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowCityDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [cityDropdownRef, locationInputRef])

  // Fetch city suggestions when the user types in the location field
  useEffect(() => {
    const fetchCitySuggestions = async () => {
      if (locationInput.length < 2) {
        setCitySuggestions([])
        return
      }

      setIsLoadingCities(true)
      try {
        const response = await fetch(`/api/city-suggestions?query=${encodeURIComponent(locationInput)}`)
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        const data = await response.json()
        console.log("City suggestions response:", data)
        setCitySuggestions(data.suggestions || [])
      } catch (error) {
        console.error("Failed to fetch city suggestions:", error)
        setCitySuggestions([])
      } finally {
        setIsLoadingCities(false)
      }
    }

    const debounceTimer = setTimeout(fetchCitySuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [locationInput])

  // Fetch search history on mount
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoadingHistory(true);
      setHistoryError(null);
      try {
        const history = await getHistoryAction();
        console.log("[LeadDiscoveryEngine] History received from action:", history);
        setSearchHistory(history);
      } catch (error) {
        console.error("Failed to load search history:", error);
        setHistoryError("Could not load search history.");
      } finally {
        setIsLoadingHistory(false);
      }
    };
    loadHistory();
  }, []);

  // --- Refactored Search Logic ---
  const performSearch = async (searchParams: {
    term: string;
    location: string;
    strategy: string;
    count: number;
    radiusKm: number;
    analyze: boolean;
  }) => {
    setIsLoading(true);
    setActiveTab("results");
    setError(null);
    setResults([]);

    const MAX_RETRIES = 2; // Max 2 retries (total 3 attempts)
    const INITIAL_RETRY_DELAY = 5000; // 5 seconds

    const makeRequest = async () => {
      let searchQuery = `${searchParams.term} in ${searchParams.location}`;
      if (searchParams.strategy === "established") {
        searchQuery = `established ${searchParams.term} in ${searchParams.location}`;
      } else if (searchParams.strategy === "small") {
        searchQuery = `small local ${searchParams.term} in ${searchParams.location}`;
      } else if (searchParams.strategy === "family") {
        searchQuery = `family owned ${searchParams.term} in ${searchParams.location}`;
      }

      const body = JSON.stringify({
        query: searchQuery,
        includeScores: searchParams.analyze,
        limit: searchParams.count,
        radius: searchParams.radiusKm * 1000,
        term: searchParams.term,
        location: searchParams.location,
        industry: industry, 
        count: searchParams.count
      });

      return fetch("/api/search-businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: body,
      });
    };

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await makeRequest();
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 429 && attempt < MAX_RETRIES) {
            const delay = INITIAL_RETRY_DELAY * Math.pow(3, attempt); // 5s, 15s
            const message = `Search is rate-limited. Retrying in ${delay / 1000}s (Attempt ${attempt + 1}/${MAX_RETRIES})...`;
            setError(message);
            toast({
              title: "Search Rate Limited",
              description: `The server is busy. ${message}`,
              variant: "default", 
            });
            await new Promise(resolve => setTimeout(resolve, delay));
            continue; // Go to next attempt
          } else {
            // Failed for a non-429 reason, or it was the last retry attempt for 429
            throw new Error(data.error || `Failed to search for businesses. Status: ${response.status} (Attempt ${attempt + 1})`);
          }
        }

        if (!data.success && data.error) {
          throw new Error(data.error || "API returned an error during search");
        }

        setResults(data.businesses || []);
        setError(null); // Clear error on success
        setIsLoading(false);
        return; // Exit function on success

      } catch (err) {
        if (attempt === MAX_RETRIES) { // Last attempt failed
          console.error("Error during search (final attempt):", err);
          setError(err instanceof Error ? err.message : "An unknown error occurred after multiple retries");
          setResults([]);
          setIsLoading(false);
          return; // Exit function
        }
        // For logging intermediate errors if needed, or if it's not a 429 to be retried
        console.warn(`Search attempt ${attempt + 1} failed:`, err);
      }
    }
  };
  // --- End Refactored Search Logic ---

  // Updated handleSearch to use the refactored logic
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessType || !location) {
      setError("Please enter both business type and location");
      return;
    }
    // Call the refactored search function
    await performSearch({
      term: businessType,
      location: location,
      strategy: searchStrategy,
      count: businessCount,
      radiusKm: searchRadiusKm,
      analyze: includeScores,
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new field and default to descending for scores, ascending for name
      setSortField(field)
      setSortDirection(field === "name" ? "asc" : "desc")
    }
  }

  const filteredResults = useMemo(() => {
    if (!showOnlyImprovableWebsites) return results

    return results.filter((business) => {
      // If no website or no score, include it (might be a good lead)
      if (!business.website || !business.websiteScore) return true

      // Check if websiteScore exists before accessing its properties
      if (!business.websiteScore) return true;

      // If using improvement score
      if (business.websiteScore.improvementScore !== undefined && business.websiteScore.improvementScore !== null) {
        return business.websiteScore.improvementScore >= improvementThreshold
      }

      // Fallback to overall score (ensure overall exists and is not null)
      if (business.websiteScore.overall !== undefined && business.websiteScore.overall !== null) {
        return business.websiteScore.overall <= 100 - improvementThreshold
      }
      // If improvementScore is undefined/null and overall is undefined/null, keep it? Decide logic here.
      // For now, let's include it if scores are missing.
      return true;
    })
  }, [results, showOnlyImprovableWebsites, improvementThreshold])

  const sortedResults = useMemo(() => {
    if (!sortField) return filteredResults

    return [...filteredResults].sort((a, b) => {
      if (sortField === "name") {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()
        return sortDirection === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
      }

      // Special handling for improvementScore - use 0 as default for sorting if null/undefined
      if (sortField === "improvementScore") {
        const scoreA = a.websiteScore?.improvementScore ?? 0; // Default to 0 if null/undefined
        const scoreB = b.websiteScore?.improvementScore ?? 0; // Default to 0 if null/undefined

        return sortDirection === "asc" ? scoreA - scoreB : scoreB - scoreA
      }

      // For other score fields - use 0 as default
      // Make sure the field name accessed here is actually a key of WebsiteScoreType
      const field = sortField as keyof WebsiteScoreType; // Use imported type
      // Add null checks before accessing properties
      const scoreA = (a.websiteScore && typeof a.websiteScore[field] === 'number') ? a.websiteScore[field] as number : 0;
      const scoreB = (b.websiteScore && typeof b.websiteScore[field] === 'number') ? b.websiteScore[field] as number : 0;

      return sortDirection === "asc" ? scoreA - scoreB : scoreB - scoreA
    })
  }, [filteredResults, sortField, sortDirection])

  const exportToCSV = () => {
    if (selectedBusinesses.size === 0) {
      toast({
        title: "No Businesses Selected",
        description: "Please select at least one business to export to CSV.",
        variant: "default", // Or "destructive" if you prefer a more warning tone
      });
      return;
    }

    // Filter sortedResults to include only selected businesses
    const businessesToExport = sortedResults.filter(business => 
      selectedBusinesses.has(business.id)
    );

    if (businessesToExport.length === 0) {
      // This case should ideally not be hit if selectedBusinesses.size > 0 
      // and selectedBusinesses IDs correspond to businesses in sortedResults.
      // But as a safeguard:
      toast({
        title: "No Matching Businesses Found",
        description: "Could not find the selected businesses in the current results to export.",
        variant: "destructive",
      });
      return;
    }

    // Create CSV content
    let headers = ["Name", "Address", "Phone", "Website", "Category"]

    // Add score headers if we have scores
    if (includeScores) {
      headers = [
        ...headers,
        "Overall Score",
        "Improvement Opportunity",
        "SEO Score",
        "Mobile Score",
        "Security Score",
        "Performance Score",
        "Design Score",
        "Content Score",
        "Contact Score",
        "Critical Issues",
        "Outdated Technologies",
        "Last Updated",
        "All Issues",
      ]
    }
    headers.push("Subject_Line");
    headers.push("Custom_Email");

    const csvRows = [
      headers.join(","),
      ...businessesToExport.map((business) => {
        const basicData = [
          `"${business.name.replace(/"/g, '""')}"`,
          `"${business.address.replace(/"/g, '""')}"`,
          `"${business.phone || ""}"`,
          `"${business.website || ""}"`,
          `"${business.category || ""}"`, // Ensure category exists or provide default
        ];

        let scoreData: (string | number | undefined)[] = [];
        if (includeScores && business.websiteScore) {
          const score = business.websiteScore
          scoreData = [
            score.overall,
            score.improvementScore ?? (typeof score.overall === 'number' ? 100 - score.overall : ''), // Calculate improvement if possible
            score.seo,
            score.mobile,
            score.security,
            score.performance,
            score.design,
            score.content,
            score.contact,
            `"${(score.criticalIssues || []).join("; ").replace(/"/g, '""')}"`,
            `"${(score.outdatedTechnologies || []).join("; ").replace(/"/g, '""')}"`,
            `"${score.lastUpdated || "Unknown"}"`,
            `"${score.issues.join("; ").replace(/"/g, '""')}"`,
          ];
        }
        
        // Get the generated email subject, handle potential null/undefined, and escape quotes
        const subjectLineText = business.subjectLine || "";
        const escapedSubject = `"${subjectLineText.replace(/"/g, '""')}"`;
        
        // Get the generated email body, handle potential null/undefined, and escape quotes
        const emailBodyText = business.generatedEmail || ""; // generatedEmail now stores the body
        const escapedEmailBody = `"${emailBodyText.replace(/"/g, '""')}"`;

        // Combine basic, score (if applicable), subject, and email body data
        return [...basicData, ...scoreData, escapedSubject, escapedEmailBody].join(",");
      }),
    ]
    const csvContent = csvRows.join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${businessType}-${location}-leads.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // New function to export contacts to CSV
  const exportContactsToCSV = () => {
    if (selectedBusinesses.size === 0) {
      toast({
        title: "No Businesses Selected",
        description: "Please select at least one business to export contacts from.",
        variant: "default",
      });
      return;
    }

    const businessesToProcess = sortedResults.filter(business =>
      selectedBusinesses.has(business.id)
    );

    if (businessesToProcess.length === 0) {
      toast({
        title: "No Matching Businesses Found",
        description: "Could not find the selected businesses in the current results.",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "Email Address",
      "First Name",
      "Last Name",
      "Company Name",
      "Company Website",
      "Company Phone",
      "Generated Subject Line",
      "Generated Email Body",
      // Add "Title" or other fields if needed later
    ];

    const csvRows: string[][] = [];

    businessesToProcess.forEach((business) => {
      if (business.websiteScore && business.websiteScore.emailsFound && business.websiteScore.emailsFound.length > 0) {
        business.websiteScore.emailsFound.forEach((email) => {
          if (email) { // Ensure email is not null or empty
            // Set First Name to "(Company Name) Team" and Last Name to blank
            const firstName = `${business.name} Team`;
            const lastName = "";

            const rowData = [
              email.trim(),
              firstName,
              lastName,
              business.name.replace(/"/g, '""'),
              business.website || "",
              business.phone || "",
              business.subjectLine || "", // Add generated subject
              business.generatedEmail || "", // Add generated email body
            ];
            csvRows.push(rowData.map(field => `"${String(field).replace(/"/g, '""')}"`));
          }
        });
      }
    });

    if (csvRows.length === 0) {
      toast({
        title: "No Emails Found",
        description: "No email addresses were found for the selected businesses.",
        variant: "default",
      });
      return;
    }

    const finalCsvRows = [headers.join(","), ...csvRows.map(row => row.join(","))];
    const csvContent = finalCsvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `selected-contacts-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-success-500"
    if (score >= 60) return "bg-success-400"
    if (score >= 40) return "bg-warning-500"
    return "bg-danger-500"
  }

  // Helper function to get color based on improvement score (inverse)
  const getImprovementColor = (score: number) => {
    if (score >= 70) return "bg-danger-500"
    if (score >= 50) return "bg-warning-500"
    if (score >= 40) return "bg-warning-400"
    return "bg-success-500"
  }

  // Helper to render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />

    return sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  // Helper to check if a website has critical issues
  const hasCriticalIssues = (business: Business) => {
    return business.websiteScore?.criticalIssues && business.websiteScore.criticalIssues.length > 0
  }

  // Helper to check if a website has outdated technologies
  const hasOutdatedTech = (business: Business) => {
    return business.websiteScore?.outdatedTechnologies && business.websiteScore.outdatedTechnologies.length > 0
  }

  // Toggle selection of a business
  const toggleBusinessSelection = (id: string) => {
    setSelectedBusinesses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet; // Return the modified Set
    });
  }

  // Check if all businesses are selected
  const allSelected = selectedBusinesses.size === sortedResults.length && sortedResults.length > 0

  // Toggle selection of all businesses
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedBusinesses(new Set())
    } else {
      setSelectedBusinesses(new Set(sortedResults.map((business) => business.id)))
    }
  }

  // Update function to handle selecting a search from history
  const handleSelectFromHistory = async (params: Omit<SearchHistoryItemType, 'timestamp'>) => {
    console.log("Loading from history:", params);
    // 1. Update UI fields
    setBusinessType(params.term);
    setIndustry(params.industry); // Assuming industry is stored/used
    setLocationInput(params.location);
    setLocation(params.location);
    setBusinessCount(params.count);
    // Reset other potentially conflicting filters?
    // setSearchStrategy("standard"); // Maybe reset strategy?
    // setShowOnlyImprovableWebsites(true); // Maybe reset filter?

    // 2. Construct the cache key
    const cacheKey = `search:${params.term}:${params.location}:${params.industry}:${params.count}`;

    // 3. Attempt to fetch results from cache
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const cachedResults = await getCachedResults(cacheKey);

      if (cachedResults) {
        console.log("Found cached results:", cachedResults);
        setResults(cachedResults);
        setActiveTab("results");
        toast({
            title: "Loaded from Cache",
            description: "Loaded results from search history cache.",
        });
        setIsLoading(false); // Stop loading if cache hit
      } else {
        console.log("Cache miss for history item. Performing new search...");
        // 4. Cache miss - perform a new search using history params
        // We assume 'standard' strategy and 'includeScores=true' for history searches
        // Adjust if search history items store more details
        await performSearch({
          term: params.term,
          location: params.location,
          strategy: "standard", // Or fetch strategy if stored in historyItem
          count: params.count,
          radiusKm: searchRadiusKm, // Use current radius or store/fetch from history
          analyze: true, // Assume analysis was done for saved history
        });
         // performSearch handles setting results, loading, error, and activeTab
      }
    } catch (err) {
      console.error("Error loading from history:", err);
      setError(err instanceof Error ? err.message : "Failed to load from history");
      setIsLoading(false); // Ensure loading stops on error
    }
    // No finally block here as performSearch has its own
  };

  // Function to handle city selection
  const handleCitySelection = (city: string) => {
    setLocationInput(city)
    setLocation(city)
    setShowCityDropdown(false)
  }

  // Handler for saving selected businesses
  const handleSaveSelected = async () => {
    if (selectedBusinesses.size === 0) {
      toast({
        title: "No Leads Selected",
        description: "Please select at least one lead to save.",
        variant: "destructive",
      });
      return;
    }

    setIsBulkSaving(true);
    setError(null);

    // Find the full business objects for the selected IDs
    const businessesToSave = results.filter(business =>
      selectedBusinesses.has(business.id)
    );

    // Map to the format expected by the server action
    const leadsData = businessesToSave.map(b => ({
      businessName: b.name,
      address: b.address,
      phone: b.phone,
      website: b.website,
      overallScore: b.websiteScore?.overall ?? null,
      improvementScore: b.websiteScore?.improvementScore ?? null,
      issuesJson: b.websiteScore?.issues ? JSON.stringify(b.websiteScore.issues) : null,
      criticalIssuesJson: b.websiteScore?.criticalIssues ? JSON.stringify(b.websiteScore.criticalIssues) : null,
      outdatedTechJson: b.websiteScore?.outdatedTechnologies ? JSON.stringify(b.websiteScore.outdatedTechnologies) : null,
    }));

    try {
      const result = await saveMultipleLeadsAction(leadsData);
      toast({
        title: "Leads Saved Successfully",
        description: `${result.count} lead(s) were saved. Skipped ${leadsData.length - result.count} duplicates. `,
      });
      setSelectedBusinesses(new Set()); // Clear selection after saving
    } catch (err: any) {
      console.error('Error saving multiple leads:', err);
      setError('Failed to save selected leads. Please try again.');
      toast({
        title: "Error Saving Leads",
        description: err.message || 'An unexpected error occurred.',
        variant: "destructive",
      });
    } finally {
      setIsBulkSaving(false);
    }
  };

  // New handler for adding selected businesses to Apollo.io
  const handleAddToApollo = async () => {
    if (selectedBusinesses.size === 0) {
      toast({
        title: "No Leads Selected",
        description: "Please select at least one lead to add to Apollo.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToApollo(true);
    setError(null); // Clear previous errors

    const businessesToSync = results.filter(business =>
      selectedBusinesses.has(business.id)
    );

    const leadsForApollo = businessesToSync.map(b => {
      const primaryEmail = b.websiteScore?.emailsFound && b.websiteScore.emailsFound.length > 0
        ? b.websiteScore.emailsFound[0]
        : null;
      
      // Basic attempt to get first/last name if email is generic like info@, contact@, support@
      let firstName = null;
      let lastName = null;
      if (primaryEmail) {
        const emailUser = primaryEmail.split('@')[0].toLowerCase();
        if (['info', 'contact', 'support', 'admin', 'hello', 'sales'].includes(emailUser)) {
          firstName = emailUser.charAt(0).toUpperCase() + emailUser.slice(1); // e.g., "Info"
          lastName = "Contact"; // Generic last name
        } else if (emailUser.includes('.')) {
          const parts = emailUser.split('.');
          firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
          lastName = parts.slice(1).join('.').charAt(0).toUpperCase() + parts.slice(1).join('.').slice(1);
        } else if (emailUser.length > 2) { // If not a common generic and no dot, use it as first name
            firstName = emailUser.charAt(0).toUpperCase() + emailUser.slice(1);
        }
      }
      if (!firstName && b.name) { // Fallback if no suitable first name from email
        firstName = "Contact"; // Default placeholder
        // lastName can remain null or be set to business name if desired
      }


      return {
        organization_name: b.name, // Business name as organization name
        email: primaryEmail,
        first_name: firstName,
        last_name: lastName, // Could be null
        website_url: b.website, // Apollo might use 'website_urls' (array) or 'organization_website_url'
        phone_numbers: b.phone ? [b.phone] : [], // Apollo expects an array
        address: b.address, // This might map to 'raw_address' or structured fields
        // title: "Owner" // Placeholder title, if useful and not available otherwise
      };
    });

    try {
      const response = await fetch('/api/apollo/add-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: leadsForApollo }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to add leads to Apollo.io");
      }

      toast({
        title: "Leads Sent to Apollo",
        description: `${result.addedCount || 0} lead(s) successfully sent. ${result.skippedCount || 0} skipped/failed.`,
      });
      // Optionally, clear selection or mark as synced
      // setSelectedBusinesses(new Set()); 
    } catch (err: any) {
      console.error('Error adding leads to Apollo:', err);
      setError('Failed to add selected leads to Apollo. Please try again.');
      toast({
        title: "Error Sending to Apollo",
        description: err.message || 'An unexpected error occurred.',
        variant: "destructive",
      });
    } finally {
      setIsAddingToApollo(false);
    }
  };

  // Function to update generatedEmail in the results state
  const handleEmailGeneratedForBusiness = (businessId: string, subjectLine: string, emailBody: string) => {
    console.log(`Received generated subject: "${subjectLine}" and email body for business ${businessId}`);
    setResults(currentResults =>
      currentResults.map(business =>
        business.id === businessId
          ? { ...business, subjectLine: subjectLine, generatedEmail: emailBody } // Store subject and body
          : business
      )
    );
    toast({ title: "Email Generated", description: `Outreach email & subject for business ID ${businessId.substring(0,6)}... is ready for CSV export.` });
  };

  // New handler for bulk generating emails
  const handleBulkGenerateEmails = async () => {
    if (selectedBusinesses.size === 0) {
      toast({
        title: "No Businesses Selected",
        description: "Please select at least one business to generate emails for.",
        variant: "destructive",
      });
      return;
    }

    setIsBulkGeneratingEmails(true);
    let successCount = 0;
    let errorCount = 0;

    // Process requests sequentially to avoid rate limiting
    for (const businessId of Array.from(selectedBusinesses)) {
      const business = results.find(b => b.id === businessId);
      if (business && business.websiteScore && business.website) { // Ensure websiteScore and website URL exist
        try {
          const response = await fetch("/api/generate-outreach-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              businessName: business.name,
              websiteUrl: business.website, // Use business.website which should be the valid URL
              score: business.websiteScore,
            }),
          });
          const result = await response.json();
          if (!response.ok || !result.success) {
            // Log the actual status code if available
            console.error(`Email generation API error for ${business.name}: Status ${response.status}`, result);
            throw new Error(result.error || result.details || `Failed to generate email for ${business.name} (Status: ${response.status})`);
          }
          // Update state for this business
          setResults(currentResults =>
            currentResults.map(b =>
              b.id === businessId
                ? { ...b, subjectLine: result.subjectLine, generatedEmail: result.emailBody }
                : b
            )
          );
          successCount++;
        } catch (err: any) {
          console.error(`Error generating email for ${business.name}:`, err);
          toast({ title: `Email Gen Failed for ${business.name.substring(0,20)}...`, description: err.message, variant: "destructive" });
          errorCount++;
        }
      } else {
        console.warn(`Skipping email generation for ${business?.name || businessId}: missing website score or URL.`);
        // Optionally count as an error or skip silently
        // errorCount++;
      }
      // Add a delay to avoid rate limiting, regardless of success or failure of the individual request
      await new Promise(resolve => setTimeout(resolve, 8000)); // 8-second delay
    }

    setIsBulkGeneratingEmails(false);
    toast({
      title: "Bulk Email Generation Complete",
      description: `${successCount} email(s) generated. ${errorCount} failed.`,
      variant: errorCount > 0 ? "destructive" : undefined,
    });
  };

  // Log state just before returning JSX
  console.log("[Render] showCityDropdown:", showCityDropdown);
  console.log("[Render] searchHistory state:", searchHistory);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Lead Discovery Engine</h1>
          <p className="text-gray-600">Find businesses with websites that need professional improvement</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="search" className="text-sm">
              Search Parameters
            </TabsTrigger>
            <TabsTrigger value="results" disabled={results.length === 0} className="text-sm">
              Results {results.length > 0 && `(${sortedResults.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>Business Discovery</CardTitle>
                <CardDescription>Search for businesses that need website improvement services</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="business-type">Business Type</Label>
                      <div className="relative">
                        <Input
                          id="business-type"
                          placeholder="e.g. plumbers, HVAC, electricians"
                          value={businessType}
                          onChange={(e) => setBusinessType(e.target.value)}
                          required
                          className="pr-24"
                        />
                        {randomIndustry && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary-600"
                            onClick={() => setBusinessType(randomIndustry)}
                          >
                            Try: {randomIndustry}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <div className="relative flex-1">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="location"
                            ref={locationInputRef}
                            placeholder="e.g. Chicago, New York, Austin TX"
                            value={locationInput}
                            onChange={(e) => {
                              setLocationInput(e.target.value)
                              if (e.target.value.length >= 2) {
                                console.log("Location Input onChange - Setting showCityDropdown true");
                                setShowCityDropdown(true)
                              } else {
                                console.log("Location Input onChange - Setting showCityDropdown false");
                                setShowCityDropdown(false)
                              }
                            }}
                            onClick={() => {
                              if (locationInput.length >= 2) {
                                console.log("Location Input onClick - Setting showCityDropdown true");
                                setShowCityDropdown(true)
                              }
                            }}
                            required
                            autoComplete="off"
                            className="pl-10 pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                            onClick={() => setShowCityDropdown(!showCityDropdown)}
                          >
                            <ChevronsUpDown className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                        {showCityDropdown && (
                          <div
                            ref={cityDropdownRef}
                            className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto"
                          >
                            {isLoadingCities ? (
                              <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-5 w-5 animate-spin text-gray-400 mr-2" />
                                <span className="text-sm text-gray-500">Loading cities...</span>
                              </div>
                            ) : citySuggestions.length > 0 ? (
                              <ul className="py-1">
                                {citySuggestions.map((city) => (
                                  <li key={city}>
                                    <button
                                      type="button"
                                      className={`flex w-full items-center px-3 py-2 text-sm hover:bg-gray-100 ${
                                        location === city ? "bg-gray-50" : ""
                                      }`}
                                      onClick={() => handleCitySelection(city)}
                                    >
                                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                      <span>{city}</span>
                                      {location === city && <Check className="ml-auto h-4 w-4 text-primary-600" />}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="p-4 text-center text-sm text-gray-500">
                                {locationInput.length < 2 ? "Type at least 2 characters to search" : "No cities found"}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="show-only-improvable"
                          checked={showOnlyImprovableWebsites}
                          onCheckedChange={setShowOnlyImprovableWebsites}
                        />
                        <Label htmlFor="show-only-improvable" className="text-sm font-medium">
                          Show only websites needing improvement
                        </Label>
                      </div>

                      <Button type="button" variant="outline" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
                        <SlidersHorizontal className="mr-2 h-4 w-4" />
                        {showAdvanced ? "Hide" : "Show"} Advanced Options
                      </Button>
                    </div>

                    {showAdvanced && (
                      <div className="p-4 border rounded-md bg-white space-y-6">
                        <div>
                          <Label className="text-sm font-medium block mb-2">Search Strategy</Label>
                          <Select value={searchStrategy} onValueChange={setSearchStrategy}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a search strategy" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard Search</SelectItem>
                              <SelectItem value="established">Target Established Businesses</SelectItem>
                              <SelectItem value="small">Target Small Local Businesses</SelectItem>
                              <SelectItem value="family">Target Family-Owned Businesses</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1">
                            Different strategies help find businesses more likely to have outdated websites
                          </p>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label htmlFor="improvement-threshold" className="text-sm font-medium">
                              Improvement Opportunity Threshold
                            </Label>
                            <Badge variant="outline">{improvementThreshold}</Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <Slider
                              id="improvement-threshold"
                              min={0}
                              max={100}
                              step={5}
                              value={[improvementThreshold]}
                              onValueChange={(value) => setImprovementThreshold(value[0])}
                              className="flex-1"
                            />
                            <Select
                              value={improvementThreshold.toString()}
                              onValueChange={(value) => setImprovementThreshold(Number.parseInt(value))}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Threshold" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">0</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="15">15</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="30">30</SelectItem>
                                <SelectItem value="35">35</SelectItem>
                                <SelectItem value="40">40</SelectItem>
                                <SelectItem value="45">45</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="55">55</SelectItem>
                                <SelectItem value="60">60</SelectItem>
                                <SelectItem value="65">65</SelectItem>
                                <SelectItem value="70">70</SelectItem>
                                <SelectItem value="75">75</SelectItem>
                                <SelectItem value="80">80</SelectItem>
                                <SelectItem value="85">85</SelectItem>
                                <SelectItem value="90">90</SelectItem>
                                <SelectItem value="95">95</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Higher values show only websites with more significant improvement opportunities
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="business-count">Number of Businesses to Find</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              id="business-count"
                              min={5}
                              max={200}
                              step={5}
                              value={[businessCount]}
                              onValueChange={(value) => setBusinessCount(value[0])}
                              disabled={isLoading}
                            />
                            <Badge variant="outline">{businessCount}</Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="search-radius">Search Radius (km)</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              id="search-radius"
                              min={1}
                              max={50}
                              step={1}
                              value={[searchRadiusKm]}
                              onValueChange={(value) => setSearchRadiusKm(value[0])}
                              disabled={isLoading}
                            />
                            <Badge variant="outline">{searchRadiusKm} km</Badge>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="include-scores"
                            checked={includeScores}
                            onCheckedChange={(checked) => setIncludeScores(checked === true)}
                          />
                          <Label htmlFor="include-scores" className="text-sm">
                            Analyze websites (provides detailed improvement opportunities)
                          </Label>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Discover Improvement Opportunities
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-500 border border-red-200">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* --- Updated Recent Searches --- */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Recent Searches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingHistory ? (
                    <div className="flex justify-center items-center h-20">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  ) : historyError ? (
                    <p className="text-sm text-destructive text-center">{historyError}</p>
                  ) : searchHistory.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center">No recent searches found.</p>
                  ) : (
                    <div className="space-y-3">
                      {searchHistory.slice(0, 5).map((item, index) => (
                        // Pass item data to RecentSearchItem
                        <RecentSearchItem key={`${item.timestamp}-${index}`} historyItem={item} onSelect={handleSelectFromHistory} />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            {/* --- End Updated Recent Searches --- */}
          </TabsContent>

          <TabsContent value="results">
            {/* Show loading indicator when isLoading is true */}
            {isLoading && (
              <Card className="mt-4">
                <CardContent className="flex flex-col items-center justify-center p-10 space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
                  <p className="text-lg font-medium text-gray-700">Searching & Analyzing Websites...</p>
                  <p className="text-sm text-gray-500">This may take a moment, especially if analyzing many websites.</p>
                </CardContent>
              </Card>
            )}

            {/* Show results only when not loading and results exist */}
            {!isLoading && results.length > 0 && (
              <div className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Discovery Results</CardTitle>
                      <CardDescription>
                        {showOnlyImprovableWebsites
                          ? `Showing businesses with improvement score ≥ ${improvementThreshold}`
                          : "Showing all businesses"}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
                            >
                              {viewMode === "table" ? (
                                <BarChart2 className="h-4 w-4" />
                              ) : (
                                <FileText className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Toggle view mode</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button onClick={exportToCSV} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                      </Button>
                      <Button onClick={exportContactsToCSV} variant="outline" size="sm" disabled={selectedBusinesses.size === 0}>
                        <Users className="mr-2 h-4 w-4" />
                        Export Contacts (CSV)
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {viewMode === "table" ? (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[30px]">
                                <Checkbox
                                  checked={allSelected}
                                  onCheckedChange={toggleSelectAll}
                                  aria-label="Select all"
                                />
                              </TableHead>
                              <TableHead className="w-[80px]">Details</TableHead>
                              <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                                <div className="flex items-center">
                                  Business Name
                                  {renderSortIndicator("name")}
                                </div>
                              </TableHead>
                              <TableHead>Contact</TableHead>
                              <TableHead>Website</TableHead>
                              <TableHead>Emails Found</TableHead>
                              {includeScores && (
                                <>
                                  <TableHead className="cursor-pointer" onClick={() => handleSort("improvementScore")}>
                                    <div className="flex items-center">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <span>Improvement Score {renderSortIndicator("improvementScore")}</span>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Higher score = more improvement opportunity</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
                                  </TableHead>
                                  <TableHead className="cursor-pointer" onClick={() => handleSort("seo")}>
                                    <div className="flex items-center">SEO {renderSortIndicator("seo")}</div>
                                  </TableHead>
                                  <TableHead className="cursor-pointer" onClick={() => handleSort("mobile")}>
                                    <div className="flex items-center">Mobile {renderSortIndicator("mobile")}</div>
                                  </TableHead>
                                  <TableHead className="cursor-pointer" onClick={() => handleSort("security")}>
                                    <div className="flex items-center">Security {renderSortIndicator("security")}</div>
                                  </TableHead>
                                </>
                              )}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sortedResults.map((business) => (
                              <TableRow key={business.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={selectedBusinesses.has(business.id)}
                                    onCheckedChange={() => toggleBusinessSelection(business.id)}
                                    aria-label={`Select ${business.name}`}
                                  />
                                </TableCell>
                                <TableCell>
                                  {business.websiteScore && (
                                    <WebsiteScoreDetails 
                                        score={business.websiteScore} 
                                        businessName={business.name} 
                                        onEmailGenerated={(subject, emailBody) => handleEmailGeneratedForBusiness(business.id, subject, emailBody)} 
                                    />
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{business.name}</div>
                                  <div className="text-sm text-gray-500">{business.address}</div>
                                </TableCell>
                                <TableCell>
                                  {business.phone ? (
                                    <a
                                      href={`tel:${business.phone}`}
                                      className="text-primary-600 hover:underline flex items-center"
                                    >
                                      <Phone className="h-3 w-3 mr-1" />
                                      {business.phone}
                                    </a>
                                  ) : (
                                    <span className="text-gray-400">No phone</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {business.website ? (
                                    <a
                                      href={business.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center text-primary-600 hover:underline"
                                    >
                                      <Globe className="h-3 w-3 mr-1" />
                                      Website
                                      <ExternalLink className="ml-1 h-3 w-3" />
                                    </a>
                                  ) : (
                                    <Badge variant="outline">No website</Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {business.websiteScore?.emailsFound && business.websiteScore.emailsFound.length > 0 ? (
                                    <div className="flex flex-col text-xs">
                                      {/* Display first email, add more sophisticated display later if needed */}
                                      <a href={`mailto:${business.websiteScore.emailsFound[0]}`} className="text-primary-600 hover:underline truncate" title={business.websiteScore.emailsFound[0]}> 
                                          {business.websiteScore.emailsFound[0]}
                                      </a>
                                      {business.websiteScore.emailsFound.length > 1 && (
                                          <span className="text-muted-foreground">(+{business.websiteScore.emailsFound.length - 1} more)</span>
                                      )}
                                    </div>
                                  ) : business.websiteScore ? (
                                    <span className="text-xs text-muted-foreground">None Found</span>
                                  ) : (
                                    "N/A" /* No score data at all */
                                  )}
                                </TableCell>
                                {includeScores && (
                                  <>
                                    <TableCell>
                                      {business.websiteScore ? (
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium">
                                            {(typeof business.websiteScore.improvementScore === 'number')
                                              ? business.websiteScore.improvementScore
                                              : (typeof business.websiteScore.overall === 'number')
                                                ? (100 - business.websiteScore.overall)
                                                : "N/A"}
                                          </span>
                                          <Progress
                                            value={
                                              (typeof business.websiteScore.improvementScore === 'number')
                                                ? business.websiteScore.improvementScore
                                                : (typeof business.websiteScore.overall === 'number')
                                                  ? (100 - business.websiteScore.overall)
                                                  : 0
                                            }
                                            className={`h-2 w-16 ${getImprovementColor(
                                              (typeof business.websiteScore.improvementScore === 'number')
                                                ? business.websiteScore.improvementScore
                                                : (typeof business.websiteScore.overall === 'number')
                                                  ? (100 - business.websiteScore.overall)
                                                  : 0
                                            )}`}
                                          />
                                        </div>
                                      ) : (
                                        "N/A"
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {business.websiteScore ? (
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium">{business.websiteScore.seo}</span>
                                          <Progress
                                            value={business.websiteScore.seo}
                                            className={`h-2 w-16 ${getScoreColor(business.websiteScore.seo)}`}
                                          />
                                        </div>
                                      ) : (
                                        "N/A"
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {business.websiteScore ? (
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium">{business.websiteScore.mobile}</span>
                                          <Progress
                                            value={business.websiteScore.mobile}
                                            className={`h-2 w-16 ${getScoreColor(business.websiteScore.mobile)}`}
                                          />
                                        </div>
                                      ) : (
                                        "N/A"
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {business.websiteScore ? (
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium">{business.websiteScore.security}</span>
                                          <Progress
                                            value={business.websiteScore.security}
                                            className={`h-2 w-16 ${getScoreColor(business.websiteScore.security)}`}
                                          />
                                        </div>
                                      ) : (
                                        "N/A"
                                      )}
                                    </TableCell>
                                  </>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedResults.map((business) => (
                          <Card key={business.id} className="overflow-hidden">
                            <CardHeader className="p-4">
                              <div className="flex justify-between">
                                <CardTitle className="text-lg">{business.name}</CardTitle>
                                <Checkbox
                                  checked={selectedBusinesses.has(business.id)}
                                  onCheckedChange={() => toggleBusinessSelection(business.id)}
                                  aria-label={`Select ${business.name}`}
                                />
                              </div>
                              <CardDescription>{business.address}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              {business.websiteScore && (
                                <div className="mb-4 space-y-3">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">Overall Score</span>
                                    <Badge className={getScoreColor(business.websiteScore.overall)}>
                                      {business.websiteScore.overall}
                                    </Badge>
                                  </div>
                                  <Progress
                                    value={business.websiteScore.overall}
                                    className="h-2"
                                    indicatorClassName={getScoreColor(business.websiteScore.overall)}
                                  />
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">Improvement</span>
                                    <Badge
                                      className={getImprovementColor(business.websiteScore?.improvementScore ?? 0)}
                                    >
                                      {business.websiteScore?.improvementScore ?? 'N/A'}
                                    </Badge>
                                  </div>
                                  <Progress
                                    value={business.websiteScore.improvementScore ?? (100 - (business.websiteScore.overall ?? 0))}
                                    className={`h-2 ${getImprovementColor(business.websiteScore.improvementScore ?? 0)}`}
                                  />
                                </div>
                              )}

                              <div className="flex flex-col space-y-2">
                                {business.phone && (
                                  <a
                                    href={`tel:${business.phone}`}
                                    className="text-primary-600 hover:underline flex items-center text-sm"
                                  >
                                    <Phone className="h-3 w-3 mr-2" />
                                    {business.phone}
                                  </a>
                                )}
                                {business.website && (
                                  <a
                                    href={business.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-primary-600 hover:underline text-sm"
                                  >
                                    <Globe className="h-3 w-3 mr-2" />
                                    Visit Website
                                    <ExternalLink className="ml-1 h-3 w-3" />
                                  </a>
                                )}
                              </div>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 flex justify-between">
                              <Button variant="outline" size="sm">
                                <Save className="mr-2 h-4 w-4" />
                                Save Lead
                              </Button>
                              {business.websiteScore && (
                                <WebsiteScoreDetails score={business.websiteScore} businessName={business.name} />
                              )}
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-gray-500">
                      {selectedBusinesses.size} of {sortedResults.length} selected
                    </div>
                    <div className="flex space-x-2">
                      {selectedBusinesses.size > 0 && (
                        <Button 
                          onClick={handleSaveSelected}
                          disabled={isBulkSaving || isAddingToApollo || isBulkGeneratingEmails}
                          size="sm"
                        >
                          {isBulkSaving ? (
                            <> 
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <> 
                              <Save className="mr-2 h-4 w-4" />
                              Save {selectedBusinesses.size} Lead(s)
                            </>
                          )}
                        </Button>
                      )}
                      {selectedBusinesses.size > 0 && (
                        <Button 
                          onClick={handleBulkGenerateEmails}
                          disabled={isBulkGeneratingEmails || isBulkSaving || isAddingToApollo}
                          size="sm"
                          variant="outline"
                        >
                          {isBulkGeneratingEmails ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating Emails...
                            </>
                          ) : (
                            <>
                              <Wand2 className="mr-2 h-4 w-4" /> 
                              Generate Emails ({selectedBusinesses.size})
                            </>
                          )}
                        </Button>
                      )}
                      {selectedBusinesses.size > 0 && (
                        <Button 
                          onClick={handleAddToApollo}
                          disabled={isAddingToApollo || isBulkSaving || isBulkGeneratingEmails}
                          size="sm"
                          variant="outline"
                        >
                          {isAddingToApollo ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending to Apollo...
                            </>
                          ) : (
                            <>
                              <Rocket className="mr-2 h-4 w-4" />
                              Add to Apollo ({selectedBusinesses.size})
                            </>
                          )}
                        </Button>
                      )}
                      {selectedBusinesses.size > 0 && (
                        <Button variant="outline" size="sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share Selected
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// --- Restore Recent Search Item component ---
function RecentSearchItem({
  historyItem,
  onSelect,
}: {
  historyItem: SearchHistoryItemType;
  onSelect: (params: Omit<SearchHistoryItemType, 'timestamp'>) => void;
}) {
  const { term, location, industry, count, timestamp } = historyItem;
  const displayText = industry ? `${term} (${industry}) in ${location}` : `${term} in ${location}`;

  return (
    <button
      type="button"
      onClick={() => onSelect({ term, location, industry, count })}
      className="flex justify-between items-center w-full text-left p-3 hover:bg-gray-100 rounded-md transition-colors duration-150"
    >
      <div>
        <p className="text-sm font-medium text-gray-800 truncate" title={displayText}>{displayText}</p>
        <p className="text-xs text-gray-500">Searched {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}</p>
      </div>
      <Badge variant="secondary">{count} results</Badge>
    </button>
  );
}
