import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

// This is a placeholder and will need to be replaced with actual Apollo.io API calls.
// You'll need to install an HTTP client like 'axios' or use Node's native 'fetch'.
// import axios from 'axios'; 

const APOLLO_API_KEY = process.env.APOLLO_API_KEY;
// It's good practice to ensure your base URL ends with a slash if endpoints don't start with one.
const APOLLO_API_BASE_URL = "https://api.apollo.io/v1/"; 

// Updated interface based on typical Apollo contact fields and our frontend data
interface ApolloLeadPayload {
  email?: string | null;
  organization_name?: string | null; // Name of the company
  first_name?: string | null; 
  last_name?: string | null;
  title?: string | null; 
  // We will add other fields back incrementally
  // website_urls?: string[]; 
  // phone_numbers?: string[];
  // raw_address?: string | null; 
}

// --- Helper function to make authenticated Apollo API calls ---
async function callApolloApi(endpoint: string, method: string = 'GET', body: any = null) {
  if (!APOLLO_API_KEY) {
    throw new Error("Apollo API key is not configured.");
  }
  
  const url = endpoint.startsWith('http') ? endpoint : `${APOLLO_API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': APOLLO_API_KEY, 
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  console.log(`Calling Apollo API: ${method} ${url}`);
  if (body) {
     console.log(`With body: ${JSON.stringify(body, null, 2)}`);
  }

  const response = await fetch(url, options);
  const responseData = await response.json();

  if (!response.ok) {
    console.error(`Apollo API Error (${response.status}):`, responseData);
    const errorMessage = responseData.error || responseData.message || `HTTP error ${response.status}`;
    throw new Error(`Apollo API Error: ${errorMessage}`);
  }

  console.log(`Apollo API Success (${response.status})`);
  return responseData;
}
// --- End Helper Function ---

// Interface for the data coming from the frontend
interface IncomingLeadData {
  name: string;       // Business name
  website?: string | null;
  phone?: string | null;
  address?: string | null;
  // We might add generatedEmail here later if needed
}

// Placeholder function to find the list ID (implement fully later)
async function getSiteSignalListId(listName: string = "SiteSignal"): Promise<string | null> {
    console.log(`Attempting to find Apollo list ID for: ${listName}`);
    try {
        // TODO: Replace with actual callApolloApi('lists', 'GET') and filtering logic
        // const listsResponse = await callApolloApi('lists', 'GET');
        // const siteSignalList = listsResponse.lists?.find((l: any) => l.name === listName);
        // if (siteSignalList) {
        //     console.log(`Found list ID: ${siteSignalList.id}`);
        //     return siteSignalList.id;
        // }
        console.warn("List searching not implemented. Returning null for list ID.");
        return null; // Placeholder
    } catch (error) {
        console.error(`Error finding Apollo list '${listName}':`, error);
        throw new Error(`Could not find Apollo list named '${listName}'.`); // Re-throw to signal failure
    }
}

// Placeholder function to search for organization
async function findOrganization(domain: string | null, name: string): Promise<any | null> {
    if (!domain) return null; // Cannot search reliably without domain
    console.log(`Searching for organization with domain: ${domain}`);
    try {
        // TODO: Replace with actual callApolloApi('accounts/search', 'POST', payload) and result extraction
        // const searchPayload = { q_organization_domains: domain }; 
        // const searchResults = await callApolloApi('accounts/search', 'POST', searchPayload);
        // if (searchResults.organizations && searchResults.organizations.length > 0) {
        //     console.log(`Found existing organization ID: ${searchResults.organizations[0].id}`);
        //     return searchResults.organizations[0];
        // }
        return null; // Placeholder
    } catch (error) {
        console.error(`Error searching for organization ${name} (domain: ${domain}):`, error);
        return null; // Don't block the whole process if search fails, maybe try creating
    }
}

// Placeholder function to create organization
async function createOrganization(lead: IncomingLeadData): Promise<any | null> {
    console.log(`Attempting to create organization: ${lead.name}`);
    const domain = lead.website ? new URL(lead.website).hostname : undefined;
    try {
        const createPayload: Record<string, any> = {
           name: lead.name,
           domain: domain,
           phone: lead.phone, // Apollo might expect 'phone_numbers' array instead
           raw_address: lead.address // Apollo might expect structured address fields
           // Add other relevant fields based on Apollo's POST /v1/accounts schema if known
        };
        
        // Remove null/undefined fields from payload to avoid sending empty values
        Object.keys(createPayload).forEach(key => 
            (createPayload[key] === undefined || createPayload[key] === null) && delete createPayload[key]
        );

        // Ensure domain or name is present
        if (!createPayload.name && !createPayload.domain) {
             console.warn(`Skipping creation for lead ${lead.name || '(no name)'} - requires at least name or domain.`);
             return null;
        }

        const newOrgResponse = await callApolloApi('accounts', 'POST', createPayload);
        
        // Apollo's response structure can vary. Look for 'account' or 'organization'.
        const createdOrgData = newOrgResponse.account || newOrgResponse.organization || newOrgResponse;
        const createdOrgId = createdOrgData?.id;

        if (!createdOrgId) {
             console.warn(`Create organization call succeeded for ${lead.name} but no ID found in response:`, newOrgResponse);
             throw new Error("Created organization but failed to retrieve ID from response.");
        }
        console.log(`Created new organization ID: ${createdOrgId} for ${lead.name}`);
        return createdOrgData; // Return the part of the response containing the ID and other info
        
    } catch (error) {
        console.error(`Error creating organization ${lead.name}:`, error);
        // Check if the error indicates it already exists (if Apollo provides such info)
        // e.g., if (error instanceof Error && error.message.includes("already exists")) { ... handle differently ... }
        return null; // Return null if creation fails
    }
}

// Placeholder function to add organization to list
async function addOrganizationToList(listId: string, organizationId: string): Promise<boolean> {
    console.log(`Adding organization ${organizationId} to list ${listId}`);
    try {
        // TODO: Replace with actual callApolloApi('/lists/{listId}/add_organizations?', 'POST', payload)
        // Find the correct endpoint and payload structure for adding orgs to a list
        // const addPayload = { organization_ids: [organizationId] };
        // await callApolloApi(`lists/${listId}/accounts`, 'POST', addPayload); // Example endpoint
        console.warn("Adding organization to list not implemented.");
        return true; // Placeholder success
    } catch (error) {
        console.error(`Error adding organization ${organizationId} to list ${listId}:`, error);
        return false;
    }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // Check for API key early
  if (!APOLLO_API_KEY) {
      console.error("Apollo API key is not configured.");
      return NextResponse.json({ success: false, error: "Apollo API key is missing." }, { status: 500 });
  }

  let siteSignalListId: string | null = null;
  try {
    // TODO: Get the list ID. Consider caching this.
    siteSignalListId = await getSiteSignalListId();
    if (!siteSignalListId) {
       console.warn("Proceeding without adding to list because SiteSignal list ID was not found/fetched.");
       // Decide if this is a hard error or just a warning
       // For now, let it proceed but log a warning.
       // throw new Error("Could not find the 'SiteSignal' list ID in Apollo.");
    }
  } catch (error: any) {
     console.error("Failed to initialize Apollo integration:", error);
     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  try {
    const body = await request.json();
    const incomingLeads = body.leads as IncomingLeadData[];

    if (!incomingLeads || !Array.isArray(incomingLeads) || incomingLeads.length === 0) {
      return NextResponse.json({ success: false, error: "No leads data provided." }, { status: 400 });
    }

    let addedCount = 0;
    let updatedCount = 0; // If we find existing orgs
    let listAddSuccessCount = 0;
    let listAddFailCount = 0;
    let failedCount = 0;
    const errors: { leadName: string; stage: string; message: string }[] = [];

    for (const lead of incomingLeads) {
        let organizationId: string | null = null;
        let organization: any = null;
        let operationType = "";

        try {
            let domain: string | null = null;
            if (lead.website) { // Check if website exists first
               try {
                   domain = new URL(lead.website).hostname;
               } catch (urlError) {
                   console.warn(`Invalid URL format for ${lead.name}: ${lead.website}`);
                   // domain remains null
               }
            }

            // 1. Search for existing organization
            operationType = "Search";
            if (domain) { // Only search if domain is not null
               organization = await findOrganization(domain, lead.name || "Unknown Lead"); 
            } else {
               console.log(`Skipping organization search for ${lead.name} because domain is null.`);
               organization = null; // Ensure organization is null if search is skipped
            }

            // 2. Create if not found
            if (!organization) {
                operationType = "Create";
                organization = await createOrganization(lead);
            }
             
            if (!organization || !organization.id) {
                throw new Error("Failed to find or create organization in Apollo.");
            }

            organizationId = organization.id;
            console.log(`Processing lead ${lead.name} -> Apollo Org ID: ${organizationId}`);
            if (operationType === "Search") updatedCount++; else addedCount++;

            // 3. Add organization to the SiteSignal list (if list ID was found)
            if (siteSignalListId && organizationId) { // Explicitly check organizationId is not null here
                operationType = "AddToList";
                const addedToList = await addOrganizationToList(siteSignalListId, organizationId);
                if (addedToList) {
                    listAddSuccessCount++;
                } else {
                    listAddFailCount++;
                    // Don't add to main errors, but maybe log separately or return in details
                    console.warn(`Failed to add org ${organizationId} to list ${siteSignalListId}`);
                }
            } else if (siteSignalListId && !organizationId) {
                 // This case shouldn't happen due to earlier checks, but log if it does
                 console.error(`Cannot add lead ${lead.name} to list ${siteSignalListId} because organizationId is null.`);
                 failedCount++; 
                 errors.push({ leadName: lead.name, stage: "AddToList", message: "Internal error: organizationId became null unexpectedly." });
            }

        } catch (stepError: any) {
            console.error(`Error processing lead ${lead.name} during ${operationType} stage:`, stepError);
            errors.push({ leadName: lead.name, stage: operationType, message: stepError.message });
            failedCount++;
        }
    }

    const summaryMessage = `Processed ${incomingLeads.length} leads. Created: ${addedCount}, Found Existing: ${updatedCount}, Failed: ${failedCount}. Added to List: ${listAddSuccessCount}, List Add Failed: ${listAddFailCount}.`;

    if (failedCount > 0 && (addedCount + updatedCount === 0)) {
        return NextResponse.json({ success: false, error: "All leads failed processing.", message: summaryMessage, errorsDetail: errors }, { status: 500 });
    }
    if (failedCount > 0 || listAddFailCount > 0) {
        return NextResponse.json({ success: true, message: summaryMessage, errorsDetail: errors }, { status: 207 }); // Multi-Status
    }

    return NextResponse.json({ success: true, message: summaryMessage, created: addedCount, updated: updatedCount, listAdded: listAddSuccessCount });

  } catch (error: any) {
    console.error("General error in /api/apollo/add-leads:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
} 