import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts'
import { Search, X, Share2 } from 'lucide-react'
import { models } from '@/data/models'
import { benchmarkScores } from '@/data/benchmarks'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

const COLORS = ['#00e5ff', '#fb7185', '#10b981', '#f59e0b', '#c084fc', '#ec4899']

const PRICING: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 2.5, output: 10 }, 'gpt-4-turbo': { input: 10, output: 30 }, 'o1': { input: 15, output: 60 },
  'claude-3-5-sonnet': { input: 3, output: 15 }, 'claude-3-opus': { input: 15, output: 75 }, 'claude-3-haiku': { input: 0.8, output: 4 },
  'gemini-2-flash': { input: 0.15, output: 0.6 }, 'gemini-1-5-pro': { input: 1.25, output: 5 },
  'llama-3-3-70b': { input: 0.35, output: 0.5 }, 'llama-3-1-8b': { input: 0.06, output: 0.3 },
  'deepseek-v3': { input: 0.27, output: 1.1 }, 'deepseek-r1': { input: 0.55, output: 2.19 },
}

export default function ComparisonLab() {
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [useCase, setUseCase] = useState('')
  const [recommendation, setRecommendation] = useState('')

  const availableModels = useMemo(() => models.filter(m => !selected.includes(m.id)).filter(m => !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.organization.toLowerCase().includes(search.toLowerCase())), [selected, search])

  const radarData = useMemo(() => {
    if (selected.length < 2) return []
    const dims = ['coding', 'math', 'reasoning', 'instruction', 'vision', 'safety']
    const bmMap: Record<string, string[]> = {
      humaneval: ['coding'], 'humaneval+': ['coding'], mbpp: ['coding'], 'swe-bench': ['coding'],
      math: ['math'], gsm8k: ['math'],
      mmlu: ['reasoning'], 'mmlu-pro': ['reasoning'], 'arc-challenge': ['reasoning'], hellaswag: ['reasoning'],
      'mt-bench': ['instruction'], 'alpacaeval-2': ['instruction'],
      mmbench: ['vision'], mmmu: ['vision'],
      truthfulqa: ['safety'], bbq: ['safety'],
    }
    return dims.map(dim => {
      const obj: Record<string, number | string> = { dimension: dim }
      selected.forEach(mid => {
        const scores = benchmarkScores.filter(s => s.modelId === mid && bmMap[s.benchmarkId]?.includes(dim))
        obj[mid] = scores.length ? Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length) : 0
      })
      return obj
    }).filter(d => selected.some(mid => (d[mid] as number) > 0))
  }, [selected])

  const addModel = (id: string) => { if (selected.length < 6) setSelected([...selected, id]); setSearch('') }
  const removeModel = (id: string) => setSelected(selected.filter(s => s !== id))

  const handleUseCase = () => {
    const q = useCase.toLowerCase()
    let rec = ''
    if (q.includes('coding') || q.includes('sql') || q.includes('programming')) rec = q.includes('16gb') || q.includes('free') ? 'Try Llama 3.3 70B or DeepSeek-V3 for coding tasks. Both are open-source and can run on consumer hardware with quantization.' : 'Claude 3.5 Sonnet is the best coding model. For open-source, DeepSeek-V3 or Qwen 2.5 72B are top choices.'
    else if (q.includes('reasoning') || q.includes('math')) rec = 'o1 or DeepSeek-R1 are the top reasoning models. DeepSeek-R1 is open-source.'
    else if (q.includes('vision') || q.includes('image')) rec = 'GPT-4o and Gemini 1.5 Pro have the best vision capabilities. Reka Core is also strong for multimodal tasks.'
    else if (q.includes('fast') || q.includes('speed') || q.includes('latency')) rec = 'Gemini 2.0 Flash offers the best speed-to-performance ratio. Claude 3 Haiku is also very fast for lightweight tasks.'
    else rec = `Based on "${useCase}" - GPT-4o is the best all-rounder. For open-source, Llama 3.3 70B or DeepSeek-V3 offer excellent performance.`
    setRecommendation(rec)
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
                  const p = PRICING[mid]
                  return <tr key={mid} className="border-b border-surface-800/50"><td className="py-2 px-3 text-surface-100">{m?.name}</td><td className="py-2 px-3 text-right font-mono text-surface-400">{p ? `$${p.input}` : '-'}</td><td className="py-2 px-3 text-right font-mono text-surface-400">{p ? `$${p.output}` : '-'}</td></tr>
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
