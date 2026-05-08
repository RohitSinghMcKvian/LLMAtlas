import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Get all news with filtering
router.get('/', async (req, res) => {
  try {
    const { tag, source, from, to } = req.query
    
    const where: any = {}
    
    if (tag) where.tags = { has: tag as string }
    if (source) where.source = source as string
    if (from || to) {
      where.publishedAt = {}
      if (from) where.publishedAt.gte = new Date(from as string)
      if (to) where.publishedAt.lte = new Date(to as string)
    }

    const news = await prisma.newsItem.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: 50
    })

    res.json(news)
  } catch (error) {
    console.error('Error fetching news:', error)
    res.status(500).json({ error: 'Failed to fetch news' })
  }
})

// Get available tags
router.get('/meta/tags', async (req, res) => {
  try {
    const newsItems = await prisma.newsItem.findMany({
      select: { tags: true }
    })
    
    const allTags = new Set<string>()
    newsItems.forEach(n => n.tags.forEach(t => allTags.add(t)))
    
    res.json(Array.from(allTags))
  } catch (error) {
    console.error('Error fetching tags:', error)
    res.status(500).json({ error: 'Failed to fetch tags' })
  }
})

export default router