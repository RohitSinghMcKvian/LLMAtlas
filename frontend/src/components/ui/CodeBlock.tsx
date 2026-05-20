import { useState, useCallback } from "react"
import { Copy, Check } from "lucide-react"

export interface CodeBlockProps {
  code: string
  language?: string
  showLineNumbers?: boolean
  maxHeight?: number
  onCopy?: () => void
}

export default function CodeBlock({
  code,
  language = "",
  showLineNumbers = true,
  maxHeight = 400,
  onCopy,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), 2000)
    })
  }, [code, onCopy])

  const lines = code.split("\n")

  return (
    <div className="group relative rounded-xl glass overflow-hidden">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-surface-800/50">
        <span className="text-xs font-medium text-surface-500">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-surface-500 hover:bg-surface-800 hover:text-surface-300 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      <div
        className="overflow-auto scrollbar-thin bg-surface-950/50"
        style={{ maxHeight }}
      >
        <pre className="m-0 px-0 py-3 text-sm leading-relaxed">
          <code className="block font-mono text-surface-300 !whitespace-pre">
            {lines.map((line, i) => (
              <span key={i} className="table-row">
                {showLineNumbers && (
                  <span className="table-cell select-none px-3 pr-4 text-right text-surface-600 text-xs">
                    {i + 1}
                  </span>
                )}
                <span className="table-cell pr-4">{line}</span>
                {"\n"}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}
