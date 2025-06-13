"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Trash2, Reply } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import type { ContactMessage } from "@/lib/models/contactus"

interface MessageDetailProps {
  message: ContactMessage
}

export default function MessageDetail({ message }: MessageDetailProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/contact/${message._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete message")
      }

      toast({
        title: "Message deleted",
        description: "The message has been successfully deleted.",
      })
      router.push("/admin/messages")
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
    }
  }

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return format(date, "MMMM d, yyyy 'at' h:mm a")
  }

  return (
    <>
      <div className="mb-4 md:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link href="/admin/messages" className="flex items-center text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Messages
        </Link>
        <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} className="w-full sm:w-auto">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Message
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-xl md:text-2xl break-words">{message.name}</CardTitle>
              <CardDescription className="flex items-center mt-1 break-all">
                <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
                <a href={`mailto:${message.email}`} className="text-primary hover:underline">
                  {message.email}
                </a>
              </CardDescription>
            </div>
            <div className="flex items-center">
              {message.read ? <Badge variant="outline">Read</Badge> : <Badge variant="default">New</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-muted-foreground">Received on {formatDate(message.createdAt)}</div>
          <div className="bg-muted/50 p-4 rounded-md whitespace-pre-wrap break-words">{message.message}</div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/admin/messages">Back to Messages</Link>
          </Button>
          <Button variant="default" asChild className="w-full sm:w-auto">
            <a
              href={`mailto:${message.email}?subject=Re: Contact Form Submission`}
              className="flex items-center justify-center"
            >
              <Reply className="mr-2 h-4 w-4" />
              Reply via Email
            </a>
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="mx-4 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message from {message.name} and remove it
              from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel disabled={isDeleting} className="w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
