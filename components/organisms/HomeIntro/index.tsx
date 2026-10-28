'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, type AnimationSequence } from 'motion/react';

import HeroHomepage from '@/components/organisms/Hero/HeroHomepage';
import SiteLoader from '@/components/organisms/SiteLoader';

// Module scope survives client-side navigations (but not a reload), so the
// loader plays at most once per page load. Only written in effects, so the
// server (where this module is shared across requests) never sets it.
let hasPlayedLoader = false;

// The loader only greets visitors who open the site on the homepage: the
// navigation entry describes the document actually loaded, and client-side
// navigations never add one, so arriving here from /work skips it.
function openedOnHomepage() {
  if (typeof window === 'undefined') return true;
  const [entry] = performance.getEntriesByType('navigation');
  return !entry || new URL(entry.name).pathname === '/';
}

export default function HomeIntro() {
  const [showLoader, setShowLoader] = useState(
    () => !hasPlayedLoader && openedOnHomepage(),
  );
  const loaderRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const avatarRowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const runIntroTimeline = () => {
      if (
        !heroRef.current ||
        !avatarRowRef.current ||
        !headingRef.current ||
        !paragraphRef.current
      )
        return;

      // Read from the DOM rather than the module flag: under Strict Mode the
      // effect runs twice, and the flag is already set on the second run
      // while the loader is still on screen.
      const loader = loaderRef.current;
      hasPlayedLoader = true;

      const sequence: AnimationSequence = [
        [heroRef.current, { scaleY: 1 }, { duration: 0.75, ease: 'easeInOut' }],
        [
          avatarRowRef.current,
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.45, ease: 'easeInOut' },
        ],
        [
          headingRef.current,
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.45, ease: 'easeInOut', at: '-0.35' },
        ],
        [
          paragraphRef.current,
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.45, ease: 'easeInOut', at: '-0.35' },
        ],
      ];
      if (loader) {
        sequence.unshift([
          loader,
          { opacity: 0 },
          { duration: 0.4, ease: 'easeOut', delay: 3 },
        ]);
      }

      animate(sequence).then(() => {
        setShowLoader(false);
      });
    };

    if (document.readyState === 'complete') {
      runIntroTimeline();
    } else {
      window.addEventListener('load', runIntroTimeline);
      return () => window.removeEventListener('load', runIntroTimeline);
    }
  }, []);

  return (
    <>
      {showLoader && <SiteLoader ref={loaderRef} />}
      <HeroHomepage
        ref={heroRef}
        avatarRowRef={avatarRowRef}
        headingRef={headingRef}
        paragraphRef={paragraphRef}
      />
    </>
  );
}
