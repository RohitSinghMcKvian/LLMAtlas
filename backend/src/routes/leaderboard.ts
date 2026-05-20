import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { fetchLMSYSLeaderboard, getLMSYSCategories, normalizeLMSYSToModelId } from '../services/lmsys.service'

export function createLeaderboardRouter(prisma: PrismaClient) {
  const router = Router()

  router.get('/', async (req, res) => {
    try {
      const { category } = req.query
      const cat = (category as string) || 'text'
      
      const entries = await prisma.leaderboardEntry.findMany({
        where: { category: cat },
        orderBy: { rank: 'asc' },
      })

      if (entries.length === 0) {
        const liveData = await fetchLMSYSLeaderboard(cat)
        res.json({
          category: cat,
          lastUpdated: new Date().toISOString(),
          source: 'LMSYS Chatbot Arena (live)',
          entries: liveData.map(e => ({
            rank: e.rank,
            model: e.model,
            modelId: normalizeLMSYSToModelId(e.model),
            arenaScore: e.arenaScore,
            ci95: e.ci95,
            votes: e.votes,
            organization: e.organization,
            license: e.license,
          }))
        })
      } else {
        const lastUpdated = entries[0]?.lastUpdated
        res.json({
          category: cat,
          lastUpdated: lastUpdated?.toISOString(),
          source: 'LMSYS Chatbot Arena (cached)',
          entries: entries.map(e => ({
            rank: e.rank,
            model: e.modelName,
            modelId: e.modelId,
            arenaScore: e.arenaScore,
            ci95: [e.ci95Lower, e.ci95Upper],
            votes: e.votes,
            organization: e.organization,
            license: e.license,
          }))
        })
      }
    } catch (error) {
      console.error('Leaderboard fetch error:', error)
      res.status(500).json({ error: 'Failed to fetch leaderboard' })
    }
  })

  router.get('/meta/categories', async (req, res) => {
    const cats = getLMSYSCategories()
    res.json(cats)
  })

  router.get('/meta/organizations', async (req, res) => {
    try {
      const orgs = await prisma.leaderboardEntry.groupBy({
        by: ['organization'],
        _avg: { arenaScore: true },
        _count: true,
        orderBy: { _avg: { arenaScore: 'desc' } },
      })
      res.json(orgs.map(o => ({
        organization: o.organization,
        avgScore: Math.round((o._avg.arenaScore || 0) * 10) / 10,
        modelCount: o._count,
      })))
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch organizations' })
    }
  })

  return router
}
