"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreVertical, Shield, UserIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import type { User } from "@/lib/models/user"

interface UsersListProps {
  initialUsers: User[]
  currentUserEmail: string
}

export default function UsersList({ initialUsers, currentUserEmail }: UsersListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newRole, setNewRole] = useState<"user" | "admin">("user")
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleRoleChange = (user: User, role: "user" | "admin") => {
    // Don't allow changing your own role
    if (user.email === currentUserEmail) {
      toast({
        title: "Cannot change your own role",
        description: "You cannot change your own role to prevent being locked out.",
        variant: "destructive",
      })
      return
    }

    setSelectedUser(user)
    setNewRole(role)
    setConfirmDialogOpen(true)
  }

  const handleConfirmRoleChange = async () => {
    if (!selectedUser) return

    setIsUpdating(true)
    try {
      const response = await fetch(`/api/users/${encodeURIComponent(selectedUser.email)}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update user role")
      }

      // Update the user in the local state
      setUsers(users.map((user) => (user.email === selectedUser.email ? { ...user, role: newRole } : user)))

      toast({
        title: "Role updated",
        description: `${selectedUser.name || selectedUser.email}'s role has been updated to ${newRole}.`,
      })
      router.refresh()
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
      setConfirmDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return format(date, "MMM d, yyyy")
  }

  const getInitials = (name: string | undefined) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Mobile card view
  const MobileUserCard = ({ user }: { user: User }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-base font-medium truncate">{user.name || "No name"}</CardTitle>
                <Badge variant={user.role === "admin" ? "default" : "outline"} className="text-xs">
                  {user.role}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground mt-1">Joined {formatDate(user.createdAt)}</p>
            </div>
          </div>
          {user.email !== currentUserEmail && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user.role === "user" ? (
                  <DropdownMenuItem onClick={() => handleRoleChange(user, "admin")} className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Make Admin
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => handleRoleChange(user, "user")} className="flex items-center">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Remove Admin
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
    </Card>
  )

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">User</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id?.toString()}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.name || "No name"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "outline"}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    {user.email !== currentUserEmail ? (
                      <div className="flex justify-end gap-2">
                        {user.role === "user" ? (
                          <Button variant="outline" size="sm" onClick={() => handleRoleChange(user, "admin")}>
                            Make Admin
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleRoleChange(user, "user")}>
                            Remove Admin
                          </Button>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Current User</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No users found.</p>
          </div>
        ) : (
          users.map((user) => <MobileUserCard key={user._id?.toString()} user={user} />)
        )}
      </div>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="mx-4 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
            <AlertDialogDescription>
              {newRole === "admin"
                ? `Are you sure you want to give admin privileges to ${
                    selectedUser?.name || selectedUser?.email
                  }? This will grant them full access to the admin dashboard.`
                : `Are you sure you want to remove admin privileges from ${
                    selectedUser?.name || selectedUser?.email
                  }? They will no longer have access to the admin dashboard.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel disabled={isUpdating} className="w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRoleChange}
              disabled={isUpdating}
              className={`${newRole === "admin" ? "bg-amber-600 hover:bg-amber-700" : ""} w-full sm:w-auto`}
            >
              {isUpdating ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
