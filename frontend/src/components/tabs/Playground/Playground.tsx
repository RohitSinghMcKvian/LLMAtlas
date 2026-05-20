import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Loader2, Plus, Trash2, Settings2, Square, Sparkles, History, AlertTriangle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import api from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useLocalConversations, serializeConversation, ACTIVE_CONV_KEY } from '@/hooks/useLocalConversations'
import { usePlaygroundSettings } from '@/hooks/usePlaygroundSettings'
import PromptSuggestions from './PromptSuggestions'
import ModelPicker from './ModelPicker'
import ResponseCard from './ResponseCard'
import PromptInput from './PromptInput'
import SummaryCard from './SummaryCard'
import RecentChats from './RecentChats'
import {
  type Attachment,
  validateFile,
  fileToBase64,
  generateImageThumbnail,
  compressImage,
  isImageFile,
  formatFileSize,
  FILE_LIMITS,
  getModelCapabilities,
} from '@/lib/fileUtils'

interface FreeModel {
  id: string
  name: string
  description: string
  contextLength: number
  isFree: boolean
  provider?: string
  category?: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  model?: string
}

interface StreamState {
  isStreaming: boolean
  content: string
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }
  error?: string
}

interface SavedConversation {
  id: string
  title: string
  models: string[]
  messageCount: number
  createdAt: string
  updatedAt: string
}

export default function Playground() {
  const location = useLocation()
  const { user } = useAuth()
  const {
    conversations: localConversations,
    activeConvId,
    saveConversation: saveLocalConversation,
    loadConversation: loadLocalConversation,
    deleteConversation: deleteLocalConversation,
  } = useLocalConversations()
  const { maxModels, autoSave } = usePlaygroundSettings()
  const [freeModels, setFreeModels] = useState<FreeModel[]>([])
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [showModelPicker, setShowModelPicker] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streamStates, setStreamStates] = useState<Record<string, StreamState>>({})
  const [inputValue, setInputValue] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [temperature, setTemperature] = useState(0.7)
  const [topP, setTopP] = useState(0.9)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [showSettings, setShowSettings] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [summaryResponses, setSummaryResponses] = useState<Array<{ modelId: string; modelName: string; provider: string; content: string }>>([])
  const [showSummary, setShowSummary] = useState(false)
  const [showRecentChats, setShowRecentChats] = useState(false)
  const [currentConvId, setCurrentConvId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isProcessingFiles, setIsProcessingFiles] = useState(false)
  const [showAttachmentWarning, setShowAttachmentWarning] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllersRef = useRef<Record<string, AbortController>>({})
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialLoadRef = useRef(true)

  useEffect(() => {
    return () => {
      Object.values(abortControllersRef.current).forEach(c => c.abort())
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const loadModels = async () => {
      try {
        const models = await api.getAllFreeModels()
        setFreeModels(models)
      } catch (error) {
        console.error('Failed to load free models:', error)
      }
    }
    loadModels()
  }, [])

  useEffect(() => {
    if (activeConvId && messages.length === 0 && selectedModels.length === 0) {
      const local = loadLocalConversation(activeConvId)
      if (local) {
        setSelectedModels(local.models)
        setCurrentConvId(local.id)
        setMessages(local.messages)
        setStreamStates(local.streamStates)
        setSystemPrompt(local.systemPrompt)
        setTemperature(local.temperature)
        setTopP(local.topP)
        setMaxTokens(local.maxTokens)
      }
    }
  }, [])

  useEffect(() => {
    if (location.state?.scrollToSuggestions) {
      const el = document.getElementById('suggestions')
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 300)
      }
    }
  }, [location.state])

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false
      return
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const saveConversation = useCallback(async () => {
    if (!user || messages.length === 0 || selectedModels.length === 0) return
    if (Object.values(streamStates).some(s => s.isStreaming)) return

    setIsSaving(true)
    try {
      const title = messages.find(m => m.role === 'user')?.content.slice(0, 80) || 'Untitled Chat'
      const dbMessages = messages.flatMap(msg => {
        if (msg.role === 'user') {
          return [{ role: 'user', content: msg.content, modelId: null }]
        }
        const modelResponses = selectedModels
          .filter(mid => streamStates[mid]?.content)
          .map(mid => ({
            role: 'assistant',
            content: streamStates[mid].content,
            modelId: mid,
          }))
        return modelResponses.length > 0 ? modelResponses : [{ role: 'assistant', content: msg.content, modelId: msg.model || null }]
      })

      const convId = currentConvId || `local_${Date.now()}`
      
      const localConv = serializeConversation({
        id: convId,
        title,
        models: selectedModels,
        messages,
        streamStates,
        systemPrompt,
        temperature,
        topP,
        maxTokens,
      })
      saveLocalConversation(localConv)
      setCurrentConvId(convId)

      if (user) {
        if (currentConvId && !currentConvId.startsWith('local_')) {
          await api.updateConversation(currentConvId, {
            title,
            models: selectedModels,
            messages: dbMessages,
          })
        } else {
          const res = await api.createConversation({
            title,
            models: selectedModels,
            messages: dbMessages,
          })
          setCurrentConvId(res.conversation.id)
        }
      }
    } catch (error) {
      console.error('Failed to save conversation:', error)
    } finally {
      setIsSaving(false)
    }
  }, [user, messages, selectedModels, streamStates, currentConvId, systemPrompt, temperature, topP, maxTokens, saveLocalConversation])

  const saveConversationRef = useRef(saveConversation)
  saveConversationRef.current = saveConversation

  useEffect(() => {
    if (!user || messages.length === 0 || !autoSave) return
    
    const allDone = selectedModels.length > 0 && 
      selectedModels.every(modelId => {
        const state = streamStates[modelId]
        return state && !state.isStreaming
      })

    if (allDone) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        saveConversationRef.current()
      }, 1000)
    }
  }, [streamStates, user, messages.length, selectedModels, autoSave])

  useEffect(() => {
    if (Object.keys(streamStates).length === 0) return
    
    const allDone = selectedModels.length > 0 && 
      selectedModels.every(modelId => {
        const state = streamStates[modelId]
        return state && !state.isStreaming
      })
    
    if (allDone && !isStreaming) {
      const responses = selectedModels
        .filter(modelId => streamStates[modelId]?.content)
        .map(modelId => ({
          modelId,
          modelName: getModelName(modelId),
          provider: getModelProvider(modelId),
          content: streamStates[modelId].content
        }))
      
      setSummaryResponses(responses)
      setShowSummary(true)
    }
  }, [streamStates])

  const toggleModel = useCallback((modelId: string) => {
    setSelectedModels(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId)
      }
      if (prev.length >= maxModels) {
        return prev
      }
      return [...prev, modelId]
    })
  }, [maxModels])

  const handleSend = async () => {
    if (!inputValue.trim() && attachments.length === 0) return

    if (selectedModels.length === 0) {
      setShowModelPicker(true)
      return
    }

    const readyAttachments = attachments.filter(att => att.status === 'ready' && att.base64)
    const userMessage: ChatMessage = { 
      role: 'user', 
      content: inputValue.trim() || `[Attached ${readyAttachments.length} file${readyAttachments.length !== 1 ? 's' : ''}]` 
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    const newStreamStates: Record<string, StreamState> = {}
    selectedModels.forEach(modelId => {
      abortControllersRef.current[modelId] = new AbortController()
      newStreamStates[modelId] = { isStreaming: true, content: '' }
    })
    setStreamStates(newStreamStates)

    const allMessages = [...messages, userMessage]
    const apiAttachments = readyAttachments
      .filter(att => att.base64)
      .map(att => ({
        name: att.name,
        type: att.type,
        base64: att.base64!,
      }))

    const promises = selectedModels.map(async (modelId) => {
      try {
        let fullContent = ''
        const controller = abortControllersRef.current[modelId]

        await api.playgroundChatStream({
          model: modelId,
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          temperature,
          topP,
          maxTokens,
          systemPrompt: systemPrompt || undefined,
          attachments: apiAttachments.length > 0 ? apiAttachments : undefined,
        },
          (token: string, content: string) => {
            fullContent = content
            setStreamStates(prev => ({
              ...prev,
              [modelId]: { isStreaming: true, content: fullContent }
            }))
          },
          (result: any) => {
            setStreamStates(prev => ({
              ...prev,
              [modelId]: {
                isStreaming: false,
                content: result.content || fullContent,
                usage: result.usage
              }
            }))
          },
          controller?.signal)
      } catch (error: any) {
        if (error.name === 'AbortError') {
          setStreamStates(prev => ({
            ...prev,
            [modelId]: {
              isStreaming: false,
              content: prev[modelId]?.content || '',
            }
          }))
        } else {
          setStreamStates(prev => ({
            ...prev,
            [modelId]: {
              isStreaming: false,
              content: '',
              error: error.message || 'Failed to generate response'
            }
          }))
        }
      }
    })

    await Promise.all(promises)
    setIsLoading(false)
    setAttachments([])
  }

  const handleCopy = async (modelId: string) => {
    const state = streamStates[modelId]
    if (state?.content) {
      await navigator.clipboard.writeText(state.content)
    }
  }

  const handleRegenerate = async (modelId: string) => {
    if (messages.length === 0) return

    setIsLoading(true)
    setStreamStates(prev => ({
      ...prev,
      [modelId]: { isStreaming: true, content: '' }
    }))

    try {
      let fullContent = ''

      await api.playgroundChatStream({
        model: modelId,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        temperature,
        topP,
        maxTokens,
        systemPrompt: systemPrompt || undefined
      },
        (token: string, content: string) => {
          fullContent = content
          setStreamStates(prev => ({
            ...prev,
            [modelId]: { isStreaming: true, content: fullContent }
          }))
        },
        (result: any) => {
          setStreamStates(prev => ({
            ...prev,
            [modelId]: {
              isStreaming: false,
              content: result.content || fullContent,
              usage: result.usage
            }
          }))
        })
    } catch (error: any) {
      setStreamStates(prev => ({
        ...prev,
        [modelId]: {
          isStreaming: false,
          content: '',
          error: error.message || 'Failed to generate response'
        }
      }))
    }

    setIsLoading(false)
  }

  const handleClear = () => {
    setMessages([])
    setStreamStates({})
    setCurrentConvId(null)
    setSummaryResponses([])
    setShowSummary(false)
    setAttachments([])
    setShowAttachmentWarning(false)
    Object.values(abortControllersRef.current).forEach(c => c.abort())
    abortControllersRef.current = {}
    setIsLoading(false)
    localStorage.removeItem(ACTIVE_CONV_KEY)
  }

  const handleStopAll = () => {
    Object.values(abortControllersRef.current).forEach(controller => {
      controller.abort()
    })
    
    setStreamStates(prev => {
      const updated = { ...prev }
      Object.keys(updated).forEach(modelId => {
        if (updated[modelId].isStreaming) {
          updated[modelId] = {
            ...updated[modelId],
            isStreaming: false,
          }
        }
      })
      return updated
    })
    
    abortControllersRef.current = {}
    setIsLoading(false)
  }

  const handleStopModel = (modelId: string) => {
    const controller = abortControllersRef.current[modelId]
    if (controller) {
      controller.abort()
      delete abortControllersRef.current[modelId]
    }
    
    setStreamStates(prev => ({
      ...prev,
      [modelId]: {
        ...prev[modelId],
        isStreaming: false,
      }
    }))
    
    if (Object.keys(abortControllersRef.current).length === 0) {
      setIsLoading(false)
    }
  }

  const handleLoadConversation = async (conv: SavedConversation) => {
    try {
      const local = loadLocalConversation(conv.id)
      
      if (local) {
        setSelectedModels(local.models.slice(0, maxModels))
        setCurrentConvId(local.id)
        setMessages(local.messages)
        setStreamStates(local.streamStates)
        setSystemPrompt(local.systemPrompt)
        setTemperature(local.temperature)
        setTopP(local.topP)
        setMaxTokens(local.maxTokens)
        setSummaryResponses([])
        setShowSummary(false)
        setShowRecentChats(false)
        return
      }

      const res = await api.getConversation(conv.id)
      const convData = res.conversation
      
      const allModels = convData.models || []
      setSelectedModels(allModels.slice(0, maxModels))
      setCurrentConvId(convData.id)
      setSummaryResponses([])
      setShowSummary(false)

      const sortedMessages = [...convData.messages].sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
      
      const userMessages: ChatMessage[] = []
      const assistantStates: Record<string, StreamState> = {}
      
      let currentUserContent = ''
      let hasAssistantForCurrentTurn = false
      
      for (const msg of sortedMessages) {
        if (msg.role === 'user') {
          if (currentUserContent) {
            userMessages.push({ role: 'user', content: currentUserContent })
          }
          currentUserContent = msg.content
          hasAssistantForCurrentTurn = false
        } else if (msg.role === 'assistant' && msg.modelId) {
          if (!currentUserContent) {
            currentUserContent = '[Previous conversation]'
          }
          assistantStates[msg.modelId] = {
            isStreaming: false,
            content: msg.content,
          }
          hasAssistantForCurrentTurn = true
        }
      }
      
      if (currentUserContent) {
        userMessages.push({ role: 'user', content: currentUserContent })
      }
      
      setMessages(userMessages)
      setStreamStates(assistantStates)
      setShowRecentChats(false)
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }

  const handleDeleteConversation = (id: string) => {
    if (currentConvId === id) {
      setCurrentConvId(null)
    }
  }

  const getModelName = (modelId: string) => {
    const model = freeModels.find(m => m.id === modelId)
    return model?.name || modelId
  }

  const getModelProvider = (modelId: string) => {
    const model = freeModels.find(m => m.id === modelId)
    return model?.provider || 'unknown'
  }

  const isStreaming = Object.values(streamStates).some((s: StreamState) => s.isStreaming)

  const handleSuggestionSelect = (prompt: string) => {
    setInputValue(prompt)
  }

  const hasContent = messages.length > 0 || Object.keys(streamStates).length > 0

  const processFiles = useCallback(async (files: File[]) => {
    setIsProcessingFiles(true)
    const newAttachments: Attachment[] = []
    const errors: string[] = []

    try {
      for (const file of files) {
        const validation = validateFile(file, [...attachments, ...newAttachments])
        
        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.error}`)
          continue
        }

        const id = `att_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        const attachment: Attachment = {
          id,
          file,
          name: file.name,
          type: file.type,
          size: file.size,
          status: 'uploading',
        }

        newAttachments.push(attachment)
        setAttachments(prev => [...prev, attachment])

        try {
          // Compress images before converting to base64
          const processedFile = file.type.startsWith('image/')
            ? await compressImage(file, 1920, 0.8)
            : file

          const base64 = await fileToBase64(processedFile)
          attachment.base64 = base64

          if (file.type.startsWith('image/')) {
            try {
              const thumbnail = await generateImageThumbnail(processedFile)
              attachment.thumbnail = thumbnail
            } catch {
              // Thumbnail generation failed, continue without it
            }
          }

          attachment.status = 'ready'
          setAttachments(prev => prev.map(att => att.id === id ? { ...att, ...attachment } : att))
        } catch (error: any) {
          attachment.status = 'error'
          attachment.error = error.message || 'Failed to process file'
          setAttachments(prev => prev.map(att => att.id === id ? { ...att, ...attachment } : att))
          errors.push(`${file.name}: ${attachment.error}`)
        }
      }

      if (errors.length > 0) {
        console.warn('File processing errors:', errors)
      }
    } finally {
      setIsProcessingFiles(false)
    }
  }, [attachments])

  const handleFilesSelected = useCallback((files: File[]) => {
    processFiles(files)
  }, [processFiles])

  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }, [])

  const handleClearAttachments = useCallback(() => {
    setAttachments([])
  }, [])

  useEffect(() => {
    if (attachments.length > 0 && selectedModels.length > 0) {
      const hasUnsupported = attachments.some(att => {
        const isImage = att.type.startsWith('image/')
        const isPdf = att.type === 'application/pdf'
        
        return selectedModels.some(modelId => {
          const caps = getModelCapabilities(modelId)
          return (isImage && !caps.vision) || (isPdf && !caps.pdf)
        })
      })
      
      setShowAttachmentWarning(hasUnsupported)
    } else {
      setShowAttachmentWarning(false)
    }
  }, [attachments, selectedModels])

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <RecentChats
        isOpen={showRecentChats}
        onClose={() => setShowRecentChats(false)}
        onSelect={handleLoadConversation}
        onDelete={handleDeleteConversation}
        localConversations={localConversations}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-1.5 px-1 sm:px-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="text-base sm:text-lg md:text-xl font-bold gradient-text">LLM Playground</h2>
          <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full border ${
            selectedModels.length >= maxModels
              ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
              : 'text-surface-500 bg-surface-800/50 border-white/5'
          }`}>
            {selectedModels.length}/{maxModels} model{selectedModels.length !== 1 ? 's' : ''}
          </span>
          {currentConvId && (
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
              Saved
            </span>
          )}
          {isSaving && (
            <span className="flex items-center gap-1 text-xs text-surface-500">
              <Loader2 size={12} className="animate-spin" />
              Saving...
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRecentChats(true)}
              className="px-2 py-1"
            >
              <History size={14} />
              <span className="hidden sm:inline">Recent</span>
            </Button>
          )}
          {isStreaming && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleStopAll}
              className="px-2 py-1"
            >
              <Square size={14} className="fill-current" />
              <span className="hidden sm:inline">Stop All</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="px-2 py-1"
          >
            <Settings2 size={14} />
            <span className="hidden sm:inline">Settings</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={messages.length === 0}
            className="px-2 py-1"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card className="mb-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-surface-100 mb-1">System Prompt</label>
                  <textarea
                    value={systemPrompt}
                    onChange={e => setSystemPrompt(e.target.value)}
                    placeholder="You are a helpful assistant..."
                    className="w-full rounded-lg glass-input p-2 text-xs"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-xs text-surface-100 mb-1">Temperature: {temperature}</label>
                  <input
                    type="range" min="0" max="2" step="0.1" value={temperature}
                    onChange={e => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-cyan-glow"
                  />
                </div>
                <div>
                  <label className="block text-xs text-surface-100 mb-1">Top-p: {topP}</label>
                  <input
                    type="range" min="0" max="1" step="0.1" value={topP}
                    onChange={e => setTopP(parseFloat(e.target.value))}
                    className="w-full accent-cyan-glow"
                  />
                </div>
                <div>
                  <label className="block text-xs text-surface-100 mb-1">Max Tokens: {maxTokens}</label>
                  <input
                    type="range" min="256" max="4096" step="256" value={maxTokens}
                    onChange={e => setMaxTokens(parseInt(e.target.value))}
                    className="w-full accent-cyan-glow"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs text-surface-100 mb-1">Max Models</label>
                    <p className="text-[10px] text-surface-500">Odd numbers only (1-15)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const newVal = Math.max(1, maxModels - 2)
                        localStorage.setItem('llmatlas-max-models', newVal.toString())
                        window.location.reload()
                      }}
                      disabled={maxModels <= 1}
                      className="w-8 h-8 rounded-lg glass flex items-center justify-center text-surface-300 hover:text-cyan-glow disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm font-medium text-cyan-glow w-8 text-center">{maxModels}</span>
                    <button
                      onClick={() => {
                        const newVal = Math.min(15, maxModels + 2)
                        localStorage.setItem('llmatlas-max-models', newVal.toString())
                        window.location.reload()
                      }}
                      disabled={maxModels >= 15}
                      className="w-8 h-8 rounded-lg glass flex items-center justify-center text-surface-300 hover:text-cyan-glow disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs text-surface-100 mb-1">Auto-Save</label>
                    <p className="text-[10px] text-surface-500">Save conversations automatically</p>
                  </div>
                  <button
                    onClick={() => {
                      const newVal = !autoSave
                      localStorage.setItem('llmatlas-auto-save', newVal.toString())
                      window.location.reload()
                    }}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      autoSave ? 'bg-cyan-glow' : 'bg-surface-700'
                    }`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                      autoSave ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Models Tags */}
      <div className="mb-1 sm:mb-1.5 flex items-center gap-2 flex-wrap px-1 sm:px-2">
        {selectedModels.length > 0 ? (
          <>
            {selectedModels.map(modelId => {
              const caps = getModelCapabilities(modelId)
              return (
                <div key={modelId} className="flex items-center gap-1 bg-cyan-glow/10 border border-cyan-glow/20 rounded-lg px-2 py-1 text-xs sm:text-sm text-cyan-glow">
                  <span className="truncate max-w-[80px] sm:max-w-[120px]">{getModelName(modelId)}</span>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {caps.vision && <span className="text-[8px] sm:text-[10px] px-0.5 sm:px-1 rounded bg-orange-500/20 text-orange-300" title="Vision"></span>}
                    {caps.pdf && <span className="text-[8px] sm:text-[10px] px-0.5 sm:px-1 rounded bg-blue-500/20 text-blue-300" title="PDF">📄</span>}
                  </div>
                  <button onClick={() => toggleModel(modelId)} className="hover:text-red-400 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              )
            })}
          </>
        ) : (
          <span className="text-xs text-surface-500">No models selected</span>
        )}
        <button
          onClick={() => setShowModelPicker(!showModelPicker)}
          disabled={selectedModels.length >= maxModels}
          className={`flex items-center gap-1 rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm transition-colors ${
            selectedModels.length >= maxModels
              ? 'glass opacity-50 cursor-not-allowed text-surface-600'
              : 'glass text-surface-300 hover:text-surface-100'
          }`}
          title={selectedModels.length >= maxModels ? `Maximum ${maxModels} models allowed` : ''}
        >
          <Plus size={12} />
          {selectedModels.length === 0 ? 'Select Models' : selectedModels.length >= maxModels ? `Limit (${maxModels})` : 'Add Model'}
        </button>
      </div>

      {/* Attachment Warning */}
      <AnimatePresence>
        {showAttachmentWarning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden px-1 sm:px-2 mb-1 sm:mb-1.5"
          >
            <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-yellow-300 font-medium">Some models don't support attachments</p>
                <p className="text-[10px] sm:text-xs text-yellow-400/70 mt-0.5 sm:mt-1">
                  Models without vision/PDF support will receive text-only messages. Attached files will only be processed by compatible models.
                </p>
              </div>
              <button
                onClick={() => setShowAttachmentWarning(false)}
                className="p-1 rounded hover:bg-yellow-500/20 text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Model Picker Dropdown */}
      <AnimatePresence>
        {showModelPicker && (
          <div className="relative px-1 sm:px-2 mb-1 sm:mb-1.5">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ModelPicker
                models={freeModels}
                selectedModels={selectedModels}
                onToggle={toggleModel}
                onSelectAll={(ids) => {
                  setSelectedModels(prev => {
                    const remaining = maxModels - prev.length
                    if (remaining <= 0) return prev
                    const toAdd = ids.filter(id => !prev.includes(id)).slice(0, remaining)
                    return [...prev, ...toAdd]
                  })
                }}
                onDeselectAll={(ids) => setSelectedModels(prev => prev.filter(id => !ids.includes(id)))}
                onReplaceSelection={(ids) => setSelectedModels(ids.slice(0, maxModels))}
                onClose={() => setShowModelPicker(false)}
                maxModels={maxModels}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-1 sm:px-2 min-h-0">
        {!hasContent ? (
          <PromptSuggestions onSelect={handleSuggestionSelect} />
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className="flex justify-end"
              >
                <div className="max-w-[80%] bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-glow/20 rounded-xl px-4 py-3">
                  <p className="text-sm text-surface-100 whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {selectedModels.length > 0 && (
              <div className={`grid gap-4 ${selectedModels.length > 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                {selectedModels.map(modelId => {
                  const state = streamStates[modelId]
                  if (!state) return null

                    return (
                      <ResponseCard
                        key={modelId}
                        modelId={modelId}
                        modelName={getModelName(modelId)}
                        provider={getModelProvider(modelId)}
                        content={state.content}
                        isStreaming={state.isStreaming}
                        usage={state.usage}
                        error={state.error}
                        onCopy={() => handleCopy(modelId)}
                        onRegenerate={() => handleRegenerate(modelId)}
                        onStop={() => handleStopModel(modelId)}
                      />
                    )
                })}
              </div>
            )}

            {summaryResponses.length > 0 && (
              <div className="mt-6">
                {showSummary ? (
                  <SummaryCard
                    prompt={messages[messages.length - 1]?.content || ''}
                    responses={summaryResponses}
                    onRegenerate={() => setShowSummary(false)}
                  />
                ) : (
                  <button
                    onClick={() => setShowSummary(true)}
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-xl glass border border-cyan-glow/20 hover:border-cyan-glow/40 transition-colors group"
                  >
                    <Sparkles size={18} className="text-cyan-glow" />
                    <span className="text-sm font-medium text-surface-200 group-hover:text-cyan-glow transition-colors">
                      Generate AI Summary ({summaryResponses.length} models)
                    </span>
                  </button>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-white/5 pt-1 px-1 sm:px-2">
        <PromptInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          isStreaming={isStreaming}
          disabled={isProcessingFiles}
          attachments={attachments}
          onAttachmentsChange={setAttachments}
          onFilesSelected={handleFilesSelected}
        />
      </div>
    </div>
  )
}
