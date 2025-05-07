"use client"

import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, GraduationCap } from "lucide-react"
import { useRef } from "react"

const experiences = [
  {
    id: 1,
    title: "President",
    company: "Tech Research and Innovation PNC Pokhara",
    period: "Jul 2024 - Present",
    description:
      "Leading Tech Research and Innovation where we organize different workshops and tech events. Focusing on fostering innovation and technical skill development in the community.",
    type: "work",
    skills: ["Leadership", "Event Management", "Full-Stack Development", "Workshop Facilitation"],
  },
  {
    id: 2,
    title: "Next.js Intern",
    company: "AIDE ASCENT",
    period: "2023 - 2024",
    description:
      "Worked on developing and maintaining web applications using Next.js. Collaborated with the development team to implement new features and improve existing ones.",
    type: "work",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    id: 3,
    title: "Developer",
    company: "Lunar IT Solutions",
    period: "2023",
    description:
      "Worked for 3 months developing web applications and IT solutions. Gained valuable industry experience in software development practices.",
    type: "work",
    skills: ["Web Development", "JavaScript", "React", "UI/UX"],
  },
  {
    id: 4,
    title: "Freelancer",
    company: "Upwork & Fiverr",
    period: "2022 - Present",
    description:
      "Working as a freelance developer on Upwork and Fiverr, delivering web development solutions to clients worldwide. Specializing in Next.js and full-stack development.",
    type: "work",
    skills: ["Next.js", "React", "Full-Stack", "Client Management"],
  },
]

export default function ExperienceSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section id="experience" className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </div>

      <div className="section-container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Experience & Education</h2>
          <p className="section-subtitle">My professional journey and educational background</p>
        </motion.div>

        <div className="mt-12 relative">
          {/* Timeline line */}
          <motion.div
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-border"
            initial={{ height: 0 }}
            animate={isInView ? { height: "100%" } : {}}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          <div className="space-y-8 sm:space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
              >
                <div className="md:w-1/2 pl-12 md:pl-12 md:pr-12 mb-8 md:mb-0">
                  <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Card className="h-full border-2 hover:border-primary/20 transition-colors duration-300">
                      <CardHeader className="pb-2 p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-1">
                          {exp.type === "work" ? (
                            <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          ) : (
                            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          )}
                          <span className="text-xs sm:text-sm text-muted-foreground">{exp.period}</span>
                        </div>
                        <CardTitle className="text-lg sm:text-xl group">
                          {exp.title}
                          <span className="block h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-1" />
                        </CardTitle>
                        <div className="text-base sm:text-lg font-medium text-muted-foreground">{exp.company}</div>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                        <p className="text-sm sm:text-base text-muted-foreground mb-4">{exp.description}</p>
                        {exp.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {exp.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="transition-all duration-300 hover:bg-primary/20"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Timeline dot */}
                <motion.div
                  className="absolute left-4 md:left-1/2 top-0 transform -translate-x-1/2 w-5 h-5 rounded-full bg-primary border-4 border-background z-10"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
