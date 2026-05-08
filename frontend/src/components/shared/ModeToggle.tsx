import { motion } from 'framer-motion'
import { classNames } from '@/lib/utils'

interface ModeToggleProps {
  isSimpleMode: boolean
  onToggle: () => void
}

export function ModeToggle({ isSimpleMode, onToggle }: ModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="relative flex h-8 w-36 items-center rounded-full bg-surface-200 p-0.5 dark:bg-surface-700"
      aria-label={`Switch to ${isSimpleMode ? 'expert' : 'simple'} mode`}
      role="switch"
      aria-checked={isSimpleMode}
    >
      <motion.div
        layout
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="absolute h-7 w-[68px] rounded-full bg-white shadow-sm dark:bg-accent-600"
        style={{
          left: isSimpleMode ? 2 : undefined,
          right: isSimpleMode ? undefined : 2,
        }}
      />

      <span
        className={classNames(
          'relative z-10 flex-1 text-center text-xs font-medium transition-colors',
          isSimpleMode
            ? 'text-surface-700 dark:text-white'
            : 'text-surface-500 dark:text-surface-400',
        )}
      >
        Simple
      </span>
      <span
        className={classNames(
          'relative z-10 flex-1 text-center text-xs font-medium transition-colors',
          !isSimpleMode
            ? 'text-surface-700 dark:text-white'
            : 'text-surface-500 dark:text-surface-400',
        )}
      >
        Expert
      </span>
    </button>
  )
}