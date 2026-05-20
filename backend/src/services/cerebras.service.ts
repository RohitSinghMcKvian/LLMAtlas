import axios from 'axios'

const CEREBRAS_API = 'https://api.cerebras.ai/v1'
const API_KEY = process.env.CEREBRAS_API_KEY || ''

export interface CerebrasModel {
  id: string
  name: string
  description: string
  contextLength: number
  isFree: boolean
  modality: string[]
  provider: 'cerebras'
  category: string
}

export const CEREBRAS_FREE_MODELS: CerebrasModel[] = [
  { id: 'llama3.1-8b', name: 'Llama 3.1 8B', description: 'Ultra-fast small model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'cerebras', category: 'general' },
  { id: 'llama3.3-70b', name: 'Llama 3.3 70B', description: '1000+ tokens/sec on Cerebras', contextLength: 128000, isFree: true, modality: ['text'], provider: 'cerebras', category: 'general' },
]

export async function cerebrasChat(model: string, messages: Array<{role: string, content: string}>, temperature?: number, maxTokens?: number) {
  if (!API_KEY) throw new Error('Cerebras API key not configured')
  
  const response = await axios.post(
    `${CEREBRAS_API}/chat/completions`,
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

export async function cerebrasChatStream(model: string, messages: Array<{role: string, content: string}>, onToken: (token: string) => void, onComplete: (usage: any) => void, temperature?: number, maxTokens?: number) {
  if (!API_KEY) throw new Error('Cerebras API key not configured')
  
  const response = await axios.post(
    `${CEREBRAS_API}/chat/completions`,
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
  let fullContent = ''
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
          if (token) {
            fullContent += token
            onToken(token)
          }
          if (parsed.usage) onComplete(parsed.usage)
        } catch {
          continue
        }
      }
    }
  }
}
