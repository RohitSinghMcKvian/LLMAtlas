import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, LayoutGrid, Clock, Calendar, HardDrive, Globe } from 'lucide-react'
import { models } from '@/data/models'
import type { Model, ModelStatus, LicenseType, Modality } from '@/types/model'
import { formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'

const statusMap: Record<ModelStatus, string> = {
  Available: 'bg-emerald-400', Beta: 'bg-blue-400', 'Research Preview': 'bg-purple-400', Announced: 'bg-amber-400',
}

export default function ModelTracker() {
  const [search, setSearch] = useState('')
  const [licFilters, setLicFilters] = useState<LicenseType[]>([])
  const [statFilters, setStatFilters] = useState<ModelStatus[]>([])
  const [modFilters, setModFilters] = useState<Modality[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid')
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)

  const allLic = useMemo(() => [...new Set(models.map(m => m.license))] as LicenseType[], [])
  const allStat = useMemo(() => [...new Set(models.map(m => m.status))] as ModelStatus[], [])
  const allMod = useMemo(() => [...new Set(models.flatMap(m => m.modalities))] as Modality[], [])

  const filtered = useMemo(() => models.filter(m => {
    if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.organization.toLowerCase().includes(search.toLowerCase())) return false
    if (licFilters.length && !licFilters.includes(m.license)) return false
    if (statFilters.length && !statFilters.includes(m.status)) return false
    if (modFilters.length && !modFilters.some(mod => m.modalities.includes(mod))) return false
    return true
  }), [search, licFilters, statFilters, modFilters])

  const toggle = <T,>(arr: T[], val: T): T[] => arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-100 section-header">Model Tracker</h1>
        <p className="mt-1 text-sm sm:text-base text-surface-500">Live database of every known LLM — open, closed, and upcoming</p>
      </motion.div>

      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative flex-1 min-w-[160px] sm:min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search models..." className="w-full rounded-lg glass-input py-2 pl-10 pr-4 text-sm" />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
            {allLic.map(l => <button key={l} onClick={() => setLicFilters(toggle(licFilters, l))} className={`filter-chip ${licFilters.includes(l) ? 'filter-chip-active' : ''}`}>{l}</button>)}
          </div>
          <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
            {allStat.map(s => <button key={s} onClick={() => setStatFilters(toggle(statFilters, s))} className={`filter-chip ${statFilters.includes(s) ? 'filter-chip-active' : ''}`}>{s}</button>)}
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <Badge variant="info" size="sm">{filtered.length} models</Badge>
            <button onClick={() => setViewMode('grid')} className={`rounded-lg p-2 transition-colors ${viewMode === 'grid' ? 'bg-accent-500/15 text-cyan-glow' : 'text-surface-500 hover:text-surface-300'}`}><LayoutGrid size={18} /></button>
            <button onClick={() => setViewMode('timeline')} className={`rounded-lg p-2 transition-colors ${viewMode === 'timeline' ? 'bg-accent-500/15 text-cyan-glow' : 'text-surface-500 hover:text-surface-300'}`}><Clock size={18} /></button>
          </div>
        </div>

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
                    {model.modalities.slice(0, 2).map(mod => <Badge key={mod} variant="info" size="sm">{mod}</Badge>)}
                    {model.modalities.length > 2 && <Badge variant="default" size="sm">+{model.modalities.length - 2}</Badge>}
                  </div>
                  <div className="mt-3 flex items-center gap-3 sm:gap-4 text-xs text-surface-500">
                    <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(model.releaseDate)}</span>
                    <span className="flex items-center gap-1"><HardDrive size={12} />{model.vramRequired}</span>
                    {model.apiAvailable && <span className="flex items-center gap-1 text-emerald-400"><Globe size={12} />API</span>}
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
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
