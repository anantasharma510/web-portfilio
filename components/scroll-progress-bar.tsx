"use client"

import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { useEffect, useState } from "react"

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const [scrollPercentage, setScrollPercentage] = useState(0)
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.1], [0, 0.5, 1])
  const gradientPosition = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((v) => setScrollPercentage(Math.round(v * 100)))
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/70 via-primary to-primary/70 z-50 origin-left"
        style={{
          scaleX,
          opacity,
          backgroundSize: "200% 100%",
          backgroundPosition: gradientPosition,
        }}
      />

      <motion.div
        className="fixed top-4 right-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium border z-50 hidden md:block"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        style={{ opacity }}
      >
        {scrollPercentage}%
      </motion.div>
    </>
  )
}
