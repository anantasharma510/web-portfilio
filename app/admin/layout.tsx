import type React from "react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import MessagesNotification from "./components/messages-notification"
import AdminHeader from "./components/admin-header"


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  // Check if user is authenticated and is an admin
  if (!session || session.user.role !== "admin") {
    redirect("/unauthorized")
  }

  // We'll use client-side fetching for CSRF token instead of server-side generation
  // This avoids the cookie manipulation error

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-8">
          <AdminHeader user={session.user} />

          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="projects" asChild>
                <Link href="/admin/projects">Projects</Link>
              </TabsTrigger>
              <TabsTrigger value="messages" asChild>
                <Link href="/admin/messages">
                  <MessagesNotification />
                </Link>
              </TabsTrigger>
              <TabsTrigger value="users" asChild>
                <Link href="/admin/users">Users</Link>
              </TabsTrigger>
              <TabsTrigger value="settings" asChild>
                <Link href="/admin/settings">Settings</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {children}
      </div>
    </div>
  )
}
