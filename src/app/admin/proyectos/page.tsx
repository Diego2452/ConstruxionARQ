'use client';
import { useEffect, useState, useCallback } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { supabase, DBProject, DBImage, getProjects, getPrimaryImage } from '@/lib/supabase';

// ── Image row state ──────────────────────────────────────
interface ImgRow {
  id?: string;
  src: string;
  alt: string;
  caption: string;
  is_primary: boolean;
  sort_order: number;
}

const emptyImg = (order = 0): ImgRow => ({ src: '', alt: '', caption: '', is_primary: false, sort_order: order });

// ── Styles ───────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.85rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontFamily: "'Roboto', sans-serif",
  fontSize: '0.85rem', outline: 'none',
  transition: 'border-color 0.2s',
};
const label: React.CSSProperties = {
  fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem',
};
const btnPrimary: React.CSSProperties = {
  padding: '0.7rem 1.6rem', background: '#C11D2A', border: 'none',
  color: '#fff', cursor: 'pointer', fontFamily: "'Roboto', sans-serif",
  fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase',
};
const btnSecondary: React.CSSProperties = {
  padding: '0.65rem 1.4rem', background: 'none',
  border: '1px solid rgba(255,255,255,0.2)',
  color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
  fontFamily: "'Roboto', sans-serif",
  fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase',
};

// ── Form field ───────────────────────────────────────────
function Field({ label: lbl, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={label}>{lbl}</label>
      {children}
    </div>
  );
}

export default function AdminProyectosPage() {
  const [projects, setProjects]   = useState<DBProject[]>([]);
  const [loading,  setLoading]    = useState(true);
  const [saving,   setSaving]     = useState(false);
  const [msg,      setMsg]        = useState('');

  // Panel state
  const [panelOpen,    setPanelOpen]    = useState(false);
  const [editProject,  setEditProject]  = useState<DBProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DBProject | null>(null);

  // Form fields
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

  // ── Load projects ──────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    const data = await getProjects().catch(() => []);
    setProjects(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Open panel (new or edit) ───────────────────────────
  const openNew = () => {
    setEditProject(null);
    setSlug(''); setTitle(''); setLocation(''); setManager('');
    setArchitect(''); setDimensions(''); setYear('');
    setCategory(''); setDescription('');
    setImages([emptyImg()]);
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
    setPanelOpen(true);
  };

  const closePanel = () => { setPanelOpen(false); setMsg(''); };

  // ── Image helpers ──────────────────────────────────────
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
      // If we removed primary, set first as primary
      if (prev[idx].is_primary && next.length > 0) next[0].is_primary = true;
      return next.length > 0 ? next : [emptyImg()];
    });
  };

  // ── Save ───────────────────────────────────────────────
  const handleSave = async () => {
    if (!slug || !title) { setMsg('Slug y Título son requeridos.'); return; }
    const validImgs = images.filter(i => i.src.trim());
    if (validImgs.length === 0) { setMsg('Agregá al menos una imagen con URL.'); return; }
    // Ensure exactly one primary
    const hasPrimary = validImgs.some(i => i.is_primary);
    if (!hasPrimary) validImgs[0].is_primary = true;

    setSaving(true);
    setMsg('');

    try {
      if (editProject) {
        // Update project
        const { error: pErr } = await supabase.from('projects').update({
          slug, title, location: location || null, manager: manager || null,
          architect: architect || null, dimensions: dimensions || null,
          year: year || null, category: category || null,
          description: description || null,
        }).eq('id', editProject.id);
        if (pErr) throw pErr;

        // Delete existing images then re-insert
        await supabase.from('project_images').delete().eq('project_id', editProject.id);
        const imgRows = validImgs.map((img, i) => ({
          project_id: editProject.id,
          src: img.src, alt: img.alt || img.src,
          caption: img.caption || null,
          is_primary: img.is_primary,
          sort_order: i,
        }));
        const { error: iErr } = await supabase.from('project_images').insert(imgRows);
        if (iErr) throw iErr;
        setMsg('✓ Proyecto actualizado.');
      } else {
        // Create project
        const { data: newP, error: pErr } = await supabase.from('projects').insert({
          slug, title, location: location || null, manager: manager || null,
          architect: architect || null, dimensions: dimensions || null,
          year: year || null, category: category || null,
          description: description || null,
        }).select().single();
        if (pErr) throw pErr;

        const imgRows = validImgs.map((img, i) => ({
          project_id: newP.id,
          src: img.src, alt: img.alt || img.src,
          caption: img.caption || null,
          is_primary: img.is_primary,
          sort_order: i,
        }));
        const { error: iErr } = await supabase.from('project_images').insert(imgRows);
        if (iErr) throw iErr;
        setMsg('✓ Proyecto creado. Se mostrará en /proyectos/ de inmediato.');
      }
      await load();
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? 'Error desconocido.';
      setMsg('Error: ' + msg);
    }
    setSaving(false);
  };

  // ── Delete ─────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from('projects').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    await load();
  };

  // ── Generate slug from title ───────────────────────────
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
            <button style={btnPrimary} onClick={openNew}>
              <i className="bi bi-plus-lg" /> Nuevo Proyecto
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Cargando proyectos…</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    {['Thumbnail', 'Título', 'Año', 'Ubicación', 'Imágenes', 'Acciones'].map(h => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => {
                    const primary = getPrimaryImage(p);
                    return (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                      >
                        <td style={{ padding: '0.7rem 1rem' }}>
                          {primary ? (
                            <img src={primary.src} alt={primary.alt}
                              style={{ width: 72, height: 48, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)' }} />
                          ) : (
                            <div style={{ width: 72, height: 48, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <i className="bi bi-image" style={{ color: '#333' }} />
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '0.7rem 1rem', color: '#e0e0e0' }}>
                          <div style={{ fontWeight: 400 }}>{p.title}</div>
                          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>{p.slug}</div>
                        </td>
                        <td style={{ padding: '0.7rem 1rem', color: 'rgba(255,255,255,0.5)' }}>{p.year ?? '—'}</td>
                        <td style={{ padding: '0.7rem 1rem', color: 'rgba(255,255,255,0.5)', maxWidth: 180 }}>{p.location ?? '—'}</td>
                        <td style={{ padding: '0.7rem 1rem', color: 'rgba(255,255,255,0.5)' }}>
                          {p.project_images?.length ?? 0}
                        </td>
                        <td style={{ padding: '0.7rem 1rem' }}>
                          <div style={{ display: 'flex', gap: '0.6rem' }}>
                            <button onClick={() => openEdit(p)}
                              style={{ background: 'none', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.6)', padding: '0.3rem 0.8rem', cursor: 'pointer', fontSize: '0.72rem', letterSpacing: '0.08em', transition: 'border-color 0.2s, color 0.2s' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C11D2A'; (e.currentTarget as HTMLElement).style.color = '#C11D2A'; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
                            >
                              <i className="bi bi-pencil" /> Editar
                            </button>
                            <button onClick={() => setDeleteTarget(p)}
                              style={{ background: 'none', border: 'none', color: 'rgba(193,29,42,0.6)', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '0.72rem', transition: 'color 0.2s' }}
                              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C11D2A')}
                              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(193,29,42,0.6)')}
                            >
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
                  No hay proyectos aún. ¡Creá el primero!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Slide panel ── */}
      {panelOpen && (
        <>
          {/* Backdrop */}
          <div onClick={closePanel} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 900 }} />

          {/* Panel */}
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 620,
            background: '#111', zIndex: 901,
            overflowY: 'auto',
            boxShadow: '-4px 0 40px rgba(0,0,0,0.6)',
          }}>
            {/* Panel header */}
            <div style={{ position: 'sticky', top: 0, background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
              <div>
                <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A' }}>
                  {editProject ? 'Editar' : 'Nuevo'} Proyecto
                </p>
                <h2 style={{ fontFamily: "'Roboto Flex',sans-serif", fontSize: '1.2rem', fontWeight: 200, color: '#fff', letterSpacing: '0.06em', marginTop: '0.2rem' }}>
                  {editProject ? editProject.title : 'Sin título'}
                </h2>
              </div>
              <button onClick={closePanel} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1 }}>
                ×
              </button>
            </div>

            {/* Form */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

              {/* ── Basic info ── */}
              <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A', borderBottom: '1px solid rgba(193,29,42,0.2)', paddingBottom: '0.5rem' }}>
                Información General
              </p>

              <Field label="Título *">
                <input style={inp} value={title}
                  onChange={e => { setTitle(e.target.value); if (!editProject) setSlug(autoSlug(e.target.value)); }}
                  onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  placeholder="Casa Ejemplo"
                />
              </Field>

              <Field label="Slug (URL) *">
                <input style={inp} value={slug}
                  onChange={e => setSlug(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  placeholder="casa-ejemplo"
                />
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.3rem' }}>
                  URL: /proyectos/{slug || 'casa-ejemplo'}/
                </p>
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Año">
                  <input style={inp} value={year} onChange={e => setYear(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    placeholder="2024" />
                </Field>
                <Field label="Categoría">
                  <input style={inp} value={category} onChange={e => setCategory(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    placeholder="Residencial" />
                </Field>
              </div>

              <Field label="Ubicación">
                <input style={inp} value={location} onChange={e => setLocation(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  placeholder="San José, Costa Rica" />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Arquitecto">
                  <input style={inp} value={architect} onChange={e => setArchitect(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    placeholder="Arq. Nombre" />
                </Field>
                <Field label="Project Manager">
                  <input style={inp} value={manager} onChange={e => setManager(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                    placeholder="Nombre PM" />
                </Field>
              </div>

              <Field label="Dimensiones">
                <input style={inp} value={dimensions} onChange={e => setDimensions(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  placeholder="250 Metros Cuadrados" />
              </Field>

              <Field label="Descripción">
                <textarea style={{ ...inp, minHeight: 100, resize: 'vertical' }}
                  value={description} onChange={e => setDescription(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  placeholder="Descripción del proyecto…"
                />
              </Field>

              {/* ── Images ── */}
              <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A', borderBottom: '1px solid rgba(193,29,42,0.2)', paddingBottom: '0.5rem', marginTop: '0.5rem' }}>
                Imágenes
              </p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
                <i className="bi bi-star-fill" style={{ color: '#C11D2A', marginRight: '0.4rem' }} />
                Marcá una imagen como <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Principal</strong> — es la que aparece en la grilla de Proyectos y como portada en la página del proyecto.
              </p>

              {images.map((img, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '1rem', position: 'relative' }}>
                  {/* Primary radio */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                    <input type="radio" id={`primary-${idx}`} name="primary-image" checked={img.is_primary}
                      onChange={() => setPrimary(idx)}
                      style={{ accentColor: '#C11D2A', cursor: 'pointer' }}
                    />
                    <label htmlFor={`primary-${idx}`} style={{ ...label, margin: 0, cursor: 'pointer', color: img.is_primary ? '#C11D2A' : 'rgba(255,255,255,0.4)' }}>
                      {img.is_primary ? '★ Imagen Principal' : 'Marcar como Principal'}
                    </label>
                    <button onClick={() => removeImg(idx)}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(193,29,42,0.5)', cursor: 'pointer', fontSize: '1rem' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C11D2A')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(193,29,42,0.5)')}
                    >
                      <i className="bi bi-trash" />
                    </button>
                  </div>

                  {/* URL + preview */}
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <div style={{ flex: 1 }}>
                      <label style={label}>URL de la imagen *</label>
                      <input style={inp} value={img.src} placeholder="https://…/imagen.jpg"
                        onChange={e => setImgField(idx, 'src', e.target.value)}
                        onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>
                    {img.src && (
                      <img src={img.src} alt="preview"
                        style={{ width: 72, height: 48, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)', marginTop: 22, flexShrink: 0 }}
                        onError={e => ((e.target as HTMLImageElement).style.display = 'none')}
                      />
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <div>
                      <label style={label}>Alt text</label>
                      <input style={inp} value={img.alt} placeholder="Descripción imagen"
                        onChange={e => setImgField(idx, 'alt', e.target.value)}
                        onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>
                    <div>
                      <label style={label}>Caption (opcional)</label>
                      <input style={inp} value={img.caption} placeholder="Ej: Fachada Principal"
                        onChange={e => setImgField(idx, 'caption', e.target.value)}
                        onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button onClick={addImg} style={{ ...btnSecondary, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="bi bi-plus-lg" /> Agregar imagen
              </button>

              {/* ── Footer buttons ── */}
              {msg && (
                <p style={{ fontSize: '0.8rem', color: msg.startsWith('Error') ? '#C11D2A' : '#4caf50', letterSpacing: '0.04em' }}>
                  {msg}
                </p>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button style={btnPrimary} onClick={handleSave} disabled={saving}>
                  {saving ? 'Guardando…' : (editProject ? 'Actualizar Proyecto' : 'Crear Proyecto')}
                </button>
                <button style={btnSecondary} onClick={closePanel}>
                  Cancelar
                </button>
              </div>

              {editProject && (
                <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>
                  <i className="bi bi-info-circle" /> Los cambios en /proyectos/ son inmediatos. La página /proyectos/{editProject.slug}/ se actualiza en el próximo deploy.
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── Delete confirm ── */}
      {deleteTarget && (
        <>
          <div onClick={() => setDeleteTarget(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 950 }} />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            background: '#111', border: '1px solid rgba(193,29,42,0.3)',
            padding: '2.5rem 2rem', maxWidth: 380, width: '90%', zIndex: 951,
            textAlign: 'center',
          }}>
            <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem', color: '#C11D2A', display: 'block', marginBottom: '1rem' }} />
            <h3 style={{ fontFamily: "'Roboto Flex',sans-serif", fontWeight: 200, color: '#fff', marginBottom: '0.6rem' }}>
              Eliminar Proyecto
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1.8rem' }}>
              ¿Seguro que querés eliminar <strong style={{ color: '#fff' }}>{deleteTarget.title}</strong>? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button style={{ ...btnPrimary, background: '#C11D2A' }} onClick={handleDelete}>
                Sí, eliminar
              </button>
              <button style={btnSecondary} onClick={() => setDeleteTarget(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}
    </AdminGuard>
  );
}
