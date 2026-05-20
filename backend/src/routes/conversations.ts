import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const limit = parseInt(req.query.limit as string) || 20
    const search = req.query.search as string

    const where: any = { userId }
    if (search) {
      where.title = { contains: search }
    }

    const conversations = await prisma.conversation.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: {
        _count: { select: { messages: true } }
      }
    })

    res.json({
      conversations: conversations.map(c => ({
        id: c.id,
        title: c.title,
        models: JSON.parse(c.models),
        messageCount: c._count.messages,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      }))
    })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    res.status(500).json({ error: 'Failed to fetch conversations' })
  }
})

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    const conversation = await prisma.conversation.findFirst({
      where: { id, userId },
      include: {
        messages: { orderBy: { order: 'asc' } }
      }
    })

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    res.json({
      conversation: {
        id: conversation.id,
        title: conversation.title,
        models: JSON.parse(conversation.models),
        messages: conversation.messages.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          modelId: m.modelId,
          order: m.order,
        })),
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      }
    })
  } catch (error) {
    console.error('Error fetching conversation:', error)
    res.status(500).json({ error: 'Failed to fetch conversation' })
  }
})

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const { title, models, messages } = req.body

    if (!title || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Title and messages are required' })
    }

    const conversation = await prisma.conversation.create({
      data: {
        userId,
        title: title.slice(0, 100),
        models: JSON.stringify(models || []),
        messages: {
          create: messages.map((m: any, i: number) => ({
            role: m.role,
            content: m.content,
            modelId: m.modelId || null,
            order: i,
          }))
        }
      },
      include: { messages: true }
    })

    res.status(201).json({
      conversation: {
        id: conversation.id,
        title: conversation.title,
        models: JSON.parse(conversation.models),
        messages: conversation.messages.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          modelId: m.modelId,
          order: m.order,
        })),
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      }
    })
  } catch (error) {
    console.error('Error creating conversation:', error)
    res.status(500).json({ error: 'Failed to create conversation' })
  }
})

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const { id } = req.params
    const { title, models, messages } = req.body

    const existing = await prisma.conversation.findFirst({
      where: { id, userId }
    })

    if (!existing) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    await prisma.$transaction(async (tx) => {
      await tx.conversation.update({
        where: { id },
        data: {
          title: title ? title.slice(0, 100) : undefined,
          models: models ? JSON.stringify(models) : undefined,
        }
      })

      if (messages && Array.isArray(messages)) {
        await tx.message.deleteMany({ where: { conversationId: id } })
        await tx.message.createMany({
          data: messages.map((m: any, i: number) => ({
            conversationId: id,
            role: m.role,
            content: m.content,
            modelId: m.modelId || null,
            order: i,
          }))
        })
      }
    })

    const updated = await prisma.conversation.findUnique({
      where: { id },
      include: { messages: { orderBy: { order: 'asc' } } }
    })

    res.json({
      conversation: {
        id: updated!.id,
        title: updated!.title,
        models: JSON.parse(updated!.models),
        messages: updated!.messages.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          modelId: m.modelId,
          order: m.order,
        })),
        createdAt: updated!.createdAt,
        updatedAt: updated!.updatedAt,
      }
    })
  } catch (error) {
    console.error('Error updating conversation:', error)
    res.status(500).json({ error: 'Failed to update conversation' })
  }
})

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id
    const { id } = req.params

    const existing = await prisma.conversation.findFirst({
      where: { id, userId }
    })

    if (!existing) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    await prisma.conversation.delete({ where: { id } })

    res.json({ message: 'Conversation deleted' })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    res.status(500).json({ error: 'Failed to delete conversation' })
  }
})

export default router
