'use client';
import { useState, useEffect } from 'react';
import Lightbox from './Lightbox';

interface Img { src: string; alt: string; caption?: string; }

export default function ProjectGallery({ images }: { images: Img[] }) {
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  if (images.length <= 1) return null;

  return (
    <>
      <div style={{ width: 40, height: 1.5, background: '#C11D2A', marginBottom: '1.5rem' }} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            className="reveal project-card"
            onClick={() => setLbIndex(i)}
            role="button" tabIndex={0}
            style={{ cursor: 'zoom-in', transitionDelay: `${(i % 3) * 0.07}s` }}
            onKeyDown={e => e.key === 'Enter' && setLbIndex(i)}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
            <div className="project-card__overlay" />
            {img.caption && (
              <span className="project-card__title" style={{ fontSize: '0.8rem' }}>
                {img.caption}
              </span>
            )}
          </div>
        ))}
      </div>

      {lbIndex !== null && (
        <Lightbox
          images={images}
          index={lbIndex}
          onClose={() => setLbIndex(null)}
          onPrev={() => setLbIndex(i => (i! - 1 + images.length) % images.length)}
          onNext={() => setLbIndex(i => (i! + 1) % images.length)}
        />
      )}
    </>
  );
}
