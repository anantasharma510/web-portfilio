"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { X, Plus, Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import type { Project } from "@/lib/models/project"

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  longDescription: z.string().optional(),
  experience: z.string().optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  techStack: z.array(z.string()).optional().default([]),
  demoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  sourceUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  showDemo: z.boolean().default(true),
  showSource: z.boolean().default(true),
  seo: z
    .object({
      title: z.string().optional().or(z.literal("")),
      description: z.string().optional().or(z.literal("")),
      keywords: z.array(z.string()).optional().default([]),
    })
    .optional()
    .default({}),
})

type ProjectFormValues = z.infer<typeof projectSchema>

interface ProjectFormProps {
  project?: Project
  isEditing?: boolean
}

export default function ProjectForm({ project, isEditing = false }: ProjectFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(project?.image || null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Fix default values to ensure arrays are always initialized
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      longDescription: project?.longDescription || "",
      experience: project?.experience || "",
      tags: project?.tags || [],
      techStack: project?.techStack || [],
      demoUrl: project?.demoUrl || "",
      sourceUrl: project?.sourceUrl || "",
      showDemo: project?.showDemo ?? true,
      showSource: project?.showSource ?? true,
      seo: {
        title: project?.seo?.title || "",
        description: project?.seo?.description || "",
        keywords: project?.seo?.keywords || [],
      },
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>, field: any) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const input = e.currentTarget
      const value = input.value.trim()

      if (value && !field.value?.includes(value)) {
        // Fix: Ensure field.value is always an array
        field.onChange([...(Array.isArray(field.value) ? field.value : []), value])
        input.value = ""
      }
    }
  }

  const removeTag = (tag: string, field: any) => {
    // Fix: Ensure field.value is always an array before filtering
    if (Array.isArray(field.value)) {
      field.onChange(field.value.filter((t: string) => t !== tag))
    }
  }

  const onSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()

      // Add all form fields to FormData
      formData.append("title", values.title)
      formData.append("description", values.description)
      formData.append("longDescription", values.longDescription || "")
      formData.append("experience", values.experience || "")

      // Fix: Ensure tags is always an array before stringifying
      formData.append("tags", JSON.stringify(values.tags || []))

      // Fix: Ensure techStack is always an array before stringifying
      formData.append("techStack", JSON.stringify(values.techStack || []))

      formData.append("demoUrl", values.demoUrl || "")
      formData.append("sourceUrl", values.sourceUrl || "")
      formData.append("showDemo", String(values.showDemo))
      formData.append("showSource", String(values.showSource))

      // Fix: Ensure seo object is properly structured
      const seoData = {
        title: values.seo?.title || "",
        description: values.seo?.description || "",
        keywords: values.seo?.keywords || [],
      }
      formData.append("seo", JSON.stringify(seoData))

      // Add image if available
      if (imageFile) {
        formData.append("image", imageFile)
      }

      // Fix: Ensure project._id is available when editing
      const url = isEditing && project?._id ? `/api/projects/${project._id}` : "/api/projects"

      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to save project")
      }

      toast({
        title: isEditing ? "Project updated" : "Project created",
        description: isEditing
          ? "Your project has been updated successfully."
          : "Your project has been created successfully.",
      })

      router.push("/admin/projects")
      router.refresh()
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief description of your project" {...field} rows={3} />
                  </FormControl>
                  <FormDescription>This will be displayed in the project card.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="longDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Long Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detailed description of your project" {...field} rows={6} />
                  </FormControl>
                  <FormDescription>This will be displayed on the project details page.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Share your experience working on this project" {...field} rows={6} />
                  </FormControl>
                  <FormDescription>Share challenges, learnings, and your approach.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <div>
              <FormLabel>Project Image</FormLabel>
              <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                {imagePreview ? (
                  <div className="relative w-full">
                    <div className="relative h-48 w-full overflow-hidden rounded-lg">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Project preview"
                        fill
                        className="object-cover"
                        unoptimized={imagePreview.startsWith("data:")}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview(null)
                        setImageFile(null)
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ""
                        }
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={imagePreview ? "hidden" : "absolute inset-0 w-full h-full opacity-0 cursor-pointer"}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Array.isArray(field.value) &&
                      field.value.map((tag) => (
                        <div
                          key={tag}
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag, field)}
                            className="text-secondary-foreground/70 hover:text-secondary-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                  </div>
                  <FormControl>
                    <div className="flex">
                      <Input
                        placeholder="Add tags (press Enter or comma to add)"
                        onKeyDown={(e) => handleTagInput(e, field)}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        className="ml-2"
                        onClick={() => {
                          const input = document.activeElement as HTMLInputElement
                          if (input && input.value.trim()) {
                            const value = input.value.trim()
                            if (!Array.isArray(field.value) || !field.value.includes(value)) {
                              field.onChange([...(Array.isArray(field.value) ? field.value : []), value])
                              input.value = ""
                            }
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>Technologies, frameworks, or categories.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="techStack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tech Stack</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Array.isArray(field.value) &&
                      field.value.map((tech) => (
                        <div
                          key={tech}
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => removeTag(tech, field)}
                            className="text-secondary-foreground/70 hover:text-secondary-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                  </div>
                  <FormControl>
                    <div className="flex">
                      <Input
                        placeholder="Add tech stack (press Enter or comma to add)"
                        onKeyDown={(e) => handleTagInput(e, field)}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        className="ml-2"
                        onClick={() => {
                          const input = document.activeElement as HTMLInputElement
                          if (input && input.value.trim()) {
                            const value = input.value.trim()
                            if (!Array.isArray(field.value) || !field.value.includes(value)) {
                              field.onChange([...(Array.isArray(field.value) ? field.value : []), value])
                              input.value = ""
                            }
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>Specific technologies used in this project.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="demoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sourceUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Code URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username/repo" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="showDemo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show Demo Link</FormLabel>
                      <FormDescription>Display the live demo button on the project card.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showSource"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show Source Link</FormLabel>
                      <FormDescription>Display the source code button on the project card.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value || false} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">SEO Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="seo.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Title</FormLabel>
                  <FormControl>
                    <Input placeholder="SEO optimized title" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Leave blank to use project title.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seo.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="SEO optimized description" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>Leave blank to use project description.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seo.keywords"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>SEO Keywords</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Array.isArray(field.value) &&
                      field.value.map((keyword) => (
                        <div
                          key={keyword}
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeTag(keyword, field)}
                            className="text-secondary-foreground/70 hover:text-secondary-foreground"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                  </div>
                  <FormControl>
                    <div className="flex">
                      <Input
                        placeholder="Add keywords (press Enter or comma to add)"
                        onKeyDown={(e) => handleTagInput(e, field)}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        className="ml-2"
                        onClick={() => {
                          const input = document.activeElement as HTMLInputElement
                          if (input && input.value.trim()) {
                            const value = input.value.trim()
                            if (!Array.isArray(field.value) || !field.value.includes(value)) {
                              field.onChange([...(Array.isArray(field.value) ? field.value : []), value])
                              input.value = ""
                            }
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>Keywords for search engine optimization.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/projects")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>   
    </Form>
  )
}
