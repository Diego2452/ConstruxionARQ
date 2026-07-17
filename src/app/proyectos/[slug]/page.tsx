/* ── SERVER COMPONENT ── 100% Supabase, sin projects.ts ── */
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import ProjectContent from '@/components/ProjectContent';

// Client independiente para el build server-side
function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function generateStaticParams() {
  const supabase = getClient();
  const { data } = await supabase.from('projects').select('slug');
  return (data ?? []).map(p => ({ slug: p.slug }));
}

interface Props { params: { slug: string } }

export default async function ProjectPage({ params }: Props) {
  const supabase = getClient();

  const { data: project } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('slug', params.slug)
    .single();

  if (!project) notFound();

  // Sort: primary first, then by sort_order
  const images = [...(project.project_images ?? [])].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });

  const primaryImg = images.find(i => i.is_primary) ?? images[0];

  return (
    <ProjectContent
      slug={project.slug}
      title={project.title}
      description={project.description ?? undefined}
      thumbnail={primaryImg?.src ?? ''}
      location={project.location ?? undefined}
      architect={project.architect ?? undefined}
      manager={project.manager ?? undefined}
      dimensions={project.dimensions ?? undefined}
      year={project.year ?? undefined}
      images={images.map(img => ({
        src:        img.src,
        alt:        img.alt,
        caption:    img.caption ?? undefined,
        is_primary: img.is_primary,
      }))}
    />
  );
}
