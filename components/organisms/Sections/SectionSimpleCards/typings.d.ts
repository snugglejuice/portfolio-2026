interface CardSimple {
  title: string;
  description: string;
  tags?: string[];
}

interface SectionSimpleCardsProps {
  title: string;
  introduction?: string;
  cta?: {
    label: string;
    link: string;
  };
  cards: CardSimple[];
}
