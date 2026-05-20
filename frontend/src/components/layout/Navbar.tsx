import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import {
  Sparkles,
  Cpu,
  BarChart3,
  Trophy,
  GitCompare,
  BookOpen,
  Newspaper,
  Play,
  GraduationCap,
  LogIn,
  LogOut,
  Loader2,
} from 'lucide-react'
import { classNames } from '@/lib/utils'
import { Sidebar, MobileMenuButton } from './Sidebar'
import { useAuth } from '@/hooks/useAuth'
import AuthModal from '@/components/auth/AuthModal'

const navItems = [
  { label: 'Playground', path: '/playground', icon: Play },
  { label: 'Models', path: '/models', icon: Cpu },
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { label: 'Compare', path: '/compare', icon: GitCompare },
  { label: 'Benchmarks', path: '/benchmarks', icon: BarChart3 },
  { label: 'News', path: '/news', icon: Newspaper },
  { label: 'Guide', path: '/guide', icon: BookOpen },
  { label: 'Learn', path: '/learn', icon: GraduationCap },
]

interface NavbarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isSimpleMode: boolean
  onToggleMode: () => void
  onMenuClick: () => void
  searchQuery: string
  onSearch: (query: string) => void
}

export function Navbar({ activeTab, onTabChange, isSimpleMode, onToggleMode, onMenuClick, searchQuery, onSearch }: NavbarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const { scrollY } = useScroll()
  const scrollYProgress = useSpring(scrollY, { stiffness: 100, damping: 20 })
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      setScrolled(v > 50)
    })
  }, [scrollYProgress])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
      setShowUserMenu(false)
    }
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    return email[0].toUpperCase()
  }

  return (
    <>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      
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
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
                    {getInitials(user.name, user.email)}
                  </div>
                  <span className="hidden sm:block text-sm text-surface-300 max-w-[120px] truncate">
                    {user.name || user.email}
                  </span>
                </button>

                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-xl border border-white/10 shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/5">
                      <p className="text-sm font-medium text-surface-200 truncate">{user.name || 'User'}</p>
                      <p className="text-xs text-surface-500 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                      >
                        {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-glow border border-cyan-glow/20 hover:border-cyan-glow/40 transition-all"
              >
                <LogIn size={16} />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}
          </div>
        </nav>
      </header>
    </>
  )
}
