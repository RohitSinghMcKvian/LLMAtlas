import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, AlertCircle, Trash2, ZoomIn, RotateCw } from 'lucide-react'
import FileIcon from './FileIcon'
import { type Attachment, formatFileSize, truncateFileName } from '@/lib/fileUtils'

interface AttachmentPreviewProps {
  attachments: Attachment[]
  onRemove: (id: string) => void
  onClearAll: () => void
}

export default function AttachmentPreview({ attachments, onRemove, onClearAll }: AttachmentPreviewProps) {
  const [zoomedAttachment, setZoomedAttachment] = useState<Attachment | null>(null)
  const [rotation, setRotation] = useState(0)

  if (attachments.length === 0) return null

  const handleZoom = (attachment: Attachment) => {
    if (attachment.thumbnail || attachment.type.startsWith('image/')) {
      setRotation(0)
      setZoomedAttachment(attachment)
    }
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs text-surface-500">
          {attachments.length} file{attachments.length !== 1 ? 's' : ''} attached
        </span>
        {attachments.length > 1 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs text-surface-500 hover:text-red-400 transition-colors"
          >
            <Trash2 size={12} />
            Clear all
          </button>
        )}
      </div>
      
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
        <AnimatePresence>
          {attachments.map((attachment) => {
            const isImage = attachment.type.startsWith('image/')
            const isPdf = attachment.type === 'application/pdf'
            
            return (
              <motion.div
                key={attachment.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`flex-shrink-0 relative group rounded-lg border overflow-hidden ${
                  attachment.status === 'error'
                    ? 'border-red-500/30 bg-red-500/5'
                    : attachment.status === 'uploading'
                    ? 'border-cyan-500/30 bg-cyan-500/5'
                    : 'border-white/10 bg-surface-900/50'
                }`}
              >
                <div 
                  className={`w-24 h-24 flex items-center justify-center relative ${isImage && attachment.status === 'ready' ? 'cursor-zoom-in' : ''}`}
                  onClick={() => isImage && attachment.status === 'ready' && handleZoom(attachment)}
                >
                  {attachment.status === 'uploading' ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={20} className="animate-spin text-cyan-glow" />
                      <span className="text-[10px] text-cyan-glow">Processing...</span>
                    </div>
                  ) : attachment.status === 'error' ? (
                    <div className="flex flex-col items-center gap-1">
                      <AlertCircle size={20} className="text-red-400" />
                      <span className="text-[10px] text-red-400">Error</span>
                    </div>
                  ) : attachment.thumbnail ? (
                    <img
                      src={attachment.thumbnail}
                      alt={attachment.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileIcon fileType={attachment.type} size={32} />
                  )}
                  
                  {isImage && attachment.status === 'ready' && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <ZoomIn size={16} className="text-white" />
                    </div>
                  )}
                  
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(attachment.id) }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                    title="Remove file"
                  >
                    <X size={12} />
                  </button>
                </div>
                
                <div className="px-2 py-1.5 border-t border-white/5">
                  <div className="flex items-center gap-1">
                    <p className="text-[10px] text-surface-300 truncate max-w-[70px]" title={attachment.name}>
                      {truncateFileName(attachment.name, 10)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[9px] text-surface-600">
                      {formatFileSize(attachment.size)}
                    </p>
                    {isPdf && (
                      <span className="text-[8px] px-1 rounded bg-red-500/20 text-red-400">PDF</span>
                    )}
                    {isImage && (
                      <span className="text-[8px] px-1 rounded bg-green-500/20 text-green-400">IMG</span>
                    )}
                  </div>
                </div>
                
                {attachment.error && (
                  <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-red-400 text-center px-1">{attachment.error}</p>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {zoomedAttachment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setZoomedAttachment(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute -top-12 right-0 flex items-center gap-2">
                <button
                  onClick={handleRotate}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Rotate"
                >
                  <RotateCw size={18} style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.2s' }} />
                </button>
                <button
                  onClick={() => setZoomedAttachment(null)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>
              
              <img
                src={zoomedAttachment.base64 ? `data:${zoomedAttachment.type};base64,${zoomedAttachment.base64}` : zoomedAttachment.thumbnail || ''}
                alt={zoomedAttachment.name}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s ease' }}
              />
              
              <div className="mt-4 text-center">
                <p className="text-sm text-white font-medium">{zoomedAttachment.name}</p>
                <p className="text-xs text-surface-400 mt-1">{formatFileSize(zoomedAttachment.size)}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
