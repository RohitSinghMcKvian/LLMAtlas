export type BenchmarkCategory =
  | 'Reasoning & Knowledge'
  | 'Code'
  | 'Math'
  | 'Instruction Following'
  | 'Long Context'
  | 'Multimodal'
  | 'Safety & Alignment'
  | 'Speed & Efficiency'

export interface Benchmark {
  id: string
  name: string
  shortName: string
  category: BenchmarkCategory
  description: string
  whyItMatters: string
  limitations: string
  higherIsBetter: boolean
  scaleMin: number
  scaleMax: number
}

export interface BenchmarkScore {
  id?: string
  benchmarkId: string
  modelId: string
  score: number
  rawScore?: number
  normalizedScore?: number
  confidenceInterval?: [number, number]
  dateEvaluated?: string
  evaluator?: string
  model?: {
    id: string
    name: string
    organization: string
  }
}

export interface Model {
  id: string
  name: string
  organization: string
}

export interface CategoryScores {
  coding: number
  math: number
  reasoning: number
  instructionFollowing: number
  multilingual: number
  longContext: number
  vision: number
  safety: number
  speed: number
  costEfficiency: number
}

export interface ModelRanking {
  modelId: string
  modelName: string
  organization: string
  overallScore: number
  categoryScores: CategoryScores
  eloScore: number
  rank: number
  deltaFromPrevious: number
  lastUpdated: string
  confidence: number
  evaluationsCount: number
}