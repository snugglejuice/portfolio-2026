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
        title="My three areas of expertise"
        introduction="A website without strategy or visibility brings no results. To turn your online presence into a real growth driver, I support you through every key stage of your digital project, from the first concept to bringing in qualified traffic."
        cta={{
          label: 'See my work',
          link: '/work',
        }}
        cards={[
          {
            title: 'Digital strategy',
            description:
              'I help you understand what exists today to build what comes next.',
            tags: [
              'User experience analysis',
              'Performance audit',
              'Digital presence audit',
              'Visibility & acquisition strategy',
            ],
          },
          {
            title: 'Digital strategy',
            description:
              'I help you understand what exists today to build what comes next.',
            tags: [
              'Showcase websites',
              'Online stores',
              'Web design Shopify',
              'Landing Page',
              'Chatbot setup',
              'Content structure',
              'Internal tools',
            ],
          },
          {
            title: 'Digital strategy',
            description:
              'I help you understand what exists today to build what comes next.',
            tags: [
              'SEO Local',
              'Organic search (SEO)',
              'A/B Testing',
              'Analytics setup',
              'Acquisition & conversion tracking',
              'Google Ads campaigns',
              'Visibility in AI search engines',
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
