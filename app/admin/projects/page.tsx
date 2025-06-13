import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import clientPromise from "@/lib/mongodb"
import { getProjects } from "@/lib/models/project"
import AdminProjectsList from "../components/projects-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function AdminProjectsPage() {
  const session = await getServerSession(authOptions)

  // Double-check authorization on the server side
  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  const projects = await getProjects(db)

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <Link href="/admin/projects/new">
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            <span>Add New Project</span>
          </Button>
        </Link>
      </div>

      <AdminProjectsList initialProjects={JSON.parse(JSON.stringify(projects))} />
    </div>
  )
}
