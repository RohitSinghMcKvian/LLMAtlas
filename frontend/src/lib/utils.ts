export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return formatDate(dateStr)
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getScoreColor(score: number, maxScore: number = 100): string {
  const pct = score / maxScore
  if (pct >= 0.9) return 'text-emerald-500'
  if (pct >= 0.75) return 'text-blue-500'
  if (pct >= 0.6) return 'text-yellow-500'
  if (pct >= 0.4) return 'text-orange-500'
  return 'text-red-500'
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Available':
      return 'bg-emerald-500'
    case 'Beta':
      return 'bg-blue-500'
    case 'Research Preview':
      return 'bg-purple-500'
    case 'Announced':
      return 'bg-amber-500'
    default:
      return 'bg-gray-500'
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export function getRandomId(): string {
  return Math.random().toString(36).substring(2, 11)
}