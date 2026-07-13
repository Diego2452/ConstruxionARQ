'use client';
import Link from 'next/link';
import { useLang } from '@/contexts/LanguageContext';
import { t } from '@/data/translations';
import ProjectGallery from '@/components/ProjectGallery';

interface Image { src: string; alt: string; caption?: string; is_primary?: boolean; }
interface Props {
  slug: string;
  title: string;
  description?: string;
  thumbnail: string;
  location?: string;
  architect?: string;
  manager?: string;
  dimensions?: string;
  year?: string;
  images: Image[];
}

export default function ProjectContent({ slug, title, description, thumbnail, location, architect, manager, dimensions, year, images }: Props) {
  const { lang } = useLang();
  const tr = t[lang].proyecto;

  // Use translated title/description if available, fallback to DB values
  const projTr = (t[lang].projects as Record<string, { title?: string; description?: string } | undefined>)[slug];
  const displayTitle       = projTr?.title       ?? title;
  const displayDescription = projTr?.description ?? description;

  const meta = [
    { label: tr.location,   value: location   },
    { label: tr.architect,  value: architect  },
    { label: tr.pm,         value: manager    },
    { label: tr.dimensions, value: dimensions },
    { label: tr.year,       value: year       },
  ].filter(r => r.value);

  // Primary image first, then rest
  const sorted = [...images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
  const heroImg = sorted[0] ?? { src: thumbnail, alt: title };

  return (
    <div style={{ paddingTop: 200, minHeight: '100vh', background: '#151515' }}>

      {/* ── Hero image ── */}
      <div style={{ position: 'relative', width: '100%', height: '55vh', overflow: 'hidden' }}>
        <img
          src={heroImg.src}
          alt={heroImg.alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #151515)' }} />
        <div style={{ position: 'absolute', bottom: '2.5rem', left: 0, right: 0 }}>
          <div style={{ maxWidth: 1290, margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 2.5rem)' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C11D2A', marginBottom: '0.5rem' }}>
              {tr.label}
            </p>
            <h1 style={{ fontFamily: "'Roboto Flex', sans-serif", fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 200, letterSpacing: '0.08em', color: '#fff' }}>
              {displayTitle}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-[1290px] mx-auto px-6 lg:px-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12 mb-14">

          {/* Info panel */}
          <div className="reveal md:col-span-1">
            <div style={{ width: 40, height: 1.5, background: '#C11D2A', marginBottom: '1.5rem' }} />
            {meta.map(({ label, value }) => (
              <div key={label} style={{ marginBottom: '1.1rem' }}>
                <p style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C11D2A', marginBottom: '0.2rem' }}>
                  {label}
                </p>
                <p style={{ fontSize: '0.95rem', color: '#e8e8e8', fontWeight: 300 }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {displayDescription && (
            <div className="reveal md:col-span-2">
              <p style={{ fontSize: '1.05rem', lineHeight: 1.9, color: '#c0c0c0', fontWeight: 300 }}>
                {displayDescription}
              </p>
            </div>
          )}
        </div>

        <ProjectGallery images={sorted} />

        <div className="reveal mt-14">
          <Link href="/proyectos/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#C11D2A')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}
          >
            <i className="bi bi-arrow-left" /> {tr.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
