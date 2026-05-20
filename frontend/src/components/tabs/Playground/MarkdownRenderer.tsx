import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check } from 'lucide-react'
import { useState, useCallback, useMemo } from 'react'
import MermaidChart from './MermaidChart'
import DataChart from './DataChart'
import KaTeXRenderer from './KaTeXRenderer'

interface MarkdownRendererProps {
  content: string
  isStreaming?: boolean
}

interface PreprocessedContent {
  text: string
  tables: Array<{ headers: string[]; rows: string[][] }>
  mermaidBlocks: string[]
}

function preprocessContent(content: string): PreprocessedContent {
  let processed = content
  const tables: Array<{ headers: string[]; rows: string[][] }> = []
  const mermaidBlocks: string[] = []
  
  // Step 1: Extract mermaid code blocks first (before any other processing)
  let mermaidIndex = 0
  processed = processed.replace(/```mermaid\s*\n([\s\S]*?)```/g, (match, code) => {
    const trimmedCode = code.trim()
    if (trimmedCode) {
      mermaidBlocks.push(trimmedCode)
      const placeholder = `MERMAID_BLOCK_${mermaidIndex}`
      mermaidIndex++
      return placeholder
    }
    return match
  })
  
  // Step 2: Extract tables with numeric data
  const tableRegex = /\|(.+)\|\n\|[-\s|:]+\|\n((?:\|.+\|\n?)*)/g
  let match
  let tableIndex = 0
  
  while ((match = tableRegex.exec(processed)) !== null) {
    const headers = match[1].split('|').map(h => h.trim()).filter(Boolean)
    const rows = match[2].trim().split('\n').map(row => 
      row.split('|').map(cell => cell.trim()).filter(Boolean)
    )
    
    const hasNumericData = rows.some(row => 
      row.slice(1).some(cell => !isNaN(Number(cell.replace(/[,%$]/g, ''))))
    )
    
    if (headers.length >= 2 && rows.length >= 2 && hasNumericData) {
      const placeholder = `TABLE_BLOCK_${tableIndex}`
      processed = processed.replace(match[0], placeholder)
      tables.push({ headers, rows })
      tableIndex++
    }
  }
  
  // Step 3: Extract math expressions
  processed = processed.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
    return `\nKATEX_BLOCK_${math.trim()}_END_KATEX_BLOCK\n`
  })
  
  processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
    return `KATEX_INLINE_${math.trim()}_END_KATEX_INLINE`
  })
  
  return { text: processed, tables, mermaidBlocks }
}

export default function MarkdownRenderer({ content, isStreaming = false }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const { text: processedContent, tables, mermaidBlocks } = useMemo(
    () => preprocessContent(content),
    [content]
  )

  const handleCopyCode = useCallback(async (code: string, index: number) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(`${index}`)
    setTimeout(() => setCopiedCode(null), 2000)
  }, [])

  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '')
          const codeStr = String(children).replace(/\n$/, '')
          const codeIndex = codeStr.length % 1000
          
          if (!inline && match) {
            return (
              <div className="relative group my-4">
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => handleCopyCode(codeStr, codeIndex)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-surface-400 hover:text-surface-200"
                  >
                    {copiedCode === `${codeIndex}` ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus as any}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-lg !my-0 !bg-surface-900/50"
                  {...props}
                >
                  {codeStr}
                </SyntaxHighlighter>
              </div>
            )
          }
          
          return (
            <code className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-glow text-sm" {...props}>
              {children}
            </code>
          )
        },
        p({ children }) {
          const textContent = typeof children === 'string' ? children : String(children)
          
          // Check for Mermaid blocks
          const mermaidMatch = textContent.match(/MERMAID_BLOCK_(\d+)/)
          if (mermaidMatch) {
            const mermaidIdx = parseInt(mermaidMatch[1])
            const mermaidCode = mermaidBlocks[mermaidIdx]
            if (mermaidCode) {
              return <MermaidChart code={mermaidCode} />
            }
          }
          
          // Check for KaTeX blocks
          if (textContent.includes('KATEX_BLOCK_')) {
            const match = textContent.match(/KATEX_BLOCK_(.*?)_END_KATEX_BLOCK/)
            if (match) {
              return <KaTeXRenderer math={match[1]} inline={false} />
            }
          }
          
          // Check for KaTeX inline
          if (textContent.includes('KATEX_INLINE_')) {
            const parts = textContent.split(/KATEX_INLINE_(.*?)_END_KATEX_INLINE/)
            return (
              <p className="text-surface-300 my-2 leading-relaxed">
                {parts.map((part, idx) => {
                  if (idx % 2 === 1) {
                    return <KaTeXRenderer key={idx} math={part} inline={true} />
                  }
                  return <span key={idx}>{part}</span>
                })}
              </p>
            )
          }
          
          // Check for table blocks
          const tableMatch = textContent.match(/TABLE_BLOCK_(\d+)/)
          if (tableMatch) {
            const tableIdx = parseInt(tableMatch[1])
            const tableData = tables[tableIdx]
            if (tableData) {
              return <DataChart headers={tableData.headers} rows={tableData.rows} />
            }
          }
          
          return <p className="text-surface-300 my-2 leading-relaxed">{children}</p>
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-4">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          )
        },
        h1: ({ children }) => <h1 className="text-xl font-bold text-surface-100 mt-6 mb-3">{children}</h1>,
        h2: ({ children }) => <h2 className="text-lg font-bold text-surface-100 mt-5 mb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-base font-semibold text-surface-100 mt-4 mb-2">{children}</h3>,
        ul: ({ children }) => <ul className="list-disc list-inside text-surface-300 my-2 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside text-surface-300 my-2 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-surface-300">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-cyan-glow/30 pl-4 my-3 text-surface-400 italic">
            {children}
          </blockquote>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 text-left font-semibold text-surface-200 border-b border-white/10 bg-white/5">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 text-surface-300 border-b border-white/5">{children}</td>
        ),
        a: ({ children, href }) => (
          <a href={href} className="text-cyan-glow hover:underline" target="_blank" rel="noopener noreferrer">
            {children} ↗
          </a>
        ),
        strong: ({ children }) => <strong className="font-semibold text-surface-100">{children}</strong>,
        em: ({ children }) => <em className="text-surface-200 italic">{children}</em>,
        hr: () => <hr className="border-white/10 my-4" />,
      }}
    >
      {processedContent}
    </ReactMarkdown>
  )
}
