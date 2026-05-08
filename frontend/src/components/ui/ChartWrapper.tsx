import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

export interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  height?: number;
  loading?: boolean;
  className?: string;
}

export default function ChartWrapper({
  title,
  subtitle,
  children,
  height = 320,
  loading = false,
  className = "",
}: ChartWrapperProps) {
  return (
    <div
      className={`rounded-xl glass p-4 sm:p-6 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-surface-100">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-sm text-surface-500">
            {subtitle}
          </p>
        )}
      </div>
      <div style={{ height }}>
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-surface-500" />
          </div>
        ) : (
          <div className="h-full w-full">{children}</div>
        )}
      </div>
    </div>
  );
}
