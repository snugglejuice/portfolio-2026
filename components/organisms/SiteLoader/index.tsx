'use client';

import cx from 'classnames';

export default function SiteLoader({ ref }: { ref?: React.Ref<HTMLElement> }) {
  return (
    <section
      ref={ref}
      className={cx(
        'fixed inset-0 z-50 bg-background pointer-events-none',
        'grid grid-cols-12 gap-5 h-screen items-center',
      )}
    >
      <p className="font-primary text-6xl font-bold uppercase col-start-2 col-end-11 text-foreground">
        Soigner chaque détail du design. <br />
        Optimiser chaque ligne de code. <br />
        Transformer chaque visite en opportunité.
      </p>
    </section>
  );
}
