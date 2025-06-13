import { NextResponse, type NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import clientPromise from "@/lib/mongodb"
import { getContactMessageById, markContactMessageAsRead, deleteContactMessage } from "@/lib/models/contactus"
import { ObjectId } from "mongodb"

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  try {
    new ObjectId(id)
    return true
  } catch (error) {
    return false
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before accessing its properties
    const { id } = await params

    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid message ID format" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const message = await getContactMessageById(db, id)

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    // Mark message as read if it's not already
    if (!message.read) {
      await markContactMessageAsRead(db, id)
    }

    return NextResponse.json({ message })
  } catch (error) {
    console.error("Error fetching contact message:", error)
    return NextResponse.json({ error: "Failed to fetch message" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before accessing its properties
    const { id } = await params

    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid message ID format" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const result = await deleteContactMessage(db, id)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Message deleted successfully" })
  } catch (error) {
    console.error("Error deleting contact message:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before accessing its properties
    const { id } = await params

    // Validate the ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid message ID format" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const result = await markContactMessageAsRead(db, id)

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Message marked as read" })
  } catch (error) {
    console.error("Error updating contact message:", error)
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
  }
}
