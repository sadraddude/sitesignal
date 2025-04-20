import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes (accessible without login)
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', // Sign-in page
  '/sign-up(.*)', // Sign-up page
  '/',            // Landing page (assuming it's public)
  // Add any other public pages or API routes here (e.g., pricing, marketing pages)
  // '/api/public-route(.*)' 
]);

export default clerkMiddleware((auth, req) => {
  // If the route is public, do nothing and allow access.
  if (isPublicRoute(req)) {
    return; 
  }

  // For all other routes, the default behavior of clerkMiddleware 
  // when not returning should be to apply protection.
  // No explicit auth().protect() call needed here based on this assumption.
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!.*\\..*|_next).*)', 
    // Match root and api routes
    '/', 
    '/(api|trpc)(.*)'
  ],
}; 