export interface Attachment {
  id: string
  file: File
  name: string
  type: string
  size: number
  base64?: string
  thumbnail?: string
  status: 'pending' | 'uploading' | 'ready' | 'error'
  error?: string
}

export interface ValidationResult {
  valid: boolean
  error?: string
}

export interface FileLimits {
  maxFileSize: number
  maxTotalSize: number
  maxFileCount: number
  maxImageSize: number
  maxDocumentSize: number
}

export interface SupportedFileTypes {
  images: string[]
  documents: string[]
  code: string[]
}

export interface ModelCapabilities {
  vision: boolean
  pdf: boolean
  audio: boolean
  video: boolean
}

export const FILE_LIMITS: FileLimits = {
  maxFileSize: 10 * 1024 * 1024,
  maxTotalSize: 50 * 1024 * 1024,
  maxFileCount: 5,
  maxImageSize: 20 * 1024 * 1024,
  maxDocumentSize: 5 * 1024 * 1024,
}

export const SUPPORTED_FILE_TYPES: SupportedFileTypes = {
  images: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
  documents: ['application/pdf', 'text/plain', 'text/markdown', 'text/csv'],
  code: [
    'application/javascript',
    'application/typescript',
    'text/x-python',
    'application/json',
    'text/x-java',
    'text/x-c',
    'text/x-c++',
    'text/x-csharp',
    'text/x-ruby',
    'text/x-go',
    'text/x-rust',
    'text/x-swift',
    'text/x-kotlin',
  ],
}

export const MODEL_CAPABILITIES: Record<string, ModelCapabilities> = {
  'gemini-2.5-pro': { vision: true, pdf: true, audio: true, video: true },
  'gemini-2.5-flash': { vision: true, pdf: true, audio: true, video: true },
  'gemini-2.5-flash-lite': { vision: true, pdf: true, audio: false, video: false },
  'gemini-2.0-flash': { vision: true, pdf: true, audio: false, video: false },
  'gemma-3': { vision: false, pdf: false, audio: false, video: false },
  'llama-3.3-70b-versatile': { vision: false, pdf: false, audio: false, video: false },
  'llama-3.1-8b-instant': { vision: false, pdf: false, audio: false, video: false },
  'mixtral-8x7b-32768': { vision: false, pdf: false, audio: false, video: false },
  'gemma2-9b-it': { vision: false, pdf: false, audio: false, video: false },
  'llama3.1-8b': { vision: false, pdf: false, audio: false, video: false },
  'llama3.3-70b': { vision: false, pdf: false, audio: false, video: false },
  'mistral-small-latest': { vision: false, pdf: false, audio: false, video: false },
  'mistral-large-latest': { vision: false, pdf: false, audio: false, video: false },
  'codestral-latest': { vision: false, pdf: false, audio: false, video: false },
}

export function getModelCapabilities(modelId: string): ModelCapabilities {
  const cleanId = modelId.replace(/:free$/, '').toLowerCase()
  
  if (MODEL_CAPABILITIES[cleanId]) {
    return MODEL_CAPABILITIES[cleanId]
  }
  
  for (const [key, caps] of Object.entries(MODEL_CAPABILITIES)) {
    if (cleanId.includes(key.toLowerCase())) {
      return caps
    }
  }
  
  if (cleanId.includes('gemini') || cleanId.includes('gemma')) {
    if (cleanId.includes('pro') || cleanId.includes('flash')) {
      return { vision: true, pdf: true, audio: false, video: false }
    }
  }
  
  if (cleanId.includes('gpt-4') && (cleanId.includes('vision') || cleanId.includes('o1'))) {
    return { vision: true, pdf: false, audio: false, video: false }
  }
  
  if (cleanId.includes('claude-3')) {
    return { vision: true, pdf: true, audio: false, video: false }
  }
  
  return { vision: false, pdf: false, audio: false, video: false }
}

export function validateFile(file: File, attachments: Attachment[]): ValidationResult {
  if (attachments.length >= FILE_LIMITS.maxFileCount) {
    return { valid: false, error: `Maximum ${FILE_LIMITS.maxFileCount} files allowed` }
  }
  
  const currentTotalSize = attachments.reduce((sum, att) => sum + att.size, 0)
  if (currentTotalSize + file.size > FILE_LIMITS.maxTotalSize) {
    return { valid: false, error: `Total size exceeds ${formatFileSize(FILE_LIMITS.maxTotalSize)} limit` }
  }
  
  const isImage = file.type.startsWith('image/')
  const isDocument = SUPPORTED_FILE_TYPES.documents.includes(file.type)
  const isCode = SUPPORTED_FILE_TYPES.code.includes(file.type)
  
  if (!isImage && !isDocument && !isCode) {
    return { valid: false, error: 'Unsupported file type' }
  }
  
  if (isImage && file.size > FILE_LIMITS.maxImageSize) {
    return { valid: false, error: `Image file too large (max ${formatFileSize(FILE_LIMITS.maxImageSize)})` }
  }
  
  if ((isDocument || isCode) && file.size > FILE_LIMITS.maxDocumentSize) {
    return { valid: false, error: `File too large (max ${formatFileSize(FILE_LIMITS.maxDocumentSize)})` }
  }
  
  const isDuplicate = attachments.some(
    (att) => att.name === file.name && att.size === file.size
  )
  if (isDuplicate) {
    return { valid: false, error: 'File already attached' }
  }
  
  return { valid: true }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function generateImageThumbnail(file: File, maxSize = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Not an image file'))
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height
            height = maxSize
          }
        }
        
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function getFileCategory(file: File): 'image' | 'document' | 'code' | 'unknown' {
  if (file.type.startsWith('image/')) return 'image'
  if (SUPPORTED_FILE_TYPES.documents.includes(file.type)) return 'document'
  if (SUPPORTED_FILE_TYPES.code.includes(file.type)) return 'code'
  return 'unknown'
}

export function getFileIconType(file: File): string {
  const category = getFileCategory(file)
  
  if (category === 'image') return 'image'
  if (file.type === 'application/pdf') return 'pdf'
  if (category === 'code') return 'code'
  if (file.type === 'text/plain' || file.type === 'text/markdown') return 'text'
  if (file.type === 'text/csv') return 'csv'
  
  return 'file'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

export function isSupportedFileType(file: File): boolean {
  const allSupported = [
    ...SUPPORTED_FILE_TYPES.images,
    ...SUPPORTED_FILE_TYPES.documents,
    ...SUPPORTED_FILE_TYPES.code,
  ]
  return allSupported.includes(file.type)
}

export function truncateFileName(name: string, maxLength = 20): string {
  if (name.length <= maxLength) return name
  
  const ext = name.lastIndexOf('.')
  if (ext === -1) return name.substring(0, maxLength) + '...'
  
  const nameWithoutExt = name.substring(0, ext)
  const extension = name.substring(ext)
  
  if (nameWithoutExt.length <= maxLength - 3) return name
  
  return nameWithoutExt.substring(0, maxLength - 3) + '...' + extension
}

export function compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file)
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          } else {
            resolve(file)
          }
        }, 'image/jpeg', quality)
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
