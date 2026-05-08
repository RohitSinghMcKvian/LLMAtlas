import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Get all models with filtering
router.get('/', async (req, res) => {
  try {
    const { license, status, org, search, sort, order } = req.query
    
    const where: any = {}
    
    if (license) where.license = license
    if (status) where.status = status
    if (org) where.organization = org as string
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { organization: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    let orderBy: any = { releaseDate: 'desc' }
    if (sort) {
      orderBy = { [sort as string]: order || 'desc' }
    }

    const models = await prisma.model.findMany({
      where,
      orderBy,
      include: {
        benchmarkScores: {
          take: 10,
          orderBy: { score: 'desc' },
          include: { benchmark: true }
        }
      }
    })

    res.json(models)
  } catch (error) {
    console.error('Error fetching models:', error)
    res.status(500).json({ error: 'Failed to fetch models' })
  }
})

// Get single model by ID
router.get('/:id', async (req, res) => {
  try {
    const model = await prisma.model.findUnique({
      where: { id: req.params.id },
      include: {
        benchmarkScores: {
          include: { benchmark: true }
        },
        versions: {
          orderBy: { releaseDate: 'desc' }
        }
      }
    })

    if (!model) {
      return res.status(404).json({ error: 'Model not found' })
    }

    res.json(model)
  } catch (error) {
    console.error('Error fetching model:', error)
    res.status(500).json({ error: 'Failed to fetch model' })
  }
})

// Get organizations
router.get('/meta/organizations', async (req, res) => {
  try {
    const orgs = await prisma.model.findMany({
      select: { organization: true },
      distinct: ['organization']
    })
    res.json(orgs.map(o => o.organization))
  } catch (error) {
    console.error('Error fetching organizations:', error)
    res.status(500).json({ error: 'Failed to fetch organizations' })
  }
})

export default router