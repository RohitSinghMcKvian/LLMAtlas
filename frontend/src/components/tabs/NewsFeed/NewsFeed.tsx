import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ExternalLink } from 'lucide-react'
import { newsItems } from '@/data/news'
import { formatRelativeDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'

export default function NewsFeed() {
  const [search, setSearch] = useState('')
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allSources = useMemo(() => [...new Set(newsItems.map(n => n.source))] as string[], [])
  const allTags = useMemo(() => [...new Set(newsItems.flatMap(n => n.tags))] as string[], [])

  const filteredNews = useMemo(() => {
    return newsItems.filter(n => {
      if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.summary.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedSources.length && !selectedSources.includes(n.source)) return false
      if (selectedTags.length && !selectedTags.some(tag => n.tags.includes(tag))) return false
      return true
    })
  }, [search, selectedSources, selectedTags])

  const breakingNews = useMemo(() => newsItems.filter(n => n.isBreaking), [])

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-100 section-header">AI News Feed</h1>
        <p className="mt-1 text-sm sm:text-base text-surface-500">Automatically updated aggregation from research, releases, and industry news</p>
      </motion.div>

      {breakingNews.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-xl border border-rose-glow/20 bg-rose-glow/5">
          <h3 className="text-sm font-bold text-rose-glow mb-2">BREAKING</h3>
          <div className="space-y-3">
            {breakingNews.slice(0, 2).map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-glow mt-2 shrink-0 animate-pulse" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-surface-100">{item.title}</p>
                  <p className="text-xs text-surface-500">{formatRelativeDate(item.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative flex-1 min-w-[160px] sm:min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search news..." className="w-full rounded-lg glass-input py-2 pl-10 pr-4 text-sm" />
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-medium text-surface-500">Sources:</span>
          {allSources.map(source => (
            <button key={source} onClick={() => setSelectedSources(prev => prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source])}
              className={`filter-chip text-[10px] sm:text-xs ${selectedSources.includes(source) ? 'filter-chip-active' : ''}`}>{source}</button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-medium text-surface-500">Tags:</span>
          {allTags.map(tag => (
            <button key={tag} onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
              className={`filter-chip text-[10px] sm:text-xs ${selectedTags.includes(tag) ? 'filter-chip-active' : ''}`}>{tag}</button>
          ))}
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <AnimatePresence>
          {filteredNews.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.03 }}>
              <Card hoverable className="cursor-pointer group">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="info" size="sm">{item.source}</Badge>
                  {item.isBreaking && <Badge variant="danger" size="sm">Breaking</Badge>}
                </div>
                <h3 className="font-semibold text-surface-100 mb-2 group-hover:text-cyan-glow transition-colors">{item.title}</h3>
                <p className="text-sm text-surface-400 mb-3 line-clamp-2">{item.summary}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map(tag => <Badge key={tag} variant="default" size="sm">{tag}</Badge>)}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-surface-500">
                  <span>{formatRelativeDate(item.date)}</span>
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 text-cyan-glow transition-opacity" />
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
