import { motion } from 'framer-motion'
import { Construction, Sparkles, Cpu } from 'lucide-react'
import Card from '../ui/Card'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface ComingSoonProps {
  title?: string
  description?: string
  pageName?: string
}

export default function ComingSoon({
  title = 'Coming Soon',
  description = 'This section is under active development. Stay tuned for cutting-edge updates.',
  pageName = 'this page',
}: ComingSoonProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 })

  const gradientColors = [
    'from-cyan-500 to-blue-500',
    'from-purple-500 to-pink-500',
    'from-rose-500 to-orange-500',
    'from-emerald-500 to-cyan-500',
  ]
  const randomColor = gradientColors[Math.floor(Math.random() * gradientColors.length)]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="flex items-center justify-center min-h-[60vh] px-4 py-12"
    >
      <Card className="max-w-lg w-full text-center p-6 sm:p-10 space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isVisible ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
          className="mx-auto relative"
        >
          <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${randomColor} flex items-center justify-center mx-auto shadow-lg`}>
            <Construction size={36} className="text-white" />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1 -right-1 w-6 h-6"
          >
            <Sparkles size={16} className="text-cyan-glow" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-1 -left-1 w-6 h-6"
          >
            <Cpu size={16} className="text-purple-glow" />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold gradient-text"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-sm sm:text-base text-surface-400 leading-relaxed"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="pt-2"
        >
          <div className="flex items-center justify-center gap-3 text-xs text-surface-500">
            <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulse" />
            Under construction
            <span className="w-2 h-2 rounded-full bg-purple-glow animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-surface-600">
            <span className="px-3 py-1.5 rounded-full glass-light">React 19</span>
            <span className="px-3 py-1.5 rounded-full glass-light">Framer Motion</span>
            <span className="px-3 py-1.5 rounded-full glass-light">Tailwind CSS</span>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  )
}
