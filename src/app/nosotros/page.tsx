'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { detectMediaType } from '@/lib/supabase';
import { renderTextMarkup } from '@/lib/textFormatter';

// ── Types ─────────────────────────────────────────────────
interface AboutBlock {
  id: string;
  block_type: string;
  title: string | null;
  subtitle: string | null;
  content: Record<string, unknown>;
  sort_order: number;
  is_active: boolean;
}

interface BulletItem {
  text: string;
  icon_class?: string;
}

// ── Static fallback (existing content) ────────────────────
const BASE  = 'https://construxionarq.com/wp-content/uploads';

// ── Block renderers ───────────────────────────────────────
function MediaEl({ src, alt, caption, mediaType, style }: { src: string; alt?: string; caption?: string; mediaType?: string; style?: React.CSSProperties }) {
  const type = (mediaType ?? detectMediaType(src)) as 'image' | 'video';
  return (
    <div style={{ position: 'relative', width: '100%', ...style }}>
      {type === 'video' ? (
        <video src={src} controls style={{ width: '100%', display: 'block' }} />
      ) : (
        <img src={src} alt={alt || ''} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', filter: 'brightness(0.9)', transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' }}
        onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.07)')}
        onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
      />
      )}
      {caption && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.4)', padding: '0.8rem', textAlign: 'right' }}>
          <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', margin: 0 }}>{caption}</p>
        </div>
      )}
    </div>
  );
}

function TextImageBlock({ content, reverse, title }: { content: Record<string, unknown>; reverse?: boolean; title?: string | null }) {
  const text      = content.text as string || '';
  const imageSrc  = content.image_src as string || '';
  const imageAlt  = content.image_alt as string || '';
  const caption   = content.image_caption as string || '';
  const mediaType = content.media_type as string || '';
  
  const textEl = (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: reverse ? 'left' : 'right', height: '100%', padding: '2rem' }}>
      {title && (
        <>
          <h3 style={{ fontFamily: "'Roboto Flex', sans-serif", fontSize: '0.85rem', fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A', marginBottom: '0.8rem' }}>
            {title}
          </h3>
          <h2 style={{ fontFamily: "'Roboto Flex', sans-serif", fontSize: '1.6rem', fontWeight: 200, letterSpacing: '0.06em', color: '#fff', marginBottom: '0.8rem' }}>
            {title}
          </h2>
          <div style={{ width: 40, height: 1.5, background: '#C11D2A', marginBottom: '1.2rem', alignSelf: reverse ? 'flex-start' : 'flex-end' }} />
        </>
      )}
      <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: '#b8b8b8', fontWeight: 300 }}>
        {renderTextMarkup(text)}
      </p>
    </div>
  );
  
  const imgEl = imageSrc ? (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', overflow: 'hidden', width: '100%' }}>
      <MediaEl src={imageSrc} alt={imageAlt} caption={caption} mediaType={mediaType} style={{ width: '100%', height: '100%' }} />
    </div>
  ) : null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ minHeight: 400 }}>
      <div style={{ background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {reverse ? imgEl : textEl}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {reverse ? textEl : imgEl}
      </div>
    </div>
  );
}

function BulletsImageBlock({ content, reverse }: { content: Record<string, unknown>; reverse?: boolean }) {
  const bulletsRaw = (content.bullets as (string | BulletItem)[]) || [];
  const imageSrc  = content.image_src as string || '';
  const imageAlt  = content.image_alt as string || '';
  const caption   = content.image_caption as string || '';
  const mediaType = content.media_type as string || '';

  // Normalize bullets to BulletItem format
  const bullets: BulletItem[] = bulletsRaw.map(b => 
    typeof b === 'string' ? { text: b, icon_class: 'bi-check2-circle' } : b
  );

  const bulletsEl = (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '2rem' }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {bullets.map((b, i) => (
          <li key={i}
            style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', flexDirection: 'row', textAlign: 'right', justifyContent: 'flex-end', cursor: 'default' }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              const icon = el.querySelector('i') as HTMLElement | null;
              const span = el.querySelector('span') as HTMLElement | null;
              if (icon) { icon.style.transform = 'scale(1.4) rotate(360deg)'; icon.style.filter = 'drop-shadow(0 0 6px rgba(193,29,42,0.6))'; }
              if (span) { span.style.color = '#e8e8e8'; span.style.transform = 'translateX(-3px)'; }
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              const icon = el.querySelector('i') as HTMLElement | null;
              const span = el.querySelector('span') as HTMLElement | null;
              if (icon) { icon.style.transform = 'scale(1) rotate(0deg)'; icon.style.filter = 'none'; }
              if (span) { span.style.color = '#b0b0b0'; span.style.transform = 'translateX(0)'; }
            }}
          >
            <span style={{ fontSize: '0.95rem', lineHeight: 1.7, color: '#b0b0b0', fontWeight: 300, transition: 'color 0.3s, transform 0.3s' }}>
              {renderTextMarkup(b.text)}
            </span>
            <i className={`bi ${b.icon_class || 'bi-check2-circle'}`}
              style={{ color: '#C11D2A', fontSize: '0.95rem', flexShrink: 0, transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)', display: 'inline-block' }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
  
  const imgEl = imageSrc ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}><MediaEl src={imageSrc} alt={imageAlt} caption={caption} mediaType={mediaType} style={{ width: '100%', height: '100%' }} /></div> : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ minHeight: 280 }}>
      <div style={{ background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center' }}>
        {reverse ? imgEl : bulletsEl}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {reverse ? bulletsEl : imgEl}
      </div>
    </div>
  );
}

function TeamBlock({ content }: { content: Record<string, unknown> }) {
  const members = (content.members as Array<{ name: string; role: string; bio?: string; photo_src: string; photo_alt?: string }>) || [];
  return (
    <>
      <style>{`
        .team-member-card {
          transition: transform 0.3s ease;
          padding: 1.4rem;
          background: rgba(0,0,0,0.3);
        }
        .team-member-card:hover {
          transform: scale(1.04);
        }
      `}</style>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((m, i) => (
          <div key={i} className="team-member-card reveal">
            <div style={{ overflow: 'hidden', marginBottom: '1.4rem', aspectRatio: '1', background: '#1a1a1a' }}>
              {m.photo_src && <img src={m.photo_src} alt={m.photo_alt || m.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' }}
                onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.08)')}
                onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')}
              />}
            </div>
            <h3 style={{ fontFamily: "'Roboto Flex', sans-serif", fontSize: '1.05rem', fontWeight: 400, color: '#fff', marginBottom: '0.3rem' }}>{m.name}</h3>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: '#C11D2A', marginBottom: '0.8rem' }}>{m.role}</p>
            {m.bio && <p style={{ fontSize: '0.87rem', lineHeight: 1.78, color: '#909090', fontWeight: 300 }}>{renderTextMarkup(m.bio)}</p>}
          </div>
        ))}
      </div>
    </>
  );
}

function CarouselBlock({ content }: { content: Record<string, unknown> }) {
  const items = (content.items as Array<{ src: string; alt?: string; name: string; media_type?: string }>) || [];
  if (items.length === 0) return null;
  const doubled = [...items, ...items]; // loop seamless

  return (
    <div>
      <style>{`
        @keyframes carousel-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .carousel-track { animation: carousel-scroll ${Math.max(items.length * 3, 12)}s linear infinite; }
        .carousel-track:hover { animation-play-state: paused; }
      `}</style>
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        {/* Fade edges */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, #151515, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, #151515, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div className="carousel-track" style={{ display: 'flex', gap: '2rem', width: 'max-content' }}>
          {doubled.map((item, i) => (
            <div key={i} style={{ flexShrink: 0, width: 160, textAlign: 'center' }}>
              <div style={{ width: 160, height: 100, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '0.6rem' }}>
                {item.src ? (
                  detectMediaType(item.src) === 'video'
                    ? <video src={item.src} muted loop style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <img src={item.src} alt={item.alt || item.name} style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                ) : (
                  <i className="bi bi-image" style={{ color: '#333', fontSize: '1.5rem' }} />
                )}
              </div>
              <p style={{ fontSize: '0.68rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderBlock(block: AboutBlock) {
  const { block_type, content, title, subtitle } = block;
  const showBlockHeader = (block_type !== 'text-image' && block_type !== 'image-text') && (title || subtitle);
  const isTeamBlock = block_type === 'team';

  return (
    <div key={block.id}>
      {showBlockHeader && (
        <div style={{ marginBottom: '2rem', textAlign: isTeamBlock ? 'center' : 'center' }}>
          {subtitle && <p style={{ fontSize: '0.85rem', fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A', marginBottom: '0.5rem' }}>{subtitle}</p>}
          {title && <h2 style={{ fontFamily: "'Roboto Flex', sans-serif", fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 200, letterSpacing: '0.06em', color: '#fff', marginBottom: '0.8rem' }}>{title}</h2>}
          <div style={{ width: 40, height: 1.5, background: '#C11D2A', marginTop: '0.8rem', margin: '0.8rem auto 0' }} />
        </div>
      )}
      {block_type === 'text-image'      && <TextImageBlock content={content} title={title} />}
      {block_type === 'image-text'      && <TextImageBlock content={content} reverse title={title} />}
      {block_type === 'bullets-image'   && <BulletsImageBlock content={content} />}
      {block_type === 'image-bullets'   && <BulletsImageBlock content={content} reverse />}
      {block_type === 'team'            && <TeamBlock content={content} />}
      {block_type === 'carousel'        && <CarouselBlock content={content} />}
    </div>
  );
}

// ── Static fallback page (original content) ───────────────
// [REMOVED - Now using CMS-first approach]

// ── Main page ─────────────────────────────────────────────
export default function NosotrosPage() {
  const [blocks,  setBlocks]  = useState<AboutBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadBlocks = async () => {
      try {
        const { data, error } = await supabase
          .from('about_blocks')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (!isActive) return;

        if (error) throw error;

        if (data) {
          setBlocks(data as AboutBlock[]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadBlocks();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [blocks, loading]);

  return (
    <div style={{ paddingTop: 200, background: '#151515' }}>
      {/* ── Page header (always shown) ── */}
      <section className="max-w-[1290px] mx-auto px-6 lg:px-10 pt-14 pb-10">
        <p className="section-eyebrow" style={{ color: '#C11D2A' }}>Diseñando Calidad,<br />Construyendo Confianza</p>
        <h1 className="reveal" style={{ fontFamily: "'Roboto Flex', Roboto, sans-serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 200, letterSpacing: '0.08em', color: '#fff', lineHeight: 1.2, marginTop: '0.4rem' }}>
          Sobre Nosotros
        </h1>
        <div style={{ width: 40, height: 1.5, background: '#C11D2A', marginTop: '1rem' }} />
        <p className="reveal" style={{ marginTop: '1.2rem', color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', fontWeight: 300, lineHeight: 1.7, maxWidth: 560 }}>
          Desde 1990 construimos con vocación, honestidad y excelencia. Conocé al equipo que hace posible cada proyecto.
        </p>
      </section>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#5a5a5a', fontSize: '0.85rem' }}>Cargando…</div>
      ) : blocks.length > 0 ? (
        /* CMS content */
        <div>
          {blocks.map((block, idx) => (
            <section
              key={block.id}
              style={{ padding: '4rem 0', background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.25)' }}
            >
              <div className="max-w-[1290px] mx-auto px-6 lg:px-10">
                {renderBlock(block)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* No content available */
        <div style={{ padding: '4rem', textAlign: 'center', color: '#5a5a5a', fontSize: '0.85rem' }}>
          No hay bloques disponibles. Configúralos en el panel de administración.
        </div>
      )}
    </div>
  );
}
