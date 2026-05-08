import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, X, ExternalLink, Trash2, Clock, TrendingUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BookmarkItem {
  id: string
  type: 'model' | 'benchmark'
  name: string
  addedAt: number
}

export default function BookmarksPanel() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    const saved = localStorage.getItem('contextwindow-bookmarks')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('contextwindow-bookmarks', JSON.stringify(bookmarks))
  }, [bookmarks])

  const addBookmark = useCallback((id: string, type: 'model' | 'benchmark', name: string) => {
    setBookmarks(prev => {
      if (prev.some(b => b.id === id)) return prev
      return [...prev, { id, type, name, addedAt: Date.now() }]
    })
  }, [])

  const removeBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id))
  }, [])

  const toggle = useCallback(() => {
    setOpen(prev => !prev)
  }, [])

  const handleNavigate = (item: BookmarkItem) => {
    navigate(item.type === 'model' ? `/models/${item.id}` : '/benchmarks')
    setOpen(false)
  }

  if (bookmarks.length === 0 && !open) return null

  return (
    <>
      <button
        onClick={toggle}
        className="relative p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors"
      >
        <Bookmark size={18} />
        {bookmarks.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-glow text-surface-950 text-xs flex items-center justify-center font-medium">
            {bookmarks.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={toggle}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 w-72 glass-strong rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-3 border-b border-surface-800">
                <h3 className="font-semibold text-surface-100">Bookmarks</h3>
                <button onClick={toggle}>
                  <X size={14} className="text-surface-500" />
                </button>
              </div>

              <div className="max-h-[300px] overflow-y-auto p-2">
                {bookmarks.length === 0 ? (
                  <p className="p-4 text-center text-surface-500 text-sm">
                    No bookmarks yet. Click the bookmark icon on any model to save it.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {bookmarks.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-800 transition-colors group"
                      >
                        <button
                          onClick={() => handleNavigate(item)}
                          className="flex items-center gap-2 text-left"
                        >
                          <Bookmark size={14} className="text-cyan-glow" />
                          <div>
                            <p className="text-sm text-surface-200">{item.name}</p>
                            <p className="text-xs text-surface-500 capitalize">{item.type}</p>
                          </div>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeBookmark(item.id); }}
                          className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 size={12} className="text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export { }