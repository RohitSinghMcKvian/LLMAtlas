import { Router } from 'express'
import { syncAll } from '../services/sync-scheduler'

export function createSyncRouter(prisma: any) {
  const router = Router()

  router.post('/models', async (req, res) => {
    try {
      const result = await syncAll()
      res.json(result)
    } catch (error) {
      console.error('Sync error:', error)
      res.status(500).json({ error: 'Sync failed' })
    }
  })

  router.get('/status', async (req, res) => {
    try {
      const lastSync = await prisma.syncLog.findFirst({
        orderBy: { ranAt: 'desc' }
      })
      
      res.json({
        lastSync: lastSync || null,
        nextSync: 'Scheduled (daily at 2 AM)'
      })
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sync status' })
    }
  })

  return router
}
