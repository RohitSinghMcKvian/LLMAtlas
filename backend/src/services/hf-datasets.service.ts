import axios from 'axios'

const HF_API_BASE = 'https://huggingface.co/api'

export interface HFBenchmarkScore {
  modelId: string
  benchmarkId: string
  score: number
  source: string
  evalDate: string
}

export interface HFModelResult {
  model_name: string
  model_id: string
  results: Record<string, any>
}

const BENCHMARK_ID_MAP: Record<string, string> = {
  'mmlu': 'mmlu',
  'mmlu_pro': 'mmlu-pro',
  'arc_challenge': 'arc-challenge',
  'hellaswag': 'hellaswag',
  'winogrande': 'winogrande',
  'truthfulqa_mc2': 'truthfulqa',
  'gsm8k': 'gsm8k',
  'math': 'math',
  'humaneval': 'humaneval',
  'mbpp': 'mbpp',
}

export async function fetchHFLeaderboardResults(): Promise<HFModelResult[]> {
  try {
    const response = await axios.get(`${HF_API_BASE}/datasets/open-llm-leaderboard/details_open_llm_leaderboard_llmleaderboard`, {
      params: {
        sort: 'downloads',
        direction: -1,
        limit: 100,
      },
      timeout: 15000
    })
    return response.data || []
  } catch (error) {
    console.error('Error fetching HF leaderboard results:', error)
    return []
  }
}

export async function fetchHFModelDetails(modelId: string): Promise<any> {
  try {
    const response = await axios.get(`${HF_API_BASE}/models/${modelId}`, {
      params: { full: 'true' },
      timeout: 10000
    })
    return response.data || null
  } catch (error) {
    console.error(`Error fetching HF model ${modelId}:`, error)
    return null
  }
}

export function parseHFBenchmarkScores(results: HFModelResult[]): HFBenchmarkScore[] {
  const scores: HFBenchmarkScore[] = []

  for (const result of results) {
    for (const [rawKey, value] of Object.entries(result.results || {})) {
      const benchmarkId = BENCHMARK_ID_MAP[rawKey] || rawKey
      const score = typeof value === 'number' ? value : (value as any)?.score || (value as any)?.accuracy || null
      
      if (score !== null && typeof score === 'number') {
        scores.push({
          modelId: result.model_id || result.model_name,
          benchmarkId,
          score: Math.round(score * 100) / 100,
          source: 'HuggingFace Open LLM Leaderboard',
          evalDate: new Date().toISOString().split('T')[0],
        })
      }
    }
  }

  return scores
}

export function normalizeHFModelName(modelName: string): string {
  return modelName
    .replace(/\/[^/]+$/, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function hfModelNameToInternalId(modelName: string): string {
  const lower = modelName.toLowerCase()
  
  const mappings = [
    { pattern: /llama-3\.3-70b/i, id: 'llama-3-3-70b' },
    { pattern: /llama-3\.1-405b/i, id: 'llama-3-1-405b' },
    { pattern: /llama-3\.1-70b/i, id: 'llama-3-1-70b' },
    { pattern: /llama-3\.1-8b/i, id: 'llama-3-1-8b' },
    { pattern: /llama-3-70b/i, id: 'llama-3-70b' },
    { pattern: /llama-3-8b/i, id: 'llama-3-8b' },
    { pattern: /qwen2\.5-72b/i, id: 'qwen-2-5-72b' },
    { pattern: /qwen2\.5-32b/i, id: 'qwen-2-5-32b' },
    { pattern: /gemma-2-27b/i, id: 'gemma-2-27b' },
    { pattern: /gemma-2-9b/i, id: 'gemma-2-9b' },
    { pattern: /mistral-large/i, id: 'mistral-large' },
    { pattern: /mistral-small/i, id: 'mistral-small' },
    { pattern: /deepseek-v3/i, id: 'deepseek-v3' },
    { pattern: /deepseek-r1/i, id: 'deepseek-r1' },
    { pattern: /phi-4/i, id: 'phi-4' },
    { pattern: /phi-3/i, id: 'phi-3' },
  ]

  for (const { pattern, id } of mappings) {
    if (pattern.test(lower)) return id
  }

  return lower.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}
