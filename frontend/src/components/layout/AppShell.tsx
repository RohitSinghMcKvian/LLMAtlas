import { useState, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import MotionHero from './MotionHero'
import Footer from './Footer'

export default function AppShell() {
  const [isSimpleMode, setIsSimpleMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('')

  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()

  const isHome = location.pathname === '/' || location.pathname === '/models'

  const toggleMode = useCallback(() => setIsSimpleMode(prev => !prev), [])
  const handleSearch = useCallback((query: string) => setSearchQuery(query), [])

  return (
    <div className="min-h-screen bg-surface-950 text-surface-200 transition-colors duration-300 flex flex-col">
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isSimpleMode={isSimpleMode}
        onToggleMode={toggleMode}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onMenuClick={() => setSidebarOpen(true)}
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {isHome && <MotionHero />}

      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 w-full"
      >
        <Outlet context={{ isSimpleMode, isDark, searchQuery }} />
      </motion.main>

      <Footer />
    </div>
  )
}
