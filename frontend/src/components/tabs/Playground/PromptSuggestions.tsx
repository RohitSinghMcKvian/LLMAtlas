import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '@/lib/api'

interface PromptSuggestion {
  icon: string
  title: string
  prompt: string
  gradient: string
}

const suggestions: PromptSuggestion[] = [
  { icon: '💡', title: 'Explain a concept', prompt: 'Explain quantum computing in simple terms', gradient: 'from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20' },
  { icon: '', title: 'Write code', prompt: 'Write a Python function to implement merge sort with comments', gradient: 'from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20' },
  { icon: '📝', title: 'Summarize text', prompt: 'Summarize the key benefits of renewable energy in 3 bullet points', gradient: 'from-green-500/10 to-emerald-500/10 hover:from-green-500/20 hover:to-emerald-500/20' },
  { icon: '', title: 'Creative writing', prompt: 'Write a short story about a robot learning to paint', gradient: 'from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20' },
  { icon: '🔍', title: 'Analyze & compare', prompt: 'Compare the pros and cons of remote work vs office work', gradient: 'from-indigo-500/10 to-violet-500/10 hover:from-indigo-500/20 hover:to-violet-500/20' },
  { icon: '🌐', title: 'Translate', prompt: 'Translate this to French: "Hello, how are you today? I hope you are doing well."', gradient: 'from-teal-500/10 to-cyan-500/10 hover:from-teal-500/20 hover:to-cyan-500/20' },
]

interface PromptSuggestionsProps {
  onSelect: (prompt: string) => void
}

function ContinuousTypingText({ lines, className }: { lines: string[]; className?: string }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isPaused) return

    if (currentLineIndex < lines.length) {
      const currentLineText = lines[currentLineIndex]
      
      if (currentCharIndex < currentLineText.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayedText(prev => {
            const lines = prev.split('\n')
            const currentLine = lines[currentLineIndex] || ''
            const newChar = currentLineText[currentCharIndex]
            lines[currentLineIndex] = currentLine + newChar
            return lines.join('\n')
          })
          setCurrentCharIndex(prev => prev + 1)
        }, 35)
      } else if (currentLineIndex < lines.length - 1) {
        timeoutRef.current = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1)
          setCurrentCharIndex(0)
        }, 200)
      } else {
        setIsTyping(false)
        setIsPaused(true)
        timeoutRef.current = setTimeout(() => {
          setDisplayedText('')
          setCurrentLineIndex(0)
          setCurrentCharIndex(0)
          setIsTyping(true)
          setIsPaused(false)
        }, 5000)
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [currentCharIndex, currentLineIndex, lines, isPaused])

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={className}
    >
      {displayedText.split('\n').map((line, i) => (
        <span key={i}>
          {line}
          {i === currentLineIndex && isTyping && !isPaused && (
            <span className="inline-block w-0.5 h-4 bg-cyan-glow ml-0.5 animate-pulse" />
          )}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
      {!isTyping && !isPaused && (
        <span className="inline-block w-0.5 h-4 bg-cyan-glow ml-0.5 animate-pulse" />
      )}
    </motion.p>
  )
}

export default function PromptSuggestions({ onSelect }: PromptSuggestionsProps) {
  const [modelCount, setModelCount] = useState<number | null>(null)
  const [providerCount, setProviderCount] = useState<number | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const models = await api.getAllFreeModels()
        setModelCount(models.length)
        const providers = new Set(models.map(m => m.provider).filter(Boolean))
        setProviderCount(providers.size)
      } catch {
        setModelCount(38)
        setProviderCount(7)
      }
    }
    loadStats()
  }, [])

  const sloganLines = [
    "Compare free Open Source AI models side-by-side",
    "Select multiple models and see how they respond to the same prompt"
  ]

  return (
    <motion.div
      id="suggestions"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-full py-2 px-4 sm:px-6"
    >
      <div className="text-center mb-4 sm:mb-6">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 mb-3 sm:mb-4"
        >
          <span className="text-base sm:text-lg">✨</span>
          <span className="text-xs sm:text-sm font-medium text-surface-200">
            {modelCount !== null ? `${modelCount} Free Models` : 'Loading...'} • {providerCount !== null ? `${providerCount} Providers` : ''}
          </span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold gradient-text mb-2 sm:mb-3"
        >
          Research Using Open Source Models
        </motion.h2>
        
        <ContinuousTypingText
          lines={sloganLines}
          className="text-surface-400 text-sm sm:text-base max-w-md mx-auto min-h-[1.5rem] sm:min-h-[2rem]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-3xl w-full">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={suggestion.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            onClick={() => onSelect(suggestion.prompt)}
            className={`group relative p-3 sm:p-4 md:p-5 rounded-xl bg-gradient-to-br ${suggestion.gradient} border border-white/5 text-left transition-all duration-300 hover:border-white/10 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/10`}
          >
            <div className="flex items-start gap-3 sm:gap-4">
              <span className="text-xl sm:text-2xl">{suggestion.icon}</span>
              <div>
                <h3 className="font-semibold text-surface-100 mb-1 text-sm sm:text-base group-hover:text-cyan-glow transition-colors">
                  {suggestion.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-surface-500 line-clamp-2">
                  {suggestion.prompt}
                </p>
              </div>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-0.5 text-[10px] sm:text-xs text-surface-600 hidden sm:block"
      >
        Or type your own prompt below to get started
      </motion.p>
    </motion.div>
  )
}
