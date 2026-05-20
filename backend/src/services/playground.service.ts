import axios from 'axios'
import { googleAIChatStream, googleAIChat } from './google-ai.service'
import { groqChatStream, groqChat } from './groq.service'
import { cerebrasChatStream, cerebrasChat } from './cerebras.service'
import { mistralChatStream, mistralChat } from './mistral.service'
import { nvidiaChatStream, nvidiaChat, getNvidiaModels, NVIDIA_FREE_MODELS } from './nvidia-nim.service'
const OPENROUTER_API = 'https://openrouter.ai/api/v1'
const API_KEY = process.env.OPENROUTER_API_KEY || ''
interface OpenRouterModel {
  id: string
  name: string
  description: string
  pricing: { prompt: number; completion: number }
  context_length: number
  architecture?: { modality: string[] }
  top_provider?: { is_moderated: boolean }
}
export interface FreeModel {
  id: string
  name: string
  description: string
  contextLength: number
  isFree: boolean
  modality: string[]
  provider?: string
  category?: string
}
const MODEL_ID_MAP: Record<string, string> = {
  'gpt-4o': 'openai/gpt-4o',
  'gpt-4o-mini': 'openai/gpt-4o-mini',
  'gpt-4-turbo': 'openai/gpt-4-turbo',
  'gpt-4': 'openai/gpt-4',
  'gpt-3.5-turbo': 'openai/gpt-3.5-turbo',
  'claude-3-5-sonnet': 'anthropic/claude-3.5-sonnet',
  'claude-3-5-sonnet-20241022': 'anthropic/claude-3.5-sonnet-20241022',
  'claude-3-opus': 'anthropic/claude-3-opus',
  'claude-3-haiku': 'anthropic/claude-3-haiku',
  'claude-3-sonnet': 'anthropic/claude-3-sonnet',
  'gemini-2.0-flash': 'google/gemini-2.0-flash-001',
  'gemini-2.0-flash-lite': 'google/gemini-2.0-flash-lite-preview-02-05:free',
  'gemini-1.5-pro': 'google/gemini-pro-1.5',
  'gemini-1.5-flash': 'google/gemini-flash-1.5',
  'llama-3.1-70b': 'meta-llama/llama-3.1-70b-instruct',
  'llama-3.1-8b': 'meta-llama/llama-3.1-8b-instruct',
  'llama-3.3-70b': 'meta-llama/llama-3.3-70b-instruct',
  'llama-3-8b': 'meta-llama/llama-3-8b-instruct',
  'llama-3-70b': 'meta-llama/llama-3-70b-instruct',
  'mistral-large': 'mistralai/mistral-large-2411',
  'mistral-small': 'mistralai/mistral-small-24b-instruct-2501',
  'mistral-nemo': 'mistralai/mistral-nemo',
  'deepseek-v3': 'deepseek/deepseek-chat',
  'deepseek-r1': 'deepseek/deepseek-r1',
  'qwen-2.5-72b': 'qwen/qwen-2.5-72b-instruct',
  'qwen-2.5-coder': 'qwen/qwen-2.5-coder-32b-instruct',
  'gemma-2-9b': 'google/gemma-2-9b-it',
  'gemma-2-27b': 'google/gemma-2-27b-it',
  'phi-3-mini': 'microsoft/phi-3-mini-128k-instruct',
  'phi-3-medium': 'microsoft/phi-3-medium-128k-instruct',
  'phi-4': 'microsoft/phi-4',
  'codestral': 'mistralai/codestral-2501',
  'mythos': 'sakanaai/mythos-800b',
}

const GOOGLE_AI_MODELS = ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash', 'gemma-3', 'imagen-3']
const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it']
const CEREBRAS_MODELS = ['llama3.1-8b', 'llama3.3-70b']
const MISTRAL_MODELS = ['mistral-small-latest', 'mistral-large-latest', 'codestral-latest']

const NVIDIA_MODEL_PREFIXES = [
  'meta/', 'google/', 'mistralai/', 'deepseek-ai/', 'qwen/', 'nvidia/',
  'z-ai/', 'moonshotai/', 'minimax/', 'microsoft/', 'openai/', 'snowflake/',
  'ibm/', 'sarvam-ai/', 'aisingapore/', 'writer/'
]

function resolveProvider(modelId: string): 'google-ai' | 'groq' | 'cerebras' | 'mistral' | 'nvidia' | 'openrouter' {
  const cleanId = modelId.replace(/:free$/, '')
  
  if (GOOGLE_AI_MODELS.some(m => cleanId === m || cleanId.includes(m))) return 'google-ai'
  if (GROQ_MODELS.some(m => cleanId === m || cleanId.includes(m))) return 'groq'
  if (CEREBRAS_MODELS.some(m => cleanId === m || cleanId.includes(m))) return 'cerebras'
  if (MISTRAL_MODELS.some(m => cleanId === m || cleanId.includes(m))) return 'mistral'
  if (NVIDIA_MODEL_PREFIXES.some(p => cleanId.startsWith(p))) return 'nvidia'
  
  const lower = cleanId.toLowerCase()
  if (lower.startsWith('gemini') || lower.startsWith('gemma')) return 'google-ai'
  if (lower.startsWith('llama-3') && !lower.includes('/')) return 'groq'
  if (lower.startsWith('mistral') || lower.startsWith('codestral')) return 'mistral'
  
  return 'openrouter'
}
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'openai/gpt-4o': { input: 2.50, output: 10.00 },
  'openai/gpt-4o-mini': { input: 0.15, output: 0.60 },
  'openai/gpt-4-turbo': { input: 10.00, output: 30.00 },
  'openai/gpt-4': { input: 30.00, output: 60.00 },
  'openai/gpt-3.5-turbo': { input: 0.50, output: 1.50 },
  'openai/o1': { input: 15.00, output: 60.00 },
  'openai/o1-mini': { input: 3.00, output: 12.00 },
  'anthropic/claude-3.5-sonnet': { input: 3.00, output: 15.00 },
  'anthropic/claude-3.5-sonnet-20241022': { input: 3.00, output: 15.00 },
  'anthropic/claude-3-opus': { input: 15.00, output: 75.00 },
  'anthropic/claude-3-haiku': { input: 0.25, output: 1.25 },
  'anthropic/claude-3-sonnet': { input: 3.00, output: 15.00 },
  'google/gemini-2.0-flash-001': { input: 0.10, output: 0.40 },
  'google/gemini-2.0-flash-lite-preview-02-05:free': { input: 0, output: 0 },
  'google/gemini-pro-1.5': { input: 1.25, output: 5.00 },
  'google/gemini-flash-1.5': { input: 0.075, output: 0.30 },
  'meta-llama/llama-3.1-70b-instruct': { input: 0.90, output: 0.90 },
  'meta-llama/llama-3.1-8b-instruct': { input: 0.10, output: 0.10 },
  'meta-llama/llama-3.3-70b-instruct': { input: 0.90, output: 0.90 },
  'meta-llama/llama-3-8b-instruct': { input: 0.10, output: 0.10 },
  'meta-llama/llama-3-70b-instruct': { input: 0.90, output: 0.90 },
  'mistralai/mistral-large-2411': { input: 2.00, output: 6.00 },
  'mistralai/mistral-small-24b-instruct-2501': { input: 0.10, output: 0.30 },
  'mistralai/mistral-nemo': { input: 0.15, output: 0.15 },
  'deepseek/deepseek-chat': { input: 0.14, output: 0.28 },
  'deepseek/deepseek-r1': { input: 0.55, output: 2.19 },
  'qwen/qwen-2.5-72b-instruct': { input: 0.90, output: 0.90 },
  'qwen/qwen-2.5-coder-32b-instruct': { input: 0.10, output: 0.10 },
  'google/gemma-2-9b-it': { input: 0.10, output: 0.10 },
  'google/gemma-2-27b-it': { input: 0.20, output: 0.20 },
  'microsoft/phi-3-mini-128k-instruct': { input: 0.10, output: 0.10 },
  'microsoft/phi-3-medium-128k-instruct': { input: 0.10, output: 0.10 },
  'microsoft/phi-4': { input: 0.10, output: 0.10 },
  'mistralai/codestral-2501': { input: 0.20, output: 0.60 },
  'sakanaai/mythos-800b': { input: 0.50, output: 1.50 },
}
const conversationSessions: Record<string, Array<{ role: string; content: string }>> = {}
let cachedFreeModels: FreeModel[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000
function resolveModelId(modelId: string): string {
  // Strip :free suffix if present
  const cleanId = modelId.replace(/:free$/, '')
  
  if (MODEL_ID_MAP[cleanId]) return MODEL_ID_MAP[cleanId]
  if (cleanId.includes('/')) return cleanId
  const lower = cleanId.toLowerCase()
  for (const [key, value] of Object.entries(MODEL_ID_MAP)) {
    if (lower.includes(key.toLowerCase())) return value
  }
  return `openai/${cleanId}`
}
function calculateCost(modelId: string, promptTokens: number, completionTokens: number): { total: number; currency: string; breakdown?: { input: number; output: number } } {
  const pricing = MODEL_PRICING[modelId]
  
  if (!pricing || (pricing.input === 0 && pricing.output === 0)) {
    return { total: 0, currency: 'USD' }
  }
  const inputCost = (promptTokens / 1_000_000) * pricing.input
  const outputCost = (completionTokens / 1_000_000) * pricing.output
  const total = inputCost + outputCost
  return {
    total: Number(total.toFixed(6)),
    currency: 'USD',
    breakdown: {
      input: Number(inputCost.toFixed(6)),
      output: Number(outputCost.toFixed(6))
    }
  }
}
export async function getFreeModels(): Promise<FreeModel[]> {
  const now = Date.now()
  if (cachedFreeModels && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedFreeModels
  }
  try {
    const response = await axios.get(`${OPENROUTER_API}/models`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://llmatlas.com',
        'X-Title': 'LLMAtlas'
      },
      timeout: 10000
    })
    const models: OpenRouterModel[] = response.data.data || []
    
    const freeModels: FreeModel[] = models
      .filter(m => m.pricing.prompt === 0 && m.pricing.completion === 0)
      .map(m => ({
        id: m.id,
        name: m.name,
        description: m.description,
        contextLength: m.context_length,
        isFree: true,
        modality: m.architecture?.modality || ['text'],
        provider: m.id.split('/')[0],
        category: 'general',
      }))
    const popularFree = [
      'meta-llama/llama-3.3-70b-instruct:free',
      'google/gemma-2-9b-it:free',
      'microsoft/phi-4:free',
      'deepseek/deepseek-r1:free',
      'qwen/qwen-2.5-72b-instruct:free',
      'mistralai/mistral-small-24b-instruct-2501:free',
      'nvidia/llama-3.1-nemotron-70b-instruct:free',
      'meta-llama/llama-3.1-8b-instruct:free',
      'google/gemma-2-27b-it:free',
      'qwen/qwen-2.5-coder-32b-instruct:free',
    ]
    const existingIds = new Set(freeModels.map(m => m.id))
    
    for (const modelId of popularFree) {
      if (!existingIds.has(modelId)) {
        const baseId = modelId.replace(':free', '')
        const orModel = models.find(m => m.id === baseId)
        if (orModel) {
          freeModels.push({
            id: modelId,
            name: orModel.name,
            description: orModel.description,
            contextLength: orModel.context_length,
            isFree: true,
            modality: orModel.architecture?.modality || ['text'],
            provider: modelId.split('/')[0],
            category: 'general',
          })
        }
      }
    }
    cachedFreeModels = freeModels.sort((a, b) => b.contextLength - a.contextLength)
    cacheTimestamp = now
    return cachedFreeModels
  } catch (error) {
    console.error('Error fetching free models:', error)
    return getDefaultFreeModels()
  }
}
function getDefaultFreeModels(): FreeModel[] {
  return [
    // Google AI Studio (6 models)
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', description: 'Most capable Google model', contextLength: 1000000, isFree: true, modality: ['text', 'vision'], provider: 'google', category: 'reasoning' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Google\'s latest fast model', contextLength: 1000000, isFree: true, modality: ['text', 'vision'], provider: 'google', category: 'general' },
    { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash-Lite', description: 'Optimized for speed', contextLength: 1000000, isFree: true, modality: ['text'], provider: 'google', category: 'general' },
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', description: 'Previous gen fast model', contextLength: 1000000, isFree: true, modality: ['text', 'vision'], provider: 'google', category: 'general' },
    { id: 'gemma-3', name: 'Gemma 3', description: 'Google\'s open model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'google', category: 'general' },
    { id: 'imagen-3', name: 'Imagen 3', description: 'Image generation model', contextLength: 0, isFree: true, modality: ['image'], provider: 'google', category: 'vision' },
    // Groq (4 models)
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', description: 'Meta\'s latest on Groq LPU', contextLength: 128000, isFree: true, modality: ['text'], provider: 'groq', category: 'general' },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', description: 'Fastest model on Groq', contextLength: 128000, isFree: true, modality: ['text'], provider: 'groq', category: 'general' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'Mistral\'s MoE model', contextLength: 32768, isFree: true, modality: ['text'], provider: 'groq', category: 'general' },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B', description: 'Google\'s efficient model', contextLength: 8192, isFree: true, modality: ['text'], provider: 'groq', category: 'general' },
    // Cerebras (2 models)
    { id: 'llama3.1-8b', name: 'Llama 3.1 8B', description: 'Ultra-fast small model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'cerebras', category: 'general' },
    { id: 'llama3.3-70b', name: 'Llama 3.3 70B', description: '1000+ tokens/sec on Cerebras', contextLength: 128000, isFree: true, modality: ['text'], provider: 'cerebras', category: 'general' },
    // Mistral (3 models)
    { id: 'mistral-small-latest', name: 'Mistral Small', description: 'Fast and efficient', contextLength: 32000, isFree: true, modality: ['text'], provider: 'mistral', category: 'general' },
    { id: 'mistral-large-latest', name: 'Mistral Large', description: 'Most capable Mistral model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'mistral', category: 'reasoning' },
    { id: 'codestral-latest', name: 'Codestral', description: 'Optimized for coding', contextLength: 32000, isFree: true, modality: ['text'], provider: 'mistral', category: 'coding' },
    // OpenRouter Free (10 models)
    { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B', description: 'Meta\'s latest open model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'meta', category: 'general' },
    { id: 'google/gemma-2-9b-it:free', name: 'Gemma 2 9B', description: 'Google\'s open model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'google', category: 'general' },
    { id: 'microsoft/phi-4:free', name: 'Phi-4', description: 'Microsoft\'s compact model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'microsoft', category: 'general' },
    { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1', description: 'Reasoning specialist', contextLength: 128000, isFree: true, modality: ['text'], provider: 'deepseek', category: 'reasoning' },
    { id: 'qwen/qwen-2.5-72b-instruct:free', name: 'Qwen 2.5 72B', description: 'Alibaba\'s multilingual model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'alibaba', category: 'general' },
    { id: 'mistralai/mistral-small-24b-instruct-2501:free', name: 'Mistral Small 24B', description: 'Fast and capable', contextLength: 32000, isFree: true, modality: ['text'], provider: 'mistral', category: 'general' },
    { id: 'nvidia/llama-3.1-nemotron-70b-instruct:free', name: 'Nemotron 70B', description: 'Nvidia\'s optimized Llama', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
    { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B', description: 'Meta\'s efficient model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'meta', category: 'general' },
    { id: 'google/gemma-2-27b-it:free', name: 'Gemma 2 27B', description: 'Google\'s mid-size model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'google', category: 'general' },
    { id: 'qwen/qwen-2.5-coder-32b-instruct:free', name: 'Qwen 2.5 Coder 32B', description: 'Coding specialist', contextLength: 32000, isFree: true, modality: ['text'], provider: 'alibaba', category: 'coding' },
  ]
}
export interface PlaygroundRequest {
  model: string
  messages: Array<{ role: string; content: string }>
  temperature?: number
  topP?: number
  maxTokens?: number
  systemPrompt?: string
  sessionId?: string
  attachments?: Array<{ name: string; type: string; base64: string }>
}
export interface PlaygroundResponse {
  content: string
  model: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  cost: {
    total: number
    currency: string
    breakdown?: {
      input: number
      output: number
    }
  }
}
export async function chatCompletion(request: PlaygroundRequest): Promise<PlaygroundResponse> {
  const messages = request.systemPrompt
    ? [{ role: 'system', content: request.systemPrompt }, ...request.messages]
    : request.messages
  
  const provider = resolveProvider(request.model)
  
  switch (provider) {
    case 'google-ai': {
      const content = await googleAIChat(request.model, messages, request.temperature, request.maxTokens)
      return {
        content,
        model: request.model,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        cost: { total: 0, currency: 'USD' }
      }
    }
    case 'groq': {
      const content = await groqChat(request.model, messages, request.temperature, request.maxTokens)
      return {
        content,
        model: request.model,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        cost: { total: 0, currency: 'USD' }
      }
    }
    case 'cerebras': {
      const content = await cerebrasChat(request.model, messages, request.temperature, request.maxTokens)
      return {
        content,
        model: request.model,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        cost: { total: 0, currency: 'USD' }
      }
    }
    case 'mistral': {
      const content = await mistralChat(request.model, messages, request.temperature, request.maxTokens)
      return {
        content,
        model: request.model,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        cost: { total: 0, currency: 'USD' }
      }
    }
    case 'nvidia': {
      const content = await nvidiaChat(request.model, messages, request.temperature, request.maxTokens)
      return {
        content,
        model: request.model,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        cost: { total: 0, currency: 'USD' }
      }
    }
    case 'openrouter':
    default:
      return chatCompletionOpenRouter(request, messages)
  }
}

async function chatCompletionOpenRouter(request: PlaygroundRequest, messages: Array<{role: string; content: string}>): Promise<PlaygroundResponse> {
  const resolvedModel = resolveModelId(request.model)
  try {
    const response = await axios.post(
      `${OPENROUTER_API}/chat/completions`,
      {
        model: resolvedModel,
        messages,
        temperature: request.temperature || 0.7,
        top_p: request.topP || 0.9,
        max_tokens: request.maxTokens || 2048,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': 'https://llmatlas.com',
          'X-Title': 'LLMAtlas',
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    )
    const data = response.data
    const choice = data.choices[0]
    const promptTokens = data.usage?.prompt_tokens || 0
    const completionTokens = data.usage?.completion_tokens || 0
    
    return {
      content: choice.message.content,
      model: data.model,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: data.usage?.total_tokens || 0,
      },
      cost: calculateCost(resolvedModel, promptTokens, completionTokens)
    }
  } catch (error: any) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.')
    }
    if (error.response?.status === 402) {
      throw new Error('API quota exceeded. Try again later.')
    }
    throw new Error(error.response?.data?.error?.message || 'Failed to generate response')
  }
}
export async function chatCompletionStream(request: PlaygroundRequest, onToken: (token: string) => void, onComplete: (usage: any) => void): Promise<void> {
  const messages = request.systemPrompt
    ? [{ role: 'system', content: request.systemPrompt }, ...request.messages]
    : request.messages
  
  const provider = resolveProvider(request.model)
  const attachments = request.attachments || []
  
  switch (provider) {
    case 'google-ai':
      await googleAIChatStream(request.model, messages, onToken, onComplete, attachments)
      return
    case 'groq':
      await groqChatStream(request.model, messages, onToken, onComplete, request.temperature, request.maxTokens)
      return
    case 'cerebras':
      await cerebrasChatStream(request.model, messages, onToken, onComplete, request.temperature, request.maxTokens)
      return
    case 'mistral':
      await mistralChatStream(request.model, messages, onToken, onComplete, request.temperature, request.maxTokens)
      return
    case 'nvidia':
      await nvidiaChatStream(request.model, messages, onToken, onComplete, request.temperature, request.maxTokens)
      return
    case 'openrouter':
    default:
      await chatCompletionStreamOpenRouter(request, messages, onToken, onComplete, attachments)
      return
  }
}

type MessageContent = string | Array<{ type: string; text?: string; image_url?: { url: string } }>

interface Message {
  role: string
  content: MessageContent
}

async function chatCompletionStreamOpenRouter(request: PlaygroundRequest, messages: Array<{role: string; content: string}>, onToken: (token: string) => void, onComplete: (usage: any) => void, attachments: Array<{name: string; type: string; base64: string}> = []): Promise<void> {
  const resolvedModel = resolveModelId(request.model)
  
  let formattedMessages: Message[] = messages as Message[]
  if (attachments.length > 0) {
    const lastUserMessage = messages[messages.length - 1]
    if (lastUserMessage && lastUserMessage.role === 'user') {
      const imageAttachments = attachments.filter(att => att.type.startsWith('image/'))
      
      if (imageAttachments.length > 0) {
        const content: MessageContent = [
          { type: 'text', text: lastUserMessage.content },
          ...imageAttachments.map(att => ({
            type: 'image_url',
            image_url: { url: `data:${att.type};base64,${att.base64}` }
          }))
        ]
        
        formattedMessages = [
          ...messages.slice(0, -1) as Message[],
          { role: 'user', content }
        ]
      }
    }
  }
  
  try {
    const response = await axios.post(
      `${OPENROUTER_API}/chat/completions`,
      {
        model: resolvedModel,
        messages: formattedMessages,
        temperature: request.temperature || 0.7,
        top_p: request.topP || 0.9,
        max_tokens: request.maxTokens || 2048,
        stream: true,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': 'https://llmatlas.com',
          'X-Title': 'LLMAtlas',
          'Content-Type': 'application/json'
        },
        responseType: 'stream',
        timeout: 60000
      }
    )
    const stream = response.data
    let buffer = ''
    for await (const chunk of stream) {
      buffer += chunk.toString()
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''
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
  } catch (error: any) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.')
    }
    throw new Error(error.response?.data?.error?.message || error.message || 'Streaming failed')
  }
}
export async function listAvailableModels() {
  try {
    const response = await axios.get(`${OPENROUTER_API}/models`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://llmatlas.com',
        'X-Title': 'LLMAtlas'
      },
      timeout: 10000
    })
    return response.data.data || []
  } catch (error) {
    console.error('Error listing OpenRouter models:', error)
    return []
  }
}
export function createSession(): string {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  conversationSessions[sessionId] = []
  return sessionId
}
export function getSession(sessionId: string): Array<{ role: string; content: string }> {
  return conversationSessions[sessionId] || []
}
export function addToSession(sessionId: string, role: string, content: string): void {
  if (!conversationSessions[sessionId]) {
    conversationSessions[sessionId] = []
  }
  conversationSessions[sessionId].push({ role, content })
  
  if (conversationSessions[sessionId].length > 20) {
    conversationSessions[sessionId] = conversationSessions[sessionId].slice(-20)
  }
}
export function deleteSession(sessionId: string): void {
  delete conversationSessions[sessionId]
}