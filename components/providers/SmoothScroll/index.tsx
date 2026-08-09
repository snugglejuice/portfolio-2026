'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import { cancelFrame, frame } from 'motion/react';
import { useEffect, useState } from 'react';

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

  if (!smoothScrollEnabled) {
    return children;
  }

  return (
    <ReactLenis root options={{ autoRaf: false, syncTouch: false }}>
      <LenisFrameSync />
      {children}
    </ReactLenis>
  );
}
