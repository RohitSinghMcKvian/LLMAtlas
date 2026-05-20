import { useState, useEffect, useCallback, type TouchEvent } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Cpu,
  BarChart3,
  Trophy,
  GitCompare,
  BookOpen,
  Newspaper,
  Play,
  GraduationCap,
  X,
  Menu,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { classNames } from '@/lib/utils'

interface NavItem {
  label: string
  path: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { label: 'Playground', path: '/playground', icon: Play },
  { label: 'Models', path: '/models', icon: Cpu },
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { label: 'Compare', path: '/compare', icon: GitCompare },
  { label: 'Benchmarks', path: '/benchmarks', icon: BarChart3 },
  { label: 'News', path: '/news', icon: Newspaper },
  { label: 'Guide', path: '/guide', icon: BookOpen },
  { label: 'Learn', path: '/learn', icon: GraduationCap },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const [activePath, setActivePath] = useState(location.pathname)

  useEffect(() => {
    setActivePath(location.pathname)
  }, [location.pathname])

  const handleTouchStart = useCallback((e: TouchEvent<HTMLElement>) => {
    (e.target as HTMLElement).dataset.touchStartX = e.touches[0].clientX.toString()
  }, [])

  const handleTouchEnd = useCallback((e: TouchEvent<HTMLElement>) => {
    const startX = parseFloat((e.target as HTMLElement).dataset.touchStartX || '0')
    const endX = e.changedTouches[0].clientX
    if (endX - startX > 80) {
      onClose()
    }
  }, [onClose])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-[280px] lg:w-64 flex flex-col"
            style={{
              background: 'linear-gradient(180deg, rgba(7, 14, 26, 0.98) 0%, rgba(7, 14, 26, 0.95) 100%)',
              backdropFilter: 'blur(24px)',
              borderRight: '1px solid rgba(255, 255, 255, 0.06)',
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
              <NavLink to="/" onClick={onClose} className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                  <Sparkles size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  LLMAtlas
                </span>
              </NavLink>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = activePath === item.path || activePath.startsWith(item.path + '/')
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => {
                        setActivePath(item.path)
                        onClose()
                      }}
                      className={classNames(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/15 to-purple-500/15 text-white border-l-2 border-cyan-400'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      )}
                      style={isActive ? {
                        background: 'linear-gradient(90deg, rgba(0, 229, 255, 0.1) 0%, rgba(192, 132, 252, 0.05) 100%)',
                        borderLeft: '2px solid #00e5ff',
                      } : {}}
                    >
                      <item.icon size={18} className={isActive ? 'text-cyan-400' : ''} />
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"
                        />
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
              <div className="px-4 py-2 rounded-lg bg-white/5 text-xs text-gray-500">
                <p>Your compass in the universe of AI</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

interface MobileMenuButtonProps {
  onClick: () => void
}

export function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
      style={{ color: 'rgba(255, 255, 255, 0.7)' }}
      aria-label="Open menu"
    >
      <Menu size={24} />
    </button>
  )
}
