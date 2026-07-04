'use client';
import { useEffect } from 'react';
import Image from 'next/image';

interface Props {
  images: { src: string; alt: string; caption?: string }[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Lightbox({ images, index, onClose, onPrev, onNext }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  const img = images[index];

  return (
    <div className="lightbox-bg" onClick={onClose}>
      <button onClick={e => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl px-4 py-2 hover:text-accent transition-colors z-10"
        aria-label="Anterior">&#8249;</button>

      <div onClick={e => e.stopPropagation()} className="relative max-w-[90vw] max-h-[90vh]">
        <img src={img.src} alt={img.alt} className="lightbox-img" />
        {img.caption && (
          <p className="text-center text-sm text-white/50 mt-3 tracking-wider">{img.caption}</p>
        )}
      </div>

      <button onClick={e => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl px-4 py-2 hover:text-accent transition-colors z-10"
        aria-label="Siguiente">&#8250;</button>

      <button onClick={onClose}
        className="absolute top-5 right-6 text-white/60 hover:text-white text-3xl transition-colors"
        aria-label="Cerrar">×</button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <span key={i} className={`block w-1.5 h-1.5 rounded-full ${i === index ? 'bg-accent' : 'bg-white/30'}`} />
        ))}
      </div>
    </div>
  );
}
