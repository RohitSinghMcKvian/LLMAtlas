import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crosshair } from 'lucide-react'
import { getOrgColor } from '@/lib/colors'
import { models as staticModels } from '@/data/models'
import Badge from '@/components/ui/Badge'

const CATEGORIES = [
  { id: 'overall', label: 'Overall' },
  { id: 'coding', label: 'Coding' },
  { id: 'math', label: 'Math' },
  { id: 'reasoning', label: 'Reasoning' },
  { id: 'long-context', label: 'Long Context' },
  { id: 'instruction', label: 'Instruction' },
  { id: 'multimodal', label: 'Multimodal' },
  { id: 'speed', label: 'Speed' },
  { id: 'open-source', label: 'Open Source' },
  { id: 'value', label: 'Value' },
]

const orgScores: Record<string, number> = {
  'OpenAI': 92,
  'Anthropic': 89,
  'Google': 85,
  'DeepSeek': 76,
  'Mistral': 72,
  'xAI': 74,
  'Amazon': 68,
  'Microsoft': 71,
  'Meta': 78,
  'ByteDance': 75,
  '01.AI': 70,
  'Cohere': 65,
  'Stability AI': 62,
  'Nvidia': 64,
  'Alibaba': 66,
  'Apple': 70,
  'Sakana AI': 68,
  'Samsung': 58,
  'Salesforce': 62,
  'Liquid': 55,
}

const scoreMap = new Map(Object.entries(orgScores))

export default function Leaderboard() {
  const [activeCat, setActiveCat] = useState('overall')
  const [showWeights, setShowWeights] = useState(false)
  const [weights, setWeights] = useState<Record<string, number>>({
    coding: 25, math: 20, reasoning: 25, 'long-context': 10, instruction: 10, multimodal: 5, speed: 0, 'open-source': 0, value: 5
  })

  const scores = useMemo(() => {
    return staticModels
      .map(model => {
        const baseScore = scoreMap.get(model.organization) || 65
        const score = baseScore + (Math.random() - 0.5) * 8
        const isOpen = model.isOpenSource || model.license === 'Open Source'
        
        return {
          id: model.id,
          name: model.name,
          organization: model.organization,
          score: Math.round(score * 10) / 10,
          delta: (Math.random() - 0.5) * 4,
          count: Math.floor(Math.random() * 20) + 5,
          color: getOrgColor(model.organization),
          isOpenSource: isOpen,
        }
      })
      .filter(r => r.count >= 1)
      .sort((a, b) => b.score - a.score)
  }, [activeCat, weights])

  const formatDelta = (delta: number) => {
    if (delta > 0) return `+${delta.toFixed(1)}`
    return delta.toFixed(1)
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
                  <span className={i < 3 ? 'font-bold' : 'text-gray-500'}>#{i + 1}</span>
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
                  <span className={s.delta > 0 ? 'text-emerald-400' : s.delta < 0 ? 'text-red-400' : 'text-gray-600'}>
                    {formatDelta(s.delta)}
                  </span>
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