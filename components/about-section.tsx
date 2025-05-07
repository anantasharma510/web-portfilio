"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import FreelancePlatforms from "./freelance-platforms"
import TechStackIcons from "./tech-stack-icons"

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

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
        <motion.div
          className="absolute -bottom-20 left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl opacity-70"
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
          }}
          transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
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
                I'm Ananta Sharma, a passionate Full Stack Developer from Pokhara, Nepal. Currently serving as the
                President at Tech Research and Innovation PNC, where we organize various workshops and tech events to
                foster innovation in our community.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                My journey in web development includes experience as a Next.js intern at AIDE ASCENT, working at Lunar
                IT Solutions, and building a successful freelance career on platforms like Upwork and Fiverr.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                I'm passionate about creating modern, responsive web applications with cutting-edge technologies and
                sharing my knowledge with others through workshops and community events.
              </motion.p>
            </div>

            <FreelancePlatforms />
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
            <TechStackIcons />
          </div>
        </div>
      </div>
    </section>
  )
}
