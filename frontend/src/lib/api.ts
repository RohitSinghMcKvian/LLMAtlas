import { models } from '@/data/models'
import { benchmarks } from '@/data/benchmarks'
import { newsItems } from '@/data/news'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

function parseJsonArray(val: any): any[] {
  if (Array.isArray(val)) return val
  if (typeof val === 'string') {
    try { return JSON.parse(val) } catch { return [] }
  }
  return []
}

function transformModel(m: any) {
  return {
    ...m,
    modalitiesInput: parseJsonArray(m.modalitiesInput),
    modalitiesOutput: parseJsonArray(m.modalitiesOutput),
    strengths: parseJsonArray(m.strengths),
    hfTags: parseJsonArray(m.hfTags),
    quantizationFormats: parseJsonArray(m.quantizationFormats),
    modalities: m.modalities || parseJsonArray(m.modalitiesInput) || [],
    vramRequired: m.vramBF16 || 'Cloud Only',
    releaseDate: m.releaseDate || new Date().toISOString().split('T')[0],
    links: {
      huggingface: m.huggingfaceRepo || null,
      github: m.github || null,
      paper: m.paper || null,
      docs: m.organizationLink || null,
      modelPage: m.apiEndpoint || null,
    },
  }
}

function transformNews(n: any) {
  return {
    ...n,
    tags: parseJsonArray(n.tags),
    date: n.publishedAt ? new Date(n.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    isBreaking: false,
  }
}

const api = {

  async register(email: string, password: string, name?: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, name })
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Registration failed' }))
      throw new Error(error.error || 'Registration failed')
    }
    return res.json()
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Login failed' }))
      throw new Error(error.error || 'Login failed')
    }
    return res.json()
  },

  async logout() {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      credentials: 'include'
    })
    if (!res.ok) throw new Error('Not authenticated')
    return res.json()
  },

  async getConversations(limit?: number, search?: string) {
    const params = new URLSearchParams()
    if (limit) params.set('limit', String(limit))
    if (search) params.set('search', search)
    const res = await fetch(`${API_BASE}/conversations?${params}`, {
      credentials: 'include'
    })
    if (!res.ok) throw new Error('Failed to fetch conversations')
    return res.json()
  },

  async getConversation(id: string) {
    const res = await fetch(`${API_BASE}/conversations/${id}`, {
      credentials: 'include'
    })
    if (!res.ok) throw new Error('Failed to fetch conversation')
    return res.json()
  },

  async createConversation(data: { title: string; models: string[]; messages: Array<{ role: string; content: string; modelId?: string }> }) {
    const res = await fetch(`${API_BASE}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to create conversation' }))
      throw new Error(error.error || 'Failed to create conversation')
    }
    return res.json()
  },

  async updateConversation(id: string, data: { title?: string; models?: string[]; messages?: Array<{ role: string; content: string; modelId?: string }> }) {
    const res = await fetch(`${API_BASE}/conversations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Failed to update conversation' }))
      throw new Error(error.error || 'Failed to update conversation')
    }
    return res.json()
  },

  async deleteConversation(id: string) {
    const res = await fetch(`${API_BASE}/conversations/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    })
    if (!res.ok) throw new Error('Failed to delete conversation')
    return res.json()
  },

  async getPlaygroundFreeModels() {
    try {
      const res = await fetch(`${API_BASE}/playground/free-models`)
      if (!res.ok) throw new Error('API failed')
      return await res.json()
    } catch {
      return []
    }
  },

  async getAllFreeModels() {
    try {
      const res = await fetch(`${API_BASE}/playground/all-free-models`)
      if (!res.ok) throw new Error('API failed')
      return await res.json()
    } catch {
      return []
    }
  },

  async getModelsByProvider(provider: string) {
    try {
      const res = await fetch(`${API_BASE}/playground/models/${provider}`)
      if (!res.ok) throw new Error('API failed')
      return await res.json()
    } catch {
      return []
    }
  },

  async getProviders() {
    try {
      const res = await fetch(`${API_BASE}/playground/providers`)
      if (!res.ok) throw new Error('API failed')
      return await res.json()
    } catch {
      return []
    }
  },

  async multiProviderChat(data: { model: string; messages: Array<{role: string; content: string}>; provider: string; temperature?: number; maxTokens?: number }) {
    const res = await fetch(`${API_BASE}/playground/chat/multi-provider`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || 'Chat request failed')
    }
    return res.json()
  },
  async playgroundChatStream(data: { model: string; messages: Array<{role: string; content: string}>; temperature?: number; topP?: number; maxTokens?: number; systemPrompt?: string; attachments?: Array<{name: string; type: string; base64: string}> }, onToken: (token: string, content: string) => void, onComplete: (usage: any) => void, signal?: AbortSignal) {
    const res = await fetch(`${API_BASE}/playground/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal
    })
    
    if (!res.ok) {
      if (res.status === 413) {
        throw new Error('File too large. Maximum total size is 50MB. Please use smaller files or fewer attachments.')
      }
      const error = await res.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || 'Chat request failed')
    }
    const reader = res.body?.getReader()
    if (!reader) throw new Error('Streaming not supported')
    const decoder = new TextDecoder()
    let buffer = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done || signal?.aborted) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(line.slice(6))
            if (parsed.error) {
              throw new Error(parsed.error)
            }
            if (parsed.done) {
              onComplete(parsed)
              return
            }
            if (parsed.token) {
              onToken(parsed.token, parsed.content)
            }
          } catch (e) {
            if (signal?.aborted) return
            continue
          }
        }
      }
    }
  },
  async createPlaygroundSession() {
    const res = await fetch(`${API_BASE}/playground/sessions`, { method: 'POST' })
    if (!res.ok) throw new Error('Failed to create session')
    return res.json()
  },
  async getPlaygroundSessionHistory(sessionId: string) {
    const res = await fetch(`${API_BASE}/playground/sessions/${sessionId}`)
    if (!res.ok) throw new Error('Failed to get session')
    return res.json()
  },
  async deletePlaygroundSession(sessionId: string) {
    const res = await fetch(`${API_BASE}/playground/sessions/${sessionId}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete session')
    return res.json()
  },
  async summarizeResponses(prompt: string, responses: Array<{ modelId: string; modelName: string; provider: string; content: string }>) {
    const res = await fetch(`${API_BASE}/playground/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, responses })
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || 'Failed to generate summary')
    }
    return res.json()
  },
  async getModels(params?: { license?: string; status?: string; org?: string; search?: string; sort?: string }) {
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString()
      const res = await fetch(`${API_BASE}/models${query ? `?${query}` : ''}`)
      if (!res.ok) throw new Error('API failed')
      const data = await res.json()
      return Array.isArray(data) ? data.map(transformModel) : []
    } catch {
      let result = [...models]
      if (params?.search) {
        const q = params.search.toLowerCase()
        result = result.filter(m => m.name.toLowerCase().includes(q) || m.organization.toLowerCase().includes(q))
      }
      return result
    }
  },

  async semanticSearch(query: string) {
    try {
      const res = await fetch(`${API_BASE}/semantic-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      if (!res.ok) {
        console.warn('Semantic search endpoint not available, falling back to basic search')
        return { models: [], criteria: null, totalMatches: 0 }
      }
      const data = await res.json()
      return {
        models: (data.models || []).map(transformModel),
        criteria: data.criteria,
        totalMatches: data.totalMatches,
      }
    } catch {
      return { models: [], criteria: null, totalMatches: 0 }
    }
  },

  async getModel(id: string) {
    try {
      const res = await fetch(`${API_BASE}/models/${id}`)
      if (!res.ok) throw new Error('API failed')
      return transformModel(await res.json())
    } catch {
      return models.find(m => m.id === id) || models[0]
    }
  },

  async getOrganizations() {
    try {
      const res = await fetch(`${API_BASE}/models/meta/organizations`)
      if (!res.ok) throw new Error('API failed')
      return await res.json()
    } catch {
      return [...new Set(models.map(m => m.organization))]
    }
  },

  async getBenchmarks(category?: string) {
    try {
      const query = category && category !== 'All' ? `?category=${category}` : ''
      const res = await fetch(`${API_BASE}/benchmarks${query}`)
      if (!res.ok) throw new Error('API failed')
      return await res.json()
    } catch {
      if (category && category !== 'All') return benchmarks.filter(b => b.category === category)
      return benchmarks
    }
  },

  async getBenchmark(id: string) {
    try {
      const res = await fetch(`${API_BASE}/benchmarks/${id}`)
      if (!res.ok) throw new Error('API failed')
      return await res.json()
    } catch {
      return benchmarks.find(b => b.id === id) || benchmarks[0]
    }
  },

  async getBenchmarkCategories() {
    try {
      const res = await fetch(`${API_BASE}/benchmarks/meta/categories`)
      if (!res.ok) throw new Error('API failed')
      return await res.json()
    } catch {
      return ['All', ...new Set(benchmarks.map(b => b.category))]
    }
  },

  async getNews(params?: { tag?: string; source?: string; from?: string; to?: string }) {
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString()
      const res = await fetch(`${API_BASE}/news${query ? `?${query}` : ''}`)
      if (!res.ok) throw new Error('API failed')
      const data = await res.json()
      return Array.isArray(data) ? data.map(transformNews) : []
    } catch {
      return [...newsItems]
    }
  },

  async getNewsTags() {
    try {
      const res = await fetch(`${API_BASE}/news/meta/tags`)
      if (!res.ok) throw new Error('API failed')
      return await res.json()
    } catch {
      return [...new Set(newsItems.flatMap(n => n.tags))]
    }
  },

  async triggerSync() {
    const res = await fetch(`${API_BASE}/sync/models`, { method: 'POST' })
    if (!res.ok) throw new Error('Sync failed')
    return res.json()
  },

  async getSyncStatus() {
    try {
      const res = await fetch(`${API_BASE}/sync/status`)
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  },

  async playgroundChat(data: { model: string; messages: Array<{role: string; content: string}>; temperature?: number; topP?: number; maxTokens?: number; systemPrompt?: string }) {
    const res = await fetch(`${API_BASE}/playground/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(error.error || 'Chat request failed')
    }
    return res.json()
  },

  async getPlaygroundModels() {
    try {
      const res = await fetch(`${API_BASE}/playground/models`)
      if (!res.ok) throw new Error('API failed')
      return await res.json()
    } catch {
      return []
    }
  },

  async compareModels(modelIds: string[], benchmarkIds?: string[]) {
    try {
      const res = await fetch(`${API_BASE}/comparison/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelIds, benchmarks: benchmarkIds })
      })
      if (!res.ok) throw new Error('Comparison failed')
      return await res.json()
    } catch {
      return { comparisons: [], scores: {} }
    }
  },

  async recommendModels(useCase: string, weights: Record<string, number>) {
    try {
      const res = await fetch(`${API_BASE}/comparison/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ useCase, weights })
      })
      if (!res.ok) throw new Error('Recommendation failed')
      return await res.json()
    } catch {
      return { recommendations: [] }
    }
  },

  async getLeaderboard(category?: string) {
    try {
      const query = category ? `?category=${category}` : ''
      const res = await fetch(`${API_BASE}/leaderboard${query}`)
      if (!res.ok) throw new Error('API failed')
      return await res.json()
    } catch {
      return { entries: [], source: 'static' }
    }
  },

  async getLeaderboardCategories() {
    try {
      const res = await fetch(`${API_BASE}/leaderboard/meta/categories`)
      if (!res.ok) throw new Error('API failed')
      return await res.json()
    } catch {
      return ['text', 'code', 'vision']
    }
  },

  async getLeaderboardOrganizations() {
    try {
      const res = await fetch(`${API_BASE}/leaderboard/meta/organizations`)
      if (!res.ok) throw new Error('API failed')
      return await res.json()
    } catch {
      return []
    }
  }
}

export default api
