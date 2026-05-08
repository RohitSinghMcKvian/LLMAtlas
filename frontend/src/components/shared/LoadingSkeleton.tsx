import { classNames } from '@/lib/utils'

type SkeletonVariant = 'text' | 'card' | 'chart' | 'table'

export interface LoadingSkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  variant?: SkeletonVariant
  count?: number
}

export function LoadingSkeleton({
  width,
  height,
  className,
  variant = 'text',
  count = 1,
}: LoadingSkeletonProps) {
  if (variant === 'text') {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={classNames('skeleton rounded-md', className)}
            style={{
              width: width ?? `${Math.max(40, 100 - i * 15)}%`,
              height: height ?? 16,
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-surface-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-900"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="skeleton h-10 w-10 rounded-full" />
              <div className="flex flex-col gap-2">
                <div className="skeleton h-4 w-24 rounded-md" />
                <div className="skeleton h-3 w-16 rounded-md" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="skeleton h-3 w-full rounded-md" />
              <div className="skeleton h-3 w-3/4 rounded-md" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="skeleton h-6 w-16 rounded-full" />
              <div className="skeleton h-6 w-12 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'chart') {
    return (
      <div
        className={classNames(
          'rounded-xl border border-surface-200 bg-white p-5 dark:border-surface-700 dark:bg-surface-900',
          className,
        )}
        style={{ width: width ?? '100%', height: height ?? 300 }}
      >
        <div className="mb-4 skeleton h-5 w-32 rounded-md" />
        <div className="flex h-[calc(100%-2rem)] items-end gap-3 px-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="skeleton flex-1 rounded-t-md"
              style={{
                height: `${30 + Math.random() * 70}%`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div
        className={classNames(
          'overflow-hidden rounded-xl border border-surface-200 dark:border-surface-700',
          className,
        )}
        style={{ width: width ?? '100%' }}
      >
        <div className="border-b border-surface-200 bg-surface-50 p-4 dark:border-surface-700 dark:bg-surface-800">
          <div className="skeleton h-5 w-1/3 rounded-md" />
        </div>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-surface-100 p-4 dark:border-surface-700"
          >
            <div className="skeleton h-8 w-8 rounded-full" />
            <div className="flex flex-1 gap-4">
              <div className="skeleton h-4 w-1/4 rounded-md" />
              <div className="skeleton h-4 w-1/4 rounded-md" />
              <div className="skeleton h-4 w-1/4 rounded-md" />
              <div className="skeleton h-4 w-1/6 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return <div className={classNames('skeleton rounded-md', className)} style={{ width, height }} />
}

export default LoadingSkeleton