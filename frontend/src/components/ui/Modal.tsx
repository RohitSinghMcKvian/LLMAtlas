import type { ReactNode } from "react"
import { useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children?: ReactNode
  key?: string | number
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeStyles: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.15 } },
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, handleEscape])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative z-10 w-full ${sizeStyles[size]} glass-strong rounded-xl shadow-2xl`}
          >
            <div className="flex items-center justify-between border-b border-surface-800 px-4 sm:px-6 py-4">
              <h2 className="text-lg font-semibold text-surface-100 truncate pr-4">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-surface-500 hover:bg-surface-800 hover:text-surface-300 transition-colors shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-4 sm:px-6 py-4 max-h-[70vh] overflow-y-auto scrollbar-thin">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
