import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Footer from '@/components/organisms/Footer';
import NextProject from '@/components/organisms/Work/Project/NextProject';
import ProjectFocus from '@/components/organisms/Work/Project/ProjectFocus';
import ProjectGallery from '@/components/organisms/Work/Project/ProjectGallery';
import ProjectHero from '@/components/organisms/Work/Project/ProjectHero';
import ProjectMeta from '@/components/organisms/Work/Project/ProjectMeta';
import ProjectQuote from '@/components/organisms/Work/Project/ProjectQuote';
import ProjectStory from '@/components/organisms/Work/Project/ProjectStory';
import { BRAND_HEX } from '@/lib/brand';
import { getNextProject, getProject, PROJECTS } from '../projects';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

// Only the projects listed in projects.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return {
    title: `${project.name} | Marion Séminel`,
    description: project.pitch,
  };
}

const toNumber = (slug: string) =>
  String(PROJECTS.findIndex((project) => project.slug === slug) + 1).padStart(
    2,
    '0',
  );

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const next = getNextProject(slug);

  return (
    <main className="p-4 flex flex-col gap-4">
      <ProjectHero project={project} number={toNumber(slug)} />
      <ProjectMeta project={project} />
      <ProjectStory project={project} />
      <ProjectGallery
        gallery={project.gallery}
        backColor={BRAND_HEX[project.stickerBack]}
      />
      {project.focus && (
        <ProjectFocus focus={project.focus} color={project.stickerBack} />
      )}
      {project.quote && <ProjectQuote quote={project.quote} />}
      <NextProject project={next} number={toNumber(next.slug)} />
      <Footer />
    </main>
  );
}
