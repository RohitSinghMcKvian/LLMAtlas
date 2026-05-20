import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, LayoutGrid, Clock, Calendar, HardDrive, Globe, RefreshCw, ExternalLink, Download, Heart, Sparkles, Loader2, X } from 'lucide-react'
import type { Model, ModelStatus, LicenseType, Modality } from '@/types/model'
import { formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import api from '@/lib/api'

const statusMap: Record<ModelStatus, string> = {
  Available: 'bg-emerald-400', Beta: 'bg-blue-400', 'Research Preview': 'bg-purple-400', Announced: 'bg-amber-400',
}

export default function ModelTracker() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [licFilters, setLicFilters] = useState<LicenseType[]>([])
  const [statFilters, setStatFilters] = useState<ModelStatus[]>([])
  const [modFilters, setModFilters] = useState<Modality[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid')
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState<{ lastSync?: { ranAt: string; itemsUpdated: number } } | null>(null)
  const [aiSearchMode, setAiSearchMode] = useState(false)
  const [aiSearchResults, setAiSearchResults] = useState<Model[]>([])
  const [isAiSearching, setIsAiSearching] = useState(false)
  const [aiSearchCriteria, setAiSearchCriteria] = useState<any>(null)
  const [semanticSearchAvailable, setSemanticSearchAvailable] = useState(true)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    async function fetchModels() {
      setLoading(true)
      try {
        const data = await api.getModels()
        setModels(data)
      } catch (e) {
        console.error('Failed to fetch models:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchModels()
  }, [])

  useEffect(() => {
    api.getSyncStatus().then(setSyncStatus).catch(() => {})
  }, [])

  const allLic = useMemo(() => [...new Set(models.map(m => m.license))] as LicenseType[], [models])
  const allStat = useMemo(() => [...new Set(models.map(m => m.status))] as ModelStatus[], [models])
  const allMod = useMemo(() => [...new Set(models.flatMap(m => m.modalities || []))] as Modality[], [models])

  const filtered = useMemo(() => {
    if (aiSearchMode && aiSearchResults.length > 0) {
      return aiSearchResults
    }
    return models.filter(m => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.organization.toLowerCase().includes(search.toLowerCase())) return false
      if (licFilters.length && !licFilters.includes(m.license)) return false
      if (statFilters.length && !statFilters.includes(m.status)) return false
      if (modFilters.length && !modFilters.some(mod => (m.modalities || []).includes(mod))) return false
      return true
    })
  }, [search, licFilters, statFilters, modFilters, models, aiSearchMode, aiSearchResults])

  const handleAiSearch = useCallback(async (query: string) => {
    if (!query.trim() || !semanticSearchAvailable) {
      setAiSearchResults([])
      setAiSearchCriteria(null)
      return
    }

    setIsAiSearching(true)
    try {
      const data = await api.semanticSearch(query)
      if (data.models.length === 0 && data.criteria === null) {
        setSemanticSearchAvailable(false)
        setAiSearchMode(false)
      } else {
        setAiSearchResults(data.models || [])
        setAiSearchCriteria(data.criteria)
      }
    } catch (e) {
      console.error('AI search failed:', e)
      setSemanticSearchAvailable(false)
      setAiSearchMode(false)
      setAiSearchResults([])
    } finally {
      setIsAiSearching(false)
    }
  }, [semanticSearchAvailable])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    
    if (aiSearchMode && value.trim()) {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
      searchTimeoutRef.current = setTimeout(() => {
        handleAiSearch(value)
      }, 500)
    }
  }, [aiSearchMode, handleAiSearch])

  const toggleAiSearch = useCallback(() => {
    setAiSearchMode(prev => {
      const newVal = !prev
      if (!newVal) {
        setAiSearchResults([])
        setAiSearchCriteria(null)
      }
      return newVal
    })
  }, [])

  const toggle = <T,>(arr: T[], val: T): T[] => arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]

  const handleSync = useCallback(async () => {
    setIsSyncing(true)
    try {
      const result = await api.triggerSync()
      setSyncStatus(result)
      const data = await api.getModels()
      setModels(data)
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
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-100 section-header">Model Tracker</h1>
            <p className="mt-1 text-sm sm:text-base text-surface-500">Live database of every known LLM — open, closed, and upcoming</p>
          </div>
          <div className="flex items-center gap-2">
            {syncStatus?.lastSync && (
              <span className="text-xs text-surface-500 hidden sm:inline">
                Last sync: {formatDate(syncStatus.lastSync.ranAt)} ({syncStatus.lastSync.itemsUpdated} updated)
              </span>
            )}
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-3 py-2 rounded-lg glass text-sm text-surface-300 hover:text-cyan-glow disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative flex-1 min-w-[160px] sm:min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
            <input
              type="text"
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder={aiSearchMode ? "Ask naturally: 'best coding models under 10B params'..." : "Search models..."}
              className={`w-full rounded-lg glass-input py-2 pl-10 pr-12 text-sm ${aiSearchMode ? 'border-purple-500/30' : ''}`}
            />
            <button
              onClick={toggleAiSearch}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                aiSearchMode
                  ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                  : 'text-surface-500 hover:text-surface-300'
              }`}
              title={aiSearchMode ? 'Disable AI search' : 'Enable AI semantic search'}
            >
              <Sparkles size={16} />
            </button>
            {isAiSearching && (
              <Loader2 size={14} className="absolute right-10 top-1/2 -translate-y-1/2 text-cyan-glow animate-spin" />
            )}
          </div>
          {!aiSearchMode && (
            <>
              <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                {allLic.map(l => <button key={l} onClick={() => setLicFilters(toggle(licFilters, l))} className={`filter-chip ${licFilters.includes(l) ? 'filter-chip-active' : ''}`}>{l}</button>)}
              </div>
              <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                {allStat.map(s => <button key={s} onClick={() => setStatFilters(toggle(statFilters, s))} className={`filter-chip ${statFilters.includes(s) ? 'filter-chip-active' : ''}`}>{s}</button>)}
              </div>
            </>
          )}
          <div className="flex items-center gap-2 sm:ml-auto">
            <Badge variant={aiSearchMode ? 'default' : 'info'} size="sm">
              {filtered.length} model{filtered.length !== 1 ? 's' : ''}
              {aiSearchMode && aiSearchCriteria && (
                <span className="ml-1 text-purple-400">
                  (AI: {aiSearchCriteria.capabilities?.length || 0} capabilities)
                </span>
              )}
            </Badge>
            <button onClick={() => setViewMode('grid')} className={`rounded-lg p-2 transition-colors ${viewMode === 'grid' ? 'bg-accent-500/15 text-cyan-glow' : 'text-surface-500 hover:text-surface-300'}`}><LayoutGrid size={18} /></button>
            <button onClick={() => setViewMode('timeline')} className={`rounded-lg p-2 transition-colors ${viewMode === 'timeline' ? 'bg-accent-500/15 text-cyan-glow' : 'text-surface-500 hover:text-surface-300'}`}><Clock size={18} /></button>
          </div>
        </div>

        {aiSearchMode && aiSearchCriteria && (aiSearchCriteria.capabilities?.length > 0 || aiSearchCriteria.parameterRange || aiSearchCriteria.status || aiSearchCriteria.license) && (
          <div className="flex items-center gap-2 flex-wrap px-1">
            <span className="text-xs text-purple-400 flex items-center gap-1">
              <Sparkles size={12} />
              AI detected:
            </span>
            {aiSearchCriteria.capabilities?.map((cap: string) => (
              <span key={cap} className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 capitalize">
                {cap}
              </span>
            ))}
            {aiSearchCriteria.parameterRange && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {aiSearchCriteria.parameterRange.min}-{aiSearchCriteria.parameterRange.max}B params
              </span>
            )}
            {aiSearchCriteria.status && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-300 border border-green-500/20">
                {aiSearchCriteria.status}
              </span>
            )}
            {aiSearchCriteria.license && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20">
                {aiSearchCriteria.license}
              </span>
            )}
            <button
              onClick={() => { setSearch(''); setAiSearchResults([]); setAiSearchCriteria(null); }}
              className="text-xs text-surface-500 hover:text-surface-300 flex items-center gap-1"
            >
              <X size={12} />
              Clear
            </button>
          </div>
        )}

        {!aiSearchMode && (
          <>
            <div className="sm:hidden flex flex-wrap gap-1.5">
              {allLic.map(l => <button key={l} onClick={() => setLicFilters(toggle(licFilters, l))} className={`filter-chip text-[10px] ${licFilters.includes(l) ? 'filter-chip-active' : ''}`}>{l}</button>)}
            </div>
            <div className="sm:hidden flex flex-wrap gap-1.5">
              {allStat.map(s => <button key={s} onClick={() => setStatFilters(toggle(statFilters, s))} className={`filter-chip text-[10px] ${statFilters.includes(s) ? 'filter-chip-active' : ''}`}>{s}</button>)}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] sm:text-xs font-medium text-surface-500">Modality:</span>
              {allMod.map(mod => <button key={mod} onClick={() => setModFilters(toggle(modFilters, mod))} className={`filter-chip text-[10px] sm:text-xs ${modFilters.includes(mod) ? 'filter-chip-active' : ''}`}>{mod}</button>)}
            </div>
          </>
        )}
      </div>

      {viewMode === 'grid' ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence>
            {filtered.map((model, i) => (
              <motion.div key={model.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.03 }}>
                <Card hoverable onClick={() => setSelectedModel(model)} className="cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-surface-100 truncate">{model.name}</h3>
                      <p className="text-sm text-surface-500 truncate">{model.organization}</p>
                    </div>
                    <div className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1.5 ${statusMap[model.status]}`} title={model.status} />
                  </div>
                  <p className="text-sm text-surface-400 line-clamp-2 mb-3">{model.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="default" size="sm">{model.parameters}</Badge>
                    <Badge variant="default" size="sm">{model.contextWindow >= 1000 ? `${Math.round(model.contextWindow / 1000)}K` : model.contextWindow} ctx</Badge>
                    <Badge variant={model.isOpenSource ? 'success' : 'warning'} size="sm">{model.license}</Badge>
                    {(model.modalities || []).slice(0, 2).map(mod => <Badge key={mod} variant="info" size="sm">{mod}</Badge>)}
                    {(model.modalities || []).length > 2 && <Badge variant="default" size="sm">+{(model.modalities || []).length - 2}</Badge>}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-surface-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(model.releaseDate)}</span>
                      <span className="flex items-center gap-1"><HardDrive size={12} />{model.vramRequired}</span>
                      {model.apiAvailable && <span className="flex items-center gap-1 text-emerald-400"><Globe size={12} />API</span>}
                    </div>
                    {(model as any).hfDownloads > 0 && (
                      <span className="flex items-center gap-1 text-surface-400">
                        <Download size={10} />{(model as any).hfDownloads > 1000 ? `${((model as any).hfDownloads / 1000).toFixed(1)}k` : (model as any).hfDownloads}
                      </span>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin py-6">
          <div className="relative min-w-[800px]">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-surface-800" />
            <div className="relative flex justify-between">
              {[...filtered].sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()).map((model, i) => (
                <motion.div key={model.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="flex flex-col items-center gap-2" style={{ width: `${Math.max(80, 100 / filtered.length)}%` }}>
                  <div className={`h-3 w-3 rounded-full ${statusMap[model.status]} ring-4 ring-surface-950`} />
                  <div className="text-center -rotate-45 origin-top-left mt-8">
                    <p className="text-[10px] font-medium leading-tight text-surface-200 truncate max-w-[80px]">{model.name}</p>
                    <p className="text-[9px] text-surface-500">{formatDate(model.releaseDate)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={!!selectedModel} onClose={() => setSelectedModel(null)} title={selectedModel?.name || ''} size="lg">
        {selectedModel && (
          <div className="space-y-4">
            <p className="text-surface-400">{selectedModel.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div><span className="text-surface-500">Organization:</span> <span className="font-medium text-surface-100">{selectedModel.organization}</span></div>
              <div><span className="text-surface-500">Release:</span> <span className="font-medium text-surface-100">{formatDate(selectedModel.releaseDate)}</span></div>
              <div><span className="text-surface-500">Parameters:</span> <span className="font-medium text-surface-100">{selectedModel.parameters}</span></div>
              <div><span className="text-surface-500">Context:</span> <span className="font-medium text-surface-100">{selectedModel.contextWindow.toLocaleString()} tokens</span></div>
              <div><span className="text-surface-500">License:</span> <span className="font-medium text-surface-100">{selectedModel.license}</span></div>
              <div><span className="text-surface-500">VRAM:</span> <span className="font-medium text-surface-100">{selectedModel.vramRequired}</span></div>
              <div><span className="text-surface-500">API:</span> <span className={`font-medium ${selectedModel.apiAvailable ? 'text-emerald-400' : 'text-surface-500'}`}>{selectedModel.apiAvailable ? 'Available' : 'Not Available'}</span></div>
              <div><span className="text-surface-500">Family:</span> <span className="font-medium text-surface-100">{selectedModel.family}</span></div>
              {(selectedModel as any).hfDownloads > 0 && (
                <div className="flex items-center gap-1"><span className="text-surface-500">HF Downloads:</span> <span className="font-medium text-surface-100 flex items-center gap-1"><Download size={12} />{(selectedModel as any).hfDownloads.toLocaleString()}</span></div>
              )}
              {(selectedModel as any).hfLikes > 0 && (
                <div className="flex items-center gap-1"><span className="text-surface-500">HF Likes:</span> <span className="font-medium text-surface-100 flex items-center gap-1"><Heart size={12} />{(selectedModel as any).hfLikes.toLocaleString()}</span></div>
              )}
            </div>
            {(selectedModel as any).hfTags && (selectedModel as any).hfTags.length > 0 && (
              <div>
                <span className="text-surface-500 text-sm">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(selectedModel as any).hfTags.slice(0, 8).map((tag: string) => (
                    <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                  ))}
                  {(selectedModel as any).hfTags.length > 8 && (
                    <Badge variant="default" size="sm">+{(selectedModel as any).hfTags.length - 8}</Badge>
                  )}
                </div>
              </div>
            )}
            {selectedModel.links && Object.keys(selectedModel.links).length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedModel.links.huggingface && (
                  <a href={selectedModel.links.huggingface} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-surface-400 hover:text-cyan-glow transition-colors">
                    <ExternalLink size={12} />HuggingFace
                  </a>
                )}
                {selectedModel.links.github && (
                  <a href={selectedModel.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-surface-400 hover:text-cyan-glow transition-colors">
                    <ExternalLink size={12} />GitHub
                  </a>
                )}
                {selectedModel.links.paper && (
                  <a href={selectedModel.links.paper} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-surface-400 hover:text-cyan-glow transition-colors">
                    <ExternalLink size={12} />Paper
                  </a>
                )}
                {selectedModel.links.docs && (
                  <a href={selectedModel.links.docs} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-surface-400 hover:text-cyan-glow transition-colors">
                    <ExternalLink size={12} />Docs
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
