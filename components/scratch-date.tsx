'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Countdown } from '@/components/countdown'
import { invitation } from '@/lib/invitation-data'

const REVEAL_THRESHOLD = 0.55
const BRUSH_RADIUS = 24

export function ScratchDate() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const progressRef = useRef(0)

  const [revealed, setRevealed] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [progress, setProgress] = useState(0)

  // Paint premium gold foil
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const paint = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Base metallic gradient
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height)
      gradient.addColorStop(0, '#8f6a1d')
      gradient.addColorStop(0.2, '#f6e6a7')
      gradient.addColorStop(0.45, '#d8b55a')
      gradient.addColorStop(0.7, '#f3df93')
      gradient.addColorStop(1, '#9a7121')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, rect.width, rect.height)

      // Metallic streaks
      for (let i = 0; i < 120; i++) {
        const x = Math.random() * rect.width
        const y = Math.random() * rect.height
        const w = Math.random() * 60 + 10
        const h = Math.random() * 2 + 0.5

        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.18})`
        ctx.fillRect(x, y, w, h)
      }

      // Soft shimmer
      const shine = ctx.createLinearGradient(0, 0, rect.width, 0)
      shine.addColorStop(0, 'rgba(255,255,255,0)')
      shine.addColorStop(0.5, 'rgba(255,255,255,0.22)')
      shine.addColorStop(1, 'rgba(255,255,255,0)')

      ctx.fillStyle = shine
      ctx.fillRect(0, 0, rect.width, rect.height)
    }

    paint()
    window.addEventListener('resize', paint)
    return () => window.removeEventListener('resize', paint)
  }, [])

  // Fast reveal percentage check
  const updateProgress = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    const image = ctx.getImageData(0, 0, width, height).data

    let transparent = 0
    let total = 0

    // sample every 16th pixel for speed
    for (let i = 3; i < image.length; i += 4 * 16) {
      total++
      if (image[i] < 40) transparent++
    }

    const ratio = transparent / total
    progressRef.current = ratio
    setProgress(Math.round(ratio * 100))

    if (ratio >= REVEAL_THRESHOLD) {
      reveal()
    }
  }, [])

  const reveal = useCallback(() => {
    setRevealed(true)

    if ('vibrate' in navigator) {
      navigator.vibrate(30)
    }

    window.setTimeout(() => setShowTime(true), 900)
  }, [])

  // Smooth interpolated scratching
  const scratchPoint = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.globalCompositeOperation = 'destination-out'

    const gradient = ctx.createRadialGradient(
      x,
      y,
      0,
      x,
      y,
      BRUSH_RADIUS
    )

    gradient.addColorStop(0, 'rgba(0,0,0,1)')
    gradient.addColorStop(0.7, 'rgba(0,0,0,0.9)')
    gradient.addColorStop(1, 'rgba(0,0,0,0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2)
    ctx.fill()

    ctx.globalCompositeOperation = 'source-over'
  }, [])

  const scratch = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current || revealed) return

      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      if (last.current) {
        const dx = x - last.current.x
        const dy = y - last.current.y
        const distance = Math.hypot(dx, dy)
        const steps = Math.max(1, Math.ceil(distance / 6))

        for (let i = 0; i <= steps; i++) {
          const t = i / steps
          scratchPoint(
            last.current.x + dx * t,
            last.current.y + dy * t
          )
        }
      } else {
        scratchPoint(x, y)
      }

      last.current = { x, y }

      // Throttle progress checks
      if (Math.random() < 0.15) {
        updateProgress()
      }
    },
    [revealed, scratchPoint, updateProgress]
  )

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Scratch Card */}
      <div className="relative w-full max-w-sm">
        <div
          className={`relative overflow-hidden rounded-3xl border border-primary/40 bg-card p-1 shadow-[0_25px_70px_-30px_rgba(0,0,0,0.45)] transition-all duration-700 ${
            revealed ? 'scale-[1.02] shadow-[0_30px_80px_-30px_rgba(212,175,55,0.35)]' : ''
          }`}
        >
          <div className="relative flex h-72 flex-col items-center justify-center gap-1 rounded-[1.25rem] border border-primary/20 bg-gradient-to-b from-muted/60 to-background text-center">
            <p className="text-[0.6rem] tracking-[0.45em] text-primary uppercase">
              Insha'Allah
            </p>

            <p className="font-sans text-xl tracking-[0.3em] text-secondary uppercase">
              {invitation.date.weekday}
            </p>

            <p className="gold-text font-script text-5xl leading-tight">
              {invitation.date.day} {invitation.date.month}
            </p>

            <p className="font-sans text-lg tracking-[0.35em] text-secondary/80">
              {invitation.date.year}
            </p>

            <div className="gold-rule my-2 h-px w-24" />

            <p className="gold-text font-script text-3xl leading-none">
              {invitation.time.label}
            </p>

            <p className="text-[0.6rem] tracking-[0.28em] text-muted-foreground uppercase">
              {invitation.time.note}
            </p>
          </div>

          {/* Scratch Layer */}
          <canvas
            ref={canvasRef}
            onPointerDown={(e) => {
              e.preventDefault()

              try {
                e.currentTarget.setPointerCapture(e.pointerId)
              } catch {}

              drawing.current = true
              last.current = null
              scratch(e)
            }}
            onPointerMove={scratch}
            onPointerUp={() => {
              drawing.current = false
              last.current = null
              updateProgress()
            }}
            onPointerLeave={() => {
              drawing.current = false
              last.current = null
            }}
            className={`absolute inset-1 touch-none rounded-[1.25rem] transition-all duration-700 ${
              revealed
                ? 'pointer-events-none scale-105 opacity-0'
                : 'cursor-grab active:cursor-grabbing opacity-100'
            }`}
            style={{ touchAction: 'none' }}
            aria-label="Scratch the golden foil to reveal the Walima date"
          />

          {/* Overlay text */}
          {!revealed && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end gap-2 pb-5">
              <span className="rounded-full bg-secondary/90 px-4 py-1.5 text-[0.65rem] tracking-[0.28em] text-secondary-foreground uppercase shadow-lg backdrop-blur-sm">
                Scratch to reveal date & time
              </span>

              <div className="h-1.5 w-40 overflow-hidden rounded-full bg-black/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-200 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-[10px] tracking-[0.2em] text-white/90 uppercase">
                {progress}% revealed
              </p>
            </div>
          )}
        </div>

        {!revealed && (
          <button
            type="button"
            onClick={reveal}
            className="mx-auto mt-4 block text-xs tracking-[0.28em] text-muted-foreground uppercase underline decoration-primary/50 underline-offset-4 transition-colors hover:text-foreground"
          >
            Reveal instead
          </button>
        )}
      </div>

      {/* Countdown */}
      <div
        className={`flex w-full justify-center transition-all duration-1000 ${
          showTime
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        }`}
        aria-hidden={!showTime}
      >
        {showTime && <Countdown />}
      </div>
    </div>
  )
}