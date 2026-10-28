'use client';

import Image from 'next/image';
import cx from 'classnames';
import { motion } from 'motion/react';

import portrait from './portrait.png';

export default function HeroHomepage({
  ref,
  avatarRowRef,
  headingRef,
  paragraphRef,
}: {
  ref?: React.Ref<HTMLElement>;
  avatarRowRef?: React.Ref<HTMLDivElement>;
  headingRef?: React.Ref<HTMLHeadingElement>;
  paragraphRef?: React.Ref<HTMLParagraphElement>;
}) {
  return (
    <motion.header
      ref={ref}
      className={cx(
        // pt-32 keeps the content clear of the fixed navigation; min-h lets
        // the card grow instead of overlapping it on short viewports.
        'grid grid-cols-12 gap-5 min-h-[calc(100svh-32px)] items-center bg-foreground rounded-3xl text-black pt-32 pb-12 md:pb-16 origin-bottom',
      )}
      initial={{ scaleY: 0 }}
    >
      <div
        className={cx('col-start-2 col-end-12', 'flex flex-col gap-6 md:gap-8')}
      >
        <div ref={avatarRowRef} className={cx('flex gap-2 center pb-4')}>
          <Image
            src={portrait}
            alt="Marion Séminel"
            width={54}
            height={54}
            className={cx('w-13.5 h-13.5 rounded-full')}
          />
          <div className={cx('flex flex-col gap-0')}>
            <p className="font-secondary text-base md:text-lg font-bold">
              Marion Séminel
            </p>
            <p className="font-secondary text-base md:text-lg text-[#808080]">
              Design Engineer | 6 years of experience
            </p>
          </div>
        </div>
        <h1
          ref={headingRef}
          className="font-primary uppercase text-[clamp(44px,9vw,104px)] leading-[110%] text-center font-bold"
        >
          Design Engineer building beautiful, fast, data-heavy interfaces
        </h1>
        <p
          ref={paragraphRef}
          className="font-secondary text-xl md:text-2xl text-center"
        >
          I design and develop web solutions that are <b>fast</b>,{' '}
          <b>accessible</b> and <b>business-driven</b>. From strategy to
          development, every decision is made to accomplish a goal:
          <b>improve user experience, generate leads,...</b>.
        </p>
      </div>
    </motion.header>
  );
}
