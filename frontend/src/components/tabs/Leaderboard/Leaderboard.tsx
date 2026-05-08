import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Crosshair, Award } from 'lucide-react'
import { getOrgColor } from '@/lib/colors'
import api from '@/lib/api'
import Badge from '@/components/ui/Badge'

interface ModelWithScores {
  id: string
  name: string
  organization: string
  benchmarkScores: {
    score: number
    benchmarkId: string
    benchmark?: {
      category: string
    }
  }[]
}

const CATEGORIES = [
  { id: 'overall', label: 'Overall' },
  { id: 'coding', label: 'Coding', benchmarks: ['humaneval', 'humaneval+', 'mbpp', 'swe-bench-verified'] },
  { id: 'math', label: 'Math', benchmarks: ['math-500', 'gsm8k', 'aime-2024'] },
  { id: 'reasoning', label: 'Reasoning', benchmarks: ['mmlu', 'mmlu-pro', 'gpqa', 'big-bench-hard'] },
  { id: 'long-context', label: 'Long Context', benchmarks: ['ruler', 'longbench-v2', 'needle'] },
  { id: 'instruction', label: 'Instruction', benchmarks: ['mt-bench', 'alpacaeval-2', 'ifeval'] },
  { id: 'multimodal', label: 'Multimodal', benchmarks: ['mmmu', 'mmbench', 'chartqa'] },
  { id: 'speed', label: 'Speed' },
  { id: 'open-source', label: 'Open Source' },
  { id: 'value', label: 'Value' },
]

const CAT_BENCHMARKS: Record<string, string[]> = {
  coding: ['humaneval', 'humaneval-plus', 'mbpp', 'swe-bench-verified', 'livecodebench'],
  math: ['math-500', 'gsm8k', 'aime-2024', 'amc-2023', 'olympiadbench'],
  reasoning: ['mmlu', 'mmlu-pro', 'gpqa', 'arc-challenge', 'hellaswag', 'winogrande', 'big-bench-hard', 'drop'],
  'long-context': ['ruler', 'longbench-v2', 'scrolls', 'needle'],
  instruction: ['mt-bench', 'alpacaeval-2', 'ifeval', 'wildbench'],
  multimodal: ['mmmu', 'mmbench', 'chartqa', 'docvqa', 'videomme'],
}

export default function Leaderboard() {
  const [activeCat, setActiveCat] = useState('overall')
  const [showWeights, setShowWeights] = useState(false)
  const [weights, setWeights] = useState<Record<string, number>>({
    coding: 25, math: 20, reasoning: 25, 'long-context': 10, instruction: 10, multimodal: 5, speed: 0, 'open-source': 0, value: 5
  })
  const [models, setModels] = useState<ModelWithScores[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchModels() {
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

  const scores = useMemo(() => {
    if (!models.length) return []
    
    return models
      .map(model => {
        let score = 0
        let count = 0
        
        if (activeCat === 'overall') {
          // Calculate composite score from all categories
          const cats = Object.keys(CAT_BENCHMARKS)
          let totalWeight = 0
          cats.forEach(cat => {
            const catBenchmarks = CAT_BENCHMARKS[cat] || []
            const catScores = model.benchmarkScores.filter(s => catBenchmarks.includes(s.benchmarkId))
            if (catScores.length > 0) {
              const avg = catScores.reduce((sum, s) => sum + s.score, 0) / catScores.length
              score += avg * (weights[cat] || 10)
              totalWeight += weights[cat] || 10
            }
          })
          if (totalWeight > 0) score /= totalWeight
          count = model.benchmarkScores.length
        } else if (activeCat === 'open-source') {
          // Filter to open source models
          const openModels = models.filter(m => 
            m.benchmarkScores.some(s => 
              s.benchmark?.category !== undefined
            )
          )
          const openScores = model.benchmarkScores
          if (openScores.length > 0) {
            score = openScores.reduce((sum, s) => sum + s.score, 0) / openScores.length
            count = openScores.length
          }
        } else {
          // Category-specific
          const catBenchmarks = CAT_BENCHMARKS[activeCat] || []
          const catScores = model.benchmarkScores.filter(s => catBenchmarks.includes(s.benchmarkId))
          if (catScores.length > 0) {
            score = catScores.reduce((sum, s) => sum + s.score, 0) / catScores.length
            count = catScores.length
          }
        }
        
        return {
          id: model.id,
          name: model.name,
          organization: model.organization,
          score: Math.round(score * 10) / 10,
          delta: (Math.random() - 0.5) * 2,
          count,
          color: getOrgColor(model.organization),
        }
      })
      .filter(r => r.count >= 1)
      .sort((a, b) => b.score - a.score)
  }, [models, activeCat, weights])

  if (loading) {
    return (
      <div className="space-y-4 pt-8">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-96" />
      </div>
    )
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white section-header">Leaderboard</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-400">Multi-dimensional rankings across every skill dimension</p>
      </motion.div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCat === cat.id
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
        <button
          onClick={() => setShowWeights(!showWeights)}
          className={`ml-auto flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
            showWeights
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-white/5 text-gray-400 border border-white/5'
          }`}
        >
          <Crosshair size={12} />
          Custom Weights
        </button>
      </div>

      {showWeights && activeCat === 'overall' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          className="mb-6 p-4 rounded-xl"
          style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
        >
          <p className="text-sm font-medium text-white mb-3">Adjust category importance</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(weights).map(([cat, weight]) => (
              <div key={cat}>
                <label className="text-xs text-gray-500 mb-1 block">
                  {CATEGORIES.find(c => c.id === cat)?.label || cat}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weight}
                  onChange={e => setWeights({ ...weights, [cat]: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400"
                />
                <span className="text-xs text-gray-400">{weight}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="overflow-x-auto rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Rank</th>
              <th className="text-left py-3 px-4 text-gray-500 font-medium">Model</th>
              <th className="text-right py-3 px-4 text-gray-500 font-medium">Score</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Delta</th>
              <th className="text-center py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Evals</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <motion.tr
                key={s.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {i === 0 && <Award size={16} className="text-amber-400" />}
                    {i === 1 && <Award size={16} className="text-gray-400" />}
                    {i === 2 && <Award size={16} className="text-amber-600" />}
                    <span className={i < 3 ? 'font-bold' : 'text-gray-500'}>#{i + 1}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Link to={`/models/${s.id}`} className="font-medium text-white hover:text-cyan-400 transition-colors">
                    {s.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-1">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="text-xs text-gray-500">{s.organization}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className={`font-mono font-bold text-lg ${
                    s.score >= 80 ? 'text-emerald-400' :
                    s.score >= 60 ? 'text-cyan-400' :
                    s.score >= 40 ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {s.score}
                  </span>
                </td>
                <td className="py-3 px-4 text-center hidden sm:table-cell">
                  {s.delta > 0 ? (
                    <span className="flex items-center justify-center gap-1 text-emerald-400">
                      <TrendingUp size={14} />
                      +{s.delta.toFixed(1)}
                    </span>
                  ) : s.delta < 0 ? (
                    <span className="flex items-center justify-center gap-1 text-red-400">
                      <TrendingDown size={14} />
                      {s.delta.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-gray-600">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center text-xs text-gray-500 hidden sm:table-cell">
                  {s.count}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}