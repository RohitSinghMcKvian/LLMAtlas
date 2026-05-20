import axios from 'axios'

const HF_API = 'https://huggingface.co/api'
const API_KEY = process.env.HUGGINGFACE_API_KEY || ''

export interface HFModelInfo {
  _id: string
  id: string
  modelId: string
  author: string
  sha: string
  lastModified: string
  private: boolean
  disabled: boolean
  gated: boolean | string
  pipeline_tag: string
  tags: string[]
  downloads: number
  likes: number
  library_name: string
  cardData: {
    language?: string[]
    license?: string
    datasets?: string[]
    metrics?: string[]
    base_model?: string
  }
  siblings: {
    rfilename: string
  }[]
  config: {
    architecutre?: string
    parameters?: number
  }
}

export async function searchHFModels(searchQuery: string): Promise<HFModelInfo[]> {
  try {
    const config: any = {
      params: {
        search: searchQuery,
        sort: 'downloads',
        direction: '-1',
        limit: 50,
        full: 'true'
      },
      timeout: 15000
    }
    const response = await axios.get(`${HF_API}/models`, config)
    return response.data || []
  } catch (error) {
    console.error('Error fetching HF models:', error)
    return []
  }
}

export async function getHFModelInfo(modelId: string): Promise<HFModelInfo | null> {
  try {
    const response = await axios.get(`${HF_API}/models/${modelId}`, {
      params: { full: 'true' },
      timeout: 15000
    })
    return response.data || null
  } catch (error) {
    console.error('Error fetching HF model info:', error)
    return null
  }
}

export function normalizeHFModel(hf: HFModelInfo) {
  return {
    hfDownloads: hf.downloads || 0,
    hfLikes: hf.likes || 0,
    hfTags: hf.tags || [],
    isOpenSource: !hf.private && !hf.gated,
    huggingfaceRepo: `https://huggingface.co/${hf.id}`,
    libraryName: hf.library_name || 'unknown',
    pipelineTag: hf.pipeline_tag || 'text-generation',
  }
}
