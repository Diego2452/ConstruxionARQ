'use client';
import { useEffect, useState, useCallback } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { supabase } from '@/lib/supabase';

const PAGE_SIZE = 20;

interface AuditEntry {
  id:          string;
  action:      string;
  entity_type: string;
  entity_id:   string | null;
  entity_name: string | null;
  description: string;
  details:     Record<string, unknown> | null;
  user_email:  string | null;
  created_at:  string;
}

// ── Action metadata ──────────────────────────────────────
const ACTION_META: Record<string, { icon: string; color: string; label: string }> = {
  project_created:        { icon: 'bi-plus-circle-fill', color: '#4caf50', label: 'Proyecto creado'   },
  project_updated:        { icon: 'bi-pencil-fill',      color: '#2196f3', label: 'Proyecto editado'  },
  project_deleted:        { icon: 'bi-trash-fill',       color: '#C11D2A', label: 'Proyecto eliminado'},
  project_images_updated: { icon: 'bi-images',           color: '#ff9800', label: 'Imágenes actualizadas'},
  user_created:           { icon: 'bi-person-plus-fill', color: '#9c27b0', label: 'Usuario creado'    },
};

const ALL_ACTIONS = Object.keys(ACTION_META);

const pagBtn: React.CSSProperties = {
  minWidth: 36, height: 36, padding: '0 0.55rem',
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'transparent', color: 'rgba(255,255,255,0.5)',
  fontFamily: "'Roboto', sans-serif", fontSize: '0.8rem', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  transition: 'border-color 0.2s, color 0.2s, background 0.2s',
};

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const maxV  = 5;
  let vis = pages;
  if (total > maxV) {
    const start = Math.max(0, Math.min(page - 3, total - maxV));
    vis = pages.slice(start, start + maxV);
  }
  const hov = (el: HTMLElement, on: boolean) => {
    el.style.borderColor = on ? '#C11D2A' : 'rgba(255,255,255,0.14)';
    el.style.color       = on ? '#C11D2A' : 'rgba(255,255,255,0.5)';
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
      <button style={{ ...pagBtn, opacity: page === 1 ? 0.3 : 1 }} disabled={page === 1} onClick={() => onChange(page - 1)}
        onMouseEnter={e => { if (page !== 1) hov(e.currentTarget as HTMLElement, true); }} onMouseLeave={e => hov(e.currentTarget as HTMLElement, false)}>
        <i className="bi bi-chevron-left" />
      </button>
      {vis[0] > 1 && <>
        <button style={pagBtn} onClick={() => onChange(1)} onMouseEnter={e => hov(e.currentTarget as HTMLElement, true)} onMouseLeave={e => hov(e.currentTarget as HTMLElement, false)}>1</button>
        {vis[0] > 2 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>…</span>}
      </>}
      {vis.map(n => (
        <button key={n}
          style={{ ...pagBtn, ...(n === page ? { background: '#C11D2A', borderColor: '#C11D2A', color: '#fff' } : {}) }}
          onClick={() => onChange(n)}
          onMouseEnter={e => { if (n !== page) hov(e.currentTarget as HTMLElement, true); }}
          onMouseLeave={e => { if (n !== page) hov(e.currentTarget as HTMLElement, false); }}>
          {n}
        </button>
      ))}
      {vis[vis.length - 1] < total && <>
        {vis[vis.length - 1] < total - 1 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>…</span>}
        <button style={pagBtn} onClick={() => onChange(total)} onMouseEnter={e => hov(e.currentTarget as HTMLElement, true)} onMouseLeave={e => hov(e.currentTarget as HTMLElement, false)}>{total}</button>
      </>}
      <button style={{ ...pagBtn, opacity: page === total ? 0.3 : 1 }} disabled={page === total} onClick={() => onChange(page + 1)}
        onMouseEnter={e => { if (page !== total) hov(e.currentTarget as HTMLElement, true); }} onMouseLeave={e => hov(e.currentTarget as HTMLElement, false)}>
        <i className="bi bi-chevron-right" />
      </button>
    </div>
  );
}

function fmtDate(dt: string) {
  return new Date(dt).toLocaleString('es-CR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AuditLogPage() {
  const [logs,     setLogs]     = useState<AuditEntry[]>([]);
  const [total,    setTotal]    = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(1);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState<string>('all');

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const load = useCallback(async () => {
    setLoading(true);

    let q = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (filter !== 'all') q = q.eq('action', filter);

    if (search.trim()) {
      q = q.or(
        `description.ilike.%${search}%,entity_name.ilike.%${search}%,user_email.ilike.%${search}%`
      );
    }

    const { data, count } = await q;
    setLogs(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  }, [page, search, filter]);

  useEffect(() => { load(); }, [load]);

  // Reset to page 1 on filter/search change
  useEffect(() => { setPage(1); }, [search, filter]);

  const inp: React.CSSProperties = {
    padding: '0.65rem 1rem 0.65rem 2.6rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontFamily: "'Roboto', sans-serif",
    fontSize: '0.85rem', outline: 'none',
    transition: 'border-color 0.2s', width: '100%',
  };

  return (
    <AdminGuard>
      <div style={{ paddingTop: 220, minHeight: '100vh', background: '#151515' }}>
        <div className="max-w-[1290px] mx-auto px-6 lg:px-10 py-14">

          {/* Header */}
          <p className="section-eyebrow">Admin</p>
          <h1 style={{ fontFamily: "'Roboto Flex',sans-serif", fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 200, letterSpacing: '0.08em', color: '#fff' }}>
            Audit Log
          </h1>
          <div style={{ width: 36, height: 1.5, background: '#C11D2A', margin: '0.8rem 0 2rem' }} />

          {/* ── Filters row ── */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem' }}>

            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 400 }}>
              <i className="bi bi-search" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#5a5a5a', fontSize: '0.88rem' }} />
              <input style={inp} placeholder="Buscar por descripción, proyecto, usuario…"
                value={search} onChange={e => setSearch(e.target.value)}
                onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              {search && (
                <button onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: '0.7rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#C11D2A', cursor: 'pointer', fontSize: '1rem' }}>
                  <i className="bi bi-x" />
                </button>
              )}
            </div>

            {/* Action filters */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFilter('all')}
                style={{
                  padding: '0.4rem 0.9rem', fontSize: '0.68rem', letterSpacing: '0.1em',
                  textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Roboto',sans-serif",
                  border: '1px solid',
                  background: filter === 'all' ? '#C11D2A' : 'none',
                  borderColor: filter === 'all' ? '#C11D2A' : 'rgba(255,255,255,0.18)',
                  color: filter === 'all' ? '#fff' : 'rgba(255,255,255,0.55)',
                  transition: 'all 0.15s',
                }}>
                <i className="bi bi-grid-3x3 me-1" /> Todos
              </button>
              {ALL_ACTIONS.map(a => {
                const m = ACTION_META[a];
                const active = filter === a;
                return (
                  <button key={a} onClick={() => setFilter(active ? 'all' : a)}
                    style={{
                      padding: '0.4rem 0.9rem', fontSize: '0.68rem', letterSpacing: '0.1em',
                      textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Roboto',sans-serif",
                      border: '1px solid',
                      background: active ? m.color + '22' : 'none',
                      borderColor: active ? m.color : 'rgba(255,255,255,0.12)',
                      color: active ? m.color : 'rgba(255,255,255,0.45)',
                      transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', gap: '0.35rem',
                    }}>
                    <i className={`bi ${m.icon}`} style={{ fontSize: '0.75rem' }} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Count */}
          {!loading && (
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              {total} registro{total !== 1 ? 's' : ''} · Página {page} de {totalPages}
            </p>
          )}

          {/* ── Log list ── */}
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Cargando registros…</p>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1.5rem' }}>
                {logs.length === 0 && (
                  <div style={{ padding: '3rem', textAlign: 'center' }}>
                    <i className="bi bi-journal-x" style={{ fontSize: '2rem', color: '#333', display: 'block', marginBottom: '0.8rem' }} />
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>
                      {search || filter !== 'all' ? 'Sin resultados para este filtro.' : 'No hay registros aún.'}
                    </p>
                  </div>
                )}

                {logs.map(log => {
                  const m = ACTION_META[log.action] ?? { icon: 'bi-dot', color: '#888', label: log.action };
                  return (
                    <div key={log.id}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '0.85rem 1rem', background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.04)', transition: 'border-color 0.15s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.09)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.04)')}>

                      {/* Icon */}
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                        background: m.color + '18',
                        border: `1px solid ${m.color}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <i className={`bi ${m.icon}`} style={{ color: m.color, fontSize: '0.88rem' }} />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: m.color, fontWeight: 500 }}>
                            {m.label}
                          </span>
                          {log.entity_name && (
                            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>
                              · {log.entity_name}
                            </span>
                          )}
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#d0d0d0', fontWeight: 300, marginTop: '0.2rem', lineHeight: 1.5 }}>
                          {log.description}
                        </p>

                        {/* Details pills */}
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                            {Object.entries(log.details).map(([k, v]) => (
                              <span key={k} style={{
                                fontSize: '0.6rem', letterSpacing: '0.08em',
                                padding: '0.15rem 0.5rem',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: 'rgba(255,255,255,0.45)',
                              }}>
                                {k}: {String(v)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: user + date */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        {log.user_email && (
                          <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
                            <i className="bi bi-person" style={{ marginRight: '0.3rem' }} />
                            {log.user_email.split('@')[0]}
                          </p>
                        )}
                        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                          {fmtDate(log.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>
                  {total > 0 ? `${Math.min((page - 1) * PAGE_SIZE + 1, total)}–${Math.min(page * PAGE_SIZE, total)} de ${total}` : ''}
                </span>
                <Pagination page={page} total={totalPages} onChange={p => setPage(p)} />
              </div>
            </>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
