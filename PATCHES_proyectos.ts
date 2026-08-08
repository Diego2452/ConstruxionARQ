// ═══════════════════════════════════════════════════════
// PARCHE 1: Modal centrado en admin/proyectos/page.tsx
// ═══════════════════════════════════════════════════════

// ── CTRL+H #1 — Estado EN (buscar la línea de [rows]) ──
// BUSCAR:
  const [rows, setRows] = useState<MediaRow[]>([emptyRow()]);

// REEMPLAZAR:
  const [titleEn,       setTitleEn]       = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [rows, setRows] = useState<MediaRow[]>([emptyRow()]);


// ── CTRL+H #2 — openNew resetear EN ──
// BUSCAR:
    setDimensions(''); setYear(''); setCategory(''); setDescription('');
    setRows([emptyRow()]); setMsg(''); setPanelOpen(true);

// REEMPLAZAR:
    setDimensions(''); setYear(''); setCategory(''); setDescription('');
    setTitleEn(''); setDescriptionEn('');
    setRows([emptyRow()]); setMsg(''); setPanelOpen(true);


// ── CTRL+H #3 — openEdit cargar EN ──
// BUSCAR:
    setCategory(p.category ?? ''); setDescription(p.description ?? '');
    const loaded: MediaRow[]

// REEMPLAZAR:
    setCategory(p.category ?? ''); setDescription(p.description ?? '');
    setTitleEn(p.title_en ?? '');
    setDescriptionEn(p.description_en ?? '');
    const loaded: MediaRow[]


// ── CTRL+H #4 — save UPDATE incluir EN ──
// BUSCAR:
          year: year.trim() || null,
          category: category.trim() || null, description: description.trim() || null,
        }).eq('id', editProject.id);

// REEMPLAZAR:
          year: year.trim() || null,
          category: category.trim() || null, description: description.trim() || null,
          title_en: titleEn.trim() || null,
          description_en: descriptionEn.trim() || null,
        }).eq('id', editProject.id);


// ── CTRL+H #5 — save INSERT incluir EN ──
// BUSCAR:
          year: year.trim() || null,
          category: category.trim() || null, description: description.trim() || null,
        }).select().single();

// REEMPLAZAR:
          year: year.trim() || null,
          category: category.trim() || null, description: description.trim() || null,
          title_en: titleEn.trim() || null,
          description_en: descriptionEn.trim() || null,
        }).select().single();


// ── CTRL+H #6 — Convertir panel lateral → modal centrado ──
// BUSCAR:
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 680, background: '#111', zIndex: 901, overflowY: 'auto', boxShadow: '-4px 0 40px rgba(0,0,0,0.6)' }}>

// REEMPLAZAR:
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '94%', maxWidth: 720, maxHeight: '88vh', background: '#111', zIndex: 901, overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.08)' }}>


// ── CTRL+H #7 — Agregar campos EN en el formulario ──
//    (va justo antes del bloque de Media)
// BUSCAR:
              <div><label style={lbl}>Descripción</label><textarea style={{ ...inp, minHeight: 90, resize: 'vertical' }} value={description} placeholder="Descripción del proyecto…" onChange={e => setDescription(e.target.value)} onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} /></div>
              {/* Media */}

// REEMPLAZAR:
              <div><label style={lbl}>Descripción</label><textarea style={{ ...inp, minHeight: 90, resize: 'vertical' }} value={description} placeholder="Descripción del proyecto…" onChange={e => setDescription(e.target.value)} onFocus={e => (e.target.style.borderColor = '#C11D2A')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} /></div>

              {/* ── Traducción EN ── */}
              <p style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(33,150,243,0.8)', borderBottom: '1px solid rgba(33,150,243,0.15)', paddingBottom: '0.5rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <i className="bi bi-translate" /> Traducción al inglés <span style={{ color: 'rgba(255,255,255,0.2)' }}>(opcional)</span>
              </p>
              <div><label style={lbl}>Title (EN)</label><input style={inp} value={titleEn} placeholder="English project title" onChange={e => setTitleEn(e.target.value)} onFocus={e => (e.target.style.borderColor = '#2196f3')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} /></div>
              <div><label style={lbl}>Description (EN)</label><textarea style={{ ...inp, minHeight: 90, resize: 'vertical' }} value={descriptionEn} placeholder="English description…" onChange={e => setDescriptionEn(e.target.value)} onFocus={e => (e.target.style.borderColor = '#2196f3')} onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} /></div>

              {/* Media */}
