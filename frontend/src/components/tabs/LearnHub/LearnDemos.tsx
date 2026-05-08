import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, ChevronDown, ChevronRight, Type, Sparkles, BarChart2, X, CheckCircle } from 'lucide-react'
import { lessons } from '@/data/lessons'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

const SAMPLE_WORDS = ['king', 'queen', 'man', 'woman', 'apple', 'orange', 'paris', 'france', 'berlin', 'germany']
const WORD_CLUSTERS: Record<string, number[]> = {
  'royalty': [0, 1], 'gender': [2, 3], 'fruit': [4, 5], 'european_cities': [6, 7, 8, 9]
}

function TokenizerDemo() {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog')
  const [tokens, setTokens] = useState<string[]>([])
  
  useEffect(() => {
    const words = text.split(/\s+/).filter(Boolean)
    setTokens(words.map(w => `${w.toLowerCase()}:${Math.floor(Math.random() * 1000)}`))
  }, [text])

  return (
    <Card>
      <h4 className="text-sm font-semibold text-surface-100 mb-3 flex items-center gap-2">
        <Type size={16} className="text-cyan-glow" />
        Interactive Tokenizer Demo
      </h4>
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type something..."
        className="w-full rounded-lg glass-input py-2 px-3 text-sm mb-3"
      />
      <p className="text-xs text-surface-500 mb-2">Tokens (simulated): {tokens.length}</p>
      <div className="flex flex-wrap gap-2">
        {tokens.map((token, i) => (
          <span key={i} className="px-2 py-1 rounded bg-surface-800 text-xs text-cyan-glow">
            {token}
          </span>
        ))}
      </div>
    </Card>
  )
}

function TemperatureDemo() {
  const [prompt, setPrompt] = useState('The sky is')
  const [temp, setTemp] = useState(0.7)
  
  const outputs: Record<number, string[]> = {
    0: ['blue', 'blue', 'blue'],
    0.7: ['blue', 'azure', 'clear'],
    1.5: ['blue', 'endless', 'infinite'],
    2: ['bluehope', 'blueeternity', 'forever']
  }
  
  return (
    <Card>
      <h4 className="text-sm font-semibold text-surface-100 mb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-cyan-glow" />
        Temperature Effect
      </h4>
      <input
        type="text"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="Prompt..."
        className="w-full rounded-lg glass-input py-2 px-3 text-sm mb-3"
      />
      <label className="text-xs text-surface-500 mb-2 block">Temperature: {temp}</label>
      <input
        type="range"
        min="0"
        max="2"
        step="0.1"
        value={temp}
        onChange={e => setTemp(parseFloat(e.target.value))}
        className="w-full accent-cyan-glow mb-3"
      />
      <div className="glass rounded-lg p-3">
        <p className="text-xs text-surface-500 mb-2">Sample outputs at T={temp}:</p>
        <div className="space-y-1">
          {(outputs[temp as keyof typeof outputs] || outputs[0]).map((out, i) => (
            <p key={i} className="text-sm text-surface-300">"{prompt} {out}"</p>
          ))}
        </div>
      </div>
    </Card>
  )
}

function EmbeddingVisualizer() {
  const [hovered, setHovered] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = 300
    canvas.height = 200
    ctx.clearRect(0, 0, 300, 200)
    
    const getPos = (idx: number): [number, number] => {
      const baseX = 50 + (idx % 5) * 50
      const baseY = 50 + Math.floor(idx / 5) * 50
      return [baseX + Math.random() * 20 - 10, baseY + Math.random() * 20 - 10]
    }
    
    Object.entries(WORD_CLUSTERS).forEach(([cluster, indices], ci) => {
      const colors = ['#00e5ff', '#fb7185', '#10b981', '#f59e0b']
      ctx.fillStyle = colors[ci % colors.length]
      
      indices.forEach((idx, i) => {
        const [x, y] = getPos(idx)
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.fillStyle = '#fff'
        ctx.font = '10px sans-serif'
        ctx.fillText(SAMPLE_WORDS[idx], x - 15, y + 3)
        ctx.fillStyle = colors[ci % colors.length]
      })
    })
  }, [])

  return (
    <Card>
      <h4 className="text-sm font-semibold text-surface-100 mb-3 flex items-center gap-2">
        <BarChart2 size={16} className="text-cyan-glow" />
        Word Embedding 2D Projection
      </h4>
      <canvas
        ref={canvasRef}
        className="w-full h-[200px] rounded-lg"
        style={{ background: '#0d1117' }}
      />
      <p className="text-xs text-surface-500 mt-2">
        Hover over dots to see words. Similar words cluster together.
      </p>
    </Card>
  )
}

export { TokenizerDemo, TemperatureDemo, EmbeddingVisualizer }