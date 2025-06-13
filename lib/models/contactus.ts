import { ObjectId } from "mongodb"

export interface ContactMessage {
  _id?: ObjectId
  name: string
  email: string
  message: string
  read: boolean
  createdAt: Date
  updatedAt: Date
}

export async function createContactMessage(
  db: any,
  message: Omit<ContactMessage, "_id" | "read" | "createdAt" | "updatedAt">,
) {
  const result = await db.collection("contactMessages").insertOne({
    ...message,
    read: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return result.insertedId
}

export async function getContactMessages(db: any, limit?: number) {
  const query = db.collection("contactMessages").find({}).sort({ createdAt: -1 })

  if (limit) {
    return query.limit(limit).toArray()
  }

  return query.toArray()
}

export async function getContactMessageById(db: any, id: string) {
  const objectId = new ObjectId(id)
  return db.collection("contactMessages").findOne({ _id: objectId })
}

export async function markContactMessageAsRead(db: any, id: string) {
  const objectId = new ObjectId(id)
  return db.collection("contactMessages").updateOne(
    { _id: objectId },
    {
      $set: {
        read: true,
        updatedAt: new Date(),
      },
    },
  )
}

export async function deleteContactMessage(db: any, id: string) {
  const objectId = new ObjectId(id)
  return db.collection("contactMessages").deleteOne({ _id: objectId })
}

export async function getUnreadCount(db: any) {
  return db.collection("contactMessages").countDocuments({ read: false })
}
