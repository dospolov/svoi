import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server"

export default convexAuthNextjsMiddleware()

export const config = {
  matcher: [
    /*
     * Run on all routes except Next internals/static assets.
     * This enables `/api/auth` proxying + cookie refresh.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

