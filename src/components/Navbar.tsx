'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useLang } from '@/contexts/LanguageContext';
import { t } from '@/data/translations';

const LOGO = 'https://construxionarq.com/wp-content/uploads/2023/03/construxionARQ-transparente-white-rebuild-AI.png';

const socials = [
  { label: 'Facebook',  href: 'https://www.facebook.com/profile.php?id=100088697271627', icon: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M20,10.1c0-5.5-4.5-10-10-10S0,4.5,0,10.1c0,5,3.7,9.1,8.4,9.9v-7H5.9v-2.9h2.5V7.9C8.4,5.4,9.9,4,12.2,4c1.1,0,2.2,.2,2.2,.2v2.5h-1.3c-1.2,0-1.6,.8-1.6,1.6v1.9h2.8L13.9,13h-2.3v7C16.3,19.2,20,15.1,20,10.1z"/></svg>
  )},
  { label: 'Instagram', href: 'https://www.instagram.com/construxionarq/', icon: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><circle cx="10" cy="10" r="3.3"/><path d="M14.2,0H5.8C2.6,0,0,2.6,0,5.8v8.3C0,17.4,2.6,20,5.8,20h8.3c3.2,0,5.8-2.6,5.8-5.8V5.8C20,2.6,17.4,0,14.2,0zM10,15c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S12.8,15,10,15z M15.8,5C15.4,5,15,4.6,15,4.2s.4-.8.8-.8s.8.4.8.8S16.3,5,15.8,5z"/></svg>
  )},
  { label: 'WhatsApp', href: 'https://wa.me/50683033040', icon: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M10,0C4.5,0,0,4.5,0,10c0,1.9,.5,3.6,1.4,5.1L.1,20l5-1.3C6.5,19.5,8.2,20,10,20c5.5,0,10-4.5,10-10S15.5,0,10,0zM6.6,5.3c.2,0,.3,0,.5,0c.2,0,.4,0,.6,.4c.2,.5,.7,1.7,.8,1.8c.1,.1,.1,.3,0,.4C8.3,8.2,8.3,8.3,8.1,8.5C8,8.6,7.9,8.8,7.8,8.9C7.7,9,7.5,9.1,7.7,9.4c.1,.2,.6,1.1,1.4,1.7c.9,.8,1.7,1.1,2,1.2c.2,.1,.4,.1,.5-.1c.1-.2,.6-.7,.8-1c.2-.2,.3-.2,.6-.1c.2,.1,1.4,.7,1.7,.8s.4,.2,.5,.3c.1,.1,.1,.6-.1,1.2c-.2,.6-1.2,1.1-1.7,1.2c-.5,0-.9,.2-3-.6c-2.5-1-4.1-3.6-4.2-3.7c-.1-.2-1-1.3-1-2.6c0-1.2,.6-1.8,.9-2.1C6.1,5.4,6.4,5.3,6.6,5.3z"/></svg>
  )},
  { label: 'Email', href: 'mailto:info@construxionarq.com', icon: (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path d="M10,10.1L0,4.7C.1,3.2,1.4,2,3,2h14c1.6,0,2.9,1.2,3,2.8L10,10.1z M10,11.8c-.1,0-.2,0-.4-.1L0,6.4V15c0,1.7,1.3,3,3,3h4.9h4.3H17c1.7,0,3-1.3,3-3V6.4l-9.6,5.2C10.2,11.7,10.1,11.7,10,11.8z"/></svg>
  )},
];

function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const other = lang === 'es' ? 'en' : 'es';
  const otherLabel = lang === 'es' ? 'EN' : 'ES';
  const currentLabel = lang === 'es' ? 'ES' : 'EN';

  return (
    <div ref={ref} style={{ position: 'relative', marginLeft: '1.8rem' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.35rem',
          fontFamily: "'Roboto Flex', Roboto, sans-serif",
          fontSize: 13, fontWeight: 400, letterSpacing: '0.18em',
          color: open ? '#C11D2A' : 'rgba(232,232,232,0.7)',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px 0',
          transition: 'color 0.2s',
          textTransform: 'uppercase',
        }}
        aria-label="Switch language"
      >
        {currentLabel}
        <svg
          width="9" height="9" viewBox="0 0 10 10" fill="currentColor"
          style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', marginTop: 1 }}
        >
          <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 4,
          minWidth: 64,
          zIndex: 100,
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        }}>
          <button
            onClick={() => { setLang(other); setOpen(false); }}
            style={{
              display: 'block', width: '100%',
              padding: '10px 16px',
              fontFamily: "'Roboto Flex', Roboto, sans-serif",
              fontSize: 12, fontWeight: 400, letterSpacing: '0.18em',
              color: '#e8e8e8', background: 'none', border: 'none',
              cursor: 'pointer', textTransform: 'uppercase', textAlign: 'left',
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = '#C11D2A'; (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = '#e8e8e8'; (e.target as HTMLElement).style.background = 'none'; }}
          >
            {otherLabel} — {other === 'en' ? 'English' : 'Español'}
          </button>
        </div>
      )}
    </div>
  );
}

function MobileLangBtn({ code, onPick }: { code: 'es' | 'en'; onPick: () => void }) {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => { setLang(code); onPick(); }}
      style={{
        fontFamily: "'Roboto Flex', Roboto, sans-serif",
        fontSize: 14, letterSpacing: '0.2em', textTransform: 'uppercase',
        color: lang === code ? '#C11D2A' : 'rgba(255,255,255,0.5)',
        background: 'none', border: 'none', cursor: 'pointer',
        fontWeight: lang === code ? 500 : 300,
      }}
    >
      {code.toUpperCase()}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { lang } = useLang();
  const tr = t[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const navLinks = [
    { href: '/nosotros/',  label: tr.nav.nosotros  },
    { href: '/proyectos/', label: tr.nav.proyectos },
    { href: '/contactar/', label: tr.nav.contactar },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-lg' : ''}`}>

        {/* ── Row 1: Logo + Nav ── */}
        <div className="bg-black" style={{ height: 120 }}>
          <div className="max-w-[1290px] mx-auto h-full flex items-center justify-between px-6 lg:px-10">

            {/* Logo */}
            <Link href="/" className="relative block" style={{ height: 85 }}>
              <Image
                src={LOGO}
                alt="ConstruxionArq"
                width={425}
                height={85}
                style={{ height: 85, width: 'auto', objectFit: 'contain' }}
                priority
                unoptimized
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center" style={{ gap: '3.5rem' }}>
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link ${isActive(href) ? 'active' : ''}`}
                >
                  {label}
                </Link>
              ))}
              <LangSwitcher />
            </nav>

            {/* Mobile hamburger */}
            <button
              className={`md:hidden hamburger ${menuOpen ? 'open' : ''} p-2`}
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Menú"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* ── Row 2: Tagline + Socials ── */}
        <div className="hidden md:block" style={{ height: 80, background: '#151515', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="max-w-[1290px] mx-auto h-full flex items-center justify-between px-6 lg:px-10">
            <p className="text-[13px] leading-snug text-white/80 font-light">
              {tr.tagline.line1}<br />
              {tr.tagline.line2}<br />
              <span className="text-accent font-medium">{tr.tagline.since}</span>
            </p>
            <div className="flex items-center gap-3">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                   aria-label={s.label} className="social-icon text-white">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div className={`mobile-overlay md:hidden ${menuOpen ? '' : 'hidden'}`}>
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 text-white text-3xl leading-none"
          aria-label="Cerrar"
        >×</button>

        <Image src={LOGO} alt="ConstruxionArq" width={220} height={44} unoptimized className="mb-10 opacity-90" />

        <nav className="flex flex-col items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-3xl font-light tracking-widest text-white hover:text-accent transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Lang switcher in mobile */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          {(['es', 'en'] as const).map(l => (
            <MobileLangBtn key={l} code={l} onPick={() => setMenuOpen(false)} />
          ))}
        </div>

        <div className="flex gap-4 mt-8">
          {socials.map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
               aria-label={s.label} className="social-icon text-white w-10 h-10">
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
