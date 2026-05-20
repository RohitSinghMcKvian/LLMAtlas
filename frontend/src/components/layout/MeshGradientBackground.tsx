import { useEffect, useRef } from 'react'

export default function MeshGradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const blobs = [
      { x: 0.2, y: 0.3, radius: 0.4, color: 'rgba(0, 229, 255, 0.03)', speed: 0.0002, phase: 0 },
      { x: 0.8, y: 0.2, radius: 0.35, color: 'rgba(192, 132, 252, 0.03)', speed: 0.00025, phase: Math.PI / 3 },
      { x: 0.7, y: 0.8, radius: 0.38, color: 'rgba(251, 113, 133, 0.025)', speed: 0.00022, phase: (Math.PI * 2) / 3 },
      { x: 0.3, y: 0.7, radius: 0.36, color: 'rgba(16, 185, 129, 0.025)', speed: 0.00028, phase: Math.PI },
    ]

    const animate = () => {
      if (!ctx || !canvas) return

      time += 1

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      blobs.forEach((blob) => {
        const x = canvas.width * (blob.x + Math.sin(time * blob.speed + blob.phase) * 0.05)
        const y = canvas.height * (blob.y + Math.cos(time * blob.speed * 0.8 + blob.phase) * 0.05)
        const radius = canvas.width * blob.radius

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, blob.color)
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(animate)
      }
    }

    if (!prefersReducedMotion) {
      animate()
    } else {
      blobs.forEach((blob) => {
        const x = canvas.width * blob.x
        const y = canvas.height * blob.y
        const radius = canvas.width * blob.radius

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, blob.color)
        gradient.addColorStop(1, 'transparent')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })
    }

    return () => {
      window.removeEventListener('resize', resize)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}
