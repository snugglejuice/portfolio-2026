'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import cx from 'classnames';
import * as m from 'motion/react-m';
import {
  animate,
  AnimatePresence,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { BRAND_HEX, type BrandColor } from '@/lib/brand';
import logo from './logo.png';
import SubmenuPanel, { type SubmenuItem } from './SubmenuPanel';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

interface NavItem {
  label: string;
  // No href = the page doesn't exist yet: rendered as a non-link.
  href?: string;
  submenu?: SubmenuItem[];
  // Colour of the sliding highlight while it sits on this item.
  color: BrandColor;
}

// Placeholder entries so the submenu interaction can be tested; none of
// these pages exist yet, so they stay without href.
const SERVICES_SUBMENU: SubmenuItem[] = [
  { label: 'Website design & build' },
  { label: 'Organic & paid search' },
  { label: 'Digital audit', badge: 'New' },
];

const NAV_ITEMS: NavItem[] = [
  // { label: 'Services', submenu: SERVICES_SUBMENU, color: 'blue' },
  { label: 'Projects', href: '/work', color: 'yellow' },
  { label: 'About', href: '/about', color: 'green' },
];

const SUBMENU_ID = 'nav-submenu';
// Grace period so the pointer can travel from the link to the panel.
const SUBMENU_CLOSE_DELAY = 180;
// Below this, the nav always shows (top of the page).
const HIDE_AFTER_PX = 120;

const HIGHLIGHT_SPRING = {
  type: 'spring',
  stiffness: 500,
  damping: 32,
} as const;

export default function Navigation() {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();

  const activeIndex = NAV_ITEMS.findIndex(
    (item) => item.href && pathname.startsWith(item.href),
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // The highlight follows the pointer, then falls back on the current page.
  const highlightedIndex =
    hoveredIndex ?? (activeIndex === -1 ? null : activeIndex);

  /** Sliding highlight: one element that moves, resizes and recolours */
  const pillRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const highlightX = useMotionValue(0);
  const highlightWidth = useMotionValue(0);
  const highlightColor = useMotionValue(BRAND_HEX.blue);
  const highlightOpacity = useMotionValue(0);
  const isHighlightShown = useRef(false);

  useEffect(() => {
    const place = (instant: boolean) => {
      if (highlightedIndex === null) {
        isHighlightShown.current = false;
        animate(highlightOpacity, 0, { duration: 0.15 });
        return;
      }
      const item = itemRefs.current[highlightedIndex];
      const pill = pillRef.current;
      if (!item || !pill) return;
      // Measured in the pill's padding box (where the highlight is laid
      // out); item.offsetLeft would be relative to the inner <ul> and miss
      // the pill's padding.
      const left =
        item.getBoundingClientRect().left -
        pill.getBoundingClientRect().left -
        pill.clientLeft;
      const width = item.offsetWidth;

      const color = BRAND_HEX[NAV_ITEMS[highlightedIndex].color];
      // Appearing from nothing (or resizing): snap into place rather than
      // sliding in from wherever it was last hidden.
      if (instant || prefersReducedMotion || !isHighlightShown.current) {
        highlightX.set(left);
        highlightWidth.set(width);
        highlightColor.set(color);
      } else {
        animate(highlightX, left, HIGHLIGHT_SPRING);
        animate(highlightWidth, width, HIGHLIGHT_SPRING);
        animate(highlightColor, color, { duration: 0.3, ease: 'easeOut' });
      }
      isHighlightShown.current = true;
      animate(highlightOpacity, 1, { duration: 0.15 });
    };
    place(false);

    // Re-measure when fonts load or the breakpoint changes the item sizes
    // (skipping the observer's initial call, which would cancel the slide).
    let isFirstCall = true;
    const observer = new ResizeObserver(() => {
      if (isFirstCall) isFirstCall = false;
      else place(true);
    });
    if (pillRef.current) observer.observe(pillRef.current);
    return () => observer.disconnect();
  }, [
    highlightedIndex,
    prefersReducedMotion,
    highlightX,
    highlightWidth,
    highlightColor,
    highlightOpacity,
  ]);

  /** Submenu */
  const [isSubmenuOpen, setSubmenuOpen] = useState(false);
  const closeTimer = useRef<number>(undefined);
  const lastPointerType = useRef<string>('');
  const submenuButtonRef = useRef<HTMLButtonElement>(null);

  const openSubmenu = () => {
    window.clearTimeout(closeTimer.current);
    setSubmenuOpen(true);
  };
  const scheduleSubmenuClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(
      () => setSubmenuOpen(false),
      SUBMENU_CLOSE_DELAY,
    );
  };

  useEffect(() => {
    if (!isSubmenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setSubmenuOpen(false);
      submenuButtonRef.current?.focus();
    };
    // Touch has no hover-out: any tap outside the nav closes it.
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target as Element).closest('[data-navigation]')) {
        setSubmenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isSubmenuOpen]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  /** Hide on scroll down, show again on scroll up */
  const [isHidden, setHidden] = useState(false);
  // A new page always opens at the top: show the nav again during the same
  // render (not in an effect), so the page-transition snapshot already has it.
  const [renderedPathname, setRenderedPathname] = useState(pathname);
  // Instant (not slid) after a page change, so it is in place on arrival.
  const [isRouteReset, setRouteReset] = useState(false);
  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setHidden(false);
    setRouteReset(true);
    setSubmenuOpen(false);
  }
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    const shouldHide = current > previous && current > HIDE_AFTER_PX;
    if (shouldHide && isSubmenuOpen) setSubmenuOpen(false);
    setHidden(shouldHide);
    setRouteReset(false);
  });

  return (
    <header
      data-navigation
      className={cx(
        'fixed top-0 inset-x-4 z-50 pointer-events-none',
        'flex items-center justify-between py-8',
        // Aligns with the 12-col grid of the page cards (col 2 → col 11).
        'px-4 md:px-[calc((100%_-_220px)/12_+_20px)]',
        // CSS rather than a motion animation: the transform is applied in
        // the very render that changes it, so a page-transition snapshot
        // taken right after never catches the nav half-way.
        !(prefersReducedMotion || isRouteReset) &&
          'transition-transform duration-[350ms] ease-[cubic-bezier(0.25,1,0.5,1)]',
      )}
      style={{
        // Own layer during page transitions (see globals.css): never faded.
        viewTransitionName: 'site-nav',
        transform: isHidden ? 'translateY(-110%)' : undefined,
      }}
    >
      <Link href="/" className="relative z-10 pointer-events-auto">
        <Image
          src={logo}
          alt="Home — Marion Séminel"
          width={40}
          height={40}
          // `priority` is deprecated in Next 16; the file is tiny (120px,
          // 3x the displayed size), so eager loading is all it needs.
          loading="eager"
          // Already sized for it: skip the srcset loader (lib/imageLoader.ts).
          unoptimized
        />
      </Link>

      <nav aria-label="Main navigation">
        <AnimatePresence>
          {isSubmenuOpen && (
            <SubmenuPanel
              id={SUBMENU_ID}
              items={SERVICES_SUBMENU}
              onPointerEnter={openSubmenu}
              onPointerLeave={scheduleSubmenuClose}
            />
          )}
        </AnimatePresence>

        <div
          ref={pillRef}
          className={cx(
            'relative z-10 pointer-events-auto p-1',
            'bg-white border-2 border-black rounded-full',
          )}
          onPointerLeave={() => setHoveredIndex(null)}
        >
          <m.span
            aria-hidden
            className="absolute top-1 bottom-1 left-0 rounded-full"
            style={{
              x: highlightX,
              width: highlightWidth,
              backgroundColor: highlightColor,
              opacity: highlightOpacity,
            }}
          />
          <ul className="relative flex items-center gap-1 md:gap-6">
            {NAV_ITEMS.map((item, index) => {
              const itemClassName = cx(
                'relative flex items-center justify-center h-11 md:h-[50px] px-3 md:px-5',
                'font-nav font-bold uppercase text-xs md:text-sm text-black whitespace-nowrap',
                'outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 rounded-full',
                { 'cursor-default': !item.href && !item.submenu },
              );
              const content = item.label;

              const sharedHandlers = {
                onPointerEnter: () => setHoveredIndex(index),
                onFocus: () => setHoveredIndex(index),
                onBlur: () => setHoveredIndex(null),
              };

              return (
                <li
                  key={item.label}
                  ref={(element) => {
                    itemRefs.current[index] = element;
                  }}
                >
                  {item.submenu ? (
                    <button
                      ref={submenuButtonRef}
                      type="button"
                      aria-expanded={isSubmenuOpen}
                      aria-controls={SUBMENU_ID}
                      className={cx(itemClassName, 'cursor-pointer')}
                      {...sharedHandlers}
                      onPointerEnter={(event) => {
                        lastPointerType.current = event.pointerType;
                        setHoveredIndex(index);
                        if (event.pointerType === 'mouse') openSubmenu();
                      }}
                      onPointerLeave={(event) => {
                        if (event.pointerType === 'mouse')
                          scheduleSubmenuClose();
                      }}
                      onPointerDown={(event) => {
                        lastPointerType.current = event.pointerType;
                      }}
                      onClick={() => {
                        // Mouse already opened it on hover: a click shouldn't
                        // close it under the cursor. Touch / keyboard toggle.
                        if (lastPointerType.current === 'mouse') openSubmenu();
                        else setSubmenuOpen((open) => !open);
                      }}
                    >
                      {content}
                    </button>
                  ) : item.href ? (
                    <Link
                      href={item.href}
                      aria-current={activeIndex === index ? 'page' : undefined}
                      className={itemClassName}
                      {...sharedHandlers}
                    >
                      {content}
                    </Link>
                  ) : (
                    <span
                      aria-disabled="true"
                      className={itemClassName}
                      {...sharedHandlers}
                    >
                      {content}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
