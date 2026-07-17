'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { supabase, DBProject, getPrimaryImage, getProjects } from '@/lib/supabase';
import { logAction } from '@/lib/audit';

const PAGE_SIZE = 10;

interface ImgRow {
  id?:        string;
  src:        string;   // URL final (Supabase Storage o externa)
  alt:        string;   // requerido
  caption:    string;   // requerido
  is_primary: boolean;
  sort_order: number;
  uploading?: boolean;
  uploadErr?: string;
}

const emptyImg = (order = 0): ImgRow => ({
  src: '', alt: '', caption: '', is_primary: false, sort_order: order,
});

// ── Upload a file to project-images bucket ───────────────
async function uploadFile(file: File, slug: string): Promise<string> {
  const ext  = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const name = `${slug}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('project-images')
    .upload(name, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('project-images').getPublicUrl(name);
  return data.publicUrl;
}

// ── Validate form ────────────────────────────────────────
function validate(
  slug: string, title: string, images: ImgRow[]
): string | null {
  if (!slug.trim())  return 'El slug es requerido.';
  if (!title.trim()) return 'El título es requerido.';

  const filled = images.filter(i => i.src.trim());
  if (filled.length === 0) return 'Agregá al menos una imagen.';

  for (let i = 0; i < filled.length; i++) {
    const img = filled[i];
    if (!img.src.trim())     return `Imagen ${i + 1}: falta la URL / imagen subida.`;
    if (!img.alt.trim())     return `Imagen ${i + 1}: el campo Alt text es requerido.`;
    if (!img.caption.trim()) return `Imagen ${i + 1}: el Caption es requerido.`;
  }

  if (!filled.some(i => i.is_primary)) return 'Marcá una imagen como Principal.';
  return null;
}

// ── Styles ───────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.85rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontFamily: "'Roboto', sans-serif",
  fontSize: '0.85rem', outline: 'none',
  transition: 'border-color 0.2s',
};
const inpError: React.CSSProperties = {
  ...inp,
  border: '1px solid rgba(193,29,42,0.6)',
};
const lbl: React.CSSProperties = {
  fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem',
};
const lblRequired: React.CSSProperties = { ...lbl, color: 'rgba(255,255,255,0.55)' };
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
  fontFamily: "'Roboto', sans-serif", fontSize: '0.8rem', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  transition: 'border-color 0.2s, color 0.2s, background 0.2s',
};

function Field({ label: l, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={required ? lblRequired : lbl}>
        {l}{required && <span style={{ color: '#C11D2A', marginLeft: '0.2rem' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

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
      <button style={{ ...pagBtn, opacity: page === 1 ? 0.3 : 1 }} disabled={page === 1}
        onClick={() => onChange(page - 1)}
        onMouseEnter={e => { if (page !== 1) hov(e.currentTarget as HTMLElement, true); }}
        onMouseLeave={e => hov(e.currentTarget as HTMLElement, false)}>
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
      <button style={{ ...pagBtn, opacity: page === total ? 0.3 : 1 }} disabled={page === total}
        onClick={() => onChange(page + 1)}
        onMouseEnter={e => { if (page !== total) hov(e.currentTarget as HTMLElement, true); }}
        onMouseLeave={e => hov(e.currentTarget as HTMLElement, false)}>
        <i className="bi bi-chevron-right" />
      </button>
    </div>
  );
}

// ── Image row component ──────────────────────────────────
function ImageRow({
  img, idx, total, slug, touched,
  onChange, onPrimary, onRemove,
}: {
  img: ImgRow; idx: number; total: number; slug: string; touched: boolean;
  onChange: (idx: number, f: keyof ImgRow, v: string | boolean | number) => void;
  onPrimary: (idx: number) => void;
  onRemove: (idx: number) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange(idx, 'uploading', true);
    onChange(idx, 'uploadErr', '');
    try {
      const url = await uploadFile(file, slug || 'sin-slug');
      onChange(idx, 'src', url);
    } catch (err: unknown) {
      onChange(idx, 'uploadErr', (err as Error).message);
    }
    onChange(idx, 'uploading', false);
    // Reset file input
    if (fileRef.current) fileRef.current.value = '';
  };

  const missingUrl     = touched && !img.src.trim();
  const missingAlt     = touched && !img.alt.trim();
  const missingCaption = touched && !img.caption.trim();

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: img.is_primary
        ? '1px solid rgba(193,29,42,0.5)'
        : missingUrl ? '1px solid rgba(193,29,42,0.35)' : '1px solid rgba(255,255,255,0.07)',
      padding: '1.2rem',
    }}>
      {/* Header: primary radio + label + delete */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <input type="radio" id={`pri-${idx}`} name="primary-image" checked={img.is_primary}
          onChange={() => onPrimary(idx)} style={{ accentColor: '#C11D2A', cursor: 'pointer', width: 16, height: 16 }} />
        <label htmlFor={`pri-${idx}`} style={{ ...lbl, margin: 0, cursor: 'pointer', color: img.is_primary ? '#C11D2A' : 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
          {img.is_primary ? '★ Imagen Principal' : `Imagen ${idx + 1} — Marcar como Principal`}
        </label>
        {total > 1 && (
          <button onClick={() => onRemove(idx)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(193,29,42,0.5)', cursor: 'pointer', fontSize: '1rem', padding: '0 0.2rem', flexShrink: 0 }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C11D2A')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(193,29,42,0.5)')}>
            <i className="bi bi-trash" />
          </button>
        )}
      </div>

      {/* Preview + upload */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.8rem', flexWrap: 'wrap' }}>

        {/* Preview box */}
        <div style={{
          width: 120, height: 80, flexShrink: 0,
          background: '#1a1a1a',
          border: missingUrl ? '1.5px dashed rgba(193,29,42,0.6)' : '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', position: 'relative',
        }}>
          {img.uploading ? (
            <div style={{ textAlign: 'center' }}>
              <i className="bi bi-arrow-repeat" style={{ fontSize: '1.2rem', color: '#C11D2A', display: 'block', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem' }}>Subiendo…</p>
            </div>
          ) : img.src ? (
            <img src={img.src} alt="preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <div style={{ textAlign: 'center', padding: '0.5rem' }}>
              <i className="bi bi-image" style={{ fontSize: '1.5rem', color: missingUrl ? 'rgba(193,29,42,0.6)' : '#333', display: 'block' }} />
              {missingUrl && <p style={{ fontSize: '0.58rem', color: '#C11D2A', marginTop: '0.3rem' }}>Requerida</p>}
            </div>
          )}
        </div>

        {/* Upload controls */}
        <div style={{ flex: 1, minWidth: 200 }}>
          {/* File upload button */}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={img.uploading}
            style={{ ...btnGhost, width: '100%', marginBottom: '0.5rem', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: img.uploading ? 0.5 : 1 }}>
            <i className={`bi ${img.src ? 'bi-arrow-repeat' : 'bi-upload'}`} />
            {img.uploading ? 'Subiendo…' : img.src ? 'Reemplazar imagen' : 'Subir imagen'}
          </button>

          {/* URL manual input */}
          <div>
            <label style={{ ...lbl, fontSize: '0.58rem' }}>O pegar URL externa</label>
            <input
              style={missingUrl ? inpError : inp}
              value={img.src}
              placeholder="https://construxionarq.com/wp-content/uploads/…"
              onChange={e => onChange(idx, 'src', e.target.value)}
              onFocus={e => (e.target.style.borderColor = '#C11D2A')}
              onBlur={e => (e.target.style.borderColor = missingUrl ? 'rgba(193,29,42,0.6)' : 'rgba(255,255,255,0.1)')}
            />
            {missingUrl && <p style={{ fontSize: '0.62rem', color: '#C11D2A', marginTop: '0.25rem' }}>Subí una imagen o pegá una URL.</p>}
          </div>

          {img.uploadErr && (
            <p style={{ fontSize: '0.68rem', color: '#C11D2A', marginTop: '0.3rem' }}>
              <i className="bi bi-exclamation-triangle" /> {img.uploadErr}
            </p>
          )}
        </div>
      </div>

      {/* Alt + Caption */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
        <div>
          <label style={missingAlt ? { ...lblRequired, color: '#C11D2A' } : lblRequired}>
            Alt text <span style={{ color: '#C11D2A' }}>*</span>
          </label>
          <input
            style={missingAlt ? inpError : inp}
            value={img.alt}
            placeholder="Descripción de la imagen"
            onChange={e => onChange(idx, 'alt', e.target.value)}
            onFocus={e => (e.target.style.borderColor = '#C11D2A')}
            onBlur={e => (e.target.style.borderColor = missingAlt ? 'rgba(193,29,42,0.6)' : 'rgba(255,255,255,0.1)')}
          />
          {missingAlt && <p style={{ fontSize: '0.62rem', color: '#C11D2A', marginTop: '0.25rem' }}>Requerido.</p>}
        </div>
        <div>
          <label style={missingCaption ? { ...lblRequired, color: '#C11D2A' } : lblRequired}>
            Caption <span style={{ color: '#C11D2A' }}>*</span>
          </label>
          <input
            style={missingCaption ? inpError : inp}
            value={img.caption}
            placeholder="Ej: Fachada Principal"
            onChange={e => onChange(idx, 'caption', e.target.value)}
            onFocus={e => (e.target.style.borderColor = '#C11D2A')}
            onBlur={e => (e.target.style.borderColor = missingCaption ? 'rgba(193,29,42,0.6)' : 'rgba(255,255,255,0.1)')}
          />
          {missingCaption && <p style={{ fontSize: '0.62rem', color: '#C11D2A', marginTop: '0.25rem' }}>Requerido.</p>}
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────
export default function AdminProyectosPage() {
  const [projects, setProjects]   = useState<DBProject[]>([]);
  const [loading,  setLoading]    = useState(true);
  const [saving,   setSaving]     = useState(false);
  const [msg,      setMsg]        = useState('');
  const [page,     setPage]       = useState(1);
  const [panelOpen,    setPanelOpen]    = useState(false);
  const [editProject,  setEditProject]  = useState<DBProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DBProject | null>(null);
  const [touched,      setTouched]      = useState(false);

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

  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const visible    = projects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const load = useCallback(async () => {
    setLoading(true);
    try { setProjects(await getProjects()); } catch { setProjects([]); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditProject(null); setTouched(false);
    setSlug(''); setTitle(''); setLocation(''); setManager('');
    setArchitect(''); setDimensions(''); setYear('');
    setCategory(''); setDescription('');
    setImages([emptyImg()]); setMsg('');
    setPanelOpen(true);
  };

  const openEdit = (p: DBProject) => {
    setEditProject(p); setTouched(false);
    setSlug(p.slug); setTitle(p.title);
    setLocation(p.location ?? ''); setManager(p.manager ?? '');
    setArchitect(p.architect ?? ''); setDimensions(p.dimensions ?? '');
    setYear(p.year ?? ''); setCategory(p.category ?? '');
    setDescription(p.description ?? '');
    const imgs: ImgRow[] = (p.project_images ?? []).map((i, order) => ({
      id: i.id, src: i.src, alt: i.alt,
      caption: i.caption ?? '',
      is_primary: i.is_primary,
      sort_order: i.sort_order ?? order,
    }));
    setImages(imgs.length > 0 ? imgs : [emptyImg()]);
    setMsg('');
    setPanelOpen(true);
  };

  const closePanel = () => { setPanelOpen(false); setMsg(''); setTouched(false); };

  const changeImg = (idx: number, field: keyof ImgRow, val: string | boolean | number) => {
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
    setTouched(true);
    const err = validate(slug, title, images);
    if (err) { setMsg('⚠ ' + err); return; }

    // Check no image is still uploading
    if (images.some(i => i.uploading)) { setMsg('⚠ Esperá a que terminen las subidas.'); return; }

    const validImgs = images.filter(i => i.src.trim());

    setSaving(true); setMsg('');
    try {
      if (editProject) {
        const { error: pErr } = await supabase.from('projects').update({
          slug: slug.trim(), title: title.trim(),
          location: location.trim() || null, manager: manager.trim() || null,
          architect: architect.trim() || null, dimensions: dimensions.trim() || null,
          year: year.trim() || null, category: category.trim() || null,
          description: description.trim() || null,
        }).eq('id', editProject.id);
        if (pErr) throw new Error(pErr.message);

        await supabase.from('project_images').delete().eq('project_id', editProject.id);
        const { error: iErr } = await supabase.from('project_images').insert(
          validImgs.map((img, i) => ({
            project_id: editProject.id,
            src: img.src, alt: img.alt.trim(),
            caption: img.caption.trim(),
            is_primary: img.is_primary, sort_order: i,
          }))
        );
        if (iErr) throw new Error(iErr.message);

        // Build detailed audit description
        const changed: string[] = [];
        if (editProject.title    !== title.trim())       changed.push('título');
        if (editProject.location !== (location.trim() || null)) changed.push('ubicación');
        if (editProject.architect !== (architect.trim() || null)) changed.push('arquitecto');
        if (editProject.year     !== (year.trim() || null)) changed.push('año');
        if (editProject.description !== (description.trim() || null)) changed.push('descripción');
        const prevImgCount = editProject.project_images?.length ?? 0;
        const imgChanged   = prevImgCount !== validImgs.length;
        if (imgChanged) changed.push(`imágenes (${prevImgCount} → ${validImgs.length})`);

        const changeDesc = changed.length > 0
          ? `Se actualizó: ${changed.join(', ')}.`
          : 'Sin cambios en campos de texto.';

        const action = imgChanged ? 'project_images_updated' : 'project_updated';
        await logAction(action,
          `Se editó el proyecto "${title.trim()}". ${changeDesc}`,
          { entityId: editProject.id, entityName: title.trim(), details: changed.length > 0 ? Object.fromEntries(changed.map(c => [c, '✓'])) : {} }
        );
      } else {
        const { data: newP, error: pErr } = await supabase.from('projects').insert({
          slug: slug.trim(), title: title.trim(),
          location: location.trim() || null, manager: manager.trim() || null,
          architect: architect.trim() || null, dimensions: dimensions.trim() || null,
          year: year.trim() || null, category: category.trim() || null,
          description: description.trim() || null,
        }).select().single();
        if (pErr) throw new Error(pErr.message);

        const { error: iErr } = await supabase.from('project_images').insert(
          validImgs.map((img, i) => ({
            project_id: newP.id,
            src: img.src, alt: img.alt.trim(),
            caption: img.caption.trim(),
            is_primary: img.is_primary, sort_order: i,
          }))
        );
        if (iErr) throw new Error(iErr.message);

        // Audit log: created
        await logAction('project_created',
          `Se creó el proyecto "${title.trim()}" con ${validImgs.length} imagen${validImgs.length !== 1 ? 'es' : ''}.`,
          { entityId: newP.id, entityName: title.trim(), details: { slug: slug.trim(), año: year.trim() || '—', imágenes: validImgs.length } }
        );
      }

      await load();
      setSaving(false);
      setTimeout(closePanel, 500);
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
      await logAction('project_deleted',
        `Se eliminó el proyecto "${deleteTarget.title}" (slug: ${deleteTarget.slug}).`,
        { entityId: deleteTarget.id, entityName: deleteTarget.title }
      );
    }
    setDeleteTarget(null);
    const newTotal = Math.max(1, Math.ceil((projects.length - 1) / PAGE_SIZE));
    if (page > newTotal) setPage(newTotal);
    await load();
  };

  const autoSlug = (t: string) =>
    t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

  return (
    <AdminGuard>
      {/* Spin animation for upload */}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      <div style={{ paddingTop: 220, minHeight: '100vh', background: '#151515' }}>
        <div className="max-w-[1290px] mx-auto px-6 lg:px-10 py-14">

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="section-eyebrow">Admin</p>
              <h1 style={{ fontFamily: "'Roboto Flex',sans-serif", fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 200, letterSpacing: '0.08em', color: '#fff' }}>
                Proyectos
              </h1>
              <div style={{ width: 36, height: 1.5, background: '#C11D2A', marginTop: '0.7rem' }} />
            </div>
            <button style={btnRed} onClick={openNew}>
              <i className="bi bi-plus-lg" style={{ marginRight: '0.4rem' }} /> Nuevo Proyecto
            </button>
          </div>

          {!loading && (
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              {projects.length} proyecto{projects.length !== 1 ? 's' : ''} · Página {page} de {totalPages}
            </p>
          )}

          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Cargando proyectos…</p>
          ) : (
            <>
              <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['Portada','Título','Año','Imgs','Acciones'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map(p => {
                      const primary = getPrimaryImage(p);
                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)')}
                          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                          <td style={{ padding: '0.7rem 1rem' }}>
                            {primary?.src ? (
                              <img src={primary.src} alt={primary.alt} style={{ width: 80, height: 54, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.08)', display: 'block' }} />
                            ) : (
                              <div style={{ width: 80, height: 54, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="bi bi-image" style={{ color: '#333' }} />
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '0.7rem 1rem', color: '#e0e0e0' }}>
                            <div>{p.title}</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.2rem' }}>{p.slug}</div>
                          </td>
                          <td style={{ padding: '0.7rem 1rem', color: 'rgba(255,255,255,0.5)' }}>{p.year ?? '—'}</td>
                          <td style={{ padding: '0.7rem 1rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
                            <span title={`${p.project_images?.filter(i => i.is_primary).length ?? 0} principal`}>
                              {p.project_images?.length ?? 0}
                            </span>
                          </td>
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

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>
                  {Math.min((page - 1) * PAGE_SIZE + 1, projects.length)}–{Math.min(page * PAGE_SIZE, projects.length)} de {projects.length}
                </span>
                <Pagination page={page} total={totalPages} onChange={p => setPage(p)} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Panel deslizante ── */}
      {panelOpen && (
        <>
          <div onClick={closePanel} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 900 }} />
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 680, background: '#111', zIndex: 901, overflowY: 'auto', boxShadow: '-4px 0 40px rgba(0,0,0,0.6)' }}>

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
              <button onClick={closePanel} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.6rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

              {/* ── Info general ── */}
              <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A', borderBottom: '1px solid rgba(193,29,42,0.2)', paddingBottom: '0.5rem' }}>
                Información General
              </p>

              <Field label="Título" required>
                <input style={touched && !title.trim() ? inpError : inp} value={title} placeholder="Casa Ejemplo"
                  onChange={e => { setTitle(e.target.value); if (!editProject) setSlug(autoSlug(e.target.value)); }}
                  onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                  onBlur={e => (e.target.style.borderColor = touched && !title.trim() ? 'rgba(193,29,42,0.6)' : 'rgba(255,255,255,0.1)')} />
                {touched && !title.trim() && <p style={{ fontSize: '0.62rem', color: '#C11D2A', marginTop: '0.25rem' }}>Requerido.</p>}
              </Field>

              <Field label="Slug (URL)" required>
                <input style={touched && !slug.trim() ? inpError : inp} value={slug} placeholder="casa-ejemplo"
                  onChange={e => setSlug(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = '#C11D2A')}
                  onBlur={e => (e.target.style.borderColor = touched && !slug.trim() ? 'rgba(193,29,42,0.6)' : 'rgba(255,255,255,0.1)')} />
                <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.3rem' }}>
                  /proyectos/{slug || 'casa-ejemplo'}/
                </p>
                {touched && !slug.trim() && <p style={{ fontSize: '0.62rem', color: '#C11D2A', marginTop: '0.25rem' }}>Requerido.</p>}
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Año">
                  <input style={inp} value={year} placeholder="2024" onChange={e => setYear(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </Field>
                <Field label="Categoría">
                  <input style={inp} value={category} placeholder="Residencial" onChange={e => setCategory(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </Field>
              </div>

              <Field label="Ubicación">
                <input style={inp} value={location} placeholder="San José, Costa Rica" onChange={e => setLocation(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <Field label="Arquitecto">
                  <input style={inp} value={architect} placeholder="Arq. Nombre" onChange={e => setArchitect(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </Field>
                <Field label="Project Manager">
                  <input style={inp} value={manager} placeholder="Nombre PM" onChange={e => setManager(e.target.value)}
                    onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                </Field>
              </div>

              <Field label="Dimensiones">
                <input style={inp} value={dimensions} placeholder="250 Metros Cuadrados" onChange={e => setDimensions(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </Field>

              <Field label="Descripción">
                <textarea style={{ ...inp, minHeight: 90, resize: 'vertical' }} value={description} placeholder="Descripción del proyecto…"
                  onChange={e => setDescription(e.target.value)}
                  onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </Field>

              {/* ── Imágenes ── */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(193,29,42,0.2)', paddingBottom: '0.5rem', marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A' }}>
                  Imágenes <span style={{ color: 'rgba(193,29,42,0.6)' }}>({images.filter(i => i.src).length} / {images.length})</span>
                </p>
              </div>

              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
                <i className="bi bi-info-circle" style={{ color: '#C11D2A', marginRight: '0.4rem' }} />
                Cada imagen requiere <strong style={{ color: 'rgba(255,255,255,0.6)' }}>archivo/URL, Alt text y Caption</strong>.
                La imagen <strong style={{ color: '#C11D2A' }}>★ Principal</strong> aparece en la grilla y como portada.
              </p>

              {images.map((img, idx) => (
                <ImageRow key={idx}
                  img={img} idx={idx} total={images.length}
                  slug={slug} touched={touched}
                  onChange={changeImg}
                  onPrimary={setPrimary}
                  onRemove={removeImg}
                />
              ))}

              <button onClick={addImg} style={{ ...btnGhost, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="bi bi-plus-lg" /> Agregar imagen
              </button>

              {/* Error / success */}
              {msg && (
                <div style={{ padding: '0.8rem 1rem', background: msg.startsWith('Error') || msg.startsWith('⚠') ? 'rgba(193,29,42,0.1)' : 'rgba(76,175,80,0.1)', border: `1px solid ${msg.startsWith('Error') || msg.startsWith('⚠') ? 'rgba(193,29,42,0.3)' : 'rgba(76,175,80,0.3)'}` }}>
                  <p style={{ fontSize: '0.82rem', color: msg.startsWith('Error') || msg.startsWith('⚠') ? '#C11D2A' : '#4caf50' }}>
                    {msg}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', paddingBottom: '1rem' }}>
                <button style={{ ...btnRed, opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving}>
                  {saving ? 'Guardando…' : editProject ? 'Actualizar Proyecto' : 'Crear Proyecto'}
                </button>
                <button style={btnGhost} onClick={closePanel}>Cancelar</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Confirmar borrar ── */}
      {deleteTarget && (
        <>
          <div onClick={() => setDeleteTarget(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 950 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#111', border: '1px solid rgba(193,29,42,0.3)', padding: '2.5rem 2rem', maxWidth: 380, width: '90%', zIndex: 951, textAlign: 'center' }}>
            <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem', color: '#C11D2A', display: 'block', marginBottom: '1rem' }} />
            <h3 style={{ fontFamily: "'Roboto Flex',sans-serif", fontWeight: 200, color: '#fff', marginBottom: '0.6rem' }}>Eliminar Proyecto</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1.8rem' }}>
              ¿Eliminar <strong style={{ color: '#fff' }}>{deleteTarget.title}</strong>? No se puede deshacer.
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
