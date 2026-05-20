import { Router, Request, Response } from 'express'
import { register, login, getUserById } from '../services/auth.service'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    const result = await register({ email, password, name })
    
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({ user: result.user })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const result = await login({ email, password })
    
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({ user: result.user })
  } catch (error: any) {
    res.status(401).json({ error: error.message })
  }
})

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out successfully' })
})

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }
    res.json({ user: req.user })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

export default router
