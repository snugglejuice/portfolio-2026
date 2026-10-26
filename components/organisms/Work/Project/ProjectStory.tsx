import type { Project } from '@/app/work/projects';

function StoryColumn({
  title,
  paragraphs,
  className,
}: {
  title: string;
  paragraphs: string[];
  className: string;
}) {
  return (
    <div className={className}>
      <h2 className="font-primary uppercase font-bold text-5xl md:text-[64px] leading-none">
        {title}
      </h2>
      <div className="flex flex-col gap-4 mt-6 font-secondary text-xl md:text-2xl">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

export default function ProjectStory({ project }: { project: Project }) {
  return (
    <section className="bg-foreground rounded-3xl grid grid-cols-12 gap-x-5 gap-y-14 py-14 md:py-20">
      <StoryColumn
        title="The challenge"
        paragraphs={project.challenge}
        className="col-start-2 col-end-12 lg:col-end-6"
      />
      <StoryColumn
        title="My answer"
        paragraphs={project.answer}
        className="col-start-2 col-end-12 lg:col-start-7 lg:col-end-12"
      />
    </section>
  );
}
