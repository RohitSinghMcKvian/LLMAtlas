import axios from 'axios'

const OPENROUTER_API = 'https://openrouter.ai/api/v1'
const API_KEY = process.env.OPENROUTER_API_KEY || ''

export interface OpenRouterModel {
  id: string
  name: string
  description: string
  pricing: {
    request: number
    completion: number
  }
  context_length: number
  max_output_tokens: number
  architecture: {
    modality: string
    tokenizer: string
    instruct_type: string | null
  }
  top_provider: {
    context_length: number
    max_completion_tokens: number
    is_moderated: boolean
  }
}

export async function fetchOpenRouterModels(): Promise<OpenRouterModel[]> {
  try {
    const response = await axios.get(`${OPENROUTER_API}/models`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://llmatlas.com',
        'X-Title': 'LLMAtlas'
      }
    })
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error)
    return []
  }
}

export async function fetchOpenRouterModelById(id: string): Promise<OpenRouterModel | null> {
  try {
    const models = await fetchOpenRouterModels()
    return models.find(m => m.id === id) || null
  } catch (error) {
    console.error('Error fetching OpenRouter model:', error)
    return null
  }
}

export function normalizeOpenRouterModel(or: OpenRouterModel) {
  return {
    openrouterId: or.id,
    name: or.name,
    description: or.description,
    contextWindow: or.context_length,
    maxOutputTokens: or.max_output_tokens,
    pricingInput: or.pricing.request,
    pricingOutput: or.pricing.completion,
    architecture: or.architecture?.modality || 'text',
    apiAvailable: true,
  }
}
