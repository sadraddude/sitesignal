import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/(.*)',
  '/api/city-suggestions(.*)',
  // Add any other genuinely public routes here
]);

// Define protected routes explicitly for clarity if needed (optional)
// const isProtectedRoute = createRouteMatcher([
//   '/dashboard(.*)',
//   '/lead-discovery(.*)',
//   '/settings(.*)',
// ]);

// Revert to standard Clerk middleware pattern
export default clerkMiddleware(async (auth, request) => {
  // If the route is not public, check authentication
  if (!isPublicRoute(request)) {
    const { userId } = await auth(); // Await and get auth state

    // If the user is not signed in, redirect them to the sign-in page
    if (!userId) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirect_url', request.url); // Optional: redirect back after sign-in
      console.log(`Redirecting unauthenticated user to: ${signInUrl.toString()}`);
      return NextResponse.redirect(signInUrl);
    }
    // User is signed in, allow request to proceed implicitly
  }
  // Allow public routes to proceed implicitly
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Exclude files with extensions and _next paths
    '/', // Include the root route
    '/(api|trpc)(.*)', // Include API routes
  ],
}; 