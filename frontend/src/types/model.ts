export type ModelStatus = 'Available' | 'Beta' | 'Research Preview' | 'Announced' | 'Upcoming'
export type LicenseType = 'Open Source' | 'Closed' | 'Gated' | 'Research' | 'Open'
export type Modality = 'Text' | 'Image' | 'Audio' | 'Code' | 'Vision'

export interface BenchmarkScore {
  id: string
  benchmarkId: string
  benchmark: {
    id: string
    name: string
    shortName: string
  }
  score: number
  source: string
}

export interface ModelVersion {
  id: string
  modelId: string
  version: string
  releaseDate: string | null
  changelog: string | null
  deprecatedBy: string | null
}

export interface Model {
  id: string
  name: string
  organization: string
  releaseDate: string
  license: LicenseType
  parameters: string
  activeParameters?: string
  contextWindow: number
  maxOutputTokens?: number
  architecture?: string
  trainingCutoff?: string
  trainingTokens?: string
  modalities: Modality[]
  modalitiesInput?: string[]
  modalitiesOutput?: string[]
  languagesSupported?: string
  vramRequired: string
  vramBF16?: string
  vramQ4?: string
  apiAvailable: boolean
  status: ModelStatus
  description: string
  toolUse?: string
  systemPrompt?: string
  fineTuning?: string
  selfHostable?: boolean
  isOpenSource: boolean
  family: string
  version: string
  strengths?: string[]
  pricing?: string
  pricingInput?: number
  pricingOutput?: number
  apiEndpoint?: string
  huggingfaceRepo?: string
  github?: string
  paper?: string
  organizationLink?: string
  hfDownloads?: number
  hfLikes?: number
  hfTags?: string[]
  libraryName?: string
  pipelineTag?: string
  quantizationFormats?: string[]
  links: {
    modelPage?: string
    paper?: string
    huggingface?: string
    github?: string
    docs?: string
  }
  benchmarkScores?: BenchmarkScore[]
  versions?: ModelVersion[]
  createdAt?: string
  updatedAt?: string
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
