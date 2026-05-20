import axios from 'axios'

const CLOUDFLARE_API = 'https://api.cloudflare.com/client/v4/accounts'
const API_KEY = process.env.CLOUDFLARE_API_KEY || ''
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || ''

export interface CloudflareModel {
  id: string
  name: string
  description: string
  contextLength: number
  isFree: boolean
  modality: string[]
  provider: 'cloudflare'
  category: string
}

export const CLOUDFLARE_FREE_MODELS: CloudflareModel[] = [
  { id: '@cf/meta/llama-3.3-70b-instruct-fp8-fast', name: 'Llama 3.3 70B', description: 'Edge-optimized Llama', contextLength: 128000, isFree: true, modality: ['text'], provider: 'cloudflare', category: 'general' },
  { id: '@cf/meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', description: 'Fast edge model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'cloudflare', category: 'general' },
  { id: '@cf/google/gemma-2b-it-lora', name: 'Gemma 2B', description: 'Ultra-fast small model', contextLength: 8192, isFree: true, modality: ['text'], provider: 'cloudflare', category: 'general' },
  { id: '@cf/mistral/mistral-7b-instruct-v0.1', name: 'Mistral 7B', description: 'Edge Mistral model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'cloudflare', category: 'general' },
  { id: '@cf/qwen/qwen1.5-7b-chat-awq', name: 'Qwen 1.5 7B', description: 'Alibaba edge model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'cloudflare', category: 'general' },
]

export async function cloudflareChat(model: string, messages: Array<{role: string, content: string}>) {
  if (!API_KEY || !ACCOUNT_ID) throw new Error('Cloudflare API key or Account ID not configured')
  
  const response = await axios.post(
    `${CLOUDFLARE_API}/${ACCOUNT_ID}/ai/run/${model}`,
    { messages },
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  )
  
  return response.data.result?.response || ''
}
