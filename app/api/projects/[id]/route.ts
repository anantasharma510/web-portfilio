import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getProjectById, updateProject, deleteProject } from "@/lib/models/project"
import { uploadImage, deleteImage } from "@/lib/cloudinary"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    // Await params before accessing its properties
    const { id } = await params

    const project = await getProjectById(db, id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before accessing its properties
    const { id } = await params

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    // Get existing project to check if we need to delete old image
    const existingProject = await getProjectById(db, id)
    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const longDescription = formData.get("longDescription") as string
    const experience = formData.get("experience") as string
    const tags = JSON.parse(formData.get("tags") as string)
    const techStack = JSON.parse(formData.get("techStack") as string)
    const demoUrl = formData.get("demoUrl") as string
    const sourceUrl = formData.get("sourceUrl") as string
    const showDemo = formData.get("showDemo") === "true"
    const showSource = formData.get("showSource") === "true"
    const seo = JSON.parse(formData.get("seo") as string)

    // Handle image upload if a new image is provided
    const imageFile = formData.get("image") as File | null
    let imageUrl = existingProject.image

    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`

      const uploadResult = await uploadImage(base64Image)
      imageUrl = uploadResult.url

      // Delete old image if it exists
      if (existingProject.image && existingProject.image.includes("cloudinary")) {
        // Extract public_id from the URL
        const publicId = existingProject.image.split("/").slice(-2).join("/").split(".")[0]

        if (publicId) {
          await deleteImage(publicId)
        }
      }
    }

    const project = {
      title,
      description,
      longDescription,
      experience,
      image: imageUrl,
      tags,
      techStack,
      demoUrl,
      sourceUrl,
      showDemo,
      showSource,
      seo,
      updatedAt: new Date(),
    }

    await updateProject(db, id, project)

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
    })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Await params before accessing its properties
    const { id } = await params

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    // Get project to delete image from Cloudinary
    const project = await getProjectById(db, id)

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Delete image from Cloudinary if it exists
    if (project.image && project.image.includes("cloudinary")) {
      // Extract public_id from the URL
      const publicId = project.image.split("/").slice(-2).join("/").split(".")[0]

      if (publicId) {
        await deleteImage(publicId)
      }
    }

    await deleteProject(db, id)

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
