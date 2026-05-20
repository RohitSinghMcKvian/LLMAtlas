import axios from 'axios'

const MISTRAL_API = 'https://api.mistral.ai/v1'
const API_KEY = process.env.MISTRAL_API_KEY || ''

export interface MistralModel {
  id: string
  name: string
  description: string
  contextLength: number
  isFree: boolean
  modality: string[]
  provider: 'mistral'
  category: string
}

export const MISTRAL_FREE_MODELS: MistralModel[] = [
  { id: 'mistral-small-latest', name: 'Mistral Small', description: 'Fast and efficient', contextLength: 32000, isFree: true, modality: ['text'], provider: 'mistral', category: 'general' },
  { id: 'mistral-large-latest', name: 'Mistral Large', description: 'Most capable Mistral model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'mistral', category: 'reasoning' },
  { id: 'codestral-latest', name: 'Codestral', description: 'Optimized for coding', contextLength: 32000, isFree: true, modality: ['text'], provider: 'mistral', category: 'coding' },
]

export async function mistralChat(model: string, messages: Array<{role: string, content: string}>, temperature?: number, maxTokens?: number) {
  if (!API_KEY) throw new Error('Mistral API key not configured')
  
  const response = await axios.post(
    `${MISTRAL_API}/chat/completions`,
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

export async function mistralChatStream(model: string, messages: Array<{role: string, content: string}>, onToken: (token: string) => void, onComplete: (usage: any) => void, temperature?: number, maxTokens?: number) {
  if (!API_KEY) throw new Error('Mistral API key not configured')
  
  const response = await axios.post(
    `${MISTRAL_API}/chat/completions`,
    {
      model,
      messages,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 2048,
      stream: true
    },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      responseType: 'stream'
    }
  )
  
  const stream = response.data
  for await (const chunk of stream) {
    const text = chunk.toString()
    const lines = text.split('\n')
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') continue
        try {
          const parsed = JSON.parse(data)
          const token = parsed.choices?.[0]?.delta?.content
          if (token) onToken(token)
          if (parsed.usage) onComplete(parsed.usage)
        } catch {
          continue
        }
      }
    }
  }
}
