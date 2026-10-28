'use client';

import cx from 'classnames';

export default function SiteLoader({ ref }: { ref?: React.Ref<HTMLElement> }) {
  return (
    <section
      ref={ref}
      className={cx(
        'fixed inset-0 z-50 bg-background pointer-events-none',
        'grid grid-cols-12 gap-5 h-svh items-center',
      )}
    >
      <p className="font-primary text-4xl md:text-6xl font-bold uppercase col-start-2 col-end-12 md:col-end-11 text-foreground">
        Care for every design detail. <br />
        Optimise every line of code. <br />
        Turn every visit into an opportunity.
      </p>
    </section>
  );
}
