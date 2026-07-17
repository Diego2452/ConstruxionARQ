'use client';
import { useEffect, useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { supabase } from '@/lib/supabase';

const PAGE_SIZE = 10;

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in: string | null;
}

// ── Pagination component ─────────────────────────────────
const pagBtn: React.CSSProperties = {
  minWidth: 36, height: 36, padding: '0 0.55rem',
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'transparent', color: 'rgba(255,255,255,0.5)',
  fontFamily: "'Roboto', sans-serif", fontSize: '0.8rem',
  cursor: 'pointer', display: 'inline-flex',
  alignItems: 'center', justifyContent: 'center',
  transition: 'border-color 0.2s, color 0.2s, background 0.2s',
};

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const maxVisible = 5;
  let visible = pages;
  if (total > maxVisible) {
    const start = Math.max(0, Math.min(page - 3, total - maxVisible));
    visible = pages.slice(start, start + maxVisible);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
      <button style={{ ...pagBtn, opacity: page === 1 ? 0.3 : 1 }} disabled={page === 1} onClick={() => onChange(page - 1)}
        onMouseEnter={e => { if (page !== 1) { (e.currentTarget as HTMLElement).style.borderColor = '#C11D2A'; (e.currentTarget as HTMLElement).style.color = '#C11D2A'; }}}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>
        <i className="bi bi-chevron-left" />
      </button>

      {visible[0] > 1 && (
        <>
          <button style={pagBtn} onClick={() => onChange(1)}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C11D2A'; (e.currentTarget as HTMLElement).style.color = '#C11D2A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>1</button>
          {visible[0] > 2 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>…</span>}
        </>
      )}

      {visible.map(n => (
        <button key={n}
          style={{ ...pagBtn, ...(n === page ? { background: '#C11D2A', borderColor: '#C11D2A', color: '#fff' } : {}) }}
          onClick={() => onChange(n)}
          onMouseEnter={e => { if (n !== page) { (e.currentTarget as HTMLElement).style.borderColor = '#C11D2A'; (e.currentTarget as HTMLElement).style.color = '#C11D2A'; }}}
          onMouseLeave={e => { if (n !== page) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}}>
          {n}
        </button>
      ))}

      {visible[visible.length - 1] < total && (
        <>
          {visible[visible.length - 1] < total - 1 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>…</span>}
          <button style={pagBtn} onClick={() => onChange(total)}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C11D2A'; (e.currentTarget as HTMLElement).style.color = '#C11D2A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>{total}</button>
        </>
      )}

      <button style={{ ...pagBtn, opacity: page === total ? 0.3 : 1 }} disabled={page === total} onClick={() => onChange(page + 1)}
        onMouseEnter={e => { if (page !== total) { (e.currentTarget as HTMLElement).style.borderColor = '#C11D2A'; (e.currentTarget as HTMLElement).style.color = '#C11D2A'; }}}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>
        <i className="bi bi-chevron-right" />
      </button>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────
export default function UsuariosPage() {
  const [users,   setUsers]   = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [page,    setPage]    = useState(1);
  const [currentId, setCurrentId] = useState('');

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const visible = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    async function load() {
      // Get current user id for badge
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentId(user?.id ?? '');

      // Call RPC function
      const { data, error: err } = await supabase.rpc('get_admin_users');
      if (err) {
        setError('No se pudieron cargar los usuarios. Asegurate de haber corrido sql/03_admin_functions.sql en Supabase.');
      } else {
        setUsers(data ?? []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const fmt = (dt: string | null) => {
    if (!dt) return 'Nunca';
    return new Date(dt).toLocaleDateString('es-CR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <AdminGuard>
      <div style={{ paddingTop: 220, minHeight: '100vh', background: '#151515' }}>
        <div className="max-w-[1290px] mx-auto px-6 lg:px-10 py-14">

          <p className="section-eyebrow">Admin</p>
          <h1 style={{ fontFamily: "'Roboto Flex',sans-serif", fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 200, letterSpacing: '0.08em', color: '#fff' }}>
            Usuarios Administradores
          </h1>
          <div style={{ width: 36, height: 1.5, background: '#C11D2A', margin: '0.8rem 0 2.5rem' }} />

          {loading && (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Cargando usuarios…</p>
          )}

          {error && (
            <div style={{ background: 'rgba(193,29,42,0.1)', border: '1px solid rgba(193,29,42,0.3)', padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
              <p style={{ color: '#C11D2A', fontSize: '0.85rem' }}>
                <i className="bi bi-exclamation-triangle" style={{ marginRight: '0.5rem' }} />
                {error}
              </p>
            </div>
          )}

          {!loading && !error && (
            <>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                {users.length} usuario{users.length !== 1 ? 's' : ''} · Página {page} de {totalPages}
              </p>

              {/* Table */}
              <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['', 'Correo electrónico', 'Creado', 'Último acceso', 'Estado'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>

                        {/* Avatar */}
                        <td style={{ padding: '0.85rem 1rem', width: 48 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: '50%',
                            background: u.id === currentId ? '#C11D2A' : 'rgba(255,255,255,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.9rem', color: '#fff', flexShrink: 0,
                          }}>
                            {u.email.charAt(0).toUpperCase()}
                          </div>
                        </td>

                        {/* Email */}
                        <td style={{ padding: '0.85rem 1rem', color: '#e0e0e0' }}>
                          {u.email}
                          {u.id === currentId && (
                            <span style={{ marginLeft: '0.6rem', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', background: 'rgba(193,29,42,0.15)', color: '#C11D2A', border: '1px solid rgba(193,29,42,0.3)' }}>
                              tú
                            </span>
                          )}
                        </td>

                        {/* Created */}
                        <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>
                          {fmt(u.created_at)}
                        </td>

                        {/* Last sign in */}
                        <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>
                          {fmt(u.last_sign_in)}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{
                            fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                            padding: '0.2rem 0.6rem',
                            border: '1px solid rgba(76,175,80,0.4)',
                            color: '#4caf50',
                          }}>
                            Activo
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {users.length === 0 && (
                  <p style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>
                    No se encontraron usuarios.
                  </p>
                )}
              </div>

              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>
                  Mostrando {Math.min((page - 1) * PAGE_SIZE + 1, users.length)}–{Math.min(page * PAGE_SIZE, users.length)} de {users.length}
                </span>
                <Pagination page={page} total={totalPages} onChange={p => setPage(p)} />
              </div>
            </>
          )}

          {/* Info */}
          <p style={{ marginTop: '2.5rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)', lineHeight: 1.7 }}>
            <i className="bi bi-info-circle" style={{ marginRight: '0.4rem' }} />
            Para agregar administradores: <strong style={{ color: 'rgba(255,255,255,0.35)' }}>Supabase → Authentication → Users → Invite user</strong>
          </p>
        </div>
      </div>
    </AdminGuard>
  );
}
