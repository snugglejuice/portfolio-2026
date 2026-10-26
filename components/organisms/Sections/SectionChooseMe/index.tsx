'use client';

import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useRef } from 'react';
import cx from 'classnames';
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
    className: 'max-w-92',
    finalY: 190,
  },
  {
    title: 'PRODUCT MINDSET',
    description:
      'An interface isn’t done when it looks good. It’s done when people use it and the numbers move. I like working with clear metrics and seeing the impact of what I build.',
    color: 'blue',
    className: 'max-w-106',
    finalY: -64,
  },
  {
    title: 'Design meets code',
    description:
      'I can shape a feature in Figma, build it in TypeScript and own it all the way to production, without losing anything between the two.',
    color: 'green',
    className: 'max-w-92',
    finalY: 280,
  },
  {
    title: 'TEAM PLAY',
    description:
      'I work best close to designers, backend engineers and product people. I set front-end standards, share them, and care about building things together over the long term.',
    color: 'yellow',
    className: 'max-w-[320px]',
    finalY: -64,
  },
] as const;

interface SlideUpCardProps {
  card: (typeof CHOOSE_ME_CARDS)[number];
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

function SlideUpCard({
  card,
  index,
  total,
  scrollYProgress,
}: SlideUpCardProps) {
  const start = index / total;
  const end = (index + 1) / total;
  const y = useTransform(
    scrollYProgress,
    [start, end],
    [`${HIDDEN_Y_PX}px`, `${card.finalY}px`],
  );

  return (
    <motion.div style={{ y }}>
      <ChooseMeCard
        title={card.title}
        description={card.description}
        color={card.color}
        className={card.className}
      />
    </motion.div>
  );
}

export default function SectionChooseMe() {
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
            'rounded-3xl py-20 h-[calc(100vh-32px)]',
            'sticky top-4 overflow-hidden',
            'transition-all duration-500',
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
                'font-primary uppercase font-bold text-[96px]',
                'transition-all duration-500',
                {
                  'text-black': !isInView,
                  'text-foreground': isInView,
                },
              )}
            >
              Why choose me?
            </h2>
          </div>
          <div className="relative z-10 p-2 flex gap-4">
            {CHOOSE_ME_CARDS.map((card, index) => (
              <SlideUpCard
                key={card.title}
                card={card}
                index={index}
                total={CHOOSE_ME_CARDS.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
