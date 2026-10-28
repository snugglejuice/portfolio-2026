import type { Project } from '@/app/work/projects';

const EXTERNAL_LINK_CLASS =
  'font-primary font-bold uppercase text-2xl md:text-3xl underline-offset-4 decoration-2 hover:underline';

export default function ProjectMeta({ project }: { project: Project }) {
  const items = [
    { label: 'Client', value: project.client },
    { label: 'Role', value: project.role },
    ...(project.year ? [{ label: 'Year', value: project.year }] : []),
    { label: 'Stack', value: project.stack.join(' · ') },
  ];

  return (
    <section
      aria-label="Key facts"
      className="bg-foreground rounded-3xl grid grid-cols-12 gap-5 py-10 md:py-14"
    >
      <dl className="col-start-2 col-end-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
        {items.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <dt className="font-secondary text-lg text-[#808080]">{label}</dt>
            <dd className="font-secondary font-medium text-xl md:text-2xl">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {(project.liveUrl || project.superhuitUrl) && (
        <div className="col-start-2 col-end-12 flex flex-wrap gap-x-10 gap-y-4 mt-4 pt-8 border-t-2 border-black">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={EXTERNAL_LINK_CLASS}
            >
              Visit the live site ↗
            </a>
          )}
          {project.superhuitUrl && (
            <a
              href={project.superhuitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={EXTERNAL_LINK_CLASS}
            >
              Made at Superhuit ↗
            </a>
          )}
        </div>
      )}
    </section>
  );
}
