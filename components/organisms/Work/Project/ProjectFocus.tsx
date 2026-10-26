import cx from 'classnames';

import type { Project } from '@/app/work/projects';
import { BRAND_BG_CLASS } from '@/lib/brand';

export default function ProjectFocus({
  focus,
  color,
}: {
  focus: NonNullable<Project['focus']>;
  color: Project['color'];
}) {
  return (
    <section
      className={cx(
        'rounded-3xl border-2 border-black grid grid-cols-12 gap-x-5 gap-y-8 py-14 md:py-20',
        BRAND_BG_CLASS[color],
      )}
    >
      <p className="col-start-2 col-end-12 font-nav font-bold uppercase text-sm">
        Technical focus
      </p>
      <h2 className="col-start-2 col-end-12 lg:col-end-7 font-primary uppercase font-bold text-5xl md:text-[80px] leading-[0.9]">
        {focus.title}
      </h2>
      <div className="col-start-2 col-end-12 lg:col-start-8 lg:col-end-12 self-end flex flex-col gap-4 font-secondary text-xl md:text-2xl">
        {focus.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
