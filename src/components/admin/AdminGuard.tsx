'use client';
import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Props { children: ReactNode }

const adminLinks = [
  { href: '/admin/dashboard',  label: 'Dashboard',  icon: 'bi-grid-1x2' },
  { href: '/admin/proyectos',  label: 'Proyectos',  icon: 'bi-images'   },
  { href: '/admin/usuarios',   label: 'Usuarios',   icon: 'bi-people'   },
];

export default function AdminGuard({ children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authed,   setAuthed]   = useState(false);
  const [email,    setEmail]    = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/admin');
      } else {
        setEmail(session.user.email ?? '');
        setAuthed(true);
      }
      setChecking(false);
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/admin');
  };

  if (checking) return (
    <div style={{ paddingTop: 220, textAlign: 'center', color: '#5a5a5a', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
      Verificando sesión…
    </div>
  );

  if (!authed) return null;

  return (
    <>
      {/* Admin sub-nav */}
      <div style={{
        position: 'fixed', top: 200, left: 0, right: 0, zIndex: 40,
        background: '#0a0a0a',
        borderBottom: '1px solid rgba(193,29,42,0.25)',
        height: 48,
      }}>
        <div className="max-w-[1290px] mx-auto h-full flex items-center justify-between px-6 lg:px-10">
          {/* Links */}
          <nav style={{ display: 'flex', gap: '0.25rem' }}>
            {adminLinks.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.3rem 1rem',
                  fontFamily: "'Roboto Flex', sans-serif",
                  fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)', textDecoration: 'none',
                  transition: 'color 0.2s, background 0.2s',
                  borderRadius: 2,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#C11D2A')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
              >
                <i className={`bi ${icon}`} style={{ fontSize: '0.8rem' }} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: email + logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
              {email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'none', border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.45)', padding: '0.25rem 0.8rem',
                fontFamily: "'Roboto', sans-serif", fontSize: '0.68rem',
                letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { const b = e.currentTarget; b.style.borderColor = '#C11D2A'; b.style.color = '#C11D2A'; }}
              onMouseLeave={e => { const b = e.currentTarget; b.style.borderColor = 'rgba(255,255,255,0.15)'; b.style.color = 'rgba(255,255,255,0.45)'; }}
            >
              <i className="bi bi-box-arrow-right" /> Salir
            </button>
          </div>
        </div>
      </div>

      {/* Page content with extra top padding for sub-nav */}
      <div style={{ paddingTop: 48 }}>
        {children}
      </div>
    </>
  );
}
