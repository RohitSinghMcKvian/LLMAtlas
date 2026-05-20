import axios from 'axios'
import type { NewsItem } from '@prisma/client'

const NEWSAPI = 'https://newsapi.org/v2'
const API_KEY = process.env.NEWSAPI_KEY || ''

export interface NewsAPIArticle {
  title: string
  description: string
  url: string
  source: {
    name: string
  }
  publishedAt: string
  content: string | null
}

export async function fetchNewsAPI(): Promise<NewsAPIArticle[]> {
  if (!API_KEY) {
    console.warn('NewsAPI key not configured')
    return []
  }

  try {
    const queries = [
      'artificial intelligence LLM model',
      'large language model release',
      'AI benchmark results',
      'OpenAI Anthropic Google AI'
    ]

    const results = await Promise.all(
      queries.map(q =>
        axios.get(`${NEWSAPI}/everything`, {
          params: {
            q,
            language: 'en',
            sortBy: 'publishedAt',
            pageSize: 10,
            apiKey: API_KEY
          }
        }).catch(() => ({ data: { articles: [] } }))
      )
    )

    const allArticles = results.flatMap(r => r.data.articles || [])
    
    return allArticles.filter(a => a.title && a.url).slice(0, 50)
  } catch (error) {
    console.error('Error fetching NewsAPI:', error)
    return []
  }
}

export function normalizeNewsAPI(article: NewsAPIArticle): Omit<NewsItem, 'id' | 'fetchedAt'> {
  const tags = extractNewsAPITags(article.title + ' ' + (article.description || ''))
  
  return {
    title: article.title,
    summary: article.description || article.title,
    url: article.url,
    source: article.source?.name || 'NewsAPI',
    sourceIcon: null,
    tags: JSON.stringify(tags),
    publishedAt: new Date(article.publishedAt),
  }
}

function extractNewsAPITags(text: string): string[] {
  const tags: string[] = []
  const lower = text.toLowerCase()
  
  if (lower.includes('openai') || lower.includes('gpt') || lower.includes('anthropic') || lower.includes('claude')) {
    tags.push('New Model')
  }
  if (lower.includes('benchmark') || lower.includes('performance')) {
    tags.push('Benchmark')
  }
  if (lower.includes('research') || lower.includes('study')) {
    tags.push('Research')
  }
  if (lower.includes('launch') || lower.includes('release')) {
    tags.push('Product Launch')
  }
  if (lower.includes('regulation') || lower.includes('policy') || lower.includes('law')) {
    tags.push('Regulation')
  }
  
  return tags.length > 0 ? tags : ['Industry']
}
