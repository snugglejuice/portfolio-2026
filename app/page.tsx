import HomeIntro from '@/components/organisms/HomeIntro';
import InterventionArea from '@/components/organisms/InterventionArea';
import SectionChooseMe from '@/components/organisms/Sections/SectionChooseMe';
import SectionProcess from '@/components/organisms/Sections/SectionProcess';
import SectionSimpleCards from '@/components/organisms/Sections/SectionSimpleCards';

export default function Home() {
  return (
    <main className="p-4 flex flex-col gap-4">
      <HomeIntro />
      <InterventionArea />
      <SectionSimpleCards
        title="Mes trois expertises"
        introduction="Un site web sans stratégie ni visibilité ne génère aucun résultat. Pour faire de votre présence en ligne un véritable levier de croissance, je vous accompagne à chaque étape clé de votre projet digital, de la conception initiale jusqu’à l’acquisition de trafic qualifié."
        cta={{
          label: 'Parlons de votre projet',
          link: '#contact',
        }}
        cards={[
          {
            title: 'Stratégie digital',
            description:
              'Je vous aide à comprendre l’existant pour construire l’avenir.',
            tags: [
              'Analyse Expérience Utilisateur',
              'Audit de performance',
              'Audit de présence digital',
              'Création stratégie visibilité et acquisition',
            ],
          },
          {
            title: 'Stratégie digital',
            description:
              'Je vous aide à comprendre l’existant pour construire l’avenir.',
            tags: [
              'Création de site vitrine',
              'Boutique en ligne',
              'Web design Shopify',
              'Landing Page',
              'Mise en place de Chatbot',
              'Structure de contenu',
              'Outils interne',
            ],
          },
          {
            title: 'Stratégie digital',
            description:
              'Je vous aide à comprendre l’existant pour construire l’avenir.',
            tags: [
              'SEO Local',
              'Référencement Naturel',
              'A/B Testing',
              'Mise en place d’Analytics',
              'Suivi acquisition & conversion',
              'Référencement payant Google adwords',
              'Visibilité sur les moteurs IA',
            ],
          },
        ]}
      />
      <SectionProcess />
      <SectionChooseMe />
    </main>
  );
}
