import { useState, useEffect, useRef, useCallback } from 'react'

interface UseTextToSpeechReturn {
  isSpeaking: boolean
  isPaused: boolean
  speak: (text: string) => void
  stop: () => void
  pause: () => void
  resume: () => void
  voices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void
}

function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, 'Code block')
    .replace(/`[^`]+`/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^---+$/gm, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoiceState] = useState<SpeechSynthesisVoice | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      if (availableVoices.length > 0) {
        setVoices(availableVoices)
        const preferredVoice = availableVoices.find(
          v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium')
        ) || availableVoices[0]
        setSelectedVoiceState(preferredVoice)
        selectedVoiceRef.current = preferredVoice
      }
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      window.speechSynthesis.cancel()
      window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const setSelectedVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoiceState(voice)
    selectedVoiceRef.current = voice
  }, [])

  const speak = useCallback((text: string) => {
    if (!text) return

    window.speechSynthesis.cancel()

    const cleanText = stripMarkdown(text)
    const utterance = new SpeechSynthesisUtterance(cleanText)
    
    if (selectedVoiceRef.current) {
      utterance.voice = selectedVoiceRef.current
    }
    
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    utterance.onstart = () => {
      setIsSpeaking(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      setIsPaused(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
      setIsPaused(false)
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
  }, [])

  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }, [])

  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    }
  }, [])

  return {
    isSpeaking,
    isPaused,
    speak,
    stop,
    pause,
    resume,
    voices,
    selectedVoice,
    setSelectedVoice
  }
}
