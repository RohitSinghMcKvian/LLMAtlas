import { useState, useEffect, type MouseEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, Search, X, Trash2, Clock, Loader2, ChevronRight, Sparkles, Database, Cloud
} from 'lucide-react'
import api from '@/lib/api'

interface Conversation {
  id: string
  title: string
  models: string[]
  messageCount: number
  createdAt: string
  updatedAt: string
  source?: 'local' | 'server'
}

interface RecentChatsProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (conversation: Conversation) => void
  onDelete: (id: string) => void
  localConversations?: Array<{
    id: string
    title: string
    models: string[]
    messages: any[]
    streamStates: any
    createdAt: string
    updatedAt: string
  }>
}

export default function RecentChats({ isOpen, onClose, onSelect, onDelete, localConversations = [] }: RecentChatsProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) loadConversations()
  }, [isOpen, localConversations])

  const loadConversations = async () => {
    setIsLoading(true)
    try {
      const localConvos = localConversations.map(c => ({
        id: c.id,
        title: c.title,
        models: c.models,
        messageCount: c.messages.length,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        source: 'local' as const,
      }))

      try {
        const res = await api.getConversations(50)
        const serverConvos = (res.conversations || []).map((c: any) => ({
          ...c,
          source: 'server' as const,
        }))
        
        const allConvos = [...localConvos, ...serverConvos]
        const uniqueConvos = allConvos.filter((conv, index, self) =>
          index === self.findIndex(c => c.id === conv.id)
        )
        uniqueConvos.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        setConversations(uniqueConvos)
      } catch {
        setConversations(localConvos)
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, e: MouseEvent) => {
    e.stopPropagation()
    setDeletingId(id)
    try {
      const conv = conversations.find(c => c.id === id)
      if (conv?.source === 'server') {
        await api.deleteConversation(id)
      }
      setConversations(prev => prev.filter(c => c.id !== id))
      onDelete(id)
    } catch (error) {
      console.error('Failed to delete conversation:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = conversations.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return 'Just now'
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm glass-strong border-l border-white/10 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-cyan-glow" />
                  <h3 className="font-semibold text-surface-100">Recent Chats</h3>
                  <span className="text-xs text-surface-500 bg-surface-800/50 px-2 py-0.5 rounded-full">
                    {conversations.length}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-surface-400 hover:text-surface-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg glass-input text-xs placeholder-surface-600"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 size={24} className="text-surface-500 animate-spin mb-3" />
                  <p className="text-sm text-surface-500">Loading conversations...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                  <Sparkles size={32} className="text-surface-600 mb-3" />
                  <p className="text-sm text-surface-400 font-medium mb-1">
                    {search ? 'No conversations match' : 'No conversations yet'}
                  </p>
                  <p className="text-xs text-surface-600">
                    {search ? 'Try a different search' : 'Start chatting in the Playground to save conversations'}
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {filtered.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => onSelect(conv)}
                      className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-all group relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-surface-200 truncate pr-6">
                              {conv.title}
                            </p>
                            {conv.source === 'local' ? (
                              <span title="Saved locally"><Database size={12} className="text-surface-500 flex-shrink-0" /></span>
                            ) : (
                              <span title="Saved to cloud"><Cloud size={12} className="text-cyan-500/50 flex-shrink-0" /></span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-xs text-surface-500">
                              <Clock size={12} />
                              {formatTime(conv.updatedAt)}
                            </span>
                            <span className="text-xs text-surface-600">
                              {conv.messageCount} messages
                            </span>
                            {conv.models.length > 0 && (
                              <span className="text-xs text-surface-600">
                                {conv.models.length} model{conv.models.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleDelete(conv.id, e)}
                          disabled={deletingId === conv.id}
                          className="absolute right-2 top-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-surface-500 hover:text-red-400 transition-all disabled:opacity-50"
                        >
                          {deletingId === conv.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                      <ChevronRight size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-surface-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
