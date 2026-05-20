import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface FilterBarProps {
  providers: Array<{ id: string; name: string; icon?: string }>
  categories: Array<{ id: string; name: string; icon?: string }>
  selectedProvider: string
  selectedCategory: string
  onProviderChange: (provider: string) => void
  onCategoryChange: (category: string) => void
  onClear: () => void
}

export default function FilterBar({
  providers,
  categories,
  selectedProvider,
  selectedCategory,
  onProviderChange,
  onCategoryChange,
  onClear,
}: FilterBarProps) {
  const hasActiveFilters = selectedProvider !== 'all' || selectedCategory !== 'all'

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
        <span className="text-xs text-surface-500 whitespace-nowrap">Providers:</span>
        
        <button
          onClick={() => onProviderChange('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            selectedProvider === 'all'
              ? 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/30'
              : 'glass text-surface-400 hover:text-surface-200 border border-transparent'
          }`}
        >
          All
        </button>
        
        {providers.map(provider => (
          <button
            key={provider.id}
            onClick={() => onProviderChange(provider.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedProvider === provider.id
                ? 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/30'
                : 'glass text-surface-400 hover:text-surface-200 border border-transparent'
            }`}
          >
            {provider.icon && <span>{provider.icon}</span>}
            {provider.name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
        <span className="text-xs text-surface-500 whitespace-nowrap">Categories:</span>
        
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === category.id
                ? 'bg-cyan-glow/20 text-cyan-glow border border-cyan-glow/30'
                : 'glass text-surface-400 hover:text-surface-200 border border-transparent'
            }`}
          >
            {category.icon && <span>{category.icon}</span>}
            {category.name}
          </button>
        ))}
      </div>

      {hasActiveFilters && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-surface-500 hover:text-red-400 transition-colors"
        >
          <X size={12} />
          Clear filters
        </motion.button>
      )}
    </div>
  )
}
