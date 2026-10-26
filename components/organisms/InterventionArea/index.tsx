'use client';

import type Lenis from 'lenis';
import { useLenis } from 'lenis/react';
import {
  clamp,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  wrap,
} from 'motion/react';
import { useCallback, useEffect, useRef } from 'react';

// const CITIES = ['Lausanne', 'Geneva', 'Montreux', 'Vevey'];

const CITIES = [
  'Design systems',
  'Data-heavy dashboards',
  'Interaction design',
  'Animation',
  'Accessibility',
  'Performance',
  'Multilingual websites',
];

// Ambient right-to-left crawl speed, in px/s.
const BASE_SPEED = -32;
// How strongly scroll velocity pushes the crawl faster (or, on scroll up, reverses it).
const VELOCITY_MULTIPLIER = 1.5;
// Scroll-driven boosts are capped at ~4.5x the base speed so a hard flick can't blur the text.
const MAX_SPEED = Math.abs(BASE_SPEED) * 4.5;
// Max text skew, in degrees, reached at the same scroll intensity that saturates MAX_SPEED.
const MAX_SKEW_DEG = 15;
const SKEW_VELOCITY_RANGE = MAX_SPEED / VELOCITY_MULTIPLIER;

function Star() {
  return (
    <span
      className="font-primary text-[24px] font-semibold uppercase leading-normal relative -top-0.5"
      aria-hidden
    >
      ⭑
    </span>
  );
}

function CityList({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      className="flex gap-6 list-none font-primary text-[24px] font-semibold uppercase"
      aria-hidden={hidden || undefined}
    >
      {CITIES.map((city) => (
        <li key={city} className="flex gap-6 items-center">
          {city} <Star />
        </li>
      ))}
    </ul>
  );
}

function RibbonSegment({ duplicate }: { duplicate?: boolean }) {
  const Heading = duplicate ? 'p' : 'h2';

  return (
    <>
      <Heading
        className="font-primary text-[24px] font-semibold uppercase text-nowrap"
        aria-hidden={duplicate || undefined}
      >
        Service area
      </Heading>
      <Star />
      <CityList hidden={duplicate} />
    </>
  );
}

export default function InterventionArea() {
  const trackRef = useRef<HTMLDivElement>(null);
  const loopWidth = useRef(0);

  const x = useMotionValue(0);
  const rawVelocity = useMotionValue(0);
  const smoothVelocity = useSpring(rawVelocity, {
    stiffness: 400,
    damping: 40,
  });
  // Same spring-smoothed velocity driving speed, remapped to a skew angle:
  // scrolling down leans the text forward, scrolling up leans it back.
  const skewX = useTransform(
    smoothVelocity,
    [-SKEW_VELOCITY_RANGE, SKEW_VELOCITY_RANGE],
    [-MAX_SKEW_DEG, MAX_SKEW_DEG],
  );

  const prefersReducedMotion = useReducedMotion();

  const onLenisScroll = useCallback(
    (lenis: Lenis) => {
      rawVelocity.set(lenis.velocity * 10);
    },
    [rawVelocity],
  );
  useLenis(onLenisScroll);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      // The two copies aren't guaranteed to each be exactly half of
      // scrollWidth (rounding on the shared flex gap), so measure the
      // real distance between them directly to avoid a snap on wrap.
      const [firstCopy, secondCopy] = Array.from(
        track.children,
      ) as HTMLElement[];
      if (!firstCopy || !secondCopy) return;
      loopWidth.current = secondCopy.offsetLeft - firstCopy.offsetLeft;
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion || !loopWidth.current) return;

    const speed = clamp(
      -MAX_SPEED,
      MAX_SPEED,
      BASE_SPEED - smoothVelocity.get() * VELOCITY_MULTIPLIER,
    );

    const translateX = wrap(
      -loopWidth.current,
      0,
      x.get() + speed * (delta / 1000),
    );

    x.set(translateX);
  });

  if (prefersReducedMotion) {
    return (
      <section className="bg-green-brand py-2.5 px-7.5 rounded-full overflow-hidden">
        <div className="flex items-center gap-6 w-max">
          <RibbonSegment />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-green-brand py-2.5 px-7.5 rounded-full overflow-hidden">
      <motion.div
        ref={trackRef}
        style={{ x, skewX }}
        className="flex gap-6 w-max"
      >
        <div className="flex items-center gap-6 shrink-0">
          <RibbonSegment />
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <RibbonSegment duplicate />
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <RibbonSegment duplicate />
        </div>
      </motion.div>
    </section>
  );
}
