import { useSyncExternalStore } from 'react';

// Same breakpoint as Tailwind's `lg:` (64rem = 1024px).
const QUERY = '(min-width: 64rem)';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

/**
 * Whether the `lg:` layout is active, for scroll animations whose distances
 * are computed in JS. false during SSR / hydration (mobile-first), then live.
 */
export function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
