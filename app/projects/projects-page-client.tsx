"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExternalLink, Github, ArrowRight, Search, Grid, List } from 'lucide-react'

interface Project {
  _id?: string
  title: string
  description?: string
  longDescription?: string
  experience?: string
  image?: string
  tags: string[]
  techStack?: string[]
  demoUrl?: string
  sourceUrl?: string
  showDemo?: boolean
  showSource?: boolean
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  createdAt?: string
  updatedAt?: string
}

interface ProjectsPageClientProps {
  projects: Project[]
}

export default function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Get all unique tags
  const allTags = Array.from(new Set(projects.flatMap((project) => project.tags)))

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTag = !selectedTag || project.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              All Projects
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore my complete portfolio of projects, from web applications to mobile apps and everything in between.
            </p>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 space-y-4"
          >
            {/* Search and View Toggle */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Tag Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(null)}
                className="text-xs"
              >
                All ({projects.length})
              </Button>
              {allTags.map((tag) => {
                const count = projects.filter((p) => p.tags.includes(tag)).length
                return (
                  <Button
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className="text-xs"
                  >
                    {tag} ({count})
                  </Button>
                )
              })}
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mb-6"
          >
            <p className="text-sm text-muted-foreground">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          </motion.div>

          {/* Projects Grid/List */}
          <AnimatePresence mode="wait">
            {filteredProjects.length === 0 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={`${viewMode}-${selectedTag}-${searchTerm}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className={`h-full flex ${viewMode === "list" ? "flex-row" : "flex-col"} overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 group`}
                    >
                      <div
                        className={`relative ${viewMode === "list" ? "w-48 h-32" : "h-48"} overflow-hidden bg-muted`}
                      >
                        <Image
                          src={project.image || "/placeholder.svg?height=400&width=600"}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes={
                            viewMode === "list" ? "192px" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          }
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      <div className="flex flex-col flex-grow">
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {project.title}
                            <span className="block h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-1" />
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="p-4 pt-0 flex-grow">
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 leading-relaxed">
                            {project.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {project.tags.slice(0, viewMode === "list" ? 6 : 4).map((tag: string) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs transition-all duration-300 hover:bg-primary/20 cursor-pointer"
                                onClick={() => setSelectedTag(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                            {project.tags.length > (viewMode === "list" ? 6 : 4) && (
                              <Badge variant="outline" className="text-xs">
                                +{project.tags.length - (viewMode === "list" ? 6 : 4)}
                              </Badge>
                            )}
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
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Github size={14} />
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
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink size={14} />
                                  <span>Demo</span>
                                </a>
                              </Button>
                            )}

                            <Button variant="secondary" size="sm" className="w-full mt-2 group" asChild>
                              <Link
                                href={`/projects/${project._id}`}
                                className="flex items-center justify-center gap-2"
                              >
                                <span>View Details</span>
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                              </Link>
                            </Button>
                          </div>
                        </CardFooter>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
