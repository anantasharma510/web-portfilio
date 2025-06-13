"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Trash2, Mail, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import type { ContactMessage } from "@/lib/models/contactus"

interface MessagesListProps {
  initialMessages: ContactMessage[]
}

export default function MessagesList({ initialMessages }: MessagesListProps) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages || [])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDeleteClick = (messageId: string) => {
    setMessageToDelete(messageId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/contact/${messageToDelete}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete message")
      }

      setMessages(messages.filter((message) => message._id?.toString() !== messageToDelete))
      toast({
        title: "Message deleted",
        description: "The message has been successfully deleted.",
      })
      router.refresh()
    } catch (error) {
      console.error("Error deleting message:", error)
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setMessageToDelete(null)
    }
  }

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return format(date, "MMM d, yyyy 'at' h:mm a")
  }

  const formatDateMobile = (dateString: string | Date) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return format(date, "MMM d, yyyy")
  }

  // Mobile card view
  const MobileMessageCard = ({ message }: { message: ContactMessage }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-base font-medium truncate">{message.name}</CardTitle>
                {message.read ? (
                  <Badge variant="outline" className="text-xs">
                    Read
                  </Badge>
                ) : (
                  <Badge variant="default" className="text-xs">
                    New
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">{message.email}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatDateMobile(message.createdAt)}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/admin/messages/${message._id}`} className="flex items-center">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(message._id?.toString() || "")}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
      </CardContent>
    </Card>
  )

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!messages || messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              messages.map((message) => (
                <TableRow key={message._id?.toString()}>
                  <TableCell>
                    {message.read ? <Badge variant="outline">Read</Badge> : <Badge variant="default">New</Badge>}
                  </TableCell>
                  <TableCell className="font-medium">{message.name}</TableCell>
                  <TableCell>
                    <a href={`mailto:${message.email}`} className="text-primary hover:underline">
                      {message.email}
                    </a>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">{message.message}</TableCell>
                  <TableCell>{formatDate(message.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/messages/${message._id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(message._id?.toString() || "")}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {!messages || messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No messages found.</p>
          </div>
        ) : (
          messages.map((message) => <MobileMessageCard key={message._id?.toString()} message={message} />)
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="mx-4 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message and remove the data from the
              server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel disabled={isDeleting} className="w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
