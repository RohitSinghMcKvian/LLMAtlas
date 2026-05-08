import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Get all benchmarks with filtering
router.get('/', async (req, res) => {
  try {
    const { category } = req.query
    
    const where: any = {}
    if (category && category !== 'All') where.category = category

    const benchmarks = await prisma.benchmark.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        scores: {
          orderBy: { score: 'desc' },
          take: 10,
          include: { model: true }
        }
      }
    })

    res.json(benchmarks)
  } catch (error) {
    console.error('Error fetching benchmarks:', error)
    res.status(500).json({ error: 'Failed to fetch benchmarks' })
  }
})

// Get single benchmark by ID
router.get('/:id', async (req, res) => {
  try {
    const benchmark = await prisma.benchmark.findUnique({
      where: { id: req.params.id },
      include: {
        scores: {
          orderBy: { score: 'desc' },
          take: 50,
          include: { model: true }
        }
      }
    })

    if (!benchmark) {
      return res.status(404).json({ error: 'Benchmark not found' })
    }

    res.json(benchmark)
  } catch (error) {
    console.error('Error fetching benchmark:', error)
    res.status(500).json({ error: 'Failed to fetch benchmark' })
  }
})

// Get benchmark categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await prisma.benchmark.findMany({
      select: { category: true },
      distinct: ['category']
    })
    res.json(['All', ...categories.map(c => c.category)])
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

export default router