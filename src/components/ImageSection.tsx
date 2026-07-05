'use client'

import { useState } from 'react'
import Lightbox from './Lightbox'

interface ImageSectionProps {
  title: string
  images: string[]
}

// Magnify icon
const MagnifyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    <line x1="11" y1="8" x2="11" y2="14"/>
    <line x1="8" y1="11" x2="14" y2="11"/>
  </svg>
)

export default function ImageSection({ title, images }: ImageSectionProps) {
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)

  if (!images || images.length === 0) return null

  const hasMultiple = images.length > 1
  const lightboxImages = images.map((src, index) => ({
    src,
    alt: `${title} — imagen ${index + 1}`,
  }))

  const openLightbox = (idx: number) => {
    setLightboxIdx(idx)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)

  const prevLightbox = () =>
    setLightboxIdx((i) => (i - 1 + images.length) % images.length)

  const nextLightbox = () =>
    setLightboxIdx((i) => (i + 1) % images.length)

  const prevCarousel = () =>
    setCarouselIdx((i) => (i - 1 + images.length) % images.length)

  const nextCarousel = () =>
    setCarouselIdx((i) => (i + 1) % images.length)

  return (
    <div className="mb-12">
      {/* Section heading */}
      <div className="mb-5">
        <h3 className="text-2xl font-medium text-white mb-2">{title}</h3>
        <div className="section-divider" />
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Main image */}
        <div
          className="img-zoom-wrap rounded-sm overflow-hidden"
          onClick={() => openLightbox(carouselIdx)}
          style={{ aspectRatio: '2/1', background: '#1a1a1a' }}
        >
          <img
            src={images[carouselIdx]}
            alt={`${title} — imagen ${carouselIdx + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div className="img-zoom-icon">
            <MagnifyIcon />
          </div>
        </div>

        {/* Prev / Next arrows (only if multiple) */}
        {hasMultiple && (
          <>
            <button
              onClick={prevCarousel}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white transition-all"
              style={{
                background: 'rgba(0,0,0,0.55)',
                border: 'none',
                borderRadius: '50%',
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
              }}
              aria-label="Imagen anterior"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6"/>
              </svg>
            </button>
            <button
              onClick={nextCarousel}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white transition-all"
              style={{
                background: 'rgba(0,0,0,0.55)',
                border: 'none',
                borderRadius: '50%',
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
              }}
              aria-label="Imagen siguiente"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6"/>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <div
              key={i}
              onClick={() => setCarouselIdx(i)}
              className="flex-shrink-0 rounded-sm overflow-hidden cursor-pointer"
              style={{
                width: '80px',
                height: '52px',
                border: `2px solid ${i === carouselIdx ? '#C11D2A' : 'transparent'}`,
                opacity: i === carouselIdx ? 1 : 0.55,
                transition: 'all 0.2s',
              }}
            >
              <img
                src={src}
                alt={`Miniatura ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Dots */}
      {hasMultiple && (
        <div className="flex justify-center gap-2 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCarouselIdx(i)}
              className={`carousel-dot ${i === carouselIdx ? 'active' : ''}`}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          index={lightboxIdx}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
        />
      )}
    </div>
  )
}
