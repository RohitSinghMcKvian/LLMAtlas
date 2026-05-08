import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { debounce } from '@/lib/utils'

interface SearchResult {
  id: string
  title: string
  subtitle?: string
  category: string
  url: string
}

interface SearchBarProps {
  placeholder?: string
}

export function SearchBar({ placeholder = 'Search models, benchmarks, guides...' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const performSearch = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) {
        setResults([])
        setIsOpen(false)
        return
      }
      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(term)}`,
        )
        if (response.ok) {
          const data = (await response.json()) as SearchResult[]
          setResults(data.slice(0, 8))
          setIsOpen(true)
        }
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [],
  )

  const handleChange = (value: string): void => {
    setQuery(value)
    performSearch(value)
  }

  const handleClear = (): void => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-surface-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
          placeholder={placeholder}
          className="w-full rounded-lg border border-surface-200 bg-surface-50 py-2 pl-10 pr-16 text-sm text-surface-900 placeholder-surface-400 transition-all focus:border-accent-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:placeholder-surface-500 dark:focus:border-accent-400 dark:focus:bg-surface-800"
          aria-label="Search"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
        />
        <div className="absolute right-2 flex items-center gap-1">
          {query && (
            <button
              onClick={handleClear}
              className="rounded p-1 text-surface-400 transition-colors hover:text-surface-600 dark:hover:text-surface-300"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <kbd className="hidden rounded border border-surface-200 px-1.5 py-0.5 text-[10px] font-medium text-surface-400 dark:border-surface-600 sm:inline-block">
            {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}K
          </kbd>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-1 origin-top overflow-hidden rounded-lg border border-surface-200 bg-white shadow-lg dark:border-surface-700 dark:bg-surface-900"
          >
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-surface-300 border-t-accent-500" />
              </div>
            ) : results.length > 0 ? (
              <ul className="max-h-80 overflow-y-auto scrollbar-thin" role="listbox">
                {results.map((result) => (
                  <li key={result.id} role="option" aria-selected={false}>
                    <a
                      href={result.url}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-50 dark:hover:bg-surface-800"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-900 truncate dark:text-surface-100">
                          {result.title}
                        </p>
                        {result.subtitle && (
                          <p className="text-xs text-surface-500 truncate dark:text-surface-400">
                            {result.subtitle}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 rounded-full bg-surface-100 px-2 py-0.5 text-[10px] font-medium text-surface-500 dark:bg-surface-800 dark:text-surface-400">
                        {result.category}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}

            {!isLoading && results.length === 0 && query.trim() && (
              <div className="p-4 text-center text-sm text-surface-500 dark:text-surface-400">
                No results found for &quot;{query}&quot;
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}