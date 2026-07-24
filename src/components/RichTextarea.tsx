'use client';
import { useRef } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minHeight?: number;
  label?: string;
}

// Wraps selected text (or inserts markers at cursor) with open/close tags
function wrapSelection(
  textarea: HTMLTextAreaElement,
  open: string,
  close: string,
  setValue: (v: string) => void
) {
  const start = textarea.selectionStart;
  const end   = textarea.selectionEnd;
  const val   = textarea.value;
  const selected = val.slice(start, end);
  const replacement = selected
    ? `${open}${selected}${close}`
    : `${open}${close}`;
  const newVal = val.slice(0, start) + replacement + val.slice(end);
  setValue(newVal);
  // Restore focus and selection
  setTimeout(() => {
    textarea.focus();
    const newCursor = selected
      ? start + replacement.length
      : start + open.length;
    textarea.setSelectionRange(newCursor, newCursor);
  }, 0);
}

const TOOLBAR: { label: string; open: string; close: string; title: string; style?: React.CSSProperties }[] = [
  { label: 'B',   open: '**', close: '**', title: 'Negrita (blanco)',  style: { fontWeight: 700 } },
  { label: 'I',   open: '*',  close: '*',  title: 'Itálica',           style: { fontStyle: 'italic' } },
  { label: 'U',   open: '__', close: '__', title: 'Subrayado',         style: { textDecoration: 'underline' } },
  { label: 'S',   open: '~~', close: '~~', title: 'Tachado',           style: { textDecoration: 'line-through' } },
  { label: 'R',   open: '[r]',close: '[/r]', title: 'Rojo',           style: { color: '#C11D2A', fontWeight: 600 } },
  { label: 'W',   open: '[w]',close: '[/w]', title: 'Blanco brillante',style: { color: '#fff', fontWeight: 600 } },
];

const inp: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  fontFamily: "'Roboto', sans-serif",
  fontSize: '0.85rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  padding: '0.65rem 0.85rem',
  resize: 'vertical',
};

const lbl: React.CSSProperties = {
  fontSize: '0.62rem',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.4)',
  display: 'block',
  marginBottom: '0.4rem',
};

export default function RichTextarea({ value, onChange, placeholder, minHeight = 100, label }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <div>
      {label && <label style={lbl}>{label}</label>}

      {/* Toolbar */}
      <div style={{
        display: 'flex', gap: '0.25rem', flexWrap: 'wrap',
        padding: '0.4rem 0.6rem',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderBottom: 'none',
      }}>
        {TOOLBAR.map(btn => (
          <button
            key={btn.label}
            type="button"
            title={btn.title}
            onClick={() => ref.current && wrapSelection(ref.current, btn.open, btn.close, onChange)}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.6)',
              width: 28, height: 26,
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontFamily: "'Roboto', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'border-color 0.15s, color 0.15s, background 0.15s',
              ...btn.style,
            }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.borderColor = '#C11D2A';
              el.style.background = 'rgba(193,29,42,0.12)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.borderColor = 'rgba(255,255,255,0.12)';
              el.style.background = 'none';
            }}
          >
            {btn.label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', alignSelf: 'center', letterSpacing: '0.06em' }}>
          Seleccioná texto y presioná un botón
        </span>
      </div>

      {/* Textarea */}
      <textarea
        ref={ref}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...inp, minHeight, borderRadius: 0 }}
        onFocus={e => (e.target.style.borderColor = '#C11D2A')}
        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
      />

      {/* Legend */}
      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
        {[
          { syntax: '**texto**',   desc: 'Negrita' },
          { syntax: '*texto*',     desc: 'Itálica'  },
          { syntax: '__texto__',   desc: 'Subrayado' },
          { syntax: '~~texto~~',   desc: 'Tachado'  },
          { syntax: '[r]texto[/r]',desc: 'Rojo'     },
          { syntax: '[w]texto[/w]',desc: 'Blanco'   },
        ].map(l => (
          <span key={l.syntax} style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.04em' }}>
            <code style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)' }}>{l.syntax}</code> = {l.desc}
          </span>
        ))}
      </div>
    </div>
  );
}
