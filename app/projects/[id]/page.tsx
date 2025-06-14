import type { Metadata } from "next"
import { notFound } from "next/navigation"
import clientPromise from "@/lib/mongodb"
import { getProjectById } from "@/lib/models/project"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import ProjectDetailClient from "./projec-details-client"

interface ProjectPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  // Await params before accessing its properties
  const { id } = await params

  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  const project = await getProjectById(db, id)

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  return {
    title: project.seo?.title || project.title,
    description: project.seo?.description || project.description,
    keywords: project.seo?.keywords || project.tags,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  // Await params before accessing its properties
  const { id } = await params

  const session = await getServerSession(authOptions)
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  const project = await getProjectById(db, id)

  if (!project) {
    notFound()
  }

  const isAdmin = session?.user.role === "admin"

  // Convert MongoDB object to plain object for client component
  const plainProject = {
    _id: project._id?.toString(),
    title: project.title,
    description: project.description,
    longDescription: project.longDescription,
    experience: project.experience,
    image: project.image,
    tags: project.tags,
    techStack: project.techStack,
    demoUrl: project.demoUrl,
    sourceUrl: project.sourceUrl,
    showDemo: project.showDemo,
    showSource: project.showSource,
    seo: project.seo,
    createdAt: project.createdAt?.toISOString(),
    updatedAt: project.updatedAt?.toISOString(),
  }

  return <ProjectDetailClient project={plainProject} isAdmin={isAdmin} />
}
