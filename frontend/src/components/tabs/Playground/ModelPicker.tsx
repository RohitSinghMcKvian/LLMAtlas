import { useState, useMemo, useCallback, useEffect, useRef, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, X, Check, Zap, Brain, Code, Eye, 
  ChevronDown, ChevronUp, CheckSquare, Square, 
  ArrowUpDown, Filter, Sparkles, AlertCircle, Image, FileText, AudioLines
} from 'lucide-react'
import { getModelCapabilities } from '@/lib/fileUtils'

interface Model {
  id: string
  name: string
  provider?: string
  contextLength: number
  category?: string
}

interface ModelPickerProps {
  models: Model[]
  selectedModels: string[]
  onToggle: (modelId: string) => void
  onSelectAll: (modelIds: string[]) => void
  onDeselectAll: (modelIds: string[]) => void
  onReplaceSelection: (modelIds: string[]) => void
  onClose: () => void
  maxModels?: number
}

type SortOption = 'name' | 'context' | 'provider' | 'category'
type SortDirection = 'asc' | 'desc'

const categoryIcons: Record<string, any> = {
  general: Zap,
  reasoning: Brain,
  coding: Code,
  vision: Eye,
}

const categoryColors: Record<string, string> = {
  general: 'text-cyan-400',
  reasoning: 'text-purple-400',
  coding: 'text-green-400',
  vision: 'text-orange-400',
}

const providerIcons: Record<string, string> = {
  google: '🔵',
  meta: '🟦',
  openai: '⚫',
  deepseek: '🟣',
  mistral: '🟠',
  microsoft: '🟢',
  alibaba: '🔴',
  nvidia: '💚',
  groq: '⚡',
  cerebras: '🔷',
  cloudflare: '☁️',
  github: '🐙',
}

const providerColors: Record<string, string> = {
  google: 'border-blue-500/30 bg-blue-500/5',
  meta: 'border-cyan-500/30 bg-cyan-500/5',
  nvidia: 'border-emerald-500/30 bg-emerald-500/5',
  groq: 'border-yellow-500/30 bg-yellow-500/5',
  mistral: 'border-orange-500/30 bg-orange-500/5',
  deepseek: 'border-purple-500/30 bg-purple-500/5',
  microsoft: 'border-green-500/30 bg-green-500/5',
  alibaba: 'border-red-500/30 bg-red-500/5',
  cerebras: 'border-pink-500/30 bg-pink-500/5',
  cloudflare: 'border-indigo-500/30 bg-indigo-500/5',
  github: 'border-gray-500/30 bg-gray-500/5',
}

const quickPicks = [
  { id: 'best-overall', name: 'Best Overall', category: 'General', icon: '🏆', models: ['gemini-2.5-flash', 'llama-3.3-70b-versatile', 'meta/llama-3.3-70b-instruct'] },
  { id: 'fastest', name: 'Fastest', category: 'Speed', icon: '⚡', models: ['llama-3.1-8b-instant', 'llama3.3-70b', 'llama3.1-8b'] },
  { id: 'best-code', name: 'Best for Code', category: 'Coding', icon: '💻', models: ['codestral-latest', 'qwen/qwen-2.5-coder-32b-instruct:free', 'deepseek-ai/deepseek-v3.2'] },
  { id: 'best-reasoning', name: 'Best Reasoning', category: 'Reasoning', icon: '🧠', models: ['gemini-2.5-pro', 'deepseek/deepseek-r1:free', 'qwen/qwen-3-235b-a22b'] },
  { id: 'best-vision', name: 'Best Vision', category: 'Vision', icon: '👁️', models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash'] },
  { id: 'nvidia-picks', name: 'NVIDIA Top', category: 'NVIDIA', icon: '🟢', models: ['meta/llama-3.3-70b-instruct', 'deepseek-ai/deepseek-v3.2', 'google/gemma-4-31b-it', 'nvidia/llama-3.1-nemotron-70b-instruct'] },
]

export default function ModelPicker({ models, selectedModels, onToggle, onSelectAll, onDeselectAll, onReplaceSelection, onClose, maxModels = 4 }: ModelPickerProps) {
  const [search, setSearch] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [expandedProviders, setExpandedProviders] = useState<Set<string>>(new Set())
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const searchRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  const uniqueProviders = useMemo(() => {
    const providers = new Set<string>()
    models.forEach(m => { if (m.provider) providers.add(m.provider) })
    return Array.from(providers).sort()
  }, [models])

  const uniqueCategories = useMemo(() => {
    const categories = new Set<string>()
    models.forEach(m => { if (m.category) categories.add(m.category) })
    return Array.from(categories).sort()
  }, [models])

  const filteredModels = useMemo(() => {
    let result = models

    if (search) {
      const lower = search.toLowerCase()
      result = result.filter(m => 
        m.name.toLowerCase().includes(lower) ||
        (m.provider || '').toLowerCase().includes(lower) ||
        (m.category || '').toLowerCase().includes(lower) ||
        m.id.toLowerCase().includes(lower)
      )
    }

    if (selectedProvider !== 'all') {
      result = result.filter(m => m.provider === selectedProvider)
    }

    if (selectedCategory !== 'all') {
      result = result.filter(m => m.category === selectedCategory)
    }

    // Deduplicate by creating unique key from provider+id
    const seen = new Set<string>()
    result = result.filter(m => {
      const uniqueKey = `${m.provider || 'other'}::${m.id}`
      if (seen.has(uniqueKey)) return false
      seen.add(uniqueKey)
      return true
    })

    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'context':
          comparison = a.contextLength - b.contextLength
          break
        case 'provider':
          comparison = (a.provider || '').localeCompare(b.provider || '')
          break
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '')
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [models, search, selectedProvider, selectedCategory, sortBy, sortDirection])

  const groupedModels = useMemo(() => {
    const groups: Record<string, Model[]> = {}
    filteredModels.forEach(model => {
      const provider = model.provider || 'other'
      if (!groups[provider]) groups[provider] = []
      groups[provider].push(model)
    })
    return groups
  }, [filteredModels])

  const selectedCount = selectedModels.length
  const filteredCount = filteredModels.length
  const totalCount = models.length
  const atLimit = selectedCount >= maxModels

  const hasActiveFilters = search || selectedProvider !== 'all' || selectedCategory !== 'all'

  const clearFilters = () => {
    setSearch('')
    setSelectedProvider('all')
    setSelectedCategory('all')
  }

  const toggleProvider = (provider: string) => {
    setExpandedProviders(prev => {
      const next = new Set(prev)
      if (next.has(provider)) next.delete(provider)
      else next.add(provider)
      return next
    })
  }

  const expandAll = () => {
    setExpandedProviders(new Set(Object.keys(groupedModels)))
  }

  const collapseAll = () => {
    setExpandedProviders(new Set())
  }

  const handleQuickPick = (modelIds: string[]) => {
    const validIds = modelIds.filter(id => models.some(m => m.id === id))
    const limitedIds = validIds.slice(0, maxModels)
    onReplaceSelection(limitedIds)
    onClose()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const visibleModels = filteredModels
    if (!visibleModels.length) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => Math.min(prev + 1, visibleModels.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < visibleModels.length) {
          onToggle(visibleModels[focusedIndex].id)
        }
        break
      case 'Escape':
        onClose()
        break
      case 'a':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault()
          onSelectAll(visibleModels.map(m => m.id))
        }
        break
    }
  }

  const getProviderIcon = (provider: string) => providerIcons[provider] || '🤖'
  const getProviderColor = (provider: string) => providerColors[provider] || 'border-white/10 bg-white/5'

  const renderFilterChip = (
    label: string, 
    isActive: boolean, 
    onClick: () => void,
    count?: number
  ) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
        isActive
          ? 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/30'
          : 'glass text-surface-400 hover:text-surface-200 border border-transparent hover:border-white/10'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
          isActive ? 'bg-cyan-glow/20' : 'bg-white/10'
        }`}>
          {count}
        </span>
      )}
    </button>
  )

  const renderModelItem = (model: Model, index: number) => {
    const isSelected = selectedModels.includes(model.id)
    const isFocused = index === focusedIndex
    const CategoryIcon = (model.category && categoryIcons[model.category]) || Zap
    const categoryColor = (model.category && categoryColors[model.category]) || 'text-surface-500'
    const uniqueKey = `model-${model.provider || 'other'}-${model.id}-${index}`
    const caps = getModelCapabilities(model.id)

    return (
      <button
        key={uniqueKey}
        onClick={() => {
          if (atLimit && !isSelected) return
          onToggle(model.id)
        }}
        disabled={atLimit && !isSelected}
        className={`w-full flex items-center justify-between p-3 rounded-lg transition-all text-left ${
          isFocused ? 'ring-2 ring-cyan-glow/50' : ''
        } ${
          isSelected
            ? `${getProviderColor(model.provider || 'other')} border`
            : atLimit
            ? 'opacity-50 cursor-not-allowed border border-transparent'
            : 'hover:bg-white/5 border border-transparent'
        }`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
            isSelected ? 'bg-cyan-glow text-surface-950' : 'bg-white/5 text-surface-500'
          }`}>
            <Check size={12} className={isSelected ? 'opacity-100' : 'opacity-0'} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-surface-200 truncate block">{model.name}</span>
            <div className="flex items-center gap-2 mt-0.5">
              <CategoryIcon size={12} className={categoryColor} />
              <span className="text-xs text-surface-500">
                {(model.contextLength / 1000).toFixed(0)}K context
              </span>
              {model.category && (
                <span className={`text-xs capitalize ${categoryColor}`}>• {model.category}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          {caps.vision && (
            <span className="p-1 rounded bg-orange-500/10 text-orange-400" title="Supports image input">
              <Image size={12} />
            </span>
          )}
          {caps.pdf && (
            <span className="p-1 rounded bg-blue-500/10 text-blue-400" title="Supports PDF documents">
              <FileText size={12} />
            </span>
          )}
          {caps.audio && (
            <span className="p-1 rounded bg-purple-500/10 text-purple-400" title="Supports audio input">
              <AudioLines size={12} />
            </span>
          )}
          <span className="text-xs text-surface-600 ml-1">
            {getProviderIcon(model.provider || 'other')}
          </span>
        </div>
      </button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="glass-strong rounded-xl border border-white/10 overflow-hidden absolute left-0 right-0 z-50 shadow-2xl bg-surface-950"
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-surface-100">Select Models</h3>
            <span className="text-xs text-surface-500 bg-surface-800/50 px-2 py-0.5 rounded-full">
              {selectedCount} selected
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-white/5 text-surface-400 hover:text-surface-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search models, providers, categories..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm placeholder-surface-600"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10 text-surface-500"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Result Count */}
        <div className="flex items-center justify-between text-xs text-surface-500">
          <span>
            Showing <span className="text-surface-300 font-medium">{filteredCount}</span> of {totalCount} models
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-cyan-glow hover:text-cyan-400 transition-colors"
            >
              <X size={12} />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-4 py-3 border-b border-white/5 space-y-3">
        {/* Provider Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <Filter size={14} className="text-surface-600 flex-shrink-0" />
          {renderFilterChip('All', selectedProvider === 'all', () => setSelectedProvider('all'), totalCount)}
          {uniqueProviders.map(provider => {
            const count = models.filter(m => m.provider === provider).length
            return (
              <button
                key={provider}
                onClick={() => setSelectedProvider(selectedProvider === provider ? 'all' : provider)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedProvider === provider
                    ? 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/30'
                    : 'glass text-surface-400 hover:text-surface-200 border border-transparent hover:border-white/10'
                }`}
              >
                <span>{getProviderIcon(provider)}</span>
                <span className="capitalize">{provider}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedProvider === provider ? 'bg-cyan-glow/20' : 'bg-white/10'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <Sparkles size={14} className="text-surface-600 flex-shrink-0" />
          {renderFilterChip('All', selectedCategory === 'all', () => setSelectedCategory('all'))}
          {uniqueCategories.map(category => {
            const count = models.filter(m => m.category === category).length
            const Icon = categoryIcons[category] || Zap
            const color = categoryColors[category] || 'text-surface-400'
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(selectedCategory === category ? 'all' : category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === category
                    ? 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/30'
                    : 'glass text-surface-400 hover:text-surface-200 border border-transparent hover:border-white/10'
                }`}
              >
                <Icon size={12} className={color} />
                <span className="capitalize">{category}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedCategory === category ? 'bg-cyan-glow/20' : 'bg-white/10'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Quick Picks */}
      {!search && selectedProvider === 'all' && selectedCategory === 'all' && (
        <div className="px-4 py-3 border-b border-white/5">
          <h4 className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-2">Quick Picks</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {quickPicks.map(pick => (
              <button
                key={pick.id}
                onClick={() => handleQuickPick(pick.models)}
                className="p-2.5 rounded-lg glass hover:bg-white/5 text-left transition-all hover:scale-[1.02] flex items-center gap-2 group"
              >
                <span className="text-lg">{pick.icon}</span>
                <div>
                  <span className="text-sm font-medium text-surface-200 block group-hover:text-cyan-glow transition-colors">{pick.name}</span>
                  <span className="text-xs text-surface-500">{pick.models.length} models • {pick.category}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sort & Bulk Actions Bar */}
      <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const allIds = filteredModels.map(m => m.id)
              const allSelected = allIds.every(id => selectedModels.includes(id))
              if (allSelected) {
                onDeselectAll(allIds)
              } else if (atLimit) {
                return
              } else {
                const remaining = maxModels - selectedCount
                const toSelect = allIds.filter(id => !selectedModels.includes(id)).slice(0, remaining)
                if (toSelect.length > 0) {
                  onSelectAll(toSelect)
                }
              }
            }}
            disabled={atLimit && !filteredModels.every(m => selectedModels.includes(m.id))}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              atLimit && !filteredModels.every(m => selectedModels.includes(m.id))
                ? 'text-surface-600 cursor-not-allowed'
                : 'text-surface-400 hover:text-surface-200'
            }`}
          >
            {filteredModels.length > 0 && filteredModels.every(m => selectedModels.includes(m.id)) 
              ? <CheckSquare size={14} /> 
              : <Square size={14} />
            }
            {atLimit && !filteredModels.every(m => selectedModels.includes(m.id))
              ? `Limit (${maxModels}/${maxModels})`
              : 'Select all'
            }
          </button>
          <span className="text-surface-700">|</span>
          <button
            onClick={expandedProviders.size === Object.keys(groupedModels).length ? collapseAll : expandAll}
            className="flex items-center gap-1.5 text-xs text-surface-400 hover:text-surface-200 transition-colors"
          >
            {expandedProviders.size === Object.keys(groupedModels).length ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expandedProviders.size === Object.keys(groupedModels).length ? 'Collapse' : 'Expand'} all
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-surface-600">Sort:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className="text-xs bg-surface-800 border border-white/10 rounded px-2 py-1 text-surface-300 outline-none"
          >
            <option value="name">Name</option>
            <option value="context">Context</option>
            <option value="provider">Provider</option>
            <option value="category">Category</option>
          </select>
          <button
            onClick={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')}
            className="p-1 rounded hover:bg-white/5 text-surface-400 hover:text-surface-200 transition-colors"
          >
            <ArrowUpDown size={14} className={sortDirection === 'desc' ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>

      {/* Model List */}
      <div ref={listRef} className="max-h-[50vh] overflow-y-auto scrollbar-thin">
        {filteredCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle size={32} className="text-surface-600 mb-3" />
            <p className="text-surface-400 font-medium mb-1">No models match your filters</p>
            <p className="text-xs text-surface-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg bg-cyan-glow/10 text-cyan-glow text-sm hover:bg-cyan-glow/20 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          (Object.entries(groupedModels) as [string, Model[]][]).map(([provider, providerModels]) => {
            const isExpanded = expandedProviders.has(provider)
            const allSelected = providerModels.every(m => selectedModels.includes(m.id))
            const someSelected = providerModels.some(m => selectedModels.includes(m.id))

            return (
              <div key={provider} className="border-b border-white/5 last:border-0">
                <div
                  onClick={() => toggleProvider(provider)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleProvider(provider) } }}
                  role="button"
                  tabIndex={0}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getProviderIcon(provider)}</span>
                    <div className="text-left">
                      <span className="text-sm font-medium text-surface-200 capitalize">{provider}</span>
                      <span className="text-xs text-surface-500 ml-2">({providerModels.length})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {someSelected && (
                      <span className="text-xs text-cyan-glow">
                        {providerModels.filter(m => selectedModels.includes(m.id)).length} selected
                      </span>
                    )}
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        const ids = providerModels.map(m => m.id)
                        if (allSelected) onDeselectAll(ids)
                        else onSelectAll(ids)
                      }}
                      className="p-1 rounded hover:bg-white/10 text-surface-500 hover:text-surface-300 transition-colors"
                      title={allSelected ? 'Deselect all' : 'Select all'}
                    >
                      {allSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                    </button>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-surface-500">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 space-y-1.5">
                        {providerModels.map((model, idx) => {
                          const globalIndex = filteredModels.findIndex(m => m.id === model.id)
                          return renderModelItem(model, globalIndex)
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-surface-500">
            {selectedCount}/{maxModels} model{selectedCount !== 1 ? 's' : ''} selected
          </span>
          {atLimit && (
            <span className="text-yellow-400 flex items-center gap-1">
              <AlertCircle size={12} />
              Maximum limit reached
            </span>
          )}
        </div>
        <span className="text-surface-600">
          ↑↓ Navigate • Enter Select • Esc Close • Ctrl+A Select All
        </span>
      </div>
    </motion.div>
  )
}
