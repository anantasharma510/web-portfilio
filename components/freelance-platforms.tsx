"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export default function FreelancePlatforms() {
  const platforms = [
    {
      name: "Fiverr",
      url: "https://www.fiverr.com/sellers/anantasharma10",
      description: "Web development services",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#1DBF73]"
        >
          <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0" />
          <path d="M15.5 9.5l-3.5 3.5l-1.5 -1.5" />
        </svg>
      ),
    },
    {
      name: "Upwork",
      url: "https://www.upwork.com/freelancers/~01d2d1c7562375d532",
      description: "Full-stack development projects",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#6FDA44]"
        >
          <path d="M3 7v9a3 3 0 0 0 3 3h12a3 3 0 0 0 3 -3v-9" />
          <path d="M9 11l3 3l3 -3" />
          <path d="M12 14v-7" />
          <path d="M3 7h18" />
        </svg>
      ),
    },
  ]

  return (
    <div className="mt-8">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-xl font-bold mb-4"
      >
        Freelance Profiles
      </motion.h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {platforms.map((platform) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
          >
            <Card className="border-2 hover:border-primary/20 transition-colors duration-300 h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-background/80 p-2 rounded-full">{platform.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{platform.name}</h4>
                  <p className="text-sm text-muted-foreground">{platform.description}</p>
                </div>
                <Link
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink size={18} />
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
