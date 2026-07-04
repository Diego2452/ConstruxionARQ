'use client';
import { useEffect } from 'react';
import { useLang } from '@/contexts/LanguageContext';
import { t } from '@/data/translations';

export default function ContactarPage() {
  const { lang } = useLang();
  const tr = t[lang].contactar;

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [lang]);

  return (
    <div style={{ paddingTop: 200, minHeight: '100vh', background: '#151515' }}>

      {/* ── Header ── */}
      <div className="max-w-[1290px] mx-auto px-6 lg:px-10 pt-14 pb-12">
        <p className="section-eyebrow">{tr.eyebrow}</p>
        <h1 className="reveal" style={{
          fontFamily: "'Roboto Flex', Roboto, sans-serif",
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 200, letterSpacing: '0.08em',
          color: '#fff', lineHeight: 1.2, marginTop: '0.5rem',
        }}>
          {tr.title}
        </h1>
        <div style={{ width: 56, height: 1.5, background: '#C11D2A', marginTop: '1rem' }} />
        <p className="reveal" style={{ marginTop: '1.2rem', fontSize: '1rem', color: '#7a7a7a', fontWeight: 300, maxWidth: 480, lineHeight: 1.8 }}>
          {tr.subtitle}
        </p>
      </div>

      {/* ── Contact cards ── */}
      <div className="max-w-[1290px] mx-auto px-6 lg:px-10 mb-16
                      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tr.cards.map((item, i) => (
          <a
            key={i}
            href={item.href}
            target={item.href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="reveal contact-card"
            style={{ transitionDelay: `${i * 0.08}s`, textDecoration: 'none', display: 'block' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = '#C11D2A')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)')}
          >
            <i className={`bi ${item.icon}`}
              style={{ fontSize: '1.5rem', color: '#C11D2A', display: 'block', marginBottom: '1.1rem' }} />
            <p style={{
              fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)', marginBottom: '0.45rem',
            }}>
              {item.title}
            </p>
            <p style={{ color: '#e0e0e0', fontSize: '0.92rem', fontWeight: 300, lineHeight: 1.75 }}>
              {item.value}
            </p>
          </a>
        ))}
      </div>

      {/* ── Mapa ── */}
      <div className="max-w-[1290px] mx-auto px-6 lg:px-10 mb-20">
        <p className="section-eyebrow reveal" style={{ marginBottom: '1rem' }}>{tr.mapTitle}</p>
        <p className="reveal" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          {tr.mapSubtitle}
        </p>
        <div className="reveal" style={{
          position: 'relative', width: '100%', height: 400,
          border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden',
        }}>
          <iframe
            src="https://maps.google.com/maps?q=9.926162%2C+-84.053112&t=m&z=16&output=embed&iwloc=near"
            title="Ubicación ConstruxionArq"
            aria-label="Mapa de ubicación"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0,
              filter: 'invert(90%) hue-rotate(180deg) brightness(0.82)',
            }}
            loading="lazy"
          />
        </div>
      </div>

      {/* ── CTA strip ── */}
      <div style={{ background: '#C11D2A', padding: '3.2rem 0' }}>
        <div className="max-w-[1290px] mx-auto px-6 lg:px-10
                        flex flex-col md:flex-row items-center justify-between gap-6">
          <h2 style={{
            fontFamily: "'Roboto Flex', sans-serif",
            fontSize: 'clamp(1.2rem, 2.2vw, 1.8rem)',
            fontWeight: 200, color: '#fff', letterSpacing: '0.05em',
          }}>
            {tr.cta}
          </h2>
          <a
            href="https://wa.me/50683033040"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
              padding: '0.8rem 2.2rem', background: '#fff', color: '#C11D2A',
              textDecoration: 'none', fontFamily: "'Roboto Flex', sans-serif",
              fontSize: '0.73rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              fontWeight: 500, flexShrink: 0, transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = '#151515'; el.style.color = '#fff';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = '#fff'; el.style.color = '#C11D2A';
            }}
          >
            <i className="bi bi-whatsapp" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
