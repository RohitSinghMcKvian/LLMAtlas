import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Cpu, Sparkles, Zap, Globe, ArrowRight, ChevronDown, Brain, CircuitBoard, Cpu as CpuIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const FloatingCard: React.FC<{
  children: React.ReactNode
  className?: string
  delay?: number
}> = ({
  children,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
      className={`glass rounded-xl p-3 sm:p-4 ${className}`}
    >
      {children}
    </motion.div>
  )
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i))
      i++
      if (i > text.length) clearInterval(interval)
    }, 45)
    return () => clearInterval(interval)
  }, [started, text])

  return (
    <span className="min-h-[1.2em] inline-block">
      {displayed}
      {started && displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-cyan-glow ml-1 animate-pulse" />
      )}
    </span>
  )
}

export default function MotionHero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -60])

  const stats = [
    { icon: Brain, label: 'Models Tracked', value: '70+' },
    { icon: Globe, label: 'Organizations', value: '20+' },
    { icon: Zap, label: 'Benchmarks', value: '50+' },
    { icon: Sparkles, label: 'Daily Updates', value: 'Live' },
  ]

  return (
    <motion.section
      ref={ref}
      style={{ opacity, scale, y }}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23070e1a' width='100%25' height='100%25'/%3E%3C/svg%3E"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40 z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-32 pb-40 py-[90px]">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 glass-light rounded-full px-3 py-1.5 sm:px-4 sm:py-1.5 text-xs sm:text-sm mx-auto lg:mx-0"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              <Sparkles size={12} className="text-cyan-glow" />
              <span>The Complete LLM Intelligence Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl sm:text-7xl md:text-8xl font-normal leading-[0.95] tracking-[-2.46px] max-w-7xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span>Navigate the</span>
              <br />
              <em className="not-italic" style={{ color: 'hsl(var(--muted-foreground))' }}>AI Frontier</em>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mt-8 leading-relaxed"
            >
              <TypewriterText
                text="Real-time intelligence on every LLM, benchmark, and breakthrough in artificial intelligence."
                delay={1000}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <Link
                to="/models"
                className="liquid-glass rounded-full px-14 py-5 text-base hover:scale-[1.03] transition-transform cursor-pointer"
                style={{ color: 'hsl(var(--foreground))' }}
              >
                Explore Models
              </Link>
              <Link
                to="/compare"
                className="liquid-glass rounded-full px-14 py-5 text-base hover:scale-[1.03] transition-transform cursor-pointer"
                style={{ color: 'hsl(var(--foreground))' }}
              >
                Compare LLMs
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2 sm:pt-4"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon size={20} className="text-cyan-glow" />
                  </div>
                  <div className="text-2xl font-bold text-surface-100">{stat.value}</div>
                  <div className="text-xs text-surface-500">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="relative hidden lg:block h-[500px] xl:h-[600px]">
            <FloatingCard
              className="absolute top-0 right-0 w-64 animate-float"
              delay={0.3}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <CpuIcon size={20} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-surface-200">GPT-5.5</div>
                  <div className="text-xs text-surface-500">OpenAI</div>
                </div>
              </div>
              <div className="text-xs text-surface-400">Next-gen unified reasoning. 5T params, 500K context, native multimodal.</div>
              <div className="mt-2 flex gap-1">
                <span className="px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-300 text-[10px]">Closed</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px]">Available</span>
              </div>
            </FloatingCard>

            <FloatingCard
              className="absolute top-32 left-0 w-56 animate-float-delayed"
              delay={0.5}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Sparkles size={20} className="text-purple-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-surface-200">Opus 4.7</div>
                  <div className="text-xs text-surface-500">Anthropic</div>
                </div>
              </div>
              <div className="text-xs text-surface-400">Ultra-agentic with 2M context. Hybrid reasoning with Constitutional AI v3.</div>
            </FloatingCard>

            <FloatingCard
              className="absolute top-48 right-12 w-60 animate-float"
              delay={0.7}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Globe size={20} className="text-cyan-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-surface-200">Gemini 3.1 Pro</div>
                  <div className="text-xs text-surface-500">Google</div>
                </div>
              </div>
              <div className="text-xs text-surface-400">5M token context, frontier multimodal reasoning at scale.</div>
            </FloatingCard>

            <FloatingCard
              className="absolute bottom-24 left-8 w-52 animate-float-delayed"
              delay={0.9}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                  <CpuIcon size={20} className="text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-surface-200">DeepSeek V4 Pro</div>
                  <div className="text-xs text-surface-500">DeepSeek AI</div>
                </div>
              </div>
              <div className="text-xs text-surface-400">1T param open-source MoE. Frontier performance at fraction of cost.</div>
              <div className="mt-2 flex gap-1">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px]">Open Source</span>
              </div>
            </FloatingCard>

            <FloatingCard
              className="absolute bottom-8 right-4 w-56 animate-float"
              delay={1.1}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center">
                  <CircuitBoard size={20} className="text-rose-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-surface-200">Mythos</div>
                  <div className="text-xs text-surface-500">Sakana AI</div>
                </div>
              </div>
              <div className="text-xs text-surface-400">Self-evolving architecture. 800B reasoning specialist with auto-retrain.</div>
            </FloatingCard>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-surface-500">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown size={20} className="text-surface-500" />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}