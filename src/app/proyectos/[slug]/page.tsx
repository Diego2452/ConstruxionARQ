/* ── SERVER COMPONENT — generateStaticParams desde Supabase ── */
import { notFound } from 'next/navigation';
import { getProjectBySlug, getProjects } from '@/lib/supabase';
import ProjectContent from '@/components/ProjectContent';

export async function generateStaticParams() {
  const projects = await getProjects().catch(() => []);
  return projects.map(p => ({ slug: p.slug }));
}

interface Props { params: { slug: string } }

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const images = (project.project_images ?? []).map(img => ({
    src:       img.src,
    alt:       img.alt,
    caption:   img.caption ?? undefined,
    is_primary: img.is_primary,
  }));

  return (
    <ProjectContent
      slug={project.slug}
      title={project.title}
      description={project.description ?? undefined}
      thumbnail={images.find(i => i.is_primary)?.src ?? images[0]?.src ?? ''}
      location={project.location ?? undefined}
      architect={project.architect ?? undefined}
      manager={project.manager ?? undefined}
      dimensions={project.dimensions ?? undefined}
      year={project.year ?? undefined}
      images={images}
    />
  );
}
