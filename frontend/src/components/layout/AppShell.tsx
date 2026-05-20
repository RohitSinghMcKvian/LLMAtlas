import { useState, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import MotionHero from './MotionHero'
import Footer from './Footer'
import StarryBackground from './StarryBackground'
import MeshGradientBackground from './MeshGradientBackground'

export default function AppShell() {
  const [isSimpleMode, setIsSimpleMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('')

  const location = useLocation()

  const isHome = location.pathname === '/' || location.pathname === '/playground'

  const toggleMode = useCallback(() => setIsSimpleMode(prev => !prev), [])
  const handleSearch = useCallback((query: string) => setSearchQuery(query), [])

  return (
    <div className="min-h-screen bg-surface-950 text-surface-200 transition-colors duration-300 flex flex-col relative">
      <StarryBackground />
      <MeshGradientBackground />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isSimpleMode={isSimpleMode}
          onToggleMode={toggleMode}
          onMenuClick={() => setSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {isHome && <MotionHero />}

        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{ 
            type: 'spring', 
            stiffness: 260, 
            damping: 20,
            duration: 0.4 
          }}
          className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 w-full"
        >
          <Outlet context={{ isSimpleMode, searchQuery }} />
        </motion.main>

        <Footer />
      </div>
    </div>
  )
}
