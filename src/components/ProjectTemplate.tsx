'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ProjectContent from '@/components/ProjectContent';

export default function ProjectTemplate() {
  const [state,   setState]   = useState<'loading' | 'found' | 'notfound'>('loading');
  const [project, setProject] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const parts = window.location.pathname.replace(/\/$/, '').split('/').filter(Boolean);
    const slug  = parts[parts.length - 1];
    if (!slug || slug === '_template') { setState('notfound'); return; }

    supabase.from('projects').select('*, project_images(*)')
      .eq('slug', slug).single()
      .then(({ data, error }) => {
        if (error || !data) { setState('notfound'); return; }
        setProject(data);
        setState('found');
      });
  }, []);

  if (state === 'loading') return (
    <div style={{ paddingTop: 300, textAlign: 'center', color: '#5a5a5a', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
      Cargando proyecto…
    </div>
  );

  if (state === 'notfound' || !project) return (
    <div style={{ paddingTop: 300, minHeight: '100vh', background: '#151515', textAlign: 'center' }}>
      <p style={{ fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C11D2A', marginBottom: '0.8rem' }}>404</p>
      <h1 style={{ fontFamily: "'Roboto Flex', sans-serif", fontWeight: 200, color: '#fff', fontSize: '2rem', letterSpacing: '0.08em' }}>Proyecto no encontrado</h1>
      <Link href="/proyectos/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
        <i className="bi bi-arrow-left" /> Volver a Proyectos
      </Link>
    </div>
  );

  const images = [...((project.project_images as unknown[]) ?? [])].sort((a: unknown, b: unknown) => {
    const ai = a as { is_primary: boolean; sort_order: number };
    const bi = b as { is_primary: boolean; sort_order: number };
    if (ai.is_primary && !bi.is_primary) return -1;
    if (!ai.is_primary && bi.is_primary) return 1;
    return (ai.sort_order ?? 0) - (bi.sort_order ?? 0);
  }) as Array<{ src: string; alt: string; caption: string | null; is_primary: boolean; media_type?: string }>;

  const primary = images.find(i => i.is_primary) ?? images[0];

  return (
    <ProjectContent
      slug={project.slug as string}
      title={project.title as string}
      description={(project.description as string) ?? undefined}
      thumbnail={primary?.src ?? ''}
      location={(project.location as string) ?? undefined}
      architect={(project.architect as string) ?? undefined}
      manager={(project.manager as string) ?? undefined}
      dimensions={(project.dimensions as string) ?? undefined}
      year={(project.year as string) ?? undefined}
      images={images.map(img => ({
        src: img.src, alt: img.alt,
        caption: img.caption ?? undefined,
        is_primary: img.is_primary,
        media_type: (img.media_type ?? 'image') as 'image' | 'video',
      }))}
    />
  );
}
