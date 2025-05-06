"use client"

import { motion, useInView } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useRef } from "react"

const skills = [
  { name: "HTML", icon: "/placeholder.svg?height=40&width=40" },
  { name: "CSS", icon: "/placeholder.svg?height=40&width=40" },
  { name: "JavaScript", icon: "/placeholder.svg?height=40&width=40" },
  { name: "TypeScript", icon: "/placeholder.svg?height=40&width=40" },
  { name: "React", icon: "/placeholder.svg?height=40&width=40" },
  { name: "Next.js", icon: "/placeholder.svg?height=40&width=40" },
  { name: "Node.js", icon: "/placeholder.svg?height=40&width=40" },
  { name: "Express", icon: "/placeholder.svg?height=40&width=40" },
  { name: "MongoDB", icon: "/placeholder.svg?height=40&width=40" },
  { name: "PHP", icon: "/placeholder.svg?height=40&width=40" },
  { name: "MySQL", icon: "/placeholder.svg?height=40&width=40" },
  { name: "Tailwind CSS", icon: "/placeholder.svg?height=40&width=40" },
]

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  }

  return (
    <section id="about" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, -30, 0],
          }}
          transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>

      <div className="section-container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">About Me</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-4 relative inline-block">
              Who I Am
              <motion.span
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </h3>
            <div className="space-y-3 sm:space-y-4 text-muted-foreground">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                I'm Ananta Sharma, a passionate Full Stack Developer with expertise in building modern web applications.
                With a strong foundation in both frontend and backend technologies, I create seamless, user-friendly
                experiences.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                My journey in web development began 5 years ago, and since then, I've worked on various projects ranging
                from e-commerce platforms to complex enterprise applications. I'm constantly learning and adapting to
                new technologies to stay at the forefront of web development.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                When I'm not coding, you can find me exploring new technologies, contributing to open-source projects,
                or sharing my knowledge through blog posts and community forums.
              </motion.p>
            </div>
          </motion.div>

          <div>
            <motion.h3
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl font-bold mb-6 relative inline-block"
            >
              My Skills
              <motion.span
                className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </motion.h3>
            <motion.div
              variants={container}
              initial="hidden"
              animate={isInView ? "show" : ""}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
            >
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  variants={item}
                  whileHover={{ y: -5, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-full hover:border-primary transition-all duration-300 group overflow-hidden">
                    <CardContent className="flex flex-col items-center justify-center p-3 sm:p-4 relative">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 relative mb-2 z-10">
                        <Image
                          src={skill.icon || "/placeholder.svg"}
                          alt={skill.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-center z-10 relative">{skill.name}</span>
                      <motion.div
                        className="absolute inset-0 bg-primary/10 -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
