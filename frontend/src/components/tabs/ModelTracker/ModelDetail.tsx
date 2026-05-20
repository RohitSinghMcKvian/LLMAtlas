import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, ExternalLink, Copy, Bookmark, GitCompare, Cpu, Globe, Database, 
  Code, Zap, Brain, BookOpen, Terminal, Download, Heart, Tag,
  CheckCircle, AlertCircle, Calculator
} from 'lucide-react'
import api from '@/lib/api'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import CodeBlock from '@/components/ui/CodeBlock'
import type { Model } from '@/types/model'

const orgColors: Record<string, string> = {
  'Anthropic': 'bg-orange-500',
  'OpenAI': 'bg-green-500',
  'Google DeepMind': 'bg-blue-500',
  'Meta AI': 'bg-blue-600',
  'Mistral AI': 'bg-orange-500',
  'DeepSeek': 'bg-indigo-500',
  'xAI': 'bg-gray-800',
  'Microsoft': 'bg-blue-600',
  'Cohere': 'bg-teal-700',
  'Sakana AI': 'bg-rose-500',
  'Nvidia': 'bg-green-600',
}

export default function ModelDetail() {
  const { modelId } = useParams()
  const [model, setModel] = useState<Model | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'benchmarks' | 'code' | 'setup'>('overview')
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    async function fetchModel() {
      try {
        const data = await api.getModel(modelId!)
        setModel(data)
      } catch (e) {
        console.error('Failed to fetch model:', e)
      } finally {
        setLoading(false)
      }
    }
    if (modelId) fetchModel()
  }, [modelId])

  if (loading) {
    return (
      <div className="space-y-4 pt-8">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-12 w-96" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="skeleton h-64" />
          <div className="skeleton h-64" />
        </div>
      </div>
    )
  }

  if (!model) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle size={48} className="text-surface-500 mb-4" />
        <h2 className="text-xl font-semibold text-surface-300">Model not found</h2>
        <Link to="/models" className="mt-4 text-cyan-glow hover:underline">Back to Model Tracker</Link>
      </div>
    )
  }

  const copyApiKey = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link to="/models" className="inline-flex items-center gap-2 text-surface-500 hover:text-cyan-glow transition-colors">
          <ArrowLeft size={16} />
          <span className="text-sm">Back to Model Tracker</span>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${orgColors[model.organization] || 'bg-surface-700'}`}>
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-surface-100">{model.name}</h1>
              <p className="text-surface-500">{model.organization} {model.version && `v${model.version}`}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setBookmarked(!bookmarked)} className={`p-2 rounded-lg transition-colors ${bookmarked ? 'bg-amber-500/20 text-amber-400' : 'glass-light text-surface-500 hover:text-surface-300'}`}>
              <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
            <Link to={`/compare?models=${model.id}`} className="glass-light p-2 text-surface-500 hover:text-surface-300 rounded-lg">
              <GitCompare size={18} />
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant={model.license === 'Open' ? 'success' : model.license === 'Closed' ? 'warning' : 'default'}>{model.license}</Badge>
          <Badge variant={model.status === 'Available' ? 'success' : model.status === 'Upcoming' ? 'info' : 'default'}>{model.status}</Badge>
          {model.toolUse === 'Yes' && <Badge variant="info">Tool Use</Badge>}
          {model.modalitiesInput?.includes('Vision') && <Badge variant="info">Vision</Badge>}
          {model.modalitiesInput?.includes('Audio') && <Badge variant="info">Audio</Badge>}
        </div>

        <p className="mt-4 text-surface-300 max-w-2xl">{model.description}</p>

        <div className="flex flex-wrap gap-3 mt-6">
          <Link to="/playground">
            <Button variant="primary">Try in Playground</Button>
          </Link>
          <Button variant="ghost" onClick={() => copyApiKey(`${model.name.toLowerCase().replace(/\s+/g, '-')}`)}>
            <Copy size={16} className="mr-2" />Copy API ID
          </Button>
          <Link to={`/compare?add=${model.id}`}>
            <Button variant="ghost"><GitCompare size={16} className="mr-2" />Add to Compare</Button>
          </Link>
        </div>
      </motion.div>

      <div className="mb-6 border-b border-surface-800">
        <nav className="flex gap-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'benchmarks', label: 'Benchmarks' },
            { id: 'code', label: 'Code Examples' },
            { id: 'setup', label: 'Local Setup' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-cyan-glow text-cyan-glow' 
                  : 'border-transparent text-surface-500 hover:text-surface-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-surface-200 mb-4 flex items-center gap-2">
              <Cpu size={18} className="text-cyan-glow" />
              Specifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <SpecRow label="Parameters" value={model.parameters || 'Undisclosed'} />
              <SpecRow label="Architecture" value={model.architecture || 'Transformer'} />
              <SpecRow label="Context Window" value={model.contextWindow?.toLocaleString() || '128K tokens'} />
              <SpecRow label="Max Output" value={model.maxOutputTokens?.toLocaleString() || '4,096 tokens'} />
              <SpecRow label="Training Cutoff" value={model.trainingCutoff || 'Unknown'} />
              <SpecRow label="Modalities (Input)" value={model.modalitiesInput?.join(', ') || 'Text'} />
              <SpecRow label="Modalities (Output)" value={model.modalitiesOutput?.join(', ') || 'Text'} />
              <SpecRow label="Languages" value={model.languagesSupported || '100+ languages'} />
              <SpecRow label="Tool Use" value={model.toolUse} />
              <SpecRow label="System Prompt" value={model.systemPrompt || 'Supported'} />
              <SpecRow label="Fine-tuning" value={model.fineTuning || 'Not available'} />
              <SpecRow label="License" value={model.license} />
              <SpecRow label="Release Date" value={model.releaseDate || 'Unknown'} />
              <SpecRow label="Organization" value={model.organization} />
              <SpecRow label="VRAM (BF16)" value={model.vramBF16 || 'Cloud only'} />
              <SpecRow label="VRAM (Q4)" value={model.vramQ4 || 'N/A'} />
              <SpecRow label="Self-Hostable" value={model.selfHostable ? 'Yes' : 'No'} />
              {model.apiEndpoint && <SpecRow label="API Endpoint" value={model.apiEndpoint} />}
              {(model as any).pricingInput !== undefined && (model as any).pricingInput > 0 && (
                <SpecRow label="Pricing (Input/Output)" value={`$${(model as any).pricingInput}/$${(model as any).pricingOutput} per 1M tokens`} />
              )}
              {(model as any).hfDownloads > 0 && (
                <div className="flex justify-between py-2 border-b border-surface-800/50">
                  <span className="text-surface-500 flex items-center gap-1"><Download size={14} />HF Downloads</span>
                  <span className="text-surface-200 font-medium">{(model as any).hfDownloads.toLocaleString()}</span>
                </div>
              )}
              {(model as any).hfLikes > 0 && (
                <div className="flex justify-between py-2 border-b border-surface-800/50">
                  <span className="text-surface-500 flex items-center gap-1"><Heart size={14} />HF Likes</span>
                  <span className="text-surface-200 font-medium">{(model as any).hfLikes.toLocaleString()}</span>
                </div>
              )}
              {(model as any).libraryName && (
                <SpecRow label="Library" value={(model as any).libraryName} />
              )}
              {(model as any).pipelineTag && (
                <SpecRow label="Pipeline" value={(model as any).pipelineTag} />
              )}
              {model.huggingfaceRepo && <SpecRow label="HuggingFace" value={model.huggingfaceRepo} />}
              {model.github && <SpecRow label="GitHub" value={model.github} />}
            </div>
          </Card>

          {(model as any).hfTags && (model as any).hfTags.length > 0 && (
            <Card className="mb-6">
              <h3 className="text-lg font-semibold text-surface-200 mb-4 flex items-center gap-2">
                <Tag size={18} className="text-cyan-glow" />
                Hugging Face Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {(model as any).hfTags.map((tag: string) => (
                  <Badge key={tag} variant="default" size="sm">{tag}</Badge>
                ))}
              </div>
            </Card>
          )}

          {model.strengths && model.strengths.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-surface-200 mb-4 flex items-center gap-2">
                <Zap size={18} className="text-cyan-glow" />
                What It's Best For
              </h3>
              <div className="flex flex-wrap gap-2">
                {model.strengths.map((strength: string) => (
                  <span key={strength} className="px-3 py-1.5 rounded-full bg-cyan-glow/10 text-cyan-glow text-sm">
                    {strength}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </motion.div>
      )}

      {activeTab === 'benchmarks' && model.benchmarkScores && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {model.benchmarkScores.slice(0, 8).map((score: any) => (
              <Card key={score.benchmarkId}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-surface-200">{score.benchmark?.name}</span>
                  <span className="text-lg font-bold text-cyan-glow">{score.score.toFixed(1)}</span>
                </div>
                <div className="mt-2 h-2 bg-surface-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-glow to-purple-glow rounded-full"
                    style={{ width: `${score.score}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'code' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold text-surface-200 mb-4">Python</h3>
            <CodeBlock 
              code={`from openai import OpenAI

client = OpenAI(api_key="your-api-key")
response = client.chat.completions.create(
  model="${model.name.toLowerCase().replace(/\s+/g, '-')}",
  messages=[{"role": "user", "content": "Hello!"}]
)
print(response.choices[0].message.content)`}
              language="python"
            />
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-surface-200 mb-4">JavaScript</h3>
            <CodeBlock 
              code={`import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: 'your-api-key' })
const response = await openai.chat.completions.create({
  model: "${model.name.toLowerCase().replace(/\s+/g, '-')}",
  messages: [{ role: 'user', content: 'Hello!' }]
})
console.log(response.choices[0].message.content)`}
              language="javascript"
            />
          </Card>
          <Card>
            <h3 className="text-lg font-semibold text-surface-200 mb-4">cURL</h3>
            <CodeBlock 
              code={`curl -X POST https://api.openai.com/v1/chat/completions \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "${model.name.toLowerCase().replace(/\s+/g, '-')}", "messages": [{"role": "user", "content": "Hello!"}]}'`}
              language="bash"
            />
          </Card>
        </motion.div>
      )}

      {activeTab === 'setup' && model.selfHostable && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <h3 className="text-lg font-semibold text-surface-200 mb-4 flex items-center gap-2">
              <Terminal size={18} className="text-cyan-glow" />
              Local Setup
            </h3>
            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-lg bg-surface-900">
                <p className="text-surface-400 mb-2">1. Install Ollama</p>
                <CodeBlock code={`# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh`} language="bash" />
              </div>
              <div className="p-4 rounded-lg bg-surface-900">
                <p className="text-surface-400 mb-2">2. Pull the model</p>
                <CodeBlock code={`ollama pull ${model.name.toLowerCase().replace(/\s+/g, '')}`} language="bash" />
              </div>
              <div className="p-4 rounded-lg bg-surface-900">
                <p className="text-surface-400 mb-2">3. Run the model</p>
                <CodeBlock code={`ollama run ${model.name.toLowerCase().replace(/\s+/g, '')}`} language="bash" />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {activeTab === 'setup' && !model.selfHostable && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <div className="flex items-center gap-3 text-surface-400">
              <AlertCircle size={24} />
              <div>
                <p className="font-medium text-surface-300">This model is not self-hostable</p>
                <p className="text-sm">Use the API to access this model.</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-surface-800/50">
      <span className="text-surface-500">{label}</span>
      <span className="text-surface-200 font-medium">{value}</span>
    </div>
  )
}