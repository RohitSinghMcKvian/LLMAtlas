import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Compare multiple models
router.post('/compare', async (req, res) => {
  try {
    const { modelIds, benchmarks: benchmarkIds } = req.body
    
    if (!modelIds || modelIds.length < 2) {
      return res.status(400).json({ error: 'At least 2 models required' })
    }

    const models = await prisma.model.findMany({
      where: { id: { in: modelIds } }
    })

    let scores: any[] = []
    if (benchmarkIds && benchmarkIds.length > 0) {
      scores = await prisma.benchmarkScore.findMany({
        where: {
          modelId: { in: modelIds },
          benchmarkId: { in: benchmarkIds }
        },
        include: { benchmark: true }
      })
    } else {
      // Default benchmarks for comparison
      const defaultBenchmarks = ['mmlu', 'humaneval', 'math-500', 'mt-bench']
      scores = await prisma.benchmarkScore.findMany({
        where: {
          modelId: { in: modelIds },
          benchmarkId: { in: defaultBenchmarks }
        },
        include: { benchmark: true }
      })
    }

    // Calculate composite scores per model (simple average)
    const composite: Record<string, number> = {}
    modelIds.forEach(id => {
      const modelScores = scores.filter(s => s.modelId === id)
      if (modelScores.length > 0) {
        const avg = modelScores.reduce((sum, s) => sum + s.score, 0) / modelScores.length
        composite[id] = Number(avg.toFixed(2))
      } else {
        composite[id] = 0
      }
    })

    res.json({
      models,
      scores,
      composite
    })
  } catch (error) {
    console.error('Error comparing models:', error)
    res.status(500).json({ error: 'Failed to compare models' })
  }
})

// Get use case recommendations
router.post('/recommend', async (req, res) => {
  try {
    const { useCase, weights } = req.body
    
    // Simple weighted scoring based on model characteristics
    const models = await prisma.model.findMany({
      where: { status: 'Available' }
    })

    // Score each model based on use case weights
    const scored = models.map(model => {
      let score = 0
      
      // Weight factors
      if (weights?.speed) score += model.contextWindow > 100000 ? 30 : 10
      if (weights?.cost) score += model.isOpenSource ? 40 : 20
      if (weights?.reasoning) score += model.strengths?.some(s => s.toLowerCase().includes('reason')) ? 50 : 20
      if (weights?.coding) score += model.strengths?.some(s => s.toLowerCase().includes('code')) ? 50 : 20
      if (weights?.context) score += model.contextWindow > 100000 ? 50 : 20
      if (weights?.multimodal) score += model.modalitiesInput?.length > 1 ? 50 : 20

      return { ...model, recommendationScore: score }
    })

    // Sort and return top 5
    scored.sort((a, b) => b.recommendationScore - a.recommendationScore)
    
    res.json(scored.slice(0, 5))
  } catch (error) {
    console.error('Error getting recommendations:', error)
    res.status(500).json({ error: 'Failed to get recommendations' })
  }
})

export default router