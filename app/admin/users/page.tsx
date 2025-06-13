import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import clientPromise from "@/lib/mongodb"
import { getAllUsers } from "@/lib/models/user"
import UsersList from "./users-list"

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  // Double-check authorization on the server side
  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  const users = await getAllUsers(db)

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Users</h1>
      </div>

      <UsersList initialUsers={JSON.parse(JSON.stringify(users))} currentUserEmail={session.user.email} />
    </div>
  )
}
