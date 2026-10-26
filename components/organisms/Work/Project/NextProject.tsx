'use client';

import Link from 'next/link';
import cx from 'classnames';
import { ViewTransition } from 'react';

import type { Project } from '@/app/work/projects';
import { BRAND_BG_CLASS } from '@/lib/brand';

export default function NextProject({
  project,
  number,
}: {
  project: Project;
  number: string;
}) {
  return (
    // Named like the next project's hero: this band grows into it.
    <ViewTransition name={`project-card-${project.slug}`} share="card-morph">
      <Link
        href={`/work/${project.slug}`}
        className={cx(
          'group rounded-3xl border-2 border-black grid grid-cols-12 gap-5 py-12 md:py-20',
          'outline-none focus-visible:ring-4 focus-visible:ring-foreground',
          BRAND_BG_CLASS[project.color],
        )}
      >
        <span className="col-start-2 col-end-12 font-nav font-bold uppercase text-sm">
          Next project
        </span>
        <span className="col-start-2 col-end-12 flex items-end justify-between gap-6">
          <span className="flex items-baseline gap-4 md:gap-8 min-w-0">
            <span className="font-primary font-bold text-3xl md:text-5xl">
              {number}
            </span>
            <span className="font-primary uppercase font-bold leading-[0.86] text-[clamp(44px,8vw,128px)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-3">
              {project.shortName ?? project.name}
            </span>
          </span>
          <span
            aria-hidden
            className="grid place-items-center shrink-0 size-14 md:size-24 rounded-full bg-black text-white motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-rotate-45"
          >
            <svg viewBox="0 0 24 24" className="size-7 md:size-10" fill="none">
              <path
                d="M4 12h15m0 0-6-6m6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
      </Link>
    </ViewTransition>
  );
}
