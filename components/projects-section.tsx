"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, useInView } from "framer-motion"
import { ExternalLink, Github, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import axios from "axios"
import type { Project } from "@/lib/models/project"

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredProject, setHoveredProject] = useState<string | number | null>(null)

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  // Limit to 6 projects for the main section
  const displayedProjects = projects.slice(0, 6)
  const hasMoreProjects = projects.length > 6

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get("/api/projects", {
          timeout: 8000,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          decompress: true,
          validateStatus: (status) => status >= 200 && status < 300,
        })

        const data = response.data

        // Flexible data parsing to handle different API response structures
        let projectsArray: Project[] = []

        if (data && Array.isArray(data)) {
          projectsArray = data
        } else if (data && data.projects && Array.isArray(data.projects)) {
          projectsArray = data.projects
        } else if (data && data.data && Array.isArray(data.data)) {
          projectsArray = data.data
        } else {
          const possibleArrays = Object.values(data || {}).filter(Array.isArray)
          if (possibleArrays.length > 0) {
            projectsArray = possibleArrays[0] as Project[]
          }
        }

        setProjects(projectsArray)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.code === "ECONNABORTED") {
            setError("Request timeout. The server is taking too long to respond.")
          } else if (error.response) {
            const status = error.response.status
            const statusText = error.response.statusText
            setError(`Server error: ${status} - ${statusText}`)
          } else if (error.request) {
            setError("Network error. Please check your internet connection.")
          } else {
            setError(`Request failed: ${error.message}`)
          }
        } else {
          setError(error instanceof Error ? error.message : "An unknown error occurred")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleRetry = () => {
    window.location.reload()
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }, // Faster stagger for more items
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }, // Faster animation
  }

  // Loading state with 6 skeleton cards
  if (loading) {
    return (
      <section id="projects" className="py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-bold text-center mb-2">My Projects</h2>
            <p className="text-center text-muted-foreground mb-8">Loading my latest projects...</p>
          </motion.div>

          {/* Skeleton loading cards - 6 cards in new grid layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="h-full overflow-hidden animate-pulse">
                <div className="h-32 sm:h-40 bg-muted/50"></div>
                <CardHeader className="p-3 sm:p-4">
                  <div className="h-5 bg-muted/50 rounded mb-2"></div>
                  <div className="h-3 bg-muted/50 rounded w-3/4"></div>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex gap-1">
                    <div className="h-5 bg-muted/50 rounded w-12"></div>
                    <div className="h-5 bg-muted/50 rounded w-16"></div>
                  </div>
                </CardContent>
                <CardFooter className="p-3 sm:p-4 pt-0">
                  <div className="h-7 bg-muted/50 rounded w-16 mr-2"></div>
                  <div className="h-7 bg-muted/50 rounded w-14"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section id="projects" className="py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">My Projects</h2>
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-6 mb-8 max-w-lg mx-auto">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-destructive/20 rounded-full">
              <ExternalLink className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-destructive">Failed to Load Projects</h3>
            <p className="text-destructive/80 mb-4">{error}</p>
            <Button onClick={handleRetry} variant="outline" className="border-destructive/20 hover:bg-destructive/10">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  // No projects state
  if (projects.length === 0) {
    return (
      <section id="projects" className="py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">My Projects</h2>
          <div className="py-12">
            <p className="text-muted-foreground mb-4">No projects found.</p>
            <Button onClick={handleRetry} variant="outline">
              Refresh
            </Button>
          </div>
        </div>
      </section>
    )
  }

  // Main render with projects
  return (
    <section id="projects" className="py-12 md:py-16 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl font-bold text-center mb-2">My Projects</h2>
          <p className="text-center text-muted-foreground mb-8">
            Here are some of my recent projects that showcase my skills and expertise.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8"
        >
          {displayedProjects.map((project, index) => {
            const projectId = project._id?.toString() || project.id?.toString() || `project-${index}`

            return (
              <motion.div
                key={projectId}
                variants={item}
                onMouseEnter={() => setHoveredProject(projectId)}
                onMouseLeave={() => setHoveredProject(null)}
                whileHover={{ y: -3 }} // Smaller hover effect
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <Link href={`/projects/${projectId}`} className="block h-full">
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-2 hover:border-primary/20 flex flex-col">
                    {/* Smaller image container */}
                    <div className="relative overflow-hidden h-32 sm:h-40 bg-muted">
                      <Image
                        src={project.image || "/placeholder.svg?height=300&width=400"}
                        alt={project.title || "Project"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={`object-cover transition-transform duration-500 ${
                          hoveredProject === projectId ? "scale-110" : "scale-100"
                        }`}
                        priority={index < 3} // Priority for first 3 images
                        loading={index < 3 ? "eager" : "lazy"}
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 transition-opacity duration-300 ${
                          hoveredProject === projectId ? "opacity-70" : ""
                        }`}
                      />
                    </div>

                    <div className="flex flex-col flex-grow">
                      {/* Compact header */}
                      <CardHeader className="p-3 sm:p-4">
                        <CardTitle className="text-base sm:text-lg group leading-tight">
                          {project.title || "Untitled Project"}
                          <span className="block h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-1" />
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm pt-1 line-clamp-2">
                          {project.description || "No description available"}
                        </CardDescription>
                      </CardHeader>

                      {/* Compact content */}
                      <CardContent className="p-3 sm:p-4 pt-0 flex-grow">
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(project.tags) && project.tags.length > 0 ? (
                            <>
                              {project.tags.slice(0, 3).map((tag, tagIndex) => (
                                <Badge
                                  key={`${projectId}-tag-${tagIndex}`}
                                  variant="secondary"
                                  className="text-xs px-2 py-0.5"
                                >
                                  {tag}
                                </Badge>
                              ))}
                              {project.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                  +{project.tags.length - 3}
                                </Badge>
                              )}
                            </>
                          ) : (
                            <Badge variant="outline" className="text-xs px-2 py-0.5">
                              No tags
                            </Badge>
                          )}
                        </div>
                      </CardContent>

                      {/* Compact footer */}
                      <CardFooter className="flex gap-2 p-3 sm:p-4 pt-0 mt-auto">
                        {project.showSource && project.sourceUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs h-8"
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <a
                              href={project.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github size={14} />
                              Source
                            </a>
                          </Button>
                        )}

                        {project.showDemo && project.demoUrl && (
                          <Button size="sm" className="flex-1 text-xs h-8" asChild onClick={(e) => e.stopPropagation()}>
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink size={14} />
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

        {/* "View All" Button - Show count if there are more projects */}
        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/projects">
              <Button variant="outline" className="gap-2 group">
                <span>
                  View All Projects
                  {hasMoreProjects && <span className="ml-1 text-muted-foreground">({projects.length})</span>}
                </span>
                <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
