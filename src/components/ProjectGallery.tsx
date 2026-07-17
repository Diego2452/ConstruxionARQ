'use client';
import { useState, useEffect, useCallback } from 'react';

interface GalleryImage {
  src:        string;
  alt:        string;
  caption?:   string;
  is_primary?: boolean;
}

export default function ProjectGallery({ images }: { images: GalleryImage[] }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIdx(null), []);
  const prev  = useCallback(() => setLightboxIdx(i => i !== null ? (i - 1 + images.length) % images.length : null), [images.length]);
  const next  = useCallback(() => setLightboxIdx(i => i !== null ? (i + 1) % images.length : null), [images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, close, prev, next]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.gallery-cell').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div>
      {/* ── Grid — all images uniform ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '0.5rem',
      }}>
        {images.map((img, idx) => (
          <div
            key={idx}
            className="gallery-cell reveal"
            onClick={() => setLightboxIdx(idx)}
            style={{
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              aspectRatio: '4/3',
              background: '#1a1a1a',
              transitionDelay: `${(idx % 6) * 0.05}s`,
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading={idx < 6 ? 'eager' : 'lazy'}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
                transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)',
              }}
              onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.05)')}
              onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
            />

            {/* Caption overlay */}
            {img.caption && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '0.5rem 0.7rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.72), transparent)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.65rem', letterSpacing: '0.06em',
              }}>
                {img.caption}
              </div>
            )}

            {/* Primary dot — small indicator in top-right corner */}
            {img.is_primary && (
              <div style={{
                position: 'absolute', top: '0.5rem', right: '0.5rem',
                width: 8, height: 8,
                borderRadius: '50%',
                background: '#C11D2A',
                boxShadow: '0 0 0 2px rgba(0,0,0,0.5)',
              }}
                title="Imagen principal"
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={close}
        >
          <button onClick={close} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '2rem', cursor: 'pointer', lineHeight: 1, zIndex: 1 }}>×</button>

          {images.length > 1 && (
            <button onClick={e => { e.stopPropagation(); prev(); }}
              style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', width: 44, height: 44, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(193,29,42,0.5)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)')}>
              <i className="bi bi-chevron-left" />
            </button>
          )}

          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <img
              src={images[lightboxIdx].src}
              alt={images[lightboxIdx].alt}
              style={{ maxWidth: '90vw', maxHeight: '82vh', objectFit: 'contain', border: '1px solid rgba(255,255,255,0.08)' }}
            />
            {images[lightboxIdx].caption && (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', letterSpacing: '0.08em' }}>
                {images[lightboxIdx].caption}
                {images[lightboxIdx].is_primary && (
                  <span style={{ marginLeft: '0.6rem', display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: '#C11D2A', verticalAlign: 'middle' }} />
                )}
              </p>
            )}
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', letterSpacing: '0.12em' }}>
              {lightboxIdx + 1} / {images.length}
            </p>
          </div>

          {images.length > 1 && (
            <button onClick={e => { e.stopPropagation(); next(); }}
              style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', width: 44, height: 44, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
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
