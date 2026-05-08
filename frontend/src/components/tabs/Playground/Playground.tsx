import { useState, useRef, useEffect } from 'react'
import { Play, Copy, Check, Key, AlertCircle, Image } from 'lucide-react'
import { models } from '@/data/models'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

const PROVIDERS = [
  { id: 'openai', name: 'OpenAI', placeholder: 'sk-...' },
  { id: 'anthropic', name: 'Anthropic', placeholder: 'sk-ant-...' },
  { id: 'google', name: 'Google', placeholder: 'AIza...' },
  { id: 'groq', name: 'Groq', placeholder: 'gsk_...' },
]

export default function Playground() {
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [prompt, setPrompt] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [temperature, setTemperature] = useState(0.7)
  const [topP, setTopP] = useState(0.9)
  const [maxTokens, setMaxTokens] = useState(512)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [apiKeys, setApiKeys] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('contextwindow-apikeys')
    return saved ? JSON.parse(saved) : {}
  })
  const promptRef = useRef<HTMLTextAreaElement>(null)

  const availableModels = models.filter(m => m.apiAvailable)

  const toggleModel = (modelId: string) => {
    setSelectedModels(prev => prev.includes(modelId) ? prev.filter(id => id !== modelId) : [...prev, modelId])
    setImageError(null)
  }

  const handlePasteImage = async () => {
    if (selectedModels.length === 0) {
      setImageError(`Please select a model first`)
      setTimeout(() => setImageError(null), 2000)
      return
    }
    
    const model = models.find(m => selectedModels.includes(m.id))
    if (!model) return
    
    if (!model.modalities.includes('Vision')) {
      setImageError(`${model.name} does not support image input`)
      setTimeout(() => setImageError(null), 3000)
      return
    }
    
    try {
      const items = await navigator.clipboard.read()
      let hasImage = false
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            hasImage = true
            break
          }
        }
      }
      
      if (hasImage) {
        setImageError(`Image pasted! (Mock - API integration pending)`)
        setTimeout(() => setImageError(null), 3000)
      } else {
        setImageError(`No image found in clipboard`)
        setTimeout(() => setImageError(null), 2000)
      }
    } catch (err) {
      setImageError(`Could not access clipboard. Allow clipboard access or paste an image first.`)
      setTimeout(() => setImageError(null), 4000)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim() || selectedModels.length === 0) return
    setIsGenerating(true)
    setTimeout(() => {
      const newResponses: Record<string, string> = {}
      selectedModels.forEach(modelId => {
        const model = models.find(m => m.id === modelId)
        if (model) {
          if (prompt.toLowerCase().includes('code') || prompt.toLowerCase().includes('python')) {
            newResponses[modelId] = `Here's a sample response for ${model.name}:\n\n${prompt}\n\nThis is a mock response showing how the model would respond.`
          } else if (prompt.toLowerCase().includes('explain') || prompt.toLowerCase().includes('what is')) {
            newResponses[modelId] = `I can explain that. ${model.name} would provide a detailed explanation.`
          } else {
            newResponses[modelId] = `This is a mock response from ${model.name} to: "${prompt}".\n\nThe model would provide a detailed response here.`
          }
        }
      })
      setResponses(newResponses)
      setIsGenerating(false)
    }, 1000)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    localStorage.setItem('contextwindow-apikeys', JSON.stringify(apiKeys))
  }, [apiKeys])

  const updateApiKey = (provider: string, key: string) => {
    setApiKeys({ ...apiKeys, [provider]: key })
  }

  return (
    <div>
      <Modal isOpen={showApiKeys} onClose={() => setShowApiKeys(false)} title="API Keys" size="md">
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
            <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200">Your API keys are stored locally and never sent to servers.</p>
          </div>
          {PROVIDERS.map(provider => (
            <div key={provider.id}>
              <label className="block text-sm font-medium text-surface-100 mb-1">{provider.name}</label>
              <input
                type="password"
                value={apiKeys[provider.id] || ''}
                onChange={e => updateApiKey(provider.id, e.target.value)}
                placeholder={provider.placeholder}
                className="w-full rounded-lg glass-input py-2 px-3 text-sm"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setShowApiKeys(false)}>Close</Button>
          </div>
        </div>
      </Modal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-surface-100">Model Playground</h2>
              <button onClick={() => setShowApiKeys(true)} className="p-2 rounded-lg glass hover:bg-surface-800">
                <Key size={18} className="text-surface-400" />
              </button>
            </div>
            <p className="text-surface-500 mb-4 text-sm">Compare multiple models side-by-side</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-100 mb-2">Select Models</label>
                <div className="grid grid-cols-2 gap-2 max-h-[240px] overflow-y-auto">
                  {availableModels.map(model => (
                    <button key={model.id} onClick={() => toggleModel(model.id)}
                      className={`p-2 rounded-lg text-sm transition-all ${selectedModels.includes(model.id) ? 'bg-cyan-glow/12 text-cyan-glow border border-cyan-glow/20' : 'glass text-surface-400 hover:text-surface-200'}`}>
                      {model.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-100 mb-2">System Prompt</label>
                <textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)}
                  placeholder="You are a helpful assistant..." className="w-full rounded-lg glass-input p-3 text-sm" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-surface-100 mb-1">Temperature: {temperature}</label>
                  <input type="range" min="0" max="2" step="0.1" value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-cyan-glow" />
                </div>
                <div>
                  <label className="block text-xs text-surface-100 mb-1">Top-p: {topP}</label>
                  <input type="range" min="0" max="1" step="0.1" value={topP} onChange={e => setTopP(parseFloat(e.target.value))}
                    className="w-full accent-cyan-glow" />
                </div>
                <div>
                  <label className="block text-xs text-surface-100 mb-1">Max Tokens: {maxTokens}</label>
                  <input type="range" min="1" max="2048" value={maxTokens} onChange={e => setMaxTokens(parseInt(e.target.value))}
                    className="w-full accent-cyan-glow" />
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-surface-100">Prompt</h2>
              <div className="flex items-center gap-2">
                <Button onClick={handlePasteImage} size="sm" variant="ghost" disabled={selectedModels.length === 0}>
                  <Image size={16} />Paste Image
                </Button>
                <Button onClick={handleGenerate} disabled={isGenerating} size="sm">
                  <Play size={16} />{isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </div>
            {imageError && (
              <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <p className="text-sm text-red-300">{imageError}</p>
              </div>
            )}
            <textarea ref={promptRef} value={prompt} onChange={e => setPrompt(e.target.value)}
              placeholder="Enter your prompt..." className="w-full rounded-lg glass-input p-3 text-sm" rows={6} />
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedModels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedModels.map(modelId => {
                const model = models.find(m => m.id === modelId)
                const response = responses[modelId] || ''
                return (
                  <Card key={modelId} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-surface-100">{model?.name}</h3>
                      <Button onClick={() => handleCopy(response)} size="sm" variant="ghost">
                        <Copy size={16} />{copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <div className="glass rounded-lg p-3 min-h-[100px]">
                      <pre className="whitespace-pre-wrap text-sm text-surface-300">{response || 'No response yet...'}</pre>
                    </div>
                    <div className="mt-2 text-xs text-surface-500 flex items-center gap-3">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" />1.2s</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-glow" />128 tokens</span>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <p className="text-surface-500 mb-2">Select models and enter a prompt</p>
                <p className="text-xs text-surface-600">Choose from the panel on the left</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}