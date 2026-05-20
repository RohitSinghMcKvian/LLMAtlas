import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { PrismaClient } from '@prisma/client'
import modelsRouter from './routes/models.js'
import benchmarksRouter from './routes/benchmarks.js'
import newsRouter from './routes/news.js'
import comparisonRouter from './routes/comparison.js'
import playgroundRouter from './routes/playground.js'
import authRouter from './routes/auth.js'
import conversationsRouter from './routes/conversations.js'
import { createSyncRouter } from './routes/sync.js'
import { createLeaderboardRouter } from './routes/leaderboard.js'
import semanticSearchRouter from './routes/semantic-search.js'
import { startSyncScheduler } from './services/sync-scheduler.js'

const app = express()
const prisma = new PrismaClient()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser())

// Auth routes
app.use('/api/auth', authRouter)
app.use('/api/conversations', conversationsRouter)

// Routes
app.use('/api/models', modelsRouter)
app.use('/api/benchmarks', benchmarksRouter)
app.use('/api/news', newsRouter)
app.use('/api/comparison', comparisonRouter)
app.use('/api/playground', playgroundRouter)
app.use('/api/sync', createSyncRouter(prisma))
app.use('/api/leaderboard', createLeaderboardRouter(prisma))
app.use('/api/semantic-search', semanticSearchRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const PORT = process.env.PORT || 3001

// Start sync scheduler
startSyncScheduler(prisma)

app.listen(PORT, () => {
  console.log(`LLMAtlas API running on port ${PORT}`)
})

export default app
