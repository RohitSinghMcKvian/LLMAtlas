import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Command, Hash, FileText, Book, Wrench, X, ChevronRight } from 'lucide-react'
import { models } from '@/data/models'
import { benchmarks } from '@/data/benchmarks'
import { lessons } from '@/data/lessons'

interface CommandItem {
  id: string
  title: string
  type: 'model' | 'benchmark' | 'lesson' | 'guide'
  path: string
  subtitle?: string
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const allItems: CommandItem[] = [
    ...models.map(m => ({ id: m.id, title: m.name, type: 'model' as const, path: `/models/${m.id}`, subtitle: m.organization })),
    ...benchmarks.map(b => ({ id: b.id, title: b.name, type: 'benchmark' as const, path: '/benchmarks', subtitle: b.category })),
    ...lessons.map(l => ({ id: l.id, title: l.title, type: 'lesson' as const, path: '/learn', subtitle: l.track })),
  ]

  const filteredItems = query
    ? allItems.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : allItems.slice(0, 8)

  const handleOpen = useCallback(() => {
    setOpen(true)
    setQuery('')
    setSelected(0)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [])

  const handleSelect = useCallback((item: CommandItem) => {
    navigate(item.path)
    handleClose()
  }, [navigate, handleClose])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        open ? handleClose() : handleOpen()
      }
      if (!open) return
      
      if (e.key === 'Escape') {
        handleClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelected(s => Math.min(s + 1, filteredItems.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelected(s => Math.max(s - 1, 0))
      } else if (e.key === 'Enter' && filteredItems[selected]) {
        handleSelect(filteredItems[selected])
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, handleOpen, handleClose, handleSelect, filteredItems, selected])

  useEffect(() => {
    setSelected(0)
  }, [query])

  const getIcon = (type: string) => {
    switch (type) {
      case 'model': return <Command size={14} />
      case 'benchmark': return <Hash size={14} />
      case 'lesson': return <Book size={14} />
      case 'guide': return <Wrench size={14} />
      default: return <Command size={14} />
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-surface-800 border border-surface-700 hover:border-cyan-glow/50 transition-all shadow-lg"
        title="Search (Cmd+K)"
      >
        <Search size={20} className="text-surface-400" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={handleClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
            >
              <div className="glass-strong rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-3 p-4 border-b border-surface-800">
                  <Search size={18} className="text-surface-500" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search models, benchmarks, lessons..."
                    className="flex-1 bg-transparent text-surface-100 placeholder:text-surface-500 outline-none"
                    autoFocus
                  />
                  <button onClick={handleClose}>
                    <X size={16} className="text-surface-500" />
                  </button>
                </div>

                <div className="max-h-[300px] overflow-y-auto p-2">
                  {filteredItems.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        index === selected ? 'bg-cyan-glow/10' : 'hover:bg-surface-800'
                      }`}
                    >
                      <span className="p-1.5 rounded bg-surface-800 text-surface-400">
                        {getIcon(item.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-100">{item.title}</p>
                        <p className="text-xs text-surface-500">{item.subtitle}</p>
                      </div>
                      <ChevronRight size={14} className="text-surface-500 shrink-0" />
                    </button>
                  ))}

                  {filteredItems.length === 0 && (
                    <p className="p-4 text-center text-surface-500 text-sm">
                      No results found
                    </p>
                  )}
                </div>

                <div className="p-3 border-t border-surface-800 flex items-center justify-between text-xs text-surface-500">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-surface-800">↑↓</span> navigate
                    <span className="px-1.5 py-0.5 rounded bg-surface-800">↵</span> select
                    <span className="px-1.5 py-0.5 rounded bg-surface-800">esc</span> close
                  </div>
                  <span>ContextWindow Search</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}