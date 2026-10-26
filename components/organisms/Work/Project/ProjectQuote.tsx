import type { Project } from '@/app/work/projects';

export default function ProjectQuote({
  quote,
}: {
  quote: NonNullable<Project['quote']>;
}) {
  return (
    <figure className="bg-foreground rounded-3xl grid grid-cols-12 gap-5 py-14 md:py-20">
      <blockquote className="col-start-2 col-end-12 font-primary uppercase font-bold text-4xl md:text-[64px] leading-[0.95]">
        “{quote.text}”
      </blockquote>
      <figcaption className="col-start-2 col-end-12 mt-6 font-secondary text-xl md:text-2xl">
        <b>{quote.author}</b>, {quote.role}
      </figcaption>
    </figure>
  );
}
