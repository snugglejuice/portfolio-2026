'use client';

import cx from 'classnames';
import { useLenis } from 'lenis/react';
import * as m from 'motion/react-m';
import { AnimatePresence } from 'motion/react';
import { useRef, useState, ViewTransition } from 'react';

import Button from '@/components/atoms/button';
import StickerImage, {
  preloadStickerScene,
} from '@/components/atoms/StickerImage';
import { BRAND_BG_CLASS, BRAND_HEX } from '@/lib/brand';
import { COVER_SIZES, type Project } from '@/app/work/projects';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

const PANEL_EASE = [0.65, 0, 0.35, 1] as const;
// Height each tab keeps hidden under the next one (crency-style stack).
const OVERLAP_CLASS = '-mt-8';
// Same horizontal rhythm as the page grid (col 2 → col 11).
const GUTTER_CLASS = 'px-6 md:px-[calc((100%_-_220px)/12_+_20px)]';

interface ProjectTabProps {
  project: Project;
  index: number;
  playEntrance: boolean;
  // Page-transition role while /work is left or re-entered (see ProjectTabs).
  slideRole: 'tab-exit' | 'tab-enter' | null;
  isOpen: boolean;
  onToggle: () => void;
  onLeave: () => void;
}

export default function ProjectTab({
  project,
  index,
  playEntrance,
  slideRole,
  isOpen,
  onToggle,
  onLeave,
}: ProjectTabProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();
  const tabRef = useRef<HTMLLIElement>(null);
  // The panel clips while its height animates, then lets the sticker's
  // canvas overhang (peel + shadow) once settled.
  const [isSettled, setSettled] = useState(false);

  const panelId = `project-panel-${project.slug}`;
  const number = String(index + 1).padStart(2, '0');

  const bringPanelIntoView = () => {
    const tab = tabRef.current;
    if (!tab) return;
    const { top, bottom } = tab.getBoundingClientRect();
    if (bottom <= window.innerHeight && top >= 0) return;
    const target = window.scrollY + top - 96;
    if (lenis) lenis.scrollTo(target, { duration: 0.9 });
    // Lenis is off under reduced motion: jump instead of smooth-scrolling.
    else
      window.scrollTo({
        top: target,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
  };

  return (
    // The opened tab's whole coloured card grows into the project hero; the
    // other tabs slide down out of the way (and back up on return, see
    // slideRole).
    <ViewTransition
      name={`project-card-${project.slug}`}
      // While this tab slides (hand-named below), React must not put its own
      // name on it: React names every on-screen <ViewTransition>, which
      // overrode the slide name and left the tab in the page crossfade.
      default={slideRole ? 'none' : undefined}
      share={slideRole ? 'none' : 'card-morph'}
    >
      <li
        ref={tabRef}
        className={cx(
          'relative rounded-3xl border-2 border-black',
          BRAND_BG_CLASS[project.color],
          { [OVERLAP_CLASS]: index > 0 },
          // CSS, not JS: the server HTML stays visible without JavaScript,
          // and reduced motion simply skips it.
          { 'motion-safe:animate-drop': playEntrance },
        )}
        style={
          {
            // Later tabs sit on top of earlier ones, like stacked folders.
            zIndex: index + 1,
            animationDelay: `${0.25 + index * 0.09}s`,
            '--drop-rotate': `${index % 2 ? 2.5 : -2.5}deg`,
            // React only animates <ViewTransition> exit/enter at the top of
            // the swapped tree, so these tabs (nested in the page) are named
            // by hand to slide out/in instead of fading with the page.
            ...(slideRole && {
              viewTransitionName: `tab-slide-${project.slug}`,
              viewTransitionClass: slideRole,
            }),
          } as React.CSSProperties
        }
      >
        <h2>
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            // The sticker inside mounts on open: warm three.js up first.
            onPointerEnter={preloadStickerScene}
            onPointerDown={preloadStickerScene}
            onFocus={preloadStickerScene}
            onClick={() => {
              setSettled(false);
              onToggle();
            }}
            className={cx(
              GUTTER_CLASS,
              // Extra bottom padding = the part hidden under the next tab, so the
              // visible space matches the top.
              'group w-full flex items-center justify-between gap-6 pt-7 pb-14 md:pt-9 md:pb-[68px] text-left cursor-pointer',
              'outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-inset rounded-3xl',
            )}
          >
            <span className="flex items-baseline gap-3 md:gap-6 min-w-0">
              <span className="font-primary font-bold text-xl md:text-3xl">
                {number}
              </span>
              <span
                className={cx(
                  'font-primary font-bold uppercase leading-[0.9]',
                  'text-[40px] md:text-[72px]',
                  'motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-2',
                )}
              >
                {project.shortName ?? project.name}
              </span>
            </span>

            <span className="flex items-center gap-6 shrink-0">
              <span className="hidden lg:flex gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-white border-2 border-black rounded-full py-1 px-4 font-secondary font-medium whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </span>
              <m.span
                aria-hidden
                className="grid place-items-center size-12 md:size-16 rounded-full bg-black text-white"
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 300, damping: 20 }
                }
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-6 md:size-7"
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
              </m.span>
            </span>
          </button>
        </h2>

        <AnimatePresence initial={false}>
          {isOpen && (
            <m.div
              id={panelId}
              key="panel"
              role="region"
              aria-label={project.name}
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.65, ease: PANEL_EASE }
              }
              style={{ overflow: isSettled ? 'visible' : 'hidden' }}
              onAnimationComplete={() => {
                if (!isOpen) return;
                setSettled(true);
                bringPanelIntoView();
              }}
            >
              <div
                className={cx(
                  GUTTER_CLASS,
                  'grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-5 pt-2 pb-14 md:pb-20',
                )}
              >
                {/* Same name on the project hero: the visual morphs into it. */}
                <ViewTransition name={`project-cover-${project.slug}`}>
                  <StickerImage
                    src={project.cover.src}
                    alt={project.cover.alt}
                    width={project.cover.width}
                    height={project.cover.height}
                    backColor={BRAND_HEX[project.stickerBack]}
                    // Same sizes as the project hero: the hero then reuses the
                    // cached file, so the morph lands on a painted image.
                    sizes={COVER_SIZES}
                    className="md:col-span-7 self-start"
                  />
                </ViewTransition>

                <div className="md:col-start-9 md:col-end-13 flex flex-col gap-4 font-secondary text-lg md:text-xl">
                  <p className="font-bold text-xl md:text-2xl">
                    {project.pitch}
                  </p>
                  {project.summary.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <p className="font-medium">
                    {project.role}
                    {project.year && ` · ${project.year}`} · Superhuit
                  </p>
                  <Button
                    label="View project"
                    href={`/work/${project.slug}`}
                    onClick={onLeave}
                    className="mt-4"
                  />
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </li>
    </ViewTransition>
  );
}
