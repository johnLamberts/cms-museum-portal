/* eslint-disable prefer-const */
"use client"

import type React from "react"

import { AnimatePresence, motion, useAnimation, useMotionValue, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface MuseumLoaderProps {
  onLoadingComplete?: () => void
  minLoadingTime?: number // Minimum time to show loader in ms
}

export default function MuseumLoader({ onLoadingComplete, minLoadingTime = 3000 }: MuseumLoaderProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const startTime = useRef(Date.now())
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useTransform(mouseY, [0, window.innerHeight], [5, -5])
  const rotateY = useTransform(mouseX, [0, window.innerWidth], [-5, 5])

  const frameControls = useAnimation()
  const artifactControls = useAnimation()

  // Handle mouse movement for interactive effect
  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  // Simulate loading progress
  useEffect(() => {
    let interval: NodeJS.Timeout

    // Animate frames in sequence
    frameControls.start({
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    })

    // Animate artifacts with delay
    artifactControls.start({
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 1.2,
      },
    })

    // Progress animation
    interval = setInterval(() => {
      setProgress((prev) => {
        // Slow down progress as it approaches 100%
        const increment = Math.max(1, 10 * (1 - prev / 100))
        const nextProgress = Math.min(prev + increment, 100)

        if (nextProgress >= 100) {
          clearInterval(interval)

          // Ensure minimum loading time
          const elapsed = Date.now() - startTime.current
          const remainingTime = Math.max(0, minLoadingTime - elapsed)

          setTimeout(() => {
            setIsComplete(true)
            if (onLoadingComplete) onLoadingComplete()
          }, remainingTime)
        }

        return nextProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [frameControls, artifactControls, minLoadingTime, onLoadingComplete])

  // Exit animation when loading is complete
  const exitAnimation = {
    opacity: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
    },
  }

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          onMouseMove={handleMouseMove}
          exit={exitAnimation}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,rgba(255,255,255,0)_70%)]" />
            <div className="h-full w-full bg-[url('/placeholder.svg?height=50&width=50')] bg-repeat opacity-5" />
          </div>

          {/* Main content container */}
          <motion.div
            className="relative flex flex-col items-center justify-center"
            style={{
              rotateX,
              rotateY,
              perspective: 1000,
            }}
          >
            {/* Museum logo/title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-12 text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                MUSEUM
                <span className="block text-primary">PORTAL</span>
              </h1>
              <p className="mt-3 text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl">
                Discover art, history, and culture
              </p>
            </motion.div>

            {/* Animated frames */}
            <motion.div
              className="relative mb-16 grid grid-cols-3 gap-4 sm:gap-6"
              initial="hidden"
              animate={frameControls}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  className={`h-24 w-20 rounded-md border-2 border-white/20 bg-white/5 backdrop-blur-sm sm:h-32 sm:w-28 
                    ${i > 3 ? "hidden sm:block" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.4)" }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex h-full items-center justify-center">
                    <div
                      className={`h-16 w-14 rounded sm:h-24 sm:w-20 ${
                        i % 3 === 1 ? "bg-primary/40" : i % 3 === 2 ? "bg-secondary/40" : "bg-accent/40"
                      }`}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Animated artifacts */}
            <motion.div
              className="absolute -z-10 flex w-full justify-between px-4"
              initial="hidden"
              animate={artifactControls}
            >
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className={`h-12 w-12 rounded-full ${
                    i === 1 ? "bg-primary/30" : i === 2 ? "bg-secondary/30" : "bg-accent/30"
                  }`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  variants={{
                    hidden: { opacity: 0, scale: 0.5 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  transition={{ duration: 0.6 }}
                />
              ))}
            </motion.div>

            {/* Progress bar */}
            <div className="mt-8 w-64 sm:w-80 md:w-96">
              <div className="mb-2 flex justify-between text-xs text-white/60">
                <span>Loading exhibits</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>

              {/* Loading messages */}
              <div className="mt-3 h-5 text-center text-sm text-white/60">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={Math.floor(progress / 25)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {progress < 25 && "Preparing gallery spaces..."}
                    {progress >= 25 && progress < 50 && "Arranging artifacts..."}
                    {progress >= 50 && progress < 75 && "Adjusting lighting..."}
                    {progress >= 75 && progress < 100 && "Opening exhibition..."}
                    {progress >= 100 && "Welcome to the museum!"}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 2, duration: 1 }}
              className="absolute bottom-4 text-xs text-white/60 sm:bottom-8"
            >
              Move your cursor to interact
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

