'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useLang } from '@/contexts/LanguageContext';
import { t } from '@/data/translations';
import { supabase } from '@/lib/supabase';
import { CATEGORIES } from '@/data/categories';

function yearsFrom1990(): number {
  return Math.floor((Date.now() - new Date(1990, 11, 1).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const IMGS = [
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&auto=format&q=80',
  'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&auto=format&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&auto=format&q=80',
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&auto=format&q=80',
];
const FALLBACK = IMGS;

export default function HomePage() {
  const { lang } = useLang();
  const tr = t[lang];

  // ── Hero text persistence ───────────────────────────────
  // Guardamos en sessionStorage para que no se reinicie al cambiar idioma
  const [typed,   setTyped]   = useState('');
  const [showCsr, setShowCsr] = useState(true);
  const [showSub, setShowSub] = useState(false);

  // ── Hero slideshow ─────────────────────────────────────
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [heroIdx,    setHeroIdx]    = useState(0);
  const [heroFade,   setHeroFade]   = useState(true);
  const [kbVariant,  setKbVariant]  = useState(1);

  // ── Parallax ───────────────────────────────────────────
  const [mouse,      setMouse]      = useState({ x: 0, y: 0 });
  const rafRef                      = useRef<number | null>(null);
  const targetMouse                 = useRef({ x: 0, y: 0 });
  const currentMouse                = useRef({ x: 0, y: 0 });

  const years = yearsFrom1990();

  // ── Typewriter — salta la animación si ya se hizo esta sesión ──
  useEffect(() => {
    const FULL = 'CONSTRUXIONARQ';

    // Si ya se completó la animación en esta sesión, mostramos el texto directo
    if (typeof window !== 'undefined' && sessionStorage.getItem('hero-complete') === '1') {
      setTyped(FULL);
      setShowCsr(false);
      setShowSub(true);
      return;
    }

    // Primera vez: animación typewriter
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(FULL.slice(0, i));
      if (i >= FULL.length) {
        clearInterval(iv);
        setTimeout(() => {
          setShowCsr(false);
          setShowSub(true);
          sessionStorage.setItem('hero-complete', '1');
        }, 380);
      }
    }, 70);
    return () => clearInterval(iv);
  }, []); // solo en mount

  // ── Fetch images ───────────────────────────────────────
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await supabase.from('project_images').select('src, media_type');
        const imgs = (data ?? [])
          .filter((item: { media_type?: string }) => !item.media_type || item.media_type === 'image')
          .map((item: { src: string }) => item.src)
          .filter(Boolean);
        setHeroImages(imgs.length >= 3 ? shuffle(imgs) : FALLBACK);
      } catch {
        setHeroImages(FALLBACK);
      }
    };
    fetchImages();
  }, []);

  // ── Auto-advance 2-4s random ───────────────────────────
  const scheduleNext = useCallback(() => {
    if (heroImages.length <= 1) return;
    const delay = 2000 + Math.random() * 2000;
    return setTimeout(() => {
      setHeroFade(false);
      setTimeout(() => {
        setHeroIdx(i => (i + 1) % heroImages.length);
        setKbVariant(v => (v % 3) + 1);
        setHeroFade(true);
      }, 700);
    }, delay);
  }, [heroImages.length]);

  useEffect(() => {
    const timer = scheduleNext();
    return () => { if (timer) clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroIdx, heroImages.length]);

  // ── Smooth parallax ────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetMouse.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 18,
        y: (e.clientY / window.innerHeight - 0.5) * 12,
      };
    };
    window.addEventListener('mousemove', onMove);
    const animate = () => {
      const dx = targetMouse.current.x - currentMouse.current.x;
      const dy = targetMouse.current.y - currentMouse.current.y;
      if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        currentMouse.current.x += dx * 0.06;
        currentMouse.current.y += dy * 0.06;
        setMouse({ x: currentMouse.current.x, y: currentMouse.current.y });
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Scroll reveals ─────────────────────────────────────
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

  // ── Shortcuts ──────────────────────────────────────────
  const SHORTCUTS = [
    {
      num:   `+${years}`,
      label: lang === 'en' ? 'Years of experience' : 'Años de experiencia',
      icon:  'bi-calendar-check',
      href:  '/nosotros/',
    },
    {
      num:   `${CATEGORIES.length}`,
      label: lang === 'en' ? 'Design Categories' : 'Categorías de Diseño',
      icon:  'bi-grid',
      href:  '/proyectos/',
    },
    {
      num:   lang === 'en' ? 'Permits &\nProcedures' : '100%',
      label: lang === 'en' ? 'throughout Costa Rica' : 'en todo C.R.',
      icon:  'bi-file-earmark-check',
      href:  '/nosotros/',
    },
  ];

  // ── Panels ─────────────────────────────────────────────
  const PANELS = [
    {
      eyebrow: lang === 'en' ? 'Our project portfolio'              : 'Nuestro portafolio de obra',
      title:   tr.nav.proyectos,
      href:    '/proyectos/',
      icon:    'bi-grid-3x3',
      align:   'left',
      stat:    { num: `${CATEGORIES.length}`, label: lang === 'en' ? 'design categories' : 'categorías de diseño' },
    },
    {
      eyebrow: lang === 'en' ? 'Who we are and what drives us'     : 'Quiénes somos y qué nos mueve',
      title:   tr.nav.nosotros,
      href:    '/nosotros/',
      icon:    'bi-people',
      align:   'right',
      stat:    { num: '1990', label: lang === 'en' ? 'team founded' : 'fundación del equipo' },
    },
    {
      eyebrow: lang === 'en' ? "Let's talk about your next project" : 'Hablemos de tu próximo proyecto',
      title:   tr.nav.contactar,
      href:    '/contactar/',
      icon:    'bi-chat-dots',
      align:   'left',
      stat:    { num: '100%', label: lang === 'en' ? 'client commitment' : 'compromiso con el cliente' },
    },
  ];

  return (
    <div>
      <style>{`
        @keyframes kb-1 {
          0%   { transform: scale(1.08) translate(0%,    0%   ); }
          40%  { transform: scale(1.14) translate(-1.2%, -0.6%); }
          100% { transform: scale(1.08) translate(0%,    0%   ); }
        }
        @keyframes kb-2 {
          0%   { transform: scale(1.10) translate( 0.8%,  0.4%); }
          50%  { transform: scale(1.15) translate(-0.6%, -1.0%); }
          100% { transform: scale(1.10) translate( 0.8%,  0.4%); }
        }
        @keyframes kb-3 {
          0%   { transform: scale(1.09) translate(-0.4%,  0.6%); }
          45%  { transform: scale(1.13) translate( 0.8%, -0.4%); }
          100% { transform: scale(1.09) translate(-0.4%,  0.6%); }
        }
        .shortcut-card:hover { background: rgba(193,29,42,0.12) !important; border-color: rgba(193,29,42,0.5) !important; }
        .shortcut-card:hover .shortcut-num { color: #fff !important; }
        .shortcut-card:hover .shortcut-arrow { opacity: 1 !important; transform: translateX(4px) !important; }
      `}</style>

      {/* ═══ HERO ═══ */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#000', zIndex: 1 }}>
        <div style={{ position: 'absolute', inset: '-6%', width: '112%', height: '112%', transform: `translate(${mouse.x * -0.4}px, ${mouse.y * -0.4}px)`, willChange: 'transform' }}>
          {heroImages.map((src, idx) => (
            <img key={src} src={src} alt=""
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: idx === heroIdx ? (heroFade ? 1 : 0) : 0, transition: 'opacity 0.8s ease-in-out', animation: idx === heroIdx ? `kb-${kbVariant} 9s ease-in-out infinite` : 'none', willChange: 'transform' }} />
          ))}
        </div>

        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />

        {heroImages.length > 1 && (
          <div style={{ position: 'absolute', bottom: '7rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.5rem', zIndex: 2 }}>
            {heroImages.slice(0, Math.min(heroImages.length, 8)).map((_, idx) => (
              <button key={idx} onClick={() => { setHeroFade(false); setTimeout(() => { setHeroIdx(idx); setHeroFade(true); }, 300); }}
                style={{ width: idx === heroIdx ? 20 : 6, height: 6, borderRadius: 3, border: 'none', cursor: 'pointer', background: idx === heroIdx ? '#C11D2A' : 'rgba(255,255,255,0.4)', transition: 'all 0.4s', padding: 0 }} />
            ))}
          </div>
        )}

        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 1.5rem', paddingTop: 'max(220px, calc(200px + 10vh))' }}>
          <p style={{ fontSize: '0.88rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C11D2A', fontWeight: 600, marginBottom: '1.2rem', textShadow: '0 1px 12px rgba(0,0,0,0.7)' }}>
            {lang === 'en' ? 'Architecture · Design · Construction' : 'Arquitectura · Diseño · Construcción'}
          </p>
          <h1 style={{ fontFamily: "'Roboto Flex', Roboto, sans-serif", fontSize: 'clamp(2.2rem, 6vw, 5.5rem)', fontWeight: 200, letterSpacing: '0.18em', color: '#fff', lineHeight: 1, textShadow: '0 2px 30px rgba(0,0,0,0.6)' }}>
            {typed.slice(0, 11)}<span style={{ color: '#C11D2A' }}>{typed.slice(11)}</span>
            {showCsr && <span className="typewriter-cursor" />}
          </h1>
          <p style={{ marginTop: '1.5rem', fontSize: 'clamp(0.78rem, 1.2vw, 0.95rem)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.88)', fontWeight: 400, opacity: showSub ? 1 : 0, transform: showSub ? 'none' : 'translateY(12px)', transition: 'opacity 0.9s, transform 0.9s', textShadow: '0 1px 16px rgba(0,0,0,0.7)' }}>
            {tr.tagline.line1} — {tr.tagline.line2} — {tr.tagline.since}
          </p>
          <button onClick={scrollToStats}
            style={{ marginTop: '3.5rem', background: 'none', border: '1px solid rgba(255,255,255,0.32)', color: 'rgba(255,255,255,0.78)', padding: '0.65rem 1.8rem', fontFamily: "'Roboto', sans-serif", fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', opacity: showSub ? 1 : 0, transition: 'opacity 1.1s, border-color 0.25s, color 0.25s' }}
            onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = '#C11D2A'; b.style.color = '#C11D2A'; }}
            onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = 'rgba(255,255,255,0.32)'; b.style.color = 'rgba(255,255,255,0.78)'; }}>
            {tr.home.scrollCta}&nbsp;<i className="bi bi-chevron-double-down" style={{ fontSize: '0.78rem' }} />
          </button>
        </div>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to top, #000, transparent)', pointerEvents: 'none' }} />
      </section>

      {/* ═══ SHORTCUTS ═══ */}
      <section id="stats-section" className="page-card">
        <div style={{ maxWidth: 1290, margin: '0 auto', padding: '4rem 6%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="stats-grid">
          {SHORTCUTS.map((s, i) => (
            <Link key={i} href={s.href} className="shortcut-card reveal"
              style={{ transitionDelay: `${i * 0.1}s`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'rgba(193,29,42,0.06)', border: '1px solid rgba(193,29,42,0.2)', padding: '2.5rem 1.5rem', textDecoration: 'none', transition: 'background 0.25s, border-color 0.25s', position: 'relative', cursor: 'pointer' }}>
              <div style={{ height: '2.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                <i className={`bi ${s.icon}`} style={{ fontSize: '1.7rem', color: '#C11D2A' }} />
              </div>
              <div className="shortcut-num" style={{ fontFamily: "'Roboto Flex', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 200, color: 'rgba(255,255,255,0.9)', lineHeight: 1.1, marginBottom: '0.5rem', whiteSpace: 'pre-line', transition: 'color 0.25s' }}>
                {s.num}
              </div>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>
                {s.label}
              </div>
              <i className="bi bi-arrow-right shortcut-arrow" style={{ position: 'absolute', bottom: '1rem', right: '1rem', color: '#C11D2A', fontSize: '0.9rem', opacity: 0, transition: 'opacity 0.25s, transform 0.25s' }} />
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ PANELS ═══ */}
      {PANELS.map((panel, i) => {
        const isLeft = panel.align === 'left';
        return (
          <div key={panel.title}>
            <section className="stock-section" style={{ height: '60vh', backgroundImage: `url(${IMGS[i % IMGS.length]})` }} />
            <section className="page-card">
              <div style={{ maxWidth: 1290, margin: '0 auto', padding: '5rem 8%' }}>
                <div className="reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: isLeft ? 'flex-start' : 'flex-end', textAlign: isLeft ? 'left' : 'right' }}>
                  <i className={`bi ${panel.icon}`} style={{ fontSize: '1.9rem', color: '#C11D2A', marginBottom: '1.2rem' }} />
                  <p style={{ fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem', fontWeight: 500 }}>{panel.eyebrow}</p>
                  <h2 style={{ fontFamily: "'Roboto Flex', Roboto, sans-serif", fontSize: 'clamp(3rem, 7vw, 7.5rem)', fontWeight: 200, letterSpacing: '0.1em', color: '#fff', lineHeight: 1, marginBottom: '2rem' }}>{panel.title}</h2>
                  <Link href={panel.href} className="panel-cta">
                    {lang === 'en' ? 'Explore' : 'Explorar'}&nbsp;&nbsp;<i className="bi bi-arrow-right" />
                  </Link>
                  <div style={{ marginTop: '3rem', opacity: 0.55, display: 'flex', flexDirection: 'column', alignItems: isLeft ? 'flex-start' : 'flex-end' }}>
                    <div style={{ fontFamily: "'Roboto Flex', sans-serif", fontSize: '1.8rem', fontWeight: 200, color: '#C11D2A', lineHeight: 1 }}>{panel.stat.num}</div>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem' }}>{panel.stat.label}</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      })}

      <section className="stock-section" style={{ height: '45vh', backgroundImage: `url(${IMGS[3]})` }} />
    </div>
  );
}
