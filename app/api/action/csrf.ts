"use server"

import { cookies } from "next/headers"

export async function verifyCsrfToken(token: string): Promise<boolean> {
  const cookieStore = await cookies()
  const storedToken = cookieStore.get("csrf-token")?.value
  return storedToken === token
}

export async function getCsrfToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get("csrf-token")?.value
}
