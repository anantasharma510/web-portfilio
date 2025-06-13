import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"
import { getContactMessages, getUnreadCount } from "@/lib/models/contactus"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    // Get query parameters
    const url = new URL(request.url)
    const limitParam = url.searchParams.get("limit")
    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined

    // Validate limit is a number if provided
    if (limitParam && isNaN(limit!)) {
      return NextResponse.json({ error: "Invalid limit parameter" }, { status: 400 })
    }

    const messages = await getContactMessages(db, limit)
    const unreadCount = await getUnreadCount(db)

    return NextResponse.json({
      messages,
      unreadCount,
      total: messages.length,
    })
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
