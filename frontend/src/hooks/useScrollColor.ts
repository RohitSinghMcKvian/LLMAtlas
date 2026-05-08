import { useEffect, useRef, useState } from 'react'

type AccentColor = 'cyan' | 'purple' | 'rose' | 'emerald'

interface UseScrollColorOptions {
  defaultColor?: AccentColor
  threshold?: number
}

export function useScrollColor(options: UseScrollColorOptions = {}) {
  const { defaultColor = 'cyan', threshold = 0.3 } = options
  const [activeColor, setActiveColor] = useState<AccentColor>(defaultColor)
  const sectionColors = useRef<Map<string, AccentColor>>(new Map())
  const observerRef = useRef<IntersectionObserver | null>(null)

  const registerSection = useRef((id: string, color: AccentColor) => {
    sectionColors.current.set(id, color)
  }).current

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      // Find the most visible section
      let bestEntry: IntersectionObserverEntry | null = null
      let bestRatio = 0

      for (const entry of entries) {
        if (entry.isIntersecting) {
          const ratio = entry.intersectionRatio
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestEntry = entry
          }
        }
      }

      if (bestEntry) {
        const id = bestEntry.target.getAttribute('data-color-section')
        if (id) {
          const color = sectionColors.current.get(id)
          if (color) setActiveColor(color)
        }
      }
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      rootMargin: '-10% 0px -10% 0px',
    })

    // Observe all registered sections
    setTimeout(() => {
      sectionColors.current.forEach((_, id) => {
        const el = document.querySelector(`[data-color-section="${id}"]`)
        if (el) observerRef.current?.observe(el)
      })
    }, 100)

    return () => observerRef.current?.disconnect()
  }, [])

  // Auto-register on mount via ref callback
  const sectionRef = useRef((id: string, color: AccentColor, el: HTMLElement | null) => {
    if (!el) return
    sectionColors.current.set(id, color)
    observerRef.current?.observe(el)
  }).current

  return { activeColor, sectionRef, registerSection }
}
