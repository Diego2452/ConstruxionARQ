'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { detectMediaType } from '@/lib/supabase';
import { renderTextMarkup } from '@/lib/textFormatter';
import { useLang } from '@/contexts/LanguageContext';

interface AboutBlock {
  id: string; block_type: string; title: string | null; subtitle: string | null;
  content: Record<string, unknown>; sort_order: number; is_active: boolean;
}
interface BulletItem { text: string; icon_class?: string; text_en?: string; }

// ── Media element ──────────────────────────────────────────
function MediaEl({ src, alt, caption, mediaType }: { src: string; alt?: string; caption?: string; mediaType?: string }) {
  const type = (mediaType ?? detectMediaType(src)) as 'image' | 'video';
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {type === 'video'
        ? <video src={src} controls style={{ width: '100%', display: 'block' }} />
        : <img src={src} alt={alt || ''} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', filter: 'brightness(0.9)', transition: 'transform 0.5s' }} onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.04)')} onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')} />
      }
      {caption && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.45)', padding: '0.6rem', textAlign: 'right' }}>
          <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', margin: 0 }}>{caption}</p>
        </div>
      )}
    </div>
  );
}

// ── Text / Image block ─────────────────────────────────────
function TextImageBlock({ content, reverse, title, lang }: { content: Record<string, unknown>; reverse?: boolean; title?: string | null; lang: string }) {
  const text     = (lang === 'en' ? (content.text_en as string) : null) || (content.text as string) || '';
  const imageSrc = content.image_src as string || '';
  const imageAlt = content.image_alt as string || '';
  const caption  = content.image_caption as string || '';
  const mediaType= content.media_type as string || '';

  const textEl = (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: reverse ? 'left' : 'right', height: '100%', padding: '2.5rem 2rem' }}>
      {title && (
        <>
          <h3 style={{ fontFamily: "'Roboto Flex',sans-serif", fontSize: '0.85rem', fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A', marginBottom: '0.5rem' }}>{title}</h3>
          <div style={{ width: 40, height: 1.5, background: '#C11D2A', marginBottom: '1.2rem', alignSelf: reverse ? 'flex-start' : 'flex-end' }} />
        </>
      )}
      <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: '#b8b8b8', fontWeight: 300 }}>
        {renderTextMarkup(text)}
      </p>
    </div>
  );

  const imgEl = imageSrc ? (
    <div style={{ overflow: 'hidden', height: '100%', display: 'flex', alignItems: 'center' }}>
      <MediaEl src={imageSrc} alt={imageAlt} caption={caption} mediaType={mediaType} />
    </div>
  ) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ minHeight: 380 }}>
      <div style={{ background: 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {reverse ? imgEl : textEl}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {reverse ? textEl : imgEl}
      </div>
    </div>
  );
}

// ── Bullets / Image block ──────────────────────────────────
function BulletsImageBlock({ content, reverse, lang }: { content: Record<string, unknown>; reverse?: boolean; lang: string }) {
  const rawBullets = (content.bullets as (string | BulletItem)[]) || [];
  const rawEN      = (content.bullets_en as string[] | undefined) || [];
  const bullets: BulletItem[] = rawBullets.map((b, i) => {
    const base = typeof b === 'string' ? { text: b, icon_class: 'bi-check2-circle' } : b;
    const enText = rawEN[i];
    return { ...base, text_en: enText };
  });

  const imageSrc  = content.image_src as string || '';
  const imageAlt  = content.image_alt as string || '';
  const mediaType = content.media_type as string || '';

  const bulletsEl = (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '2.5rem 2rem' }}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {bullets.map((b, i) => {
          const displayText = lang === 'en' && b.text_en ? b.text_en : b.text;
          return (
            <li key={i}
              style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', flexDirection: reverse ? 'row' : 'row-reverse', textAlign: reverse ? 'left' : 'right', justifyContent: reverse ? 'flex-start' : 'flex-end', cursor: 'default' }}
              onMouseEnter={e => { const el = e.currentTarget; const icon = el.querySelector('i') as HTMLElement | null; const span = el.querySelector('span') as HTMLElement | null; if (icon) { icon.style.transform = 'scale(1.4) rotate(360deg)'; icon.style.filter = 'drop-shadow(0 0 6px rgba(193,29,42,0.6))'; } if (span) { span.style.color = '#e8e8e8'; } }}
              onMouseLeave={e => { const el = e.currentTarget; const icon = el.querySelector('i') as HTMLElement | null; const span = el.querySelector('span') as HTMLElement | null; if (icon) { icon.style.transform = 'none'; icon.style.filter = 'none'; } if (span) { span.style.color = '#b0b0b0'; } }}>
              <span style={{ fontSize: '0.93rem', lineHeight: 1.7, color: '#b0b0b0', fontWeight: 300, transition: 'color 0.2s' }}>
                {renderTextMarkup(displayText)}
              </span>
              <i className={`bi ${b.icon_class || 'bi-check2-circle'}`}
                style={{ color: '#C11D2A', fontSize: '0.95rem', flexShrink: 0, transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)', display: 'inline-block' }} />
            </li>
          );
        })}
      </ul>
    </div>
  );

  const imgEl = imageSrc ? (
    <div style={{ overflow: 'hidden', height: '100%', display: 'flex', alignItems: 'center' }}>
      <MediaEl src={imageSrc} alt={imageAlt} mediaType={mediaType} />
    </div>
  ) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0" style={{ minHeight: 280 }}>
      <div style={{ background: 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center' }}>
        {reverse ? imgEl : bulletsEl}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {reverse ? bulletsEl : imgEl}
      </div>
    </div>
  );
}

// ── Team block ─────────────────────────────────────────────
function TeamBlock({ content, lang }: { content: Record<string, unknown>; lang: string }) {
  type Member = { name: string; role: string; role_en?: string; bio?: string; bio_en?: string; photo_src: string; photo_alt?: string; photo_type?: string };
  const members = (content.members as Member[]) || [];
  return (
    <>
      <style>{`.team-member-card:hover{transform:scale(1.03)}`}</style>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {members.map((m, i) => (
          <div key={i} className="reveal" style={{ transition: 'transform 0.3s', padding: '1.2rem', background: 'rgba(0,0,0,0.25)' }}>
            {m.photo_src && (
              <div style={{ overflow: 'hidden', marginBottom: '1.2rem', aspectRatio: '1', background: '#1a1a1a' }}>
                <img src={m.photo_src} alt={m.photo_alt || m.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                  onMouseEnter={e => ((e.target as HTMLImageElement).style.transform = 'scale(1.06)')}
                  onMouseLeave={e => ((e.target as HTMLImageElement).style.transform = 'scale(1)')} />
              </div>
            )}
            <h3 style={{ fontFamily: "'Roboto Flex', sans-serif", fontSize: '1.05rem', fontWeight: 400, color: '#fff', marginBottom: '0.3rem' }}>{m.name}</h3>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: '#C11D2A', marginBottom: '0.8rem' }}>
              {lang === 'en' && m.role_en ? m.role_en : m.role}
            </p>
            {(m.bio || m.bio_en) && (
              <p style={{ fontSize: '0.87rem', lineHeight: 1.78, color: '#909090', fontWeight: 300 }}>
                {renderTextMarkup(lang === 'en' && m.bio_en ? m.bio_en : (m.bio || ''))}
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

// ── Carousel block ─────────────────────────────────────────
function CarouselBlock({ content, lang }: { content: Record<string, unknown>; lang: string }) {
  type CarItem = { src: string; alt?: string; name: string; name_en?: string; media_type?: string };
  const items = (content.items as CarItem[]) || [];
  if (items.length === 0) return null;
  const doubled = [...items, ...items];
  return (
    <div>
      <style>{`@keyframes carousel-scroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.carousel-track{animation:carousel-scroll ${Math.max(items.length * 3, 12)}s linear infinite}.carousel-track:hover{animation-play-state:paused}`}</style>
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, #151515, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, #151515, transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div className="carousel-track" style={{ display: 'flex', gap: '2rem', width: 'max-content' }}>
          {doubled.map((item, i) => (
            <div key={i} style={{ flexShrink: 0, width: 160, textAlign: 'center' }}>
              <div style={{ width: 160, height: 100, background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '0.6rem' }}>
                {item.src
                  ? detectMediaType(item.src) === 'video'
                    ? <video src={item.src} muted loop style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <img src={item.src} alt={item.alt || item.name} style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                  : <i className="bi bi-image" style={{ color: '#333', fontSize: '1.5rem' }} />
                }
              </div>
              <p style={{ fontSize: '0.68rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)' }}>
                {lang === 'en' && item.name_en ? item.name_en : item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Render a block ─────────────────────────────────────────
function renderBlock(block: AboutBlock, lang: string) {
  const { block_type, content, title, subtitle } = block;
  const showHeader = !['text-image', 'image-text'].includes(block_type) && (content.section_title || subtitle);
  const sectionTitle    = (content.section_title as string)    || title    || '';
  const sectionSubtitle = (content.section_subtitle as string) || subtitle || '';

  return (
    <div key={block.id}>
      {showHeader && (
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          {sectionSubtitle && <p style={{ fontSize: '0.85rem', fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C11D2A', marginBottom: '0.5rem' }}>{sectionSubtitle}</p>}
          {sectionTitle && <h2 style={{ fontFamily: "'Roboto Flex', sans-serif", fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 200, letterSpacing: '0.06em', color: '#fff' }}>{sectionTitle}</h2>}
          <div style={{ width: 40, height: 1.5, background: '#C11D2A', margin: '0.8rem auto 0' }} />
        </div>
      )}
      {(block_type === 'text-image') && <TextImageBlock content={content} title={sectionTitle || null} lang={lang} />}
      {(block_type === 'image-text') && <TextImageBlock content={content} reverse title={sectionTitle || null} lang={lang} />}
      {(block_type === 'bullets-image') && <BulletsImageBlock content={content} lang={lang} />}
      {(block_type === 'image-bullets') && <BulletsImageBlock content={content} reverse lang={lang} />}
      {(block_type === 'team')     && <TeamBlock     content={content} lang={lang} />}
      {(block_type === 'carousel') && <CarouselBlock content={content} lang={lang} />}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────
export default function NosotrosPage() {
  const { lang } = useLang();
  const [blocks,  setBlocks]  = useState<AboutBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.from('about_blocks').select('*').eq('is_active', true).order('sort_order')
      .then(({ data }) => { if (active && data) setBlocks(data as AboutBlock[]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
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
      {/* ── Header ── */}
      <section className="max-w-[1290px] mx-auto px-6 lg:px-10 pt-14 pb-10">
        <p className="section-eyebrow" style={{ color: '#C11D2A' }}>
          {lang === 'en' ? 'Designing Quality, Building Trust' : 'Diseñando Calidad, Construyendo Confianza'}
        </p>
        <h1 className="reveal" style={{ fontFamily: "'Roboto Flex', Roboto, sans-serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 200, letterSpacing: '0.08em', color: '#fff', lineHeight: 1.2, marginTop: '0.4rem' }}>
          {lang === 'en' ? 'About Us' : 'Sobre Nosotros'}
        </h1>
        <div style={{ width: 40, height: 1.5, background: '#C11D2A', marginTop: '1rem' }} />
        <p className="reveal" style={{ marginTop: '1.2rem', color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', fontWeight: 300, lineHeight: 1.7, maxWidth: 560 }}>
          {lang === 'en'
            ? 'Since 1990 we build with vocation, honesty and excellence. Meet the team behind every project.'
            : 'Desde 1990 construimos con vocación, honestidad y excelencia. Conocé al equipo que hace posible cada proyecto.'}
        </p>
      </section>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#5a5a5a', fontSize: '0.85rem' }}>Cargando…</div>
      ) : blocks.length > 0 ? (
        <div>
          {blocks.map((block, idx) => (
            <section key={block.id} style={{ padding: '4rem 0', background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.22)' }}>
              <div className="max-w-[1290px] mx-auto px-6 lg:px-10">
                {renderBlock(block, lang)}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#5a5a5a', fontSize: '0.85rem' }}>
          {lang === 'en' ? 'No blocks available. Configure them in the admin panel.' : 'No hay bloques disponibles. Configúralos en el panel de administración.'}
        </div>
      )}
    </div>
  );
}
