import cx from 'classnames';

import './styles.css';
import Question from './Question';

export default function SectionFAQ() {
  return (
    <section className="section-faq">
      <div
        className={cx(
          'bg-foreground p-10 flex flex-col gap-4 rounded-3xl',
          'grid grid-cols-12 gap-5 items-start py-20 px-0',
        )}
      >
        <h2
          className={cx(
            'font-primary font-bold text-[64px] uppercase leading-none',
            'col-start-2 col-end-6',
          )}
        >
          As my teacher used to say, there’s no such thing as a silly question
        </h2>
        <div
          className={cx(
            'col-start-7 col-end-12 relative',
            'flex flex-col gap-4',
          )}
        >
          <Question
            key="question-1"
            summary="How much does a website cost in Switzerland?"
            text="I’ve built websites and internal tools for companies in many
              fields: healthcare, finance, ERP. But my favourites are still
              museums, festivals, creators and entrepreneurs."
            color="blue"
          />
          <Question
            key="question-2"
            summary="How much does a website cost in Switzerland?"
            text="I’ve built websites and internal tools for companies in many
              fields: healthcare, finance, ERP. But my favourites are still
              museums, festivals, creators and entrepreneurs."
            color="green"
          />
          <Question
            key="question-3"
            summary="How much does a website cost in Switzerland?"
            text="I’ve built websites and internal tools for companies in many
              fields: healthcare, finance, ERP. But my favourites are still
              museums, festivals, creators and entrepreneurs."
            color="orange"
          />
          <Question
            key="question-4"
            summary="How much does a website cost in Switzerland?"
            text="I’ve built websites and internal tools for companies in many
              fields: healthcare, finance, ERP. But my favourites are still
              museums, festivals, creators and entrepreneurs."
            color="yellow"
          />
        </div>
      </div>
    </section>
  );
}
