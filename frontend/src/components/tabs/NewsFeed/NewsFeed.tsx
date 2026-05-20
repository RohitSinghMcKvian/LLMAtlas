import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ExternalLink, RefreshCw, Rss } from 'lucide-react'
import { formatRelativeDate, formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import api from '@/lib/api'

interface NewsItem {
  id: string
  title: string
  source: string
  date: string
  summary: string
  tags: string[]
  url: string
  isBreaking?: boolean
}

export default function NewsFeed() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<{ lastSync?: { ranAt: string; itemsUpdated: number } } | null>(null)

  useEffect(() => {
    async function fetchNews() {
      setLoading(true)
      try {
        const data = await api.getNews()
        setNewsItems(data)
      } catch (e) {
        console.error('Failed to fetch news:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  useEffect(() => {
    api.getSyncStatus().then(setSyncStatus).catch(() => {})
  }, [])

  const allSources = useMemo(() => [...new Set(newsItems.map(n => n.source))] as string[], [newsItems])
  const allTags = useMemo(() => [...new Set(newsItems.flatMap(n => n.tags))] as string[], [newsItems])

  const filteredNews = useMemo(() => {
    return newsItems.filter(n => {
      if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.summary.toLowerCase().includes(search.toLowerCase())) return false
      if (selectedSources.length && !selectedSources.includes(n.source)) return false
      if (selectedTags.length && !selectedTags.some(tag => n.tags.includes(tag))) return false
      return true
    })
  }, [search, selectedSources, selectedTags, newsItems])

  const breakingNews = useMemo(() => newsItems.filter(n => n.isBreaking), [newsItems])

  const handleSync = useCallback(async () => {
    setIsSyncing(true)
    try {
      const result = await api.triggerSync()
      setSyncStatus(result)
      const data = await api.getNews()
      setNewsItems(data)
    } catch (e) {
      console.error('Sync failed:', e)
    } finally {
      setIsSyncing(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 pt-8">
        <div className="skeleton h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-48 rounded-xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-100 section-header">AI News Feed</h1>
            <p className="mt-1 text-sm sm:text-base text-surface-500">Automatically updated aggregation from research, releases, and industry news</p>
          </div>
          <div className="flex items-center gap-2">
            {syncStatus?.lastSync && (
              <span className="text-xs text-surface-500 hidden sm:inline">
                Last sync: {formatDate(syncStatus.lastSync.ranAt)} ({syncStatus.lastSync.itemsUpdated} items)
              </span>
            )}
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-sm text-surface-300 hover:text-cyan-glow disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync News'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {breakingNews.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-xl border border-rose-glow/20 bg-rose-glow/5">
          <div className="flex items-center gap-2 mb-2">
            <Rss size={14} className="text-rose-glow" />
            <h3 className="text-sm font-bold text-rose-glow">BREAKING</h3>
          </div>
          <div className="space-y-3">
            {breakingNews.slice(0, 2).map((item) => (
              <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group block">
                <div className="w-2 h-2 rounded-full bg-rose-glow mt-2 shrink-0 animate-pulse" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-surface-100 group-hover:text-cyan-glow transition-colors">{item.title}</p>
                  <p className="text-xs text-surface-500">{formatRelativeDate(item.date)}</p>
                </div>
              </a>
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

      {filteredNews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No news articles found</p>
          <p className="text-sm mt-2">Try syncing news from the admin panel</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence>
            {filteredNews.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.03 }}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
                  <Card hoverable className="cursor-pointer group h-full">
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
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
