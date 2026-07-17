'use client';
import { useEffect, useState, useCallback } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { supabase, DBProject, getPrimaryImage, getProjects } from '@/lib/supabase';

const PAGE_SIZE = 10;

interface ImgRow {
  id?: string;
  src: string;
  alt: string;
  caption: string;
  is_primary: boolean;
  sort_order: number;
}

const emptyImg = (order = 0): ImgRow => ({ src: '', alt: '', caption: '', is_primary: false, sort_order: order });

// ── Shared styles ────────────────────────────────────────
const inp: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.85rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontFamily: "'Roboto', sans-serif",
  fontSize: '0.85rem', outline: 'none',
  transition: 'border-color 0.2s',
};
const lbl: React.CSSProperties = {
  fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem',
};
const btnRed: React.CSSProperties = {
  padding: '0.7rem 1.6rem', background: '#C11D2A', border: 'none',
  color: '#fff', cursor: 'pointer', fontFamily: "'Roboto', sans-serif",
  fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase',
};
const btnGhost: React.CSSProperties = {
  padding: '0.65rem 1.4rem', background: 'none',
  border: '1px solid rgba(255,255,255,0.2)',
  color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
  fontFamily: "'Roboto', sans-serif",
  fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase',
};
const pagBtn: React.CSSProperties = {
  minWidth: 36, height: 36, padding: '0 0.55rem',
  border: '1px solid rgba(255,255,255,0.14)',
  background: 'transparent', color: 'rgba(255,255,255,0.5)',
  fontFamily: "'Roboto', sans-serif", fontSize: '0.8rem',
  cursor: 'pointer', display: 'inline-flex',
  alignItems: 'center', justifyContent: 'center',
  transition: 'border-color 0.2s, color 0.2s, background 0.2s',
};

function Field({ label: l, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={lbl}>{l}</label>
      {children}
    </div>
  );
}

// ── Pagination component ─────────────────────────────────
function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const maxVisible = 5;
  let visiblePages = pages;
  if (total > maxVisible) {
    const start = Math.max(0, Math.min(page - 3, total - maxVisible));
    visiblePages = pages.slice(start, start + maxVisible);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
      <button style={{ ...pagBtn, opacity: page === 1 ? 0.3 : 1 }}
        disabled={page === 1} onClick={() => onChange(page - 1)}
        onMouseEnter={e => { if (page !== 1) { (e.currentTarget as HTMLElement).style.borderColor = '#C11D2A'; (e.currentTarget as HTMLElement).style.color = '#C11D2A'; }}}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>
        <i className="bi bi-chevron-left" />
      </button>

      {visiblePages[0] > 1 && (
        <>
          <button style={pagBtn} onClick={() => onChange(1)}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C11D2A'; (e.currentTarget as HTMLElement).style.color = '#C11D2A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>1</button>
          {visiblePages[0] > 2 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>…</span>}
        </>
      )}

      {visiblePages.map(n => (
        <button key={n}
          style={{ ...pagBtn, ...(n === page ? { background: '#C11D2A', borderColor: '#C11D2A', color: '#fff' } : {}) }}
          onClick={() => onChange(n)}
          onMouseEnter={e => { if (n !== page) { (e.currentTarget as HTMLElement).style.borderColor = '#C11D2A'; (e.currentTarget as HTMLElement).style.color = '#C11D2A'; }}}
          onMouseLeave={e => { if (n !== page) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}}>
          {n}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] < total && (
        <>
          {visiblePages[visiblePages.length - 1] < total - 1 && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>…</span>}
          <button style={pagBtn} onClick={() => onChange(total)}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C11D2A'; (e.currentTarget as HTMLElement).style.color = '#C11D2A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>{total}</button>
        </>
      )}

      <button style={{ ...pagBtn, opacity: page === total ? 0.3 : 1 }}
        disabled={page === total} onClick={() => onChange(page + 1)}
        onMouseEnter={e => { if (page !== total) { (e.currentTarget as HTMLElement).style.borderColor = '#C11D2A'; (e.currentTarget as HTMLElement).style.color = '#C11D2A'; }}}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>
        <i className="bi bi-chevron-right" />
      </button>
    </div>
  );
}

// ── Main component ───────────────────────────────────────
export default function AdminProyectosPage() {
  const [projects, setProjects]   = useState<DBProject[]>([]);
  const [loading,  setLoading]    = useState(true);
  const [saving,   setSaving]     = useState(false);
  const [msg,      setMsg]        = useState('');
  const [page,     setPage]       = useState(1);

  const [panelOpen,    setPanelOpen]    = useState(false);
  const [editProject,  setEditProject]  = useState<DBProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DBProject | null>(null);

  const [slug,        setSlug]        = useState('');
  const [title,       setTitle]       = useState('');
  const [location,    setLocation]    = useState('');
  const [manager,     setManager]     = useState('');
  const [architect,   setArchitect]   = useState('');
  const [dimensions,  setDimensions]  = useState('');
  const [year,        setYear]        = useState('');
  const [category,    setCategory]    = useState('');
  const [description, setDescription] = useState('');
  const [images,      setImages]      = useState<ImgRow[]>([emptyImg()]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const visible = projects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch {
      setProjects([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditProject(null);
    setSlug(''); setTitle(''); setLocation(''); setManager('');
    setArchitect(''); setDimensions(''); setYear('');
    setCategory(''); setDescription('');
    setImages([emptyImg()]);
    setMsg('');
    setPanelOpen(true);
  };

  const openEdit = (p: DBProject) => {
    setEditProject(p);
    setSlug(p.slug); setTitle(p.title);
    setLocation(p.location ?? ''); setManager(p.manager ?? '');
    setArchitect(p.architect ?? ''); setDimensions(p.dimensions ?? '');
    setYear(p.year ?? ''); setCategory(p.category ?? '');
    setDescription(p.description ?? '');
    const imgs: ImgRow[] = (p.project_images ?? []).map(i => ({
      id: i.id, src: i.src, alt: i.alt,
      caption: i.caption ?? '',
      is_primary: i.is_primary,
      sort_order: i.sort_order,
    }));
    setImages(imgs.length > 0 ? imgs : [emptyImg()]);
    setMsg('');
    setPanelOpen(true);
  };

  const closePanel = () => { setPanelOpen(false); setMsg(''); };

  const setImgField = (idx: number, field: keyof ImgRow, val: string | boolean | number) => {
    setImages(prev => prev.map((img, i) => i === idx ? { ...img, [field]: val } : img));
  };

  const setPrimary = (idx: number) => {
    setImages(prev => prev.map((img, i) => ({ ...img, is_primary: i === idx })));
  };

  const addImg = () => setImages(prev => [...prev, emptyImg(prev.length)]);

  const removeImg = (idx: number) => {
    setImages(prev => {
      const next = prev.filter((_, i) => i !== idx).map((img, i) => ({ ...img, sort_order: i }));
      if (prev[idx].is_primary && next.length > 0) next[0].is_primary = true;
      return next.length > 0 ? next : [emptyImg()];
    });
  };

  const handleSave = async () => {
    if (!slug.trim() || !title.trim()) { setMsg('⚠ Slug y Título son requeridos.'); return; }
    const validImgs = images.filter(i => i.src.trim());
    if (validImgs.length === 0) { setMsg('⚠ Agregá al menos una imagen con URL.'); return; }
    if (!validImgs.some(i => i.is_primary)) validImgs[0].is_primary = true;

    setSaving(true);
    setMsg('');

    try {
      if (editProject) {
        const { error: pErr } = await supabase.from('projects').update({
          slug: slug.trim(), title: title.trim(),
          location: location.trim() || null,
          manager: manager.trim() || null,
          architect: architect.trim() || null,
          dimensions: dimensions.trim() || null,
          year: year.trim() || null,
          category: category.trim() || null,
          description: description.trim() || null,
        }).eq('id', editProject.id);
        if (pErr) throw new Error(pErr.message);

        const { error: dErr } = await supabase.from('project_images').delete().eq('project_id', editProject.id);
        if (dErr) throw new Error(dErr.message);

        const { error: iErr } = await supabase.from('project_images').insert(
          validImgs.map((img, i) => ({
            project_id: editProject.id,
            src: img.src.trim(), alt: img.alt.trim() || img.src,
            caption: img.caption.trim() || null,
            is_primary: img.is_primary, sort_order: i,
          }))
        );
        if (iErr) throw new Error(iErr.message);
      } else {
        const { data: newP, error: pErr } = await supabase.from('projects').insert({
          slug: slug.trim(), title: title.trim(),
          location: location.trim() || null,
          manager: manager.trim() || null,
          architect: architect.trim() || null,
          dimensions: dimensions.trim() || null,
          year: year.trim() || null,
          category: category.trim() || null,
          description: description.trim() || null,
        }).select().single();
        if (pErr) throw new Error(pErr.message);

        const { error: iErr } = await supabase.from('project_images').insert(
          validImgs.map((img, i) => ({
            project_id: newP.id,
            src: img.src.trim(), alt: img.alt.trim() || img.src,
            caption: img.caption.trim() || null,
            is_primary: img.is_primary, sort_order: i,
          }))
        );
        if (iErr) throw new Error(iErr.message);
      }

      // Refresh list THEN close panel
      await load();
      setMsg('');
      // Brief success flash before close
      setSaving(false);
      setTimeout(() => { closePanel(); }, 600);
      return;

    } catch (e: unknown) {
      setMsg('Error: ' + (e instanceof Error ? e.message : 'Error desconocido.'));
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from('projects').delete().eq('id', deleteTarget.id);
    if (!error) {
      setDeleteTarget(null);
      // If we deleted the last item on a page, go back one
      const newTotal = Math.max(1, Math.ceil((projects.length - 1) / PAGE_SIZE));
      if (page > newTotal) setPage(newTotal);
      await load();
    }
  };

  const autoSlug = (t: string) =>
    t.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim().replace(/\s+/g, '-');

  return (
    <AdminGuard>
      <div style={{ paddingTop: 220, minHeight: '100vh', background: '#151515' }}>
        <div className="max-w-[1290px] mx-auto px-6 lg:px-10 py-14">

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="section-eyebrow">Admin</p>
              <h1 style={{ fontFamily: "'Roboto Flex',sans-serif", fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 200, letterSpacing: '0.08em', color: '#fff' }}>
                Proyectos
              </h1>
              <div style={{ width: 36, height: 1.5, background: '#C11D2A', marginTop: '0.7rem' }} />
            </div>
            <button style={btnRed} onClick={openNew}>
              <i className="bi bi-plus-lg" style={{ marginRight: '0.4rem' }} />
              Nuevo Proyecto
            </button>
          </div>

          {/* Count */}
          {!loading && (
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              {projects.length} proyecto{projects.length !== 1 ? 's' : ''} · Página {page} de {totalPages}
            </p>
          )}

          {/* Table */}
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Cargando proyectos…</p>
          ) : (
            <>
              <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['Thumbnail','Título','Año','Ubicación','Imgs','Acciones'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map(p => {
                      const primary = getPrimaryImage(p);
                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)')}
                          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                          <td style={{ padding: '0.7rem 1rem' }}>
                            {primary?.src ? (
                              <img src={primary.src} alt={primary.alt} style={{ width: 72, height: 48, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }} />
                            ) : (
                              <div style={{ width: 72, height: 48, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="bi bi-image" style={{ color: '#333' }} />
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '0.7rem 1rem', color: '#e0e0e0' }}>
                            <div style={{ fontWeight: 400 }}>{p.title}</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.2rem' }}>{p.slug}</div>
                          </td>
                          <td style={{ padding: '0.7rem 1rem', color: 'rgba(255,255,255,0.5)' }}>{p.year ?? '—'}</td>
                          <td style={{ padding: '0.7rem 1rem', color: 'rgba(255,255,255,0.5)', maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.location ?? '—'}</td>
                          <td style={{ padding: '0.7rem 1rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>{p.project_images?.length ?? 0}</td>
                          <td style={{ padding: '0.7rem 1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => openEdit(p)}
                                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.6)', padding: '0.3rem 0.8rem', cursor: 'pointer', fontSize: '0.72rem', transition: 'all 0.2s' }}
                                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#C11D2A'; el.style.color = '#C11D2A'; }}
                                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.18)'; el.style.color = 'rgba(255,255,255,0.6)'; }}>
                                <i className="bi bi-pencil" /> Editar
                              </button>
                              <button onClick={() => setDeleteTarget(p)}
                                style={{ background: 'none', border: 'none', color: 'rgba(193,29,42,0.6)', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '1rem', transition: 'color 0.2s' }}
                                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C11D2A')}
                                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(193,29,42,0.6)')}>
                                <i className="bi bi-trash" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {projects.length === 0 && (
                  <p style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>
                    No hay proyectos. ¡Creá el primero!
                  </p>
                )}
              </div>

              {/* Pagination */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>
                  Mostrando {Math.min((page - 1) * PAGE_SIZE + 1, projects.length)}–{Math.min(page * PAGE_SIZE, projects.length)} de {projects.length}
                </span>
                <Pagination page={page} total={totalPages} onChange={p => setPage(p)} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Slide panel ── */}
      {panelOpen && (
        <>
          <div onClick={closePanel} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 900 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 640, background: '#111', zIndex: 901, overflowY: 'auto', boxShadow: '-4px 0 40px rgba(0,0,0,0.6)' }}>

            {/* Panel header */}
            <div style={{ position: 'sticky', top: 0, background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
              <div>
                <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A' }}>
                  {editProject ? 'Editar' : 'Nuevo'} Proyecto
                </p>
                <h2 style={{ fontFamily: "'Roboto Flex',sans-serif", fontSize: '1.2rem', fontWeight: 200, color: '#fff', letterSpacing: '0.06em', marginTop: '0.2rem' }}>
                  {title || (editProject ? editProject.title : 'Sin título')}
                </h2>
              </div>
              <button onClick={closePanel} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.6rem', cursor: 'pointer', lineHeight: 1, padding: '0 0.4rem' }}>×</button>
            </div>

            {/* Form body */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

              <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A', borderBottom: '1px solid rgba(193,29,42,0.2)', paddingBottom: '0.5rem' }}>
                Información General
              </p>

              <Field label="Título *">
                <input style={inp} value={title} placeholder="Casa Ejemplo"
                  onChange={e => { setTitle(e.target.value); if (!editProject) setSlug(autoSlug(e.target.value)); }}
                  onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </Field>

              <Field label="Slug (URL) *">
                <input style={inp} value={slug} placeholder="casa-ejemplo"
                  onChange={e => setSlug(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.3rem' }}>
                  /proyectos/{slug || 'casa-ejemplo'}/
                </p>
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Año">
                  <input style={inp} value={year} placeholder="2024"
                    onChange={e => setYear(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </Field>
                <Field label="Categoría">
                  <input style={inp} value={category} placeholder="Residencial"
                    onChange={e => setCategory(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </Field>
              </div>

              <Field label="Ubicación">
                <input style={inp} value={location} placeholder="San José, Costa Rica"
                  onChange={e => setLocation(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Arquitecto">
                  <input style={inp} value={architect} placeholder="Arq. Nombre"
                    onChange={e => setArchitect(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </Field>
                <Field label="Project Manager">
                  <input style={inp} value={manager} placeholder="Nombre PM"
                    onChange={e => setManager(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </Field>
              </div>

              <Field label="Dimensiones">
                <input style={inp} value={dimensions} placeholder="250 Metros Cuadrados"
                  onChange={e => setDimensions(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </Field>

              <Field label="Descripción">
                <textarea style={{ ...inp, minHeight: 100, resize: 'vertical' }}
                  value={description} placeholder="Descripción del proyecto…"
                  onChange={e => setDescription(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </Field>

              {/* Images section */}
              <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A', borderBottom: '1px solid rgba(193,29,42,0.2)', paddingBottom: '0.5rem', marginTop: '0.5rem' }}>
                Imágenes
              </p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                <i className="bi bi-star-fill" style={{ color: '#C11D2A', marginRight: '0.4rem' }} />
                La imagen <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Principal</strong> aparece en la grilla y como portada del proyecto.
              </p>

              {images.map((img, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: img.is_primary ? '1px solid rgba(193,29,42,0.4)' : '1px solid rgba(255,255,255,0.07)', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                    <input type="radio" id={`pri-${idx}`} name="primary-image" checked={img.is_primary}
                      onChange={() => setPrimary(idx)} style={{ accentColor: '#C11D2A', cursor: 'pointer' }} />
                    <label htmlFor={`pri-${idx}`} style={{ ...lbl, margin: 0, cursor: 'pointer', color: img.is_primary ? '#C11D2A' : 'rgba(255,255,255,0.4)', fontSize: '0.68rem' }}>
                      {img.is_primary ? '★ Imagen Principal' : 'Marcar como Principal'}
                    </label>
                    <button onClick={() => removeImg(idx)}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(193,29,42,0.5)', cursor: 'pointer', fontSize: '1rem', padding: 0 }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C11D2A')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(193,29,42,0.5)')}>
                      <i className="bi bi-trash" />
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={lbl}>URL de la imagen *</label>
                      <input style={inp} value={img.src} placeholder="https://…/imagen.jpg"
                        onChange={e => setImgField(idx, 'src', e.target.value)}
                        onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                    </div>
                    {img.src && (
                      <img src={img.src} alt="preview"
                        style={{ width: 72, height: 48, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)', marginTop: 22, flexShrink: 0 }}
                        onError={e => ((e.target as HTMLImageElement).style.opacity = '0')} />
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <div>
                      <label style={lbl}>Alt text</label>
                      <input style={inp} value={img.alt} placeholder="Descripción imagen"
                        onChange={e => setImgField(idx, 'alt', e.target.value)}
                        onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                    </div>
                    <div>
                      <label style={lbl}>Caption (opcional)</label>
                      <input style={inp} value={img.caption} placeholder="Fachada Principal"
                        onChange={e => setImgField(idx, 'caption', e.target.value)}
                        onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                    </div>
                  </div>
                </div>
              ))}

              <button onClick={addImg} style={{ ...btnGhost, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="bi bi-plus-lg" /> Agregar imagen
              </button>

              {/* Message */}
              {msg && (
                <p style={{ fontSize: '0.8rem', color: msg.startsWith('Error') || msg.startsWith('⚠') ? '#C11D2A' : '#4caf50', letterSpacing: '0.04em' }}>
                  {msg}
                </p>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button style={{ ...btnRed, opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving}>
                  {saving ? 'Guardando…' : editProject ? 'Actualizar' : 'Crear Proyecto'}
                </button>
                <button style={btnGhost} onClick={closePanel}>Cancelar</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Delete confirm ── */}
      {deleteTarget && (
        <>
          <div onClick={() => setDeleteTarget(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 950 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#111', border: '1px solid rgba(193,29,42,0.3)', padding: '2.5rem 2rem', maxWidth: 380, width: '90%', zIndex: 951, textAlign: 'center' }}>
            <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem', color: '#C11D2A', display: 'block', marginBottom: '1rem' }} />
            <h3 style={{ fontFamily: "'Roboto Flex',sans-serif", fontWeight: 200, color: '#fff', marginBottom: '0.6rem' }}>Eliminar Proyecto</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1.8rem' }}>
              ¿Eliminar <strong style={{ color: '#fff' }}>{deleteTarget.title}</strong>? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button style={btnRed} onClick={handleDelete}>Sí, eliminar</button>
              <button style={btnGhost} onClick={() => setDeleteTarget(null)}>Cancelar</button>
            </div>
          </div>
        </>
      )}
    </AdminGuard>
  );
}
