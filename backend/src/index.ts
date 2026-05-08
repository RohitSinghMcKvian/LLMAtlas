import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import modelsRouter from './routes/models.js'
import benchmarksRouter from './routes/benchmarks.js'
import newsRouter from './routes/news.js'
import comparisonRouter from './routes/comparison.js'

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/models', modelsRouter)
app.use('/api/benchmarks', benchmarksRouter)
app.use('/api/news', newsRouter)
app.use('/api/comparison', comparisonRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`ContextWindow API running on port ${PORT}`)
})

export default app