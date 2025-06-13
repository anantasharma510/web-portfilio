"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, useInView } from "framer-motion"
import { ExternalLink, Github, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Project } from "@/lib/models/project"

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredProject, setHoveredProject] = useState<string | number | null>(null)

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects")

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()

        if (data && data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects)
        } else {
          setProjects([])
          throw new Error("Invalid data format received from API")
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
        setError(error instanceof Error ? error.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  // Render loading state
  if (loading) {
    return (
      <section id="projects" className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">My Projects</h2>
          <p className="text-muted-foreground mb-8">Loading projects, please wait...</p>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  // Render error state if no projects and there was an error
  if (projects.length === 0 && error) {
    return (
      <section id="projects" className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">My Projects</h2>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md p-6 mb-8 max-w-lg mx-auto">
            <p className="text-yellow-800 dark:text-yellow-200 mb-4">Unable to load projects. {error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl font-bold text-center mb-2">My Projects</h2>
          <p className="text-center text-muted-foreground mb-8">
            Here are some of my recent projects that showcase my skills and expertise.
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found.</p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-12"
          >
            {projects.map((project, index) => {
              const projectId = project._id?.toString() || `project-${index}`
              return (
                <motion.div
                  key={projectId}
                  variants={item}
                  onMouseEnter={() => setHoveredProject(projectId)}
                  onMouseLeave={() => setHoveredProject(null)}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/projects/${projectId}`} className="block h-full">
                    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/20 flex flex-col">
                      <div className="relative overflow-hidden h-48 md:h-64">
                        <Image
                          src={project.image || "/placeholder.svg?height=400&width=600"}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className={`object-cover transition-transform duration-500 ${
                            hoveredProject === projectId ? "scale-110" : "scale-100"
                          }`}
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 transition-opacity duration-300 ${
                            hoveredProject === projectId ? "opacity-70" : ""
                          }`}
                        />
                      </div>
                      <div className="flex flex-col flex-grow">
                        <CardHeader className="p-4 sm:p-6">
                          <CardTitle className="text-lg sm:text-xl group">
                            {project.title}
                            <span className="block h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-1" />
                          </CardTitle>
                          <CardDescription className="text-sm sm:text-base pt-2">{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 flex-grow">
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(project.tags) &&
                              project.tags.slice(0, 4).map((tag, tagIndex) => (
                                <Badge key={`${projectId}-tag-${tagIndex}`} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            {Array.isArray(project.tags) && project.tags.length > 4 && (
                              <Badge variant="outline">+{project.tags.length - 4}</Badge>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex flex-wrap gap-2 p-4 sm:p-6 pt-0 mt-auto">
                          {project.showSource && project.sourceUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 min-w-[120px]"
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <a
                                href={project.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Github size={16} />
                                Source
                              </a>
                            </Button>
                          )}

                          {project.showDemo && project.demoUrl && (
                            <Button
                              size="sm"
                              className="flex-1 min-w-[120px]"
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink size={16} />
                                Demo
                              </a>
                            </Button>
                          )}
                        </CardFooter>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* "View All" Button */}
        {projects.length > 0 && (
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/projects">
                <Button variant="outline" className="gap-2 group">
                  <span>View All Projects</span>
                  <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
