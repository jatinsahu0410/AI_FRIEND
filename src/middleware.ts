import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoutes = createRouteMatcher(['/dashboard(.*)','/chat(.*)', '/create-chatbot(.*)']);


export default clerkMiddleware(async (auth, req) => {
    console.log("The user id is : ", auth);
    console.log('Route match:', isProtectedRoutes(req)); // Should log `true` for protected routes
    if (isProtectedRoutes(req)) {
        try {
            await auth.protect();
        } catch (error) {
            console.error('Authentication error:', error);
            throw error; // Ensure the request is terminated
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};