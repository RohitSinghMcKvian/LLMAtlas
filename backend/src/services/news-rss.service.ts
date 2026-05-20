import Parser from 'rss-parser'
import type { NewsItem } from '@prisma/client'

const parser = new Parser({
  customFields: {
    item: ['dc:creator', 'content:encoded']
  }
})

const DEFAULT_RSS_FEEDS = [
  'https://openai.com/blog/feed',
  'https://huggingface.co/blog/feed',
  'https://blog.google/technology/ai/rss/',
  'https://arxiv.org/rss/cs.AI',
  'https://arxiv.org/rss/cs.CL',
  'https://techcrunch.com/category/artificial-intelligence/feed/',
  'https://venturebeat.com/category/ai/feed/',
  'https://arstechnica.com/ai/feed/',
  'https://www.wired.com/feed/tag/ai/latest/rss',
  'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
  'https://www.technologyreview.com/topic/artificial-intelligence/feed/',
  'https://ai.meta.com/blog/rss/',
  'https://anthropic.com/research/feed',
  'https://deepmind.google/blog/rss.xml',
]

const RSS_FEEDS = (process.env.RSS_FEED_URLS || '').split(',').filter(Boolean).length > 0
  ? (process.env.RSS_FEED_URLS || '').split(',').filter(Boolean)
  : DEFAULT_RSS_FEEDS

export interface RSSNewsItem {
  title: string
  link: string
  pubDate: string
  creator?: string
  contentSnippet?: string
  content?: string
  isoDate: string
}

export async function fetchRSSFeeds(): Promise<RSSNewsItem[]> {
  const allItems: RSSNewsItem[] = []
  
  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl.trim())
      const items = feed.items.slice(0, 20).map(item => ({
        title: item.title || '',
        link: item.link || '',
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        creator: item.creator || feed.title || 'Unknown',
        contentSnippet: item.contentSnippet || '',
        content: item.content || '',
        isoDate: item.isoDate || new Date().toISOString()
      }))
      allItems.push(...items)
    } catch (error) {
      console.error(`Error fetching RSS feed ${feedUrl}:`, error)
    }
  }
  
  return allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
}

export function normalizeRSSNews(item: RSSNewsItem): Omit<NewsItem, 'id' | 'fetchedAt'> {
  const tags = extractTags(item.title + ' ' + (item.contentSnippet || ''))
  
  return {
    title: item.title,
    summary: item.contentSnippet || item.title,
    url: item.link,
    source: item.creator || 'RSS Feed',
    sourceIcon: null,
    tags: JSON.stringify(tags),
    publishedAt: new Date(item.pubDate),
  }
}

function extractTags(text: string): string[] {
  const tags: string[] = []
  const lower = text.toLowerCase()
  
  if (lower.includes('model') || lower.includes('llm') || lower.includes('gpt') || lower.includes('claude')) {
    tags.push('New Model')
  }
  if (lower.includes('benchmark') || lower.includes('score') || lower.includes('eval')) {
    tags.push('Benchmark')
  }
  if (lower.includes('research') || lower.includes('paper') || lower.includes('study')) {
    tags.push('Research')
  }
  if (lower.includes('security') || lower.includes('vulnerability') || lower.includes('attack')) {
    tags.push('Security')
  }
  if (lower.includes('release') || lower.includes('launch') || lower.includes('announce')) {
    tags.push('Product Launch')
  }
  if (lower.includes('update') || lower.includes('version') || lower.includes('upgrade')) {
    tags.push('Update')
  }
  
  return tags.length > 0 ? tags : ['Industry']
}
