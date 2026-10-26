'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { cancelFrame, frame } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Drives Lenis off Motion's own frame scheduler instead of its default
// independent requestAnimationFrame loop, so scroll-linked motion values
// (SectionProcess, SectionChooseMe) update on the exact same tick as
// Lenis's eased scroll position — otherwise the two rAF loops can drift a
// frame apart and the stack/slide-up reveals visibly jitter, especially on
// mobile and high refresh-rate displays.
function LenisFrameSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const update = (data: { timestamp: number }) => lenis.raf(data.timestamp);
    frame.update(update, true);
    return () => cancelFrame(update);
  }, [lenis]);

  return null;
}

// Next scrolls the window to the top on navigation, but Lenis keeps its own
// target scroll (and trackpad momentum keeps feeding it), so it could glide
// the new page back down. On link navigations, snap Lenis itself to the top.
// Back/forward (popstate) is left alone so the browser restores the position.
function LenisRouteReset() {
  const lenis = useLenis();
  const pathname = usePathname();
  const isHistoryNavigation = useRef(false);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    const onPopState = () => {
      isHistoryNavigation.current = true;
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (pathname === previousPathname.current) return;
    previousPathname.current = pathname;
    if (isHistoryNavigation.current) {
      isHistoryNavigation.current = false;
      return;
    }
    lenis?.scrollTo(0, { immediate: true, force: true });
  }, [pathname, lenis]);

  return null;
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const [smoothScrollEnabled, setSmoothScrollEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => setSmoothScrollEnabled(!query.matches);

    syncPreference();
    query.addEventListener('change', syncPreference);
    return () => query.removeEventListener('change', syncPreference);
  }, []);

  // Lenis is rendered *beside* the page, not around it: in root mode it
  // publishes itself to a global store that useLenis falls back to. Wrapping
  // children only once the preference is known changed the tree shape and
  // remounted the whole page right after hydration.
  return (
    <>
      {smoothScrollEnabled && (
        <>
          <ReactLenis
            root
            options={{
              autoRaf: false,
              syncTouch: false,
              // Lenis re-measures the scroll limit when its content element
              // resizes. The default (<html>) is pinned to the viewport by
              // `h-full`, so it never resized: once the page grew (tab opened,
              // images loaded, navigation) the wheel stopped at the old limit
              // while the native scrollbar still went further. <body> grows
              // with the page. (Only rendered client-side, so document exists.)
              content: document.body,
              // Drops the current glide as soon as an internal link is clicked.
              stopInertiaOnNavigate: true,
            }}
          />
          <LenisFrameSync />
          <LenisRouteReset />
        </>
      )}
      {children}
    </>
  );
}
