import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, RotateCcw, Search } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface Filter {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}

export interface FilterBarProps {
  filters: Filter[];
  onReset: () => void;
  className?: string;
  key?: string | number;
}

export default function FilterBar({
  filters,
  onReset,
  className = "",
}: FilterBarProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-2 sm:gap-3 ${className}`}
    >
      {filters.map((filter) => (
        <FilterDropdown key={filter.label} filter={filter} />
      ))}
      {(filters.some((f) => f.selected.length > 0)) && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-surface-500 hover:bg-surface-800 hover:text-surface-300 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Clear All
        </button>
      )}
    </div>
  );
}

function FilterDropdown({ filter, key: _key }: { filter: Filter; key?: string | number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value: string) => {
    const next = filter.selected.includes(value)
      ? filter.selected.filter((v) => v !== value)
      : [...filter.selected, value];
    filter.onChange(next);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
          filter.selected.length > 0
            ? "glass border-cyan-glow/20 text-cyan-glow"
            : "glass text-surface-400 hover:text-surface-200 hover:bg-white/[0.03]"
        }`}
      >
        <Search className="h-3.5 w-3.5" />
        {filter.label}
        {filter.selected.length > 0 && (
          <span className="ml-1 rounded-full bg-cyan-glow/20 px-1.5 py-0.5 text-xs text-cyan-glow">
            {filter.selected.length}
          </span>
        )}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-48 rounded-lg glass-strong shadow-xl">
          <div className="max-h-48 overflow-y-auto p-1 scrollbar-thin">
            {filter.options.map((opt) => {
              const isSelected = filter.selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleOption(opt.value)}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-sm transition-colors ${
                    isSelected
                      ? "bg-cyan-glow/10 text-cyan-glow"
                      : "text-surface-400 hover:bg-white/[0.03] hover:text-surface-200"
                  }`}
                >
                  <span className="flex-1 text-left">{opt.label}</span>
                  {isSelected && (
                    <span className="ml-2 h-2 w-2 rounded-full bg-cyan-glow" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {filter.selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {filter.selected.map((val) => (
            <span
              key={val}
              className="inline-flex items-center gap-1 rounded-full bg-surface-800 px-2.5 py-1 text-xs font-medium text-surface-400"
            >
              {filter.options.find((o) => o.value === val)?.label ?? val}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(val);
                }}
                className="ml-0.5 rounded-full p-0.5 hover:bg-surface-700 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
