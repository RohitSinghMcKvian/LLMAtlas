import { useState, useCallback, useMemo } from 'react'
import Fuse from 'fuse.js'

export function useSearch<T>(
  items: T[],
  keys: { name: string; weight: number }[],
) {
  const [query, setQuery] = useState('')

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys,
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 2,
      }),
    [items, keys],
  )

  const results = useMemo(() => {
    if (!query.trim()) return items
    return fuse.search(query).map((r) => r.item)
  }, [fuse, query, items])

  const setSearchQuery = useCallback((q: string) => {
    setQuery(q)
  }, [])

  return { query, setSearchQuery, results, resultsCount: results.length }
}