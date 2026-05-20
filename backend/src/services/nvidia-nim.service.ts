import axios from 'axios'

const NVIDIA_API = 'https://integrate.api.nvidia.com/v1'
const API_KEY = process.env.NVIDIA_API_KEY || ''

export interface NvidiaModel {
  id: string
  name: string
  description: string
  contextLength: number
  isFree: boolean
  modality: string[]
  provider: 'nvidia'
  category: string
}

const MODEL_DISPLAY_NAMES: Record<string, string> = {
  'meta/llama-3.1-8b-instruct': 'Llama 3.1 8B',
  'meta/llama-3.1-70b-instruct': 'Llama 3.1 70B',
  'meta/llama-3.1-405b-instruct': 'Llama 3.1 405B',
  'meta/llama-3.3-70b-instruct': 'Llama 3.3 70B',
  'meta/llama-4-maverick-17b-128e-instruct-fp8': 'Llama 4 Maverick 17B',
  'meta/llama-4-scout-17b-16e-instruct': 'Llama 4 Scout 17B',
  'nvidia/llama-3.1-nemotron-70b-instruct': 'Nemotron 70B',
  'nvidia/llama-3.1-nemotron-51b-instruct': 'Nemotron 51B',
  'nvidia/nemotron-mini-4b-instruct': 'Nemotron Mini 4B',
  'nvidia/nemotron-4-340b-instruct': 'Nemotron 340B',
  'nvidia/nemotron-nano-9b-v2': 'Nemotron Nano 9B',
  'nvidia/nemotron-3-super-120b-a12b': 'Nemotron Super 120B',
  'google/gemma-3-4b-it': 'Gemma 3 4B',
  'google/gemma-3-12b-it': 'Gemma 3 12B',
  'google/gemma-3-27b-it': 'Gemma 3 27B',
  'google/gemma-4-31b-it': 'Gemma 4 31B',
  'google/gemma-2-9b-it': 'Gemma 2 9B',
  'google/gemma-2-27b-it': 'Gemma 2 27B',
  'mistralai/mistral-large-2': 'Mistral Large 2',
  'mistralai/mistral-small-3.1-24b-instruct': 'Mistral Small 3.1',
  'mistralai/mistral-nemo': 'Mistral Nemo',
  'mistralai/codestral-2501': 'Codestral 2501',
  'mistralai/mixtral-8x22b-instruct-v0.1': 'Mixtral 8x22B',
  'mistralai/mixtral-8x7b-instruct-v0.1': 'Mixtral 8x7B',
  'deepseek-ai/deepseek-v3.2': 'DeepSeek V3.2',
  'deepseek-ai/deepseek-r1': 'DeepSeek R1',
  'qwen/qwen-3-235b-a22b': 'Qwen 3 235B',
  'qwen/qwen-3-32b': 'Qwen 3 32B',
  'qwen/qwen-2.5-72b-instruct': 'Qwen 2.5 72B',
  'qwen/qwen-2.5-coder-32b-instruct': 'Qwen 2.5 Coder 32B',
  'qwen/qwen2.5-coder-32b-instruct': 'Qwen 2.5 Coder 32B',
  'z-ai/glm-5.1': 'GLM 5.1',
  'z-ai/glm-4-9b-chat': 'GLM 4 9B',
  'z-ai/glm-4-plus': 'GLM 4 Plus',
  'moonshotai/kimi-k2.5': 'Kimi K2.5',
  'minimax/minimax-m2.7': 'MiniMax M2.7',
  'minimax/minimax-m1-80k': 'MiniMax M1',
  'microsoft/phi-4': 'Phi-4',
  'microsoft/phi-3.5-moe-instruct': 'Phi 3.5 MoE',
  'microsoft/phi-3-mini-128k-instruct': 'Phi 3 Mini',
  'microsoft/phi-3-medium-128k-instruct': 'Phi 3 Medium',
  'openai/gpt-oss-120b': 'GPT-OSS 120B',
  'openai/gpt-oss-20b': 'GPT-OSS 20B',
  'snowflake/arctic2': 'Snowflake Arctic 2',
  'sap/sap-gpt-2.0': 'SAP GPT 2.0',
  'ibm/granite-4.0-tiny-preview': 'Granite 4.0 Tiny',
  'ibm/granite-4.0-h-tiny-preview': 'Granite 4.0 H Tiny',
  'aisingapore/sea-lion-7b-instruct': 'SeaLion 7B',
  'sarvam-ai/sarvam-m': 'Sarvam M',
  'writer/palmyra-creative-122b': 'Palmyra Creative 122B',
  'writer/palmyra-med-70b-32k': 'Palmyra Med 70B',
  'writer/palmyra-fin-70b-32k': 'Palmyra Fin 70B',
}

const MODEL_CATEGORIES: Record<string, string> = {
  'llama': 'general',
  'nemotron': 'general',
  'gemma': 'general',
  'mistral': 'general',
  'mixtral': 'general',
  'codestral': 'coding',
  'deepseek': 'reasoning',
  'qwen': 'reasoning',
  'glm': 'reasoning',
  'kimi': 'reasoning',
  'minimax': 'reasoning',
  'phi': 'general',
  'gpt-oss': 'general',
  'arctic': 'general',
  'granite': 'general',
  'sarvam': 'general',
  'palmyra': 'general',
  'sea-lion': 'general',
  'sap': 'general',
}

function categorizeModel(modelId: string): string {
  const lower = modelId.toLowerCase()
  for (const [key, category] of Object.entries(MODEL_CATEGORIES)) {
    if (lower.includes(key)) return category
  }
  return 'general'
}

function getModelName(modelId: string): string {
  if (MODEL_DISPLAY_NAMES[modelId]) return MODEL_DISPLAY_NAMES[modelId]
  const parts = modelId.split('/')
  return parts[parts.length - 1]
}

function getContextLength(modelId: string): number {
  const lower = modelId.toLowerCase()
  if (lower.includes('405b')) return 128000
  if (lower.includes('340b')) return 128000
  if (lower.includes('235b')) return 128000
  if (lower.includes('122b')) return 128000
  if (lower.includes('120b')) return 128000
  if (lower.includes('kimi')) return 256000
  if (lower.includes('nemotron-3-super')) return 1000000
  if (lower.includes('70b')) return 128000
  if (lower.includes('80k')) return 80000
  if (lower.includes('32b')) return 128000
  if (lower.includes('31b')) return 128000
  if (lower.includes('27b')) return 128000
  if (lower.includes('24b')) return 128000
  if (lower.includes('20b')) return 128000
  if (lower.includes('17b')) return 128000
  if (lower.includes('12b')) return 32000
  if (lower.includes('9b')) return 32000
  if (lower.includes('8b')) return 32000
  if (lower.includes('7b')) return 32000
  if (lower.includes('4b')) return 8000
  return 32000
}

export const NVIDIA_FREE_MODELS: NvidiaModel[] = [
  { id: 'meta/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', description: 'Meta\'s latest instruct model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'meta/llama-3.1-70b-instruct', name: 'Llama 3.1 70B', description: 'Meta\'s 70B instruct model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'meta/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', description: 'Meta\'s efficient 8B model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'meta/llama-4-scout-17b-16e-instruct', name: 'Llama 4 Scout 17B', description: 'Meta\'s Llama 4 MoE model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'meta/llama-4-maverick-17b-128e-instruct-fp8', name: 'Llama 4 Maverick 17B', description: 'Meta\'s Llama 4 large MoE', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'nvidia/llama-3.1-nemotron-70b-instruct', name: 'Nemotron 70B', description: 'NVIDIA-optimized 70B model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'nvidia/nemotron-4-340b-instruct', name: 'Nemotron 340B', description: 'NVIDIA\'s massive 340B model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'nvidia/nemotron-nano-9b-v2', name: 'Nemotron Nano 9B', description: 'NVIDIA\'s compact model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'google/gemma-4-31b-it', name: 'Gemma 4 31B', description: 'Google\'s latest open model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'google/gemma-3-27b-it', name: 'Gemma 3 27B', description: 'Google\'s 27B model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'google/gemma-3-12b-it', name: 'Gemma 3 12B', description: 'Google\'s mid-size model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'google/gemma-3-4b-it', name: 'Gemma 3 4B', description: 'Google\'s compact model', contextLength: 8000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'mistralai/mistral-large-2', name: 'Mistral Large 2', description: 'Mistral\'s flagship model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'reasoning' },
  { id: 'mistralai/mistral-small-3.1-24b-instruct', name: 'Mistral Small 3.1', description: 'Mistral\'s efficient model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'mistralai/codestral-2501', name: 'Codestral 2501', description: 'Mistral\'s coding model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'coding' },
  { id: 'mistralai/mixtral-8x22b-instruct-v0.1', name: 'Mixtral 8x22B', description: 'Mistral\'s MoE model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'mistralai/mixtral-8x7b-instruct-v0.1', name: 'Mixtral 8x7B', description: 'Mistral\'s efficient MoE', contextLength: 32000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'deepseek-ai/deepseek-v3.2', name: 'DeepSeek V3.2', description: 'DeepSeek\'s latest chat model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'reasoning' },
  { id: 'deepseek-ai/deepseek-r1', name: 'DeepSeek R1', description: 'DeepSeek reasoning model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'reasoning' },
  { id: 'qwen/qwen-3-235b-a22b', name: 'Qwen 3 235B', description: 'Alibaba\'s massive MoE model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'reasoning' },
  { id: 'qwen/qwen-3-32b', name: 'Qwen 3 32B', description: 'Alibaba\'s 32B model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'reasoning' },
  { id: 'qwen/qwen-2.5-72b-instruct', name: 'Qwen 2.5 72B', description: 'Alibaba\'s 72B model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'qwen/qwen2.5-coder-32b-instruct', name: 'Qwen 2.5 Coder 32B', description: 'Alibaba\'s coding model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'coding' },
  { id: 'z-ai/glm-5.1', name: 'GLM 5.1', description: 'Zhipu\'s flagship model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'reasoning' },
  { id: 'z-ai/glm-4-plus', name: 'GLM 4 Plus', description: 'Zhipu\'s enhanced model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'moonshotai/kimi-k2.5', name: 'Kimi K2.5', description: 'Moonshot\'s long-context model', contextLength: 256000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'reasoning' },
  { id: 'minimax/minimax-m2.7', name: 'MiniMax M2.7', description: 'MiniMax\'s 230B MoE model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'reasoning' },
  { id: 'minimax/minimax-m1-80k', name: 'MiniMax M1', description: 'MiniMax\'s long-context model', contextLength: 80000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'microsoft/phi-4', name: 'Phi-4', description: 'Microsoft\'s compact model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'microsoft/phi-3.5-moe-instruct', name: 'Phi 3.5 MoE', description: 'Microsoft\'s MoE model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'microsoft/phi-3-mini-128k-instruct', name: 'Phi 3 Mini', description: 'Microsoft\'s small model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'microsoft/phi-3-medium-128k-instruct', name: 'Phi 3 Medium', description: 'Microsoft\'s medium model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'openai/gpt-oss-120b', name: 'GPT-OSS 120B', description: 'OpenAI\'s open 120B model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'openai/gpt-oss-20b', name: 'GPT-OSS 20B', description: 'OpenAI\'s open 20B model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'snowflake/arctic2', name: 'Snowflake Arctic 2', description: 'Snowflake\'s enterprise model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'ibm/granite-4.0-tiny-preview', name: 'Granite 4.0 Tiny', description: 'IBM\'s compact model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'sarvam-ai/sarvam-m', name: 'Sarvam M', description: 'India-focused multilingual model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'writer/palmyra-creative-122b', name: 'Palmyra Creative 122B', description: 'Writer\'s creative model', contextLength: 128000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'writer/palmyra-med-70b-32k', name: 'Palmyra Med 70B', description: 'Writer\'s medical model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
  { id: 'aisingapore/sea-lion-7b-instruct', name: 'SeaLion 7B', description: 'Southeast Asian language model', contextLength: 32000, isFree: true, modality: ['text'], provider: 'nvidia', category: 'general' },
]

export async function getNvidiaModels(): Promise<NvidiaModel[]> {
  if (!API_KEY) return NVIDIA_FREE_MODELS
  
  try {
    const response = await axios.get(`${NVIDIA_API}/models`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    })

    const apiModels = response.data.data || []
    const textModels = apiModels.filter((m: any) => {
      const id = m.id || ''
      const lower = id.toLowerCase()
      return !lower.includes('embedding') && 
             !lower.includes('rerank') && 
             !lower.includes('image') && 
             !lower.includes('video') &&
             !lower.includes('speech') &&
             !lower.includes('asr') &&
             !lower.includes('tts') &&
             !lower.includes('vlp') &&
             !lower.includes('vlm') &&
             !lower.includes('guard') &&
             !lower.includes('safety')
    })

    return textModels.map((m: any) => ({
      id: m.id,
      name: getModelName(m.id),
      description: `NVIDIA NIM: ${getModelName(m.id)}`,
      contextLength: getContextLength(m.id),
      isFree: true,
      modality: ['text'],
      provider: 'nvidia' as const,
      category: categorizeModel(m.id),
    }))
  } catch (error) {
    console.error('Error fetching NVIDIA models:', error)
    return NVIDIA_FREE_MODELS
  }
}

export async function nvidiaChat(model: string, messages: Array<{role: string, content: string}>, temperature?: number, maxTokens?: number) {
  if (!API_KEY) throw new Error('NVIDIA API key not configured')
  
  const response = await axios.post(
    `${NVIDIA_API}/chat/completions`,
    {
      model,
      messages,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 2048
    },
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    }
  )
  
  return response.data.choices[0].message.content
}

export async function nvidiaChatStream(model: string, messages: Array<{role: string, content: string}>, onToken: (token: string) => void, onComplete: (usage: any) => void, temperature?: number, maxTokens?: number) {
  if (!API_KEY) throw new Error('NVIDIA API key not configured')
  
  const response = await axios.post(
    `${NVIDIA_API}/chat/completions`,
    {
      model,
      messages,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 2048,
      stream: true
    },
    {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      responseType: 'stream',
      timeout: 60000
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
