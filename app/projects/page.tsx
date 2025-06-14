import type { Metadata } from "next"
import clientPromise from "@/lib/mongodb"
import { getProjects } from "@/lib/models/project"
import ProjectsPageClient from "./projects-page-client"

export const metadata: Metadata = {
  title: "Projects | My Portfolio",
  description: "Browse all my projects and case studies",
}

export default async function ProjectsPage() {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  const projects = await getProjects(db)

  return <ProjectsPageClient projects={projects} />
}
