import Footer from '@/components/organisms/Footer';
import HomeIntro from '@/components/organisms/HomeIntro';
import InterventionArea from '@/components/organisms/InterventionArea';
import SectionChooseMe from '@/components/organisms/Sections/SectionChooseMe';
import SectionFAQ from '@/components/organisms/Sections/SectionFAQ';
import SectionProcess from '@/components/organisms/Sections/SectionProcess';
import SectionSimpleCards from '@/components/organisms/Sections/SectionSimpleCards';

export default function Home() {
  return (
    <main className="p-4 flex flex-col gap-4">
      <HomeIntro />
      <InterventionArea />
      <SectionSimpleCards
        title="What I bring to a team"
        introduction="I’m a front-end developer with a designer’s eye, currently lead developer at a Lausanne agency and looking for my next full-time role in Zurich. I work where design decisions meet engineering constraints, from the first prototype to production code that stays fast and maintainable."
        cta={{
          label: 'See my work',
          link: '/work',
        }}
        cards={[
          {
            title: 'Front-end engineering',
            description:
              'I build interfaces that scale with the product and the team behind it.',
            tags: [
              'React & Next.js',
              'TypeScript',
              'Front-end architecture',
              'Design systems',
              'Data-heavy web apps',
              'Code reviews & standards',
            ],
          },
          {
            title: 'Interaction & design',
            description:
              'I work with designers from the first concept to the final details.',
            tags: [
              'Interaction design',
              'Animation (GSAP, CSS)',
              'WebGL & shaders',
              'Prototyping',
              'User experience',
              'Figma to code',
            ],
          },
          {
            title: 'Quality & performance',
            description:
              'I care about the details people feel without noticing.',
            tags: [
              'Core Web Vitals',
              'Accessibility (WCAG)',
              'SEO foundations',
              'Analytics & A/B testing',
              'AI-assisted development',
            ],
          },
        ]}
      />
      <SectionProcess />
      <SectionChooseMe />
      {/* <SectionFAQ /> */}
      <Footer />
    </main>
  );
}
