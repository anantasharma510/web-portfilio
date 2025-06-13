"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Eye, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import type { Project } from "@/lib/models/project"

interface AdminProjectsListProps {
  initialProjects: Project[]
}

export default function AdminProjectsList({ initialProjects }: AdminProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/projects/${projectToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete project")
      }

      setProjects(projects.filter((project) => project._id?.toString() !== projectToDelete))
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      })
      router.refresh()
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
    }
  }

  // Mobile card view
  const MobileProjectCard = ({ project }: { project: Project }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative h-12 w-12 rounded overflow-hidden flex-shrink-0">
              <Image
                src={project.image || "/placeholder.svg?height=48&width=48"}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base font-medium truncate">{project.title}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/projects/${project._id}`} className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/projects/edit/${project._id}`} className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(project._id?.toString() || "")}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs bg-secondary px-2 py-1 rounded-full">+{project.tags.length - 3}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No projects found. Add your first project!
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project._id?.toString()}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded overflow-hidden">
                      <Image
                        src={project.image || "/placeholder.svg?height=48&width=48"}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{project.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs bg-secondary px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="text-xs bg-secondary px-2 py-1 rounded-full">+{project.tags.length - 3}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/projects/${project._id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </Link>
                      <Link href={`/admin/projects/edit/${project._id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(project._id?.toString() || "")}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found. Add your first project!</p>
          </div>
        ) : (
          projects.map((project) => <MobileProjectCard key={project._id?.toString()} project={project} />)
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="mx-4 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and remove the data from the
              server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel disabled={isDeleting} className="w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
