import { Router, Request, Response } from 'express'
import { chatCompletion, chatCompletionStream, listAvailableModels, getFreeModels, createSession, getSession, addToSession } from '../services/playground.service'
import { GOOGLE_FREE_MODELS, googleAIChat, summarizeResponses } from '../services/google-ai.service'
import { GROQ_FREE_MODELS, groqChat } from '../services/groq.service'
import { CEREBRAS_FREE_MODELS, cerebrasChat } from '../services/cerebras.service'
import { MISTRAL_FREE_MODELS, mistralChat } from '../services/mistral.service'
import { CLOUDFLARE_FREE_MODELS, cloudflareChat } from '../services/cloudflare.service'
import { GITHUB_FREE_MODELS, githubModelsChat } from '../services/github-models.service'
import { NVIDIA_FREE_MODELS, getNvidiaModels, nvidiaChat } from '../services/nvidia-nim.service'

const router = Router()

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { model, messages, temperature, topP, maxTokens, systemPrompt } = req.body
    
    if (!model || !messages || messages.length === 0) {
      return res.status(400).json({ error: 'Model and messages are required' })
    }

    const result = await chatCompletion({
      model,
      messages,
      temperature,
      topP,
      maxTokens,
      systemPrompt
    })

    res.json(result)
  } catch (error: any) {
    console.error('Playground chat error:', error)
    res.status(500).json({ error: error.message || 'Failed to generate response' })
  }
})

router.post('/chat/stream', async (req: Request, res: Response) => {
  try {
    const { model, messages, temperature, topP, maxTokens, systemPrompt, attachments } = req.body
    
    if (!model || !messages || messages.length === 0) {
      return res.status(400).json({ error: 'Model and messages are required' })
    }

    if (attachments && attachments.length > 0) {
      const totalSize = attachments.reduce((sum: number, att: any) => sum + (att.base64?.length || 0), 0)
      if (totalSize > 50 * 1024 * 1024) {
        return res.status(400).json({ error: 'Total attachment size exceeds 50MB limit' })
      }
    }

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    let fullContent = ''
    let usage: any = null

    await chatCompletionStream({
      model,
      messages,
      temperature,
      topP,
      maxTokens,
      systemPrompt,
      attachments: attachments || []
    }, 
    (token: string) => {
      fullContent += token
      res.write(`data: ${JSON.stringify({ token, content: fullContent })}\n\n`)
    },
    (completionUsage: any) => {
      usage = completionUsage
    })

    res.write(`data: ${JSON.stringify({ done: true, content: fullContent, usage })}\n\n`)
    res.end()
  } catch (error: any) {
    console.error('Playground stream error:', error)
    res.write(`data: ${JSON.stringify({ error: error.message || 'Streaming failed' })}\n\n`)
    res.end()
  }
})

router.get('/models', async (req: Request, res: Response) => {
  try {
    const models = await listAvailableModels()
    res.json(models)
  } catch (error) {
    console.error('Playground models error:', error)
    res.status(500).json({ error: 'Failed to fetch models' })
  }
})

router.get('/free-models', async (req: Request, res: Response) => {
  try {
    const models = await getFreeModels()
    res.json(models)
  } catch (error) {
    console.error('Free models error:', error)
    res.status(500).json({ error: 'Failed to fetch free models' })
  }
})

router.get('/all-free-models', async (req: Request, res: Response) => {
  try {
    const [openrouter, google, groq, cerebras, mistral, cloudflare, github, nvidia] = await Promise.all([
      getFreeModels(),
      Promise.resolve(GOOGLE_FREE_MODELS),
      Promise.resolve(GROQ_FREE_MODELS),
      Promise.resolve(CEREBRAS_FREE_MODELS),
      Promise.resolve(MISTRAL_FREE_MODELS),
      Promise.resolve(CLOUDFLARE_FREE_MODELS),
      Promise.resolve(GITHUB_FREE_MODELS),
      getNvidiaModels()
    ])
    
    const allModels = [...openrouter, ...google, ...groq, ...cerebras, ...mistral, ...cloudflare, ...github, ...nvidia]
    res.json(allModels)
  } catch (error) {
    console.error('All free models error:', error)
    res.status(500).json({ error: 'Failed to fetch all free models' })
  }
})

router.get('/models/:provider', async (req: Request, res: Response) => {
  try {
    const provider = req.params.provider
    let models = []
    
    switch(provider) {
      case 'openrouter': models = await getFreeModels(); break
      case 'google': models = GOOGLE_FREE_MODELS; break
      case 'groq': models = GROQ_FREE_MODELS; break
      case 'cerebras': models = CEREBRAS_FREE_MODELS; break
      case 'mistral': models = MISTRAL_FREE_MODELS; break
      case 'cloudflare': models = CLOUDFLARE_FREE_MODELS; break
      case 'github': models = GITHUB_FREE_MODELS; break
      case 'nvidia': models = await getNvidiaModels(); break
      default: return res.status(400).json({ error: 'Unknown provider' })
    }
    
    res.json(models)
  } catch (error) {
    console.error('Provider models error:', error)
    res.status(500).json({ error: 'Failed to fetch provider models' })
  }
})

router.get('/providers', (req: Request, res: Response) => {
  res.json([
    { id: 'openrouter', name: 'OpenRouter', models: 11, description: 'Aggregated free models' },
    { id: 'google', name: 'Google AI Studio', models: 6, description: 'Gemini & Gemma models' },
    { id: 'groq', name: 'Groq', models: 4, description: 'LPU-accelerated inference' },
    { id: 'cerebras', name: 'Cerebras', models: 2, description: 'Wafer-scale AI chips' },
    { id: 'mistral', name: 'Mistral AI', models: 3, description: 'European AI leader' },
    { id: 'cloudflare', name: 'Cloudflare Workers AI', models: 5, description: 'Edge inference' },
    { id: 'github', name: 'GitHub Models', models: 10, description: 'Microsoft Azure hosted' },
    { id: 'nvidia', name: 'NVIDIA NIM', models: 40, description: '100+ optimized models on DGX Cloud' },
  ])
})

router.post('/chat/multi-provider', async (req: Request, res: Response) => {
  try {
    const { model, messages, provider, temperature, maxTokens } = req.body
    
    if (!model || !messages || messages.length === 0 || !provider) {
      return res.status(400).json({ error: 'Model, messages, and provider are required' })
    }

    let content = ''
    
    switch(provider) {
      case 'openrouter':
        const result = await chatCompletion({ model, messages, temperature, maxTokens })
        content = result.content
        break
      case 'google':
        content = await googleAIChat(model, messages, temperature, maxTokens)
        break
      case 'groq':
        content = await groqChat(model, messages, temperature, maxTokens)
        break
      case 'cerebras':
        content = await cerebrasChat(model, messages, temperature, maxTokens)
        break
      case 'mistral':
        content = await mistralChat(model, messages, temperature, maxTokens)
        break
      case 'cloudflare':
        content = await cloudflareChat(model, messages)
        break
      case 'github':
        content = await githubModelsChat(model, messages, temperature, maxTokens)
        break
      case 'nvidia':
        content = await nvidiaChat(model, messages, temperature, maxTokens)
        break
      default:
        return res.status(400).json({ error: 'Unknown provider' })
    }
    
    res.json({ content, model, provider })
  } catch (error: any) {
    console.error('Multi-provider chat error:', error)
    res.status(500).json({ error: error.message || 'Chat failed' })
  }
})

router.post('/sessions', (req: Request, res: Response) => {
  try {
    const sessionId = createSession()
    res.json({ sessionId })
  } catch (error) {
    console.error('Create session error:', error)
    res.status(500).json({ error: 'Failed to create session' })
  }
})

router.get('/sessions/:id', (req: Request, res: Response) => {
  try {
    const session = getSession(req.params.id)
    res.json({ messages: session })
  } catch (error) {
    console.error('Get session error:', error)
    res.status(500).json({ error: 'Failed to get session' })
  }
})

router.delete('/sessions/:id', (req: Request, res: Response) => {
  try {
    const { deleteSession } = require('../services/playground.service')
    deleteSession(req.params.id)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete session error:', error)
    res.status(500).json({ error: 'Failed to delete session' })
  }
})

router.post('/summarize', async (req: Request, res: Response) => {
  try {
    const { prompt, responses } = req.body
    
    if (!prompt || !responses || responses.length === 0) {
      return res.status(400).json({ error: 'Prompt and responses are required' })
    }

    const summary = await summarizeResponses(prompt, responses)
    res.json({ summary })
  } catch (error: any) {
    console.error('Summarize error:', error)
    res.status(500).json({ error: error.message || 'Failed to generate summary' })
  }
})

export default router
