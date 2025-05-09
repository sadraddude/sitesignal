'use server';

import { auth } from '@clerk/nextjs/server';
import { getSearchHistory, SearchHistoryItem } from '@/lib/search-history';

/**
 * Fetches the search history for the currently authenticated user.
 * @returns Promise<SearchHistoryItem[]> - An array of search history items.
 */
export async function getHistoryAction(): Promise<SearchHistoryItem[]> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    console.warn('Attempted to fetch search history without authenticated user.');
    return []; // Return empty array if not authenticated
  }

  try {
    const history = await getSearchHistory(clerkId);
    return history;
  } catch (error) {
    console.error('Error fetching search history via action:', error);
    return []; // Return empty array on error
  }
} 