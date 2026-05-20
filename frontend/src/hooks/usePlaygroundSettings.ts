import { useState, useEffect, useCallback } from 'react'

const MAX_MODELS_KEY = 'llmatlas-max-models'
const AUTO_SAVE_KEY = 'llmatlas-auto-save'
const DEFAULT_MAX_MODELS = 4
const MIN_MAX_MODELS = 1
const MAX_MAX_MODELS = 15

export function usePlaygroundSettings() {
  const [maxModels, setMaxModelsState] = useState(DEFAULT_MAX_MODELS)
  const [autoSave, setAutoSaveState] = useState(false)

  useEffect(() => {
    try {
      const savedMax = localStorage.getItem(MAX_MODELS_KEY)
      if (savedMax) {
        const parsed = parseInt(savedMax, 10)
        if (parsed >= MIN_MAX_MODELS && parsed <= MAX_MAX_MODELS) {
          setMaxModelsState(parsed)
        }
      }
      const savedAutoSave = localStorage.getItem(AUTO_SAVE_KEY)
      if (savedAutoSave !== null) {
        setAutoSaveState(savedAutoSave === 'true')
      }
    } catch {
      // Ignore parse errors
    }
  }, [])

  const setMaxModels = useCallback((value: number) => {
    const clamped = Math.max(MIN_MAX_MODELS, Math.min(MAX_MAX_MODELS, value))
    setMaxModelsState(clamped)
    localStorage.setItem(MAX_MODELS_KEY, clamped.toString())
  }, [])

  const increaseMaxModels = useCallback(() => {
    setMaxModelsState(prev => {
      const next = Math.min(MAX_MAX_MODELS, prev + 2)
      localStorage.setItem(MAX_MODELS_KEY, next.toString())
      return next
    })
  }, [])

  const decreaseMaxModels = useCallback(() => {
    setMaxModelsState(prev => {
      const next = Math.max(MIN_MAX_MODELS, prev - 2)
      localStorage.setItem(MAX_MODELS_KEY, next.toString())
      return next
    })
  }, [])

  const setAutoSave = useCallback((value: boolean) => {
    setAutoSaveState(value)
    localStorage.setItem(AUTO_SAVE_KEY, value.toString())
  }, [])

  return {
    maxModels,
    autoSave,
    setMaxModels,
    increaseMaxModels,
    decreaseMaxModels,
    setAutoSave,
    canIncrease: maxModels < MAX_MAX_MODELS,
    canDecrease: maxModels > MIN_MAX_MODELS,
  }
}
