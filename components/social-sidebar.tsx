"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Twitter, Instagram } from "lucide-react"
import Link from "next/link"

export default function SocialSidebar() {
  const socialLinks = [
    { icon: Github, href: "https://github.com/anantasharma", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/in/anantasharma", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com/anantasharma", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/anantasharma", label: "Instagram" },
    { icon: Mail, href: "mailto:ananta.sharma@example.com", label: "Email" },
  ]

  return (
    <motion.div
      className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="flex flex-col items-center gap-5 bg-background/80 backdrop-blur-sm p-3 rounded-r-lg shadow-md border border-l-0">
        {socialLinks.map((link, index) => (
          <motion.div
            key={link.label}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
            whileHover={{ scale: 1.2, color: "hsl(var(--primary))" }}
            className="relative group"
          >
            <Link
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="text-foreground/70 hover:text-primary transition-colors duration-300"
            >
              <link.icon size={20} />
            </Link>
            <motion.span
              className="absolute left-full ml-2 px-2 py-1 bg-background/90 backdrop-blur-sm text-xs rounded shadow-sm border whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible"
              initial={{ x: -5, opacity: 0 }}
              whileHover={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {link.label}
            </motion.span>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="h-20 w-px bg-gradient-to-b from-primary/50 to-transparent mt-2"
        initial={{ height: 0 }}
        animate={{ height: 80 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      />
    </motion.div>
  )
}
