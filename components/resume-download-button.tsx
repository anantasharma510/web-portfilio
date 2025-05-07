"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function ResumeDownloadButton() {
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleDownload = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      // Path to your PDF file in the public folder
      const pdfUrl = '/resume.pdf' // Make sure to place your PDF in the public folder
      const fileName = 'Ananta_Sharma_Resume.pdf'
      
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a')
      a.href = pdfUrl
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      // Fallback for browsers that don't support the download attribute
      setTimeout(() => {
        window.open(pdfUrl, '_blank')
      }, 100)
    } catch (error) {
      console.error("Failed to download PDF:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isClient) {
    return (
      <Button size="lg" className="gap-2 relative overflow-hidden group w-full" disabled>
        <span
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0"
          style={{ transform: "translateX(-100%)" }}
        />
        <Download size={18} />
        Loading...
      </Button>
    )
  }

  return (
    <Button
      size="lg"
      className="gap-2 relative overflow-hidden group w-full"
      onClick={handleDownload}
      disabled={isLoading}
    >
      <span
        className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 group-hover:animate-shimmer"
        style={{ transform: "translateX(-100%)" }}
      />
      <Download size={18} />
      {isLoading ? "Downloading..." : "Download Resume"}
    </Button>
  )
}