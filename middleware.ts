import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // If it's the admin path, apply security checks
  if (path.startsWith("/admin")) {
    // Skip checks for static assets
    if (path.includes("/_next/") || path.includes("/static/")) {
      return NextResponse.next()
    }

    // Get session token
    const session = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // If not authenticated or not an admin, redirect to unauthorized page
    if (!session || session.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    // Check session expiration (force re-login after 1 hour)
    const sessionIssued = session.iat ? session.iat * 1000 : 0
    const sessionAge = Date.now() - sessionIssued
    const MAX_SESSION_AGE = 60 * 60 * 1000 // 1 hour

    if (sessionAge > MAX_SESSION_AGE) {
      return NextResponse.redirect(new URL("/api/auth/signin?error=SessionExpired", request.url))
    }

    // If all checks pass, allow access
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
