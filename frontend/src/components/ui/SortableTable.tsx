import { useState, useMemo } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface Column<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => ReactNode;
}

interface SortableTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  defaultSortKey?: string;
  defaultSortDir?: "asc" | "desc";
  onRowClick?: (row: T) => void;
  className?: string;
}

type SortDirection = "asc" | "desc";

import type { ReactNode } from "react";

export default function SortableTable<T extends Record<string, unknown>>({
  columns,
  data,
  defaultSortKey,
  defaultSortDir = "asc",
  onRowClick,
  className = "",
}: SortableTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(
    defaultSortKey ?? null,
  );
  const [sortDir, setSortDir] = useState<SortDirection>(defaultSortDir);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      let cmp = 0;
      if (aVal < bVal) cmp = -1;
      else if (aVal > bVal) cmp = 1;
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  return (
    <div
      className={`w-full overflow-x-auto rounded-xl glass scrollbar-thin ${className}`}
    >
      <table className="w-full min-w-[500px] sm:min-w-[600px] table-auto text-sm">
        <thead>
          <tr className="border-b border-surface-800/50">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable !== false && handleSort(col.key)}
                className={`whitespace-nowrap px-3 sm:px-4 py-3 text-left font-semibold text-surface-500 ${
                  col.sortable !== false
                    ? "cursor-pointer select-none hover:text-surface-300"
                    : ""
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {sortKey === col.key &&
                    col.sortable !== false &&
                    (sortDir === "asc" ? (
                      <ArrowUp className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5" />
                    ))}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-surface-800/30 ${
                idx % 2 === 0
                  ? "bg-transparent"
                  : "bg-white/[0.01]"
              } ${onRowClick ? "cursor-pointer hover:bg-white/[0.03]" : ""}`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="whitespace-nowrap px-3 sm:px-4 py-3 text-surface-400"
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
          {sortedData.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-surface-500"
              >
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
