import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Lab | Marion Séminel',
  // Sandbox pages: not meant to be indexed.
  robots: { index: false, follow: false },
};

const EXPERIMENTS = [
  {
    href: '/lab/sticker-peel',
    title: 'Sticker peel',
    description:
      'The shader behind the /work visuals, with its lil-gui controls (peel, look, reveal).',
  },
  {
    href: '/lab/bhaasha',
    title: 'Bhaasha',
    description: 'WebGL blob that follows the cursor.',
  },
  {
    href: '/lab/debug',
    title: 'Debug',
    description: 'three.js test scene with a texture atlas.',
  },
];

export default function LabPage() {
  return (
    <main className="p-4 flex flex-col gap-4">
      <header className="bg-foreground rounded-3xl grid grid-cols-12 gap-5 pt-36 pb-12">
        <h1 className="col-start-2 col-end-12 font-primary uppercase font-bold leading-none text-[clamp(72px,12vw,160px)]">
          Lab
        </h1>
        <p className="col-start-2 col-end-12 font-secondary text-xl md:text-2xl max-w-2xl">
          Experiments and prototypes before they make it into the site.
        </p>
      </header>
      <ul className="grid md:grid-cols-3 gap-4">
        {EXPERIMENTS.map(({ href, title, description }) => (
          <li key={href}>
            <Link
              href={href}
              className="group bg-foreground rounded-3xl p-10 flex flex-col gap-4 h-full"
            >
              <h2 className="font-primary uppercase font-bold text-[48px] leading-none motion-safe:transition-transform motion-safe:group-hover:translate-x-2">
                {title} →
              </h2>
              <p className="font-secondary text-xl">{description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
