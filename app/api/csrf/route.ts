import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import crypto from "crypto"
import { cookies } from "next/headers"

// Generate a CSRF token and set it in a cookie
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  // Only authenticated users can get a CSRF token
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Generate a new CSRF token
  const token = crypto.randomBytes(32).toString("hex")

  // Set the token in a cookie - await cookies() before using it
  const cookieStore = await cookies()
  cookieStore.set("csrf-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  })

  // Return the token to the client
  return NextResponse.json({ csrfToken: token })
}
