import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import clientPromise from "@/lib/mongodb"
import { getContactMessages } from "@/lib/models/contactus"
import MessagesList from "../components/messages-list"
export default async function AdminMessagesPage() {
  const session = await getServerSession(authOptions)

  // Double-check authorization on the server side
  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  const messages = await getContactMessages(db)

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
      </div>

      <MessagesList initialMessages={JSON.parse(JSON.stringify(messages))} />
    </div>
  )
}
