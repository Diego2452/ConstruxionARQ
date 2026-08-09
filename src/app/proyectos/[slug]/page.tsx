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

function normalizeSlug(slug: string) {
  return slug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function slugCandidates(slug: string) {
  const normalized = normalizeSlug(slug);
  return normalized === slug ? [slug] : [slug, normalized];
}

export async function generateStaticParams() {
  const sb = buildClient();
  const slugs = new Set<string>();
  const addCandidate = (slug: string) => slugCandidates(slug).forEach((candidate) => slugs.add(candidate));

  if (sb) {
    try {
      const { data } = await sb.from('projects').select('slug');
      if (data && data.length > 0) {
        data.forEach((p: { slug: string }) => addCandidate(p.slug));
        slugs.add('_template');
        return Array.from(slugs).map((slug) => ({ slug }));
      }
    } catch {
      /* fallthrough */
    }
  }

  const { projects } = await import('@/data/projects');
  projects.forEach((p) => addCandidate(p.slug));
  slugs.add('_template');
  return Array.from(slugs).map((slug) => ({ slug }));
}

interface Props { params: { slug: string } }

export default async function ProjectPage({ params }: Props) {
  if (params.slug === '_template') return <ProjectTemplate />;

  const sb = buildClient();
  const normalizedSlug = normalizeSlug(params.slug);
  if (sb) {
    try {
      const query = sb.from('projects').select('*, project_images(*)');
      const { data: project } = normalizedSlug !== params.slug
        ? await query.in('slug', [params.slug, normalizedSlug]).single()
        : await query.eq('slug', params.slug).single();

      if (project) {
        const images = [...(project.project_images ?? [])].sort((a: { is_primary: boolean; sort_order: number }, b: { is_primary: boolean; sort_order: number }) => {
          if (a.is_primary && !b.is_primary) return -1;
          if (!a.is_primary && b.is_primary) return 1;
          return (a.sort_order ?? 0) - (b.sort_order ?? 0);
        });
        const primary = images.find((i: { is_primary: boolean }) => i.is_primary) ?? images[0];

        return (
          <ProjectContent
            slug={project.slug}
            title={project.title}
            title_en={project.title_en ?? undefined}
            description={project.description ?? undefined}
            description_en={project.description_en ?? undefined}
            thumbnail={primary?.src ?? ''}
            location={project.location ?? undefined}
            architect={project.architect ?? undefined}
            manager={project.manager ?? undefined}
            dimensions={project.dimensions ?? undefined}
            year={project.year ?? undefined}
            images={images.map((img: { src: string; alt: string; caption: string | null; is_primary: boolean; media_type?: string }) => ({
              src: img.src,
              alt: img.alt,
              caption: img.caption ?? undefined,
              is_primary: img.is_primary,
              media_type: (img.media_type ?? 'image') as 'image' | 'video',
            }))}
          />
        );
      }
    } catch {
      /* fallthrough */
    }
  }

  const { projects } = await import('@/data/projects');
  const project = projects.find(
    (p) => p.slug === params.slug || normalizeSlug(p.slug) === normalizedSlug
  );
  if (!project) notFound();

  return (
    <ProjectContent
      slug={project.slug}
      title={project.title}
      description={project.description}
      thumbnail={project.images?.[0]?.src ?? project.thumbnail}
      location={project.location}
      architect={project.architect}
      manager={project.manager}
      dimensions={project.dimensions}
      year={project.year}
      images={(project.images ?? []).map((img) => ({ ...img, media_type: 'image' as const }))}
    />
  );
}
