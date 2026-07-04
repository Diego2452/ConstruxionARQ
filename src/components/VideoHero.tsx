'use client';
import { useEffect, useRef, useState } from 'react';

export default function VideoHero() {
  const videoRef   = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const [typed, setTyped]      = useState('');
  const [showCursor, setCursor] = useState(true);
  const [showSub, setShowSub]   = useState(false);
  const [showCta, setShowCta]   = useState(false);

  const FULL_TEXT = 'CONSTRUXIONARQ';

  useEffect(() => {
    /* ── 1. Typewriter ── */
    let i = 0;
    const delay = 600; // start typing after 0.6s
    const typeTimer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setTyped(FULL_TEXT.slice(0, i));
        if (i >= FULL_TEXT.length) {
          clearInterval(interval);
          setTimeout(() => {
            setCursor(false);
            setShowSub(true);
          }, 300);
          setTimeout(() => setShowCta(true), 900);
        }
      }, 72);
    }, delay);

    /* ── 2. GSAP-style video fade via requestAnimationFrame ── */
    const video   = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay) return () => clearTimeout(typeTimer);

    let startTime: number | null = null;
    const FADE_DURATION = 2200; // ms
    const TARGET_VIDEO_OPACITY = 0.52;

    const fadeIn = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / FADE_DURATION, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);

      if (video)   video.style.opacity   = String(eased * TARGET_VIDEO_OPACITY);
      if (overlay) overlay.style.opacity = String(1 - eased * 0.65); // overlay goes from 1 → 0.35

      if (t < 1) requestAnimationFrame(fadeIn);
    };

    const startDelay = setTimeout(() => requestAnimationFrame(fadeIn), 200);

    /* ── 3. ScrollTrigger-style: darken on scroll ── */
    const onScroll = () => {
      const scrollY   = window.scrollY;
      const winH      = window.innerHeight;
      const progress  = Math.min(scrollY / (winH * 0.7), 1);
      if (overlay) {
        const base   = 0.35;
        const target = 0.9;
        overlay.style.opacity = String(base + (target - base) * progress);
      }
      if (video) {
        video.style.opacity = String(TARGET_VIDEO_OPACITY * (1 - progress * 0.7));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      clearTimeout(typeTimer);
      clearTimeout(startDelay);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className="video-hero">
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{ opacity: 0 }}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div ref={overlayRef} className="video-hero__overlay" />

      {/* Bottom fade to site-bg */}
      <div className="video-hero__fade-bottom" />

      {/* Content */}
      <div ref={textRef} className="video-hero__content">

        {/* Eyebrow */}
        <p className="section-eyebrow tracking-[0.28em] mb-6 opacity-80">
          Arquitectura · Diseño · Construcción
        </p>

        {/* Typewriter title */}
        <h1
          style={{
            fontFamily: "'Roboto Flex', Roboto, sans-serif",
            fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
            fontWeight: 200,
            letterSpacing: '0.18em',
            color: '#fff',
            lineHeight: 1,
            marginBottom: '0.3em',
          }}
        >
          {typed.slice(0, 9)}
          <span style={{ color: '#C11D2A' }}>{typed.slice(9)}</span>
          {showCursor && <span className="typewriter-cursor" />}
        </h1>

        {/* Tagline */}
        <p
          style={{
            marginTop: '1.4rem',
            fontSize: 'clamp(0.8rem, 1.4vw, 1rem)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            fontWeight: 300,
            opacity: showSub ? 1 : 0,
            transform: showSub ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          Diseñando Calidad &mdash; Construyendo Confianza
          <span style={{ color: '#C11D2A' }}> desde 1990</span>
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '2.5rem',
            opacity: showCta ? 1 : 0,
            transform: showCta ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <a
            href="/proyectos/"
            style={{
              padding: '0.75rem 2rem',
              background: '#C11D2A',
              color: '#fff',
              textDecoration: 'none',
              fontFamily: "'Roboto Flex', sans-serif",
              fontSize: '0.78rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 400,
              border: '1px solid #C11D2A',
              transition: 'background 0.25s, color 0.25s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#C11D2A';
            }}
          >
            Ver Proyectos
          </a>
          <a
            href="/contactar/"
            style={{
              padding: '0.75rem 2rem',
              background: 'transparent',
              color: '#fff',
              textDecoration: 'none',
              fontFamily: "'Roboto Flex', sans-serif",
              fontSize: '0.78rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 400,
              border: '1px solid rgba(255,255,255,0.35)',
              transition: 'border-color 0.25s, color 0.25s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = '#C11D2A';
              (e.currentTarget as HTMLAnchorElement).style.color = '#C11D2A';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.35)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
            }}
          >
            Contactar
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2" style={{ opacity: showCta ? 0.6 : 0, transition: 'opacity 0.7s' }}>
          <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
            <rect x="1" y="1" width="18" height="28" rx="9" stroke="white" strokeWidth="1.5" />
            <circle cx="10" cy="8" r="2.5" fill="white">
              <animateTransform attributeName="transform" type="translate" values="0,0;0,8;0,0" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </div>
    </section>
  );
}
