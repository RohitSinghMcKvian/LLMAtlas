import axios from 'axios'

const LMSYS_API_BASE = 'https://api.wulong.dev/arena-ai-leaderboards/v1'

export interface LMSYSLeaderboardEntry {
  rank: number
  model: string
  arenaScore: number
  ci95: [number, number]
  votes: number
  organization: string
  license: string
}

export interface LMSYSCategory {
  name: string
  label: string
  entries: LMSYSLeaderboardEntry[]
}

const CATEGORY_MAP: Record<string, string> = {
  text: 'text',
  code: 'code',
  vision: 'vision',
  search: 'search',
  document: 'document',
}

const CATEGORY_LABELS: Record<string, string> = {
  text: 'Overall',
  code: 'Coding',
  vision: 'Vision',
  search: 'Search',
  document: 'Document',
}

const ORG_EXTRACTORS = [
  { pattern: /anthropic|claude/i, org: 'Anthropic' },
  { pattern: /openai|gpt-|o[0-9]/i, org: 'OpenAI' },
  { pattern: /google|gemini/i, org: 'Google' },
  { pattern: /meta|llama/i, org: 'Meta' },
  { pattern: /mistral/i, org: 'Mistral AI' },
  { pattern: /deepseek/i, org: 'DeepSeek' },
  { pattern: /microsoft|phi/i, org: 'Microsoft' },
  { pattern: /amazon|nova/i, org: 'Amazon' },
  { pattern: /xai|grok/i, org: 'xAI' },
  { pattern: /cohere/i, org: 'Cohere' },
  { pattern: /alibaba|qwen/i, org: 'Alibaba' },
  { pattern: /moonshot|kimi/i, org: 'Moonshot AI' },
  { pattern: /sakana/i, org: 'Sakana AI' },
  { pattern: /bytedance|seed/i, org: 'ByteDance' },
  { pattern: /perplexity|sonar/i, org: 'Perplexity' },
  { pattern: /nvidia/i, org: 'Nvidia' },
  { pattern: /01\.ai|yi-/i, org: '01.AI' },
  { pattern: /minimax/i, org: 'MiniMax' },
  { pattern: /zhipu|glm/i, org: 'Zhipu AI' },
  { pattern: /databricks/i, org: 'Databricks' },
  { pattern: /reka/i, org: 'Reka AI' },
  { pattern: /upstage/i, org: 'Upstage' },
  { pattern: /snowflake/i, org: 'Snowflake' },
  { pattern: /writer/i, org: 'Writer' },
  { pattern: /stability/i, org: 'Stability AI' },
  { pattern: /inflection/i, org: 'Inflection AI' },
  { pattern: /salesforce/i, org: 'Salesforce' },
  { pattern: /apple/i, org: 'Apple' },
]

function extractOrganization(modelName: string): string {
  for (const { pattern, org } of ORG_EXTRACTORS) {
    if (pattern.test(modelName)) return org
  }
  return 'Unknown'
}

export async function fetchLMSYSLeaderboard(category: string = 'text'): Promise<LMSYSLeaderboardEntry[]> {
  try {
    const endpoint = `${LMSYS_API_BASE}/leaderboard?name=${CATEGORY_MAP[category] || 'text'}`
    const response = await axios.get(endpoint, { timeout: 15000 })
    
    const data = response.data
    if (!data) return []

    const models = data.models || data.entries || data
    
    if (!Array.isArray(models)) {
      if (data.models && Array.isArray(data.models)) {
        return parseModelsArray(data.models)
      }
      return []
    }

    return parseModelsArray(models)
  } catch (error) {
    console.error('Error fetching LMSYS leaderboard:', error)
    return []
  }
}

function parseModelsArray(models: any[]): LMSYSLeaderboardEntry[] {
  return models.map((entry: any, index: number) => {
    const modelName = entry.model || entry.name || 'Unknown'
    const score = entry.score || entry.rating || entry.arenaScore || 1000
    const ci = entry.ci || entry.confidenceInterval || 5
    const votes = entry.votes || entry.samples || 0
    const vendor = entry.vendor || entry.organization || entry.org || 'Unknown'
    const license = entry.license || 'Unknown'

    return {
      rank: entry.rank || index + 1,
      model: modelName,
      arenaScore: Math.round(score * 10) / 10,
      ci95: [
        Math.round((score - ci) * 10) / 10,
        Math.round((score + ci) * 10) / 10
      ],
      votes,
      organization: extractOrganizationFromVendor(vendor, modelName),
      license: license === 'open' ? 'Open Source' : (license === 'proprietary' ? 'Proprietary' : license),
    }
  })
}

function extractOrganizationFromVendor(vendor: string, modelName: string): string {
  if (vendor && vendor !== 'Unknown') return vendor
  
  return extractOrganization(modelName)
}

export async function fetchAllLMSYSCategories(): Promise<LMSYSCategory[]> {
  const categories = Object.keys(CATEGORY_MAP)
  const results: LMSYSCategory[] = []

  for (const cat of categories) {
    try {
      const entries = await fetchLMSYSLeaderboard(cat)
      if (entries.length > 0) {
        results.push({
          name: cat,
          label: CATEGORY_LABELS[cat] || cat,
          entries,
        })
      }
    } catch (error) {
      console.error(`Error fetching LMSYS category ${cat}:`, error)
    }
  }

  return results
}

export function getLMSYSCategories(): string[] {
  return Object.keys(CATEGORY_MAP)
}

export function getLMSYSCategoryLabels(): Record<string, string> {
  return CATEGORY_LABELS
}

export function normalizeLMSYSToModelId(modelName: string): string {
  const lower = modelName.toLowerCase()
  
  const mappings = [
    { pattern: /claude.*opus.*4\.7/i, id: 'opus-4-7' },
    { pattern: /claude.*sonnet.*4\.5/i, id: 'claude-sonnet-4-5' },
    { pattern: /claude.*sonnet.*3\.7/i, id: 'claude-3-7-sonnet' },
    { pattern: /claude.*sonnet.*3\.5/i, id: 'claude-3-5-sonnet' },
    { pattern: /claude.*opus/i, id: 'claude-3-opus' },
    { pattern: /claude.*haiku/i, id: 'claude-3-haiku' },
    { pattern: /gpt-5\.5/i, id: 'gpt-5.5' },
    { pattern: /gpt-5\.4/i, id: 'gpt-5-4' },
    { pattern: /gpt-5/i, id: 'gpt-5' },
    { pattern: /gpt-4o/i, id: 'gpt-4o-2025' },
    { pattern: /gpt-4\.5/i, id: 'gpt-4-5' },
    { pattern: /gpt-4.*turbo/i, id: 'gpt-4-turbo' },
    { pattern: /o3/i, id: 'o3' },
    { pattern: /o1/i, id: 'o1' },
    { pattern: /o4.*mini/i, id: 'o4-mini' },
    { pattern: /gemini.*3\.1.*pro/i, id: 'gemini-3-1-pro' },
    { pattern: /gemini.*3\.1.*flash/i, id: 'gemini-3-1-flash' },
    { pattern: /gemini.*3.*pro/i, id: 'gemini-3-pro' },
    { pattern: /gemini.*2\.5.*pro/i, id: 'gemini-2-5-pro' },
    { pattern: /gemini.*2\.0.*flash/i, id: 'gemini-2-flash' },
    { pattern: /gemini.*1\.5.*pro/i, id: 'gemini-1-5-pro' },
    { pattern: /llama.*5.*maverick/i, id: 'llama-5-maverick' },
    { pattern: /llama.*5.*scout/i, id: 'llama-5-scout' },
    { pattern: /llama.*4.*maverick/i, id: 'llama-4-maverick' },
    { pattern: /llama.*3\.3.*70b/i, id: 'llama-3-3-70b' },
    { pattern: /llama.*3\.1.*405b/i, id: 'llama-3-1-405b' },
    { pattern: /llama.*3\.1.*70b/i, id: 'llama-3-1-70b' },
    { pattern: /llama.*3\.1.*8b/i, id: 'llama-3-1-8b' },
    { pattern: /deepseek.*v4.*pro/i, id: 'deepseek-v4-pro' },
    { pattern: /deepseek.*v3/i, id: 'deepseek-v3' },
    { pattern: /deepseek.*r1/i, id: 'deepseek-r1' },
    { pattern: /qwen.*4/i, id: 'qwen-4' },
    { pattern: /qwen.*3.*235b/i, id: 'qwen-3-235b' },
    { pattern: /qwen.*3.*72b/i, id: 'qwen-3-72b' },
    { pattern: /qwen.*3.*32b/i, id: 'qwen-3-32b' },
    { pattern: /qwen.*3.*8b/i, id: 'qwen-3-8b' },
    { pattern: /qwen.*2\.5.*72b/i, id: 'qwen-2-5-72b' },
    { pattern: /mistral.*large.*3/i, id: 'mistral-large-3' },
    { pattern: /mistral.*small.*3/i, id: 'mistral-small-3' },
    { pattern: /codestral/i, id: 'codestral-2501' },
    { pattern: /gemma.*3.*27b/i, id: 'gemma-3-27b' },
    { pattern: /gemma.*2.*27b/i, id: 'gemma-2-27b' },
    { pattern: /phi.*4.*multimodal/i, id: 'phi-4-multimodal' },
    { pattern: /phi.*4/i, id: 'phi-4' },
    { pattern: /grok.*4/i, id: 'grok-4' },
    { pattern: /grok.*3/i, id: 'grok-3' },
    { pattern: /nova.*ultra/i, id: 'nova-ultra' },
    { pattern: /nova.*premier/i, id: 'nova-premier' },
    { pattern: /kimi.*k2/i, id: 'kimi-k2' },
    { pattern: /kimi.*k1\.5/i, id: 'kimik1-5' },
    { pattern: /codex/i, id: 'codex' },
    { pattern: /mythos/i, id: 'mythos' },
    { pattern: /sonar/i, id: 'sonar-reasoning' },
  ]

  for (const { pattern, id } of mappings) {
    if (pattern.test(lower)) return id
  }

  return lower.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}
