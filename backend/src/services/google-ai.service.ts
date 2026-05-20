import axios from 'axios'
import { nvidiaChat } from './nvidia-nim.service'
import { groqChat } from './groq.service'
import { cerebrasChat } from './cerebras.service'
import { mistralChat } from './mistral.service'

const GOOGLE_AI_API = 'https://generativelanguage.googleapis.com/v1beta'
const API_KEY = process.env.GOOGLE_AI_API_KEY || ''

export interface GoogleAIModel {
  id: string
  name: string
  description: string
  contextLength: number
  isFree: boolean
  modality: string[]
  provider: 'google'
  category: string
}

export const GOOGLE_FREE_MODELS: GoogleAIModel[] = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Google\'s latest fast model', contextLength: 1000000, isFree: true, modality: ['text', 'vision'], provider: 'google', category: 'general' },
  { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite', description: 'Optimized for speed', contextLength: 1000000, isFree: true, modality: ['text'], provider: 'google', category: 'general' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Most capable Google model', contextLength: 1000000, isFree: true, modality: ['text', 'vision'], provider: 'google', category: 'reasoning' },
  { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Previous gen fast model', contextLength: 1000000, isFree: true, modality: ['text', 'vision'], provider: 'google', category: 'general' },
  { id: 'gemma-3', name: 'Gemma 3', description: 'Google\'s open model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'google', category: 'general' },
  { id: 'imagen-3', name: 'Imagen 3', description: 'Image generation model', contextLength: 0, isFree: true, modality: ['image'], provider: 'google', category: 'vision' },
]

export async function googleAIChat(model: string, messages: Array<{role: string, content: string}>, temperature?: number, maxTokens?: number) {
  if (!API_KEY) throw new Error('Google AI API key not configured')
  
  const response = await axios.post(
    `${GOOGLE_AI_API}/models/${model}:generateContent?key=${API_KEY}`,
    {
      contents: messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      generationConfig: {
        temperature: temperature || 0.7,
        maxOutputTokens: maxTokens || 2048
      }
    }
  )
  
  return response.data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

export async function googleAIChatStream(model: string, messages: Array<{role: string, content: string}>, onToken: (token: string) => void, onComplete?: (usage: any) => void, attachments: Array<{name: string; type: string; base64: string}> = []) {
  if (!API_KEY) throw new Error('Google AI API key not configured')
  
  const contents = messages.map((m, idx) => {
    const parts: Array<{text?: string; inlineData?: {mimeType: string; data: string}}> = [{ text: m.content }]
    
    if (idx === messages.length - 1 && m.role === 'user' && attachments.length > 0) {
      for (const att of attachments) {
        if (att.type.startsWith('image/') || att.type === 'application/pdf') {
          parts.push({
            inlineData: {
              mimeType: att.type,
              data: att.base64
            }
          })
        }
      }
    }
    
    return {
      role: m.role === 'assistant' ? 'model' : 'user',
      parts
    }
  })
  
  const response = await axios.post(
    `${GOOGLE_AI_API}/models/${model}:streamGenerateContent?alt=sse&key=${API_KEY}`,
    { contents },
    { responseType: 'stream' }
  )
  
  const stream = response.data
  for await (const chunk of stream) {
    const text = chunk.toString()
    const lines = text.split('\n')
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6))
          const token = data.candidates?.[0]?.content?.parts?.[0]?.text
          if (token) onToken(token)
          if (data.usageMetadata && onComplete) {
            onComplete({
              prompt_tokens: data.usageMetadata.promptTokenCount || 0,
              completion_tokens: data.usageMetadata.candidatesTokenCount || 0,
              total_tokens: data.usageMetadata.totalTokenCount || 0
            })
          }
        } catch {
          continue
        }
      }
    }
  }
}

export interface ModelResponse {
  modelId: string
  modelName: string
  provider: string
  content: string
}

export async function summarizeResponses(prompt: string, responses: ModelResponse[]): Promise<string> {
  const SUMMARIZER_SYSTEM_PROMPT = `You are an expert AI analyst. Your task is to analyze responses from multiple LLM models to the same prompt and provide a comprehensive, structured summary.

Analyze the following responses and provide:

## Key Insights
The most important points and findings across all responses.

## Consensus
What all or most models agree on.

## Divergence
Where models disagree, take different approaches, or provide conflicting information.

## Best Response
Which model gave the most complete, accurate, or useful answer, and why.

## Unique Perspectives
Notable points, approaches, or insights that only one model provided.

Be concise but thorough. Use markdown formatting. Focus on substance over style.`

  const responseList = responses.map(r => 
    `### ${r.modelName} (${r.provider})\n${r.content}`
  ).join('\n\n---\n\n')

  const userContent = `Original Prompt: "${prompt}"\n\nModel Responses:\n${responseList}`

  const messages = [
    { role: 'system', content: SUMMARIZER_SYSTEM_PROMPT },
    { role: 'user', content: userContent }
  ]

  // Try Groq first (fastest & most reliable free tier)
  try {
    const result = await groqChat('llama-3.3-70b-versatile', messages, 0.3, 2048)
    if (result && result.trim()) return result.trim()
  } catch (error: any) {
    console.error('Groq summarizer failed:', error.message)
  }

  // Fallback to Cerebras (extremely fast inference)
  try {
    const result = await cerebrasChat('llama3.3-70b', messages, 0.3, 2048)
    if (result && result.trim()) return result.trim()
  } catch (error: any) {
    console.error('Cerebras summarizer failed:', error.message)
  }

  // Fallback to NVIDIA NIM (Llama 3.3 70B)
  try {
    const result = await nvidiaChat('meta/llama-3.3-70b-instruct', messages, 0.3, 2048)
    if (result && result.trim()) return result.trim()
  } catch (error: any) {
    console.error('NVIDIA summarizer (Llama 3.3 70B) failed:', error.message)
  }

  // Fallback to NVIDIA DeepSeek V3.2
  try {
    const result = await nvidiaChat('deepseek-ai/deepseek-v3.2', messages, 0.3, 2048)
    if (result && result.trim()) return result.trim()
  } catch (error: any) {
    console.error('NVIDIA summarizer (DeepSeek V3.2) failed:', error.message)
  }

  // Fallback to Mistral
  try {
    const result = await mistralChat('mistral-large-latest', messages, 0.3, 2048)
    if (result && result.trim()) return result.trim()
  } catch (error: any) {
    console.error('Mistral summarizer failed:', error.message)
  }

  throw new Error('All summarization providers failed')
}
