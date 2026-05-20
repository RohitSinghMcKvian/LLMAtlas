import { Paperclip } from 'lucide-react'
import { motion } from 'framer-motion'
import { useRef, type ChangeEvent } from 'react'

interface AttachmentButtonProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
  attachmentCount?: number
}

export default function AttachmentButton({ onFilesSelected, disabled = false, attachmentCount = 0 }: AttachmentButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onFilesSelected(files)
    }
    e.target.value = ''
  }

  const supportedTypes = 'image/*,.pdf,.txt,.md,.csv,.js,.ts,.py,.java,.json,.cpp,.cs,.rb,.go,.rs,.swift,.kt'

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={supportedTypes}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`relative p-2 rounded-lg transition-all active:scale-95 ${
          disabled
            ? 'opacity-50 cursor-not-allowed bg-white/5 text-surface-600'
            : 'bg-white/10 text-surface-400 hover:bg-white/20 hover:text-surface-200'
        }`}
        title={attachmentCount > 0 ? `${attachmentCount} file(s) attached. Click to add more.` : 'Attach files (images, PDFs, documents, code)'}
      >
        <Paperclip size={18} />
        
        {attachmentCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-white text-[10px] font-bold flex items-center justify-center"
          >
            {attachmentCount > 9 ? '9+' : attachmentCount}
          </motion.div>
        )}
      </button>
    </div>
  )
}
