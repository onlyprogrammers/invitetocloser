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

  const angle = 30
  const gap = 260

  return (
    <div className="w-full carousel-3d">
      <div
        className="stage"
        style={{
          transform: `translateZ(-${gap}px) rotateY(-${index * angle}deg)`,
        }}
      >
        {slides.map((src, i) => {
          const offset = i - index
          const rotateY = offset * angle
          const translateX = offset * 36
          const scale = Math.max(0.78, 1 - Math.abs(offset) * 0.12)
          return (
            <div
              key={src + i}
              className="slide"
              style={{
                backgroundImage: `url(${src})`,
                transform: `rotateY(${rotateY}deg) translateX(${translateX}px) scale(${scale}) translateZ(${Math.abs(offset) * 20}px)`,
                position: 'absolute',
              }}
              aria-hidden={i !== index}
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
