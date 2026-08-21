"use client"

import { useEffect, useMemo, useRef, useState } from 'react'

export function Slider3D({ images = [] }: { images?: string[] }) {
  const [index, setIndex] = useState(0)
  const startX = useRef<number | null>(null)

  const slides = useMemo(() => {
    return (
      images.length > 0
        ? images
        : ['/images/1.png', '/images/2.png', '/images/3.png']
    )
  }, [images])

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 2200)
    return () => clearInterval(t)
  }, [slides.length])

  const changeSlide = (direction: 1 | -1) => {
    setIndex((current) => (current + direction + slides.length) % slides.length)
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX
  }

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return

    const deltaX = event.clientX - startX.current
    const threshold = 40

    if (Math.abs(deltaX) > threshold) {
      changeSlide(deltaX < 0 ? 1 : -1)
    }

    startX.current = null
  }

  return (
    <div
      className="carousel-3d"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={() => {
        startX.current = null
      }}
    >
      <div className="stage" aria-live="polite">
        {slides.map((src, i) => {
          const rawOffset = i - index
          const wrappedOffset = ((rawOffset % slides.length) + slides.length) % slides.length
          const offset = wrappedOffset > slides.length / 2 ? wrappedOffset - slides.length : wrappedOffset
          const absOffset = Math.abs(offset)
          const isVisible = absOffset <= 2
          const translateX = offset * 170
          const translateZ = offset === 0 ? 180 : -absOffset * 100 + 40
          const rotateY = offset * -34
          const scale = offset === 0 ? 1 : 1 - absOffset * 0.12
          const opacity = isVisible ? 1 : 0

          return (
            <div
              key={src + i}
              className="slide"
              style={{
                backgroundImage: `url(${src})`,
                opacity,
                zIndex: 20 - absOffset,
                transform: `translate(-50%, -50%) translate3d(${translateX}px, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                left: '50%',
                top: '50%',
                pointerEvents: i === index ? 'auto' : 'none',
              }}
              aria-hidden={!isVisible}
            />
          )
        })}
      </div>

      <div className="carousel-controls" role="tablist" aria-label="gallery dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Slider3D
