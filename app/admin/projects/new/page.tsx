import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import ProjectForm from "../../components/project-form"

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions)

  // Double-check authorization on the server side
  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
      <ProjectForm />
    </div>
  )
}
