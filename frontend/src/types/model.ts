export type ModelStatus = 'Available' | 'Beta' | 'Research Preview' | 'Announced'
export type LicenseType = 'Open Source' | 'Closed' | 'Gated' | 'Research'
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