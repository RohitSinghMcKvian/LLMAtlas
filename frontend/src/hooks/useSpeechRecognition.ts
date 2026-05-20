import { useState, useEffect, useRef, useCallback } from 'react'

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent {
  error: string
  message: string
}

interface UseSpeechRecognitionReturn {
  isListening: boolean
  transcript: string
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  error: string | null
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance
    webkitSpeechRecognition: new () => SpeechRecognitionInstance
  }
}

export default function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const finalTranscriptRef = useRef('')

  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const resetTranscript = useCallback(() => {
    setTranscript('')
    finalTranscriptRef.current = ''
  }, [])

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser')
      return
    }

    setError(null)
    finalTranscriptRef.current = ''
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }
      
      setTranscript(finalTranscriptRef.current + interimTranscript)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = ''
      
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone permissions in your browser settings.'
          break
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking louder or check your microphone.'
          break
        case 'network':
          errorMessage = 'Network error. Speech recognition requires an internet connection. Please check your connection and try again.'
          break
        case 'audio-capture':
          errorMessage = 'No microphone found. Please connect a microphone and try again.'
          break
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service is not allowed. This may require HTTPS or localhost.'
          break
        case 'aborted':
          errorMessage = 'Speech recognition was cancelled.'
          break
        case 'language-not-supported':
          errorMessage = 'Speech recognition is not available for the selected language.'
          break
        default:
          errorMessage = `Speech recognition error: ${event.error}. Please try again.`
      }
      
      setError(errorMessage)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsListening(false)
    setTranscript('')
    finalTranscriptRef.current = ''
  }, [])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    error
  }
}
