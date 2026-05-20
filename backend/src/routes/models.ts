import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

function parseModelArrays(m: any) {
  return {
    ...m,
    modalitiesInput: (() => { try { return JSON.parse(m.modalitiesInput) } catch { return [] } })(),
    modalitiesOutput: (() => { try { return JSON.parse(m.modalitiesOutput) } catch { return [] } })(),
    strengths: (() => { try { return JSON.parse(m.strengths) } catch { return [] } })(),
    hfTags: (() => { try { return JSON.parse(m.hfTags) } catch { return [] } })(),
    quantizationFormats: (() => { try { return JSON.parse(m.quantizationFormats) } catch { return [] } })(),
  }
}

router.get('/', async (req, res) => {
  try {
    const { license, status, org, search, sort, order } = req.query
    
    const where: any = {}
    
    if (license) where.license = license
    if (status) where.status = status
    if (org) where.organization = org as string
    
    if (search) {
      const s = search as string
      where.OR = [
        { name: { contains: s } },
        { organization: { contains: s } },
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

    res.json(models.map(parseModelArrays))
  } catch (error) {
    console.error('Error fetching models:', error)
    res.status(500).json({ error: 'Failed to fetch models' })
  }
})

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

    res.json(parseModelArrays(model))
  } catch (error) {
    console.error('Error fetching model:', error)
    res.status(500).json({ error: 'Failed to fetch model' })
  }
})

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
