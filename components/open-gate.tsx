'use client'

import { useEffect, useRef, useState } from 'react'
import { invitation } from '@/lib/invitation-data'

type Stage = 'idle' | 'playing' | 'closing' | 'done'

export function OpenGate() {
  const [stage, setStage] = useState<Stage>('idle')
  const [showNames, setShowNames] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  /* lock scrolling until the film has finished */
  useEffect(() => {
    const locked = stage !== 'done'
    document.documentElement.classList.toggle('scroll-locked', locked)
    document.body.classList.toggle('scroll-locked', locked)
    if (locked) window.scrollTo(0, 0)
    return () => {
      document.documentElement.classList.remove('scroll-locked')
      document.body.classList.remove('scroll-locked')
    }
  }, [stage])

  /* names appear 4s after the video starts */
  useEffect(() => {
    if (stage !== 'playing') return
    const t = window.setTimeout(() => setShowNames(true), 4000)
    return () => window.clearTimeout(t)
  }, [stage])

  const open = async () => {
    setStage('playing')
    const video = videoRef.current
    if (!video) return
    try {
      video.currentTime = 0
      await video.play()
    } catch {
      video.muted = true
      void video.play()
    }
  }

  const finish = () => {
    setStage('closing')
    window.setTimeout(() => setStage('done'), 900)
  }

  if (stage === 'done') return null

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-700 ${
        stage === 'closing' ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden={stage === 'closing'}
    >
      {/* ---------- invitation cover ---------- */}
      <div
        className={`paper-bg absolute inset-0 flex flex-col items-center justify-center gap-8 px-6 transition-opacity duration-700 ${
          stage === 'idle' ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {/* opaque base + the same blurred mosque backdrop as the page */}
        <div className="absolute inset-0 bg-background" aria-hidden="true" />
        <div className="fixed-bg" aria-hidden="true" />
        <div className="fixed-bg-veil" aria-hidden="true" />

        <img
          src="/images/gold-arch.png"
          alt=""
          className="pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto h-[62%] w-auto max-w-none opacity-25 mix-blend-multiply"
          style={{
            maskImage:
              'radial-gradient(ellipse at 50% 40%, black 45%, transparent 78%)',
            WebkitMaskImage:
              'radial-gradient(ellipse at 50% 40%, black 45%, transparent 78%)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center gap-3 text-center">
          <p className="text-xs tracking-[0.42em] text-primary uppercase">
            Bismillah
          </p>
          <div className="gold-rule h-px w-24" />
          <h1 className="font-script text-4xl leading-tight text-secondary sm:text-5xl">
            {invitation.occasion}
          </h1>
          <p className="max-w-xs text-pretty text-base leading-relaxed text-muted-foreground">
            A film of blessings awaits you. Kindly open your invitation.
          </p>
        </div>

        <button
          type="button"
          onClick={open}
          className="animate-halo relative z-10 flex size-28 items-center justify-center rounded-full border border-primary/60 bg-secondary text-secondary-foreground transition-transform duration-300 active:scale-95 sm:size-32"
        >
          <span className="absolute inset-1.5 rounded-full border border-primary/40" />
          <span className="font-sans text-lg tracking-[0.32em] uppercase">
            Open
          </span>
        </button>

        <p className="relative text-xs tracking-[0.28em] text-muted-foreground uppercase">
          Tap to begin
        </p>
      </div>

      {/* ---------- full page film ---------- */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-700 ${
          stage === 'idle' ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <video
          ref={videoRef}
          src="/media/invitation.mp4"
          playsInline
          preload="auto"
          onEnded={finish}
          className="size-full object-cover"
        />

        {/* names revealed after 4 seconds */}
        <div
          className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center transition-all duration-1000 ${
            showNames ? 'opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.5) 42%, rgba(0,0,0,0.18) 72%, rgba(0,0,0,0.1) 100%)',
            }}
          />
          <p className="relative text-[0.65rem] tracking-[0.45em] text-primary uppercase sm:text-xs">
            Walima Ceremony of
          </p>
          <h2 className="gold-text relative font-script text-5xl leading-[1.15] sm:text-7xl">
            {invitation.groom}
          </h2>
          <span className="relative font-sans text-base tracking-[0.3em] text-white/80 uppercase">
            &amp;
          </span>
          <h2 className="gold-text relative font-script text-5xl leading-[1.15] sm:text-7xl">
            {invitation.bride}
          </h2>
          <div className="shimmer-line relative mt-2 h-px w-40" />
        </div>
      </div>
    </div>
  )
}
