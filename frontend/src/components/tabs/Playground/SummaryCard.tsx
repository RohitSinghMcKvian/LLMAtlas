import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import MarkdownRenderer from './MarkdownRenderer'

interface SummaryCardProps {
  prompt: string
  responses: Array<{ modelId: string; modelName: string; provider: string; content: string }>
  onRegenerate: () => void
}

export default function SummaryCard({ prompt, responses, onRegenerate }: SummaryCardProps) {
  const [summary, setSummary] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(true)

  const generateSummary = async () => {
    setIsLoading(true)
    setError('')
    setSummary('')

    try {
      const result = await import('@/lib/api').then(mod =>
        mod.default.summarizeResponses(prompt, responses)
      )
      setSummary(result.summary)
    } catch (err: any) {
      setError(err.message || 'Failed to generate summary')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl border border-cyan-glow/20 overflow-hidden"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20">
            <Sparkles size={20} className="text-cyan-glow" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-surface-100">AI Summary</h3>
            <p className="text-xs text-surface-500">
              {responses.length} model{responses.length !== 1 ? 's' : ''} analyzed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {summary && (
            <button
              onClick={(e) => { e.stopPropagation(); onRegenerate() }}
              className="p-2 rounded-lg hover:bg-white/5 text-surface-400 hover:text-surface-200 transition-colors"
              title="Regenerate summary"
            >
              <RefreshCw size={16} />
            </button>
          )}
          {isExpanded ? <ChevronUp size={18} className="text-surface-500" /> : <ChevronDown size={18} className="text-surface-500" />}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-white/5">
          {isLoading ? (
            <div className="flex items-center gap-3 py-6">
              <Loader2 size={20} className="animate-spin text-cyan-glow" />
              <div>
                <p className="text-sm text-surface-300">Analyzing responses...</p>
                <p className="text-xs text-surface-500">Gemini 2.5 Flash is synthesizing insights</p>
              </div>
            </div>
          ) : error ? (
            <div className="py-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <span className="text-red-400">⚠️</span>
                <p className="text-sm text-red-300">{error}</p>
              </div>
              <button
                onClick={generateSummary}
                className="mt-3 px-4 py-2 rounded-lg bg-cyan-glow/10 text-cyan-glow text-sm hover:bg-cyan-glow/20 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : summary ? (
            <div className="py-4">
              <div className="prose prose-invert prose-sm max-w-none">
                <MarkdownRenderer content={summary} />
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-sm text-surface-400 mb-3">Get an AI-powered analysis of all model responses</p>
              <button
                onClick={generateSummary}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all active:scale-95"
              >
                Generate Summary
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
