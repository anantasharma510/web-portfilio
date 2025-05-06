"use client"

import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="py-6 sm:py-8 border-t relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -20, 0],
          }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <motion.div
            className="text-center text-sm sm:text-base text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            © {new Date().getFullYear()} Ananta Sharma. All rights reserved.
          </motion.div>
          <motion.div
            className="text-center text-xs sm:text-sm text-muted-foreground mt-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Built with Next.js, Tailwind CSS, and Framer Motion
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
