import { FEATURED_SLUGS, PROJECTS } from '@/app/work/projects';
import ProjectStack from './ProjectStack';
import './styles.css';

const TITLE_ID = 'selected-projects-title';

export default function SectionProjects() {
  const featured = PROJECTS.flatMap((project, index) =>
    FEATURED_SLUGS.includes(project.slug)
      ? [{ project, number: String(index + 1).padStart(2, '0') }]
      : [],
  );

  return (
    <section aria-labelledby={TITLE_ID} className="flex flex-col gap-4">
      <div className="bg-foreground p-6 md:p-10 flex flex-col gap-4 rounded-3xl">
        <h2
          id={TITLE_ID}
          className="font-primary font-bold text-[44px] md:text-[64px] uppercase leading-none"
        >
          Selected projects
        </h2>
        <p className="font-secondary text-xl md:text-[24px] leading-tight md:leading-none">
          Three of the products I’ve led the front-end on, from a Swiss ERP to a
          festival programme.
        </p>
      </div>

      <ProjectStack
        projects={featured}
        moreCount={PROJECTS.length - featured.length}
      />
    </section>
  );
}
