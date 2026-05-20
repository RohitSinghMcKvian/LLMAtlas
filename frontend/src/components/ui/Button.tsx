import type { ButtonHTMLAttributes, ReactNode } from "react"
import { Loader2 } from "lucide-react"

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children?: ReactNode
  key?: string | number
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  type?: "button" | "submit" | "reset"
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-accent-600 to-accent-500 text-white shadow-md shadow-accent-500/15 hover:shadow-lg hover:shadow-accent-500/25 hover:from-accent-500 hover:to-accent-400 active:scale-[0.97]",
  secondary:
    "bg-surface-700/60 text-surface-200 border border-surface-600/50 hover:bg-surface-600/60 active:scale-[0.97]",
  ghost:
    "text-surface-400 hover:text-surface-200 hover:bg-white/[0.04] active:scale-[0.97]",
  danger:
    "bg-red-500/90 text-white shadow-md shadow-red-500/20 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/25 active:scale-[0.97]",
}

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2",
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  type = "button",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-950 disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading && (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
      )}
      {children}
    </button>
  )
}
