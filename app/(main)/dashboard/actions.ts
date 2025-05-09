'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db'; // Import the Prisma client
import { Lead } from '@prisma/client';
import { revalidatePath } from 'next/cache'; // Import revalidatePath

/**
 * Fetches the saved leads for the currently authenticated user.
 * @returns Promise<Lead[]> - An array of Lead objects or throws an error.
 */
export async function getSavedLeads(): Promise<Lead[]> {
  // Explicitly await auth() and access userId
  const authResult = await auth();
  const clerkId = authResult?.userId;

  if (!clerkId) {
    throw new Error('User not authenticated [getSavedLeads]');
  }

  try {
    // Find the internal user ID based on the Clerk ID
    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true }, // Only select the internal ID
    });

    if (!user) {
      // This case might happen if the user exists in Clerk but not in your DB yet
      // Potentially handle user creation here or in a webhook
      console.warn(`User with clerkId ${clerkId} not found in the database.`);
      return []; // Return empty array if internal user not found
    }

    // Fetch leads associated with the internal user ID
    const leads = await db.lead.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        savedAt: 'desc', // Show most recent leads first
      },
    });
    return leads;
  } catch (error) {
    console.error('Error fetching saved leads:', error);
    // Consider more specific error handling or re-throwing
    throw new Error('Failed to fetch saved leads.');
  }
}

/**
 * Saves a new lead for the currently authenticated user.
 * @param leadData - The data for the lead to save.
 * @returns Promise<Lead> - The newly created Lead object.
 */
export async function saveLeadAction(leadData: {
  businessName: string;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  overallScore?: number | null;
  improvementScore?: number | null;
  issuesJson?: string | null; // Expecting JSON string for issues
  criticalIssuesJson?: string | null;
  outdatedTechJson?: string | null;
}): Promise<Lead> {
  // Explicitly await auth() and access userId
  const authResult = await auth();
  const clerkId = authResult?.userId;

  if (!clerkId) {
    throw new Error('User not authenticated [saveLeadAction]');
  }

  // Find the internal user ID
  const user = await db.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!user) {
    // This case might happen if the user exists in Clerk but not in your DB yet
    // You might want to automatically create the user here
    console.error(`User with clerkId ${clerkId} not found in the database.`);
    throw new Error('User not found in database');
  }

  try {
    // Create the lead, mapping input data to the Prisma model
    const newLead = await db.lead.create({
      data: {
        userId: user.id,
        businessName: leadData.businessName,
        address: leadData.address,
        phone: leadData.phone,
        website: leadData.website,
        overallScore: leadData.overallScore,
        improvementScore: leadData.improvementScore,
        // Ensure JSON fields are stored as strings
        issuesJson: leadData.issuesJson,
        criticalIssuesJson: leadData.criticalIssuesJson,
        outdatedTechJson: leadData.outdatedTechJson,
        // savedAt and updatedAt are handled by Prisma defaults
      },
    });
    return newLead;
  } catch (error) {
    console.error('Error saving lead:', error);
    // Consider more specific error handling
    throw new Error('Failed to save lead.');
  }
}

/**
 * Input type for saving multiple leads.
 * Matches the fields expected by saveLeadAction for a single lead.
 */
type SaveLeadData = {
  businessName: string;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  overallScore?: number | null;
  improvementScore?: number | null;
  issuesJson?: string | null;
  criticalIssuesJson?: string | null;
  outdatedTechJson?: string | null;
};

/**
 * Saves multiple leads for the currently authenticated user.
 * @param leadsData - An array of lead data objects to save.
 * @returns Promise<{ count: number }> - The number of leads successfully created.
 */
export async function saveMultipleLeadsAction(
  leadsData: SaveLeadData[]
): Promise<{ count: number }> {
  // Get Clerk ID
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error('User not authenticated [saveMultipleLeadsAction]');
  }

  // Upsert the user: Find by clerkId or create if not found
  const user = await db.user.upsert({
    where: { clerkId },
    update: {}, // No fields to update if found
    create: {
      clerkId: clerkId,
      email: `user_${clerkId}@example.com`, // Provide a required email - adjust as needed
      // You might need to add defaults for other required fields in your User model
    },
    select: { id: true }, // Only select the internal ID
  });

  // User is guaranteed to exist now (found or created)

  if (!leadsData || leadsData.length === 0) {
    return { count: 0 }; // Nothing to save
  }

  // Map the input data to the format required by createMany
  const dataToCreate = leadsData.map((lead) => ({
    userId: user.id, // Use the guaranteed user.id from upsert
    businessName: lead.businessName,
    address: lead.address,
    phone: lead.phone,
    website: lead.website,
    overallScore: lead.overallScore,
    improvementScore: lead.improvementScore,
    issuesJson: lead.issuesJson,
    criticalIssuesJson: lead.criticalIssuesJson,
    outdatedTechJson: lead.outdatedTechJson,
  }));

  try {
    const result = await db.lead.createMany({
      data: dataToCreate,
      skipDuplicates: true, // Optional: Skip if a lead with a unique constraint violation is encountered
    });

    console.log(`Saved ${result.count} leads for user ${user.id}`);
    return { count: result.count };
  } catch (error) {
    console.error('Error saving multiple leads:', error);
    throw new Error('Failed to save selected leads.');
  }
}

// --- Add Delete Lead Action Below ---

/**
 * Deletes a specific saved lead for the currently authenticated user.
 * @param leadId - The ID of the lead to delete.
 * @returns Promise<{ success: boolean }> - Indicates if deletion was successful.
 */
export async function deleteLeadAction(leadId: string): Promise<{ success: boolean }> {
  // Explicitly await auth() and access userId
  const authResult = await auth();
  const clerkId = authResult?.userId;

  if (!clerkId) {
    console.error('User not authenticated [deleteLeadAction]');
    throw new Error('User not authenticated');
  }

  try {
    // Find the internal user ID based on the Clerk ID
    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) {
      console.error(`User with clerkId ${clerkId} not found in the database.`);
      throw new Error('User not found');
    }

    // Verify the lead belongs to the user before deleting
    const leadToDelete = await db.lead.findUnique({
      where: {
        id: leadId,
      },
      select: { userId: true }, // Select only userId for verification
    });

    if (!leadToDelete) {
      console.error(`Lead with ID ${leadId} not found.`);
      throw new Error('Lead not found');
    }

    if (leadToDelete.userId !== user.id) {
      console.error(`User ${user.id} attempted to delete lead ${leadId} owned by ${leadToDelete.userId}.`);
      throw new Error('Permission denied'); // Prevent deleting leads of other users
    }

    // Delete the lead
    await db.lead.delete({
      where: {
        id: leadId,
        // Redundant check, but ensures we only delete if user matches (though checked above)
        userId: user.id,
      },
    });

    console.log(`Deleted lead ${leadId} for user ${user.id}`);

    // Revalidate the path to update the UI after deletion
    revalidatePath('/saved-leads'); // Or the specific path where saved leads are displayed

    return { success: true };

  } catch (error) {
    console.error('Error deleting lead:', error);
    // Consider more specific error handling or re-throwing
    throw new Error('Failed to delete lead.');
  }
}