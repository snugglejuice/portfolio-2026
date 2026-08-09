'use client';

import { useEffect, useRef, useState } from 'react';
import { animate } from 'motion/react';

import HeroHomepage from '@/components/organisms/Hero/HeroHomepage';
import SiteLoader from '@/components/organisms/SiteLoader';

export default function HomeIntro() {
  const [showLoader, setShowLoader] = useState(true);
  const loaderRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const avatarRowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const runIntroTimeline = () => {
      if (
        !loaderRef.current ||
        !heroRef.current ||
        !avatarRowRef.current ||
        !headingRef.current ||
        !paragraphRef.current
      )
        return;

      animate([
        [
          loaderRef.current,
          { opacity: 0 },
          { duration: 0.4, ease: 'easeOut', delay: 3 },
        ],
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
      ]).then(() => {
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
