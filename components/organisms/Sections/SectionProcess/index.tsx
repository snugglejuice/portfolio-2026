'use client';

import cx from 'classnames';
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useRef } from 'react';
import { useIsDesktop } from '@/lib/useIsDesktop';
import ProcessCard from './ProcessCard';

interface StackLayout {
  // Vertical reveal per card, in rem, once stacked — small enough that only
  // the number + title row of the card behind stays visible.
  stepRem: number;
  // Extra room (in rem) above the tallest card's own height, so the stack
  // area never clips a card mid-animation.
  bufferRem: number;
}

// Below lg the title sits above the stack in the same pinned panel, so the
// cards (and their title rows) are smaller and stack tighter.
const STACK_LAYOUT_MOBILE: StackLayout = { stepRem: 3, bufferRem: 17 };
const STACK_LAYOUT_DESKTOP: StackLayout = { stepRem: 6, bufferRem: 24 };

function stackAreaHeightRem(
  total: number,
  { stepRem, bufferRem }: StackLayout,
) {
  return (total - 1) * stepRem + bufferRem;
}

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Strategy',
    benefits: [
      'Defining challenges and goals',
      'Audit of the existing website',
      'Competitor benchmark',
      'SEO strategy',
    ],
    color: 'yellow',
  },
  {
    number: '02',
    title: 'Design',
    benefits: ['Art direction', 'Wireframes', 'High-fidelity mockups'],
    color: 'blue',
  },
  {
    number: '03',
    title: 'Development',
    benefits: [
      'CMS setup',
      'Deployment',
      'WCAG AA accessibility compliance',
      'Performance',
    ],
    color: 'orange',
  },
  {
    number: '04',
    title: 'Reporting',
    benefits: [
      'Analytics setup',
      'Analytics dashboards',
      'Detailed reports',
      'Strategy adjustments',
      'Website optimisation',
    ],
    color: 'green',
  },
] as const;

interface StackedCardProps {
  step: (typeof PROCESS_STEPS)[number];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  layout: StackLayout;
}

function StackedCard({
  step,
  index,
  total,
  scrollYProgress,
  layout,
}: StackedCardProps) {
  // One extra phase is reserved at the end of the scroll range so the
  // fully-stacked group holds in place for a beat before the section
  // releases, instead of each card popping back to its own (far apart)
  // document-flow position individually.
  const phases = total + 1;
  const start = index / phases;
  const end = (index + 1) / phases;

  // Every card but the first starts below the visible stack area (clipped
  // by its overflow-hidden), so only card 1 shows on initial render — each
  // one then climbs up into its stacked slot during its own scroll phase.
  const areaHeightRem = stackAreaHeightRem(total, layout);
  const restTopRem = index * layout.stepRem;
  const initialOffsetRem = index === 0 ? 0 : areaHeightRem - restTopRem;
  const y = useTransform(
    scrollYProgress,
    [start, end],
    [`${initialOffsetRem}rem`, '0rem'],
  );

  // While a card is still waiting off-screen, every not-yet-revealed card
  // sits at the exact same clipped spot, so the soonest one to appear (the
  // lowest index) needs to be on top rather than the last one. Once a
  // card's own phase starts, switch to the normal ascending order so it
  // correctly climbs over the cards already stacked above it.
  const zIndex = useTransform(scrollYProgress, (progress) =>
    progress < start ? -index : index + 1,
  );

  return (
    <motion.div
      className="absolute inset-x-0"
      style={{
        top: `${restTopRem}rem`,
        zIndex,
        y,
      }}
    >
      <ProcessCard
        number={step.number}
        title={step.title}
        benefits={[...step.benefits]}
        color={step.color}
      />
    </motion.div>
  );
}

export default function SectionProcess() {
  const layout = useIsDesktop() ? STACK_LAYOUT_DESKTOP : STACK_LAYOUT_MOBILE;
  const driverRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: driverRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section className="section-process">
      <div
        ref={driverRef}
        style={{ height: `${(PROCESS_STEPS.length + 1) * 80}vh` }}
      >
        <div
          className={cx(
            'bg-foreground rounded-3xl py-8 md:py-20',
            'grid grid-cols-12 gap-x-5 gap-y-6 items-start content-start lg:content-normal',
            'sticky top-4 overflow-hidden h-[calc(100svh-32px)]',
          )}
        >
          <div className="col-start-2 col-end-12 lg:col-end-7">
            <h3 className="font-primary text-[40px] md:text-[64px] lg:text-[96px] uppercase font-bold leading-[0.9] md:leading-none">
              How I work in a team
            </h3>
            <p className="font-secondary text-base md:text-[24px] pt-3 md:pt-4">
              No bad surprises, no vague promises. I rely on a proven,
              transparent and collaborative method to bring ambitions to life.
            </p>
          </div>
          <div
            className="col-start-2 col-end-12 lg:col-start-8 relative"
            style={{
              height: `${stackAreaHeightRem(PROCESS_STEPS.length, layout)}rem`,
            }}
          >
            {PROCESS_STEPS.map((step, index) => (
              <StackedCard
                key={step.number}
                step={step}
                index={index}
                total={PROCESS_STEPS.length}
                scrollYProgress={scrollYProgress}
                layout={layout}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
