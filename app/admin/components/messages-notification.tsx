"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Mail } from "lucide-react"

export default function MessagesNotification() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/contact/messages?limit=1")
        if (response.ok) {
          const data = await response.json()
          setUnreadCount(data.unreadCount || 0)
        }
      } catch (error) {
        console.error("Error fetching unread messages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUnreadCount()

    // Poll for new messages every minute
    const interval = setInterval(fetchUnreadCount, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading || unreadCount === 0) {
    return (
      <div className="flex items-center">
        <Mail className="h-5 w-5" />
        <span className="ml-2">Messages</span>
      </div>
    )
  }

  return (
    <div className="flex items-center">
      <div className="relative">
        <Mail className="h-5 w-5" />
        <Badge
          className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5 flex items-center justify-center"
          variant="destructive"
        >
          {unreadCount}
        </Badge>
      </div>
      <span className="ml-2">Messages</span>
    </div>
  )
}
