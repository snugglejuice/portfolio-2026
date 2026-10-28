import type { Metadata } from 'next';
import cx from 'classnames';
import Image from 'next/image';

import Footer from '@/components/organisms/Footer';
import { BRAND_BG_CLASS, type BrandColor } from '@/lib/brand';
import StickerImage from '@/components/atoms/StickerImage';

export const metadata: Metadata = {
  title: 'About | Marion Séminel',
  description:
    'French Design Engineer based in Lausanne, Switzerland, moving to Zurich.',
};

const BIO = [
  'I design and build interfaces, from data-heavy web applications to brand websites. I started in maths and physics, then moved into design. I’m most at home where design decisions meet engineering constraints.',
  'Today I’m a lead developer at Superhuit, a digital agency in Lausanne. I own the front-end architecture, set the team’s standards and work with designers from the first concept to the final details.',
  'Before that, I spent three years at Ayomi, a fintech in Paris, where I owned the front-end and design of the web application and custom internal tools.',
  'I care about the details people feel without noticing: a page that loads instantly, an animation that explains instead of decorating, a form that stays clear when the data gets complicated. I also like to know whether it worked, so I’d rather build towards a clear metric than a guess.',
];

const LISTS: { title: string; items: string[]; color: BrandColor }[] = [
  {
    title: 'Capabilities',
    color: 'green',
    items: [
      'Interaction design & animation',
      'Front-end architecture',
      'Design systems',
      'User experience',
      'Accessibility & performance',
      'AI-assisted development',
    ],
  },
  {
    title: 'Currently learning',
    color: 'blue',
    items: ['Three.js', 'GLSL', 'German'],
  },
  {
    title: 'Outside work',
    color: 'orange',
    items: [
      'Badminton',
      'Running',
      'Illustration',
      'Game design',
      'Video Game',
      'Volunteering',
    ],
  },
];

const LINK_CLASS =
  'font-primary font-bold uppercase text-2xl md:text-3xl underline-offset-4 decoration-2 hover:underline';

export default function About() {
  return (
    <main className="p-4 flex flex-col gap-4">
      <header
        className={cx(
          'bg-foreground rounded-3xl grid grid-cols-12 gap-5',
          // pt-36 keeps the title clear of the fixed navigation.
          'min-h-[55vh] items-end pt-36 pb-10 md:pb-14',
        )}
      >
        <div className="col-start-2 col-end-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-16">
          <h1 className="font-primary uppercase font-bold leading-[0.82] text-[clamp(64px,11vw,176px)] motion-safe:animate-rise motion-safe:[animation-delay:50ms]">
            Marion
            <br />
            Séminel
          </h1>
          <p className="font-secondary text-xl md:text-2xl max-w-md lg:pb-3 motion-safe:animate-rise motion-safe:[animation-delay:150ms]">
            French Design Engineer based in Lausanne, Switzerland, moving to
            Zurich.
          </p>
        </div>
      </header>

      <section className="bg-foreground rounded-3xl grid grid-cols-12 gap-x-5 gap-y-10 py-14 md:py-20">
        <figure className="col-start-2 col-end-12 lg:col-end-6 relative aspect-4/5 rounded-3xl overflow-hidde">
          <StickerImage
            src="/about/portrait-1.webp"
            width={603}
            height={754}
            alt="Portrait - Marion Séminel"
            backColor="#ecc03a"
            sizes="50vw"
          />
        </figure>

        <div className="col-start-2 col-end-12 lg:col-start-7 lg:col-end-12 flex flex-col justify-between gap-10">
          <div className="flex flex-col gap-4 font-secondary text-xl md:text-2xl">
            {BIO.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-4 pt-8 border-t-2 border-black">
            <a
              href="https://www.linkedin.com/in/marion-s%C3%A9minel/"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              LinkedIn ↗
            </a>
            <a href="mailto:seminel.marion@gmail.com" className={LINK_CLASS}>
              E-mail ↗
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              Resume ↗
            </a>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {LISTS.map(({ title, items, color }) => (
          <div
            key={title}
            className={cx(
              'p-6 md:p-10 flex flex-col gap-6 rounded-3xl',
              BRAND_BG_CLASS[color],
            )}
          >
            <h2 className="font-primary font-bold uppercase text-[32px] leading-none">
              {title}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {items.map((item) => (
                <li
                  key={item}
                  className="bg-white border-2 border-black rounded-full py-1 px-4 font-secondary font-medium"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <Footer />
    </main>
  );
}
