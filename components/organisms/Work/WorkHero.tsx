import cx from 'classnames';

export default function WorkHero({
  count,
  intro,
}: {
  count: number;
  intro: string;
}) {
  return (
    <header
      className={cx(
        'bg-foreground rounded-3xl grid grid-cols-12 gap-5',
        // Compact on purpose: the first tabs must peek above the fold.
        'min-h-[55vh] items-end pt-36 pb-10 md:pb-14',
      )}
    >
      <div className="col-start-2 col-end-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-16">
        <h1 className="font-primary uppercase font-bold leading-[0.82] text-[clamp(88px,17vw,248px)] flex items-start motion-safe:animate-rise motion-safe:[animation-delay:50ms]">
          Projects
          <span className="font-primary text-[0.28em] leading-none mt-[0.18em] ml-2">
            {String(count).padStart(2, '0')}
          </span>
        </h1>
        <p className="font-secondary text-xl md:text-2xl max-w-xl lg:pb-3 motion-safe:animate-rise motion-safe:[animation-delay:150ms]">
          {intro}
        </p>
      </div>
    </header>
  );
}
