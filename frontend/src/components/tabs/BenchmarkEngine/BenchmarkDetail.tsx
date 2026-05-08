import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, AlertCircle, BarChart3, TrendingUp, Award } from 'lucide-react'
import api from '@/lib/api'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import type { Benchmark } from '@/types/benchmark'

export default function BenchmarkDetail() {
  const { benchmarkId } = useParams()
  const [benchmark, setBenchmark] = useState<Benchmark | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'score' | 'model'>('score')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    async function fetchBenchmark() {
      try {
        const data = await api.getBenchmark(benchmarkId!)
        setBenchmark(data)
      } catch (e) {
        console.error('Failed to fetch benchmark:', e)
      } finally {
        setLoading(false)
      }
    }
    if (benchmarkId) fetchBenchmark()
  }, [benchmarkId])

  if (loading) {
    return (
      <div className="space-y-4 pt-8">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-48" />
        <div className="skeleton h-64" />
      </div>
    )
  }

  if (!benchmark) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle size={48} className="text-surface-500 mb-4" />
        <h2 className="text-xl font-semibold text-surface-300">Benchmark not found</h2>
        <Link to="/benchmarks" className="mt-4 text-cyan-glow hover:underline">Back to Benchmarks</Link>
      </div>
    )
  }

  const sortedScores = [...(benchmark.scores || [])].sort((a, b) => {
    if (sortBy === 'score') {
      return sortOrder === 'desc' ? b.score - a.score : a.score - b.score
    }
    return 0
  })

  return (
    <div className="min-h-screen">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link to="/benchmarks" className="inline-flex items-center gap-2 text-surface-500 hover:text-cyan-glow transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm">Back to Benchmark Engine</span>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-100">{benchmark.name}</h1>
          <Badge variant="info">{benchmark.category}</Badge>
        </div>

        {benchmark.shortName && (
          <p className="text-surface-500">{benchmark.shortName}</p>
        )}

        <p className="mt-4 text-surface-300 max-w-2xl">{benchmark.description}</p>

        {benchmark.whyItMatters && (
          <div className="mt-4 p-4 rounded-lg bg-surface-900/50 border border-surface-800">
            <h3 className="font-semibold text-surface-200 mb-2 flex items-center gap-2">
              <TrendingUp size={16} className="text-cyan-glow" />
              Why It Matters
            </h3>
            <p className="text-surface-400 text-sm">{benchmark.whyItMatters}</p>
          </div>
        )}

        {benchmark.limitations && (
          <div className="mt-4 p-4 rounded-lg bg-surface-900/50 border border-surface-800">
            <h3 className="font-semibold text-surface-200 mb-2">Limitations</h3>
            <p className="text-surface-400 text-sm">{benchmark.limitations}</p>
          </div>
        )}
      </motion.div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-surface-200 flex items-center gap-2">
          <BarChart3 size={18} className="text-cyan-glow" />
          Leaderboard
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setSortBy('score'); setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc') }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg glass-light text-sm text-surface-400 hover:text-surface-200"
          >
            Sort by Score
          </button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                <th className="text-left py-3 px-4 text-surface-500 font-medium">Rank</th>
                <th className="text-left py-3 px-4 text-surface-500 font-medium">Model</th>
                <th className="text-left py-3 px-4 text-surface-500 font-medium">Organization</th>
                <th className="text-right py-3 px-4 text-surface-500 font-medium">Score</th>
                <th className="text-right py-3 px-4 text-surface-500 font-medium">Source</th>
              </tr>
            </thead>
            <tbody>
              {sortedScores.map((score: any, index: number) => (
                <tr key={score.id} className="border-b border-surface-800/50 hover:bg-surface-900/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Award size={16} className="text-amber-400" />}
                      {index === 1 && <Award size={16} className="text-gray-400" />}
                      {index === 2 && <Award size={16} className="text-amber-600" />}
                      <span className={index < 3 ? 'font-bold' : 'text-surface-400'}>#{index + 1}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Link to={`/models/${score.modelId}`} className="text-surface-200 hover:text-cyan-glow transition-colors">
                      {score.model?.name || score.modelId}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-surface-400">{score.model?.organization || '-'}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-bold ${
                      score.score >= 80 ? 'text-emerald-400' :
                      score.score >= 60 ? 'text-cyan-glow' :
                      score.score >= 40 ? 'text-amber-400' :
                      'text-red-400'
                    }`}>
                      {score.score.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge variant={score.source === 'Official' ? 'success' : 'default'} size="sm">
                      {score.source}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!sortedScores || sortedScores.length === 0) && (
          <div className="py-12 text-center text-surface-500">
            No scores available for this benchmark yet.
          </div>
        )}
      </Card>

      {benchmark.methodologyUrl && (
        <div className="mt-6">
          <a 
            href={benchmark.methodologyUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-cyan-glow hover:underline text-sm"
          >
            <ExternalLink size={14} />
            View Methodology
          </a>
        </div>
      )}
    </div>
  )
}