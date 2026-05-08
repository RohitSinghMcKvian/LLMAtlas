export type NewsTag =
  | 'New Model'
  | 'Benchmark'
  | 'Research'
  | 'Fine-tuning'
  | 'Safety'
  | 'Regulation'
  | 'Product Launch'
  | 'Tutorial'
  | 'Community'
  | 'Security'
  | 'Partnership'
  | 'Update'
  | 'Industry'
  | 'Market'
  | 'Developer'
  | 'Deprecation'
  | 'Product Update'
  | 'Analysis'

export type NewsSource =
  | 'arXiv'
  | 'Anthropic Blog'
  | 'OpenAI Blog'
  | 'OpenAI'
  | 'Google DeepMind'
  | 'Google AI'
  | 'Meta AI'
  | 'Mistral'
  | 'Cohere'
  | 'Hugging Face'
  | 'GitHub Trending'
  | 'The Gradient'
  | 'The Verge'
  | 'Ahead of AI'
  | 'Interconnects'
  | 'DeepSeek Blog'
  | 'Alibaba AI'
  | 'xAI'
  | 'ByteDance Seed'
  | 'TechCrunch'
  | 'Variety'
  | 'Microsoft'
  | 'LLM Rumors'
  | 'Build Fast With AI'
  | 'A2A Protocol'
  | 'ClaudeFA'
  | 'fal.ai'
  | 'Anthropic'
  | 'Claude Docs'
  | 'GitHub'
  | 'OpenAI Developers'

export interface NewsItem {
  id: string
  title: string
  source: NewsSource
  date: string
  summary: string
  tags: NewsTag[]
  url: string
  isBreaking: boolean
  thumbnail?: string
}