'use client';
import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const [stats, setStats] = useState({ projects: 0, images: 0, users: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [{ count: p }, { count: i }, { data: u }] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('project_images').select('*', { count: 'exact', head: true }),
        supabase.auth.admin?.listUsers().catch(() => ({ data: { users: [] } })) ?? Promise.resolve({ data: { users: [] } }),
      ]);
      setStats({ projects: p ?? 0, images: i ?? 0, users: 0 });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Proyectos',  value: stats.projects, icon: 'bi-images',       href: '/admin/proyectos' },
    { label: 'Imágenes',   value: stats.images,   icon: 'bi-card-image',   href: '/admin/proyectos' },
    { label: 'Admins',     value: '1',            icon: 'bi-person-check', href: '/admin/usuarios'  },
  ];

  return (
    <AdminGuard>
      <div style={{ paddingTop: 220, minHeight: '100vh', background: '#151515' }}>
        <div className="max-w-[1290px] mx-auto px-6 lg:px-10 py-14">

          <p className="section-eyebrow">Panel</p>
          <h1 style={{
            fontFamily: "'Roboto Flex', sans-serif",
            fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
            fontWeight: 200, letterSpacing: '0.08em', color: '#fff',
            marginTop: '0.4rem',
          }}>
            Dashboard
          </h1>
          <div style={{ width: 40, height: 1.5, background: '#C11D2A', margin: '1rem 0 3rem' }} />

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '3rem' }}>
            {statCards.map(c => (
              <a key={c.label} href={c.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)',
                  padding: '2rem 1.6rem', transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(193,29,42,0.4)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)')}
                >
                  <i className={`bi ${c.icon}`} style={{ fontSize: '1.5rem', color: '#C11D2A', display: 'block', marginBottom: '1rem' }} />
                  <p style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontFamily: "'Roboto Flex',sans-serif", fontWeight: 200, color: '#fff', lineHeight: 1 }}>
                    {loading ? '—' : c.value}
                  </p>
                  <p style={{ fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>
                    {c.label}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Quick links */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>
              Accesos rápidos
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Nuevo Proyecto', href: '/admin/proyectos', icon: 'bi-plus-circle' },
                { label: 'Ver Sitio',      href: '/',                icon: 'bi-box-arrow-up-right' },
                { label: 'Ver Proyectos',  href: '/proyectos/',      icon: 'bi-images' },
              ].map(l => (
                <a key={l.label} href={l.href}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.6rem 1.4rem',
                    border: '1px solid rgba(255,255,255,0.14)',
                    color: 'rgba(255,255,255,0.55)',
                    textDecoration: 'none',
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: '0.72rem', letterSpacing: '0.12em',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#C11D2A'; el.style.color = '#C11D2A'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.14)'; el.style.color = 'rgba(255,255,255,0.55)'; }}
                >
                  <i className={`bi ${l.icon}`} /> {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
