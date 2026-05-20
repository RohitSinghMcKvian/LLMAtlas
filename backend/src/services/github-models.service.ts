import axios from 'axios'

const GITHUB_API = 'https://models.inference.ai.azure.com'
const API_KEY = process.env.GITHUB_TOKEN || ''

export interface GitHubModel {
  id: string
  name: string
  description: string
  contextLength: number
  isFree: boolean
  modality: string[]
  provider: 'github'
  category: string
}

export const GITHUB_FREE_MODELS: GitHubModel[] = [
  { id: 'gpt-4o', name: 'GPT-4o', description: 'OpenAI\'s flagship model', contextLength: 128000, isFree: true, modality: ['text', 'vision'], provider: 'github', category: 'general' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast efficient OpenAI model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'github', category: 'general' },
  { id: 'o1', name: 'o1', description: 'OpenAI reasoning model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'github', category: 'reasoning' },
  { id: 'o1-mini', name: 'o1-mini', description: 'Fast reasoning model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'github', category: 'reasoning' },
  { id: 'Meta-Llama-3.1-405B-Instruct', name: 'Llama 3.1 405B', description: 'Largest open model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'github', category: 'general' },
  { id: 'Meta-Llama-3.1-70B-Instruct', name: 'Llama 3.1 70B', description: 'Meta\'s powerful model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'github', category: 'general' },
  { id: 'Meta-Llama-3.1-8B-Instruct', name: 'Llama 3.1 8B', description: 'Fast Meta model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'github', category: 'general' },
  { id: 'Mistral-large', name: 'Mistral Large', description: 'Mistral\'s flagship', contextLength: 128000, isFree: true, modality: ['text'], provider: 'github', category: 'reasoning' },
  { id: 'Mistral-small', name: 'Mistral Small', description: 'Fast Mistral model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'github', category: 'general' },
  { id: 'Cohere-command-r-plus-08-2024', name: 'Command R+', description: 'Cohere\'s best model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'github', category: 'general' },
]

export async function githubModelsChat(model: string, messages: Array<{role: string, content: string}>, temperature?: number, maxTokens?: number) {
  if (!API_KEY) throw new Error('GitHub token not configured')
  
  const response = await axios.post(
    `${GITHUB_API}/chat/completions`,
    {
      model,
      messages,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 2048
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  )
  
  return response.data.choices[0].message.content
}
