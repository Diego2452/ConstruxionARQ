'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // If already logged in, redirect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/admin/dashboard');
    });
  }, [router]);

  const handleLogin = async () => {
    if (!email || !password) { setError('Completá todos los campos.'); return; }
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError('Correo o contraseña incorrectos.');
    } else {
      router.push('/admin/dashboard');
    }
    setLoading(false);
  };

  const input: React.CSSProperties = {
    width: '100%',
    padding: '0.8rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
    fontFamily: "'Roboto', sans-serif",
    fontSize: '0.92rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      paddingTop: 200,
      minHeight: '100vh',
      background: '#151515',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        padding: '3rem 2.5rem',
        background: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{
            fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: '#C11D2A', marginBottom: '0.6rem',
          }}>
            Panel de Administración
          </p>
          <h1 style={{
            fontFamily: "'Roboto Flex', sans-serif",
            fontSize: '1.6rem', fontWeight: 200, letterSpacing: '0.08em', color: '#fff',
          }}>
            Iniciar Sesión
          </h1>
          <div style={{ width: 40, height: 1.5, background: '#C11D2A', marginTop: '0.8rem' }} />
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Email */}
          <div>
            <label style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.5rem' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={input}
              onFocus={e => (e.target.style.borderColor = '#C11D2A')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
              placeholder="admin@construxionarq.com"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.5rem' }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ ...input, paddingRight: '3rem' }}
                onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                onClick={() => setShowPw(v => !v)}
                style={{
                  position: 'absolute', right: '0.9rem', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,255,255,0.35)', fontSize: '1rem',
                  padding: 0,
                }}
                aria-label={showPw ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                <i className={`bi ${showPw ? 'bi-eye-slash' : 'bi-eye'}`} />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p style={{ fontSize: '0.78rem', color: '#C11D2A', letterSpacing: '0.04em' }}>
              <i className="bi bi-exclamation-circle" /> {error}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              padding: '0.85rem',
              background: loading ? 'rgba(193,29,42,0.5)' : '#C11D2A',
              border: 'none', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Roboto Flex', sans-serif",
              fontSize: '0.75rem', letterSpacing: '0.22em', textTransform: 'uppercase',
              fontWeight: 500, transition: 'background 0.2s',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#a0162a'; }}
            onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#C11D2A'; }}
          >
            {loading ? 'Verificando…' : 'Iniciar Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}
