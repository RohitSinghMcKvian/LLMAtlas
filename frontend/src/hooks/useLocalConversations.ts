import { useState, useEffect, useCallback } from 'react'
import { type Attachment } from '@/lib/fileUtils'

export interface LocalChatMessage {
  role: 'user' | 'assistant'
  content: string
  model?: string
}

export interface LocalStreamState {
  isStreaming: boolean
  content: string
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
  error?: string
}

export interface LocalConversation {
  id: string
  title: string
  models: string[]
  messages: LocalChatMessage[]
  streamStates: Record<string, LocalStreamState>
  systemPrompt: string
  temperature: number
  topP: number
  maxTokens: number
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'llmatlas-conversations'
export const ACTIVE_CONV_KEY = 'llmatlas-active-conversation'
const MAX_CONVERSATIONS = 50

function getConversations(): LocalConversation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveConversations(conversations: LocalConversation[]): void {
  try {
    const trimmed = conversations.slice(-MAX_CONVERSATIONS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch (error) {
    console.error('Failed to save conversations to localStorage:', error)
  }
}

export function useLocalConversations() {
  const [conversations, setConversations] = useState<LocalConversation[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)

  useEffect(() => {
    setConversations(getConversations())
    setActiveConvId(localStorage.getItem(ACTIVE_CONV_KEY))
  }, [])

  const saveConversation = useCallback((conv: LocalConversation) => {
    setConversations(prev => {
      const existing = prev.findIndex(c => c.id === conv.id)
      let updated: LocalConversation[]
      if (existing >= 0) {
        updated = [...prev]
        updated[existing] = conv
      } else {
        updated = [...prev, conv]
      }
      saveConversations(updated)
      return updated
    })
  }, [])

  const loadConversation = useCallback((id: string): LocalConversation | null => {
    const conv = getConversations().find(c => c.id === id)
    if (conv) {
      setActiveConvId(id)
      localStorage.setItem(ACTIVE_CONV_KEY, id)
    }
    return conv || null
  }, [])

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== id)
      saveConversations(updated)
      return updated
    })
    if (activeConvId === id) {
      setActiveConvId(null)
      localStorage.removeItem(ACTIVE_CONV_KEY)
    }
  }, [activeConvId])

  const clearAll = useCallback(() => {
    setConversations([])
    setActiveConvId(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(ACTIVE_CONV_KEY)
  }, [])

  return {
    conversations,
    activeConvId,
    saveConversation,
    loadConversation,
    deleteConversation,
    clearAll,
  }
}

export function serializeConversation(params: {
  id: string
  title: string
  models: string[]
  messages: LocalChatMessage[]
  streamStates: Record<string, LocalStreamState>
  systemPrompt: string
  temperature: number
  topP: number
  maxTokens: number
}): LocalConversation {
  return {
    id: params.id,
    title: params.title,
    models: params.models,
    messages: params.messages,
    streamStates: params.streamStates,
    systemPrompt: params.systemPrompt,
    temperature: params.temperature,
    topP: params.topP,
    maxTokens: params.maxTokens,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
