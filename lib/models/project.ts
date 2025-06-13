import { ObjectId } from "mongodb"

export interface Project {
  _id?: ObjectId
  title: string
  description: string
  longDescription?: string
  experience?: string
  image: string
  tags: string[]
  demoUrl?: string
  sourceUrl?: string
  showDemo: boolean
  showSource: boolean
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
  techStack?: string[]
  createdAt: Date
  updatedAt: Date
}

export async function getProjects(db: any, limit?: number) {
  const query = db.collection("projects").find({}).sort({ createdAt: -1 })

  if (limit) {
    return query.limit(limit).toArray()
  }

  return query.toArray()
}

export async function getProjectById(db: any, id: string) {
  const objectId = new ObjectId(id)
  return db.collection("projects").findOne({ _id: objectId })
}

export async function createProject(db: any, project: Omit<Project, "_id">) {
  const result = await db.collection("projects").insertOne({
    ...project,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return result.insertedId
}

export async function updateProject(db: any, id: string, project: Partial<Project>) {
  const objectId = new ObjectId(id)
  return db.collection("projects").updateOne(
    { _id: objectId },
    {
      $set: {
        ...project,
        updatedAt: new Date(),
      },
    },
  )
}

export async function deleteProject(db: any, id: string) {
  const objectId = new ObjectId(id)
  return db.collection("projects").deleteOne({ _id: objectId })
}
