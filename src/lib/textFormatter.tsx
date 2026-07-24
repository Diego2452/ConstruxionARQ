/**
 * ── ConstruxionARQ — Text Markup Language ───────────────
 *
 * Sintaxis soportada:
 *   **texto**         → negrita (blanco)
 *   *texto*           → itálica
 *   __texto__         → subrayado
 *   ~~texto~~         → tachado
 *   [r]texto[/r]      → rojo (#C11D2A)
 *   [w]texto[/w]      → blanco brillante (#fff)
 *
 * Ejemplo:
 *   "Antes **VARGAS MONTES DE OCA** ahora [r]CONSTRUXION ARQ[/r]"
 */

import React from 'react';

type Segment =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'italic'; value: string }
  | { type: 'underline'; value: string }
  | { type: 'strikethrough'; value: string }
  | { type: 'red'; value: string }
  | { type: 'red-italic'; value: string }
  | { type: 'white'; value: string };

// Tokenize the string into segments
function tokenize(input: string): Segment[] {
  const segments: Segment[] = [];
  // Order matters — longer patterns first
  const pattern = /(\*\*(.+?)\*\*)|(\[r\]\*(.+?)\*\[\/r\])|(\*\[r\](.+?)\[\/r\]\*)|(\[r\](.+?)\[\/r\])|(\*(.+?)\*)|(\_\_(.+?)\_\_)|(~~(.+?)~~)|(\[w\](.+?)\[\/w\])/gs;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    // Push any plain text before this match
    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: input.slice(lastIndex, match.index) });
    }

    if (match[1])       segments.push({ type: 'bold',       value: match[2]  });
    else if (match[3])  segments.push({ type: 'red-italic', value: match[4]  });
    else if (match[5])  segments.push({ type: 'red-italic', value: match[6]  });
    else if (match[7])  segments.push({ type: 'red',        value: match[8]  });
    else if (match[9])  segments.push({ type: 'italic',     value: match[10] });
    else if (match[11]) segments.push({ type: 'underline',  value: match[12] });
    else if (match[13]) segments.push({ type: 'strikethrough', value: match[14] });
    else if (match[15]) segments.push({ type: 'white',      value: match[16] });

    lastIndex = match.index + match[0].length;
  }

  // Remaining plain text
  if (lastIndex < input.length) {
    segments.push({ type: 'text', value: input.slice(lastIndex) });
  }

  return segments;
}

// Render a single segment to a React element
function renderSegment(seg: Segment, idx: number): React.ReactNode {
  switch (seg.type) {
    case 'red-italic':
      return <em key={idx} style={{ color: '#C11D2A' }}>{seg.value}</em>;
    case 'bold':
      return <strong key={idx} style={{ color: '#e8e8e8', fontWeight: 600 }}>{seg.value}</strong>;
    case 'italic':
      return <em key={idx}>{seg.value}</em>;
    case 'underline':
      return <span key={idx} style={{ textDecoration: 'underline' }}>{seg.value}</span>;
    case 'strikethrough':
      return <span key={idx} style={{ textDecoration: 'line-through' }}>{seg.value}</span>;
    case 'red':
      return <span key={idx} style={{ color: '#C11D2A' }}>{seg.value}</span>;
    case 'white':
      return <span key={idx} style={{ color: '#ffffff' }}>{seg.value}</span>;
    default:
      return <React.Fragment key={idx}>{seg.value}</React.Fragment>;
  }
}

/**
 * Parse and render a markup string into React nodes.
 * Usage: {renderTextMarkup("Texto **bold** y [r]rojo[/r]")}
 */
export function renderTextMarkup(text: string): React.ReactNode {
  if (!text) return null;
  const segs = tokenize(text);
  return segs.map(renderSegment);
}

/**
 * Strip all markup tags — returns plain text.
 * Useful for preview labels.
 */
export function stripMarkup(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/gs, '$1')
    .replace(/\*(.+?)\*/gs, '$1')
    .replace(/__(.+?)__/gs, '$1')
    .replace(/~~(.+?)~~/gs, '$1')
    .replace(/\[r\](.+?)\[\/r\]/gs, '$1')
    .replace(/\[w\](.+?)\[\/w\]/gs, '$1');
}
