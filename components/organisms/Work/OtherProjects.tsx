import cx from 'classnames';

import type { OtherProject } from '@/app/work/projects';

const TITLE_ID = 'other-projects-title';

// Columns from lg (10 of the 12-col grid, col 2 → col 11): name 3, role 2,
// where 2, stack 2, link 1. Below lg each row stacks, with the link top
// right of the name.
const COL = {
  name: 'col-start-1 lg:col-span-3',
  role: 'col-span-2 lg:col-start-4',
  company: 'col-span-2 lg:col-start-6',
  stack: 'col-span-2 lg:col-start-8',
};

function Cell({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cx('flex gap-3 lg:block', className)}>
      {/* The column headers say it from lg. */}
      <dt className="w-16 shrink-0 font-bold lg:sr-only">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function OtherProjects({
  projects,
}: {
  projects: OtherProject[];
}) {
  return (
    <section
      aria-labelledby={TITLE_ID}
      className="bg-foreground rounded-3xl grid grid-cols-12 gap-x-5 py-12 md:py-20"
    >
      <div className="col-start-2 col-end-12 flex flex-col gap-4 mb-10 md:mb-14">
        <h2
          id={TITLE_ID}
          className="font-primary font-bold text-[44px] md:text-[64px] uppercase leading-none"
        >
          More projects
        </h2>
        <p className="font-secondary text-xl md:text-[24px] leading-tight md:leading-none">
          Take-overs, support missions and smaller builds.
        </p>
      </div>

      <div
        aria-hidden
        className="hidden lg:grid col-start-2 col-end-12 grid-cols-10 gap-x-5 pb-3 font-nav font-bold uppercase text-sm"
      >
        <span className={COL.name}>Project</span>
        <span className={COL.role}>Role</span>
        <span className={COL.company}>Where</span>
        <span className={COL.stack}>Stack</span>
      </div>

      <ul className="col-start-2 col-end-12 border-t-2 border-black">
        {projects.map((project) => (
          <li
            key={project.name}
            className="group relative grid grid-cols-[1fr_auto] lg:grid-cols-10 gap-x-5 gap-y-3 py-6 border-b-2 border-black font-secondary text-lg"
          >
            <div className={cx(COL.name, 'flex flex-col gap-1')}>
              <h3 className="font-primary font-bold uppercase leading-none text-2xl lg:text-[32px]">
                <span
                  className={cx(
                    'block',
                    project.url &&
                      'motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-2',
                  )}
                >
                  {project.name}
                </span>
              </h3>
              {project.note && (
                <p className="text-base leading-snug">{project.note}</p>
              )}
            </div>

            <dl className="contents">
              <Cell label="Role" className={COL.role}>
                {project.role}
              </Cell>
              {project.company && (
                <Cell label="Where" className={COL.company}>
                  {project.company}
                </Cell>
              )}
              <Cell label="Stack" className={COL.stack}>
                <ul className="flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="bg-white border-2 border-black rounded-full py-0.5 px-3 text-sm font-medium whitespace-nowrap"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </Cell>
            </dl>

            {project.url && (
              // Stretched link: the whole row opens the live site.
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className={cx(
                  'col-start-2 row-start-1 lg:col-start-10 justify-self-end self-start',
                  'outline-none after:absolute after:inset-0 focus-visible:after:ring-4 focus-visible:after:ring-black',
                )}
              >
                <span className="sr-only">
                  Visit the {project.name} website (opens in a new tab)
                </span>
                <span
                  aria-hidden
                  className="grid place-items-center size-10 lg:size-12 rounded-full bg-black text-white motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-110"
                >
                  {/* Diagonal: leaves the site. */}
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5 lg:size-6 -rotate-45"
                    fill="none"
                  >
                    <path
                      d="M4 12h15m0 0-6-6m6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
