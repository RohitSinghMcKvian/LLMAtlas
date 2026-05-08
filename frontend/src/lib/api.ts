import { models } from '@/data/models'
import { benchmarks } from '@/data/benchmarks'
import { newsItems } from '@/data/news'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const useApi = !!import.meta.env.VITE_API_URL

const api = {
  // Models
  async getModels(params?: { license?: string; status?: string; org?: string; search?: string; sort?: string }) {
    if (!useApi) {
      let result = [...models]
      if (params?.search) {
        const q = params.search.toLowerCase()
        result = result.filter(m => m.name.toLowerCase().includes(q) || m.organization.toLowerCase().includes(q))
      }
      return result
    }
    const query = new URLSearchParams(params as Record<string, string>).toString()
    const res = await fetch(`${API_BASE}/models${query ? `?${query}` : ''}`)
    if (!res.ok) return models
    return res.json()
  },

  async getModel(id: string) {
    if (!useApi) return models.find(m => m.id === id) || models[0]
    const res = await fetch(`${API_BASE}/models/${id}`)
    if (!res.ok) return models[0]
    return res.json()
  },

  async getOrganizations() {
    if (!useApi) return [...new Set(models.map(m => m.organization))]
    const res = await fetch(`${API_BASE}/models/meta/organizations`)
    if (!res.ok) return [...new Set(models.map(m => m.organization))]
    return res.json()
  },

  // Benchmarks
  async getBenchmarks(category?: string) {
    if (!useApi) {
      if (category && category !== 'All') return benchmarks.filter(b => b.category === category)
      return benchmarks
    }
    const query = category && category !== 'All' ? `?category=${category}` : ''
    const res = await fetch(`${API_BASE}/benchmarks${query}`)
    if (!res.ok) return benchmarks
    return res.json()
  },

  async getBenchmark(id: string) {
    if (!useApi) return benchmarks.find(b => b.id === id) || benchmarks[0]
    const res = await fetch(`${API_BASE}/benchmarks/${id}`)
    if (!res.ok) return benchmarks[0]
    return res.json()
  },

  async getBenchmarkCategories() {
    if (!useApi) return ['All', ...new Set(benchmarks.map(b => b.category))]
    const res = await fetch(`${API_BASE}/benchmarks/meta/categories`)
    if (!res.ok) return ['All', ...new Set(benchmarks.map(b => b.category))]
    return res.json()
  },

  // News
  async getNews(params?: { tag?: string; source?: string; from?: string; to?: string }) {
    if (!useApi) {
      let result = [...newsItems]
      return result
    }
    const query = new URLSearchParams(params as Record<string, string>).toString()
    const res = await fetch(`${API_BASE}/news${query ? `?${query}` : ''}`)
    if (!res.ok) return newsItems
    return res.json()
  },

  async getNewsTags() {
    if (!useApi) return [...new Set(newsItems.flatMap(n => n.tags))]
    const res = await fetch(`${API_BASE}/news/meta/tags`)
    if (!res.ok) return [...new Set(newsItems.flatMap(n => n.tags))]
    return res.json()
  },

  // Comparison - returns empty for static mode
  async compareModels(modelIds: string[], benchmarkIds?: string[]) {
    return { comparisons: [], scores: {} }
  },

  async recommendModels(useCase: string, weights: Record<string, number>) {
    return { recommendations: [] }
  }
}

export default api