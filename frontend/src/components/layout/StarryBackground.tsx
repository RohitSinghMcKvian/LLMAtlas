import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  }))
}

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = generateStars(150)
    let animationId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      stars.forEach((star) => {
        const x = (star.x / 100) * canvas.width
        const y = (star.y / 100) * canvas.height
        const time = Date.now() / 1000
        const twinkle = Math.sin(time * (2 / star.duration) + star.delay) * 0.5 + 0.5
        const opacity = twinkle * 0.6 + 0.2
        
        ctx.beginPath()
        ctx.arc(x, y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 220, 255, ${opacity})`
        ctx.fill()
        
        if (star.size > 1.2) {
          ctx.beginPath()
          ctx.arc(x, y, star.size * 0.3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(100, 180, 255, ${opacity * 0.8})`
          ctx.fill()
        }
      })
      
      animationId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(to bottom, #0a0e1a 0%, #0d1526 50%, #070e1a 100%)' }}
    />
  )
}