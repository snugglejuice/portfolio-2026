'use client';

import cx from 'classnames';
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useRef } from 'react';
import ProcessCard from './ProcessCard';

// Vertical reveal per card, in rem, once stacked — small enough that only
// the number + title row of the card behind stays visible.
const STACK_STEP_REM = 6;
// Extra room (in rem) above the tallest card's own height, so the stack
// area never clips a card mid-animation.
const STACK_AREA_BUFFER_REM = 24;

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
}

function StackedCard({
  step,
  index,
  total,
  scrollYProgress,
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
  const areaHeightRem = (total - 1) * STACK_STEP_REM + STACK_AREA_BUFFER_REM;
  const restTopRem = index * STACK_STEP_REM;
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
        top: `${index * STACK_STEP_REM}rem`,
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
            'bg-foreground rounded-3xl py-20',
            'grid grid-cols-12 gap-5 items-start',
            'sticky top-4 overflow-hidden h-[calc(100vh-32px)]',
          )}
        >
          <div className="col-start-2 col-end-7">
            <h3 className="font-primary text-[96px] uppercase font-bold leading-none">
              Process & method
            </h3>
            <p className="font-secondary text-[24px] pt-4">
              No bad surprises, no vague promises. I rely on a proven,
              transparent and collaborative method to bring ambitions to life.
            </p>
          </div>
          <div
            className="col-start-8 col-end-12 relative"
            style={{
              height: `${(PROCESS_STEPS.length - 1) * STACK_STEP_REM + STACK_AREA_BUFFER_REM}rem`,
            }}
          >
            {PROCESS_STEPS.map((step, index) => (
              <StackedCard
                key={step.number}
                step={step}
                index={index}
                total={PROCESS_STEPS.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
