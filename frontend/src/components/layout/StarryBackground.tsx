import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  baseSize: number
  twinkleSpeed: number
  twinkleOffset: number
  fadeInSpeed: number
  fadeInOffset: number
  maxOpacity: number
}

interface ShootingStar {
  x: number
  y: number
  length: number
  speed: number
  angle: number
  opacity: number
  life: number
  maxLife: number
}

function generateStars(count: number, width: number, height: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    baseSize: Math.random() * 0.8 + 0.2,
    twinkleSpeed: Math.random() * 2 + 0.5,
    twinkleOffset: Math.random() * Math.PI * 2,
    fadeInSpeed: Math.random() * 0.3 + 0.1,
    fadeInOffset: Math.random() * 100,
    maxOpacity: Math.random() * 0.6 + 0.2,
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
    window.addEventListener('resize', () => {
      resize()
      stars.length = 0
      stars.push(...generateStars(300, canvas.width, canvas.height))
    })

    const stars = generateStars(300, canvas.width, canvas.height)
    const shootingStars: ShootingStar[] = []
    let animationId: number
    let lastShootingStarTime = 0

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const createShootingStar = (): ShootingStar => ({
      x: Math.random() * canvas.width * 0.8,
      y: Math.random() * canvas.height * 0.3,
      length: Math.random() * 60 + 30,
      speed: Math.random() * 6 + 4,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
      opacity: 1,
      life: 0,
      maxLife: Math.random() * 50 + 40,
    })

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const time = Date.now() / 1000

      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.5 + 0.5
        const fadeIn = Math.sin(time * star.fadeInSpeed + star.fadeInOffset) * 0.5 + 0.5
        const opacity = twinkle * fadeIn * star.maxOpacity
        
        if (opacity < 0.02) return
        
        const size = star.baseSize * (0.5 + twinkle * 0.5)
        
        ctx.beginPath()
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 220, 255, ${opacity})`
        ctx.fill()
        
        if (size > 0.6 && opacity > 0.3) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, size * 0.3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(150, 200, 255, ${opacity * 0.5})`
          ctx.fill()
        }
      })

      if (!prefersReducedMotion) {
        if (timestamp - lastShootingStarTime > 5000 + Math.random() * 7000) {
          shootingStars.push(createShootingStar())
          lastShootingStarTime = timestamp
        }

        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const star = shootingStars[i]
          star.life++
          star.x += Math.cos(star.angle) * star.speed
          star.y += Math.sin(star.angle) * star.speed
          star.opacity = 1 - (star.life / star.maxLife)

          if (star.life >= star.maxLife) {
            shootingStars.splice(i, 1)
            continue
          }

          const tailX = star.x - Math.cos(star.angle) * star.length
          const tailY = star.y - Math.sin(star.angle) * star.length

          const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y)
          gradient.addColorStop(0, `rgba(255, 255, 255, 0)`)
          gradient.addColorStop(1, `rgba(255, 255, 255, ${star.opacity * 0.6})`)

          ctx.beginPath()
          ctx.moveTo(tailX, tailY)
          ctx.lineTo(star.x, star.y)
          ctx.strokeStyle = gradient
          ctx.lineWidth = 1
          ctx.stroke()

          ctx.beginPath()
          ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
          ctx.fill()
        }
      }
      
      animationId = requestAnimationFrame(draw)
    }
    animationId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  )
}
