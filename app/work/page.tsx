import type { Metadata } from 'next';

import Footer from '@/components/organisms/Footer';
import ProjectTabs from '@/components/organisms/Work/ProjectTabs';
import WorkHero from '@/components/organisms/Work/WorkHero';
import { PROJECTS, WORK_INTRO } from './projects';

export const metadata: Metadata = {
  title: 'Projects | Marion Séminel',
  description: WORK_INTRO,
};

export default function WorkPage() {
  return (
    <main className="p-4 flex flex-col gap-4">
      <WorkHero count={PROJECTS.length} intro={WORK_INTRO} />
      <ProjectTabs projects={PROJECTS} />
      <Footer />
    </main>
  );
}
