import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"
import { updateUserRole, getUserByEmail } from "@/lib/models/user"
import { z } from "zod"

const roleSchema = z.object({
  role: z.enum(["user", "admin"]),
})

export async function PATCH(request: NextRequest, { params }: { params: { email: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Only allow admin users to update roles
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before accessing its properties
    const { email } = await params
    const decodedEmail = decodeURIComponent(email)
    const body = await request.json()

    // Validate the role
    const result = roleSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid role. Must be 'user' or 'admin'." }, { status: 400 })
    }

    const { role } = result.data

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    // Check if user exists
    const user = await getUserByEmail(decodedEmail, db)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Don't allow changing your own role to prevent locking yourself out
    if (decodedEmail === session.user.email) {
      return NextResponse.json({ error: "You cannot change your own role" }, { status: 400 })
    }

    await updateUserRole(decodedEmail, role, db)

    return NextResponse.json({
      success: true,
      message: `User role updated to ${role}`,
    })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
  }
}
