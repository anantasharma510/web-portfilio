"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User, Settings, Home } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

interface AdminHeaderProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Function to handle logout
  const handleLogout = () => {
    // Sign out and redirect to home
    signOut({ callbackUrl: "/" })
  }

  // Get last login time from localStorage
  const lastLogin = typeof window !== "undefined" ? localStorage.getItem("lastLogin") : null

  // Set current login time
  useEffect(() => {
    localStorage.setItem("lastLogin", new Date().toISOString())
  }, [])

  return (
    <div className="flex justify-between items-center mb-4 md:mb-6">
      <Link
        href="/"
        className="text-sm md:text-lg font-semibold hover:text-primary transition-colors flex items-center gap-1 md:gap-2"
      >
        <Home className="h-4 w-4 md:h-5 md:w-5" />
        <span className="hidden sm:inline">Back to Website</span>
        <span className="sm:hidden">Home</span>
      </Link>

      <div className="flex items-center gap-2 md:gap-4">
        <Badge variant="outline" className="bg-primary/5 border-primary/10 text-xs md:text-sm px-2 py-1">
          {isMobile ? "Admin" : "Admin Session"}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 md:h-10 md:w-10 rounded-full p-0">
              <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-primary/10">
                <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs md:text-sm">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 md:w-64" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none truncate">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                {lastLogin && !isMobile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Last login: {new Date(lastLogin).toLocaleString()}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer flex w-full items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer flex w-full items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
