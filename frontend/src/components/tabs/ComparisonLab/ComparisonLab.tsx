import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts'
import { Search, X, Share2 } from 'lucide-react'
import type { Model } from '@/types/model'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import api from '@/lib/api'

const COLORS = ['#00e5ff', '#fb7185', '#10b981', '#f59e0b', '#c084fc', '#ec4899']

export default function ComparisonLab() {
  const [models, setModels] = useState<Model[]>([])
  const [benchmarkData, setBenchmarkData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [useCase, setUseCase] = useState('')
  const [recommendation, setRecommendation] = useState('')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [modelsData, benchmarksData] = await Promise.all([
          api.getModels(),
          api.getBenchmarks()
        ])
        setModels(modelsData)
        setBenchmarkData(benchmarksData)
      } catch (e) {
        console.error('Failed to fetch comparison data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const availableModels = useMemo(() =>
    models.filter(m => !selected.includes(m.id))
      .filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.organization.toLowerCase().includes(search.toLowerCase())),
    [selected, search, models]
  )

  const radarData = useMemo(() => {
    if (selected.length < 2) return []
    const dims = ['coding', 'math', 'reasoning', 'instruction', 'vision', 'safety']
    const bmMap: Record<string, string[]> = {
      humaneval: ['coding'], 'humaneval+': ['coding'], 'humaneval-plus': ['coding'], mbpp: ['coding'], 'swe-bench-verified': ['coding'],
      math: ['math'], gsm8k: ['math'],
      mmlu: ['reasoning'], 'mmlu-pro': ['reasoning'], 'arc-challenge': ['reasoning'], hellaswag: ['reasoning'],
      'mt-bench': ['instruction'], 'alpacaeval-2': ['instruction'],
      mmbench: ['vision'], mmmu: ['vision'],
      truthfulqa: ['safety'], bbq: ['safety'],
    }
    return dims.map(dim => {
      const obj: Record<string, number | string> = { dimension: dim }
      selected.forEach(mid => {
        const scores = benchmarkData
          .flatMap((b: any) => b.scores || [])
          .filter((s: any) => s.modelId === mid && bmMap[s.benchmarkId]?.includes(dim))
        obj[mid] = scores.length ? Math.round(scores.reduce((a: number, b: any) => a + b.score, 0) / scores.length) : 0
      })
      return obj
    }).filter(d => selected.some(mid => (d[mid] as number) > 0))
  }, [selected, benchmarkData])

  const addModel = (id: string) => { if (selected.length < 6) setSelected([...selected, id]); setSearch('') }
  const removeModel = (id: string) => setSelected(selected.filter(s => s !== id))

  const handleUseCase = async () => {
    try {
      const weights = { speed: 0.2, cost: 0.2, reasoning: 0.2, coding: 0.2, context: 0.1, multimodal: 0.1 }
      const result = await api.recommendModels(useCase, weights)
      if (result.recommendations?.length > 0) {
        setRecommendation(`Top recommendation: ${result.recommendations[0].name} (score: ${result.recommendations[0].recommendationScore})`)
      } else {
        setRecommendation('No specific recommendation available. Try GPT-4o as an all-rounder.')
      }
    } catch {
      setRecommendation('Unable to fetch recommendations. Try GPT-4o as an all-rounder.')
    }
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
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-100 section-header">Comparison Lab</h1>
        <p className="mt-1 text-sm sm:text-base text-surface-500">Side-by-side model analysis across benchmarks, cost, and speed</p>
      </motion.div>

      <Card className="mb-6">
        <p className="text-sm font-medium text-surface-100 mb-2">Select models to compare (2-6)</p>
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search models..." className="w-full rounded-lg glass-input py-2 pl-10 pr-4 text-sm" />
          </div>
        </div>
        {search && availableModels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">{availableModels.slice(0, 10).map(m => <button key={m.id} onClick={() => addModel(m.id)} className="filter-chip">{m.name}</button>)}</div>
        )}
        <div className="flex flex-wrap gap-2">
          {selected.map((mid, i) => {
            const m = models.find(x => x.id === mid)
            return m ? (
              <span key={mid} className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: COLORS[i] }}>{m.name}<button onClick={() => removeModel(mid)}><X size={12} /></button></span>
            ) : null
          })}
        </div>
      </Card>

      {selected.length >= 2 && (
        <>
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-surface-100 mb-4">Skill Profile</h3>
            {radarData.length > 0 ? (
              <div className="h-[280px] sm:h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#334e68" />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: '#829ab1' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#627d98' }} />
                    {selected.map((mid, i) => {
                      const m = models.find(x => x.id === mid)
                      return <Radar key={mid} name={m?.name || mid} dataKey={mid} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.1} strokeWidth={2} />
                    })}
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : <p className="text-sm text-surface-500">Not enough benchmark data for radar comparison.</p>}
          </Card>

          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-surface-100 mb-3">Cost Comparison (per 1M tokens)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[300px]">
                <thead><tr className="border-b border-surface-800"><th className="text-left py-2 px-3 text-surface-500">Model</th><th className="text-right py-2 px-3 text-surface-500">Input</th><th className="text-right py-2 px-3 text-surface-500">Output</th></tr></thead>
                <tbody>{selected.map(mid => {
                  const m = models.find(x => x.id === mid)
                  const pricing = (m as any).pricing
                  const inputPrice = (m as any).pricingInput
                  const outputPrice = (m as any).pricingOutput
                  return <tr key={mid} className="border-b border-surface-800/50"><td className="py-2 px-3 text-surface-100">{m?.name}</td><td className="py-2 px-3 text-right font-mono text-surface-400">{inputPrice ? `$${inputPrice}` : (pricing ? pricing.split('/')[0]?.replace('$', '') : '-')}</td><td className="py-2 px-3 text-right font-mono text-surface-400">{outputPrice ? `$${outputPrice}` : (pricing ? pricing.split('/')[1]?.trim().split(' ')[0]?.replace('$', '') : '-')}</td></tr>
                })}</tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-surface-100 mb-3">Use-Case Matcher</h3>
        <p className="text-sm text-surface-500 mb-3">Describe your use case and get model recommendations.</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input type="text" value={useCase} onChange={e => setUseCase(e.target.value)} placeholder='e.g. "SQL generation on 16GB VRAM"' className="flex-1 rounded-lg glass-input py-2 px-3 text-sm" />
          <Button onClick={handleUseCase} size="md" className="flex items-center gap-1 shrink-0"><Share2 size={14} />Get Recommendation</Button>
        </div>
        {recommendation && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 glass rounded-lg text-sm text-cyan-glow border border-cyan-glow/10">{recommendation}</motion.div>}
      </Card>
    </div>
  )
}
