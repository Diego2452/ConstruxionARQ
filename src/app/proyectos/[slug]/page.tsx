/* ── SERVER COMPONENT ── generateStaticParams aquí ── */
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import ProjectContent from '@/components/ProjectContent';

export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }));
}

interface Props { params: { slug: string } }

export default function ProjectPage({ params }: Props) {
  const project = projects.find(p => p.slug === params.slug);
  if (!project) notFound();

  return (
    <ProjectContent
      title={project.title}
      description={project.description}
      thumbnail={project.thumbnail}
      location={project.location}
      architect={project.architect}
      manager={project.manager}
      dimensions={project.dimensions}
      year={project.year}
      images={project.images}
    />
  );
}
