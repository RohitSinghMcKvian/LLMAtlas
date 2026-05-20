import React from 'react'
import 'katex/dist/katex.min.css'
import { BlockMath, InlineMath } from 'react-katex'
import { motion } from 'framer-motion'

interface KaTeXRendererProps {
  key?: React.Key
  math: string
  inline?: boolean
}

export default function KaTeXRenderer({ math, inline = false }: KaTeXRendererProps) {
  if (inline) {
    return (
      <span className="inline-flex items-center mx-1">
        <InlineMath math={math} />
      </span>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="my-4 p-4 rounded-lg bg-surface-900/50 border border-white/10 overflow-x-auto"
    >
      <BlockMath math={math} />
    </motion.div>
  )
}
