'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

/* Unsplash architecture/construction stock images */
const IMGS = [
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&auto=format&q=80',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&auto=format&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&auto=format&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&auto=format&q=80',
];

const STATS: { num: string; label: string; icon?: string; img?: string }[] = [
  { num: '+30',  label: 'Años de experiencia', icon: 'bi-calendar-check'          },
  { num: '+120', label: 'Construcciones',       icon: 'bi-buildings'               },
  { num: '100%', label: 'Territorio nacional',  img:  '/images/cr.png'             },
];

const PANELS = [
  { eyebrow: 'Nuestro portafolio de obra',       title: 'Proyectos', href: '/proyectos/', icon: 'bi-grid-3x3', align: 'left',  stat: { num: '+19',  label: 'proyectos documentados'    } },
  { eyebrow: 'Quiénes somos y qué nos mueve',    title: 'Nosotros',  href: '/nosotros/',  icon: 'bi-people',   align: 'right', stat: { num: '1990', label: 'fundación del equipo'        } },
  { eyebrow: 'Hablemos de tu próximo proyecto',  title: 'Contactar', href: '/contactar/', icon: 'bi-chat-dots',align: 'left',  stat: { num: '100%', label: 'compromiso con el cliente'    } },
];

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausingRef = useRef(false);
  const [typed,   setTyped]   = useState('');
  const [showCsr, setShowCsr] = useState(true);
  const [showSub, setShowSub] = useState(false);

  /* Typewriter */
  useEffect(() => {
    const FULL = 'CONSTRUXIONARQ';
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(FULL.slice(0, i));
      if (i >= FULL.length) {
        clearInterval(iv);
        setTimeout(() => { setShowCsr(false); setShowSub(true); }, 380);
      }
    }, 70);
    return () => clearInterval(iv);
  }, []);

  /* Scroll reveals */
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollToStats = () =>
    document.getElementById('stats-section')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div>

      {/* ═══════════════════════════════════════════════════
          1. HERO — video autoplay/loop, título centrado
      ═══════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#000', zIndex: 1 }}>

        {/* Video */}
        <video
          ref={videoRef}
          autoPlay muted playsInline preload="auto"
          onEnded={() => {
            const v = videoRef.current;
            if (!v || pausingRef.current) return;
            pausingRef.current = true;
            setTimeout(() => {
              if (v) { v.currentTime = 0; v.play(); }
              pausingRef.current = false;
            }, 1000);
          }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src="https://construxionarq.com/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.48)' }} />

        {/* Content — slightly below center (paddingTop shifts visual center down) */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 1.5rem',
          paddingTop: 'max(220px, calc(200px + 10vh))',
        }}>

          {/* Eyebrow */}
          <p style={{
            fontSize: '0.88rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#C11D2A',
            fontWeight: 600, marginBottom: '1.2rem',
            textShadow: '0 1px 12px rgba(0,0,0,0.7)',
          }}>
            Arquitectura · Diseño · Construcción
          </p>

          {/* Main title — CONSTRUXION white / ARQ red */}
          <h1 style={{
            fontFamily: "'Roboto Flex', Roboto, sans-serif",
            fontSize: 'clamp(2.2rem, 6vw, 5.5rem)',
            fontWeight: 200, letterSpacing: '0.18em',
            color: '#fff', lineHeight: 1,
            textShadow: '0 2px 30px rgba(0,0,0,0.6)',
          }}>
            {typed.slice(0, 11)}
            <span style={{ color: '#C11D2A' }}>{typed.slice(11)}</span>
            {showCsr && <span className="typewriter-cursor" />}
          </h1>

          {/* Subtitle */}
          <p style={{
            marginTop: '1.5rem',
            fontSize: 'clamp(0.78rem, 1.2vw, 0.95rem)',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.88)', fontWeight: 400,
            opacity:    showSub ? 1 : 0,
            transform:  showSub ? 'none' : 'translateY(12px)',
            transition: 'opacity 0.9s, transform 0.9s',
            textShadow: '0 1px 16px rgba(0,0,0,0.7)',
          }}>
            Diseñando Calidad — Construyendo Confianza — Desde 1990
          </p>

          {/* Scroll CTA */}
          <button
            onClick={scrollToStats}
            style={{
              marginTop: '3.5rem', background: 'none',
              border: '1px solid rgba(255,255,255,0.32)',
              color: 'rgba(255,255,255,0.78)',
              padding: '0.65rem 1.8rem',
              fontFamily: "'Roboto', sans-serif",
              fontSize: '0.72rem', letterSpacing: '0.18em',
              textTransform: 'uppercase', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              opacity: showSub ? 1 : 0,
              transition: 'opacity 1.1s, border-color 0.25s, color 0.25s',
            }}
            onMouseEnter={e => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.borderColor = '#C11D2A';
              b.style.color = '#C11D2A';
            }}
            onMouseLeave={e => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.borderColor = 'rgba(255,255,255,0.32)';
              b.style.color = 'rgba(255,255,255,0.78)';
            }}
          >
            Scroll down to read more&nbsp;<i className="bi bi-chevron-double-down" style={{ fontSize: '0.78rem' }} />
          </button>
        </div>

        {/* Bottom fade into stats card */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
          background: 'linear-gradient(to top, #000, transparent)',
          pointerEvents: 'none',
        }} />
      </section>

      {/* ═══════════════════════════════════════════════════
          2. STATS CARD — 3 red subcards
      ═══════════════════════════════════════════════════ */}
      <section id="stats-section" className="page-card">
        <div
          style={{
            maxWidth: 1290, margin: '0 auto',
            padding: '4rem 6%',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
          }}
          className="stats-grid"
        >
          {STATS.map((s, i) => (
            <div key={i} className="stat-subcard reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              {/* Icon: Bootstrap icon OR custom PNG */}
              {s.img ? (
                <img
                  src={s.img}
                  alt={s.label}
                  style={{
                    height: '1.7rem', width: 'auto', display: 'block',
                    margin: '0 auto 1rem', objectFit: 'contain',
                  }}
                />
              ) : (
                <i className={`bi ${s.icon}`} style={{
                  fontSize: '1.7rem', color: 'rgba(255,255,255,0.88)',
                  display: 'block', marginBottom: '1rem',
                }} />
              )}
              <div style={{
                fontFamily: "'Roboto Flex', sans-serif",
                fontSize: 'clamp(2.2rem, 4vw, 3.6rem)',
                fontWeight: 200, color: '#fff', lineHeight: 1, marginBottom: '0.5rem',
              }}>
                {s.num}
              </div>
              <div style={{
                fontSize: '0.7rem', letterSpacing: '0.16em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', fontWeight: 400,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3-8. ALTERNATING: stock image → nav card
      ═══════════════════════════════════════════════════ */}
      {PANELS.map((panel, i) => {
        const isLeft = panel.align === 'left';
        return (
          <div key={panel.title}>

            {/* Stock image */}
            <section
              className="stock-section"
              style={{ height: '60vh', backgroundImage: `url(${IMGS[i]})` }}
            />

            {/* Nav card */}
            <section className="page-card">
              <div style={{ maxWidth: 1290, margin: '0 auto', padding: '5rem 8%' }}>
                <div
                  className="reveal"
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: isLeft ? 'flex-start' : 'flex-end',
                    textAlign: isLeft ? 'left' : 'right',
                  }}
                >
                  <i className={`bi ${panel.icon}`} style={{ fontSize: '1.9rem', color: '#C11D2A', marginBottom: '1.2rem' }} />

                  <p style={{
                    fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem', fontWeight: 500,
                  }}>
                    {panel.eyebrow}
                  </p>

                  <h2 style={{
                    fontFamily: "'Roboto Flex', Roboto, sans-serif",
                    fontSize: 'clamp(3rem, 7vw, 7.5rem)',
                    fontWeight: 200, letterSpacing: '0.1em',
                    color: '#fff', lineHeight: 1, marginBottom: '2rem',
                  }}>
                    {panel.title}
                  </h2>

                  <Link href={panel.href} className="panel-cta">
                    Explorar&nbsp;&nbsp;<i className="bi bi-arrow-right" />
                  </Link>

                  <div style={{
                    marginTop: '3rem', opacity: 0.55,
                    display: 'flex', flexDirection: 'column',
                    alignItems: isLeft ? 'flex-start' : 'flex-end',
                  }}>
                    <div style={{
                      fontFamily: "'Roboto Flex', sans-serif",
                      fontSize: '1.8rem', fontWeight: 200, color: '#C11D2A', lineHeight: 1,
                    }}>
                      {panel.stat.num}
                    </div>
                    <div style={{
                      fontSize: '0.6rem', letterSpacing: '0.14em',
                      textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem',
                    }}>
                      {panel.stat.label}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      })}

      {/* Final stock image before footer */}
      <section
        className="stock-section"
        style={{ height: '45vh', backgroundImage: `url(${IMGS[3]})` }}
      />
    </div>
  );
}
