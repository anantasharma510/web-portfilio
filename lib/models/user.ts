import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name?: string
  email: string
  image?: string
  emailVerified?: Date
  role: "user" | "admin"
  createdAt: Date
  updatedAt: Date
}

export async function getUserByEmail(email: string, db: any) {
  return db.collection("users").findOne({ email })
}

export async function createUser(userData: Omit<User, "_id">, db: any) {
  const result = await db.collection("users").insertOne(userData)
  return result.insertedId
}

export async function updateUser(email: string, update: Partial<User>, db: any) {
  return db.collection("users").updateOne({ email }, { $set: { ...update, updatedAt: new Date() } })
}

export async function getAllUsers(db: any) {
  return db.collection("users").find({}).sort({ createdAt: -1 }).toArray()
}

export async function updateUserRole(email: string, role: "user" | "admin", db: any) {
  return db.collection("users").updateOne({ email }, { $set: { role, updatedAt: new Date() } })
}
