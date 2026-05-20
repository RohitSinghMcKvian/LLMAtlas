import { Request, Response, NextFunction } from 'express'
import { verifyToken, AuthUser, getUserById } from '../services/auth.service'

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    const user = await getUserById(decoded.userId)
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')
  
  if (!token) {
    return next()
  }

  verifyToken(token)
    .then(decoded => {
      if (decoded) {
        return getUserById(decoded.userId).then(user => {
          if (user) req.user = user
          next()
        })
      }
      next()
    })
    .catch(() => next())
}
