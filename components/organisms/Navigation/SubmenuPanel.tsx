'use client';

import cx from 'classnames';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '@/lib/usePrefersReducedMotion';

export interface SubmenuItem {
  label: string;
  href?: string;
  badge?: string;
}

// Resting tilt from the Figma frame; the panel swings down to it from a
// vertical "folded up" position, pivoting on its top-right corner (pinned
// just off the viewport's top-right) like a sign hanging from a nail.
const RESTING_ROTATION = -6;
const FOLDED_ROTATION = 90;

interface SubmenuPanelProps {
  id: string;
  items: SubmenuItem[];
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export default function SubmenuPanel({
  id,
  items,
  onPointerEnter,
  onPointerLeave,
}: SubmenuPanelProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    // Viewport-wide clipping box (the header is inset by 16px and transformed,
    // so `fixed` can't be used): the card overhangs the right edge on
    // purpose, but must never widen the page.
    <div className="absolute -top-3 -inset-x-4 h-[700px] overflow-hidden pointer-events-none z-0">
      <motion.div
        id={id}
        className={cx(
          // Pivot ~100px above the viewport so, once tilted, the card's top
          // edge stays out of view and its body lands where Figma has it.
          'absolute -top-[88px] right-0 origin-top-right pointer-events-auto',
          'w-[calc(100%_-_16px)] md:w-[923px] h-[420px] md:h-[498px]',
          'bg-white border-3 border-black rounded-3xl',
          'flex flex-col justify-end items-start gap-2 p-6',
        )}
        initial={
          prefersReducedMotion
            ? { opacity: 0, rotate: RESTING_ROTATION }
            : { rotate: FOLDED_ROTATION }
        }
        animate={{ opacity: 1, rotate: RESTING_ROTATION }}
        exit={
          prefersReducedMotion
            ? { opacity: 0 }
            : {
                rotate: FOLDED_ROTATION,
                transition: { duration: 0.35, ease: [0.55, 0, 0.75, 0] },
              }
        }
        // Under-damped so it overshoots and settles, like a swinging sign.
        transition={
          prefersReducedMotion
            ? { duration: 0.2 }
            : { type: 'spring', stiffness: 120, damping: 11, mass: 0.8 }
        }
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        <ul className="flex flex-col gap-2">
          {items.map((item) => {
            const Tag = item.href ? 'a' : 'span';
            return (
              <li key={item.label} className="flex items-center gap-2">
                <Tag
                  {...(item.href
                    ? { href: item.href }
                    : { 'aria-disabled': true })}
                  className="font-primary font-bold uppercase text-black leading-normal text-xl md:text-4xl whitespace-nowrap"
                >
                  {item.label}
                </Tag>
                {item.badge && (
                  <span className="bg-[#f3551c] rounded px-2 font-primary font-bold uppercase text-white text-base leading-normal">
                    {item.badge}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}
