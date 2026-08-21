"use client"

import { useEffect, useMemo, useState } from 'react'

export function Slider3D({ images = [] }: { images?: string[] }) {
  const [index, setIndex] = useState(0)

  const slides = useMemo(() => {
    return (
      images.length > 0
        ? images
        : ['/images/venue.png', '/images/gold-arch.png', '/images/gold-foil.png', '/images/mosque-bg.jpg']
    )
  }, [images])

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4200)
    return () => clearInterval(t)
  }, [slides.length])

  return (
    <div className="carousel-3d">
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
