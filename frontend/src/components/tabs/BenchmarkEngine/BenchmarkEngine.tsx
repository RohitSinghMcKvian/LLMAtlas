import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Info, ExternalLink, TrendingUp } from 'lucide-react'
import { getOrgColor } from '@/lib/colors'
import api from '@/lib/api'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import type { Benchmark, BenchmarkScore, Model } from '@/types/benchmark'

interface BenchmarkWithScores extends Benchmark {
  scores?: (BenchmarkScore & { model?: Model })[]
}

export default function BenchmarkEngine() {
  const [selectedCat, setSelectedCat] = useState<string>('All')
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBenchmarks() {
      try {
        const data = await api.getBenchmarks(selectedCat === 'All' ? undefined : selectedCat)
        setBenchmarks(data)
      } catch (e) {
        console.error('Failed to fetch benchmarks:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchBenchmarks()
  }, [selectedCat])

  const categories = useMemo(() => {
    const cats = new Set(benchmarks.map(b => b.category))
    return ['All', ...Array.from(cats)]
  }, [benchmarks])

  const getTopModels = (scores: any[]) => {
    if (!scores || scores.length === 0) return []
    return [...scores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((s: any) => ({
        name: s.model?.name || s.modelId,
        score: s.score,
        organization: s.model?.organization || '',
      }))
  }

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
        <h1 className="text-2xl sm:text-3xl font-bold text-white section-header">Benchmark Engine</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-400">Comprehensive evaluation data across all major benchmarks</p>
      </motion.div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat: any) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCat === cat
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {selectedCat === 'All' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benchmarks.map((bench) => (
            <Link key={bench.id} to={`/benchmarks/${bench.id}`}>
              <Card className="p-4 hover:border-cyan-500/30 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="info" size="sm">{bench.category}</Badge>
                </div>
                <h3 className="font-semibold text-white mb-1">{bench.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{bench.description}</p>
                {bench.scores && bench.scores.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    <TrendingUp size={12} />
                    <span>{bench.scores.length} models evaluated</span>
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {benchmarks.map((bench) => (
            <Card key={bench.id} className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{bench.name}</h3>
                  <p className="text-sm text-gray-400">{bench.shortName}</p>
                </div>
                <Badge variant="info" size="sm">{bench.category}</Badge>
              </div>

              <p className="text-sm text-gray-400 mb-4">{bench.description}</p>

              {bench.scores && bench.scores.length > 0 ? (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getTopModels(bench.scores)} layout="vertical">
                      <XAxis type="number" domain={[0, 100]} stroke="#6b7280" fontSize={11} />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        stroke="#6b7280" 
                        fontSize={11} 
                        width={100}
                        tick={{ fill: '#9ca3af' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(7, 14, 26, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                        {getTopModels(bench.scores).map((entry: any, index: number) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={getOrgColor(entry.organization) || '#6b7280'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No scores available</p>
              )}

              <div className="mt-4 flex justify-end">
                <Link 
                  to={`/benchmarks/${bench.id}`}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                >
                  View full leaderboard <ExternalLink size={12} />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}