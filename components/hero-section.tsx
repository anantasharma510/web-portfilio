"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Download, Send, ArrowDown } from "lucide-react"
import Image from "next/image"
import { TypeAnimation } from "react-type-animation"
import { useEffect, useState } from "react"

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true) // Indicate that we're on the client
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const calculateMovement = (axis: "x" | "y", intensity = 0.02) => {
    if (!isClient) return 0 // Prevent error during SSR
    const center = axis === "x" ? window.innerWidth / 2 : window.innerHeight / 2
    const position = axis === "x" ? mousePosition.x : mousePosition.y
    return (position - center) * intensity
  }

  return (
    <section
      id="home"
      className="relative min-h-screen pt-20 md:pt-24 lg:pt-32 pb-16 md:pb-24 flex items-center overflow-hidden"
    >
      {/* Background animated elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{
            x: calculateMovement("x", -0.05),
            y: calculateMovement("y", -0.05),
          }}
          transition={{ type: "spring", damping: 50 }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{
            x: calculateMovement("x", 0.05),
            y: calculateMovement("y", 0.05),
          }}
          transition={{ type: "spring", damping: 50 }}
        />
      </div>

      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center md:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Hi, I'm{" "}
                <motion.span
                  className="text-primary relative inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Ananta Sharma
                  <motion.span
                    className="absolute -bottom-1 left-0 w-full h-1 bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1, duration: 0.8 }}
                  />
                </motion.span>
              </h1>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-medium mb-6 text-foreground/80 h-12">
                <TypeAnimation
                  sequence={[
                    "Full Stack Developer",
                    1000,
                    "React Specialist",
                    1000,
                    "Next.js Expert",
                    1000,
                    "UI/UX Enthusiast",
                    1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Number.POSITIVE_INFINITY}
                />
              </h2>
            </motion.div>

            <motion.p
              className="text-lg mb-8 text-muted-foreground max-w-xl mx-auto md:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              I build modern, responsive web applications with cutting-edge technologies. Let's create something amazing
              together.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="gap-2 relative overflow-hidden group">
                  <span
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 group-hover:animate-shimmer"
                    style={{ transform: "translateX(-100%)" }}
                  />
                  <Download size={18} />
                  Download Resume
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="gap-2 relative overflow-hidden group">
                  <span
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 group-hover:animate-shimmer"
                    style={{ transform: "translateX(-100%)" }}
                  />
                  <Send size={18} />
                  Hire Me
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <motion.div
              className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full bg-primary flex items-center justify-center relative overflow-hidden"
              animate={{
                x: calculateMovement("x", 0.01),
                y: calculateMovement("y", 0.01),
              }}
              transition={{ type: "spring", damping: 30 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="w-52 h-52 sm:w-60 sm:h-60 md:w-68 md:h-68 lg:w-76 lg:h-76 rounded-full overflow-hidden border-4 border-background relative"
              >
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Ananta Sharma"
                  width={300}
                  height={300}
                  className="w-full h-full object-cover"
                  priority
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent opacity-0"
                  whileHover={{ opacity: 0.6 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 25px rgba(220,38,38,0.5)",
                    "0 0 35px rgba(220,38,38,0.6)",
                    "0 0 25px rgba(220,38,38,0.5)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Floating elements around profile */}
            <motion.div
              className="absolute -top-4 -right-4 bg-background p-2 rounded-full shadow-lg border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.1 }}
            >
              <div className="text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v1" />
                  <path d="M12 21v1" />
                  <path d="m4.93 4.93-.7.7" />
                  <path d="m19.07 19.07 .7.7" />
                  <path d="M2 12h1" />
                  <path d="M21 12h1" />
                  <path d="m4.93 19.07 -.7.7" />
                  <path d="m19.07 4.93 .7-.7" />
                  <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
                </svg>
              </div>
            </motion.div>

            <motion.div
              className="absolute top-1/2 -left-6 bg-background p-2 rounded-full shadow-lg border"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7, duration: 0.5 }}
              whileHover={{ x: -5, scale: 1.1 }}
            >
              <div className="text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                </svg>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-2 right-8 bg-background p-2 rounded-full shadow-lg border"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.9, duration: 0.5 }}
              whileHover={{ y: 5, scale: 1.1 }}
            >
              <div className="text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
          <a
            href="#projects"
            aria-label="Scroll down"
            className="flex flex-col items-center gap-2 text-foreground/50 hover:text-primary transition-colors"
          >
            <span className="text-sm">Scroll Down</span>
            <ArrowDown size={20} />
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
