import type { MouseEventHandler, ReactNode } from "react"
import { motion } from "framer-motion"

export interface CardProps {
  children?: ReactNode
  key?: string | number
  className?: string
  onClick?: MouseEventHandler<HTMLDivElement>
  hoverable?: boolean
}

export default function Card({
  children,
  className = "",
  onClick,
  hoverable = false,
}: CardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverable ? { y: -3 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-xl glass p-4 sm:p-6 ${hoverable ? "cursor-pointer card-glow" : ""} ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </motion.div>
  )
}
