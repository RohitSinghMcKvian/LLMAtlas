import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getOrgColor } from '@/lib/colors'
import api from '@/lib/api'
import Badge from '@/components/ui/Badge'

const CATEGORIES = [
  { id: 'text', label: 'Overall' },
  { id: 'code', label: 'Coding' },
  { id: 'vision', label: 'Vision' },
  { id: 'search', label: 'Search' },
  { id: 'document', label: 'Document' },
]

export default function Leaderboard() {
  const [activeCat, setActiveCat] = useState('text')
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [source, setSource] = useState<string>('')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const data = await api.getLeaderboard(activeCat)
        setEntries(data.entries || [])
        setLastUpdated(data.lastUpdated || '')
        setSource(data.source || '')
      } catch (e) {
        console.error('Failed to fetch leaderboard:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [activeCat])

  if (loading) {
    return (
      <div className="space-y-4 pt-8">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-96" />
      </div>
    )
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Leaderboard</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-400">
          Live rankings from LMSYS Chatbot Arena
          {source && <span className="ml-2 text-xs text-gray-500">({source})</span>}
          {lastUpdated && <span className="ml-2 text-xs text-gray-500">Updated {new Date(lastUpdated).toLocaleDateString()}</span>}
        </p>
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
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No leaderboard data available</p>
          <p className="text-sm mt-2">Try syncing data from the admin panel</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Rank</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Model</th>
                <th className="text-right py-3 px-4 text-gray-500 font-medium">Arena Score</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">95% CI</th>
                <th className="text-center py-3 px-4 text-gray-500 font-medium hidden sm:table-cell">Votes</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <motion.tr
                  key={entry.model}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5) }}
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className={i < 3 ? 'font-bold text-white' : 'text-gray-500'}>#{entry.rank}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Link to={`/models/${entry.modelId || entry.model}`} className="font-medium text-white hover:text-cyan-400 transition-colors">
                      {entry.model}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getOrgColor(entry.organization) }} />
                      <span className="text-xs text-gray-500">{entry.organization}</span>
                      {entry.license === 'Open Source' && (
                        <Badge variant="success" size="sm" className="ml-1">Open</Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-mono font-bold text-lg ${
                      entry.arenaScore >= 1100 ? 'text-emerald-400' :
                      entry.arenaScore >= 1050 ? 'text-cyan-400' :
                      entry.arenaScore >= 1000 ? 'text-amber-400' :
                      'text-gray-400'
                    }`}>
                      {entry.arenaScore}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-xs text-gray-500 hidden sm:table-cell">
                    [{entry.ci95?.[0]}, {entry.ci95?.[1]}]
                  </td>
                  <td className="py-3 px-4 text-center text-xs text-gray-500 hidden sm:table-cell">
                    {entry.votes?.toLocaleString() || 'N/A'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
