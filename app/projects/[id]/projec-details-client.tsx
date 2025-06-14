"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Github, ArrowLeft, Code, Lightbulb, Zap, Star } from "lucide-react"

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

interface ProjectDetailClientProps {
  project: Project
  isAdmin: boolean
}

export default function ProjectDetailClient({ project, isAdmin }: ProjectDetailClientProps) {
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
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="pt-24 pb-16"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex items-center justify-between"
            >
              <motion.div whileHover={{ x: -5 }} transition={{ duration: 0.2 }} className="group">
                <Link
                  href="/projects"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <motion.div whileHover={{ x: -3 }} transition={{ duration: 0.2 }}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                  </motion.div>
                  Back to Projects
                </Link>
              </motion.div>

              {isAdmin && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href={`/admin/projects/edit/${project._id}`}>
                    <Button variant="outline" size="sm">
                      Edit Project
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>

            {/* Main Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
            >
              {/* Image Section */}
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="relative aspect-video overflow-hidden rounded-2xl border bg-muted/20 shadow-2xl">
                  <Image
                    src={project.image || "/placeholder.svg?height=600&width=800"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                {/* Action Buttons */}
                <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                  {project.showDemo && project.demoUrl && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button asChild size="lg" className="w-full">
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Live Demo
                        </a>
                      </Button>
                    </motion.div>
                  )}

                  {project.showSource && project.sourceUrl && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button variant="outline" asChild size="lg" className="w-full">
                        <a
                          href={project.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <Github className="h-4 w-4" />
                          Source Code
                        </a>
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>

              {/* Content Section */}
              <motion.div variants={itemVariants} className="space-y-8">
                {/* Title and Tags */}
                <div className="space-y-4">
                  <motion.h1
                    variants={itemVariants}
                    className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                  >
                    {project.title}
                  </motion.h1>

                  <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
                    {project.tags.map((tag: string, index: number) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Badge variant="secondary" className="hover:bg-primary/20 transition-colors">
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Description */}
                {project.description && (
                  <motion.div variants={itemVariants} className="space-y-4">
                    <p className="text-lg text-muted-foreground leading-relaxed">{project.description}</p>
                  </motion.div>
                )}

                {/* Project Details Cards */}
                <motion.div variants={itemVariants} className="space-y-6">
                  {project.longDescription && (
                    <Card className="border-2 hover:border-primary/20 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Lightbulb className="h-5 w-5 text-primary" />
                          </div>
                          <h2 className="text-xl font-semibold">About this project</h2>
                        </div>
                        <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                          {project.longDescription}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {project.techStack && project.techStack.length > 0 && (
                    <Card className="border-2 hover:border-primary/20 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Code className="h-5 w-5 text-primary" />
                          </div>
                          <h2 className="text-xl font-semibold">Tech Stack</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {project.techStack.map((tech: string, index: number) => (
                            <motion.div
                              key={tech}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.8 + index * 0.1 }}
                              className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50"
                            >
                              <Star className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium">{tech}</span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {project.experience && (
                    <Card className="border-2 hover:border-primary/20 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Zap className="h-5 w-5 text-primary" />
                          </div>
                          <h2 className="text-xl font-semibold">My Experience</h2>
                        </div>
                        <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                          {project.experience}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
