import cx from 'classnames';

import Button from '@/components/atoms/button';
import './styles.css';

export default function SectionSimpleCards({
  title,
  introduction,
  cta,
  cards,
}: SectionSimpleCardsProps) {
  return (
    <section className="section-simple-cards">
      <div className="bg-foreground p-10 flex flex-col gap-4 rounded-3xl">
        <h2 className="font-primary font-bold text-[64px] uppercase leading-none">
          {title}
        </h2>
        <p className="font-secondary text-[24px] leading-none">
          {introduction}
        </p>
        {cta && <Button label={cta.label} href={cta.link} />}
      </div>
      {cards.map((card, index) => (
        <div
          key={card.title}
          className={cx(
            'p-10 flex flex-col gap-4 rounded-3xl overflow-hidden',
            {
              'bg-yellow-brand': index % 3 === 0,
              'bg-blue-brand': index % 3 === 1,
              'bg-orange-brand': index % 3 === 2,
            },
          )}
        >
          <h3 className="font-primary font-bold uppercase text-[32px] leading-[24px]">
            {card.title}
          </h3>
          <p className="font-secondary text-[24px] leading-normal">
            {card.description}
          </p>
          {card.tags && (
            <ul className="flex row flex-wrap gap-2">
              {card.tags.map((tag) => (
                <li
                  key={tag}
                  className="bg-white border-2 border-black rounded-full py-1 px-4 font-secondary font-medium min-w-max"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}
