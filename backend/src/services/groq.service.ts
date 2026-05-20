import axios from 'axios'

const GROQ_API = 'https://api.groq.com/openai/v1'
const API_KEY = process.env.GROQ_API_KEY || ''

export interface GroqModel {
  id: string
  name: string
  description: string
  contextLength: number
  isFree: boolean
  modality: string[]
  provider: 'groq'
  category: string
}

export const GROQ_FREE_MODELS: GroqModel[] = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', description: 'Meta\'s latest on Groq LPU', contextLength: 128000, isFree: true, modality: ['text'], provider: 'groq', category: 'general' },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', description: 'Fastest model on Groq', contextLength: 128000, isFree: true, modality: ['text'], provider: 'groq', category: 'general' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'Mistral\'s MoE model', contextLength: 32768, isFree: true, modality: ['text'], provider: 'groq', category: 'general' },
  { id: 'gemma2-9b-it', name: 'Gemma 2 9B', description: 'Google\'s efficient model', contextLength: 8192, isFree: true, modality: ['text'], provider: 'groq', category: 'general' },
]

export async function groqChat(model: string, messages: Array<{role: string, content: string}>, temperature?: number, maxTokens?: number) {
  if (!API_KEY) throw new Error('Groq API key not configured')
  
  const response = await axios.post(
    `${GROQ_API}/chat/completions`,
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

export async function groqChatStream(model: string, messages: Array<{role: string, content: string}>, onToken: (token: string) => void, onComplete: (usage: any) => void, temperature?: number, maxTokens?: number) {
  if (!API_KEY) throw new Error('Groq API key not configured')
  
  const response = await axios.post(
    `${GROQ_API}/chat/completions`,
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
