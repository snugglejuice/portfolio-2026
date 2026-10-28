'use client';

import cx from 'classnames';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { Project } from '@/app/work/projects';
import { workTransition } from '@/lib/workTransition';
import ProjectCard, { ArrowIcon, CARD_LINK_CLASS } from './ProjectCard';

export default function ProjectStack({
  projects,
  moreCount,
}: {
  projects: { project: Project; number: string }[];
  moreCount: number;
}) {
  // The /work tabs carry the same names as these cards: if every card were
  // named, going to /work (or coming back from it) would morph them into the
  // tabs, over the new page. Only the card that opens its project is named,
  // and the one its project hero morphs back into on return.
  const [openingSlug, setOpeningSlug] = useState<string | null>(null);
  const [returningFrom, setReturningFrom] = useState(
    () => workTransition.lastProjectSlug,
  );

  useEffect(() => {
    // Only needed for the transition that brought us here.
    const timer = window.setTimeout(() => setReturningFrom(null), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    // Sticky stack: each card sticks one step lower than the previous one,
    // so the cards it slides over keep their header strip visible.
    <ol
      className="section-projects__stack flex flex-col gap-4"
      style={{ '--stack-n': projects.length } as React.CSSProperties}
    >
      {projects.map(({ project, number }, index) => (
        <ProjectCard
          key={project.slug}
          project={project}
          number={number}
          index={index}
          isMorphing={project.slug === (openingSlug ?? returningFrom)}
          onOpen={() => setOpeningSlug(project.slug)}
        />
      ))}

      {/* Reaches down to the last project card's bottom once stacked, so it
          covers that card entirely (but its strip). */}
      <li
        className="section-projects__card section-projects__card--end group rounded-3xl border-2 border-foreground bg-background text-foreground grid grid-cols-12 content-between gap-5 py-12 md:py-20"
        style={
          {
            '--i': projects.length,
            '--tilt': `${projects.length % 2 ? 2.5 : -2.5}deg`,
          } as React.CSSProperties
        }
      >
        <p className="col-start-2 col-end-12 font-nav font-bold uppercase text-sm">
          +{moreCount} more projects
        </p>
        <div className="col-start-2 col-end-12 flex items-end justify-between gap-6">
          <Link
            href="/work"
            className={cx(
              CARD_LINK_CLASS,
              'focus-visible:after:ring-foreground',
              'font-primary uppercase font-bold leading-[0.86] text-[clamp(44px,8vw,128px)]',
            )}
          >
            <span className="block motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-3">
              See all work
            </span>
          </Link>
          <span
            aria-hidden
            className="grid place-items-center shrink-0 size-14 md:size-24 rounded-full bg-foreground text-background motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-rotate-45"
          >
            <ArrowIcon className="size-7 md:size-10" />
          </span>
        </div>
      </li>
    </ol>
  );
}
