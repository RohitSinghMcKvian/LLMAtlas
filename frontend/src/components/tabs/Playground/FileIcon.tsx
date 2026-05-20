import { File, FileText, Image, Code, FileSpreadsheet } from 'lucide-react'

interface FileIconProps {
  fileType: string
  size?: number
  className?: string
}

export default function FileIcon({ fileType, size = 24, className = '' }: FileIconProps) {
  const getIcon = () => {
    if (fileType.startsWith('image/')) {
      return { Icon: Image, color: 'text-blue-400' }
    }
    if (fileType === 'application/pdf') {
      return { Icon: FileText, color: 'text-red-400' }
    }
    if (fileType === 'text/csv' || fileType.includes('csv')) {
      return { Icon: FileSpreadsheet, color: 'text-green-400' }
    }
    if (
      fileType.includes('javascript') ||
      fileType.includes('typescript') ||
      fileType.includes('python') ||
      fileType.includes('java') ||
      fileType.includes('json') ||
      fileType.includes('code')
    ) {
      return { Icon: Code, color: 'text-yellow-400' }
    }
    if (fileType.startsWith('text/')) {
      return { Icon: FileText, color: 'text-surface-400' }
    }
    return { Icon: File, color: 'text-surface-500' }
  }

  const { Icon, color } = getIcon()

  return (
    <div className={`flex items-center justify-center ${color} ${className}`}>
      <Icon size={size} />
    </div>
  )
}
