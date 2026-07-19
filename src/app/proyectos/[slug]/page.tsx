import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import ProjectContent from '@/components/ProjectContent';
import ProjectTemplate from '@/components/ProjectTemplate';

function buildClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function generateStaticParams() {
  const sb = buildClient();
  if (sb) {
    try {
      const { data } = await sb.from('projects').select('slug');
      if (data && data.length > 0) {
        return [...data.map((p: { slug: string }) => ({ slug: p.slug })), { slug: '_template' }];
      }
    } catch { /* fallthrough */ }
  }
  const { projects } = await import('@/data/projects');
  return [...projects.map(p => ({ slug: p.slug })), { slug: '_template' }];
}

interface Props { params: { slug: string } }

export default async function ProjectPage({ params }: Props) {
  if (params.slug === '_template') return <ProjectTemplate />;

  const sb = buildClient();
  if (sb) {
    try {
      const { data: project } = await sb
        .from('projects')
        .select('*, project_images(*)')
        .eq('slug', params.slug)
        .single();

      if (project) {
        const images = [...(project.project_images ?? [])].sort((a: { is_primary: boolean; sort_order: number }, b: { is_primary: boolean; sort_order: number }) => {
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          return (a.sort_order ?? 0) - (b.sort_order ?? 0);
        });
        const primary = images.find((i: { is_primary: boolean }) => i.is_primary) ?? images[0];

        return (
          <ProjectContent
            slug={project.slug} title={project.title}
            description={project.description ?? undefined}
            thumbnail={primary?.src ?? ''}
            location={project.location ?? undefined}
            architect={project.architect ?? undefined}
            manager={project.manager ?? undefined}
            dimensions={project.dimensions ?? undefined}
            year={project.year ?? undefined}
            images={images.map((img: { src: string; alt: string; caption: string | null; is_primary: boolean; media_type?: string }) => ({
              src: img.src, alt: img.alt,
              caption: img.caption ?? undefined,
              is_primary: img.is_primary,
              media_type: (img.media_type ?? 'image') as 'image' | 'video',
            }))}
          />
        );
      }
    } catch { /* fallthrough */ }
  }

  const { projects } = await import('@/data/projects');
  const project = projects.find(p => p.slug === params.slug);
  if (!project) notFound();
  return (
    <ProjectContent
      slug={project.slug} title={project.title}
      description={project.description}
      thumbnail={project.images?.[0]?.src ?? project.thumbnail}
      location={project.location} architect={project.architect}
      manager={project.manager} dimensions={project.dimensions}
      year={project.year}
      images={(project.images ?? []).map(img => ({ ...img, media_type: 'image' as const }))}
    />
  );
}
