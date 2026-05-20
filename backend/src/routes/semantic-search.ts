import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

console.log('Semantic search router loaded')

router.get('/test', (req, res) => {
  res.json({ message: 'Semantic search is working' })
})

const CAPABILITY_KEYWORDS: Record<string, string[]> = {
  vision: ['vision', 'image', 'picture', 'photo', 'see', 'visual', 'multimodal', 'multimodality'],
  audio: ['audio', 'sound', 'voice', 'speech', 'hear', 'listen', 'music'],
  video: ['video', 'movie', 'film', 'motion'],
  coding: ['code', 'programming', 'developer', 'software', 'python', 'javascript', 'coding', 'debug'],
  reasoning: ['reason', 'logic', 'think', 'analyze', 'math', 'calculation', 'problem-solving'],
  longContext: ['long context', 'large context', '100k', '200k', '1m', 'million', 'extended'],
  fast: ['fast', 'quick', 'speed', 'instant', 'real-time', 'low latency'],
  creative: ['creative', 'writing', 'story', 'poem', 'art', 'generate'],
  translation: ['translate', 'language', 'multilingual', 'french', 'spanish', 'chinese', 'japanese'],
  chat: ['chat', 'conversation', 'dialogue', 'assistant', 'helpful'],
}

const PARAMETER_RANGES: Record<string, { min: number; max: number }> = {
  small: { min: 0, max: 10 },
  medium: { min: 10, max: 70 },
  large: { min: 70, max: 200 },
  xl: { min: 200, max: 1000 },
}

router.post('/', async (req: Request, res: Response) => {
  try {
    const { query } = req.body

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query is required' })
    }

    const lowerQuery = query.toLowerCase()
    const extractedCriteria: {
      capabilities: string[]
      parameterRange?: { min: number; max: number }
      keywords: string[]
      status?: string
      license?: string
    } = {
      capabilities: [],
      keywords: [],
    }

    for (const [capability, keywords] of Object.entries(CAPABILITY_KEYWORDS)) {
      if (keywords.some(kw => lowerQuery.includes(kw))) {
        extractedCriteria.capabilities.push(capability)
      }
    }

    for (const [range, bounds] of Object.entries(PARAMETER_RANGES)) {
      if (lowerQuery.includes(range) || lowerQuery.includes(`${range} model`)) {
        extractedCriteria.parameterRange = bounds
        break
      }
    }

    const sizeKeywords = ['small', 'medium', 'large', 'xl', 'tiny', 'mini', 'huge']
    for (const kw of sizeKeywords) {
      if (lowerQuery.includes(kw) && !extractedCriteria.parameterRange) {
        const paramBounds = PARAMETER_RANGES[kw]
        if (paramBounds) {
          extractedCriteria.parameterRange = paramBounds
        }
      }
    }

    const statusKeywords = ['beta', 'available', 'released', 'announced', 'upcoming', 'research']
    for (const kw of statusKeywords) {
      if (lowerQuery.includes(kw)) {
        extractedCriteria.status = kw.charAt(0).toUpperCase() + kw.slice(1)
        if (kw === 'research') extractedCriteria.status = 'Research Preview'
        if (kw === 'released') extractedCriteria.status = 'Available'
        if (kw === 'upcoming') extractedCriteria.status = 'Announced'
        break
      }
    }

    const licenseKeywords = ['open source', 'open-source', 'open', 'apache', 'mit', 'commercial', 'proprietary', 'free']
    for (const kw of licenseKeywords) {
      if (lowerQuery.includes(kw)) {
        extractedCriteria.license = kw.includes('open') ? 'Open' : kw.includes('apache') ? 'Apache 2.0' : kw.includes('mit') ? 'MIT' : kw.includes('commercial') ? 'Commercial' : 'Proprietary'
        break
      }
    }

    const stopWords = ['i', 'want', 'need', 'looking', 'for', 'a', 'an', 'the', 'best', 'good', 'great', 'top', 'find', 'show', 'me', 'models', 'model', 'which', 'what', 'can', 'do', 'does', 'have', 'has', 'with', 'that', 'this', 'is', 'are', 'be', 'to', 'and', 'or', 'but', 'in', 'on', 'at', 'by', 'from', 'of']
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w))
    extractedCriteria.keywords = queryWords

    const allModels = await prisma.model.findMany()

    const scoredModels = allModels.map(model => {
      let score = 0
      const modelName = model.name.toLowerCase()
      const modelDesc = (model.description || '').toLowerCase()
      const modelOrg = model.organization.toLowerCase()
      
      let modelModalities: string[] = []
      try {
        modelModalities = JSON.parse(model.modalitiesInput || '[]').map((m: string) => m.toLowerCase())
      } catch {
        modelModalities = []
      }

      for (const kw of extractedCriteria.keywords) {
        if (modelName.includes(kw)) score += 10
        if (modelDesc.includes(kw)) score += 5
        if (modelOrg.includes(kw)) score += 3
      }

      for (const cap of extractedCriteria.capabilities) {
        if (modelModalities.includes(cap)) score += 15
        if (modelDesc.includes(cap)) score += 8
      }

      if (extractedCriteria.parameterRange) {
        const paramStr = model.parameters || '0'
        const paramNum = parseFloat(paramStr.replace(/[^0-9.]/g, ''))
        const { min, max } = extractedCriteria.parameterRange
        if (paramNum >= min && paramNum <= max) {
          score += 20
        } else if (Math.abs(paramNum - (min + max) / 2) < (max - min) / 2) {
          score += 10
        }
      }

      if (extractedCriteria.status && model.status === extractedCriteria.status) {
        score += 15
      }

      if (extractedCriteria.license && model.license === extractedCriteria.license) {
        score += 15
      }

      if (lowerQuery.includes('best') || lowerQuery.includes('top')) {
        if (model.status === 'Available') score += 5
        if (model.isOpenSource) score += 5
      }

      return { model, score }
    })

    const filtered = scoredModels
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(({ model }) => model)

    res.json({
      models: filtered,
      criteria: extractedCriteria,
      totalMatches: filtered.length,
    })
  } catch (error) {
    console.error('Semantic search error:', error)
    res.status(500).json({ error: 'Failed to perform semantic search' })
  }
})

export default router
