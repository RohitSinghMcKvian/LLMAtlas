import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, Table } from 'lucide-react'
import ErrorBoundary from './ErrorBoundary'

interface DataChartProps {
  headers: string[]
  rows: string[][]
}

const COLORS = ['#06b6d4', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#14b8a6']

type ChartType = 'bar' | 'line' | 'pie' | 'table'

export default function DataChart({ headers, rows }: DataChartProps) {
  const [chartType, setChartType] = useState<ChartType>('bar')

  const chartData = rows.map(row => {
    const obj: Record<string, string | number> = { name: row[0] || '' }
    for (let i = 1; i < headers.length; i++) {
      const value = row[i]
      obj[headers[i]] = isNaN(Number(value)) ? value : Number(value)
    }
    return obj
  })

  const numericColumns = headers.slice(1).filter(h => 
    rows.some(row => !isNaN(Number(row[headers.indexOf(h)])))
  )

  const chartTypes: Array<{ type: ChartType; icon: typeof BarChart3; label: string }> = [
    { type: 'bar', icon: BarChart3, label: 'Bar Chart' },
    { type: 'line', icon: LineChartIcon, label: 'Line Chart' },
    { type: 'pie', icon: PieChartIcon, label: 'Pie Chart' },
    { type: 'table', icon: Table, label: 'Table' }
  ]

  const renderChart = () => {
    if (chartType === 'table') {
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                {headers.map((header, i) => (
                  <th key={i} className="px-3 py-2 text-left font-semibold text-surface-200 border-b border-white/10 bg-white/5">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-white/5 transition-colors">
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-3 py-2 text-surface-300 border-b border-white/5">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    if (chartType === 'pie' && numericColumns.length > 0) {
      const pieData = chartData.map((item, idx) => ({
        name: item.name,
        value: Number(item[numericColumns[0]]) || 0
      }))

      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )
    }

    const ChartComponent = chartType === 'line' ? LineChart : BarChart

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#0f172a', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px'
            }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Legend wrapperStyle={{ color: '#94a3b8' }} />
          {numericColumns.slice(0, 3).map((col, idx) => {
            if (chartType === 'line') {
              return (
                <Line
                  key={col}
                  type="monotone"
                  dataKey={col}
                  stroke={COLORS[idx % COLORS.length]}
                />
              )
            }
            return (
              <Bar
                key={col}
                type="monotone"
                dataKey={col}
                fill={COLORS[idx % COLORS.length]}
              />
            )
          })}
        </ChartComponent>
      </ResponsiveContainer>
    )
  }

  return (
    <ErrorBoundary>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="my-4 rounded-lg bg-surface-900/50 border border-white/10 overflow-hidden"
      >
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            {chartTypes.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  chartType === type
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-surface-400 hover:bg-white/5 hover:text-surface-200'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4">
          {renderChart()}
        </div>
      </motion.div>
    </ErrorBoundary>
  )
}
