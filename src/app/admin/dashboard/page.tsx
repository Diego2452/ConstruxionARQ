'use client';
import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const [stats,     setStats]     = useState({ projects: 0, images: 0 });
  const [loading,   setLoading]   = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [deployMsg, setDeployMsg] = useState('');

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('project_images').select('*', { count: 'exact', head: true }),
    ]).then(([{ count: p }, { count: i }]) => {
      setStats({ projects: p ?? 0, images: i ?? 0 });
      setLoading(false);
    });
  }, []);

  const handleDeploy = async () => {
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
    const repo  = process.env.NEXT_PUBLIC_GITHUB_REPO ?? 'Diego2452/ConstruxionARQ';
    if (!token) { setDeployMsg('⚠ Configurá NEXT_PUBLIC_GITHUB_TOKEN en .env.local'); return; }
    setDeploying(true); setDeployMsg('');
    try {
      const res = await fetch(
        `https://api.github.com/repos/${repo}/actions/workflows/deploy.yml/dispatches`,
        { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' }, body: JSON.stringify({ ref: 'main' }) }
      );
      setDeployMsg(res.status === 204 ? '✓ Deploy iniciado. El sitio se actualiza en ~3 minutos.' : `Error ${res.status}: ${await res.text()}`);
    } catch (e: unknown) {
      setDeployMsg('Error: ' + (e instanceof Error ? e.message : 'desconocido'));
    }
    setDeploying(false);
  };

  return (
    <AdminGuard>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={{ paddingTop: 220, minHeight: '100vh', background: '#151515' }}>
        <div className="max-w-[1290px] mx-auto px-6 lg:px-10 py-14">

          <p className="section-eyebrow">Panel</p>
          <h1 style={{ fontFamily: "'Roboto Flex',sans-serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 200, letterSpacing: '0.08em', color: '#fff', marginTop: '0.4rem' }}>Dashboard</h1>
          <div style={{ width: 40, height: 1.5, background: '#C11D2A', margin: '1rem 0 3rem' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.2rem', marginBottom: '3rem' }}>
            {[
              { label: 'Proyectos', value: stats.projects, icon: 'bi-images',     href: '/admin/proyectos' },
              { label: 'Media',     value: stats.images,   icon: 'bi-card-image', href: '/admin/proyectos' },
            ].map(c => (
              <a key={c.label} href={c.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)', padding: '2rem 1.6rem', transition: 'border-color 0.2s' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(193,29,42,0.4)')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)')}>
                  <i className={`bi ${c.icon}`} style={{ fontSize: '1.5rem', color: '#C11D2A', display: 'block', marginBottom: '1rem' }} />
                  <p style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontFamily: "'Roboto Flex',sans-serif", fontWeight: 200, color: '#fff', lineHeight: 1 }}>{loading ? '—' : c.value}</p>
                  <p style={{ fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem' }}>{c.label}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Deploy */}
          <div style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.07)', padding: '2rem', marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A', marginBottom: '0.6rem' }}>Deploy</p>
            <h2 style={{ fontFamily: "'Roboto Flex',sans-serif", fontWeight: 200, color: '#fff', fontSize: '1.2rem', marginBottom: '0.8rem' }}>Publicar cambios al sitio</h2>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 520 }}>
              Los proyectos nuevos aparecen de inmediato en la grilla. Presioná <strong style={{ color: 'rgba(255,255,255,0.65)' }}>Publicar</strong> para que la página individual del proyecto también esté disponible (~3 min).
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={handleDeploy} disabled={deploying}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.8rem', background: deploying ? 'rgba(193,29,42,0.5)' : '#C11D2A', border: 'none', color: '#fff', cursor: deploying ? 'not-allowed' : 'pointer', fontFamily: "'Roboto', sans-serif", fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', transition: 'background 0.2s' }}
                onMouseEnter={e => { if (!deploying) (e.currentTarget as HTMLElement).style.background = '#a0162a'; }}
                onMouseLeave={e => { if (!deploying) (e.currentTarget as HTMLElement).style.background = '#C11D2A'; }}>
                <i className={`bi ${deploying ? 'bi-arrow-repeat' : 'bi-rocket-takeoff'}`} style={{ animation: deploying ? 'spin 1s linear infinite' : 'none' }} />
                {deploying ? 'Iniciando…' : 'Publicar cambios'}
              </button>
              <a href="https://github.com/Diego2452/ConstruxionARQ/actions" target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.2s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C11D2A')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}>
                <i className="bi bi-github" /> Ver estado
              </a>
            </div>
            {deployMsg && <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: deployMsg.startsWith('✓') ? '#4caf50' : '#C11D2A', letterSpacing: '0.04em' }}>{deployMsg}</p>}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>Accesos rápidos</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {[{ label: 'Nuevo Proyecto', href: '/admin/proyectos', icon: 'bi-plus-circle' }, { label: 'Audit Log', href: '/admin/audit-log', icon: 'bi-journal-text' }, { label: 'Ver sitio', href: '/', icon: 'bi-box-arrow-up-right' }].map(l => (
                <a key={l.label} href={l.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.4rem', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontFamily: "'Roboto', sans-serif", fontSize: '0.72rem', letterSpacing: '0.12em', transition: 'all 0.2s' }} onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#C11D2A'; el.style.color = '#C11D2A'; }} onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.14)'; el.style.color = 'rgba(255,255,255,0.55)'; }}>
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
