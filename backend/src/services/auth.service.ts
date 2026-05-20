import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'llmatlas-dev-secret-change-in-production'
const JWT_EXPIRES_IN = '7d'
const BCRYPT_ROUNDS = 12

export interface RegisterInput {
  email: string
  password: string
  name?: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
}

export async function register(input: RegisterInput): Promise<{ user: AuthUser; token: string }> {
  const existing = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } })
  if (existing) throw new Error('Email already registered')

  if (input.password.length < 6) throw new Error('Password must be at least 6 characters')

  const hashedPassword = await bcrypt.hash(input.password, BCRYPT_ROUNDS)

  const user = await prisma.user.create({
    data: {
      email: input.email.toLowerCase(),
      name: input.name || null,
      password: hashedPassword,
    }
  })

  const token = generateToken(user.id)

  return {
    user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
    token
  }
}

export async function login(input: LoginInput): Promise<{ user: AuthUser; token: string }> {
  const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } })
  if (!user) throw new Error('Invalid email or password')

  const valid = await bcrypt.compare(input.password, user.password)
  if (!valid) throw new Error('Invalid email or password')

  const token = generateToken(user.id)

  return {
    user: { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl },
    token
  }
}

export async function getUserById(userId: string): Promise<AuthUser | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return null
  return { id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl }
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}
