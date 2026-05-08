import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { classNames } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  onClose: () => void
  duration?: number
}

const typeStyles: Record<ToastType, { bg: string; icon: typeof CheckCircle; iconColor: string }> = {
  success: {
    bg: 'border-success/30 bg-success/10',
    icon: CheckCircle,
    iconColor: 'text-success',
  },
  error: {
    bg: 'border-danger/30 bg-danger/10',
    icon: XCircle,
    iconColor: 'text-danger',
  },
  warning: {
    bg: 'border-warning/30 bg-warning/10',
    icon: AlertTriangle,
    iconColor: 'text-warning',
  },
  info: {
    bg: 'border-info/30 bg-info/10',
    icon: Info,
    iconColor: 'text-info',
  },
}

export function Toast({
  message,
  type = 'info',
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const config = typeStyles[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={classNames(
        'pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm',
        config.bg,
        'bg-white/90 dark:bg-surface-900/90',
      )}
    >
      <Icon size={18} className={config.iconColor} />
      <p className="flex-1 text-sm font-medium text-surface-800 dark:text-surface-200">
        {message}
      </p>
      <button
        onClick={onClose}
        className="rounded-md p-1 text-surface-400 transition-colors hover:text-surface-600 dark:hover:text-surface-300"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}