import React from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    ;(this as any).setState({ hasError: false, error: null })
  }

  render() {
    const hasError = (this as any).state?.hasError
    const error = (this as any).state?.error
    const children = (this as any).props?.children
    const fallback = (this as any).props?.fallback

    if (hasError) {
      if (fallback) {
        return fallback
      }

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl border border-surface-200 bg-white p-8 dark:border-surface-700 dark:bg-surface-900">
          <div className="rounded-full bg-danger/10 p-3 dark:bg-danger/20">
            <AlertTriangle size={32} className="text-danger" />
          </div>

          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Something went wrong
          </h2>

          <p className="max-w-md text-center text-sm text-surface-500 dark:text-surface-400">
            An unexpected error occurred while rendering this section.
            {error && (
              <span className="mt-2 block font-mono text-xs text-surface-400">
                {error.message}
              </span>
            )}
          </p>

          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-600"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        </div>
      )
    }

    return children
  }
}

export default ErrorBoundary