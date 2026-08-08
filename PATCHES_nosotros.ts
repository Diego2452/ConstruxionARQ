// ═══════════════════════════════════════════════════════
// PARCHE: Modal centrado en admin/nosotros/page.tsx
// ═══════════════════════════════════════════════════════

// ── CTRL+H #1 — panel lateral → modal centrado ──
// BUSCAR:
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 700, background: '#111', zIndex: 901, overflowY: 'auto', boxShadow: '-4px 0 40px rgba(0,0,0,0.6)' }}>

// REEMPLAZAR:
          <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '94%', maxWidth: 740, maxHeight: '88vh', background: '#111', zIndex: 901, overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.85)', border: '1px solid rgba(255,255,255,0.08)' }}>
