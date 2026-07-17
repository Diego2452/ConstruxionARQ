'use client';
import { useState, useEffect, useCallback } from 'react';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  is_primary?: boolean;
}

interface Props {
  images: GalleryImage[];
}

export default function ProjectGallery({ images }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const close  = useCallback(() => setLightboxIdx(null), []);
  const prev   = useCallback(() => setLightboxIdx(i => i !== null ? (i - 1 + images.length) % images.length : null), [images.length]);
  const next   = useCallback(() => setLightboxIdx(i => i !== null ? (i + 1) % images.length : null), [images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape')      close();
      if (e.key === 'ArrowLeft')   prev();
      if (e.key === 'ArrowRight')  next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, close, prev, next]);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.gallery-img-reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [images]);

  if (!images || images.length === 0) return null;

  // Separate primary from rest
  const primary = images.find(i => i.is_primary) ?? images[0];
  const rest    = images.filter(i => i !== primary);

  return (
    <div>
      {/* Section label */}
      <p style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C11D2A', marginBottom: '1.2rem' }}>
        Galería — {images.length} {images.length === 1 ? 'imagen' : 'imágenes'}
      </p>

      {/* Primary image full-width */}
      {primary && (
        <div
          className="gallery-img-reveal reveal"
          onClick={() => setLightboxIdx(0)}
          style={{ cursor: 'pointer', marginBottom: '0.5rem', overflow: 'hidden', position: 'relative' }}
        >
          <img
            src={primary.src}
            alt={primary.alt}
            style={{ width: '100%', maxHeight: 500, objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
            onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.02)')}
            onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
          />
          {primary.caption && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.6rem 1rem', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', letterSpacing: '0.08em' }}>
              {primary.caption}
              <span style={{ marginLeft: '0.5rem', fontSize: '0.6rem', color: '#C11D2A', textTransform: 'uppercase', letterSpacing: '0.14em' }}>★ Principal</span>
            </div>
          )}
        </div>
      )}

      {/* Rest of images in grid */}
      {rest.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
          {rest.map((img, i) => (
            <div
              key={img.src}
              className="gallery-img-reveal reveal"
              onClick={() => setLightboxIdx(i + 1)} // +1 because primary is index 0
              style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative', aspectRatio: '4/3' }}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.06)')}
                onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
              />
              {img.caption && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.4rem 0.6rem', background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)', color: 'rgba(255,255,255,0.75)', fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={close}
        >
          {/* Close */}
          <button onClick={close} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '2rem', cursor: 'pointer', lineHeight: 1, zIndex: 1 }}>×</button>

          {/* Prev */}
          {images.length > 1 && (
            <button onClick={e => { e.stopPropagation(); prev(); }}
              style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', width: 44, height: 44, cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(193,29,42,0.5)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)')}>
              <i className="bi bi-chevron-left" />
            </button>
          )}

          {/* Image */}
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <img
              src={images[lightboxIdx].src}
              alt={images[lightboxIdx].alt}
              style={{ maxWidth: '90vw', maxHeight: '82vh', objectFit: 'contain', border: '1px solid rgba(255,255,255,0.08)' }}
            />
            {images[lightboxIdx].caption && (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', letterSpacing: '0.08em', textAlign: 'center' }}>
                {images[lightboxIdx].caption}
              </p>
            )}
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', letterSpacing: '0.12em' }}>
              {lightboxIdx + 1} / {images.length}
            </p>
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button onClick={e => { e.stopPropagation(); next(); }}
              style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', width: 44, height: 44, cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(193,29,42,0.5)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)')}>
              <i className="bi bi-chevron-right" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
