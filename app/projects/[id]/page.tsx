import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, ArrowLeft } from "lucide-react"
import clientPromise from "@/lib/mongodb"
import { getProjectById } from "@/lib/models/project"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  // No need to await params in page components, only in API routes
  const { id } = params

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
  // No need to await params in page components, only in API routes
  const { id } = params

  const session = await getServerSession(authOptions)
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  const project = await getProjectById(db, id)

  if (!project) {
    notFound()
  }

  const isAdmin = session?.user.role === "admin"

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/#projects"
            className="inline-flex items-center text-sm text-foreground/70 hover:text-primary transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>

          {isAdmin && (
            <Link href={`/admin/projects/edit/${project._id}`}>
              <Button variant="outline" size="sm">
                Edit Project
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative aspect-video overflow-hidden rounded-lg border bg-muted/20">
            <Image
              src={project.image || "/placeholder.svg?height=600&width=800"}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>

            <div className="flex flex-wrap gap-2 mt-4">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="hover:bg-primary/20 transition-colors">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-6 prose dark:prose-invert">
              <p className="text-lg">{project.description}</p>

              {project.longDescription && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-2">About this project</h2>
                  <p className="whitespace-pre-line text-foreground/80">{project.longDescription}</p>
                </div>
              )}

              {project.techStack && project.techStack.length > 0 && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-2">Tech Stack</h2>
                  <ul className="list-disc pl-5 text-foreground/80">
                    {project.techStack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.experience && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-2">My Experience</h2>
                  <p className="whitespace-pre-line text-foreground/80">{project.experience}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              {project.showDemo && project.demoUrl && (
                <Button asChild>
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}

              {project.showSource && project.sourceUrl && (
                <Button variant="outline" asChild>
                  <a
                    href={project.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    Source Code
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
