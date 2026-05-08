import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
  Sparkles,
  Menu,
  Sun,
  Moon,
  Search,
  Cpu,
  BarChart3,
  Trophy,
  GitCompare,
  BookOpen,
  Newspaper,
  Play,
  GraduationCap,
} from 'lucide-react'
import { classNames } from '@/lib/utils'
import { Sidebar, MobileMenuButton } from './Sidebar'

const navItems = [
  { label: 'Models', path: '/models', icon: Cpu },
  { label: 'Benchmarks', path: '/benchmarks', icon: BarChart3 },
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { label: 'Compare', path: '/compare', icon: GitCompare },
  { label: 'Guide', path: '/guide', icon: BookOpen },
  { label: 'News', path: '/news', icon: Newspaper },
  { label: 'Playground', path: '/playground', icon: Play },
  { label: 'Learn', path: '/learn', icon: GraduationCap },
]

export function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const location = useLocation()
  const { scrollY } = useScroll()
  const scrollYProgress = useSpring(scrollY, { stiffness: 100, damping: 20 })
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      setScrolled(v > 50)
    })
  }, [scrollYProgress])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const toggleTheme = () => setIsDark(!isDark)

  return (
    <>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
      
      <header 
        className="sticky top-0 z-40 transition-all duration-300"
        style={{ 
          background: scrolled 
            ? 'rgba(7, 14, 26, 0.95)' 
            : 'rgba(7, 14, 26, 0.8)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
          borderBottom: scrolled 
            ? '1px solid rgba(255, 255, 255, 0.06)' 
            : '1px solid transparent',
        }}
      >
        <nav className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <MobileMenuButton onClick={() => setSidebarOpen(true)} />
            
            <NavLink to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                LLMAtlas
              </span>
            </NavLink>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  classNames(
                    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-white bg-white/5'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )
                }
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </nav>
      </header>
    </>
  )
}