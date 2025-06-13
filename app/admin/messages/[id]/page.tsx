import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect, notFound } from "next/navigation"
import clientPromise from "@/lib/mongodb"
import { getContactMessageById } from "@/lib/models/contactus"
import MessageDetail from "../../components/message-detail"
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

export default async function MessageDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  // Double-check authorization on the server side
  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  try {
    // Await params before accessing its properties
    const { id } = params

    // Validate the ID format
    if (!isValidObjectId(id)) {
      notFound()
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)
    const message = await getContactMessageById(db, id)

    if (!message) {
      notFound()
    }

    return (
      <div className="container py-8">
        <MessageDetail message={JSON.parse(JSON.stringify(message))} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching message:", error)
    notFound()
  }
}
