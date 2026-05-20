import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Check, Zap, Brain, Code, Eye } from 'lucide-react'

interface Model {
  id: string
  name: string
  provider?: string
  contextLength: number
  category?: string
}

interface ModelSelectorProps {
  models: Model[]
  selectedModels: string[]
  onToggle: (modelId: string) => void
  onClose: () => void
}

const quickPicks = [
  { id: 'best-overall', name: '🏆 Best Overall', models: ['google/gemini-2.5-flash', 'meta-llama/llama-3.3-70b-instruct:free', 'meta/llama-3.3-70b-instruct'] },
  { id: 'fastest', name: '⚡ Fastest', models: ['llama-3.1-8b-instant', 'microsoft/phi-3-mini-128k-instruct:free', 'microsoft/phi-4'] },
  { id: 'best-code', name: '💻 Best for Code', models: ['qwen/qwen-2.5-coder-32b-instruct:free', 'mistralai/codestral-2501', 'qwen/qwen2.5-coder-32b-instruct'] },
  { id: 'best-reasoning', name: '🧠 Best Reasoning', models: ['deepseek/deepseek-r1:free', 'deepseek-ai/deepseek-v3.2', 'qwen/qwen-3-235b-a22b'] },
  { id: 'nvidia-picks', name: '🟢 NVIDIA Top Picks', models: ['meta/llama-3.3-70b-instruct', 'nvidia/llama-3.1-nemotron-70b-instruct', 'google/gemma-4-31b-it', 'deepseek-ai/deepseek-v3.2'] },
]

const categoryIcons: Record<string, any> = {
  general: Zap,
  reasoning: Brain,
  coding: Code,
  vision: Eye,
}

export default function ModelSelector({ models, selectedModels, onToggle, onClose }: ModelSelectorProps) {
  const [search, setSearch] = useState('')
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const filteredModels = models.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.provider || '').toLowerCase().includes(search.toLowerCase())
  )

  const groupedModels = filteredModels.reduce<Record<string, Model[]>>((acc, model) => {
    const provider = model.provider || 'other'
    if (!acc[provider]) acc[provider] = []
    acc[provider].push(model)
    return acc
  }, {})

  const handleQuickPick = (modelIds: string[]) => {
    modelIds.forEach(id => {
      if (!selectedModels.includes(id)) {
        onToggle(id)
      }
    })
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-strong rounded-xl border border-white/10 overflow-hidden absolute left-0 right-0 z-50 shadow-2xl bg-surface-950"
    >
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-surface-100">Select Models</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5 text-surface-400 hover:text-surface-200">
            <X size={18} />
          </button>
        </div>
        
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search models or providers..."
            className="w-full pl-10 pr-4 py-2 rounded-lg glass-input text-sm"
          />
        </div>
      </div>

      {!search && (
        <div className="p-4 border-b border-white/5">
          <h4 className="text-xs font-medium text-surface-500 uppercase tracking-wider mb-3">Quick Picks</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickPicks.map(pick => (
              <button
                key={pick.id}
                onClick={() => handleQuickPick(pick.models)}
                className="p-3 rounded-lg glass hover:bg-white/5 text-left transition-all hover:scale-[1.02]"
              >
                <span className="text-sm font-medium text-surface-200">{pick.name}</span>
                <span className="block text-xs text-surface-500 mt-1">{pick.models.length} models</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
        {Object.entries(groupedModels).map(([provider, providerModels]) => (
          <div key={provider} className="border-b border-white/5 last:border-0">
            <button
              onClick={() => setExpandedCategory(expandedCategory === provider ? null : provider)}
              className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-surface-200 capitalize">{provider}</span>
                <span className="text-xs text-surface-500">({providerModels.length})</span>
              </div>
              <motion.div
                animate={{ rotate: expandedCategory === provider ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-surface-500">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </button>
            
            <AnimatePresence>
              {expandedCategory === provider && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2">
                    {providerModels.map(model => {
                      const isSelected = selectedModels.includes(model.id)
                      const CategoryIcon = (model.category && categoryIcons[model.category]) || Zap
                      
                      return (
                        <button
                          key={model.id}
                          onClick={() => onToggle(model.id)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                            isSelected
                              ? 'bg-cyan-glow/10 border border-cyan-glow/20'
                              : 'glass hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded flex items-center justify-center ${
                              isSelected ? 'bg-cyan-glow text-surface-950' : 'bg-white/5 text-surface-500'
                            }`}>
                              <Check size={12} />
                            </div>
                            <div className="text-left">
                              <span className="text-sm font-medium text-surface-200">{model.name}</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <CategoryIcon size={12} className="text-surface-500" />
                                <span className="text-xs text-surface-500">
                                  {(model.contextLength / 1000).toFixed(0)}K context
                                </span>
                                <span className="text-xs text-surface-600 capitalize">• {model.category}</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
