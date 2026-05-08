import Fuse from 'fuse.js'
import type { Model } from '@/types/model'

let modelsIndex: Fuse<Model> | null = null

export function createModelsSearchIndex(models: Model[]): Fuse<Model> {
  modelsIndex = new Fuse(models, {
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'organization', weight: 0.3 },
      { name: 'description', weight: 0.2 },
      { name: 'family', weight: 0.1 },
    ],
    threshold: 0.3,
    includeScore: true,
  })
  return modelsIndex
}

export function searchModels(query: string): Model[] {
  if (!modelsIndex) return []
  return modelsIndex.search(query).map((r) => r.item)
}

export function createSearchIndex<T>(
  items: T[],
  keys: { name: string; weight: number }[],
): Fuse<T> {
  return new Fuse(items, {
    keys,
    threshold: 0.3,
    includeScore: true,
  })
}