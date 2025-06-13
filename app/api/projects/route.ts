import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { createProject, getProjects } from "@/lib/models/project"
import { uploadImage } from "@/lib/cloudinary"

export async function GET() {
  try {
    console.log("API: Fetching projects")
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    const projects = await getProjects(db)
    console.log(`API: Found ${projects?.length || 0} projects`)

    // Ensure we're returning a proper JSON structure with projects array
    return NextResponse.json({
      projects: projects || [],
    })
  } catch (error) {
    console.error("API Error fetching projects:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch projects",
        projects: [],
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

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

    // Handle image upload
    const imageFile = formData.get("image") as File
    let imageUrl = ""

    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`

      const uploadResult = await uploadImage(base64Image)
      imageUrl = uploadResult.url
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
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const projectId = await createProject(db, project)

    return NextResponse.json({
      success: true,
      projectId,
      message: "Project created successfully",
    })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
