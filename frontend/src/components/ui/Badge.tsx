import type { MouseEventHandler, ReactNode } from "react";

export interface BadgeProps {
  children?: ReactNode;
  key?: string | number;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple";
  size?: "sm" | "md";
  className?: string;
  onClick?: MouseEventHandler<HTMLSpanElement>;
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "bg-surface-700/50 text-surface-300 border border-surface-600/50",
  success:
    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  warning:
    "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  danger:
    "bg-red-500/10 text-red-400 border border-red-500/20",
  info:
    "bg-cyan-glow/8 text-cyan-glow border border-cyan-glow/15",
  purple:
    "bg-purple-glow/8 text-purple-glow border border-purple-glow/15",
};

const sizeStyles: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "px-1.5 py-0.5 text-[11px] leading-tight",
  md: "px-2.5 py-1 text-sm",
};

export default function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
  onClick,
}: BadgeProps) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      onClick={onClick}
      className={`inline-flex items-center rounded-full font-medium transition-all ${variantStyles[variant]} ${sizeStyles[size]} ${onClick ? "cursor-pointer hover:opacity-80" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
