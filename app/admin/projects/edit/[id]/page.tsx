import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import clientPromise from "@/lib/mongodb"
import { getProjectById } from "@/lib/models/project"
import ProjectForm from "../../../components/project-form"


export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  // Double-check authorization on the server side
  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  // No need to await params in page components, only in API routes
  const { id } = params

  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  const project = await getProjectById(db, id)

  if (!project) {
    redirect("/admin/projects")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Project</h1>
      <ProjectForm project={JSON.parse(JSON.stringify(project))} isEditing />
    </div>
  )
}
