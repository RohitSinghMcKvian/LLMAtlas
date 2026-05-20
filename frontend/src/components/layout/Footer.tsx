import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Github, Twitter, MessageSquare, Heart, ExternalLink, Sparkles } from 'lucide-react'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function Footer() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 })

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="relative border-t border-surface-800/30 bg-surface-950 mt-auto overflow-hidden"
    >
      {/* Dynamic bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-glow/30 via-purple-glow/30 to-transparent animate-pulse" />
      <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-cyan-glow/[0.02] to-transparent pointer-events-none" />

      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-8 sm:py-12 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1 space-y-3 sm:space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-xl sm:text-2xl font-bold gradient-text">LLMAtlas</span>
            </Link>
            <p className="text-surface-500 text-xs sm:text-sm leading-relaxed max-w-xs">
              Your compass in the universe of AI. Real-time intelligence on every LLM, benchmark, and breakthrough in artificial intelligence.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-light rounded-lg p-2 text-surface-500 hover:text-cyan-glow hover:border-cyan-glow/20 transition-all"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-light rounded-lg p-2 text-surface-500 hover:text-cyan-glow hover:border-cyan-glow/20 transition-all"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a
                href="/feedback"
                className="glass-light rounded-lg p-2 text-surface-500 hover:text-cyan-glow hover:border-cyan-glow/20 transition-all"
                aria-label="Feedback"
              >
                <MessageSquare size={16} />
              </a>
            </div>
          </div>

          {/* Explore column */}
          <div>
            <h4 className="text-xs font-semibold text-surface-300 mb-3 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2">
              {[
                { label: 'Playground', path: '/playground' },
                { label: 'Model Tracker', path: '/models' },
                { label: 'Leaderboard', path: '/leaderboard' },
                { label: 'Comparison', path: '/compare' },
                { label: 'Benchmarks', path: '/benchmarks' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-xs sm:text-sm text-surface-500 hover:text-cyan-glow transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-0 h-px bg-cyan-glow/50 group-hover:w-3 transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <h4 className="text-xs font-semibold text-surface-300 mb-3 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              {[
                { label: 'News Feed', path: '/news' },
                { label: 'Setup Guide', path: '/guide' },
                { label: 'Learn Hub', path: '/learn' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-xs sm:text-sm text-surface-500 hover:text-cyan-glow transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="w-0 h-px bg-cyan-glow/50 group-hover:w-3 transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm text-surface-500 hover:text-cyan-glow transition-colors flex items-center gap-1.5 group"
                >
                  <ExternalLink size={12} />
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-4 sm:py-6 border-t border-surface-800/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Creator credit */}
          <div className="flex items-center gap-2 order-3 sm:order-1">
            <Sparkles size={14} className="text-cyan-glow" />
            <span className="text-xs sm:text-sm text-surface-500">
              Created by{' '}
              <span className="gradient-text-static font-semibold">RS-Creations</span>
            </span>
          </div>

          {/* Tech stack */}
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-surface-600 order-1 sm:order-2">
            <span>React 19</span>
            <span className="w-1 h-1 rounded-full bg-surface-700" />
            <span>Vite</span>
            <span className="w-1 h-1 rounded-full bg-surface-700" />
            <span>Tailwind CSS</span>
            <span className="w-1 h-1 rounded-full bg-surface-700" />
            <span>Framer Motion</span>
          </div>

          {/* Copyright */}
          <p className="text-[10px] sm:text-xs text-surface-600 flex items-center gap-1 order-2 sm:order-3">
            <Heart size={12} className="text-cyan-glow" />
            &copy; {new Date().getFullYear()} LLMAtlas. Your compass in the universe of AI.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
