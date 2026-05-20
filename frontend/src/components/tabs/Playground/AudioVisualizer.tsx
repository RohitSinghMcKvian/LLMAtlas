import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface AudioVisualizerProps {
  isActive: boolean
  mode: 'input' | 'output'
  className?: string
}

export default function AudioVisualizer({ isActive, mode, className = '' }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [audioData, setAudioData] = useState<number[]>(new Array(32).fill(0))
  const simulatedDataRef = useRef<number[]>(new Array(32).fill(0))
  const phaseRef = useRef(0)

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    analyserRef.current = null
  }, [])

  useEffect(() => {
    if (!isActive) {
      cleanup()
      setAudioData(new Array(32).fill(0))
      return
    }

    if (mode === 'input') {
      const setupMicrophone = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
          streamRef.current = stream

          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
          audioContextRef.current = audioContext

          const analyser = audioContext.createAnalyser()
          analyser.fftSize = 128
          analyser.smoothingTimeConstant = 0.8
          analyserRef.current = analyser

          const source = audioContext.createMediaStreamSource(stream)
          source.connect(analyser)

          const bufferLength = analyser.frequencyBinCount
          const dataArray = new Uint8Array(bufferLength)

          const animate = () => {
            analyser.getByteFrequencyData(dataArray)
            const normalized = Array.from(dataArray).map(v => v / 255)
            setAudioData(normalized)
            animationRef.current = requestAnimationFrame(animate)
          }

          animate()
        } catch {
          startSimulation()
        }
      }

      setupMicrophone()
    } else {
      startSimulation()
    }

    return cleanup
  }, [isActive, mode, cleanup])

  const startSimulation = () => {
    const animate = () => {
      phaseRef.current += 0.08
      const newData = simulatedDataRef.current.map((_, i) => {
        const base = Math.sin(phaseRef.current + i * 0.3) * 0.3
        const noise = Math.sin(phaseRef.current * 2.5 + i * 0.5) * 0.2
        const wave = Math.sin(phaseRef.current * 0.5 + i * 0.15) * 0.15
        return Math.max(0.05, Math.min(1, Math.abs(base + noise + wave + 0.3)))
      })
      simulatedDataRef.current = newData
      setAudioData([...newData])
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()
  }

  const barColor = mode === 'input'
    ? 'from-cyan-500 to-blue-500'
    : 'from-purple-500 to-pink-500'

  const glowColor = mode === 'input'
    ? 'shadow-cyan-500/50'
    : 'shadow-purple-500/50'

  return (
    <div className={`flex items-center justify-center gap-0.5 h-8 ${className}`}>
      {audioData.slice(0, 24).map((value, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full bg-gradient-to-t ${barColor} ${isActive ? `shadow-sm ${glowColor}` : ''}`}
          animate={{
            height: isActive ? `${Math.max(4, value * 32)}px` : '4px',
            opacity: isActive ? 0.6 + value * 0.4 : 0.2,
          }}
          transition={{
            duration: 0.1,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}
