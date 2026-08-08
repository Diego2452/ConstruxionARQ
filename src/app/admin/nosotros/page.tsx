'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import { supabase } from '@/lib/supabase';
import { logAction } from '@/lib/audit';

type BlockType = 'text-image' | 'image-text' | 'bullets-image' | 'image-bullets' | 'team' | 'carousel';
interface AboutBlock {
  id: string;
  block_type: BlockType;
  title: string | null;
  subtitle: string | null;
  content: Record<string, unknown>;
  sort_order: number;
  is_active: boolean;
}
type MediaType = 'image' | 'video';

const BLOCK_TYPES: { type: BlockType; label: string; icon: string; desc: string; layout: string }[] = [
  { type: 'text-image',    label: 'Texto → Imagen',   icon: 'bi-layout-text-window-reverse', desc: 'Texto a la izquierda, imagen/video a la derecha', layout: '[T][📷]'     },
  { type: 'image-text',    label: 'Imagen → Texto',   icon: 'bi-layout-text-window',         desc: 'Imagen/video a la izquierda, texto a la derecha', layout: '[📷][T]'     },
  { type: 'bullets-image', label: 'Bullets → Imagen', icon: 'bi-list-ul',                    desc: 'Lista bullet a izquierda, imagen a derecha',      layout: '[•••][📷]'  },
  { type: 'image-bullets', label: 'Imagen → Bullets', icon: 'bi-card-list',                  desc: 'Imagen a izquierda, lista bullet a derecha',      layout: '[📷][•••]'  },
  { type: 'team',          label: 'Equipo',            icon: 'bi-people',                     desc: 'Grid de tarjetas de miembros del equipo',         layout: '[👤][👤][👤]'},
  { type: 'carousel',      label: 'Carrusel',          icon: 'bi-images',                     desc: 'Carrusel animado de imágenes/logos',              layout: '[←→→→]'     },
];

const inp: React.CSSProperties = { width: '100%', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: "'Roboto', sans-serif", fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s' };
const lbl: React.CSSProperties = { fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '0.4rem' };
const btnRed: React.CSSProperties = { padding: '0.7rem 1.6rem', background: '#C11D2A', border: 'none', color: '#fff', cursor: 'pointer', fontFamily: "'Roboto', sans-serif", fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase' };
const btnGhost: React.CSSProperties = { padding: '0.65rem 1.4rem', background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: "'Roboto', sans-serif", fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase' };

function FocusInp({ style, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input style={{ ...inp, ...style }} {...props} onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />;
}
function FocusTA({ style, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea style={{ ...inp, minHeight: 90, resize: 'vertical', ...style }} {...props} onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />;
}

function MediaUpload({ src, mediaType, onSrc, onType, label }: {
  src: string; mediaType: MediaType; onSrc: (s: string) => void; onType: (t: MediaType) => void; label?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true); setErr('');
    const bucket = mediaType === 'video' ? 'project-videos' : 'project-images';
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
    const name = `about/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(name, file, { upsert: true, contentType: file.type });
    if (error) { setErr(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from(bucket).getPublicUrl(name);
    onSrc(data.publicUrl); setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };
  return (
    <div>
      {label && <label style={lbl}>{label}</label>}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem' }}>
        {(['image', 'video'] as MediaType[]).map(t => (
          <button key={t} onClick={() => { onType(t); if (src) onSrc(''); }}
            style={{ padding: '0.3rem 0.7rem', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Roboto',sans-serif", border: '1px solid', background: mediaType === t ? (t === 'video' ? 'rgba(33,150,243,0.15)' : 'rgba(193,29,42,0.15)') : 'none', borderColor: mediaType === t ? (t === 'video' ? '#2196f3' : '#C11D2A') : 'rgba(255,255,255,0.15)', color: mediaType === t ? (t === 'video' ? '#2196f3' : '#C11D2A') : 'rgba(255,255,255,0.45)', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <i className={`bi ${t === 'video' ? 'bi-camera-video' : 'bi-image'}`} /> {t === 'video' ? 'Video' : 'Imagen'}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start' }}>
        <div style={{ width: 100, height: 66, background: '#111', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {uploading ? <i className="bi bi-arrow-repeat" style={{ color: '#C11D2A', animation: 'spin 1s linear infinite' }} />
            : src ? (mediaType === 'video' ? <video src={src} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <img src={src} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />)
            : <i className={`bi ${mediaType === 'video' ? 'bi-camera-video' : 'bi-image'}`} style={{ color: '#333', fontSize: '1.2rem' }} />}
        </div>
        <div style={{ flex: 1 }}>
          <input ref={fileRef} type="file" accept={mediaType === 'video' ? 'video/*' : 'image/*'} style={{ display: 'none' }} onChange={handleFile} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...btnGhost, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.68rem', padding: '0.5rem 0.8rem', marginBottom: '0.4rem' }}>
            <i className="bi bi-upload" /> {uploading ? 'Subiendo…' : src ? 'Reemplazar' : `Subir ${mediaType === 'video' ? 'video' : 'imagen'}`}
          </button>
          <FocusInp value={src} placeholder="O pegar URL" onChange={e => onSrc(e.target.value)} style={{ fontSize: '0.78rem', padding: '0.4rem 0.6rem' }} />
          {err && <p style={{ fontSize: '0.62rem', color: '#C11D2A', marginTop: '0.3rem' }}>{err}</p>}
        </div>
      </div>
    </div>
  );
}

function TextImageForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...content, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div><label style={lbl}>Texto del bloque</label><FocusTA value={(content.text as string) || ''} placeholder="Párrafo de texto…" onChange={e => set('text', e.target.value)} style={{ minHeight: 120 }} /></div>
      <MediaUpload label="Imagen / Video" src={(content.image_src as string) || ''} mediaType={(content.media_type as MediaType) || 'image'} onSrc={s => set('image_src', s)} onType={t => set('media_type', t)} />
      <div><label style={lbl}>Alt text (opcional)</label><FocusInp value={(content.image_alt as string) || ''} placeholder="Descripción de la imagen" onChange={e => set('image_alt', e.target.value)} /></div>
      <div><label style={lbl}>Caption (opcional)</label><FocusInp value={(content.image_caption as string) || ''} placeholder="Pie de imagen" onChange={e => set('image_caption', e.target.value)} /></div>
    </div>
  );
}

const ICON_OPTIONS = ['bi-check2-circle','bi-check2','bi-star-fill','bi-dot','bi-dash-circle-fill','bi-file-earmark-text','bi-currency-dollar','bi-map','bi-building-check','bi-tools','bi-diagram-3','bi-rulers','bi-person-badge','bi-hammer','bi-pencil-square'];

function BulletsImageForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  type BulletItem = { text: string; icon_class?: string };
  const bulletsRaw = (content.bullets as (string | BulletItem)[]) || [''];
  const bullets: BulletItem[] = bulletsRaw.map(b => typeof b === 'string' ? { text: b, icon_class: 'bi-check2-circle' } : b);
  const setBullets = (b: BulletItem[]) => onChange({ ...content, bullets: b });
  const set = (k: string, v: unknown) => onChange({ ...content, [k]: v });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={lbl}>Bullets <span style={{ color: '#C11D2A' }}>*</span></label>
        {bullets.map((b, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'start' }}>
            <FocusInp value={b.text} placeholder={`Bullet ${i + 1}`} onChange={e => { const n = [...bullets]; n[i].text = e.target.value; setBullets(n); }} />
            <select value={b.icon_class || 'bi-check2-circle'} onChange={e => { const n = [...bullets]; n[i].icon_class = e.target.value; setBullets(n); }} style={{ ...inp, fontSize: '0.75rem', padding: '0.65rem 0.6rem' }}>
              {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon.replace('bi-', '')}</option>)}
            </select>
            {bullets.length > 1 && <button onClick={() => setBullets(bullets.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'rgba(193,29,42,0.6)', cursor: 'pointer', fontSize: '1rem', gridColumn: '1 / -1' }}><i className="bi bi-trash" /> Eliminar</button>}
          </div>
        ))}
        <button onClick={() => setBullets([...bullets, { text: '', icon_class: 'bi-check2-circle' }])} style={{ ...btnGhost, fontSize: '0.68rem', padding: '0.4rem 0.8rem', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><i className="bi bi-plus-lg" /> Agregar bullet</button>
      </div>
      <MediaUpload label="Imagen / Video" src={(content.image_src as string) || ''} mediaType={(content.media_type as MediaType) || 'image'} onSrc={s => set('image_src', s)} onType={t => set('media_type', t)} />
      <div><label style={lbl}>Alt text (opcional)</label><FocusInp value={(content.image_alt as string) || ''} placeholder="Descripción" onChange={e => set('image_alt', e.target.value)} /></div>
    </div>
  );
}

function TeamForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  type Member = { name: string; role: string; bio: string; photo_src: string; photo_alt: string; photo_type: MediaType };
  const members: Member[] = (content.members as Member[]) || [{ name: '', role: '', bio: '', photo_src: '', photo_alt: '', photo_type: 'image' }];
  const setMembers = (m: Member[]) => onChange({ ...content, members: m });
  const setM = (i: number, k: keyof Member, v: string) => { const n = [...members]; n[i] = { ...n[i], [k]: v }; setMembers(n); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {members.map((m, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <p style={{ ...lbl, margin: 0, color: '#C11D2A' }}>Miembro {i + 1}</p>
            {members.length > 1 && <button onClick={() => setMembers(members.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'rgba(193,29,42,0.5)', cursor: 'pointer', fontSize: '1rem' }}><i className="bi bi-trash" /></button>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
            <div><label style={lbl}>Nombre <span style={{ color: '#C11D2A' }}>*</span></label><FocusInp value={m.name} placeholder="Nombre completo" onChange={e => setM(i, 'name', e.target.value)} /></div>
            <div><label style={lbl}>Rol / Énfasis <span style={{ color: '#C11D2A' }}>*</span></label><FocusInp value={m.role} placeholder="Ej: Director General" onChange={e => setM(i, 'role', e.target.value)} /></div>
          </div>
          <div style={{ marginBottom: '0.8rem' }}><label style={lbl}>Biografía (opcional)</label><FocusTA value={m.bio} placeholder="Descripción del miembro…" onChange={e => setM(i, 'bio', e.target.value)} style={{ minHeight: 80 }} /></div>
          <MediaUpload label="Foto de perfil" src={m.photo_src} mediaType={m.photo_type || 'image'} onSrc={s => setM(i, 'photo_src', s)} onType={t => { const n = [...members]; n[i] = { ...n[i], photo_type: t }; setMembers(n); }} />
          <div style={{ marginTop: '0.6rem' }}><label style={lbl}>Alt text foto (opcional)</label><FocusInp value={m.photo_alt} placeholder="Nombre del miembro" onChange={e => setM(i, 'photo_alt', e.target.value)} /></div>
        </div>
      ))}
      <button onClick={() => setMembers([...members, { name: '', role: '', bio: '', photo_src: '', photo_alt: '', photo_type: 'image' }])} style={{ ...btnGhost, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem' }}>
        <i className="bi bi-person-plus" /> Agregar miembro
      </button>
    </div>
  );
}

function CarouselForm({ content, onChange }: { content: Record<string, unknown>; onChange: (c: Record<string, unknown>) => void }) {
  type CarItem = { src: string; alt: string; name: string; media_type: MediaType };
  const items: CarItem[] = (content.items as CarItem[]) || [{ src: '', alt: '', name: '', media_type: 'image' }];
  const setItems = (it: CarItem[]) => onChange({ ...content, items: it });
  const setI = (i: number, k: keyof CarItem, v: string) => { const n = [...items]; n[i] = { ...n[i], [k]: v }; setItems(n); };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>Agregá imágenes o logos. El "Nombre" aparece debajo de cada elemento.</p>
      {items.map((item, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <p style={{ ...lbl, margin: 0, color: '#C11D2A' }}>Elemento {i + 1}</p>
            {items.length > 1 && <button onClick={() => setItems(items.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'rgba(193,29,42,0.5)', cursor: 'pointer', fontSize: '1rem' }}><i className="bi bi-trash" /></button>}
          </div>
          <MediaUpload src={item.src} mediaType={item.media_type || 'image'} onSrc={s => setI(i, 'src', s)} onType={t => { const n = [...items]; n[i] = { ...n[i], media_type: t }; setItems(n); }} />
          <div style={{ marginTop: '0.6rem' }}><label style={lbl}>Nombre / Logo <span style={{ color: '#C11D2A' }}>*</span></label><FocusInp value={item.name} placeholder="Nombre de la empresa o logo" onChange={e => setI(i, 'name', e.target.value)} /></div>
          <div style={{ marginTop: '0.6rem' }}><label style={lbl}>Alt text (opcional)</label><FocusInp value={item.alt} placeholder="Descripción" onChange={e => setI(i, 'alt', e.target.value)} /></div>
        </div>
      ))}
      <button onClick={() => setItems([...items, { src: '', alt: '', name: '', media_type: 'image' }])} style={{ ...btnGhost, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem' }}>
        <i className="bi bi-plus-lg" /> Agregar elemento
      </button>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────
export default function AdminNosotrosPage() {
  const [blocks,  setBlocks]  = useState<AboutBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState('');

  const [panelOpen,    setPanelOpen]    = useState(false);
  const [editBlock,    setEditBlock]    = useState<AboutBlock | null>(null);
  const [typeSelector, setTypeSelector] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AboutBlock | null>(null);

  const [blockName,  setBlockName]  = useState('');
  const [blockTitle, setBlockTitle] = useState('');
  const [blockSub,   setBlockSub]   = useState('');
  const [blockType,  setBlockType]  = useState<BlockType>('text-image');
  const [content,    setContent]    = useState<Record<string, unknown>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('about_blocks').select('*').order('sort_order');
    setBlocks(data ?? []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const openNew = (type: BlockType) => {
    setTypeSelector(false); setEditBlock(null); setBlockType(type);
    setBlockName(''); setBlockTitle(''); setBlockSub(''); setContent(''); setMsg('');
    setPanelOpen(true);
  };
  const openEdit = (b: AboutBlock) => {
    setEditBlock(b); setBlockType(b.block_type); setBlockName(b.title || '');
    setBlockTitle((b.content.section_title as string) || '');
    setBlockSub((b.content.section_subtitle as string) || '');
    setContent(b.content); setMsg(''); setPanelOpen(true);
  };
  const closePanel = () => { setPanelOpen(false); setMsg(''); };

  const handleSave = async () => {
    if (!blockName.trim()) { setMsg('⚠ El nombre identificador es requerido.'); return; }
    setSaving(true); setMsg('');
    const payload = {
      block_type: blockType, title: blockName.trim(), subtitle: blockSub.trim() || null,
      content: { ...content, section_title: blockTitle.trim(), section_subtitle: blockSub.trim() },
      is_active: true,
    };
    try {
      if (editBlock) {
        const { error } = await supabase.from('about_blocks').update(payload).eq('id', editBlock.id);
        if (error) throw error;
        await logAction('project_updated', `Se actualizó el bloque About "${blockName}"`, { entityType: 'about_block', entityId: editBlock.id, entityName: blockName });
      } else {
        const maxOrder = blocks.length > 0 ? Math.max(...blocks.map(b => b.sort_order)) + 1 : 0;
        const { error } = await supabase.from('about_blocks').insert({ ...payload, sort_order: maxOrder });
        if (error) throw error;
        await logAction('project_created', `Se creó el bloque About "${blockName}" (${blockType})`, { entityType: 'about_block', entityName: blockName });
      }
      await load(); setSaving(false); setTimeout(closePanel, 400);
    } catch (e: unknown) {
      setMsg('Error: ' + (e instanceof Error ? e.message : 'desconocido'));
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from('about_blocks').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null); await load();
  };
  const toggleActive = async (b: AboutBlock) => {
    await supabase.from('about_blocks').update({ is_active: !b.is_active }).eq('id', b.id); await load();
  };
  const moveBlock = async (idx: number, dir: -1 | 1) => {
    const target = blocks[idx]; const swap = blocks[idx + dir]; if (!swap) return;
    await Promise.all([
      supabase.from('about_blocks').update({ sort_order: swap.sort_order }).eq('id', target.id),
      supabase.from('about_blocks').update({ sort_order: target.sort_order }).eq('id', swap.id),
    ]); await load();
  };

  const meta = BLOCK_TYPES.find(t => t.type === blockType);

  return (
    <AdminGuard>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={{ paddingTop: 220, minHeight: '100vh', background: '#151515' }}>
        <div className="max-w-[1290px] mx-auto px-6 lg:px-10 py-14">

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p className="section-eyebrow">Admin</p>
              <h1 style={{ fontFamily: "'Roboto Flex',sans-serif", fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 200, letterSpacing: '0.08em', color: '#fff' }}>Nosotros — Bloques</h1>
              <div style={{ width: 36, height: 1.5, background: '#C11D2A', marginTop: '0.7rem' }} />
            </div>
            <button style={btnRed} onClick={() => setTypeSelector(true)}><i className="bi bi-plus-lg" style={{ marginRight: '0.4rem' }} /> Nuevo Bloque</button>
          </div>

          {loading ? <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Cargando bloques…</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {blocks.length === 0 && <p style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>No hay bloques. ¡Creá el primero!</p>}
              {blocks.map((b, idx) => {
                const m = BLOCK_TYPES.find(t => t.type === b.block_type);
                return (
                  <div key={b.id} style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'border-color 0.15s' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)')}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', flexShrink: 0 }}>
                      <button onClick={() => moveBlock(idx, -1)} disabled={idx === 0} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: idx === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)', cursor: idx === 0 ? 'default' : 'pointer', width: 28, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', transition: 'all 0.15s' }} onMouseEnter={e => { if (idx !== 0) { const el = e.currentTarget; el.style.borderColor = '#C11D2A'; el.style.color = '#C11D2A'; }}} onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,255,255,0.1)'; el.style.color = 'rgba(255,255,255,0.5)'; }}><i className="bi bi-chevron-up" /></button>
                      <button onClick={() => moveBlock(idx, 1)} disabled={idx === blocks.length - 1} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: idx === blocks.length - 1 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.5)', cursor: idx === blocks.length - 1 ? 'default' : 'pointer', width: 28, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', transition: 'all 0.15s' }} onMouseEnter={e => { if (idx !== blocks.length - 1) { const el = e.currentTarget; el.style.borderColor = '#C11D2A'; el.style.color = '#C11D2A'; }}} onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'rgba(255,255,255,0.1)'; el.style.color = 'rgba(255,255,255,0.5)'; }}><i className="bi bi-chevron-down" /></button>
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(193,29,42,0.12)', border: '1px solid rgba(193,29,42,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`bi ${m?.icon ?? 'bi-square'}`} style={{ color: '#C11D2A', fontSize: '0.9rem' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: '#e0e0e0', fontSize: '0.9rem', fontWeight: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title || '(sin nombre)'}</p>
                      <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{m?.label ?? b.block_type}</p>
                    </div>
                    <button onClick={() => toggleActive(b)} style={{ background: 'none', border: `1px solid ${b.is_active ? 'rgba(76,175,80,0.4)' : 'rgba(255,255,255,0.1)'}`, color: b.is_active ? '#4caf50' : 'rgba(255,255,255,0.25)', padding: '0.2rem 0.7rem', cursor: 'pointer', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.2s', flexShrink: 0 }}>
                      {b.is_active ? 'Visible' : 'Oculto'}
                    </button>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      <button onClick={() => openEdit(b)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.6)', padding: '0.3rem 0.8rem', cursor: 'pointer', fontSize: '0.72rem', transition: 'all 0.2s' }} onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#C11D2A'; el.style.color = '#C11D2A'; }} onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.18)'; el.style.color = 'rgba(255,255,255,0.6)'; }}><i className="bi bi-pencil" /> Editar</button>
                      <button onClick={() => setDeleteTarget(b)} style={{ background: 'none', border: 'none', color: 'rgba(193,29,42,0.6)', padding: '0.3rem 0.6rem', cursor: 'pointer', fontSize: '1rem', transition: 'color 0.2s' }} onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C11D2A')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(193,29,42,0.6)')}><i className="bi bi-trash" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Selector de tipo ── */}
      {typeSelector && (
        <>
          <div onClick={() => setTypeSelector(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 900 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#111', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', maxWidth: 640, width: '90%', zIndex: 901, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A' }}>Nuevo Bloque</p>
                <h2 style={{ fontFamily: "'Roboto Flex',sans-serif", fontWeight: 200, color: '#fff', fontSize: '1.3rem', marginTop: '0.2rem' }}>Elegí el tipo de bloque</h2>
              </div>
              <button onClick={() => setTypeSelector(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.8rem' }}>
              {BLOCK_TYPES.map(t => (
                <button key={t.type} onClick={() => openNew(t.type)}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem', cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.15s, background 0.15s' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#C11D2A'; el.style.background = 'rgba(193,29,42,0.08)'; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.08)'; el.style.background = 'rgba(255,255,255,0.03)'; }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                    <i className={`bi ${t.icon}`} style={{ color: '#C11D2A', fontSize: '1.2rem' }} />
                    <span style={{ fontFamily: "'Roboto Flex',sans-serif", fontWeight: 300, color: '#fff', fontSize: '0.95rem' }}>{t.label}</span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{t.desc}</p>
                  <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.5rem', fontFamily: 'monospace' }}>{t.layout}</p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── MODAL centrado de edición ── */}
      {panelOpen && (
        <>
          <div onClick={closePanel} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 900 }} />
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '94%', maxWidth: 740, maxHeight: '88vh', background: '#111', zIndex: 901, overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.08)' }}>

            <div style={{ position: 'sticky', top: 0, background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1.2rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
              <div>
                <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A' }}>{editBlock ? 'Editar' : 'Nuevo'} bloque — {meta?.label}</p>
                <h2 style={{ fontFamily: "'Roboto Flex',sans-serif", fontSize: '1.2rem', fontWeight: 200, color: '#fff', letterSpacing: '0.06em', marginTop: '0.2rem' }}>{blockName || '(sin nombre)'}</h2>
              </div>
              <button onClick={closePanel} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '1.6rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
              <div style={{ background: 'rgba(193,29,42,0.06)', border: '1px solid rgba(193,29,42,0.2)', padding: '1rem' }}>
                <label style={{ ...lbl, color: '#C11D2A' }}>Nombre identificador <span style={{ color: '#C11D2A' }}>*</span></label>
                <FocusInp value={blockName} placeholder="Ej: Quiénes somos, Equipo principal…" onChange={e => setBlockName(e.target.value)} />
                <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.3rem' }}>Solo visible en el admin para identificar el bloque.</p>
              </div>

              <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A', borderBottom: '1px solid rgba(193,29,42,0.2)', paddingBottom: '0.5rem' }}>Encabezado de sección (opcional)</p>
              <div><label style={lbl}>Título visible en el sitio</label><FocusInp value={blockTitle} placeholder="Ej: Nuestro Equipo" onChange={e => setBlockTitle(e.target.value)} /></div>
              <div><label style={lbl}>Subtítulo</label><FocusTA value={blockSub} placeholder="Descripción breve…" onChange={e => setBlockSub(e.target.value)} style={{ minHeight: 60 }} /></div>

              <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A', borderBottom: '1px solid rgba(193,29,42,0.2)', paddingBottom: '0.5rem' }}>Contenido — {meta?.label}</p>

              {(blockType === 'text-image' || blockType === 'image-text') && <TextImageForm content={content} onChange={setContent} />}
              {(blockType === 'bullets-image' || blockType === 'image-bullets') && <BulletsImageForm content={content} onChange={setContent} />}
              {blockType === 'team'     && <TeamForm     content={content} onChange={setContent} />}
              {blockType === 'carousel' && <CarouselForm content={content} onChange={setContent} />}

              {msg && <div style={{ padding: '0.8rem 1rem', background: msg.startsWith('Error') || msg.startsWith('⚠') ? 'rgba(193,29,42,0.1)' : 'rgba(76,175,80,0.1)', border: `1px solid ${msg.startsWith('Error') || msg.startsWith('⚠') ? 'rgba(193,29,42,0.3)' : 'rgba(76,175,80,0.3)'}` }}><p style={{ fontSize: '0.82rem', color: msg.startsWith('Error') || msg.startsWith('⚠') ? '#C11D2A' : '#4caf50' }}>{msg}</p></div>}

              <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1rem' }}>
                <button style={{ ...btnRed, opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving}>{saving ? 'Guardando…' : editBlock ? 'Actualizar' : 'Crear Bloque'}</button>
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
            <h3 style={{ fontFamily: "'Roboto Flex',sans-serif", fontWeight: 200, color: '#fff', marginBottom: '0.6rem' }}>Eliminar Bloque</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1.8rem' }}>¿Eliminar <strong style={{ color: '#fff' }}>{deleteTarget.title}</strong>?</p>
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
