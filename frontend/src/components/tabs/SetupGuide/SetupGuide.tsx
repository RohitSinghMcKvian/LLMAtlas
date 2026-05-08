import { useState } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Cpu, ChevronDown, ChevronRight, Globe, Zap } from 'lucide-react'
import { toolGuides, freeAPIGuides } from '@/data/guides'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import CodeBlock from '@/components/ui/CodeBlock'

const LEVEL_ORDER: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced']

export default function SetupGuide() {
  const [activeLevel, setActiveLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')
  const [expandedTool, setExpandedTool] = useState<string | null>(null)
  const [expandedAPI, setExpandedAPI] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'tools' | 'api'>('tools')

  const levelTools = toolGuides.filter(g => g.level === activeLevel)
  const modelRecs: Record<string, { vram: string; model: string; notes: string }[]> = {
    Beginner: [
      { vram: '4 GB', model: 'Phi-3 Mini (3.8B)', notes: 'Best for basic chat, runs on integrated graphics' },
      { vram: '8 GB', model: 'Llama 3.1 8B / Gemma 2 9B', notes: 'Solid all-rounders for most tasks' },
      { vram: '12 GB', model: 'Phi-4 14B / Qwen 2.5 14B', notes: 'Strong reasoning for their size' },
      { vram: '16 GB', model: 'Gemma 2 27B (Q4) / Llama 3.1 8B', notes: 'Good balance of quality and speed' },
      { vram: '24 GB+', model: 'Llama 3.3 70B (Q4) / Qwen 2.5 32B', notes: 'Near-ChatGPT quality locally' },
    ],
    Intermediate: [
      { vram: '4 GB', model: 'Gemma 2 9B (Q4)', notes: 'With llama.cpp optimizations' },
      { vram: '8 GB', model: 'Llama 3.1 8B (Q5)', notes: 'Good quality with LM Studio' },
      { vram: '16 GB', model: 'Qwen 2.5 32B (Q4)', notes: 'Excellent coding capabilities' },
      { vram: '24 GB+', model: 'Llama 3.3 70B (Q5) / Mixtral 8x7B', notes: 'Production-quality with llama.cpp' },
    ],
    Advanced: [
      { vram: '8 GB', model: 'Llama 3.1 8B (AWQ)', notes: 'With vLLM for high throughput' },
      { vram: '24 GB', model: 'Qwen 2.5 32B (GPTQ)', notes: 'Good for fine-tuning with QLoRA' },
      { vram: '48 GB+', model: 'Llama 3.3 70B / DeepSeek-V3', notes: 'Full production with PEFT fine-tuning' },
    ],
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-100 section-header">Setup &amp; Configuration Guide</h1>
        <p className="mt-1 text-sm sm:text-base text-surface-500">End-to-end onboarding for running LLMs locally or via free APIs</p>
      </motion.div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex glass rounded-xl p-1">
          {(['tools', 'api'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === t ? 'bg-surface-700/50 text-cyan-glow shadow-sm' : 'text-surface-500 hover:text-surface-300'}`}>
              {t === 'tools' ? <><Terminal size={14} className="inline mr-1" />Local Setup</> : <><Globe size={14} className="inline mr-1" />Free API Tiers</>}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'tools' ? (
        <>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
            {LEVEL_ORDER.map(level => (
              <button key={level} onClick={() => { setActiveLevel(level); setExpandedTool(null) }} className={`filter-chip ${activeLevel === level ? 'filter-chip-active' : ''}`}>{level}</button>
            ))}
          </div>

          <Card className="mb-6">
            <h3 className="font-semibold text-surface-100 mb-3">Hardware &amp; Model Recommendations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {modelRecs[activeLevel].map(r => (
                <div key={r.vram} className="glass rounded-lg p-3">
                  <p className="text-sm font-medium text-surface-100">{r.vram}</p>
                  <p className="text-xs text-cyan-glow">{r.model}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{r.notes}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            {levelTools.map(tool => (
              <Card key={tool.id}>
                <button onClick={() => setExpandedTool(expandedTool === tool.id ? null : tool.id)} className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-cyan-glow/10 flex items-center justify-center text-cyan-glow shrink-0">
                      <Cpu size={20} />
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="font-semibold text-surface-100 truncate">{tool.name}</h3>
                      <p className="text-sm text-surface-500 truncate">{tool.description}</p>
                    </div>
                  </div>
                  {expandedTool === tool.id ? <ChevronDown size={18} className="text-surface-500 shrink-0" /> : <ChevronRight size={18} className="text-surface-500 shrink-0" />}
                </button>
                {expandedTool === tool.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 pt-4 border-t border-surface-800 space-y-4">
                    {tool.sections.map(sec => (
                      <div key={sec.id}>
                        <h4 className="text-sm font-medium text-surface-100 mb-1">{sec.title}</h4>
                        <p className="text-sm text-surface-400 mb-2">{sec.content}</p>
                        {sec.codeSnippets.map((snip, i) => (
                          <div key={i} className="mb-2"><CodeBlock code={snip.code} language={snip.language} /></div>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {freeAPIGuides.map(api => (
            <Card key={api.id}>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-surface-100">{api.provider}</h3>
                <Badge variant="success" size="sm">Free Tier</Badge>
              </div>
              <p className="text-sm text-surface-500 mb-2">{api.description}</p>
              <p className="text-xs text-surface-500 mb-2"><Zap size={12} className="inline mr-1 text-cyan-glow" />{api.rateLimit}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {api.availableModels.map(m => <Badge key={m} variant="info" size="sm">{m}</Badge>)}
              </div>
              <button onClick={() => setExpandedAPI(expandedAPI === api.id ? null : api.id)} className="text-sm text-cyan-glow hover:text-accent-300 flex items-center gap-1 transition-colors">
                {expandedAPI === api.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}Code Examples
              </button>
              {expandedAPI === api.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="mt-3 space-y-2 overflow-hidden">
                  <CodeBlock code={api.pythonExample} language="python" />
                  <CodeBlock code={api.javascriptExample} language="javascript" />
                </motion.div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
