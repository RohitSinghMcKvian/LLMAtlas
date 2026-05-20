import { useState, useRef, useEffect, type KeyboardEvent, type DragEvent, type ClipboardEvent } from 'react'
import { Send, Loader2, Mic, MicOff, Upload } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useSpeechRecognition from '@/hooks/useSpeechRecognition'
import AudioVisualizer from './AudioVisualizer'
import AttachmentButton from './AttachmentButton'
import AttachmentPreview from './AttachmentPreview'
import { type Attachment } from '@/lib/fileUtils'

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  isStreaming: boolean
  disabled?: boolean
  attachments: Attachment[]
  onAttachmentsChange: (attachments: Attachment[]) => void
  onFilesSelected: (files: File[]) => void
}

export default function PromptInput({
  value,
  onChange,
  onSend,
  isStreaming,
  disabled = false,
  attachments,
  onAttachmentsChange,
  onFilesSelected,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    error
  } = useSpeechRecognition()

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [value])

  useEffect(() => {
    if (transcript && isListening) {
      onChange(transcript.trim())
    }
  }, [transcript, isListening, onChange])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isStreaming && value.trim()) {
        onSend()
      }
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      onFilesSelected(files)
    }
  }

  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          onFilesSelected([file])
          e.preventDefault()
        }
      }
    }
  }

  const handleRemoveAttachment = (id: string) => {
    onAttachmentsChange(attachments.filter(att => att.id !== id))
  }

  const handleClearAllAttachments = () => {
    onAttachmentsChange([])
  }

  const charCount = value.length
  const hasAttachments = attachments.length > 0

  return (
    <div className="relative">
      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-surface-950/80 backdrop-blur-sm rounded-xl border-2 border-dashed border-cyan-glow"
          >
            <div className="flex flex-col items-center gap-3 text-cyan-glow">
              <Upload size={48} className="animate-bounce" />
              <p className="text-lg font-medium">Drop files here</p>
              <p className="text-sm text-surface-400">Images, PDFs, documents, code files</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        className="relative"
      >
        <AttachmentPreview
          attachments={attachments}
          onRemove={handleRemoveAttachment}
          onClearAll={handleClearAllAttachments}
        />

        <div className="glass-strong rounded-xl border border-white/10 overflow-hidden focus-within:border-cyan-glow/30 transition-colors">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={
              isListening
                ? 'Listening...'
                : hasAttachments
                ? 'Type your message about the attached files...'
                : 'Type your message... (Enter to send, Shift+Enter for new line)'
            }
            className="w-full bg-transparent p-4 pr-32 text-surface-100 placeholder-surface-600 resize-none outline-none min-h-[56px] max-h-[160px]"
            rows={1}
            disabled={disabled || isStreaming}
          />
          
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <AttachmentButton
              onFilesSelected={onFilesSelected}
              disabled={disabled || isStreaming}
              attachmentCount={attachments.length}
            />
            
            {isSupported && (
              <button
                onClick={toggleListening}
                disabled={disabled || isStreaming}
                className={`p-2 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isListening
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 animate-pulse'
                    : 'bg-white/10 text-surface-400 hover:bg-white/20 hover:text-surface-200'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}
            
            <button
              onClick={onSend}
              disabled={isStreaming || (!value.trim() && !hasAttachments) || disabled}
              className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/25 transition-all active:scale-95"
            >
              {isStreaming ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between mt-2 px-1"
            >
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-xs text-red-400 font-medium">Listening...</span>
                <AudioVisualizer isActive={isListening} mode="input" className="ml-2" />
              </div>
              <span className="text-xs text-surface-600">Click mic to stop</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!isListening && (value || hasAttachments) && (
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-xs text-surface-600">
              {charCount} chars • ~{Math.ceil(charCount / 4)} tokens
              {hasAttachments && ` • ${attachments.length} file${attachments.length !== 1 ? 's' : ''}`}
            </span>
            <span className="text-xs text-surface-700">Enter to send • Shift+Enter for new line</span>
          </div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-2 px-2 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20"
            >
              <p className="text-xs text-red-400">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
