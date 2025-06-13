import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, ArrowRight } from "lucide-react"
import clientPromise from "@/lib/mongodb"
import { getProjects } from "@/lib/models/project"

export const metadata: Metadata = {
  title: "Projects | My Portfolio",
  description: "Browse all my projects and case studies",
}

export default async function ProjectsPage() {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  const projects = await getProjects(db)

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 className="text-3xl font-bold mb-2">All Projects</h1>
        <p className="text-foreground/70 mb-8">Browse all my projects and case studies</p>

        {projects.length === 0 ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-foreground/50">No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project._id?.toString()}
                className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow border-2 hover:border-primary/20"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg?height=400&width=600"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                <CardHeader className="p-4">
                  <CardTitle className="text-lg group">
                    {project.title}
                    <span className="block h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-1" />
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-0 flex-grow">
                  <p className="text-foreground/70 text-sm line-clamp-2 mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="transition-all duration-300 hover:bg-primary/20">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 4 && <Badge variant="outline">+{project.tags.length - 4}</Badge>}
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex flex-wrap gap-2 mt-auto">
                  <div className="flex gap-2 flex-wrap w-full">
                    {project.showSource && project.sourceUrl && (
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <a
                          href={project.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Github size={16} />
                          <span>Source</span>
                        </a>
                      </Button>
                    )}

                    {project.showDemo && project.demoUrl && (
                      <Button size="sm" className="flex-1" asChild>
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <ExternalLink size={16} />
                          <span>Demo</span>
                        </a>
                      </Button>
                    )}

                    <Button variant="secondary" size="sm" className="w-full mt-2" asChild>
                      <Link href={`/projects/${project._id}`} className="flex items-center justify-center gap-2">
                        <span>View Details</span>
                        <ArrowRight size={16} />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
