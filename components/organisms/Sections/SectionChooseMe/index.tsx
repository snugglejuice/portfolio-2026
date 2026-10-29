'use client';

import * as m from 'motion/react-m';
import {
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useRef } from 'react';
import cx from 'classnames';
import { useIsDesktop } from '@/lib/useIsDesktop';
import ChooseMeCard from './ChooseMeCard';

// Shared absolute starting offset for every card, regardless of its own
// final resting spot — large enough that even a card whose final position
// is already shifted up (negative finalY) stays fully clipped by the
// panel's overflow-hidden at rest.
const HIDDEN_Y_PX = 900;

const CHOOSE_ME_CARDS = [
  {
    title: '6+ years of experience',
    description: `I’ve built web apps and websites in many fields:
      fintech, healthcare, ERP. Data-heavy dashboards or brand
      websites for museums and festivals.`,
    color: 'orange',
    className: 'lg:max-w-92',
    finalY: 190,
    entryRotate: -6,
  },
  {
    title: 'PRODUCT MINDSET',
    description:
      'An interface isn’t done when it looks good. It’s done when people use it and the numbers move. I like working with clear metrics and seeing the impact of what I build.',
    color: 'blue',
    className: 'lg:max-w-106',
    finalY: -64,
    entryRotate: 5,
  },
  {
    title: 'Design meets code',
    description:
      'I can shape a feature in Figma, build it in TypeScript and own it all the way to production, without losing anything between the two.',
    color: 'green',
    className: 'lg:max-w-92',
    finalY: 280,
    entryRotate: -4,
  },
  {
    title: 'TEAM PLAY',
    description:
      'I work best close to designers, backend engineers and product people. I set front-end standards, share them, and care about building things together over the long term.',
    color: 'yellow',
    className: 'lg:max-w-[320px]',
    finalY: -64,
    entryRotate: 6,
  },
] as const;

interface SlideUpCardProps {
  card: (typeof CHOOSE_ME_CARDS)[number];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  isDesktop: boolean;
}

function SlideUpCard({
  card,
  index,
  total,
  scrollYProgress,
  isDesktop,
}: SlideUpCardProps) {
  const start = index / total;
  const end = (index + 1) / total;
  // Below lg the cards form a deck: each lands on the same spot, fully
  // covering the previous one, and straightens out from a tilt as it lands.
  // The pinned panel is shorter than 100svh, so starting one viewport down
  // keeps the card just out of sight and visibly moving for its whole phase.
  const y = useTransform(
    scrollYProgress,
    [start, end],
    isDesktop ? [`${HIDDEN_Y_PX}px`, `${card.finalY}px`] : ['100svh', '0svh'],
  );
  const rotate = useTransform(
    scrollYProgress,
    [start, end],
    [isDesktop ? 0 : card.entryRotate, 0],
  );

  return (
    <m.div className="col-start-1 row-start-1" style={{ y, rotate }}>
      <ChooseMeCard
        title={card.title}
        description={card.description}
        color={card.color}
        className={card.className}
      />
    </m.div>
  );
}

export default function SectionChooseMe() {
  const isDesktop = useIsDesktop();
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 'all' });
  const driverRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: driverRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section className="section-choose-me">
      <div
        ref={driverRef}
        style={{
          height: '300vh',
        }}
      >
        <div
          className={cx(
            'rounded-3xl py-10 md:py-20 h-[calc(100svh-32px)]',
            'sticky top-4 overflow-hidden',
            'transition-all duration-500',
            '2xl:flex 2xl:flex-col 2xl:justify-center',
            {
              'bg-foreground': !isInView,
              'bg-black': isInView,
            },
          )}
          ref={ref}
        >
          <div
            className={cx(
              'w-full h-full flex justify-center items-center',
              'absolute inset-0',
            )}
          >
            <h2
              className={cx(
                'font-primary uppercase font-bold text-[clamp(48px,12vw,96px)]',
                'leading-none text-center px-6',
                'transition-all duration-500',
                {
                  'text-black': !isInView,
                  'text-foreground': isInView,
                },
              )}
            >
              Why work with me?
            </h2>
          </div>
          <div
            className={cx(
              'relative z-10 h-full grid content-center px-4',
              'md:max-w-xl md:mx-auto',
              'lg:flex lg:content-normal lg:h-auto lg:gap-4 lg:p-2',
              'lg:max-w-none lg:mx-0',
              // The finalY offsets spread the cards from -64px to ~616px below
              // the row's top, so its visual center sits ~100px under the row's
              // own; shift up by that to center the composition in the panel.
              '2xl:justify-center 2xl:-top-25',
            )}
          >
            {CHOOSE_ME_CARDS.map((card, index) => (
              <SlideUpCard
                key={card.title}
                card={card}
                index={index}
                total={CHOOSE_ME_CARDS.length}
                scrollYProgress={scrollYProgress}
                isDesktop={isDesktop}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
