export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type OperatingSystem = 'Windows' | 'macOS' | 'Linux'

export interface GuideSection {
  id: string
  title: string
  level: SkillLevel
  content: string
  codeSnippets: CodeSnippet[]
  osSpecific?: Record<OperatingSystem, string>
  vramRecommendations?: VRAMRecommendation[]
}

export interface CodeSnippet {
  language: 'python' | 'javascript' | 'bash' | 'json'
  code: string
  description: string
}

export interface VRAMRecommendation {
  vram: string
  modelName: string
  notes: string
}

export interface TroubleshootStep {
  question: string
  yes: TroubleshootStep | string | null
  no: TroubleshootStep | string | null
}

export interface ToolGuide {
  id: string
  name: string
  description: string
  level: SkillLevel
  icon: string
  sections: GuideSection[]
}

export interface FreeAPIGuide {
  id: string
  provider: string
  description: string
  rateLimit: string
  availableModels: string[]
  pythonExample: string
  javascriptExample: string
  curlExample: string
  url: string
}