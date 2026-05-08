import { motion } from "framer-motion";

export interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "accent" | "success" | "warning";
}

const variantStyles: Record<NonNullable<ProgressBarProps["variant"]>, string> = {
  accent: "bg-gradient-to-r from-cyan-glow to-accent-500",
  success: "bg-success",
  warning: "bg-warning",
};

const sizeStyles: Record<NonNullable<ProgressBarProps["size"]>, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-3.5",
};

export default function ProgressBar({
  value,
  label,
  showValue = false,
  size = "md",
  variant = "accent",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label && (
            <span className="font-medium text-surface-500">
              {label}
            </span>
          )}
          {showValue && (
            <span className="tabular-nums text-surface-400">
              {Math.round(clamped)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-surface-800 ${sizeStyles[size]}`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${variantStyles[variant]}`}
        />
      </div>
    </div>
  );
}
