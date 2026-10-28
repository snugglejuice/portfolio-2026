'use client';

import cx from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { ViewTransition } from 'react';

import { COVER_SIZES, type Project } from '@/app/work/projects';
import { BRAND_BG_CLASS } from '@/lib/brand';

// Stretched link: its ::after covers the whole card (the sticky <li> is its
// containing block), so the card is clickable but the link's name stays short.
// Never transform the link itself (hover nudges go on an inner span): a
// transform makes it the ::after's containing block, which then shrinks to
// the link text the moment the card is hovered.
export const CARD_LINK_CLASS = cx(
  'outline-none after:absolute after:inset-0 after:rounded-3xl after:z-10',
  'focus-visible:after:ring-4 focus-visible:after:ring-inset',
);

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M4 12h15m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Tags({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <ul className={cx('flex flex-wrap gap-2', className)}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="bg-white border-2 border-black rounded-full py-0.5 px-3 text-sm lg:py-1 lg:px-4 lg:text-base font-secondary font-medium whitespace-nowrap"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

function CardArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cx(
        'grid place-items-center rounded-full bg-black text-white motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-rotate-45',
        className,
      )}
    >
      <ArrowIcon className="size-5 lg:size-7" />
    </span>
  );
}

export default function ProjectCard({
  project,
  number,
  index,
  isMorphing,
  onOpen,
}: {
  project: Project;
  number: string;
  index: number;
  // Only the card opening (or returning from) its project shares the hero's
  // name, see ProjectStack.
  isMorphing: boolean;
  onOpen: () => void;
}) {
  const meta = [
    { label: 'Client', value: project.client },
    { label: 'Role', value: project.role },
    { label: 'Year', value: project.year },
  ].filter((item) => item.value);

  return (
    // Same name as the project hero: the whole card grows into it. The cover
    // is not shared (the hero's is a sticker), it fades with the card.
    // Otherwise the card stays out of page transitions (no name, no
    // enter/exit fade above the next page).
    <ViewTransition
      name={isMorphing ? `project-card-${project.slug}` : undefined}
      default={isMorphing ? undefined : 'none'}
      share={isMorphing ? 'card-morph' : 'none'}
    >
      <li
        className={cx(
          'section-projects__card section-projects__card--project group',
          'rounded-3xl border-2 border-black grid grid-cols-12 gap-x-5 gap-y-4 pb-6 lg:pb-10',
          // The card has a set height (see styles.css): below lg the content
          // sits at the top, from lg the cover fills the room left.
          'content-start lg:grid-rows-[auto_minmax(0,1fr)]',
          BRAND_BG_CLASS[project.color],
        )}
        style={
          {
            '--i': index,
            '--tilt': `${index % 2 ? 2.5 : -2.5}deg`,
          } as React.CSSProperties
        }
      >
        {/* Exactly one stack step tall: the strip left visible once the
            next card has stacked over this one. */}
        <div className="col-start-2 col-end-12 h-(--stack-step) flex items-center justify-between gap-4 lg:gap-6">
          <h3 className="flex items-baseline gap-3 lg:gap-6 min-w-0">
            <span className="font-primary font-bold text-xl lg:text-3xl">
              {number}
            </span>
            <Link
              href={`/work/${project.slug}`}
              onClick={onOpen}
              className={cx(
                CARD_LINK_CLASS,
                'focus-visible:after:ring-black min-w-0',
                'font-primary font-bold uppercase leading-[0.9]',
                'text-2xl lg:text-[48px] xl:text-[56px]',
              )}
            >
              <span className="block truncate motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-2">
                {project.shortName ?? project.name}
              </span>
            </Link>
          </h3>

          {/* The longer names need the room: the tags join the strip from
              xl only, the arrow from lg (below, both sit under the pitch). */}
          <span className="hidden lg:flex items-center gap-6 shrink-0">
            <Tags tags={project.tags} className="max-xl:hidden" />
            <CardArrow className="size-16" />
          </span>
        </div>

        {/* The cover fills its frame (stretched to the row from lg) instead
            of sizing it: every card keeps the same height whatever the
            cover's ratio. */}
        <div
          className={cx(
            'col-start-2 col-end-12 lg:col-start-6 lg:row-start-2',
            'relative aspect-video lg:aspect-auto overflow-hidden',
            'rounded-2xl border-2 border-black shadow-[6px_6px_0_#000]',
            'motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:-rotate-1',
          )}
        >
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            // Same sizes as the project hero: opening the project then reuses
            // the cached file instead of fetching a second one mid-morph.
            sizes={COVER_SIZES}
            className="object-cover object-top"
          />
        </div>

        <div className="col-start-2 col-end-12 lg:col-end-6 lg:row-start-2 flex flex-col gap-4 lg:gap-6 font-secondary">
          <p className="font-bold text-lg leading-snug lg:text-xl xl:text-2xl">
            {project.pitch}
          </p>
          <div className="flex items-end justify-between gap-4 xl:hidden">
            <Tags tags={project.tags} />
            <CardArrow className="size-10 shrink-0 lg:hidden" />
          </div>
          <dl className="hidden xl:flex flex-col gap-1 text-lg">
            {meta.map(({ label, value }) => (
              <div key={label} className="flex gap-4">
                <dt className="w-16 shrink-0 font-bold">{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </li>
    </ViewTransition>
  );
}
