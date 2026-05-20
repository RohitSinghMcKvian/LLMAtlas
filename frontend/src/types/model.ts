export type ModelStatus = 'Available' | 'Beta' | 'Research Preview' | 'Announced' | 'Upcoming'
export type LicenseType = 'Open Source' | 'Open' | 'Closed' | 'Gated' | 'Research'
export type Modality = 'Text' | 'Image' | 'Audio' | 'Code' | 'Vision'

export interface Model {
  id: string
  name: string
  organization: string
  releaseDate: string
  license: LicenseType
  parameters: string
  contextWindow: number
  modalities: Modality[]
  vramRequired: string
  apiAvailable: boolean
  status: ModelStatus
  description: string
  links: {
    modelPage?: string
    paper?: string
    huggingface?: string
    github?: string
    docs?: string
  }
  isOpenSource: boolean
  family: string
  version: string
  toolUse?: string
  modalitiesInput?: Modality[]
  modalitiesOutput?: Modality[]
  architecture?: string
  maxOutputTokens?: number
  trainingCutoff?: string
  languagesSupported?: string
  systemPrompt?: string
  fineTuning?: string
  vramBF16?: string
  vramQ4?: string
  selfHostable?: boolean
  apiEndpoint?: string
  huggingfaceRepo?: string
  github?: string
  strengths?: string[]
  benchmarkScores?: any[]
}

export interface ModelFilter {
  organization?: string[]
  modality?: Modality[]
  license?: LicenseType[]
  paramRange?: [number, number]
  contextRange?: [number, number]
  dateRange?: [string, string]
  search?: string
  status?: ModelStatus[]
  openSource?: boolean
}