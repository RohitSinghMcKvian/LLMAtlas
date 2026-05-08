const API_BASE = 'http://localhost:3001/api'

export const api = {
  // Models
  async getModels(params?: { license?: string; status?: string; org?: string; search?: string; sort?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    const res = await fetch(`${API_BASE}/models${query ? `?${query}` : ''}`)
    if (!res.ok) throw new Error('Failed to fetch models')
    return res.json()
  },

  async getModel(id: string) {
    const res = await fetch(`${API_BASE}/models/${id}`)
    if (!res.ok) throw new Error('Failed to fetch model')
    return res.json()
  },

  async getOrganizations() {
    const res = await fetch(`${API_BASE}/models/meta/organizations`)
    if (!res.ok) throw new Error('Failed to fetch organizations')
    return res.json()
  },

  // Benchmarks
  async getBenchmarks(category?: string) {
    const query = category && category !== 'All' ? `?category=${category}` : ''
    const res = await fetch(`${API_BASE}/benchmarks${query}`)
    if (!res.ok) throw new Error('Failed to fetch benchmarks')
    return res.json()
  },

  async getBenchmark(id: string) {
    const res = await fetch(`${API_BASE}/benchmarks/${id}`)
    if (!res.ok) throw new Error('Failed to fetch benchmark')
    return res.json()
  },

  async getBenchmarkCategories() {
    const res = await fetch(`${API_BASE}/benchmarks/meta/categories`)
    if (!res.ok) throw new Error('Failed to fetch categories')
    return res.json()
  },

  // News
  async getNews(params?: { tag?: string; source?: string; from?: string; to?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    const res = await fetch(`${API_BASE}/news${query ? `?${query}` : ''}`)
    if (!res.ok) throw new Error('Failed to fetch news')
    return res.json()
  },

  async getNewsTags() {
    const res = await fetch(`${API_BASE}/news/meta/tags`)
    if (!res.ok) throw new Error('Failed to fetch tags')
    return res.json()
  },

  // Comparison
  async compareModels(modelIds: string[], benchmarkIds?: string[]) {
    const res = await fetch(`${API_BASE}/comparison/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelIds, benchmarks: benchmarkIds })
    })
    if (!res.ok) throw new Error('Failed to compare models')
    return res.json()
  },

  async recommendModels(useCase: string, weights: Record<string, number>) {
    const res = await fetch(`${API_BASE}/comparison/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ useCase, weights })
    })
    if (!res.ok) throw new Error('Failed to get recommendations')
    return res.json()
  }
}

export default api