import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  // Only authenticated users can verify CSRF tokens
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { token } = await request.json()
    const cookieStore = await cookies()
    const storedToken = cookieStore.get("csrf-token")?.value

    if (!token || !storedToken || token !== storedToken) {
      return NextResponse.json({ valid: false }, { status: 403 })
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
