'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { supabase, DBProject, getPrimaryImage, getProjects, detectMediaType } from '@/lib/supabase';
import { logAction } from '@/lib/audit';
import { CATEGORIES } from '@/data/categories';

const PAGE_SIZE = 10;
type MediaType = 'image' | 'video';

interface MediaRow {
  id?:          string;
  src:          string;
  alt:          string;
  caption:      string;
  caption_en:   string;    // ← caption en inglés
  is_primary:   boolean;
  sort_order:   number;
  media_type:   MediaType;
  uploading?:   boolean;
  uploadErr?:   string;
}

const emptyRow = (order = 0): MediaRow => ({
  src: '', alt: '', caption: '', caption_en: '', is_primary: false,
  sort_order: order, media_type: 'image',
});

function toSlug(text: string): string {
  return text.toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '')
    .trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}

async function uploadMedia(file: File, slug: string, type: MediaType): Promise<string> {
  const bucket = type === 'video' ? 'project-videos' : 'project-images';
  const ext    = file.name.split('.').pop()?.toLowerCase() ?? (type === 'video' ? 'mp4' : 'jpg');
  const name   = `${slug || 'media'}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(name, file, { upsert: true, contentType: file.type });
  if (error) throw new Error(error.message);
  return supabase.storage.from(bucket).getPublicUrl(name).data.publicUrl;
}

function validate(slug: string, title: string, rows: MediaRow[]): string | null {
  if (!slug.trim())  return 'El título es requerido para generar el URL.';
  if (!title.trim()) return 'El título es requerido.';
  const filled = rows.filter(r => r.src.trim());
  if (filled.length === 0) return 'Agregá al menos una imagen o video.';
  if (!filled.some(r => r.is_primary)) return 'Marcá un elemento como Principal.';
  return null;
}

// ── Styles ────────────────────────────────────────────────
const inp: React.CSSProperties = { width: '100%', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: "'Roboto', sans-serif", fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s' };
const inpErr: React.CSSProperties = { ...inp, border: '1px solid rgba(193,29,42,0.6)' };
const inpEn: React.CSSProperties = { ...inp, border: '1px solid rgba(33,150,243,0.2)', background: 'rgba(33,150,243,0.04)' };
const inpReadOnly: React.CSSProperties = { ...inp, color: 'rgba(255,255,255,0.4)', cursor: 'default', background: 'rgba(255,255,255,0.02)', userSelect: 'all' as const };
const selectStyle: React.CSSProperties = { ...inp, cursor: 'pointer', backgroundColor: '#0d0d0d', colorScheme: 'dark', appearance: 'none' as const, WebkitAppearance: 'none' as const, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.4)' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.8rem center', paddingRight: '2.2rem' };
const lbl: React.CSSProperties = { fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem' };
const lblEn: React.CSSProperties = { ...lbl, color: 'rgba(33,150,243,0.7)' };
const btnRed: React.CSSProperties = { padding: '0.7rem 1.6rem', background: '#C11D2A', border: 'none', color: '#fff', cursor: 'pointer', fontFamily: "'Roboto', sans-serif", fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase' };
const btnGhost: React.CSSProperties = { padding: '0.65rem 1.4rem', background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: "'Roboto', sans-serif", fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase' };
const pagBtn: React.CSSProperties = { minWidth: 36, height: 36, padding: '0 0.55rem', border: '1px solid rgba(255,255,255,0.14)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontFamily: "'Roboto', sans-serif", fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.2s, color 0.2s, background 0.2s' };
const arrowBtn: React.CSSProperties = { background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', width: 26, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', transition: 'all 0.15s', flexShrink: 0 };

function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  const maxV = 5;
  let vis = pages;
  if (total > maxV) { const s = Math.max(0, Math.min(page - 3, total - maxV)); vis = pages.slice(s, s + maxV); }
  const hov = (el: HTMLElement, on: boolean) => { el.style.borderColor = on ? '#C11D2A' : 'rgba(255,255,255,0.14)'; el.style.color = on ? '#C11D2A' : 'rgba(255,255,255,0.5)'; };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
      <button style={{ ...pagBtn, opacity: page === 1 ? 0.3 : 1 }} disabled={page === 1} onClick={() => onChange(page - 1)} onMouseEnter={e => { if (page !== 1) hov(e.currentTarget as HTMLElement, true); }} onMouseLeave={e => hov(e.currentTarget as HTMLElement, false)}><i className="bi bi-chevron-left" /></button>
      {vis[0] > 1 && <><button style={pagBtn} onClick={() => onChange(1)} onMouseEnter={e => hov(e.currentTarget as HTMLElement, true)} onMouseLeave={e => hov(e.currentTarget as HTMLElement, false)}>1</button>{vis[0] > 2 && <span style={{ color: 'rgba(255,255,255,0.3)' }}>…</span>}</>}
      {vis.map(n => <button key={n} style={{ ...pagBtn, ...(n === page ? { background: '#C11D2A', borderColor: '#C11D2A', color: '#fff' } : {}) }} onClick={() => onChange(n)} onMouseEnter={e => { if (n !== page) hov(e.currentTarget as HTMLElement, true); }} onMouseLeave={e => { if (n !== page) hov(e.currentTarget as HTMLElement, false); }}>{n}</button>)}
      {vis[vis.length - 1] < total && <><span style={{ color: 'rgba(255,255,255,0.3)' }}>…</span><button style={pagBtn} onClick={() => onChange(total)} onMouseEnter={e => hov(e.currentTarget as HTMLElement, true)} onMouseLeave={e => hov(e.currentTarget as HTMLElement, false)}>{total}</button></>}
      <button style={{ ...pagBtn, opacity: page === total ? 0.3 : 1 }} disabled={page === total} onClick={() => onChange(page + 1)} onMouseEnter={e => { if (page !== total) hov(e.currentTarget as HTMLElement, true); }} onMouseLeave={e => hov(e.currentTarget as HTMLElement, false)}><i className="bi bi-chevron-right" /></button>
    </div>
  );
}

function MediaRowComp({ row, idx, total, slug, touched, onChange, onPrimary, onRemove, onMove }: {
  row: MediaRow; idx: number; total: number; slug: string; touched: boolean;
  onChange: (i: number, f: keyof MediaRow, v: string | boolean | number) => void;
  onPrimary: (i: number) => void; onRemove: (i: number) => void; onMove: (i: number, dir: -1 | 1) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    onChange(idx, 'uploading', true); onChange(idx, 'uploadErr', '');
    try { onChange(idx, 'src', await uploadMedia(file, slug || 'media', row.media_type)); }
    catch (err: unknown) { onChange(idx, 'uploadErr', (err as Error).message); }
    onChange(idx, 'uploading', false);
    if (fileRef.current) fileRef.current.value = '';
  };
  const switchType = (newType: MediaType) => {
    if (newType === row.media_type) return;
    onChange(idx, 'media_type', newType);
    if (row.src) onChange(idx, 'src', '');
  };
  const missingUrl = touched && !row.src.trim();
  const accept = row.media_type === 'video' ? 'video/mp4,video/webm,video/ogg,video/quicktime,.mp4,.webm,.mov' : 'image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif';

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: row.is_primary ? '1px solid rgba(193,29,42,0.5)' : missingUrl ? '1px solid rgba(193,29,42,0.35)' : '1px solid rgba(255,255,255,0.07)', padding: '1.2rem' }}>

      {/* Header: arrows + primary + delete */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        {total > 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', flexShrink: 0 }}>
            <button onClick={() => onMove(idx, -1)} disabled={idx === 0} style={{ ...arrowBtn, opacity: idx === 0 ? 0.25 : 1, cursor: idx === 0 ? 'default' : 'pointer' }} title="Mover arriba"
              onMouseEnter={e => { if (idx !== 0) { (e.currentTarget as HTMLElement).style.borderColor = '#C11D2A'; (e.currentTarget as HTMLElement).style.color = '#C11D2A'; }}}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>
              <i className="bi bi-chevron-up" />
            </button>
            <button onClick={() => onMove(idx, 1)} disabled={idx === total - 1} style={{ ...arrowBtn, opacity: idx === total - 1 ? 0.25 : 1, cursor: idx === total - 1 ? 'default' : 'pointer' }} title="Mover abajo"
              onMouseEnter={e => { if (idx !== total - 1) { (e.currentTarget as HTMLElement).style.borderColor = '#C11D2A'; (e.currentTarget as HTMLElement).style.color = '#C11D2A'; }}}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>
              <i className="bi bi-chevron-down" />
            </button>
          </div>
        )}
        <input type="radio" id={`pri-${idx}`} name="primary-media" checked={row.is_primary} onChange={() => onPrimary(idx)} style={{ accentColor: '#C11D2A', cursor: 'pointer', width: 16, height: 16 }} />
        <label htmlFor={`pri-${idx}`} style={{ ...lbl, margin: 0, cursor: 'pointer', color: row.is_primary ? '#C11D2A' : 'rgba(255,255,255,0.4)', fontSize: '0.68rem', flex: 1 }}>
          {row.is_primary ? '★ Principal' : `Imagen ${idx + 1}`}
        </label>
        {total > 1 && <button onClick={() => onRemove(idx)} style={{ background: 'none', border: 'none', color: 'rgba(193,29,42,0.5)', cursor: 'pointer', fontSize: '1rem', padding: 0, flexShrink: 0 }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C11D2A')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(193,29,42,0.5)')}><i className="bi bi-trash" /></button>}
      </div>

      {/* Type switch */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {(['image', 'video'] as MediaType[]).map(tp => (
          <button key={tp} onClick={() => switchType(tp)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.9rem', border: '1px solid', background: row.media_type === tp ? (tp === 'video' ? 'rgba(33,150,243,0.15)' : 'rgba(193,29,42,0.15)') : 'none', borderColor: row.media_type === tp ? (tp === 'video' ? '#2196f3' : '#C11D2A') : 'rgba(255,255,255,0.15)', color: row.media_type === tp ? (tp === 'video' ? '#2196f3' : '#C11D2A') : 'rgba(255,255,255,0.45)', cursor: 'pointer', fontFamily: "'Roboto', sans-serif", fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.15s' }}>
            <i className={`bi ${tp === 'video' ? 'bi-camera-video' : 'bi-image'}`} />{tp === 'video' ? 'Video' : 'Imagen'}
          </button>
        ))}
        {row.src && <span style={{ marginLeft: 'auto', fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', alignSelf: 'center' }}>{row.media_type === 'video' ? '→ project-videos' : '→ project-images'}</span>}
      </div>

      {/* Preview + upload */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        <div style={{ width: 120, height: 80, flexShrink: 0, background: '#111', border: missingUrl ? '1.5px dashed rgba(193,29,42,0.6)' : '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {row.uploading ? <i className="bi bi-arrow-repeat" style={{ color: '#C11D2A', fontSize: '1.5rem', animation: 'spin 1s linear infinite' }} />
            : row.src ? (row.media_type === 'video' ? <><video src={row.src} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /><div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)' }}><i className="bi bi-play-fill" style={{ color: '#fff', fontSize: '1.4rem' }} /></div></> : <img src={row.src} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => ((e.target as HTMLImageElement).style.opacity = '0')} />)
            : <div style={{ textAlign: 'center' }}><i className={`bi ${row.media_type === 'video' ? 'bi-camera-video' : 'bi-image'}`} style={{ color: missingUrl ? 'rgba(193,29,42,0.5)' : '#333', fontSize: '1.4rem', display: 'block' }} />{missingUrl && <p style={{ fontSize: '0.55rem', color: '#C11D2A', marginTop: '0.3rem' }}>Requerido</p>}</div>}
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <input ref={fileRef} type="file" accept={accept} style={{ display: 'none' }} onChange={handleFile} />
          <button onClick={() => fileRef.current?.click()} disabled={row.uploading}
            style={{ ...btnGhost, width: '100%', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: row.uploading ? 0.5 : 1 }}>
            <i className={`bi ${row.src ? 'bi-arrow-repeat' : (row.media_type === 'video' ? 'bi-camera-video' : 'bi-upload')}`} />
            {row.uploading ? 'Subiendo…' : row.src ? `Reemplazar ${row.media_type === 'video' ? 'video' : 'imagen'}` : `Subir ${row.media_type === 'video' ? 'video' : 'imagen'}`}
          </button>
          <label style={{ ...lbl, fontSize: '0.58rem' }}>O pegar URL</label>
          <input style={missingUrl ? inpErr : inp} value={row.src} placeholder={row.media_type === 'video' ? 'https://…/video.mp4' : 'https://…/imagen.jpg'}
            onChange={e => onChange(idx, 'src', e.target.value)} onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = missingUrl ? 'rgba(193,29,42,0.6)' : 'rgba(255,255,255,0.1)')} />
          {missingUrl && <p style={{ fontSize: '0.62rem', color: '#C11D2A', marginTop: '0.25rem' }}>URL o archivo requerido.</p>}
          {row.uploadErr && <p style={{ fontSize: '0.68rem', color: '#C11D2A', marginTop: '0.3rem' }}><i className="bi bi-exclamation-triangle" /> {row.uploadErr}</p>}
        </div>
      </div>

      {/* Alt + Caption ES + Caption EN */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div>
          <label style={lbl}>Alt text <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)' }}>(opcional)</span></label>
          <input style={inp} value={row.alt} placeholder="Descripción del contenido"
            onChange={e => onChange(idx, 'alt', e.target.value)} onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div>
            <label style={lbl}>Caption (ES) <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)' }}>(opcional)</span></label>
            <input style={inp} value={row.caption} placeholder="Ej: Fachada Principal"
              onChange={e => onChange(idx, 'caption', e.target.value)} onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>
          <div>
            <label style={lblEn}><i className="bi bi-translate" style={{ marginRight: '0.3rem' }} />Caption (EN) <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.15)' }}>(opcional)</span></label>
            <input style={inpEn} value={row.caption_en} placeholder="Eg: Main Facade"
              onChange={e => onChange(idx, 'caption_en', e.target.value)} onFocus={e => (e.target.style.borderColor = '#2196f3')} onBlur={e => (e.target.style.borderColor = 'rgba(33,150,243,0.2)')} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────
export default function AdminProyectosPage() {
  const [projects, setProjects] = useState<DBProject[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState('');
  const [page,     setPage]     = useState(1);
  const [panelOpen,    setPanelOpen]    = useState(false);
  const [editProject,  setEditProject]  = useState<DBProject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DBProject | null>(null);
  const [touched,      setTouched]      = useState(false);

  const [slug,          setSlug]          = useState('');
  const [title,         setTitle]         = useState('');
  const [location,      setLocation]      = useState('');
  const [manager,       setManager]       = useState('');
  const [architect,     setArchitect]     = useState('');
  const [dimensions,    setDimensions]    = useState('');
  const [year,          setYear]          = useState('');
  const [category,      setCategory]      = useState('');
  const [description,   setDescription]   = useState('');
  const [titleEn,       setTitleEn]       = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [rows,          setRows]          = useState<MediaRow[]>([emptyRow()]);

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
    setSlug(''); setTitle(''); setLocation(''); setManager(''); setArchitect('');
    setDimensions(''); setYear(''); setCategory(''); setDescription('');
    setTitleEn(''); setDescriptionEn('');
    setRows([emptyRow()]); setMsg(''); setPanelOpen(true);
  };

  const openEdit = (p: DBProject) => {
    setEditProject(p); setTouched(false);
    setSlug(p.slug); setTitle(p.title); setLocation(p.location ?? '');
    setManager(p.manager ?? ''); setArchitect(p.architect ?? '');
    setDimensions(p.dimensions ?? ''); setYear(p.year ?? '');
    setCategory(p.category ?? ''); setDescription(p.description ?? '');
    setTitleEn(p.title_en ?? ''); setDescriptionEn(p.description_en ?? '');
    const loaded: MediaRow[] = (p.project_images ?? []).map((img, o) => ({
      id:         img.id,
      src:        img.src,
      alt:        img.alt,
      caption:    img.caption    ?? '',
      caption_en: img.caption_en ?? '',  // ← cargar caption EN
      is_primary: img.is_primary,
      sort_order: img.sort_order ?? o,
      media_type: (img.media_type as MediaType) ?? detectMediaType(img.src),
    }));
    setRows(loaded.length > 0 ? loaded : [emptyRow()]);
    setMsg(''); setPanelOpen(true);
  };

  const closePanel  = () => { setPanelOpen(false); setMsg(''); setTouched(false); };
  const changeRow   = (idx: number, field: keyof MediaRow, val: string | boolean | number) =>
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r));
  const setPrimary  = (idx: number) =>
    setRows(prev => prev.map((r, i) => ({ ...r, is_primary: i === idx })));
  const addRow      = () => setRows(prev => [...prev, emptyRow(prev.length)]);
  const removeRow   = (idx: number) => setRows(prev => {
    const next = prev.filter((_, i) => i !== idx).map((r, i) => ({ ...r, sort_order: i }));
    if (prev[idx].is_primary && next.length > 0) next[0].is_primary = true;
    return next.length > 0 ? next : [emptyRow()];
  });
  const moveRow     = (idx: number, dir: -1 | 1) => setRows(prev => {
    const next = [...prev]; const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return prev;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    return next.map((r, i) => ({ ...r, sort_order: i }));
  });
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!editProject) setSlug(toSlug(value));
  };

  const handleSave = async () => {
    setTouched(true);
    const err = validate(slug, title, rows);
    if (err) { setMsg('⚠ ' + err); return; }
    if (rows.some(r => r.uploading)) { setMsg('⚠ Esperá a que terminen las subidas.'); return; }
    const validRows = rows.filter(r => r.src.trim());
    setSaving(true); setMsg('');
    try {
      const projectData = {
        slug: slug.trim(), title: title.trim(), location: location.trim() || null,
        manager: manager.trim() || null, architect: architect.trim() || null,
        dimensions: dimensions.trim() || null, year: year.trim() || null,
        category: category || null, description: description.trim() || null,
        title_en: titleEn.trim() || null, description_en: descriptionEn.trim() || null,
      };
      if (editProject) {
        const { error: pErr } = await supabase.from('projects').update(projectData).eq('id', editProject.id);
        if (pErr) throw new Error(pErr.message);
        await supabase.from('project_images').delete().eq('project_id', editProject.id);
        const { error: iErr } = await supabase.from('project_images').insert(
          validRows.map((r, i) => ({
            project_id: editProject.id, src: r.src, alt: r.alt || r.src,
            caption: r.caption || null, caption_en: r.caption_en || null,  // ← guardar caption EN
            is_primary: r.is_primary, sort_order: i, media_type: r.media_type,
          }))
        );
        if (iErr) throw new Error(iErr.message);
        const changed: string[] = [];
        if (editProject.title !== title.trim()) changed.push('título');
        if ((editProject.project_images?.length ?? 0) !== validRows.length) changed.push('media');
        await logAction(changed.some(c => c === 'media') ? 'project_images_updated' : 'project_updated',
          `Se editó "${title.trim()}". ${changed.length > 0 ? 'Cambios: ' + changed.join(', ') + '.' : ''}`,
          { entityId: editProject.id, entityName: title.trim() });
      } else {
        const { data: newP, error: pErr } = await supabase.from('projects').insert(projectData).select().single();
        if (pErr) throw new Error(pErr.message);
        const { error: iErr } = await supabase.from('project_images').insert(
          validRows.map((r, i) => ({
            project_id: newP.id, src: r.src, alt: r.alt || r.src,
            caption: r.caption || null, caption_en: r.caption_en || null,  // ← guardar caption EN
            is_primary: r.is_primary, sort_order: i, media_type: r.media_type,
          }))
        );
        if (iErr) throw new Error(iErr.message);
        await logAction('project_created', `Se creó "${title.trim()}" con ${validRows.length} elemento${validRows.length !== 1 ? 's' : ''}.`,
          { entityId: newP.id, entityName: title.trim(), details: { slug: slug.trim() } });
      }
      await load(); setSaving(false); setTimeout(closePanel, 500); return;
    } catch (e: unknown) {
      setMsg('Error: ' + (e instanceof Error ? e.message : 'Error desconocido.'));
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from('projects').delete().eq('id', deleteTarget.id);
    if (!error) await logAction('project_deleted', `Se eliminó "${deleteTarget.title}".`, { entityId: deleteTarget.id, entityName: deleteTarget.title });
    setDeleteTarget(null);
    const newTotal = Math.max(1, Math.ceil((projects.length - 1) / PAGE_SIZE));
    if (page > newTotal) setPage(newTotal);
    await load();
  };

  return (
    <AdminGuard>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={{ paddingTop: 220, minHeight: '100vh', background: '#151515' }}>
        <div className="max-w-[1290px] mx-auto px-6 lg:px-10 py-14">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="section-eyebrow">Admin</p>
              <h1 style={{ fontFamily: "'Roboto Flex',sans-serif", fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 200, letterSpacing: '0.08em', color: '#fff' }}>Proyectos</h1>
              <div style={{ width: 36, height: 1.5, background: '#C11D2A', marginTop: '0.7rem' }} />
            </div>
            <button style={btnRed} onClick={openNew}><i className="bi bi-plus-lg" style={{ marginRight: '0.4rem' }} />Nuevo Proyecto</button>
          </div>

          {!loading && <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', marginBottom: '1rem' }}>{projects.length} proyecto{projects.length !== 1 ? 's' : ''} · Página {page} de {totalPages}</p>}

          {loading ? <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Cargando proyectos…</p> : (
            <>
              <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['Portada','Título','Categoría','Año','Acciones'].map(h => <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map(p => {
                      const primary = getPrimaryImage(p);
                      const type    = (primary?.media_type as MediaType) ?? detectMediaType(primary?.src ?? '');
                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)')}
                          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                          <td style={{ padding: '0.7rem 1rem' }}>
                            <div style={{ position: 'relative', width: 80, height: 54, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                              {primary?.src ? (type === 'video' ? <><video src={primary.src} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /><div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)' }}><i className="bi bi-play-fill" style={{ color: '#fff', fontSize: '1rem' }} /></div></> : <img src={primary.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />) : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="bi bi-image" style={{ color: '#333' }} /></div>}
                            </div>
                          </td>
                          <td style={{ padding: '0.7rem 1rem', color: '#e0e0e0' }}>
                            <div>{p.title}</div>
                            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.2rem', fontFamily: 'monospace' }}>/proyectos/{p.slug}/</div>
                            {p.title_en && <div style={{ fontSize: '0.62rem', color: 'rgba(33,150,243,0.6)', marginTop: '0.15rem' }}><i className="bi bi-translate" style={{ marginRight: '0.2rem' }} />{p.title_en}</div>}
                          </td>
                          <td style={{ padding: '0.7rem 1rem', fontSize: '0.75rem' }}>
                            {p.category ? <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(193,29,42,0.1)', border: '1px solid rgba(193,29,42,0.2)', color: '#C11D2A', fontSize: '0.6rem' }}>{p.category}</span> : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                          </td>
                          <td style={{ padding: '0.7rem 1rem', color: 'rgba(255,255,255,0.5)' }}>{p.year ?? '—'}</td>
                          <td style={{ padding: '0.7rem 1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => openEdit(p)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.6)', padding: '0.3rem 0.8rem', cursor: 'pointer', fontSize: '0.72rem', transition: 'all 0.2s' }} onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#C11D2A'; el.style.color = '#C11D2A'; }} onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.18)'; el.style.color = 'rgba(255,255,255,0.6)'; }}><i className="bi bi-pencil" /> Editar</button>
                              <button onClick={() => setDeleteTarget(p)} style={{ background: 'none', border: 'none', color: 'rgba(193,29,42,0.6)', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '1rem' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C11D2A')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(193,29,42,0.6)')}><i className="bi bi-trash" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {projects.length === 0 && <p style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>No hay proyectos. ¡Creá el primero!</p>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>{Math.min((page - 1) * PAGE_SIZE + 1, projects.length)}–{Math.min(page * PAGE_SIZE, projects.length)} de {projects.length}</span>
                <Pagination page={page} total={totalPages} onChange={p => setPage(p)} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── MODAL ── */}
      {panelOpen && (
        <>
          <div onClick={closePanel} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 900 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '94%', maxWidth: 720, maxHeight: '88vh', background: '#111', zIndex: 901, overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ position: 'sticky', top: 0, background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
              <div>
                <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A' }}>{editProject ? 'Editar' : 'Nuevo'} Proyecto</p>
                <h2 style={{ fontFamily: "'Roboto Flex',sans-serif", fontSize: '1.2rem', fontWeight: 200, color: '#fff', marginTop: '0.2rem' }}>{title || (editProject ? editProject.title : 'Sin título')}</h2>
              </div>
              <button onClick={closePanel} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.6rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A', borderBottom: '1px solid rgba(193,29,42,0.2)', paddingBottom: '0.5rem' }}>Información General</p>

              <div>
                <label style={lbl}>Título <span style={{ color: '#C11D2A' }}>*</span></label>
                <input style={touched && !title.trim() ? inpErr : inp} value={title} placeholder="Casa Ejemplo" onChange={e => handleTitleChange(e.target.value)} onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
              <div>
                <label style={lbl}>URL del proyecto {!editProject ? <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}>(auto-generado)</span> : <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 300 }}>(no cambia al editar)</span>}</label>
                <div style={{ ...inpReadOnly, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.25)' }}>/proyectos/</span>
                  <span style={{ color: slug ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>{slug || '…'}</span>
                  <span style={{ color: 'rgba(255,255,255,0.25)' }}>/</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={lbl}>Año</label><input style={inp} value={year} placeholder="2024" onChange={e => setYear(e.target.value)} onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} /></div>
                <div>
                  <label style={lbl}>Categoría</label>
                  <select style={selectStyle} value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="" style={{ background: '#0d0d0d', color: '#fff' }}>— Sin categoría —</option>
                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#0d0d0d', color: '#fff' }}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div><label style={lbl}>Ubicación</label><input style={inp} value={location} placeholder="San José, Costa Rica" onChange={e => setLocation(e.target.value)} onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><label style={lbl}>Arquitecto</label><input style={inp} value={architect} placeholder="Arq. Nombre" onChange={e => setArchitect(e.target.value)} onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} /></div>
                <div><label style={lbl}>Project Manager</label><input style={inp} value={manager} placeholder="Nombre PM" onChange={e => setManager(e.target.value)} onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} /></div>
              </div>
              <div><label style={lbl}>Dimensiones</label><input style={inp} value={dimensions} placeholder="250 Metros Cuadrados" onChange={e => setDimensions(e.target.value)} onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} /></div>
              <div><label style={lbl}>Descripción (ES)</label><textarea style={{ ...inp, minHeight: 90, resize: 'vertical' }} value={description} placeholder="Descripción del proyecto…" onChange={e => setDescription(e.target.value)} onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} /></div>

              <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(33,150,243,0.8)', borderBottom: '1px solid rgba(33,150,243,0.15)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="bi bi-translate" /> Traducción al inglés <span style={{ color: 'rgba(255,255,255,0.2)', fontWeight: 300 }}>(opcional)</span>
              </p>
              <div><label style={lbl}>Title (EN)</label><input style={inp} value={titleEn} placeholder="English project title" onChange={e => setTitleEn(e.target.value)} onFocus={e => (e.target.style.borderColor = '#2196f3')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} /></div>
              <div><label style={lbl}>Description (EN)</label><textarea style={{ ...inp, minHeight: 90, resize: 'vertical' }} value={descriptionEn} placeholder="English description…" onChange={e => setDescriptionEn(e.target.value)} onFocus={e => (e.target.style.borderColor = '#2196f3')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} /></div>

              <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A', borderBottom: '1px solid rgba(193,29,42,0.2)', paddingBottom: '0.5rem', marginTop: '0.5rem' }}>Imágenes y Videos</p>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
                <i className="bi bi-info-circle" style={{ color: '#C11D2A', marginRight: '0.4rem' }} />
                Flechas ↑↓ para reordenar. El <strong style={{ color: '#C11D2A' }}>★ Principal</strong> es la portada. Cada imagen tiene Caption en ES y EN.
              </p>
              {rows.map((row, idx) => (
                <MediaRowComp key={idx} row={row} idx={idx} total={rows.length} slug={slug} touched={touched} onChange={changeRow} onPrimary={setPrimary} onRemove={removeRow} onMove={moveRow} />
              ))}
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button onClick={addRow} style={{ ...btnGhost, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><i className="bi bi-image" /> + Imagen</button>
                <button onClick={() => { const r = emptyRow(rows.length); r.media_type = 'video'; setRows(prev => [...prev, r]); }} style={{ ...btnGhost, borderColor: 'rgba(33,150,243,0.35)', color: 'rgba(33,150,243,0.7)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><i className="bi bi-camera-video" /> + Video</button>
              </div>

              {msg && <div style={{ padding: '0.8rem 1rem', background: msg.startsWith('Error') || msg.startsWith('⚠') ? 'rgba(193,29,42,0.1)' : 'rgba(76,175,80,0.1)', border: `1px solid ${msg.startsWith('Error') || msg.startsWith('⚠') ? 'rgba(193,29,42,0.3)' : 'rgba(76,175,80,0.3)'}` }}><p style={{ fontSize: '0.82rem', color: msg.startsWith('Error') || msg.startsWith('⚠') ? '#C11D2A' : '#4caf50' }}>{msg}</p></div>}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', paddingBottom: '1rem' }}>
                <button style={{ ...btnRed, opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving}>{saving ? 'Guardando…' : editProject ? 'Actualizar Proyecto' : 'Crear Proyecto'}</button>
                <button style={btnGhost} onClick={closePanel}>Cancelar</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Borrar ── */}
      {deleteTarget && (
        <>
          <div onClick={() => setDeleteTarget(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 950 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#111', border: '1px solid rgba(193,29,42,0.3)', padding: '2.5rem 2rem', maxWidth: 380, width: '90%', zIndex: 951, textAlign: 'center' }}>
            <i className="bi bi-exclamation-triangle" style={{ fontSize: '2rem', color: '#C11D2A', display: 'block', marginBottom: '1rem' }} />
            <h3 style={{ fontFamily: "'Roboto Flex',sans-serif", fontWeight: 200, color: '#fff', marginBottom: '0.6rem' }}>Eliminar Proyecto</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1.8rem' }}>¿Eliminar <strong style={{ color: '#fff' }}>{deleteTarget.title}</strong>? No se puede deshacer.</p>
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
