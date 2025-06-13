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

  return (
    <div className="pt-16 md:pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8 max-w-7xl">
        <div className="mb-4 md:mb-8">
          <AdminHeader user={session.user} />

          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Admin Dashboard</h1>

          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4 md:mb-8 h-auto p-1">
              <TabsTrigger value="projects" asChild className="text-xs md:text-sm py-2 md:py-3">
                <Link href="/admin/projects" className="flex items-center justify-center">
                  <span className="hidden sm:inline">Projects</span>
                  <span className="sm:hidden">Projects</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger value="messages" asChild className="text-xs md:text-sm py-2 md:py-3">
                <Link href="/admin/messages" className="flex items-center justify-center">
                  <MessagesNotification />
                </Link>
              </TabsTrigger>
              <TabsTrigger value="users" asChild className="text-xs md:text-sm py-2 md:py-3">
                <Link href="/admin/users" className="flex items-center justify-center">
                  <span className="hidden sm:inline">Users</span>
                  <span className="sm:hidden">Users</span>
                </Link>
              </TabsTrigger>
              <TabsTrigger value="settings" asChild className="text-xs md:text-sm py-2 md:py-3">
                <Link href="/admin/settings" className="flex items-center justify-center">
                  <span className="hidden sm:inline">Settings</span>
                  <span className="sm:hidden">Settings</span>
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {children}
      </div>
    </div>
  )
}
