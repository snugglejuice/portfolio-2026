'use client';

import Link from 'next/link';
import cx from 'classnames';
import { useEffect, ViewTransition } from 'react';

import StickerImage from '@/components/atoms/StickerImage';
import { COVER_SIZES, type Project } from '@/app/work/projects';
import { BRAND_BG_CLASS, BRAND_HEX } from '@/lib/brand';
import { workTransition } from '@/lib/workTransition';

export default function ProjectHero({
  project,
  number,
}: {
  project: Project;
  number: string;
}) {
  // Lets /work (or the homepage) know which card to morph back into on
  // return. Cleared on leaving: the next page has read it while rendering,
  // and a later page must not morph a card in from somewhere else.
  useEffect(() => {
    workTransition.lastProjectSlug = project.slug;
    return () => {
      workTransition.lastProjectSlug = null;
    };
  }, [project.slug]);

  // The text rises in (CSS) once the card has morphed in from /work.
  return (
    // Same names as the /work tab and its visual: both morph into this hero.
    <ViewTransition name={`project-card-${project.slug}`} share="card-morph">
      <header
        className={cx(
          'rounded-3xl border-2 border-black grid grid-cols-12 gap-5',
          'pt-32 md:pt-36 pb-12 md:pb-16',
          BRAND_BG_CLASS[project.color],
        )}
      >
        <div className="col-start-2 col-end-12 flex flex-col gap-6 md:gap-8">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 w-max font-nav font-bold uppercase text-sm"
          >
            <span
              aria-hidden
              className="motion-safe:transition-transform motion-safe:group-hover:-translate-x-1"
            >
              ←
            </span>
            All projects
          </Link>

          <h1 className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 motion-safe:animate-rise motion-safe:[animation-delay:200ms]">
            <span className="font-primary font-bold text-3xl md:text-5xl">
              {number}
            </span>
            <span className="font-primary font-bold uppercase leading-[0.86] text-[clamp(40px,8.5vw,136px)]">
              {project.name}
            </span>
          </h1>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 motion-safe:animate-rise motion-safe:[animation-delay:300ms]">
            <p className="font-secondary font-bold text-xl md:text-3xl max-w-4xl">
              {project.pitch}
            </p>
            <ul className="flex flex-wrap gap-2 shrink-0">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="bg-white border-2 border-black rounded-full py-1 px-4 font-secondary font-medium whitespace-nowrap"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ViewTransition name={`project-cover-${project.slug}`}>
          <StickerImage
            src={project.cover.src}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            backColor={BRAND_HEX[project.stickerBack]}
            sizes={COVER_SIZES}
            eager
            reveal={false}
            className="col-start-2 col-end-12 mt-6 md:mt-10"
          />
        </ViewTransition>
      </header>
    </ViewTransition>
  );
}
