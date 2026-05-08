export const ORG_COLORS: Record<string, string> = {
  // Anthropic
  'Anthropic': '#d4521a',
  // OpenAI
  'OpenAI': '#10a37f',
  // Google DeepMind
  'Google DeepMind': '#4285F4',
  // Meta AI
  'Meta AI': '#0866FF',
  // Mistral AI
  'Mistral AI': '#FF7000',
  // DeepSeek
  'DeepSeek': '#4D6BFE',
  // xAI
  'xAI': '#1a1a1a',
  // Microsoft
  'Microsoft': '#0078D4',
  // Cohere
  'Cohere': '#39594D',
  // Sakana AI
  'Sakana AI': '#FF6B6B',
  // Nvidia
  'Nvidia': '#76B900',
  // Amazon
  'Amazon': '#FF9900',
  // IBM
  'IBM': '#0530AD',
  // Apple
  'Apple': '#555555',
  // Stanford
  'Stanford': '#B31F18',
  // UC Berkeley
  'Berkeley': '#003262',
  // Default
  'default': '#6b7280',
}

export const ORG_COLOR_VARIANTS: Record<string, string[]> = {
  'Anthropic': ['#d4521a', '#e67e22', '#f39c12'],
  'OpenAI': ['#10a37f', '#2ecc71', '#27ae60'],
  'Google DeepMind': ['#4285F4', '#5c9aff', '#7ab3ff'],
  'Meta AI': ['#0866FF', '#3b82f6', '#60a5fa'],
  'Mistral AI': ['#FF7000', '#ff8c42', '#ffab70'],
  'DeepSeek': ['#4D6BFE', '#6366f1', '#818cf8'],
  'xAI': ['#1a1a1a', '#333333', '#4d4d4d'],
  'Microsoft': ['#0078D4', '#3b82f6', '#60a5fa'],
  'Cohere': ['#39594D', '#4b6b5c', '#5d7d6e'],
  'Sakana AI': ['#FF6B6B', '#ff8585', '#ffa0a0'],
  'Nvidia': ['#76B900', '#93c749', '#b0d779'],
  'Amazon': ['#FF9900', '#ffb347', '#ffc770'],
  'IBM': ['#0530AD', '#1e40af', '#3b82f6'],
  'Apple': ['#555555', '#71717a', '#8b8b96'],
  'Stanford': ['#B31F18', '#d94e50', '#f27273'],
  'Berkeley': ['#003262', '#1e4d7b', '#3d6a94'],
}

export function getOrgColor(org: string): string {
  return ORG_COLORS[org] || ORG_COLORS['default']
}

export function getOrgColorVariant(org: string, variant: 0 | 1 | 2 = 0): string {
  const variants = ORG_COLOR_VARIANTS[org] || ['#6b7280', '#9ca3af', '#d1d5db']
  return variants[variant]
}

export const LICENSE_COLORS: Record<string, { bg: string, text: string }> = {
  'Open': { bg: '#dcfce7', text: '#166534' },
  'Closed': { bg: '#f5f3ff', text: '#6d28d9' },
  'Gated': { bg: '#fffbeb', text: '#b45309' },
}

export const STATUS_COLORS: Record<string, { bg: string, text: string }> = {
  'Available': { bg: '#dcfce7', text: '#166534' },
  'Upcoming': { bg: '#e0f2fe', text: '#0369a1' },
  'Beta': { bg: '#fef3c7', text: '#b45309' },
  'Deprecated': { bg: '#f3f4f6', text: '#4b5563' },
}

export type {  }