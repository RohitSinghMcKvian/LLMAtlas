import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, RotateCcw, ThumbsUp, ThumbsDown, Loader2, Square, Volume2, VolumeX } from 'lucide-react'
import MarkdownRenderer from './MarkdownRenderer'
import AudioVisualizer from './AudioVisualizer'
import useTextToSpeech from '@/hooks/useTextToSpeech'
import ErrorBoundary from './ErrorBoundary'

interface ResponseCardProps {
  modelId: string
  modelName: string
  provider: string
  content: string
  isStreaming: boolean
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
  error?: string
  onCopy: () => void
  onRegenerate: () => void
  onStop?: () => void
}

const providerColors: Record<string, string> = {
  google: 'border-blue-500',
  meta: 'border-cyan-500',
  openai: 'border-gray-500',
  deepseek: 'border-purple-500',
  mistral: 'border-orange-500',
  microsoft: 'border-green-500',
  alibaba: 'border-red-500',
  nvidia: 'border-emerald-500',
  groq: 'border-yellow-500',
  cerebras: 'border-pink-500',
  cloudflare: 'border-indigo-500',
  github: 'border-gray-400',
}

const providerIcons: Record<string, string> = {
  google: '🔵',
  meta: '🟦',
  openai: '⚫',
  deepseek: '🟣',
  mistral: '🟠',
  microsoft: '🟢',
  alibaba: '🔴',
  nvidia: '💚',
  groq: '⚡',
  cerebras: '🔷',
  cloudflare: '☁️',
  github: '🐙',
}

export default function ResponseCard({
  modelId,
  modelName,
  provider,
  content,
  isStreaming,
  usage,
  error,
  onCopy,
  onRegenerate,
  onStop,
}: ResponseCardProps) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)
  const { isSpeaking, speak, stop } = useTextToSpeech()

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    onCopy()
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSpeak = () => {
    if (isSpeaking) {
      stop()
    } else if (content) {
      speak(content)
    }
  }

  const borderColor = providerColors[provider] || 'border-surface-700'
  const icon = providerIcons[provider] || '🤖'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout="position"
      className={`glass rounded-xl border-l-4 ${borderColor} overflow-hidden`}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-surface-100 text-sm">{modelName}</h3>
            <span className="text-xs text-surface-500 capitalize">{provider}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {isStreaming && onStop && (
            <button
              onClick={onStop}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium transition-colors"
              title="Stop generating"
            >
              <Square size={12} className="fill-current" />
              Stop
            </button>
          )}
          {isStreaming && !onStop && (
            <Loader2 size={16} className="animate-spin text-cyan-glow" />
          )}
          {!isStreaming && content && !error && (
            <div className="flex items-center gap-2">
              {isSpeaking && <AudioVisualizer isActive={isSpeaking} mode="output" className="mr-1" />}
              <button
                onClick={handleSpeak}
                className={`p-2 rounded-lg transition-colors ${
                  isSpeaking
                    ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                    : 'hover:bg-white/5 text-surface-400 hover:text-surface-200'
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Listen to response'}
              >
                {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>
          )}
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-white/5 text-surface-400 hover:text-surface-200 transition-colors"
            title="Copy response"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
          </button>
          {!isStreaming && content && !error && (
            <button
              onClick={onRegenerate}
              className="p-2 rounded-lg hover:bg-white/5 text-surface-400 hover:text-surface-200 transition-colors"
              title="Regenerate"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 min-h-[100px] max-h-[400px] overflow-y-auto scrollbar-thin">
        {error ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <span className="text-red-400">⚠️</span>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        ) : content ? (
          <ErrorBoundary>
            <div className="prose prose-invert prose-sm max-w-none">
              <MarkdownRenderer content={content} isStreaming={isStreaming} />
            </div>
          </ErrorBoundary>
        ) : isStreaming ? (
          <div className="flex items-center gap-2 text-surface-500">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-glow animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-cyan-glow animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-cyan-glow animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-sm">Generating response...</span>
          </div>
        ) : (
          <p className="text-sm text-surface-600">Waiting for response...</p>
        )}
      </div>

      {(usage || feedback) && (
        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-surface-500">
            {usage && (
              <span className="flex items-center gap-1">
                 {usage.total_tokens.toLocaleString()} tokens
              </span>
            )}
          </div>
          
          {!isStreaming && content && !error && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-surface-600">Helpful?</span>
              <button
                onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                className={`p-1.5 rounded-lg transition-colors ${
                  feedback === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/5 text-surface-500'
                }`}
              >
                <ThumbsUp size={14} />
              </button>
              <button
                onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                className={`p-1.5 rounded-lg transition-colors ${
                  feedback === 'down' ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/5 text-surface-500'
                }`}
              >
                <ThumbsDown size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
