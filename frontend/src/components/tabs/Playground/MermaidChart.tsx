import { useEffect, useRef, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Loader2, AlertTriangle, Download } from 'lucide-react'
import mermaid from 'mermaid'
import ErrorBoundary from './ErrorBoundary'

interface MermaidChartProps {
  code: string
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif',
  fontSize: 14,
  themeCSS: `
    .node rect, .node circle, .node polygon, .node path {
      fill: #1e293b !important;
      stroke: #06b6d4 !important;
      stroke-width: 2px !important;
    }
    .edgeLabel {
      background-color: #0f172a !important;
      color: #e2e8f0 !important;
    }
    .cluster rect {
      fill: #1e293b !important;
      stroke: #475569 !important;
    }
  `
})

function validateMermaidSyntax(code: string): { valid: boolean; error?: string } {
  const trimmed = code.trim()
  
  if (!trimmed) {
    return { valid: false, error: 'Empty diagram code' }
  }
  
  const validTypes = /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|stateDiagram-v2|pie|gantt|journey|erDiagram|requirementDiagram|gitGraph|mindmap|timeline|sankey|xychart)/
  if (!validTypes.test(trimmed)) {
    return { valid: false, error: `Invalid mermaid syntax. Expected diagram type (graph, flowchart, sequenceDiagram, etc.)` }
  }
  
  const openBrackets = (trimmed.match(/\[/g) || []).length
  const closeBrackets = (trimmed.match(/\]/g) || []).length
  if (openBrackets !== closeBrackets) {
    return { valid: false, error: `Mismatched brackets: ${openBrackets} opening, ${closeBrackets} closing` }
  }
  
  const openParens = (trimmed.match(/\(/g) || []).length
  const closeParens = (trimmed.match(/\)/g) || []).length
  if (openParens !== closeParens) {
    return { valid: false, error: `Mismatched parentheses: ${openParens} opening, ${closeParens} closing` }
  }
  
  const openBraces = (trimmed.match(/\{/g) || []).length
  const closeBraces = (trimmed.match(/\}/g) || []).length
  if (openBraces !== closeBraces) {
    return { valid: false, error: `Mismatched braces: ${openBraces} opening, ${closeBraces} closing` }
  }
  
  return { valid: true }
}

const renderedCodes = new Set<string>()

export default function MermaidChart({ code }: MermaidChartProps) {
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const codeHash = useMemo(() => {
    let hash = 0
    for (let i = 0; i < code.length; i++) {
      const char = code.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash.toString()
  }, [code])

  useEffect(() => {
    const renderChart = async () => {
      setIsLoading(true)
      setError('')
      
      const validation = validateMermaidSyntax(code)
      if (!validation.valid) {
        setError(validation.error || 'Invalid diagram syntax')
        setIsLoading(false)
        return
      }
      
      if (renderedCodes.has(codeHash)) {
        setIsLoading(false)
        return
      }
      
      try {
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        const { svg: renderedSvg } = await mermaid.render(id, code.trim())
        setSvg(renderedSvg)
        renderedCodes.add(codeHash)
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to render diagram'
        
        if (errorMessage.includes('Parse error')) {
          setError('Diagram syntax error. Please check your mermaid code.')
        } else if (errorMessage.includes('No diagram type')) {
          setError('No diagram type detected. Start with "graph TD" or "flowchart LR".')
        } else {
          setError('Failed to render diagram. Check syntax and try again.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    renderChart()
  }, [code, codeHash])

  const handleDownload = () => {
    if (!svg) return
    
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'diagram.svg'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 my-4 rounded-lg bg-surface-900/50 border border-white/10">
        <Loader2 size={24} className="animate-spin text-cyan-glow" />
        <span className="ml-3 text-sm text-surface-400">Rendering diagram...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 p-4 my-4 rounded-lg bg-red-500/10 border border-red-500/20">
        <AlertTriangle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-red-300 font-medium">Diagram rendering failed</p>
          <p className="text-xs text-red-400/70 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative my-4 rounded-lg bg-surface-900/50 border border-white/10 overflow-hidden group"
      >
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-surface-400 hover:text-surface-200 transition-colors"
            title="Download SVG"
          >
            <Download size={14} />
          </button>
        </div>
        
        <div
          ref={containerRef}
          className="p-4 overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </motion.div>
    </ErrorBoundary>
  )
}
