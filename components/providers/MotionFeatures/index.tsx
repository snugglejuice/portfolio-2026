'use client';

import { domAnimation, LazyMotion } from 'motion/react';

// Motion components are written as `m.*` (from 'motion/react-m'), not
// `motion.*`: they only carry the animation features loaded here
// (domAnimation) instead of the full motion component bundle (layout
// projection, drag…, none of it used here). `strict` throws if a `motion.*`
// component slips back in.
// Loaded synchronously on purpose: with async features, the homepage intro
// (imperative animate() on an m.header) could end up stuck on its initial
// scaleY(0).
export default function MotionFeatures({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
