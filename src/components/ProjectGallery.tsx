'use client';
import { useState, useEffect, useCallback } from 'react';
import { detectMediaType } from '@/lib/supabase';

interface GalleryImage {
  src:         string;
  alt:         string;
  caption?:    string;
  is_primary?: boolean;
  media_type?: 'image' | 'video';
}

function resolveType(img: GalleryImage): 'image' | 'video' {
  return img.media_type ?? detectMediaType(img.src);
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
      {/* ── Uniform grid — images & videos ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '0.5rem',
      }}>
        {images.map((img, idx) => {
          const type = resolveType(img);
          return (
            <div
              key={idx}
              className="gallery-cell reveal"
              onClick={() => setLightboxIdx(idx)}
              style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative', aspectRatio: '4/3', background: '#1a1a1a', transitionDelay: `${(idx % 6) * 0.05}s` }}
            >
              {type === 'video' ? (
                /* Video tile: muted loop preview */
                <>
                  <video
                    src={img.src}
                    muted autoPlay loop playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.45s' }}
                  />
                  {/* Play icon overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.25)',
                    transition: 'background 0.3s',
                  }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(193,29,42,0.3)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.25)')}
                  >
                    <i className="bi bi-play-circle-fill" style={{ fontSize: '2.2rem', color: 'rgba(255,255,255,0.85)', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }} />
                  </div>
                </>
              ) : (
                /* Image tile */
                <img
                  src={img.src}
                  alt={img.alt || ''}
                  loading={idx < 6 ? 'eager' : 'lazy'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' }}
                  onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.05)')}
                  onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
                />
              )}

              {/* Caption */}
              {img.caption && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.5rem 0.7rem', background: 'linear-gradient(to top, rgba(0,0,0,0.72), transparent)', color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                  {img.caption}
                </div>
              )}

              {/* Primary dot */}
              {img.is_primary && (
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', width: 8, height: 8, borderRadius: '50%', background: '#C11D2A', boxShadow: '0 0 0 2px rgba(0,0,0,0.5)' }} title="Imagen principal" />
              )}

              {/* Video badge */}
              {type === 'video' && (
                <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', padding: '0.15rem 0.4rem', background: 'rgba(0,0,0,0.65)', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
                  VIDEO
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (() => {
        const img  = images[lightboxIdx];
        const type = resolveType(img);
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={close}>
            <button onClick={close} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '2rem', cursor: 'pointer', lineHeight: 1, zIndex: 1 }}>×</button>

            {images.length > 1 && (
              <button onClick={e => { e.stopPropagation(); prev(); }}
                style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(193,29,42,0.5)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)')}>
                <i className="bi bi-chevron-left" />
              </button>
            )}

            <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
              {type === 'video' ? (
                <video
                  src={img.src}
                  controls
                  autoPlay
                  style={{ maxWidth: '90vw', maxHeight: '82vh', border: '1px solid rgba(255,255,255,0.08)', background: '#000' }}
                />
              ) : (
                <img src={img.src} alt={img.alt || ''} style={{ maxWidth: '90vw', maxHeight: '82vh', objectFit: 'contain', border: '1px solid rgba(255,255,255,0.08)' }} />
              )}
              {img.caption && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', letterSpacing: '0.08em' }}>{img.caption}</p>}
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', letterSpacing: '0.12em' }}>{lightboxIdx + 1} / {images.length}</p>
            </div>

            {images.length > 1 && (
              <button onClick={e => { e.stopPropagation(); next(); }}
                style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', width: 44, height: 44, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(193,29,42,0.5)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)')}>
                <i className="bi bi-chevron-right" />
              </button>
            )}
          </div>
        );
      })()}
    </div>
  );
}
