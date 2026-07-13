'use client';
import AdminGuard from '@/components/admin/AdminGuard';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function UsuariosPage() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? '');
    });
  }, []);

  return (
    <AdminGuard>
      <div style={{ paddingTop: 220, minHeight: '100vh', background: '#151515' }}>
        <div className="max-w-[1290px] mx-auto px-6 lg:px-10 py-14">

          <p className="section-eyebrow">Admin</p>
          <h1 style={{
            fontFamily: "'Roboto Flex',sans-serif",
            fontSize: 'clamp(1.6rem,3vw,2.4rem)',
            fontWeight: 200, letterSpacing: '0.08em', color: '#fff',
          }}>
            Usuarios Administradores
          </h1>
          <div style={{ width: 36, height: 1.5, background: '#C11D2A', margin: '0.8rem 0 2.5rem' }} />

          {/* Single user card */}
          <div style={{
            background: '#0d0d0d',
            border: '1px solid rgba(255,255,255,0.07)',
            padding: '1.5rem 2rem',
            display: 'flex', alignItems: 'center', gap: '1.5rem',
            maxWidth: 480,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: '#C11D2A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', color: '#fff', flexShrink: 0,
            }}>
              <i className="bi bi-person" />
            </div>
            <div>
              <p style={{ color: '#e0e0e0', fontSize: '0.95rem', fontWeight: 300 }}>{email}</p>
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C11D2A', marginTop: '0.3rem' }}>
                Administrador
              </p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span style={{
                fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '0.25rem 0.7rem',
                border: '1px solid rgba(76,175,80,0.4)',
                color: '#4caf50',
              }}>
                Activo
              </span>
            </div>
          </div>

          <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.7 }}>
            Para agregar administradores adicionales, usá <strong style={{ color: 'rgba(255,255,255,0.4)' }}>Supabase → Authentication → Users → Invite user</strong>.
          </p>
        </div>
      </div>
    </AdminGuard>
  );
}
